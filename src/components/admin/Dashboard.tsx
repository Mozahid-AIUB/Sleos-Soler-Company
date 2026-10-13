/* eslint-disable @next/next/no-img-element -- admin-only thumbnails */
import Link from "next/link";
import type { ServerProps } from "payload";
import { AdminIcon } from "./icons";
import { addProductTo, productsOf, thumbOf } from "./links";

/*
 * First screen after login. The same five sections as the website menu, then
 * the product categories laid out like the website's Products drop-down, then
 * a short how-to, in plain English.
 */

type Section = {
  label: string;
  icon: string;
  open: string;
  add?: { href: string; label: string };
  count?: "products" | "projects" | "team-members" | "testimonials";
  noun?: string;
  note?: string;
};

const sections: Section[] = [
  { label: "Products", icon: "products", open: "/admin/collections/products", count: "products", noun: "product" },
  { label: "Solutions", icon: "solutions", open: "/admin/globals/solutions-page", note: "Page text and lists" },
  { label: "Projects", icon: "projects", open: "/admin/collections/projects", add: { href: "/admin/collections/projects/create", label: "Add project" }, count: "projects", noun: "project" },
  { label: "About", icon: "about", open: "/admin/collections/team-members", add: { href: "/admin/collections/team-members/create", label: "Add person" }, count: "team-members", noun: "team member" },
  { label: "Contact", icon: "contact", open: "/admin/globals/contact", note: "Phone, email, address, map, social links" },
  { label: "Customer reviews", icon: "reviews", open: "/admin/collections/testimonials", add: { href: "/admin/collections/testimonials/create", label: "Add review" }, count: "testimonials", noun: "review" },
];

type Cat = { id: number | string; name: string; image?: string; count: number };

const plural = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

export async function Dashboard({ payload }: ServerProps) {
  const counts: Partial<Record<NonNullable<Section["count"]>, number>> = {};
  let cats: Cat[] = [];
  let newForms = 0;
  try {
    newForms = (await payload.count({ collection: "measurement-forms", where: { status: { equals: "new" } } })).totalDocs;
    await Promise.all(
      sections.map(async (s) => {
        if (s.count) counts[s.count] = (await payload.count({ collection: s.count })).totalDocs;
      }),
    );
    const found = await payload.find({ collection: "categories", sort: "order", limit: 50, depth: 1, pagination: false });
    cats = await Promise.all(
      found.docs.map(async (c) => ({
        id: c.id,
        name: c.name || c.slug,
        image: thumbOf(c.image),
        count: (await payload.count({ collection: "products", where: { category: { equals: c.id } } })).totalDocs,
      })),
    );
  } catch {
    /* counts are a nicety; the links still work without them */
  }

  return (
    <div className="osl-dash">
      <header className="osl-dash__head">
        <h1>What would you like to change?</h1>
        <p>
          The menu on the left has the same names as the website menu. Open a section to add, change, hide or delete.
        </p>
      </header>

      {newForms > 0 && (
        <Link href="/admin/collections/measurement-forms?where[status][equals]=new" className="osl-dash__alert">
          <span className="osl-dash__alertnum">{newForms}</span>
          <span>
            <strong>
              New Measurement Form{newForms === 1 ? "" : "s"} from the website
            </strong>
            <small>Open to see the answers, photos and bills, then call the customer.</small>
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <div className="osl-dash__grid">
        {sections.map((s) => (
          <section key={s.label} className="osl-dash__card">
            <Link href={s.open} className="osl-dash__main">
              <span className="osl-dash__icon">
                <AdminIcon name={s.icon} size={22} />
              </span>
              <span className="osl-dash__name">{s.label}</span>
              <span className="osl-dash__meta">{s.count && counts[s.count] !== undefined ? plural(counts[s.count]!, s.noun!) : s.note}</span>
            </Link>
            <div className="osl-dash__actions">
              <Link href={s.open} className="osl-btn osl-btn--ghost">
                {s.count ? "See all" : "Edit"}
              </Link>
              {s.add && (
                <Link href={s.add.href} className="osl-btn">
                  <AdminIcon name="plus" size={16} />
                  {s.add.label}
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>

      {cats.length > 0 && (
        <section className="osl-dash__cats">
          <div className="osl-dash__cathead">
            <h2>Products by category</h2>
            <p>Like the Products menu on the website. Click a category to see its products.</p>
          </div>
          <div className="osl-mega">
            {cats.map((c) => (
              <div key={c.id} className="osl-mega__item">
                <Link href={productsOf(c.id)} className="osl-mega__link">
                  {c.image ? <img src={c.image} alt="" /> : <span className="osl-mega__noimg" />}
                  <span>
                    <strong>{c.name}</strong>
                    <small>{plural(c.count, "product")}</small>
                  </span>
                </Link>
                <Link href={addProductTo(c.id)} className="osl-mega__add" title={`Add a product to ${c.name}`}>
                  <AdminIcon name="plus" size={16} />
                  Add
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="osl-dash__help">
        <h2>How to change something</h2>
        <ol>
          <li>
            <strong>Open the item</strong> and change the text, or press <em>Add</em> for a new one.
          </li>
          <li>
            <strong>Write in English.</strong> Everything in the admin is in English.
          </li>
          <li>
            <strong>Press Save.</strong> The website shows the change within a minute. <em>Hide from website</em> keeps it safe without deleting.
          </li>
        </ol>
      </section>
    </div>
  );
}
