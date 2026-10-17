const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function loader(overrides={},globals={}) {const cache=new Map();function load(stem){const file=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());if(!file)throw Error(stem);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{exports,process,URL,URLSearchParams,...globals,require(id){if(id in overrides)return overrides[id];if(id==='@/lib/analytics')return{trackEvent(){}};if(id==='next/link')return{__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};if(id==='next/navigation')return{usePathname:()=>'/guides/semiconductor-market-cap-ranking',notFound(){throw Error('not found')}};if(id.endsWith('.css'))return{__esModule:true,default:new Proxy({},{get:(_,k)=>k})};if(id.startsWith('@/'))return load('src/'+id.slice(2));if(id.startsWith('.'))return load(path.resolve(path.dirname(file),id));return require(id)}},{filename:file});return exports}return load}
const load=loader(),lib=load('src/lib/ranking-company-compare'),data=load('src/data/semiconductor-market-cap'),map=load('src/data/industry-map'),entry=load('src/lib/industry-map-entry');
const plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(data.worldSemiconductorMarketCapRanking.length,30);assert.equal(data.japanSemiconductorMarketCapRanking.length,10);assert.equal(lib.comparisonCompanies.length,38);
assert.deepEqual(plain(data.worldSemiconductorMarketCapRanking.map(company=>company.rank)),Array.from({length:30},(_,index)=>index+1));
assert.ok(data.worldSemiconductorMarketCapRanking.every((company,index,companies)=>index===0||companies[index-1].marketCapUsdB>=company.marketCapUsdB));
assert.equal(new Set(data.worldSemiconductorMarketCapRanking.map(company=>company.id)).size,30);assert.equal(new Set(data.worldSemiconductorMarketCapRanking.map(company=>company.ticker)).size,30);
assert.deepEqual(plain(data.japanSemiconductorMarketCapRanking.map(company=>company.domesticRank)),Array.from({length:10},(_,index)=>index+1));
assert.ok(data.japanSemiconductorMarketCapRanking.every((company,index,companies)=>index===0||companies[index-1].marketCapUsdB>=company.marketCapUsdB));
assert.equal(new Set(data.japanSemiconductorMarketCapRanking.map(company=>company.id)).size,10);assert.equal(new Set(data.japanSemiconductorMarketCapRanking.map(company=>company.ticker)).size,10);
assert.ok([...data.worldSemiconductorMarketCapRanking,...data.japanSemiconductorMarketCapRanking].every(company=>company.dataAsOf==='2026-10-01'));
for(const id of ['astera-labs','umc','rorze'])assert.ok(lib.comparisonCompanyById.has(id),id);for(const id of ['nxp','coherent','maruwa'])assert.ok(!lib.comparisonCompanyById.has(id),id);
const catalog=load('src/data/companies').companies;
const japan=load('src/data/japan-work'),japanModel=load('src/lib/japan-work');
for(const profile of japan.japanWorkCompanies){const ranked=lib.comparisonCompanyById.get(profile.companyId);if(ranked)assert.equal(catalog.find(c=>c.slug===ranked.companySlug)?.id,profile.companyId);}
for(const [pair,expected] of [[['asml','micron'],[true,true]],[['nvidia','tsmc'],[false,true]],[['tokyo-electron','advantest'],[false,false]]])assert.deepEqual(pair.map(id=>lib.comparisonJapanWorks(id).length>0),expected);
assert.equal(lib.comparisonJapanWorks('amd').length,0);assert.equal(lib.comparisonJapanWorks('unknown').length,0);
const asmlWork=japan.japanWorkEvidence.find(w=>w.companyId==='asml'),asmlProfile=japan.japanWorkCompanies.find(c=>c.companyId==='asml');
assert.equal(lib.comparisonJapanWorks('asml')[0],asmlWork); // Preserve the work-specific location and caveats.
for(const status of ['draft','withdrawn']){asmlWork.status=status;assert.equal(lib.comparisonJapanWorks('asml').length,0);}asmlWork.status='published';
asmlProfile.status='pending';assert.equal(lib.comparisonJapanWorks('asml').length,0);asmlProfile.status='published';
assert.equal(japanModel.isJapanWorkReviewExpired(asmlWork,asmlWork.nextReviewAt),false);assert.equal(japanModel.isJapanWorkReviewExpired(asmlWork,'2099-01-01'),true);
assert.deepEqual(plain(lib.comparisonEventProperties('related_click',['asml','micron'],'example','japan_work')),{action:'related_click',source:'example',company_a:'asml',company_b:'micron',destination:'japan_work'});
for(const c of lib.comparisonCompanies){assert.match(c.id,/^[a-z0-9-]+$/);assert.equal(c.dataAsOf,data.semiconductorMarketCapMeta.dataAsOf);assert.ok(lib.categoryExplanations(c).every(z=>z.description));if(c.companySlug)assert.ok(catalog.some(x=>x.slug===c.companySlug));const id=lib.comparisonMapId(c);if(id)assert.ok(map.industryMapZones.some(z=>[...z.companyIds,...z.supplementalCompanyIds].includes(id)));}
assert.equal(lib.comparisonMapId(lib.comparisonCompanyById.get('arm')),'arm');assert.equal(lib.comparisonMapId(lib.comparisonCompanyById.get('cxmt')),undefined);
assert.deepEqual(plain(lib.addComparisonCompany(['tokyo-electron'],'tokyo-electron').ids),['tokyo-electron']);assert.match(lib.addComparisonCompany(['nvidia','tsmc'],'amd').notice,/2社まで/);assert.deepEqual(plain(lib.addComparisonCompany(['nvidia','tsmc'],'amd').ids),['nvidia','tsmc']);
for(const hash of ['#compare=nvidia','#compare=nvidia,nvidia','#compare=nvidia,unknown','#compare=nvidia,nxp','#compare=coherent,maruwa','#compare=nvidia,tsmc,amd','#compare=nvidia,tsmc&compare=amd,tsmc','#compare=__proto__,tsmc'])assert.equal(lib.readRankingComparisonHash(hash).kind,'invalid');
assert.equal(lib.readRankingComparisonHash('#world-ranking').kind,'anchor');const url=lib.rankingComparisonUrl('https://mfg-compass.com',['nvidia','tsmc']);assert.equal(url,'https://mfg-compass.com/guides/semiconductor-market-cap-ranking#compare=nvidia,tsmc');const nvidia=lib.comparisonCompanyById.get('nvidia'),oldRank=nvidia.rank;nvidia.rank=12;assert.equal(lib.readRankingComparisonHash(new URL(url).hash).ids[0],'nvidia');nvidia.rank=oldRank;
assert.equal(entry.readIndustryCompanyHash('#company=nvidia',['nvidia']).id,'nvidia');assert.equal(entry.readIndustryCompanyHash('#company=unknown',['nvidia']).kind,'invalid');assert.equal(entry.readIndustryCompanyHash('#industry-zone-idm',['nvidia']).kind,'anchor');assert.equal(entry.readIndustryCompanyHash('#company=nvidia&company=tsmc',['nvidia','tsmc']).kind,'invalid');
const UI=load('src/components/RankingCompanyCompare'),Table=load('src/components/MarketCapRankingTable').MarketCapRankingTable;
const html=renderToStaticMarkup(React.createElement(UI.RankingCompanyCompareProvider,null,React.createElement(UI.RankingCompanyComparePanel),React.createElement(Table,{scope:'world',sourceSlug:'semiconductor-market-cap-ranking'}),React.createElement(Table,{scope:'japan',sourceSlug:'semiconductor-market-cap-ranking'})));
for(const word of ['気になる2社','NVDA','5.49兆ドル','2026年10月1日','Astera Labs','UMC（聯華電子）','ローツェ','日本企業TOP10','/companies/nvidia'])assert.ok(html.includes(word),word);assert.equal((html.match(/比較に追加<\/button>/g)||[]).length,40);assert.ok(!html.includes('data-ranking-comparison-result'));
let cursor=0;const slots=[],events=[];const react={...React,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},useRef(initial){const i=cursor++;return slots[i]??={current:initial}},useEffect(){}};
const interactive=loader({react,'@/lib/analytics':{trackEvent:(name,props)=>events.push({name,props})}},{window:{location:{hash:'',pathname:lib.rankingComparePath,search:''},history:{replaceState(){}}}})('src/components/RankingCompanyCompare');
function context(){cursor=0;return interactive.RankingCompanyCompareProvider({children:null}).props.value;}
context().add('tokyo-electron','world');context().add('tokyo-electron','japan');assert.equal(context().ids.length,1);context().add('advantest','japan');assert.equal(context().ids.length,2);context().add('nvidia','world');assert.match(context().notice,/2社/);context().open();assert.equal(context().shown,true);context().record('result_view');context().record('result_view');assert.equal(events.filter(e=>e.props.action==='result_view').length,1);context().remove('advantest');assert.equal(context().shown,false);context().example(['nvidia','tsmc']);assert.equal(context().source,'example');context().record('copy_success');context().record('related_click','industry_map');
for(const e of events){assert.equal(e.name,'ranking_company_compare');assert.ok(Object.keys(e.props).every(k=>['action','source','company_a','company_b','destination'].includes(k)));assert.ok(!JSON.stringify(e).includes('https://'));}
(async () => {
  const page = load('src/app/(ja)/guides/[slug]/page');
  const params = Promise.resolve({ slug: 'semiconductor-market-cap-ranking' });
  const rendered = renderToStaticMarkup(await page.default({ params }));
  const guide = load('src/content/guides/semiconductor-market-cap-ranking').semiconductorMarketCapRankingGuide;
  const body = rendered.slice(rendered.indexOf('<article'));
  const orderedIds = ['world-ranking', 'japan-ranking', 'ranking-compare-title', 'ranking-history', 'ranking-time-machine-preview', 'top-ten'];
  for (let index = 1; index < orderedIds.length; index++) {
    const previous = body.indexOf(`id="${orderedIds[index - 1]}"`);
    const current = body.indexOf(`id="${orderedIds[index]}"`);
    assert.ok(previous >= 0 && current > previous, orderedIds[index]);
  }
  const prefix = body.slice(0, body.indexOf('id="world-ranking"'));
  assert.ok(prefix.includes(guide.intro.conclusion));
  assert.ok(!prefix.includes('guide-intro-summary') && !prefix.includes('guide-experience-basis'));
  assert.match(prefix, /<details class="ranking-toc"><summary>/);
  assert.ok(!/<details[^>]*\sopen[\s=>]/.test(prefix));
  assert.equal((prefix.match(/class="ranking-quick-links"/g) || []).length, 1);
  assert.equal((body.match(/class="market-cap-table"/g) || []).length, 2);
  assert.equal((body.match(/class="salary-bar-chart metric-bar-chart"/g) || []).length, 2);
  assert.equal((body.match(/比較に追加<\/button>/g) || []).length, 40);
  assert.ok(body.indexOf('id="industry-map-books"') > body.indexOf('id="research-flow"'));
  assert.ok(!body.includes('読んでよかった2冊（広告あり）'));
  assert.ok(body.includes('同一企業、二重上場、ADR') && body.includes('各社の公式企業情報'));

  // Merged sections retain incoming anchors; every local link resolves outside the closed TOC.
  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  const contentAfterToc = body.slice(body.indexOf('</details>') + '</details>'.length);
  for (const id of ['world-ranking', 'japan-ranking', 'industry-map-books', 'compare-by-field', 'methodology', 'top-ten', 'business-models', 'what-is-market-cap', 'ranking-findings', 'revenue-ranking', 'career-view', 'research-flow', 'faq', 'sources-method', 'summary']) {
    assert.ok(contentAfterToc.includes(`id="${id}"`), id);
  }
  for (const match of body.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  const rankingContent = body.slice(body.indexOf('id="world-ranking"'), body.indexOf('id="ranking-compare-title"'));
  assert.ok(!rankingContent.includes('<details') && !rankingContent.includes('link-callout'));
  assert.ok(!rankingContent.includes('href="/industry-map"') && !rankingContent.includes('industry-map-books'));

  const schemas = [...rendered.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const article = schemas.find(schema => schema['@type'] === 'Article');
  assert.equal(article.dateModified, guide.updatedAt);
  assert.equal(article.headline, guide.title);
  const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
  const visibleFaq = guide.sections.flatMap(section => section.blocks ?? []).filter(block => block.type === 'faq').flatMap(block => block.items);
  assert.equal(faq.mainEntity.length, visibleFaq.length);
  for (const [index, item] of visibleFaq.entries()) {
    assert.equal(faq.mainEntity[index].name, item.question);
    assert.equal(faq.mainEntity[index].acceptedAnswer.text, item.answer);
    assert.ok(body.includes(`<dt>${item.question}</dt>`) && body.includes(`<dd>${item.answer}</dd>`));
  }
  const metadata = await page.generateMetadata({ params });
  assert.equal(metadata.alternates.canonical, lib.rankingComparePath);
  assert.equal(metadata.title, '半導体メーカー世界ランキング【2026年10月】時価総額TOP30・日本TOP10');
  assert.equal(guide.status, 'published');
  assert.equal(data.semiconductorMarketCapMeta.dataAsOf, '2026-10-01');
  assert.equal(data.semiconductorMarketCapMeta.retrievedAt, '2026-10-01');

  // The shorter hero and collapsed TOC are limited to this ranking.
  const salary = load('src/content/guides/semiconductor-salary-ranking').semiconductorSalaryRankingGuide;
  const salaryHtml = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: salary.slug }) }));
  assert.ok(!salaryHtml.includes('ranking-article') && !salaryHtml.includes('ranking-toc'));
  assert.ok(salaryHtml.includes('guide-intro-summary') && salaryHtml.includes('aria-label="記事の目次"'));
  assert.ok(salaryHtml.includes(salary.description));
  console.log('PASS: ranking data/selection/URLs/events, SSR order and tables, legacy anchors, FAQ/metadata and other-article layout isolation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
