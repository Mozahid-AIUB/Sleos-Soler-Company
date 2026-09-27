import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, whatsappLink } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, Icon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[lang]/links">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.footer.links, description: t.links.body };
}

type Item = { href: string; label: string; sub?: string; icon: ReactNode; external?: boolean; internal?: boolean; primary?: boolean };

export default async function LinksPage({ params }: PageProps<"/[lang]/links">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const l = t.links;

  const items: Item[] = [
    { href: `/${lang}/quote`, label: l.quote, sub: t.quote.eyebrow, icon: <Icon name="sun" size={20} />, internal: true, primary: true },
    { href: whatsappLink(), label: l.whatsapp, sub: site.whatsappDisplay, icon: <WhatsappIcon size={20} />, external: true },
    { href: `/${lang}`, label: l.website, sub: "osleos.com", icon: <Icon name="globe" size={20} />, internal: true },
    { href: site.social.facebook, label: l.facebook, sub: "OSLEOS", icon: <FacebookIcon size={20} />, external: true },
    { href: site.social.instagram, label: l.instagram, sub: "@osleoshq", icon: <InstagramIcon size={20} />, external: true },
    { href: site.social.linkedin, label: l.linkedin, sub: "OSLEOS", icon: <LinkedinIcon size={20} />, external: true },
    { href: `mailto:${site.email}`, label: l.email, sub: site.email, icon: <Icon name="mail" size={20} /> },
    ...site.phones.map((p) => ({ href: p.href, label: l.call, sub: p.display, icon: <Icon name="phone" size={20} /> })),
    { href: site.mapsUrl, label: l.location, sub: site.address[lang], icon: <Icon name="pin" size={20} />, external: true },
  ];

  return (
    <section className="relative isolate min-h-dvh overflow-hidden bg-forest-950 pb-20 pt-28 text-white sm:pt-36">
      <div aria-hidden="true" className="hero-media absolute inset-0 -z-10">
        <Image src="/media/img/panels-sky.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/70 via-forest-950/90 to-forest-950" />

      <div className="mx-auto w-full max-w-[520px] px-4 sm:px-6">
        <div className="hero-in flex flex-col items-center text-center">
          <Logo light className="h-10 sm:h-11" priority />
          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-400">{l.tagline}</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/65">{l.body}</p>
        </div>

        <ul className="mt-10 grid gap-3">
          {items.map((it, i) => {
            const cls = `group/link flex min-h-[64px] items-center gap-4 rounded-lg px-4 py-3 transition-[background-color,border-color,transform] duration-300 active:scale-[0.99] sm:px-5 ${
              it.primary
                ? "bg-gold-500 text-forest-950 hover:bg-gold-400"
                : "border border-white/12 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]"
            }`;
            const inner = (
              <>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center ${it.primary ? "" : "text-gold-400"}`}>{it.icon}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[16px] font-semibold leading-tight">{it.label}</span>
                  {it.sub && (
                    <span className={`mt-0.5 line-clamp-2 text-[13px] leading-snug ${it.primary ? "text-forest-950/70" : "text-white/50"}`}>{it.sub}</span>
                  )}
                </span>
                <Icon
                  name={it.external ? "arrowUpRight" : "arrowRight"}
                  size={18}
                  className="shrink-0 opacity-60 transition-transform duration-300 group-hover/link:translate-x-0.5"
                />
              </>
            );
            return (
              <li key={`${it.href}-${it.sub}`} className="hero-in" style={{ animationDelay: `${120 + i * 45}ms` } as CSSProperties}>
                {it.internal ? (
                  <Link href={it.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <a href={it.href} className={cls} {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-[13px] text-white/45">
          {t.contact.hours} · {t.footer.years}
        </p>
      </div>
    </section>
  );
}
