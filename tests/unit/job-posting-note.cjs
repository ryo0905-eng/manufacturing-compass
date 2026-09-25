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
const {jobNoteItems,jobNoteStatuses}=load('src/data/job-posting-note');
const {createJobNote,createJobComparison,isJobNoteStatus}=load('src/lib/job-posting-note');
assert.equal(createJobComparison({},{}),null);
assert.equal(createJobComparison({pay:'missing'},{}),null);
assert.equal(createJobComparison({},{pay:'written'}),null);
const pair=createJobComparison({pay:'missing',location:'written'},{pay:'written',hours:'unclear'});
assert.equal(pair.rows.length,8);
assert.equal(pair.rows.find(row=>row.id==='pay').a,'missing');
assert.equal(pair.rows.find(row=>row.id==='pay').b,'written');
assert.deepEqual(Array.from(pair.a.questions,row=>row.id),['pay']);
assert.deepEqual(Array.from(pair.b.questions,row=>row.id),['hours']);
assert.equal(pair.rows.find(row=>row.id==='duties').a,'unread');
assert.match(pair.text,/求人Aに確認すること/);assert.match(pair.text,/求人Bに確認すること/);
assert.match(pair.text,/待遇の差や求人の優劣を示すものではありません/);
const complete=Object.fromEntries(jobNoteItems.map(item=>[item.id,'written']));
assert.equal(createJobComparison(complete,complete).a.questions.length,0);
assert.equal(createJobComparison(complete,complete).b.questions.length,0);
assert.equal(jobNoteItems.length,8);assert.equal(new Set(jobNoteItems.map(i=>i.id)).size,8);
assert.equal(createJobNote({}),null);assert.equal(isJobNoteStatus('invented'),false);
for(const item of jobNoteItems)for(const status of jobNoteStatuses){
 const note=createJobNote({[item.id]:status.id});
 if(status.id==='unread'){assert.equal(note,null);continue;}
 assert.equal(note.reviewed,1);assert.equal(note.unread.length,7);
 assert.equal(note.questions.length,status.id==='written'?0:1);
 if(note.questions.length)assert.ok(note.text.includes(item.question));
 assert.ok(note.text.includes('まだ読んでいない項目'));
}
const allWritten=createJobNote(Object.fromEntries(jobNoteItems.map(i=>[i.id,'written'])));
assert.equal(allWritten.questions.length,0);assert.equal(allWritten.unread.length,0);assert.match(allWritten.text,/条件の確定を意味しません/);
const mixed=createJobNote({duties:'written',requirements:'missing',location:'unclear'});
assert.deepEqual(Array.from(mixed.questions,i=>i.id),['requirements','location']);assert.equal(mixed.unread.length,5);
assert.ok(!mixed.text.includes(jobNoteItems[0].question),'Written items are not questions');

