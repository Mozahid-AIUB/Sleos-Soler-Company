import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/**
 * Pages are generated ahead of time. After the client saves, publishes or deletes
 * content in the admin, drop the cached pages so the next visit shows the change.
 * Wrapped in try/catch because the same hooks also run from scripts (seed) where
 * there is no Next.js request to revalidate against.
 */
function refreshSite() {
  try {
    revalidatePath("/", "layout");
  } catch {
    /* not running inside Next.js (e.g. seed script) */
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = ({ doc }) => {
  refreshSite();
  return doc;
};

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refreshSite();
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  refreshSite();
  return doc;
};
