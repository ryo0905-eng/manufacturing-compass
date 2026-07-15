import type { GuideArticle } from "@/content/guides/types";

export const semiconductorOxidationThermalProcessGuide: GuideArticle = {
  slug: "semiconductor-oxidation-thermal-process",
  title: "半導体の酸化・熱処理とは？熱酸化とアニールの仕組みを初心者向けに図解",
  description:
    "半導体の酸化・熱処理を初心者向けに図解。シリコン熱酸化の拡散・界面反応、ドライ酸化とウェット酸化、炉とRTP、活性化・膜質改善・欠陥回復などのアニール目的、熱履歴と代表的な不良を整理します。",
  targetQuery: "半導体 酸化 熱処理 工程",
  searchIntent:
    "シリコン表面に酸化膜が成長する仕組み、ドライ酸化・ウェット酸化、炉・RTP、アニールの目的と管理項目を図で理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "東京エレクトロン、KOKUSAI ELECTRIC、Applied Materialsの公式装置情報と、MIT OpenCourseWareなど大学の公開教育資料をもとに、代表的なシリコン熱酸化とアニールを整理しています。温度、時間、雰囲気、昇降温、膜厚などの条件は製品・材料・工程位置で異なるため、特定製品のレシピとしては記載していません。",
  showCareerCtas: false,
  experienceBasis: [
    "MIT OpenCourseWareの講義資料で、酸化種の供給、酸化膜内拡散、シリコン界面反応、Deal–Groveモデルの基本を確認",
    "東京エレクトロンとKOKUSAI ELECTRICの公式情報で、バッチ炉による酸化・拡散・アニールと温度・雰囲気・搬送制御を確認",
    "Applied Materialsの公式情報で、炉より短い熱履歴を狙うRTP、スパイク・ミリ秒アニール、活性化・膜質改善などの用途を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Deposition TELINDY Series",
      url: "https://www.tel.com/product/telindy.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-15",
    },
    {
      title: "Products & Services: Batch Thermal Processing Systems",
      url: "https://kesh.kokusai-electric.com/en/products/",
      publisher: "KOKUSAI ELECTRIC CORPORATION",
      accessedAt: "2026-07-15",
    },
    {
      title: "Rapid Thermal Processing and Treatments",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/processes/rapid-thermal-processing-treatments.html",
      publisher: "Applied Materials, Inc.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Vantage Radiance Plus RTP",
      url: "https://www.appliedmaterials.com/jp/ja/semiconductor/products/modify/rapid-thermal-processing-treatments/vantage-radiance-plus-rtp.html",
      publisher: "Applied Materials, Inc.",
      accessedAt: "2026-07-15",
    },
    {
      title: "Oxidation and the Si/SiO2 Interface: Deal/Grove Model, Thin Oxide Models",
      url: "https://ocw.mit.edu/courses/6-774-physics-of-microfabrication-front-end-processing-fall-2004/resources/mit6_774f04_lec06_mp4/",
      publisher: "MIT OpenCourseWare",
      accessedAt: "2026-07-15",
    },
    {
      title: "Oxidation Basics",
      url: "https://www.utep.edu/engineering/nanomil/processes/oxidation_basics.html",
      publisher: "The University of Texas at El Paso",
      accessedAt: "2026-07-15",
    },
    {
      title: "Oxide Growth (furnace)",
      url: "https://snfguide.stanford.edu/guide/equipment/processing-technique/annealing-oxidation/oxide-growth-furnace",
      publisher: "Stanford Nanofabrication Facility",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "半導体の熱処理を『ウェーハを高温にする工程』と覚えても、酸化膜を成長させる場合と、イオン注入後の活性化、膜の緻密化、界面改善では何が違うのか分かりにくくありませんか。炉とRTPの使い分けも、温度の高低だけでは説明できません。",
    conclusion:
      "熱酸化は、酸素や水蒸気由来の酸化種が既存の酸化膜を通ってシリコン界面へ届き、界面反応でシリコンを消費しながら二酸化シリコンを成長させる工程です。一方のアニールは、温度と時間と雰囲気を使ってドーパント活性化、結晶欠陥回復、膜質・界面・応力・接触特性などを変える処理です。どちらも最高温度だけでなく、昇温から冷却までの熱履歴を管理します。",
    learnings:
      "熱酸化の拡散・界面反応、ドライ酸化とウェット酸化、成長膜と堆積膜の違い、炉・ミニバッチ・RTP・スパイク・ミリ秒処理、アニールの目的、熱予算、温度・雰囲気・清浄度、膜厚・界面・欠陥、関連職種・企業。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "酸化・熱処理は、単に“焼く”工程ではありません。何を動かし、何を反応させ、何を回復・固定したいのかを、温度・時間・雰囲気の組合せで設計する工程です。",
      caption: "この記事の見方",
    },
    {
      type: "thermal-oxidation-flow",
      title: "図解｜酸化種が膜を通り、シリコン界面で酸化膜が成長する",
      description:
        "平坦なシリコン表面の熱酸化を単純化した断面概念図です。実際の前処理、ガス切替、圧力、昇降温、膜構成、後処理は製品と装置で異なります。",
      stages: [
        { kind: "clean", label: "PRE-CLEAN", title: "表面を清浄化", body: "粒子、金属、有機物、不要な自然酸化膜などを管理し、再現性あるシリコン表面を作る" },
        { kind: "supply", label: "AMBIENT", title: "酸化種を供給", body: "加熱したウェーハへ乾燥酸素や水蒸気を含む雰囲気を均一に届ける" },
        { kind: "diffuse", label: "DIFFUSION", title: "酸化膜内を移動", body: "酸化種がすでに成長した酸化膜を通り、シリコンとの界面へ向かう" },
        { kind: "react", label: "INTERFACE", title: "界面で反応・成長", body: "シリコンと反応して新しい酸化膜を界面側へ作り、膜が厚くなる" },
        { kind: "anneal", label: "ANNEAL / COOL", title: "整えて冷却", body: "必要に応じて雰囲気処理を行い、膜・界面を整えて制御された条件で冷却する" },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "酸化・熱処理は、材料の反応・拡散・欠陥・界面を制御する",
      lead: "同じ加熱装置でも、狙う変化によって雰囲気と熱履歴が変わります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "GROW", title: "酸化膜を成長", body: "シリコンと酸化種を反応させ、絶縁・保護・界面制御に使う酸化膜を作ります。" },
            { label: "ACTIVATE", title: "ドーパントを活性化", body: "注入した不純物を電気的に働く位置へ移し、同時に結晶損傷を回復します。" },
            { label: "MODIFY", title: "膜・界面を変える", body: "緻密化、結晶化、応力緩和、界面欠陥低減、接触・抵抗の形成などを行います。" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsはアニールを、導電性、誘電特性、緻密化、汚染低減など、材料の電気的・物理的特性を変える処理と説明しています。熱酸化、拡散、活性化、シリサイド形成、膜質改善など、熱を使う工程は製造フローの複数箇所にあります。",
        "重要なのは『高温にした』ことではなく、どの材料へ、どの雰囲気で、どの温度履歴を与え、処理後に何が変化したかです。熱履歴は後から完全には取り消せないため、前後工程を含めて設計します。",
      ],
    },
    {
      id: "mechanism",
      heading: "熱酸化では、酸化種の輸送・膜内拡散・界面反応が直列につながる",
      lead: "酸化膜が厚くなるほど、酸化種が界面へ届くまでの経路も長くなります。",
      blocks: [
        {
          type: "process-flow",
          title: "シリコン熱酸化を支配する代表的な段階",
          description: "Deal–Groveモデルの基本的な考え方を、式を使わずに整理しています。",
          stages: [
            { label: "01", title: "気相から表面へ", body: "装置内の流れから酸化種がウェーハ表面へ運ばれる" },
            { label: "02", title: "酸化膜へ溶け込む", body: "表面で酸化種が酸化膜内へ取り込まれる" },
            { label: "03", title: "膜内を拡散", body: "既存の酸化膜を通ってシリコン界面へ移動する" },
            { label: "04", title: "界面で反応", body: "酸化種とシリコンが反応し、新しい酸化膜になる" },
            { label: "05", title: "膜厚が増える", body: "シリコンを一部消費しながら、界面が基板側へ移動する" },
          ],
        },
      ],
      paragraphs: [
        "MIT OpenCourseWareは、酸化種が気相から酸化膜表面へ到達し、膜内を拡散して、シリコン／酸化膜界面で反応する流れを熱酸化の基本モデルとして説明しています。初期の薄い膜では界面反応、厚くなると膜内拡散の影響が相対的に大きくなります。",
        "そのため、同じ温度と雰囲気でも膜厚は時間へ単純比例し続けません。結晶方位、ドーピング、圧力、初期膜、表面状態、パターン形状でも成長挙動が変わります。",
      ],
    },
    {
      id: "dry-wet",
      heading: "ドライ酸化とウェット酸化は、酸化種と成長速度・膜用途が違う",
      lead: "速い・遅いだけでなく、必要膜厚と界面・電気品質で選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "基本的な特徴",
          rows: [
            { left: "ドライ酸化", right: "主に乾燥酸素を使う。成長は比較的遅く、薄膜の厚さ制御や良好な界面・電気特性が重要な用途で使われる" },
            { left: "ウェット酸化", right: "水蒸気を含む雰囲気を使う。成長が速く、比較的厚い酸化膜を効率よく作る用途で使われる" },
            { left: "組合せ酸化", right: "初期・主成長・仕上げで雰囲気を切り替え、成長速度と表面・界面品質を両立する場合がある" },
            { left: "酸窒化・ラジカル酸化", right: "窒素種や活性種などを使い、膜組成、界面、低温化、成長制御を狙う派生方式がある" },
          ],
        },
      ],
      paragraphs: [
        "UTEPのNanofabrication Facilityは、ドライ酸化はウェット酸化より成長が遅い一方、より緻密で高品質な酸化膜を作りやすいと説明しています。どちらが常に優れるのではなく、膜厚、処理時間、電気特性、後工程耐性で選びます。",
        "酸化雰囲気の純度と水分は結果へ直接影響します。意図しない水分・酸素、炉内壁や治具からの汚染、前ロット由来の残留物を避けるため、用途ごとに装置・反応管・搬送系を分ける場合があります。",
      ],
    },
    {
      id: "growth-deposition",
      heading: "熱酸化膜と堆積酸化膜は、作り方も界面も異なる",
      lead: "どちらも二酸化シリコン系でも、材料がどこから来るかが違います。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "膜形成",
          rightLabel: "材料供給と特徴",
          rows: [
            { left: "熱酸化", right: "基板のシリコンを酸化種と反応させて膜へ変える。シリコンを消費し、界面位置も変わる" },
            { left: "CVD酸化膜", right: "シリコンと酸素を含む原料を表面へ供給し、反応生成物として膜を堆積する" },
            { left: "ALD酸化膜", right: "表面反応を分けて繰り返し、膜厚・被覆性を原子層単位に近いサイクルで制御する" },
            { left: "用途の考え方", right: "熱酸化は良好なSi界面、堆積膜は材料・下地・温度・形状の自由度などを生かして使い分ける" },
          ],
        },
      ],
      paragraphs: [
        "Stanford Nanofabrication Facilityは酸化膜成長を、酸素または水蒸気によりシリコン表面を二酸化シリコンへ変換する処理と説明しています。熱酸化膜は基板のシリコンを使うため、膜が表面へ載るだけではありません。",
        "CVDやALDでは基板がシリコン以外でも酸化物を形成でき、複雑形状や低温処理にも選択肢があります。必要な界面品質、膜厚、下地材料、熱予算、段差被覆で方式を選びます。",
      ],
    },
    {
      id: "anneal-purposes",
      heading: "アニールは、目的ごとに動かしたい原子と抑えたい変化が違う",
      lead: "一つの処理で複数の変化が同時に起きるため、副作用も含めて条件を決めます。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "ACTIVATION", title: "注入後の活性化・損傷回復", body: "不純物を電気的に働かせ、イオン注入で乱れた結晶を回復します。拡散しすぎない熱履歴が必要です。" },
            { label: "DENSIFY", title: "膜の緻密化・脱ガス", body: "堆積膜内の残留物、水分、空隙を減らし、密度・誘電特性・安定性を変えます。" },
            { label: "INTERFACE", title: "界面欠陥の低減", body: "半導体／絶縁膜や金属／半導体界面の欠陥・結合状態を整えます。" },
            { label: "CRYSTAL", title: "結晶化・粒成長", body: "非晶質膜を結晶化する、結晶粒と配向を変えるなど、膜構造を調整します。" },
            { label: "CONTACT", title: "反応層・接触を形成", body: "金属と半導体を反応させ、低抵抗な接触層を作るなどの用途があります。" },
            { label: "STRESS", title: "応力・欠陥を調整", body: "膜応力の緩和、空孔・欠陥の移動、汚染の外方拡散などを狙う場合があります。" },
          ],
        },
      ],
      paragraphs: [
        "Applied MaterialsはRTPの用途として、ウェル・ソース／ドレインの活性化、高k・金属ゲートの信頼性処理、金属シリサイド、緻密化、応力調整などを示しています。処理目的ごとに、保持時間を持つソーク、短いスパイク、さらに短い表面加熱などを使い分けます。",
        "温度を上げると反応・拡散・回復は一般に速くなりますが、接合が広がる、膜が反応しすぎる、応力や欠陥が増える場合もあります。狙う変化と抑えたい変化の速度差を利用します。",
      ],
    },
    {
      id: "equipment",
      heading: "バッチ炉とRTPは、処理枚数・均一性・熱履歴の作り方が違う",
      lead: "炉が古くRTPが新しいという単純な関係ではなく、用途ごとに併用されます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置・加熱方式",
          rightLabel: "基本的な特徴",
          rows: [
            { left: "バッチ炉", right: "多数ウェーハを反応管内でまとめて処理する。酸化、拡散、アニール、LPCVDなどで高い生産性と安定性を狙う" },
            { left: "ミニバッチ炉", right: "処理枚数を抑え、待ち時間、製品切替、昇降温、少量生産とのバランスを取る" },
            { left: "ランプRTP", right: "単枚ウェーハを急速に加熱・冷却し、高温にいる時間を短くして熱拡散を抑える" },
            { left: "レーザー・ミリ秒処理", right: "表面近傍を非常に短時間加熱し、下層への熱影響を抑えながら反応・活性化を狙う" },
            { left: "ホットプレート等", right: "比較的低温のベーク、硬化、溶媒除去など、膜・材料に応じた加熱へ使う" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンはTELINDYシリーズを、酸化・アニール・LPCVDへ使う等温バッチ熱処理プラットフォームとして説明しています。KOKUSAI ELECTRICもバッチ装置で、酸化、拡散、低温・高温アニールなどを対象にしています。",
        "RTPは短い熱履歴が必要な用途へ向きますが、ウェーハの放射率、パターン、温度測定、ランプ分布で面内温度差が生じます。炉は長時間になりやすい一方、多数枚の温度・雰囲気を安定させる設計が重要です。",
      ],
    },
    {
      id: "thermal-budget",
      heading: "熱予算は、最高温度だけでなく時間を積み重ねて考える",
      lead: "ウェーハは一度だけでなく、製造中に何度も加熱されます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "熱履歴要素",
          rightLabel: "確認すること",
          rows: [
            { left: "昇温", right: "目標温度までの時間、過渡反応、ウェーハ内温度差、表面状態の変化" },
            { left: "保持・ピーク", right: "反応、拡散、活性化、結晶化が必要量だけ進む温度と時間" },
            { left: "降温", right: "冷却中にも続く反応・拡散、応力、結晶欠陥、雰囲気切替" },
            { left: "累積履歴", right: "後続の酸化、成膜、アニールで、それ以前の接合・膜・界面がさらに変わる量" },
            { left: "局所温度", right: "ウェーハ面内、パターン密度、表裏、中心・外周、ロット位置による差" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは、ソーク、スパイク、ミリ秒アニールなどの選択を、その工程位置でデバイスが許容できる温度・時間曝露、つまり熱予算で決めると説明しています。高温でも短時間なら抑えられる変化と、低温でも長時間で進む変化があります。",
        "熱予算は一工程の合否だけでなく、最終的な接合深さ、シート抵抗、膜厚、界面、応力、配線材料の安定性へ影響します。工程変更時は後続処理まで含めて再評価します。",
      ],
    },
    {
      id: "control",
      heading: "温度・時間・雰囲気・清浄度・搬送を同時に管理する",
      lead: "表示された設定値と、ウェーハが実際に経験した状態は同じとは限りません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "管理項目",
          rightLabel: "主な確認内容",
          rows: [
            { left: "温度", right: "校正、面内・ウェーハ間均一性、昇降温、放射率、測定位置、制御応答" },
            { left: "時間", right: "投入、安定、ガス切替、反応、パージ、取出しを含む実効的な熱履歴" },
            { left: "雰囲気", right: "酸素、水分、不活性ガス、反応性ガス、圧力、流量、純度、残留ガス" },
            { left: "清浄度", right: "前洗浄、自然酸化膜、金属・有機物、粒子、治具・反応管、クロスコンタミネーション" },
            { left: "搬送・配置", right: "ウェーハ間隔、ボート位置、反り、滑り、ロボット接触、待ち時間、ロード雰囲気" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンはバッチ熱処理で多ゾーンヒーター、温度均一性、昇温・安定時間、低酸素ロード環境、粒子管理を重視しています。酸化前洗浄から装置投入までの待ち時間と表面再汚染も膜・界面へ影響します。",
        "RTPでは非接触温度計測に使う放射率が膜構成やパターンで変わります。装置温度の校正だけでなく、電気特性や膜厚を使った製品相関を取ります。",
      ],
    },
    {
      id: "quality",
      heading: "代表的な異常は、膜厚ずれ・界面欠陥・汚染・熱処理不足／過剰",
      lead: "物理測定と電気測定を結び付けて、装置要因と材料要因を分けます。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "THICKNESS", title: "膜厚・均一性ずれ", body: "温度、時間、雰囲気、初期表面、流れ、炉内位置の差で酸化膜厚が変わります。" },
            { label: "INTERFACE", title: "界面準位・固定電荷", body: "洗浄、汚染、酸化条件、後処理で界面欠陥や膜中電荷が増え、しきい値・移動度・漏れへ影響します。" },
            { label: "PARTICLE", title: "粒子・金属汚染", body: "局所的な膜欠陥、絶縁破壊、接合リーク、結晶欠陥、歩留まり低下につながります。" },
            { label: "SLIP", title: "スリップ・反り・応力", body: "急な温度変化、温度差、保持方法、膜応力で結晶すべりやウェーハ変形が起こる場合があります。" },
            { label: "UNDER", title: "処理不足", body: "活性化不足、損傷残り、膜の低密度、反応層不足などで抵抗・安定性が規格外になります。" },
            { label: "OVER", title: "処理過剰", body: "ドーパント拡散、過酸化、反応層成長、膜収縮、界面反応、応力変化が進みすぎます。" },
          ],
        },
      ],
      paragraphs: [
        "酸化膜はエリプソメトリなどで膜厚・光学特性を測り、必要に応じて屈折率、組成、表面・界面、欠陥を確認します。電気的には容量、電流–電圧、絶縁破壊、界面特性などを専用構造で評価します。",
        "アニール後はシート抵抗、接触抵抗、接合リーク、プロファイル、結晶欠陥、膜応力など、処理目的に対応する指標を測ります。温度ログが正常でも電気特性がずれる場合は、表面状態・雰囲気・前工程も確認します。",
      ],
    },
    {
      id: "roles",
      heading: "酸化・熱処理には、反応・拡散・温度計測・材料・装置保全が集まる",
      lead: "熱を均一に与えるだけでなく、雰囲気と清浄度を再現する仕事です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "熱プロセス", right: "温度、時間、雰囲気、圧力、昇降温、膜厚・電気特性を設計する" },
            { left: "デバイス・インテグレーション", right: "酸化膜、接合、界面、後続熱履歴を統合し、熱予算を配分する" },
            { left: "装置・温度制御", right: "ヒーター、ランプ、レーザー、温度計、流量・圧力、冷却、搬送を制御する" },
            { left: "材料・表面", right: "前洗浄、自然酸化膜、表面終端、ガス・治具・反応管の汚染を管理する" },
            { left: "計測・デバイス評価", right: "膜厚、組成、界面、抵抗、リーク、欠陥、応力を測り、工程へ返す" },
            { left: "設備・保全", right: "反応管、シール、ヒーター、温度校正、ガス系、排気、粒子、部品寿命を維持する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "酸化・熱処理が前工程の反復へどう入るか確認する" },
            { label: "シリコンウェーハ製造の仕組み", href: "/guides/semiconductor-silicon-wafer-manufacturing", description: "熱酸化前の単結晶基板と、結晶・表面品質を作る工程を見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "酸化・拡散前に表面汚染と自然酸化膜を管理する流れを見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "熱酸化による成長膜とCVD・ALDの堆積膜を比較する" },
            { label: "イオン注入・拡散の仕組み", href: "/guides/semiconductor-ion-implantation-process", description: "注入後の活性化アニールとドーパント拡散を見る" },
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "熱に敏感なレジスト工程との順序と熱履歴を確認する" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "膜厚・欠陥・電気特性を工程へ戻す考え方を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、熱処理装置、ガス・材料企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロン、KOKUSAI ELECTRICなどがバッチ熱処理装置、Applied MaterialsなどがRTP・短時間アニール装置を提供しています。デバイスメーカーは洗浄、熱処理、計測、デバイス評価を製品フローへ統合します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の酸化・熱処理でよくある質問",
      lead: "熱酸化、成膜、アニール、炉、RTPの違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の熱酸化とは何ですか？", answer: "加熱したシリコンへ酸素や水蒸気由来の酸化種を供給し、酸化種が既存の酸化膜を通ってシリコン界面で反応することで、二酸化シリコン膜を成長させる工程です。" },
            { question: "ドライ酸化とウェット酸化の違いは？", answer: "ドライ酸化は主に乾燥酸素を使い、比較的ゆっくり成長するため薄膜制御や良好な電気特性が重要な用途へ使われます。ウェット酸化は水蒸気を使い、比較的速く厚い膜を作る用途へ向きます。" },
            { question: "熱酸化とCVD酸化膜は同じですか？", answer: "異なります。熱酸化は基板のシリコンを消費して酸化膜へ変えます。CVDは気相原料から反応生成物を表面へ堆積するため、材料供給、界面、下地、温度の自由度が異なります。" },
            { question: "アニールは何のために行いますか？", answer: "イオン注入後の活性化と結晶損傷回復、膜の緻密化・結晶化、界面欠陥低減、応力調整、反応層・低抵抗接触の形成など、材料の電気的・物理的状態を変えるためです。" },
            { question: "炉とRTPの違いは？", answer: "バッチ炉は多数枚をまとめて安定処理しやすく、RTPは単枚を急速に加熱・冷却して高温にいる時間を短くできます。用途、処理枚数、均一性、熱予算、温度計測で使い分けます。" },
            { question: "熱予算とは何ですか？", answer: "ウェーハが製造中に経験する温度と時間の累積的な影響です。最高温度だけでなく昇温、保持、冷却、後続工程を含め、拡散・反応・欠陥回復がどこまで進むかを考えます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜温度・時間・雰囲気で、反応と拡散の進み方を設計する",
      lead: "酸化・熱処理は、材料を作る工程でもあり、作った材料と界面を整える工程でもあります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OXIDIZE", title: "界面で酸化膜を成長", body: "酸化種が膜内を通り、シリコンを消費して新しい膜を作る" },
            { label: "ANNEAL", title: "材料状態を変える", body: "活性化、回復、緻密化、結晶化、界面・接触形成を進める" },
            { label: "BUDGET", title: "熱履歴を積み上げる", body: "昇温・保持・冷却と後続工程を含め、進めたい変化と抑えたい変化を分ける" },
            { label: "CONTROL", title: "温度と雰囲気を再現", body: "清浄度、流量、圧力、搬送、ウェーハ位置まで管理する" },
          ],
        },
      ],
      paragraphs: [
        "酸化・熱処理まで補うと、前工程の材料形成、パターン加工、ドーピング、配線形成をつなぐ熱履歴が見えてきます。次はシリコンウェーハ製造をまとめると、シリーズで未作成の個別工程を一通り埋められます。",
      ],
    },
  ],
  todayQuest: "料理の加熱を例に、『温度』『時間』『雰囲気』『中心まで届く速さ』『冷却』が仕上がりへどう影響するか説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "semiconductor-silicon-wafer-manufacturing",
    "semiconductor-cleaning-process",
    "semiconductor-deposition-process",
    "semiconductor-ion-implantation-process",
    "photolithography-process",
    "semiconductor-etching-process",
    "semiconductor-inspection-metrology",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["tokyo-electron", "applied-materials"],
};
