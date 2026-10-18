import { expect, test } from "playwright/test";

test("決算一覧・根拠・比較をPCとスマートフォンで読める", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/semiconductor-watch");
    await page.getByRole("link", { name: /決算一覧・比較へ/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("主要半導体企業の決算一覧");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/semiconductor-watch/earnings");
    await expect(page.getByRole("row", { name: /東京エレクトロン/ })).toBeVisible();
    await page.getByLabel("企業", { exact: true }).selectOption("kla");
    await expect(page.getByText("1社の決算を表示中")).toBeVisible();
    await expect(page.getByRole("row", { name: /KLA/ })).toContainText("数値確認");
    await expect(page.getByRole("row", { name: /KLA/ })).toContainText("15.2%");
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("半導体企業の業績を比べる");
    const annual = page.locator("#compare-annual");
    await expect(annual).toBeVisible();
    await expect(annual.getByRole("img")).toBeVisible();
    await annual.getByRole("button", { name: "売上高指数", exact: true }).click();
    await expect(annual.getByRole("button", { name: "売上高指数", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(annual.getByRole("table")).toHaveCount(2);
    await page.getByRole("button", { name: "最新四半期", exact: true }).click();
    const latest = page.locator("#compare-latest");
    await expect(latest).toBeVisible();
    await latest.getByLabel("KLA", { exact: true }).check();
    await expect(latest.getByLabel("東京エレクトロン", { exact: true })).toBeDisabled();
    await latest.getByRole("button", { name: "選んだ企業を比較する" }).click();
    await expect(latest.getByText("3社の最新発表を表示しています。")).toBeVisible();
    await expect(latest.locator('section[aria-label="営業利益"]')).toContainText("未取得");
    await expect(latest.locator('section[aria-label="売上高・前年同期比"] a').first()).toHaveAttribute("href", /^https:/);
    await expect(latest.getByRole("link", { name: "事業・仕事内容とキャリア準備 →" }).first()).toHaveAttribute("href", /#career-prep$/);
    await latest.getByRole("button", { name: "メモリ関連" }).click();
    await expect(latest.getByText("発表と数値の範囲").locator("..")).toContainText("キオクシア");
    await latest.getByLabel("サムスン電子", { exact: true }).check();
    await latest.getByRole("button", { name: "選んだ企業を比較する" }).click();
    await expect(latest.getByText("発表と数値の範囲").locator("..")).toContainText("DS部門");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});


test("長期期間をウォッチから企業別・比較へ引き継ぐ", async ({ page }) => {
  await page.goto('/semiconductor-watch#years=20');
  await expect(page.getByRole('button', { name: '20年', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#watch-chart a[href*="/earnings/asml?"]').click();
  await expect(page).toHaveURL(/years=20#annual-history/);
  await expect(page.getByRole('heading', { name: '年次20年の業績' })).toBeVisible();
  await expect(page.locator('#annual-history table tbody tr')).toHaveCount(20);
  await page.getByRole('link', { name: '同業他社と年次20年を比較する →' }).click();
  await expect(page.locator('#compare-annual').getByRole('button', { name: '20年', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#compare-annual').getByRole('button', { name: '5年', exact: true }).click();
  await expect(page).toHaveURL(/years=5/);
  await expect(page.locator('#compare-annual table tbody tr')).toHaveCount(10);
  await page.goBack({ waitUntil: 'commit' });
  await expect(page.locator('#compare-annual').getByRole('button', { name: '20年', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
