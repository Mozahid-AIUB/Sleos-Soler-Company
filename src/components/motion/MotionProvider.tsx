"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";

const SELECTOR = ".reveal, .reveal-fade, .reveal-img, .reveal-line, .reveal-scale, .split:not(.split-now)";

/**
 * One observer for the whole site: marks reveal elements with [data-inview]
 * as they scroll in (once), plus Lenis smooth scrolling on desktop.
 * Renders nothing.
 */
export function MotionProvider() {
  const pathname = usePathname();

  // Smooth scroll (desktop pointers only; touch keeps native scrolling).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -90 } });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  // Reveal-on-scroll; re-scans after every client-side navigation.
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.inview = "";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 },
    );

    const scan = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if ("inview" in el.dataset) return;
        const r = el.getBoundingClientRect();
        // Already on screen when motion switches on: show it immediately
        // instead of hiding and re-animating (avoids a flash).
        if (!root.dataset.motion && r.top < vh && r.bottom > 0) el.dataset.inview = "";
        else io.observe(el);
      });
    };

    scan();
    root.dataset.motion = "on";

    // Late content (cart drawer, filtered product grids).
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
