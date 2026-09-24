import Link from "next/link";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/content/site";
import { categories } from "@/content/products";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";

export function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  const f = t.footer;
  // Colour shift plus a hairline underline drawn from the left on hover/focus.
  const linkClass =
    "text-ink-600 bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_1px] transition-[color,background-size] duration-[450ms] ease-out-expo hover:text-forest-900 hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]";
  const col = (i: number) => ({ className: "reveal", style: { "--i": i } as CSSProperties });
  const headingClass = "text-[14px] font-semibold text-ink-900";
  return (
    <footer className="border-t border-cream-200 bg-white text-[14.5px]">
      <div className="container-x grid gap-12 pb-14 pt-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10">
        <div {...col(0)}>
          <Logo light={false} />
          <p className="mt-5 max-w-xs leading-relaxed text-ink-600">{f.about}</p>
          <div className="mt-7">
            <SocialLinks dark={false} />
          </div>
        </div>

        <div {...col(1)}>
          <h3 className={headingClass}>{f.shop}</h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${lang}/products#${c.id}`} className={linkClass}>
                  {c.name[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div {...col(2)}>
          <h3 className={headingClass}>{f.company}</h3>
          <ul className="mt-4 space-y-2.5">
            <li><Link href={`/${lang}/about`} className={linkClass}>{t.nav.about}</Link></li>
            <li><Link href={`/${lang}/solutions`} className={linkClass}>{t.nav.solutions}</Link></li>
            <li><Link href={`/${lang}/projects`} className={linkClass}>{t.nav.projects}</Link></li>
            <li><Link href={`/${lang}/contact`} className={linkClass}>{f.installers}</Link></li>
            <li><Link href={`/${lang}/contact`} className={linkClass}>{f.warranty}</Link></li>
          </ul>
        </div>

        <div {...col(3)}>
          <h3 className={headingClass}>{t.nav.contact}</h3>
          <address className="mt-4 space-y-2.5 not-italic text-ink-600">
            <p>{site.address[lang]}</p>
            <p>
              <a href={site.phoneHref} className={linkClass}>{site.phone}</a>
            </p>
            <p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp {site.whatsappDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a>
            </p>
            <p className="text-ink-400">{t.contact.hours}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-cream-200">
        <div className="reveal-fade container-x flex flex-col gap-2 py-6 pr-24 text-[13px] text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:pr-8 lg:pr-28">
          <p>
            © 2026 {site.name}. {f.rights} · SREDA · BSTI
          </p>
          {site.draft && <p>{t.common.draft}</p>}
        </div>
      </div>
    </footer>
  );
}
