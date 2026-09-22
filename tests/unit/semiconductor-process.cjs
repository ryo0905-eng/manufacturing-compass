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
const load=loader();
const data=load(path.join(base,'data/semiconductor-process.ts'));
const model=load(path.join(base,'lib/semiconductor-process/model.ts'));
const plain=v=>JSON.parse(JSON.stringify(v));
const frame=model.frame;
for(let step=0;step<8;step++) for(const p of [0,.25,.5,.75,1]) {
 const f=frame(step,p);
 assert.deepEqual(plain(f.substrate),{x:40,y:256,width:500,height:72});
 assert.equal(f.regions.reduce((a,r)=>a+r.width,0),500);
 for(const r of f.regions) {assert.ok(r.filmHeight>=0&&r.filmHeight<=52);assert.ok(r.resistHeight>=0&&r.resistHeight<=34);}
 assert.deepEqual(plain(f),plain(frame(step,p)));
}
for(let step=0;step<7;step++) {
 const a=frame(step,1),b=frame(step+1,0);
 for(const key of ['regions','substrate','dirt','residue','exposed']) assert.deepEqual(plain(a[key]),plain(b[key]),`continuity ${step}: ${key}`);
}
assert.equal(frame(0,0).dirt,1);assert.equal(frame(0,1).dirt,0);
assert.ok(frame(1,.5).regions.every(r=>r.filmHeight===26));
assert.ok(frame(2,.5).regions.every(r=>r.resistHeight===17));
assert.deepEqual(plain(frame(3,0).regions),plain(frame(3,1).regions));
assert.equal(frame(3,1).exposed,1);
assert.ok(frame(4,.5).regions.filter(r=>r.opening).every(r=>r.resistHeight===17&&r.filmHeight===52));
assert.ok(frame(4,1).regions.filter(r=>r.opening).every(r=>r.resistHeight===0&&r.filmHeight===52));
assert.ok(frame(5,.5).regions.filter(r=>r.opening).every(r=>r.filmHeight===26));
assert.ok(frame(5,1).regions.filter(r=>!r.opening).every(r=>r.filmHeight===52&&r.resistHeight===34));
assert.ok(frame(6,1).regions.every(r=>r.resistHeight===0));
assert.deepEqual(plain(frame(7,0).regions),plain(frame(7,1).regions));
assert.equal(frame(7,1).residue,0);
for(const [s,p] of [[-1,0],[8,0],[1,NaN],[1,1.1],[.5,0]]) assert.throws(()=>frame(s,p));
let state=model.initialState(),events=[];
const act=a=>{const r=model.transition(state,a);state=r.state;events.push(...r.events);};
act({type:'enter'});act({type:'enter'});assert.equal(events.length,1);
act({type:'play'});const token=state.token;act({type:'play'});assert.equal(state.token,token);
act({type:'tick',token,progress:.4});assert.equal(state.progress,.4);
act({type:'pause'});act({type:'tick',token,progress:.9});assert.equal(state.progress,.4);
act({type:'play'});assert.equal(state.progress,.4);act({type:'scrub',progress:.2});assert.equal(state.playing,false);
act({type:'step',index:5});assert.equal(state.progress,0);act({type:'tick',token,progress:1});assert.equal(state.progress,0);
act({type:'motion',reduced:true});act({type:'play'});assert.equal(state.progress,1);assert.equal(state.playing,false);
act({type:'replay'});assert.equal(events.filter(e=>e.name==='semiconductor_process_step_completed').length,1);
act({type:'question',id:'protected'});act({type:'question',id:'protected'});act({type:'question',id:'bad'});assert.equal(events.filter(e=>e.name==='semiconductor_process_question_opened').length,1);
for(let i=0;i<8;i++){act({type:'step',index:i});act({type:'scrub',progress:1});act({type:'scrub',progress:0});act({type:'scrub',progress:1});}
assert.equal(events.filter(e=>e.name==='semiconductor_process_step_completed').length,8);
assert.equal(events.filter(e=>e.name==='semiconductor_process_completed').length,1);
act({type:'summary'});assert.equal(state.view,'summary');act({type:'overview',index:4});assert.equal(state.view,'overview');assert.equal(state.playing,false);
console.log('PASS frame endpoints/midpoints/continuity, substrate and protection, exposure vs development, state controls, stale frames and event deduplication');

