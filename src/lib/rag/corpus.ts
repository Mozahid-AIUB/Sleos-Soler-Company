import "server-only";
import en from "@/i18n/dictionaries/en";
import bn from "@/i18n/dictionaries/bn";
import * as siteModule from "@/content/site";
import * as catalogModule from "@/content/products";
import * as projectsModule from "@/content/projects";
import * as testimonialsModule from "@/content/testimonials";
import { assistantKnowledge } from "@/content/assistant-knowledge";

/*
 * Search corpus for the website assistant (RAG). Built once per server process
 * from the site's own content, so the index is always in sync with what the
 * pages show: edit the content files, redeploy, done.
 *
 * Every source is read defensively (content files are edited by hand and
 * products.ts in particular changes shape from time to time): missing fields
 * are skipped, never thrown on.
 */

export type Lang = "en" | "bn";

export type Chunk = {
  /** `${lang}:${key}` — unique. */
  id: string;
  /** Same for the en and bn version of one piece of content (used to de-duplicate hits). */
  key: string;
  lang: Lang;
  title: string;
  /** Site path, e.g. /en/support. */
  url: string;
  text: string;
};

type Loose = Record<string, unknown>;

const LANGS: Lang[] = ["en", "bn"];
const MIN_WORDS = 60;
const MAX_WORDS = 220;

const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** A plain string, or the `lang` (falling back to `en`) side of a Localized value. */
function loc(v: unknown, lang: Lang): string {
  if (typeof v === "string") return clean(v);
  if (typeof v === "number") return String(v);
  if (isObj(v)) return loc(v[lang] ?? v.en, lang);
  return "";
}

/** Like `loc`, for Localized<string[]> or plain arrays. */
function locList(v: unknown, lang: Lang): string[] {
  const raw = isObj(v) ? (v[lang] ?? v.en) : v;
  return Array.isArray(raw) ? raw.map((x) => loc(x, lang)).filter(Boolean) : [];
}

/** Reads a dotted path from an object; undefined when any step is missing. */
function at(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const k of path.split(".")) {
    if (!isObj(cur)) return undefined;
    cur = cur[k];
  }
  return cur;
}

/** Flattens a value into sentences: strings, arrays and {title,text}/{q,a}/{h,p}-style objects. */
function flat(v: unknown): string[] {
  if (typeof v === "string") return v.trim() ? [clean(v)] : [];
  if (typeof v === "number") return [String(v)];
  if (Array.isArray(v)) {
    // Short string lists (flows, option lists) read better on one line.
    if (v.every((x) => typeof x === "string") && v.join(" ").length < 400) {
      const items = v.map((x) => clean(String(x))).filter(Boolean);
      return items.length ? [items.join(", ")] : [];
    }
    return v.flatMap(flat);
  }
  if (isObj(v)) {
    const values = Object.values(v);
    // A record of plain values ({title, text}, {q, a}, {value, label} …) is one line;
    // a record of records (e.g. solutions.items) is one line per entry.
    const leafy = values.every((x) => typeof x !== "object" || x === null || (Array.isArray(x) && x.every((y) => typeof y === "string")));
    const parts = values.flatMap(flat);
    return leafy ? (parts.length ? [parts.join(": ")] : []) : parts;
  }
  return [];
}

/** Sentences from several dictionary paths (missing paths are skipped). */
const pick = (dict: unknown, ...paths: string[]) => paths.flatMap((p) => flat(at(dict, p)));

/**
 * Packs text parts into chunks of at most MAX_WORDS words; a trailing chunk
 * shorter than MIN_WORDS is merged into the previous one.
 */
