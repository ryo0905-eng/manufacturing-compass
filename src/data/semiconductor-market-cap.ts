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
  dataAsOf: "2026-10-31",
  retrievedAt: "2026-11-01",
  currency: "米ドル",
  sourceName: "CompaniesMarketCap Semiconductors",
  sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
  definition: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業",
} as const;

const sourceUrl = semiconductorMarketCapMeta.sourceUrl;
const secondPageSourceUrl = `${sourceUrl}?page=2`;
const dataAsOf = semiconductorMarketCapMeta.dataAsOf;

export const worldSemiconductorMarketCapRanking: SemiconductorMarketCapCompany[] = [
  { id: "nvidia", rank: 1, name: "NVIDIA", englishName: "NVIDIA", ticker: "NVDA", marketCapUsdB: 4941, marketCapDisplay: "4.94兆ドル", country: "米国", category: "ファブレス", mainBusiness: "AI向けGPU、アクセラレーテッドコンピューティング", isJapanese: false, companySlug: "nvidia", sourceUrl, dataAsOf },
  { id: "tsmc", rank: 2, name: "TSMC（台湾積体電路製造）", englishName: "Taiwan Semiconductor Manufacturing Company", ticker: "TSM", marketCapUsdB: 2106, marketCapDisplay: "2.11兆ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, companySlug: "tsmc", sourceUrl, dataAsOf },
  { id: "broadcom", rank: 3, name: "ブロードコム", englishName: "Broadcom", ticker: "AVGO", marketCapUsdB: 1556, marketCapDisplay: "1.56兆ドル", country: "米国", category: "ファブレス・ソフトウェア", mainBusiness: "ネットワーク、通信、カスタム半導体、インフラソフトウェア", isJapanese: false, companySlug: "broadcom", sourceUrl, dataAsOf },
  { id: "samsung-electronics", rank: 4, name: "サムスン電子", englishName: "Samsung Electronics", ticker: "005930.KS", marketCapUsdB: 1105, marketCapDisplay: "1.10兆ドル", country: "韓国", category: "IDM（総合電機）", mainBusiness: "メモリ、ロジック、ファウンドリ、電子機器", isJapanese: false, companySlug: "samsung-electronics", sourceUrl, dataAsOf },
  { id: "micron", rank: 5, name: "マイクロン・テクノロジー", englishName: "Micron Technology", ticker: "MU", marketCapUsdB: 1001, marketCapDisplay: "1.00兆ドル", country: "米国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM、SSD", isJapanese: false, companySlug: "micron", sourceUrl, dataAsOf },
  { id: "amd", rank: 6, name: "AMD", englishName: "Advanced Micro Devices", ticker: "AMD", marketCapUsdB: 824.07, marketCapDisplay: "8240億ドル", country: "米国", category: "ファブレス", mainBusiness: "CPU、GPU、データセンター向け半導体", isJapanese: false, companySlug: "amd", sourceUrl, dataAsOf },
  { id: "sk-hynix", rank: 7, name: "SK hynix", englishName: "SK hynix", ticker: "000660.KS", marketCapUsdB: 754.56, marketCapDisplay: "7550億ドル", country: "韓国", category: "メモリ・IDM", mainBusiness: "DRAM、NAND、HBM", isJapanese: false, companySlug: "sk-hynix", sourceUrl, dataAsOf },
  { id: "asml", rank: 8, name: "ASML", englishName: "ASML Holding", ticker: "ASML", marketCapUsdB: 603.52, marketCapDisplay: "6040億ドル", country: "オランダ", category: "製造装置", mainBusiness: "EUV・DUV露光装置", isJapanese: false, companySlug: "asml", sourceUrl, dataAsOf },
  { id: "cxmt", rank: 9, name: "CXMT", englishName: "ChangXin Memory Technologies", ticker: "688825.SS", marketCapUsdB: 443.46, marketCapDisplay: "4430億ドル", country: "中国", category: "メモリ・IDM", mainBusiness: "DRAMなどのメモリ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "intel", rank: 10, name: "インテル", englishName: "Intel", ticker: "INTC", marketCapUsdB: 349.18, marketCapDisplay: "3490億ドル", country: "米国", category: "IDM・ファウンドリ", mainBusiness: "CPU、データセンター、半導体製造", isJapanese: false, companySlug: "intel", sourceUrl, dataAsOf },
  { id: "applied-materials", rank: 11, name: "アプライド マテリアルズ", englishName: "Applied Materials", ticker: "AMAT", marketCapUsdB: 309.57, marketCapDisplay: "3100億ドル", country: "米国", category: "製造装置", mainBusiness: "成膜、エッチング、イオン注入などの装置", isJapanese: false, companySlug: "applied-materials", sourceUrl, dataAsOf },
  { id: "lam-research", rank: 12, name: "ラムリサーチ", englishName: "Lam Research", ticker: "LRCX", marketCapUsdB: 299.22, marketCapDisplay: "2990億ドル", country: "米国", category: "製造装置", mainBusiness: "エッチング、成膜、洗浄装置", isJapanese: false, companySlug: "lam-research", sourceUrl, dataAsOf },
  { id: "texas-instruments", rank: 13, name: "テキサス・インスツルメンツ", englishName: "Texas Instruments", ticker: "TXN", marketCapUsdB: 275.04, marketCapDisplay: "2750億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、組み込みプロセッサ", isJapanese: false, companySlug: "texas-instruments", sourceUrl, dataAsOf },
  { id: "arm", rank: 14, name: "Arm", englishName: "Arm Holdings", ticker: "ARM", marketCapUsdB: 219.97, marketCapDisplay: "2200億ドル", country: "英国", category: "EDA・IP", mainBusiness: "CPUアーキテクチャと半導体IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "kla", rank: 15, name: "KLA", englishName: "KLA Corporation", ticker: "KLAC", marketCapUsdB: 206.07, marketCapDisplay: "2060億ドル", country: "米国", category: "検査・計測装置", mainBusiness: "プロセス制御、検査、計測装置", isJapanese: false, companySlug: "kla", sourceUrl, dataAsOf },
  { id: "analog-devices", rank: 16, name: "アナログ・デバイセズ", englishName: "Analog Devices", ticker: "ADI", marketCapUsdB: 202.11, marketCapDisplay: "2020億ドル", country: "米国", category: "IDM", mainBusiness: "アナログ、ミックスドシグナル半導体", isJapanese: false, companySlug: "analog-devices", sourceUrl, dataAsOf },
  { id: "mediatek", rank: 17, name: "MediaTek", englishName: "MediaTek", ticker: "2454.TW", marketCapUsdB: 192.45, marketCapDisplay: "1920億ドル", country: "台湾", category: "ファブレス", mainBusiness: "モバイル、通信、民生向けSoC", isJapanese: false, sourceUrl, dataAsOf },
  { id: "marvell", rank: 18, name: "マーベル・テクノロジー", englishName: "Marvell Technology", ticker: "MRVL", marketCapUsdB: 176.5, marketCapDisplay: "1760億ドル", country: "米国", category: "ファブレス", mainBusiness: "データインフラ、ネットワーク半導体", isJapanese: false, companySlug: "marvell", sourceUrl, dataAsOf },
  { id: "qualcomm", rank: 19, name: "クアルコム", englishName: "Qualcomm", ticker: "QCOM", marketCapUsdB: 175.96, marketCapDisplay: "1760億ドル", country: "米国", category: "ファブレス", mainBusiness: "モバイルSoC、通信モデム、無線技術", isJapanese: false, companySlug: "qualcomm", sourceUrl, dataAsOf },
  { id: "advantest", rank: 20, name: "アドバンテスト", englishName: "Advantest", ticker: "6857.T", marketCapUsdB: 159.23, marketCapDisplay: "1590億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "半導体テストシステム、テスト周辺機器", isJapanese: true, companySlug: "advantest", sourceUrl, dataAsOf },
  { id: "tokyo-electron", rank: 21, name: "東京エレクトロン", englishName: "Tokyo Electron", ticker: "8035.T", marketCapUsdB: 136.71, marketCapDisplay: "1370億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、塗布現像、エッチング、洗浄装置", isJapanese: true, companySlug: "tokyo-electron", sourceUrl, dataAsOf },
  { id: "synopsys", rank: 22, name: "Synopsys", englishName: "Synopsys", ticker: "SNPS", marketCapUsdB: 89.61, marketCapDisplay: "896億ドル", country: "米国", category: "EDA・IP", mainBusiness: "半導体設計ソフト、設計IP", isJapanese: false, sourceUrl, dataAsOf },
  { id: "ase", rank: 23, name: "ASE Technology", englishName: "ASE Technology Holding", ticker: "ASX", marketCapUsdB: 87.19, marketCapDisplay: "872億ドル", country: "台湾", category: "OSAT・後工程", mainBusiness: "半導体組立、パッケージ、テスト受託", isJapanese: false, sourceUrl, dataAsOf },
  { id: "cambricon", rank: 24, name: "Cambricon Technologies", englishName: "Cambricon Technologies", ticker: "688256.SS", marketCapUsdB: 82.9, marketCapDisplay: "829億ドル", country: "中国", category: "ファブレス", mainBusiness: "AIアクセラレーター、AIプロセッサ", isJapanese: false, sourceUrl, dataAsOf },
  { id: "infineon", rank: 25, name: "インフィニオン", englishName: "Infineon Technologies", ticker: "IFX.DE", marketCapUsdB: 73.8, marketCapDisplay: "738億ドル", country: "ドイツ", category: "IDM", mainBusiness: "パワー、車載、セキュリティ半導体", isJapanese: false, companySlug: "infineon", sourceUrl, dataAsOf },
  { id: "nxp", rank: 26, name: "NXPセミコンダクターズ", englishName: "NXP Semiconductors", ticker: "NXPI", marketCapUsdB: 65.43, marketCapDisplay: "654億ドル", country: "オランダ", category: "IDM", mainBusiness: "車載、産業、IoT、セキュア接続向け半導体", isJapanese: false, companySlug: "nxp", sourceUrl, dataAsOf },
  { id: "monolithic-power-systems", rank: 27, name: "Monolithic Power Systems", englishName: "Monolithic Power Systems", ticker: "MPWR", marketCapUsdB: 59.54, marketCapDisplay: "595億ドル", country: "米国", category: "ファブレス", mainBusiness: "電源管理、アナログ半導体", isJapanese: false, sourceUrl, dataAsOf },
  { id: "naura", rank: 28, name: "NAURA Technology", englishName: "NAURA Technology Group", ticker: "002371.SZ", marketCapUsdB: 52.21, marketCapDisplay: "522億ドル", country: "中国", category: "製造装置", mainBusiness: "成膜、エッチング、熱処理などの装置", isJapanese: false, sourceUrl, dataAsOf },
  { id: "smic", rank: 29, name: "SMIC", englishName: "Semiconductor Manufacturing International Corporation", ticker: "0981.HK", marketCapUsdB: 46.9, marketCapDisplay: "469億ドル", country: "中国", category: "ファウンドリ", mainBusiness: "半導体の受託製造", isJapanese: false, sourceUrl, dataAsOf },
  { id: "umc", rank: 30, name: "UMC（聯華電子）", englishName: "United Microelectronics Corporation", ticker: "UMC", marketCapUsdB: 41.83, marketCapDisplay: "418億ドル", country: "台湾", category: "ファウンドリ", mainBusiness: "ロジック・特殊プロセスの半導体受託製造", isJapanese: false, sourceUrl, dataAsOf },
];

const japaneseCompaniesOutsideTop30: SemiconductorMarketCapCompany[] = [
  { id: "disco", rank: 37, name: "ディスコ", englishName: "DISCO Corporation", ticker: "6146.T", marketCapUsdB: 34, marketCapDisplay: "340億ドル", country: "日本", category: "製造装置", mainBusiness: "切断、研削、研磨装置と精密加工ツール", isJapanese: true, companySlug: "disco", sourceUrl, dataAsOf },
  { id: "renesas", rank: 38, name: "ルネサス エレクトロニクス", englishName: "Renesas Electronics", ticker: "6723.T", marketCapUsdB: 33.12, marketCapDisplay: "331億ドル", country: "日本", category: "IDM", mainBusiness: "車載、産業向けマイコン、アナログ、パワー半導体", isJapanese: true, companySlug: "renesas", sourceUrl, dataAsOf },
  { id: "lasertec", rank: 48, name: "レーザーテック", englishName: "Lasertec", ticker: "6920.T", marketCapUsdB: 21.39, marketCapDisplay: "214億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "フォトマスク、マスクブランクス、ウェーハ検査", isJapanese: true, companySlug: "lasertec", sourceUrl, dataAsOf },
  { id: "screen", rank: 56, name: "SCREENホールディングス", englishName: "SCREEN Holdings", ticker: "7735.T", marketCapUsdB: 13.6, marketCapDisplay: "136億ドル", country: "日本", category: "製造装置", mainBusiness: "洗浄、塗布現像、熱処理、検査装置", isJapanese: true, companySlug: "screen", sourceUrl, dataAsOf },
  { id: "kokusai-electric", rank: 65, name: "KOKUSAI ELECTRIC", englishName: "KOKUSAI ELECTRIC", ticker: "6525.T", marketCapUsdB: 10.21, marketCapDisplay: "102億ドル", country: "日本", category: "製造装置", mainBusiness: "成膜、熱処理装置", isJapanese: true, sourceUrl, dataAsOf },
  { id: "rohm", rank: 76, name: "ローム", englishName: "ROHM", ticker: "6963.T", marketCapUsdB: 8.71, marketCapDisplay: "87.1億ドル", country: "日本", category: "IDM", mainBusiness: "パワー、アナログ半導体、電子部品", isJapanese: true, companySlug: "rohm", sourceUrl, dataAsOf },
  { id: "sumco", rank: 93, name: "SUMCO", englishName: "SUMCO Corporation", ticker: "3436.T", marketCapUsdB: 5.13, marketCapDisplay: "51.3億ドル", country: "日本", category: "材料・ウェーハ", mainBusiness: "半導体用シリコンウェーハ", isJapanese: true, companySlug: "sumco", sourceUrl, dataAsOf },
  { id: "rorze", rank: 100, name: "ローツェ", englishName: "Rorze Corporation", ticker: "6323.T", marketCapUsdB: 4.05, marketCapDisplay: "40.5億ドル", country: "日本", category: "製造装置", mainBusiness: "ウェーハ搬送ロボット、EFEMなどの搬送装置", isJapanese: true, sourceUrl, dataAsOf },
  { id: "maruwa", rank: 102, name: "MARUWA", englishName: "MARUWA", ticker: "5344.T", marketCapUsdB: 4.01, marketCapDisplay: "40.1億ドル", country: "日本", category: "材料・電子部品", mainBusiness: "セラミック基板、電子部品、石英ガラス製品", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "micronics-japan", rank: 112, name: "日本マイクロニクス", englishName: "Micronics Japan", ticker: "6871.T", marketCapUsdB: 2.78, marketCapDisplay: "27.8億ドル", country: "日本", category: "検査・計測装置", mainBusiness: "ウェーハ上の半導体チップを電気検査するプローブカード", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "socionext", rank: 122, name: "ソシオネクスト", englishName: "Socionext", ticker: "6526.T", marketCapUsdB: 2.02, marketCapDisplay: "20.2億ドル", country: "日本", category: "ファブレス", mainBusiness: "顧客仕様に合わせたSoCの設計、開発、販売", isJapanese: true, companySlug: "socionext", sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "tekscend-photomask", rank: 123, name: "テクセンドフォトマスク", englishName: "Tekscend Photomask", ticker: "429A.T", marketCapUsdB: 1.98, marketCapDisplay: "19.8億ドル", country: "日本", category: "材料・フォトマスク", mainBusiness: "半導体回路の原版となるフォトマスク、ナノインプリント用モールド", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "tomen-devices", rank: 137, name: "トーメンデバイス", englishName: "Tomen Devices Corporation", ticker: "2737.T", marketCapUsdB: 1.03, marketCapDisplay: "10.3億ドル", country: "日本", category: "半導体商社", mainBusiness: "サムスン製半導体・電子部品の販売、顧客への技術支援", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "towa", rank: 138, name: "TOWA", englishName: "TOWA Corporation", ticker: "6315.T", marketCapUsdB: 0.99, marketCapDisplay: "9.9億ドル", country: "日本", category: "製造装置", mainBusiness: "半導体チップを樹脂で保護するモールディング装置・金型", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "rs-technologies", rank: 142, name: "RS Technologies（RSテクノロジーズ）", englishName: "RS Technologies", ticker: "3445.T", marketCapUsdB: 0.82, marketCapDisplay: "8.2億ドル", country: "日本", category: "材料・ウェーハ", mainBusiness: "シリコンウェーハの再生加工・販売、プライムウェーハの製造販売", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
  { id: "sanken-electric", rank: 143, name: "サンケン電気", englishName: "Sanken Electric", ticker: "6707.T", marketCapUsdB: 0.8, marketCapDisplay: "8.0億ドル", country: "日本", category: "IDM", mainBusiness: "電力の変換・制御に使うパワー半導体と関連製品", isJapanese: true, sourceUrl: secondPageSourceUrl, dataAsOf },
];

export const japanSemiconductorMarketCapRanking = [
  ...worldSemiconductorMarketCapRanking.filter((company) => company.isJapanese),
  ...japaneseCompaniesOutsideTop30,
]
  .sort((first, second) => first.rank - second.rank)
  .map((company, index) => ({ ...company, domesticRank: index + 1 }));
