import "server-only";
import { getCorpus, type Chunk, type Lang } from "./corpus";

/*
 * Dependency-free BM25 retriever over the site corpus (see corpus.ts).
 * Handles English (lowercase, punctuation stripped, light plural stemming) and
 * Bangla (Bengali-script words, "।" and other punctuation as separators,
 * Bangla digits -> ASCII, light suffix stripping).
 */

export type Hit = Chunk & { score: number };

const K1 = 1.2;
const B = 0.75;

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

const EN_STOP = new Set(
  "a an the and or of to in on at for from by with is are was were be been do does did can could would should will i me my you your we our us it its this that these those what which who how when where why there here have has had any some about please tell know need want get give not no yes also just more most than then".split(" "),
);
const BN_STOP = new Set(
  ["কি", "কী", "ও", "এবং", "আর", "এর", "এই", "সেই", "কোন", "কোনো", "আমি", "আমার", "আমাদের", "আপনি", "আপনার", "আপনাদের", "তুমি", "হয়", "হবে", "হচ্ছে", "করে", "করা", "করতে", "জন্য", "কেমন", "কখন", "কোথায়", "কেন", "কিভাবে", "কীভাবে", "দিয়ে", "থেকে", "না", "টি", "টা", "যে", "সাথে", "সঙ্গে", "বলুন", "চাই", "আছে", "নেই"].map((w) => w.normalize("NFC")),
);
// Longest first. Stripped at most twice, so "ইনভার্টারের" and "ইনভার্টার" meet at the same stem.
const BN_SUFFIXES = ["গুলোর", "গুলো", "গুলি", "দের", "টির", "টার", "েরা", "ের", "রা", "তে", "টি", "টা", "কে", "য়", "র", "ে"].map((s) => s.normalize("NFC"));

function stemEn(w: string): string {
  if (w.length <= 3 || !/^[a-z]+$/.test(w)) return w;
  if (w.endsWith("ies") && w.length > 4) return `${w.slice(0, -3)}y`;
  if (/(sses|xes|ches|shes|zes)$/.test(w)) return w.slice(0, -2);
  if (w.endsWith("s") && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
  return w;
}

function stemBn(w: string): string {
  let out = w;
  for (let round = 0; round < 2; round++) {
    const suf = BN_SUFFIXES.find((s) => out.endsWith(s) && [...out].length - [...s].length >= 2);
    if (!suf) break;
    out = out.slice(0, -suf.length);
  }
  return out;
}

const isBn = (w: string) => /[ঀ-৿]/.test(w);

/** Text -> normalised search tokens (shared by the index and queries). */
export function tokenize(text: string): string[] {
  const norm = text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[‌‍]/g, "")
    // Keep a-z, digits and Bengali letters/signs; everything else (incl. "।", "॥", "৳") separates words.
    .replace(/[^a-z0-9ঀ-ৣৰৱ]+/g, " ");
  const out: string[] = [];
  for (const raw of norm.split(" ")) {
    if (!raw) continue;
    if (isBn(raw)) {
      if (BN_STOP.has(raw)) continue;
      const s = stemBn(raw);
      if ([...s].length >= 2) out.push(s);
    } else {
      if (EN_STOP.has(raw)) continue;
      if (raw.length < 2 && !/\d/.test(raw)) continue;
      out.push(stemEn(raw));
    }
  }
  return out;
}

/** "bn" when the text has more Bengali letters than Latin ones, "en" when it has Latin, else null. */
export function detectLang(text: string): Lang | null {
  const bnCount = (text.match(/[ঀ-৿]/g) ?? []).length;
  const enCount = (text.match(/[a-zA-Z]/g) ?? []).length;
  if (!bnCount && !enCount) return null;
  return bnCount > enCount ? "bn" : "en";
}

type Doc = { chunk: Chunk; tf: Map<string, number>; len: number; title: string[] };
type Index = { docs: Doc[]; df: Map<string, number>; avgLen: number };

let index: Index | null = null;

function getIndex(): Index {
  if (index) return index;
  const docs: Doc[] = getCorpus().map((chunk) => {
    const title = tokenize(chunk.title);
    // Title words count twice in the body so short sections with a telling title still rank.
    const tokens = [...title, ...tokenize(chunk.text)];
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tf, len: tokens.length, title };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = docs.reduce((n, d) => n + d.len, 0) / Math.max(1, docs.length);
  index = { docs, df, avgLen };
  return index;
}

export type SearchOptions = {
  /** Site language, used when the query itself has no letters. */
  lang?: Lang;
  /** Max results (default 6). */
  k?: number;
  /** Earlier context (e.g. the previous user message) searched at half weight. */
  context?: string;
};

/** Top-k chunks for a query, best first. Near-zero matches are dropped. */
export function search(query: string, opts: SearchOptions = {}): { lang: Lang; hits: Hit[] } {
  const { docs, df, avgLen } = getIndex();
  const lang = detectLang(query) ?? (opts.context ? detectLang(opts.context) : null) ?? opts.lang ?? "en";
  const k = opts.k ?? 6;

  // Query term weights: current message 1.0, context 0.5 (max wins).
  const weights = new Map<string, number>();
  for (const t of tokenize(opts.context ?? "")) weights.set(t, 0.5);
  const qTokens = tokenize(query);
  for (const t of qTokens) weights.set(t, 1);
  if (!weights.size) return { lang, hits: [] };

  const N = docs.length;
  const idf = new Map<string, number>();
  for (const t of weights.keys()) {
    const n = df.get(t) ?? 0;
    idf.set(t, Math.log(1 + (N - n + 0.5) / (n + 0.5)));
  }

  // Model-like tokens (letters + digits, e.g. "sh10rt", "neg9r") and adjacent word pairs
  // ("tiger neo") earn an exact-match boost when they appear in a chunk title.
  const models = qTokens.filter((t) => /[a-z]/.test(t) && /\d/.test(t) && t.length >= 3);
  const pairs = qTokens.slice(1).map((t, i) => `${qTokens[i]} ${t}`);
  const uniqueQ = [...new Set(qTokens)];

  const scored: Hit[] = [];
  for (const d of docs) {
    let score = 0;
    for (const [t, w] of weights) {
      const f = d.tf.get(t);
      if (!f) continue;
      score += w * (idf.get(t) ?? 0) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgLen)));
    }
    if (score <= 0) continue;

    if (uniqueQ.length) {
      const titleSet = new Set(d.title);
      const inTitle = uniqueQ.filter((t) => titleSet.has(t)).length;
      score *= 1 + 0.3 * (inTitle / uniqueQ.length);
      const titleStr = ` ${d.title.join(" ")} `;
      if (models.some((m) => titleSet.has(m)) || pairs.some((p) => titleStr.includes(` ${p} `))) score *= 1.5;
    }
    if (d.chunk.lang === lang) score *= 1.25;
    scored.push({ ...d.chunk, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored[0]?.score ?? 0;
  const seen = new Set<string>();
  const hits: Hit[] = [];
  for (const h of scored) {
    if (hits.length >= k) break;
    if (h.score < Math.max(0.5, top * 0.2)) break;
    // The same section in the other language adds nothing.
    if (seen.has(h.key)) continue;
    seen.add(h.key);
    hits.push({ ...h, score: Math.round(h.score * 100) / 100 });
  }
  return { lang, hits };
}
