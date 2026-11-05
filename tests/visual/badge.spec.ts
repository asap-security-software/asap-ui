import { expect, test } from "@playwright/test";

/**
 * Minimal visual scaffold. Not part of CI.
 * Run with `bun run test:visual` (downloads Chromium on first run).
 * Pixel snapshots for the real components land in unit 0.2.
 */
test.describe("badge", () => {
  test("status pills render a dot", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-badge--statuses&viewMode=story");
    const dots = page.locator("[data-slot=badge-dot]");
    await expect(dots).toHaveCount(5);
    await expect(page.getByText("In progress")).toBeVisible();
    await expect(page.getByText("Done")).toBeVisible();
  });
});
