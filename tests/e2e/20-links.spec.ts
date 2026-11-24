import { expect, test } from "@playwright/test";
import { publicRoutes } from "./routes";

test("no broken internal links or images across the site", async ({ request }) => {
  const seen = new Map<string, number>();
  const sources = new Map<string, string>();
  for (const route of publicRoutes) {
    const html = await (await request.get(route)).text();
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)].map((m) => m[1]);
    // Optimised images reference their source via ?url=…; check the source file itself.
    const srcs = [...html.matchAll(/url=(%2F[^&"\s]+)/g)].map((m) => decodeURIComponent(m[1]));
    for (const h of [...hrefs, ...srcs]) {
      if (h.startsWith("/_next/")) continue;
      if (!sources.has(h)) sources.set(h, route);
    }
    // placeholder or dead links must not exist
    expect(html, `${route} has an empty href`).not.toMatch(/href="(#|)"/);
    expect(html, `${route} has javascript: link`).not.toContain('href="javascript:');
  }
  for (const [url, from] of sources) {
    if (seen.has(url)) continue;
    const res = await request.get(url.replace(/&amp;/g, "&"));
    seen.set(url, res.status());
    expect(res.status(), `${url} (linked from ${from})`).toBeLessThan(400);
  }
  expect(seen.size).toBeGreaterThan(40);
});
