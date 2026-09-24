"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { CartButtons } from "@/components/product/CartButtons";
import { Icon } from "@/components/ui/Icon";

export function BuyBox({ lang, slug, quoteOnly, t }: { lang: Locale; slug: string; quoteOnly: boolean; t: Dictionary["product"] }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="grid gap-4">
      {!quoteOnly && (
        <div className="flex items-center gap-4">
          <span className="text-[14px] font-medium text-ink-600">{t.qty}</span>
          <div className="inline-flex items-center rounded-full border border-cream-200 bg-white">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-ink-600 hover:text-ink-900" aria-label="−">
              <Icon name="minus" size={17} />
            </button>
            <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-ink-600 hover:text-ink-900" aria-label="+">
              <Icon name="plus" size={17} />
            </button>
          </div>
        </div>
      )}
      <CartButtons lang={lang} slug={slug} quoteOnly={quoteOnly} t={t} size="lg" qty={qty} />
    </div>
  );
}
