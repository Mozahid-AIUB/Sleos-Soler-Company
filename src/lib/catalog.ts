import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Localized } from "@/i18n/config";
import { categories as staticCategories, products as staticProducts, type CategoryId, type Product } from "@/content/products";

/*
 * Product catalogue for the public site. The data lives in Payload (Postgres);
 * every function here returns it in the same shape as src/content/products.ts
 * (Localized {en, bn} objects, `combo`, `image` as a URL string…), so pages and
 * components need no changes beyond calling these instead of importing arrays.
 *
 * Safety net: when the database is not configured or not reachable (for example
 * `next build` inside Docker/Coolify, which has no database) or returns nothing,
 * the static catalogue in src/content/products.ts is used and a warning is
 * logged. That keeps the build and the site alive; real data appears on the next
 * regeneration once the database answers.
 *
 * Caching: pages are static/ISR (see `revalidate` in app/[lang]/layout.tsx and
 * the collection hooks that call revalidatePath), so this module does not add a
 * second cache of its own. `cache()` only de-duplicates calls within one render.
 */

export type CatalogCategory = (typeof staticCategories)[number];
export type CatalogProduct = Product & {
  /** Datasheet PDF uploaded in the admin (URL); absent when none was uploaded. */
  datasheet?: string;
};

type Loose = Record<string, unknown>;
type Snapshot = { categories: CatalogCategory[]; products: CatalogProduct[] };

const DB_TIMEOUT_MS = 20_000;
/** After a failed attempt, skip the database for this long (keeps `next build` fast when there is no DB). */
const RETRY_AFTER_MS = 30_000;
/** Dhaka is UTC+6; combo offer dates are whole days in Bangladesh time. */
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Same rule as products.ts: items without a manufacturer are sold under OSLEOS, except two with third-party logos in the photo. */
const OSLEOS_BRAND = "OSLEOS";
const KEEP_UNBRANDED = new Set(["robotic-panel-cleaning", "panel-breakage-sensors"]);

const DEFAULT_CATEGORY_IMAGE = "/media/img/panels-closeup.webp";
const DEFAULT_PRODUCT_IMAGE = "/media/img/panels-closeup.webp";

/* ------------------------------------------------------------------ */
/* Reading Payload documents (locale "all": localized fields are {en, bn}) */
/* ------------------------------------------------------------------ */

const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** {en, bn} from a localized value; a missing side falls back to the other. */
function loc(v: unknown): Localized {
  if (typeof v === "string") return { en: v.trim(), bn: v.trim() };
  if (isObj(v)) {
    const en = text(v.en);
    const bn = text(v.bn);
    return { en: en || bn, bn: bn || en };
  }
  return { en: "", bn: "" };
}

/** Rows of `{ text: {en, bn} }` -> Localized<string[]>; undefined when there are no rows. */
function lines(v: unknown): Localized<string[]> | undefined {
  if (!Array.isArray(v)) return undefined;
  const rows = v.filter(isObj).map((r) => loc(r.text)).filter((t) => t.en || t.bn);
  if (!rows.length) return undefined;
  return { en: rows.map((r) => r.en), bn: rows.map((r) => r.bn) };
}

/** Optional Localized string: undefined when both sides are empty. */
function optLoc(v: unknown): Localized | undefined {
  const l = loc(v);
  return l.en || l.bn ? l : undefined;
}

/** Local URL of an uploaded file, always relative (`/api/media/file/<name>`), without cache-busting query. */
function mediaUrl(v: unknown): string | undefined {
  if (!isObj(v)) return undefined;
  const filename = text(v.filename);
  if (filename) return `/api/media/file/${encodeURIComponent(filename)}`;
  const url = text(v.url);
  if (!url) return undefined;
  try {
    const u = new URL(url, "http://local");
    return url.startsWith("/") ? u.pathname : url;
  } catch {
    return url;
  }
}

/** Start of the given Payload date (whole day) in Bangladesh time, as epoch ms. */
function dayStart(v: unknown): number | undefined {
  if (typeof v !== "string" && typeof v !== "number") return undefined;
  const t = new Date(v).getTime();
  if (Number.isNaN(t)) return undefined;
  return Math.floor(t / DAY_MS) * DAY_MS - DHAKA_OFFSET_MS;
}

function readCombo(doc: Loose, now: number): CatalogProduct["combo"] {
  if (!doc.isCombo || !isObj(doc.combo)) return undefined;
  const c = doc.combo;
  const includes = lines(c.includes) ?? { en: [], bn: [] };

  // Offer price shows only inside its window: from the start of offerStart to the end of offerEnd (Dhaka time).
  const start = dayStart(c.offerStart);
  const endDay = dayStart(c.offerEnd);
  const end = endDay === undefined ? undefined : endDay + DAY_MS;
  const live = (start === undefined || now >= start) && (end === undefined || now < end);
  const offer = typeof c.offerPrice === "number" && c.offerPrice > 0 ? c.offerPrice : undefined;
  const regular = typeof c.regularPrice === "number" && c.regularPrice > 0 ? c.regularPrice : undefined;

  return {
    ...(live && offer !== undefined ? { price: { ...(regular !== undefined ? { regular } : {}), offer } } : {}),
    suitableFor: lines(c.suitableFor),
    includes,
    idealFor: lines(c.idealFor),
    benefits: lines(c.benefits),
    transport: optLoc(c.transport),
    customise: optLoc(c.customise),
  };
}

