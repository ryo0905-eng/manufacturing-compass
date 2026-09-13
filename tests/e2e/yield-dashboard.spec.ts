import { expect, test } from "playwright/test";

test.describe("歩留まり原因調査ダッシュボード", () => {
  test("ガイド付き調査を確認実験まで完了できる", async ({ page }) => {
    await page.goto("/tools/yield-dashboard");
    await expect(page.locator('[data-ready="true"]')).toBeVisible();
    await page.getByRole("button", { name: "低下期間 8/11〜8/16" }).click();
    await page.getByRole("button", { name: /膜厚外れ.*件/ }).click();
    await page.getByRole("button", { name: /AX-7.*個/ }).click();
    await page.getByRole("button", { name: /CVD-02.*個/ }).click();
    await page.getByRole("button", { name: /変更前.*正常群へ/ }).click();
    await page.getByRole("button", { name: /低下後.*異常群へ/ }).click();
    await expect(page.getByText("圧力 +45.0 Pa")).toBeVisible();
    await page.getByRole("button", { name: /2026-08-10 19:30/ }).click();
    await expect(page.getByText("原因候補", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "確認実験の結果を見る" }).click();
    await expect(page.getByText("調査完了")).toBeVisible();
    await expect(page.getByText("検証結果", { exact: true })).toBeVisible();
  });

  test("自由探索のリセットとスマートフォン表示が機能する", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools/yield-dashboard");
    await page.getByRole("button", { name: "自由探索" }).click();
    await page.getByRole("button", { name: "低下期間 8/11〜8/16" }).click();
    const filterState = page.getByRole("region", { name: "現在の絞り込み条件" });
    await expect(filterState.getByText(/24ロット \/ /)).toBeVisible();
    await page.getByRole("button", { name: "全条件をリセット" }).first().click();
    await expect(filterState.getByText(/56ロット \/ /)).toBeVisible();
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
  });
});
