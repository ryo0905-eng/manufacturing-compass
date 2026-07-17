import type { GuideArticle } from "@/content/guides/types";

export const productionEngineeringToSemiconductorProcessEngineerGuide: GuideArticle = {
  slug: "production-engineering-to-semiconductor-process-engineer",
  title: "生産技術から半導体プロセスエンジニアへ転職するルート",
  description: "電子部品の工程改善経験とPython・データ分析を、半導体のプロセス改善職へつなげた実体験を整理します。",
  targetQuery: "生産技術 半導体 転職",
  searchIntent: "生産技術の歩留まり・品質・データ分析経験を、半導体プロセスエンジニアへどうつなげるか知りたい",
  status: "published",
  category: "experience",
  featured: true,
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  experienceBasis: [
    "電子部品業界で10年以上、生産性向上・歩留まり改善・品質改善・コスト削減に取り組んだ経験",
    "Python、統計解析、BI、機械学習を製造工程の課題解決へ使った経験",
    "外資系半導体メーカーで、複数工程のプロセス改善とデータ活用に関わる職種からオファーを得た選考経験",
  ],
  publishedAt: "2026-07-13",
  updatedAt: "2026-07-17",
  sources: [
    {
      title: "半導体技術者",
      url: "https://shigoto.mhlw.go.jp/Occupation/Detail?occupationId=267",
      publisher: "厚生労働省 職業情報提供サイト job tag",
      accessedAt: "2026-07-13",
    },
    {
      title: "精密機器技術者",
      url: "https://shigoto.mhlw.go.jp/User/Occupation/Detail/271",
      publisher: "厚生労働省 職業情報提供サイト job tag",
      accessedAt: "2026-07-13",
    },
    {
      title: "半導体前工程プロセスエンジニア_プロセスインテグレーション",
      url: "https://jobs.renesas.com/job/-in-hitachinaka-japan-jid-4572",
      publisher: "ルネサスエレクトロニクス",
      accessedAt: "2026-07-13",
    },
    {
      title: "プロセス・インテグレーション・エンジニア",
      url: "https://ro.careers.tsmc.com/job/Kumamoto-%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9%E3%80%80%E3%82%A4%E3%83%B3%E3%83%86%E3%82%B0%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%80%80%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2-1-1-1-1-43/1357952066/",
      publisher: "JASM",
      accessedAt: "2026-07-13",
    },
    {
      title: "Engineer (QM - Advanced Quality Excellence)",
      url: "https://ro.careers.tsmc.com/job/Kikuyo-Engineer-%28QM-Advanced-Quality-Excellence%29-43/1363366566/",
      publisher: "JASM",
      accessedAt: "2026-07-13",
    },
  ],
  readTime: "約11分",
  intro: {
    problem: "生産技術の経験が半導体で評価されるのか、自分では判断できない人向けです。",
    conclusion: "工程知識とDXを別々にせず、現場課題を見つけて改善を仕組み化した経験として伝えます。",
    learnings: "求人要件との照合方法、面接で聞かれたこと、経験の解像度を上げる順番。",
  },
  overviewBlocks: [
    {
      type: "timeline",
      items: [
        { label: "01", title: "業界を学ぶ", body: "書籍で半導体プロセスとビジネスの全体像を確認" },
        { label: "02", title: "求人で照合する", body: "実際の求人票とエージェントの提案から経験との接点を発見" },
        { label: "03", title: "面接で確かめる", body: "質問とフィードバックから、自分の経験の見え方を具体化" },
      ],
    },
  ],
  sections: [
    {
      id: "three-connections",
      heading: "工程知識とDXを、別々の経験として見せない",
      lead: "求人要件と重なったのは、DX、製造プロセス、英語の三つでした。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "求人で求められた領域",
          rightLabel: "私の経験との接点",
          rows: [
            { left: "DX", right: "Python、データ分析、AI・機械学習、BI、ETL" },
            { left: "製造プロセス", right: "品質管理、歩留まり改善、統計、プロセス開発" },
            { left: "グローバル", right: "海外工場で英語を使った実務経験" },
          ],
        },
      ],
      paragraphs: [
        "重要だったのは、Pythonを使えることだけではありません。現場の課題を自分で見つけ、プロセス知識で必要なデータを選び、関係部署を巻き込み、改善が進む仕組みまで作ったことです。",
        "厚生労働省のjob tagでは、半導体プロセスエンジニアの仕事として、工程の設計・構築、品質向上、歩留まり改善、設備の選択、効率的な量産などが挙げられています。公開求人にも、生産技術経験を応募要件に含め、歩留まり、コスト、CT、工程移管の改善を担当する例があります。",
      ],
    },
    {
      id: "production-engineering-connection",
      heading: "電子部品の生産技術と、半導体には接点があった",
      lead: "製品や工程が同じでなくても、問題を分解して改善する流れには共通点がありました。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FIND", title: "共通点を見つける", body: "品番別の歩留まりから、低歩留まり品番に共通する設計を特定" },
            { label: "TEST", title: "仮説を検証する", body: "ドメイン知識で仮説を作り、実験計画法で効率的に確認" },
            { label: "CHANGE", title: "工程へ反映する", body: "原因となった設計を修正し、歩留まりを大幅に改善" },
          ],
        },
      ],
      paragraphs: [
        "私は電子部品メーカーで、複数の製造工程と半導体関連部品の生産技術に携わりました。半導体前工程そのものを経験していたわけではありません。経験していない工程まで、できるとは説明しませんでした。",
        "別の海外工場では、ローカル社員とプロセス不良を改善し、不良率を100ppmから0ppmへ削減しました。工程が変わっても、現象を分解し、データと現場情報から仮説を作る考え方は共通していました。",
      ],
    },
    {
      id: "latest-dx-project",
      heading: "面接の中心は、年間約1.2億円を削減した改善だった",
      lead: "主に質問されたのは、当時最も新しかった加工材料の使用量を最適化するプロジェクトです。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "100種類以上の条件", body: "暗黙知に依存し、何から改善すべきか分からなかった" },
            { label: "02", title: "小さく可視化", body: "品番ごとの品質指標を一覧にし、現状を共有" },
            { label: "03", title: "データをつなぐ", body: "加工条件、材料の状態、加工履歴を紐づけて分析" },
            { label: "04", title: "改善を高速化", body: "短期間で全条件を最適化し、年間約1.2億円を削減" },
          ],
        },
      ],
      paragraphs: [
        "現場では加工材料の使用量管理が暗黙知に依存していました。少量多品種で、品番ごとに100種類以上の条件があり、何から手を付けるべきか分からない状態でした。",
        "最初に品番ごとの加工状態を示す品質指標をダッシュボード化しました。さらに、主要な加工条件、材料の状態、加工履歴を紐づけ、同じ画面から分析まで進められるようにしたことで、改善サイクルが速くなりました。",
      ],
    },
    {
      id: "domain-knowledge",
      heading: "「何を見える化するか」に、プロセス知識を使った",
      lead: "データを集めるだけでは、現場の改善にはつながりません。",
      blocks: [
        {
          type: "quote",
          quote: "指示どおりのシステムを作ったのではなく、自分で課題を見つけ、プロセスエンジニアとしての判断を仕組みに組み込みました。",
          caption: "面接で説明した、自分の役割",
        },
        {
          type: "note",
          title: "ドメイン知識を使った部分",
          body: "品質指標に影響する要因を推定し、何のデータをつなぎ、何を比較するかを決めました。現象への仮説があるから、分析対象を設計できます。",
        },
      ],
      paragraphs: [
        "公式求人でも、半導体のプロセス分析・改善で、ビッグデータ分析、実験設計、歩留まり・性能向上を組み合わせる例があります。品質領域でも、工程・設備データの監視、統計的工程管理、予測分析、機械学習、データサイエンスを使う職務が公開されています。",
      ],
    },
    {
      id: "cross-functional-work",
      heading: "小さな可視化を、合意形成に使った",
      lead: "一人でコードを書くだけでは、現場で使われる仕組みにはなりませんでした。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "IT", title: "インフラを整える", body: "システムを動かす基盤について協力を依頼" },
            { label: "QUALITY", title: "品質限界を決める", body: "品質を維持しながら、条件をどこまで最適化できるか検討" },
            { label: "MANAGEMENT", title: "効果を示す", body: "上位者へプロジェクトの必要性と期待効果を説明" },
          ],
        },
      ],
      paragraphs: [
        "最初から大規模な完成形を提案したのではありません。まず小さく見える化し、同じ画面を見ながら現状、必要性、取り組みの優位性を説明しました。",
        "抽象的な提案よりも共通認識を作りやすく、関係部署から協力を得て、プロジェクトを速く進められました。",
      ],
    },
    {
      id: "interview-questions",
      heading: "面接では、成果額より再現できる進め方を聞かれた",
      lead: "年間約1.2億円という結果だけでなく、課題から成果までの過程を確認されました。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "ROLE", title: "どんな役割か" },
            { label: "WHY", title: "なぜ始めたか" },
            { label: "IDEA", title: "何を工夫したか" },
            { label: "DIFFICULTY", title: "何が難しかったか" },
          ],
        },
      ],
      paragraphs: [
        "私は、単なる見える化ではないことを説明しました。現場の課題を自分で見つけ、関係部署を巻き込み、プロセスエンジニアとしての判断をITの仕組みに組み込んだことが、自分の経験から出せる価値だと伝えました。",
        "採用側が各要素をどの程度評価したかは分かりません。ただ、求人票にあったPython、データ分析、AI・機械学習、製造プロセス、英語という要件に、自分の実務経験が重なっていました。",
      ],
    },
    {
      id: "live-market-feedback",
      heading: "本だけでは、自分の経験の生かし方は分からなかった",
      lead: "書籍は業界理解の入口になりましたが、自分と求人の接点は別の方法で確かめました。",
      blocks: [
        {
          type: "quote",
          quote: "自分の経験がどう生きるかは、生の求人票、エージェントとの会話、面接での反応から解像度を上げるしかないと思います。",
          caption: "転職活動を振り返って感じたこと",
        },
        {
          type: "timeline",
          items: [
            { label: "01", title: "求人票を読む", body: "実際に募集されている要件を確認" },
            { label: "02", title: "提案を受ける", body: "エージェントから、候補になる求人と理由を聞く" },
            { label: "03", title: "経験を照合する", body: "一致、近い、未経験の三つに分ける" },
            { label: "04", title: "反応を得る", body: "面接の質問とフィードバックから、経験の見え方を知る" },
          ],
        },
      ],
      paragraphs: [
        "本やネット記事だけで、自分がどの求人に合うかを判断するのは難しいと感じました。最初から可能性を正確に判断するのではなく、公開求人と転職市場からの反応を使い、少しずつ解像度を上げる方が現実的でした。",
      ],
    },
    {
      id: "first-action",
      heading: "まず求人票を1件、三つに分ける",
      lead: "興味のある半導体求人を一つ選び、自分の経験との距離を確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "求人要件との距離",
          rightLabel: "次に行うこと",
          rows: [
            { left: "一致する", right: "最も新しい改善実績を、課題・役割・工夫・結果で説明する" },
            { left: "近い", right: "製品名ではなく、改善の進め方や使ったスキルへ置き換える" },
            { left: "未経験", right: "できるとは書かず、学ぶ内容と順番を決める" },
          ],
        },
        {
          type: "note",
          title: "この事例の限界",
          body: "これは、複数工程のプロセス改善とデータ活用に関わる一つの求人との一致です。生産技術経験があれば、すべての半導体プロセスエンジニア職へ転職できるという意味ではありません。",
        },
      ],
      paragraphs: [
        "求人ごとに、工程経験、専攻、勤務形態、英語、データ技術などの要件を確認してください。自分だけで判断しにくい要件は、応募前に転職エージェントや採用窓口へ実際の使用場面を確認します。",
      ],
    },
  ],
  todayQuest: "興味のある求人を1件選び、要件を「一致・近い・未経験」の三つに分ける",
  relatedGuideSlugs: [
    "semiconductor-resume-improvement-results",
    "electronics-to-semiconductor-process-engineer",
    "semiconductor-career-start",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
