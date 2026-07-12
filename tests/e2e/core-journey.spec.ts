import { expect, test } from "playwright/test";

test.describe("主要導線", () => {
  test("トップの見出しが経験ルートの図と重ならない", async ({ page }) => {
    await page.setViewportSize({ height: 920, width: 2048 });
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1, name: "製造業で積んだ経験は、半導体でどこまで通用する？" });
    const routeVisual = page.locator(".experience-route-visual");
    await expect(heading).toBeVisible();
    await expect(routeVisual).toBeVisible();

    const headingBox = await heading.boundingBox();
    const routeVisualBox = await routeVisual.boundingBox();
    expect(headingBox).not.toBeNull();
    expect(routeVisualBox).not.toBeNull();
    expect((headingBox?.x ?? 0) + (headingBox?.width ?? 0)).toBeLessThanOrEqual(routeVisualBox?.x ?? 0);
  });

  test("トップから12問の診断を開始できる", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "製造業で積んだ経験は、半導体でどこまで通用する？" })).toBeVisible();
    await page.getByRole("link", { name: /12問の診断を始める/ }).first().click();

    await expect(page).toHaveURL(/\/career-compass$/);
    await expect(page.getByText("Q 01 / 12")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "現在の仕事で、最も近い領域は？" })).toBeVisible();
  });

  test("診断の回答後に次の質問へ進める", async ({ page }) => {
    await page.goto("/career-compass");

    await page.getByRole("button", { name: /生産技術/ }).click();

    await expect(page.getByText("Q 02 / 12")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "実際に担当している仕事は？" })).toBeVisible();
  });
});
