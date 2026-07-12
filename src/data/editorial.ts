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
    title: "設備・装置経験から狙いやすい半導体企業",
    description: "設備保全、装置立ち上げ、フィールド対応の経験を活かしやすい企業を整理します。",
    companyIds: ["tokyo-electron", "screen", "advantest", "applied-materials", "lam-research", "asml", "kla", "teradyne", "disco", "lasertec", "hitachi-hightech"],
    criteria: ["装置・設備経験との近さ", "日本拠点の接点", "フィールド職種の見つけやすさ"],
  },
  {
    slug: "quality-career-entry",
    title: "品質保証・不良解析経験を活かしやすい半導体企業",
    description: "品質、解析、量産改善の経験を半導体キャリアに接続しやすい企業を整理します。",
    companyIds: ["tsmc", "micron", "kioxia", "renesas", "rohm", "samsung-electronics", "onsemi", "infineon", "sumco", "hitachi-hightech"],
    criteria: ["品質・量産改善との近さ", "製造または顧客品質の接点", "職務経歴書で説明しやすい経験"],
  },
  {
    slug: "english-global-career",
    title: "英語を伸ばすと選択肢が広がる半導体企業",
    description: "外資系、海外顧客、グローバル連携の観点で英語が効きやすい企業を整理します。",
    companyIds: ["nvidia", "amd", "qualcomm", "marvell", "asml", "applied-materials", "lam-research", "micron", "infineon", "nxp"],
    criteria: ["英語資料・海外連携の多さ", "FAE・営業技術との相性", "将来の年収アップ余地"],
  },
];

export const comparePairs = [
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
