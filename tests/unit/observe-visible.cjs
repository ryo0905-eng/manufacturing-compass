const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('src/lib/observe-visible.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {}, listeners = new Map();
let callback, observed = 0, disconnected = 0, views = 0;
const doc = { hidden: false, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
vm.runInNewContext(code, { exports: exportsObject, document: doc, IntersectionObserver: class {
  constructor(fn, options) { callback = fn; assert.equal(options.threshold, .25); }
  observe() { observed++; }
  unobserve() {}
  disconnect() { disconnected++; }
} });
const observe = exportsObject.observeVisibleOnce;
const entry = ratio => [{ isIntersecting: ratio > 0, intersectionRatio: ratio }];
const stop = observe({}, () => views++);
callback(entry(0)); callback(entry(.1)); assert.equal(views, 0);
doc.hidden = true; callback(entry(1)); assert.equal(views, 0);
doc.hidden = false; listeners.get('visibilitychange')(); assert.equal(observed, 2);
callback(entry(.25)); assert.equal(views, 1); assert.equal(disconnected, 1); assert.equal(listeners.size, 0);
callback(entry(1)); stop(); assert.equal(views, 1);
const cancel = observe({}, () => views++); cancel(); callback(entry(1)); assert.equal(views, 1, 'A queued callback after unmount must not count');
const unsupported = {}; vm.runInNewContext(code, { exports: unsupported });
unsupported.observeVisibleOnce({}, () => views++)(); assert.equal(views, 1, 'Unsupported observer is not fabricated exposure');
console.log('PASS: visibility threshold, hidden tab, resume, once only, cancellation and unsupported observer');
