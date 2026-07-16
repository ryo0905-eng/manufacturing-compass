import type { GuideArticle } from "@/content/guides/types";

export const icChipManufacturingCompaniesGuide: GuideArticle = {
  slug: "ic-chip-manufacturing-companies",
  title: "ICチップ製造会社とは？メーカーの種類と国内外の主要企業を初心者向けに図解",
  description:
    "ICチップ製造会社を、ファブレス・ファウンドリ・IDM・メモリ・OSATに分けて解説します。実際にウェーハを製造する企業、設計を担う企業、日本と海外の代表企業、会社選びの見方を初心者向けに図解します。",
  targetQuery: "icチップ 製造 会社",
  searchIntent:
    "ICチップを製造する会社にはどのような種類があり、実際に工場で製造する国内外の主要企業と、設計・後工程・装置企業の違いを初心者向けに知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Search Consoleに表示された『icチップ 製造 会社』を起点に、公的資料と企業公式情報で設計・ウェーハ製造・組立テストの分業を照合しました。企業規模の順位ではなく、ICチップが完成するまでの担当範囲で整理しています。",
  showCareerCtas: false,
  experienceBasis: [
    "Search Consoleに『icチップ 製造 会社』という検索クエリが表示され、企業分類から説明する記事が必要だと判断",
    "経済産業省の半導体人材育成資料で、ファブレス・ファウンドリ・IDM・OSATの分業構造を確認",
    "企業公式情報で、設計、ウェーハ製造、メモリ、組立・テスト、製造装置の担当範囲を照合",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Integrated Circuit",
      url: "https://www.hitachi-hightech.com/global/en/knowledge/semiconductor/room/about/ic.html",
      publisher: "Hitachi High-Tech",
      accessedAt: "2026-07-16",
    },
    {
      title: "中部地域 半導体人材育成プログラム 2024年7月版",
      url: "https://www.chubu.meti.go.jp/c31seizo/semicon/20240913/semiconductor_program.pdf",
      publisher: "経済産業省 中部経済産業局",
      accessedAt: "2026-07-16",
    },
    {
      title: "Dedicated IC Foundry",
      url: "https://www.tsmc.com/english/dedicatedFoundry",
      publisher: "TSMC",
      accessedAt: "2026-07-16",
    },
    {
      title: "Business Areas",
      url: "https://semiconductor.samsung.com/about-us/business-area/",
      publisher: "Samsung Semiconductor",
      accessedAt: "2026-07-16",
    },
    {
      title: "How a Semiconductor Factory Works",
      url: "https://newsroom.intel.com/tech101/how-a-semiconductor-factory-works",
      publisher: "Intel",
      accessedAt: "2026-07-16",
    },
    {
      title: "About KIOXIA",
      url: "https://www.kioxia.com/en-jp/about.html",
      publisher: "KIOXIA",
      accessedAt: "2026-07-16",
    },
    {
      title: "About Renesas",
      url: "https://www.renesas.com/en/about",
      publisher: "Renesas Electronics",
      accessedAt: "2026-07-16",
    },
    {
      title: "About Socionext",
      url: "https://www.socionext.com/en/about/topmessage.html",
      publisher: "Socionext",
      accessedAt: "2026-07-16",
    },
    {
      title: "About ASE",
      url: "https://ase.aseglobal.com/about-ase/",
      publisher: "ASE",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products and Services",
      url: "https://www.tel.com/product/all/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約14分",
  intro: {
    problem:
      "『ICチップを製造する会社』を調べると、NVIDIA、TSMC、Intel、東京エレクトロンなど役割の違う企業が並び、どこが実際にチップを作る会社なのか迷いませんか。",
    conclusion:
      "ウェーハ上にICを製造するのは主にファウンドリとIDMです。ファブレスは設計、OSATは主に組立・テスト、製造装置メーカーは工場で使う装置を提供します。一つのICチップは複数種類の会社が連携して完成させます。",
    learnings:
      "ICチップの意味、設計から完成までの会社分担、ファブレス・ファウンドリ・IDM・OSATの違い、国内外の代表企業、日本企業の見方、製品と職種による企業研究。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "Search Consoleに『icチップ 製造 会社』という検索語が出てきました。社名の一覧だけでは、設計する会社と工場で作る会社が混ざってしまうため、『誰がどこを作るか』から整理しました。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "ICチップは、複数種類の会社を通って完成する",
      description:
        "垂直統合する企業もあれば、各工程を外部へ委託する企業もあります。ここでは水平分業の代表的な流れを示します。",
      stages: [
        { label: "01 / DESIGN", title: "製品・回路を設計", body: "ファブレスやIDMが仕様、回路、レイアウトを作る" },
        { label: "02 / WAFER", title: "ウェーハ上へ製造", body: "ファウンドリやIDMのfabが回路を形成する" },
        { label: "03 / PROBE", title: "ウェーハで試験", body: "電気試験でダイの機能と特性を確認する" },
        { label: "04 / PACKAGE", title: "切断・組立", body: "OSATやIDMなどがダイを切り分け、接続・封止する" },
        { label: "05 / FINAL TEST", title: "完成品を選別", body: "最終試験を通過した製品を顧客へ出荷する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "会社の種類",
      rightLabel: "ICチップへの主な関わり方",
      rows: [
        { left: "ファブレス", right: "ICの企画・設計へ集中し、ウェーハ製造をファウンドリなどへ委託" },
        { left: "ファウンドリ", right: "顧客が設計したICを、製造プロセスと工場で受託製造" },
        { left: "IDM・メモリメーカー", right: "自社製品の設計と製造を持つ。外部委託や受託製造を併用する場合もある" },
        { left: "OSAT", right: "主にパッケージング、ウェーハテスト、最終検査などの後工程を受託" },
        { left: "製造装置・材料", right: "ICを直接販売するのではなく、各工程で使う装置・材料を半導体工場へ供給" },
      ],
    },
  ],
  sections: [
    {
      id: "what-is-ic-chip",
      heading: "ICチップとは、複数の素子と配線を集積した電子部品",
      lead: "ICはIntegrated Circuitの略で、日本語では集積回路です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "WAFER", title: "ウェーハ上にまとめて作る", body: "一枚の半導体ウェーハ上へ、同じ回路を多数並べて製造します。" },
            { label: "DIE", title: "個々の回路へ切り分ける", body: "ウェーハを切断した一片をダイと呼び、内部にトランジスタや配線があります。" },
            { label: "PACKAGE", title: "保護して接続する", body: "ダイを外部端子へ接続し、熱・汚染・物理的損傷から守る形へ仕上げます。" },
          ],
        },
        {
          type: "note",
          title: "『チップ』は文脈で指す範囲が変わる",
          body: "チップを切り分けたダイの意味で使う場合と、パッケージまで完成したIC製品の意味で使う場合があります。企業や工程を調べるときは、ウェーハ、ダイ、パッケージのどの状態を指しているか確認します。",
        },
      ],
      paragraphs: [
        "日立ハイテクはICを、一つのシリコン半導体基板上へトランジスタ、抵抗、コンデンサなど多数の機能素子を作り込んだ電子部品と説明しています。製造時には一枚のウェーハ上へ多数のICを形成し、切断してICチップへ分けます。",
        "半導体という言葉は、材料そのものや、IC、ダイオード、トランジスタ、センサーなどを含む広い言葉です。検索でいう『ICチップ製造会社』は、主に集積回路の設計・ウェーハ加工・組立を担う企業を探していると考えると整理しやすくなります。",
      ],
    },
    {
      id: "who-manufactures",
      heading: "実際にウェーハ上へICを作るのは、ファウンドリとIDM",
      lead: "狭い意味の『製造会社』は、半導体工場でウェーハ加工を行う企業です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "製造モデル",
          rightLabel: "特徴と代表企業例",
          rows: [
            { left: "専業ファウンドリ", right: "他社設計のICを受託製造。TSMC、GlobalFoundriesなど" },
            { left: "IDM", right: "自社製品の設計と製造を持つ。Intel、Texas Instruments、ルネサス、ロームなど" },
            { left: "メモリメーカー", right: "メモリの設計・プロセス・量産を一体で持つ企業が多い。Samsung Electronics、Micron、キオクシアなど" },
            { left: "IDMのファウンドリ事業", right: "自社製品に加え外部顧客向け製造も提供。Samsung Electronics、Intelなど" },
          ],
        },
      ],
      paragraphs: [
        "TSMCは自社ブランドのIC製品を中心にせず、顧客製品の受託製造へ集中する専業ファウンドリです。Intelは自社製品と製造技術を持ちながら外部顧客向けのファウンドリサービスも提供し、Samsung Semiconductorはメモリ、System LSI、Foundryの事業を持ちます。",
        "ただし、会社の分類は固定ではありません。IDMが一部製造を外部委託したり、ファウンドリがパッケージサービスまで提供したりします。『工場を持つか』だけでなく、調べている製品と事業部門の担当範囲を確認してください。",
      ],
    },
    {
      id: "fabless-osat-equipment",
      heading: "設計会社・OSAT・装置メーカーも、ICチップ製造を支える",
      lead: "自社でウェーハを量産しなくても、IC製品と製造工程へ大きな価値を提供する会社があります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FABLESS", title: "設計と製品を作る", body: "NVIDIA、AMD、Qualcomm、ソシオネクストなど。製品企画、回路、ソフトウェア、顧客用途へ集中します。" },
            { label: "OSAT", title: "組立・テストを仕上げる", body: "ASE、Amkor Technologyなど。パッケージング、ウェーハ試験、最終検査を受託します。" },
            { label: "EQUIPMENT", title: "製造手段を提供する", body: "東京エレクトロン、Applied Materials、ASMLなど。加工・検査・テスト装置を工場へ供給します。" },
          ],
        },
      ],
      paragraphs: [
        "経済産業省の資料はNVIDIAなどをファブレスの例として挙げ、設計へ特化して製造をファウンドリへ委託する水平分業を示しています。ソシオネクストも公式に、顧客向けSoCを開発・提供するファブレス企業と説明しています。",
        "ASEはICパッケージ設計、組立、ウェーハプローブ、最終試験などを提供します。東京エレクトロンは成膜、塗布・現像、エッチング、洗浄、テストなどの装置を提供します。どちらも製造現場に関わりますが、自社ブランドのICを設計・販売する会社とは役割が異なります。",
      ],
    },
    {
      id: "global-companies",
      heading: "海外の代表的なICチップ関連企業",
      lead: "企業名ではなく、主な製品と事業モデルをセットで見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業と分類",
          rightLabel: "主な製品・役割",
          rows: [
            { left: "TSMC｜ファウンドリ", right: "ロジック、車載、IoTなど幅広い顧客ICのウェーハ製造" },
            { left: "Samsung Electronics｜メモリ・IDM・ファウンドリ", right: "DRAM・NAND、System LSI、外部顧客向け受託製造" },
            { left: "Intel｜IDM・ファウンドリ", right: "CPUなどの自社製品、プロセス、パッケージ、外部顧客向け製造" },
            { left: "Micron Technology｜メモリ", right: "DRAM、NAND、ストレージ関連製品の開発・製造" },
            { left: "Texas Instruments｜IDM", right: "アナログIC、組み込みプロセッサ、電源関連製品" },
            { left: "NVIDIA｜ファブレス", right: "GPU、AI・データセンター向け半導体とソフトウェアを設計" },
            { left: "AMD｜ファブレス", right: "CPU、GPU、データセンター・組み込み向け半導体を設計" },
            { left: "ASE｜OSAT", right: "ICパッケージング、ウェーハ試験、最終検査、モジュール組立" },
          ],
        },
        {
          type: "note",
          title: "同じ企業が複数分類に入ることがある",
          body: "Samsung ElectronicsやIntelのように、自社製品を設計・製造しながら外部顧客向け製造を行う企業があります。会社全体を一語で分類するより、対象事業と製品を確認する方が正確です。",
        },
      ],
      paragraphs: [
        "ロジック、メモリ、アナログでは、必要な回路設計、製造プロセス、工場、販売方法が異なります。そのため『世界のICチップ会社』を一つの技術順位へ並べても、各社の役割は十分に比較できません。",
        "企業を調べるときは、何を設計・販売しているか、ウェーハ製造を誰が行うか、組立・テストをどこまで持つかを順番に確認します。最新の生産拠点や委託関係は変わるため、判断時には各社の公式情報を確認してください。",
      ],
    },
    {
      id: "japanese-companies",
      heading: "日本の代表的なICチップ関連企業",
      lead: "日本企業にも、製品と製造モデルが異なる複数のタイプがあります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業と分類",
          rightLabel: "主な製品・役割",
          rows: [
            { left: "ルネサス エレクトロニクス｜IDM", right: "マイコン、アナログ、パワー、接続関連の半導体ソリューション" },
            { left: "キオクシア｜メモリメーカー", right: "NANDフラッシュメモリ、SSD、ストレージ関連製品" },
            { left: "ローム｜IDM", right: "アナログIC、パワー半導体、ディスクリート、電子部品" },
            { left: "ソシオネクスト｜ファブレス", right: "顧客用途に合わせたSoCの設計・開発・販売" },
            { left: "東京エレクトロン｜製造装置", right: "成膜、塗布・現像、エッチング、洗浄、テストなどの装置" },
            { left: "アドバンテスト｜テスト装置", right: "ICへ電気信号を与え、機能・性能を判定するATEと関連ソリューション" },
          ],
        },
      ],
      paragraphs: [
        "キオクシアはフラッシュメモリとSSD、ルネサスは組み込み処理・アナログ・パワー、ロームはパワー・アナログなど、同じ日本の半導体企業でも製品が異なります。ソシオネクストはファブレスであり、設計したSoCのウェーハ製造はパートナーへ委託します。",
        "東京エレクトロンとアドバンテストは半導体産業の重要企業ですが、ICチップを自社製品として販売するデバイスメーカーとは違います。会社を探す目的が、IC設計、工場での量産、装置開発のどれなのかで候補を分けます。",
      ],
    },
    {
      id: "product-types",
      heading: "作るICの種類から会社を探す",
      lead: "企業分類だけでなく、製品の機能から探すと候補を絞りやすくなります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "LOGIC", title: "CPU・GPU・SoC", body: "演算や制御を担う。Intel、NVIDIA、AMD、Qualcomm、ソシオネクストなど。" },
            { label: "MEMORY", title: "DRAM・NAND", body: "データを一時的または長期に記憶する。Samsung、Micron、キオクシアなど。" },
            { label: "ANALOG", title: "アナログ・電源IC", body: "信号の増幅・変換や電源制御を担う。TI、Analog Devices、ルネサス、ロームなど。" },
            { label: "MCU", title: "マイコン・組み込み", body: "機器をリアルタイムに制御する。ルネサス、NXP、ST、Infineonなど。" },
            { label: "POWER", title: "パワー半導体", body: "電力を変換・制御する。Infineon、onsemi、ST、ロームなど。" },
            { label: "SENSOR / RF", title: "センサー・通信用IC", body: "光・圧力・無線信号などを扱う。用途ごとに専門企業がある。" },
          ],
        },
      ],
      paragraphs: [
        "一社が複数製品を持つ場合もあれば、一つの領域へ集中する場合もあります。たとえばSamsung Electronicsはメモリとロジック、ファウンドリを持ち、NVIDIAはGPUを中心とする設計・プラットフォーム企業です。",
        "企業一覧を見る前に、興味がある製品を一つ選び、その製品がどの用途で使われ、設計・プロセス・組立・顧客支援のどこに仕事があるかを確認すると、会社名だけの比較から抜け出せます。",
      ],
    },
    {
      id: "company-research",
      heading: "ICチップ会社を比較する5つの視点",
      lead: "同じ半導体企業でも、価値を作る場所と必要な職種は異なります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PRODUCT", title: "製品の種類", body: "ロジック、メモリ、アナログ、マイコン、パワー、センサーのどれか。" },
            { label: "MODEL", title: "事業モデル", body: "ファブレス、ファウンドリ、IDM、OSATのどこを主に担うか。" },
            { label: "PROCESS", title: "製造の担当範囲", body: "設計、ウェーハ加工、組立、試験を自社と委託先でどう分けるか。" },
            { label: "MARKET", title: "顧客用途", body: "データセンター、車載、産業、通信、民生などのどこへ提供するか。" },
            { label: "LOCATION", title: "拠点と職種", body: "本社の全事業ではなく、応募する法人・拠点が何を担当するか。" },
          ],
        },
      ],
      paragraphs: [
        "『ICチップ製造会社へ入りたい』場合も、回路設計、プロセス、設備、製品技術、品質、パッケージ、テスト、FAEでは候補企業が変わります。会社の分類と、自分が関わりたい工程を組み合わせて探してください。",
        "企業の製造拠点、委託先、製品ポートフォリオは変化します。転職、取引、投資の判断では、企業詳細ページを入口にしつつ、最新の公式サイト、IR、採用情報、求人票で確認する必要があります。",
      ],
    },
    {
      id: "summary",
      heading: "ICチップは、一社ではなく分業で作られる",
      lead: "最後に、初心者が押さえたい要点を整理します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FAB", title: "実際のウェーハ製造", body: "主にファウンドリとIDMが、fabで回路を形成する。" },
            { label: "CHAIN", title: "設計と後工程も必要", body: "ファブレス、OSAT、装置・材料企業が製品化と量産を支える。" },
            { label: "SEARCH", title: "製品と役割で会社を探す", body: "社名一覧より先に、ICの種類と関わりたい工程を決める。" },
          ],
        },
        {
          type: "faq",
          items: [
            { question: "ICチップを実際に製造する会社はどこですか？", answer: "ウェーハ上へICを製造するのは、TSMCなどのファウンドリと、Samsung Electronics、Intel、Micron、キオクシア、ルネサスなど自社製造を持つIDM・メモリ企業です。製品によって外部委託も使われます。" },
            { question: "NVIDIAはICチップ製造会社ですか？", answer: "NVIDIAはGPUなどのIC製品を設計・販売するファブレス企業です。半導体企業・チップメーカーと呼ばれますが、ウェーハ量産はTSMCなどの製造パートナーへ委託します。" },
            { question: "TSMCは何を作る会社ですか？", answer: "顧客が設計したロジック、車載、IoTなどのICを、製造プロセスと半導体工場を使って受託製造する専業ファウンドリです。" },
            { question: "日本のICチップメーカーは？", answer: "代表例として、マイコン・アナログなどのルネサス、NANDフラッシュメモリのキオクシア、アナログ・パワー半導体のロームがあります。ソシオネクストはSoCを設計するファブレス企業です。" },
            { question: "東京エレクトロンはICチップメーカーですか？", answer: "ICチップそのものではなく、成膜、塗布・現像、エッチング、洗浄、テストなどの半導体製造装置を提供する会社です。ICメーカーの工場で同社の装置が使われます。" },
            { question: "ファウンドリとIDMの違いは？", answer: "ファウンドリは主に顧客設計のICを受託製造します。IDMは自社製品の設計と製造を持ちます。ただしIDMが外部顧客向け製造を行ったり、一部工程を委託したりする場合があります。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体企業一覧", href: "/companies", description: "事業モデル、製品、拠点、職種から企業を探す" },
            { label: "半導体業界地図", href: "/industry-map", description: "設計、製造、メモリ、装置のつながりを見る" },
            { label: "シリコンウェーハメーカー", href: "/guides/semiconductor-silicon-wafer-manufacturers", description: "IC製造前の基板材料と主要企業を見る" },
            { label: "ファウンドリとは", href: "/guides/semiconductor-foundry", description: "設計データから受託製造へつなぐ仕組みを見る" },
            { label: "アナログ半導体企業", href: "/guides/analog-semiconductor-companies", description: "アナログICの製品・用途と代表企業を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置と主要企業を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "設計から前工程・後工程までの流れを見る" },
            { label: "パッケージング工程", href: "/guides/semiconductor-packaging-process", description: "ダイを接続・封止して製品へ仕上げる流れを見る" },
            { label: "Career Compass", href: "/career-compass", description: "自分の経験に近い企業領域と職種を整理する" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を一社選び、その会社が設計、ウェーハ製造、組立・テスト、装置・材料のどこへ価値を提供しているか確認してください。役割が分かれば、同じ土俵で比較できる企業と職種が見つけやすくなります。",
      ],
    },
  ],
  todayQuest: "気になるICチップ企業を1社選び、ファブレス・ファウンドリ・IDM・メモリ・OSATのどれに近いか確認する",
  relatedGuideSlugs: [
    "semiconductor-silicon-wafer-manufacturers",
    "semiconductor-foundry",
    "analog-semiconductor-companies",
    "semiconductor-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-packaging-process",
    "semiconductor-market-cap-ranking",
  ],
  relatedCompanyIds: [
    "tsmc",
    "samsung-electronics",
    "intel",
    "micron",
    "kioxia",
    "renesas",
    "rohm",
    "nvidia",
    "amd",
    "socionext",
    "globalfoundries",
    "texas-instruments",
  ],
};
