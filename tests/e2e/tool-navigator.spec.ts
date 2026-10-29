import { expect, test } from "@playwright/test";

test("歩留まりの候補を比較し、共有URLから復元する", async ({ page }, testInfo) => {
  await page.goto("/tools/navigator");
  await page.getByLabel("プログラミング経験").selectOption("nocode");
  await page.getByLabel("データ規模").selectOption("files");
  if (testInfo.project.name === "mobile-chrome") await page.getByRole("button", { name: "候補を見る →" }).click();
  for (const name of ["JMP", "Minitab Statistical Software", "KNIME Analytics Platform"]) {
    await page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) }).getByRole("button", { name: "＋ 比較" }).click();
  }
  await page.getByRole("button", { name: "比較を見る →" }).click();
  await expect(page.getByRole("table")).toContainText("JMP");
  await page.getByLabel("違いのある行を強調").check();
  await page.getByText("比較する項目を変更").click();
  await page.getByLabel("価格体系").uncheck();
  const url = page.url();
  await page.reload();
  if (testInfo.project.name === "mobile-chrome") await page.getByRole("button", { name: /3 比較/ }).click();
  await expect(page.getByRole("table")).toContainText("KNIME");
  await expect(page.getByLabel("違いのある行を強調")).toBeChecked();
  expect(new URL(url).searchParams.get("selected")).toBe("jmp,minitab,knime");
  await page.getByRole("button", { name: "JMPを比較から外す" }).first().click();
  await expect(page.getByRole("table")).not.toContainText("JMP");
});

test("データ基盤のマップとCpkの導線", async ({ page }, testInfo) => {
  await page.goto("/tools/navigator");
  await page.getByLabel("装置ログを収集・統合して可視化したい").check();
  if (testInfo.project.name === "mobile-chrome") await page.getByRole("button", { name: "マップ", exact: true }).click();
  await page.getByRole("button", { name: "Databricks", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Databricks", exact: true })).toBeVisible();
  await expect(page.getByText("別領域の補完候補")).toBeVisible();
  if (testInfo.project.name === "mobile-chrome") await page.getByRole("button", { name: "1 条件" }).click();
  await page.getByLabel("Cpkを計算したい").check();
  await page.getByLabel("工程能力分析を必須にする").check();
  await page.getByLabel("必要な機能をすべて確認済みの候補だけ表示").check();
  if (testInfo.project.name === "mobile-chrome") await page.getByRole("button", { name: "候補を見る →" }).click();
  await expect(page.getByRole("link", { name: "試す ↗" })).toHaveAttribute("href", "/tools/cpk");
  await expect(page.getByRole("heading", { name: "Minitab Statistical Software" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "JMP", exact: true })).toBeVisible();
});
