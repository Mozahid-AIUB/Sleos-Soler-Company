import Link from "next/link";
import type { BeforeListTableServerProps } from "payload";
import { AddCard } from "./AddCard";
import { CAT_PARAM, addProductTo, productsOf } from "./links";

/**
 * Above the product table: one button per website category (instead of
 * Payload's filter builder, which is hidden by CSS). Products are added from
 * inside a category, so the Add button only appears once one is chosen.
 */
export async function ProductTabs({ payload, searchParams }: BeforeListTableServerProps) {
  // The filter arrives either as the raw query key or already parsed into a nested object.
  const sp = (searchParams ?? {}) as Record<string, unknown> & {
    where?: { or?: { and?: { category?: { equals?: string } }[] }[] };
  };
  const raw = sp[CAT_PARAM] ?? sp.where?.or?.[0]?.and?.[0]?.category?.equals;
  const active = Array.isArray(raw) ? String(raw[0]) : raw === undefined ? undefined : String(raw);
  let cats: { id: number | string; name: string }[] = [];
  try {
    const found = await payload.find({
      collection: "categories",
      sort: "order",
      limit: 50,
      depth: 0,
      pagination: false,
    });
    cats = found.docs.map((c) => ({ id: c.id, name: c.name || c.slug }));
  } catch {
    return null;
  }
  const current = cats.find((c) => String(c.id) === active);

  return (
    <>
      <div className="osl-tabs">
        <div className="osl-tabs__row" role="tablist" aria-label="Categories">
          <Link href="/admin/collections/products" className={`osl-tabs__tab${current ? "" : " is-active"}`} role="tab" aria-selected={!current}>
            All
          </Link>
          {cats.map((c) => (
            <Link key={c.id} href={productsOf(c.id)} className={`osl-tabs__tab${current?.id === c.id ? " is-active" : ""}`} role="tab" aria-selected={current?.id === c.id}>
              {c.name}
            </Link>
          ))}
        </div>
        {!current && <p className="osl-tabs__hint">Choose a category to add a product.</p>}
      </div>
      {current && <AddCard label={`Add a product to ${current.name}`} href={addProductTo(current.id)} />}
    </>
  );
}
