const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(stem) {
    const file = [stem, `${stem}.ts`, `${stem}.tsx`, path.join(stem, 'index.ts')]
      .find(name => fs.existsSync(name) && fs.statSync(name).isFile());
    if (!file) throw Error(stem);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(code, { exports, process, ...globals, require(id) {
      if (id in overrides) return overrides[id];
      if (id === '@/lib/analytics') return { trackCareerCompassEvent() {}, trackEvent() {} };
      if (id === 'next/image') return { __esModule: true, default: ({ fill, sizes, ...props }) => React.createElement('img', props) };
      if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (id === 'next/navigation') return { usePathname: () => '/career-compass' };
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      if (id.startsWith('@/')) return load('src/' + id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
      return require(id);
    } }, { filename: file });
    return exports;
  }
  return load;
}

const load = loader();
const { rankingPurposes, rankingPurposeContext } = load('src/data/ranking-purpose');
const Entry = load('src/components/guide/RankingPurposeEntry').RankingPurposeEntry;
const entry = Entry();
const children = React.Children.toArray(entry.props.children);
const chooserElement = children.find(child => child.type?.name === 'RankingPurposeChooser');
const panels = chooserElement.props.panels;
const html = renderToStaticMarkup(React.createElement(Entry));
assert.equal((html.match(/aria-pressed="false"/g) || []).length, 4);
assert.ok(html.includes('<noscript>') && html.includes('hidden=""'));
assert.ok(!html.includes('px.a8.net') && !html.includes('af.moshimo.com/af/c/click'));
for (const purpose of rankingPurposes) {
  const panel = renderToStaticMarkup(panels[purpose.id]);
  for (const link of purpose.links) {
    assert.ok(panel.includes(`href="${link.href}"`), link.id);
    assert.ok(html.includes(`href="${link.href}"`), 'No-JS fallback: '+link.id);
    if (link.href.startsWith('/')) {
      const pathname = link.href.split('#')[0];
      if (pathname.startsWith('/guides/')) assert.ok(fs.existsSync('src/content/guides/'+pathname.split('/').at(-1)+'.ts'));
      else assert.ok(fs.existsSync('src/app/(ja)'+pathname+'/page.tsx'), pathname);
    }
  }
}
const career = renderToStaticMarkup(panels.career);
assert.ok(career.indexOf('メーカーズジョブ') < career.indexOf('JAC Recruitment'));
assert.ok(career.indexOf('JAC Recruitment') < career.indexOf('半導体Jobエージェント'));
assert.equal((career.match(/広告・アフィリエイトリンク/g)||[]).length, 3);
for (const removed of ['登録前に確認', '説明の出典', '確認日']) assert.ok(!career.includes(removed), removed);
assert.equal((career.match(/並び順はおすすめ順位ではありません/g)||[]).length, 1);
assert.ok(career.includes('求人紹介・転職成功を保証するものではありません'));
assert.equal(rankingPurposeContext.ui_version, 'purpose-v2');
assert.deepEqual(Array.from(rankingPurposes, p => p.id), ['investment', 'career', 'learning', 'research']);
assert.equal((html.match(/loading="lazy"/g)||[]).length, 4);
for (const purpose of rankingPurposes) {
  assert.ok(html.includes(`src="${purpose.image}"`));
  assert.ok(html.includes(purpose.description));
  assert.ok(fs.existsSync('public' + purpose.image), purpose.image);
}
for (const agent of load('src/data/ranking-career-affiliates').rankingCareerAffiliates) {
  assert.ok(agent.sourceUrl.startsWith('https://') && agent.checkedAt && agent.check, 'Keep source records');
}
const agents = load('src/data/affiliateLinks').affiliateAgents;
assert.equal(agents.length, 5);
assert.ok(!agents.some(a => ['makers-job','semiconductor-job'].includes(a.id)));

