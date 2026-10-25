const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');

function load(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports });
  return exports;
}

const lib = load('src/lib/semiconductor-market-cap-growth.ts');
const current = load('src/data/semiconductor-market-cap.ts');
const history = load('src/data/semiconductor-market-cap-history.ts').semiconductorMarketCapHistory;
const chartHistory = load('src/data/semiconductor-market-cap-chart-history.ts').semiconductorMarketCapChartHistory;

assert.equal(lib.subtractCalendarMonths('2026-10-16', 1), '2026-09-16');
assert.equal(lib.subtractCalendarMonths('2024-03-31', 1), '2024-02-29');
assert.equal(lib.subtractCalendarMonths('2026-10-16', 12), '2025-10-16');
assert.equal(lib.daysBetween('2026-09-06', '2026-10-16'), 40);
assert.equal(lib.daysBetween('2026-07-13', '2026-10-16'), 95);

const oneMonth = lib.findMarketCapComparisonSnapshot('2026-10-16', 1, history);
assert.equal(oneMonth.targetDate, '2026-09-16');
assert.equal(oneMonth.snapshot.dataAsOf, '2026-09-06'); // Later 2026-10-01 is beyond the target.
const threeMonths = lib.findMarketCapComparisonSnapshot('2026-10-16', 3, history);
assert.equal(threeMonths.targetDate, '2026-07-16');
assert.equal(threeMonths.snapshot.dataAsOf, '2026-07-13');
const sixMonths = lib.findMarketCapComparisonSnapshot('2026-10-16', 6, history, chartHistory);
const twelveMonths = lib.findMarketCapComparisonSnapshot('2026-10-16', 12, history, chartHistory);
assert.equal(sixMonths.targetDate, '2026-04-16');
assert.equal(sixMonths.snapshot.isChartHistory, true);
assert.equal(sixMonths.snapshot.entries.length, 45);
assert.equal(twelveMonths.targetDate, '2025-10-16');
assert.equal(twelveMonths.snapshot.isChartHistory, true);
assert.equal(twelveMonths.snapshot.entries.length, 44);
assert.equal(lib.findMarketCapComparisonSnapshot('2026-11-16', 6, history, chartHistory).snapshot, undefined);

const allCurrent = new Map([...current.worldSemiconductorMarketCapRanking, ...current.japanSemiconductorMarketCapRanking].map(company => [company.id, company]));
assert.equal(allCurrent.size, 46);
assert.equal(oneMonth.snapshot.entries.length, 37);
assert.equal(threeMonths.snapshot.entries.length, 36);
assert.ok(history.every(snapshot => snapshot.entries.every(entry => Number.isInteger(entry.sourceRank) && entry.sourceRank > 0)));
assert.equal(sixMonths.snapshot.entries.find(entry => entry.companyId === 'nvidia').observedAt, '2026-04-11');
assert.equal(twelveMonths.snapshot.entries.find(entry => entry.companyId === 'micronics-japan').observedAt, '2025-09-30');
assert.ok(chartHistory.every(snapshot => snapshot.entries.every(entry => entry.sourceUrl.startsWith('https://companiesmarketcap.com/'))));

const worldOneMonth = lib.buildMarketCapGrowthRanking(current.worldSemiconductorMarketCapRanking, oneMonth.snapshot, 'rate');
const japanOneMonth = lib.buildMarketCapGrowthRanking(current.japanSemiconductorMarketCapRanking, oneMonth.snapshot, 'rate');
const japanThreeMonths = lib.buildMarketCapGrowthRanking(current.japanSemiconductorMarketCapRanking, threeMonths.snapshot, 'rate');
const worldSixMonths = lib.buildMarketCapGrowthRanking(current.worldSemiconductorMarketCapRanking, sixMonths.snapshot, 'rate');
const japanSixMonths = lib.buildMarketCapGrowthRanking(current.japanSemiconductorMarketCapRanking, sixMonths.snapshot, 'rate');
const japanTwelveMonths = lib.buildMarketCapGrowthRanking(current.japanSemiconductorMarketCapRanking, twelveMonths.snapshot, 'rate');
assert.equal(worldOneMonth.length, 29);
assert.equal(japanOneMonth.length, 10);
assert.equal(japanThreeMonths.length, 10);
assert.equal(worldSixMonths.length, 29);
assert.equal(japanSixMonths.length, 18);
assert.equal(japanTwelveMonths.length, 17);
assert.ok(worldSixMonths.every(row => row.previousDataAsOf && row.previousSourceUrl));
assert.equal(worldSixMonths.find(row => row.company.id === 'nvidia').previousDataAsOf, '2026-04-11');
assert.ok(worldOneMonth.every(row => Number.isFinite(row.changePercent) && Number.isFinite(row.changeUsdB)));
assert.ok(!worldOneMonth.some(row => row.company.ticker === 'UMC'));
assert.ok(lib.buildMarketCapGrowthRanking(current.worldSemiconductorMarketCapRanking, undefined, 'rate').length === 0);

const fixtureCompanies = [
  { id: 'a', name: 'A', ticker: 'A', category: 'Fabless', marketCapUsdB: 120, country: 'US' },
  { id: 'b', name: 'B', ticker: 'B', category: 'IDM', marketCapUsdB: 1100, country: 'US' },
  { id: 'c', name: 'C', ticker: 'C', category: 'Fabless', marketCapUsdB: 150, country: 'JP' },
  { id: 'missing', name: 'Missing', ticker: 'M', category: 'Fabless', marketCapUsdB: 90, country: 'JP' },
];
const fixtureSnapshot = {
  dataAsOf: '2026-09-06', retrievedAt: '2026-09-06', currency: '米ドル', sourceName: 'fixture', sourceUrl: 'https://example.com',
  entries: [
    { companyId: 'a', ticker: 'A', marketCapUsdB: 100, sourceUrl: 'https://example.com' },
    { companyId: 'b', ticker: 'B', marketCapUsdB: 1000, sourceUrl: 'https://example.com' },
    { companyId: 'c', ticker: 'C', marketCapUsdB: 50, sourceUrl: 'https://example.com' },
  ],
};
const byRate = lib.buildMarketCapGrowthRanking(fixtureCompanies, fixtureSnapshot, 'rate');
const byAmount = lib.buildMarketCapGrowthRanking(fixtureCompanies, fixtureSnapshot, 'amount');
assert.equal(byRate.length, 3); // Missing historical values are excluded, not treated as zero.
assert.equal(byRate[0].company.id, 'c');
assert.equal(byRate[0].changePercent, 200);
assert.equal(byRate[0].changeUsdB, 100);
assert.equal(byRate[0].previousMarketCapRank, 3);
assert.equal(byRate[0].currentMarketCapRank, 2);
assert.equal(byRate[0].rankMovement, 1);
assert.equal(byAmount[0].company.id, 'b');
assert.equal(byAmount[0].changeUsdB, 100);
assert.deepEqual(
  Array.from(lib.buildMarketCapGrowthRanking(fixtureCompanies, fixtureSnapshot, 'rate', 'Fabless'), row => row.company.id),
  ['c', 'a'],
);
assert.equal(lib.buildMarketCapGrowthRanking(fixtureCompanies, fixtureSnapshot, 'rate', 'Not a category').length, 0);

console.log('Market cap growth ranking calculations, date selection, chart baselines, missing values, rank movement, and filters passed.');
