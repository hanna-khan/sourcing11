/**
 * Fixed-window in-memory rate limiter. Works per server instance; for
 * multi-instance deployments, back it with a shared store (e.g. Upstash Redis)
 * — see docs/DEPLOYMENT.md.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0, retryAfter: Math.ceil((b.reset - now) / 1000) };
  b.count++;
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

export function clientIp(headers: Headers) {
  return (headers.get("x-forwarded-for")?.split(",")[0] || headers.get("x-real-ip") || "unknown").trim();
}

export function __resetRateLimits() {
  buckets.clear();
}
