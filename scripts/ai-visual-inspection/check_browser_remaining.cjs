// Remaining scenarios after check_browser.cjs. Node 22, 175s limit, dev always stopped.
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const output = `${process.cwd()}/.cache/ai-visual-inspection/browser`;
fs.mkdirSync(output,{recursive:true});
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port','3100'],{stdio:['ignore','pipe','pipe'],detached:true});
let log='',browser,page; const verified=[],measurements={}; let failure=null;
server.stdout.on('data',x=>log+=x);server.stderr.on('data',x=>log+=x);
const stop=()=>{try{process.kill(-server.pid,'SIGTERM');}catch{}};
const deadline=setTimeout(()=>{stop();process.exit(124)},175000);
(async()=>{
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:3100/tools/ai-visual-inspection')).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:1280,height:950}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3100/tools/ai-visual-inspection');
 await page.getByRole('button',{name:'約5分の体験を始める'}).focus();await page.keyboard.press('Enter');
 const complete=n=>page.getByRole('status').filter({hasText:`全${n}枚の評価完了`}).waitFor({timeout:30000});
 await complete(6);
 await page.getByRole('button',{name:'3. 教えた例を変える',exact:true}).click();await complete(24);
 for(const model of ['normal-poor','label-errors']){
  await page.getByLabel('この例で事前学習したモデルに切り替える',{exact:true}).selectOption(model);await complete(24);verified.push(`model-${model}`);
 }
 await page.getByText('実際に教えた画像の代表例',{exact:true}).click();
 const examples=page.locator('img[src*="/lesson/"]');await examples.first().waitFor();
 await page.waitForFunction(()=>[...document.querySelectorAll('img[src*="/lesson/"]')].every(img=>img.complete&&img.naturalWidth===128));
 verified.push('training-representatives');
 // Native range keyboard control and paired number value must stay synchronized.
 const slider=page.getByRole('slider',{name:'AIの欠陥らしさのしきい値',exact:true});
 await slider.focus();const before=Number(await slider.inputValue());await page.keyboard.press('ArrowRight');
 assert.ok(Math.abs(Number(await slider.inputValue())-before-.05)<1e-9);await complete(24);verified.push('keyboard-range');
 await page.getByLabel('画像一覧',{exact:true}).selectOption('missed');
 const visible=await page.locator('button[aria-pressed]').allTextContents();assert.ok(visible.every(text=>text.includes('見逃し')));
 await page.getByLabel('画像一覧',{exact:true}).selectOption('all');
 await page.locator('button[aria-pressed]').nth(3).focus();await page.keyboard.press('Enter');await page.getByRole('dialog').waitFor();
 await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
 await page.keyboard.press('Escape');assert.ok(await page.locator('button[aria-pressed]').nth(3).evaluate(el=>el===document.activeElement));verified.push('filter-thumbnail-keyboard-dialog');
 await page.getByRole('button',{name:'4. 撮影条件を変える',exact:true}).click();await complete(24);
 const brightness=page.getByRole('spinbutton',{name:'撮影の明るさ（倍率） 数値入力'});
 for(const gain of ['1.2','0.8','1.1'])await brightness.fill(gain);
 await complete(24);assert.equal(await brightness.inputValue(),'1.1');
 const first=fs.readFileSync('public/ai-visual-inspection/v2/lesson/practice.pixels')[0];
 const displayed=await page.locator('canvas').first().evaluate(canvas=>canvas.getContext('2d').getImageData(0,0,1,1).data[0]);
 assert.equal(displayed,Math.floor(Math.min(255,first*1.1)+.5));verified.push('rapid-lighting-final-pixels');
 // Real Worker protocol measurements, with new pixels for warm inference and same pixels for caching.
 measurements.worker=await page.evaluate(async()=>{
  const buffer=await(await fetch('/ai-visual-inspection/v2/lesson/practice.pixels')).arrayBuffer();
  const images=Array.from({length:24},(_,i)=>({width:128,height:128,pixels:new Uint8Array(buffer.slice(i*16384,(i+1)*16384))}));
  const worker=new Worker('/ai-visual-inspection/v2/inference.worker.js',{type:'module'});
  const settings={model:'balanced',gain:1,rule:{threshold:112,minimumArea:12,corrected:false},scoreThreshold:.5,minimumArea:12};
  const run=(id,rows,changes={})=>new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error('Worker timeout')),30000);
   worker.onerror=e=>{clearTimeout(timeout);reject(Error(e.message));};
   worker.onmessage=({data})=>{clearTimeout(timeout);if(data.id!==id||data.status!=='complete')reject(Error('Unexpected worker response'));else resolve({elapsedMs:data.elapsedMs,inferenceCount:data.inferenceCount,images:data.results.length});};
   worker.postMessage({id,images:rows,settings:{...settings,...changes}});
  });
  try{
   await run(1,[images[0]]);
   const single=await run(2,[images[0]],{gain:1.1});
   const cached=await run(3,[images[0]],{gain:1.1,scoreThreshold:.7});
   const batch=await run(4,images,{gain:.9});
   const cancelled=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(Error('Cancellation timeout')),30000);
    worker.onmessage=({data})=>{clearTimeout(timeout);data.id===6&&data.status==='complete'?resolve(true):reject(Error('Stale batch reply'));};
    worker.postMessage({id:5,images,settings:{...settings,gain:1.2}});
    worker.postMessage({id:6,images:[images[0]],settings:{...settings,gain:.8}});
   });
   await cancelled;return {single,cached,batch,staleBatchSuppressed:true};
  }finally{worker.terminate();}
 });
 assert.equal(measurements.worker.single.inferenceCount,1);assert.equal(measurements.worker.cached.inferenceCount,0);assert.equal(measurements.worker.batch.inferenceCount,24);
 verified.push('actual-worker-warm-cache-cancellation');
 await page.setViewportSize({width:390,height:844});
 await page.locator('canvas').first().scrollIntoViewIfNeeded();
 await page.screenshot({path:output+'/mobile-viewport.png'});
 await page.getByRole('button',{name:'同じ画像を拡大',exact:true}).click();
 await page.getByRole('dialog').screenshot({path:output+'/mobile-dialog.png'});
 assert.ok(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
 await page.keyboard.press('Escape');verified.push('mobile-dialog');
 const failed=await browser.newPage();await failed.route('**/models/*.onnx',r=>r.abort());
 await failed.goto('http://127.0.0.1:3100/tools/ai-visual-inspection');await failed.getByRole('button',{name:'約5分の体験を始める'}).click();
 await failed.getByRole('status').filter({hasText:'AIは未評価'}).waitFor({timeout:30000});
 const aiCounts=failed.locator('section').filter({has:failed.getByRole('heading',{name:'AI',exact:true})}).last();
 assert.ok((await aiCounts.textContent()).includes('未評価'));
 await failed.unroute('**/models/*.onnx');await failed.getByRole('button',{name:'AIを再試行'}).click();await failed.getByRole('status').filter({hasText:'全6枚の評価完了'}).waitFor({timeout:30000});
 await failed.close();verified.push('network-failure-retry');
 assert.deepEqual(errors,[]);measurements.errors=errors;console.log(JSON.stringify({verified,measurements}));
})().catch(async error=>{failure=String(error);console.error(error);if(page)await page.screenshot({path:output+'/remaining-failure.png',fullPage:true}).catch(()=>{});process.exitCode=1;}).finally(async()=>{fs.writeFileSync(output+'/remaining.json',JSON.stringify({verified,measurements,failure,environment:'Desktop Chromium / Next dev webpack; mobile viewport only'},null,2));await browser?.close();stop();clearTimeout(deadline);fs.writeFileSync(output+'/remaining-server.log',log);});
