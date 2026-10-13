/**
 * Copy the content of the LOCAL Payload (database + ./media) to a REMOTE Payload
 * over its REST API. Use it to publish the catalogue to the live site when only
 * an admin login (no database access) is available. Media files are uploaded to
 * the remote server, so they land on its own volume.
 *
 *   TARGET_URL=https://osleos.com TARGET_EMAIL=... TARGET_PASSWORD=... \
 *     npx payload run scripts/push-to-live.ts -- [--dry-run] [--only=products,team-members] [--limit=N]
 *
 * - Source: local Payload API (reads with locale "all", no fallback, depth 0).
 * - Target: REST API, one login, strictly sequential requests, retries with backoff.
 * - Safe to re-run: remote docs are matched by a natural key (slug / name.en /
 *   quote.en) and updated in place, never duplicated; media is matched by filename.
 * - Credentials come from the environment only; they are never printed or stored.
 * - --dry-run reads the source only and prints the plan (no network access at all).
 * - Order: media -> categories -> products -> team-members -> projects -> testimonials.
 *   Media is always synced first, but only the files the selected docs reference.
 * - Each doc is written twice: English (create/update), then the Bangla values of
 *   the localized fields (PATCH ?locale=bn) onto the same array rows.
 * - Source status is kept: published docs stay published, drafts stay drafts.
 */
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../src/payload.config";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const ORDER = ["media", "categories", "products", "team-members", "projects", "testimonials"] as const;
type Col = (typeof ORDER)[number];
const DOC_COLS: Col[] = ["categories", "products", "team-members", "projects", "testimonials"];

/** Natural key used to find the same doc on the remote. */
const KEY: Record<string, (d: Any) => string | undefined> = {
  categories: (d) => d.slug,
  products: (d) => d.slug,
  projects: (d) => d.slug,
  "team-members": (d) => d.name?.en,
  testimonials: (d) => d.quote?.en,
};
/** The same key read from a remote doc fetched with locale=en. */
const REMOTE_KEY: Record<string, (d: Any) => string | undefined> = {
  categories: (d) => d.slug,
  products: (d) => d.slug,
  projects: (d) => d.slug,
  "team-members": (d) => d.name,
  testimonials: (d) => d.quote,
  media: (d) => d.filename,
};

const SKIP_FIELDS = new Set(["id", "createdAt", "updatedAt", "_status"]);
const PAUSE_MS = 100;
const TIMEOUT_MS = 60_000;
const RETRIES = 3;
const MAX_CONSECUTIVE_FAILED_REQUESTS = 3;

/* ------------------------------------------------------------------ args */

const args = process.argv.slice(2).filter((a) => a.startsWith("--"));
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const DRY = flag("dry-run");
const LIMIT = opt("limit") ? Number(opt("limit")) : Infinity;
if (!(LIMIT > 0)) throw new Error("--limit must be a positive number");
const onlyArg = opt("only")
  ?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (onlyArg) {
  const bad = onlyArg.filter((c) => !(ORDER as readonly string[]).includes(c));
  if (bad.length) throw new Error(`--only: unknown collection(s): ${bad.join(", ")}. Valid: ${ORDER.join(", ")}`);
}
const selected = ORDER.filter((c) => !onlyArg || onlyArg.includes(c));
const selectedDocCols = selected.filter((c): c is Col => c !== "media");
/** Collections whose docs decide which media files are needed. */
const mediaSources: Col[] = selectedDocCols.length ? selectedDocCols : DOC_COLS;

/* ------------------------------------------------------- remote (REST) */

const TARGET_URL = (process.env.TARGET_URL || "").replace(/\/+$/, "");
const TARGET_EMAIL = process.env.TARGET_EMAIL || "";
const TARGET_PASSWORD = process.env.TARGET_PASSWORD || "";
let token = "";

