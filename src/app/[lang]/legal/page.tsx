import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { LegalDoc } from "@/components/legal/LegalDoc";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.terms.title, description: t.legal.terms.body };
}

export default async function LegalPage({ params }: PageProps<"/[lang]/legal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const doc = t.legal.terms;
  return (
    <>
      <PageHero
        eyebrow={t.legal.eyebrow}
        title={doc.title}
        body={doc.body}
        image="/media/img/panels-sky.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: doc.title }]}
      />
      <LegalDoc updated={t.common.updated} onThisPage={t.common.onThisPage} sections={doc.sections} />
    </>
  );
}
