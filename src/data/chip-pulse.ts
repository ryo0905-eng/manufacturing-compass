import {
  japanSemiconductorMarketCapRanking,
  semiconductorMarketCapMeta,
  worldSemiconductorMarketCapRanking,
} from "@/data/semiconductor-market-cap";

export const pulseUpdatedAt = "2026-09-26T10:30:00+09:00";
export const pulseDisplayDate = "2026.09.26 10:30 JST";
export const pulseMarketCapAsOf = semiconductorMarketCapMeta.dataAsOf;

export const pulseRegions = ["Japan", "US", "Taiwan", "Korea", "China", "Europe"] as const;
export type PulseRegion = (typeof pulseRegions)[number];
export type PulseRegionFilter = "Global" | "Asia" | PulseRegion;

export const pulseCategories = ["Fabless", "Foundry", "Equipment", "Memory", "Materials", "IDM"] as const;
export type PulseCategory = (typeof pulseCategories)[number];

export const pulseThemeIds = ["AI", "HBM", "EUV", "Advanced Packaging", "SiC", "Automotive", "China", "Foundry"] as const;
export type PulseThemeId = (typeof pulseThemeIds)[number];

export type PulseFilters = {
  region: PulseRegionFilter;
  category: "All" | PulseCategory;
  theme: "All" | PulseThemeId;
};

export const pulseProcessLabels = {
  Design: "設計", Lithography: "露光", Deposition: "成膜", Etch: "エッチング",
  Metrology: "検査・計測", Assembly: "後工程・実装", Test: "テスト", Materials: "材料",
} as const;
export type PulseProcess = keyof typeof pulseProcessLabels;

export type PulseCompany = {
  id: string;
  name: string;
  shortName: string;
  ticker: string;
  region: PulseRegion;
  category: PulseCategory;
  themes: PulseThemeId[];
  marketCapUsdB: number;
  companySlug?: string;
};

export type PulseSignal = {
  id: string;
  occurredAt: string;
  timeLabel: string;
  title: string;
  summary: string;
  impact: string;
  primaryCompanyId?: string;
  companyIds: string[];
  processes: PulseProcess[];
  regions: PulseRegion[];
  categories: PulseCategory[];
  themes: PulseThemeId[];
  importance: 1 | 2 | 3;
  tone: "positive" | "negative" | "mixed" | "neutral";
  kind: "investment" | "product" | "policy" | "market" | "earnings";
  sourceName: string;
  sourceUrl: string;
  sourceType: "company" | "regulatory" | "industry";
};

