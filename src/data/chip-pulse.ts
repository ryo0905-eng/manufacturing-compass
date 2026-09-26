import {
  japanSemiconductorMarketCapRanking,
  semiconductorMarketCapMeta,
  worldSemiconductorMarketCapRanking,
} from "@/data/semiconductor-market-cap";

export const pulseUpdatedAt = "2026-09-26T07:30:00+09:00";
export const pulseDisplayDate = "2026.09.26 07:30 JST";
export const pulseMarketCapAsOf = semiconductorMarketCapMeta.dataAsOf;

export const pulseRegions = ["Japan", "US", "Taiwan", "Korea", "China", "Europe"] as const;
export type PulseRegion = (typeof pulseRegions)[number];

export const pulseCategories = ["Fabless", "Foundry", "Equipment", "Memory", "Materials", "IDM"] as const;
export type PulseCategory = (typeof pulseCategories)[number];

export const pulseThemeIds = [
  "AI",
  "HBM",
  "EUV",
  "Advanced Packaging",
  "SiC",
  "Automotive",
  "China",
  "Foundry",
] as const;
export type PulseThemeId = (typeof pulseThemeIds)[number];

export type PulseFilters = {
  region: "Global" | PulseRegion;
  category: "All" | PulseCategory;
  theme: "All" | PulseThemeId;
};

export type PulseCompany = {
  id: string;
  name: string;
  shortName: string;
  ticker: string;
  region: PulseRegion;
  category: PulseCategory;
  themes: PulseThemeId[];
  marketCapUsdB: number;
  changePercent: number;
  companySlug?: string;
};

export type PulseSignal = {
  id: string;
  occurredAt: string;
  timeLabel: string;
  title: string;
  summary: string;
  impact: string;
  companyIds: string[];
  regions: PulseRegion[];
  categories: PulseCategory[];
  themes: PulseThemeId[];
  importance: 1 | 2 | 3;
  tone: "positive" | "negative" | "mixed" | "neutral";
  kind: "investment" | "product" | "policy" | "market" | "earnings";
};

export type PulseTheme = {
  id: PulseThemeId;
  label: string;
  score: number;
  change: number;
  direction: "up" | "down" | "flat";
  series: number[];
  note: string;
};

export type PulseEvent = {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  eventType: "earnings" | "product" | "conference" | "investor" | "macro";
  companyIds: string[];
  regions: PulseRegion[];
  categories: PulseCategory[];
  themes: PulseThemeId[];
};

export type PulseBriefLine = {
  id: string;
  text: string;
  companyIds: string[];
  regions: PulseRegion[];
  categories: PulseCategory[];
  themes: PulseThemeId[];
  priority: number;
};

const marketCapRows = [...worldSemiconductorMarketCapRanking, ...japanSemiconductorMarketCapRanking];

function marketCap(id: string) {
  const company = marketCapRows.find((row) => row.id === id);
  if (!company) throw new Error(`Chip Pulse: market cap is missing for ${id}`);
  return company.marketCapUsdB;
}

