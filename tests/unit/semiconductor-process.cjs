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
  if(name==='./InterconnectDiagram')return{InterconnectDiagram:function InterconnectDiagram(){}};
  if(name==='./AssemblyDiagram')return{AssemblyDiagram:function AssemblyDiagram(){}};
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
const u=harness();u.render();assert.equal(u.scrolls.length,0);u.click('膜に形を作る');
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
for(const e of u.events)assert.ok(Object.keys(e.props).every(k=>['version','experience_id','step_id','question_id','destination'].includes(k)));
u.unmount();assert.equal(u.raf.size,0);assert.equal(Object.keys(u.listeners).length,0);
const low=harness(true);low.render();low.click('膜に形を作る');low.click('表面をきれいにする');assert.equal(low.get().progress,1);assert.equal(low.raf.size,0);
low.click('次の工程 →');assert.equal(low.get().step,1);assert.equal(low.get().progress,1);assert.equal(low.get().playing,false);assert.equal(low.raf.size,0);
assert.equal(low.events.filter(e=>e.name==='semiconductor_process_step_completed'&&e.props.step_id===data.processSteps[1].id).length,1);
low.click('← 前の工程');assert.equal(low.get().progress,0);assert.equal(low.get().playing,false);
const navigation=harness();navigation.render();navigation.click('膜に形を作る');
navigation.click('次の工程 →');navigation.click('次の工程 →');assert.equal(navigation.get().step,2);assert.equal(navigation.raf.size,1);
navigation.tick(0);navigation.tick(2000);assert.equal(navigation.get().step,2);assert.equal(navigation.get().progress,1);assert.equal(navigation.get().playing,false);
navigation.click('← 前の工程');assert.equal(navigation.get().step,1);assert.equal(navigation.get().progress,0);assert.equal(navigation.raf.size,0);
navigation.nodes(n=>n.type==='button'&&n.props.children?.[1]==='露光')[0].props.onClick();navigation.render();assert.equal(navigation.get().step,3);assert.equal(navigation.get().playing,false);navigation.unmount();
const running=harness();running.render();running.click('膜に形を作る');running.click('表面をきれいにする');assert.equal(running.raf.size,1);running.unmount();assert.equal(running.raf.size,0);
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

