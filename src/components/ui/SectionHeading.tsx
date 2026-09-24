import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  body,
  dark = false,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`reveal flex flex-col gap-6 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "max-w-3xl" : "max-w-3xl"}>
        <p className={`eyebrow ${dark ? "text-gold-400" : "text-teal-600"}`}>{eyebrow}</p>
        <h2 className={`h2 mt-5 ${dark ? "text-white" : "text-ink-900"}`}>{title}</h2>
        {body && <p className={`lead mt-5 max-w-2xl ${center ? "mx-auto" : ""} ${dark ? "text-white/65" : "text-ink-600"}`}>{body}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
