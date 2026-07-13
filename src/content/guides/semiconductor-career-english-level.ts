import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCareerEnglishLevelGuide: GuideArticle = {
  slug: "semiconductor-career-english-level",
  title: "外資系半導体への転職に英語力はどこまで必要？",
  description: "TOEIC約600点・会話経験ほぼなしで海外勤務を始めたRYOが、2.5年の実務と外資系半導体メーカーの選考で実際に確認された英語力を振り返ります。",
  targetQuery: "半導体 転職 英語力",
  searchIntent: "英語力に自信がなく外資系半導体メーカーへの応募を迷っている人が、職種ごとの英語要件と実際の選考例から判断材料を得たい",
  status: "published",
  category: "experience",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  experienceBasis: [
    "TOEIC約600点・英会話経験がほぼない状態から海外勤務を始めた経験",
    "マレーシアとシンガポールの工場で約2.5年間、会議・指示・メールに英語を使った経験",
    "外資系半導体メーカーの技術面接・人事面接を受け、オファーを得た経験",
  ],
  publishedAt: "2026-07-13",
  updatedAt: "2026-07-13",
  sources: [
    {
      title: "Field Application Engineer Chitose",
      url: "https://www.asml.com/en/careers/find-your-job/field-application-engineer-chitose-j00340436",
      publisher: "ASML Careers",
      accessedAt: "2026-07-13",
    },
    {
      title: "Senior Field Application Engineer",
      url: "https://www.asml.com/en/careers/find-your-job/senior-field-application-engineer-j00334293",
      publisher: "ASML Careers",
      accessedAt: "2026-07-13",
    },
    {
      title: "Account Manager",
      url: "https://www.asml.com/en/careers/find-your-job/account-manager-j00336529",
      publisher: "ASML Careers",
      accessedAt: "2026-07-13",
    },
  ],
  readTime: "約10分",
  intro: {
    problem: "外資系というだけで、高い英語力が必須だと思って応募先から外していませんか。",
    conclusion: "必要な英語力は会社名ではなく、配属部門とポジションの求人要件から確認します。",
    learnings: "TOEIC約600点からの海外勤務、実務で困ったこと、選考で実際に確認された内容。",
  },
  overviewBlocks: [
    {
      type: "timeline",
      items: [
        { label: "01", title: "TOEIC 約600点", body: "会話経験はほぼなく、読むにも時間が必要" },
        { label: "02", title: "海外勤務 約2.5年", body: "マレーシア・シンガポールで英語を実務使用" },
        { label: "03", title: "外資系半導体へ", body: "TOEIC 780点を記載し、英語確認を含む選考へ" },
      ],
    },
  ],
  sections: [
    {
      id: "requirements-vary",
      heading: "外資系でも、応募した求人では英語が必須ではなかった",
      lead: "私は会社のイメージではなく、求人票に英語が必須要件として書かれているかを見ました。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "ASML Japanの公開求人例",
          rightLabel: "記載された英語要件",
          rows: [
            { left: "Field Application Engineer", right: "TOEIC 600超・日常会話・日英での技術コミュニケーション" },
            { left: "Senior Field Application Engineer", right: "TOEIC 700以上・英語で社内外の技術議論を主導" },
            { left: "Account Manager", right: "日本語・英語ともに流暢・TOEIC 800以上" },
          ],
        },
        {
          type: "note",
          title: "公開求人の別例です",
          body: "この表は、職種によって英語要件が変わることを示すASML Japanの公開求人例です。私の転職先を示すものではありません。求人内容は変わるため、応募時に公式情報を確認してください。",
        },
      ],
      paragraphs: [
        "私が応募した外資系半導体メーカーのポジションには、英語がmustとは書かれていませんでした。Business levelやFluentなどの記載もなかったため、英語力を理由に応募を迷うことはありませんでした。",
        "実際の公開求人でも、同じ会社の中でTOEIC 600超、700以上、800以上かつ流暢など、職種ごとに要件が異なります。点数だけでなく、日常会話、技術議論の主導、顧客対応など、英語を使う場面まで読みます。",
      ],
    },
    {
      id: "starting-point",
      heading: "TOEIC約600点、会話経験ほぼなしで海外勤務を始めた",
      lead: "英語がまったく分からない状態ではありませんでしたが、すぐに会話できる自信はありませんでした。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SCORE", title: "TOEIC 約600点", body: "海外勤務を始める前の目安" },
            { label: "SPEAKING", title: "会話経験ほぼなし", body: "英語で話すことには自信がなかった" },
            { label: "READING", title: "時間をかければ読める", body: "メールや資料は多少理解できた" },
          ],
        },
      ],
      paragraphs: [
        "海外工場では約2.5年働きました。勤務地はマレーシアとシンガポールです。英語での会話はほぼ毎日、会議は週1回ほどありました。一方で、日本人もいたため日本語に頼る場面があり、一人で黙々と作業して会話が少ない日もありました。",
      ],
    },
    {
      id: "english-at-work",
      heading: "会議、指示、メール、Python勉強会で英語を使った",
      lead: "日常会話だけではなく、現地メンバーと仕事を進めるために英語を使いました。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "MEETING", title: "会議と資料作成", body: "週1回ほどの会議、英語メール、説明資料" },
            { label: "MANAGEMENT", title: "部下への指示", body: "現地メンバーへの業務指示と指導" },
            { label: "LEARNING", title: "Python勉強会", body: "勉強会を運営し、英語で進行・ファシリテーション" },
          ],
        },
      ],
      paragraphs: [
        "ローカル人材を採用したときには、自分が面接官として英語で候補者を面接しました。ただし、その場で何でも話せたわけではありません。質問と進行を事前に準備してから臨みました。",
      ],
    },
    {
      id: "what-was-hard",
      heading: "指示はできても、雑談と指導のニュアンスが難しかった",
      lead: "ゆっくり話してもらえば聞き取れても、言いたいことをその場で返すのは別の難しさがありました。",
      blocks: [
        {
          type: "quote",
          quote: "シンプルな英語で指示はできても、部下への指導のニュアンスが伝わったかは、いつも不安でした。",
          caption: "海外工場で感じていたこと",
        },
        {
          type: "mapping",
          leftLabel: "できたこと",
          rightLabel: "難しかったこと",
          rows: [
            { left: "ゆっくりした英語を聞き取る", right: "言いたいことをすぐ英語にする" },
            { left: "シンプルな指示を出す", right: "細かなニュアンスまで伝える" },
            { left: "必要な会話をする", right: "雑談を広げ、関係を深める" },
          ],
        },
      ],
      paragraphs: [
        "仕事を止めないための会話はできても、会話が淡白になりがちでした。英語力の不足は、情報伝達だけでなく、現地メンバーとの関係づくりやマネジメントにも影響すると感じました。",
      ],
    },
    {
      id: "how-i-improved",
      heading: "資料、簡単な単語、瞬間英作文で伝え方を補った",
      lead: "難しい表現を覚えるより、準備と伝わる言葉を優先しました。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "01", title: "資料を先に作る", body: "口頭だけに頼らず、会議や説明の前に準備する" },
            { label: "02", title: "簡単な単語へ置き換える", body: "難しい表現を避け、短く分かりやすく伝える" },
            { label: "03", title: "瞬間英作文を練習する", body: "言いたいことを出す反応速度を重点的に鍛える" },
          ],
        },
      ],
      paragraphs: [
        "約2.5年後には、会議、部下への指示、メールに自信がつき、多少の雑談もできるようになりました。TOEICは受け直して最高780点になりました。一方で、難しい表現や気の利いた表現は、最後まで簡単ではありませんでした。",
      ],
    },
    {
      id: "interview",
      heading: "技術面接では確認なし、人事面接で即興の英語面接を求められた",
      lead: "応募時のレジュメにはTOEIC780点と、海外工場でローカル人材を面接した経験を記載しました。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "求人票", body: "英語は必須要件ではなかった" },
            { label: "02", title: "技術部門の面接", body: "英語に関する話題は出なかった" },
            { label: "03", title: "人事部門の面接", body: "英語で面接官役を試すよう求められた" },
          ],
        },
      ],
      paragraphs: [
        "人事から求められ、英語で「自己紹介をしてください」と伝えました。その後の質問を即興で続けることは難しく、海外工場での採用面接は事前に英語で準備して行っていたと正直に説明しました。人事の反応は「分かりました」程度で、強く追及されることはありませんでした。",
        "TOEICの証明書提出は求められず、スコアは自己申告でした。採用側から明言はありませんが、私はTOEICの点数より、海外工場で英語を使って仕事をした実務経験の方が評価につながったと感じています。",
      ],
    },
    {
      id: "how-to-decide",
      heading: "英語要件は、部門とポジションごとに確認する",
      lead: "外資系という理由だけで応募を諦める必要はありません。反対に、英語が不要だと決めつけることもできません。",
      blocks: [
        {
          type: "note",
          title: "求人票だけで分からなければ、実態を聞く",
          body: "Business levelやFluentなどの記載がある場合は、会議、メール、顧客対応、海外拠点との連携のうち、どこでどの程度使うのかを転職エージェントへ確認します。",
        },
        {
          type: "quote",
          quote: "英語が不安だから、と外資を全く選択肢に入れないのはもったいないよ。",
          caption: "過去の自分と、応募を迷っている人へ",
        },
      ],
      paragraphs: [
        "英語が不安なら、まずは英語の使用量が比較的少ない部門やポジションから狙い、実務の中で伸ばす方法もあります。使える場面が増えれば、将来応募できるポジションも増えます。",
        "これは私が受けた一つの選考と海外勤務の経験です。必要な英語力は会社、部門、職種、顧客によって変わります。応募前に最新の求人票と実際の使用場面を確認してください。",
      ],
    },
  ],
  todayQuest: "求人票の英語要件を「必須・歓迎・記載なし」に分け、実際の使用場面を確認する",
  relatedGuideSlugs: ["electronics-to-semiconductor-process-engineer", "semiconductor-career-start"],
  relatedCompanyIds: ["asml", "applied-materials", "lam-research"],
};
