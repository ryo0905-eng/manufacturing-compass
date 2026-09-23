// Requires a separately started local dev server. No production analytics verification.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch(); const errors=[];
 try {
 const page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.MFG_TEST_ORIGIN||'http://127.0.0.1:3100',route='/guides/semiconductor-market-cap-ranking';
 await page.goto(base+route); const panel=page.getByRole('complementary',{name:'気になる2社の違いを見る'}),result=page.locator('[data-ranking-comparison-result]');
 assert.equal(await result.count(),0);
 await page.locator('#world-ranking').getByRole('button',{name:'東京エレクトロンを比較に追加',exact:true}).click();
 assert.equal(await page.locator('#japan-ranking').getByRole('button',{name:'東京エレクトロンを比較から外す',exact:true}).getAttribute('aria-pressed'),'true');
 await page.locator('#japan-ranking').getByRole('button',{name:'アドバンテストを比較に追加',exact:true}).click();
 await page.locator('#world-ranking').getByRole('button',{name:'NVIDIAを比較に追加',exact:true}).click();
 assert.ok((await panel.innerText()).includes('比較は2社まで'));
 const tray=page.getByRole('complementary',{name:'比較する企業の選択'}); await tray.getByRole('button',{name:'違いを見る',exact:true}).focus();await page.keyboard.press('Enter');await result.waitFor();
 assert.match(await result.innerText(),/東京エレクトロン/);assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H3');
 await panel.getByRole('button',{name:'アドバンテストを比較から外す',exact:true}).click();assert.equal(await result.count(),0);
 await panel.getByRole('button',{name:'NVIDIAとTSMC',exact:true}).click();await result.waitFor();
 await page.evaluate(()=>{window.__copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});});
 await result.getByRole('button',{name:'この比較のリンクをコピー',exact:true}).click();await page.waitForFunction(()=>window.__copied.endsWith('#compare=nvidia,tsmc'));const shared=await page.evaluate(()=>window.__copied);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}));await result.getByRole('button',{name:'この比較のリンクをコピー',exact:true}).click();await result.getByRole('textbox',{name:'手動コピー用リンク'}).waitFor();assert.equal(await result.getByRole('textbox',{name:'手動コピー用リンク'}).inputValue(),shared);
 await page.goto(shared);await result.waitFor();await page.waitForFunction(()=>document.activeElement.tagName==='H3');await result.screenshot({path:'/private/tmp/ranking-compare-desktop.png'});
 await result.getByRole('link',{name:'この会社を業界地図で見る →',exact:true}).first().click();await page.getByRole('complementary',{name:'選択した企業の詳細'}).waitFor();assert.match(await page.getByRole('complementary',{name:'選択した企業の詳細'}).innerText(),/NVIDIA/);assert.equal(await page.locator('[data-atlas-company="nvidia"] button').getAttribute('aria-pressed'),'true');await page.keyboard.press('Escape');assert.equal(await page.getByRole('complementary',{name:'選択した企業の詳細'}).count(),0);
 await page.setViewportSize({width:390,height:844});await page.goto(shared);await result.waitFor();await page.waitForFunction(()=>document.activeElement.tagName==='H3');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);await page.screenshot({path:'/private/tmp/ranking-compare-mobile.png'});
 await result.getByRole('link',{name:'この会社を業界地図で見る →',exact:true}).first().click();await page.getByRole('complementary',{name:'選択した企業の詳細'}).waitFor();await page.screenshot({path:'/private/tmp/ranking-map-mobile.png'});await page.keyboard.press('Escape');await page.getByLabel('企業名・製品・職種で検索').fill('TSMC');assert.equal(await page.getByRole('complementary',{name:'選択した企業の詳細'}).count(),0);
 await page.goto(base+route+'#compare=unknown,nvidia');await panel.getByText('比較リンクを復元できませんでした。掲載中の異なる2社を選んでください。',{exact:true}).waitFor();assert.equal(await result.count(),0);
 await page.goto(base+route+'#world-ranking');await panel.waitFor();assert.equal(await result.count(),0);
 await page.goto(base+route+'#compare=arm,cxmt');await result.waitFor();assert.equal(await result.locator('a[href="/industry-map#company=arm"]').count(),1);assert.equal(await result.locator('a[href*="company=cxmt"]').count(),0);
 assert.deepEqual(errors,[]);fs.writeFileSync('/private/tmp/ranking-compare-browser-results.json',JSON.stringify({desktop:true,mobile390:true,keyboard:true,share:true,copyFallback:true,invalidHash:true,atlasEntry:true,pageErrors:errors},null,2));
 console.log('PASS: desktop/mobile selection, shared rows, limits/removal, keyboard, share restoration, copy/fallback, map entry/escape, invalid hashes and unlisted companies.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
