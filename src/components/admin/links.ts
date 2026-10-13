/** Shared admin URLs and helpers (plain module: usable from server and client components). */

export const CAT_PARAM = "where[or][0][and][0][category][equals]";
export const productsOf = (id: number | string) => `/admin/collections/products?${CAT_PARAM}=${id}`;
export const addProductTo = (id: number | string) => `/admin/collections/products/create?category=${id}`;

/** Small picture URL of an uploaded file (thumbnail size when there is one). */
export function thumbOf(image: unknown): string | undefined {
  if (!image || typeof image !== "object") return undefined;
  const f = image as { filename?: string | null; sizes?: { thumbnail?: { filename?: string | null } } };
  const name = f.sizes?.thumbnail?.filename || f.filename;
  return name ? `/api/media/file/${encodeURIComponent(name)}` : undefined;
}
