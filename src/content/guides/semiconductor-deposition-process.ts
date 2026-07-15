import type { GuideArticle } from "@/content/guides/types";

export const semiconductorDepositionProcessGuide: GuideArticle = {
  slug: "semiconductor-deposition-process",
  title: "半導体の成膜とは？CVD・PVD・ALDの違いと仕組みを初心者向けに図解",
  description:
    "半導体製造の成膜工程を初心者向けに図解。PVDはターゲット材料を物理的に飛ばし、CVDは気体原料を表面で反応させ、ALDは原料供給とパージを交互に繰り返します。膜厚、均一性、段差被覆、膜質、用途の違いも整理します。",
  targetQuery: "半導体 成膜 CVD PVD ALD 違い",
  searchIntent:
    "半導体の成膜工程について、PVD・CVD・ALDがどのように膜を作るのか、何が違い、どのように使い分けるのかを図で理解したい",
  status: "draft",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Applied Materials、ASM、東京エレクトロン、Lam Researchの公式技術情報をもとに、代表的なPVD・CVD・ALDを比較しています。実際の膜特性は材料、装置、前処理、温度、圧力、プラズマなどで変わります。",
  showCareerCtas: false,
  experienceBasis: [
    "Applied Materialsの公式解説で、PVD・CVD・ALDの材料供給と成膜原理を比較",
    "ASMの公式解説で、ALDの交互供給・パージ・自己停止型表面反応とPECVDの基本を確認",
    "東京エレクトロンとLam Researchの公式情報で、絶縁膜・金属膜、高アスペクト比構造などの量産用途を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "マテリアルの創出と成膜",
      url: "https://www.appliedmaterials.com/jp/ja/semiconductor/semiconductor-capabilities/create.html",
      publisher: "アプライド マテリアルズ",
      accessedAt: "2026-07-15",
    },
    {
      title: "Physical Vapor Deposition (PVD)",
      url: "https://www.appliedmaterials.com/jp/ja/semiconductor/semiconductor-technologies/pvd.html",
      publisher: "アプライド マテリアルズ",
      accessedAt: "2026-07-15",
    },
    {
      title: "Atomic Layer Deposition",
      url: "https://www.asm.com/our-technology-products/ald",
      publisher: "ASM",
      accessedAt: "2026-07-15",
    },
    {
      title: "PECVD",
      url: "https://www.asm.com/our-technology-products/pecvd",
      publisher: "ASM",
      accessedAt: "2026-07-15",
    },
    {
      title: "Products and Services: Deposition",
      url: "https://www.tel.com/product/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Deposition",
      url: "https://www.lamresearch.com/products/our-processes/deposition/",
      publisher: "Lam Research",
      accessedAt: "2026-07-15",
    },
    {
      title: "ALTUS Product Family",
      url: "https://www.lamresearch.com/product/altus-product-family/",
      publisher: "Lam Research",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約15分",
  intro: {
    problem: "CVD、PVD、ALDという名前を知っていても、材料がどこから来て、なぜウェーハ上へ膜として残るのか分かりにくくありませんか。",
    conclusion: "PVDは固体材料を物理的に飛ばし、CVDは気体原料を連続的に反応させ、ALDは原料を交互に供給して表面反応を一層ずつ進めます。必要な材料、形状、膜厚、膜質、生産性に応じて使い分けます。",
    learnings: "成膜の目的、PVD・CVD・ALDの原理、段差被覆とアスペクト比、主な膜、管理項目、装置と関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "成膜方式は名前から覚えるより、『材料はどこから来るか』『表面で何が起こるか』『一度に成長するか、周期的に成長するか』で比べると整理しやすくなります。",
      caption: "この記事の見方",
    },
    {
      type: "deposition-comparison",
      title: "図解｜PVD・CVD・ALDは、膜の作り方が違う",
      description:
        "模式図は違いを理解するための概念図です。実際の粒子輸送、表面反応、段差被覆は装置方式と条件によって変わります。",
      methods: [
        {
          kind: "pvd",
          label: "PVD / PHYSICAL",
          title: "固体材料を物理的に飛ばす",
          mechanism: "真空中でターゲットから原子を放出し、ウェーハ表面へ堆積させる",
          characteristic: "金属膜などに広く使用。粒子の飛ぶ方向の影響を受けやすい",
        },
        {
          kind: "cvd",
          label: "CVD / CHEMICAL",
          title: "気体原料を表面で反応させる",
          mechanism: "原料ガスを供給し、熱やプラズマのエネルギーで反応させて固体膜を作る",
          characteristic: "絶縁膜、半導体膜、金属膜など用途が広く、連続的に成長させる",
        },
        {
          kind: "ald",
          label: "ALD / CYCLIC",
          title: "表面反応を周期的に繰り返す",
          mechanism: "複数の原料を交互に供給し、間にパージを入れて一周期ずつ成長させる",
          characteristic: "極薄膜の膜厚制御と複雑な凹凸への均一な被覆に強い",
        },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "成膜は、必要な材料の薄い層をウェーハ上へ作る工程",
      lead: "半導体は、性質の異なる薄膜を積み重ね、不要な部分を加工して作られます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "INSULATOR", title: "絶縁膜", body: "電気を通しにくくし、素子や配線を分離する。酸化物、窒化物などが使われます。" },
            { label: "CONDUCTOR", title: "導体・金属膜", body: "電極、コンタクト、配線、バリア、シードなど、電気を流す構造を作ります。" },
            { label: "SEMICONDUCTOR", title: "半導体・機能膜", body: "トランジスタやメモリなどの機能に必要な半導体膜、結晶膜、機能性材料を作ります。" },
          ],
        },
        {
          type: "note",
          title: "成膜と酸化は、同じ『膜を作る』でも考え方が違う",
          body: "成膜は外部から供給した材料を表面へ堆積・反応させる考え方が中心です。熱酸化はシリコン基板そのものを酸素などと反応させて酸化膜へ変えるため、別の記事で熱処理と合わせて扱います。",
        },
      ],
      paragraphs: [
        "Applied Materialsは、半導体で成膜する材料の例として絶縁体、導体、化合物を挙げ、温度、圧力、電界、磁界、プラズマ、流量、時間などを調整して膜特性を作り込むと説明しています。東京エレクトロンも、素子構造と配線の形成に先立って絶縁膜や金属膜をウェーハ表面へ形成する中核工程と位置づけています。",
        "同じ材料名でも、膜の密度、組成、結晶性、応力、界面、欠陥で電気特性や後工程への耐性が変わります。そのため成膜は、単に表面を覆う作業ではなく、材料特性を設計する工程です。",
      ],
    },
    {
      id: "pvd",
      heading: "PVDは、ターゲット材料を物理的に放出して膜を作る",
      lead: "PVDはPhysical Vapor Deposition、物理気相成長の略です。代表方式としてスパッタリングがあります。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "真空を作る", body: "不要な気体との衝突や汚染を抑え、材料を輸送できる環境へ" },
            { label: "02", title: "ターゲットから原子を出す", body: "アルゴンなどのイオンを材料へ衝突させ、原子を放出" },
            { label: "03", title: "ウェーハへ堆積させる", body: "飛び出した原子を表面へ到達させ、薄膜として成長" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは、PVDをターゲット材料のスパッタリングまたは気化で金属蒸気を作り、ウェーハ表面へ凝縮させるプロセスと説明しています。スパッタでは、プラズマ中のイオンをターゲットへ衝突させ、放出された原子をウェーハへ運びます。",
        "PVDは高純度の金属・金属窒化膜などに使われます。一方、粒子が飛ぶ方向の影響を受けるため、深く細い穴や複雑な三次元構造では、上部と側壁・底部の膜厚差を小さくする工夫が必要です。実際の被覆性は圧力、電力、基板バイアス、装置構造などで変わります。",
      ],
    },
    {
      id: "cvd",
      heading: "CVDは、気体原料の化学反応で固体膜を作る",
      lead: "CVDはChemical Vapor Deposition、化学気相成長の略です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表方式",
          rightLabel: "エネルギーの与え方と特徴",
          rows: [
            { left: "熱CVD", right: "基板や反応空間を加熱し、原料ガスの分解・反応を進める" },
            { left: "LPCVD", right: "低圧環境で反応と輸送を制御するCVD。炉を使うバッチ方式などがある" },
            { left: "PECVD", right: "プラズマで反応を助け、熱だけを使うCVDより低温で成膜できる場合がある" },
          ],
        },
        {
          type: "note",
          title: "CVDは一つの装置方式ではない",
          body: "圧力、温度、プラズマの有無、ウェーハ処理枚数、原料、反応方式によって多くの種類があります。『CVDだから必ず高温』『CVDだから必ず段差被覆が同じ』とは限りません。",
        },
      ],
      paragraphs: [
        "CVDでは、一つ以上の気体原料をチャンバへ入れ、ウェーハ表面で分解または反応させ、固体成分を膜として残します。気体の副生成物は排気されます。絶縁膜、半導体膜、金属膜など幅広い材料へ使われます。",
        "ASMはPECVDについて、反応室内の気体からプラズマを作り、そのエネルギーで反応を進めるため、熱CVDより低温で処理できると説明しています。低い熱予算が必要な配線工程やパッケージ工程などで選択肢になります。",
      ],
    },
    {
      id: "ald",
      heading: "ALDは、原料供給とパージを交互に繰り返す",
      lead: "ALDはAtomic Layer Deposition、原子層成長の略です。表面反応が飽和する性質を使い、周期数で膜厚を制御します。",
      blocks: [
        {
          type: "process-flow",
          title: "ALDの代表的な1サイクル",
          description: "二種類の反応物を使う概念例です。材料系によって反応物、順序、プラズマの有無は異なります。",
          stages: [
            { label: "01", title: "表面を準備", body: "反応できる清浄な表面と反応点を用意" },
            { label: "02", title: "原料Aを供給", body: "表面の反応点へ吸着・反応させる" },
            { label: "03", title: "パージ", body: "余分な原料Aと副生成物を排出" },
            { label: "04", title: "反応物Bを供給", body: "吸着した種と反応させ、目的材料へ" },
            { label: "05", title: "再びパージ", body: "余分な反応物と副生成物を排出" },
            { label: "06", title: "サイクルを反復", body: "必要な膜厚まで同じ周期を繰り返す" },
          ],
        },
      ],
      paragraphs: [
        "ASMはALDを、原料と反応物を交互にパルス供給し、その間を不活性ガスでパージする、表面制御型の層ごとの成膜として説明しています。表面反応が自己停止的に飽和するため、一周期あたりの成長量を小さく保ち、周期数で膜厚を精密に制御できます。",
        "ALDは複雑な凹凸や高アスペクト比構造を均一に覆う用途に向きます。ただし、周期的な供給とパージが必要なため、膜厚、生産性、原料利用、装置構成を含めて適用を判断します。プラズマを使うPEALDでは、反応温度を下げたり材料特性を調整したりできます。",
      ],
    },
    {
      id: "comparison",
      heading: "PVD・CVD・ALDの違いは、優劣ではなく要求との相性",
      lead: "材料、形状、膜厚、温度、生産性、コストの組み合わせで方式を選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較観点",
          rightLabel: "PVD・CVD・ALDの見方",
          rows: [
            { left: "材料の供給源", right: "PVDは主に固体ターゲット、CVDとALDは主に気体として運べる原料を使用" },
            { left: "反応の進み方", right: "PVDは物理的な放出・堆積、CVDは連続的な化学反応、ALDは分離した表面反応の周期" },
            { left: "膜厚制御", right: "PVD・CVDは主に時間や供給量などで制御。ALDは一周期の成長量と周期数で制御" },
            { left: "複雑形状の被覆", right: "一般にALDは高い等方的被覆を得やすい。CVD・PVDも方式と条件で被覆性を調整" },
            { left: "代表材料", right: "PVDは金属・金属窒化物、CVDは絶縁体・半導体・金属、ALDは極薄の絶縁体・金属・バリアなど" },
            { left: "生産性", right: "必要膜厚と装置構成による。ALDは周期処理のため、精度と処理時間の両立が課題になりやすい" },
          ],
        },
        {
          type: "note",
          title: "複数方式を同じ構造へ組み合わせることもある",
          body: "薄い初期膜やバリアをALDで作り、その後をCVDで埋めるなど、目的に応じて方式を組み合わせる場合があります。Lam Researchも金属配線用途でCVDとALDを組み合わせる装置を提供しています。",
        },
      ],
      paragraphs: [
        "方式名だけでは膜の良し悪しを決められません。同じCVDでも熱CVDとPECVDでは温度や膜質が変わり、同じPVDでもイオンエネルギーと圧力で輸送方向が変わります。ALDも熱ALDとPEALD、原料、パージ、温度範囲で結果が変わります。",
        "工程設計では、必要な電気特性と信頼性を満たしたうえで、前後工程との整合、装置の処理能力、材料コスト、メンテナンス、安全性まで考えます。",
      ],
    },
    {
      id: "conformality",
      heading: "段差被覆とアスペクト比は、三次元構造で重要になる",
      lead: "平らな面へ均一に膜を作れても、深い穴や狭い溝を同じ厚さで覆えるとは限りません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "STEP COVERAGE", title: "段差被覆", body: "上面、側壁、底部へどの程度均一な膜厚を作れるかを見る考え方です。" },
            { label: "ASPECT RATIO", title: "アスペクト比", body: "穴や溝の深さを開口幅と比べた形状指標。深く細いほど原料を内部へ届けにくくなります。" },
            { label: "GAP FILL", title: "埋め込み", body: "溝や穴を空隙なく材料で満たせるか。入口が先に閉じると内部へ空洞が残る場合があります。" },
          ],
        },
      ],
      paragraphs: [
        "先端ロジック、3D NAND、立体的なコンタクトや配線では、表面積が大きく、深い構造が増えます。ASMはALDの特徴として、異なる表面形状へ精密な膜厚と高いコンフォーマリティを得られる点を挙げています。",
        "ただし、原料が奥まで届く時間、表面反応、副生成物の排出、開口部での消費なども考える必要があります。『ALDなら自動的にどんな構造でも完全に覆える』とせず、形状と反応条件を合わせて評価します。",
      ],
    },
    {
      id: "control-items",
      heading: "成膜で管理するのは、膜厚だけではない",
      lead: "目的の機能を得るには、膜の量、質、界面、ばらつきを同時に見ます。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "THICKNESS", title: "膜厚・均一性", body: "ウェーハ面内、ウェーハ間、チャンバ間で狙った厚さへ入るか。" },
            { label: "COMPOSITION", title: "組成・不純物", body: "目的元素の比率、残留原料、副生成物、酸素・炭素などの混入を確認。" },
            { label: "FILM QUALITY", title: "密度・結晶性・電気特性", body: "絶縁性、抵抗、誘電率、結晶構造など、用途に必要な性質を評価。" },
            { label: "MECHANICAL", title: "応力・密着性", body: "膜が反る、割れる、はがれるなどを避け、前後材料との整合を取る。" },
            { label: "TOPOGRAPHY", title: "段差被覆・埋め込み", body: "側壁や底部の膜厚、開口の閉塞、内部空洞の有無を確認。" },
            { label: "DEFECT", title: "粒子・欠陥・界面", body: "粒子、ピンホール、表面粗さ、界面汚染など、信頼性へ影響する要因を管理。" },
          ],
        },
      ],
      paragraphs: [
        "膜厚は分かりやすい指標ですが、同じ厚さでも組成、密度、応力、界面が違えば機能は変わります。装置データと膜厚測定、光学測定、電気測定、欠陥検査、断面観察などを組み合わせて評価します。",
        "成膜前の表面状態も重要です。微量の残留物や自然酸化膜が核形成、密着、接触抵抗へ影響するため、洗浄や前処理を成膜条件と一体で考えます。",
      ],
    },
    {
      id: "equipment-roles",
      heading: "成膜工程には、材料・反応・真空・プラズマ・計測の技術が集まる",
      lead: "装置の中では、原料を安全かつ再現よく供給し、表面反応を制御し、副生成物を排出します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス", right: "材料、温度、圧力、流量、時間、プラズマ条件を調整し、膜特性を作る" },
            { left: "装置・機械", right: "チャンバ、搬送、加熱、冷却、真空、保守性、生産性を設計・維持する" },
            { left: "電気・プラズマ", right: "電源、電界、磁界、プラズマ生成と均一性を制御する" },
            { left: "材料・化学", right: "原料、反応経路、表面化学、副生成物、膜組成を設計・解析する" },
            { left: "計測・解析", right: "膜厚、組成、結晶性、応力、電気特性、欠陥を測り、工程へ返す" },
            { left: "設備・安全", right: "特殊ガス、排気、除害、薬液、ユーティリティを安全に供給・管理する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "成膜がリソグラフィやエッチングとどうつながるか確認する" },
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "成膜した材料へ加工場所を決める次の工程を断面図で見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、装置、材料、計測を担う企業の位置を見る" },
            { label: "装置エンジニアへのルート", href: "/guides/equipment-engineer-route", description: "設備経験と半導体製造装置職の接点を整理する" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materials、東京エレクトロン、Lam Research、ASMなどが成膜装置・プロセスを提供しています。デバイスメーカー側では、成膜単体だけでなく、洗浄、リソグラフィ、エッチング、熱処理、CMPとのつながりを見ながら工程を統合します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の成膜でよくある質問",
      lead: "PVD・CVD・ALDを比較するときの基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の成膜とは何ですか？", answer: "ウェーハ表面へ絶縁体、導体、半導体などの薄い材料層を作る工程です。素子、電極、配線、保護膜などの構造と機能を作るために繰り返し使います。" },
            { question: "PVDとCVDの違いは？", answer: "PVDは固体ターゲットなどから材料を物理的に放出して堆積させます。CVDは気体原料を表面で化学反応させ、固体膜を作ります。材料、形状、膜質などの要求で使い分けます。" },
            { question: "CVDとALDの違いは？", answer: "CVDは一般に原料を供給しながら連続的に反応・成長させます。ALDは複数の原料を時間的に分け、供給とパージを交互に繰り返して一周期ずつ成長させます。" },
            { question: "ALDは一回で原子一層を必ず作りますか？", answer: "原子層成長と呼ばれますが、実際の一周期あたり成長量は材料と表面反応によって異なり、完全な一原子層とは限りません。自己停止型の表面反応と周期数で精密に制御することが要点です。" },
            { question: "PECVDは何ですか？", answer: "プラズマ支援化学気相成長です。プラズマのエネルギーで化学反応を助け、熱だけを使うCVDより低温で成膜できる場合があります。" },
            { question: "成膜は一度だけ行いますか？", answer: "いいえ。半導体では異なる材料と機能を持つ層を多数作るため、成膜、リソグラフィ、エッチング、洗浄、検査などを目的に応じて何度も繰り返します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜供給源・反応・形状から成膜方式を選ぶ",
      lead: "PVD、CVD、ALDは、必要な膜を作るための異なる道具です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PVD", title: "物理的に飛ばす", body: "固体ターゲットなどから材料を放出し、ウェーハへ堆積" },
            { label: "CVD", title: "連続的に反応させる", body: "気体原料を熱やプラズマで反応させ、固体膜へ" },
            { label: "ALD", title: "周期的に表面反応させる", body: "原料供給とパージを交互に行い、膜厚と被覆を精密制御" },
          ],
        },
      ],
      paragraphs: [
        "次のエッチング記事では、成膜した層のうち不要な部分をどのように選択して取り除くかを、等方性・異方性、選択比、プラズマの役割から図解します。",
      ],
    },
  ],
  todayQuest: "PVD・CVD・ALDを『材料の供給源』『反応の進み方』『複雑形状の被覆』の3軸で説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "photolithography-process",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["applied-materials", "tokyo-electron", "lam-research"],
};
