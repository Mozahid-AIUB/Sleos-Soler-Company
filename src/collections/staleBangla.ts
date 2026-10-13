import type { CollectionAfterChangeHook, Field, GlobalAfterChangeHook, PayloadRequest } from "payload";

/*
 * The admin is edited in English only. When an English text changes, the old
 * Bangla translation of that one field would now say something else, so it is
 * removed: the Bangla page then shows the new English text (localization
 * fallback) instead of outdated Bangla. Fields that did not change keep their
 * Bangla.
 */

type Loose = Record<string, unknown>;
const SKIP = "skipStaleBangla";

const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const rowsOf = (v: unknown): Loose[] => (Array.isArray(v) ? v.filter(isObj) : []);

/**
 * The Bangla update for one level of fields: changed localized fields become
 * null. Arrays and groups are sent whole (with their row ids and current
 * Bangla values) because a partial array would drop rows.
 */
function patchFor(fields: Field[], before: Loose, after: Loose, bn: Loose): Loose {
  const patch: Loose = {};
  for (const f of fields) {
    if (f.type === "tabs") {
      for (const tab of f.tabs) {
        if ("name" in tab && tab.name) {
          const sub = patchFor(tab.fields, isObj(before[tab.name]) ? (before[tab.name] as Loose) : {}, isObj(after[tab.name]) ? (after[tab.name] as Loose) : {}, isObj(bn[tab.name]) ? (bn[tab.name] as Loose) : {});
          if (Object.keys(sub).length) patch[tab.name] = { ...(bn[tab.name] as Loose), ...sub };
        } else Object.assign(patch, patchFor(tab.fields, before, after, bn));
      }
      continue;
    }
    if (f.type === "row" || f.type === "collapsible") {
      Object.assign(patch, patchFor(f.fields, before, after, bn));
      continue;
    }
    if (!("name" in f) || !f.name || f.type === "ui") continue;
    const name = f.name;

    if ("localized" in f && f.localized) {
      if (!same(before[name], after[name]) && bn[name] != null) patch[name] = null;
      continue;
    }
    if (f.type === "group") {
      const sub = patchFor(f.fields, isObj(before[name]) ? (before[name] as Loose) : {}, isObj(after[name]) ? (after[name] as Loose) : {}, isObj(bn[name]) ? (bn[name] as Loose) : {});
      if (Object.keys(sub).length) patch[name] = { ...(bn[name] as Loose), ...sub };
      continue;
    }
    if (f.type === "array") {
      const old = new Map(rowsOf(before[name]).map((r) => [String(r.id), r]));
      let changed = false;
      const rows = rowsOf(bn[name]).map((bnRow) => {
        const now = rowsOf(after[name]).find((r) => String(r.id) === String(bnRow.id)) ?? {};
        const sub = patchFor(f.fields, old.get(String(bnRow.id)) ?? now, now, bnRow);
        if (Object.keys(sub).length) changed = true;
        return { ...bnRow, ...sub };
      });
      if (changed) patch[name] = rows;
    }
  }
  return patch;
}

/** English saves only (the admin), and not the clearing update itself. */
const applies = (req: PayloadRequest) => !req.context?.[SKIP] && (!req.locale || req.locale === "en");

export const clearStaleBangla: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, operation, req }) => {
  // Drafts are not on the website yet; the Bangla is cleared when the change is published.
  if (operation !== "update" || !applies(req) || doc._status === "draft") return doc;
  try {
    const bn = (await req.payload.findByID({ collection: collection.slug, id: doc.id, locale: "bn", fallbackLocale: false, depth: 0, req, overrideAccess: true })) as unknown as Loose;
    const patch = patchFor(collection.fields, previousDoc ?? {}, doc, bn);
    if (Object.keys(patch).length) {
      await req.payload.update({ collection: collection.slug, id: doc.id, locale: "bn", data: patch, depth: 0, req, overrideAccess: true, context: { [SKIP]: true } });
    }
  } catch (error) {
    req.payload.logger.warn(`[stale-bangla] ${collection.slug} ${doc.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
  return doc;
};

export const clearStaleBanglaGlobal: GlobalAfterChangeHook = async ({ global, doc, previousDoc, req }) => {
  if (!applies(req) || !previousDoc?.updatedAt) return doc;
  try {
    const bn = (await req.payload.findGlobal({ slug: global.slug, locale: "bn", fallbackLocale: false, depth: 0, req, overrideAccess: true })) as unknown as Loose;
    const patch = patchFor(global.fields, previousDoc, doc, bn);
    if (Object.keys(patch).length) {
      await req.payload.updateGlobal({ slug: global.slug, locale: "bn", data: patch, depth: 0, req, overrideAccess: true, context: { [SKIP]: true } });
    }
  } catch (error) {
    req.payload.logger.warn(`[stale-bangla] ${global.slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
  return doc;
};
