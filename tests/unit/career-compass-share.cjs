const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const events = [];
const copied = [];
const code = ts.transpileModule(fs.readFileSync('src/components/career-compass/CareerShareCard.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const moduleExports = {};
const fakeReact = { ...React, useState: (initial) => [initial, () => {}] };
const navigator = { clipboard: { writeText: async (text) => copied.push(text) } };
vm.runInNewContext(code, { exports: moduleExports, navigator, require(id) {
  if (id === 'react') return fakeReact;
  if (id === '@/lib/analytics') return { trackCareerCompassEvent: (name, props) => events.push({ name, props }) };
  return require(id);
} });
const component = moduleExports.CareerShareCard({ role: 'プロセスエンジニア' });
const html = renderToStaticMarkup(component);
assert.match(html, /プロセスエンジニア/);
assert.doesNotMatch(html, /年収帯|\/100|回答内容/);
const actions = component.props.children.find((child) => child?.props?.className === 'compass-share-actions');
const copyButton = actions.props.children.find((child) => child.props.children === '文章とリンクをコピー');
(async () => {
  await copyButton.props.onClick();
  assert.match(copied[0], /プロセスエンジニア/);
  assert.match(copied[0], /https:\/\/mfg-compass\.com\/career-compass$/);
  assert.doesNotMatch(copied[0], /年収|\/100|\?/);
  assert.equal(events[0].name, 'career_compass_share');
  assert.equal(events[0].props.action, 'text_copy');
  assert.equal(events[0].props.result, 'success');
  assert.deepEqual(Object.keys(events[0].props).sort(), ['action', 'result']);
  console.log('PASS: share preview, fixed URL, privacy and copy analytics');
})().catch((error) => { console.error(error); process.exitCode = 1; });
