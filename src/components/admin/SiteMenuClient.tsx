"use client";

/* eslint-disable @next/next/no-img-element -- admin-only thumbnails */
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useNav } from "@payloadcms/ui";
import { AdminIcon } from "./icons";
import { CAT_PARAM, productsOf } from "./links";

export type MenuCategory = { id: number | string; name: string; image?: string };

type Item = { label: string; icon: string; href: string };

/** Same names and order as the website's top menu (after Products). */
const websiteMenu: Item[] = [
  { label: "Solutions", icon: "solutions", href: "/admin/globals/solutions-page" },
  { label: "Projects", icon: "projects", href: "/admin/collections/projects" },
  { label: "About", icon: "about", href: "/admin/collections/team-members" },
  { label: "Contact", icon: "contact", href: "/admin/globals/contact" },
];

function MenuLink({ item, active }: { item: Item; active: boolean }) {
  return (
    <Link href={item.href} className={`osl-nav__item${active ? " is-active" : ""}`}>
      <AdminIcon name={item.icon} />
      <span className="osl-nav__text">{item.label}</span>
    </Link>
  );
}

export function SiteMenuClient({ cats, isOwner, newForms }: { cats: MenuCategory[]; isOwner: boolean; newForms: number }) {
  const pathname = usePathname() ?? "";
  const activeCat = useSearchParams().get(CAT_PARAM);
  const onProducts = pathname.startsWith("/admin/collections/products") || pathname.startsWith("/admin/collections/categories");
  // Products is open while you work on products; otherwise it can be opened by hand.
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? onProducts;
  const is = (href: string) => pathname.startsWith(href);

  // Payload closes the menu on screens up to 1440px (most laptops). This menu is how the client
  // finds everything, so on laptops and desktops it stays open (the ☰ button is hidden there by
  // CSS). Deferred, so it runs after Payload's own effects that close it.
  const { hydrated, navOpen, setNavOpen } = useNav();

  // Everything is edited in English (the language switch is hidden by CSS). If a saved
  // preference or an old link opens the admin in another language, switch back to English.
  const locale = useLocale();
  const router = useRouter();
  useEffect(() => {
    if (!locale?.code || locale.code === "en") return;
    const params = new URLSearchParams(window.location.search);
    params.set("locale", "en");
    router.replace(`${window.location.pathname}?${params.toString()}`);
  }, [locale?.code, router]);
  useEffect(() => {
    if (!hydrated || navOpen || !window.matchMedia("(min-width: 1025px)").matches) return;
    const timer = window.setTimeout(() => setNavOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, navOpen, setNavOpen]);

  return (
    <nav className="osl-nav" aria-label="Website sections">
      <Link href="/admin" className={`osl-nav__item${pathname === "/admin" ? " is-active" : ""}`}>
        <AdminIcon name="home" />
        <span className="osl-nav__text">Dashboard</span>
      </Link>

      <Link href="/admin/collections/measurement-forms" className={`osl-nav__item${is("/admin/collections/measurement-forms") ? " is-active" : ""}`}>
        <AdminIcon name="forms" />
        <span className="osl-nav__text">Measurement forms</span>
        {newForms > 0 && (
          <span className="osl-nav__badge" title={`${newForms} new`}>
            {newForms}
          </span>
        )}
      </Link>

      <p className="osl-nav__label">Website menu</p>

      <button type="button" className={`osl-nav__item${onProducts ? " is-active" : ""}`} aria-expanded={open} onClick={() => setManual(!open)}>
        <AdminIcon name="products" />
        <span className="osl-nav__text">Products</span>
        <span className={`osl-nav__chev${open ? " is-open" : ""}`}>
          <AdminIcon name="chevron" size={16} />
        </span>
      </button>

      {open && (
        <div className="osl-nav__sub">
          {cats.map((c) => (
            <Link key={c.id} href={productsOf(c.id)} className={`osl-nav__cat${activeCat === String(c.id) ? " is-active" : ""}`}>
              {c.image ? <img src={c.image} alt="" className="osl-nav__catimg" /> : <span className="osl-nav__catimg" />}
              {c.name}
            </Link>
          ))}
          <Link href="/admin/collections/categories" className={`osl-nav__manage${is("/admin/collections/categories") ? " is-active" : ""}`}>
            Rename categories / change pictures
          </Link>
        </div>
      )}

      {websiteMenu.map((m) => (
        <MenuLink key={m.href} item={m} active={is(m.href)} />
      ))}

      <p className="osl-nav__label">Home page</p>
      <MenuLink item={{ label: "Customer reviews", icon: "reviews", href: "/admin/collections/testimonials" }} active={is("/admin/collections/testimonials")} />

      {isOwner && (
        <>
          <p className="osl-nav__label">Admin</p>
          <MenuLink item={{ label: "Staff & passwords", icon: "users", href: "/admin/collections/users" }} active={is("/admin/collections/users")} />
        </>
      )}

      <a href="/en" target="_blank" rel="noreferrer" className="osl-nav__site">
        <AdminIcon name="external" size={16} />
        View the website
      </a>
    </nav>
  );
}
