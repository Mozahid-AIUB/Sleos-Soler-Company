import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, whatsappLink } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IncentiveHighlight } from "@/components/home/IncentiveHighlight";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[lang]/incentive">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.incentive.pageTitle, description: t.incentive.body };
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default async function IncentivePage({ params }: PageProps<"/[lang]/incentive">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const s = t.incentive;

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.pageTitle}
        body={s.body}
        image="/media/projects/apartment-rooftop-dhaka.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: s.pageTitle }]}
      />

      <IncentiveHighlight lang={lang} t={s} compact />

      <section className="section-y bg-white">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow={s.eyebrow} title={s.benefitsTitle} />
            <ul className="mt-10 border-t border-cream-200">
              {s.benefits.map((b, i) => (
                <li key={b} className="reveal flex gap-4 border-b border-cream-200 py-4" style={at(i % 4)}>
                  <Icon name="check" size={20} strokeWidth={2.2} className="mt-0.5 shrink-0 text-teal-600" />
                  <span className="leading-relaxed text-ink-900">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="OSLEOS" title={s.whyTitle} />
            <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-cream-200 bg-cream-200 sm:grid-cols-2">
              {s.why.map((w, i) => (
                <li key={w} className="reveal bg-cream-50 p-5 font-medium text-ink-900" style={at(i % 4)}>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y bg-forest-950 text-white">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHeading dark eyebrow={s.cta} title={s.quoteTitle} body={s.quoteBody} />
          </div>
          <div className="reveal grid gap-3" style={at(2)}>
            <Link href={`/${lang}/quote`} className="btn btn-gold w-full !min-h-[54px]">
              {s.cta}
              <Icon name="arrowRight" size={18} />
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-glass w-full !min-h-[54px]">
              <WhatsappIcon size={18} />
              {site.whatsappDisplay}
            </a>
            {site.phones.map((p) => (
              <a key={p.href} href={p.href} className="btn btn-glass w-full !min-h-[54px]">
                <Icon name="phone" size={18} />
                {p.display}
              </a>
            ))}
          </div>
        </div>
      </section>

      <p className="container-x py-8 text-[13px] leading-relaxed text-ink-400">{s.note}</p>
    </>
  );
}
