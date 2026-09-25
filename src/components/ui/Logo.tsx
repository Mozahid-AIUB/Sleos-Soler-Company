import Image from "next/image";
import baseWhite from "../../../public/brand/osleos-logo-white-base.png";
import baseBlack from "../../../public/brand/osleos-logo-black-base.png";
import arcsWhite from "../../../public/brand/osleos-logo-white-arcs.png";
import arcsBlack from "../../../public/brand/osleos-logo-black-arcs.png";

/**
 * Official OSLEOS logo. The wordmark and sun disc are static; the two gold
 * arcs orbit the disc continuously (paused for prefers-reduced-motion).
 * Arc layer placement comes from logo_split.py (percent of the logo box,
 * centred on the disc).
 */
const ARCS = {
  white: { left: 0.331, top: 0.888, width: 22.001, height: 98.225 },
  black: { left: 0.331, top: 0.888, width: 22.001, height: 98.225 },
} as const;

export function Logo({
  light = true,
  className = "h-8 lg:h-9",
  priority = false,
}: {
  light?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const base = light ? baseWhite : baseBlack;
  const arcs = light ? arcsWhite : arcsBlack;
  const g = light ? ARCS.white : ARCS.black;
  return (
    <span className={`relative inline-block ${className}`}>
      <Image src={base} alt="OSLEOS" priority={priority} sizes="180px" className="h-full w-auto" />
      <Image
        src={arcs}
        alt=""
        aria-hidden="true"
        priority={priority}
        sizes="48px"
        className="logo-arcs pointer-events-none absolute max-w-none"
        style={{ left: `${g.left}%`, top: `${g.top}%`, width: `${g.width}%`, height: `${g.height}%` }}
      />
    </span>
  );
}
