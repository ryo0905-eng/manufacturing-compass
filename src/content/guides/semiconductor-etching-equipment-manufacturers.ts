import type { GuideArticle } from "@/content/guides/types";

export const semiconductorEtchingEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-etching-equipment-manufacturers",
  title: "半導体のエッチング装置メーカーとは？主要企業とプラズマ装置を初心者向けに図解",
  description:
    "半導体のエッチング装置メーカーは、プラズマや反応性ガスを使い、ウェーハ上の材料を選択的に除去する量産装置を開発します。装置構成、導体・絶縁膜・シリコン加工、主要企業、比較方法、仕事内容を図解します。",
  targetQuery: "半導体 エッチング装置 メーカー",
  searchIntent:
    "半導体のエッチング装置がどのような構成で、材料・デバイスごとに何が異なり、Lam Research・東京エレクトロンなど主要メーカーをどう比較すればよいか知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Lam Research、東京エレクトロン、Applied Materials、日立ハイテクの公式製品・技術情報をもとに、装置構成と対象領域を整理しました。市場シェアや企業の優劣ではなく、同じ用途の装置を比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のエッチング技術記事で加工原理を整理したうえで、装置構成と企業ポートフォリオを調べる記事が必要だと判断",
    "Lam Research、東京エレクトロン、Applied Materials、日立ハイテクの公式情報で、導体・絶縁膜・シリコン・選択除去などの領域を確認",
    "企業比較は装置名だけでなく、対象材料、デバイス構造、プラズマ方式、量産要件、前後工程を揃える構成へ整理",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Etch",
      url: "https://www.lamresearch.com/products/our-processes/etch/",
      publisher: "Lam Research",
      accessedAt: "2026-07-16",
    },
    {
      title: "Etch Essentials in Semiconductor Manufacturing",
      url: "https://newsroom.lamresearch.com/etch-essentials-semiconductor-manufacturing?web=1",
      publisher: "Lam Research",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products and Services: Etch",
      url: "https://www.tel.com/product/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
    {
      title: "Tactras Series",
      url: "https://www.tel.com/product/tactras.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
    {
      title: "Shape: Materials Removal",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/shape.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Selective Etch",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/shape/selective-etch.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Equipment",
      url: "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Conductor Etch System M-600/6000 Series",
      url: "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/dry-etch-systems/conductor/m6000.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約14分",
  intro: {
    problem:
      "Lam Research、東京エレクトロン、Applied Materials、日立ハイテクをエッチング装置メーカーとして見ても、どの材料とデバイスを加工する装置なのか分かりにくくありませんか。",
    conclusion:
      "エッチング装置は、真空チャンバー、ガス供給、プラズマ源、ウェーハ電極・温度制御、排気、搬送、制御・計測を統合します。企業比較では、導体・絶縁膜・シリコンなどの対象材料と、穴・溝・側壁・選択除去などの加工目的を揃えます。",
    learnings:
      "エッチング装置の基本構成、プラズマ生成とイオン制御、対象材料・構造、量産装置の評価軸、主要メーカーの製品領域、比較方法、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "エッチング装置メーカーを比べるときは、『削れるか』より先に、『何を残しながら、どの材料を、どんな断面へ加工する装置か』を揃えると違いが見えます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜ウェーハを搬入し、プラズマで加工し、結果を工程へ返す",
      description:
        "代表的な枚葉式ドライエッチング装置を概念化しています。実際の構成は装置方式と用途で異なります。",
      stages: [
        { label: "01 / LOAD", title: "ウェーハを搬入", body: "ロードロックと搬送ロボットで、大気から真空の処理チャンバーへ運ぶ" },
        { label: "02 / STABILIZE", title: "処理環境を整える", body: "ウェーハを保持し、温度、圧力、ガス流量、電極条件を安定させる" },
        { label: "03 / PLASMA", title: "反応種とイオンを作る", body: "高周波などのエネルギーでプラズマを生成し、化学反応と方向性を制御する" },
        { label: "04 / ETCH", title: "材料を選択して除去", body: "マスク・下地を残しながら、深さ、CD、側壁、底部の形状を作る" },
        { label: "05 / MONITOR", title: "記録して次工程へ", body: "終点、装置状態、処理履歴を記録し、洗浄・計測・工程改善へ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "処理チャンバー", right: "圧力、材料、プラズマ、温度を安定させ、反応空間を作る" },
        { left: "ガス供給・排気", right: "反応性ガスを必要な比率で供給し、反応生成物を排出する" },
        { left: "プラズマ源", right: "電子・イオン・ラジカルを作り、反応密度と均一性を制御する" },
        { left: "バイアス・電極", right: "ウェーハへ入射するイオンのエネルギーと方向性を調整する" },
        { left: "温度・ウェーハ保持", right: "チャックでウェーハを固定し、反応速度と面内均一性に関わる温度を管理する" },
        { left: "搬送・制御・データ", right: "複数チャンバーへの搬送、レシピ実行、安全監視、終点・装置状態の記録を担う" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "エッチング装置メーカーとは、材料除去を量産設備へする企業",
      lead: "反応の原理だけでなく、同じ断面形状を大量のウェーハへ再現する必要があります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CHEMISTRY", title: "材料を反応させる", body: "対象膜とガスの組み合わせから、揮発性の反応生成物を作って除去します。" },
            { label: "DIRECTION", title: "加工方向を作る", body: "イオンの方向性と表面反応を組み合わせ、横方向を抑えて深さ方向へ加工します。" },
            { label: "PRODUCTION", title: "量産で繰り返す", body: "面内・ウェーハ間・チャンバー間の形状差、粒子、稼働率、生産性を管理します。" },
          ],
        },
        {
          type: "note",
          title: "ドライエッチング装置とウェット処理装置は分けて考える",
          body: "ドライエッチングは真空中のガス・プラズマを使う装置が中心です。ウェットエッチングは液体を使い、洗浄装置や薬液処理装置と共通する構成を持つ場合があります。この記事は主に量産用ドライエッチング装置を扱います。",
        },
      ],
      paragraphs: [
        "エッチングは、成膜とリソグラフィで用意した材料・マスクから不要部分を除き、回路パターンを下の膜や基板へ転写する工程です。装置メーカーはプラズマ、真空、流体、熱、電気、精密搬送、制御、安全を統合します。",
        "量産装置では加工性能だけでなく、ウェーハ搬送、チャンバー清浄度、部品寿命、保守時間、装置間再現性、ガスと電力の使用量も評価します。",
      ],
    },
    {
      id: "materials",
      heading: "導体・絶縁膜・シリコンでは、反応と装置要求が変わる",
      lead: "材料の結合と反応生成物が違うため、一つのレシピですべてを加工できません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "対象材料・加工",
          rightLabel: "代表的な装置課題",
          rows: [
            { left: "導体・半導体エッチング", right: "金属、シリコンなどを加工し、トランジスタ、電極、配線のCD・側壁・残留物を管理する" },
            { left: "絶縁膜エッチング", right: "酸化膜・窒化膜などの強い結合を加工し、コンタクトや配線の穴・溝を高い選択性で形成する" },
            { left: "高アスペクト比加工", right: "3D NANDなどの深く細い構造で、深さ方向の速度、側壁、底部、ねじれ、CD変化を制御する" },
            { left: "深掘りシリコン", right: "パワーデバイス、MEMS、TSVなどで深い溝・穴を形成し、側壁形状と生産性を両立する" },
            { left: "選択的・等方的除去", right: "見通せない領域を含め、隣接材料への影響を抑えながら対象材料を優先して除去する" },
            { left: "ウェーハ端部加工", right: "端部・ベベルに残る膜や付着物を除去し、剥離や粒子の発生を抑える" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "ウェット・ドライ、等方性・異方性、選択比を見る" },
            { label: "配線形成", href: "/guides/semiconductor-interconnect-process", description: "導体・絶縁膜を加工して配線を作る流れを見る" },
          ],
        },
      ],
      paragraphs: [
        "Lam Researchは導体エッチング、絶縁膜エッチング、ALE、深掘り・高アスペクト比、ベベル処理などを製品群として案内しています。東京エレクトロンも導体・絶縁膜、反応性イオン、ガス化学エッチングなどの装置を公開しています。",
        "Applied MaterialsはShape領域で導体・絶縁膜・選択的除去を説明し、日立ハイテクは導体エッチング装置とパワーデバイス向け深掘りシリコンなどを案内しています。",
      ],
    },
    {
      id: "plasma",
      heading: "プラズマ源・バイアス・温度の組み合わせが加工断面を作る",
      lead: "プラズマの密度と、ウェーハへ入るイオンのエネルギーは同じ概念ではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "制御項目",
          rightLabel: "加工への主な影響",
          rows: [
            { left: "プラズマ密度", right: "ラジカル・イオンの生成量と反応速度、面内均一性に影響する" },
            { left: "イオンエネルギー", right: "深さ方向の加工、底部反応、マスク・下地損傷、選択性に影響する" },
            { left: "ガス組成・流れ", right: "対象材料との反応、側壁保護、反応生成物、面内分布を変える" },
            { left: "圧力", right: "粒子の衝突、方向性、滞在時間、反応種分布へ影響する" },
            { left: "ウェーハ温度", right: "表面反応、生成物の吸着・脱離、側壁保護膜、形状へ影響する" },
            { left: "時間変調・パルス", right: "反応とイオン照射の時間を分け、選択性、ダメージ、ALEなどを制御する" },
          ],
        },
        {
          type: "note",
          title: "プラズマ方式の名前だけで性能は決まらない",
          body: "容量結合、誘導結合、電子サイクロトロン共鳴などのプラズマ生成方式がありますが、実際の加工はチャンバー形状、ガス、電極、温度、制御、対象材料の組み合わせで決まります。用途を揃えて比較します。",
        },
      ],
      paragraphs: [
        "ドライエッチングでは、ラジカルによる化学反応と方向を持つイオンの効果を組み合わせます。イオンを強くすればよいわけではなく、マスク消耗、下地損傷、側壁、選択比との釣り合いが必要です。",
        "装置メーカーの技術は、プラズマ源だけでなく、ガス分布、温度、排気、チャンバー材料、付着物管理、終点検出、レシピ制御を含むシステムで見ます。",
      ],
    },
    {
      id: "architecture",
      heading: "量産装置は、複数チャンバーと搬送を一つのプラットフォームへ統合する",
      lead: "処理チャンバーだけでなく、工場内の生産性と保守性を設計します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CLUSTER", title: "クラスタ構成", body: "真空搬送室の周囲へ複数チャンバーを配置し、異なる工程や並列処理を組み合わせます。" },
            { label: "CHAMBER MATCH", title: "チャンバー間整合", body: "複数チャンバー・複数装置でCD、速度、形状、欠陥がそろうように管理します。" },
            { label: "CLEAN", title: "付着物・粒子管理", body: "内壁への付着、剥離、部品状態を監視し、清掃・交換の周期を設計します。" },
            { label: "ENDPOINT", title: "終点・状態監視", body: "発光、ガス、時間、装置信号などから加工終了と変化を捉えます。" },
            { label: "UPTIME", title: "稼働率・保守", body: "段取り、予防保全、部品交換、校正、復旧を短くし、安定稼働を支えます。" },
            { label: "DATA", title: "制御・データ", body: "レシピ、センサー、アラーム、加工・保守履歴を保存し、検査結果と結び付けます。" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンの公式製品情報は、複数チャンバーを搭載できるプラットフォームと、導体・絶縁膜・反応性イオン・ガス化学エッチングなどの構成を案内しています。Lam Researchも用途別の処理製品を共通プラットフォーム上で展開しています。",
        "装置比較ではチャンバーの加工性能に加え、搬送速度、設置面積、チャンバー構成、保守アクセス、装置間整合、データ機能を確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体エッチング装置の代表企業4社",
      lead: "ランキングではなく、各社の公式情報から確認できる主な製品領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主なエッチング装置・技術領域",
          rows: [
            { left: "Lam Research｜米国", right: "導体・絶縁膜エッチング、RIE、ALE、深掘り・高アスペクト比、低温加工、ウェーハ端部処理" },
            { left: "東京エレクトロン｜日本", right: "導体・絶縁膜・反応性イオン・ガス化学エッチング、先端ロジック・メモリ・パワー向けプラットフォーム" },
            { left: "Applied Materials｜米国", right: "導体・絶縁膜エッチング、ALE、選択的除去、パターン形成とCMPを含むShape領域" },
            { left: "日立ハイテク｜日本", right: "導体エッチング、深掘りシリコン、パワー・LSI・MEMSなど向け装置と、CD-SEM・欠陥検査の連携領域" },
          ],
        },
        {
          type: "note",
          title: "代表企業は網羅的な順位表ではない",
          body: "ウェット処理、アッシング、イオンビーム加工、特殊材料、研究開発装置などにも専門企業があります。掲載企業は量産用ドライエッチング装置の役割を説明しやすい代表例で、市場順位を示しません。",
        },
      ],
      paragraphs: [
        "同じ会社でも製品群ごとに対象材料、デバイス、ウェーハサイズ、先端・非先端、前工程・後工程が異なります。会社全体を一つの『エッチング技術』として比較しません。",
        "企業の製品構成は追加・再編されます。特定装置や求人を調べる場合は、各社の最新製品ページと採用情報を確認してください。",
      ],
    },
    {
      id: "comparison",
      heading: "エッチング装置メーカーは、6つの条件を揃えて比較する",
      lead: "同じ装置カテゴリーでも、解いている加工課題が違う場合があります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "MATERIAL", title: "対象材料", body: "導体、半導体、絶縁膜、マスク、下地の組み合わせを決める。" },
            { label: "PROFILE", title: "必要な断面", body: "CD、深さ、側壁、底部、アスペクト比、選択性を揃える。" },
            { label: "DEVICE", title: "デバイス用途", body: "ロジック、DRAM、NAND、パワー、MEMS、先端パッケージのどれか。" },
            { label: "PLASMA", title: "反応・プラズマ", body: "ガス反応、イオン、温度、圧力、時間変調、低温加工などを見る。" },
            { label: "FACTORY", title: "量産性能", body: "均一性、再現性、生産性、粒子、稼働率、設置面積、保守を比較する。" },
            { label: "INTEGRATION", title: "前後工程・データ", body: "成膜、リソグラフィ、洗浄、計測と、装置・解析データの接続を見る。" },
          ],
        },
      ],
      paragraphs: [
        "Lam Researchと東京エレクトロンのように両社が広いエッチング領域を持つ場合も、導体、絶縁膜、高アスペクト比、パワーデバイスなど比較対象を一つ選びます。",
        "市場シェアや性能値を使う場合は、同じ年、装置分類、対象デバイス、地域、売上・出荷台数の定義を揃えます。この記事では変動する順位を固定しません。",
      ],
    },
    {
      id: "integration",
      heading: "エッチング装置は、成膜・リソグラフィ・洗浄・計測と一緒に使う",
      lead: "良い加工断面はエッチング装置だけでは決まりません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "前後工程",
          rightLabel: "エッチングとのつながり",
          rows: [
            { left: "成膜", right: "膜材料、厚さ、組成、密度、応力、界面が加工速度・選択性・残留物へ影響する" },
            { left: "リソグラフィ", right: "レジスト・ハードマスクのCD、厚さ、形状、位置ずれを下の膜へ転写する" },
            { left: "洗浄・除去", right: "加工後の残留物、ポリマー、粒子、反応生成物を除き、次工程へ適した表面にする" },
            { left: "検査・計測", right: "CD、深さ、側壁、欠陥、残膜、面内分布を測り、装置条件へフィードバックする" },
            { left: "ウェーハテスト", right: "物理的な加工変動が断線・短絡・漏れ・性能などの電気特性へ影響したか確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "エッチング前の膜を作る装置企業を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "加工断面・欠陥を測る装置企業を見る" },
            { label: "アプライドマテリアルズ", href: "/guides/applied-materials-semiconductor-equipment", description: "Create・Shape・Modify・Analyzeをまたぐ製品領域を見る" },
          ],
        },
      ],
      paragraphs: [
        "エッチング不良を調べるときは、エッチングレシピだけでなく、膜、マスク、洗浄、計測、前ロット、チャンバー状態を確認します。測定結果と装置履歴を同じウェーハ・位置へ結び付けることが重要です。",
        "装置メーカーのアプリケーション・サービス職は、顧客工程の前後関係を理解しながら、装置とプロセスの両方を切り分けます。",
      ],
    },
    {
      id: "roles",
      heading: "エッチング装置メーカーには、プラズマ・真空・制御・サービスの仕事がある",
      lead: "材料表面の反応と、大型量産設備の安定稼働をつなぐ仕事です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・技術",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス・アプリケーション", right: "材料、ガス、プラズマ、温度、圧力を評価し、断面形状と選択性を作る" },
            { left: "プラズマ・電気設計", right: "高周波電源、整合、電極、センサー、バイアス、ノイズを設計する" },
            { left: "機械・真空・熱設計", right: "チャンバー、搬送、真空、排気、温度、シール、保守構造を設計する" },
            { left: "制御・ソフトウェア", right: "レシピ、装置制御、終点、アラーム、データ収集、診断を開発する" },
            { left: "生産・品質", right: "装置組立、調整、検査、部品品質、チャンバー間・装置間整合を支える" },
            { left: "フィールドサービス", right: "顧客工場で据付、点検、障害切分け、部品交換、改造、稼働支援を行う" },
          ],
        },
      ],
      paragraphs: [
        "同じエッチング装置企業でも、担当する材料、デバイス、プラズマ方式、開発・量産・フィールドで仕事内容が変わります。求人では製品名と担当工程を確認します。",
        "製造業での設備、生産技術、品質、真空、電気、制御、データ解析の経験には接点がありますが、材料・プラズマ知識、顧客対応、英語、出張の要件は職種ごとに異なります。",
      ],
    },
    {
      id: "faq",
      heading: "半導体のエッチング装置メーカーでよくある質問",
      lead: "装置と企業を調べるための基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体のエッチング装置とは何ですか？", answer: "ウェーハ上の不要な材料を選択的に除去し、回路の穴、溝、線、側壁などを形成する装置です。主なドライ装置は真空、ガス、プラズマ、電極、温度、搬送、制御を統合します。" },
            { question: "主なエッチング装置メーカーは？", answer: "この記事ではLam Research、東京エレクトロン、Applied Materials、日立ハイテクを代表例として紹介しています。ほかにもウェット処理、特殊加工、研究開発などの専門企業があります。" },
            { question: "導体エッチングと絶縁膜エッチングの違いは？", answer: "対象材料と必要な反応が違います。導体・半導体では金属やシリコンなどを、絶縁膜では酸化膜・窒化膜などを加工し、マスク・下地・側壁を守りながら必要な形を作ります。" },
            { question: "プラズマエッチングは物理的に削るだけですか？", answer: "いいえ。ラジカルなどによる化学反応と、方向を持つイオンの衝突を組み合わせます。両者の釣り合いで速度、方向性、選択性、ダメージ、断面形状が変わります。" },
            { question: "Lam Researchと東京エレクトロンはどう比較しますか？", answer: "両社とも広いエッチング製品領域を持つため、導体、絶縁膜、高アスペクト比、パワーデバイスなど対象を選び、プラズマ・チャンバー、加工形状、量産性、保守、データ機能を揃えて比較します。" },
            { question: "ALEなら必ず一原子層ずつ除去できますか？", answer: "一周期あたりの除去量は材料と表面反応で異なり、完全な一原子層とは限りません。表面改質と除去を分け、自己制限的な反応で小さな除去量を制御することが要点です。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜材料・断面・装置構成を揃えてメーカーを見る",
      lead: "エッチング装置は、不要な材料を除きながら必要な構造と材料を残す量産設備です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MATERIAL", title: "材料を決める", body: "導体、絶縁膜、シリコン、マスク、下地の組み合わせを見る" },
            { label: "PROFILE", title: "断面を決める", body: "CD、深さ、側壁、底部、選択性、残留物を確認する" },
            { label: "TOOL", title: "装置を分ける", body: "プラズマ、バイアス、温度、ガス、搬送、データ機能を比較する" },
            { label: "FACTORY", title: "量産で評価する", body: "均一性、再現性、生産性、粒子、稼働率、保守を一緒に見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "ウェット・ドライと断面形状を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "エッチング以外の装置企業を工程別に見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "加工対象の薄膜を作る装置企業を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "加工結果を測る装置企業を見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "加工前後の表面を整える工程を見る" },
            { label: "半導体製造装置の企業一覧", href: "/segments/equipment", description: "装置企業の詳細ページを調べる" },
          ],
        },
      ],
      paragraphs: [
        "エッチング装置メーカーを調べるときは、対象材料と必要断面を一つ選んでください。そのうえでプラズマ・チャンバー、量産性能、前後工程、職種・拠点を確認すれば、企業と製品の違いを具体的に整理できます。",
      ],
    },
  ],
  todayQuest: "Lam Research、東京エレクトロン、Applied Materials、日立ハイテクから1社選び、対象材料・必要断面・デバイス用途・量産要件を4項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-etching-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "applied-materials-semiconductor-equipment",
    "semiconductor-manufacturing-process",
    "photolithography-process",
    "semiconductor-cleaning-process",
    "semiconductor-interconnect-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["lam-research", "tokyo-electron", "applied-materials", "hitachi-hightech"],
};
