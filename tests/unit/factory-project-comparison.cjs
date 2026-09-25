const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(file) {
    const filename = [file, file + '.ts', file + '.tsx', path.join(file, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!filename) throw Error(file);
    if (cache.has(filename)) return cache.get(filename);
    const exports = {}; cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const deps = { '@/lib/analytics': { trackEvent() {} }, 'next/link': { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) }, ...overrides };
    vm.runInNewContext(code, { exports, process, URL, require(id) {
      if (id in deps) return deps[id];
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      if (id.startsWith('@/')) return load('src/' + id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      return require(id);
    }, ...globals }, { filename });
    return exports;
  }
  return load;
}

const load=loader();
const {factoryProjects,factoryProjectSources}=load('src/data/factory-projects');
const {getFactoryProjectPair,factoryProjectComparisonText}=load('src/lib/factory-project-comparison');
assert.equal(factoryProjects.length,5);
assert.equal(new Set(factoryProjects.map(p=>p.id)).size,5);
const companies=load('src/data/companies').companies;
for(const p of factoryProjects){
 assert.match(p.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
 assert.ok(p.actual&&p.planned&&p.note&&p.location);
 for(const n of p.sourceNumbers)assert.ok(factoryProjectSources[n-1]?.url.startsWith('https://'));
 if(p.companySlug)assert.ok(companies.some(c=>c.slug===p.companySlug));
 for(const q of factoryProjects)assert.equal(Boolean(getFactoryProjectPair(p.id,q.id)),p.id!==q.id);
}
for(const ids of [['',''],['unknown','jasm-1'],['jasm-1','jasm-1'],['jasm-1','unknown']])assert.equal(getFactoryProjectPair(...ids),null);
const pair=getFactoryProjectPair('jasm-1','jasm-2');
assert.match(pair[0].actual,/2024/);assert.match(pair[1].planned,/未確認/);
const micron=factoryProjects.find(p=>p.id==='micron-hiroshima-cleanroom');
assert.match(micron.planned,/装置搬入/);assert.match(micron.planned,/量産開始日ではありません/);assert.match(micron.note,/再確認待ち/);
const text=factoryProjectComparisonText(getFactoryProjectPair('rapidus-iim','micron-hiroshima-cleanroom'));
for(const word of ['A：','B：','試作','予定','再確認待ち','確認日：','https://','求人'])assert.ok(text.includes(word),word);
const guide=load('src/content/guides/japan-semiconductor-factory-projects').japanSemiconductorFactoryProjectsGuide;
const blocks=guide.sections.find(s=>s.id==='projects').blocks;
assert.equal(blocks[0].rows.length,5);assert.equal(blocks[1].type,'factory-project-comparison');
const GuideBlocks=load('src/components/guide/GuideBlocks').GuideBlocks;
const html=renderToStaticMarkup(React.createElement(GuideBlocks,{blocks,sourceSlug:guide.slug}));
assert.equal((html.match(/<select(?:\s|>)/g)||[]).length,2);
for(const project of factoryProjects)assert.ok(html.includes(project.name));
assert.ok(html.includes('2案件を比較する'));assert.ok(!html.includes('比較結果：'));
function nodes(tree,predicate){if(!tree||typeof tree!=='object')return[];if(Array.isArray(tree))return tree.flatMap(n=>nodes(n,predicate));return[...(predicate(tree)?[tree]:[]),...nodes(tree.props?.children,predicate)];}
async function ui(blockAnalytics=false){
 let cursor=0,finish;const slots=[],events=[];
 const react={...React,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},useRef(initial){const i=cursor++;return slots[i]??={current:initial};},useEffect(){}};
 const local=loader({react,'@/lib/analytics':{trackEvent(name,props){if(blockAnalytics)throw Error('blocked');events.push({name,props});}}},{navigator:{clipboard:{writeText:()=>new Promise((resolve,reject)=>{finish={resolve,reject};})}}});
 const Component=local('src/components/FactoryProjectComparison').FactoryProjectComparison;
 const render=()=>{cursor=0;return Component();};
 const select=(side,id)=>nodes(render(),n=>n.type==='select')[side].props.onChange({target:{value:id}});
 const submit=()=>nodes(render(),n=>n.type==='form')[0].props.onSubmit({preventDefault(){}});
 const copy=()=>nodes(render(),n=>n.type==='button'&&n.props.onClick)[0].props.onClick();
 assert.equal(events.length,0);submit();assert.equal(nodes(render(),n=>n.type==='textarea').length,0);
 select(0,'jasm-1');select(1,'jasm-1');submit();assert.equal(nodes(render(),n=>n.type==='textarea').length,0);
 select(1,'jasm-2');submit();assert.match(nodes(render(),n=>n.type==='textarea')[0].props.value,/JASM 第2工場/);
 const pending=copy();select(0,'rapidus-iim');finish.reject(Error('denied'));await pending;assert.equal(nodes(render(),n=>n.type==='textarea').length,0);
 submit();const fallback=copy();finish.reject(Error('denied'));await fallback;assert.ok(nodes(render(),n=>n.type==='textarea')[0].props.readOnly);
 const success=copy();finish.resolve();await success;
 if(!blockAnalytics){assert.equal(events.filter(e=>e.props.action==='start').length,1);for(const e of events){assert.equal(e.name,'factory_project_compare');assert.deepEqual(Object.keys(e.props).sort(),['action','source_slug','ui_version']);}}
}
(async()=>{
 await ui();await ui(true);
 const postcss=require('postcss'),pure=require('next/dist/compiled/postcss-modules-local-by-default');
 await postcss([pure({mode:'pure'})]).process(fs.readFileSync('src/components/FactoryProjectComparison.module.css','utf8'),{from:'src/components/FactoryProjectComparison.module.css'});
 console.log('Factory comparison: all pairs, milestones, source mapping, SSR, selection, stale copy, analytics isolation and CSS passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
