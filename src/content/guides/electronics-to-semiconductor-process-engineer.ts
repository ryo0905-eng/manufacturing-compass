import type { GuideArticle } from "@/content/guides/types";

export const electronicsToSemiconductorProcessEngineerGuide: GuideArticle = {
  slug: "electronics-to-semiconductor-process-engineer",
  title: "電子部品の経験は半導体転職で生かせる？",
  description: "異業種への短期転職を経て、電子部品の経験を外資系半導体のプロセスエンジニア求人へつなげ、オファーを得るまでの記録です。",
  targetQuery: "電子部品 半導体 転職",
  searchIntent: "電子部品や製造業の経験が半導体のプロセスエンジニア転職で評価されるか、実体験から判断材料を得たい",
  status: "published",
  category: "experience",
  featured: true,
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  experienceBasis: [
    "電子部品業界での工程改善・不良解析・品質・データ分析経験",
    "異業種メーカーの新設DX組織でテーマ探索とPoCに取り組んだ経験",
    "外資系半導体メーカーのプロセスエンジニア職からオファーを得た選考経験",
  ],
  publishedAt: "2026-07-12",
  updatedAt: "2026-07-12",
  sources: [
    {
      title: "半導体技術者",
      url: "https://shigoto.mhlw.go.jp/Occupation/Detail?occupationId=267",
      publisher: "厚生労働省 職業情報提供サイト job tag",
      accessedAt: "2026-07-12",
    },
  ],
  readTime: "約10分",
  intro: {
    problem: "電子部品や製造業の経験を、半導体未経験でも生かせるのか迷っていませんか。",
    conclusion: "肩書ではなく仕事内容を分解し、求人要件と一つずつ照合すると接点が見つかります。",
    learnings: "異業種で感じたミスマッチ、転職条件の決め方、短期離職と未経験の説明方法。",
  },
  overviewBlocks: [
    {
      type: "timeline",
      items: [
        { label: "01", title: "電子部品", body: "工程改善・不良解析・品質・データ分析を経験" },
        { label: "02", title: "異業種DX", body: "新設組織でテーマ探索とPoCを担当" },
        { label: "03", title: "外資系半導体", body: "経験をプロセスエンジニア求人へつなぎ、オファー" },
      ],
    },
  ],
  sections: [
    {
      id: "dx-mismatch",
      heading: "PoCまで進めても、予算化には届かなかった",
      lead: "異業種メーカーでは、新設DX組織のチームリーダーを担当しました。ミッションも具体的な仕事も定まっておらず、テーマ探索から始める状況でした。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "ACTION", title: "外部と社内をつないだ", body: "スタートアップへのヒアリング、社内有識者との接続、効果試算、PoCを進めた。" },
            { label: "RESULT", title: "提案は通らなかった", body: "有用性を上位者へ説明したが、明確な利益を示し切れず予算化には至らなかった。" },
            { label: "LEARNING", title: "テーマより先にミッション", body: "何を実現し、何を効果として評価するのかを先に決める必要があると学んだ。" },
          ],
        },
      ],
      paragraphs: [
        "メンバーとはミッション案を何度も議論しました。それでも意思決定にはつながらず、取り組みは停滞しました。",
        "同時に、異業種で働き続けるほど、電子部品で積んだ経験が薄れていくことにも危機感を持ちました。職場環境への懸念も重なり、長く働き続けることは難しいと判断しました。",
      ],
    },
    {
      id: "career-criteria",
      heading: "次は、4つの条件を先に決めた",
      lead: "短期離職になるからこそ、同じミスマッチを繰り返さないための条件を、求人検索より先に書き出しました。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "経験との親和性", body: "これまでの経歴を使える業界と仕事" },
            { label: "02", title: "専門性と将来性", body: "専門性を深め、中長期で年収を上げられる可能性" },
            { label: "03", title: "家族と勤務地", body: "家族の引っ越しが不要な場所" },
            { label: "04", title: "外資系も見る", body: "報酬とキャリアの選択肢を広げる" },
          ],
        },
      ],
      paragraphs: [
        "転職エージェントだけに任せず、dodaなどの求人サイトとLinkedInでも検索しました。電子部品・半導体業界のプロセスエンジニアを中心に、仕事内容との一致と年収の上がり幅を確認しました。",
      ],
    },
    {
      id: "experience-match",
      heading: "求人票を見て「自分のことでは」と思った",
      lead: "工程改善、不良解析、品質、データ分析、海外工場、英語、電子部品。別々に積んだ経験が、一つの求人で重なりました。",
      blocks: [
        { type: "quote", quote: "これ、自分のことを言っているのでは？", caption: "求人票を初めて読んだときの率直な感想" },
        {
          type: "mapping",
          leftLabel: "求人で求められたこと",
          rightLabel: "私の経験との接点",
          rows: [
            { left: "工程改善", right: "量産工程の課題を整理し、改善を進めた" },
            { left: "不良解析", right: "データと現象から原因候補を絞った" },
            { left: "品質", right: "品質問題への対応と再発防止に関わった" },
            { left: "データ分析", right: "製造データを整理し、判断材料を作った" },
            { left: "海外工場", right: "海外の関係者と業務を進めた" },
            { left: "英語", right: "業務で英語を使った" },
            { left: "電子部品", right: "電子部品の量産・工程に関わった" },
          ],
        },
      ],
      paragraphs: [
        "厚生労働省のjob tagでも、半導体プロセスエンジニアの仕事に、工程の設計・構築、品質向上、歩留まり改善、量産効率化などが挙げられています。",
        "ただし、電子部品と半導体は同じ製品・工程ではありません。半導体固有の経験が必要な求人もあります。私の場合は、複数の経験が今回の求人要件と同時に重なったことが評価につながりました。",
      ],
    },
    {
      id: "interview",
      heading: "面接では、2つの懸念に答えた",
      lead: "短期離職と半導体未経験。どちらも隠さず、今回の求人との接点まで説明しました。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "短期離職", title: "専門性を深めたい", body: "勤務先への不満だけでなく、電子部品・工程改善・品質の経験をもっと生かしたいと説明した。" },
            { label: "半導体未経験", title: "共通点と未経験を分ける", body: "経験していない技術をできるとは言わず、共通する経験と業務外の学習姿勢を伝えた。" },
          ],
        },
      ],
      paragraphs: [
        "短期離職を前向きに言い換えただけではありません。前回なぜミスマッチが起き、今回は何を条件として見直したのかまで整理し、転職理由に一貫性を持たせました。",
      ],
    },
    {
      id: "offer-decision",
      heading: "オファーは、3つの条件で判断した",
      lead: "採用側からは、経験と求める人材のマッチ度が高いというフィードバックを受けました。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "WORK", title: "経験との一致", body: "プロセスエンジニアとして、過去の経験を生かせる" },
            { label: "PLACE", title: "家族と勤務地", body: "家族の引っ越しが不要だった" },
            { label: "OFFER", title: "希望を上回る条件", body: "基本年収以外の制度も含めて判断した" },
          ],
        },
      ],
      paragraphs: [
        "報酬だけで決めたわけではありません。仕事内容、勤務地、専門性を深められる可能性を合わせて判断しました。報酬制度や評価の仕組みは企業ごとに異なるため、今回の条件がほかの人にも当てはまるわけではありません。",
      ],
    },
    {
      id: "what-is-unknown",
      heading: "まだ、転職の成否は分からない",
      lead: "オファーを得たことと、転職先で活躍できることは別です。",
      blocks: [
        {
          type: "note",
          title: "入社後に確かめること",
          body: "半導体固有の技術を学ぶ速度、電子部品経験を実務で使える範囲、外資系の働き方との相性は、実際に働いてから追記します。",
        },
      ],
      paragraphs: [
        "電子部品経験があれば半導体へ転職できる、外資系へ行けば年収が上がる、とは結論づけません。今回分かったのは、過去の仕事を分解して求人要件と照合すると、異業界だと思っていた求人にも強い接点が見つかる場合がある、ということです。",
      ],
    },
  ],
  todayQuest: "求人要件と自分の経験を、一致・近い・未経験の3段階で整理する",
  relatedGuideSlugs: ["semiconductor-career-start", "quality-engineer-route", "equipment-engineer-route"],
  relatedCompanyIds: [],
};
