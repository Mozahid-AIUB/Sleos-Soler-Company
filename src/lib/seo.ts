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

/**
 * Search-oriented title/description for the key pages (English and Bangla).
 * They only affect <title> and the meta description, not the visible headings,
 * so the page design stays as it is. Other languages keep the dictionary text.
 */
const pageMeta: Partial<Record<Locale, Record<string, { title: string; description: string }>>> = {
  en: {
    products: {
      title: "Solar Panels, Inverters & Batteries in Bangladesh",
      description:
        "Solar panel, hybrid inverter, battery and stabilizer models from Trina, Jinko, LONGi, Huawei, Sungrow, Deye and more. Genuine products, quoted to your project in Dhaka and across Bangladesh.",
    },
    solutions: {
      title: "Rooftop Solar & Hybrid Solar Systems in Bangladesh",
      description:
        "On-grid, off-grid and hybrid solar systems for homes, factories, cold storage and farms in Bangladesh, designed, installed and supported by OSLEOS. Get a free quote.",
    },
    incentive: {
      title: "Rooftop Solar Incentive 2026: Tk 10.50 per Unit",
      description:
        "Install rooftop solar with battery storage and earn Tk 10.50 per unit for surplus electricity sent to the grid in Bangladesh. See the conditions and the deadline, and get a quote from OSLEOS.",
    },
  },
  bn: {
    products: {
      title: "বাংলাদেশে সোলার প্যানেল, ইনভার্টার ও ব্যাটারি",
      description:
        "ট্রিনা, জিঙ্কো, লংগি, হুয়াওয়ে, সানগ্রো, ডেয়েসহ সোলার প্যানেল, হাইব্রিড ইনভার্টার, ব্যাটারি ও স্ট্যাবিলাইজার। ঢাকা ও সারা বাংলাদেশে আপনার প্রকল্প অনুযায়ী কোটেশন।",
    },
    solutions: {
      title: "বাংলাদেশে রুফটপ ও হাইব্রিড সোলার সিস্টেম",
      description:
        "বাসা, কারখানা, কোল্ড স্টোরেজ ও কৃষির জন্য অন-গ্রিড, অফ-গ্রিড ও হাইব্রিড সোলার সিস্টেম। ডিজাইন, ইনস্টলেশন ও সাপোর্ট দেয় OSLEOS। বিনামূল্যে কোটেশন নিন।",
    },
    incentive: {
      title: "রুফটপ সোলার প্রণোদনা ২০২৬: ইউনিটপ্রতি ১০.৫০ টাকা",
      description:
        "ব্যাটারি স্টোরেজসহ রুফটপ সোলার বসিয়ে গ্রিডে পাঠানো বাড়তি বিদ্যুতের জন্য ইউনিটপ্রতি ১০.৫০ টাকা আয় করুন। শর্ত ও সময়সীমা জানুন, OSLEOS থেকে কোটেশন নিন।",
    },
  },
};

export const seoMeta = (lang: Locale, key: string) => pageMeta[lang]?.[key];
