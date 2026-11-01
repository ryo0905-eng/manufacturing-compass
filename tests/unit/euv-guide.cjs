const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Render the real guide route and sitemap without starting a server or building.
const cache = new Map();
function load(stem) {
  const file = [stem, stem + '.ts', stem + '.tsx', stem + '.json', path.join(stem, 'index.ts')]
    .find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!file) throw Error(stem);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, process, URL, URLSearchParams, require(id) {
    if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (id === '@/lib/analytics') return { trackEvent() {} };
    if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
    if (id.startsWith('@/')) return load('src/' + id.slice(2));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
    return require(id);
  } }, { filename: file });
  return exports;
}

async function main() {
  const route = load('src/app/(ja)/guides/[slug]/page');
  const { getGuideBySlug } = load('src/content/guides/index');
  const props = slug => ({ params: Promise.resolve({ slug }) });
  const guide = getGuideBySlug('euv-lithography');
  assert.ok(guide && guide.status === 'published');
  assert.ok(route.generateStaticParams().some(item => item.slug === guide.slug));
  const metadata = await route.generateMetadata(props(guide.slug));
  assert.equal(metadata.alternates.canonical, '/guides/euv-lithography');
  assert.notEqual(metadata.robots?.index, false);
  const html = renderToStaticMarkup(await route.default(props(guide.slug)));
  assert.ok(html.includes(guide.title));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
  assert.ok(faq);
  const faqHtml = html.match(/<dl class="guide-faq">(.*?)<\/dl>/)?.[1];
  assert.ok(faqHtml);
  const visibleFaq = [...faqHtml.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/g)].map(match => [match[1], match[2]]);
  assert.equal(faq.mainEntity.length, 4);
  assert.deepEqual(faq.mainEntity.map(item => [item.name, item.acceptedAnswer.text]), visibleFaq);
  const links = ['/guides/photolithography-process#wavelengths', '/tools/litho-simulator', '/guides/semiconductor-lithography-equipment-manufacturers', '/guides/semiconductor-mask-blank-manufacturers', '/guides/semiconductor-photomask-manufacturers', '/guides/semiconductor-photoresist-manufacturers'];
  for (const link of links) {
    assert.ok(html.includes(`href="${link}"`), link);
    if (link.startsWith('/guides/')) assert.ok(getGuideBySlug(link.slice('/guides/'.length).split('#')[0]), link);
  }
  const parent = renderToStaticMarkup(await route.default(props('photolithography-process')));
  assert.ok(parent.includes('id="wavelengths"'));
  assert.ok(parent.includes('href="/guides/euv-lithography"'));
  assert.equal(load('src/app/sitemap').default().filter(entry => entry.url.endsWith('/guides/euv-lithography')).length, 1);
  console.log('EUV guide: SSR, matching FAQ schema, links, metadata and sitemap passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
