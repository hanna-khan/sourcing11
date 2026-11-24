import "server-only";

export const HONEYPOT_FIELD = "website";
export const STARTED_FIELD = "startedAt";
const MIN_FILL_MS = 2500;

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

/**
 * Layered spam checks:
 *  1. hidden honeypot field must be empty
 *  2. the form must have been open for a human-plausible time
 *  3. Cloudflare Turnstile token, when configured
 * Returns a reason string when the submission should be rejected.
 */
export async function checkSpam(fd: FormData, ip: string): Promise<string | null> {
  if (String(fd.get(HONEYPOT_FIELD) ?? "").trim() !== "") return "honeypot";
  const started = Number(fd.get(STARTED_FIELD));
  if (!started || Date.now() - started < MIN_FILL_MS) return "too-fast";
  if (isTurnstileConfigured()) {
    const token = String(fd.get("cf-turnstile-response") ?? "");
    if (!token) return "captcha-missing";
    try {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(8000),
      });
      const json = (await res.json()) as { success: boolean };
      if (!json.success) return "captcha-failed";
    } catch {
      return "captcha-unreachable";
    }
  }
  return null;
}
