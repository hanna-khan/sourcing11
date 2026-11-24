import path from "node:path";
import { expect, test } from "@playwright/test";

test.describe("enquiry workflows", () => {
  test("contact form validates, then submits and confirms", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator("#contact-error")).toContainText("Check the highlighted fields");
    await expect(page.getByLabel(/Full name/)).toBeFocused();
    await expect(page.getByText("Tick the box to confirm")).toBeVisible();
    await expect(page.getByText("Enter your message.")).toBeVisible();

    await page.getByLabel(/Full name/).fill("Priya Shah");
    await page.getByLabel("Company").fill("Shah Home Ltd");
    await page.getByLabel(/Business email/).fill("priya@shahhome.example");
    await page.getByLabel("Country").selectOption("United Kingdom");
    await page.getByLabel(/What is this about/).selectOption("New sourcing project");
    await page.getByLabel(/Message/).fill("We are planning a range of cotton waffle bath towels for spring and would like to talk.");
    await page.getByLabel(/I agree/).check();
    await page.waitForTimeout(2600); // the server rejects forms filled faster than a person could
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("heading", { name: "Message received." })).toBeVisible();
  });

  test("multi-step quote request with file upload reaches the thank-you page", async ({ page }) => {
    await page.goto("/request-a-quote?category=home-textiles");

    // Step 1 validation
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await page.getByLabel(/Full name/).fill("Tom Becker");
    await page.getByLabel(/Company name/).fill("Becker Living GmbH");
    await page.getByLabel(/Business email/).fill("tom@beckerliving.example");
    await page.getByLabel(/Country/).selectOption("Germany");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: category preselected from the URL
    await expect(page.getByRole("heading", { name: /Your product/ })).toBeFocused();
    await expect(page.getByLabel(/Product category/)).toHaveValue("home-textiles");
    await page.getByLabel(/Product description/).fill("Percale duvet covers and pillowcases, white and stone, king and double sizes.");
    await page.getByLabel(/Estimated quantity/).fill("2,000 sets per colour");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: reject a disguised file, accept a real PDF
    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, "../fixtures/fake.pdf"));
    await expect(page.getByRole("alert").filter({ hasText: "doesn't look like a real PDF" })).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, "../fixtures/techpack.pdf"));
    await expect(page.getByRole("list", { name: "Attached files" })).not.toContainText("fake.pdf");
    await expect(page.getByRole("list", { name: "Attached files" })).toContainText("techpack.pdf");
    await page.getByLabel(/Delivery requirements/).fill("Hamburg warehouse by March, FOB Karachi");
    await page.getByLabel(/Target price/).fill("14.50");
    await page.getByLabel("Currency").selectOption("EUR");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: review + consent
    await expect(page.getByText("Becker Living GmbH")).toBeVisible();
    await expect(page.getByText("14.50 EUR")).toBeVisible();
    await page.getByRole("button", { name: "Send quote request" }).click();
    await expect(page.getByText("Tick the box to confirm")).toBeVisible();
    await page.getByLabel(/I agree/).check();
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: "Send quote request" }).click();

    await expect(page).toHaveURL(/\/thank-you\?type=quote&ref=S11-/);
    await expect(page.getByText(/Your reference S11-/)).toBeVisible();
  });

  test("API rejects bots, invalid payloads and disguised uploads", async ({ request }) => {
    const base = { name: "Bot", email: "bot@example.com", subject: "General question", message: "x".repeat(40), consent: "on" };

    // Honeypot filled → generic success, nothing stored (verified in admin test by count)
    const honeypot = await request.post("/api/contact", { multipart: { ...base, website: "http://spam", startedAt: String(Date.now() - 10_000) } });
    expect((await honeypot.json()).id).toBe("received");

    // Too fast → visible, retryable error (might be a human using autofill)
    const fast = await request.post("/api/contact", { multipart: { ...base, startedAt: String(Date.now()) } });
    expect(fast.status()).toBe(400);
    expect((await fast.json()).error).toMatch(/quicker than we expected/);

    // Invalid → 422 with field errors
    const invalid = await request.post("/api/contact", { multipart: { ...base, email: "nope", startedAt: String(Date.now() - 10_000) } });
    expect(invalid.status()).toBe(422);
    expect((await invalid.json()).fields.email).toBeTruthy();

    // Disguised upload → 422
    const fake = await request.post("/api/quote", {
      multipart: {
        fullName: "Test",
        companyName: "Test Co",
        email: "t@test.example",
        country: "France",
        productCategory: "fabrics-materials",
        productDescription: "Cotton poplin 120 GSM in navy, 5,000 metres",
        quantity: "5,000 m",
        delivery: "Q2 to Lyon",
        consent: "on",
        startedAt: String(Date.now() - 10_000),
        files: { name: "evil.pdf", mimeType: "application/pdf", buffer: Buffer.from("<script>alert(1)</script>") },
      },
    });
    expect(fake.status()).toBe(422);
    expect((await fake.json()).fields.files).toMatch(/evil\.pdf/);
  });
});