// Assembly geometry is deterministic, continuous, and preserves connections under resin.
const assemblyData=load(path.join(base,'data/semiconductor-assembly.ts'));
const assemblyModel=load(path.join(base,'lib/semiconductor-process/assembly.ts'));
const assemblyDiagram=load(path.join(base,'components/semiconductor-process/AssemblyDiagram.tsx'));
for(let i=0;i<7;i++){
 const id=assemblyData.assemblySteps[i].id;
 for(const progress of [0,.5,1]){
  const f=assemblyModel.assemblyFrame(id,progress);
  assert.deepEqual(plain(f),plain(assemblyModel.assemblyFrame(id,progress)));
  for(const value of Object.values(f))assert.ok(value>=0&&value<=1);
  for(const inside of [true,false]){
   const html=renderToStaticMarkup(React.createElement(assemblyDiagram.AssemblyDiagram,{step:id,progress,inside}));
   assert.ok(html.includes('role="img"'));assert.ok(html.includes('<desc'));assert.ok(html.includes('★'));assert.ok(!html.includes('NaN'));
  }
 }
 if(i<6)assert.deepEqual(plain(assemblyModel.assemblyFrame(id,1)),plain(assemblyModel.assemblyFrame(assemblyData.assemblySteps[i+1].id,0)));
}
assert.equal(assemblyModel.assemblyFrame('dice',1).tape,1);
assert.equal(assemblyModel.assemblyFrame('attach',1).wire,0);
assert.equal(assemblyModel.assemblyFrame('mold',1).wire,1);
assert.equal(assemblyModel.assemblyFrame('trim-form',1).resin,1);
for(const [id,p] of [['bad',0],['dice',NaN],['wire',-1],['mold',1.1]])assert.throws(()=>assemblyModel.assemblyFrame(id,p));
for(const c of assemblyModel.assemblyConnections){assert.ok(c.terminalX>assemblyModel.assemblyResin.x&&c.terminalX<assemblyModel.assemblyResin.x+assemblyModel.assemblyResin.width);assert.ok(c.path.startsWith(`M${c.padX} 203`));assert.ok(c.path.endsWith(`${c.terminalX} 228`));}
let both=model.initialState();const bothEvents=[];
function advance(a){const r=model.transition(both,a);both=r.state;bothEvents.push(...r.events);}
for(const experience of ['assembly','thin-film','assembly','thin-film']){
 advance({type:'enter',experience});assert.equal(both.step,0);assert.equal(both.progress,0);assert.equal(both.playing,false);
 const steps=experience==='assembly'?assemblyData.assemblySteps:data.processSteps;
 for(let i=0;i<steps.length;i++){advance({type:'step',index:i});advance({type:'scrub',progress:1});}
 advance({type:'question',id:experience==='assembly'?'connection':'protected'});
 advance({type:'summary'});assert.equal(both.view,'summary');
}
for(const experience of ['assembly','thin-film']){
 const e=bothEvents.filter(e=>e.experience_id===experience);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_started').length,1);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_completed').length,1);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_question_opened').length,1);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_step_completed').length,experience==='assembly'?7:8);
}
const assemblyUI=harness();assemblyUI.render();
assemblyUI.nodes(n=>n.type==='button'&&text(n).includes('切り分け・組み立て'))[0].props.onClick();assemblyUI.render();
assemblyUI.click('組み立てを体験する');assert.equal(assemblyUI.get().experience,'assembly');assert.equal(assemblyUI.get().playing,false);
assemblyUI.click('ウエハを支える');assemblyUI.tick(0);assemblyUI.tick(2000);
for(let i=1;i<7;i++){
 assemblyUI.click('次の工程 →');assert.equal(assemblyUI.get().playing,true);assemblyUI.tick(i*3000);assemblyUI.tick(i*3000+2000);assert.equal(assemblyUI.get().step,i);
 if(i===5){assemblyUI.click('中を見る');assert.equal(assemblyUI.nodes(n=>n.type?.name==='AssemblyDiagram')[0].props.inside,true);assemblyUI.click('外観');}
}
assemblyUI.click('組立のまとめへ →');assert.equal(assemblyUI.get().view,'summary');
assemblyUI.click('全体図で最終検査を見る →');assert.equal(assemblyUI.get().overview,5);
assemblyUI.nodes(n=>n.type==='button'&&text(n).includes('素子・配線を作る'))[0].props.onClick();assemblyUI.render();
assemblyUI.click('膜に形を作る');assert.equal(assemblyUI.get().experience,'thin-film');assert.equal(assemblyUI.get().completed.length,0);assert.equal(assemblyUI.get().history.assembly.completed.length,7);
assemblyUI.unmount();
const assemblyPage=renderToStaticMarkup(React.createElement(load(path.join(base,'app/(ja)/tools/semiconductor-process/page.tsx')).default));
for(const phrase of ['組立7工程','小さなチップを','樹脂が透明','https://www.ti.com/lit/pdf/snoa286'])assert.ok(assemblyPage.includes(phrase));
for(const name of ['semiconductor-dicing-process','semiconductor-packaging-process'])assert.ok(fs.readFileSync(`src/content/guides/${name}.ts`,'utf8').includes(data.processRoute));
for(const step of assemblyData.assemblySteps){assert.ok(fs.existsSync(`src/content/guides/${step.guide.split('/').pop()}.ts`));for(const id of step.sourceIds)assert.ok(data.processSources.some(source=>source.id===id));}
console.log('PASS assembly geometry/SSR, seven-step playback, inside view, independent histories/events, restart, static copy and source/entry links');

