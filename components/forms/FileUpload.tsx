"use client";

import { useId, useRef, useState } from "react";
import { formatBytes } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.zip,.docx,.xlsx,.pptx";
const MAX = 10 * 1024 * 1024;
const ALLOWED = ACCEPT.split(",");

/** Checks the file's first bytes match its extension (the server re-checks). */
async function looksValid(f: File, ext: string) {
  const b = new Uint8Array(await f.slice(0, 12).arrayBuffer());
  const s = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ext === ".pdf") return s(0, 5) === "%PDF-";
  if (ext === ".png") return b[0] === 0x89 && s(1, 4) === "PNG";
  if (ext === ".jpg" || ext === ".jpeg") return b[0] === 0xff && b[1] === 0xd8;
  if (ext === ".webp") return s(0, 4) === "RIFF" && s(8, 12) === "WEBP";
  return b[0] === 0x50 && b[1] === 0x4b; // zip / docx / xlsx / pptx
}

export function FileUpload({ files, onChange, error, max = 3 }: { files: File[]; onChange: (f: File[]) => void; error?: string; max?: number }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const add = async (list: FileList | null) => {
    if (!list) return;
    setLocalError(null);
    const next = [...files];
    for (const f of Array.from(list)) {
      const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
      if (!ALLOWED.includes(ext)) {
        setLocalError(`${f.name} isn't a supported file type. Use PDF, images, ZIP, Word, Excel or PowerPoint.`);
        continue;
      }
      if (!(await looksValid(f, ext))) {
        setLocalError(`${f.name} doesn't look like a real ${ext.slice(1).toUpperCase()} file. Check the file and try again.`);
        continue;
      }
      if (f.size > MAX) {
        setLocalError(`${f.name} is ${formatBytes(f.size)}. Each file must be under 10 MB.`);
        continue;
      }
      if (next.length >= max) {
        setLocalError(`You can attach up to ${max} files.`);
        break;
      }
      if (!next.some((n) => n.name === f.name && n.size === f.size)) next.push(f);
    }
    onChange(next);
    if (input.current) input.current.value = "";
  };

  const shownError = localError || error;

  return (
    <div>
      <p id={`${id}-label`} className="mb-2 flex items-baseline justify-between text-[0.9375rem] font-semibold text-navy">
        Technical pack or reference files <span className="text-sm font-normal text-muted-strong">Optional</span>
      </p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-card border border-dashed px-6 py-10 text-center transition-colors duration-300",
          drag ? "border-gold bg-gold/5" : shownError ? "border-danger" : "border-navy/25 bg-ivory/60",
        )}
      >
        <svg viewBox="0 0 48 30" aria-hidden="true" className="h-8 w-12 text-gold-ink">
          <path d="M2 28 C 10 2, 38 2, 46 28" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M24 26V10M18 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p className="mt-4 text-[0.9375rem] text-ink">
          Drag files here, or{" "}
          <button type="button" onClick={() => input.current?.click()} className="font-semibold text-gold-ink underline underline-offset-4">
            choose files
          </button>
        </p>
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted-strong">
          Up to {max} files, 10 MB each. PDF, JPG, PNG, WebP, ZIP, DOCX, XLSX or PPTX.
        </p>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={shownError ? `${id}-error` : `${id}-hint`}
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {shownError && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-danger">
          {shownError}
        </p>
      )}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2" aria-label="Attached files">
          {files.map((f, i) => (
            <li key={f.name + f.size} className="flex items-center justify-between gap-4 rounded-field border border-line bg-white px-4 py-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium text-navy">{f.name}</span>
                <span className="text-muted-strong">{formatBytes(f.size)}</span>
              </span>
              <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))} className="flex-none rounded-pill px-3 py-1.5 font-semibold text-danger hover:bg-danger/5">
                Remove<span className="sr-only"> {f.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
