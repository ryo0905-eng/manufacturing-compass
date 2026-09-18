/** Preserve the source's million-USD unit; no currency conversion or annualization. */
export function formatMemoryRevenue(revenueUsdM: number) {
  return revenueUsdM.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
