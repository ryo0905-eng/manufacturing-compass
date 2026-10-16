import { inWatchWindow, readWatchHash, type WatchItem, type WatchTopic } from "./watch-types";

export type WatchCompany = {
  id: string; anchorId: string; name: string; segment: string; segmentLabel: string;
  topics: WatchTopic[]; href: string; announcedAt: string; period: string; periodKind: string; scope: string;
  revenueYoY: number | null; metricLabel: string; metricNote: string | null; sourceHref: string | null;
  checkedAt: string; summary: string; freshness: { state: string; text: string };
  nextEvent: { label: string; href: string } | null;
};
export type WatchSelection = { topic: WatchTopic | "all"; company: string | null };

export function companiesForTopic(companies: WatchCompany[], topic: WatchSelection["topic"]) {
  return companies.filter(company => topic === "all" || company.topics.includes(topic));
}

export function defaultWatchCompany(companies: WatchCompany[]) {
  return [...companies].sort((a, b) => b.announcedAt.localeCompare(a.announcedAt) || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function readWatchSelection(hash: string, companies: WatchCompany[]): WatchSelection {
  const topic = readWatchHash(hash);
  const requested = new URLSearchParams(hash.replace(/^#/, "")).get("company");
  const visible = companiesForTopic(companies, topic);
  return { topic, company: visible.some(company => company.id === requested) ? requested : defaultWatchCompany(visible) };
}

export function watchSelectionHash(selection: WatchSelection) {
  const params = new URLSearchParams();
  if (selection.topic !== "all") params.set("theme", selection.topic);
  if (selection.company) params.set("company", selection.company);
  return params.size ? `#${params}` : "#explore";
}

export function watchNewsForTopic(items: WatchItem[], topic: WatchSelection["topic"], now: string) {
  const seen = new Set<string>();
  return items.filter(item => item.kind === "article" && inWatchWindow(item.date, now) && (topic === "all" || item.topics.includes(topic)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id))
    .filter(item => { if (seen.has(item.href)) return false; seen.add(item.href); return true; });
}

export function relatedWatchNews(items: WatchItem[], companyId: string, now: string) {
  return watchNewsForTopic(items, "all", now).filter(item => item.companyIds.includes(companyId)).slice(0, 2);
}

export function watchChartDomain(companies: WatchCompany[]) {
  const values = companies.flatMap(company => company.revenueYoY !== null && Number.isFinite(company.revenueYoY) ? [company.revenueYoY] : []);
  const min = Math.floor(Math.min(0, ...values) / 50) * 50;
  const max = Math.max(50, Math.ceil(Math.max(0, ...values) / 50) * 50);
  return { min, max };
}

export function watchBar(value: number, domain: { min: number; max: number }) {
  const span = domain.max - domain.min;
  const zero = -domain.min / span * 100;
  return { zero, left: zero + Math.min(0, value) / span * 100, width: Math.abs(value) / span * 100 };
}
