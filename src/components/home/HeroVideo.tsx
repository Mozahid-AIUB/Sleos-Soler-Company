"use client";

import { useEffect, useRef } from "react";

/**
 * Loads the background video only on wider screens without Data Saver —
 * phones keep the (already optimised) poster image, so the hero stays fast.
 */
export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (saveData || reduced || !window.matchMedia("(min-width: 768px)").matches) return;
    video.src = src;
    video.play().catch(() => {});
    const onReady = () => video.classList.add("opacity-100");
    video.addEventListener("playing", onReady, { once: true });
    return () => video.removeEventListener("playing", onReady);
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={`opacity-0 transition-opacity duration-1000 ${className ?? ""}`}
    />
  );
}
