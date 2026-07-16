import type { GuideArticle } from "@/content/guides/types";

export const semiconductorWaferDefectInspectionManufacturersGuide: GuideArticle = {
  slug: "semiconductor-wafer-defect-inspection-manufacturers",
  title: "半導体ウェーハ欠陥検査装置メーカーとは？KLA・日立ハイテク・Applied Materialsを初心者向けに図解",
  description:
    "半導体ウェーハ欠陥検査装置は、ウェーハを広く走査して粒子・傷・パターン異常の候補を探します。パターンなし／付き、明視野／暗視野、光学検査／電子線レビュー、主要メーカーの違いを図解します。",
  targetQuery: "半導体 ウェーハ 欠陥検査装置 メーカー",
  searchIntent:
    "半導体ウェーハ欠陥検査装置とは何か、パターンなし・パターン付き、明視野・暗視野、光学検査・電子線レビューの違い、KLA・日立ハイテク・Applied Materialsなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "KLA、日立ハイテク、Applied Materialsの公式製品・技術情報をもとに、ウェーハを搬送する、表面を走査する、基準信号と比較する、異常候補を検出する、欠陥マップを作る、レビューと工程改善へ渡す流れへ整理しました。パターンなし・パターン付き、明視野・暗視野、光学検査・電子線レビューを同一視せず、対象と役割を分けて説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "検査・計測の全体記事、CD-SEM、膜厚、重ね合わせの記事を公開したうえで、広いウェーハ面から異常候補を探す欠陥検査を独立記事にする必要があると判断",
    "日立ハイテクの公式解説でパターン付き・パターンなし、明視野・暗視野・電子線、隣接ダイ比較、レーザー散乱の基本原理を確認",
    "KLAでパターン付き光学検査・パターンなし表面検査・電子線レビュー、Applied Materialsで光学検査と電子線レビューを接続する製品領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Wafer Defect Inspection System",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/inspection.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Dark Field Wafer Defect Inspection System DI4600",
      url: "https://www.hitachi-hightech.com/global/en/news/nr20231206.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Surface Inspection System LS9300AD",
      url: "https://www.hitachi-hightech.com/global/en/news/nr20240314.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Surface Inspection System LS Series",
      url: "https://www.hitachi-hightech.com/us/en/products/semiconductor-manufacturing/cd-sem/inspection-solution/ls.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "40 Years of Broadband Plasma Inspection",
      url: "https://bbp.kla.com/",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA Announces New Defect Inspection and Review Portfolio",
      url: "https://ir.kla.com/news-events/press-releases/detail/43/kla-announces-new-defect-inspection-and-review-portfolio",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Surfscan SP2XP Wafer Inspection System",
      url: "https://ir.kla.com/news-events/press-releases/detail/387/kla-tencors-new-surfscan-sp2xp-wafer-inspection-system",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Puma 9150 Darkfield Patterned Wafer Inspection System",
      url: "https://ir.kla.com/news-events/press-releases/detail/367/kla-tencor-extends-industrys-darkfield-inspection",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Applied Materials Introduces New Playbook for Process Control Based on Big Data and AI",
      url: "https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-introduces-new-playbook-process-control-based",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Vera Optical Inspection",
      url: "https://www.appliedmaterials.com/sg/en/product-library/vera-optical-inspection.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "SEMVision G9 Defect Analysis",
      url: "https://www.appliedmaterials.com/us/en/product-library/semvision-g9-defect-analysis.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約18分",
  intro: {
    problem:
      "ウェーハ欠陥検査を調べても、パターンなしとパターン付きは何が違うのか、明視野と暗視野はどちらが細かく見えるのか、光学検査のあとになぜSEMで見直すのか分かりにくくありませんか。",
    conclusion:
      "ウェーハ欠陥検査装置は、ウェーハ表面を広く走査し、正常な表面・隣接ダイ・設計情報などの基準と異なる信号を欠陥候補として座標化する装置です。メーカー比較では、対象ウェーハ、工程・用途、照明・検出方式、比較基準、感度と処理能力、不要信号の抑制、レビュー連携、量産運用をそろえます。",
    learnings:
      "欠陥検査と計測の違い、パターンなし・パターン付き、明視野・暗視野、レーザー散乱・広帯域光、隣接ダイ比較、欠陥マップ、不要信号、光学検査と電子線レビュー、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "欠陥検査装置は、最初から欠陥の正体を完全に当てる装置ではありません。広いウェーハ面から『いつもと違う場所』を見つけ、詳しく調べる座標を作る装置です。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜ウェーハを走査し、欠陥候補を工程へ返す",
      description:
        "一般的なウェーハ欠陥検査を単純化した流れです。照明、走査、比較、判定、分類方法は対象ウェーハと装置で異なります。",
      stages: [
        { label: "01 / LOAD", title: "ウェーハを搬送する", body: "ウェーハ種別、工程、向き、レシピを確認し、表面・裏面・外周など検査対象を決める" },
        { label: "02 / SCAN", title: "表面を走査する", body: "レーザー、広帯域光、電子線などを当て、反射・散乱・電子信号を位置情報とともに取得する" },
        { label: "03 / COMPARE", title: "基準と比較する", body: "隣接ダイ、繰返しセル、参照ウェーハ、背景モデル、設計情報などと信号差を取る" },
        { label: "04 / DETECT", title: "異常候補を検出する", body: "しきい値を超えた信号を候補とし、粒子・傷・パターン異常らしい特徴と座標を記録する" },
        { label: "05 / MAP", title: "欠陥マップを作る", body: "数、位置、信号強度、形状、工程・装置履歴をまとめ、空間分布と増減を見える化する" },
        { label: "06 / REVIEW", title: "詳しく見て工程へ返す", body: "代表点を光学・電子線で再観察・分類し、装置点検、洗浄、条件修正、追加検査へつなぐ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置・システムの主要部",
      rightLabel: "主な役割",
      rows: [
        { left: "照明・電子源", right: "レーザー、広帯域光、深紫外光、電子線などをウェーハへ照射する" },
        { left: "対物・検出器・電子光学", right: "正常パターンや表面背景から欠陥信号を分離しやすい条件で反射・散乱・電子信号を集める" },
        { left: "ステージ・回転・搬送", right: "ウェーハ全面を高速かつ再現よく走査し、検出信号へ正しい座標を付ける" },
        { left: "比較・検出アルゴリズム", right: "隣接パターンや背景との差を取り、しきい値を超える異常候補を抽出する" },
        { left: "分類・欠陥マップ", right: "候補を信号・形状・位置でまとめ、工程別・装置別の分布と変化を見える化する" },
        { left: "レビュー・データ連携", right: "SEM画像、設計、工程履歴、製造装置、歩留まりデータと結び付け、原因を絞る" },
      ],
    },
  ],
  sections: [
    {
      id: "inspection-vs-metrology",
      heading: "欠陥検査は広く異常を探し、計測は決めた物理量を測る",
      lead: "検査・計測・レビューを分けると、装置の役割が見えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "役割",
          rightLabel: "主な問い・出力",
          rows: [
            { left: "欠陥検査", right: "ウェーハのどこに正常と異なる信号があるか。欠陥候補の数、座標、信号、画像、分布を出す" },
            { left: "寸法・膜・位置の計測", right: "決めた場所のCD、膜厚、形状、重ね合わせがいくつか。物理量と統計値を出す" },
            { left: "欠陥レビュー", right: "検査で見つけた候補はどのような形・材料・電気的特徴か。高倍率画像と分類を出す" },
            { left: "故障解析", right: "欠陥がなぜ生じ、製品機能へどう影響したか。断面・材料・電気特性を含めて原因を調べる" },
          ],
        },
        {
          type: "note",
          title: "検出された候補が、そのまま製品不良とは限らない",
          body: "検査装置は設定した信号差を候補として出します。実際の影響は、欠陥の種類・大きさ・層・回路上の位置をレビュー画像、設計、工程履歴、電気試験と照合して判断します。",
        },
      ],
      paragraphs: [
        "欠陥検査では、広い範囲を限られた時間で見る必要があります。そのため高感度だけでなく、ウェーハ処理能力、座標精度、正常パターンから出る背景信号の抑制が重要です。",
        "CD-SEMや膜厚計のように測る項目と場所が決まった計測とは、データの意味が異なります。欠陥検査は後続のレビューと原因解析へ渡す入口です。",
      ],
    },
    {
      id: "wafer-types",
      heading: "パターンなしウェーハとパターン付きウェーハでは、基準信号が違う",
      lead: "鏡面に近い表面を調べるか、回路パターンの中から異常を探すかで装置構成が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "対象",
          rightLabel: "主な用途・検出の考え方",
          rows: [
            { left: "パターンなしウェーハ", right: "ポリッシュト、エピ、SOI、成膜後の一様面など。滑らかな背景から粒子・傷・凹凸・結晶由来の異常信号を探す" },
            { left: "ウェーハ出荷・受入検査", right: "ウェーハメーカーの出荷、デバイスメーカーの受入で、表面・裏面・外周の品質を確認する" },
            { left: "装置清浄度モニター", right: "処理前後のモニターウェーハを比較し、製造装置が追加した粒子や表面変化を追う" },
            { left: "パターン付きウェーハ", right: "回路形成中の製品ウェーハ。隣接ダイ・セル・設計などと比較し、繰返しパターンにない異常を探す" },
            { left: "工程後検査", right: "現像、エッチング、成膜、CMP、洗浄などの後で、パターン異常・粒子・傷・表面変化の増加を監視する" },
            { left: "裏面・外周・特殊基板", right: "搬送・チャック・接合へ影響する裏面・外周、SiCなど材料固有の欠陥では専用光学・保持・分類が必要" },
          ],
        },
      ],
      paragraphs: [
        "日立ハイテクは、パターンなし検査をウェーハ出荷・受入と装置清浄度確認へ使い、回転角とレーザー照射位置から欠陥座標を求める原理を説明しています。",
        "パターン付きウェーハでは正常な回路パターン自体が強い信号になります。隣接するダイの画像を引き算し、同じ場所へ繰り返さないランダムな差を欠陥候補として残します。",
      ],
    },
    {
      id: "optical-methods",
      heading: "明視野・暗視野・DICは、集める光と得意な欠陥が違う",
      lead: "明るく見える方式と暗く見える方式という名前だけで優劣は決まりません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "BRIGHTFIELD", title: "明視野検査", body: "鏡面反射やパターン像を含む光を画像化し、正常パターンとの差を詳しく比較します。複雑なパターン異常を調べる用途へ使われます。" },
            { label: "DARKFIELD", title: "暗視野検査", body: "正常表面からの強い反射を避け、粒子・傷・段差などで散乱した光を主に集めます。広い範囲の高速監視へ使われます。" },
            { label: "LASER SCATTER", title: "レーザー散乱", body: "パターンなし表面などへレーザーを当て、粒子・表面欠陥が生む散乱光を検出します。背景粗さと欠陥信号の分離が重要です。" },
            { label: "DIC", title: "微分干渉コントラスト", body: "近接する光路の位相差を明暗へ変え、浅い凹凸のように散乱だけでは区別しにくい表面形状を捉えます。" },
            { label: "BROADBAND", title: "広帯域光・波長選択", body: "複数波長を使い、材料・膜・パターンによる見え方の違いから欠陥信号を高め、背景を抑えます。" },
            { label: "GREYFIELD", title: "中間的な受光条件", body: "正反射と散乱の中間にある信号も利用し、明視野・暗視野だけでは弱い欠陥の検出範囲を広げる考え方です。" },
          ],
        },
        {
          type: "note",
          title: "感度は欠陥寸法だけで決まらない",
          body: "同じ大きさでも、材質、形、高さ、向き、下地、膜、パターン密度、照明波長、入射・受光角で信号が変わります。製品・層・欠陥モードに合う検査条件が必要です。",
        },
      ],
      paragraphs: [
        "日立ハイテクは、一般に明視野をパターン欠陥の詳細検査、暗視野を多数ウェーハの高速検査へ使うと説明しています。ただし実際の製品は複数の照明・受光・空間フィルター・アルゴリズムを組み合わせます。",
        "LS9300ADはパターンなしウェーハ向けに暗視野レーザー散乱とDICを組み合わせ、浅い微小な凹凸欠陥の検出領域を広げています。方式名より、対象とする欠陥信号を確認します。",
      ],
    },
    {
      id: "comparison-logic",
      heading: "パターン付き検査は、正常をどう作るかが検出力を左右する",
      lead: "異常信号を見つけるには、比較相手と位置合わせが必要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較・判定の方法",
          rightLabel: "主な特徴と注意点",
          rows: [
            { left: "Die-to-Die", right: "隣接ダイの同じ座標を比較する。ランダム欠陥を見つけやすいが、同じ場所へ繰り返す系統的異常は差が小さくなる場合がある" },
            { left: "Cell-to-Cell", right: "メモリなどの繰返しセルを比較し、局所差を高感度に探す。正確な周期・位置合わせが必要" },
            { left: "Die-to-Database・設計比較", right: "設計・予測画像と実画像を比較し、繰返し位置に出る系統的なパターン異常も探す。設計データ連携とモデル精度が必要" },
            { left: "参照ウェーハ・前後差", right: "同じ工程の基準や処理前後を比較し、装置・材料・工程が増やした欠陥や表面変化を追う" },
            { left: "背景・ノイズモデル", right: "正常な膜・パターン・粗さ・エッジの信号分布を学び、しきい値と局所条件を変えて異常候補を抽出する" },
            { left: "空間分布・時系列", right: "単独信号だけでなく、リング、放射状、特定ショット、装置部品に対応する分布や急増から工程異常を疑う" },
          ],
        },
      ],
      paragraphs: [
        "隣接ダイ比較は、同じ回路が横に並ぶ半導体ウェーハの特徴を利用します。画像を正確に位置合わせして引き算し、共通パターンを消すことで異常信号を残します。",
        "一方、露光・設計・工程条件に由来して同じ場所へ繰り返す異常は、隣接ダイ同士で消える可能性があります。設計比較、別条件、電気検査、工程データを組み合わせます。",
      ],
    },
    {
      id: "review-and-classification",
      heading: "光学検査で座標を作り、電子線レビューで形と種類を詳しく見る",
      lead: "広さと速さを担う検査、解像と分類を担うレビューを接続します。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜検査候補を、原因解析に使える情報へ変える",
          description:
            "すべての候補を同じ深さで調べるのではなく、分布と代表性を見てレビュー点を選びます。",
          stages: [
            { label: "01 / INSPECT", title: "光学検査で候補を集める", body: "広い面を高速走査し、座標、信号強度、簡易画像、欠陥マップを作る" },
            { label: "02 / SAMPLE", title: "代表点を選ぶ", body: "信号、位置、クラスタ、工程変化から、重要度と代表性の高い候補をサンプリングする" },
            { label: "03 / REDETECT", title: "同じ欠陥を再検出する", body: "座標変換と位置合わせを行い、レビューSEMの視野内で対象候補を見つけ直す" },
            { label: "04 / IMAGE", title: "高倍率像を取る", body: "二次電子・反射電子などから表面形状、材料差、深い構造の見え方を詳しく確認する" },
            { label: "05 / CLASSIFY", title: "種類を分類する", body: "粒子、傷、パターン欠け、ブリッジなどへ分類し、不要信号と重要候補を分ける" },
            { label: "06 / ROOT CAUSE", title: "工程履歴へ戻る", body: "分布、分類、設計位置、装置・材料履歴を照合し、発生工程と対策候補を絞る" },
          ],
        },
        {
          type: "note",
          title: "電子線検査とレビューSEMも同じではない",
          body: "電子線検査は電子線でウェーハ上の異常候補を探索します。レビューSEMは、光学検査などが出した座標へ移動して高倍率観察・分類する役割が中心です。CD-SEMは決めた位置の寸法計測が中心です。",
        },
      ],
      paragraphs: [
        "Applied Materialsは、Enlight光学検査とSEMVision電子線レビューを接続し、光学マップ上の候補を分類して重要な欠陥と不要信号を分ける考え方を示しています。",
        "レビュー処理能力が限られる場合、どの候補を何点見るかが解析結果を左右します。大きな信号だけでなく、新しい分布、特定工程で増えた群、電気的不良と重なる位置を含めます。",
      ],
    },
    {
      id: "recipe",
      heading: "高感度にしすぎると不要信号が増え、低すぎると重要欠陥を逃す",
      lead: "量産レシピは感度・処理能力・誤検出・再現性の釣り合いです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "レシピ・運用項目",
          rightLabel: "主な確認事項",
          rows: [
            { left: "検査領域", right: "全面、ショット、ダイ、セル、エッジ除外、裏面・外周のどこを対象にするか" },
            { left: "照明・受光条件", right: "波長、偏光、入射角、受光角、焦点、明視野・暗視野・複数チャネルをどう使うか" },
            { left: "位置合わせ・比較", right: "ダイ・セルの対応、設計座標、画像変形、膜・パターン差をどこまで補正するか" },
            { left: "しきい値・フィルター", right: "重要欠陥を残しながら、正常エッジ、膜むら、粗さなどの不要信号をどこまで除くか" },
            { left: "感度と処理能力", right: "小さい・弱い信号を探す範囲と、ウェーハ当たり時間、ロット頻度、量産台数を両立できるか" },
            { left: "装置間マッチング", right: "複数台で欠陥数・座標・分類傾向がそろい、レシピを安全に展開できるか" },
            { left: "基準・管理限界", right: "通常分布、急増、クラスタ、再検査、ロット保留、装置点検へ進む条件をどう定義するか" },
            { left: "変更管理", right: "光源、部品、ソフト、アルゴリズム、製品・工程変更後に感度と不要信号が変わっていないか" },
          ],
        },
      ],
      paragraphs: [
        "正常なパターンのエッジ、膜の色・粗さ、焦点差、装置振動でも信号は変わります。すべてを検出するとレビューが追いつかず、本当に重要な欠陥が埋もれます。",
        "逆に不要信号を減らすためにしきい値を上げすぎると、弱い重要欠陥を逃します。既知欠陥、別方式、工程変化、レビュー結果を使い、用途ごとにレシピを評価します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体ウェーハ欠陥検査の代表企業3社",
      lead: "パターン付き、パターンなし、光学検査、電子線レビューの守備範囲を分けて見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "KLA｜米国", right: "広帯域プラズマを使うパターン付き明視野検査、レーザー系の暗視野検査、Surfscanのパターンなし表面検査、eDRなどの電子線レビューと検査データ解析を展開" },
            { left: "日立ハイテク｜日本", right: "DI4600でパターン付きウェーハの暗視野検査、LSシリーズでパターンなし表面のレーザー散乱・DIC検査、CRシリーズで欠陥レビューSEMを展開" },
            { left: "Applied Materials｜米国", right: "Enlight・Veraでパターン付きウェーハの光学検査、SEMVisionで電子線レビュー・分類、ExtractAIで光学検査とレビューのデータ接続を展開" },
          ],
        },
        {
          type: "note",
          title: "企業単位ではなく、同じ対象・工程・役割で比較する",
          body: "同じ企業でもパターン付き明視野、暗視野、パターンなし、電子線レビューは別の製品群です。公式製品名だけを並べず、ウェーハ状態、検出対象、走査方式、比較基準、後続解析をそろえます。",
        },
      ],
      paragraphs: [
        "KLAはウェーハ検査とレビューを幅広く分類し、日立ハイテクはパターン付き暗視野とパターンなし表面検査を公式に分けています。Applied Materialsは光学検査から電子線分類へつなぐ構成を示します。",
        "市場シェアや装置性能の一律順位は、製品世代、工程、欠陥種類、感度条件、処理能力が異なるためこの記事では扱いません。自社用途と同じ条件で製品資料を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "ウェーハ欠陥検査装置メーカーは、8つの条件をそろえて比較する",
      lead: "最小検出寸法だけでなく、量産で重要欠陥を見つけ続けられるかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象ウェーハ", right: "パターンなし・付き、表面・裏面・外周、先端ロジック、メモリ、成熟世代、パワー、特殊基板のどれか" },
            { left: "2. 工程・用途", right: "ウェーハ出荷・受入、装置清浄度、現像後、加工後、CMP後、量産監視、開発、異常解析のどれか" },
            { left: "3. 照明・検出方式", right: "明視野、暗視野、レーザー散乱、広帯域・深紫外、DIC、電子線、複数チャネルをどう使うか" },
            { left: "4. 比較・検出ロジック", right: "Die-to-Die、Cell-to-Cell、設計比較、参照・前後差、しきい値、背景・不要信号の抑制方法" },
            { left: "5. 感度・欠陥捕捉", right: "対象欠陥の材料・形・向き・層で必要信号を捉え、既知欠陥と相関できるか" },
            { left: "6. 処理能力・量産性", right: "ウェーハ当たり時間、検査面積、サンプリング、搬送、稼働率、装置間マッチング、レシピ展開" },
            { left: "7. レビュー・データ連携", right: "欠陥座標、画像、設計、電子線レビュー、自動分類、工程履歴、製造装置、歩留まり解析へ接続できるか" },
            { left: "8. 保守・変更管理", right: "光源・電子源、光学・ステージ校正、標準試料、ソフト更新、部品交換、拠点、長期保守、再認定をどう支えるか" },
          ],
        },
      ],
      paragraphs: [
        "まず、鏡面ウェーハの粒子・表面欠陥を探すのか、製品パターン中の異常を探すのかを決めます。次に、詳細検査と高速監視、光学検査と電子線レビューの役割を分けます。",
        "仕様値を見る場合は、欠陥材料、下地、照明、走査、しきい値、処理能力の条件を確認します。異なる対象で示された最小値だけを横並びにしても、量産での捕捉性能は判断できません。",
      ],
    },
    {
      id: "jobs",
      heading: "欠陥検査装置メーカーの仕事は、光学・画像処理・精密走査・工程解析をつなぐ",
      lead: "小さな異常信号を高速に見つけ、量産判断へ変える複合技術です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OPTICS", title: "光学・電子光学", body: "光源、波長、偏光、入射・受光、対物、検出器、電子線と信号対雑音を設計します。" },
            { label: "MECHANICS", title: "精密機械・搬送", body: "ウェーハ搬送、回転・走査、位置、焦点、除振、温度、表裏・外周対応を設計します。" },
            { label: "ALGORITHM", title: "画像・検出アルゴリズム", body: "位置合わせ、画像差分、特徴抽出、しきい値、不要信号抑制、欠陥分類を実装します。" },
            { label: "APPLICATION", title: "プロセス・アプリ", body: "製品・層・工程・欠陥モードに合うレシピを作り、既知欠陥と相関を取ります。" },
            { label: "DATA", title: "データ・歩留まり解析", body: "欠陥マップ、設計、装置履歴、レビュー、電気試験を結び付け、発生源を絞ります。" },
            { label: "CONTROL", title: "制御・ソフトウェア", body: "装置制御、レシピ、マップ、分類、サーバー、工場システム連携を開発します。" },
            { label: "QUALITY", title: "計測保証・品質", body: "感度、再現性、座標精度、装置間差、標準試料、変更後の再認定を支えます。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、光学・ステージ調整、校正、部品交換、障害解析、レシピ移管を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、パターンなし・付き、明視野・暗視野、光学・電子線、装置ハード・アルゴリズム・アプリ・サービスのどこを担当するかを確認します。",
        "光学、精密機械、画像処理、機械学習、統計、半導体プロセス、品質、生産技術、設備保全、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体ウェーハ欠陥検査装置でよくある質問",
      lead: "対象、原理、検査結果、メーカー比較の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "ウェーハ欠陥検査装置とは何ですか？", answer: "ウェーハ表面を光や電子線で走査し、正常な表面・隣接パターン・設計などと異なる信号を欠陥候補として検出し、座標と欠陥マップを出す装置です。" },
            { question: "主なウェーハ欠陥検査装置メーカーは？", answer: "この記事ではKLA、日立ハイテク、Applied Materialsを代表例として紹介しています。パターン付き・なし、明視野・暗視野、光学検査・電子線レビューで主な製品領域が異なります。" },
            { question: "パターンなしとパターン付き検査の違いは？", answer: "パターンなし検査は鏡面に近い背景から粒子・傷・表面欠陥を探します。パターン付き検査は正常な回路パターンの信号を差し引き、隣接ダイや設計と異なる部分を探します。" },
            { question: "明視野と暗視野の違いは？", answer: "明視野は反射光を含むパターン像を詳しく比較し、暗視野は正常な正反射を避けて欠陥による散乱光を主に集めます。欠陥・工程・必要速度に応じて使い分けます。" },
            { question: "検査で欠陥が出れば不良品ですか？", answer: "必ずしも不良ではありません。検出信号は異常候補です。レビュー画像、種類、大きさ、層、回路位置、電気試験を照合して製品影響を判断します。" },
            { question: "なぜ光学検査のあとにSEMで見直すのですか？", answer: "光学検査は広い面を高速に探しやすく、SEMレビューは候補を高倍率で観察・分類しやすいためです。光学で座標を作り、電子線で形と種類を詳しく見る役割分担です。" },
            { question: "感度を上げれば検査は良くなりますか？", answer: "重要欠陥を捉えやすくなる一方、正常パターンや膜・粗さによる不要信号も増えます。処理能力、レビュー能力、誤検出、既知欠陥の捕捉を合わせて調整します。" },
            { question: "欠陥マップから原因が分かりますか？", answer: "分布は原因を絞る手掛かりになりますが、単独では断定できません。レビュー分類、工程・装置履歴、材料、設計、電気試験と照合します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜広く探し、代表点を詳しく見て、工程へ戻す",
      lead: "ウェーハ欠陥検査は、異常の早期発見と歩留まり学習を支える量産センサーです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "TARGET", title: "対象を分ける", body: "パターンなし・付き、表面・裏面・外周、工程を決める" },
            { label: "SIGNAL", title: "信号を選ぶ", body: "明視野、暗視野、散乱、DIC、広帯域、電子線を使い分ける" },
            { label: "COMPARE", title: "正常と比較する", body: "隣接ダイ、セル、設計、参照、背景モデルから差を取る" },
            { label: "FEEDBACK", title: "レビューして戻す", body: "代表候補を分類し、装置点検、条件修正、再検査へつなぐ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "ウェーハ・マスク・パッケージを含む検査装置の全体地図を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・CD・膜厚・重ね合わせを工程へ戻す流れを見る" },
            { label: "CD-SEM・電子線計測装置メーカー", href: "/guides/semiconductor-cd-sem-manufacturers", description: "欠陥レビューSEM、電子線検査、寸法計測の違いを見る" },
            { label: "膜厚・光学計測装置メーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "異常を探す検査と、膜厚・形状を数値化する光学計測を分ける" },
            { label: "重ね合わせ計測装置メーカー", href: "/guides/semiconductor-overlay-metrology-manufacturers", description: "欠陥座標ではなく上下層のX・Y位置差を測る装置を見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "粒子・表面汚染を減らし、検査結果を改善へつなぐ装置を見る" },
            { label: "半導体洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "粒子・有機物・金属・不要な表面膜を除去する原理を見る" },
            { label: "シリコンウェーハメーカー", href: "/guides/semiconductor-silicon-wafer-manufacturers", description: "パターンなし表面検査の対象となる基板と品質項目を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "欠陥検査が前工程の反復へどう入るか全体像で見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、対象ウェーハ、工程・用途、照明・検出方式、比較・検出ロジック、感度・欠陥捕捉、処理能力・量産性、レビュー・データ連携、保守・変更管理の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "KLA・日立ハイテク・Applied Materialsから1社を選び、公式製品を対象ウェーハ・工程・照明／検出・比較方法・出力マップ・レビュー連携の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-cd-sem-manufacturers",
    "semiconductor-thin-film-optical-metrology-manufacturers",
    "semiconductor-overlay-metrology-manufacturers",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-cleaning-process",
    "semiconductor-silicon-wafer-manufacturers",
    "semiconductor-silicon-wafer-manufacturing",
    "semiconductor-cmp-process",
    "semiconductor-etching-process",
    "photolithography-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["kla", "hitachi-hightech", "applied-materials"],
};
