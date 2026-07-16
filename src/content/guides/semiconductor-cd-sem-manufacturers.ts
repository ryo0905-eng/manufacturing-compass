import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCdSemManufacturersGuide: GuideArticle = {
  slug: "semiconductor-cd-sem-manufacturers",
  title: "半導体CD-SEM・電子線計測装置メーカーとは？日立ハイテク・Applied Materialsなどを初心者向けに図解",
  description:
    "半導体CD-SEMは、電子線画像からレジストや加工後パターンの重要寸法を測る装置です。電子光学、二次電子、エッジ抽出、低ダメージ・帯電対策、CD・CDU・EPE、欠陥レビューとの違い、主要メーカーを図解します。",
  targetQuery: "半導体 CD-SEM メーカー",
  searchIntent:
    "CD-SEM・測長SEMの仕組みと用途、線幅・穴径・CDU・EPEの測定、電子線欠陥検査・レビューSEMとの違い、日立ハイテク・Applied Materials・ASML HMI・KLAなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "日立ハイテク、Applied Materials、ASML HMI、KLAの公式製品・技術情報をもとに、電子線照射、信号検出、画像形成、エッジ抽出、寸法計算、工程フィードバックへ整理しました。CD-SEM、電子線欠陥検査、レビュー装置を同一視せず、測定目的と出力データをそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "検査・計測の全体記事でCD-SEMの基本原理を説明したうえで、量産電子線計測装置と企業を詳しく調べる独立記事が必要だと判断",
    "日立ハイテクとApplied Materialsの公式情報で、EUV・High-NAを含む量産CD計測、装置間マッチング、低ダメージ、3D・高アスペクト比計測の領域を確認",
    "ASML HMIでCD・EPE計測と電子線欠陥検査、KLAで電子線欠陥レビュー・分類の領域を確認し、CD-SEMとの役割差を整理",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Critical Dimension Scanning Electron Microscope (CD-SEM)",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/cd-sem.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Advanced CD Measurement SEM CG7300",
      url: "https://www.hitachi-hightech.com/jp/ja/products/semiconductor-manufacturing/cd-sem/metrology-solution/semi-cg7300.html",
      publisher: "株式会社日立ハイテク",
      accessedAt: "2026-07-16",
    },
    {
      title: "VeritySEM 10 Critical Dimension Metrology",
      url: "https://www.appliedmaterials.com/jp/ja/product-library/veritysem-10-cd-metrology.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "VeritySEM 6C Critical Dimension Metrology",
      url: "https://www.appliedmaterials.com/sg/en/product-library/veritysem-6c-cd-metrology.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Metrology and Inspection Systems",
      url: "https://www.asml.com/products/metrology-and-inspection-systems",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "HMI eP5",
      url: "https://www.asml.com/en/products/metrology-and-inspection-systems/hmi-ep5",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA Annual Report｜E-beam Wafer Defect Review and Classification",
      url: "https://ir.kla.com/sec-filings/all-sec-filings/content/0000319201-24-000021/klac-20240630.htm",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Process: Metrology and Inspection",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/metrology-inspection.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "CD-SEMを調べても、普通の走査電子顕微鏡や欠陥レビューSEMとの違い、画像のどこを線幅として測るのか、電子線を当ててレジストが変わらないのか分かりにくくありませんか。",
    conclusion:
      "CD-SEMは、量産ウェーハ上の決めた位置へ自動で移動し、低エネルギー電子線で画像・信号波形を取得し、同じエッジ判定ルールで重要寸法を繰り返し測る装置です。企業比較では、測定対象、電子光学・信号、CD・形状能力、低ダメージ・帯電、再現性・装置間差、処理能力、自動化・データ、量産支援をそろえます。",
    learnings:
      "CD-SEMの構成、二次電子・反射電子、エッジ抽出、レジスト・エッチング後CD、CDU・EPE・粗さ・3D形状、低加速・帯電・ダメージ、欠陥検査・レビューとの違い、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "CD-SEMは高倍率写真を撮るだけの装置ではありません。同じ測定位置・電子線条件・エッジ判定を量産で再現し、工程の小さな変化を数字として追う『ファブの定規』です。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜電子線画像から重要寸法を測る",
      description:
        "一般的なCD-SEM測定を単純化した流れです。電子線条件、信号、測定アルゴリズム、補正方法は対象構造・装置・レシピで異なります。",
      stages: [
        { label: "01 / LOCATE", title: "測定位置を探す", body: "ウェーハをロードし、アライメントマーク・設計座標・低倍率画像で対象パターンへ移動する" },
        { label: "02 / SCAN", title: "電子線を走査する", body: "電子源から細いビームを作り、焦点・偏向・着地エネルギーを制御して表面を走査する" },
        { label: "03 / DETECT", title: "放出電子を検出する", body: "二次電子・反射電子などの信号を位置ごとに取得し、材料・形状・電位差のコントラストを得る" },
        { label: "04 / IMAGE", title: "画像・波形を作る", body: "信号を画像とラインプロファイルへ変換し、ノイズ、ドリフト、歪み、帯電の影響を補正する" },
        { label: "05 / MEASURE", title: "エッジと寸法を計算する", body: "決めたアルゴリズムで左右の境界を抽出し、線幅、スペース、穴径、位置、粗さなどを求める" },
        { label: "06 / FEEDBACK", title: "工程へ返す", body: "ウェーハ内・ロット間の分布を露光、塗布現像、エッチング、装置・材料履歴と照合する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の主要部",
      rightLabel: "主な役割",
      rows: [
        { left: "電子源・加速系", right: "安定した電子を発生・加速し、必要な電流と着地エネルギーを作る" },
        { left: "電子レンズ・偏向系", right: "電子線を細く集束し、焦点・非点・走査位置・傾斜照射などを制御する" },
        { left: "検出器", right: "表面から出る二次電子、反射電子などを集め、形状・材料・電位差に応じた信号を得る" },
        { left: "真空・ステージ・搬送", right: "電子線経路を保ち、ウェーハを清浄・高速・高精度に測定座標へ運ぶ" },
        { left: "画像・計測アルゴリズム", right: "位置合わせ、ノイズ低減、エッジ抽出、CD・粗さ・位置・形状計算を自動化する" },
        { left: "レシピ・データ基盤", right: "測定点、電子線条件、結果、画像、装置状態を管理し、工程制御・統計解析へ渡す" },
      ],
    },
  ],
  sections: [
    {
      id: "signals",
      heading: "電子線が表面へ当たると、形状・材料・電位に応じた信号が出る",
      lead: "CD-SEMの像は光学写真ではなく、電子と試料の相互作用を画像化したものです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "信号・条件",
          rightLabel: "画像・測定への主な影響",
          rows: [
            { left: "二次電子", right: "表面近くから放出され、エッジ・傾斜・微細な表面形状のコントラストを得る代表信号" },
            { left: "反射電子", right: "入射電子が散乱して戻る信号で、材料組成・深い構造・底部などの観察へ使われる場合がある" },
            { left: "着地エネルギー", right: "分解能、侵入深さ、信号量、帯電、レジストへの影響のバランスを変える" },
            { left: "ビーム電流・照射量", right: "信号対雑音と画像速度を高める一方、試料変化・帯電・汚染を増やす場合がある" },
            { left: "走査速度・積算", right: "速い走査はダメージ低減と処理能力に有利だが、信号が少ない場合はノイズとの調整が必要" },
            { left: "傾斜・多方向画像", right: "上面だけでは分かりにくい側壁、非対称、三次元形状を複数角度・信号で推定する" },
          ],
        },
        {
          type: "note",
          title: "明るい部分が、そのまま物理的な端とは限らない",
          body: "SEM像のエッジコントラストは形状、材料、帯電、電子線・検出器条件で変わります。寸法は校正試料、モデル、エッジアルゴリズム、別の計測・断面解析との相関で確かめます。",
        },
      ],
      paragraphs: [
        "細い電子線を表面へ走査すると、入射位置ごとに放出電子の量が変わります。装置はその信号を明暗へ変換し、パターン境界を抽出します。",
        "同じ物理形状でも、レジスト、酸化膜、金属、導体・絶縁体で信号が異なります。測定レシピはパターン名だけでなく、材料、工程、構造、膜厚、下地へ合わせます。",
      ],
    },
    {
      id: "measurements",
      heading: "CDだけでなく、CDU・粗さ・位置・形状を測る",
      lead: "Critical Dimensionは一つの線幅ではなく、デバイス性能へ重要な寸法の総称です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CD", title: "線幅・スペース・穴径", body: "ライン、スペース、コンタクトホール、ビアなどの代表寸法を測ります。" },
            { label: "CDU", title: "寸法均一性", body: "ウェーハ面内、ショット内、ウェーハ間、装置間のCD分布とばらつきを追います。" },
            { label: "ROUGHNESS", title: "エッジ・幅の粗さ", body: "ラインエッジ・ライン幅の揺らぎを、測定長・フィルター・ノイズ条件をそろえて評価します。" },
            { label: "EPE", title: "エッジ位置誤差", body: "設計・目標位置に対して実際のパターン境界がどこへずれたかを測り、形状忠実度を見る指標です。" },
            { label: "OVERLAY", title: "層・パターン位置", body: "対象構造と方法に応じて、現在層と既存層、複数パターンの位置関係を電子線像から測ります。" },
            { label: "PROFILE", title: "三次元・高アスペクト比", body: "傾斜照射、反射電子、複数画像などを使い、側壁、底部、非対称性、高さに関わる情報を得ます。" },
          ],
        },
      ],
      paragraphs: [
        "現像後CDを測ると露光・レジスト・ベーク・現像の結果を、加工後CDを測ると下地へ形を移した結果を確認できます。両者の差を追うことで、リソグラフィと加工工程を分けて調整できます。",
        "EUV・ILTなどで形状が複雑になると、決めた直線上の幅だけではパターン忠実度を表しにくくなります。輪郭、局所CD、EPE、ホットスポットを設計・計算データと結び付けます。",
      ],
    },
    {
      id: "damage-charging",
      heading: "低ダメージ・帯電・汚染を抑えながら、十分な信号を得る",
      lead: "高解像画像を得る条件が、試料へ最も優しい条件とは限りません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "測定課題",
          rightLabel: "主な影響と対策の考え方",
          rows: [
            { left: "レジスト収縮・変形", right: "電子線照射でレジストの寸法・形状が変わる場合があるため、低着地エネルギー、高速走査、照射履歴を管理する" },
            { left: "帯電", right: "絶縁材料へ電荷がたまり、像の流れ、歪み、明暗変化、ビーム偏向が起こるため、走査・検出・電荷制御を調整する" },
            { left: "コンタミネーション", right: "真空中の残留物が照射部へ堆積し、繰返し測定で像・寸法を変える場合があるため、真空・清浄・照射量を管理する" },
            { left: "焦点・ドリフト", right: "温度、振動、磁場、帯電、ステージ、時間変化で画像位置・焦点が動くため、校正・環境・高速測定で抑える" },
            { left: "パターン倒れ・薄膜", right: "薄いEUVレジストや微細高密度ラインは測定前から不安定な場合があり、電子線条件と測定箇所を慎重に選ぶ" },
            { left: "測定再現性", right: "同じ場所を繰り返すと試料履歴が変わるため、位置、回数、初回・再測定、装置間比較の手順を決める" },
          ],
        },
        {
          type: "note",
          title: "解像度・精度・ダメージ・速度は別の指標",
          body: "細部が見えること、同じ値を繰り返せること、真の寸法へ近いこと、試料を変えないこと、速く測れることは同じではありません。用途ごとにバランスを決めます。",
        },
      ],
      paragraphs: [
        "Applied Materialsは、薄いEUV・High-NA向けレジストを高解像で測りながら電子線との相互作用を抑えるため、低着地エネルギーで細いビームを作る課題を説明しています。",
        "日立ハイテクは高速走査による帯電制御、環境耐性、装置間マッチングを量産CD-SEMの論点として示しています。一台の最高性能だけでなく、複数台が同じ基準で測れることが重要です。",
      ],
    },
    {
      id: "roles",
      heading: "CD-SEM・電子線検査・レビューSEMは、問いと走査範囲が違う",
      lead: "すべて電子線を使いますが、量産工程での役割は同じではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置カテゴリー",
          rightLabel: "主な問い・出力・使い方",
          rows: [
            { left: "CD-SEM・測長SEM", right: "決めた測定点の寸法・形状はいくつか。高精度な数値と分布を出し、工程管理へ使う" },
            { left: "電子線欠陥検査", right: "広い領域・多数の注目箇所のどこに微小な物理・電気的異常があるか。欠陥候補と座標を出す" },
            { left: "欠陥レビューSEM", right: "光学・電子線検査で見つけた座標の欠陥は何か。高倍率画像と自動・人手分類を出す" },
            { left: "研究・解析SEM", right: "材料・構造を詳しく理解できるか。柔軟な観察・分析を行うが、量産自動搬送・処理能力とは評価軸が異なる" },
            { left: "断面FIB-SEM・TEM", right: "内部・側壁・積層構造はどうなっているか。試料加工を伴う詳細解析でインライン計測を補完する" },
            { left: "光学CD・散乱計測", right: "広い面積・多数点を高速・非破壊に測れるか。モデル依存性を考え、CD-SEMと相関させる" },
          ],
        },
      ],
      paragraphs: [
        "ASML HMIのeP5はCD計測と欠陥検出を一つのシステムで行う領域を公式に示しています。装置カテゴリーの境界は重なりますが、レシピごとの目的・走査範囲・出力を確認します。",
        "KLAは電子線欠陥レビュー・分類を製品領域として示します。CD-SEMとレビューSEMは同じSEM技術を共有しても、決めた寸法を統計管理するか、検査候補の正体を絞るかが異なります。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体CD-SEM・電子線計測の代表企業4社",
      lead: "CD計測と隣接する電子線検査・レビューを分けて企業へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "日立ハイテク｜日本", right: "CGシリーズなど量産CD-SEM、EUV世代のCD・CDU・粗さ・位置計測、帯電制御、装置間マッチング。欠陥レビューSEM・光学検査も展開" },
            { left: "Applied Materials｜米国", right: "VeritySEMシリーズでEUV・High-NAの低ダメージCD計測、3D・高アスペクト比、化合物半導体、先端後工程などの電子線計測を展開" },
            { left: "ASML HMI｜オランダ・台湾", right: "eP5などで高解像CD・EPE計測と欠陥検出、eScanシリーズで単一・マルチ電子線の物理・電気的欠陥検査、リソグラフィデータ連携" },
            { left: "KLA｜米国", right: "電子線ウェーハ欠陥レビュー・分類、検査座標との連携、画像・自動分類・プロセス制御データ。CD-SEMと同一用途ではなく隣接領域" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、4社の全製品を同じ競合として並べない",
          body: "日立ハイテクとApplied Materialsは量産CD-SEM、ASML HMIはCD計測と電子線検査、KLAは欠陥レビュー・分類の比重が異なります。共通する測定目的を選んで比較します。",
        },
      ],
      paragraphs: [
        "日立ハイテクとApplied MaterialsはCD計測を明確な製品領域とし、ASML HMIはリソグラフィ・計算データと電子線計測・検査を統合します。KLAは検査装置が出した候補を詳しく見るレビュー領域を持ちます。",
        "企業研究では『電子線装置』を一括りにせず、CD・形状計測、物理欠陥検査、電圧コントラスト検査、欠陥レビュー、研究・断面解析のどこかへ分けます。",
      ],
    },
    {
      id: "comparison",
      heading: "CD-SEM・電子線計測装置メーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、測定目的・電子線・精度・量産運用の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 測定目的・工程", right: "現像後・加工後CD、CDU、粗さ、EPE、3D形状、欠陥検査・レビュー、開発・量産監視のどれか" },
            { left: "2. 対象構造・材料", right: "レジスト、ライン・スペース、穴・ビア、金属・絶縁膜、EUV、FinFET・GAA、3D NAND、化合物、先端後工程" },
            { left: "3. 電子光学・信号", right: "着地エネルギー、電流、ビーム径、傾斜、二次・反射電子、電圧・材料コントラスト、視野" },
            { left: "4. 計測性能", right: "分解能、精度、再現性、真度、エッジ・形状アルゴリズム、粗さノイズ、座標、装置間マッチング" },
            { left: "5. 試料影響・安定性", right: "レジスト収縮、帯電、汚染、焦点・ドリフト、真空、振動・磁場、繰返し照射、測定履歴" },
            { left: "6. 処理能力・サンプリング", right: "搬送、アライメント、撮像・計算時間、測定点数、ウェーハ出力、マルチビーム・注目箇所選択" },
            { left: "7. 自動化・データ連携", right: "レシピ、設計データ、光学計測・検査座標、露光・加工装置、分類、統計、FDC・APC、MES" },
            { left: "8. 量産支援・保守", right: "校正、標準試料、装置間整合、部品・電子源、保守拠点、稼働率、ソフト更新、教育、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "最初にCD計測と欠陥検査・レビューを分けてください。定点の寸法を高精度に繰り返す装置と、広い領域から異常候補を探す装置では、視野・速度・アルゴリズムが異なります。",
        "次に対象材料と工程を固定します。薄いEUVレジスト、高アスペクト比の穴、導電性の低い膜、化合物基板、厚く反った先端後工程基板では、必要な電子線条件・搬送・信号が変わります。",
      ],
    },
    {
      id: "jobs",
      heading: "CD-SEMメーカーの仕事は、電子光学・精密機械・画像計測・工程制御をつなぐ",
      lead: "電子顕微鏡を量産自動計測装置へ仕上げる仕事です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "E-OPTICS", title: "電子光学", body: "電子源、加速、レンズ、偏向、非点・焦点、傾斜、検出器、帯電制御を設計します。" },
            { label: "MECHANICS", title: "真空・精密機械", body: "真空室、ステージ、干渉計、ウェーハ搬送、除振、磁場・熱対策を設計します。" },
            { label: "IMAGING", title: "画像・計測", body: "画像形成、ノイズ低減、エッジ抽出、CD・粗さ・輪郭・形状計算を開発します。" },
            { label: "SOFTWARE", title: "ソフトウェア・データ", body: "自動レシピ、設計照合、GUI、統計、分類、装置・MES連携、解析基盤を作ります。" },
            { label: "PROCESS", title: "プロセス・アプリ", body: "レジスト・膜・構造ごとに電子線条件と計測方法を作り、別計測との相関を取ります。" },
            { label: "METROLOGY", title: "校正・計測保証", body: "精度、再現性、真度、装置間差、標準試料、測定不確かさを評価・維持します。" },
            { label: "QUALITY", title: "製造・品質", body: "組立、調整、出荷試験、電子源・部品、清浄度、変更、信頼性を管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、立上げ、校正、保守、故障解析、装置間整合、稼働・計測改善を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、CD計測・欠陥検査・レビュー・解析のどこか、電子光学・機械・画像・ソフトウェア・アプリケーションのどこを担当するかを確認します。",
        "電子顕微鏡、真空、精密位置決め、画像処理、信号処理、統計・機械学習、半導体プロセス、計測、品質、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体CD-SEM・電子線計測装置でよくある質問",
      lead: "測定原理、寸法、試料影響、レビューSEMとの違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "CD-SEMとは何ですか？", answer: "Critical Dimension Scanning Electron Microscopeの略で、電子線画像から半導体パターンの線幅、スペース、穴径など重要寸法を自動測定する量産向け走査電子顕微鏡です。" },
            { question: "主なCD-SEMメーカーは？", answer: "この記事では日立ハイテクとApplied Materialsを量産CD-SEM、ASML HMIをCD計測・電子線検査、KLAを欠陥レビュー・分類の関連企業として紹介しています。網羅的な市場順位ではありません。" },
            { question: "普通のSEMとCD-SEMの違いは？", answer: "一般的なSEMは柔軟な観察・分析を重視します。CD-SEMは量産ウェーハを自動搬送し、決めた座標・条件・アルゴリズムで寸法を高速かつ繰り返し測ることを重視します。" },
            { question: "CD-SEMと欠陥レビューSEMの違いは？", answer: "CD-SEMは決めた測定点の寸法を数値化します。レビューSEMは検査装置が出した欠陥座標へ移動し、欠陥の形・種類を詳しく観察・分類します。" },
            { question: "SEM画像の明るい端から端を測れば正しいCDになりますか？", answer: "単純には決まりません。信号は形状、材料、帯電、電子線・検出条件で変わるため、エッジアルゴリズム、校正、別計測との相関が必要です。" },
            { question: "電子線でレジストは変化しませんか？", answer: "照射量やエネルギーによって収縮・変形する場合があります。低着地エネルギー、高速走査、測定回数・履歴の管理などで影響を抑えます。" },
            { question: "CDUとCDの違いは？", answer: "CDは個々の重要寸法、CDUはウェーハ面内やショット内、ウェーハ間などでCDがどれだけ均一かを示す考え方です。" },
            { question: "光学計測があればCD-SEMは不要ですか？", answer: "不要にはなりません。光学計測は高速・非破壊で多数点を測りやすく、CD-SEMは局所の高解像画像と寸法を得やすいため、相関させて役割分担します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜電子線画像を、再現可能な寸法データへ変える",
      lead: "CD-SEMはリソグラフィと加工工程を調整する量産センサーです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "SIGNAL", title: "電子信号を理解する", body: "二次・反射電子と形状・材料・電位の関係を見る" },
            { label: "MEASURE", title: "エッジを定義する", body: "画像、波形、アルゴリズム、校正からCD・形状を計算する" },
            { label: "STABILITY", title: "試料と装置を安定させる", body: "低ダメージ、帯電、汚染、焦点、装置間差を管理する" },
            { label: "CONTROL", title: "工程へ返す", body: "現像後・加工後、CDU、EPE、欠陥データを露光・加工条件へつなぐ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "CD、膜厚、重ね合わせ、欠陥を工程へ返す全体像を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "光学・電子線・X線などの装置企業を工程別に見る" },
            { label: "膜厚・光学計測装置メーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "光学OCD・膜厚計測とCD-SEMの役割差を見る" },
            { label: "塗布現像装置メーカー", href: "/guides/semiconductor-coater-developer-manufacturers", description: "現像後CDを作るレジスト塗布・ベーク・現像装置を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "マスク像をレジストへ転写し、CD・EPEの起点を作る装置を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "電子線で測るレジストパターンと材料特性を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "加工後CDと高アスペクト比構造を作る装置を見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像と現像後計測のつながりを見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "計測が前工程のどこへ入るか全体像で見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、測定目的・工程、対象構造・材料、電子光学・信号、計測性能、試料影響・安定性、処理能力・サンプリング、自動化・データ連携、量産支援・保守の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "日立ハイテク・Applied Materials・ASML HMI・KLAから1社を選び、公式製品を測定目的・対象構造・電子線・計測性能・試料影響・データ連携の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-inspection-metrology",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-thin-film-optical-metrology-manufacturers",
    "semiconductor-coater-developer-manufacturers",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "photolithography-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["hitachi-hightech", "applied-materials", "asml", "kla"],
};
