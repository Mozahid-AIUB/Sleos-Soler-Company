"use client";

import { useRef, useState } from "react";

/** Vertical brand film: poster + play button; loads nothing until played. */
export function BrandFilmPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-forest-950 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={playing}
        onPause={() => ref.current?.ended && setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!playing && (
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            setPlaying(true);
            void ref.current?.play();
          }}
          className="group absolute inset-0 flex items-center justify-center bg-forest-950/25 transition-colors hover:bg-forest-950/10"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-lg transition-transform duration-500 ease-out-expo group-hover:scale-105">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
              <path d="M7 4.5v15l12-7.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
