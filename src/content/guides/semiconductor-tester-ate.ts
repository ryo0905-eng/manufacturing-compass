import type { GuideArticle } from "@/content/guides/types";

export const semiconductorTesterAteGuide: GuideArticle = {
  slug: "semiconductor-tester-ate",
  title: "半導体テスタとは？ATEの仕組み・主要メーカー・関連装置を初心者向けに図解",
  description:
    "半導体テスタ（ATE）は、ICへ電源や信号を与え、応答を測定して合否を判定する自動試験装置です。基本構成、テストセル、対象デバイス、アドバンテストとTeradyneを含む主要企業、仕事内容を図解します。",
  targetQuery: "半導体 テスタ メーカー",
  searchIntent:
    "半導体テスタとATEの意味、試験の仕組み、プローバ・ハンドラなど周辺装置との違い、主要メーカー、アドバンテストとTeradyneを比較する観点を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Search Consoleに表示された『アドバンテスト テラダイン 比較』を起点に、両社と関連装置メーカーの公式情報を照合しました。市場シェアや企業の優劣ではなく、ATEの役割と企業比較の前提を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "Search Consoleに『アドバンテスト テラダイン 比較』が表示され、半導体テスタ企業を調べる需要を確認",
    "既存のウェーハテスト・最終検査記事とは分け、この記事ではATE本体、対象デバイス、テストセル、メーカー比較へ焦点を設定",
    "アドバンテスト、Teradyne、東京エレクトロン、FormFactorの公式技術・製品情報で役割分担を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "What Is ATE (Automated Test Equipment)? Roles, Systems & Feature Outlook",
      url: "https://www.advantest.com/en/semiconductor-basics/automated-test-equipment/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Automated Test Equipment",
      url: "https://www.advantest.com/en/products/semiconductor-test-system/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Our Technology In-Depth: Semiconductor Test",
      url: "https://www.advantest.com/en/about/business/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Automated Test Equipment",
      url: "https://www.teradyne.com/automated-test-equipment/",
      publisher: "Teradyne, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Test",
      url: "https://www.teradyne.com/semiconductor-testing/",
      publisher: "Teradyne, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Test Cell Solutions: Wafer Testing",
      url: "https://www.teradyne.com/test-cell-solutions/",
      publisher: "Teradyne, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Test Prexa Series: Wafer Prober",
      url: "https://www.tel.com/product/prexa.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
    {
      title: "Probe Cards: Design and Manufacturing",
      url: "https://www.formfactor.com/products/probe-cards/",
      publisher: "FormFactor, Inc.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約14分",
  intro: {
    problem:
      "半導体テスタ、ATE、プローバ、ハンドラという言葉を見ても、どれが測定装置で、どれが製品を運ぶ装置なのか分かりにくくありませんか。",
    conclusion:
      "半導体テスタは、テストプログラムに従ってICへ電源・信号を与え、返ってくる応答を測定・判定するATEの中核です。量産ではプローバやハンドラ、プローブカードやソケット、ソフトウェアと組み合わせたテストセルとして使います。",
    learnings:
      "半導体テスタとATEの意味、試験フロー、テストセルの構成、デバイス別の違い、主要メーカー、アドバンテストとTeradyneを比較する観点、関連する職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "Search Consoleで『アドバンテスト テラダイン 比較』が掲載順位6位まで出ていました。二社の名前だけを比べる前に、テスタ本体と周辺装置の地図が必要だと考え、この基礎記事を作りました。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "図解｜テストプログラムから判定データまで",
      description:
        "製品ごとのテストプログラムと規格を準備し、デバイスを電気接続して、信号印加・測定・判定・記録を自動で繰り返します。",
      stages: [
        { label: "01 / PREPARE", title: "試験内容を準備", body: "測定項目、入力パターン、期待値、規格、ビンをテストプログラムへ定義する" },
        { label: "02 / CONNECT", title: "デバイスへ接続", body: "プローバまたはハンドラが、プローブカードやソケットを介してテスタへつなぐ" },
        { label: "03 / STIMULATE", title: "電源・信号を与える", body: "デジタル、アナログ、RF、電源など必要な刺激をデバイスへ印加する" },
        { label: "04 / MEASURE", title: "応答を測る", body: "出力、電圧、電流、タイミング、周波数などを測定し、期待値と比較する" },
        { label: "05 / JUDGE", title: "分類して記録", body: "合否や性能帯をビンへ分け、個体・ウェーハ・ロットのデータを解析へ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "テストセルの要素",
      rightLabel: "主な役割",
      rows: [
        { left: "テスタ／ATE本体", right: "電源・信号の生成、応答の測定、テストプログラム実行、判定を担う" },
        { left: "プローバ", right: "ウェーハを搬送・保持し、ダイとプローブカードの位置・温度・接触を制御する" },
        { left: "ハンドラ", right: "パッケージを搬送・温度調整し、ソケットへ接触させ、結果別に分類する" },
        { left: "プローブカード／ソケット", right: "テスタ側の信号線を、ウェーハ上の電極またはパッケージ端子へつなぐ" },
        { left: "インターフェース／治具", right: "テスタの多数のチャネルを対象製品へ配線し、電気・機械条件を整える" },
        { left: "ソフトウェア／データ", right: "試験を制御し、測定値、ビン、装置状態を保存・解析する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "半導体テスタとは、ICを自動で電気試験する装置",
      lead: "ATEはAutomated Test Equipmentの略で、自動試験装置を意味します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "APPLY", title: "必要な刺激を与える", body: "電源、デジタルパターン、アナログ波形、RF信号などを製品仕様に合わせて印加します。" },
            { label: "MEASURE", title: "電気応答を測る", body: "電圧、電流、論理値、タイミング、周波数、波形などを必要な精度と速度で測ります。" },
            { label: "DECIDE", title: "規格と比較する", body: "測定値や応答を期待値と比べ、合否、故障項目、性能グレードを記録します。" },
          ],
        },
        {
          type: "note",
          title: "ATEはテスタ単体だけを指すとは限らない",
          body: "会話ではATEとテスタをほぼ同じ意味で使う場合があります。一方、公式解説ではテスタ、プローバまたはハンドラ、インターフェース、制御ソフトウェアを組み合わせた自動試験システムとして説明されることもあります。文脈ごとに範囲を確認します。",
        },
      ],
      paragraphs: [
        "アドバンテストは、ATEを半導体が設計仕様どおり動作するか試験する装置と説明しています。テスタが信号を与えて返ってくる信号を期待データと比較し、周辺装置がデバイスの搬送と接触を担います。",
        "オシロスコープなどの汎用計測器と比べると、量産用ATEは多数の端子・測定機能を同期させ、同じ試験を大量の製品へ高速に繰り返し、結果を個体単位で残す点が特徴です。",
      ],
    },
    {
      id: "test-cell",
      heading: "ウェーハテストと最終検査では、周辺装置が変わる",
      lead: "テスタ本体が同じでも、製品の形と工程に合わせて接触・搬送系を組み替えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "試験段階",
          rightLabel: "テストセルと目的",
          rows: [
            { left: "ウェーハテスト", right: "テスタ＋ウェーハプローバ＋プローブカード。個片化前のダイへ接触し、後工程へ送るダイを選別する" },
            { left: "最終検査", right: "テスタ＋テストハンドラ＋ソケット・ロードボード。パッケージ後の機能・性能を温度条件も含めて判定する" },
            { left: "システムレベル試験", right: "実使用に近い基板・ソフトウェア・動作条件で、ATE試験だけでは捉えにくい相互作用を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ウェーハテストの仕組み", href: "/guides/semiconductor-wafer-test", description: "プローバ・プローブカード・ウェーハマップを詳しく見る" },
            { label: "ウェーハプローバメーカー", href: "/guides/semiconductor-wafer-prober-manufacturers", description: "ウェーハの搬送・位置合わせ・接触を担う装置企業を見る" },
            { label: "プローブカードメーカー", href: "/guides/semiconductor-probe-card-manufacturers", description: "テスタとダイを接続するカード技術・主要企業を見る" },
            { label: "最終検査の仕組み", href: "/guides/semiconductor-final-test", description: "ハンドラ・ソケット・温度試験を詳しく見る" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンのウェーハプローバは、ウェーハ上のデバイスへプローブカードを接触させる自動搬送・位置決め装置です。FormFactorはデバイス端子へ電気接続するプローブカードを提供しています。どちらも測定の中核であるテスタとは異なる役割です。",
        "テストセルでは、テスタ精度だけでなく接触抵抗、信号経路、位置、温度、並列数、搬送時間が結果とコストへ影響します。装置一台ではなく、接続からデータまでを一つの系として設計します。",
      ],
    },
    {
      id: "device-types",
      heading: "対象デバイスにより、ATEへ必要な測定機能が変わる",
      lead: "半導体は種類ごとに入出力、速度、電力、故障の現れ方が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "対象デバイス",
          rightLabel: "代表的なテスト課題",
          rows: [
            { left: "SoC・ロジック・MCU", right: "多数のデジタル端子、高速インターフェース、組込みメモリ、アナログ・RF・電源機能を組み合わせて試験する" },
            { left: "メモリ", right: "膨大なセルへパターンを書込み・読出しし、不良アドレスを記録しながら多数個を並列試験する" },
            { left: "アナログ・ミックスドシグナル", right: "微小な電圧・電流、変換精度、雑音、線形性などを必要な分解能で測定する" },
            { left: "RF・無線", right: "高周波の出力、感度、周波数、変調特性などを信号経路の損失も含めて測る" },
            { left: "パワー半導体", right: "高電圧・大電流の制御と、オフ時の微小な漏れ電流測定を安全に両立する" },
            { left: "イメージセンサー・AI／HPC", right: "画像出力、高速データ、端子数、消費電力、発熱、増大するテストデータへ対応する" },
          ],
        },
      ],
      paragraphs: [
        "アドバンテストはATEをSoC、メモリ、パワー向けに分類し、SoCではロジック、アナログ、RF、DC、イメージャを柔軟なモジュール構成で試験すると案内しています。Teradyneもデジタル・ミックスドシグナル、精密パワー・アナログ、メモリ、システムレベルなどの製品群を展開しています。",
        "したがって『半導体テスタメーカー』を比べるときは、会社名だけでなく、自分が関心を持つデバイスと試験段階に対応する製品群を揃えて見る必要があります。",
      ],
    },
    {
      id: "manufacturers",
      heading: "ATEと関連装置の主なメーカー",
      lead: "一つのテストセルには、異なる専門企業の製品が組み合わされます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業・領域",
          rightLabel: "公式情報から確認できる主な役割",
          rows: [
            { left: "アドバンテスト｜ATE", right: "SoC、メモリ、パワー向けテストシステムに加え、ハンドラ、デバイスインターフェース、ソフトウェア・データソリューションを展開" },
            { left: "Teradyne｜ATE", right: "デジタル・ミックスドシグナル、RF、アナログ・パワー、メモリ、システムレベルなどのテスト製品を展開" },
            { left: "東京エレクトロン｜プローバ", right: "ウェーハを高精度に搬送・位置決めし、プローブカードとの接触を自動化するウェーハプローバを展開" },
            { left: "FormFactor｜プローブカード", right: "ロジック、メモリ、RFなどのウェーハ試験向けに、ダイ端子とテスタをつなぐプローブカードを展開" },
          ],
        },
        {
          type: "note",
          title: "主要メーカーは順位表ではない",
          body: "ここではSearch Consoleで観測した企業と、テストセルの役割を説明しやすい公式情報を持つ企業を代表例として掲載しています。市場シェア、技術力、採用条件の優劣を示す一覧ではありません。",
        },
      ],
      paragraphs: [
        "ATE本体のほかにも、ハンドラ、コンタクタ、ソケット、ロードボード、プローブカード、温度制御、信号インターフェース、解析ソフトウェアを提供する企業があります。企業研究では、自社製品がテストセルのどこへ入り、誰と連携するかを確認します。",
        "製品ポートフォリオは追加・再編されます。特定製品や求人を検討するときは、各社の最新製品ページと採用情報を確認してください。",
      ],
    },
    {
      id: "advantest-teradyne",
      heading: "アドバンテストとTeradyneは、同じ条件を揃えて比較する",
      lead: "両社ともATEを提供しますが、会社全体を一つの順位で比べると製品と仕事の違いを見落とします。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DEVICE", title: "対象デバイス", body: "SoC、ロジック、メモリ、アナログ、RF、パワーなど、比較する製品領域を一つ選びます。" },
            { label: "PLATFORM", title: "プラットフォーム", body: "測定モジュール、チャネル、並列性、拡張性、ソフトウェア、世代間互換の考え方を見ます。" },
            { label: "INSERTION", title: "試験段階", body: "開発評価、ウェーハテスト、最終検査、システムレベル試験のどこを対象にするか揃えます。" },
            { label: "CELL", title: "テストセル", body: "プローバ、ハンドラ、インターフェース、温度制御まで、提供・連携範囲を確認します。" },
            { label: "SUPPORT", title: "顧客支援", body: "テストプログラム開発、アプリケーション支援、量産立上げ、保守、教育の接点を見ます。" },
            { label: "JOB", title: "職種と拠点", body: "同じ会社でも開発、製造、アプリケーション、フィールド、営業技術で担当製品と働き方が変わります。" },
          ],
        },
      ],
      paragraphs: [
        "アドバンテストの公式製品情報ではSoC、メモリ、パワー向けATEが分類され、Teradyneはロジック、RF、アナログ、パワー、ミックスドシグナル、メモリを含む半導体試験を案内しています。共通するカテゴリーはありますが、製品構成と呼び方は同じではありません。",
        "転職先として比較する場合、製品の優劣と働き方を混ぜないことが大切です。最新の求人票で勤務地、担当製品、顧客対応、出張、英語、開発・保守の比重を確認し、自分の経験との接点を整理します。",
      ],
    },
    {
      id: "roles",
      heading: "半導体テスタには、電気・ソフトウェア・機械・データの仕事がある",
      lead: "デバイス仕様を、再現性のある量産試験へ変換するために複数職種が連携します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・技術",
          rightLabel: "主な役割",
          rows: [
            { left: "ハードウェア・電気設計", right: "電源、デジタル、アナログ、RF、計測モジュール、信号経路を設計・評価する" },
            { left: "ソフトウェア・制御", right: "テスタ制御、開発環境、データ処理、装置間通信、診断機能を作る" },
            { left: "テスト・アプリケーション", right: "顧客デバイスの仕様を試験項目、プログラム、治具、相関評価へ落とし込む" },
            { left: "機械・メカトロニクス", right: "ハンドラ、プローバ、接触、搬送、温度、保守性を設計する" },
            { left: "フィールドサービス", right: "顧客工場で据付、校正、点検、障害切分け、部品交換、稼働支援を行う" },
            { left: "製品・データ・品質", right: "テスト結果と装置状態を解析し、歩留まり、試験時間、再現性、品質を改善する" },
          ],
        },
      ],
      paragraphs: [
        "製造業での設備保全、生産技術、品質、制御、データ解析の経験は、テストセルの安定稼働や原因切分けと接点があります。ただし、必要な電気知識、プログラミング、顧客対応、英語は職種ごとに異なります。",
        "求人を見る前に『どのデバイスを、どの試験段階で、どの装置・ソフトウェアを使って支える仕事か』を一文で整理すると、企業名だけに頼らず仕事内容を比較できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体テスタとATEでよくある質問",
      lead: "装置名と工程名の違いを短く整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体テスタとは何ですか？", answer: "ICへ電源や信号を与え、返ってくる電圧、電流、論理値、タイミングなどを測定し、テストプログラムと規格に従って合否や性能を判定する装置です。" },
            { question: "ATEとは何の略ですか？", answer: "Automated Test Equipmentの略で、日本語では自動試験装置です。半導体分野ではテスタ本体を指す場合と、搬送・接触・ソフトウェアを含む試験システムを指す場合があります。" },
            { question: "テスタとプローバの違いは？", answer: "テスタは電気信号を発生・測定・判定します。プローバはウェーハを搬送・保持し、プローブカードとダイの位置、接触、温度を制御します。" },
            { question: "テスタとハンドラの違いは？", answer: "テスタは電気試験を担い、ハンドラはパッケージ製品の搬送、向き、温度、ソケット接触、結果別の分類を担います。" },
            { question: "アドバンテストとTeradyneは何が違いますか？", answer: "両社とも半導体ATEを提供します。違いは会社全体の一言比較ではなく、対象デバイス、製品プラットフォーム、試験段階、周辺装置・ソフトウェア、支援範囲、求人の職種と拠点を揃えて確認します。" },
            { question: "半導体テスタメーカーの仕事には何がありますか？", answer: "電気・ハードウェア設計、ソフトウェア、アプリケーション、機械・制御、フィールドサービス、生産・品質、営業技術などがあります。担当製品と拠点で仕事内容は変わります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜半導体テスタは、信号・測定・判定をテストセルの中でつなぐ",
      lead: "企業比較では、まずATEがどのデバイスと試験段階を担当するかを揃えます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "CORE", title: "テスタが測る", body: "電源と信号を与え、応答を測定して規格と比較する" },
            { label: "CELL", title: "周辺装置がつなぐ", body: "プローバ、ハンドラ、カード、ソケットが搬送・接触を担う" },
            { label: "DEVICE", title: "対象で機能が変わる", body: "SoC、メモリ、アナログ、RF、パワーで試験課題が異なる" },
            { label: "COMPARE", title: "条件を揃えて比べる", body: "製品、試験段階、支援範囲、職種・拠点を同じ軸で確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "テスタを含む装置企業を工程別に見る" },
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "テスタ・プローバ・プローブカードの動作を見る" },
            { label: "最終検査", href: "/guides/semiconductor-final-test", description: "テスタ・ハンドラ・ソケットの動作を見る" },
            { label: "テストハンドラメーカー", href: "/guides/semiconductor-test-handler-manufacturers", description: "搬送方式・温度・並列試験と主要企業を見る" },
            { label: "検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "物理的な欠陥検査と電気試験の違いを見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "ATEが製造フローのどこで使われるか見る" },
            { label: "半導体製造装置の企業一覧", href: "/segments/equipment", description: "装置企業の詳細ページを調べる" },
          ],
        },
      ],
      paragraphs: [
        "半導体テスタは単独で品質を作る装置ではなく、製品仕様、テストプログラム、接触・搬送、温度、判定データをつなぐ量産システムの中核です。この地図を持ってから個別メーカーを見ると、製品と仕事の違いを具体的に比較できます。",
      ],
    },
  ],
  todayQuest: "アドバンテストまたはTeradyneの製品ページを一つ選び、対象デバイス・試験段階・周辺装置・ソフトウェアを4項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-probe-card-manufacturers",
    "semiconductor-wafer-prober-manufacturers",
    "semiconductor-test-handler-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-wafer-test",
    "semiconductor-final-test",
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["advantest", "teradyne", "tokyo-electron"],
};
