const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function loader(overrides={},globals={}) {const cache=new Map();function load(stem){const file=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());if(!file)throw Error(stem);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{exports,process,URL,URLSearchParams,...globals,require(id){if(id in overrides)return overrides[id];if(id==='@/lib/analytics')return{trackEvent(){}};if(id==='next/link')return{__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};if(id==='next/navigation')return{usePathname:()=>'/guides/semiconductor-market-cap-ranking',notFound(){throw Error('not found')}};if(id.endsWith('.css'))return{__esModule:true,default:new Proxy({},{get:(_,k)=>k})};if(id.startsWith('@/'))return load('src/'+id.slice(2));if(id.startsWith('.'))return load(path.resolve(path.dirname(file),id));return require(id)}},{filename:file});return exports}return load}
const load=loader(),lib=load('src/lib/ranking-company-compare'),data=load('src/data/semiconductor-market-cap'),map=load('src/data/industry-map'),entry=load('src/lib/industry-map-entry');
const plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(data.worldSemiconductorMarketCapRanking.length,30);assert.equal(data.japanSemiconductorMarketCapRanking.length,18);assert.equal(lib.comparisonCompanies.length,46);
assert.deepEqual(plain(data.worldSemiconductorMarketCapRanking.map(company=>company.rank)),Array.from({length:30},(_,index)=>index+1));
assert.ok(data.worldSemiconductorMarketCapRanking.every((company,index,companies)=>index===0||companies[index-1].marketCapUsdB>=company.marketCapUsdB));
assert.equal(new Set(data.worldSemiconductorMarketCapRanking.map(company=>company.id)).size,30);assert.equal(new Set(data.worldSemiconductorMarketCapRanking.map(company=>company.ticker)).size,30);
assert.deepEqual(plain(data.japanSemiconductorMarketCapRanking.map(company=>company.domesticRank)),Array.from({length:18},(_,index)=>index+1));
assert.ok(data.japanSemiconductorMarketCapRanking.every((company,index,companies)=>index===0||companies[index-1].marketCapUsdB>=company.marketCapUsdB));
assert.equal(new Set(data.japanSemiconductorMarketCapRanking.map(company=>company.id)).size,18);assert.equal(new Set(data.japanSemiconductorMarketCapRanking.map(company=>company.ticker)).size,18);
assert.ok([...data.worldSemiconductorMarketCapRanking,...data.japanSemiconductorMarketCapRanking].every(company=>company.dataAsOf==='2026-10-16'));
for(const id of ['nxp','umc','rorze'])assert.ok(lib.comparisonCompanyById.has(id),id);for(const id of ['astera-labs','coherent'])assert.ok(!lib.comparisonCompanyById.has(id),id);
assert.deepEqual(plain(data.worldSemiconductorMarketCapRanking.slice(8, 10).map(company=>company.id)), ['cxmt', 'intel']);
assert.deepEqual(plain(data.japanSemiconductorMarketCapRanking.slice(2, 4).map(company=>company.id)), ['disco', 'renesas']);
assert.deepEqual(plain(data.worldSemiconductorMarketCapRanking.reduce((counts,company)=>({ ...counts, [company.country]: (counts[company.country] || 0) + 1 }), {})), { 米国: 14, 台湾: 4, 韓国: 2, オランダ: 2, 中国: 4, 英国: 1, 日本: 2, ドイツ: 1 });
// All Japanese issuers from both category pages; values are USD billions.
const additionalJapan = [
  ['maruwa', 103, 3.96, '5344.T'], ['micronics-japan', 110, 3.29, '6871.T'],
  ['tekscend-photomask', 121, 2.15, '429A.T'], ['socionext', 123, 2.11, '6526.T'],
  ['tomen-devices', 131, 1.58, '2737.T'], ['towa', 138, 1.02, '6315.T'],
  ['rs-technologies', 141, 0.91, '3445.T'], ['sanken-electric', 145, 0.75, '6707.T'],
];
assert.deepEqual(plain(data.japanSemiconductorMarketCapRanking.slice(10).map(c => [c.id, c.rank, c.marketCapUsdB, c.ticker])), additionalJapan);
for (const [id, , , ticker] of additionalJapan) {
  const company = lib.comparisonCompanyById.get(id);
  assert.equal(company.isJapanese, true);
  assert.equal(company.sourceUrl, data.semiconductorMarketCapMeta.sourceUrl + '?page=2');
  assert.ok(company.mainBusiness && company.marketCapDisplay && company.ticker === ticker);
  assert.ok(lib.categoryExplanations(company).length > 0);
  assert.deepEqual(plain(lib.addComparisonCompany(['nvidia'], id).ids), ['nvidia', id]);
  const shared = lib.rankingComparisonUrl('https://mfg-compass.com', ['nvidia', id]);
  assert.deepEqual(plain(lib.readRankingComparisonHash(new URL(shared).hash).ids), ['nvidia', id]);
  assert.equal(lib.domesticRank(id), additionalJapan.findIndex(row => row[0] === id) + 11);
}
assert.equal(lib.comparisonCompanyById.get('socionext').companySlug, 'socionext');
assert.equal(lib.comparisonMapId(lib.comparisonCompanyById.get('tomen-devices')), undefined);
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
for(const hash of ['#compare=nvidia','#compare=nvidia,nvidia','#compare=nvidia,unknown','#compare=nvidia,astera-labs','#compare=coherent,maruwa','#compare=nvidia,tsmc,amd','#compare=nvidia,tsmc&compare=amd,tsmc','#compare=__proto__,tsmc'])assert.equal(lib.readRankingComparisonHash(hash).kind,'invalid');
assert.equal(lib.readRankingComparisonHash('#compare=nvidia,nxp').kind, 'pair');
assert.equal(lib.readRankingComparisonHash('#world-ranking').kind,'anchor');const url=lib.rankingComparisonUrl('https://mfg-compass.com',['nvidia','tsmc']);assert.equal(url,'https://mfg-compass.com/guides/semiconductor-market-cap-ranking#compare=nvidia,tsmc');const nvidia=lib.comparisonCompanyById.get('nvidia'),oldRank=nvidia.rank;nvidia.rank=12;assert.equal(lib.readRankingComparisonHash(new URL(url).hash).ids[0],'nvidia');nvidia.rank=oldRank;
assert.equal(entry.readIndustryCompanyHash('#company=nvidia',['nvidia']).id,'nvidia');assert.equal(entry.readIndustryCompanyHash('#company=unknown',['nvidia']).kind,'invalid');assert.equal(entry.readIndustryCompanyHash('#industry-zone-idm',['nvidia']).kind,'anchor');assert.equal(entry.readIndustryCompanyHash('#company=nvidia&company=tsmc',['nvidia','tsmc']).kind,'invalid');
const UI=load('src/components/RankingCompanyCompare'),Table=load('src/components/MarketCapRankingTable').MarketCapRankingTable;
const html=renderToStaticMarkup(React.createElement(UI.RankingCompanyCompareProvider,null,React.createElement(UI.RankingCompanyComparePanel),React.createElement(Table,{scope:'world',sourceSlug:'semiconductor-market-cap-ranking'}),React.createElement(Table,{scope:'japan',sourceSlug:'semiconductor-market-cap-ranking'})));
for(const word of ['気になる2社','NVDA','5.17兆ドル','2026年10月16日','NXP Semiconductors','UMC（聯華電子）','ローツェ','日本18社','/companies/nvidia'])assert.ok(html.includes(word),word);assert.equal((html.match(/data-ranking-compare-id=/g)||[]).length,48);assert.ok(!html.includes('data-ranking-comparison-result'));

