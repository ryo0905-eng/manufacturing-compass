import type { GuideArticle } from "@/content/guides/types";

export const semiconductorEtchingProcessGuide: GuideArticle = {
  slug: "semiconductor-etching-process",
  title: "半導体のエッチングとは？ウェット・ドライと等方性・異方性を初心者向けに図解",
  description:
    "半導体のエッチング工程を初心者向けに図解。ウェットエッチングとドライエッチング、等方性と異方性、プラズマ中のラジカルとイオン、選択比、断面形状、ALEの仕組みを整理します。",
  targetQuery: "半導体 エッチング とは",
  searchIntent:
    "半導体のエッチングが何をする工程か、ウェット・ドライ、等方性・異方性、選択比、プラズマの役割を断面図で理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Lam Research、東京エレクトロン、Applied Materialsの公式技術情報をもとに、代表的なエッチング原理を整理しています。図は断面形状の違いを示す概念図で、実際の形状と反応は材料、装置、マスク、ガス・薬液、温度などで変わります。",
  showCareerCtas: false,
  experienceBasis: [
    "Lam Researchの公式技術解説で、ウェット・ドライ、ラジカル・イオン、等方性・異方性、ALEの基本を確認",
    "東京エレクトロンの公式製品情報で、パターン転写、異方性加工、選択性、高アスペクト比構造の量産課題を確認",
    "Applied Materialsの公式技術情報で、隣接材料を守りながら対象材料を除去する選択エッチングの考え方を確認",
  ],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  sources: [
    {
      title: "Etch Essentials in Semiconductor Manufacturing",
      url: "https://newsroom.lamresearch.com/etch-essentials-semiconductor-manufacturing?web=1",
      publisher: "Lam Research",
      accessedAt: "2026-07-15",
    },
    {
      title: "Etch",
      url: "https://www.lamresearch.com/products/our-processes/etch/",
      publisher: "Lam Research",
      accessedAt: "2026-07-15",
    },
    {
      title: "Tech Brief: All About Atomic Layer Etching",
      url: "https://newsroom.lamresearch.com/Tech-Brief-All-About-ALE",
      publisher: "Lam Research",
      accessedAt: "2026-07-15",
    },
    {
      title: "Products and Services: Etch Systems",
      url: "https://www.tel.com/product/",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Tactras Etch System",
      url: "https://www.tel.com/product/tactras.html",
      publisher: "Tokyo Electron",
      accessedAt: "2026-07-15",
    },
    {
      title: "Selective Etch",
      url: "https://www.appliedmaterials.com/us/en/semiconductor/products/shape/selective-etch.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-15",
    },
  ],
  readTime: "約16分",
  intro: {
    problem: "エッチングを『薬品で削る工程』と覚えても、なぜ横へ削れる場合と縦へ深く加工できる場合があるのか、リソグラフィと何が違うのか分かりにくくありませんか。",
    conclusion: "エッチングは、レジストやハードマスクで守られていない材料を除去し、パターンを下の膜へ移す工程です。液体を使うウェットと、真空中の気体・プラズマを使うドライがあり、加工方向、選択比、断面形状を目的に合わせて制御します。",
    learnings: "工程前後の変化、ウェットとドライ、等方性と異方性、プラズマの役割、選択比、ALE、管理項目、装置と関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote: "エッチングは『削れたか』だけでなく、『どちら向きに』『何を残しながら』『どんな断面へ』削れたかを見ると理解しやすくなります。",
      caption: "この記事の見方",
    },
    {
      type: "etch-profile-comparison",
      title: "図解｜加工方向と選択性で、残る断面が変わる",
      description:
        "黄色がマスク、青色が加工対象の膜、下段が停止層の概念図です。ウェットと等方性、ドライと異方性は同義ではなく、方式と条件によって断面は変わります。",
      methods: [
        {
          kind: "isotropic",
          label: "ISOTROPIC / 等方性",
          title: "縦にも横にも反応が進む",
          mechanism: "露出面から複数方向へ反応が進み、マスクの下側にも回り込む",
          characteristic: "開口より横へ広がるアンダーカットを含めて形状を確認する",
        },
        {
          kind: "anisotropic",
          label: "ANISOTROPIC / 異方性",
          title: "縦方向を強めて加工する",
          mechanism: "イオンの方向性などを利用し、横方向より深さ方向の加工を強める",
          characteristic: "側壁角度、底部形状、寸法変化を見てパターン転写を管理する",
        },
        {
          kind: "selective",
          label: "SELECTIVE / 選択性",
          title: "対象膜を優先して除去する",
          mechanism: "材料ごとの反応性の違いを使い、対象膜と停止層・マスクの加工速度へ差をつける",
          characteristic: "対象を除去しつつ、下地や隣接材料の損失とダメージを抑える",
        },
      ],
    },
  ],
  sections: [
    {
      id: "purpose",
      heading: "エッチングは、マスクの形を下の材料へ移す工程",
      lead: "リソグラフィで作ったレジストの開口を使い、露出した薄膜を除去します。",
      blocks: [
        {
          type: "layer-process",
          title: "工程前後｜一時的なレジスト形状を薄膜へ転写する",
          description: "代表的な単層加工の概念図です。実際にはハードマスク、多層膜、後洗浄などが加わる場合があります。",
          stages: [
            {
              label: "INPUT",
              title: "レジストに開口がある",
              body: "リソグラフィで加工したい場所だけを露出させます。",
              layers: [
                { label: "レジスト", tone: "resist", pattern: "openings" },
                { label: "加工対象膜", tone: "film" },
                { label: "下地", tone: "substrate" },
              ],
            },
            {
              label: "ETCH",
              title: "露出部を除去する",
              body: "マスクで守られた部分との差を作り、必要な深さまで加工します。",
              signal: "反応種・イオン",
              layers: [
                { label: "レジスト", tone: "resist", pattern: "openings" },
                { label: "加工中", tone: "film", pattern: "openings" },
                { label: "下地", tone: "substrate" },
              ],
            },
            {
              label: "OUTPUT",
              title: "薄膜へ形が移る",
              body: "必要に応じてレジストを除去し、次の成膜・洗浄・加工へ進みます。",
              layers: [
                { label: "加工済み薄膜", tone: "film", pattern: "openings" },
                { label: "下地", tone: "substrate" },
              ],
            },
          ],
        },
        {
          type: "note",
          title: "リソグラフィとエッチングは役割が違う",
          body: "リソグラフィは感光材へ加工場所を描く工程、エッチングはその開口を使って下の材料へ形を移す工程です。露光しただけで薄膜が直接なくなるわけではありません。",
        },
      ],
      paragraphs: [
        "東京エレクトロンは、エッチングをリソグラフィで形成したパターンに沿って薄膜を加工する工程と説明しています。トランジスタ、コンタクト、配線、メモリの穴や溝など、層ごとに対象材料と必要な形が異なります。",
        "守る材料にはフォトレジストのほか、加工耐性を持つ薄膜を使うハードマスクがあります。対象膜を必要な形へ加工した後は、マスクの除去や残留物の洗浄が続くことがあります。",
      ],
    },
    {
      id: "wet-dry",
      heading: "ウェットは液体、ドライは気体と真空環境を使う",
      lead: "二つの方式は、反応種を材料表面へ届ける方法と方向制御のしやすさが異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "仕組みと見方",
          rows: [
            { left: "ウェットエッチング", right: "液体の薬液と材料を反応させて除去。一般に等方的になりやすく、材料選択性を高くできる場合がある" },
            { left: "ドライエッチング", right: "真空チャンバへ気体を導入し、プラズマなどで反応種とイオンを作って除去。方向性を与えやすい" },
            { left: "使い分け", right: "対象材料、必要な断面、寸法、選択比、ダメージ、生産性、安全性、後洗浄を合わせて判断" },
          ],
        },
      ],
      paragraphs: [
        "Lam Researchは、ウェットエッチングを液体の化学薬品へウェーハをさらす方式、ドライエッチングを真空中で反応性ガスを使う方式と説明しています。ウェットは一度に複数枚を処理する構成もあり、比較的単純な形状や材料選択性を生かす用途で使われます。",
        "微細な縦壁や深い穴を作る場面では、イオンの方向性を利用できるドライエッチングが中心になります。ただし、ウェットが必ず等方性、ドライが必ず異方性とは限りません。材料、結晶方位、反応種、イオンエネルギー、圧力などで加工方向は変わります。",
      ],
    },
    {
      id: "plasma",
      heading: "ドライエッチングでは、ラジカルの反応とイオンの方向性を組み合わせる",
      lead: "プラズマは気体の一部が電子、イオン、ラジカルなどに分かれた反応性の高い状態です。",
      blocks: [
        {
          type: "process-flow",
          title: "代表的なプラズマエッチングの流れ",
          description: "反応生成物を気体として排気できる場合の概念です。実際の反応経路は材料とガス系で異なります。",
          stages: [
            { label: "01", title: "真空とガス供給", body: "チャンバを排気し、対象材料に合わせた反応性ガスを導入" },
            { label: "02", title: "プラズマ生成", body: "高周波電力などで電子、イオン、ラジカルを生成" },
            { label: "03", title: "表面へ輸送", body: "ラジカルを拡散させ、電界でイオンの進む方向をそろえる" },
            { label: "04", title: "表面反応・衝突", body: "化学反応と物理的な衝撃を組み合わせ、対象材料を変化させる" },
            { label: "05", title: "生成物を排気", body: "揮発性の反応生成物を表面から離し、チャンバ外へ排出" },
          ],
        },
      ],
      paragraphs: [
        "ラジカルは電気的に中性で、材料表面と化学反応しやすい活性種です。イオンは電界から力を受けるため、ウェーハへ向かう方向をそろえやすく、底部の反応促進や表面結合の切断に寄与します。",
        "Lam Researchは、反応性の中性種と高エネルギーのイオンを組み合わせることで、材料選択性、加工速度、側壁形状を制御できると説明しています。一方、強すぎるイオン衝撃はマスク消耗や下地ダメージの要因になるため、化学反応との釣り合いが重要です。",
      ],
    },
    {
      id: "profile",
      heading: "等方性と異方性は、加工が進む方向を表す",
      lead: "同じ量を除去しても、横方向への広がりでパターン寸法と側壁形状が変わります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "UNDERCUT", title: "アンダーカット", body: "マスクの下へ横方向の加工が進む状態。狙って使う場合も、寸法ずれになる場合もあります。" },
            { label: "SIDEWALL", title: "側壁形状", body: "垂直、順テーパー、逆テーパーなど、壁の角度と滑らかさを確認します。" },
            { label: "CD", title: "加工寸法", body: "マスク寸法に対して、加工後の線幅や穴径がどの程度変化したかを測ります。" },
          ],
        },
        {
          type: "note",
          title: "異方性は『垂直ならよい』だけではない",
          body: "必要な側壁角度は次の成膜、埋め込み、電気特性で変わります。底部だけが進まない、側壁がえぐれる、マスク形状が転写されるなど、断面全体を見て調整します。",
        },
      ],
      paragraphs: [
        "等方性エッチングは複数方向へ同程度に進むため、開口の下だけでなく横にも加工が広がります。異方性エッチングは特定方向を強め、微細なパターンを深さ方向へ移しやすくします。",
        "先端構造では、細い開口を深く加工する高アスペクト比エッチングが必要です。東京エレクトロンは、深い穴や溝でウェーハ面内の均一性、形状、選択性、ウェーハ間ばらつきを制御する重要性を示しています。",
      ],
    },
    {
      id: "selectivity",
      heading: "選択比は、対象膜を他の材料より速く除去できる度合い",
      lead: "加工対象だけを除去し、マスク、停止層、隣接材料をできるだけ残すための重要な指標です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較する材料",
          rightLabel: "選択性が必要な理由",
          rows: [
            { left: "対象膜 ÷ マスク", right: "加工が終わるまでレジストやハードマスクの形を保つ" },
            { left: "対象膜 ÷ 停止層", right: "対象膜を抜いた後、下の薄膜や基板の損失を抑える" },
            { left: "対象膜 ÷ 隣接材料", right: "複雑な三次元構造で必要な材料だけを選んで除去する" },
          ],
        },
        {
          type: "note",
          title: "選択比は、二つの加工速度の比で考える",
          body: "例えば『対象膜の加工速度 ÷ 停止層の加工速度』です。どの二材料を比較した値か、測定条件は何かを確認しないと、数値だけでは意味が決まりません。",
        },
      ],
      paragraphs: [
        "選択比が低いと、対象膜を除去し終える前にマスクが薄くなったり、加工後の余裕時間で下地を削ったりします。逆に、対象材料との反応差を大きくできれば、ばらつきを吸収しながら下地を守りやすくなります。",
        "Applied Materialsは選択エッチングを、周囲の材料を変化・損傷させずに不要な材料を除去する技術と説明しています。微細化と三次元化で異種材料が近接するほど、形状の方向性とは別に、材料間の選択性が重要になります。",
      ],
    },
    {
      id: "applications",
      heading: "対象材料と構造によって、反応と装置を使い分ける",
      lead: "導体、絶縁体、半導体材料では反応生成物と必要な形状が異なります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DIELECTRIC", title: "絶縁膜エッチング", body: "酸化物・窒化物などへ穴や溝を作り、コンタクトや配線の接続空間を形成します。" },
            { label: "CONDUCTOR", title: "導体エッチング", body: "金属や導電膜を加工し、電極、ゲート、配線などのパターンを形成します。" },
            { label: "SILICON", title: "シリコン系エッチング", body: "素子分離、ゲート、メモリ構造など、基板・半導体膜へ必要な形を作ります。" },
          ],
        },
      ],
      paragraphs: [
        "Lam Researchはエッチング用途を導体、誘電体、選択エッチングなどに分けています。同じ装置カテゴリでも、対象材料と反応生成物に合わせてガス、プラズマ、温度、圧力、チャンバ表面の管理が変わります。",
        "深い穴では反応種を底部まで届け、生成物を外へ戻す必要があります。開口が狭くなるほど輸送が難しくなるため、加工深さで速度や形状が変わる影響も含めて工程を設計します。",
      ],
    },
    {
      id: "ale",
      heading: "ALEは、表面の改質と除去を分けて少しずつ加工する",
      lead: "Atomic Layer Etchingは、原子層レベルの加工制御を目指す周期的なエッチングです。",
      blocks: [
        {
          type: "process-flow",
          title: "ALEの代表的な一周期",
          description: "二段階反応の概念例です。材料系によって、熱反応・プラズマ、供給物質、方向性は異なります。",
          stages: [
            { label: "01", title: "表面を改質", body: "反応種を供給し、表面の薄い範囲を除去しやすい状態へ変える" },
            { label: "02", title: "余分な反応種を排出", body: "次の反応と空間で混ざらないよう、パージまたは排気する" },
            { label: "03", title: "改質層を除去", body: "別の反応や低いエネルギーのイオンで、変化した範囲を取り除く" },
            { label: "04", title: "生成物を排出", body: "表面を次の周期へ戻し、必要な深さまで繰り返す" },
          ],
          cycle: {
            title: "周期処理で狙うこと",
            items: ["反応深さを限定する", "除去量を小さく制御する", "下地損失とダメージを抑える"],
            note: "一周期で必ず完全な一原子層だけを除去するとは限りません。自己制限性と周期ごとの再現性が重要です。",
          },
        },
      ],
      paragraphs: [
        "Lam ResearchはALEを、表面改質と改質した材料の除去を交互に行い、各周期で薄い層を取り除く技術と説明しています。連続的なエッチングより工程を細かく区切り、選択性、寸法、ダメージを精密に制御する狙いがあります。",
        "ALEはすべての加工を置き換える方式ではありません。必要な精度、加工量、生産性、材料系に応じて、連続エッチングと組み合わせたり、重要な終端部分へ使ったりします。",
      ],
    },
    {
      id: "control-items",
      heading: "エッチングは、速度・形状・選択性・均一性を同時に管理する",
      lead: "加工速度だけを上げても、寸法や下地が崩れれば目的の構造にはなりません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "RATE", title: "加工速度・終点", body: "対象膜が必要な時間で除去でき、ウェーハごとの膜厚差を吸収できるか。" },
            { label: "UNIFORMITY", title: "面内・ウェーハ間均一性", body: "中心と外周、ウェーハごと、チャンバごとの深さと寸法をそろえる。" },
            { label: "PROFILE", title: "断面形状・CD", body: "側壁角度、底部、穴径、線幅、深さ、アンダーカットを確認する。" },
            { label: "SELECTIVITY", title: "選択比・マスク残り", body: "対象膜を除去しつつ、マスク、停止層、隣接材料を守る。" },
            { label: "DAMAGE", title: "ダメージ・電気特性", body: "イオン、光、帯電、熱などによる下地や素子への影響を抑える。" },
            { label: "RESIDUE", title: "残留物・欠陥", body: "反応生成物、側壁付着物、粒子、腐食などを後洗浄まで含めて管理する。" },
          ],
        },
      ],
      paragraphs: [
        "装置では、ガス流量、圧力、電力、基板バイアス、温度、処理時間などを制御します。結果は膜厚・深さ測定、CD測定、断面観察、欠陥検査、電気測定などで確認し、装置状態と結び付けて工程へ戻します。",
        "チャンバ内壁への堆積や部品の消耗も再現性に影響します。そのためプロセス条件だけでなく、クリーニング、部品交換、終点検出、装置間差、消耗品の状態を一体で管理します。",
      ],
    },
    {
      id: "equipment-roles",
      heading: "エッチング工程には、化学・プラズマ・真空・計測の技術が集まる",
      lead: "材料表面の反応から装置の安定稼働まで、複数分野が同じ加工結果へ関わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "技術・職種",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス", right: "材料と形状に合わせ、ガス・薬液、圧力、電力、温度、時間を設計する" },
            { left: "装置・機械", right: "チャンバ、搬送、真空、温調、電極、部品寿命と保守性を設計・維持する" },
            { left: "電気・プラズマ", right: "高周波電源、整合、イオンエネルギー、プラズマ密度と均一性を制御する" },
            { left: "材料・化学", right: "表面反応、反応生成物、選択性、腐食、残留物の仕組みを解析する" },
            { left: "計測・解析", right: "深さ、CD、側壁、選択比、欠陥、電気特性を測り、原因を切り分ける" },
            { left: "設備・安全", right: "反応性ガス、薬液、排気、除害、漏えい監視を安全に管理する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "エッチングが前工程の反復のどこに入るか確認する" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "反応性ガス、供給設備、排気・除害と主要企業を見る" },
            { label: "フォトリソグラフィの仕組み", href: "/guides/photolithography-process", description: "エッチング前に加工場所を決める工程を断面図で見る" },
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "加工対象となる薄膜をPVD・CVD・ALDで作る原理を見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "エッチング後の残留物を除去し、表面を整える工程を見る" },
            { label: "CMP・平坦化の仕組み", href: "/guides/semiconductor-cmp-process", description: "溝や穴へ材料を埋めた後、余分な上部膜を除去する工程を見る" },
            { label: "配線形成の仕組み", href: "/guides/semiconductor-interconnect-process", description: "絶縁膜へ配線溝・ビアを加工し、導体を埋める統合工程を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "加工後CD・深さ・欠陥を測り、エッチング工程へ返す流れを見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "デバイス、装置、材料、計測を担う企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "Lam Research、東京エレクトロン、Applied Materialsなどがエッチング装置とプロセス技術を提供しています。デバイスメーカーでは、リソグラフィ、成膜、洗浄、計測との接続を含めて工程を統合します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体のエッチングでよくある質問",
      lead: "方式名と加工結果を混同しないための基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体のエッチングとは何ですか？", answer: "レジストやハードマスクで守られていない材料を除去し、回路パターンを下の薄膜や基板へ移す工程です。トランジスタ、コンタクト、配線、メモリの穴や溝などを作ります。" },
            { question: "ウェットエッチングとドライエッチングの違いは？", answer: "ウェットは液体の薬液、ドライは真空中の気体やプラズマを使います。一般にドライはイオンの方向性を利用して縦方向を強めやすく、ウェットは等方的になりやすいですが、材料と条件によって変わります。" },
            { question: "等方性と異方性の違いは？", answer: "等方性は複数方向へ加工が進み、マスク下へ横に広がりやすい性質です。異方性は特定方向を強め、微細パターンを深さ方向へ転写しやすい性質です。" },
            { question: "選択比とは何ですか？", answer: "加工対象と、マスクや停止層など保護したい材料の加工速度の比です。どの二材料を、どの条件で比べた値かを確認する必要があります。" },
            { question: "プラズマは材料を物理的に削るだけですか？", answer: "いいえ。代表的なドライエッチングでは、ラジカルによる化学反応と、方向を持つイオンの衝突を組み合わせます。両者の釣り合いで速度、選択性、側壁形状、ダメージが変わります。" },
            { question: "ALEなら必ず一原子層ずつ除去できますか？", answer: "一周期あたりの除去量は材料と反応によって異なり、必ず完全な一原子層とは限りません。表面改質と除去を分け、自己制限的な反応で小さな除去量を制御することが要点です。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜方向・材料・断面の三つでエッチングを見る",
      lead: "エッチングは、不要な材料を除去しながら必要な形と材料を残す工程です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DIRECTION", title: "どちらへ加工するか", body: "等方性・異方性とイオンの方向性から、横広がりと深さを考える" },
            { label: "MATERIAL", title: "何を残すか", body: "対象膜、マスク、停止層、隣接材料の選択比を見る" },
            { label: "PROFILE", title: "どんな断面にするか", body: "CD、側壁、底部、深さ、残留物を前後工程と合わせる" },
          ],
        },
      ],
      paragraphs: [
        "次の個別記事では、エッチング前後の表面を整える洗浄、または材料の電気的性質を変えるイオン注入・拡散を取り上げ、反復する前工程をつないでいきます。",
      ],
    },
  ],
  todayQuest: "身近な型抜きを例に、『縦横の加工方向』『型と材料の耐え方』『加工後の断面』の三つを説明する",
  relatedGuideSlugs: [
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-gas-manufacturers",
    "semiconductor-manufacturing-process",
    "photolithography-process",
    "semiconductor-deposition-process",
    "semiconductor-cleaning-process",
    "semiconductor-cmp-process",
    "semiconductor-interconnect-process",
    "semiconductor-inspection-metrology",
    "production-engineering-to-semiconductor-process-engineer",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["lam-research", "tokyo-electron", "applied-materials"],
};
