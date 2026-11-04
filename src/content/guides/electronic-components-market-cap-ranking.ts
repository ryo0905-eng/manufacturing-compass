import type { GuideArticle } from "@/content/guides/types";
import { electronicComponentsMarketCapMeta as meta, japanElectronicComponentsMarketCapRanking as japan, worldElectronicComponentsMarketCapRanking as world } from "@/data/electronic-components-market-cap";

export const electronicComponentsMarketCapRankingHero = {
  titleParts: ["電子部品メーカー", "世界ランキング"],
  metric: "時価総額",
  scopes: [`TOP${world.length}`, `日本${japan.length}社`],
  conclusion: `世界1位は${world[0].name}、日本1位は${japan[0].name}。`,
} as const;

const officialSources = [
  ["Amphenol", "https://amphenol.com/"],
  ["TE Connectivity", "https://www.te.com/en/products/brands/amp/amp-connectors.html"],
  ["Delta Electronics", "https://www.deltaww.com/en-US/products/Industrial"],
  ["村田製作所", "https://go.murata.com/passives.html"],
  ["Samsung Electro-Mechanics", "https://product.samsungsem.com/product-catalog.do"],
  ["TDK", "https://product.tdk.com/en/products/index.html"],
  ["京セラ", "https://global.kyocera.com/prdct/"],
  ["Yageo", "https://yageogroup.com/browse/products"],
  ["太陽誘電", "https://www.yuden.co.jp/en/"],
  ["Luxshare Precision", "https://disc.static.szse.cn/download/disc/disk03/finalpage/2026-06-17/005c3849-d13f-46f8-a7a5-76560391428b.PDF"],
  ["Littelfuse", "https://www.littelfuse.com/products"],
  ["Vishay", "https://ir.vishay.com/static-files/3196bb59-a761-4c35-8018-14b60900810a"],
  ["ヒロセ電機", "https://www.hirose.com/product/en/pr/product/"],
  ["日本航空電子工業", "https://www.jae.com/en/corporate/profile/business/"],
  ["アルプスアルパイン", "https://tech.alpsalpine.com/assets/catalog/product-catalog-all.en.pdf"],
  ["ミネベアミツミ", "https://product.minebeamitsumi.com/en/"],
  ["Coherent", "https://www.coherent.com/networking/communication-components"],
  ["日本ケミコン", "https://www.chemi-con.co.jp/products/aluminum/serieslist/"],
  ["ニチコン", "https://www.nichicon.co.jp/english/products/"],
  ["MARUWA", "https://www.maruwa-g.com/products/about/"],
] as const;

