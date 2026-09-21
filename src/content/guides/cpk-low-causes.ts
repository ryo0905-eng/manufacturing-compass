import type { GuideArticle } from "@/content/guides/types";

// Fictional summary-input examples, not observations from a real production process.
export const cpkLowExamples = [
  { label: "中央・小さいばらつき", mean: 100, standardDeviation: 1, cp: 2, cpk: 2 },
  { label: "平均が上限側へずれる", mean: 103, standardDeviation: 1, cp: 2, cpk: 1 },
  { label: "中央・大きいばらつき", mean: 100, standardDeviation: 2, cp: 1, cpk: 1 },
] as const;

export const cpkLowCausesGuide: GuideArticle = {
  slug: "cpk-low-causes",
  title: "Cpkが低い原因は？平均のずれとばらつきの見分け方",
  description: "同じCpk＝1でも、平均のずれとばらつきの状態は異なります。架空の3例でCpとCpkを比較し、測定系・工程の安定性・データの混在など、改善前に確認することを整理します。",
  targetQuery: "Cpk 低い 原因",
  searchIntent: "計算したCpkが低い理由を平均とばらつきに分けて理解し、工程条件を変える前に何を確認するか知りたい",
  status: "draft",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  // Assigned editor only. This draft is excluded from public routes until human review.
  reviewedBy: "RYO",
  publishedAt: "",
  updatedAt: "2026-09-21",
  showCareerCtas: false,
  basisLabel: "この記事の前提",
  basisNote: "公開資料と架空の数値例を使う技術解説です。特定の工場の実績や工程条件を示すものではありません。",
  experienceBasis: [
    "NISTの工程能力の定義・式と、Minitabの工程内／全体の変動の説明を参照",
    "規格94〜106、平均100または103、工程内標準偏差1または2の架空例で比較",
    "工程原因の断定や条件の自動推奨ではなく、次に確認する情報を整理",
  ],
  sources: [
    { title: "What is Process Capability?", url: "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm", publisher: "NIST/SEMATECH", accessedAt: "2026-09-21" },
    { title: "Assessing Process Stability", url: "https://www.itl.nist.gov/div898/handbook/ppc/section4/ppc45.htm", publisher: "NIST/SEMATECH", accessedAt: "2026-09-21" },
    { title: "Interpret the key results for Normal Capability Analysis", url: "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/key-results/", publisher: "Minitab", accessedAt: "2026-09-21" },
  ],
  readTime: "約7分",
  intro: {
    problem: "Cpkが低いと分かっても、平均を動かすべきか、ばらつきを減らすべきか、数値だけでは迷います。",
    conclusion: "同じ規格・同じ工程内標準偏差の定義でCpとCpkを並べ、平均の位置とばらつきを確認します。ただし、その違いは工程原因を証明しません。測定系と時間変化を確認してから、条件別の比較へ進みます。",
    learnings: "同じCpkになる異なる分布、CpとCpkの読み方、改善前の確認順、計算ツールで架空例を再現する方法。",
  },
  sections: [
    {
      id: "read-both",
      heading: "Cpkが低いだけでは、工程の原因は決まらない",
      paragraphs: [
        "Cpkは、平均から近い方の規格限界までの距離を、ばらつきと比べた指標です。規格が同じなら、平均が限界へ近づいた場合も、ばらつきが大きくなった場合も小さくなります。",
        "Cpは規格幅とばらつきの関係を見ます。同じデータ範囲と標準偏差の求め方で比較すると、CpよりCpkが小さい場合は規格中央からの平均のずれが影響しています。CpとCpkが近くても、両方が低ければ規格幅に対してばらつきが大きい可能性があります。",
        "ここで分かるのは数値の関係です。装置、材料、測定方法のどれが原因か、平均をどこへ動かしてよいかは、これだけでは決まりません。必要なCpkの水準は顧客要求や社内基準を確認し、1.33を一律の合否線にしないでください。",
      ],
    },
    {
      id: "three-examples",
      heading: "同じCpk＝1になる、二つの違う状態",
      lead: "下限規格LSL＝94、上限規格USL＝106を共通にした架空例です。比較のため規格中央100を基準にしますが、実工程の最適条件とは限りません。",
      blocks: [
        {
          type: "comparison-table",
          title: "架空の3例｜σは与えた工程内標準偏差、実測データではありません",
          columns: ["例", "平均", "工程内σ", "Cp", "Cpk"],
          rows: cpkLowExamples.map(example => ({ label: example.label, values: [example.mean, example.standardDeviation, example.cp, example.cpk].map(String) })),
        },
        {
          type: "sigma-distribution-comparison",
          title: "中心のずれと広がりを分けて見る",
          description: "分布形状の模式図です。曲線や規格線の位置は数値例を正確な縮尺で描いたものではなく、実測分布でもありません。",
          scenarios: [
            { kind: "capable", label: "BASELINE", title: "中央・小さいばらつき", body: "平均100、工程内σ＝1。Cp＝2、Cpk＝2。", insight: "比較の基準となる架空例" },
            { kind: "shifted", label: "SHIFT", title: "幅は同じで、平均がずれる", body: "平均103、工程内σ＝1。Cp＝2のままCpk＝1。", insight: "規格上限までの距離が短くなる" },
            { kind: "wide", label: "SPREAD", title: "平均は中央で、幅が広がる", body: "平均100、工程内σ＝2。CpもCpkも1。", insight: "規格幅に対するばらつきが大きくなる" },
          ],
        },
      ],
      paragraphs: [
        "式はCp＝（USL−LSL）÷（6σ）、Cpk＝min［（USL−平均）÷（3σ）,（平均−LSL）÷（3σ）］です。二つの例を計算すると、Cpkだけを並べても違いを見分けられないことが分かります。",
        "平均103の例はmin［（106−103）÷3,（103−94）÷3］＝1です。平均100・σ＝2の例はmin［6÷6,6÷6］＝1になります。前者は近い側の余裕、後者は広がりが指標を小さくしています。",
        "これは両側規格の例です。片側規格では規格中央や両側のCpを定義できないため、この比較をそのまま当てはめないでください。",
      ],
    },
    {
      id: "check-before-adjusting",
      heading: "工程条件を変える前に確認する4つのこと",
      blocks: [{
        type: "mapping", leftLabel: "確認すること", rightLabel: "次に見る情報",
        rows: [
          { left: "測定値を信頼できるか", right: "測定器、測定手順、分解能、測定者差を確認する。同じ品物を測ったときの差が問題なら、測定システム評価を検討する。" },
          { left: "時間とともに変化していないか", right: "採取順を残して時系列・管理図を見る。途中で平均やばらつきが変わるなら、全期間を一つにまとめた指数だけで判断しない。" },
          { left: "違う条件を混ぜていないか", right: "製品、装置、材料ロット、測定方法、期間の違いを確認する。理由なくデータを除外せず、比較目的に沿って層別する。" },
          { left: "規格と計算方法が合っているか", right: "単位、規格改訂、片側／両側、標準偏差の推定方法を確認する。分布の形やサンプルの取り方も記録する。" },
        ],
      }],
      paragraphs: [
        "工程が時間的に安定しているかは、Cpkとは別に確認します。規格限界は製品の要求であり、管理図の管理限界とは役割が違います。",
        "見かけ上の平均のずれを見つけても、直ちに設定値を動かすのではなく、そのずれが継続するのか、測定や採取条件の違いではないかを確認します。候補条件の比較から、確認実験へ進む順番を考えます。",
      ],
    },
    {
      id: "try-calculator",
      heading: "Cpkツールで架空例を再現する",
      paragraphs: [
        "計算モードで「平均・短期標準偏差」の入力を選び、LSL＝94、USL＝106を入力します。平均100・標準偏差1から始め、平均だけを103へ、次に平均100・標準偏差2へ変え、表のCp・Cpkと一致するか確認してください。",
        "この記事のσは説明のために与えた工程内標準偏差です。自分の測定値に置き換えるときは、工程に適した推定方法が必要です。このサイトの生データ入力は全データの標本標準偏差を使うため、結果をPp・Ppkと表示します。全体標準偏差を工程内標準偏差としてそのまま入力しないでください。",
      ],
      blocks: [{ type: "links", items: [
        { label: "Cp・Cpk計算ツールで3例を試す", href: "/tools/cpk", description: "平均・短期標準偏差入力で、平均とばらつきの影響を一つずつ確かめる" },
        { label: "管理図で時間変化を学ぶ", href: "/tools/control-chart", description: "平均の変化や傾向を、時系列で確認する考え方を学ぶ" },
        { label: "Gage R&Rで測定誤差を学ぶ", href: "/tools/gage-rr", description: "部品差と測定によるばらつきを分けて考える" },
      ] }],
    },
    {
      id: "record-results",
      heading: "数値と一緒に、比較の前提を残す",
      paragraphs: ["報告にはCp・Cpkだけでなく、対象製品・測定項目・単位、規格、採取期間と件数、層別条件、標準偏差の求め方を添えます。時間的な安定性と測定系の確認状況、未確認の点も分けて書くと、次の比較につながります。"],
      blocks: [{ type: "note", title: "架空例の記録", body: "規格94〜106、平均103、与えた工程内σ＝1からCp＝2、Cpk＝1。規格中央からのずれが指標へ影響している。実測の時系列・測定系・工程原因はこの例では評価していない。" }],
    },
    {
      id: "faq", heading: "Cpkの読み方でよくある質問", paragraphs: [],
      blocks: [{ type: "faq", items: [
        { question: "Cpが高く、Cpkだけ低いのはなぜですか？", answer: "同じ両側規格・同じ標準偏差を使う場合、平均が規格中央からずれるとCpkはCpより小さくなります。ただし、ずれを生んだ工程原因は指標だけでは分かりません。" },
        { question: "Cpkが低いと、不良率も決まりますか？", answer: "Cpkだけでは実際の不良率は決まりません。分布、中心位置、安定性、対象期間などの条件が必要です。正規性や安定性を確認せず、指数を不良率へ単純換算しないでください。" },
        { question: "生データから計算したPpkとCpkは比べられますか？", answer: "標準偏差の求め方が異なります。同じ対象と期間か、工程内変動をどう推定したかを確認し、数値の差を単なる改善・悪化として扱わないでください。" },
      ] }],
    },
  ],
  relatedGuideSlugs: ["six-sigma", "semiconductor-inspection-metrology"],
  relatedCompanyIds: [],
};
