import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Icon } from "@/components/ui/Icon";

export function ProjectsShowcase({ lang, t }: { lang: Locale; t: Dictionary["projects"] }) {
  const [first, second, third] = projects;
  return (
    <section className="section-y bg-forest-950 text-white">
      <div className="container-x">
        <SectionHeading
          dark
          eyebrow={t.eyebrow}
          title={t.title}
          body={t.body}
          action={
            <Link href={`/${lang}/projects`} className="btn btn-glass">
              {t.viewAll}
              <Icon name="arrowRight" size={18} />
            </Link>
          }
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <ProjectCard project={first} lang={lang} t={t} large i={0} />
          <div className="grid gap-5">
            <ProjectCard project={second} lang={lang} t={t} i={1} />
            <ProjectCard project={third} lang={lang} t={t} i={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