// The published Toyota reference matches the ranking's date and currency.
const referenceData = load('src/data/semiconductor-market-cap-reference').toyotaMarketCapReference;
const referenceLib = load('src/lib/market-cap-reference');
assert.equal(referenceData.status, 'verified');
assert.equal(referenceData.marketCapUsdB, 229.21);
assert.equal(referenceData.dataAsOf, data.semiconductorMarketCapMeta.dataAsOf);
assert.equal(referenceData.checkedAt, data.semiconductorMarketCapMeta.retrievedAt);
assert.equal(referenceLib.getMatchingMarketCapReference(referenceData, data.semiconductorMarketCapMeta), referenceData);
assert.equal((html.match(/class="reference"/g) || []).length, 2);
assert.equal((html.match(/class="ratio"/g) || []).length, 50);
for (const text of ['2,292.1億ドル', 'トヨタの約22.6倍', 'トヨタと半導体企業の過去の変化を見る']) assert.ok(html.includes(text), text);
assert.ok(!lib.comparisonCompanyById.has('toyota'));

// Synthetic values only: these fixtures are never production market data.
const verifiedReference = { ...referenceData, status: 'verified', marketCapUsdB: 200 };
assert.equal(referenceLib.getMatchingMarketCapReference(verifiedReference, data.semiconductorMarketCapMeta), verifiedReference);
for (const change of [
  { status: 'pending' }, { dataAsOf: '2025-12-31' }, { dataAsOf: '2026-10-01' },
  { currency: '円' }, { sourceName: 'Another provider' },
  { marketCapUsdB: 0 }, { marketCapUsdB: -1 }, { marketCapUsdB: NaN }, { marketCapUsdB: Infinity },
]) assert.equal(referenceLib.getMatchingMarketCapReference({ ...verifiedReference, ...change }, data.semiconductorMarketCapMeta), undefined);
assert.equal(referenceLib.formatMarketCapUsdB(200), '2,000億ドル');
assert.equal(referenceLib.formatMarketCapUsdB(1250), '1.25兆ドル');

