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
    if (!path.extname(file)) file += fs.existsSync(file + '.tsx') ? '.tsx' : '.ts';
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
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},
  useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];}
 };
 const element=(type,props)=>({type,props});
 const overrides={react,'react/jsx-runtime':{jsx:element,jsxs:element},'@/lib/analytics':{trackEvent:(...args)=>events.push(args)}};
 if(fail){const actual=moduleLoader()(path.join(base,'lib/taguchi/session.ts'));overrides['@/lib/taguchi/session']={...actual,advance:(...args)=>actual.advance(...args,()=>{throw Error('injected');})};}
 const Tool=moduleLoader(overrides)(path.join(base,'components/taguchi/TaguchiTool.tsx')).TaguchiTool;
 const render=()=>{cursor=0;return Tool();};
 const button=label=>nodes(render(),n=>n.type==='button'&&plainText(n)===label)[0];
 const click=label=>{const b=button(label);assert.ok(b,label);assert.ok(!b.props.disabled,label);b.props.onClick({detail:1});};
 const chart=()=>nodes(render(),n=>n.type?.name==='TaguchiChart')[0].props;
 return{slots,events,render,button,click,chart};
}
const u=harness();
assert.equal(u.chart().series[0].observations.length,0);
assert.ok(!plainText(u.render()).includes('基準 SN比'));
const first=u.button('通常環境で9条件を実験する');first.props.onClick({detail:2});assert.equal(u.slots[0].observations.length,0);
first.props.onClick({detail:1});first.props.onClick({detail:1});assert.equal(u.slots[0].observations.length,9);
assert.ok(u.chart().series[0].observations.every(o=>o.noise===0));
u.click('この条件を基準に、6回実験する');assert.equal(u.slots[0].observations.length,15);assert.equal(u.slots[0].baseline,'c1');
assert.equal(u.button('400℃').props.disabled,undefined); // Fieldset disables all condition controls here.
assert.equal(nodes(u.render(),n=>n.type==='fieldset')[0].props.disabled,true);
const snapshot=JSON.stringify(u.slots[0]);
const slider=()=>nodes(u.render(),n=>n.type==='input'&&n.props.id==='taguchi-noise')[0];
slider().props.onChange({target:{value:'1'}});assert.equal(u.chart().noise,1);assert.equal(JSON.stringify(u.slots[0]),snapshot);
u.click('残る8条件を48回まとめて実験する');assert.equal(u.slots[0].observations.length,63);
assert.ok(plainText(u.render()).includes('基準 SN比'));assert.equal(u.chart().series.length,2);
u.click('400℃');u.click('60Pa');assert.equal(u.slots[0].baseline,'c1');assert.equal(u.slots[2],'c5');
u.click('SN比が最大の条件を選ぶ');assert.equal(u.slots[2],'c5');
u.click('基準と候補を18回で確認する');assert.equal(u.slots[0].observations.length,81);
assert.equal(u.chart().series[0].observations.length,9);assert.equal(u.chart().series[1].observations.length,9);
assert.ok(u.chart().series.every(s=>s.observations.every(o=>o.phase==='confirmation')));
const completed=JSON.stringify(u.slots[0]);u.click('探索時の実験');assert.equal(u.chart().series[0].observations.length,6);
u.click('新しい確認実験');assert.equal(JSON.stringify(u.slots[0]),completed);
assert.equal(u.button('基準と候補を18回で確認する'),undefined);
u.click('同じシードでやり直す');assert.equal(u.slots[0].observations.length,0);assert.equal(u.chart().series[0].observations.length,0);
for(const label of ['通常環境で9条件を実験する','この条件を基準に、6回実験する','残る8条件を48回まとめて実験する'])u.click(label);
// Baseline itself remains a valid candidate, with two independent confirmation arms.
u.click('基準と候補を18回で確認する');assert.equal(u.slots[0].candidate,'c1');assert.equal(u.slots[0].observations.length,81);
for(const [event,props] of u.events){assert.ok(/^taguchi_(started|stress_completed|candidate_selected|confirmed|retried|related_clicked)$/.test(event));assert.ok(Object.keys(props).every(k=>['version','stage','source','destination'].includes(k)));}
const broken=harness(true);
for(const label of ['通常環境で9条件を実験する','この条件を基準に、6回実験する','残る8条件を48回まとめて実験する'])broken.click(label);
assert.equal(broken.slots[0].observations.length,63);assert.equal(broken.button('基準と候補を18回で確認する').props.disabled,true);
assert.ok(plainText(broken.render()).includes('解析と推奨を停止'));assert.ok(!plainText(broken.render()).includes('基準 SN比'));
broken.click('同じシードでやり直す');assert.equal(broken.slots[0].error,false);
const ssr=moduleLoader({'@/lib/analytics':{trackEvent(){}},'@/lib/format':{siteUrl:'https://mfg-compass.com'}});
const Page=ssr(path.join(base,'app/(ja)/tools/taguchi/page.tsx')).default;
const html=renderToStaticMarkup(React.createElement(Page));
for(const value of ['タグチメソッド体験','WebApplication','BreadcrumbList','望小特性','実験回数を削減していません','−10 log10','実設備の推奨条件ではありません'])assert.ok(html.includes(value),value);
assert.ok(!html.includes('基準 SN比'));
const Charts=ssr(path.join(base,'components/taguchi/TaguchiChart.tsx'));
const graph=renderToStaticMarkup(React.createElement(Charts.TaguchiChart,u.chart()));
assert.ok(!graph.includes('NaN')&&!graph.includes('Infinity'));assert.ok(graph.includes('stroke-dasharray="7 5"'));
for(const series of u.chart().series) for(const level of [-1,0,1]) {
 const rows=series.observations.filter(o=>o.noise===level);
 assert.equal(rows.length,3);
 for(const row of rows)assert.ok(graph.includes(row.value.toFixed(3)));
}
const css=fs.readFileSync('src/components/taguchi/taguchi.module.css','utf8');
assert.ok(css.includes('prefers-reduced-motion:reduce')&&css.includes('focus-visible')&&css.includes('max-width:700px'));
console.log('taguchi-ui: full flow, baseline lock, slider invariance, candidate controls, identical candidate, confirmation, reset, failure, event privacy and SSR passed (no browser run)');