function pack(parts: string[]): string[] {
  const out: string[][] = [];
  let cur: string[] = [];
  let n = 0;
  for (const part of parts.filter(Boolean)) {
    const w = words(part);
    if (cur.length && n + w > MAX_WORDS) {
      out.push(cur);
      cur = [];
      n = 0;
    }
    cur.push(part);
    n += w;
  }
  if (cur.length) {
    const prev = out[out.length - 1];
    if (prev && n < MIN_WORDS && words(prev.join(" ")) + n <= MAX_WORDS * 1.3) prev.push(...cur);
    else out.push(cur);
  }
  return out.map((c) => c.join("\n"));
}

class Builder {
  chunks: Chunk[] = [];
  private seen = new Set<string>();

  /** Adds one logical section; long sections become several chunks (key-2, key-3 …). */
  add(lang: Lang, key: string, title: string, url: string, parts: string[]) {
    const texts = pack(parts.map(clean).filter(Boolean));
    texts.forEach((text, i) => {
      let k = i === 0 ? key : `${key}-${i + 1}`;
      while (this.seen.has(`${lang}:${k}`)) k += "_";
      this.seen.add(`${lang}:${k}`);
      this.chunks.push({ id: `${lang}:${k}`, key: k, lang, title: clean(title) || key, url, text });
    });
  }
}

/* ------------------------------------------------------------------ */
/* Dictionaries (page copy)                                            */
/* ------------------------------------------------------------------ */

