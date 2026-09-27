import { getCorpus } from "@/lib/rag/corpus";
import { search } from "@/lib/rag/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Dev-only retrieval debugger:
 *   GET /api/chat/search?q=hybrid+inverter&lang=en[&k=6][&full=1]
 * Returns the chunks the assistant would receive as context. 404 in production.
 */
export function GET(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });

  const params = new URL(req.url).searchParams;
  const q = (params.get("q") ?? "").slice(0, 1000);
  const lang = params.get("lang") === "bn" ? "bn" : "en";
  const k = Math.min(20, Math.max(1, Number(params.get("k")) || 6));
  const full = params.get("full") === "1";

  const corpus = getCorpus();
  const { lang: detected, hits } = search(q, { lang, k });
  return Response.json(
    {
      q,
      lang,
      detected,
      corpus: { total: corpus.length, en: corpus.filter((c) => c.lang === "en").length, bn: corpus.filter((c) => c.lang === "bn").length },
      hits: hits.map((h) => ({ id: h.id, score: h.score, title: h.title, url: h.url, text: full ? h.text : h.text.slice(0, 200) })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
