export type SemiconductorMarketCapCompany = {
  rank: number;
  name: string;
  englishName: string;
  ticker: string;
  marketCapUsdB: number;
  marketCapDisplay: string;
  country: string;
  category: string;
  mainBusiness: string;
  isJapanese: boolean;
  companySlug?: string;
  sourceUrl: string;
  dataAsOf: string;
};

export const semiconductorMarketCapMeta = {
  dataAsOf: "2026-07-13",
  retrievedAt: "2026-07-14",
  currency: "米ドル",
  sourceName: "CompaniesMarketCap Semiconductors",
  sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
  definition: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業",
} as const;

const sourceUrl = semiconductorMarketCapMeta.sourceUrl;
const dataAsOf = semiconductorMarketCapMeta.dataAsOf;

export const worldSemiconductorMarketCapRanking: SemiconductorMarketCapCompany[] = [
  { rank: 1, name: "NVIDIA", englishName: "NVIDIA", ticker: "NVDA", marketCapUsdB: 4929, marketCapDisplay: "4.93兆ドル", country: "米国", category: "ファブレス", mainBusiness: "AI向けGPU、アクセラレーテッドコンピューティング", isJapanese: false, companySlug: "nvidia", sourceUrl, dataAsOf },
  { rank: 2, name: "TSMC（台湾積体電路製造）", englishName: "Taiwan Semiconductor Manufacturing Company", ticker: "TSM", marketCapUsdB: 2186, marketCapDisplay: "2.19兆ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, companySlug: "tsmc", sourceUrl, dataAsOf },
  { rank: 3, name: "ブロードコム", englishName: "Broadcom", ticker: "AVGO", marketCapUsdB: 1827, marketCapDisplay: "1.83兆ドル", country: "米国", category: "ファブレス", mainBusiness: "ネットワーク、通信、カスタム半導体", isJapanese: false, companySlug: "broadcom", sourceUrl, dataAsOf },
  { rank: 4, name: "サムスン電子", englishName: "Samsung Electronics", ticker: "005930.KS", marketCapUsdB: 1114, marketCapDisplay: "1.11兆ドル", country: "韓国", category: "IDM（総合電機）", mainBusiness: "メモリ、ロジック、ファウンドリ", isJapanese: false, companySlug: "samsung-electronics", sourceUrl, dataAsOf },
  { rank: 5, name: "マイクロン・テクノロジー", englishName: "Micron Technology", ticker: "MU", marketCapUsdB: 1058, marketCapDisplay: "1.06兆ドル", country: "米国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM、SSD", isJapanese: false, companySlug: "micron", sourceUrl, dataAsOf },
  { rank: 6, name: "AMD", englishName: "Advanced Micro Devices", ticker: "AMD", marketCapUsdB: 871.37, marketCapDisplay: "8710億ドル", country: "米国", category: "ファブレス", mainBusiness: "CPU、GPU、データセンター向け半導体", isJapanese: false, companySlug: "amd", sourceUrl, dataAsOf },
  { rank: 7, name: "SK hynix", englishName: "SK hynix", ticker: "000660.KS", marketCapUsdB: 819.78, marketCapDisplay: "8200億ドル", country: "韓国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM", isJapanese: false, companySlug: "sk-hynix", sourceUrl, dataAsOf },
  { rank: 8, name: "ASML", englishName: "ASML Holding", ticker: "ASML", marketCapUsdB: 665.24, marketCapDisplay: "6650億ドル", country: "オランダ", category: "製造装置", mainBusiness: "EUV・DUV露光装置", isJapanese: false, companySlug: "asml", sourceUrl, dataAsOf },
  { rank: 9, name: "インテル", englishName: "Intel", ticker: "INTC", marketCapUsdB: 518.28, marketCapDisplay: "5180億ドル", country: "米国", category: "IDM・ファウンドリ", mainBusiness: "CPU、データセンター、半導体製造", isJapanese: false, companySlug: "intel", sourceUrl, dataAsOf },
  { rank: 10, name: "アプライド マテリアルズ", englishName: "Applied Materials", ticker: "AMAT", marketCapUsdB: 456.83, marketCapDisplay: "4570億ドル", country: "米国", category: "製造装置", mainBusiness: "成膜、エッチング、イオン注入などの装置", isJapanese: false, companySlug: "applied-materials", sourceUrl, dataAsOf },
  { rank: 11, name: "ラムリサーチ", englishName: "Lam Research", ticker: "LRCX", marketCapUsdB: 412.58, marketCapDisplay: "4130億ドル", country: "米国", category: "製造装置", mainBusiness: "エッチング、成膜、洗浄装置", isJapanese: false, companySlug: "lam-research", sourceUrl, dataAsOf },
  { rank: 12, name: "Arm", englishName: "Arm Holdings", ticker: "ARM", marketCapUsdB: 319.34, marketCapDisplay: "3190億ドル", country: "英国", category: "EDA・IP", mainBusiness: "CPUアーキテクチャと半導体IP", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 13, name: "KLA", englishName: "KLA Corporation", ticker: "KLAC", marketCapUsdB: 290.31, marketCapDisplay: "2900億ドル", country: "米国", category: "検査・計測装置", mainBusiness: "プロセス制御、検査、計測装置", isJapanese: false, companySlug: "kla", sourceUrl, dataAsOf },
  { rank: 14, name: "テキサス・インスツルメンツ", englishName: "Texas Instruments", ticker: "TXN", marketCapUsdB: 271.72, marketCapDisplay: "2720億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、組み込みプロセッサ", isJapanese: false, companySlug: "texas-instruments", sourceUrl, dataAsOf },
  { rank: 15, name: "マーベル・テクノロジー", englishName: "Marvell Technology", ticker: "MRVL", marketCapUsdB: 195.24, marketCapDisplay: "1950億ドル", country: "米国", category: "ファブレス", mainBusiness: "データインフラ、ネットワーク半導体", isJapanese: false, companySlug: "marvell", sourceUrl, dataAsOf },
  { rank: 16, name: "クアルコム", englishName: "Qualcomm", ticker: "QCOM", marketCapUsdB: 193.91, marketCapDisplay: "1940億ドル", country: "米国", category: "ファブレス", mainBusiness: "モバイルSoC、通信モデム、無線技術", isJapanese: false, companySlug: "qualcomm", sourceUrl, dataAsOf },
  { rank: 17, name: "東京エレクトロン", englishName: "Tokyo Electron", ticker: "8035.T", marketCapUsdB: 193.42, marketCapDisplay: "1930億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、塗布現像、エッチング、洗浄装置", isJapanese: true, companySlug: "tokyo-electron", sourceUrl, dataAsOf },
  { rank: 18, name: "アナログ・デバイセズ", englishName: "Analog Devices", ticker: "ADI", marketCapUsdB: 188.02, marketCapDisplay: "1880億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、ミックスドシグナル半導体", isJapanese: false, companySlug: "analog-devices", sourceUrl, dataAsOf },
  { rank: 19, name: "MediaTek", englishName: "MediaTek", ticker: "2454.TW", marketCapUsdB: 177.08, marketCapDisplay: "1770億ドル", country: "台湾", category: "ファブレス", mainBusiness: "モバイル、通信、民生向けSoC", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 20, name: "アドバンテスト", englishName: "Advantest", ticker: "6857.T", marketCapUsdB: 128.51, marketCapDisplay: "1290億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "半導体テストシステム、テスト周辺機器", isJapanese: true, companySlug: "advantest", sourceUrl, dataAsOf },
  { rank: 21, name: "Cambricon Technologies", englishName: "Cambricon Technologies", ticker: "688256.SS", marketCapUsdB: 122.53, marketCapDisplay: "1230億ドル", country: "中国", category: "ファブレス", mainBusiness: "AIアクセラレーター、AIプロセッサ", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 22, name: "インフィニオン", englishName: "Infineon Technologies", ticker: "IFX.DE", marketCapUsdB: 104.18, marketCapDisplay: "1040億ドル", country: "ドイツ", category: "IDM", mainBusiness: "パワー、車載、セキュリティ半導体", isJapanese: false, companySlug: "infineon", sourceUrl, dataAsOf },
  { rank: 23, name: "ASE Technology", englishName: "ASE Technology Holding", ticker: "ASX", marketCapUsdB: 88.98, marketCapDisplay: "890億ドル", country: "台湾", category: "OSAT・後工程", mainBusiness: "半導体組立、パッケージ、テスト受託", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 24, name: "Synopsys", englishName: "Synopsys", ticker: "SNPS", marketCapUsdB: 83.06, marketCapDisplay: "831億ドル", country: "米国", category: "EDA・IP", mainBusiness: "半導体設計ソフト、設計IP", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 25, name: "SMIC", englishName: "Semiconductor Manufacturing International Corporation", ticker: "0981.HK", marketCapUsdB: 80.6, marketCapDisplay: "806億ドル", country: "中国", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 26, name: "NAURA Technology", englishName: "NAURA Technology Group", ticker: "002371.SZ", marketCapUsdB: 79.42, marketCapDisplay: "794億ドル", country: "中国", category: "製造装置", mainBusiness: "成膜、エッチング、熱処理などの装置", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 27, name: "NXPセミコンダクターズ", englishName: "NXP Semiconductors", ticker: "NXPI", marketCapUsdB: 70.28, marketCapDisplay: "703億ドル", country: "オランダ", category: "IDM", mainBusiness: "車載、産業、通信向け半導体", isJapanese: false, companySlug: "nxp", sourceUrl, dataAsOf },
  { rank: 28, name: "Monolithic Power Systems", englishName: "Monolithic Power Systems", ticker: "MPWR", marketCapUsdB: 63.44, marketCapDisplay: "634億ドル", country: "米国", category: "ファブレス", mainBusiness: "電源管理、アナログ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 29, name: "Astera Labs", englishName: "Astera Labs", ticker: "ALAB", marketCapUsdB: 62.05, marketCapDisplay: "621億ドル", country: "米国", category: "ファブレス", mainBusiness: "AI・クラウド向け接続半導体", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 30, name: "STマイクロエレクトロニクス", englishName: "STMicroelectronics", ticker: "STM", marketCapUsdB: 61.1, marketCapDisplay: "611億ドル", country: "スイス", category: "IDM", mainBusiness: "車載、産業、マイコン、センサー", isJapanese: false, companySlug: "stmicroelectronics", sourceUrl, dataAsOf },
];

const japaneseCompaniesOutsideTop30: SemiconductorMarketCapCompany[] = [
  { rank: 36, name: "ルネサス エレクトロニクス", englishName: "Renesas Electronics", ticker: "6723.T", marketCapUsdB: 48.18, marketCapDisplay: "482億ドル", country: "日本", category: "IDM", mainBusiness: "車載、産業向けマイコン、アナログ、パワー半導体", isJapanese: true, companySlug: "renesas", sourceUrl, dataAsOf },
  { rank: 37, name: "ディスコ", englishName: "DISCO Corporation", ticker: "6146.T", marketCapUsdB: 46.16, marketCapDisplay: "462億ドル", country: "日本", category: "製造装置", mainBusiness: "切断、研削、研磨装置と精密加工ツール", isJapanese: true, companySlug: "disco", sourceUrl, dataAsOf },
  { rank: 48, name: "レーザーテック", englishName: "Lasertec", ticker: "6920.T", marketCapUsdB: 24.05, marketCapDisplay: "241億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "フォトマスク、マスクブランクス、ウエハー検査", isJapanese: true, companySlug: "lasertec", sourceUrl, dataAsOf },
  { rank: 55, name: "SCREENホールディングス", englishName: "SCREEN Holdings", ticker: "7735.T", marketCapUsdB: 20.66, marketCapDisplay: "207億ドル", country: "日本", category: "製造装置", mainBusiness: "洗浄、塗布現像、熱処理、検査装置", isJapanese: true, companySlug: "screen", sourceUrl, dataAsOf },
  { rank: 67, name: "KOKUSAI ELECTRIC", englishName: "KOKUSAI ELECTRIC", ticker: "6525.T", marketCapUsdB: 14.11, marketCapDisplay: "141億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、熱処理装置", isJapanese: true, sourceUrl, dataAsOf },
  { rank: 70, name: "ローム", englishName: "ROHM", ticker: "6963.T", marketCapUsdB: 12.13, marketCapDisplay: "121億ドル", country: "日本", category: "IDM", mainBusiness: "パワー、アナログ半導体、電子部品", isJapanese: true, companySlug: "rohm", sourceUrl, dataAsOf },
  { rank: 73, name: "SUMCO", englishName: "SUMCO Corporation", ticker: "3436.T", marketCapUsdB: 11.28, marketCapDisplay: "113億ドル", country: "日本", category: "材料・ウエハー", mainBusiness: "半導体用シリコンウエハー", isJapanese: true, companySlug: "sumco", sourceUrl, dataAsOf },
  { rank: 101, name: "ローツェ", englishName: "Rorze Corporation", ticker: "6323.T", marketCapUsdB: 4.77, marketCapDisplay: "47.7億ドル", country: "日本", category: "製造装置", mainBusiness: "ウエハー搬送ロボット、搬送システム", isJapanese: true, sourceUrl: `${sourceUrl}?page=2`, dataAsOf },
];

export const japanSemiconductorMarketCapRanking = [
  ...worldSemiconductorMarketCapRanking.filter((company) => company.isJapanese),
  ...japaneseCompaniesOutsideTop30,
]
  .sort((first, second) => first.rank - second.rank)
  .slice(0, 10)
  .map((company, index) => ({ ...company, domesticRank: index + 1 }));
