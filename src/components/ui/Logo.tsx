import Image from "next/image";
import baseWhite from "../../../public/brand/osleos-logo-white-base.webp";
import baseColor from "../../../public/brand/osleos-logo-color-base.webp";
import arcsWhite from "../../../public/brand/osleos-logo-white-arcs.webp";
import arcsBlack from "../../../public/brand/osleos-logo-black-arcs.webp";

/**
 * Official OSLEOS logo: white wordmark on dark backgrounds, brand-blue
 * wordmark on light ones. The wordmark and sun disc are static; the two gold
 * arcs orbit the disc continuously (paused for prefers-reduced-motion).
 * Arc layer placement is the square arc layer's box as a percent of the logo
 * box, centred on the disc (the arcs are split out of the supplied artwork).
 */
const ARCS = {
  white: { left: -0.567, top: 0, width: 21.388, height: 101.342 },
  black: { left: -0.567, top: 0, width: 21.388, height: 101.342 },
} as const;

export function Logo({
  light = true,
  className = "h-8 lg:h-9",
  priority = false,
  animated = true,
}: {
  light?: boolean;
  className?: string;
  priority?: boolean;
  /** Set false for small static uses (e.g. product cards) so the arcs do not orbit. */
  animated?: boolean;
}) {
  const base = light ? baseWhite : baseColor;
  const arcs = light ? arcsWhite : arcsBlack;
  const g = light ? ARCS.white : ARCS.black;
  return (
    <span className={`relative inline-block ${className}`}>
      <Image src={base} alt="OSLEOS" priority={priority} unoptimized className="h-full w-auto" />
      <Image
        src={arcs}
        alt=""
        aria-hidden="true"
        priority={priority}
        unoptimized
        className={`${animated ? "logo-arcs " : ""}pointer-events-none absolute max-w-none`}
        style={{ left: `${g.left}%`, top: `${g.top}%`, width: `${g.width}%`, height: `${g.height}%` }}
      />
    </span>
  );
}
