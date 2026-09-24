import type { Localized } from "@/i18n/config";

/**
 * Case studies — SAMPLE / illustrative placeholders using stock imagery.
 * Replace with the client's real executed projects before launch.
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
    slug: "north-bengal-solar-park",
    title: { en: "North Bengal Solar Park", bn: "উত্তরবঙ্গ সোলার পার্ক" },
    type: { en: "Utility-scale · Single-axis tracker", bn: "ইউটিলিটি-স্কেল · সিঙ্গেল-অ্যাক্সিস ট্র্যাকার" },
    location: { en: "Panchagarh", bn: "পঞ্চগড়" },
    capacity: "32 MWp",
    year: "2025",
    summary: {
      en: "58,000 TITAN bifacial modules on HELIOS trackers, feeding the national grid.",
      bn: "HELIOS ট্র্যাকারে ৫৮,০০০ TITAN বাইফেসিয়াল মডিউল, জাতীয় গ্রিডে সরবরাহ।",
    },
    image: "/media/img/utility-aerial.jpg",
    sample: true,
  },
  {
    slug: "gazipur-garments-rooftop",
    title: { en: "Garments Factory Rooftop", bn: "গার্মেন্টস কারখানার ছাদ" },
    type: { en: "Commercial & Industrial · Net metering", bn: "বাণিজ্যিক ও শিল্প · নেট মিটারিং" },
    location: { en: "Gazipur", bn: "গাজীপুর" },
    capacity: "1.8 MWp",
    year: "2024",
    summary: {
      en: "Covers 38% of daytime load and cut the factory's grid bill by ৳1.1 crore a year.",
      bn: "দিনের লোডের ৩৮% পূরণ করে, কারখানার বিদ্যুৎ বিল বছরে ১.১ কোটি টাকা কমিয়েছে।",
    },
    image: "/media/img/rooftop-sunset.jpg",
    sample: true,
  },
  {
    slug: "purbachal-residences",
    title: { en: "Purbachal Residences", bn: "পূর্বাচল রেসিডেন্স" },
    type: { en: "Residential · Hybrid + storage", bn: "বাসাবাড়ি · হাইব্রিড + স্টোরেজ" },
    location: { en: "Dhaka", bn: "ঢাকা" },
    capacity: "240 kWp",
    year: "2025",
    summary: {
      en: "48 homes on hybrid systems with CELLA storage — zero load-shedding for residents.",
      bn: "CELLA স্টোরেজসহ ৪৮টি বাসায় হাইব্রিড সিস্টেম — বাসিন্দাদের জন্য লোডশেডিং শূন্য।",
    },
    image: "/media/img/house-modern.jpg",
    sample: true,
  },
  {
    slug: "chattogram-warehouse",
    title: { en: "Port Logistics Warehouse", bn: "পোর্ট লজিস্টিকস ওয়্যারহাউস" },
    type: { en: "Commercial & Industrial · Zero export", bn: "বাণিজ্যিক ও শিল্প · জিরো এক্সপোর্ট" },
    location: { en: "Chattogram", bn: "চট্টগ্রাম" },
    capacity: "620 kWp",
    year: "2024",
    summary: {
      en: "Cyclone-rated mounting on a coastal warehouse roof, monitored 24/7.",
      bn: "উপকূলীয় ওয়্যারহাউসের ছাদে ঘূর্ণিঝড় সহনশীল মাউন্টিং, ২৪/৭ মনিটরিং।",
    },
    image: "/media/img/panels-field.jpg",
    sample: true,
  },
  {
    slug: "sylhet-tea-estate",
    title: { en: "Tea Estate Mini-Grid", bn: "চা বাগান মিনি-গ্রিড" },
    type: { en: "Off-grid · Storage", bn: "অফ-গ্রিড · স্টোরেজ" },
    location: { en: "Sylhet", bn: "সিলেট" },
    capacity: "410 kWp",
    year: "2023",
    summary: {
      en: "Solar mini-grid with 1 MWh storage powering processing and 600 workers' homes.",
      bn: "১ মেগাওয়াট-আওয়ার স্টোরেজসহ সোলার মিনি-গ্রিড, প্রসেসিং ও ৬০০ শ্রমিকের বাসায় বিদ্যুৎ।",
    },
    image: "/media/img/aerial-forest.jpg",
    sample: true,
  },
  {
    slug: "rajshahi-agro-irrigation",
    title: { en: "Solar Irrigation Cluster", bn: "সোলার সেচ ক্লাস্টার" },
    type: { en: "Agriculture · Solar pumping", bn: "কৃষি · সোলার পাম্প" },
    location: { en: "Rajshahi", bn: "রাজশাহী" },
    capacity: "1.2 MWp",
    year: "2024",
    summary: {
      en: "86 solar pumps replacing diesel for 2,400 acres of farmland.",
      bn: "২,৪০০ একর জমিতে ডিজেলের বদলে ৮৬টি সোলার পাম্প।",
    },
    image: "/media/img/panels-clouds.jpg",
    sample: true,
  },
];
