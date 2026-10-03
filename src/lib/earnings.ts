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
  business: string;
  announcedAt: string;
  checkedAt: string;
  version: number;
  period: { label: string; kind: "quarter" | "cumulative" | "full-year"; start: string | null; end: string };
  currency: "EUR" | "USD" | "JPY";
  unit: "million";
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
  const value = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: percentage ? 1 : 3 }).format(metric.value);
  if (percentage) return `${metric.value > 0 ? "+" : ""}${value}%`;
  const unit = release.currency === "JPY" ? "百万円" : release.currency === "EUR" ? "百万ユーロ" : "百万米ドル";
  return `${value} ${unit}`;
}
