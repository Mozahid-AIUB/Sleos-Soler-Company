import Link from "next/link";
import { SplitText } from "@/components/motion/SplitText";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-forest-950 pt-24 text-white">
      <div className="container-x">
        <p className="eyebrow hero-in text-gold-400">404</p>
        <SplitText as="h1" text="Page not found" now delayMs={100} className="display mt-5 text-[clamp(40px,6vw,76px)]" />
        <p className="lead hero-in mt-5 max-w-xl text-white/65 [animation-delay:300ms]">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
        <div className="hero-in mt-9 [animation-delay:400ms]">
          <Link href="/en" className="btn btn-gold">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
