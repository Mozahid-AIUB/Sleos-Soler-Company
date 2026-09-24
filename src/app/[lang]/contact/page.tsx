import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { ContactSection } from "@/components/home/ContactSection";
import { Process } from "@/components/home/Process";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.pages.contact.title, description: t.pages.contact.body };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.pages.contact;
  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        image="/media/img/electrician.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: t.nav.contact }]}
      />
      <ContactSection lang={lang} t={t.contact} heading={false} />
      <Process lang={lang} t={t.process} />
    </>
  );
}
