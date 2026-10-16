import { expect, test } from "playwright/test";

test("watchの図・企業選択・テーマ・履歴と旧記事をPCとスマホで使える", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/semiconductor-watch");
    await expect(page.getByRole("heading", { name: "企業の売上前年比", exact: true })).toBeVisible();
    const chart = page.locator("#watch-chart");
    const companies = chart.getByRole("button");
    await expect(companies).toHaveCount(12);
    await companies.nth(1).click();
    await expect(companies.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/company=/);
    if (width <= 760) {
      await expect(page.locator("#watch-company")).toBeFocused();
      await page.getByRole("button", { name: "企業を選び直す ↑" }).click();
    }
    const theme = page.getByRole("button", { name: "製造装置・材料", exact: true });
    await theme.click();
    await expect(theme).toHaveAttribute("aria-pressed", "true");
    await expect(companies).toHaveCount(5);
    await expect(page).toHaveURL(/theme=equipment/);
    await page.getByRole("button", { name: "先端実装・後工程", exact: true }).click();
    await page.goBack();
    await expect(theme).toHaveAttribute("aria-pressed", "true");
    await expect(companies).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/semiconductor-watch#signal-tsmc-capital-appropriation-2026-09");
    const target = page.locator("#signal-tsmc-capital-appropriation-2026-09");
    await expect(target).toBeVisible();
    await target.getByRole("link").click();
    await expect(page.getByRole("heading", { name: "出典と確認方法", exact: true })).toBeVisible();
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent || "{}")));
    expect(schemas.filter(schema => schema["@type"] === "NewsArticle")).toHaveLength(1);
  }
  expect(errors).toEqual([]);
});

test("JavaScriptなしでも全社の決算・原資料と過去記事へ進める", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/semiconductor-watch`);
    await expect(page.locator("#watch-chart").getByRole("button")).toHaveCount(12);
    await page.getByText("企業別の数値・原資料", { exact: true }).click();
    await expect(page.locator('a[href="/semiconductor-watch/earnings/asml"]').first()).toBeVisible();
    await page.getByText("過去の掲載・工場の状況", { exact: false }).click();
    await page.locator('#signal-sec-0000950103-26-013682 a').click();
    await expect(page.getByRole("heading", { name: "出典と確認方法", exact: true })).toBeVisible();
  } finally { await context.close(); }
});
