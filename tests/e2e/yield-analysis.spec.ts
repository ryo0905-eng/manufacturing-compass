import { expect, test } from "playwright/test";

test.describe("歩留まり解析ツール", () => {
  test("装置悪化を同一製品で絞り込める", async ({ page }) => {
    await page.goto("/tools/yield-analysis");
    await expect(page.locator(".yield-app")).toHaveAttribute("data-hydrated", "true");
    await expect(page.getByText("正式なシグナル判定は保留")).toBeVisible();
    await page.getByLabel("表示する製品").selectOption("製品A");
    await page.getByLabel("表示する装置").selectOption("装置B");
    await expect(page.getByText(/統計的シグナルあり/)).toBeVisible();
    await expect(page.getByText(/装置B/).first()).toBeVisible();
  });

  test("製品構成だけで98.1%から90.9%へ変わる", async ({ page }) => {
    await page.goto("/tools/yield-analysis");
    await expect(page.locator(".yield-app")).toHaveAttribute("data-hydrated", "true");
    await page.getByRole("button", { name: "B. 製品構成が変化" }).click();
    await page.getByRole("button", { name: "構成比だけ変えた場合を確認" }).click();
    const mixResult = page.locator(".yield-mix-result");
    await expect(mixResult.getByText("98.10%", { exact: true })).toBeVisible();
    await expect(mixResult.getByText("90.90%", { exact: true })).toHaveCount(2);
  });

  test("スマホ幅でページ全体が横にはみ出さない", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools/yield-analysis");
    await expect(page.locator(".yield-app")).toHaveAttribute("data-hydrated", "true");
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
    await expect(page.getByRole("button", { name: "A. 特定装置で悪化" })).toBeVisible();
  });
});
