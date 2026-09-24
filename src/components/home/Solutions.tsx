import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

const order = [
  { key: "residential", image: "/media/img/p-house-solar.jpg" },
  { key: "commercial", image: "/media/img/crew-roof.jpg" },
  { key: "utility", image: "/media/img/engineer-panel.jpg" },
] as const;

export function Solutions({ lang, t, heading = true }: { lang: Locale; t: Dictionary["solutions"]; heading?: boolean }) {
  return (
    <section id="solutions" className="section-y bg-cream-50">
      <div className="container-x">
        {heading && <SectionHeading eyebrow={t.eyebrow} title={t.title} body={t.body} />}
        <div className={`grid gap-8 lg:grid-cols-3 ${heading ? "mt-14" : ""}`}>
          {order.map(({ key, image }, i) => {
            const item = t.items[key];
            return (
              <article key={key} id={key} className="group flex scroll-mt-28 flex-col md:grid md:grid-cols-2 md:items-center md:gap-8 lg:flex lg:items-stretch lg:gap-0">
                <div className="reveal-img relative aspect-[4/3] overflow-hidden rounded-lg [clip-path:inset(0)]" style={{ "--i": i } as CSSProperties}>
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.1s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
                </div>
                <div className="reveal flex flex-1 flex-col" style={{ "--i": i + 1 } as CSSProperties}>
                  <h3 className="mt-6 text-[22px] font-bold md:mt-0 lg:mt-6">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{item.text}</p>
                  <ul className="mt-4 space-y-1.5 text-[15px] text-ink-900">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5">
                        <span className="mt-[10px] h-px w-3 shrink-0 bg-ink-400" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${lang}/contact`} className="group/cta mt-6 inline-flex items-center gap-2 self-start font-semibold text-forest-900 transition-colors hover:text-teal-600">
                    <span className="link-line">{t.cta}</span>
                    <Icon name="arrowRight" size={17} className="transition-transform duration-300 group-hover/cta:translate-x-[3px]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
