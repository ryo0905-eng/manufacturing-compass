import { expect, test } from "playwright/test";

test.describe("Chip Pulse 半導体業界ウォッチ", () => {
  test("公開プロトタイプ、canonical、初期ダッシュボードを表示する", async ({ page }) => {
    await page.goto("/semiconductor-watch");
    await expect(page.getByRole("heading", { level: 1, name: /Chip Pulse.*半導体業界の「今」を.*3分で。/ })).toBeVisible();
    await expect(page.getByText("操作体験用のデモです")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/semiconductor-watch");
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { level: 2, name: "企業の強弱と規模を一枚で見る" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "昨日から変わったこと" })).toBeVisible();
    await expect(page.getByText("MUST READ").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /重要な変化を/ })).toHaveCount(0);
  });

  test("Japan × Equipment × HBMで全体を絞り込み企業選択を解除できる", async ({ page }) => {
    await page.goto("/semiconductor-watch");
    const filters = page.getByRole("region", { name: "ダッシュボード全体の絞り込み" });
    await filters.getByRole("button", { name: "Japan", exact: true }).click();
    await filters.getByRole("button", { name: "Equipment", exact: true }).click();
    await expect(filters.locator("p").filter({ hasText: "社" })).toHaveText("4社");
    await filters.getByRole("button", { name: "HBM", exact: true }).click();
    await expect(filters.locator("p").filter({ hasText: "社" })).toHaveText("3社");

    await page.getByRole("button", { name: /TEL/ }).last().click();
    await expect(page.getByText("FOCUS", { exact: true })).toBeVisible();
    await expect(page.getByText("Tokyo Electron", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "選択を解除" }).click();
    await expect(page.getByText("FOCUS", { exact: true })).toHaveCount(0);
  });

  test("シグナル詳細をキーボードで開ける", async ({ page }) => {
    await page.goto("/semiconductor-watch");
    const summary = page.locator("details").filter({ hasText: "Micron：HBM増産計画を発表" }).first().locator("summary");
    await summary.focus();
    await summary.press("Enter");
    await expect(page.getByText("メモリ企業だけでなく、成膜・エッチング・テスト装置への波及を探索できます。", { exact: true }).first()).toBeVisible();
  });

  test("横方向にはみ出さず、モバイルでは企業一覧を操作できる", async ({ page }, testInfo) => {
    await page.goto("/semiconductor-watch");
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasHorizontalOverflow).toBe(false);
    if (testInfo.project.name === "mobile-chrome") {
      await expect(page.getByRole("button", { name: /NVIDIA/ }).last()).toBeVisible();
    }
  });

  test("JavaScriptなしでも概要と初期データを読める", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto(`${baseURL}/semiconductor-watch`);
      await expect(page.getByRole("heading", { level: 1, name: /Chip Pulse/ })).toBeVisible();
      await expect(page.getByText("操作体験用のデモです")).toBeVisible();
      await expect(page.getByRole("button", { name: /NVIDIA/ }).last()).toBeVisible();
      await page.getByText("次に起きることと背景を深掘りする").click();
      await expect(page.getByRole("link", { name: /半導体業界地図/ }).first()).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
