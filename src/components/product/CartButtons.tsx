"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { cart } from "@/lib/cart-store";
import { Icon } from "@/components/ui/Icon";

type Labels = { addToCart: string; added: string; buyNow: string; requestQuote: string };

export function CartButtons({
  lang,
  slug,
  quoteOnly,
  t,
  size = "sm",
  qty = 1,
}: {
  lang: Locale;
  slug: string;
  quoteOnly: boolean;
  t: Labels;
  size?: "sm" | "lg";
  qty?: number;
}) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const big = size === "lg";

  if (quoteOnly) {
    return (
      <Link href={`/${lang}/contact?product=${slug}`} className={`btn btn-dark w-full ${big ? "" : "!min-h-11 !text-[14px]"}`}>
        {t.requestQuote}
        <Icon name="arrowRight" size={17} />
      </Link>
    );
  }

  return (
    <div className={`grid gap-2.5 ${big ? "sm:grid-cols-2" : "@min-[15rem]:grid-cols-2"}`}>
      <button
        type="button"
        onClick={() => {
          cart.add(slug, qty);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1600);
        }}
        className={`btn btn-outline ${big ? "" : "!min-h-11 !px-3 !text-[13.5px]"}`}
      >
        <Icon name={added ? "check" : "cart"} size={17} className={big ? "" : "@max-[17.5rem]:hidden"} />
        {added ? t.added : t.addToCart}
      </button>
      <button
        type="button"
        onClick={() => {
          cart.add(slug, qty, false);
          router.push(`/${lang}/checkout`);
        }}
        className={`btn btn-gold ${big ? "" : "!min-h-11 !px-3 !text-[13.5px]"}`}
      >
        {t.buyNow}
      </button>
    </div>
  );
}