export const pulseCompanies: PulseCompany[] = [
  { id: "nvidia", name: "NVIDIA", shortName: "NVIDIA", ticker: "NVDA", region: "US", category: "Fabless", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("nvidia"), changePercent: 2.8, companySlug: "nvidia" },
  { id: "amd", name: "AMD", shortName: "AMD", ticker: "AMD", region: "US", category: "Fabless", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("amd"), changePercent: 1.4, companySlug: "amd" },
  { id: "broadcom", name: "Broadcom", shortName: "Broadcom", ticker: "AVGO", region: "US", category: "Fabless", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("broadcom"), changePercent: 1.9, companySlug: "broadcom" },
  { id: "tsmc", name: "TSMC", shortName: "TSMC", ticker: "TSM", region: "Taiwan", category: "Foundry", themes: ["AI", "EUV", "Advanced Packaging", "Foundry"], marketCapUsdB: marketCap("tsmc"), changePercent: 0.8, companySlug: "tsmc" },
  { id: "smic", name: "SMIC", shortName: "SMIC", ticker: "0981.HK", region: "China", category: "Foundry", themes: ["China", "Foundry"], marketCapUsdB: marketCap("smic"), changePercent: -1.4 },
  { id: "micron", name: "Micron Technology", shortName: "Micron", ticker: "MU", region: "US", category: "Memory", themes: ["AI", "HBM"], marketCapUsdB: marketCap("micron"), changePercent: 3.4, companySlug: "micron" },
  { id: "sk-hynix", name: "SK hynix", shortName: "SK hynix", ticker: "000660.KS", region: "Korea", category: "Memory", themes: ["AI", "HBM"], marketCapUsdB: marketCap("sk-hynix"), changePercent: 2.6, companySlug: "sk-hynix" },
  { id: "cxmt", name: "CXMT", shortName: "CXMT", ticker: "688825.SS", region: "China", category: "Memory", themes: ["HBM", "China"], marketCapUsdB: marketCap("cxmt"), changePercent: -1.7 },
  { id: "asml", name: "ASML", shortName: "ASML", ticker: "ASML", region: "Europe", category: "Equipment", themes: ["AI", "EUV", "China"], marketCapUsdB: marketCap("asml"), changePercent: 1.7, companySlug: "asml" },
  { id: "applied-materials", name: "Applied Materials", shortName: "Applied", ticker: "AMAT", region: "US", category: "Equipment", themes: ["HBM", "Advanced Packaging", "China"], marketCapUsdB: marketCap("applied-materials"), changePercent: 0.9, companySlug: "applied-materials" },
  { id: "lam-research", name: "Lam Research", shortName: "Lam", ticker: "LRCX", region: "US", category: "Equipment", themes: ["HBM", "Advanced Packaging", "China"], marketCapUsdB: marketCap("lam-research"), changePercent: 1.2, companySlug: "lam-research" },
  { id: "kla", name: "KLA", shortName: "KLA", ticker: "KLAC", region: "US", category: "Equipment", themes: ["AI", "EUV", "China"], marketCapUsdB: marketCap("kla"), changePercent: 0.4, companySlug: "kla" },
  { id: "tokyo-electron", name: "Tokyo Electron", shortName: "TEL", ticker: "8035.T", region: "Japan", category: "Equipment", themes: ["HBM", "EUV", "Advanced Packaging", "China"], marketCapUsdB: marketCap("tokyo-electron"), changePercent: 1.5, companySlug: "tokyo-electron" },
  { id: "advantest", name: "Advantest", shortName: "Advantest", ticker: "6857.T", region: "Japan", category: "Equipment", themes: ["AI", "HBM", "Advanced Packaging"], marketCapUsdB: marketCap("advantest"), changePercent: 3.0, companySlug: "advantest" },
  { id: "disco", name: "DISCO", shortName: "DISCO", ticker: "6146.T", region: "Japan", category: "Equipment", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("disco"), changePercent: 2.1, companySlug: "disco" },
  { id: "screen", name: "SCREEN Holdings", shortName: "SCREEN", ticker: "7735.T", region: "Japan", category: "Equipment", themes: ["HBM", "Advanced Packaging"], marketCapUsdB: marketCap("screen"), changePercent: 0.7, companySlug: "screen" },
  { id: "naura", name: "NAURA Technology", shortName: "NAURA", ticker: "002371.SZ", region: "China", category: "Equipment", themes: ["China", "Foundry"], marketCapUsdB: marketCap("naura"), changePercent: -0.9 },
  { id: "sumco", name: "SUMCO", shortName: "SUMCO", ticker: "3436.T", region: "Japan", category: "Materials", themes: ["Automotive", "Foundry"], marketCapUsdB: marketCap("sumco"), changePercent: -0.8, companySlug: "sumco" },
  { id: "intel", name: "Intel", shortName: "Intel", ticker: "INTC", region: "US", category: "IDM", themes: ["AI", "EUV", "Advanced Packaging", "Foundry"], marketCapUsdB: marketCap("intel"), changePercent: -0.6, companySlug: "intel" },
  { id: "samsung-electronics", name: "Samsung Electronics", shortName: "Samsung", ticker: "005930.KS", region: "Korea", category: "IDM", themes: ["AI", "HBM", "EUV", "Foundry"], marketCapUsdB: marketCap("samsung-electronics"), changePercent: 1.1, companySlug: "samsung-electronics" },
  { id: "renesas", name: "Renesas Electronics", shortName: "Renesas", ticker: "6723.T", region: "Japan", category: "IDM", themes: ["Automotive", "SiC"], marketCapUsdB: marketCap("renesas"), changePercent: -1.1, companySlug: "renesas" },
  { id: "rohm", name: "ROHM", shortName: "ROHM", ticker: "6963.T", region: "Japan", category: "IDM", themes: ["Automotive", "SiC"], marketCapUsdB: marketCap("rohm"), changePercent: -0.5, companySlug: "rohm" },
];

