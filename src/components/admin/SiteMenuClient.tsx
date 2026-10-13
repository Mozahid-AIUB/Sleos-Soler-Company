"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, type CSSProperties } from "react";

type Cat = { id: number | string; name: string };

const catColors = ["#d97706", "#0891b2", "#16a34a", "#9333ea", "#2563eb", "#dc2626", "#0d9488", "#c026d3", "#ea580c", "#4f46e5"];

const productsOf = (id: number | string) => `/admin/collections/products?where[or][0][and][0][category][equals]=${id}`;
const CAT_PARAM = "where[or][0][and][0][category][equals]";

type Item = { label: string; bn?: string; icon: string; color: string; href?: string; match?: string };

const websiteMenu: Item[] = [
  { label: "Solutions", bn: "সলিউশনস", icon: "solutions", color: "#0891b2" },
  { label: "Projects", bn: "প্রজেক্ট", icon: "projects", color: "#2563eb", href: "/admin/collections/projects", match: "/admin/collections/projects" },
  { label: "About", bn: "আমাদের সম্পর্কে · টিম", icon: "about", color: "#0f766e", href: "/admin/collections/team-members", match: "/admin/collections/team-members" },
  { label: "Contact", bn: "যোগাযোগ", icon: "contact", color: "#ea580c" },
];

const alsoOnSite: Item[] = [
  { label: "Customer reviews", bn: "কাস্টমার রিভিউ (হোমপেজ)", icon: "testimonials", color: "#7c3aed", href: "/admin/collections/testimonials", match: "/admin/collections/testimonials" },
  { label: "Photos & files", bn: "ছবি ও ফাইল", icon: "media", color: "#db2777", href: "/admin/collections/media", match: "/admin/collections/media" },
];

function Card({ item, active }: { item: Item; active: boolean }) {
  const style = { "--c": item.color } as CSSProperties;
  const inner = (
    <>
      <span className="osl-side__text">
        <strong>{item.label}</strong>
        {item.bn && <small>{item.bn}</small>}
      </span>
      {!item.href && <em className="osl-side__soon">soon</em>}
    </>
  );
  if (!item.href) {
    return (
      <div className="osl-side__link is-soon" data-icon={item.icon} style={style} title="Coming soon">
        {inner}
      </div>
    );
  }
  return (
    <Link href={item.href} className={`osl-side__link${active ? " is-active" : ""}`} data-icon={item.icon} style={style}>
      {inner}
    </Link>
  );
}

export function SiteMenuClient({ cats, isOwner }: { cats: Cat[]; isOwner: boolean }) {
  const pathname = usePathname() ?? "";
  const activeCat = useSearchParams().get(CAT_PARAM);
  const onProducts = pathname.startsWith("/admin/collections/products") || pathname.startsWith("/admin/collections/categories");
  // Products is open while you work on products; otherwise it can be opened by hand.
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? onProducts;

  return (
    <div className="osl-side">
      <p className="osl-side__label">Website menu · ওয়েবসাইটের মেনু</p>

      <div className="osl-side__group">
        <button
          type="button"
          className={`osl-side__link osl-side__toggle${onProducts ? " is-active" : ""}`}
          data-icon="products"
          style={{ "--c": "#b7791f" } as CSSProperties}
          aria-expanded={open}
          onClick={() => setManual(!open)}
        >
          <span className="osl-side__text">
            <strong>Products</strong>
            <small>প্রোডাক্ট · ক্যাটাগরি অনুযায়ী</small>
          </span>
          <span className="osl-side__chev" aria-hidden="true">
            {open ? "▾" : "▸"}
          </span>
        </button>

        {open && (
          <div className="osl-side__sub">
            <Link
              href="/admin/collections/products/create"
              className="osl-side__add"
            >
              + Add product · নতুন প্রোডাক্ট
            </Link>
            <Link
              href="/admin/collections/products"
              className={`osl-side__subitem${pathname === "/admin/collections/products" && !activeCat ? " is-active" : ""}`}
              style={{ "--c": "#16191b" } as CSSProperties}
            >
              <span className="osl-side__dot" />
              All products
            </Link>
            {cats.map((c, i) => (
              <Link
                key={c.id}
                href={productsOf(c.id)}
                className={`osl-side__subitem${activeCat === String(c.id) ? " is-active" : ""}`}
                style={{ "--c": catColors[i % catColors.length] } as CSSProperties}
              >
                <span className="osl-side__dot" />
                {c.name}
              </Link>
            ))}
            <Link href="/admin/collections/categories" className="osl-side__manage">
              Category cards · ক্যাটাগরি কার্ড
            </Link>
          </div>
        )}
      </div>

      {websiteMenu.map((m) => (
        <Card key={m.label} item={m} active={Boolean(m.match && pathname.startsWith(m.match))} />
      ))}

      <p className="osl-side__label">Also shown on the website · ওয়েবসাইটে আরও যা দেখায়</p>
      {alsoOnSite.map((m) => (
        <Card key={m.label} item={m} active={Boolean(m.match && pathname.startsWith(m.match))} />
      ))}

      {isOwner && (
        <>
          <p className="osl-side__label">Team and access</p>
          <Card item={{ label: "Staff users", bn: "স্টাফ ও পাসওয়ার্ড", icon: "users", color: "#4b5563", href: "/admin/collections/users", match: "/admin/collections/users" }} active={pathname.startsWith("/admin/collections/users")} />
        </>
      )}
    </div>
  );
}