function nodes(tree,predicate){if(!tree||typeof tree!=='object')return[];if(Array.isArray(tree))return tree.flatMap(n=>nodes(n,predicate));return[...(predicate(tree)?[tree]:[]),...nodes(tree.props?.children,predicate)];}
async function ui(failAnalytics=false){
 let cursor=0,finish;const slots=[],effects=[],events=[],observers=new Map();
 const react={...React,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},useRef(initial){const i=cursor++;return slots[i]??={current:initial};},useEffect(fn,deps){const i=cursor++,old=effects[i];if(!old||deps.some((v,j)=>!Object.is(v,old.deps[j]))){old?.cleanup?.();effects[i]={deps,pending:fn};}}};
 const local=loader({react,'@/lib/analytics':{trackEvent(name,props){if(failAnalytics)throw Error('blocked');events.push({name,props});}},'@/lib/observe-visible':{observeVisibleOnce(target,callback){observers.set(target,()=>{observers.delete(target);callback();});return()=>observers.delete(target);}}},{navigator:{clipboard:{writeText:()=>new Promise((resolve,reject)=>{finish={resolve,reject};})}}});
 const Component=local('src/components/JobPostingNote').JobPostingNote;const entry={},result={};
 const render=()=>{cursor=0;const tree=Component();for(const n of nodes(tree,n=>n.props?.ref))n.props.ref.current=n.type==='h3'?result:entry;for(const effect of effects)if(effect?.pending){effect.cleanup=effect.pending();delete effect.pending;}return tree;};
 const button=text=>nodes(render(),n=>n.props?.children===text&&n.props?.onClick)[0];
 const choose=(id,value)=>nodes(render(),n=>n.type==='select'&&n.props.id===`job-note-${id}`)[0].props.onChange({target:{value}});
 const submit=()=>nodes(render(),n=>n.type==='form')[0].props.onSubmit({preventDefault(){}});
 render();assert.equal(events.length,0);observers.get(entry)();
 assert.equal(nodes(render(),n=>n.props?.type==='submit')[0].props.disabled,true);
 choose('duties','missing');submit();render();assert.ok(observers.has(result));
 choose('duties','written');render();assert.ok(!observers.has(result),'Editing cancels unexposed old result');assert.equal(button('確認ノートをコピー'),undefined);
 submit();render();observers.get(result)();
 const pending=button('確認ノートをコピー').props.onClick();choose('duties','unclear');finish.reject(Error('blocked'));await pending;assert.equal(nodes(render(),n=>n.type==='textarea').length,0,'Late clipboard response cannot restore stale note');
 submit();const fallback=button('確認ノートをコピー').props.onClick();finish.reject(Error('blocked'));await fallback;assert.ok(nodes(render(),n=>n.type==='textarea')[0].props.readOnly);
 const success=button('確認ノートをコピー').props.onClick();finish.resolve();await success;
 button('選択をクリア').props.onClick();render();assert.equal(nodes(render(),n=>n.type==='textarea').length,0);assert.ok(nodes(render(),n=>n.type==='select').every(n=>n.props.value==='unread'));
 if(!failAnalytics){for(const step of ['view','start','result'])assert.equal(events.filter(e=>e.props.action===step).length,1);for(const e of events){assert.equal(e.name,'job_posting_note');assert.deepEqual(Object.keys(e.props).sort(),['action','ui_version']);}}
 button('2件を並べて確認').props.onClick();render();observers.get(entry)();
 assert.equal(nodes(render(),n=>n.type==='select').length,16);
 choose('pay','missing');assert.equal(nodes(render(),n=>n.props?.type==='submit')[0].props.disabled,true);
 choose('b-pay','written');submit();render();observers.get(result)();
 assert.match(nodes(render(),n=>n.type==='textarea')[0].props.value,/求人票2件/);
 const oldCopy=button('確認ノートをコピー').props.onClick();button('1件を確認').props.onClick();finish.reject(Error('blocked'));await oldCopy;
 assert.equal(nodes(render(),n=>n.type==='textarea').length,0);
 assert.equal(nodes(render(),n=>n.type==='select'&&n.props.id==='job-note-pay')[0].props.value,'missing');
 button('2件を並べて確認').props.onClick();
 assert.equal(nodes(render(),n=>n.type==='select'&&n.props.id==='job-note-b-pay')[0].props.value,'written');
 button('選択をクリア').props.onClick();assert.ok(nodes(render(),n=>n.type==='select').every(n=>n.props.value==='unread'));
 if(!failAnalytics){const comparisonEvents=events.filter(e=>e.name==='job_posting_comparison');for(const step of ['view','start','result'])assert.equal(comparisonEvents.filter(e=>e.props.action===step).length,1);for(const e of comparisonEvents)assert.deepEqual(Object.keys(e.props).sort(),['action','ui_version']);}
}
(async()=>{
 await ui();await ui(true);
 const Component=load('src/components/JobPostingNote').JobPostingNote;
 const html=renderToStaticMarkup(React.createElement(Component));assert.equal((html.match(/<select /g)||[]).length,8);assert.ok(!html.includes('<textarea'));assert.ok(html.includes('保存されず'));
 const page=load('src/app/(ja)/career-consultation/page');assert.equal(page.metadata.alternates.canonical,'/career-consultation');
 const pageHtml=renderToStaticMarkup(React.createElement(page.default));for(const value of ['job-posting-note','consultation-template-title','WebApplication','ハローワーク'])assert.ok(pageHtml.includes(value),value);
 const sitemap=load('src/app/sitemap').default();assert.equal(sitemap.filter(r=>r.url.endsWith('/career-consultation')).length,1);assert.ok(sitemap.find(r=>r.url.endsWith('/career-consultation')).lastModified);assert.ok(!sitemap.some(r=>r.url.includes('#job-posting-note')));
 const postcss=require('postcss'),pure=require('next/dist/compiled/postcss-modules-local-by-default');
 await postcss([pure({mode:'pure'})]).process(fs.readFileSync('src/components/JobPostingNote.module.css','utf8'),{from:'src/components/JobPostingNote.module.css'});
 console.log('Job note: status separation, partial/all-written notes, stale copy, exposure, privacy, SSR, sitemap and CSS compilation passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
