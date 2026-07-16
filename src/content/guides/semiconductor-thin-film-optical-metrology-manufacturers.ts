import type { GuideArticle } from "@/content/guides/types";

export const semiconductorThinFilmOpticalMetrologyManufacturersGuide: GuideArticle = {
  slug: "semiconductor-thin-film-optical-metrology-manufacturers",
  title: "半導体膜厚・光学計測装置メーカーとは？KLA・Onto Innovation・SCREEN・Novaを初心者向けに図解",
  description:
    "半導体の膜厚・光学計測装置は、反射・干渉・偏光変化から薄膜や微細構造を非接触で測ります。分光反射、エリプソメトリ、OCD、光音響、モデル解析、主要メーカーの違いを図解します。",
  targetQuery: "半導体 膜厚測定装置 メーカー",
  searchIntent:
    "半導体の膜厚測定装置と光学計測の仕組み、分光反射・エリプソメトリ・OCDの違い、透明膜・金属膜・積層膜の測り方、KLA・Onto Innovation・SCREEN・Novaなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "KLA、Onto Innovation、SCREEN Semiconductor Solutions、Novaの公式製品・開示情報をもとに、光を当てる、反射・偏光・時間変化を検出する、光学モデルと照合する、膜厚・光学定数・形状を算出する、工程へ返す流れへ整理しました。各社の製品範囲は同一ではないため、薄膜、OCD、内蔵計測、不透明膜などの得意領域を分けて説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "CD-SEM記事で局所の電子線寸法計測を整理したうえで、高速・非接触で膜厚や構造を推定する光学計測を独立記事にする必要があると判断",
    "KLAの公式開示で膜厚・膜応力・OCD・重ね合わせなどの計測群、Onto Innovationで分光反射・分光エリプソメトリ、CMP内蔵計測、光音響式金属膜計測を確認",
    "SCREENで分光反射式とエリプソメトリ式の量産・開発向け装置、Novaで独立型・工程装置内蔵型の薄膜・OCD計測とモデル解析を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "KLA Semiconductor Process Control Technologies and Products",
      url: "https://ir.kla.com/sec-filings/all-sec-filings/content/0000319201-24-000014/0000319201-24-000014.pdf",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA Introduces Five Patterning Control Systems for Sub-7nm IC Manufacturing",
      url: "https://ir.kla.com/news-events/press-releases/detail/95/kla-tencor-introduces-five-patterning-control-systems-for",
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
      title: "Semiconductor Metrology Products",
      url: "https://ontoinnovation.com/product-categories/metrology/",
      publisher: "Onto Innovation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Atlas III+ System",
      url: "https://ontoinnovation.com/products/atlas-iii-system/",
      publisher: "Onto Innovation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Echo Opto-Acoustic Film Metrology System",
      url: "https://ontoinnovation.com/products/echo/",
      publisher: "Onto Innovation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ellipsometric Film Thickness Measurement System RE-3500",
      url: "https://www.screen.co.jp/setc/en/products/re-3500",
      publisher: "SCREEN SPE Tech",
      accessedAt: "2026-07-16",
    },
    {
      title: "Spectroscopic Film Thickness Measurement System VM-2500/VM-3500",
      url: "https://www.screen.co.jp/spe/en/products/vm-25003500",
      publisher: "SCREEN Semiconductor Solutions",
      accessedAt: "2026-07-16",
    },
    {
      title: "Metrology Tools and Products for Semiconductor Manufacturers",
      url: "https://www.novami.com/products/products-overview",
      publisher: "Nova",
      accessedAt: "2026-07-16",
    },
    {
      title: "Nova Prism Optical CD Platform",
      url: "https://www.novami.com/nova-product/prism/",
      publisher: "Nova",
      accessedAt: "2026-07-16",
    },
    {
      title: "Nova MMSR+ Dimensional Metrology Platform",
      url: "https://www.novami.com/nova-product/nova-t600-mmsr/",
      publisher: "Nova",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約18分",
  intro: {
    problem:
      "膜厚測定装置を調べても、光の反射だけでなぜナノメートル級の厚さが分かるのか、エリプソメトリやOCDは何が違うのか、透明膜と金属膜を同じ装置で測れるのか分かりにくくありませんか。",
    conclusion:
      "光学計測装置は、ウェーハへ複数波長・角度・偏光の光を当て、反射強度、位相、偏光状態、干渉、時間応答を測り、材料と積層構造を表すモデルへ当てはめて膜厚・屈折率・形状を推定します。メーカー比較では、測定対象、光学方式、モデル、測定スポット、精度・再現性、処理能力、工程装置内蔵、校正・相関をそろえます。",
    learnings:
      "膜厚計測の流れ、分光反射・エリプソメトリ・OCD・干渉・光音響の違い、膜厚・屈折率・消衰係数・CD・高さの関係、モデル依存性、透明膜・不透明膜・積層膜の課題、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "光学式の膜厚計は、膜を直接ものさしで挟む装置ではありません。膜から戻る光に含まれる『厚さと材料の手掛かり』を測り、物理モデルで最も整合する構造を探す装置です。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜反射光から膜厚・形状を求める",
      description:
        "一般的なインライン光学計測を単純化した流れです。実際の光学系、波長、角度、偏光、モデル、演算方法は装置・材料・構造で異なります。",
      stages: [
        { label: "01 / LOCATE", title: "測定位置へ運ぶ", body: "ウェーハを搬送・位置合わせし、ブランケット部、測定パッド、製品パターンなどへ光学スポットを合わせる" },
        { label: "02 / ILLUMINATE", title: "光を当てる", body: "単一または複数波長、垂直・斜め入射、決めた偏光状態の光を膜・構造へ照射する" },
        { label: "03 / DETECT", title: "戻る光を測る", body: "反射強度、波長スペクトル、偏光変化、位相、干渉、時間応答などを検出する" },
        { label: "04 / MODEL", title: "構造モデルと比べる", body: "膜の順番、材料、光学定数、厚さ、CD、高さ、側壁角などを置き、計算信号と実測信号を比較する" },
        { label: "05 / FIT", title: "値を推定する", body: "差が小さくなるパラメータを探索し、膜厚、屈折率、消衰係数、寸法、形状などを算出する" },
        { label: "06 / CONTROL", title: "工程へ返す", body: "面内分布、ロット間変動、装置間差を成膜、エッチング、CMP、洗浄などの条件管理へ使う" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の主要部",
      rightLabel: "主な役割",
      rows: [
        { left: "光源・分光系", right: "広帯域光、レーザー、赤外光などを作り、波長ごとの信号を分ける" },
        { left: "偏光・入射光学系", right: "偏光状態、入射角、スポット径、焦点、照明方向を制御する" },
        { left: "検出器・受光系", right: "反射強度、偏光成分、位相、干渉波形、時間変化を電気信号へ変える" },
        { left: "精密ステージ・搬送", right: "測定点へ高速・高精度に移動し、焦点・高さ・ウェーハ方向をそろえる" },
        { left: "光学モデル・材料ライブラリ", right: "積層順、光学定数、形状を定義し、測定信号を物理量へ変換する" },
        { left: "演算・データ基盤", right: "フィッティング、マッピング、統計、レシピ、装置間整合、APC・MES連携を行う" },
      ],
    },
  ],
  sections: [
    {
      id: "principles",
      heading: "分光反射・エリプソメトリ・OCDは、取り出す光情報が違う",
      lead: "どれも光学式ですが、測る信号と得意な問いが異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "測定方式",
          rightLabel: "主な信号と得意な対象",
          rows: [
            { left: "分光反射法", right: "波長ごとの反射強度を測り、薄膜の上下界面で生じる干渉から膜厚・光学定数を推定する。比較的単純な透明・半透明膜に使いやすい" },
            { left: "分光エリプソメトリ", right: "反射前後の偏光状態の変化を測り、膜厚と屈折率・吸収に関わる光学定数を推定する。薄膜・多層膜・材料評価へ使う" },
            { left: "OCD・スキャッタロメトリ", right: "周期パターンからの反射・回折スペクトルをモデルと照合し、CD、高さ、深さ、側壁角、膜厚など複数の形状値を推定する" },
            { left: "分光干渉・干渉計測", right: "基準光と試料光、または複数界面からの光の位相差を利用し、厚さ・高さ・段差・形状への感度を得る" },
            { left: "FTIR・赤外計測", right: "赤外の透過・反射スペクトルを使い、厚いエピ膜、高アスペクト比構造、組成に関わる情報を測る場合がある" },
            { left: "光音響・ピコ秒超音波", right: "超短パルス光で膜内に音響波を作り、戻る時間応答から不透明な金属膜の厚さや材料特性を測る" },
          ],
        },
        {
          type: "note",
          title: "装置名より、入力信号と出力パラメータを見る",
          body: "同じ装置が分光反射とエリプソメトリを組み合わせたり、膜厚とOCDを一つのレシピで推定したりします。製品カテゴリーだけでなく、どの光情報から何を出すかを確認します。",
        },
      ],
      paragraphs: [
        "薄膜の上面と下面で反射した光は、膜内を進んだ距離と波長に応じて強め合ったり弱め合ったりします。分光反射法は、その波長ごとの明暗パターンを厚さの手掛かりにします。",
        "エリプソメトリは反射強度だけでなく、光の振動方向と位相の変化を使います。OCDでは、周期構造が作る複雑なスペクトルを三次元形状モデルと照合します。",
      ],
    },
    {
      id: "outputs",
      heading: "膜厚だけでなく、材料・形状・面内分布を一緒に見る",
      lead: "計測結果の意味を理解するには、直接測った信号とモデルから推定した値を分けます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "THICKNESS", title: "単層・多層膜厚", body: "酸化膜、窒化膜、レジスト、ハードマスク、エピ膜、金属膜などの厚さを対象に応じた方式で測ります。" },
            { label: "OPTICAL", title: "屈折率・消衰係数", body: "光の進み方と吸収に関わる値で、材料組成・密度・膜質の変化を捉える手掛かりになります。" },
            { label: "UNIFORMITY", title: "面内均一性", body: "ウェーハ上の多数点を測り、中心・外周、装置チャンバー、ロット間の厚さ分布を可視化します。" },
            { label: "OCD", title: "CD・高さ・側壁角", body: "パターンモデルとスペクトルから、線幅、溝幅、高さ、深さ、テーパーなどを同時推定します。" },
            { label: "STRESS", title: "膜応力・反り", body: "ウェーハ形状の変化や専用計測を組み合わせ、膜が基板を引張る・圧縮する影響を評価します。" },
            { label: "MATERIAL", title: "組成・物性の指標", body: "光学定数、バンドギャップ、音速、弾性率など、装置とモデルに応じた材料情報を得る場合があります。" },
          ],
        },
      ],
      paragraphs: [
        "膜厚と屈折率は測定信号へ同時に影響するため、一方の変化をもう一方へ誤って割り当てないことが重要です。測定範囲、波長、角度、偏光、材料モデルを増やして区別しやすくします。",
        "OCDではCD、高さ、側壁角、下地膜厚など複数の値が似た信号変化を作ることがあります。知りたい値だけを自由に動かさず、工程知識や別計測で条件を絞ります。",
      ],
    },
    {
      id: "modeling",
      heading: "光学計測の精度は、装置だけでなくモデルと相関で決まる",
      lead: "信号が安定していても、構造モデルが現物と違えば結果はずれます。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜量産レシピを作り、維持する",
          description:
            "新しい膜・構造を量産計測へ載せる一般的な考え方です。開発・認定手順はメーカーとファブで異なります。",
          stages: [
            { label: "01 / DEFINE", title: "構造を定義する", body: "積層順、材料、周期、線幅、高さ、側壁、測定位置、変動しそうな値を整理する" },
            { label: "02 / REFERENCE", title: "基準値を得る", body: "断面解析、段差計、X線、電子線、既知膜など、目的に合う基準計測を用意する" },
            { label: "03 / MODEL", title: "モデルを作る", body: "光学定数・形状・範囲・固定値を設定し、実測スペクトルへフィッティングする" },
            { label: "04 / VERIFY", title: "相関を確認する", body: "厚さ・形状を意図的に振った試料で、線形性、精度、再現性、残差、外れ条件を確認する" },
            { label: "05 / DEPLOY", title: "量産へ展開する", body: "測定点、頻度、判定、装置間マッチング、基準試料、異常時の再測定を決める" },
            { label: "06 / MAINTAIN", title: "変化を監視する", body: "材料・構造・装置・レシピ変更時に残差と相関を再確認し、モデルの有効範囲を更新する" },
          ],
        },
        {
          type: "note",
          title: "フィッティング誤差が小さいだけでは十分ではない",
          body: "計算スペクトルが実測へ合っても、複数の異なる構造が似た信号を作る場合があります。基準計測、工程を振った試料、未知試料で、出力値が物理的に妥当か確認します。",
        },
      ],
      paragraphs: [
        "光学計測は非破壊・高速で多数点を測りやすい一方、膜構成と材料特性を仮定するモデルベース計測です。レシピ開発は光学ソフトの操作だけでなく、成膜・加工・材料の理解を必要とします。",
        "NovaとOnto Innovationは公式情報で物理モデルと機械学習を組み合わせた解析を示しています。機械学習も基準データ、適用範囲、工程変化の監視が前提です。",
      ],
    },
    {
      id: "limitations",
      heading: "透明膜・不透明膜・微小パッド・3D構造で、測り方を変える",
      lead: "万能な光学ヘッドはなく、光がどこまで届き、どんな信号が戻るかで方式を選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "測定課題",
          rightLabel: "主な影響と対策の考え方",
          rows: [
            { left: "透明・半透明の単純膜", right: "反射干渉を使いやすいが、膜が薄すぎる・厚すぎる、光学定数が近い場合は感度範囲を確認する" },
            { left: "不透明な金属膜", right: "下側界面から光が戻りにくいため、光音響、X線、抵抗、段差など別原理を検討する" },
            { left: "多層膜・材料変動", right: "膜厚と光学定数の相関が強くなりやすいため、波長・角度・偏光を増やし、固定値と基準データを使う" },
            { left: "微小測定パッド", right: "スポットが周辺構造を含むと混合信号になるため、微小スポット、画像認識、位置・焦点精度を確認する" },
            { left: "周期・三次元構造", right: "CD、高さ、側壁、膜厚が同時に効くため、正しい断面モデルと十分な感度を持つ光学チャネルを選ぶ" },
            { left: "高アスペクト比構造", right: "深部・底部への感度が弱くなる場合があり、赤外、複数角度、干渉、電子線・断面解析などを組み合わせる" },
            { left: "表面粗さ・欠陥・汚れ", right: "散乱・反射低下・外れ値の原因になるため、信号品質、残差、画像、検査データと照合する" },
            { left: "装置間・時間変化", right: "光源、検出器、焦点、温度、校正で値が動くため、標準試料、装置間整合、定期校正を管理する" },
          ],
        },
      ],
      paragraphs: [
        "Onto InnovationのEchoは、ピコ秒超音波を用いた不透明な単層・多層金属膜のインライン計測を公式に示しています。通常の反射膜厚計が苦手な対象では、光を音響波の発生・検出に使う方式があります。",
        "SCREENのRE-3500は微小スポットの分光エリプソメトリ、VMシリーズは分光反射による膜厚測定を示します。同じ会社の製品でも、超薄膜・膜質と高速多点測定では選ぶ光学方式が変わります。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体膜厚・光学計測装置の代表企業4社",
      lead: "各社の公式情報で確認できる領域を、薄膜・OCD・内蔵計測・特殊方式へ分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "KLA｜米国", right: "SpectraFilm・Alerisの膜厚・膜特性、SpectraShapeのOCD・3D形状、Archer・ATLの重ね合わせなど広いプロセス制御計測群を展開" },
            { left: "Onto Innovation｜米国", right: "Atlas・IrisのOCD／薄膜光学計測、IMPULSEのCMP内蔵・独立計測、Echoの光音響式金属膜、赤外・FTIR・先端後工程向け計測を展開" },
            { left: "SCREEN｜日本", right: "RE-3500で分光・単波長エリプソメトリによる膜厚・光学定数、VMシリーズで分光反射による量産・開発向け膜厚計測を展開" },
            { left: "Nova｜イスラエル", right: "独立型・工程装置内蔵型のOCD／薄膜光学計測、Nova Prismの分光エリプソメトリ・反射・干渉、物理・機械学習モデルを展開" },
          ],
        },
        {
          type: "note",
          title: "4社の製品範囲と主対象は同一ではない",
          body: "KLAとOnto Innovationは広い計測ポートフォリオ、SCREENは分光膜厚計の量産・開発ライン、NovaはOCD・薄膜と工程装置内蔵計測に特徴があります。用途を固定してから比較します。",
        },
      ],
      paragraphs: [
        "KLAの公式開示は、パターン寸法、膜厚、膜応力、層間位置、表面形状、電気光学特性を計測対象として挙げています。装置名ではなく、必要な物理量から製品群へ入ると整理しやすくなります。",
        "Onto InnovationとNovaはOCD・薄膜を工程装置へ組み込む計測も展開します。全ウェーハを独立計測装置へ運ぶ方式と、CMP・エッチング装置の近くで測って素早く補正する方式は、運用設計が異なります。",
      ],
    },
    {
      id: "comparison",
      heading: "膜厚・光学計測装置メーカーは、8つの条件をそろえて比較する",
      lead: "カタログ値を一列に並べる前に、同じ膜・構造・工程を測る製品か確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 測定対象・工程", right: "成膜後、現像後、エッチング後、CMP前後、エピ、金属、先端後工程、研究・量産のどれか" },
            { left: "2. 膜・構造", right: "単層・多層、透明・吸収・不透明、ブランケット・パターン、周期、3D、高アスペクト比、測定パッド" },
            { left: "3. 光学・物理方式", right: "分光反射、エリプソメトリ、OCD、干渉、赤外、光音響、入射角・偏光・波長・光学チャネル" },
            { left: "4. 出力値・モデル", right: "膜厚、光学定数、CD、高さ、側壁、応力、材料特性、モデル自由度、残差、ライブラリ・機械学習" },
            { left: "5. 計測性能", right: "精度、再現性、感度、線形性、測定範囲、スポット径、装置間マッチング、基準計測との相関" },
            { left: "6. 処理能力・搬送", right: "測定時間、測定点数、ウェーハ出力、マッピング、FOUP・カセット、反り・薄ウェーハ、エッジ除外" },
            { left: "7. 独立型・内蔵型", right: "単独装置、CMP・エッチングなどへの内蔵、測定前後の搬送、全数・抜取り、APCへのフィードバック速度" },
            { left: "8. 量産支援・保守", right: "レシピ開発、材料データ、校正、標準試料、装置間展開、光源・検出器、ソフト更新、保守拠点、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "最初に、膜厚だけを測るのか、膜厚と光学定数を分けるのか、周期構造のCD・高さまで求めるのかを決めます。必要以上に自由度の高いモデルは、レシピ開発と維持を難しくする場合があります。",
        "次に測定スポットとサンプリングを確認します。微小パッドを高精度に測れることと、ウェーハ全面を高速に多点測定できることは別の要求です。",
      ],
    },
    {
      id: "jobs",
      heading: "光学計測装置メーカーの仕事は、光・材料・モデル・量産制御をつなぐ",
      lead: "光学ハードウェアだけでなく、測定アプリケーションとデータの比重が大きい分野です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OPTICS", title: "光学設計", body: "光源、分光器、偏光、レンズ、干渉、検出器、スポット、迷光・収差を設計します。" },
            { label: "MECHANICS", title: "精密機械・搬送", body: "ステージ、焦点、高さ制御、ウェーハ搬送、除振、温度、反り対応を設計します。" },
            { label: "PHYSICS", title: "材料・光学モデル", body: "屈折率、吸収、積層膜、回折、散乱、音響応答のモデルと材料ライブラリを作ります。" },
            { label: "ALGORITHM", title: "数値解析・機械学習", body: "フィッティング、感度解析、パラメータ分離、残差判定、モデル高速化を開発します。" },
            { label: "PROCESS", title: "プロセス・アプリ", body: "成膜・加工・CMPなどの対象ごとに測定レシピを作り、基準計測との相関を取ります。" },
            { label: "SOFTWARE", title: "制御・データ連携", body: "装置制御、GUI、レシピ、マッピング、統計、APC・MES・工程装置連携を実装します。" },
            { label: "QUALITY", title: "校正・計測保証", body: "精度、再現性、装置間差、標準試料、測定不確かさ、変更影響を評価します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、校正、光学調整、レシピ移管、故障解析、装置間整合、稼働改善を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では『計測装置』だけで判断せず、薄膜、OCD、重ね合わせ、内蔵計測、材料計測のどれを担当するかを確認します。必要な物理と顧客工程が大きく変わります。",
        "光学、材料、薄膜、数値計算、画像処理、統計、機械学習、半導体プロセス、品質、設備、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体膜厚・光学計測装置でよくある質問",
      lead: "測定原理、精度、対象膜、CD-SEMとの違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "光を当てるだけで、なぜ膜厚が分かるのですか？", answer: "膜の上面と下面から戻る光は、膜内を進む距離に応じて干渉します。波長ごとの反射強度や偏光・位相の変化を材料と積層のモデルへ照合し、最も整合する膜厚を求めます。" },
            { question: "主な半導体膜厚測定装置メーカーは？", answer: "この記事ではKLA、Onto Innovation、SCREEN、Novaを代表例として紹介しています。各社の製品範囲は異なり、薄膜、OCD、工程装置内蔵、不透明膜など用途をそろえて比較する必要があります。" },
            { question: "分光反射法とエリプソメトリの違いは？", answer: "分光反射法は主に波長ごとの反射強度を測ります。エリプソメトリは反射による偏光状態の変化も測るため、膜厚と光学定数を分けたい薄膜・材料評価で使われます。" },
            { question: "OCDとは何ですか？", answer: "Optical Critical Dimensionの略で、周期パターンから戻る光のスペクトルを三次元モデルと比較し、CD、高さ、深さ、側壁角、膜厚などを推定する光学計測です。" },
            { question: "金属膜も光学式で測れますか？", answer: "対象と厚さによります。不透明で下側界面の光が得にくい場合、通常の反射干渉式は難しくなります。光音響、X線、抵抗、段差など別原理を使う場合があります。" },
            { question: "光学計測は非破壊ですか？", answer: "一般に非接触・非破壊で、多数点を高速に測りやすい方式です。ただし、強い光への感受性、測定面の汚れ、後工程への持込みなど、対象に応じた管理は必要です。" },
            { question: "フィッティング誤差が小さければ正しい値ですか？", answer: "必ずしも正しいとは限りません。異なる構造が似たスペクトルを作る場合があるため、断面解析、電子線、X線、既知膜などの基準値と相関を確認します。" },
            { question: "CD-SEMと光学OCDはどちらが優れていますか？", answer: "目的で異なります。CD-SEMは局所の高解像画像と寸法、光学OCDは非接触で高速な膜・三次元形状の推定が得意です。相関させて役割分担します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜光信号を、膜と構造の量産データへ変える",
      lead: "膜厚・光学計測は、成膜・加工・CMPの変化を早く捉える量産センサーです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "SIGNAL", title: "光情報を選ぶ", body: "反射、偏光、干渉、赤外、光音響から対象に合う信号を使う" },
            { label: "MODEL", title: "構造を定義する", body: "積層、材料、CD、高さ、側壁をモデルへ正しく置く" },
            { label: "VERIFY", title: "基準と相関する", body: "精度、再現性、線形性、残差、装置間差と適用範囲を確かめる" },
            { label: "CONTROL", title: "工程へ返す", body: "面内・ロット間変動を成膜、加工、CMPの判断と補正へつなぐ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "膜厚、CD、重ね合わせ、欠陥を工程へ返す全体像を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "光学・電子線・X線などの装置企業を工程別に見る" },
            { label: "CD-SEM・電子線計測装置メーカー", href: "/guides/semiconductor-cd-sem-manufacturers", description: "局所画像によるCD計測と光学OCDの役割差を見る" },
            { label: "重ね合わせ計測装置メーカー", href: "/guides/semiconductor-overlay-metrology-manufacturers", description: "同じ光学系でも層間の位置差を測る装置と方式を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "膜厚・光学定数を作り込むCVD・PVD・ALD装置を見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "核生成・表面反応から膜が成長するメカニズムを見る" },
            { label: "CMP装置メーカー", href: "/guides/semiconductor-cmp-equipment-manufacturers", description: "残膜・平坦度データを使う研磨・内蔵計測を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "OCDで深さ・側壁・残膜を管理する加工装置を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "膜厚・光学計測が前工程のどこへ入るか全体像で見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、測定対象・工程、膜・構造、光学方式、出力値・モデル、計測性能、処理能力・搬送、独立型・内蔵型、量産支援・保守の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "KLA・Onto Innovation・SCREEN・Novaから1社を選び、公式製品を測定対象・光学方式・出力値・モデル・量産への使い方の5項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-inspection-metrology",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-cd-sem-manufacturers",
    "semiconductor-overlay-metrology-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-cmp-equipment-manufacturers",
    "semiconductor-cmp-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-coater-developer-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["kla", "screen"],
};
