import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CartPageView } from "@/components/cart/CartPageView";

export async function generateMetadata({ params }: PageProps<"/[lang]/cart">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.cart.title, robots: { index: false } };
}

export default async function CartPage({ params }: PageProps<"/[lang]/cart">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return (
    <>
      <div className="h-[72px] lg:h-[120px]" />
      <section className="min-h-[70vh] bg-cream-50 pb-24 pt-12">
        <div className="container-x">
          <h1 className="h2">{t.cart.title}</h1>
          <CartPageView lang={lang} t={t.cart} tp={t.product} />
        </div>
      </section>
    </>
  );
}
