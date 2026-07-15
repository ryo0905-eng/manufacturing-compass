import type { GuideArticle } from "@/content/guides/types";

export const semiconductorEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-equipment-manufacturers",
  title: "半導体製造装置メーカーとは？工程別の主要企業と仕事内容を初心者向けに図解",
  description:
    "半導体製造装置メーカーとは、成膜・露光・エッチング・洗浄・検査・テストなどの装置を開発する企業です。工程別の装置、国内外の代表企業、企業比較の見方、主な職種を初心者向けに図解します。",
  targetQuery: "半導体 製造装置 メーカー",
  searchIntent:
    "半導体製造装置メーカーが何を作る会社か、製造工程ごとの装置と国内外の主要企業、各社の製品領域、仕事内容を初心者向けに理解したい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Search Consoleに表示された装置企業名の組み合わせを起点に、公的資料と各社の公式製品情報で工程別の担当領域を照合しました。市場シェアや企業の優劣ではなく、装置が製造フローのどこで使われるかを説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "Search Consoleに『ASM 東京エレクトロン』『アドバンテスト テラダイン 比較』『アプライドマテリアルズ 強み』などの検索クエリが表示されたことを確認",
    "個別企業の比較記事を増やす前に、工程と装置企業を対応づける基礎ハブが必要だと判断",
    "経済産業省の資料と、国内外の装置メーカー各社が公開する製品情報で担当工程を照合",
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
      title: "Products and Services",
      url: "https://www.tel.com/product/all/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Products",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Our Processes",
      url: "https://www.lamresearch.com/products/our-processes/",
      publisher: "Lam Research",
      accessedAt: "2026-07-16",
    },
    {
      title: "ASML Products and Services",
      url: "https://www.asml.com/en/products",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "Technology and Products",
      url: "https://www.asm.com/our-technology-products/silicon-carbide",
      publisher: "ASM International",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products",
      url: "https://www.screen.co.jp/spe/en/products",
      publisher: "SCREEN Semiconductor Solutions",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products",
      url: "https://www.kla.com/products",
      publisher: "KLA",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Equipment",
      url: "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/",
      publisher: "Hitachi High-Tech",
      accessedAt: "2026-07-16",
    },
    {
      title: "Our Technology In-Depth: Semiconductor Test",
      url: "https://www.advantest.com/en/about/business/",
      publisher: "Advantest",
      accessedAt: "2026-07-16",
    },
    {
      title: "Automated Test Equipment",
      url: "https://www.teradyne.com/automated-test-equipment/",
      publisher: "Teradyne",
      accessedAt: "2026-07-16",
    },
    {
      title: "Business",
      url: "https://www.disco.co.jp/eg/ir/mginfo/bg_business.html",
      publisher: "DISCO",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "東京エレクトロン、ASML、アドバンテストなどの名前を見ても、同じ半導体製造装置メーカーなのに何が違うのか分かりにくくありませんか。",
    conclusion:
      "半導体製造装置メーカーは、ウェーハへ膜を作る、回路を転写する、不要部分を除く、欠陥を測る、完成品を試験するなど、工程ごとに異なる装置を提供します。企業比較では会社全体の規模より先に、担当工程と装置の役割を確認します。",
    learnings:
      "半導体製造装置メーカーの意味、工程別の装置、国内外の代表企業、ASMと東京エレクトロンなどの製品領域、装置企業の比較方法、主な職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "Search Consoleには、装置企業どうしを組み合わせた検索語が出てきました。先に工程別の地図があれば、二社が本当に同じ市場で比べられるのか判断しやすいと考え、装置メーカーの基礎ハブを作りました。",
      caption: "この記事を作成した理由",
    },
    {
      type: "process-flow",
      title: "設計データが半導体になるまでを、装置がつなぐ",
      description:
        "実際の製造では各工程を何度も繰り返し、途中で洗浄・計測・搬送を挟みます。ここでは装置企業を理解するために大きく整理しています。",
      stages: [
        { label: "01 / FORM", title: "膜・材料を作る", body: "成膜、熱処理、イオン注入などで材料と電気特性を作る" },
        { label: "02 / PATTERN", title: "回路を転写する", body: "塗布・現像と露光で加工位置を決める" },
        { label: "03 / SHAPE", title: "形を加工する", body: "エッチング、CMP、洗浄で必要な構造と表面を作る" },
        { label: "04 / CONTROL", title: "検査・計測する", body: "欠陥、寸法、膜厚、重ね合わせを測り、工程へ戻す" },
        { label: "05 / FINISH", title: "個片化・組立・試験", body: "切断、研削、接合、パッケージング、電気試験へつなぐ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置分野",
      rightLabel: "代表的な企業例",
      rows: [
        { left: "成膜・熱処理", right: "Applied Materials、Lam Research、東京エレクトロン、ASMなど" },
        { left: "露光・塗布現像", right: "ASML、東京エレクトロン、SCREENなど" },
        { left: "エッチング・洗浄", right: "Lam Research、東京エレクトロン、Applied Materials、SCREEN、日立ハイテクなど" },
        { left: "検査・計測", right: "KLA、日立ハイテク、Applied Materialsなど" },
        { left: "半導体テスト", right: "アドバンテスト、Teradyneなど" },
        { left: "切断・研削・研磨", right: "DISCOなど" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "半導体製造装置メーカーとは、製造工程を成立させる装置企業",
      lead: "半導体工場は、一台の機械だけでウェーハからICを完成させるわけではありません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PROCESS", title: "材料を加工する", body: "真空、プラズマ、光、熱、薬液、機械加工などを使ってウェーハを変化させます。" },
            { label: "CONTROL", title: "再現性を保つ", body: "温度、圧力、流量、位置、時間などを制御し、同じ処理を量産で繰り返します。" },
            { label: "DATA", title: "状態を測って戻す", body: "装置状態と検査結果を記録し、異常検知、保全、工程改善へつなげます。" },
          ],
        },
        {
          type: "note",
          title: "装置メーカーと半導体メーカーは役割が違う",
          body: "装置メーカーは製造手段を開発・提供し、IDMやファウンドリなどの半導体メーカーが複数企業の装置、材料、工程条件を組み合わせて製品を量産します。装置メーカーが半導体製品そのものを販売するとは限りません。",
        },
      ],
      paragraphs: [
        "経済産業省の人材育成資料は、製造装置メーカーを各製造工程に特化した装置を開発・製造する企業と説明しています。前工程、後工程、検査のそれぞれに装置があり、工程ごとに代表的なメーカーが異なります。",
        "一つの企業が複数工程を扱う場合も、一つの工程へ集中する場合もあります。さらに装置本体だけでなく、ソフトウェア、プロセス支援、保守、部品、改造、データ解析まで提供範囲が広がるため、企業名だけで仕事内容を決めつけないことが重要です。",
      ],
    },
    {
      id: "front-end-equipment",
      heading: "前工程の装置メーカーは、膜・パターン・形状を作る",
      lead: "ウェーハ上へ回路を形成する前工程では、異なる物理・化学現象を使う装置が連携します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・装置",
          rightLabel: "役割と企業例",
          rows: [
            { left: "成膜・エピタキシー・熱処理", right: "薄膜や結晶層を作り、材料特性を整える。Applied Materials、Lam Research、東京エレクトロン、ASMなど" },
            { left: "塗布・現像", right: "感光材料を塗り、露光後にパターンを現す。東京エレクトロン、SCREENなど" },
            { left: "露光", right: "フォトマスクの回路パターンをウェーハへ転写する。ASMLなど" },
            { left: "エッチング", right: "マスクに沿って膜や基板の不要部分を除く。Lam Research、東京エレクトロン、Applied Materials、日立ハイテクなど" },
            { left: "洗浄", right: "粒子、残渣、汚染を除き、次工程に適した表面へ整える。SCREEN、東京エレクトロン、Lam Researchなど" },
            { left: "CMP・イオン注入", right: "表面を平坦化し、必要な元素を導入する。Applied Materialsなど複数の専門企業が装置を提供" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンは成膜、塗布・現像、エッチング、洗浄に加え、テストや3D実装関連まで公式製品ページで案内しています。Applied Materialsは材料形成、材料除去、材料改質、解析という広い分類で、成膜、CMP、エッチング、イオン注入、熱処理、検査などを展開しています。",
        "Lam Researchは成膜、プラズマエッチング、レジスト除去、洗浄を主要プロセスとして示し、ASMはALD、エピタキシー、PECVD、縦型炉など成膜・熱処理領域を案内しています。同じ『前工程装置メーカー』でも、製品の幅と重点工程が異なります。",
      ],
    },
    {
      id: "inspection-test-backend",
      heading: "検査・テスト・後工程の装置は、品質確認と製品化を支える",
      lead: "加工する装置だけでなく、測る、選別する、薄くする、切り分ける装置も量産に欠かせません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "INSPECTION", title: "欠陥検査・計測", body: "欠陥、寸法、膜厚などを測り、工程変動を早く見つける。KLA、日立ハイテクなど。" },
            { label: "TEST", title: "半導体テスト", body: "電気信号を与えて機能・性能を判定する。アドバンテスト、Teradyneなど。" },
            { label: "SINGULATION", title: "切断・研削・研磨", body: "ウェーハを薄くし、個々のダイへ切り分ける。DISCOなど。" },
          ],
        },
      ],
      paragraphs: [
        "KLAは欠陥検査・レビュー、計測、装置内プロセス管理などを製品群として示し、日立ハイテクはエッチング装置に加えてCD-SEMやウェーハ表面検査装置を案内しています。検査・計測データは合否判定だけでなく、前の工程へ改善を返すために使われます。",
        "アドバンテストとTeradyneは、ロジック、メモリ、アナログ、RF、パワーなどを電気試験するATEを提供します。DISCOは切断、研削、研磨の装置と加工ツールを扱います。前工程後のウェーハが完成品になるまでにも、役割の異なる装置企業が関わります。",
      ],
    },
    {
      id: "companies",
      heading: "半導体製造装置の代表企業11社",
      lead: "ランキングではなく、各社の公式情報から確認できる主な担当領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主な装置・工程領域",
          rows: [
            { left: "東京エレクトロン｜日本", right: "成膜、塗布・現像、エッチング、洗浄、ウェーハプローバ、3D実装関連" },
            { left: "Applied Materials｜米国", right: "成膜、CMP、エッチング、イオン注入、熱処理、検査・プロセス制御" },
            { left: "Lam Research｜米国", right: "成膜、プラズマエッチング、レジスト除去、洗浄、計測" },
            { left: "ASML｜オランダ", right: "EUV・DUV露光、計測・検査、計算リソグラフィ" },
            { left: "ASM International｜欧州", right: "ALD、エピタキシー、PECVD、縦型炉などの成膜・熱処理" },
            { left: "SCREEN｜日本", right: "洗浄、塗布・現像、熱処理、計測・検査、先端パッケージ関連" },
            { left: "KLA｜米国", right: "欠陥検査、計測、装置内管理、レチクル・パッケージ検査" },
            { left: "日立ハイテク｜日本", right: "ドライエッチング、CD-SEM、ウェーハ表面・欠陥検査" },
            { left: "アドバンテスト｜日本", right: "SoC・メモリ・パワー向けATE、ハンドラ、インターフェース、データ解析" },
            { left: "Teradyne｜米国", right: "ロジック、RF、アナログ、パワー、ミックスドシグナル、メモリ向けATE" },
            { left: "DISCO｜日本", right: "ダイシング、研削、研磨の装置と精密加工ツール" },
          ],
        },
        {
          type: "note",
          title: "企業一覧は網羅的な順位表ではない",
          body: "半導体製造装置には、搬送、真空、ガス供給、温度制御、パッケージ組立など、ここに載せていない多くの企業と部品メーカーも関わります。掲載企業は、Search Consoleで観測した企業とサイト内の主要企業ページを中心にした代表例です。",
        },
      ],
      paragraphs: [
        "同じ会社でも事業買収や製品追加によって担当範囲は変わります。また、装置カテゴリー名が同じでも、対象デバイス、材料、ウェーハサイズ、前工程・後工程、研究開発・量産で用途が異なります。",
        "企業研究では『成膜装置メーカー』のような大分類で終わらず、どの成膜方式や製品用途を扱うか、装置本体以外にプロセス支援・保守・ソフトウェアをどこまで提供するかを最新の公式情報で確認してください。",
      ],
    },
    {
      id: "query-comparisons",
      heading: "企業名を比較するときは、同じ工程と製品範囲を確認する",
      lead: "Search Consoleに出てきた企業名の組み合わせも、工程へ置くと違いが見えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "検索された組み合わせ",
          rightLabel: "最初に確認する違い",
          rows: [
            { left: "ASM × 東京エレクトロン", right: "両社とも成膜領域を持つ。ASMはALD・エピタキシーなど、東京エレクトロンは成膜に加えて塗布現像・エッチング・洗浄なども確認する" },
            { left: "アドバンテスト × Teradyne", right: "両社とも半導体ATEを持つ。対象デバイス、テストプラットフォーム、周辺機器、ソフトウェア、顧客支援で比較する" },
            { left: "Applied Materialsの特徴", right: "成膜だけでなく、除去、改質、CMP、イオン注入、熱処理、解析まで公式製品ポートフォリオの広がりを見る" },
          ],
        },
      ],
      paragraphs: [
        "会社全体を単純に『どちらが上か』で比べると、担当工程の違いを見落とします。まず共通する製品カテゴリーを一つ選び、その製品が対象とするデバイス、材料、量産課題、サービス範囲を揃えて比べます。",
        "転職先として比較する場合は、製品比較だけでは不十分です。募集職種、勤務地、担当顧客、開発・製造・フィールドのどこへ所属するかで仕事内容が変わるため、個別求人と公式採用情報を別に確認する必要があります。",
      ],
    },
    {
      id: "company-research",
      heading: "装置メーカーを比較する6つの視点",
      lead: "売上や知名度の前に、装置が生み出す価値と仕事の現場を見ます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PROCESS", title: "担当工程", body: "成膜、露光、エッチング、洗浄、計測、テスト、個片化のどこか。" },
            { label: "DEVICE", title: "対象デバイス", body: "ロジック、メモリ、アナログ、パワー、センサー、先端パッケージのどこか。" },
            { label: "VALUE", title: "装置の評価軸", body: "加工・測定性能だけでなく、生産性、稼働率、再現性、コスト、安全性を見る。" },
            { label: "MODEL", title: "収益とサービス", body: "新品装置、保守、部品、改造、ソフトウェア、プロセス支援の構成を見る。" },
            { label: "CUSTOMER", title: "顧客との接点", body: "研究開発、量産立ち上げ、常駐保守、遠隔支援のどこで協働するか。" },
            { label: "LOCATION", title: "開発・製造・サービス拠点", body: "同じ企業でも拠点により職種と扱う製品が異なる。" },
          ],
        },
      ],
      paragraphs: [
        "半導体装置は高い加工性能だけでなく、量産で安定して動き、異常時に早く復旧し、次世代工程へ更新できることが求められます。そのため企業の価値は装置本体、プロセス知識、ソフトウェア、サービス体制の組み合わせで考えます。",
        "市場シェアや売上順位は調査範囲と時点で変わります。この記事では順位を固定せず、製品領域の理解へ集中しています。数字を使う判断では、各社の最新IRと同じ定義・期間の市場資料を確認してください。",
      ],
    },
    {
      id: "roles",
      heading: "半導体製造装置メーカーの主な職種",
      lead: "機械・電気・ソフトウェアだけでなく、半導体プロセスと顧客工場を理解する仕事があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・機能",
          rightLabel: "主な役割",
          rows: [
            { left: "機械・電気・制御設計", right: "真空、搬送、温調、電源、センサー、駆動、制御などを装置仕様へ統合する" },
            { left: "プロセスエンジニア", right: "装置で材料を加工・測定し、顧客のデバイス要件に合うプロセス性能を作る" },
            { left: "ソフトウェア・データ", right: "装置制御、UI、通信、ログ解析、異常検知、予防保全などを開発する" },
            { left: "フィールドエンジニア", right: "顧客工場で据付、立ち上げ、保守、改造、トラブル対応を行う" },
            { left: "生産技術・品質", right: "装置と部品の製造、工程設計、サプライヤー品質、出荷品質を支える" },
            { left: "営業・アプリケーション", right: "顧客要求を整理し、装置提案、評価計画、導入後の技術支援をつなぐ" },
          ],
        },
      ],
      paragraphs: [
        "求人を見るときは会社名だけでなく、担当製品、勤務地、顧客先作業の有無、開発か量産支援か、海外連携、オンコールや出張の条件を確認します。同じフィールドエンジニアでも、装置と顧客工場によって働き方が変わります。",
        "製造業での装置保全、機械・電気設計、制御、品質、生産技術、データ解析、顧客対応は接点を整理しやすい経験です。まず担当した設備や製品を、再現性、稼働率、品質、安全、復旧、コストのどこへ貢献したか言語化すると準備できます。",
      ],
    },
    {
      id: "summary",
      heading: "装置メーカーは、工程別に見ると違いが分かる",
      lead: "最後に、初心者が押さえたい要点を整理します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "ROLE", title: "製造手段を提供する", body: "加工・測定・搬送・試験を量産で再現する装置とサービスを作る。" },
            { label: "MAP", title: "工程で企業を分類する", body: "成膜、露光、エッチング、洗浄、検査、テスト、個片化へ置いて比べる。" },
            { label: "RESEARCH", title: "製品と職種を分けて見る", body: "企業の製品領域を理解したうえで、個別求人の拠点・担当・働き方を確認する。" },
          ],
        },
        {
          type: "faq",
          items: [
            { question: "半導体製造装置メーカーとは何ですか？", answer: "成膜、露光、エッチング、洗浄、検査、テストなど、半導体の製造工程で使う装置と関連サービスを開発・製造・提供する企業です。" },
            { question: "日本の主な半導体製造装置メーカーは？", answer: "この記事では東京エレクトロン、SCREEN、日立ハイテク、アドバンテスト、DISCOを代表例として紹介しています。このほかにも工程・部品ごとに多くの企業があり、網羅的な順位表ではありません。" },
            { question: "東京エレクトロンとASMLの違いは？", answer: "ASMLはEUV・DUVなどの露光システムを中心に展開します。東京エレクトロンは塗布・現像、成膜、エッチング、洗浄など複数工程の装置を持ちます。リソグラフィ工程では両社の装置が前後でつながります。" },
            { question: "ASMと東京エレクトロンの違いは？", answer: "両社とも成膜領域を持ちます。ASMはALDやエピタキシーなどを公式製品領域として示し、東京エレクトロンは成膜に加えて塗布・現像、エッチング、洗浄、テストなども展開しています。個別製品では対象プロセスを揃えて比較します。" },
            { question: "アドバンテストとTeradyneは何を作る会社ですか？", answer: "両社とも半導体へ電気信号を与え、機能や性能を判定するATEを提供しています。対象デバイス、プラットフォーム、周辺機器、ソフトウェア、サービス範囲を確認すると違いを整理できます。" },
            { question: "装置メーカーではどんな人が働きますか？", answer: "機械・電気・制御設計、プロセス、ソフトウェア、フィールドサービス、生産技術、品質、営業技術などが働きます。担当装置と拠点によって仕事内容が変わります。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置の企業一覧", href: "/segments/equipment", description: "国内外の装置企業と企業詳細ページを見る" },
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "設計から前工程・後工程までの流れを見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像と装置のつながりを見る" },
            { label: "成膜工程", href: "/guides/semiconductor-deposition-process", description: "CVD・PVD・ALDの違いと仕組みを見る" },
            { label: "エッチング工程", href: "/guides/semiconductor-etching-process", description: "ウェット・ドライ加工の仕組みを見る" },
            { label: "検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・寸法・膜厚を測る工程を見る" },
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "テスタ・プローバ・プローブカードの役割を見る" },
            { label: "Career Compass", href: "/career-compass", description: "製造業経験に近い装置・半導体職種を整理する" },
          ],
        },
      ],
      paragraphs: [
        "装置企業を調べるときは、まずその会社の製品を半導体製造フローへ置いてください。工程が分かれば、競合企業、顧客課題、必要な技術、求人の仕事内容を同じ地図の上で比較できるようになります。",
      ],
    },
  ],
  todayQuest: "気になる装置企業を1社選び、扱う装置を成膜・露光・エッチング・洗浄・検査・テスト・個片化のどこへ置けるか確認する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "photolithography-process",
    "semiconductor-deposition-process",
    "semiconductor-inspection-metrology",
    "semiconductor-wafer-test",
    "semiconductor-market-cap-ranking",
  ],
  relatedCompanyIds: [
    "tokyo-electron",
    "applied-materials",
    "lam-research",
    "asml",
    "screen",
    "kla",
    "hitachi-hightech",
    "advantest",
    "teradyne",
    "disco",
  ],
};
