import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

const order = [
  { key: "residential", image: "/media/projects/apartment-rooftop-dhaka.jpg" },
  { key: "commercial", image: "/media/projects/roof-to-revenue-chattogram.jpg" },
  { key: "utility", image: "/media/projects/solar-irrigation-rajshahi.jpg" },
] as const;

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** On-grid / off-grid / hybrid comparison (brochure "Which solar system is right for you?"). */
function Systems({ lang, t }: { lang: Locale; t: Dictionary["solutions"] }) {
  return (
    <div>
      <h3 className="reveal-fade text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-400">{t.systemsTitle}</h3>
      <ol className="mt-6 grid gap-x-10 gap-y-10 md:grid-cols-3">
        {t.systems.map((s, i) => (
          <li key={s.name} className="reveal relative flex flex-col pt-6" style={at(i)}>
            <span
              aria-hidden="true"
              className="reveal-line pointer-events-none absolute inset-x-0 top-0 h-px bg-cream-200 bg-no-repeat text-forest-900 [background-image:linear-gradient(currentColor,currentColor)] [background-size:100%_1px]"
              style={at(i + 1)}
            />
            <p className="text-[14px] font-semibold text-teal-600">{localizeDigits(`0${i + 1}`, lang)}</p>
            <h4 className="mt-2 text-[24px] font-bold tracking-tight">{s.name}</h4>
            <p className="mt-2.5 leading-relaxed text-ink-600">{s.text}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] font-medium text-ink-900">
              {s.flow.map((f, n) => (
                <span key={f} className="inline-flex items-center gap-1.5">
                  {n > 0 && <span aria-hidden="true" className="text-gold-500">→</span>}
                  {f}
                </span>
              ))}
            </p>
            <dl className="mt-5 grid gap-3 border-t border-cream-200 pt-4 text-[14px]">
              <div>
                <dt className="text-ink-400">{t.idealFor}</dt>
                <dd className="mt-0.5 text-ink-900">{s.ideal}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-400">{t.outage}</dt>
                <dd className={`inline-flex items-center gap-1.5 font-semibold ${s.backup ? "text-forest-900" : "text-ink-400"}`}>
                  {s.backup ? <Icon name="check" size={16} className="text-teal-600" /> : <Icon name="minus" size={16} />}
                  {s.backup ? t.yes : t.no}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Solutions({ lang, t, heading = true }: { lang: Locale; t: Dictionary["solutions"]; heading?: boolean }) {
  return (
    <section id="solutions" className="section-y bg-cream-50">
      <div className="container-x">
        {heading && <SectionHeading eyebrow={t.eyebrow} title={t.title} body={t.body} />}
        <div className={heading ? "mt-14" : ""}>
          <Systems lang={lang} t={t} />
        </div>
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {order.map(({ key, image }, i) => {
            const item = t.items[key];
            return (
              <article key={key} id={key} className="group flex scroll-mt-28 flex-col md:grid md:grid-cols-2 md:items-center md:gap-8 lg:flex lg:items-stretch lg:gap-0">
                <div className="reveal-img relative aspect-[4/3] overflow-hidden rounded-lg [clip-path:inset(0)]" style={at(i)}>
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.1s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
                </div>
                <div className="reveal flex flex-1 flex-col" style={at(i + 1)}>
                  <h3 className="mt-6 text-[22px] font-bold md:mt-0 lg:mt-6">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{item.text}</p>
                  <ul className="mt-4 space-y-1.5 text-[15px] text-ink-900">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5">
                        <span className="mt-[10px] h-px w-3 shrink-0 bg-ink-400" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${lang}/quote`} className="group/cta mt-6 inline-flex items-center gap-2 self-start font-semibold text-forest-900 transition-colors hover:text-teal-600">
                    <span className="link-line">{t.cta}</span>
                    <Icon name="arrowRight" size={17} className="transition-transform duration-300 group-hover/cta:translate-x-[3px]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
