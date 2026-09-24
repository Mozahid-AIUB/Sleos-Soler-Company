import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { Solutions } from "@/components/home/Solutions";
import { StatBand } from "@/components/home/StatBand";
import { Process } from "@/components/home/Process";
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
  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        image="/media/img/utility-aerial.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: t.nav.solutions }]}
      />
      <Solutions lang={lang} t={t.solutions} heading={false} />
      <StatBand t={t.stats} />
      <Process lang={lang} t={t.process} />
      <ContactSection lang={lang} t={t.contact} />
    </>
  );
}
