import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale, localizeDigits } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Solutions } from "@/components/home/Solutions";
import { SystemPackage } from "@/components/home/SystemPackage";
import { StatBand } from "@/components/home/StatBand";
import { Process } from "@/components/home/Process";
import { Partners } from "@/components/home/Partners";
import { ContactSection } from "@/components/home/ContactSection";

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.pages.solutions.title, description: t.pages.solutions.body };
}

export default async function SolutionsPage({ params }: PageProps<"/[lang]/solutions">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.pages.solutions;
  const s = t.solutions;
  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        image="/media/projects/factory-rooftop-gazipur.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: t.nav.solutions }]}
      />
      <Solutions lang={lang} t={s} heading={false} />

      {/* Application solutions (brochure pp. 19–31) */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={s.eyebrow} title={s.applicationsTitle} body={s.applicationsBody} />
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {s.applications.map((a, i) => (
              <li key={a.title} className="reveal border-t border-cream-200 pt-5" style={{ "--i": i % 3 } as CSSProperties}>
                <p className="text-[14px] font-semibold text-teal-600">{localizeDigits(String(i + 1).padStart(2, "0"), lang)}</p>
                <h3 className="mt-3 text-[20px] font-bold">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SystemPackage lang={lang} t={s} />
      <StatBand t={t.stats} />
      <Process lang={lang} t={t.process} />
      <Partners t={t.partners} className="border-t border-cream-200 bg-cream-50" />
      <ContactSection lang={lang} t={t.contact} />
    </>
  );
}
