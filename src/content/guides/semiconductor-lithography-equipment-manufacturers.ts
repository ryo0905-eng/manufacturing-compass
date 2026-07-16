import type { GuideArticle } from "@/content/guides/types";

export const semiconductorLithographyEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-lithography-equipment-manufacturers",
  title: "半導体の露光装置メーカーとは？ASML・Nikon・Canonと周辺装置を初心者向けに図解",
  description:
    "半導体の露光装置メーカーは、フォトマスクの回路パターンをウェーハへ高精度に転写する装置を開発します。EUV・DUV・i線・ナノインプリント、装置構成、主要企業、塗布現像装置との違い、比較方法を図解します。",
  targetQuery: "半導体 露光装置 メーカー",
  searchIntent:
    "半導体露光装置の仕組みと構成、EUV・DUV・i線・ナノインプリントの違い、ASML・Nikon・Canonなど主要メーカーと塗布現像装置メーカーの役割を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "ASML、Nikon、Canon、東京エレクトロン、SCREENの公式製品・技術情報をもとに、露光方式、装置構成、リソグラフィ周辺装置の役割を整理しました。市場シェアや企業の優劣ではなく、用途をそろえて装置メーカーを比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のフォトリソグラフィ記事で塗布・露光・現像の原理を整理したうえで、露光装置と周辺装置の企業研究を独立して行える記事が必要だと判断",
    "ASML、Nikon、Canonの公式ラインアップで、EUV、ArF液浸・ドライ、KrF、i線、ナノインプリントの対象領域を確認",
    "露光装置だけで工程が完結するように見せず、東京エレクトロンとSCREENの塗布現像装置、計測、マスク、材料を一つの工程系として整理",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "EUV lithography systems",
      url: "https://www.asml.com/en/products/euv-lithography-systems",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "DUV lithography systems",
      url: "https://www.asml.com/en/products/duv-lithography-systems",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "ASML products & services",
      url: "https://www.asml.com/en/products",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "Lineup | Semiconductor Lithography Systems",
      url: "https://www.nikon.com/business/semi/lineup/",
      publisher: "Nikon Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Lithography Equipment",
      url: "https://global.canon/en/product/indtech/semicon/index.html",
      publisher: "Canon Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Lithography Equipment Technology",
      url: "https://global.canon/en/technology/canon-tech/tech/semicon/",
      publisher: "Canon Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Coater/Developer LITHIUS Series",
      url: "https://www.tel.com/product/lithius.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-16",
    },
    {
      title: "Reducing electricity used in semiconductor coating and developing",
      url: "https://www.screen.co.jp/spe/en/technology/tech-highlights/tech-highlights03",
      publisher: "SCREEN Semiconductor Solutions Co., Ltd.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "ASML、Nikon、Canonはいずれも露光装置を扱いますが、EUV、ArF、KrF、i線、ナノインプリントのどこが違い、東京エレクトロンやSCREENが同じ工程で何を担うのか分かりにくくありませんか。",
    conclusion:
      "露光装置は、光源、照明光学系、マスク、投影光学系、マスク・ウェーハステージ、位置合わせ、環境・制御を統合し、レジストへ回路情報を転写します。企業比較では、方式、対象層・用途、解像・重ね合わせ、生産性、周辺装置との接続をそろえます。",
    learnings:
      "露光装置の役割と構成、ステッパーとスキャナー、EUV・DUV・i線・ナノインプリント、主要メーカー、コータ・デベロッパとの違い、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "露光装置メーカーを比べるときは、『どこまで細く描けるか』だけでなく、『どの層を、どの基板へ、どれだけ正確かつ安定して転写する装置か』までそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜塗布から露光・現像・計測までを一つの工程系で見る",
      description:
        "露光装置はリソグラフィの中央を担います。前後の塗布現像装置、材料、計測装置とつながって初めて、次の加工に使えるレジストパターンになります。",
      stages: [
        { label: "01 / PREP", title: "表面を整える", body: "密着性や反射を考慮して表面処理・下層膜を準備する" },
        { label: "02 / COAT", title: "レジストを塗る", body: "コータ・デベロッパで感光材料を均一に塗布し、ベークする" },
        { label: "03 / ALIGN", title: "位置と焦点を合わせる", body: "既存パターンを読み、マスクとウェーハの位置・高さを補正する" },
        { label: "04 / EXPOSE", title: "パターンを転写する", body: "光学投影またはインプリントで、レジストへ回路情報を与える" },
        { label: "05 / DEVELOP", title: "パターンを現す", body: "ベークと現像で必要な部分を残し、CD・重ね合わせ・欠陥を測る" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "工程を支える装置・材料",
      rightLabel: "主な役割",
      rows: [
        { left: "露光装置", right: "マスクの回路情報を、位置と焦点を合わせながらレジストへ転写する" },
        { left: "コータ・デベロッパ", right: "レジスト塗布、ベーク、現像などを連続処理し、露光装置とウェーハを受け渡す" },
        { left: "フォトマスク・レチクル", right: "転写する回路パターンを保持する。方式により透過型・反射型・インプリント用などがある" },
        { left: "計測・検査", right: "CD、重ね合わせ、焦点、欠陥、マスク・ウェーハ状態を測り、工程へ補正を返す" },
        { left: "材料", right: "レジスト、下層膜、現像液、洗浄材料などで感光・転写・後工程への耐性を作る" },
        { left: "計算・制御", right: "マスク補正、露光条件、装置間整合、工程データを使い、転写結果を最適化する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "露光装置メーカーとは、回路情報の転写を量産設備へする企業",
      lead: "露光はシリコンを直接削る工程ではなく、次に加工する場所をレジストへ記録する工程です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "IMAGE", title: "パターンを結像する", body: "光源、照明、マスク、投影光学系を使い、必要な像をレジスト上へ作ります。" },
            { label: "POSITION", title: "層を重ねる", body: "すでに作られた回路へ位置を合わせ、マスクとウェーハを精密に動かします。" },
            { label: "PRODUCTION", title: "量産で繰り返す", body: "焦点、露光量、重ね合わせ、欠陥、生産性、装置間差を管理します。" },
          ],
        },
        {
          type: "note",
          title: "露光装置とフォトリソグラフィ工程は同じ範囲ではない",
          body: "露光装置はパターン転写を担う装置です。フォトリソグラフィ工程には、表面処理、レジスト塗布、ベーク、露光、現像、計測までが含まれます。企業研究では装置単体と工程全体を分けます。",
        },
      ],
      paragraphs: [
        "Canonは露光を、レチクルの回路パターンを投影光学系でウェーハへ転写する工程と説明しています。量産装置では像を作るだけでなく、ウェーハごとの変形や高さを測り、位置・焦点・露光量を補正します。",
        "現像後のレジストパターンがエッチングやイオン注入のマスクになります。したがって露光装置の性能は、次工程で得たい寸法・位置・形状から逆算して評価されます。",
      ],
    },
    {
      id: "architecture",
      heading: "光源・光学系・ステージ・計測が露光装置を構成する",
      lead: "高い解像度だけでなく、ナノメートル領域の位置合わせと高速搬送を同時に成立させます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置の要素",
          rightLabel: "主な役割",
          rows: [
            { left: "光源・照明光学系", right: "必要な波長の光を作り、マスクへ均一かつ目的に合う角度分布で照明する" },
            { left: "マスク・レチクル", right: "回路パターンを保持し、光を通す・反射することで像の情報を与える" },
            { left: "投影光学系", right: "レンズまたはミラーでパターンを縮小し、レジスト面へ結像する" },
            { left: "マスク・ウェーハステージ", right: "露光位置へ移動し、スキャナーでは両者を高精度に同期走査する" },
            { left: "アライメント・レベリング", right: "既存層のマーク、ウェーハの高さ・傾きを測り、位置と焦点を補正する" },
            { left: "搬送・環境・制御", right: "ウェーハ交換、温度・振動・真空などの環境、レシピ、安全、装置データを管理する" },
          ],
        },
        {
          type: "note",
          title: "EUVではレンズではなくミラーと真空を使う",
          body: "ASMLの公式説明では、13.5 nmのEUV光は空気を含む物質に吸収されやすいため、光路を真空にし、多層膜ミラーで光を導きます。DUVの投影レンズを短い波長へそのまま置き換える構成ではありません。",
        },
      ],
      paragraphs: [
        "解像度には光の波長、開口数、プロセス条件が関わります。一方、重ね合わせにはステージ、位置計測、ウェーハ変形補正、装置間整合が関わり、焦点には高さ計測、光学系、レジスト・下層の条件も影響します。",
        "露光装置は光学機械であると同時に、精密メカトロニクス、真空、熱、制御、ソフトウェア、計測を統合した量産システムです。",
      ],
    },
    {
      id: "methods",
      heading: "EUV・DUV・i線・ナノインプリントは用途で使い分ける",
      lead: "新しい方式が、すべての層と基板で従来方式を置き換えるわけではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "特徴と主な見方",
          rows: [
            { left: "EUV｜13.5 nm", right: "短波長の光、反射型マスク、多層膜ミラー、真空を使う。先端ロジック・メモリの複雑な層で使われる" },
            { left: "ArF液浸｜193 nm", right: "投影レンズとウェーハの間へ水を入れて高い開口数を得る。先端層を含む量産で使われる" },
            { left: "ArFドライ｜193 nm", right: "液浸を使わないArF露光。必要解像度、コスト、生産性を考えて層を選ぶ" },
            { left: "KrF｜248 nm", right: "成熟した前工程層や各種デバイスで使われる。解像度だけでなく基板・層・生産性を見る" },
            { left: "i線｜365 nm", right: "パワー、MEMS、センサー、成熟工程、後工程・先端パッケージなど幅広い用途を持つ" },
            { left: "ナノインプリント", right: "投影レンズで像を縮小せず、微細な型をレジストへ接触させ、硬化・離型してパターンを作る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "レジスト塗布・露光・現像の原理を見る" },
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "設計データを量産用原版へ変える工程と主要企業を見る" },
            { label: "マスクブランクスメーカー", href: "/guides/semiconductor-mask-blank-manufacturers", description: "DUV・EUV原版の基板・薄膜材料と主要企業を見る" },
            { label: "ペリクルメーカー", href: "/guides/semiconductor-pellicle-manufacturers", description: "マスク異物を焦点外に置く保護膜と主要企業を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "露光光で反応する材料と主要企業を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "CD・重ね合わせ・欠陥を工程へ返す流れを見る" },
          ],
        },
      ],
      paragraphs: [
        "ASMLはEUVとDUVの双方が長期にわたり並行して必要だと説明しています。チップには多くの層があり、最も厳しい層と、それ以外の層では必要な解像度・重ね合わせ・コストが異なるためです。",
        "NikonはArF液浸、ArFドライ、KrF、i線に加え、先端パッケージ向けデジタル露光などを案内しています。CanonはKrF、i線、先端パッケージ向け装置、ナノインプリントを製品群として公開しています。",
      ],
    },
    {
      id: "stepper-scanner",
      heading: "ステッパーとスキャナーは、露光領域の動かし方が違う",
      lead: "名称だけで世代や用途を決めず、光源と対象製品も合わせて確認します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "STEPPER", title: "静止して一括露光", body: "一つの露光領域を投影し、ウェーハを次の位置へステップして繰り返します。" },
            { label: "SCANNER", title: "同期走査して露光", body: "マスクとウェーハを同期して動かし、スリット状の光で露光領域を走査します。" },
            { label: "MATCH", title: "層と装置を組み合わせる", body: "同じ工場で異なる光源・型式の装置を使うため、装置間の重ね合わせも重要です。" },
          ],
        },
      ],
      paragraphs: [
        "スキャナーは走査制御を利用して広い露光領域と高い結像性能を両立します。ステッパーはi線やKrF、前工程・後工程を含む多様な用途で現在も製品が提供されています。",
        "企業比較では『ステッパーかスキャナーか』だけで終わらず、光源、NA、露光領域、対応基板、解像度、重ね合わせ、スループットを同じ仕様条件で確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "露光・塗布現像装置の代表企業5社",
      lead: "露光装置メーカーと周辺装置メーカーを同じ順位表にせず、工程上の役割を分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "ASML｜オランダ", right: "EUV、High NA EUV、ArF液浸・ドライ、KrF、i線の露光システム、計測・検査、計算リソグラフィ、サービス" },
            { left: "Nikon｜日本", right: "ArF液浸・ドライ、KrF、i線、先端パッケージ向け露光、アライメント、計測・検査、サービス" },
            { left: "Canon｜日本", right: "KrF、i線、先端パッケージ・パネル向け露光、ナノインプリント、ウェーハ位置計測、支援サービス" },
            { left: "東京エレクトロン｜日本", right: "レジスト塗布、ベーク、現像を担うコータ・デベロッパ。EUV・DUVなどの露光フローへ対応" },
            { left: "SCREEN｜日本", right: "塗布現像装置、洗浄・熱処理など。レジスト工程と露光前後のウェーハ処理を支える" },
          ],
        },
        {
          type: "note",
          title: "代表企業は市場順位を示さない",
          body: "この記事は各社の公開製品を工程へ置くための代表例です。対象製品、地域、期間で市場の切り方は変わります。装置の優劣やシェアは推測せず、最新の製品ページと個別仕様を確認します。",
        },
      ],
      paragraphs: [
        "ASMLはEUVを含む露光システムを展開し、NikonとCanonも用途の異なる露光装置を現在の製品ラインアップとして公開しています。『露光装置メーカーは一社だけ』と一般化せず、方式と対象層をそろえる必要があります。",
        "東京エレクトロンとSCREENは、ここでは主にレジストの塗布・ベーク・現像を行う装置企業として位置付けます。露光装置とは役割が違いますが、搬送、処理時間、欠陥、レジスト条件を含めて強く連携します。",
      ],
    },
    {
      id: "comparison",
      heading: "露光装置メーカーは、6つの条件をそろえて比較する",
      lead: "会社名の比較を、実際の装置・工程の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較条件",
          rightLabel: "確認すること",
          rows: [
            { left: "1. 方式・波長", right: "EUV、ArF液浸・ドライ、KrF、i線、ナノインプリントのどれか" },
            { left: "2. 対象層・用途", right: "先端ロジック・メモリ、成熟工程、パワー・MEMS、先端パッケージ、研究開発など" },
            { left: "3. 基板・露光領域", right: "ウェーハ径、パネル・特殊基板、露光フィールド、段差や反りへの対応" },
            { left: "4. 転写性能", right: "解像度、CD、重ね合わせ、焦点、露光量、装置間整合、欠陥" },
            { left: "5. 量産性能", right: "スループット、稼働率、設置条件、保守、消耗品、電力・材料使用、装置寿命" },
            { left: "6. 工程統合", right: "塗布現像、マスク、計測・検査、計算補正、プロセス支援、サービスとの接続" },
          ],
        },
      ],
      paragraphs: [
        "数値を比べるときは、ウェーハサイズ、露光フィールド、ショット数、測定定義、オプション、対象レジストなどの前提をそろえます。メーカー公称値が異なる条件で記載されている場合、数字だけを横並びにしません。",
        "露光方式は製品の要求から選ばれます。最小寸法だけでなく、重ね合わせ、生産性、コスト、既存工程との整合、供給・保守体制まで含めて量産価値を見ます。",
      ],
    },
    {
      id: "ecosystem",
      heading: "露光装置の性能は、マスク・材料・計測・計算と一緒に作る",
      lead: "装置本体の仕様だけでは、ウェーハ上の最終パターンを説明できません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "MASK", title: "マスク・マスク検査", body: "元になるパターンを作り、欠陥や寸法を管理します。EUVでは反射型マスクを使います。" },
            { label: "RESIST", title: "レジスト・下層膜", body: "感度、解像、粗さ、密着、反射、後工程への耐性を材料で調整します。" },
            { label: "TRACK", title: "塗布・ベーク・現像", body: "膜厚、温度、時間、現像、欠陥を管理し、露光前後の状態を安定させます。" },
            { label: "METROLOGY", title: "計測・検査", body: "CD、重ね合わせ、焦点、欠陥を測り、装置や工程の補正へ返します。" },
            { label: "COMPUTE", title: "計算リソグラフィ", body: "光学・レジスト・マスクの影響をモデル化し、マスク形状や露光条件を補正します。" },
            { label: "SERVICE", title: "保守・アプリケーション", body: "装置状態、部品、校正、レシピ、工程変更を継続的に支援します。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "欠陥・CD・重ね合わせを測る装置企業を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "露光後のパターンを材料へ移す装置を見る" },
          ],
        },
      ],
      paragraphs: [
        "ASMLは露光装置に加え、計測・検査と計算リソグラフィを統合する製品・サービスを案内しています。NikonとCanonも位置計測、アライメント、装置支援に関する製品・サービスを公開しています。",
        "企業研究では『露光装置本体を作る会社』だけでなく、光源・光学部品、精密ステージ、マスク、レジスト、塗布現像、計測、ソフトウェア、保守までサプライチェーンを広げると職種の選択肢が見えます。",
      ],
    },
    {
      id: "jobs",
      heading: "露光・リソグラフィ装置に関わる主な職種",
      lead: "同じメーカーでも、装置を作る仕事と顧客工程を成立させる仕事があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種",
          rightLabel: "主な仕事",
          rows: [
            { left: "光学・光源・計測開発", right: "照明、投影、センサー、画像・信号処理、校正、光学性能を設計・評価する" },
            { left: "機械・メカトロニクス", right: "ステージ、搬送、真空、熱、振動、構造、精密位置決めを設計する" },
            { left: "電気・制御・ソフトウェア", right: "モーション制御、装置制御、安全、UI、データ処理、工場システム接続を開発する" },
            { left: "プロセス・アプリケーション", right: "レジスト、マスク、露光・現像条件、CD・重ね合わせを顧客製品へ合わせ込む" },
            { left: "フィールドサービス", right: "据付、立ち上げ、保守、故障解析、校正、改造、稼働率改善を顧客工場で支える" },
            { left: "生産・品質・サプライチェーン", right: "精密部品の製造、組立、検査、供給、変更管理、装置品質を支える" },
          ],
        },
      ],
      paragraphs: [
        "装置保全、精密機械、光学、画像処理、モーション制御、真空、品質、生産技術、顧客対応の経験は接点を整理しやすい領域です。求人では担当する方式・装置、開発か量産支援か、勤務地、顧客先作業、海外連携を確認します。",
        "技術用語を並べるだけでなく、位置精度、再現性、稼働率、復旧時間、欠陥、処理時間、安全、変更管理のどこへ貢献したかを説明すると、経験と仕事を結び付けやすくなります。",
      ],
    },
    {
      id: "faq",
      heading: "半導体露光装置メーカーでよくある質問",
      lead: "方式と企業の関係を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体露光装置とは何ですか？", answer: "フォトマスクなどが持つ回路情報を、位置と焦点を合わせてウェーハ上のレジストへ転写する装置です。通常、露光だけでシリコンを直接削るわけではありません。" },
            { question: "露光装置メーカーはASMLだけですか？", answer: "ASMLはEUVとDUVの露光システムを展開しています。NikonはArF液浸・ドライ、KrF、i線など、CanonはKrF、i線、ナノインプリントなどを現在の製品群として公開しています。方式と用途をそろえて見ます。" },
            { question: "EUVを使えばすべての層を露光できますか？", answer: "一つのチップでも層ごとに必要な解像度、重ね合わせ、生産性、コストが異なります。ASMLもEUVとDUVを並行して使う考え方を説明しており、EUVだけで全層を処理するとは限りません。" },
            { question: "露光装置とコータ・デベロッパの違いは？", answer: "露光装置はパターン情報をレジストへ転写します。コータ・デベロッパはレジスト塗布、ベーク、現像などを行います。役割は違いますが、同じリソグラフィ工程で連携します。" },
            { question: "ナノインプリントは光学露光と何が違いますか？", answer: "一般的な光学露光は投影光学系でマスク像をレジストへ結像します。ナノインプリントは微細な型をレジストへ接触させ、硬化・離型してパターンを作ります。" },
            { question: "ステッパーとスキャナーの違いは？", answer: "ステッパーは露光領域を静止させて一括露光し、位置を移して繰り返します。スキャナーはマスクとウェーハを同期走査して露光します。実際の用途は光源や製品仕様も合わせて確認します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜方式・用途・工程連携をそろえて露光装置メーカーを見る",
      lead: "露光装置は、光学、精密位置決め、計測、制御を統合して回路情報を量産転写します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "METHOD", title: "方式を分ける", body: "EUV、ArF、KrF、i線、ナノインプリントは対象層と用途が異なる" },
            { label: "SYSTEM", title: "装置全体を見る", body: "光源、光学系、ステージ、計測、搬送、制御が転写結果を作る" },
            { label: "ECOSYSTEM", title: "工程でつなぐ", body: "塗布現像、マスク、材料、計測、計算、保守まで含めて理解する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像のメカニズムを見る" },
            { label: "塗布現像装置メーカー", href: "/guides/semiconductor-coater-developer-manufacturers", description: "露光前後のレジスト塗布・ベーク・現像装置を見る" },
            { label: "CD-SEM・電子線計測装置メーカー", href: "/guides/semiconductor-cd-sem-manufacturers", description: "露光・現像後のCD・EPEを測り、工程へ返す装置を見る" },
            { label: "フォトマスク描画装置メーカー", href: "/guides/semiconductor-photomask-writer-manufacturers", description: "ウェーハ露光装置と異なる、原版を直接描く装置を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置企業を一つの地図で見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "リソグラフィを支える計測・検査装置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "転写したパターンを材料へ移す装置を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "装置・材料・半導体メーカーの位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、まず公式ラインアップから方式と対象用途を一つ選び、同じ条件の装置で比較してください。次に塗布現像、マスク、計測・検査、サービスまで工程を広げると、企業と仕事の違いが見えます。",
      ],
    },
  ],
  todayQuest: "ASML・Nikon・Canonから1社を選び、公式製品をEUV・ArF・KrF・i線・ナノインプリントのどこへ置けるか確認する",
  relatedGuideSlugs: [
    "photolithography-process",
    "semiconductor-coater-developer-manufacturers",
    "semiconductor-cd-sem-manufacturers",
    "semiconductor-photomask-writer-manufacturers",
    "semiconductor-photomask-manufacturers",
    "semiconductor-mask-blank-manufacturers",
    "semiconductor-pellicle-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["asml", "nikon", "canon", "tokyo-electron", "screen"],
};
