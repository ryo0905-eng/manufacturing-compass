import type { ToolId } from "@/data/learning-tools";

export const homeToolIds = ["process-comparison", "cpk", "yield-dashboard"] as const satisfies readonly ToolId[];
export const homeGuideSlugs = [
  "semiconductor-manufacturing-process",
  "semiconductor-equipment-manufacturers",
  "semiconductor-career-start",
] as const;

export const homeResearchLinks = [
  { id: "semiconductor_watch", href: "/semiconductor-watch", title: "Chip Pulse｜半導体業界ウォッチ", body: "企業・地域・テーマを横断し、昨日からの変化を3分でつかむ" },
  { id: "industry_map", href: "/industry-map", title: "業界地図を見る", body: "工程と企業の役割を俯瞰する" },
  { id: "companies", href: "/companies", title: "企業を探す", body: "事業領域や職種から調べる" },
  { id: "compare", href: "/compare", title: "企業を比較する", body: "同じ比較軸で違いを確認する" },
  { id: "industry_guides", href: "/guides/industry", title: "企業・業界の記事を読む", body: "工程・装置・材料から理解を深める" },
] as const;

export type HomeSection = "hero" | "tools" | "research" | "career" | "recommended" | "latest" | "about";
export type HomePurpose = "technology" | "industry" | "career" | "articles" | "about";
