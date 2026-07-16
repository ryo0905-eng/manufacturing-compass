import type { GuideArticle } from "@/content/guides/types";

export const semiconductorWaferProberManufacturersGuide: GuideArticle = {
  slug: "semiconductor-wafer-prober-manufacturers",
  title: "半導体ウェーハプローバメーカーとは？東京精密・東京エレクトロンなどを初心者向けに図解",
  description:
    "ウェーハプローバは、ウェーハを搬送・位置合わせし、プローブカードを各ダイへ接触させる装置です。量産機と開発用プローブシステム、主要メーカー、温度・荷重・精度などの比較軸を図解します。",
  targetQuery: "半導体 ウェーハプローバ メーカー",
  searchIntent:
    "ウェーハプローバの役割、テスタ・プローブカードとの違い、量産機と開発用システムの違い、東京精密・東京エレクトロン・FormFactor・MPIなどの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "東京精密、東京エレクトロン、FormFactor、MPIの公式製品情報をもとに、量産ウェーハプローバと研究開発用プローブシステムの役割、搬送、位置合わせ、接触、温度、荷重、対象デバイスを整理しました。市場シェアや企業の優劣ではなく、用途と測定条件をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のウェーハテスト記事でテスタ・プローバ・プローブカードの役割を整理したうえで、位置合わせと接触を担う装置企業を独立して調べる記事が必要だと判断",
    "東京精密と東京エレクトロンの公式情報で、300mm量産機、フレーム対応、搬送、XY・Z制御、温度、荷重、プローブカード設定の製品領域を確認",
    "FormFactorとMPIの公式情報で、研究開発・特性評価、RF・パワー・シリコンフォトニクス、手動・半自動・自動プローブシステムの領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "AP3000/AP3000e Probing Machines",
      url: "https://www.accretech.com/en/product/semicon/semi/probe_semi/probingmachine_ap3000ap3000e.html",
      publisher: "TOKYO SEIMITSU CO., LTD.",
      accessedAt: "2026-07-16",
    },
    {
      title: "FP3000W Probing Machine",
      url: "https://www.accretech.com/en/product/semicon/semi/probe_semi/fp3000.html",
      publisher: "TOKYO SEIMITSU CO., LTD.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Test Prexa Series",
      url: "https://www.tel.com/product/prexa.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-16",
    },
    {
      title: "Test Precio Series",
      url: "https://www.tel.com/product/precio.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-16",
    },
    {
      title: "Advanced Probe Systems",
      url: "https://www.formfactor.com/products/probe-systems/dedicated-systems/vacuum-probe-systems/",
      publisher: "FormFactor, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "MPI Automated Probe Systems",
      url: "https://www.mpi-corporation.com/ast/engineering-probe-systems/mpi-automated-systems/",
      publisher: "MPI Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "What Is ATE? Probers and Test Handlers",
      url: "https://www.advantest.com/en/semiconductor-basics/automated-test-equipment/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "ウェーハプローバを調べても、テスタやプローブカードとの違い、量産機と研究開発用プローブステーションの違い、XY精度・Z荷重・温度が何を意味するのか分かりにくくありませんか。",
    conclusion:
      "ウェーハプローバは、ウェーハを搬送・保持し、ダイとプローブカードを画像で位置合わせし、決めた荷重で接触させ、テスタの判定結果をウェーハマップへ結び付けます。企業比較では、量産か開発か、基板サイズ、対象デバイス、温度、荷重、接触精度、並列性、自動化をそろえます。",
    learnings:
      "ウェーハプローバの構成、テストセル、接触フロー、量産機と開発機、ウェーハ・フレーム対応、温度・高荷重、対象デバイス、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "ウェーハプローバメーカーを比べるときは、XY精度だけでなく、『何を、どの温度で、何本の端子へ、どの荷重で、何ダイずつ接触させるか』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜ウェーハを搬送し、各ダイへ接触して結果を残す",
      description:
        "量産ウェーハテストの代表的な動作を単純化しています。プローブカード方式、並列数、温度、ウェーハ形状で動作は変わります。",
      stages: [
        { label: "01 / LOAD", title: "ウェーハを搬送", body: "カセットなどからウェーハを取り出し、IDと向き、状態を確認する" },
        { label: "02 / CHUCK", title: "チャックへ保持", body: "ウェーハを平らに保持し、必要な温度へ調整する" },
        { label: "03 / ALIGN", title: "位置を合わせる", body: "ウェーハ上の基準とプローブ先端を観察し、XY・回転・高さを補正する" },
        { label: "04 / CONTACT", title: "端子へ接触", body: "ステージを移動・上昇させ、設定した位置と荷重でプローブを接触させる" },
        { label: "05 / TEST", title: "電気試験", body: "テスタが電源・信号を与えて応答を測り、ダイまたはサイトごとに判定する" },
        { label: "06 / MAP", title: "次の位置へ移動", body: "結果をウェーハマップへ記録し、次のダイ群へ移動して繰り返す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "ローダ・搬送", right: "カセット、FOUP、単枚、ダイシングフレームなどから対象物を安全に出し入れする" },
        { left: "チャック・ステージ", right: "ウェーハを保持し、XY・回転・Z方向へ高精度に移動する" },
        { left: "アライメント光学系", right: "ウェーハ基準、ダイ電極、プローブ先端を観察して位置関係を補正する" },
        { left: "プローブカード保持部", right: "カードを固定し、平行度、高さ、交換、検査、清掃を管理する" },
        { left: "温度制御", right: "チャックや周辺環境を加熱・冷却し、接触中のウェーハ温度を整える" },
        { left: "テスタインターフェース", right: "テストヘッド、プローブカード、プローバを機械・電気・通信で統合する" },
        { left: "制御・データ", right: "レシピ、ウェーハID、接触位置、サイト、判定、装置状態を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "ウェーハプローバメーカーとは、切断前のダイへ正確な接触を作る装置企業",
      lead: "プローバが物理的な位置と接触を作り、テスタが電気を測ります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "HANDLE", title: "搬送・保持", body: "薄く壊れやすいウェーハを識別し、表裏や欠けに注意してチャックへ載せます。" },
            { label: "ALIGN", title: "位置合わせ", body: "微細なダイ電極とプローブ先端の相対位置、回転、平行度を補正します。" },
            { label: "CONTACT", title: "接触制御", body: "Z移動と荷重を制御し、多数の接点を安定して導通させます。" },
            { label: "AUTOMATE", title: "連続運転", body: "測定順序、温度、判定マップ、カード清掃、ロット搬送を自動化します。" },
          ],
        },
        {
          type: "note",
          title: "ウェーハテスト記事と検索意図を分ける",
          body: "試験の目的、測定、ビニング、ウェーハマップはウェーハテスト記事で説明します。本記事はプローバの装置構成、種類、企業、選定方法を扱います。",
        },
      ],
      paragraphs: [
        "アドバンテストはATEの解説で、プローバがウェーハ上の各ICへプローブカードを接触させる装置だと説明しています。プローバは測定器そのものではなく、測定可能な機械状態を繰り返し作る装置です。",
        "装置メーカーは精密ステージ、搬送、光学、温調、荷重、振動、制御、工場通信を統合します。微細化や多ピン化だけでなく、薄ウェーハ、ダイシングフレーム、パワー、RF、光デバイスなどへ対応領域が広がっています。",
      ],
    },
    {
      id: "test-cell",
      heading: "テストセルでは、テスタ・プローブカード・プローバの役割を分ける",
      lead: "測定値には、電気経路と機械接触の両方が影響します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "テストセル要素",
          rightLabel: "主な役割",
          rows: [
            { left: "ATE・テストヘッド", right: "電源と信号を生成し、ダイの応答を測定・判定する" },
            { left: "プローブカード", right: "テスタの信号経路を、多数の微細なダイ電極へ接続する" },
            { left: "ウェーハプローバ", right: "ウェーハを搬送・保持し、カードとの位置、平行度、接触、温度を作る" },
            { left: "チャック・熱系", right: "ウェーハを支持し、常温・高温・低温などの測定環境を整える" },
            { left: "工場・データ系", right: "ウェーハID、レシピ、ダイ座標、サイト、判定、装置履歴を結ぶ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ウェーハテストの仕組み", href: "/guides/semiconductor-wafer-test", description: "接触から測定・ビニング・ウェーハマップまでを見る" },
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "信号を生成・測定するATE本体と主要企業を見る" },
            { label: "テストハンドラメーカー", href: "/guides/semiconductor-test-handler-manufacturers", description: "パッケージ後の製品をソケットへ運ぶ装置との違いを見る" },
          ],
        },
      ],
      paragraphs: [
        "正常なダイでも、位置ずれ、平行度、汚れ、針先状態、荷重、温度、信号経路に問題があれば不合格に見えることがあります。原因を製品・カード・プローバ・テスタへ切り分けます。",
        "装置選定ではプローバ単体の精度だけでなく、使用するカード、テストヘッド、並列サイト、温度、信号帯域、工場搬送を含むテストセルで適合を確認します。",
      ],
    },
    {
      id: "system-types",
      heading: "量産プローバと開発用プローブシステムは、優先する自動化が違う",
      lead: "同じウェーハへ接触しても、ロット処理と測定自由度では設計が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置区分",
          rightLabel: "特徴と用途",
          rows: [
            { left: "量産全自動プローバ", right: "カセット・FOUP搬送、ID、連続アライメント、ダイ移動、マップ、工場通信を自動化し、高い稼働率を狙う" },
            { left: "半自動プローブシステム", right: "ウェーハ交換や測定器設定の一部を人が行い、位置移動・温度・測定シーケンスを自動化する" },
            { left: "手動プローブステーション", right: "試作、故障解析、教育、個別デバイス評価などで、柔軟にプローブ位置と測定構成を変える" },
            { left: "フレームプローバ", right: "個片化済みまたはフレーム上のウェーハ・デバイスへ補正をかけながら接触する" },
            { left: "専用プローブシステム", right: "RF・ミリ波、パワー、低ノイズ、シリコンフォトニクス、MEMSなどへ環境と測定器を統合する" },
          ],
        },
        {
          type: "note",
          title: "量産機と開発機を同じ仕様表で順位付けしない",
          body: "量産機はロット搬送、処理能力、復旧、工場接続を重視し、開発機は測定器配置、遮蔽、光・RF、温度範囲、観察性、構成変更を重視します。用途をそろえて比較します。",
        },
      ],
      paragraphs: [
        "東京精密と東京エレクトロンは、300mmを含む全自動量産ウェーハプローバを公式に案内しています。フレームやメモリ、先端パッケージ向けなど、対象に応じた装置・オプションがあります。",
        "FormFactorとMPIは、手動から自動までの研究開発・特性評価用プローブシステムを展開し、RF、パワー、低ノイズ、シリコンフォトニクスなどの用途を示しています。",
      ],
    },
    {
      id: "contact-alignment",
      heading: "位置合わせ・平行度・Z荷重が、多数の接点を同時に導通させる",
      lead: "XYだけ合っても、高さと傾きが合わなければ接触はそろいません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "制御項目",
          rightLabel: "確認すること",
          rows: [
            { left: "XY・回転", right: "ダイ電極とプローブ配列の横方向位置、ウェーハの回転、ダイ配列を合わせる" },
            { left: "Z・オーバードライブ", right: "最初の接触から追加移動を管理し、必要な接触変形と荷重を作る" },
            { left: "平行度・傾き", right: "カード面とウェーハ面を合わせ、広い範囲・多ピンで接触開始の差を抑える" },
            { left: "光学・画像認識", right: "基準マーク、電極、プローブ先端、接触痕、異物などを観察・補正する" },
            { left: "接触痕・カード状態", right: "電極への痕跡と針先位置・汚れを確認し、清掃・交換へつなぐ" },
            { left: "再現性", right: "カード交換、温度変更、ロット切替、保守後も同じ位置と接触を再現する" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンはPrexaで光学系・アルゴリズムによる高精度接触やプローブ先端・接触痕検査を、PrecioでXY・Z制御やカード平行度調整を示しています。",
        "東京精密のAP3000/AP3000eは高精度・高スループットのステージと、カード傾き、カード自動設定・交換などの選択肢を公開しています。カード仕様と接触荷重を合わせて評価します。",
      ],
    },
    {
      id: "thermal-load",
      heading: "温度・高荷重・振動は、測定条件と接触安定性を左右する",
      lead: "多ピン化と高発熱化では、プローバの機械・熱設計がテストセル全体へ影響します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "THERMAL", title: "温度制御", body: "チャック温度、ウェーハ内の温度差、安定時間、結露、通電発熱を管理します。" },
            { label: "FORCE", title: "接触荷重", body: "端子数とプローブ方式に応じた総荷重を、ステージ・カード保持部で受けます。" },
            { label: "RIGIDITY", title: "剛性・平行度", body: "荷重による変形や傾きを抑え、広いカードでも接触高さをそろえます。" },
            { label: "VIBRATION", title: "振動・静定", body: "移動後の揺れを抑え、位置決めから接触・測定までの待ち時間を短くします。" },
            { label: "NOISE", title: "電気ノイズ", body: "低電流・低電圧測定では遮蔽、接地、配線、チャック構造を含めて評価します。" },
            { label: "ENV", title: "測定環境", body: "RF、光、真空、磁場、湿度など、対象デバイスに必要な環境を統合します。" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンはPrexa系で高発熱デバイスやメモリ向けの熱・高荷重制御を示し、東京精密はAP3000系で常温・高温・低温・低ノイズのチャック選択肢を案内しています。",
        "FormFactorとMPIは、パワー、RF、低ノイズ、広い温度範囲などの開発用システムを公開しています。温度範囲の数字だけでなく、測定中の安定性、ケーブル・プローブ、遮蔽を含めて見ます。",
      ],
    },
    {
      id: "applications",
      heading: "ロジック・メモリ・パワー・RF・光では、プロービング課題が変わる",
      lead: "対象デバイスから必要な接触、熱、信号、搬送を逆算します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "LOGIC", title: "ロジック・SoC", body: "微細電極、多ピン、並列サイト、高発熱、先端パッケージ向けKGDを考慮します。" },
            { label: "MEMORY", title: "メモリ", body: "非常に多い接点、広いカード、高い総荷重、多数ダイの並列試験と温度を重視します。" },
            { label: "POWER", title: "パワーデバイス", body: "高電圧・大電流、高温、裏面接触、安全、絶縁、熱、低オン抵抗測定へ対応します。" },
            { label: "RF", title: "RF・ミリ波", body: "短い信号経路、校正、遮蔽、プローブ配置、振動、温度を測定器と統合します。" },
            { label: "PHOTONICS", title: "シリコンフォトニクス", body: "電気接触と光ファイバー・光学系の位置を同時に合わせ、光結合を維持します。" },
            { label: "MEMS", title: "MEMS・センサー", body: "圧力、動き、光などの刺激や専用環境を、接触・測定シーケンスへ組み込みます。" },
          ],
        },
      ],
      paragraphs: [
        "東京精密はAP3000/AP3000eの対象としてメモリ、MPU・SoC、ロジック、パワーを示し、東京エレクトロンはPrexa系でKGD、高発熱、メモリの多ピン・高荷重などを説明しています。",
        "FormFactorとMPIは、一般的なDC評価に加え、RF・ミリ波、パワー、低ノイズ、シリコンフォトニクスなどの専用システムを案内しています。企業名より先に測定用途を決めます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "主要メーカーは、量産・開発と対象デバイスの領域が異なる",
      lead: "代表企業を順位ではなく、公式に確認できる装置領域へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な製品領域",
          rows: [
            { left: "東京精密（ACCRETECH）", right: "300mm量産プローバAP3000/AP3000e、200mm系、ウェーハ・ダイシングフレーム対応機、搬送・カード設定・工場ネットワークなど" },
            { left: "東京エレクトロン", right: "全自動300mm Prexa、メモリ向けPrexa MS、Precio、200mm Precio octo、フレーム・個片対応などの量産テスト製品" },
            { left: "FormFactor", right: "200mm・300mmの手動／半自動／自動プローブシステム、DC・低ノイズ・RF・パワー・シリコンフォトニクス向けシステム" },
            { left: "MPI", right: "200mm・300mmの開発用自動プローブシステム、デバイス特性・信頼性・故障解析、RF・パワー・MEMS・シリコンフォトニクスなど" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、網羅的な市場順位ではない",
          body: "量産プローバと研究開発用システムは目的が異なり、企業ごとに製品・サービス範囲も違います。同じ用途、基板サイズ、温度、測定方式で比較してください。",
        },
      ],
      paragraphs: [
        "東京精密と東京エレクトロンは量産ウェーハテストの自動搬送・高精度接触を軸に比較できます。一方、FormFactorとMPIは開発・特性評価で必要な測定自由度と専用環境を広く公開しています。",
        "同じ企業でも、300mm量産、200mm、フレーム、メモリ、パワー、RF、光などで製品が分かれます。企業単位ではなく、対象製品シリーズと用途を対応させます。",
      ],
    },
    {
      id: "comparison",
      heading: "ウェーハプローバメーカーを比較する8つの軸",
      lead: "精度の数字一つではなく、測定対象とテストセル全体をそろえます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "用途", body: "量産、試作、特性評価、信頼性、故障解析のどこで使うか" },
            { label: "02", title: "対象物", body: "ウェーハ径、材質、厚さ、反り、フレーム、個片、パネルへの対応" },
            { label: "03", title: "デバイス", body: "ロジック、メモリ、パワー、RF、光、MEMSと電極・裏面接触" },
            { label: "04", title: "接触", body: "XY・Z再現性、平行度、総荷重、カードサイズ、先端・接触痕検査" },
            { label: "05", title: "温度・環境", body: "温度範囲、均一性、安定時間、結露、低ノイズ、遮蔽、光・RF環境" },
            { label: "06", title: "生産性", body: "搬送、アライメント、移動・静定、測定、カード清掃、段取り、稼働率" },
            { label: "07", title: "自動化", body: "ID、レシピ、カード交換・設定、マップ、AMHS、GEM、遠隔保守" },
            { label: "08", title: "統合・支援", body: "対応テスタ・カード、測定器、治具、校正、アプリケーション、サービス" },
          ],
        },
      ],
      paragraphs: [
        "カタログのXY精度、荷重、温度範囲、処理能力は、カード、ウェーハ、温度、並列サイト、測定時間など前提が異なります。数字を横並びにする前に評価条件を確認します。",
        "量産価値は最高速度だけで決まりません。誤接触、再試験、カード損耗、温度待ち、アシスト、段取り、保守、復旧、データ整合を含む実効稼働で比較します。",
      ],
    },
    {
      id: "ecosystem-jobs",
      heading: "周辺企業と職種は、精密機械・測定・接触・工場自動化をつなぐ",
      lead: "プローバはテストセルと工場搬送の接点にあります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・周辺領域",
          rightLabel: "主な仕事とプローバとの接点",
          rows: [
            { left: "機械・精密ステージ", right: "XY・Z・回転軸、剛性、振動、平行度、搬送、チャック、カード保持部を設計する" },
            { left: "光学・画像処理", right: "基準、ダイ電極、プローブ先端、接触痕、異物を認識し、補正へ結ぶ" },
            { left: "熱・電気・計測", right: "温度、低ノイズ、高電圧・大電流、RF・光、接地・遮蔽を測定系へ統合する" },
            { left: "制御・ソフトウェア", right: "搬送、アライメント、接触順序、ウェーハマップ、UI、テスタ・工場通信を開発する" },
            { left: "アプリケーション", right: "ウェーハ、カード、ATE、温度、荷重、並列数を合わせ、相関と量産条件を立ち上げる" },
            { left: "フィールドサービス", right: "据付、精度・平行度・温度調整、故障解析、部品交換、量産復帰を支える" },
            { left: "プローブカード企業", right: "電極配置、電気性能、接触力、寿命、清掃、カード平坦度を装置へ適合させる" },
            { left: "ATE・測定器企業", right: "テストヘッド、信号経路、測定シーケンス、校正、サイト判定を統合する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "前工程・後工程・テスト装置企業を工程地図で見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "光学検査・レビュー・寸法計測との違いを見る" },
            { label: "装置エンジニアへの転職", href: "/guides/equipment-engineer-route", description: "装置保全・立ち上げ経験のつなぎ方を見る" },
          ],
        },
      ],
      paragraphs: [
        "精密位置決め、自動搬送、画像処理、温調、振動、電気計測、治具、装置保全、工場通信の経験はプローバの仕事へ接点を整理しやすい領域です。",
        "経験を説明するときは、位置・接触再現性、誤接触、処理時間、温度安定、段取り、停止・復旧、測定相関、トレーサビリティのどこへ貢献したかを数値と担当範囲で整理します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体ウェーハプローバメーカーでよくある質問",
      lead: "テスタ・カード・ハンドラとの違いと選び方を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "ウェーハプローバとは何ですか？", answer: "ウェーハを搬送・保持し、各ダイの電極とプローブカードを位置合わせして接触させる装置です。テスタの判定とダイ座標をウェーハマップへ結び付けます。" },
            { question: "主なウェーハプローバメーカーは？", answer: "この記事では量産機の代表例として東京精密と東京エレクトロン、研究開発・特性評価用システムの例としてFormFactorとMPIを紹介しています。網羅的な市場順位ではありません。" },
            { question: "テスタとプローバの違いは？", answer: "テスタは電源・信号を与えて応答を測定・判定します。プローバはウェーハを運び、温度、位置、平行度、接触荷重を整えます。" },
            { question: "プローブカードとの違いは？", answer: "プローブカードはテスタの電気信号をダイ電極へ接続する接触部品です。プローバはそのカードとウェーハの位置・高さを合わせ、繰り返し接触させる装置です。" },
            { question: "テストハンドラとの違いは？", answer: "プローバは主に個片化前のウェーハをプローブカードへ接触させます。テストハンドラは主にパッケージ後の製品を搬送・温度調整し、ソケットへ接触させます。" },
            { question: "量産プローバとプローブステーションの違いは？", answer: "量産プローバはロット搬送、ID、連続測定、マップ、工場通信と稼働率を重視します。開発用ステーションは測定構成、観察性、温度・RF・光などの自由度を重視します。" },
            { question: "XY精度が高い装置ほどよいですか？", answer: "XY精度だけでは決まりません。Z再現性、平行度、総荷重、温度、カード、静定時間、ウェーハ状態を含め、対象製品で安定接触できるかを確認します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜用途・対象物・接触・温度・自動化をそろえてメーカーを見る",
      lead: "ウェーハプローバは、微細な電極と測定器を量産または開発現場でつなぐ精密装置です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PURPOSE", title: "用途を決める", body: "量産、特性評価、信頼性、故障解析のどこで使うかを確認する" },
            { label: "WAFER", title: "対象物を合わせる", body: "径、材質、厚さ、反り、フレーム、デバイスと電極を確認する" },
            { label: "CONTACT", title: "接触条件を見る", body: "XY・Z、平行度、荷重、カード、温度、ノイズを一つの系で見る" },
            { label: "CELL", title: "運用まで比較する", body: "テスタ、並列、搬送、段取り、稼働率、データ、保守を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "プローバを使う試験工程とウェーハマップを見る" },
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "ATEの仕組みとアドバンテスト・Teradyneなどを見る" },
            { label: "テストハンドラメーカー", href: "/guides/semiconductor-test-handler-manufacturers", description: "パッケージ最終試験の搬送・温度装置を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置企業を一つの地図で見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "テスト・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのプローバを選び、用途、対象物、デバイス、温度、プローブカード、荷重、自動化の7項目で整理してください。同じ測定用途へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "東京精密・東京エレクトロン・FormFactor・MPIから1社を選び、公式製品を用途・対象物・温度・接触・自動化の5項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-wafer-test",
    "semiconductor-tester-ate",
    "semiconductor-test-handler-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-final-test",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["tokyo-electron"],
};