const referenceLinkEvents = [];
function renderReferenceTables(snapshot, sourceSlug = 'semiconductor-market-cap-ranking', rankingData = data) {
  const fixtureLoad = loader({
    '@/data/semiconductor-market-cap-reference': { toyotaMarketCapReference: snapshot },
    '@/data/semiconductor-market-cap': rankingData,
    '@/components/TrackedInternalLink': { TrackedInternalLink: ({ eventName, eventProperties, ...props }) => {
      if (props.href.includes('company=toyota')) referenceLinkEvents.push({ eventName, eventProperties });
      return React.createElement('a', props);
    } },
  });
  const fixtureUI = fixtureLoad('src/components/RankingCompanyCompare');
  const FixtureTable = fixtureLoad('src/components/MarketCapRankingTable').MarketCapRankingTable;
  return renderToStaticMarkup(React.createElement(fixtureUI.RankingCompanyCompareProvider, null,
    ...['world', 'japan'].map(scope => React.createElement(FixtureTable, { key: scope, scope, sourceSlug }))));
}
const withReference = renderReferenceTables(verifiedReference);
assert.deepEqual(plain(referenceLinkEvents), [{ eventName: 'article_internal_click', eventProperties: {
  source_slug: 'semiconductor-market-cap-ranking', destination_path: '/tools/ranking-time-machine#mode=global&year=2025&company=toyota',
} }]);
assert.equal((withReference.match(/class="reference"/g) || []).length, 2);
assert.equal((withReference.match(/class="ratio"/g) || []).length, 50);
assert.equal((withReference.match(/比較基準：1.0倍/g) || []).length, 2);
assert.equal((withReference.match(/data-ranking-compare-id=/g) || []).length, 48);
for (const word of ['世界TOP30の時価総額ランキング', '日本18社の時価総額ランキング',
  'トヨタの約25.9倍', 'トヨタの0.1倍未満', '業界外の比較対象', '2,000億ドル',
  '2026年10月16日基準', '2026.10.17', verifiedReference.sourceUrl, '世界と日本の一覧では尺度が異なります',
  '売上高や従業員数ではありません', '2014〜2025年の年末データ',
  '/tools/ranking-time-machine#mode=global&amp;year=2025&amp;company=toyota']) assert.ok(withReference.includes(word), word);
