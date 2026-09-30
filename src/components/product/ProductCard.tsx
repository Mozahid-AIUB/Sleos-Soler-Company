import { pick } from "@/i18n/content";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { categories, type Product } from "@/content/products";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";

export const quoteHref = (lang: Locale, slug: string) => `/${lang}/quote?product=${encodeURIComponent(slug)}`;

export function ProductCard({ product, lang, t }: { product: Product; lang: Locale; t: Dictionary["product"] }) {
  const href = `/${lang}/products/${product.slug}`;
  const category = categories.find((c) => c.id === product.category);
  return (
    <article className="group flex w-full flex-col overflow-hidden lift rounded-lg border border-cream-200 bg-white hover:border-ink-400/40">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-cream-100" aria-label={product.name}>
        <ProductImage src={product.image} alt={product.brand ? `${product.brand} ${product.name}` : product.name} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-2 text-[12.5px] font-medium text-ink-400">
          {product.brand && <span className="font-semibold uppercase tracking-[0.08em] text-teal-600">{product.brand}</span>}
          {product.brand && <span aria-hidden="true">·</span>}
          <span>{category && pick(category.name, lang)}</span>
        </p>
        <h3 className="mt-1.5 text-[17px] font-bold leading-snug">
          <Link href={href} className="transition-colors hover:text-teal-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 pb-5 text-[14px] text-ink-600">{pick(product.keySpec, lang)}</p>
        <div className="mt-auto grid gap-2">
          <Link href={quoteHref(lang, product.slug)} className="btn btn-dark w-full !min-h-11 !text-[14px]">
            {t.requestQuote}
            <Icon name="arrowRight" size={17} />
          </Link>
          <Link href={href} className="py-1.5 text-center text-[13.5px] font-semibold text-ink-600 transition-colors hover:text-ink-900">
            {t.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
