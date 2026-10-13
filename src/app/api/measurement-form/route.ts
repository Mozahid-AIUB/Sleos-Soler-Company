import { getPayload } from "payload";
import config from "@payload-config";
import sharp from "sharp";
import { allowIp, clientIp } from "../chat/rate-limit";
import { safeUpload } from "@/lib/file-safety";
import { buildMeasurementPdf, type Attachment, type SheetImage } from "@/lib/measurement-pdf";

/*
 * Receives the Measurement Form from /quote (src/components/forms/QuoteSheet.tsx)
 * and stores it for the admin as ONE PDF: the filled-in form, then the site
 * photos and the bills (src/lib/measurement-pdf.ts). The form opens WhatsApp as
 * well, so a failure here never loses the enquiry.
 */

export const runtime = "nodejs";

const MAX_FILES = 10;
/** Per file and for all files together (the form allows the same). */
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL = 25 * 1024 * 1024;
/** The picture of the filled-in form drawn by the visitor's browser. */
const MAX_SHEET_BYTES = 12 * 1024 * 1024;
const MAX_TEXT = 4000;

type Row = [string, string | null];
type Group = { title: string; rows: Row[] };

const text = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Only the shape the form sends: [{ title, rows: [[label, value]] }], trimmed and capped. */
function cleanGroups(v: unknown): Group[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 20).flatMap((g) => {
    if (!g || typeof g !== "object") return [];
    const { title, rows } = g as { title?: unknown; rows?: unknown };
    if (!Array.isArray(rows)) return [];
    const clean = rows.slice(0, 80).flatMap((r): Row[] => (Array.isArray(r) && typeof r[0] === "string" ? [[text(r[0]), r[1] === null ? null : text(r[1], MAX_TEXT)]] : []));
    return [{ title: text(title), rows: clean }];
  });
}

/** The form picture, re-encoded so only pixels are kept; null when missing or not a real image. */
async function readSheet(form: FormData): Promise<SheetImage | null> {
  const f = form.get("sheet");
  if (!(f instanceof File) || f.size === 0 || f.size > MAX_SHEET_BYTES) return null;
  try {
    const data = await sharp(Buffer.from(await f.arrayBuffer()), { limitInputPixels: 80_000_000 }).jpeg({ quality: 90 }).toBuffer();
    const breaks = JSON.parse(String(form.get("breaks") ?? "[]"));
    return {
      data,
      cssWidth: Number(form.get("sheetWidth")) || 0,
      breaks: Array.isArray(breaks) ? breaks.filter((b): b is number => typeof b === "number" && Number.isFinite(b)).slice(0, 500) : [],
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!allowIp(`measure:${clientIp(req.headers)}`)) return Response.json({ ok: false, error: "Too many forms, please try again later." }, { status: 429 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  // Bots fill every box; people never see this one.
  if (text(form.get("website"))) return Response.json({ ok: true });

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const contactPerson = text(data.contactPerson);
  const phone = text(data.phone, 60);
  if (!contactPerson || !phone) return Response.json({ ok: false, error: "Name and phone are required" }, { status: 400 });

  // Photos and bills, after the checks in src/lib/file-safety.ts. Files that are too big, over
  // the total, or fail the checks are left out (the form itself still arrives).
  let total = 0;
  let refused = 0;
  const attachments: Attachment[] = [];
  const collect = async (field: "photos" | "bills", label: string) => {
    let n = 0;
    for (const f of form.getAll(field).slice(0, MAX_FILES)) {
      if (!(f instanceof File) || f.size === 0) continue;
      if (f.size > MAX_BYTES || total + f.size > MAX_TOTAL) {
        refused++;
        continue;
      }
      total += f.size;
      const safe = await safeUpload(Buffer.from(await f.arrayBuffer()), f.name);
      if (!safe) {
        refused++;
        continue;
      }
      attachments.push({ ...safe, label: `${label} ${++n}: ${f.name}` });
    }
  };

  const payload = await getPayload({ config });
  try {
    await collect("photos", "Site photo");
    await collect("bills", "Electricity bill");
    const location = text(data.location);
    const title = [contactPerson, location].filter(Boolean).join(" · ");
    const sheet = await readSheet(form);
    const built = await buildMeasurementPdf({ title: `OSLEOS Measurement Form - ${title}`, sheet, attachments });

    const stamp = new Date().toISOString().slice(0, 10);
    const safeName = contactPerson.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "customer";
    const file = await payload.create({
      collection: "lead-files",
      data: {},
      file: { data: built.pdf, mimetype: "application/pdf", name: `measurement-form-${safeName}-${stamp}.pdf`, size: built.pdf.length },
      overrideAccess: true,
    });

    await payload.create({
      collection: "measurement-forms",
      data: {
        status: "new",
        title,
        phone,
        email: text(data.email),
        company: text(data.company),
        location,
        projectType: text(data.projectType),
        lang: text(data.lang, 10),
        answers: cleanGroups(data.groups),
        pdf: file.id,
        hasFormPage: Boolean(sheet),
        filesRefused: refused + built.skipped,
      },
      overrideAccess: true,
    });
    return Response.json({ ok: true, filesRefused: refused + built.skipped });
  } catch (error) {
    payload.logger.error(`[measurement-form] could not save: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json({ ok: false, error: "Could not save" }, { status: 500 });
  }
}
