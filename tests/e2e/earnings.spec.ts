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
    await expect(page.locator("article").filter({ has: page.getByRole("heading", { name: "KLA", exact: true }) })).toContainText("情報確認");
    await expect(page.locator("article").filter({ has: page.getByRole("heading", { name: "KLA", exact: true }) })).toContainText("売上高・前年同期比");
    await page.getByLabel("企業", { exact: true }).selectOption("all");
    await page.getByLabel("事業領域", { exact: true }).selectOption("memory");
    await expect(page.getByText("4社の決算を表示中")).toBeVisible();
    await page.getByLabel("企業", { exact: true }).selectOption("samsung-electronics");
    await expect(page.getByText("DS部門（半導体。メモリ専業ではない）")).toBeVisible();
    await page.getByLabel("事業領域", { exact: true }).selectOption("all");
    await page.getByLabel("テーマ", { exact: true }).selectOption("HBM");
    await expect(page.getByText("3社の決算を表示中")).toBeVisible();
    await page.goto("/semiconductor-watch/earnings/tokyo-electron");
    await expect(page.getByRole("heading", { name: "主要数値" })).toBeVisible();
    await expect(page.getByText("上方修正", { exact: false })).toBeVisible();
    await expect(page.locator('a[href*="fy27q1tanshin-e.pdf#page=1"]').first()).toBeVisible();
    await expect(page.getByRole("link", { name: "この会社の事業・仕事内容とキャリア準備を見る →" })).toHaveAttribute("href", /#career-prep$/);
    await page.goto("/semiconductor-watch/earnings/compare");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("各社の最新発表を比べる");
    await page.getByLabel("KLA", { exact: true }).check();
    await expect(page.getByLabel("東京エレクトロン", { exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "選んだ企業を比較する" }).click();
    await expect(page.getByText("3社の最新発表を表示しています。")).toBeVisible();
    await expect(page.locator('section[aria-label="営業利益"]')).toContainText("未取得");
    await expect(page.locator('section[aria-label="売上高・前年同期比"] a').first()).toHaveAttribute("href", /^https:/);
    await expect(page.getByRole("link", { name: "事業・仕事内容とキャリア準備 →" }).first()).toHaveAttribute("href", /#career-prep$/);
    await page.getByRole("button", { name: "メモリ関連" }).click();
    await expect(page.getByText("発表と数値の範囲").locator("..")).toContainText("キオクシア");
    await page.getByLabel("サムスン電子", { exact: true }).check();
    await page.getByRole("button", { name: "選んだ企業を比較する" }).click();
    await expect(page.getByText("発表と数値の範囲").locator("..")).toContainText("DS部門");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
