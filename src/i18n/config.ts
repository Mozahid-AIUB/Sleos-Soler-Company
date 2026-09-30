/** Site languages, in the order the client wants them shown in the switcher. */
export const locales = ["en", "zh", "es", "fr", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Each language's own name, as shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  fr: "Français",
  bn: "বাংলা",
};

/** BCP 47 tag for <html lang>, hreflang and Intl. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
  es: "es",
  fr: "fr",
  bn: "bn",
};

/** Open Graph locale per language. */
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
  es: "es_ES",
  fr: "fr_FR",
  bn: "bn_BD",
};

/**
 * Copy in the content files (products, projects, reviews…) is written in
 * English and Bangla. Chinese, Spanish and French come from
 * src/content/translations — resolve with `pick` from "@/i18n/content".
 */
export type Localized<T = string> = { en: T; bn: T };

const numberFormat: Record<Locale, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-IN"),
  zh: new Intl.NumberFormat("zh-CN"),
  es: new Intl.NumberFormat("es-ES"),
  fr: new Intl.NumberFormat("fr-FR"),
  bn: new Intl.NumberFormat("bn-BD"),
};

export const formatNumber = (n: number, lang: Locale) => numberFormat[lang].format(n);

export const formatPrice = (n: number, lang: Locale) => `৳${formatNumber(n, lang)}`;

/** Turns ASCII digits in a string into Bangla digits when needed. */
export const localizeDigits = (text: string, lang: Locale) =>
  lang === "bn" ? text.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : text;

/** Replaces the language prefix of a pathname, e.g. /en/about -> /fr/about. */
export const switchLocalePath = (pathname: string, lang: Locale) =>
  pathname.replace(new RegExp(`^/(${locales.join("|")})(?=/|$)`), `/${lang}`);
