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
      en: "Our monthly bill dropped by more than half, and during load-shedding the house doesn't even notice. The installation team was clean, quick and explained everything.",
      bn: "মাসিক বিল অর্ধেকেরও বেশি কমেছে, আর লোডশেডিংয়ে বাসায় টেরই পাই না। ইনস্টলেশন টিম পরিচ্ছন্ন, দ্রুত আর সবকিছু বুঝিয়ে দিয়েছে।",
    },
    name: { en: "Homeowner", bn: "বাড়ির মালিক" },
    role: { en: "5 kW hybrid system · Dhaka", bn: "৫ কিলোওয়াট হাইব্রিড সিস্টেম · ঢাকা" },
    rating: 5,
  },
  {
    quote: {
      en: "We compared four suppliers. OSLEOS was the only one that did a proper roof study and guaranteed generation in writing. The plant is ahead of projection.",
      bn: "চারটি সাপ্লায়ার তুলনা করেছিলাম। শুধু OSLEOS-ই ঠিকভাবে ছাদ যাচাই করে লিখিতভাবে উৎপাদনের গ্যারান্টি দিয়েছে। প্ল্যান্ট প্রত্যাশার চেয়েও ভালো চলছে।",
    },
    name: { en: "Operations Director", bn: "অপারেশনস ডিরেক্টর" },
    role: { en: "1.8 MW factory rooftop · Gazipur", bn: "১.৮ মেগাওয়াট কারখানার ছাদ · গাজীপুর" },
    rating: 5,
  },
  {
    quote: {
      en: "Ordered the 3 kW kit online with cash on delivery. An engineer called within an hour, and the system was running the same week.",
      bn: "ক্যাশ অন ডেলিভারিতে অনলাইনে ৩ কিলোওয়াট কিট অর্ডার করেছি। এক ঘণ্টার মধ্যে ইঞ্জিনিয়ার কল দিলেন, আর সেই সপ্তাহেই সিস্টেম চালু।",
    },
    name: { en: "Clinic owner", bn: "ক্লিনিকের মালিক" },
    role: { en: "3 kW on-grid kit · Cumilla", bn: "৩ কিলোওয়াট অন-গ্রিড কিট · কুমিল্লা" },
    rating: 5,
  },
];
