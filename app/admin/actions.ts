"use server";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authenticate } from "@/lib/auth/users";
import { requireSession } from "@/lib/auth/guard";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, getSessionSecret, signSession } from "@/lib/auth/session";
import { store } from "@/lib/database/store";
import { collections, entitySchemas, formToEntity, parsePairs, type EditableCollection } from "@/lib/admin/collections";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { deleteFile, makeKey, MEDIA_MAX_BYTES, saveFile, sniffFile } from "@/lib/storage";
import { fieldErrors } from "@/lib/validations/forms";
import type { EnquiryStatus, MediaItem, SiteSettings } from "@/lib/types";
import { defaultSettings } from "@/data/settings";

export type ActionState = { ok?: boolean; message?: string; error?: string; fields?: Record<string, string> };

const refreshSite = () => revalidatePath("/", "layout");

/* ---------------- auth ---------------- */

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const ip = clientIp(await headers());
  const limit = rateLimit(`login:${ip}`, 8, 15 * 60_000);
  if (!limit.ok) return { error: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` };
  if (!getSessionSecret()) return { error: "Admin sign-in is not configured: set SESSION_SECRET (32+ characters) on the server." };

  const email = String(fd.get("email") ?? "");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await authenticate(email, password);
  if (!user) return { error: "That email and password combination isn't recognised." };

  const token = await signSession({ email: user.email, name: user.name, role: user.role });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------------- content CRUD ---------------- */

export async function saveEntityAction(collection: EditableCollection, id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  if (!(collection in collections)) return { error: "Unknown collection." };

  const parsed = entitySchemas[collection].safeParse(formToEntity(collection, fd));
  if (!parsed.success) return { error: "Some fields need attention.", fields: fieldErrors(parsed.error) };
  const data = parsed.data as Record<string, unknown>;

  const all = (await store.list(collection)) as unknown as { id: string; slug?: string }[];
  if ("slug" in data && all.some((x) => x.slug === data.slug && x.id !== id)) {
    return { error: "Another item already uses this URL slug.", fields: { slug: "Choose a unique slug." } };
  }

  const existing = id ? all.find((x) => x.id === id) : undefined;
  if (id && !existing) return { error: "This item no longer exists." };
  const record = { ...(existing ?? {}), ...data, id: existing?.id ?? `${collection.slice(0, 3)}-${randomUUID().slice(0, 8)}`, updatedAt: new Date().toISOString() };
  await store.upsert(collection, record as never);
  refreshSite();
  if (!id) redirect(`/admin/${collection}/${record.id}?saved=1`);
  return { ok: true, message: "Changes saved and published to the website." };
}

export async function deleteEntityAction(collection: EditableCollection, id: string) {
  await requireSession();
  if (!(collection in collections)) return;
  await store.remove(collection, id);
  refreshSite();
  redirect(`/admin/${collection}?deleted=1`);
}

/* ---------------- enquiries ---------------- */

const statuses: EnquiryStatus[] = ["new", "in_review", "responded", "closed", "spam"];

export async function updateEnquiryAction(kind: "enquiries" | "quotes", id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const status = String(fd.get("status")) as EnquiryStatus;
  if (!statuses.includes(status)) return { error: "Choose a valid status." };
  const notes = String(fd.get("notes") ?? "").slice(0, 5000);
  const rec = await store.get(kind, id);
  if (!rec) return { error: "This enquiry no longer exists." };
  await store.upsert(kind, { ...rec, status, notes, updatedAt: new Date().toISOString() } as never);
  revalidatePath(`/admin/${kind}`);
  return { ok: true, message: "Status and notes updated." };
}

export async function deleteEnquiryAction(kind: "enquiries" | "quotes", id: string) {
  await requireSession("admin");
  const rec = await store.get(kind, id);
  if (rec && "attachments" in rec) await Promise.all(rec.attachments.map((a) => deleteFile("attachments", a.key).catch(() => undefined)));
  await store.remove(kind, id);
  redirect(`/admin/${kind}?deleted=1`);
}

/* ---------------- media ---------------- */

export async function uploadMediaAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const file = fd.get("file");
  const alt = String(fd.get("alt") ?? "").trim().slice(0, 200);
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload.", fields: { file: "Choose an image to upload." } };
  if (file.size > MEDIA_MAX_BYTES) return { error: "Images must be under 8 MB.", fields: { file: "Images must be under 8 MB." } };
  if (!alt) return { error: "Describe the image for screen readers and search engines.", fields: { alt: "Add alt text that describes the image." } };
  const buf = Buffer.from(await file.arrayBuffer());
  const sniff = sniffFile(file.name, buf, "image");
  if (!sniff.ok) return { error: sniff.error, fields: { file: sniff.error } };
  const key = makeKey(file.name);
  await saveFile("media", key, buf, sniff.type);
  const item: MediaItem = { id: randomUUID(), key, url: `/media/${key}`, alt, name: file.name.slice(0, 160), type: sniff.type, size: file.size, createdAt: new Date().toISOString() };
  await store.upsert("media", item);
  revalidatePath("/admin/media");
  return { ok: true, message: "Image uploaded. Copy its URL into any image field." };
}

export async function updateMediaAltAction(id: string, fd: FormData) {
  await requireSession();
  const item = await store.get("media", id);
  const alt = String(fd.get("alt") ?? "").trim().slice(0, 200);
  if (item && alt) await store.upsert("media", { ...item, alt });
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: string) {
  await requireSession();
  const item = await store.get("media", id);
  if (item) {
    await deleteFile("media", item.key).catch(() => undefined);
    await store.remove("media", id);
  }
  revalidatePath("/admin/media");
}

/* ---------------- settings & SEO ---------------- */

const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(2).max(120),
  shortIntro: z.string().trim().min(10).max(400),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]),
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40).regex(/^[+\d\s()-]*$/, "Use digits, spaces and an optional leading +."),
  address: z.string().trim().max(400),
  addressVerified: z.boolean(),
  businessHours: z.string().trim().max(160),
  linkedin: z.union([z.literal(""), z.string().url("Enter a full URL starting with https://")]),
  instagram: z.union([z.literal(""), z.string().url("Enter a full URL starting with https://")]),
  facebook: z.union([z.literal(""), z.string().url("Enter a full URL starting with https://")]),
  x: z.union([z.literal(""), z.string().url("Enter a full URL starting with https://")]),
  markets: z.array(z.string()),
  stats: z.array(z.object({ title: z.string(), body: z.string() })),
  team: z.array(z.object({ title: z.string(), body: z.string() })),
  foundingYear: z.union([z.literal(""), z.string().regex(/^\d{4}$/, "Use a four-digit year.")]),
});

export async function saveSettingsAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession("admin");
  const s = (k: string) => String(fd.get(k) ?? "");
  const parsed = settingsSchema.safeParse({
    companyName: s("companyName"),
    tagline: s("tagline"),
    shortIntro: s("shortIntro"),
    email: s("email"),
    phone: s("phone"),
    whatsapp: s("whatsapp"),
    address: s("address"),
    addressVerified: fd.get("addressVerified") === "on",
    businessHours: s("businessHours"),
    linkedin: s("linkedin"),
    instagram: s("instagram"),
    facebook: s("facebook"),
    x: s("x"),
    markets: fd.getAll("markets").map(String),
    stats: parsePairs(fd.get("stats")),
    team: parsePairs(fd.get("team")),
    foundingYear: s("foundingYear"),
  });
  if (!parsed.success) return { error: "Some settings need attention.", fields: fieldErrors(parsed.error) };
  const current = (await store.get("settings", "site")) ?? defaultSettings;
  const next: SiteSettings = { ...current, ...parsed.data, id: "site", updatedAt: new Date().toISOString() };
  await store.upsert("settings", next);
  refreshSite();
  return { ok: true, message: "Settings saved. The website now shows the updated details." };
}

export async function saveSeoAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const path = String(fd.get("path") ?? "");
  if (!path.startsWith("/") || path.startsWith("/admin")) return { error: "Choose a public page." };
  const title = String(fd.get("title") ?? "").trim().slice(0, 80);
  const description = String(fd.get("description") ?? "").trim().slice(0, 200);
  const noindex = fd.get("noindex") === "on";
  if (!title && !description && !noindex) {
    await store.remove("seo", path);
  } else {
    await store.upsert("seo", { id: path, title: title || undefined, description: description || undefined, noindex, updatedAt: new Date().toISOString() });
  }
  refreshSite();
  return { ok: true, message: `SEO for ${path} saved.` };
}
