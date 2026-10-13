/**
 * Seed the "testimonials" collection from the static reviews in src/content/testimonials.ts.
 *
 *   npm run seed:testimonials
 *
 * Safe to re-run: reviews are matched by their English quote and updated in place.
 * All are marked as sample reviews (the file holds placeholders). English goes in
 * locale "en", Bangla in locale "bn".
 */
import { getPayload } from "payload";
import config from "../src/payload.config";
import { testimonials } from "../src/content/testimonials";

const stats = { created: 0, updated: 0, failed: 0 };
const failures: string[] = [];

function describe(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const cause = e.cause instanceof Error ? ` | cause: ${e.cause.message}` : "";
  return e.message.split("\n")[0] + cause;
}

async function main() {
  const payload = await getPayload({ config });
  for (const [i, r] of testimonials.entries()) {
    try {
      const base = { group: r.group, rating: r.rating, sample: true, order: i * 10, _status: "published" as const };
      const enData = { ...base, quote: r.quote.en, name: r.name.en, role: r.role.en };
      const existing = await payload.find({
        collection: "testimonials",
        where: { quote: { equals: r.quote.en } },
        limit: 1,
        depth: 0,
        draft: true,
        locale: "en",
      });
      let id: number | string;
      if (existing.docs[0]) {
        id = existing.docs[0].id;
        await payload.update({ collection: "testimonials", id, data: enData, locale: "en", draft: false });
        stats.updated++;
      } else {
        const doc = await payload.create({ collection: "testimonials", data: enData, locale: "en", draft: false });
        id = doc.id;
        stats.created++;
      }
      // Bangla pass (same document, locale "bn").
      await payload.update({
        collection: "testimonials",
        id,
        data: { ...base, quote: r.quote.bn, name: r.name.bn, role: r.role.bn },
        locale: "bn",
        draft: false,
      });
    } catch (e) {
      stats.failed++;
      const detail = e && typeof e === "object" && "data" in e ? ` ${JSON.stringify((e as { data: unknown }).data)}` : "";
      failures.push(`review ${i + 1} (${r.name.en}): ${describe(e)}${detail}`);
    }
  }
  console.log("\nSeed summary");
  console.log(`  reviews: ${stats.created} created, ${stats.updated} updated, ${stats.failed} failed (of ${testimonials.length})`);
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
