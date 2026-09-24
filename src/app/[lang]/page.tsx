import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Hero } from "@/components/home/Hero";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { Intro } from "@/components/home/Intro";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Solutions } from "@/components/home/Solutions";
import { StatBand } from "@/components/home/StatBand";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { ContactSection } from "@/components/home/ContactSection";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} t={t} />
      <TrustMarquee label={t.trust} />
      <Intro lang={lang} t={t.intro} />
      <Categories lang={lang} t={t.categories} />
      <FeaturedProducts lang={lang} t={t} />
      <Solutions lang={lang} t={t.solutions} />
      <StatBand t={t.stats} />
      <ProjectsShowcase lang={lang} t={t.projects} />
      <Process lang={lang} t={t.process} />
      <Testimonials lang={lang} t={t.testimonials} />
      <Newsletter t={t.newsletter} />
      <ContactSection lang={lang} t={t.contact} />
    </>
  );
}
