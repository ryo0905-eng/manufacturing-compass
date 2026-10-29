export const rankingPurposeContext = {
  source_page: "/guides/semiconductor-market-cap-ranking",
  cta_location: "ranking_after_world",
  ui_version: "purpose-v3",
} as const;

export const rankingPurposes = [
  {
    id: "investment", label: "株価・業績を見る", description: "時価総額と決算を見比べ、企業を深く知る",
    image: "/images/guides/ranking-investment-v2.webp", tone: "blue",
    links: [
      { id: "stock_market", label: "半導体株式市場ウォッチを見る", href: "/semiconductor-watch/stocks" },
      { id: "earnings", label: "決算・IRを調べる", href: "/semiconductor-watch/earnings" },
      { id: "earnings_compare", label: "企業の業績を比較する", href: "/semiconductor-watch/earnings/compare" },
    ],
  },
  {
    id: "career", label: "仕事・転職を考える", description: "仕事内容と、自分の経験との接点を探す",
    image: "/images/guides/ranking-career-v2.webp", tone: "green",
    links: [
      { id: "role_map", label: "半導体の職種と仕事内容を調べる", href: "/roles" },
      { id: "career_compass", label: "Career Compassで経験と次の準備を整理する", href: "/career-compass" },
      { id: "career_agents", label: "転職エージェントの相談先を比較する", href: "/career-agents" },
    ],
  },
  {
    id: "learning", label: "技術を学ぶ", description: "半導体工程やデータ分析を、動かして理解する",
    image: "/images/guides/ranking-learning-v2.webp", tone: "violet",
    links: [
      { id: "process_guides", label: "半導体工程の記事シリーズを読む", href: "/guides/semiconductor-manufacturing-process" },
      { id: "process_experience", label: "半導体の工程を体験する", href: "/tools/semiconductor-process" },
      { id: "tools", label: "品質・改善・データ分析の実務ツールを見る", href: "/tools" },
    ],
  },
  {
    id: "research", label: "企業・業界を知る", description: "企業の役割や競合、業界のつながりを整理する",
    image: "/images/guides/ranking-research-v2.webp", tone: "amber",
    links: [
      { id: "industry_map", label: "企業の事業・役割を業界地図で調べる", href: "/industry-map#company-search" },
      { id: "company_compare", label: "気になる企業を比較する", href: "/compare" },
      { id: "industry_books", label: "業界地図2冊の特徴と購入先を見る（広告）", href: "#industry-map-books" },
      { id: "location_map", label: "日本の勤務地・拠点を調べる", href: "/semiconductor-map" },
    ],
  },
] as const;

export type ReaderPurpose = typeof rankingPurposes[number]["id"];
export type RankingPurposeDestination = typeof rankingPurposes[number]["links"][number]["id"];
