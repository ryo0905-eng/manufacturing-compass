const assert = require('node:assert/strict');
const fs = require('node:fs');
const postcss = require('postcss');
const localByDefault = require('next/dist/compiled/postcss-modules-local-by-default');

(async () => {
  const file = 'src/components/ImprovementReport.module.css';
  // Use the same pure-selector plugin as Next's CSS loader. TypeScript and
  // component tests that stub CSS imports cannot catch this compilation error.
  const compiled = await postcss([localByDefault({ mode: 'pure' })])
    .process(fs.readFileSync(file, 'utf8'), { from: file });
  assert.match(compiled.css, /body\[data-improvement-print\].*printRoot/);

  const globalCss = postcss.parse(fs.readFileSync('src/app/globals.css', 'utf8'));
  for (const [selector, declarations] of [
    ['body[data-improvement-print] > :not(#improvement-report-print-root)', { display: 'none' }],
    ['body[data-improvement-print]', { margin: '0', padding: '0', background: 'white' }],
  ]) {
    const matches = [];
    globalCss.walkRules(selector, rule => matches.push(rule));
    assert.equal(matches.length, 1, selector);
    const rule = matches[0];
    assert.equal(rule.parent.name, 'media');
    assert.equal(rule.parent.params, 'print');
    for (const [property, value] of Object.entries(declarations)) {
      const declaration = rule.nodes.find(node => node.prop === property);
      assert.equal(declaration?.value, value);
      assert.equal(declaration?.important, true);
    }
  }
  console.log('Improvement report CSS: Next pure-selector compilation and print isolation passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
