import "server-only";
import { inflateSync } from "node:zlib";
import sharp from "sharp";

/*
 * Checks for files that strangers upload with the Measurement Form (photos and
 * electricity bills). This is a strict filter, not a virus scanner:
 *  - the bytes must really be a JPG, PNG or PDF (the file name is not trusted);
 *  - photos are decoded and saved again as a fresh image, which drops anything
 *    hidden inside them (and their location/camera data);
 *  - PDFs that can run code or carry other files (JavaScript, launch actions,
 *    embedded files, forms that send data, Flash/XFA) are refused, as are
 *    encrypted PDFs, which cannot be inspected.
 */

export type SafeFile = { data: Buffer; mimetype: string; name: string };

const startsWith = (buf: Buffer, bytes: number[]) => bytes.every((b, i) => buf[i] === b);

/** PDF names that can run code, open other programs or hide other files. */
const RISKY_PDF = /\/(JavaScript|JS|Launch|EmbeddedFiles?|RichMedia|XFA|SubmitForm|ImportData|GoToE|Encrypt)\b/;
/** Most data a single compressed PDF stream may expand to while it is checked (stops "zip bombs"). */
const MAX_INFLATE = 20 * 1024 * 1024;

/** PDF names may be written with #xx escapes (/J#61vaScript); undo them before matching. */
const unescapeNames = (s: string) => s.replace(/#([0-9a-fA-F]{2})/g, (_, h: string) => String.fromCharCode(parseInt(h, 16)));

function pdfLooksSafe(buf: Buffer): boolean {
  if (buf.subarray(0, 1024).indexOf("%PDF-") === -1) return false;
  const raw = buf.toString("latin1");
  if (RISKY_PDF.test(unescapeNames(raw))) return false;
  // Dictionaries can also sit inside compressed object streams: open each stream and check it too.
  const streamRe = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  let inflated = 0;
  while ((m = streamRe.exec(raw))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf("endstream", start);
    if (end === -1) break;
    try {
      const out = inflateSync(buf.subarray(start, end), { maxOutputLength: MAX_INFLATE });
      inflated += out.length;
      if (RISKY_PDF.test(unescapeNames(out.toString("latin1")))) return false;
    } catch {
      /* not a Flate stream (e.g. a JPEG image inside the PDF) */
    }
    if (inflated > 5 * MAX_INFLATE) return false;
    streamRe.lastIndex = end;
  }
  return true;
}

/** The checked file ready to store, or null when it must be refused. */
export async function safeUpload(buf: Buffer, originalName: string): Promise<SafeFile | null> {
  const base =
    originalName
      .replace(/\.[^.]*$/, "")
      .replace(/[^\w\- ]+/g, "_")
      .slice(0, 80) || "file";

  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46, 0x2d]) || buf.subarray(0, 1024).indexOf("%PDF-") !== -1) {
    return pdfLooksSafe(buf) ? { data: buf, mimetype: "application/pdf", name: `${base}.pdf` } : null;
  }

  const isJpeg = startsWith(buf, [0xff, 0xd8, 0xff]);
  const isPng = startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!isJpeg && !isPng) return null;
  try {
    // Decode and save again: only the picture survives. 60 MP is plenty for a phone photo.
    const img = sharp(buf, { limitInputPixels: 60_000_000 }).rotate();
    const data = isPng ? await img.png().toBuffer() : await img.jpeg({ quality: 88 }).toBuffer();
    return { data, mimetype: isPng ? "image/png" : "image/jpeg", name: `${base}.${isPng ? "png" : "jpg"}` };
  } catch {
    return null;
  }
}
