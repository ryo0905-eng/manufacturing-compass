import history from "@/data/earnings-history.json";
import type { AnnualSeries } from "./earnings-history-math";

export const annualHistoryUpdatedAt = history.updatedAt;
export const annualHistories = history.series as AnnualSeries[];
export function getAnnualHistory(companyId: string) {
  return annualHistories.find(series => series.companyId === companyId);
}
