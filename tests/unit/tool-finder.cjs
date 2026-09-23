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
const load = loader();
const { finderGoals } = load('src/data/tool-finder');
const { findTool, needsFinderData, selectFinderGoal, selectFinderMode } = load('src/lib/tool-finder');
assert.equal(findTool({}), null);
assert.equal(findTool({goal:'comparison'}), null);
assert.equal(findTool({goal:'comparison',mode:'input'}), null);
let paths = 0;
for (const {id:goal} of finderGoals) {
  for (const mode of ['input','learn']) {
    const choices = needsFinderData({goal,mode}) ? ['measurements','summary','unknown'] : [undefined];
    for (const data of choices) {
      const result = findTool({goal,mode,data}); paths++;
      assert.ok(result?.tool);
      assert.ok(fs.existsSync(`src/app/(ja)${result.tool.href}/page.tsx`));
      assert.ok(result.limit && result.preparation && result.action);
      if (mode === 'input' && ['measurement','stability'].includes(goal)) {
        assert.equal(result.status,'unsupported'); assert.match(result.limit,/対応していません/);
      }
      if (mode === 'input' && goal === 'comparison') {
        assert.equal(result.status,data === 'measurements' ? 'ready' : 'prepare');
      }
      if (mode === 'input' && goal === 'planning') {
        assert.equal(result.status,data === 'summary' ? 'ready' : 'prepare');
      }
      if (mode === 'learn') assert.equal(result.status,'learn');
      if(result.secondary) assert.ok(fs.existsSync(`src/app/(ja)${result.secondary.href}/page.tsx`));
    }
  }
}
assert.equal(paths,16);
assert.equal(findTool({goal:'comparison',mode:'learn'}).tool.id,'improvement-confidence');
assert.match(findTool({goal:'capability',mode:'input',data:'summary'}).preparation,/短期標準偏差/);
assert.equal(findTool(selectFinderGoal('planning')),null);
assert.equal(findTool(selectFinderMode({goal:'comparison',mode:'input',data:'measurements'},'input')),null);

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(n=>nodes(n,predicate));
  return [...(predicate(tree)?[tree]:[]),...nodes(tree.props?.children,predicate)];
}
function mount(failAnalytics=false) {
  let cursor=0; const slots=[],effects=[],events=[],observers=new Map();
  const react={...React,
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],v=>{slots[i]=v;}];},
    useRef(initial){const i=cursor++;return slots[i]??={current:initial};},
    useEffect(fn,deps){const i=cursor++,old=effects[i];if(!old||deps.some((v,j)=>!Object.is(v,old.deps[j]))){old?.cleanup?.();effects[i]={deps,pending:fn};}},
  };
  const local=loader({react,'@/lib/analytics':{trackEvent(name,props){if(failAnalytics)throw Error('blocked');events.push({name,props});}},'@/lib/observe-visible':{observeVisibleOnce(target,callback){observers.set(target,()=>{observers.delete(target);callback();});return()=>observers.delete(target);}}});
  const Component=local('src/components/ToolFinder').ToolFinder;
  const elements={entry:{},result:{}};
  function render(){cursor=0;const tree=Component();for(const n of nodes(tree,n=>n.props?.ref)){n.props.ref.current=n.type==='h2'?elements.entry:elements.result;}for(const effect of effects)if(effect?.pending){effect.cleanup=effect.pending();delete effect.pending;}return tree;}
  function choose(name,value){const input=nodes(render(),n=>n.type==='input'&&n.props.name===name&&n.props.value===value)[0];assert.ok(input,`${name} ${value}`);input.props.onChange();return render();}
  return{render,choose,events,observers,elements};
}
const ui=mount();
assert.equal(nodes(ui.render(),n=>n.type==='fieldset').length,1);
assert.equal(ui.events.length,0,'Mount is not a view');
ui.observers.get(ui.elements.entry)();
ui.choose('finder-goal','comparison');ui.choose('finder-mode','input');
assert.equal(nodes(ui.render(),n=>n.type==='fieldset').length,3);
ui.choose('finder-data','measurements');
assert.equal(ui.events.filter(e=>e.props.step==='result').length,0,'Offscreen result is not a view');
ui.choose('finder-goal','capability');
assert.equal(ui.observers.has(ui.elements.result),false,'Changing the goal cancels the stale observer');
assert.equal(nodes(ui.render(),n=>n.props?.href==='/tools/process-comparison').length,0);
ui.choose('finder-mode','learn');
assert.equal(nodes(ui.render(),n=>n.type==='fieldset').length,2,'Learning skips data question');
ui.observers.get(ui.elements.result)();
const link=nodes(ui.render(),n=>n.props?.href==='/tools/cpk')[0];link.props.onClick();
ui.choose('finder-mode','input');
assert.equal(nodes(ui.render(),n=>n.props?.href==='/tools/cpk').length,0,'Mode change invalidates result');
ui.choose('finder-data','unknown');
assert.equal(ui.observers.has(ui.elements.result),false,'Result exposure only once per mount');
nodes(ui.render(),n=>n.type==='button')[0].props.onClick();
assert.equal(nodes(ui.render(),n=>n.type==='fieldset').length,1);
assert.equal(ui.events.filter(e=>e.props.step==='start').length,1);
assert.equal(ui.events.filter(e=>e.props.step==='result').length,1);
assert.equal(ui.events.filter(e=>e.props.step==='open').length,1);
for(const event of ui.events){assert.equal(event.name,'tool_finder');assert.ok(Object.keys(event.props).every(k=>['step','tool_id','ui_version'].includes(k)));}
const unavailable=mount(true);unavailable.choose('finder-goal','measurement');unavailable.choose('finder-mode','input');assert.ok(nodes(unavailable.render(),n=>n.props?.href==='/tools/gage-rr').length);
const html=renderToStaticMarkup(React.createElement(load('src/components/ToolFinder').ToolFinder));
assert.ok(html.includes('最大3問'));assert.ok(html.includes('NIST'));assert.ok(html.includes('type="radio"'));assert.ok(!html.includes('まずはこちら'));
const hub=fs.readFileSync('src/components/ToolsLearningLab.tsx','utf8');assert.ok(hub.includes('<ToolFinder />'));assert.ok(hub.includes('id="learning-roadmap"'));assert.ok(hub.includes('id="tool-lab"'));
console.log(`tool-finder: ${paths} paths, stale-result transitions, exposure, privacy, analytics failure and SSR passed`);
