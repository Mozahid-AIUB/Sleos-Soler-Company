import Image from "next/image";
import logoWhite from "../../../public/brand/osleos-logo-white.png";
import logoBlack from "../../../public/brand/osleos-logo-black.png";

/**
 * Official OSLEOS logo (sun mark + wordmark). `light` = white wordmark for dark
 * backgrounds; otherwise black wordmark for light backgrounds.
 */
export function Logo({ light = true, className = "h-8 w-auto lg:h-9", priority = false }: { light?: boolean; className?: string; priority?: boolean }) {
  return (
    <Image
      src={light ? logoWhite : logoBlack}
      alt="OSLEOS"
      priority={priority}
      sizes="180px"
      className={className}
    />
  );
}
