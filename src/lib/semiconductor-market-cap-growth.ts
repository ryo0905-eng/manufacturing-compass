import type { SemiconductorMarketCapCompany } from "@/data/semiconductor-market-cap";
import type { SemiconductorMarketCapHistorySnapshot } from "@/data/semiconductor-market-cap-history";

export type MarketCapGrowthMetric = "rate" | "amount";

export type MarketCapGrowthRow = {
  company: SemiconductorMarketCapCompany;
  previousMarketCapUsdB: number;
  changeUsdB: number;
  changePercent: number;
  growthRank: number;
  previousMarketCapRank: number;
  currentMarketCapRank: number;
  rankMovement: number;
};

export function subtractCalendarMonths(date: string, months: number) {
  const [year, month, day] = date.split("-").map(Number);
  const targetMonth = new Date(Date.UTC(year, month - 1 - months, 1));
  const lastDay = new Date(Date.UTC(targetMonth.getUTCFullYear(), targetMonth.getUTCMonth() + 1, 0)).getUTCDate();
  targetMonth.setUTCDate(Math.min(day, lastDay));
  return targetMonth.toISOString().slice(0, 10);
}

export function findMarketCapComparisonSnapshot(
  latestAsOf: string,
  months: number,
  snapshots: readonly SemiconductorMarketCapHistorySnapshot[],
) {
  const targetDate = subtractCalendarMonths(latestAsOf, months);
  const snapshot = snapshots
    .filter((candidate) => candidate.dataAsOf <= targetDate)
    .sort((first, second) => second.dataAsOf.localeCompare(first.dataAsOf))[0];

  return { targetDate, snapshot };
}

export function buildMarketCapGrowthRanking(
  companies: readonly SemiconductorMarketCapCompany[],
  snapshot: SemiconductorMarketCapHistorySnapshot | undefined,
  metric: MarketCapGrowthMetric,
  category = "all",
): MarketCapGrowthRow[] {
  if (!snapshot) return [];

  const previousByCompany = new Map(snapshot.entries.map((entry) => [entry.companyId, entry]));
  const comparable = companies.flatMap((company) => {
    const previous = previousByCompany.get(company.id);
    if (company.category !== category && category !== "all") return [];
    if (!previous || previous.marketCapUsdB <= 0) return [];
    const changeUsdB = company.marketCapUsdB - previous.marketCapUsdB;
    return [{
      company,
      previousMarketCapUsdB: previous.marketCapUsdB,
      changeUsdB,
      changePercent: (changeUsdB / previous.marketCapUsdB) * 100,
    }];
  });

  const rankByMarketCap = (value: (row: (typeof comparable)[number]) => number) => new Map(
    [...comparable]
      .sort((first, second) => value(second) - value(first) || first.company.id.localeCompare(second.company.id))
      .map((row, index) => [row.company.id, index + 1]),
  );
  const previousRanks = rankByMarketCap((row) => row.previousMarketCapUsdB);
  const currentRanks = rankByMarketCap((row) => row.company.marketCapUsdB);
  const sorted = [...comparable].sort((first, second) => {
    const firstValue = metric === "rate" ? first.changePercent : first.changeUsdB;
    const secondValue = metric === "rate" ? second.changePercent : second.changeUsdB;
    return secondValue - firstValue
      || second.company.marketCapUsdB - first.company.marketCapUsdB
      || first.company.id.localeCompare(second.company.id);
  });

  return sorted.map((row, index) => {
    const previousMarketCapRank = previousRanks.get(row.company.id) ?? index + 1;
    const currentMarketCapRank = currentRanks.get(row.company.id) ?? index + 1;
    return {
      ...row,
      growthRank: index + 1,
      previousMarketCapRank,
      currentMarketCapRank,
      rankMovement: previousMarketCapRank - currentMarketCapRank,
    };
  });
}

export function daysBetween(firstDate: string, secondDate: string) {
  const first = Date.parse(`${firstDate}T00:00:00Z`);
  const second = Date.parse(`${secondDate}T00:00:00Z`);
  return Math.round((second - first) / 86_400_000);
}
