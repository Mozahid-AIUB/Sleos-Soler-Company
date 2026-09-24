"use client";

import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatPrice, type Locale } from "@/i18n/config";
import { cart } from "@/lib/cart-store";
import { useCartTotals, QtyControl } from "@/components/cart/CartDrawer";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";

export function CartPageView({ lang, t, tp }: { lang: Locale; t: Dictionary["cart"]; tp: Dictionary["product"] }) {
  const { items, subtotal } = useCartTotals();

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-5 rounded-xl border border-cream-200 bg-white p-10">
        <p className="text-ink-600">{t.empty}</p>
        <Link href={`/${lang}/products`} className="btn btn-dark">
          {t.emptyCta}
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <ul className="card-soft divide-y divide-cream-200 px-6 sm:px-8">
        {items.map(({ slug, qty, product }) => (
          <li key={slug} className="flex gap-5 py-6">
            <Link href={`/${lang}/products/${slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
              <ProductImage src={product.image} alt={product.name} sizes="96px" />
            </Link>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/${lang}/products/${slug}`} className="text-[17px] font-semibold hover:text-teal-600">
                  {product.name}
                </Link>
                <p className="mt-1 text-[14px] text-ink-600">{product.keySpec[lang]}</p>
                <button type="button" onClick={() => cart.remove(slug)} className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] text-ink-400 hover:text-ink-900">
                  <Icon name="trash" size={15} />
                  {t.remove}
                </button>
              </div>
              <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                <QtyControl slug={slug} qty={qty} label={tp.qty} />
                <span className="text-[18px] font-bold tabular-nums">{product.price ? formatPrice(product.price * qty, lang) : tp.priceOnRequest}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-xl bg-forest-900 p-8 text-white">
          <div className="flex items-baseline justify-between">
            <span className="text-white/70">{t.subtotal}</span>
            <span className="text-[28px] font-extrabold tabular-nums text-gold-400">{formatPrice(subtotal, lang)}</span>
          </div>
          <p className="mt-2 text-[13.5px] text-white/50">{t.shippingNote}</p>
          <Link href={`/${lang}/checkout`} className="btn btn-gold mt-7 w-full !min-h-[54px]">
            {t.checkout}
            <Icon name="arrowRight" size={18} />
          </Link>
          <Link href={`/${lang}/products`} className="mt-3 block text-center text-[14px] text-white/60 underline-offset-4 hover:text-white hover:underline">
            {t.continue}
          </Link>
        </div>
      </aside>
    </div>
  );
}
