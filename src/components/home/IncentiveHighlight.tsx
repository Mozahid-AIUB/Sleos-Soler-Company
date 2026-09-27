import type { CSSProperties } from "react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { SplitText } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";

/** Government rooftop-solar incentive (2026): headline + four key facts. */
export function IncentiveHighlight({ lang, t, compact = false }: { lang: Locale; t: Dictionary["incentive"]; compact?: boolean }) {
  return (
    <section className="border-b border-cream-200 bg-cream-50">
      <div className="container-x py-16 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow reveal-fade text-teal-600">{t.eyebrow}</p>
            <SplitText as="h2" text={t.title} className="h2 mt-4 !text-[clamp(28px,3.4vw,46px)]" />
            <p className="lead reveal mt-4 text-ink-600" style={{ "--i": 2 } as CSSProperties}>
              {t.body}
            </p>
          </div>
          <div className="reveal flex shrink-0 flex-wrap gap-3" style={{ "--i": 3 } as CSSProperties}>
            <Link href={`/${lang}/quote`} className="btn btn-gold">
              {t.cta}
              <Icon name="arrowRight" size={18} />
            </Link>
            {!compact && (
              <Link href={`/${lang}/incentive`} className="btn btn-outline">
                {t.more}
              </Link>
            )}
          </div>
        </div>
        <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-cream-200 bg-cream-200 sm:grid-cols-2 lg:grid-cols-4">
          {t.facts.map((f, i) => (
            <div key={f.value} className="reveal bg-white p-6" style={{ "--i": i } as CSSProperties}>
              <dt className="text-[clamp(22px,2.2vw,28px)] font-bold tracking-tight text-ink-900">{f.value}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
