import { test, expect } from "@playwright/test";

test.describe("Industrial Portfolio Smoke Tests", () => {
  test("1. Public homepage loads successfully with all core industrial sections", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify Title & Hero Headline
    await expect(page).toHaveTitle(/Amit Krishna|Director of Engineering/i);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Digital Twin")).toBeVisible();

    // Verify Impact Metrics section
    const impactSection = page.locator("#impact");
    await expect(impactSection).toBeVisible();

    // Verify Reference Architecture section
    const archSection = page.locator("#architecture");
    await expect(archSection).toBeVisible();
    await expect(page.locator("svg").first()).toBeVisible();

    // Verify Case Studies section
    const workSection = page.locator("#work");
    await expect(workSection).toBeVisible();

    // Verify Contact section exists
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });

  test("2. Unauthenticated access to /admin redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
  });

  test("3. Admin login successfully redirects to CMS dashboard", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await page.fill("input[name='email']", "director@industrial-twin.dev");
    await page.fill("input[name='password']", "AdminIndustrial2025!");

    await page.click("button[type='submit']");

    // After login, should redirect to /admin dashboard
    await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });
    await expect(page.locator("text=CMS Dashboard")).toBeVisible();
    await expect(page.locator("text=Completeness Score")).toBeVisible();
  });
});
