import { expect, test, type Page } from "@playwright/test";

const EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@sourcing11.local";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "";

async function login(page: Page) {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome");
}

test.describe("admin application", () => {
  test.skip(!PASSWORD, "Set E2E_ADMIN_PASSWORD to run admin tests");

  test("protects admin routes and APIs", async ({ page, request }) => {
    expect((await request.get("/admin/quotes", { maxRedirects: 0 })).status()).toBe(307);
    expect((await request.get("/api/admin/attachments/x/y.pdf")).status()).toBe(401);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "isn't recognised" })).toBeVisible();
  });

  test("reviews the quote from the forms test, downloads its file and updates status", async ({ page }) => {
    await login(page);
    await page.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: /Quote requests/ }).click();
    await page.getByRole("link", { name: "Becker Living GmbH" }).click();
    await expect(page.getByText("Percale duvet covers")).toBeVisible();

    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: /Download/ }).click()]);
    expect(download.suggestedFilename()).toBe("techpack.pdf");

    await page.getByLabel("Status").selectOption("in_review");
    await page.getByLabel("Internal notes").fill("Shortlisting two bed linen partners.");
    await page.getByRole("button", { name: "Update enquiry" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Status and notes updated." })).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Internal notes")).toHaveValue("Shortlisting two bed linen partners.");

    // Contact enquiry from the forms test exists; bot submissions were not stored
    await page.goto("/admin/enquiries");
    await expect(page.getByRole("link", { name: "Priya Shah" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bot" })).toHaveCount(0);
  });

  test("creates, publishes, edits and deletes an article end to end", async ({ page, request }) => {
    await login(page);
    await page.goto("/admin/articles/new");
    await page.getByRole("button", { name: "Create article" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Some fields need attention" })).toBeVisible();

    await page.getByLabel(/Title \(H1\)/).fill("Testing Lab Dips Before Bulk");
    await expect(page.getByLabel(/URL slug/)).toHaveValue("testing-lab-dips-before-bulk");
    await page.getByLabel(/^Summary/).fill("Why lab dip approval protects colour consistency in bulk orders.");
    await page.getByLabel(/^Category/).fill("Quality");
    await page.getByLabel(/Article body/).fill("Lab dips are small dyed swatches.\n\n## Why they matter\n\n- Shade consistency\n- Fewer rejections");
    await page.getByLabel(/Cover image/).selectOption("labDips");
    await page.getByRole("button", { name: "Create article" }).click();
    await expect(page).toHaveURL(/\/admin\/articles\/art-[\w-]+\?saved=1/);

    const res = await request.get("/insights/testing-lab-dips-before-bulk");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("Why they matter");

    await page.getByLabel(/^Summary/).fill("Updated summary about lab dips and approvals for bulk.");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Changes saved" })).toBeVisible();

    await page.getByRole("button", { name: "Delete article" }).click();
    await page.getByRole("button", { name: "Press again to confirm" }).click();
    await expect(page).toHaveURL(/\/admin\/articles\?deleted=1/);
    expect((await request.get("/insights/testing-lab-dips-before-bulk")).status()).toBe(404);
  });

  test("edits a service and website settings, reflected publicly", async ({ page, request }) => {
    await login(page);
    await page.goto("/admin/services");
    await page.getByRole("link", { name: "Edit Merchandising" }).click();
    await page.getByLabel(/Page headline/).fill("Merchandising that keeps every order detail aligned.");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Changes saved" })).toBeVisible();
    const html = (await (await request.get("/services/merchandising")).text()).replace(/<[^>]+>/g, "");
    expect(html).toContain("keeps every order detail aligned");

    await page.goto("/admin/settings");
    await page.getByLabel("Public email").fill("hello@sourcing11.example");
    await page.getByLabel("WhatsApp number").fill("+92 300 0000000");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Settings saved" })).toBeVisible();
    const contact = await (await request.get("/contact")).text();
    expect(contact).toContain("mailto:hello@sourcing11.example");
    expect(contact).toContain("https://wa.me/923000000000");

    await page.goto("/admin/seo?path=%2Fsustainability");
    await page.getByLabel("SEO title").fill("Responsible Textile Sourcing in Pakistan");
    await page.getByRole("button", { name: "Save override" }).click();
    await expect(page.getByRole("status").filter({ hasText: "SEO for /sustainability saved" })).toBeVisible();
    expect(await (await request.get("/sustainability")).text()).toContain("<title>Responsible Textile Sourcing in Pakistan | Sourcing Eleven</title>");
  });

  test("uploads an image to the media library", async ({ page }) => {
    await login(page);
    await page.goto("/admin/media");
    // 1×1 PNG
    const png = Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cf00000301010018dd8db00000000049454e44ae426082", "hex");
    await page.getByLabel("Image file").setInputFiles({ name: "swatch.png", mimeType: "image/png", buffer: png });
    await page.getByLabel("Alt text", { exact: true }).fill("Navy cotton swatch");
    await page.getByRole("button", { name: "Upload image" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Image uploaded" })).toBeVisible();
    await expect(page.getByText("swatch.png", { exact: true })).toBeVisible();
    const src = await page.locator('input[name="alt"][value="Navy cotton swatch"]').count();
    expect(src).toBe(1);
  });
});
