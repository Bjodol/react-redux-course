import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  // Expect a title "to contain" a substring.
  await expect(page.getByText("login")).toBeVisible();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("textbox", { name: "email" }).fill("bjdo@cake.no");
  await page.getByRole("textbox", { name: "password" }).fill("cake");
});
