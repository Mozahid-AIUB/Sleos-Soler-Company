import { MAX_FILE_BYTES, saveUpload } from "@/lib/uploads";
import { clientIp, createLimiter } from "@/app/api/chat/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * POST /api/upload  multipart/form-data { file }  (one file per request)
 * -> 200 { url, name }          link to include in the WhatsApp message
 * -> 400 bad_request | 413 too_large | 415 unsupported_type | 429 rate_limited
 * Only PDF, JPG and PNG are accepted, checked by content, max 10 MB.
 */

/** Per visitor: 20 files at once, then one every 30 s. */
const allowIp = createLimiter(20, 1 / 30);
/** Whole site: a disk-usage ceiling if someone floods from many IPs. */
const allowGlobal = createLimiter(200, 1 / 3, 1);

const json = (status: number, body: object) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (!allowIp(clientIp(req.headers)) || !allowGlobal("all")) return json(429, { error: "rate_limited" });

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_FILE_BYTES + 64 * 1024) return json(413, { error: "too_large" });

  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return json(400, { error: "bad_request" });
  }
  if (!(file instanceof File) || file.size === 0) return json(400, { error: "bad_request" });
  if (file.size > MAX_FILE_BYTES) return json(413, { error: "too_large" });

  const saved = await saveUpload(new Uint8Array(await file.arrayBuffer()), file.name);
  if (!saved) return json(415, { error: "unsupported_type" });

  const origin = new URL(req.url).origin;
  const host = req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const base = host ? `${proto}://${host}` : origin;
  return json(200, { url: `${base}/api/files/${saved.id}/${encodeURIComponent(saved.name)}`, name: saved.name });
}
