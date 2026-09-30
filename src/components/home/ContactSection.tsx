import { pick } from "@/i18n/content";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/content/site";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { SplitText } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;
const linkClass = "underline decoration-cream-200 underline-offset-4 transition-colors hover:text-forest-900 hover:decoration-forest-900";

export function ContactSection({
  lang,
  t,
  heading = true,
}: {
  lang: Locale;
  t: Dictionary["contact"];
  heading?: boolean;
}) {
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: t.call,
      value: (
        <span className="grid gap-1">
          {site.phones.map((p) => (
            <a key={p.href} href={p.href} className={`${linkClass} justify-self-start`}>
              {p.display}
            </a>
          ))}
        </span>
      ),
    },
    {
      label: t.whatsapp,
      value: (
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {site.whatsappDisplay}
        </a>
      ),
    },
    {
      label: t.write,
      value: (
        <a href={`mailto:${site.email}`} className={linkClass}>
          {site.email}
        </a>
      ),
    },
    {
      label: t.visit,
      value: (
        <span className="grid gap-1.5">
          <span className="leading-relaxed">{pick(site.address, lang)}</span>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 justify-self-start text-[14px] font-semibold text-teal-600 transition-colors hover:text-forest-900"
          >
            {t.directions}
            <Icon name="arrowUpRight" size={15} />
          </a>
        </span>
      ),
    },
    { label: t.hoursLabel, value: t.hours },
  ];

  return (
    <section id="contact" className="section-y scroll-mt-20 bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div>
          {heading && (
            <>
              <p className="eyebrow reveal-fade text-teal-600">{t.eyebrow}</p>
              <SplitText as="h2" text={t.title} className="h2 mt-4" />
              <p className="lead reveal mt-5 text-ink-600" style={idx(2)}>
                {t.body}
              </p>
            </>
          )}

          <div
            aria-hidden="true"
            className={`reveal-line h-px bg-no-repeat text-cream-200 [background-image:linear-gradient(currentColor,currentColor)] [background-size:100%_1px] ${heading ? "mt-10" : ""}`}
            style={idx(heading ? 2 : 0)}
          />
          <dl>
            {rows.map((r, i) => (
              <div key={r.label} style={idx((heading ? 2 : 0) + Math.min(i, 3))} className="reveal grid grid-cols-[110px_1fr] gap-4 border-b border-cream-200 py-4 text-[15px] sm:grid-cols-[160px_1fr]">
                <dt className="text-ink-400">{r.label}</dt>
                <dd className="min-w-0 font-medium text-ink-900">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="reveal-fade mt-8" style={idx(heading ? 5 : 3)}>
            <SocialLinks dark={false} />
          </div>
        </div>

        <div className="grid content-start gap-5">
          <div className="reveal rounded-lg border border-cream-200 bg-cream-50 p-6 sm:p-10" style={idx(1)}>
            <QuoteForm t={t} />
          </div>
          <Link
            href={`/${lang}/quote`}
            className="reveal group/sheet flex items-center justify-between gap-6 rounded-lg bg-forest-900 p-6 text-white transition-colors hover:bg-forest-800 sm:px-10 sm:py-7"
            style={idx(2)}
          >
            <span>
              <span className="block text-[17px] font-bold">{t.sheetTitle}</span>
              <span className="mt-1.5 block max-w-lg text-[14.5px] leading-relaxed text-white/65">{t.sheetBody}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-gold-400">
                {t.sheetCta}
                <Icon name="arrowRight" size={16} className="transition-transform duration-300 group-hover/sheet:translate-x-1" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
