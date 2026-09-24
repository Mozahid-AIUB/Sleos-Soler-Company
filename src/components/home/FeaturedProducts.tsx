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
          {featuredProducts().map((p) => (
            <ProductCard key={p.slug} product={p} lang={lang} t={t.product} />
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-cream-200 pt-6">
          {perks.map((p) => (
            <li key={p.text} className="flex items-center gap-2.5 text-[14.5px] text-ink-600">
              <Icon name={p.icon} size={18} className="text-teal-600" />
              {p.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
