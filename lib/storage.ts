import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/database/supabase";

/**
 * Two buckets:
 *  - "attachments": private enquiry files, served only through authenticated admin routes
 *  - "media": website images uploaded in the admin, served publicly via /media/[...key]
 */
export type Bucket = "attachments" | "media";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const bucketName = (b: Bucket) =>
  b === "attachments" ? process.env.SUPABASE_ATTACHMENTS_BUCKET || "enquiry-attachments" : process.env.SUPABASE_MEDIA_BUCKET || "media";

function safeName(name: string) {
  const base = name.normalize("NFKD").replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-").slice(-80);
  return base || "file";
}

export function makeKey(originalName: string) {
  const d = new Date();
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}-${safeName(originalName)}`;
}

function localPath(bucket: Bucket, key: string) {
  const root = path.join(DATA_DIR, "uploads", bucket);
  const full = path.resolve(root, key);
  if (!full.startsWith(path.resolve(root) + path.sep)) throw new Error("Invalid storage key");
  return full;
}

export async function saveFile(bucket: Bucket, key: string, data: Buffer, contentType: string) {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdmin().storage.from(bucketName(bucket)).upload(key, data, { contentType, upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return key;
  }
  const p = localPath(bucket, key);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, data);
  await fs.writeFile(`${p}.type`, contentType);
  return key;
}

export async function readFile(bucket: Bucket, key: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdmin().storage.from(bucketName(bucket)).download(key);
    if (error || !data) return null;
    return { data: Buffer.from(await data.arrayBuffer()), contentType: data.type || "application/octet-stream" };
  }
  try {
    const p = localPath(bucket, key);
    const [data, contentType] = await Promise.all([fs.readFile(p), fs.readFile(`${p}.type`, "utf8").catch(() => "application/octet-stream")]);
    return { data, contentType };
  } catch {
    return null;
  }
}

export async function deleteFile(bucket: Bucket, key: string) {
  if (isSupabaseConfigured()) {
    await getSupabaseAdmin().storage.from(bucketName(bucket)).remove([key]);
    return;
  }
  const p = localPath(bucket, key);
  await fs.rm(p, { force: true });
  await fs.rm(`${p}.type`, { force: true });
}

/* ---------- upload validation ---------- */

export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const MEDIA_MAX_BYTES = 8 * 1024 * 1024;

const signatures: { type: string; ext: string[]; test: (b: Buffer) => boolean }[] = [
  { type: "application/pdf", ext: ["pdf"], test: (b) => b.subarray(0, 5).toString() === "%PDF-" },
  { type: "image/png", ext: ["png"], test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { type: "image/jpeg", ext: ["jpg", "jpeg"], test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/webp", ext: ["webp"], test: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
  // Office Open XML (docx/xlsx/pptx) and zip archives share the PK signature
  { type: "application/zip", ext: ["zip", "docx", "xlsx", "pptx"], test: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 },
];

const officeTypes: Record<string, string> = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
};

/** Verifies the file's real content matches an allowed type, not just its extension. */
export function sniffFile(name: string, data: Buffer, allowed: "attachment" | "image"): { ok: true; type: string } | { ok: false; error: string } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const pool = allowed === "image" ? signatures.filter((s) => s.type.startsWith("image/")) : signatures;
  const match = pool.find((s) => s.ext.includes(ext) && s.test(data));
  if (!match) {
    return {
      ok: false,
      error:
        allowed === "image"
          ? "Upload a JPG, PNG or WebP image."
          : "Upload a PDF, JPG, PNG, WebP, ZIP, Word (.docx), Excel (.xlsx) or PowerPoint (.pptx) file.",
    };
  }
  return { ok: true, type: match.type === "application/zip" ? officeTypes[ext] : match.type };
}
