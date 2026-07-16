import type { GuideArticle } from "@/content/guides/types";

export const semiconductorTestHandlerManufacturersGuide: GuideArticle = {
  slug: "semiconductor-test-handler-manufacturers",
  title: "半導体テストハンドラメーカーとは？Cohu・アドバンテストなどを初心者向けに図解",
  description:
    "半導体テストハンドラは、パッケージ製品を搬送・温度調整し、ソケットへ接触させ、ATEの判定結果で分類する装置です。ピック＆プレース・重力・タレット・ストリップ方式、主要メーカー、比較方法、仕事内容を図解します。",
  targetQuery: "半導体 テストハンドラ メーカー",
  searchIntent:
    "半導体テストハンドラの構成、ピック＆プレース・重力・タレット・ストリップ方式の違い、Cohu・アドバンテスト・Chroma・Techwingなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Cohu、アドバンテスト、Chroma ATE、Techwingの公式製品・技術情報をもとに、搬送方式、温度制御、並列試験、ソケット接触、FT・SLTの装置構成と企業の担当領域を整理しました。市場シェアや企業の優劣ではなく、対象パッケージ、搬送方式、試験段階、温度、並列数をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存の最終検査記事でテスタ・ハンドラ・ソケット、温度試験、ビニングの原理を整理し、半導体テスタ記事でATE本体を扱ったうえで、搬送・温度・接触を担うハンドラ企業を独立して調べる記事が必要だと判断",
    "Cohuとアドバンテストの公式情報で、ピック＆プレース・重力・タレット・ストリップ、SoC・メモリ向けハンドラ、温度制御・インターフェースの製品領域を確認",
    "Chroma ATEとTechwingの公式情報で、FT・SLT、RF・センサー、メモリ・ロジック向けハンドラと並列・温度対応を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Test Handlers",
      url: "https://www.cohu.com/test-handlers",
      publisher: "Cohu, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Optical Sensor Test Solution",
      url: "https://www.cohu.com/optical-sensor-test",
      publisher: "Cohu, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Test Handler",
      url: "https://www.advantest.com/en/products/component-test-system/test-handler/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "What Is ATE? Probers and Test Handlers",
      url: "https://www.advantest.com/en/semiconductor-basics/automated-test-equipment/",
      publisher: "Advantest Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "IC Pick & Place Handler",
      url: "https://www.chromaate.com/en/products_list/ic_pick_place_handler",
      publisher: "Chroma ATE Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Memory Test Handler: SLT Handler",
      url: "https://www.techwing.co.kr/eng/product/product01_01.asp?str_no=91",
      publisher: "Techwing, Inc.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "テストハンドラを調べても、テスタとの違い、ピック＆プレース・重力・タレット・ストリップ方式、温度制御や並列数が何を意味し、Cohu・アドバンテストなどをどう比べればよいか分かりにくくありませんか。",
    conclusion:
      "テストハンドラは、供給・識別、温度調整、向き・位置合わせ、ソケット接触、ATEとの同期、結果別排出を自動化します。企業比較では、対象デバイス、供給形態、搬送方式、FT・SLT、温度・自己発熱、並列数、インターフェースをそろえます。",
    learnings:
      "テストハンドラの役割と構成、ピック＆プレース・重力・タレット・ストリップ、SoC・メモリ・センサー・パワー、温度制御、ソケット・ドッキング、並列試験、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "テストハンドラメーカーを比べるときは、搬送速度だけでなく、『何を、どの供給形態から、何個並列で、どの温度へ整え、どのテスタ・ソケットへ接触させるか』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜製品を供給し、温度・接触を整えて結果別に排出する",
      description:
        "代表的なパッケージ最終試験を単純化しています。搬送経路、温度方式、並列サイト、供給・排出形態はハンドラ方式と製品で異なります。",
      stages: [
        { label: "01 / LOAD", title: "製品を供給", body: "トレー、チューブ、リール、ストリップなどから製品を取り込み、向きとIDを確認する" },
        { label: "02 / CONDITION", title: "温度を整える", body: "常温・高温・低温の試験条件へ近づけ、必要に応じて自己発熱を除く" },
        { label: "03 / ALIGN", title: "位置を合わせる", body: "製品端子とソケット・コンタクタを正しい向き・位置・高さへ合わせる" },
        { label: "04 / CONTACT", title: "押し当てて試験", body: "必要な荷重で接触し、ATEへ準備完了を伝えて電気試験を実行する" },
        { label: "05 / RECEIVE", title: "判定を受け取る", body: "ATEから合否・性能ビン・再試験指示を受け取り、製品IDへ記録する" },
        { label: "06 / SORT", title: "結果別に排出", body: "指定トレー・チューブ・リールなどへ分類し、マーキング・包装へ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "供給・排出機構", right: "トレー、チューブ、リール、ストリップなどから製品を取り込み、結果別に戻す" },
        { left: "搬送・姿勢制御", right: "製品を吸着・把持・落下・回転させ、端子を傷めず試験位置へ運ぶ" },
        { left: "温度調整・熱制御", right: "空気、接触式熱源・冷却などで製品温度を整え、自己発熱を管理する" },
        { left: "画像・ID認識", right: "向き、端子、外観、2Dコードなどを確認し、誤投入・誤配置を防ぐ" },
        { left: "テストサイト・押付け", right: "製品をソケットへ位置合わせし、複数サイトへ必要な荷重で接触させる" },
        { left: "ドッキング・インターフェース", right: "ハンドラ、テストヘッド、ロードボード、ソケットを機械・電気的に統合する" },
        { left: "ATE同期・ビニング", right: "試験開始・完了、合否、再試験、性能分類をテスタとやり取りする" },
        { left: "制御・安全・データ", right: "レシピ、製品・治具ID、温度、サイト、詰まり、保守、工場接続を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "テストハンドラメーカーとは、パッケージ試験の物理動作を自動化する企業",
      lead: "テスタが電気を測り、ハンドラが製品を運び、温度と接触を作ります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MOVE", title: "製品を運ぶ", body: "大量の製品を正しい向きで、詰まり・傷・取り違えを抑えて搬送します。" },
            { label: "THERMAL", title: "温度を整える", body: "試験条件へ製品温度を近づけ、通電中の自己発熱も管理します。" },
            { label: "CONTACT", title: "安定して接触する", body: "端子とソケットを位置合わせし、サイトごとの接触荷重をそろえます。" },
            { label: "SORT", title: "判定どおり分ける", body: "ATE結果と製品IDを結び、合否・性能ビン・再試験へ分類します。" },
          ],
        },
        {
          type: "note",
          title: "ATE本体・最終検査記事と検索意図を分ける",
          body: "電気信号を生成・測定するATEと企業比較は半導体テスタ記事、最終検査の原理は技術記事で説明します。本記事はハンドラ方式、温度・接触・搬送、企業、選定方法を扱います。",
        },
      ],
      paragraphs: [
        "アドバンテストはテストハンドラを、最終試験を自動化し、製品搬送、試験中の温度制御、結果に基づく選別を行う装置と説明しています。テスタとハンドラは信号をやり取りしながら同じサイクルを繰り返します。",
        "装置メーカーはロボット、精密搬送、画像認識、熱、接触機構、空圧・流体、制御、通信、安全を統合し、ATE・ソケット・製品へ適合するハンドリングシステムを提供します。",
      ],
    },
    {
      id: "test-cell",
      heading: "テストセルでは、テスタ・ハンドラ・ソケットの境界を決める",
      lead: "測定不良を製品不良と誤認しないため、各要素の役割と責任範囲を分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "テストセル要素",
          rightLabel: "主な役割とハンドラとの接点",
          rows: [
            { left: "ATE・テストヘッド", right: "電源・信号を出して応答を測る。ハンドラへ開始・終了・ビン情報を送る" },
            { left: "ロードボード", right: "テスタ資源をソケットまで配線する。ハンドラのドッキングと干渉・荷重を合わせる" },
            { left: "ソケット・コンタクタ", right: "製品端子へ繰り返し接触する。パッケージ形状、電気性能、温度、寿命を合わせる" },
            { left: "テストハンドラ", right: "供給、温度、位置、押付け、搬送、排出を担い、試験サイトを稼働させる" },
            { left: "チェンジキット・治具", right: "製品形状や供給形態へ機械経路を合わせる。段取り・保管・ID・摩耗を管理する" },
            { left: "工場・データ系", right: "製品ID、レシピ、テスタ・サイト、温度、ビン、装置状態を製造履歴へ結び付ける" },
          ],
        },
      ],
      paragraphs: [
        "接触が不安定な場合、原因は製品端子、ソケット、押付け位置・荷重、ロードボード、テスタ、温度のどこにもあり得ます。ハンドラ単体で接触性能を評価せず、テストセルで確認します。",
        "ハンドラとテスタを別企業から選ぶ場合も、テストヘッド位置、ドッキング、信号・通信、並列サイト、タイミング、保守空間を合わせます。装置間の責任境界を立ち上げ前に決めます。",
      ],
    },
    {
      id: "handler-types",
      heading: "ピック＆プレース・重力・タレット・ストリップは、搬送原理が違う",
      lead: "供給形態、パッケージ、速度、温度、検査工程で方式を選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "ハンドラ方式",
          rightLabel: "特徴と用途の見方",
          rows: [
            { left: "ピック＆プレース", right: "ロボット・吸着機構でトレーなどから製品を取り、試験位置へ置く。大型・多様なパッケージ、温度・多サイトへ柔軟" },
            { left: "重力式", right: "チューブなどから製品を重力で流し、位置決めして試験・分類する。形状が適合する量産品で高い搬送性を狙う" },
            { left: "タレット式", right: "回転円盤の複数ステーションで搬送、試験、外観・マーキング・分類などを並行処理する" },
            { left: "ストリップ・バッチ式", right: "個片化前のリードフレーム・基板・キャリア上の複数製品をまとめて接触・試験する" },
            { left: "センサー専用", right: "光、圧力、磁気、MEMSなどへ刺激を与える機構と、搬送・温度・電気試験を統合する" },
            { left: "SLTハンドラ", right: "ソケット・基板・ソフトウェアを使うシステムレベル試験へ製品を搬送し、長い試験時間と自己発熱へ対応する" },
          ],
        },
        {
          type: "note",
          title: "方式は速度の順位ではない",
          body: "製品形状、端子、壊れやすさ、供給・包装、温度、検査・マーキング、試験時間で適する方式が変わります。同じ処理能力でも詰まり、傷、段取り、設置面積が異なります。",
        },
      ],
      paragraphs: [
        "Cohuは公式情報でピック＆プレース、重力、タレット、ストリップ／バッチ、センサー試験などのハンドラ領域を示しています。単一方式の会社としてではなく、対象製品ごとのプラットフォームを確認します。",
        "Chromaはピック＆プレース型を中心に、FT・SLT、RF、センサー、小型ICなどの製品を公開しています。Techwingはメモリ・ロジック、ストリップ、SLTなどのハンドラを案内しています。",
      ],
    },
    {
      id: "device-applications",
      heading: "SoC・メモリ・センサー・パワーでは、ハンドリング課題が変わる",
      lead: "同じBGA形状でも、発熱、端子数、試験時間、並列性が異なります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SOC", title: "SoC・ロジック", body: "多様なパッケージ、複数温度、細かい端子、比較的長い試験と高い自己発熱へ対応します。" },
            { label: "MEMORY", title: "メモリ", body: "多数個の並列試験、安定した温度・接触、低い搬送待ち時間、ロット切替を重視します。" },
            { label: "POWER", title: "パワー", body: "大型・重量パッケージ、大きな接触荷重、発熱、高電圧・大電流インターフェース、安全へ対応します。" },
            { label: "SENSOR", title: "センサー・MEMS", body: "光、圧力、磁気、音、動きなどの刺激と、電気・温度・位置を統合します。" },
            { label: "RF", title: "RF・無線", body: "信号経路、シールド・隔離、アンテナ・無線環境、サイト間干渉を考慮します。" },
            { label: "SLT", title: "システムレベル試験", body: "大きなソケット・基板、長時間通電、ソフトウェア、発熱、並列サイトの稼働を管理します。" },
          ],
        },
      ],
      paragraphs: [
        "アドバンテストはSoC向けとメモリ向けのテストハンドラを分けて公開しています。ハンドラ企業を比較するときは、会社名ではなく対象デバイスと製品プラットフォームを一致させます。",
        "Cohuは光学センサー向けにピック＆プレース、タレット、重力、ストリップなどの解決策を示しています。センサーでは刺激発生と測定位置・角度・温度の再現が装置構成へ加わります。",
      ],
    },
    {
      id: "thermal-control",
      heading: "温度制御は、空気温度ではなく試験中の製品温度を安定させる",
      lead: "通電で発熱するデバイスでは、冷却・加熱と試験タイミングを同期します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "温度制御要素",
          rightLabel: "確認すること",
          rows: [
            { left: "プレコンディショニング", right: "試験前に製品を目標温度へ近づけ、内部と表面の温度差を小さくする" },
            { left: "テストサイト熱接触", right: "接触式の熱源・冷却部や空気を製品へ届け、サイトごとの差を抑える" },
            { left: "アクティブ温度制御", right: "通電中の自己発熱を検知・予測し、試験中に加熱・冷却を調整する" },
            { left: "センサー位置", right: "どこで温度を測り、製品接合部温度とどの程度対応するかを校正する" },
            { left: "結露・霜", right: "低温時の水分付着を乾燥空気、パージ、露点、搬送設計で防ぐ" },
            { left: "温度切替", right: "昇降温、安定待ち、製品切替、複数温度試験を処理能力と両立する" },
          ],
        },
      ],
      paragraphs: [
        "アドバンテストとChromaは複数温度・アクティブ温度制御へ対応するハンドラ製品を公開しています。Cohuも温度精度と高発熱デバイスへの動的な熱管理を製品領域で示しています。",
        "設定温度が同じでも、製品の消費電力、パッケージ熱抵抗、サイト位置、ソケット、接触部、試験時間で実温度は変わります。温度校正と電気測定の相関を製品条件ごとに確認します。",
      ],
    },
    {
      id: "contact-interface",
      heading: "ソケット・押付け・ドッキングが、ハンドラとATEを一つの測定系へする",
      lead: "位置と荷重がずれると、正常品でも接触不良として不合格になり得ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "接触・統合項目",
          rightLabel: "量産上の役割",
          rows: [
            { left: "製品位置・向き", right: "端子をソケット接点へ合わせ、反転、回転、浮き、異物を検知する" },
            { left: "押付け荷重", right: "接点を導通させる荷重を与え、製品・基板・ソケットの損傷とサイト差を抑える" },
            { left: "プランジャ・治具", right: "製品外形、リッド、端子、熱接触へ合う形状で力と熱を伝える" },
            { left: "ソケット清掃・寿命", right: "接点の汚れ・摩耗を監視し、清掃、交換、サイト履歴を管理する" },
            { left: "ドッキング", right: "テストヘッド、ロードボード、ハンドラの位置・剛性・保守空間を再現する" },
            { left: "チェンジキット", right: "パッケージと供給形態へ搬送経路を合わせ、誤部品・摩耗・段取りを管理する" },
          ],
        },
      ],
      paragraphs: [
        "製品切替ではソケットだけでなく、ガイド、吸着部、プランジャ、トレー・チューブ経路、画像レシピ、温度部材などを変更します。チェンジキットの部品点数、交換時間、誤組付け防止、保管も比較項目です。",
        "接触不良が増えたときは製品だけでなく、サイト、ソケット、押付け位置・荷重、治具、温度、ロードボード、テスタを確認します。再試験で合格しても初回データを残して原因を追います。",
      ],
    },
    {
      id: "parallel-throughput",
      heading: "並列数と処理能力は、テスタ待ち・搬送待ち・温度待ちの釣り合いで決まる",
      lead: "ハンドラ単体の最高速度ではなく、テストセル全体のサイクルを見ます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SITES", title: "並列サイト", body: "複数製品を同時接触し、テスタ資源・温度・荷重をサイト間でそろえます。" },
            { label: "INDEX", title: "インデックス時間", body: "試験済み製品を排出し、次の製品を接触位置へ入れる非測定時間を短くします。" },
            { label: "SOAK", title: "温度待ち", body: "目標温度へ達する時間と、試験中の熱制御を並列搬送へ組み込みます。" },
            { label: "TEST", title: "試験時間", body: "短い試験では搬送が、長い試験ではテスタ・ソケット占有がボトルネックになりやすくなります。" },
            { label: "JAM", title: "詰まり・停止", body: "製品姿勢、静電気、摩擦、異物、治具摩耗による停止と復旧時間を減らします。" },
            { label: "CHANGE", title: "段取り", body: "製品・温度・ロット切替、治具交換、校正、初品確認を短く正確に行います。" },
          ],
        },
        {
          type: "note",
          title: "最大UPHや並列数を、そのまま企業順位にしない",
          body: "試験時間、パッケージ、温度、サイト構成、供給・排出、再試験、検査条件で処理能力は変わります。同じ条件でテストセルの実効処理量と稼働率を確認します。",
        },
      ],
      paragraphs: [
        "ChromaやTechwingは製品ページで多サイト・並列試験と処理能力を案内していますが、仕様値の前提が異なります。比較では製品形状、温度、試験時間、供給形態、ビン数をそろえます。",
        "テスタが待っているのか、ハンドラが試験完了を待っているのか、温度調整・ソケット清掃・再試験で止まっているのかを時間分解すると、改善対象が見えます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "主要メーカーは、搬送方式・対象デバイス・テストセル範囲が異なる",
      lead: "代表企業を順位ではなく、公式に確認できる装置領域へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な製品領域",
          rows: [
            { left: "Cohu", right: "ピック＆プレース、重力、タレット、ストリップ／バッチ、センサー向けハンドラとコンタクタ・インターフェースなど" },
            { left: "アドバンテスト", right: "SoC・メモリ向けテストハンドラ、チェンジキット、センサー刺激装置、ATE・デバイスインターフェースを含むテストセル" },
            { left: "Chroma ATE", right: "ピック＆プレース型を中心に、FT・SLT、複数温度、RF、小型IC・センサーなどのハンドラ" },
            { left: "Techwing", right: "メモリ・ロジック向けテストハンドラ、ストリップ・SLTハンドラなど" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、網羅的な市場順位ではない",
          body: "ハンドラ企業は搬送方式、デバイス、地域、FT・SLT、インターフェースの提供範囲が異なります。企業名だけで優劣を決めず、同じ試験用途と装置カテゴリーを確認してください。",
        },
      ],
      paragraphs: [
        "Cohuは複数の搬送方式とセンサー・コンタクタ領域、アドバンテストはATE・ハンドラ・デバイスインターフェースをつなぐテストセルとして企業研究できます。製品単体と統合範囲を分けて見ます。",
        "Chromaはピック＆プレースとFT・SLT・RFなど、Techwingはメモリ・ロジック・SLTなどを公式製品で示しています。比較する場合は対象デバイス、温度、並列、供給形態をそろえます。",
      ],
    },
    {
      id: "comparison",
      heading: "テストハンドラメーカーを比較する7つの軸",
      lead: "カタログ速度ではなく、同じ製品・温度・試験時間へそろえます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "対象製品", body: "SoC、メモリ、パワー、センサー、RF、パッケージ寸法・端子・重量" },
            { label: "02", title: "試験段階", body: "最終検査、SLT、センサー刺激、研究開発・量産のどこか" },
            { label: "03", title: "搬送方式", body: "ピック＆プレース、重力、タレット、ストリップと供給・排出形態" },
            { label: "04", title: "温度・発熱", body: "温度範囲、安定時間、実温度、自己発熱、サイト差、結露対策" },
            { label: "05", title: "接触・並列", body: "サイト数、位置・荷重、ドッキング、ソケット、チェンジキット" },
            { label: "06", title: "生産性", body: "試験・インデックス・温度待ち、詰まり、段取り、稼働率、設置面積" },
            { label: "07", title: "統合・データ", body: "対応ATE、インターフェース、ビン、ID、工場接続、状態監視、サービス" },
          ],
        },
      ],
      paragraphs: [
        "最大並列数、温度範囲、処理能力は、製品、試験時間、サイト、温度、供給形態、再試験条件で変わります。異なる前提の数字を企業順位として横並びにしません。",
        "量産価値は搬送速度だけでは決まりません。製品傷、接触再現性、温度相関、詰まり、ソケット寿命、チェンジキット、校正・保守、復旧、データ連携まで確認します。",
      ],
    },
    {
      id: "ecosystem",
      heading: "周辺には、ATE・ソケット・基板・温度・包装・検査企業がいる",
      lead: "ハンドラはテストセルと後工程物流の中央に位置します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "周辺領域",
          rightLabel: "ハンドラとのつながり",
          rows: [
            { left: "ATE・テストヘッド", right: "試験開始・終了・判定をやり取りし、並列サイトと測定時間を決める" },
            { left: "ロードボード・ソケット", right: "製品端子へ電気経路を作り、ドッキング、位置、荷重、温度へ適合する" },
            { left: "温度制御機器", right: "加熱・冷却・乾燥空気、センサー、熱接触部で製品温度を作る" },
            { left: "チェンジキット・治具", right: "パッケージ、トレー、チューブ、リール、ストリップへ搬送経路を合わせる" },
            { left: "包装・マーキング", right: "結果別製品をトレー、チューブ、テープなどへ収容し、識別情報を付ける" },
            { left: "外観・センサー刺激", right: "画像検査や光・圧力・磁気などの刺激をハンドラの搬送位置へ統合する" },
            { left: "データ・MES", right: "製品ID、サイト、温度、ソケット、ビン、装置状態をロット履歴へ結び付ける" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "電気信号を生成・測定するATE本体と主要企業を見る" },
            { label: "テストソケットメーカー", href: "/guides/semiconductor-test-socket-manufacturers", description: "製品端子とロードボードをつなぐ接触部品を見る" },
            { label: "ウェーハプローバメーカー", href: "/guides/semiconductor-wafer-prober-manufacturers", description: "個片化前のウェーハをプローブカードへ接触させる装置を見る" },
            { label: "最終検査の仕組み", href: "/guides/semiconductor-final-test", description: "搬送・温度・接触・試験・ビニングの工程を見る" },
            { label: "パッケージング装置メーカー", href: "/guides/semiconductor-packaging-equipment-manufacturers", description: "最終検査前の接合・封止装置を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業研究ではハンドラ本体だけでなく、ATE、ソケット・コンタクタ、ロードボード、温度制御、チェンジキット、外観・刺激装置、包装、データのどこへ自分の経験がつながるかを見ます。",
        "テストセルは複数企業の装置・部品で構成されます。測定・機械・熱・物流・データのインターフェースを誰が設計・保証するかが立ち上げと量産保守に重要です。",
      ],
    },
    {
      id: "jobs",
      heading: "テストハンドラメーカーの主な職種",
      lead: "精密搬送・熱・接触・画像・ソフトウェアを量産テストへ統合します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種",
          rightLabel: "主な仕事",
          rows: [
            { left: "アプリケーション・テストセル", right: "製品、ATE、ソケット、温度、並列、搬送方式を組み合わせ、試験セルを立ち上げる" },
            { left: "機械・ロボット・搬送", right: "ピック、重力、タレット、ストリップ、軸、治具、詰まり・傷対策を設計する" },
            { left: "熱・流体", right: "加熱・冷却、空気、熱接触、自己発熱、結露、サイト温度均一性を設計する" },
            { left: "接触・インターフェース", right: "押付け、位置、ドッキング、ソケット、ロードボード、チェンジキットを統合する" },
            { left: "画像・センサー", right: "向き、端子、外観、ID、位置、製品残り、詰まりを認識する" },
            { left: "制御・ソフトウェア", right: "搬送シーケンス、ATE通信、レシピ、ビン、UI、工場・状態監視を開発する" },
            { left: "フィールドサービス", right: "据付、ドッキング・温度・接触調整、治具交換、故障解析、量産復帰を支える" },
            { left: "生産・品質・安全", right: "装置組立、精度・温度検査、変更管理、供給、可動部・高低温安全を管理する" },
          ],
        },
      ],
      paragraphs: [
        "自動機、ロボット、搬送、画像処理、温調、流体、精密接触、治具、装置保全、品質、工場データの経験は接点を整理しやすい領域です。",
        "経験を説明するときは、搬送精度、製品傷、接触、温度、処理能力、詰まり、段取り、稼働率、復旧時間、トレーサビリティ、安全のどこへ貢献したかを担当装置と一緒に言語化します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体テストハンドラメーカーでよくある質問",
      lead: "テスタ・プローバ・ハンドラと搬送方式の違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体テストハンドラとは何ですか？", answer: "パッケージ後の半導体を供給・搬送・温度調整し、ソケットへ接触させ、ATEの判定に従って合否・性能ビンへ分類する自動装置です。" },
            { question: "主なテストハンドラメーカーは？", answer: "この記事ではCohu、アドバンテスト、Chroma ATE、Techwingを代表例として紹介しています。装置方式・対象デバイス別の例であり、網羅的な市場順位ではありません。" },
            { question: "テスタとテストハンドラの違いは？", answer: "テスタは電源・信号を与えて応答を測定・判定します。ハンドラは製品を運び、温度と接触位置を整え、結果別に分類します。" },
            { question: "ウェーハプローバとテストハンドラの違いは？", answer: "プローバは個片化前のウェーハを保持し、プローブカードをダイ電極へ接触させます。ハンドラはパッケージ後の個々の製品を搬送し、ソケットへ接触させます。" },
            { question: "ピック＆プレースと重力式の違いは？", answer: "ピック＆プレースはロボットなどで製品を個別に取り上げて置きます。重力式はチューブなどから製品を流して搬送します。製品形状、温度、速度、柔軟性で選びます。" },
            { question: "FTハンドラとSLTハンドラの違いは？", answer: "FTはATEで個別デバイスの電気特性・機能を量産判定する最終検査、SLTは実使用に近い基板・ソフトウェア環境で動作を確認します。試験時間、ソケット、発熱、搬送が異なります。" },
            { question: "並列数が多いほどよいですか？", answer: "必ずしもそうではありません。テスタ資源、試験時間、温度、接触荷重、サイト相関、供給速度、稼働率が釣り合う範囲で、テストセル全体の実効処理量を見ます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象製品・搬送方式・温度・並列・テストセルをそろえてメーカーを見る",
      lead: "テストハンドラは、ATEの測定能力を量産の搬送・温度・接触へ変える装置です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "DEVICE", title: "対象製品を決める", body: "SoC、メモリ、パワー、センサー、RF、SLTとパッケージを確認する" },
            { label: "HANDLE", title: "搬送方式を選ぶ", body: "ピック＆プレース、重力、タレット、ストリップを用途へ合わせる" },
            { label: "CONDITION", title: "温度と接触を作る", body: "実温度、自己発熱、位置、荷重、ソケット、ドッキングをそろえる" },
            { label: "CELL", title: "テストセルで比較する", body: "ATE、並列、試験時間、処理能力、稼働率、治具、データを見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体テスタ", href: "/guides/semiconductor-tester-ate", description: "ATEの仕組みとアドバンテスト・Teradyneなどを見る" },
            { label: "最終検査", href: "/guides/semiconductor-final-test", description: "テスタ・ハンドラ・ソケットの工程原理を見る" },
            { label: "パッケージング装置メーカー", href: "/guides/semiconductor-packaging-equipment-manufacturers", description: "最終検査前のダイ接合・封止装置を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置企業を一つの地図で見る" },
            { label: "ウェーハテスト", href: "/guides/semiconductor-wafer-test", description: "プローバとプローブカードを使う個片化前試験を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "テスタ・ハンドラ・OSAT・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのハンドラを選び、対象製品、FT・SLT、搬送方式、供給形態、温度、並列サイト、対応ATE・ソケットを確認してください。同じ試験用途へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "Cohu・アドバンテスト・Chroma・Techwingから1社を選び、公式製品を搬送方式・対象デバイス・温度・並列・FT／SLTの5項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-test-socket-manufacturers",
    "semiconductor-wafer-prober-manufacturers",
    "semiconductor-tester-ate",
    "semiconductor-final-test",
    "semiconductor-packaging-equipment-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-wafer-test",
    "semiconductor-packaging-process",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["advantest"],
};
