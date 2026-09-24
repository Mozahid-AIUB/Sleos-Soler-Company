/** Placeholder wordmark until the client's logo file arrives. */
export function Logo({ light = true, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="logo-sun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6d489" />
            <stop offset="1" stopColor="#d18f17" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="8.5" fill="url(#logo-sun)" />
        <g stroke="url(#logo-sun)" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M20 3.5a16.5 16.5 0 0 1 16.5 16.5" />
          <path d="M20 36.5A16.5 16.5 0 0 1 3.5 20" />
        </g>
      </svg>
      <span
        className={`text-[22px] font-extrabold tracking-[0.12em] ${light ? "text-white" : "text-forest-900"}`}
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        OSLEOS
      </span>
    </span>
  );
}
