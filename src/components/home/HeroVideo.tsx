"use client";

import { useEffect, useRef } from "react";

/**
 * Loads the background video only on wider screens without Data Saver —
 * phones keep the (already optimised) poster image, so the hero stays fast.
 * The download starts once the page itself has finished loading, so the
 * multi-megabyte file never competes with the poster, fonts and scripts.
 */
export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (saveData || reduced || !window.matchMedia("(min-width: 768px)").matches) return;
    const onReady = () => video.classList.add("opacity-100");
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        video.src = src;
        video.play().catch(() => {});
        video.addEventListener("playing", onReady, { once: true });
      }, 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
      video.removeEventListener("playing", onReady);
    };
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
