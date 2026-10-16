import snapshot from "@/data/earnings-snapshot.json";
import { companies } from "@/data/companies";

export type EarningsSource = { documentId: string; locator: string; url?: string };
export type EarningsStatement = { text: string; source: EarningsSource };
export type EarningsMetric =
  | { status: "reported"; value: number; source: EarningsSource; calculation?: string; comparisonValue?: number }
  | { status: "unpublished" | "unretrieved"; reason: string };
export type EarningsRelease = {
  id: string;
  companyId: string;
  segment: "equipment" | "memory" | "fabless" | "foundry" | "idm";
  business: string;
  financialScope?: string;
  announcedAt: string;
  checkedAt: string;
  contentUpdatedAt?: string;
  version: number;
  period: { label: string; kind: "quarter" | "cumulative" | "full-year"; start: string | null; end: string };
  currency: "EUR" | "USD" | "JPY" | "KRW" | "TWD";
  unit: "million" | "billion";
  accountingStandard: string;
  documents: { id: string; title: string; url: string; kind: "html" | "pdf" }[];
  metrics: { revenue: EarningsMetric; operatingIncome: EarningsMetric; revenueYoY: EarningsMetric };
  highlights: EarningsStatement[];
  growth: EarningsStatement[];
  weakness: EarningsStatement[];
  concerns: EarningsStatement[];
  outlook: EarningsStatement[];
  change: EarningsStatement & { basis: string };
  forecastRevision: { status: "up" | "flat" | "down" | "unverified" | "unpublished"; target: string; text: string; source?: EarningsSource; previousSource?: EarningsSource };
  themes: string[];
  editorialNote: string;
  unverified: string[];
};
export type CommonEarningsTheme = {
  id: string;
  title: string;
  summary: string;
  theme: string;
  evidence: { companyId: string; source: EarningsSource }[];
};

const data = snapshot as { schemaVersion: number; updatedAt: string; releases: EarningsRelease[]; commonThemes: CommonEarningsTheme[] };
export const earningsUpdatedAt = data.updatedAt;
export const earningsReleases = [...data.releases].sort((a, b) => b.announcedAt.localeCompare(a.announcedAt));
export const commonEarningsThemes = data.commonThemes;
export const earningsThemeOptions = [...new Set(earningsReleases.flatMap((release) => release.themes))];
export const earningsSegments = { equipment: "製造装置", memory: "メモリ関連", fabless: "設計", foundry: "受託製造", idm: "設計・製造（IDM）" } as const;
export const earningsSegmentName = (segment: EarningsRelease["segment"]) => earningsSegments[segment];
export const earningsFinancialScope = (release: EarningsRelease) => release.financialScope ?? "連結全体";
export const earningsUnitName = (release: EarningsRelease) => {
  const unit = release.unit === "billion" ? "十億" : "百万";
  const currency = { EUR: "ユーロ", USD: "米ドル", JPY: "円", KRW: "ウォン", TWD: "台湾ドル" }[release.currency];
  return `${unit}${currency}`;
};

export function getEarningsRelease(companyId: string) {
  return earningsReleases.find((release) => release.companyId === companyId);
}

export function earningsCompanyName(companyId: string) {
  return companies.find((company) => company.id === companyId)?.nameJa ?? companyId;
}

export function earningsCompanySlug(companyId: string) {
  return companies.find((company) => company.id === companyId)?.slug ?? companyId;
}

export function earningsSourceHref(release: EarningsRelease, source: EarningsSource) {
  const document = release.documents.find((item) => item.id === source.documentId);
  const url = source.url ?? document?.url;
  if (!url) return null;
  const page = document?.kind === "pdf" ? /^p\.(\d+)/.exec(source.locator)?.[1] : null;
  return page ? `${url}#page=${page}` : url;
}

export function earningsMetricText(metric: EarningsMetric, release: EarningsRelease, percentage = false) {
  if (metric.status !== "reported") return metric.status === "unpublished" ? "未公表" : "未取得";
  if (percentage) return `${metric.value > 0 ? "+" : ""}${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(metric.value)}%`;
  if (release.currency === "KRW" && release.unit === "billion" && Math.abs(metric.value) >= 1000) {
    return `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 4 }).format(metric.value / 1000)} 兆ウォン`;
  }
  const value = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 3 }).format(metric.value);
  return `${value} ${earningsUnitName(release)}`;
}

/** Compact Japanese amounts, without converting between currencies. */
export function earningsCompactMetric(metric: EarningsMetric, release: EarningsRelease) {
  if (metric.status !== "reported") return earningsMetricText(metric, release);
  const amount = metric.value * (release.unit === "billion" ? 1_000_000_000 : 1_000_000);
  const unit = Math.abs(amount) >= 1_000_000_000_000 ? 1_000_000_000_000 : 100_000_000;
  const currency = { EUR: "ユーロ", USD: "米ドル", JPY: "円", KRW: "ウォン", TWD: "台湾ドル" }[release.currency];
  return `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 2 }).format(amount / unit)}${unit === 1_000_000_000_000 ? "兆" : "億"}${currency}`;
}

export function earningsBackground(release: EarningsRelease) {
  return release.segment === "equipment"
    ? { href: "/guides/semiconductor-equipment-sales-ranking", label: "装置メーカーの役割と規模を見る" }
    : release.segment === "memory"
      ? { href: "/guides/memory-manufacturer-ranking", label: "メモリメーカーの違いを見る" }
      : { href: "/guides/semiconductor-foundry", label: "設計・製造の役割を知る" };
}
