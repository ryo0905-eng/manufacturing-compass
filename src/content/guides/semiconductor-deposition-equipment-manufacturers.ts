import type { GuideArticle } from "@/content/guides/types";

export const semiconductorDepositionEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-deposition-equipment-manufacturers",
  title: "半導体の成膜装置メーカーとは？CVD・ALD・PVDの主要企業を初心者向けに図解",
  description:
    "半導体の成膜装置メーカーは、CVD・ALD・PVDなどでウェーハ上へ薄膜を形成する量産装置を開発します。装置構成、枚葉式とバッチ式、主要企業、ASMと東京エレクトロンを比較する観点、仕事内容を図解します。",
  targetQuery: "半導体 成膜装置 メーカー",
  searchIntent:
    "半導体の成膜装置メーカーが何を作る会社か、CVD・ALD・PVD装置の違い、主要企業の製品領域、ASMと東京エレクトロンを比較する観点を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Search Consoleに表示された『ASM 東京エレクトロン』を起点に、各社の公式製品情報で成膜方式と装置領域を照合しました。市場シェアや企業の優劣ではなく、装置を同じ条件で比較するための基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "Search Consoleに『ASM 東京エレクトロン』が表示され、成膜装置企業を比較する検索需要を確認",
    "既存の成膜工程記事とは分け、この記事では装置構成、量産方式、企業ポートフォリオ、職種へ焦点を設定",
    "ASM、東京エレクトロン、Applied Materials、Lam Research、Canonの公式技術・製品情報で担当領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Atomic Layer Deposition",
      url: "https://www.asm.com/our-technology-products/ald",
      publisher: "ASM International",
      accessedAt: "2026-07-16",
    },
    {
      title: "Epitaxy",
      url: "https://www.asm.com/our-technology-products/epitaxy",
      publisher: "ASM International",
      accessedAt: "2026-07-16",
    },
    {
      title: "PECVD",
      url: "https://www.asm.com/our-technology-products/pecvd",
      publisher: "ASM International",
      accessedAt: "2026-07-16",
    },
    {
      title: "Vertical Furnace",
      url: "https://www.asm.com/our-technology-products/vertical-furnace",
      publisher: "ASM International",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products and Services: Deposition",
      url: "https://www.tel.com/product/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
    {
      title: "Deposition NT333 Series",
      url: "https://www.tel.com/product/nt333.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
    {
      title: "Material Creation and Deposition",
      url: "https://www.appliedmaterials.com/jp/ja/semiconductor/semiconductor-capabilities/create.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Physical Vapor Deposition",
      url: "https://www.appliedmaterials.com/jp/ja/semiconductor/semiconductor-technologies/pvd.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Deposition",
      url: "https://www.lamresearch.com/products/our-processes/deposition/",
      publisher: "Lam Research",
      accessedAt: "2026-07-16",
    },
    {
      title: "Canon Group's Semiconductor Manufacturing Equipment",
      url: "https://global.canon/en/product/indtech/semicon/group/index.html",
      publisher: "Canon",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約14分",
  intro: {
    problem:
      "ASM、東京エレクトロン、Applied Materialsなどを『成膜装置メーカー』として見ても、どの成膜方式と装置を比べればよいのか分かりにくくありませんか。",
    conclusion:
      "成膜装置メーカーは、必要な膜を量産で再現するために、反応室、材料供給、真空・排気、加熱・プラズマ、搬送、制御・データを統合します。企業比較では、成膜方式だけでなく対象膜、装置方式、デバイス用途、提供範囲を揃えます。",
    learnings:
      "成膜装置メーカーの役割、装置の基本構成、CVD・ALD・PVD装置、枚葉式・バッチ式・セミバッチ式、主要企業、ASMと東京エレクトロンの比較観点、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "Search Consoleに『ASM 東京エレクトロン』が出てきました。会社名を直接比べる前に、両社が扱う成膜方式と装置構成を同じ地図へ置ける記事が必要だと考えました。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "図解｜膜の要求を、量産装置へ変換する",
      description:
        "実際の装置選定では材料、デバイス構造、前後工程、安全、工場条件も含めて検討します。ここでは企業研究の順番を大きく整理します。",
      stages: [
        { label: "01 / FILM", title: "必要な膜を決める", body: "絶縁膜、導体膜、半導体膜など、材料・膜厚・膜質・用途を定める" },
        { label: "02 / METHOD", title: "成膜方式を選ぶ", body: "PVD、CVD、ALD、エピタキシーなどから反応と材料供給の方法を選ぶ" },
        { label: "03 / ARCHITECTURE", title: "処理方式を設計する", body: "枚葉、バッチ、セミバッチ、熱、プラズマなどを生産要求へ合わせる" },
        { label: "04 / INTEGRATE", title: "装置へ統合する", body: "反応室、供給、真空、搬送、温度、制御、安全機能を一つのシステムにする" },
        { label: "05 / CONTROL", title: "量産で維持する", body: "膜厚・均一性・欠陥・生産性・稼働率を監視し、保守と改善を続ける" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "反応室・チャンバー", right: "ウェーハ、材料、温度、圧力、プラズマなどの反応環境を作る" },
        { left: "原料供給", right: "気体、蒸気、固体ターゲットなどを必要な量と順番で供給する" },
        { left: "真空・排気", right: "圧力と流れを制御し、未反応物と副生成物を安全に排出する" },
        { left: "熱・プラズマ・電源", right: "表面反応や材料放出に必要なエネルギーを与える" },
        { left: "ウェーハ搬送", right: "大気と真空の間を移動し、複数チャンバーへ汚染を抑えて運ぶ" },
        { left: "制御・データ", right: "温度、圧力、流量、時間、装置状態を制御・記録し、再現性を支える" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "成膜装置メーカーとは、薄膜形成を量産可能な設備へする企業",
      lead: "成膜原理を知ることと、安定して量産できる装置を作ることは別の課題です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PROCESS", title: "反応を成立させる", body: "材料、表面、温度、圧力、プラズマを組み合わせ、必要な膜を形成します。" },
            { label: "PRODUCTION", title: "繰り返し作る", body: "ウェーハ間・面内・装置間のばらつきを抑え、必要な生産量を維持します。" },
            { label: "SYSTEM", title: "安全に統合する", body: "材料供給、排気、搬送、制御、異常検知、保守を一つの設備へまとめます。" },
          ],
        },
        {
          type: "note",
          title: "同じCVD装置でも用途は同じとは限らない",
          body: "対象膜、ウェーハサイズ、デバイス、前工程・後工程、研究開発・量産、枚葉・バッチで装置設計は変わります。企業名や『CVD』という分類だけで競合関係を決めません。",
        },
      ],
      paragraphs: [
        "成膜工程では、ウェーハ表面へ絶縁体、導体、半導体などの薄膜を作ります。装置メーカーは成膜方式の知識に加え、真空、流体、熱、プラズマ、電気、精密搬送、ソフトウェア、安全を統合して量産設備として提供します。",
        "装置販売後も、プロセス開発、量産立上げ、保守、部品、改造、ソフトウェア、データ解析が続きます。そのため製品ページと求人では、装置本体だけでなくサービス範囲も確認します。",
      ],
    },
    {
      id: "methods",
      heading: "PVD・CVD・ALDでは、装置へ必要な機能が変わる",
      lead: "膜の作り方が違えば、材料供給、反応制御、チャンバー設計も変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "成膜方式",
          rightLabel: "装置で重視する代表的な機能",
          rows: [
            { left: "PVD・スパッタリング", right: "真空中で固体ターゲットから材料を放出し、ウェーハへ堆積する。真空、電源、磁場、ターゲット、粒子輸送を制御する" },
            { left: "熱CVD・LPCVD", right: "気体原料を温度と圧力で反応させる。ガス供給、炉・ヒーター、圧力、排気、反応副生成物を管理する" },
            { left: "PECVD", right: "プラズマで反応を助ける。高周波電源、プラズマ均一性、低温処理、膜損傷を管理する" },
            { left: "ALD・PEALD", right: "原料の交互供給とパージを周期的に行う。高速バルブ、供給順序、パージ、表面反応、周期数を精密制御する" },
            { left: "エピタキシー", right: "基板の結晶配列に沿って結晶層を成長する。表面準備、温度、材料組成、不純物、結晶品質を管理する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "PVD・CVD・ALDの材料供給と表面反応を詳しく見る" },
            { label: "酸化・熱処理", href: "/guides/semiconductor-oxidation-thermal-process", description: "縦型炉で扱われる酸化・アニールとの関係を見る" },
          ],
        },
      ],
      paragraphs: [
        "Applied MaterialsはPVD、CVD、ALDを含む材料形成技術を案内し、Lam ResearchはALD、CVD、PECVDなどを膜材料とデバイス用途別の製品群として公開しています。複数方式を一社が扱う場合もあります。",
        "方式の名前が同じでも、金属膜か絶縁膜か、平面か高アスペクト比構造か、先端ロジックかメモリ・パワー・パッケージかによって、必要な装置性能は変わります。",
      ],
    },
    {
      id: "architectures",
      heading: "枚葉式・バッチ式・セミバッチ式は、生産性と制御の設計が違う",
      lead: "一度に処理するウェーハ数だけでなく、温度履歴、切替性、装置面積も変わります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SINGLE WAFER", title: "枚葉式", body: "ウェーハを一枚または少数ずつ処理。個別制御と工程統合に向き、複数チャンバーを搬送系へ接続する構成もあります。" },
            { label: "BATCH", title: "バッチ式", body: "多数のウェーハを一つの炉や反応室で処理。高い処理能力を狙える一方、温度・流れ・ウェーハ間均一性を管理します。" },
            { label: "SEMI-BATCH", title: "セミバッチ式", body: "複数ウェーハを同時または連続的に処理し、枚葉制御と生産性の両立を狙う構成です。" },
          ],
        },
        {
          type: "note",
          title: "装置方式だけで優劣は決まらない",
          body: "必要な膜質、処理温度、製品構成、切替頻度、処理時間、保守、工場面積によって適した方式は変わります。公開仕様だけでは判断できない項目も多いため、用途を揃えて比較します。",
        },
      ],
      paragraphs: [
        "東京エレクトロンは公式製品情報で、枚葉式、バッチ式、セミバッチ式を含むCVD・ALD・PVD・熱処理装置を案内しています。ASMもALD・PECVDの枚葉プラットフォームに加え、LPCVD・拡散・酸化を扱う縦型炉を展開しています。",
        "量産評価では一回の処理時間だけでなく、搬送、昇降温、材料切替、クリーニング、保守停止を含む総合的な生産性と再現性を見ます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体成膜装置の代表企業5社",
      lead: "ランキングではなく、各社の公式情報から確認できる主な成膜領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主な成膜装置・技術領域",
          rows: [
            { left: "ASM International｜欧州", right: "ALD・PEALD、エピタキシー、PECVD、LPCVD・酸化・拡散を扱う縦型炉" },
            { left: "東京エレクトロン｜日本", right: "熱処理・酸化、CVD、ASFD、ALD、PVDを含む枚葉・バッチ・セミバッチ成膜装置" },
            { left: "Applied Materials｜米国", right: "PVD、CVD、ALDを含む材料形成と、前後の材料改質・除去・解析を含む広い装置領域" },
            { left: "Lam Research｜米国", right: "ALD、CVD、PECVD、HDP-CVD、PLDなどの導体・絶縁膜向け成膜装置" },
            { left: "Canon ANELVA｜日本", right: "Canonグループの成膜領域として、半導体前工程・パッケージ工程向けスパッタリング装置" },
          ],
        },
        {
          type: "note",
          title: "代表企業は網羅的な順位表ではない",
          body: "成膜装置には、このほかにも熱処理、エピタキシー、特殊材料、研究開発、後工程などへ強みを持つ企業があります。掲載企業は観測クエリと公式情報をもとにした代表例で、市場順位を示しません。",
        },
      ],
      paragraphs: [
        "各社は一つの装置名だけで分類できません。成膜に加えてエッチングや洗浄など複数工程を扱う企業もあれば、ALD・エピタキシーなど特定の成膜技術を中核に据える企業もあります。",
        "企業研究では会社全体の売上や知名度より先に、関心のある装置が対象とする膜、デバイス、ウェーハサイズ、研究開発・量産、前工程・後工程を確認します。",
      ],
    },
    {
      id: "asm-tel",
      heading: "ASMと東京エレクトロンは、共通領域と会社全体を分けて比較する",
      lead: "両社には成膜の共通領域がありますが、公式に示す製品ポートフォリオは同じではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "確認する内容",
          rows: [
            { left: "共通する成膜方式", right: "ALD、PECVD、縦型炉・熱CVDなど、比較したい製品カテゴリーを一つ選ぶ" },
            { left: "ASMの公式領域", right: "ALD・PEALD、エピタキシー、PECVD、縦型炉を、対象膜・デバイス・装置方式ごとに確認する" },
            { left: "東京エレクトロンの公式領域", right: "酸化・熱処理、CVD、ASFD、ALD、PVDに加え、成膜以外の前工程・テスト製品も分けて確認する" },
            { left: "量産アーキテクチャ", right: "枚葉、バッチ、セミバッチ、チャンバー構成、搬送、データ機能を同じ用途で比べる" },
            { left: "仕事としての違い", right: "募集職種、担当製品、開発・製造・サービス拠点、顧客対応、出張、必要言語を求人ごとに確認する" },
          ],
        },
      ],
      paragraphs: [
        "ASMは公式サイトでALDを中核技術の一つとして詳しく説明し、エピタキシー、PECVD、縦型炉も案内しています。東京エレクトロンは成膜製品として酸化・熱処理、CVD、ASFD、ALD、PVDを示し、成膜以外にも塗布・現像、エッチング、洗浄、テストなどを展開しています。",
        "したがって『ASMと東京エレクトロンのどちらが強いか』という一問ではなく、たとえばALD装置、縦型炉、特定膜の量産用途など、共通する製品範囲を決めて比較するのが適切です。市場数値を使う場合は、同じ年・同じ装置定義・同じ調査範囲かを確認します。",
      ],
    },
    {
      id: "evaluation",
      heading: "成膜装置は、膜性能と工場運用を一緒に評価する",
      lead: "良い膜が作れるだけでなく、量産で安定して使えることが必要です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FILM", title: "膜の性能", body: "膜厚、均一性、組成、抵抗、密度、応力、段差被覆、欠陥を用途に合わせて見る。" },
            { label: "REPEAT", title: "再現性", body: "ウェーハ面内、ウェーハ間、ロット間、チャンバー間、装置間の差を管理する。" },
            { label: "THROUGHPUT", title: "生産性", body: "処理時間、搬送、材料切替、クリーニング、立上げを含む処理能力を見る。" },
            { label: "UPTIME", title: "稼働率・保守", body: "部品寿命、付着物、清掃、校正、復旧時間、予防保全、部品供給を確認する。" },
            { label: "COST", title: "総コスト", body: "装置価格だけでなく材料、ガス、電力、消耗品、面積、人員、保守を含める。" },
            { label: "EHS", title: "安全・環境", body: "材料の危険性、漏えい検知、排気処理、インターロック、廃棄物、エネルギーを管理する。" },
          ],
        },
      ],
      paragraphs: [
        "評価項目にはトレードオフがあります。たとえば膜厚制御を細かくすると処理時間が伸びる場合があり、並列処理を増やすとウェーハ間均一性や保守の設計が複雑になります。",
        "公開製品ページは企業領域を知る入口です。実際の装置選定や工程設計では、製品仕様、評価データ、安全基準、工場設備、保守体制を個別に確認します。",
      ],
    },
    {
      id: "roles",
      heading: "成膜装置メーカーには、プロセス・機械・電気・制御・サービスの仕事がある",
      lead: "材料表面の反応と大型設備の量産運用をつなぐ仕事です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・技術",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセスエンジニア", right: "膜と表面反応を評価し、材料、温度、圧力、時間、プラズマなどのプロセスを開発する" },
            { left: "機械・真空・熱設計", right: "チャンバー、搬送、真空、排気、加熱、冷却、保守構造を設計する" },
            { left: "電気・制御・ソフトウェア", right: "電源、センサー、インターロック、装置制御、データ収集、診断を作る" },
            { left: "生産・品質", right: "装置の組立、調整、検査、部品品質、変更管理、出荷品質を支える" },
            { left: "フィールドサービス", right: "顧客工場で据付、立上げ、点検、障害切分け、部品交換、改善を行う" },
            { left: "アプリケーション・営業技術", right: "顧客のデバイス課題を装置・プロセス提案へ変換し、評価と量産導入を支援する" },
          ],
        },
      ],
      paragraphs: [
        "同じ成膜装置メーカーでも、担当する方式と拠点で仕事は変わります。求人ではALD・CVD・PVDなどの担当技術、開発か量産か、社内評価か顧客先支援かを確認します。",
        "製造業での設備、生産技術、品質、制御、データ解析の経験は接点になりますが、真空・材料・プラズマ・英語・出張などの要件は求人ごとに異なります。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の成膜装置メーカーでよくある質問",
      lead: "工程・装置・企業の違いを短く整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の成膜装置とは何ですか？", answer: "ウェーハ表面へ絶縁体、導体、半導体などの薄膜を形成する装置です。反応室、材料供給、真空・排気、熱・プラズマ、搬送、制御・安全機能を統合します。" },
            { question: "主な成膜装置メーカーは？", answer: "この記事ではASM、東京エレクトロン、Applied Materials、Lam Research、Canon ANELVAを代表例として紹介しています。網羅的な順位表ではなく、各社の公式製品領域を整理したものです。" },
            { question: "CVD装置とALD装置の違いは？", answer: "CVDは一般に原料を供給しながら連続的に反応・成長させます。ALDは複数原料の供給とパージを交互に繰り返し、自己停止型の表面反応で膜厚と被覆を精密に制御します。" },
            { question: "枚葉式とバッチ式はどちらがよいですか？", answer: "用途によります。枚葉式は個別制御と工程統合、バッチ式は多数枚の同時処理による生産性を狙えます。膜質、温度履歴、製品構成、切替、保守、面積を含めて選びます。" },
            { question: "ASMと東京エレクトロンは競合ですか？", answer: "ALD、PECVD、縦型炉など共通する成膜領域があります。ただし会社全体の製品範囲は同一ではないため、対象膜、装置方式、デバイス用途を揃えて個別製品で比較します。" },
            { question: "成膜装置メーカーにはどんな仕事がありますか？", answer: "プロセス、機械・真空・熱設計、電気・制御・ソフトウェア、生産・品質、フィールドサービス、アプリケーション、営業技術などがあります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜成膜方式・装置構成・量産用途を揃えて企業を見る",
      lead: "成膜装置メーカーは、薄膜の反応を工場で繰り返せるシステムへ変えます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "METHOD", title: "方式を分ける", body: "PVD、CVD、ALD、エピタキシーで材料供給と反応が異なる" },
            { label: "TOOL", title: "構成を分ける", body: "枚葉、バッチ、セミバッチ、熱、プラズマを用途へ合わせる" },
            { label: "FACTORY", title: "量産で評価する", body: "膜性能、再現性、生産性、稼働率、コスト、安全を一緒に見る" },
            { label: "COMPANY", title: "範囲を揃えて比べる", body: "対象膜、デバイス、装置方式、サービス、職種・拠点を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "PVD・CVD・ALDの反応メカニズムを見る" },
            { label: "アプライドマテリアルズ", href: "/guides/applied-materials-semiconductor-equipment", description: "成膜を含む同社の工程別製品領域を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "成膜以外の装置企業を工程別に見る" },
            { label: "熱処理装置メーカー", href: "/guides/semiconductor-thermal-processing-equipment-manufacturers", description: "バッチ熱処理とLPCVD・ALDが重なる装置領域を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "成膜が繰り返し使われる位置を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "成膜した層を選択的に加工する工程を見る" },
            { label: "検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "膜厚・欠陥・寸法を測る工程を見る" },
            { label: "膜厚・光学計測装置メーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "成膜結果を反射・偏光・干渉で測る装置と企業を見る" },
            { label: "半導体製造装置の企業一覧", href: "/segments/equipment", description: "装置企業の詳細ページを調べる" },
          ],
        },
      ],
      paragraphs: [
        "ASMと東京エレクトロンのような企業名検索も、まず共通する成膜方式と用途を決めると具体的になります。そこから製品構成、量産評価軸、職種と拠点を確認すれば、技術理解と企業研究を同じ地図で進められます。",
      ],
    },
  ],
  todayQuest: "気になる成膜装置企業を1社選び、成膜方式・対象膜・装置方式・デバイス用途・職種の5項目で整理する",
  relatedGuideSlugs: [
    "applied-materials-semiconductor-equipment",
    "semiconductor-deposition-process",
    "semiconductor-mass-flow-controller-manufacturers",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-wafer-handling-efem-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-oxidation-thermal-process",
    "semiconductor-thermal-processing-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-inspection-metrology",
    "semiconductor-thin-film-optical-metrology-manufacturers",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["tokyo-electron", "applied-materials", "lam-research", "canon"],
};
