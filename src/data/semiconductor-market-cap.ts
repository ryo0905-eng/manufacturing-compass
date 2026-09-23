export type SemiconductorMarketCapCompany = {
  id: string;
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
  dataAsOf: "2026-09-06",
  retrievedAt: "2026-09-06",
  currency: "米ドル",
  sourceName: "CompaniesMarketCap Semiconductors",
  sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
  definition: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業",
} as const;

const sourceUrl = semiconductorMarketCapMeta.sourceUrl;
const dataAsOf = semiconductorMarketCapMeta.dataAsOf;

export const worldSemiconductorMarketCapRanking: SemiconductorMarketCapCompany[] = [
  { id: "nvidia", rank: 1, name: "NVIDIA", englishName: "NVIDIA", ticker: "NVDA", marketCapUsdB: 5562, marketCapDisplay: "5.56兆ドル", country: "米国", category: "ファブレス", mainBusiness: "AI向けGPU、アクセラレーテッドコンピューティング", isJapanese: false, companySlug: "nvidia", sourceUrl, dataAsOf },
  { id: "tsmc", rank: 2, name: "TSMC（台湾積体電路製造）", englishName: "Taiwan Semiconductor Manufacturing Company", ticker: "TSM", marketCapUsdB: 2224, marketCapDisplay: "2.22兆ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, companySlug: "tsmc", sourceUrl, dataAsOf },
  { id: "broadcom", rank: 3, name: "ブロードコム", englishName: "Broadcom", ticker: "AVGO", marketCapUsdB: 1702, marketCapDisplay: "1.70兆ドル", country: "米国", category: "ファブレス・ソフトウェア", mainBusiness: "ネットワーク、通信、カスタム半導体、インフラソフトウェア", isJapanese: false, companySlug: "broadcom", sourceUrl, dataAsOf },
  { id: "samsung-electronics", rank: 4, name: "サムスン電子", englishName: "Samsung Electronics", ticker: "005930.KS", marketCapUsdB: 1246, marketCapDisplay: "1.25兆ドル", country: "韓国", category: "IDM（総合電機）", mainBusiness: "メモリ、ロジック、ファウンドリ、電子機器", isJapanese: false, companySlug: "samsung-electronics", sourceUrl, dataAsOf },
  { id: "micron", rank: 5, name: "マイクロン・テクノロジー", englishName: "Micron Technology", ticker: "MU", marketCapUsdB: 1148, marketCapDisplay: "1.15兆ドル", country: "米国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM、SSD", isJapanese: false, companySlug: "micron", sourceUrl, dataAsOf },
  { id: "sk-hynix", rank: 6, name: "SK hynix", englishName: "SK hynix", ticker: "000660.KS", marketCapUsdB: 868.51, marketCapDisplay: "8690億ドル", country: "韓国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM", isJapanese: false, companySlug: "sk-hynix", sourceUrl, dataAsOf },
  { id: "amd", rank: 7, name: "AMD", englishName: "Advanced Micro Devices", ticker: "AMD", marketCapUsdB: 779.62, marketCapDisplay: "7800億ドル", country: "米国", category: "ファブレス", mainBusiness: "CPU、GPU、データセンター向け半導体", isJapanese: false, companySlug: "amd", sourceUrl, dataAsOf },
  { id: "asml", rank: 8, name: "ASML", englishName: "ASML Holding", ticker: "ASML", marketCapUsdB: 658.68, marketCapDisplay: "6590億ドル", country: "オランダ", category: "製造装置", mainBusiness: "EUV・DUV露光装置", isJapanese: false, companySlug: "asml", sourceUrl, dataAsOf },
  { id: "cxmt", rank: 9, name: "CXMT", englishName: "ChangXin Memory Technologies", ticker: "688825.SS", marketCapUsdB: 579.19, marketCapDisplay: "5790億ドル", country: "中国", category: "メモリ・IDM", mainBusiness: "DRAMなどのメモリ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "intel", rank: 10, name: "インテル", englishName: "Intel", ticker: "INTC", marketCapUsdB: 506.4, marketCapDisplay: "5060億ドル", country: "米国", category: "IDM・ファウンドリ", mainBusiness: "CPU、データセンター、半導体製造", isJapanese: false, companySlug: "intel", sourceUrl, dataAsOf },
  { id: "lam-research", rank: 11, name: "ラムリサーチ", englishName: "Lam Research", ticker: "LRCX", marketCapUsdB: 384.96, marketCapDisplay: "3850億ドル", country: "米国", category: "製造装置", mainBusiness: "エッチング、成膜、洗浄装置", isJapanese: false, companySlug: "lam-research", sourceUrl, dataAsOf },
  { id: "applied-materials", rank: 12, name: "アプライド マテリアルズ", englishName: "Applied Materials", ticker: "AMAT", marketCapUsdB: 360.85, marketCapDisplay: "3610億ドル", country: "米国", category: "製造装置", mainBusiness: "成膜、エッチング、イオン注入などの装置", isJapanese: false, companySlug: "applied-materials", sourceUrl, dataAsOf },
  { id: "arm", rank: 13, name: "Arm", englishName: "Arm Holdings", ticker: "ARM", marketCapUsdB: 269.23, marketCapDisplay: "2690億ドル", country: "英国", category: "EDA・IP", mainBusiness: "CPUアーキテクチャと半導体IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "kla", rank: 14, name: "KLA", englishName: "KLA Corporation", ticker: "KLAC", marketCapUsdB: 242.49, marketCapDisplay: "2420億ドル", country: "米国", category: "検査・計測装置", mainBusiness: "プロセス制御、検査、計測装置", isJapanese: false, companySlug: "kla", sourceUrl, dataAsOf },
  { id: "texas-instruments", rank: 15, name: "テキサス・インスツルメンツ", englishName: "Texas Instruments", ticker: "TXN", marketCapUsdB: 236.01, marketCapDisplay: "2360億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、組み込みプロセッサ", isJapanese: false, companySlug: "texas-instruments", sourceUrl, dataAsOf },
  { id: "mediatek", rank: 16, name: "MediaTek", englishName: "MediaTek", ticker: "2454.TW", marketCapUsdB: 223.14, marketCapDisplay: "2230億ドル", country: "台湾", category: "ファブレス", mainBusiness: "モバイル、通信、民生向けSoC", isJapanese: false, sourceUrl, dataAsOf },
  { id: "marvell", rank: 17, name: "マーベル・テクノロジー", englishName: "Marvell Technology", ticker: "MRVL", marketCapUsdB: 200.9, marketCapDisplay: "2010億ドル", country: "米国", category: "ファブレス", mainBusiness: "データインフラ、ネットワーク半導体", isJapanese: false, companySlug: "marvell", sourceUrl, dataAsOf },
  { id: "qualcomm", rank: 18, name: "クアルコム", englishName: "Qualcomm", ticker: "QCOM", marketCapUsdB: 180.22, marketCapDisplay: "1800億ドル", country: "米国", category: "ファブレス", mainBusiness: "モバイルSoC、通信モデム、無線技術", isJapanese: false, companySlug: "qualcomm", sourceUrl, dataAsOf },
  { id: "analog-devices", rank: 19, name: "アナログ・デバイセズ", englishName: "Analog Devices", ticker: "ADI", marketCapUsdB: 175.53, marketCapDisplay: "1760億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、ミックスドシグナル半導体", isJapanese: false, companySlug: "analog-devices", sourceUrl, dataAsOf },
  { id: "tokyo-electron", rank: 20, name: "東京エレクトロン", englishName: "Tokyo Electron", ticker: "8035.T", marketCapUsdB: 155.14, marketCapDisplay: "1550億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、塗布現像、エッチング、洗浄装置", isJapanese: true, companySlug: "tokyo-electron", sourceUrl, dataAsOf },
  { id: "advantest", rank: 21, name: "アドバンテスト", englishName: "Advantest", ticker: "6857.T", marketCapUsdB: 153.07, marketCapDisplay: "1530億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "半導体テストシステム、テスト周辺機器", isJapanese: true, companySlug: "advantest", sourceUrl, dataAsOf },
  { id: "cambricon", rank: 22, name: "Cambricon Technologies", englishName: "Cambricon Technologies", ticker: "688256.SS", marketCapUsdB: 100.61, marketCapDisplay: "1010億ドル", country: "中国", category: "ファブレス", mainBusiness: "AIアクセラレーター、AIプロセッサ", isJapanese: false, sourceUrl, dataAsOf },
  { id: "ase", rank: 23, name: "ASE Technology", englishName: "ASE Technology Holding", ticker: "ASX", marketCapUsdB: 97.66, marketCapDisplay: "977億ドル", country: "台湾", category: "OSAT・後工程", mainBusiness: "半導体組立、パッケージ、テスト受託", isJapanese: false, sourceUrl, dataAsOf },
  { id: "infineon", rank: 24, name: "インフィニオン", englishName: "Infineon Technologies", ticker: "IFX.DE", marketCapUsdB: 85.82, marketCapDisplay: "858億ドル", country: "ドイツ", category: "IDM", mainBusiness: "パワー、車載、セキュリティ半導体", isJapanese: false, companySlug: "infineon", sourceUrl, dataAsOf },
  { id: "synopsys", rank: 25, name: "Synopsys", englishName: "Synopsys", ticker: "SNPS", marketCapUsdB: 75.47, marketCapDisplay: "755億ドル", country: "米国", category: "EDA・IP", mainBusiness: "半導体設計ソフト、設計IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "smic", rank: 26, name: "SMIC", englishName: "Semiconductor Manufacturing International Corporation", ticker: "0981.HK", marketCapUsdB: 73.37, marketCapDisplay: "734億ドル", country: "中国", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, sourceUrl, dataAsOf },
  { id: "naura", rank: 27, name: "NAURA Technology", englishName: "NAURA Technology Group", ticker: "002371.SZ", marketCapUsdB: 69.12, marketCapDisplay: "691億ドル", country: "中国", category: "製造装置", mainBusiness: "成膜、エッチング、熱処理などの装置", isJapanese: false, sourceUrl, dataAsOf },
  { id: "monolithic-power-systems", rank: 28, name: "Monolithic Power Systems", englishName: "Monolithic Power Systems", ticker: "MPWR", marketCapUsdB: 60.14, marketCapDisplay: "601億ドル", country: "米国", category: "ファブレス", mainBusiness: "電源管理、アナログ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "nxp", rank: 29, name: "NXPセミコンダクターズ", englishName: "NXP Semiconductors", ticker: "NXPI", marketCapUsdB: 57.45, marketCapDisplay: "575億ドル", country: "オランダ", category: "IDM", mainBusiness: "車載、産業、通信向け半導体", isJapanese: false, companySlug: "nxp", sourceUrl, dataAsOf },
  { id: "coherent", rank: 30, name: "Coherent", englishName: "Coherent Corp.", ticker: "COHR", marketCapUsdB: 55.19, marketCapDisplay: "552億ドル", country: "米国", category: "材料・フォトニクス", mainBusiness: "光通信・レーザー・半導体材料関連製品", isJapanese: false, sourceUrl, dataAsOf },
];

const japaneseCompaniesOutsideTop30: SemiconductorMarketCapCompany[] = [
  { id: "renesas", rank: 40, name: "ルネサス エレクトロニクス", englishName: "Renesas Electronics", ticker: "6723.T", marketCapUsdB: 38.64, marketCapDisplay: "386億ドル", country: "日本", category: "IDM", mainBusiness: "車載、産業向けマイコン、アナログ、パワー半導体", isJapanese: true, companySlug: "renesas", sourceUrl, dataAsOf },
  { id: "disco", rank: 41, name: "ディスコ", englishName: "DISCO Corporation", ticker: "6146.T", marketCapUsdB: 37.83, marketCapDisplay: "378億ドル", country: "日本", category: "製造装置", mainBusiness: "切断、研削、研磨装置と精密加工ツール", isJapanese: true, companySlug: "disco", sourceUrl, dataAsOf },
  { id: "lasertec", rank: 53, name: "レーザーテック", englishName: "Lasertec", ticker: "6920.T", marketCapUsdB: 19.04, marketCapDisplay: "190億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "フォトマスク、マスクブランクス、ウェーハ検査", isJapanese: true, companySlug: "lasertec", sourceUrl, dataAsOf },
  { id: "screen", rank: 61, name: "SCREENホールディングス", englishName: "SCREEN Holdings", ticker: "7735.T", marketCapUsdB: 15.78, marketCapDisplay: "158億ドル", country: "日本", category: "製造装置", mainBusiness: "洗浄、塗布現像、熱処理、検査装置", isJapanese: true, companySlug: "screen", sourceUrl, dataAsOf },
  { id: "kokusai-electric", rank: 66, name: "KOKUSAI ELECTRIC", englishName: "KOKUSAI ELECTRIC", ticker: "6525.T", marketCapUsdB: 12.39, marketCapDisplay: "124億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、熱処理装置", isJapanese: true, sourceUrl, dataAsOf },
  { id: "rohm", rank: 67, name: "ローム", englishName: "ROHM", ticker: "6963.T", marketCapUsdB: 12.02, marketCapDisplay: "120億ドル", country: "日本", category: "IDM", mainBusiness: "パワー、アナログ半導体、電子部品", isJapanese: true, companySlug: "rohm", sourceUrl, dataAsOf },
  { id: "sumco", rank: 87, name: "SUMCO", englishName: "SUMCO Corporation", ticker: "3436.T", marketCapUsdB: 7.23, marketCapDisplay: "72.3億ドル", country: "日本", category: "材料・ウェーハ", mainBusiness: "半導体用シリコンウェーハ", isJapanese: true, companySlug: "sumco", sourceUrl, dataAsOf },
  { id: "maruwa", rank: 102, name: "MARUWA", englishName: "Maruwa", ticker: "5344.T", marketCapUsdB: 4.22, marketCapDisplay: "42.2億ドル", country: "日本", category: "材料・電子部品", mainBusiness: "セラミック材料・電子部品", isJapanese: true, sourceUrl: `${sourceUrl}?page=2`, dataAsOf },
];

export const japanSemiconductorMarketCapRanking = [
  ...worldSemiconductorMarketCapRanking.filter((company) => company.isJapanese),
  ...japaneseCompaniesOutsideTop30,
]
  .sort((first, second) => first.rank - second.rank)
  .slice(0, 10)
  .map((company, index) => ({ ...company, domesticRank: index + 1 }));
