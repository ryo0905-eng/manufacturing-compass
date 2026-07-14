export type SemiconductorSalaryCompany = {
  rank: number;
  name: string;
  ticker: string;
  annualSalaryManYen: number;
  employees: number;
  averageAge: number;
  fiscalPeriod: string;
  category: string;
  companyType: "事業会社" | "持株会社";
  companySlug?: string;
  sourceUrl: string;
  note?: string;
};

export const semiconductorSalaryMeta = {
  retrievedAt: "2026-07-14",
  unit: "万円（1万円単位の概数）",
  definition: "有価証券報告書の提出会社・単体",
  scope: "日本上場の主要半導体関連企業20社",
} as const;

export const semiconductorSalaryRanking: SemiconductorSalaryCompany[] = [
  { rank: 1, name: "ディスコ", ticker: "6146", annualSalaryManYen: 1880, employees: 3687, averageAge: 37.2, fiscalPeriod: "2026年3月期", category: "製造装置", companyType: "事業会社", companySlug: "disco", sourceUrl: "https://www.disco.co.jp/jp/ir/ugc/" },
  { rank: 2, name: "レーザーテック", ticker: "6920", annualSalaryManYen: 1681, employees: 516, averageAge: 40.1, fiscalPeriod: "2025年6月期", category: "検査・計測装置", companyType: "事業会社", companySlug: "lasertec", sourceUrl: "https://www.lasertec.co.jp/ir/data/securities.html" },
  { rank: 3, name: "東京エレクトロン", ticker: "8035", annualSalaryManYen: 1380, employees: 2309, averageAge: 43.1, fiscalPeriod: "2026年3月期", category: "製造装置", companyType: "事業会社", companySlug: "tokyo-electron", sourceUrl: "https://www.tel.co.jp/ir/library/fs/index.html" },
  { rank: 4, name: "キオクシアホールディングス", ticker: "285A", annualSalaryManYen: 1307, employees: 140, averageAge: 46.2, fiscalPeriod: "2026年3月期", category: "メモリ", companyType: "持株会社", companySlug: "kioxia", sourceUrl: "https://www.kioxia-holdings.com/ja-jp/ir/library.html", note: "持株会社140人の平均。最大人員会社のキオクシア株式会社は942万円。" },
  { rank: 5, name: "アドバンテスト", ticker: "6857", annualSalaryManYen: 1098, employees: 2033, averageAge: 45.7, fiscalPeriod: "2026年3月期", category: "検査・計測装置", companyType: "事業会社", companySlug: "advantest", sourceUrl: "https://www.advantest.com/ja/investors/ir-library/report/" },
  { rank: 6, name: "SCREENホールディングス", ticker: "7735", annualSalaryManYen: 1080, employees: 653, averageAge: 42.0, fiscalPeriod: "2026年3月期", category: "製造装置", companyType: "持株会社", companySlug: "screen", sourceUrl: "https://www.screen.co.jp/ir/library", note: "持株会社の提出会社単体の平均。事業会社の給与水準とは一致しない。" },
  { rank: 7, name: "東京エレクトロン デバイス", ticker: "2760", annualSalaryManYen: 1075, employees: 1182, averageAge: 46.2, fiscalPeriod: "2026年3月期", category: "半導体商社・設計", companyType: "事業会社", sourceUrl: "https://www.teldevice.co.jp/ir/yuuka.html" },
  { rank: 8, name: "ローツェ", ticker: "6323", annualSalaryManYen: 1039, employees: 259, averageAge: 42.6, fiscalPeriod: "2026年2月期", category: "搬送装置", companyType: "事業会社", sourceUrl: "https://www.rorze.com/ir/library/" },
  { rank: 9, name: "オルガノ", ticker: "6368", annualSalaryManYen: 1036, employees: 1283, averageAge: 43.7, fiscalPeriod: "2026年3月期", category: "超純水・設備", companyType: "事業会社", sourceUrl: "https://www.organo.co.jp/ir/library/" },
  { rank: 10, name: "荏原製作所", ticker: "6361", annualSalaryManYen: 980, employees: 5489, averageAge: 43.1, fiscalPeriod: "2025年12月期", category: "製造装置・精密", companyType: "事業会社", sourceUrl: "https://ebara.com/jp-ja/ir/library/financial-highlights/" },
  { rank: 11, name: "KOKUSAI ELECTRIC", ticker: "6525", annualSalaryManYen: 960, employees: 1193, averageAge: 44.1, fiscalPeriod: "2026年3月期", category: "製造装置", companyType: "事業会社", sourceUrl: "https://www.kokusai-electric.com/ir/library" },
  { rank: 12, name: "ソシオネクスト", ticker: "6526", annualSalaryManYen: 959, employees: 2111, averageAge: 50.6, fiscalPeriod: "2026年3月期", category: "ファブレス", companyType: "事業会社", companySlug: "socionext", sourceUrl: "https://www.socionext.com/jp/ir/" },
  { rank: 13, name: "信越化学工業", ticker: "4063", annualSalaryManYen: 898, employees: 4059, averageAge: 40.8, fiscalPeriod: "2026年3月期", category: "半導体材料", companyType: "事業会社", sourceUrl: "https://www.shinetsu.co.jp/jp/ir/ir-data/ir-securities/" },
  { rank: 14, name: "フジミインコーポレーテッド", ticker: "5384", annualSalaryManYen: 892, employees: 911, averageAge: 41.9, fiscalPeriod: "2026年3月期", category: "半導体材料", companyType: "事業会社", sourceUrl: "https://www.fujimiinc.co.jp/ir/library/" },
  { rank: 15, name: "TOPPANホールディングス", ticker: "7911", annualSalaryManYen: 868, employees: 1430, averageAge: 42.8, fiscalPeriod: "2026年3月期", category: "フォトマスク等", companyType: "持株会社", sourceUrl: "https://www.holdings.toppan.com/ja/ir/library/securities.html", note: "持株会社の平均。開示されたTOPPAN株式会社の平均は780万円。" },
  { rank: 16, name: "JX金属", ticker: "5016", annualSalaryManYen: 830, employees: 3250, averageAge: 41.5, fiscalPeriod: "2026年3月期", category: "半導体材料", companyType: "事業会社", sourceUrl: "https://www.jx-nmm.com/ir/securities.html" },
  { rank: 17, name: "堀場製作所", ticker: "6856", annualSalaryManYen: 820, employees: 1573, averageAge: 42.8, fiscalPeriod: "2025年12月期", category: "計測装置", companyType: "事業会社", sourceUrl: "https://www.horiba.com/jpn/company/investor-relations/ir-library/" },
  { rank: 18, name: "ニコン", ticker: "7731", annualSalaryManYen: 798, employees: 4656, averageAge: 41.9, fiscalPeriod: "2026年3月期", category: "露光装置・光学", companyType: "事業会社", companySlug: "nikon", sourceUrl: "https://www.jp.nikon.com/company/ir/ir_library/sr/" },
  { rank: 19, name: "ルネサス エレクトロニクス", ticker: "6723", annualSalaryManYen: 750, employees: 6025, averageAge: 48.5, fiscalPeriod: "2025年12月期", category: "IDM", companyType: "事業会社", companySlug: "renesas", sourceUrl: "https://www.renesas.com/ja/document/rep/annual-securities-report-2025" },
  { rank: 20, name: "TOWA", ticker: "6315", annualSalaryManYen: 739, employees: 716, averageAge: 39.2, fiscalPeriod: "2026年3月期", category: "後工程装置", companyType: "事業会社", sourceUrl: "https://www.towajapan.co.jp/jp/ir/library/" },
];
