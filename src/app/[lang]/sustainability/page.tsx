import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale, localizeDigits } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitText } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[lang]/sustainability">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.sustainability.eyebrow, description: t.sustainability.body };
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default async function SustainabilityPage({ params }: PageProps<"/[lang]/sustainability">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const s = t.sustainability;

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.title}
        body={s.body}
        image="/media/img/aerial-forest.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: s.eyebrow }]}
      />

      {/* Why solar for Bangladesh */}
      <section className="section-y bg-white">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow reveal-fade text-teal-600">{s.eyebrow}</p>
            <SplitText as="h2" text={s.introTitle} className="h2 mt-5" />
            {s.intro.map((para, i) => (
              <p key={para.slice(0, 24)} className="lead reveal mt-6 text-ink-600" style={at(i + 2)}>
                {para}
              </p>
            ))}
          </div>
          <div className="reveal-img relative aspect-[5/4] overflow-hidden rounded-lg md:aspect-[16/9] lg:aspect-[5/4]">
            <Image src="/media/img/rooftop-sunset.webp" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="section-y bg-forest-950 text-white">
        <div className="container-x">
          <SectionHeading eyebrow={s.eyebrow} title={s.impactTitle} dark />
          <ul className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {s.impact.map((m, i) => (
              <li key={m.label} className="reveal border-t border-white/15 pt-6" style={at(i)}>
                <p className="text-[clamp(40px,4.4vw,60px)] font-bold leading-none tracking-tight text-gold-400">{m.value}</p>
                <p className="mt-4 max-w-xs leading-relaxed text-white/70">{m.label}</p>
              </li>
            ))}
          </ul>
          <p className="reveal-fade mt-12 text-[13px] text-white/45">{s.impactNote}</p>
        </div>
      </section>

      {/* Commitments */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={s.eyebrow} title={s.pillarsTitle} />
          <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {s.pillars.map((p, i) => (
              <li key={p.title} className="reveal border-t-2 border-forest-900 pt-5" style={at(i % 3)}>
                <p className="text-[13px] font-semibold text-teal-600">{localizeDigits(`0${i + 1}`, lang)}</p>
                <h3 className="mt-2 text-[20px] font-bold">{p.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-600">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Statement */}
      <section className="relative isolate flex min-h-[380px] items-center overflow-hidden bg-forest-950 py-20 text-white">
        <div className="reveal-img absolute inset-0 -z-10">
          <Image src="/media/img/panels-field.webp" alt="" fill sizes="100vw" className="object-cover object-[center_60%]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/60 to-forest-950/25" />
        <div className="container-x">
          <SplitText as="p" text={s.quote} className="display max-w-4xl text-[clamp(30px,4.2vw,58px)]" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-50">
        <div className="container-x flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between lg:py-20">
          <div className="max-w-2xl">
            <h2 className="reveal text-[clamp(24px,2.6vw,34px)] font-bold">{s.ctaTitle}</h2>
            <p className="reveal mt-2 leading-relaxed text-ink-600" style={at(1)}>
              {s.ctaBody}
            </p>
          </div>
          <Link href={`/${lang}/quote`} className="reveal btn btn-gold shrink-0 !min-h-[52px]" style={at(2)}>
            {t.nav.quote}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
