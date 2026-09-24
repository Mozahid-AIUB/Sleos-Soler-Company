import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";

export function Intro({ lang, t }: { lang: Locale; t: Dictionary["intro"] }) {
  return (
    <section id="intro" className="section-y scroll-mt-20 bg-white">
      <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="reveal">
          <p className="eyebrow text-teal-600">{t.eyebrow}</p>
          <h2 className="h2 mt-4">{t.title}</h2>
          <p className="lead mt-6 text-ink-600">{t.body}</p>

          <dl className="mt-10 grid border-t border-cream-200 sm:grid-cols-2">
            {t.badges.map((b, i) => (
              <div key={b.title} className={`border-b border-cream-200 py-5 ${i % 2 === 0 ? "sm:pr-6" : "sm:border-l sm:pl-6"}`}>
                <dt className="font-semibold">{b.title}</dt>
                <dd className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{b.text}</dd>
              </div>
            ))}
          </dl>

          <Link href={`/${lang}/about`} className="mt-9 inline-flex items-center gap-2 font-semibold text-forest-900 hover:text-teal-600">
            {t.more}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <div className="reveal grid grid-cols-5 gap-3 self-start">
          <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-lg">
            <Image src="/media/img/installer-carry.jpg" alt="Installer carrying a solar module on site" fill sizes="(min-width: 1024px) 28vw, 60vw" className="object-cover" />
          </div>
          <div className="col-span-2 grid gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image src="/media/img/engineer-field.jpg" alt="Engineer inspecting a ground-mounted solar array" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
            </div>
            <div className="rounded-lg bg-forest-900 p-5 text-white">
              <p className="text-[34px] font-extrabold leading-none">{t.floatValue}</p>
              <p className="mt-2 text-[13.5px] leading-snug text-white/70">{t.floatLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
