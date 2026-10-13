/**
 * Seed the "Team members" collection from the leadership team in the en and bn
 * dictionaries (src/i18n/dictionaries), with the portraits in public/media/team.
 *
 *   npm run seed:team
 *
 * Safe to re-run: members are matched by English name and updated in place;
 * portraits are matched by filename in the Media library and uploaded only once.
 * English goes in locale "en", Bangla in locale "bn". The bio is one textarea:
 * paragraphs are separated by a blank line, and a bullet list ("- item" lines)
 * goes last (same convention as src/lib/team.ts).
 */
import fs from "node:fs";
import path from "node:path";
import { getPayload, type Payload } from "payload";
import config from "../src/payload.config";
import en from "../src/i18n/dictionaries/en";
import bn from "../src/i18n/dictionaries/bn";

/** Portrait files in public/media/team, same order as the dictionaries' `team`. */
const PHOTO_FILES = ["banzir-hazra", "lutfar-rahman", "safuan-chowdhury", "maksudul-hasan", "kiran-mathew"];
const PHOTO_EXTS = ["webp", "png", "jpg", "jpeg"];

const ROOT = process.cwd();
const stats = {
  team: { created: 0, updated: 0, failed: 0 },
  media: { uploaded: 0, reused: 0, missing: 0 },
};
const failures: string[] = [];

type Member = (typeof en.pages.about.team)[number];

function describe(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const cause = e.cause instanceof Error ? ` | cause: ${e.cause.message}` : "";
  return e.message.split("\n")[0] + cause;
}

/** Upload the portrait unless a file with the same name is already in Media. Returns the media id, or null when there is no portrait. */
async function ensurePhoto(payload: Payload, index: number, alt: { en: string; bn: string }): Promise<number | string | null> {
  const file = PHOTO_FILES[index];
  if (!file) return null;
  const ext = PHOTO_EXTS.find((x) => fs.existsSync(path.join(ROOT, "public", "media", "team", `${file}.${x}`)));
  if (!ext) {
    stats.media.missing++;
    failures.push(`missing portrait: public/media/team/${file}.*`);
    return null;
  }
  const filename = `${file}.${ext}`;
  // Uploads are converted to WebP, so the stored name may differ in extension from the source.
  const stored = [filename, `${file}.webp`];
  const found = await payload.find({ collection: "media", where: { filename: { in: stored } }, limit: 1, depth: 0, pagination: false });
  if (found.docs[0]) {
    stats.media.reused++;
    return found.docs[0].id;
  }
  const doc = await payload.create({ collection: "media", data: { alt: alt.en }, filePath: path.join(ROOT, "public", "media", "team", filename), locale: "en" });
  await payload.update({ collection: "media", id: doc.id, data: { alt: alt.bn }, locale: "bn" });
  stats.media.uploaded++;
  return doc.id;
}

/** Paragraphs joined with a blank line; bullet list (if any) last, one "- item" per line. */
const bioText = (m: Member) => {
  const blocks = [...m.bio];
  if ("highlights" in m && m.highlights?.length) blocks.push(m.highlights.map((h) => `- ${h}`).join("\n"));
  return blocks.join("\n\n");
};

async function seedMember(payload: Payload, index: number, enM: Member, bnM: Member) {
  const photo = await ensurePhoto(payload, index, { en: enM.name, bn: bnM.name });
  const base = { order: index * 10, _status: "published" as const, ...(photo != null ? { photo: photo as number } : {}) };
  const enData = { ...base, name: enM.name, role: enM.role, credentials: enM.credentials, bio: bioText(enM) };

  const existing = await payload.find({ collection: "team-members", where: { name: { equals: enM.name } }, limit: 1, depth: 0, draft: true, locale: "en" });
  let id: number | string;
  if (existing.docs[0]) {
    id = existing.docs[0].id;
    await payload.update({ collection: "team-members", id, data: enData, locale: "en", draft: false });
    stats.team.updated++;
  } else {
    const doc = await payload.create({ collection: "team-members", data: enData, locale: "en", draft: false });
    id = doc.id;
    stats.team.created++;
  }
  await payload.update({
    collection: "team-members",
    id,
    data: { name: bnM.name, role: bnM.role, credentials: bnM.credentials, bio: bioText(bnM), _status: "published" as const },
    locale: "bn",
    draft: false,
  });
}

async function main() {
  const payload = await getPayload({ config });
  const enTeam = en.pages.about.team;
  const bnTeam = bn.pages.about.team;
  for (const [i, enM] of enTeam.entries()) {
    try {
      await seedMember(payload, i, enM, bnTeam[i] ?? enM);
    } catch (e) {
      stats.team.failed++;
      failures.push(`member ${enM.name}: ${describe(e)}`);
    }
  }
  console.log("\nSeed summary");
  console.log(`  team members: ${stats.team.created} created, ${stats.team.updated} updated, ${stats.team.failed} failed (of ${enTeam.length})`);
  console.log(`  portraits:    ${stats.media.uploaded} uploaded, ${stats.media.reused} reused, ${stats.media.missing} missing`);
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
