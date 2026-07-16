import type { GuideArticle } from "@/content/guides/types";

export const semiconductorProbeCardManufacturersGuide: GuideArticle = {
  slug: "semiconductor-probe-card-manufacturers",
  title: "半導体プローブカードメーカーとは？FormFactor・日本マイクロニクスなどを初心者向けに図解",
  description:
    "プローブカードは、半導体テスタの信号をウェーハ上の微細なダイ電極へ届ける接触インターフェースです。カンチレバー・垂直・MEMS方式、主要メーカー、比較軸、関連職種を図解します。",
  targetQuery: "半導体 プローブカード メーカー",
  searchIntent:
    "プローブカードの役割と構造、カンチレバー・垂直・MEMS方式の違い、FormFactor・Technoprobe・日本マイクロニクス・日本電子材料など主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "FormFactor、Technoprobe、日本マイクロニクス、日本電子材料の公式製品・技術情報をもとに、プローブカードの構成、接触方式、メモリ・ロジック・RFなどの用途、並列試験、電気・機械・熱の比較軸を整理しました。市場シェアや企業の優劣ではなく、対象デバイスとテスト条件をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "ウェーハテスト、ATE、ウェーハプローバの記事を整理したうえで、テスタとダイの間で実際に信号と荷重を受け渡すプローブカード企業を独立して調べる記事が必要だと判断",
    "FormFactorとTechnoprobeの公式情報で、メモリ・ロジック・RF向け、垂直・MEMS・カンチレバー技術、高並列・微細電極への製品領域を確認",
    "日本マイクロニクスと日本電子材料の公式情報で、カンチレバー・垂直・MEMS型、DRAM・フラッシュ・ロジック・イメージセンサーなどの用途を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Probe Cards: Design and Manufacturing",
      url: "https://www.formfactor.com/products/probe-cards/?family-dram=1",
      publisher: "FormFactor, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Our Technologies: Probe Card",
      url: "https://www.technoprobe.com/technologies-and-products/our-technologies",
      publisher: "Technoprobe S.p.A.",
      accessedAt: "2026-07-16",
    },
    {
      title: "プローブカード",
      url: "https://www.mjc.co.jp/products_service/probecard/",
      publisher: "株式会社日本マイクロニクス",
      accessedAt: "2026-07-16",
    },
    {
      title: "プローブカード",
      url: "https://www.jem-net.co.jp/products/probe",
      publisher: "日本電子材料株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "What Is ATE? Probers and Test Handlers",
      url: "https://www.advantest.com/en/semiconductor-basics/automated-test-equipment/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "プローブカードを調べても、ウェーハプローバとの違い、カンチレバー・垂直・MEMSという分類、針数・狭ピッチ・並列数・周波数が何を意味するのか分かりにくくありませんか。",
    conclusion:
      "プローブカードは、テスタ側の信号・電源・接地を、ウェーハ上のパッドやバンプへ一時的に接続する製品別インターフェースです。企業比較では、対象デバイス、電極形状・配列、接触構造、同時測定数、電流・周波数、温度、総荷重、清掃・修理をそろえます。",
    learnings:
      "プローブカードの役割と構成、テストセル、接触の流れ、カンチレバー・垂直・MEMS、メモリ・ロジック・RF・センサー用途、主要メーカー、比較軸、保守、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "プローブカードメーカーを比べるときは、針数だけでなく、『どの電極へ、何ダイ同時に、どの電流・周波数・温度で、何回安定して接触するか』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜テスタの信号を、プローブカードからダイへ届ける",
      description:
        "ウェーハテストの一回の接触を単純化しています。カード構造、電極配列、並列サイト、試験内容で実際の経路は異なります。",
      stages: [
        { label: "01 / ROUTE", title: "テスタ資源を配線", body: "テストヘッドの信号・電源・接地をカード基板へ受ける" },
        { label: "02 / FAN OUT", title: "配線を変換", body: "基板・中間層でテスタ側の配置からダイ電極の微細な配置へ変換する" },
        { label: "03 / ALIGN", title: "電極へ位置合わせ", body: "プローバがプローブ先端とパッド・バンプのXY・高さ・平行度を合わせる" },
        { label: "04 / CONTACT", title: "一時的に接触", body: "設定量だけ押し当て、酸化膜などを考慮しながら電気経路を作る" },
        { label: "05 / TEST", title: "信号を往復", body: "電源・刺激をダイへ送り、応答を同じカード経由でテスタへ返す" },
        { label: "06 / RELEASE", title: "離して繰り返す", body: "接触を解除して次のダイ群へ移り、先端状態と測定結果を管理する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "カードの要素",
      rightLabel: "主な役割",
      rows: [
        { left: "基板・コネクタ", right: "テスタの多数の信号、電源、接地を受け、機械的な外形を作る" },
        { left: "配線・スペース変換", right: "テスタ側の比較的広い配線配置を、ダイの微細な電極配置へ変換する" },
        { left: "プローブヘッド・保持構造", right: "多数のプローブを所定の位置・高さ・角度へ保持する" },
        { left: "プローブ・接触子", right: "パッドやバンプへ繰り返し触れ、信号・電源を伝える" },
        { left: "補強・平坦度調整", right: "カードの変形・傾きを抑え、多数接点の接触開始と荷重をそろえる" },
        { left: "電気部品・回路", right: "用途に応じて電源安定化、信号整合、切替、保護などを補助する" },
        { left: "識別・保守情報", right: "カードID、使用回数、清掃、修理、校正、対象製品・レシピを管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "プローブカードメーカーとは、テスタとウェーハをつなぐ専用インターフェース企業",
      lead: "カードは測定器でも搬送装置でもなく、製品ごとに設計される接触・配線部品です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "CONNECT", title: "微細電極へつなぐ", body: "多数のパッド・バンプへ位置を合わせ、一時的な電気接続を作ります。" },
            { label: "DISTRIBUTE", title: "信号を配る", body: "テスタ資源を一つまたは複数のダイへ、電源・信号・接地別に配線します。" },
            { label: "REPEAT", title: "繰り返し接触する", body: "多数回の接触でも抵抗、位置、荷重、先端形状の変化を管理します。" },
            { label: "CUSTOM", title: "製品へ合わせる", body: "電極配置、試験内容、テスタ、プローバ、温度、並列数へ合わせて設計します。" },
          ],
        },
        {
          type: "note",
          title: "ウェーハテスト・プローバ記事と検索意図を分ける",
          body: "試験工程と判定はウェーハテスト記事、ウェーハの搬送・位置・荷重はプローバメーカー記事で説明します。本記事は接触子、カード構造、電気性能、企業、選定方法を扱います。",
        },
      ],
      paragraphs: [
        "日本マイクロニクスはプローブカードを、ウェーハ上のLSI電極とテスタを接続するコネクタのような器具と説明しています。日本電子材料も、ウェーハテスト用の接触製品をメモリ・ロジック・イメージセンサーなどへ展開しています。",
        "プローブカードはダイごとの電極配置と試験仕様へ強く依存します。同じデバイス分類でも、端子数、配置、電流、周波数、温度、同時測定数が変われば設計は変わります。",
      ],
    },
    {
      id: "test-cell",
      heading: "テストセルでは、ATE・プローバ・プローブカードの境界を決める",
      lead: "測定値と接触品質は、三つの要素を組み合わせた結果です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "テストセル要素",
          rightLabel: "プローブカードとの接点",
          rows: [
            { left: "ATE・テストヘッド", right: "電源・信号・測定回路を提供し、カードのコネクタ・配線・電気仕様と合わせる" },
            { left: "プローブカード", right: "テスタ資源をダイ電極へ変換・分配し、一時的な接触経路を作る" },
            { left: "ウェーハプローバ", right: "ウェーハを保持し、カードとのXY・Z・回転・平行度・温度・接触順序を制御する" },
            { left: "ダイ・ウェーハ", right: "電極材、形状、配列、高さ、表面状態、反り、温度変形が接触条件を決める" },
            { left: "データ・保守", right: "カードID、接触回数、サイト、清掃、修理と測定結果を結び付ける" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ウェーハテストの仕組み", href: "/guides/semiconductor-wafer-test", description: "接触・測定・ビニング・ウェーハマップの流れを見る" },
            { label: "ウェーハプローバメーカー", href: "/guides/semiconductor-wafer-prober-manufacturers", description: "ウェーハの搬送・位置合わせ・接触動作を担う装置を見る" },
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "電源・信号を生成して測るATE本体と主要企業を見る" },
          ],
        },
      ],
      paragraphs: [
        "接触抵抗が上がった場合、原因はプローブ先端だけでなく、カード平坦度、プローバ位置・荷重、電極表面、温度、テスタ配線などにもあり得ます。テストセルの部位別に切り分けます。",
        "カード設計時にはテスタのチャンネル・電源・コネクタ、プローバのカード径・保持・荷重、ダイの電極配置・材質、測定の並列数・帯域を同時に合わせます。",
      ],
    },
    {
      id: "probe-types",
      heading: "カンチレバー・垂直・MEMSは、接触構造と作り方の分類が重なる",
      lead: "方式名だけで性能順位を決めず、実際のプローブ構造と用途を確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式・技術",
          rightLabel: "構造と用途の見方",
          rows: [
            { left: "カンチレバー型", right: "片持ち梁状の針を斜めに配置して接触する。周辺電極、開発・量産、ロジックなど幅広い用途で使われる" },
            { left: "垂直接触型", right: "プローブを主に垂直方向へ配置する。狭ピッチ、エリアアレイ、多ピン・多ダイ接触へ構造を展開しやすい" },
            { left: "MEMSプローブ", right: "微細加工技術で接触子や構造を形成する。微細ピッチ、高い位置精度、多数接点、電気性能へ対応する設計に使われる" },
            { left: "スプリング・独自構造", right: "各社独自のばね・梁・薄膜・配線構造で接触力、移動量、電流、周波数、寿命を最適化する" },
          ],
        },
        {
          type: "note",
          title: "垂直型とMEMS型は排他的とは限らない",
          body: "垂直はプローブの配置・接触方向、MEMSは製造技術を主に表します。日本電子材料のように『垂直型MEMSプローブ』と説明する製品もあるため、メーカーの構造説明を確認します。",
        },
      ],
      paragraphs: [
        "TechnoprobeはカンチレバーからTPEG垂直MEMSまでの技術群を示しています。日本マイクロニクスもカンチレバー、垂直、MEMSを含む複数シリーズを公開しています。",
        "日本電子材料はMEMS型、垂直接触型、カンチレバー型を、メモリ、ロジック、イメージセンサーなどへ展開しています。方式を一つの性能順位としてではなく、電極と試験条件への適合で見ます。",
      ],
    },
    {
      id: "contact-mechanics",
      heading: "位置・オーバードライブ・スクラブ・荷重が、安定した接触を作る",
      lead: "導通させる力と、電極・プローブを傷めない条件の両立が必要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "接触項目",
          rightLabel: "確認すること",
          rows: [
            { left: "先端位置・高さ", right: "全プローブのXY位置とZ高さを電極許容範囲へ収める" },
            { left: "オーバードライブ", right: "最初に触れた位置から追加で押し込み、接触子を弾性変形させる" },
            { left: "スクラブ・接触痕", right: "接触中の横移動と痕跡を管理し、表面を導通させつつ電極損傷を抑える" },
            { left: "単針・総荷重", right: "一本ごとの接触力と、全接点・全サイトを合計したカード荷重を管理する" },
            { left: "平坦度・熱変形", right: "カード・プローバ・ウェーハの傾きと温度変形を考慮し、接触開始をそろえる" },
            { left: "汚れ・摩耗", right: "付着物、先端摩耗、ばね特性の変化を検知し、清掃・調整・修理へつなぐ" },
          ],
        },
      ],
      paragraphs: [
        "狭い電極へ多数の接触子を同時に当てるほど、位置・高さ・平坦度・総荷重の管理が重要になります。プローバ側の精度と剛性もカード性能の一部として評価します。",
        "接触痕が小さければ常に良いわけではなく、導通の安定性と電極への影響を両方確認します。電極材、表面状態、温度、接触回数で適切な条件は変わります。",
      ],
    },
    {
      id: "electrical-parallelism",
      heading: "電流・周波数・ノイズ・並列性が、カードの電気設計を決める",
      lead: "接触しても、目的の波形と電源が届かなければ正しく測れません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "RESISTANCE", title: "接触抵抗", body: "先端と電極の界面、配線、コネクタを含む抵抗と変動を抑えます。" },
            { label: "CURRENT", title: "電流供給", body: "電源・接地プローブの本数、発熱、電圧降下を考慮して必要電流を届けます。" },
            { label: "SIGNAL", title: "信号品質", body: "周波数、立上り、インピーダンス、損失、反射、クロストークを配線全体で管理します。" },
            { label: "NOISE", title: "低ノイズ・漏れ", body: "微小電流・アナログ測定では絶縁、ガード、遮蔽、汚れ、湿度を考慮します。" },
            { label: "PARALLEL", title: "並列サイト", body: "複数ダイへテスタ資源を分配し、一回の接触で試験するダイ数を増やします。" },
            { label: "THERMAL", title: "温度", body: "材料の熱膨張、抵抗、ばね特性、基板反りを試験温度範囲で確認します。" },
          ],
        },
        {
          type: "note",
          title: "最大並列数や最高周波数を、そのまま企業順位にしない",
          body: "ダイ、電極、テスタ資源、試験内容、カードサイズ、温度、許容荷重が違えば前提も変わります。同じ製品・試験条件で実効処理量と測定相関を確認します。",
        },
      ],
      paragraphs: [
        "FormFactorはDRAM、フラッシュ、ロジック、RFなどの製品群で、高並列、微細ピッチ、高電流、高周波といった異なる課題を示しています。すべてを一枚で最大化するのではなく、用途別に設計します。",
        "日本電子材料は多数プローブを実装するメモリ向けや、狭ピッチのロジック・イメージセンサー向けなどを公開しています。カードの電気性能はプローブだけでなく基板・中間配線・テスタ接続を含めて見ます。",
      ],
    },
    {
      id: "applications",
      heading: "メモリ・ロジック・RF・パワー・センサーでは、カード課題が変わる",
      lead: "デバイスと電極構造から、接触方式と電気性能を逆算します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "MEMORY", title: "DRAM・フラッシュ", body: "多ダイ・全ウェーハに近い並列接触、多数端子、広いカード、高い総荷重、速度試験へ対応します。" },
            { label: "LOGIC", title: "ロジック・SoC", body: "微細バンプ、エリアアレイ、多端子、高電流、高速信号、異なるダイサイズへ対応します。" },
            { label: "RF", title: "RF・ミリ波", body: "インピーダンス、損失、反射、クロストーク、校正、短い信号経路を重視します。" },
            { label: "POWER", title: "パワーデバイス", body: "高電圧・大電流、低接触抵抗、裏面接触、絶縁、安全、発熱を考慮します。" },
            { label: "SENSOR", title: "イメージセンサー", body: "光を当てる開口部と電気接触、多数個同時測定、温度・遮光を統合します。" },
            { label: "ADVANCED", title: "先端パッケージ・KGD", body: "微細なバンプやチップレットを組み立てる前に、速度・電源・信号をウェーハ段階で確認します。" },
          ],
        },
      ],
      paragraphs: [
        "FormFactorはDRAM・フラッシュ・ロジック・RF向け、日本電子材料はメモリ・ロジック・イメージセンサー向けの製品を公式に示しています。日本マイクロニクスもロジック・光・DRAM・フラッシュなどで製品を絞り込めます。",
        "同じMEMS技術でも、メモリの広い並列接触とロジックの微細バンプでは、プローブ配列、電流、配線、荷重、カード寸法が異なります。対象製品シリーズまで確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "主要メーカーは、対象デバイス・接触技術・支援範囲が異なる",
      lead: "代表企業を順位ではなく、公式に確認できる製品領域へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な製品領域",
          rows: [
            { left: "FormFactor", right: "DRAM・フラッシュ・ロジック・RFなどの量産プローブカード、MEMS接触技術、プローブシステム・解析用プローブを含むテスト・計測製品" },
            { left: "Technoprobe", right: "カンチレバーからTPEG垂直MEMSまでのプローブカード、プローブヘッド、カード解析・検査装置など" },
            { left: "日本マイクロニクス（MJC）", right: "U-Probe、SP-Probe、Vertical-Probe、MEMS-SP、MEMS-Vなど、ロジック・光・DRAM・フラッシュ向けカードと保守支援" },
            { left: "日本電子材料（JEM）", right: "MEMS型、垂直接触型、カンチレバー型を、DRAM・NAND・ロジック・イメージセンサーなどへ展開" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、網羅的な市場順位ではない",
          body: "製品別に設計されるため、得意領域はデバイス、電極、テスタ、地域、サービス体制で変わります。企業名だけで優劣を決めず、同じ用途の製品群を確認してください。",
        },
      ],
      paragraphs: [
        "FormFactorとTechnoprobeはグローバルに複数の先端接触技術を展開し、日本マイクロニクスと日本電子材料もメモリ・ロジックを含む幅広いカード方式を公式に示しています。",
        "企業比較ではカード単体だけでなく、設計協議、製造、検査、プローバ・テスタ適合、立ち上げ、現地保守、清掃・修理までの支援範囲を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "プローブカードメーカーを比較する8つの軸",
      lead: "同じダイ・テスタ・温度・並列条件へそろえて見ます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "対象デバイス", body: "メモリ、ロジック、RF、パワー、センサーと試験段階" },
            { label: "02", title: "電極", body: "パッド・バンプ材、寸法、ピッチ、周辺・エリア配列、高さ差" },
            { label: "03", title: "接触構造", body: "カンチレバー、垂直、MEMS、先端形状、接触移動と痕跡" },
            { label: "04", title: "電気性能", body: "接触抵抗、電流、電圧、周波数、損失、クロストーク、漏れ" },
            { label: "05", title: "並列・荷重", body: "同時ダイ数、総接点数、カード径、単針・総荷重、平坦度" },
            { label: "06", title: "温度・寿命", body: "試験温度、熱変形、接触回数、摩耗、抵抗変化、清掃間隔" },
            { label: "07", title: "適合・生産性", body: "対応ATE・プローバ、段取り、接触回数、測定時間、再試験" },
            { label: "08", title: "品質・支援", body: "検査、相関、納期、変更管理、現地調整、清掃、修理、解析" },
          ],
        },
      ],
      paragraphs: [
        "最小ピッチ、最大ピン数、周波数、電流、並列数などは、対象デバイスと測定条件が異なると比較できません。メーカーへ同じ評価条件を渡し、測定相関と接触安定性で確認します。",
        "カードは使用に伴って状態が変化する接触製品です。初期性能だけでなく、清掃間隔、寿命判定、修理範囲、交換時間、予備品、履歴管理を含む総運用で比較します。",
      ],
    },
    {
      id: "lifecycle-jobs",
      heading: "カードのライフサイクルと職種は、設計から量産保守まで続く",
      lead: "製品ごとの接触インターフェースを、短期間で設計し安定運用します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・工程",
          rightLabel: "主な仕事",
          rows: [
            { left: "アプリケーション・設計", right: "ダイ電極、テスタ資源、プローバ、並列、温度、電気仕様からカード構成を決める" },
            { left: "機械・プローブ設計", right: "接触子形状、ばね特性、位置・高さ、保持構造、平坦度、荷重、熱変形を設計する" },
            { left: "電気・基板設計", right: "配線、電源・接地、信号整合、損失、クロストーク、部品、コネクタを設計する" },
            { left: "MEMS・微細加工", right: "接触子や微細構造の成形、材料、加工条件、形状・寸法を作り込む" },
            { left: "組立・検査", right: "多数プローブを高精度に組み、位置・高さ・平坦度・抵抗・絶縁・信号を検査する" },
            { left: "品質・生産技術", right: "工程能力、歩留まり、変更、トレーサビリティ、設備・治具、納期、供給を管理する" },
            { left: "フィールド・修理", right: "テストセル適合、相関、清掃、先端調整、部品交換、故障解析、量産復帰を支援する" },
            { left: "データ・ソフトウェア", right: "設計自動化、検査データ、カード履歴、接触回数、測定異常、保守予測を扱う" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "テスト装置と前後工程企業を工程地図で見る" },
            { label: "テストソケットメーカー", href: "/guides/semiconductor-test-socket-manufacturers", description: "パッケージ後の製品端子へ接触する部品企業を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "物理検査・寸法計測との違いを見る" },
            { label: "装置エンジニアへの転職", href: "/guides/equipment-engineer-route", description: "装置保全・立ち上げ経験のつなぎ方を見る" },
          ],
        },
      ],
      paragraphs: [
        "精密部品、ばね・接触、微細加工、基板・高速信号、画像計測、治具、品質、生産技術、保全、データ解析の経験はプローブカード企業へ接点を整理しやすい領域です。",
        "経験を説明するときは、位置・高さ・抵抗のばらつき、接触寿命、微細加工精度、検査時間、修理期間、工程能力、異常解析のどこへ貢献したかを担当製品と一緒に整理します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体プローブカードメーカーでよくある質問",
      lead: "プローバとの違い、方式、交換・清掃を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "プローブカードとは何ですか？", answer: "半導体テスタの信号・電源・接地を、ウェーハ上のダイ電極へ一時的に接続する専用インターフェースです。プローバへ取り付けて使います。" },
            { question: "主なプローブカードメーカーは？", answer: "この記事ではFormFactor、Technoprobe、日本マイクロニクス、日本電子材料を代表例として紹介しています。対象デバイス・接触技術別の例であり、網羅的な市場順位ではありません。" },
            { question: "ウェーハプローバとの違いは？", answer: "プローバはウェーハを搬送・保持し、位置・高さ・荷重・温度を制御する装置です。プローブカードはテスタとダイの間に電気経路を作る接触インターフェースです。" },
            { question: "カンチレバー型と垂直型の違いは？", answer: "カンチレバー型は片持ち梁状の針を斜めに配置し、垂直型は主に垂直方向の接触子を配置します。電極配列、ピッチ、並列数、電気性能で選びます。" },
            { question: "MEMS型は垂直型と別物ですか？", answer: "必ずしも別物ではありません。MEMSは主に微細加工技術、垂直型は接触子の配置・構造を表すため、垂直MEMSプローブという組み合わせがあります。" },
            { question: "なぜ製品ごとに専用カードが必要ですか？", answer: "ダイの電極配置、端子数、テスタ資源、電流・周波数、温度、並列数が製品ごとに異なるためです。共通化できるプラットフォームがあっても、接触部と配線は適合が必要です。" },
            { question: "プローブカードは消耗しますか？", answer: "接触を繰り返すと先端の汚れ・摩耗、位置・高さ、ばね特性、抵抗などが変化します。清掃、検査、調整、修理、寿命判定を運用へ組み込みます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜デバイス・電極・接触・電気性能・運用をそろえてメーカーを見る",
      lead: "プローブカードは、ATEの測定能力を微細なダイ電極へ届ける製品別インターフェースです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "DEVICE", title: "対象を決める", body: "メモリ、ロジック、RFなどと電極・試験内容を確認する" },
            { label: "CONTACT", title: "接触構造を見る", body: "カンチレバー、垂直、MEMSと位置・荷重・痕跡を確認する" },
            { label: "ELECTRIC", title: "信号を評価する", body: "抵抗、電流、周波数、ノイズ、並列サイトを同じ条件で比べる" },
            { label: "LIFECYCLE", title: "運用まで見る", body: "温度、寿命、清掃、修理、適合、納期、現地支援を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "プローブカードを使う試験工程とウェーハマップを見る" },
            { label: "ウェーハプローバメーカー", href: "/guides/semiconductor-wafer-prober-manufacturers", description: "カードをダイへ位置合わせする装置と主要企業を見る" },
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "カードへ信号を送るATE本体と主要企業を見る" },
            { label: "テストハンドラメーカー", href: "/guides/semiconductor-test-handler-manufacturers", description: "パッケージ後にソケット接触する搬送装置を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置・テスト企業を一つの地図で見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "テスト・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのカードシリーズを選び、対象デバイス、電極、接触構造、並列、電流・周波数、温度、保守の7項目で整理してください。同じ用途へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "FormFactor・Technoprobe・日本マイクロニクス・日本電子材料から1社を選び、公式製品を対象デバイス・接触構造・並列・電気性能・保守の5項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-test-socket-manufacturers",
    "semiconductor-wafer-test",
    "semiconductor-wafer-prober-manufacturers",
    "semiconductor-tester-ate",
    "semiconductor-test-handler-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-final-test",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: [],
};
