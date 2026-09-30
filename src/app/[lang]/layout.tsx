import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import { hasLocale, locales, localeTags, ogLocales } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { categories } from "@/content/products";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AssistantWidget } from "@/components/chat/AssistantWidget";
import { MotionProvider } from "@/components/motion/MotionProvider";
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

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

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
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])),
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: "OSLEOS" }],
      locale: ogLocales[lang],
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <html lang={localeTags[lang]} data-scroll-behavior="smooth" className={`${jakarta.variable} ${hind.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-500 focus:px-5 focus:py-3 focus:font-semibold focus:text-forest-950">
          Skip to content
        </a>
        <Header
          lang={lang}
          t={t.nav}
          categories={categories.map((c) => ({ id: c.id, name: pick(c.name, lang), blurb: pick(c.blurb, lang), image: c.image }))}
        />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <AssistantWidget lang={lang} t={t.assistant} />
        <MotionProvider />
      </body>
    </html>
  );
}
