// Official branded widgets are enabled by default for this public information page.
// Set STOCK_MARKET_ENABLED=false and rebuild to remove Production access and discovery links.
export function isStockMarketAvailable(env: { NODE_ENV?: string; STOCK_MARKET_ENABLED?: string } = { NODE_ENV: process.env.NODE_ENV, STOCK_MARKET_ENABLED: process.env.STOCK_MARKET_ENABLED }) {
  return env.NODE_ENV !== "production" || isStockMarketIndexable(env);
}

export function isStockMarketIndexable(env: { STOCK_MARKET_ENABLED?: string } = { STOCK_MARKET_ENABLED: process.env.STOCK_MARKET_ENABLED }) {
  return env.STOCK_MARKET_ENABLED === undefined || env.STOCK_MARKET_ENABLED === "true";
}
