import type { GuideArticle } from "@/content/guides/types";

const sourceUrl = "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/";

export const semiconductorMarketCapGrowthRankingGuide: GuideArticle = {
  slug: "semiconductor-market-cap-growth-ranking",
  title: "半導体企業の時価総額増加率ランキング｜1か月・3か月の増加率と増加額",
  description: "半導体関連企業の時価総額を、2026年10月16日と保存済みスナップショットで比較。比較できる1か月・3か月の増加率・増加額、対象社数、計算方法と注意点を解説します。",
  targetQuery: "半導体企業 時価総額 増加率 ランキング",
  searchIntent: "半導体企業の時価総額が一定期間にどれだけ増減したかを、株価変化との違いやデータ条件を踏まえて比較したい",
  status: "published",
  category: "industry",
  presentation: "structured",
  author: "Manufacturing Compass編集部",
  showIntroSummary: false,
  showExperienceBasis: false,
  showCareerCtas: false,
  experienceBasis: [],
  publishedAt: "2026-10-25",
  updatedAt: "2026-10-25",
  readTime: "約7分",
  sources: [
    { title: "半導体企業の時価総額ランキング", url: sourceUrl, publisher: "CompaniesMarketCap", accessedAt: "2026-10-17" },
    { title: "半導体企業の時価総額ランキング（2ページ目）", url: `${sourceUrl}?page=2`, publisher: "CompaniesMarketCap", accessedAt: "2026-10-17" },
    { title: "CompaniesMarketCap Terms of Service", url: "https://companiesmarketcap.com/terms-of-service/", publisher: "CompaniesMarketCap", accessedAt: "2026-10-25" },
  ],
  intro: {
    problem: "半導体企業の時価総額ランキングは、企業の大きさだけでなく、期間を区切った変化も気になります。",
    conclusion: "保存してある値で直接比較できるのは、2026年10月16日と9月6日、または7月13日の組み合わせです。目標日からの実際の日数と、比較できる社数を示して順位を計算します。",
    learnings: "時価総額の増加率・増加額、比較対象日、対象企業数、株価上昇率との違いとデータ上の限界を確認できます。",
  },
  overviewBlocks: [{
    type: "links",
    items: [
      { label: "ランキングを見る", href: "#growth-ranking", description: "期間・対象地域・企業分類・増加率／増加額を選ぶ" },
      { label: "計算方法と注意点", href: "#method", description: "比較日、欠損データ、為替や株式数の影響を確認する" },
      { label: "現在の時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "2026年10月16日基準の世界TOP30・日本18社" },
    ],
  }],
  sections: [
    {
      id: "growth-ranking",
      heading: "時価総額の増加率・増加額ランキング",
      paragraphs: [
        "基準日は2026年10月16日です。現行の世界TOP30・日本18社を対象に、保存済みの過去値と直接照合できた企業だけを表示します。企業が過去の記録にない場合、その期間の値を推測したり、ゼロとして扱ったりしません。",
      ],
      blocks: [{ type: "market-cap-growth-ranking" }],
    },
    {
      id: "method",
      heading: "比較日は目標日以前の保存値から選ぶ",
      paragraphs: [
        "期間は基準日から暦月でさかのぼった日を目標にします。1か月前の目標日は2026年9月16日ですが、それ以前に保存された最も新しい値は9月6日です。3か月前の目標日は7月16日で、保存値は7月13日です。そのため、実際の比較期間はそれぞれ40日、95日です。",
        "6か月前の2026年4月16日と1年前の2025年10月16日以前には、このランキングで利用できる保存値がありません。公開ページの別の数値から再計算して埋めず、データなしとしています。保存日も等間隔ではないため、厳密な月末同士の比較や日次推移ではありません。",
        "増加率は（最新時価総額 − 比較時時価総額）÷ 比較時時価総額 × 100、増加額は最新時価総額 − 比較時時価総額です。出典に掲載された米ドル建て時価総額の値を使い、株価や株式数から時価総額を独自に作り直していません。",
        "ランキング順位は増加率または増加額の大きい順です。別に表示する時価総額順位の変動は、選択した地域・企業分類のうち、両方の日付で値を確認できた企業内で比較しています。対象企業全体における過去順位の復元ではありません。",
      ],
    },
    {
      id: "interpretation",
      heading: "時価総額の増加率は株価上昇率とは異なる",
      paragraphs: [
        "株価上昇率は1株当たりの価格変化です。時価総額の増減には、株価のほか、発行済み株式数や自社株買い、株式発行、株式分割などの影響が含まれます。複数の市場に上場する企業や日本企業の値を米ドルで比べる場合は、為替変動も数字に反映されます。",
        "この2時点比較だけでは、増減のうち株価、株式数、為替がそれぞれどの程度を占めるか分けられません。時価総額が増えたことだけから、半導体事業の業績成長や株式投資の収益を判断することもできません。",
      ],
    },
    {
      id: "coverage",
      heading: "対象社数と出典を確認する",
      paragraphs: [
        "対象は現行ランキングの世界TOP30と日本18社です。過去値が保存されていない企業は、その比較期間から除外します。保存時点ごとの基準日、取得日、照合できる社数、出典URLはランキング内の履歴欄で確認できます。",
        "古い記録では現在の企業IDが付いていないため、ティッカーで現行企業と照合しています。ティッカーや上場区分が変わった企業、過去値を確認できない企業は比較対象から外れる場合があります。企業分類は現行ランキングの分類を使うため、過去時点の事業構成を再現するものではありません。",
      ],
    },
    {
      id: "next",
      heading: "時価総額を企業研究の一つの材料として見る",
      paragraphs: [
        "時価総額は市場が評価する企業全体の規模を表す指標です。企業の技術、事業の将来性、職場環境、採用条件を直接示すものではありません。順位が気になった会社は、事業内容や国内拠点、公式採用情報も合わせて確認しましょう。",
      ],
      blocks: [{
        type: "links",
        items: [
          { label: "半導体企業の時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "基準日時点の世界TOP30・日本18社を確認する" },
          { label: "時価総額ランキングの長期推移", href: "/tools/ranking-time-machine", description: "年末値をもとに2010〜2025年の変化を見る" },
          { label: "半導体業界地図", href: "/industry-map", description: "企業の事業領域や業界内の役割を調べる" },
          { label: "半導体株式市場ウォッチ", href: "/semiconductor-watch/stocks", description: "掲載企業の株価チャートや関連記事を見る" },
        ],
      }],
    },
  ],
  relatedGuideSlugs: ["semiconductor-market-cap-ranking", "japan-semiconductor-market-cap-history", "nvidia-intel-market-cap-history"],
  relatedCompanyIds: ["nvidia", "tsmc", "tokyo-electron", "advantest"],
};
