import { Logo } from "@/components/ui/Logo";
import { OSLEOS_BRAND } from "@/content/products";

/** Brand name as text, or the OSLEOS logo for OSLEOS-branded items. */
export function BrandMark({ brand, className = "h-[15px]" }: { brand: string; className?: string }) {
  if (brand !== OSLEOS_BRAND) return <>{brand}</>;
  return (
    <>
      <span className="sr-only">{brand}</span>
      <Logo light={false} animated={false} className={`align-middle ${className}`} />
    </>
  );
}
