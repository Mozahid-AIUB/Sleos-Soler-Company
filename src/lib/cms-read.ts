import "server-only";
import { cache } from "react";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import type { Localized } from "@/i18n/config";

/*
 * Shared helpers for reading Payload content on the public site (same rules as
 * src/lib/catalog.ts). Every reader keeps a static fallback so that `next build`
 * without a database, a database outage, or an empty collection never breaks the site.
 */

export type Loose = Record<string, unknown>;

const DB_TIMEOUT_MS = 20_000;
/** After a failed attempt, skip the database for this long (keeps `next build` fast when there is no DB). */
const RETRY_AFTER_MS = 30_000;

export const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
export const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** {en, bn} from a localized value (read with locale "all"); a missing side falls back to the other. */
export function loc(v: unknown): Localized {
  if (typeof v === "string") return { en: v.trim(), bn: v.trim() };
  if (isObj(v)) {
    const en = text(v.en);
    const bn = text(v.bn);
    return { en: en || bn, bn: bn || en };
  }
  return { en: "", bn: "" };
}

/** Optional Localized string: undefined when both sides are empty. */
export function optLoc(v: unknown): Localized | undefined {
  const l = loc(v);
  return l.en || l.bn ? l : undefined;
}

/** Relative URL of an uploaded file (`/api/media/file/<name>`), no cache-busting query. Needs the upload populated (depth >= 1). */
export function mediaUrl(v: unknown): string | undefined {
  if (!isObj(v)) return undefined;
  const filename = text(v.filename);
  if (filename) return `/api/media/file/${encodeURIComponent(filename)}`;
  const url = text(v.url);
  if (!url) return undefined;
  try {
    const u = new URL(url, "http://local");
    return url.startsWith("/") ? u.pathname : url;
  } catch {
    return url;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label}: database did not answer within ${ms / 1000}s`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/**
 * Builds a cached loader. `fromDatabase` returns the items read from Payload;
 * when the database is missing, down, slow or returns no items, `fallback()` is used.
 * `cache()` only de-duplicates calls inside one render; page freshness comes from
 * the collection hooks (revalidatePath) and the layout's `revalidate`.
 */
export function createLoader<T>(label: string, fromDatabase: (payload: Payload) => Promise<T[]>, fallback: () => T[]) {
  let retryAt = 0;
  let warnedNoUri = false;
  return cache(async (): Promise<T[]> => {
    if (!process.env.DATABASE_URI) {
      if (!warnedNoUri) {
        warnedNoUri = true;
        console.warn(`[${label}] DATABASE_URI is not set; using the static content`);
      }
      return fallback();
    }
    if (Date.now() < retryAt) return fallback();
    try {
      const payload = await getPayload({ config });
      const items = await withTimeout(fromDatabase(payload), DB_TIMEOUT_MS, label);
      retryAt = 0;
      if (!items.length) {
        console.warn(`[${label}] database has no published items yet; using the static content`);
        return fallback();
      }
      return items;
    } catch (error) {
      retryAt = Date.now() + RETRY_AFTER_MS;
      console.warn(`[${label}] database unavailable; using the static content:`, error instanceof Error ? error.message : error);
      return fallback();
    }
  });
}
