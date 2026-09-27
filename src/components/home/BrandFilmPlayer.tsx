"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vertical brand film. Autoplays muted and looped while on screen (browsers
 * only allow muted autoplay), pauses off screen, and only starts downloading
 * when it gets close to the viewport. "Sound on" restarts it with audio and
 * native controls.
 */
export function BrandFilmPlayer({ src, poster, label, soundLabel }: { src: string; poster: string; label: string; soundLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          if (!reduced || !video.muted) void video.play().catch(() => {});
        } else if (video.muted) {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  const soundOn = () => {
    const video = ref.current;
    if (!video) return;
    if (!video.src) video.src = src;
    video.muted = false;
    video.loop = false;
    video.currentTime = 0;
    setWithSound(true);
    void video.play().catch(() => {});
  };

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-forest-950 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
      <video
        ref={ref}
        poster={poster}
        preload="none"
        muted
        loop
        playsInline
        controls={withSound}
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!withSound && (
        <button
          type="button"
          onClick={soundOn}
          aria-label={label}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-forest-950/70 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-forest-950/90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
          <span>{soundLabel}</span>
        </button>
      )}
    </div>
  );
}
