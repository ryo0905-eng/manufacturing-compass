export const stockMarketMeta = {
  route: "/semiconductor-watch/stocks",
  updatedAt: "2026-10-20",
  sources: {
    widgets: "https://www.tradingview.com/widget-docs/",
    performance: "https://www.tradingview.com/widget-docs/whats-new/",
    data: "https://www.tradingview.com/widget-docs/faq/data/",
    terms: "https://www.tradingview.com/policies/",
    northAmerica: "https://www.tradingview.com/widget-docs/markets/north-america/",
    asiaPacific: "https://www.tradingview.com/widget-docs/markets/asia-pacific/",
  },
} as const;

export type StockListing = {
  companyId: string;
  symbol: string;
  ticker: string;
  exchange: string;
  currency: "USD" | "JPY";
  listing: string;
  embedding: "candidate" | "verified" | "external";
  sourceUrl: string;
  checkedAt: string;
  displayVerifiedAt: string | null;
};

// checkedAt is the identity/documentation check, not a quote timestamp or a display test.
// Candidates can be tried locally; production release requires the checks in the spec.
export const stockListings: readonly StockListing[] = [
  { companyId: "nvidia", symbol: "NASDAQ:NVDA", ticker: "NVDA", exchange: "NASDAQ", currency: "USD", listing: "米国上場株", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-NVDA/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "amd", symbol: "NASDAQ:AMD", ticker: "AMD", exchange: "NASDAQ", currency: "USD", listing: "米国上場株", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-AMD/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "broadcom", symbol: "NASDAQ:AVGO", ticker: "AVGO", exchange: "NASDAQ", currency: "USD", listing: "米国上場株", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-AVGO/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "tsmc", symbol: "NYSE:TSM", ticker: "TSM", exchange: "NYSE", currency: "USD", listing: "米国預託証券（ADR）・台湾上場株とは別の価格", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NYSE-TSM/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "qualcomm", symbol: "NASDAQ:QCOM", ticker: "QCOM", exchange: "NASDAQ", currency: "USD", listing: "米国上場株", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-QCOM/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "intel", symbol: "NASDAQ:INTC", ticker: "INTC", exchange: "NASDAQ", currency: "USD", listing: "米国上場株", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-INTC/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "asml", symbol: "NASDAQ:ASML", ticker: "ASML", exchange: "NASDAQ", currency: "USD", listing: "米国上場の記名株式・欧州上場株とは別の価格", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-ASML/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "applied-materials", symbol: "NASDAQ:AMAT", ticker: "AMAT", exchange: "NASDAQ", currency: "USD", listing: "米国上場株", embedding: "candidate", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-AMAT/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "tokyo-electron", symbol: "TSE:8035", ticker: "8035", exchange: "東証", currency: "JPY", listing: "日本上場株・外部サイトで確認", embedding: "external", sourceUrl: "https://www.tradingview.com/symbols/TSE-8035/", checkedAt: "2026-10-20", displayVerifiedAt: null },
  { companyId: "advantest", symbol: "TSE:6857", ticker: "6857", exchange: "東証", currency: "JPY", listing: "日本上場株・外部サイトで確認", embedding: "external", sourceUrl: "https://www.tradingview.com/symbols/TSE-6857/", checkedAt: "2026-10-20", displayVerifiedAt: null },
];

export type StockIndex = {
  id: string; name: string; symbol: string; description: string;
  sourceUrl: string; embedding: "external" | "verified"; displayVerifiedAt: string | null;
};

// Do not substitute CFDs, futures or ETFs for these indices. Enable only after a real display check.
export const stockIndices: readonly StockIndex[] = [
  { id: "sox", name: "SOX", symbol: "NASDAQ:SOX", description: "フィラデルフィア半導体株指数。半導体関連株の動きを見る。", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-SOX/", embedding: "external", displayVerifiedAt: null },
  { id: "nasdaq", name: "NASDAQ総合", symbol: "NASDAQ:IXIC", description: "NASDAQ市場の総合指数。NASDAQ100とは異なる。", sourceUrl: "https://www.tradingview.com/symbols/NASDAQ-IXIC/", embedding: "external", displayVerifiedAt: null },
  { id: "sp500", name: "S&P500", symbol: "SP:SPX", description: "米国の主要企業で構成される、幅広い市場の参考指数。", sourceUrl: "https://www.tradingview.com/symbols/SP-SPX/", embedding: "external", displayVerifiedAt: null },
  { id: "nikkei", name: "日経平均", symbol: "INDEX:NKY", description: "日本の代表的な株価指数。半導体以外の企業も含む。", sourceUrl: "https://www.tradingview.com/symbols/INDEX-NKY/", embedding: "external", displayVerifiedAt: null },
];
