// Run only when browser verification is requested, against a separately started local server.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  try {
    const base = process.env.MFG_TEST_ORIGIN || 'http://127.0.0.1:3100';
    const page = await browser.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [route, count] of [['/industry-map', 44], ['/companies', 44]]) {
        await page.goto(base + route);
        assert.equal(await page.locator('[data-company-explorer-company]').count(), count);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        const trigger = page.locator('[data-company-explorer-company] button').first();
        await trigger.click(); const dialog = page.getByRole('dialog'); await dialog.waitFor();
        assert.ok(await dialog.getByRole('button', { name: '閉じる' }).isFocused());
        await page.keyboard.press('Shift+Tab');
        assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
        await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' });
        assert.ok(await trigger.isFocused());
      }
    }
    await page.goto(base + '/companies?query=ＮＶＩＤＩＡ%20GPU');
    assert.equal(await page.locator('[data-company-explorer-company]').count(), 1);
    assert.ok(page.url().includes('/industry-map?query='));
    await page.getByRole('button', { name: '条件をクリア', exact: true }).click();
    assert.equal(await page.locator('[data-company-explorer-company]').count(), 44);
    await page.getByLabel('本社地域', { exact: true }).selectOption('japan');
    await page.getByLabel('国内拠点情報あり').check();
    assert.ok(await page.locator('[data-company-explorer-company]').count() > 0);
    await page.getByLabel('企業名・製品・職種で検索', { exact: true }).fill('nonexistentword');
    assert.equal(await page.locator('[data-company-explorer-company]').count(), 0);
    await page.goto(base + '/industry-map#company=nvidia');
    await page.getByRole('dialog', { name: 'NVIDIA', exact: true }).waitFor();
    await page.getByRole('button', { name: '閉じる' }).click();
    assert.ok(await page.locator('[data-atlas-company="nvidia"] button').isFocused());
    await page.getByLabel('企業名・製品・職種で検索', { exact: true }).fill('Broadcom');
    assert.equal(await page.locator('[data-company-explorer-company]').count(), 1);
    assert.ok(await page.getByRole('link', { name: 'ブロードコムの企業詳細', exact: true }).isVisible());
    await page.goto(base + '/companies#japanese-companies');
    assert.ok(page.url().endsWith('/industry-map#japanese-companies'));
    await page.goto(base + '/industry-map?query=nonexistentword#company=broadcom');
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.locator('[data-company-explorer-company]').count(), 44);
    await page.getByRole('button', { name: '閉じる' }).click();
    await page.goto(base + '/industry-map#company=unknown');
    await page.getByText('指定された企業は地図に未収録です。地図から企業を選んでください。', { exact: true }).waitFor();
    assert.equal(await page.getByRole('dialog').count(), 0);
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJs.newPage(); await staticPage.goto(base + '/companies');
    assert.equal(await staticPage.locator('[data-company-explorer-company]').count(), 44);
    assert.ok(await staticPage.locator('[data-company-explorer-company="nvidia"] a[href="/companies/nvidia"]').isVisible());
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log('PASS: four widths, native dialog/focus/Escape, redirect/query/anchors/filters/all-company hash and no-JavaScript company links.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
