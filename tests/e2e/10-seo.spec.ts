import { expect, test } from "@playwright/test";
import { publicRoutes } from "./routes";

test.describe("SEO and rendering", () => {
  test("every public page renders server-side with complete, unique metadata", async ({ request }) => {
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const route of publicRoutes) {
      const res = await request.get(route);
      expect(res.status(), route).toBe(200);
      const html = await res.text();
      const title = (/<title>([^<]+)<\/title>/.exec(html)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
      const desc = /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? "";
      const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
      const h1s = html.match(/<h1[\s>]/g) ?? [];

      expect(title.length, `${route} title`).toBeGreaterThan(10);
      expect(title.length, `${route} title length`).toBeLessThanOrEqual(75);
      expect(desc.length, `${route} description`).toBeGreaterThan(60);
      const canonicalPath = new URL(canonical).pathname;
      expect(canonicalPath, `${route} canonical`).toBe(route);
      expect(h1s.length, `${route} should have exactly one h1`).toBe(1);
      expect(html, `${route} og:title`).toContain('property="og:title"');
      expect(html, `${route} og:image`).toContain('property="og:image"');
      expect(html, `${route} twitter card`).toContain('name="twitter:card" content="summary_large_image"');
      expect(html, `${route} JSON-LD`).toContain('application/ld+json');
      expect(html, `${route} must not be noindex`).not.toMatch(/name="robots" content="noindex/);

      expect(titles.has(title), `duplicate title "${title}" on ${route} and ${titles.get(title)}`).toBe(false);
      expect(descriptions.has(desc), `duplicate description on ${route}`).toBe(false);
      titles.set(title, route);
      descriptions.set(desc, route);
    }
  });

  test("structured data is valid JSON and includes the right types", async ({ request }) => {
    const check = async (route: string, types: string[]) => {
      const html = await (await request.get(route)).text();
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
        const parsed = JSON.parse(m[1]);
        return Array.isArray(parsed) ? parsed : [parsed];
      });
      const found = blocks.map((b) => b["@type"]);
      for (const t of types) expect(found, `${route} should include ${t}`).toContain(t);
      expect(JSON.stringify(blocks)).not.toMatch(/aggregateRating|"review"/i);
    };
    await check("/", ["Organization", "WebSite", "WebPage"]);
    await check("/services/quality-assurance", ["Service", "BreadcrumbList", "WebPage"]);
    await check("/products/home-textiles", ["Service", "BreadcrumbList"]);
    await check("/insights/from-tech-pack-to-finished-garment", ["Article", "BreadcrumbList"]);
    await check("/our-process", ["HowTo", "FAQPage"]);
  });

  test("sitemap, robots and share images", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const r of publicRoutes) expect(sitemap, r).toContain(`${r === "/" ? "" : r}</loc>`);
    expect(sitemap).not.toContain("/admin");
    expect(sitemap).not.toContain("/thank-you");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Sitemap:");

    const og = await request.get("/opengraph-image");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
    const articleOg = await request.get("/og/insights/understanding-fabric-quality-and-inspection");
    expect(articleOg.status()).toBe(200);

    // Assets referenced by structured data and the web manifest exist
    for (const asset of ["/logo/sourcing11-logo.png", "/logo/sourcing11-logo-light.png", "/logo/sourcing11-lockup-light.png", "/logo/icon-512.png", "/icon.png", "/apple-icon.png", "/manifest.webmanifest"]) {
      expect((await request.get(asset)).status(), asset).toBe(200);
    }
  });

  test("404s, noindex pages and redirects behave correctly", async ({ request }) => {
    const missing = await request.get("/this-page-does-not-exist");
    expect(missing.status()).toBe(404);
    expect(await missing.text()).toContain("doesn&#x27;t connect");
    expect((await request.get("/services/not-a-service")).status()).toBe(404);
    expect((await request.get("/insights/not-an-article")).status()).toBe(404);

    const thanks = await (await request.get("/thank-you")).text();
    expect(thanks).toMatch(/name="robots" content="noindex/);

    const redirect = await request.get("/blog", { maxRedirects: 0 });
    expect(redirect.status()).toBe(308);
    expect(redirect.headers()["location"]).toBe("/insights");
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    expect(res.headers()["x-frame-options"]).toBe("SAMEORIGIN");
    expect(res.headers()["x-powered-by"]).toBeUndefined();
  });
});
