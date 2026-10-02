"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";

const SELECTOR = ".reveal, .reveal-fade, .reveal-img, .reveal-line, .reveal-scale, .split:not(.split-now)";

/**
 * One observer for the whole site: marks reveal elements with [data-inview]
 * as they scroll in (once), plus Lenis smooth scrolling on desktop.
 * Renders nothing.
 *
 * Performance notes (scrolling felt janky before):
 * - New elements are picked up by a MutationObserver, but only when element
 *   nodes are added, at most once per frame, and elements already handed to
 *   the IntersectionObserver are skipped. Text-only changes (e.g. CountUp
 *   ticking every frame) no longer trigger a full-page layout read.
 * - Lenis uses its own requestAnimationFrame loop with lerp smoothing.
 */
export function MotionProvider() {
  const pathname = usePathname();

  // Smooth scroll (desktop pointers only; touch keeps native scrolling).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -90 } });
    return () => lenis.destroy();
  }, []);

  // Reveal-on-scroll; re-scans after every client-side navigation.
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
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

    const scan = (first: boolean) => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (seen.has(el) || "inview" in el.dataset) return;
        seen.add(el);
        if (first) {
          // Already on screen when motion switches on: show it immediately
          // instead of hiding and re-animating (avoids a flash).
          const r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > 0) {
            el.dataset.inview = "";
            return;
          }
        }
        io.observe(el);
      });
    };

    scan(true);
    root.dataset.motion = "on";

    // Late content (filtered product grids, chat panel): batch to one scan per frame.
    let queued = 0;
    const mo = new MutationObserver((records) => {
      if (queued) return;
      const addedElement = records.some((r) => Array.from(r.addedNodes).some((n) => n.nodeType === 1));
      if (!addedElement) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan(false);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(queued);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