assert.ok(!withReference.includes('<figure') && !withReference.includes('metric-bar-chart'));
const tableRows = markup => [...markup.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/g)].map(table => [...table[1].matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)].map(row => row[0]));
const isReferenceRow = row => row.includes('class="reference"');
const referencePositions = markup => tableRows(markup).map(rows => rows.findIndex(isReferenceRow));
const allRows = tableRows(withReference);
assert.deepEqual(allRows.map(rows => rows.length), [31, 19]);
assert.ok(!withReference.includes('<tfoot'));
const rankedRows = allRows.map(rows => rows.filter(row => !isReferenceRow(row)));
assert.deepEqual(rankedRows.map(rows => rows.length), [30, 18]);
assert.ok(rankedRows.flat().every(row => !row.includes('トヨタ自動車')));
const referenceRows = allRows.flat().filter(isReferenceRow);
assert.equal(referenceRows.length, 2);
for (const [index, row] of referenceRows.entries()) {
  assert.equal((row.match(/<tr\b/g) || []).length, 1);
  assert.ok(row.includes('<span class="referenceBadge">参考</span>') && row.includes('トヨタ自動車'));
  assert.ok(row.includes('aria-label="参考：トヨタ自動車（順位対象外）"'));
  assert.ok(!row.includes('market-cap-rank') && !row.includes('比較に追加'));
  const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)];
  assert.equal(cells[0][1], '');
  assert.ok(cells[0][0].includes(index === 0 ? 'aria-label="順位対象外"' : 'aria-label="国内順位対象外"'));
  assert.equal(cells.length, 3); // Rank, market cap and reference note, plus the row header.
  assert.ok(row.includes('業界外の比較対象・自動車／日本'));
}
// Published values: Arm, Toyota, KLA in the world table; Toyota precedes Japan #1.
assert.deepEqual(referencePositions(html), [14, 0]);
const publishedRows = tableRows(html);
assert.ok(publishedRows[0][13].includes('Arm') && publishedRows[0][15].includes('KLA'));
assert.ok(publishedRows[1][1].includes('東京エレクトロン'));
const encoded = value => renderToStaticMarkup(React.createElement(React.Fragment, null, value));
const rankingSets = [data.worldSemiconductorMarketCapRanking, data.japanSemiconductorMarketCapRanking];
const originalRankings = plain(rankingSets);
for (const [index, companies] of rankingSets.entries()) {
  const rows = rankedRows[index];
  for (const [rowIndex, company] of companies.entries()) {
    const row = rows[rowIndex];
    for (const field of ['name', 'englishName', 'country', 'ticker', 'category', 'mainBusiness', 'marketCapDisplay']) assert.ok(row.includes(encoded(company[field])), `${index}/${company.id}/${field}`);
    assert.equal((row.match(/scope="row"/g) || []).length, 1);
    assert.equal((row.match(/class="track"/g) || []).length, 1);
    assert.equal((row.match(/data-ranking-compare-id=/g) || []).length, 1);
    if (company.companySlug) assert.ok(row.includes(`href="/companies/${company.companySlug}"`));
    assert.ok(row.includes(index === 0 ? encoded(company.country) : `${company.rank}位`));
    assert.ok(row.includes(`class="market-cap-rank rank">${index === 0 ? company.rank : company.domesticRank}${index === 0 ? '</td>' : '<small>世界' + company.rank + '位</small></td>'}`));
    assert.equal((row.match(/<td\b/g) || []).length, 3);
    assert.ok(!/<details\b|<summary\b|\shidden(?:[\s=>])/.test(row));
    const metadata = row.match(/<dl class="metadata">([\s\S]*?)<\/dl>/)?.[1];
    assert.ok(metadata, `${index}/${company.id}: visible metadata`);
    assert.ok(metadata.indexOf(encoded(company.country)) < metadata.indexOf(encoded(company.category)));
    assert.ok(metadata.indexOf(encoded(company.category)) < metadata.indexOf(encoded(company.ticker)));
    assert.ok(row.includes(`<div class="business"><span class="srOnly">主な事業：</span>${encoded(company.mainBusiness)}</div>`));
    assert.ok(row.indexOf(encoded(company.englishName)) < row.indexOf('<dl class="metadata">'));
  }
}
const legacy = renderReferenceTables(verifiedReference, 'another-guide');
assert.equal((legacy.match(/class="salary-bar-chart metric-bar-chart"/g) || []).length, 2);
assert.ok(!legacy.includes('class="reference"') && !legacy.includes('class="track"') && !legacy.includes('unified'));
for (const change of [{ status: 'pending', marketCapUsdB: null }, { dataAsOf: '2026-10-01' }, { currency: '円' }, { sourceName: 'Another provider' }, { marketCapUsdB: 0 }, { marketCapUsdB: -1 }, { marketCapUsdB: NaN }, { marketCapUsdB: Infinity }]) {
  const hidden = renderReferenceTables({ ...verifiedReference, ...change });
  assert.ok(!hidden.includes('class="reference"') && !hidden.includes('class="ratio"'));
  assert.ok(!hidden.includes('トヨタ自動車') && !hidden.includes('トヨタと半導体企業の過去の変化を見る'));
  assert.equal((hidden.match(/class="track"/g) || []).length, 48);
  assert.deepEqual(tableRows(hidden).map(rows => rows.length), [30, 18]);
}