export type PulseTheme = {
  id: PulseThemeId;
  label: string;
  signalCount: number;
  companyCount: number;
  latestAt: string;
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
  sourceName: string;
  sourceUrl: string;
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

export type PulseSnapshot = {
  schemaVersion: 1;
  mode: "source-backed";
  asOf: string;
  marketCapAsOf: string;
  companies: PulseCompany[];
  signals: PulseSignal[];
  events: PulseEvent[];
  briefLines: PulseBriefLine[];
};

export const pulseThemeDefinitions: Record<PulseThemeId, { label: string; note: string }> = {
  AI: { label: "AI Compute", note: "AIインフラ、製造、テストに関する公式更新" },
  HBM: { label: "HBM", note: "HBM・次世代DRAMに関する公式更新" },
  EUV: { label: "EUV", note: "High NA EUVと露光エコシステムの動き" },
  "Advanced Packaging": { label: "Advanced Packaging", note: "先端実装・後工程の公式更新" },
  SiC: { label: "SiC", note: "SiC材料・パワー半導体の公式更新" },
  Automotive: { label: "Automotive", note: "車載半導体に関する公式更新" },
  China: { label: "China", note: "中国市場・規制に関する公式更新" },
  Foundry: { label: "Foundry", note: "ファウンドリと先端プロセスの動き" },
};

const marketCapRows = [...worldSemiconductorMarketCapRanking, ...japanSemiconductorMarketCapRanking];

function marketCap(id: string) {
  const company = marketCapRows.find((row) => row.id === id);
  if (!company) throw new Error(`Chip Pulse: market cap is missing for ${id}`);
  return company.marketCapUsdB;
}

export const pulseCompanies: PulseCompany[] = [
  { id: "nvidia", name: "NVIDIA", shortName: "NVIDIA", ticker: "NVDA", region: "US", category: "Fabless", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("nvidia"), companySlug: "nvidia" },
  { id: "amd", name: "AMD", shortName: "AMD", ticker: "AMD", region: "US", category: "Fabless", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("amd"), companySlug: "amd" },
  { id: "broadcom", name: "Broadcom", shortName: "Broadcom", ticker: "AVGO", region: "US", category: "Fabless", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("broadcom"), companySlug: "broadcom" },
  { id: "tsmc", name: "TSMC", shortName: "TSMC", ticker: "TSM", region: "Taiwan", category: "Foundry", themes: ["AI", "EUV", "Advanced Packaging", "Foundry"], marketCapUsdB: marketCap("tsmc"), companySlug: "tsmc" },
  { id: "smic", name: "SMIC", shortName: "SMIC", ticker: "0981.HK", region: "China", category: "Foundry", themes: ["China", "Foundry"], marketCapUsdB: marketCap("smic") },
  { id: "micron", name: "Micron Technology", shortName: "Micron", ticker: "MU", region: "US", category: "Memory", themes: ["AI", "HBM"], marketCapUsdB: marketCap("micron"), companySlug: "micron" },
  { id: "sk-hynix", name: "SK hynix", shortName: "SK hynix", ticker: "000660.KS", region: "Korea", category: "Memory", themes: ["AI", "HBM"], marketCapUsdB: marketCap("sk-hynix"), companySlug: "sk-hynix" },
  { id: "cxmt", name: "CXMT", shortName: "CXMT", ticker: "688825.SS", region: "China", category: "Memory", themes: ["HBM", "China"], marketCapUsdB: marketCap("cxmt") },
  { id: "asml", name: "ASML", shortName: "ASML", ticker: "ASML", region: "Europe", category: "Equipment", themes: ["AI", "EUV", "China"], marketCapUsdB: marketCap("asml"), companySlug: "asml" },
  { id: "applied-materials", name: "Applied Materials", shortName: "Applied", ticker: "AMAT", region: "US", category: "Equipment", themes: ["HBM", "Advanced Packaging", "China"], marketCapUsdB: marketCap("applied-materials"), companySlug: "applied-materials" },
  { id: "lam-research", name: "Lam Research", shortName: "Lam", ticker: "LRCX", region: "US", category: "Equipment", themes: ["HBM", "Advanced Packaging", "China"], marketCapUsdB: marketCap("lam-research"), companySlug: "lam-research" },
  { id: "kla", name: "KLA", shortName: "KLA", ticker: "KLAC", region: "US", category: "Equipment", themes: ["AI", "EUV", "China"], marketCapUsdB: marketCap("kla"), companySlug: "kla" },
  { id: "tokyo-electron", name: "Tokyo Electron", shortName: "TEL", ticker: "8035.T", region: "Japan", category: "Equipment", themes: ["HBM", "EUV", "Advanced Packaging", "China"], marketCapUsdB: marketCap("tokyo-electron"), companySlug: "tokyo-electron" },
  { id: "advantest", name: "Advantest", shortName: "Advantest", ticker: "6857.T", region: "Japan", category: "Equipment", themes: ["AI", "HBM", "Advanced Packaging"], marketCapUsdB: marketCap("advantest"), companySlug: "advantest" },
  { id: "disco", name: "DISCO", shortName: "DISCO", ticker: "6146.T", region: "Japan", category: "Equipment", themes: ["AI", "Advanced Packaging"], marketCapUsdB: marketCap("disco"), companySlug: "disco" },
  { id: "screen", name: "SCREEN Holdings", shortName: "SCREEN", ticker: "7735.T", region: "Japan", category: "Equipment", themes: ["HBM", "Advanced Packaging"], marketCapUsdB: marketCap("screen"), companySlug: "screen" },
  { id: "naura", name: "NAURA Technology", shortName: "NAURA", ticker: "002371.SZ", region: "China", category: "Equipment", themes: ["China", "Foundry"], marketCapUsdB: marketCap("naura") },
  { id: "sumco", name: "SUMCO", shortName: "SUMCO", ticker: "3436.T", region: "Japan", category: "Materials", themes: ["Automotive", "Foundry"], marketCapUsdB: marketCap("sumco"), companySlug: "sumco" },
  { id: "intel", name: "Intel", shortName: "Intel", ticker: "INTC", region: "US", category: "IDM", themes: ["AI", "EUV", "Advanced Packaging", "Foundry"], marketCapUsdB: marketCap("intel"), companySlug: "intel" },
  { id: "samsung-electronics", name: "Samsung Electronics", shortName: "Samsung", ticker: "005930.KS", region: "Korea", category: "IDM", themes: ["AI", "HBM", "EUV", "Foundry"], marketCapUsdB: marketCap("samsung-electronics"), companySlug: "samsung-electronics" },
  { id: "renesas", name: "Renesas Electronics", shortName: "Renesas", ticker: "6723.T", region: "Japan", category: "IDM", themes: ["Automotive", "SiC"], marketCapUsdB: marketCap("renesas"), companySlug: "renesas" },
  { id: "rohm", name: "ROHM", shortName: "ROHM", ticker: "6963.T", region: "Japan", category: "IDM", themes: ["Automotive", "SiC"], marketCapUsdB: marketCap("rohm"), companySlug: "rohm" },
];

export const pulseSignals: PulseSignal[] = [
  {
    id: "advantest-semicon-india-2026", occurredAt: "2026-09-15T00:00:00+09:00", timeLabel: "9/15",
    title: "Advantest：AI・HPC向けテスト技術をSEMICON Indiaで展示",
    summary: "V93000 EXA Scale、AI機能を持つSmarTest 8、次世代DRAM向けT5800シリーズなどを公開しました。",
    impact: "AI計算基盤の需要が、SoC・メモリのテスト工程へどう波及するかを見る一次情報です。",
    primaryCompanyId: "advantest", companyIds: ["advantest"], processes: ["Test"], regions: ["Japan"], categories: ["Equipment"], themes: ["AI", "HBM"],
    importance: 2, tone: "positive", kind: "product", sourceName: "Advantest", sourceUrl: "https://www.advantest.com/en/news/2026/20260915.html", sourceType: "company",
  },
  {
    id: "semi-resilient-sic-2026", occurredAt: "2026-09-14T00:00:00+02:00", timeLabel: "9/14",
    title: "欧州：Si・SiC原材料の域内供給網強化プロジェクトが始動",
    summary: "SEMI EuropeがReSiLientコンソーシアムへ参加。9か国18組織で、Si・SiC原材料の供給耐性と代替製造ルートを検証します。",
    impact: "パワー半導体の前工程だけでなく、原材料の調達リスクと欧州政策を同時に追うシグナルです。",
    companyIds: [], processes: ["Materials"], regions: ["Europe"], categories: ["Materials"], themes: ["SiC"],
    importance: 2, tone: "positive", kind: "policy", sourceName: "SEMI Europe", sourceUrl: "https://www.semi.org/en/semi-press-release/semi-europe-joins-resilient-consortium-to-strengthen-europes-silicon-and-silicon-carbide-raw-material-value-chains", sourceType: "industry",
  },
  {
    id: "tsmc-august-revenue-2026", occurredAt: "2026-09-10T06:15:36-04:00", timeLabel: "9/10",
    title: "TSMC：8月売上高は5,148億台湾ドル",
    summary: "SECへ提出したForm 6-Kで、2026年8月の売上高を5,148.05億台湾ドル、1〜8月累計を3兆3,868.70億台湾ドルと報告しました。",
    impact: "AI・先端プロセス需要を読むうえで、観測記事ではなく月次売上の原数値を確認できます。",
    primaryCompanyId: "tsmc", companyIds: ["tsmc"], processes: ["Lithography", "Deposition", "Etch", "Assembly"], regions: ["Taiwan"], categories: ["Foundry"], themes: ["AI", "Foundry"],
    importance: 3, tone: "positive", kind: "earnings", sourceName: "SEC / TSMC Form 6-K", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000658/tsm-revenue20260910.htm", sourceType: "regulatory",
  },
  {
    id: "nvidia-australia-ai-infrastructure-2026", occurredAt: "2026-09-09T00:00:00+10:00", timeLabel: "9/09",
    title: "NVIDIA：豪州AIインフラを2027年までに最大2GWへ",
    summary: "豪州のデータセンター事業者らと、NVIDIA DSXを使うAIファクトリー向け容量を2027年までに最大2GW拡張すると発表しました。",
    impact: "GPUだけでなく、先端ロジック・実装・メモリへ続くAI設備需要の裾野を示します。",
    primaryCompanyId: "nvidia", companyIds: ["nvidia", "tsmc", "sk-hynix", "micron"], processes: ["Design", "Assembly", "Test"], regions: ["US", "Taiwan", "Korea"], categories: ["Fabless", "Foundry", "Memory"], themes: ["AI", "HBM", "Advanced Packaging"],
    importance: 3, tone: "positive", kind: "investment", sourceName: "NVIDIA", sourceUrl: "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Expands-AI-Infrastructure-Capacity-in-Partnership-With-Australias-Data-Center-Ecosystem/default.aspx", sourceType: "company",
  },
  {
    id: "samsung-mistral-semiconductor-ai-2026", occurredAt: "2026-09-09T00:00:00+09:00", timeLabel: "9/09",
    title: "Samsung：半導体設計・製造へオンプレミスAIを導入",
    summary: "Mistral AIと提携し、機密性の高い半導体データを社内で扱うAIモデルを設計・製造工程へ導入すると発表しました。",
    impact: "欠陥検出、装置最適化、歩留まり安定化にAIを使う、製造現場側の具体的な動きです。",
    primaryCompanyId: "samsung-electronics", companyIds: ["samsung-electronics"], processes: ["Design", "Metrology"], regions: ["Korea"], categories: ["IDM"], themes: ["AI", "Foundry"],
    importance: 2, tone: "positive", kind: "product", sourceName: "Samsung Electronics", sourceUrl: "https://news.samsung.com/global/samsung-and-mistral-ai-announce-strategic-partnership-for-intelligence-driven-semiconductor-infrastructure", sourceType: "company",
  },
  {
    id: "samsung-asml-high-na-2026", occurredAt: "2026-09-08T00:00:00+09:00", timeLabel: "9/08",
    title: "Samsung・ASML：High NA EUV連携を拡大",
    summary: "Samsungは12インチフォトマスク構想へ参加し、2028年までに将来のDRAM量産へHigh NA EUVを導入する計画を示しました。",
    impact: "次世代DRAMとロジックの微細化が、露光装置・マスク・材料へ及ぼす中期シグナルです。",
    primaryCompanyId: "samsung-electronics", companyIds: ["samsung-electronics", "asml"], processes: ["Lithography", "Materials"], regions: ["Korea", "Europe"], categories: ["IDM", "Equipment"], themes: ["EUV", "HBM", "Foundry"],
    importance: 3, tone: "positive", kind: "investment", sourceName: "ASML / Samsung Electronics", sourceUrl: "https://www.asml.com/en/news/press-releases/2026/samsung-electronics-and-asml-expand-collaboration-on-next-generation-semiconductor-manufacturing", sourceType: "company",
  },
  {
    id: "intel-asml-high-na-2026", occurredAt: "2026-09-08T02:03:00-04:00", timeLabel: "9/08",
    title: "Intel Foundry・ASML：High NA EUV量産実績を更新",
    summary: "IntelはHigh NA EUVで累計100万枚超のウェーハを処理し、一部のPanther Lake量産レイヤーで利用していると発表しました。",
    impact: "High NA EUVが研究段階から量産利用へ移る速度と、マスク・EDAを含む周辺需要を確認できます。",
    primaryCompanyId: "intel", companyIds: ["intel", "asml"], processes: ["Lithography"], regions: ["US", "Europe"], categories: ["IDM", "Equipment"], themes: ["EUV", "Foundry"],
    importance: 3, tone: "positive", kind: "product", sourceName: "Intel", sourceUrl: "https://www.intc.com/news-events/press-releases/detail/1781/intel-foundry-and-asml-collaborate-to-accelerate-industry", sourceType: "company",
  },
  {
    id: "semi-equipment-billings-q2-2026", occurredAt: "2026-09-03T00:00:00-07:00", timeLabel: "9/03",
    title: "SEMI：世界の半導体製造装置売上はQ2に前年比23%増",
    summary: "2026年Q2の世界半導体製造装置売上は405.3億米ドル。前年同期比23%増、前四半期比11%増で、2四半期連続の過去最高となりました。",
    impact: "個別企業の発表を、装置市場全体の実績値と照合するための基準になります。",
    companyIds: ["asml", "applied-materials", "lam-research", "kla", "tokyo-electron", "advantest", "disco", "screen"], processes: ["Lithography", "Deposition", "Etch", "Metrology", "Test"], regions: ["US", "Japan", "Europe"], categories: ["Equipment"], themes: ["AI", "Advanced Packaging"],
    importance: 3, tone: "positive", kind: "market", sourceName: "SEMI", sourceUrl: "https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-billings-increased-23-percent-year-over-year-in-q2-2026-semi-reports", sourceType: "industry",
  },
];

export const pulseEvents: PulseEvent[] = [{
  id: "micron-fy2026-q4-results", date: "2026-09-30", dateLabel: "9/30 WED", title: "Micron 2026年度Q4 決算説明会", eventType: "earnings",
  companyIds: ["micron"], regions: ["US"], categories: ["Memory"], themes: ["AI", "HBM"], sourceName: "Micron Investor Relations",
  sourceUrl: "https://investors.micron.com/news/press-release/2026/Micron-Technology-to-Report-Fiscal-Fourth-Quarter-Results-on-September-30-2026/default.aspx",
}];

const everyCompanyId = pulseCompanies.map((company) => company.id);

export const pulseBriefLines: PulseBriefLine[] = [
  { id: "brief-quiet-24h", text: "直近24時間に、監視中の公式ソースで重要更新は確認されていません。静かな日は0件と表示します。", companyIds: everyCompanyId, regions: [...pulseRegions], categories: [...pulseCategories], themes: [...pulseThemeIds], priority: 12 },
  { id: "brief-high-na", text: "直近30日ではHigh NA EUVが焦点。Samsungは2028年のDRAM量産導入計画、Intelは量産利用の進捗を公表しました。", companyIds: ["samsung-electronics", "intel", "asml"], regions: ["Korea", "US", "Europe"], categories: ["IDM", "Equipment"], themes: ["EUV", "HBM", "Foundry"], priority: 11 },
  { id: "brief-ai-chain", text: "AI投資はGPUだけでなく、ファウンドリ、メモリ、テスト装置、製造現場のAI活用へ広がっています。", companyIds: ["nvidia", "tsmc", "micron", "sk-hynix", "advantest", "samsung-electronics"], regions: ["US", "Taiwan", "Korea", "Japan"], categories: ["Fabless", "Foundry", "Memory", "Equipment", "IDM"], themes: ["AI", "HBM", "Advanced Packaging"], priority: 10 },
  { id: "brief-tsmc", text: "TSMCの8月売上高は5,148億台湾ドル。月次の原数値から先端需要の勢いを確認できます。", companyIds: ["tsmc"], regions: ["Taiwan"], categories: ["Foundry"], themes: ["AI", "Foundry"], priority: 9 },
  { id: "brief-equipment", text: "SEMI集計ではQ2の世界半導体製造装置売上が前年比23%増。装置投資は2四半期連続で過去最高です。", companyIds: ["asml", "applied-materials", "lam-research", "kla", "tokyo-electron", "advantest", "disco", "screen"], regions: ["US", "Japan", "Europe"], categories: ["Equipment"], themes: ["AI", "Advanced Packaging"], priority: 8 },
  { id: "brief-sic", text: "欧州ではSi・SiC原材料の域内供給網を強化する48か月の共同プロジェクトが始動しました。", companyIds: ["renesas", "rohm", "sumco"], regions: ["Europe", "Japan"], categories: ["Materials", "IDM"], themes: ["SiC"], priority: 7 },
];

export const pulseSnapshot: PulseSnapshot = {
  schemaVersion: 1,
  mode: "source-backed",
  asOf: pulseUpdatedAt,
  marketCapAsOf: pulseMarketCapAsOf,
  companies: pulseCompanies,
  signals: pulseSignals,
  events: pulseEvents,
  briefLines: pulseBriefLines,
};
