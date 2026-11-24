import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/about", "/services/textile-sourcing", "/products/home-textiles", "/our-process", "/insights", "/insights/from-tech-pack-to-finished-garment", "/contact", "/request-a-quote", "/capabilities", "/sustainability"];

test.describe("accessibility (WCAG 2.2 AA, axe)", () => {
  for (const path of pages) {
    test(`no serious violations on ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
});

test.describe("responsive layout", () => {
  for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/services/production-management", "/products/garments-apparel", "/request-a-quote", "/insights/the-home-textile-sourcing-process"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(1);
      }
    });
  }

  test("content is fully visible with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/motion-ok/);
    await expect(page.getByRole("heading", { name: "Explore Our Textile Categories." })).toBeVisible();
    const opacity = await page.locator("[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
    // no WebGL canvas under reduced motion
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("touch targets in the mobile menu are at least 44px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const boxes = await page.getByRole("dialog").locator("a, button").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    for (const h of boxes) expect(h).toBeGreaterThanOrEqual(44);
  });
});
