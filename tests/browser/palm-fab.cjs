const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require(name) { if (Object.hasOwn(dependencies, name)) return dependencies[name]; throw Error(name); } });
  return exports;
}
const data = load('src/data/palm-fab.ts');
const fab = load('src/lib/palm-fab/simulation.ts', { '@/data/palm-fab': data });

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
    assert.equal(await page.getByRole('button', { name: /検査をアップグレード/ }).isEnabled(), false);
    await page.getByRole('button', { name: /一時停止/ }).click();
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /再開/ }).waitFor();
    assert.equal(await page.getByRole('button', { name: /再開/ }).count(), 1, `${device} pause persisted`);
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: /リセット/ }).click();
    assert.equal(await page.getByRole('button', { name: /一時停止/ }).count(), 1, `${device} reset resumed new game`);
    assert.ok((await page.locator('main').innerText()).includes('累計出荷\n0'));
    await page.close();
    console.log(`${device}: layout, selection, shortage, pause/save/reload and reset passed`);
  }
  const congested = fab.advanceFab(fab.newFab(), 120);
  const improved = fab.advanceFab(fab.buyUpgrade(congested, 'inspect'), 90);
  for (const [device, viewport, state, file] of [
    ['mobile', { width: 390, height: 844 }, congested, 'bottleneck-mobile'],
    ['desktop', { width: 1440, height: 900 }, improved, 'improved-desktop'],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: fab.SAVE_KEY, value: JSON.stringify({ ...state, paused: true }) });
    await page.goto(`${origin}/games/palm-fab`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /検査装置 レベル/ }).click();
    await page.screenshot({ path: `/tmp/palm-fab-${file}.png`, fullPage: true });
    const text = await page.getByRole('group', { name: /加工、洗浄、検査/ }).textContent();
    assert.ok(text.includes(`検査待ち ${state.queues.inspectIn.length} / 6`), `${device} queue visual reflects simulation`);
    await page.close();
  }
  console.log('congested and improved scene screenshots match simulation queues');
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
