import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatPrice, type Locale } from "@/i18n/config";
import { categories, type Product } from "@/content/products";
import { ProductImage } from "@/components/product/ProductImage";
import { CartButtons } from "@/components/product/CartButtons";

export function ProductCard({ product, lang, t }: { product: Product; lang: Locale; t: Dictionary["product"] }) {
  const href = `/${lang}/products/${product.slug}`;
  const category = categories.find((c) => c.id === product.category);
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-lg border border-cream-200 bg-white transition-colors hover:border-ink-400/40">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-cream-100" aria-label={product.name}>
        <ProductImage src={product.image} alt={product.name} />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-[12px] font-semibold text-forest-900">{product.badge[lang]}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12.5px] font-medium text-ink-400">{category?.name[lang]}</p>
        <h3 className="mt-1 text-[17px] font-bold leading-snug">
          <Link href={href} className="hover:text-teal-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[14px] text-ink-600">{product.keySpec[lang]}</p>
        <div className="mt-4 flex items-baseline gap-2 pb-4">
          {product.price ? (
            <>
              <span className="text-[20px] font-bold tabular-nums">{formatPrice(product.price, lang)}</span>
              {product.compareAt && <span className="text-[13.5px] text-ink-400 line-through tabular-nums">{formatPrice(product.compareAt, lang)}</span>}
            </>
          ) : (
            <span className="text-[15px] font-semibold text-ink-600">{t.priceOnRequest}</span>
          )}
        </div>
        <div className="mt-auto">
          <CartButtons lang={lang} slug={product.slug} quoteOnly={product.price === null} t={t} />
        </div>
      </div>
    </article>
  );
}
