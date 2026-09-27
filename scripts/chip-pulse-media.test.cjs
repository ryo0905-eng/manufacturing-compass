const test=require('node:test');
const assert=require('node:assert/strict');
const {editionWindow,inEdition,publication,excluded,assertSecUrl,htmlText,reserve,validateDraft,edit,mergeSnapshot,priceAllowed}=require('./chip-pulse-media.cjs');
const fixture=require('../src/data/chip-pulse-media.json');
const now='2026-09-27T00:00:00.000Z';
test('JST 06:00 editions are half-open; date-only items are not assigned invented times',()=>{
 const e=editionWindow(now);assert.equal(e.start,'2026-09-25T21:00:00.000Z');assert.equal(e.end,'2026-09-26T21:00:00.000Z');
 assert.equal(editionWindow('2026-09-26T20:59:59.999Z').date,'2026-09-26');
 assert.ok(inEdition({datePrecision:'instant',publishedAt:e.start},e));assert.ok(!inEdition({datePrecision:'instant',publishedAt:e.end},e));assert.ok(!inEdition({datePrecision:'day',publishedAt:'2026-09-26'},e));
 assert.deepEqual(publication({filedAt:'2026-09-20'}),{publishedAt:'2026-09-20',datePrecision:'day'});
});
test('durable reservations cannot overrun daily/monthly caps, including crash and rerun',()=>{
 const ops={months:{'2026-09':990},days:{},reservations:{}};
 const first=reserve(ops,'run1',now,true);assert.equal(first.slots,5);assert.equal(ops.months['2026-09'],1000);
 assert.equal(reserve(ops,'run1',now,true),first);assert.equal(reserve(ops,'run2',now,true).slots,0);
 assert.equal(reserve(ops,'no-key',now,false),null);
 const fresh={months:{},days:{},reservations:{}};reserve(fresh,'a',now,true);assert.equal(reserve(fresh,'b',now,true).slots,0);
});
test('zero news, partial failure, all failure preserve appropriate previous content and timestamps',()=>{
 const previous=structuredClone(fixture);previous.updates=[{id:'old',sourceId:'failed',sourceUrl:'https://example.com/old',publishedAt:now,title:'old'}];
 const partial={status:'partial',errors:[{companyId:'failed'}],candidates:[{id:'new',companyId:'ok',companyName:'OK',sourceName:'SEC',sourceUrl:'https://example.com/new',filedAt:'2026-09-26',form:'8-K'}]};
 const next=mergeSnapshot(previous,partial,[{companyId:'failed'},{companyId:'ok'}],now);assert.equal(next.updates.length,2);assert.equal(next.status.sources[0].lastSuccessfulAt,null);
 const failed=mergeSnapshot(previous,{...partial,status:'failed'},[{companyId:'failed'}],now);assert.deepEqual(failed.edition,previous.edition);assert.deepEqual(failed.articles,previous.articles);assert.equal(failed.contentUpdatedAt,previous.contentUpdatedAt);
 const empty=structuredClone(fixture);empty.updates=[];const noNews=mergeSnapshot(empty,{status:'success',errors:[],candidates:[]},[],now);assert.equal(noNews.contentUpdatedAt,empty.contentUpdatedAt);assert.deepEqual(noNews.edition.articleIds,[]);
});
test('canonical URL/explicit aliases deduplicate; similar headlines are not deleted',()=>{
 const article=fixture.articles[0];const candidates=[{id:'a',sourceUrl:article.sourceUrl+'?utm_source=test',filedAt:'2026-09-25'},{id:'b',sourceUrl:'https://example.com/alias',filedAt:'2026-09-25'},{id:'c',sourceUrl:'https://example.com/new',filedAt:'2026-09-25'}];
 const merged=mergeSnapshot(fixture,{status:'success',errors:[],candidates},[],now,fixture.articles,[{signalId:article.id,sourceUrl:'https://example.com/alias'}]);assert.deepEqual(merged.updates.map(u=>u.id),['c']);
});
test('documents cannot redirect to arbitrary hosts and hidden scripts are not evidence',()=>{
 assert.throws(()=>assertSecUrl('https://attacker.example/article.htm'));assert.throws(()=>assertSecUrl('http://www.sec.gov/Archives/edgar/data/1/2/a.htm'));
 assert.equal(htmlText('<script>instructions</script><p>Revenue&nbsp;100</p>'),'Revenue 100');
 assert.ok(excluded({form:'8-K',items:'5.02,9.01'}));
});
const document={text:'Example plans investment of US$100 million. This is a plan, not production.'};
const draft={publish:true,stage:'plan',fields:[],processes:[],claims:[{text:'Example、投資計画を発表',quote:'Example plans investment of US$100 million.'},{text:'投資計画はUS$100 millionです。',quote:'Example plans investment of US$100 million.'}]};
test('evidence and numeric mismatches are rejected before semantic review',()=>{
 assert.equal(validateDraft(draft,document,'Example'),draft);
 assert.throws(()=>validateDraft({...draft,claims:[draft.claims[0],{text:'200 million',quote:draft.claims[1].quote}]},document,'Example'));
 assert.throws(()=>validateDraft({...draft,fields:['unfounded']},document,'Example'));
 assert.throws(()=>validateDraft({...draft,claims:[{text:'Example test',quote:'A made up source excerpt'},draft.claims[1]]},document,'Example'));
});
test('AI failure/rejection never produces an article; all claims require second pass',async()=>{
 await assert.rejects(edit({companyName:'Example'},document,async()=>{throw new Error('provider failed');}));
 assert.equal(await edit({companyName:'Example'},document,async()=>({json:{publish:false}})),null);
 let calls=0;await assert.rejects(edit({companyName:'Example'},document,async()=>({json:++calls===1?draft:{valid:true,claims:[true,false],classificationValid:true,stageValid:true}})));
 calls=0;const result=await edit({companyName:'Example'},document,async()=>({json:++calls===1?draft:{valid:true,claims:[true,true],classificationValid:true,stageValid:true}}));assert.equal(result.draft.stage,'plan');
});
test('missing or increased pricing closes the paid-processing gate',async()=>{
 assert.equal(await priceAllowed(async()=>({ok:true,json:async()=>({data:[]})})),false);
 assert.equal(await priceAllowed(async()=>({ok:true,json:async()=>({data:[{id:'google/gemini-2.5-flash-lite',pricing:{input:'0.1',output:'0.4'}}]})})),false);
});
test('published articles preserve IDs, valid timestamps, source and evidence; metadata has no thumbnail',()=>{
 assert.equal(new Set(fixture.articles.map(a=>a.id)).size,fixture.articles.length);
 for(const a of fixture.articles){assert.match(a.sourceUrl,/^https:\/\//);assert.ok(!Number.isNaN(Date.parse(a.updatedAt)));assert.ok(a.evidence.length);assert.ok(['editor-verified','ai-evidence-checked'].includes(a.validation));}
 for(const u of fixture.updates)assert.equal(u.thumbnail,undefined);
});
