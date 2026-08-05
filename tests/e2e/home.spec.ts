import { test, expect } from "@playwright/test";

test("landing page renders brand and core navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("FloodWatch AI", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Live Map" })).toBeVisible();
});

test("risk checker returns a risk level for a location", async ({ page }) => {
  await page.goto("/risk");
  await page.getByRole("button", { name: /assess|check/i }).click();
  await expect(page.getByText(/risk/i).first()).toBeVisible();
});
