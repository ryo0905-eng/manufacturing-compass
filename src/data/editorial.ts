import { companies } from "@/data/companies";
import type { Company } from "@/types/content";

export { beginnerGuides, getGuideBySlug } from "@/content/guides";
export type { GuideArticle as BeginnerGuide } from "@/content/guides";

export type Ranking = {
  slug: string;
  title: string;
  description: string;
  companyIds: string[];
  criteria: string[];
};

export const rankings: Ranking[] = [
  {
    slug: "equipment-career-entry",
    title: "設備・装置経験との接点を調べやすい半導体企業",
    description: "設備保全、装置立ち上げ、フィールド対応の経験から仕事内容を調べる候補企業を整理します。",
    companyIds: ["tokyo-electron", "screen", "advantest", "applied-materials", "lam-research", "asml", "kla", "teradyne", "disco", "lasertec", "hitachi-hightech"],
    criteria: ["装置・設備事業との接点", "日本拠点の有無", "公開採用情報で確認できるフィールド職種"],
  },
  {
    slug: "quality-career-entry",
    title: "品質保証・不良解析経験との接点を調べやすい半導体企業",
    description: "品質、解析、量産改善の経験から仕事内容を調べる候補企業を整理します。",
    companyIds: ["tsmc", "micron", "kioxia", "renesas", "rohm", "samsung-electronics", "onsemi", "infineon", "sumco", "hitachi-hightech"],
    criteria: ["品質・量産改善業務との接点", "製造または顧客品質業務の有無", "公開採用情報で確認できる関連職種"],
  },
  {
    slug: "english-global-career",
    title: "英語・海外連携との接点を調べやすい半導体企業",
    description: "英語や海外連携が関わる仕事内容を調べる候補企業を整理します。",
    companyIds: ["nvidia", "amd", "qualcomm", "marvell", "asml", "applied-materials", "lam-research", "micron", "infineon", "nxp"],
    criteria: ["英語資料・海外連携の接点", "FAE・営業技術との接点", "日本で確認できる職種・拠点"],
  },
];

export const comparePairs = [
  ["asml", "tokyo-electron"],
  ["tsmc", "micron"],
  ["tsmc", "tokyo-electron"],
  ["tokyo-electron", "screen"],
  ["tokyo-electron", "applied-materials"],
  ["applied-materials", "lam-research"],
  ["advantest", "teradyne"],
  ["renesas", "rohm"],
  ["infineon", "onsemi"],
  ["nvidia", "amd"],
  ["qualcomm", "qorvo"],
  ["analog-devices", "texas-instruments"],
  ["disco", "lasertec"],
  ["nikon", "canon"],
  ["micron", "kioxia"],
];

export function getRankingBySlug(slug: string) {
  return rankings.find((ranking) => ranking.slug === slug);
}

export function getRankingCompanies(ranking: Ranking) {
  return ranking.companyIds
    .map((id) => companies.find((company) => company.id === id))
    .filter((company): company is Company => Boolean(company));
}
