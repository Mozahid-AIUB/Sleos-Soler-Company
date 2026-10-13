import type { ServerProps } from "payload";
import { SiteMenuClient } from "./SiteMenuClient";

/**
 * The admin side menu, shaped like the website's own menu (Products ▾ with its
 * categories, Solutions, Projects, About, Contact), so the client finds things where
 * he sees them on the website. Payload's own menu entries are hidden by CSS.
 */
export async function SiteMenu({ payload, user }: ServerProps) {
  let cats: { id: number | string; name: string }[] = [];
  try {
    const found = await payload.find({ collection: "categories", sort: "order", limit: 50, depth: 0, pagination: false });
    cats = found.docs.map((c) => ({ id: c.id, name: c.name || c.slug }));
  } catch {
    /* the menu still works without the category list */
  }
  const isOwner = Boolean((user as { roles?: string[] } | null)?.roles?.includes("owner"));
  return <SiteMenuClient cats={cats} isOwner={isOwner} />;
}
