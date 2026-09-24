import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/project/ProjectCard";
import { StatBand } from "@/components/home/StatBand";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactSection } from "@/components/home/ContactSection";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.pages.projects.title, description: t.pages.projects.body };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.pages.projects;
  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        image="/media/img/rooftop-sunset.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: t.nav.projects }]}
      />
      <section className="section-y bg-forest-950">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              // First card is the wide feature; an odd last card also spans the row so it never sits alone.
              className={i === 0 || (i === projects.length - 1 && projects.length % 2 === 0) ? "md:col-span-2" : ""}
              style={{ "--i": i === 0 ? 0 : (i - 1) % 2 } as CSSProperties}
            >
              <ProjectCard project={project} lang={lang} t={t.projects} large={i === 0} />
            </div>
          ))}
        </div>
      </section>
      <StatBand t={t.stats} />
      <Testimonials lang={lang} t={t.testimonials} />
      <ContactSection lang={lang} t={t.contact} />
    </>
  );
}
