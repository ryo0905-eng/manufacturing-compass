import type { GuideArticle } from "@/content/guides/types";
import { japanSemiconductorMarketCapRanking, worldSemiconductorMarketCapRanking } from "@/data/semiconductor-market-cap";

export const semiconductorMarketCapRankingHero = {
  titleParts: ["半導体メーカー", "世界ランキング"],
  metric: "時価総額",
  scopes: ["TOP30", "日本18社"],
  conclusion: `世界1位は${worldSemiconductorMarketCapRanking[0].name}、日本1位は${japanSemiconductorMarketCapRanking[0].name}。`,
} as const;

export const semiconductorMarketCapRankingGuide: GuideArticle = {
  slug: "semiconductor-market-cap-ranking",
  title: "半導体メーカー世界ランキング【2026年10月】時価総額TOP30・日本18社",
  description:
    "2026年10月16日基準の半導体メーカー・関連企業の世界時価総額TOP30と日本18社。トヨタ自動車を物差しに企業全体の時価総額を比較し、対象・出典・事業分類・売上高との違いを解説します。",
  targetQuery: "半導体企業 時価総額ランキング",
  searchIntent:
    "世界と日本の半導体関連企業を最新の時価総額で比較し、各社の業界内での役割、企業分類、売上高との違い、転職時の見方を理解したい",
  status: "published",
  category: "industry",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  showIntroSummary: false,
  showExperienceBasis: false,
  basisLabel: "この記事の調査範囲",
  experienceBasis: [
    "CompaniesMarketCapのSemiconductorsカテゴリから、2026年10月16日基準の世界上位30社を10月17日に一括確認",
    "同じカテゴリの掲載順位から国・地域がJapanの企業を抽出し、日本企業18社を全件掲載",
    "上位企業と日本企業の事業分類は、各社の公式企業情報、IR、製品情報を優先して確認",
  ],
  publishedAt: "2026-07-14",
  updatedAt: "2026-10-27",
  sources: [
    {
      title: "Largest semiconductor companies by market cap — Page 2",
      url: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/?page=2",
      publisher: "CompaniesMarketCap",
      accessedAt: "2026-10-17",
    },
    {
      title: "MARUWAの技術",
      url: "https://www.maruwa-g.com/products/about/",
      publisher: "MARUWA",
      accessedAt: "2026-10-17",
    },
    {
      title: "プローブカード",
      url: "https://www.mjc.co.jp/products_service/probecard/",
      publisher: "日本マイクロニクス",
      accessedAt: "2026-10-17",
    },
    {
      title: "製品情報",
      url: "https://www.photomask.com/product/",
      publisher: "テクセンドフォトマスク",
      accessedAt: "2026-10-17",
    },
    {
      title: "ソシオネクストについて",
      url: "https://www.socionext.com/jp/about/",
      publisher: "ソシオネクスト",
      accessedAt: "2026-10-17",
    },
    {
      title: "価値創造プロセス／トーメンデバイスを知る4つのキーワード",
      url: "https://www.tomendevices.co.jp/ir/aboutus.html",
      publisher: "トーメンデバイス",
      accessedAt: "2026-10-17",
    },
    {
      title: "モールディング装置",
      url: "https://www.towajapan.co.jp/jp/products/molding/",
      publisher: "TOWA",
      accessedAt: "2026-10-17",
    },
    {
      title: "アニュアルレポート2024（事業内容）",
      url: "https://rs-tec.jp/ir/library/annualreport/annual2024.pdf",
      publisher: "RSテクノロジーズ",
      accessedAt: "2026-10-17",
    },
    {
      title: "未来を創るアプリケーション",
      url: "https://www.sanken-ele.co.jp/corp/csr/future/index.htm",
      publisher: "サンケン電気",
      accessedAt: "2026-10-17",
    },
    {
      title: "日経業界地図 2027年版（紹介書籍の書誌情報）",
      url: "https://bookplus.nikkei.com/atcl/catalog/26/07/29/02721/",
      publisher: "日経BOOKプラス",
      accessedAt: "2026-10-14",
    },
    {
      title: "会社四季報 業界地図2027年版（紹介書籍の書誌情報）",
      url: "https://str.toyokeizai.net/magazine/gyoukai/",
      publisher: "東洋経済新報社",
      accessedAt: "2026-10-14",
    },
    {
      title: "Largest semiconductor companies by market cap",
      url: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
      publisher: "CompaniesMarketCap",
      accessedAt: "2026-10-17",
    },
    {
      title: "Toyota Market capitalization（業界外の参考比較）",
      url: "https://companiesmarketcap.com/toyota/marketcap/",
      publisher: "CompaniesMarketCap",
      accessedAt: "2026-10-17",
    },
    {
      title: "About CXMT",
      url: "https://www.cxmt.com/en/about.html",
      publisher: "CXMT",
      accessedAt: "2026-08-16",
    },
    {
      title: "About NXP",
      url: "https://www.nxp.com/company/about-nxp:ABOUT-NXP",
      publisher: "NXP Semiconductors",
      accessedAt: "2026-10-17",
    },
    {
      title: "Overview",
      url: "https://www.umc.com/en/About/about_overview",
      publisher: "UMC",
      accessedAt: "2026-10-01",
    },
    {
      title: "Wafer Handling System",
      url: "https://www.rorze.com/en/products_category/wafer-transfer-system/",
      publisher: "RORZE",
      accessedAt: "2026-10-01",
    },
    {
      title: "NVIDIA Market Cap & Net Worth",
      url: "https://stockanalysis.com/stocks/nvda/market-cap/",
      publisher: "Stock Analysis / Nasdaq Data Link",
      accessedAt: "2026-10-17",
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
  readTime: "約12分",
  intro: {
    problem: "半導体企業のランキングを見ても、設計会社、製造会社、装置会社がなぜ同じ表に並ぶのか分かりにくくありませんか。",
    conclusion: "世界1位はNVIDIA、日本1位は東京エレクトロンです（2026年10月16日基準）。世界TOP30と日本18社を、参考のトヨタ自動車とともに企業全体の時価総額で比較します。",
    learnings: "世界TOP30、日本18社、企業分類、時価総額と売上高の違い、転職先の企業研究へ使う際の注意点。",
  },
  overviewBlocks: [
    {
      type: "links",
      items: [
        { label: "世界TOP30を見る", href: "#world-ranking", description: "世界の半導体メーカー・関連企業を比較" },
        { label: "日本18社を見る", href: "#japan-ranking", description: "同じ基準の日本企業ランキング" },
        { label: "時価総額の増加率・増加額を見る", href: "/guides/semiconductor-market-cap-growth-ranking", description: "1か月・3か月・6か月・1年の変化を比較する" },
        { label: "詳しい解説を読む", href: "#top-ten", description: "上位企業の特徴と業界での役割" },
      ],
    },
  ],
  sections: [
    {
      id: "world-ranking",
      heading: "半導体メーカー・関連企業の世界時価総額ランキングTOP30",
      blocks: [{ type: "market-cap-ranking", scope: "world" }, { type: "ranking-purpose-entry" }],
      paragraphs: [],
    },
    {
      id: "japan-ranking",
      heading: "日本の半導体関連企業・時価総額ランキング18社",
      lead: "日本1位は東京エレクトロン（世界20位）、2位はアドバンテスト（世界21位）です。",
      blocks: [{ type: "market-cap-ranking", scope: "japan" }],
      paragraphs: [
        "同じカテゴリの全2ページから、日本企業18社をすべて掲載しています。デバイス・装置・検査・材料に加え、半導体商社も含みます。提供元のカテゴリに掲載されていない企業は含まないため、日本の半導体関連企業を網羅した一覧ではありません。",
      ],
    },
    {
      id: "ranking-history",
      heading: "過去の順位の変化を見る",
      blocks: [{ type: "ranking-time-machine-preview" }],
      paragraphs: [],
    },
    {
      id: "top-ten",
      heading: "世界ランキング上位10社の特徴と、企業を見るポイント",
      lead: "表の主な事業に加え、分業関係や事業範囲の違いを整理します。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "1位", title: "NVIDIA｜ファブレス", body: "GPUの設計だけでなく、ソフトウェアやシステム全体を組み合わせる点が特徴です。量産はファウンドリなどとの分業で成り立っています。" },
            { label: "2位", title: "TSMC｜ファウンドリ", body: "顧客が設計した半導体を量産へつなぐ企業です。NVIDIAとは、設計と製造を分担する関係として見ると位置づけを理解しやすくなります。" },
            { label: "3位", title: "Broadcom｜ファブレス", body: "ネットワークや高速なデータ接続を支える半導体に加え、インフラソフトウェアも展開。時価総額には半導体以外の事業への評価も含まれます。" },
            { label: "4位", title: "Samsung Electronics｜IDM・総合電機", body: "メモリ、System LSI、ファウンドリを持つ一方、電子機器も展開。半導体専業企業と比べる際は、企業全体と半導体部門の範囲を分けて見る必要があります。" },
            { label: "5位", title: "Micron Technology｜メモリ・IDM", body: "メモリとストレージの設計から製造までを担います。量産のプロセス、設備、品質、歩留まりに加え、需要や市況の変動も事業を見るポイントです。" },
            { label: "6位", title: "AMD｜ファブレス", body: "CPU、GPU、アクセラレーターをデータセンター、PC、ゲーム、組み込みへ展開。同じファブレスでも、NVIDIAとは製品構成と対象市場が異なります。" },
            { label: "7位", title: "SK hynix｜メモリ・IDM", body: "DRAM、NAND、HBMが中心。設計に加え、量産能力、プロセス統合、歩留まりや品質が競争力に関わる企業です。" },
            { label: "8位", title: "ASML｜製造装置", body: "回路のパターン形成に使うEUV・DUV露光装置を供給。装置だけでなく、ソフトウェアやサービスも組み合わせてチップメーカーの量産を支えます。" },
            { label: "9位", title: "CXMT｜メモリ・IDM", body: "DRAMの研究開発、設計、製造、販売を担う中国企業です。時価総額の順位と、量産能力や製品市場のシェアは分けて確認します。" },
            { label: "10位", title: "Intel｜IDM・ファウンドリ", body: "自社製品の設計・製造に加え、外部顧客向けの製造事業にも取り組みます。製品事業と受託製造の両面を分けて見ると整理しやすくなります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "business-models",
      heading: "ファブレス、ファウンドリ、IDM、製造装置の違い",
      lead: "半導体を設計・製造する企業に加え、装置、検査・計測、設計ソフト、後工程、材料の企業も対象です。",
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
          type: "link-callout",
          title: "企業同士の役割と工程のつながりを見る",
          description: "設計・製造・装置・材料など、代表企業の位置づけを業界マップで確認できます。",
          label: "半導体業界マップを見る",
          href: "/industry-map",
          ctaLocation: "world_ranking_after_table",
        },
        {
          type: "note",
          title: "分類は主な役割へ単純化",
          body: "複数事業を持つ企業があります。Broadcomにはインフラソフトウェア、Samsung Electronicsには半導体以外の事業、IntelにはIDMとファウンドリの両面があります。本表はキャリア研究の入口として主な役割へ整理したものです。",
        },
      ],
      paragraphs: [],
    },
    {
      id: "what-is-market-cap",
      heading: "時価総額とは｜売上高・利益との違いと使い分け",
      lead: "時価総額は、株価に発行済株式数を掛けた、株式市場における企業価値の目安です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "指標",
          rightLabel: "分かること・使う場面",
          rows: [
            { left: "時価総額", right: "企業全体への市場評価。株価や為替で動き、将来の成長期待も反映される場合がある" },
            { left: "売上高", right: "一定期間の事業規模。企業全体か半導体部門か、対象期間・範囲・通貨をそろえて比較する" },
            { left: "利益", right: "売上高から費用を差し引いた成果。時価総額や保有現金とは異なる" },
          ],
        },
        {
          type: "link-callout",
          title: "業績と見通しも合わせて確認する",
          description: "主要12社の売上・利益・前年比と次回決算予定を一覧で確認できます。",
          label: "主要12社の決算一覧を見る",
          href: "/semiconductor-watch/earnings",
          ctaLocation: "world_ranking_after_table",
        },
      ],
      paragraphs: [
        "時価総額が最大でも、売上高、工場数、従業員数が最大とは限りません。総合企業では、半導体以外の事業への評価も含まれます。装置の事業規模なら装置売上、メモリの市場構成ならDRAM・NAND別の売上シェアへ進むと、目的に合う比較ができます。",
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
            { label: "AI", title: "AI計算基盤に関わる企業が上位", body: "首位NVIDIAに加え、ネットワーク半導体のBroadcom、CPU・GPUのAMD、メモリのMicronとSK hynixが上位7社に入っています。企業ごとの役割は、設計・受託製造・装置などの分類とあわせて確認できます。" },
            { label: "ROLE", title: "設計企業と製造企業が同時に評価", body: "1位のNVIDIAはファブレス、2位のTSMCはファウンドリです。製造を持たない設計企業と、顧客製品を量産する製造企業が隣り合い、分業による産業構造が順位へ表れています。" },
            { label: "REGION", title: "TOP30のうち14社が米国企業", body: "本社所在地ベースでは米国が14社です。中国と台湾が各4社、韓国・日本・オランダが各2社、英国とドイツが各1社でした。製造拠点や売上地域は本社所在地と一致するとは限りません。" },
            { label: "JAPAN", title: "日本は装置・検査領域が目立つ", body: "世界TOP30に入った日本企業は東京エレクトロンとアドバンテストで、どちらも装置関連です。日本18社ではTOWAや日本マイクロニクスも加わり、9社が製造装置または検査・計測装置です。材料のSUMCOやMARUWA、設計のソシオネクスト、商社のトーメンデバイスなど、役割の違いも読み取れます。" },
          ],
        },
      ],
      paragraphs: [
        "10月1日版との比較では、NXPが28位でTOP30に入り、Astera Labsは31位で対象外になりました。NXPは車載・産業・IoT向けの半導体、30位のUMCは受託製造を担い、同じ時価総額表でも役割は異なります。",
        "これらは2026年10月16日基準・10月17日確認の構成です。株価変動で順位は入れ替わります。また、現在の時価総額から将来の株価、売上、採用数を予測することはできません。",
      ],
    },
    {
      id: "compare-by-field",
      heading: "製造装置・メモリ・光半導体を分野別に比較する",
      lead: "知りたいのが企業全体の評価額ではなく、特定分野の規模や製品なら、比較対象と指標を分けて見ます。",
      paragraphs: [],
      blocks: [{ type: "links", items: [
        { label: "日本の半導体関連10社の時価総額推移", href: "/guides/japan-semiconductor-market-cap-history", description: "2010〜2025年の固定10社を比較。現在の日本18社ランキングとは異なる、長期の変化を読む" },
        { label: "NVIDIAとIntelの時価総額推移", href: "/guides/nvidia-intel-market-cap-history", description: "16年の年末値から2社の評価額と大小関係の変化を見る" },
        { label: "半導体製造装置メーカーの売上高ランキング", href: "/guides/semiconductor-equipment-sales-ranking", description: "2025暦年の装置売上高で上位10社を比較。成膜・露光・検査など、扱う工程と製品を調べる" },
        { label: "メモリメーカーランキング｜DRAM・NANDの売上シェア", href: "/guides/memory-manufacturer-ranking", description: "2026年4〜6月の製品市場別シェアを比較。DRAMとNANDを分け、企業全体の時価総額との違いを確認する" },
        { label: "光半導体メーカーを用途から比較する", href: "/guides/optical-semiconductor-manufacturers", description: "LED・レーザー・イメージセンサー・フォトダイオードの企業例を調べる。総合順位ではなく公式製品情報で比較する" },
      ] }],
    },
    {
      id: "research-flow",
      heading: "ランキングを企業研究へつなげる｜職種の接点と4ステップ",
      lead: "時価総額だけでは仕事内容、勤務地、働き方は分かりません。企業の役割と自分の経験の接点を見つけ、実際の求人で確かめます。",
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
            { label: "日本の勤務地から企業を探す", href: "/semiconductor-map", description: "都道府県・職種から国内拠点を確認。拠点の存在と現在の募集は分けて見ます" },
            { label: "自分の経験に近い半導体職種と、次の準備を整理する", href: "/career-compass", description: "Career Compassの12問・約3分で、工程改善・設備・品質などの経験と仕事の接点を確認。登録や氏名・連絡先の入力は不要です" },
            { label: "生産技術の経験とプロセス職を照合する", href: "/guides/production-engineering-to-semiconductor-process-engineer", description: "工程改善や量産対応の経験を、半導体の仕事でどう伝えるか整理する" },
            { label: "求人票の年収・待遇を読み比べる", href: "/guides/job-posting-salary-range", description: "年収レンジの上限だけで判断せず、固定給・変動報酬・働き方の確認項目をそろえる" },
            { label: "確認したいことが残ったら、相談先を比較する", href: "/career-agents", description: "希望勤務地での求人、担当業務、経験の伝え方など、相談内容に合うサービスの特徴を見る" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "industry-map-books",
      heading: "業界全体を見渡したいときに読む2冊",
      lead: "私は『日経業界地図』と『「会社四季報」業界地図』を毎年読んでいて、2027年版も読みました。どちらも業界の全体像を視覚的につかめるところが好きです。",
      blocks: [
        { type: "moshimo-book-link", product: "nikkei-industry-map-2027" },
        { type: "moshimo-book-link", product: "shikiho-industry-map-2027" },
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
            { question: "世界で時価総額が最も大きい半導体企業は？", answer: "2026年10月16日基準ではNVIDIAで、約5.17兆ドルです。基準日時点の値であり、リアルタイムの時価総額ではありません。" },
            { question: "日本で時価総額が最も大きい半導体関連企業は？", answer: "東京エレクトロンです。同じデータセットで日本1位、世界20位の半導体製造装置メーカーです。" },
            { question: "NVIDIAとTSMCは何が違う？", answer: "NVIDIAはGPUなどを設計するファブレス、TSMCは顧客の設計を製造するファウンドリです。設計と製造を分担します。" },
            { question: "半導体製造装置メーカーもランキングに含まれる？", answer: "含まれます。ASML、Applied Materials、東京エレクトロンなど、基準カテゴリに含まれる装置企業も対象です。" },
            { question: "時価総額と売上高の違いは？", answer: "時価総額は株式市場での企業評価、売上高は一定期間に商品やサービスを販売して得た収益です。" },
            { question: "時価総額が大きい企業ほど転職先としておすすめ？", answer: "一概には言えません。仕事内容や勤務地、働き方は時価総額から分からないため、経験との接点と実際の求人を確認します。" },
            { question: "Rapidusなど未上場企業が入っていないのはなぜ？", answer: "上場株式の価格による時価総額を比較できないためです。未上場企業には推定値を付けていません。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "sources-method",
      heading: "出典・調査方法とデータ更新日",
      lead: "ランキングと参考のトヨタ自動車は2026年10月16日基準、データ確認日は10月17日です。基準日・確認日・記事の編集更新日を区別しています。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "確認項目",
          rightLabel: "集計・確認方法",
          rows: [
            { left: "対象と出典", right: "CompaniesMarketCapのSemiconductorsカテゴリに掲載された上場企業。未上場企業は対象外" },
            { left: "世界と日本", right: "世界上位30社を同時点で取得。日本18社は、同じカテゴリの全2ページから国・地域がJapanの企業を全件抽出" },
            { left: "順位と重複", right: "降順、順位の連続性、国・地域を確認。同一企業、二重上場、ADRと現地株式を別企業として数えない" },
            { left: "企業分類", right: "上位企業と日本企業は、各社の公式企業情報、IR、製品ページを優先して確認" },
          ],
        },
        {
          type: "note",
          title: "市場情報サービス間の差とTSMCの扱い",
          body: "NVIDIAは別の市場情報サービスとも照合していますが、取得時刻、為替、発行済株式数、ADRの扱いで差が生じます。TSMCもNYSEのADR価格だけを単純に掛けず、基準ソースが示す企業全体の時価総額を使用。表の行ごとに異なるサイトの値を混ぜていません。",
        },
      ],
      paragraphs: [
        "各市場の取引日・更新時刻や為替の反映には差があり、出典の株価データにも数分から数時間の遅延があり得ます。同じ基準日でも全社が同一時刻の値という意味ではありません。表は基準日時点のスナップショットで、リアルタイム値ではありません。数値の更新時は世界30社・日本18社と参考のトヨタ自動車を同じ基準日で差し替えます。",
        "本記事は半導体業界の構造と企業研究を目的とし、株式の購入・売却を推奨する投資助言ではありません。",
      ],
    }
  ],
  todayQuest: "ランキングから3社を選び、各社を「設計・製造・装置・後工程・材料」のどこに位置づけるか確認する",
  relatedGuideSlugs: [
    "semiconductor-silicon-wafer-manufacturers",
    "ic-chip-manufacturing-companies",
    "semiconductor-foundry",
    "semiconductor-career-start",
  ],
  relatedCompanyIds: ["nvidia", "tsmc", "tokyo-electron", "advantest"],
};

// Preserve incoming links when explanations are merged; these are not extra TOC entries.
export const semiconductorMarketCapRankingSectionAliases: Record<string, string[]> = {
  "what-is-market-cap": ["revenue-ranking"],
  "research-flow": ["career-view", "summary"],
  "sources-method": ["methodology"],
};
