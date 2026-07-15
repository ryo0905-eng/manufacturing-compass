import type { GuideArticle } from "@/content/guides/types";

export const semiconductorMarketCapRankingGuide: GuideArticle = {
  slug: "semiconductor-market-cap-ranking",
  title: "【2026年最新】世界の半導体企業・時価総額ランキングTOP30｜日本企業も比較",
  description:
    "2026年最新、基準日付きの世界の半導体企業・時価総額ランキングTOP30。NVIDIA、TSMCなど主要企業と日本企業を比較し、ファブレス、ファウンドリ、製造装置の違い、売上高との違い、転職時の企業研究での見方まで解説します。",
  targetQuery: "半導体企業 時価総額ランキング",
  searchIntent:
    "世界と日本の半導体関連企業を最新の時価総額で比較し、各社の業界内での役割、企業分類、売上高との違い、転職時の見方を理解したい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査範囲",
  experienceBasis: [
    "CompaniesMarketCapのSemiconductorsカテゴリから、2026年7月13日の直近取引終了後に世界上位30社を同時取得",
    "同じカテゴリの全順位から国・地域がJapanの企業を抽出し、日本企業上位10社を作成",
    "上位企業と日本企業の事業分類は、各社の公式企業情報、IR、製品情報を優先して確認",
  ],
  publishedAt: "2026-07-14",
  updatedAt: "2026-07-14",
  sources: [
    {
      title: "Largest semiconductor companies by market cap",
      url: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
      publisher: "CompaniesMarketCap",
      accessedAt: "2026-07-14",
    },
    {
      title: "NVIDIA Market Cap & Net Worth",
      url: "https://stockanalysis.com/stocks/nvda/market-cap/",
      publisher: "Stock Analysis / Nasdaq Data Link",
      accessedAt: "2026-07-14",
    },
    {
      title: "NVIDIA in Brief",
      url: "https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/corporate-nvidia-in-brief.pdf",
      publisher: "NVIDIA",
      accessedAt: "2026-07-14",
    },
    {
      title: "About TSMC",
      url: "https://www.tsmc.com/english/aboutTSMC",
      publisher: "TSMC",
      accessedAt: "2026-07-14",
    },
    {
      title: "About Us",
      url: "https://www.broadcom.com/company/about-us",
      publisher: "Broadcom",
      accessedAt: "2026-07-14",
    },
    {
      title: "Our Business",
      url: "https://www.samsung.com/global/ir/ir-resources/our-business/",
      publisher: "Samsung Electronics",
      accessedAt: "2026-07-14",
    },
    {
      title: "About Micron",
      url: "https://www.micron.com/about",
      publisher: "Micron Technology",
      accessedAt: "2026-07-14",
    },
    {
      title: "About AMD",
      url: "https://www.amd.com/en/corporate.html",
      publisher: "AMD",
      accessedAt: "2026-07-14",
    },
    {
      title: "About ASML",
      url: "https://www.asml.com/en/company/about-asml",
      publisher: "ASML",
      accessedAt: "2026-07-14",
    },
    {
      title: "Company Overview",
      url: "https://www.intel.com/content/www/us/en/company-overview/company-overview.html",
      publisher: "Intel",
      accessedAt: "2026-07-14",
    },
    {
      title: "About Applied Materials",
      url: "https://www.appliedmaterials.com/us/en/about.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-14",
    },
    {
      title: "Corporate Summary",
      url: "https://www.tel.com/corporatesummary/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-14",
    },
    {
      title: "About Renesas",
      url: "https://www.renesas.com/en/about",
      publisher: "Renesas Electronics",
      accessedAt: "2026-07-14",
    },
    {
      title: "Business and Core Technology",
      url: "https://www.lasertec.co.jp/en/company/business.html",
      publisher: "Lasertec",
      accessedAt: "2026-07-14",
    },
    {
      title: "SUMCO Corporation - High Quality Silicon Wafers",
      url: "https://www.sumcosi.com/english/",
      publisher: "SUMCO",
      accessedAt: "2026-07-14",
    },
  ],
  readTime: "約18分",
  intro: {
    problem: "半導体企業のランキングを見ても、設計会社、製造会社、装置会社がなぜ同じ表に並ぶのか分かりにくくありませんか。",
    conclusion: "2026年7月13日時点ではNVIDIAが首位です。ただし、時価総額だけでなく各社が設計・製造・装置・後工程のどこを担うかを合わせて見ます。",
    learnings: "世界TOP30、日本TOP10、企業分類、時価総額と売上高の違い、転職先の企業研究へ使う際の注意点。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "NVIDIA、TSMC、ASML、東京エレクトロンは役割が違います。企業規模と業界内での位置を一つの一覧で確認したいと思い、時価総額ランキングとして整理しました。",
      caption: "この記事を作成した理由",
    },
  ],
  sections: [
    {
      id: "world-ranking",
      heading: "【2026年最新】世界の半導体企業・時価総額ランキングTOP30",
      lead: "2026年7月13日時点の上位3社は、NVIDIA、TSMC、Broadcomです。",
      blocks: [{ type: "market-cap-ranking", scope: "world" }],
      paragraphs: [
        "本記事では、半導体そのものを設計・製造する企業だけでなく、製造装置、検査・計測装置、EDA、半導体IP、OSATなども含めています。同じ『半導体企業』でも、顧客、設備、収益構造、技術職の役割は異なります。",
        "サムスン電子のような総合電機メーカーの時価総額は、半導体部門だけの企業価値を示すものではありません。企業全体の時価総額で比較しているため、専業企業との違いを理解したうえで順位を見てください。",
      ],
    },
    {
      id: "methodology",
      heading: "ランキングの対象とデータ基準日",
      lead: "数字を混在させないため、主ランキングは一つの基準ソースへ統一しました。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "DATE", title: "2026年7月13日", body: "各市場の直近取引終了後に確認できたデータを使用" },
            { label: "SOURCE", title: "同時点の1データ", body: "CompaniesMarketCapのSemiconductorsカテゴリを基準に統一" },
            { label: "SCOPE", title: "上場企業のみ", body: "客観的な時価総額を持たない未上場企業は対象外" },
            { label: "CHECK", title: "重複を除外", body: "同一企業、二重上場、ADRと現地株式を別企業として数えない" },
          ],
        },
        {
          type: "note",
          title: "TSMCの扱い",
          body: "TSMCはNYSEのADR価格だけを単純に掛けた値ではなく、CompaniesMarketCapが示す企業全体の時価総額を使用しています。市場情報サービスとのクロスチェックでは取得時刻や株式数の扱いによる差があったため、表の数字は基準ソースへ統一しました。",
        },
      ],
      paragraphs: [
        "時価総額は株価と発行済株式数から算出され、株価や為替で動きます。CompaniesMarketCapは日次更新ですが、同サイトも株価データに数分から数時間の遅延があり得ると明記しています。この記事の数値はリアルタイム値ではなく、基準日時点のスナップショットです。",
      ],
    },
    {
      id: "top-ten",
      heading: "世界ランキング上位10社は、何をしている企業か",
      lead: "上位10社だけでも、ファブレス、ファウンドリ、IDM、メモリ、製造装置が混在します。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "1位", title: "NVIDIA｜ファブレス", body: "AI向けGPUとアクセラレーテッドコンピューティングを軸にする設計企業です。自社で大規模な量産工場を運営する会社ではなく、製品設計、ソフトウェア、システム全体を組み合わせます。製造技術者は、同社単体だけでなく製造を担うファウンドリや装置企業との分業まで見る必要があります。" },
            { label: "2位", title: "TSMC｜ファウンドリ", body: "顧客が設計した半導体を製造する専業ファウンドリです。幅広い顧客製品を量産へつなぐため、プロセス、設備、歩留まり、品質、生産管理など製造現場に近い機能を持ちます。NVIDIAとTSMCは競合として単純比較するより、設計と製造を分担する関係として理解すると位置づけが明確です。" },
            { label: "3位", title: "Broadcom｜ファブレス", body: "ネットワーク、サーバー、ストレージ、無線接続などの半導体に加え、インフラソフトウェアも展開する企業です。ランキングの時価総額は半導体事業だけの評価ではありません。AIデータセンターでは演算チップだけでなく、高速なデータ接続やネットワークも重要な領域です。" },
            { label: "4位", title: "Samsung Electronics｜IDM・総合電機", body: "メモリ、System LSI、ファウンドリを含むDevice Solutions事業を持ち、電子機器など半導体以外の事業も展開します。設計から製造までを幅広く持つIDMとして整理していますが、表の時価総額は半導体部門だけではなくSamsung Electronics全体の数値です。" },
            { label: "5位", title: "Micron Technology｜メモリ・IDM", body: "DRAM、NAND、HBM、SSDなどメモリとストレージを中心に設計・製造する企業です。ロジック半導体のファブレス企業とは異なり、メモリ量産のプロセス、設備、品質、歩留まりが事業の中核にあります。需要と市況の変動が順位へ反映される場合もあります。" },
            { label: "6位", title: "AMD｜ファブレス", body: "データセンター、PC、ゲーム、組み込み向けのCPU、GPU、アクセラレーターを開発する企業です。NVIDIAと同じファブレスに分類できますが、製品ポートフォリオと対象市場は同一ではありません。日本での求人を見る場合も、本社の全事業ではなく日本法人の担当機能を確認します。" },
            { label: "7位", title: "SK hynix｜メモリ・IDM", body: "DRAM、NAND、HBMを中心とする韓国のメモリメーカーです。メモリは設計だけでなく量産能力、プロセス統合、設備、歩留まり、品質が競争力へ直結しやすい領域です。同じ上位企業でも、ファブレス企業とは技術職の構成が大きく異なります。" },
            { label: "8位", title: "ASML｜製造装置", body: "半導体回路のパターン形成に使うEUV・DUV露光装置を設計・製造します。半導体そのものを販売する会社ではなく、チップメーカーが量産するための装置、ソフトウェア、サービスを提供します。機械、電気、光学、制御、ソフトウェア、フィールドサポートが交わる企業です。" },
            { label: "9位", title: "Intel｜IDM・ファウンドリ", body: "CPUやデータセンター向け製品の設計・製造に加え、外部顧客向けの製造事業にも取り組む企業です。設計と自社工場を持つIDMであり、ファウンドリ機能もあります。会社名だけでなく、製品開発、プロセス開発、製造、顧客向け受託製造のどこに属する職務かを分けて見ます。" },
            { label: "10位", title: "Applied Materials｜製造装置", body: "材料工学を基盤に、成膜、エッチング、イオン注入など半導体製造に必要な装置とサービスを提供します。製造装置企業では、装置開発だけでなくプロセスサポート、アプリケーション、フィールドサービスなど、顧客工場と接点を持つ技術職もあります。" },
          ],
        },
      ],
      paragraphs: [
        "上位10社の順位は企業の優劣を表すものではありません。株式市場が企業全体へ付けた評価額を並べた結果であり、売上高、利益、従業員数、特定製品の市場シェアとは別の指標です。",
      ],
    },
    {
      id: "japan-ranking",
      heading: "日本の半導体関連企業・時価総額ランキングTOP10",
      lead: "同じデータセットから日本企業を抽出すると、製造装置と検査・計測装置の企業が多く入ります。",
      blocks: [{ type: "market-cap-ranking", scope: "japan" }],
      paragraphs: [
        "日本1位は東京エレクトロンで世界17位、2位はアドバンテストで世界20位です。日本TOP10のうち、東京エレクトロン、アドバンテスト、ディスコ、レーザーテック、SCREEN、KOKUSAI ELECTRIC、ローツェの7社を装置または検査・計測装置へ分類しました。",
        "ルネサスとロームは半導体デバイスを扱うIDM、SUMCOはシリコンウエハーを供給する材料企業です。キオクシアやソシオネクストなど著名企業でも、基準データのカテゴリや順位によって今回のTOP10へ入らない場合があります。編集判断でカテゴリ外の企業を追加していません。",
      ],
    },
    {
      id: "business-models",
      heading: "ファブレス、ファウンドリ、IDM、製造装置の違い",
      lead: "ランキングを読む前提として、半導体のバリューチェーン上で何を提供する企業かを確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "分類",
          rightLabel: "役割とランキング内の企業例",
          rows: [
            { left: "ファブレス", right: "自社工場での量産を中心とせず、設計へ注力。NVIDIA、Broadcom、AMD、Qualcomm" },
            { left: "ファウンドリ", right: "他社が設計した半導体を受託製造。TSMC、SMIC" },
            { left: "IDM", right: "設計から製造までを自社で行う。Samsung Electronics、Intel、Texas Instruments" },
            { left: "メモリメーカー", right: "DRAM、NAND、HBMなどが主力。Micron、SK hynix" },
            { left: "製造装置", right: "半導体を作る装置を供給。ASML、Applied Materials、東京エレクトロン" },
            { left: "EDA・IP", right: "設計ソフトや再利用できる設計資産を提供。Arm、Synopsys" },
            { left: "OSAT・後工程", right: "組立、パッケージ、テストを受託。ASE Technology" },
            { left: "材料・ウエハー", right: "製造に使う基板や材料を供給。日本ランキングではSUMCO" },
          ],
        },
        {
          type: "note",
          title: "分類は主な役割へ単純化",
          body: "複数事業を持つ企業があります。Broadcomにはインフラソフトウェア、Samsung Electronicsには半導体以外の事業、IntelにはIDMとファウンドリの両面があります。本表はキャリア研究の入口として主な役割へ整理したものです。",
        },
      ],
      paragraphs: [
        "同じ時価総額でも、設計資産へ投資する企業と、大規模な工場や装置へ投資する企業では事業の形が違います。求人を比較するときも、会社の順位より先に自分の経験がどの工程や機能へつながるかを見ます。",
      ],
    },
    {
      id: "what-is-market-cap",
      heading: "時価総額とは何か｜売上高や利益とは違う",
      lead: "時価総額は、株価に発行済株式数を掛けて算出する、株式市場における企業価値の目安です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MARKET CAP", title: "市場からの評価額", body: "株価が動けば時価総額も変動。将来の成長期待が反映される場合がある" },
            { label: "REVENUE", title: "売上高", body: "一定期間に商品やサービスを販売して得た収益。時価総額とは計算方法が違う" },
            { label: "PROFIT", title: "利益", body: "売上高から費用を差し引いた成果。時価総額や保有現金とは別の数字" },
            { label: "SCALE", title: "事業規模の一面", body: "時価総額が最大でも、売上高、工場数、従業員数が最大とは限らない" },
          ],
        },
      ],
      paragraphs: [
        "株価が上昇すれば、発行済株式数が同じでも時価総額は大きくなります。一方で、企業の現金残高や年間売上をそのまま表す数字ではありません。総合企業の場合は、半導体以外の事業に対する評価も含まれます。",
        "時価総額が大きい企業が、転職先として必ず優れているわけでもありません。採用職種、勤務地、仕事内容、働き方、必要な経験は時価総額から判断できないためです。",
      ],
    },
    {
      id: "ranking-findings",
      heading: "2026年の半導体企業ランキングから分かる4つの特徴",
      lead: "結論を先に決めず、今回取得した30社の国・地域と分類から確認します。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "AI", title: "AI計算基盤に関わる企業が上位", body: "首位NVIDIAに加え、ネットワーク半導体のBroadcom、CPU・GPUのAMD、メモリのMicronとSK hynixが上位7社に入っています。AI向け半導体は演算チップだけでなく、メモリと接続技術を含む構造です。" },
            { label: "ROLE", title: "設計企業と製造企業が同時に評価", body: "1位のNVIDIAはファブレス、2位のTSMCはファウンドリです。製造を持たない設計企業と、顧客製品を量産する製造企業が隣り合い、分業による産業構造が順位へ表れています。" },
            { label: "REGION", title: "TOP30の半数が米国企業", body: "本社所在地ベースでは米国が15社です。台湾3社、中国3社、韓国2社、日本2社、オランダ2社が続き、英国、ドイツ、スイスが各1社でした。製造拠点や売上地域は本社所在地と一致するとは限りません。" },
            { label: "JAPAN", title: "日本は装置・検査領域が目立つ", body: "世界TOP30に入った日本企業は東京エレクトロンとアドバンテストで、どちらも装置関連です。日本TOP10でも7社を製造装置または検査・計測装置へ分類でき、材料ではSUMCOが入っています。" },
          ],
        },
      ],
      paragraphs: [
        "これらは2026年7月13日の構成です。株価変動で順位は入れ替わります。また、現在の時価総額から将来の株価、売上、採用数を予測することはできません。",
      ],
    },
    {
      id: "revenue-ranking",
      heading: "半導体企業の時価総額ランキングと売上高ランキングは何が違うか",
      lead: "時価総額は株式市場の評価、売上高は一定期間の事業規模を表します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比べる指標",
          rightLabel: "読み取れることと限界",
          rows: [
            { left: "時価総額", right: "株価 × 発行済株式数。成長期待や市場環境を含み、日々変動する" },
            { left: "売上高", right: "一定期間に得た収益。事業規模を見やすいが、利益率や将来性を単独では示さない" },
            { left: "利益", right: "売上から費用を引いた成果。設備投資や会計上の要因で変動する" },
            { left: "従業員数・拠点数", right: "組織や運営規模の一面。企業価値や採用数と同じではない" },
          ],
        },
      ],
      paragraphs: [
        "例えば、設計とソフトウェアを軸に高い成長期待を集める企業は、工場や従業員数だけでは説明できない時価総額になる場合があります。反対に、大きな売上と製造設備を持つ企業でも、市場からの評価倍率が同じとは限りません。",
        "企業研究では、時価総額で市場評価を確認し、売上高と利益で事業の実績を見て、事業別売上や設備投資から何へ注力しているかを確認すると、数字を混同しにくくなります。",
      ],
    },
    {
      id: "career-view",
      heading: "転職先として時価総額ランキングを見る際の注意点",
      lead: "時価総額は企業規模を知る一つの指標ですが、募集職種との相性は企業分類から考えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業分類",
          rightLabel: "一般的に考えられる技術職の例",
          rows: [
            { left: "ファブレス", right: "回路設計、製品開発、アプリケーション、ソフトウェア、品質" },
            { left: "ファウンドリ", right: "プロセス、設備、歩留まり、製造、品質、生産管理" },
            { left: "IDM・メモリ", right: "デバイス、プロセス、製造、設備、品質、製品技術" },
            { left: "製造装置", right: "装置開発、プロセスサポート、フィールドサービス、アプリケーション" },
            { left: "OSAT・後工程", right: "パッケージ、実装、テスト、品質、製造技術" },
            { left: "EDA・IP", right: "ソフトウェア、回路設計支援、技術営業、アプリケーション" },
          ],
        },
        {
          type: "note",
          title: "現在募集中の職種を示す表ではありません",
          body: "上記は企業分類から考えられる一般的な職種例です。各社が現在募集しているとは限りません。日本法人の役割は本社全体の事業内容と異なる場合もあるため、公式採用ページと実際の求人票を確認してください。",
        },
      ],
      paragraphs: [
        "製造業の経験を転職へつなげるなら、時価総額の順位より、設計、前工程、後工程、装置、材料のどこで経験を使えるかを先に考えます。工程改善や設備経験でも、デバイスメーカーと装置メーカーでは顧客、成果、働く場所が変わります。",
        "求人票だけでは日本での組織構成や担当範囲が分かりにくい場合があります。そのときは企業の公式採用情報に加え、半導体・製造業を扱う転職エージェントへ求人背景と実際の担当範囲を確認します。",
      ],
    },
    {
      id: "research-flow",
      heading: "ランキングを企業研究へつなげる4ステップ",
      lead: "順位を眺めて終わらず、役割と求人を順番に確認します。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "01", title: "主要企業を知る", body: "世界と日本のランキングから、候補企業と周辺企業を把握" },
            { label: "02", title: "業界内の役割を見る", body: "設計、製造、装置、検査、後工程、材料のどこを担うか確認" },
            { label: "03", title: "経験との接点を探す", body: "工程、設備、品質、設計、データ、顧客対応の経験と照合" },
            { label: "04", title: "実際の求人を確認する", body: "公式採用ページや転職エージェントで勤務地と担当業務を確認" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体企業一覧", href: "/companies", description: "事業領域、日本拠点、代表的な職種から企業を調べる" },
            { label: "半導体業界地図", href: "/industry-map", description: "設計、製造、装置などバリューチェーンの位置を確認する" },
            { label: "生産技術からプロセス職へ", href: "/guides/production-engineering-to-semiconductor-process-engineer", description: "製造現場の経験と半導体プロセス職の接点を整理する" },
            { label: "半導体転職と英語力", href: "/guides/semiconductor-career-english-level", description: "外資系企業を含め、職種ごとの英語使用場面を確認する" },
            { label: "ChatGPTを使った半導体転職", href: "/guides/semiconductor-career-chatgpt", description: "求人票と職務経歴書を照合した実体験を読む" },
            { label: "転職エージェント比較", href: "/career-agents", description: "相談したい業界、職種、求人タイプから相談先を比較する" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "faq",
      heading: "半導体企業の時価総額ランキングでよくある質問",
      lead: "基準日、対象範囲、指標の違いを簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "世界で時価総額が最も大きい半導体企業は？", answer: "2026年7月13日時点のCompaniesMarketCap SemiconductorsカテゴリではNVIDIAが1位で、時価総額は約4.93兆ドルです。株価で変動するため、これは基準日時点の参考値です。" },
            { question: "日本で時価総額が最も大きい半導体関連企業は？", answer: "同じデータセットでは東京エレクトロンが日本1位、世界17位です。半導体製造装置メーカーで、半導体そのものを製造する企業ではありません。" },
            { question: "NVIDIAとTSMCは何が違う？", answer: "NVIDIAはGPUなどを設計するファブレス企業、TSMCは顧客が設計した半導体を製造するファウンドリです。設計と製造で、半導体産業の異なる役割を担います。" },
            { question: "半導体製造装置メーカーもランキングに含まれる？", answer: "含まれます。本記事はCompaniesMarketCapのSemiconductorsカテゴリを基準に、ASML、Applied Materials、東京エレクトロンなど装置企業も対象としています。" },
            { question: "時価総額と売上高の違いは？", answer: "時価総額は株価に発行済株式数を掛けた株式市場での評価額です。売上高は一定期間に商品やサービスを販売して得た収益で、同じ数字ではありません。" },
            { question: "時価総額が大きい企業ほど転職先としておすすめ？", answer: "一概には言えません。時価総額では仕事内容、勤務地、採用職種、社風、働き方は分かりません。自分の経験と企業分類、実際の求人内容を合わせて判断します。" },
            { question: "Rapidusなど未上場企業が入っていないのはなぜ？", answer: "上場株式の価格と発行済株式数から客観的な時価総額を比較できないためです。未上場企業へ推定値を付けず、今回のランキングは上場企業だけを対象にしています。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "sources-method",
      heading: "出典・調査方法とデータ更新日",
      lead: "ランキングは2026年7月13日時点、データ取得日は2026年7月14日です。",
      blocks: [
        {
          type: "note",
          title: "調査方法",
          body: "CompaniesMarketCapのSemiconductorsカテゴリを主データとし、上位30社を同時点で取得しました。降順、順位の連続性、重複、国・地域を確認し、日本企業は同じカテゴリの全順位から抽出しました。上位企業と日本企業の分類は、公式企業情報、IR、製品ページで確認しています。",
        },
      ],
      paragraphs: [
        "上位企業は市場情報サービスとも照合し、取得時刻、為替、発行済株式数、ADRの扱いで差が出ることを確認しました。表の行ごとに別サイトの数字を混ぜず、主データの数値に統一しています。時価総額は今後も変動するため、更新時は30社と日本10社を同じ基準日で差し替えます。",
        "株価データには遅延がある場合があります。本記事は半導体業界の構造と企業研究を目的とし、株式の購入・売却を推奨する投資助言ではありません。",
      ],
    },
    {
      id: "summary",
      heading: "まとめ｜順位より先に、半導体業界での役割を見る",
      lead: "2026年7月13日時点の時価総額上位はNVIDIA、TSMC、Broadcomでした。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "RANK", title: "企業規模の一面を知る", body: "基準日と定義を確認し、時価総額の順位を見る" },
            { label: "ROLE", title: "役割を分ける", body: "設計、製造、装置、検査、後工程、材料の違いを確認" },
            { label: "CAREER", title: "求人へつなげる", body: "経験が生きる分類を選び、公式採用ページで募集職種を確認" },
          ],
        },
      ],
      paragraphs: [
        "ランキングから分かるのは、株式市場が付けた企業全体の評価額と、上位企業の構成です。転職先を考えるときは、時価総額だけで決めず、自分の経験が設計、前工程、後工程、装置、材料のどこへつながるかを確認してください。",
      ],
    },
  ],
  todayQuest: "ランキングから3社を選び、各社を「設計・製造・装置・後工程・材料」のどこに位置づけるか確認する",
  relatedGuideSlugs: [
    "semiconductor-equipment-manufacturers",
    "analog-semiconductor-companies",
    "semiconductor-foundry",
    "semiconductor-career-start",
    "production-engineering-to-semiconductor-process-engineer",
    "semiconductor-career-english-level",
    "semiconductor-career-chatgpt",
  ],
  relatedCompanyIds: ["nvidia", "tsmc", "tokyo-electron", "advantest"],
};
