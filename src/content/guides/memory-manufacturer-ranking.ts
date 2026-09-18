import type { GuideArticle } from "@/content/guides/types";
import { memoryMarketIds, memoryMarkets, memoryRankingMeta } from "@/data/memory-market-share";

export const memoryManufacturerRankingGuide: GuideArticle = {
  slug: "memory-manufacturer-ranking",
  title: "メモリメーカーランキング【2026年4〜6月】DRAM・NANDの売上シェアを比較",
  description: "DRAMの掲載7社とNANDの上場主要5社を、2026年4〜6月の売上高・市場シェアで比較。切り替えグラフで企業の違いを確認し、用途・集計範囲・公式出典からランキングを読み解きます。",
  targetQuery: "メモリ メーカー ランキング",
  searchIntent: "DRAMとNANDの主要メーカーと売上シェアを比較し、メモリの用途や企業ごとの市場での位置づけを理解したい",
  status: "published",
  category: "industry",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  showIntroSummary: false,
  showExperienceBasis: false,
  showCareerCtas: false,
  experienceBasis: [
    "TrendForceが公開した2026年4〜6月のDRAM・NANDランキングを原表で照合",
    "NANDの対象が上場主要5社であることを明記し、未掲載企業の順位やシェアは推測しない",
  ],
  publishedAt: "2026-09-18",
  updatedAt: "2026-09-18",
  sources: [
    ...memoryMarketIds.map((id) => ({ title: memoryMarkets[id].source.title, url: memoryMarkets[id].source.url, publisher: "TrendForce", accessedAt: memoryRankingMeta.checkedAt })),
    { title: "What is an SSD?", url: "https://www.micron.com/about/micron-glossary/solid-state-drives", publisher: "Micron", accessedAt: "2026-09-18" },
    { title: "NAND型フラッシュメモリとは", url: "https://www.kioxia.com/ja-jp/rd/technology/nand-flash.html", publisher: "キオクシア", accessedAt: "2026-09-18" },
  ],
  readTime: "5分",
  intro: {
    problem: "メモリメーカーの順位は、DRAMとNANDのどちらを見るかで変わります。",
    conclusion: "同じ四半期の売上シェアを、製品市場ごとに分けて確認します。",
    learnings: "主要企業の売上シェア、DRAMとNANDの用途、比較対象の違いが分かります。",
  },
  sections: [
    {
      id: "ranking",
      heading: "DRAMとNANDのランキングを切り替えて見る",
      paragraphs: [],
      blocks: [{ type: "memory-market-ranking" }],
    },
    {
      id: "uses",
      heading: "DRAMは処理中のデータ、NANDは保存するデータを支える",
      paragraphs: [
        "DRAMは、コンピューターなどが処理中のデータを一時的に置くために使うメモリです。電源を切るとデータは失われます。一方、NAND型フラッシュメモリは電源を切ってもデータを保持し、SSDなどの保存装置で使われます。",
        "同じメモリでも役割が異なるため、企業の顔ぶれやシェアは市場ごとに見る必要があります。SSDという完成品のメーカーランキングと、NANDの売上ランキングも同じものではありません。",
      ],
    },
    {
      id: "method",
      heading: "ランキングを比較するときに揃える条件",
      paragraphs: [
        "対象期間は2026年4〜6月です。2026年通年の確定値ではなく、企業全体の連結売上や時価総額とも異なります。数値はTrendForceの公開図表を採用し、独自の円換算や年率換算は行っていません。",
        "グラフは売上高ベースの市場シェアです。生産個数や出荷容量、製品性能の順位ではありません。DRAMとNANDは別々の市場なので、両方のシェアを足してメモリ全体のシェアとすることもできません。",
        "DRAMは調査元のブランドメーカー7社とその他を示します。NANDは上場主要5社に対象が限られるため、未掲載企業をシェア0%や6位以下と解釈しないでください。両表の掲載対象は同じではありません。",
        "DRAMの原表では、その他を含む各行の売上合計とTotal欄に2百万米ドルの差があります。原因は確認できていないため、本記事は各行の掲載値を維持し、売上合計からシェアを再計算していません。シェアの丸め差も補正していません。",
      ],
    },
    {
      id: "company-research",
      heading: "気になる企業を、製品と仕事から調べる",
      paragraphs: [
        "例えばMicronとキオクシアを調べる場合、まずどのメモリ市場の話かを確認すると、企業情報を読み分けやすくなります。売上順位は業界を把握する入口として使い、仕事内容や募集条件は個別に確認してください。",
      ],
      blocks: [{ type: "links", items: [
        { label: "Micronの企業情報", href: "/companies/micron", description: "製品・事業とキャリア準備の情報を確認する" },
        { label: "キオクシアの企業情報", href: "/companies/kioxia", description: "フラッシュメモリ事業とキャリア準備の情報を確認する" },
        { label: "半導体業界地図", href: "/industry-map", description: "メモリ・装置・材料の企業の関係を見る" },
        { label: "半導体メーカーの時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "株式市場の評価額という別の指標で企業を見る" },
      ] }],
    },
  ],
  relatedGuideSlugs: ["optical-semiconductor-manufacturers", "semiconductor-market-cap-ranking", "semiconductor-equipment-sales-ranking"],
  relatedCompanyIds: ["micron", "kioxia", "samsung-electronics", "sk-hynix"],
};
