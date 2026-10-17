// Requires an explicitly requested browser check and a separately started local dev server.
// No production analytics verification.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.MFG_TEST_ORIGIN || 'http://127.0.0.1:3100';
    const route = '/guides/semiconductor-market-cap-ranking';
    const dialog = page.getByRole('dialog', { name: '2社の違い', exact: true });
    const panel = page.getByRole('complementary', { name: '気になる2社の違いを見る' });
    const tray = page.getByRole('complementary', { name: '比較する企業の選択' });
    const result = page.locator('[data-ranking-comparison-result]');
    await page.goto(base + route);
    assert.equal(await result.count(), 0);

    // Both tables retain complete server-rendered details and fit the actual article width.
    for (const width of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const scope of ['world', 'japan']) {
        const table = page.locator(`#${scope}-ranking table`);
        const details = table.locator('details').filter({ hasText: scope === 'world' ? 'NVDA' : '8035.T' }).first();
        for (const expanded of [false, true]) {
          if (expanded) await details.locator('summary').click();
          assert.ok(await table.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${scope}/${width}/${expanded}: table overflow`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        }
        await details.locator('summary').click();
      }
      const longNameButton = page.locator('#world-ranking').getByRole('button', { name: 'NXPセミコンダクターズを比較に追加', exact: true });
      const box = await longNameButton.boundingBox();
      assert.ok(box && box.width >= 44 && box.height >= 44 && box.x >= 0 && box.x + box.width <= width);
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.locator('#world-ranking').getByRole('button', { name: '東京エレクトロンを比較に追加', exact: true }).click();
    assert.equal(await tray.getByRole('button', { name: '2社を比較する', exact: true }).isDisabled(), true);
    assert.equal(await page.locator('#japan-ranking').getByRole('button', { name: '東京エレクトロンを比較から外す', exact: true }).getAttribute('aria-pressed'), 'true');
    await page.locator('#japan-ranking').getByRole('button', { name: 'アドバンテストを比較に追加', exact: true }).click();
    assert.equal(await dialog.count(), 0); // Choosing the second company does not open the result.
    await page.locator('#world-ranking').getByRole('button', { name: 'NVIDIAを比較に追加', exact: true }).click();
    assert.match(await tray.innerText(), /比較は2社まで/);
    const openButton = tray.getByRole('button', { name: '2社を比較する', exact: true });
    await openButton.focus();
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Enter');
    await dialog.waitFor();
    assert.match(await dialog.innerText(), /東京エレクトロン/);
    assert.equal(await tray.isVisible(), false);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'ranking-comparison-title');
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await page.evaluate(() => window.scrollY), scrollBefore);

    // Tab controls, focus containment and the original selection survive closing.
    await dialog.getByRole('tab', { name: '違いの概要', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await dialog.getByRole('tab', { name: '日本の仕事', exact: true }).getAttribute('aria-selected'), 'true');
    assert.match(await dialog.getByRole('tabpanel', { name: '日本の仕事', exact: true }).innerText(), /未掲載/);
    await page.keyboard.press('Home');
    assert.equal(await dialog.getByRole('tab', { name: '違いの概要', exact: true }).getAttribute('aria-selected'), 'true');
    await dialog.getByRole('button', { name: '閉じる', exact: true }).focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await dialog.evaluate(element => element.contains(document.activeElement)), true);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await openButton.evaluate(element => element === document.activeElement), true);
    assert.equal(await page.evaluate(() => window.scrollY), scrollBefore);
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await tray.getByRole('button', { name: '東京エレクトロンを比較から外す', exact: true }).count(), 1);
    await tray.getByRole('button', { name: 'アドバンテストを比較から外す', exact: true }).click();
    assert.equal(await openButton.isDisabled(), true);

    await panel.getByRole('button', { name: 'NVIDIAとTSMC' }).click();
    await dialog.waitFor();
    await page.evaluate(() => { window.__copied = ''; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } }); });
    await dialog.getByRole('button', { name: 'この比較のリンクをコピー', exact: true }).click();
    await page.waitForFunction(() => window.__copied.endsWith('#compare=nvidia,tsmc'));
    const shared = await page.evaluate(() => window.__copied);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('denied'); } } }));
    await dialog.getByRole('button', { name: 'この比較のリンクをコピー', exact: true }).click();
    assert.equal(await dialog.getByRole('textbox', { name: '手動コピー用リンク' }).inputValue(), shared);
    await page.goto(shared);
    await dialog.waitFor();
    await dialog.getByRole('tab', { name: '日本の仕事', exact: true }).click();
    assert.match(await dialog.getByRole('tabpanel', { name: '日本の仕事', exact: true }).innerText(), /TSMC/);
    await dialog.getByRole('tab', { name: '違いの概要', exact: true }).click();
    await result.screenshot({ path: '/private/tmp/ranking-compare-desktop.png' });

    // Background clicks close the desktop dialog without clearing the pair.
    await page.mouse.click(2, 2);
    await dialog.waitFor({ state: 'detached' });
    await tray.getByRole('button', { name: '2社を比較する', exact: true }).click();
    await dialog.getByRole('link', { name: 'この会社を業界地図で見る →', exact: true }).first().click();
    await page.getByRole('dialog', { name: 'NVIDIA', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog', { name: 'NVIDIA', exact: true }).count(), 0);

    for (const width of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(shared);
      await dialog.waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.ok(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
      await dialog.getByRole('tab', { name: '日本の仕事', exact: true }).click();
      assert.ok(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
      await dialog.getByRole('button', { name: '閉じる', exact: true }).click();
      assert.equal(await tray.isVisible(), true);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(shared);
    await dialog.waitFor();
    await page.screenshot({ path: '/private/tmp/ranking-compare-mobile.png' });

    await page.goto(base + route + '#compare=unknown,nvidia');
    await tray.getByText('比較リンクを復元できませんでした。掲載中の異なる2社を選んでください。', { exact: true }).waitFor();
    assert.equal(await result.count(), 0);
    await page.goto(base + route + '#world-ranking');
    await panel.waitFor();
    assert.equal(await result.count(), 0);
    await page.goto(base + route + '#compare=arm,cxmt');
    await dialog.waitFor();
    assert.equal(await dialog.getByRole('tabpanel', { name: '違いの概要', exact: true }).locator('a[href="/industry-map#company=arm"]').count(), 1);
    assert.equal(await dialog.locator('a[href*="company=cxmt"]').count(), 0);
    assert.deepEqual(errors, []);
    fs.writeFileSync('/private/tmp/ranking-compare-browser-results.json', JSON.stringify({ widths: [360, 390, 768, 1280], selection: true, dialog: true, tabs: true, keyboard: true, focusReturn: true, share: true, copyFallback: true, invalidHash: true, pageErrors: errors }, null, 2));
    console.log('PASS: responsive tables/dialog, details, selection, tabs, keyboard/focus return, sharing, copy fallback and map links.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
