import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizeDigits, type Locale } from "@/i18n/config";
import { SplitText } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** "One partner. The complete system." — the full equipment package, incl. voltage stabilizers (brochure pp. 3, 7). */
export function SystemPackage({ lang, t, className = "bg-cream-50" }: { lang: Locale; t: Dictionary["solutions"]; className?: string }) {
  return (
    <section className={`section-y ${className}`}>
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SplitText as="h2" text={t.packageTitle} className="h2" />
          <p className="lead reveal mt-6 text-ink-600" style={at(2)}>
            {t.packageBody}
          </p>
          <div className="reveal-img relative mt-10 aspect-[16/10] overflow-hidden rounded-lg [clip-path:inset(0)]" style={at(2)}>
            <Image src="/media/projects/engineer-rooftop.jpg" alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[center_30%]" />
          </div>
        </div>
        <div className="self-center">
          <ul className="grid sm:grid-cols-2 sm:gap-x-10">
            {t.package.map((item, i) => (
              <li key={item} className="reveal flex items-baseline gap-4 border-b border-cream-200 py-4" style={at(i % 4)}>
                <span className="w-6 shrink-0 text-[13px] font-semibold tabular-nums text-teal-600">{localizeDigits(String(i + 1).padStart(2, "0"), lang)}</span>
                <span className="text-[16.5px] font-semibold text-ink-900">{item}</span>
              </li>
            ))}
          </ul>
          <Link href={`/${lang}/quote`} className="btn btn-dark reveal mt-10" style={at(3)}>
            {t.cta}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
