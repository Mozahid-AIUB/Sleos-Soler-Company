import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFPage } from "pdf-lib";
import sharp from "sharp";
import type { SafeFile } from "./file-safety";

/*
 * One PDF per Measurement Form for the admin: first the filled-in form (a
 * picture of the printable sheet the visitor's browser drew, so Bangla text
 * looks right), then each site photo and each page of each bill.
 *
 * Bill PDFs are not attached as they are: only their pages are copied into the
 * new file, so nothing else from the customer's PDF (scripts, actions, other
 * files) can come along.
 */

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 28;
const CONTENT_W = A4[0] - MARGIN * 2;
const CONTENT_H = A4[1] - MARGIN * 2;
/** A bill with hundreds of pages is not a bill; stop copying after this many in total. */
const MAX_COPIED_PAGES = 40;

export type SheetImage = { data: Buffer; cssWidth: number; breaks: number[] };
export type Attachment = SafeFile & { label: string };

/** Standard PDF fonts only know Latin letters: keep captions to plain ASCII. */
const ascii = (s: string) => s.replace(/\s*·\s*/g, " - ").replace(/[^\x20-\x7e]/g, "_");

/** Cut the tall sheet picture into A4 pages, preferring to cut at a section or row edge. */
async function addSheet(pdf: PDFDocument, sheet: SheetImage) {
  const meta = await sharp(sheet.data, { limitInputPixels: 80_000_000 }).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) return;
  const ptPerPx = CONTENT_W / W;
  const pageH = Math.floor(CONTENT_H / ptPerPx);
  const pxPerCss = W / (sheet.cssWidth || W);
  const cuts = [...new Set(sheet.breaks.map((b) => Math.round(b * pxPerCss)).filter((b) => b > 0 && b < H))].sort((a, b) => a - b);

  let top = 0;
  while (top < H - 4) {
    let end = Math.min(top + pageH, H);
    if (end < H) {
      // Last row/section edge that still fits; if none is far enough down, cut at the page height.
      const edge = cuts.filter((c) => c > top + pageH * 0.5 && c <= top + pageH).pop();
      if (edge) end = edge;
    }
    const slice = await sharp(sheet.data, { limitInputPixels: 80_000_000 })
      .extract({ left: 0, top, width: W, height: end - top })
      .jpeg({ quality: 86 })
      .toBuffer();
    const img = await pdf.embedJpg(slice);
    const h = (end - top) * ptPerPx;
    pdf.addPage(A4).drawImage(img, { x: MARGIN, y: A4[1] - MARGIN - h, width: CONTENT_W, height: h });
    top = end;
  }
}

function caption(page: PDFPage, text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>) {
  page.drawText(ascii(text).slice(0, 110), { x: MARGIN, y: A4[1] - MARGIN + 6, size: 9, font, color: rgb(0.29, 0.32, 0.3) });
}

/** A photo (already re-encoded by file-safety) on its own page, as large as fits. */
async function addPhoto(pdf: PDFDocument, file: Attachment, font: Awaited<ReturnType<PDFDocument["embedFont"]>>) {
  const img = file.mimetype === "image/png" ? await pdf.embedPng(file.data) : await pdf.embedJpg(file.data);
  const box = { w: CONTENT_W, h: CONTENT_H - 16 };
  const s = Math.min(box.w / img.width, box.h / img.height, 1.5);
  const w = img.width * s;
  const h = img.height * s;
  const page = pdf.addPage(A4);
  caption(page, file.label, font);
  page.drawImage(img, { x: MARGIN + (box.w - w) / 2, y: MARGIN + (box.h - h), width: w, height: h });
}

export async function buildMeasurementPdf({
  title,
  sheet,
  attachments,
}: {
  title: string;
  sheet: SheetImage | null;
  attachments: Attachment[];
}): Promise<{ pdf: Buffer; skipped: number }> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(ascii(title));
  pdf.setProducer("OSLEOS website");
  pdf.setCreator("OSLEOS website");
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let skipped = 0;
  let copied = 0;

  if (sheet) await addSheet(pdf, sheet);

  for (const file of attachments) {
    try {
      if (file.mimetype === "application/pdf") {
        const src = await PDFDocument.load(file.data, { updateMetadata: false });
        const indices = src.getPageIndices().slice(0, Math.max(0, MAX_COPIED_PAGES - copied));
        const pages = await pdf.copyPages(src, indices);
        pages.forEach((p, i) => {
          pdf.addPage(p);
          if (i === 0) caption(p, file.label, font);
        });
        copied += pages.length;
        if (indices.length < src.getPageCount()) skipped++;
      } else {
        await addPhoto(pdf, file, font);
      }
    } catch {
      // Damaged or encrypted file: leave it out, the rest of the form still arrives.
      skipped++;
    }
  }

  if (pdf.getPageCount() === 0) pdf.addPage(A4).drawText("Measurement Form (no pages)", { x: MARGIN, y: A4[1] - MARGIN - 12, size: 12, font });
  return { pdf: Buffer.from(await pdf.save()), skipped };
}