/** Remove secrets from anything that could be printed. */
function redact(s: string): string {
  let out = String(s);
  for (const secret of [token, TARGET_PASSWORD]) if (secret && secret.length > 3) out = out.split(secret).join("[redacted]");
  return out;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
class FatalError extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let consecutiveFailures = 0;

function errorSummary(status: number, body: Any, text: string): string {
  const errs: Any[] | undefined = body?.errors;
  if (Array.isArray(errs) && errs.length) {
    return errs
      .map((e) => {
        const nested = Array.isArray(e?.data?.errors) ? ` [${e.data.errors.map((x: Any) => `${x.path ?? x.label ?? "?"}: ${x.message}`).join("; ")}]` : "";
        return `${e?.message ?? "error"}${nested}`;
      })
      .join(" | ")
      .slice(0, 500);
  }
  return `HTTP ${status} ${text.slice(0, 200).replace(/\s+/g, " ")}`;
}

async function login(): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${TARGET_URL}/api/users/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: TARGET_EMAIL, password: TARGET_PASSWORD }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    throw new FatalError(`Cannot reach ${TARGET_URL} to log in: ${redact((e as Error).message)}`);
  }
  if (!res.ok) throw new FatalError(`Login to ${TARGET_URL} failed (HTTP ${res.status}). Check TARGET_EMAIL / TARGET_PASSWORD.`);
  const body: Any = await res.json().catch(() => null);
  if (!body?.token) throw new FatalError("Login succeeded but the response had no token.");
  token = body.token;
}

type Body = { json?: unknown; form?: FormData };

/** One REST call: pause, timeout, retry on 429/5xx/network, one re-login on 401. */
async function api(method: string, urlPath: string, body?: Body): Promise<Any> {
  let relogged = false;
  for (let attempt = 0; ; attempt++) {
    await sleep(PAUSE_MS);
    let failure: string | null = null;
    let res: Response | undefined;
    try {
      res = await fetch(`${TARGET_URL}${urlPath}`, {
        method,
        headers: {
          ...(token ? { Authorization: `JWT ${token}` } : {}),
          ...(body?.json !== undefined ? { "content-type": "application/json" } : {}),
        },
        body: body?.form ?? (body?.json !== undefined ? JSON.stringify(body.json) : undefined),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      failure = `network error: ${redact((e as Error).name === "TimeoutError" ? "timeout" : (e as Error).message)}`;
    }
    if (res && res.status === 401 && !relogged) {
      relogged = true;
      await login();
      continue;
    }
    if (res && (res.status === 429 || res.status >= 500)) failure = `HTTP ${res.status}`;
    if (failure) {
      if (attempt < RETRIES) {
        const wait = 1000 * 2 ** attempt;
        console.log(`    ${method} ${urlPath.split("?")[0]}: ${failure}; retry ${attempt + 1}/${RETRIES} in ${wait} ms`);
        await sleep(wait);
        continue;
      }
      consecutiveFailures++;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILED_REQUESTS) {
        throw new FatalError(`Stopping: ${consecutiveFailures} requests in a row failed after ${RETRIES} retries (last: ${failure}). The server is unhealthy or unreachable; try again later. Re-running is safe.`);
      }
      throw new HttpError(res?.status ?? 0, failure);
    }
    const text = await res!.text();
    let json: Any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      /* non-JSON body */
    }
    if (!res!.ok) {
      consecutiveFailures = 0; // the server answered, this is a content problem not an outage
      throw new HttpError(res!.status, redact(errorSummary(res!.status, json, text)));
    }
    consecutiveFailures = 0;
    return json;
  }
}

/** Every doc of a remote collection (locale en, depth 0), paged. */
async function listRemote(col: string): Promise<Any[]> {
  const out: Any[] = [];
  for (let page = 1; ; page++) {
    const r = await api("GET", `/api/${col}?limit=100&page=${page}&depth=0&locale=en&sort=createdAt`);
    out.push(...(r.docs ?? []));
    if (!r.hasNextPage) break;
  }
  return out;
}

const remoteIdx = new Map<string, Map<string, Any>>();
async function remoteIndex(col: string): Promise<Map<string, Any>> {
  let idx = remoteIdx.get(col);
  if (!idx) {
    idx = new Map();
    for (const d of await listRemote(col)) {
      const k = REMOTE_KEY[col](d);
      if (k !== undefined && k !== null && !idx.has(k)) idx.set(k, d);
    }
    remoteIdx.set(col, idx);
  }
  return idx;
}

/* ------------------------------------------------- field-config walker */

const children = (f: Any): Any[] => {
  switch (f.type) {
    case "tabs":
      return f.tabs.flatMap((t: Any) => t.fields);
    case "row":
    case "collapsible":
    case "group":
    case "array":
      return f.fields;
    case "blocks":
      return f.blocks.flatMap((b: Any) => b.fields);
    default:
      return [];
  }
};
const hasLoc = (f: Any): boolean => f.type !== "ui" && (f.localized === true || children(f).some(hasLoc));

