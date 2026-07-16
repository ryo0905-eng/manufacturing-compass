import type { GuideArticle } from "@/content/guides/types";

export const semiconductorPhotoresistManufacturersGuide: GuideArticle = {
  slug: "semiconductor-photoresist-manufacturers",
  title: "半導体フォトレジストメーカーとは？JSR・東京応化工業などを初心者向けに図解",
  description:
    "半導体フォトレジストは、露光で溶解性が変わり、微細パターンを作る感光性材料です。g線・i線・KrF・ArF・EUV、ポジ・ネガ、主要メーカー、比較軸と仕事内容を図解します。",
  targetQuery: "半導体 フォトレジスト メーカー",
  searchIntent:
    "半導体用フォトレジストの役割と種類、g線・i線・KrF・ArF・EUVの違い、JSR・東京応化工業・信越化学工業・富士フイルムなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "JSR、東京応化工業、信越化学工業、富士フイルムの公式製品・技術情報をもとに、g線・i線・KrF・ArF・EUV、ポジ型・ネガ型、化学増幅型・金属酸化物系、下層材・現像液などの周辺材料と企業領域を整理しました。市場シェアや企業の優劣ではなく、露光・パターン・エッチング条件をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のフォトリソグラフィ記事で塗布・露光・現像の原理を整理したうえで、感光材料と関連薬液を供給する企業を独立して調べる記事が必要だと判断",
    "JSRと東京応化工業の公式情報で、g線・i線・KrF・ArF・EUVレジスト、ポジ・ネガ、下層・多層材料、現像・リンスなどの製品領域を確認",
    "信越化学工業と富士フイルムの公式情報で、i線からEUV、ArFドライ・液浸、ネガ型現像、厚膜・電子線などの製品領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "About Our Electronic Materials Business",
      url: "https://www.jsr.co.jp/jsr_e/products/em/biz/",
      publisher: "JSR Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Manufacturing Field",
      url: "https://www.tok.co.jp/eng/products/semiconductor-pre",
      publisher: "TOKYO OHKA KOGYO CO., LTD.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Photoresist",
      url: "https://www.shinetsu.co.jp/en/products/electronics-materials/photoresist/",
      publisher: "Shin-Etsu Chemical Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Photoresists",
      url: "https://www.fujifilm.com/us/en/business/semiconductor-materials/photoresists",
      publisher: "FUJIFILM Electronic Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Photoresist Ancillaries",
      url: "https://www.fujifilm.com/kr/en/business/semiconductor-materials/photoresist-ancillaries",
      publisher: "FUJIFILM Electronic Materials",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "フォトレジストメーカーを調べても、g線・i線・KrF・ArF・EUVが単なる世代順に見え、ポジ・ネガ、化学増幅、感度・解像度・欠陥などをどう比較すればよいか分かりにくくありませんか。",
    conclusion:
      "フォトレジストは、基材樹脂、光反応成分、溶剤、添加成分などを調整し、塗布・加熱・露光・現像で必要なパターンを作る材料です。企業比較では、光源、パターン、膜厚、現像方式、解像度・感度・粗さ、エッチング耐性、欠陥・純度、周辺材料、認定・供給をそろえます。",
    learnings:
      "フォトレジストの役割・構成、ポジ・ネガ、g線・i線・KrF・ArF・EUV、化学増幅型・金属酸化物系、塗布から除去まで、性能のトレードオフ、主要メーカー、比較軸、供給認定、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "フォトレジストメーカーを比べるときは、対応光源だけでなく、『どの膜厚・形状を、どの露光量・現像・エッチング条件で、低欠陥に作る材料か』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜液体材料を塗り、光で溶解性を変えて加工マスクにする",
      description:
        "ポジ型を使う代表的な流れを単純化しています。下層材、トップコート、加熱、現像、リンス、除去の条件は材料・装置・工程で異なります。",
      stages: [
        { label: "01 / PREPARE", title: "表面を整える", body: "ウェーハ表面の清浄度、濡れ性、密着性を整え、必要に応じて下層材を形成する" },
        { label: "02 / COAT", title: "薄く均一に塗る", body: "レジストを滴下して回転塗布し、エッジや裏面の余分な材料を除く" },
        { label: "03 / BAKE", title: "塗布膜を整える", body: "加熱で溶剤量と膜状態を調整し、露光に適した均一な膜を作る" },
        { label: "04 / EXPOSE", title: "光・電子で反応させる", body: "マスクパターンを投影し、露光部の化学状態と現像液への溶けやすさを変える" },
        { label: "05 / DEVELOP", title: "パターンを現像", body: "ポジ・ネガと材料系に合う現像液で不要部分を除き、リンス・乾燥する" },
        { label: "06 / TRANSFER", title: "下地へ形を移す", body: "エッチング・注入などでレジスト形状を下地へ転写し、役割後にレジストを除去する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "材料の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "基材樹脂・分子骨格", right: "膜を形成し、現像液への溶解、機械強度、耐熱、下地への密着、エッチング耐性を決める" },
        { left: "光反応成分・感光基", right: "特定波長・電子線を受け、分解、架橋、酸発生などの化学変化を起こす" },
        { left: "酸発生剤・触媒系", right: "化学増幅型で露光により酸などを生じ、露光後加熱中の反応を進めて感度を高める" },
        { left: "溶剤", right: "粘度と塗布性を整え、回転塗布と加熱で所定膜厚・膜状態を作る" },
        { left: "添加成分", right: "溶解、反応拡散、界面、欠陥、保存安定性などを用途へ合わせる" },
        { left: "下層・中間・上層材料", right: "反射、平坦化、エッチング選択、液浸界面、多層パターン転写を補助する" },
        { left: "現像・リンス・希釈・除去材", right: "塗布前後、エッジ、現像、乾燥、再処理、工程後の膜除去を支える" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "フォトレジストメーカーとは、光でパターンへ変わる高純度材料を作る企業",
      lead: "レジストは写真材料に似た原理を、半導体の微細加工へ適合させた液体・膜材料です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "IMAGE", title: "光情報を受ける", body: "露光された場所の化学状態を変え、マスクの像を材料内へ記録します。" },
            { label: "DEVELOP", title: "溶解差を作る", body: "露光部と未露光部の現像速度を変え、ポジまたはネガのパターンを残します。" },
            { label: "PROTECT", title: "加工マスクになる", body: "エッチングや注入の間、残した部分が下地を保護できる強度を持たせます。" },
            { label: "CONTROL", title: "液体品質を再現する", body: "組成、粘度、粒子、金属不純物、ろ過、容器、保存、ロット変動を管理します。" },
          ],
        },
        {
          type: "note",
          title: "フォトリソグラフィ記事と検索意図を分ける",
          body: "塗布・露光・現像の原理と断面変化はフォトリソグラフィ記事、露光装置・光学系は露光装置メーカー記事で説明します。本記事はレジスト材料、企業、比較・認定方法を扱います。",
        },
      ],
      paragraphs: [
        "信越化学工業はフォトレジストを、フォトマスクの回路パターンを光化学反応でシリコンウェーハへ転写する感光性樹脂と説明しています。東京応化工業も塗布、露光、現像、加工、除去を繰り返す工程の中核材料として示しています。",
        "露光後にきれいな像が見えても、下地への密着、エッチング耐性、除去性、欠陥、後工程への汚染が満たせなければ量産材料にはなりません。レジスト工程とパターン転写を一続きで評価します。",
      ],
    },
    {
      id: "positive-negative",
      heading: "ポジ型とネガ型は、露光部分を除くか残すかが違う",
      lead: "名前はパターンの残り方を表し、性能の上下を表しません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "露光・現像後の考え方",
          rows: [
            { left: "ポジ型", right: "露光部が現像液へ溶けやすくなり、主に露光した場所を除去する。マスク開口に対応したレジスト開口を作る" },
            { left: "ネガ型", right: "露光部が架橋などで溶けにくくなり、主に露光した場所を残す。厚膜・特定形状・ネガ型現像など用途は多様" },
            { left: "ポジ型現像", right: "水系アルカリなど材料に合う現像液で、溶解性が高い領域を除く" },
            { left: "ネガ型現像", right: "有機溶剤系など材料・プロセスに合う現像系で、露光による溶解性差を利用する" },
            { left: "トーン反転・多重パターニング", right: "目標形状、マスク、後続材料を組み合わせ、露光像と最終パターンの関係を設計する" },
          ],
        },
        {
          type: "note",
          title: "ポジ型が先端、ネガ型が旧式という区分ではない",
          body: "光源、膜厚、ライン・ホール・柱などの形状、現像、下地、エッチングで適するトーンが変わります。同じ光源でもポジ・ネガの複数方式があります。",
        },
      ],
      paragraphs: [
        "JSRは公式解説で、露光部が除去されるポジ型と、露光部が架橋して残るネガ型を説明しています。富士フイルムはArFでドライ・液浸のポジ型に加え、ネガ型現像材料を公開しています。",
        "比較では『ポジかネガか』だけでなく、どの現像液、どの加熱、どの下層、どの最終形状・エッチングを使うかをそろえます。",
      ],
    },
    {
      id: "exposure-generations",
      heading: "g線・i線・KrF・ArF・EUVは、光の波長と材料設計が違う",
      lead: "短波長化だけでなく、用途・装置・膜厚・コストに合わせて複数世代が併用されます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "露光方式",
          rightLabel: "波長・材料・用途の見方",
          rows: [
            { left: "g線", right: "水銀ランプの436nm付近を利用。比較的大きなパターン、成熟工程、厚膜・特殊用途などで使われる" },
            { left: "i線", right: "水銀ランプの365nm付近を利用。成熟世代のIC、パワー、センサー、パッケージなど幅広い用途" },
            { left: "KrF", right: "248nmのエキシマレーザーを利用。化学増幅型レジストなどで微細ICから成熟工程まで使われる" },
            { left: "ArFドライ", right: "193nmのArFレーザーを気体・光学系で投影し、さらに微細なパターンを形成する" },
            { left: "ArF液浸", right: "投影レンズとウェーハ間へ液体を入れて実効NAを高め、微細化・多重パターニングへ使う" },
            { left: "EUV", right: "13.5nmの極端紫外線を反射光学系で使う。薄膜レジスト、高感度・高解像度・低粗さ・低欠陥の両立が課題" },
            { left: "電子線", right: "光ではなく電子ビームで描画する。フォトマスク、研究開発、直接描画などで専用レジストを使う" },
          ],
        },
      ],
      paragraphs: [
        "JSRはg線・i線・KrF・ArF・EUV、東京応化工業はg／i線・KrF・ArF・EUV、信越化学工業はi線からEUVまでの対応を公式に示しています。富士フイルムも広帯域、g線、i線、KrF、ArF、電子線、EUVの製品領域を案内しています。",
        "新しい光源が古い世代をすべて置き換えるわけではありません。必要寸法、ウェーハ処理回数、装置保有、膜厚、デバイス用途、コストで複数のリソグラフィ世代を使い分けます。",
      ],
    },
    {
      id: "material-platforms",
      heading: "化学増幅型・金属酸化物系・多層材料は、反応と転写方法が違う",
      lead: "EUVを含む先端材料では、感度とパターン品質の両立が重要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "材料・構造",
          rightLabel: "役割と確認すること",
          rows: [
            { left: "化学増幅型レジスト（CAR）", right: "露光で生じた酸などを露光後加熱で触媒的に使い、反応を増幅して感度を得る。拡散と粗さ・寸法を制御する" },
            { left: "金属酸化物系レジスト（MOR）", right: "金属酸化物を含む分子・クラスター系などでEUV吸収とエッチング耐性を狙う。材料・現像・汚染管理を一体で評価する" },
            { left: "非化学増幅・従来系", right: "感光成分の変化を直接溶解差へつなぐ材料など。光源、膜厚、用途に応じて使う" },
            { left: "下層・ハードマスク", right: "反射制御、平坦化、薄いレジスト像のエッチング転写、積層膜間の選択性を補う" },
            { left: "トップコート・界面材料", right: "液浸界面、成分溶出、表面状態、現像・欠陥などを制御する" },
            { left: "厚膜・感光性絶縁材料", right: "バンプ、再配線、保護膜、パッケージなどで厚いパターン・絶縁機能を作る" },
          ],
        },
      ],
      paragraphs: [
        "JSRはEUV向けに化学増幅型と金属酸化物系、さらにArF・KrF・i線・g線と多層材料を公開しています。信越化学工業も各光源向けレジストとスピン塗布型の中間・下層ハードマスク材料を案内しています。",
        "材料プラットフォームは単独で評価せず、露光装置、加熱、現像、下層、エッチング、計測・検査へ接続します。良いレジスト像が良い下地パターンになるかを確認します。",
      ],
    },
    {
      id: "performance",
      heading: "解像度・感度・粗さ・欠陥・エッチング耐性にはトレードオフがある",
      lead: "一つのカタログ値ではなく、工程窓と最終パターンで判断します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "RESOLUTION", title: "解像度・形状", body: "分離できるライン・スペース、ホール、柱と、側壁・倒れ・残膜を確認します。" },
            { label: "SENSITIVITY", title: "感度", body: "必要露光量を下げて処理能力を上げつつ、反応揺らぎと工程窓を管理します。" },
            { label: "ROUGHNESS", title: "線幅・エッジ粗さ", body: "パターン境界の揺らぎと寸法分布を、露光・反応・現像・計測で管理します。" },
            { label: "DEFECT", title: "欠陥", body: "残渣、ブリッジ、欠け、粒子、塗布むら、気泡、現像・乾燥由来の異常を減らします。" },
            { label: "WINDOW", title: "工程窓", body: "露光量、焦点、膜厚、加熱、現像時間が変動しても規格内パターンを作れる範囲を見ます。" },
            { label: "TRANSFER", title: "転写・除去", body: "エッチング中に形を保ち、役割後は下地を傷めず残渣を抑えて除去できるか確認します。" },
          ],
        },
        {
          type: "note",
          title: "最小寸法や感度を、そのまま企業順位にしない",
          body: "光源、NA、マスク、パターン、膜厚、下地、加熱、現像、エッチング、計測が違えば比較できません。同じテスト構造と工程条件で評価します。",
        },
      ],
      paragraphs: [
        "先端リソグラフィでは、解像度を上げながら露光量を下げると、分子・光子反応の統計的な揺らぎや欠陥が問題になり得ます。感度、粗さ、欠陥を同時に評価します。",
        "膜厚を薄くすると像の倒れを抑えやすい一方、下地への転写耐性が不足することがあります。下層・ハードマスクと組み合わせ、最終エッチング後の寸法・欠陥まで確認します。",
      ],
    },
    {
      id: "purity-supply",
      heading: "純度・ろ過・容器・塗布装置適合・供給変更が、量産品質を左右する",
      lead: "微量成分と小さなロット差も、多数ウェーハの欠陥へつながり得ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "量産管理項目",
          rightLabel: "確認すること",
          rows: [
            { left: "原料・組成", right: "樹脂、感光成分、溶剤、添加成分の純度、分子量・濃度、反応性、ロット変動を管理する" },
            { left: "粒子・金属不純物", right: "原料、設備、フィルター、配管、容器、充填、輸送から入る微量汚染を測定・低減する" },
            { left: "ろ過・充填", right: "材料に合うフィルターと流量・圧力で異物を除き、気泡・析出・成分吸着を抑えて容器へ入れる" },
            { left: "保存・輸送", right: "温度、光、時間、振動、容器姿勢、開封後管理を規定し、粘度・反応性・粒子の変化を抑える" },
            { left: "コータ適合", right: "ポンプ、配管、ノズル、フィルター、吐出、回転、排気、エッジ処理と材料の相互作用を確認する" },
            { left: "変更・認定", right: "原料、工程、設備、工場、容器、検査法の変更を通知・評価し、顧客工程で再認定する" },
          ],
        },
      ],
      paragraphs: [
        "東京応化工業は微細加工と高純度化を中核技術として示し、半導体用レジストと現像液・リンス・希釈・除去材料を展開しています。材料単品だけでなく隣接工程の組み合わせで管理します。",
        "レジストは顧客の露光・塗布現像・エッチング条件へ長期間かけて認定されます。配合や工場を変更する場合も、材料分析だけでなくパターン・欠陥・電気特性への影響を確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "主要メーカーは、対応光源・材料プラットフォーム・周辺材料が異なる",
      lead: "代表企業を順位ではなく、公式に確認できる製品領域へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な製品領域",
          rows: [
            { left: "JSR", right: "g線・i線・KrF・ArF・EUVのフォトレジスト、EUVの化学増幅型・金属酸化物系、有機・無機多層材料、先端パッケージ材料など" },
            { left: "東京応化工業（TOK）", right: "g／i線・KrF・ArF・EUVレジスト、ウェット・深掘り加工向け、現像・リンス・希釈・除去、密着・多層・膜形成材料など" },
            { left: "信越化学工業", right: "i線・KrF・ArF・EUVレジスト、スピン塗布型の中間・下層ハードマスクなど、半導体材料群" },
            { left: "富士フイルム", right: "広帯域・g線・i線・KrF・ArFドライ／液浸・電子線・EUV、ポジ・ネガ型、現像・リンス・希釈・除去などの周辺材料" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、網羅的な市場順位ではない",
          body: "レジスト企業は光源、トーン、膜厚、下層・現像、用途、生産地域、技術支援が異なります。企業名だけで優劣を決めず、同じリソグラフィ工程の製品群を確認してください。",
        },
      ],
      paragraphs: [
        "JSRと東京応化工業は幅広い光源と周辺材料、信越化学工業はレジスト・ハードマスクを含む半導体材料群、富士フイルムは画像・有機材料技術を生かした光源・現像系の広い製品群として企業研究できます。",
        "公式サイトで光源名が同じでも、ライン・ホール、ドライ・液浸、ポジ・ネガ、膜厚、下層、用途で製品が分かれます。企業単位ではなく材料シリーズと工程を対応させます。",
      ],
    },
    {
      id: "comparison",
      heading: "フォトレジストメーカーを比較する8つの軸",
      lead: "同じ露光装置・マスク・下地・パターン・現像・転写条件へそろえます。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "01", title: "光源・用途", body: "g／i線、KrF、ArF、EUV、電子線とロジック、メモリ、パワー、パッケージ" },
            { label: "02", title: "材料・トーン", body: "ポジ・ネガ、化学増幅型、金属酸化物系、ドライ・液浸、現像方式" },
            { label: "03", title: "膜・パターン", body: "膜厚、ライン、スペース、ホール、柱、段差、密集・孤立、アスペクト比" },
            { label: "04", title: "像性能", body: "解像度、感度、線幅・エッジ粗さ、寸法均一性、露光・焦点余裕" },
            { label: "05", title: "欠陥・転写", body: "残渣、ブリッジ、倒れ、粒子、密着、エッチング耐性、除去性" },
            { label: "06", title: "純度・液品質", body: "金属不純物、粒子、粘度、組成、ろ過、容器、保存、ロット安定性" },
            { label: "07", title: "周辺材料・装置", body: "下層、トップコート、現像、リンス、希釈、除去とコータ・露光・エッチング適合" },
            { label: "08", title: "認定・供給", body: "共同評価、分析・欠陥支援、変更管理、生産地域、BCP、現地対応" },
          ],
        },
      ],
      paragraphs: [
        "最小寸法、必要露光量、粗さ、欠陥数などは、露光機・マスク・パターン・膜厚・現像・計測が違えば比較できません。共通の評価構造と工程条件で確認します。",
        "材料価格だけでなく、露光処理能力、欠陥、再処理、エッチング工程数、装置稼働、薬液使用量、認定期間、供給継続を含む総工程で比較します。",
      ],
    },
    {
      id: "jobs",
      heading: "フォトレジストメーカーの主な職種",
      lead: "分子設計から顧客の露光・現像・エッチングまでをつなぎます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種・領域",
          rightLabel: "主な仕事",
          rows: [
            { left: "分子・材料研究", right: "樹脂、感光成分、酸発生剤、添加成分、金属酸化物などの構造と反応を設計する" },
            { left: "配合・プロセス開発", right: "溶解、混合、ろ過、塗布、加熱、露光、現像、下層、エッチングを組み合わせて材料を最適化する" },
            { left: "リソグラフィ評価", right: "露光・焦点余裕、寸法、粗さ、形状、欠陥、重ね合わせ、転写後パターンを評価する" },
            { left: "分析・計測", right: "組成、分子量、純度、粒子、金属不純物、膜、反応生成物、表面・欠陥を分析する" },
            { left: "生産技術・設備", right: "高純度の合成、配合、ろ過、充填、洗浄、自動化設備と工程能力・稼働を改善する" },
            { left: "品質保証", right: "原料・製品規格、ロット、変更、保存、輸送、顧客認定、逸脱、原因・再発防止を管理する" },
            { left: "アプリケーション", right: "顧客のコータ・露光・現像・エッチング条件で材料を評価し、工程窓・欠陥・相関を支援する" },
            { left: "供給・環境安全", right: "原料、工場・容器、在庫、輸送、化学品法規、作業安全、排気・廃液、環境対応を管理する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像でパターンを作る原理を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "g／i線・DUV・EUV装置と周辺装置を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "レジスト像を下地へ転写する加工原理を見る" },
          ],
        },
      ],
      paragraphs: [
        "高分子、有機・無機化学、分析、塗布、露光、現像、洗浄、品質、生産技術、化学設備、顧客技術支援の経験はフォトレジスト企業へ接点を整理しやすい領域です。",
        "経験を説明するときは、材料組成、純度、粒子、膜厚、寸法、粗さ、欠陥、工程窓、ろ過・充填、ロット変動、顧客認定のどこへ貢献したかを担当工程と一緒に整理します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体フォトレジストメーカーでよくある質問",
      lead: "材料、光源、ポジ・ネガ、露光装置との違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体フォトレジストとは何ですか？", answer: "ウェーハ上へ薄く塗り、光や電子線で化学状態・現像液への溶解性を変え、回路パターンを形成する感光性材料です。後続のエッチングや注入で加工場所を決めるマスクになります。" },
            { question: "主なフォトレジストメーカーは？", answer: "この記事ではJSR、東京応化工業、信越化学工業、富士フイルムを代表例として紹介しています。対応光源・材料領域別の例であり、網羅的な市場順位ではありません。" },
            { question: "ポジ型とネガ型の違いは？", answer: "ポジ型は主に露光部が現像で除かれ、ネガ型は主に露光部が架橋などで残ります。性能順位ではなく、目標形状、光源、現像、下地、転写工程で選びます。" },
            { question: "KrFとArFの違いは？", answer: "KrFは248nm、ArFは193nmのエキシマレーザーを使います。波長だけでなく、材料骨格、光学系、ドライ・液浸、膜厚、現像・下層、対象パターンが異なります。" },
            { question: "EUVレジストは何が難しいですか？", answer: "薄い膜でEUVを吸収し、少ない露光量、高い解像度、低い線幅・エッジ粗さ、少ない確率的欠陥、十分な転写耐性を同時に満たす必要があります。" },
            { question: "フォトレジストメーカーと露光装置メーカーの違いは？", answer: "レジストメーカーは光で反応する材料と周辺薬液を開発・供給します。露光装置メーカーは光源、投影光学、ステージ、位置合わせなどでマスク像をレジストへ照射します。" },
            { question: "新しい光源向け材料が常に優れますか？", answer: "用途が違うため一概には言えません。g線・i線・KrFも、成熟工程、パワー、センサー、アナログ、パッケージなどで使われます。必要寸法・膜厚・装置・コストへ合う材料を選びます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜光源・材料・パターン・欠陥・転写・供給をそろえてメーカーを見る",
      lead: "フォトレジストは、露光装置の光を量産可能な加工パターンへ変える材料です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "EXPOSURE", title: "光源・用途を決める", body: "g／i線、KrF、ArF、EUV、電子線とデバイス・工程を確認する" },
            { label: "CHEMISTRY", title: "材料系を合わせる", body: "ポジ・ネガ、化学増幅・金属酸化物、膜厚、現像、下層を選ぶ" },
            { label: "PATTERN", title: "像と転写を評価する", body: "解像度、感度、粗さ、工程窓、欠陥、エッチング後形状を見る" },
            { label: "PRODUCTION", title: "量産供給まで見る", body: "純度、ろ過、容器、装置適合、認定、変更、生産地域、支援を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "レジストが塗布・露光・現像で変化する仕組みを見る" },
            { label: "塗布現像装置メーカー", href: "/guides/semiconductor-coater-developer-manufacturers", description: "レジストを塗布・加熱し、露光後に現像する装置を見る" },
            { label: "CD-SEM・電子線計測装置メーカー", href: "/guides/semiconductor-cd-sem-manufacturers", description: "レジストパターンのCD・粗さ・形状を測る装置を見る" },
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "露光する回路原版・ブランクス・主要企業を見る" },
            { label: "フォトマスク描画装置メーカー", href: "/guides/semiconductor-photomask-writer-manufacturers", description: "電子線・レーザーでマスク用レジストへ潜像を描く装置を見る" },
            { label: "マスクブランクスメーカー", href: "/guides/semiconductor-mask-blank-manufacturers", description: "マスク描画用レジストを載せる基板・薄膜材料を見る" },
            { label: "高純度薬液メーカー", href: "/guides/semiconductor-high-purity-chemical-manufacturers", description: "現像・剥離・残渣除去などの液体材料を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "ASML・Nikon・Canonと塗布現像装置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "レジスト像を下地へ転写する装置と主要企業を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "材料が前工程のどこで使われるかを見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "材料・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのレジスト領域を選び、光源、ポジ／ネガ、材料系、膜厚・形状、現像・下層、像・欠陥性能、供給・支援の7項目で整理してください。同じリソグラフィ条件へそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "JSR・東京応化工業・信越化学工業・富士フイルムから1社を選び、公式製品を光源・トーン・材料系・周辺材料・性能・供給の6項目で整理する",
  relatedGuideSlugs: [
    "photolithography-process",
    "semiconductor-coater-developer-manufacturers",
    "semiconductor-cd-sem-manufacturers",
    "semiconductor-photomask-manufacturers",
    "semiconductor-photomask-writer-manufacturers",
    "semiconductor-mask-blank-manufacturers",
    "semiconductor-high-purity-chemical-manufacturers",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-cleaning-process",
    "semiconductor-inspection-metrology",
    "production-engineering-to-semiconductor-process-engineer",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
