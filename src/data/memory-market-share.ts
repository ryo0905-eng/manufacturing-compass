export type MemoryMarketId = "dram" | "nand";
export type MemoryRankingRow = {
  rank: number;
  companyId: string;
  name: string;
  companySlug?: string;
  revenueUsdM: number;
  sharePct: number;
};
export type MemoryMarket = {
  id: MemoryMarketId;
  label: string;
  scope: string;
  usage: string;
  note: string;
  source: { title: string; url: string; figureUrl: string; publishedAt: string };
  rows: readonly MemoryRankingRow[];
  others?: { revenueUsdM: number; sharePct: number };
};

export const memoryRankingMeta = {
  period: "2026年4〜6月（2026Q2）",
  checkedAt: "2026-09-18",
  publisher: "TrendForce",
  revenueUnit: "百万米ドル",
  sourceSlug: "memory-manufacturer-ranking",
} as const;

// 調査元の図表を転記。全社売上や出荷数量ではなく、各製品市場の売上とシェア。
// 市場間のシェア合算、掲載企業だけでの100%への再正規化は行わない。
export const memoryMarkets: Record<MemoryMarketId, MemoryMarket> = {
  dram: {
    id: "dram",
    label: "DRAM",
    scope: "調査元が掲載するブランドDRAMメーカー7社。その他は順位外で表示します。",
    usage: "処理中のデータを一時的に置くメモリです。電源を切るとデータは失われます。",
    note: "シェアは原表の掲載値です。その他を含む合計は99.97%ですが、丸め差を補正していません。",
    source: {
      title: "2026Q2 Branded DRAM Supplier Revenue Ranking",
      url: "https://www.trendforce.com/presscenter/news/20260907-13219.html",
      figureUrl: "https://img.trendforce.com/EDM/2026/09/20260907_144342_3.jpg",
      publishedAt: "2026-09-07",
    },
    rows: [
      { rank: 1, companyId: "samsung", name: "Samsung", companySlug: "samsung-electronics", revenueUsdM: 60981, sharePct: 39.4 },
      { rank: 2, companyId: "sk-hynix", name: "SK hynix", companySlug: "sk-hynix", revenueUsdM: 38590, sharePct: 24.9 },
      { rank: 3, companyId: "micron", name: "Micron", companySlug: "micron", revenueUsdM: 36000, sharePct: 23.3 },
      { rank: 4, companyId: "cxmt", name: "CXMT", revenueUsdM: 14624, sharePct: 9.5 },
      { rank: 5, companyId: "nanya", name: "Nanya", revenueUsdM: 2612, sharePct: 1.7 },
      { rank: 6, companyId: "winbond", name: "Winbond", revenueUsdM: 998, sharePct: 0.6 },
      { rank: 7, companyId: "psmc", name: "PSMC", revenueUsdM: 115, sharePct: 0.07 },
    ],
    others: { revenueUsdM: 808, sharePct: 0.5 },
  },
  nand: {
    id: "nand",
    label: "NAND",
    scope: "上場主要5社。世界の全企業を対象とした上位5社ではありません。",
    usage: "電源を切ってもデータを保持するメモリです。SSDなどの保存装置に使われます。",
    note: "掲載5社の市場シェア合計は87.6%です。5社だけで100%に換算せず、未掲載企業の順位やシェアも推測していません。SK hynix GroupにはSolidigmを含みます。",
    source: {
      title: "2026Q2 Revenue Ranking of Top Five NAND Flash Brands",
      url: "https://www.trendforce.com/presscenter/news/20260818-13186.html",
      figureUrl: "https://img.trendforce.com/EDM/2026/08/20260818_132451_3.jpg",
      publishedAt: "2026-08-18",
    },
    rows: [
      { rank: 1, companyId: "samsung", name: "Samsung", companySlug: "samsung-electronics", revenueUsdM: 23059.3, sharePct: 29.3 },
      { rank: 2, companyId: "sk-hynix", name: "SK hynix Group（Solidigm含む）", companySlug: "sk-hynix", revenueUsdM: 14272.9, sharePct: 18.2 },
      { rank: 3, companyId: "micron", name: "Micron", companySlug: "micron", revenueUsdM: 11850, sharePct: 15.1 },
      { rank: 4, companyId: "kioxia", name: "Kioxia", companySlug: "kioxia", revenueUsdM: 10723, sharePct: 13.6 },
      { rank: 5, companyId: "sandisk", name: "SanDisk", revenueUsdM: 8965, sharePct: 11.4 },
    ],
  },
};

export const memoryMarketIds: readonly MemoryMarketId[] = ["dram", "nand"];
