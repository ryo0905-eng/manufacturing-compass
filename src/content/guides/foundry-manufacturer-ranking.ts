import type { GuideArticle } from "@/content/guides/types";
import { foundryMarket, foundryRankingMeta } from "@/data/foundry-market-share";

export const foundryManufacturerRankingGuide: GuideArticle = {
  slug: "foundry-manufacturer-ranking",
  title: "ファウンドリメーカーランキング【2026年4〜6月】世界の売上シェアを比較",
  description: "世界の大手ファウンドリ10社を、2026年4〜6月の売上高・市場シェアで比較。TSMC、Samsung、SMICなど受託製造企業の順位と、集計範囲・公式出典からランキングを読み解きます。",
  targetQuery: "ファウンドリ 半導体 ランキング",
  searchIntent: "世界のファウンドリ企業の売上シェアと比較条件を知りたい",
  status: "published", category: "industry", presentation: "structured", author: "RYO",
  showIntroSummary: false, showExperienceBasis: false, showCareerCtas: false,
  experienceBasis: [], publishedAt: "2026-10-31", updatedAt: "2026-10-31",
  sources: [{ title: foundryMarket.source.title, url: foundryMarket.source.url, publisher: "TrendForce", accessedAt: foundryRankingMeta.checkedAt }],
  readTime: "5分",
  intro: {
    problem: "ファウンドリの順位は、時価総額ではなく受託製造の売上シェアで見る必要があります。",
    conclusion: "同じ四半期の売上シェアを、世界の上位10社で確認します。",
    learnings: "主要ファウンドリの売上シェア、先端プロセスと成熟プロセスの構図、比較対象の違いが分かります。",
  },
  sections: [
    { id: "ranking", heading: "ファウンドリの売上ランキングを見る", paragraphs: [], blocks: [{ type: "foundry-market-ranking" }] },
    { id: "structure", heading: "ファウンドリ市場は先端プロセスと成熟プロセスで顔ぶれが変わる", paragraphs: [
      "ファウンドリは、他社が設計した半導体の製造を受託する事業です。スマートフォンやAIサーバー向けの先端プロセス（3nm、5nmなど）では量産できる企業が限られ、売上が一部の企業に集中します。一方、車載・産業向けの成熟プロセスでは、UMC、GlobalFoundries、中国のファウンドリなど、より多くの企業が供給を担います。",
      "そのため、売上シェアの順位は『どのプロセスの話か』とセットで読む必要があります。本ランキングは全プロセスを合計した売上高ベースの順位です。",
    ] },
    { id: "method", heading: "ランキングを比較するときに揃える条件", paragraphs: [
      "対象期間は2026年4〜6月です。数値はTrendForceの公開図表を採用し、独自の円換算や年率換算は行っていません。",
      "グラフは売上高ベースの市場シェアです。生産能力（ウェーハ枚数）や技術力そのものの順位ではありません。",
      "Samsungの数値はファウンドリ事業のみの売上です。メモリを含む半導体部門全体や、会社全体の連結売上とは異なります。HuaHong Groupの数値もグループ合算の集計範囲です。",
      "掲載は調査元の上位10社です。掲載されていない企業（Intel Foundryなど）をシェア0%や11位以下と解釈しないでください。",
    ] },
    { id: "faq", heading: "ファウンドリの順位・シェアを読むときの質問", paragraphs: [], blocks: [{ type: "faq", items: [
      { question: "ファウンドリの売上シェアはどこが出していますか？", answer: "TrendForceが四半期ごとに公表する、世界のファウンドリ上位10社の売上高ランキングを採用しています。本記事の数値は2026年4〜6月の実績です。" },
      { question: "TSMCのシェアが7割を超えているのはなぜですか？", answer: "先端プロセス（3nm、5nmなど）を量産できる企業が限られるなかで、AI・HPC向けの需要がTSMCに集中しています。調査元は、2026年4〜6月に3nm・5nm級の生産能力がフル稼働し、2nmの売上も始まったと分析しています。" },
      { question: "時価総額ランキングとは何が違いますか？", answer: "時価総額は株式市場での企業全体の評価額で、ファウンドリ以外の事業も含みます。本ランキングは受託製造事業の売上シェアなので、順位や顔ぶれが異なります。" },
    ] }] },
    { id: "company-research", heading: "気になる企業を、製品と仕事から調べる", paragraphs: [
      "売上順位は業界を把握する入口として使い、仕事内容や募集条件は個別に確認してください。例えばTSMCとSamsungを調べる場合、まず受託製造の売上規模と、自社製品を含む事業全体の規模を読み分けると、企業情報を整理しやすくなります。",
    ], blocks: [{ type: "links", items: [
      { label: "ファウンドリ各社の決算・IRを読む", href: "/semiconductor-watch/earnings#segment=foundry", description: "TSMCなど受託製造企業の業績と会社見通しを原資料で確認する" },
      { label: "TSMCの企業情報", href: "/companies/tsmc", description: "製品・事業とキャリア準備の情報を確認する" },
      { label: "Samsung Electronicsの企業情報", href: "/companies/samsung-electronics", description: "メモリ・ファウンドリを含む事業とキャリア準備の情報を確認する" },
      { label: "ファウンドリとは", href: "/guides/semiconductor-foundry", description: "ファブレス・IDM・OSATとの違いを図解で確認する" },
      { label: "半導体メーカーの時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "株式市場の評価額という別の指標で企業を見る" },
    ] }] },
  ],
  relatedGuideSlugs: ["semiconductor-foundry", "memory-manufacturer-ranking", "semiconductor-market-cap-ranking", "semiconductor-equipment-sales-ranking", "optical-semiconductor-manufacturers"],
  relatedCompanyIds: ["tsmc", "samsung-electronics", "globalfoundries"],
};
