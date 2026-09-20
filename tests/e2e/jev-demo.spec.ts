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

test("all cases share compact visuals; explicit evaluation, errors and cached branches", async ({ page }) => {
  const requests: { sampleId: string; evidenceId: string | null }[] = [];
  let fail = true;
  await page.route("**/api/jev", async route => {
    const input = route.request().postDataJSON();
    requests.push(input);
    if (input.evidenceId === "same-specimen" && fail) {
      fail = false;
      await route.fulfill({ status: 502, json: { error: "テスト用の通信失敗" } });
    } else await route.fulfill({ json: fixture(input.sampleId, input.evidenceId) });
  });
  await page.goto("/labs/jev");
  for (const name of ["① 不合格", "② 測定値", "③ 記録"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByTestId("jev-experience").locator("svg")).toHaveCount(4);
    const result = await page.getByTestId("jev-result").boundingBox();
    expect(result).not.toBeNull();
    expect(result!.y + result!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "① 不合格" }).click();
  await expect(page.getByRole("button", { name: "B 検査器比較" })).toBeDisabled();
  await page.getByRole("button", { name: "Jevに聞く" }).click();
  await expect(page.getByRole("status")).toContainText("材料・ロット");
  await page.getByRole("button", { name: "B 検査器比較" }).click();
  await expect(page.getByRole("status")).toContainText("未評価・表示は初報");
  await page.getByRole("button", { name: "Jevに聞く" }).click();
  await expect(page.getByRole("alert")).toContainText("通信失敗");
  await expect(page.getByRole("status")).toContainText("材料・ロット");
  await page.getByRole("button", { name: "再試行" }).click();
  await expect(page.getByRole("status")).toContainText("測定系");
  await page.getByRole("button", { name: "説明・確率・学習リンクを開く" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /測定のばらつきを体験する/ })).toHaveAttribute("href", "/tools/gage-rr");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "説明・確率・学習リンクを開く" })).toBeFocused();
  await page.getByRole("button", { name: "A 装置比較" }).click();
  await page.getByRole("button", { name: "Jevに聞く" }).click();
  await expect(page.getByRole("status")).toContainText("確認先は同じ");
  await page.getByRole("button", { name: "B 検査器比較" }).click();
  await expect(page.getByRole("button", { name: "✓ 評価済み" })).toBeDisabled();
  expect(requests).toHaveLength(4);
  await page.getByRole("button", { name: "最初", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("初報の提案");
  expect(requests).toHaveLength(4);
  await page.goto("/labs/jev?case=unclear");
  await expect(page.getByRole("button", { name: "③ 記録" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mfg-compass.com/labs/jev");
  await page.goto("/labs/jev?case=invalid");
  await expect(page.getByRole("button", { name: "① 不合格" })).toHaveAttribute("aria-pressed", "true");
});
