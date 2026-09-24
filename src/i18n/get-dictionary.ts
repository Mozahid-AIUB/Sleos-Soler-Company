import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  bn: () => import("./dictionaries/bn").then((m) => m.default),
};

export const getDictionary = (lang: Locale) => dictionaries[lang]();
