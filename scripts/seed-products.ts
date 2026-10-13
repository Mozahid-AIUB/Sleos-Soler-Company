/**
 * Seed the Payload CMS from the static catalogue in src/content/products.ts.
 *
 *   npm run seed
 *
 * Safe to re-run: categories and products are matched by slug and updated in
 * place; media files are matched by filename and uploaded only once.
 * English goes in locale "en", Bangla in locale "bn".
 */
import fs from "node:fs";
import path from "node:path";
import { getPayload, type Payload } from "payload";
import config from "../src/payload.config";
import { categories, products, type Product } from "../src/content/products";

type Loc = { en: string; bn: string };
type Row = { id?: string | null };
type Ids = {
  specs?: Row[];
  highlights?: Row[];
  features?: Row[];
  applications?: Row[];
  combo?: { includes?: Row[] | null; suitableFor?: Row[] | null; idealFor?: Row[] | null; benefits?: Row[] | null } | null;
};

const ROOT = process.cwd();
const stats = {
  cat: { created: 0, updated: 0, failed: 0 },
  prod: { created: 0, updated: 0, failed: 0 },
  media: { uploaded: 0, reused: 0, missing: 0 },
};
const failures: string[] = [];

/** Upload public/<url> to Media unless a file with the same name is already there. Returns the media id. */
async function ensureMedia(payload: Payload, url: string, alt: Loc | null): Promise<number | string | null> {
  const filePath = path.join(ROOT, "public", url.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    stats.media.missing++;
    failures.push(`missing file: ${url}`);
    return null;
  }
  const filename = path.basename(filePath);
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0, pagination: false });
  if (found.docs[0]) {
    stats.media.reused++;
    return found.docs[0].id;
  }
  const doc = await payload.create({ collection: "media", data: { alt: alt?.en }, filePath, locale: "en" });
  if (alt) await payload.update({ collection: "media", id: doc.id, data: { alt: alt.bn }, locale: "bn" });
  stats.media.uploaded++;
  return doc.id;
}

const rows = (list: string[] | undefined, ids?: Row[] | null) =>
  list?.map((text, i) => ({ ...(ids?.[i]?.id ? { id: ids[i].id } : {}), text }));

type Ctx = { image: number | string; datasheet: number | string | null; category: number | string; ids?: Ids };

/** The product payload for one locale (row ids from the English pass go into the Bangla pass). */
function productData(p: Product, lang: "en" | "bn", ctx: Ctx) {
  const ids: Ids = ctx.ids ?? {};
  const t = (v: Loc | undefined) => v?.[lang];
  const lines = (v: { en: string[]; bn: string[] } | undefined, idRows?: Row[] | null) => rows(v?.[lang], idRows);
  const specs = p.specs.map((s, i) => ({ ...(ids.specs?.[i]?.id ? { id: ids.specs[i].id } : {}), label: s.label[lang], value: s.value }));
  const c = p.combo;
  const cid = ids.combo ?? {};
  return {
    name: p.name,
    slug: p.slug,
    category: ctx.category,
    brand: p.brand ?? null,
    tagline: t(p.tagline),
    description: t(p.description),
    keySpec: t(p.keySpec),
    image: ctx.image,
    imageCredit: t(p.imageCredit) ?? null,
    datasheet: ctx.datasheet,
    warranty: t(p.warranty) ?? null,
    specs,
    highlights: lines(p.highlights, ids.highlights),
    features: lines(p.features, ids.features) ?? [],
    applications: lines(p.applications, ids.applications) ?? [],
    isCombo: Boolean(c),
    combo: c
      ? {
          offerPrice: c.price?.offer ?? null,
          regularPrice: c.price?.regular ?? null,
          includes: lines(c.includes, cid.includes),
          suitableFor: lines(c.suitableFor, cid.suitableFor) ?? [],
          idealFor: lines(c.idealFor, cid.idealFor) ?? [],
          benefits: lines(c.benefits, cid.benefits) ?? [],
          transport: t(c.transport) ?? null,
          customise: t(c.customise) ?? null,
        }
      : undefined,
    featured: Boolean(p.featured),
    imagePosition: p.imagePosition ?? null,
    imageFit: p.imageFit ?? null,
    source: p.source ?? null,
    _status: "published" as const,
  };
}

