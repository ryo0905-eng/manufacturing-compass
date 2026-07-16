import type { GuideArticle } from "@/content/guides/types";

export const appliedMaterialsSemiconductorEquipmentGuide: GuideArticle = {
  slug: "applied-materials-semiconductor-equipment",
  title: "アプライドマテリアルズとは？半導体製造装置と担当工程を初心者向けに図解",
  description:
    "アプライドマテリアルズは、成膜、エッチング、CMP、イオン注入、熱処理、検査・計測などを扱う半導体製造装置企業です。何を作る会社か、工程別の製品領域、特徴の調べ方、日本法人の役割を図解します。",
  targetQuery: "アプライドマテリアルズ 何の会社",
  searchIntent:
    "アプライドマテリアルズが何を作る会社か、半導体製造工程のどこへ装置を提供するか、製品ポートフォリオの特徴、日本法人の役割を理解したい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Search Consoleに表示された『アプライドマテリアルズ 強み』などのクエリを起点に、同社の公式製品情報、日本法人ページ、2025年年次報告書で担当工程と事業範囲を照合しました。市場シェアや転職先としての優劣は評価しません。",
  showCareerCtas: false,
  experienceBasis: [
    "Search Consoleに『アプライドマテリアルズ 強み』『アプライド マテリアルズ ジャパン』などの検索クエリが表示されたことを確認",
    "既存の企業詳細ページとは分け、この記事では半導体製造工程と製品ポートフォリオの理解へ焦点を設定",
    "Applied Materialsの公式製品ページ、日本法人情報、2025年年次報告書で装置・サービス領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Semiconductor Products",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Create: Materials Deposition",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/create.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Shape: Materials Removal",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/shape.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Modify: Materials Modification",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/modify.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Analyze: Materials Analysis",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/analyze.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Applied Materials Japan",
      url: "https://www.appliedmaterials.com/jp/ja/about/japan-overview.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Applied Materials 2025 Annual Report",
      url: "https://ir.appliedmaterials.com/static-files/af599bc7-92ed-4bfa-8efe-9ddef39642b4",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約13分",
  intro: {
    problem:
      "アプライドマテリアルズという社名を見ても、半導体メーカーなのか、成膜装置だけを作る会社なのか、東京エレクトロンやLam Researchと何が違うのか分かりにくくありませんか。",
    conclusion:
      "アプライドマテリアルズは、半導体チップそのものではなく、材料を作る、形を加工する、性質を変える、状態を測るための製造装置と、装置を支えるサービス・ソフトウェアを提供する企業です。特徴は一製品の順位ではなく、製造工程をまたぐ製品範囲から理解します。",
    learnings:
      "アプライドマテリアルズが何をする会社か、工程別の製品領域、Semiconductor SystemsとApplied Global Servicesの違い、製品ポートフォリオの見方、日本法人の役割、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "Search Consoleに『アプライドマテリアルズ 強み』が出てきました。強みを一言で決めるより、まず公式情報にある装置を製造工程へ並べると、この会社の特徴を自分で判断しやすくなります。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "図解｜材料を作る・形を作る・性質を変える・測る",
      description:
        "Applied Materialsの公式製品分類を、初心者が製造工程へ置きやすいように整理しています。実際の工程では洗浄や搬送を挟み、各工程を何度も繰り返します。",
      stages: [
        { label: "01 / CREATE", title: "材料を作る", body: "ALD、CVD、PVD、エピタキシーなどで導体・絶縁体・半導体の薄膜を形成する" },
        { label: "02 / SHAPE", title: "形を作る", body: "エッチング、CMP、選択的除去などで必要な形状と平坦な表面を作る" },
        { label: "03 / MODIFY", title: "性質を変える", body: "イオン注入と熱処理などで材料の電気的・物理的な性質を整える" },
        { label: "04 / ANALYZE", title: "状態を測る", body: "欠陥検査と計測で材料、パターン、工程変動を確認する" },
        { label: "05 / SUPPORT", title: "工場を支える", body: "保守、部品、改造、サービス、ファクトリーソフトウェアで装置と生産性を支える" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "知りたいこと",
      rightLabel: "先に見る公式情報",
      rows: [
        { left: "何を作る会社か", right: "半導体製品ページでCreate・Shape・Modify・Analyzeの装置領域を見る" },
        { left: "何が特徴か", right: "個別製品ではなく、複数工程をまたぐ製品群と統合ソリューションの範囲を見る" },
        { left: "どう収益化するか", right: "Semiconductor SystemsとApplied Global Servicesの事業説明を分けて読む" },
        { left: "日本で何をするか", right: "日本法人ページで装置、技術支援、サービス、ソフトウェア、工場支援を見る" },
        { left: "競合はどこか", right: "会社全体ではなく、成膜・エッチング・CMP・検査など製品カテゴリーごとに確認する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "アプライドマテリアルズは、半導体製造装置とサービスの企業",
      lead: "社名にマテリアルズとありますが、材料そのものだけを販売する会社ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "EQUIPMENT", title: "製造装置", body: "材料を形成・除去・改質・分析するための大型量産装置を開発・製造します。" },
            { label: "PROCESS", title: "材料工学・プロセス", body: "膜、表面、構造、電気特性を原子レベルで制御する工程技術を装置へ組み込みます。" },
            { label: "SERVICE", title: "サービス・ソフトウェア", body: "据付後の保守、部品、改造、装置・工場の生産性改善、ファクトリーソフトウェアを提供します。" },
          ],
        },
        {
          type: "note",
          title: "半導体チップメーカーとは役割が違う",
          body: "ファウンドリやIDMが複数企業の装置、材料、レシピを組み合わせてチップを製造します。Applied Materialsは、その製造手段となる装置・プロセス技術・サービスを供給します。",
        },
      ],
      paragraphs: [
        "公式製品ページは、装置がウェーハ表面へ材料層を形成し、材料を加工・除去し、性質を変え、材料とデバイスを分析すると説明しています。半導体製造の一工程だけでなく、前工程と先端パッケージに関わる複数の装置領域を持ちます。",
        "装置メーカーとして見るときは、装置本体、プロセス技術、量産立上げ、保守、部品、ソフトウェアを一つの事業の流れとして捉えると分かりやすくなります。",
      ],
    },
    {
      id: "create",
      heading: "Create｜成膜装置で、必要な材料層を作る",
      lead: "トランジスタ、配線、絶縁、保護などに使う薄膜を形成する領域です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "成膜技術",
          rightLabel: "主な役割",
          rows: [
            { left: "ALD", right: "原料の交互供給と表面反応を繰り返し、極薄膜の膜厚と複雑形状への被覆を制御する" },
            { left: "CVD", right: "気体原料を熱やプラズマで反応させ、導体・絶縁体・半導体などの膜を形成する" },
            { left: "PVD", right: "真空中で固体材料から原子を放出し、金属などの薄膜を形成する" },
            { left: "エピタキシー", right: "基板の結晶配列に沿って結晶層を成長し、トランジスタやパワー半導体などの材料構造を作る" },
            { left: "選択成膜", right: "表面材料の違いを利用し、必要な領域へ選択的に膜を形成する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "PVD・CVD・ALDの反応メカニズムを見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "成膜装置の構成と主要企業を見る" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは材料形成の製品群としてALD、CVD、PVD、エピタキシー、選択成膜などを案内しています。『成膜装置メーカー』という理解は正しい一方、同社の製品範囲は成膜だけではありません。",
        "成膜製品を比較する場合は方式名だけでなく、対象膜、デバイス、前工程・後工程、研究開発・量産、単独工程・統合工程を揃えて確認します。",
      ],
    },
    {
      id: "shape-modify",
      heading: "Shape・Modify｜材料の形と性質を変える",
      lead: "膜を作った後は、不要部分を除き、表面を平らにし、必要な電気特性を与えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置領域",
          rightLabel: "製造工程での役割",
          rows: [
            { left: "エッチング", right: "マスクに沿って導体・半導体・絶縁体の不要部分を除き、穴、溝、線などを形成する" },
            { left: "選択的除去", right: "周囲の材料への影響を抑えながら、狙った材料を選択して除去する" },
            { left: "CMP", right: "化学反応と機械的作用を組み合わせ、余分な膜を除いて表面を平坦化する" },
            { left: "イオン注入", right: "加速したイオンをウェーハへ導入し、半導体の電気特性を作り分ける" },
            { left: "熱処理", right: "短時間の加熱などで注入元素の活性化、膜の性質、界面状態を整える" },
          ],
        },
      ],
      paragraphs: [
        "公式製品分類では、ShapeにCMP、エッチング、パターン形成、選択的エッチングなどが置かれ、Modifyにイオン注入と熱処理が置かれています。Applied Materialsを理解するうえでは、材料を加える装置と除く・変える装置の両方を持つ点が重要です。",
        "ただし一つの装置がすべてを行うわけではありません。工程ごとに専用装置があり、ウェーハは成膜、リソグラフィ、エッチング、洗浄、熱処理、CMP、検査などの間を移動します。",
      ],
    },
    {
      id: "analyze",
      heading: "Analyze｜検査・計測で、工程変動を見つける",
      lead: "加工装置だけでなく、材料とパターンの状態を測る装置も製品範囲に含まれます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DEFECT", title: "欠陥を検出する", body: "ウェーハ上の粒子、パターン異常、表面欠陥などを見つけ、位置と特徴を記録します。" },
            { label: "METROLOGY", title: "形状・材料を測る", body: "寸法、膜、形状、材料状態などを測定し、狙いからのずれを確認します。" },
            { label: "FEEDBACK", title: "前工程へ戻す", body: "検査・計測データを成膜、エッチング、CMPなどの条件と結び付け、工程改善へ使います。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・寸法・膜厚・重ね合わせの違いを見る" },
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "平坦化と工程管理を見る" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは材料分析の製品領域として欠陥制御とパターニング制御を案内しています。加工と測定の両方を理解することで、装置単体だけでなく工程全体の材料変化を捉えます。",
        "検査・計測市場には専門企業もあります。企業比較では、検査装置という大分類で終わらず、対象欠陥、測定原理、工程内・工程後、研究開発・量産のどこで使うかを確認します。",
      ],
    },
    {
      id: "business",
      heading: "装置販売とApplied Global Servicesは、役割が違う",
      lead: "製造装置は導入後も長期間使われ、保守と改善が続きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "事業領域",
          rightLabel: "公式報告書で示される主な内容",
          rows: [
            { left: "Semiconductor Systems", right: "成膜、エッチング、熱処理、CMP、検査・計測、ウェーハパッケージ、イオン注入などの半導体製造装置" },
            { left: "Applied Global Services", right: "部品、アップグレード、サービス、装置・工場の生産性改善、ファクトリーオートメーションソフトウェア" },
            { left: "Corporate and Other", right: "年次報告書上、独立した報告セグメントに含まれないディスプレイなどの事業" },
          ],
        },
        {
          type: "note",
          title: "事業区分は更新される",
          body: "この記事は2025年年次報告書の区分を参照しています。組織・報告セグメント・製品の所属は変わるため、財務や事業判断では最新の年次報告書とIRを確認してください。",
        },
      ],
      paragraphs: [
        "2025年年次報告書は、Semiconductor Systemsを半導体チップ製造に使う装置、Applied Global Servicesをサービス、部品、アップグレード、ファクトリーソフトウェアなどの事業として説明しています。",
        "装置メーカーを調べるときは、新規装置だけでなく、既存装置の保守・改造・部品・ソフトウェアが顧客工場の稼働率と生産性をどう支えるかも確認します。",
      ],
    },
    {
      id: "strengths",
      heading: "『強み』は、公式に確認できる特徴と外部評価を分けて考える",
      lead: "企業自身の説明をそのまま順位や優位性へ変換しないことが大切です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PORTFOLIO", title: "工程をまたぐ製品範囲", body: "成膜、除去、改質、分析まで公式製品群が広がっていることを確認できます。" },
            { label: "INTEGRATION", title: "材料工程の統合", body: "複数の材料工程と測定を組み合わせ、工程間の影響をまとめて最適化する考え方を示しています。" },
            { label: "SERVICE", title: "装置導入後の支援", body: "サービス、部品、アップグレード、ソフトウェアを別事業として提供しています。" },
            { label: "MARKETS", title: "対象デバイスの広がり", body: "ロジック、ファウンドリ、メモリ、先端パッケージ、非先端ノードなど複数市場へ装置を提供します。" },
            { label: "COLLABORATION", title: "研究開発と量産の接続", body: "顧客・パートナーとの共同開発や、材料技術を量産装置へ移す取り組みを公式に説明しています。" },
            { label: "VERIFY", title: "数値は同じ定義で確認", body: "シェア、売上、性能を比べる場合は、同じ年・製品分類・地域・調査範囲を揃えます。" },
          ],
        },
      ],
      paragraphs: [
        "公式情報から確認できるのは、製品ポートフォリオと会社が掲げる技術・事業方針です。それが競合より優れているかは、第三者調査、顧客評価、同じ条件の製品データなど別の根拠が必要です。",
        "この記事では『強み』を断定せず、工程をまたぐ製品範囲、統合、サービス、対象市場という企業研究の観点へ分解しています。転職先としての評価は、求人、組織、勤務地、働き方などを別に確認します。",
      ],
    },
    {
      id: "japan",
      heading: "アプライド マテリアルズ ジャパンは、日本の顧客へ装置と技術支援を提供する",
      lead: "グローバル本社の製品を販売するだけでなく、開発・量産工場を支える役割があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "日本法人の接点",
          rightLabel: "公式ページで確認できる内容",
          rows: [
            { left: "装置・技術", right: "半導体・ディスプレイ製造向けの装置と技術を日本の顧客へ提供する" },
            { left: "開発・量産支援", right: "顧客の開発初期から協働し、技術知見を製品・プロセス構築へ反映する" },
            { left: "サービス", right: "システム改善、装置支援、生産性向上へ関わるサービスを提供する" },
            { left: "ソフトウェア・工場支援", right: "自動化ソフトウェアとファブコンサルティングを通じて工場運用を支援する" },
            { left: "グローバル連携", right: "海外の研究開発拠点と連携し、日本の顧客・サプライヤーとの接点を持つ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "Applied Materialsの企業詳細", href: "/companies/applied-materials", description: "企業概要、主な製品、国内拠点、情報源を見る" },
            { label: "半導体製造装置の企業一覧", href: "/segments/equipment", description: "国内外の装置企業を比較する" },
          ],
        },
      ],
      paragraphs: [
        "日本法人の公式ページは、装置・技術に加えてシステム改善、自動化ソフトウェア、ファブコンサルティングを通じ、顧客の開発と量産工場の生産性向上を支援すると説明しています。",
        "具体的な仕事は職種と拠点で変わります。企業研究では、担当装置、顧客先での作業、開発・保守の比重、出張、英語、勤務場所を最新の公式求人で確認します。",
      ],
    },
    {
      id: "roles",
      heading: "アプライドマテリアルズの事業に関わる主な技術職",
      lead: "材料反応から大型装置、顧客工場の稼働まで複数分野がつながります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・技術",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス・アプリケーション", right: "膜、エッチング、CMP、注入、熱処理、検査などを顧客デバイスへ合わせて評価する" },
            { left: "機械・真空・熱設計", right: "チャンバー、搬送、真空、排気、温度、保守構造を設計する" },
            { left: "電気・制御・ソフトウェア", right: "電源、センサー、装置制御、データ収集、診断、自動化を開発する" },
            { left: "製造・品質・サプライチェーン", right: "装置組立、調整、検査、部品品質、変更管理、供給を支える" },
            { left: "フィールドサービス", right: "顧客工場で据付、点検、障害切分け、部品交換、改造、稼働支援を行う" },
            { left: "営業・サービス企画", right: "顧客課題を装置、プロセス、部品、保守、ソフトウェアの提案へつなぐ" },
          ],
        },
      ],
      paragraphs: [
        "会社名だけでは仕事内容は決まりません。成膜、エッチング、CMP、イオン注入、検査など担当製品を確認したうえで、開発、製造、アプリケーション、フィールドのどこに所属するかを見ます。",
        "この記事は転職条件を評価する記事ではありません。応募を検討する場合は、公式求人と面談で担当装置、勤務地、勤務形態、出張、顧客対応、必要な専門知識を確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "アプライドマテリアルズでよくある質問",
      lead: "会社と製品領域の基本を短く整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "アプライドマテリアルズは何の会社ですか？", answer: "半導体やディスプレイの製造に使う装置、プロセス技術、サービス、ソフトウェアを提供する米国本社の企業です。半導体チップそのものを量産するメーカーではありません。" },
            { question: "アプライドマテリアルズは何を作っていますか？", answer: "半導体分野では成膜、エッチング、CMP、イオン注入、熱処理、検査・計測、先端パッケージなどに関わる製造装置を扱います。" },
            { question: "アプライドマテリアルズの特徴は何ですか？", answer: "公式製品情報からは、材料の形成・除去・改質・分析まで複数工程へ製品が広がることと、装置導入後のサービス・部品・ソフトウェア事業を確認できます。競合との優劣には別の根拠が必要です。" },
            { question: "東京エレクトロンやLam Researchとの違いは？", answer: "いずれも複数の半導体製造装置を扱いますが、製品構成は同一ではありません。会社全体ではなく、成膜、エッチング、洗浄、CMP、検査など共通する装置カテゴリーを揃えて比較します。" },
            { question: "Applied Global Servicesとは？", answer: "部品、アップグレード、保守・サービス、装置・工場の生産性改善、ファクトリーオートメーションソフトウェアなどを提供する事業です。" },
            { question: "アプライド マテリアルズ ジャパンは何をしますか？", answer: "日本の顧客へ半導体・ディスプレイ製造装置と技術を提供し、開発・量産支援、システム改善、自動化ソフトウェア、工場支援などへ関わります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜一つの装置ではなく、材料工程全体の地図で理解する",
      lead: "アプライドマテリアルズは、材料を作る・形を作る・性質を変える・測る工程へ装置を提供します。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "CREATE", title: "材料を作る", body: "ALD、CVD、PVD、エピタキシーなどで薄膜を形成する" },
            { label: "SHAPE", title: "形を作る", body: "エッチング、選択的除去、CMPで必要な構造と表面を作る" },
            { label: "MODIFY / ANALYZE", title: "変えて測る", body: "イオン注入・熱処理で性質を変え、検査・計測で確認する" },
            { label: "SERVICE", title: "工場を支える", body: "保守、部品、改造、ソフトウェア、工場支援を続ける" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置と主要企業を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "CVD・ALD・PVD装置と企業を見る" },
            { label: "エッチング", href: "/guides/semiconductor-etching-process", description: "材料を選択的に除く仕組みを見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "Lam Research・東京エレクトロンなどの装置領域を見る" },
            { label: "イオン注入", href: "/guides/semiconductor-ion-implantation-process", description: "半導体へ不純物を導入する仕組みを見る" },
            { label: "イオン注入装置メーカー", href: "/guides/semiconductor-ion-implantation-equipment-manufacturers", description: "VIIStaと主要装置メーカーの領域を見る" },
            { label: "CMP", href: "/guides/semiconductor-cmp-process", description: "表面を平坦化する仕組みを見る" },
            { label: "検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "欠陥と工程変動を測る仕組みを見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "KLA・日立ハイテク・Lasertecなどの装置領域を見る" },
          ],
        },
      ],
      paragraphs: [
        "『強み』という検索に答えるときも、広告的な一言へ縮めず、製品範囲、統合、サービス、対象市場を公式情報から分けて確認します。そのうえで必要なら、同じ装置カテゴリーと同じ時点の外部データを使って競合比較へ進みます。",
      ],
    },
  ],
  todayQuest: "Applied Materialsの製品ページから一つ装置領域を選び、Create・Shape・Modify・Analyzeのどこに入り、前後にどの工程があるか整理する",
  relatedGuideSlugs: [
    "semiconductor-ion-implantation-equipment-manufacturers",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-process",
    "semiconductor-cmp-process",
    "semiconductor-ion-implantation-process",
    "semiconductor-inspection-metrology",
    "semiconductor-oxidation-thermal-process",
    "semiconductor-interconnect-process",
  ],
  relatedCompanyIds: ["applied-materials", "tokyo-electron", "lam-research", "kla"],
};
