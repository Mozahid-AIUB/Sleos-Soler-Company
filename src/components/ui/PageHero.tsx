import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export function PageHero({
  eyebrow,
  title,
  body,
  image,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  image: string;
  crumbs: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 pb-16 pt-36 text-white lg:pb-24 lg:pt-44">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950 via-forest-950/80 to-forest-950/30" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-forest-950/80 to-transparent" />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="hero-in">
          <ol className="flex flex-wrap items-center gap-2 text-[13.5px] text-white/55">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <Icon name="chevronDown" size={14} className="-rotate-90" />}
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/85">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow hero-in mt-8 text-gold-400 [animation-delay:80ms]">{eyebrow}</p>
        <h1 className="display hero-in mt-5 max-w-4xl text-[clamp(40px,6vw,80px)] [animation-delay:160ms]">{title}</h1>
        {body && <p className="lead hero-in mt-6 max-w-2xl text-white/70 [animation-delay:240ms]">{body}</p>}
        {children && <div className="hero-in mt-9 [animation-delay:320ms]">{children}</div>}
      </div>
    </section>
  );
}
