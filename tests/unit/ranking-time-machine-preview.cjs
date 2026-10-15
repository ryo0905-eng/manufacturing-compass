const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');

function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(stem) {
    const file = [stem, `${stem}.ts`, `${stem}.tsx`].map(p => path.resolve(root, p)).find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!file) throw Error(stem);
    if (cache.has(file)) return cache.get(file);
    const exports = {}; cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(code, { exports, URLSearchParams, process: { env: { NODE_ENV: 'test' } }, ...globals, require(id) {
      if (id in overrides) return overrides[id];
      if (id === '@/lib/analytics') return { trackEvent() {} };
      if (id === 'next/link') return { __esModule: true, default: props => React.createElement('a', props) };
      if (id === 'next/image') return { __esModule: true, default: ({ unoptimized, ...props }) => React.createElement('img', props) };
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      if (id.startsWith('@/')) return load(`src/${id.slice(2)}`);
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
      return require(id);
    } }, { filename: file });
    return exports;
  }
  return load;
}

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
const plain = value => JSON.parse(JSON.stringify(value));
const load = loader();
const data = load('src/data/ranking-time-machine');
const lib = load('src/lib/ranking-time-machine');
const full = load('src/lib/ranking-comparison').createComparisonTimelines(data.rankingTimeMachineCompanies, data.rankingTimeMachineSnapshots).semiconductor.timeline;
const modulePath = 'src/components/ranking-time-machine/RankingTimeMachinePreview';
const { RankingTimeMachinePreview } = load(modulePath);

// Full, interactive-free initial content exists without a browser or hydration.
const html = renderToStaticMarkup(React.createElement(RankingTimeMachinePreview));
assert.match(html, /id="ranking-time-machine-preview"/);
assert.match(html, /NVIDIAの順位はどう変わった？ 2010年から動かして見る/);
assert.match(html, /現在の世界TOP30とは対象が異なり/);
assert.match(html, /2010〜2025年/);
assert.match(html, /2010年末のNVIDIA/);
assert.match(html, /上位10社圏外/);
assert.match(html, /8\.94十億米ドル/);
assert.match(html, /データ確認日/);
assert.match(html, new RegExp(data.rankingTimeMachineMetadata.checkedAt));
assert.match(html, /id="ranking-inline-year"/);
assert.match(html, /aria-describedby="ranking-inline-playback-help"/);
assert.match(html, /loading="lazy"/);
assert.equal((html.match(/data-visible="true"/g) || []).length, 10);
assert.equal((html.match(/<button/g) || []).length, 2, 'Only playback and reset are buttons');
assert.ok(!html.includes('aria-controls="ranking-company-detail"'));
assert.ok(!html.includes('詳細を見る'));
assert.ok(!html.includes('企業を選ぶと'));
assert.ok(!html.includes('role="group"'));
assert.match(html, /mode=semiconductor&amp;year=2010&amp;company=nvidia/);
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size);

// An image failure renders the actual company name; surrounding rows name it accessibly.
const logoLoad = loader({ react: { ...React, useState: () => ['/broken.png', () => {}] } });
const logo = logoLoad('src/components/ranking-time-machine/CompanyLogo').CompanyLogo;
assert.match(renderToStaticMarkup(React.createElement(logo, { src: '/broken.png', name: 'NVIDIA', loading: 'lazy' })), /NVIDIA/);

