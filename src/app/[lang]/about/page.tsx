import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale, localizeDigits } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { SplitText } from "@/components/motion/SplitText";
import { StatBand } from "@/components/home/StatBand";
import { Partners } from "@/components/home/Partners";
import { SystemPackage } from "@/components/home/SystemPackage";
import { Newsletter } from "@/components/home/Newsletter";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.pages.about.eyebrow, description: t.pages.about.body };
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const a = t.pages.about;
  return (
    <>
      <PageHero
        eyebrow={a.eyebrow}
        title={a.title}
        body={a.body}
        image="/media/projects/warehouse-rooftop-narayanganj.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: t.nav.about }]}
      />

      {/* Story */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal-img relative aspect-[5/4] overflow-hidden rounded-lg bg-forest-900 md:aspect-[16/9] lg:aspect-[5/4]">
            <video
              src="/media/video/engineers-field.mp4"
              poster="/media/img/engineers-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow reveal-fade text-teal-600">{a.storyTitle}</p>
            <SplitText as="h2" text={t.intro.title} className="h2 mt-5" />
            {a.story.map((para, i) => (
              <p key={para.slice(0, 20)} className="lead reveal mt-6 text-ink-600" style={at(Math.min(i + 2, 4))}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & approach */}
      <section className="section-y bg-forest-950 text-white">
        <div className="container-x grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="eyebrow reveal-fade text-gold-400">{a.missionTitle}</p>
            <SplitText as="p" text={t.intro.mission} className="mt-6 text-[clamp(24px,2.6vw,36px)] font-semibold leading-[1.25] tracking-tight" />
          </div>
          <div>
            <p className="reveal-fade text-[13px] font-semibold uppercase tracking-[0.16em] text-white/50">{a.approachTitle}</p>
            <ol className="mt-5 grid grid-cols-3 gap-x-4 border-t border-white/15 sm:grid-cols-5">
              {a.approach.map((step, i) => (
                <li key={step} className="reveal pt-4" style={at(i)}>
                  <span className="block text-[13px] font-semibold tabular-nums text-gold-400">{localizeDigits(`0${i + 1}`, lang)}</span>
                  <span className="mt-1.5 block text-[14px] font-semibold sm:text-[16px]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Why OSLEOS */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={a.whyEyebrow} title={a.whyTitle} />
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {a.why.map((w, i) => (
              <li key={w.title} className="reveal border-t-2 border-forest-900 pt-5" style={at(i % 5)}>
                <span className="text-[14px] font-semibold tabular-nums text-teal-600">{localizeDigits(`0${i + 1}`, lang)}</span>
                <h3 className="mt-3 text-[19px] font-bold leading-snug">{w.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{w.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="section-y bg-cream-50">
        <div className="container-x">
          <SectionHeading eyebrow={a.ecosystemEyebrow} title={a.ecosystemTitle} body={a.ecosystemBody} />
          <ul className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {a.ecosystem.map((e, i) => (
              <li key={e.title} className="reveal border-t border-cream-200 pt-5" style={at(i % 4)}>
                <h3 className="text-[18px] font-bold">{e.title}</h3>
                <p className="mt-1.5 text-[15px] text-ink-600">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SystemPackage lang={lang} t={t.solutions} className="bg-white" />
      <Partners t={t.partners} className="border-t border-cream-200 bg-cream-50" />

      {/* Values */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={a.eyebrow} title={a.valuesTitle} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <div key={v.title} className="reveal border-t-2 border-forest-900 pt-5" style={at(i % 4)}>
                <h3 className="text-[20px] font-bold">{v.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatBand t={t.stats} />

      {/* Certifications */}
      <section className="section-y bg-forest-950 text-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow reveal-fade text-gold-400">{t.trust}</p>
            <SplitText as="h2" text={a.certTitle} className="h2 mt-5" />
          </div>
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {site.certifications.map((c, i) => (
              <li key={c} className="reveal border-t border-white/15 py-4 text-[15px] font-semibold" style={at(i % 6)}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative isolate flex h-[46vh] min-h-[320px] items-center overflow-hidden bg-forest-950 text-white">
        <div className="reveal-img absolute inset-0 -z-10">
          <Image src="/media/img/panels-field.webp" alt="" fill sizes="100vw" className="object-cover object-[center_60%]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/85 via-forest-950/55 to-forest-950/20" />
        <div className="container-x">
          <SplitText as="p" text={t.footer.tagline} className="display max-w-3xl text-[clamp(32px,4.6vw,64px)]" />
        </div>
      </section>

      <Newsletter t={t.newsletter} />
    </>
  );
}
