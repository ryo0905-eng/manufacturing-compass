import { expect, test } from "playwright/test";

test("決算一覧・根拠・比較をPCとスマートフォンで読める", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/semiconductor-watch");
    await page.getByRole("link", { name: /決算・IR：業績/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("何が変わったか");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/semiconductor-watch/earnings");
    await expect(page.locator("article").filter({ hasText: "東京エレクトロン" }).first()).toBeVisible();
    await page.getByLabel("企業", { exact: true }).selectOption("kla");
    await expect(page.getByText("1社の決算を表示中")).toBeVisible();
    await expect(page.getByText("未取得", { exact: true }).first()).toBeVisible();
    await page.getByLabel("企業", { exact: true }).selectOption("all");
    await page.getByLabel("テーマ", { exact: true }).selectOption("HBM");
    await expect(page.getByText("1社の決算を表示中")).toBeVisible();
    await page.goto("/semiconductor-watch/earnings/tokyo-electron");
    await expect(page.getByRole("heading", { name: "主要数値" })).toBeVisible();
    await expect(page.getByText("上方修正", { exact: false })).toBeVisible();
    await expect(page.locator('a[href*="fy27q1tanshin-e.pdf#page=1"]').first()).toBeVisible();
    await page.goto("/semiconductor-watch/earnings/compare");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("各社の最新発表を比べる");
    await page.getByLabel("KLA", { exact: true }).check();
    await page.getByRole("button", { name: "選んだ企業を比較する" }).click();
    await expect(page.getByText("3社の最新発表を表示しています。")).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "KLA" })).toContainText("未取得");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
