export const rankingPurposeContext = {
  source_page: "/guides/semiconductor-market-cap-ranking",
  cta_location: "ranking_after_world",
  ui_version: "purpose-v1",
} as const;

export const rankingPurposes = [
  {
    id: "research", label: "企業・業界を詳しく知る", description: "企業の役割や、業界全体のつながりを調べる",
    links: [
      { id: "industry_map", label: "企業の事業・役割を業界地図で調べる", href: "/industry-map#company-search" },
      { id: "company_compare", label: "気になる企業を比較する", href: "/compare" },
      { id: "industry_books", label: "業界地図2冊の特徴と購入先を見る（広告）", href: "#industry-map-books" },
      { id: "location_map", label: "日本の勤務地・拠点を調べる", href: "/semiconductor-map" },
    ],
  },
  {
    id: "investment", label: "株価・業績を調べる", description: "市場の動きと決算を、企業研究の材料にする",
    links: [
      { id: "stock_market", label: "半導体株式市場ウォッチを見る", href: "/semiconductor-watch/stocks" },
      { id: "earnings", label: "決算・IRを調べる", href: "/semiconductor-watch/earnings" },
      { id: "earnings_compare", label: "企業の業績を比較する", href: "/semiconductor-watch/earnings/compare" },
    ],
  },
  {
    id: "career", label: "半導体の仕事・転職を考える", description: "相談したい内容に合うサービスや、次の準備を探す",
    links: [
      { id: "career_agents", label: "運営者の利用経験から相談先を比較する", href: "/career-agents" },
      { id: "career_compass", label: "Career Compassで経験と次の準備を整理する", href: "/career-compass" },
      { id: "role_map", label: "半導体の職種と仕事内容を調べる", href: "/roles" },
    ],
  },
  {
    id: "learning", label: "技術・データ分析を学ぶ", description: "工程の解説や、動かして学べる実務ツールへ進む",
    links: [
      { id: "process_guides", label: "半導体工程の記事シリーズを読む", href: "/guides/semiconductor-manufacturing-process" },
      { id: "process_experience", label: "半導体の工程を体験する", href: "/tools/semiconductor-process" },
      { id: "tools", label: "品質・改善・データ分析の実務ツールを見る", href: "/tools" },
    ],
  },
] as const;

export type ReaderPurpose = typeof rankingPurposes[number]["id"];
export type RankingPurposeDestination = typeof rankingPurposes[number]["links"][number]["id"];
