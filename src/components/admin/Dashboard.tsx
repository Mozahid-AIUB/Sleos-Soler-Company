import Link from "next/link";
import type { CSSProperties } from "react";
import type { ServerProps } from "payload";

/*
 * First screen after login: big colourful "add something" cards, a card per
 * website category (so it is obvious which category a product belongs to),
 * and a three-step guide, in plain English with a short Bangla line.
 */

type Collection = "products" | "team-members" | "projects" | "testimonials" | "media";
type Action = { title: string; bn: string; href: string; collection: Collection; list: string; color: string };

const actions: Action[] = [
  { title: "Add a product", bn: "নতুন প্রোডাক্ট যোগ করুন", href: "/admin/collections/products/create", collection: "products", list: "/admin/collections/products", color: "#b7791f" },
  { title: "Add a team member", bn: "টিম মেম্বার যোগ করুন", href: "/admin/collections/team-members/create", collection: "team-members", list: "/admin/collections/team-members", color: "#0f766e" },
  { title: "Add a project", bn: "নতুন প্রজেক্ট যোগ করুন", href: "/admin/collections/projects/create", collection: "projects", list: "/admin/collections/projects", color: "#2563eb" },
  { title: "Add a customer review", bn: "কাস্টমার রিভিউ যোগ করুন", href: "/admin/collections/testimonials/create", collection: "testimonials", list: "/admin/collections/testimonials", color: "#7c3aed" },
  { title: "Upload a photo or PDF", bn: "ছবি বা PDF আপলোড করুন", href: "/admin/collections/media/create", collection: "media", list: "/admin/collections/media", color: "#db2777" },
];

/** One colour per website category, in menu order. */
const categoryColors = ["#d97706", "#0891b2", "#16a34a", "#9333ea", "#2563eb", "#dc2626", "#0d9488", "#c026d3", "#ea580c", "#4f46e5"];

type CategoryCard = { id: number | string; name: string; count: number };

export async function Dashboard({ payload }: ServerProps) {
  const counts: Partial<Record<Collection, number>> = {};
  let cats: CategoryCard[] = [];
  try {
    await Promise.all(
      actions.map(async (a) => {
        counts[a.collection] = (await payload.count({ collection: a.collection })).totalDocs;
      }),
    );
    const found = await payload.find({ collection: "categories", sort: "order", limit: 50, depth: 0, pagination: false });
    cats = await Promise.all(
      found.docs.map(async (c) => ({
        id: c.id,
        name: c.name || c.slug,
        count: (await payload.count({ collection: "products", where: { category: { equals: c.id } } })).totalDocs,
      })),
    );
  } catch {
    /* counts are a nicety; the buttons still work without them */
  }

  return (
    <div className="osl-dash">
      <h2 className="osl-dash__title">What would you like to do?</h2>
      <p className="osl-dash__bn">আপনি কী করতে চান?</p>

      <div className="osl-dash__grid">
        {actions.map((a) => (
          <div key={a.href} className="osl-dash__card">
            <Link href={a.href} className="osl-dash__action" style={{ "--c": a.color } as CSSProperties}>
              <span className="osl-dash__plus" aria-hidden="true">+</span>
              <span>
                <strong>{a.title}</strong>
                <small>{a.bn}</small>
              </span>
            </Link>
            <Link href={a.list} className="osl-dash__list" style={{ "--c": a.color } as CSSProperties}>
              See all{counts[a.collection] !== undefined ? ` (${counts[a.collection]})` : ""} · সব দেখুন
            </Link>
          </div>
        ))}
        <div className="osl-dash__card">
          <a href="/en" target="_blank" rel="noreferrer" className="osl-dash__action osl-dash__action--site">
            <span className="osl-dash__plus" aria-hidden="true">↗</span>
            <span>
              <strong>View the website</strong>
              <small>ওয়েবসাইট দেখুন</small>
            </span>
          </a>
        </div>
      </div>

      {cats.length > 0 && (
        <>
          <h3 className="osl-dash__sub">Products by category · ক্যাটাগরি অনুযায়ী প্রোডাক্ট</h3>
          <p className="osl-dash__hint">
            Every product belongs to one category. Press Add product, then choose the category from the list at the top of the form.
            <small>ফর্মের উপরের তালিকা থেকে ক্যাটাগরি বেছে নিন, ওয়েবসাইটে সেই ক্যাটাগরিতেই দেখাবে।</small>
          </p>
          <div className="osl-dash__cats">
            {cats.map((c, i) => (
              <div key={c.id} className="osl-dash__cat" style={{ "--c": categoryColors[i % categoryColors.length] } as CSSProperties}>
                <strong>{c.name}</strong>
                <span className="osl-dash__badge">
                  {c.count} product{c.count === 1 ? "" : "s"}
                </span>
                <div className="osl-dash__catlinks">
                  <Link href={`/admin/collections/products?where[or][0][and][0][category][equals]=${c.id}`}>View</Link>
                  <Link href={`/admin/collections/products/create`} className="osl-dash__catadd">
                    + Add product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="osl-dash__guide">
        <h3>How to change the website in 3 steps · ৩ ধাপে ওয়েবসাইট বদলান</h3>
        <ol>
          <li>
            <strong>Fill in the English text.</strong> Pick the item (or press <em>Create New</em>) and write in English.
            <small>প্রথমে ইংরেজি লেখাটি লিখুন।</small>
          </li>
          <li>
            <strong>Switch the language to বাংলা</strong> (<em>Locale</em>, top right) and write the Bangla text in the same boxes.
            <small>উপরে ডানে Locale থেকে বাংলা বেছে একই ঘরে বাংলা লিখুন। বাংলা না লিখলে ইংরেজি দেখাবে।</small>
          </li>
          <li>
            <strong>Press Publish.</strong> The website updates within a minute.
            <small>Publish চাপুন। ১ মিনিটের মধ্যে ওয়েবসাইটে দেখা যাবে।</small>
          </li>
        </ol>
        <p className="osl-dash__tip">
          <strong>Hiding something?</strong> Open it and press <em>Unpublish</em> instead of deleting. You can bring it back any time.
          <small>মুছে না ফেলে Unpublish করলে লুকানো থাকে, পরে আবার দেখানো যায়।</small>
        </p>
      </div>
    </div>
  );
}
