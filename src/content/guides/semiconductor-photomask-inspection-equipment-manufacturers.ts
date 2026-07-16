import type { GuideArticle } from "@/content/guides/types";

export const semiconductorPhotomaskInspectionEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-photomask-inspection-equipment-manufacturers",
  title: "半導体フォトマスク検査装置メーカーとは？レーザーテック・KLAなどを初心者向けに図解",
  description:
    "半導体フォトマスク検査装置は、マスクブランクスや描画後のフォトマスクから欠陥を探す装置です。Die-to-Die・Die-to-Database、DUV・EUVアクティニック検査、レビュー・転写影響判定・修正、主要メーカーを図解します。",
  targetQuery: "半導体 フォトマスク 検査装置 メーカー",
  searchIntent:
    "フォトマスク検査装置の役割と検査工程、ブランクス・パターン・エッジ検査、Die-to-Die・Die-to-Database、DUV・EUVの違い、レーザーテック・KLA・ニューフレアテクノロジー・ZEISSなど主要企業の領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "レーザーテック、KLA、ニューフレアテクノロジー、ZEISSの公式製品・技術情報と、テクセンドフォトマスクの公式工程説明をもとに、ブランクス検査、パターン検査、レビュー、転写影響判定、計測、修正・再検査へ整理しました。市場順位や異なる条件の検出感度ではなく、対象物と検査目的をそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "完成フォトマスク、マスクブランクス、ペリクル、描画装置の記事を公開したうえで、描画・加工結果を品質保証する検査装置領域を独立して説明する記事が必要だと判断",
    "レーザーテックの公式情報で、DUV・EUVのブランクス、パターン、裏面・エッジ、アクティニック検査の領域を確認",
    "KLAでレチクル欠陥検査・位置計測・データ解析、ニューフレアテクノロジーで光学マスク検査、ZEISSで転写影響判定・修正・修正確認の領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Business and Core Technology",
      url: "https://www.lasertec.co.jp/en/company/business.html",
      publisher: "Lasertec Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "MATRICS X8ULTRA Series Mask Inspection System",
      url: "https://www.lasertec.co.jp/products/semiconductor/matrics_x8ultra.html",
      publisher: "レーザーテック株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "ACTIS A150 Actinic EUV Patterned Mask Inspection System",
      url: "https://www.lasertec.co.jp/en/news/2019/20190912_2936.html",
      publisher: "Lasertec Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "MZ100 Mask Edge Inspection System",
      url: "https://www.lasertec.co.jp/en/products/semiconductor/mz100.html",
      publisher: "Lasertec Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA Annual Report｜Reticle Manufacturing",
      url: "https://ir.kla.com/sec-filings/all-sec-filings/content/0000319201-24-000021/klac-20240630.htm",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Teron SL670e Product Fact Sheet",
      url: "https://www.kla.com/documents/pdf/KLA_Teron_SL670e_ProductFactSheet.pdf",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "マスク検査装置",
      url: "https://www.nuflare.co.jp/products/mask/",
      publisher: "株式会社ニューフレアテクノロジー",
      accessedAt: "2026-07-16",
    },
    {
      title: "Mask Qualification Solutions",
      url: "https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-qualification.html",
      publisher: "Carl Zeiss SMT GmbH",
      accessedAt: "2026-07-16",
    },
    {
      title: "Mask Repair Solutions",
      url: "https://www.zeiss.com/semiconductor-manufacturing-technology/products/photomask-solutions/mask-repair.html",
      publisher: "Carl Zeiss SMT GmbH",
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
      "フォトマスク検査装置を調べても、ブランクス検査と完成マスク検査、DUVとEUV、欠陥検出と転写影響判定、レビューと修正が混ざり、各メーカーの違いが分かりにくくありませんか。",
    conclusion:
      "フォトマスク検査装置は、原版の広い面積を走査して欠陥候補の座標を得る装置です。その後、レビュー、寸法・位置計測、転写影響判定、修正、再検査を組み合わせます。企業比較では、対象物、検査原理、比較方法、感度・誤検出、速度、転写影響、搬送清浄度、データ連携をそろえます。",
    learnings:
      "ブランクス・パターン・裏面・エッジ検査、Die-to-Die・Die-to-Database、透過・反射・暗視野、EUVアクティニック検査、欠陥レビュー・転写影響判定・修正、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "検査装置が見つけるのは、まず『欠陥候補』です。欠陥の種類、転写されるか、修正できるかを別の装置・データで絞り、使用・洗浄・修正・再製作を判断します。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜マスクを検査し、修正・使用判断へつなぐ",
      description:
        "描画・加工後の一般的な品質確認を単純化した流れです。検査の回数、順序、装置構成、判定基準はマスク種・顧客仕様で異なります。",
      stages: [
        { label: "01 / LOAD", title: "清浄に搬送する", body: "マスクを容器から取り出し、表裏・向き・識別を確認してステージへ保持する" },
        { label: "02 / INSPECT", title: "全面から候補を探す", body: "パターン、ブランクス、裏面・エッジを走査し、信号差と欠陥候補座標を得る" },
        { label: "03 / COMPARE", title: "基準と比較する", body: "隣接ダイ、設計データ、基準画像、初期検査画像と比較し、差を抽出する" },
        { label: "04 / REVIEW", title: "欠陥を詳しく見る", body: "高倍率画像、複数照明、電子線、材料分析などで形・高さ・種類を確認する" },
        { label: "05 / QUALIFY", title: "転写影響を判断する", body: "露光に近い光学条件やシミュレーションで、ウェーハ像へ影響する可能性を評価する" },
        { label: "06 / DISPOSITION", title: "修正・洗浄・使用を決める", body: "修正・洗浄後に再検査し、出荷、受入れ、継続使用、再製作などの判断へつなぐ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置・機能",
      rightLabel: "主な役割",
      rows: [
        { left: "欠陥検査装置", right: "広いマスク面を走査し、異物・パターン異常・材料欠陥などの候補座標を高速に抽出する" },
        { left: "欠陥レビュー装置", right: "候補位置を再観察し、実欠陥か誤検出か、形状・高さ・材料・発生工程を詳しく見る" },
        { left: "CD・位置計測装置", right: "線幅、穴、パターン位置、倍率、回転、直交度、面内分布を数値化する" },
        { left: "転写影響判定装置", right: "露光装置に近い照明・結像条件で、欠陥や修正部がウェーハへ転写される可能性を評価する" },
        { left: "マスク修正装置", right: "余分な材料の除去や不足部の形成、粒子除去などを行い、修正後の形状を確認する" },
        { left: "解析・判定ソフトウェア", right: "検査画像、欠陥座標、設計、計測、修正履歴を統合し、分類・優先度・再発傾向を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "targets",
      heading: "ブランクス・パターン・裏面・エッジで、探す欠陥が違う",
      lead: "フォトマスクの中央パターン面だけが検査対象ではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "検査対象",
          rightLabel: "主な欠陥と目的",
          rows: [
            { left: "基板・マスクブランクス", right: "粒子、ピット、突起、傷、膜欠陥、EUV多層膜下の欠陥などを、回路描画前に検出する" },
            { left: "描画・加工後パターン", right: "余分・不足パターン、欠け、ブリッジ、ピンホール、寸法・位置異常、残留物、異物を検出する" },
            { left: "裏面", right: "粒子、傷、汚染など、ステージ保持、焦点、搬送、チャック清浄度へ影響する異常を確認する" },
            { left: "エッジ・ベベル・側面", right: "中央面外の粒子、欠け、付着物、工程変動を確認し、搬送中の持込み・落下リスクを抑える" },
            { left: "ペリクル装着前後", right: "装着前のマスク清浄度、膜・フレーム・接着部、装着後・使用後の異物や変化を用途に応じて確認する" },
            { left: "使用中レチクル", right: "受入れ時、洗浄後、一定使用後などに進行性の汚染・欠陥を再確認し、継続使用を判断する" },
          ],
        },
        {
          type: "note",
          title: "ブランクス欠陥とパターン欠陥を分ける",
          body: "描画前からある基板・膜欠陥と、描画・現像・加工・洗浄・搬送で生じた欠陥では、原因工程と対処が異なります。検査座標を工程履歴へ結び付けます。",
        },
      ],
      paragraphs: [
        "レーザーテックは、EUVマスクブランクス、パターン付きEUV・DUVマスク、裏面、エッジなど複数の検査領域を公式に案内しています。MZ100は中央パターン面ではなく、サイド面とベベルを含むエッジ領域を対象にします。",
        "KLAもレチクル製造領域を、ブランクス、パターン付き光学・EUVレチクル、チップメーカーでの受入れ・再適格化へ分けています。対象物と検査時点を固定して装置を比較します。",
      ],
    },
    {
      id: "comparison-methods",
      heading: "Die-to-DieとDie-to-Databaseで、比較する基準が違う",
      lead: "マスク画像だけを見ても、設計どおりかを判断する基準が必要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較・検査方式",
          rightLabel: "仕組みと確認事項",
          rows: [
            { left: "Die-to-Die", right: "同じマスク上の繰り返しダイ画像を比較する。一方にだけある差を見つけやすいが、全ダイに共通する異常は別手段が必要" },
            { left: "Die-to-Database", right: "検査画像と設計データから生成した基準画像を比較する。繰り返しのない領域にも使えるが、高精度なモデル・位置合わせ・計算が必要" },
            { left: "Mask-to-Mask・基準画像比較", right: "初期状態や別時点の画像と比較し、ウェーハファブで使用中に増えた異物・変化を探す" },
            { left: "透過・反射検査", right: "マスクを透過または反射した光の差を見る。透明・遮光・位相・EUV反射構造に応じて信号と欠陥感度が変わる" },
            { left: "明視野・暗視野", right: "直接光を含む像または散乱光を中心に取得し、パターン差・粒子・傷など目的に応じた検出を行う" },
            { left: "転写像・シミュレーション", right: "欠陥の見えやすさではなく、露光条件でウェーハ像へ与える影響を計算・観察して優先度を決める" },
          ],
        },
      ],
      paragraphs: [
        "同じ欠陥でも、照明、偏光、焦点、検出器、画素、比較アルゴリズムで信号が変わります。複数モードを使い、検出感度と誤検出、検査時間を調整します。",
        "設計データとの比較では、OPC・ILTで作られた複雑な形状を正しく基準画像へ変換する必要があります。装置は光学だけでなく、高速画像処理・データ処理・位置合わせを含むシステムです。",
      ],
    },
    {
      id: "euv",
      heading: "EUVマスクは、反射多層膜と位相欠陥を考えて検査する",
      lead: "DUV用の透過型マスクと、EUV用の反射型マスクでは欠陥の見え方が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "EUV検査の論点",
          rightLabel: "なぜ重要か",
          rows: [
            { left: "アクティニック検査", right: "露光と同じ13.5nm付近のEUV光で検査し、EUV特有の反射・位相と転写性に近い信号を見る" },
            { left: "多層膜・位相欠陥", right: "基板の凹凸や多層膜内部の異常が表面形状・反射位相を変え、通常の表面観察だけでは判断しにくい" },
            { left: "吸収体パターン", right: "余分・不足、寸法、側壁、エッジ、残留物などがEUV反射像とウェーハ転写へ影響する" },
            { left: "裏面・エッジ", right: "静電チャック、搬送、焦点、清浄度へ影響するため、パターン面以外も独立して管理する" },
            { left: "ペリクル・容器", right: "薄膜・フレーム、Dual Podなどの搬送容器、装着・脱着を含む清浄度と検査可否を確認する" },
            { left: "High-NA対応", right: "斜め入射、マスク三次元効果、縮小率・照明条件などの変化を、検査・転写影響判定へ反映する" },
          ],
        },
        {
          type: "note",
          title: "DUV検査で見えることと、EUVで転写されることは同じではない",
          body: "短波長DUVは高感度な量産検査に使われますが、EUV多層膜の位相欠陥などは露光波長に近いアクティニック検査・転写影響判定が重要です。複数方式を役割分担させます。",
        },
      ],
      paragraphs: [
        "レーザーテックは、EUV光でパターン付きマスクを検査するACTIS、DUV光を使うMATRICS、ブランクス検査、裏面・エッジ関連装置を公式に示しています。",
        "ZEISS AIMS EUVは欠陥を全面から高速探索する装置というより、スキャナー相当条件で欠陥レビュー、転写影響、修正結果を確認するマスク適格性評価の役割です。",
      ],
    },
    {
      id: "quality",
      heading: "感度・誤検出・速度・座標精度・清浄度を一体で管理する",
      lead: "最小検出欠陥の数字だけでは、量産検査の実力を判断できません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SENSITIVITY", title: "検出感度", body: "対象欠陥の大きさ、形、高さ、材料、位置、光学条件に対する信号を確保します。" },
            { label: "NUISANCE", title: "誤検出・不要候補", body: "実際の品質判断へ不要な信号を抑え、レビュー件数と見逃しリスクを両立します。" },
            { label: "THROUGHPUT", title: "検査時間", body: "面積、画素、モード、繰返し、データ処理を含む一枚の検査時間と装置稼働を管理します。" },
            { label: "COORDINATE", title: "座標・再現性", body: "検出位置をレビュー・修正・再検査装置へ正確に渡し、同じ欠陥へ戻れるようにします。" },
            { label: "PRINTABILITY", title: "転写影響", body: "検出信号の強さだけでなく、露光像とウェーハ上のCD・形状へ影響するかを判断します。" },
            { label: "CLEANLINESS", title: "搬送・清浄度", body: "検査装置自身、保持、容器、空気・真空、搬送から新たな粒子・傷を作らないよう管理します。" },
          ],
        },
        {
          type: "note",
          title: "欠陥ゼロという表現には検出条件が必要",
          body: "装置の検出限界、検査モード、対象領域、欠陥種類、閾値より下にあることと、転写影響がないことは同じではありません。検査条件と判定基準を保持します。",
        },
      ],
      paragraphs: [
        "感度を上げると、微小な工程変動やパターン差も候補になり、誤検出・レビュー負荷が増える場合があります。設計、欠陥分類、転写シミュレーション、過去履歴を使って候補を絞ります。",
        "フォトマスクは同じ欠陥を多数のダイへ繰り返し転写する可能性があります。一方、検査・レビュー・修正が長すぎるとマスク納期へ影響するため、品質リスクとサイクルタイムを同時に管理します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "フォトマスク検査・適格性評価の代表企業4社",
      lead: "検出、計測、転写影響判定、修正を工程へ置いて企業を見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "レーザーテック｜日本", right: "EUVマスクブランクス、パターン付きEUV・DUVマスク、裏面・エッジなどの検査・計測。DUV方式とアクティニックEUV方式を展開" },
            { left: "KLA｜米国", right: "ブランクス、パターン付き光学・EUVレチクルの欠陥検査、チップメーカーでの受入れ・再適格化、パターン位置計測、解析・判定ソフトウェア" },
            { left: "ニューフレアテクノロジー｜日本", right: "短波長レーザーを用いるNPIシリーズなど、電子ビーム描画・製造後の6インチフォトマスクを高速検査する光学マスク検査装置" },
            { left: "ZEISS｜ドイツ", right: "AIMSによるDUV・EUVマスクの欠陥レビュー・転写影響判定・修正確認、MeRiTによる電子線ベースのマスク修正、粒子除去など" },
          ],
        },
        {
          type: "note",
          title: "4社を同じ装置だけの競合として並べない",
          body: "全面欠陥検査、位置計測、スキャナー相当の転写影響判定、電子線修正では装置の目的が異なります。各社の公式製品を同じ検査工程へ置いた代表例であり、市場順位ではありません。",
        },
      ],
      paragraphs: [
        "レーザーテックは応用光学を基盤に複数のマスク面・EUV工程、KLAは欠陥検査・位置計測・データ解析、ニューフレアテクノロジーはマスク描画と光学検査、ZEISSは適格性評価と修正を公式に示しています。",
        "企業研究では『マスク検査関連』を、探索、レビュー、CD・位置計測、転写影響判定、修正・粒子除去、解析ソフトウェアのどこかへ分けます。",
      ],
    },
    {
      id: "comparison",
      heading: "フォトマスク検査装置メーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、対象物・検査目的・量産運用の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象物・工程", right: "基板、DUV・EUVブランクス、描画後パターン、裏面、エッジ、ペリクル前後、受入れ・使用後など" },
            { left: "2. 検査・計測目的", right: "全面探索、欠陥レビュー、CD・位置、転写影響、修正確認、汚染監視、工程モニターのどれか" },
            { left: "3. 原理・比較方式", right: "DUV・EUV・電子線、透過・反射、明視野・暗視野、Die-to-Die、Die-to-Database、基準画像比較" },
            { left: "4. 感度・分類", right: "対象欠陥、検出限界、捕捉率、誤検出、閾値、分類、位相・材料・高さへの感度、再現性" },
            { left: "5. 精度・転写性", right: "欠陥座標、CD、位置、装置間座標相関、スキャナー相当条件、ウェーハ像への影響判定" },
            { left: "6. 速度・自動化", right: "全面検査時間、ロード、レシピ、再検査、レビュー件数、稼働率、容器・OHT、無人運転" },
            { left: "7. 清浄・材料適合", right: "マスクサイズ・構造、表裏保持、真空、静電気、ペリクル・容器、発塵、傷、装置自身の清浄度" },
            { left: "8. データ・量産支援", right: "設計・描画・修正との連携、履歴、判定自動化、MES、保守拠点、部品、校正、装置間整合、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "まず全面検査と転写影響判定を分けてください。高速に欠陥候補を探す装置と、一つの欠陥をスキャナー相当条件で詳しく評価する装置では、処理能力と測定目的が異なります。",
        "次にDUVとEUV、ブランクスとパターン、マスクショップとウェーハファブを分けます。同じ装置名でも出荷検査、受入れ検査、使用中の再適格化で必要な感度・速度・自動化が変わります。",
      ],
    },
    {
      id: "jobs",
      heading: "マスク検査装置の仕事は、光学・精密機械・画像処理・プロセスをつなぐ",
      lead: "欠陥信号を、量産で使える判断データへ変える仕事です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OPTICS", title: "光源・光学", body: "DUV・EUV光源、照明、偏光、結像、検出器、干渉・散乱、光学校正を設計します。" },
            { label: "MECHANICS", title: "精密機械・搬送", body: "マスク保持、ステージ、干渉計、真空、温調、除振、容器・ローダを設計・評価します。" },
            { label: "ALGORITHM", title: "画像・アルゴリズム", body: "位置合わせ、基準画像生成、差分検出、ノイズ低減、分類、転写シミュレーションを作ります。" },
            { label: "SOFTWARE", title: "制御・データ", body: "装置制御、GUI、レシピ、設計データ、欠陥マップ、装置間座標、MES・解析基盤をつなぎます。" },
            { label: "PROCESS", title: "プロセス・アプリ", body: "マスク構造、欠陥種類、検査モード、閾値、転写影響、修正・洗浄との相関を評価します。" },
            { label: "METROLOGY", title: "計測・校正", body: "感度、座標、CD・位置、再現性、標準試料、装置間差を測り、性能を維持します。" },
            { label: "QUALITY", title: "製造・品質", body: "組立、調整、出荷試験、部品・供給者、清浄度、変更、信頼性、トレーサビリティを管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、立上げ、保守、故障解析、校正、感度・稼働改善、顧客教育を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、ブランクス・DUV・EUV・ウェーハファブ向けのどこか、検査・計測・修正のどこか、装置開発・生産・顧客支援のどこを担当するかを確認します。",
        "半導体検査、顕微鏡、光学、真空、精密位置決め、画像処理、機械学習、大規模データ、レジスト・微細加工、計測、品質、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体フォトマスク検査装置でよくある質問",
      lead: "検査対象、比較方式、EUV、レビュー・修正の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "フォトマスク検査装置とは何ですか？", answer: "マスクブランクスや描画・加工後のフォトマスクを走査し、粒子、傷、膜・パターン異常などの欠陥候補を検出して座標を出す装置です。" },
            { question: "主なフォトマスク検査装置メーカーは？", answer: "この記事ではレーザーテック、KLA、ニューフレアテクノロジーを検査・計測の代表例、ZEISSを転写影響判定・修正の関連企業として紹介しています。網羅的な市場順位ではありません。" },
            { question: "Die-to-Die検査とは何ですか？", answer: "同じマスク上に繰り返し配置されたダイ同士の画像を比較し、一方にだけある差を欠陥候補として抽出する方式です。" },
            { question: "Die-to-Database検査とは何ですか？", answer: "実際の検査画像と、設計データから生成した基準画像を比較する方式です。繰り返しのない領域も検査できますが、高精度なモデルと位置合わせが必要です。" },
            { question: "アクティニックEUV検査とは何ですか？", answer: "EUV露光と同じ13.5nm付近の光を使う検査・評価です。EUV多層膜の位相欠陥など、露光時の反射・転写に近い状態を確認します。" },
            { question: "検査で見つかった欠陥はすべて修正しますか？", answer: "すべてではありません。実欠陥か、ウェーハへ転写されるか、修正リスク、位置、用途を評価し、使用、洗浄、修正、再製作などを判断します。" },
            { question: "マスク検査とAIMSの違いは？", answer: "一般的なマスク検査は全面から欠陥候補を高速探索します。AIMSは候補欠陥や修正部をスキャナー相当の光学条件で観察し、転写影響を詳しく評価します。" },
            { question: "ペリクルを付ければマスク再検査は不要ですか？", answer: "不要にはなりません。ペリクルはパターン面への異物付着を抑えますが、装着前確認、容器・搬送、使用中の汚染、裏面・エッジ、膜・フレームなどの管理が残ります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象物・検査目的・原理・転写影響をそろえて見る",
      lead: "フォトマスク検査は、欠陥候補を量産判断へ変える工程です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "TARGET", title: "検査面を分ける", body: "ブランクス、パターン、裏面、エッジ、ペリクル前後、使用中を区別する" },
            { label: "DETECT", title: "比較方式を選ぶ", body: "Die-to-Die、設計データ、基準画像、透過・反射・散乱を使い分ける" },
            { label: "EUV", title: "露光波長を考える", body: "DUV高速検査とEUVアクティニック検査・適格性評価を役割分担する" },
            { label: "DECIDE", title: "判断までつなぐ", body: "レビュー、計測、転写影響、修正・洗浄、再検査、履歴管理を組み合わせる" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "検査・修正を経て完成原版へ仕上げる企業を見る" },
            { label: "フォトマスク描画装置メーカー", href: "/guides/semiconductor-photomask-writer-manufacturers", description: "検査前に設計データをレジストへ描く装置と方式を見る" },
            { label: "マスクブランクスメーカー", href: "/guides/semiconductor-mask-blank-manufacturers", description: "描画前に基板・膜欠陥を管理する母材と企業を見る" },
            { label: "ペリクルメーカー", href: "/guides/semiconductor-pellicle-manufacturers", description: "完成マスクを異物から守る膜・フレーム・装着を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "ウェーハ・マスク・パッケージを含む検査装置の全体像を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・CD・位置と工程フィードバックの基本を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "マスク像をウェーハへ転写するEUV・DUV装置を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "設計・マスク・ウェーハ加工・組立・検査の全体像を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの検査用途を選び、対象物・工程、検査目的、原理・比較方式、感度・分類、精度・転写性、速度・自動化、清浄・材料適合、データ・量産支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "レーザーテック・KLA・ニューフレアテクノロジー・ZEISSから1社を選び、公式製品を対象物・検査目的・原理・感度・転写影響・量産支援の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-photomask-manufacturers",
    "semiconductor-photomask-writer-manufacturers",
    "semiconductor-mask-blank-manufacturers",
    "semiconductor-pellicle-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-lithography-equipment-manufacturers",
    "photolithography-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "quality-engineer-route",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["kla", "lasertec"],
};
