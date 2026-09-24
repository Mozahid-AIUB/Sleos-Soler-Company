import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/checkout">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.checkout.title, robots: { index: false } };
}

export default async function CheckoutPage({ params }: PageProps<"/[lang]/checkout">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return (
    <>
      <div className="h-[72px] lg:h-[120px]" />
      <section className="min-h-[70vh] bg-cream-50 pb-24 pt-12">
        <div className="container-x">
          <h1 className="h2">{t.checkout.title}</h1>
          <CheckoutForm lang={lang} t={t.checkout} tc={t.cart} tp={t.product} />
        </div>
      </section>
    </>
  );
}
