import type { GuideArticle } from "@/content/guides/types";

export const semiconductorInspectionEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-inspection-equipment-manufacturers",
  title: "半導体の検査・計測装置メーカーとは？主要企業と装置の違いを初心者向けに図解",
  description:
    "半導体の検査・計測装置メーカーは、ウェーハ、回路パターン、フォトマスク、パッケージの欠陥・寸法・膜・位置ずれを測る装置を開発します。装置の種類、KLA・日立ハイテク・Lasertec・Applied Materialsの領域、仕事内容を図解します。",
  targetQuery: "半導体 検査装置 メーカー",
  searchIntent:
    "半導体の検査・計測装置にはどのような種類があり、主要メーカーが何を測る装置を提供し、各社をどの観点で比較すればよいか知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "KLA、日立ハイテク、Lasertec、Applied Materialsの公式製品・技術情報をもとに、装置を対象物、目的、測定原理、工程位置で整理しました。市場シェアや企業の優劣ではなく、装置領域を比較するための基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存の検査・計測記事で測定原理を整理したうえで、装置メーカーを調べるための企業・製品地図が必要だと判断",
    "KLA、日立ハイテク、Lasertec、Applied Materialsの公式製品情報で、ウェーハ・マスク・パッケージ向けの担当領域を確認",
    "検査装置、計測装置、レビュー装置、解析ソフトウェアを同じ装置名として混同しない構成へ整理",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Products",
      url: "https://www.kla.com/products",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Chip Manufacturing",
      url: "https://www.kla.com/products/chip-manufacturing",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Equipment",
      url: "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "CD-SEM & Defect Inspection",
      url: "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/cd-sem/",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Process: Metrology and Inspection",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/metrology-inspection.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Business and Core Technology",
      url: "https://www.lasertec.co.jp/en/company/business.html",
      publisher: "Lasertec Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor-related Inspection Systems",
      url: "https://www.lasertec.co.jp/en/ir/individuals/semiconductor.html",
      publisher: "Lasertec Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Analyze: Materials Analysis",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/analyze.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約14分",
  intro: {
    problem:
      "半導体検査装置メーカーを調べても、KLA、日立ハイテク、Lasertecなどが何を検査し、CD-SEMやレビューSEMとどう違うのか分かりにくくありませんか。",
    conclusion:
      "検査・計測装置は、異常を探す、寸法や膜を測る、欠陥を詳しく観察するという役割に分かれます。企業比較では会社名だけでなく、ウェーハ・フォトマスク・パッケージなどの対象物、測定原理、工程位置を揃えます。",
    learnings:
      "検査・計測・レビュー装置の違い、主な対象物、光学式と電子線式、主要メーカーの製品領域、企業比較の観点、工程データの使い方、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "検査装置メーカーを一つの順位で並べる前に、『何を探す装置か』『何を数値化する装置か』を分ける必要があります。同じ検査・計測でも、ウェーハ、マスク、寸法、膜、欠陥で競合関係が変わります。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜広く探し、数値で測り、詳しく見て、工程へ返す",
      description:
        "すべての製品を同じ装置で処理するわけではありません。目的に応じて複数装置とソフトウェアを組み合わせます。",
      stages: [
        { label: "01 / INSPECT", title: "異常候補を探す", body: "広いウェーハやマスクを走査し、粒子・パターン異常などの座標と信号を得る" },
        { label: "02 / MEASURE", title: "物理量を測る", body: "CD、膜厚、重ね合わせ、形状、材料状態などを数値化する" },
        { label: "03 / REVIEW", title: "欠陥を詳しく見る", body: "高倍率画像や複数信号で欠陥の形、種類、影響を絞る" },
        { label: "04 / CLASSIFY", title: "データを分類する", body: "座標、画像、測定値、設計データを照合し、傾向と優先度を整理する" },
        { label: "05 / FEEDBACK", title: "工程へ戻す", body: "ロット判断、装置点検、条件補正、追加測定、再発監視へつなぐ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置カテゴリー",
      rightLabel: "答える問い",
      rows: [
        { left: "欠陥検査装置", right: "ウェーハやマスクのどこに異常候補があるか" },
        { left: "寸法・膜・重ね合わせ計測", right: "線幅、穴径、膜厚、位置ずれ、形状が目標どおりか" },
        { left: "欠陥レビュー装置", right: "検査で見つけた候補がどのような形と種類か" },
        { left: "装置内計測", right: "加工装置の中または直後で、工程状態を素早く確認できるか" },
        { left: "解析ソフトウェア", right: "多数の画像・測定値・装置履歴から、どの変化を優先して調べるか" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "検査・計測装置メーカーとは、工程の変化を見えるデータへする企業",
      lead: "加工装置が膜や形を作るのに対し、検査・計測装置は加工結果を測ります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DETECT", title: "異常を見つける", body: "広い範囲から小さな信号差を検出し、欠陥候補の位置を記録します。" },
            { label: "QUANTIFY", title: "数値へ変える", body: "寸法、膜、位置、形状、材料状態を測り、工程の中心とばらつきを確認します。" },
            { label: "DECIDE", title: "判断を支える", body: "設計・工程・装置データと結び付け、止める、直す、追加確認する判断を支援します。" },
          ],
        },
        {
          type: "note",
          title: "最終的な電気試験とは役割が違う",
          body: "検査・計測は主に製造途中の形状、膜、欠陥、位置ずれを確認します。ウェーハテストや最終検査は、完成した回路・パッケージへ電気的に接触し、機能と性能を判定します。",
        },
      ],
      paragraphs: [
        "半導体は同じ工程を多数のウェーハへ繰り返すため、加工結果の小さな変化を早く捉える必要があります。検査・計測装置は画像、測定値、欠陥座標、分布を出力し、工程条件と結び付けます。",
        "装置メーカーは光学、電子線、X線、センサー、精密ステージ、真空、画像処理、統計解析、ソフトウェアを組み合わせ、感度・精度・速度・再現性を量産で成立させます。",
      ],
    },
    {
      id: "targets",
      heading: "対象物が違えば、必要な検査装置も変わる",
      lead: "ウェーハだけでなく、その原材料、回路の原版、パッケージも検査対象です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "対象物",
          rightLabel: "代表的な検査・計測",
          rows: [
            { left: "ベアウェーハ・成膜前表面", right: "粒子、表面欠陥、平坦度、厚さなどを測り、材料品質と装置清浄度を確認する" },
            { left: "パターン付きウェーハ", right: "回路パターンの欠陥、CD、重ね合わせ、膜、三次元形状を工程途中で確認する" },
            { left: "フォトマスク・マスクブランクス", right: "ウェーハへ転写する原版の欠陥、パターン、材料状態を検査・計測する" },
            { left: "ウェーハ端部・裏面", right: "端部、裏面、ベベルの欠陥や汚染を確認し、工程への持込みや破損リスクを監視する" },
            { left: "ダイ・パッケージ・基板", right: "外観、バンプ、配線、接合、位置、寸法などを後工程・先端パッケージで確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・CD・膜厚・重ね合わせの原理を見る" },
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "検査対象となる完成マスク・ブランクスと主要企業を見る" },
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "物理検査と電気試験の違いを見る" },
          ],
        },
      ],
      paragraphs: [
        "KLAは公式製品分類でチップ製造、ウェーハ製造、レチクル製造、パッケージ製造へ検査・計測製品を分けています。Lasertecはマスクブランクス・フォトマスクに加え、ウェーハ端部、膜厚、シリコン厚さ、SiCウェーハなどの検査・計測を案内しています。",
        "企業名だけで比較すると、マスク検査とウェーハ検査、前工程と後工程を混同します。まず対象物と工程位置を決めます。",
      ],
    },
    {
      id: "principles",
      heading: "光学式・電子線式などは、感度と速度の設計が違う",
      lead: "一つの測定原理ですべての欠陥と寸法を効率よく捉えることはできません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "測定原理・方式",
          rightLabel: "主な特徴と用途",
          rows: [
            { left: "光学式", right: "光の反射・散乱・干渉などを利用し、広い範囲を比較的高速に検査・計測する" },
            { left: "電子線式", right: "電子線で微細構造を画像化し、CD測定、微小欠陥検出、欠陥レビューに使う" },
            { left: "X線式", right: "X線の回折・散乱・透過などを利用し、埋込み構造や材料・三次元形状の計測へ使う" },
            { left: "走査プローブ式", right: "微小な探針で表面を走査し、表面形状や物性を高い空間分解能で測る" },
            { left: "複合・データ駆動", right: "複数装置、設計データ、工程履歴、統計・機械学習を組み合わせ、検出と分類を改善する" },
          ],
        },
        {
          type: "note",
          title: "高感度だけでは量産装置にならない",
          body: "量産では感度、精度、再現性、誤検出、検査速度、測定点数、試料への影響、装置稼働率、データ量を一緒に評価します。最も細かく見える方式が、すべての工程で最適とは限りません。",
        },
      ],
      paragraphs: [
        "日立ハイテクは電子線を使うCD-SEM・欠陥レビューSEMと、光学式のウェーハ表面・欠陥検査装置を案内しています。Applied Materialsも光学式、電子線、アルゴリズムを使った検査・レビュー・計測を公式情報で説明しています。",
        "実際の管理では、光学検査で広く候補を探し、電子線レビューで詳しく観察するなど、速度と分解能が異なる装置を連携させます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体検査・計測装置の代表企業4社",
      lead: "ランキングではなく、公式情報から確認できる主な対象物と装置領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主な検査・計測領域",
          rows: [
            { left: "KLA｜米国", right: "チップ・ウェーハ・レチクル・パッケージ製造向けの欠陥検査・レビュー、計測、装置内管理、ソフトウェア" },
            { left: "日立ハイテク｜日本", right: "CD-SEM、欠陥レビューSEM、ウェーハ表面・暗視野欠陥検査、計測データソリューション、エッチング装置" },
            { left: "Lasertec｜日本", right: "マスクブランクス・フォトマスク検査、ウェーハ端部・膜厚・シリコン厚さ・SiCウェーハなどの検査・計測" },
            { left: "Applied Materials｜米国", right: "パターン付きウェーハ検査、欠陥分類・レビュー、寸法・位置・材料の計測、統計・データ解析" },
          ],
        },
        {
          type: "note",
          title: "代表企業は網羅的な順位表ではない",
          body: "半導体の検査・計測には、膜厚、重ね合わせ、材料分析、電子顕微鏡、パッケージ外観、プロセスセンサーなど多くの専門企業があります。掲載企業は公式情報から役割を説明しやすい代表例で、市場順位を示しません。",
        },
      ],
      paragraphs: [
        "KLAは検査・計測を中核にしつつ、ウェーハ製造からパッケージ、ソフトウェアまで広い製品分類を示しています。日立ハイテクはCD-SEMなどの電子線計測と光学式ウェーハ検査、Lasertecは応用光学を基盤にマスク関連とウェーハ関連の製品を案内しています。",
        "Applied Materialsは成膜・エッチング・CMPなどの加工装置に加えてAnalyze領域を持ちます。同じ検査・計測企業でも、会社全体に占める位置と他工程との組み合わせが異なります。",
      ],
    },
    {
      id: "comparison",
      heading: "検査装置メーカーは、6つの条件を揃えて比較する",
      lead: "会社全体の知名度より、同じ問いへ答える装置かを確認します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "TARGET", title: "対象物", body: "ベアウェーハ、パターン付きウェーハ、マスク、ダイ、パッケージのどれか。" },
            { label: "QUESTION", title: "測る目的", body: "欠陥探索、寸法、膜、位置ずれ、形状、材料、レビューのどれか。" },
            { label: "PHYSICS", title: "測定原理", body: "光学、電子線、X線、走査プローブなど、信号の作り方と検出方法を見る。" },
            { label: "INSERTION", title: "工程位置", body: "材料受入、工程中、工程後、マスク製造、後工程・パッケージのどこか。" },
            { label: "PRODUCTION", title: "量産要件", body: "感度、精度、速度、再現性、サンプリング、稼働率、保守を揃える。" },
            { label: "DATA", title: "データ連携", body: "設計、装置履歴、欠陥分類、工程制御、解析ソフトウェアとの接続を見る。" },
          ],
        },
      ],
      paragraphs: [
        "たとえばKLAとLasertecを比べる場合も、『検査装置企業』という会社単位では範囲が広すぎます。フォトマスク検査、パターン付きウェーハ検査、膜厚計測など、共通する対象と用途を選びます。",
        "シェアや装置性能の数字を使う場合は、同じ年、製品定義、地域、先端・非先端、売上・出荷台数のどれかを揃えます。この記事では変動する順位を固定しません。",
      ],
    },
    {
      id: "data-flow",
      heading: "検査装置の価値は、データを工程改善へ戻して生まれる",
      lead: "欠陥画像や寸法値を保存するだけでは、製造条件は良くなりません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "データ",
          rightLabel: "主な使い方",
          rows: [
            { left: "欠陥座標・画像", right: "ウェーハ上の分布、繰返しパターン、工程・装置との相関を調べる" },
            { left: "CD・膜厚・重ね合わせ", right: "中心値、ばらつき、面内分布、ロット推移を管理し、条件補正へ使う" },
            { left: "レビュー・分類結果", right: "粒子、残渣、パターン異常などの種類を整理し、対応の優先順位を決める" },
            { left: "装置・材料履歴", right: "加工装置、チャンバー、時間帯、材料ロット、保守履歴との共通点を探す" },
            { left: "電気試験・歩留まり", right: "物理的な欠陥・寸法変動がデバイス機能へ影響したかを後工程で確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "アプライドマテリアルズ", href: "/guides/applied-materials-semiconductor-equipment", description: "加工とAnalyze領域を持つ装置企業を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "検査・計測が各工程の間に入る位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "検査・計測データは成膜、露光、エッチング、CMP、洗浄などの工程履歴と結び付けます。異常が見つかったら、対象ロットを止める判断と、次のウェーハの条件を直す判断を分けます。",
        "データ量が増えるほど、欠陥分類、優先順位付け、レシピ最適化、装置間比較を支えるソフトウェアとデータ基盤が重要になります。",
      ],
    },
    {
      id: "roles",
      heading: "検査・計測装置メーカーには、光学・電子線・機械・データの仕事がある",
      lead: "微小な信号を量産速度で安定して取得するために、複数技術が集まります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・技術",
          rightLabel: "主な役割",
          rows: [
            { left: "光学・電子線・センサー", right: "照明、電子源、レンズ、検出器、信号取得、雑音低減を設計する" },
            { left: "精密機械・ステージ", right: "ウェーハやマスクを高速・高精度に搬送、位置決め、走査する" },
            { left: "画像処理・アルゴリズム", right: "信号差を検出し、欠陥候補、寸法、形状、分類結果へ変換する" },
            { left: "アプリケーション", right: "顧客工程に合わせて検査レシピ、測定点、しきい値、評価方法を作る" },
            { left: "データ・ソフトウェア", right: "装置間、設計、工程履歴を統合し、統計解析と工程制御を支える" },
            { left: "フィールドサービス", right: "顧客工場で据付、校正、点検、障害切分け、部品交換、稼働支援を行う" },
          ],
        },
      ],
      paragraphs: [
        "同じ検査装置メーカーでも、光学、電子線、精密機械、制御、画像処理、データ、顧客工程支援で仕事内容は異なります。求人では担当製品と測定原理を確認します。",
        "製造業での品質、設備、生産技術、画像処理、データ解析の経験には接点がありますが、必要な物理知識、プログラミング、顧客対応、英語、出張は職種ごとに異なります。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の検査・計測装置メーカーでよくある質問",
      lead: "装置名と企業領域の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の検査装置とは何ですか？", answer: "ウェーハ、フォトマスク、ダイ、パッケージなどを走査し、粒子、パターン異常、表面欠陥などの候補を検出して座標や画像を出す装置です。" },
            { question: "検査装置と計測装置の違いは？", answer: "検査装置は広い範囲から異常候補を探し、計測装置はCD、膜厚、重ね合わせ、形状などの物理量を数値化します。両方の機能を持つ装置もあります。" },
            { question: "主な半導体検査装置メーカーは？", answer: "この記事ではKLA、日立ハイテク、Lasertec、Applied Materialsを代表例として紹介しています。このほかにも測定原理・対象物ごとに多くの専門企業があります。" },
            { question: "CD-SEMと欠陥レビューSEMの違いは？", answer: "CD-SEMは回路パターンの重要寸法を高精度に測ります。欠陥レビューSEMは、検査装置が出した欠陥座標へ移動して高倍率画像を取得し、欠陥の形や種類を詳しく調べます。" },
            { question: "KLAとLasertecは何が違いますか？", answer: "両社とも検査・計測製品を持ちますが、製品範囲は同一ではありません。KLAはチップ・ウェーハ・レチクル・パッケージまで広く分類し、Lasertecはマスク関連とウェーハ関連の応用光学製品を案内しています。個別用途を揃えて比較します。" },
            { question: "検査で欠陥が見つかれば不良ですか？", answer: "必ずしも不良とは限りません。検査信号は異常候補です。レビュー、寸法、位置、層、設計、電気試験などを照合し、製品機能への影響を判断します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象物・問い・測定原理を揃えてメーカーを見る",
      lead: "検査・計測装置は、製造工程を改善するためのデータを作ります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "TARGET", title: "対象を決める", body: "ウェーハ、マスク、ダイ、パッケージのどれを測るか" },
            { label: "QUESTION", title: "問いを決める", body: "欠陥、寸法、膜、位置、形状、材料の何を知りたいか" },
            { label: "METHOD", title: "原理を選ぶ", body: "光学、電子線、X線などの感度・速度・試料影響を考える" },
            { label: "FEEDBACK", title: "工程へ戻す", body: "画像・測定値を装置履歴と結び付け、判断と改善へ使う" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・CD・膜厚・重ね合わせを詳しく見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "検査以外の装置企業を工程別に見る" },
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "物理検査後の電気試験を見る" },
            { label: "半導体テスタとATE", href: "/guides/semiconductor-tester-ate", description: "検査装置と電気試験装置の違いを見る" },
            { label: "アプライドマテリアルズ", href: "/guides/applied-materials-semiconductor-equipment", description: "加工・検査をまたぐ製品領域を見る" },
            { label: "半導体製造装置の企業一覧", href: "/segments/equipment", description: "装置企業の詳細ページを調べる" },
          ],
        },
      ],
      paragraphs: [
        "検査・計測装置メーカーを調べるときは、最初に対象物と問いを一つ選んでください。そのうえで測定原理、量産要件、データ連携を揃えれば、企業と製品の違いを具体的に比較できます。",
      ],
    },
  ],
  todayQuest: "KLA、日立ハイテク、Lasertec、Applied Materialsから1社選び、対象物・測定目的・測定原理・工程位置を4項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-inspection-metrology",
    "semiconductor-photomask-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-wafer-test",
    "semiconductor-tester-ate",
    "applied-materials-semiconductor-equipment",
    "semiconductor-deposition-process",
    "semiconductor-etching-process",
    "semiconductor-cmp-process",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["kla", "hitachi-hightech", "lasertec", "applied-materials"],
};