async function seedCategories(payload: Payload) {
  const idBySlug = new Map<string, number | string>();
  for (const [order, c] of categories.entries()) {
    try {
      const image = await ensureMedia(payload, c.image, c.name);
      const existing = await payload.find({ collection: "categories", where: { slug: { equals: c.id } }, limit: 1, depth: 0, locale: "en" });
      const base = { slug: c.id as string, order, image: (image ?? undefined) as number | undefined };
      let id: number | string;
      if (existing.docs[0]) {
        id = existing.docs[0].id;
        await payload.update({ collection: "categories", id, data: { ...base, name: c.name.en, blurb: c.blurb.en }, locale: "en" });
        stats.cat.updated++;
      } else {
        const doc = await payload.create({ collection: "categories", data: { ...base, name: c.name.en, blurb: c.blurb.en }, locale: "en" });
        id = doc.id;
        stats.cat.created++;
      }
      await payload.update({ collection: "categories", id, data: { name: c.name.bn, blurb: c.blurb.bn }, locale: "bn" });
      idBySlug.set(c.id, id);
    } catch (e) {
      stats.cat.failed++;
      failures.push(`category ${c.id}: ${describe(e)}`);
    }
  }
  return idBySlug;
}

async function seedProduct(payload: Payload, p: Product, categoryId: number | string) {
  const image = await ensureMedia(payload, p.image, { en: p.name, bn: p.name });
  if (image == null) throw new Error(`image not found: ${p.image}`);
  // Datasheets are linked by convention: public/datasheets/<slug>.pdf
  const datasheetUrl = `/datasheets/${p.slug}.pdf`;
  const datasheet = fs.existsSync(path.join(ROOT, "public", datasheetUrl)) ? await ensureMedia(payload, datasheetUrl, null) : null;
  const ctx: Ctx = { image, datasheet, category: categoryId };

  const existing = await payload.find({ collection: "products", where: { slug: { equals: p.slug } }, limit: 1, depth: 0, draft: true, locale: "en" });
  const enData = productData(p, "en", ctx);
  let doc;
  if (existing.docs[0]) {
    doc = await payload.update({ collection: "products", id: existing.docs[0].id, data: enData as never, locale: "en", draft: false });
    stats.prod.updated++;
  } else {
    doc = await payload.create({ collection: "products", data: enData as never, locale: "en", draft: false });
    stats.prod.created++;
  }

  // Bangla pass: reuse the row ids so the Bangla text lands on the same rows as the English text.
  const ids: Ids = { specs: doc.specs ?? [], highlights: doc.highlights ?? [], features: doc.features ?? [], applications: doc.applications ?? [], combo: doc.combo };
  const bnData = productData(p, "bn", { ...ctx, ids });
  await payload.update({ collection: "products", id: doc.id, data: bnData as never, locale: "bn", draft: false });
}

function describe(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const cause = e.cause instanceof Error ? ` | cause: ${e.cause.message}` : "";
  return e.message.split("\n")[0] + cause;
}

async function main() {
  const payload = await getPayload({ config });
  const cats = await seedCategories(payload);
  for (const p of products) {
    const categoryId = cats.get(p.category);
    if (categoryId == null) {
      stats.prod.failed++;
      failures.push(`product ${p.slug}: category ${p.category} missing`);
      continue;
    }
    try {
      await seedProduct(payload, p, categoryId);
    } catch (e) {
      stats.prod.failed++;
      const detail = e && typeof e === "object" && "data" in e ? ` ${JSON.stringify((e as { data: unknown }).data)}` : "";
      failures.push(`product ${p.slug}: ${describe(e)}${detail}`);
    }
  }
  console.log("\nSeed summary");
  console.log(`  categories: ${stats.cat.created} created, ${stats.cat.updated} updated, ${stats.cat.failed} failed (of ${categories.length})`);
  console.log(`  products:   ${stats.prod.created} created, ${stats.prod.updated} updated, ${stats.prod.failed} failed (of ${products.length})`);
  console.log(`  media:      ${stats.media.uploaded} uploaded, ${stats.media.reused} reused, ${stats.media.missing} missing`);
  if (failures.length) console.log("\nProblems:\n  " + failures.join("\n  "));
  process.exit(failures.length ? 1 : 0);
}

// Top-level await: `payload run` exits as soon as the module has finished evaluating.
try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