export const pulseSignals: PulseSignal[] = [
  { id: "micron-hbm", occurredAt: "2026-09-26T06:40:00+09:00", timeLabel: "06:40", title: "Micron：HBM増産計画を発表", summary: "AI向けメモリ需要を背景に、次世代HBMの供給能力拡大を示した想定シグナルです。", impact: "メモリ企業だけでなく、成膜・エッチング・テスト装置への波及を探索できます。", companyIds: ["micron", "sk-hynix", "advantest"], regions: ["US", "Korea", "Japan"], categories: ["Memory", "Equipment"], themes: ["AI", "HBM"], importance: 3, tone: "positive", kind: "investment" },
  { id: "asml-regulation", occurredAt: "2026-09-26T05:55:00+09:00", timeLabel: "05:55", title: "ASML：中国向け輸出規制の観測", summary: "露光装置の輸出条件を巡る報道が装置セクターの変動要因になった想定です。", impact: "欧州装置企業と中国ファウンドリの両方に関連するため、地域横断で確認します。", companyIds: ["asml", "smic"], regions: ["Europe", "China"], categories: ["Equipment", "Foundry"], themes: ["EUV", "China", "Foundry"], importance: 3, tone: "mixed", kind: "policy" },
  { id: "tsmc-capex", occurredAt: "2026-09-26T04:20:00+09:00", timeLabel: "04:20", title: "TSMC：設備投資計画を更新", summary: "先端プロセスと先端パッケージへの投資配分が注目された想定ニュースです。", impact: "ファウンドリから装置、検査、後工程までの関連企業を追う起点になります。", companyIds: ["tsmc", "applied-materials", "tokyo-electron", "disco"], regions: ["Taiwan", "US", "Japan"], categories: ["Foundry", "Equipment"], themes: ["AI", "EUV", "Advanced Packaging", "Foundry"], importance: 3, tone: "positive", kind: "investment" },
  { id: "nvidia-ai-demand", occurredAt: "2026-09-26T02:35:00+09:00", timeLabel: "02:35", title: "NVIDIA：AIアクセラレーター需要が継続", summary: "データセンター投資の継続が関連企業のセンチメントを支えた想定です。", impact: "GPU単体ではなく、ファウンドリ、HBM、テストまで一連の供給網を確認します。", companyIds: ["nvidia", "tsmc", "sk-hynix", "advantest"], regions: ["US", "Taiwan", "Korea", "Japan"], categories: ["Fabless", "Foundry", "Memory", "Equipment"], themes: ["AI", "HBM", "Advanced Packaging"], importance: 3, tone: "positive", kind: "market" },
  { id: "tel-product", occurredAt: "2026-09-25T23:10:00+09:00", timeLabel: "23:10", title: "Tokyo Electron：新プロセス装置を発表", summary: "微細化と積層化を支える新製品が材料・装置株の比較材料になった想定です。", impact: "製品発表を、対応工程と関連企業へつなげるデモケースです。", companyIds: ["tokyo-electron", "screen", "sumco"], regions: ["Japan"], categories: ["Equipment", "Materials"], themes: ["HBM", "EUV", "Advanced Packaging"], importance: 2, tone: "positive", kind: "product" },
  { id: "china-memory", occurredAt: "2026-09-25T21:45:00+09:00", timeLabel: "21:45", title: "中国メモリ企業：供給拡大観測", summary: "中国のメモリ供給能力を巡る観測が価格見通しの重しになった想定です。", impact: "規制と供給増を分け、MemoryとChinaテーマの双方から確認します。", companyIds: ["cxmt", "micron", "sk-hynix"], regions: ["China", "US", "Korea"], categories: ["Memory"], themes: ["HBM", "China"], importance: 2, tone: "negative", kind: "market" },
  { id: "renesas-auto", occurredAt: "2026-09-25T19:30:00+09:00", timeLabel: "19:30", title: "Renesas：車載需要の回復は緩やか", summary: "車載半導体の在庫調整が継続する想定で、AI関連との温度差が表れています。", impact: "同じ半導体業界でも、用途別に方向感が異なることを示します。", companyIds: ["renesas", "rohm"], regions: ["Japan"], categories: ["IDM"], themes: ["Automotive", "SiC"], importance: 2, tone: "negative", kind: "market" },
  { id: "advanced-packaging", occurredAt: "2026-09-25T16:15:00+09:00", timeLabel: "16:15", title: "先端パッケージ：装置需要への波及に注目", summary: "チップレットと積層化への投資が、加工・接合・検査企業へ広がる想定です。", impact: "企業単位では見えにくい工程横断テーマとして追跡します。", companyIds: ["tsmc", "applied-materials", "disco", "advantest"], regions: ["Taiwan", "US", "Japan"], categories: ["Foundry", "Equipment"], themes: ["AI", "HBM", "Advanced Packaging"], importance: 2, tone: "positive", kind: "market" },
  { id: "intel-foundry", occurredAt: "2026-09-25T12:40:00+09:00", timeLabel: "12:40", title: "Intel：ファウンドリ計画の進捗を説明", summary: "投資負担と顧客獲得の両面が評価材料になった想定ニュースです。", impact: "IDMとFoundryの二つの見方を持つ企業として整理します。", companyIds: ["intel"], regions: ["US"], categories: ["IDM"], themes: ["EUV", "Advanced Packaging", "Foundry"], importance: 2, tone: "mixed", kind: "earnings" },
  { id: "sumco-wafer", occurredAt: "2026-09-25T09:05:00+09:00", timeLabel: "09:05", title: "SUMCO：ウェーハ需給の回復時期に慎重", summary: "材料側では設備稼働率と在庫の正常化が引き続き焦点という想定です。", impact: "デバイス企業の上昇と材料企業の回復速度が一致しない例として確認します。", companyIds: ["sumco"], regions: ["Japan"], categories: ["Materials"], themes: ["Automotive", "Foundry"], importance: 1, tone: "negative", kind: "market" },
];