type Resolver = (relationTo: string, id: unknown) => unknown;
type Opts = { lang: "en" | "bn"; under: boolean; only: boolean; resolve: Resolver };

/**
 * Build the REST body for one language from a doc read with locale "all".
 * lang "en": every field. lang "bn" with only=true: just the localized fields
 * (containers that hold some keep their other sub-fields so validation passes).
 * `resp` is the remote doc returned by the English write; it supplies array row ids.
 */
function build(fields: Any[], src: Any, resp: Any, o: Opts): Any {
  const out: Any = {};
  for (const f of fields) {
    if (f.type === "ui") continue;
    if (f.type === "tabs") {
      for (const tab of f.tabs) {
        if (tab.name) {
          if (o.only && !tab.fields.some(hasLoc)) continue;
          const v = src?.[tab.name];
          if (v === undefined) continue;
          out[tab.name] = v === null ? null : build(tab.fields, v, resp?.[tab.name], { ...o, only: false });
        } else Object.assign(out, build(tab.fields, src, resp, o));
      }
      continue;
    }
    if (f.type === "row" || f.type === "collapsible") {
      Object.assign(out, build(f.fields, src, resp, o));
      continue;
    }
    if (!f.name || SKIP_FIELDS.has(f.name)) continue;
    if (o.only && !hasLoc(f)) continue;

    const loc = f.localized === true && !o.under;
    const raw = src?.[f.name];
    const v = loc ? raw?.[o.lang] : raw;
    const rv = resp?.[f.name];
    if (v === undefined) continue;
    if (loc && o.lang !== "en" && v === null) continue;
    const nextUnder = o.under || loc;

    switch (f.type) {
      case "group":
        out[f.name] = v === null ? null : build(f.fields, v, rv, { ...o, under: nextUnder, only: false });
        break;
      case "array":
        out[f.name] = Array.isArray(v)
          ? v.map((row: Any, i: number) => {
              const r = build(f.fields, row, rv?.[i], { ...o, under: nextUnder, only: false });
              const id = Array.isArray(rv) ? rv[i]?.id : undefined;
              return id ? { id, ...r } : r;
            })
          : v;
        break;
      case "blocks":
        throw new Error(`field "${f.name}": blocks are not supported by push-to-live`);
      case "upload":
      case "relationship": {
        const one = (x: Any): unknown => {
          if (x && typeof x === "object" && "value" in x && "relationTo" in x) {
            const m = o.resolve(x.relationTo, x.value);
            return m === undefined ? undefined : { relationTo: x.relationTo, value: m };
          }
          return o.resolve(f.relationTo, x && typeof x === "object" ? x.id : x);
        };
        if (v === null) out[f.name] = null;
        else if (Array.isArray(v)) out[f.name] = v.map(one).filter((m) => m !== undefined);
        else {
          const m = one(v);
          if (m !== undefined) out[f.name] = m;
        }
        break;
      }
      default:
        out[f.name] = v;
    }
  }
  return out;
}

/* ------------------------------------------------------------ the push */

type Stat = { created: number; updated: number; skipped: number; failed: number };
const stats: Record<string, Stat> = {};
const media = { uploaded: 0, reused: 0, failed: 0 };
const failures: string[] = [];
const fail = (msg: string) => failures.push(redact(msg));
const newStat = (c: string) => (stats[c] = { created: 0, updated: 0, skipped: 0, failed: 0 });

