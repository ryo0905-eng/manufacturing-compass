import { expect, test } from "playwright/test";

test("watchの財務カード・指標・テーマ・履歴と旧記事を4画面幅で使える", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1280, 1024, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/semiconductor-watch");
    await expect(page.getByRole("heading", { name: "企業の業績を、ひと目で" })).toBeVisible();
    const cards = page.locator('#watch-chart a[href$="#annual-history"]');
    await expect(cards).toHaveCount(12);
    const columns = await page.locator('#watch-chart ul').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width >= 1024 ? 4 : 2);
    const profit = page.getByRole('button', { name: '営業利益', exact: true });
    await profit.focus(); await page.keyboard.press('Enter');
    await expect(profit).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/metric=operating_income/);
    await expect(page.locator('#watch-chart')).toContainText('営業利益は算出値');
    const theme = page.getByRole('button', { name: '製造装置・材料', exact: true });
    await theme.click(); await expect(cards).toHaveCount(5);
    await expect(profit).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: '営業利益率', exact: true }).click();
    await expect(page.locator('#watch-chart ul')).toHaveAttribute('aria-label', '企業別の年次営業利益率');
    await page.goBack(); await expect(profit).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const heights = await cards.evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().height));
    expect(heights.every(height => height >= 200 && height <= 220)).toBe(true);
    await cards.first().focus(); await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/earnings\/applied-materials\?years=10#annual-history/);
    await expect(page.getByRole('heading', { name: '年次10年の業績', exact: true })).toBeVisible();
    await page.goBack(); await expect(profit).toHaveAttribute('aria-pressed', 'true');
    await page.goto('/semiconductor-watch#signal-tsmc-capital-appropriation-2026-09');
    await expect(page.locator('#signal-tsmc-capital-appropriation-2026-09')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("JavaScriptなしでも12社の年次グラフ・数値表と最新四半期の原資料へ進める", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/semiconductor-watch`);
    await expect(page.locator('#watch-chart a[href$="#annual-history"]')).toHaveCount(12);
    await expect(page.locator('#watch-chart table')).toHaveCount(12);
    await page.getByText('最新四半期の決算一覧', { exact: true }).click();
    await expect(page.locator('a[href="/semiconductor-watch/earnings/asml"]').first()).toBeVisible();
    await page.getByText('過去の掲載・工場の状況', { exact: false }).click();
    await expect(page.locator('#signal-sec-0000950103-26-013682 a')).toBeVisible();
  } finally { await context.close(); }
});