function dictionaryChunks(b: Builder, lang: Lang, d: unknown) {
  const L = `/${lang}`;
  const s = (p: string) => loc(at(d, p), lang);
  const t = (...paths: string[]) => paths.map(s).find(Boolean) ?? "";

  // Home page
  b.add(lang, "home-hero", t("hero.titleA") ? `${s("hero.titleA")} ${s("hero.titleB")}` : "OSLEOS", L, [
    ...pick(d, "meta.title", "hero.eyebrow", "hero.sub", "meta.description", "hero.stats", "stats.items", "nav.utility", "footer.about"),
  ]);
  b.add(lang, "home-intro", t("intro.title", "intro.eyebrow"), L, pick(d, "intro.eyebrow", "intro.body", "intro.missionTitle", "intro.mission", "intro.badges", "intro.floatValue", "intro.floatLabel"));

  // Products overview
  b.add(lang, "products-overview", t("pages.products.title", "categories.title"), `${L}/products`, [
    ...pick(d, "pages.products.body", "categories.title", "categories.body", "featured.title", "featured.body", "product.quoteNote", "product.priceOnRequest"),
  ]);

  // Solutions
  b.add(lang, "solutions-overview", t("pages.solutions.title", "solutions.title"), `${L}/solutions`, pick(d, "pages.solutions.body", "solutions.title", "solutions.body", "solutions.items"));
  const systems = at(d, "solutions.systems");
  if (Array.isArray(systems)) {
    const yes = s("solutions.yes") || "Yes";
    const no = s("solutions.no") || "No";
    const parts = systems.filter(isObj).map((sys) =>
      [
        `${loc(sys.name, lang)}: ${loc(sys.text, lang)}`,
        Array.isArray(sys.flow) ? sys.flow.map((x) => loc(x, lang)).join(" -> ") : "",
        `${s("solutions.idealFor") || "Ideal for"}: ${loc(sys.ideal, lang)}`,
        typeof sys.backup === "boolean" ? `${s("solutions.outage") || "Works during outages"}: ${sys.backup ? yes : no}` : "",
      ]
        .filter(Boolean)
        .join(". "),
    );
    b.add(lang, "solutions-systems", t("solutions.systemsTitle") || "On-grid, off-grid or hybrid", `${L}/solutions`, parts);
  }
  b.add(lang, "solutions-applications", t("solutions.applicationsTitle"), `${L}/solutions`, pick(d, "solutions.applicationsBody", "solutions.applications"));
  b.add(lang, "solutions-package", t("solutions.packageTitle"), `${L}/solutions`, pick(d, "solutions.packageBody", "solutions.package"));

  // Process (shown on home, solutions and contact pages)
  b.add(lang, "process", t("process.title"), `${L}/solutions`, pick(d, "process.body", "process.steps"));

  // Partners
  const catalogBrands = (catalogModule as Loose).brands;
  b.add(lang, "partners", t("partners.title"), `${L}/about`, [
    ...pick(d, "partners.body", "partners.brandsNote"),
    Array.isArray(catalogBrands) && catalogBrands.length ? `${s("featured.title") || "Brands"}: ${catalogBrands.map((x) => loc(x, lang)).join(", ")}` : "",
  ]);

  // Projects page header
  b.add(lang, "projects-overview", t("pages.projects.title", "projects.title"), `${L}/projects`, pick(d, "pages.projects.body", "projects.title", "projects.body"));

  // About page
  b.add(lang, "about-story", t("pages.about.title"), `${L}/about`, pick(d, "pages.about.body", "pages.about.storyTitle", "pages.about.story", "pages.about.missionTitle", "intro.mission", "pages.about.approachTitle", "pages.about.approach"));
  b.add(lang, "about-why", t("pages.about.whyTitle", "pages.about.whyEyebrow"), `${L}/about`, pick(d, "pages.about.whyEyebrow", "pages.about.why", "pages.about.valuesTitle", "pages.about.values"));
  const certs = at(siteModule, "site.certifications");
  b.add(lang, "about-ecosystem", t("pages.about.ecosystemTitle"), `${L}/about`, [
    ...pick(d, "pages.about.ecosystemEyebrow", "pages.about.ecosystemBody", "pages.about.ecosystem"),
    Array.isArray(certs) ? `${s("pages.about.certTitle") || "Certifications"}: ${certs.map((c) => loc(c, lang)).join(", ")}` : "",
  ]);

  // Contact page copy (numbers etc. come from site.ts, see contactChunk)
  b.add(lang, "contact-page", t("pages.contact.title", "contact.title"), `${L}/contact`, [
    ...pick(d, "pages.contact.body", "contact.body", "contact.sheetTitle", "contact.sheetBody"),
    ...(Array.isArray(at(d, "contact.types")) ? [`${s("contact.projectType")}: ${flat(at(d, "contact.types")).join(", ")}`] : []),
  ]);

  // Information Sheet / quote
  const f = at(d, "quote.f");
  const field = (label: string, options?: string) => {
    const l = loc(at(f, label), lang);
    const o = options ? flat(at(f, options)).join(", ") : "";
    return l ? (o ? `${l}: ${o}` : l) : "";
  };
  b.add(lang, "quote-sheet", t("quote.title"), `${L}/quote`, [
    ...pick(d, "quote.eyebrow", "quote.body", "quote.note", "quote.asideTitle"),
    flat(at(d, "quote.steps")).join(" · "),
    ...[
      field("projectType", "types"),
      field("system", "systems"),
      field("billAmount"),
      field("consumption"),
      field("load", "loadUnits"),
      field("hoursPerDay"),
      field("appliances"),
      field("appliancesHint"),
      field("area", "areaUnits"),
      field("roofType", "roofTypes"),
      field("backup"),
      field("backupHours"),
      field("priorityLoads"),
      field("existing", "existings"),
      field("timeline", "timelines"),
    ],
    ...pick(d, "quote.doneBody"),
  ]);
  b.add(lang, "quote-why", t("quote.asideTitle", "quote.title"), `${L}/quote`, pick(d, "quote.why", "contact.sheetBody"));

  // Support
  b.add(lang, "support-warranty", t("support.afterTitle", "support.title"), `${L}/support`, pick(d, "support.title", "support.body", "support.afterTitle", "support.after", "support.hotlineTitle", "support.hotlineBody"));
  b.add(lang, "support-guardian", t("support.guardianTitle", "support.guardianEyebrow"), `${L}/support`, pick(d, "support.guardianEyebrow", "support.guardianBody", "support.guardian", "support.ctaTitle", "support.ctaBody"));
  b.add(lang, "support-process", t("support.processTitle"), `${L}/support`, pick(d, "support.processEyebrow", "support.process"));
  const faq = at(d, "support.faq");
  if (Array.isArray(faq)) {
    faq.filter(isObj).forEach((qa, i) => {
      const q = loc(qa.q, lang);
      const a = loc(qa.a, lang);
      if (q && a) b.add(lang, `faq-${i + 1}`, q, `${L}/support`, [`${s("support.faqTitle")}: ${q}`, a]);
    });
  }

  // Sustainability
  b.add(lang, "incentive", t("incentive.pageTitle", "incentive.title"), `${L}/incentive`, pick(d, "incentive.title", "incentive.body", "incentive.facts", "incentive.benefits", "incentive.why", "incentive.quoteBody", "incentive.note"));
  b.add(lang, "sustainability-intro", t("sustainability.introTitle", "sustainability.title"), `${L}/sustainability`, pick(d, "sustainability.title", "sustainability.body", "sustainability.introTitle", "sustainability.intro"));
  b.add(lang, "sustainability-impact", t("sustainability.impactTitle"), `${L}/sustainability`, pick(d, "sustainability.impactTitle", "sustainability.impact", "sustainability.impactNote"));
  b.add(lang, "sustainability-pillars", t("sustainability.pillarsTitle"), `${L}/sustainability`, pick(d, "sustainability.pillars", "sustainability.quote", "sustainability.ctaBody"));

  // Legal pages: one section list per page, packed to chunk size
  const legal: [string, string][] = [
    ["privacy", "privacy"],
    ["terms", "legal"],
    ["security", "security"],
  ];
  for (const [key, route] of legal) {
    const sections = at(d, `legal.${key}.sections`);
    const parts = Array.isArray(sections)
      ? sections.filter(isObj).map((sec) => `${loc(sec.h, lang)}: ${flat(sec.p).join(" ")}`)
      : [];
    b.add(lang, `legal-${key}`, t(`legal.${key}.title`), `${L}/${route}`, [s(`legal.${key}.body`), ...parts]);
  }
  b.add(lang, "legal-contacts", t("legal.contacts.title"), `${L}/legal-contacts`, [
    ...pick(d, "legal.contacts.body", "legal.contacts.topicsTitle", "legal.contacts.topics"),
    loc(at(siteModule, "site.email"), lang),
  ]);
}

