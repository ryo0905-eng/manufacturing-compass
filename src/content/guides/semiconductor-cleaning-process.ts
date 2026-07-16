import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCleaningProcessGuide: GuideArticle = {
  slug: "semiconductor-cleaning-process",
  title: "半導体の洗浄とは？汚染の種類・ウェット洗浄・乾燥を初心者向けに図解",
  description:
    "半導体の洗浄工程を初心者向けに図解。パーティクル、有機物、金属汚染、自然酸化膜を何のために除去するのか、薬液処理・物理洗浄・純水リンス・乾燥、RCA洗浄、枚葉式とバッチ式の違いを整理します。",
  targetQuery: "半導体 洗浄 とは",
  searchIntent:
    "半導体製造で洗浄を繰り返す理由、除去する汚染、ウェット洗浄の流れ、RCA洗浄、枚葉式とバッチ式、乾燥の重要性を図で理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "SCREENセミコンダクターソリューションズ、東京エレクトロンの公式技術・製品情報と、RCA洗浄の原著者による解説をもとに、代表的なウェーハ洗浄を整理しています。実際の薬液、濃度、温度、時間、順序は対象材料と工程で変わるため、製造条件としては記載していません。",
  showCareerCtas: false,
  experienceBasis: [
    "SCREENの公式工程解説で、パーティクル、有機汚染、金属汚染、油脂、自然酸化膜などの洗浄対象を確認",
    "東京エレクトロンとSCREENの公式情報で、枚葉式・バッチ式・物理洗浄、リンス、乾燥、パターン倒れの課題を確認",
    "RCA洗浄の原著者による解説で、SC-1・SC-2の反応目的と純水リンスの基本を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "半導体製造プロセス",
      url: "https://www.screen.co.jp/spe/technical/process",
      publisher: "SCREENセミコンダクターソリューションズ",
      accessedAt: "2026-07-15",
    },
    {
      title: "Products and Services: Cleaning",
      url: "https://www.tel.com/product/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Cleaning CELLESTA Series",
      url: "https://www.tel.com/product/cellesta.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Single Wafer Cleaner SU-3300",
      url: "https://www.screen.co.jp/spe/en/products/su-3300",
      publisher: "SCREEN Semiconductor Solutions",
      accessedAt: "2026-07-15",
    },
    {
      title: "Compact Wet Station CW-2000",
      url: "https://www.screen.co.jp/spe/en/products/cw-2000",
      publisher: "SCREEN Semiconductor Solutions",
      accessedAt: "2026-07-15",
    },
    {
      title: "Cleaning and Surface Preparation Technologies at UCPSS 2021",
      url: "https://www.screen.co.jp/spe/en/information/screen-presents-six-new-cleaning-and-surface-preparation-technologies-ucpss-2021",
      publisher: "SCREEN Semiconductor Solutions",
      accessedAt: "2026-07-15",
    },
    {
      title: "Cleaning Solutions Based on Hydrogen Peroxide for Use in Silicon Semiconductor Technology",
      url: "https://garfield.library.upenn.edu/classics1983/A1983QD90200001.pdf",
      publisher: "RCA Laboratories / ISI Citation Classics",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約16分",
  intro: {
    problem: "半導体の洗浄を最初に一度だけウェーハを洗う工程だと思っていませんか。実際には、前の工程で生じた汚染を次へ持ち込まないため、製造途中で何度も使われます。",
    conclusion: "洗浄は、パーティクル、有機物、金属などを対象材料へダメージを与えず除去し、次工程に適した表面を作る工程です。薬液や物理力で汚染を離し、純水で持ち去り、再付着や乾燥跡を残さず乾かすところまでが一続きです。",
    learnings: "洗浄の目的、汚染の種類、ウェット洗浄の流れ、RCA洗浄、枚葉式・バッチ式、ドライ・物理洗浄、乾燥、管理項目、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "洗浄は『汚れを落とす』だけでなく、『必要な材料は残す』『汚れを再付着させない』『乾燥で壊さない』まで含めて考える工程です。",
      caption: "この記事の見方",
    },
    {
      type: "surface-cleaning-flow",
      title: "図解｜洗浄は、除去・リンス・乾燥まで続く",
      description:
        "粒子と薄い残留物がある平坦なウェーハ表面を単純化した概念図です。実際の表面には微細パターンと複数材料があり、方式と条件によって反応は変わります。",
      stages: [
        { kind: "contaminated", label: "BEFORE", title: "汚染が付着", body: "粒子、残留物、金属などが次工程の反応と欠陥へ影響する状態" },
        { kind: "clean", label: "REMOVE", title: "汚染を離す", body: "薬液の反応や物理力で、対象表面から汚染を除去・分散する" },
        { kind: "rinse", label: "RINSE", title: "純水で持ち去る", body: "薬液、溶けた成分、離れた粒子を高純度の水で置き換えて排出する" },
        { kind: "dry", label: "DRY", title: "跡を残さず乾かす", body: "再付着、乾燥跡、微細パターンの倒れを抑え、次工程へ渡す" },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "洗浄は、次工程が正しく始まる表面を作る工程",
      lead: "前工程の汚染を取り除きながら、必要な膜と微細構造はできるだけ変えずに残します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "REMOVE", title: "不要物を除去する", body: "粒子、残留物、金属、不要な表面膜などを目的に合わせて取り除きます。" },
            { label: "PREPARE", title: "表面状態をそろえる", body: "次の成膜、熱処理、接合などが再現よく始まる化学状態へ整えます。" },
            { label: "PROTECT", title: "必要材料を守る", body: "洗浄液や物理力による膜減り、腐食、粗れ、パターンへのダメージを抑えます。" },
          ],
        },
        {
          type: "note",
          title: "洗浄は製造フローの一か所だけではない",
          body: "東京エレクトロンは洗浄を工程と工程の間に必要な処理と位置づけています。成膜前、成膜後、リソグラフィ前、エッチング後、レジスト除去後、CMP後など、目的を変えながら繰り返します。",
        },
      ],
      paragraphs: [
        "表面に残った小さな粒子でも、レジストの塗布むら、露光時の焦点ずれ、薄膜の欠陥、配線の短絡・断線などへつながる可能性があります。背面やウェーハ外周の汚染も、搬送や装置部品を介した再付着の原因になり得ます。",
        "一方で、強い反応ならよいわけではありません。必要な膜を溶かす、表面を粗くする、微細構造を倒す、金属を腐食させると、汚染が減っても工程としては失敗です。除去性能と材料保護を同時に満たす必要があります。",
      ],
    },
    {
      id: "contaminants",
      heading: "洗浄対象は、粒子・有機物・金属・表面膜に分けて考える",
      lead: "汚染によって付着の仕方と除去の仕組みが違うため、同じ方法では落とせません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "PARTICLE", title: "パーティクル", body: "装置、材料、空気、前工程などから付着する固体粒子。微細パターンを覆い、欠陥の起点になります。" },
            { label: "ORGANIC", title: "有機物・残留物", body: "油脂、レジスト、エッチング・アッシング後の残留物など。界面反応や密着へ影響します。" },
            { label: "METAL", title: "金属・イオン汚染", body: "薬液、部品、搬送などから入る微量元素。電気特性や高温工程での拡散へ影響します。" },
            { label: "SURFACE FILM", title: "不要な表面膜", body: "大気中で生じた自然酸化膜など。除去するか残すかは、次工程と必要な界面で決まります。" },
          ],
        },
      ],
      paragraphs: [
        "SCREENは洗浄対象として、超微細なパーティクル、有機汚染、金属汚染、油脂、自然酸化膜などを挙げています。洗浄条件を決める最初の問いは、『汚れがあるか』ではなく『何が、どの材料の上にあるか』です。",
        "同じ物質でも、表面へ弱く付着している場合と、化学結合している場合では除去方法が変わります。粒子を表面から離す力、汚染を溶かす反応、再付着を防ぐ液の流れを組み合わせます。",
      ],
    },
    {
      id: "wet-clean",
      heading: "ウェット洗浄は、化学反応と物理力で汚染を表面から離す",
      lead: "薬液で汚染を分解・溶解・錯体化し、スプレーやブラシなどで粒子除去を助けます。",
      blocks: [
        {
          type: "process-flow",
          title: "代表的なウェット洗浄の流れ",
          description: "一つの概念例です。工程によって前処理、薬液の数、順序、途中リンス、乾燥方式は異なります。",
          stages: [
            { label: "01", title: "表面を濡らす", body: "薬液が表面へ均一に届く状態を作る" },
            { label: "02", title: "薬液処理", body: "対象汚染を酸化、溶解、分散、錯体化などで除去しやすくする" },
            { label: "03", title: "物理力を加える", body: "必要に応じてスプレー、ブラシ、液流などで粒子を離す" },
            { label: "04", title: "純水リンス", body: "薬液と除去した成分を高純度の水で置換して排出する" },
            { label: "05", title: "乾燥", body: "水分と乾燥跡を残さず、微細構造を保って次工程へ渡す" },
          ],
        },
      ],
      paragraphs: [
        "薬液は、汚染だけでなく下地材料とも反応する可能性があります。そのため濃度、温度、時間、供給量、液の更新、材料選択性を管理し、必要な表面だけを作ります。",
        "物理洗浄は化学洗浄の代わりというより、粒子へ働く力を補う手段です。東京エレクトロンは、二流体スプレーやブラシを使う物理洗浄、表裏面・外周・ベベルの洗浄機能を示しています。対象構造が壊れない範囲で力を制御します。",
      ],
    },
    {
      id: "rca-clean",
      heading: "RCA洗浄は、目的の異なる二つの標準洗浄を順番に使う考え方",
      lead: "シリコン表面洗浄の基礎として広く知られますが、現在の量産工程では目的に合わせた改良・置き換えも行われます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "代表ステップ",
          rightLabel: "原著で示された主な考え方",
          rows: [
            { left: "SC-1", right: "過酸化水素・アンモニア・水を使うアルカリ性の処理。主に有機物の酸化分解や粒子・一部金属の除去を狙う" },
            { left: "純水リンス", right: "反応後の薬液、溶けた成分、離れた汚染を高純度の水で持ち去る" },
            { left: "SC-2", right: "過酸化水素・塩酸・水を使う酸性の処理。残る金属・無機汚染の除去を狙う" },
            { left: "酸化膜除去", right: "必要な場合に別の処理で自然酸化膜を除去。次工程が求める表面によって実施有無と順序が変わる" },
          ],
        },
        {
          type: "note",
          title: "名前だけでレシピを決めない",
          body: "SC-1・SC-2の配合、温度、時間、順序は、文献・工場・対象材料で異なります。微細構造や露出材料が増えた現在は、希釈、低温化、枚葉化、別薬液への置き換えなどを含めて選びます。",
        },
      ],
      paragraphs: [
        "KernとPuotinenによるRCA洗浄は、まず有機物を酸化分解し、次に微量金属や吸着イオンを溶解・錯体化し、高純度水でリンスする考え方から発展しました。SCREENのウェットステーションもRCA洗浄への対応を示しています。",
        "RCA洗浄は重要な基礎ですが、すべての工程へそのまま適用できる万能レシピではありません。露出している金属、絶縁膜、低誘電率膜、微細構造などを確認し、必要な汚染だけを除去できる条件を選びます。",
      ],
    },
    {
      id: "equipment-methods",
      heading: "枚葉式・バッチ式・スクラバーは、処理単位と力のかけ方が違う",
      lead: "同じウェット洗浄でも、ウェーハの扱い方で制御性、生産性、薬液使用量が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置・方式",
          rightLabel: "基本的な特徴",
          rows: [
            { left: "枚葉式", right: "ウェーハを一枚ずつ回転・保持し、薬液、純水、乾燥を個別に制御。複数チャンバで生産性を高める構成がある" },
            { left: "バッチ式", right: "複数枚を同じ槽でまとめて処理。まとまった処理能力を得やすく、槽ごとに薬液・リンス・乾燥を構成する" },
            { left: "スクラバー", right: "純水、ブラシ、スプレーなどの物理力を使って粒子を除去。表面、背面、外周の用途がある" },
            { left: "気相・ドライ系", right: "ガス、蒸気、プラズマ、オゾンなどで表面反応を起こす。液体が入りにくい構造や特定残留物などへ使う" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンは枚葉式洗浄装置とバッチ式ウェットステーション、スクラバーを製品群として示しています。SCREENも枚葉式、バッチ式、スピンスクラバーを提供しており、処理目的に合わせて異なる方式が量産で使われています。",
        "SCREENの技術発表には、気相洗浄による酸化膜の選択加工、オゾンガスによるハードマスク除去、エッチング後残留物の除去などが含まれます。ドライ系も一つの方式名ではなく、対象反応と構造に合わせて使い分けます。",
      ],
    },
    {
      id: "drying",
      heading: "乾燥は洗浄の後処理ではなく、歩留まりを左右する工程",
      lead: "表面がきれいでも、乾燥時に跡・再付着・パターン倒れが起きれば次工程へ渡せません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "WATERMARK", title: "乾燥跡", body: "水滴が局所的に残ると、溶けていた成分が濃縮・析出して跡になる可能性があります。" },
            { label: "READHESION", title: "再付着", body: "液中へ離した粒子や反応生成物を排出できないと、表面へ戻る可能性があります。" },
            { label: "PATTERN COLLAPSE", title: "パターン倒れ", body: "微細で高い構造では、乾燥時の液面による力で隣り合うパターンが変形する場合があります。" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンは、異物除去だけでなく乾燥も洗浄と同じく重要と説明しています。IPAを使う乾燥、スピン乾燥、熱風、超臨界流体など、構造と材料に応じた方式があります。",
        "SCREENは、乾燥時の気液界面を制御し、温湿度を管理して微細パターンの倒れを抑える技術を示しています。微細化と三次元化が進むほど、除去性能だけでなく液の置換と乾燥の設計が重要になります。",
      ],
    },
    {
      id: "process-positions",
      heading: "洗浄の目的は、前後工程によって変わる",
      lead: "同じ装置を使っていても、次に何をするかで残すべき表面が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "タイミング",
          rightLabel: "主な目的",
          rows: [
            { left: "成膜・熱処理の前", right: "粒子、金属、有機物、必要に応じて自然酸化膜を除去し、界面と反応をそろえる" },
            { left: "成膜・リソグラフィの後", right: "付着した粒子や背面・外周の汚染を除去し、次の塗布・露光・加工へ渡す" },
            { left: "エッチング・アッシングの後", right: "レジスト由来物、側壁・底部の反応残留物、金属イオンなどを除去する" },
            { left: "CMPの後", right: "研磨粒子、スラリー成分、金属汚染などを除去し、平坦な表面を維持する" },
            { left: "背面・外周", right: "チャック、搬送、露光焦点、装置間の汚染持ち込みへ影響する粒子と膜を管理する" },
          ],
        },
      ],
      paragraphs: [
        "前洗浄では次工程の反応を始められる表面、後洗浄では前工程の副生成物を残さない表面を目指します。洗浄後から次工程までの待ち時間や大気暴露でも表面は変化するため、搬送と保管も工程の一部です。",
        "工程表で『洗浄』が同じ名前でも、目的、対象汚染、露出材料、許容膜減りは異なります。レシピ名より、入力表面と出力表面を確認すると役割を理解しやすくなります。",
      ],
    },
    {
      id: "control-items",
      heading: "洗浄では、除去性能と表面ダメージを同時に管理する",
      lead: "見た目がきれいかではなく、次工程と電気特性に必要な清浄度を測ります。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "PARTICLE", title: "粒子数・分布", body: "洗浄前後の粒径別個数、表面・背面・外周、装置間の差を確認します。" },
            { label: "CHEMICAL", title: "金属・有機汚染", body: "表面分析やモニターウェーハなどで、微量元素と残留成分を評価します。" },
            { label: "MATERIAL LOSS", title: "膜減り・選択性", body: "汚染除去と同時に、必要膜の厚さ、形状、表面終端を変えすぎていないか見ます。" },
            { label: "SURFACE", title: "粗さ・濡れ性・欠陥", body: "表面粗れ、乾燥跡、腐食、傷、パターン倒れなどを確認します。" },
            { label: "PROCESS", title: "濃度・温度・時間", body: "薬液濃度、温度、供給量、処理時間、純水品質、乾燥条件を管理します。" },
            { label: "TOOL", title: "槽・チャンバ・部品状態", body: "配管、ノズル、ブラシ、フィルター、槽、搬送部からの汚染を監視します。" },
          ],
        },
      ],
      paragraphs: [
        "洗浄装置自身が汚染源にならないことも重要です。薬液純度、純水、フィルター、配管材、チャンバ内の気流、消耗部品、メンテナンス後の立ち上げを管理します。",
        "洗浄効果は、粒子検査、表面分析、膜厚・粗さ測定、接触角、欠陥検査、電気特性などを組み合わせて評価します。どの測定を使うかは、取り除く汚染と次工程の要求で決まります。",
      ],
    },
    {
      id: "equipment-roles",
      heading: "洗浄工程には、表面化学・流体・機械・分析・環境技術が集まる",
      lead: "除去性能に加え、薬液と純水の使用量、排水、安全性、生産性まで設計します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス", right: "対象汚染と材料に合わせ、薬液、物理力、リンス、乾燥条件を設計する" },
            { left: "材料・化学", right: "表面反応、溶解、錯体化、再付着、腐食、表面終端を解析する" },
            { left: "装置・流体", right: "槽、チャンバ、ノズル、回転、温調、気流、搬送と均一性を設計・維持する" },
            { left: "計測・解析", right: "粒子、金属、有機物、膜減り、粗さ、欠陥を測り、原因を切り分ける" },
            { left: "設備・安全", right: "薬液、純水、排気、排水、除害、漏えい監視と保護具を管理する" },
            { left: "環境・生産", right: "薬液・純水・エネルギー使用量、廃液、処理能力、装置稼働率を改善する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "枚葉式・バッチ式・スクラバーと主要企業を見る" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "チャンバ洗浄・パージ用ガスと供給・除害を見る" },
            { label: "高純度薬液メーカー", href: "/guides/semiconductor-high-purity-chemical-manufacturers", description: "洗浄液、純度、容器・供給と主要企業を見る" },
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "洗浄が前工程の反復のどこに入るか確認する" },
            { label: "シリコンウェーハ製造の仕組み", href: "/guides/semiconductor-silicon-wafer-manufacturing", description: "鏡面研磨後の洗浄・検査で清浄な基板を作る前段階を見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "洗浄後の表面へPVD・CVD・ALDで膜を作る原理を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "加工後に残留物を生む可能性がある前工程を断面図で見る" },
            { label: "イオン注入・拡散の仕組み", href: "/guides/semiconductor-ion-implantation-process", description: "洗浄した表面へドーパントを導入し、活性化する工程を見る" },
            { label: "酸化・熱処理の仕組み", href: "/guides/semiconductor-oxidation-thermal-process", description: "酸化・拡散前洗浄の後に、膜成長やアニールを行う流れを見る" },
            { label: "CMP・平坦化の仕組み", href: "/guides/semiconductor-cmp-process", description: "研磨後に残る砥粒・研磨くずを除去する前工程との接点を見る" },
            { label: "ウェーハ欠陥検査装置メーカー", href: "/guides/semiconductor-wafer-defect-inspection-manufacturers", description: "洗浄後の粒子・傷・表面異常を光学検査で探す仕組みを見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、装置、材料、計測を担う企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "SCREEN、東京エレクトロンなどが枚葉式・バッチ式・スクラバーなどの洗浄装置を提供しています。デバイスメーカーでは、洗浄単体ではなく、成膜、リソグラフィ、エッチング、熱処理、CMPとの接続を含めて表面状態を管理します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の洗浄でよくある質問",
      lead: "洗浄対象、方式、乾燥を混同しないための基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の洗浄とは何ですか？", answer: "ウェーハ表面の粒子、有機物、金属、不要な表面膜などを除去し、次工程に適した清浄な表面を作る工程です。薬液処理だけでなく、純水リンスと乾燥まで含めて考えます。" },
            { question: "なぜ洗浄を何度も行うのですか？", answer: "成膜、リソグラフィ、エッチング、CMPなどの各工程で新しい粒子や残留物が生じ、次工程が求める表面も異なるためです。目的を変えながら工程間で繰り返します。" },
            { question: "RCA洗浄とは何ですか？", answer: "過酸化水素を基礎とするアルカリ性のSC-1と酸性のSC-2を組み合わせた、シリコン洗浄の代表的な考え方です。主な除去対象が異なり、実際の条件は材料と工程に合わせて変更されます。" },
            { question: "枚葉式とバッチ式の違いは？", answer: "枚葉式は一枚ずつ薬液供給、回転、リンス、乾燥を制御します。バッチ式は複数枚を同じ槽でまとめて処理します。制御性、生産性、薬液使用量、対象工程で使い分けます。" },
            { question: "純水ですすぐだけでは不十分ですか？", answer: "弱く付着した一部の粒子には有効でも、化学結合した有機物、金属、反応残留物などは薬液反応や物理力が必要な場合があります。一方、薬液処理後には薬液と除去物を持ち去る十分なリンスが必要です。" },
            { question: "洗浄後の乾燥はなぜ重要ですか？", answer: "水分や溶解成分が残ると乾燥跡や再付着が起きる可能性があります。微細で高い構造では、液面に働く力でパターンが倒れる場合もあるため、乾燥方式と条件を工程として管理します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜何を落とし、何を残し、どう乾かすかを見る",
      lead: "洗浄は、次工程へ渡す表面を設計する工程です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "TARGET", title: "汚染を特定する", body: "粒子、有機物、金属、表面膜のどれを除去するか決める" },
            { label: "SELECTIVITY", title: "必要材料を守る", body: "薬液と物理力による膜減り、腐食、粗れ、構造ダメージを抑える" },
            { label: "FINISH", title: "リンスと乾燥で仕上げる", body: "除去物を持ち去り、再付着、乾燥跡、パターン倒れを防ぐ" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、シリコンへ不純物を導入して電気的性質を変えるイオン注入・拡散を取り上げ、洗浄された表面から素子の機能を作る流れをつなぎます。",
      ],
    },
  ],
  todayQuest: "身近な洗浄を例に、『除去対象』『守る材料』『すすぎと乾燥』の三つを分けて説明する",
  relatedGuideSlugs: [
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-gas-manufacturers",
    "semiconductor-high-purity-chemical-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-silicon-wafer-manufacturing",
    "semiconductor-deposition-process",
    "photolithography-process",
    "semiconductor-etching-process",
    "semiconductor-ion-implantation-process",
    "semiconductor-oxidation-thermal-process",
    "semiconductor-cmp-process",
    "semiconductor-wafer-defect-inspection-manufacturers",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["screen", "tokyo-electron"],
};
