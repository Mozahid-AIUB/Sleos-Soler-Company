import Link from "next/link";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/content/site";
import { categories } from "@/content/products";
import { Logo } from "@/components/ui/Logo";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  const f = t.footer;
  // Colour shift plus a hairline underline drawn from the left on hover/focus.
  const linkClass =
    "text-ink-600 bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_1px] transition-[color,background-size] duration-[450ms] ease-out-expo hover:text-forest-900 hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]";
  const col = (i: number) => ({ className: "reveal", style: { "--i": i } as CSSProperties });
  const headingClass = "text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-900";

  const company = [
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/solutions`, label: t.nav.solutions },
    { href: `/${lang}/projects`, label: t.nav.projects },
    { href: `/${lang}/sustainability`, label: t.nav.sustainability },
    { href: `/${lang}/support`, label: t.nav.support },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];
  const legal = [
    { href: `/${lang}/security`, label: f.security },
    { href: `/${lang}/legal-contacts`, label: f.legalContacts },
    { href: `/${lang}/privacy`, label: f.privacy },
    { href: `/${lang}/legal`, label: f.legalStatement },
  ];

  return (
    <footer className="border-t border-cream-200 bg-white text-[14.5px]">
      <div className="container-x pt-16">
        {/* Brand row */}
        <div className="reveal-fade flex flex-col gap-8 border-b border-cream-200 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo light={false} />
            <p className="mt-5 max-w-md leading-relaxed text-ink-600">{f.about}</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-[13px] font-medium text-ink-400">{f.follow}</p>
            <SocialLinks dark={false} />
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr_1.6fr] lg:py-14">
          <div {...col(0)}>
            <h3 className={headingClass}>{f.products}</h3>
            <ul className="mt-5 space-y-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/${lang}/products#${c.id}`} className={linkClass}>
                    {c.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div {...col(1)}>
            <h3 className={headingClass}>{f.company}</h3>
            <ul className="mt-5 space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div {...col(2)}>
            <h3 className={headingClass}>{f.contact}</h3>
            <address className="mt-5 space-y-3 not-italic text-ink-600">
              <p className="max-w-[18rem] leading-relaxed">
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {site.address[lang]}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a>
              </p>
              <p>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-1.5`}>
                  <WhatsappIcon size={15} />
                  {site.whatsappDisplay}
                </a>
              </p>
              <p>
                <Link href={`/${lang}/links`} className={`${linkClass} inline-flex items-center gap-1`}>
                  {f.links}
                  <Icon name="arrowUpRight" size={14} />
                </Link>
              </p>
            </address>
          </div>

          <div {...col(3)} className="reveal grid gap-10 sm:col-span-2 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1 lg:gap-9">
            <div>
              <h3 className={headingClass}>{f.hotline}</h3>
              <ul className="mt-4 space-y-1">
                {site.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="text-[22px] font-bold tracking-tight text-forest-900 transition-colors hover:text-teal-600">
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex items-center gap-1.5 text-ink-400">
                <Icon name="clock" size={15} />
                {t.contact.hours}
              </p>
            </div>
            <div>
              <h3 className={headingClass}>{f.subscribeTitle}</h3>
              <p className="mb-4 mt-3 leading-relaxed text-ink-600">{f.subscribeBody}</p>
              <NewsletterForm
                compact
                subject="Monthly updates subscription — OSLEOS website"
                t={{ ...t.newsletter, submit: f.subscribeSubmit, done: f.subscribeDone }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-200 bg-cream-50">
        <div className="reveal-fade container-x flex flex-col gap-4 py-6 pb-24 text-[13px] text-ink-400 sm:pb-6 lg:flex-row lg:items-center lg:justify-between lg:pr-28">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line text-ink-600 transition-colors hover:text-forest-900">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="sm:pr-24 lg:pr-0">
            © 2026 {site.name}. {f.rights} · {f.years}
            {site.draft && <span className="block pt-1 text-[12px]">{t.common.draft}</span>}
          </p>
        </div>
      </div>
    </footer>
  );
}