function nodes(tree,pred){if(!tree||typeof tree!=='object')return[];if(Array.isArray(tree))return tree.flatMap(t=>nodes(t,pred));return[...(pred(tree)?[tree]:[]),...nodes(tree.props?.children,pred)];}
function text(tree){if(tree==null||typeof tree==='boolean')return'';if(typeof tree!=='object')return String(tree);if(Array.isArray(tree))return tree.map(text).join('');return text(tree.props?.children);}
function harness(reduced=false){
 const slots=[],pending=[],events=[],scrolls=[],raf=new Map(),listeners={},mediaListeners={};let cursor=0,nextRaf=1,observerCallback;
 const doc={hidden:false,addEventListener:(n,f)=>{listeners[n]=f;},removeEventListener:n=>{delete listeners[n];}};
 const media={matches:reduced,addEventListener:(n,f)=>{mediaListeners[n]=f;},removeEventListener:n=>{delete mediaListeners[n];}};
 const windowMock={matchMedia:()=>media,addEventListener:(n,f)=>{listeners[n]=f;},removeEventListener:n=>{delete listeners[n];}};
 const react={
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},
  useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
  useCallback(fn,deps){const i=cursor++;if(!(i in slots))slots[i]=fn;return slots[i];},
  useEffect(fn,deps){const i=cursor++;const old=slots[i];if(!old||deps.some((d,j)=>d!==old.deps[j]))pending.push(()=>{old?.cleanup?.();slots[i]={deps,cleanup:fn()};});}
 };
 const code=ts.transpileModule(fs.readFileSync('src/components/semiconductor-process/ProcessExplorer.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const exports={};
 const element=(type,props)=>({type,props});
 vm.runInNewContext(code,{exports,window:windowMock,document:doc,IntersectionObserver:class{constructor(cb){observerCallback=cb;}observe(){}disconnect(){observerCallback=undefined;}},requestAnimationFrame:fn=>{const id=nextRaf++;raf.set(id,fn);return id;},cancelAnimationFrame:id=>raf.delete(id),require(name){
  if(name==='react')return react;
  if(name==='react/jsx-runtime')return{jsx:element,jsxs:element};
  if(name==='next/link')return{default:'a'};
  if(name==='@/lib/analytics')return{trackEvent:(name,props)=>events.push({name,props})};
  if(name.endsWith('.css'))return{default:new Proxy({},{get:(_,k)=>String(k)})};
  if(name==='./ProcessDiagram')return{ProcessDiagram:function ProcessDiagram(){},Wafer:function Wafer(){},JourneyDiagram:function JourneyDiagram(){},CompletedStructure:function CompletedStructure(){}};
  if(name.startsWith('@/'))return load(path.join(base,name.slice(2)));
  throw Error(name);
 }});
 function render(){cursor=0;const tree=exports.ProcessExplorer();for(const node of nodes(tree,n=>n.props?.ref))node.props.ref.current={focus(){},scrollIntoView(options){scrolls.push(options);}};while(pending.length)pending.shift()();return tree;}
 const button=label=>nodes(render(),n=>n.type==='button'&&text(n)===label)[0];
 const click=label=>{const b=button(label);assert.ok(b,label);assert.ok(!b.props.disabled,label);b.props.onClick();render();};
 function tick(time){const callbacks=[...raf.values()];raf.clear();callbacks.forEach(fn=>fn(time));render();}
 const get=()=>slots[1].current;
 return{render,button,click,tick,get,events,scrolls,raf,doc,media,listeners,mediaListeners,hide:()=>observerCallback([{isIntersecting:false}]),unmount:()=>{for(const s of slots)if(s&&s.cleanup)s.cleanup();},nodes:pred=>nodes(render(),pred)};
}
const u=harness();u.render();assert.equal(u.scrolls.length,0);u.click('一つの加工を拡大してみる ↗');
assert.equal(u.get().view,'process');assert.equal(u.scrolls.length,1);assert.equal(u.scrolls[0].block,'start');
assert.equal(u.nodes(n=>n.type==='nav'&&n.props['aria-label']==='完成までの6地点').length,0);
u.click('表面をきれいにする');u.tick(0);u.tick(800);assert.equal(u.get().progress,.4);
u.click('一時停止');assert.equal(u.raf.size,0);u.tick(1600);assert.equal(u.get().progress,.4);
u.click('再開');u.tick(2000);u.tick(3200);assert.equal(u.get().progress,1);assert.equal(u.raf.size,0);
u.click('次の工程 →');assert.equal(u.get().progress,0);assert.equal(u.get().playing,true);u.tick(4000);u.tick(4500);
const stale=[...u.raf.values()][0];u.click('次の工程 →');stale(6000);assert.equal(u.get().step,2);assert.equal(u.get().progress,0);assert.equal(u.scrolls.length,1);
assert.equal(u.get().playing,true);assert.equal(u.raf.size,1);u.tick(6500);u.doc.hidden=true;u.listeners.visibilitychange();u.render();assert.equal(u.get().playing,false);u.doc.hidden=false;u.listeners.visibilitychange();assert.equal(u.get().playing,false);
u.click('光に反応する膜を塗る');u.tick(7000);u.hide();u.render();assert.equal(u.get().playing,false);
u.click('光に反応する膜を塗る');u.tick(8000);u.listeners.pagehide();u.render();assert.equal(u.get().playing,false);
u.click('光に反応する膜を塗る');u.tick(9000);u.media.matches=true;u.mediaListeners.change();u.render();assert.equal(u.get().progress,1);assert.equal(u.get().playing,false);
const slider=u.nodes(n=>n.type==='input'&&n.props.type==='range')[0];slider.props.onChange({target:{value:'30'}});u.render();assert.equal(u.get().progress,.3);assert.equal(u.get().playing,false);
u.click('再開');assert.equal(u.get().progress,1);
u.click('なぜここだけ削れる？＋');u.click('なぜここだけ削れる？−');u.click('なぜここだけ削れる？＋');assert.equal(u.events.filter(e=>e.name==='semiconductor_process_question_opened').length,1);
for(const e of u.events)assert.ok(Object.keys(e.props).every(k=>['version','step_id','question_id','destination'].includes(k)));
u.unmount();assert.equal(u.raf.size,0);assert.equal(Object.keys(u.listeners).length,0);
const low=harness(true);low.render();low.click('一つの加工を拡大してみる ↗');low.click('表面をきれいにする');assert.equal(low.get().progress,1);assert.equal(low.raf.size,0);
low.click('次の工程 →');assert.equal(low.get().step,1);assert.equal(low.get().progress,1);assert.equal(low.get().playing,false);assert.equal(low.raf.size,0);
assert.equal(low.events.filter(e=>e.name==='semiconductor_process_step_completed'&&e.props.step_id===data.processSteps[1].id).length,1);
low.click('← 前の工程');assert.equal(low.get().progress,0);assert.equal(low.get().playing,false);
const navigation=harness();navigation.render();navigation.click('一つの加工を拡大してみる ↗');
navigation.click('次の工程 →');navigation.click('次の工程 →');assert.equal(navigation.get().step,2);assert.equal(navigation.raf.size,1);
navigation.tick(0);navigation.tick(2000);assert.equal(navigation.get().step,2);assert.equal(navigation.get().progress,1);assert.equal(navigation.get().playing,false);
navigation.click('← 前の工程');assert.equal(navigation.get().step,1);assert.equal(navigation.get().progress,0);assert.equal(navigation.raf.size,0);
navigation.nodes(n=>n.type==='button'&&n.props.children?.[1]==='露光')[0].props.onClick();navigation.render();assert.equal(navigation.get().step,3);assert.equal(navigation.get().playing,false);navigation.unmount();
const running=harness();running.render();running.click('一つの加工を拡大してみる ↗');running.click('表面をきれいにする');assert.equal(running.raf.size,1);running.unmount();assert.equal(running.raf.size,0);
console.log('PASS simulated RAF timing, pause/resume, stage cancellation, slider, visibility/pagehide/offscreen stop, reduced motion and unmount cleanup (not browser verification)');
const diagrams=load(path.join(base,'components/semiconductor-process/ProcessDiagram.tsx'));
const warnings=[];const oldError=console.error;console.error=(...args)=>warnings.push(args);
try{
 for(let i=0;i<8;i++)for(const p of [0,.5,1]){const html=renderToStaticMarkup(React.createElement(diagrams.ProcessDiagram,{step:i,progress:p}));assert.ok(html.includes('role="img"'));assert.ok(html.includes('<title'));assert.ok(!html.includes('NaN'));assert.ok(html.includes('シリコン'));}
 const a=renderToStaticMarkup(React.createElement(diagrams.ProcessDiagram,{step:3,progress:1}));assert.ok(a.includes('マスク'));assert.ok(a.includes('光学系'));assert.ok(a.includes('まだ穴は開いていません'));
 for(let i=0;i<6;i++)assert.ok(renderToStaticMarkup(React.createElement(diagrams.JourneyDiagram,{index:i})).includes('<svg'));
 const page=load(path.join(base,'app/(ja)/tools/semiconductor-process/page.tsx'));
 const html=renderToStaticMarkup(React.createElement(page.default));
 for(const term of ['この丸い板が','8工程の役割','WebApplication','BreadcrumbList','出典確認日','まだ穴は開いていません','動かす体験にはJavaScript'])assert.ok(html.includes(term),term);
 assert.equal(page.metadata.alternates.canonical,data.processRoute);assert.equal(page.metadata.robots.index,true);
}finally{console.error=oldError;}
assert.equal(warnings.length,0,JSON.stringify(warnings));
const tools=load(path.join(base,'data/learning-tools.ts')).learningTools;assert.equal(tools.filter(t=>t.id==='semiconductor-process').length,1);
const sitemap=load(path.join(base,'app/sitemap.ts')).default();const item=sitemap.find(s=>s.url.endsWith(data.processRoute));assert.ok(item);assert.equal(item.lastModified.toISOString(),'2026-09-21T15:00:00.000Z');
const guide=load(path.join(base,'content/guides/semiconductor-manufacturing-process.ts')).semiconductorManufacturingProcessGuide;assert.ok(JSON.stringify(guide.overviewBlocks).includes(data.processRoute));
for(const filename of ['src/app/(ja)/rankings/page.tsx','src/app/(ja)/rankings/[slug]/page.tsx','src/app/(ja)/industry-map/page.tsx'])assert.ok(fs.readFileSync(filename,'utf8').includes(data.processRoute));
for(const step of data.processSteps){assert.ok(fs.existsSync(`src/content/guides/${step.guide.split('/').pop()}.ts`));for(const id of step.sourceIds)assert.ok(data.processSources.some(s=>s.id===id));}
const css=fs.readFileSync('src/components/semiconductor-process/process.module.css','utf8');assert.ok(css.includes(':focus-visible'));assert.ok(css.includes('min-height: 44px'));assert.ok(css.includes('@media'));
console.log('PASS diagram/page SSR with no React warnings, technical wording, source/guide references, static content, SEO, sitemap and incoming links');
