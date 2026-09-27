import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal-contacts">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.contacts.title, description: t.legal.contacts.body };
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;
const linkClass = "underline decoration-cream-200 underline-offset-4 transition-colors hover:text-forest-900 hover:decoration-forest-900";

export default async function LegalContactsPage({ params }: PageProps<"/[lang]/legal-contacts">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const c = t.legal.contacts;

  const rows: { label: string; value: ReactNode }[] = [
    { label: c.company, value: site.name },
    { label: c.office, value: site.address[lang] },
    { label: c.email, value: <a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a> },
    {
      label: c.phone,
      value: (
        <span className="grid gap-1">
          {site.phones.map((p) => (
            <a key={p.href} href={p.href} className={`${linkClass} justify-self-start`}>
              {p.display}
            </a>
          ))}
        </span>
      ),
    },
    { label: c.hours, value: t.contact.hours },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.legal.eyebrow}
        title={c.title}
        body={c.body}
        image="/media/img/engineer-panel.jpg"
        crumbs={[{ href: `/${lang}`, label: t.common.home }, { label: c.title }]}
      />
      <section className="bg-white py-14 lg:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="reveal-fade text-[14px] font-medium text-teal-600">{t.common.updated}</p>
            <dl className="mt-6 border-t border-cream-200">
              {rows.map((r, i) => (
                <div key={r.label} className="reveal grid grid-cols-[120px_1fr] gap-4 border-b border-cream-200 py-4 text-[15px] sm:grid-cols-[170px_1fr]" style={at(Math.min(i, 4))}>
                  <dt className="text-ink-400">{r.label}</dt>
                  <dd className="min-w-0 font-medium leading-relaxed text-ink-900">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="reveal text-[21px] font-bold text-ink-900">{c.topicsTitle}</h2>
            <ul className="mt-6">
              {c.topics.map((topic, i) => (
                <li key={topic.title} className="reveal border-t border-cream-200 py-5" style={at(i + 1)}>
                  <h3 className="font-semibold text-ink-900">
                    {i === 3 ? (
                      <Link href={`/${lang}/security`} className="link-line">
                        {topic.title}
                      </Link>
                    ) : (
                      topic.title
                    )}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-ink-600">{topic.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
