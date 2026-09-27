import { notFound, redirect } from "next/navigation";
import { hasLocale } from "@/i18n/config";

/** The catalogue is quote-only; the old cart now sends visitors to the quote form. */
export default async function CartPage({ params }: PageProps<"/[lang]/cart">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  redirect(`/${lang}/quote`);
}
