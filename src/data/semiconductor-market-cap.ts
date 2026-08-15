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
  dataAsOf: "2026-08-16",
  retrievedAt: "2026-08-16",
  currency: "米ドル",
  sourceName: "CompaniesMarketCap Semiconductors",
  sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
  definition: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業",
} as const;

const sourceUrl = semiconductorMarketCapMeta.sourceUrl;
const dataAsOf = semiconductorMarketCapMeta.dataAsOf;

export const worldSemiconductorMarketCapRanking: SemiconductorMarketCapCompany[] = [
  { rank: 1, name: "NVIDIA", englishName: "NVIDIA", ticker: "NVDA", marketCapUsdB: 5453, marketCapDisplay: "5.45兆ドル", country: "米国", category: "ファブレス", mainBusiness: "AI向けGPU、アクセラレーテッドコンピューティング", isJapanese: false, companySlug: "nvidia", sourceUrl, dataAsOf },
  { rank: 2, name: "TSMC（台湾積体電路製造）", englishName: "Taiwan Semiconductor Manufacturing Company", ticker: "TSM", marketCapUsdB: 2211, marketCapDisplay: "2.21兆ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, companySlug: "tsmc", sourceUrl, dataAsOf },
  { rank: 3, name: "ブロードコム", englishName: "Broadcom", ticker: "AVGO", marketCapUsdB: 1869, marketCapDisplay: "1.87兆ドル", country: "米国", category: "ファブレス・ソフトウェア", mainBusiness: "ネットワーク、通信、カスタム半導体、インフラソフトウェア", isJapanese: false, companySlug: "broadcom", sourceUrl, dataAsOf },
  { rank: 4, name: "サムスン電子", englishName: "Samsung Electronics", ticker: "005930.KS", marketCapUsdB: 1273, marketCapDisplay: "1.27兆ドル", country: "韓国", category: "IDM（総合電機）", mainBusiness: "メモリ、ロジック、ファウンドリ、電子機器", isJapanese: false, companySlug: "samsung-electronics", sourceUrl, dataAsOf },
  { rank: 5, name: "マイクロン・テクノロジー", englishName: "Micron Technology", ticker: "MU", marketCapUsdB: 1097, marketCapDisplay: "1.10兆ドル", country: "米国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM、SSD", isJapanese: false, companySlug: "micron", sourceUrl, dataAsOf },
  { rank: 6, name: "AMD", englishName: "Advanced Micro Devices", ticker: "AMD", marketCapUsdB: 839.72, marketCapDisplay: "8400億ドル", country: "米国", category: "ファブレス", mainBusiness: "CPU、GPU、データセンター向け半導体", isJapanese: false, companySlug: "amd", sourceUrl, dataAsOf },
  { rank: 7, name: "SK hynix", englishName: "SK hynix", ticker: "000660.KS", marketCapUsdB: 825.1, marketCapDisplay: "8250億ドル", country: "韓国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM", isJapanese: false, companySlug: "sk-hynix", sourceUrl, dataAsOf },
  { rank: 8, name: "ASML", englishName: "ASML Holding", ticker: "ASML", marketCapUsdB: 708.31, marketCapDisplay: "7080億ドル", country: "オランダ", category: "製造装置", mainBusiness: "EUV・DUV露光装置", isJapanese: false, companySlug: "asml", sourceUrl, dataAsOf },
  { rank: 9, name: "CXMT", englishName: "ChangXin Memory Technologies", ticker: "688825.SS", marketCapUsdB: 580.59, marketCapDisplay: "5810億ドル", country: "中国", category: "メモリ・IDM", mainBusiness: "DRAMなどのメモリ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 10, name: "インテル", englishName: "Intel", ticker: "INTC", marketCapUsdB: 541.82, marketCapDisplay: "5420億ドル", country: "米国", category: "IDM・ファウンドリ", mainBusiness: "CPU、データセンター、半導体製造", isJapanese: false, companySlug: "intel", sourceUrl, dataAsOf },
  { rank: 11, name: "ラムリサーチ", englishName: "Lam Research", ticker: "LRCX", marketCapUsdB: 415.88, marketCapDisplay: "4160億ドル", country: "米国", category: "製造装置", mainBusiness: "エッチング、成膜、洗浄装置", isJapanese: false, companySlug: "lam-research", sourceUrl, dataAsOf },
  { rank: 12, name: "アプライド マテリアルズ", englishName: "Applied Materials", ticker: "AMAT", marketCapUsdB: 402.68, marketCapDisplay: "4030億ドル", country: "米国", category: "製造装置", mainBusiness: "成膜、エッチング、イオン注入などの装置", isJapanese: false, companySlug: "applied-materials", sourceUrl, dataAsOf },
  { rank: 13, name: "Arm", englishName: "Arm Holdings", ticker: "ARM", marketCapUsdB: 298.44, marketCapDisplay: "2980億ドル", country: "英国", category: "EDA・IP", mainBusiness: "CPUアーキテクチャと半導体IP", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 14, name: "KLA", englishName: "KLA Corporation", ticker: "KLAC", marketCapUsdB: 266.16, marketCapDisplay: "2660億ドル", country: "米国", category: "検査・計測装置", mainBusiness: "プロセス制御、検査、計測装置", isJapanese: false, companySlug: "kla", sourceUrl, dataAsOf },
  { rank: 15, name: "テキサス・インスツルメンツ", englishName: "Texas Instruments", ticker: "TXN", marketCapUsdB: 255.32, marketCapDisplay: "2550億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、組み込みプロセッサ", isJapanese: false, companySlug: "texas-instruments", sourceUrl, dataAsOf },
  { rank: 16, name: "MediaTek", englishName: "MediaTek", ticker: "2454.TW", marketCapUsdB: 210.03, marketCapDisplay: "2100億ドル", country: "台湾", category: "ファブレス", mainBusiness: "モバイル、通信、民生向けSoC", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 17, name: "マーベル・テクノロジー", englishName: "Marvell Technology", ticker: "MRVL", marketCapUsdB: 199.27, marketCapDisplay: "1990億ドル", country: "米国", category: "ファブレス", mainBusiness: "データインフラ、ネットワーク半導体", isJapanese: false, companySlug: "marvell", sourceUrl, dataAsOf },
  { rank: 18, name: "アナログ・デバイセズ", englishName: "Analog Devices", ticker: "ADI", marketCapUsdB: 189.66, marketCapDisplay: "1900億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、ミックスドシグナル半導体", isJapanese: false, companySlug: "analog-devices", sourceUrl, dataAsOf },
  { rank: 19, name: "クアルコム", englishName: "Qualcomm", ticker: "QCOM", marketCapUsdB: 174.07, marketCapDisplay: "1740億ドル", country: "米国", category: "ファブレス", mainBusiness: "モバイルSoC、通信モデム、無線技術", isJapanese: false, companySlug: "qualcomm", sourceUrl, dataAsOf },
  { rank: 20, name: "東京エレクトロン", englishName: "Tokyo Electron", ticker: "8035.T", marketCapUsdB: 168.7, marketCapDisplay: "1690億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、塗布現像、エッチング、洗浄装置", isJapanese: true, companySlug: "tokyo-electron", sourceUrl, dataAsOf },
  { rank: 21, name: "アドバンテスト", englishName: "Advantest", ticker: "6857.T", marketCapUsdB: 167.53, marketCapDisplay: "1680億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "半導体テストシステム、テスト周辺機器", isJapanese: true, companySlug: "advantest", sourceUrl, dataAsOf },
  { rank: 22, name: "ASE Technology", englishName: "ASE Technology Holding", ticker: "ASX", marketCapUsdB: 102.94, marketCapDisplay: "1030億ドル", country: "台湾", category: "OSAT・後工程", mainBusiness: "半導体組立、パッケージ、テスト受託", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 23, name: "Cambricon Technologies", englishName: "Cambricon Technologies", ticker: "688256.SS", marketCapUsdB: 102.03, marketCapDisplay: "1020億ドル", country: "中国", category: "ファブレス", mainBusiness: "AIアクセラレーター、AIプロセッサ", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 24, name: "インフィニオン", englishName: "Infineon Technologies", ticker: "IFX.DE", marketCapUsdB: 92.79, marketCapDisplay: "928億ドル", country: "ドイツ", category: "IDM", mainBusiness: "パワー、車載、セキュリティ半導体", isJapanese: false, companySlug: "infineon", sourceUrl, dataAsOf },
  { rank: 25, name: "Synopsys", englishName: "Synopsys", ticker: "SNPS", marketCapUsdB: 80.7, marketCapDisplay: "807億ドル", country: "米国", category: "EDA・IP", mainBusiness: "半導体設計ソフト、設計IP", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 26, name: "NAURA Technology", englishName: "NAURA Technology Group", ticker: "002371.SZ", marketCapUsdB: 79.64, marketCapDisplay: "796億ドル", country: "中国", category: "製造装置", mainBusiness: "成膜、エッチング、熱処理などの装置", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 27, name: "SMIC", englishName: "Semiconductor Manufacturing International Corporation", ticker: "0981.HK", marketCapUsdB: 77.23, marketCapDisplay: "772億ドル", country: "中国", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 28, name: "Monolithic Power Systems", englishName: "Monolithic Power Systems", ticker: "MPWR", marketCapUsdB: 68.89, marketCapDisplay: "689億ドル", country: "米国", category: "ファブレス", mainBusiness: "電源管理、アナログ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 29, name: "Coherent", englishName: "Coherent Corp.", ticker: "COHR", marketCapUsdB: 63.74, marketCapDisplay: "637億ドル", country: "米国", category: "材料・フォトニクス", mainBusiness: "光通信・レーザー・半導体材料関連製品", isJapanese: false, sourceUrl, dataAsOf },
  { rank: 30, name: "NXPセミコンダクターズ", englishName: "NXP Semiconductors", ticker: "NXPI", marketCapUsdB: 59.18, marketCapDisplay: "592億ドル", country: "オランダ", category: "IDM", mainBusiness: "車載、産業、通信向け半導体", isJapanese: false, companySlug: "nxp", sourceUrl, dataAsOf },
];

const japaneseCompaniesOutsideTop30: SemiconductorMarketCapCompany[] = [
  { rank: 39, name: "ディスコ", englishName: "DISCO Corporation", ticker: "6146.T", marketCapUsdB: 44.56, marketCapDisplay: "446億ドル", country: "日本", category: "製造装置", mainBusiness: "切断、研削、研磨装置と精密加工ツール", isJapanese: true, companySlug: "disco", sourceUrl, dataAsOf },
  { rank: 42, name: "ルネサス エレクトロニクス", englishName: "Renesas Electronics", ticker: "6723.T", marketCapUsdB: 42.95, marketCapDisplay: "430億ドル", country: "日本", category: "IDM", mainBusiness: "車載、産業向けマイコン、アナログ、パワー半導体", isJapanese: true, companySlug: "renesas", sourceUrl, dataAsOf },
  { rank: 52, name: "レーザーテック", englishName: "Lasertec", ticker: "6920.T", marketCapUsdB: 21.83, marketCapDisplay: "218億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "フォトマスク、マスクブランクス、ウェーハ検査", isJapanese: true, companySlug: "lasertec", sourceUrl, dataAsOf },
  { rank: 60, name: "SCREENホールディングス", englishName: "SCREEN Holdings", ticker: "7735.T", marketCapUsdB: 16.93, marketCapDisplay: "169億ドル", country: "日本", category: "製造装置", mainBusiness: "洗浄、塗布現像、熱処理、検査装置", isJapanese: true, companySlug: "screen", sourceUrl, dataAsOf },
  { rank: 66, name: "KOKUSAI ELECTRIC", englishName: "KOKUSAI ELECTRIC", ticker: "6525.T", marketCapUsdB: 13.45, marketCapDisplay: "135億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、熱処理装置", isJapanese: true, sourceUrl, dataAsOf },
  { rank: 71, name: "ローム", englishName: "ROHM", ticker: "6963.T", marketCapUsdB: 12.15, marketCapDisplay: "122億ドル", country: "日本", category: "IDM", mainBusiness: "パワー、アナログ半導体、電子部品", isJapanese: true, companySlug: "rohm", sourceUrl, dataAsOf },
  { rank: 84, name: "SUMCO", englishName: "SUMCO Corporation", ticker: "3436.T", marketCapUsdB: 8.6, marketCapDisplay: "86.0億ドル", country: "日本", category: "材料・ウェーハ", mainBusiness: "半導体用シリコンウェーハ", isJapanese: true, companySlug: "sumco", sourceUrl, dataAsOf },
  { rank: 101, name: "MARUWA", englishName: "Maruwa", ticker: "5344.T", marketCapUsdB: 4.72, marketCapDisplay: "47.2億ドル", country: "日本", category: "材料・電子部品", mainBusiness: "セラミック材料・電子部品", isJapanese: true, sourceUrl: `${sourceUrl}?page=2`, dataAsOf },
];

export const japanSemiconductorMarketCapRanking = [
  ...worldSemiconductorMarketCapRanking.filter((company) => company.isJapanese),
  ...japaneseCompaniesOutsideTop30,
]
  .sort((first, second) => first.rank - second.rank)
  .slice(0, 10)
  .map((company, index) => ({ ...company, domesticRank: index + 1 }));
