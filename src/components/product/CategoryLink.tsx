"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Fired when a category link is clicked; the product grid listens and switches tab. */
export const CATEGORY_EVENT = "osleos:category";

/**
 * Link to /products#<category>. Next changes the hash with history.pushState, which does NOT fire
 * `hashchange`, so when the visitor is already on the products page the grid would never switch
 * category. The click event covers that case; opening the page from elsewhere is handled by the
 * grid reading the hash on mount.
 */
export function CategoryLink({ categoryId, onClick, ...props }: ComponentProps<typeof Link> & { categoryId: string }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        onClick?.(e);
        window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: categoryId }));
      }}
    />
  );
}