/* ------------------------------------------------------------------ */
/* site.ts — contact details                                           */
/* ------------------------------------------------------------------ */

function contactChunk(b: Builder, lang: Lang, d: unknown) {
  const site = at(siteModule, "site");
  if (!isObj(site)) return;
  const s = (p: string) => loc(at(d, p), lang);
  const bnL = lang === "bn";
  const lines: string[] = [];
  const phones = Array.isArray(site.phones) ? site.phones.map((p) => (isObj(p) ? loc(p.display, lang) : loc(p, lang))).filter(Boolean) : [];
  if (!phones.length && loc(site.phone, lang)) phones.push(loc(site.phone, lang));
  if (phones.length) lines.push(`${s("contact.call") || "Phone"} / ${s("footer.hotline") || "Hotline"}: ${phones.join(", ")}`);
  if (loc(site.whatsappDisplay, lang)) lines.push(`WhatsApp: ${loc(site.whatsappDisplay, lang)}`);
  if (loc(site.email, lang)) lines.push(`${s("contact.write") || "Email"}: ${loc(site.email, lang)}`);
  if (loc(site.address, lang)) lines.push(`${s("contact.visit") || "Office"}: ${loc(site.address, lang)}`);
  const hours = s("contact.hours") || s("nav.hours");
  if (hours) lines.push(`${s("contact.hoursLabel") || "Office hours"}: ${hours}${bnL ? " (শুক্রবার বন্ধ)" : " (Friday closed)"}`);
  if (isObj(site.social)) {
    const social = Object.entries(site.social).filter(([, v]) => typeof v === "string").map(([k, v]) => `${k}: ${v}`);
    if (social.length) lines.push(`${s("footer.follow") || "Social"}: ${social.join(" | ")}`);
  }
  if (loc(site.mapsUrl, lang)) lines.push(`${s("contact.directions") || "Map"}: ${loc(site.mapsUrl, lang)}`);
  lines.push(...pick(d, "support.hotlineBody", "pages.contact.body"));
  b.add(lang, "contact-details", `${s("nav.contact") || "Contact"} — ${s("contact.hoursLabel") || "Office hours"}, ${s("contact.call") || "phone"}, WhatsApp`, `/${lang}/contact`, lines);
}

