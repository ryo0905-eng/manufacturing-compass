import type { GuideArticle } from "@/content/guides/types";

export const semiconductorInspectionMetrologyGuide: GuideArticle = {
  slug: "semiconductor-inspection-metrology",
  title: "半導体の検査・計測とは？欠陥・CD・膜厚・重ね合わせを初心者向けに図解",
  description:
    "半導体製造の検査・計測を初心者向けに図解。欠陥検査、CD測定、膜厚測定、重ね合わせ測定、レビューSEMの違いと、光学・電子線の特徴、サンプリング、測定データを工程へ戻す流れを整理します。",
  targetQuery: "半導体 検査 計測",
  searchIntent:
    "半導体製造における検査・計測の役割、欠陥検査と寸法・膜厚測定の違い、主な装置、測定データを工程改善へ使う流れを図で理解したい",
  status: "draft",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "日立ハイテク、KLA、レーザーテック、Applied Materialsの公式技術・製品情報をもとに、ウェーハプロセス中の代表的な検査・計測を整理しています。測定点数、判定しきい値、装置条件はデバイス、工程、世代、工場で異なるため、特定の管理値としては記載していません。",
  showCareerCtas: false,
  experienceBasis: [
    "日立ハイテクの公式解説で、計測・検査・欠陥レビューの役割、CD-SEM、膜厚、重ね合わせ、欠陥座標の基本を確認",
    "KLAの公式情報で、光学式パターン付きウェーハ検査、電子線レビュー、工程管理における検査・計測・データ解析のつながりを確認",
    "レーザーテックとApplied Materialsの公式情報で、マスク・ウェーハ向け光学検査、膜厚・表面形状、寸法・欠陥管理の用途を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Semiconductor Manufacturing Process: Metrology and Inspection",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/metrology-inspection.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Critical Dimension Scanning Electron Microscope (CD-SEM)",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/cd-sem.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Semiconductor Glossary",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/words.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Broadband Plasma Optical Patterned Wafer Inspection",
      url: "https://bbp.kla.com/",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "KLA-Tencor Launches Inspection and E-Beam Review Systems",
      url: "https://ir.kla.com/news-events/press-releases/detail/292/kla-tencor-launches-2830-and-puma-9500-series-edr-5210",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Lasertec Business and Core Technologies",
      url: "https://www.lasertec.co.jp/en/company/business.html",
      publisher: "Lasertec Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Applied Materials Annual Report: Metrology and Inspection",
      url: "https://ir.appliedmaterials.com/static-files/8ea2c6b9-eb3d-4b2f-8dad-6c64cb84d641",
      publisher: "Applied Materials",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "検査、計測、測定、レビューという言葉が並ぶと、どれも『ウェーハを見る仕事』に思えませんか。実際には、探す対象、出力するデータ、工程へ返す判断が異なります。",
    conclusion:
      "計測はCD・膜厚・重ね合わせなどを数値化し、検査は広い範囲から異常候補と座標を探し、レビュー・分析は候補を詳しく観察して種類や原因を絞ります。これらを工程条件と結び付け、加工、測定、判断、調整を循環させることが工程管理の基本です。",
    learnings:
      "検査・計測・レビューの違い、CD・膜厚・重ね合わせ、光学式と電子線式、欠陥座標と分類、サンプリング、精度・再現性、工程へのフィードバック、関連職種・企業。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "検査・計測は『合格品を最後に選ぶ』だけではありません。工程の途中で小さな変化を見つけ、次のウェーハを良くするためのセンサーとして捉えると全体像がつながります。",
      caption: "この記事の見方",
    },
    {
      type: "process-control-loop",
      title: "図解｜加工結果を測り、原因を絞り、工程へ戻す",
      description:
        "検査・計測は単独で完結せず、装置・材料・レシピ・設計データと結び付けて使います。異常時は対象ロットを止める判断と、次の処理を調整する判断を分けます。",
      stages: [
        { kind: "process", label: "PROCESS", title: "工程で形を作る", body: "成膜、露光、現像、エッチング、CMPなどで膜・寸法・表面を作る", output: "装置履歴、材料履歴、加工済みウェーハ" },
        { kind: "measure", label: "INSPECT / MEASURE", title: "異常と数値を捉える", body: "欠陥候補を探し、CD・膜厚・重ね合わせなどを測定する", output: "測定値、分布、欠陥座標、画像" },
        { kind: "review", label: "REVIEW / ANALYZE", title: "種類と原因を絞る", body: "高倍率画像や複数データを照合し、工程変動か測定ノイズかを判断する", output: "欠陥分類、傾向、原因仮説" },
        { kind: "feedback", label: "FEEDBACK", title: "止める・直す・確認する", body: "ロット判定、装置点検、条件補正、追加測定を行い、再発を監視する", output: "処置、補正値、確認計画" },
      ],
    },
  ],
  sections: [
    {
      id: "difference",
      heading: "計測・検査・レビューは、問いと出力データが違う",
      lead: "まず『何を知りたいか』で三つに分けると、装置の役割を理解しやすくなります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "役割",
          rightLabel: "答える問いと主な出力",
          rows: [
            { left: "計測（Metrology）", right: "寸法や膜厚は目標値に対していくつか。数値、分布、統計量を出す" },
            { left: "検査（Inspection）", right: "どこに異常候補があるか。欠陥数、座標、信号強度、簡易画像を出す" },
            { left: "レビュー（Review）", right: "候補は何で、どの工程に関係しそうか。高倍率画像と分類を出す" },
            { left: "分析（Analysis）", right: "材料・形状・電気特性から、なぜ起きたかを絞る。原因仮説と根拠を出す" },
          ],
        },
      ],
      paragraphs: [
        "日立ハイテクは、計測の例としてパターン線幅・穴径、膜厚、重ね合わせを挙げ、検査では粒子やパターン欠陥を検出してウェーハ上のX・Y座標を取得すると説明しています。検査で見つけた座標をレビュー装置へ渡せば、同じ場所を詳しく観察できます。",
        "境界は装置によって重なります。一台で画像取得と寸法測定を行う場合や、検査画像から自動分類する場合もあります。名称だけで判断せず、視野、感度、速度、出力、工程での使い方を確認します。",
      ],
    },
    {
      id: "metrology-items",
      heading: "代表的な計測項目は、膜の厚さ・形の寸法・層どうしの位置",
      lead: "工程が作ろうとした物理量を、目的に合う方法で数値へ変えます。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "THICKNESS", title: "膜厚・膜厚分布", body: "光の反射や偏光などを使い、薄膜の厚さとウェーハ面内分布を測ります。複数膜では光学モデルが重要です。" },
            { label: "CD", title: "線幅・穴径", body: "CD-SEMなどでパターンの幅や穴の直径を測り、露光・現像・エッチング結果を管理します。" },
            { label: "OVERLAY", title: "重ね合わせ", body: "現在の層と下の層の位置ずれをX・Y方向などで測り、露光装置や工程条件へ補正を返します。" },
            { label: "PROFILE", title: "高さ・段差・表面形状", body: "CMP後の段差、粗さ、うねりや加工深さなど、平面だけでは分からない形状を測ります。" },
            { label: "MATERIAL", title: "材料・構造の情報", body: "光学応答やX線、電子線などを使い、膜構造や材料状態を評価します。必要な破壊性と分析深さを確認します。" },
            { label: "ELECTRICAL", title: "電気的な特性", body: "シート抵抗などを測り、膜厚・組成・熱処理・ドーピング結果を電気特性の側から確認します。" },
          ],
        },
      ],
      paragraphs: [
        "同じ『膜厚』でも、ウェーハ全面の分布を速く知りたい場合と、微小領域の積層構造を詳しく知りたい場合では方法が変わります。非破壊・高速のインライン計測と、断面加工を伴う詳細分析を役割分担させます。",
        "測定値は真値そのものではなく、校正、装置状態、測定位置、解析モデル、試料状態の影響を含みます。単位と測定方法をそろえずに、異なる装置の数字だけを比較しないことが重要です。",
      ],
    },
    {
      id: "cd-sem",
      heading: "CD-SEMは、微細パターンの画像から寸法を繰り返し測る",
      lead: "Critical Dimensionは、工程性能を左右する重要寸法という意味です。",
      blocks: [
        {
          type: "process-flow",
          title: "CD-SEM測定を単純化した流れ",
          description: "実際にはアライメント、焦点、帯電対策、画像処理、レシピ管理を自動で行います。",
          stages: [
            { label: "01", title: "測定位置へ移動", body: "設計座標やアライメントマークを使い、対象パターンを探す" },
            { label: "02", title: "電子線を走査", body: "表面へ低エネルギーの電子線を当て、放出信号を検出" },
            { label: "03", title: "画像・波形を作る", body: "パターン境界のコントラストと信号プロファイルを得る" },
            { label: "04", title: "エッジを判定", body: "決めたアルゴリズムで左右の境界を抽出し、寸法を計算" },
            { label: "05", title: "分布を工程へ返す", body: "位置ごとのCD傾向を露光・現像・エッチング条件と照合" },
          ],
        },
      ],
      paragraphs: [
        "日立ハイテクはCD-SEMについて、電子線で微細パターンの画像を得て、画像コントラストやラインプロファイルからレジスト、穴・ビア、配線などの寸法を自動測定すると説明しています。現像後とエッチング後を比べれば、パターン転写で寸法がどう変わったかを追えます。",
        "電子線は高い空間分解能を得やすい一方、絶縁物の帯電、電子線による試料変化、測定時間を考慮します。測定回数を増やせば必ず良いわけではなく、必要な位置と再現性を保ちながら影響を抑えます。",
      ],
    },
    {
      id: "inspection-methods",
      heading: "欠陥検査は、広い範囲を速く見る光学式と、細部を見る電子線式を使い分ける",
      lead: "感度、速度、視野、材料、パターンの有無の間にトレードオフがあります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表方式",
          rightLabel: "得意なことと注意点",
          rows: [
            { left: "光学・明視野", right: "反射像や設計・隣接パターンとの差を比較し、広い範囲を高速に検査する" },
            { left: "光学・暗視野", right: "粒子や凹凸から散乱した光を捉え、背景から欠陥信号を分離する" },
            { left: "電子線検査", right: "微細形状や電位差に関係する異常を高感度で捉えやすいが、一般に走査範囲と速度に制約がある" },
            { left: "レビューSEM", right: "検査座標へ移動して高倍率画像を取得し、欠陥の形・位置関係を分類する" },
          ],
        },
      ],
      paragraphs: [
        "KLAは、パターン付きウェーハのインライン光学検査を工程変動の早期検出に使い、明視野・暗視野の検査と電子線レビュー・分類を組み合わせる考え方を示しています。レーザーテックも光応用技術を使い、フォトマスクやウェーハの検査・計測を提供しています。",
        "検査は正常パターンとの差を探すため、回路パターンそのものの信号が背景になります。微小欠陥を拾おうと感度を上げると、実害の小さい差やノイズも候補になりやすく、検出感度と不要候補の量を調整する必要があります。",
      ],
    },
    {
      id: "review-classification",
      heading: "欠陥座標をレビューし、形・場所・共通性から原因を絞る",
      lead: "欠陥数だけでなく、どのように分布し、どの装置履歴と重なるかを見ます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "MAP", title: "ウェーハマップ", body: "中心、外周、リング状、局所、ランダムなど、座標分布から工程との関係を考えます。" },
            { label: "IMAGE", title: "欠陥画像", body: "粒子、傷、パターン欠け、ブリッジ、残膜などを形と周辺構造から分類します。" },
            { label: "HISTORY", title: "装置・材料履歴", body: "処理時刻、チャンバー、ヘッド、搬送経路、材料ロット、保全履歴と照合します。" },
          ],
        },
        {
          type: "note",
          title: "検出した候補が、すべて電気的不良とは限らない",
          body: "検査装置は設定した信号差を候補として出します。デバイスへの影響は、欠陥の種類、位置、層、寸法、回路との関係で変わるため、レビュー、電気試験、歩留まりデータと照合します。",
        },
      ],
      paragraphs: [
        "検査で座標を得た後、レビューSEMなどがその場所へ移動して画像を保存します。自動分類を使う場合も、分類の基準となる画像と工程知識が必要です。新しい欠陥や分類しにくい候補は、人が画像と履歴を見て確認します。",
        "リング状なら回転や外周条件、一直線なら搬送接触、特定ショットなら露光、特定チャンバーだけなら装置差というように、分布は原因仮説の入口になります。ただし形だけで断定せず、再現試験と別の測定で確かめます。",
      ],
    },
    {
      id: "sampling-quality",
      heading: "全数・全面を最高感度で測れないため、サンプリングを設計する",
      lead: "測定時間を増やすほど発見機会は増えますが、製造の流れと測定影響も考えます。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "WHERE", title: "どこを測るか", body: "中心・中間・外周、密集・孤立、上下左右、重要回路など、変動を捉えられる位置を選びます。" },
            { label: "WHEN", title: "いつ測るか", body: "工程直後、装置保全後、材料切替後、異常発生後など、変化点に合わせて頻度を変えます。" },
            { label: "HOW MANY", title: "何枚・何点測るか", body: "工程能力、異常リスク、測定時間、破壊性を見ながらロットとウェーハ内の点数を決めます。" },
            { label: "ESCALATION", title: "いつ追加測定するか", body: "管理限界超過、急な傾向変化、特定欠陥の増加を条件に、点数やレビュー率を増やします。" },
          ],
        },
      ],
      paragraphs: [
        "日立ハイテクは、ウェーハプロセスの重要点で計測・検査を行い、複数点をサンプリングすると説明しています。平均値だけでは中心と外周の逆方向の変化を見落とすため、空間分布も確認します。",
        "開発段階は多くの点を詳しく測り、量産では変動を代表する少数点を速く監視するなど、目的で設計を変えます。異常を見つけたら追加測定へ切り替える二段階の運用も有効です。",
      ],
    },
    {
      id: "measurement-quality",
      heading: "工程を語る前に、測定そのものの信頼性を確認する",
      lead: "測定のばらつきが工程変動より大きければ、正しい調整はできません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "確認する性質",
          rightLabel: "初心者向けの意味",
          rows: [
            { left: "正確さ", right: "基準値や妥当な参照値から大きくずれていないか" },
            { left: "精密さ・繰返し性", right: "同じ試料を同じ条件で測ったとき、値がどの程度そろうか" },
            { left: "再現性・装置間差", right: "担当者、時刻、装置を変えても、同じ判断ができるか" },
            { left: "安定性", right: "校正用試料や監視値が時間とともに漂っていないか" },
            { left: "不確かさ", right: "測定値にどの程度の幅を見込むべきか" },
          ],
        },
      ],
      paragraphs: [
        "測定装置にも温度、振動、汚れ、電子源・光源の変化、ステージ位置、解析レシピの影響があります。標準試料、定期校正、装置間マッチング、同一試料の反復測定で測定系を監視します。",
        "しきい値の近くで値が揺れる場合は、工程の良否と測定ばらつきを分けて考えます。小数点以下の桁が表示されても、その桁まで意味があるとは限りません。",
      ],
    },
    {
      id: "process-points",
      heading: "各工程の直後に、次工程へ影響する値と欠陥を確認する",
      lead: "測定項目は装置ごとではなく、工程が作る結果から選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・タイミング",
          rightLabel: "代表的に見るもの",
          rows: [
            { left: "成膜後", right: "膜厚、面内均一性、光学特性、シート抵抗、粒子・欠陥" },
            { left: "現像後（ADI）", right: "レジストCD、穴径、重ね合わせ、パターン倒れ、現像残り" },
            { left: "エッチング後（AEI）", right: "加工後CD、深さ、側壁・底部、残留物、ブリッジ・欠け" },
            { left: "CMP後", right: "残膜、膜厚分布、段差、ディッシング、エロージョン、傷・粒子" },
            { left: "洗浄後", right: "粒子、有機・金属汚染、乾燥跡、表面状態、パターンダメージ" },
          ],
        },
      ],
      paragraphs: [
        "たとえば現像後CDとエッチング後CDを同じ位置関係で測れば、リソグラフィ由来の変動とエッチング転写由来の変動を分けやすくなります。工程間で測定項目と座標をつなぐことが大切です。",
        "検査を追加する場所は、欠陥が生じやすい工程だけでなく、後続工程で隠れて観察できなくなる直前も候補です。早く見つけるほど追加加工の損失と原因候補を減らせます。",
      ],
    },
    {
      id: "feedback",
      heading: "測定データは、統計的な傾向と物理メカニズムの両方で工程へ返す",
      lead: "一つの外れ値だけで条件を動かさず、測定系・装置履歴・前後工程を確認します。",
      blocks: [
        {
          type: "process-flow",
          title: "異常を見つけた後の基本フロー",
          description: "実際の処置は品質システムと製品リスクに従います。",
          stages: [
            { label: "01", title: "測定を確かめる", body: "再測定、標準試料、別装置で測定系の異常を切り分ける" },
            { label: "02", title: "影響範囲を決める", body: "同一ロット、前後ロット、装置、材料、時間帯を絞る" },
            { label: "03", title: "原因を仮定する", body: "分布、画像、装置履歴、前工程データから候補を立てる" },
            { label: "04", title: "処置・補正する", body: "ロット判定、装置点検、条件補正、材料確認を実施する" },
            { label: "05", title: "効果を監視する", body: "次の測定で改善と副作用を確認し、再発傾向を見る" },
          ],
        },
      ],
      paragraphs: [
        "管理図などの統計手法は、平均値が規格内でも少しずつ動く傾向や、通常と異なる変動を見つける助けになります。一方、補正方向を決めるには、膜成長、露光、エッチング、研磨などの物理メカニズムが必要です。",
        "自動補正を使う場合も、入力データの品質、補正上限、適用範囲、異常時の停止条件を設計します。誤った測定値を自動で返すと変動を広げるため、データの妥当性確認が前提です。",
      ],
    },
    {
      id: "roles",
      heading: "検査・計測には、光学・電子線・画像処理・統計・工程知識が集まる",
      lead: "装置で測るだけでなく、測定レシピと判断基準を製造工程へ組み込みます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス・インテグレーション", right: "管理項目、測定位置、頻度、判定と工程への戻し方を決める" },
            { left: "計測・検査エンジニア", right: "装置条件、測定レシピ、感度、再現性、装置間差を最適化する" },
            { left: "光学・電子線", right: "照明、検出器、電子光学、真空、帯電、信号対雑音を設計・維持する" },
            { left: "画像・データ解析", right: "位置合わせ、エッジ抽出、欠陥検出・分類、傾向監視を実装する" },
            { left: "品質・歩留まり", right: "欠陥と電気的不良を結び付け、影響範囲と優先順位を判断する" },
            { left: "装置保全・フィールド", right: "校正、光源・電子源、ステージ、真空、標準試料を安定させる" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "検査・計測が前工程の反復と後工程へどう入るか確認する" },
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "CDと重ね合わせを作り込む露光・現像工程を見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "膜厚・均一性・欠陥を管理する対象工程を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "加工後CD・深さ・断面を作る工程を見る" },
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "平坦度・残膜・表面欠陥を管理する工程を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、装置、材料、検査・計測企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "KLA、日立ハイテク、レーザーテック、Applied Materialsなどが、ウェーハ・マスク向けの検査、寸法・膜厚・形状計測、電子線レビューなどを提供しています。デバイスメーカーでは、測定装置のデータを製造装置、材料、設計、電気試験のデータと結び付けます。",
      ],
    },
    {
      id: "scope",
      heading: "ウェーハテスト・最終検査とは目的とタイミングが異なる",
      lead: "この記事は、主にウェーハプロセス途中の形状・膜・欠陥を扱います。",
      blocks: [
        {
          type: "note",
          title: "工程途中の検査・計測と、製品機能の試験を分ける",
          body: "ウェーハテストはプローブでチップの電気的機能を確かめ、最終検査はパッケージ後の製品を試験します。工程途中の検査・計測は、形や材料の変動を早く見つけて工程へ返す役割が中心です。相互にデータを照合しますが、装置と判定目的は異なります。",
        },
      ],
      paragraphs: [
        "工程中に見つけた欠陥が実際の電気特性へ影響したかは、後のウェーハテストや歩留まりデータで確認できます。逆に電気的不良の分布から、前工程の検査画像や装置履歴へさかのぼる解析も行います。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の検査・計測でよくある質問",
      lead: "用語、装置、データの使い方を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の検査と計測は何が違いますか？", answer: "計測はCD、膜厚、重ね合わせなどの物理量を数値化します。検査は広い範囲から粒子やパターン異常の候補を探し、座標と信号を出します。装置によって両方の機能を持つ場合もあります。" },
            { question: "CD-SEMは何を測りますか？", answer: "電子線で微細パターンの画像を取得し、線幅、穴径、スペースなどの重要寸法を測ります。現像後やエッチング後の寸法管理に使われます。" },
            { question: "光学検査と電子線検査はどちらが優れていますか？", answer: "目的で異なります。光学式は広い範囲を高速に検査しやすく、電子線式は微細な形状や電気的なコントラストを高感度で捉えやすい一方、一般に走査速度との両立が課題です。" },
            { question: "検査で見つけた欠陥はすべて不良ですか？", answer: "いいえ。検査は設定した信号差を候補として検出します。電気的な影響は、種類、寸法、位置、層、回路との関係をレビューや後工程の試験データと照合して判断します。" },
            { question: "なぜウェーハ全面を毎回詳しく測らないのですか？", answer: "測定時間、装置能力、試料への影響、製造量との釣り合いがあるためです。工程変動を代表する位置と頻度を選び、異常時に追加測定する方法が使われます。" },
            { question: "検査・計測とウェーハテストは同じですか？", answer: "異なります。検査・計測は主に工程途中の形状、膜、位置ずれ、欠陥を確認します。ウェーハテストはプローブを使い、形成済みチップの電気的な機能を確認します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜探す・測る・詳しく見る・工程へ戻す",
      lead: "検査・計測は、加工結果を次の改善へつなぐ工程の目と耳です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "INSPECT", title: "異常を探す", body: "広い範囲から欠陥候補と座標を見つける" },
            { label: "MEASURE", title: "数値で測る", body: "CD、膜厚、重ね合わせ、形状を数値化する" },
            { label: "REVIEW", title: "詳しく見る", body: "画像と履歴から種類・影響・原因を絞る" },
            { label: "FEEDBACK", title: "工程へ戻す", body: "ロット判定、装置点検、条件補正と再確認へつなぐ" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、トランジスタや配線を作り終えたウェーハへ電気的に接触し、チップごとの機能を確認するウェーハテストを取り上げます。",
      ],
    },
  ],
  todayQuest: "身近な製造品を例に、『寸法を測る』『異常を探す』『原因を詳しく見る』『工程へ返す』を分けて説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "photolithography-process",
    "semiconductor-deposition-process",
    "semiconductor-etching-process",
    "semiconductor-cleaning-process",
    "semiconductor-cmp-process",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["kla", "hitachi-hightech", "lasertec", "applied-materials"],
};
