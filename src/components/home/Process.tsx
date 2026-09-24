import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process({ lang, t }: { lang: Locale; t: Dictionary["process"] }) {
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <ol className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((s, i) => (
            <li key={s.title} className="reveal border-t-2 border-forest-900 pt-5">
              <p className="text-[14px] font-semibold text-teal-600">{localizeDigits(`0${i + 1}`, lang)}</p>
              <h3 className="mt-3 text-[20px] font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
