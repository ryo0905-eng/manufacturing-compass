import type { GuideArticle } from "@/content/guides/types";

export const semiconductorManufacturingProcessGuide: GuideArticle = {
  slug: "semiconductor-manufacturing-process",
  title: "半導体の製造工程とは？設計から前工程・後工程まで初心者向けに図解",
  description:
    "半導体が設計、シリコンウェーハ、成膜、フォトリソグラフィ、エッチング、検査、ダイシング、パッケージングを経て完成する流れを図解。前工程・後工程とFEOL・MOL・BEOLの違いも初心者向けに整理します。",
  targetQuery: "半導体 製造工程",
  searchIntent:
    "半導体が設計から完成品になるまでの全体像、前工程と後工程の違い、成膜・フォトリソグラフィ・エッチングなど各工程の役割を初心者向けに理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "運営者の勤務先固有の情報は使わず、企業・研究機関が公開する一般的な製造工程をもとに構成しています。製品やメーカーによる違いは、単一の標準フローとして断定しません。",
  showCareerCtas: false,
  experienceBasis: [
    "SUMCO、ASML、東京エレクトロン、Intelなど、各工程を担う企業の公式解説を優先して確認",
    "imecの公開解説をもとに、FEOL・MOL・BEOLをトランジスタ、コンタクト、配線の役割で整理",
    "ロジック、メモリ、パワー半導体などで工程や順序が異なるため、共通する全体像へ単純化",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Production Processes",
      url: "https://www.sumcosi.com/english/products/process/",
      publisher: "SUMCO",
      accessedAt: "2026-07-15",
    },
    {
      title: "How microchips are made",
      url: "https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made",
      publisher: "ASML",
      accessedAt: "2026-07-15",
    },
    {
      title: "Lithography principles",
      url: "https://www.asml.com/en/technology/lithography-principles",
      publisher: "ASML",
      accessedAt: "2026-07-15",
    },
    {
      title: "Products and Services: Semiconductor production process",
      url: "https://www.tel.com/product/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "A view on the logic technology roadmap",
      url: "https://www.imec-int.com/en/articles/view-logic-technology-roadmap",
      publisher: "imec",
      accessedAt: "2026-07-15",
    },
    {
      title: "Metrology and Inspection",
      url: "https://www.appliedmaterials.com/in/en/semiconductor/semiconductor-technologies/metrology-and-inspection.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-15",
    },
    {
      title: "How Silicon Die Become Chip Packages",
      url: "https://newsroom.intel.com/tech101/how-silicon-die-become-chip-packages",
      publisher: "Intel",
      accessedAt: "2026-07-15",
    },
    {
      title: "Introduction to Fabrication",
      url: "https://www.micron.com/content/dam/micron/educatorhub/fabrication/micron-intro-to-fabrication-presentation.pdf",
      publisher: "Micron Technology",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約16分",
  intro: {
    problem: "成膜、露光、エッチングなどの言葉を個別に知っていても、半導体がどの順番で完成するのか分かりにくくありませんか。",
    conclusion: "全体は設計、ウェーハ準備、ウェーハ加工、ウェーハテスト、組立、最終検査に分けられます。ウェーハ加工では、薄膜を作り、パターンを描き、形や性質を変える工程を何度も繰り返します。",
    learnings: "製造工程の全体像、各工程の役割、前工程・後工程とFEOL・MOL・BEOLの違い、工程に関わる職種と企業。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "半導体の工程を個別に覚える前に、まず全体の地図が欲しい。自分自身が仕事で見返せるように、工程同士のつながりから整理しました。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "半導体が完成するまでの全体フロー",
      description:
        "下図は一般的な集積回路を理解するための概略です。実際の工程数、順序、材料、検査位置は製品と製造方法によって異なります。",
      stages: [
        { label: "01 / DESIGN", title: "回路設計・マスク", body: "必要な機能を回路へ落とし込み、各層のパターンを準備" },
        { label: "02 / WAFER", title: "ウェーハ製造", body: "単結晶を育成し、薄く切り、平坦で清浄な基板へ加工" },
        { label: "03 / FAB", title: "ウェーハ加工", body: "トランジスタと配線を層ごとに形成" },
        { label: "04 / PROBE", title: "ウェーハテスト", body: "切り分ける前に各チップの電気特性を確認" },
        { label: "05 / ASSEMBLY", title: "切断・組立", body: "チップへ分割し、基板や端子と接続して保護" },
        { label: "06 / FINAL TEST", title: "最終検査・出荷", body: "機能、性能、信頼性を確認して製品へ" },
      ],
      cycle: {
        title: "ウェーハ加工の中心は、一度きりではなく反復",
        items: ["洗浄", "成膜・熱処理", "レジスト塗布", "露光・現像", "エッチング・イオン注入", "除去・平坦化", "検査・計測"],
        note: "各層ですべての工程を必ず使うわけではありません。目的に応じて工程を選び、順序を組み替えながら、素子と多層配線を作ります。",
      },
    },
  ],
  sections: [
    {
      id: "big-picture",
      heading: "半導体の製造工程は、大きく6段階で考える",
      lead: "最初に、設計から出荷までを一つの流れとして見ます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DESIGN", title: "1. 回路設計・マスク", body: "どのような機能を、どの素子と配線で実現するかを設計します。製造では層ごとのパターンを持つマスクまたはレチクルを使います。" },
            { label: "MATERIAL", title: "2. ウェーハ製造", body: "高純度シリコンから単結晶インゴットを作り、スライス、研磨、洗浄、検査を経て基板にします。" },
            { label: "WAFER FAB", title: "3. ウェーハ加工", body: "ウェーハ上へトランジスタ、コンタクト、多層配線を作ります。工程は数百以上に及ぶ場合があります。" },
            { label: "WAFER TEST", title: "4. ウェーハテスト", body: "ウェーハ上のチップへ電気的に接触し、機能や特性を確認して後工程へ送る対象を選別します。" },
            { label: "ASSEMBLY", title: "5. 切断・パッケージ", body: "ウェーハを個々のダイへ分け、基板や端子へ接続し、外力や熱、汚染から保護できる形にします。" },
            { label: "TEST", title: "6. 最終検査・出荷", body: "組立後の機能と性能を確認します。製品によっては温度や電圧を加えた信頼性確認も行います。" },
          ],
        },
      ],
      paragraphs: [
        "半導体製造という言葉は、ウェーハ加工だけを指す場合も、設計や組立・検査を含む産業全体を指す場合もあります。本記事では全体を見渡すため、設計から最終検査までを対象にします。",
        "ただし、設計会社が自社工場を持たず製造を委託する場合や、組立・テストを専門企業へ委託する場合もあります。一つの会社の中で全工程が完結するとは限りません。",
      ],
    },
    {
      id: "wafer",
      heading: "シリコンウェーハは、回路を作るための土台",
      lead: "ウェーハは、円柱状の単結晶インゴットを薄く切り、表面を精密に仕上げた円盤です。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "単結晶を育てる", body: "高純度の多結晶シリコンを溶かし、種結晶から原子配列のそろったインゴットを育成" },
            { label: "02", title: "薄く切って形を整える", body: "インゴットをスライスし、厚さ、平行度、外周形状を調整" },
            { label: "03", title: "磨き、洗い、検査する", body: "表面を鏡面に近い状態へ仕上げ、洗浄後に粒子や平坦度などを確認" },
          ],
        },
      ],
      paragraphs: [
        "SUMCOの公式解説では、CZ法で作った単結晶インゴットを、スライス、ラッピング、エッチング、研磨、洗浄・検査の工程でポリッシュドウェーハへ仕上げています。用途によって、さらにエピタキシャル成長や熱処理などを加えたウェーハも使われます。",
        "ここでのウェーハ製造と、次に説明するウェーハ上の回路形成は別の製造段階です。同じ『エッチング』『研磨』『洗浄』という言葉が登場しても、対象と目的は異なります。",
      ],
    },
    {
      id: "repeated-cycle",
      heading: "前工程の本質は、薄膜・パターン・加工の繰り返し",
      lead: "ウェーハ加工は、材料を載せ、必要な場所を決め、その場所だけを加工する反復として捉えると理解しやすくなります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程",
          rightLabel: "何をしているか",
          rows: [
            { left: "洗浄", right: "粒子、有機物、金属汚染、前工程の残りなどを取り除き、次の処理に適した表面へ整える" },
            { left: "酸化・熱処理", right: "酸化膜を形成したり、材料の状態や注入した不純物の働きを熱で調整したりする" },
            { left: "成膜", right: "絶縁体、導体、半導体などの薄膜をCVD、PVD、ALDなどの方法で形成する" },
            { left: "フォトリソグラフィ", right: "感光材を塗り、光でマスクのパターンを転写し、現像して加工する場所を決める" },
            { left: "エッチング", right: "レジストなどで守られていない部分を選択的に除去し、薄膜へ形を移す" },
            { left: "イオン注入・拡散", right: "不純物を導入して、シリコンの電気的な性質を場所ごとに変える" },
            { left: "CMP・平坦化", right: "表面の凹凸を抑え、次の層を精度よく重ねられる状態へ戻す" },
            { left: "検査・計測", right: "寸法、膜厚、位置合わせ、欠陥、電気特性などを確認し、工程条件へフィードバックする" },
          ],
        },
        {
          type: "note",
          title: "『成膜→露光→エッチング』だけではない",
          body: "分かりやすい代表順序ですが、実際には洗浄、下地処理、加熱、レジスト除去、検査などが間に入り、イオン注入やCMPを使わない層もあります。製品ごとの工程表は、目的から逆算して組まれます。",
        },
      ],
      paragraphs: [
        "ASMLは、薄膜形成からレジスト除去までの流れを必要な回数だけ繰り返し、層の上へ層を重ねて集積回路を作ると説明しています。東京エレクトロンも、微細化に伴って反復するパターニング工程の重要性が高まると説明しています。",
        "初心者は工程名を順番として暗記するより、『材料を作る』『場所を決める』『形や性質を変える』『結果を測る』の四つへ置き換えると、工程同士の関係を追いやすくなります。",
      ],
    },
    {
      id: "line-terms",
      heading: "前工程・後工程とFEOL・MOL・BEOLは、分け方が違う",
      lead: "BEOLの日本語訳を、そのまま組立の『後工程』と考えると混乱します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "区分",
          rightLabel: "この記事での意味",
          rows: [
            { left: "前工程（ウェーハ工程）", right: "ウェーハ上へ素子と配線を形成する製造段階。FEOL、MOL、BEOLを含む広い呼び方として使われることが多い" },
            { left: "FEOL", right: "トランジスタなど、チップの能動素子を形成する領域" },
            { left: "MOL", right: "トランジスタの端子と上層のローカル配線をつなぐコンタクト領域" },
            { left: "BEOL", right: "素子同士へ信号や電源を届ける、多層の配線と絶縁膜を形成する領域" },
            { left: "後工程（組立・テスト）", right: "ウェーハテスト、切断、接続、封止、最終検査など、チップを扱える製品形態へ仕上げる段階" },
          ],
        },
        {
          type: "note",
          title: "境界は資料ごとに確認する",
          body: "MOLを独立して使わない資料、ウェーハテストを前工程側または後工程側に置く資料、先端パッケージ工程を異なる位置に置く資料があります。工程名だけでなく、その資料が何を範囲に含めているかを確認してください。",
        },
      ],
      paragraphs: [
        "imecは先端ロジックの製造を、トランジスタを作るFEOL、トランジスタと配線をつなぐMOL、上部の配線を作るBEOLに分けています。この三つは、主にウェーハ内部の構造をどこまで作っているかという区分です。",
        "一方、日本語でよく使う前工程と後工程は、ウェーハ加工と組立・テストという製造段階の区分です。文脈によって定義が揺れるため、本記事では初出時に範囲を示しています。",
      ],
    },
    {
      id: "inspection",
      heading: "検査・計測と洗浄は、工程の途中に何度も入る",
      lead: "検査は最後だけ、洗浄は最初だけに行う工程ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "METROLOGY", title: "狙った値になったか測る", body: "寸法、膜厚、形状、位置合わせなどを測り、工程が目標どおりか確認します。" },
            { label: "INSPECTION", title: "欠陥を見つける", body: "粒子、パターン異常、表面欠陥など、完成品の性能へ影響する可能性がある異常を検出します。" },
            { label: "FEEDBACK", title: "結果を工程へ戻す", body: "測定・検査データを装置条件や工程管理へ返し、変動を抑えながら量産を安定させます。" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは、計測で物理・電気特性が目標を満たすか確認し、ウェーハ検査で粒子やパターン異常などを見つけると説明しています。東京エレクトロンは、洗浄を工程間で行う重要な処理として位置づけています。",
        "完成後に良否を分けるだけでは、どの工程で変化したか分かりません。そのため量産では、工程途中の測定、欠陥検査、装置データ、電気特性を組み合わせて状態を追います。",
      ],
    },
    {
      id: "assembly-test",
      heading: "後工程では、ダイを接続・保護し、製品として検査する",
      lead: "ウェーハ上で回路が完成しても、そのままでは電子機器へ実装できません。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "ウェーハテスト", body: "切断前に各ダイの機能や特性を確認し、後工程で扱う対象を識別" },
            { label: "02", title: "ダイシング", body: "ウェーハを個々のチップであるダイへ分割" },
            { label: "03", title: "接続・パッケージ", body: "ダイを基板などへ固定し、電気接続、放熱、機械的保護を持たせる" },
            { label: "04", title: "最終検査", body: "組立後の機能、性能、信頼性を確認し、出荷可能な製品へ" },
          ],
        },
      ],
      paragraphs: [
        "Intelは、パッケージがダイを熱や外部環境から守り、機械的な強度とコンピューターへの接続を提供すると説明しています。組立後には電気検査に加え、製品によって高温や高電圧を使う試験、実使用を想定した確認も行われます。",
        "近年の先端パッケージでは、複数のダイを一つのパッケージ内で組み合わせる構造もあります。そのため、後工程は単なる保護作業ではなく、性能、消費電力、放熱、歩留まりを左右する設計・製造領域です。",
      ],
    },
    {
      id: "product-differences",
      heading: "ロジック、メモリ、パワー半導体で工程は変わる",
      lead: "この記事の図は共通理解の入口であり、すべての半導体に同じ工程表を当てはめるものではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "LOGIC", title: "ロジック", body: "微細なトランジスタと多層配線を高密度に作り、演算や制御を行います。世代や設計ルールで構造が変わります。" },
            { label: "MEMORY", title: "メモリ", body: "DRAMやNANDなどで記憶素子の構造が異なります。3D NANDのように縦方向の構造が重要な製品もあります。" },
            { label: "POWER / ANALOG", title: "パワー・アナログ", body: "高耐圧、低損失、精度などを重視し、最先端ロジックとは異なる材料、寸法、熱処理、構造を使う場合があります。" },
            { label: "PACKAGE", title: "パッケージ", body: "ワイヤ接続、フリップチップ、ウェーハレベル、2.5D・3Dなど、求める性能とコストで組立方法が変わります。" },
          ],
        },
      ],
      paragraphs: [
        "同じ製品分類でもメーカーや世代で工程は異なり、具体的な材料、条件、装置構成は重要な製造ノウハウです。公開資料で全体像を学ぶときは、共通原理と個別レシピを分けて考えます。",
        "今後の個別記事では、各工程の目的と代表方式を説明しつつ、『どの製品にも同じ方式を使う』という書き方を避けます。",
      ],
    },
    {
      id: "jobs-companies",
      heading: "製造工程が分かると、職種と企業の違いも見えやすい",
      lead: "半導体業界では、デバイスメーカーだけでなく、材料、装置、検査、組立を担う企業が工程を分担しています。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・機能",
          rightLabel: "主に関わる職種の例",
          rows: [
            { left: "設計", right: "回路設計、レイアウト、検証、EDA、設計支援" },
            { left: "ウェーハ・材料", right: "結晶、材料開発、品質、生産技術、プロセス開発" },
            { left: "ウェーハ加工", right: "プロセス、デバイス、インテグレーション、設備、製造、歩留まり" },
            { left: "装置", right: "装置開発、プロセスサポート、フィールドサービス、アプリケーション" },
            { left: "検査・計測", right: "プロセスコントロール、欠陥解析、解析技術、品質、データ分析" },
            { left: "パッケージ・テスト", right: "実装、接続、放熱、テスト開発、製品技術、信頼性" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体業界地図", href: "/industry-map", description: "設計、材料、製造装置、デバイス、後工程のつながりを見る" },
            { label: "半導体企業一覧", href: "/companies", description: "各社の主力領域と業界内での役割から企業を調べる" },
            { label: "プロセスエンジニアへのルート", href: "/guides/production-engineering-to-semiconductor-process-engineer", description: "生産技術の経験とウェーハ加工の仕事の接点を整理する" },
            { label: "装置エンジニアへのルート", href: "/guides/equipment-engineer-route", description: "設備保全や装置経験を半導体装置職へつなげる" },
          ],
        },
      ],
      paragraphs: [
        "職種名が同じでも、デバイスメーカー、装置メーカー、材料メーカー、組立・テスト企業では、扱う対象と顧客が変わります。求人を見るときは、会社名だけでなく、どの工程の、何を改善する仕事かを確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の製造工程でよくある質問",
      lead: "全体像を学ぶときに混同しやすい点を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の製造工程は全部でいくつありますか？", answer: "数え方と製品によって異なります。大分類では設計、ウェーハ製造、ウェーハ加工、ウェーハテスト、組立、最終検査と整理できますが、ウェーハ加工だけでも多数の処理と検査を繰り返します。固定の工程数として覚えるより、対象範囲を確認することが大切です。" },
            { question: "半導体の前工程とは何ですか？", answer: "一般には、シリコンウェーハ上へトランジスタと配線を作るウェーハ加工を指します。資料によってウェーハ準備やウェーハテストを含む範囲が異なるため、定義を確認してください。" },
            { question: "BEOLと半導体の後工程は同じですか？", answer: "通常は同じではありません。BEOLはウェーハ上へ多層配線を形成する領域です。日本語の後工程は、一般にウェーハテスト、切断、パッケージング、最終検査などの組立・テスト工程を指します。" },
            { question: "フォトリソグラフィは何をする工程ですか？", answer: "感光材を塗ったウェーハへ光でパターンを転写し、現像して、次のエッチングやイオン注入で加工する場所を決める工程です。" },
            { question: "なぜ同じような工程を何度も繰り返すのですか？", answer: "集積回路は、異なる材料とパターンを層ごとに重ねて作るためです。トランジスタ、コンタクト、多層配線で必要な構造が違うので、成膜、リソグラフィ、エッチング、洗浄、検査などを目的に応じて繰り返します。" },
            { question: "検査は完成後だけに行いますか？", answer: "いいえ。寸法、膜厚、位置合わせ、欠陥などを工程途中で測り、条件へフィードバックします。ウェーハ完成後とパッケージ完成後にも電気的な検査を行います。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜工程名より先に、何を変える工程かを見る",
      lead: "半導体製造は、設計した回路をウェーハ上へ層ごとに作り、検査しながら製品へ仕上げる流れです。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "MAP", title: "全体を6段階で見る", body: "設計、ウェーハ、加工、ウェーハテスト、組立、最終検査" },
            { label: "CYCLE", title: "前工程は反復で考える", body: "材料を作る、場所を決める、加工する、測るを層ごとに繰り返す" },
            { label: "TERMS", title: "区分の範囲を確認する", body: "BEOLと組立の後工程を混同せず、資料ごとの定義を見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "レジスト塗布、露光、現像で加工場所を決める流れを断面図で見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "PVD・CVD・ALDが薄膜を作る原理と使い分けを図で見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "ウェット・ドライ、等方性・異方性、選択比を断面図で見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "汚染除去、純水リンス、乾燥までの表面変化を図で見る" },
            { label: "イオン注入・拡散の仕組み", href: "/guides/semiconductor-ion-implantation-process", description: "ドーピング、注入量・深さ、活性化アニールを図で見る" },
            { label: "CMP・平坦化の仕組み", href: "/guides/semiconductor-cmp-process", description: "化学作用と機械作用で表面の高さをそろえる流れを見る" },
            { label: "配線形成の仕組み", href: "/guides/semiconductor-interconnect-process", description: "絶縁膜に溝・ビアを作り、導体を埋めて多層配線を形成する流れを見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・CD・膜厚・重ね合わせを工程へ戻す流れを見る" },
            { label: "ウェーハテストの仕組み", href: "/guides/semiconductor-wafer-test", description: "テスタ・プローバ・プローブカードでダイを電気試験する流れを見る" },
            { label: "ダイシングの仕組み", href: "/guides/semiconductor-dicing-process", description: "ブレード・レーザー・テープでウェーハを個片化する流れを見る" },
            { label: "パッケージングの仕組み", href: "/guides/semiconductor-packaging-process", description: "ダイ接合、電気接続、封止、外部端子形成の流れを見る" },
            { label: "最終検査の仕組み", href: "/guides/semiconductor-final-test", description: "ハンドラ、ソケット、テスタで完成品を試験・分類する流れを見る" },
          ],
        },
      ],
      paragraphs: [
        "次はフォトリソグラフィ、成膜、エッチングなどを個別に取り上げ、ウェーハ断面がどのように変化するかを図で追います。個別記事を読むときも、今回の全体フローへ戻れば、前後工程との関係を確認できます。",
      ],
    },
  ],
  todayQuest: "身近な半導体製品を一つ選び、設計・ウェーハ加工・組立のどこで価値が作られているか考える",
  relatedGuideSlugs: [
    "photolithography-process",
    "semiconductor-deposition-process",
    "semiconductor-etching-process",
    "semiconductor-cleaning-process",
    "semiconductor-ion-implantation-process",
    "semiconductor-cmp-process",
    "semiconductor-interconnect-process",
    "semiconductor-inspection-metrology",
    "semiconductor-wafer-test",
    "semiconductor-dicing-process",
    "semiconductor-packaging-process",
    "semiconductor-final-test",
    "semiconductor-career-start",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["sumco", "tokyo-electron", "applied-materials", "asml", "intel"],
};
