const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const origin = process.env.PALM_FAB_ORIGIN || 'http://localhost:3107';
  for (const [device, viewport] of Object.entries({ mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } })) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(`${origin}/games/palm-fab`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /検査装置 レベル1/ }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${device} overflow`);
    await page.screenshot({ path: `/tmp/palm-fab-${device}.png`, fullPage: true });
    await page.getByRole('button', { name: /検査装置 レベル1/ }).click();
    assert.ok((await page.getByRole('region', { name: '装置の詳細' }).innerText()).includes('13.0 秒'));
    assert.equal(await page.getByRole('button', { name: /検査を強化/ }).isEnabled(), false);
    await page.getByRole('button', { name: /一時停止/ }).click();
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /再開/ }).waitFor();
    assert.equal(await page.getByRole('button', { name: /再開/ }).count(), 1, `${device} pause persisted`);
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'リセット' }).click();
    assert.equal(await page.getByRole('button', { name: /一時停止/ }).count(), 1, `${device} reset resumed new game`);
    assert.ok((await page.locator('main').innerText()).includes('累計出荷\n0'));
    await page.close();
    console.log(`${device}: layout, selection, shortage, pause/save/reload and reset passed`);
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
