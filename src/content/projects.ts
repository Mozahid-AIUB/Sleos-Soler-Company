import type { Localized } from "@/i18n/config";

/**
 * Case studies — SAMPLE / illustrative placeholders. Photos come from the
 * client's brochure (public/media/projects, cropped from brochure pp. 3–34);
 * names, capacities and years are illustrative. Replace with the client's
 * real executed projects before launch.
 */
export type Project = {
  slug: string;
  title: Localized;
  type: Localized;
  location: Localized;
  capacity: string;
  year: string;
  summary: Localized;
  image: string;
  sample: boolean;
};

export const projects: Project[] = [
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
    image: "/media/projects/factory-rooftop-gazipur.jpg",
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
    image: "/media/projects/cold-storage-munshiganj.jpg",
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
    image: "/media/projects/solar-irrigation-rajshahi.jpg",
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
    image: "/media/projects/apartment-rooftop-dhaka.jpg",
    sample: true,
  },
  {
    slug: "narayanganj-warehouse",
    title: { en: "Warehouse Roof to Revenue", bn: "ওয়্যারহাউসের ছাদ থেকে আয়" },
    type: { en: "Commercial & Industrial · Rooftop", bn: "বাণিজ্যিক ও শিল্প · রুফটপ" },
    location: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    capacity: "800 kWp",
    year: "2024",
    summary: {
      en: "An unused warehouse roof turned into a productive energy asset, monitored remotely by our team.",
      bn: "অব্যবহৃত ওয়্যারহাউসের ছাদ এখন উৎপাদনশীল শক্তির সম্পদ, আমাদের টিম দূর থেকে মনিটর করে।",
    },
    image: "/media/projects/warehouse-rooftop-narayanganj.jpg",
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
    image: "/media/projects/commercial-rooftop-dhaka.jpg",
    sample: true,
  },
];
