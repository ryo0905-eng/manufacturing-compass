import type { GuideArticle } from "@/content/guides/types";

export const semiconductorRfPowerMatchingManufacturersGuide: GuideArticle = {
  slug: "semiconductor-rf-power-matching-manufacturers",
  title: "半導体用RF電源・マッチングユニットメーカーとは？MKS・Advanced Energy・ダイヘン・Cometを図解",
  description:
    "半導体製造装置でプラズマを作るRF電源とマッチングユニットについて、発振、インピーダンス整合、進行波・反射波、パルス、多周波、主要メーカー、比較軸を初心者向けに図解します。",
  targetQuery: "半導体 RF 電源 メーカー",
  searchIntent:
    "半導体の成膜・エッチング装置で使うRF電源とマッチングユニットの役割、反射電力が生じる理由、プラズマ負荷へ電力を届ける仕組み、代表メーカー、製品比較と関連職種を知りたい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "MKS Instruments、Advanced Energy、ダイヘン、Comet Plasma Control Technologiesの公式製品・技術情報をもとに、RF発振器、伝送経路、インピーダンス整合、プラズマ負荷、計測・制御の接続関係へ整理しました。周波数や出力の最大値を単純比較せず、対象工程、負荷変動、パルス・多周波、測定位置、装置統合、保守条件をそろえて比較します。",
  showCareerCtas: false,
  experienceBasis: [
    "成膜・エッチング装置を支える部品記事を、ガス流量・真空・排気処理・搬送からプラズマ電力系へ拡張",
    "RF電源とマッチングユニットを別々の箱としてではなく、ケーブル、電極、チャンバー、センサ、制御を含む電力伝送系として整理",
    "運営者固有の装置条件やレシピは扱わず、公式公開情報で確認できる一般原理、製品領域、比較観点に限定",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "RF Power Generators",
      url: "https://www.mks.com/c/rf-power-generators",
      publisher: "MKS Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Impedance Matching Networks",
      url: "https://www.mks.com/c/impedance-matching-networks",
      publisher: "MKS Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "eVerest Generator and NavX Matching Network RF Delivery System",
      url: "https://www.advancedenergy.com/getmedia/cad90315-8a0e-4706-ba8d-ac173792d9f8/ENG-eVerest-NavX-RF-Delivery-System-Brochure.pdf",
      publisher: "Advanced Energy Industries, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Precise Power: A 3D Architecture for RF Delivery",
      url: "https://www.advancedenergy.com/getmedia/b919e271-88c9-45e4-b28d-196c109d025f/en-se-precise-power-3d-architecture-application-note.pdf",
      publisher: "Advanced Energy Industries, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "RF/MW Generators of DAIHEN",
      url: "https://www.daihen.co.jp/en/products/fineplasma/",
      publisher: "DAIHEN Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Synertia RF Power Delivery Platform",
      url: "https://pct.comet.tech/en/products/synertia_rf_power_delivery_platform",
      publisher: "Comet Plasma Control Technologies",
      accessedAt: "2026-07-16",
    },
    {
      title: "RF Matching Networks",
      url: "https://pct.comet.tech/en/products/matches",
      publisher: "Comet Plasma Control Technologies",
      accessedAt: "2026-07-16",
    },
    {
      title: "Glossary of RF Power and Plasma Control Terms",
      url: "https://pct.comet.tech/en/support/glossary",
      publisher: "Comet Plasma Control Technologies",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "プラズマ装置を調べると、RF電源、マッチングボックス、進行波、反射波、13.56MHz、バイアス、パルスといった言葉が一度に出てきます。電源ならコンセントのように電力を送るだけではないのか、なぜ途中に整合器が必要なのか分かりにくくありませんか。",
    conclusion:
      "RF電源は制御された高周波電力を作り、マッチングユニットは変動するプラズマ負荷へ電力を渡しやすい状態へ伝送条件を調整します。重要なのは電源単体の出力ではなく、発振器、ケーブル、整合器、電極・コイル、チャンバー、計測、制御が一つのRFデリバリーシステムとして動くことです。",
    learnings:
      "RF電源とマッチングの役割、インピーダンスと反射電力、プラズマ負荷が変動する理由、連続波・パルス・多周波、代表メーカー4社、製品比較の軸、設計・アプリケーション・サービス職の仕事内容。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私はRF電源を、プラズマへ電気を送る箱ではなく、変動する負荷を測りながら電力の渡し方を整える制御システムとして見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜RF電力がプラズマへ届き、反射を見て再調整されるまで",
      description:
        "容量結合型などのプラズマ装置を単純化した流れです。整合器の位置、電極・コイル構成、計測点は装置方式により異なります。",
      stages: [
        { label: "01 / COMMAND", title: "レシピが条件を指示する", body: "周波数、設定電力、連続・パルス、デューティ、段階、同期などの指令を電源系へ送る" },
        { label: "02 / GENERATE", title: "RF電源が高周波を作る", body: "工場電源を、振幅・周波数・波形を制御した高周波電力へ変換する" },
        { label: "03 / TRANSMIT", title: "ケーブルで伝送する", body: "同軸ケーブル、コネクタ、センサ、フィルタなどを通して整合器・負荷側へ送る" },
        { label: "04 / MATCH", title: "インピーダンスを整合する", body: "可変容量や電子制御などで変換条件を調整し、負荷へ電力を渡しやすくする" },
        { label: "05 / COUPLE", title: "電極・コイルから結合する", body: "電界・磁界を介してガスを電離し、プラズマ生成やウェーハ側のバイアスへ使う" },
        { label: "06 / FEEDBACK", title: "進行波・反射波を測る", body: "負荷変動と反射を検出し、電力、整合位置、周波数などを再調整する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "RF系の構成要素",
      rightLabel: "主な役割",
      rows: [
        { left: "RFジェネレータ", right: "設定された周波数・電力・パルス波形を生成し、計測値に応じて出力を制御する" },
        { left: "同軸ケーブル・コネクタ", right: "高周波電力を伝送する。長さ、損失、接続、接地、配置もシステム挙動へ影響する" },
        { left: "方向性結合器・V/Iセンサ", right: "進行波・反射波、電圧・電流・位相などを測り、制御・診断へ使う" },
        { left: "マッチングユニット", right: "電源側とプラズマ負荷側のインピーダンス差を変換し、反射を管理する" },
        { left: "電極・コイル・シャワーヘッド", right: "RF電力をチャンバー内の電界・磁界へ結合し、プラズマ生成・イオン加速へつなぐ" },
        { left: "チャンバー・プラズマ・ウェーハ", right: "圧力、ガス、表面、温度、堆積状態で電気的負荷が変わるプロセス側" },
        { left: "制御・通信", right: "装置レシピ、同期信号、アラーム、波形データ、整合位置、校正情報を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "role",
      heading: "RF電源は高周波を作り、マッチングユニットは負荷へ渡しやすくする",
      lead: "二つの機器は役割が異なりますが、実際の装置では一体の電力伝送系として評価します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "機器",
          rightLabel: "入力・処理・出力",
          rows: [
            { left: "RF電源", right: "交流入力と装置指令を受け、高周波の電圧・電流・波形へ変換して伝送経路へ出力する" },
            { left: "マッチングユニット", right: "電源側と負荷側の電気状態を受け、可変素子・電子回路・周波数調整などで見かけの負荷を変換する" },
            { left: "プラズマ結合部", right: "整合後の電力を電極またはコイルへ入力し、チャンバー内の電界・磁界を通じてプラズマへ結合する" },
            { left: "計測・制御部", right: "進行・反射電力、電圧、電流、位相、整合位置、アークなどを測り、出力と整合へ戻す" },
          ],
        },
        {
          type: "note",
          title: "電源の表示電力と、プラズマへ実際に吸収された電力は同じとは限らない",
          body: "測定位置、ケーブル・整合器の損失、反射、校正方法、波形によって値の意味が変わります。比較時は、どこで何を測った電力かを確認します。",
        },
      ],
      paragraphs: [
        "MKSはRFジェネレータ、マッチングネットワーク、V/Iプローブを組み合わせたRFデリバリーシステムを公式に説明しています。Advanced EnergyとCometも、発振器と整合器を協調させるシステムを展開しています。",
        "装置メーカーはRF系だけでなく、ガス流量、圧力、温度、電極構造、排気、レシピを統合します。そのため、同じ電源を使ってもチャンバーと工程条件が違えば挙動は変わります。",
      ],
    },
    {
      id: "impedance",
      heading: "なぜ反射電力が生じるのか｜プラズマのインピーダンスが変化するため",
      lead: "インピーダンスは、交流に対する電圧と電流の関係を表す量です。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜負荷変動から整合制御まで",
          description:
            "実際の制御量とアルゴリズムは製品・装置方式で異なります。",
          stages: [
            { label: "01 / CHANGE", title: "プロセス条件が変わる", body: "着火、圧力、ガス組成、電力、温度、ウェーハ・チャンバー表面状態が変化する" },
            { label: "02 / LOAD", title: "電気的負荷が変わる", body: "プラズマの抵抗成分と容量・誘導成分が変わり、電源から見えるインピーダンスが移動する" },
            { label: "03 / REFLECT", title: "一部の電力が戻る", body: "伝送系と負荷が合わないと、進行波の一部が反射波として電源側へ戻る" },
            { label: "04 / SENSE", title: "センサがずれを検出する", body: "進行・反射電力、電圧・電流、位相などから整合状態を推定する" },
            { label: "05 / TUNE", title: "整合条件を動かす", body: "可変容量、電子回路、周波数などを調整し、目標範囲へ近づける" },
            { label: "06 / TRACK", title: "変動へ追従する", body: "レシピ遷移とパルス中の変化を監視し、電力伝送とプラズマの再現性を保つ" },
          ],
        },
      ],
      paragraphs: [
        "多くのRF伝送系は公称の基準インピーダンスを持ちますが、プラズマは固定抵抗ではありません。ガスが着火する前後だけでも負荷が大きく変わり、処理中も表面状態や圧力などに応じて動きます。",
        "整合は反射を常に完全なゼロへすることではなく、工程に必要な時間内で許容範囲へ制御する仕事です。反射値だけでなく、整合にかかる時間、変動、アーク、プロセス結果も合わせて見ます。",
      ],
    },
    {
      id: "plasma-control",
      heading: "RF条件は、周波数・電力・パルス・結合位置を組み合わせる",
      lead: "一つの数値ではなく、時間と装置構造を含む条件です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FREQUENCY", title: "周波数", body: "電界・シース・電力結合の挙動に関わる。複数周波数を重ねる装置もある。" },
            { label: "POWER", title: "電力", body: "プラズマ生成、反応種、イオンの挙動へ関わる。設定値と負荷側の値を区別する。" },
            { label: "PULSE", title: "パルス", body: "オン・オフ、デューティ、繰返し、段階、位相を時間軸で制御する。" },
            { label: "SOURCE", title: "プラズマ源", body: "主にプラズマ密度を作る側として説明されるが、装置内の各作用は相互に結合する。" },
            { label: "BIAS", title: "バイアス", body: "主にウェーハへ入射するイオンのエネルギー・方向性を調整する側として使われる。" },
            { label: "SYNC", title: "同期", body: "複数電源、整合器、ガス、圧力、計測、装置シーケンスのタイミングを合わせる。" },
          ],
        },
        {
          type: "note",
          title: "「ソースは密度、バイアスはエネルギー」は理解の入口",
          body: "実際には周波数、電極構造、圧力、ガス、波形、シース、チャンバー形状が相互作用します。二つを完全に独立して調整できるとは限りません。",
        },
      ],
      paragraphs: [
        "半導体向けRF系は、PECVDなどのプラズマ成膜、プラズマエッチング、プラズマ支援ALD・ALE、PVD、チャンバークリーニングなどへ使われます。必要な周波数・出力・波形は工程と装置構造で異なります。",
        "多周波・パルスでは、平均電力だけでなく、各パルス内の立上がり、オーバーシュート、整合の追従、位相、周波数間の干渉、計測帯域を確認します。",
      ],
    },
    {
      id: "matching-methods",
      heading: "マッチング方式は、機械式・電子式・周波数調整を分けて考える",
      lead: "どれが常に優れるかではなく、負荷変動と工程時間に合うかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "仕組みと確認点",
          rows: [
            { left: "可変容量を動かす方式", right: "真空可変コンデンサなどの位置をモータで調整する。整合範囲、速度、寿命、再現位置、保守を見る" },
            { left: "電子式・ソリッドステート方式", right: "半導体スイッチや電子回路で状態を切り替える。応答、段階、損失、耐電力、制御分解能を見る" },
            { left: "周波数チューニング", right: "発振周波数を許容範囲内で変え、負荷との整合点を追う。プロセス影響、他電源・規格との整合を見る" },
            { left: "固定・事前設定", right: "負荷変動が限定される用途などで固定素子・設定を使う。工程範囲と変更時の再調整を見る" },
            { left: "統合ジェネレータ・マッチ", right: "発振器と整合器のデータ・制御を協調させる。通信遅延、同期、診断、交換単位を見る" },
          ],
        },
      ],
      paragraphs: [
        "Cometはマッチングネットワークと真空可変コンデンサ、Advanced Energyは発振器とマッチングの同期・高速制御、ダイヘンは自動整合器と周波数チューニングを含むRFシステム評価を公式に説明しています。",
        "方式名だけでは判断できません。連続波で安定した負荷なのか、高速パルスで毎周期変わるのか、着火から安定まで何秒・何周期を許容するのかで選択が変わります。",
      ],
    },
    {
      id: "rf-dc-microwave",
      heading: "RF・直流・マイクロ波は、電力の周波数と結合方法が異なる",
      lead: "半導体装置では工程目的に応じて使い分け、組み合わせます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "電力方式",
          rightLabel: "主な特徴と用途の見方",
          rows: [
            { left: "RF", right: "高周波の電界・磁界でプラズマへ結合し、生成やバイアスへ使う。絶縁性表面を含む構成にも対応しやすい" },
            { left: "直流・パルス直流", right: "導電性ターゲットを使うスパッタなどで利用される。極性反転・パルスでアークや帯電を管理する方式もある" },
            { left: "マイクロ波", right: "より高い周波数帯を使い、導波管・アンテナ・共振・磁場などを含む結合系を構成する" },
            { left: "複合電源", right: "RFソースとRFバイアス、RFと直流、複数RF周波数などを組み合わせ、異なる制御目的を分担する" },
          ],
        },
      ],
      paragraphs: [
        "装置を分類するときは、電源の名称だけでなく、どの電極・コイルへ接続され、何を制御するために使われるかを確認します。",
        "同じ工程名でも装置メーカーや世代により電源構成は異なります。公開資料にないチャンバー内部構造や制御方法を推測して比較しないことが重要です。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体用RF電源・マッチングユニットの代表メーカー",
      lead: "各社の公式情報で確認できる製品領域を整理します。市場順位ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "MKS", title: "MKS Instruments", body: "RFジェネレータ、インピーダンス整合ネットワーク、V/Iプローブなどを展開。薄膜形成、PECVD、HDP-CVD、エッチングなどの用途を公式に示しています。" },
            { label: "AE", title: "Advanced Energy", body: "半導体向けRF電力システムを展開。eVerestジェネレータとNavXマッチングネットワークでは、パルス、同期、計測・制御を含む統合を示しています。" },
            { label: "DAIHEN", title: "ダイヘン", body: "AVANCERブランドの高周波電源、マイクロ波電源、自動整合器を展開。パルス出力、周波数チューニング、多周波を含むプラズマ評価を公式に説明しています。" },
            { label: "COMET", title: "Comet Plasma Control Technologies", body: "RFジェネレータ、マッチングネットワーク、真空可変コンデンサ、データ・制御を含むSynertiaプラットフォームなどを展開しています。" },
          ],
        },
        {
          type: "note",
          title: "ブランド名・製品系列・販売地域は更新される",
          body: "採用企業や製品を調べるときは、最新の公式製品ページ、仕様書、サービス拠点、求人票で担当範囲を確認してください。",
        },
      ],
      paragraphs: [
        "比較では、ジェネレータだけ、整合器だけ、可変コンデンサなどの部品、統合システムのどこまでを自社で扱うかを分けます。",
        "また、装置メーカー向けの組込み開発、半導体工場での置換・サービス、研究開発向け単品導入では、必要な認定、供給、通信、保守の条件が異なります。",
      ],
    },
    {
      id: "comparison",
      heading: "RF電源メーカーを比較する8つの軸",
      lead: "周波数や最大出力だけで順位を付けず、同じ負荷・波形・測定条件で確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "確認する内容",
          rows: [
            { left: "1. 対象工程・結合方式", right: "エッチング、PECVD、ALD・ALE、PVD、クリーニング、容量結合・誘導結合、ソース・バイアス" },
            { left: "2. 周波数・電力範囲", right: "必要な周波数帯、連続・ピーク・平均電力、負荷条件、冷却、規制・接地条件" },
            { left: "3. 波形・パルス", right: "立上がり、デューティ、繰返し、段階、位相、オーバーシュート、パルス内の安定性" },
            { left: "4. 整合・着火・追従", right: "整合範囲、着火時、レシピ遷移、パルス負荷、多周波干渉、反射許容、再現性" },
            { left: "5. 計測・校正", right: "測定位置、進行・反射、V/I・位相、帯域、サンプリング、校正、装置間差" },
            { left: "6. 保護・信頼性", right: "アーク検出、反射保護、温度、インターロック、異常停止、再起動、部品寿命" },
            { left: "7. 装置統合・データ", right: "寸法、ケーブル、通信、同期、レシピ、ログ、診断、ファームウェア、変更管理" },
            { left: "8. 供給・サービス", right: "量産供給、修理、校正、交換互換、現地支援、長期保守、地域拠点、総保有コスト" },
          ],
        },
      ],
      paragraphs: [
        "パルス条件では、平均値が同じでも波形が違えばプラズマ応答が変わる可能性があります。仕様表の一点ではなく、対象レシピを模した時間波形で確認します。",
        "装置間の再現性を見る場合は、電源だけを交換せず、ケーブル、整合器、センサ、接地、チャンバー状態、校正、ソフト設定を含めて差分を管理します。",
      ],
    },
    {
      id: "troubleshooting",
      heading: "RF系の異常は、電源だけでなく負荷・接続・プロセスから切り分ける",
      lead: "反射電力の上昇は原因ではなく、状態を示す結果の一つです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "観測される状態",
          rightLabel: "確認する範囲",
          rows: [
            { left: "着火しにくい・着火が遅い", right: "ガス、圧力、電極、点火シーケンス、初期電力、周波数、整合初期位置、チャンバー表面" },
            { left: "反射が高い・整合が外れる", right: "負荷変動、整合範囲、可変素子、ケーブル・コネクタ、接地、センサ、校正、アーク" },
            { left: "パルスごとに波形が揺れる", right: "制御帯域、整合追従、同期、計測帯域、デューティ、ガス・圧力応答、複数電源の干渉" },
            { left: "装置間で結果が違う", right: "電源・整合器の設定、ケーブル長、校正、電極、チャンバー状態、消耗部品、レシピ版、ソフト版" },
            { left: "アーク・保護停止が増える", right: "堆積物、粒子、絶縁、圧力、ガス、電極間隔、電力波形、検出閾値、接続部、冷却" },
            { left: "電源・整合器が過熱する", right: "反射、連続・ピーク負荷、冷却水・風量、周囲温度、フィルタ、設置間隔、部品劣化" },
          ],
        },
      ],
      paragraphs: [
        "最初に、いつから、どのレシピ・装置・チャンバーで、どの信号が先に変わったかを時系列でそろえます。電源アラームだけでなく、圧力、流量、温度、光、アーク、整合位置も重ねます。",
        "安全のため、高電圧・高周波・真空・プロセスガスを扱う点検は、装置メーカーと事業所の手順、ロックアウト、放電確認に従います。",
      ],
    },
    {
      id: "jobs",
      heading: "RF電源・マッチングメーカーの仕事",
      lead: "電力変換、高周波回路、制御、プラズマ、量産支援が交わる領域です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "POWER", title: "電力変換・回路設計", body: "高周波増幅、電源変換、フィルタ、保護、熱設計、基板・筐体、EMCを設計します。" },
            { label: "RF", title: "高周波・整合設計", body: "伝送線路、整合回路、可変素子、センサ、ケーブル、接地、電磁界を設計・評価します。" },
            { label: "CONTROL", title: "組込み・制御", body: "電力・周波数・パルス・整合アルゴリズム、通信、データ取得、診断、保護を実装します。" },
            { label: "PLASMA", title: "アプリケーション", body: "実負荷・評価チャンバーで着火、整合、波形、工程結果を確認し、装置条件へ合わせます。" },
            { label: "QUALITY", title: "品質・生産技術", body: "校正、トレーサビリティ、量産試験、部品変更、故障解析、供給・修理工程を管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、交換、校正、ログ解析、障害切分け、予防保全、顧客・装置メーカー調整を行います。" },
          ],
        },
      ],
      paragraphs: [
        "パワーエレクトロニクス、高周波通信、電源、モータ制御、計測、組込み、プラズマ、装置保全、品質保証の経験を接続しやすい分野です。",
        "求人では、発振器・整合器・センサのどこを担当するか、単品開発か装置統合か、評価チャンバー・顧客現場へ入るか、海外装置メーカーとの技術対応があるかを確認します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体用RF電源・マッチングでよくある質問",
      lead: "初心者が混同しやすい用語を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "RFとは何ですか？", answer: "Radio Frequencyの略で、高周波の電気信号・電力を指します。半導体装置ではプラズマ生成やウェーハ側のバイアスなどへ使われます。" },
            { question: "なぜマッチングユニットが必要ですか？", answer: "プラズマ負荷のインピーダンスが工程中に変化するためです。電源側とのずれを変換し、反射を管理しながら負荷へ電力を渡しやすくします。" },
            { question: "反射電力がゼロなら良いプロセスですか？", answer: "反射は重要な監視値ですが、それだけでは判断できません。測定位置、整合時間、波形、アーク、プラズマ状態、ウェーハ結果を合わせて評価します。" },
            { question: "13.56MHz以外も使われますか？", answer: "使われます。装置・工程により低い周波数や高い周波数、複数周波数、マイクロ波などが選ばれます。" },
            { question: "主なメーカーは？", answer: "この記事ではMKS Instruments、Advanced Energy、ダイヘン、Comet Plasma Control Technologiesを代表例として紹介しています。" },
            { question: "RF電源はどの工程で使われますか？", answer: "プラズマエッチング、PECVD、プラズマ支援ALD・ALE、PVD、チャンバークリーニングなどで使われます。構成は装置方式により異なります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜RF電源・整合器・プラズマを一つの伝送系として見る",
      lead: "RF系の性能は、電力を作る・運ぶ・合わせる・結合する・測るの連鎖で決まります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "GENERATE", title: "電力を作る", body: "周波数、電力、パルス、保護を対象工程へ合わせる" },
            { label: "MATCH", title: "負荷へ合わせる", body: "変動するインピーダンスと反射へ必要な時間で追従する" },
            { label: "MEASURE", title: "測定点をそろえる", body: "進行・反射、V/I、位相、波形、校正の意味を確認する" },
            { label: "INTEGRATE", title: "装置で統合する", body: "ガス、圧力、温度、電極、同期、データ、保守まで見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置の部品・サブファブ", href: "/guides/semiconductor-equipment-components-subfab", description: "RF電源をガス・真空・搬送・温調と同じ装置断面へ置く" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "PECVD・PVD・ALD装置と主要企業を見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "PVD・CVD・ALDとプラズマ支援の位置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "プラズマエッチング装置と主要企業を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "イオン・反応種・選択比・異方性を見る" },
            { label: "マスフローコントローラーメーカー", href: "/guides/semiconductor-mass-flow-controller-manufacturers", description: "プラズマへ入るガス流量の制御を見る" },
            { label: "真空ポンプメーカー", href: "/guides/semiconductor-vacuum-pump-manufacturers", description: "チャンバー圧力と排気を支えるポンプを見る" },
            { label: "設備エンジニアへのルート", href: "/guides/equipment-engineer-route", description: "電源・装置・保全経験と半導体職種の接続を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象工程、結合方式、周波数・電力、波形、整合・追従、計測・保護、装置統合、供給・サービスの8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "MKS、Advanced Energy、ダイヘン、Cometから1社を選び、公式製品を対象工程・発振器・整合方式・パルス・計測・装置統合の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-equipment-components-subfab",
    "semiconductor-equipment-manufacturers",
    "semiconductor-vacuum-gauge-pressure-control-valve-manufacturers",
    "semiconductor-chiller-temperature-control-manufacturers",
    "semiconductor-electrostatic-chuck-ceramic-heater-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-mass-flow-controller-manufacturers",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-wafer-handling-efem-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: [],
};