function harness({ supported = true, fail = false } = {}) {
  const events = [], slots = [], effects = [], observers = [], listeners = new Map();
  let cursor = 0;
  const document = { hidden: false, addEventListener:(n,h)=>listeners.set(n,h), removeEventListener:n=>listeners.delete(n), getElementById:()=>null };
  class Observer {
    constructor(callback, options) { this.callback=callback; this.options=options; observers.push(this); }
    observe() {} unobserve() {} disconnect() { this.disconnected=true; }
  }
  const mock = loader({ react: { ...React,
    useState(initial) { const i=cursor++; if (!(i in slots)) slots[i]=initial; return [slots[i],v=>slots[i]=v]; },
    useRef(initial) { const i=cursor++; return slots[i] ??= {current:initial}; },
    useEffect(effect) { effects.push(effect); },
  }, '@/lib/analytics': {trackEvent(name,props) { if(fail) throw Error('blocked'); events.push({name,props}); }} },
    {document,...(supported?{IntersectionObserver:Observer}:{})});
  const api=mock('src/components/guide/RankingPurposeChooser');
  return { events, effects, observers, document, listeners, mock, ...api,
    render() { cursor=0; const tree=api.RankingPurposeChooser({panels}); tree.props.children[0].props.ref.current={}; return tree; }
  };
}
const h=harness();
let tree=h.render();
const cleanup=h.effects[0]();
assert.equal(h.observers[0].options.threshold, .25);
const expose=(observer,ratio)=>observer.callback([{isIntersecting:ratio>0,intersectionRatio:ratio}]);
h.document.hidden=true; expose(h.observers[0],1); assert.equal(h.events.length,0);
h.document.hidden=false; h.listeners.get('visibilitychange')(); expose(h.observers[0],.24); assert.equal(h.events.length,0);
expose(h.observers[0],.25); expose(h.observers[0],1); assert.equal(h.events.length,1);
cleanup(); h.render(); h.effects.at(-1)(); assert.equal(h.observers.length,1,'Strict replay does not recount viewed component');
for(const purpose of rankingPurposes) {
  const button=tree.props.children[0].props.children.find(b=>b.props.id==='ranking-purpose-'+purpose.id);
  assert.equal(button.props.type,'button');
  button.props.onClick(); button.props.onClick();
  tree=h.render();
  assert.equal(tree.props.children[2].props.hidden,false);
  assert.equal(tree.props.children[2].props.children,panels[purpose.id]);
  assert.equal(tree.props.children[0].props.children.filter(b=>b.props['aria-pressed']).length,1);
  for(const link of purpose.links) {
    const node=h.RankingPurposeLink({purpose:purpose.id,destination:link.id,href:link.href,children:link.label});
    let prevented=false;
    node.props.onClick({button:0,preventDefault(){prevented=true;}});
    assert.equal(prevented,false);
    assert.equal(h.events.at(-1).props.destination_id,link.id);
  }
}
assert.equal(h.events.filter(e=>e.props.action==='select').length,4);
for(const e of h.events) { assert.equal(e.name,'ranking_purpose'); for(const [k,v] of Object.entries(rankingPurposeContext)) assert.equal(e.props[k],v); }
const unsupported=harness({supported:false}); unsupported.render(); unsupported.effects[0](); assert.equal(unsupported.events.length,0);
const replay=harness(); replay.render(); replay.effects[0]()(); replay.render(); replay.effects.at(-1)(); expose(replay.observers[0],1); assert.equal(replay.events.length,0); expose(replay.observers[1],1); assert.equal(replay.events.length,1);
const failed=harness({fail:true});
assert.doesNotThrow(()=>{const t=failed.render(); failed.effects[0](); expose(failed.observers[0],1); t.props.children[0].props.children[1].props.onClick();});
assert.equal(failed.render().props.children[2].props.children,panels.career);
assert.doesNotThrow(()=>failed.RankingPurposeLink({purpose:'career',destination:'career_compass',href:'/career-compass',children:'link'}).props.onClick({}));
const creative=h.mock('src/components/TrackedAffiliateCreative').TrackedAffiliateCreative;
const anchor={};
const click={target:{closest:()=>anchor},currentTarget:{contains:()=>true},preventDefault(){throw Error('navigation blocked');}};
creative({agentId:'jac-recruitment',html:'original'}).props.onClick(click);
assert.equal(h.events.at(-1).name,'affiliate_outbound_click');
assert.equal(h.events.at(-1).props.source_page,'career_agents');
assert.equal(h.events.at(-1).props.cta_location,'affiliate_creative');
for(const agent of load('src/data/ranking-career-affiliates').rankingCareerAffiliates) {
  creative({agentId:agent.id,html:agent.creativeHtml,sourcePage:rankingPurposeContext.source_page,ctaLocation:rankingPurposeContext.cta_location,readerPurpose:'career',uiVersion:rankingPurposeContext.ui_version}).props.onClick(click);
  assert.equal(h.events.at(-1).props.agent_id,agent.id);
  assert.equal(h.events.at(-1).props.reader_purpose,'career');
  assert.equal(h.events.at(-1).props.ui_version,rankingPurposeContext.ui_version);
}
assert.doesNotThrow(()=>failed.mock('src/components/TrackedAffiliateCreative').TrackedAffiliateCreative({agentId:'test',html:'original'}).props.onClick(click));
console.log('PASS: four purposes, SSR/no-JS links, deferred ads, foreground exposure, replay/cleanup, duplicate selection, fixed events, legacy affiliate defaults and analytics failure isolation');
