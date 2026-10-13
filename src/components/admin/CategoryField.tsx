"use client";

import { RelationshipField, useField } from "@payloadcms/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { RelationshipFieldClientProps } from "payload";

/**
 * The product's Category drop-down. When the form is opened from a category card
 * (…/products/create?category=3) that category is already chosen.
 */
export function CategoryField(props: RelationshipFieldClientProps) {
  const { value, setValue, formInitializing } = useField<number | string | null>({ path: props.path ?? "category" });
  const wanted = useSearchParams().get("category");
  const done = useRef(false);

  // Wait until the empty form has finished setting itself up, then choose the category once.
  useEffect(() => {
    if (done.current || formInitializing || !wanted) return;
    done.current = true;
    if (!value) setValue(/^\d+$/.test(wanted) ? Number(wanted) : wanted);
  }, [formInitializing, wanted, value, setValue]);

  return <RelationshipField {...props} />;
}
