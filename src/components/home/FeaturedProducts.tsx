import type { CSSProperties } from "react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { featuredProducts } from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";

export function FeaturedProducts({ lang, t }: { lang: Locale; t: Dictionary }) {
  const f = t.featured;
  const perks = [
    { icon: "truck" as const, text: t.product.delivery },
    { icon: "cash" as const, text: t.product.cod },
    { icon: "wrench" as const, text: t.product.support },
  ];
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow={f.eyebrow}
          title={f.title}
          body={f.body}
          action={
            <Link href={`/${lang}/products`} className="btn btn-outline">
              {f.viewAll}
              <Icon name="arrowRight" size={18} />
            </Link>
          }
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts().map((p, i) => (
            <div key={p.slug} className="reveal flex" style={{ "--i": i % 4 } as CSSProperties}>
              <ProductCard product={p} lang={lang} t={t.product} />
            </div>
          ))}
        </div>
        <ul className="relative mt-8 flex flex-wrap gap-x-10 gap-y-3 pt-6">
          <li
            aria-hidden="true"
            className="reveal-line pointer-events-none absolute inset-x-0 top-0 h-px bg-no-repeat text-cream-200 [background-image:linear-gradient(currentColor,currentColor)] [background-size:100%_1px]"
          />
          {perks.map((p, i) => (
            <li key={p.text} className="reveal-fade flex items-center gap-2.5 text-[14.5px] text-ink-600" style={{ "--i": i + 1 } as CSSProperties}>
              <Icon name={p.icon} size={18} className="text-teal-600" />
              {p.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
