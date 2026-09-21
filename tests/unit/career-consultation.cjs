const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise handlers without a browser, real clipboard, or analytics transport.
const root = path.resolve(__dirname, '../..');
const element = (type, props) => ({ type, props });
const jsx = { jsx: element, jsxs: element };
function load(relative, dependencies = {}, globals = {}) {
  const filename = path.join(root, relative);
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (name === 'react/jsx-runtime') return jsx;
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
    ...globals,
  }, { filename });
  return exports;
}
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
const template = load('src/data/career-consultation.ts');
function mount(clipboard) {
  const events = [];
  const slots = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
  };
  const { ConsultationTemplate } = load('src/components/ConsultationTemplate.tsx', {
    react,
    '@/data/career-consultation': template,
    '@/lib/analytics': { trackEvent: (...args) => events.push(args) },
    './ConsultationTemplate.module.css': {},
  }, { navigator: { clipboard } });
  return { events, render() { cursor = 0; return ConsultationTemplate(); } };
}
async function main() {
  let finish;
  const copied = [];
  const success = mount({ writeText(value) { copied.push(value); return new Promise(resolve => { finish = resolve; }); } });
  let tree = success.render();
  const textarea = nodes(tree, node => node.type === 'textarea')[0];
  assert.equal(textarea.props.readOnly, true);
  assert.equal(textarea.props.onChange, undefined);
  assert.equal(textarea.props.value, template.consultationTemplate);
  let selected = false;
  textarea.props.onFocus({ currentTarget: { select() { selected = true; } } });
  assert.equal(selected, true);
  const click = nodes(tree, node => node.type === 'button')[0].props.onClick;
  const pending = click();
  await click(); // Same-tick double click must not write twice.
  assert.equal(copied.length, 1);
  assert.equal(copied[0], template.consultationTemplate);
  assert.equal(success.events.length, 0);
  assert.equal(nodes(success.render(), node => node.type === 'button')[0].props.disabled, true);
  finish();
  await pending;
  assert.deepEqual(success.events, [['consultation_template_copy']]);
  assert.match(nodes(success.render(), node => node.props?.role === 'status')[0].props.children, /コピーしました/);

  for (const clipboard of [undefined, { writeText: async () => { throw new Error('denied'); } }]) {
    const failure = mount(clipboard);
    await nodes(failure.render(), node => node.type === 'button')[0].props.onClick();
    tree = failure.render();
    assert.equal(failure.events.length, 0);
    assert.equal(nodes(tree, node => node.type === 'button')[0].props.disabled, false);
    assert.match(nodes(tree, node => node.props?.role === 'status')[0].props.children, /手動でコピー/);
    assert.equal(nodes(tree, node => node.type === 'textarea')[0].props.value, template.consultationTemplate);
  }

  const agents = load('src/data/affiliateLinks.ts');
  const linkEvents = [];
  const { CareerAgentsLink } = load('src/components/CareerAgentsLink.tsx', {
    'next/link': 'Link',
    'next/navigation': { usePathname: () => '/career-consultation' },
    '@/lib/analytics': { trackEvent: (...args) => linkEvents.push(args) },
  });
  assert.equal(CareerAgentsLink({}).props.href, '/career-agents');
  for (const { id } of agents.agentFocusOptions) {
    const link = CareerAgentsLink({ focus: id, ctaLocation: 'consultation_theme' });
    assert.equal(link.props.href, `/career-agents?focus=${id}#agents`);
    const before = linkEvents.length;
    link.props.onClick({});
    assert.equal(linkEvents.length, before + 1);
    const [name, properties] = linkEvents.at(-1);
    assert.equal(name, 'career_agents_cta_click');
    assert.equal(properties.source_page, '/career-consultation');
    assert.equal(properties.destination_path, '/career-agents');
    assert.equal(properties.destination_group, id);
    assert.equal(properties.cta_location, 'consultation_theme');
  }

  const { default: AgentsPage } = load('src/app/(ja)/career-agents/page.tsx', {
    'next/link': 'Link',
    '@/components/AffiliateDisclosure': { AffiliateDisclosure: 'AffiliateDisclosure' },
    '@/components/AgentConsultationMatrix': { AgentConsultationMatrix: 'AgentConsultationMatrix' },
    '@/components/DiagnosisCta': { DiagnosisCta: 'DiagnosisCta' },
    '@/components/TrackedAffiliateCreative': { TrackedAffiliateCreative: 'TrackedAffiliateCreative' },
    '@/data/affiliateLinks': agents,
  });
  for (const focus of [undefined, 'invalid-value', ...agents.agentFocusOptions.map(option => option.id)]) {
    const page = await AgentsPage({ searchParams: Promise.resolve({ focus }) });
    const ids = nodes(page, node => node.type === 'article').map(node => node.props.id);
    const expected = [...agents.affiliateAgents];
    if (agents.agentFocusOptions.some(option => option.id === focus)) {
      expected.sort((a, b) => Number(b.focusAreas.includes(focus)) - Number(a.focusAreas.includes(focus)));
    }
    assert.deepEqual(ids, Array.from(expected, agent => agent.id));
  }
  console.log('PASS: clipboard success/denial/unavailable, manual fallback, duplicate click, anonymous event, three focus links, invalid focus fallback');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