function controller(withObserver = true) {
  const slots = [], effects = [], events = [], visible = new Map(), timers = new Map(), listeners = new Map(), observers = [];
  let cursor = 0, timerId = 0;
  const document = { hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const window = {
    setTimeout: (fn, ms) => { assert.equal(ms, 3000); timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id),
  };
  // Accessing any browser URL/history API is a failure: article anchors belong to other features.
  Object.defineProperty(window, 'location', { get() { throw Error('Preview accessed the article URL'); } });
  Object.defineProperty(window, 'history', { get() { throw Error('Preview changed the article URL'); } });
  const hooks = { ...React,
    useMemo(fn) { cursor++; return fn(); },
    useRef(initial) { const slot = cursor++; return slots[slot] ??= { current: initial }; },
    useReducer(reducer, initial) { const slot = cursor++; if (!(slot in slots)) slots[slot] = initial; return [slots[slot], action => { slots[slot] = reducer(slots[slot], action); }]; },
    useEffect(fn, deps) { const slot = cursor++, old = effects[slot]; if (!old || deps.some((dep, i) => !Object.is(dep, old.deps[i]))) { old?.cleanup?.(); effects[slot] = { deps, pending: fn }; } },
  };
  class Observer {
    constructor(callback) { this.callback = callback; this.connected = true; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.connected = false; }
  }
  const uiLoad = loader({ react: hooks, '@/lib/analytics': { trackEvent: (name, props) => events.push([name, props]) },
    '@/lib/observe-visible': { observeVisibleOnce(target, callback) { visible.set(target, () => { visible.delete(target); callback(); }); return () => visible.delete(target); } },
  }, { window, document, ...(withObserver ? { IntersectionObserver: Observer } : {}) });
  const Preview = uiLoad(modulePath).RankingTimeMachinePreview;
  function render() {
    cursor = 0; const tree = Preview();
    for (const node of nodes(tree, node => node.props?.ref)) node.props.ref.current ??= {};
    for (const effect of effects) if (effect?.pending) { effect.cleanup = effect.pending(); delete effect.pending; }
    return tree;
  }
  const child = name => nodes(render(), node => node.type?.name === name)[0].props;
  const controls = () => child('TimelineControls');
  const chart = () => child('RankingRaceChart');
  function tick() { const [id, fn] = timers.entries().next().value; timers.delete(id); fn(); render(); }
  const counts = step => events.filter(([name, p]) => step === 'view' ? name === 'experience_view' : p.step === step).length;
  const cleanup = () => effects.forEach(effect => effect?.cleanup?.());
  return { render, controls, chart, child, tick, counts, events, visible, timers, listeners, observers, document, cleanup };
}

const ui = controller();
assert.equal(ui.controls().index, 0);
assert.equal(ui.controls().playing, false);
assert.equal(ui.timers.size, 0);
assert.equal(ui.events.length, 0);
ui.controls().onPause(); ui.controls().onReset(); ui.controls().onYear(0); ui.render();
assert.equal(ui.events.length, 0, 'Unchanged initial state is not use');
assert.equal(ui.visible.size, 1);
[...ui.visible.values()][0]();
assert.equal(ui.counts('view'), 1);
ui.controls().onPlay(); ui.render();
assert.equal(ui.counts('start'), 1);
assert.equal(ui.counts('result'), 0);
assert.equal(ui.visible.size, 0, 'Play before the year changes is not a result');
ui.tick();
assert.equal(ui.chart().year, 2011);
assert.equal(ui.counts('result'), 0, 'Changed but unseen chart is not a result');
assert.equal(ui.visible.size, 1);
[...ui.visible.values()][0]();
assert.equal(ui.counts('result'), 1);
ui.controls().onPause(); ui.render(); assert.equal(ui.timers.size, 0);

// Same canonical cohort, ordering, ranks and values for every available year.
for (let index = 0; index < full.length; index++) {
  ui.controls().onYear(index); ui.render();
  assert.deepEqual(plain(ui.chart().rows), plain(full[index].rows));
  assert.equal(ui.chart().year, full[index].year);
  const link = ui.child('TrackedInternalLink');
  assert.equal(link.href, `/tools/ranking-time-machine#mode=semiconductor&year=${full[index].year}&company=nvidia`);
  assert.equal(link.eventName, 'ranking_timemachine_entry_click');
  assert.equal(link.eventProperties.placement, 'inline_open_full');
}
ui.controls().onYear(14); ui.render(); ui.controls().onPlay(); ui.render();
ui.tick(); assert.equal(ui.chart().year, 2025); assert.equal(ui.controls().playing, true);
ui.tick(); assert.equal(ui.controls().playing, false); assert.equal(ui.timers.size, 0);
ui.controls().onPlay(); ui.render(); assert.equal(ui.chart().year, 2010);
ui.controls().onReset(); ui.render(); assert.equal(ui.controls().playing, false);
ui.controls().onYear(5); ui.render(); assert.equal(ui.controls().playing, false);
ui.controls().onReset(); ui.render(); assert.equal(ui.chart().year, 2010);
assert.equal(ui.counts('start'), 1); assert.equal(ui.counts('result'), 1);

ui.controls().onPlay(); ui.render();
const observer = ui.observers[0];
observer.callback([{ target: observer.target, isIntersecting: false }]); ui.render();
assert.equal(ui.controls().playing, false); assert.equal(ui.timers.size, 0);
observer.callback([{ target: observer.target, isIntersecting: true }]); ui.render();
assert.equal(ui.controls().playing, false, 'Returning to the page does not resume');
ui.controls().onPlay(); ui.render(); ui.document.hidden = true; ui.listeners.get('visibilitychange')(); ui.render();
assert.equal(ui.controls().playing, false); assert.equal(ui.timers.size, 0);
ui.document.hidden = false; ui.listeners.get('visibilitychange')(); ui.render();
assert.equal(ui.controls().playing, false);
for (const [name, properties] of ui.events) {
  assert.ok(['experience_view', 'tool_step'].includes(name));
  assert.equal(properties.surface, 'article_inline'); assert.equal(properties.ui_version, 'inline-v1');
  assert.equal(properties.source_slug, 'semiconductor-market-cap-ranking');
  assert.equal(properties.placement, 'world_ranking_after_table');
}
ui.controls().onPlay(); ui.render(); ui.cleanup();
assert.equal(ui.listeners.size, 0); assert.equal(ui.timers.size, 0); assert.equal(ui.visible.size, 0);
assert.equal(observer.connected, false);

// A chart that returns to its initial year cancels the pending result observation.
const pending = controller(); pending.controls().onYear(2); pending.render();
assert.equal(pending.visible.size, 2);
pending.controls().onReset(); pending.render(); assert.equal(pending.visible.size, 1);
assert.equal(pending.counts('result'), 0); pending.cleanup();
const fallback = controller(false); fallback.controls().onPlay(); fallback.render();
fallback.document.hidden = true; fallback.tick();
assert.equal(fallback.controls().playing, false); fallback.cleanup();

const guide = load('src/content/guides/semiconductor-market-cap-ranking').semiconductorMarketCapRankingGuide;
const blocks = guide.sections.find(section => section.id === 'world-ranking').blocks;
assert.equal(blocks[0].type, 'market-cap-ranking');
assert.equal(blocks[1].type, 'ranking-time-machine-preview');
assert.equal(blocks[2].type, 'book-affiliate-entry');
assert.equal(guide.overviewBlocks[0].items[2].href, '#ranking-time-machine-preview');
assert.equal(guide.sections.flatMap(section => section.blocks ?? []).filter(block => block.type === 'ranking-time-machine-preview').length, 1);
console.log('PASS: inline ranking SSR, all 16 canonical snapshots, controls, final-year playback, offscreen/background stop, URL isolation, full-page links, logo fallback and deduplicated exposure/start/result.');
