import type { GuideArticle } from "@/content/guides/types";

export const analogSemiconductorCompaniesGuide: GuideArticle = {
  slug: "analog-semiconductor-companies",
  title: "アナログ半導体とは？デジタルとの違い・用途・主要企業を初心者向けに図解",
  description:
    "アナログ半導体とは、電圧や電流など連続的な信号を扱う半導体です。デジタル・ミックスドシグナルとの違い、アンプ・ADC・電源ICなどの種類、用途、代表企業8社の見方を初心者向けに図解します。",
  targetQuery: "アナログ 半導体 企業",
  searchIntent:
    "アナログ半導体の意味とデジタル半導体との違い、代表的な製品・用途、国内外の主要企業と各社の得意領域を初心者向けに理解したい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "公的資料と各社の公式製品情報を照合しました。企業は売上順位ではなく、公式に確認できる製品領域と用途で整理しています。",
  showCareerCtas: false,
  experienceBasis: [
    "企業は売上順位ではなく、公式に確認できる製品領域と用途で整理",
    "経済産業省の半導体・デジタル産業戦略資料で、アナログ半導体の定義、製品例、用途を確認",
    "TI、Analog Devices、ルネサス、Infineon、ST、NXP、onsemi、ロームの公式情報で製品領域を照合",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-19",
  sources: [
    {
      title: "半導体・デジタル産業戦略について",
      url: "https://www.chugoku.meti.go.jp/seisaku/tiiki/handoutaikanrensangyou/3kaigou/3kaigou_1.pdf",
      publisher: "経済産業省",
      accessedAt: "2026-07-16",
    },
    {
      title: "Mixed-signal",
      url: "https://www.analog.com/en/resources/glossary/mixed-signal.html",
      publisher: "Analog Devices",
      accessedAt: "2026-07-16",
    },
    {
      title: "About TI",
      url: "https://www.ti.com/about-ti.html",
      publisher: "Texas Instruments",
      accessedAt: "2026-07-16",
    },
    {
      title: "About Us",
      url: "https://www.analog.com/en/who-we-are.html",
      publisher: "Analog Devices",
      accessedAt: "2026-07-16",
    },
    {
      title: "Analog Semiconductors",
      url: "https://www.renesas.com/en/products/analog-semiconductors",
      publisher: "Renesas Electronics",
      accessedAt: "2026-07-16",
    },
    {
      title: "Our divisions",
      url: "https://www.infineon.com/about/company/our-divisions",
      publisher: "Infineon Technologies",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products and Applications",
      url: "https://www.st.com/content/st_com/en/browse/product-portfolio.html",
      publisher: "STMicroelectronics",
      accessedAt: "2026-07-16",
    },
    {
      title: "Analog and Mixed Signal",
      url: "https://www.nxp.com/products/analog-and-mixed-signal%3AANALOG-AND-MIXED-SIGNAL",
      publisher: "NXP Semiconductors",
      accessedAt: "2026-07-16",
    },
    {
      title: "Analog and Mixed-Signal Group",
      url: "https://www.onsemi.com/company/newsroom/news-and-insights/onsemi-aligns-business-groups-to-expand-product-portfolio-and-accelerate-growth",
      publisher: "onsemi",
      accessedAt: "2026-07-16",
    },
    {
      title: "Analog Technology",
      url: "https://www.rohm.com/analogpower/analogtech",
      publisher: "ROHM",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約14分",
  intro: {
    problem:
      "『アナログ半導体企業』と聞いても、何がアナログで、ロジック半導体やパワー半導体とどう違うのか分かりにくくありませんか。",
    conclusion:
      "アナログ半導体は、温度・音・圧力・光など現実世界の変化を電圧や電流として受け取り、増幅・変換・制御する半導体です。企業を見るときは、アナログという一語でまとめず、信号処理・電源・センサー・車載などの製品領域を確認します。",
    learnings:
      "アナログ半導体の意味、デジタル・ミックスドシグナルとの違い、信号の流れ、代表製品、用途、国内外8社の特徴、企業研究と関連職種の見方。",
  },
  overviewBlocks: [
    {
      type: "process-flow",
      title: "現実世界の変化が、デジタル処理と動作へつながるまで",
      description:
        "アナログ半導体はセンサー入力から電源・出力まで、デジタル回路と現実世界の間をつなぎます。実際の構成は製品によって異なります。",
      stages: [
        { label: "01 / PHYSICAL", title: "温度・音・圧力が変化", body: "連続的に変わる現実世界の物理量" },
        { label: "02 / SENSE", title: "電気信号へ変える", body: "センサーが変化を電圧や電流として取り出す" },
        { label: "03 / CONDITION", title: "増幅・整形する", body: "アンプやフィルターが測りやすい信号へ整える" },
        { label: "04 / CONVERT", title: "デジタルへ変換する", body: "ADCが連続信号を数値データへ変える" },
        { label: "05 / ACT", title: "制御して動かす", body: "演算結果をDAC、ドライバー、電源ICなどが実際の動作へ戻す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "信号・回路の分類",
      rightLabel: "基本的な役割",
      rows: [
        { left: "アナログ", right: "連続的に変わる電圧・電流を、増幅、比較、変換、電源制御などで扱う" },
        { left: "デジタル", right: "0と1など離散的な値を使い、演算、論理判断、記憶、制御を行う" },
        { left: "ミックスドシグナル", right: "アナログ回路とデジタル回路を一つのIC内で組み合わせる" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "アナログ半導体とは、連続的な信号を扱う半導体",
      lead: "現実世界の情報は、最初から0と1になっているわけではありません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "INPUT", title: "現実を受け取る", body: "温度、光、音、圧力、速度、電流などを電気信号として受け取ります。" },
            { label: "PROCESS", title: "信号を整える", body: "小さな信号を増幅し、不要な成分を除き、測定や変換に適した状態へ整えます。" },
            { label: "OUTPUT", title: "電力と動作を制御する", body: "必要な電圧を供給し、モーター、光、音、通信などの出力を制御します。" },
          ],
        },
        {
          type: "note",
          title: "『アナログ＝古い技術』ではない",
          body: "AIやデジタル処理が高度になっても、現実世界から正確なデータを取り込み、機器へ電力を供給し、結果を動作へ戻す接点は必要です。アナログとデジタルは置き換え関係ではなく、電子システム内で組み合わされます。",
        },
      ],
      paragraphs: [
        "経済産業省の資料は、アナログ半導体を低電圧から高電圧までの電気信号を連続的に処理する半導体とし、電源IC、AD/DAコンバータ、アンプ、センサーなどを例示しています。マイコンやメモリへの入出力、ディスクリート半導体の制御などを担います。",
        "ロームの公式解説も、音、温度、圧力など連続的に変わる物理量を扱い、増幅、フィルタリング、変調などを行うICとして説明しています。何をアナログ半導体へ含めるかは企業の製品分類によって少し異なるため、個別製品の機能まで確認します。",
      ],
    },
    {
      id: "analog-digital-difference",
      heading: "アナログ・デジタル・ミックスドシグナルの違い",
      lead: "違いは、扱う値が連続的か離散的か、そして一つのIC内でどう組み合わせるかです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "分類と例",
          rightLabel: "特徴と確認ポイント",
          rows: [
            { left: "アナログ｜オペアンプ、電源IC", right: "電圧や電流の大きさと時間変化を扱う。精度、雑音、速度、消費電力、耐圧などが重要" },
            { left: "デジタル｜CPU、メモリ、ロジック", right: "有限の値やビットを使って演算・記憶する。処理性能、容量、消費電力などが重要" },
            { left: "ミックスドシグナル｜ADC、DAC、AFE", right: "アナログとデジタルの両方を含み、現実世界と演算処理の境界をつなぐ" },
          ],
        },
      ],
      paragraphs: [
        "Analog Devicesは、アナログ信号を連続的に変化する信号、デジタル信号を有限個の値を取る離散的な信号として説明しています。ADCはアナログ信号をデジタル値へ、DACはデジタル値をアナログ出力へ変えるため、代表的なミックスドシグナルICです。",
        "実際の製品では境界が重なります。マイコン内にADCや電源管理回路が入る場合も、センサーIC内に信号処理回路が入る場合もあります。会社や製品を分類するときは、名称だけで完全に分けられるものではないと理解しておくと混乱しにくくなります。",
      ],
    },
    {
      id: "product-types",
      heading: "アナログ半導体の主な種類",
      lead: "企業の強みを見るには、製品を信号経路と電源経路に分けると理解しやすくなります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "AMPLIFY", title: "アンプ・コンパレータ", body: "小さな信号を増幅し、二つの電圧を比較する。センサー、計測、音響などで使う。" },
            { label: "CONVERT", title: "ADC・DAC・AFE", body: "アナログとデジタルを相互変換し、センサー入力を演算できるデータへつなぐ。" },
            { label: "POWER", title: "電源管理IC", body: "電圧変換、安定化、充電、電源監視、各回路への電力分配を担う。" },
            { label: "INTERFACE", title: "インターフェース・ドライバー", body: "通信信号を送受信し、モーター、LED、パワーデバイスなどを駆動する。" },
            { label: "SENSE", title: "センサー・信号調整", body: "温度、圧力、位置、光などを検出し、後段が扱える信号へ整える。" },
            { label: "RF", title: "RF・高周波", body: "無線信号の増幅、変換、送受信を担う。通信規格や周波数帯で要件が変わる。" },
          ],
        },
      ],
      paragraphs: [
        "ルネサスは公式製品ページで、アンプ、データコンバータ、センサー信号調整、インターフェース、スイッチなどを信号経路として整理しています。TIとAnalog Devicesも信号処理だけでなく、電源管理、組み込み処理、センサー、RFなど幅広い製品を展開しています。",
        "『アナログ半導体企業』でも全製品を同じ比率で持つわけではありません。高精度計測、電源、車載、産業、通信、民生など、対象市場と求められる特性によって製品構成が変わります。",
      ],
    },
    {
      id: "applications",
      heading: "自動車・産業機器・スマートフォンなど幅広い用途で使われる",
      lead: "電気を使い、現実世界と接する機器の多くにアナログ半導体があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "用途",
          rightLabel: "アナログ半導体の役割例",
          rows: [
            { left: "自動車", right: "電源管理、電流・温度・位置検出、モーター・LED駆動、車内外通信" },
            { left: "産業機器・ロボット", right: "センサー信号の取得、絶縁、精密計測、モーター制御、電源変換" },
            { left: "通信・スマートフォン", right: "RF信号の送受信、音声処理、充電、表示・カメラ周辺の電源制御" },
            { left: "データセンター", right: "電源変換・分配、監視、冷却制御、高速インターフェース" },
            { left: "医療・計測", right: "微小信号の増幅、高精度変換、センサー読み出し、低雑音電源" },
          ],
        },
      ],
      paragraphs: [
        "経済産業省は産業機器、自動車、家庭用機器、無線機器、カメラなどを用途例に挙げています。ST、Infineon、NXP、onsemiの公式情報でも、車載、産業、電源、センサー、通信などの領域を確認できます。",
        "同じ用途でも必要な特性は異なります。企業や製品を調べるときは、精度、雑音、速度、耐圧、消費電力、温度範囲、信頼性、供給期間など、対象機器が何を重視するかまで見る必要があります。",
      ],
    },
    {
      id: "companies",
      heading: "アナログ半導体の代表企業8社",
      lead: "ここではランキングではなく、公式情報から確認できる主な製品領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "Texas Instruments｜米国", right: "アナログICと組み込みプロセッサ。信号経路、電源、車載・産業など幅広い製品" },
            { left: "Analog Devices｜米国", right: "アナログ・ミックスドシグナル、データコンバータ、電源、RF、センサー" },
            { left: "Renesas Electronics｜日本", right: "アンプ、データコンバータ、センサー信号調整、インターフェース、電源周辺" },
            { left: "Infineon Technologies｜ドイツ", right: "車載、電源、センサー、RF、IoT。アナログとパワー・マイコンを組み合わせた展開" },
            { left: "STMicroelectronics｜欧州", right: "アナログ、産業・電力変換、車載、センサー、マイコンを含む幅広い製品" },
            { left: "NXP Semiconductors｜欧州", right: "車載・産業向けのアナログ／ミックスドシグナル、インターフェース、電源、AFE" },
            { left: "onsemi｜米国", right: "電源管理、センサーインターフェース、通信、インテリジェントパワーとセンシング" },
            { left: "ROHM｜日本", right: "電源IC、オペアンプ、ドライバーなどのアナログICとパワー半導体" },
          ],
        },
        {
          type: "note",
          title: "『主要企業』は固定の順位ではない",
          body: "アナログ半導体の範囲や売上区分は調査会社・企業ごとに異なります。この記事の8社は網羅的な順位表ではなく、サイト内に企業ページがあり、公式情報で複数のアナログ製品領域を確認できる代表例です。",
        },
      ],
      paragraphs: [
        "TIとAnalog Devicesはアナログ製品を事業の中心に掲げています。ルネサス、Infineon、ST、NXPはマイコンや車載製品などとアナログを組み合わせ、onsemiとロームは電源・センシング・パワー半導体との接続にも特徴があります。",
        "ただし、企業の製品構成や事業区分は買収・組織変更・新製品で変わります。応募、取引、投資などの判断に使う場合は、各社の最新製品ページ、IR、求人情報を確認してください。",
      ],
    },
    {
      id: "company-research",
      heading: "アナログ半導体企業を比較する5つの視点",
      lead: "会社名や売上だけでなく、どの課題をどの製品で解いているかを見ます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PRODUCT", title: "製品領域", body: "信号処理、データ変換、電源、センサー、RF、ドライバーのどこが中心か。" },
            { label: "MARKET", title: "顧客用途", body: "車載、産業、通信、民生、医療、データセンターのどこを支えるか。" },
            { label: "PERFORMANCE", title: "重視特性", body: "精度、雑音、速度、耐圧、消費電力、温度、信頼性の何で差別化するか。" },
            { label: "MODEL", title: "事業・製造モデル", body: "IDMかファブレスか、自社製造と外部委託をどう使い分けるか。" },
            { label: "SUPPORT", title: "設計支援", body: "評価ボード、シミュレーション、リファレンス設計、FAEなどをどう提供するか。" },
          ],
        },
      ],
      paragraphs: [
        "アナログ製品は、回路単体の性能だけでなく、センサーやマイコン、パワーデバイスを含むシステム全体で選ばれます。そのため企業研究でも、製品カタログに加えて、対象用途、設計ツール、技術資料、顧客支援を見ると違いが分かりやすくなります。",
        "製造面では、必ずしも最小のプロセス世代が最適とは限りません。扱う電圧、精度、素子構造、コスト、供給期間などに合わせてプロセスを選ぶため、先端ロジックと同じ物差しだけで比較しないことが大切です。",
      ],
    },
    {
      id: "roles",
      heading: "アナログ半導体企業に関わる主な職種",
      lead: "回路設計だけでなく、製品化・量産・顧客回路への組み込みまで多くの職種が関わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・機能",
          rightLabel: "主な役割",
          rows: [
            { left: "アナログ回路設計", right: "アンプ、電源、変換器、インターフェースなどを設計し、性能とばらつきを検証する" },
            { left: "アプリケーション・FAE", right: "顧客回路と要求を理解し、製品選定、評価、設計課題の解決を支援する" },
            { left: "プロダクト・テスト", right: "製品仕様、評価方法、量産テスト、コスト、歩留まりを設計と製造の間で成立させる" },
            { left: "プロセス・デバイス", right: "電圧、精度、雑音、信頼性などに合う素子構造と製造プロセスを開発する" },
            { left: "品質・信頼性", right: "車載・産業などの要求に合わせ、変更管理、解析、認定、顧客品質を担う" },
            { left: "営業・マーケティング", right: "用途ごとの課題を捉え、製品企画、販売戦略、顧客との技術的な接点を作る" },
          ],
        },
      ],
      paragraphs: [
        "求人を見るときは『アナログ経験』だけで判断せず、製品が信号経路・電源・センサー・RFのどれか、回路設計か顧客技術支援か、開発か量産かを確認します。同じ職種名でも必要な回路知識、測定器、シミュレーション、顧客業界の経験が異なります。",
        "電子部品、回路評価、計測、品質、顧客技術対応、車載・産業機器などの経験は接点を整理しやすい領域です。今すぐは専門差がある場合も、対象製品の信号経路を学び、測定・不良解析・顧客要求の経験を言語化すると準備を進められます。",
      ],
    },
    {
      id: "summary",
      heading: "アナログ半導体は、現実世界とデジタル処理をつなぐ",
      lead: "最後に、初心者が押さえたい要点を整理します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DEFINITION", title: "連続信号を扱う", body: "電圧や電流を増幅・変換・制御し、現実世界の情報と動作を電子回路へつなぐ。" },
            { label: "PRODUCT", title: "製品群は幅広い", body: "アンプ、ADC・DAC、電源IC、インターフェース、センサー、RFなどを含む。" },
            { label: "COMPANY", title: "得意領域で比較する", body: "企業名だけでなく、製品、用途、重視特性、製造、設計支援を見る。" },
          ],
        },
        {
          type: "faq",
          items: [
            { question: "アナログ半導体とは簡単に言うと何ですか？", answer: "温度、音、圧力などの変化を電圧や電流として受け取り、増幅、変換、電源制御などを行う半導体です。現実世界とデジタル処理をつなぐ役割があります。" },
            { question: "アナログ半導体とデジタル半導体の違いは？", answer: "アナログ半導体は連続的に変化する信号を扱い、デジタル半導体は0と1など離散的な値で演算・記憶します。実際の電子機器では両方が組み合わされます。" },
            { question: "ミックスドシグナル半導体とは？", answer: "アナログ回路とデジタル回路を一つのIC内に持つ半導体です。アナログ信号をデジタル値へ変えるADCや、逆変換するDACが代表例です。" },
            { question: "アナログ半導体の主な製品は？", answer: "オペアンプ、コンパレータ、ADC・DAC、電源管理IC、インターフェース、ドライバー、センサー信号調整、RF ICなどがあります。企業によって分類範囲は異なります。" },
            { question: "日本のアナログ半導体企業は？", answer: "この記事では、サイト内に企業ページがある代表例としてルネサス エレクトロニクスとロームを掲載しています。このほかにもアナログ製品を扱う日本企業があり、網羅的なランキングではありません。" },
            { question: "アナログ半導体は微細化が重要ではないのですか？", answer: "製品によっては集積度向上が重要ですが、耐圧、精度、雑音、素子特性、コストなどとの両立が必要です。最小寸法だけで製品や企業の優劣は決まりません。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "IDM・アナログ・パワー企業一覧", href: "/segments/idm", description: "アナログ製品を扱う国内外企業の詳細ページを見る" },
            { label: "Texas Instruments", href: "/companies/texas-instruments", description: "アナログ・組み込み半導体の企業情報を見る" },
            { label: "Analog Devices", href: "/companies/analog-devices", description: "アナログ・ミックスドシグナルの企業情報を見る" },
            { label: "Renesas Electronics", href: "/companies/renesas", description: "日本の組み込み・アナログ半導体企業を見る" },
            { label: "ROHM", href: "/companies/rohm", description: "日本のアナログ・パワー半導体企業を見る" },
            { label: "半導体企業の時価総額ランキング", href: "/guides/semiconductor-market-cap-ranking", description: "事業モデルと企業規模を別の視点から確認する" },
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "設計から前工程・後工程までの流れを見る" },
            { label: "Career Compass", href: "/career-compass", description: "自分の経験に近い半導体職種と準備を整理する" },
          ],
        },
      ],
      paragraphs: [
        "アナログ半導体を理解すると、同じIDMでも企業ごとに製品と顧客用途が違うことが見えてきます。気になる企業を一社選び、公式サイトの製品分類を信号入力、変換、電源、出力のどこへ置けるか確認してみてください。",
      ],
    },
  ],
  todayQuest: "気になるアナログ半導体企業を1社選び、主力製品を信号処理・データ変換・電源・センサー・RFのどこに置けるか確認する",
  relatedGuideSlugs: [
    "semiconductor-foundry",
    "semiconductor-manufacturing-process",
    "semiconductor-final-test",
    "semiconductor-market-cap-ranking",
  ],
  relatedCompanyIds: [
    "texas-instruments",
    "analog-devices",
    "renesas",
    "rohm",
    "infineon",
    "stmicroelectronics",
    "nxp",
    "onsemi",
  ],
};
