import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatBand } from "@/components/home/StatBand";
import { Process } from "@/components/home/Process";
import { Newsletter } from "@/components/home/Newsletter";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.pages.about.eyebrow, description: t.pages.about.body };
}

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
        image="/media/img/engineer-panel.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: t.nav.about }]}
      />

      {/* Story */}
      <section className="section-y bg-cream-50">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal relative aspect-[5/4] overflow-hidden rounded-xl bg-forest-900">
            <video
              src="/media/video/engineers-field.mp4"
              poster="/media/img/engineers-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="reveal">
            <p className="eyebrow text-teal-600">{a.storyTitle}</p>
            <h2 className="h2 mt-5">{t.intro.title}</h2>
            {a.story.map((para) => (
              <p key={para.slice(0, 20)} className="lead mt-6 text-ink-600">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={a.eyebrow} title={a.valuesTitle} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v) => (
              <div key={v.title} className="reveal border-t-2 border-forest-900 pt-5">
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
          <div className="reveal">
            <p className="eyebrow text-gold-400">{t.trust}</p>
            <h2 className="h2 mt-5">{a.certTitle}</h2>
          </div>
          <ul className="reveal grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {site.certifications.map((c) => (
              <li key={c} className="border-t border-white/15 py-4 text-[15px] font-semibold">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative h-[46vh] min-h-[320px] overflow-hidden">
        <Image src="/media/img/solar-wind.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </section>

      <Process lang={lang} t={t.process} />
      <Newsletter t={t.newsletter} />
    </>
  );
}
