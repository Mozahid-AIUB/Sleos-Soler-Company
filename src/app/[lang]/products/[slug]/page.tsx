import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { categories, getProduct, products } from "@/content/products";
import { whatsappLink } from "@/content/site";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { BuyBox } from "@/components/product/BuyBox";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { SplitText } from "@/components/motion/SplitText";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export const generateStaticParams = () => locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) return {};
  return { title: product.name, description: product.tagline[lang] };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) notFound();
  const t = await getDictionary(lang);
  const tp = t.product;
  const category = categories.find((c) => c.id === product.category);
  const related = products.filter((p) => p.slug !== product.slug && p.price !== null && p.category !== product.category).slice(0, 4);
  const perks = [
    { icon: "truck" as const, text: tp.delivery },
    { icon: "cash" as const, text: tp.cod },
    { icon: "shield" as const, text: product.warranty[lang] },
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
              <ProductImage src={product.image} alt={product.name} sizes="(min-width: 1024px) 55vw, 100vw" />
              {product.badge && (
                <span className="absolute left-6 top-6 rounded bg-white px-2.5 py-1 text-[13px] font-semibold text-forest-900">{product.badge[lang]}</span>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="reveal text-[13px] font-semibold uppercase tracking-[0.16em] text-teal-600" style={at(0)}>{category?.name[lang]}</p>
              <SplitText as="h1" text={product.name} now delayMs={120} className="mt-3 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-[1.08] tracking-tight" />
              <p className="reveal lead mt-4 text-ink-600" style={at(1)}>
                {product.tagline[lang]}
              </p>

              <div className="reveal mt-7 flex items-baseline gap-3 border-y border-cream-200 py-6" style={at(2)}>
                {product.price ? (
                  <>
                    <span className="text-[36px] font-extrabold tracking-tight tabular-nums">{formatPrice(product.price, lang)}</span>
                    {product.compareAt && <span className="text-[18px] text-ink-400 line-through tabular-nums">{formatPrice(product.compareAt, lang)}</span>}
                    <span className="ml-auto flex items-center gap-1.5 text-[14px] font-medium text-teal-600">
                      <span className="h-2 w-2 rounded-full bg-teal-500" />
                      {tp.inStock}
                    </span>
                  </>
                ) : (
                  <span className="text-[24px] font-bold">{tp.priceOnRequest}</span>
                )}
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

              <div className="reveal mt-9" style={at(4)}>
                <BuyBox lang={lang} slug={product.slug} quoteOnly={product.price === null} t={tp} />
              </div>
              <a
                href={whatsappLink(`Hello OSLEOS, I have a question about ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-full py-3 text-[14.5px] font-semibold text-[#128c4a] transition-colors hover:bg-[#25d366]/10"
              >
                <WhatsappIcon size={19} />
                {t.contact.whatsapp}
              </a>

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
                {product.specs.map((s, i) => (
                  <div key={s.label.en} className="reveal-fade grid grid-cols-2 gap-4 px-5 py-3.5 text-[14.5px]" style={at(Math.min(i + 1, 6))}>
                    <dt className="text-ink-600">{s.label[lang]}</dt>
                    <dd className="font-semibold">{s.value}</dd>
                  </div>
                ))}
                <div className="reveal-fade grid grid-cols-2 gap-4 px-5 py-3.5 text-[14.5px]" style={at(Math.min(product.specs.length + 1, 6))}>
                  <dt className="text-ink-600">{tp.warranty}</dt>
                  <dd className="font-semibold">{product.warranty[lang]}</dd>
                </div>
              </dl>
              <a href={whatsappLink(`Please send me the datasheet for ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-6">
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