const wiringData=load(path.join(base,'data/semiconductor-interconnect.ts'));
const wiringModel=load(path.join(base,'lib/semiconductor-process/interconnect.ts'));
const wiringDiagram=load(path.join(base,'components/semiconductor-process/InterconnectDiagram.tsx'));
const definitions=load(path.join(base,'data/semiconductor-experiences.ts')).experiences;
const wf=wiringModel.interconnectFrame;
const wg=wiringModel.wiringGeometry;
const diagramWarnings=[];console.error=(...args)=>diagramWarnings.push(args);
try{
 for(let i=0;i<7;i++){
  const id=wiringData.interconnectSteps[i].id;
  for(const p of [0,.25,.5,.75,1]){
   const f=wf(id,p);assert.deepEqual(plain(f),plain(wf(id,p)));
   for(const v of Object.values(f))assert.ok(Number.isFinite(v)&&v>=0);
   const html=renderToStaticMarkup(React.createElement(wiringDiagram.InterconnectDiagram,{step:id,progress:p,connected:true}));
   for(const term of ['role="img"','<desc','斜線：金属','点：絶縁膜','導電性下地','保護膜'])assert.ok(html.includes(term),term);
   assert.ok(!html.includes('NaN'));
  }
  if(i<6)assert.deepEqual(plain(wf(id,1)),plain(wf(wiringData.interconnectSteps[i+1].id,0)));
 }
}finally{console.error=oldError;}
assert.equal(diagramWarnings.length,0,JSON.stringify(diagramWarnings));
for(const [id,p] of [['bad',0],['cmp',NaN],['cap',Infinity],['liner',-.1],['dielectric',1.1]])assert.throws(()=>wf(id,p));
assert.equal(wg.top+wf('trench-via',1).trenchDepth+wf('trench-via',1).viaDepth,wg.lowerTop);
const filled=wf('fill-metal',1),polished=wf('cmp',1);
assert.equal(filled.fillTop,wg.top);assert.equal(filled.mouthMetal,filled.surfaceLiner);assert.ok(filled.overburden>0);
assert.equal(polished.fillTop,wg.top);assert.equal(polished.overburden,0);assert.equal(polished.surfaceLiner,0);assert.equal(polished.mouthMetal,0);assert.equal(polished.liner,1);
for(const p of [0,.2,.5,.9,1]){const f=wf('cmp',p);assert.equal(f.fillTop,wg.top);assert.equal(f.trenchDepth,45);assert.equal(f.viaDepth,75);assert.equal(f.liner,1);}
const clean=wf('post-cmp-clean',1);assert.equal(clean.residue,0);
const {residue:residueBefore,...beforeClean}=polished;const {residue:residueAfter,...afterClean}=clean;assert.deepEqual(plain(beforeClean),plain(afterClean));
assert.ok(wg.channels[0].x+wg.channels[0].width<wg.channels[1].x);
for(const c of wg.channels){assert.ok(c.viaX>=c.x);assert.ok(c.viaX+c.viaWidth<=c.x+c.width);}
const connectedHtml=renderToStaticMarkup(React.createElement(wiringDiagram.InterconnectDiagram,{step:'cap',progress:1,connected:true}));
assert.ok(connectedHtml.includes('左側の上下がつながる'));assert.ok(connectedHtml.includes('電流の再現ではありません'));
const cmpHtml=renderToStaticMarkup(React.createElement(wiringDiagram.InterconnectDiagram,{step:'cmp',progress:.5}));
for(const term of ['研磨液','パッド','相対運動','化学的な働き'])assert.ok(cmpHtml.includes(term));
let triple=model.initialState();const tripleEvents=[];
const tripleAct=a=>{const r=model.transition(triple,a);triple=r.state;tripleEvents.push(...r.events);};
for(let repeat=0;repeat<2;repeat++)for(const experience of ['thin-film','interconnect','assembly']){
 tripleAct({type:'enter',experience});assert.equal(triple.step,0);assert.equal(triple.progress,0);assert.equal(triple.playing,false);
 tripleAct({type:'motion',reduced:true});
 for(let i=0;i<definitions[experience].steps.length;i++)tripleAct({type:'step',index:i,autoplay:true});
 tripleAct({type:'question',id:definitions[experience].questions[0].id});
 tripleAct({type:'summary'});assert.equal(triple.view,'summary');
}
for(const experience of Object.keys(definitions)){
 const e=tripleEvents.filter(e=>e.experience_id===experience);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_started').length,1);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_step_completed').length,definitions[experience].steps.length);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_completed').length,1);
 assert.equal(e.filter(e=>e.name==='semiconductor_process_question_opened').length,1);
}
const wiringUI=harness();wiringUI.render();wiringUI.click('配線をつくる');assert.equal(wiringUI.get().experience,'interconnect');assert.equal(wiringUI.get().playing,false);
wiringUI.click('絶縁する膜を重ねる');wiringUI.tick(0);wiringUI.tick(600);assert.equal(wiringUI.get().progress,.3);
wiringUI.click('一時停止');wiringUI.tick(1000);assert.equal(wiringUI.get().progress,.3);
wiringUI.click('再開');wiringUI.tick(1200);wiringUI.tick(2600);assert.equal(wiringUI.get().progress,1);
for(let i=1;i<7;i++){wiringUI.click('次の工程 →');assert.equal(wiringUI.get().playing,true);wiringUI.tick(3000*i);wiringUI.tick(3000*i+2000);}
wiringUI.click('つながる部分を見る');assert.equal(wiringUI.nodes(n=>n.type?.name==='InterconnectDiagram')[0].props.connected,true);
wiringUI.click('配線のまとめへ →');assert.equal(wiringUI.get().view,'summary');wiringUI.click('つながる部分を見る');
wiringUI.click('全体図でウエハ検査を見る →');assert.equal(wiringUI.get().overview,3);
wiringUI.nodes(n=>n.type==='button'&&text(n).includes('素子・配線を作る'))[0].props.onClick();wiringUI.render();wiringUI.click('膜に形を作る');assert.equal(wiringUI.get().completed.length,0);assert.equal(wiringUI.get().history.interconnect.completed.length,7);
wiringUI.nodes(n=>n.type==='button'&&n.props.children?.[1]==='加工後の洗浄')[0].props.onClick();wiringUI.render();wiringUI.nodes(n=>n.type==='input')[0].props.onChange({target:{value:'100'}});wiringUI.render();wiringUI.click('繰り返す意味と、その先へ →');wiringUI.click('続けて配線をつくる →');assert.equal(wiringUI.get().progress,0);assert.equal(wiringUI.get().completed.length,7);wiringUI.unmount();
const wiringPage=renderToStaticMarkup(React.createElement(load(path.join(base,'app/(ja)/tools/semiconductor-process/page.tsx')).default));
for(const phrase of ['配線7工程','金属を埋めて、余分な部分を磨く','CMP','lamresearch.com','fujimiinc.co.jp'])assert.ok(wiringPage.includes(phrase));
for(const step of wiringData.interconnectSteps){assert.ok(fs.existsSync(`src/content/guides/${step.guide.split('/').pop()}.ts`));for(const id of step.sourceIds)assert.ok(data.processSources.some(s=>s.id===id));}
for(const name of ['semiconductor-interconnect-process','semiconductor-cmp-process'])assert.ok(fs.readFileSync(`src/content/guides/${name}.ts`,'utf8').includes(data.processRoute));
assert.equal(data.PROCESS_VERSION,'semiconductor-process-v3');
console.log('PASS interconnect geometry, isolation/connection, CMP/clean invariants, SSR, three-experience histories/events, playback, restart, summary handoff and published links');
