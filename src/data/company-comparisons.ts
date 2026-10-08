import { companies } from "@/data/companies";
import { companyResearch } from "@/data/company-research";
import type { Source } from "@/types/content";
import { normalizeCompanyComparison } from "@/lib/format";

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
    companies: Array<{ companyId: string; facts: string; sources: Source[]; sourceScope?: string }>;
    questions: Array<{ label: string; body: string }>;
  };
};

type PairContext = { slug: string; meaning: string; difference: string; align: string; question: string };
const pairContexts: PairContext[] = [
  { slug: "tsmc-vs-micron", meaning: "半導体を量産する仕事を、受託製造とメモリ製品の両側から調べる比較です。", difference: "TSMCは顧客設計を製造するファウンドリ、MicronはDRAM・NANDなどのメモリ製品を扱います。製造技術という共通点があっても、対象デバイスと顧客の関係は異なります。", align: "ロジックとメモリの製品差に加え、工程開発か量産維持か、同じ業務段階をそろえて確認します。", question: "担当する工程は何か。条件を作る仕事と、量産のばらつきを減らす仕事の比重はどうか。" },
  { slug: "tsmc-vs-tokyo-electron", meaning: "工場で半導体を作る側と、工場に装置を提供する側の役割を比べます。設備・プロセス経験をどちらへつなげるか考える入口です。", difference: "TSMCは受託製造、東京エレクトロンは製造工程を支える装置を扱います。加工条件を使う側と、装置・プロセスを提供する側という違いがあります。", align: "同じ工程を対象にし、工場内の設備維持、装置開発、顧客工場でのサービスを区別します。", question: "自社工場と顧客工場のどちらで働くのか。装置停止時にどこまで自分で判断するのか。" },
  { slug: "tokyo-electron-vs-screen", meaning: "洗浄など接点のある装置領域で、担当製品の広がりと仕事内容を研究する比較です。", difference: "東京エレクトロンは成膜・エッチングを含む複数工程の装置、SCREENは洗浄・塗布現像・熱処理などの装置を紹介しています。会社全体の広がりと配属先の装置は分けます。", align: "洗浄同士など同じ工程で比べ、開発・評価・立ち上げ・保守の業務をそろえます。", question: "対象の洗浄方式と装置は何か。機械・電気の設計か、薬液や処理条件の評価か。" },
  { slug: "tokyo-electron-vs-applied-materials", meaning: "複数工程を扱う装置メーカーで、成膜や材料加工の経験がどの製品に接続するかを調べます。", difference: "東京エレクトロンの塗布・現像、成膜、エッチング等と、Applied Materialsの成膜、材料除去、材料特性変更、検査・計測等を対照します。製品領域は重なりますが一対一ではありません。", align: "会社全体の装置数より、担当膜・加工方式・測定指標が一致する求人を確認します。", question: "装置の開発、顧客向け評価、保守のどこを担当するか。改善実績をどの測定指標で示せるか。" },
  { slug: "applied-materials-vs-lam-research", meaning: "成膜・エッチングに接点がある2社で、材料加工と装置対応の経験を具体的な製品へ結び付ける比較です。", difference: "Applied Materialsは材料の成膜・除去・特性変更・分析を紹介し、Lam Researchは成膜・エッチング・剥離洗浄などに製品を分類しています。共通する工程の中で、装置方式と担当材料を見ます。", align: "成膜同士、エッチング同士でそろえます。顧客サービス職とプロセス開発職を同じ条件として比べないようにします。", question: "担当装置の加工方式と材料は何か。復旧対応とプロセス評価のどちらが中心か。" },
  { slug: "advantest-vs-teradyne", meaning: "電気評価・テストソフトの経験から、半導体テスト装置の仕事を研究する比較です。", difference: "両社とも半導体テストを扱います。アドバンテストのSoC・メモリテストと周辺機器、Teradyneのデジタル・ミックスドシグナルなどのテスト製品を、対象デバイス別に対照します。", align: "SoC、メモリ、アナログなどテスト対象をそろえ、テスタ本体と搬送・接続機器を分けます。", question: "テストプログラムを作る仕事か、装置を保守する仕事か。測定精度とテスト時間のどちらの改善が求められるか。" },
  { slug: "renesas-vs-rohm", meaning: "機器制御・回路・電源の経験を、半導体製品の用途へ結び付ける比較です。", difference: "ルネサスのマイコン・プロセッサやアナログ製品と、ロームのパワー半導体・アナログICを対照します。制御用のソフトと電力を扱う回路では、実績の説明軸が変わります。", align: "アナログ同士、電源同士など用途をそろえ、回路開発、アプリケーション支援、品質を区別します。", question: "顧客機器の制御ソフトまで扱うか。回路評価、熱・電力評価、顧客品質のどこに経験を使えるか。" },
  { slug: "infineon-vs-onsemi", meaning: "電力変換やセンサーに関わる経験を、製品機能ごとに研究する比較です。", difference: "Infineonはパワー・マイコン・センサーなど、onsemiはパワーマネジメント・イメージセンサーなどを紹介しています。共通する電源領域と、制御・画像などの対象の違いを切り分けます。", align: "パワー同士なら用途・電圧・材料、センサー同士なら検知する量を合わせます。", question: "電源・制御・画像のどの製品を担当するか。評価対象は回路の効率、信頼性、信号品質のどれか。" },
  { slug: "nvidia-vs-amd", meaning: "AI・計算分野で、ハードウェア、ソフトウェア、顧客支援のどこに接点があるかを調べる比較です。", difference: "NVIDIAはアクセラレーテッドコンピューティングとAIを中心に紹介し、AMDはCPU・GPU・AIアクセラレータ・組み込み製品を案内しています。AIという共通語だけで担当製品やソフト環境を同一視しないようにします。", align: "データセンター、PC、組み込みなど用途をそろえます。製品性能の比較と、応募する職種の比較を分けます。", question: "開発するソフト環境と対象ハードは何か。自分の実績は実装、性能評価、顧客の導入支援のどれに近いか。" },
  { slug: "qualcomm-vs-qorvo", meaning: "通信製品を、システム側のプラットフォームと無線信号を扱う部品側から調べる比較です。", difference: "Qualcommはモバイル・車載・IoTなどのプラットフォーム、Qorvoは増幅器・RF制御などの部品を紹介しています。端末全体の機能と無線部品の特性では、評価する単位が異なります。", align: "通信規格・用途をそろえ、システムのソフト評価と部品の電気特性評価を区別します。", question: "端末全体の動作を扱うか、無線部品の特性を扱うか。顧客への提案ではどの評価結果を説明するか。" },
  { slug: "analog-devices-vs-texas-instruments", meaning: "アナログ回路・測定・組み込みの経験から、扱う信号と製品を研究する比較です。", difference: "Analog Devicesのデータ変換という入口と、TIのアナログ・組み込み処理という入口を対照します。両社のアナログ製品をひとまとめにせず、計測信号、電源、制御のどこを担う部品かを確認します。", align: "変換精度、電源効率、制御処理など用途別にそろえます。製品範囲全体の優劣はこのページでは評価しません。", question: "センサー信号、電源、組み込み制御のどれを扱うか。回路設計と顧客向け技術支援の境界はどこか。" },
  { slug: "disco-vs-lasertec", meaning: "同じ半導体装置でも、加工する仕事と欠陥・寸法を測る仕事の違いを研究する比較です。", difference: "ディスコは切断・薄化・研磨、レーザーテックはマスクやウェーハの検査・計測を扱います。加工品質を作り込む側と、その状態を捉える側という役割の違いがあります。", align: "加工対象と検査対象を先に確認します。加工条件の改善と画像・光学・計測の開発を同じ仕事とみなさないようにします。", question: "切断品質や厚さを改善する仕事か、欠陥の検出や測定を改善する仕事か。保守職でも担当装置の原理はどう違うか。" },
  { slug: "nikon-vs-canon", meaning: "光学・精密機械・制御の経験から、半導体露光装置という事業に絞って研究する比較です。", difference: "ニコンの一覧にはArF液浸などの光学露光装置があり、キヤノンは露光装置とともにナノインプリント技術を案内しています。光による露光と型を使う転写では原理が異なります。各社の製品全体をこの例だけで分類せず、担当装置を特定します。", align: "同じ露光用途・装置方式をそろえます。方式が違う製品の精度や生産性は条件なしに横並びにできません。", question: "担当製品の露光方式は何か。光学設計、精密機構、制御、顧客対応のどこを担うか。" },
  { slug: "onsemi-vs-renesas", meaning: "パワー・センサーとマイコン・アナログの接点を、機器の中で担う役割から研究する比較です。", difference: "onsemiのパワーマネジメント・画像検知と、ルネサスのマイコン・アナログを対照します。電力・検知・制御のどれを担うかで経験の説明が変わります。", align: "同じ用途で、電源、信号処理、制御の担当範囲をそろえます。", question: "機器のどの機能を担当するか。ハードウェア評価と組み込みソフトの比重はどうか。" },
  { slug: "tsmc-vs-samsung-electronics", meaning: "半導体の受託製造を研究する際に、会社全体とファウンドリ事業の違いを整理する比較です。", difference: "TSMCはファウンドリ、Samsung Semiconductorはメモリ・System LSI・ファウンドリを紹介しています。Samsungのメモリ情報をファウンドリの仕事内容に読み替えないことが大切です。", align: "受託製造同士の比較ならファウンドリ事業に範囲を限定し、工程・地域・配属法人をそろえます。", question: "ファウンドリ、メモリ、System LSIのどの事業か。担当工程と顧客設計への対応範囲は何か。" },
];

