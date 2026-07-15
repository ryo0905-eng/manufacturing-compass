import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCmpProcessGuide: GuideArticle = {
  slug: "semiconductor-cmp-process",
  title: "半導体のCMPとは？化学機械研磨と平坦化の仕組みを初心者向けに図解",
  description:
    "半導体のCMP工程を初心者向けに図解。スラリーの化学作用と砥粒・研磨パッドの機械作用、平坦化が必要な理由、酸化膜・タングステン・銅CMP、研磨終点、ディッシング・エロージョン・スクラッチ、研磨後洗浄を整理します。",
  targetQuery: "半導体 CMP とは",
  searchIntent:
    "半導体のCMPが何をする工程か、化学作用と機械作用をどう組み合わせるか、平坦化の用途と代表的な不良を図で理解したい",
  status: "draft",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "荏原製作所、Applied Materials、フジミインコーポレーテッド、Entegris、KLAの公式技術・製品情報をもとに、代表的なCMPを整理しています。実際のスラリー組成、パッド、圧力、回転数、研磨時間などは材料・構造・装置で変わるため、製造条件としては記載していません。",
  showCareerCtas: false,
  experienceBasis: [
    "荏原製作所の公式技術解説で、ウェーハと研磨定盤の回転、パッド、砥粒・薬液を含むスラリー、圧力制御、研磨後洗浄の基本を確認",
    "Applied Materialsとフジミインコーポレーテッドの公式情報で、平坦化の目的、異種材料の同時研磨、酸化膜・タングステン・銅などの用途を確認",
    "KLAの公式アプリケーションノートで、銅CMPのディッシング、エロージョン、リセスと表面形状測定の考え方を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Nano-level Polishing Technique that Supports Semiconductor",
      url: "https://ebara.com/global-en/technology/information/polishing-technology-ex/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "The EBARA Group's Strategic Table of Technological Capabilities",
      url: "https://www.ebara.com/global-en/technical-personnel/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-15",
    },
    {
      title: "Applied Materials Annual Report: Chemical Mechanical Planarization",
      url: "https://ir.appliedmaterials.com/static-files/8ea2c6b9-eb3d-4b2f-8dad-6c64cb84d641",
      publisher: "Applied Materials",
      accessedAt: "2026-07-15",
    },
    {
      title: "半導体デバイスを研磨する技術",
      url: "https://www.fujimiinc.co.jp/service/cmp/index.html",
      publisher: "フジミインコーポレーテッド",
      accessedAt: "2026-07-15",
    },
    {
      title: "CMP Polishing Material Product Line-up",
      url: "https://www.fujimiinc.co.jp/english/service/cmp/lineup.html",
      publisher: "Fujimi Incorporated",
      accessedAt: "2026-07-15",
    },
    {
      title: "NexPlanar CMP Pads",
      url: "https://www.entegris.com/shop/en/USD/products/wafer-handling/wafer-processing/cmp-pads/NexPlanar-CMP-Pads/p/NexPlanarCMPPads",
      publisher: "Entegris",
      accessedAt: "2026-07-15",
    },
    {
      title: "Stylus Profiler 3D Parameters: CMP Analysis Parameters",
      url: "https://www.kla.com/wp-content/uploads/KLA_AppNote_Stylus_3D_Parameters.pdf",
      publisher: "KLA",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約16分",
  intro: {
    problem: "CMPを『ウェーハを磨く工程』と覚えても、なぜ化学反応と機械研磨を組み合わせるのか、単に表面を滑らかにすることと何が違うのか分かりにくくありませんか。",
    conclusion: "CMPは、スラリーで表面を反応しやすくし、研磨パッドと砥粒の機械作用で高い部分を優先して除去し、次の層を作れる平坦な面へ戻す工程です。研磨速度だけでなく、材料選択性、終点、面内均一性、ディッシング、スクラッチ、研磨後洗浄を同時に管理します。",
    learnings: "CMPの目的、装置と研磨の流れ、スラリー・パッド・コンディショナー、酸化膜・金属CMP、終点検出、ディッシング・エロージョン、研磨後洗浄、管理項目、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "CMPは『表面をきれいに磨く』より、『高い部分を狙って除去し、異なる材料を必要な高さへそろえる』工程として見ると理解しやすくなります。",
      caption: "この記事の見方",
    },
    {
      type: "cmp-planarization",
      title: "図解｜凹凸のある表面を、次の層を作れる平面へ戻す",
      description:
        "青灰色が埋め込み構造、薄茶色が上部へ余分に残った膜の概念図です。実際のCMPでは材料、パターン密度、研磨圧力によって局所的な高さが変わります。",
      stages: [
        { kind: "before", label: "BEFORE", title: "膜が凹凸を覆う", body: "成膜や埋め込み後は、下のパターンを反映した段差と余分な上部膜が残る" },
        { kind: "polish", label: "CMP", title: "化学＋機械で除去", body: "スラリー、パッド、圧力、相対運動を使い、高い部分から材料を取り除く" },
        { kind: "after", label: "AFTER", title: "高さをそろえる", body: "必要な材料を溝などへ残し、次のリソグラフィや積層へ進める平面を作る" },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "CMPは、多層構造を作り続けるために表面を平らへ戻す工程",
      lead: "成膜と加工を繰り返すと段差が積み重なるため、途中で高さをリセットします。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "LITHOGRAPHY", title: "露光の焦点を合わせる", body: "面内の大きな高低差を減らし、次のレジスト塗布と露光を安定させます。" },
            { label: "STACKING", title: "層を積み重ねる", body: "下層の段差を上層へ持ち越しにくくし、多層配線や立体構造を形成します。" },
            { label: "ISOLATION", title: "必要材料だけを残す", body: "溝や穴の内部へ材料を残し、上面の余分な材料を除去して分離します。" },
          ],
        },
        {
          type: "note",
          title: "平坦化は、表面粗さだけではない",
          body: "小さな領域の滑らかさだけでなく、チップ内、チップ間、ウェーハ全面で高さをそろえる必要があります。局所的に平滑でも、大きなうねりやパターン依存の高さ差が残れば次工程へ影響します。",
        },
      ],
      paragraphs: [
        "Applied Materialsは、CMPがウェーハから材料を除去して平坦面を作り、後続リソグラフィの精度を高め、膜を高さのばらつきを抑えて積層できるようにすると説明しています。荏原製作所も、多層配線を支える表面平坦化としてCMPを位置づけています。",
        "エッチングがマスクを使って必要な形を作る工程であるのに対し、CMPは表面へ接触して高い部分を優先的に除去し、面の高さをそろえる工程です。用途によっては下層材料を研磨停止の目印として使います。",
      ],
    },
    {
      id: "mechanism",
      heading: "CMPは、化学作用で反応しやすくし、機械作用で取り除く",
      lead: "Chemical Mechanical Planarizationの名前どおり、二つの作用を同時に利用します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "作用",
          rightLabel: "表面で起こること",
          rows: [
            { left: "化学作用", right: "酸化、溶解、錯体化、表面改質などで、対象材料を除去しやすい状態へ変える" },
            { left: "砥粒の作用", right: "スラリー中の微粒子がパッドと表面の間で働き、改質された層を機械的に除去する" },
            { left: "パッドの作用", right: "表面へ圧力と相対運動を伝え、スラリーを保持・供給しながら高い部分へ接触する" },
            { left: "流体の作用", right: "反応物を届け、除去物と熱を運び、研磨面の状態を保つ" },
          ],
        },
      ],
      paragraphs: [
        "荏原製作所は、微細な砥粒と薬液を含む研磨液を供給し、回転する樹脂製パッドへ回転するウェーハを押し付けて研磨する仕組みを示しています。フジミインコーポレーテッドも、薬液の化学作用と砥粒の機械作用を組み合わせる複合加工と説明しています。",
        "化学作用だけでは全面が同じように反応し、機械作用だけでは傷や大きな力が問題になりやすくなります。材料表面を選択的に改質し、その薄い範囲を穏やかに除去する循環を作ることが基本です。",
      ],
    },
    {
      id: "tool-flow",
      heading: "CMP装置は、保持・加圧・回転・供給・洗浄を一体で制御する",
      lead: "ウェーハとパッドの接触状態を面内でそろえ、研磨後のスラリーを持ち出さないようにします。",
      blocks: [
        {
          type: "process-flow",
          title: "代表的なCMPの工程フロー",
          description: "装置構成を単純化した概念です。複数の研磨定盤、ヘッド、洗浄ステーションを使う構成もあります。",
          stages: [
            { label: "01", title: "ウェーハを保持", body: "キャリアヘッドで背面を支持し、外周を保持する" },
            { label: "02", title: "スラリーを供給", body: "対象材料に合う薬液と砥粒をパッド上へ安定供給" },
            { label: "03", title: "加圧・相対運動", body: "ウェーハと定盤を回転させ、領域ごとの圧力を制御" },
            { label: "04", title: "終点を判断", body: "時間、光学、トルク、渦電流などで残膜と材料変化を捉える" },
            { label: "05", title: "洗浄・乾燥", body: "スラリー、砥粒、研磨くず、薬液残留物を除去して乾燥" },
          ],
        },
      ],
      paragraphs: [
        "キャリアヘッドはウェーハを保持するだけでなく、背面側の複数領域へ異なる圧力を与え、中心から外周まで研磨量を調整します。リテーナリングはウェーハ外周の保持とパッド接触へ影響します。",
        "荏原製作所は、モータートルク、光学、渦電流などを組み合わせる終点検出と、研磨・洗浄・乾燥を装置内で完結するDry-in/Dry-outを示しています。材料によって検出できる信号が違うため、用途に合う方法を選びます。",
      ],
    },
    {
      id: "consumables",
      heading: "スラリー・パッド・コンディショナーは、CMP結果を決める主要消耗材",
      lead: "装置設定が同じでも、消耗材の状態と組み合わせで研磨速度と欠陥が変わります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SLURRY", title: "スラリー", body: "砥粒、反応剤、酸化剤、pH調整剤、分散剤などを目的に合わせて組み合わせます。" },
            { label: "PAD", title: "研磨パッド", body: "硬さ、弾性、気孔、溝形状で接触、スラリー輸送、平坦化特性が変わります。" },
            { label: "CONDITIONER", title: "コンディショナー", body: "使用で変化するパッド表面を整え、スラリー保持と研磨速度を安定させます。" },
          ],
        },
      ],
      paragraphs: [
        "EntegrisはCMPパッドの硬さと気孔を用途に合わせて選べること、スラリーとの材料適合性が必要であることを示しています。荏原製作所はスラリー、パッド、ドレッサーを組み合わせ、領域ごとの研磨圧力を制御すると説明しています。",
        "スラリー中の砥粒が凝集するとスクラッチや粒子欠陥の原因になり、パッド表面が目詰まり・摩耗すると研磨速度と均一性が変わります。流量だけでなく、粒径分布、濃度、温度、使用時間、ろ過、パッド寿命を管理します。",
      ],
    },
    {
      id: "applications",
      heading: "CMPは、酸化膜・金属・半導体など対象材料ごとに設計する",
      lead: "異なる材料を同時に研磨するため、必要な研磨速度の比と停止性が重要です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "STI / OXIDE", title: "素子分離・絶縁膜", body: "溝へ埋めた絶縁膜や層間絶縁膜の余分な部分を除去し、平坦化します。" },
            { label: "TUNGSTEN", title: "コンタクト・プラグ", body: "穴へ埋めたタングステンの上部膜を除去し、絶縁膜内へ導体を残します。" },
            { label: "COPPER", title: "銅配線", body: "溝へ埋めた銅とバリア膜の上部を除去し、分離した配線パターンを作ります。" },
            { label: "POLY / METAL", title: "ゲート・機能膜", body: "ポリシリコンや各種金属を、隣接材料との選択性を保って平坦化します。" },
            { label: "MEMORY", title: "メモリ構造", body: "多層・立体構造の途中で高さを整え、次の成膜とパターニングへつなぎます。" },
            { label: "WAFER / BONDING", title: "基板・接合面", body: "ウェーハ表面や接合前の面を、必要な平坦度と粗さへ仕上げる用途があります。" },
          ],
        },
      ],
      paragraphs: [
        "フジミインコーポレーテッドは、酸化膜、タングステン、ポリシリコン、銅、バリア膜など用途別のCMP研磨材を示しています。異なる材料が同じ面へ現れるため、どれを速く研磨し、どれで止めるかをスラリーと条件で設計します。",
        "金属CMPでは、表面を反応させて除去しやすくする一方、研磨後の腐食を防ぐ必要があります。絶縁膜CMPでは、膜種間の選択性とパターン密度による高さ差を管理します。",
      ],
    },
    {
      id: "defects",
      heading: "ディッシング・エロージョンは、材料とパターンで研磨量が変わる不良",
      lead: "全面が同じ高さになるとは限らず、幅と密度に依存した局所形状が残ります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表的な形状・欠陥",
          rightLabel: "何が起こるか",
          rows: [
            { left: "ディッシング", right: "幅の広い金属部などが皿状に低くなり、周囲の絶縁膜より沈む" },
            { left: "エロージョン", right: "密集パターン領域で金属と周囲の絶縁膜がまとまって低くなる" },
            { left: "リセス", right: "特定材料が隣接材料より低く削られ、段差として残る" },
            { left: "スクラッチ", right: "凝集粒子、異物、パッド・装置状態などで線状の傷が生じる" },
            { left: "残膜・過研磨", right: "研磨不足で上部膜が残る、または終点後に必要材料まで除去する" },
          ],
        },
      ],
      paragraphs: [
        "KLAは銅CMPの三次元形状測定で、ディッシングを周囲の絶縁膜と金属面の高さ差、エロージョンを基準面と密集領域の絶縁膜面の高さ差として扱っています。リセスも隣接材料との高さ差で評価します。",
        "同じ研磨条件でも、広い配線と細い配線、密集部と疎な領域ではパッド接触と材料除去が変わります。デバイス設計側のダミーパターン、スラリー選択性、パッド、圧力分布、終点後の追加研磨を合わせて調整します。",
      ],
    },
    {
      id: "post-clean",
      heading: "CMP後洗浄は、砥粒・研磨くず・薬液残留物を除去する",
      lead: "CMPは粒子と薬液を使うため、平坦化直後の表面はそのまま次工程へ渡せません。",
      blocks: [
        {
          type: "process-flow",
          title: "CMP後の代表的な仕上げ",
          description: "対象材料によって薬液、ブラシ、リンス、乾燥方式は異なります。",
          stages: [
            { label: "01", title: "粗リンス", body: "表面のスラリーと大きな研磨くずを速やかに流す" },
            { label: "02", title: "化学・物理洗浄", body: "付着粒子、金属、有機残留物を薬液やスポンジなどで除去" },
            { label: "03", title: "純水リンス", body: "薬液と離れた汚染を高純度水で置換・排出" },
            { label: "04", title: "乾燥・検査", body: "乾燥跡と再付着を抑え、粒子・傷・膜厚を確認" },
          ],
        },
        {
          type: "note",
          title: "研磨と洗浄の間を空けない",
          body: "スラリーが乾くと砥粒や反応生成物が固着し、除去しにくくなる場合があります。研磨から洗浄・乾燥までを装置内でつなぐ構成は、再付着と搬送中の乾燥を抑える狙いがあります。",
        },
      ],
      paragraphs: [
        "荏原製作所はCMP後洗浄について、ウェーハへ付着したスラリー、研磨された基板・膜の残留物を除去し、薬液やスポンジによる洗浄と回転・IPAなどによる乾燥で欠陥を減らすと説明しています。",
        "銅など腐食しやすい材料では、洗浄中と乾燥までの時間、pH、溶存成分、酸素との接触も表面状態へ影響します。粒子除去だけでなく、材料表面を次工程に適した状態で止めることが重要です。",
      ],
    },
    {
      id: "control-items",
      heading: "CMPでは、研磨速度・均一性・平坦度・欠陥を同時に管理する",
      lead: "速く削るだけでは、薄膜の高さとデバイス特性をそろえられません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "RATE", title: "研磨速度・終点", body: "時間あたりの除去量、残膜、終点信号、終点後の追加研磨量を管理します。" },
            { label: "UNIFORMITY", title: "面内・ウェーハ間均一性", body: "中心・外周、チップ間、装置ヘッド間で膜厚と高さをそろえます。" },
            { label: "PLANARITY", title: "平坦度・パターン依存性", body: "段差、ディッシング、エロージョン、リセスを測定します。" },
            { label: "SELECTIVITY", title: "材料選択性", body: "対象膜、停止膜、バリア、金属、絶縁膜の研磨速度比を管理します。" },
            { label: "DEFECT", title: "傷・粒子・腐食", body: "スクラッチ、砥粒残り、金属汚染、乾燥跡、腐食を抑えます。" },
            { label: "CONSUMABLE", title: "パッド・スラリー状態", body: "パッド摩耗、コンディショニング、スラリー流量・粒径・濃度・温度を監視します。" },
          ],
        },
      ],
      paragraphs: [
        "測定には膜厚マッピング、シート抵抗、光学・渦電流の終点信号、段差計・光学プロファイラー、欠陥検査、表面分析などを使います。研磨前後のデータを装置条件と消耗材履歴へ結び付けます。",
        "KLAはCMPのディッシング、エロージョン、リセスを二次元・三次元の表面形状から測定する手法を示しています。局所形状とウェーハ全面の膜厚分布を別々に確認することが重要です。",
      ],
    },
    {
      id: "equipment-roles",
      heading: "CMPには、表面化学・トライボロジー・流体・機械・計測が集まる",
      lead: "接触する研磨工程だからこそ、材料と装置の小さな変化が欠陥へつながります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス", right: "スラリー、パッド、圧力、回転、時間、終点、洗浄を設計する" },
            { left: "材料・化学", right: "表面反応、砥粒分散、選択性、腐食防止、残留物を解析する" },
            { left: "機械・トライボロジー", right: "キャリア、定盤、パッド接触、摩擦、振動、圧力分布を制御する" },
            { left: "流体・設備", right: "スラリー供給、ろ過、純水、薬液、排液、温度と気流を管理する" },
            { left: "計測・解析", right: "膜厚、平坦度、段差、終点、傷、粒子、電気特性を測る" },
            { left: "装置保全", right: "パッド・リング・ブラシ交換、定盤状態、ヘッド校正、洗浄性能を維持する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "CMPが前工程の反復のどこに入るか確認する" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "CMP前に絶縁膜や金属膜を形成する工程を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "埋め込み前の溝や穴を作る工程を見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "CMP後の粒子・薬液残留物を除去する基本を見る" },
          ],
        },
      ],
      paragraphs: [
        "荏原製作所、Applied MaterialsなどがCMP装置、フジミインコーポレーテッドなどがスラリー、Entegrisなどがパッドや流体制御材料、KLAなどが表面形状・膜厚・欠陥計測を提供しています。デバイスメーカーでは各技術を一つの平坦化工程へ統合します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体のCMPでよくある質問",
      lead: "研磨、平坦化、洗浄の役割を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体のCMPとは何ですか？", answer: "スラリーの化学作用と、砥粒・研磨パッドの機械作用を組み合わせ、ウェーハ表面の高い部分を除去して平坦化する工程です。多層構造の途中で繰り返し使います。" },
            { question: "CMPとウェーハ研磨は同じですか？", answer: "どちらも研磨を使いますが、CMP記事では主にデバイス形成途中の薄膜や異種材料を選択的に平坦化する工程を扱います。シリコンウェーハ製造時の鏡面研磨とは対象と目的が異なります。" },
            { question: "なぜ化学作用と機械作用を組み合わせますか？", answer: "化学反応で対象材料の表面を除去しやすくし、パッドと砥粒でその層を取り除くことで、材料選択性、研磨速度、平坦化、欠陥を調整しやすくするためです。" },
            { question: "スラリーとは何ですか？", answer: "微細な砥粒を液体へ分散し、対象材料に応じた反応剤などを加えた研磨液です。砥粒、薬液、pH、分散状態によって研磨速度と欠陥が変わります。" },
            { question: "ディッシングとエロージョンの違いは？", answer: "ディッシングは主に幅の広い金属部などが皿状に沈む現象です。エロージョンは密集パターン領域で金属と周囲の絶縁膜がまとまって低くなる現象です。" },
            { question: "CMP後になぜ洗浄が必要ですか？", answer: "ウェーハ表面へ残るスラリー砥粒、研磨くず、薬液残留物を除去し、傷、腐食、再付着、乾燥跡を抑えて次工程へ渡すためです。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜高い部分を除去し、異種材料の高さをそろえる",
      lead: "CMPは、多層化を続けるために表面を平坦へ戻す工程です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CHEMICAL", title: "表面を反応させる", body: "スラリーの化学作用で対象材料を除去しやすい状態へ変える" },
            { label: "MECHANICAL", title: "高い部分を取り除く", body: "パッド、砥粒、圧力、相対運動で改質層を機械的に除去する" },
            { label: "CONTROL", title: "高さと欠陥を管理する", body: "終点、均一性、選択性、ディッシング、傷、研磨後洗浄を見る" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、成膜・エッチング・CMPなどの結果を測る検査・計測を取り上げ、膜厚、寸法、重ね合わせ、欠陥を工程へ戻す仕組みを図解します。",
      ],
    },
  ],
  todayQuest: "身近な凹凸のある面を例に、『高い部分だけを除去する方法』『止める高さ』『研磨後の洗浄』を説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "semiconductor-deposition-process",
    "semiconductor-etching-process",
    "semiconductor-cleaning-process",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["applied-materials", "kla"],
};
