export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** A piece of copy that exists in both languages. */
export type Localized<T = string> = Record<Locale, T>;

export const pick = <T,>(value: Localized<T>, lang: Locale): T => value[lang];

const numberFormat: Record<Locale, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-IN"),
  bn: new Intl.NumberFormat("bn-BD"),
};

export const formatNumber = (n: number, lang: Locale) => numberFormat[lang].format(n);

export const formatPrice = (n: number, lang: Locale) => `৳${formatNumber(n, lang)}`;

/** Turns ASCII digits in a string into Bangla digits when needed. */
export const localizeDigits = (text: string, lang: Locale) =>
  lang === "bn" ? text.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : text;
