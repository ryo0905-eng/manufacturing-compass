import type { GuideArticle } from "@/content/guides/types";

export const semiconductorTestSocketManufacturersGuide: GuideArticle = {
  slug: "semiconductor-test-socket-manufacturers",
  title: "半導体テストソケットメーカーとは？山一電機・エンプラス・Cohuなどを初心者向けに図解",
  description:
    "半導体テストソケットは、パッケージ端子とATEを繰り返し接続する検査用インターフェースです。バーンイン用との違い、接触子、主要メーカー、高速・大電流・熱などの比較軸を図解します。",
  targetQuery: "半導体 テストソケット メーカー",
  searchIntent:
    "半導体テストソケットの役割と構造、バーンインソケットやプローブカードとの違い、山一電機・エンプラス・Cohu・WinWayなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "山一電機、エンプラス、Cohu、WinWay Technologyの公式製品・技術情報をもとに、テストソケット／コンタクタの構成、量産最終検査・バーンイン・SLT、接触、高速信号、大電流、ケルビン測定、熱制御、保守を整理しました。市場シェアや企業の優劣ではなく、パッケージと試験条件をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "最終検査、ATE、テストハンドラの記事を整理したうえで、パッケージ端子とロードボードの間で繰り返し接触するソケット企業を独立して調べる記事が必要だと判断",
    "山一電機とエンプラスの公式情報で、量産テスト・バーンイン、BGA・LGA・QFNなどのパッケージ、高周波・大電流・熱・微細ピッチへの製品領域を確認",
    "CohuとWinWayの公式情報で、テストコンタクタ、ケルビン・RF・パワー、高速信号、SLT、熱制御、交換可能な接触子を含むインターフェース領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Test Solutions Business",
      url: "https://www.yamaichi.co.jp/en/core/testsolution/",
      publisher: "YAMAICHI ELECTRONICS CO., LTD.",
      accessedAt: "2026-07-16",
    },
    {
      title: "テストソリューション",
      url: "https://www.yamaichi.co.jp/products/test/",
      publisher: "山一電機株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Business",
      url: "https://www.enplas.co.jp/english/business/espc/",
      publisher: "Enplas Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Test Contactors (Sockets) / Probe Heads",
      url: "https://www.cohu.com/test-contactors/",
      publisher: "Cohu, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Package Test",
      url: "https://www.winwayglobal.com/products/package",
      publisher: "WinWay Technology Co., Ltd.",
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
      "テストソケットを調べても、コンタクタとの違い、バーンイン用・量産最終検査用・SLT用の違い、ピン・ケルビン・高速・大電流・熱が何を意味するのか分かりにくくありませんか。",
    conclusion:
      "テストソケットは、パッケージ端子を正しい位置と荷重で接触子へ押し当て、ATE・ロードボードとの一時的な電気経路と熱経路を作る製品別インターフェースです。企業比較では、試験段階、パッケージ、接触構造、信号・電流、温度・発熱、寿命、清掃・交換をそろえます。",
    learnings:
      "テストソケットの役割と構成、テストセル、テスト・バーンイン・SLTの違い、接触子、ケルビン測定、高速・大電流・熱、主要メーカー、比較軸、保守、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "テストソケットメーカーを比べるときは、端子ピッチだけでなく、『どのパッケージを、何回、どの温度・電流・速度で、どのハンドラと基板へ接続するか』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜パッケージ端子を、ソケット経由でATEへつなぐ",
      description:
        "パッケージ最終検査での一回の接触を単純化しています。ソケット構造、端子、ハンドラ、温度、並列サイトで実際の動作は変わります。",
      stages: [
        { label: "01 / PRESENT", title: "製品を運ぶ", body: "ハンドラまたは作業者がパッケージを正しい向きでソケット上へ運ぶ" },
        { label: "02 / ALIGN", title: "端子を合わせる", body: "ガイドと画像・機械基準でBGA、LGA、QFNなどの端子位置を接触子へ合わせる" },
        { label: "03 / PRESS", title: "押し当てる", body: "プランジャやリッドで必要な荷重を加え、全端子へ接触を作る" },
        { label: "04 / CONDITION", title: "熱を管理する", body: "試験温度へ整え、通電発熱をヒートシンク・空冷・液冷などで逃がす" },
        { label: "05 / TEST", title: "信号を往復", body: "ATEから電源・信号を送り、応答をロードボードへ返して判定する" },
        { label: "06 / RELEASE", title: "離して繰り返す", body: "荷重を解除し、製品を排出して次の個体へ進み、接触状態を管理する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "ソケットの要素",
      rightLabel: "主な役割",
      rows: [
        { left: "ハウジング・ガイド", right: "パッケージ外形と向きを規制し、端子を接触子へ位置合わせする" },
        { left: "接触子・プローブ", right: "パッケージ端子とロードボードの間で、信号・電源・接地を繰り返し伝える" },
        { left: "リテーナ・保持部", right: "多数の接触子を所定の位置・高さへ保持し、交換・清掃できる構造を作る" },
        { left: "プランジャ・リッド", right: "製品を押し付け、位置・平行度・荷重を端子全体へ分配する" },
        { left: "熱インターフェース", right: "製品上面へ熱接触し、加熱・冷却・温度センサーを組み込む" },
        { left: "ロードボード接続", right: "接触子下端を基板のパッド・ビア・配線へ接続し、ATEまでの経路を作る" },
        { left: "保守部品・識別", right: "接触子、ガイド、リッドなどを交換し、使用回数・清掃・修理履歴を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "テストソケットメーカーとは、パッケージ端子へ繰り返し接触する部品企業",
      lead: "ソケットは製品を固定するだけでなく、測定・荷重・熱の境界を作ります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "ALIGN", title: "端子を合わせる", body: "パッケージの外形・向き・端子位置を接触子へ合わせます。" },
            { label: "CONTACT", title: "電気経路を作る", body: "信号・電源・接地を安定した抵抗でロードボードへつなぎます。" },
            { label: "FORCE", title: "荷重を分配する", body: "全端子へ必要な力を与え、製品・端子・基板への過大な力を抑えます。" },
            { label: "THERMAL", title: "熱を渡す", body: "高温・低温条件と自己発熱に合わせ、加熱・冷却・温度測定を統合します。" },
          ],
        },
        {
          type: "note",
          title: "最終検査・ハンドラ記事と検索意図を分ける",
          body: "最終検査の工程原理は技術記事、製品搬送・温度・分類はテストハンドラ記事で説明します。本記事はソケットの接触構造、試験用途、企業、選定・保守を扱います。",
        },
      ],
      paragraphs: [
        "山一電機はテストソケットを半導体の製品機能検査に使うICソケット、バーンインソケットを温度・電圧負荷による耐久性確認に使う製品として説明しています。用途により接触回数、滞在時間、温度、実装密度が変わります。",
        "Cohuはテストコンタクタを、テストハンドラが提示したデバイスとテスタの間の電気インターフェースと説明しています。『ソケット』『コンタクタ』は企業や製品で呼び方が重なるため、名称より機能を確認します。",
      ],
    },
    {
      id: "test-cell",
      heading: "テストセルでは、ATE・ハンドラ・ソケット・ロードボードを一つにする",
      lead: "接触不良を製品不良と誤認しないため、各要素の役割を分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "テストセル要素",
          rightLabel: "ソケットとの接点",
          rows: [
            { left: "ATE・テストヘッド", right: "電源・信号を生成・測定し、ロードボード経由でソケットへ届ける" },
            { left: "ロードボード", right: "ATE資源を各サイトのソケットへ配線し、電源・信号・接地・部品を配置する" },
            { left: "テストソケット", right: "基板とパッケージ端子の間に、交換可能な接触・位置・荷重・熱の境界を作る" },
            { left: "テストハンドラ", right: "製品を搬送・温度調整し、ソケットへ位置合わせして押し付ける" },
            { left: "パッケージ", right: "BGA・LGA・QFNなどの端子形状、平坦度、発熱、寸法公差が接触条件を決める" },
            { left: "データ・保守", right: "サイト、ソケットID、接触回数、清掃・部品交換と初回・再試験結果を結び付ける" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "最終検査の仕組み", href: "/guides/semiconductor-final-test", description: "搬送・温度・接触・試験・分類の流れを見る" },
            { label: "テストハンドラメーカー", href: "/guides/semiconductor-test-handler-manufacturers", description: "製品をソケットへ運び、押し付ける装置を見る" },
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "電源・信号を生成・測定するATE本体を見る" },
          ],
        },
      ],
      paragraphs: [
        "接触不良が増えた場合、原因は製品端子、接触子、ガイド、押付け位置・荷重、温度、ロードボード、テスタのどこにもあり得ます。製品とサイトを入れ替えるなど、要因を分離して確認します。",
        "ソケット選定では部品単体だけでなく、ハンドラのプランジャ・ドッキング、ロードボードのパッド・剛性、テスタ信号、温度制御を含むテストセルで適合を評価します。",
      ],
    },
    {
      id: "test-types",
      heading: "量産テスト・バーンイン・SLT・開発評価では、ソケットの役割が違う",
      lead: "接触時間、挿抜回数、温度、基板密度、冷却が試験段階で変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "試験・用途",
          rightLabel: "ソケット設計の見方",
          rows: [
            { left: "量産最終検査", right: "ハンドラと同期して短いサイクルを多数回繰り返し、接触安定性、交換性、並列サイト、信号性能を重視する" },
            { left: "バーンイン", right: "多数の製品を基板へ高密度に載せ、温度・電圧を長時間加える。耐熱、挿抜、実装密度、基板・炉との適合を重視する" },
            { left: "システムレベル試験", right: "実使用に近い基板・ソフトウェアで比較的長く動作させ、発熱、電源、高速I/O、交換性を重視する" },
            { left: "開発・評価", right: "少量の試作品で測定器や評価基板へ接続し、観察性、手動リッド、構成変更、信号アクセスを重視する" },
            { left: "信頼性・環境試験", right: "温度サイクル、湿度、動作寿命などの条件と、試験槽・基板・材料・接触安定性を合わせる" },
          ],
        },
        {
          type: "note",
          title: "バーンインソケットとテストソケットを同じ寿命・速度で比べない",
          body: "量産最終検査は短サイクルの繰り返し、バーンインは長時間・多数個・高温運用が中心です。試験時間、温度、挿抜、基板密度をそろえて比較します。",
        },
      ],
      paragraphs: [
        "山一電機とエンプラスは、バーンイン用と電気試験用のICソケットを公式に案内しています。WinWayはパッケージテスト、バーンイン、SLT・開発、熱制御を含むインターフェースを示しています。",
        "同じパッケージでも、最終検査とバーンインでは使用する基板、押付け機構、温度、接触時間、処理個数が異なります。製品名ではなく試験段階から選びます。",
      ],
    },
    {
      id: "package-contact",
      heading: "BGA・LGA・QFNなどの端子に合わせ、接触子とガイドを設計する",
      lead: "パッケージ外形と端子構造が、ソケットの基本形を決めます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "パッケージ・端子",
          rightLabel: "主な接触課題",
          rows: [
            { left: "BGA・はんだボール", right: "球の高さ・位置・変形、汚れ、端子への傷、微細ピッチ、ガイド公差を管理する" },
            { left: "LGA・平面ランド", right: "平坦度と接触子高さをそろえ、低い接触移動でも安定導通させる" },
            { left: "QFN・SON", right: "下面・側面端子と露出パッドへ接触し、小型・低背パッケージを正確に保持する" },
            { left: "QFP・SOP", right: "外周リードの曲がり・位置へ追従し、複数点・ケルビンなどの接触を作る" },
            { left: "大型・多端子パッケージ", right: "多数接点の総荷重、基板・製品の反り、高速信号、高電流、発熱と冷却を統合する" },
            { left: "個片ダイ・モジュール", right: "標準外形がない対象へ専用ガイド、接触子、基板、熱・光・RF環境を設計する" },
          ],
        },
      ],
      paragraphs: [
        "山一電機はBGA、LGA、QFN、SON、QFP、SOPなどのパッケージと、メモリ、ロジック、アナログ、パワー、センサー、RFなどから製品を探せる構成を公開しています。",
        "端子ピッチが同じでも、端子材、直径・高さ、配列、製品外形、反り、許容痕、温度で接触子は変わります。パッケージ図面と試験仕様を同時に確認します。",
      ],
    },
    {
      id: "contact-types",
      heading: "スプリングプローブ・ブレード・ケルビン・同軸などを用途で使い分ける",
      lead: "接触子の構造は、抵抗、移動量、信号、電流、寿命、保守へ影響します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "接触方式・構造",
          rightLabel: "特徴と用途の見方",
          rows: [
            { left: "スプリングプローブ", right: "ばねを内蔵したピンで上下の接点へ追従する。交換しやすく、多様なパッケージ・量産・開発用途へ使われる" },
            { left: "カンチレバー・ブレード", right: "梁状の接触子をたわませ、端子形状と必要な接触移動・電流へ合わせる" },
            { left: "ケルビン接触", right: "一つの端子へ電流経路と電圧測定経路を分けて接触し、配線・接触抵抗の影響を抑えて測る" },
            { left: "同軸・シールド接触", right: "信号の周囲へ接地構造を配置し、高速・高周波でインピーダンス、損失、クロストークを管理する" },
            { left: "多点・ワイピング接触", right: "複数点や横移動を利用し、端子表面状態への追従と接触安定性を狙う" },
            { left: "専用・交換式コンタクタ", right: "製品、RF、パワー、センサーなどへ接触子とハウジングを最適化し、摩耗部だけ交換できる構造を取る" },
          ],
        },
      ],
      paragraphs: [
        "Cohuはスプリング、ケルビン、RF・同軸、パワーなど複数のコンタクタ製品を公開しています。山一電機もケルビン、高周波、大電流、熱制御などの用途から製品を案内しています。",
        "接触抵抗が低い方式が常に最適とは限りません。信号、電流、端子損傷、接触荷重、汚れ、交換時間、コストを含め、対象試験で安定して繰り返せるかを見ます。",
      ],
    },
    {
      id: "electrical-thermal",
      heading: "高速信号・大電流・ケルビン測定・熱制御を同じテストセルで成立させる",
      lead: "高性能パッケージでは、電気と熱を別々に設計できません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "RESISTANCE", title: "接触抵抗", body: "接触子上下、基板パッド、製品端子を含む抵抗と、繰り返しによる変動を管理します。" },
            { label: "SPEED", title: "高速・高周波", body: "信号経路長、インピーダンス、損失、反射、クロストーク、基板との境界を管理します。" },
            { label: "POWER", title: "高電流・電圧", body: "電圧降下、接触発熱、並列ピン、絶縁距離、安全、異常時保護を設計します。" },
            { label: "KELVIN", title: "低抵抗測定", body: "電流と電圧経路を分離し、パワー端子などの小さな抵抗を測りやすくします。" },
            { label: "COOLING", title: "製品冷却", body: "ヒートシンク、空冷、液冷、熱界面、温度センサーをリッドとハンドラへ統合します。" },
            { label: "EXPANSION", title: "熱変形", body: "製品、ソケット、接触子、基板の膨張差と反りを温度範囲で確認します。" },
          ],
        },
        {
          type: "note",
          title: "最大周波数・電流・冷却能力を、そのまま企業順位にしない",
          body: "パッケージ、ピッチ、接触子、基板、サイト数、温度、試験時間で前提が異なります。同じテストセル条件で波形・電圧降下・製品温度・接触寿命を確認します。",
        },
      ],
      paragraphs: [
        "エンプラスは高周波、耐熱、微細・多ピン、高発熱製品向けのソケット技術を示しています。WinWayは高速・高周波テスト、バーンイン、空冷・液冷を含むパッケージテスト製品を公開しています。",
        "冷却部を強く押し当てると、製品とソケットへ機械荷重が加わります。接触荷重、基板変形、熱界面、冷却配管、ハンドラ動作を一つの機械・熱系として検証します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "主要メーカーは、試験段階・接触技術・熱・テストセル範囲が異なる",
      lead: "代表企業を順位ではなく、公式に確認できる製品領域へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な製品領域",
          rows: [
            { left: "山一電機", right: "量産テスト・バーンイン用ICソケット、BGA・LGA・QFNなど、高周波・大電流・熱・ケルビン、カスタムソケットと保守サービス" },
            { left: "エンプラス", right: "バーンイン・電気試験用ICソケット、微細・多ピン、高周波、耐熱、高発熱製品向けの接触・樹脂・熱ソリューション" },
            { left: "Cohu", right: "スプリング・ケルビン・RF・同軸・パワーなどのテストコンタクタ／プローブヘッド、接触子とハンドラ・ATEを含むテストセル領域" },
            { left: "WinWay Technology", right: "量産・開発・SLT向けテストソケット、同軸、高速・高周波、バーンイン、接触子、空冷・液冷を含む熱制御製品" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、網羅的な市場順位ではない",
          body: "ソケット企業は試験段階、パッケージ、接触子、地域、熱製品、テストセル統合範囲が異なります。企業名だけで優劣を決めず、同じ用途の製品・支援を確認してください。",
        },
      ],
      paragraphs: [
        "山一電機とエンプラスはICソケットと接触・樹脂・熱技術、Cohuはコンタクタとハンドラ・ATEを含む統合、WinWayはウェーハからパッケージ・熱までのインターフェースとして企業研究できます。",
        "同じ企業でも量産テスト、バーンイン、SLT、開発用で製品が分かれます。公式サイトで対象パッケージ、試験段階、接触子、信号・電流、熱、交換部品まで確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "テストソケットメーカーを比較する8つの軸",
      lead: "同じパッケージ・試験・ハンドラ・基板条件へそろえます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "試験段階", body: "量産最終検査、バーンイン、SLT、開発・信頼性のどこか" },
            { label: "02", title: "パッケージ", body: "BGA、LGA、QFN、QFPなどの外形、端子、ピッチ、反り、公差" },
            { label: "03", title: "接触構造", body: "スプリング、ブレード、ケルビン、同軸、多点と先端・移動量" },
            { label: "04", title: "電気性能", body: "抵抗、電流、電圧、周波数、損失、反射、クロストーク、漏れ" },
            { label: "05", title: "熱・機械", body: "温度、発熱、冷却、平行度、単ピン・総荷重、基板変形" },
            { label: "06", title: "寿命・保守", body: "接触回数、抵抗変化、清掃、接触子交換、修理、作業時間、履歴" },
            { label: "07", title: "テストセル適合", body: "ATE、ロードボード、ハンドラ、プランジャ、並列サイト、段取り" },
            { label: "08", title: "品質・支援", body: "設計検証、解析、試作、納期、変更管理、現地立ち上げ、供給体制" },
          ],
        },
      ],
      paragraphs: [
        "最小ピッチ、最高周波数、最大電流、接触寿命などは、製品と条件が違えば横並びにできません。共通のパッケージ図面・試験仕様・温度・基板・ハンドラ条件で評価します。",
        "量産価値は初期の接触抵抗だけで決まりません。接触不良率、再試験、交換時間、基板損傷、部品在庫、修理期間、サイト相関、停止からの復旧まで確認します。",
      ],
    },
    {
      id: "lifecycle-jobs",
      heading: "ソケットのライフサイクルと職種は、製品設計から量産保守まで続く",
      lead: "新パッケージへ短期間で適合し、接触状態を長く安定させます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・工程",
          rightLabel: "主な仕事",
          rows: [
            { left: "アプリケーション・設計", right: "パッケージ、試験、ATE、基板、ハンドラ、温度からソケット構成を決める" },
            { left: "機械・接触設計", right: "ガイド、接触子、リテーナ、プランジャ、リッド、荷重、平行度、交換構造を設計する" },
            { left: "電気・信号解析", right: "抵抗、電流、電圧、高速信号、同軸、ケルビン、基板境界を解析・評価する" },
            { left: "熱・流体設計", right: "ヒートシンク、空冷・液冷、熱界面、温度センサー、結露、安全を設計する" },
            { left: "材料・精密加工", right: "接触子、ばね、樹脂、金属部品を微細加工・成形し、寸法と耐久性を作り込む" },
            { left: "生産・品質", right: "組立、位置・高さ・抵抗検査、工程能力、変更、トレーサビリティ、供給を管理する" },
            { left: "フィールド・修理", right: "テストセル相関、接触不良解析、清掃、接触子交換、修理、量産復帰を支援する" },
            { left: "営業技術", right: "顧客の図面・試験課題を整理し、標準・カスタム製品、試作、納期、保守を提案する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "プローブカードメーカー", href: "/guides/semiconductor-probe-card-manufacturers", description: "ウェーハ段階でダイ電極へ接触する部品企業を見る" },
            { label: "パッケージング装置メーカー", href: "/guides/semiconductor-packaging-equipment-manufacturers", description: "テスト前に製品を組み立てる装置と主要企業を見る" },
            { label: "装置エンジニアへの転職", href: "/guides/equipment-engineer-route", description: "装置保全・立ち上げ経験のつなぎ方を見る" },
          ],
        },
      ],
      paragraphs: [
        "精密部品、ばね・接触、樹脂成形、高速基板、熱設計、治具、自動機、品質、生産技術、保全、故障解析の経験はソケット企業へ接点を整理しやすい領域です。",
        "経験を説明するときは、接触抵抗、位置・高さ、寿命、交換時間、温度、信号、微細加工、工程能力、不良解析のどこへ貢献したかを担当製品と一緒に整理します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体テストソケットメーカーでよくある質問",
      lead: "コンタクタ、バーンイン、プローブカードとの違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体テストソケットとは何ですか？", answer: "パッケージ後の半導体端子とロードボード・ATEの間に、一時的で交換可能な電気接続を作る検査用部品です。位置、荷重、信号、電流、熱も管理します。" },
            { question: "主なテストソケットメーカーは？", answer: "この記事では山一電機、エンプラス、Cohu、WinWay Technologyを代表例として紹介しています。試験用途・接触技術別の例であり、網羅的な市場順位ではありません。" },
            { question: "テストコンタクタとテストソケットの違いは？", answer: "企業や製品によって呼び方が重なります。どちらもパッケージ端子とテスタ側を接続しますが、コンタクタは交換式の接触部を強調して使われることがあります。名称より構造と用途を確認します。" },
            { question: "バーンインソケットとの違いは？", answer: "量産テストソケットは機能・性能を短いサイクルで多数回測る用途が中心です。バーンインソケットは多数製品を高温・電圧条件で比較的長時間動作させる用途が中心です。" },
            { question: "プローブカードとの違いは？", answer: "プローブカードは主に個片化前のウェーハ上の微細電極へ接触します。テストソケットは主にパッケージ後のBGA・LGA・QFNなどの外部端子へ接触します。" },
            { question: "ケルビンソケットは何を測りますか？", answer: "一つの端子へ電流経路と電圧測定経路を分けて接触し、配線・接触抵抗の影響を小さくして低抵抗や電圧降下を測りやすくします。" },
            { question: "テストソケットは消耗しますか？", answer: "繰り返し接触により接触子の汚れ・摩耗、ばね特性、抵抗、ガイド状態などが変化します。清掃、検査、接触子交換、修理、寿命判定を運用へ組み込みます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜試験・パッケージ・接触・電気・熱・保守をそろえてメーカーを見る",
      lead: "テストソケットは、ATEの測定能力をパッケージ端子へ届ける製品別インターフェースです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "TEST", title: "試験段階を決める", body: "量産、バーンイン、SLT、開発・信頼性のどこで使うか確認する" },
            { label: "PACKAGE", title: "端子へ合わせる", body: "外形、端子、ピッチ、反り、公差から接触子とガイドを選ぶ" },
            { label: "PERFORMANCE", title: "電気と熱を見る", body: "抵抗、速度、電流、ケルビン、温度、冷却、荷重を一つの系で見る" },
            { label: "LIFECYCLE", title: "運用まで比較する", body: "寿命、清掃、交換、修理、ハンドラ・基板適合、支援を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "最終検査", href: "/guides/semiconductor-final-test", description: "ソケットを使う搬送・温度・電気試験の工程を見る" },
            { label: "テストハンドラメーカー", href: "/guides/semiconductor-test-handler-manufacturers", description: "製品をソケットへ搬送・押付けする装置を見る" },
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "ソケットへ信号を送るATE本体と主要企業を見る" },
            { label: "プローブカードメーカー", href: "/guides/semiconductor-probe-card-manufacturers", description: "ウェーハテスト側の接触部品と主要企業を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置・テスト企業を一つの地図で見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "テスト・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのソケットを選び、試験段階、パッケージ、接触子、信号・電流、温度・冷却、寿命、保守の7項目で整理してください。同じテストセル条件へそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "山一電機・エンプラス・Cohu・WinWayから1社を選び、公式製品を試験段階・パッケージ・接触構造・電気性能・熱・保守の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-final-test",
    "semiconductor-test-handler-manufacturers",
    "semiconductor-tester-ate",
    "semiconductor-probe-card-manufacturers",
    "semiconductor-packaging-equipment-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-packaging-process",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: [],
};
