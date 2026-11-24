import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("desktop mega menu opens, links work and Escape closes it", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open Services menu" }).click();
    const panel = page.locator("#mega-Services");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: /Quality Assurance/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();

    // Hover opens the panel; the toggle then announces it can close it.
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Products", exact: true }).hover();
    await expect(page.getByRole("button", { name: "Close Products menu" })).toHaveAttribute("aria-expanded", "true");
    await page.locator("#mega-Products").getByRole("link", { name: /Home Textiles/ }).click();
    await expect(page).toHaveURL(/\/products\/home-textiles$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Home textiles");
  });

  test("mobile menu opens as a dialog, expands groups, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Show Services links" }).click();
    await dialog.getByRole("link", { name: "Merchandising" }).click();
    await expect(page).toHaveURL(/\/services\/merchandising$/);
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });

  test("hero CTAs and service cards lead to real pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Explore Our Expertise" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await page.locator('a[href="/services/quality-assurance"]').first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Quality checked");
    await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
  });

  test("skip link and keyboard focus are visible", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard test on desktop");
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test("insights category filter and article page", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/insights");
    await page.getByRole("button", { name: "Quality", exact: true }).click();
    const list = page.locator("#all-articles li:not([hidden])");
    await expect(list).toHaveCount(1);
    await list.getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fabric Quality");
    await expect(page.getByRole("navigation", { name: "In this article" })).toBeVisible();
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com/);
  });
});
