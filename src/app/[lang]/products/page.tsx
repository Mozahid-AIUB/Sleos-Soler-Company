import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { categories, products } from "@/content/products";
import { PageHero } from "@/components/ui/PageHero";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Newsletter } from "@/components/home/Newsletter";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.pages.products.title, description: t.pages.products.body };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.pages.products;

  const tabs = [
    { id: "all" as const, label: t.product.all, count: products.length },
    ...categories
      .map((c) => ({ id: c.id, label: c.name[lang], count: products.filter((x) => x.category === c.id).length }))
      .filter((c) => c.count > 0),
  ];

  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        image="/media/img/panels-sky.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: p.title }]}
      />
      <section className="section-y !pt-14 bg-cream-50">
        <div className="container-x">
          <ProductGrid
            tabs={tabs}
            cards={products.map((prod) => ({
              key: prod.slug,
              category: prod.category,
              node: <ProductCard product={prod} lang={lang} t={t.product} />,
            }))}
          />
        </div>
      </section>
      <Newsletter t={t.newsletter} />
    </>
  );
}
