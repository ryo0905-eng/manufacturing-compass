import type { GuideArticle } from "@/content/guides/types";

export const semiconductorOverlayMetrologyManufacturersGuide: GuideArticle = {
  slug: "semiconductor-overlay-metrology-manufacturers",
  title: "半導体重ね合わせ計測装置メーカーとは？KLA・ASML・Onto Innovation・Applied Materialsを初心者向けに図解",
  description:
    "半導体の重ね合わせ計測装置は、上下の回路パターンの位置ずれを測ります。画像式・回折式・電子線式、現像後・加工後、測定マーク・製品内計測、補正マップ、主要メーカーの違いを図解します。",
  targetQuery: "半導体 重ね合わせ 計測装置 メーカー",
  searchIntent:
    "半導体の重ね合わせ計測とは何か、露光装置の位置合わせとの違い、画像式・回折式・電子線式、現像後・加工後、KLA・ASML・Onto Innovation・Applied Materialsなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "KLA、ASML、Onto Innovation、Applied Materials、日立ハイテクの公式製品・技術情報をもとに、測定位置へ移動する、上下層の信号を取得する、位置中心・位相・輪郭を求める、重ね合わせベクトルとウェーハマップを作る、誤差成分を分解する、露光・工程へ補正を返す流れへ整理しました。画像式、回折式、製品内光学計測、電子線計測を同一視せず、測定対象と工程時点を分けて説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "検査・計測、CD-SEM、膜厚・光学計測の記事を公開したうえで、リソグラフィのもう一つの重要管理項目である重ね合わせを独立記事にする必要があると判断",
    "KLAで画像式重ね合わせ計測、ASMLで現像後の回折式と加工後の製品内光学計測、Onto Innovationで先端後工程・化合物・MEMS向け画像計測を確認",
    "Applied Materialsで製品パターン・埋もれた層を対象にした電子線CD・重ね合わせ計測を確認し、光学マーク計測を補う領域として整理",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Archer 800 Imaging-Based Overlay Metrology System",
      url: "https://www.kla.com/wp-content/uploads/Archer_800_Rev1.4_May_16_2025_DIGITAL.pdf",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA Introduces New IC Metrology Systems",
      url: "https://ir.kla.com/news-events/press-releases/detail/24/kla-introduces-new-ic-metrology-systems",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "YieldStar 380G",
      url: "https://www.asml.com/en/products/metrology-and-inspection-systems/yieldstar-380g",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "YieldStar 1385",
      url: "https://www.asml.com/en/products/metrology-and-inspection-systems/yieldstar-1385",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "IVS 380 System",
      url: "https://ontoinnovation.com/products/ivs-380/",
      publisher: "Onto Innovation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Metrology Products",
      url: "https://ontoinnovation.com/product-categories/metrology/",
      publisher: "Onto Innovation",
      accessedAt: "2026-07-16",
    },
    {
      title: "PROVision 10 eBeam Metrology",
      url: "https://www.appliedmaterials.com/us/en/product-library/provision-10-ebeam-metrology.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "PROVision 4E eBeam Metrology",
      url: "https://www.appliedmaterials.com/eu/en/product-library/provision-4e-ebeam-metrology.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Process: Metrology and Inspection",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/metrology-inspection.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Process: Accuracy and Precision",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/manufacturing/accuracy-precision.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約18分",
  intro: {
    problem:
      "重ね合わせ精度を調べても、露光装置が位置合わせしているのになぜ別の計測装置が必要なのか、画像式と回折式は何が違うのか、X・Yのずれを測ったあと何へ補正するのか分かりにくくありませんか。",
    conclusion:
      "重ね合わせ計測装置は、今回作った上層パターンと既存の下層パターンの相対位置を測り、各測定点のX・Yずれをウェーハマップへ変換する装置です。量産では、現像後に再加工可否と露光補正を判断し、加工後に転写結果を検証します。メーカー比較では、工程時点、測定対象、画像・回折・電子線、マーク・製品内、精度・再現性、サンプリング、誤差モデル、露光・工程連携をそろえます。",
    learnings:
      "重ね合わせの意味、露光アライメントとの違い、X・Yベクトル、並進・回転・倍率・直交・高次歪み、画像式・回折式・製品内光学・電子線、現像後・加工後、測定マーク、装置起因ずれ、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "細い回路を描けても、下の配線や穴から位置がずれれば電気的につながりません。重ね合わせ計測は、回路の『細さ』ではなく、層と層の『位置関係』を守るための計測です。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜上下層の位置ずれを測り、工程へ返す",
      description:
        "一般的な重ね合わせ計測を単純化した流れです。測定マーク、光学方式、誤差モデル、補正方法は製品・層・装置で異なります。",
      stages: [
        { label: "01 / LOCATE", title: "測定位置を探す", body: "ウェーハを位置合わせし、スクライブ領域の専用マークや製品内パターンへ移動する" },
        { label: "02 / ACQUIRE", title: "上下層の信号を取る", body: "画像、回折光、反射光、電子線像などから上層と下層に対応する信号を取得する" },
        { label: "03 / EXTRACT", title: "中心・位相・輪郭を求める", body: "マーク中心、回折非対称、エッジ・輪郭など、方式に合う位置情報を抽出する" },
        { label: "04 / CALCULATE", title: "X・Yずれを計算する", body: "同じ場所の上下層位置を引き算し、方向と大きさを持つ重ね合わせベクトルへ変換する" },
        { label: "05 / MAP", title: "ウェーハマップを作る", body: "多数点のベクトルを並進、回転、倍率、直交、高次の局所変形などへ分解する" },
        { label: "06 / CORRECT", title: "露光・工程へ返す", body: "次ロット・次ウェーハの露光補正、装置点検、現像後の再加工判断、加工工程の原因解析へ使う" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置・システムの主要部",
      rightLabel: "主な役割",
      rows: [
        { left: "照明・電子源", right: "可視・広帯域・選択波長の光、または電子線を対象マーク・パターンへ照射する" },
        { left: "対物・受光・電子光学", right: "上下層の信号を分離しやすい条件で画像・回折・反射・電子信号を取得する" },
        { left: "精密ステージ・搬送", right: "多数の測定点へ高速に移動し、位置、焦点、高さ、ウェーハ方向をそろえる" },
        { left: "位置抽出アルゴリズム", right: "中心、エッジ、位相、回折非対称から上層・下層の相対位置を求める" },
        { left: "誤差・補正モデル", right: "X・Yベクトルをウェーハ、ショット、装置、工程に由来する成分へ分解する" },
        { left: "データ・工程連携", right: "露光装置、塗布現像装置、加工装置、APC・MESへ測定値、判定、補正量を渡す" },
      ],
    },
  ],
  sections: [
    {
      id: "meaning",
      heading: "重ね合わせは、上層と下層の位置差をX・Yベクトルで表す",
      lead: "一つの数値だけでなく、ウェーハとショットのどこで、どちらへずれたかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "誤差の見方",
          rightLabel: "マップで表れる主な傾向",
          rows: [
            { left: "X・Yオフセット", right: "ウェーハやショット全体が同じ方向へ平行移動している" },
            { left: "回転", right: "中心を基準に、測定ベクトルの方向が周方向へ変化する" },
            { left: "倍率・スケール", right: "中心から外周へ向かって広がる、または縮む傾向が出る" },
            { left: "直交・台形", right: "X軸とY軸の関係、投影・ステージ・マスクなどに由来する斜めの変形成分が出る" },
            { left: "ウェーハ高次歪み", right: "成膜、熱、研磨、接合、チャックなどにより場所ごとに異なる非線形変形が出る" },
            { left: "ショット内・製品内局所差", right: "マークとデバイス、中心と端、パターン密度などによる局所的な位置差が出る" },
          ],
        },
        {
          type: "note",
          title: "重ね合わせ値は、二つの層と測定方向の組み合わせ",
          body: "同じウェーハでも、どの上層と下層を比べるか、X・Yのどちらか、現像後か加工後かで意味が変わります。数値だけでなく層、工程、マーク、座標、測定条件を一緒に管理します。",
        },
      ],
      paragraphs: [
        "日立ハイテクは、重ね合わせ計測をウェーハへ転写された第1層と第2層のショット位置精度を確認する計測として説明しています。上層位置から下層位置を引けば、ずれの方向と大きさが得られます。",
        "量産では一つのマークだけで判断せず、複数のダイ・ショット・ウェーハを測ります。ベクトルの分布から、露光装置の補正で戻せる成分と、前後工程・ウェーハ変形を調べる成分を分けます。",
      ],
    },
    {
      id: "alignment",
      heading: "露光装置のアライメントと、露光後の重ね合わせ計測は役割が違う",
      lead: "露光前に合わせる機能と、実際にできた結果を検証する計測を循環させます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "機能・工程",
          rightLabel: "主な問いと使い方",
          rows: [
            { left: "露光前アライメント", right: "露光装置が既存マークを読み、これから転写するマスク像をどこへ置くか決める" },
            { left: "露光・現像", right: "位置合わせ結果を使ってレジストへ上層パターンを作る。レジスト・ウェーハ・装置の影響も加わる" },
            { left: "現像後重ね合わせ計測", right: "レジスト上の上層と下層を測り、加工前に再加工・補正・継続の判断材料を作る" },
            { left: "エッチングなどの加工", right: "レジスト形状を下地へ転写する。加工非対称、膜・応力・ウェーハ変形などが位置へ影響する場合がある" },
            { left: "加工後重ね合わせ計測", right: "下地へ転写された実パターンの位置関係を測り、リソグラフィと加工を含む結果を確認する" },
            { left: "次の露光へフィードバック", right: "測定マップから補正値、装置間整合、点検・工程調整を決め、次ウェーハ・次ロットへ反映する" },
          ],
        },
      ],
      paragraphs: [
        "露光装置はマークを読んで位置を合わせますが、ウェーハ変形、マーク品質、レジスト、現像、加工などの結果まで事前に完全には分かりません。そのため露光後に別の計測で実績を確認します。",
        "ASMLのYieldStar 380Gは現像後の重ね合わせ・焦点計測、YieldStar 1385は加工後の製品内重ね合わせ計測を公式に示します。測定時点を分けると、どの工程までの影響を含む値かが明確になります。",
      ],
    },
    {
      id: "methods",
      heading: "画像式・回折式・製品内光学・電子線式は、位置情報の取り方が違う",
      lead: "一つの方式がすべての層・構造・サンプリング要求を満たすわけではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "IBO", title: "画像式重ね合わせ", body: "上下層の線・枠・周期マークなどを画像化し、各パターンの中心・エッジを求めて位置差を計算します。直感的な画像を確認しやすい方式です。" },
            { label: "DBO", title: "回折式重ね合わせ", body: "上下層を組み込んだ周期マークへ光を当て、回折信号の非対称性などから位置ずれを求めます。高速な光学計測と高密度サンプリングへ使われます。" },
            { label: "IN-DEVICE", title: "製品内・小型ターゲット光学計測", body: "スクライブ領域の大きな代理マークだけでなく、製品内特徴や小さな専用マークから実デバイスに近い位置ずれを推定します。" },
            { label: "E-BEAM", title: "電子線重ね合わせ", body: "電子線像で製品パターンの輪郭や埋もれた層を捉え、局所CD・エッジ位置と重ね合わせを直接測る補完方式です。" },
          ],
        },
        {
          type: "note",
          title: "画像が見えることと、量産補正に使えることは別",
          body: "重ね合わせ装置には、位置感度だけでなく測定再現性、装置起因ずれ、マークと製品の相関、処理能力、装置間整合、異常信号の検出が必要です。",
        },
      ],
      paragraphs: [
        "KLAのArcher 800は画像式重ね合わせ計測、ASMLのYieldStar 380Gは回折式の現像後計測を公式に示します。同じ光学式でも、直接画像の中心を取るか、回折信号からずれを推定するかが異なります。",
        "Applied MaterialsのPROVision 4Eは、一つの電子線画像からCDと重ね合わせを同時測定する領域を示しています。PROVision 10は層を越えた画像情報を使い、光学ターゲット計測が見にくい先端構造を補います。",
      ],
    },
    {
      id: "targets",
      heading: "測定マークは、測りやすさと製品パターンの代表性を両立する",
      lead: "大きく明瞭なマークが、実際のデバイスと同じように動くとは限りません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "マーク・測定場所",
          rightLabel: "主な特徴と注意点",
          rows: [
            { left: "スクライブ領域の画像マーク", right: "専用形状を大きく作りやすく画像も確認しやすいが、製品内パターンとの距離・密度・加工差を考える" },
            { left: "スクライブ領域の回折マーク", right: "周期構造から強い信号を得て高速測定しやすいが、積層・非対称・加工条件による信号変化を管理する" },
            { left: "製品内の小型マーク", right: "実回路に近い位置で測りやすい一方、スポット、信号量、設計面積、周辺パターンの影響が厳しくなる" },
            { left: "実デバイスパターン", right: "製品そのものの位置関係を見られるが、層の識別、複雑な輪郭、サンプリング速度、設計データ連携が必要" },
            { left: "先端後工程のRDL・バンプ・TSV", right: "大きな反り、透明材料、粗い金属面、異なる基板サイズ・厚さに対応する光学・搬送が必要" },
            { left: "埋もれた層・裏面構造", right: "表面光学で見えにくいため、波長・信号を変える、電子線・赤外など別原理を使う場合がある" },
          ],
        },
      ],
      paragraphs: [
        "KLAはArcher 800で、デバイスとターゲットの相関や難しい積層・薄いEUVレジスト・不透明膜への測定性を公式資料で扱っています。測定マークが明瞭でも、製品内の位置ずれを代表できるかを確認します。",
        "Onto InnovationのIVS 380は、先端後工程、パワー、化合物半導体、MEMSを対象に、Si・ガラスなどの基板と、透明なレジストや粗い金属面での重ね合わせ・CD・高さ計測を示しています。",
      ],
    },
    {
      id: "uncertainty",
      heading: "マーク非対称・装置起因ずれ・サンプリングが測定値を動かす",
      lead: "同じ場所を繰り返して値が揃うだけでなく、実際の層間位置を正しく表す必要があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "計測課題",
          rightLabel: "主な影響と確認の考え方",
          rows: [
            { left: "マーク非対称・加工差", right: "上層・下層マークの形が左右で異なると、中心・回折信号が物理位置とは別に動く場合がある" },
            { left: "積層・光学条件", right: "膜厚、材料、反射、色、焦点で信号が変わるため、波長・照明・焦点・アルゴリズムを層ごとに最適化する" },
            { left: "装置起因ずれ", right: "光学条件、焦点、ステージ、マーク方向などで測定値が動くため、反転・複数条件・モデル・基準装置で評価する" },
            { left: "再現性と真度", right: "繰返しばらつきが小さくても真値に近いとは限らないため、別方式・基準構造・装置間相関を確認する" },
            { left: "マークと製品の差", right: "スクライブの代理マークと製品内パターンが異なる変形を受けるため、製品内・電子線計測で相関を見る" },
            { left: "サンプリング不足", right: "測定点が少ないと局所歪みや異常ショットを見逃すため、工程変動と補正モデルに合う位置・頻度を設計する" },
            { left: "ウェーハ変形", right: "熱、膜応力、チャック、研磨、接合などの非線形変形は単純な並進・回転・倍率だけでは表せない" },
            { left: "補正の過適合", right: "ノイズや一時的異常まで高次補正へ入れると次のウェーハを悪化させるため、適用範囲と上限を決める" },
          ],
        },
        {
          type: "note",
          title: "精度・再現性・測定不確かさを分ける",
          body: "日立ハイテクは、値のばらつきが小さい精密さと、平均が真値へ近い正確さは別だと説明しています。重ね合わせでも繰返し、装置間差、装置起因ずれ、ターゲット相関を含めて判断します。",
        },
      ],
      paragraphs: [
        "重ね合わせ値が変わったとき、露光装置だけを原因と決めつけることはできません。マーク形成、レジスト、現像、加工、膜、ウェーハ形状、計測装置、データ処理のどこでも信号・位置が変わります。",
        "量産レシピでは、測定条件だけでなく信号品質、外れ値、残差、再測定、装置間マッチング、補正を止める条件を決めます。誤った測定値を自動補正へ返さない設計が重要です。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体重ね合わせ計測の代表企業4社",
      lead: "先端ウェーハ光学、先端後工程・特殊基板、電子線の役割を分けて企業へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "KLA｜米国", right: "Archerシリーズの画像式重ね合わせ計測、先端ロジック・DRAM・3D NANDの製品上重ね合わせ管理、計測補正・データ解析を展開" },
            { left: "ASML｜オランダ", right: "YieldStar 380Gで回折式の現像後重ね合わせ・焦点計測、装置内蔵・独立型、YieldStar 1385で加工後の製品内光学計測を展開" },
            { left: "Onto Innovation｜米国", right: "IVS 380・280で先端後工程、パワー、化合物半導体、MEMS向けの画像式重ね合わせ・CD・高さ計測を展開" },
            { left: "Applied Materials｜米国", right: "PROVision 4E・10で電子線による製品パターンのCD・重ね合わせ・エッジ位置、埋もれた層・先端ロジック・DRAM・HBM・裏面構造の計測を展開" },
          ],
        },
        {
          type: "note",
          title: "4社の装置は同一カテゴリー・用途ではない",
          body: "KLAとASMLは先端ウェーハ光学計測、Onto Innovationは先端後工程・特殊基板を含む画像計測、Applied Materialsは電子線による製品内・層間計測の比重が異なります。同じ工程時点と測定対象で比較します。",
        },
      ],
      paragraphs: [
        "KLAとASMLの製品でも画像式と回折式、現像後と加工後、専用マークと製品内計測が異なります。会社比較より先に、測定方式・工程・マーク・出力データをそろえます。",
        "Onto Innovationは200・300mmの多様な基板と先端後工程・特殊用途、Applied Materialsは電子線による高密度な製品内計測を示します。先端前工程だけを想定すると企業の役割を見誤ります。",
      ],
    },
    {
      id: "comparison",
      heading: "重ね合わせ計測装置メーカーは、8つの条件をそろえて比較する",
      lead: "最小の精度値だけでなく、製品位置を量産で正しく補正できるかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 工程時点・用途", right: "現像後、加工後、成膜・CMP・接合後、開発、量産監視、露光装置評価、再加工判断のどれか" },
            { left: "2. 対象製品・基板", right: "先端ロジック、DRAM、3D NAND、成熟世代、パワー、化合物、MEMS、RDL・バンプ・HBM、ウェーハ・パネル" },
            { left: "3. 測定方式", right: "画像式、回折式、製品内光学、電子線、照明波長・偏光・焦点、表面・埋もれた層への感度" },
            { left: "4. マーク・測定場所", right: "スクライブ専用マーク、小型ターゲット、実デバイス、X・Y方向、ショット内・ウェーハ内の測定可能位置" },
            { left: "5. 計測性能", right: "精度、再現性、測定不確かさ、装置起因ずれ、装置間マッチング、製品との相関、信号品質" },
            { left: "6. 処理能力・サンプリング", right: "測定時間、移動時間、点数、ウェーハ出力、全数・抜取り、高密度マップ、複数層同時計測" },
            { left: "7. モデル・データ連携", right: "並進・回転・倍率・高次補正、外れ値、装置別・層別モデル、露光・トラック・加工装置、APC・MES連携" },
            { left: "8. 量産支援・保守", right: "マーク設計、レシピ、基準・相関、校正、装置間展開、光源・電子源、ソフト更新、保守拠点、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "まず、現像後の光学マークを高速に測るのか、加工後の製品内位置を測るのかを決めます。両者は競合するだけでなく、早い補正と実デバイス検証を分担します。",
        "次に必要な補正密度を決めます。単純な装置オフセットを見る用途と、ウェーハ・ショット内の非線形変形を補正する用途では、測定点数、速度、モデル、データ基盤が異なります。",
      ],
    },
    {
      id: "jobs",
      heading: "重ね合わせ計測装置メーカーの仕事は、光学・位置計測・誤差モデル・リソグラフィをつなぐ",
      lead: "ナノメートル級の位置差を量産補正へ変える、ハードウェアとデータの複合分野です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OPTICS", title: "光学・電子光学", body: "照明、波長、偏光、対物、検出器、回折、電子線、層分離と信号対雑音を設計します。" },
            { label: "MECHANICS", title: "精密機械・ステージ", body: "ウェーハ搬送、位置、焦点、高さ、除振、温度、反り・多様な基板対応を設計します。" },
            { label: "IMAGING", title: "画像・信号処理", body: "マーク中心、エッジ、輪郭、回折非対称、信号品質、異常マークを抽出します。" },
            { label: "MODELING", title: "誤差モデル・統計", body: "ベクトルマップを並進・回転・倍率・高次変形へ分解し、補正と原因解析へ変換します。" },
            { label: "LITHO", title: "リソグラフィ・アプリ", body: "層・マーク・レジスト・加工に合うレシピを作り、露光装置との相関を取ります。" },
            { label: "SOFTWARE", title: "制御・データ基盤", body: "装置制御、レシピ、マッピング、APC、露光・トラック・MES連携を実装します。" },
            { label: "METROLOGY", title: "校正・計測保証", body: "精度、再現性、装置起因ずれ、装置間差、基準、測定不確かさを評価します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、光学・ステージ調整、校正、レシピ移管、障害解析、装置間整合を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、画像式・回折式・電子線のどれか、先端前工程・特殊半導体・先端後工程のどれか、装置ハード・アルゴリズム・アプリ・サービスのどこを担当するかを確認します。",
        "光学、精密位置決め、画像処理、信号処理、統計、機械学習、リソグラフィ、プロセス、品質、設備、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体重ね合わせ計測装置でよくある質問",
      lead: "位置合わせ、測定方式、工程時点、補正の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の重ね合わせとは何ですか？", answer: "今回形成した上層パターンが、既存の下層パターンへどれだけ正しく重なっているかを示す位置関係です。通常は測定点ごとのX・Y方向のずれとして表します。" },
            { question: "主な重ね合わせ計測装置メーカーは？", answer: "この記事ではKLA、ASML、Onto Innovation、Applied Materialsを代表例として紹介しています。画像式、回折式、先端後工程向け、電子線式で主な用途が異なります。" },
            { question: "露光装置が位置合わせするのに、なぜ計測装置が必要ですか？", answer: "露光前アライメントは転写位置を決める機能です。露光・現像・加工後にはウェーハ変形や工程の影響も加わるため、実際にできた上下層の位置を別途測って補正と判定へ使います。" },
            { question: "画像式と回折式の違いは？", answer: "画像式は上下層マークを画像化して中心・エッジから位置差を求めます。回折式は周期マークからの回折信号を使って位置ずれを推定します。対象層、マーク、速度、信号耐性で使い分けます。" },
            { question: "現像後と加工後の重ね合わせは何が違いますか？", answer: "現像後はレジストパターンを測り、加工前の再加工や露光補正へ使えます。加工後は下地へ転写された結果を測るため、加工工程を含む実パターンの位置関係を確認できます。" },
            { question: "重ね合わせマークと製品パターンは同じようにずれますか？", answer: "必ずしも同じではありません。マークの場所、寸法、パターン密度、積層、加工状態が異なるため、製品内光学計測や電子線計測で相関を確認する場合があります。" },
            { question: "重ね合わせ値が悪ければ露光装置が原因ですか？", answer: "露光装置だけとは限りません。マーク形成、ウェーハ変形、レジスト、現像、エッチング、膜応力、計測条件、データ処理などを切り分けます。" },
            { question: "測定点は多いほどよいですか？", answer: "多点測定は局所変形を捉えやすくなりますが、時間・装置能力・データ品質との釣り合いが必要です。補正したい誤差モデルと工程リスクに合うサンプリングを設計します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜層間の位置差を、次の露光と工程改善へ変える",
      lead: "重ね合わせ計測は、リソグラフィの位置精度を閉ループで管理する量産センサーです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "LAYER", title: "層と時点を決める", body: "どの上下層を現像後・加工後のどちらで測るか定義する" },
            { label: "SIGNAL", title: "方式を選ぶ", body: "画像、回折、製品内光学、電子線から対象に合う位置信号を取る" },
            { label: "MAP", title: "誤差を分解する", body: "X・Yベクトルをウェーハ・ショット・局所変形成分へ整理する" },
            { label: "CONTROL", title: "安全に補正する", body: "信号品質と適用範囲を確認し、露光・工程・再加工判断へ返す" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "CD、膜厚、重ね合わせ、欠陥を工程へ返す全体像を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "光学・電子線・X線などの装置企業を工程別に見る" },
            { label: "膜厚・光学計測装置メーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "反射・偏光・OCDと重ね合わせ光学計測の違いを見る" },
            { label: "CD-SEM・電子線計測装置メーカー", href: "/guides/semiconductor-cd-sem-manufacturers", description: "電子線による局所CD・EPE・重ね合わせの関連領域を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "計測値の補正先となる露光・位置合わせ装置を見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像と層間位置を作る工程を見る" },
            { label: "塗布現像装置メーカー", href: "/guides/semiconductor-coater-developer-manufacturers", description: "現像後計測の前にレジストパターンを作る装置を見る" },
            { label: "配線形成の仕組み", href: "/guides/semiconductor-interconnect-process", description: "ビアと下層配線の位置関係が電気接続へ与える意味を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、工程時点・用途、対象製品・基板、測定方式、マーク・測定場所、計測性能、処理能力・サンプリング、モデル・データ連携、量産支援・保守の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "KLA・ASML・Onto Innovation・Applied Materialsから1社を選び、公式製品を工程時点・測定方式・マーク／製品内・出力マップ・補正先の5項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-inspection-metrology",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-thin-film-optical-metrology-manufacturers",
    "semiconductor-cd-sem-manufacturers",
    "semiconductor-lithography-equipment-manufacturers",
    "photolithography-process",
    "semiconductor-coater-developer-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-interconnect-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["kla", "asml", "applied-materials"],
};
