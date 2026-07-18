import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCareerEnglishLevelGuide: GuideArticle = {
  slug: "semiconductor-career-english-level",
  title: "外資系半導体への転職に英語力はどこまで必要？",
  description: "TOEIC約600点・会話経験ほぼなしで海外勤務を始めたRYOが、2.5年の実務と外資系半導体企業のRFフィルタ事業にあるポジションの選考で、実際に確認された英語力を振り返ります。",
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
    "外資系半導体企業のRFフィルタ事業にあるポジションの技術面接・人事面接を受け、オファーを得た経験",
  ],
  publishedAt: "2026-07-13",
  updatedAt: "2026-07-19",
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
        { label: "03", title: "外資系RFフィルタ事業へ", body: "TOEIC 780点を記載し、英語確認を含む選考へ" },
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
      ],
      paragraphs: [
        "私が応募した外資系半導体企業のRFフィルタ事業にあるポジションには、英語がmustとは書かれていませんでした。Business levelやFluentなどの記載もなかったため、英語力を理由に応募を迷うことはありませんでした。",
        "表はASML Japanの公開求人を比べたもので、私の転職先ではありません。同じ会社でもTOEIC 600超、700以上、800以上かつ流暢など、職種によって記載が違います。私は点数だけでなく、会議、技術議論、顧客対応のどこで英語を使うのかまで見るようにしています。",
      ],
    },
    {
      id: "starting-point",
      heading: "TOEIC約600点、会話経験ほぼなしで海外勤務を始めた",
      lead: "英語がまったく分からない状態ではありませんでしたが、すぐに会話できる自信はありませんでした。",
      paragraphs: [
        "海外勤務を始める前のTOEICは600点くらいでした。英語で話した経験はほとんどなく、メールや資料も時間をかければ多少読める程度です。まったく分からないわけではない。でも、すぐ仕事で話せる自信はありませんでした。",
        "海外工場では約2.5年働きました。勤務地はマレーシアとシンガポールです。英語での会話はほぼ毎日、会議は週1回ほどありました。ただ、日本人もいたので、日本語に頼っていた部分もあります。一人で黙々と作業し、ほとんど話さない日もありました。",
      ],
    },
    {
      id: "english-at-work",
      heading: "会議、指示、メール、Python勉強会で英語を使った",
      lead: "日常会話だけではなく、現地メンバーと仕事を進めるために英語を使いました。",
      paragraphs: [
        "現地メンバーとの会議、メール、説明資料、部下への指示で英語を使いました。Python勉強会を開き、英語で進行したこともあります。ローカル人材を採用したときは、自分が面接官を担当しました。",
        "ただし、その場で何でも話せたわけではありません。採用面接では、質問と進行を事前にかなり準備してから臨みました。",
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
      ],
      paragraphs: [
        "相手にゆっくり話してもらえば、思っていたより聞き取れました。難しかったのは、自分の言いたいことをすぐ英語にすることです。必要な指示はできても会話は淡白になり、雑談を広げるのも苦手でした。部下への指導では、細かなニュアンスまで伝わったか、いつも不安でした。",
      ],
    },
    {
      id: "how-i-improved",
      heading: "資料、簡単な単語、瞬間英作文で伝え方を補った",
      lead: "難しい表現を覚えるより、準備と伝わる言葉を優先しました。",
      paragraphs: [
        "会議や説明の前には資料を作り、口頭だけで伝えようとしませんでした。難しい単語を使わず、知っている簡単な言葉へ置き換えました。家では、言いたいことをすぐ出せるように瞬間英作文を重点的に練習しました。",
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
        "少なくとも私は、外資系という名前だけで応募を迷いませんでした。求人票を見て、分からなければエージェントに聞く。そのうえで自分にできる仕事かを考えればよいと思います。",
      ],
    },
  ],
  todayQuest: "求人票の英語要件を「必須・歓迎・記載なし」に分け、実際の使用場面を確認する",
  relatedGuideSlugs: ["electronics-to-semiconductor-process-engineer", "semiconductor-career-start"],
  relatedCompanyIds: ["asml", "applied-materials", "lam-research"],
};
