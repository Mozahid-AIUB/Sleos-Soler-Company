import type { ServerProps } from "payload";
import { SiteMenuClient, type MenuCategory } from "./SiteMenuClient";
import { thumbOf } from "./links";

/**
 * The admin side menu, named and ordered exactly like the website's own menu
 * (Products ▾ with its categories, Solutions, Projects, About, Contact), so the
 * client finds things where she sees them on the website. Payload's own menu
 * entries are hidden by CSS.
 */
export async function SiteMenu({ payload, user }: ServerProps) {
  let cats: MenuCategory[] = [];
  try {
    const found = await payload.find({ collection: "categories", sort: "order", limit: 50, depth: 1, pagination: false });
    cats = found.docs.map((c) => ({ id: c.id, name: c.name || c.slug, image: thumbOf(c.image) }));
  } catch {
    /* the menu still works without the category list */
  }
  let newForms = 0;
  try {
    newForms = (await payload.count({ collection: "measurement-forms", where: { status: { equals: "new" } } })).totalDocs;
  } catch {
    /* no badge */
  }
  const isOwner = Boolean((user as { roles?: string[] } | null)?.roles?.includes("owner"));
  return <SiteMenuClient cats={cats} isOwner={isOwner} newForms={newForms} />;
}
