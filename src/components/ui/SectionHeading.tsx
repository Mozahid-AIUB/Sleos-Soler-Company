import type { CSSProperties, ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";

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
    <div className={`flex flex-col gap-6 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className="max-w-3xl">
        <p className={`eyebrow reveal-fade ${dark ? "text-gold-400" : "text-teal-600"}`}>{eyebrow}</p>
        <SplitText as="h2" text={title} className={`h2 mt-4 ${dark ? "text-white" : "text-ink-900"}`} />
        {body && (
          <p
            className={`lead reveal mt-5 max-w-2xl ${center ? "mx-auto" : ""} ${dark ? "text-white/65" : "text-ink-600"}`}
            style={{ "--i": 2 } as CSSProperties}
          >
            {body}
          </p>
        )}
      </div>
      {action && (
        <div className="reveal shrink-0" style={{ "--i": 3 } as CSSProperties}>
          {action}
        </div>
      )}
    </div>
  );
}