function researchedProfile(context: PairContext): CompanyComparisonProfile {
  const ids = context.slug.split("-vs-");
  const names = ids.map(id => companies.find(company => company.id === id)!.nameJa).join("と");
  return {
    slug: context.slug, title: `${names}の違い｜事業・製品と仕事の確認ポイント`,
    description: `${names}を比較する意味、主な事業・製品の違い、条件をそろえて確認する質問を整理します。公式情報と編集上の提案を分けて掲載。`,
    heading: `${names}の違い`, lead: "製品と担当する仕事の範囲をそろえて比べます。企業の優劣や採用可能性の判定ではなく、企業研究で次に確かめる点を整理するページです。",
    summaryHeading: "主な違いと比較する範囲", summary: context.difference,
    highlights: [
      { label: "比較する意味", title: "経験をどの役割へつなげるか", body: context.meaning },
      { label: "条件をそろえる", title: "製品と担当業務を特定する", body: context.align },
      { label: "比較の限界", title: "待遇・募集条件は個別求人で確認", body: "製品情報は現在の募集を示しません。年収、働き方、英語要件、採用可能性は、同じ職種・地域・雇用法人の求人票や面接で確認します。" },
    ],
    research: {
      updatedAt: "2026-10-08",
      companies: ids.map(companyId => ({ companyId, facts: companyResearch[companyId].facts, sources: [companyResearch[companyId].source], sourceScope: companyResearch[companyId].sourceScope })),
      questions: [
        { label: "担当業務", body: context.question },
        { label: "比較条件", body: context.align },
        { label: "勤務・応募条件", body: "日本で応募する雇用法人・勤務地・職位をそろえ、英語を使う場面、出張、勤務時間、必須・歓迎要件を個別に照合する。事業の広さから募集数や難易度を推定しない。" },
      ],
    },
  };
}

const companyComparisonProfiles: CompanyComparisonProfile[] = [
  ...pairContexts.map(researchedProfile),
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
  const normalized = normalizeCompanyComparison(slug);
  return normalized ? companyComparisonProfiles.find((profile) => profile.slug === normalized.slug) : undefined;
}

// Comparison quality is independent of either company's career-page status.
export function isComparisonIndexable(slug: string) {
  const profile = getCompanyComparisonProfile(slug);
  const comparison = normalizeCompanyComparison(slug);
  if (!comparison || !profile?.research) return false;
  const researchIds = profile.research.companies.map(entry => entry.companyId);
  return Boolean(profile.summary && profile.highlights.length >= 3 && profile.research.questions.length >= 3 &&
    researchIds.length === 2 && new Set(researchIds).size === 2 && comparison.companies.every(company => researchIds.includes(company.id)) &&
    profile.research.companies.every(entry => entry.facts && entry.sources.length > 0 && entry.sources.every(source => source.url && source.accessedAt)));
}
