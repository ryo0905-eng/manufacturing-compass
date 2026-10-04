const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest);
};
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText,filename);
require.extensions['.css'] = module => { module.exports = new Proxy({}, {get:(_,key) => key === '__esModule' ? false : key}); };
const { media } = require('../../src/lib/chip-pulse-media.ts');
const { watchTopics, readWatchHash, inWatchWindow } = require('../../src/lib/watch-types.ts');
const { watchItems, watchHighlights, watchEditorial, getArticleEditorial, isWatchMapTarget } = require('../../src/lib/watch.ts');
const { companies, segments } = require('../../src/data/companies.ts');
const { getCompaniesFromCompareSlug } = require('../../src/lib/format.ts');
const { earningsReleases } = require('../../src/lib/earnings.ts');
const { NewsFeed } = require('../../src/components/chip-pulse/NewsFeed.tsx');
const { WatchCard } = require('../../src/components/chip-pulse/WatchCard.tsx');
const { buildPublication, validateSnapshot } = require('../../scripts/chip-pulse-editor-publish.cjs');
const { mergeSnapshot, retainVerifiedArticle } = require('../../scripts/chip-pulse-media.cjs');
const now = '2026-10-04T15:00:00.000Z';
const copy = value => structuredClone(value);
function candidate() {
  const article = copy(media.articles.find(a=>a.id.startsWith('sec-')));
  article.id='test-reviewed-story'; article.version=1; article.relatedIds=[];
  article.sourceUrl='https://www.sec.gov/Archives/edgar/data/1/1/example.htm';
  article.review={facts:true,numbers:true,redaction:true};
  return { articles:[article], documents:[{url:article.sourceUrl,text:article.evidence.map(e=>e.quote).join(' ')}] };
}
function checkLink(href) {
  assert.ok(href.startsWith('/') && !href.startsWith('//'),href);
  const [route] = href.split('#');
  if(route.startsWith('/companies/')) assert.ok(companies.some(c=>c.slug===route.split('/')[2]),href);
  else if(route.startsWith('/guides/')) {
    const filename=path.resolve('src/content/guides',route.split('/')[2]+'.ts');
    assert.ok(fs.existsSync(filename),href);
    assert.ok(Object.values(require(filename)).some(value=>value?.status==='published'),href);
  } else if(route.startsWith('/compare/')) assert.equal(getCompaniesFromCompareSlug(route.split('/')[2]).length,2,href);
  else if(route.startsWith('/segments/')) assert.ok(segments.some(s=>s.slug===route.split('/')[2]),href);
  else if(route==='/industry-map') assert.ok(isWatchMapTarget(href),href);
  else if(route==='/semiconductor-watch/earnings') return;
  else if(route.startsWith('/semiconductor-watch/earnings/')) assert.ok(earningsReleases.some(r=>r.companyId===route.split('/')[3]),href);
  else if(route.startsWith('/semiconductor-watch/')) assert.ok(media.articles.some(a=>a.id===route.split('/')[2]),href);
  else assert.fail(`Unchecked route: ${href}`);
}

test('published items, editorial topics and every destination resolve to existing content',()=>{
  validateSnapshot(media);
  assert.equal(new Set(watchItems.map(i=>i.id)).size,watchItems.length);
  assert.ok(watchHighlights.length>0 && watchHighlights.length<=3);
  for(const item of watchItems) { checkLink(item.href); assert.ok(item.topics.includes(item.primaryTopic)); }
  for(const [id,entry] of Object.entries(watchEditorial.articles)) {
    const article=media.articles.find(a=>a.id===id); assert.ok(article,id);
    assert.equal(entry.version,article.version); assert.ok(entry.sourceUrls.includes(article.sourceUrl));
    assert.ok(entry.sourceTitle && entry.reason && Date.parse(entry.checkedAt));
    entry.topics.forEach(id=>assert.ok(watchTopics.some(t=>t.id===id)));
    entry.companyIds.forEach(id=>assert.ok(companies.some(c=>c.id===id),id));
    entry.termIds.forEach(id=>assert.ok(watchEditorial.terms[id],id));
    assert.ok(entry.links.length<=3); entry.links.forEach(link=>checkLink(link.href));
  }
  watchTopics.forEach(t=>checkLink(t.href));
  Object.values(watchEditorial.terms).forEach(t=>checkLink(t.href));
  Object.values(watchEditorial.sourceDestinations).forEach(t=>checkLink(t.href));
  assert.equal(isWatchMapTarget('/industry-map#company=broadcom'),false);
});

