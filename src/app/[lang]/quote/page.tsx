import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale, localizeDigits } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, whatsappLink } from "@/content/site";
import { products } from "@/content/products";
import { PageHero } from "@/components/ui/PageHero";
import { QuoteSheet } from "@/components/forms/QuoteSheet";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[lang]/quote">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: `${t.quote.title} · ${t.quote.eyebrow}`, description: t.quote.body };
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default async function QuotePage({ params }: PageProps<"/[lang]/quote">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const q = t.quote;
  // slug → name, so a "Request a Quote" link can pre-fill the product without shipping the catalogue.
  const productNames = Object.fromEntries(products.map((p) => [p.slug, p.name]));

  return (
    <>
      <PageHero
        eyebrow={q.eyebrow}
        title={q.title}
        body={q.body}
        image="/media/img/engineer-field.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: q.title }]}
      />

      <section className="bg-cream-50 py-14 lg:py-24">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-14">
          <div className="reveal rounded-lg border border-cream-200 bg-white p-5 sm:p-10">
            <QuoteSheet lang={lang} t={q} productNames={productNames} />
          </div>

          <aside className="lg:sticky lg:top-28">
            <p className="reveal text-[clamp(22px,2vw,28px)] font-bold leading-snug text-ink-900" style={at(1)}>
              {q.asideTitle}
            </p>
            <ol className="mt-8">
              {q.why.map((w, i) => (
                <li key={w.title} className="reveal grid grid-cols-[2.25rem_1fr] border-t border-cream-200 py-5" style={at(i + 2)}>
                  <span className="text-[13px] font-semibold tabular-nums text-teal-600">{localizeDigits(`0${i + 1}`, lang)}</span>
                  <span>
                    <span className="block font-semibold text-ink-900">{w.title}</span>
                    <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-600">{w.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="reveal mt-4 rounded-lg bg-forest-900 p-6 text-white sm:p-7" style={at(4)}>
              <p className="eyebrow text-gold-400">{q.prefer}</p>
              <ul className="mt-4 space-y-1">
                {site.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="link-line text-[20px] font-bold tracking-tight">
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex items-center gap-1.5 text-[14px] text-white/60">
                <Icon name="clock" size={15} />
                {t.contact.hours}
              </p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-6 w-full">
                <WhatsappIcon size={18} />
                {site.whatsappDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Technical terms guide (page 3 of the client's Measurement Form PDF) */}
      <section id="guide" className="border-t border-cream-200 bg-white py-14 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow reveal-fade text-teal-600">{q.eyebrow}</p>
            <h2 className="reveal mt-3 text-[clamp(26px,2.8vw,36px)] font-bold leading-tight tracking-tight text-ink-900">{q.guideTitle}</h2>
            <p className="reveal mt-3 leading-relaxed text-ink-600" style={at(1)}>
              {q.guideBody}
            </p>
          </div>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-lg border border-cream-200 bg-cream-200 sm:grid-cols-2 lg:grid-cols-3">
            {q.guide.map((g, i) => (
              <div key={g.term} className="reveal bg-white p-6" style={at(i % 3)}>
                <dt className="font-semibold text-ink-900">{g.term}</dt>
                <dd className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{g.text}</dd>
              </div>
            ))}
          </dl>
          <p className="reveal mt-6 text-[14px] text-ink-400">{q.guideTip}</p>
        </div>
      </section>
    </>
  );
}
