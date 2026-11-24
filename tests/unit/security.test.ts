import { beforeEach, describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/users";
import { __resetRateLimits, rateLimit } from "@/lib/rate-limit";
import { sniffFile } from "@/lib/storage";

describe("sessions", () => {
  it("round-trips a signed session", async () => {
    const token = await signSession({ email: "a@b.com", name: "A", role: "editor" });
    const s = await verifySession(token);
    expect(s?.email).toBe("a@b.com");
    expect(s?.role).toBe("editor");
  });

  it("rejects tampered and expired tokens", async () => {
    const token = await signSession({ email: "a@b.com", name: "A", role: "editor" });
    const [body, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ email: "a@b.com", name: "A", role: "admin", exp: 9999999999 })).toString("base64url");
    expect(await verifySession(`${forged}.${sig}`)).toBeNull();
    expect(await verifySession(`${body}.${sig.slice(0, -2)}xx`)).toBeNull();
    const expired = await signSession({ email: "a@b.com", name: "A", role: "admin" }, -10);
    expect(await verifySession(expired)).toBeNull();
    expect(await verifySession("garbage")).toBeNull();
  });
});

describe("passwords", () => {
  it("verifies correct passwords only", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
  });
});

describe("rate limiting", () => {
  beforeEach(() => __resetRateLimits());
  it("blocks after the limit and resets after the window", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, t).ok).toBe(true);
    const blocked = rateLimit("k", 3, 1000, t + 10);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(rateLimit("k", 3, 1000, t + 1001).ok).toBe(true);
  });
});

describe("upload sniffing", () => {
  const pdf = Buffer.from("%PDF-1.4\n...");
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
  const zip = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0, 0]);
  it("accepts real files matching their extension", () => {
    expect(sniffFile("pack.pdf", pdf, "attachment")).toEqual({ ok: true, type: "application/pdf" });
    expect(sniffFile("img.PNG", png, "image")).toEqual({ ok: true, type: "image/png" });
    const x = sniffFile("costing.xlsx", zip, "attachment");
    expect(x.ok && x.type).toContain("spreadsheetml");
  });
  it("rejects disguised or disallowed files", () => {
    expect(sniffFile("evil.pdf", Buffer.from("<script>"), "attachment").ok).toBe(false);
    expect(sniffFile("evil.exe", pdf, "attachment").ok).toBe(false);
    expect(sniffFile("doc.pdf", pdf, "image").ok).toBe(false);
  });
});
