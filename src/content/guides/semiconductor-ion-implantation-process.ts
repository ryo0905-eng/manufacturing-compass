import type { GuideArticle } from "@/content/guides/types";

export const semiconductorIonImplantationProcessGuide: GuideArticle = {
  slug: "semiconductor-ion-implantation-process",
  title: "半導体のイオン注入・拡散とは？ドーピングと活性化アニールを初心者向けに図解",
  description:
    "半導体のイオン注入・拡散工程を初心者向けに図解。ドーピングでp型・n型を作る目的、イオン源・質量分離・加速・注入の流れ、注入量・エネルギー・角度、結晶ダメージ、活性化アニール、熱拡散との違いを整理します。",
  targetQuery: "半導体 イオン注入 とは",
  searchIntent:
    "半導体のイオン注入が何をする工程か、注入量・エネルギー・角度で何が変わるか、活性化アニールと熱拡散がなぜ必要かを図で理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Axcelis、Applied Materials、住友重機械工業、SCREEN、東京エレクトロン、Samsung Semiconductor、東芝デバイス＆ストレージの公式技術情報をもとに、シリコンを中心とした代表的なドーピング工程を整理しています。実際の注入種、注入量、エネルギー、角度、熱処理条件はデバイスと材料で変わります。",
  showCareerCtas: false,
  experienceBasis: [
    "Axcelis、Applied Materials、住友重機械工業の公式情報で、注入種・注入量・エネルギー・角度と濃度・深さの関係を確認",
    "SCREENの公式情報で、注入後の結晶回復、ドーパント活性化、拡散抑制を両立する短時間アニールの役割を確認",
    "Samsung Semiconductor、東芝デバイス＆ストレージの公式解説で、p型・n型とpn接合を作るドーピングの目的を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Ion Implantation in Silicon Technology",
      url: "https://www.axcelis.com/wp-content/uploads/2019/02/Ion_Implantation_in_Silicon_Technology.pdf",
      publisher: "Axcelis Technologies",
      accessedAt: "2026-07-15",
    },
    {
      title: "Applied Materials Introduces Critical Ion Implant Technology for Scaling Future Chips",
      url: "https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-introduces-critical-ion-implant-technology/",
      publisher: "Applied Materials",
      accessedAt: "2026-07-15",
    },
    {
      title: "Ion Implanters",
      url: "https://www.shi.co.jp/english/products/machinery/ion/index.html",
      publisher: "Sumitomo Heavy Industries",
      accessedAt: "2026-07-15",
    },
    {
      title: "SCREEN Boosts the Capabilities of Cutting-Edge Semiconductor Devices with a New Annealing System",
      url: "https://www.screen.co.jp/eng/spe/mt-images/SPE170710-3E.pdf",
      publisher: "SCREEN Semiconductor Solutions",
      accessedAt: "2026-07-15",
    },
    {
      title: "Deposition TELINDY Series",
      url: "https://www.tel.com/product/telindy.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Giving Semiconductors Electrical Properties: Deposition and Ion Implantation",
      url: "https://semiconductor.samsung.com/support/tools-resources/fabrication-process/eight-essential-semiconductor-fabrication-processes-part-6-deposition-and-ion-implantation-for-the-electrical-properties/",
      publisher: "Samsung Semiconductor",
      accessedAt: "2026-07-15",
    },
    {
      title: "What is a diode?",
      url: "https://toshiba.semicon-storage.com/us/semiconductor/knowledge/faq/diode/what-are-diodes.html",
      publisher: "Toshiba Electronic Devices & Storage",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約17分",
  intro: {
    problem: "イオン注入を『不純物を打ち込む工程』と覚えても、何をどこまで入れるのか、なぜ注入後に熱処理するのか、拡散とは何が違うのか分かりにくくありませんか。",
    conclusion: "イオン注入は、電荷を持たせたドーパントを加速し、選んだ場所と深さへ導入する工程です。注入量で濃度、エネルギーで深さ、角度で結晶方向との関係を制御し、後続アニールで結晶ダメージを回復してドーパントを電気的に働ける状態へします。",
    learnings: "ドーピングの目的、p型・n型、イオン注入装置の流れ、注入量・エネルギー・角度、濃度分布、マスク、チャネリング、活性化アニール、熱拡散、管理項目、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "イオン注入は『何を入れるか』だけでなく、『いくつ』『どの深さへ』『どの角度から』入れ、熱処理後にどう分布するかで見ると整理しやすくなります。",
      caption: "この記事の見方",
    },
    {
      type: "dopant-profile",
      title: "図解｜注入量・エネルギー・アニールで濃度分布が変わる",
      description:
        "紫・青の点がドーパント、灰色が基板の概念図です。実際の濃度は一つの深さへそろわず分布を持ち、結晶方位、材料、注入種、後続熱処理でも変わります。",
      panels: [
        {
          kind: "dose",
          label: "DOSE / 注入量",
          title: "入れる数を決める",
          control: "単位面積あたりに入射するイオン数をビーム電流と走査・処理時間などで管理",
          effect: "主にドーパント濃度と電気抵抗へ影響。多ければよいとは限らない",
        },
        {
          kind: "energy",
          label: "ENERGY / エネルギー",
          title: "入る深さを決める",
          control: "電界でイオンを加速し、運動エネルギーを調整",
          effect: "一般に高いほど平均到達深さが増える。深さ方向には統計的な広がりがある",
        },
        {
          kind: "anneal",
          label: "ANNEAL / 熱処理",
          title: "電気的に働かせる",
          control: "温度、時間、昇降温速度、雰囲気、加熱方式を調整",
          effect: "結晶を回復し活性化する一方、熱を加えると濃度分布が広がる可能性がある",
        },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "ドーピングは、シリコン中の電荷の運び手を制御する",
      lead: "意図して少量の不純物を加え、トランジスタやダイオードに必要なp型・n型領域を作ります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "N-TYPE", title: "電子を増やす領域", body: "シリコンではリンやヒ素などのドナーを導入し、電子を主な電荷の運び手にします。" },
            { label: "P-TYPE", title: "正孔を増やす領域", body: "シリコンではホウ素などのアクセプターを導入し、正孔を主な電荷の運び手にします。" },
            { label: "JUNCTION", title: "境界で機能を作る", body: "p型とn型の濃度・位置関係を作り、pn接合、ウェル、ソース・ドレインなどを形成します。" },
          ],
        },
        {
          type: "note",
          title: "ドーパントは『汚染』ではなく、意図して加える元素",
          body: "金属汚染のような予期しない不純物とは異なり、ドーパントは種類、量、深さ、位置を設計して導入します。ただし、狙いと異なる元素や濃度は電気特性を乱すため、高い純度と汚染管理が必要です。",
        },
      ],
      paragraphs: [
        "Samsung Semiconductorは、ホウ素などの13族元素を導入するとp型、リンやヒ素などの15族元素を導入するとn型の領域を作れると説明しています。東芝デバイス＆ストレージも、pn接合の層をイオン注入または熱拡散で形成する例を示しています。",
        "ドーピングで作るのは単なる『導電層』ではありません。濃度が深さ方向と横方向でどのように変わるかによって、しきい値電圧、抵抗、接合深さ、漏れ電流、耐圧などが変わります。",
      ],
    },
    {
      id: "process-flow",
      heading: "イオン注入装置は、目的のイオンだけを選び、加速してウェーハへ運ぶ",
      lead: "電荷を持つ粒子は、電界と磁界で加速・曲げ・選別できます。",
      blocks: [
        {
          type: "process-flow",
          title: "代表的なビームライン式イオン注入の流れ",
          description: "装置構成を単純化した概念です。イオン源、加速・減速、質量分析、走査の順序と方式は装置によって異なります。",
          stages: [
            { label: "01", title: "イオンを作る", body: "原料ガスや固体原料から目的元素を含むイオンを生成" },
            { label: "02", title: "目的種を選ぶ", body: "磁界などで質量と電荷の違いを利用し、不要なイオンを分離" },
            { label: "03", title: "加速する", body: "電位差で必要な運動エネルギーまで加速または減速" },
            { label: "04", title: "ビームを整える", body: "輸送、集束、角度、電流、エネルギー純度を調整" },
            { label: "05", title: "ウェーハを走査", body: "ビームまたはウェーハを動かし、面内へ均一に注入" },
            { label: "06", title: "熱処理する", body: "結晶ダメージを回復し、ドーパントを電気的に活性化" },
          ],
        },
      ],
      paragraphs: [
        "イオン源では、目的元素を含む原料から複数のイオンや分子片が生じます。質量分析磁石などで軌道を分け、必要な質量電荷比の成分を選びます。その後、決めたエネルギーと電流のビームへ整えます。",
        "ウェーハ全面の同じ場所へ当て続けるのではなく、ビームまたはウェーハを走査して面内分布をそろえます。住友重機械工業は、エネルギー、注入量、注入角度などを高精度に制御するイオン注入装置を示しています。",
      ],
    },
    {
      id: "controls",
      heading: "注入種・注入量・エネルギー・角度が、基本の四つの制御軸",
      lead: "装置条件とデバイス設計を結びつける中心的なパラメータです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "制御軸",
          rightLabel: "主に決めること",
          rows: [
            { left: "注入種", right: "p型・n型、電気特性、原子質量、結晶との相互作用。B、P、Asなどが代表例" },
            { left: "注入量（dose）", right: "単位面積あたりのイオン数。主に濃度と抵抗へ影響" },
            { left: "エネルギー", right: "イオンの平均到達深さと分布幅。高エネルギー用途では深い領域を形成" },
            { left: "角度", right: "結晶軸、立体構造、マスク端との関係。チャネリングと影の影響を調整" },
          ],
        },
      ],
      paragraphs: [
        "Axcelisは、濃度と深さを注入量とエネルギーとして装置設定へ直接対応させやすい点をイオン注入の特徴として説明しています。Applied Materialsも、ドーパント濃度と深さプロファイル、注入量、角度の精密制御を重視しています。",
        "ただし、設定値がそのまま完成後の活性ドーパント分布になるわけではありません。注入中の散乱、結晶方位、マスク、表面膜、後続アニールで分布と電気的な有効濃度が変わります。",
      ],
    },
    {
      id: "distribution",
      heading: "イオンは一つの深さで止まらず、統計的な濃度分布を作る",
      lead: "基板原子との衝突を繰り返すため、平均深さの周囲に広がりを持ちます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "RANGE", title: "平均到達深さ", body: "注入したイオンが多く止まる代表的な深さ。エネルギーと注入種、材料で変わります。" },
            { label: "STRAGGLE", title: "深さのばらつき", body: "衝突経路が同じではないため、平均値の前後へ濃度分布が広がります。" },
            { label: "LATERAL", title: "横方向の広がり", body: "マスク開口の直下だけでなく、散乱により横方向にも分布が広がります。" },
          ],
        },
        {
          type: "note",
          title: "深さはエネルギーだけで決まらない",
          body: "軽い元素と重い元素では同じエネルギーでも止まり方が異なります。基板材料、表面膜、結晶方位、入射角、後続熱処理も含めて最終分布を設計します。",
        },
      ],
      paragraphs: [
        "イオンは電子との相互作用や基板原子との衝突でエネルギーを失い、最終的に止まります。すべてのイオンが同じ経路を通らないため、濃度は深さに対して山形のような分布を持ちます。",
        "複数のエネルギーで注入を重ね、広い深さ範囲へ所望の分布を作る場合もあります。高電圧に耐える領域、浅い接合、低抵抗の接触領域など、用途によって必要な形が違います。",
      ],
    },
    {
      id: "mask-angle",
      heading: "マスクと注入角度で、ドーピングする場所を選ぶ",
      lead: "リソグラフィで作った開口や既存の構造を使い、必要な領域へ選択的に注入します。",
      blocks: [
        {
          type: "layer-process",
          title: "工程前後｜開口部だけへドーパントを導入する",
          description: "平坦なシリコンへ選択注入する概念図です。実際には酸化膜、ハードマスク、立体構造なども使われます。",
          stages: [
            {
              label: "MASK",
              title: "注入場所を開ける",
              body: "レジストや膜厚のあるマスクで、注入しない場所を遮蔽します。",
              layers: [
                { label: "注入マスク", tone: "resist", pattern: "openings" },
                { label: "シリコン", tone: "substrate" },
              ],
            },
            {
              label: "IMPLANT",
              title: "開口へイオンを入れる",
              body: "エネルギー、注入量、角度を制御して局所的な分布を作ります。",
              signal: "ION BEAM",
              layers: [
                { label: "注入マスク", tone: "resist", pattern: "openings" },
                { label: "注入領域", tone: "film", pattern: "inverse-openings" },
                { label: "シリコン", tone: "substrate" },
              ],
            },
            {
              label: "ANNEAL",
              title: "活性領域へ仕上げる",
              body: "マスクを除去し、熱処理で結晶回復と活性化を進めます。",
              layers: [
                { label: "活性化した領域", tone: "film", pattern: "inverse-openings" },
                { label: "シリコン", tone: "substrate" },
              ],
            },
          ],
        },
      ],
      paragraphs: [
        "結晶の原子配列には、特定方向から見ると衝突が少ない通り道があります。イオンがその方向へ入ると想定より深く進むチャネリングが起こり得るため、ウェーハの傾きと回転角を管理します。",
        "立体構造へ斜めに注入する場合は、片側が構造の影に入りやすくなります。角度を変えて複数回処理する、回転させるなど、必要領域へ分布を作る工夫を行います。",
      ],
    },
    {
      id: "damage-anneal",
      heading: "注入後のアニールは、結晶を回復しドーパントを活性化する",
      lead: "イオンを衝突させただけでは、すべてが電気的に働ける位置へ入るわけではありません。",
      blocks: [
        {
          type: "process-flow",
          title: "注入から活性化までに起こること",
          description: "シリコン中の代表的な考え方です。材料と注入条件によって欠陥と回復挙動は変わります。",
          stages: [
            { label: "01", title: "衝突・減速", body: "入射イオンが電子や基板原子と相互作用しながらエネルギーを失う" },
            { label: "02", title: "結晶欠陥が生じる", body: "基板原子が本来の位置から動き、空孔や格子間原子などが生じる" },
            { label: "03", title: "熱を加える", body: "RTA、フラッシュランプ、レーザーなどで必要な熱履歴を与える" },
            { label: "04", title: "結晶を回復する", body: "移動した原子を再配列させ、注入ダメージを減らす" },
            { label: "05", title: "活性化する", body: "ドーパントを電気的に働きやすい格子位置へ入れる" },
          ],
        },
        {
          type: "note",
          title: "活性化と拡散は、熱履歴に対する二つの側面",
          body: "十分な熱で結晶回復と活性化を進めたい一方、熱を加えすぎるとドーパントが移動して接合が深く・広くなる可能性があります。必要な活性化率と分布維持の両立が重要です。",
        },
      ],
      paragraphs: [
        "SCREENは、注入したホウ素、ヒ素、リンなどの活性化に加え、拡散と欠陥回復を精密に制御する必要性を示しています。フラッシュランプアニールは、表面温度を短時間で上げ下げし、熱が広がる時間を短くする考え方です。",
        "加熱方式には炉、急速熱処理、フラッシュランプ、レーザーなどがあります。方式名だけで優劣は決まらず、処理深さ、面内均一性、熱予算、基板・膜への影響、生産性で選びます。",
      ],
    },
    {
      id: "diffusion",
      heading: "熱拡散は、表面から供給したドーパントを熱で内部へ移動させる",
      lead: "イオン注入が加速粒子を使うのに対し、熱拡散は濃度差と熱エネルギーを使います。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較観点",
          rightLabel: "イオン注入と熱拡散の違い",
          rows: [
            { left: "導入方法", right: "イオン注入は加速した荷電粒子を衝突させる。熱拡散は表面のドーパント源から熱で内部へ移動させる" },
            { left: "主な制御", right: "注入は注入量・エネルギー・角度。拡散は表面濃度、温度、時間、雰囲気など" },
            { left: "分布", right: "注入は表面より内部に濃度ピークを作れる。拡散は一般に表面側から濃度が広がる" },
            { left: "結晶ダメージ", right: "注入は衝突ダメージを生むため活性化アニールが必要。熱拡散はビーム衝突を伴わない" },
            { left: "横方向", right: "どちらも最終的に横方向の広がりを持つ。拡散は熱処理時間中にマスク下へも広がる" },
          ],
        },
      ],
      paragraphs: [
        "熱拡散では、気体・液体・固体などのドーパント源を表面へ供給し、高温で原子をシリコン中へ移動させます。温度と時間が大きいほど一般に深く広がりますが、表面反応と固溶限、結晶欠陥なども影響します。",
        "東京エレクトロンは酸化・アニールを含むバッチ熱処理装置を提供しています。現在の工程ではイオン注入後の熱拡散もあるため、『拡散』が独立したドーパント導入法を指すのか、アニール中の分布変化を指すのかを資料ごとに確認します。",
      ],
    },
    {
      id: "applications",
      heading: "イオン注入は、濃度と深さの異なる領域を層ごとに作る",
      lead: "一つのデバイスでも、目的を変えて複数回の注入を使います。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "WELL", title: "ウェル・チャネル", body: "トランジスタを作る土台の導電型、しきい値、短チャネル特性などを調整します。" },
            { label: "SOURCE / DRAIN", title: "ソース・ドレイン", body: "キャリアが出入りする領域を作り、接合深さと抵抗を制御します。" },
            { label: "CONTACT", title: "低抵抗接触", body: "電極と半導体が接する領域の濃度を高め、接触抵抗を下げる方向へ調整します。" },
            { label: "ISOLATION", title: "分離・耐圧", body: "寄生動作を抑える領域や、電界を支える深い領域を形成します。" },
            { label: "MATERIAL", title: "材料特性の改質", body: "ドーピング以外にも、結晶状態や材料特性を調整する目的でイオンを使う場合があります。" },
            { label: "POWER DEVICE", title: "パワー半導体", body: "深い領域、高エネルギー注入、SiCなど、材料と耐圧構造に応じた条件を使います。" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsは、先端トランジスタのソース・ドレインや接触領域で、濃度と深さプロファイルが性能、漏れ、ばらつきへ影響すると説明しています。Axcelisは高電流、中電流、高エネルギーなど、用途範囲に応じた装置群を示しています。",
        "同じドーパントでも、浅く高濃度に入れる用途と、深く低濃度に入れる用途では必要なビームが違います。装置カテゴリは主に注入量とエネルギー範囲で分かれますが、製品名ではなく用途と分布で理解することが大切です。",
      ],
    },
    {
      id: "control-items",
      heading: "イオン注入では、分布・均一性・純度・ダメージを管理する",
      lead: "注入量が合っていても、角度、汚染、帯電、熱処理がずれると電気特性は変わります。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "DOSE", title: "注入量・面内均一性", body: "ビーム電流を積算し、中心と外周、ウェーハ間で単位面積あたりの量をそろえます。" },
            { label: "ENERGY", title: "エネルギー・深さ分布", body: "不要なエネルギー成分を抑え、狙った深さと分布幅へ入っているか確認します。" },
            { label: "ANGLE", title: "傾き・回転角", body: "チャネリング、影、左右差を抑え、立体構造へ必要な角度で注入します。" },
            { label: "PURITY", title: "注入種・金属汚染・粒子", body: "目的外イオン、装置部品由来の金属、粒子の混入を抑えます。" },
            { label: "CHARGE", title: "帯電・熱負荷", body: "絶縁膜や微細構造へ電荷がたまる影響と、ビームによるウェーハ温度上昇を管理します。" },
            { label: "ANNEAL", title: "活性化・欠陥・拡散", body: "シート抵抗、接合深さ、結晶欠陥、活性化率、分布の広がりを確認します。" },
          ],
        },
      ],
      paragraphs: [
        "測定には、シート抵抗、濃度の深さ分析、接合深さ、結晶欠陥評価、電気特性、粒子検査などを組み合わせます。装置内ではビーム電流、エネルギー、角度、真空、ウェーハ温度などを監視します。",
        "レジストをマスクに使う場合、ビーム照射による硬化、ガス放出、温度上昇、除去しにくさも後工程へ影響します。注入単体でなく、リソグラフィ、マスク除去、洗浄、アニールまでを一つの流れとして管理します。",
      ],
    },
    {
      id: "equipment-roles",
      heading: "イオン注入には、プラズマ・電磁気・真空・材料・熱処理の技術が集まる",
      lead: "イオンを作る装置技術と、結晶中での分布・活性化を理解する材料技術がつながります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス", right: "注入種、注入量、エネルギー、角度、アニール条件を設計し、電気特性へつなぐ" },
            { left: "装置・真空", right: "イオン源、ビームライン、真空、搬送、走査、冷却、保守性を設計・維持する" },
            { left: "電気・電磁気", right: "高電圧、磁石、高周波、ビーム計測、電荷補償を制御する" },
            { left: "材料・物理", right: "衝突、散乱、チャネリング、結晶欠陥、拡散、活性化を解析する" },
            { left: "計測・解析", right: "濃度分布、シート抵抗、接合深さ、欠陥、汚染、電気特性を測る" },
            { left: "設備・安全", right: "高電圧、放射線管理、原料ガス、真空排気、除害、インターロックを管理する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "イオン注入が前工程の反復のどこに入るか確認する" },
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "選択注入する場所をレジストへ描く工程を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "注入前後に薄膜へ開口や構造を作る工程を見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "注入前後の表面汚染と残留物を除去する工程を見る" },
            { label: "酸化・熱処理の仕組み", href: "/guides/semiconductor-oxidation-thermal-process", description: "注入後の結晶損傷回復とドーパント活性化を熱履歴から見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、イオン注入・熱処理装置、材料企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materials、Axcelis、住友重機械工業などがイオン注入装置を提供し、SCREENなどが短時間アニール装置、東京エレクトロンなどがバッチ熱処理装置を提供しています。デバイスメーカーでは、注入と熱処理をデバイス電気特性へ統合します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体のイオン注入・拡散でよくある質問",
      lead: "ドーピング、注入条件、熱処理の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体のイオン注入とは何ですか？", answer: "ドーパント原子をイオン化して加速し、ウェーハの選んだ場所と深さへ導入する工程です。p型・n型領域、ウェル、ソース・ドレインなどの電気特性を作ります。" },
            { question: "注入量とエネルギーの違いは？", answer: "注入量は単位面積あたりに入れるイオン数で、主に濃度へ影響します。エネルギーはイオンの運動エネルギーで、主に平均到達深さへ影響します。最終分布は注入種、材料、角度、熱処理でも変わります。" },
            { question: "なぜ注入角度を制御するのですか？", answer: "結晶軸に沿って想定より深く入るチャネリングや、立体構造の影による左右差を抑えるためです。ウェーハの傾きと回転角を用途に合わせて管理します。" },
            { question: "イオン注入後になぜアニールが必要ですか？", answer: "イオン衝突で生じた結晶欠陥を回復し、ドーパントを電気的に働きやすい格子位置へ移して活性化するためです。ただし、熱を加えると分布が広がる可能性があります。" },
            { question: "イオン注入と熱拡散の違いは？", answer: "イオン注入は加速した荷電粒子を基板へ衝突させ、注入量とエネルギーで濃度・深さを制御します。熱拡散は表面のドーパント源から、温度と時間を使って内部へ移動させます。" },
            { question: "イオン注入は不純物汚染と同じですか？", answer: "いいえ。ドーパントは種類、量、深さ、位置を設計して意図的に加える元素です。一方、目的外の元素や金属は電気特性を乱す汚染となるため、装置と材料の純度を管理します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜何を、いくつ、どの深さへ入れ、どう活性化するかを見る",
      lead: "イオン注入は、電気特性を作るための精密なドーピング工程です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SPECIES / DOSE", title: "種類と量を決める", body: "p型・n型と必要濃度に合わせ、注入種と単位面積あたりの量を選ぶ" },
            { label: "ENERGY / ANGLE", title: "深さと方向を決める", body: "エネルギー、傾き、回転角で分布とチャネリングを制御する" },
            { label: "ANNEAL", title: "結晶を回復し活性化する", body: "欠陥を減らしてドーパントを働かせ、同時に分布の広がりを抑える" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、成膜とエッチングで生じた凹凸を平らにするCMPを取り上げ、材料除去と表面平坦化の仕組みを図解します。",
      ],
    },
  ],
  todayQuest: "身近な材料への添加を例に、『何を』『どれだけ』『どの深さへ』『後でどう整えるか』を説明する",
  relatedGuideSlugs: [
    "semiconductor-manufacturing-process",
    "photolithography-process",
    "semiconductor-etching-process",
    "semiconductor-cleaning-process",
    "semiconductor-oxidation-thermal-process",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["applied-materials", "screen", "tokyo-electron"],
};
