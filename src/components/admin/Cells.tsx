"use client";

/* eslint-disable @next/next/no-img-element -- admin-only thumbnails */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DefaultCellComponentProps } from "payload";

type FileDoc = { thumbnailURL?: string | null; url?: string | null };

/** List-table photo: just the picture (Payload's default also prints the file name). */
export function ThumbCell({ cellData, link, linkURL }: DefaultCellComponentProps) {
  const initial = cellData && typeof cellData === "object" ? (cellData as FileDoc) : null;
  const [doc, setDoc] = useState<FileDoc | null>(initial);
  const id = cellData && typeof cellData !== "object" ? cellData : null;

  useEffect(() => {
    if (!id) return;
    let alive = true;
    fetch(`/api/media/${id}?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setDoc(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  const src = doc?.thumbnailURL || doc?.url;
  const pic = src ? <img src={src} alt="" className="osl-thumb" /> : <span className="osl-thumb osl-thumb--empty" />;
  return link && linkURL ? <Link href={linkURL}>{pic}</Link> : pic;
}

/** Yes/no column as a tick instead of the words true / false. */
export function CheckCell({ cellData }: DefaultCellComponentProps) {
  return cellData ? <span className="osl-check" aria-label="Yes">✓</span> : <span className="osl-check osl-check--no" aria-label="No">—</span>;
}

/** Title column that opens the item (Payload only links the first column, which is the photo). */
export function OpenCell({ cellData, collectionSlug, rowData }: DefaultCellComponentProps) {
  const text = typeof cellData === "string" && cellData.trim() ? cellData : "(no name)";
  return (
    <Link href={`/admin/collections/${collectionSlug}/${rowData.id}`} className="osl-open">
      {text}
    </Link>
  );
}

const statusLabels: Record<string, string> = { new: "New", contacted: "Contacted", done: "Done" };

/** Measurement form status as a coloured badge. */
export function StatusCell({ cellData }: DefaultCellComponentProps) {
  const v = typeof cellData === "string" ? cellData : "new";
  return <span className={`osl-status osl-status--${v}`}>{statusLabels[v] ?? v}</span>;
}

/** Plain text column that shows a dash instead of Payload's "<No …>" when empty. */
export function TextCell({ cellData }: DefaultCellComponentProps) {
  return typeof cellData === "string" && cellData.trim() ? <span>{cellData}</span> : <span className="osl-check--no">—</span>;
}
