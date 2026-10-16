import editorialData from "@/data/watch-editorial.json";
import { companies } from "@/data/companies";
import { factoryProjects } from "@/data/factory-projects";
import { industryMapZones } from "@/data/industry-map";
import { media, type NewsArticle } from "./chip-pulse-media";
import { earningsReleases, earningsCompanyName, earningsFinancialScope, earningsMetricText, earningsSegments, earningsSourceHref, type EarningsRelease } from "./earnings";
import { earningsFreshness, nextCompanyEvent, watchCalendar, watchEventDate, type WatchCalendar } from "./watch-calendar";
import type { WatchCompany } from "./watch-explorer";
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
    companyNames: article.companyNames,
    companyIds: entry?.companyIds ?? (companies.some(company => company.id === article.sourceId) ? [article.sourceId] : []),
    date: article.publishedAt, dateLabel: article.sourceName.includes("SEC") ? "SEC公表" : "発表",
    updatedAt: article.updatedAt,
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

function earningsWatchTopics(release: EarningsRelease) {
  const primaryTopic: WatchTopic = release.segment === "memory" || release.segment === "fabless" ? "ai-memory" : release.segment === "equipment" ? "equipment" : "design";
  const topics: WatchTopic[] = [primaryTopic];
  if (release.themes.some(t => ["AI","HBM"].includes(t)) && !topics.includes("ai-memory")) topics.push("ai-memory");
  if (release.themes.includes("先端実装")) topics.push("packaging");
  if (release.themes.includes("設備投資")) topics.push("investment");
  return { primaryTopic, topics };
}

const earningsItems: WatchItem[] = earningsReleases.map(release => {
  const { primaryTopic, topics } = earningsWatchTopics(release);
  const name = earningsCompanyName(release.companyId);
  return {
    id: `earnings:${release.id}`, kind: "earnings", href: `/semiconductor-watch/earnings/${release.companyId}`,
    title: `${name}の決算：事業の動きと見通しを読む`, summary: release.highlights[0]?.text ?? release.business,
    reason: release.editorialNote, companyNames: [name], companyIds: [release.companyId], date: release.announcedAt, dateLabel: "決算発表", updatedAt: release.contentUpdatedAt ?? release.checkedAt, updateLabel: "決算内容を更新",
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
  companyIds: companies.filter(c => c.slug === project.companySlug).map(c => c.id),
  date: project.checkedAt, dateLabel: "状況確認", updatedAt: project.checkedAt, updateLabel: "工場の状況を確認",
  primaryTopic: "investment", topics: ["investment"], status: project.stage,
  visual: { kind: "stage", label: project.location, values: [{ label: "確認した実績", value: project.actual, active: true }, { label: "今後の計画・対象範囲", value: project.planned }], note: project.note },
}));

export const watchItems: WatchItem[] = [...media.articles.map(articleWatchItem), ...earningsItems, ...projectItems];

// A release already covered by earnings has one destination, not a second news row.
export function buildWatchNews(articles = media.articles, releases = earningsReleases) {
  const sourceKey = (url: string) => url.split("#")[0].replace(/\/$/, "");
  const earningsSources = new Set(releases.flatMap(release => release.documents.map(document => sourceKey(document.url))));
  return articles.filter(article => !earningsSources.has(sourceKey(article.sourceUrl))).map(articleWatchItem);
}

export function buildWatchCompanies(now: string, releases: EarningsRelease[] = earningsReleases, calendar: WatchCalendar = watchCalendar): WatchCompany[] {
  const segmentOrder = Object.keys(earningsSegments);
  return releases.map(release => {
    const metric = release.metrics.revenueYoY;
    const freshness = earningsFreshness(release, now, calendar.companies);
    const event = nextCompanyEvent(release.companyId, now, "earnings", calendar.events);
    const knownEvent = event ?? calendar.events.find(item => item.companyId === release.companyId && item.kind === "earnings");
    const { topics } = earningsWatchTopics(release);
    return {
      id: release.companyId, anchorId: `signal-${release.id}`, name: earningsCompanyName(release.companyId),
      segment: release.segment, segmentLabel: earningsSegments[release.segment], topics,
      href: `/semiconductor-watch/earnings/${release.companyId}`, announcedAt: release.announcedAt,
      period: release.period.label, scope: earningsFinancialScope(release),
      periodKind: release.period.kind === "quarter" ? "単四半期" : release.period.kind === "cumulative" ? "累計" : "通期",
      revenueYoY: metric.status === "reported" && Number.isFinite(metric.value) ? metric.value : null,
      metricLabel: metric.status === "reported" && !Number.isFinite(metric.value) ? "未取得" : earningsMetricText(metric, release, true),
      metricNote: metric.status === "reported" ? null : metric.reason,
      sourceHref: metric.status === "reported" ? earningsSourceHref(release, metric.source) : release.documents[0]?.url ?? null,
      checkedAt: release.checkedAt, summary: release.highlights[0]?.text ?? release.business,
      freshness: { state: freshness.state, text: freshness.text },
      nextEvent: knownEvent ? {
        label: knownEvent.date && !event ? "予定日経過・結果確認中" : watchEventDate(knownEvent),
        href: knownEvent.sourceUrl,
      } : null,
    };
  }).sort((a, b) => segmentOrder.indexOf(a.segment) - segmentOrder.indexOf(b.segment) || a.id.localeCompare(b.id));
}
export const watchHighlights = watchEditorial.highlights.flatMap(id => watchItems.find(item => item.id === id && !item.changed) ?? []).slice(0,3);
export const watchUpdatedAt = [watchEditorial.updatedAt, media.contentUpdatedAt, watchCalendar.updatedAt, ...watchItems.map(item => item.updatedAt)].sort((a,b) => Date.parse(a)-Date.parse(b)).at(-1)!;
export const watchChanges = [...watchItems].sort((a,b) => Date.parse(b.updatedAt)-Date.parse(a.updatedAt) || a.id.localeCompare(b.id)).slice(0,8);

export function getArticleCompanies(article: NewsArticle) {
  return (getArticleEditorial(article)?.companyIds ?? []).flatMap(id => companies.find(c => c.id === id) ?? []);
}

export function isWatchMapTarget(href: string) {
  if (!href.startsWith("/industry-map#company=")) return true;
  const id = href.split("=")[1];
  return industryMapZones.some(zone => [...zone.companyIds, ...zone.supplementalCompanyIds].includes(id));
}

// Collection-only and background-check timestamps never make old news new.
export function recentWatchItems(items: WatchItem[], now: string, days: number) {
  const cutoff = Date.parse(now) - days * 86_400_000;
  return items.filter(item => item.kind !== "factory" && Date.parse(item.date) >= cutoff && Date.parse(item.date) <= Date.parse(now))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id));
}
