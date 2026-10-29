import type { SemiconductorMarketCapCompany } from "@/data/semiconductor-market-cap";
import { semiconductorMarketCapHistory } from "@/data/semiconductor-market-cap-history";
import { findMarketCapComparisonSnapshot } from "@/lib/semiconductor-market-cap-growth";

export function getMarketCapPrevious(companies: readonly SemiconductorMarketCapCompany[], dataAsOf: string) {
  // Zero months finds the most recent retained snapshot at or before the current date.
  const { snapshot } = findMarketCapComparisonSnapshot(dataAsOf, 0, semiconductorMarketCapHistory);
  const history = semiconductorMarketCapHistory.find(item => item.dataAsOf === snapshot?.dataAsOf);
  const entries = new Map(history?.entries.map(entry => [entry.companyId, entry]) ?? []);
  return new Map(companies.flatMap(company => {
    const previous = entries.get(company.id);
    if (!previous || previous.marketCapUsdB <= 0) return [];
    return [[company.id, {
      previousMarketCapUsdB: previous.marketCapUsdB,
      previousRank: previous.sourceRank,
      changePercent: (company.marketCapUsdB - previous.marketCapUsdB) / previous.marketCapUsdB * 100,
      rankMovement: previous.sourceRank - company.rank,
    }] as const];
  }));
}