async function main() {
  if (!DRY) {
    const missing = ["TARGET_URL", "TARGET_EMAIL", "TARGET_PASSWORD"].filter((n) => !process.env[n]);
    if (missing.length) throw new FatalError(`Missing environment variable(s): ${missing.join(", ")}. (Or use --dry-run.)`);
    if (!/^https?:\/\//.test(TARGET_URL)) throw new FatalError("TARGET_URL must start with http:// or https://");
  }

  const payload = await getPayload({ config });
  const read = async (collection: string) =>
    (
      await payload.find({
        collection: collection as Any,
        locale: "all" as Any,
        fallbackLocale: false,
        depth: 0,
        pagination: false,
        limit: 0,
        sort: "createdAt",
        overrideAccess: true,
      })
    ).docs as Any[];
  const fieldsOf = (c: string): Any[] => (payload.collections as Any)[c].config.fields;

  console.log(`${DRY ? "DRY RUN (no network writes)" : `Target: ${TARGET_URL}`} | collections: ${selected.join(", ")}${LIMIT < Infinity ? ` | limit ${LIMIT}` : ""}`);

  // ---- read the source
  const localDocs: Record<string, Any[]> = {};
  for (const c of new Set<Col>([...mediaSources, ...selectedDocCols])) localDocs[c] = (await read(c)).slice(0, LIMIT);
  const localMedia = new Map<string | number, Any>((await read("media")).map((d) => [d.id, d]));
  const localCatSlug = new Map<string | number, string>((await read("categories")).map((d) => [d.id, d.slug]));

  // ---- which media files do the docs reference?
  const needed = new Set<string | number>();
  const recorder: Resolver = (rel, id) => {
    if (rel === "media") needed.add(id as string | number);
    return 0;
  };
  for (const c of mediaSources) for (const d of localDocs[c]) build(fieldsOf(c), d, undefined, { lang: "en", under: false, only: false, resolve: recorder });
  const mediaList = [...needed].map((id) => localMedia.get(id)).filter(Boolean).sort((a, b) => a.filename.localeCompare(b.filename));
  const mediaDir = path.resolve(process.cwd(), "media");
  const sizeOf = (f: string) => {
    try {
      return fs.statSync(path.join(mediaDir, f)).size;
    } catch {
      return -1;
    }
  };

  // ---- dry run: just describe the plan
  if (DRY) {
    console.log(`\nMedia: ${mediaList.length} file(s) referenced by ${mediaSources.join(", ")}`);
    let bytes = 0;
    let missingFiles = 0;
    for (const m of mediaList) {
      const s = sizeOf(m.filename);
      if (s < 0) missingFiles++;
      else bytes += s;
      console.log(`  ${s < 0 ? "MISSING " : "upload  "} ${m.filename}  ${s < 0 ? "" : (s / 1024).toFixed(0) + " KB"}  alt: ${m.alt?.en ? "en" : "-"}${m.alt?.bn ? "+bn" : ""}`);
    }
    console.log(`  total ${(bytes / 1048576).toFixed(1)} MB${missingFiles ? `, ${missingFiles} file(s) MISSING in ./media` : ""} (files already on the remote are reused at run time)`);
    for (const c of selectedDocCols) {
      const docs = localDocs[c];
      let bnFields = 0;
      let buildErrors = 0;
      const resolve: Resolver = (rel, id) => (rel === "media" && !localMedia.has(id as string) ? undefined : 0);
      for (const d of docs) {
        try {
          bnFields += Object.keys(build(fieldsOf(c), d, undefined, { lang: "bn", under: false, only: true, resolve })).length;
        } catch (e) {
          buildErrors++;
          console.log(`  ! ${c} ${KEY[c](d) ?? d.id}: ${(e as Error).message}`);
        }
      }
      const noKey = docs.filter((d) => !KEY[c](d)).length;
      const drafts = docs.filter((d) => d._status === "draft").length;
      console.log(`\n${c}: ${docs.length} doc(s) -> create-or-update by "${c === "team-members" ? "name.en" : c === "testimonials" ? "quote.en" : "slug"}" (English pass, then Bangla pass: ${bnFields} localized top-level field value(s))${drafts ? `, ${drafts} stay draft` : ""}${noKey ? `, ${noKey} without key (skipped)` : ""}${buildErrors ? `, ${buildErrors} build error(s)` : ""}`);
      docs.slice(0, 5).forEach((d) => console.log(`  - ${KEY[c](d) ?? "(no key)"}`));
      if (docs.length > 5) console.log(`  ... +${docs.length - 5} more`);
    }
    return;
  }

  // ---- real run
  await login();
  console.log("Logged in.");

  // media
  const mediaMap = new Map<string | number, { id: string | number; filename: string }>();
  if (mediaList.length) {
    console.log(`\n[media] ${mediaList.length} referenced file(s)`);
    const idx = await remoteIndex("media");
    let n = 0;
    for (const m of mediaList) {
      n++;
      try {
        const existing = idx.get(m.filename);
        if (existing) {
          mediaMap.set(m.id, { id: existing.id, filename: existing.filename });
          media.reused++;
          continue;
        }
        const file = path.join(mediaDir, m.filename);
        if (!fs.existsSync(file)) throw new Error("file missing in ./media");
        const form = new FormData();
        form.append("file", new Blob([fs.readFileSync(file)], { type: m.mimeType || "application/octet-stream" }), m.filename);
        form.append("_payload", JSON.stringify(m.alt?.en ? { alt: m.alt.en } : {}));
        const r = await api("POST", "/api/media?locale=en&depth=0", { form });
        const doc = r.doc;
        if (m.alt?.bn) await api("PATCH", `/api/media/${doc.id}?locale=bn&depth=0`, { json: { alt: m.alt.bn } });
        mediaMap.set(m.id, { id: doc.id, filename: doc.filename });
        idx.set(doc.filename, doc);
        media.uploaded++;
        console.log(`  [${n}/${mediaList.length}] uploaded ${doc.filename}`);
      } catch (e) {
        if (e instanceof FatalError) throw e;
        media.failed++;
        fail(`media ${m.filename}: ${(e as Error).message}`);
        console.log(`  [${n}/${mediaList.length}] FAILED ${m.filename}: ${redact((e as Error).message)}`);
      }
    }
  }

  const resolve: Resolver = (rel, id) => {
    if (rel === "media") return mediaMap.get(id as string)?.id;
    if (rel === "categories") {
      const slug = localCatSlug.get(id as string);
      const r = slug !== undefined ? remoteIdx.get("categories")?.get(slug) : undefined;
      if (!r) throw new Error(`category "${slug ?? id}" does not exist on the remote (include categories in --only)`);
      return r.id;
    }
    throw new Error(`no id mapping for relationTo "${rel}"`);
  };

  // content collections
  for (const c of selectedDocCols) {
    const st = newStat(c);
    const docs = localDocs[c];
    console.log(`\n[${c}] ${docs.length} doc(s)`);
    const idx = await remoteIndex(c);
    if (c === "products" && !remoteIdx.has("categories")) await remoteIndex("categories");
    const fields = fieldsOf(c);
    const versioned = docs.some((d) => d._status !== undefined);
    let n = 0;
    for (const d of docs) {
      n++;
      const key = KEY[c](d);
      if (!key) {
        st.skipped++;
        fail(`${c} id ${d.id}: no natural key, skipped`);
        continue;
      }
      try {
        const base = { lang: "en" as const, under: false, only: false, resolve };
        const enBody = build(fields, d, undefined, base);
        const status = versioned ? (d._status === "draft" ? "draft" : "published") : null;
        if (status) enBody._status = status;
        const q = `locale=en&depth=0${status === "draft" ? "&draft=true" : ""}`;
        const existing = idx.get(key);
        let resp: Any;
        if (existing) {
          resp = (await api("PATCH", `/api/${c}/${existing.id}?${q}`, { json: enBody })).doc;
          st.updated++;
        } else {
          resp = (await api("POST", `/api/${c}?${q}`, { json: enBody })).doc;
          idx.set(key, resp);
          st.created++;
        }
        const bnBody = build(fields, d, resp, { ...base, lang: "bn", only: true });
        if (Object.keys(bnBody).length) {
          if (status) bnBody._status = status;
          await api("PATCH", `/api/${c}/${resp.id}?${q.replace("locale=en", "locale=bn")}`, { json: bnBody });
        }
        console.log(`  [${n}/${docs.length}] ${existing ? "updated" : "created"} ${key.length > 60 ? key.slice(0, 57) + "..." : key}`);
      } catch (e) {
        if (e instanceof FatalError) throw e;
        st.failed++;
        fail(`${c} "${key}": ${(e as Error).message}`);
        console.log(`  [${n}/${docs.length}] FAILED ${key.slice(0, 60)}: ${redact((e as Error).message)}`);
      }
    }
  }
}

function summary() {
  console.log("\n==== Summary ====");
  if (!DRY) {
    console.log(`media        uploaded ${media.uploaded}, reused ${media.reused}, failed ${media.failed}`);
    for (const [c, s] of Object.entries(stats)) console.log(`${c.padEnd(12)} created ${s.created}, updated ${s.updated}, skipped ${s.skipped}, failed ${s.failed}`);
  }
  if (failures.length) {
    console.log(`\n${failures.length} problem(s):`);
    failures.slice(0, 30).forEach((f) => console.log(`  - ${f}`));
    if (failures.length > 30) console.log(`  ... +${failures.length - 30} more`);
  }
}

// Top-level await: `payload run` exits as soon as the script module has loaded.
await main()
  .then(() => {
    summary();
    process.exit(failures.length ? 1 : 0);
  })
  .catch((e) => {
    console.error(`\n${e instanceof FatalError ? "" : "Unexpected error: "}${redact(e instanceof Error ? e.message : String(e))}`);
    summary();
    process.exit(1);
  });
