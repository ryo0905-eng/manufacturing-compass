import type { GuideArticle } from "@/content/guides/types";

export const photolithographyProcessGuide: GuideArticle = {
  slug: "photolithography-process",
  title: "フォトリソグラフィとは？塗布・露光・現像の仕組みを初心者向けに図解",
  description:
    "半導体のフォトリソグラフィ工程を、ウェーハ断面の図で初心者向けに解説。フォトレジストの塗布、マスクを使った露光、現像、ポジ型・ネガ型、解像度・重ね合わせ・焦点、i線・KrF・ArF・EUVの違いを整理します。",
  targetQuery: "フォトリソグラフィ とは",
  searchIntent:
    "半導体製造のフォトリソグラフィについて、塗布・露光・現像の順序、光でパターンができる仕組み、装置と管理項目を図で理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "ASML、東京エレクトロン、ニコンの公式技術解説をもとに、一般的な投影露光とレジスト工程を単純化しています。材料、装置、製品世代によって実際の処理順序と条件は異なります。",
  showCareerCtas: false,
  experienceBasis: [
    "ASMLの公式解説で、マスク、投影光学系、波長、NA、解像度、重ね合わせ・焦点の基本を確認",
    "東京エレクトロンの公式解説で、レジスト塗布、露光、現像とコータ・デベロッパの役割を確認",
    "ニコンの公式解説で、ウェーハとフォトマスクの位置合わせ、縮小投影、各光源の用途を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Lithography principles",
      url: "https://www.asml.com/en/technology/lithography-principles",
      publisher: "ASML",
      accessedAt: "2026-07-15",
    },
    {
      title: "The Rayleigh criterion",
      url: "https://www.asml.com/en/technology/lithography-principles/rayleigh-criterion",
      publisher: "ASML",
      accessedAt: "2026-07-15",
    },
    {
      title: "Light and lasers",
      url: "https://www.asml.com/en/technology/lithography-principles/light-and-lasers",
      publisher: "ASML",
      accessedAt: "2026-07-15",
    },
    {
      title: "Measuring accuracy",
      url: "https://www.asml.com/en/technology/lithography-principles/measuring-accuracy",
      publisher: "ASML",
      accessedAt: "2026-07-15",
    },
    {
      title: "CLEAN TRACK LITHIUS Pro DICE: World-class Productivity and Innovative Defect Control Technology",
      url: "https://www.tel.com/blog/all/20260428_001.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "How Semiconductor is made: Pattern Formation",
      url: "https://www.tel.com/museum/exhibition/process/process2.html?page=2",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Fabricating high-precision, multifunctional semiconductors",
      url: "https://www.nikon.com/business/semi/technology/story02.html",
      publisher: "Nikon",
      accessedAt: "2026-07-15",
    },
    {
      title: "露光から計測・検査まで：半導体製造における露光装置と計測・検査装置の基礎知識",
      url: "https://www.jp.nikon.com/business/technologies/semiconductor-manufacturing-equipment-basic-knowledge/",
      publisher: "ニコン",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約14分",
  intro: {
    problem: "フォトリソグラフィを『光で回路を焼き付ける工程』と覚えていても、塗布・露光・現像で何が変わるのか分かりにくくありませんか。",
    conclusion: "フォトリソグラフィは、感光性のレジストへマスクの情報を光で転写し、現像して、次の加工で残す場所と取り除く場所を決める工程です。",
    learnings: "ウェーハ断面の変化、塗布・露光・現像の仕組み、ポジ型とネガ型、解像度を決める要素、重ね合わせ・焦点・CD、露光方式と関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "露光装置だけを理解しても、リソグラフィ工程全体は見えません。レジストを塗る前から、現像後のパターンを測るところまでを一続きで整理しました。",
      caption: "この記事の見方",
    },
    {
      type: "layer-process",
      title: "図解｜レジストがパターンになるまで",
      description:
        "ポジ型レジストを使う代表例を単純化しています。黄色がレジスト、水色が加工対象の薄膜、灰色がシリコンウェーハです。",
      stages: [
        {
          label: "01 / COAT",
          title: "レジストを均一に塗る",
          body: "薄膜の上へ感光性材料を塗布し、加熱して次の露光に適した状態へ整えます。",
          layers: [
            { label: "フォトレジスト", tone: "resist" },
            { label: "加工対象の薄膜", tone: "film" },
            { label: "シリコンウェーハ", tone: "substrate" },
          ],
        },
        {
          label: "02 / EXPOSE",
          title: "マスクを通して露光する",
          body: "位置を合わせ、マスクのパターンを投影して、光が届いた部分の化学状態を変えます。",
          signal: "露光光",
          layers: [
            { label: "マスク", tone: "mask", pattern: "openings" },
            { label: "露光されたレジスト", tone: "resist", pattern: "latent" },
            { label: "加工対象の薄膜", tone: "film" },
            { label: "シリコンウェーハ", tone: "substrate" },
          ],
        },
        {
          label: "03 / BAKE",
          title: "露光後の反応を進める",
          body: "使用するレジストに応じて露光後ベークを行い、現像で溶ける部分と残る部分の差を作ります。",
          layers: [
            { label: "潜像を持つレジスト", tone: "resist", pattern: "latent" },
            { label: "加工対象の薄膜", tone: "film" },
            { label: "シリコンウェーハ", tone: "substrate" },
          ],
        },
        {
          label: "04 / DEVELOP",
          title: "現像して開口を作る",
          body: "ポジ型では露光された部分を現像液で除去し、下の薄膜が見える開口を作ります。",
          layers: [
            { label: "パターン化したレジスト", tone: "resist", pattern: "openings" },
            { label: "加工対象の薄膜", tone: "film" },
            { label: "シリコンウェーハ", tone: "substrate" },
          ],
        },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "フォトリソグラフィは、加工する場所を決める工程",
      lead: "リソグラフィの出力は、基本的にはウェーハ上にできたレジストのパターンです。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "INPUT", title: "下地膜と設計パターン", body: "ウェーハ上の薄膜、感光性レジスト、層ごとのマスクまたはレチクルを準備します。" },
            { label: "PROCESS", title: "塗布・露光・現像", body: "レジストを均一に塗り、光で化学状態を変え、必要な部分だけを残します。" },
            { label: "OUTPUT", title: "レジストの開口", body: "次のエッチングやイオン注入で処理する場所が見える状態になります。" },
          ],
        },
        {
          type: "note",
          title: "露光だけがリソグラフィではない",
          body: "露光装置は中心的な装置ですが、工程としては表面準備、レジスト塗布、加熱、位置合わせ、露光、露光後ベーク、現像、検査・計測までを連続して考えます。",
        },
      ],
      paragraphs: [
        "ASMLは、リソグラフィ装置をマスクの情報を光へ載せ、投影光学系で縮小・集光して感光性のウェーハへ転写する投影システムとして説明しています。東京エレクトロンは、レジストの均一塗布、露光装置による転写、現像による選択除去をリソグラフィの基本として説明しています。",
        "現像後のレジストは、次工程で使う一時的な型です。薄膜そのものへ形を移すにはエッチングなどが続き、役目を終えたレジストは除去されます。",
      ],
    },
    {
      id: "flow",
      heading: "塗布から現像・検査までの流れ",
      lead: "代表的な流れを7段階に分けます。実際の順序や加熱処理はレジストと製品によって変わります。",
      blocks: [
        {
          type: "process-flow",
          title: "フォトリソグラフィ工程の代表フロー",
          description: "コータ・デベロッパと露光装置が連結され、ウェーハが装置間を移動する量産構成もあります。",
          stages: [
            { label: "01", title: "表面準備", body: "洗浄や密着性の調整を行い、レジストを塗れる表面へ" },
            { label: "02", title: "塗布", body: "ウェーハを回転させるなどしてレジストを均一化" },
            { label: "03", title: "塗布後ベーク", body: "溶剤を減らし、膜を安定させる" },
            { label: "04", title: "位置合わせ・露光", body: "下層へ合わせてマスクパターンを投影" },
            { label: "05", title: "露光後ベーク", body: "レジスト内の化学反応を進める" },
            { label: "06", title: "現像", body: "溶けやすさの差を使い、開口を形成" },
          ],
          cycle: {
            title: "現像後に確認し、次工程へ送る",
            items: ["CD測定", "重ね合わせ測定", "焦点確認", "欠陥検査", "エッチングなどへ"],
            note: "異常が見つかった場合の扱いは製品と工程設計によって異なります。測定データは露光条件や前後工程の調整にも使われます。",
          },
        },
      ],
      paragraphs: [
        "塗布では、ウェーハ面内でレジスト膜厚がそろうことが重要です。露光では、マスクとウェーハを正しい位置へ合わせ、狙った焦点と露光量でパターンを転写します。現像では、レジストの溶けやすさの差を使ってパターンを現します。",
        "工程全体は温度、時間、膜厚、露光量、焦点、現像状態など、多数の条件の組み合わせで決まります。初心者はまず、各処理が『均一な感光膜を作る』『光で情報を入れる』『溶解差で形を出す』のどれに当たるかを押さえます。",
      ],
    },
    {
      id: "exposure-mechanism",
      heading: "露光装置は、マスクのパターンを縮小投影する",
      lead: "現在の代表的な半導体露光装置は、写真の引き伸ばし機を極端に高精度化したような投影システムとして理解できます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "構成要素",
          rightLabel: "役割",
          rows: [
            { left: "光源", right: "レジストへ化学変化を起こすための光を作る。方式によりi線、KrF、ArF、EUVなどを使用" },
            { left: "マスク・レチクル", right: "一つの層で転写したい回路パターンの情報を持つ" },
            { left: "投影光学系", right: "マスクを通った光を縮小し、ウェーハ上へ焦点を合わせる。EUVでは反射光学系を使う" },
            { left: "レチクルステージ", right: "マスクを高精度に保持・移動する" },
            { left: "ウェーハステージ", right: "露光する位置へウェーハを動かし、層ごとの位置を合わせる" },
            { left: "計測・制御", right: "位置、焦点、露光量、装置状態を測り、誤差を補正する" },
          ],
        },
      ],
      paragraphs: [
        "ニコンは、半導体露光装置がフォトマスクとウェーハを位置合わせし、マスク上の回路パターンを投影レンズで縮小してウェーハへ転写すると説明しています。露光領域を順番に移動し、ウェーハ上へ同じチップパターンを並べます。",
        "層ごとに異なるマスクを使うため、前の層へ次の層を正確に重ねる必要があります。微細な線を描けても位置がずれれば回路としてつながらないため、解像度と重ね合わせは別の重要指標です。",
      ],
    },
    {
      id: "resist-types",
      heading: "ポジ型とネガ型は、現像で残る場所が逆",
      lead: "光が当たった部分を除去するか、残すかで理解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "レジスト",
          rightLabel: "露光後の変化と現像結果",
          rows: [
            { left: "ポジ型", right: "露光した部分が現像液へ溶けやすくなり、その部分が取り除かれる" },
            { left: "ネガ型", right: "露光した部分が現像液へ溶けにくくなり、未露光部分が取り除かれる" },
          ],
        },
        {
          type: "note",
          title: "『光が当たると消える』だけでは説明しきれない",
          body: "レジストの化学反応は材料系によって異なり、露光後ベークを使う化学増幅型などがあります。本記事では、現像後にどちらが残るかという結果へ単純化しています。",
        },
      ],
      paragraphs: [
        "東京エレクトロンの工程解説では、ポジ型は露光部分が現像液へ溶け、ネガ型は未露光部分が溶けると説明されています。どちらを使うかは、光源、解像度、感度、パターン、後工程への耐性などを含めて決まります。",
      ],
    },
    {
      id: "resolution",
      heading: "微細化は、波長・NA・プロセス条件で決まる",
      lead: "短い波長だけで解像度が決まるわけではありません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "λ / WAVELENGTH", title: "波長を短くする", body: "一般に、短い波長ほど小さなパターンを形成しやすくなります。" },
            { label: "NA", title: "開口数を大きくする", body: "光学系が光を取り込む能力を高めることで、より細かな像を作ります。" },
            { label: "k1", title: "プロセス全体を最適化", body: "照明、マスク、レジスト、計算補正などを組み合わせ、印刷可能な寸法を小さくします。" },
          ],
        },
        {
          type: "note",
          title: "Rayleighの式：CD = k1 × λ ÷ NA",
          body: "CDは印刷できる最小寸法の目安、λは露光波長、NAは開口数、k1はプロセスに関わる係数です。短波長化、NA向上、k1低減を組み合わせて微細化します。式は入口であり、量産では焦点深度、欠陥、ばらつき、生産性も同時に考えます。",
        },
      ],
      paragraphs: [
        "ASMLはRayleighの式を使い、より小さなCDには短い波長、大きなNA、物理限界へ近づけたk1の組み合わせが必要だと説明しています。つまり、露光装置だけでなく、マスク、レジスト、計算技術、計測、前後工程を含む統合が必要です。",
      ],
    },
    {
      id: "wavelengths",
      heading: "i線・KrF・ArF・EUVは、使う光の波長が違う",
      lead: "最先端だから常にEUVを使うのではなく、層と製品に合う方式を選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表方式",
          rightLabel: "波長と主な特徴",
          rows: [
            { left: "i線", right: "365nm。比較的大きなパターンを扱う製品・工程などで使用" },
            { left: "KrF", right: "248nmのDUV。i線より短波長で、成熟した量産工程を含む幅広い用途で使用" },
            { left: "ArF", right: "193nmのDUV。ドライ方式と液浸方式があり、より微細なパターンへ対応" },
            { left: "EUV", right: "13.5nm。最も微細なクリティカル層で使われる。DUVとは光源・光学系・環境が大きく異なる" },
          ],
        },
        {
          type: "note",
          title: "プロセスノード名と露光波長は一対一ではない",
          body: "同じチップでも層によって必要な寸法が異なり、複数の露光方式を使い分けます。ArF液浸と複数回のパターニングを組み合わせる場合もあり、製品名やノード名だけから全層の方式は決められません。",
        },
      ],
      paragraphs: [
        "ASMLの公式解説では、i線365nm、KrF 248nm、ArF 193nm、EUV 13.5nmという短波長化の流れが示されています。ニコンは、アナログやパワーなど比較的大きなパターン幅の用途でi線・KrF、微細なCPUやメモリ向けにArFが使われる例を説明しています。",
      ],
    },
    {
      id: "control-items",
      heading: "重要な管理項目は、CD・重ね合わせ・焦点・欠陥",
      lead: "細く描くだけでなく、正しい場所へ、正しい形で、安定して描く必要があります。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "CD", title: "線幅・寸法", body: "現像後または加工後のパターン寸法が目標へ入っているか。露光量、焦点、レジスト工程などの影響を受けます。" },
            { label: "OVERLAY", title: "重ね合わせ", body: "今回の層が下の層へ正しく重なっているか。層間の接続と形状に関わります。" },
            { label: "FOCUS", title: "焦点", body: "ウェーハ面内で像が適切に結ばれているか。表面高さ、装置、工程変動などを補正します。" },
            { label: "DEFECT", title: "欠陥", body: "塗布むら、粒子、現像異常、パターン倒れ、つながり・断線などの異常を検出します。" },
          ],
        },
      ],
      paragraphs: [
        "ASMLは、重ね合わせを層同士の位置合わせ精度、焦点を像の鮮明さとして説明し、光学計測や電子線検査、装置内センサーのデータを工程へ戻すとしています。ニコンも、解像度、重ね合わせ精度、スループットを露光装置の主要技術として挙げています。",
        "量産では一枚だけ良いパターンができても十分ではありません。ウェーハ面内、ウェーハ間、時間変化を含めて安定させ、生産性と品質を両立させます。",
      ],
    },
    {
      id: "equipment-roles",
      heading: "コータ・デベロッパ、露光装置、計測装置が工程を分担する",
      lead: "一つの巨大な装置が、塗布から検査までをすべて行うわけではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置・領域",
          rightLabel: "主な役割",
          rows: [
            { left: "コータ・デベロッパ", right: "表面処理、レジスト塗布、各種ベーク、現像などを行う" },
            { left: "露光装置", right: "マスクとウェーハを位置合わせし、パターンを縮小投影する" },
            { left: "計測装置", right: "CD、膜厚、重ね合わせ、焦点に関わるパターン情報などを測る" },
            { left: "検査装置", right: "粒子、塗布異常、パターン欠陥、マスク欠陥などを見つける" },
            { left: "材料", right: "レジスト、現像液、下層膜、洗浄薬液、マスク材料などを供給する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "リソグラフィが前後工程のどこにあるか確認する" },
            { label: "半導体業界地図", href: "/industry-map", description: "露光、塗布・現像、計測・検査、材料を担う企業の位置を見る" },
            { label: "半導体企業一覧", href: "/companies", description: "ASML、東京エレクトロン、ニコンなどを企業別に調べる" },
            { label: "装置エンジニアへのルート", href: "/guides/equipment-engineer-route", description: "装置・設備経験と半導体製造装置職の接点を整理する" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンはコータ・デベロッパ、ASMLとニコンは露光装置、KLAなどは計測・検査領域で製品を提供しています。実際のリソグラフィは装置メーカー、材料メーカー、デバイスメーカーが条件をすり合わせて成立します。",
        "関わる職種も、プロセス開発、装置開発、光学、精密機械、制御、ソフトウェア、材料、計測、フィールドサービスなどに分かれます。工程を理解すると、同じ『リソグラフィ関連』でも仕事内容の違いを見分けやすくなります。",
      ],
    },
    {
      id: "faq",
      heading: "フォトリソグラフィでよくある質問",
      lead: "工程の範囲と用語を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "フォトリソグラフィとは何ですか？", answer: "感光性のフォトレジストをウェーハへ塗り、マスクのパターンを光で転写し、現像してレジストのパターンを作る工程です。次のエッチングやイオン注入で加工する場所を決めます。" },
            { question: "露光するとウェーハが直接削られますか？", answer: "通常の説明では、露光でまず変わるのはフォトレジストの化学状態です。現像後に開口を作り、その後のエッチングなどで下の薄膜を加工します。" },
            { question: "ステッパーとスキャナーの違いは？", answer: "どちらもマスクパターンをウェーハへ投影する露光装置です。一般にステッパーは露光領域を静止させて順番に投影し、スキャナーはマスクとウェーハを同期走査して露光します。装置名や方式の詳細はメーカー仕様を確認してください。" },
            { question: "ポジ型レジストとネガ型レジストの違いは？", answer: "ポジ型は露光した部分が現像で除去され、ネガ型は露光した部分が残ります。実際の材料選定では、解像度、感度、後工程への耐性なども考慮します。" },
            { question: "EUVを使えばすべての層を作れますか？", answer: "同じチップでも層ごとに必要な寸法とコストが異なるため、EUV、ArF、KrFなどを使い分けます。EUVだけで全層を露光するとは限りません。" },
            { question: "リソグラフィで重要な管理項目は？", answer: "代表的にはCD、重ね合わせ、焦点、レジスト膜厚、露光量、欠陥、スループットなどです。どの項目を重視するかは製品と層によって変わります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜光で描く工程ではなく、次の加工場所を作る工程",
      lead: "フォトリソグラフィは、レジスト、露光、現像、計測を組み合わせたパターン形成工程です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FLOW", title: "塗る・光を当てる・現す", body: "均一なレジストへ情報を転写し、現像で開口を作る" },
            { label: "ACCURACY", title: "細さと位置を両立する", body: "CD、重ね合わせ、焦点、欠陥を測り、工程へ戻す" },
            { label: "TRANSFER", title: "次工程で形を移す", body: "現像後のレジストを型として、エッチングなどへ進む" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、リソグラフィで作った開口を使い、下の膜をどのように加工するかを理解できるよう、成膜またはエッチングの仕組みを断面図で整理します。",
      ],
    },
  ],
  todayQuest: "身近な模様の型を一つ思い浮かべ、『型を作る工程』と『材料へ形を移す工程』を分けて説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["asml", "tokyo-electron", "nikon", "canon", "kla", "lasertec"],
};
