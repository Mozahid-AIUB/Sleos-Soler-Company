import type { ReactNode } from "react";

/** Plain, readable layout for policy pages: sticky contents list + numbered sections. */
export function LegalDoc({
  updated,
  onThisPage,
  sections,
  children,
}: {
  updated: string;
  onThisPage: string;
  sections: readonly { h: string; p: readonly string[] }[];
  children?: ReactNode;
}) {
  return (
    <section className="bg-white py-14 lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-20">
        <aside className="hidden lg:block">
          <nav aria-label={onThisPage} className="sticky top-28">
            <p className="eyebrow text-ink-400">{onThisPage}</p>
            <ol className="mt-4 space-y-2.5 text-[14.5px]">
              {sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#s${i + 1}`} className="link-line text-ink-600 transition-colors hover:text-forest-900">
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-3xl">
          <p className="reveal-fade text-[14px] font-medium text-teal-600">{updated}</p>
          {sections.map((s, i) => (
            <div key={s.h} id={`s${i + 1}`} className="reveal scroll-mt-28 border-t border-cream-200 py-8 first-of-type:mt-6">
              <h2 className="text-[21px] font-bold text-ink-900">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para.slice(0, 32)} className="mt-3 text-[16px] leading-[1.75] text-ink-600">
                  {para}
                </p>
              ))}
            </div>
          ))}
          {children}
        </article>
      </div>
    </section>
  );
}
