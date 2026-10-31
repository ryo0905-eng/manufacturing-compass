export type FoundryRankingRow = { rank: number; companyId: string; name: string; companySlug?: string; revenueUsdM: number; sharePct: number };

export const foundryRankingMeta = {
  period: "2026年4〜6月（2026Q2）", checkedAt: "2026-10-31", publisher: "TrendForce",
  revenueUnit: "百万米ドル", sourceSlug: "foundry-manufacturer-ranking",
} as const;

// 調査元の図表を転記。シェアを売上から再計算せず、丸め差・合計差も補正しない。
export const foundryMarket: { label: string; scope: string; source: { title: string; url: string; figureUrl: string; publishedAt: string }; rows: readonly FoundryRankingRow[] } = {
  label: "ファウンドリ",
  scope: "調査元が掲載する世界ファウンドリ上位10社。その他は掲載していません。",
  source: {
    title: "Global Foundry Revenue Approaches US$53.49 Billion in 2Q26 as SMIC Narrows Market Share Gap with Samsung",
    url: "https://www.trendforce.com/presscenter/news/20260909-13225.html",
    figureUrl: "https://img.trendforce.com/EDM/2026/09/20260909_140517_3.jpg",
    publishedAt: "2026-09-09",
  },
  rows: [
    { rank: 1, companyId: "tsmc", name: "TSMC", companySlug: "tsmc", revenueUsdM: 40198, sharePct: 72.5 },
    { rank: 2, companyId: "samsung", name: "Samsung Foundry", companySlug: "samsung-electronics", revenueUsdM: 3260, sharePct: 5.9 },
    { rank: 3, companyId: "smic", name: "SMIC", revenueUsdM: 3006, sharePct: 5.4 },
    { rank: 4, companyId: "umc", name: "UMC", revenueUsdM: 2175, sharePct: 3.9 },
    { rank: 5, companyId: "globalfoundries", name: "GlobalFoundries", companySlug: "globalfoundries", revenueUsdM: 1786, sharePct: 3.2 },
    { rank: 6, companyId: "huahong", name: "HuaHong Group", revenueUsdM: 1274, sharePct: 2.3 },
    { rank: 7, companyId: "tower", name: "Tower Semiconductor", revenueUsdM: 460, sharePct: 0.8 },
    { rank: 8, companyId: "vis", name: "VIS（Vanguard）", revenueUsdM: 451, sharePct: 0.8 },
    { rank: 9, companyId: "nexchip", name: "Nexchip", revenueUsdM: 447, sharePct: 0.8 },
    { rank: 10, companyId: "psmc", name: "PSMC", revenueUsdM: 432, sharePct: 0.8 },
  ],
};
