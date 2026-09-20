import type { GuideArticle } from "@/content/guides/types";
import { opticalCompanies, opticalMeta } from "@/data/optical-semiconductor";

export const opticalSemiconductorManufacturersGuide: GuideArticle = {
  slug: opticalMeta.sourceSlug,
  title: "光半導体メーカー比較｜LED・レーザー・イメージセンサーを用途から探す",
  description: "日亜化学、ams OSRAM、ソニー、浜松ホトニクス、ローム、onsemiの光半導体を用途で比較。LED・半導体レーザー・イメージセンサー・フォトダイオードの図解と切り替え一覧から、各社の公式製品情報を確認できます。",
  targetQuery: "光半導体 メーカー",
  searchIntent: "光半導体の主要メーカーと製品分野を知り、用途に合う企業を調べたい",
  status: "published",
  category: "industry",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  showIntroSummary: false,
  showExperienceBasis: false,
  showCareerCtas: false,
  experienceBasis: ["各社の公式製品情報をもとに、発光・受光の用途別に製品例を整理"],
  publishedAt: "2026-09-18",
  updatedAt: "2026-09-20",
  sources: opticalCompanies.flatMap(company => company.products.map(product => ({
    title: product.name, url: product.url, publisher: company.name, accessedAt: opticalMeta.checkedAt,
  }))),
  readTime: "5分",
  intro: {
    problem: "光半導体には、光を出す製品と光を受け取る製品があります。調べる用途によって、見るべきメーカーも変わります。",
    conclusion: "まずLED・半導体レーザー・イメージセンサー・フォトダイオードの役割を分け、各社の製品情報を確認します。",
    learnings: "6社の製品例、発光と受光の違い、ランキングを読むときの比較条件が分かります。",
  },
  sections: [
    { id: "companies", heading: "用途から光半導体メーカーを探す", lead: "用途を選ぶと、光と電気の関係を示す図と企業の製品例が切り替わります。", paragraphs: [], blocks: [{ type: "optical-companies" }] },
    { id: "devices", heading: "光半導体とは？光を出す素子と、受け取る素子", paragraphs: [
      "LEDや半導体レーザーは、電気を光に変える発光素子です。LEDを調べるなら照明や表示、半導体レーザーならセンシングなど、光源が使われる用途も一緒に見ると製品の違いをつかめます。",
      "フォトダイオードは光を電気信号に変える受光素子です。イメージセンサーも受光する製品ですが、画素ごとに信号を読み出して画像の取得に使います。本記事は探しやすさのために「光を検出する」「画像を撮る」を分けています。物理的に重なりのない分類ではありません。",
      "浜松ホトニクスの一覧には、半導体素子のほかに真空管を用いる製品もあります。本記事で紹介するのはCCD・CMOS・NMOSやInGaAsなどの半導体イメージセンサーとフォトダイオードです。光を扱う製品すべてを光半導体として掲載しているわけではありません。",
    ] },
    { id: "ranking", heading: "光半導体メーカーの世界ランキングを読む前に", paragraphs: [
      "ランキングを比べるときは、LEDの売上なのか、イメージセンサーの売上なのかを先に確認します。同じ光半導体でも比較する市場が違い、企業全体の連結売上には別分野の事業も含まれます。",
      "このページでは、6社を同じ期間・同じ製品範囲の光半導体売上で比較できる資料を揃えていないため、総合順位やシェアのグラフは掲載していません。用途ごとに公式製品情報を確認できた企業例を示しています。網羅的な企業一覧でもありません。",
      "数値のランキングを読む場合は、対象製品、対象期間、売上か出荷数量か、企業単体かグループかを揃えてください。各社の得意分野や製品の性能を、企業規模だけで判断することはできません。",
    ] },
    { id: "faq", heading: "光半導体メーカーを比較するときの質問", paragraphs: [], blocks: [{ type: "faq", items: [
      { question: "光半導体メーカーの世界1位はどこですか？", answer: "このページでは総合順位を付けていません。LED、半導体レーザー、イメージセンサーなどでは比較する市場が異なり、掲載6社を同じ期間・同じ製品範囲の売上で比較できる資料を揃えていないためです。用途ごとの企業例と公式製品情報を確認できます。" },
      { question: "LEDとイメージセンサーのメーカーは同じ表で比較できますか？", answer: "このページでは製品の有無や用途を確認できますが、性能や売上シェアの順位は比較していません。LEDは光を出す素子、イメージセンサーは光を受けて画像を取得する製品として、用途を分けて調べます。" },
      { question: "光通信やシリコンフォトニクスの企業もすべて載っていますか？", answer: "いいえ。対象はLED・半導体レーザー・イメージセンサー・フォトダイオードの4分類で、公式情報を確認した企業例です。光通信モジュールやシリコンフォトニクスの供給網全体を網羅する一覧ではありません。" },
    ] }] },
    { id: "research", heading: "企業名の次は、扱う製品と用途を調べる", paragraphs: [
      "例えば「光を扱う会社」という括りから一歩進めて、LEDを作るのか、レーザー光源を作るのか、受光素子を作るのかを確認します。公式製品ページで用途や製品仕様を読み、その製品に関わる設計・製造・評価などの仕事を調べると、企業研究の対象を絞りやすくなります。",
      "半導体製造で使う光学式の計測装置と、光半導体の素子は別の対象です。また、光通信モジュールやシリコンフォトニクスの供給網全体も、この4分類だけではカバーしていません。",
    ], blocks: [{ type: "links", items: [
      { label: "半導体業界地図", href: "/industry-map", description: "半導体メーカー・装置・材料の関係を見る" },
      { label: "光学式薄膜計測装置のメーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "光を使って半導体の薄膜を測る装置を調べる" },
      { label: "半導体メーカーの時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "企業全体の株式市場での評価額を見る" },
      { label: "メモリメーカーランキング", href: "/guides/memory-manufacturer-ranking", description: "DRAM・NANDの製品市場別に売上シェアを見る" },
    ] }] },
  ],
  relatedGuideSlugs: ["semiconductor-market-cap-ranking", "memory-manufacturer-ranking", "semiconductor-thin-film-optical-metrology-manufacturers"],
  relatedCompanyIds: ["rohm", "onsemi"],
};
