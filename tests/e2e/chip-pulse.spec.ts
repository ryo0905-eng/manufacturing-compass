import { expect, test } from "playwright/test";

test("テーマ探索から記事・業界地図へ進み、戻ると選択が復元する", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/semiconductor-watch");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("半導体業界ウォッチ");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/semiconductor-watch");
    const focus = page.locator('section[aria-labelledby="featured-title"]');
    const focusText = await focus.innerText();
    const theme = page.getByRole("button", { name: "先端実装・後工程", exact: true });
    await theme.focus();
    await page.keyboard.press("Enter");
    await expect(theme).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/#theme=packaging$/);
    expect(await focus.innerText()).toBe(focusText);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const article = page.locator('#explore li h4 a[href="/semiconductor-watch/sec-0000950103-26-013682"]');
    await article.click();
    await expect(page.getByRole("heading", { name: "何が起きたか", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "出典と確認方法", exact: true })).toBeVisible();
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent || "{}")));
    expect(schemas.filter(schema => schema["@type"] === "NewsArticle")).toHaveLength(1);
    await expect(page.locator('article a[href^="https://www.sec.gov/"]')).toHaveCount(1);
    await page.getByText("後工程では何をする？", { exact: true }).click();
    await expect(page.getByText("加工済みのウエハから", { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "業界地図でASEの役割を見る", exact: false }).click();
    await expect(page).toHaveURL(/industry-map#company=ase$/);
    await page.goBack();
    await page.goBack();
    await expect(theme).toHaveAttribute("aria-pressed", "true");
    await page.goto("/semiconductor-watch#signal-tsmc-capital-appropriation-2026-09");
    await expect(page.locator(":target")).toHaveAttribute("id", "signal-tsmc-capital-appropriation-2026-09");
  }
  expect(errors).toEqual([]);
});

test("JavaScriptなしでも一覧・記事・原文への導線を読める", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/semiconductor-watch`);
    await expect(page.getByRole("heading", { name: "テーマから探す", exact: true })).toBeVisible();
    await page.locator('#explore li h4 a[href="/semiconductor-watch/sec-0000950103-26-013682"]').click();
    await expect(page.getByRole("heading", { name: "出典と確認方法", exact: true })).toBeVisible();
    await expect(page.locator('article a[href^="https://www.sec.gov/"]')).toHaveCount(1);
  } finally { await context.close(); }
});
