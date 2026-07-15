import type { GuideArticle } from "@/content/guides/types";

export const semiconductorInterconnectProcessGuide: GuideArticle = {
  slug: "semiconductor-interconnect-process",
  title: "半導体の配線形成とは？銅配線・ビア・ダマシン工程を初心者向けに図解",
  description:
    "半導体の配線形成を初心者向けに図解。トランジスタを金属配線とビアでつなぐ目的、絶縁膜形成・溝と孔の加工・バリア／ライナー・導体充填・CMPの流れ、アルミ系配線との違い、RC遅延や代表的な不良を整理します。",
  targetQuery: "半導体 配線形成 工程",
  searchIntent:
    "半導体チップのトランジスタを金属配線とビアでどう接続するのか、銅ダマシン工程、絶縁膜、バリア、CMP、配線不良を図で理解したい",
  status: "draft",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Applied Materials、Lam Research、IBM、imecの公式技術情報をもとに、代表的なロジック半導体のオンチップ配線形成を整理しています。配線材料、層数、膜構成、加工順、寸法、装置条件は製品・世代・メーカーで異なるため、特定製品のプロセス条件としては記載していません。",
  showCareerCtas: false,
  experienceBasis: [
    "Applied Materialsの公式情報で、配線の役割、低抵抗導体、低誘電率絶縁膜、バリア・ライナー、導体充填の基本を確認",
    "IBMの公式技術史・研究情報で、銅ダマシンの成立、溝・ビア、拡散防止層、導体埋込み、CMPの流れを確認",
    "Lam Researchとimecの公式情報で、絶縁膜エッチング、BEOL多層配線、RC遅延、微細化時の材料・信頼性課題を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Interconnect",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/markets-and-inflections/advanced-logic/interconnect.html",
      publisher: "Applied Materials, Inc.",
      accessedAt: "2026-07-15",
    },
    {
      title: "ECD",
      url: "https://www.appliedmaterials.com/in/en/semiconductor/products/processes/ecd.html",
      publisher: "Applied Materials, Inc.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Producer Black Diamond PECVD",
      url: "https://www.appliedmaterials.com/us/en/product-library/producer-black-diamond-pecvd.html",
      publisher: "Applied Materials, Inc.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Interconnect Solutions",
      url: "https://www.lamresearch.com/products/our-solutions/interconnect-solutions/",
      publisher: "Lam Research Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Flex Product Family",
      url: "https://www.lamresearch.com/product/flex-product-family/",
      publisher: "Lam Research Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Copper interconnects",
      url: "https://www.ibm.com/history/copper-interconnects",
      publisher: "IBM Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Copper evolution and beyond: Developments in advanced interconnects for future CMOS nodes",
      url: "https://research.ibm.com/blog/beol-cu-interconnects-iedm",
      publisher: "IBM Research",
      accessedAt: "2026-07-15",
    },
    {
      title: "Back end of line: the last stage of chip processing",
      url: "https://www.imec-int.com/en/expertise/cmos-advanced/compute/beol",
      publisher: "imec",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約18分",
  intro: {
    problem:
      "トランジスタの作り方を理解しても、何十億個もの素子をどう回路としてつなぐのか想像しにくくありませんか。『金属膜を配線の形にする』だけでは、絶縁膜、ビア、バリア、導体充填、CMPがなぜ必要なのかも見えません。",
    conclusion:
      "配線形成は、トランジスタの端子を横方向の金属線と上下方向のビアで接続し、信号・電源・接地をチップ全体へ届ける工程です。代表的な銅ダマシンでは、絶縁膜へ配線溝と接続孔を作り、バリア／ライナーを形成して導体を埋め、表面の余分な導体をCMPで除去します。この単位を層ごとに繰り返して多層配線を作ります。",
    learnings:
      "配線とビアの役割、BEOL、銅ダマシンの基本フロー、シングル／デュアルダマシン、サブトラクティブ法との違い、絶縁膜と低k材料、バリア・ライナー、RC遅延、エレクトロマイグレーション、代表的な配線不良、検査・計測、関連職種・企業。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "配線形成は、完成したトランジスタの上に“チップ内の道路網”を作る工程です。金属だけを見るのではなく、線間を隔てる絶縁膜、階層をつなぐビア、界面を守る薄膜まで一つの電気構造として見ると理解しやすくなります。",
      caption: "この記事の見方",
    },
    {
      type: "interconnect-flow",
      title: "図解｜絶縁膜に溝と孔を作り、導体を埋めて平坦化する",
      description:
        "代表的な銅系ダマシン工程を単純化した断面概念図です。実際の膜構成、溝とビアの形成順、洗浄、熱処理、キャップ膜、導体形成方式は製品ごとに異なります。",
      stages: [
        { kind: "dielectric", label: "DIELECTRIC", title: "絶縁膜を形成", body: "下層配線の上へ層間絶縁膜と必要な停止膜・ハードマスクを作る" },
        { kind: "pattern", label: "TRENCH / VIA", title: "溝と接続孔を加工", body: "リソグラフィとエッチングで横配線の溝と下層へ届くビア孔を作る" },
        { kind: "liner", label: "BARRIER / LINER", title: "内壁へ薄膜を形成", body: "導体の拡散を抑え、密着・成長・信頼性を支える連続した薄膜を作る" },
        { kind: "fill", label: "CONDUCTOR FILL", title: "導体を埋める", body: "溝と孔の底から内部を埋め、空隙や継ぎ目を抑えて導通経路を作る" },
        { kind: "cmp", label: "CMP", title: "余分を除去・平坦化", body: "表面の導体を除き、絶縁膜の中に配線とビアだけを残して次層へ渡す" },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "配線形成は、素子を回路へ変える多層接続工程",
      lead: "トランジスタ単体が動いても、入力・演算・記憶・出力・電源をつながなければ製品機能にはなりません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SIGNAL", title: "信号を伝える", body: "トランジスタ間、回路ブロック間、入出力端子まで論理・アナログ信号を運びます。" },
            { label: "POWER", title: "電源と接地を配る", body: "チップ全体へ電流を届け、電圧降下と雑音を抑える網を作ります。" },
            { label: "HIERARCHY", title: "距離ごとに階層化", body: "細かな局所配線から長距離・大電流の上層配線まで、幅・間隔・厚さを使い分けます。" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは、トランジスタを金属コンタクトと銅配線で電気的につなぐ構造をインターコネクトと説明しています。配線層の中では横方向の線が同じ高さの回路を結び、ビアが上下の金属層を結びます。",
        "下層ほど微細で密度の高い局所接続が多く、上層ほど長距離信号、クロック、電源などへ太い配線を使うのが基本です。ただし層数と役割分担は、ロジック、メモリ、アナログ、パワーなどで異なります。",
      ],
    },
    {
      id: "beol",
      heading: "BEOLは、素子の上へコンタクトと多層配線を作る領域",
      lead: "組立・パッケージ工程を指す『後工程』とは、文脈を分けて考えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "区分",
          rightLabel: "主な対象",
          rows: [
            { left: "FEOL", right: "ウェーハ表面へトランジスタなどの素子構造を作る領域" },
            { left: "MOL", right: "トランジスタ端子から最初の配線層へつなぐコンタクト周辺。資料によって区切り方が異なる" },
            { left: "BEOL", right: "層間絶縁膜、金属線、ビアを繰り返し形成し、チップ内の多層配線を作る領域" },
            { left: "組立の後工程", right: "ウェーハテスト後の個片化、パッケージング、最終検査。BEOLとは別の意味で使われる" },
          ],
        },
      ],
      paragraphs: [
        "imecはBEOLを、チップ上部にある複雑な配線を扱う半導体加工の最終段階と説明しています。先端ICでは多数の配線層が積み重なり、各層の線とビアが立体的なネットワークを作ります。",
        "日本語の現場では、ウェーハ加工以降の組立・試験も後工程と呼ばれます。『BEOL』『ウェーハ工程の後半』『組立後工程』のどれを指すか、資料の工程範囲を確認する必要があります。",
      ],
    },
    {
      id: "damascene",
      heading: "銅ダマシンは、先に絶縁膜を彫り、後から導体を埋める",
      lead: "加工しにくい導体を直接削る代わりに、絶縁膜側へ配線形状を作ります。",
      blocks: [
        {
          type: "process-flow",
          title: "銅系ダマシン配線の代表的な工程順",
          description: "キャップ膜、停止膜、ハードマスク、洗浄、熱処理などの詳細工程は省略しています。",
          stages: [
            { label: "01", title: "絶縁膜形成", body: "下層配線を覆い、次の配線を電気的・機械的に支える膜を作る" },
            { label: "02", title: "溝・ビア加工", body: "リソグラフィと絶縁膜エッチングで、線と層間接続の空間を作る" },
            { label: "03", title: "前処理・薄膜形成", body: "底部残留物を除き、バリア／ライナーと必要な成長下地を形成する" },
            { label: "04", title: "導体充填", body: "細い溝と高アスペクト比の孔を、空隙を抑えながら導体で満たす" },
            { label: "05", title: "CMP・次層", body: "表面の余分な導体を除去し、キャップ膜などを形成して次の配線層を重ねる" },
          ],
        },
      ],
      paragraphs: [
        "IBMは銅配線の実用化で、絶縁膜へ配線とビアの形状を作るデュアルダマシン、銅の拡散を抑える層、導体の埋込み、CMPを重要な要素として説明しています。現在も銅ダマシンは代表的なBEOL配線方式です。",
        "導体充填には電気化学堆積（ECD）などが使われます。Applied MaterialsはECDを、微細構造の底部から埋めながら側壁上の成長を抑え、配線内部の空隙を防ぐことが重要な工程と説明しています。",
      ],
    },
    {
      id: "single-dual",
      heading: "シングルダマシンとデュアルダマシンは、線とビアを作る単位が違う",
      lead: "工程回数だけでなく、形状制御、材料ダメージ、歩留まりを含めて選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "構造と特徴",
          rows: [
            { left: "シングルダマシン", right: "配線溝とビアを別々の埋込み・CMP単位で形成する。工程は増えるが、各形状を個別に制御しやすい" },
            { left: "デュアルダマシン", right: "一組の絶縁膜内へ溝とビアを作り、導体充填とCMPをまとめる。代表的な銅多層配線方式" },
            { left: "ビアファースト", right: "先にビア形状を作り、その後に配線溝を重ねる代表的な順序" },
            { left: "トレンチファースト", right: "先に配線溝を定義し、その後にビア孔を形成する代表的な順序" },
            { left: "先進的な派生方式", right: "微細化に応じ、自己整合ビア、セミダマシン、新導体などを組み合わせる研究・量産技術がある" },
          ],
        },
      ],
      paragraphs: [
        "デュアルダマシンでも、ビアと溝を同時に一回で彫るとは限りません。複数回のリソグラフィとエッチングで二つの深さを作り、最後の導体充填とCMPを共通化する考え方です。",
        "一方、アルミニウム系などでは、導体膜を先に形成し、レジストパターンをマスクに金属を除去するサブトラクティブ法も使われます。材料と製品によって、埋込み型と金属加工型を使い分けます。",
      ],
    },
    {
      id: "materials",
      heading: "導体・絶縁膜・バリア／ライナーを一体で設計する",
      lead: "低抵抗な金属だけ選んでも、周囲へ拡散する、密着しない、細孔を埋められないなら配線になりません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "CONDUCTOR", title: "導体", body: "銅、アルミニウム、タングステン、コバルト、ルテニウムなどを、抵抗・寸法・工程適合性で使い分けます。" },
            { label: "DIELECTRIC", title: "層間絶縁膜", body: "配線同士を隔離し、寄生容量、機械強度、熱、吸湿、加工耐性を支配します。" },
            { label: "BARRIER", title: "拡散防止層", body: "導体原子が絶縁膜や素子側へ移動することを抑え、絶縁信頼性を守ります。" },
            { label: "LINER", title: "ライナー・密着層", body: "界面の密着、導体成長、濡れ性、抵抗、空隙形成へ影響する薄膜です。" },
            { label: "CAP", title: "キャップ膜", body: "配線上面からの拡散や酸化を抑え、次工程と信頼性を支えます。" },
            { label: "MASK", title: "停止膜・ハードマスク", body: "エッチング深さ、選択比、CMP停止、パターン形状を制御します。" },
          ],
        },
      ],
      paragraphs: [
        "IBMは、銅がシリコンや周囲材料へ拡散すると電気特性を損なうため、拡散防止層と統合工程が必要だったと説明しています。微細配線では、バリアとライナーが厚いほど導体断面が減るため、拡散防止と線抵抗の両立が難しくなります。",
        "絶縁膜は線間容量を下げるため低k化されますが、一般に空孔を増やすと機械強度、密着、熱伝導、プラズマ・CMP耐性が難しくなります。Applied Materialsも低k材料を、RC遅延低減と構造強度の両立課題として説明しています。",
      ],
    },
    {
      id: "rc",
      heading: "配線性能は、抵抗Rと容量Cの積で遅くなる",
      lead: "トランジスタが速くても、細く長い配線が信号を遅らせ、電力を消費します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "設計・材料要因",
          rightLabel: "主な影響",
          rows: [
            { left: "線幅・厚さを小さくする", right: "導体断面が減り、線抵抗が上がりやすい" },
            { left: "配線間隔を狭くする", right: "隣接線との容量とクロストークが増えやすい" },
            { left: "配線を長くする", right: "抵抗と容量の両方が増え、信号遅延・電圧降下が大きくなる" },
            { left: "低k絶縁膜を使う", right: "線間容量を下げやすいが、加工・機械・熱・信頼性の統合が難しくなる" },
            { left: "上層線を太くする", right: "長距離信号と電源の抵抗を下げやすいが、面積・層構成との調整が必要" },
          ],
        },
      ],
      paragraphs: [
        "imecは、配線ピッチの縮小で導体断面が減り、抵抗と容量の積であるRC遅延がBEOLの主要課題になると説明しています。配線は信号だけでなくクロック、電源、接地も運ぶため、遅延、クロストーク、電圧降下、発熱を同時に考えます。",
        "対策は材料変更だけではありません。配線幅・間隔・厚さ、ビア数、層の割当て、リピータ、電源網、回路配置を、プロセスと設計が共同で最適化します。",
      ],
    },
    {
      id: "quality",
      heading: "代表的な配線不良は、断線・短絡・高抵抗・絶縁劣化",
      lead: "形状、材料、界面、平坦度の小さなずれが、多層を重ねた後の電気不良につながります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "不良・異常",
          rightLabel: "主な見方",
          rows: [
            { left: "オープン", right: "配線切れ、ビア未接続、残留膜、埋込み空隙などで導通しない" },
            { left: "ショート・ブリッジ", right: "隣接配線の間へ導体や残留物がつながり、絶縁できない" },
            { left: "ビア高抵抗", right: "位置ずれ、底部残留物、薄膜・導体の不連続、接触面積不足で抵抗が上がる" },
            { left: "ボイド・シーム", right: "溝・孔の内部に空隙や継ぎ目が残り、抵抗・寿命・熱耐性を悪化させる" },
            { left: "ディッシング・エロージョン", right: "CMPで配線や周囲の絶縁膜が過度に下がり、厚さと次層平坦度が変わる" },
            { left: "低k膜ダメージ", right: "エッチング、レジスト除去、洗浄、CMPで膜質・界面・誘電特性が変わる" },
          ],
        },
      ],
      paragraphs: [
        "微細なビアは、下層配線との重ね合わせずれや底部の残留物へ敏感です。絶縁膜エッチングでは寸法だけでなく、側壁形状、深さ、選択比、低k膜へのダメージを管理します。Lam Researchも、わずかな形状ずれが電気特性へ影響すると説明しています。",
        "CMP後は表面金属残り、スクラッチ、腐食、配線厚さ、段差、洗浄残留物を確認します。一層の異常が次層のリソグラフィ・エッチングへ伝わるため、各層で平坦度を戻す意味があります。",
      ],
    },
    {
      id: "reliability",
      heading: "配線信頼性は、電流・電界・熱・機械応力で変化する",
      lead: "製造直後に導通していても、時間と負荷で抵抗増加や絶縁破壊が起こる可能性があります。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "EM", title: "エレクトロマイグレーション", body: "高い電流密度で金属原子が移動し、空隙・突起・断線・短絡につながる現象です。" },
            { label: "TDDB", title: "経時絶縁破壊", body: "電界と時間によって線間・層間絶縁膜が劣化し、漏れや破壊へ至る現象です。" },
            { label: "STRESS", title: "応力起因の移動・空隙", body: "熱膨張差と膜応力により、配線や界面に空隙・剥離が生じる場合があります。" },
            { label: "THERMAL", title: "自己発熱と熱抵抗", body: "細線・ビアの発熱と低k膜の熱伝導が、局所温度と寿命へ影響します。" },
          ],
        },
      ],
      paragraphs: [
        "配線信頼性は単純な材料順位では決まりません。導体断面、ビア構造、界面、キャップ膜、温度、電流方向、配線長、周囲の絶縁膜を含む統合構造で評価します。",
        "製品設計段階では許容電流密度、ビア冗長化、線間電界などの設計ルールへ落とし込み、プロセス開発では加速試験と故障解析から材料・工程・寸法の余裕を決めます。",
      ],
    },
    {
      id: "control",
      heading: "配線形成は、各層の形状・膜・平坦度と電気特性を結び付けて管理する",
      lead: "完成後の電気試験だけでは、どの層・どの工程で異常が生じたか特定しにくくなります。",
      blocks: [
        {
          type: "process-control-loop",
          title: "配線工程の加工・測定・解析・フィードバック",
          description: "製品ウェーハ上の測定と専用モニター構造を組み合わせます。",
          stages: [
            { kind: "process", label: "PROCESS", title: "層を形成", body: "絶縁膜、パターン、薄膜、導体、CMPを実行する", output: "膜・溝・ビア・配線" },
            { kind: "measure", label: "MEASURE", title: "形状と膜を測る", body: "膜厚、CD、深さ、重ね合わせ、欠陥、段差を測定する", output: "計測値・欠陥座標" },
            { kind: "review", label: "ELECTRICAL", title: "電気特性を確認", body: "線抵抗、ビア抵抗、漏れ、絶縁破壊、連鎖構造を評価する", output: "抵抗・歩留まり分布" },
            { kind: "feedback", label: "FEEDBACK", title: "工程へ戻す", body: "装置・材料・レシピ・設計ルールと相関し、変動を抑える", output: "補正・保全・改善" },
          ],
        },
      ],
      paragraphs: [
        "線幅やビア径はSEM・光学計測、膜厚と組成は各種薄膜計測、欠陥は光学・電子線検査、平坦度は表面・膜厚測定などで確認します。断面観察は形状と空隙を直接確認できますが、破壊分析になる場合があります。",
        "電気モニターには長い配線、ビアチェーン、隣接線のくし形構造などを使い、微小な断線・短絡・抵抗・漏れの変化を増幅して捉えます。物理欠陥の座標と電気不良を結び付け、原因工程を絞ります。",
      ],
    },
    {
      id: "roles",
      heading: "配線形成には、成膜・エッチング・CMP・材料・設計の連携が必要",
      lead: "一つの配線層でも複数装置と材料を通るため、工程間の受渡し条件が重要です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "インテグレーション", right: "配線層の膜構成、工程順、熱履歴、相互作用、電気特性を統合する" },
            { left: "成膜・材料", right: "絶縁膜、バリア、ライナー、導体、キャップ膜の膜質と界面を作る" },
            { left: "リソグラフィ・エッチング", right: "線・ビアの寸法、重ね合わせ、側壁、深さ、選択比、残留物を制御する" },
            { left: "CMP・洗浄", right: "余分な導体を除き、厚さ・平坦度・表面欠陥・残留物を管理する" },
            { left: "デバイス・配線設計", right: "RC、電源網、信号品質、信頼性、設計ルールと配線階層を最適化する" },
            { left: "検査・解析・信頼性", right: "物理欠陥と電気不良を結び付け、故障モードと寿命を評価する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "配線形成が前工程のどこに入るか確認する" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "絶縁膜、バリア、ライナー、導体薄膜を作る方式を見る" },
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "配線溝とビアを加工する位置を決める工程を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "絶縁膜の溝・孔と金属パターンを加工する原理を見る" },
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "余分な導体を除去し、次層へ向けて平坦化する流れを見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "CD、重ね合わせ、膜厚、欠陥を工程へ戻す考え方を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、製造装置、材料企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materials、Lam Research、東京エレクトロンなどが成膜・エッチング・洗浄などの装置、KLAなどが検査・計測装置を提供しています。CMP装置・材料、フォトレジスト、絶縁膜・導体材料も配線形成を支える領域です。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の配線形成でよくある質問",
      lead: "配線材料、ビア、ダマシン、BEOLを混同しないための基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の配線形成とは何ですか？", answer: "ウェーハ上に作ったトランジスタや回路ブロックを、金属線と上下層をつなぐビアで接続し、信号・電源・接地を届ける多層配線工程です。絶縁膜、導体、バリア／ライナー、キャップ膜などを組み合わせます。" },
            { question: "配線とビアの違いは？", answer: "配線は主に同じ層の横方向をつなぐ導体です。ビアは上下の金属層を縦方向につなぐ導体で、下層配線との位置合わせと接触抵抗が重要です。" },
            { question: "ダマシン工程とは何ですか？", answer: "先に絶縁膜へ配線溝やビア孔を作り、バリア／ライナーと導体で埋め、CMPで表面の余分な導体を除く埋込み型の配線形成方法です。銅系多層配線の代表的な方式です。" },
            { question: "なぜ銅をそのままエッチングしないのですか？", answer: "銅は量産で微細な形状へ直接ドライ加工することが難しいため、絶縁膜側を加工して導体を埋めるダマシン法が広く使われてきました。材料や製品によっては金属を直接加工する方式も使います。" },
            { question: "低k材料は何のために使いますか？", answer: "隣接する配線間の寄生容量を下げ、RC遅延、クロストーク、動的電力を減らすためです。一方で機械強度、熱伝導、吸湿、加工ダメージ、界面信頼性との両立が必要です。" },
            { question: "BEOLと半導体の後工程は同じですか？", answer: "必ずしも同じではありません。BEOLは通常、ウェーハ上でコンタクトと多層配線を作る領域です。日本語で後工程という場合は、個片化・パッケージング・最終検査を指すこともあります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜絶縁膜へ形を作り、界面を守り、導体を埋めて層を重ねる",
      lead: "配線形成は、トランジスタを実際に働く回路へ変える三次元の接続工程です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PATTERN", title: "溝とビアを作る", body: "絶縁膜へ横配線と上下接続の空間を形成する" },
            { label: "INTERFACE", title: "界面を整える", body: "前処理、バリア、ライナーで拡散・密着・成長を制御する" },
            { label: "FILL / CMP", title: "埋めて平坦化する", body: "空隙を抑えて導体を充填し、余分を除いて次層へ渡す" },
            { label: "RC / RELIABILITY", title: "電気と寿命を守る", body: "抵抗、容量、電流、電界、熱、機械応力を構造全体で管理する" },
          ],
        },
      ],
      paragraphs: [
        "配線形成まで加わると、前工程の主要な反復である成膜・リソグラフィ・エッチング・洗浄・CMPが、実際の回路接続へどう統合されるか見えてきます。次は酸化・熱処理を補うと、絶縁膜形成、ドーパント活性化、膜質・界面制御の役割をさらに整理できます。",
      ],
    },
  ],
  todayQuest: "身近な道路網を例に、『局所配線』『長距離配線』『上下層をつなぐビア』『線間を隔てる絶縁膜』を説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "semiconductor-deposition-process",
    "photolithography-process",
    "semiconductor-etching-process",
    "semiconductor-cleaning-process",
    "semiconductor-cmp-process",
    "semiconductor-inspection-metrology",
    "semiconductor-wafer-test",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["applied-materials", "lam-research", "tokyo-electron", "kla"],
};
