import snapshot from "@/data/earnings-snapshot.json";
import { companies } from "@/data/companies";

export type EarningsSource = { documentId: string; locator: string; url?: string };
export type EarningsStatement = { text: string; source: EarningsSource };
export type EarningsMetric =
  | { status: "reported"; value: number; source: EarningsSource; calculation?: string }
  | { status: "unpublished" | "unretrieved"; reason: string };
export type EarningsRelease = {
  id: string;
  companyId: string;
  segment: "equipment" | "memory";
  business: string;
  financialScope?: string;
  announcedAt: string;
  checkedAt: string;
  version: number;
  period: { label: string; kind: "quarter" | "cumulative" | "full-year"; start: string | null; end: string };
  currency: "EUR" | "USD" | "JPY" | "KRW";
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
export const earningsSegmentName = (segment: EarningsRelease["segment"]) => segment === "memory" ? "メモリ関連" : "製造装置";
export const earningsFinancialScope = (release: EarningsRelease) => release.financialScope ?? "連結全体";
export const earningsUnitName = (release: EarningsRelease) => {
  const unit = release.unit === "billion" ? "十億" : "百万";
  const currency = { EUR: "ユーロ", USD: "米ドル", JPY: "円", KRW: "ウォン" }[release.currency];
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
