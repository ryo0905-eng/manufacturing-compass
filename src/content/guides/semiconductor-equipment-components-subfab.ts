import type { GuideArticle } from "@/content/guides/types";

export const semiconductorEquipmentComponentsSubfabGuide: GuideArticle = {
  slug: "semiconductor-equipment-components-subfab",
  title: "半導体製造装置の部品・サブファブメーカーとは？ガス・真空・搬送を初心者向けに図解",
  description:
    "半導体製造装置を支えるMFC、バルブ、真空ポンプ、除害装置、EFEM、RF電源、圧力制御、チラー、静電チャック、形状計測について、チャンバー前後の接続と主要メーカーを図解します。",
  targetQuery: "半導体 製造装置 部品 メーカー",
  searchIntent:
    "半導体製造装置を構成する部品・周辺機器とサブファブ設備には何があり、ガス供給、ウェーハ搬送、プロセスチャンバー、真空排気、除害、温調、計測がどう接続されるか、代表的なメーカーと仕事を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "HORIBA STEC、フジキン、MKS、荏原製作所、Edwards Vacuum、ローツェ、平田機工、KLA、Corning Tropelなどの公式製品・技術情報をもとに、ウェーハ搬送、ガス供給、反応・温調、真空排気、排ガス処理、計測・制御の接続関係へ整理しました。部品単体の最高仕様や市場順位ではなく、工程装置の中で何を入力し、何を制御し、どこへ出力するかを説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "工程別の製造装置メーカー記事に加え、MFC、真空ポンプ、除害、EFEM、ウェーハ形状計測の記事がそろい、装置内部・周辺の横断地図が必要だと判断",
    "ガスの供給から排気処理までと、FOUPからプロセス室までのウェーハ搬送を、同じ装置断面の中で接続する構成に整理",
    "今後追加するRF電源、圧力制御、バルブ・継手、チラー、静電チャックの記事が接続できるハブとして設計",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Mass Flow Controller & Module - Semiconductor Products",
      url: "https://www.horiba.com/fra/semiconductor/products/mass-flow-controller-and-module/",
      publisher: "HORIBA, Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ultra-High Purity Integrated Gas Supply System",
      url: "https://www.fujikin.co.jp/ja/support/mono-japan/igs.html",
      publisher: "Fujikin Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "MKS Instruments",
      url: "https://www.mks.com/b/mks-instruments",
      publisher: "MKS Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Equipment Market",
      url: "https://ebara.com/global-en/precision/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Vacuum and Abatement Solutions",
      url: "https://www.edwardsvacuum.com/en-us/semiconductor",
      publisher: "Edwards Vacuum",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Handling System",
      url: "https://www.rorze.com/en/products_category/wafer-transfer-system/",
      publisher: "RORZE Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Related Equipment",
      url: "https://www.hirata.co.jp/en/products/semiconductor",
      publisher: "Hirata Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Tropel Wafer Analysis Systems",
      url: "https://www.corning.com/worldwide/en/products/advanced-optics/product-materials/analytic-instruments/metrology-instruments/tropel-wafer-analysis-systems.html",
      publisher: "Corning Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Geometry Metrology",
      url: "https://ir.kla.com/news-events/press-releases/detail/350/kla-tencor-introduces-complete-measurement-solution-for",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "半導体製造装置を調べると、成膜装置やエッチング装置の会社だけでなく、MFC、バルブ、真空ポンプ、除害、EFEM、RF電源、チラーなど多数の企業が出てきます。どこからが装置本体で、どこからが部品・周辺設備なのか分かりにくくありませんか。",
    conclusion:
      "半導体製造装置は、プロセスチャンバーだけでは動きません。ウェーハを運ぶ系、ガス・液体を入れる系、圧力・プラズマ・温度を作る系、使用後のガスを引いて処理する系、状態を測る系が接続されて初めて量産装置になります。部品メーカーを見るときは、装置内の位置、入力と出力、制御対象、前後機器、量産停止への影響を確認します。",
    learnings:
      "装置本体・コンポーネント・サブファブの違い、ウェーハ経路、ガス経路、排気経路、電力・温調・計測、主要部品カテゴリー、代表企業、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私は半導体製造装置を、巨大な一台の機械ではなく、ウェーハ・ガス・電力・熱・排気・データという複数の流れを同期させるシステムとして見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜ガスがプロセス室へ入り、排気処理されるまで",
      description:
        "真空を使う成膜・エッチング装置などを単純化した流れです。工程と装置方式により構成は異なります。",
      stages: [
        { label: "01 / SUPPLY", title: "材料ガスを供給する", body: "容器・バルク設備、圧力調整器、精製器、バルブ、配管で高純度ガスを装置へ送る" },
        { label: "02 / CONTROL", title: "流量を決める", body: "MFC・流量制御モジュールがレシピ設定に合わせ、ガス量と切替波形を制御する" },
        { label: "03 / PROCESS", title: "反応条件を作る", body: "チャンバー、RF電源、マッチング、静電チャック、ヒーター、チラーがプラズマ・温度・保持を作る" },
        { label: "04 / PRESSURE", title: "圧力を制御する", body: "真空計、圧力センサ、スロットル弁、高真空ポンプが必要な圧力・滞留時間を作る" },
        { label: "05 / EXHAUST", title: "ガスを圧縮・移送する", body: "ドライ真空ポンプ、加熱配管、パージ、トラップが排気と副生成物を下流へ送る" },
        { label: "06 / ABATE", title: "排ガスを処理する", body: "除害装置が燃焼・プラズマ・湿式・乾式などでガスを処理し、粉・液・排出を管理する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置を通るもう一つの流れ",
      rightLabel: "主な部品・装置",
      rows: [
        { left: "ウェーハを工場から受け取る", right: "FOUP、OHT受渡し、ロードポート、ID・スロットマッピング" },
        { left: "大気側で一枚ずつ運ぶ", right: "EFEM、大気搬送ロボット、アライナ、FFU、ハンド" },
        { left: "大気と真空を切り替える", right: "ロードロック、真空弁、真空ポンプ、圧力センサ" },
        { left: "真空中で処理室へ運ぶ", right: "真空ロボット、トランスファーチャンバー、ゲートバルブ" },
        { left: "処理位置で保持・温調する", right: "静電チャック、セラミックヒーター、冷却流路、温度センサ" },
        { left: "処理後に測って戻す", right: "装置内計測、ウェーハ形状・膜厚・CD・欠陥計測、搬送・FOUP" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "装置本体・コンポーネント・サブファブは、設置場所より役割で分ける",
      lead: "企業によって製品の境界と呼び方は異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "分類",
          rightLabel: "この記事での整理",
          rows: [
            { left: "プロセス装置", right: "成膜、エッチング、洗浄、露光、CMP、検査など、ウェーハへ主な処理・測定を行う装置" },
            { left: "装置コンポーネント", right: "MFC、バルブ、RF電源、真空計、圧力制御弁、ロボット、チャック、ヒーターなど、装置へ組み込まれる機能部品" },
            { left: "モジュール・サブシステム", right: "ガスボックス、EFEM、ロードロック、真空搬送、温調ユニットなど、複数部品を統合した機能単位" },
            { left: "サブファブ設備", right: "クリーンルーム床下・隣接エリアなどで真空ポンプ、除害、排気配管、監視・保守を担う設備群" },
            { left: "工場ユーティリティ", right: "電力、冷却水、超純水、バルクガス、排水、排気、空調など複数装置を支える工場設備" },
            { left: "計測・データ基盤", right: "ウェーハと装置状態を測り、装置制御、工程制御、保全、品質判断へデータを返す" },
          ],
        },
        {
          type: "note",
          title: "サブファブは、単に地下へ置かれた装置という意味ではない",
          body: "一般にはプロセス装置を下流・周辺から支える真空、除害、排気、温調、監視・保守などの領域を指します。工場レイアウトや企業の定義により含む範囲が異なるため、具体的な設備名で確認します。",
        },
      ],
      paragraphs: [
        "荏原は半導体向けにCMP装置だけでなくドライ真空ポンプと排ガス処理装置を、Edwardsは真空・除害・統合サブファブとサービスを公式に展開しています。",
        "MKSは流量、圧力・真空、ガス・蒸気供給、RF・マイクロ波など複数カテゴリーを扱います。同じ企業が装置内とサブファブの両方へ製品を供給する場合があります。",
      ],
    },
    {
      id: "flows",
      heading: "部品の全体像は、ウェーハ・材料・エネルギー・排気・データの流れで見る",
      lead: "部品名を暗記するより、何を運び何を制御するかで整理します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "WAFER", title: "ウェーハ経路", body: "FOUP、ロードポート、EFEM、大気・真空ロボット、アライナ、ロードロック、チャックが位置と向きを保って運びます。" },
            { label: "MATERIAL", title: "材料経路", body: "ガス・液体の容器、精製、圧力調整、バルブ、MFC、気化器、配管が材料を清浄・正確に届けます。" },
            { label: "ENERGY", title: "電力・熱の経路", body: "RF・マイクロ波、直流電源、ヒーター、ランプ、レーザー、チラー、冷却水が反応エネルギーと温度を作ります。" },
            { label: "EXHAUST", title: "真空・排気経路", body: "真空計、圧力制御弁、ターボ・ドライポンプ、加熱配管、トラップ、除害が圧力と安全な排出を支えます。" },
            { label: "SENSE", title: "計測経路", body: "温度、圧力、流量、RF、光、質量、位置、振動、ウェーハ形状・膜・欠陥のセンサが状態を数値化します。" },
            { label: "DATA", title: "制御・データ経路", body: "装置制御、インターロック、レシピ、SECS/GEM、状態監視、予知保全、工程制御が各部品を同期させます。" },
          ],
        },
      ],
      paragraphs: [
        "一つの部品が複数の流れへ関わることもあります。例えばMFCは材料を流すだけでなく、設定値・実流量・弁開度・診断値を制御系へ返します。",
        "ウェーハ形状計測は加工部品ではありませんが、基板の厚さ・反り・局所平坦度を測り、搬送、保持、露光、研磨、接合の条件判断へつなぐ支援装置です。",
      ],
    },
    {
      id: "cluster",
      heading: "まず押さえたい5つの部品・サブファブ領域",
      lead: "現在公開している個別記事を、装置内の位置で整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "領域",
          rightLabel: "役割と個別記事",
          rows: [
            { left: "MFC・流量制御", right: "チャンバー上流でプロセスガス量を閉ループ制御する。熱式・圧力式、応答、高純度流路、診断を見る" },
            { left: "真空ポンプ", right: "チャンバー下流で圧力を作り、使用後のガスと副生成物を圧縮・移送する。高真空・ドライ・熱・パージを見る" },
            { left: "排ガス除害", right: "ポンプ排気を燃焼・プラズマ・湿式・乾式などで処理し、副生成物・排水・排出を管理する" },
            { left: "ウェーハ搬送・EFEM", right: "FOUPからウェーハを一枚ずつ取り出し、位置合わせして大気・真空の装置内部へ受け渡す" },
            { left: "ウェーハ形状計測", right: "厚さ、TTV、Bow、Warp、局所平坦度、エッジ形状を測り、基板・工程・搬送条件へ返す" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "マスフローコントローラーメーカー", href: "/guides/semiconductor-mass-flow-controller-manufacturers", description: "ガス流量を測定・制御するMFCの仕組みと企業を見る" },
            { label: "真空ポンプメーカー", href: "/guides/semiconductor-vacuum-pump-manufacturers", description: "高真空・ドライポンプと副生成物対策を見る" },
            { label: "排ガス除害装置メーカー", href: "/guides/semiconductor-exhaust-gas-abatement-manufacturers", description: "燃焼・プラズマ・湿式・乾式処理を見る" },
            { label: "ウェーハ搬送ロボット・EFEMメーカー", href: "/guides/semiconductor-wafer-handling-efem-manufacturers", description: "FOUPから装置内部までの搬送系を見る" },
            { label: "ウェーハ形状・平坦度測定装置メーカー", href: "/guides/semiconductor-wafer-geometry-metrology-manufacturers", description: "厚さ・TTV・Bow・Warpの測定を見る" },
          ],
        },
      ],
      paragraphs: [
        "この5領域は、特定の一工程だけでなく複数の前工程装置へ横断的に使われます。そのため工程装置メーカーとは異なる顧客、認定、保守、供給体制が見えてきます。",
        "個別企業を比較するときは、どの工程装置へ組み込まれ、装置メーカー・半導体工場・設備部門の誰が仕様を決めるかも確認します。",
      ],
    },
    {
      id: "next-components",
      heading: "次に押さえたい装置構成部品は、RF・圧力・バルブ・温調・ウェーハ保持",
      lead: "主要5カテゴリーの個別記事を、同じ装置断面へ接続します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "部品カテゴリー",
          rightLabel: "装置内での主な役割",
          rows: [
            { left: "RF電源・マッチングユニット", right: "高周波電力をプラズマへ送り、反射電力を抑えながら負荷変動へ追従する" },
            { left: "真空計・圧力制御バルブ", right: "チャンバー圧力を測り、排気コンダクタンスを変えてレシピ圧力へ合わせる" },
            { left: "高純度バルブ・継手・ガス供給機器", right: "ガスを漏らさず、汚さず、必要な経路へ切り替え、保守・パージできる流路を作る" },
            { left: "チラー・温度調節装置", right: "チャンバー、電極、チャック、光源、ポンプなどから熱を運び、温度を安定させる" },
            { left: "静電チャック・セラミックヒーター", right: "ウェーハを平らに保持し、加熱・冷却・裏面ガス・電気的条件をプロセスへ合わせる" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "RF電源・マッチングユニットメーカー", href: "/guides/semiconductor-rf-power-matching-manufacturers", description: "発振、インピーダンス整合、進行波・反射波、パルス、多周波と主要企業を見る" },
            { label: "真空計・圧力制御バルブメーカー", href: "/guides/semiconductor-vacuum-gauge-pressure-control-valve-manufacturers", description: "圧力測定、排気コンダクタンス、閉ループ制御と主要企業を見る" },
            { label: "高純度バルブ・ガス供給機器メーカー", href: "/guides/semiconductor-high-purity-valve-gas-supply-manufacturers", description: "遮断・切替・パージ・接続・集積化ガスシステムを見る" },
            { label: "チラー・温度調節装置メーカー", href: "/guides/semiconductor-chiller-temperature-control-manufacturers", description: "循環流体、熱交換、冷凍・加熱、結露・水質を見る" },
            { label: "静電チャック・セラミックヒーターメーカー", href: "/guides/semiconductor-electrostatic-chuck-ceramic-heater-manufacturers", description: "ウェーハ吸着、裏面ガス、加熱・冷却、RFと主要企業を見る" },
          ],
        },
        {
          type: "note",
          title: "個別部品の最適化だけでは、装置性能が上がらない場合がある",
          body: "MFC応答、チャンバー容積、バルブ切替、排気能力、圧力制御、RF、温度、ウェーハ保持は相互に影響します。部品評価と装置システム評価を分けて行います。",
        },
      ],
      paragraphs: [
        "MKSは公式製品群で流量、圧力・真空、バルブ、RF・マイクロ波、ガス・蒸気供給を展開しています。部品カテゴリーが装置内で連携する代表例です。",
        "各個別記事では、原理、装置内の位置、メーカー領域、比較条件を同じ型で整理しています。",
      ],
    },
    {
      id: "interfaces",
      heading: "装置の不具合は、部品と部品の境界で起きることがある",
      lead: "単品仕様と、接続後の挙動を分けて確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "主なインターフェース",
          rightLabel: "確認すること",
          rows: [
            { left: "ガス供給 × MFC", right: "供給圧力、圧力変動、パージ、バルブ切替、配管容積、ガス物性が流量波形へ与える影響" },
            { left: "MFC × チャンバー", right: "設定流量が入口でどう混合・分配され、反応位置・均一性・応答時間へつながるか" },
            { left: "チャンバー × 圧力制御 × ポンプ", right: "ガス負荷、バルブ開度、排気速度、配管、基底圧力、レシピ遷移が圧力へ与える影響" },
            { left: "ポンプ × 除害", right: "排気温度、圧力、パージ、濃度、副生成物、配管堆積、入口条件が処理性能へ与える影響" },
            { left: "ロボット × ハンド × ウェーハ", right: "反り、厚さ、裏面、エッジ、保持力、加速度、整定、受渡し位置が搬送成功へ与える影響" },
            { left: "チャック × 温調 × プロセス", right: "保持、裏面熱伝達、冷却・加熱、面内温度、RF・電位が反応・形状へ与える影響" },
            { left: "センサ × 制御ソフト", right: "校正、単位、時刻、サンプリング、フィルタ、異常値、通信遅延、変更管理をそろえる" },
          ],
        },
      ],
      paragraphs: [
        "単品試験で合格した部品も、実際の配管、ガス、温度、電源、通信、制御周期へ接続すると応答が変わる場合があります。",
        "トラブル解析では交換した部品だけを見るのではなく、交換前後の接続条件、校正、レシピ、ソフト、保守作業、下流・上流の状態を確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "部品・サブファブメーカーは、カテゴリー別に見る",
      lead: "同じ企業が複数領域を持つ場合もあります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "カテゴリー",
          rightLabel: "公式情報で確認できる代表企業例",
          rows: [
            { left: "MFC・ガス流量", right: "HORIBA STEC、フジキン、Brooks Instrument、MKSなど" },
            { left: "真空ポンプ", right: "荏原製作所、Edwards Vacuum、ULVAC、樫山工業など" },
            { left: "排ガス除害", right: "Edwards Vacuum、荏原製作所、カンケンテクノ、日本酸素グループなど" },
            { left: "ウェーハ搬送・EFEM", right: "ローツェ、平田機工、Brooks Automation、川崎重工など" },
            { left: "ウェーハ形状計測", right: "KLA、Corning Tropelなど" },
            { left: "複数コンポーネント領域", right: "MKSは流量・圧力・真空・バルブ・RFなど、フジキンはバルブ・継手・ガス供給・流量制御などを展開" },
          ],
        },
      ],
      paragraphs: [
        "企業研究では、会社全体を一括して比較せず、製品カテゴリーと採用工程を一つ選びます。同じ企業でも部門により顧客、技術、競合、仕事が異なります。",
        "市場順位や一律の優劣は扱いません。対象工程、接続先、制御対象、量産条件、保守・サービス範囲をそろえて比較します。",
      ],
    },
    {
      id: "comparison",
      heading: "部品・サブファブメーカーは、8つの条件をそろえて比較する",
      lead: "単品性能から装置・工場のライフサイクルへ視野を広げます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 装置内の位置", right: "ウェーハ・材料・電力・熱・排気・計測のどの経路で、上流・下流は何か" },
            { left: "2. 制御する量", right: "流量、圧力、温度、電力、位置、保持、真空、排出、形状の何をどう変えるか" },
            { left: "3. 対象工程・材料", right: "成膜、エッチング、洗浄、露光、CMP、検査などと、ガス・ウェーハ・副生成物の条件" },
            { left: "4. 単品性能", right: "精度、応答、再現性、耐久、清浄度、処理能力、消費電力を同じ条件で確認" },
            { left: "5. 接続・統合", right: "機械、配管、電気、通信、レシピ、インターロック、規格、装置制御との適合" },
            { left: "6. 量産影響", right: "歩留まり判断に使うデータ、装置停止、復旧時間、装置間整合、変更後の再認定" },
            { left: "7. ライフサイクル", right: "校正、消耗品、清掃、交換、オーバーホール、ソフト更新、電力・水・廃棄物" },
            { left: "8. 供給・支援", right: "開発協業、カスタム、製造能力、品質保証、拠点、部品、現地保守、長期供給" },
          ],
        },
      ],
      paragraphs: [
        "最初に部品の入力・出力と、故障時に止まる範囲を図にします。装置一台が止まるのか、複数チャンバー・工場排気へ影響するのかで要求が変わります。",
        "次に仕様書、単品評価、装置接続評価、量産データ、保守履歴を分けます。異なる工程・世代・条件の数値をそのまま横並びにしません。",
      ],
    },
    {
      id: "jobs",
      heading: "部品・サブファブ企業の仕事は、専門技術と装置統合の両方がある",
      lead: "工程装置メーカーとは異なる技術の深さと顧客接点があります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MECHANICAL", title: "精密機械・ロボット", body: "回転機械、バルブ、流路、ロボット、チャック、搬送・保持機構を設計します。" },
            { label: "ELECTRICAL", title: "電源・電装・制御", body: "RF、モータ、センサ、アクチュエータ、組込み、通信、インターロックを設計します。" },
            { label: "THERMAL", title: "熱・流体・真空", body: "ガス、液体、圧力、排気、熱伝達、冷却、加熱、反応副生成物を解析します。" },
            { label: "MATERIAL", title: "材料・表面・高純度", body: "腐食、吸着、摩耗、粒子、水分、シール、溶接、セラミックス、表面処理を評価します。" },
            { label: "APPLICATION", title: "アプリケーション", body: "顧客工程と装置へ部品を接続し、レシピ・配管・制御・評価条件を最適化します。" },
            { label: "QUALITY", title: "品質・計測", body: "校正、GR&R、信頼性、装置間整合、変更管理、故障解析、供給品質を管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、立上げ、交換、校正、清掃、再生、トラブル解析、量産復旧を支援します。" },
            { label: "DATA", title: "ソフト・データ", body: "状態監視、診断、予知保全、装置通信、ログ、データ解析、保守支援を実装します。" },
          ],
        },
      ],
      paragraphs: [
        "部品企業では、一つの物理現象・機構を深く扱いながら、複数の装置メーカー・半導体工場へ横展開する仕事があります。",
        "求人を見るときは、製品本体、アプリケーション、顧客装置への組込み、量産・品質、現地サービス、再生・保守のどこを担当するか確認します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体製造装置の部品・サブファブでよくある質問",
      lead: "装置本体との違いと代表カテゴリーを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体製造装置の主な部品は何ですか？", answer: "搬送ロボット、ロードポート、MFC、バルブ、真空計、圧力制御弁、真空ポンプ、RF電源、マッチング、チャック、ヒーター、チラー、センサなどがあります。工程装置により構成は異なります。" },
            { question: "サブファブとは何ですか？", answer: "プロセス装置を周辺・下流から支える真空ポンプ、除害、排気配管、温調、監視・保守などの設備領域を指す言葉です。工場・企業により含む範囲は異なります。" },
            { question: "部品メーカーと装置メーカーの違いは？", answer: "部品メーカーは流量、真空、電力、搬送など特定機能を装置へ供給します。装置メーカーは複数部品とプロセス技術を統合し、成膜・エッチングなどの工程装置として提供します。" },
            { question: "代表的な部品・サブファブメーカーは？", answer: "領域により異なります。MFCではHORIBA STECなど、真空では荏原・Edwardsなど、搬送ではローツェ・平田機工などが公式に半導体向け製品を展開しています。" },
            { question: "部品単体の性能が高ければ装置性能も高くなりますか？", answer: "必ずしもそうではありません。配管、チャンバー、制御周期、温度、電源、ソフトなど接続条件との整合が必要です。単品評価と装置システム評価を分けます。" },
            { question: "このハブから読める部品記事は？", answer: "MFC、真空ポンプ、除害、EFEM、ウェーハ形状計測に加え、RF電源、真空計・圧力制御バルブ、高純度ガス供給、チラー、静電チャックの記事へ進めます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜装置を、複数の流れが交差するシステムとして見る",
      lead: "部品の役割が分かると、工程装置とメーカーの違いも具体的になります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "FLOW", title: "流れで分ける", body: "ウェーハ、材料、電力・熱、排気、計測・データを整理する" },
            { label: "LOCATION", title: "位置を決める", body: "上流、チャンバー内、下流、サブファブ、工場設備へ置く" },
            { label: "INTERFACE", title: "境界を見る", body: "入力・出力、配管、電気、通信、制御、保守の接続を確認する" },
            { label: "LIFECYCLE", title: "量産で見る", body: "単品性能、装置統合、停止影響、交換・校正、供給支援を評価する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "成膜・露光・エッチング・検査・テスト装置の工程地図を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "部品・装置が使われる製造フロー全体を見る" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "ガス材料、供給設備、安全・排気の全体を見る" },
            { label: "RF電源・マッチングユニットメーカー", href: "/guides/semiconductor-rf-power-matching-manufacturers", description: "プラズマへ高周波電力を届ける仕組みと主要企業を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "ガス・真空・RF・温調を統合する装置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "プラズマ・圧力・ガス・搬送を統合する装置を見る" },
            { label: "設備エンジニアへのルート", href: "/guides/equipment-engineer-route", description: "設備保全・装置・部品経験と半導体職種の接続を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品を一つ選び、装置内の位置、制御量、対象工程、単品性能、接続・統合、量産影響、ライフサイクル、供給・支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "身近な成膜またはエッチング装置を一台選び、ウェーハ搬送・ガス供給・RF／温調・圧力制御・真空排気・除害・計測の7系統に分ける",
  relatedGuideSlugs: [
    "semiconductor-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-rf-power-matching-manufacturers",
    "semiconductor-vacuum-gauge-pressure-control-valve-manufacturers",
    "semiconductor-high-purity-valve-gas-supply-manufacturers",
    "semiconductor-chiller-temperature-control-manufacturers",
    "semiconductor-electrostatic-chuck-ceramic-heater-manufacturers",
    "semiconductor-gas-manufacturers",
    "semiconductor-mass-flow-controller-manufacturers",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-wafer-handling-efem-manufacturers",
    "semiconductor-wafer-geometry-metrology-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-thermal-processing-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
