import { companies } from "@/data/companies";
import type { Company } from "@/types/content";

export type BeginnerGuide = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  todayQuest: string;
};

export type Ranking = {
  slug: string;
  title: string;
  description: string;
  companyIds: string[];
  criteria: string[];
};

export const beginnerGuides: BeginnerGuide[] = [
  {
    slug: "semiconductor-career-start",
    title: "半導体業界への転職は何から始める？",
    description: "製造業経験を半導体キャリアへつなげるための最初の整理です。",
    readTime: "5 min",
    sections: [
      { heading: "まず見る軸", body: "最初は会社名より、ファブレス、ファウンドリ、メモリ、IDM、製造装置のどこに近いかを見ます。" },
      { heading: "経験の翻訳", body: "品質、設備、生産技術、設計、技術営業の経験は、半導体向けの言葉に置き換えると伝わりやすくなります。" },
      { heading: "最初の一歩", body: "求人を読む前に、自分の改善実績、扱った装置、顧客対応、英語接点を3つだけ書き出します。" },
    ],
    todayQuest: "担当した改善実績を、課題・行動・数字の3行で書く",
  },
  {
    slug: "equipment-engineer-route",
    title: "設備保全から半導体装置エンジニアを狙うルート",
    description: "設備トラブル対応や保全経験を、装置メーカー・半導体工場へ接続する考え方です。",
    readTime: "6 min",
    sections: [
      { heading: "近い職種", body: "フィールドサービス、装置エンジニア、設備技術、生産技術は、設備保全経験との距離が近い職種です。" },
      { heading: "見られやすい経験", body: "停止時間短縮、再発防止、立ち上げ、点検標準化、顧客先対応は強い材料になります。" },
      { heading: "伸ばすとよいこと", body: "英語マニュアル読解、真空・プラズマ・洗浄などの基礎、トラブルの切り分け説明を準備します。" },
    ],
    todayQuest: "担当装置の停止時間を短縮した事例を1つ選ぶ",
  },
  {
    slug: "quality-engineer-route",
    title: "品質保証・不良解析経験を半導体で活かす",
    description: "品質データ、工程監査、不良解析を半導体企業に伝えるための整理です。",
    readTime: "5 min",
    sections: [
      { heading: "近い職種", body: "品質保証、顧客品質、製品技術、プロセス改善は、品質経験を活かしやすい入口です。" },
      { heading: "数字で伝える", body: "不良率、流出件数、再発率、解析リードタイムなど、改善前後の数字があると伝わります。" },
      { heading: "次に足すスキル", body: "SPC、FMEA、DOE、データ可視化、英語での品質説明を少しずつ補うと選択肢が広がります。" },
    ],
    todayQuest: "不良解析の事例を、原因・対策・改善数字で整理する",
  },
];

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

export function getGuideBySlug(slug: string) {
  return beginnerGuides.find((guide) => guide.slug === slug);
}

export function getRankingBySlug(slug: string) {
  return rankings.find((ranking) => ranking.slug === slug);
}

export function getRankingCompanies(ranking: Ranking) {
  return ranking.companyIds
    .map((id) => companies.find((company) => company.id === id))
    .filter((company): company is Company => Boolean(company));
}
