export type SalaryMethodologySource = {
  title: string;
  publisher: string;
  url: string;
};

export const salaryMethodology = {
  updatedAt: "2026-07-13",
  calculationSteps: [
    "現在の職種カテゴリから、品質、生産技術、設備、設計、技術営業・FAE、未経験の6つの固定参考帯のいずれかを表示します。",
    "厚生労働省の職業別賃金統計、転職市場の募集時年収、半導体関連職の公開求人データを比較し、近い職種へ移る場合の下限と、関連経験が評価される場合の上限を編集しています。",
    "「経験を補った場合」は、半導体実務、改善実績、専門スキル、英語・顧客対応などを積んだ後に対象求人が広がる可能性を示す参考帯です。一定期間後の昇給額を計算したものではありません。",
    "入力した現在年収は参考レンジの算出には使わず、現在年収帯との差分表示にだけ使用します。",
  ],
  compensationNote:
    "情報源ごとに年収の定義が異なるため、額面年収の大まかな相場として扱っています。残業代、賞与、手当、株式報酬などは個別に加算していません。実際の提示額は企業、職位、勤務地、経験、選考評価によって変わります。",
  sources: [
    {
      title: "半導体技術者",
      publisher: "厚生労働省 job tag",
      url: "https://shigoto.mhlw.go.jp/Occupation/Detail?occupationId=267",
    },
    {
      title: "生産・品質管理技術者",
      publisher: "厚生労働省 job tag",
      url: "https://shigoto.mhlw.go.jp/User/Occupation/Detail/296",
    },
    {
      title: "機械設計技術者",
      publisher: "厚生労働省 job tag",
      url: "https://shigoto.mhlw.go.jp/User/Occupation/Detail/262",
    },
    {
      title: "転職賃金相場2025",
      publisher: "一般社団法人人材サービス産業協議会",
      url: "https://j-hr.or.jp/wage/34755/",
    },
    {
      title: "半導体プロセスエンジニアの転職動向・想定平均年収",
      publisher: "JAC Recruitment",
      url: "https://www.jac-recruitment.jp/market/manufacture/semiconductor/process-engineer/",
    },
  ] satisfies SalaryMethodologySource[],
};
