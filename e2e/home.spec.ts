import { test, expect } from "@playwright/test";

test("Navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("example-test")).toHaveText(
    "This is an example project"
  );
});

// Example test to load a review on a page
test("Navigate to courses page", async ({ page }) => {
  await page.goto("/course");

  await page.waitForTimeout(3000);
  expect(await page.getByTestId("review-card-0").isVisible()).toBeTruthy();
});
