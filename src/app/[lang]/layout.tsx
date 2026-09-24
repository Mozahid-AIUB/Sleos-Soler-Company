import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
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
    alternates: { canonical: `/${lang}`, languages: { en: "/en", bn: "/bn" } },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      images: ["/media/img/hero-poster.jpg"],
      locale: lang === "bn" ? "bn_BD" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <html lang={lang} className={`${jakarta.variable} ${hind.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-500 focus:px-5 focus:py-3 focus:font-semibold focus:text-forest-950">
          Skip to content
        </a>
        <Header lang={lang} t={t.nav} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <WhatsAppFloat label={t.contact.whatsapp} />
        <CartDrawer lang={lang} t={t.cart} tp={t.product} />
      </body>
    </html>
  );
}
