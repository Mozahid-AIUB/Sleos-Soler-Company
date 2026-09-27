import type { CSSProperties } from "react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { SplitText } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";
import { BrandFilmPlayer } from "@/components/home/BrandFilmPlayer";

export function BrandFilm({ lang, t }: { lang: Locale; t: Dictionary["film"] }) {
  return (
    <section className="section-y bg-forest-950 text-white">
      <div className="container-x grid items-center gap-12 md:grid-cols-[1.2fr_1fr] lg:gap-24">
        <div>
          <p className="eyebrow reveal-fade text-gold-400">{t.eyebrow}</p>
          <SplitText as="h2" text={t.title} className="h2 mt-4 text-white" />
          <p className="lead reveal mt-6 max-w-xl text-white/70" style={{ "--i": 2 } as CSSProperties}>
            {t.body}
          </p>
          <ul className="reveal mt-8 space-y-3 text-white/85" style={{ "--i": 3 } as CSSProperties}>
            {t.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-[11px] h-px w-4 shrink-0 bg-gold-400" />
                {p}
              </li>
            ))}
          </ul>
          <Link href={`/${lang}/quote`} className="btn btn-gold reveal mt-10" style={{ "--i": 4 } as CSSProperties}>
            {t.cta}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
        <div className="reveal mx-auto w-full max-w-[380px]" style={{ "--i": 1 } as CSSProperties}>
          <BrandFilmPlayer src="/media/video/osleos-brand-film.mp4" poster="/media/img/brand-film-poster.webp" label={t.play} />
        </div>
      </div>
    </section>
  );
}
