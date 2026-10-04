export const watchTopics = [
  { id: "ai-memory", label: "AI・メモリ", description: "AIを支える計算と記憶", href: "/guides/memory-manufacturer-ranking", linkLabel: "DRAM・NANDと企業の違いを知る" },
  { id: "equipment", label: "製造装置・材料", description: "つくる技術と、その供給側", href: "/guides/semiconductor-equipment-sales-ranking", linkLabel: "装置メーカーの役割と規模を比べる" },
  { id: "design", label: "設計・受託製造", description: "設計する会社、製造する会社", href: "/guides/semiconductor-foundry", linkLabel: "受託製造の仕組みを知る" },
  { id: "packaging", label: "先端実装・後工程", description: "チップをつなぎ、製品にする", href: "/guides/semiconductor-packaging-process", linkLabel: "組立・検査の工程を知る" },
  { id: "investment", label: "工場・設備投資", description: "計画から生産までを追う", href: "/guides/japan-semiconductor-factory-projects", linkLabel: "国内の工場計画と実績を比べる" },
] as const;

export type WatchTopic = typeof watchTopics[number]["id"];
export type WatchDestination = "article" | "earnings" | "factory" | "company" | "industry_map" | "compare" | "guide" | "ranking" | "source";
export type WatchVisual = {
  kind: "process" | "metric" | "stage" | "allocation";
  label: string;
  values: { label: string; value: string; active?: boolean }[];
  note: string;
};
export type WatchItem = {
  id: string; kind: "article" | "earnings" | "factory"; href: string;
  title: string; summary: string; reason?: string; companyNames: string[];
  date: string; dateLabel: string; updatedAt: string; updateLabel: string;
  primaryTopic: WatchTopic; topics: WatchTopic[]; status: string;
  visual?: WatchVisual; changed?: boolean;
};
export type WatchLink = { href: string; label: string; destination: WatchDestination };
export type WatchArticleEditorial = {
  version: number; checkedAt: string; sourceUrls: string[]; companyIds: string[];
  sourceTitle: string;
  primaryTopic: WatchTopic; topics: WatchTopic[]; reason: string;
  termIds: string[]; links: WatchLink[]; statusLabel?: string;
};
export type WatchEditorial = {
  updatedAt: string;
  highlights: string[];
  articles: Record<string, WatchArticleEditorial>;
  terms: Record<string, { label: string; text: string; href: string }>;
  sourceDestinations: Record<string, WatchLink>;
};

export function watchDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value.length === 10 ? `${value}T00:00:00+09:00` : value));
}

export function readWatchHash(hash: string): WatchTopic | "all" {
  const value = new URLSearchParams(hash.replace(/^#/, "")).get("theme");
  return watchTopics.find(topic => topic.id === value)?.id ?? "all";
}

export function inWatchWindow(value: string, now: string, days = 30) {
  const age = Date.parse(now) - Date.parse(value);
  return Number.isFinite(age) && age >= 0 && age <= days * 86_400_000;
}
