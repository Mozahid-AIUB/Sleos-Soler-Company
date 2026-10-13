import "server-only";
import { createLoader, loc, text, type Loose } from "@/lib/cms-read";
import { testimonials as staticTestimonials, type Testimonial } from "@/content/testimonials";
import { site } from "@/content/site";

/*
 * Customer reviews for the public site. Data lives in Payload (collection
 * `testimonials`); the static list in src/content/testimonials.ts is the fallback
 * when the database is missing, down or has no published reviews.
 */

export type CatalogTestimonial = Testimonial & {
  /** Placeholder review: the site shows a "Sample review" note while any shown review has this set. */
  sample: boolean;
};

const read = (doc: Loose): CatalogTestimonial | null => {
  const quote = loc(doc.quote);
  const name = loc(doc.name);
  if (!quote.en || !name.en) return null;
  const rating = typeof doc.rating === "number" ? Math.min(5, Math.max(1, Math.round(doc.rating))) : 5;
  return {
    group: text(doc.group) === "manufacturers" ? "manufacturers" : "clients",
    quote,
    name,
    role: loc(doc.role),
    rating,
    sample: Boolean(doc.sample),
  };
};

const loadTestimonials = createLoader<CatalogTestimonial>(
  "testimonials",
  async (payload) => {
    const res = await payload.find({
      collection: "testimonials",
      where: { _status: { equals: "published" } },
      locale: "all",
      fallbackLocale: false,
      depth: 0,
      limit: 0,
      pagination: false,
      sort: "order",
    });
    return (res.docs as unknown as Loose[]).map(read).filter((t): t is CatalogTestimonial => t !== null);
  },
  // The static reviews are samples: they carry the note only while the site is a draft (same as before the CMS).
  () => staticTestimonials.map((t) => ({ ...t, sample: site.draft })),
);

/** Published reviews in the order set in the admin. */
export async function getTestimonials(): Promise<CatalogTestimonial[]> {
  return loadTestimonials();
}
