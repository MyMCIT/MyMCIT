import { test, expect } from "@playwright/test";

test("Navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("example-test")).toHaveText(
    "This is an example project"
  );
  await page.getByRole("link", { name: "My MCIT" }).click();
  await page.getByRole("button", { name: "fetch real courses" }).click();
  await page
    .locator("nav")
    .filter({ hasText: "My MCITHome" })
    .getByRole("button")
    .click();
});

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");
//
//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();
//
//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" })
//   ).toBeVisible();
// });
