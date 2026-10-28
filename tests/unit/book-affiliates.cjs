const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

class Link {
  constructor(href) { this.href = href; this.rel = 'external'; }
  getAttribute(name) { return name === 'href' ? this.href : null; }
  closest(selector) { return selector === 'a' ? this : null; }
}

function fixture(product, realReact = false, failAnalytics = false, supported = true) {
  const events = [], scripts = [], refs = [], states = [], effects = [], timers = new Map(), observers = new Set(), visible = new Map(), cache = new Map();
  let cursor = 0, nextTimer = 0;
  const root = { links: [], querySelectorAll() { return this.links; }, contains(link) { return this.links.includes(link); }, querySelector() { return scripts[0] ?? null; }, appendChild(frame) { scripts.push(frame); } };
  const frameEvents = new Map(), bodyEvents = new Map();
  const frameBody = { links: [], scrollHeight: 280, querySelectorAll() { return this.links; }, contains(link) { return this.links.includes(link); }, addEventListener(name, callback) { bodyEvents.set(name, callback); }, removeEventListener(name) { bodyEvents.delete(name); } };
  const frame = { style: {}, contentDocument: { body: frameBody }, addEventListener(name, callback) { frameEvents.set(name, callback); }, removeEventListener(name) { frameEvents.delete(name); } };
  const card = {};
  const destination = { tabIndex: undefined, focusCalls: 0, focus() { this.focusCalls++; } };
  const react = realReact ? React : {
    useRef(value) { const i = cursor++; return refs[i] ??= { current: value }; },
    useState(value) { const i = cursor++; if (!(i in states)) states[i] = value; return [states[i], next => { states[i] = next; }]; },
    useEffect(fn, deps) { const i = cursor++, old = effects[i]; if (!old || deps.some((value, j) => !Object.is(value, old.deps[j]))) { old?.cleanup?.(); effects[i] = { fn, deps, pending: true }; } },
  };
  function load(relative) {
    const filename = path.resolve(relative);
    if (cache.has(filename)) return cache.get(filename);
    const exports = {}; cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, {
      exports, URL, Set, Element: Link,
      ...(supported ? { IntersectionObserver: class {} } : {}),
      document: { createElement(tag) { assert.equal(tag, 'iframe', 'Vendor scripts must run in a fresh document'); return frame; }, getElementById: () => destination },
      window: { location: { reload() {} } },
      setTimeout(callback, delay) { assert.equal(delay, 10000); const id = ++nextTimer; timers.set(id, callback); return id; },
      clearTimeout(id) { timers.delete(id); },
      MutationObserver: class { constructor(callback) { this.callback = callback; } observe(target, options) { this.target = target; this.options = options; observers.add(this); } disconnect() { observers.delete(this); } },
      require(id) {
        if (id === 'react') return react;
        if (id.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => key }) };
        if (id === '@/lib/analytics') return { trackEvent(name, props) { if (failAnalytics) throw Error('analytics unavailable'); events.push({ name, props }); } };
        if (id === '@/lib/observe-visible') return { observeVisibleOnce(target, callback) { if (supported) visible.set(target, callback); return () => visible.delete(target); } };
        if (id.startsWith('@/')) {
          const stem = 'src/' + id.slice(2);
          return load([stem + '.ts', stem + '.tsx'].find(file => fs.existsSync(file)));
        }
        return require(id);
      },
    }, { filename });
    return exports;
  }
  const lib = load('src/lib/book-affiliates.ts');
  const books = load('src/data/book-affiliates.ts').moshimoBookAffiliates;
  const Component = load('src/components/guide/MoshimoBookLink.tsx').MoshimoBookLink;
  const Entry = load('src/components/guide/BookAffiliateEntry.tsx').BookAffiliateEntry;
  function visit(element, predicate) {
    if (!element || typeof element !== 'object') return null;
    if (predicate(element)) return element;
    for (const child of React.Children.toArray(element.props?.children)) { const found = visit(child, predicate); if (found) return found; }
    return null;
  }
  let tree;
  return {
    lib, books, events, scripts, root, timers, visible, observers, Component, destination, frame, frameBody, frameEvents, bodyEvents,
    loadFrame() { frameBody.id = `book-embed-${books[product].id}`; frameEvents.get('load')?.(); },
    clickFrame(link) { bodyEvents.get('click')?.({ target: link }); },
    renderEntry() {
      cursor = 0; tree = Entry({ sourceSlug: 'semiconductor-market-cap-ranking' });
      tree.props.ref.current = root;
      for (const effect of effects) if (effect?.pending) { effect.cleanup = effect.fn(); effect.pending = false; }
      return tree;
    },
    clickEntry(event = {}) { visit(tree, element => element.props?.href === '#industry-map-books').props.onClick({ button: 0, ...event }); },
    render() {
      cursor = 0; tree = Component({ product });
      tree.props.ref.current = card;
      visit(tree, element => element.props?.onClickCapture).props.ref.current = root;
      for (const effect of effects) if (effect?.pending) { effect.cleanup = effect.fn(); effect.pending = false; }
      return tree;
    },
    mutate() { for (const observer of [...observers]) observer.callback(); },
    wait() { for (const [id, callback] of [...timers]) { timers.delete(id); callback(); } },
    expose() { const callback = visible.get(root); visible.delete(root); callback?.(); },
    reach() { const callback = visible.get(card); visible.delete(card); callback?.(); },
    click(link) { visit(tree, element => element.props?.onClickCapture).props.onClickCapture({ target: link, currentTarget: root }); },
    strictReplay() { for (const effect of effects) if (effect) { effect.cleanup?.(); effect.cleanup = effect.fn(); } },
    cleanup() { for (const effect of effects) effect?.cleanup?.(); },
    status() { return states[1]; },
  };
}

