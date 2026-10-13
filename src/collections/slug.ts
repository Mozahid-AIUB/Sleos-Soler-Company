import type { CollectionBeforeValidateHook } from "payload";

/** "Jinko Tiger Neo 54HL4R-B" -> "jinko-tiger-neo-54hl4r-b" */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/**
 * The page link ("slug") is created automatically from the name, so the client never has to
 * think about it. An existing slug is kept; a clash gets -2, -3… added.
 */
export const autoSlug =
  (source: "name" | "title", collection: "products" | "projects"): CollectionBeforeValidateHook =>
  async ({ data, req, originalDoc }) => {
    if (!data) return data;
    if (typeof data.slug === "string" && data.slug.trim()) return { ...data, slug: slugify(data.slug) || data.slug };
    if (originalDoc?.slug) return { ...data, slug: originalDoc.slug };

    const raw = data[source] ?? originalDoc?.[source];
    const base = slugify(typeof raw === "string" ? raw : (raw?.en ?? "")) || `item-${Date.now()}`;
    let slug = base;
    for (let n = 2; ; n++) {
      const { totalDocs } = await req.payload.count({ collection, where: { slug: { equals: slug } }, overrideAccess: true, req });
      if (!totalDocs) break;
      slug = `${base}-${n}`;
    }
    return { ...data, slug };
  };
