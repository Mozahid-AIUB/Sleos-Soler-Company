import type { Localized } from "@/i18n/config";

/**
 * Case studies. The first seven are the client's real executed projects (portfolio PDF,
 * Oct 2026; no commissioning year was given, so `year` is left out). The rest are SAMPLE /
 * illustrative placeholders (`sample: true`): photos from the client's brochure, with
 * illustrative names, capacities and years. Remove them once enough real projects exist.
 */
export type Project = {
  slug: string;
  title: Localized;
  type: Localized;
  location: Localized;
  capacity: string;
  /** Commissioning year; omitted when unknown. */
  year?: string;
  summary: Localized;
  image: string;
  sample: boolean;
};

export const projects: Project[] = [
  /* ---- Real executed projects (client portfolio PDF, Oct 2026) ---- */
  {
    slug: "expo-accessories-gazipur",
    title: { en: "Expo Accessories, Gazipur", bn: "এক্সপো অ্যাক্সেসরিজ, গাজীপুর" },
    type: { en: "Industrial · On-grid", bn: "শিল্প · অন-গ্রিড" },
    location: { en: "Gazipur", bn: "গাজীপুর" },
    capacity: "501 kWp",
    summary: {
      en: "A 501 kWp on-grid solar installation at Expo Accessories in Gazipur.",
      bn: "গাজীপুরে এক্সপো অ্যাক্সেসরিজে ৫০১ কিলোওয়াট-পিক অন-গ্রিড সোলার স্থাপনা।",
    },
    image: "/media/projects/expo-accessories-gazipur.webp",
    sample: false,
  },
  {
    slug: "madipac-united-group",
    title: { en: "Madipac, United Group", bn: "মাদিপ্যাক, ইউনাইটেড গ্রুপ" },
    type: { en: "Industrial · On-grid", bn: "শিল্প · অন-গ্রিড" },
    location: { en: "Madipac, United Group, 100 Ft", bn: "মাদিপ্যাক, ইউনাইটেড গ্রুপ, ১০০ ফুট" },
    capacity: "40 kW",
    summary: {
      en: "A 40 kW ground-mounted on-grid solar system at Madipac, United Group.",
      bn: "ইউনাইটেড গ্রুপের মাদিপ্যাকে ৪০ কিলোওয়াট গ্রাউন্ড-মাউন্টেড অন-গ্রিড সোলার সিস্টেম।",
    },
    image: "/media/projects/madipac-united-group.webp",
    sample: false,
  },
  {
    slug: "tallon-zipper-dhamrai",
    title: { en: "Tallon Zipper, Dhamrai", bn: "ট্যালন জিপার, ধামরাই" },
    type: { en: "Industrial · On-grid", bn: "শিল্প · অন-গ্রিড" },
    location: { en: "Dhamrai, Dhaka", bn: "ধামরাই, ঢাকা" },
    capacity: "20 kW",
    summary: {
      en: "A 20 kW on-grid rooftop system on a metal roof at Tallon Zipper, Dhamrai.",
      bn: "ধামরাইয়ে ট্যালন জিপারের মেটাল ছাদে ২০ কিলোওয়াট অন-গ্রিড রুফটপ সিস্টেম।",
    },
    image: "/media/projects/tallon-zipper-dhamrai.webp",
    sample: false,
  },
  {
    slug: "harvest-agro-dhamrai",
    title: { en: "Harvest Agro, Dhamrai", bn: "হার্ভেস্ট এগ্রো, ধামরাই" },
    type: { en: "Agro industry · On-grid", bn: "কৃষিভিত্তিক শিল্প · অন-গ্রিড" },
    location: { en: "Dautia, Kalampur, Dhamrai, Dhaka", bn: "দাউতিয়া, কলামপুর, ধামরাই, ঢাকা" },
    capacity: "15 kW",
    summary: {
      en: "A 15 kW on-grid solar system at Harvest Agro, Dautia, Kalampur, Dhamrai.",
      bn: "ধামরাইয়ের কলামপুরের দাউতিয়ায় হার্ভেস্ট এগ্রোতে ১৫ কিলোওয়াট অন-গ্রিড সোলার সিস্টেম।",
    },
    image: "/media/projects/harvest-agro-dhamrai.webp",
    sample: false,
  },
  {
    slug: "brtc-sarkar-bari-gazipur",
    title: { en: "Sarkar Bari, BRTC East Side", bn: "সরকার বাড়ি, বিআরটিসি পূর্ব পাশ" },
    type: { en: "Residential · Off-grid hybrid", bn: "আবাসিক · অফ-গ্রিড হাইব্রিড" },
    location: { en: "Gazipur", bn: "গাজীপুর" },
    capacity: "2 kW + 2 hr backup",
    summary: {
      en: "A 2 kW off-grid hybrid solar system with 2 hours of backup, east side of BRTC, Gazipur.",
      bn: "গাজীপুরে বিআরটিসির পূর্ব পাশে ২ কিলোওয়াট অফ-গ্রিড হাইব্রিড সোলার সিস্টেম, ২ ঘণ্টা ব্যাকআপসহ।",
    },
    image: "/media/projects/brtc-sarkar-bari-gazipur.webp",
    sample: false,
  },
  {
    slug: "sharif-industrial-narayanganj",
    title: { en: "Sharif Industrial Company Ltd", bn: "শরীফ ইন্ডাস্ট্রিয়াল কোম্পানি লিমিটেড" },
    type: { en: "Industrial · On-grid", bn: "শিল্প · অন-গ্রিড" },
    location: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    capacity: "80 kW",
    summary: {
      en: "An 80 kW on-grid rooftop solar system at Sharif Industrial Company Ltd, Narayanganj.",
      bn: "নারায়ণগঞ্জে শরীফ ইন্ডাস্ট্রিয়াল কোম্পানি লিমিটেডে ৮০ কিলোওয়াট অন-গ্রিড রুফটপ সোলার সিস্টেম।",
    },
    image: "/media/projects/sharif-industrial-narayanganj.webp",
    sample: false,
  },
  {
    slug: "noor-autos-uttara",
    title: { en: "Noor Autos, Uttara", bn: "নূর অটোস, উত্তরা" },
    type: { en: "Commercial · Off-grid hybrid", bn: "বাণিজ্যিক · অফ-গ্রিড হাইব্রিড" },
    location: { en: "Uttara, Dhaka", bn: "উত্তরা, ঢাকা" },
    capacity: "3.57 kWp",
    summary: {
      en: "A 3.57 kWp off-grid hybrid solar system on a metal roof at Noor Autos, Uttara.",
      bn: "উত্তরায় নূর অটোসের মেটাল ছাদে ৩.৫৭ কিলোওয়াট-পিক অফ-গ্রিড হাইব্রিড সোলার সিস্টেম।",
    },
    image: "/media/projects/noor-autos-uttara.webp",
    sample: false,
  },
  {
    slug: "gazipur-garments-rooftop",
    title: { en: "Garments Factory Rooftop", bn: "গার্মেন্টস কারখানার ছাদ" },
    type: { en: "Commercial & Industrial · Net metering", bn: "বাণিজ্যিক ও শিল্প · নেট মিটারিং" },
    location: { en: "Gazipur", bn: "গাজীপুর" },
    capacity: "1.2 MWp",
    year: "2025",
    summary: {
      en: "Bill analysis, roof study and a net-metered system that now covers a large share of the factory's daytime load.",
      bn: "বিল বিশ্লেষণ, ছাদ যাচাই আর নেট-মিটারড সিস্টেম, যা এখন কারখানার দিনের লোডের বড় অংশ পূরণ করে।",
    },
    image: "/media/projects/gazipur-garments-rooftop.webp",
    sample: true,
  },
  {
    slug: "munshiganj-cold-storage",
    title: { en: "Cold Storage Solar", bn: "কোল্ড স্টোরেজে সোলার" },
    type: { en: "Cold chain · Solar + grid + generator", bn: "কোল্ড চেইন · সোলার + গ্রিড + জেনারেটর" },
    location: { en: "Munshiganj", bn: "মুন্সীগঞ্জ" },
    capacity: "450 kWp",
    year: "2024",
    summary: {
      en: "Designed around the refrigeration load of a potato cold store, cutting grid and diesel use without risking temperature.",
      bn: "আলুর কোল্ড স্টোরের রেফ্রিজারেশন লোড অনুযায়ী ডিজাইন, তাপমাত্রার ঝুঁকি ছাড়াই গ্রিড ও ডিজেলের ব্যবহার কমেছে।",
    },
    image: "/media/projects/cold-storage-munshiganj.webp",
    sample: true,
  },
  {
    slug: "rajshahi-solar-irrigation",
    title: { en: "Solar Irrigation Pumps", bn: "সোলার সেচ পাম্প" },
    type: { en: "Agriculture · Solar pumping", bn: "কৃষি · সোলার পাম্প" },
    location: { en: "Rajshahi", bn: "রাজশাহী" },
    capacity: "160 kWp",
    year: "2024",
    summary: {
      en: "Solar pumps with MPPT controllers replacing diesel for rice and vegetable growers.",
      bn: "MPPT কন্ট্রোলারসহ সোলার পাম্প, ধান ও সবজি চাষিদের জন্য ডিজেলের বিকল্প।",
    },
    image: "/media/projects/solar-field-tilted.webp",
    sample: true,
  },
  {
    slug: "dhaka-apartment-rooftop",
    title: { en: "Apartment Rooftop", bn: "অ্যাপার্টমেন্টের ছাদ" },
    type: { en: "Residential · On-grid", bn: "আবাসিক · অন-গ্রিড" },
    location: { en: "Dhaka", bn: "ঢাকা" },
    capacity: "24 kWp",
    year: "2025",
    summary: {
      en: "Powers the lift, water pumps and common areas of a residential building, with a voltage stabilizer protecting the lift drive.",
      bn: "আবাসিক ভবনের লিফট, পানির পাম্প ও কমন এরিয়া চলে সোলারে, লিফট ড্রাইভ সুরক্ষায় ভোল্টেজ স্ট্যাবিলাইজার।",
    },
    image: "/media/projects/apartment-rooftop-dhaka.webp",
    sample: true,
  },
  {
    slug: "narayanganj-warehouse",
    title: { en: "Warehouse Rooftop Solar", bn: "ওয়্যারহাউসের রুফটপ সোলার" },
    type: { en: "Commercial & Industrial · Rooftop", bn: "বাণিজ্যিক ও শিল্প · রুফটপ" },
    location: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    capacity: "800 kWp",
    year: "2024",
    summary: {
      en: "An unused warehouse roof turned into a productive energy asset, monitored remotely by our team.",
      bn: "অব্যবহৃত ওয়্যারহাউসের ছাদ এখন উৎপাদনশীল শক্তির সম্পদ, আমাদের টিম দূর থেকে মনিটর করে।",
    },
    image: "/media/projects/warehouse-rooftop-narayanganj.webp",
    sample: true,
  },
  {
    slug: "dhaka-hospital-hybrid",
    title: { en: "Hospital Hybrid & Backup", bn: "হাসপাতালে হাইব্রিড ও ব্যাকআপ" },
    type: { en: "Commercial · Hybrid + storage", bn: "বাণিজ্যিক · হাইব্রিড + স্টোরেজ" },
    location: { en: "Dhaka", bn: "ঢাকা" },
    capacity: "180 kWp",
    year: "2025",
    summary: {
      en: "Solar with battery backup keeps critical wards and diagnostics running through load-shedding.",
      bn: "ব্যাটারি ব্যাকআপসহ সোলার, লোডশেডিংয়েও জরুরি ওয়ার্ড ও ডায়াগনস্টিক চালু রাখে।",
    },
    image: "/media/projects/commercial-rooftop-dhaka.webp",
    sample: true,
  },
];
