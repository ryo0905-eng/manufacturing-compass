import type { GuideArticle } from "@/content/guides/types";

export const semiconductorPellicleManufacturersGuide: GuideArticle = {
  slug: "semiconductor-pellicle-manufacturers",
  title: "半導体ペリクルメーカーとは？三井化学・信越化学などを初心者向けに図解",
  description:
    "半導体ペリクルは、フォトマスク上の回路を異物から守る薄膜カバーです。焦点外にする仕組み、膜・フレーム・接着構造、KrF・ArF・EUVの違い、透過率・耐光性・発塵、主要メーカーを図解します。",
  targetQuery: "半導体 ペリクル メーカー",
  searchIntent:
    "半導体ペリクルの構造と異物を焦点外にする仕組み、DUV・EUV用の膜材料と品質要求、三井化学・信越化学・FSTなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "三井化学、Shin-Etsu MicroSi、FST、Pao Taiの公式製品情報と、ASML・imecのEUV技術解説、AGCのペリクル膜材料情報をもとに、膜、フレーム、接着、取付け、露光、検査へ整理しました。市場順位や異なる条件の仕様値ではなく、同じ露光波長と用途へそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "完成フォトマスクとマスクブランクスの記事を公開したうえで、露光中の異物転写を抑える保護部材を独立して説明する記事が必要だと判断",
    "三井化学とShin-Etsu MicroSiの公式情報で、KrF・ArF用ペリクルの膜、透過、清浄度、耐光性、フレームに関する領域を確認",
    "三井化学、ASML、imecの公式情報で、シリコン系・CNT系EUVペリクル、高透過、耐熱・耐光、真空・高出力への対応を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "三井ペリクル™",
      url: "https://jp.mitsuichemicals.com/jp/service/product/mitsui-pellicle/index.htm",
      publisher: "三井化学株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "Mitsui Chemicals Sets up Production Facilities for CNT Pellicles",
      url: "https://jp.mitsuichemicals.com/en/release/2024/2024_0528_1/index.htm",
      publisher: "Mitsui Chemicals, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Pellicles",
      url: "https://www.microsi.com/applications-solutions/photomask-pellicles/pellicles/",
      publisher: "Shin-Etsu MicroSi, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Pellicle",
      url: "https://www.fstc.co.kr/bbs/board.php?bo_table=page_pellicle_en_2",
      publisher: "FST Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "光罩保護解決方案",
      url: "https://www.paotai.com.tw/products_detail/223.htm",
      publisher: "Pao Tai Industrial Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Indistinguishable from magic: the EUV pellicle",
      url: "https://www.asml.com/news/stories/2022/the-euv-pellicle-indistinguishable-from-magic",
      publisher: "ASML",
      accessedAt: "2026-07-16",
    },
    {
      title: "Imec demonstrates CNT pellicle utilization on EUV scanner",
      url: "https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner",
      publisher: "imec",
      accessedAt: "2026-07-16",
    },
    {
      title: "Pellicle｜CYTOP™ Usage and Examples",
      url: "https://www.agc-chemicals.com/jp/en/fluorine/products/detail/use/detail.html?uCode=JP-EN-F019_4",
      publisher: "AGC Chemicals",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "ペリクルを調べても、単なる保護フィルムに見える一方で、なぜ非常に薄い膜が必要なのか、異物をどう防ぐのか、ArF用とEUV用で何が違うのか分かりにくくありませんか。",
    conclusion:
      "ペリクルは、薄膜をフレームでフォトマスク面から離して固定する防塵カバーです。異物が膜へ付着してもマスクの回路面から離れるため、露光時に焦点外となり、ウェーハへ鮮明に転写されるリスクを抑えます。企業比較では、波長、膜材料、透過率、耐光・耐熱性、機械強度、清浄度、フレーム・接着、取付け・検査をそろえます。",
    learnings:
      "ペリクルの膜・フレーム・接着構造、異物を焦点外にする原理、KrF・ArF・液浸・EUV、シリコン系・CNT系膜、透過率・寿命・発塵・たわみ、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "ペリクルは異物の侵入を完全になくす部材ではありません。『回路面ではなく、焦点から離れた膜で異物を受ける』ことで、繰り返し転写される欠陥を減らします。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜マスクへ取り付け、異物を焦点外で受ける",
      description:
        "ペリクルの製造・取付け・使用を単純化した流れです。膜形成、組立、検査、装着方法は波長・製品・顧客仕様で異なります。",
      stages: [
        { label: "01 / MEMBRANE", title: "薄膜を作る", body: "対象波長を通し、光・熱・真空・薬品へ耐える膜材料と厚さを設計する" },
        { label: "02 / FRAME", title: "フレームへ張る", body: "膜を所定張力で保持し、平面性、たわみ、振動、破損を管理する" },
        { label: "03 / ASSEMBLY", title: "接着構造を作る", body: "膜・フレーム・マスク接着部を組み立て、発塵・揮発・剥離を抑える" },
        { label: "04 / INSPECT", title: "清浄度を検査する", body: "膜欠陥、粒子、透過均一性、外観、フレーム、接着部を確認する" },
        { label: "05 / MOUNT", title: "マスクへ装着する", body: "回路面を囲むように取り付け、膜とマスクの間へ一定の距離を作る" },
        { label: "06 / EXPOSE", title: "焦点外で異物を受ける", body: "異物が膜へ付着しても回路面から離れるため、ウェーハ上へ鮮明に結像しにくくする" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "構成要素",
      rightLabel: "主な役割",
      rows: [
        { left: "ペリクル膜", right: "露光光を高い割合で通しながら、異物がフォトマスク回路面へ付着するのを抑える" },
        { left: "フレーム", right: "薄膜をマスク面から数mm程度離して保持し、形状・張力・取扱い性を作る" },
        { left: "膜接着部", right: "薄膜をフレームへ固定し、光・熱・真空・時間による剥離や発塵を抑える" },
        { left: "マスク接着部", right: "フレームをフォトマスクへ固定し、取付け・剥離・再洗浄と清浄度を両立する" },
        { left: "通気・圧力調整構造", right: "搬送・装着・真空移行時などの圧力差で膜が過度に変形・破損しないよう調整する" },
        { left: "容器・治具", right: "薄膜へ接触せず、粒子・振動・静電気・誤取扱いを抑えて保管・搬送・装着する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "ペリクルメーカーとは、薄膜を量産可能な防塵カバーへ仕上げる企業",
      lead: "膜材料だけでなく、フレーム、接着、清浄組立、検査、装着支援までが製品です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "OPTICS", title: "光を通す", body: "対象波長で高い透過率と面内均一性を作り、露光量への影響を抑えます。" },
            { label: "DURABILITY", title: "光と熱へ耐える", body: "長時間の照射、温度上昇、真空、化学環境でも膜性能を維持します。" },
            { label: "MECHANICS", title: "薄膜を保持する", body: "張力、たわみ、振動、圧力差、搬送加速度に耐える膜・フレームを作ります。" },
            { label: "CLEANLINESS", title: "新たな異物を作らない", body: "材料、組立、接着、容器、装着作業からの粒子・揮発物を抑えます。" },
          ],
        },
        {
          type: "note",
          title: "ペリクル膜へ付いた異物が消えるわけではない",
          body: "膜はマスクの回路面から離れているため、露光装置が回路面へ焦点を合わせると膜上の異物は大きくぼけます。影響は異物サイズ、位置、照明、NAなどで変わり、無条件にゼロにはなりません。",
        },
      ],
      paragraphs: [
        "ASMLとimecは、ペリクルをマスク面の数mm上へ取り付け、膜上の粒子を焦点外にする保護膜として説明しています。三井化学もフォトマスク用防塵カバーとして、波長ごとの膜材料と膜厚を設計しています。",
        "マスクへ直接付いた異物は同じ位置から多数のチップへ繰り返し転写される可能性があります。ペリクルはマスク洗浄・検査・清浄搬送と組み合わせて使います。",
      ],
    },
    {
      id: "duv",
      heading: "KrF・ArF用ペリクルは、高透過な高分子薄膜と清浄構造を使う",
      lead: "DUVでも波長とドライ・液浸条件に応じて膜材料・厚さ・耐久性が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "露光方式",
          rightLabel: "ペリクルで確認すること",
          rows: [
            { left: "g線・i線", right: "対象波長の透過、膜材料、反射、耐光性、成熟装置・用途への寸法適合を見る" },
            { left: "KrF｜248nm", right: "248nmでの高透過、透過均一性、長時間照射による劣化・異物化、フレーム発塵を見る" },
            { left: "ArFドライ｜193nm", right: "193nmで吸収の少ない膜材料、膜厚、耐光性、曇り、揮発成分、光学影響を見る" },
            { left: "ArF液浸｜193nm", right: "高い光量と液浸工程の運用を考慮し、膜寿命、イオン・化学汚染、フレーム・接着の安定性を見る" },
            { left: "マスクサイズ・装置", right: "マスク外形、露光領域、装置搬送・ステージ、干渉回避、装着位置、識別・トレーサビリティを見る" },
          ],
        },
      ],
      paragraphs: [
        "三井化学はKrF・ArF用製品と、膜材料選択、膜厚設計、清浄組立、低発塵フレーム構造を案内しています。Shin-Etsu MicroSiはKrF、ドライArF、液浸ArF向けの一般グレードを公開しています。",
        "FSTもg・i線、KrF、ArF、ArF液浸用を分けています。透過率が同程度でも、測定波長、膜厚、均一性、照射寿命、フレーム・接着、装置条件をそろえなければ比較できません。",
      ],
    },
    {
      id: "euv",
      heading: "EUV用ペリクルは、光吸収と高温・真空・強度を同時に解く",
      lead: "13.5nmのEUVは多くの材料へ吸収されるため、DUV用膜をそのまま薄くするだけでは成立しません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "EUVの論点",
          rightLabel: "なぜ重要か",
          rows: [
            { left: "EUV透過率", right: "膜を往復通過する光の損失が露光量・スループットへ影響するため、吸収を抑える" },
            { left: "熱・高出力耐性", right: "吸収したEUVエネルギーで膜温度が上がるため、変形・破断・物性変化を抑える" },
            { left: "真空適合", right: "EUV露光は真空中で行うため、放出ガス、圧力変化、熱伝達、材料安定性を管理する" },
            { left: "機械強度", right: "極薄膜をフレームへ張り、搬送・ステージ加速度・振動・圧力差へ耐えさせる" },
            { left: "反射・散乱", right: "膜による不要な反射・散乱・像への影響を抑え、補正可能な範囲へ安定させる" },
            { left: "寿命・汚染", right: "炭素付着、酸化、膜劣化、粒子、フレーム・接着材由来の汚染を長期使用で抑える" },
          ],
        },
        {
          type: "note",
          title: "透過率と強度にはトレードオフがある",
          body: "薄く・空隙を多くすると光を通しやすくなる一方、機械強度、取扱い、耐熱、寿命が難しくなる場合があります。一つの透過率だけで方式の優劣を決めません。",
        },
      ],
      paragraphs: [
        "ASMLはEUVペリクルについて、EUVを通しながら真空中で高温に耐える極薄膜が必要だと説明しています。三井化学はシリコン系の従来EUVペリクルに加え、次世代向けCNT膜の生産設備・開発を案内しています。",
        "imecはCNT膜を、EUV透過、熱耐久、透過性、強度の観点で評価しています。高出力化・High-NAでは透過率だけでなく、長期寿命、加速度、膜振動、検査・交換方法まで含めて設計します。",
      ],
    },
    {
      id: "quality",
      heading: "透過率・耐光性・たわみ・発塵・接着が、露光の安定性を左右する",
      lead: "ペリクル品質は、膜だけを測っても完結しません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "TRANSMISSION", title: "透過・均一性", body: "対象波長の透過率と面内分布を管理し、露光量・像への影響を安定させます。" },
            { label: "LIFETIME", title: "耐光・耐熱寿命", body: "照射量、出力、温度、雰囲気に対する透過変化、変色、破断を評価します。" },
            { label: "SHAPE", title: "たわみ・振動", body: "張力、重力、圧力差、搬送加速度で膜がマスクや装置へ干渉しないようにします。" },
            { label: "PARTICLE", title: "粒子・膜欠陥", body: "膜上粒子、穴、傷、しわ、フレームからの発塵を検出・管理します。" },
            { label: "OUTGAS", title: "揮発・汚染", body: "膜、接着剤、フレーム処理、容器からの放出物と光反応による汚染を抑えます。" },
            { label: "MOUNT", title: "接着・取付け", body: "位置、密封・通気、剥離、再装着、マスク洗浄、装置搬送への適合を確認します。" },
          ],
        },
        {
          type: "note",
          title: "透過率の数値だけを横並びにしない",
          body: "波長、入射角、片道・往復、測定法、膜面積、温度、使用前後が違えば比較できません。透過均一性、寿命、機械・清浄性能を同じ条件で見ます。",
        },
      ],
      paragraphs: [
        "三井化学は光学特性、クリーン性、膜寿命に加え、フレーム内壁の異物保持や接着構造を案内しています。膜が高透過でも、フレームや接着部が発塵・揮発すればマスク保護の目的を損ないます。",
        "膜の張力が高すぎれば破損リスク、低すぎればたわみ・振動が増える可能性があります。膜材料、厚さ、面積、フレーム、装置搬送を組み合わせて評価します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体ペリクルの代表企業と隣接材料企業",
      lead: "完成ペリクル企業と、膜材料を支える企業を分けて工程へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "三井化学｜日本", right: "MITSUI PELLICLE™としてKrF・ArF用を展開し、EUV用を商業生産。シリコン系に加え次世代CNTペリクルを開発・生産準備" },
            { left: "信越化学工業／Shin-Etsu MicroSi｜日本・米国", right: "フォトマスク保護用ペリクルとしてKrF、ドライArF、液浸ArF向け材料グレードを展開" },
            { left: "FST｜韓国", right: "半導体用ペリクルとしてg・i線、KrF、ArF、ArF液浸を案内し、EUVペリクルを開発中と表示" },
            { left: "Pao Tai｜台湾", right: "フォトマスク保護ソリューションとしてKrF・ArF向けペリクルとEUVペリクル用フレームを案内" },
            { left: "AGC｜膜材料", right: "ArF・KrF環境で使われるペリクル膜用途として、非晶質フッ素樹脂CYTOP™を案内する隣接材料企業" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、市場順位ではない",
          body: "同じ企業でも完成ペリクル、膜、フレーム、研究開発で公開範囲が異なります。現在の量産・開発状況は公式情報で確認し、研究中のEUV製品を量産品と同一視しません。",
        },
      ],
      paragraphs: [
        "三井化学はDUVからEUVまでの完成ペリクル、信越化学系とFSTは主に光リソグラフィ向け製品、Pao Taiは保護製品とフレームを公式に示しています。",
        "AGCのCYTOP™はペリクル用途を持つ膜材料です。企業研究では『ペリクル関連』を、完成品、膜材料、フレーム、接着、検査・装着装置のどこかに分けます。",
      ],
    },
    {
      id: "comparison",
      heading: "ペリクルメーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、光学・機械・清浄・量産運用の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 露光波長・用途", right: "g・i線、KrF、ArFドライ、ArF液浸、EUV、High-NA、IC・研究用途のどこか" },
            { left: "2. 膜材料・構造", right: "高分子、シリコン系、CNT系、複合膜、膜厚、面積、表面処理、コーティング" },
            { left: "3. 光学性能", right: "透過率、透過均一性、反射・散乱、像・露光量への影響、使用中の変化" },
            { left: "4. 耐久・機械性能", right: "照射寿命、耐熱、真空、張力、たわみ、振動、圧力差、搬送加速度、破断" },
            { left: "5. 清浄度・材料安定性", right: "膜欠陥、粒子、発塵、揮発、光劣化物、化学汚染、静電気、保管寿命" },
            { left: "6. フレーム・接着", right: "材質、表面処理、寸法、内壁、通気、膜接着、マスク接着、剥離・再洗浄" },
            { left: "7. 装着・検査・サービス", right: "マスク適合、装着治具、膜・粒子検査、取扱い教育、原因解析、交換、再装着" },
            { left: "8. 供給・認定", right: "製造拠点、能力、装置・マスクメーカーとの連携、長期試験、変更通知、次世代開発" },
          ],
        },
      ],
      paragraphs: [
        "最初に露光波長を固定してください。KrF・ArFの高分子膜と、EUVのシリコン系・CNT系膜では、光吸収、温度、真空、膜厚、強度、検査方法が異なります。",
        "次に露光装置・フォトマスクとの適合を見ます。膜単体の性能だけでなく、マスク寸法、フレーム、ステージ搬送、装着・交換、検査、露光条件をそろえて認定します。",
      ],
    },
    {
      id: "jobs",
      heading: "ペリクルメーカーの仕事は、薄膜材料・精密組立・清浄評価をつなぐ",
      lead: "目に見えにくい極薄膜を、壊さず汚さず量産する技術が必要です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MATERIAL", title: "膜材料開発", body: "高分子、シリコン系、CNT、表面・複合材料の光学・熱・機械特性を設計します。" },
            { label: "MEMBRANE", title: "薄膜形成", body: "溶液、塗布、成膜、転写、乾燥、厚さ、均一性、穴・しわを制御します。" },
            { label: "FRAME", title: "フレーム・接着", body: "精密加工、表面処理、接着剤、張力、通気、低発塵構造を開発します。" },
            { label: "ASSEMBLY", title: "清浄組立", body: "膜張り、接着、搬送、容器、ロボット、自動化で接触・粒子・破損を抑えます。" },
            { label: "OPTICS", title: "光学・耐久評価", body: "透過、反射、均一性、照射寿命、熱、真空、像への影響を測定します。" },
            { label: "INSPECTION", title: "欠陥・粒子検査", body: "膜欠陥、異物、フレーム、接着部、たわみを検出・分類します。" },
            { label: "QUALITY", title: "品質保証", body: "仕様、ロット、変更、逸脱、破損・汚染解析、認定、トレーサビリティを管理します。" },
            { label: "CUSTOMER", title: "技術支援", body: "マスク・露光装置・ウェーハ結果から、膜・取付け・清浄課題を切り分けます。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、高分子・ナノ材料、薄膜、精密機械、接着、光学、真空、熱、クリーンルーム、自動化、画像検査、品質のどこを担当するかを確認します。",
        "材料、フィルム、光学部材、精密組立、クリーン生産、分析、設備、生産技術の経験を接続できます。具体的な製品波長・開発段階・勤務地は公式求人で確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体ペリクルメーカーでよくある質問",
      lead: "防塵原理、DUV・EUV、膜と企業の違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体ペリクルとは何ですか？", answer: "薄膜をフレームへ張り、フォトマスクの回路面から離して取り付ける防塵カバーです。異物を膜上で受け、露光時に焦点外へ置くことで転写リスクを抑えます。" },
            { question: "主な半導体ペリクルメーカーは？", answer: "この記事では三井化学、信越化学工業／Shin-Etsu MicroSi、FST、Pao Taiを完成品・関連製品の代表例として紹介しています。AGCは膜材料の隣接企業として分けています。" },
            { question: "ペリクルを付ければ異物欠陥はなくなりますか？", answer: "完全にはなくなりません。膜上の異物は焦点外になりますが、大きさや条件で影響が残る場合があります。マスク洗浄、検査、清浄搬送、装着管理も必要です。" },
            { question: "ペリクル膜はフォトマスクへ密着していますか？", answer: "通常はフレームによってマスクの回路面から離して保持します。この距離により膜上の異物を露光焦点から外します。" },
            { question: "KrF・ArF用とEUV用の違いは？", answer: "KrF・ArF用は対象DUV波長を通す高分子膜が中心です。EUV用は13.5nm光の吸収を抑えつつ、高温・真空・機械負荷へ耐えるシリコン系やCNT系などの極薄膜を使います。" },
            { question: "CNTペリクルとは何ですか？", answer: "カーボンナノチューブを網目状の極薄膜へ構成する次世代EUVペリクル方式です。高いEUV透過と耐熱・強度・寿命の両立を目指して開発・量産準備が進められています。" },
            { question: "透過率が高いペリクルほど優れていますか？", answer: "一概には言えません。耐光・耐熱寿命、強度、たわみ、粒子、揮発、反射、装着適合も満たす必要があります。同じ波長・測定条件で比較します。" },
            { question: "ペリクルは交換できますか？", answer: "製品・マスク仕様に応じて取外し、マスク洗浄、再装着を行う場合があります。回路面を傷つけず汚染を持ち込まない専用工程・治具・検査が必要です。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜波長・膜・耐久・清浄構造をそろえてメーカーを見る",
      lead: "ペリクルは、フォトマスクの回路情報を露光中の異物から守る光学・機械部材です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "FOCUS", title: "異物を焦点外へ置く", body: "膜をマスク面から離し、膜上粒子が鮮明に転写されるリスクを抑える" },
            { label: "OPTICS", title: "波長へ膜を合わせる", body: "KrF・ArFの高分子膜と、EUVのシリコン系・CNT系を分ける" },
            { label: "RELIABILITY", title: "透過と耐久を両立する", body: "光・熱・真空・強度・たわみ・寿命・像への影響を確認する" },
            { label: "CLEAN", title: "製品全体の清浄度を見る", body: "膜、フレーム、接着、容器、装着、検査、交換、変更管理をそろえる" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトマスクメーカー", href: "/guides/semiconductor-photomask-manufacturers", description: "ペリクルで保護する完成原版と主要企業を見る" },
            { label: "マスクブランクスメーカー", href: "/guides/semiconductor-mask-blank-manufacturers", description: "完成マスクの母材となる基板・薄膜材料を見る" },
            { label: "フォトマスク検査装置メーカー", href: "/guides/semiconductor-photomask-inspection-equipment-manufacturers", description: "装着前後・使用中のマスク、裏面・エッジを検査する装置を見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "マスク像をウェーハへ転写する工程を見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "KrF・ArF・EUV装置と主要企業を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "マスク・膜・粒子を検査する装置企業を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "マスク・露光・ウェーハ加工のつながりを見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、露光波長、膜材料・構造、光学性能、耐久・機械性能、清浄度、フレーム・接着、装着・検査、供給・認定の8項目で整理してください。",
      ],
    },
  ],
  todayQuest: "三井化学・信越化学工業／Shin-Etsu MicroSi・FSTから1社を選び、公式製品を波長・膜材料・透過・耐久・清浄構造・供給の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-photomask-manufacturers",
    "semiconductor-mask-blank-manufacturers",
    "semiconductor-photomask-inspection-equipment-manufacturers",
    "photolithography-process",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-cleaning-process",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
