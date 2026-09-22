const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const base = path.resolve('src');
function loader(overrides = {}) {
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
    vm.runInNewContext(code, { exports, require(name) {
      if (name in overrides) return overrides[name];
      if (name === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (name.startsWith('@/')) return load(path.join(base, name.slice(2)));
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name));
      return require(name);
    } }, { filename: file });
    cache.set(file, exports); return exports;
  }
  return load;
}
const load = loader();
const data = load(path.join(base, 'data/improvement-confidence.ts'));
const stats = load(path.join(base, 'lib/improvement-confidence/statistics.ts'));
const model = load(path.join(base, 'lib/improvement-confidence/model.ts'));
const session = load(path.join(base, 'lib/improvement-confidence/session.ts'));
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a,b,tol=1e-7) => assert.ok(Math.abs(a-b)<tol, `${a} != ${b}`);
const reference = require('../fixtures/improvement-confidence.json');
for (const {df,value} of reference.quantiles) near(stats.t975(df),value,1e-8);
for (const f of reference.fixtures) {
  const r=stats.analyze(f.before,f.after), e=f.expected;
  near(r.before.mean,e.meanBefore);near(r.after.mean,e.meanAfter);
  near(r.before.variance,e.varianceBefore);near(r.after.variance,e.varianceAfter);
  for(const key of ['df','se','difference','lower','upper']) near(r[key],e[key]);
  const swapped=stats.analyze(f.after,f.before);
  near(swapped.difference,-r.difference);near(swapped.lower,-r.upper);near(swapped.upper,-r.lower);
}
for(const df of [0,-1,NaN,Infinity]) assert.throws(()=>stats.t975(df));
for(const [a,b] of [[[],[1,2]],[[1],[2,3]],[[NaN,1],[2,3]],[[1,Infinity],[2,3]],[[1,1],[2,2]],[[1e308,-1e308],[2,3]]]) assert.throws(()=>stats.analyze(a,b));
const r=stats.analyze([104,108,109,112,107],[104,102,106,108,105]);
assert.match(stats.describe({...r,lower:2,upper:3},2),/線にかかって/);
assert.match(stats.describe({...r,lower:0,upper:3},2),/差ゼロ/);
assert.match(stats.describe({...r,lower:.1,upper:1.9},2),/届いて/);
assert.match(stats.describe({...r,lower:2.1,upper:4},2),/上回って/);
assert.match(stats.describe({...r,lower:-4,upper:-.1},2),/逆/);
const settings={change:1,sd:3,n:100,threshold:2};
const generated=model.generate(settings,'reference');
assert.deepEqual(plain(generated),plain(model.generate(settings,'reference')));
assert.notDeepEqual(plain(generated),plain(model.generate(settings,'other')));
assert.notDeepEqual(generated.before.map(v=>v-108),generated.after.map(v=>v-107));
for(const n of [5,20,100]) assert.deepEqual(plain(model.generate({...settings,n},'reference').before),plain(generated.before.slice(0,n)));
for(const change of data.changes) for(const sd of data.deviations) for(const n of data.sampleSizes) {
 const sample=model.generate({change,sd,n,threshold:2},`combination:${change}:${sd}:${n}`);
 assert.equal(sample.before.length,n);assert.equal(sample.after.length,n);stats.analyze(sample.before,sample.after);
}
assert.throws(()=>model.generate({...settings,n:6},'invalid'));
let state=session.initialSession();const events=[];
const apply=a=>{const out=session.transition(state,a);state=out.state;events.push(...out.events);return out;};
apply({type:'free'});assert.equal(state.mode,'guided');
apply({type:'start'});apply({type:'start'});assert.equal(events.length,1);
for(let index=0;index<3;index++) {
 if(index) apply({type:'case',index});
 const original=JSON.stringify(state.lessons[index].observations);
 apply({type:'size',index:2});assert.equal(state.lessons[index].sizeIndex,0);
 apply({type:'choose',choice:'candidate'});assert.equal(state.lessons[index].choice,undefined);
 apply({type:'size',index:1});apply({type:'size',index:2});apply({type:'size',index:0});apply({type:'size',index:2});
 assert.equal(JSON.stringify(state.lessons[index].observations),original);
 apply({type:'choose',choice:'measure'});apply({type:'reflect'});apply({type:'reflect'});
}
assert.equal(events.filter(e=>e.name==='improvement_case_completed').length,3);
assert.equal(events.filter(e=>e.name==='improvement_guided_completed').length,1);
apply({type:'case',index:0});assert.equal(state.lessons[0].complete,true);apply({type:'free'});
apply({type:'run'});const snapshot=JSON.stringify(state.runs[0]);
apply({type:'setting',settings:{change:4,sd:6,n:5,threshold:3}});assert.equal(JSON.stringify(state.runs[0]),snapshot);
for(let i=1;i<20;i++) apply({type:'run'});
const history=JSON.stringify(state.runs);apply({type:'run'});assert.equal(JSON.stringify(state.runs),history);
assert.equal(events.filter(e=>e.name==='improvement_experiment_run').length,20);
const failed=session.transition(state,{type:'setting',settings:{...settings,n:9}});assert.ok(failed.state.error);assert.equal(JSON.stringify(failed.state.runs),history);
apply({type:'reset'});assert.equal(state.runs.length,0);assert.equal(state.nextRun,21);apply({type:'run'});assert.equal(state.runs[0].number,21);
const failGenerate=session.transition(state,{type:'run'},()=>({before:[],after:[]}));assert.ok(failGenerate.state.error);assert.equal(failGenerate.events.length,0);assert.deepEqual(plain(failGenerate.state.runs),plain(state.runs));
assert.equal(session.transition(failGenerate.state,{type:'run'}).state,failGenerate.state);
console.log('PASS numerical references, bounds, random streams, nested samples, state guards, all cases, history and errors');

