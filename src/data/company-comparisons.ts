import type { Source } from "@/types/content";

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
  research?: {
    updatedAt: string;
    companies: Array<{ companyId: string; facts: string; sources: Source[] }>;
    questions: Array<{ label: string; body: string }>;
  };
};

const companyComparisonProfiles: CompanyComparisonProfile[] = [
  {
    slug: "asml-vs-tokyo-electron",
    title: "ASMLと東京エレクトロンの違い【2026年版】装置・職種を比較",
    description:
      "半導体製造装置メーカーを調べる人向けに、ASMLと東京エレクトロンの違いを比較表で整理。露光、成膜・エッチング・洗浄などの装置領域、職種、日本拠点、英語、準備ポイントが分かります。",
    heading: "ASMLと東京エレクトロンの違い｜装置・職種を比較",
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
    research: {
      updatedAt: "2026-09-06",
      companies: [
        {
          companyId: "asml",
          facts: "ASMLの日本向け採用情報では、露光装置の納入・据付・保守とカスタマーサポートを紹介しています。東京本社のほか、広島、熊本、長崎、鶴岡、四日市、北上のオフィスを掲載しています。",
          sources: [{ title: "日本で働く・カスタマーサポートと拠点", url: "https://www.asml.com/en/careers/working-at-asml/japan", publisher: "ASML", accessedAt: "2026-09-06" }],
        },
        {
          companyId: "tokyo-electron",
          facts: "東京エレクトロンの職種紹介には、開発・設計、プロセス、フィールドなどがあります。グループ会社ごとに開発・製造・装置の立ち上げや調整などの役割が異なるため、採用法人も確認します。職種紹介は新卒向けの説明で、現在の中途募集を示すものではありません。",
          sources: [
            { title: "職種一覧（新卒採用・仕事内容の参考）", url: "https://tel-special.com/job/", publisher: "東京エレクトロン", accessedAt: "2026-09-06" },
            { title: "グループ会社と事業内容", url: "https://www.tel.co.jp/about/locations/", publisher: "東京エレクトロン", accessedAt: "2026-09-06" },
          ],
        },
      ],
      questions: [
        { label: "仕事内容", body: "開発・プロセス評価・顧客工場での据付や保守のうち、どこを担当する求人か。自分が経験した装置・工程と接点があるか。" },
        { label: "日本の勤務地", body: "雇用法人、配属拠点、実際に働く顧客工場はどこか。転勤・長期出張の範囲はどうか。オフィスの存在だけで勤務地を決めない。" },
        { label: "英語", body: "応募条件の語学要件に加え、技術資料、海外への問い合わせ、会議、研修のどこで英語を使うか。会社名だけで必要水準を決めない。" },
        { label: "勤務形態", body: "日勤・交替勤務、休日の対応、待機当番、出張頻度を個別求人で確認する。フィールド職でも担当顧客や契約によって違うかを質問する。" },
      ],
    },
  },
  {
    slug: "micron-vs-kioxia",
    title: "マイクロンとキオクシアの違い｜メモリ・日本拠点・仕事の確認ポイント",
    description: "マイクロンとキオクシアを、メモリ事業と日本の拠点から比較。仕事内容、勤務地、英語、勤務形態について、公式情報で分かることと個別求人で確認することを整理します。",
    heading: "マイクロンとキオクシアの違い｜日本の拠点と仕事から比較",
    lead: "同じメモリ関連企業でも、担当する製品・工程・拠点をそろえて比較する必要があります。会社全体の事業と、日本で応募する仕事を分けて確認します。",
    summaryHeading: "日本の製造拠点で、何を担当するかを比べる",
    summary: "マイクロンの広島拠点はDRAMの開発・製造、キオクシアの四日市工場はフラッシュメモリの製造を担います。製品の違いに加えて、応募職種の工程・設備・改善業務と自分の経験の接点を確認します。",
    highlights: [
      { label: "マイクロン", title: "広島のDRAM開発・製造", body: "広島工場・技術開発拠点と、個別求人の担当業務を確認します。" },
      { label: "キオクシア", title: "フラッシュメモリの製造", body: "四日市と、グループ会社であるキオクシア岩手の北上工場を区別して確認します。" },
      { label: "比較のポイント", title: "会社平均より応募職種", body: "同じ職種名でも、工程、勤務形態、雇用法人、英語を使う場面をそろえて比べます。" },
    ],
    research: {
      updatedAt: "2026-09-06",
      companies: [
        {
          companyId: "micron",
          facts: "マイクロンはDRAM・NAND・NORなどを扱い、日本の広島拠点ではDRAMの開発・製造を行っています。企業の製品ラインアップすべてが、日本の各拠点の担当製品という意味ではありません。",
          sources: [
            { title: "会社概要・製品領域", url: "https://jp.micron.com/about/company/corporate-profile", publisher: "Micron Technology", accessedAt: "2026-09-06" },
            { title: "広島工場とDRAM技術", url: "https://jp.micron.com/about/press/news/micron-breaks-ground-on-hiroshima-cleanroom-to-support-advanced-memory-for-ai", publisher: "Micron Technology", accessedAt: "2026-09-06" },
            { title: "日本・広島の拠点", url: "https://jp.micron.com/about/locations?city=Hiroshima&country=Japan", publisher: "Micron Technology", accessedAt: "2026-09-06" },
          ],
        },
        {
          companyId: "kioxia",
          facts: "キオクシアは四日市工場でフラッシュメモリを製造しています。公式採用案内では、北上工場を運営するキオクシア岩手の採用情報をグループ会社として別に案内しています。",
          sources: [
            { title: "四日市工場", url: "https://www.kioxia.com/ja-jp/about/yokkaichi.html", publisher: "キオクシア", accessedAt: "2026-09-06" },
            { title: "採用情報・グループ会社", url: "https://www.kioxia.com/ja-jp/job.html", publisher: "キオクシア", accessedAt: "2026-09-06" },
          ],
        },
      ],
      questions: [
        { label: "仕事内容", body: "プロセス、設備、品質、開発のどの業務か。製品・担当工程、改善と量産対応の比重、自分の判断範囲を確認する。" },
        { label: "日本の勤務地", body: "広島、四日市、北上などの拠点情報と、応募先の雇用法人・配属地を照合する。初期配属と将来の転勤範囲は別に質問する。" },
        { label: "英語", body: "求人に書かれた必須・歓迎要件と、実際の会議・資料・海外拠点との連携で使う英語を分けて確認する。" },
        { label: "勤務形態", body: "技術職と製造オペレーターを混同せず、交替勤務、夜間・休日対応、出張、研修期間中の勤務を応募職種ごとに確認する。" },
      ],
    },
  },
];

export function getCompanyComparisonProfile(slug: string) {
  return companyComparisonProfiles.find((profile) => profile.slug === slug);
}
