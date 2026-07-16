import type { GuideArticle } from "@/content/guides/types";

export const semiconductorVacuumGaugePressureControlValveManufacturersGuide: GuideArticle = {
  slug: "semiconductor-vacuum-gauge-pressure-control-valve-manufacturers",
  title: "半導体用真空計・圧力制御バルブメーカーとは？MKS・INFICON・VAT・ULVACを図解",
  description:
    "半導体製造装置の真空計と圧力制御バルブについて、圧力測定、スロットル制御、排気コンダクタンス、代表的な測定原理、主要メーカー、比較軸を初心者向けに図解します。",
  targetQuery: "半導体 真空計 圧力制御バルブ メーカー",
  searchIntent:
    "成膜・エッチング装置でチャンバー圧力を測る真空計と、排気量を調整する圧力制御バルブの役割、測定原理、閉ループ制御、代表メーカー、選定条件、関連職種を知りたい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "MKS、INFICON、VAT、ULVACの公式製品・技術情報をもとに、チャンバー、真空計、圧力コントローラ、スロットルバルブ、真空ポンプの閉ループへ整理しました。測定範囲や制御速度を単純比較せず、圧力域、ガス依存性、温度・副生成物、設置位置、バルブ方式、排気系、校正・保守条件をそろえて比較します。",
  showCareerCtas: false,
  experienceBasis: [
    "真空ポンプ記事で説明した排気系を、圧力を測りレシピ設定へ維持する計測・制御部品まで拡張",
    "真空計とバルブを別々に扱わず、ガス流量・チャンバー容積・配管・ポンプを含む閉ループとして整理",
    "運営者固有の圧力条件や装置構成を扱わず、公式公開情報で確認できる一般原理と比較観点に限定",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Vacuum Pressure Control for Semiconductor Fabrication",
      url: "https://www.mks.com/n/semiconductor-vacuum-pressure-control",
      publisher: "MKS Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "SKY CDG100D Capacitance Manometer",
      url: "https://www.inficon.com/en/products/vacuum-gauge-and-controller/sky-cdg100d",
      publisher: "INFICON",
      accessedAt: "2026-07-16",
    },
    {
      title: "BCG450 Combination Vacuum Gauge",
      url: "https://www.inficon.com/en/products/vacuum-gauge-and-controller/bcg450",
      publisher: "INFICON",
      accessedAt: "2026-07-16",
    },
    {
      title: "Process Control & Isolation",
      url: "https://www.vatgroup.com/solutions/semiconductor-production/process-control-isolation",
      publisher: "VAT Group",
      accessedAt: "2026-07-16",
    },
    {
      title: "61.7 HV Butterfly Control Valve",
      url: "https://www.vatgroup.com/series/617-hv-butterfly-control-valve",
      publisher: "VAT Group",
      accessedAt: "2026-07-16",
    },
    {
      title: "Pirani Vacuum Gauge SP1",
      url: "https://showcase.ulvac.co.jp/en/products/vacuum-gauge/pirani-vacuum-gauge/sp1.html",
      publisher: "ULVAC, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Cold Cathode Gauge SC1",
      url: "https://showcase.ulvac.co.jp/en/products/vacuum-gauge/cold-cathode-gauge/sc1.html",
      publisher: "ULVAC, Inc.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "真空装置には圧力計が一つ付いていればよいと思いがちですが、実際にはピラニ、隔膜、冷陰極、熱陰極など複数の真空計が登場します。さらに排気側にはスロットルバルブがあり、真空ポンプとの役割分担も分かりにくくありませんか。",
    conclusion:
      "真空計は圧力を数値化し、圧力制御バルブはポンプへ抜ける流れや入口流量を変え、設定圧力へ近づけます。重要なのは計器単体の範囲ではなく、測定原理、ガス・温度依存性、設置位置、制御周期、バルブの流量特性、配管・ポンプを一つの圧力制御系として見ることです。",
    learnings:
      "真空計と圧力制御バルブの役割、下流制御の仕組み、直接・間接測定、代表的な真空計、バタフライ・ペンデュラムなどのバルブ、主要メーカー4社、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私はチャンバー圧力を、真空ポンプが一方的に作る値ではなく、流入するガスと排気コンダクタンスの釣り合いをセンサとバルブで保つ制御量として見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜チャンバー圧力を測り、排気側で調整するまで",
      description:
        "代表的な下流圧力制御を単純化した流れです。装置により入口側制御や複数センサも使われます。",
      stages: [
        { label: "01 / SUPPLY", title: "ガスが流入する", body: "MFCやバルブからプロセスガス・パージガスがチャンバーへ入る" },
        { label: "02 / PROCESS", title: "チャンバー内で反応する", body: "温度、プラズマ、表面反応、容積により圧力とガス負荷が変化する" },
        { label: "03 / MEASURE", title: "真空計が圧力を測る", body: "隔膜の変位、熱伝導、電離電流など、圧力域に合う原理で信号へ変換する" },
        { label: "04 / COMPARE", title: "設定値と比較する", body: "コントローラが測定圧力とレシピの設定圧力との差を計算する" },
        { label: "05 / THROTTLE", title: "バルブ開度を変える", body: "排気経路のコンダクタンスを変え、ポンプへ抜ける実効的な流れを調整する" },
        { label: "06 / STABILIZE", title: "設定圧力へ維持する", body: "ガス・反応・ポンプ負荷の変動へ追従し、圧力を目標範囲へ保つ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "構成要素",
      rightLabel: "主な役割",
      rows: [
        { left: "真空計・圧力センサ", right: "測定位置の全圧を電気信号へ変え、表示・制御・インターロックへ渡す" },
        { left: "圧力コントローラ", right: "設定値と測定値の差から、バルブ開度や入口流量の指令を計算する" },
        { left: "スロットルバルブ", right: "排気経路の通りやすさを連続的に変え、チャンバー圧力を調整する" },
        { left: "隔離・ゲートバルブ", right: "チャンバー、ロードロック、ポンプを切り離し、工程シーケンスと保守を支える" },
        { left: "真空ポンプ", right: "ガスを圧縮・移送する。バルブとの組合せで実効排気速度が決まる" },
        { left: "配管・チャンバー", right: "容積、径、長さ、表面、副生成物が応答・圧力分布・保守性へ影響する" },
      ],
    },
  ],
  sections: [
    {
      id: "measurement",
      heading: "真空計は、圧力域とガス依存性に応じて使い分ける",
      lead: "一つの原理で大気圧から超高真空まで高精度に測ることは困難です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表的な原理",
          rightLabel: "測り方と注意点",
          rows: [
            { left: "静電容量式隔膜計", right: "圧力差による隔膜の変位を静電容量で測る直接測定。ガス種類の影響を受けにくく、プロセス圧力制御で使われる" },
            { left: "ピラニ・熱伝導式", right: "気体が熱を運ぶ量から圧力を推定する間接測定。ガス種類と温度の影響を確認する" },
            { left: "冷陰極電離計", right: "放電で生じるイオン電流から高真空を測る。着火、磁場、汚れ、ガス種類の影響を見る" },
            { left: "熱陰極電離計", right: "フィラメントから電子を放出し、生成したイオン電流から高・超高真空を測る。フィラメント保護が必要" },
            { left: "複合真空計", right: "複数原理を一体化し、広い圧力域を切り替えて測る。切替域と各原理の不確かさを確認する" },
          ],
        },
        {
          type: "note",
          title: "センサが示すのは、設置位置の圧力",
          body: "チャンバーとセンサの間に細い配管、温度差、反応生成物、流れがあると、ウェーハ付近と表示値が同じとは限りません。取り付け位置と導管も測定系の一部です。",
        },
      ],
      paragraphs: [
        "INFICONは半導体・プラズマ用途向け静電容量式隔膜計と、ロードロック・プロセス・搬送室向け複合真空計を展開しています。ULVACもピラニ、冷陰極、熱陰極など複数方式を公式に示しています。",
        "選定では最大・最小圧力だけでなく、レシピで最も正確に制御したい圧力域、ガス組成、加熱、腐食、ゼロ点、復帰時間、校正方法を確認します。",
      ],
    },
    {
      id: "control",
      heading: "圧力制御バルブは、ポンプを止めずに排気の通りやすさを変える",
      lead: "代表的な下流制御では、ガス流量と圧力をある範囲で独立に調整できます。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜閉ループ圧力制御",
          description:
            "実際の制御則、先行制御、学習機能は製品・装置により異なります。",
          stages: [
            { label: "01", title: "設定圧力を受ける", body: "装置レシピから目標値と遷移時間を受け取る" },
            { label: "02", title: "実圧力を読む", body: "真空計の信号を時刻・単位・レンジとともに取得する" },
            { label: "03", title: "偏差を計算する", body: "設定値との差と変化速度から必要な操作量を求める" },
            { label: "04", title: "開度を動かす", body: "バタフライ板やペンデュラム機構などを駆動する" },
            { label: "05", title: "圧力が変化する", body: "実効排気速度が変わり、チャンバー内のガス量が変化する" },
            { label: "06", title: "変動へ追従する", body: "ガス切替、着火、反応、副生成物、ポンプ変動へ繰り返し補正する" },
          ],
        },
      ],
      paragraphs: [
        "MKSは静電容量式圧力計、コントローラ、スロットルバルブを使う下流圧力制御を公式に解説しています。VATは外部圧力センサと制御バルブを組み合わせ、弁板位置でコンダクタンスを調整する方式を示しています。",
        "バルブ開度と圧力は単純な比例関係ではありません。ガス流量、ポンプ、配管、圧力域によって系のゲインと応答が変わるため、レシピ遷移を含む実機条件で制御を合わせます。",
      ],
    },
    {
      id: "valve-types",
      heading: "バルブ方式は、制御範囲・副生成物・隔離機能で選ぶ",
      lead: "形状ごとに流量特性、シール、占有スペース、保守方法が異なります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "BUTTERFLY", title: "バタフライ", body: "円板の角度で流路面積を変える。コンパクトで高速な制御に使われる。" },
            { label: "PENDULUM", title: "ペンデュラム", body: "弁体を移動させて広いコンダクタンス範囲を作る。副生成物とシール動作を確認する。" },
            { label: "GATE", title: "ゲート・スライド", body: "大きな開口と隔離を担う。制御機能を持つシリーズもある。" },
            { label: "ANGLE", title: "アングル", body: "流路を曲げながら遮断・制御する。配管配置、流れ、堆積、シールを確認する。" },
            { label: "UPSTREAM", title: "入口側制御", body: "入口流量を変えて圧力を調整する。材料供給量との相互作用を考慮する。" },
            { label: "INTEGRATED", title: "一体型", body: "センサ、比例弁、制御電子回路をまとめる。設置性と交換・校正単位を見る。" },
          ],
        },
      ],
      paragraphs: [
        "エッチングや成膜の下流では、粉・凝縮物・腐食性ガスが弁体、シール、軸、センサ導管へ影響します。加熱、表面処理、パージ、清掃周期、交換部品を工程条件と合わせます。",
        "隔離と精密制御を一つのバルブへ持たせるか、別のバルブへ分けるかでも、シール寿命、故障時の動作、保守手順が変わります。",
      ],
    },
    {
      id: "manufacturers",
      heading: "真空計・圧力制御バルブの代表メーカー",
      lead: "公式情報で確認できる製品領域を整理します。市場順位ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "MKS", title: "MKS Instruments", body: "Baratron静電容量式圧力計、Granville-Phillips真空計、圧力コントローラ、スロットル・隔離バルブなどを展開し、半導体の圧力制御系を広く扱います。" },
            { label: "INFICON", title: "INFICON", body: "静電容量式隔膜計、ピラニ、冷陰極・熱陰極、複合真空計、コントローラなどを展開。プロセス室、ロードロック、搬送室などの用途を示しています。" },
            { label: "VAT", title: "VAT Group", body: "半導体向け真空制御・隔離バルブを展開。バタフライ、ペンデュラム、ゲートなどを工程負荷・圧力範囲へ合わせています。" },
            { label: "ULVAC", title: "ULVAC", body: "ピラニ、冷陰極、熱陰極、複合真空計と真空機器を展開。半導体・電子部品製造装置の低真空から高真空までを扱います。" },
          ],
        },
      ],
      paragraphs: [
        "真空計を中心に扱う企業、バルブを中心に扱う企業、センサ・制御・ポンプまで統合する企業で製品境界が異なります。",
        "企業研究では、センサ素子、バルブ機構、制御アルゴリズム、装置組込み、校正・修理のどこが自社技術かを確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "メーカー・製品を比較する8つの軸",
      lead: "カタログの測定範囲や速度だけでなく、実際の工程負荷をそろえます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "確認する内容",
          rows: [
            { left: "1. 対象室・工程", right: "プロセス室、ロードロック、搬送室、成膜、エッチング、PVD、熱処理" },
            { left: "2. 圧力域・測定原理", right: "制御したい範囲、直接・間接測定、ガス依存性、切替域、分解能" },
            { left: "3. プロセス耐性", right: "腐食、堆積、粉、温度、プラズマ、加熱、パージ、センサ保護" },
            { left: "4. 動特性", right: "測定更新、バルブ駆動、整定、オーバーシュート、ガス切替・着火時の追従" },
            { left: "5. バルブ流量特性", right: "制御可能コンダクタンス、弁体方式、口径、配管、ポンプとの組合せ" },
            { left: "6. 校正・再現性", right: "ゼロ点、スパン、温度、交換時差、トレーサビリティ、装置間整合" },
            { left: "7. 統合・安全", right: "通信、アナログ信号、インターロック、停電時位置、隔離、ログ、診断" },
            { left: "8. 保守・供給", right: "清掃、シール・センサ交換、校正、修理、予備品、地域支援、総保有コスト" },
          ],
        },
      ],
      paragraphs: [
        "同じ圧力でも、ガス流量とバルブ開度が変われば滞留時間や排気状態は異なります。圧力値だけでプロセス状態が同じとは限りません。",
        "交換互換を検討するときは、機械寸法と信号だけでなく、センサ応答、ガス補正、フィルタ、PID設定、弁の流量曲線、ファームウェアを確認します。",
      ],
    },
    {
      id: "jobs",
      heading: "真空計・圧力制御バルブメーカーの仕事",
      lead: "センサ、精密機構、流体、制御、真空プロセスが交わる領域です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SENSOR", title: "センサ・電子回路", body: "隔膜、熱、電離、微小信号、温度補償、校正、通信回路を設計します。" },
            { label: "MECHANICAL", title: "バルブ機構", body: "弁体、軸、シール、アクチュエータ、表面、加熱、耐食・耐粒子性を設計します。" },
            { label: "CONTROL", title: "制御ソフト", body: "PID、先行制御、流量特性補正、診断、通信、異常時動作を実装します。" },
            { label: "APPLICATION", title: "アプリケーション", body: "チャンバー、ガス、ポンプ、配管へセンサとバルブを合わせ、実負荷で評価します。" },
            { label: "QUALITY", title: "品質・校正", body: "標準器、トレーサビリティ、リーク、清浄度、量産試験、変更管理を担います。" },
            { label: "SERVICE", title: "サービス", body: "据付、交換、校正、清掃、ログ解析、故障切分け、予防保全を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "真空、流体、機械設計、センサ、計装、組込み制御、校正、設備保全の経験を生かしやすい分野です。",
        "求人では、真空計かバルブか、素子・機構・制御・アプリ・サービスのどこを担当し、半導体装置メーカーとどこまで共同評価するかを確認します。",
      ],
    },
    {
      id: "faq",
      heading: "真空計・圧力制御バルブでよくある質問",
      lead: "基本用語を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "真空計はなぜ複数必要ですか？", answer: "圧力域によって適する測定原理が異なるためです。大気圧付近、粗引き、プロセス圧力、高真空を複数センサで分担します。" },
            { question: "真空ポンプだけで圧力制御できませんか？", answer: "ポンプ回転数で調整する方式もありますが、一般的な下流制御ではポンプを運転しながらバルブで排気コンダクタンスを変えます。" },
            { question: "静電容量式隔膜計の特徴は？", answer: "隔膜の変位を直接測るため、一般にガス種類の影響を受けにくく、半導体のプロセス圧力測定・制御へ使われます。" },
            { question: "バルブ開度が同じなら圧力も同じですか？", answer: "同じとは限りません。ガス流量、ポンプ、配管、温度、副生成物などで圧力は変わります。" },
            { question: "主なメーカーは？", answer: "この記事ではMKS、INFICON、VAT、ULVACを代表例として紹介しています。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜測定・制御・排気を一つの圧力ループとして見る",
      lead: "圧力は、ガスの流入と排気の釣り合いを測って調整した結果です。",
      blocks: [
        {
          type: "links",
          items: [
            { label: "半導体製造装置の部品・サブファブ", href: "/guides/semiconductor-equipment-components-subfab", description: "圧力制御を装置全体の流れへ置く" },
            { label: "真空ポンプメーカー", href: "/guides/semiconductor-vacuum-pump-manufacturers", description: "バルブ下流の排気機構と副生成物対策を見る" },
            { label: "マスフローコントローラーメーカー", href: "/guides/semiconductor-mass-flow-controller-manufacturers", description: "チャンバー入口のガス流量制御を見る" },
            { label: "RF電源・マッチングユニットメーカー", href: "/guides/semiconductor-rf-power-matching-manufacturers", description: "圧力とともにプラズマを決める電力系を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "成膜チャンバーのガス・圧力・温度統合を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "プラズマエッチングの圧力・排気系を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象工程、圧力域、測定原理、プロセス耐性、動特性、バルブ方式、校正・統合、保守支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "MKS、INFICON、VAT、ULVACから1社を選び、公式製品を測定原理・圧力域・設置位置・ガス依存性・制御方式・保守の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-equipment-components-subfab",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-mass-flow-controller-manufacturers",
    "semiconductor-rf-power-matching-manufacturers",
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
