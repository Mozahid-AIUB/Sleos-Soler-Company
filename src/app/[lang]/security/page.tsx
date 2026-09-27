import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/security">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.security.title, description: t.legal.security.body };
}

export default async function SecurityPage({ params }: PageProps<"/[lang]/security">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const doc = t.legal.security;
  return (
    <>
      <PageHero
        eyebrow={t.legal.eyebrow}
        title={doc.title}
        body={doc.body}
        image="/media/img/electronics.webp"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: doc.title }]}
      />
      <LegalDoc updated={t.common.updated} onThisPage={t.common.onThisPage} sections={doc.sections}>
        <a href={`mailto:${site.email}?subject=${encodeURIComponent("Security report")}`} className="btn btn-dark mt-4">
          <Icon name="mail" size={18} />
          {site.email}
        </a>
      </LegalDoc>
    </>
  );
}
