// Rebuild the share image from the same sample and calculation as the tool.
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const sharp = require('sharp');
function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => dependencies[name] });
  return exports;
}
const data = load('src/data/measurement-planner.ts');
const lib = load('src/lib/measurement-planner.ts', { '@/data/measurement-planner': data });
const result = lib.calculateMeasurementPlan(data.measurementSample);
const cards = result.alternatives.map((item, i) => {
  if (!item.plan) throw Error('Sample comparison must be calculable');
  const p = item.plan;
  return `<g transform="translate(${48 + i * 376},200)"><rect width="352" height="278" rx="14" fill="${i === 1 ? '#eaf4fa' : '#f5f6f8'}"/><text x="24" y="42" font-size="24">${item.label}</text><text x="24" y="85" font-size="28">±${lib.measurementNumber(p.target)} nm</text><text x="24" y="175" font-size="66" font-weight="700">${p.count}<tspan font-size="28"> 件</tspan></text><text x="24" y="232" font-size="32">${lib.measurementNumber(p.totalSeconds / 60)} 分</text></g>`;
}).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#fff"/><g font-family="Hiragino Sans, Noto Sans CJK JP, sans-serif" fill="#18252f"><text x="48" y="62" font-size="22" fill="#1769aa">Manufacturing Compass ｜ 平均の測定計画</text><text x="48" y="125" font-size="40" font-weight="700">精度を上げると、測定の負担はどう変わる？</text><text x="48" y="171" font-size="24">架空例：標準偏差2 nm・1測定30秒・信頼水準95%</text>${cards}<text x="48" y="525" font-size="23">想定した標準偏差を固定した概算。準備・移動時間は含みません。</text><text x="48" y="566" font-size="21">独立した代表的な測定・平均の正規近似が前提。品質保証ではありません。</text><text x="48" y="605" font-size="18" fill="#52606b">出典：NIST/SEMATECH（平均推定の測定数） ｜ mfg-compass.com</text></g></svg>`;
fs.mkdirSync('public/images', { recursive: true });
sharp(Buffer.from(svg)).png().toFile('public/images/measurement-planner-comparison.png').then(() => console.log('Generated 1200×630 comparison card from current sample.')).catch(error => { console.error(error); process.exitCode = 1; });
