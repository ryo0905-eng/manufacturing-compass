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
  dataAsOf: "2026-10-01",
  retrievedAt: "2026-10-01",
  currency: "米ドル",
  sourceName: "CompaniesMarketCap Semiconductors",
  sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
  definition: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業",
} as const;

const sourceUrl = semiconductorMarketCapMeta.sourceUrl;
const dataAsOf = semiconductorMarketCapMeta.dataAsOf;

export const worldSemiconductorMarketCapRanking: SemiconductorMarketCapCompany[] = [
  { id: "nvidia", rank: 1, name: "NVIDIA", englishName: "NVIDIA", ticker: "NVDA", marketCapUsdB: 5486, marketCapDisplay: "5.49兆ドル", country: "米国", category: "ファブレス", mainBusiness: "AI向けGPU、アクセラレーテッドコンピューティング", isJapanese: false, companySlug: "nvidia", sourceUrl, dataAsOf },
  { id: "tsmc", rank: 2, name: "TSMC（台湾積体電路製造）", englishName: "Taiwan Semiconductor Manufacturing Company", ticker: "TSM", marketCapUsdB: 2369, marketCapDisplay: "2.37兆ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, companySlug: "tsmc", sourceUrl, dataAsOf },
  { id: "broadcom", rank: 3, name: "ブロードコム", englishName: "Broadcom", ticker: "AVGO", marketCapUsdB: 1695, marketCapDisplay: "1.70兆ドル", country: "米国", category: "ファブレス・ソフトウェア", mainBusiness: "ネットワーク、通信、カスタム半導体、インフラソフトウェア", isJapanese: false, companySlug: "broadcom", sourceUrl, dataAsOf },
  { id: "samsung-electronics", rank: 4, name: "サムスン電子", englishName: "Samsung Electronics", ticker: "005930.KS", marketCapUsdB: 1301, marketCapDisplay: "1.30兆ドル", country: "韓国", category: "IDM（総合電機）", mainBusiness: "メモリ、ロジック、ファウンドリ、電子機器", isJapanese: false, companySlug: "samsung-electronics", sourceUrl, dataAsOf },
  { id: "micron", rank: 5, name: "マイクロン・テクノロジー", englishName: "Micron Technology", ticker: "MU", marketCapUsdB: 1202, marketCapDisplay: "1.20兆ドル", country: "米国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM、SSD", isJapanese: false, companySlug: "micron", sourceUrl, dataAsOf },
  { id: "amd", rank: 6, name: "AMD", englishName: "Advanced Micro Devices", ticker: "AMD", marketCapUsdB: 991.84, marketCapDisplay: "9920億ドル", country: "米国", category: "ファブレス", mainBusiness: "CPU、GPU、データセンター向け半導体", isJapanese: false, companySlug: "amd", sourceUrl, dataAsOf },
  { id: "sk-hynix", rank: 7, name: "SK hynix", englishName: "SK hynix", ticker: "000660.KS", marketCapUsdB: 930.28, marketCapDisplay: "9300億ドル", country: "韓国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM", isJapanese: false, companySlug: "sk-hynix", sourceUrl, dataAsOf },
  { id: "asml", rank: 8, name: "ASML", englishName: "ASML Holding", ticker: "ASML", marketCapUsdB: 704.58, marketCapDisplay: "7050億ドル", country: "オランダ", category: "製造装置", mainBusiness: "EUV・DUV露光装置", isJapanese: false, companySlug: "asml", sourceUrl, dataAsOf },
  { id: "intel", rank: 9, name: "インテル", englishName: "Intel", ticker: "INTC", marketCapUsdB: 612.81, marketCapDisplay: "6130億ドル", country: "米国", category: "IDM・ファウンドリ", mainBusiness: "CPU、データセンター、半導体製造", isJapanese: false, companySlug: "intel", sourceUrl, dataAsOf },
  { id: "cxmt", rank: 10, name: "CXMT", englishName: "ChangXin Memory Technologies", ticker: "688825.SS", marketCapUsdB: 578.87, marketCapDisplay: "5790億ドル", country: "中国", category: "メモリ・IDM", mainBusiness: "DRAMなどのメモリ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "applied-materials", rank: 11, name: "アプライド マテリアルズ", englishName: "Applied Materials", ticker: "AMAT", marketCapUsdB: 406.32, marketCapDisplay: "4060億ドル", country: "米国", category: "製造装置", mainBusiness: "成膜、エッチング、イオン注入などの装置", isJapanese: false, companySlug: "applied-materials", sourceUrl, dataAsOf },
  { id: "lam-research", rank: 12, name: "ラムリサーチ", englishName: "Lam Research", ticker: "LRCX", marketCapUsdB: 405.28, marketCapDisplay: "4050億ドル", country: "米国", category: "製造装置", mainBusiness: "エッチング、成膜、洗浄装置", isJapanese: false, companySlug: "lam-research", sourceUrl, dataAsOf },
  { id: "arm", rank: 13, name: "Arm", englishName: "Arm Holdings", ticker: "ARM", marketCapUsdB: 313.63, marketCapDisplay: "3140億ドル", country: "英国", category: "EDA・IP", mainBusiness: "CPUアーキテクチャと半導体IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "texas-instruments", rank: 14, name: "テキサス・インスツルメンツ", englishName: "Texas Instruments", ticker: "TXN", marketCapUsdB: 257.25, marketCapDisplay: "2570億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、組み込みプロセッサ", isJapanese: false, companySlug: "texas-instruments", sourceUrl, dataAsOf },
  { id: "kla", rank: 15, name: "KLA", englishName: "KLA Corporation", ticker: "KLAC", marketCapUsdB: 256.47, marketCapDisplay: "2560億ドル", country: "米国", category: "検査・計測装置", mainBusiness: "プロセス制御、検査、計測装置", isJapanese: false, companySlug: "kla", sourceUrl, dataAsOf },
  { id: "mediatek", rank: 16, name: "MediaTek", englishName: "MediaTek", ticker: "2454.TW", marketCapUsdB: 246.71, marketCapDisplay: "2470億ドル", country: "台湾", category: "ファブレス", mainBusiness: "モバイル、通信、民生向けSoC", isJapanese: false, sourceUrl, dataAsOf },
  { id: "marvell", rank: 17, name: "マーベル・テクノロジー", englishName: "Marvell Technology", ticker: "MRVL", marketCapUsdB: 236.6, marketCapDisplay: "2370億ドル", country: "米国", category: "ファブレス", mainBusiness: "データインフラ、ネットワーク半導体", isJapanese: false, companySlug: "marvell", sourceUrl, dataAsOf },
  { id: "qualcomm", rank: 18, name: "クアルコム", englishName: "Qualcomm", ticker: "QCOM", marketCapUsdB: 196.62, marketCapDisplay: "1970億ドル", country: "米国", category: "ファブレス", mainBusiness: "モバイルSoC、通信モデム、無線技術", isJapanese: false, companySlug: "qualcomm", sourceUrl, dataAsOf },
  { id: "analog-devices", rank: 19, name: "アナログ・デバイセズ", englishName: "Analog Devices", ticker: "ADI", marketCapUsdB: 192.96, marketCapDisplay: "1930億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、ミックスドシグナル半導体", isJapanese: false, companySlug: "analog-devices", sourceUrl, dataAsOf },
  { id: "tokyo-electron", rank: 20, name: "東京エレクトロン", englishName: "Tokyo Electron", ticker: "8035.T", marketCapUsdB: 171.02, marketCapDisplay: "1710億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、塗布現像、エッチング、洗浄装置", isJapanese: true, companySlug: "tokyo-electron", sourceUrl, dataAsOf },
  { id: "advantest", rank: 21, name: "アドバンテスト", englishName: "Advantest", ticker: "6857.T", marketCapUsdB: 157.62, marketCapDisplay: "1580億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "半導体テストシステム、テスト周辺機器", isJapanese: true, companySlug: "advantest", sourceUrl, dataAsOf },
  { id: "ase", rank: 22, name: "ASE Technology", englishName: "ASE Technology Holding", ticker: "ASX", marketCapUsdB: 117.97, marketCapDisplay: "1180億ドル", country: "台湾", category: "OSAT・後工程", mainBusiness: "半導体組立、パッケージ、テスト受託", isJapanese: false, sourceUrl, dataAsOf },
  { id: "cambricon", rank: 23, name: "Cambricon Technologies", englishName: "Cambricon Technologies", ticker: "688256.SS", marketCapUsdB: 94.66, marketCapDisplay: "947億ドル", country: "中国", category: "ファブレス", mainBusiness: "AIアクセラレーター、AIプロセッサ", isJapanese: false, sourceUrl, dataAsOf },
  { id: "infineon", rank: 24, name: "インフィニオン", englishName: "Infineon Technologies", ticker: "IFX.DE", marketCapUsdB: 87.65, marketCapDisplay: "877億ドル", country: "ドイツ", category: "IDM", mainBusiness: "パワー、車載、セキュリティ半導体", isJapanese: false, companySlug: "infineon", sourceUrl, dataAsOf },
  { id: "synopsys", rank: 25, name: "Synopsys", englishName: "Synopsys", ticker: "SNPS", marketCapUsdB: 79.54, marketCapDisplay: "795億ドル", country: "米国", category: "EDA・IP", mainBusiness: "半導体設計ソフト、設計IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "naura", rank: 26, name: "NAURA Technology", englishName: "NAURA Technology Group", ticker: "002371.SZ", marketCapUsdB: 66.69, marketCapDisplay: "667億ドル", country: "中国", category: "製造装置", mainBusiness: "成膜、エッチング、熱処理などの装置", isJapanese: false, sourceUrl, dataAsOf },
  { id: "monolithic-power-systems", rank: 27, name: "Monolithic Power Systems", englishName: "Monolithic Power Systems", ticker: "MPWR", marketCapUsdB: 66.63, marketCapDisplay: "666億ドル", country: "米国", category: "ファブレス", mainBusiness: "電源管理、アナログ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "smic", rank: 28, name: "SMIC", englishName: "Semiconductor Manufacturing International Corporation", ticker: "0981.HK", marketCapUsdB: 66.18, marketCapDisplay: "662億ドル", country: "中国", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, sourceUrl, dataAsOf },
  { id: "astera-labs", rank: 29, name: "Astera Labs", englishName: "Astera Labs", ticker: "ALAB", marketCapUsdB: 62.07, marketCapDisplay: "621億ドル", country: "米国", category: "ファブレス", mainBusiness: "AIインフラ向けPCIe・CXL・Ethernet接続半導体とソフトウェア", isJapanese: false, sourceUrl, dataAsOf },
  { id: "umc", rank: 30, name: "UMC（聯華電子）", englishName: "United Microelectronics Corporation", ticker: "UMC", marketCapUsdB: 61.99, marketCapDisplay: "620億ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "ロジック・特殊プロセスの半導体受託製造", isJapanese: false, sourceUrl, dataAsOf },
];

const japaneseCompaniesOutsideTop30: SemiconductorMarketCapCompany[] = [
  { id: "renesas", rank: 39, name: "ルネサス エレクトロニクス", englishName: "Renesas Electronics", ticker: "6723.T", marketCapUsdB: 40.49, marketCapDisplay: "405億ドル", country: "日本", category: "IDM", mainBusiness: "車載、産業向けマイコン、アナログ、パワー半導体", isJapanese: true, companySlug: "renesas", sourceUrl, dataAsOf },
  { id: "disco", rank: 40, name: "ディスコ", englishName: "DISCO Corporation", ticker: "6146.T", marketCapUsdB: 39.71, marketCapDisplay: "397億ドル", country: "日本", category: "製造装置", mainBusiness: "切断、研削、研磨装置と精密加工ツール", isJapanese: true, companySlug: "disco", sourceUrl, dataAsOf },
  { id: "lasertec", rank: 51, name: "レーザーテック", englishName: "Lasertec", ticker: "6920.T", marketCapUsdB: 23.51, marketCapDisplay: "235億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "フォトマスク、マスクブランクス、ウェーハ検査", isJapanese: true, companySlug: "lasertec", sourceUrl, dataAsOf },
  { id: "screen", rank: 58, name: "SCREENホールディングス", englishName: "SCREEN Holdings", ticker: "7735.T", marketCapUsdB: 17.52, marketCapDisplay: "175億ドル", country: "日本", category: "製造装置", mainBusiness: "洗浄、塗布現像、熱処理、検査装置", isJapanese: true, companySlug: "screen", sourceUrl, dataAsOf },
  { id: "kokusai-electric", rank: 64, name: "KOKUSAI ELECTRIC", englishName: "KOKUSAI ELECTRIC", ticker: "6525.T", marketCapUsdB: 14.24, marketCapDisplay: "142億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、熱処理装置", isJapanese: true, sourceUrl, dataAsOf },
  { id: "rohm", rank: 71, name: "ローム", englishName: "ROHM", ticker: "6963.T", marketCapUsdB: 12.15, marketCapDisplay: "122億ドル", country: "日本", category: "IDM", mainBusiness: "パワー、アナログ半導体、電子部品", isJapanese: true, companySlug: "rohm", sourceUrl, dataAsOf },
  { id: "sumco", rank: 87, name: "SUMCO", englishName: "SUMCO Corporation", ticker: "3436.T", marketCapUsdB: 7.39, marketCapDisplay: "73.9億ドル", country: "日本", category: "材料・ウェーハ", mainBusiness: "半導体用シリコンウェーハ", isJapanese: true, companySlug: "sumco", sourceUrl, dataAsOf },
  { id: "rorze", rank: 103, name: "ローツェ", englishName: "Rorze Corporation", ticker: "6323.T", marketCapUsdB: 4.41, marketCapDisplay: "44.1億ドル", country: "日本", category: "製造装置", mainBusiness: "ウェーハ搬送ロボット、EFEMなどの搬送装置", isJapanese: true, sourceUrl: `${sourceUrl}?page=2`, dataAsOf },
];

export const japanSemiconductorMarketCapRanking = [
  ...worldSemiconductorMarketCapRanking.filter((company) => company.isJapanese),
  ...japaneseCompaniesOutsideTop30,
]
  .sort((first, second) => first.rank - second.rank)
  .slice(0, 10)
  .map((company, index) => ({ ...company, domesticRank: index + 1 }));
