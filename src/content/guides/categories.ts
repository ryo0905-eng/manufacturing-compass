import type { GuideCategory } from "@/content/guides/types";

type GuideCategoryDetail = {
  label: string;
  description: string;
};

export const guideCategoryOrder: GuideCategory[] = [
  "dx-ai",
  "technology",
  "industry",
  "career",
];

export const guideCategoryDetails: Record<GuideCategory, GuideCategoryDetail> = {
  "dx-ai": {
    label: "製造業DX・AI",
    description: "AIコーディングや生成AIを、製造業の仕事と改善にどう生かすか。",
  },
  technology: {
    label: "半導体・製造技術",
    description: "半導体の工程、装置、材料と、品質・改善の考え方をやさしく整理します。",
  },
  industry: {
    label: "企業・業界研究",
    description: "企業、業界構造、ランキングを、公開情報と比較軸から読み解きます。",
  },
  career: {
    label: "キャリア・実体験",
    description: "製造業から半導体へ進むときの迷い、準備、転職経験をまとめています。",
  },
};
