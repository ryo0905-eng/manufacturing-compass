import type { GuideArticle } from "@/content/guides/types";

export const semiconductorFoundryGuide: GuideArticle = {
  slug: "semiconductor-foundry",
  title: "ファウンドリとは？ファブレス・IDM・OSATとの違いを初心者向けに図解",
  description:
    "ファウンドリとは、顧客が設計した半導体を受託製造する企業です。ファブレス・IDM・OSATとの違い、設計データから試作・量産までの流れ、代表企業、関連職種を初心者向けに図解します。",
  targetQuery: "ファウンドリ とは",
  searchIntent:
    "半導体業界のファウンドリが何をする会社か、ファブレス・IDM・OSATとの違い、代表企業、設計から量産までの分業を初心者向けに理解したい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "検索クエリから確認できた疑問を起点に、公的機関と企業の公式資料で分業構造を照合しました。企業の優劣や市場順位ではなく、事業モデルと仕事の違いを説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "Search Consoleに『foundry 意味』という検索クエリが表示され、初心者向けの独立した説明が必要だと判断",
    "経済産業省の半導体人材育成資料で、ファブレス・ファウンドリ・IDM・OSATの水平分業を確認",
    "TSMC、Samsung Foundry、UMC、Intel Foundry、ASEの公式情報で、設計支援・製造・後工程の境界を照合",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "中部地域 半導体人材育成プログラム 2024年7月版",
      url: "https://www.chubu.meti.go.jp/c31seizo/semicon/20240913/semiconductor_program.pdf",
      publisher: "経済産業省 中部経済産業局",
      accessedAt: "2026-07-16",
    },
    {
      title: "Foundry",
      url: "https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-foundry/",
      publisher: "Samsung Semiconductor",
      accessedAt: "2026-07-16",
    },
    {
      title: "Dedicated IC Foundry",
      url: "https://www.tsmc.com/english/dedicatedFoundry",
      publisher: "TSMC",
      accessedAt: "2026-07-16",
    },
    {
      title: "Mask Services",
      url: "https://www.tsmc.com/english/dedicatedFoundry/services/mask_services",
      publisher: "TSMC",
      accessedAt: "2026-07-16",
    },
    {
      title: "Foundry - Business Areas",
      url: "https://semiconductor.samsung.com/about-us/business-area/foundry/",
      publisher: "Samsung Semiconductor",
      accessedAt: "2026-07-16",
    },
    {
      title: "Overview",
      url: "https://www.umc.com/en/About/about_overview",
      publisher: "UMC",
      accessedAt: "2026-07-16",
    },
    {
      title: "Get the Facts About Intel Foundry",
      url: "https://www.intel.com/content/www/us/en/foundry/library/fact-sheet.html",
      publisher: "Intel",
      accessedAt: "2026-07-16",
    },
    {
      title: "About ASE",
      url: "https://ase.aseglobal.com/about-ase/",
      publisher: "ASE",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約13分",
  intro: {
    problem: "TSMCを調べて『ファウンドリ』という言葉を見ても、設計会社や半導体メーカーと何が違うのか分かりにくくありませんか。",
    conclusion: "ファウンドリは、顧客の半導体設計を製造可能な形へつなぎ、主にウェーハ上へ回路を量産する受託製造企業です。ファブレスは設計、OSATは組立・テスト、IDMは設計と製造を一体で担う点が基本的な違いです。",
    learnings: "ファウンドリの意味、ファブレス・IDM・OSATとの違い、設計から量産までの流れ、企業の分類、関連職種と企業研究の見方。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "Search Consoleに『foundry 意味』という検索語が出てきました。業界地図だけでは分業の仕組みが伝わりにくいと考え、設計から量産までの受け渡しを一つの記事に整理しました。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "ファブレスの設計が、ファウンドリで半導体になるまで",
      description:
        "水平分業を理解するための概略です。契約範囲、設計支援、マスク、試作、後工程の担当は企業や製品によって異なります。",
      stages: [
        { label: "01 / DESIGN", title: "製品・回路を設計", body: "ファブレスなどが仕様、回路、レイアウトを設計" },
        { label: "02 / ENABLE", title: "製造条件へ合わせる", body: "PDK、設計ルール、IP、EDA環境を使って製造可能性を確認" },
        { label: "03 / MASK", title: "データ準備・試作", body: "設計データを確認し、マスク準備や試作で成立性を評価" },
        { label: "04 / WAFER FAB", title: "ウェーハへ量産", body: "成膜、露光、エッチングなどを繰り返して回路を形成" },
        { label: "05 / TEST", title: "試験・組立へ送る", body: "ウェーハテスト後、必要に応じてOSATなどが組立・最終検査" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "企業分類",
      rightLabel: "主な役割",
      rows: [
        { left: "ファブレス", right: "製品企画と半導体設計へ集中し、量産をファウンドリなどへ委託" },
        { left: "ファウンドリ", right: "顧客の設計を製造プロセスへつなぎ、主にウェーハ工程を受託" },
        { left: "IDM", right: "自社製品の企画・設計・製造を一体で保有。外部委託や受託製造を併用する場合もある" },
        { left: "OSAT", right: "主に組立、パッケージング、ウェーハテスト、最終検査などの後工程を受託" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "ファウンドリとは、半導体の受託製造を担う企業",
      lead: "英語のfoundryは鋳造所を意味しますが、半導体業界では顧客の設計を工場で製造する事業を指します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "INPUT", title: "顧客の設計", body: "回路・レイアウトなどの設計情報を、契約と設計ルールに沿って受け取ります。" },
            { label: "CORE", title: "製造技術と量産", body: "製造プロセス、工場、装置、品質管理を組み合わせ、ウェーハ上へ回路を作ります。" },
            { label: "OUTPUT", title: "加工済みウェーハ", body: "試験・組立へ送れる状態へ仕上げます。後工程まで一体で提供するサービスもあります。" },
          ],
        },
        {
          type: "note",
          title: "『工場を貸す会社』だけではない",
          body: "顧客が自由な設計データを渡せば、そのまま製造できるわけではありません。製造プロセスに合う設計ルール、PDK、検証環境、マスク準備、試作、量産立ち上げなど、設計と工場を接続する仕組みもファウンドリの重要な役割です。",
        },
      ],
      paragraphs: [
        "Samsung Semiconductorの用語解説は、ファウンドリを外部顧客の製品設計を受け取り、半導体を製造する企業として説明しています。TSMCは、自社ブランドの半導体製品を設計・販売せず、顧客製品の製造へ集中する専業モデルを掲げています。",
        "ただし、現実の企業分類は完全な四分割ではありません。IDMが外部顧客向けのファウンドリ事業を持つ場合も、ファブレスやIDMが製造の一部だけを委託する場合もあります。企業名だけで決めつけず、対象となる事業部門と委託範囲を確認します。",
      ],
    },
    {
      id: "why-foundry",
      heading: "なぜファウンドリとファブレスへ分業するのか",
      lead: "半導体設計と量産工場では、必要な設備・技術・投資の性格が大きく異なります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DESIGN", title: "設計へ集中できる", body: "ファブレスは製品企画、回路、アーキテクチャ、ソフトウェア、顧客用途へ資源を配分できます。" },
            { label: "MANUFACTURING", title: "工場を共同利用できる", body: "ファウンドリは複数顧客の製品を製造し、工場、装置、プロセス技術を継続的に運用します。" },
            { label: "ECOSYSTEM", title: "共通基盤でつながる", body: "EDA、IP、設計ルール、マスク、材料、装置、後工程企業が一つの製造基盤へ参加します。" },
          ],
        },
      ],
      paragraphs: [
        "経済産業省の半導体人材育成資料は、設計から販売までを行う垂直統合型と、ファブレス・ファウンドリ・OSATなどが工程を分担する水平分業型を示しています。分業により、設計企業は自社工場を持たずに製品を開発でき、製造企業は幅広い顧客へ量産基盤を提供できます。",
        "一方で、設計と製造が無関係になるわけではありません。トランジスタや配線の作り方によって、性能、消費電力、面積、信頼性、コストが変わります。そのため、設計側とファウンドリ側は設計初期から製造条件を共有します。",
      ],
    },
    {
      id: "design-to-production",
      heading: "設計データから試作・量産までの流れ",
      lead: "ファウンドリとの仕事は、完成した回路図を最後に渡すだけではありません。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "プロセスと設計環境を選ぶ", body: "用途、性能、消費電力、電圧、数量などを踏まえ、プロセス技術と設計条件を選択" },
            { label: "02", title: "PDK・IPを使って設計する", body: "デバイスモデル、設計ルール、検証データ、標準セルなどを使い、製造可能なレイアウトへ変換" },
            { label: "03", title: "設計検証とデータ準備", body: "設計ルール、電気特性、配線、製造ばらつきなどを検証し、マスク作成へ必要なデータを準備" },
            { label: "04", title: "試作して評価する", body: "試作ウェーハで機能・性能・歩留まりを確認し、必要に応じて設計や条件を修正" },
            { label: "05", title: "量産・試験・出荷へ移る", body: "生産条件と検査基準を整え、ウェーハ量産から組立・最終検査へ接続" },
          ],
        },
      ],
      paragraphs: [
        "PDK（Process Design Kit）は、特定の製造プロセスで回路を設計・検証するための情報群です。デバイスの電気モデル、設計ルール、検証用データなどを含みます。IPは、インターフェースやメモリなど再利用できる設計資産です。EDAは設計・検証に使うソフトウェア群を指します。",
        "TSMCはマスクサービスを設計者と工場の接点として説明し、Samsung FoundryとIntel Foundryもプロセス、IP、EDA、設計支援、製造、パッケージなどを組み合わせたサービスを案内しています。提供範囲は企業と契約で異なるため、すべてのファウンドリが同じ一貫サービスを持つとは限りません。",
      ],
    },
    {
      id: "business-models",
      heading: "ファウンドリ・ファブレス・IDM・OSATの違い",
      lead: "違いは『半導体を扱うか』ではなく、バリューチェーンのどこを主に担当するかです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "分類と企業例",
          rightLabel: "主な仕事と設備",
          rows: [
            { left: "ファブレス｜NVIDIA、AMDなど", right: "製品企画、回路・アーキテクチャ設計、ソフトウェア、顧客技術。大規模な自社量産工場を事業の中心にしない" },
            { left: "専業ファウンドリ｜TSMC、UMCなど", right: "プロセス開発、製造、設備、歩留まり、品質、設計支援。顧客製品の受託製造へ集中" },
            { left: "IDM｜Samsung Electronics、Intelなど", right: "自社製品の企画・設計・製造を保有。企業によっては外部顧客向けファウンドリ事業も展開" },
            { left: "OSAT｜ASEなど", right: "パッケージ設計、組立、ウェーハテスト、最終検査。前工程後のダイを製品形態へ仕上げる" },
          ],
        },
        {
          type: "note",
          title: "ファウンドリとfabは同じ言葉ではない",
          body: "fabはfabrication facilityの略として使われる製造工場です。ファウンドリは顧客から製造を受託する事業モデルを指します。IDMもfabを持つため、fabがある会社すべてをファウンドリとは呼びません。",
        },
      ],
      paragraphs: [
        "TSMCやUMCは顧客の製造へ集中する専業ファウンドリとして説明できます。一方、Samsung ElectronicsとIntelは自社製品を持つIDMでありながら、外部顧客向けのファウンドリサービスも提供しています。会社全体の分類と、特定事業の分類を分けて理解します。",
      ],
    },
    {
      id: "company-research",
      heading: "ファウンドリ企業は、微細化の数字だけで比較しない",
      lead: "小さいプロセス世代だけを見ても、企業の役割や得意領域は十分に分かりません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "TECHNOLOGY", title: "対象プロセスと用途", body: "先端ロジック、成熟ロジック、RF、高電圧、組み込みメモリなど、得意な技術と用途を見る。" },
            { label: "ECOSYSTEM", title: "設計支援の範囲", body: "PDK、IP、EDA、設計サービス、試作、マスク、パッケージ連携の範囲を見る。" },
            { label: "MANUFACTURING", title: "量産・品質の条件", body: "製造拠点、対応ウェーハ、品質規格、供給継続性、量産立ち上げの支援を見る。" },
          ],
        },
      ],
      paragraphs: [
        "UMCは公式情報でロジックや複数の特殊プロセスを案内し、Samsung Foundryは先端プロセスに加えてRF、高電圧、組み込み不揮発性メモリなどの技術を示しています。用途によって必要な電圧、温度、寿命、コスト、生産期間が異なるため、最小寸法だけで優劣は決まりません。",
        "企業研究では『何nmか』だけでなく、どの製品市場を支え、設計から量産まで何を提供し、どこに製造拠点があるかを確認します。数字やサービス内容は更新されるため、応募や取引の判断時には各社の最新公式情報を確認してください。",
      ],
    },
    {
      id: "roles",
      heading: "ファウンドリで働く主な職種",
      lead: "工場を持つため製造系職種が多い一方、顧客設計と量産をつなぐ仕事も重要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・機能",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス開発・プロセス統合", right: "個別工程と工程全体を設計し、性能・歩留まり・信頼性を成立させる" },
            { left: "設備・製造技術", right: "製造装置の稼働、保全、条件管理、自動化、生産能力を支える" },
            { left: "歩留まり・欠陥解析", right: "検査・計測・電気試験データから不良原因を絞り、工程へ対策を戻す" },
            { left: "PDK・設計技術・DFM", right: "プロセス情報を設計ルールやモデルへ変換し、顧客設計を製造へ接続する" },
            { left: "品質・信頼性", right: "量産品質、変更管理、顧客要求、信頼性評価を管理する" },
            { left: "生産管理・サプライチェーン", right: "材料、能力、仕掛かり、納期、後工程との接続を調整する" },
          ],
        },
      ],
      paragraphs: [
        "同じファウンドリでも、研究開発拠点、量産工場、設計支援部門、営業・顧客技術部門では仕事内容が異なります。求人を見るときは会社名だけでなく、対象プロセス、製品用途、拠点、量産か開発か、顧客との接点を確認します。",
        "製造業での工程改善、設備保全、品質、不良解析、生産管理、データ活用は接点を整理しやすい経験です。ただし、半導体固有のプロセス、クリーンルーム、材料、装置、設計環境など、職種ごとに追加で必要な経験があります。",
      ],
    },
    {
      id: "summary",
      heading: "ファウンドリは、設計を量産へ変える製造パートナー",
      lead: "最後に、初心者が押さえたい要点を整理します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DEFINITION", title: "顧客製品を受託製造", body: "主にウェーハ工程を担い、設計データを実際の半導体へ変える。" },
            { label: "DIFFERENCE", title: "担当工程で分類", body: "ファブレスは設計、IDMは設計と製造、OSATは主に組立・テストを担う。" },
            { label: "RESEARCH", title: "技術とサービスを見る", body: "微細化だけでなく、用途、設計環境、量産、品質、後工程との接続を確認する。" },
          ],
        },
        {
          type: "faq",
          items: [
            { question: "ファウンドリとは簡単に言うと何ですか？", answer: "顧客が設計した半導体を、製造プロセスと工場を使って受託製造する企業です。設計ルールやPDK、試作、量産立ち上げなど、設計と工場をつなぐ支援も行います。" },
            { question: "ファウンドリとファブレスの違いは？", answer: "ファブレスは主に製品企画と半導体設計を担当し、ファウンドリはその設計を製造します。両者は単純な競合ではなく、設計と製造を分担する取引関係になる場合があります。" },
            { question: "ファウンドリとIDMの違いは？", answer: "IDMは自社製品の企画・設計・製造を一体で持つ企業です。専業ファウンドリは顧客製品の製造へ集中します。ただし、IDMが外部顧客向けファウンドリ事業を持つ場合もあります。" },
            { question: "ファウンドリとOSATの違いは？", answer: "ファウンドリは主にウェーハ上へ回路を作る前工程を担い、OSATは主にダイの組立、パッケージング、テストなどの後工程を受託します。サービス範囲が重なる場合もあります。" },
            { question: "TSMCはなぜファウンドリと呼ばれますか？", answer: "TSMCは自社ブランドの半導体製品を設計・販売するのではなく、顧客が設計した製品の製造へ集中する専業ファウンドリの事業モデルを掲げているためです。" },
            { question: "fabとファウンドリは同じですか？", answer: "同じではありません。fabは半導体を製造する工場を指し、ファウンドリは顧客から製造を受託する事業モデルを指します。IDMも自社のfabを持つ場合があります。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ファウンドリの企業一覧", href: "/segments/foundry", description: "TSMC、Samsung Electronics、Intel、GlobalFoundriesなどの企業を見る" },
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "設計、ウェーハ加工、テスト、組立の流れを見る" },
            { label: "パッケージングの仕組み", href: "/guides/semiconductor-packaging-process", description: "ファウンドリ後の組立・接続・封止工程を見る" },
            { label: "半導体企業の時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "ファブレス、ファウンドリ、IDM、装置企業を分類して見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "設計、製造、装置、材料、後工程のつながりを見る" },
            { label: "Career Compass", href: "/career-compass", description: "製造業経験に近い半導体職種と次の準備を整理する" },
          ],
        },
      ],
      paragraphs: [
        "ファウンドリを理解すると、NVIDIAとTSMCのように同じ半導体業界でも役割が異なる企業を区別できます。企業研究では、製品名や知名度だけでなく、設計・前工程・後工程のどこへ価値を提供しているかを確認してください。",
      ],
    },
  ],
  todayQuest: "気になる半導体企業を1社選び、ファブレス・ファウンドリ・IDM・OSATのどれに近いか書き出す",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "semiconductor-packaging-process",
    "semiconductor-market-cap-ranking",
  ],
  relatedCompanyIds: ["tsmc", "samsung-electronics", "intel", "globalfoundries", "nvidia", "amd"],
};
