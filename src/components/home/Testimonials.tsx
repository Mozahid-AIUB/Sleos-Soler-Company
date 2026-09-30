import { pick } from "@/i18n/content";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { testimonials, type Testimonial } from "@/content/testimonials";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Group({ label, items, lang, cols }: { label?: string; items: Testimonial[]; lang: Locale; cols: string }) {
  return (
    <div>
      {label && <h3 className="reveal-fade border-b border-cream-200 pb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-900">{label}</h3>}
      <div className={`${label ? "mt-6" : ""} grid gap-4 ${cols}`}>
        {items.map((r, i) => (
          <figure
            key={i}
            className="reveal flex flex-col rounded-lg border border-cream-200 bg-white p-6 transition-colors duration-300 hover:border-ink-400/40 sm:p-7"
            style={{ "--i": i % 4 } as CSSProperties}
          >
            <span aria-hidden="true" className="font-serif text-[44px] leading-none text-gold-500">
              “
            </span>
            <blockquote className="mt-1 flex-1 text-[15.5px] leading-relaxed text-ink-900">{pick(r.quote, lang)}</blockquote>
            <figcaption className="mt-6 border-t border-cream-200 pt-4 text-[14px]">
              <span className="block font-semibold text-ink-900">{pick(r.name, lang)}</span>
              <span className="mt-0.5 block text-ink-400">{pick(r.role, lang)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({ lang, t }: { lang: Locale; t: Dictionary["testimonials"] }) {
  const clients = testimonials.filter((r) => r.group === "clients");
  const manufacturers = testimonials.filter((r) => r.group === "manufacturers");
  return (
    <section className="section-y bg-cream-50">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        {site.draft && <p className="mt-4 text-[13px] text-ink-400">{t.sample}</p>}
        <div className="mt-12 grid gap-14">
          <Group items={clients} lang={lang} cols="sm:grid-cols-2 xl:grid-cols-4" />
          <Group label={t.manufacturers} items={manufacturers} lang={lang} cols="md:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}