for (const product of ['nikkei-industry-map-2027', 'shikiho-industry-map-2027']) {
  const f = fixture(product), book = f.books[product];
  const tracking = entry => `https://af.moshimo.com/af/c/click?a_id=${entry.a_id}&p_id=${entry.p_id}&pc_id=${entry.pc_id}&url=private-destination`;
  const [rakuten, amazon] = book.card.b_l;
  assert.equal(f.lib.getBookRetailer(tracking(amazon), product), 'amazon');
  assert.equal(f.lib.getBookRetailer(tracking(rakuten), product), 'rakuten');
  assert.equal(f.lib.getBookRetailer(amazon.u_url, product), 'amazon');
  assert.equal(f.lib.getBookRetailer(rakuten.u_url, product), 'rakuten');
  assert.equal(f.lib.getBookRetailer(tracking({ ...amazon, p_id: 999 }), product), 'unknown');
  for (const href of ['#industry-map-books', 'javascript:alert(1)', 'https://af.moshimo.com/af/c/click?a_id=wrong&p_id=54', 'https://example.org/Amazon', 'https://af.moshimo.com.evil.test/af/c/click?a_id=' + amazon.a_id]) assert.equal(f.lib.getBookRetailer(href, product), null);

  f.render(); assert.equal(f.events.length, 0, 'Mount is not readiness or exposure');
  assert.equal(f.visible.size, 1); assert.equal(f.observers.size, 0);
  assert.equal(f.status(), 'idle'); assert.equal(f.scripts.length, 0); assert.equal(f.timers.size, 0);
  f.strictReplay(); f.wait();
  assert.equal(f.scripts.length, 0, 'Offscreen cards do not fetch the vendor embed');
  assert.equal(f.events.length, 0, 'Waiting offscreen must not emit unavailable');
  f.reach();
  assert.equal(f.events[0].props.action, 'section_view');
  assert.equal(f.status(), 'loading'); assert.equal(f.scripts.length, 1); assert.equal(f.observers.size, 1);
  f.strictReplay(); assert.equal(f.scripts.length, 1, 'StrictMode effect replay must not duplicate the embed');
  f.wait(); assert.equal(f.status(), 'slow');
  assert.deepEqual(f.events.map(e => e.props.action), ['section_view', 'unavailable']);
  const purchase = new Link(tracking(amazon)); purchase.textContent = '楽天市場という不正確なラベル';
  f.root.links = [purchase]; f.mutate(); assert.equal(f.status(), 'ready');
  assert.deepEqual(f.events.map(e => e.props.action), ['section_view', 'unavailable', 'ready']);
  assert.equal(f.events.some(e => e.props.action === 'view'), false, 'Offscreen readiness is not exposure');
  f.mutate(); f.expose(); f.strictReplay(); f.expose();
  assert.equal(f.events.filter(e => e.props.action === 'view').length, 1);
  for (const value of ['sponsored', 'nofollow', 'noopener', 'noreferrer']) assert.ok(purchase.rel.split(' ').includes(value));
  f.click(purchase); assert.equal(f.events.at(-1).props.retailer, 'amazon', 'URL data wins over the label');
  const unrelated = new Link('https://af.moshimo.com/af/www/help'); f.root.links.push(unrelated);
  const count = f.events.length; f.click(unrelated); assert.equal(f.events.length, count);
  const unknown = new Link(tracking({ ...amazon, p_id: 999 })); f.root.links.push(unknown); f.click(unknown); assert.equal(f.events.at(-1).props.retailer, 'unknown');
  f.root.links = []; f.mutate(); assert.equal(f.status(), 'loading'); assert.equal(f.visible.size, 0);
  f.wait(); f.root.links = [purchase]; f.mutate(); f.expose();
  for (const action of ['section_view', 'ready', 'view', 'unavailable']) assert.equal(f.events.filter(e => e.props.action === action).length, 1);
  for (const event of f.events) {
    assert.equal(event.props.product_id, product); assert.equal(event.props.ui_version, 'books-v2');
    assert.equal(event.props.source_page, 'semiconductor-market-cap-ranking');
    assert.ok(Object.keys(event.props).every(key => ['action', 'product_id', 'source_page', 'cta_location', 'ui_version', 'service_id', 'retailer'].includes(key)));
  }
  assert.ok(!JSON.stringify(f.events).includes('private-destination'));
  const lateMutation = [...f.observers][0].callback;
  f.cleanup(); assert.equal(f.observers.size, 0); assert.equal(f.visible.size, 0); assert.equal(f.timers.size, 0);
  f.root.links = []; lateMutation(); assert.equal(f.timers.size, 0, 'Queued mutations after cleanup cannot restart timers');
  const remount = fixture(product); remount.root.links = [purchase]; remount.render(); remount.reach(); remount.expose(); assert.equal(remount.events.filter(e => e.props.action === 'view').length, 1); remount.cleanup();
  const unavailableAnalytics = fixture(product, false, true); unavailableAnalytics.root.links = [purchase]; assert.doesNotThrow(() => { unavailableAnalytics.render(); unavailableAnalytics.reach(); unavailableAnalytics.expose(); unavailableAnalytics.click(purchase); }); unavailableAnalytics.cleanup();
  const unsupported = fixture(product, false, false, false); unsupported.render(); assert.equal(unsupported.scripts.length, 1, 'Unsupported visibility still loads usable purchase links'); assert.ok(!unsupported.events.some(e => e.props.action === 'section_view')); unsupported.cleanup();
  const offscreen = fixture(product); offscreen.render(); offscreen.cleanup(); offscreen.reach(); offscreen.wait(); assert.equal(offscreen.scripts.length, 0); assert.equal(offscreen.events.length, 0);

  // Scrolling after the outer page's load still gives the vendor its own load
  // lifecycle, including a second card and client-navigation remounts.
  const embedded = fixture(product);
  embedded.render(); embedded.reach();
  assert.match(embedded.frame.srcdoc, /^<!doctype html>/);
  assert.ok(embedded.frame.srcdoc.includes(`id="msmaflink-${book.id}"`));
  assert.ok(embedded.frame.srcdoc.includes('msmaflink(' + JSON.stringify(book.card) + ')'));
  assert.ok(embedded.frame.srcdoc.includes('https://dn.msmstatic.com/site/cardlink/bundle.js?20220329'));
  assert.ok(embedded.frame.srcdoc.includes('<base target="_blank">'), 'Generated links default to opening outside the iframe');
  embedded.frameBody.links = [new Link(tracking(amazon)), new Link(tracking(rakuten))];
  for (const link of embedded.frameBody.links) link.target = '_self';
  embedded.loadFrame();
  for (const [index, retailer] of [amazon, rakuten].entries()) {
    const link = embedded.frameBody.links[index];
    assert.equal(link.target, '_blank', 'Explicit same-frame targets must also open outside the iframe');
    assert.equal(link.href, tracking(retailer), 'Preserve issued affiliate URLs');
    assert.ok(link.rel.split(' ').includes('noopener'));
  }
  assert.equal(embedded.status(), 'ready', 'Observe purchase links inside the frame');
  assert.equal(embedded.frame.style.height, '280px');
  assert.equal([...embedded.observers][0].target, embedded.frameBody);
  assert.ok(embedded.visible.has(embedded.root), 'Exposure is observed in the outer page');
  embedded.expose();
  embedded.clickFrame(embedded.frameBody.links[0]);
  assert.equal(embedded.events.at(-1).props.retailer, 'amazon', 'Frame clicks retain outbound analytics');
  embedded.strictReplay(); embedded.expose();
  assert.equal(embedded.scripts.length, 1);
  assert.equal(embedded.events.filter(e => e.props.action === 'view').length, 1);
  embedded.cleanup();
  assert.equal(embedded.frameEvents.size, 0); assert.equal(embedded.bodyEvents.size, 0);
  assert.equal(embedded.observers.size, 0); assert.equal(embedded.timers.size, 0);

  const ssr = fixture(product, true);
  const html = renderToStaticMarkup(React.createElement(ssr.Component, { product }));
  assert.ok(html.indexOf(book.description) < html.indexOf('msmaflink-'));
  assert.ok(html.indexOf(book.purpose) < html.indexOf('msmaflink-'));
  assert.ok(html.includes('広告・アフィリエイト') && html.includes('Amazonは書名の検索結果') && html.includes('<noscript>'));
  assert.ok(html.includes('book-title-' + book.id));
}
const data = fs.readFileSync('src/content/guides/semiconductor-market-cap-ranking.ts', 'utf8');
assert.match(data, /type: "market-cap-ranking", scope: "world"[^]*?type: "ranking-purpose-entry"/);
assert.match(data, /id: "industry-map-books"/);
const entry = fixture('nikkei-industry-map-2027');
entry.renderEntry(); assert.equal(entry.events.length, 0);
entry.expose(); entry.strictReplay(); entry.expose();
assert.equal(entry.events.length, 1); assert.equal(entry.events[0].name, 'book_affiliate_entry_view');
entry.clickEntry(); assert.equal(entry.events.at(-1).name, 'article_internal_click');
assert.equal(entry.events.at(-1).props.destination_path, '#industry-map-books');
assert.equal(entry.events.at(-1).props.ui_version, 'books-v2');
assert.equal(entry.destination.focusCalls, 1);
entry.clickEntry({ ctrlKey: true }); assert.equal(entry.destination.focusCalls, 1, 'Modified clicks keep native navigation');
entry.cleanup(); assert.equal(entry.visible.size, 0);
console.log('PASS: two books, lazy loading after section exposure, no offscreen failure, recovery, StrictMode/remount/queued cleanup, unsupported fallback, URL classification, analytics isolation, privacy and SSR (mock vendor requests).');
