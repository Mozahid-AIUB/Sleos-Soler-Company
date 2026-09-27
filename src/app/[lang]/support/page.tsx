import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale, localizeDigits } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, whatsappLink } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitText } from "@/components/motion/SplitText";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[lang]/support">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.support.eyebrow, description: t.support.body };
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default async function SupportPage({ params }: PageProps<"/[lang]/support">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const s = t.support;

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.title}
        body={s.body}
        image="/media/img/electrician.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: s.eyebrow }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={site.phones[0].href} className="btn btn-gold !min-h-[52px]">
            <Icon name="phone" size={18} />
            {site.phones[0].display}
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-glass !min-h-[52px]">
            <WhatsappIcon size={18} />
            {s.whatsapp}
          </a>
        </div>
      </PageHero>

      {/* Hotline */}
      <section className="border-b border-cream-200 bg-cream-50">
        <div className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-20 lg:py-20">
          <div>
            <p className="eyebrow reveal-fade text-teal-600">{s.hotlineTitle}</p>
            <p className="lead reveal mt-4 max-w-md text-ink-600" style={at(1)}>
              {s.hotlineBody}
            </p>
          </div>
          <div className="reveal grid gap-6 sm:grid-cols-2" style={at(2)}>
            <ul className="space-y-1">
              {site.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="text-[clamp(24px,2.4vw,30px)] font-bold tracking-tight text-forest-900 transition-colors hover:text-teal-600">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <dl className="grid content-start gap-3 text-[15px]">
              <div>
                <dt className="text-ink-400">{t.contact.hoursLabel}</dt>
                <dd className="font-semibold text-ink-900">{t.contact.hours}</dd>
              </div>
              <div>
                <dt className="text-ink-400">{t.contact.whatsapp}</dt>
                <dd>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-line font-semibold text-ink-900">
                    {site.whatsappDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Warranty & after-sales */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={s.eyebrow} title={s.afterTitle} />
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {s.after.map((a, i) => (
              <div key={a.title} className="reveal border-t-2 border-forest-900 pt-5" style={at(i % 4)}>
                <h3 className="text-[19px] font-bold">{a.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-600">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Energy Guardian */}
      <section className="section-y bg-forest-950 text-white">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow reveal-fade text-gold-400">{s.guardianEyebrow}</p>
            <SplitText as="h2" text={s.guardianTitle} className="h2 mt-5" />
            <p className="lead reveal mt-6 max-w-xl text-white/65" style={at(2)}>
              {s.guardianBody}
            </p>
            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {s.guardian.map((g, i) => (
                <li key={g} className="reveal flex items-center gap-3 border-t border-white/10 py-3.5 text-[15px] font-medium" style={at(Math.min(i, 5))}>
                  <Icon name="check" size={17} strokeWidth={2.2} className="shrink-0 text-gold-400" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal-img relative aspect-[4/3] overflow-hidden rounded-lg" style={at(1)}>
            <Image src="/media/img/engineer-field.webp" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={s.processEyebrow} title={s.processTitle} />
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} className="reveal border-t border-cream-200 pt-5" style={at(i % 4)}>
                <p className="text-[14px] font-semibold text-teal-600">{localizeDigits(`0${i + 1}`, lang)}</p>
                <h3 className="mt-3 text-[19px] font-bold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y border-t border-cream-200 bg-cream-50">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <p className="eyebrow reveal-fade text-teal-600">FAQ</p>
            <SplitText as="h2" text={s.faqTitle} className="h2 mt-4" />
          </div>
          <div className="border-t border-cream-200">
            {s.faq.map((item, i) => (
              <details key={item.q} className="reveal group border-b border-cream-200" style={at(Math.min(i, 4))}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Icon name="plus" size={20} className="shrink-0 text-teal-600 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="-mt-1 max-w-2xl pb-6 leading-relaxed text-ink-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="container-x flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between lg:py-20">
          <div>
            <h2 className="reveal text-[clamp(24px,2.6vw,34px)] font-bold">{s.ctaTitle}</h2>
            <p className="reveal mt-2 text-ink-600" style={at(1)}>
              {s.ctaBody}
            </p>
          </div>
          <div className="reveal flex flex-col gap-3 sm:flex-row" style={at(2)}>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              <WhatsappIcon size={18} />
              {s.whatsapp}
            </a>
            <Link href={`/${lang}/quote`} className="btn btn-outline">
              {t.nav.quote}
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