// The reference is unranked even when largest, smallest, or tied with ranked firms.
for (const [value, expected] of [
  [10000, [0, 0]], [0.1, [30, 18]],
  [data.worldSemiconductorMarketCapRanking[14].marketCapUsdB, [15, 0]],
  [data.japanSemiconductorMarketCapRanking[0].marketCapUsdB, [20, 1]],
]) {
  const markup = renderReferenceTables({ ...verifiedReference, marketCapUsdB: value });
  assert.deepEqual(referencePositions(markup), expected);
  assert.deepEqual(tableRows(markup).map(rows => rows.filter(isReferenceRow).length), [1, 1]);
  assert.equal((markup.match(/data-ranking-compare-id=/g) || []).length, 48);
}
const tieValue = data.worldSemiconductorMarketCapRanking[14].marketCapUsdB;
const tiedWorld = data.worldSemiconductorMarketCapRanking.map(company => company.rank === 16 ? { ...company, marketCapUsdB: tieValue, marketCapDisplay: referenceLib.formatMarketCapUsdB(tieValue) } : company);
assert.deepEqual(referencePositions(renderReferenceTables({ ...verifiedReference, marketCapUsdB: tieValue }, 'semiconductor-market-cap-ranking', {
  ...data, worldSemiconductorMarketCapRanking: Object.freeze(tiedWorld),
})), [16, 0]);

