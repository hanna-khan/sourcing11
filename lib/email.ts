import "server-only";

export type EmailResult = { status: "sent" | "skipped" | "failed"; detail?: string };

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.NOTIFICATION_EMAIL);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function renderRows(title: string, rows: [string, string | undefined][], footer?: string) {
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#77818D;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;color:#202B38;white-space:pre-wrap">${esc(v!)}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px;background:#F7F5F0">
<div style="border-top:2px solid #C7A365;background:#fff;padding:32px">
<p style="margin:0 0 4px;color:#8A6A33;font-size:13px">Sourcing Eleven</p>
<h1 style="margin:0 0 24px;font-size:22px;color:#0B1F39">${esc(title)}</h1>
<table style="border-collapse:collapse;font-size:15px;line-height:1.5">${body}</table>
${footer ? `<p style="margin:24px 0 0;color:#77818D;font-size:13px">${esc(footer)}</p>` : ""}
</div></div>`;
}

/** Sends via the Resend REST API. Returns "skipped" when not configured — never pretends to have sent. */
export async function sendEmail(opts: { to?: string; subject: string; html: string; replyTo?: string }): Promise<EmailResult> {
  if (!isEmailConfigured()) return { status: "skipped", detail: "Email is not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: (opts.to || process.env.NOTIFICATION_EMAIL!).split(",").map((s) => s.trim()),
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { status: "failed", detail: `Resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { status: "sent" };
  } catch (e) {
    return { status: "failed", detail: (e as Error).message };
  }
}
