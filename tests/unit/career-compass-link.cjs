const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise visibility and click behavior without a browser or real analytics.
const filename = path.resolve(__dirname, '../../src/components/CareerCompassLink.tsx');
const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function harness(supported = true) {
  const events = [];
  const observers = [];
  const effects = [];
  const listeners = new Map();
  const document = {
    hidden: false,
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: (name) => listeners.delete(name),
  };
  const exports = {};
  let pathname = '/guides/example';
  let cursor = 0;
  const refs = [];
  class Observer {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.disconnected = false;
      observers.push(this);
    }
    observe(element) { this.element = element; this.observations = (this.observations ?? 0) + 1; }
    unobserve() {}
    disconnect() { this.disconnected = true; }
  }
  vm.runInNewContext(code, {
    exports,
    document,
    ...(supported ? { IntersectionObserver: Observer } : {}),
    require(name) {
      if (name === 'react') return {
        useRef(value) { return refs[cursor++] ?? (refs[cursor - 1] = { current: value }); },
        useEffect(effect) { effects.push(effect); },
      };
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
      if (name === 'next/link') return { default: 'a' };
      if (name === 'next/navigation') return { usePathname: () => pathname };
      if (name === '@/lib/analytics') return { trackCareerCompassEvent: (name, props) => events.push({ name, props }) };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  }, { filename });
  return {
    events, observers, effects, document, listeners,
    render(props = {}, nextPath = pathname) {
      pathname = nextPath;
      cursor = 0;
      const link = exports.CareerCompassLink({ ctaLocation: 'guide_link_list', ctaVariant: 'contextual_article_link', ...props });
      link.props.ref.current = { tagName: 'A' };
      return link;
    },
  };
}

const h = harness();
let clicked = 0;
const link = h.render({ onClick: () => clicked++ });
assert.equal(link.props.href, '/career-compass');
const cleanup = h.effects[0]();
const observer = h.observers[0];
assert.equal(observer.options.threshold, 0.5);
observer.callback([{ isIntersecting: true, intersectionRatio: 0.49 }]);
assert.equal(h.events.length, 0);
h.document.hidden = true;
observer.callback([{ isIntersecting: true, intersectionRatio: 1 }]);
assert.equal(h.events.length, 0, 'Background exposure must not count');
h.document.hidden = false;
h.listeners.get('visibilitychange')();
assert.equal(observer.observations, 2, 'Returning to the foreground must recheck exposure');
observer.callback([{ isIntersecting: true, intersectionRatio: 0.5 }]);
assert.equal(h.events[0].name, 'career_compass_cta_view');
assert.equal(observer.disconnected, true);
assert.equal(h.listeners.size, 0);
observer.callback([{ isIntersecting: true, intersectionRatio: 1 }]);
assert.equal(h.events.length, 1, 'Queued callbacks after exposure must not count again');
cleanup();
h.effects[0](); // React effect setup/cleanup replay must not duplicate exposure.
assert.equal(h.observers.length, 1);
link.props.onClick({});
assert.equal(clicked, 1);
assert.equal(h.events[1].name, 'career_compass_cta_click');
assert.deepEqual({ ...h.events[0].props }, { ...h.events[1].props });
h.render({}, '/industry-map');
const stop = h.effects[1]();
assert.equal(h.observers.length, 2);
const cancelled = h.observers.at(-1);
stop();
cancelled.callback([{ isIntersecting: true, intersectionRatio: 1 }]);
assert.equal(h.events.length, 2, 'Queued callbacks after cleanup must not count');
assert.equal(h.listeners.size, 0);
const fallback = harness(false);
const fallbackLink = fallback.render();
fallback.effects[0]();
fallbackLink.props.onClick({});
assert.equal(fallback.events.length, 1);
assert.equal(fallback.events[0].name, 'career_compass_cta_click');
console.log('PASS: visibility threshold, background/resume, queued callbacks, replay, cleanup, source change, single click event, fallback');
