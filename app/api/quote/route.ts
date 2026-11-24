import { NextResponse } from "next/server";
import { fieldErrors, formToObject, quoteSchema } from "@/lib/validations/forms";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { checkSpam } from "@/lib/spam";
import { createQuoteRequest } from "@/lib/enquiries";
import { ATTACHMENT_MAX_BYTES, deleteFile, makeKey, saveFile, sniffFile } from "@/lib/storage";
import type { Attachment } from "@/lib/types";

const MAX_FILES = 3;

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`quote:${ip}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: `Too many requests from this connection. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "The form could not be read. Files may be too large — keep each under 10 MB." }, { status: 400 });
  }

  const spam = await checkSpam(fd, ip);
  if (spam) {
    if (spam === "too-fast") {
      // Could be a fast human (autofill): tell them, rather than silently dropping the request.
      return NextResponse.json({ ok: false, error: "That was quicker than we expected. Check your details and submit again." }, { status: 400 });
    }
    if (spam.startsWith("captcha")) {
      return NextResponse.json({ ok: false, error: "Complete the security check and submit again." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, reference: "received" });
  }

  const parsed = quoteSchema.safeParse(formToObject(fd, ["consent"]));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Some details need attention.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  const files = fd.getAll("files").filter((f): f is File => typeof f === "object" && "arrayBuffer" in f && f.size > 0);
  if (files.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: `Attach up to ${MAX_FILES} files.`, fields: { files: `Attach up to ${MAX_FILES} files.` } }, { status: 422 });
  }

  const saved: Attachment[] = [];
  try {
    for (const file of files) {
      if (file.size > ATTACHMENT_MAX_BYTES) {
        throw new UploadError(`${file.name} is larger than 10 MB. Compress it or send a link in the message.`);
      }
      const buf = Buffer.from(await file.arrayBuffer());
      const sniff = sniffFile(file.name, buf, "attachment");
      if (!sniff.ok) throw new UploadError(`${file.name}: ${sniff.error}`);
      const key = makeKey(file.name);
      await saveFile("attachments", key, buf, sniff.type);
      saved.push({ key, name: file.name.slice(0, 160), size: file.size, type: sniff.type });
    }
  } catch (e) {
    await Promise.all(saved.map((s) => deleteFile("attachments", s.key).catch(() => undefined)));
    if (e instanceof UploadError) {
      return NextResponse.json({ ok: false, error: e.message, fields: { files: e.message } }, { status: 422 });
    }
    console.error("[quote] upload failed", e);
    return NextResponse.json({ ok: false, error: "Your files could not be uploaded. Try again, or submit without them." }, { status: 500 });
  }

  try {
    const record = await createQuoteRequest(parsed.data, saved, {
      ip,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? undefined,
      source: "/request-a-quote",
    });
    return NextResponse.json({ ok: true, reference: record.reference });
  } catch (e) {
    console.error("[quote] save failed", e);
    return NextResponse.json({ ok: false, error: "Your request could not be saved. Try again in a moment." }, { status: 500 });
  }
}

class UploadError extends Error {}
