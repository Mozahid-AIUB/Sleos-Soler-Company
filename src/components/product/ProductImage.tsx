import Image from "next/image";

export function ProductImage({ src, alt, sizes, position }: { src: string; alt: string; sizes?: string; position?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
