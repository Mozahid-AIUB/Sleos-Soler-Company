import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-forest-950 pt-24 text-white">
      <div className="container-x">
        <p className="eyebrow text-gold-400">404</p>
        <h1 className="display mt-5 text-[clamp(40px,6vw,76px)]">Page not found</h1>
        <p className="lead mt-5 max-w-xl text-white/65">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
        <Link href="/en" className="btn btn-gold mt-9">
          Back to home
        </Link>
      </div>
    </section>
  );
}
