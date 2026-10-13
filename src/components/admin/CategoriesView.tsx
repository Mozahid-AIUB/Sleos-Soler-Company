import Link from "next/link";
import type { CSSProperties } from "react";
import type { ListViewServerProps } from "payload";

/*
 * The Categories page as colourful cards (replaces the plain table). A card
 * shows the picture, name and product count, and leads straight to that
 * category's products, where products can be edited, hidden or deleted, or
 * added with this category already chosen.
 */

const colors = ["#d97706", "#0891b2", "#16a34a", "#9333ea", "#2563eb", "#dc2626", "#0d9488", "#c026d3", "#ea580c", "#4f46e5"];

type Card = {
  id: number | string;
  name: string;
  blurb: string;
  image?: string;
  total: number;
  published: number;
};

const productsOf = (id: number | string) => `/admin/collections/products?where[or][0][and][0][category][equals]=${id}`;

export async function CategoriesView({ payload, user }: ListViewServerProps) {
  const isOwner = Boolean((user as { roles?: string[] } | null)?.roles?.includes("owner"));
  let cards: Card[] = [];
  try {
    const found = await payload.find({ collection: "categories", sort: "order", limit: 50, depth: 1, pagination: false });
    cards = await Promise.all(
      found.docs.map(async (c) => {
        const [all, live] = await Promise.all([
          payload.count({ collection: "products", where: { category: { equals: c.id } } }),
          payload.count({ collection: "products", where: { category: { equals: c.id }, _status: { equals: "published" } } }),
        ]);
        const img = typeof c.image === "object" && c.image ? c.image.filename : undefined;
        return {
          id: c.id,
          name: c.name || c.slug,
          blurb: c.blurb || "",
          image: img ? `/api/media/file/${encodeURIComponent(img)}` : undefined,
          total: all.totalDocs,
          published: live.totalDocs,
        };
      }),
    );
  } catch {
    /* an empty page with the heading is better than an error */
  }

  return (
    <div className="osl-cats">
      <div className="osl-cats__head">
        <div>
          <h1>Categories</h1>
          <p>
            Click a category to see, add, edit, hide or delete the products inside it.
            <small>ক্যাটাগরিতে ক্লিক করলে ভিতরের প্রোডাক্ট দেখা, যোগ, এডিট, লুকানো বা মোছা যাবে।</small>
          </p>
        </div>
        {isOwner && (
          <Link href="/admin/collections/categories/create" className="osl-cats__new">
            + New category
          </Link>
        )}
      </div>

      <div className="osl-cats__grid">
        {cards.map((c, i) => (
          <article key={c.id} className="osl-cats__card" style={{ "--c": colors[i % colors.length] } as CSSProperties}>
            <Link href={productsOf(c.id)} className="osl-cats__open" aria-label={`Open ${c.name}`}>
              <div className="osl-cats__pic" style={c.image ? { backgroundImage: `url(${c.image})` } : undefined}>
                <span className="osl-cats__count">{c.total}</span>
              </div>
              <div className="osl-cats__body">
                <h2>{c.name}</h2>
                {c.blurb && <p>{c.blurb}</p>}
                <span className="osl-cats__meta">
                  {c.published} visible{c.total - c.published > 0 ? ` · ${c.total - c.published} hidden` : ""}
                </span>
              </div>
            </Link>
            <div className="osl-cats__actions">
              <Link href={productsOf(c.id)} className="osl-cats__btn osl-cats__btn--solid">
                Open products
              </Link>
              <Link href={`/admin/collections/products/create?category=${c.id}`} className="osl-cats__btn">
                + Add product
              </Link>
              <Link href={`/admin/collections/categories/${c.id}`} className="osl-cats__edit">
                Edit category
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
