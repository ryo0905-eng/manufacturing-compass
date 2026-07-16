import type { GuideArticle } from "@/content/guides/types";

export const semiconductorHighPurityValveGasSupplyManufacturersGuide: GuideArticle = {
  slug: "semiconductor-high-purity-valve-gas-supply-manufacturers",
  title: "半導体用高純度バルブ・ガス供給機器メーカーとは？フジキン・Swagelok・CKD・Parkerを図解",
  description:
    "半導体の特殊材料ガスを供給する高純度バルブ、継手、レギュレータ、ガスパネル、集積化ガスシステムについて、流路、パージ、清浄度、主要メーカー、比較軸を図解します。",
  targetQuery: "半導体 バルブ ガス供給 メーカー",
  searchIntent:
    "半導体製造装置で高純度ガスを供給するダイヤフラムバルブ、継手、レギュレータ、ガスパネル、集積化ガスシステムの役割、構造、代表メーカー、選定条件、関連職種を知りたい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "フジキン、Swagelok、CKD、Parker Verifloの公式製品・技術情報をもとに、ガス源、圧力調整、遮断・切替、集積化ガスパネル、MFC、チャンバーまでの流路へ整理しました。リーク値、表面粗さ、開閉速度、耐久回数を条件なしで順位化せず、ガス種類、圧力・温度、清浄度、パージ性、接続・組立、保守、安全、装置統合をそろえて比較します。",
  showCareerCtas: false,
  experienceBasis: [
    "半導体ガスとMFCの記事をつなぎ、材料ガスを汚さず・漏らさず・滞留させずにチャンバーへ届ける流路部品へ拡張",
    "単体バルブだけでなく、継手、レギュレータ、フィルタ、ガススティック、集積化システムまでを供給経路として整理",
    "運営者固有のガス名、配管図、圧力条件、施工・保守情報は扱わず、公式公開情報で確認できる一般事項に限定",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Ultra-High Purity Integrated Gas Supply System",
      url: "https://www.fujikin.co.jp/ja/support/mono-japan/igs.html",
      publisher: "Fujikin Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Process Applications",
      url: "https://www.fujikin.co.jp/ja/support/examples/semiconductor.html",
      publisher: "Fujikin Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ultrahigh-Purity Diaphragm Valves, ALD7 Series",
      url: "https://products.swagelok.com/en/all-products/valves/atomic-layer-deposition-ald-valves/ultrahigh-purity-diaphragm-valves-ald7-series/c/263?clp=true",
      publisher: "Swagelok Company",
      accessedAt: "2026-07-16",
    },
    {
      title: "Process Gas Components",
      url: "https://www.ckd.co.jp/kiki/en/product/list?cid=16",
      publisher: "CKD Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Integrated Gas Supply System IAGD4",
      url: "https://www.ckd.co.jp/kiki/en/sp/product/detail/127",
      publisher: "CKD Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Microelectronics",
      url: "https://www.parker.com/content/dam/parker/fcg/veriflo-division/Parker%20Veriflo%20Semicon%20Brochure%20June%202025.pdf",
      publisher: "Parker Hannifin Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "BDV Series Ultra-High Purity Bulk Diaphragm Valve",
      url: "https://www.parker.com/content/dam/Parker-com/Literature/Veriflo/Veriflo---pdf-files/25000354.pdf",
      publisher: "Parker Hannifin Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "半導体のガス供給を調べると、ダイヤフラムバルブ、レギュレータ、面シール継手、ガスキャビネット、VMB、ガススティック、IGSといった部品・設備が並びます。MFCだけで流量を制御すればよいのではないか、それぞれ何を守っているのか分かりにくくありませんか。",
    conclusion:
      "高純度ガス供給系は、ガスを遮断・減圧・切替・パージ・計量し、漏れ、粒子、水分、酸素、残留ガスを管理しながらチャンバーへ届けます。製品比較では単体のリーク仕様だけでなく、接ガス材料、内部容積、表面・洗浄、接続、組立試験、開閉波形、保守、安全を流路全体で確認します。",
    learnings:
      "ガス源からチャンバーまでの構成、高純度バルブ・継手・レギュレータの役割、ダイヤフラム構造、デッドボリュームとパージ、集積化ガスシステム、主要メーカー4社、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私は高純度ガス供給を、ガスを通す配管ではなく、必要な材料だけを必要な時間に再現よく届け、前のガスを確実に追い出す清浄な流路システムとして見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜材料ガスが供給源からチャンバーへ届くまで",
      description:
        "一般的な特殊材料ガス供給を単純化した流れです。ガス種類、供給形態、装置により構成は異なります。",
      stages: [
        { label: "01 / SOURCE", title: "ガスを保管する", body: "シリンダ、バルク供給、容器、ガスキャビネットで材料と供給圧力を管理する" },
        { label: "02 / REDUCE", title: "圧力を整える", body: "レギュレータ、圧力計、遮断弁が下流へ必要な圧力で供給する" },
        { label: "03 / DISTRIBUTE", title: "装置へ分配する", body: "バルブマニホールド、配管、継手、フィルタが複数装置・ラインへ分ける" },
        { label: "04 / SWITCH", title: "ガスを選びパージする", body: "ダイヤフラムバルブと不活性ガス流路が供給・遮断・置換を行う" },
        { label: "05 / METER", title: "流量を決める", body: "MFCや圧力式流量制御器がレシピに合わせて量と時間波形を作る" },
        { label: "06 / DELIVER", title: "チャンバーへ入れる", body: "短い清浄流路とインジェクタ・シャワーヘッドを通じて反応領域へ届ける" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "主な部品・設備",
      rightLabel: "役割",
      rows: [
        { left: "ダイヤフラムバルブ", right: "接ガス部から駆動部を隔て、遮断・切替・高速供給を行う" },
        { left: "レギュレータ", right: "上流圧力を下流で使う圧力へ減圧し、供給変動を抑える" },
        { left: "継手・ガスケット・溶接", right: "部品と配管を気密・清浄に接続し、施工・交換可能な流路を作る" },
        { left: "フィルタ・精製器", right: "粒子や特定不純物を下流へ持ち込まないようにする" },
        { left: "ガスパネル・ガススティック", right: "バルブ、レギュレータ、センサ、MFCなどを一つの機能単位へまとめる" },
        { left: "集積化ガスシステム", right: "表面実装・ブロック化で配管、内部容積、占有面積、交換作業を整理する" },
        { left: "監視・安全系", right: "圧力、漏れ、弁状態、排気、インターロック、緊急遮断を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "purity",
      heading: "高純度ガス流路は、漏れだけでなく粒子・吸着・残留を管理する",
      lead: "外へ漏れないことと、流路内を汚さないことの両方が必要です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "LEAK", title: "外部・内部リーク", body: "外部への漏出、閉止時の下流への漏れ、シート・ダイヤフラム・接続部を確認する。" },
            { label: "PARTICLE", title: "粒子", body: "摩擦部、ねじ、ばね、表面、組立・作動で発生・滞留する粒子を抑える。" },
            { label: "MOISTURE", title: "水分・酸素", body: "材料・表面・施工・開放時間・パージにより混入・放出する不純物を管理する。" },
            { label: "VOLUME", title: "内部容積", body: "ガスが滞留する空間を減らし、切替・パージ・応答を速くする。" },
            { label: "SURFACE", title: "接ガス表面", body: "材質、電解研磨、洗浄、被膜、粗さ、腐食・触媒作用をガスへ合わせる。" },
            { label: "ASSEMBLY", title: "組立・包装", body: "クリーン環境、乾燥、試験、キャップ、包装、現場施工まで清浄度を維持する。" },
          ],
        },
        {
          type: "note",
          title: "デッドボリュームは、前のガスが残りやすい空間",
          body: "分岐の行き止まり、弁内部、継手、センサ導管などにガスが残ると、切替後の濃度・応答へ影響します。形状とパージシーケンスを合わせて評価します。",
        },
      ],
      paragraphs: [
        "フジキンは半導体向け流路で、オイル・粒子・デッドスペース・外部リークを抑えるバルブ、継手、集積化ガスシステムを公式に説明しています。",
        "SwagelokとParker Verifloも、超高純度用途向けダイヤフラムバルブについて、接ガス材料、清浄な組立、耐食性、高頻度作動、コンパクトな流路を示しています。",
      ],
    },
    {
      id: "valves",
      heading: "ダイヤフラムバルブは、薄い膜で流路を開閉する",
      lead: "高純度ガス用では、接ガス部のねじ・ばね・摺動部を減らす設計が使われます。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜空気作動ダイヤフラムバルブが開閉するまで",
          description:
            "代表的な構造を単純化しています。ノーマルクローズ・オープン、直動・間接駆動などで異なります。",
          stages: [
            { label: "01", title: "装置が開閉を指示する", body: "レシピ、インターロック、パージシーケンスから信号を受ける" },
            { label: "02", title: "アクチュエータを動かす", body: "空気圧、電磁、ピエゾなどでステム側へ力を加える" },
            { label: "03", title: "ダイヤフラムが変形する", body: "薄い金属膜が駆動部と接ガス部を隔てたまま上下する" },
            { label: "04", title: "シートを開閉する", body: "弁座との接触を離す・押さえることで流れを通す・止める" },
            { label: "05", title: "ガス波形を作る", body: "開閉時間、流路抵抗、供給圧力、下流容積が実流量の時間変化を決める" },
            { label: "06", title: "状態を監視する", body: "弁位置、作動回数、圧力、流量、異常を装置制御へ返す場合がある" },
          ],
        },
      ],
      paragraphs: [
        "ALDのように短い供給とパージを繰り返す工程では、バルブ単体の作動時間だけでなく、圧力、配管容積、温度、MFC、チャンバー入口を含む実際のガス波形を確認します。",
        "高温の低蒸気圧材料や腐食性ガスでは、バルブ・配管の加熱、材料適合、シール、析出・分解、冷点の回避が必要です。",
      ],
    },
    {
      id: "integrated",
      heading: "集積化ガスシステムは、部品を面上へまとめて流路を短くする",
      lead: "小型化だけでなく、交換・試験・パージの単位を変えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "従来配管型と集積型の比較点",
          rightLabel: "確認する内容",
          rows: [
            { left: "接続方法", right: "チューブ・溶接・継手でつなぐか、表面実装ブロック・シールで接続するか" },
            { left: "内部容積", right: "配管長、分岐、部品間空間、パージしにくい部分がどれだけあるか" },
            { left: "占有面積", right: "装置内のガスボックス・パネルへ何系統を配置できるか" },
            { left: "保守", right: "単体交換時に周辺配管を外すか、上面からモジュール交換できるか" },
            { left: "標準化", right: "部品寸法、シール、取付、流路パターン、通信、試験方法を共通化できるか" },
            { left: "検証", right: "単体リーク、組立リーク、パージ、流量、弁動作、清浄度をどの単位で保証するか" },
          ],
        },
      ],
      paragraphs: [
        "フジキンはWシールを使うIGS、CKDは標準部品を集積したIAGD4を公式に紹介しています。企業によって集積寸法、接続方式、対応部品、設計・組立範囲が異なります。",
        "集積化してもガス源から装置、装置からチャンバーまで全ての配管がなくなるわけではありません。施設側配管、ガスキャビネット、VMB、ツールフックアップとの境界を確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "高純度バルブ・ガス供給機器の代表メーカー",
      lead: "公式情報で確認できる製品領域を整理します。市場順位ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "FUJIKIN", title: "フジキン", body: "半導体向け高純度バルブ、継手、流量制御、気化供給、IGSなどを展開。単体部品から集積化ガスシステムまでを扱います。" },
            { label: "SWAGELOK", title: "Swagelok", body: "超高純度ダイヤフラムバルブ、継手、チューブ、レギュレータ、アセンブリなどを展開。ALD向け高速・高温対応バルブも公式に示しています。" },
            { label: "CKD", title: "CKD", body: "プロセスガス用バルブ、レギュレータ、流量調整、集積化ガス供給システムを展開。装置前工程用途と設計・組立・試験対応を示しています。" },
            { label: "PARKER", title: "Parker Veriflo", body: "超高純度ダイヤフラムバルブ、レギュレータ、継手、チェックバルブ、表面実装部品など、ガス供給・分配製品を展開しています。" },
          ],
        },
      ],
      paragraphs: [
        "同じ企業でも、バルクガス供給、ガスキャビネット、VMB、装置内ガスパネル、チャンバー直前では必要な圧力・流量・清浄度・作動頻度が異なります。",
        "メーカー比較では、部品ラインアップだけでなく、流路設計、アセンブリ、リーク・清浄度試験、施工教育、グローバル供給、修理・交換支援を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "メーカー・製品を比較する8つの軸",
      lead: "ガス名と使用条件を固定して比較します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "確認する内容",
          rows: [
            { left: "1. 流体・用途", right: "不活性、可燃性、毒性、腐食性、低蒸気圧材料、バルク・特殊材料・装置内供給" },
            { left: "2. 圧力・温度・流量", right: "入口・出口圧力、Cv、温度、加熱、圧力損失、必要なガス波形" },
            { left: "3. 接ガス材料", right: "ステンレス、ダイヤフラム、シート、表面処理、被膜、材料適合性" },
            { left: "4. 清浄度・残留", right: "粒子、水分、酸素、脱ガス、内部容積、表面、洗浄・包装、パージ性" },
            { left: "5. シール・接続", right: "内部・外部リーク、面シール、溶接、ガスケット、施工再現性、交換方法" },
            { left: "6. 動特性・寿命", right: "開閉・応答、作動波形、耐久、弁状態検知、故障モード、予防交換" },
            { left: "7. システム統合", right: "集積寸法、MFC・センサ・ヒーター、通信、安全、インターロック、診断" },
            { left: "8. 品質・供給", right: "材料トレーサビリティ、クリーン組立、試験、変更管理、供給、施工・サービス拠点" },
          ],
        },
      ],
      paragraphs: [
        "カタログ値は部品単体・特定条件で示されるため、実ガス、配管、供給圧力、温度、作動シーケンスをそろえたシステム評価が必要です。",
        "代替品を検討するときは、外形・接続互換だけでなく、内部容積、流量曲線、作動空気、シート材料、パージ方向、清浄度、交換手順を確認します。",
      ],
    },
    {
      id: "jobs",
      heading: "高純度バルブ・ガス供給機器メーカーの仕事",
      lead: "精密機械、材料、流体、安全、清浄生産が交わる領域です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DESIGN", title: "バルブ・継手設計", body: "流路、弁座、ダイヤフラム、シール、アクチュエータ、接続、材料を設計します。" },
            { label: "SYSTEM", title: "ガスシステム設計", body: "配管図、ガススティック、パージ、安全、MFC、センサ、ヒーターを統合します。" },
            { label: "MATERIAL", title: "材料・表面", body: "高純度金属、表面処理、洗浄、腐食、吸着、粒子、シール材料を評価します。" },
            { label: "PRODUCTION", title: "生産技術", body: "精密加工、溶接、クリーン組立、自動化、リーク・流量試験を構築します。" },
            { label: "QUALITY", title: "品質・安全", body: "材料証明、トレーサビリティ、変更、異常解析、法規・ガス安全を管理します。" },
            { label: "SERVICE", title: "施工・サービス", body: "ツール接続、交換、リーク試験、パージ、トラブル切分け、顧客教育を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "精密加工、機械設計、配管、溶接、流体制御、材料、品質保証、設備保全、ガス安全の経験を生かしやすい分野です。",
        "求人では、単体部品かガスパネルか、設計・製造・品質・施工のどこを担当し、特殊材料ガスと装置メーカーへどの範囲で関わるかを確認します。",
      ],
    },
    {
      id: "faq",
      heading: "高純度バルブ・ガス供給でよくある質問",
      lead: "基本用語を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "なぜ一般産業用バルブではなく高純度バルブを使うのですか？", answer: "半導体では微量の粒子・水分・酸素・残留ガス、内部・外部リークが工程へ影響するため、材料、表面、構造、洗浄、組立、試験が管理された製品を使います。" },
            { question: "MFCとバルブの違いは？", answer: "MFCは主に質量流量を測って制御します。遮断・切替・パージを担うバルブや、圧力を整えるレギュレータと組み合わせます。" },
            { question: "IGSとは何ですか？", answer: "Integrated Gas Systemの略で、バルブ、流量制御、センサなどを表面実装・ブロック化してまとめるガス供給システムです。" },
            { question: "デッドボリュームが小さいと何が良いですか？", answer: "前のガスが残りにくくなり、切替とパージの応答、材料利用、再現性を改善しやすくなります。" },
            { question: "主なメーカーは？", answer: "この記事ではフジキン、Swagelok、CKD、Parker Verifloを代表例として紹介しています。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜ガス源からチャンバーまで、清浄な流路として見る",
      lead: "バルブ・継手・レギュレータ・MFCは、材料供給の一つの連鎖です。",
      blocks: [
        {
          type: "links",
          items: [
            { label: "半導体製造装置の部品・サブファブ", href: "/guides/semiconductor-equipment-components-subfab", description: "ガス供給機器を装置全体へ置く" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "供給する材料ガスと安全・排気を見る" },
            { label: "マスフローコントローラーメーカー", href: "/guides/semiconductor-mass-flow-controller-manufacturers", description: "ガス流量を測って制御する仕組みを見る" },
            { label: "排ガス除害装置メーカー", href: "/guides/semiconductor-exhaust-gas-abatement-manufacturers", description: "使用後のガスを処理する下流設備を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "CVD・ALD・PVDの材料供給を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "反応性ガスを使うプラズマ装置を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象ガス、圧力・温度・流量、接ガス材料、清浄度、シール・接続、動特性、システム統合、品質・供給の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "フジキン、Swagelok、CKD、Parkerから1社を選び、公式製品を流体・構造・接ガス材料・パージ性・接続方法・試験の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-equipment-components-subfab",
    "semiconductor-gas-manufacturers",
    "semiconductor-mass-flow-controller-manufacturers",
    "semiconductor-vacuum-gauge-pressure-control-valve-manufacturers",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-high-purity-chemical-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