export const pulseThemes: PulseTheme[] = [
  { id: "AI", label: "AI Compute", score: 86, change: 9, direction: "up", series: [61, 66, 64, 72, 75, 79, 86], note: "GPU、ファウンドリ、HBM、テストが同時に強い" },
  { id: "HBM", label: "HBM", score: 91, change: 12, direction: "up", series: [58, 61, 68, 72, 78, 82, 91], note: "増産観測とテスト需要が追い風" },
  { id: "EUV", label: "EUV", score: 67, change: 3, direction: "up", series: [60, 62, 64, 63, 65, 64, 67], note: "投資期待と規制観測が交錯" },
  { id: "Advanced Packaging", label: "Advanced Packaging", score: 82, change: 7, direction: "up", series: [63, 65, 69, 71, 73, 78, 82], note: "接合・加工・検査へ関心が拡大" },
  { id: "SiC", label: "SiC", score: 46, change: -2, direction: "down", series: [55, 53, 51, 49, 50, 48, 46], note: "車載需要の回復待ち" },
  { id: "Automotive", label: "Automotive", score: 41, change: -6, direction: "down", series: [59, 57, 54, 52, 48, 45, 41], note: "在庫調整が重し" },
  { id: "China", label: "China Regulation", score: 34, change: -8, direction: "down", series: [55, 52, 49, 46, 43, 38, 34], note: "輸出規制と供給増観測を警戒" },
  { id: "Foundry", label: "Foundry", score: 63, change: 1, direction: "flat", series: [61, 60, 62, 64, 62, 63, 63], note: "先端投資は強いが地域差あり" },
];

