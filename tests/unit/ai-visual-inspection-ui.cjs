const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve('src');
function loader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    if (file.endsWith('.js')) file = file.slice(0,-3);
    if (!path.extname(file)) file += fs.existsSync(file+'.tsx') ? '.tsx' : '.ts';
    if (file.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { exports, Uint8Array, Float32Array, Float64Array, Int32Array, AbortController, structuredClone, setTimeout: overrides.timer || setTimeout, clearTimeout: overrides.clearTimer || clearTimeout,
      require: name => {
        if (name in overrides) return overrides[name];
        if (name === 'next/link') return { __esModule: true, default: props => React.createElement('a', props, props.children) };
        if (name.startsWith('@/')) return load(path.join(root,name.slice(2)));
        if (name.startsWith('.')) return load(path.resolve(path.dirname(file),name));
        return require(name);
      }
    }, { filename: file });
    cache.set(file,exports); return exports;
  }
  return load;
}
const nodes = (tree,predicate) => !tree || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(n=>nodes(n,predicate)) : [...(predicate(tree)?[tree]:[]),...nodes(tree.props?.children,predicate)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : Array.isArray(tree) ? tree.map(text).join('') : text(tree.props?.children);
function samples(mode) {
  const base = `public/ai-visual-inspection/v2/lesson/${mode}`;
  const pixels = new Uint8Array(fs.readFileSync(`${base}.pixels`)), masks = new Uint8Array(fs.readFileSync(`${base}.masks`));
  return JSON.parse(fs.readFileSync(`${base}.json`)).images.map((row,i)=>({...row,image:{width:128,height:128,pixels:pixels.slice(i*16384,(i+1)*16384)},truth:masks.slice(i*16384,(i+1)*16384)}));
}
(async () => {
  const slots=[], effects=[], timers=new Map(), calls=[], events=[]; let cursor=0, dirty=true, tree, timerId=0;
  const equal=(a,b)=>a && b && a.length===b.length && a.every((v,i)=>Object.is(v,b[i]));
  const react={
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],value=>{const next=typeof value==='function'?value(slots[i]):value;if(!Object.is(next,slots[i])){slots[i]=next;dirty=true;}}];},
    useRef(initial){const i=cursor++;return slots[i]??=( {current:initial} );},
    useMemo(fn,deps){const i=cursor++;if(!slots[i]||!equal(slots[i].deps,deps))slots[i]={deps,value:fn()};return slots[i].value;},
    useEffect(fn,deps){const i=cursor++;if(!slots[i]||!equal(slots[i].deps,deps)){const old=slots[i];slots[i]={deps};effects.push(()=>{old?.cleanup?.();slots[i].cleanup=fn();});}}
  };
  const element=(type,props)=>({type,props});
  const load=loader({react,'react/jsx-runtime':{jsx:element,jsxs:element},'@/lib/analytics':{trackEvent:(...args)=>events.push(args)},'@/lib/ai-visual-inspection/lesson':{loadLesson:async mode=>samples(mode)},'@/lib/ai-visual-inspection/client':{InspectionClient:class{dispose(){} inspect(input){return new Promise((resolve,reject)=>calls.push({input,resolve,reject}));}}},timer:fn=>{timers.set(++timerId,fn);return timerId;},clearTimer:id=>timers.delete(id)});
  const Tool=load(path.join(root,'components/ai-visual-inspection/InspectionLab.tsx')).InspectionLab;
  async function flush(){for(let i=0;i<15;i++){if(dirty){dirty=false;cursor=0;tree=Tool();}effects.splice(0).forEach(fn=>fn());const jobs=[...timers.values()];timers.clear();jobs.forEach(fn=>fn());await new Promise(setImmediate);if(!dirty&&!effects.length&&!timers.size)return;}throw Error('Render loop');}
  async function click(label){const button=nodes(tree,n=>n.type==='button'&&text(n)===label)[0];assert.ok(button,label);assert.ok(!button.props.disabled,label);button.props.onClick();await flush();}
  const counts=title=>nodes(tree,n=>n.type?.name==='Counts'&&n.props.title===title)[0].props;
  const processing=loader()(path.join(root,'lib/ai-visual-inspection/processing.ts'));
  async function finish(call){call.resolve({results:call.input.images.map(image=>({image,rule:processing.inspectRule(image,call.input.settings.rule),ai:processing.inspectRule(image,call.input.settings.rule),scores:new Float32Array(16384)}))});await flush();}
  await flush();assert.equal(calls.length,0);
  await click('約5分の体験を始める');assert.equal(calls.length,1);assert.ok(counts('AI').decisions.every(v=>v===null));
  assert.ok(calls[0].input.images.every(image=>!('truth' in image)&&!('defective' in image)));
  await finish(calls[0]);assert.ok(counts('AI').decisions.every(v=>typeof v==='boolean'));
  // Changing a real control clears old AI counts synchronously, before the worker reply.
  const control=nodes(tree,n=>n.type?.name==='Control')[0];control.props.onChange(200);await flush();assert.ok(counts('AI').decisions.every(v=>v===null));
  const old=calls.at(-1);control.props.onChange(180);await flush();const latest=calls.at(-1);
  await finish(old);assert.ok(counts('AI').decisions.every(v=>v===null));
  latest.reject(new Error('injected'));await flush();assert.ok(text(tree).includes('AIは未評価'));assert.ok(counts('AI').decisions.every(v=>v===null));
  await click('AIを再試行');await finish(calls.at(-1));
  await click('5. 採用方法を考える');await finish(calls.at(-1));
  await click('設定を固定して、別の24枚を開く');assert.ok(text(tree).includes('確認済み'));assert.ok(counts('AI').decisions.every(v=>v===null));await finish(calls.at(-1));
  assert.equal(counts('AI').truth.length,24);assert.equal(nodes(tree,n=>n.type==='fieldset')[0].props.disabled,true);
  await click('練習を最初から（確認済みは保持）');await finish(calls.at(-1));await click('5. 採用方法を考える');await finish(calls.at(-1));
  assert.ok(text(tree).includes('確認済み24枚を再評価'));assert.ok(!text(tree).includes('設定を固定して、別の24枚を開く'));
  assert.ok(events.every(([,props])=>Object.keys(props).every(key=>['lesson_version','category'].includes(key))));
  const ssr=loader({'@/lib/analytics':{trackEvent(){}},'@/lib/format':{siteUrl:'https://mfg-compass.com'}});
  const page=ssr(path.join(root,'app/(ja)/tools/ai-visual-inspection/page.tsx'));
  const html=renderToStaticMarkup(React.createElement(page.default));
  assert.ok(html.includes('WebApplication')&&html.includes('BreadcrumbList')&&html.includes('体験を始める'));
  assert.equal(page.metadata.robots.index,false);
  console.log('UI: lazy start, pending/error counts, stale result rejection, confirmation locking, retry history, analytics categories and SSR passed (no browser)');
})().catch(error=>{console.error(error);process.exitCode=1;});
