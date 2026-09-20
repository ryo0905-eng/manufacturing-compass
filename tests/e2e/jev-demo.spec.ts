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
  await expect(page.getByRole("button", { name: /同じ試料なのに/ })).toBeDisabled();
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "初報を評価する →" }).click();
  await expect(page.getByRole("status")).toContainText("初報の実測結果");
  await expect(page.getByRole("heading", { name: "材料・ロット", exact: true })).toBeVisible();

  await page.getByRole("button", { name: /同じ試料なのに/ }).click();
  await expect(page.getByRole("status")).toContainText("未評価");
  await page.getByRole("button", { name: "この情報で再評価する →" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "テスト用：再評価に失敗" })).toBeVisible();
  // A failed branch never replaces the initial measurement.
  await expect(page.getByRole("heading", { name: "材料・ロット", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("初報の結果を表示中");
  await page.getByRole("button", { name: "この情報で再評価する →" }).click();
  await expect(page.getByRole("status")).toContainText("比較中");
  await expect(page.getByRole("heading", { name: "測定系", exact: true })).toBeVisible();
  await expect(page.getByText("変更カテゴリは同じ", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "測定のばらつきを体験する" })).toHaveAttribute("href", "/tools/gage-rr");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const barWidths = await page.locator("[data-selected] > div").evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
  expect(Math.max(...barWidths) - Math.min(...barWidths)).toBeLessThan(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `/tmp/jev-b-${testInfo.project.name}.png`, fullPage: true, animations: "disabled" });

  await page.getByRole("button", { name: /別の装置でも同じ傾向/ }).click();
  await expect(page.getByRole("status")).toContainText("未評価");
  await expect(page.getByRole("heading", { name: "材料・ロット", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "この情報で再評価する →" }).click();
  await expect(page.getByRole("status")).toContainText("比較中");
  await page.getByRole("button", { name: /同じ試料なのに/ }).click();
  await expect(page.getByRole("heading", { name: "測定系", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "この追加情報は評価済み" })).toBeDisabled();
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
});
