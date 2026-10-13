import Image from "next/image";

export function ProductImage({
  src,
  alt,
  sizes,
  position,
  fit = "cover",
  eager = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  position?: string;
  fit?: "cover" | "contain";
  /** The page's main (above-the-fold) picture: preloaded and fetched at high priority instead of lazily. */
  eager?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={eager}
      fetchPriority={eager ? "high" : undefined}
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]`}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
