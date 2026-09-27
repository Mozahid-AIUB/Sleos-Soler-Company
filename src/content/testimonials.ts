import type { Localized } from "@/i18n/config";

/**
 * SAMPLE reviews for the draft only — shown with a "Sample review" tag while
 * `site.draft` is true. Replace with real, permission-granted client reviews.
 */
export type Testimonial = {
  quote: Localized;
  name: Localized;
  role: Localized;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "Our monthly bill dropped by more than half, and during load-shedding the house doesn't even notice. The team explained every part of the system, down to the stabilizer.",
      bn: "মাসিক বিল অর্ধেকেরও বেশি কমেছে, আর লোডশেডিংয়ে বাসায় টেরই পাই না। স্ট্যাবিলাইজার পর্যন্ত সিস্টেমের প্রতিটি অংশ টিম বুঝিয়ে দিয়েছে।",
    },
    name: { en: "Homeowner", bn: "বাড়ির মালিক" },
    role: { en: "Hybrid system · Dhaka", bn: "হাইব্রিড সিস্টেম · ঢাকা" },
    rating: 5,
  },
  {
    quote: {
      en: "We compared four suppliers. OSLEOS was the only one that studied our bills and roof properly and showed us the payback before we invested. The plant is running ahead of projection.",
      bn: "চারটি সাপ্লায়ার তুলনা করেছিলাম। শুধু OSLEOS-ই আমাদের বিল আর ছাদ ঠিকভাবে যাচাই করে বিনিয়োগের আগেই খরচ ফেরতের হিসাব দেখিয়েছে। প্ল্যান্ট প্রত্যাশার চেয়েও ভালো চলছে।",
    },
    name: { en: "Operations Director", bn: "অপারেশনস ডিরেক্টর" },
    role: { en: "Factory rooftop · Gazipur", bn: "কারখানার ছাদ · গাজীপুর" },
    rating: 5,
  },
  {
    quote: {
      en: "Our diagnostic machines used to stop with every outage. OSLEOS designed a solar and battery backup system for the clinic, and we haven't lost a working hour since.",
      bn: "আগে প্রতিবার বিদ্যুৎ গেলে ডায়াগনস্টিক মেশিন বন্ধ হয়ে যেত। OSLEOS ক্লিনিকের জন্য সোলার ও ব্যাটারি ব্যাকআপ সিস্টেম ডিজাইন করেছে, তারপর থেকে একটি কর্মঘণ্টাও নষ্ট হয়নি।",
    },
    name: { en: "Clinic owner", bn: "ক্লিনিকের মালিক" },
    role: { en: "Solar backup · Cumilla", bn: "সোলার ব্যাকআপ · কুমিল্লা" },
    rating: 5,
  },
];
