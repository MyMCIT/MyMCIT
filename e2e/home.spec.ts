import { test, expect } from "@playwright/test";

test("Navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("example-test")).toHaveText(
    "This is an example project"
  );
  await page.getByRole("link", { name: "My MCIT" }).click();
});

// Example test to load a review on a page
test("Navigate to courses page", async ({ page }) => {
  await page.goto("/course");

  await page.waitForTimeout(3000);
  expect(await page.getByTestId("review-card-0").isVisible()).toBeTruthy();
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
