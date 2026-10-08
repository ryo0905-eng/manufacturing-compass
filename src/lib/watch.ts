import editorialData from "@/data/watch-editorial.json";
import { companies } from "@/data/companies";
import { factoryProjects } from "@/data/factory-projects";
import { industryMapZones } from "@/data/industry-map";
import { media, type NewsArticle } from "./chip-pulse-media";
import { earningsReleases, earningsCompanyName, earningsFinancialScope, earningsMetricText } from "./earnings";
import { type WatchEditorial, type WatchItem, type WatchTopic, type WatchVisual } from "./watch-types";

export const watchEditorial = editorialData as WatchEditorial;
const stageLabels: Record<string, string> = { plan: "計画・承認", prototype: "試作", production: "生産", result: "実績" };
const fieldTopics: Record<string, WatchTopic> = { equipment: "equipment", memory: "ai-memory", packaging: "packaging", "design-manufacturing": "design" };

export function getArticleEditorial(article: NewsArticle) {
  const entry = watchEditorial.articles[article.id];
  // Hide dependent interpretation when its source version no longer matches.
  return entry && entry.version === article.version && entry.sourceUrls.includes(article.sourceUrl) && article.sourceCheck !== "changed" ? entry : undefined;
}

export function articleWatchItem(article: NewsArticle): WatchItem {
  const entry = getArticleEditorial(article);
  const topics = entry?.topics ?? [...new Set(article.fields.flatMap(f => fieldTopics[f] ? [fieldTopics[f]] : []))];
  return {
    id: `article:${article.id}`, kind: "article", href: `/semiconductor-watch/${article.id}`,
    title: article.title, summary: article.summary, reason: entry?.reason,
    companyNames: article.companyNames, date: article.publishedAt, dateLabel: article.sourceName.includes("SEC") ? "SEC公表" : "発表",
    updatedAt: [article.updatedAt, entry?.checkedAt ?? "", entry?.readingUpdatedAt ? `${entry.readingUpdatedAt}T00:00:00+09:00` : ""].sort().at(-1)!,
    updateLabel: article.version > 1 ? `内容改訂・第${article.version}版` : "掲載・背景編集",
    primaryTopic: entry?.primaryTopic ?? topics[0] ?? "design", topics,
    status: entry?.statusLabel ?? stageLabels[article.stage] ?? "公式発表", visual: article.visual,
    changed: article.sourceCheck === "changed",
  };
}

export function articleProcessVisual(article: NewsArticle): WatchVisual {
  const processes = article.processes;
  return {
    kind: "process", label: "半導体の流れの中で見る",
    values: [
      { label: "01", value: "設計", active: processes.includes("Design") },
      { label: "02", value: "ウエハ製造", active: processes.some(p => ["Lithography","Deposition","Etch","Metrology","Materials"].includes(p)) },
      { label: "03", value: "組立・検査", active: processes.some(p => ["Assembly","Test"].includes(p)) },
    ],
    note: processes.length ? "一般的な工程の流れ。強調箇所は記事に関係する工程で、企業間の取引を示すものではありません。" : "一般的な工程の流れ。この発表では個別工程への影響を特定していません。",
  };
}

const earningsItems: WatchItem[] = earningsReleases.map(release => {
  const primaryTopic: WatchTopic = release.segment === "memory" ? "ai-memory" : "equipment";
  const topics: WatchTopic[] = [primaryTopic];
  if (release.themes.some(t => ["AI","HBM"].includes(t)) && !topics.includes("ai-memory")) topics.push("ai-memory");
  if (release.themes.includes("先端実装")) topics.push("packaging");
  if (release.themes.includes("設備投資")) topics.push("investment");
  const name = earningsCompanyName(release.companyId);
  return {
    id: `earnings:${release.id}`, kind: "earnings", href: `/semiconductor-watch/earnings/${release.companyId}`,
    title: `${name}の決算：事業の動きと見通しを読む`, summary: release.highlights[0]?.text ?? release.business,
    reason: release.editorialNote, companyNames: [name], date: release.announcedAt, dateLabel: "決算発表", updatedAt: release.checkedAt, updateLabel: "決算資料を確認",
    primaryTopic, topics, status: release.period.label,
    visual: { kind: "metric", label: `${release.period.label} / ${earningsFinancialScope(release)}`,
      values: [{ label: "売上高の前年同期比", value: earningsMetricText(release.metrics.revenueYoY, release, true), active: true }, { label: "対象事業", value: release.business }],
      note: `${release.accountingStandard}・${release.currency}。各社の対象期間・事業範囲は異なります。` },
  };
});
const projectItems: WatchItem[] = factoryProjects.map(project => ({
  id: `factory:${project.id}`, kind: "factory", href: "/guides/japan-semiconductor-factory-projects",
  title: `${project.name}：${project.stage}`, summary: project.actual, reason: project.note,
  companyNames: [companies.find(c => c.slug === project.companySlug)?.nameJa ?? project.name],
  date: project.checkedAt, dateLabel: "状況確認", updatedAt: project.checkedAt, updateLabel: "工場の状況を確認",
  primaryTopic: "investment", topics: ["investment"], status: project.stage,
  visual: { kind: "stage", label: project.location, values: [{ label: "確認した実績", value: project.actual, active: true }, { label: "今後の計画・対象範囲", value: project.planned }], note: project.note },
}));

export const watchItems: WatchItem[] = [...media.articles.map(articleWatchItem), ...earningsItems, ...projectItems];
export const watchHighlights = watchEditorial.highlights.flatMap(id => watchItems.find(item => item.id === id && !item.changed) ?? []).slice(0,3);
export const watchUpdatedAt = [watchEditorial.updatedAt, media.contentUpdatedAt, ...watchItems.map(item => item.updatedAt)].sort((a,b) => Date.parse(a)-Date.parse(b)).at(-1)!;
export const watchChanges = [...watchItems].sort((a,b) => Date.parse(b.updatedAt)-Date.parse(a.updatedAt) || a.id.localeCompare(b.id)).slice(0,8);

export function getArticleCompanies(article: NewsArticle) {
  return (getArticleEditorial(article)?.companyIds ?? []).flatMap(id => companies.find(c => c.id === id) ?? []);
}

export function isWatchMapTarget(href: string) {
  if (!href.startsWith("/industry-map#company=")) return true;
  const id = href.split("=")[1];
  return industryMapZones.some(zone => [...zone.companyIds, ...zone.supplementalCompanyIds].includes(id));
}
