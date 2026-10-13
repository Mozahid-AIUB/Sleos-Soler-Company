import "server-only";
import type { Locale } from "./config";
import { applySiteContent } from "@/lib/site-content";

const dictionaries = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  zh: () => import("./dictionaries/zh").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  bn: () => import("./dictionaries/bn").then((m) => m.default),
};

/** Built-in texts of a language, with the client's admin edits (Contact, Solutions) applied for English and Bangla. */
export const getDictionary = async (lang: Locale) => applySiteContent(await dictionaries[lang](), lang);
