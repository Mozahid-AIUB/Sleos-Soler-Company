import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * Files attached to the Measurement Form (site photos, electricity bills).
 * Stored on disk under UPLOAD_DIR, one folder per file named by a random
 * 128-bit id, so a link is only known to whoever received it on WhatsApp.
 * In production UPLOAD_DIR must be a persistent volume (see docs/DEPLOY.md),
 * otherwise files disappear on the next deploy.
 */

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));

type Kind = { ext: string; type: string };

/** Type from the file's first bytes; the browser-supplied name and MIME type are not trusted. */
export function sniff(bytes: Uint8Array): Kind | null {
  const b = (i: number) => bytes[i];
  if (b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44 && b(3) === 0x46) return { ext: "pdf", type: "application/pdf" };
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { ext: "png", type: "image/png" };
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { ext: "jpg", type: "image/jpeg" };
  return null;
}

const ID = /^[a-f0-9]{32}$/;

/** A readable, filesystem- and URL-safe version of the visitor's file name. */
function safeName(name: string, ext: string) {
  const base = path
    .basename(name)
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}.${ext}`;
}

export async function saveUpload(bytes: Uint8Array, originalName: string) {
  const kind = sniff(bytes);
  if (!kind) return null;
  const id = randomBytes(16).toString("hex");
  const name = safeName(originalName, kind.ext);
  const dir = path.join(UPLOAD_DIR, id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes, { flag: "wx" });
  return { id, name };
}

export async function readUpload(id: string) {
  if (!ID.test(id)) return null;
  const dir = path.join(UPLOAD_DIR, id);
  try {
    const [name] = await readdir(dir);
    if (!name) return null;
    const bytes = await readFile(path.join(dir, name));
    const kind = sniff(bytes);
    return kind ? { name, bytes, type: kind.type } : null;
  } catch {
    return null;
  }
}
