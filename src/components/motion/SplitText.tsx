import { Fragment, type CSSProperties, type ElementType } from "react";

/**
 * Masked word-by-word reveal for headings. Server-rendered: each word is a
 * span, so text stays selectable and readable without JS.
 *
 * - default: plays when scrolled into view (MotionProvider marks [data-inview])
 * - `now`: plays on page load — use for above-the-fold titles
 * - `delayMs`: extra delay for `now` titles
 * - `i`: stagger index relative to siblings (same as `--i` elsewhere)
 */
export function SplitText({
  text,
  as: Tag = "span",
  className = "",
  now = false,
  delayMs = 0,
  i = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  now?: boolean;
  delayMs?: number;
  i?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag
      className={`split ${now ? "split-now" : ""} ${className}`}
      style={{ "--i": i, "--d": `${delayMs}ms` } as CSSProperties}
      aria-label={text}
    >
      {words.map((word, w) => (
        // The space stays outside the inline-block mask so it doesn't collapse.
        <Fragment key={w}>
          <span className="sw" aria-hidden="true">
            <span style={{ "--w": w } as CSSProperties}>{word}</span>
          </span>
          {w < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
