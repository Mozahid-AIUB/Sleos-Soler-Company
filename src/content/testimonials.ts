import type { Localized } from "@/i18n/config";

/**
 * SAMPLE reviews for the draft only — shown with a "Sample review" note while
 * `site.draft` is true. Replace with real, permission-granted reviews
 * (client or partner name, role and site) before launch.
 *
 * `group` splits the section: Bangladeshi clients, and the Chinese
 * manufacturers whose equipment OSLEOS supplies and installs.
 */
export type Testimonial = {
  group: "clients" | "manufacturers";
  quote: Localized;
  name: Localized;
  role: Localized;
  rating: number;
};

export const testimonials: Testimonial[] = [
  /* ---------------------------- Bangladeshi clients ---------------------------- */
  {
    group: "clients",
    quote: {
      en: "Our monthly bill dropped by more than half, and during load-shedding the house doesn't even notice. The team explained every part of the system, down to the stabilizer.",
      bn: "মাসিক বিল অর্ধেকেরও বেশি কমেছে, আর লোডশেডিংয়ে বাসায় টেরই পাই না। স্ট্যাবিলাইজার পর্যন্ত সিস্টেমের প্রতিটি অংশ টিম বুঝিয়ে দিয়েছে।",
    },
    name: { en: "Homeowner", bn: "বাড়ির মালিক" },
    role: { en: "Hybrid system · Dhaka", bn: "হাইব্রিড সিস্টেম · ঢাকা" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "We compared four suppliers. OSLEOS was the only one that studied our bills and roof properly and showed us the payback before we invested. The plant is running ahead of projection.",
      bn: "চারটি সাপ্লায়ার তুলনা করেছিলাম। শুধু OSLEOS-ই আমাদের বিল আর ছাদ ঠিকভাবে যাচাই করে বিনিয়োগের আগেই খরচ ফেরতের হিসাব দেখিয়েছে। প্ল্যান্ট প্রত্যাশার চেয়েও ভালো চলছে।",
    },
    name: { en: "Operations Director", bn: "অপারেশনস ডিরেক্টর" },
    role: { en: "Factory rooftop · Gazipur", bn: "কারখানার ছাদ · গাজীপুর" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "Our injection moulding machines are very sensitive to voltage drops. OSLEOS added solar with three-phase stabilizers, and we have had far fewer stoppages and rejected batches since.",
      bn: "আমাদের ইনজেকশন মোল্ডিং মেশিন ভোল্টেজ কমে গেলেই সমস্যা করত। OSLEOS সোলারের সাথে থ্রি-ফেজ স্ট্যাবিলাইজার বসিয়েছে, তারপর থেকে মেশিন বন্ধ হওয়া আর নষ্ট ব্যাচ অনেক কমে গেছে।",
    },
    name: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" },
    role: { en: "Plastic factory · Narayanganj", bn: "প্লাস্টিক কারখানা · নারায়ণগঞ্জ" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "Buyers ask us about renewable energy in every audit. The rooftop plant OSLEOS built now covers a large share of our daytime load, and the monitoring reports make compliance simple.",
      bn: "প্রতিটি অডিটে বায়াররা নবায়নযোগ্য জ্বালানির কথা জিজ্ঞেস করেন। OSLEOS-এর তৈরি রুফটপ প্ল্যান্ট এখন দিনের লোডের বড় অংশ চালায়, আর মনিটরিং রিপোর্টে কমপ্লায়েন্স সহজ হয়েছে।",
    },
    name: { en: "Head of Compliance", bn: "কমপ্লায়েন্স প্রধান" },
    role: { en: "Garments factory · Gazipur", bn: "গার্মেন্টস কারখানা · গাজীপুর" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "They surveyed the roof, checked the structure and finished the installation without stopping a single sewing line. Our diesel use for the generator has come down noticeably.",
      bn: "ছাদ সার্ভে, স্ট্রাকচার যাচাই করে একটি সেলাই লাইনও বন্ধ না করে ইনস্টলেশন শেষ করেছে। জেনারেটরের ডিজেল খরচ চোখে পড়ার মতো কমেছে।",
    },
    name: { en: "Factory Manager", bn: "ফ্যাক্টরি ম্যানেজার" },
    role: { en: "Knit garments factory · Ashulia", bn: "নিট গার্মেন্টস কারখানা · আশুলিয়া" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "Clear proposal, honest numbers and a clean installation. When one inverter showed a fault, their engineer was on site the next morning and handled the warranty claim for us.",
      bn: "পরিষ্কার প্রস্তাব, সৎ হিসাব আর পরিচ্ছন্ন ইনস্টলেশন। একটি ইনভার্টারে সমস্যা দেখা দিলে পরদিন সকালেই তাদের ইঞ্জিনিয়ার এসেছেন এবং ওয়ারেন্টি ক্লেইম নিজেরাই সামলেছেন।",
    },
    name: { en: "Director, Operations", bn: "পরিচালক, অপারেশনস" },
    role: { en: "Woven garments factory · Chattogram", bn: "ওভেন গার্মেন্টস কারখানা · চট্টগ্রাম" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "Our blow moulding line runs two shifts. OSLEOS sized a hybrid system around our real load profile, not a guess, and the savings match what they showed us on paper.",
      bn: "আমাদের ব্লো মোল্ডিং লাইন দুই শিফটে চলে। OSLEOS অনুমানে নয়, আমাদের আসল লোড প্রোফাইল দেখে হাইব্রিড সিস্টেম সাইজ করেছে, আর সাশ্রয় কাগজে দেখানো হিসাবের সাথেই মিলছে।",
    },
    name: { en: "Owner", bn: "মালিক" },
    role: { en: "Plastic packaging factory · Savar", bn: "প্লাস্টিক প্যাকেজিং কারখানা · সাভার" },
    rating: 5,
  },
  {
    group: "clients",
    quote: {
      en: "Our diagnostic machines used to stop with every outage. OSLEOS designed a solar and battery backup system for the clinic, and we haven't lost a working hour since.",
      bn: "আগে প্রতিবার বিদ্যুৎ গেলে ডায়াগনস্টিক মেশিন বন্ধ হয়ে যেত। OSLEOS ক্লিনিকের জন্য সোলার ও ব্যাটারি ব্যাকআপ সিস্টেম ডিজাইন করেছে, তারপর থেকে একটি কর্মঘণ্টাও নষ্ট হয়নি।",
    },
    name: { en: "Clinic owner", bn: "ক্লিনিকের মালিক" },
    role: { en: "Solar backup · Cumilla", bn: "সোলার ব্যাকআপ · কুমিল্লা" },
    rating: 5,
  },

  /* ---------------------------- Chinese manufacturers -------------------------- */
  {
    group: "manufacturers",
    quote: {
      en: "OSLEOS follows our installation manuals to the letter: string design, mounting and grounding. Their commissioning reports are complete, so warranty registration for their projects is straightforward.",
      bn: "OSLEOS আমাদের ইনস্টলেশন ম্যানুয়াল হুবহু মেনে চলে: স্ট্রিং ডিজাইন, মাউন্টিং ও আর্থিং। তাদের কমিশনিং রিপোর্ট সম্পূর্ণ থাকে, তাই তাদের প্রকল্পের ওয়ারেন্টি রেজিস্ট্রেশন সহজ হয়।",
    },
    name: { en: "Overseas Sales Manager", bn: "ওভারসিজ সেলস ম্যানেজার" },
    role: { en: "PV module manufacturer · Jiangsu, China", bn: "পিভি মডিউল প্রস্তুতকারক · জিয়াংসু, চীন" },
    rating: 5,
  },
  {
    group: "manufacturers",
    quote: {
      en: "The OSLEOS engineering team understands hybrid inverter configuration very well. Their technical questions are precise, and the systems they commission rarely need remote support from us.",
      bn: "OSLEOS-এর ইঞ্জিনিয়ারিং টিম হাইব্রিড ইনভার্টার কনফিগারেশন খুব ভালো বোঝে। তাদের টেকনিক্যাল প্রশ্ন নির্ভুল, আর তাদের চালু করা সিস্টেমে আমাদের রিমোট সাপোর্ট খুব কমই লাগে।",
    },
    name: { en: "Technical Service Engineer", bn: "টেকনিক্যাল সার্ভিস ইঞ্জিনিয়ার" },
    role: { en: "Inverter manufacturer · Zhejiang, China", bn: "ইনভার্টার প্রস্তুতকারক · ঝেজিয়াং, চীন" },
    rating: 5,
  },
  {
    group: "manufacturers",
    quote: {
      en: "A reliable partner in Bangladesh. OSLEOS selects the right stabilizer and protection ratings for each site, which protects our equipment and their customers.",
      bn: "বাংলাদেশে একজন নির্ভরযোগ্য পার্টনার। OSLEOS প্রতিটি সাইটের জন্য সঠিক স্ট্যাবিলাইজার ও প্রোটেকশন রেটিং বাছাই করে, যা আমাদের যন্ত্রপাতি ও তাদের গ্রাহক দুটোকেই সুরক্ষিত রাখে।",
    },
    name: { en: "Regional Export Manager", bn: "রিজিওনাল এক্সপোর্ট ম্যানেজার" },
    role: { en: "Electrical equipment manufacturer · Zhejiang, China", bn: "ইলেকট্রিক্যাল যন্ত্রপাতি প্রস্তুতকারক · ঝেজিয়াং, চীন" },
    rating: 5,
  },
];