function readProduct(doc: Loose, now: number): CatalogProduct | null {
  const slug = text(doc.slug);
  const name = text(doc.name);
  const category = isObj(doc.category) ? text(doc.category.slug) : "";
  if (!slug || !name || !category) return null;

  const staticMatch = staticProducts.find((p) => p.slug === slug);
  let brand = text(doc.brand) || undefined;
  if (!brand && !KEEP_UNBRANDED.has(slug)) brand = OSLEOS_BRAND;

  const specs = Array.isArray(doc.specs)
    ? doc.specs
        .filter(isObj)
        .map((s) => ({ label: loc(s.label), value: text(s.value) }))
        .filter((s) => s.label.en || s.value)
    : [];

  return {
    slug,
    category: category as CategoryId,
    brand,
    name,
    tagline: loc(doc.tagline),
    description: loc(doc.description),
    keySpec: loc(doc.keySpec),
    specs,
    highlights: lines(doc.highlights) ?? { en: [], bn: [] },
    features: lines(doc.features),
    warranty: optLoc(doc.warranty),
    image: mediaUrl(doc.image) ?? staticMatch?.image ?? DEFAULT_PRODUCT_IMAGE,
    imageCredit: optLoc(doc.imageCredit),
    applications: lines(doc.applications),
    imagePosition: text(doc.imagePosition) || undefined,
    imageFit: doc.imageFit === "contain" ? "contain" : undefined,
    combo: readCombo(doc, now),
    featured: Boolean(doc.featured),
    source: text(doc.source) || undefined,
    datasheet: mediaUrl(doc.datasheet),
  };
}

function readCategory(doc: Loose): CatalogCategory | null {
  const id = text(doc.slug);
  const name = loc(doc.name);
  if (!id || !name.en) return null;
  const staticMatch = staticCategories.find((c) => c.id === id);
  return {
    id: id as CategoryId,
    name,
    blurb: loc(doc.blurb),
    image: mediaUrl(doc.image) ?? staticMatch?.image ?? DEFAULT_CATEGORY_IMAGE,
  };
}

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

let retryAt = 0;
let warnedNoUri = false;

const fallbackSnapshot = (): Snapshot => ({ categories: staticCategories, products: staticProducts });

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`catalog: database did not answer within ${ms / 1000}s`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function fromDatabase(): Promise<Snapshot> {
  const payload = await getPayload({ config });
  const [cats, prods] = await Promise.all([
    payload.find({ collection: "categories", locale: "all", fallbackLocale: false, depth: 1, limit: 0, pagination: false, sort: "order" }),
    payload.find({
      collection: "products",
      where: { _status: { equals: "published" } },
      locale: "all",
      fallbackLocale: false,
      depth: 1,
      limit: 0,
      pagination: false,
      // Catalogue order = order of creation (the seed inserts in catalogue order; new products go last).
      sort: "createdAt",
    }),
  ]);
  const now = Date.now();
  const categories = (cats.docs as unknown as Loose[]).map(readCategory).filter((c): c is CatalogCategory => c !== null);
  const products = (prods.docs as unknown as Loose[]).map((d) => readProduct(d, now)).filter((p): p is CatalogProduct => p !== null);
  return { categories, products };
}

/** Database snapshot, or the static catalogue when the database is missing, down or empty. */
const loadSnapshot = cache(async (): Promise<Snapshot> => {
  if (!process.env.DATABASE_URI) {
    if (!warnedNoUri) {
      warnedNoUri = true;
      console.warn("[catalog] DATABASE_URI is not set; using the static catalogue from src/content/products.ts");
    }
    return fallbackSnapshot();
  }
  if (Date.now() < retryAt) return fallbackSnapshot();

  try {
    const data = await withTimeout(fromDatabase(), DB_TIMEOUT_MS);
    retryAt = 0;
    const fb = fallbackSnapshot();
    if (!data.products.length || !data.categories.length) {
      console.warn("[catalog] database has no published products or no categories yet; using the static catalogue for the missing part");
    }
    return {
      categories: data.categories.length ? data.categories : fb.categories,
      products: data.products.length ? data.products : fb.products,
    };
  } catch (error) {
    retryAt = Date.now() + RETRY_AFTER_MS;
    console.warn("[catalog] database unavailable; using the static catalogue from src/content/products.ts:", error instanceof Error ? error.message : error);
    return fallbackSnapshot();
  }
});

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export async function getCategories(): Promise<CatalogCategory[]> {
  return (await loadSnapshot()).categories;
}

/** All published products in catalogue order. */
export async function getAllProducts(): Promise<CatalogProduct[]> {
  return (await loadSnapshot()).products;
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  return (await loadSnapshot()).products.find((p) => p.slug === slug);
}

/** Up to four products ticked "Featured on the home page". */
export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  return (await loadSnapshot()).products.filter((p) => p.featured).slice(0, 4);
}

export async function getProductsByCategory(category: CategoryId): Promise<CatalogProduct[]> {
  return (await loadSnapshot()).products.filter((p) => p.category === category);
}

/** Brands in catalogue order, for filter chips and the assistant. */
export async function getBrands(): Promise<string[]> {
  const products = (await loadSnapshot()).products;
  return [...new Set(products.flatMap((p) => (p.brand ? [p.brand] : [])))];
}

/** Categories and products together (one query), for callers that need both. */
export async function getCatalog(): Promise<Snapshot & { brands: string[] }> {
  const snap = await loadSnapshot();
  return { ...snap, brands: [...new Set(snap.products.flatMap((p) => (p.brand ? [p.brand] : [])))] };
}
