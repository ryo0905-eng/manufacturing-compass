import { expect, test } from "playwright/test";

test.describe("製造ミニアプリ", () => {
  test("山積み表で作業移動、比較、異常入力、リセットができる", async ({ page }) => {
    await page.goto("/tools/line-balance");
    await expect(page.getByText("15秒", { exact: true }).first()).toBeVisible();
    await page.getByLabel("外観確認の所属工程").selectOption("s3");
    await expect(page.getByText("0秒", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/140秒 → 140秒/)).toBeVisible();
    await page.getByLabel("目標タクトタイム 秒").fill("0");
    await expect(page.getByText(/0より大きい数値/)).toBeVisible();
    await page.getByRole("button", { name: "サンプルに戻す" }).click();
    await expect(page.getByText("15秒", { exact: true }).first()).toBeVisible();
  });

  test("OEEの指定例と異常入力を表示する", async ({ page }) => {
    await page.goto("/tools/oee");
    await expect(page.getByText("69.27%", { exact: true })).toBeVisible();
    await expect(page.getByText("712.5個", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("+47.5個", { exact: true })).toBeVisible();
    await page.getByLabel("負荷時間内の停止時間 分").fill("500");
    await expect(page.getByText(/停止時間は負荷時間より短く/)).toBeVisible();
    await page.getByRole("button", { name: "サンプルに戻す" }).click();
    await page.getByLabel("改善後の性能稼働率 %").fill("101");
    await expect(page.getByText(/性能稼働率は0〜100%/)).toBeVisible();
  });

  test("スマホ幅でページ全体が横にはみ出さない", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/tools/line-balance", "/tools/oee"]) {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
    }
  });
});
