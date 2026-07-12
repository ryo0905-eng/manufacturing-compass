import { expect, test } from "playwright/test";

test.describe("主要導線", () => {
  test("トップから12問の診断を開始できる", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "製造業で積んだ経験は、半導体でどこまで通用する？" })).toBeVisible();
    await page.getByRole("link", { name: /12問の診断を始める/ }).first().click();

    await expect(page).toHaveURL(/\/career-compass$/);
    await expect(page.getByText("Q 01 / 12")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "現在の仕事で、最も近い領域は？" })).toBeVisible();
  });

  test("診断の回答後に次の質問へ進める", async ({ page }) => {
    await page.goto("/career-compass");

    await page.getByRole("button", { name: /生産技術/ }).click();

    await expect(page.getByText("Q 02 / 12")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "実際に担当している仕事は？" })).toBeVisible();
  });
});