const Metric = load('src/components/MetricBarChart').MetricBarChart;
const metricItem = (label, value) => ({ label, value, category: 'テスト', displayValue: String(value) });
const renderMetric = (items, reference) => renderToStaticMarkup(React.createElement(Metric, {
  eyebrow: 'Test', title: 'Test', note: 'Test', items,
  reference: reference ? { ...reference, comparisonLabel: '基準企業' } : undefined,
}));
const widths = markup => [...markup.matchAll(/style="width:([\d.]+)%"/g)].map(match => Number(match[1]));
// Every company uses a zero-based scale, including when the reference is largest.
for (const reference of [verifiedReference, { ...verifiedReference, marketCapUsdB: 10000 }, { ...verifiedReference, status: 'pending', marketCapUsdB: null }]) {
  const actual = widths(renderReferenceTables(reference));
  const expected = rankingSets.flatMap(companies => {
    const values = companies.map(company => company.marketCapUsdB);
    if (reference.status === 'verified') values.push(reference.marketCapUsdB);
    return values.sort((first, second) => second - first).map(value => value / Math.max(...values) * 100);
  });
  assert.equal(actual.length, expected.length);
  actual.forEach((width, index) => assert.ok(Math.abs(width - expected[index]) < 1e-9));
  assert.ok(actual.every(width => width >= 0 && width <= 100));
}
assert.deepEqual(plain(rankingSets), originalRankings);
assert.deepEqual(widths(renderMetric([metricItem('A', 400), metricItem('B', 10), metricItem('C', 0)], metricItem('参考企業', 200))), [100, 2.5, 0, 50]);
assert.deepEqual(widths(renderMetric([metricItem('A', 50)], metricItem('参考企業', 200))), [25, 100]);
assert.deepEqual(widths(renderMetric([metricItem('A', 0.1)], metricItem('参考企業', 0.2))), [50, 100]);
const rounding = renderMetric([metricItem('A', 250), metricItem('B', 10), metricItem('C', 9.99)], metricItem('参考企業', 200));
for (const text of ['基準企業の約1.3倍', '基準企業の約0.1倍', '基準企業の0.1倍未満']) assert.ok(rounding.includes(text), text);
for (const invalid of [0, -1, NaN, Infinity]) {
  const markup = renderMetric([metricItem('A', 100)], metricItem('参考企業', invalid));
  assert.ok(!markup.includes('metric-bar-chart__reference') && !markup.includes('metric-bar-chart__ratio'));
}
const Salary = load('src/components/SalaryBarChart').SalaryBarChart;
const salaryChart = renderToStaticMarkup(React.createElement(Salary, { title: '年収', unit: '万円', items: [{ label: 'A', value: 1000, category: 'テスト' }] }));
assert.ok(salaryChart.includes('1,000万円'));
assert.deepEqual(widths(salaryChart), [100]);
assert.ok(!salaryChart.includes('metric-bar-chart__reference') && !salaryChart.includes('metric-bar-chart__ratio'));

