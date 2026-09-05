import { expect, test } from "playwright/test";

test.describe("日本の半導体企業・拠点マップ", () => {
  test("全国24拠点を初期表示し、canonicalと画面幅を保つ", async ({ page }) => {
    await page.goto("/semiconductor-map");

    await expect(page.getByRole("heading", { level: 1, name: "日本の半導体企業・工場・研究拠点マップ" })).toBeVisible();
    await expect(page.locator('p[aria-live="polite"] strong')).toHaveText("24");
    await expect(page.locator("article#tsmc-jasm-kumamoto")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://mfg-compass.com/semiconductor-map",
    );
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("検索と都道府県・拠点種別・職種を組み合わせて解除できる", async ({ page }) => {
    await page.goto("/semiconductor-map");

    const count = page.locator('p[aria-live="polite"] strong');
    const keyword = page.getByRole("searchbox", { name: "企業名・拠点名・技術" });
    await keyword.fill("JASM");
    await keyword.press("Enter");
    await expect(count).toHaveText("1");
    await expect(page).not.toHaveURL(/query=/);

    await page.getByRole("button", { name: "すべて解除" }).click();
    await page.getByLabel("都道府県", { exact: true }).selectOption("43");
    await expect(page).toHaveURL(/prefecture=43/);
    await expect(count).toHaveText("2");

    await page.getByLabel("拠点種別", { exact: true }).selectOption("factory");
    await expect(page).toHaveURL(/type=factory/);
    await expect(count).toHaveText("2");

    await page.getByLabel("職種", { exact: true }).selectOption("quality-reliability");
    await expect(page).toHaveURL(/job=quality-reliability/);
    await expect(count).toHaveText("1");
    await expect(page.locator("article#tsmc-jasm-kumamoto")).toBeVisible();

    await page.getByRole("button", { name: "すべて解除" }).click();
    await expect(count).toHaveText("24");
    await expect(page).toHaveURL(/\/semiconductor-map$/);
  });

  test("0件表示から全条件を解除できる", async ({ page }) => {
    await page.goto("/semiconductor-map");

    await page.getByRole("searchbox", { name: "企業名・拠点名・技術" }).fill("該当しない検索語");
    await expect(page.getByRole("heading", { level: 3, name: "条件に一致する拠点はありません" })).toBeVisible();
    await page.getByRole("button", { name: "すべての条件を解除" }).click();
    await expect(page.locator('p[aria-live="polite"] strong')).toHaveText("24");
  });

  test("地域選択から熊本県の2拠点へ移動できる", async ({ page }, testInfo) => {
    await page.goto("/semiconductor-map");

    if (testInfo.project.name === "mobile-chrome") {
      await page.getByRole("button", { name: "地域から選ぶ" }).click();
      await expect(page).toHaveURL(/view=regions/);
    }

    await page.getByRole("button", { name: /熊本、掲載2拠点/ }).click();
    await expect(page).toHaveURL(/prefecture=43/);
    await expect(page.locator('p[aria-live="polite"] strong')).toHaveText("2");
    await expect(page.locator("article#tsmc-jasm-kumamoto")).toBeVisible();
    await expect(page.locator("article#tel-kumamoto-koshi")).toBeVisible();
  });

  test("拠点カードをキーボードで開き企業詳細へ進める", async ({ page }) => {
    await page.goto("/semiconductor-map?prefecture=43");

    const card = page.locator("article#tsmc-jasm-kumamoto");
    const details = card.getByText("情報源と確認日", { exact: true });
    await details.focus();
    await details.press("Enter");
    await expect(card.locator("details")).toHaveAttribute("open", "");

    await card.getByRole("link", { name: /企業詳細を見る/ }).click();
    await expect(page).toHaveURL(/\/companies\/tsmc$/);
    await expect(page.getByRole("heading", { level: 2, name: "国内の確認済み拠点" })).toBeVisible();
  });

  test("絞り込みURLをnoindexにして全国URLへcanonicalを統一する", async ({ page }) => {
    await page.goto("/semiconductor-map?prefecture=43&type=factory");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://mfg-compass.com/semiconductor-map",
    );
  });

  test("JavaScriptなしでも全国一覧を読める", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      await page.goto(`${baseURL}/semiconductor-map`);
      await expect(page.getByRole("heading", { level: 1, name: "日本の半導体企業・工場・研究拠点マップ" })).toBeVisible();
      await expect(page.locator("main article[id]")).toHaveCount(24);
      await expect(page.locator("article#tsmc-jasm-kumamoto")).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
