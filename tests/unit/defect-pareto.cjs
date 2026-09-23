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
const lib=load('src/lib/defect-pareto');
const data=load('src/data/defect-pareto');
const result=lib.calculatePareto(lib.parsePareto(data.paretoSample));
assert.equal(result.total,100);
assert.deepEqual(Array.from(result.rows,r=>r.count),[40,25,20,10,5]);
assert.deepEqual(Array.from(result.rows,r=>r.cumulative),[.4,.65,.85,.95,1]);
const duplicates=lib.parsePareto('分類,件数\n A ,2\nB,3\nA,1');
assert.equal(duplicates.duplicates.length,1);assert.equal(duplicates.duplicates[0].count,3);assert.equal(duplicates.duplicates[0].occurrences,2);
assert.deepEqual(Array.from(lib.calculatePareto(duplicates).rows,r=>r.label),['A','B'],'Ties keep first occurrence');
assert.equal(lib.parsePareto('\ufeff分類\t件数\r\nA\t1\r\n\r\nB\t2').entries.length,2);
assert.equal(lib.parsePareto('A,B\t2').entries[0].label,'A,B');
for(const invalid of ['', '分類\t件数', 'A,-1','A,1.2','A,1e3','A,0x10','A,NaN','A,1000000001','A,',' ,1','A,1,000','A\t1\t2','A\u0001B,2',`${'a'.repeat(41)},1`,'a'.repeat(12001),Array.from({length:31},(_,i)=>`A${i},1`).join('\n')])assert.throws(()=>lib.parsePareto(invalid),invalid);
const max=lib.calculatePareto(lib.parsePareto(Array.from({length:30},()=>`A,1000000000`).join('\n')));
assert.equal(max.total,30000000000);assert.equal(max.rows[0].cumulative,1);
const zero=lib.calculatePareto(lib.parsePareto('A,0\nB,0'));
assert.equal(zero.total,0);assert.ok(!lib.paretoSvg(zero,false).includes('<polyline'));assert.match(lib.paretoTable(zero),/算出不可/);
const svg=lib.paretoSvg(result,true,true);assert.match(svg,/架空例/);assert.match(svg,/外観異常/);assert.ok(!/NaN|Infinity/.test(svg));
const hostile=lib.calculatePareto(lib.parsePareto('<script>alert(1)<\/script>\t3\n=1+1\t2\n&quote"\t1'));
assert.ok(!lib.paretoSvg(hostile,false,true).includes('<script>'));assert.ok(lib.paretoSvg(hostile,false,true).includes('&lt;script&gt;'));assert.match(lib.paretoTable(hostile),/\t'=1\+1\t/);
assert.match(lib.paretoTable(result,true),/架空例/);

function nodes(tree,predicate){if(!tree||typeof tree!=='object')return[];if(Array.isArray(tree))return tree.flatMap(n=>nodes(n,predicate));return[...(predicate(tree)?[tree]:[]),...nodes(tree.props?.children,predicate)];}
async function ui(){
 let cursor=0,finishCopy;const slots=[],events=[],copies=[],downloads=[],blobs=[],revoked=[];
 const react={...React,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},useRef(initial){const i=cursor++;return slots[i]??={current:initial};},useEffect(){}};
 const journey={inputRef:{current:null},resultRef:{current:null},start(){},calculate(){},sample(){},error(){},clear(){}};
 const local=loader({react,'@/lib/use-practical-tool-journey':{usePracticalToolJourney:()=>journey},'@/lib/analytics':{trackEvent:(name,props)=>events.push({name,props})}}, {
   navigator:{clipboard:{writeText(text){copies.push(text);return new Promise((resolve,reject)=>{finishCopy={resolve,reject};});}}},
   Blob:class{constructor(parts){this.parts=parts;blobs.push(parts.join(''));}},URL:{createObjectURL:()=> 'blob:local',revokeObjectURL:url=>revoked.push(url)},
   document:{body:{appendChild(){}},createElement:()=>({click(){downloads.push(this.download);},remove(){}})},window:{setTimeout:fn=>fn()},
 });
 const Component=local('src/components/DefectPareto').DefectPareto;
 const render=()=>{cursor=0;return Component();};
 const button=label=>nodes(render(),n=>n.props?.children===label&&typeof n.props?.onClick==='function')[0];
 const edit=text=>nodes(render(),n=>n.type==='textarea'&&n.props.id==='pareto-input')[0].props.onChange({target:{value:text}});
 const submit=()=>nodes(render(),n=>n.type==='form')[0].props.onSubmit({preventDefault(){}});
 assert.equal(button('集計表をコピー'),undefined);assert.equal(events.length,0);
 edit('A,2\nA,3');submit();assert.ok(button('確認して合算する'));assert.equal(button('集計表をコピー'),undefined);
 button('合算せず入力を見直す').props.onClick();assert.equal(button('確認して合算する'),undefined);
 submit();button('確認して合算する').props.onClick();assert.ok(button('集計表をコピー'));
 edit('A,2\nA,3');submit();edit('B,4');assert.equal(button('確認して合算する'),undefined);assert.equal(button('集計表をコピー'),undefined);
 submit();button('図を保存（SVG）').props.onClick();assert.equal(downloads[0],'defect-pareto.svg');assert.match(blobs[0],/B：4件/);assert.equal(revoked[0],'blob:local');
 const promise=button('集計表をコピー').props.onClick();edit('C,5');finishCopy.reject(Error('blocked'));await promise;assert.equal(nodes(render(),n=>n.type==='textarea'&&n.props.readOnly).length,0,'Do not resurrect old output after edit');
 button('架空例を試す').props.onClick();const fallback=button('集計表をコピー').props.onClick();finishCopy.reject(Error('blocked'));await fallback;assert.match(nodes(render(),n=>n.type==='textarea'&&n.props.readOnly)[0].props.value,/架空例/);
 const success=button('集計表をコピー').props.onClick();finishCopy.resolve();await success;assert.ok(events.some(e=>e.props.action==='copy_success'));
 edit('A,-1');submit();assert.equal(button('集計表をコピー'),undefined);assert.ok(nodes(render(),n=>n.props?.role==='alert').length);
 button('入力をクリア').props.onClick();assert.equal(nodes(render(),n=>n.type==='textarea')[0].props.value,'');
 for(const e of events){assert.equal(e.name,'pareto_action');assert.ok(Object.keys(e.props).every(k=>['tool_id','action'].includes(k)));}
}
(async()=>{
 await ui();
 const page=load('src/app/(ja)/tools/defect-pareto/page');
 assert.equal(page.metadata.robots.index,true);assert.equal(page.metadata.alternates.canonical,data.defectPareto.route);
 const html=renderToStaticMarkup(React.createElement(page.default));for(const token of ['ASQ','WebApplication','BreadcrumbList','不良率','分類と件数'])assert.ok(html.includes(token),token);
 const tools=load('src/data/learning-tools');assert.equal(tools.learningTools.filter(t=>t.id==='defect-pareto').length,1);assert.equal(tools.toolUsage['defect-pareto'].purpose,'input');
 const routes=load('src/app/sitemap').default();assert.ok(routes.find(r=>r.url.endsWith(data.defectPareto.route))?.lastModified);
 console.log('defect-pareto: calculation, bounds, duplicates, zero, exports, stale UI, privacy and public metadata passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
