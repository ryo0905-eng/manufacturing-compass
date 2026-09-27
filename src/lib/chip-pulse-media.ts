import snapshot from "@/data/chip-pulse-media.json";
import type { PulseProcess, PulseThumbnail } from "@/data/chip-pulse";

export const newsFields = {
  all: "すべて", equipment: "装置・材料", "design-manufacturing": "設計・製造",
  memory: "メモリ", packaging: "後工程",
} as const;
export type NewsField = Exclude<keyof typeof newsFields, "all">;
export type NewsArticle = {
  id: string; sourceId: string; sourceName: string; sourceUrl: string;
  publishedAt: string; datePrecision: string; firstPublishedAt: string; updatedAt: string;
  version: number; title: string; summary: string; facts: string[]; unknowns: string[];
  fields: string[]; processes: PulseProcess[]; companyNames: string[]; stage: string;
  validation: string; evidence: { locator: string; quote: string }[];
  relatedIds: string[]; history: { version: number; updatedAt: string; title: string; summary: string }[];
  thumbnail?: PulseThumbnail; sourceCheck?: "changed";
};
export type NewsUpdate = { id: string; sourceId: string; sourceName: string; sourceUrl: string; title: string; publishedAt: string; datePrecision: string };
export type MediaSnapshot = {
  schemaVersion: number; contentUpdatedAt: string;
  edition: { date: string; start: string; end: string; articleIds: string[] };
  status: { checkedAt: string | null; lastSuccessfulAt: string | null; state: string; ai: string; sources: { id: string; state: string; checkedAt: string; lastSuccessfulAt: string | null }[] };
  articles: NewsArticle[]; updates: NewsUpdate[];
};
export const media = snapshot as MediaSnapshot;
export function newsDate(value: string, time = false) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.replaceAll("-", "/");
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", ...(time ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}) }).format(new Date(value));
}
export const latestArticles = [...media.articles].sort((a,b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
export const editionArticles = media.edition.articleIds.flatMap(id => media.articles.find(a => a.id === id) ?? []);
export const backgroundLinks = {
  equipment: { href: "/guides/semiconductor-equipment-sales-ranking", title: "装置メーカーの役割と規模を知る", text: "装置の市場全体と、企業ごとの対応工程を確認する。" },
  "design-manufacturing": { href: "/industry-map", title: "設計から製造までのつながり", text: "設計・ファウンドリ・装置・材料の役割を業界地図で読む。" },
  memory: { href: "/guides/memory-manufacturer-ranking", title: "DRAM・NANDとメモリメーカー", text: "メモリの種類と主要企業の違いを整理する。" },
  packaging: { href: "/guides/semiconductor-packaging-equipment-manufacturers", title: "後工程・パッケージングの基礎", text: "接続・封止などの役割と、工程ごとの装置を理解する。" },
};
