export type CompanyComparisonProfile = {
  slug: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  summaryHeading: string;
  summary: string;
  highlights: Array<{
    label: string;
    title: string;
    body: string;
  }>;
};

const companyComparisonProfiles: CompanyComparisonProfile[] = [
  {
    slug: "asml-vs-tokyo-electron",
    title: "ASMLと東京エレクトロンの違い｜製品・職種を比較",
    description:
      "ASMLと東京エレクトロンの違いを、主力製品、職種、英語、キャリア準備の観点で比較。ASMLはEUV・DUV露光装置、東京エレクトロンは成膜・エッチング・洗浄装置などを扱います。",
    heading: "ASMLと東京エレクトロンの違い｜製品・職種を比較",
    lead:
      "同じ半導体製造装置メーカーでも、中心となる装置領域は異なります。製品、職種、英語、キャリア準備の順に違いを整理します。",
    summaryHeading: "ASMLと東京エレクトロンの違いを先に整理",
    summary:
      "ASMLはEUV・DUV露光装置を中心に扱い、東京エレクトロンは成膜、エッチング、洗浄、テストシステムなど複数工程の装置を扱います。会社の知名度だけで横並びにせず、自分の経験と接点がある装置・職種をそろえて比べることが大切です。",
    highlights: [
      {
        label: "ASML",
        title: "露光装置が中心",
        body: "EUV・DUV露光装置とリソグラフィ関連サービスが主な製品領域です。精密装置、光学、機械、電気、フィールドサービスの経験との接点を確認します。",
      },
      {
        label: "東京エレクトロン",
        title: "複数工程の装置を展開",
        body: "成膜、エッチング、洗浄、テストシステムなどが主な製品領域です。装置開発、プロセス、フィールド、生産技術、品質などの職種を確認します。",
      },
      {
        label: "比較のポイント",
        title: "工程と仕事内容をそろえる",
        body: "まず担当する半導体工程と装置を確認し、そのうえで勤務地、募集職種、英語を使う場面、準備したい経験を比較します。",
      },
    ],
  },
];

export function getCompanyComparisonProfile(slug: string) {
  return companyComparisonProfiles.find((profile) => profile.slug === slug);
}
