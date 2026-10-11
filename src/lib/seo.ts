import type { Metadata } from "next";
import { locales, localeTags, type Locale } from "@/i18n/config";

/**
 * Canonical + hreflang links for one page. `path` is the page path without the
 * language prefix ("" for the home page, "/products", "/products/some-slug").
 * Every page must set its own: a canonical inherited from the layout would
 * point every page at the home page and keep inner pages out of Google.
 */
export const pageAlternates = (lang: Locale, path = ""): NonNullable<Metadata["alternates"]> => ({
  canonical: `/${lang}${path}`,
  languages: {
    ...Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}${path}`])),
    "x-default": `/en${path}`,
  },
});