export const pulseEvents: PulseEvent[] = [
  { id: "micron-earnings", date: "2026-09-28", dateLabel: "9/28 MON", title: "Micron 決算説明会（デモ）", eventType: "earnings", companyIds: ["micron"], regions: ["US"], categories: ["Memory"], themes: ["AI", "HBM"] },
  { id: "japan-equipment-day", date: "2026-09-29", dateLabel: "9/29 TUE", title: "日本の装置企業 投資家向けイベント（デモ）", eventType: "investor", companyIds: ["tokyo-electron", "screen", "advantest"], regions: ["Japan"], categories: ["Equipment"], themes: ["HBM", "Advanced Packaging"] },
  { id: "asml-product", date: "2026-09-30", dateLabel: "9/30 WED", title: "ASML 技術アップデート（デモ）", eventType: "product", companyIds: ["asml"], regions: ["Europe"], categories: ["Equipment"], themes: ["EUV"] },
  { id: "china-policy", date: "2026-10-01", dateLabel: "10/01 THU", title: "輸出規制に関する政策説明（デモ）", eventType: "macro", companyIds: ["asml", "smic", "naura"], regions: ["Europe", "China"], categories: ["Equipment", "Foundry"], themes: ["China", "EUV"] },
  { id: "packaging-forum", date: "2026-10-02", dateLabel: "10/02 FRI", title: "Advanced Packaging Forum（デモ）", eventType: "conference", companyIds: ["tsmc", "disco", "advantest"], regions: ["Taiwan", "Japan"], categories: ["Foundry", "Equipment"], themes: ["AI", "HBM", "Advanced Packaging"] },
  { id: "auto-semi", date: "2026-10-03", dateLabel: "10/03 SAT", title: "車載半導体サプライチェーン会合（デモ）", eventType: "conference", companyIds: ["renesas", "rohm"], regions: ["Japan"], categories: ["IDM"], themes: ["Automotive", "SiC"] },
];

export const pulseBriefLines: PulseBriefLine[] = [
  { id: "brief-ai", text: "AI・HBM関連が上昇を主導。メモリとテスト装置まで買いが広がっています。", companyIds: ["nvidia", "micron", "sk-hynix", "advantest"], regions: ["US", "Korea", "Japan"], categories: ["Fabless", "Memory", "Equipment"], themes: ["AI", "HBM"], priority: 10 },
  { id: "brief-equipment", text: "装置はEUV投資期待が支え。中国規制の観測が上値を抑える構図です。", companyIds: ["asml", "tokyo-electron", "applied-materials", "smic"], regions: ["Europe", "Japan", "US", "China"], categories: ["Equipment", "Foundry"], themes: ["EUV", "China"], priority: 9 },
  { id: "brief-packaging", text: "先端パッケージへの関心が、加工・接合・検査企業へ波及しています。", companyIds: ["tsmc", "disco", "advantest"], regions: ["Taiwan", "Japan"], categories: ["Foundry", "Equipment"], themes: ["Advanced Packaging", "AI"], priority: 8 },
  { id: "brief-japan", text: "日本株はAIテスト関連が強い一方、材料・車載は回復待ちです。", companyIds: ["advantest", "sumco", "renesas", "rohm"], regions: ["Japan"], categories: ["Equipment", "Materials", "IDM"], themes: ["AI", "Automotive", "SiC"], priority: 7 },
  { id: "brief-memory", text: "HBM投資がメモリの追い風。中国の供給拡大観測は価格面の注意材料です。", companyIds: ["micron", "sk-hynix", "cxmt"], regions: ["US", "Korea", "China"], categories: ["Memory"], themes: ["HBM", "China"], priority: 6 },
  { id: "brief-foundry", text: "ファウンドリは先端投資が堅調。投資負担と地域差も確認したい局面です。", companyIds: ["tsmc", "smic", "intel", "samsung-electronics"], regions: ["Taiwan", "China", "US", "Korea"], categories: ["Foundry", "IDM"], themes: ["Foundry", "EUV"], priority: 5 },
  { id: "brief-auto", text: "車載・SiCは在庫調整が重く、AI関連との温度差が続いています。", companyIds: ["renesas", "rohm"], regions: ["Japan"], categories: ["IDM"], themes: ["Automotive", "SiC"], priority: 4 },
  { id: "brief-china", text: "中国関連は規制と供給能力拡大の二つの材料が交錯しています。", companyIds: ["smic", "naura", "cxmt", "asml"], regions: ["China", "Europe"], categories: ["Foundry", "Equipment", "Memory"], themes: ["China"], priority: 3 },
];
