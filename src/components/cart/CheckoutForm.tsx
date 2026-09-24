"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatPrice, type Locale } from "@/i18n/config";
import { cart } from "@/lib/cart-store";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { useCartTotals, QtyControl } from "@/components/cart/CartDrawer";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";

const taka = (n: number) => `Tk ${new Intl.NumberFormat("en-IN").format(n)}`;

export function CheckoutForm({
  lang,
  t,
  tc,
  tp,
}: {
  lang: Locale;
  t: Dictionary["checkout"];
  tc: Dictionary["cart"];
  tp: Dictionary["product"];
}) {
  const { items, subtotal } = useCartTotals();
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  if (sentUrl) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-xl bg-white p-10 text-center shadow-[0_20px_50px_-30px_rgb(14_29_22/0.4)]">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25d366] text-white">
          <WhatsappIcon size={32} />
        </span>
        <h2 className="mt-6 text-[28px] font-bold tracking-tight">{t.successTitle}</h2>
        <p className="mt-3 leading-relaxed text-ink-600">{t.successBody}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            <WhatsappIcon size={18} />
            {t.successWhatsApp}
          </a>
          <Link href={`/${lang}`} className="btn btn-outline">
            {t.backHome}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-start gap-5 rounded-xl border border-cream-200 bg-white p-10">
        <p className="text-ink-600">{t.empty}</p>
        <Link href={`/${lang}/products`} className="btn btn-dark">
          {tc.emptyCta}
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <form
      className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const v = (k: string) => String(d.get(k) ?? "");
        const orderLines = items.map(
          ({ product, qty }, i) => `${i + 1}. ${product.name} × ${qty} = ${product.price ? taka(product.price * qty) : "Quote"}`,
        );
        const url = sendToWhatsApp(
          "New order — OSLEOS website",
          [
            ["Name", v("name")],
            ["Phone", v("phone")],
            ["Email", v("email")],
            ["Address", v("address")],
            ["District", v("district")],
            ["Payment", "Cash on delivery"],
            ["Note", v("note")],
          ],
          ["*Items*", ...orderLines, "", `*Total:* ${taka(subtotal)}`],
        );
        cart.clear();
        setSentUrl(url);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="grid gap-6">
        <fieldset className="card-soft grid gap-4 p-7 sm:p-8">
          <legend className="float-left mb-2 w-full text-[18px] font-bold">{t.contact}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[14px] font-medium">
              {t.name}
              <input name="name" required autoComplete="name" className="field" />
            </label>
            <label className="grid gap-1.5 text-[14px] font-medium">
              {t.phone}
              <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
            </label>
          </div>
          <label className="grid gap-1.5 text-[14px] font-medium">
            {t.email}
            <input name="email" type="email" autoComplete="email" className="field" />
          </label>
        </fieldset>

        <fieldset className="card-soft grid gap-4 p-7 sm:p-8">
          <legend className="float-left mb-2 w-full text-[18px] font-bold">{t.shipping}</legend>
          <label className="grid gap-1.5 text-[14px] font-medium">
            {t.address}
            <input name="address" required autoComplete="street-address" className="field" />
          </label>
          <label className="grid gap-1.5 text-[14px] font-medium">
            {t.district}
            <input name="district" required autoComplete="address-level2" className="field" />
          </label>
          <label className="grid gap-1.5 text-[14px] font-medium">
            {t.note}
            <textarea name="note" rows={3} className="field resize-y" />
          </label>
        </fieldset>

        <fieldset className="card-soft grid gap-3 p-7 sm:p-8">
          <legend className="float-left mb-2 w-full text-[18px] font-bold">{t.payment}</legend>
          <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-teal-600 bg-teal-600/[0.05] p-4">
            <input type="radio" name="payment" value="cod" defaultChecked className="mt-1 accent-teal-600" />
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <Icon name="cash" size={19} className="text-teal-600" />
                {t.cod}
              </span>
              <span className="mt-1 block text-[14px] text-ink-600">{t.codNote}</span>
            </span>
          </label>
          <div className="flex items-center gap-4 rounded-xl border border-dashed border-cream-200 p-4 text-[14px] text-ink-400">
            <input type="radio" disabled aria-label={t.online} />
            {t.online}
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-xl bg-forest-900 p-7 text-white sm:p-8">
          <h2 className="text-[18px] font-bold">{t.summary}</h2>
          <ul className="mt-5 divide-y divide-white/10">
            {items.map(({ slug, qty, product }) => (
              <li key={slug} className="flex gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <ProductImage src={product.image} alt={product.name} sizes="64px" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="text-[14.5px] font-semibold leading-snug">{product.name}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-ink-900">
                      <QtyControl slug={slug} qty={qty} label={tp.qty} />
                    </div>
                    <span className="text-[14.5px] font-semibold tabular-nums">{product.price ? formatPrice(product.price * qty, lang) : tp.priceOnRequest}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-3 border-t border-white/10 pt-5 text-[14.5px]">
            <div className="flex justify-between text-white/70">
              <dt>{tc.subtotal}</dt>
              <dd className="tabular-nums">{formatPrice(subtotal, lang)}</dd>
            </div>
            <div className="flex justify-between text-white/70">
              <dt>{t.delivery}</dt>
              <dd>{t.deliveryValue}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
              <dt className="font-semibold">{t.total}</dt>
              <dd className="text-[26px] font-extrabold tracking-tight tabular-nums text-gold-400">{formatPrice(subtotal, lang)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn mt-7 w-full !min-h-[56px] bg-[#25d366] text-[15.5px] text-white hover:bg-[#1fbd5a]">
            <WhatsappIcon size={20} />
            {t.place}
          </button>
        </div>
      </aside>
    </form>
  );
}
