// Server-side release gate. Local development stays reviewable without publishing embeds.
// Enable Production only after the licensing and display checks in docs/stock-market-spec.md.
export function isStockMarketAvailable(env: { NODE_ENV?: string; STOCK_MARKET_ENABLED?: string } = { NODE_ENV: process.env.NODE_ENV, STOCK_MARKET_ENABLED: process.env.STOCK_MARKET_ENABLED }) {
  return env.NODE_ENV !== "production" || env.STOCK_MARKET_ENABLED === "true";
}

export function isStockMarketIndexable(env: { STOCK_MARKET_ENABLED?: string } = { STOCK_MARKET_ENABLED: process.env.STOCK_MARKET_ENABLED }) {
  return env.STOCK_MARKET_ENABLED === "true";
}
