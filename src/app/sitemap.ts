import type { MetadataRoute } from "next";
import { locales, localeTags } from "@/i18n/config";
import { products } from "@/content/products";
import { site } from "@/content/site";

/** Indexable pages, without the language prefix. Utility pages (links, cart, checkout) are left out. */
const pages = ["", "/products", "/solutions", "/projects", "/incentive", "/about", "/sustainability", "/support", "/contact", "/quote", "/privacy", "/legal", "/legal-contacts", "/security"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...pages, ...products.map((p) => `/products/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      changeFrequency: path === "" || path === "/products" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/products" || path === "/solutions" || path === "/quote" ? 0.9 : path.startsWith("/products/") ? 0.7 : 0.5,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [localeTags[l], `${site.url}/${l}${path}`])),
          "x-default": `${site.url}/en${path}`,
        },
      },
    })),
  );
}
