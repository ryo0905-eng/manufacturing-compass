import type { GuideArticle } from "@/content/guides/types";

export const semiconductorHighPurityChemicalManufacturersGuide: GuideArticle = {
  slug: "semiconductor-high-purity-chemical-manufacturers",
  title: "半導体用高純度薬液メーカーとは？ステラケミファ・関東化学などを初心者向けに図解",
  description:
    "半導体用高純度薬液は、洗浄・ウェットエッチング・現像・残渣除去などで使う工程材料です。薬液の種類、純度、容器・供給、安全・排液、主要メーカーと比較軸を図解します。",
  targetQuery: "半導体 薬液 メーカー",
  searchIntent:
    "半導体製造で使う高純度薬液の種類と役割、洗浄液・エッチング液・溶剤などの違い、ステラケミファ・関東化学・富士フイルム・BASFなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "ステラケミファ、関東化学、富士フイルム、BASFの公式製品情報をもとに、半導体用高純度薬液を化学分類、工程機能、純度・分析、容器・供給、安全・排液へ整理しました。個別配合や企業の優劣ではなく、除去する材料と守る材料をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "洗浄・ウェットエッチング・CMPの記事で薬液の役割に触れたうえで、高純度薬液、機能性薬液、供給設備、主要企業を独立して調べる記事が必要だと判断",
    "ステラケミファと関東化学の公式情報で、洗浄・エッチング用高純度薬液、機能性薬液、残渣除去、剥離・現像、薬液供給設備の領域を確認",
    "富士フイルムとBASFの公式情報で、酸・アルカリ・溶剤、調合液、洗浄、エッチング、CMP、ウェット成膜などの製品領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "半導体関連｜製品",
      url: "https://www.stella-chemifa.co.jp/products/cat1/",
      publisher: "ステラケミファ株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "電子材料",
      url: "https://www.kanto.co.jp/products/denshi.html",
      publisher: "関東化学株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "High Purity Process Chemicals",
      url: "https://www.fujifilm.com/sg/en/business/semiconductor-materials/high-purity-primary-solvents/high-purity-process-chemicals",
      publisher: "FUJIFILM Electronic Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "CVD Precursors & Chemical Delivery Systems",
      url: "https://www.fujifilm.com/us/en/business/semiconductor-materials/cvd-precursors-chemical-delivery",
      publisher: "FUJIFILM Electronic Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Chemical Solutions for Semiconductors",
      url: "https://electronics-electric.basf.com/global/en/electronics/semiconductors_solutions",
      publisher: "BASF",
      accessedAt: "2026-07-16",
    },
    {
      title: "SELECTIPUR",
      url: "https://electronics-electric.basf.com/global/en/electronics/products/selectipur",
      publisher: "BASF",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "半導体用薬液メーカーを調べても、酸・アルカリ・溶剤の名前と、洗浄液・エッチング液・剥離液などの用途名が混ざり、何を基準に企業を比べればよいか分かりにくくありませんか。",
    conclusion:
      "半導体用高純度薬液は、汚染や不要膜を除去し、表面状態やパターンを作り、次工程へ渡す液体材料です。企業比較では、対象工程、除去・保護する材料、組成・純度、粒子・金属、容器、供給設備、安全、排液、認定・変更管理をそろえます。",
    learnings:
      "高純度薬液と機能性薬液の違い、酸・アルカリ・酸化剤・溶剤・調合液、工程別用途、純度・分析、容器から装置までの供給、安全・排液、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "半導体用薬液メーカーを比べるときは、薬液名だけでなく、『何を除去し、何を残し、処理後の表面をどう次工程へ渡す材料か』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜高純度化した薬液を、汚染させずにウェーハへ届ける",
      description:
        "工場内の代表的な流れを単純化しています。容器、希釈、混合、供給、回収の方式は薬液・装置・工場・法規で異なります。",
      stages: [
        { label: "01 / PURIFY", title: "原料を高純度化", body: "蒸留、精製、ろ過などで金属、粒子、有機物、他成分を用途に合う水準へ低減する" },
        { label: "02 / FORMULATE", title: "濃度・機能を調整", body: "単一薬品または複数成分を管理し、洗浄・加工・剥離などに必要な反応性を作る" },
        { label: "03 / ANALYZE", title: "分析・出荷判定", body: "主成分濃度、微量不純物、粒子、外観などを測り、ロットと容器を記録する" },
        { label: "04 / DELIVER", title: "容器・バルクで輸送", body: "材料適合性、温度、保管期限、封止、輸送、安全条件を保って工場へ届ける" },
        { label: "05 / DISPENSE", title: "装置へ供給", body: "供給設備、配管、ポンプ、フィルター、混合・希釈系を通して必要量を安定供給する" },
        { label: "06 / TREAT", title: "処理・リンス・排液", body: "ウェーハを処理し、純水などで残留物を除き、排液を分別・回収・処理する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "薬液の区分",
      rightLabel: "主な役割",
      rows: [
        { left: "酸性薬液", right: "酸化膜、金属、無機汚染などを対象に、洗浄・表面調整・ウェットエッチングへ使う" },
        { left: "アルカリ性薬液", right: "粒子・有機物の除去、現像、材料選択的な加工、pH調整などへ使う" },
        { left: "酸化剤・還元剤", right: "表面や汚染物を反応しやすい状態へ変え、洗浄・加工・CMPなどを助ける" },
        { left: "高純度溶剤", right: "有機材料の溶解、洗浄、乾燥、希釈、レジスト周辺工程などへ使う" },
        { left: "機能性調合液", right: "複数成分と添加剤を組み合わせ、対象材料への選択性、濡れ性、残渣除去、腐食抑制などを設計する" },
        { left: "CMP・研磨後洗浄液", right: "表面反応、研磨選択性、砥粒分散、研磨後の粒子・金属・残留成分除去を支える" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "半導体用高純度薬液メーカーとは、液体の反応と清浄度を量産品質へする企業",
      lead: "薬液は汚れを落とすだけでなく、表面の膜や状態を意図的に変える直接材料です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "REACTION", title: "選択的に反応させる", body: "対象膜・汚染へ反応し、残す材料への影響を抑えます。" },
            { label: "PURITY", title: "汚染を持ち込まない", body: "金属、粒子、有機物、イオンなどを分析・低減します。" },
            { label: "DELIVERY", title: "品質を変えずに届ける", body: "容器、配管、フィルター、供給設備まで材料適合性を管理します。" },
            { label: "LIFECYCLE", title: "排液まで管理する", body: "使用量、回収、分別、中和・処理、安全、環境負荷を工程に含めます。" },
          ],
        },
        {
          type: "note",
          title: "試薬グレードと半導体製造用グレードは同じではない",
          body: "同じ化学式でも、管理する金属・粒子・有機物、分析法、容器、製造設備、変更通知、供給量が用途で異なります。名称だけで工程適合を判断しません。",
        },
      ],
      paragraphs: [
        "関東化学は、半導体製造向けに超高純度薬品、機能性薬品、薬品自動供給装置を案内しています。富士フイルムも酸、アルカリ、溶剤、調合液を高純度プロセス薬品として展開し、複数の容器・輸送形態を示しています。",
        "材料メーカーの仕事は原液を作って終わりではありません。容器内での安定性、工場内での希釈・混合、フィルター、供給部材、ウェーハ処理、リンス、排液までをつなげます。",
      ],
    },
    {
      id: "process-uses",
      heading: "洗浄・ウェットエッチング・現像・剥離・CMPで、薬液の目的が変わる",
      lead: "薬液名から用途を決めず、処理前後の表面と次工程を確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・用途",
          rightLabel: "薬液が担うこと",
          rows: [
            { left: "ウェーハ洗浄", right: "粒子、有機物、金属、不要な表面膜などを除去し、成膜・熱処理・接合などに合う表面へ整える" },
            { left: "ウェットエッチング", right: "対象材料を化学反応で溶解除去し、膜厚、開口、表面形状を作る。下地・マスクへの選択性を管理する" },
            { left: "現像", right: "露光で溶解性が変わったレジストの不要部分を除去し、パターンを作る" },
            { left: "レジスト剥離・残渣除去", right: "加工後のレジスト、反応生成物、有機・無機残留物を除き、下地材料を保つ" },
            { left: "CMP・研磨後洗浄", right: "表面反応と材料選択を助け、研磨後に砥粒、金属、反応生成物、添加成分を除去する" },
            { left: "ウェット成膜・表面処理", right: "液中反応で導体・保護層などを形成し、濡れ性、核形成、埋め込み、均一性を制御する" },
            { left: "装置・部材洗浄", right: "槽、配管、容器、治具、フィルター周辺の残留物を除き、次の薬液やロットへの持ち越しを抑える" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "汚染除去、リンス、乾燥の原理を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "ウェット・ドライと材料選択性の違いを見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像でパターンを作る流れを見る" },
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "スラリーの化学作用と研磨後洗浄を見る" },
            { label: "配線形成の仕組み", href: "/guides/semiconductor-interconnect-process", description: "溝・ビア加工、導体形成、CMPをつなげて見る" },
          ],
        },
      ],
      paragraphs: [
        "ステラケミファは半導体向けに、高純度フッ素系薬液をウェットエッチング・洗浄用途として公開しています。BASFは洗浄、エッチング、フォトリソグラフィ、CMP、ウェット成膜へプロセス薬品を分類しています。",
        "一つの薬液でも濃度、温度、処理時間、流れ、基板材料で反応が変わります。本記事では具体的な製造条件を示さず、対象材料と守る材料の組み合わせを理解することを優先します。",
      ],
    },
    {
      id: "single-formulated",
      heading: "単一薬品と機能性調合液は、再現性を作る範囲が違う",
      lead: "化学式が同じ材料でも、純度グレードや添加成分によって工程機能が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "材料形態",
          rightLabel: "特徴と確認すること",
          rows: [
            { left: "高純度単一薬品", right: "主成分と微量不純物を厳しく管理する。工場側で希釈・混合する場合は水質、計量、配管、混合順序も工程になる" },
            { left: "濃度調整品", right: "使用濃度に近い状態で供給し、工場内調合作業と濃度変動を抑える。輸送量・保管・容器とのバランスを見る" },
            { left: "混酸・混合アルカリ", right: "複数反応を組み合わせ、除去速度、材料選択性、表面状態を作る。成分比と経時変化を管理する" },
            { left: "添加剤入り機能液", right: "濡れ性、腐食抑制、粒子再付着、選択性、安定性などを設計する。添加剤残留と分析も確認する" },
            { left: "溶剤ブレンド", right: "溶解力、乾燥性、濡れ性、残留物、材料適合性を用途に合わせる" },
            { left: "ポイントオブユース混合", right: "装置近くで希釈・混合し、短寿命材料や濃度切替へ対応する。供給設備とセンサーの再現性が重要" },
          ],
        },
      ],
      paragraphs: [
        "機能性調合液は、単に複数の薬品を混ぜたものではありません。対象膜への速度、下地への影響、濡れ、残渣、保管安定性、排液処理を一つの製品仕様へまとめます。",
        "一方、工場側で単一薬品を調合する方式は柔軟ですが、計量、純水、混合槽、配管、作業、安全を含む管理範囲が広がります。材料費だけでなく工程全体で比較します。",
      ],
    },
    {
      id: "purity-quality",
      heading: "純度は、金属・粒子・有機物・濃度・容器を分けて管理する",
      lead: "総純度の数字だけでは、ウェーハ欠陥や電気特性への影響を判断できません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "品質項目",
          rightLabel: "確認すること",
          rows: [
            { left: "主成分・濃度", right: "反応速度と選択性へ影響する濃度、密度、水分、混合比、経時変化を管理する" },
            { left: "金属不純物", right: "原料、製造設備、配管、容器から入る金属を元素別に測定し、デバイス汚染を抑える" },
            { left: "粒子", right: "原料、析出、反応、容器、輸送、フィルターから生じる粒子の数・大きさを管理する" },
            { left: "有機・イオン成分", right: "残留炭素、イオン、他薬品の持ち込みなど、表面・膜・分析へ影響する成分を確認する" },
            { left: "機能・選択性", right: "対象膜の処理速度、下地への影響、濡れ性、残渣、腐食、表面粗さを実工程に近い条件で評価する" },
            { left: "容器内安定性", right: "材料吸着、溶出、透過、析出、ガス発生、圧力、温度、保管期限、開封後変化を管理する" },
          ],
        },
        {
          type: "note",
          title: "ppt・ppb表記を、そのまま企業順位にしない",
          body: "対象元素、分析方法、検出下限、サンプリング、容器、濃度が違えば比較できません。工程が問題にする不純物を同じ条件で確認します。",
        },
      ],
      paragraphs: [
        "関東化学は、微細な粒子や微量金属不純物が半導体工程で問題になることを示し、超高純度薬品と機能性薬品を展開しています。富士フイルムも用途に応じたカチオン管理水準と複数の製品濃度・荷姿を案内しています。",
        "分析証明書が規格内でも、容器交換、接続、供給設備、フィルター、装置内滞留で品質が変化する可能性があります。使用点に近いサンプリングと工程結果を結び付けます。",
      ],
    },
    {
      id: "delivery",
      heading: "ボトル・ドラム・大型容器・工場内供給は、使用量と汚染リスクで選ぶ",
      lead: "薬液を装置へ届ける経路も、製品品質の一部です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PACKAGE", title: "容器を合わせる", body: "薬液と反応・溶出しにくい材質、封止、継手、ラベル、回収方法を選びます。" },
            { label: "TRANSFER", title: "密閉して移送する", body: "ポンプ、圧力、配管、バルブで外気・粒子・他薬液の混入を抑えます。" },
            { label: "FILTER", title: "使用点でろ過する", body: "材料と必要流量に合うフィルターで粒子を低減し、溶出や目詰まりを管理します。" },
            { label: "MONITOR", title: "濃度・在庫を監視する", body: "残量、流量、圧力、漏えい、濃度、使用期限を監視して供給停止を防ぎます。" },
          ],
        },
        {
          type: "note",
          title: "大容量化は交換回数を減らす一方、異常時の影響量も増える",
          body: "使用量、保管場所、二次受け、配管距離、切替、予備在庫、回収、緊急対応を含め、容器サイズと供給方式を決めます。",
        },
      ],
      paragraphs: [
        "関東化学は高純度・機能性薬品に加えて薬品自動供給装置を公開しています。富士フイルムもボトル、ドラム、大型容器など複数の供給形態と、高純度薬液向け供給システムを案内しています。",
        "材料を変更しなくても、容器材質、フィルター、配管長、ポンプ、供給温度を変えるとウェーハ上の結果が変わる場合があります。設備変更も材料認定の一部として扱います。",
      ],
    },
    {
      id: "safety-environment",
      heading: "安全管理は、腐食性・毒性・酸化性・可燃性と混触を分けて考える",
      lead: "高純度であることと、安全に扱いやすいことは別の特性です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "管理の層",
          rightLabel: "代表的な確認事項",
          rows: [
            { left: "危険性を特定", right: "SDS、法規、腐食性、毒性、酸化性、可燃性、反応性、分解生成物、適合部材を確認する" },
            { left: "分離・閉じ込め", right: "混触する薬液を分離し、密閉容器、二次受け、適合配管、換気設備で漏えいを抑える" },
            { left: "検知・遮断", right: "漏えい、液位、圧力、流量、排気、設備異常を監視し、自動停止・系統隔離へつなぐ" },
            { left: "作業者保護", right: "教育、資格、手順、保護具、局所排気、緊急シャワー・洗眼、避難・救急体制を整える" },
            { left: "排液分別", right: "酸・アルカリ、有機溶剤、金属・フッ素系など、反応・回収・処理方法に応じて系統を分ける" },
            { left: "使用量・回収", right: "処理時間、流量、再利用、濃度管理、容器回収、排水負荷を工程性能とともに改善する" },
          ],
        },
        {
          type: "note",
          title: "具体的な取扱条件は、SDS・法規・設備仕様・事業所手順に従う",
          body: "薬液の濃度、温度、混合、設備、処理量で危険性が変わります。本記事は安全教育や作業手順の代わりにはなりません。",
        },
      ],
      paragraphs: [
        "薬液供給では、漏えいを防ぐだけでなく、異常を早く見つけて止め、作業者と周辺設備を隔離する設計が必要です。容器交換・保守のように人が設備へ近づく作業を重点的に管理します。",
        "排液は一括処理できるとは限りません。混ぜることで発熱・有害成分・沈殿が生じる組み合わせもあるため、投入前から排液系統と処理方法を設計します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体用高純度薬液の代表企業4社",
      lead: "公開製品を、原料・機能性薬液・供給設備の役割へ分けて見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "ステラケミファ", right: "高純度フッ素系薬液を中心に、半導体のウェットエッチング・洗浄用薬液、機能性洗浄・加工材料を展開" },
            { left: "関東化学", right: "超高純度薬品、洗浄液、エッチング液、残渣除去液、レジスト剥離・現像材料、薬品自動供給装置を展開" },
            { left: "富士フイルム", right: "高純度の酸、アルカリ、溶剤、溶剤ブレンド、機能性調合液、薄膜材料と薬液供給システムを展開" },
            { left: "BASF", right: "半導体向け高純度プロセス薬品と、洗浄、エッチング、リソグラフィ、CMP、ウェット成膜の調合ソリューションを展開" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、市場順位ではない",
          body: "取り扱う薬液、地域、濃度、荷姿、製造拠点、顧客認定は変わります。公式製品ページを工程へ置くための例として紹介しています。",
        },
      ],
      paragraphs: [
        "ステラケミファはフッ素系高純度薬液、関東化学は幅広い超高純度・機能性薬品と供給装置、富士フイルムは基礎薬品・溶剤・調合液と供給、BASFは工程別の調合ソリューションを確認できます。",
        "企業比較では、幅広い品ぞろえと特定材料への専門性を優劣へ変換しません。対象工程に必要な材料、分析、供給、現地支援がそろうかを見ます。",
      ],
    },
    {
      id: "comparison",
      heading: "高純度薬液メーカーは、8つの条件をそろえて比較する",
      lead: "企業名の比較を、表面反応と量産供給の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象工程", right: "洗浄、ウェットエッチング、現像、剥離、残渣除去、CMP、ウェット成膜のどこか" },
            { left: "2. 対象・保護材料", right: "何を除去・形成し、シリコン、絶縁膜、金属、レジストなど何を残すか" },
            { left: "3. 化学・機能", right: "酸・アルカリ・溶剤・酸化剤、単一・調合、濃度、選択性、濡れ、残渣、腐食" },
            { left: "4. 純度・分析", right: "金属、粒子、有機物、イオン、濃度、検出下限、証明書、使用点での品質" },
            { left: "5. 容器・供給", right: "荷姿、容器材質、輸送、保管、ポンプ、配管、フィルター、希釈・混合、予備系" },
            { left: "6. 安全・排液", right: "SDS、法規、混触、検知、二次受け、保護具、分別、回収、排水処理" },
            { left: "7. 拠点・安定供給", right: "製造・充填拠点、物流距離、複数ソース、在庫、増産、災害時対応、現地支援" },
            { left: "8. 認定・変更管理", right: "サンプル、装置・ウェーハ評価、原料・工程・工場・容器・分析法の変更通知" },
          ],
        },
      ],
      paragraphs: [
        "まず一つの工程と対象材料を固定します。基礎薬品の大量供給と、特定残渣を除去する少量の機能性薬液では、比較すべき性能と供給方式が異なります。",
        "次に処理後の表面を確認します。除去速度が高くても、下地減り、粗れ、腐食、残渣、粒子、乾燥跡が次工程へ影響すれば適合しません。",
      ],
    },
    {
      id: "jobs",
      heading: "高純度薬液メーカーの仕事は、化学・分析・設備・物流がつながる",
      lead: "材料開発だけでなく、高純度製造と安全な量産供給が重要です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "R&D", title: "材料・処方開発", body: "反応、選択性、添加剤、濡れ、残渣、安定性、排液処理を設計します。" },
            { label: "PROCESS", title: "製造技術", body: "精製、蒸留、混合、ろ過、充填を量産設備へ落とし込みます。" },
            { label: "ANALYTICS", title: "分析・品質保証", body: "微量金属、粒子、濃度、有機物、機能、容器由来成分を測ります。" },
            { label: "EQUIPMENT", title: "供給設備・保全", body: "容器、ポンプ、配管、バルブ、フィルター、監視、排液設備を設計・維持します。" },
            { label: "APPLICATION", title: "アプリケーション", body: "顧客の膜・汚染・装置に合わせ、評価方法と処理条件の範囲を検討します。" },
            { label: "EHS", title: "安全・環境", body: "法規、SDS、リスク評価、教育、緊急対応、排水・廃棄を管理します。" },
            { label: "SUPPLY", title: "調達・物流", body: "原料、容器、製造拠点、危険物輸送、在庫、回収、供給継続を計画します。" },
            { label: "SALES", title: "営業・技術支援", body: "工程課題を材料・供給・品質へ分解し、認定と量産導入を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、研究所、薬液工場、分析部門、供給設備部門、顧客工場支援のどこへ配属されるかを確認します。同じ企業でも扱う危険物、勤務形態、必要資格、顧客対応が変わります。",
        "化学・材料だけでなく、生産技術、品質、設備保全、流体、物流、安全環境の経験を接続できます。仕事内容は公式求人と配属拠点の製品で確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体用高純度薬液メーカーでよくある質問",
      lead: "材料分類と企業の役割を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体用高純度薬液とは何ですか？", answer: "半導体製造の洗浄、ウェットエッチング、現像、剥離、残渣除去、CMPなどで使う、微量不純物や粒子を厳しく管理した液体材料です。" },
            { question: "主な半導体薬液メーカーは？", answer: "この記事ではステラケミファ、関東化学、富士フイルム、BASFを代表例として紹介しています。製品領域別の例であり、網羅的な市場順位ではありません。" },
            { question: "高純度薬液と機能性薬液の違いは？", answer: "高純度薬液は主成分と微量不純物を厳しく管理します。機能性薬液は複数成分や添加剤を組み合わせ、選択性、濡れ、残渣除去、腐食抑制など特定の工程機能を設計します。両方を満たす製品もあります。" },
            { question: "純度が高ければ良い薬液ですか？", answer: "純度は重要ですが、それだけでは決まりません。対象材料への反応、下地への影響、粒子、残渣、容器、供給設備、安全、排液、安定供給を同じ工程条件で確認します。" },
            { question: "薬液メーカーと洗浄装置メーカーの違いは？", answer: "薬液メーカーは反応・純度・安定性を持つ材料を開発・供給します。洗浄装置メーカーは薬液をウェーハへ均一に届け、温度、時間、流れ、リンス、乾燥、搬送を制御します。" },
            { question: "薬液は工場で混ぜますか？", answer: "高純度単一薬品を工場内で希釈・混合する場合と、濃度調整品・機能性調合液を受け入れる場合があります。寿命、使用量、再現性、安全、供給設備で選びます。" },
            { question: "薬液を扱う仕事は危険ですか？", answer: "腐食性、毒性、酸化性、可燃性、混触などの危険があるため、密閉・分離、検知、換気、二次受け、保護具、教育、緊急対応、排液分別を重ねて管理します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象材料・純度・供給・安全をそろえて薬液メーカーを見る",
      lead: "高純度薬液は、表面を変える材料であると同時に、工場内を流れる量産インフラです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "SURFACE", title: "処理前後を決める", body: "何を除去・形成し、何を残して次工程へ渡すかを確認する" },
            { label: "CHEMISTRY", title: "材料機能を分ける", body: "酸・アルカリ・溶剤、単一・調合、濃度、選択性を見る" },
            { label: "QUALITY", title: "不純物と経路を見る", body: "金属・粒子・有機物、容器、配管、フィルターを確認する" },
            { label: "LIFECYCLE", title: "供給から排液まで見る", body: "物流、設備、安全、回収、排水、変更認定を一つの系で見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "薬液を供給・リンス・乾燥する装置と主要企業を見る" },
            { label: "塗布現像装置メーカー", href: "/guides/semiconductor-coater-developer-manufacturers", description: "レジスト・現像液・リンス材料を扱う装置と供給系を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "レジスト、現像、リンスなどの周辺材料を見る" },
            { label: "CMP装置メーカー", href: "/guides/semiconductor-cmp-equipment-manufacturers", description: "スラリー供給、研磨、洗浄を統合する装置を見る" },
            { label: "CMPスラリーメーカー", href: "/guides/semiconductor-cmp-slurry-manufacturers", description: "砥粒と薬液を組み合わせる研磨材料を見る" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "気体材料の純度・供給・安全管理と比較する" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "薬液が使われる前工程の全体像を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "材料・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの薬液用途を選び、対象工程、対象・保護材料、化学・機能、純度・分析、容器・供給、安全・排液、拠点、認定・変更管理の8項目で整理してください。",
      ],
    },
  ],
  todayQuest: "ステラケミファ・関東化学・富士フイルム・BASFから1社を選び、公式製品を工程・対象材料・薬液分類・純度・供給・安全の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-cleaning-process",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-etching-equipment-manufacturers",
    "photolithography-process",
    "semiconductor-coater-developer-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-cmp-process",
    "semiconductor-cmp-equipment-manufacturers",
    "semiconductor-cmp-slurry-manufacturers",
    "semiconductor-interconnect-process",
    "semiconductor-gas-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
