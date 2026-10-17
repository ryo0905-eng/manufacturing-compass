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

// Confirm the same dated snapshot as the semiconductor ranking before enabling.
// Current values and the time machine's year-end values are not substitutes.
export const toyotaMarketCapReference: MarketCapReferenceSnapshot = {
  id: "toyota",
  name: "トヨタ自動車",
  comparisonLabel: "トヨタ",
  currency: "米ドル",
  dataAsOf: "2026-10-01",
  checkedAt: "2026-10-17",
  sourceName: "CompaniesMarketCap",
  sourceUrl: "https://companiesmarketcap.com/toyota/marketcap/",
  status: "pending",
  marketCapUsdB: null,
  reason: "出典ページの直近日次値は2026年10月16日分。2026年10月1日時点の値は未確認のため、参考比較の公開を保留。",
};
