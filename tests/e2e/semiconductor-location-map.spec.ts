import { expect, test, type Page } from "playwright/test";

async function openFilters(page: Page) {
  const button = page.getByRole("button", { name: /^絞り込み/ });
  if (await button.isVisible() && await button.getAttribute("aria-expanded") === "false") await button.click();
}

test.describe("日本地図で探す半導体拠点", () => {
  // Tile availability must not determine whether the directory works.
  test.beforeEach(async ({ page }) => { await page.route("https://cyberjapandata.gsi.go.jp/**", route => route.abort()); });

  test("28拠点を初期HTMLに表示し、全国URLをindex可能に保つ", async ({ page }) => {
    await page.goto("/semiconductor-map");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("日本の半導体企業・工場・研究拠点マップ");
    await expect(page.locator("article")).toHaveCount(28);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/semiconductor-map");
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  });

  test("会社・地域のORと項目間AND、検索・解除・戻る操作", async ({ page }) => {
    await page.goto("/semiconductor-map");
    await openFilters(page);
    await page.getByRole("checkbox", { name: "熊本県", exact: true }).check();
    await expect(page.locator("article")).toHaveCount(2);
    await page.getByRole("checkbox", { name: "広島県", exact: true }).check();
    await expect(page.locator("article")).toHaveCount(3);
    await page.getByRole("checkbox", { name: "工場", exact: true }).check();
    await expect(page.locator("article")).toHaveCount(3);
    await page.getByRole("searchbox", { name: "企業名・拠点名・技術" }).fill("JASM");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page).not.toHaveURL(/JASM|query=/);
    await page.getByRole("button", { name: "すべて解除", exact: true }).click();
    await expect(page.locator("article")).toHaveCount(28);
    await page.goBack();
    await expect(page.getByRole("searchbox")).toHaveValue("");
    await expect(page.locator("article")).toHaveCount(3);
    await page.reload();
    await expect(page.locator("article")).toHaveCount(3);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("新設5案件と同じ敷地の2案件を区別し、予定を読み替えない", async ({ page }) => {
    await page.goto("/semiconductor-map?mode=projects&location=tsmc-jasm-kumamoto&project=jasm-2");
    await expect(page.locator("article")).toHaveCount(5);
    const detail = page.getByRole("dialog", { name: "選択した拠点の詳細" });
    const panel = await detail.isVisible() ? detail : page.getByRole("region", { name: "選択した拠点の詳細" });
    await expect(panel.getByRole("heading", { level: 3 })).toHaveText("JASM 第2工場");
    await expect(panel).toContainText("2028年");
    await expect(panel).toContainText("量産開始予定");
    await panel.getByRole("button", { name: "詳細を閉じる ×" }).click();
    await page.locator("article#micron-hiroshima-cleanroom").getByRole("button").click();
    const micronPanel = await detail.isVisible() ? detail : page.getByRole("region", { name: "選択した拠点の詳細" });
    await expect(micronPanel).toContainText("装置搬入開始予定（量産開始日ではありません）");
  });

  test("ピンと一覧が連動し、スマホの詳細シートをEscapeで閉じる", async ({ page }, testInfo) => {
    await page.goto("/semiconductor-map");
    const pin = page.getByTitle(/Rapidus.*試作ライン稼働/);
    await expect(pin).toBeVisible();
    await pin.focus();
    await pin.press("Enter");
    await expect(page).toHaveURL(/location=rapidus-chitose-iim/);
    if (testInfo.project.name === "mobile-chrome") {
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(page).not.toHaveURL(/location=/);
    } else {
      await expect(page.getByRole("region", { name: "選択した拠点の詳細" })).toContainText("試作ライン稼働");
    }
  });

  test("表・グラフ・地図非表示でも同じ件数を維持し、横スクロールを表内に収める", async ({ page }) => {
    await page.goto("/semiconductor-map");
    await page.getByRole("button", { name: "表", exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(28);
    await page.getByRole("button", { name: /^北海道\s*1$/ }).click();
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await page.getByRole("button", { name: "地図を閉じる" }).click();
    await expect(page.getByRole("region", { name: "日本の半導体拠点地図" })).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  });

  test("0件・地図タイル失敗からも一覧を利用できる", async ({ page }) => {
    await page.goto("/semiconductor-map");
    await expect(page.getByText("背景地図の一部を取得できません。拠点一覧からも探索できます。")).toBeVisible();
    await openFilters(page);
    await page.getByRole("searchbox").fill("no-such-location");
    await expect(page.getByRole("heading", { name: "条件に一致する拠点はありません" })).toBeVisible();
    await page.getByRole("button", { name: "すべての条件を解除" }).click();
    await expect(page.locator("article")).toHaveCount(28);
  });

  test("JavaScript無効でも全28拠点と出典を読める", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${baseURL}/semiconductor-map`);
    await expect(page.locator("article")).toHaveCount(28);
    await page.locator("article#rapidus-chitose-iim summary").click();
    await expect(page.locator('article#rapidus-chitose-iim a[href="https://www.rapidus.inc/iim/"]')).toBeVisible();
    await context.close();
  });
});
