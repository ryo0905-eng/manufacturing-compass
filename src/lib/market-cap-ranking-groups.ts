import type { SemiconductorMarketCapCompany } from "@/data/semiconductor-market-cap";

const groups: Record<string, string> = {
  "ファブレス": "ファブレス", "ファブレス・ソフトウェア": "ファブレス",
  "ファウンドリ": "ファウンドリ", "IDM": "IDM", "IDM（総合電機）": "IDM", "IDM・ファウンドリ": "IDM",
  "メモリ・IDM": "メモリ", "製造装置": "製造装置", "検査・計測装置": "検査・計測",
  "EDA・IP": "EDA・IP", "OSAT・後工程": "OSAT・後工程", "材料・ウェーハ": "材料",
  "材料・電子部品": "材料", "材料・フォトマスク": "材料", "半導体商社": "商社",
};

export function getMarketCapRankingGroup(company: SemiconductorMarketCapCompany): string {
  return groups[company.category] ?? company.category;
}
