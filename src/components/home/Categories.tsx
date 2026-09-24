import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { categories } from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

export function Categories({ lang, t }: { lang: Locale; t: Dictionary["categories"] }) {
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
          {categories.filter((c) => c.home !== false).map((c, i) => (
            <Link
              key={c.id}
              href={`/${lang}/products#${c.id}`}
              className={`reveal group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-lg p-7 text-white ${
                i < 2 ? "lg:col-span-3 lg:min-h-[380px]" : "lg:col-span-2"
              }`}
            >
              <Image
                src={c.image}
                alt=""
                fill
                sizes={i < 2 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                className="-z-10 object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/95 via-forest-950/40 to-transparent" />
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-bold tracking-tight">{c.name[lang]}</h3>
                  <p className="mt-1.5 text-[14.5px] text-white/70">{c.blurb[lang]}</p>
                </div>
                <Icon name="arrowRight" size={20} className="shrink-0 text-white/70 transition-transform group-hover:translate-x-1 group-hover:text-gold-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
