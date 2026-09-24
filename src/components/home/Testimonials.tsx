import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { testimonials } from "@/content/testimonials";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials({ lang, t }: { lang: Locale; t: Dictionary["testimonials"] }) {
  return (
    <section className="section-y bg-cream-50">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        {site.draft && <p className="mt-4 text-[13px] text-ink-400">{t.sample}</p>}
        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-cream-200">
          {testimonials.map((r, i) => (
            <figure key={i} className="reveal flex flex-col lg:px-10 lg:first:pl-0 lg:last:pr-0">
              <blockquote className="flex-1 text-[17px] leading-relaxed text-ink-900">“{r.quote[lang]}”</blockquote>
              <figcaption className="mt-6 text-[14.5px]">
                <span className="font-semibold">{r.name[lang]}</span>
                <span className="text-ink-400"> · {r.role[lang]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
