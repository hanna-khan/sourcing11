import { expect, test, type Page } from "@playwright/test";

const heroPages = [
  "/",
  "/about",
  "/services",
  "/services/product-development",
  "/products",
  "/products/fabrics-materials",
  "/capabilities",
  "/our-process",
  "/sustainability",
  "/insights",
  "/contact",
];

const header = (page: Page) => page.locator("header").first();
/** The header's scroll listener is attached once it has set html[data-header]. */
const headerReady = (page: Page) => page.waitForFunction(() => document.documentElement.dataset.header === "shown");
const scrollTo = async (page: Page, y: number) => {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(120); // one animation frame + margin
};

test.describe("navbar scroll behaviour", () => {
  test("hides immediately on scroll down, reveals on scroll up, always visible at the top", async ({ page }) => {
    await page.goto("/about");
    await headerReady(page);
    await expect(header(page)).toHaveAttribute("data-state", "shown");

    await scrollTo(page, 600);
    await expect(header(page)).toHaveAttribute("data-state", "hidden", { timeout: 300 });

    // stays hidden: no automatic re-appearance after a delay
    await page.waitForTimeout(1500);
    await expect(header(page)).toHaveAttribute("data-state", "hidden");

    // tiny jitter upwards does not reveal it
    await scrollTo(page, 596);
    await expect(header(page)).toHaveAttribute("data-state", "hidden");

    // a real scroll up reveals it
    await scrollTo(page, 520);
    await expect(header(page)).toHaveAttribute("data-state", "shown", { timeout: 300 });

    // and scrolling down again hides it
    await scrollTo(page, 900);
    await expect(header(page)).toHaveAttribute("data-state", "hidden", { timeout: 300 });

    // back at the top it is always visible
    await scrollTo(page, 0);
    await expect(header(page)).toHaveAttribute("data-state", "shown");
    const box = await header(page).boundingBox();
    expect(box?.y ?? -1).toBeGreaterThanOrEqual(-1);
  });

  test("keyboard focus inside the header keeps it visible", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop keyboard test");
    await page.goto("/about");
    await headerReady(page);
    await scrollTo(page, 700);
    await expect(header(page)).toHaveAttribute("data-state", "hidden", { timeout: 300 });
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // logo link (inside header)
    await expect(header(page)).toHaveAttribute("data-state", "shown", { timeout: 300 });
  });
});

test.describe("brand and heroes", () => {
  test("Scroll to explore is gone from every hero", async ({ request }) => {
    for (const p of heroPages) {
      const html = (await (await request.get(p)).text()).toLowerCase();
      expect(html, p).not.toContain("scroll to explore");
      expect(html, p).not.toContain("scroll-cue");
    }
  });

  test("the official logo is used in the header, footer and admin", async ({ page, request }) => {
    await page.goto("/contact");
    const headerSrcs = await header(page).locator("img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).currentSrc || (e as HTMLImageElement).src));
    expect(headerSrcs.some((s) => s.includes("sourcing11-logo-light.png"))).toBe(true);
    expect(headerSrcs.some((s) => s.includes("sourcing11-logo.png"))).toBe(true);
    const footerImg = page.locator("footer img").first();
    await expect(footerImg).toHaveAttribute("src", /sourcing11-lockup-light\.png/);
    // images actually decode (not broken)
    await footerImg.scrollIntoViewIfNeeded();
    await expect.poll(() => footerImg.evaluate((i) => (i as HTMLImageElement).naturalWidth), { timeout: 8000 }).toBeGreaterThan(100);

    const login = await (await request.get("/admin/login")).text();
    expect(login).toMatch(/sourcing11-(lockup|logo)/);
    // the old recreated SVG wordmark is gone
    expect(await (await request.get("/")).text()).not.toContain("letter-spacing:0.42em");
  });

  test("every main page has its own hero visual, visible without JavaScript", async ({ request }) => {
    const signatures: Record<string, RegExp> = {
      "/": /<canvas|hero-navy-silk/,
      "/about": /champagne-silk[\s\S]*warp-threads/,
      "/services": /hero-fan/,
      "/services/product-development": /Stage (<!-- -->)?03(<!-- -->)? of 06/,
      "/products": /garments-apparel[\s\S]*fabrics-materials[\s\S]*home-textiles/,
      "/products/fabrics-materials": /fabric-bolts/,
      "/capabilities": /grid grid-cols-3 gap-3/,
      "/our-process": /aria-label="Six stages: Understand, Source, Develop, Coordinate, Inspect, Deliver"/,
      "/sustainability": /undyed-cotton/,
      "/insights": /stack-card/,
      "/contact": /Sourcing base in Pakistan, connected to buyers/,
    };
    for (const [p, re] of Object.entries(signatures)) {
      const html = await (await request.get(p)).text();
      const hero = html.slice(html.indexOf("<main"), html.indexOf("</section>", html.indexOf("<main")));
      expect(hero, `${p} hero visual`).toMatch(re);
    }
  });

  for (const p of heroPages) {
    test(`hero on ${p} renders without errors and its headline is visible`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      await page.goto(p);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await page.waitForTimeout(1600); // entrance animations settle
      const opacity = await h1.evaluate((el) => Number(getComputedStyle(el.querySelector(".word-inner") ?? el).opacity));
      expect(opacity).toBeGreaterThan(0.95);
      expect(errors).toEqual([]);
    });
  }
});
