"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { CategoryId } from "@/content/products";

type Tab = { id: CategoryId | "all"; label: string; count: number };
type Card = { category: CategoryId; brand?: string; node: ReactNode; key: string };

/**
 * Client-side category + brand filter over server-rendered cards. Cards arrive
 * as children keyed by category, so the page stays fully static.
 */
export function ProductGrid({
  tabs,
  cards,
  labels,
}: {
  tabs: Tab[];
  cards: Card[];
  labels: { allBrands: string; brand: string; empty: string };
}) {
  const [active, setActive] = useState<CategoryId | "all">("all");
  const [brand, setBrand] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === id)) {
        setActive(id as CategoryId);
        setBrand(null);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  const inCategory = cards.filter((c) => active === "all" || c.category === active);
  const brands = [...new Set(inCategory.flatMap((c) => (c.brand ? [c.brand] : [])))];
  const visible = brand ? inCategory.filter((c) => c.brand === brand) : inCategory;

  return (
    <>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => {
              setActive(t.id);
              setBrand(null);
              history.replaceState(null, "", t.id === "all" ? window.location.pathname : `#${t.id}`);
            }}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-[14.5px] font-semibold transition-colors duration-300 ${
              active === t.id ? "border-forest-900 bg-forest-900 text-white" : "border-cream-200 bg-white text-ink-600 hover:border-ink-400"
            }`}
          >
            {t.label}
            <span className={`text-[12px] tabular-nums ${active === t.id ? "text-gold-400" : "text-ink-400"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {brands.length > 1 && (
        <div className="mt-5 flex items-center gap-3 border-t border-cream-200 pt-5 md:items-start">
          <span className="shrink-0 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-400 md:pt-2">{labels.brand}</span>
          <div className="no-scrollbar -mr-5 flex gap-1.5 overflow-x-auto pr-5 md:mr-0 md:flex-wrap md:pr-0" role="group" aria-label={labels.brand}>
            {[null, ...brands].map((b) => (
              <button
                key={b ?? "all"}
                type="button"
                aria-pressed={brand === b}
                onClick={() => setBrand(b)}
                className={`shrink-0 rounded-md border px-3 py-1.5 text-[13px] font-semibold transition-colors duration-300 ${
                  brand === b ? "border-ink-900 text-ink-900" : "border-transparent text-ink-600 hover:text-ink-900"
                }`}
              >
                {b ?? labels.allBrands}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyed on the filter so a switch remounts the cards and they re-reveal. */}
      <div key={`${active}-${brand ?? ""}`} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((c, i) => (
          <div key={c.key} className="reveal flex" style={{ "--i": i % 4 } as CSSProperties}>
            {c.node}
          </div>
        ))}
        {visible.length === 0 && <p className="text-ink-600">{labels.empty}</p>}
      </div>
    </>
  );
}
