import type { GuideArticle } from "@/content/guides/types";

export const semiconductorVacuumPumpManufacturersGuide: GuideArticle = {
  slug: "semiconductor-vacuum-pump-manufacturers",
  title: "半導体用真空ポンプメーカーとは？荏原・Edwards・ULVAC・樫山工業を初心者向けに図解",
  description:
    "半導体製造で使うドライ真空ポンプ、ターボ分子ポンプ、ルーツ・スクリューなどの仕組み、工程別の役割、副生成物対策、荏原・Edwards・ULVAC・樫山工業の製品領域と比較軸を図解します。",
  targetQuery: "半導体 真空ポンプ メーカー",
  searchIntent:
    "半導体製造で真空ポンプが必要な理由、ドライポンプ・ターボ分子ポンプの役割、ルーツ・スクリューなどの機構、副生成物・腐食・省エネ・保守、主要メーカーと比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "荏原製作所、Edwards Vacuum、ULVAC、樫山工業の公式製品・技術情報をもとに、チャンバーからガスを引く、圧力領域に応じて圧縮する、副生成物を通過させる、除害へ送る、状態監視・保守する流れへ整理しました。ポンプ単体の到達圧力だけで順位付けせず、プロセスガス、圧力、流量、反応生成物、温度、パージ、除害、保守を一つの排気系として扱います。",
  showCareerCtas: false,
  experienceBasis: [
    "成膜・エッチング・イオン注入など真空工程の記事を公開したうえで、複数工程を支えるサブファブ装置を独立記事にする必要があると判断",
    "荏原・Edwards・ULVACで、半導体向けドライポンプ、非接触・油をプロセス側へ入れない機構、24時間稼働、副生成物・腐食・省エネの論点を確認",
    "樫山工業で半導体・FPD向けドライ真空ポンプ、ルーツポンプ、真空排気ユニットの製品領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Dry Vacuum Pumps",
      url: "https://www.ebara.com/global-en/precision/dry-vacuum-pump/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "EBARA Launches New Dry Vacuum Pump and Plasma Abatement System",
      url: "https://www.ebara.com/global-en/newsroom/2025/20251217-01/",
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
      title: "Semiconductor Pumping Application Guide",
      url: "https://dach.my.edwardsvacuum.com/medias/P70020630-Application-Note.pdf?attachment=true&context=bWFzdGVyfHJvb3R8OTQwNzQ3fGFwcGxpY2F0aW9uL3BkZnxhRGhpTDJnMVlTODJOakUzTnpNeE1UY3dNekEzTUM5UU56QXdNakEyTXpBdElFRndjR3hwWTJGMGFXOXVJRTV2ZEdVdWNHUm18ZTgwNzY3YTVkMTZlMTk0MzBhNGQ5Y2E5OTljZDU1NDBiMTUyNDY0MWZjZDg4NTJlZTdiOTQ1Yjk4MmEyYzNlOA",
      publisher: "Edwards Vacuum",
      accessedAt: "2026-07-16",
    },
    {
      title: "Multi-Stage Roots Vacuum Pump",
      url: "https://showcase.ulvac.co.jp/en/how-to/product-knowledge02/dry-pump.html",
      publisher: "ULVAC, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Products",
      url: "https://www.kashiyama.com/en/pumps/",
      publisher: "Kashiyama Industries, Ltd.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "半導体用真空ポンプを調べると、ドライ、ルーツ、スクリュー、ターボ分子、ブースタ、到達圧力などが並び、どの工程に何台必要か分かりにくくありませんか。",
    conclusion:
      "半導体の排気系は、一台の万能ポンプではなく、チャンバーの圧力・ガス流量・副生成物に合わせて高真空ポンプ、ドライポンプ、配管加熱、パージ、除害を組み合わせます。メーカー比較では、対象工程、圧力・流量、ポンプ機構、プロセス耐性、熱・パージ、電力、保守、除害・サービス連携をそろえます。",
    learnings:
      "真空の役割、粗引きと高真空、ドライポンプの機構、副生成物・腐食対策、排気系統、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私は真空ポンプを、『空気を抜く箱』ではなく、反応に使ったガスと生成物を、圧力を保ちながら安全に次へ送る連続設備として見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜チャンバーから除害までの排気系",
      description: "代表的な真空プロセスの排気を単純化しています。構成は工程・装置で異なります。",
      stages: [
        { label: "01 / CHAMBER", title: "反応室からガスを引く", body: "圧力制御弁とポンプで反応室の圧力・滞留時間・排気流量を管理する" },
        { label: "02 / HIGH VACUUM", title: "必要なら高真空を作る", body: "ターボ分子ポンプなどで低い圧力領域まで排気し、背圧側へ送る" },
        { label: "03 / DRY PUMP", title: "大気圧側まで圧縮する", body: "ドライポンプがガスを多段で圧縮し、プロセス側へ油を入れず排出する" },
        { label: "04 / CONDITION", title: "温度・パージを保つ", body: "凝縮・固化・腐食・発火を抑えるため、加熱、希釈、パージ、トラップを使う" },
        { label: "05 / ABATE", title: "排ガスを処理する", body: "燃焼・プラズマ・湿式・乾式などで有害・可燃・温室効果ガスを処理する" },
        { label: "06 / MONITOR", title: "状態を監視・保守する", body: "圧力、温度、電流、振動、パージ、差圧、運転時間から異常と保守時期を判断する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "ポンプ・機器",
      rightLabel: "主な役割",
      rows: [
        { left: "ドライ真空ポンプ", right: "油・液体をプロセス室側の密封に使わず、ガスを大気圧付近まで圧縮する主ポンプ" },
        { left: "メカニカルブースタ", right: "ドライポンプの前段で排気速度を高め、中間圧力領域の能力を補う" },
        { left: "ターボ分子ポンプ", right: "高速回転翼で分子へ運動量を与え、高真空領域から背圧側へ排気する" },
        { left: "圧力制御弁", right: "ポンプ能力と独立にコンダクタンスを変え、チャンバー圧力をレシピへ合わせる" },
        { left: "加熱配管・トラップ", right: "副生成物の凝縮・堆積位置を管理し、ポンプ・配管の閉塞を抑える" },
        { left: "除害装置", right: "ポンプが排出した有害・可燃・温室効果ガスを安全・環境要求に合わせて処理する" },
      ],
    },
  ],
  sections: [
    {
      id: "role",
      heading: "真空は、低圧にするだけでなく反応を再現するために使う",
      lead: "圧力、流量、ガス組成、滞留時間が工程結果へつながります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程",
          rightLabel: "真空・排気に求めること",
          rows: [
            { left: "CVD・ALD", right: "原料と反応副生成物を周期・流量に合わせて排気し、粉・凝縮物・腐食へ耐える" },
            { left: "PVD", right: "低い基底圧力を作り、プロセスガス導入後も安定した圧力を保つ" },
            { left: "ドライエッチング", right: "反応性・腐食性ガスと生成物を排気し、圧力とプラズマ条件を再現する" },
            { left: "イオン注入", right: "ビーム経路とプロセス室を低圧に保ち、使用ガスを安全な排気系へ送る" },
            { left: "露光・電子線・計測", right: "光源・電子源・光学系・試料室に必要な真空と低振動・低汚染を保つ" },
            { left: "搬送・ロードロック", right: "大気と真空の間を短時間で切り替え、プロセス室の真空を維持する" },
          ],
        },
      ],
      paragraphs: [
        "荏原はドライ真空ポンプを半導体・FPDなどの真空工程で使う製品として、Edwardsは半導体向けにドライ、ターボ、クライオ、除害を含む排気ソリューションを示しています。",
        "必要な到達圧力だけでなく、処理中のガス負荷と圧力安定性が重要です。配管と圧力制御弁を含む系全体で評価します。",
      ],
    },
    {
      id: "mechanisms",
      heading: "ドライポンプは、接触を避けながら多段でガスを圧縮する",
      lead: "機構ごとにガス負荷、副生成物、温度、消費電力、保守の特徴があります。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "ROOTS", title: "多段ルーツ", body: "対向するロータを非接触で回し、複数段でガスを移送・圧縮します。ULVACは多段ルーツの原理を公式に解説しています。" },
            { label: "SCREW", title: "スクリュー", body: "らせん状ロータの間でガスを移送・圧縮します。内部容積、温度分布、粉体通過性などを用途に合わせます。" },
            { label: "CLAW", title: "クロー", body: "爪形ロータで吸入・圧縮・排気を行います。クリアランスと多段構成で油をプロセス室側へ入れない排気を作ります。" },
            { label: "TURBO", title: "ターボ分子", body: "高速回転する翼で分子を下流へ送り、高真空を作ります。単独で大気へ排気できないため背圧ポンプと組み合わせます。" },
          ],
        },
        {
          type: "note",
          title: "ドライは、装置全体に油が存在しないという意味ではない",
          body: "軸受・歯車側に潤滑油を使う設計でも、シールによりプロセスガスが通るロータ室へ油を入れない構成があります。製品ごとの定義と保守範囲を確認します。",
        },
      ],
      paragraphs: [
        "ULVACは多段ルーツ式でロータ同士・ロータとケーシングを接触させず、段階的に圧縮して大気側へ排気する原理を説明しています。",
        "Edwardsの資料は半導体用ドライポンプでルーツ、クロー、スクリューなど複数機構が使われることを示しています。機構名だけでなくプロセス適合設計を見ます。",
      ],
    },
    {
      id: "byproducts",
      heading: "最大の難所は、反応副生成物・腐食・凝縮をポンプ内で管理すること",
      lead: "排気されるのは清浄な空気ではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "課題",
          rightLabel: "主な対策の考え方",
          rows: [
            { left: "粉・固体副生成物", right: "クリアランス、温度、ガス流路、パージ、スクレーパ、上流トラップ、保守周期を設計する" },
            { left: "凝縮・昇華", right: "ポンプ・配管を加熱し、冷点を減らし、意図した場所で捕集・洗浄できるようにする" },
            { left: "腐食性ガス", right: "材料、表面処理、シール、温度、パージ、停止手順をガス組成へ合わせる" },
            { left: "可燃・反応性", right: "希釈・不活性パージ、酸化剤との分離、インターロック、除害との連動を設計する" },
            { left: "高流量・圧力変動", right: "排気速度、ブースタ、配管コンダクタンス、圧力制御弁、レシピ遷移を合わせる" },
            { left: "停止・再起動", right: "逆流、堆積物反応、湿気侵入、温度低下を考慮し、工程別の安全な停止手順を決める" },
          ],
        },
      ],
      paragraphs: [
        "荏原はALD・CVDなどの高ガス流量と副生成物へ対応する新型ドライポンプで、堆積を抑える機能と耐久性向上を公式に示しています。",
        "Edwardsの半導体ポンプ資料は、停止時に真空が失われて排気側ガスが戻ることや、クリアランス式ポンプの再起動上の注意を説明しています。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体用真空ポンプの代表企業4社",
      lead: "ポンプ機構だけでなく、除害・サービス・サブファブ全体も見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "荏原製作所｜日本", right: "半導体・電子デバイス向けドライ真空ポンプ、排ガス処理装置、CMP装置を展開。省エネ、高ガス流量、副生成物、ポンプ・除害連携を扱う" },
            { left: "Edwards Vacuum｜英国系", right: "半導体向けドライポンプ、ターボ分子・クライオ系、除害、統合サブファブ、監視・保守サービスを展開" },
            { left: "ULVAC｜日本", right: "ドライ、ルーツ、ターボ分子など幅広い真空機器と真空装置を展開し、多段ルーツの技術解説も公開" },
            { left: "樫山工業｜日本", right: "半導体・FPD向けドライ真空ポンプを中心に、ルーツポンプ、真空排気ユニット、保守サービスを展開" },
          ],
        },
      ],
      paragraphs: [
        "同じメーカーでも、クリーン工程、粉体負荷、腐食負荷、ロードロック、高真空背圧などで製品系列が分かれます。",
        "市場シェアや一律の性能順位は扱いません。実際のガス、流量、生成物、温度、配管、除害、保守条件をそろえて比較します。",
      ],
    },
    {
      id: "comparison",
      heading: "真空ポンプメーカーは、8つの条件をそろえて比較する",
      lead: "排気性能と、止まらず安全に運用できる条件を同時に見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象工程", right: "CVD・ALD・PVD・エッチング・注入・露光・計測・ロードロックのどこか" },
            { left: "2. 圧力・流量", right: "基底圧力、処理圧力、実ガス負荷、排気速度、ブースタ、配管コンダクタンス" },
            { left: "3. 機構・構成", right: "ルーツ・スクリュー・クロー・ターボ、段数、背圧、圧力制御弁、冗長性" },
            { left: "4. プロセス耐性", right: "腐食、粉、凝縮、昇華、可燃性、反応性、材料、表面処理、クリアランス" },
            { left: "5. 熱・パージ", right: "温度制御、加熱配管、窒素パージ、希釈、トラップ、停止・再起動手順" },
            { left: "6. 電力・設備", right: "実運転時電力、冷却水、排気、設置面積、騒音・振動、熱負荷" },
            { left: "7. 稼働・保守", right: "状態監視、保守間隔、交換時間、予備機、オーバーホール、部品、汚染管理" },
            { left: "8. 除害・支援", right: "除害との適合、インターロック、現地拠点、立上げ、プロセス評価、24時間支援" },
          ],
        },
      ],
      paragraphs: [
        "カタログの排気速度は入口圧力・ガス・構成で変わります。実プロセスの圧力遷移、ガス流量、配管、バルブを含む排気曲線で確認します。",
        "省エネも定格電力だけでなく、待機・処理・パージ・加熱・冷却・除害を含むレシピ一周期と年間稼働で評価します。",
      ],
    },
    {
      id: "jobs",
      heading: "真空ポンプメーカーの仕事は、回転機械・真空・プロセス安全をつなぐ",
      lead: "サブファブで量産を支える技術職が広がります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "ROTOR", title: "回転機械設計", body: "ロータ、軸、歯車、軸受、シール、クリアランス、強度、寿命を設計します。" },
            { label: "THERMAL", title: "熱・流体", body: "圧縮熱、冷却、加熱、ガス流路、パージ、配管、排気性能を解析します。" },
            { label: "MATERIAL", title: "材料・表面", body: "腐食、摩耗、反応生成物、コーティング、洗浄・再生方法を評価します。" },
            { label: "CONTROL", title: "電装・制御", body: "モータ、インバータ、センサ、インターロック、状態監視、通信を設計します。" },
            { label: "APPLICATION", title: "プロセス・アプリ", body: "工程ガスと生成物に合うポンプ、温度、パージ、除害構成を選びます。" },
            { label: "SERVICE", title: "フィールド・再生", body: "据付、立上げ、故障解析、交換、オーバーホール、予防保全を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "機械設計、真空、流体、熱、材料、モータ、設備保全、フィールドサービス、生産技術の経験を生かしやすい領域です。",
        "求人では、新品設計、アプリケーション、現地保守、オーバーホール、データ監視のどこを担当し、どの工程ガスを扱うか確認します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体用真空ポンプでよくある質問",
      lead: "基本用語と構成を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "なぜ半導体製造に真空が必要ですか？", answer: "不要な分子を減らし、反応ガスの圧力・組成・滞留時間を制御し、プラズマ、蒸着、電子・イオンビームなどを安定させるためです。" },
            { question: "ドライ真空ポンプとは？", answer: "プロセスガスが通るロータ室の密封・圧縮に油や液体を使わず、ガスを機械的に圧縮して排気するポンプです。" },
            { question: "ターボ分子ポンプだけで大気まで排気できますか？", answer: "一般には背圧側にドライポンプなどが必要です。高真空側と大気圧側のポンプを組み合わせます。" },
            { question: "主なメーカーは？", answer: "この記事では荏原製作所、Edwards Vacuum、ULVAC、樫山工業を代表例として紹介しています。" },
            { question: "除害装置との違いは？", answer: "真空ポンプはガスをチャンバーから取り出し圧縮・移送します。除害装置は排出ガスを分解・吸収・反応させ、安全・環境要求に合う状態へ処理します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜ポンプ単体ではなく、チャンバーから除害までを見る",
      lead: "真空ポンプは、工程圧力と安全な排気を同時に支える装置です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PROCESS", title: "工程を決める", body: "圧力、ガス、流量、生成物、レシピを固定する" },
            { label: "SYSTEM", title: "系で見る", body: "高真空、ドライ、配管、弁、パージ、除害をつなぐ" },
            { label: "DURABILITY", title: "耐性を見る", body: "粉、凝縮、腐食、反応性、停止時の挙動を確認する" },
            { label: "LIFECYCLE", title: "年間で見る", body: "電力、稼働、保守、交換、再生、支援を評価する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "排ガス除害装置メーカー", href: "/guides/semiconductor-exhaust-gas-abatement-manufacturers", description: "真空ポンプの下流でガスを処理する装置を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "高ガス流量・副生成物が発生する真空工程を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "反応性・腐食性ガスを使うプラズマ工程を見る" },
            { label: "イオン注入装置メーカー", href: "/guides/semiconductor-ion-implantation-equipment-manufacturers", description: "ビーム経路とプロセス室の真空構成を見る" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "排気系へ入るプロセスガスの供給側を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "真空ポンプが支える工程装置の全体地図を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象工程、圧力・流量、機構、プロセス耐性、熱・パージ、電力・設備、稼働・保守、除害・支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "荏原・Edwards・ULVAC・樫山工業から1社を選び、公式製品を対象工程・ポンプ機構・ガス負荷・副生成物対策・パージ・除害連携の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-ion-implantation-equipment-manufacturers",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-gas-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
