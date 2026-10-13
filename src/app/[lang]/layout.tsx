import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { hasLocale, locales, localeTags, ogLocales } from "@/i18n/config";
import { pageAlternates } from "@/lib/seo";
import { pick } from "@/i18n/content";
import { getCategories } from "@/lib/catalog";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, contactOf, type SiteInfo } from "@/content/site";
import { getSite } from "@/lib/site-content";
import { SiteProvider } from "@/components/layout/SiteProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AssistantWidget } from "@/components/chat/AssistantWidget";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import "../globals.css";

// Variable font: one file covers every weight used.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
  // Only needed on Bangla text; don't make English pages download it up front.
  preload: false,
});

// Prices on every language page start with the taka sign (৳, U+09F3), which Plus
// Jakarta Sans lacks, so the browser fetched Hind Siliguri's 40 KB Bengali file
// once per weight (up to three on the product list) just to draw one glyph.
// These files hold only that glyph, cut from the same Hind Siliguri fonts
// (about 0.7 KB each, same outlines and metrics). Bangla pages still use the
// full Hind Siliguri above.
const taka = localFont({
  src: [
    { path: "../fonts/hind-taka-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/hind-taka-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/hind-taka-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/hind-taka-700.woff2", weight: "700", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+09F3" }],
  variable: "--font-taka",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

// Safety net: every page under /[lang] is regenerated at most every 5 minutes (catalogue data comes from the CMS).
// Saving in the admin also calls revalidatePath, so edits normally show up at once.
export const revalidate = 300;

export const viewport: Viewport = {
  themeColor: "#06130e",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s · ${site.name}` },
    description: t.meta.description,
    // Home page; every other page sets its own in generateMetadata.
    alternates: pageAlternates(lang),
    // Google Search Console HTML-tag verification (set GOOGLE_SITE_VERIFICATION in Coolify).
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: "OSLEOS" }],
      locale: ogLocales[lang],
      type: "website",
    },
  };
}

/** Organisation + website data for Google (knowledge panel, local results). */
const orgSchema = (site: SiteInfo) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/osleos-app-icon.png`,
      image: `${site.url}/brand/og.jpg`,
      description: "Complete solar power systems, inverters, batteries and voltage stabilizers for homes, businesses and industry in Bangladesh.",
      telephone: site.phones[0].display,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Tanjima Villa, 31/1, Lift-2, Flat-C2 (2nd Floor), East Hazipara, Rampura",
        addressLocality: "Dhaka",
        postalCode: "1219",
        addressCountry: "BD",
      },
      geo: { "@type": "GeoCoordinates", latitude: 23.7586356, longitude: 90.4184124 },
      areaServed: { "@type": "Country", name: "Bangladesh" },
      sameAs: Object.values(site.social),
    },
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, publisher: { "@id": `${site.url}/#organization` }, inLanguage: locales.map((l) => localeTags[l]) },
  ],
});

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, categories, live] = await Promise.all([getDictionary(lang), getCategories(), getSite()]);

  return (
    <html lang={localeTags[lang]} data-scroll-behavior="smooth" className={`${jakarta.variable} ${hind.variable} ${taka.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-500 focus:px-5 focus:py-3 focus:font-semibold focus:text-forest-950">
          Skip to content
        </a>
        <SiteProvider contact={contactOf(live)}>
        <Header
          lang={lang}
          t={t.nav}
          categories={categories.map((c) => ({ id: c.id, name: pick(c.name, lang), blurb: pick(c.blurb, lang), image: c.image }))}
        />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <AssistantWidget lang={lang} t={t.assistant} />
        </SiteProvider>
        <MotionProvider />
        <JsonLd data={orgSchema(live)} />
        <Analytics />
      </body>
    </html>
  );
}