let cursor=0;const slots=[],events=[];const react={...React,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},useRef(initial){const i=cursor++;return slots[i]??={current:initial}},useEffect(){}};
const interactive=loader({react,'react-dom':{createPortal:children=>children},'@/lib/analytics':{trackEvent:(name,props)=>events.push({name,props})}},{document:{activeElement:null},HTMLElement:class {},window:{location:{hash:'',pathname:lib.rankingComparePath,search:''},history:{replaceState(){}}}})('src/components/RankingCompanyCompare');
function context(){cursor=0;return interactive.RankingCompanyCompareProvider({children:null}).props.value;}
context().add('tokyo-electron','world');context().add('tokyo-electron','japan');assert.equal(context().ids.length,1);context().add('advantest','japan');assert.equal(context().ids.length,2);context().add('nvidia','world');assert.match(context().notice,/2社/);assert.equal(context().shown,false);context().open();assert.equal(context().shown,true);context().close();assert.equal(context().shown,false);assert.equal(context().ids.length,2);context().open();context().record('result_view');context().record('result_view');assert.equal(events.filter(e=>e.props.action==='result_view').length,1);context().remove('advantest');assert.equal(context().shown,false);context().example(['nvidia','tsmc']);assert.equal(context().source,'example');context().record('copy_success');context().record('related_click','industry_map');
context().remove('nvidia');context().remove('tsmc');context().add('socionext','japan');context().add('tomen-devices','japan');assert.deepEqual(plain(context().ids),['socionext','tomen-devices']);assert.equal(context().source,'japan');context().open();assert.equal(context().shown,true);context().record('result_view');assert.ok(events.some(e=>e.props.action==='result_view'&&e.props.company_a==='socionext'&&e.props.company_b==='tomen-devices'));context().close();
for(const e of events){assert.equal(e.name,'ranking_company_compare');assert.ok(Object.keys(e.props).every(k=>['action','source','company_a','company_b','destination'].includes(k)));assert.ok(!JSON.stringify(e).includes('https://'));}
(async () => {
  const page = load('src/app/(ja)/guides/[slug]/page');
  const params = Promise.resolve({ slug: 'semiconductor-market-cap-ranking' });
  const rendered = renderToStaticMarkup(await page.default({ params }));
  const { semiconductorMarketCapRankingGuide: guide, semiconductorMarketCapRankingHero: hero } = load('src/content/guides/semiconductor-market-cap-ranking');
  const body = rendered.slice(rendered.indexOf('<article'));
  const orderedIds = ['world-ranking', 'japan-ranking', 'ranking-compare-title', 'ranking-history', 'ranking-time-machine-preview', 'top-ten'];
  for (let index = 1; index < orderedIds.length; index++) {
    const previous = body.indexOf(`id="${orderedIds[index - 1]}"`);
    const current = body.indexOf(`id="${orderedIds[index]}"`);
    assert.ok(previous >= 0 && current > previous, orderedIds[index]);
  }
  const prefix = body.slice(0, body.indexOf('id="world-ranking"'));
  const heroHtml = body.match(/<header class="article-hero">([\s\S]*?)<\/header>/)[1];
  const textOnly = html => html.replace(/<[^>]+>/g, '');
  const heading = heroHtml.match(/<h1>([\s\S]*?)<\/h1>/)[1];
  assert.equal(textOnly(heading), guide.title);
  assert.ok(heroHtml.includes('<span class="ranking-hero-chunk">半導体メーカー</span><wbr/><span class="ranking-hero-chunk">世界ランキング</span>'));
  const period = guide.title.match(/【[^】]+】/)[0];
  assert.ok(heading.includes(`<span class="ranking-hero-period ranking-hero-chunk">${period}</span>`));
  assert.equal((heading.match(/【[^】]+】/g) || []).length, 1);
  for (const [index, scope] of hero.scopes.entries()) assert.ok(heading.includes(`<span class="ranking-hero-chunk">${index === 0 ? hero.metric : ''}${scope}</span>`));
  assert.ok(!heroHtml.includes('<p class="ranking-hero-scope">'));
  assert.ok(heroHtml.includes(`<p>${hero.conclusion}</p>`));
  assert.equal(hero.conclusion, `世界1位は${data.worldSemiconductorMarketCapRanking[0].name}、日本1位は${data.japanSemiconductorMarketCapRanking[0].name}。`);
  const dateTags = [...heroHtml.matchAll(/<time datetime="([^"]+)">([^<]+)<\/time>/gi)];
  assert.deepEqual(dateTags.map(match => match[1]), [data.semiconductorMarketCapMeta.dataAsOf, guide.updatedAt]);
  assert.deepEqual(dateTags.map(match => match[2]), [data.semiconductorMarketCapMeta.dataAsOf, guide.updatedAt].map(date => date.replaceAll('-', '.')));
  assert.ok(heroHtml.includes(`執筆・確認：${guide.reviewedBy}`));
  for (const removed of ['section-label', guide.readTime, '製造業経験', 'トヨタ', guide.intro.conclusion]) assert.ok(!heroHtml.includes(removed), removed);
  assert.ok(!prefix.includes('guide-intro-summary') && !prefix.includes('guide-experience-basis'));
  assert.match(prefix, /<details class="ranking-toc"><summary>/);
  assert.ok(!/<details[^>]*\sopen[\s=>]/.test(prefix));
  assert.equal((prefix.match(/class="ranking-quick-links"/g) || []).length, 1);
  assert.equal((body.match(/class="market-cap-table"/g) || []).length, 2);
  assert.equal((body.match(/class="salary-bar-chart metric-bar-chart"/g) || []).length, 0);
  assert.equal((body.match(/data-ranking-compare-id=/g) || []).length, 48);
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
  assert.equal((rankingContent.match(/class="track"/g) || []).length, 50);
  assert.equal((rankingContent.match(/<dl class="metadata">/g) || []).length, 48);
  assert.equal((rankingContent.match(/<div class="business">/g) || []).length, 48);
  assert.ok(!rankingContent.includes('企業情報を開く'));
  assert.ok(!rankingContent.includes('link-callout'));
  const tableHeads = [...rankingContent.matchAll(/<thead[^>]*>([\s\S]*?)<\/thead>/g)];
  assert.deepEqual(tableHeads.map(head => (head[1].match(/scope="col"/g) || []).length), [4, 4]);
  assert.ok(!rankingContent.includes('href="/industry-map"') && !rankingContent.includes('industry-map-books'));

  const schemas = [...rendered.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const article = schemas.find(schema => schema['@type'] === 'Article');
  assert.equal(article.dateModified, guide.updatedAt);
  assert.equal(article.headline, guide.title);
  assert.equal(article.description, guide.description);
  assert.equal(schemas.find(schema => schema['@type'] === 'BreadcrumbList').itemListElement.at(-1).name, guide.title);
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
  assert.equal(metadata.title, '半導体メーカー世界ランキング【2026年10月】時価総額TOP30・日本18社');
  assert.equal(metadata.description, guide.description);
  assert.equal(metadata.openGraph.title, guide.title);
  assert.equal(metadata.twitter.title, guide.title);
  assert.equal(guide.status, 'published');
  assert.equal(data.semiconductorMarketCapMeta.dataAsOf, '2026-10-16');
  assert.equal(data.semiconductorMarketCapMeta.retrievedAt, '2026-10-17');
  assert.ok(!guide.description.includes('2026年10月1日'));
  assert.ok(guide.sources.some(source => source.url === referenceData.sourceUrl && source.accessedAt === referenceData.checkedAt));
  for (const company of data.japanSemiconductorMarketCapRanking) assert.ok(guide.sources.some(source => source.url === company.sourceUrl && source.accessedAt === data.semiconductorMarketCapMeta.retrievedAt));
  assert.ok(!body.includes('日本TOP10') && !guide.description.includes('日本TOP10'));
  assert.ok(body.includes('日本の半導体関連企業を網羅した一覧ではありません'));
  const topTenCards = guide.sections.find(section => section.id === 'top-ten').blocks[0].items;
  assert.deepEqual(plain(topTenCards.slice(8).map(card => card.title.split('｜')[0])), ['CXMT', 'Intel']);

  // The shorter hero and collapsed TOC are limited to this ranking.
  const salary = load('src/content/guides/semiconductor-salary-ranking').semiconductorSalaryRankingGuide;
  const salaryHtml = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: salary.slug }) }));
  assert.ok(!salaryHtml.includes('ranking-article') && !salaryHtml.includes('ranking-toc'));
  assert.ok(salaryHtml.includes('guide-intro-summary') && salaryHtml.includes('aria-label="記事の目次"'));
  assert.ok(salaryHtml.includes(salary.description));
  const salaryHero = salaryHtml.match(/<header class="article-hero">([\s\S]*?)<\/header>/)[1];
  assert.ok(salaryHero.includes(`<h1>${salary.title}</h1>`) && salaryHero.includes(salary.readTime));
  assert.ok(salaryHero.includes('section-label') && salaryHero.includes('製造業経験 約10年'));
  assert.ok(!salaryHero.includes('ranking-hero-'));
  console.log('PASS: ranking data/selection/URLs/events, SSR order and tables, legacy anchors, FAQ/metadata and other-article layout isolation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
