"use client";

/* eslint-disable @next/next/no-img-element -- admin-only preview, plain <img> keeps the panel independent of next/image */
import { FieldDescription, FieldError, FieldLabel, toast, useField } from "@payloadcms/ui";
import { useEffect, useRef, useState } from "react";
import type { UploadFieldClientProps } from "payload";

type FileDoc = { id: number | string; url?: string | null; thumbnailURL?: string | null; filename?: string | null; mimeType?: string | null };

/**
 * A photo / PDF field without the media library: one button opens the device's
 * file picker, the file is uploaded straight away and shown as a preview, with
 * Change and Remove next to it. Used for every upload field in the admin.
 */
export function DeviceUpload(props: UploadFieldClientProps & { accept?: string }) {
  const { field, path: pathProp, readOnly, accept = "image/*" } = props;
  const path = pathProp ?? field.name;
  const { value, setValue, showError } = useField<number | string | FileDoc | null>({ path });
  const input = useRef<HTMLInputElement>(null);
  const [fetched, setFetched] = useState<FileDoc | null>(null);
  const [busy, setBusy] = useState(false);
  const isPdf = accept.includes("pdf");
  const id = value && typeof value === "object" ? value.id : value;
  // The stored file: as given by the form when it is already populated, otherwise loaded below.
  const doc = value && typeof value === "object" && value.url ? value : fetched && id && String(fetched.id) === String(id) ? fetched : null;

  // Load the file's preview whenever the stored id changes.
  useEffect(() => {
    if (!id || (value && typeof value === "object" && value.url)) return;
    let alive = true;
    fetch(`/api/media/${id}?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && d && setFetched(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id, value]);

  async function upload(file: File) {
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("_payload", JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") }));
      const res = await fetch("/api/media", { method: "POST", body, credentials: "include" });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.doc) throw new Error(json?.errors?.[0]?.message || `Upload failed (${res.status})`);
      setFetched(json.doc);
      setValue(json.doc.id);
      toast.success(isPdf ? "File added. Press Save / Publish to keep it." : "Photo added. Press Save / Publish to keep it.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const label = typeof field.label === "string" ? field.label : field.name;
  const preview = doc?.thumbnailURL || doc?.url;

  return (
    <div className={`field-type osl-upload${showError ? " error" : ""}`} id={`field-${path.replace(/\./g, "__")}`}>
      <FieldLabel label={label} path={path} required={field.required} />
      <FieldError path={path} showError={showError} />
      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
      {id ? (
        <div className="osl-upload__filled">
          {isPdf || !preview ? (
            <span className="osl-upload__file">{doc?.filename || "File"}</span>
          ) : (
            <img src={preview} alt="" className="osl-upload__img" />
          )}
          {!readOnly && (
            <div className="osl-upload__actions">
              <button type="button" className="osl-upload__btn" disabled={busy} onClick={() => input.current?.click()}>
                {busy ? "Uploading…" : isPdf ? "Change file" : "Change photo"}
              </button>
              <button type="button" className="osl-upload__remove" disabled={busy} onClick={() => setValue(null)}>
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="osl-upload__empty"
          disabled={readOnly || busy}
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) void upload(f);
          }}
        >
          <strong>{busy ? "Uploading…" : isPdf ? "Choose a PDF from this device" : "Choose a photo from this device"}</strong>
          <small>or drag it here</small>
        </button>
      )}
      <FieldDescription path={path} description={field.admin?.description} />
    </div>
  );
}
