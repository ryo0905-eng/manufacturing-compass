import type { GuideArticle } from "@/content/guides/types";

export const semiconductorPhotomaskWriterManufacturersGuide: GuideArticle = {
  slug: "semiconductor-photomask-writer-manufacturers",
  title: "半導体フォトマスク描画装置メーカーとは？IMS・ニューフレアなどを初心者向けに図解",
  description:
    "半導体フォトマスク描画装置は、設計データをマスクブランクス上のレジストへ描く装置です。可変成形ビーム・マルチビーム・レーザーの仕組み、データ処理、描画時間、寸法・位置精度、主要メーカーを図解します。",
  targetQuery: "半導体 フォトマスク 描画装置 メーカー",
  searchIntent:
    "フォトマスク描画装置の役割と工程、電子ビーム・レーザー方式、可変成形ビーム・マルチビームの違い、IMS・ニューフレアテクノロジー・日本電子・Heidelberg Instrumentsなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "IMS Nanofabrication、ニューフレアテクノロジー、日本電子、Heidelberg Instrumentsの公式製品情報と、テクセンドフォトマスクの公式工程説明をもとに、データ処理、電子・光学系、精密ステージ、補正、描画、後工程・検査へ整理しました。異なる用途の仕様値や市場順位ではなく、対象マスクと描画方式をそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "完成フォトマスク、マスクブランクス、ペリクルの記事を公開したうえで、設計データをブランクス上のパターンへ変える装置領域を独立して説明する記事が必要だと判断",
    "IMS Nanofabricationとニューフレアテクノロジーの公式情報で、先端フォトマスク向けマルチ電子ビーム描画装置の領域を確認",
    "ニューフレアテクノロジーと日本電子の公式情報で可変成形ビーム、日本電子でスポットビーム、Heidelberg Instrumentsで成熟半導体用レーザー描画装置の領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Products｜Multi-beam mask writers",
      url: "https://www.ims.co.at/en/",
      publisher: "IMS Nanofabrication GmbH",
      accessedAt: "2026-07-16",
    },
    {
      title: "電子ビームマスク描画装置",
      url: "https://www.nuflare.co.jp/products/beam/",
      publisher: "株式会社ニューフレアテクノロジー",
      accessedAt: "2026-07-16",
    },
    {
      title: "Electron Beam Lithography System｜JEOL Instrument Basics",
      url: "https://www.jeol.com/products/science/ebx.php",
      publisher: "JEOL Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "JBX-3200MVS Electron Beam Lithography System",
      url: "https://www.jeol.com/products/semiconductor/ebx/JBX-3200MV.php",
      publisher: "JEOL Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "ULTRA Semiconductor Mask Writer",
      url: "https://heidelberg-instruments.com/product/ultra/",
      publisher: "Heidelberg Instruments Mikrotechnik GmbH",
      accessedAt: "2026-07-16",
    },
    {
      title: "Photomask Production",
      url: "https://heidelberg-instruments.com/applications/photomasks/",
      publisher: "Heidelberg Instruments Mikrotechnik GmbH",
      accessedAt: "2026-07-16",
    },
    {
      title: "半導体用フォトマスク｜製品情報",
      url: "https://www.photomask.com/product/",
      publisher: "テクセンドフォトマスク株式会社",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "フォトマスク描画装置を調べても、電子ビームとレーザー、シングルビームとマルチビーム、描画速度と精度の関係が混ざり、露光装置との違いも分かりにくくありませんか。",
    conclusion:
      "フォトマスク描画装置は、回路設計データを処理し、レジストを塗ったマスクブランクスへ電子ビームまたはレーザーで潜像を描く装置です。企業比較では、対象マスク、描画方式、データ処理、寸法・位置精度、描画時間、材料適合、環境安定性、量産運用をそろえます。",
    learnings:
      "フォトマスク描画装置の工程、可変成形ビーム・マルチビーム・スポットビーム・レーザー、データパス、近接効果補正、CD・位置・継ぎ精度・描画時間、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "描画装置は完成フォトマスクを一台で作る装置ではありません。設計データをレジスト上の潜像へ変え、その後の現像・加工・洗浄・計測・検査へ渡します。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜設計データからフォトマスク上のパターンを作る",
      description:
        "描画前のデータ準備から後工程への受け渡しまでを単純化した流れです。補正方法、順序、装置構成は方式・製品・マスク仕様で異なります。",
      stages: [
        { label: "01 / DATA", title: "設計データを受け取る", body: "マスクへ描くレイアウト、層、極性、寸法、位置、アライメント情報を確認する" },
        { label: "02 / PREPARE", title: "描画データへ変換する", body: "図形分割や画素化、近接効果・工程変動の補正、描画順序、照射量を計算する" },
        { label: "03 / LOAD", title: "ブランクスを載せる", body: "レジスト付き基板を清浄に搬送し、ステージへ保持して座標・高さ・傾きを合わせる" },
        { label: "04 / WRITE", title: "電子線・光で描く", body: "ビームの形、位置、オン・オフ、照射量とステージ移動を同期し、レジストへ潜像を作る" },
        { label: "05 / CORRECT", title: "長時間の変動を補正する", body: "ビーム、焦点、電流、温度、ステージ座標、帯電などを監視・校正する" },
        { label: "06 / PROCESS", title: "現像・加工・検査へ渡す", body: "潜像を現像し、薄膜加工、レジスト除去、洗浄、寸法・位置・欠陥検査を行う" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の主要部",
      rightLabel: "主な役割",
      rows: [
        { left: "データパス・計算機", right: "大容量レイアウトを描画単位へ変換し、補正量・照射量・順序を装置へ連続供給する" },
        { left: "電子源・レーザー光源", right: "レジストを反応させるエネルギーを安定して発生し、出力・電流・波長を管理する" },
        { left: "電子光学・投影光学系", right: "ビームを成形・集束・偏向・変調し、所定の位置と形でレジストへ照射する" },
        { left: "精密ステージ・保持部", right: "マスクブランクスを低振動で移動・保持し、干渉計などで座標を測って配置精度を作る" },
        { left: "真空・温調・除振", right: "電子線の経路、材料寸法、焦点、位置を乱す圧力・温度・振動・磁場などの変動を抑える" },
        { left: "校正・アライメント", right: "ビーム形状、焦点、電流、偏向、ステージ座標、既存パターンとの重ね位置を補正する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "フォトマスク描画装置は、設計データをレジスト上の潜像へ変える",
      lead: "ウェーハ露光装置とは、描く対象と目的が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置・工程",
          rightLabel: "何をするか",
          rows: [
            { left: "マスク描画装置", right: "設計データを読み、マスクブランクス上のレジストへ一枚ごとに回路パターンを直接描く" },
            { left: "現像・薄膜加工", right: "潜像をレジストパターンへ変え、遮光膜・吸収膜などへ形状を移して不要なレジストを除く" },
            { left: "マスク検査・計測", right: "欠陥、CD、位置、位相・透過・反射などを測り、必要に応じて修正・再確認する" },
            { left: "ウェーハ露光装置", right: "完成フォトマスクの像を縮小投影または等倍転写し、多数のウェーハ上のレジストへ繰り返し露光する" },
          ],
        },
        {
          type: "note",
          title: "『描画』と『露光』は文脈で使い分ける",
          body: "マスク描画もレジストへエネルギーを照射するため露光の一種ですが、一般にマスクを直接作る装置を描画装置、完成マスク像をウェーハへ転写する装置を露光装置と呼び分けます。",
        },
      ],
      paragraphs: [
        "テクセンドフォトマスクは、回路データをもとに電子ビームでマスクブランクス上へパターンを作り、その後に加工、レジスト除去、洗浄、測定、検査を経て完成すると説明しています。",
        "描画装置の出力は目で見える完成回路ではなく、レジストの化学的な状態差である潜像です。その精度が後工程を通じて遮光膜・吸収膜の寸法と位置へ受け継がれます。",
      ],
    },
    {
      id: "methods",
      heading: "可変成形・マルチ・スポット・レーザーで、描き方と得意用途が違う",
      lead: "方式は単純な世代順ではなく、必要な形状、精度、面積、納期、コストで選ばれます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "描画方式",
          rightLabel: "仕組みと主な使い分け",
          rows: [
            { left: "可変成形電子ビーム｜VSB", right: "ビームを長方形・台形などへ成形し、図形をショットへ分割してスタンプのように描く。量産レチクルで使われ、複雑化するとショット数が増える" },
            { left: "マルチ電子ビーム", right: "多数の微小ビームを並列にオン・オフして画素状に描く。高密度・曲線的なデータでも、単一ビームより図形複雑度による描画時間増加を抑えやすい" },
            { left: "スポット電子ビーム", right: "細く集束したビームを走査して描く。高解像の研究開発、試作、光・通信・ナノ構造など、多様な基板と小領域へ適用される" },
            { left: "レーザーマスク描画", right: "レーザー光を変調・投影してレジストへ描く。成熟半導体、MEMS、フォトニクス、実装、標準マスク、大面積用途などで速度とコストを生かす" },
          ],
        },
        {
          type: "note",
          title: "マルチビームでも計算量はなくならない",
          body: "多数ビームを並列に使っても、元データの変換、画素化、照射量補正、欠陥ビーム補償、膨大なデータ転送が必要です。電子光学と同時に計算機・制御技術が装置性能を左右します。",
        },
      ],
      paragraphs: [
        "日本電子は、可変成形ビームではパターンを長方形へ分割して高速に描き、レチクル生産へ使うと説明しています。スポットビームは次世代デバイス研究や化合物・光デバイスなどの直接描画にも使われます。",
        "IMS Nanofabricationとニューフレアテクノロジーは先端マスク向けマルチビーム、Heidelberg Instrumentsは成熟半導体用ULTRAや標準・大面積マスク向けVPG系を公式に案内しています。",
      ],
    },
    {
      id: "data",
      heading: "描画前のデータ処理が、速度とパターン忠実度を左右する",
      lead: "描画装置は巨大なデータを止めずに計算・転送するデータ処理装置でもあります。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜レイアウトを装置が描けるデータへ変換する",
          description:
            "一般的な考え方を示します。実際のデータ形式、補正モデル、順序、検証方法はマスクショップ・装置・用途で異なります。",
          stages: [
            { label: "01 / LAYOUT", title: "レイアウトを確定", body: "対象層、極性、倍率、境界、識別情報、アライメントマークを確認する" },
            { label: "02 / RETARGET", title: "転写を見越して補正", body: "OPC・ILTなどで、ウェーハ上に必要な像からマスク形状を計算する" },
            { label: "03 / CONVERT", title: "描画単位へ変換", body: "VSBではショットへ分割し、マルチビームでは画素・ビーム列へ割り当てる" },
            { label: "04 / DOSE", title: "照射量を補正", body: "電子散乱、レジスト、下地、図形密度、工程変動を考慮して局所的な照射量を調整する" },
            { label: "05 / SCHEDULE", title: "順序とステージを決める", body: "描画フィールド、偏向範囲、ステージ移動、校正、スループットをまとめて計画する" },
            { label: "06 / VERIFY", title: "データを検証", body: "欠落、重複、極性、階層、補正、装置形式、チェックサムなどを確認して描画へ渡す" },
          ],
        },
      ],
      paragraphs: [
        "微細化でOPCや曲線的なILT形状が増えると、同じマスク面積でも図形数・ショット数・データ量が増えます。装置の最高解像度だけでなく、データ変換時間、転送帯域、圧縮、リアルタイム処理が納期へ影響します。",
        "近接効果補正は、電子がレジスト・基板内で散乱し、周辺パターンの照射量へ影響する現象を見越す処理です。補正モデルはレジスト・膜構造・加速電圧・形状密度などと組み合わせて評価します。",
      ],
    },
    {
      id: "precision",
      heading: "CD・位置・継ぎ・重ね合わせ・描画時間を一体で管理する",
      lead: "一つの最小線幅だけでは、量産マスク描画の性能を判断できません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CD", title: "寸法・均一性", body: "線幅、穴、角、曲線、密度差による寸法変動と面内・マスク間の均一性を管理します。" },
            { label: "PLACEMENT", title: "パターン位置", body: "設計座標に対する配置誤差、倍率、直交度、回転、歪み、長距離位置精度を抑えます。" },
            { label: "STITCHING", title: "フィールド継ぎ", body: "偏向領域やステージ移動の境界で、線のずれ・太さ・欠けが生じないよう補正します。" },
            { label: "OVERLAY", title: "重ね合わせ", body: "既存層・マークを測り、二層目以降や再描画で位置関係を合わせます。" },
            { label: "FIDELITY", title: "形状忠実度", body: "角、曲線、斜線、密集・孤立形状、エッジ粗さを設計と工程目標へ近づけます。" },
            { label: "TIME", title: "描画時間・稼働", body: "データ準備、ロード、校正、実描画、再処理、保守を含めた一枚のサイクルを安定させます。" },
          ],
        },
        {
          type: "note",
          title: "精度を上げるほど時間が長くなるとは限らないが、トレードオフは残る",
          body: "小さなショット・画素、低い照射量誤差、多頻度校正は精度へ有利でも、データ量や処理時間が増える場合があります。ビーム並列化、電流、レジスト感度、補正、装置安定性を一体で最適化します。",
        },
      ],
      paragraphs: [
        "描画が長時間になると、室温、装置内部温度、基板寸法、ビーム電流・位置、ステージ座標、焦点が少しずつ変化します。温調、除振、磁場対策、干渉計、定期校正、材料安定化で変動を抑えます。",
        "電子ビームでは帯電、前方・後方散乱、レジスト感度、下地膜の違いも形状へ影響します。レーザー方式でも焦点、光学歪み、ステージ、空間光変調、レジスト、温度の管理が必要です。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体フォトマスク描画装置の代表企業4社",
      lead: "公式情報で確認できる製品領域を、方式と対象用途へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "IMS Nanofabrication｜オーストリア", right: "半導体業界向けマルチ電子ビームマスク描画装置を開発・製造。多数ビームを並列制御する先端フォトマスク向け領域" },
            { left: "ニューフレアテクノロジー｜日本", right: "先端向けマルチ電子ビームMBMシリーズと、可変成形シングルビームEBMシリーズを展開。フォトマスク量産向けに複数世代を案内" },
            { left: "日本電子｜日本", right: "可変成形ビームのJBX-3200MVSなどマスク・レチクル製造向け装置と、スポットビームの研究開発・多用途向け電子線描画装置を展開" },
            { left: "Heidelberg Instruments｜ドイツ", right: "成熟半導体フォトマスク向けレーザー描画装置ULTRA、標準マスク・実装・大面積用途などのVPGシリーズ、研究開発用直接描画装置を展開" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、市場順位ではない",
          body: "同じ描画装置でも、先端IC用6インチレチクル、成熟半導体、研究開発、MEMS・フォトニクス、実装、表示用大面積マスクでは要求が異なります。異なる用途の仕様値を直接比較しません。",
        },
      ],
      paragraphs: [
        "IMS Nanofabricationはマルチビームに特化し、ニューフレアテクノロジーはマルチビームと可変成形ビーム、日本電子は可変成形とスポットビーム、Heidelberg Instrumentsはレーザー・光学方式を公式に示しています。",
        "企業研究では『描画装置メーカー』を一括りにせず、対象ノード・マスク、ビーム方式、量産・研究用途、基板サイズ、データ処理、後工程・検査との接続へ分けます。",
      ],
    },
    {
      id: "comparison",
      heading: "描画装置メーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、用途・方式・精度・量産運用の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象マスク・用途", right: "先端・成熟IC、DUV・EUV、レチクル、研究、MEMS、フォトニクス、実装、大面積など" },
            { left: "2. 描画方式", right: "マルチ電子ビーム、可変成形、スポット、レーザー、走査・投影方法、加速電圧・波長" },
            { left: "3. データ・形状", right: "入力形式、OPC・ILT、曲線、図形分割・画素化、近接効果補正、データ量、処理・転送時間" },
            { left: "4. 精度・像品質", right: "CD・均一性、位置、継ぎ、重ね、エッジ粗さ、形状忠実度、校正・装置間合わせ" },
            { left: "5. 描画時間・生産性", right: "実描画、準備、ロード、校正、再処理、保守、稼働率、レシピ切替を含む一枚のサイクル" },
            { left: "6. 基板・レジスト適合", right: "マスクサイズ、DUV・EUV構造、導電性・帯電、レジスト感度・膜厚、保持、裏面、清浄搬送" },
            { left: "7. 環境・ライン接続", right: "真空、温調、除振、磁場、床・電力・冷却、ローダ、搬送、MES、検査・後工程とのデータ連携" },
            { left: "8. 量産支援・認定", right: "保守拠点、部品、校正、稼働監視、教育、ソフト更新、装置間整合、長期評価、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "最初に対象マスクを固定してください。先端EUVレチクル用マルチビームと成熟半導体用レーザー装置では、必要な最小形状、位置精度、描画時間、設備コストの前提が異なります。",
        "次に公称仕様ではなく生産フローを見ます。データ準備、レジスト、装置校正、現像・加工、検査、修正まで含めて、必要な納期と品質を再現できるかが重要です。",
      ],
    },
    {
      id: "jobs",
      heading: "描画装置メーカーの仕事は、電子・光学・精密機械・計算機をつなぐ",
      lead: "一台の装置に複数の専門領域が集まります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "BEAM", title: "電子光学・光学", body: "電子源、電子レンズ、偏向、ブランキング、レーザー、投影・集束光学、焦点を設計します。" },
            { label: "MECHANICS", title: "精密機械・ステージ", body: "保持、ステージ、干渉計、真空機構、除振、熱変形、搬送を設計・評価します。" },
            { label: "CONTROL", title: "電気・制御", body: "高速ビーム制御、電源、センサー、同期、フィードバック、安全、装置シーケンスを作ります。" },
            { label: "SOFTWARE", title: "データ・ソフトウェア", body: "図形処理、補正計算、圧縮・転送、装置制御、GUI、ログ解析、MES接続を担当します。" },
            { label: "PROCESS", title: "プロセス・アプリ", body: "レジスト、照射量、現像、下地、形状、欠陥を評価し、顧客データを描画条件へ落とします。" },
            { label: "METROLOGY", title: "計測・校正", body: "CD、位置、継ぎ、重ね、ビーム電流・形状、ステージ座標、装置間差を測って補正します。" },
            { label: "PRODUCTION", title: "生産・品質", body: "組立、調整、試験、出荷、変更、部品・供給者、トレーサビリティ、信頼性を管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、立上げ、保守、故障解析、校正、稼働改善、顧客教育を拠点横断で支えます。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、電子ビーム方式かレーザー方式か、開発・製造・顧客拠点のどこか、ハードウェア・ソフトウェア・プロセスのどこを担当するかを確認します。",
        "半導体装置、電子顕微鏡、真空、光学、精密位置決め、画像・信号処理、EDA・大規模計算、レジスト・微細加工、計測、品質、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体フォトマスク描画装置でよくある質問",
      lead: "露光装置との違い、方式、企業、性能の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "フォトマスク描画装置とは何ですか？", answer: "設計データを処理し、レジストを塗ったマスクブランクスへ電子ビームまたはレーザーでパターンの潜像を直接描く装置です。" },
            { question: "主なフォトマスク描画装置メーカーは？", answer: "この記事ではIMS Nanofabrication、ニューフレアテクノロジー、日本電子、Heidelberg Instrumentsを方式・用途別の代表例として紹介しています。網羅的な市場順位ではありません。" },
            { question: "マスク描画装置とウェーハ露光装置の違いは？", answer: "描画装置は設計データからフォトマスクを一枚ごとに作る装置です。ウェーハ露光装置は完成マスクの像を多数のウェーハへ繰り返し転写します。" },
            { question: "可変成形ビームとは何ですか？", answer: "電子ビームを長方形などへ変形し、設計図形を複数のショットへ分けてスタンプのように描く方式です。スポットを一点ずつ走査するより、面積を効率よく描けます。" },
            { question: "マルチビームはなぜ速いのですか？", answer: "多数の微小ビームを並列にオン・オフして同時に描けるためです。先端マスクで増える高密度・複雑形状に対し、単一ビームのショット数増加を避けやすくなります。" },
            { question: "レーザー方式は電子ビームより古くて劣るのですか？", answer: "一律には言えません。必要な最小形状、位置精度、面積、用途が合えば、成熟半導体、MEMS、フォトニクス、実装、大面積マスクなどで高い生産性を生かせます。" },
            { question: "描画時間は何で決まりますか？", answer: "方式、面積、図形数・密度、ショット・画素数、照射量、レジスト感度、電流・光出力、データ処理、ステージ移動、校正、再処理で決まります。" },
            { question: "描画後すぐ完成フォトマスクになりますか？", answer: "なりません。現像、薄膜加工、レジスト除去、洗浄、寸法・位置・欠陥検査、必要に応じた修正などを経て完成します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象マスク・方式・データ・精度・時間をそろえて見る",
      lead: "フォトマスク描画装置は、回路設計と微細な物理パターンをつなぐ装置です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "ROLE", title: "潜像を作る装置", body: "設計データをレジスト上へ描き、後工程へ渡す" },
            { label: "METHOD", title: "方式を用途へ置く", body: "可変成形・マルチ・スポット・レーザーを対象マスクで分ける" },
            { label: "SYSTEM", title: "データと機械を一体で見る", body: "補正計算、ビーム、光学、ステージ、真空・温調をつなぐ" },
            { label: "QUALITY", title: "精度と時間を両立する", body: "CD、位置、継ぎ、重ね、忠実度、描画時間、稼働を評価する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "描画後の加工・洗浄・検査を含む完成原版と企業を見る" },
            { label: "マスクブランクスメーカー", href: "/guides/semiconductor-mask-blank-manufacturers", description: "描画前の基板・薄膜・レジスト母材と企業を見る" },
            { label: "ペリクルメーカー", href: "/guides/semiconductor-pellicle-manufacturers", description: "完成マスクの回路面を露光中の異物から守る部材を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "完成マスク像をウェーハへ転写するEUV・DUV・i線装置を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "電子線・光で反応する感光材料と周辺材料を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "描画・加工後の欠陥、寸法、位置を確認する装置企業を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "CD、位置、欠陥を工程へフィードバックする考え方を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "設計・マスク・ウェーハ加工・組立・検査の全体像を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、対象マスク、描画方式、データ・形状、精度、描画時間、基板・レジスト、環境・ライン接続、量産支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "IMS Nanofabrication・ニューフレアテクノロジー・日本電子・Heidelberg Instrumentsから1社を選び、公式製品を対象マスク・描画方式・データ処理・精度・描画時間・量産支援の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-photomask-manufacturers",
    "semiconductor-mask-blank-manufacturers",
    "semiconductor-pellicle-manufacturers",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "photolithography-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
