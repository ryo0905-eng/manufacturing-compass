import type { GuideArticle } from "@/content/guides/types";

export const semiconductorDefectReviewSemManufacturersGuide: GuideArticle = {
  slug: "semiconductor-defect-review-sem-manufacturers",
  title: "半導体欠陥レビューSEMメーカーとは？日立ハイテク・Applied Materials・KLAを初心者向けに図解",
  description:
    "半導体の欠陥レビューSEMは、検査装置が見つけた座標へ移動し、電子線像から欠陥を再検出・分類します。ADR・ADC、二次電子・反射電子・電圧コントラスト・EDX、欠陥パレート、主要メーカーを図解します。",
  targetQuery: "半導体 欠陥レビュー SEM メーカー",
  searchIntent:
    "欠陥レビューSEMとは何か、光学検査・電子線欠陥検査・CD-SEMとの違い、座標連携・再検出、ADR・ADC、欠陥パレート、日立ハイテク・Applied Materials・KLAなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "日立ハイテク、Applied Materials、KLA、JEOLの公式製品・技術情報をもとに、検査マップを受け取る、代表候補を選ぶ、座標を合わせる、欠陥を再検出する、電子線像・材料・電気信号を取得する、自動分類と欠陥パレートを工程へ返す流れへ整理しました。欠陥レビューSEM、CD-SEM、電子線欠陥検査、研究・故障解析SEMを同一視せず、量産での問いと出力を分けて説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "ウェーハ欠陥検査装置の記事を公開したうえで、検査座標を高倍率画像と欠陥分類へ変換する後続工程を独立記事にする必要があると判断",
    "日立ハイテクで高速ADR、AIを使うADC、電気特性の可視化、非パターンウェーハレビュー、EDXの製品領域を確認",
    "Applied MaterialsでCFE電子源、埋もれた欠陥、AI画像認識、KLAで光学検査との座標・画像連携、再検出、欠陥パレートの考え方を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Defect Review SEM CR7300 Series",
      url: "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/cd-sem/dr-sem/cr7300.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Hitachi High-Tech Launches New High-Speed Defect Review SEM CR7300",
      url: "https://www.hitachi-hightech.com/global/en/news/nr20201126.html",
      publisher: "Hitachi High-Tech Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "SEMVision H20 Defect Analysis",
      url: "https://www.appliedmaterials.com/us/en/product-library/semvision-h20-defect-analysis.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Applied Materials Accelerates Chip Defect Review with Next-Gen eBeam System",
      url: "https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-accelerates-chip-defect-review-next-gen-ebeam/",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "SEMVision G9 Defect Analysis",
      url: "https://www.appliedmaterials.com/us/en/product-library/semvision-g9-defect-analysis.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA Announces New Defect Inspection and Review Portfolio",
      url: "https://ir.kla.com/news-events/press-releases/detail/43/kla-announces-new-defect-inspection-and-review-portfolio",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "eDR-5200 Wafer Defect Review and Classification System",
      url: "https://ir.kla.com/news-events/press-releases/detail/364/kla-tencor-completes-its-45nm-defect-portfolio-with-new",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "2830 and Puma 9500 Series, eDR-5210",
      url: "https://ir.kla.com/news-events/press-releases/detail/292/kla-tencor-launches-2830-and-puma-9500-series-edr-5210",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Review SEM",
      url: "https://www.jeol.com/words/semterms/20241018.php",
      publisher: "JEOL Ltd.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約18分",
  intro: {
    problem:
      "レビューSEMを調べても、ウェーハ欠陥検査装置がすでに欠陥を見つけたのに何を見直すのか、CD-SEMとの違い、ADR・ADC・再検出率・欠陥パレートが何を意味するのか分かりにくくありませんか。",
    conclusion:
      "欠陥レビューSEMは、光学・電子線検査が出した候補座標へ移動し、欠陥を高倍率で見つけ直して画像・材料・電気的特徴を取得し、種類別の欠陥パレートへ変える量産装置です。メーカー比較では、入力検査データ、座標・再検出、電子光学・検出信号、ADR・ADC、分類・分析、処理能力、試料影響、データ・量産支援をそろえます。",
    learnings:
      "レビューSEMの役割、検査・CD-SEMとの違い、座標変換、再検出、Not Found・SNV、二次電子・反射電子・電圧コントラスト・EDX、ADR・ADC、AI分類、欠陥パレート、サンプリング、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "検査装置が作るのは『怪しい場所の地図』、レビューSEMが作るのは『何が何件あったかを判断できる高倍率画像と分類』です。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜検査座標を、欠陥画像・分類・工程判断へ変える",
      description:
        "一般的な欠陥レビューを単純化した流れです。座標形式、撮像信号、分類、分析方法は装置・製品・工程で異なります。",
      stages: [
        { label: "01 / IMPORT", title: "検査マップを受け取る", body: "光学・電子線検査から候補座標、信号、画像、工程・レシピ情報を読み込む" },
        { label: "02 / SAMPLE", title: "レビュー点を選ぶ", body: "欠陥群、信号、位置、新規性、工程変化を見て、母集団を代表する候補を選ぶ" },
        { label: "03 / ALIGN", title: "座標を合わせる", body: "ウェーハを位置合わせし、検査装置とレビューSEMの座標差・回転・倍率・局所ずれを補正する" },
        { label: "04 / REDETECT", title: "欠陥を見つけ直す", body: "候補周辺を探索し、参照像・検査画像・近傍パターンとの差から同じ欠陥を再検出する" },
        { label: "05 / IMAGE", title: "電子線像・分析信号を取る", body: "二次電子、反射電子、電圧コントラスト、必要に応じてX線分析などで特徴を取得する" },
        { label: "06 / CLASSIFY", title: "分類して工程へ返す", body: "ADR・ADCと人の確認で欠陥パレートを作り、発生源、装置点検、条件変更、追加解析へつなぐ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置・システムの主要部",
      rightLabel: "主な役割",
      rows: [
        { left: "電子源・電子光学", right: "細い電子線を安定に作り、対象の表面・深い構造・材料差に合う条件で走査する" },
        { left: "二次・反射電子検出器", right: "表面形状、組成、深さ、傾斜方向などに応じて異なる画像コントラストを取得する" },
        { left: "精密ステージ・搬送", right: "検査座標へ高速に移動し、欠陥を視野内へ入れる位置精度と量産処理能力を支える" },
        { left: "再検出・ADR", right: "候補周辺から欠陥を自動で見つけ直し、焦点・明るさを調整して画像を保存する" },
        { left: "ADC・材料分析", right: "画像特徴、設計・検査情報、電圧コントラスト、元素情報から欠陥種類を分ける" },
        { left: "欠陥パレート・データ連携", right: "分類別の件数・分布を工程・装置・材料・設計・電気試験と結び付け、優先順位を決める" },
      ],
    },
  ],
  sections: [
    {
      id: "role",
      heading: "欠陥レビューSEMは、探索装置と原因解析の間をつなぐ",
      lead: "同じ電子顕微鏡でも、量産で答える問いが異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置・工程",
          rightLabel: "主な問いと出力",
          rows: [
            { left: "光学ウェーハ欠陥検査", right: "広いウェーハ面のどこに異常候補があるか。欠陥座標、信号、簡易画像、マップを高速に出す" },
            { left: "電子線欠陥検査", right: "光学で見えにくい微小な物理・電気的異常がどこにあるか。電子線で候補を探索する" },
            { left: "欠陥レビューSEM", right: "検査候補は何か。座標へ移動し、高倍率像、材料・電気的特徴、分類、欠陥パレートを出す" },
            { left: "CD-SEM・測長SEM", right: "決めた測定点のCD・形状はいくつか。寸法値と分布を工程管理へ使う" },
            { left: "研究・故障解析SEM", right: "選んだ試料を柔軟に観察・分析できるか。量産自動搬送・全数処理とは評価軸が異なる" },
            { left: "FIB・TEM・材料分析", right: "欠陥内部・断面・結晶・組成はどうなっているか。試料加工を伴う詳細解析で原因を確認する" },
          ],
        },
        {
          type: "note",
          title: "レビューは、単なる再撮影ではない",
          body: "検査座標を同じ欠陥へ結び付け、量産で比較できる条件で画像化し、欠陥種類・母集団・工程履歴を整理するところまでがレビューです。",
        },
      ],
      paragraphs: [
        "JEOLはレビューSEMを、半導体製造中の異物や傷、パターン異常などを検出・分類・マッピングする検査システムとして解説しています。量産では自動搬送、座標連携、自動撮像・分類が必要です。",
        "レビュー結果は、重要な欠陥を詳しい断面・材料解析へ送る選別にも使います。全面を最も高倍率な分析装置で見るのではなく、探索、レビュー、詳細解析を段階化します。",
      ],
    },
    {
      id: "coordinates",
      heading: "最初の難所は、別装置の座標から同じ欠陥を見つけ直すこと",
      lead: "高解像SEMでも、欠陥が視野に入らなければ分類できません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "座標・再検出の課題",
          rightLabel: "主な影響と対策の考え方",
          rows: [
            { left: "ウェーハ全体の位置合わせ", right: "ノッチ・基準点・ダイ配列を使い、回転、平行移動、倍率差を補正する" },
            { left: "検査装置との座標差", right: "ステージ・光学・電子線装置の座標定義と歪みが異なるため、複数点で変換モデルを作る" },
            { left: "局所的なパターンずれ", right: "ダイ内の特徴や参照画像を使い、候補周辺で局所位置合わせを行う" },
            { left: "光学パッチ画像", right: "検査時の候補周辺画像とSEM像を照合し、どの粒子・パターン差を探すか絞る" },
            { left: "スパイラル・近傍探索", right: "予測座標の周辺を順に走査し、中心にない小さな欠陥を自動で探索する" },
            { left: "欠陥の変化・消失", right: "搬送、時間、真空、帯電、表面状態で候補が移動・変化する可能性を考える" },
            { left: "Not Found・SNV", right: "欠陥を見つけ直せない候補が増えると分類母集団が偏るため、原因別に記録し再検出条件を改善する" },
          ],
        },
      ],
      paragraphs: [
        "KLAは、検査装置の光学画像、精密ステージ、座標補正、再検出アルゴリズムを組み合わせ、SEMで見つからない候補を減らして欠陥パレートの代表性を高める考え方を示しています。",
        "Not FoundやSEM Non-Visualは、欠陥が存在しないことと同義ではありません。座標差、表面下の信号、低コントラスト、候補の変化、検査の不要信号などを切り分けます。",
      ],
    },
    {
      id: "signals",
      heading: "二次電子・反射電子・電圧コントラスト・EDXで見える特徴が変わる",
      lead: "一枚のSEM画像だけで、形・材料・電気状態のすべてが分かるわけではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "SE", title: "二次電子像", body: "表面近くから出る電子を使い、エッジ、凹凸、粒子、傷、パターン欠けなどの表面形状を高い空間分解能で見ます。" },
            { label: "BSE", title: "反射電子像", body: "試料で散乱して戻る電子を使い、元素組成、深い位置、傾斜方向などによるコントラストを得ます。" },
            { label: "VC", title: "電圧コントラスト", body: "導通・絶縁・帯電状態による明暗差を利用し、開口底部や配線の電気的異常候補を早い工程で見つけます。" },
            { label: "EDX", title: "元素分析", body: "電子線照射で出る特性X線から元素を推定し、粒子・異物の発生源を絞る材料情報を加えます。" },
            { label: "TILT", title: "傾斜・多方向像", body: "上面だけでなく斜め方向からの見え方を使い、段差、側壁、深い穴、三次元構造の形を補います。" },
            { label: "MULTI-SIGNAL", title: "複数検出器・複数条件", body: "加速・着地エネルギー、検出方向、焦点などを変え、表面・埋もれた構造・材料差の信号を組み合わせます。" },
          ],
        },
        {
          type: "note",
          title: "明暗を欠陥種類へ直結させない",
          body: "SEM像の明暗は、形状、材料、電位、帯電、検出器、電子線条件で変わります。参照パターン、複数信号、既知試料、EDX、工程情報を合わせて判断します。",
        },
      ],
      paragraphs: [
        "日立ハイテクのCR7300は、電子線像に加えて電気特性を可視化する機能、EDXによる元素分析、パターンなしウェーハのレビューを公式に示しています。",
        "Applied MaterialsのSEMVision H20・G9は、反射電子を含む画像信号やCFE電子源を使い、表面だけでなく埋もれた欠陥や高アスペクト比・三次元構造の可視化領域を広げています。",
      ],
    },
    {
      id: "automation",
      heading: "ADRは自動で撮像し、ADCは自動で欠陥種類を分ける",
      lead: "撮像の自動化と、分類の自動化を分けて理解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "機能",
          rightLabel: "主な処理と注意点",
          rows: [
            { left: "ADR｜Automatic Defect Review", right: "候補座標へ移動し、欠陥を再検出して焦点・明るさ・視野を調整し、比較可能な画像を自動保存する" },
            { left: "ADC｜Automatic Defect Classification", right: "画像・信号・位置・設計情報から、粒子、傷、欠け、ブリッジ、残留物などのクラスへ自動分類する" },
            { left: "ルール・特徴量分類", right: "寸法、形、明暗、方向、位置など定義した特徴を使う。説明しやすいが新しい欠陥への対応が必要" },
            { left: "機械学習・深層学習", right: "多数の画像例から特徴を学び、複雑な欠陥を分ける。学習データ、ラベル品質、製品・層の変化を管理する" },
            { left: "人による確認", right: "新規・低頻度・分類不確実な候補、工程判断に重要な欠陥を確認し、分類辞書と学習データを更新する" },
            { left: "オフライン分類", right: "撮像装置を分類処理から解放し、保存画像を別サーバーで再分類・再集計して装置稼働時間を確保する" },
          ],
        },
      ],
      paragraphs: [
        "日立ハイテクはCR7300で高速ADRとAIを利用したADC、Applied MaterialsはSEMVision H20・G9で深層学習による欠陥抽出・分類を示しています。",
        "AI分類でもクラス名の定義、誤分類、未分類、学習範囲外の画像を管理します。精度の数字だけでなく、誰がどの条件で再確認し、分類体系を変更するかを決めます。",
      ],
    },
    {
      id: "pareto",
      heading: "欠陥パレートは、何を先に直すか決めるための分類別集計",
      lead: "レビューした画像が、検査候補の母集団を代表しているかが重要です。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜候補母集団から、行動できる欠陥パレートを作る",
          description:
            "検査候補をすべて同じ確率で見るとは限りません。重要度と代表性を両立するサンプリングが必要です。",
          stages: [
            { label: "01 / POPULATION", title: "候補母集団を把握する", body: "欠陥数、信号、位置、クラスタ、工程・装置・時間変化を確認する" },
            { label: "02 / STRATIFY", title: "候補群を分ける", body: "信号強度、形、位置、検査クラス、新規・既知などで層別する" },
            { label: "03 / SAMPLE", title: "代表点を選ぶ", body: "大きな群だけでなく、低頻度でも重要な群、新しい群、装置固有分布を含める" },
            { label: "04 / REVIEW", title: "再検出・撮像・分類する", body: "見つからなかった候補と分類不確実な候補も含め、結果を記録する" },
            { label: "05 / WEIGHT", title: "母集団へ戻して集計する", body: "サンプリング比率とNot Foundを考慮し、分類別の件数・比率を推定する" },
            { label: "06 / ACTION", title: "優先順位と対策を決める", body: "頻度、歩留まり影響、増加率、工程位置、再発性から解析・点検・条件変更を選ぶ" },
          ],
        },
        {
          type: "note",
          title: "レビュー件数が多いだけでは、正しいパレートにならない",
          body: "同じクラスばかりを撮像したり、見つけやすい欠陥だけを分類したりすると母集団が偏ります。サンプリング方法、再検出率、未分類率を一緒に確認します。",
        },
      ],
      paragraphs: [
        "KLAは欠陥パレートを種類別の頻度を示す集計として説明し、再検出できない候補が多いとパレートが歪むことを指摘しています。",
        "量産では件数の多い欠陥だけでなく、回路の重要位置へ出る欠陥、電気的不良との相関が強い欠陥、短期間で急増した欠陥を優先する場合があります。",
      ],
    },
    {
      id: "performance",
      heading: "再検出率・分類精度・処理能力・試料影響を同時に見る",
      lead: "最高解像度だけでは、量産レビューの性能を表せません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "性能・運用項目",
          rightLabel: "主な確認事項",
          rows: [
            { left: "再検出率・捕捉率", right: "検査候補のうち同じ欠陥をSEM視野内で見つけ、適切な画像を保存できた割合" },
            { left: "Not Found・SNV率", right: "見つからない候補の割合と原因。座標、低コントラスト、表面下、候補変化、検査不要信号を分ける" },
            { left: "画像品質・分解能", right: "分類に必要な形、材料、深さ、エッジを、十分な信号対雑音で見られるか" },
            { left: "分類精度・未分類率", right: "既知クラスを正しく分け、新規・曖昧な欠陥を無理に既存クラスへ入れていないか" },
            { left: "処理能力", right: "搬送、位置合わせ、移動、再検出、撮像、分析、計算を含め、時間当たり何件を有効に分類できるか" },
            { left: "試料ダメージ・帯電", right: "電子線でレジスト・絶縁膜・有機材料・電気状態を変えず、後続解析・製造へ影響を抑えられるか" },
            { left: "装置間マッチング", right: "複数台で再検出、画像、分類、材料・電気信号がそろい、同じパレートを作れるか" },
            { left: "変更・モデル管理", right: "電子源、検出器、ソフト、AIモデル、分類辞書、製品・工程変更後に性能を再確認できるか" },
          ],
        },
      ],
      paragraphs: [
        "微細化・三次元化で光学検査の候補数が増えると、レビューSEMには高解像だけでなく大量候補から重要なものを短時間で分ける能力が求められます。",
        "Applied MaterialsはSEMVision H20でCFE電子源とAI分類、日立ハイテクはCR7300で電子光学・ステージ・画像処理によるADR高速化を示しています。各社の数値は測定条件をそろえて確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体欠陥レビューSEMの代表企業3社",
      lead: "電子光学だけでなく、検査連携・再検出・分類・材料分析を含めて見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "日立ハイテク｜日本", right: "CR7300シリーズで高解像・高速ADR、AIベースADC、電気特性可視化、EDX元素分析、パターンなしウェーハレビューを展開" },
            { left: "Applied Materials｜米国", right: "SEMVision H20・G9などでCFE・反射電子を含む高解像撮像、埋もれた・高アスペクト比欠陥、ADR・AI分類、光学検査連携を展開" },
            { left: "KLA｜米国", right: "eDRシリーズでパターン付き・パターンなしウェーハの電子線レビュー、検査座標・光学画像・設計情報との連携、再検出、分類、欠陥パレートを展開" },
          ],
        },
        {
          type: "note",
          title: "現行製品世代と対象市場を公式資料で確認する",
          body: "製品名や世代は更新されます。同じレビューSEMでも先端前工程、成熟世代、パターンなし、先端後工程で電子線・搬送・分析・処理能力の要件が異なります。",
        },
      ],
      paragraphs: [
        "日立ハイテクは光学ウェーハ検査とCD-SEMも、Applied Materialsは光学検査・電子線計測も、KLAは幅広い光学検査とプロセス制御ソフトも展開しています。レビューSEM単体だけでなく前後装置との接続を見ます。",
        "市場シェアや一律の性能順位はこの記事では扱いません。対象ウェーハ、工程、欠陥、電子線条件、検査装置、レビュー件数をそろえて比較します。",
      ],
    },
    {
      id: "comparison",
      heading: "欠陥レビューSEMメーカーは、8つの条件をそろえて比較する",
      lead: "欠陥を見つけ直し、正しく分類し、量産判断へ間に合わせられるかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 入力検査・対象", right: "光学明視野・暗視野、パターンなし、電子線検査、表面・埋もれた欠陥、対象製品・工程は何か" },
            { left: "2. 座標・再検出", right: "座標変換、検査画像、設計・パターン照合、探索方法、再検出率、Not Found・SNV管理はどうか" },
            { left: "3. 電子光学・信号", right: "電子源、着地エネルギー、ビーム電流、二次・反射電子、電圧コントラスト、傾斜・深い構造への感度" },
            { left: "4. ADR・ADC", right: "自動位置合わせ・再検出・撮像、ルール・AI分類、未分類・新規欠陥、人による確認、モデル更新" },
            { left: "5. 分析・パレート", right: "EDXなどの材料情報、設計・検査画像、分類体系、サンプリング、母集団推定、工程別パレート" },
            { left: "6. 処理能力・量産性", right: "搬送、移動、撮像、分析、計算、時間当たり有効分類数、稼働率、オフライン処理、装置間マッチング" },
            { left: "7. 試料・品質保証", right: "ダメージ、帯電、汚染、焦点・ドリフト、再現性、標準試料、分類精度、変更後の再認定" },
            { left: "8. データ・保守支援", right: "検査装置、設計、MES・歩留まり解析、AI基盤への接続、電子源・部品、校正、拠点、教育、長期保守" },
          ],
        },
      ],
      paragraphs: [
        "最初に、どの検査装置から何種類の候補を受け取るかを決めます。座標・画像・分類情報が接続できなければ、SEM単体の解像度を活用できません。",
        "次に、レビュー結果を何時間以内にどの判断へ使うかを決めます。開発の根本解析、量産異常の早期判定、日常の工程監視では、必要件数・分析深さ・自動化が異なります。",
      ],
    },
    {
      id: "jobs",
      heading: "欠陥レビューSEMメーカーの仕事は、電子光学・画像AI・工程解析をつなぐ",
      lead: "検査座標を、量産で使える欠陥知識へ変換する仕事です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "E-OPTICS", title: "電子光学", body: "電子源、レンズ、偏向、減速、検出器、着地条件、帯電制御、深い構造の撮像を設計します。" },
            { label: "MECHANICS", title: "真空・精密機械", body: "真空、ステージ、干渉計、搬送、除振、磁場・熱対策、座標精度を設計します。" },
            { label: "ADR", title: "再検出・画像処理", body: "座標変換、位置合わせ、近傍探索、焦点、明るさ、欠陥抽出、画像品質を自動化します。" },
            { label: "AI", title: "分類・機械学習", body: "特徴量、分類モデル、学習データ、未分類、新規欠陥、モデル評価・更新を設計します。" },
            { label: "ANALYSIS", title: "材料・電気分析", body: "反射電子、電圧コントラスト、EDX、複数画像から欠陥の特徴と発生源を絞ります。" },
            { label: "APPLICATION", title: "プロセス・アプリ", body: "工程・層・検査装置に合うADR・ADCレシピとサンプリング・パレートを作ります。" },
            { label: "SOFTWARE", title: "制御・データ基盤", body: "装置制御、検査・設計・MES連携、画像保存、オフライン分類、歩留まり解析を実装します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、電子光学・ステージ調整、校正、装置間整合、レシピ移管、障害解析を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、電子線装置のハードウェア、再検出・画像処理、AI分類、プロセスアプリケーション、材料分析、フィールドサービスのどこを担当するか確認します。",
        "電子顕微鏡、真空、精密位置決め、画像処理、機械学習、材料分析、半導体プロセス、品質、生産技術、歩留まり解析の経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体欠陥レビューSEMでよくある質問",
      lead: "装置の役割、座標、撮像、分類、メーカー比較の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "欠陥レビューSEMとは何ですか？", answer: "光学・電子線検査が見つけた欠陥候補の座標へ移動し、同じ欠陥を高倍率で再検出・撮像して、形・材料・電気的特徴を分類する量産向けSEMです。" },
            { question: "主な欠陥レビューSEMメーカーは？", answer: "この記事では日立ハイテク、Applied Materials、KLAを代表例として紹介しています。電子光学、検査連携、再検出、ADR・ADC、材料・電気分析の構成が異なります。" },
            { question: "CD-SEMとの違いは？", answer: "CD-SEMは決めた場所の線幅・穴径などを数値化します。レビューSEMは検査候補が何かを見つけ直し、高倍率画像と欠陥分類を作ります。" },
            { question: "ADRとADCの違いは？", answer: "ADRは候補座標へ移動して欠陥を再検出・撮像する自動レビューです。ADCは取得した画像や信号から欠陥種類を自動分類します。" },
            { question: "なぜ検査座標で欠陥が見つからないことがありますか？", answer: "装置間の座標差、局所位置ずれ、低コントラスト、表面下の信号、候補の移動・変化、光学検査の不要信号などが考えられます。Not Found・SNVとして原因を管理します。" },
            { question: "電圧コントラストとは何ですか？", answer: "導通、絶縁、帯電などの電位状態によってSEM像の明暗が変わる現象を利用し、物理形状だけでは分かりにくい電気的異常候補を可視化する方法です。" },
            { question: "AIがあれば人の分類は不要ですか？", answer: "不要にはなりません。新しい欠陥、低頻度、分類が曖昧な画像、工程判断に重要な候補は人が確認し、分類定義・学習データ・モデルの更新へ反映します。" },
            { question: "欠陥パレートとは何ですか？", answer: "レビューした欠陥を種類別に集計し、どの欠陥が何件あるかを示すものです。対策の優先順位に使いますが、サンプリングと再検出率が母集団を代表しているか確認します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜座標を合わせ、欠陥を見つけ直し、分類を工程へ返す",
      lead: "欠陥レビューSEMは、検査信号を原因解析へ使える画像とパレートへ変える装置です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "COORDINATE", title: "同じ欠陥へ移動する", body: "検査マップ、座標変換、局所位置合わせ、近傍探索を組み合わせる" },
            { label: "SIGNAL", title: "複数信号で見る", body: "二次・反射電子、電圧コントラスト、EDX、傾斜像を使い分ける" },
            { label: "AUTOMATE", title: "ADR・ADCを設計する", body: "再検出・撮像・分類を自動化し、新規・不確実な候補を人が確認する" },
            { label: "DECIDE", title: "パレートから動く", body: "代表性、頻度、影響、工程履歴を見て解析・点検・条件変更へつなぐ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ウェーハ欠陥検査装置メーカー", href: "/guides/semiconductor-wafer-defect-inspection-manufacturers", description: "レビュー前に広いウェーハ面から候補座標を探す装置と原理を見る" },
            { label: "CD-SEM・電子線計測装置メーカー", href: "/guides/semiconductor-cd-sem-manufacturers", description: "レビューSEM、電子線欠陥検査、寸法計測の問いと出力を比較する" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "ウェーハ・マスク・パッケージを含む装置企業の全体地図を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "探す・測る・詳しく見る・工程へ戻す全体フローを見る" },
            { label: "アプライドマテリアルズ", href: "/guides/applied-materials-semiconductor-equipment", description: "SEMVisionを含む加工・検査・計測の製品領域を見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "レビューした粒子・表面汚染の低減につながる装置を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "レビュー結果を前工程の反復へ戻す位置を確認する" },
            { label: "品質管理職へのルート", href: "/guides/quality-engineer-route", description: "欠陥分類・原因解析・再発防止に近い経験の整理方法を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、入力検査・対象、座標・再検出、電子光学・信号、ADR・ADC、分析・パレート、処理能力・量産性、試料・品質保証、データ・保守支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "日立ハイテク・Applied Materials・KLAから1社を選び、公式製品を入力検査・座標連携・再検出・電子信号・ADR／ADC・欠陥パレートの6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-wafer-defect-inspection-manufacturers",
    "semiconductor-cd-sem-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "applied-materials-semiconductor-equipment",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-cleaning-process",
    "semiconductor-etching-process",
    "semiconductor-cmp-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["hitachi-hightech", "applied-materials", "kla"],
};
