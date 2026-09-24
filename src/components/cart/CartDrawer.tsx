"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatNumber, formatPrice, type Locale } from "@/i18n/config";
import { getProduct } from "@/content/products";
import { cart, useCart } from "@/lib/cart-store";
import { Icon } from "@/components/ui/Icon";
import { ProductImage } from "@/components/product/ProductImage";

export function useCartTotals() {
  const { lines } = useCart();
  const items = lines
    .map((l) => ({ ...l, product: getProduct(l.slug) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => Boolean(l.product));
  const subtotal = items.reduce((s, l) => s + (l.product.price ?? 0) * l.qty, 0);
  const count = items.reduce((n, l) => n + l.qty, 0);
  return { items, subtotal, count };
}

export function QtyControl({ slug, qty, label }: { slug: string; qty: number; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-cream-200 bg-white" role="group" aria-label={label}>
      <button type="button" onClick={() => cart.setQty(slug, qty - 1)} className="flex h-9 w-9 items-center justify-center text-ink-600 hover:text-ink-900" aria-label="−">
        <Icon name="minus" size={16} />
      </button>
      <span className="min-w-6 text-center text-[14px] font-semibold tabular-nums">{qty}</span>
      <button type="button" onClick={() => cart.setQty(slug, qty + 1)} className="flex h-9 w-9 items-center justify-center text-ink-600 hover:text-ink-900" aria-label="+">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function CartDrawer({ lang, t, tp }: { lang: Locale; t: Dictionary["cart"]; tp: Dictionary["product"] }) {
  const { open } = useCart();
  const { items, subtotal, count } = useCartTotals();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close cart"
        onClick={() => cart.close()}
        className={`absolute inset-0 bg-forest-950/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-cream-50 shadow-2xl transition-transform duration-500 ease-out-expo ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-5">
          <h2 className="text-[20px] font-bold">
            {t.title}{" "}
            <span className="text-[15px] font-medium text-ink-400">
              ({formatNumber(count, lang)} {t.items})
            </span>
          </h2>
          <button type="button" onClick={() => cart.close()} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-100" aria-label="Close">
            <Icon name="close" size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-ink-400">
              <Icon name="cart" size={28} />
            </span>
            <p className="text-ink-600">{t.empty}</p>
            <Link href={`/${lang}/products`} onClick={() => cart.close()} className="btn btn-dark">
              {t.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-cream-200 overflow-y-auto px-6">
              {items.map(({ slug, qty, product }) => (
                <li key={slug} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-cream-100 to-cream-200">
                    <ProductImage src={product.image} alt={product.name} sizes="80px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/${lang}/products/${slug}`} onClick={() => cart.close()} className="line-clamp-2 text-[15px] font-semibold leading-snug hover:text-teal-600">
                      {product.name}
                    </Link>
                    <span className="mt-1 text-[14px] text-ink-600">{product.price ? formatPrice(product.price, lang) : tp.priceOnRequest}</span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyControl slug={slug} qty={qty} label={tp.qty} />
                      <button type="button" onClick={() => cart.remove(slug)} className="text-[13px] font-medium text-ink-400 underline-offset-4 hover:text-ink-900 hover:underline">
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-cream-200 bg-white px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-ink-600">{t.subtotal}</span>
                <span className="text-[22px] font-bold tabular-nums">{formatPrice(subtotal, lang)}</span>
              </div>
              <p className="mt-1 text-[13px] text-ink-400">{t.shippingNote}</p>
              <div className="mt-5 grid gap-3">
                <Link href={`/${lang}/checkout`} onClick={() => cart.close()} className="btn btn-gold w-full">
                  {t.checkout}
                  <Icon name="arrowRight" size={18} />
                </Link>
                <Link href={`/${lang}/cart`} onClick={() => cart.close()} className="btn btn-outline w-full">
                  {t.viewCart}
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
