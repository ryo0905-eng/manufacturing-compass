import type { MarketCapReferenceSnapshot } from "@/data/semiconductor-market-cap-reference";

export function getMatchingMarketCapReference(
  reference: MarketCapReferenceSnapshot,
  ranking: { dataAsOf: string; currency: string },
) {
  if (
    reference.status !== "verified" ||
    reference.sourceName !== "CompaniesMarketCap" ||
    reference.dataAsOf !== ranking.dataAsOf ||
    reference.currency !== ranking.currency ||
    !Number.isFinite(reference.marketCapUsdB) ||
    reference.marketCapUsdB <= 0
  ) return undefined;

  return reference;
}

export function formatMarketCapUsdB(value: number) {
  return value >= 1000
    ? `${(value / 1000).toLocaleString("ja-JP", { maximumFractionDigits: 2 })}兆ドル`
    : `${(value * 10).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}億ドル`;
}