function nodes(tree, predicate) {
 if (!tree || typeof tree !== 'object') return [];
 if (Array.isArray(tree)) return tree.flatMap(t=>nodes(t,predicate));
 return [...(predicate(tree)?[tree]:[]),...nodes(tree.props?.children,predicate)];
}
function text(tree) {
 if (tree==null || typeof tree==='boolean') return '';
 if (typeof tree!=='object') return String(tree);
 if(Array.isArray(tree)) return tree.map(text).join('');
 return text(tree.props?.children);
}
function harness(failure=false) {
 const slots=[],events=[];let cursor=0;
 const element=(type,props)=>({type,props});
 const overrides={react:{
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>{slots[i]=v;}];},
  useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];}
 },'react/jsx-runtime':{jsx:element,jsxs:element},'@/lib/analytics':{trackEvent:(name,props)=>events.push({name,props})}};
 if(failure) overrides['@/lib/improvement-confidence/session']={...session,transition:(s,a)=>session.transition(s,a,()=>({before:[],after:[]}))};
 const Tool=loader(overrides)(path.join(base,'components/improvement-confidence/ImprovementTool.tsx')).ImprovementTool;
 const render=()=>{cursor=0;return Tool();};
 const button=label=>nodes(render(),n=>n.type==='button'&&text(n)===label)[0];
 const click=label=>{const b=button(label);assert.ok(b,label);assert.ok(!b.props.disabled,label);b.props.onClick();};
 return {render,button,click,events,slots};
}
const u=harness();assert.doesNotMatch(text(u.render()),/真の平均：/);
const start=u.button('3ケースを体験する');start.props.onClick();start.props.onClick();assert.equal(u.events.length,1);
for(let i=0;i<3;i++) {
 assert.doesNotMatch(text(u.render()),/教材の真の平均：/);
 assert.equal(u.button('100個まで増やす').props.disabled,true);
 u.click('20個まで増やす');u.click('100個まで増やす');
 const choices=nodes(u.render(),n=>n.type==='input'&&n.props.name==='improvement-action');choices[i].props.onChange();
 const reflect=u.button('振り返る');reflect.props.onClick();reflect.props.onClick();
 assert.match(text(u.render()),/教材の真の平均：/);
 if(i<2) u.click('次のケースへ');
}
u.click('自由実験へ');assert.equal(u.events.filter(e=>e.name==='improvement_guided_completed').length,1);
let run=u.button('実験する');run.props.onClick();run.props.onClick();assert.equal(u.events.filter(e=>e.name==='improvement_experiment_run').length,1);
const firstResult=nodes(u.render(),n=>n.type?.name==='Result')[0].props;
const selects=nodes(u.render(),n=>n.type==='select');selects[0].props.onChange({target:{value:'4'}});
const unchanged=nodes(u.render(),n=>n.type?.name==='Result')[0].props;assert.equal(unchanged.result,firstResult.result);
for(let i=1;i<20;i++) u.click('実験する');assert.equal(u.button('実験する').props.disabled,true);
assert.equal(nodes(u.render(),n=>n.type==='li').length,20);u.click('全20回の履歴を消して再開する');u.click('実験する');
assert.match(text(u.render()),/実験21/);
const link=nodes(u.render(),n=>n.props?.href==='/tools/doe')[0];link.props.onClick();
for(const e of u.events) {
 assert.ok(e.name.startsWith('improvement_'));
 assert.ok(Object.keys(e.props).every(k=>['version','mode','case_id','destination'].includes(k)));
}
const bad=harness(true);bad.click('3ケースを体験する');assert.match(text(bad.render()),/計算を停止しました/);assert.equal(bad.events.length,0);
console.log('PASS UI actions, delayed truth, stale double clicks, settings snapshot, history reset, event privacy and errors');

const page=load(path.join(base,'app/(ja)/tools/improvement-confidence/page.tsx'));
const html=renderToStaticMarkup(React.createElement(page.default));
assert.ok(page.metadata.robots.index);assert.equal(page.metadata.alternates.canonical,data.improvementRoute);
for(const term of ['その改善、本当に効いた？','95%信頼区間','WebApplication','BreadcrumbList','出典確認日','3ケースを体験する']) assert.ok(html.includes(term),term);
assert.ok(!html.includes('教材の真の平均：'));
const Result=load(path.join(base,'components/improvement-confidence/Result.tsx')).Result;
const resultHtml=renderToStaticMarkup(React.createElement(Result,{result:r,threshold:2,observations:{before:[104,108,109,112,107],after:[104,102,106,108,105]}}));
assert.ok(resultHtml.includes('role="img"'));assert.ok(resultHtml.includes('<caption>'));assert.ok(resultHtml.includes('変更前'));
const tools=load(path.join(base,'data/learning-tools.ts')).learningTools;
assert.equal(tools.filter(t=>t.id==='improvement-confidence').length,1);
const sitemap=load(path.join(base,'app/sitemap.ts')).default();
const entry=sitemap.find(s=>s.url.endsWith(data.improvementRoute));assert.ok(entry);assert.equal(entry.lastModified.toISOString(),'2026-09-21T15:00:00.000Z');
for(const route of ['process-comparison','correlation-causation','doe']) assert.ok(fs.readFileSync(`src/app/(ja)/tools/${route}/page.tsx`,'utf8').includes(data.improvementRoute));
const css=fs.readFileSync('src/components/improvement-confidence/improvement.module.css','utf8');assert.ok(css.includes(':focus-visible'));assert.ok(css.includes('@media (max-width: 640px)'));
console.log('PASS page/graph SSR, published SEO, sitemap, directory and incoming links (not browser verification)');
