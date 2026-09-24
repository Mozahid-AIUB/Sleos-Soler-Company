"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
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
      <div className="reveal-fade mt-10 flex flex-col items-start gap-5 rounded-lg border border-cream-200 bg-white p-10">
        <p className="text-ink-600">{t.empty}</p>
        <Link href={`/${lang}/products`} className="btn btn-dark">
          {t.emptyCta}
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <ul className="card-soft reveal-fade divide-y divide-cream-200 px-5 sm:px-8">
        {items.map(({ slug, qty, product }) => (
          <li key={slug} className="flex gap-4 py-6 sm:gap-5">
            <Link href={`/${lang}/products/${slug}`} className="group relative h-24 w-20 shrink-0 sm:h-28 sm:w-24 overflow-hidden rounded-lg bg-cream-100">
              <ProductImage src={product.image} alt={product.name} sizes="96px" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/${lang}/products/${slug}`} className="text-[17px] font-semibold transition-colors hover:text-teal-600">
                  {product.name}
                </Link>
                <p className="mt-1 text-[14px] text-ink-600">{product.keySpec[lang]}</p>
                <button type="button" onClick={() => cart.remove(slug)} className="mt-1 inline-flex min-h-10 items-center gap-1.5 text-[13.5px] text-ink-400 hover:text-ink-900">
                  <Icon name="trash" size={15} />
                  {t.remove}
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-col sm:flex-nowrap sm:items-end">
                <QtyControl slug={slug} qty={qty} label={tp.qty} />
                <span className="text-[18px] font-bold tabular-nums">{product.price ? formatPrice(product.price * qty, lang) : tp.priceOnRequest}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="reveal-fade lg:sticky lg:top-28 lg:self-start" style={{ "--i": 1 } as CSSProperties}>
        <div className="rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <span className="text-ink-600">{t.subtotal}</span>
            <span className="text-[28px] font-extrabold tabular-nums text-ink-900">{formatPrice(subtotal, lang)}</span>
          </div>
          <p className="mt-2 text-[13.5px] text-ink-400">{t.shippingNote}</p>
          <Link href={`/${lang}/checkout`} className="btn btn-gold mt-7 w-full !min-h-[54px]">
            {t.checkout}
            <Icon name="arrowRight" size={18} />
          </Link>
          <Link href={`/${lang}/products`} className="mt-2 block py-2.5 text-center text-[14px] text-ink-600 underline-offset-4 hover:text-ink-900 hover:underline">
            {t.continue}
          </Link>
        </div>
      </aside>
    </div>
  );
}
