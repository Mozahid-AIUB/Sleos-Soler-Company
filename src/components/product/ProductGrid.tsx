"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { CategoryId } from "@/content/products";

/**
 * Client-side category filter over server-rendered cards. Cards arrive as
 * children keyed by category, so the page stays fully static.
 */
export function ProductGrid({
  tabs,
  cards,
}: {
  tabs: { id: CategoryId | "all"; label: string; count: number }[];
  cards: { category: CategoryId; node: ReactNode; key: string }[];
}) {
  const [active, setActive] = useState<CategoryId | "all">("all");

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === id)) setActive(id as CategoryId);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  const visible = cards.filter((c) => active === "all" || c.category === active);

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
      {/* Keyed on the tab so a switch remounts the cards and they re-reveal. */}
      <div key={active} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((c, i) => (
          <div key={c.key} className="reveal flex" style={{ "--i": i % 4 } as CSSProperties}>
            {c.node}
          </div>
        ))}
      </div>
    </>
  );
}
