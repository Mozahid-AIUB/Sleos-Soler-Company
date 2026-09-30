"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { localeNames, locales, localeTags, switchLocalePath, type Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";

/**
 * Language menu: the five site languages in the client's order. `tone`
 * follows the header (white text over the hero, dark text once solid).
 */
export function LanguageSwitcher({
  lang,
  label,
  tone,
  size = "sm",
  className = "",
}: {
  lang: Locale;
  label: string;
  tone: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close after navigating to another language.
  const [openFor, setOpenFor] = useState(pathname);
  if (openFor !== pathname) {
    setOpenFor(pathname);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label}: ${localeNames[lang]}`}
        className={`flex items-center gap-1.5 font-medium transition-colors ${size === "md" ? "h-10 px-2 text-[14px]" : "text-[13px]"} ${
          tone === "light" ? "text-white/85 hover:text-white" : "text-ink-600 hover:text-ink-900"
        }`}
      >
        <Icon name="globe" size={size === "md" ? 17 : 14} />
        <span>{localeNames[lang]}</span>
        <Icon name="chevronDown" size={13} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        id={menuId}
        role="list"
        className={`absolute right-0 top-full z-[60] mt-2 min-w-[168px] origin-top-right rounded-lg border border-cream-200 bg-white p-1.5 text-ink-900 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.3)] transition-[opacity,transform,visibility] duration-200 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={switchLocalePath(pathname, l)}
              prefetch={false}
              hrefLang={localeTags[l]}
              lang={localeTags[l]}
              aria-current={l === lang ? "true" : undefined}
              className={`flex items-center justify-between gap-4 rounded-md px-3 py-2.5 text-[14px] transition-colors hover:bg-cream-50 ${
                l === lang ? "font-semibold text-ink-900" : "text-ink-600"
              }`}
            >
              {localeNames[l]}
              {l === lang && <Icon name="check" size={15} strokeWidth={2.2} className="text-teal-600" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