test('checked publication rejects bad evidence, unreviewed data, duplicates and invalid dates without mutation',()=>{
  const before=copy(media);
  const batch=candidate(); const next=buildPublication(media,batch,now);
  assert.equal(next.articles.length,media.articles.length+1); assert.deepEqual(media,before);
  for(const mutate of [b=>b.articles[0].review.numbers=false,b=>b.documents[0].text='',b=>b.articles.push(copy(b.articles[0])),b=>b.articles[0].publishedAt='2026-09-31',b=>b.articles[0].relatedIds=['missing'],b=>b.articles[0].visual.kind='invented']) {
    const bad=candidate();mutate(bad);assert.throws(()=>buildPublication(media,bad,now));assert.deepEqual(media,before);
  }
});

test('revisions preserve publication date and history and make old context ineligible',()=>{
  const article=copy(media.articles[0]);article.version++;article.title+='（更新）';article.review={facts:true,numbers:true,redaction:true};
  const next=buildPublication(media,{articles:[article],documents:[{url:article.sourceUrl,text:article.evidence.map(e=>e.quote).join(' ')}]},now);
  const updated=next.articles.find(a=>a.id===article.id);
  assert.equal(updated.firstPublishedAt,media.articles[0].firstPublishedAt);
  assert.equal(updated.history.at(-1).title,media.articles[0].title);
  assert.equal(getArticleEditorial(updated),undefined);
  const changed=copy(media.articles[0]);changed.sourceCheck='changed';assert.equal(getArticleEditorial(changed),undefined);
});

test('scheduled collection retains verified prose even when its source changes or collection fails',()=>{
  const article=copy(media.articles[0]); const original=copy(article);
  assert.equal(retainVerifiedArticle(article,'before','after'),true);
  assert.equal(article.sourceCheck,'changed');delete article.sourceCheck;assert.deepEqual(article,original);
  assert.equal(retainVerifiedArticle({...article,validation:'ai-evidence-checked'},'x','y'),false);
  for(const status of ['success','partial','failed']) {
    const next=mergeSnapshot(media,{status,errors:status==='success'?[]:[{companyId:article.sourceId}],candidates:[]},[],now);
    assert.deepEqual(next.articles,media.articles);
  }
});

test('no-JS markup supports zero/one/old items, image-free cards and legacy IDs',()=>{
  const empty=renderToStaticMarkup(React.createElement(NewsFeed,{items:[],now,children:null}));
  assert.ok(empty.includes('直近30日のニュース掲載はありません'));
  watchTopics.forEach(t=>assert.ok(empty.includes(t.linkLabel)));
  const one=watchItems.find(i=>i.kind==='article');
  const html=renderToStaticMarkup(React.createElement(NewsFeed,{items:[one],now:'2027-01-01T00:00:00Z',children:React.createElement(WatchCard,{item:{...one,visual:undefined},featured:true})}));
  assert.ok(html.includes(`id="signal-${one.id.replace('article:','')}"`));
  assert.ok(html.includes('事実と背景を読む'));assert.ok(!html.includes('<img'));
  assert.equal(readWatchHash('#theme=packaging'),'packaging');assert.equal(readWatchHash('#signal-existing'),'all');assert.equal(readWatchHash('#theme=unknown'),'all');
  assert.equal(inWatchWindow('2026-10-05',now),false);assert.equal(inWatchWindow('2026-08-01',now),false);
});
