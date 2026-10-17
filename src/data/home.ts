import type { ToolId } from "@/data/learning-tools";

export const homeToolIds = ["process-comparison", "cpk", "yield-dashboard"] as const satisfies readonly ToolId[];
export const homeGuideSlugs = [
  "semiconductor-manufacturing-process",
  "semiconductor-equipment-manufacturers",
  "semiconductor-career-start",
] as const;

export const homeRankingLinks = [
  { id: "market_cap", href: "/guides/semiconductor-market-cap-ranking", title: "時価総額", body: "世界・日本の順位を確認し、2社を比較する" },
  { id: "equipment_sales", href: "/guides/semiconductor-equipment-sales-ranking", title: "装置売上", body: "工程を選んで、関連するメーカーを比較する" },
  { id: "memory", href: "/guides/memory-manufacturer-ranking", title: "メモリ", body: "DRAM・NANDを切り替えて、売上シェアを比較する" },
  { id: "salary", href: "/guides/semiconductor-salary-ranking", title: "平均年収", body: "企業が公表した平均年収と集計条件を確認する" },
] as const;

export const homeResearchLinks = [
  { id: "semiconductor_watch", href: "/semiconductor-watch", title: "Chip Pulse｜半導体業界ウォッチ", body: "企業・地域・テーマを横断し、昨日からの変化を3分でつかむ" },
  { id: "industry_map", href: "/industry-map", title: "業界地図・企業一覧", body: "業界のつながりを理解し、製品・職種から企業を探す" },
  { id: "compare", href: "/compare", title: "企業を比較する", body: "同じ比較軸で違いを確認する" },
  { id: "industry_guides", href: "/guides/industry", title: "企業・業界の記事を読む", body: "工程・装置・材料から理解を深める" },
] as const;

export type HomeSection = "hero" | "rankings" | "tools" | "research" | "career" | "recommended" | "latest" | "about";
export type HomePurpose = "technology" | "industry" | "career" | "articles" | "about";
