import { expect, test } from "playwright/test";

test("朝刊・一覧限定の分野選択・詳細記事をPC/390pxで読める", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/semiconductor-watch");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("半導体の動きを、自分の知識に。");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/semiconductor-watch");
    const brief = await page.locator("section").filter({ has: page.locator("#brief-title") }).innerText();
    await page.getByRole("button", { name: "メモリ", exact: true }).click();
    await expect(page.getByRole("button", { name: "メモリ", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("この分野の編集済みニュースはありません。", { exact: false })).toBeVisible();
    expect(await page.locator("section").filter({ has: page.locator("#brief-title") }).innerText()).toBe(brief);
    const all = page.getByRole("button", { name: "すべて", exact: true });
    await all.focus();
    await page.keyboard.press("Enter");
    await expect(all).toHaveAttribute("aria-pressed", "true");
    const first = page.locator('li[id^="signal-"]').first();
    await expect(first).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await first.locator("p").evaluate(el => getComputedStyle(el).fontSize)).toBe("16px");
    const box = await first.locator("figure").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
    await first.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/private/tmp/chip-pulse-${width}.png`, fullPage: true });
    const oldId = await first.getAttribute("id");
    await page.goto(`/semiconductor-watch#${oldId}`);
    await expect(page.locator(":target")).toHaveAttribute("id", oldId!);
    const link = page.locator('li[id^="signal-"] h3 a').first();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "何が発表されたか", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "出典と確認方法", exact: true })).toBeVisible();
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent || "{}")));
    expect(schemas.filter(schema => schema["@type"] === "NewsArticle")).toHaveLength(1);
    await expect(page.locator('article a[href^="https://www.sec.gov/"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `/private/tmp/chip-pulse-detail-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("JavaScriptなしでもニュースと出典への導線を読める", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/semiconductor-watch`);
    await expect(page.getByRole("heading", { name: "最新ニュース", exact: true })).toBeVisible();
    await expect(page.locator('li[id^="signal-"]').first()).toBeVisible();
    await page.locator('li[id^="signal-"] h3 a').first().click();
    await expect(page.getByRole("heading", { name: "出典と確認方法", exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});
