import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export function ProjectCard({
  project,
  lang,
  t,
  large = false,
}: {
  project: Project;
  lang: Locale;
  t: Dictionary["projects"];
  large?: boolean;
}) {
  return (
    <article className={`reveal group relative isolate flex flex-col justify-end overflow-hidden rounded-xl text-white ${large ? "min-h-[440px] lg:min-h-[580px]" : "min-h-[420px]"}`}>
      <Image
        src={project.image}
        alt={project.title[lang]}
        fill
        sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
        className="-z-10 object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/45 to-transparent" />
      {site.draft && project.sample && (
        <span className="absolute right-5 top-5 text-[12px] font-medium text-white/60">
          {t.sample}
        </span>
      )}
      <div className="p-7 lg:p-9">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold-400">{project.type[lang]}</p>
        <h3 className={`mt-3 font-bold tracking-tight ${large ? "text-[clamp(26px,3vw,38px)]" : "text-[24px]"}`}>{project.title[lang]}</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-white/70">{project.summary[lang]}</p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-[14px]">
          <div>
            <dt className="text-white/50">{t.capacity}</dt>
            <dd className="mt-0.5 text-[18px] font-bold">{localizeDigits(project.capacity, lang)}</dd>
          </div>
          <div>
            <dt className="text-white/50">{t.location}</dt>
            <dd className="mt-0.5 flex items-center gap-1.5 text-[18px] font-bold">
              <Icon name="pin" size={16} className="text-gold-400" />
              {project.location[lang]}
            </dd>
          </div>
          <div>
            <dt className="text-white/50">{t.year}</dt>
            <dd className="mt-0.5 text-[18px] font-bold">{localizeDigits(project.year, lang)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
