import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCmpSlurryManufacturersGuide: GuideArticle = {
  slug: "semiconductor-cmp-slurry-manufacturers",
  title: "半導体CMPスラリーメーカーとは？フジミ・レゾナックなどを初心者向けに図解",
  description:
    "半導体CMPスラリーは、砥粒と薬液の作用で薄膜を平坦化する研磨材料です。酸化膜・金属・バリア膜用の違い、粒子・選択性・欠陥・供給管理、主要メーカーを図解します。",
  targetQuery: "半導体 CMP スラリー メーカー",
  searchIntent:
    "半導体CMPスラリーの構成と役割、酸化膜・タングステン・銅・バリア膜・SiCなど用途別の違い、フジミインコーポレーテッド・レゾナック・Entegris・BASFなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "フジミインコーポレーテッド、レゾナック、Entegris、BASFの公式製品・技術情報をもとに、CMPスラリーを対象材料、砥粒、薬液機能、選択性、欠陥、分散・ろ過、供給へ整理しました。個別処方や市場順位ではなく、同じCMP用途へ条件をそろえて比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存CMP記事で化学作用と機械作用、装置記事で研磨ヘッド・定盤・終点を整理したうえで、スラリー材料と企業比較を独立して調べる記事が必要だと判断",
    "フジミインコーポレーテッドとレゾナックの公式情報で、酸化膜、金属、バリア膜、ポリシリコン、セリア・シリカ系などの製品領域を確認",
    "EntegrisとBASFの公式情報で、CMPスラリー、研磨後洗浄、パッド、ろ過・粒子計測、用途別材料の領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "製品ラインナップ｜半導体デバイス",
      url: "https://www.fujimiinc.co.jp/service/cmp/lineup.html",
      publisher: "株式会社フジミインコーポレーテッド",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ultra-low Defect Nano Ceria Slurry",
      url: "https://eu.resonac.com/project/ultra-low-defect-nano-ceria-slurry/",
      publisher: "Resonac Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semi Frontend Process",
      url: "https://eu.resonac.com/products-top/frontend/",
      publisher: "Resonac Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Chemical Mechanical Planarization",
      url: "https://www.entegris.com/en/home/our-science/by-industry/microelectronics/semiconductor/cmp.html",
      publisher: "Entegris, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Slurries",
      url: "https://www.entegris.com/shop/en/USD/Products/Chemistries/Specialty-Chemicals/Slurries/c/CMPSlurries",
      publisher: "Entegris, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Chemical Solutions for Chemical Mechanical Planarization",
      url: "https://electronics-electric.basf.com/global/en/electronics/semiconductors_solutions/chemical-mechanical-planarization",
      publisher: "BASF",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "CMPスラリーメーカーを調べても、シリカ・セリアなどの砥粒名と、酸化膜・銅・タングステンなどの用途名が混ざり、どの条件で企業を比べればよいか分かりにくくありませんか。",
    conclusion:
      "CMPスラリーは、微細な砥粒を液体へ分散し、反応剤、酸化剤、pH調整剤、分散剤、腐食抑制剤などを用途に合わせた研磨材料です。企業比較では、対象膜、停止膜、砥粒、化学反応、研磨速度、選択性、平坦度、欠陥、分散・ろ過、供給認定をそろえます。",
    learnings:
      "CMPスラリーの構成、化学作用と機械作用、シリカ・セリアなどの砥粒、酸化膜・金属・バリア膜・基板用途、選択性と欠陥、粒子管理、供給、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "CMPスラリーメーカーを比べるときは、研磨速度だけでなく、『どの材料を除去し、どの材料で止め、どんな表面と欠陥状態で次工程へ渡すか』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜砥粒と表面反応を組み合わせ、高い部分を除去する",
      description:
        "スラリーの役割を単純化した概念です。実際の材料、供給順序、希釈、研磨、洗浄条件は対象構造と装置で異なります。",
      stages: [
        { label: "01 / SUPPLY", title: "スラリーを供給", body: "分散した砥粒と薬液成分を、濃度・流量・温度を保って研磨パッドへ届ける" },
        { label: "02 / REACT", title: "表面を反応させる", body: "酸化、錯形成、加水分解など用途に合う反応で対象材料の表面状態を変える" },
        { label: "03 / CONTACT", title: "パッドと接触", body: "圧力と相対運動を与え、砥粒・パッドが反応した表面層へ作用する" },
        { label: "04 / REMOVE", title: "高い部分を除去", body: "接触しやすい凸部を優先して除去し、ウェーハ面を平坦へ近づける" },
        { label: "05 / STOP", title: "停止膜で止める", body: "対象膜と下地・バリア膜の研磨速度差、終点信号、追加研磨量を管理する" },
        { label: "06 / CLEAN", title: "洗浄して次工程へ", body: "砥粒、研磨くず、薬液成分を除去し、傷・腐食・残留物を確認する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "スラリーの要素",
      rightLabel: "主な役割",
      rows: [
        { left: "砥粒", right: "シリカ、セリア、アルミナなどの微粒子が表面・パッド間で働き、改質された材料を除去する" },
        { left: "反応剤・酸化剤", right: "対象材料の表面を酸化・溶解・錯形成などで除去しやすい状態へ変える" },
        { left: "pH調整成分", right: "表面反応、砥粒の電荷、分散、材料選択性、腐食を調整する" },
        { left: "分散剤・界面成分", right: "砥粒の凝集・沈降、パッドや膜への吸着、濡れ、残留を制御する" },
        { left: "腐食抑制・選択制御成分", right: "金属の過剰反応や停止膜の除去を抑え、必要な研磨速度比を作る" },
        { left: "水・溶媒・高純度原料", right: "成分を均一に運び、微量金属、粒子、有機汚染を工程許容範囲へ抑える" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "CMPスラリーメーカーとは、表面化学と微粒子を研磨性能へまとめる企業",
      lead: "スラリーは研磨粉を水へ入れただけの材料ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "CHEMISTRY", title: "表面を改質する", body: "対象膜だけを反応させ、機械的に除去しやすい層を作ります。" },
            { label: "PARTICLE", title: "砥粒を設計する", body: "材質、粒径、形状、表面、濃度、分布、凝集を制御します。" },
            { label: "SELECTIVITY", title: "除去と停止を分ける", body: "対象膜・停止膜・隣接材料の研磨速度比を調整します。" },
            { label: "PRODUCTION", title: "分散状態を再現する", body: "製造、混合、ろ過、容器、輸送、希釈、供給中の変化を管理します。" },
          ],
        },
        {
          type: "note",
          title: "CMP工程記事・装置記事と検索意図を分ける",
          body: "CMPの平坦化原理と不良はCMP工程記事、研磨ヘッド・定盤・終点・洗浄はCMP装置メーカー記事で説明します。本記事はスラリー材料、用途、企業、比較・認定方法を扱います。",
        },
      ],
      paragraphs: [
        "フジミインコーポレーテッドはCMPを、薬液による化学反応と砥粒による機械作用を組み合わせる加工として説明し、用途別の液状研磨材を公開しています。Entegrisもスラリー化学、パッド、洗浄、ろ過・監視を統合したCMPソリューションを示しています。",
        "研磨速度が高くても、面内均一性、停止性、ディッシング、スクラッチ、粒子残り、腐食が悪化すれば量産には適しません。スラリーは装置・パッド・洗浄・計測と組み合わせて評価します。",
      ],
    },
    {
      id: "abrasives",
      heading: "シリカ・セリア・アルミナなどは、硬さだけでなく表面反応が違う",
      lead: "砥粒は材料を削るだけでなく、表面・添加剤・パッドとの界面を作ります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "砥粒・方式",
          rightLabel: "特徴と確認すること",
          rows: [
            { left: "コロイダルシリカ", right: "液中で形成・分散したシリカ粒子。粒径・表面電荷・分散性を調整し、酸化膜・金属・基板など幅広い用途で使う" },
            { left: "ヒュームドシリカ", right: "気相反応由来のシリカを分散して使う。凝集構造、粒度分布、表面状態と傷・研磨速度の関係を見る" },
            { left: "セリア", right: "酸化セリウム砥粒。酸化膜表面との相互作用を利用し、STIや絶縁膜研磨などで高い速度・選択性を設計する" },
            { left: "アルミナ", right: "比較的硬い酸化物砥粒。金属・基板など用途に合わせ、傷、表面粗さ、分散、腐食を管理する" },
            { left: "その他・複合粒子", right: "対象材料、低欠陥、高選択性、低砥粒濃度などの要求に合わせ、材質・被覆・表面修飾を設計する" },
            { left: "砥粒を減らす設計", right: "化学作用やパッド作用を活用して砥粒濃度を下げ、粒子欠陥と廃液負荷を抑える。速度・安定性との両立を見る" },
          ],
        },
        {
          type: "note",
          title: "硬い砥粒ほど優れているわけではない",
          body: "対象膜、表面反応、粒径、荷重、パッド、速度で傷と除去量が変わります。砥粒材質だけを性能順位へ変換しません。",
        },
      ],
      paragraphs: [
        "レゾナックは、液相合成した微小なナノセリア砥粒と添加剤を組み合わせ、酸化膜と停止膜の選択性や低欠陥を調整する製品を公開しています。フジミは用途別に砥粒・薬液を設計したスラリーを展開しています。",
        "平均粒径が安定していても、少量の粗大粒子や凝集体が傷につながる場合があります。平均値だけでなく粒度分布の裾、粗大粒子数、経時変化を確認します。",
      ],
    },
    {
      id: "applications",
      heading: "酸化膜・タングステン・銅・バリア膜・基板でスラリー設計が変わる",
      lead: "同じCMPでも、除去対象と停止材料の組み合わせが異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "用途",
          rightLabel: "材料設計の主な論点",
          rows: [
            { left: "酸化膜・STI", right: "酸化膜を必要速度で除去し、窒化膜などの停止膜への選択性、段差解消、スクラッチ、残粒子を管理する" },
            { left: "層間絶縁膜", right: "酸化膜・低誘電率膜などの平坦化速度、パターン密度依存、膜へのダメージを管理する" },
            { left: "タングステン", right: "金属を反応・除去し、バリア膜・絶縁膜で止める。腐食、残膜、リセス、粒子欠陥を抑える" },
            { left: "銅", right: "銅の酸化・錯形成・腐食抑制を釣り合わせ、ディッシング、残渣、バリア膜との連続研磨を管理する" },
            { left: "バリア・機能金属", right: "複数の金属・窒化物を対象に、銅・絶縁膜との選択性、表面粗さ、腐食、終点を調整する" },
            { left: "ポリシリコン・ゲート材料", right: "シリコン系膜や複数の仕事関数金属を、下地と立体構造を守りながら平坦化する" },
            { left: "SiC・GaN・サファイアなどの基板", right: "硬質基板の加工速度と表面粗さ、加工変質層、傷、洗浄性を両立し、次の結晶成長へ渡す" },
          ],
        },
      ],
      paragraphs: [
        "フジミは酸化膜、タングステン、ポリシリコン、銅、バリア膜など、Entegrisは誘電体、タングステン、アルミニウム、バリア膜に加え、SiC・GaN・サファイアなどの基板研磨用スラリーを公開しています。",
        "レゾナックは低欠陥・高研磨速度のセリア系と、銅・バリア金属向けコロイダルシリカ系を示し、BASFは酸化膜、銅、バリア膜向けのシリーズを案内しています。企業ごとに公開範囲が違うため、同じ対象材料へそろえます。",
      ],
    },
    {
      id: "performance",
      heading: "研磨速度・選択性・平坦度・欠陥にはトレードオフがある",
      lead: "一つの高い数値ではなく、工程窓と研磨後表面で判断します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "RATE", title: "研磨速度", body: "必要時間で対象膜を除去し、生産性と終点制御を両立します。" },
            { label: "SELECTIVITY", title: "材料選択性", body: "対象膜を除去しながら、停止膜・下地・隣接材料を残します。" },
            { label: "PLANARITY", title: "平坦化性能", body: "段差を減らし、ディッシング・エロージョン・リセスを抑えます。" },
            { label: "DEFECT", title: "傷・粒子", body: "粗大粒子、凝集、異物、パッド状態によるスクラッチと残粒子を減らします。" },
            { label: "SURFACE", title: "表面品質", body: "粗さ、腐食、残渣、膜ダメージを抑え、洗浄後の表面を整えます。" },
            { label: "WINDOW", title: "工程安定性", body: "濃度、流量、温度、pH、使用時間、装置・パッド変動へ耐える範囲を見ます。" },
          ],
        },
        {
          type: "note",
          title: "研磨速度だけを企業順位にしない",
          body: "膜、パターン、砥粒濃度、パッド、圧力、回転、温度、装置、終点が違えば比較できません。同じウェーハ構造と工程条件で評価します。",
        },
      ],
      paragraphs: [
        "速度を上げるため反応性や砥粒作用を強めると、停止膜の除去、腐食、傷、パターン依存性が増える場合があります。低欠陥化のため砥粒を減らすと、速度や工程安定性が変わる可能性があります。",
        "スラリー単体の評価に加え、研磨後洗浄で砥粒・添加成分を除去できるか、乾燥後に粒子・染み・腐食が残らないかを確認します。",
      ],
    },
    {
      id: "particle-control",
      heading: "分散・ろ過・希釈・循環が、粗大粒子と傷を左右する",
      lead: "工場へ届いた後も、スラリーの粒子状態は変化します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "供給管理項目",
          rightLabel: "確認すること",
          rows: [
            { left: "分散・沈降", right: "砥粒表面、pH、イオン強度、温度、保管時間、撹拌で凝集・沈降・再分散性がどう変わるかを見る" },
            { left: "粗大粒子数", right: "平均粒径とは別に、大きな粒子・凝集体の個数と分布の裾を測定する" },
            { left: "ろ過", right: "必要な砥粒を過剰に捕捉せず、粗大粒子・異物を減らせるフィルター、流量、差圧を選ぶ" },
            { left: "希釈・混合", right: "高濃度原液を純水・添加液と混ぜる際の順序、せん断、気泡、局所濃度、容器・配管清浄度を管理する" },
            { left: "循環・供給", right: "デイタンク、ポンプ、バルブ、配管、戻り流れによる凝集、発泡、温度上昇、成分吸着を抑える" },
            { left: "使用期限・廃棄", right: "調製後時間、開封後、装置内滞留、濃度・粒子変化を規定し、排液を適切に処理する" },
          ],
        },
      ],
      paragraphs: [
        "Entegrisは、粗大粒子や凝集体が微小な傷につながることを説明し、スラリー、フィルター、粒子計測、濃度監視をCMPの統合管理として示しています。",
        "強い撹拌やポンプで均一化しようとしても、過剰なせん断が凝集・発泡・成分変化へつながる場合があります。材料メーカーの推奨と供給設備の実流体条件を合わせます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体CMPスラリーの代表企業4社",
      lead: "各社の公式製品を、対象材料と周辺ソリューションへ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "フジミインコーポレーテッド", right: "酸化膜、タングステン、ポリシリコン、銅、バリア膜など用途別CMPスラリーとリンス材料を展開" },
            { left: "レゾナック", right: "低欠陥・高研磨速度のセリア系、銅・バリア金属向けコロイダルシリカ系などを展開" },
            { left: "Entegris", right: "誘電体、タングステン、アルミニウム、バリア膜、硬質基板向けスラリーに加え、パッド、洗浄、ろ過・監視を展開" },
            { left: "BASF", right: "酸化膜、銅、バリア膜向けのCMPスラリーと研磨後洗浄材料、量産導入支援を展開" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、市場順位ではない",
          body: "製品、地域、製造拠点、顧客認定は変わります。異なる膜・装置・評価条件の数値を横並びにせず、公式製品を工程へ置く例として紹介します。",
        },
      ],
      paragraphs: [
        "フジミは幅広いデバイス膜、レゾナックはセリア系を含む材料、Entegrisは材料から汚染管理までの統合領域、BASFは用途別スラリーと洗浄・現地支援を公式に示しています。",
        "企業研究では製品名の数だけでなく、砥粒の自社設計・製造、薬液処方、ウェーハ評価、分析、ろ過・供給、研磨後洗浄、顧客近接拠点を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "CMPスラリーメーカーは、8つの条件をそろえて比較する",
      lead: "企業名の比較を、材料・表面・量産供給の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象工程・膜", right: "STI、絶縁膜、タングステン、銅、バリア、ゲート材料、基板研磨のどこか" },
            { left: "2. 砥粒", right: "シリカ、セリア、アルミナなどの材質、粒径、形状、表面、濃度、分布、粗大粒子" },
            { left: "3. 化学機能", right: "酸化、錯形成、pH、分散、腐食抑制、選択制御、濡れ、研磨後洗浄との適合" },
            { left: "4. 研磨性能", right: "速度、面内均一性、選択性、終点、ディッシング、エロージョン、表面粗さ" },
            { left: "5. 欠陥・清浄度", right: "スクラッチ、粒子残り、金属汚染、腐食、残渣、乾燥後表面、ロット変動" },
            { left: "6. 供給・装置適合", right: "濃縮・使用濃度、希釈、混合、ろ過、容器、ポンプ、配管、パッド、装置との適合" },
            { left: "7. 拠点・支援", right: "製造・評価拠点、供給距離、複数ソース、技術支援、分析、トラブル対応、増産余力" },
            { left: "8. 認定・変更管理", right: "サンプル、ウェーハ評価、長期試験、原料・処方・設備・工場・容器・分析法の変更通知" },
          ],
        },
      ],
      paragraphs: [
        "まず対象膜と停止膜を固定してください。酸化膜用と金属用、デバイス形成用とSiC基板用では、必要な反応、砥粒、研磨速度、欠陥基準が異なります。",
        "次に装置・パッド・洗浄までそろえます。同じスラリーでも、パッド、圧力、流量、ろ過、希釈、研磨後洗浄が変われば結果も変わります。",
      ],
    },
    {
      id: "jobs",
      heading: "CMPスラリーメーカーの仕事は、材料設計からウェーハ評価まで広い",
      lead: "化学、微粒子、表面、分析、量産製造、アプリケーションが連携します。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "FORMULATION", title: "処方・材料開発", body: "砥粒、反応剤、分散、pH、選択性、腐食抑制、保存安定性を設計します。" },
            { label: "PARTICLE", title: "粒子・分散技術", body: "粒子合成、表面処理、粒度分布、凝集、沈降、ろ過を制御します。" },
            { label: "APPLICATION", title: "CMP評価", body: "装置・パッド・膜構造をそろえ、速度、平坦度、選択性、欠陥を評価します。" },
            { label: "ANALYTICS", title: "分析・品質保証", body: "組成、粒子、金属、pH、濃度、機能、ロット変動を測定・判定します。" },
            { label: "PRODUCTION", title: "製造技術", body: "原料、混合、分散、ろ過、充填、洗浄、スケールアップを管理します。" },
            { label: "EQUIPMENT", title: "供給・流体技術", body: "容器、ポンプ、配管、バルブ、フィルター、希釈、循環を設計します。" },
            { label: "EHS", title: "安全・環境", body: "化学品法規、SDS、作業安全、排液、容器、使用量削減を管理します。" },
            { label: "CUSTOMER", title: "営業・技術支援", body: "顧客の膜・装置・不良を材料課題へ分解し、認定と量産導入を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人を見るときは、砥粒合成、処方開発、ウェーハ研磨評価、分析、製造、顧客支援のどこを担当するかを確認します。同じCMP材料部門でも必要な専門が異なります。",
        "化学・材料、コロイド、セラミックス、表面科学、分析、生産技術、品質、流体設備の経験を接続できます。具体的な仕事内容は公式求人と配属拠点で確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体CMPスラリーメーカーでよくある質問",
      lead: "材料と工程の関係を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "CMPスラリーとは何ですか？", answer: "微細な砥粒を液体へ分散し、反応剤、酸化剤、pH調整剤、分散剤などを加え、化学作用と機械作用で半導体薄膜・基板を平坦化する研磨材料です。" },
            { question: "主なCMPスラリーメーカーは？", answer: "この記事ではフジミインコーポレーテッド、レゾナック、Entegris、BASFを代表例として紹介しています。製品領域別の例であり、網羅的な市場順位ではありません。" },
            { question: "CMPスラリーと高純度薬液の違いは？", answer: "CMPスラリーは通常、砥粒と薬液成分を組み合わせて研磨します。高純度薬液は砥粒を含まない洗浄液・加工液なども広く含みます。ただし分類は製品と企業で異なります。" },
            { question: "シリカとセリアの違いは？", answer: "砥粒の材質と表面化学が異なります。セリアは酸化膜との相互作用を利用する用途、シリカは酸化膜・金属・基板など幅広い用途があります。材質だけでなく粒径、表面、添加剤、装置条件で選びます。" },
            { question: "研磨速度が高いスラリーほど良いですか？", answer: "一概には言えません。選択性、終点、平坦度、傷、粒子、腐食、研磨後洗浄、生産性を同時に満たす必要があります。" },
            { question: "スラリーはそのまま装置へ入れますか？", answer: "使用濃度品を供給する場合と、濃縮品を工場内で希釈・混合する場合があります。保管、撹拌、ろ過、循環、使用期限を材料仕様に合わせます。" },
            { question: "CMP装置メーカーとスラリーメーカーの違いは？", answer: "装置メーカーは保持、圧力、回転、パッド、終点、洗浄を制御します。スラリーメーカーは砥粒と化学成分で反応、除去、選択性、欠陥を設計します。量産評価では両方を組み合わせます。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象膜・砥粒・選択性・欠陥・供給をそろえてメーカーを見る",
      lead: "CMPスラリーは、表面化学と粒子を平坦化性能へ変える工程材料です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MATERIAL", title: "対象膜を決める", body: "除去する膜、停止膜、隣接材料、最終表面を確認する" },
            { label: "DESIGN", title: "砥粒と化学を合わせる", body: "材質、粒径、反応、pH、分散、腐食抑制を設計する" },
            { label: "RESULT", title: "速度と欠陥を見る", body: "研磨速度、選択性、平坦度、傷、粒子、腐食を評価する" },
            { label: "PRODUCTION", title: "供給工程まで見る", body: "製造、ろ過、容器、希釈、循環、パッド、洗浄、変更認定を確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "化学作用と機械作用で平坦化する原理を見る" },
            { label: "CMP装置メーカー", href: "/guides/semiconductor-cmp-equipment-manufacturers", description: "研磨ヘッド・定盤・終点・洗浄と主要企業を見る" },
            { label: "高純度薬液メーカー", href: "/guides/semiconductor-high-purity-chemical-manufacturers", description: "洗浄・加工用液体材料と供給管理を見る" },
            { label: "検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "膜厚・段差・傷・粒子を工程へ戻す流れを見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "CMPが前工程のどこで使われるかを見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "材料・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つのCMP用途を選び、対象膜、砥粒、化学機能、研磨性能、欠陥・清浄度、供給・装置適合、拠点・支援、認定・変更管理の8項目で整理してください。",
      ],
    },
  ],
  todayQuest: "フジミインコーポレーテッド・レゾナック・Entegris・BASFから1社を選び、公式製品を対象膜・砥粒・化学機能・研磨性能・欠陥・供給の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-cmp-process",
    "semiconductor-cmp-equipment-manufacturers",
    "semiconductor-high-purity-chemical-manufacturers",
    "semiconductor-cleaning-process",
    "semiconductor-interconnect-process",
    "semiconductor-deposition-process",
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-silicon-wafer-manufacturing",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
