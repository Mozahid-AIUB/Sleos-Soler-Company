import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/motion/CountUp";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/** 1px rule that draws in on scroll; static (drawn) without JS / reduced motion. */
const RULE =
  "reveal-line h-px bg-no-repeat [background-image:linear-gradient(currentColor,currentColor)] [background-size:100%_1px]";

export function Intro({ lang, t }: { lang: Locale; t: Dictionary["intro"] }) {
  return (
    <section id="intro" className="section-y scroll-mt-20 bg-white">
      <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow reveal-fade text-teal-600">{t.eyebrow}</p>
          <SplitText as="h2" text={t.title} className="h2 mt-4" />
          <p className="lead reveal mt-6 text-ink-600" style={idx(2)}>
            {t.body}
          </p>
          <figure className="reveal mt-8 border-l-2 border-gold-500 pl-5" style={idx(3)}>
            <figcaption className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-400">{t.missionTitle}</figcaption>
            <blockquote className="mt-2 text-[17px] font-medium leading-relaxed text-ink-900">{t.mission}</blockquote>
          </figure>

          <div aria-hidden="true" className={`${RULE} mt-10 text-cream-200`} style={idx(2)} />
          <dl className="grid sm:grid-cols-2">
            {t.badges.map((b, i) => (
              <div
                key={b.title}
                className={`reveal border-b border-cream-200 py-5 ${i % 2 === 0 ? "sm:pr-6" : "sm:border-l sm:pl-6"}`}
                style={idx(2 + i)}
              >
                <dt className="font-semibold">{b.title}</dt>
                <dd className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{b.text}</dd>
              </div>
            ))}
          </dl>

          <div className="reveal-fade mt-9" style={idx(4)}>
            <Link
              href={`/${lang}/about`}
              className="group inline-flex items-center gap-2 font-semibold text-forest-900 transition-colors hover:text-teal-600"
            >
              <span className="link-line">{t.more}</span>
              <Icon name="arrowRight" size={18} className="transition-transform duration-300 group-hover:translate-x-[3px]" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 self-start">
          <div className="reveal-img relative col-span-3 aspect-[3/4] overflow-hidden rounded-lg [clip-path:inset(0)]" style={idx(1)}>
            <Image src="/media/projects/engineer-rooftop.jpg" alt="OSLEOS engineer inspecting a rooftop solar array" fill sizes="(min-width: 1024px) 28vw, 60vw" className="object-cover" />
          </div>
          <div className="col-span-2 grid gap-3">
            <div className="reveal-img relative aspect-[3/4] overflow-hidden rounded-lg [clip-path:inset(0)]" style={idx(2)}>
              <Image src="/media/projects/apartment-rooftop-dhaka.jpg" alt="Rooftop solar on a Dhaka apartment building" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
            </div>
            <div className="reveal rounded-lg border border-cream-200 bg-cream-50 p-5" style={idx(4)}>
              <p className="text-[34px] font-extrabold leading-none tabular-nums text-forest-900">
                <CountUp value={t.floatValue} />
              </p>
              <p className="mt-2 text-[13.5px] leading-snug text-ink-600">{t.floatLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
