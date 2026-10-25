export const careerCompassEntry = {
  heading: "今の経験は、半導体のどんな仕事につながる？",
  description: "今の仕事内容と実績から、接点のある半導体職種と、次に準備することを整理します。",
  example: [
    { label: "経験の例", value: "生産技術で、歩留まり改善を担当" },
    { label: "接点のある職種の例", value: "プロセスエンジニア" },
    { label: "次の準備の例", value: "改善実績を、課題・行動・結果の3行にまとめる" },
  ],
  note: "説明用の一例です。整理結果は回答によって変わります",
  conditions: "12問・約3分・登録不要。回答は保存しません",
  variant: "preview_entry_v1",
  placements: {
    ranking: {
      sourcePage: "/guides/semiconductor-market-cap-ranking",
      ctaLocation: "ranking_after_comparison",
      buttonLabel: "自分の経験で確かめる",
    },
    intro: {
      sourcePage: "/career-compass",
      ctaLocation: "career_compass_intro",
      buttonLabel: "自分の経験を整理する（12問）",
    },
  },
} as const;
