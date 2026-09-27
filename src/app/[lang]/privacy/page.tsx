import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { LegalDoc } from "@/components/legal/LegalDoc";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.privacy.title, description: t.legal.privacy.body };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const doc = t.legal.privacy;
  return (
    <>
      <PageHero
        eyebrow={t.legal.eyebrow}
        title={doc.title}
        body={doc.body}
        image="/media/img/panels-closeup.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: doc.title }]}
      />
      <LegalDoc updated={t.common.updated} onThisPage={t.common.onThisPage} sections={doc.sections} />
    </>
  );
}
