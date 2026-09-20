import { test, expect } from "playwright/test";
import { jevCategories, jevRoutes, jevModel, jevQuestionVersion } from "../../src/data/jev-demo";

// Deterministic transport fixtures test UI state, not the model's correctness.
function fixture(sampleId: string, evidenceId: string | null) {
  const route = evidenceId === "same-specimen" ? "metrology" : "material";
  return {
    sampleId, evidenceId, model: jevModel, questionVersion: jevQuestionVersion,
    inputTokens: 1300, elapsedMs: 650, measuredAt: "2026-09-20T10:00:00.000Z",
    decisions: {
      change: { type: "choice", choice: "material", confidence: .8, probabilities: Object.fromEntries(Object.keys(jevCategories).map(key => [key, key === "material" ? .8 : .05])) },
      route: { type: "choice", choice: route, confidence: evidenceId ? .95 : .3, probabilities: Object.fromEntries(Object.keys(jevRoutes).map(key => [key, key === route ? .84 : .02])) },
      comparison: { type: "boolean", probability: evidenceId ? .91 : .07 },
      completeness: { type: "score", score: evidenceId ? 3.7 : 2, confidence: .8, probabilities: evidenceId ? { 0: 0, 1: 0, 2: 0, 3: .3, 4: .7 } : { 0: 0, 1: 0, 2: 1, 3: 0, 4: 0 } },
    },
  };
}

test("initial, independent evidence, failure, cached comparisons and case sharing", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: { sampleId: string; evidenceId: string | null }[] = [];
  let rejectOnce = true;
  await page.route("**/api/jev", async route => {
    const input = route.request().postDataJSON();
    requests.push(input);
    if (input.evidenceId === "same-specimen" && rejectOnce) {
      rejectOnce = false;
      await route.fulfill({ status: 502, json: { error: "テスト用：再評価に失敗しました。" } });
      return;
    }
    await route.fulfill({ json: fixture(input.sampleId, input.evidenceId) });
  });
  await page.goto("/labs/jev?case=batch");
  await expect(page.getByRole("button", { name: "B · 検査器を比べる" })).toBeDisabled();
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: /材料 あなたの予想|材料/ }).first().click();
  expect(requests).toHaveLength(0); // A prediction never sends an API request.
  await page.getByRole("button", { name: "Jevなら、どこを見る？" }).click();
  await expect(page.getByRole("status")).toContainText("初報の提案");
  await expect(page.getByRole("heading", { name: "材料・ロット", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "B · 検査器を比べる" }).click();
  await expect(page.getByRole("status")).toContainText("未評価");
  await page.getByRole("button", { name: "この比較をJevに見せる" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "テスト用：再評価に失敗" })).toBeVisible();
  // A failed branch never replaces the initial measurement.
  await expect(page.getByRole("heading", { name: "材料・ロット", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("初報の提案を表示");
  await page.getByRole("button", { name: "この比較をJevに見せる" }).click();
  await expect(page.getByRole("status")).toContainText("追加後の提案");
  await expect(page.getByRole("heading", { name: "測定系", exact: true })).toBeVisible();
  await expect(page.getByText("確認先が変わった", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "測定のばらつきを体験する" })).toHaveAttribute("href", "/tools/gage-rr");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByText("詳しく見る：報告文・確率・技術情報", { exact: true }).click();
  const barWidths = await page.locator("[data-selected] > div").evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
  expect(Math.max(...barWidths) - Math.min(...barWidths)).toBeLessThan(1);
  await page.getByText("詳しく見る：報告文・確率・技術情報", { exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `/tmp/jev-b-${testInfo.project.name}.png`, fullPage: true, animations: "disabled" });

  await page.getByRole("button", { name: "A · 装置を比べる" }).click();
  await expect(page.getByRole("status")).toContainText("未評価");
  await expect(page.getByRole("heading", { name: "材料・ロット", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "この比較をJevに見せる" }).click();
  await expect(page.getByRole("status")).toContainText("追加後の提案");
  await expect(page.getByText("確認先は同じ", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "B · 検査器を比べる" }).click();
  await expect(page.getByRole("heading", { name: "測定系", exact: true })).toBeVisible();
  await expect(page.getByText("✓ 評価済み · 切替では再送しません")).toBeVisible();
  expect(requests).toEqual([
    { sampleId: "batch", evidenceId: null },
    { sampleId: "batch", evidenceId: "same-specimen" },
    { sampleId: "batch", evidenceId: "same-specimen" },
    { sampleId: "batch", evidenceId: "across-tools" },
  ]);
  await page.getByRole("button", { name: /測定値がずれた/ }).click();
  await expect(page.getByRole("button", { name: "初報を評価する →" })).toBeVisible();
  await expect(page.getByRole("link", { name: "このケースの共有リンク" })).toHaveAttribute("href", "/labs/jev?case=shift");
  await page.goto("/labs/jev?case=unclear");
  await expect(page.getByRole("button", { name: /原因候補が食い違う/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/labs\/jev$/);
  await page.goto("/labs/jev?case=invalid");
  await expect(page.getByRole("button", { name: "01 不合格が増えた", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
  await page.goto("/tools");
  const jevCard = page.locator("article").filter({
    has: page.getByRole("heading", { name: "Jev AI Lab", exact: true }),
  });
  await expect(jevCard.getByRole("link", { name: "すぐ試す", exact: true })).toHaveAttribute(
    "href",
    "/labs/jev",
  );
  const sitemap = await page.request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/labs/jev");
});