/* ------------------------------------------------------------------ */
/* products.ts                                                         */
/* ------------------------------------------------------------------ */

function productChunks(b: Builder, lang: Lang, d: unknown) {
  const mod = catalogModule as Loose;
  const categories = Array.isArray(mod.categories) ? mod.categories.filter(isObj) : [];
  const products = Array.isArray(mod.products) ? mod.products.filter(isObj) : [];
  const catName = new Map<string, string>();
  for (const c of categories) {
    const id = loc(c.id, lang);
    if (id) catName.set(id, loc(c.name, lang) || id);
  }
  const quoteNote = loc(at(d, "product.quoteNote"), lang);
  const bnL = lang === "bn";

  for (const p of products) {
    const slug = loc(p.slug, lang);
    const name = loc(p.name, lang);
    if (!slug || !name) continue;
    const brand = loc(p.brand, lang);
    const cat = catName.get(loc(p.category, lang)) ?? loc(p.category, lang);
    const title = brand && !name.toLowerCase().includes(brand.toLowerCase()) ? `${brand} ${name}` : name;
    const specs = Array.isArray(p.specs)
      ? p.specs.filter(isObj).map((sp) => `${loc(sp.label, lang)}: ${loc(sp.value, lang)}`).filter((x) => !x.startsWith(":"))
      : [];
    const highlights = locList(p.highlights, lang);
    const warranty = loc(p.warranty, lang);
    b.add(lang, `product-${slug}`, title, `/${lang}/products/${slug}`, [
      `${bnL ? "প্রোডাক্ট" : "Product"}: ${title}${cat ? ` (${cat})` : ""}${brand ? `. ${bnL ? "ব্র্যান্ড" : "Brand"}: ${brand}` : ""}.`,
      loc(p.tagline, lang),
      loc(p.description, lang),
      loc(p.keySpec, lang) ? `${bnL ? "মূল স্পেসিফিকেশন" : "Key spec"}: ${loc(p.keySpec, lang)}` : "",
      highlights.length ? `${loc(at(d, "product.highlights"), lang) || "Highlights"}: ${highlights.join("; ")}` : "",
      specs.length ? `${loc(at(d, "product.specs"), lang) || "Specifications"}: ${specs.join("; ")}` : "",
      warranty ? `${loc(at(d, "product.warranty"), lang) || "Warranty"}: ${warranty}` : "",
      quoteNote,
    ]);
  }

  for (const c of categories) {
    const id = loc(c.id, lang);
    const name = loc(c.name, lang);
    if (!id || !name) continue;
    const items = products
      .filter((p) => loc(p.category, lang) === id)
      .map((p) => {
        const brand = loc(p.brand, lang);
        const n = loc(p.name, lang);
        const label = brand && !n.toLowerCase().includes(brand.toLowerCase()) ? `${brand} ${n}` : n;
        const spec = loc(p.keySpec, lang);
        return spec ? `${label} (${spec})` : label;
      });
    b.add(lang, `category-${id}`, name, `/${lang}/products`, [
      `${loc(at(d, "product.category"), lang) || "Category"}: ${name}. ${loc(c.blurb, lang)}`,
      items.length ? `${bnL ? "মডেল" : "Models"}: ${items.join("; ")}` : "",
      quoteNote,
    ]);
  }
}

