import { expect, test } from "playwright/test";
import { capabilitySamples } from "../../src/data/cpk-samples";
import {
  calculateCapability,
  calculateOverallCapability,
  parseMeasurements,
  sampleStandardDeviation,
} from "../../src/lib/process-capability";

test.describe("工程能力の計算ロジック", () => {
  test("全体標準偏差から両側規格のPp・Ppkを計算する", () => {
    const result = calculateOverallCapability([8, 9, 10, 11, 12], 5, 15);
    expect(result.mean).toBe(10);
    expect(result.standardDeviation).toBeCloseTo(Math.sqrt(2.5), 10);
    expect(result.potential).toBeCloseTo(1.054092553, 8);
    expect(result.performance).toBeCloseTo(result.potential ?? 0, 10);
  });

  test("片側規格では該当する片側指標だけを計算する", () => {
    const lowerOnly = calculateOverallCapability([-2, -1, 0, 1, 2], -5, undefined);
    expect(lowerOnly.potential).toBeUndefined();
    expect(lowerOnly.lower).toBeDefined();
    expect(lowerOnly.upper).toBeUndefined();
    expect(lowerOnly.performance).toBe(lowerOnly.lower);

    const upperOnly = calculateOverallCapability([-2, -1, 0, 1, 2], undefined, 5);
    expect(upperOnly.potential).toBeUndefined();
    expect(upperOnly.lower).toBeUndefined();
    expect(upperOnly.upper).toBeDefined();
    expect(upperOnly.performance).toBe(upperOnly.upper);
  });

  test("短期標準偏差ではCp・Cpk用の値を計算する", () => {
    const centered = calculateCapability({ mean: 0, standardDeviation: 1, lowerSpecificationLimit: -3, upperSpecificationLimit: 3, method: "short-term" });
    expect(centered.potential).toBe(1);
    expect(centered.performance).toBe(1);

    const upperShift = calculateCapability({ mean: 1, standardDeviation: 1, lowerSpecificationLimit: -3, upperSpecificationLimit: 3, method: "short-term" });
    expect(upperShift.potential).toBe(1);
    expect(upperShift.performance).toBeCloseTo(2 / 3, 10);

    const lowerShift = calculateCapability({ mean: -1, standardDeviation: 1, lowerSpecificationLimit: -3, upperSpecificationLimit: 3, method: "short-term" });
    expect(lowerShift.performance).toBeCloseTo(2 / 3, 10);
  });

  test("負数・高精度小数・標本標準偏差を扱う", () => {
    expect(sampleStandardDeviation([-1.000001, 0, 1.000001])).toBeCloseTo(1.000001, 10);
  });

  test("各区切りと不正文字を解析する", () => {
    expect(parseMeasurements("1\n2 3\t4,5，6;7；8\n\n8")).toEqual({ values: [1, 2, 3, 4, 5, 6, 7, 8, 8], invalidCount: 0 });
    expect(parseMeasurements("測定値\n1\nNG\n2")).toEqual({ values: [1, 2], invalidCount: 2 });
    expect(parseMeasurements("")).toEqual({ values: [], invalidCount: 0 });
  });

  test("固定サンプルの期待値が変わらない", () => {
    const expected = { centered: [2.340, 2.324], shifted: [1.984, 1.331], wide: [0.575, 0.575] } as const;
    for (const sample of capabilitySamples) {
      const result = calculateOverallCapability([...sample.values], sample.lsl, sample.usl);
      expect(result.potential).toBeCloseTo(expected[sample.id][0], 3);
      expect(result.performance).toBeCloseTo(expected[sample.id][1], 3);
    }
  });

  test("不正な規格と分散0を拒否する", () => {
    expect(() => calculateOverallCapability([1], 0, 2)).toThrow(/2件以上/);
    expect(() => calculateOverallCapability([1, 1, 1], 0, 2)).toThrow(/すべて同じ値/);
    expect(() => calculateOverallCapability([1, 2], undefined, undefined)).toThrow(/規格/);
    expect(() => calculateOverallCapability([1, 2], 2, 2)).toThrow(/上限規格/);
  });
});

test.describe("Cp・Cpk計算ツールの操作", () => {
  test("初期サンプル、分布、分析を表示して3種類を切り替えられる", async ({ page }) => {
    await page.goto("/tools/cpk");
    await expect(page.getByText("サンプルデータで表示中")).toBeVisible();
    await expect(page.locator(".primary-capability strong")).toHaveText("1.331");
    await expect(page.getByRole("img", { name: /測定値のヒストグラム/ })).toBeVisible();
    const sample = page.getByLabel("サンプル");
    await sample.selectOption("centered");
    await expect(page.locator(".primary-capability strong")).toHaveText("2.324");
    await sample.selectOption("wide");
    await expect(page.locator(".primary-capability strong")).toHaveText("0.575");
    await sample.selectOption("shifted");
    await expect(page.locator(".primary-capability strong")).toHaveText("1.331");
  });

  test("自分のデータを入力してエラー修正と片側規格を計算する", async ({ page }) => {
    await page.goto("/tools/cpk");
    await page.getByRole("button", { name: "自分のデータを入力" }).click();
    await expect(page.getByLabel("測定データ")).toBeFocused();
    await page.getByLabel("測定データ").fill("見出し\n1\n2\t3\n4,5");
    await expect(page.getByText(/5件の測定値を認識しました。1件/)).toBeVisible();
    await page.getByLabel("下限規格 LSL").fill("5");
    await page.getByLabel("上限規格 USL").fill("4");
    await page.getByRole("button", { name: "計算する" }).click();
    await expect(page.getByText("USLはLSLより大きい値にしてください。")).toBeVisible();
    await page.getByLabel("下限規格 LSL").fill("");
    await page.getByLabel("上限規格 USL").fill("8");
    await page.getByRole("button", { name: "計算する" }).click();
    await expect(page.locator(".primary-capability span")).toHaveText("Ppk");
    await expect(page.locator(".capability-metrics").getByText("Pp", { exact: true })).toBeVisible();
    await expect(page.locator(".capability-metrics").getByText("—", { exact: true }).first()).toBeVisible();
  });

  test("結果をコピーしてクリアできる", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/tools/cpk");
    await page.getByRole("button", { name: "結果をコピー" }).click();
    await expect(page.getByRole("button", { name: "コピーしました" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("計算方式: 全体標準偏差によるPp・Ppk");
    await page.getByRole("button", { name: "入力をクリア" }).click();
    await expect(page.getByText("測定データと規格値を入力すると、ここに計算結果が表示されます。")).toBeVisible();
  });

  test("モバイル幅で横スクロールしない", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tools/cpk");
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
  });
});
