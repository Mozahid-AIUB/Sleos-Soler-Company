import "server-only";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { site } from "@/content/site";
import { search } from "@/lib/rag/search";

/*
 * Ready-made answers for when no AI provider can answer (not configured, rate-limited or down).
 * Rule-based: a few common intents (greeting, contact, hours, price, incentive) are answered from
 * the site data; anything else gets the website pages that match the question. The visitor always
 * gets a useful reply instead of an error.
 */

const BN = /[ঀ-৿]/;

const GREETING =
  /^\s*(hi+|hello+|hey+|hlw|helo|salam|assalamu\w*|good\s+(morning|afternoon|evening)|ki\s+obost\w*|kemon\s+\w+|how\s+are\s+you|নমস্কার|হ্যালো|হাই|সালাম|আসসালামু\w*|কেমন\s+আছ\w*)[\s!?.।,]*$/i;
const CONTACT = /(phone|number|call|contact|address|office|location|where|map|email|mail|whatsapp|ফোন|নম্বর|নাম্বার|কল|যোগাযোগ|ঠিকানা|অফিস|কোথায়|ইমেইল|হোয়াটসঅ্যাপ)/i;
const HOURS = /(open|close|hours?|timing|schedule|সময়|খোলা|বন্ধ|ঘণ্টা|ঘন্টা)/i;
const PRICE = /(price|cost|rate|how\s+much|quote|quotation|estimate|দাম|মূল্য|খরচ|কত\s*টাকা|কত|কোটেশন)/i;

export function fallbackAnswer(question: string, lang: Locale): string {
  const bn = lang === "bn" || BN.test(question);
  // Path prefix for links: Bangla when the question is Bangla, else the site language.
  const l = bn ? "bn" : lang;
  const q = question.trim();
  const phones = site.phones.map((p) => p.display).join(", ");
  const wa = site.whatsappDisplay;
  const address = pick(site.address, bn ? "bn" : "en");
  const note = bn
    ? "\n\n(এটি স্বয়ংক্রিয় উত্তর। বিস্তারিত জানতে আমাদের টিমকে হোয়াটসঅ্যাপে লিখুন।)"
    : "\n\n(Automatic reply. For a detailed answer, message our team on WhatsApp.)";

  if (GREETING.test(q)) {
    return bn
      ? "হ্যালো! আমি OSLEOS-এর সহকারী। সোলার প্যানেল, ইনভার্টার, ব্যাটারি, স্ট্যাবিলাইজার বা সোলার সমাধান নিয়ে প্রশ্ন করুন।"
      : "Hello! I'm the OSLEOS assistant. Ask me about solar panels, inverters, batteries, stabilizers or solar solutions for your home, business or factory.";
  }

  if (CONTACT.test(q)) {
    return bn
      ? `আমাদের অফিস: ${address}\nফোন: ${phones}\nহোয়াটসঅ্যাপ: ${wa}\nইমেইল: ${site.email}\n\nযোগাযোগ পেজ: /${l}/contact`
      : `Our office: ${address}\nPhone: ${phones}\nWhatsApp: ${wa}\nEmail: ${site.email}\n\nContact page: /${l}/contact`;
  }

  if (HOURS.test(q)) {
    return (bn ? "আমরা শনি থেকে বৃহস্পতিবার, সকাল ১০টা থেকে রাত ৯টা পর্যন্ত খোলা থাকি।" : "We are open Saturday to Thursday, 10:00 to 21:00.") +
      (bn ? `\nফোন: ${phones}` : `\nPhone: ${phones}`);
  }

  if (PRICE.test(q)) {
    return (
      (bn
        ? `প্রতিটি সিস্টেম আপনার লোড ও ছাদ অনুযায়ী ডিজাইন হয়, তাই দাম প্রকল্প অনুযায়ী কোটেশনে জানানো হয়। মেজারমেন্ট ফর্ম পূরণ করুন: /${l}/quote\nঅথবা হোয়াটসঅ্যাপ করুন: ${wa}\nতৈরি কম্বো প্যাকেজ দেখুন: /${l}/products#combo`
        : `Every system is sized to your load and roof, so prices are given in a written quotation. Fill in the Measurement Form: /${l}/quote\nOr message us on WhatsApp: ${wa}\nSee the ready-made combo packages: /${l}/products#combo`)
    );
  }

  const { hits } = search(q, { lang: bn ? "bn" : "en", k: 3 });
  if (hits.length) {
    const lines = hits.map((h) => {
      const first = h.text.replace(/\s+/g, " ").trim().slice(0, 160);
      return `- ${h.title}: ${first}${h.text.length > 160 ? "…" : ""} (${h.url})`;
    });
    return (bn ? "আপনার প্রশ্নের সাথে সম্পর্কিত তথ্য:\n" : "Here is what we found on our website:\n") + lines.join("\n") + note;
  }

  return (
    (bn
      ? `আপনার প্রশ্নের সরাসরি উত্তর এখন দিতে পারছি না। আপনি প্রোডাক্ট দেখতে পারেন (/${l}/products), মেজারমেন্ট ফর্ম পূরণ করতে পারেন (/${l}/quote) বা হোয়াটসঅ্যাপে লিখতে পারেন: ${wa}`
      : `I can't answer that directly right now. You can browse our products (/${l}/products), fill in the Measurement Form (/${l}/quote) or message us on WhatsApp: ${wa}`)
  );
}
