type MarketCapReferenceBase = {
  id: string;
  name: string;
  comparisonLabel: string;
  currency: string;
  dataAsOf: string;
  checkedAt: string;
  sourceName: "CompaniesMarketCap";
  sourceUrl: string;
};

export type MarketCapReferenceSnapshot = MarketCapReferenceBase & (
  | { status: "pending"; marketCapUsdB: null; reason: string }
  | { status: "verified"; marketCapUsdB: number }
);

// Verify alongside the semiconductor ranking; never substitute another date
// or the time machine's year-end values.
export const toyotaMarketCapReference: MarketCapReferenceSnapshot = {
  id: "toyota",
  name: "トヨタ自動車",
  comparisonLabel: "トヨタ",
  currency: "米ドル",
  dataAsOf: "2026-10-16",
  checkedAt: "2026-10-17",
  sourceName: "CompaniesMarketCap",
  sourceUrl: "https://companiesmarketcap.com/toyota/marketcap/",
  status: "verified",
  marketCapUsdB: 229.21,
};
