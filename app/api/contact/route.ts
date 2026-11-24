import { NextResponse } from "next/server";
import { contactSchema, fieldErrors, formToObject } from "@/lib/validations/forms";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { checkSpam } from "@/lib/spam";
import { createContactEnquiry } from "@/lib/enquiries";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: `Too many messages from this connection. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "The form could not be read. Refresh the page and try again." }, { status: 400 });
  }

  const spam = await checkSpam(fd, ip);
  if (spam) {
    // Bots get a generic success-shaped response; captcha failures get a real message.
    if (spam === "too-fast") {
      // Could be a fast human (autofill): tell them, rather than silently dropping the request.
      return NextResponse.json({ ok: false, error: "That was quicker than we expected. Check your details and send again." }, { status: 400 });
    }
    if (spam.startsWith("captcha")) {
      return NextResponse.json({ ok: false, error: "Complete the security check and send again." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, id: "received" });
  }

  const parsed = contactSchema.safeParse(formToObject(fd, ["consent"]));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  try {
    const record = await createContactEnquiry(parsed.data, {
      ip,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? undefined,
      source: String(fd.get("source") ?? "/contact").slice(0, 200),
    });
    return NextResponse.json({ ok: true, id: record.id });
  } catch (e) {
    console.error("[contact] save failed", e);
    return NextResponse.json({ ok: false, error: "Your message could not be saved. Try again, or email us directly." }, { status: 500 });
  }
}
