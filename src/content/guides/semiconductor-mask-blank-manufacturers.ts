import type { GuideArticle } from "@/content/guides/types";

export const semiconductorMaskBlankManufacturersGuide: GuideArticle = {
  slug: "semiconductor-mask-blank-manufacturers",
  title: "半導体マスクブランクスメーカーとは？HOYA・AGCなどを初心者向けに図解",
  description:
    "半導体マスクブランクスは、フォトマスクへ回路を描く前の精密な母材です。合成石英・低熱膨張ガラス、遮光膜・位相シフト膜、DUV・EUVの構造、平坦度・欠陥、主要メーカーを図解します。",
  targetQuery: "半導体 マスクブランクス メーカー",
  searchIntent:
    "半導体マスクブランクスの構造と製造工程、フォトマスクとの違い、DUV・EUV用の材料と品質要求、HOYA・AGC・信越化学工業・S&S TECHなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "HOYA、AGC、信越化学工業、S&S TECHの公式製品・技術情報とimecの技術解説をもとに、基板、研磨、洗浄、薄膜、レジスト、検査、DUV・EUVへ整理しました。市場順位や非公開仕様ではなく、同じ露光方式とブランクス構造へ条件をそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "完成フォトマスクの記事を公開したうえで、その品質の出発点となるパターン形成前の母材を独立して理解する記事が必要だと判断",
    "HOYAとAGCの公式情報で、DUV・EUV用ブランクス、低熱膨張基板、研磨、薄膜、平坦度、欠陥に関する領域を確認",
    "信越化学工業とS&S TECHの公式情報で、OMOG、バイナリ、ハーフトーン位相シフト、ハードマスクなどの製品領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Information Technology Business",
      url: "https://www.hoya.com/ir/2025/en/review/it.html",
      publisher: "HOYA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Electronics｜Development story: Mask blanks for EUV exposure",
      url: "https://www.agc.com/en/innovation/pickup/electronics.html",
      publisher: "AGC Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "EUV露光用フォトマスクブランクスの生産能力を増強",
      url: "https://www.agc.com/news/detail/1203818_2148.html",
      publisher: "AGC株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "マスクブランクス",
      url: "https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/photomask-blanks/",
      publisher: "信越化学工業株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "SEMICONDUCTOR BLANK MASK",
      url: "https://www.snstech.co.kr/renew/html/sub02_01.asp",
      publisher: "S&S TECH Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "High-NA EUV lithography: the next step after EUVL",
      url: "https://www.imec-int.com/en/articles/high-na-euvl-next-major-step-lithography",
      publisher: "imec",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "マスクブランクスを調べても、合成石英、低熱膨張ガラス、クロム、MoSi、位相シフト、反射多層膜などが並び、完成フォトマスクと何が違うのか分かりにくくありませんか。",
    conclusion:
      "マスクブランクスは、精密なガラス基板へ遮光膜・位相シフト膜・EUV反射多層膜などを形成し、必要に応じて描画用レジストまで塗布した、回路パターン形成前の母材です。企業比較では、DUV・EUV、基板、膜構成、平坦度、欠陥、光学特性、レジスト、供給認定をそろえます。",
    learnings:
      "マスクブランクスと完成フォトマスクの違い、基板・研磨・薄膜・レジストの製造工程、DUV透過型とEUV反射型、バイナリ・位相シフト・OMOG、品質要求、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "マスクブランクスメーカーを比べるときは、『まだ模様がないガラス板』ではなく、『完成マスクの平坦度・欠陥・光学性能を先に決める積層材料』として見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜基板と薄膜を作り、回路を描ける母材へ仕上げる",
      description:
        "マスクブランクス製造を単純化した流れです。工程順、膜構成、レジストの有無、検査方法はDUV・EUVと製品仕様で異なります。",
      stages: [
        { label: "01 / SUBSTRATE", title: "基板を作る", body: "合成石英や低熱膨張ガラスを用意し、寸法、内部品質、熱・機械特性を管理する" },
        { label: "02 / POLISH", title: "高精度に研磨する", body: "表面形状を測りながら平坦化し、粗さ、うねり、傷、端部形状を整える" },
        { label: "03 / CLEAN", title: "洗浄・検査する", body: "粒子、研磨残り、有機物、金属などを除去し、基板欠陥と表面状態を確認する" },
        { label: "04 / FILM", title: "光学膜を形成する", body: "遮光膜、位相シフト膜、反射多層膜、保護膜、吸収膜などを均一に積層する" },
        { label: "05 / RESIST", title: "レジストを塗る", body: "製品仕様に応じて電子線・光描画用レジストを均一に塗布し、保存・描画性を整える" },
        { label: "06 / VERIFY", title: "最終検査して出荷する", body: "平坦度、膜厚、光学特性、粒子・欠陥、レジスト状態を確認し、完成マスク工場へ届ける" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "供給物",
      rightLabel: "どこまで作られているか",
      rows: [
        { left: "ガラス・石英素材", right: "基板へ加工する前の材料。組成、純度、熱膨張、内部欠陥などを管理する" },
        { left: "研磨済み基板", right: "所定寸法へ加工・研磨・洗浄した基板。まだ遮光膜や反射膜を持たない" },
        { left: "マスクブランクス", right: "基板上へ用途別の薄膜を形成し、回路パターンを描く前の状態にした母材" },
        { left: "レジスト付きブランクス", right: "描画工程へ入れられるよう、薄膜上へ電子線・光描画用レジストを塗布した製品" },
        { left: "完成フォトマスク", right: "顧客の回路データを描画・加工し、寸法・位置・欠陥などを検査した量産用原版" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "マスクブランクスメーカーとは、基板・薄膜・表面を一つの母材へまとめる企業",
      lead: "完成マスクメーカーが回路を描く前の品質土台を作ります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "GLASS", title: "基板特性を作る", body: "純度、熱膨張、内部品質、寸法、平坦度、表面粗さを整えます。" },
            { label: "FILM", title: "光を制御する", body: "遮光、位相、反射、吸収、保護などの機能を薄膜構成で作ります。" },
            { label: "CLEAN", title: "欠陥を持ち込まない", body: "研磨・成膜・洗浄・搬送で粒子、傷、膜欠陥、汚染を抑えます。" },
            { label: "INTERFACE", title: "描画工程へつなぐ", body: "レジスト、加工性、検査性、容器、保管を完成マスク工程へ合わせます。" },
          ],
        },
        {
          type: "note",
          title: "回路設計データは通常、次の完成マスク工程で入る",
          body: "ブランクスは標準・顧客仕様の積層材料であり、まだチップ固有の回路パターンを持ちません。完成マスク工場で描画・現像・加工・検査されます。",
        },
      ],
      paragraphs: [
        "信越化学工業はマスクブランクスを、合成石英基板上に遮光性薄膜を形成したフォトマスク材料と説明しています。HOYAも、フォトマスク製造に使うマスター基板としてDUV用・EUV用ブランクスを案内しています。",
        "基板の形状や薄膜内の欠陥は、後から回路を正しく描いても消せない場合があります。完成マスクの加工性・検査性・転写性能を考え、基板と膜を一体で管理します。",
      ],
    },
    {
      id: "duv",
      heading: "DUV用ブランクスは、透明基板と遮光・位相制御膜で光を通し分ける",
      lead: "KrF・ArFなどの透過型マスクでは、膜の遮光性と加工性が重要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "DUV用の要素",
          rightLabel: "主な役割と確認事項",
          rows: [
            { left: "合成石英基板", right: "露光光を通し、寸法・平坦度・表面・内部品質を安定させる" },
            { left: "クロム系遮光膜", right: "光を遮る領域を作る代表的な膜。光学濃度、反射、加工性、欠陥を管理する" },
            { left: "MoSi系遮光膜", right: "モリブデン・シリコン系材料で遮光・加工特性を作る。OMOGなどのバイナリ用途がある" },
            { left: "ハーフトーン位相シフト膜", right: "一部の光を通しながら位相をずらし、ウェーハ像のコントラストや焦点余裕を調整する" },
            { left: "反射防止・ハードマスク層", right: "不要な反射を抑える、加工時の選択性や形状を支えるなど、製品構造に応じた機能を持つ" },
            { left: "描画用レジスト", right: "電子ビーム・光描画でパターンを作る感光膜。膜厚、均一性、感度、保存、基板との密着を見る" },
          ],
        },
      ],
      paragraphs: [
        "信越化学工業は、従来のクロム系に加えてMoSiを遮光膜へ用いるOMOGブランクスと、ハーフトーン位相シフト用ブランクスを公開しています。S&S TECHもバイナリ、PSM、ハードマスクなどを製品分類として案内しています。",
        "同じArF向けでも、バイナリと位相シフトでは膜の透過率・位相差・加工方法が異なります。光源名だけでなく、完成マスク構造までそろえて比較します。",
      ],
    },
    {
      id: "euv",
      heading: "EUV用ブランクスは、低熱膨張基板上の多層膜で光を反射する",
      lead: "EUVは材料を透過しにくいため、DUV用の透明な原版とは構造が大きく異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "EUV用の要素",
          rightLabel: "主な役割と確認事項",
          rows: [
            { left: "低熱膨張ガラス基板", right: "露光・製造中の温度変化による形状変化を抑え、高い平坦度を維持する" },
            { left: "裏面導電膜", right: "露光装置内の静電チャックなどに対応し、保持・接地に必要な機能を持たせる" },
            { left: "反射多層膜", right: "異なる材料の薄膜を多数交互に積層し、13.5nmのEUVを干渉により反射する" },
            { left: "保護・キャップ層", right: "反射多層膜表面を保護し、後工程の加工・洗浄との界面を作る" },
            { left: "吸収膜・ハードマスク", right: "完成マスク工程でパターン化され、EUVの反射を抑える領域を作る" },
            { left: "描画用レジスト", right: "吸収膜へ微細パターンを移すための感光膜。電子線描画・加工・欠陥要求へ合わせる" },
          ],
        },
        {
          type: "note",
          title: "EUV多層膜の下にある欠陥も転写へ影響する",
          body: "基板上の微小な凹凸や粒子が多層膜を通じて表面形状へ現れる場合があります。表面の異物だけでなく、基板・多層膜の埋込み欠陥も管理対象です。",
        },
      ],
      paragraphs: [
        "AGCはEUV用ブランクスを、低熱膨張ガラス基板へ複数組成の膜を積層したものと説明し、ガラス材料、研磨、成膜までの技術を案内しています。HOYAも半導体向けにEUV用とDUV用を展開しています。",
        "imecはEUVマスクの反射多層膜、吸収体、斜め入射による三次元効果を説明しています。High-NAなど次世代方式では、平坦度・欠陥だけでなく吸収体の材料・厚さと像への影響も重要になります。",
      ],
    },
    {
      id: "quality",
      heading: "平坦度・粗さ・膜均一性・欠陥が、完成マスクの上限を決める",
      lead: "ブランクス品質は、見える粒子数だけでは評価できません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FLATNESS", title: "平坦度・形状", body: "基板面のうねり、反り、局所形状を抑え、描画・露光時の位置と焦点を支えます。" },
            { label: "ROUGHNESS", title: "表面・界面粗さ", body: "基板と各薄膜の粗さを抑え、散乱、反射、パターン形状への影響を減らします。" },
            { label: "FILM", title: "膜厚・組成均一性", body: "遮光、透過、位相、反射、加工特性を面内で安定させます。" },
            { label: "DEFECT", title: "基板・膜欠陥", body: "ピット、突起、傷、粒子、膜抜け、埋込み欠陥などを検出・分類します。" },
            { label: "OPTICAL", title: "光学特性", body: "光学濃度、透過率、位相差、反射率などを対象波長・構造へ合わせます。" },
            { label: "RESIST", title: "レジスト品質", body: "膜厚、均一性、粒子、密着、感度、保存安定性を描画工程へ合わせます。" },
          ],
        },
        {
          type: "note",
          title: "欠陥ゼロという言葉を無条件に使わない",
          body: "検出感度、検査波長、対象層、欠陥種類、面積が違えば比較できません。検出限界以下であることと、転写へ影響しないことも分けて考えます。",
        },
      ],
      paragraphs: [
        "AGCはEUVブランクスで、極小欠陥を限りなく減らすことと非常に高い平坦度が求められると説明しています。基板研磨、洗浄、成膜、搬送、検査のどこでも新たな欠陥を作らない工程設計が必要です。",
        "膜の平均値が合っていても、面内分布、局所異常、ロット差、保管後変化が大きければ完成マスク加工は安定しません。単一の反射率や透過率ではなく、分布と再現性を確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体マスクブランクスの代表企業4社",
      lead: "公式情報で確認できる製品領域を、DUV・EUVと膜構造へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "HOYA｜日本", right: "半導体製造用マスクブランクスを展開し、公式情報でDUV用・EUV用の2種類を案内" },
            { left: "AGC｜日本", right: "低熱膨張ガラス材料、基板研磨、薄膜形成を組み合わせたEUV用マスクブランクスを展開" },
            { left: "信越化学工業｜日本", right: "合成石英基板上の遮光膜、OMOGバイナリ、ハーフトーン位相シフトなどのマスクブランクスを展開" },
            { left: "S&S TECH｜韓国", right: "半導体向けにバイナリ、PSM、ハードマスク、Advanced PSMなどのブランクマスクを案内" },
          ],
        },
        {
          type: "note",
          title: "製品領域の代表例であり、市場順位ではない",
          body: "対応波長、製品世代、製造拠点、顧客認定は変わります。異なるDUV・EUV製品や仕様値を横並びにせず、公式製品を構造へ置く例として紹介します。",
        },
      ],
      paragraphs: [
        "HOYAはDUV・EUV、AGCはEUVの材料から成膜まで、信越化学工業はOMOG・位相シフトを含む光リソグラフィ向け、S&S TECHは複数の半導体用ブランクマスク種を公式に示しています。",
        "企業研究では製品名の数だけでなく、ガラス素材の内製、研磨、成膜、レジスト塗布、検査、顧客近接拠点、量産認定、次世代方式への開発範囲を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "マスクブランクスメーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、基板・薄膜・欠陥・量産供給の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 露光方式・用途", right: "i線、KrF、ArF、DUV、EUV、IC、研究開発など、どの完成マスクへ使うか" },
            { left: "2. 基板", right: "合成石英、低熱膨張ガラス、素材・加工範囲、寸法、熱膨張、内部品質、端部形状" },
            { left: "3. 膜構成", right: "クロム、MoSi、位相シフト、反射多層膜、保護膜、吸収膜、ハードマスク、裏面膜" },
            { left: "4. 形状・表面", right: "平坦度、反り、うねり、局所形状、表面・界面粗さ、傷、研磨・洗浄状態" },
            { left: "5. 欠陥・検査", right: "基板欠陥、粒子、膜欠陥、埋込み欠陥、検査感度、座標、分類、トレーサビリティ" },
            { left: "6. 光学・加工特性", right: "透過、光学濃度、位相、反射、膜厚均一性、描画・加工選択性、洗浄耐性" },
            { left: "7. レジスト・取扱い", right: "レジスト有無、種類、膜厚、保存、容器、搬送、清浄度、完成マスク工程との適合" },
            { left: "8. 供給・認定", right: "製造拠点、素材調達、能力、複数ソース、長期評価、設備・材料・工場変更、次世代共同開発" },
          ],
        },
      ],
      paragraphs: [
        "まずDUVとEUVを分けてください。透過型の遮光・位相制御膜と、反射型の低熱膨張基板・多層膜では、材料、設備、検査、欠陥の意味が異なります。",
        "次に完成マスク工程との適合を確認します。膜が高性能でも、描画レジスト、加工、洗浄、欠陥検査、修正に適合しなければ量産材料として使えません。",
      ],
    },
    {
      id: "jobs",
      heading: "マスクブランクスメーカーの仕事は、ガラス・研磨・成膜・検査をつなぐ",
      lead: "材料開発だけでなく、超平坦化と極小欠陥管理の量産技術が重要です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "GLASS", title: "ガラス・基板開発", body: "組成、合成、純度、熱膨張、内部欠陥、機械・熱特性を設計します。" },
            { label: "POLISH", title: "精密研磨・洗浄", body: "形状計測、研磨、表面粗さ、傷、粒子、洗浄、乾燥を最適化します。" },
            { label: "DEPOSITION", title: "薄膜・真空プロセス", body: "膜材料、積層、膜厚、組成、応力、光学特性、欠陥を制御します。" },
            { label: "RESIST", title: "塗布・材料適合", body: "描画用レジストの塗布、加熱、膜厚、密着、保存、加工適合を評価します。" },
            { label: "INSPECTION", title: "検査・計測", body: "平坦度、粗さ、膜、光学特性、粒子・欠陥を測定し、工程へ返します。" },
            { label: "EQUIPMENT", title: "設備・生産技術", body: "研磨、洗浄、成膜、塗布、検査、搬送設備の能力・稼働・清浄度を改善します。" },
            { label: "QUALITY", title: "品質保証", body: "仕様、ロット、変更、逸脱、原因解析、認定、トレーサビリティを管理します。" },
            { label: "CUSTOMER", title: "アプリケーション", body: "完成マスク加工とウェーハ転写の結果を材料・基板・膜課題へ分解します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、ガラス材料、精密加工、研磨、洗浄、真空成膜、光学薄膜、表面分析、画像・欠陥検査、設備、品質、顧客支援のどこを担当するかを確認します。",
        "ガラス・セラミックス、材料、化学、光学、真空、精密機械、計測、品質、生産技術の経験を接続できます。具体的な製品方式と配属拠点は公式求人で確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体マスクブランクスメーカーでよくある質問",
      lead: "完成マスク、DUV・EUV、膜と品質の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体マスクブランクスとは何ですか？", answer: "精密なガラス基板へ遮光膜・位相シフト膜・EUV反射多層膜などを形成し、回路パターンを描く前の状態にしたフォトマスクの母材です。" },
            { question: "主なマスクブランクスメーカーは？", answer: "この記事ではHOYA、AGC、信越化学工業、S&S TECHを代表例として紹介しています。対応方式別の例であり、網羅的な市場順位ではありません。" },
            { question: "マスクブランクスとフォトマスクの違いは？", answer: "ブランクスにはまだ顧客固有の回路パターンがありません。完成マスクメーカーがブランクスへ描画・加工・検査を行ったものがフォトマスクです。" },
            { question: "DUV用とEUV用は何が違いますか？", answer: "DUV用は主に透明基板を通る光を遮光膜・位相膜で制御します。EUV用は低熱膨張基板上の多層膜でEUVを反射し、吸収膜で反射を制御します。" },
            { question: "OMOGとは何ですか？", answer: "Opaque MoSi On Glassの略で、ガラス基板上の遮光膜にMoSi系材料を用いるバイナリマスク向けブランクスです。加工性などを考えて製品仕様へ適用されます。" },
            { question: "位相シフトブランクスとは何ですか？", answer: "光の透過量だけでなく位相差を利用できる薄膜を持つブランクスです。完成マスクに加工し、像のコントラストや焦点余裕を調整します。" },
            { question: "EUVブランクスではなぜ平坦度が重要ですか？", answer: "反射型マスクの形状変化は、露光時の焦点・位置・像へ影響する可能性があります。低熱膨張基板と高精度研磨で面形状を管理します。" },
            { question: "小さな欠陥なら完成マスク工程で除けますか？", answer: "表面粒子は洗浄できる場合がありますが、基板の凹凸や多層膜内部の欠陥は除去・修正が難しい場合があります。欠陥種類と転写影響を分けて判断します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜露光方式・基板・膜・欠陥をそろえてメーカーを見る",
      lead: "マスクブランクスは、完成フォトマスクの精度と光学性能を支える積層材料です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "STAGE", title: "母材と完成品を分ける", body: "ブランクスはパターン前、フォトマスクは回路加工・検査後の原版" },
            { label: "METHOD", title: "DUV・EUVを分ける", body: "透過型の遮光・位相膜と、反射型の低膨張基板・多層膜を見る" },
            { label: "QUALITY", title: "基板と膜を一体で見る", body: "平坦度、粗さ、膜均一性、光学特性、基板・膜欠陥を確認する" },
            { label: "PRODUCTION", title: "描画工程までつなぐ", body: "レジスト、加工・洗浄・検査適合、容器、拠点、認定、変更管理を見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "ブランクスへ回路を描き、完成原版へ仕上げる企業を見る" },
            { label: "ペリクルメーカー", href: "/guides/semiconductor-pellicle-manufacturers", description: "完成マスクの回路面を露光中の異物から守る部材を見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "完成マスクの像をウェーハへ転写する工程を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "EUV・DUV・i線装置と主要企業を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "ウェーハ・マスク描画で使う感光材料を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "ブランクス・マスクの欠陥を測る装置企業を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "設計・マスク・ウェーハ加工のつながりを見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、露光方式、基板、膜構成、形状・表面、欠陥・検査、光学・加工特性、レジスト・取扱い、供給・認定の8項目で整理してください。",
      ],
    },
  ],
  todayQuest: "HOYA・AGC・信越化学工業・S&S TECHから1社を選び、公式製品を露光方式・基板・膜構成・欠陥・光学特性・供給の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-photomask-manufacturers",
    "semiconductor-pellicle-manufacturers",
    "photolithography-process",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "semiconductor-deposition-process",
    "semiconductor-cleaning-process",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
