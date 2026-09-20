import type { GuideArticle } from "@/content/guides/types";
import { equipmentSalesCompanies, equipmentSalesMeta } from "@/data/semiconductor-equipment-sales";

export const semiconductorEquipmentSalesRankingGuide: GuideArticle = {
  slug: "semiconductor-equipment-sales-ranking",
  title: "半導体製造装置メーカー世界ランキング【2025年売上高】工程から上位10社を比較",
  description: "2025暦年の半導体製造装置売上高で世界上位10社を比較。成膜・露光・エッチング・洗浄・検査・テスト・組立を選び、関連企業と製品を確認できます。集計範囲と公式出典も掲載。",
  targetQuery: "半導体製造装置メーカー 世界ランキング",
  searchIntent: "半導体製造装置メーカーの売上規模と対応工程を比較し、次に調べる企業・装置を見つけたい",
  status: "published",
  category: "industry",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  showIntroSummary: false,
  showExperienceBasis: false,
  showCareerCtas: false,
  experienceBasis: [
    "東京エレクトロンの2026年9月15日版IR資料に掲載された、TechInsightsの2025暦年ランキングを使用",
    "工程対応は各社の公式製品情報をもとに整理。企業の規模と工程での役割を分けて表示",
  ],
  publishedAt: "2026-09-17",
  updatedAt: "2026-09-20",
  sources: [
    { title: equipmentSalesMeta.sourceTitle, url: equipmentSalesMeta.sourceUrl, publisher: "東京エレクトロン（原出典：TechInsights）", accessedAt: equipmentSalesMeta.checkedAt },
    ...equipmentSalesCompanies.flatMap((company) => [...new Set(company.capabilities.map((item) => item.sourceUrl))].map((url) => ({
      title: `${company.name} 公式製品・技術情報`, url, publisher: company.name, accessedAt: equipmentSalesMeta.checkedAt,
    }))),
  ],
  readTime: "7分",
  intro: {
    problem: "装置メーカーの規模は分かっても、どの工程で何をする会社なのかは順位だけでは見えてきません。",
    conclusion: "2025年の売上高と、公式情報で確認できる製品の役割を一緒に見ていきます。",
    learnings: "上位10社の売上規模、工程ごとの製品例、ランキングの読み方が分かります。",
  },
  sections: [
    {
      id: "ranking",
      heading: "2025年の世界上位10社を、工程から見る",
      paragraphs: ["2025暦年の半導体製造装置売上高では、ASML、Applied Materials、Lam Researchの順に並びます。工程ボタンで関連企業を確かめながら、気になる会社の製品や技術を調べられます。"],
      blocks: [{ type: "equipment-sales-ranking" }],
    },
    {
      id: "method",
      heading: "集計方法：同じ暦年・同じ出典で比較する",
      paragraphs: [
        "売上高は東京エレクトロンのInvestors’ Guide（2026年9月15日版）10ページに掲載されたCY2025 SPE Makers Top 15から、上位10社を転記しています。原出典はTechInsights Inc., May 2026です。2025年1〜12月を対象とする暦年集計で、単位は十億米ドルです。",
        "各社の決算書から決算期の異なる数字を集めて並べたものではありません。順位と金額は同資料の半導体製造装置売上の定義に従い、企業全体の連結売上や時価総額とは区別しています。為替換算やサービス売上の扱いなど、詳細な算定条件は公開スライドだけでは確認できません。",
        "データ確認日は2026年9月17日です。2026年の通年売上や将来予測を表すものではありません。工程対応は同日の公式製品情報で確認した例で、売上の対象年とは時点が異なります。",
      ],
    },
    {
      id: "reading",
      heading: "売上の大きさと、扱う工程を分けて読む",
      paragraphs: [
        "成膜・エッチング・洗浄のように複数の工程へ装置を提供する企業も、露光や電気試験などに特徴を持つ企業もあります。全体売上が大きいことから、個別工程でのシェアや技術の優劣までは判断できません。",
        "露光には光でパターンを転写・描画する装置を含めます。東京エレクトロンの塗布・現像装置は露光の前後を支えますが、露光装置そのものとは分けています。SCREENの直接描画は先端パッケージ向けで、ASMLのEUV・DUV装置とは用途が異なります。",
        "テストには電気試験を行うテスタと、その接触・位置合わせを担うプローバを含め、企業説明で違いを示しています。検査・計測は欠陥や寸法などを調べる工程として分けています。",
        "組立・実装は接合などでチップやウェーハをつなぐ装置を扱います。先端パッケージに使う成膜・露光・検査装置は、それぞれの工程へ分類します。ボタンは半導体の全工程や全製品を網羅したものではありません。",
        "企業研究では、興味のある工程を選び、具体的な製品とその役割を確認してください。順位だけで就職先としての適性や働きやすさを判断せず、仕事内容は個別の募集内容と照合する必要があります。",
      ],
    },
    {
      id: "faq",
      heading: "半導体製造装置メーカーランキングの見方でよくある質問",
      paragraphs: [],
      blocks: [{ type: "faq", items: [
        { question: "企業全体の売上高ランキングですか？", answer: "いいえ。2025暦年の半導体製造装置売上高を比較しています。企業全体の連結売上や時価総額とは異なります。集計方法の節で出典と対象期間を確認できます。" },
        { question: "売上高が大きい企業は、すべての工程で強いのですか？", answer: "全体の装置売上高から個別工程のシェアや技術の優劣は判断できません。工程ボタンで関連企業を絞り、各社の製品例と公式情報を確認してください。" },
        { question: "2026年の売上高を比較できますか？", answer: "この表の対象は2025年1〜12月で、データ確認日は2026年9月17日です。記事の更新日とは区別し、2026年の通年売上や予測として扱わないでください。" },
      ] }],
    },
    {
      id: "related",
      heading: "企業の規模から、工程と仕事内容へ",
      paragraphs: ["工程別の記事では、装置が何を変え、何を測るのかを説明しています。業界全体での企業の役割や、時価総額という別の指標も合わせて確認できます。"],
      blocks: [{ type: "links", items: [
        { label: "半導体製造装置メーカーとは", href: "/guides/semiconductor-equipment-manufacturers", description: "工程・企業・仕事内容の関係を基礎から理解する" },
        { label: "半導体業界地図", href: "/industry-map", description: "装置企業とデバイス・材料企業の関係を見る" },
        { label: "半導体企業の時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "株式市場での評価額という別の指標で見る" },
      ] }],
    },
  ],
  relatedGuideSlugs: ["semiconductor-equipment-manufacturers", "semiconductor-market-cap-ranking", "semiconductor-manufacturing-process"],
  relatedCompanyIds: ["tokyo-electron", "screen", "advantest", "asml", "applied-materials", "lam-research", "kla", "teradyne"],
};
