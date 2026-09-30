import Anthropic from "@anthropic-ai/sdk";
import { hasLocale, localeNames, type Locale } from "@/i18n/config";
import { search } from "@/lib/rag/search";
import { getSystemPrompt } from "./system-prompt";
import { allowGlobal, allowIp, clientIp } from "./rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * POST /api/chat  { messages: [{ role: "user" | "assistant", content: string }], lang: Locale }
 * -> 200 text/plain stream of the assistant's reply
 * -> 4xx/5xx JSON { error: "bad_request" | "too_long" | "rate_limited" | "ai_unavailable" | "ai_error" }
 */

// Claude Sonnet 5: fast, strong in Bangla, and the system prompt (~3k tokens)
// is above its 1,024-token cache minimum, so repeat turns read it at 0.1x.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const MAX_TOKENS = 700;
const MAX_HISTORY = 10;
const MAX_CHARS = 1000;
const MAX_BODY_BYTES = 24_000;

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 30_000 }));

const json = (status: number, error: string, headers?: HeadersInit) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store", ...headers } });

function parseMessages(body: unknown): { messages: Anthropic.MessageParam[]; lang: Locale } | "bad_request" | "too_long" {
  if (typeof body !== "object" || body === null) return "bad_request";
  const { messages, lang } = body as { messages?: unknown; lang?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return "bad_request";

  const clean: Anthropic.MessageParam[] = [];
  for (const m of messages.slice(-MAX_HISTORY)) {
    if (typeof m !== "object" || m === null) return "bad_request";
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return "bad_request";
    const text = content.trim();
    if (!text) continue;
    if (role === "user" && text.length > MAX_CHARS) return "too_long";
    // Our own earlier replies can run a little long; clip them rather than fail.
    clean.push({ role, content: role === "assistant" ? text.slice(0, MAX_CHARS) : text });
  }
  while (clean.length && clean[0].role !== "user") clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== "user") return "bad_request";
  return { messages: clean, lang: typeof lang === "string" && hasLocale(lang) ? lang : "en" };
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return json(503, "ai_unavailable");

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json(413, "too_long");

  if (!allowIp(clientIp(req.headers)) || !allowGlobal("all")) {
    return json(429, "rate_limited", { "Retry-After": "15" });
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json(400, "bad_request");
  }
  if (raw.length > MAX_BODY_BYTES) return json(413, "too_long");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, "bad_request");
  }
  const parsed = parseMessages(body);
  if (parsed === "bad_request") return json(400, "bad_request");
  if (parsed === "too_long") return json(413, "too_long");

  const messages = withRetrievedContext(parsed.messages, parsed.lang);

  const stream = getClient().messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Short FAQ-style answers: skip extended thinking for the lowest latency and cost.
      thinking: { type: "disabled" },
      system: [
        // Large, byte-stable block first and cached; the tiny per-request hint after it.
        { type: "text", text: getSystemPrompt(), cache_control: { type: "ephemeral" } },
        { type: "text", text: `Site language: ${localeNames[parsed.lang]} (${parsed.lang}).` },
      ],
      messages,
    },
    { signal: req.signal },
  );

  // Wait for the first event so API failures (bad key, overload) become a
  // proper status code instead of an empty 200 stream.
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error("[chat] Anthropic auth error - check ANTHROPIC_API_KEY");
      return json(503, "ai_unavailable");
    }
    if (error instanceof Anthropic.RateLimitError) return json(429, "rate_limited", { "Retry-After": "20" });
    if (error instanceof Anthropic.APIError) {
      console.error(`[chat] Anthropic API error ${error.status}:`, error.message);
    } else {
      console.error("[chat] request failed:", error);
    }
    return json(502, "ai_error");
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: Anthropic.MessageStreamEvent) => {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      };
      try {
        if (!first.done) emit(first.value);
        for (let r = await events.next(); !r.done; r = await events.next()) emit(r.value);
        if (process.env.NODE_ENV !== "production") {
          const { usage, stop_reason } = await stream.finalMessage();
          console.info(
            `[chat] ${MODEL} stop=${stop_reason} in=${usage.input_tokens} cache_read=${usage.cache_read_input_tokens ?? 0} cache_write=${usage.cache_creation_input_tokens ?? 0} out=${usage.output_tokens}`,
          );
        }
      } catch (error) {
        if (!req.signal.aborted) console.error("[chat] stream interrupted:", error);
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * RAG: find the site content most relevant to the latest question (plus the
 * previous one for follow-ups) and prepend it to the final user turn, so the
 * model answers from the website itself and can cite page links.
 */
function withRetrievedContext(messages: Anthropic.MessageParam[], lang: Locale): Anthropic.MessageParam[] {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => (typeof m.content === "string" ? m.content : ""));
  const question = userTexts.at(-1) ?? "";
  // The search index holds English and Bangla chunks; other languages search the English ones.
  const { hits } = search(question, { lang: lang === "bn" ? "bn" : "en", k: 6, context: userTexts.at(-2) });
  const context = hits.length
    ? hits.map((h, i) => `[${i + 1}] ${h.title} — ${h.url}\n${h.text}`).join("\n\n")
    : "(no matching website content)";
  const grounded =
    `<context>\n${context}\n</context>\n\n` +
    "Answer the question below using ONLY the website content in <context> and the company overview. " +
    "If the answer is not there, say so briefly and suggest the Measurement Form (/" + lang + "/quote) or WhatsApp. " +
    "Never invent prices, stock or guarantees. Reply in the user's language. " +
    "End with one line 'Sources:' listing 1-3 relevant pages as markdown links using only URLs from <context>.\n\n" +
    `Question: ${question}`;
  const out = [...messages];
  for (let i = out.length - 1; i >= 0; i--) {
    if (out[i].role === "user") {
      out[i] = { role: "user", content: grounded };
      break;
    }
  }
  return out;
}
