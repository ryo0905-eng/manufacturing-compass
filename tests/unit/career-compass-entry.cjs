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
const data = load('src/data/career-compass-entry').careerCompassEntry;
const page = load('src/app/(ja)/career-compass/page');
const html = renderToStaticMarkup(React.createElement(page.default));
assert.equal((html.match(/data-career-compass-preview="intro"/g) || []).length, 1);
assert.ok(html.indexOf(data.heading) < html.indexOf('id="career-compass-tool"'));
for (const item of data.example) assert.ok(html.includes(item.value));
assert.ok(html.includes('href="#career-compass-tool"'));
assert.ok(html.includes(data.placements.intro.buttonLabel));
assert.ok(!html.includes('診断結果のサンプル'));
assert.ok(!html.includes('career-compass-result-sample'));
assert.ok(html.includes('選ぶと次の質問へ進みます。回答は「戻る」で変更できます。'));
assert.equal(page.metadata.title, '半導体・製造業エンジニアの適職診断｜12問で職種と準備を整理');
assert.equal(page.metadata.alternates.canonical, '/career-compass');
const preview = html.match(/<aside[^>]*data-career-compass-preview="intro"[\s\S]*?<\/aside>/)[0];
assert.ok(!/Power Score|年収|\/100/.test(preview));
assert.equal((preview.match(/<a /g) || []).length, 1, 'Only the action is a link');

const guide = load('src/content/guides/semiconductor-market-cap-ranking').semiconductorMarketCapRankingGuide;
const section = guide.sections.find(section => section.id === 'world-ranking');
assert.equal(section.blocks.filter(block => block.type === 'ranking-purpose-entry').length, 1);
assert.ok(!guide.sections.some(section => section.id === 'research-next'));
const Blocks = load('src/components/guide/GuideBlocks').GuideBlocks;
const article = renderToStaticMarkup(React.createElement(Blocks, { blocks: section.blocks, sourceSlug: guide.slug }));
const rankingFallback = article.match(/<noscript>[\s\S]*?<\/noscript>/)[0];
assert.equal((rankingFallback.match(/href="\/career-compass"/g) || []).length, 1, 'No-JS fallback retains Career Compass');
assert.ok(article.includes('id="research-next"'));
assert.ok(!article.includes('data-career-compass-preview="ranking"'));
const unrelated = renderToStaticMarkup(React.createElement(Blocks, { blocks: [{ type: 'note', title: 'Example', body: 'Other article' }], sourceSlug: 'example' }));
assert.ok(!unrelated.includes('data-career-compass-preview'));

// Use the real visibility helper with mocked hooks and browser observation.
function harness(supported = true) {
  const events = [], observers = [], effects = [], refs = [], listeners = new Map();
  let cursor = 0;
  const document = {
    hidden: false,
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name),
  };
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; observers.push(this); }
    observe() { this.observations = (this.observations ?? 0) + 1; }
    unobserve() {}
    disconnect() { this.disconnected = true; }
  }
  const mockLoad = loader({
    react: {
      useRef(value) { return refs[cursor++] ?? (refs[cursor - 1] = { current: value }); },
      useEffect(effect) { effects.push(effect); },
    },
    '@/lib/analytics': { trackCareerCompassEvent: (name, props) => events.push({ name, props }) },
  }, { document, ...(supported ? { IntersectionObserver: Observer } : {}) });
  const View = mockLoad('src/components/career-compass/CareerCompassPreviewView').CareerCompassPreviewView;
  return {
    events, observers, effects, document, listeners,
    render() {
      cursor = 0;
      const view = View({ children: 'Example', source_page: '/career-compass', cta_location: 'career_compass_intro', cta_variant: 'preview_entry_v1' });
      view.props.ref.current = {};
      return effects.at(-1)();
    },
  };
}
const entries = ratio => [{ isIntersecting: ratio > 0, intersectionRatio: ratio }];
const h = harness();
const stop = h.render();
assert.equal(h.events.length, 0, 'Mounting is not exposure or a quiz start');
const observer = h.observers[0];
assert.equal(observer.options.threshold, 0.25);
observer.callback(entries(0.24));
h.document.hidden = true;
observer.callback(entries(1));
assert.equal(h.events.length, 0);
h.document.hidden = false;
h.listeners.get('visibilitychange')();
assert.equal(observer.observations, 2);
observer.callback(entries(0.25));
assert.equal(h.events.length, 1);
assert.equal(h.events[0].name, 'career_compass_preview_view');
assert.deepEqual({ ...h.events[0].props }, { source_page: '/career-compass', cta_location: 'career_compass_intro', cta_variant: 'preview_entry_v1' });
assert.equal(h.listeners.size, 0);
observer.callback(entries(1));
stop();
h.render();
assert.equal(h.observers.length, 1, 'Rerender/effect replay must not duplicate exposure');
assert.equal(h.events.length, 1, 'Preview must not emit start/complete/CTA clicks');
const cancelled = harness();
const cancel = cancelled.render();
cancel();
cancelled.observers[0].callback(entries(1));
assert.equal(cancelled.events.length, 0);
assert.equal(cancelled.listeners.size, 0);
const replay = harness();
replay.render()();
replay.render();
replay.observers[0].callback(entries(1));
assert.equal(replay.events.length, 0);
replay.observers[1].callback(entries(1));
assert.equal(replay.events.length, 1, 'Strict Mode setup after cleanup still observes once');
const fallback = harness(false);
fallback.render()();
assert.equal(fallback.events.length, 0, 'Unsupported observation must not fabricate exposure');
console.log('PASS: shared SSR sample, landing order/anchor/metadata, unique article CTA, unrelated articles, foreground 25% exposure, replay/cleanup/fallback and privacy-safe events');
