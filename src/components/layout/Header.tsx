"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { categories } from "@/content/products";
import { site, whatsappLink } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { cart, useCart } from "@/lib/cart-store";

/**
 * Underline that draws in from the left when the parent link (group/nav) is
 * hovered or focused; uses currentColor so it follows the transparent/solid
 * header colours. `on` keeps it drawn for the active section.
 */
const underline = (on: boolean) =>
  `bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] pb-0.5 transition-[background-size] duration-[450ms] ease-out-expo group-hover/nav:bg-[length:100%_1px] group-focus-visible/nav:bg-[length:100%_1px] ${
    on ? "bg-[length:100%_1px]" : "bg-[length:0%_1px]"
  }`;

/** Mobile menu rows fade/rise in one after another once the menu opens. */
const menuRow = (open: boolean, i: number) => ({
  className: `transition-[opacity,transform] duration-700 ease-out-expo ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`,
  style: { transitionDelay: open ? `${90 + i * 55}ms` : "0ms" } as CSSProperties,
});

/** Pages that open on a white background instead of a dark photo hero. */
const PLAIN_PAGE = /^\/(en|bn)\/(products\/[^/]+|cart|checkout)\/?$/;

export function Header({ lang, t }: { lang: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const overHero = !PLAIN_PAGE.test(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuOpen = menuFor === pathname;
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const solid = scrolled || !overHero || menuOpen;
  const otherLang: Locale = lang === "en" ? "bn" : "en";
  const switchHref = pathname.replace(/^\/(en|bn)(?=\/|$)/, `/${otherLang}`);

  const links = [
    { href: `/${lang}/solutions`, label: t.solutions },
    { href: `/${lang}/projects`, label: t.projects },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ];
  const navText = solid ? "text-ink-900" : "text-white";
  const navMuted = solid ? "text-ink-600 hover:text-ink-900" : "text-white/80 hover:text-white";

  return (
    <header className={`header-in fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "bg-white shadow-[0_1px_0_var(--color-cream-200)]" : "bg-transparent"}`}>
      {/* Utility bar */}
      <div
        className={`hidden overflow-hidden border-b text-[13px] transition-[height,opacity] duration-300 lg:block ${
          scrolled ? "h-0 border-transparent opacity-0" : "h-9 opacity-100"
        } ${solid ? "border-cream-200 text-ink-600" : "border-white/15 text-white/75"}`}
      >
        <div className="container-x flex h-9 items-center justify-between gap-6 whitespace-nowrap">
          <p className="hidden min-w-0 truncate xl:block">{t.utility}</p>
          <div className="ml-auto flex shrink-0 items-center gap-6">
            <a href={site.phoneHref} className="link-line">{site.phone}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="group/nav flex items-center gap-1.5">
              <WhatsappIcon size={14} />
              <span className={underline(false)}>{site.whatsappDisplay}</span>
            </a>
            <a href={`mailto:${site.email}`} className="link-line">{site.email}</a>
            <Link href={switchHref}
            prefetch={false} hrefLang={otherLang} className="group/nav flex items-center gap-1.5 font-medium">
              <Icon name="globe" size={14} />
              <span className={underline(false)}>{t.language}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
        <Link href={`/${lang}`} aria-label="OSLEOS home" className="shrink-0">
          <Logo light={!solid} priority />
        </Link>

        <nav className="hidden h-full items-center gap-1 lg:flex" aria-label="Main">
          {/* Products mega menu (hover or keyboard focus) */}
          <div className="group/mega flex h-full items-center xl:relative">
            <Link
              href={`/${lang}/products`}
              className={`group/nav flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors ${
                pathname.startsWith(`/${lang}/products`) ? navText : navMuted
              }`}
            >
              <span className={underline(pathname.startsWith(`/${lang}/products`))}>{t.products}</span>
              <Icon name="chevronDown" size={15} className="transition-transform duration-300 group-hover/mega:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-focus-within/mega:visible group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100">
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-cream-200 bg-white p-3 text-ink-900 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.25)]">
                {categories.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/${lang}/products#${c.id}`}
                    className="group/item flex translate-y-1.5 items-center gap-3 rounded-md p-2 opacity-0 transition-[opacity,transform,background-color] duration-500 ease-out-expo hover:bg-cream-50 group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100 group-hover/mega:translate-y-0 group-hover/mega:opacity-100"
                    style={{ transitionDelay: `${60 + i * 35}ms` }}
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded">
                      <Image src={c.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-700 ease-out-expo group-hover/item:scale-[1.04]" />
                    </span>
                    <span>
                      <span className="block text-[14.5px] font-semibold transition-colors group-hover/item:text-forest-900">{c.name[lang]}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-400">{c.blurb[lang]}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group/nav px-4 py-2 text-[15px] font-medium transition-colors ${pathname.startsWith(l.href) ? navText : navMuted}`}
            >
              <span className={underline(pathname.startsWith(l.href))}>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchHref}
            prefetch={false}
            hrefLang={otherLang}
            className={`inline-flex h-10 items-center px-2 text-[14px] font-medium lg:hidden ${solid ? "text-ink-900" : "text-white"}`}
          >
            {t.language}
          </Link>
          <button
            type="button"
            onClick={() => cart.open()}
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors ${solid ? "text-ink-900 hover:bg-cream-50" : "text-white hover:bg-white/10"}`}
            aria-label={`${t.cart} (${count})`}
          >
            <Icon name="cart" size={22} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-forest-950">
                {count}
              </span>
            )}
          </button>
          <Link href={`/${lang}/contact`} className="btn btn-gold hidden !min-h-11 !px-5 !text-[14px] md:inline-flex">
            {t.quote}
          </Link>
          <button
            type="button"
            onClick={() => setMenuFor(menuOpen ? null : pathname)}
            className={`inline-flex h-11 w-11 items-center justify-center lg:hidden ${solid ? "text-ink-900" : "text-white"}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.close : t.menu}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        data-lenis-prevent
        className={`fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-white transition-[opacity,visibility] duration-300 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="container-x flex min-h-full flex-col pb-10 pt-4" aria-label="Mobile">
          <Link
            href={`/${lang}/products`}
            className={`border-b border-cream-200 py-4 text-[20px] font-semibold text-ink-900 ${menuRow(menuOpen, 0).className}`}
            style={menuRow(menuOpen, 0).style}
          >
            {t.products}
          </Link>
          <div className={`grid grid-cols-2 gap-x-4 border-b border-cream-200 py-3 ${menuRow(menuOpen, 1).className}`} style={menuRow(menuOpen, 1).style}>
            {categories.map((c) => (
              <Link key={c.id} href={`/${lang}/products#${c.id}`} className="py-2 text-[15px] text-ink-600">
                {c.name[lang]}
              </Link>
            ))}
          </div>
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`border-b border-cream-200 py-4 text-[20px] font-semibold text-ink-900 ${menuRow(menuOpen, i + 2).className}`}
              style={menuRow(menuOpen, i + 2).style}
            >
              {l.label}
            </Link>
          ))}
          <div className={`mt-auto grid gap-3 pt-8 ${menuRow(menuOpen, links.length + 2).className}`} style={menuRow(menuOpen, links.length + 2).style}>
            <Link href={`/${lang}/contact`} className="btn btn-gold w-full">
              {t.quote}
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
              <WhatsappIcon size={18} />
              {site.whatsappDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
