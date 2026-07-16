import type { GuideArticle } from "@/content/guides/types";

export const semiconductorSiliconWaferManufacturersGuide: GuideArticle = {
  slug: "semiconductor-silicon-wafer-manufacturers",
  title: "半導体シリコンウェーハメーカーとは？信越化学・SUMCOなどを初心者向けに図解",
  description:
    "半導体用シリコンウェーハは、回路を形成する単結晶基板です。ポリッシュト・エピタキシャル・SOI・FZなどの違い、信越化学・SUMCO・GlobalWafers・Siltronic、比較軸と仕事内容を図解します。",
  targetQuery: "半導体 シリコンウェーハ メーカー",
  searchIntent:
    "半導体用シリコンウェーハの種類と仕様、信越化学・SUMCO・GlobalWafers・Siltronicなど主要メーカーの製品領域、デバイス用途、企業比較の方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "信越化学工業、SUMCO、GlobalWafers、Siltronicの公式製品・技術情報をもとに、ポリッシュト、エピタキシャル、アニール、SOI、FZ、再生・モニターウェーハと、結晶・電気・形状・表面の比較軸を整理しました。市場シェアや企業の優劣ではなく、デバイス用途と基板仕様をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のシリコンウェーハ製造記事で単結晶育成、スライス、研磨、洗浄・検査を整理したうえで、製品種類と供給企業を独立して調べる記事が必要だと判断",
    "信越化学工業とSUMCOの公式情報で、ポリッシュト、エピタキシャル、アニール、SOI、拡散・埋込層、再生などの製品領域を確認",
    "GlobalWafersとSiltronicの公式情報で、ポリッシュト、エピタキシャル、FZ、特殊・モニターウェーハと、ロジック・メモリ・アナログ・パワーなどの用途を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Silicon Wafers",
      url: "https://www.shinetsu.co.jp/en/products/semiconductor-silicon-business/silicon-wafers/",
      publisher: "Shin-Etsu Chemical Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Product Lineup",
      url: "https://www.sumcosi.com/english/products/lineup.html",
      publisher: "SUMCO CORPORATION",
      accessedAt: "2026-07-16",
    },
    {
      title: "Production Processes",
      url: "https://www.sumcosi.com/english/products/process/",
      publisher: "SUMCO CORPORATION",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Solutions and Products",
      url: "https://www.gw-semi.com/products/",
      publisher: "GlobalWafers Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Silicon Wafers and Products",
      url: "https://www.siltronic.com/en/products.html",
      publisher: "Siltronic AG",
      accessedAt: "2026-07-16",
    },
    {
      title: "Special Products",
      url: "https://www.siltronic.com/en/products/special-products.html",
      publisher: "Siltronic AG",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "シリコンウェーハメーカーを調べても、各社の違いが直径やシェアだけに見え、ポリッシュト・エピタキシャル・アニール・SOI・FZがどのデバイスへ使われるのか分かりにくくありませんか。",
    conclusion:
      "ウェーハメーカーは、高純度シリコンから単結晶を育て、薄い基板へ加工し、結晶、抵抗率、酸素、平坦度、表面、清浄度を用途別に作り込みます。企業比較では、基板径、結晶方式、製品種類、デバイス用途、品質仕様、特殊加工、供給・認定、技術支援をそろえます。",
    learnings:
      "ウェーハメーカーの役割、ポリッシュト・エピタキシャル・アニール・SOI・FZ・再生ウェーハ、直径・結晶・抵抗率・平坦度・表面、用途、主要メーカー、比較軸、供給認定、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "シリコンウェーハメーカーを比べるときは、直径だけでなく、『どのデバイスを作るために、どの結晶・電気・表面・形状を保証する基板か』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜高純度原料から、用途別の半導体基板を供給する",
      description:
        "代表的なウェーハメーカーの役割を単純化しています。原料調達、結晶方式、加工順、特殊処理、内製範囲は企業・製品で異なります。",
      stages: [
        { label: "01 / FEED", title: "高純度原料を受ける", body: "多結晶シリコン、ドーパント、るつぼ、ガスなどの純度とロットを管理する" },
        { label: "02 / CRYSTAL", title: "単結晶を育てる", body: "CZ・MCZ・FZなどで結晶方位、導電型、抵抗率、酸素・欠陥を作り込む" },
        { label: "03 / WAFER", title: "薄い基板へ加工", body: "外周・方位を整え、スライス、ラッピング、加工損傷除去、研磨で形状と鏡面を作る" },
        { label: "04 / MODIFY", title: "用途別に改質", body: "エピタキシャル成長、アニール、酸化・貼り合わせ、拡散などを必要に応じて加える" },
        { label: "05 / QUALIFY", title: "洗浄・検査", body: "粒子、金属、結晶、抵抗率、厚さ、平坦度、反り、表面、エッジを確認する" },
        { label: "06 / SUPPLY", title: "認定仕様で供給", body: "製品仕様・変更・ロット・梱包・輸送を管理し、デバイス工場の受入れへ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "品質の層",
      rightLabel: "メーカーが作り込む主な項目",
      rows: [
        { left: "結晶", right: "結晶方位、CZ・MCZ・FZ、酸素・炭素、転位・結晶起因欠陥、ゲッタリング" },
        { left: "電気", right: "p型・n型、ドーパント、抵抗率と面内・結晶長手方向の分布、キャリア寿命" },
        { left: "寸法・形状", right: "直径、厚さ、平坦度、反り、エッジ形状、ノッチ、局所的な高さ変動" },
        { left: "表面", right: "片面・両面研磨、粗さ、傷、ピット、ヘイズ、自然酸化膜、表面欠陥" },
        { left: "清浄度", right: "粒子、金属・有機汚染、洗浄・乾燥、容器、梱包、輸送環境" },
        { left: "機能層", right: "エピタキシャル層、アニール改質層、埋込絶縁層、拡散・埋込層など" },
        { left: "供給品質", right: "ロット追跡、仕様・変更管理、検査データ、認定、供給継続、技術対応" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "シリコンウェーハメーカーとは、半導体工程の最初の基準面を作る材料企業",
      lead: "ウェーハは丸い板ではなく、全デバイス工程へ結晶・電気・形状を渡す基板です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "CRYSTAL", title: "単結晶を作る", body: "種結晶から原子配列を引き継ぎ、結晶方位と欠陥・酸素を管理します。" },
            { label: "ELECTRICAL", title: "電気特性を作る", body: "ドーパントで導電型と抵抗率を調整し、面内・長手方向の分布を管理します。" },
            { label: "SURFACE", title: "基準面を作る", body: "平坦度、反り、粗さ、傷、粒子、金属汚染をデバイス工程の要求へ合わせます。" },
            { label: "SUPPLY", title: "同じ品質で供給する", body: "認定された仕様を量産ロットで再現し、変更・検査・梱包・供給を管理します。" },
          ],
        },
        {
          type: "note",
          title: "製造工程記事と検索意図を分ける",
          body: "CZ・FZ、スライス、研磨、洗浄・検査のメカニズムはシリコンウェーハ製造記事で説明します。本記事は製品種類、主要企業、用途、選定・企業比較を扱います。",
        },
      ],
      paragraphs: [
        "信越化学工業はシリコンウェーハをメモリ、ロジック、アナログ、イメージセンサー、ディスクリートなどの基板として案内しています。SUMCOも半導体デバイスを作る基礎材料として製品群を示しています。",
        "ウェーハの微小な形状・表面・結晶の差は、露光の焦点、膜厚、熱処理、注入、配線、検査へ受け渡されます。デバイス工場は材料受入れだけでなく、実際の工程・電気特性で供給元を認定します。",
      ],
    },
    {
      id: "value-chain",
      heading: "多結晶シリコン企業・ウェーハ企業・デバイス企業は役割が違う",
      lead: "『シリコン会社』を、原料・基板・デバイスへ分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業区分",
          rightLabel: "主な役割と製品",
          rows: [
            { left: "高純度多結晶シリコン", right: "金属シリコンを化合物化・精製し、単結晶育成に使う高純度原料を供給する" },
            { left: "シリコンウェーハメーカー", right: "原料から単結晶を育て、薄板加工・研磨・洗浄・検査・特殊加工を行い基板として供給する" },
            { left: "特殊基板・エピ企業", right: "SOI、エピタキシャル層、再生、化合物材料など、特定構造・用途の基板や加工を供給する" },
            { left: "IDM・ファウンドリ", right: "購入したウェーハ上へトランジスタと配線を形成し、ダイを製造する" },
            { left: "装置・材料・計測企業", right: "結晶炉、切断・研磨・洗浄、エピ、検査装置、石英、研磨材、薬液、容器などを供給する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "シリコンウェーハ製造", href: "/guides/semiconductor-silicon-wafer-manufacturing", description: "単結晶・スライス・研磨・洗浄の工程を見る" },
            { label: "ファウンドリとは", href: "/guides/semiconductor-foundry", description: "購入したウェーハへ回路を作る企業との違いを見る" },
            { label: "ICチップ製造会社", href: "/guides/ic-chip-manufacturing-companies", description: "材料・装置・IDM・ファウンドリの分業を見る" },
          ],
        },
      ],
      paragraphs: [
        "ウェーハメーカーは多結晶原料を購入する場合も、グループ内・提携を含む調達網を持つ場合もあります。企業比較ではウェーハ製造だけでなく原料、特殊加工、地域別生産・技術支援の範囲を確認します。",
        "『ウェーハ』という言葉は製造途中のデバイス基板にも使われます。本記事で扱うのは、回路形成前に供給される半導体用シリコン基板とその派生製品です。",
      ],
    },
    {
      id: "product-types",
      heading: "ポリッシュト・エピタキシャル・アニール・SOIは、表面・内部構造が違う",
      lead: "デバイス側で必要な結晶・電気・絶縁構造から製品を選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "ウェーハ種類",
          rightLabel: "構造と用途の見方",
          rows: [
            { left: "ポリッシュトウェーハ", right: "単結晶を薄く切り、表面を鏡面・平坦にした基本製品。幅広いIC・ディスクリートの出発基板" },
            { left: "エピタキシャルウェーハ", right: "研磨基板上へ単結晶シリコン層を気相成長し、表層の抵抗率・厚さ・結晶品質を基板と分けて設計する" },
            { left: "アニールウェーハ", right: "高温熱処理で表面近傍の酸素・結晶状態を改質し、用途に必要な表層を作る" },
            { left: "SOIウェーハ", right: "薄い単結晶活性層の下へ絶縁層を持つ基板。低消費電力・高周波・センサーなど用途別の構造を作る" },
            { left: "拡散・埋込層付きウェーハ", right: "ウェーハメーカー側で拡散層や埋込層とエピ層を形成し、アナログ・ディスクリートなどの出発構造を供給する" },
            { left: "再生・モニターウェーハ", right: "装置・工程監視などに使う基板や、使用済み基板の膜を除去・再研磨した製品。デバイス用プライム品と仕様を分ける" },
          ],
        },
        {
          type: "note",
          title: "製品名が同じでも仕様は一つではない",
          body: "ポリッシュトやエピタキシャルという分類の中でも、直径、方位、導電型、抵抗率、酸素、厚さ、表面、エピ層が異なります。製品名だけで互換と判断しません。",
        },
      ],
      paragraphs: [
        "SUMCOはポリッシュト、エピタキシャル、アニール、埋込層付き、SOI、再生ウェーハを公開しています。信越化学工業もラップド、ポリッシュト、拡散、エピタキシャル、SOI、アニールを案内しています。",
        "GlobalWafersはポリッシュト、エピタキシャル、モニターなどを用途別に示し、Siltronicはポリッシュト、エピタキシャル、FZを含む特殊製品を展開しています。",
      ],
    },
    {
      id: "crystal-electrical",
      heading: "CZ・MCZ・FZ、導電型・抵抗率・酸素が、基板の電気的な土台を決める",
      lead: "結晶育成時に作り込む特性は、後から表面研磨だけでは変えられません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "仕様項目",
          rightLabel: "デバイス工程への意味",
          rows: [
            { left: "CZ・MCZ", right: "石英るつぼ内の融液から大口径単結晶を引き上げる。磁場利用などで酸素・対流・欠陥を用途へ合わせる" },
            { left: "FZ", right: "るつぼを使わず局所溶融帯を移動して結晶化し、低酸素・高抵抗率・長いキャリア寿命などを必要とする用途へ使う" },
            { left: "p型・n型", right: "添加する元素で多数キャリアの種類を決め、デバイス構造の出発条件を作る" },
            { left: "抵抗率", right: "ドーパント濃度と分布を反映し、素子分離、耐圧、RF損失、電流経路などへ影響する" },
            { left: "酸素・炭素", right: "結晶育成由来の含有量と析出を管理し、機械強度、欠陥、ゲッタリング、熱工程との相互作用へ対応する" },
            { left: "結晶欠陥", right: "空孔・格子間原子由来の欠陥、転位、積層欠陥などを用途と後続熱工程に合わせて管理する" },
          ],
        },
      ],
      paragraphs: [
        "SiltronicはCZとFZを用途で使い分け、FZを特に高純度、高抵抗率、長いキャリア寿命を必要とするパワー・高電圧用途へ案内しています。",
        "メーカー比較では『欠陥が少ない』という言葉だけでなく、どの結晶方式、酸素・抵抗率範囲、熱履歴、ゲッタリング設計をどのデバイス工程へ合わせるかを確認します。",
      ],
    },
    {
      id: "geometry-surface",
      heading: "平坦度・反り・表面・粒子は、露光と成膜の最初の条件になる",
      lead: "微細加工ではウェーハ全面と局所の形状、エッジ、清浄度を分けて見ます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DIAMETER", title: "直径・厚さ", body: "装置搬送、カセット、チャック、熱容量、機械強度の基準になります。" },
            { label: "FLATNESS", title: "平坦度", body: "ウェーハ全体と露光フィールドなど局所の高さ変動を管理します。" },
            { label: "WARP", title: "反り・形状", body: "自由状態や保持状態での反り、厚さ分布、エッジ近傍の形状を確認します。" },
            { label: "SURFACE", title: "粗さ・傷・欠陥", body: "微小な凹凸、傷、ピット、ヘイズなど、膜形成とパターンへ影響する表面を管理します。" },
            { label: "CLEAN", title: "粒子・汚染", body: "粒子、金属、有機物、容器・梱包由来の汚染を洗浄・検査・輸送まで管理します。" },
            { label: "EDGE", title: "エッジ・ノッチ", body: "端面形状、欠け、方位基準を搬送・クランプ・エッジ除外領域へ合わせます。" },
          ],
        },
      ],
      paragraphs: [
        "SUMCOはポリッシュトウェーハを高い平坦度と清浄度を持つ基板として説明し、GlobalWafersも超平坦・超清浄な研磨ウェーハを顧客仕様へ合わせる製品として示しています。",
        "平均厚さが合っていても、局所的な高さ、エッジ、反り、粒子が規格外なら微細加工へ影響します。仕様値の定義、測定範囲、エッジ除外、保持方法、測定装置をそろえます。",
      ],
    },
    {
      id: "applications",
      heading: "ロジック・メモリ・アナログ・パワー・センサーでは、基板要求が変わる",
      lead: "最先端か成熟世代かではなく、デバイス機能から必要仕様を逆算します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "LOGIC", title: "先端ロジック", body: "300mm、微細加工向け平坦度・清浄度、結晶・表面欠陥、エピ・アニールなどを用途へ合わせます。" },
            { label: "MEMORY", title: "DRAM・NAND", body: "大口径基板の面内均一性、結晶欠陥、酸素、熱工程との相互作用、量産供給を重視します。" },
            { label: "ANALOG", title: "アナログ・ミックスド", body: "抵抗率、エピ層、素子分離、ノイズ、耐圧などを製品構造へ合わせます。" },
            { label: "POWER", title: "シリコンパワー", body: "低・高抵抗率、FZ、エピ層厚さ・均一性、キャリア寿命、耐圧、機械強度を考慮します。" },
            { label: "SENSOR", title: "イメージ・MEMSセンサー", body: "表面・裏面、エピ、SOI、厚さ、反り、接合・薄化工程への適合を重視します。" },
            { label: "MONITOR", title: "工程モニター", body: "装置の膜厚・粒子・熱・洗浄などを監視するため、プライム品と目的・仕様・再生運用を分けます。" },
          ],
        },
      ],
      paragraphs: [
        "信越化学工業はメモリ、ロジック、アナログ、イメージセンサー、ディスクリートなどの用途を示しています。SiltronicはCMOS・メモリ、エピ、FZ・パワーなどの特殊製品を公開しています。",
        "200mm以下の基板も、アナログ、パワー、センサー、ディスクリートなどで重要です。直径が大きいほど技術的に常に優れるのではなく、工場装置、製品設計、コスト、供給期間へ適合する径を選びます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "主要メーカーは、製品群・結晶技術・生産地域・支援範囲が異なる",
      lead: "代表企業を順位ではなく、公式に確認できる製品領域へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な製品領域",
          rows: [
            { left: "信越化学工業", right: "ラップド、ポリッシュト、拡散、エピタキシャル、SOI、アニールウェーハと、メモリ・ロジック・アナログ・センサー・ディスクリート用途" },
            { left: "SUMCO", right: "ポリッシュト、エピタキシャル、アニール、埋込層付き、SOI、再生ウェーハと、結晶育成から加工・特殊処理まで" },
            { left: "GlobalWafers", right: "ポリッシュト、エピタキシャル、アニール、高抵抗率、SOI、FZ、モニター・再生を含む地域横断のウェーハ製品" },
            { left: "Siltronic", right: "最大300mmのポリッシュト・エピタキシャルウェーハ、CZ・FZ、CMOS・メモリ・パワーなどの特殊製品" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、網羅的な市場順位ではない",
          body: "ウェーハ企業は径、結晶方式、特殊加工、用途、生産地域、供給・技術対応が異なります。シェアや売上だけで優劣を決めず、同じ基板仕様と認定範囲を確認してください。",
        },
      ],
      paragraphs: [
        "信越化学工業とSUMCOは日本に本社を置く主要なシリコンウェーハ企業、GlobalWafersは台湾を本拠として複数地域に製品・生産拠点を持ち、Siltronicはドイツを本拠とするウェーハ企業です。",
        "企業研究では製品名だけでなく、単結晶育成、ウェーハ加工、エピ・SOIなどの内製範囲、対象径・用途、工場地域、顧客認定・技術支援を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "シリコンウェーハメーカーを比較する8つの軸",
      lead: "同じデバイス用途・径・結晶・表面仕様へそろえます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "基板径・用途", body: "300mm、200mm以下とロジック、メモリ、アナログ、パワー、センサー" },
            { label: "02", title: "結晶・電気", body: "CZ・MCZ・FZ、方位、導電型、抵抗率、酸素・炭素、欠陥" },
            { label: "03", title: "製品種類", body: "ポリッシュト、エピ、アニール、SOI、拡散・埋込、再生・モニター" },
            { label: "04", title: "形状", body: "厚さ、平坦度、反り、局所形状、エッジ、ノッチ、機械強度" },
            { label: "05", title: "表面・清浄度", body: "粗さ、傷、ピット、ヘイズ、粒子、金属・有機汚染、表面膜" },
            { label: "06", title: "特殊加工", body: "エピ層、熱処理、ゲッタリング、貼り合わせ、拡散、再生" },
            { label: "07", title: "認定・供給", body: "評価期間、仕様・変更、ロット追跡、生産地域、供給継続、BCP、梱包" },
            { label: "08", title: "技術・品質支援", body: "解析、検査データ、相関、異常対応、共同開発、現地窓口" },
          ],
        },
      ],
      paragraphs: [
        "欠陥密度、平坦度、粒子数、抵抗率などは、径、測定法、エッジ除外、仕様範囲が違えば横並びにできません。共通のデバイス工程・測定定義で比較します。",
        "材料変更は多数の工程と電気特性へ影響するため、価格だけで切り替えられません。受入れ検査、試作、工程相関、信頼性、量産評価、変更管理を通じて供給元と製品を認定します。",
      ],
    },
    {
      id: "qualification-jobs",
      heading: "供給認定と職種は、結晶から顧客工程まで長い範囲をつなぐ",
      lead: "材料品質を量産で再現し、異常時に結晶・加工・測定へ戻って解析します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・領域",
          rightLabel: "主な仕事",
          rows: [
            { left: "結晶・材料開発", right: "単結晶育成、ドーパント、酸素・欠陥、熱履歴、シミュレーション、原料・部材を開発する" },
            { left: "ウェーハ加工・プロセス", right: "スライス、ラッピング、加工損傷除去、研磨、洗浄、熱処理、エピ、SOIを作り込む" },
            { left: "設備・生産技術", right: "結晶炉、切断、研磨、洗浄、検査、搬送・自動化設備の能力・稼働・保全を改善する" },
            { left: "計測・解析", right: "結晶、抵抗率、酸素、欠陥、形状、表面、粒子、汚染を測定し、空間・ロット傾向を解析する" },
            { left: "品質保証", right: "顧客仕様、工程能力、変更、逸脱、トレーサビリティ、監査、苦情・再発防止を管理する" },
            { left: "アプリケーション・技術営業", right: "デバイス工程の要求を基板仕様へ変換し、評価・認定・異常解析・共同開発を支援する" },
            { left: "生産・サプライチェーン", right: "長い製造サイクル、需要変動、原料・容器、工場配分、在庫、輸送、供給継続を管理する" },
            { left: "環境・安全", right: "高温炉、回転・切断設備、化学品、排水・廃棄、エネルギー、作業・設備安全を管理する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "ウェーハ供給後に回路・パッケージを作る全体像を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・膜厚・寸法を測り工程へ戻す考え方を見る" },
            { label: "生産技術からプロセスエンジニア", href: "/guides/production-engineering-to-semiconductor-process-engineer", description: "工程改善経験の整理方法を見る" },
          ],
        },
      ],
      paragraphs: [
        "材料、結晶、セラミックス、研磨、洗浄、精密加工、分析、設備保全、品質、生産管理、データ解析の経験はウェーハ企業へ接点を整理しやすい領域です。",
        "経験を説明するときは、抵抗率・欠陥・平坦度・粒子などの品質特性、工程能力、設備稼働、材料使用量、異常解析、変更・認定、供給安定のどこへ貢献したかを担当工程と一緒に整理します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体シリコンウェーハメーカーでよくある質問",
      lead: "材料企業・デバイス企業と、製品種類の違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体シリコンウェーハメーカーとは何ですか？", answer: "高純度シリコンから単結晶を育て、薄板加工・研磨・洗浄・検査・特殊加工を行い、半導体回路を形成する前の基板として供給する企業です。" },
            { question: "主なシリコンウェーハメーカーは？", answer: "この記事では信越化学工業、SUMCO、GlobalWafers、Siltronicを代表例として紹介しています。製品領域別の例であり、網羅的な市場順位ではありません。" },
            { question: "ファウンドリとの違いは？", answer: "ウェーハメーカーは回路形成前のシリコン基板を供給します。ファウンドリはその基板上へトランジスタと配線を形成し、設計データからダイを製造します。" },
            { question: "ポリッシュトウェーハとエピタキシャルウェーハの違いは？", answer: "ポリッシュトウェーハは単結晶基板表面を鏡面・平坦にした基本製品です。エピタキシャルウェーハは、その表面へ特性を制御した単結晶シリコン層を追加成長させます。" },
            { question: "CZウェーハとFZウェーハの違いは？", answer: "CZは石英るつぼ内の融液から引き上げる方式で大口径量産に広く使われます。FZはるつぼを使わず溶融帯を移動し、低酸素・高抵抗率などを必要とする用途に使われます。" },
            { question: "300mmウェーハが常に最先端ですか？", answer: "直径は工場の生産方式を示す重要な項目ですが、技術の優劣そのものではありません。200mm以下もアナログ、パワー、センサー、ディスクリートなどで広く使われます。" },
            { question: "ウェーハメーカーは何で比較しますか？", answer: "用途、径、CZ・FZ、導電型・抵抗率、製品種類、平坦度・表面・清浄度、特殊加工、顧客認定、供給地域、技術支援を同じ条件で比較します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜用途・結晶・製品種類・形状・表面・供給をそろえてメーカーを見る",
      lead: "ウェーハ企業は、すべてのデバイス工程へ最初の材料条件を渡します。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "APPLICATION", title: "用途を決める", body: "ロジック、メモリ、アナログ、パワー、センサーと基板径を確認する" },
            { label: "MATERIAL", title: "結晶・電気を見る", body: "CZ・FZ、方位、導電型、抵抗率、酸素、欠陥を確認する" },
            { label: "PRODUCT", title: "製品種類を選ぶ", body: "ポリッシュト、エピ、アニール、SOI、特殊・モニターを用途へ合わせる" },
            { label: "SUPPLY", title: "量産供給まで見る", body: "形状、表面、清浄度、認定、変更、工場地域、技術支援を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "シリコンウェーハ製造", href: "/guides/semiconductor-silicon-wafer-manufacturing", description: "単結晶から鏡面基板へ仕上げるメカニズムを見る" },
            { label: "ウェーハ欠陥検査装置メーカー", href: "/guides/semiconductor-wafer-defect-inspection-manufacturers", description: "パターンなしウェーハの粒子・傷・表面欠陥を探す装置を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "ウェーハが前工程・後工程へ進む全体像を見る" },
            { label: "ICチップ製造会社", href: "/guides/ic-chip-manufacturing-companies", description: "材料・IDM・ファウンドリ・OSATの違いを見る" },
            { label: "ファウンドリとは", href: "/guides/semiconductor-foundry", description: "ウェーハ上へ回路を形成する受託製造企業を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "材料・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのウェーハを選び、用途、径、結晶方式、導電型・抵抗率、製品種類、形状・表面、供給・支援の7項目で整理してください。同じデバイス用途へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "信越化学・SUMCO・GlobalWafers・Siltronicから1社を選び、公式製品を用途・径・結晶方式・製品種類・形状／表面・供給の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-silicon-wafer-manufacturing",
    "semiconductor-wafer-defect-inspection-manufacturers",
    "semiconductor-manufacturing-process",
    "ic-chip-manufacturing-companies",
    "semiconductor-foundry",
    "semiconductor-inspection-metrology",
    "semiconductor-deposition-process",
    "semiconductor-oxidation-thermal-process",
    "production-engineering-to-semiconductor-process-engineer",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["sumco"],
};
