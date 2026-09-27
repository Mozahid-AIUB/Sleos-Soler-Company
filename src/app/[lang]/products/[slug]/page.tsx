import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { categories, getProduct, products } from "@/content/products";
import { whatsappLink } from "@/content/site";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCard, quoteHref } from "@/components/product/ProductCard";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { SplitText } from "@/components/motion/SplitText";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export const generateStaticParams = () => locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) return {};
  const title = product.brand ? `${product.brand} ${product.name}` : product.name;
  return { title, description: `${product.tagline[lang]}. ${product.keySpec[lang]}` };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) notFound();
  const t = await getDictionary(lang);
  const tp = t.product;
  const category = categories.find((c) => c.id === product.category);
  const fullName = product.brand ? `${product.brand} ${product.name}` : product.name;
  const sameCategory = products.filter((p) => p.slug !== product.slug && p.category === product.category);
  // Prefer other brands in the same category, then fill up with the rest of the category.
  const related = [
    ...sameCategory.filter((p) => p.brand !== product.brand),
    ...sameCategory.filter((p) => p.brand === product.brand),
  ].slice(0, 4);
  const perks = [
    { icon: "shield" as const, text: tp.cod },
    { icon: "wrench" as const, text: tp.delivery },
    { icon: "phone" as const, text: tp.support },
  ];
  const rows = [
    ...(product.brand ? [{ label: tp.brand, value: product.brand }] : []),
    { label: tp.model, value: product.name },
    ...product.specs.map((s) => ({ label: s.label[lang], value: s.value })),
    ...(product.warranty ? [{ label: tp.warranty, value: product.warranty[lang] }] : []),
  ];

  return (
    <>
      <div className="h-[72px] lg:h-[120px]" />
      <section className="bg-cream-50 pb-20 pt-8 lg:pb-28">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="hero-in text-[13.5px] text-ink-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href={`/${lang}`} className="link-line hover:text-ink-900">{t.common.home}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/${lang}/products`} className="link-line hover:text-ink-900">{tp.back}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-900">{product.name}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* Visual */}
            <div className="reveal-img group relative aspect-square overflow-hidden rounded-lg bg-cream-100 md:aspect-[4/3] lg:aspect-square lg:sticky lg:top-28 lg:self-start">
              <ProductImage src={product.image} alt={fullName} sizes="(min-width: 1024px) 55vw, 100vw" />
            </div>

            {/* Info */}
            <div>
              <p className="reveal text-[13px] font-semibold uppercase tracking-[0.16em] text-teal-600" style={at(0)}>
                {product.brand ? `${product.brand} · ` : ""}
                {category?.name[lang]}
              </p>
              <SplitText as="h1" text={product.name} now delayMs={120} className="mt-3 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-[1.08] tracking-tight" />
              <p className="reveal lead mt-4 text-ink-600" style={at(1)}>
                {product.tagline[lang]}
              </p>

              <div className="reveal mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-cream-200 py-6" style={at(2)}>
                <span className="text-[clamp(22px,2.4vw,28px)] font-extrabold tracking-tight">{product.keySpec[lang]}</span>
              </div>

              <p className="reveal mt-7 leading-relaxed text-ink-600" style={at(3)}>
                {product.description[lang]}
              </p>

              <h2 className="reveal mt-8 text-[15px] font-bold" style={at(3)}>
                {tp.highlights}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.highlights[lang].map((h, i) => (
                  <li key={h} className="reveal flex items-start gap-3 text-[15px]" style={at(3 + (i % 2))}>
                    <Icon name="check" size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-teal-600" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="reveal mt-9 grid gap-3 sm:grid-cols-2" style={at(4)}>
                <Link href={quoteHref(lang, product.slug)} className="btn btn-dark w-full">
                  {tp.requestQuote}
                  <Icon name="arrowRight" size={18} />
                </Link>
                <a
                  href={whatsappLink(`Hello OSLEOS, I have a question about ${fullName}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full"
                >
                  <WhatsappIcon size={19} />
                  {tp.askWhatsapp}
                </a>
              </div>
              <p className="reveal-fade mt-4 text-[13.5px] leading-relaxed text-ink-400" style={at(5)}>
                {tp.quoteNote}
              </p>

              <ul className="reveal mt-6 grid gap-3 rounded-lg border border-cream-200 bg-white p-5">
                {perks.map((p) => (
                  <li key={p.text} className="flex items-center gap-3 text-[14.5px] text-ink-600">
                    <Icon name={p.icon} size={19} className="shrink-0 text-teal-600" />
                    {p.text}
                  </li>
                ))}
              </ul>

              <h2 className="reveal mt-10 text-[20px] font-bold">{tp.specs}</h2>
              <dl className="mt-4 divide-y divide-cream-200 overflow-hidden rounded-lg border border-cream-200 bg-white">
                {rows.map((r, i) => (
                  <div key={r.label} className="reveal-fade grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-5 py-3.5 text-[14.5px]" style={at(Math.min(i + 1, 6))}>
                    <dt className="text-ink-600">{r.label}</dt>
                    <dd className="font-semibold [overflow-wrap:anywhere]">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <a href={whatsappLink(`Please send me the datasheet for ${fullName}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-6">
                <Icon name="download" size={18} />
                {tp.datasheet}
              </a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y !pt-0 bg-cream-50">
          <div className="container-x">
            <SplitText as="h2" text={tp.related} className="h2 !text-[clamp(28px,3vw,40px)]" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <div key={p.slug} className="reveal flex" style={at(i)}>
                  <ProductCard product={p} lang={lang} t={tp} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