/* ------------------------------------------------------------------ */
/* projects.ts & testimonials.ts (sample content)                      */
/* ------------------------------------------------------------------ */

function projectChunks(b: Builder, lang: Lang, d: unknown) {
  const list = (projectsModule as Loose).projects;
  if (!Array.isArray(list)) return;
  const bnL = lang === "bn";
  const note = bnL
    ? "(নমুনা প্রকল্প — উদাহরণমাত্র, প্রকৃত ক্লায়েন্ট প্রকল্প নয়)"
    : "(Sample project — illustrative example, not a named client reference)";
  const parts = list.filter(isObj).map((p) =>
    [
      `${loc(p.title, lang)} ${note}`,
      loc(p.type, lang),
      [loc(p.location, lang), loc(p.capacity, lang), loc(p.year, lang)].filter(Boolean).join(", "),
      loc(p.summary, lang),
    ]
      .filter(Boolean)
      .join(". "),
  );
  b.add(lang, "projects", loc(at(d, "pages.projects.title"), lang) || "Projects", `/${lang}/projects`, parts);
}

function testimonialChunks(b: Builder, lang: Lang, d: unknown) {
  const list = (testimonialsModule as Loose).testimonials;
  if (!Array.isArray(list)) return;
  const bnL = lang === "bn";
  const parts = [
    bnL
      ? "নমুনা রিভিউ: নিচের রিভিউগুলো ড্রাফট ওয়েবসাইটের উদাহরণমাত্র, প্রকৃত গ্রাহকের যাচাইকৃত রিভিউ নয়।"
      : "Sample reviews: the reviews below are illustrative placeholders on the draft website, not verified customer reviews.",
    ...list.filter(isObj).map((r) => `"${loc(r.quote, lang)}" — ${loc(r.name, lang)}, ${loc(r.role, lang)}`),
  ];
  b.add(lang, "testimonials", loc(at(d, "testimonials.title"), lang) || "Reviews", `/${lang}`, parts);
}

/* ------------------------------------------------------------------ */
/* assistant-knowledge.ts (brochure, English)                          */
/* ------------------------------------------------------------------ */

function knowledgeChunks(b: Builder) {
  const sections = assistantKnowledge.split(/^# /m).map((s) => s.trim()).filter(Boolean);
  for (const sec of sections) {
    const [heading, ...body] = sec.split("\n");
    const lines = body.map((l) => l.trim()).filter(Boolean);
    const key = `kb-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    // Indexed once (English); the route rewrites the URL to the reader's language.
    b.add("en", key, heading, "/en/about", lines);
  }
}

/* ------------------------------------------------------------------ */

let corpus: Chunk[] | null = null;

/** All chunks, built on first use and memoised for the life of the server process. */
export function getCorpus(): Chunk[] {
  if (corpus) return corpus;
  const b = new Builder();
  const dicts: Record<Lang, unknown> = { en, bn };
  for (const lang of LANGS) {
    const d = dicts[lang];
    const guard = (name: string, fn: () => void) => {
      try {
        fn();
      } catch (error) {
        console.error(`[rag] skipped ${name} (${lang}):`, error);
      }
    };
    guard("dictionary", () => dictionaryChunks(b, lang, d));
    guard("contact", () => contactChunk(b, lang, d));
    guard("products", () => productChunks(b, lang, d));
    guard("projects", () => projectChunks(b, lang, d));
    guard("testimonials", () => testimonialChunks(b, lang, d));
  }
  try {
    knowledgeChunks(b);
  } catch (error) {
    console.error("[rag] skipped assistant knowledge:", error);
  }
  corpus = b.chunks.filter((c) => c.text.length > 0);
  return corpus;
}
