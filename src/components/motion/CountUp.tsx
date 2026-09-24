"use client";

import { useEffect, useRef } from "react";

const BN = "০১২৩৪৫৬৭৮৯";
const toAscii = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));

/**
 * Counts the first number inside `value` up from zero when it scrolls into
 * view — "1,200+", "850 MW", "৬.৪ লাখ টন" all keep their prefix/suffix and
 * digit script. Renders the final value on the server, so nothing is lost
 * without JS.
 */
export function CountUp({ value, durationMs = 1600, delayMs = 0 }: { value: string; durationMs?: number; delayMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/[\d০-৯][\d০-৯,.]*/);
    if (!match || match.index === undefined) return;
    const raw = match[0];
    const bangla = /[০-৯]/.test(raw);
    const target = parseFloat(toAscii(raw).replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const decimals = (toAscii(raw).split(".")[1] ?? "").length;
    const grouped = raw.includes(",");
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + raw.length);
    const fmt = new Intl.NumberFormat(bangla ? "bn-BD" : "en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouped,
    });
    const render = (n: number) => {
      el.textContent = before + fmt.format(n) + after;
    };

    let frame = 0;
    let timer = 0;
    const run = () => {
      timer = window.setTimeout(() => {
        render(0);
        animate();
      }, delayMs);
    };
    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - p, 4);
        render(target * eased);
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      run();
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
      };
    }
    render(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [value, durationMs, delayMs]);

  return <span ref={ref}>{value}</span>;
}
