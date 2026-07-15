import type { GuideArticle } from "@/content/guides/types";

export const semiconductorPackagingProcessGuide: GuideArticle = {
  slug: "semiconductor-packaging-process",
  title: "半導体のパッケージングとは？ダイ接合・ワイヤボンド・封止を初心者向けに図解",
  description:
    "半導体のパッケージング工程を初心者向けに図解。ダイ接合、ワイヤボンディング、フリップチップ、アンダーフィル、モールド封止、基板・リードフレーム、外部端子と、BGA・QFN・WLP・2.5D・3Dパッケージを整理します。",
  targetQuery: "半導体 パッケージング 工程",
  searchIntent:
    "半導体パッケージの役割、ダイを基板へ載せて電気接続・封止・外部端子形成する工程、ワイヤボンドとフリップチップの違いを図で理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Intel、ASE、Amkor Technology、TSMCの公式技術・事業情報をもとに、代表的な半導体パッケージングを整理しています。実際の材料、接合温度、荷重、形状、配線、封止条件、信頼性規格は製品・用途・パッケージ形式で異なるため、特定製品の製造条件としては記載していません。",
  showCareerCtas: false,
  experienceBasis: [
    "Intelの公式解説で、ダイ接合、基板、エポキシ、放熱用リッド、組立・試験と、パッケージの保護・接続・機械支持の役割を確認",
    "ASEの公式情報で、ワイヤボンド、フリップチップ、BGA、リードフレーム、SiP、WLP、バンプ、パッケージ基板の基本を確認",
    "Amkor TechnologyとTSMCの公式情報で、積層ダイ、チップレット、2.5D・3D、インターポーザ、異種ダイ統合とKGDの考え方を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "How Silicon Die Become Chip Packages",
      url: "https://newsroom.intel.com/tech101/how-silicon-die-become-chip-packages",
      publisher: "Intel Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "What Are Semiconductors? Assembly and Test",
      url: "https://newsroom.intel.com/tech101/what-are-semiconductors",
      publisher: "Intel Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Package Technologies",
      url: "https://asekh.aseglobal.com/products-services/package.html",
      publisher: "ASE Technology Holding Co., Ltd.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Flip Chip Packaging",
      url: "https://ase.aseglobal.com/flip-chip-packaging/",
      publisher: "ASE Technology Holding Co., Ltd.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Packaging Substrate",
      url: "https://ase.aseglobal.com/packaging-substrate/",
      publisher: "ASE Technology Holding Co., Ltd.",
      accessedAt: "2026-07-15",
    },
    {
      title: "3D Stacked Die Packaging",
      url: "https://amkor.com/technology/3d-stacked-die/",
      publisher: "Amkor Technology, Inc.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Advanced Packaging Services: 3DFabric",
      url: "https://www.tsmc.com/english/dedicatedFoundry/services/advanced-packaging",
      publisher: "Taiwan Semiconductor Manufacturing Company Limited",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "半導体パッケージを『黒い樹脂のケース』と考えると、内部でダイがどう基板へつながり、なぜ小さな接合部や材料の熱膨張が性能と寿命へ影響するのか分かりにくくありませんか。",
    conclusion:
      "パッケージングは、個片化したダイをリードフレームや基板へ固定し、ワイヤまたはバンプで電気接続し、樹脂やアンダーフィルで保護し、外部端子を作る工程です。パッケージは保護容器だけでなく、電源・信号・熱・機械応力をダイと回路基板の間で受け渡すシステムです。",
    learnings:
      "パッケージの役割と断面、ダイ接合から外部端子まで、ワイヤボンドとフリップチップ、アンダーフィル・モールド、リードフレーム・基板、代表形式、反り・剥離・接合不良、2.5D・3D・チップレット、関連職種・企業。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "パッケージは『ダイを包む箱』ではなく、ダイの微細な電極を製品の基板へ広げ、熱と力を逃がしながら機能を保つ第二の回路として見ると理解しやすくなります。",
      caption: "この記事の見方",
    },
    {
      type: "package-assembly-flow",
      title: "図解｜ダイを固定し、電気接続・封止・外部端子を作る",
      description:
        "ワイヤボンド型の基板パッケージを単純化した概念図です。フリップチップ、リードフレーム、ウェーハレベル、モジュールでは工程順と構造が異なります。",
      stages: [
        { kind: "substrate", label: "PREPARE", title: "基材を準備", body: "リードフレームまたは配線を持つパッケージ基板を準備する" },
        { kind: "attach", label: "DIE ATTACH", title: "ダイを固定", body: "ウェーハマップに基づく良品ダイを所定位置へ接着・接合する" },
        { kind: "interconnect", label: "INTERCONNECT", title: "電気的につなぐ", body: "ワイヤ、バンプ、クリップなどでダイ電極と基材を接続する" },
        { kind: "encapsulate", label: "PROTECT", title: "封止・補強する", body: "モールド樹脂やアンダーフィルで接合部とダイを保護する" },
        { kind: "terminal", label: "TERMINAL", title: "外部端子を作る", body: "はんだボールやリードを整え、実装・最終検査へ渡す" },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "半導体パッケージは、保護・接続・放熱・支持の四つを担う",
      lead: "むき出しのダイだけでは、製品の回路基板へ安定して取り付けられません。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PROTECT", title: "環境から守る", body: "湿気、粒子、衝撃、薬品、光などからダイと微細接合部を保護します。" },
            { label: "CONNECT", title: "電気的につなぐ", body: "ダイ上の小さく密な電極を、基板へ実装できる端子配置へ変換します。" },
            { label: "THERMAL", title: "熱を逃がす", body: "ダイで生じた熱を基板、リッド、ヒートスプレッダなどへ伝えます。" },
            { label: "MECHANICAL", title: "形を支える", body: "薄く壊れやすいダイを保持し、搬送・実装・使用時の力を分散します。" },
          ],
        },
      ],
      paragraphs: [
        "Intelはパッケージについて、一つ以上のシリコンダイを搭載し、熱や環境からの保護、物理的な強度、コンピューターとの接続を提供すると説明しています。外側の形だけでなく、内部の電気・熱・機械経路が製品性能を左右します。",
        "必要な機能は製品で異なります。小型センサー、車載マイコン、高電力デバイス、高速プロセッサ、メモリ積層では、端子数、電流、周波数、発熱、寸法、耐環境性の優先順位が変わります。",
      ],
    },
    {
      id: "anatomy",
      heading: "断面は、ダイ・接合材・電気接続・基材・封止材・外部端子で見る",
      lead: "名称を覚えるより、信号と熱がどこを通るかを追うと構造がつながります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "構成要素",
          rightLabel: "主な役割",
          rows: [
            { left: "ダイ", right: "トランジスタと配線を形成した半導体本体。表面または裏面を基材へ向けて搭載する" },
            { left: "ダイ接合材", right: "ダイを固定し、必要に応じて熱・電気を基材側へ伝える" },
            { left: "ワイヤ・バンプ", right: "ダイ電極とリードフレーム、基板、別ダイを電気的に接続する" },
            { left: "リードフレーム・基板", right: "信号・電源・接地を外部端子へ配線し、ダイを機械的に支持する" },
            { left: "封止材・アンダーフィル", right: "ダイと接合部を環境から守り、応力を分散する" },
            { left: "外部端子", right: "リード、はんだボール、ランドなどで製品の回路基板へ接続する" },
          ],
        },
      ],
      paragraphs: [
        "ASEはプラスチックBGAを、基板上のダイをワイヤで接続し、エポキシ系モールド材で封止する構造として説明しています。フリップチップではダイを反転し、バンプを介して基板へ直接接続します。",
        "一つの材料だけを最適化しても、境界の密着、熱膨張差、吸湿、硬さが合わなければ反りや剥離につながります。パッケージは異なる材料を組み合わせる複合構造です。",
      ],
    },
    {
      id: "assembly-flow",
      heading: "基本工程は、良品ダイの選択から接合・接続・封止・端子形成へ進む",
      lead: "前工程のウェーハマップを引き継ぎ、製品IDと材料履歴を保ちます。",
      blocks: [
        {
          type: "process-flow",
          title: "代表的な組立フロー",
          description: "ワイヤボンド型を中心に単純化しています。製品によって洗浄、検査、硬化、個片化、マーキングの位置が変わります。",
          stages: [
            { label: "01", title: "良品ダイを選ぶ", body: "ウェーハマップと照合し、ダイをテープから取り出す" },
            { label: "02", title: "ダイを接合する", body: "基材の所定位置へ接合材で固定し、位置と高さをそろえる" },
            { label: "03", title: "電気接続する", body: "ワイヤボンドまたはフリップチップ接合などで端子をつなぐ" },
            { label: "04", title: "補強・封止する", body: "アンダーフィル、モールド、リッドなどで保護・放熱する" },
            { label: "05", title: "端子・外形を仕上げる", body: "外部端子形成、個片化、外観・最終検査へつなぐ" },
          ],
        },
      ],
      paragraphs: [
        "Intelは組立工程の例として、ダイと必要部品をパッケージ基板へ固定し、ダイと基板の隙間へエポキシを充填し、熱伝導材とリッドを取り付け、その後にバーンインと電気試験を行う流れを示しています。",
        "一方、リードフレーム型ではダイパッドへ接合し、ワイヤ接続後に複数個を一括モールドしてからリード成形・個片化する場合があります。パッケージ名だけでなく、基材と接続方式から工程を確認します。",
      ],
    },
    {
      id: "die-attach",
      heading: "ダイ接合は、位置を固定しながら熱・電気・応力の経路を作る",
      lead: "接着できればよいのではなく、パッケージ機能に合う接合層が必要です。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "POSITION", title: "位置・回転・高さ", body: "ダイを基材パターンへ合わせ、後のワイヤやバンプ接続に必要な精度を確保します。" },
            { label: "ADHESION", title: "密着・硬化", body: "接合材を適量で広げ、ボイドと汚染を抑え、必要な強度まで硬化・接合します。" },
            { label: "THERMAL", title: "熱伝導", body: "発熱するダイでは、接合層の厚さ、ボイド、熱伝導性が接合温度へ影響します。" },
            { label: "ELECTRICAL", title: "電気伝導・絶縁", body: "裏面電極を電気接続するか、絶縁するかで材料要求が変わります。" },
            { label: "STRESS", title: "応力緩和", body: "ダイと基材の熱膨張差を吸収し、反り・剥離・亀裂を抑えます。" },
            { label: "CLEAN", title: "表面清浄度", body: "粒子、酸化、接着剤のはみ出しが接合と後続接続へ影響します。" },
          ],
        },
      ],
      paragraphs: [
        "ダイ接合材にはペースト、フィルム、はんだ系材料などがあり、熱・電気・機械要求で選びます。塗布量不足は接合面積と熱経路を損ない、過剰量はダイ側面や接続部へのはみ出しにつながります。",
        "薄いダイ、大きいダイ、積層ダイでは、ピックアップと搭載時の反り・割れも管理します。前のダイシング工程で生じた端面損傷が、接合荷重や熱で進展する可能性もあります。",
      ],
    },
    {
      id: "interconnect",
      heading: "ワイヤボンドとフリップチップは、電極をつなぐ方向が違う",
      lead: "どちらも広く使われ、端子数・速度・電力・コスト・実装面積で選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "接続方式",
          rightLabel: "構造と特徴",
          rows: [
            { left: "ワイヤボンディング", right: "上向きのダイ電極と基材電極を細いワイヤで一本ずつ接続する。成熟した柔軟な方式だが、ワイヤ長と周辺配置を考える" },
            { left: "フリップチップ", right: "ダイを反転し、表面に形成したバンプを基板へ面状に接続する。短い経路と多端子化に向くが、接合・反り・アンダーフィルを管理する" },
            { left: "クリップ・リボン", right: "幅広い導体でダイとリードを接続し、大電流と低い抵抗・インダクタンスを狙う用途がある" },
            { left: "直接接合・微細接合", right: "ダイ間を微細ピッチで接続し、高密度・短距離の3D統合へ使う。表面平坦度と清浄度が重要になる" },
          ],
        },
      ],
      paragraphs: [
        "ASEはフリップチップを、ダイ表面を基板側へ向け、ワイヤの代わりにバンプで接続する方式と説明しています。端子をダイ周辺だけでなく面内へ配置でき、接続経路を短くしやすい特徴があります。",
        "ワイヤボンドはダイと基板の高さ差をループでつなげ、複数ダイや異なるパッド配置へ対応しやすい方式です。接合部、ワイヤループ、隣接ワイヤ間隔、樹脂流動での変形を管理します。",
      ],
    },
    {
      id: "encapsulation",
      heading: "アンダーフィルとモールドは、接合部へ加わる力と環境を制御する",
      lead: "樹脂で覆えば安心ではなく、流れ方、硬化、密着、熱膨張を合わせます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "保護方式",
          rightLabel: "主な役割と管理点",
          rows: [
            { left: "アンダーフィル", right: "フリップチップのダイ・基板間へ充填し、微小接合部の応力を分散する。ボイド、濡れ、充填時間、硬化を見る" },
            { left: "モールド封止", right: "樹脂でダイ・ワイヤ・基材を覆い、環境と機械負荷から守る。未充填、ワイヤ変形、反り、剥離を見る" },
            { left: "リッド・ヒートスプレッダ", right: "熱伝導材を介してダイの熱を広げ、外部冷却へ渡す。接触、厚さ、平坦度、固定を見る" },
            { left: "コンフォーマル・局所保護", right: "センサー開口や光学面を残しながら、必要な領域だけを保護する" },
          ],
        },
      ],
      paragraphs: [
        "Intelはダイと基板の微小な隙間へエポキシを充填して応力を分散し、熱伝導材とヒートスプレッダを取り付ける例を示しています。保護と放熱は別の材料層で担う場合があります。",
        "樹脂硬化では温度履歴と収縮が反り・界面応力へ影響します。ワイヤ型では樹脂の流れで細いワイヤが変形しないこと、フリップチップ型では狭い隙間へボイドなく充填できることが重要です。",
      ],
    },
    {
      id: "substrate-terminal",
      heading: "リードフレームとパッケージ基板は、ダイの微細端子を外部へ引き出す",
      lead: "パッケージ内部の配線は、信号だけでなく電源・接地・熱を運びます。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "LEADFRAME", title: "リードフレーム", body: "金属フレームがダイ支持と外部リードを兼ねます。QFP、QFN、パワー・アナログなどで使われます。" },
            { label: "SUBSTRATE", title: "有機・セラミック基板", body: "複数配線層とビアで、多数端子をダイ側から外部端子側へ再配置します。" },
            { label: "BGA", title: "はんだボール配列", body: "パッケージ底面へ格子状の端子を配置し、多端子を回路基板へ接続します。" },
            { label: "LAND / LEAD", title: "ランド・リード", body: "底面ランドや外周リードを使い、実装性、検査性、放熱性を設計します。" },
            { label: "RDL", title: "再配線層", body: "ダイ電極を別の位置・間隔へ引き直し、WLPやファンアウトの外部端子へつなぎます。" },
            { label: "INTERPOSER", title: "インターポーザ", body: "複数ダイ間を高密度配線で接続し、下のパッケージ基板へ信号と電源を渡します。" },
          ],
        },
      ],
      paragraphs: [
        "ASEはBGAを、外部端子をはんだボールのマトリクスとして配置するパッケージと説明しています。またパッケージ基板は、ワイヤボンドBGAとフリップチップの接続材料として、多層の信号・電源・接地経路を提供します。",
        "高速信号では配線長、インピーダンス、クロストーク、電源変動を抑え、大電流では抵抗と発熱を抑えます。端子数を増やすだけでなく、基板層構成と外部回路基板まで一続きで設計します。",
      ],
    },
    {
      id: "package-types",
      heading: "代表的なパッケージ形式は、基材・接続・外部端子で分類する",
      lead: "略称だけでなく、断面の違いと用途を確認します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "QFP / QFN", title: "リードフレーム型", body: "外周リードまたは底面ランドで実装します。ワイヤボンドとモールドを使う構造が代表的です。" },
            { label: "BGA / CSP", title: "基板・ボール型", body: "パッケージ基板の底面へボール端子を並べ、多端子と小型化へ対応します。" },
            { label: "FCBGA", title: "フリップチップBGA", body: "ダイをバンプで基板へ接続し、アンダーフィルとBGA端子で実装します。" },
            { label: "WLCSP", title: "ウェーハレベルCSP", body: "ウェーハ状態で再配線・保護・外部端子を形成し、ダイに近い大きさで個片化します。" },
            { label: "FAN-OUT", title: "ファンアウト", body: "再構成した領域へ再配線をダイ外まで広げ、基板なしで端子数と配線自由度を高めます。" },
            { label: "SiP", title: "システムインパッケージ", body: "複数ダイと必要な受動部品などを一つのパッケージ・モジュールへ統合します。" },
          ],
        },
      ],
      paragraphs: [
        "ASEは、フリップチップ、BGA、リードフレーム、SiP、WLCSP、バンピングなどを異なるパッケージ技術として示しています。同じ機能のダイでも、端子、熱、寸法、コスト、実装条件で形式が変わります。",
        "WLPやファンアウトでは、ウェーハまたは再構成パネル上で複数パッケージを一括形成します。従来の『ダイシング後に一個ずつ組み立てる』順番と異なるため、製品フローを確認します。",
      ],
    },
    {
      id: "advanced-packaging",
      heading: "先端パッケージでは、複数ダイを短い配線で一つのシステムへ統合する",
      lead: "パッケージが回路性能とシステム構成を決める比重が増えています。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "統合方式",
          rightLabel: "構造の考え方",
          rows: [
            { left: "2Dマルチチップ", right: "複数ダイを同じ基板上へ並べ、基板配線で接続する" },
            { left: "2.5D", right: "シリコンまたは再配線インターポーザ上へロジック・メモリなどを並べ、高密度に接続する" },
            { left: "3D積層", right: "ダイを上下に重ね、TSVや微細接合で垂直に接続する" },
            { left: "チップレット", right: "機能を複数ダイへ分割し、異なる製造世代・種類のダイをパッケージ内で再統合する" },
            { left: "HBM統合", right: "積層メモリと演算ダイを近接配置し、広い接続幅と短い経路で高帯域化する" },
          ],
        },
        {
          type: "note",
          title: "複数ダイでは、Known Good Dieと組立途中の試験が重要になる",
          body: "一つの不良ダイや接続不良で高価なモジュール全体を失わないよう、組立前のダイ試験、積層途中の試験、完成後の試験を組み合わせます。試験可能な端子と熱条件を設計段階から考えます。",
        },
      ],
      paragraphs: [
        "TSMCは3DFabricを、SoIC、CoWoS、InFOなどの3D積層・先端パッケージ技術群とし、異なる機能・サイズ・製造世代のダイを統合する考え方を示しています。Amkorも薄いダイをワイヤボンドやフリップチップで積層する組立技術を示しています。",
        "ダイ間距離を短くすると帯域と電力効率を改善しやすい一方、微細接合の歩留まり、反り、熱集中、電源供給、試験、修理困難性が課題になります。パッケージ・ダイ・基板・冷却を同時に設計します。",
      ],
    },
    {
      id: "thermal-mechanical",
      heading: "熱と反りは、材料の熱膨張差からパッケージ全体へ生じる",
      lead: "動作時の発熱だけでなく、接合・硬化・実装時の温度履歴も影響します。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "HEAT PATH", title: "熱経路", body: "ダイから接合層、基板、リッド、外部基板、冷却部材へ熱を流します。" },
            { label: "CTE", title: "熱膨張差", body: "シリコン、金属、樹脂、基板が異なる割合で伸縮し、接合部へ繰返し応力を与えます。" },
            { label: "WARPAGE", title: "反り", body: "材料配置と硬化収縮が非対称だと、パッケージ・基板が曲がり、接合と実装へ影響します。" },
            { label: "MOISTURE", title: "吸湿", body: "樹脂へ入った水分が高温工程で膨張し、界面剥離や亀裂の原因になる可能性があります。" },
            { label: "FATIGUE", title: "接合疲労", body: "温度変化で接合部へ繰返し変形が加わり、時間とともに亀裂が進む場合があります。" },
            { label: "HOT SPOT", title: "局所発熱", body: "複数ダイと高電力化で熱が集中し、温度分布と性能が互いに影響します。" },
          ],
        },
      ],
      paragraphs: [
        "パッケージ材料は電気性能だけでなく、熱伝導率、熱膨張率、弾性、吸湿、密着、硬化収縮で選びます。接合温度から室温へ戻るだけでも残留応力が生じます。",
        "温度分布はダイの速度・漏れ電流・寿命へ影響し、反りはバンプ接合、モールド、基板実装へ影響します。熱解析、構造解析、実測を組み合わせ、局所とパッケージ全体を確認します。",
      ],
    },
    {
      id: "defects-control",
      heading: "代表不良は、接合・界面・配線・樹脂・外部端子に現れる",
      lead: "外観だけでは見えない内部不良を、工程内検査と信頼性評価で追います。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表的な不良・変動",
          rightLabel: "主な影響と確認点",
          rows: [
            { left: "ダイ位置ずれ・傾き", right: "ワイヤ・バンプ接続、樹脂厚、熱経路がずれる。画像と高さで確認する" },
            { left: "ボイド・未充填", right: "接合・アンダーフィル・モールド内部へ空隙が残り、熱・応力・保護性能へ影響する" },
            { left: "接合オープン・短絡", right: "ワイヤ、バンプ、外部端子がつながらない、または隣接端子が接触する" },
            { left: "ワイヤ変形・損傷", right: "ループ高さ、接触、樹脂流動などでワイヤが変形・断線する" },
            { left: "剥離・クラック", right: "ダイ、接合材、基板、樹脂の界面が分離し、湿気侵入と亀裂進展につながる" },
            { left: "反り・寸法外れ", right: "後の個片化、端子形成、ソケット接触、回路基板実装へ影響する" },
          ],
        },
      ],
      paragraphs: [
        "管理には外観・寸法検査、X線、超音波、断面観察、電気試験、熱画像、反り測定などを使います。測定方法ごとに見える深さと欠陥が異なるため、工程内の早期検出と詳細解析を分けます。",
        "不良が出た場合は、ダイ、基材、接合材、ワイヤ・バンプ、樹脂、外部端子、装置条件を履歴で追います。前工程のダイ端面損傷やウェーハテスト結果も含め、組立だけの原因と決めつけません。",
      ],
    },
    {
      id: "test-reliability",
      heading: "パッケージング後は、最終検査と信頼性評価で組立影響を確認する",
      lead: "ウェーハ段階で合格したダイも、組立で新しい接合部と応力が加わります。",
      blocks: [
        {
          type: "process-flow",
          title: "組立後の代表的な確認",
          description: "実際の検査順とストレス条件は製品・用途・品質規格で異なります。",
          stages: [
            { label: "01", title: "外観・寸法", body: "欠け、汚れ、印字、端子、平坦度、外形を確認する" },
            { label: "02", title: "電気的な最終検査", body: "機能、DC特性、タイミング、性能ビンをパッケージ状態で確認する" },
            { label: "03", title: "ストレス選別", body: "必要に応じて温度・電圧を加え、初期故障を検出する" },
            { label: "04", title: "信頼性評価", body: "温度サイクル、湿度、実装などの試験で設計・工程を認定する" },
            { label: "05", title: "相関・改善", body: "ウェーハ試験と最終結果を照合し、設計・組立・試験へ返す" },
          ],
        },
      ],
      paragraphs: [
        "Intelは組立後にバーンイン、電気試験、実使用に近い条件での検証を行う例を示しています。量産の最終検査と、設計・工程を認定する信頼性評価は目的とサンプリングが異なります。",
        "ウェーハテストで合格し、最終検査で不合格となった項目は、組立起因の損傷、接続、熱、測定相関を調べる重要な手掛かりです。逆に両工程で同じ不良なら、ダイ側の潜在不良も確認します。",
      ],
    },
    {
      id: "roles",
      heading: "パッケージングには、材料・接合・電気・熱・機械・検査が集まる",
      lead: "ダイと最終製品をつなぐため、多分野を統合する仕事です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "パッケージ設計", right: "構造、端子、配線、電源・信号、熱、応力、実装条件を設計する" },
            { left: "組立プロセス", right: "ダイ接合、ワイヤ・バンプ接続、封止、端子形成、個片化を量産化する" },
            { left: "材料", right: "基板、リードフレーム、接合材、ワイヤ、樹脂、アンダーフィル、熱材料を選定する" },
            { left: "装置・機械", right: "ピック＆プレース、ボンダ、モールド、硬化、搬送、位置・荷重を制御する" },
            { left: "電気・熱・構造解析", right: "信号品質、電源、熱流、反り、界面応力、疲労を予測・評価する" },
            { left: "品質・故障解析", right: "外観、X線、超音波、断面、電気、信頼性データから原因を切り分ける" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "パッケージングが前工程・ウェーハテスト・最終検査とどうつながるか見る" },
            { label: "ダイシングの仕組み", href: "/guides/semiconductor-dicing-process", description: "良品ダイを個片化し、ピックアップする直前工程を見る" },
            { label: "ウェーハテストの仕組み", href: "/guides/semiconductor-wafer-test", description: "組立前に良品ダイと性能ビンを決める工程を見る" },
            { label: "最終検査の仕組み", href: "/guides/semiconductor-final-test", description: "完成パッケージを搬送・温度調整し、電気試験・分類する後続工程を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "画像・寸法・欠陥データを工程へ戻す基本を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、ファウンドリ、OSAT、装置、材料企業の位置を見る" },
            { label: "品質エンジニアへのルート", href: "/guides/quality-engineer-route", description: "製造業の品質経験と半導体品質職の接点を整理する" },
          ],
        },
      ],
      paragraphs: [
        "ASE、Amkor TechnologyなどのOSAT、IntelなどのIDM、TSMCなどのファウンドリが組立・先端パッケージ技術を提供・運用しています。基板、リードフレーム、接合材、封止材、ボンダ、検査装置など多くの企業が供給網を構成します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体のパッケージングでよくある質問",
      lead: "工程名、接続方式、パッケージ形式を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体のパッケージングとは何ですか？", answer: "個片化したダイをリードフレームや基板へ固定し、ワイヤやバンプで電気接続し、樹脂などで保護し、製品の回路基板へ取り付ける外部端子を作る工程です。" },
            { question: "半導体パッケージは何のためにありますか？", answer: "ダイと微細接合部を環境・機械負荷から守り、ダイの小さな電極を外部端子へ引き出し、熱を逃がし、搬送・実装できる形へするためです。" },
            { question: "ワイヤボンドとフリップチップの違いは？", answer: "ワイヤボンドは上向きのダイ電極と基材を細いワイヤで接続します。フリップチップはダイを反転し、面内に配置したバンプで基板へ直接接続します。端子数、速度、電力、コストなどで使い分けます。" },
            { question: "モールドとアンダーフィルの違いは？", answer: "モールドは主にダイやワイヤを含むパッケージ全体を樹脂で覆います。アンダーフィルは主にフリップチップのダイと基板の隙間へ入り、微小接合部の応力を分散します。" },
            { question: "BGAとQFNの違いは？", answer: "BGAはパッケージ底面へはんだボール端子を格子状に配置します。QFNはリードフレームを使い、外周底面のランドで実装するリードの突出がない形式です。" },
            { question: "先端パッケージとは何ですか？", answer: "複数ダイ、チップレット、積層メモリなどを2.5D・3D構造や高密度再配線で統合し、短い接続、高帯域、小型化などを実現するパッケージ技術の総称です。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜ダイを守り、つなぎ、冷やし、製品へ実装できる形にする",
      lead: "パッケージングは、ダイの性能を製品で使える性能へ変える組立工程です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "ATTACH", title: "ダイを固定する", body: "位置、密着、熱、電気、応力を満たす接合層を作る" },
            { label: "CONNECT", title: "電極をつなぐ", body: "ワイヤ、バンプ、基板配線で信号と電源を外部へ引き出す" },
            { label: "PROTECT", title: "封止・補強する", body: "樹脂、アンダーフィル、リッドで環境・応力・熱を管理する" },
            { label: "INTEGRATE", title: "システムを作る", body: "複数ダイと部品を統合し、最終検査と製品実装へ渡す" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、完成したパッケージへ電気信号と温度を与え、機能・性能・初期不良を確認する最終検査を図解します。",
      ],
    },
  ],
  todayQuest: "身近な電子部品を例に、『保護』『電気接続』『放熱』『機械支持』をパッケージのどの部分が担うか考える",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "semiconductor-dicing-process",
    "semiconductor-wafer-test",
    "semiconductor-final-test",
    "semiconductor-inspection-metrology",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["intel", "tsmc"],
};