export const electronicComponentsMarketCapRankingGuide: GuideArticle = {
  slug: "electronic-components-market-cap-ranking",
  title: `電子部品メーカー世界ランキング【2026年11月】時価総額TOP${world.length}・日本${japan.length}社`,
  description: `2026年10月31日基準の電子部品メーカー世界${world.length}社と日本${japan.length}社を時価総額で比較。受動部品やコネクタなどの分類とランキングの読み方を解説します。`,
  targetQuery: "電子部品メーカー 時価総額ランキング",
  searchIntent: "電子部品メーカーの時価総額と事業の違いを比較し、企業研究に役立てたい",
  status: "published", category: "industry", presentation: "structured", author: "RYO", reviewedBy: "RYO",
  basisLabel: "この記事の調査範囲",
  experienceBasis: [
    "受動部品、コネクタ、センサ、電源関連部品などを主力事業の一つとする上場企業を候補から選定。網羅的な一覧ではありません。Walsin Technologyは基準日の値を確認できず、Samsung Electro-Mechanicsは取得元に表示された銘柄が候補の普通株と異なるため除外しました。",
    "CompaniesMarketCapの各社ページのグラフで2026年10月31日の値を2026年11月4日に確認。値を取得できなかった候補は除外しました。",
    "事業分類は各社の公式製品情報・企業情報をもとに、主な事業を簡略化しています。",
  ],
  publishedAt: "2026-11-04", updatedAt: "2026-11-04",
  sources: [
    { title: "I-PEXの上場廃止", url: "https://www.jpx.co.jp/news/1023/20250214-11.html", publisher: "日本取引所グループ", accessedAt: meta.retrievedAt },
    ...world.map((company) => ({ title: `${company.englishName} Market capitalization`, url: company.sourceUrl, publisher: "CompaniesMarketCap", accessedAt: meta.retrievedAt })),
    ...officialSources.map(([publisher, url]) => ({ title: `${publisher}の製品・事業情報`, url, publisher, accessedAt: meta.retrievedAt })),
  ],
  readTime: "約6分",
  intro: { problem: "電子部品メーカーの規模と事業の違いを知りたい", conclusion: electronicComponentsMarketCapRankingHero.conclusion, learnings: "世界・日本の時価総額と企業研究の視点" },
  sections: [
    { id: "world-ranking", heading: `電子部品メーカー世界時価総額ランキング TOP${world.length}`, paragraphs: [], blocks: [{ type: "electronic-components-market-cap-ranking", scope: "world" }] },
    { id: "japan-ranking", heading: `日本の電子部品メーカー時価総額ランキング ${japan.length}社`, paragraphs: ["日本ランキングは同じ候補から日本企業を抽出し、国内順位を付けています。I-PEXは2025年3月に上場廃止となったため対象外です。"], blocks: [{ type: "electronic-components-market-cap-ranking", scope: "japan" }] },
    { id: "business-models", heading: "電子部品メーカーの分類", paragraphs: ["複数事業を持つ企業も多く、分類は企業研究の入口として主な製品を簡略化したものです。"], blocks: [{ type: "mapping", leftLabel: "分類", rightLabel: "役割と企業例", rows: [
      { left: "受動部品", right: "コンデンサや抵抗器など、電気を蓄える・流れを調整する部品。村田製作所、TDK、Yageoなど" },
      { left: "コネクタ", right: "電気や光の信号を機器や基板の間でつなぐ部品。Amphenol、TE Connectivity、ヒロセ電機など" },
      { left: "電源", right: "電圧の変換や電力の供給・管理に使う製品。Delta Electronicsなど" },
      { left: "センサ・光部品・部品総合", right: "物理量を検知する部品、光通信用部品、セラミック基板など。事業範囲は企業ごとに異なります。" },
    ] }] },
    { id: "what-is-market-cap", heading: "時価総額とは｜売上高・利益との違い", paragraphs: ["時価総額は株価に発行済株式数を掛けた企業全体の市場評価の目安です。電子部品以外の事業も含まれ、部品別の売上シェアを表すものではありません。"], blocks: [{ type: "mapping", leftLabel: "指標", rightLabel: "比較するときの視点", rows: [
      { left: "時価総額", right: "企業全体の株式市場での評価。株価や為替で変動します。" },
      { left: "売上高", right: "一定期間の販売規模。企業全体と部門別では対象が異なります。" },
      { left: "利益", right: "売上から費用を差し引いた成果。集計期間や利益の種類を確認します。" },
    ] }] },
    { id: "findings", heading: "ランキングから分かる特徴", paragraphs: [
      `掲載${world.length}社のうち日本企業は${japan.length}社です。日本企業の最上位は世界${world.find((company) => company.id === japan[0].id)?.rank}位の${japan[0].name}です。`,
      `世界1位の${world[0].name}は${world[0].marketCapDisplay}、2位の${world[1].name}は${world[1].marketCapDisplay}です。企業全体を比較したもので、個別部品のシェアは示していません。`,
      "上位にはコネクタ、電源、受動部品など異なる事業の企業が並びます。時価総額に加えて各社の事業構成を確認しましょう。",
    ] },
    { id: "research-flow", heading: "気になった企業から、次に調べる", paragraphs: ["製品、取引先の業界、製造拠点、公式採用情報を見て、自分の経験と仕事内容の接点を整理しましょう。Career Compassは半導体職種を対象とした入口です。"], blocks: [{ type: "career-compass-entry", placement: "electronicComponentsRanking" }, { type: "links", items: [{ label: "半導体メーカーの時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "半導体関連企業の時価総額と事業分類を見る" }] }] },
    { id: "faq", heading: "よくある質問", paragraphs: [], blocks: [{ type: "faq", items: [
      { question: "世界最大の電子部品メーカーはどこですか？", answer: `今回選定した企業の2026年10月31日基準の時価総額では${world[0].name}が1位です。候補は世界の全企業を網羅していません。` },
      { question: "日本の主な電子部品メーカーはどこですか？", answer: `今回の日本ランキングには${japan[0].name}、TDK、京セラなど${japan.length}社を掲載しています。` },
      { question: "MLCCの主なメーカーはどこですか？", answer: "積層セラミックコンデンサ（MLCC）のメーカーには村田製作所、Samsung Electro-Mechanics、太陽誘電、Yageoなどがあります。掲載順はMLCC売上シェアの順位ではありません。" },
      { question: "時価総額と売上高シェアは何が違いますか？", answer: "時価総額は企業全体への株式市場の評価額、売上高シェアは対象市場の一定期間の売上に占める割合です。" },
    ] }] },
  ],
  relatedGuideSlugs: [], relatedCompanyIds: [],
};
