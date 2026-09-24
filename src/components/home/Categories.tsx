import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { categories } from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

export function Categories({ lang, t }: { lang: Locale; t: Dictionary["categories"] }) {
  const homeCategories = categories.filter((c) => c.home !== false);
  return (
    <section className="section-y relative overflow-hidden bg-cream-50">
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          body={t.body}
          action={
            <Link href={`/${lang}/products`} className="btn btn-outline">
              {t.viewAll}
              <Icon name="arrowRight" size={18} />
            </Link>
          }
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {homeCategories.map((c, i) => {
            // Stagger by column: row one has 2 tiles, following rows 3.
            const col = i < 2 ? i : (i - 2) % 3;
            // On the 2-column tablet grid an odd last tile spans the full row instead of sitting alone.
            const lastOdd = i === homeCategories.length - 1 && homeCategories.length % 2 === 1;
            return (
              <Link
                key={c.id}
                href={`/${lang}/products#${c.id}`}
                className={`lift group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-lg bg-forest-950 p-7 text-white ${
                  i < 2 ? "lg:col-span-3 lg:min-h-[380px]" : "lg:col-span-2"
                } ${lastOdd ? "sm:max-lg:col-span-2" : ""}`}
              >
                <div
                  className="reveal-img absolute inset-0 -z-10 [clip-path:inset(0)]"
                  style={{ "--i": col } as CSSProperties}
                >
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes={i < 2 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/40 to-transparent" />
                </div>
                <div className="reveal flex items-end justify-between gap-4" style={{ "--i": col + 2 } as CSSProperties}>
                  <div>
                    <h3 className="text-[24px] font-bold tracking-tight">{c.name[lang]}</h3>
                    <p className="mt-1.5 text-[14.5px] text-white/70">{c.blurb[lang]}</p>
                  </div>
                  <Icon name="arrowRight" size={20} className="shrink-0 text-white/70 transition duration-300 group-hover:translate-x-1 group-hover:text-gold-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
