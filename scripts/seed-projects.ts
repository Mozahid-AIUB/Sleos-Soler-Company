/**
 * Seed the Payload CMS with the projects from src/content/projects.ts.
 *
 *   npm run seed:projects
 *
 * Safe to re-run: projects are matched by slug and updated in place; media
 * files are matched by filename and uploaded only once.
 * English goes in locale "en", Bangla in locale "bn".
 */
import fs from "node:fs";
import path from "node:path";
import { getPayload, type Payload } from "payload";
import config from "../src/payload.config";
import { projects, type Project } from "../src/content/projects";

type Loc = { en: string; bn: string };

const ROOT = process.cwd();
const stats = {
  proj: { created: 0, updated: 0, failed: 0 },
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

/** The project payload for one locale. Non-localized fields are sent in both passes (same values). */
function projectData(p: Project, lang: "en" | "bn", image: number | string, order: number) {
  return {
    title: p.title[lang],
    slug: p.slug,
    type: p.type[lang],
    location: p.location[lang],
    capacity: p.capacity,
    year: p.year ?? null,
    summary: p.summary[lang],
    image,
    sample: p.sample,
    order,
    _status: "published" as const,
  };
}

async function seedProject(payload: Payload, p: Project, order: number) {
  const image = await ensureMedia(payload, p.image, p.title);
  if (image == null) throw new Error(`image not found: ${p.image}`);

  const existing = await payload.find({ collection: "projects", where: { slug: { equals: p.slug } }, limit: 1, depth: 0, draft: true, locale: "en" });
  const enData = projectData(p, "en", image, order);
  let id: number | string;
  if (existing.docs[0]) {
    id = existing.docs[0].id;
    await payload.update({ collection: "projects", id, data: enData as never, locale: "en", draft: false });
    stats.proj.updated++;
  } else {
    const doc = await payload.create({ collection: "projects", data: enData as never, locale: "en", draft: false });
    id = doc.id;
    stats.proj.created++;
  }
  await payload.update({ collection: "projects", id, data: projectData(p, "bn", image, order) as never, locale: "bn", draft: false });
}

function describe(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const cause = e.cause instanceof Error ? ` | cause: ${e.cause.message}` : "";
  return e.message.split("\n")[0] + cause;
}

async function main() {
  const payload = await getPayload({ config });
  for (const [i, p] of projects.entries()) {
    try {
      await seedProject(payload, p, i * 10);
    } catch (e) {
      stats.proj.failed++;
      const detail = e && typeof e === "object" && "data" in e ? ` ${JSON.stringify((e as { data: unknown }).data)}` : "";
      failures.push(`project ${p.slug}: ${describe(e)}${detail}`);
    }
  }
  console.log("\nSeed summary");
  console.log(`  projects: ${stats.proj.created} created, ${stats.proj.updated} updated, ${stats.proj.failed} failed (of ${projects.length})`);
  console.log(`  media:    ${stats.media.uploaded} uploaded, ${stats.media.reused} reused, ${stats.media.missing} missing`);
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
