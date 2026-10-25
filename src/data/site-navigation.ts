import type { Route } from "next";

type SiteLink = { href: Route; label: string; description: string; keywords: readonly string[] };

export const siteLinks = {
  process_series: { href: "/guides#process-series-title", label: "工程の記事シリーズ", description: "半導体ができるまでを、全体像から工程順に読みます。", keywords: ["製造工程", "前工程", "後工程"] },
  semiconductor_process: { href: "/tools/semiconductor-process", label: "工程の体験", description: "ウエハから製品までの加工の変化を、動く図で確かめます。", keywords: ["工程図鑑", "半導体ができるまで"] },
  tools: { href: "/tools", label: "実務ツール", description: "品質管理・統計・工程改善のツールを、今の用事から選びます。", keywords: ["計算", "学習", "品質", "統計"] },
  rankings: { href: "/#home-rankings", label: "ランキング", description: "時価総額、装置売上、メモリ、平均年収などの比較へ進みます。", keywords: ["順位", "企業規模", "年収"] },
  industry_map: { href: "/industry-map", label: "業界地図・企業一覧", description: "半導体企業の役割と、製品・職種とのつながりを調べます。", keywords: ["メーカー", "企業研究", "業界構造"] },
  compare: { href: "/compare", label: "企業比較", description: "気になる2社の事業とキャリア準備を同じ軸で比べます。", keywords: ["企業研究", "違い"] },
  semiconductor_watch: { href: "/semiconductor-watch", label: "業界ウォッチ", description: "公式情報のスナップショットから、決算や業界の動きを確認します。", keywords: ["Chip Pulse", "決算", "IR", "ニュース"] },
  industry_guides: { href: "/guides/industry", label: "企業・装置・材料の記事", description: "半導体メーカーの記事を、役割や工程から探します。", keywords: ["企業研究", "装置メーカー", "材料メーカー"] },
  semiconductor_map: { href: "/semiconductor-map", label: "国内拠点マップ", description: "国内の工場・研究開発・設計などの拠点を、場所と役割から探します。", keywords: ["勤務地", "都道府県", "工場", "研究所"] },
  factory_projects: { href: "/guides/japan-semiconductor-factory-projects", label: "新設・増設一覧", description: "半導体工場の主要案件を、場所・段階・予定から確認します。", keywords: ["工場建設", "設備投資", "計画"] },
  roles: { href: "/roles", label: "職種マップ", description: "担当した仕事内容から、接点のある半導体職種名と求人検索語を整理します。", keywords: ["職能", "仕事内容", "求人", "仕事"] },
  career_compass: { href: "/career-compass", label: "Career Compass", description: "今の経験と半導体職種の接点を見つけ、次の準備を整理します。", keywords: ["キャリア", "転職", "経験", "準備"] },
  career_priorities: { href: "/career-priorities", label: "転職の軸ノート", description: "仕事や働き方の優先順位と、求人票・面談で確認したいことを整理します。", keywords: ["キャリア", "希望条件", "働き方"] },
  career_consultation: { href: "/career-consultation", label: "相談準備", description: "求人票の確認ポイントと、転職相談で伝える論点を整理します。", keywords: ["求人", "相談メモ", "エージェント"] },
  career_guides: { href: "/guides#guide-category-career", label: "転職準備・実体験の記事", description: "製造業から半導体への転職で迷ったことと、準備の経験を読みます。", keywords: ["キャリア", "体験談"] },
  guides: { href: "/guides", label: "記事一覧", description: "技術・企業研究・製造業DX・キャリアの記事を探します。", keywords: ["読みもの", "解説"] },
  search: { href: "/#home-search", label: "検索", description: "記事・企業・ツールをキーワードから探します。", keywords: [] },
} as const satisfies Record<string, SiteLink>;

export type SiteLinkId = keyof typeof siteLinks;

export const siteNavigationGroups = [
  { id: "technology", label: "技術を学ぶ", menuLabel: "技術を学ぶ", purpose: "technology", linkIds: ["process_series", "semiconductor_process", "tools"], journeyIds: ["process_series", "semiconductor_process", "tools"] },
  { id: "industry", label: "企業・業界を調べる", menuLabel: "企業・業界", purpose: "industry", linkIds: ["rankings", "industry_map", "compare", "semiconductor_watch", "industry_guides"], journeyIds: ["rankings", "industry_map", "compare"] },
  { id: "factories", label: "工場・拠点を探す", menuLabel: "工場・拠点", purpose: "industry", linkIds: ["semiconductor_map", "factory_projects"], journeyIds: ["semiconductor_map", "factory_projects"] },
  { id: "career", label: "仕事・キャリアを考える", menuLabel: "仕事・キャリア", purpose: "career", linkIds: ["roles", "career_priorities", "career_consultation", "career_guides"], journeyIds: ["roles", "career_compass", "career_priorities"] },
] as const satisfies readonly {
  id: string;
  label: string;
  menuLabel: string;
  purpose: "technology" | "industry" | "career";
  linkIds: readonly SiteLinkId[];
  journeyIds: readonly SiteLinkId[];
}[];

export const headerDirectLinkIds = ["search", "guides"] as const;

/** Hash destinations describe a section, not the whole page's current location. */
export function currentNavigationPage(pathname: string, href: string): "page" | "location" | undefined {
  if (href.includes("#")) return undefined;
  if (pathname === href) return "page";
  if (pathname.startsWith(`${href}/`) || (href === "/industry-map" && pathname.startsWith("/segments/"))) return "location";
  return undefined;
}
