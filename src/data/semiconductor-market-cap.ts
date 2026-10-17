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
  dataAsOf: "2026-10-16",
  retrievedAt: "2026-10-17",
  currency: "米ドル",
  sourceName: "CompaniesMarketCap Semiconductors",
  sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
  definition: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業",
} as const;

const sourceUrl = semiconductorMarketCapMeta.sourceUrl;
const dataAsOf = semiconductorMarketCapMeta.dataAsOf;

export const worldSemiconductorMarketCapRanking: SemiconductorMarketCapCompany[] = [
  { id: "nvidia", rank: 1, name: "NVIDIA", englishName: "NVIDIA", ticker: "NVDA", marketCapUsdB: 5170, marketCapDisplay: "5.17兆ドル", country: "米国", category: "ファブレス", mainBusiness: "AI向けGPU、アクセラレーテッドコンピューティング", isJapanese: false, companySlug: "nvidia", sourceUrl, dataAsOf },
  { id: "tsmc", rank: 2, name: "TSMC（台湾積体電路製造）", englishName: "Taiwan Semiconductor Manufacturing Company", ticker: "TSM", marketCapUsdB: 2139, marketCapDisplay: "2.14兆ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, companySlug: "tsmc", sourceUrl, dataAsOf },
  { id: "broadcom", rank: 3, name: "ブロードコム", englishName: "Broadcom", ticker: "AVGO", marketCapUsdB: 1569, marketCapDisplay: "1.57兆ドル", country: "米国", category: "ファブレス・ソフトウェア", mainBusiness: "ネットワーク、通信、カスタム半導体、インフラソフトウェア", isJapanese: false, companySlug: "broadcom", sourceUrl, dataAsOf },
  { id: "samsung-electronics", rank: 4, name: "サムスン電子", englishName: "Samsung Electronics", ticker: "005930.KS", marketCapUsdB: 1051, marketCapDisplay: "1.05兆ドル", country: "韓国", category: "IDM（総合電機）", mainBusiness: "メモリ、ロジック、ファウンドリ、電子機器", isJapanese: false, companySlug: "samsung-electronics", sourceUrl, dataAsOf },
  { id: "micron", rank: 5, name: "マイクロン・テクノロジー", englishName: "Micron Technology", ticker: "MU", marketCapUsdB: 994.34, marketCapDisplay: "9940億ドル", country: "米国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM、SSD", isJapanese: false, companySlug: "micron", sourceUrl, dataAsOf },
  { id: "amd", rank: 6, name: "AMD", englishName: "Advanced Micro Devices", ticker: "AMD", marketCapUsdB: 863.17, marketCapDisplay: "8630億ドル", country: "米国", category: "ファブレス", mainBusiness: "CPU、GPU、データセンター向け半導体", isJapanese: false, companySlug: "amd", sourceUrl, dataAsOf },
  { id: "sk-hynix", rank: 7, name: "SK hynix", englishName: "SK hynix", ticker: "000660.KS", marketCapUsdB: 694.66, marketCapDisplay: "6950億ドル", country: "韓国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM", isJapanese: false, companySlug: "sk-hynix", sourceUrl, dataAsOf },
  { id: "asml", rank: 8, name: "ASML", englishName: "ASML Holding", ticker: "ASML", marketCapUsdB: 630.5, marketCapDisplay: "6310億ドル", country: "オランダ", category: "製造装置", mainBusiness: "EUV・DUV露光装置", isJapanese: false, companySlug: "asml", sourceUrl, dataAsOf },
  { id: "cxmt", rank: 9, name: "CXMT", englishName: "ChangXin Memory Technologies", ticker: "688825.SS", marketCapUsdB: 477.54, marketCapDisplay: "4780億ドル", country: "中国", category: "メモリ・IDM", mainBusiness: "DRAMなどのメモリ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "intel", rank: 10, name: "インテル", englishName: "Intel", ticker: "INTC", marketCapUsdB: 474.95, marketCapDisplay: "4750億ドル", country: "米国", category: "IDM・ファウンドリ", mainBusiness: "CPU、データセンター、半導体製造", isJapanese: false, companySlug: "intel", sourceUrl, dataAsOf },
  { id: "lam-research", rank: 11, name: "ラムリサーチ", englishName: "Lam Research", ticker: "LRCX", marketCapUsdB: 330.3, marketCapDisplay: "3300億ドル", country: "米国", category: "製造装置", mainBusiness: "エッチング、成膜、洗浄装置", isJapanese: false, companySlug: "lam-research", sourceUrl, dataAsOf },
  { id: "applied-materials", rank: 12, name: "アプライド マテリアルズ", englishName: "Applied Materials", ticker: "AMAT", marketCapUsdB: 324.81, marketCapDisplay: "3250億ドル", country: "米国", category: "製造装置", mainBusiness: "成膜、エッチング、イオン注入などの装置", isJapanese: false, companySlug: "applied-materials", sourceUrl, dataAsOf },
  { id: "texas-instruments", rank: 13, name: "テキサス・インスツルメンツ", englishName: "Texas Instruments", ticker: "TXN", marketCapUsdB: 252.49, marketCapDisplay: "2520億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、組み込みプロセッサ", isJapanese: false, companySlug: "texas-instruments", sourceUrl, dataAsOf },
  { id: "arm", rank: 14, name: "Arm", englishName: "Arm Holdings", ticker: "ARM", marketCapUsdB: 243.29, marketCapDisplay: "2430億ドル", country: "英国", category: "EDA・IP", mainBusiness: "CPUアーキテクチャと半導体IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "kla", rank: 15, name: "KLA", englishName: "KLA Corporation", ticker: "KLAC", marketCapUsdB: 216.29, marketCapDisplay: "2160億ドル", country: "米国", category: "検査・計測装置", mainBusiness: "プロセス制御、検査、計測装置", isJapanese: false, companySlug: "kla", sourceUrl, dataAsOf },
  { id: "mediatek", rank: 16, name: "MediaTek", englishName: "MediaTek", ticker: "2454.TW", marketCapUsdB: 209.38, marketCapDisplay: "2090億ドル", country: "台湾", category: "ファブレス", mainBusiness: "モバイル、通信、民生向けSoC", isJapanese: false, sourceUrl, dataAsOf },
  { id: "marvell", rank: 17, name: "マーベル・テクノロジー", englishName: "Marvell Technology", ticker: "MRVL", marketCapUsdB: 204.75, marketCapDisplay: "2050億ドル", country: "米国", category: "ファブレス", mainBusiness: "データインフラ、ネットワーク半導体", isJapanese: false, companySlug: "marvell", sourceUrl, dataAsOf },
  { id: "analog-devices", rank: 18, name: "アナログ・デバイセズ", englishName: "Analog Devices", ticker: "ADI", marketCapUsdB: 191.61, marketCapDisplay: "1920億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、ミックスドシグナル半導体", isJapanese: false, companySlug: "analog-devices", sourceUrl, dataAsOf },
  { id: "qualcomm", rank: 19, name: "クアルコム", englishName: "Qualcomm", ticker: "QCOM", marketCapUsdB: 183.78, marketCapDisplay: "1840億ドル", country: "米国", category: "ファブレス", mainBusiness: "モバイルSoC、通信モデム、無線技術", isJapanese: false, companySlug: "qualcomm", sourceUrl, dataAsOf },
  { id: "tokyo-electron", rank: 20, name: "東京エレクトロン", englishName: "Tokyo Electron", ticker: "8035.T", marketCapUsdB: 165.99, marketCapDisplay: "1660億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、塗布現像、エッチング、洗浄装置", isJapanese: true, companySlug: "tokyo-electron", sourceUrl, dataAsOf },
  { id: "advantest", rank: 21, name: "アドバンテスト", englishName: "Advantest", ticker: "6857.T", marketCapUsdB: 157.71, marketCapDisplay: "1580億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "半導体テストシステム、テスト周辺機器", isJapanese: true, companySlug: "advantest", sourceUrl, dataAsOf },
  { id: "synopsys", rank: 22, name: "Synopsys", englishName: "Synopsys", ticker: "SNPS", marketCapUsdB: 87.12, marketCapDisplay: "871億ドル", country: "米国", category: "EDA・IP", mainBusiness: "半導体設計ソフト、設計IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "ase", rank: 23, name: "ASE Technology", englishName: "ASE Technology Holding", ticker: "ASX", marketCapUsdB: 86.91, marketCapDisplay: "869億ドル", country: "台湾", category: "OSAT・後工程", mainBusiness: "半導体組立、パッケージ、テスト受託", isJapanese: false, sourceUrl, dataAsOf },
  { id: "cambricon", rank: 24, name: "Cambricon Technologies", englishName: "Cambricon Technologies", ticker: "688256.SS", marketCapUsdB: 86.18, marketCapDisplay: "862億ドル", country: "中国", category: "ファブレス", mainBusiness: "AIアクセラレーター、AIプロセッサ", isJapanese: false, sourceUrl, dataAsOf },
  { id: "infineon", rank: 25, name: "インフィニオン", englishName: "Infineon Technologies", ticker: "IFX.DE", marketCapUsdB: 76.46, marketCapDisplay: "765億ドル", country: "ドイツ", category: "IDM", mainBusiness: "パワー、車載、セキュリティ半導体", isJapanese: false, companySlug: "infineon", sourceUrl, dataAsOf },
  { id: "naura", rank: 26, name: "NAURA Technology", englishName: "NAURA Technology Group", ticker: "002371.SZ", marketCapUsdB: 64.52, marketCapDisplay: "645億ドル", country: "中国", category: "製造装置", mainBusiness: "成膜、エッチング、熱処理などの装置", isJapanese: false, sourceUrl, dataAsOf },
  { id: "monolithic-power-systems", rank: 27, name: "Monolithic Power Systems", englishName: "Monolithic Power Systems", ticker: "MPWR", marketCapUsdB: 59.5, marketCapDisplay: "595億ドル", country: "米国", category: "ファブレス", mainBusiness: "電源管理、アナログ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "nxp", rank: 28, name: "NXPセミコンダクターズ", englishName: "NXP Semiconductors", ticker: "NXPI", marketCapUsdB: 57.82, marketCapDisplay: "578億ドル", country: "オランダ", category: "IDM", mainBusiness: "車載、産業、IoT、セキュア接続向け半導体", isJapanese: false, companySlug: "nxp", sourceUrl, dataAsOf },
  { id: "smic", rank: 29, name: "SMIC", englishName: "Semiconductor Manufacturing International Corporation", ticker: "0981.HK", marketCapUsdB: 57.17, marketCapDisplay: "572億ドル", country: "中国", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, sourceUrl, dataAsOf },
  { id: "umc", rank: 30, name: "UMC（聯華電子）", englishName: "United Microelectronics Corporation", ticker: "UMC", marketCapUsdB: 49.7, marketCapDisplay: "497億ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "ロジック・特殊プロセスの半導体受託製造", isJapanese: false, sourceUrl, dataAsOf },
];

const japaneseCompaniesOutsideTop30: SemiconductorMarketCapCompany[] = [
  { id: "disco", rank: 38, name: "ディスコ", englishName: "DISCO Corporation", ticker: "6146.T", marketCapUsdB: 36.95, marketCapDisplay: "370億ドル", country: "日本", category: "製造装置", mainBusiness: "切断、研削、研磨装置と精密加工ツール", isJapanese: true, companySlug: "disco", sourceUrl, dataAsOf },
  { id: "renesas", rank: 39, name: "ルネサス エレクトロニクス", englishName: "Renesas Electronics", ticker: "6723.T", marketCapUsdB: 35.23, marketCapDisplay: "352億ドル", country: "日本", category: "IDM", mainBusiness: "車載、産業向けマイコン、アナログ、パワー半導体", isJapanese: true, companySlug: "renesas", sourceUrl, dataAsOf },
  { id: "lasertec", rank: 47, name: "レーザーテック", englishName: "Lasertec", ticker: "6920.T", marketCapUsdB: 23.38, marketCapDisplay: "234億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "フォトマスク、マスクブランクス、ウェーハ検査", isJapanese: true, companySlug: "lasertec", sourceUrl, dataAsOf },
  { id: "screen", rank: 56, name: "SCREENホールディングス", englishName: "SCREEN Holdings", ticker: "7735.T", marketCapUsdB: 16.52, marketCapDisplay: "165億ドル", country: "日本", category: "製造装置", mainBusiness: "洗浄、塗布現像、熱処理、検査装置", isJapanese: true, companySlug: "screen", sourceUrl, dataAsOf },
  { id: "kokusai-electric", rank: 65, name: "KOKUSAI ELECTRIC", englishName: "KOKUSAI ELECTRIC", ticker: "6525.T", marketCapUsdB: 11.71, marketCapDisplay: "117億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、熱処理装置", isJapanese: true, sourceUrl, dataAsOf },
  { id: "rohm", rank: 72, name: "ローム", englishName: "ROHM", ticker: "6963.T", marketCapUsdB: 10.13, marketCapDisplay: "101億ドル", country: "日本", category: "IDM", mainBusiness: "パワー、アナログ半導体、電子部品", isJapanese: true, companySlug: "rohm", sourceUrl, dataAsOf },
  { id: "sumco", rank: 90, name: "SUMCO", englishName: "SUMCO Corporation", ticker: "3436.T", marketCapUsdB: 5.98, marketCapDisplay: "59.8億ドル", country: "日本", category: "材料・ウェーハ", mainBusiness: "半導体用シリコンウェーハ", isJapanese: true, companySlug: "sumco", sourceUrl, dataAsOf },
  { id: "rorze", rank: 96, name: "ローツェ", englishName: "Rorze Corporation", ticker: "6323.T", marketCapUsdB: 4.89, marketCapDisplay: "48.9億ドル", country: "日本", category: "製造装置", mainBusiness: "ウェーハ搬送ロボット、EFEMなどの搬送装置", isJapanese: true, sourceUrl, dataAsOf },
];

export const japanSemiconductorMarketCapRanking = [
  ...worldSemiconductorMarketCapRanking.filter((company) => company.isJapanese),
  ...japaneseCompaniesOutsideTop30,
]
  .sort((first, second) => first.rank - second.rank)
  .slice(0, 10)
  .map((company, index) => ({ ...company, domesticRank: index + 1 }));
