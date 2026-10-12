"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const lenisRef = useRef<Lenis | null>(null);
  const history = useRef({ popped: false, first: true });

  // Smooth scroll (desktop pointers only; touch keeps native scrolling).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -90 } });
    lenisRef.current = lenis;
    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // A page opened by clicking a link must start at the top. Next only keeps or resets the scroll
  // position by a heuristic, and Lenis keeps its own scroll target, so product pages could open
  // half-way down. Back/forward (popstate) and #hash links are left alone.
  useEffect(() => {
    const onPop = () => {
      history.current.popped = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const h = history.current;
    if (h.first) {
      h.first = false;
      return;
    }
    if (h.popped) {
      h.popped = false;
      return;
    }
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

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
