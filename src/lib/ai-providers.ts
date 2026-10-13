/**
 * Chat providers for the website assistant. Groq and Gemini both speak the OpenAI
 * "chat completions" streaming format, so one small client covers them; Claude keeps its own SDK
 * path in the route. The route tries the configured providers in order and falls back to the next
 * one when a provider is rate-limited, down or has a bad key, so the assistant stays online.
 *
 * Environment (all optional; a provider is used only when its key is set):
 *   GROQ_API_KEY    + GROQ_MODEL    (default qwen/qwen3.8-27b)
 *   GEMINI_API_KEY  + GEMINI_MODEL  (default gemini-2.5-flash)
 *   ANTHROPIC_API_KEY + ANTHROPIC_MODEL
 *   AI_PROVIDER_ORDER  e.g. "groq,gemini,anthropic" (default)
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ProviderId = "groq" | "gemini" | "anthropic";

export type ProviderResult =
  | { ok: true; body: ReadableStream<Uint8Array> }
  | { ok: false; reason: "auth" | "rate" | "error" };

type CompatConfig = { id: ProviderId; url: string; key: string; model: string; extra?: Record<string, unknown> };

const TIMEOUT_MS = 30_000;

/** Providers that have a key, in the order they should be tried. */
export function configuredProviders(env: NodeJS.ProcessEnv = process.env): ProviderId[] {
  const has: Record<ProviderId, boolean> = {
    groq: Boolean(env.GROQ_API_KEY),
    gemini: Boolean(env.GEMINI_API_KEY),
    anthropic: Boolean(env.ANTHROPIC_API_KEY),
  };
  const order = (env.AI_PROVIDER_ORDER ?? "groq,gemini,anthropic")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is ProviderId => s === "groq" || s === "gemini" || s === "anthropic");
  return [...new Set(order)].filter((id) => has[id]);
}

/** Connection details for the two OpenAI-compatible providers. */
export function compatConfig(id: "groq" | "gemini", env: NodeJS.ProcessEnv = process.env): CompatConfig {
  if (id === "groq") {
    return {
      id,
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: env.GROQ_API_KEY ?? "",
      model: env.GROQ_MODEL || "qwen/qwen3.8-27b",
    };
  }
  return {
    id,
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    key: env.GEMINI_API_KEY ?? "",
    model: env.GEMINI_MODEL || "gemini-2.5-flash",
    // Short FAQ answers: keep Gemini 2.5's "thinking" off so it does not eat the token budget.
    extra: { reasoning_effort: "none" },
  };
}

const classify = (status: number): "auth" | "rate" | "error" =>
  status === 401 || status === 403 ? "auth" : status === 429 ? "rate" : "error";

/** Parses an OpenAI-style SSE stream into plain text deltas. */
async function* textDeltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const text = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (typeof text === "string" && text) yield text;
        } catch {
          /* partial or non-JSON keep-alive line */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function request(cfg: CompatConfig, system: string, messages: ChatMessage[], maxTokens: number, signal: AbortSignal, withExtra: boolean) {
  return fetch(cfg.url, {
    method: "POST",
    signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: cfg.model,
      stream: true,
      max_tokens: maxTokens,
      temperature: 0.3,
      messages: [{ role: "system", content: system }, ...messages],
      ...(withExtra ? cfg.extra : {}),
    }),
  });
}

/** Streams a reply from an OpenAI-compatible provider as plain text. */
export async function streamCompat(
  cfg: CompatConfig,
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
  signal: AbortSignal,
): Promise<ProviderResult> {
  let res: Response;
  try {
    res = await request(cfg, system, messages, maxTokens, signal, true);
    // A provider that rejects an optional parameter (400) gets one retry without it.
    if (res.status === 400 && cfg.extra) res = await request(cfg, system, messages, maxTokens, signal, false);
  } catch {
    return { ok: false, reason: "error" };
  }
  if (!res.ok || !res.body) {
    console.error(`[chat] ${cfg.id} HTTP ${res.status}`);
    return { ok: false, reason: classify(res.status) };
  }

  // Wait for the first piece of text so failures become a proper status instead of an empty 200.
  const deltas = textDeltas(res.body);
  let first: IteratorResult<string>;
  try {
    first = await deltas.next();
  } catch (error) {
    console.error(`[chat] ${cfg.id} stream failed:`, error);
    return { ok: false, reason: "error" };
  }
  if (first.done) return { ok: false, reason: "error" };

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(first.value));
        for (let r = await deltas.next(); !r.done; r = await deltas.next()) controller.enqueue(encoder.encode(r.value));
      } catch (error) {
        if (!signal.aborted) console.error(`[chat] ${cfg.id} stream interrupted:`, error);
      } finally {
        controller.close();
      }
    },
    cancel() {
      void deltas.return(undefined);
    },
  });
  return { ok: true, body };
}
