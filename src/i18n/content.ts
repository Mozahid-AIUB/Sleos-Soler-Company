import "server-only";
import type { Locale, Localized } from "./config";
import zh from "@/content/translations/zh.json";
import es from "@/content/translations/es.json";
import fr from "@/content/translations/fr.json";

/*
 * Content files are authored in English and Bangla. Chinese, Spanish and
 * French live in src/content/translations/<lang>.json, keyed by the English
 * text. A string missing from a map falls back to English, so editing content
 * never breaks a page: re-run the translation for new or changed strings.
 * Server-only so the maps never ship to the browser; client components get
 * already-resolved strings as props.
 */
const maps: Partial<Record<Locale, Record<string, string>>> = { zh, es, fr };

const tr = (text: string, lang: Locale) => maps[lang]?.[text] ?? text;

/** The `lang` version of a piece of content copy. */
export function pick(value: Localized<string>, lang: Locale): string;
export function pick(value: Localized<string[]>, lang: Locale): string[];
export function pick(value: Localized<string> | Localized<string[]>, lang: Locale): string | string[] {
  if (lang === "en" || lang === "bn") return value[lang];
  const en = value.en;
  return Array.isArray(en) ? en.map((s) => tr(s, lang)) : tr(en, lang);
}
