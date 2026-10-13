/* eslint-disable @next/next/no-img-element -- admin-only thumbnails */
import Link from "next/link";
import type { ListViewServerProps } from "payload";
import { AdminIcon } from "./icons";
import { addProductTo, productsOf, thumbOf } from "./links";

/*
 * The Categories page as picture cards (replaces the plain table), laid out like
 * the website's Products drop-down. Each card leads to that category's products
 * and to renaming the category or changing its picture.
 */

type Card = { id: number | string; name: string; blurb: string; image?: string; total: number; published: number };

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
        return { id: c.id, name: c.name || c.slug, blurb: c.blurb || "", image: thumbOf(c.image), total: all.totalDocs, published: live.totalDocs };
      }),
    );
  } catch {
    /* an empty page with the heading is better than an error */
  }

  return (
    <div className="osl-page">
      <header className="osl-page__head">
        <div>
          <h1>Product categories</h1>
          <p>
            The groups in the website&apos;s Products menu. Open one to see its products, or rename it and change its picture.
          </p>
        </div>
        {isOwner && (
          <Link href="/admin/collections/categories/create" className="osl-btn">
            <AdminIcon name="plus" size={16} />
            New category
          </Link>
        )}
      </header>

      <div className="osl-catgrid">
        {cards.map((c) => (
          <article key={c.id} className="osl-catcard">
            <Link href={productsOf(c.id)} className="osl-catcard__open" aria-label={`Open ${c.name}`}>
              <span className="osl-catcard__pic">{c.image ? <img src={c.image} alt="" /> : null}</span>
              <span className="osl-catcard__body">
                <strong>{c.name}</strong>
                {c.blurb && <small>{c.blurb}</small>}
                <em>
                  {c.published} on the website{c.total - c.published > 0 ? ` · ${c.total - c.published} hidden` : ""}
                </em>
              </span>
            </Link>
            <div className="osl-catcard__actions">
              <Link href={productsOf(c.id)} className="osl-btn osl-btn--ghost">
                Products
              </Link>
              <Link href={addProductTo(c.id)} className="osl-btn osl-btn--ghost">
                <AdminIcon name="plus" size={16} />
                Add
              </Link>
              <Link href={`/admin/collections/categories/${c.id}`} className="osl-catcard__edit">
                Rename / picture
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
