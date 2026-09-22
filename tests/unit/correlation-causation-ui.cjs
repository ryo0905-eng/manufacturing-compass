const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const base = path.resolve('src');
function moduleLoader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    if (!path.extname(file)) {
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index');
      file += fs.existsSync(file + '.tsx') ? '.tsx' : '.ts';
    }
    if (file.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { exports, require: name => {
      if (name in overrides) return overrides[name];
      if (name === 'next/link') return { __esModule: true, default: props => React.createElement('a', props, props.children) };
      if (name.startsWith('@/')) return load(path.join(base, name.slice(2)));
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name));
      return require(name);
    } }, { filename: file });
    cache.set(file, exports); return exports;
  }
  return load;
}
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function plainText(tree) {
  if (tree == null || typeof tree === 'boolean') return '';
  if (typeof tree !== 'object') return String(tree);
  if (Array.isArray(tree)) return tree.map(plainText).join('');
  return plainText(tree.props?.children);
}
function harness(fail=false) {
 const slots=[],events=[];let cursor=0;
 const react={
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];},
  useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];}
 };
 const element=(type,props)=>({type,props});
 const overrides={react,'react/jsx-runtime':{jsx:element,jsxs:element},'@/lib/analytics':{trackEvent:(...args)=>events.push(args)}};
 if(fail){const actual=moduleLoader()(path.join(base,'lib/correlation-causation/session.ts'));overrides['@/lib/correlation-causation/session']={...actual,transition:(s,a)=>actual.transition(s,a,()=>[])};}
 const Tool=moduleLoader(overrides)(path.join(base,'components/correlation-causation/CorrelationTool.tsx')).CorrelationTool;
 const render=()=>{cursor=0;return Tool();};
 const button=label=>nodes(render(),n=>n.type==='button'&&plainText(n)===label)[0];
 const click=label=>{const b=button(label);assert.ok(b,label);assert.ok(!b.props.disabled,label);b.props.onClick();};
 const choose=(name,index)=>{const input=nodes(render(),n=>n.type==='input'&&n.props.name===name)[index];assert.ok(input);assert.ok(!input.props.disabled);input.props.onChange();};
 const chart=()=>nodes(render(),n=>n.type?.name==='CorrelationChart')[0]?.props;
 return {slots,events,render,button,click,choose,chart};
}
for(const first of [0,1]) {
 const u=harness();assert.equal(u.chart().rows.length,100);assert.equal(u.chart().colored,false);
 assert.equal(u.button('仮説を持って始める').props.disabled,true);
 u.choose('correlation-hypothesis',2);
 const start=u.button('仮説を持って始める');start.props.onClick();start.props.onClick();
 assert.equal(u.events.filter(e=>e[0]==='correlation_started').length,1);
 const snapshot=JSON.stringify(u.slots[0]);
 u.click('製品A');assert.equal(u.chart().filter,'A');assert.equal(u.chart().colored,true);
 u.click('製品B');assert.equal(u.chart().filter,'B');u.click('全体');assert.equal(JSON.stringify(u.slots[0]),snapshot);
 assert.equal(u.events.filter(e=>e[0]==='correlation_stratified').length,1);
 u.click('比較方法を考える');u.choose('correlation-method',first);
 const run=u.button('この方法で40ロットを実験する');run.props.onClick();run.props.onClick();
 assert.equal(u.chart().rows.length,40);assert.equal(Object.keys(u.slots[0].experiments).length,1);
 u.click('1. 気づく');assert.equal(u.chart().rows.length,100);assert.equal(u.chart().filter,'all');assert.equal(u.chart().colored,false);
 u.click('4. 比べ直す');assert.equal(u.chart().rows.length,40);
 u.click('この方法で40ロットを実験する');assert.equal(u.slots[0].stage,4);
 assert.equal(u.events.filter(e=>e[0]==='correlation_comparison_completed').length,1);
 const complete=JSON.stringify(u.slots[0]);
 u.click('従来の製品構成で比較');u.click('製品ごとに温度を無作為に割付');assert.equal(JSON.stringify(u.slots[0]),complete);
 assert.ok(!plainText(u.render()).includes('教材の答えと生成ルールを見る'));
 u.choose('correlation-reflection',first);const reflect=u.button('振り返りを見る');reflect.props.onClick();reflect.props.onClick();
 assert.equal(u.events.filter(e=>e[0]==='correlation_reflected').length,1);
 assert.ok(plainText(u.render()).includes('教材の答えと生成ルールを見る'));
 const link=nodes(u.render(),n=>n.props?.href==='/tools/doe')[0];link.props.onClick();
 for(const [name,props]of u.events){assert.ok(/^correlation_(started|stratified|experiment_completed|comparison_completed|reflected|retried|related_clicked)$/.test(name));assert.ok(Object.keys(props).every(k=>['version','method','destination'].includes(k)));}
 const originals=JSON.stringify(u.slots[0].observation);u.click('同じ教材で再挑戦');assert.equal(u.slots[0].stage,0);assert.equal(u.slots[0].hypothesis,null);assert.equal(Object.keys(u.slots[0].experiments).length,0);assert.equal(JSON.stringify(u.slots[0].observation),originals);
}
const broken=harness(true);broken.choose('correlation-hypothesis',0);broken.click('仮説を持って始める');broken.click('比較方法を考える');broken.click('この方法で40ロットを実験する');assert.ok(plainText(broken.render()).includes('実験と解析を停止'));assert.equal(broken.chart(),undefined);broken.click('同じ教材で再挑戦');assert.equal(broken.slots[0].error,null);
const actual=moduleLoader()(path.join(base,'data/correlation-causation.ts'));
assert.equal(actual.correlationRelease.status,'published');
assert.equal(actual.isCorrelationPublished(),true);
const capture=[];const prior=console.error;console.error=(...args)=>capture.push(args.join(' '));
try {
 for(const published of [false,true]) {
  const load=moduleLoader({'@/lib/analytics':{trackEvent(){}},'@/lib/format':{siteUrl:'https://mfg-compass.com',companyCompareSlug:ids=>ids.join('-')},'@/data/correlation-causation':{...actual,isCorrelationPublished:()=>published}});
  const page=load(path.join(base,'app/(ja)/tools/correlation-causation/page.tsx'));
  assert.equal(page.metadata.robots.index,published);assert.equal(page.metadata.alternates.canonical,actual.correlationRoute);
  const html=renderToStaticMarkup(React.createElement(page.default));
  for(const word of ['相関関係と因果関係の違い','WebApplication','BreadcrumbList','シンプソンのパラドックス','交絡','NIST','JavaScript','個数加重'])assert.ok(html.includes(word),word);
  assert.ok(!html.includes('NaN')&&!html.includes('Infinity'));
  const tools=load(path.join(base,'data/learning-tools.ts')).learningTools;
  assert.equal(tools.some(t=>t.id==='correlation-causation'),published);
  if(published){const item=tools.find(t=>t.id==='correlation-causation');assert.equal(item.badge,'教育用');assert.equal(item.time,'約5分');}
  for(const route of ['doe','process-comparison']){
   const entry=load(path.join(base,`app/(ja)/tools/${route}/page.tsx`)).default;
   // Inspect server JSX without executing unrelated client tools.
   assert.equal(nodes(entry(),n=>n.props?.href===actual.correlationRoute).length,published?1:0);
  }
  const map=load(path.join(base,'app/sitemap.ts')).default();
  const item=map.find(item=>item.url.endsWith(actual.correlationRoute));assert.equal(!!item,published);
  if(item)assert.equal(new Date(item.lastModified).toISOString(),'2026-09-21T15:00:00.000Z');
 }
 const load=moduleLoader({'@/lib/analytics':{trackEvent(){}}});
 const charts=load(path.join(base,'components/correlation-causation/CorrelationChart.tsx'));
 const rows=load(path.join(base,'lib/correlation-causation/model.ts')).generate('randomized');
 const html=renderToStaticMarkup(React.createElement(charts.CorrelationChart,{rows,filter:'all',colored:true,label:'追加実験'}));
 assert.ok(html.includes('<circle')&&html.includes('<rect')&&html.includes('横ずれ'));
 assert.ok(!html.includes('NaN')&&!html.includes('Infinity'));
} finally {console.error=prior;}
assert.equal(capture.length,0,capture.join('\n'));
const css=fs.readFileSync('src/components/correlation-causation/correlation.module.css','utf8');for(const feature of ['focus-visible','max-width:700px','prefers-reduced-motion:reduce'])assert.ok(css.includes(feature));
console.log('correlation-causation-ui: both orders, stale double clicks, navigation, filters, reset, reflection, failure, event privacy, SSR and release-gated links/metadata/sitemap passed (no browser run)');
