import type { GuideArticle } from "@/content/guides/types";

export const semiconductorWaferGeometryMetrologyManufacturersGuide: GuideArticle = {
  slug: "semiconductor-wafer-geometry-metrology-manufacturers",
  title: "半導体ウェーハ形状・平坦度測定装置メーカーとは？KLA・Corning Tropelを初心者向けに図解",
  description:
    "半導体ウェーハの平坦度・厚さ・TTV・Bow・Warp・エッジ形状を測る装置について、測定原理、用語の違い、工程での使い方、KLA・Corning Tropelの製品領域、比較軸を図解します。",
  targetQuery: "半導体 ウェーハ 平坦度 測定装置 メーカー",
  searchIntent:
    "ウェーハ形状・平坦度測定装置が何を測るのか、TTV・Bow・Warp・サイト平坦度・エッジ形状の違い、干渉計などの原理、KLA・Corning Tropelなどの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "KLAとCorning Tropelの公式製品・技術情報をもとに、ウェーハを搬送する、表裏面または基準面を測る、形状量へ変換する、規格・工程別に判定する、露光・研磨・接合などへ結果を返す流れへ整理しました。異なる測定原理・ウェーハ材質・保持条件の仕様値を単純比較せず、測定対象と基準面を先にそろえます。",
  showCareerCtas: false,
  experienceBasis: [
    "シリコンウェーハ製造、CMP、膜厚、重ね合わせの記事を公開したうえで、基板そのものの形状を測る装置を独立させる必要があると判断",
    "KLAで裸ウェーハの平坦度・形状・エッジロールオフ・ナノトポグラフィと、パターン付きウェーハ形状計測の領域を確認",
    "Corning Tropelで非接触干渉計による厚さ・TTV・Bow・Warp・SORI・サイト平坦度と、多材料・多サイズ対応の領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Tropel Wafer Analysis Systems",
      url: "https://www.corning.com/worldwide/en/products/advanced-optics/product-materials/analytic-instruments/metrology-instruments/tropel-wafer-analysis-systems.html",
      publisher: "Corning Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "Tropel FlatMaster SAW System",
      url: "https://www.corning.com/emea/en/products/advanced-optics/product-materials/analytic-instruments/metrology-instruments/tropel-flatmaster-saw-system.html",
      publisher: "Corning Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "Corning Semiconductor Solutions",
      url: "https://www.corning.com/worldwide/en/products/advanced-optics/product-materials/Semiconductor-Solutions.html",
      publisher: "Corning Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA-Tencor Introduces Complete Measurement Solution for Critical Wafer Geometry Metrology Requirements",
      url: "https://ir.kla.com/news-events/press-releases/detail/350/kla-tencor-introduces-complete-measurement-solution-for",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "KLA-Tencor Introduces Key Systems for 5D Patterning Control",
      url: "https://ir.kla.com/news-events/press-releases/detail/157/kla-tencor-introduces-key-systems-for-5d-patterning",
      publisher: "KLA Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "ウェーハの平坦度を調べると、TTV・Bow・Warp・SORI・サイト平坦度・ナノトポグラフィなど似た用語が並び、膜厚測定や表面粗さ測定との違いも分かりにくくありませんか。",
    conclusion:
      "ウェーハ形状測定装置は、ウェーハ全体と局所領域の高さ・厚さ・反り・エッジ形状を非接触で測り、基板受入、研削・研磨、露光、成膜応力、接合などの工程判断へ使う装置です。比較では、対象ウェーハ、測定量、基準面・保持条件、測定原理、全面・局所・エッジ、処理能力、再現性、データ連携をそろえます。",
    learnings:
      "厚さと形状の違い、TTV・Bow・Warp・サイト平坦度、干渉計の考え方、自由状態と保持状態、エッジ・ナノトポグラフィ、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私はウェーハ形状計測を、『基板が何μm厚いか』だけでなく、『装置に置いたとき、回路を作る面がどのように見えるか』を確認する工程として整理します。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜ウェーハを測り、形状マップを工程へ返す",
      description: "代表的な非接触形状計測を単純化した流れです。原理、保持、走査方法、出力は装置で異なります。",
      stages: [
        { label: "01 / LOAD", title: "ウェーハを搬送する", body: "カセット・FOUPから取り出し、材質・径・向き・IDを確認する" },
        { label: "02 / REFERENCE", title: "基準面を決める", body: "自由状態、支持点、チャック、表面基準、裏面基準など測定条件を定義する" },
        { label: "03 / MEASURE", title: "表裏面・高さを測る", body: "干渉計や変位センサで全面・局所・エッジの高さ情報を取得する" },
        { label: "04 / CALCULATE", title: "形状量へ変換する", body: "厚さ、TTV、Bow、Warp、サイト平坦度、エッジロールオフなどを算出する" },
        { label: "05 / JUDGE", title: "規格・工程で判定する", body: "除外領域、サイトサイズ、基準面、統計条件をそろえて合否・傾向を見る" },
        { label: "06 / FEEDBACK", title: "前後工程へ返す", body: "スライス、研削、研磨、成膜、露光、接合、搬送条件の改善へつなぐ" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "代表的な測定量",
      rightLabel: "初心者向けの意味",
      rows: [
        { left: "Thickness", right: "表面と裏面の距離。ウェーハの絶対厚さ" },
        { left: "TTV", right: "ウェーハ内で最も厚い場所と薄い場所の差。厚さの面内ばらつき" },
        { left: "Bow", right: "基準面に対し、中心付近がどちら側へどれだけずれているかを表す反りの指標" },
        { left: "Warp", right: "ウェーハ全体の最高点と最低点の差に近い、総合的な形状変形の指標" },
        { left: "Site flatness", right: "露光フィールドやダイに相当する局所領域で、表面がどれだけ平らか" },
        { left: "Edge roll-off", right: "外周付近で厚さ・高さが急に変わる形状。エッジ除外領域と合わせて見る" },
      ],
    },
  ],
  sections: [
    {
      id: "role",
      heading: "ウェーハ形状計測は、膜の厚さではなく基板の面を管理する",
      lead: "何を基準に、どのスケールで測るかを分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "計測分野",
          rightLabel: "主な対象と問い",
          rows: [
            { left: "ウェーハ形状・平坦度", right: "基板全体・局所・エッジの高さ、厚さ、反りは規格と工程要求を満たすか" },
            { left: "薄膜・光学計測", right: "表面に形成した膜の厚さ、光学定数、積層構造、CDはどうなっているか" },
            { left: "表面粗さ・ナノトポグラフィ", right: "平坦度より短い空間波長の微小な凹凸がどの程度あるか" },
            { left: "重ね合わせ計測", right: "上下層のパターン位置がどれだけずれているか" },
            { left: "欠陥検査", right: "粒子、傷、結晶・パターン異常がどこにあるか" },
          ],
        },
      ],
      paragraphs: [
        "同じ高さ情報でも、ウェーハ全体の反り、露光サイト内の平坦度、エッジ近傍の変化、微小な表面うねりでは空間スケールと工程影響が異なります。",
        "Corning Tropelは厚さ、TTV、Bow、Warp、SORI、SEMI規格パラメータを、KLAは裸ウェーハの平坦度・形状・エッジロールオフ・ナノトポグラフィなどを公式に示しています。",
      ],
    },
    {
      id: "principle",
      heading: "干渉計は、光の位相差から面の高さを読み取る",
      lead: "非接触で全面形状を取得できる一方、表面状態と基準条件が重要です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "INTERFERENCE", title: "光を重ねる", body: "基準光とウェーハから戻る光を重ね、光路差による干渉模様を作ります。" },
            { label: "PHASE", title: "位相を解析する", body: "縞の位置や位相変化を解析し、各点の相対的な高さへ変換します。" },
            { label: "MAP", title: "全面マップにする", body: "高さ・表裏面情報から、厚さ、反り、局所平坦度などを計算します。" },
          ],
        },
        {
          type: "note",
          title: "保持方法が変われば、見える形も変わる",
          body: "自由状態のウェーハと、チャックへ吸着したウェーハでは重力・支持・吸着の影響が異なります。測定値には基準面、支持点、除外領域、フィルタ条件を添えます。",
        },
      ],
      paragraphs: [
        "Corning Tropelは斜入射干渉や周波数ステッピング干渉を製品群で使い、非接触で全面形状と厚さ情報を取得する構成を示しています。",
        "透明・半透明材料、粗い加工面、パターン付き面では反射・透過・散乱が変わります。材質と表面仕上げに合う光学構成・解析方法を確認します。",
      ],
    },
    {
      id: "process",
      heading: "形状データは、ウェーハ製造から露光・成膜・接合まで使われる",
      lead: "同じ装置でも工程ごとに見る指標が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・用途",
          rightLabel: "主な確認事項",
          rows: [
            { left: "スライス・研削・研磨", right: "厚さ、TTV、全体形状、局所平坦度、加工起因のうねりを工程条件へ返す" },
            { left: "ウェーハ出荷・受入", right: "供給側と使用側で規格、測定条件、装置間差をそろえ、ロット傾向を確認する" },
            { left: "露光", right: "サイト平坦度、ナノトポグラフィ、エッジ形状が焦点・重ね合わせの余裕へ与える影響を見る" },
            { left: "成膜・熱処理", right: "処理前後の曲率・反り変化から膜応力や熱履歴の影響を監視する" },
            { left: "薄化・接合・先端実装", right: "薄いウェーハ、支持基板、接合前後の厚さ・反り・全面形状を管理する" },
            { left: "搬送・装置適合", right: "反りやエッジ形状がチャック、搬送、位置合わせ、接触へ与える影響を確認する" },
          ],
        },
      ],
      paragraphs: [
        "KLAはWaferSight 2をウェーハ供給側の形状管理とデバイスメーカーの受入管理に使う考え方を示し、パターン付きウェーハ形状をパターニング制御へ接続する製品も発表しています。",
        "形状値だけで原因は決まりません。加工条件、膜応力、熱履歴、保持、測定環境、材料の弾性特性と組み合わせて判断します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体ウェーハ形状・平坦度測定装置の代表企業",
      lead: "裸ウェーハ、パターン付きウェーハ、研究・品質管理で製品の位置付けが異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "KLA｜米国", right: "WaferSight系で裸ウェーハの平坦度、形状、エッジロールオフ、ナノトポグラフィなどを扱い、パターン付きウェーハ形状計測も展開" },
            { left: "Corning Tropel｜米国", right: "斜入射・周波数ステッピング干渉を使うウェーハ分析装置で、厚さ、TTV、Bow、Warp、SORI、サイト平坦度、多材料・多サイズを展開" },
          ],
        },
        {
          type: "note",
          title: "企業数より、測定対象の境界を明確にする",
          body: "ウェーハ形状専用機、汎用表面形状計、研磨工程内計測、パターン付きウェーハ形状計測は用途が異なります。この記事では公式に半導体ウェーハ形状を示す代表例を扱います。",
        },
      ],
      paragraphs: [
        "KLAはプロセス制御全体との接続、Corning Tropelは干渉計を核にした基板・精密面計測が見えやすい企業です。",
        "市場順位や一律の精度順位は扱いません。測定するウェーハ、保持、表面、サイト、除外領域、処理能力をそろえて評価します。",
      ],
    },
    {
      id: "comparison",
      heading: "メーカー比較は、8つの条件をそろえる",
      lead: "カタログの最小値より、工程で同じ判断を続けられるかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象ウェーハ", right: "径、厚さ、Si・SiC・GaAs・サファイア・ガラス、裸・パターン付き、表面仕上げ" },
            { left: "2. 測定量", right: "厚さ、TTV、Bow、Warp、SORI、サイト平坦度、ナノトポグラフィ、エッジ形状、応力" },
            { left: "3. 基準・保持", right: "自由状態、支持、チャック、表面・裏面基準、重力補正、エッジ除外、サイト定義" },
            { left: "4. 測定原理", right: "干渉方式、表裏面測定、粗面・透明材料への対応、接触有無、校正・トレーサビリティ" },
            { left: "5. 性能", right: "再現性、装置間整合、空間分解、測定範囲、欠測、環境感度を実試料で確認" },
            { left: "6. 量産性", right: "カセット・FOUP搬送、ID読取、レシピ切替、測定時間、稼働率、保守性" },
            { left: "7. データ", right: "形状マップ、統計、規格判定、トレンド、SECS/GEM・MES・解析基盤への接続" },
            { left: "8. 支援", right: "アプリケーション開発、標準試料、校正、装置間相関、拠点、部品、長期保守" },
          ],
        },
      ],
      paragraphs: [
        "最初に、工程判断で必要な測定量と基準面を固定します。TTVとWarp、自由状態とチャック状態を同じ数値として比較しません。",
        "次に、既知形状の標準だけでなく実際の材質・表面・反り範囲を持つウェーハで、繰返し、装置間、搬送込みの再現性を確認します。",
      ],
    },
    {
      id: "jobs",
      heading: "関連する仕事は、光学・精密機械・形状解析・工程応用をつなぐ",
      lead: "測定原理と工程要求の両方を理解する職種があります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OPTICS", title: "光学設計", body: "光源、干渉計、撮像、反射・透過、迷光、位相解析を設計します。" },
            { label: "MECHANICS", title: "精密機械・搬送", body: "支持、チャック、ステージ、除振、温調、ウェーハ搬送を設計します。" },
            { label: "ALGORITHM", title: "形状解析", body: "高さ復元、基準面、フィルタ、サイト計算、エッジ解析、異常判定を実装します。" },
            { label: "APPLICATION", title: "プロセス・アプリ", body: "研磨、露光、成膜、接合に合う測定レシピと相関評価を作ります。" },
            { label: "QUALITY", title: "計測・品質保証", body: "標準、校正、GR&R、装置間整合、変更管理、規格判定を管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、光学調整、搬送調整、校正、故障解析、量産復旧を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "光学、画像処理、精密位置決め、計測、研磨、生産技術、品質保証、統計解析の経験を接続しやすい領域です。",
        "求人では、裸ウェーハ・パターン付き・先端実装のどこを対象にし、装置本体、アルゴリズム、工程応用、顧客支援のどこを担当するか確認します。",
      ],
    },
    {
      id: "faq",
      heading: "ウェーハ形状・平坦度測定でよくある質問",
      lead: "似た用語と装置の違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "TTVとは何ですか？", answer: "Total Thickness Variationの略で、定義した測定領域における最大厚さと最小厚さの差です。ウェーハが全体として反っているかとは別の指標です。" },
            { question: "BowとWarpの違いは？", answer: "Bowは基準面に対する中心付近のずれ、Warpはウェーハ全体の形状変化幅を表す考え方です。規格・装置で定義条件を確認します。" },
            { question: "膜厚測定装置との違いは？", answer: "膜厚測定は表面の薄膜・積層を主対象にします。ウェーハ形状計測は基板の表裏面、厚さ、反り、局所平坦度を主対象にします。" },
            { question: "なぜ非接触測定が使われますか？", answer: "表面を傷付けず、広い面の高さを高速に取得しやすいためです。ただし反射率、透明性、粗さなど光学特性の影響を確認します。" },
            { question: "主なメーカーは？", answer: "この記事ではKLAとCorning Tropelを代表例として紹介しています。対象ウェーハと測定量、基準・保持、原理、量産搬送をそろえて比較します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜形状の名前より、基準面と工程の問いを先に決める",
      lead: "ウェーハ形状計測は、基板の面を工程で再現可能なデータへ変える装置です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "TARGET", title: "対象を決める", body: "裸・パターン付き、材質、径、表面、工程を固定する" },
            { label: "DATUM", title: "基準を決める", body: "自由・保持、表面・裏面、除外領域、サイトを明示する" },
            { label: "METRIC", title: "測定量を分ける", body: "厚さ、TTV、Bow、Warp、局所、エッジを混ぜない" },
            { label: "ACTION", title: "工程へ返す", body: "研磨、露光、成膜、接合、搬送の判断へつなぐ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "シリコンウェーハ製造", href: "/guides/semiconductor-silicon-wafer-manufacturing", description: "形状を作り込む単結晶・スライス・研磨工程を見る" },
            { label: "シリコンウェーハメーカー", href: "/guides/semiconductor-silicon-wafer-manufacturers", description: "ウェーハ供給企業と製品領域を見る" },
            { label: "CMP・平坦化", href: "/guides/semiconductor-cmp-process", description: "回路形成中の表面平坦化との違いを見る" },
            { label: "膜厚・光学計測装置メーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "薄膜・OCDを測る光学装置との役割差を見る" },
            { label: "重ね合わせ計測装置メーカー", href: "/guides/semiconductor-overlay-metrology-manufacturers", description: "平坦度が露光・重ね合わせへ関わる位置を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "形状・膜・CD・欠陥を含む装置地図を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象ウェーハ、測定量、基準・保持、原理、性能、量産性、データ、支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "KLAまたはCorning Tropelの公式製品を一つ選び、対象ウェーハ・測定量・基準面・保持方法・測定原理・出力マップの6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-equipment-components-subfab",
    "semiconductor-silicon-wafer-manufacturing",
    "semiconductor-silicon-wafer-manufacturers",
    "semiconductor-cmp-process",
    "semiconductor-thin-film-optical-metrology-manufacturers",
    "semiconductor-overlay-metrology-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-manufacturing-process",
  ],
  relatedCompanyIds: ["kla"],
};
