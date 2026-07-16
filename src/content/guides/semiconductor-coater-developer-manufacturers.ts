import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCoaterDeveloperManufacturersGuide: GuideArticle = {
  slug: "semiconductor-coater-developer-manufacturers",
  title: "半導体の塗布現像装置メーカーとは？東京エレクトロン・SCREENなどを初心者向けに図解",
  description:
    "半導体の塗布現像装置は、フォトレジストの塗布・ベーク・現像を連続処理するコータ／デベロッパです。スピン塗布、表面処理、エッジ処理、露光装置との接続、膜厚・温度・欠陥管理、主要メーカーを図解します。",
  targetQuery: "半導体 塗布現像装置 メーカー",
  searchIntent:
    "半導体の塗布現像装置・コータ／デベロッパの役割と構成、スピン塗布・ベーク・現像の仕組み、露光装置との違い、東京エレクトロン・SCREEN・SEMES・SUSSなど主要企業の製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "東京エレクトロン、SCREEN Semiconductor Solutions、SEMES、SUSSの公式製品・技術情報をもとに、表面処理、塗布、エッジ処理、ベーク・冷却、露光装置接続、露光後ベーク、現像・乾燥へ整理しました。市場順位や異なる条件の処理能力ではなく、対象ウェーハ・材料・露光方式をそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "フォトリソグラフィ、露光装置、フォトレジストの記事を公開したうえで、露光前後のレジスト処理を担う装置を独立して説明する記事が必要だと判断",
    "東京エレクトロンとSCREENの公式情報で、先端300mm・EUV・液浸・DUV、200mm・パワー／車載、先端パッケージ向け塗布現像装置の領域を確認",
    "SEMESの公式情報でフォトトラックとArF液浸対応、SUSSで研究開発・量産・先端後工程向けの薄膜・厚膜・多様な基板処理を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Coater/Developer LITHIUS™ Series",
      url: "https://www.tel.com/product/lithius.html",
      publisher: "Tokyo Electron Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Coater/Developer ACT™ Series",
      url: "https://www.tel.com/product/act.html",
      publisher: "Tokyo Electron Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Coat/Develop Track DT-3000",
      url: "https://www.screen.co.jp/spe/en/products/dt-3000",
      publisher: "SCREEN Semiconductor Solutions Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Coat/Develop Track RF-200EX/RF-300EX",
      url: "https://www.screen.co.jp/spe/en/products/rf-200ex300ex",
      publisher: "SCREEN Semiconductor Solutions Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Mass Production for ArF-i Spinner",
      url: "https://www.semes.com/en/media/newsroom/detail/124",
      publisher: "SEMES Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Company Overview｜Photo Track",
      url: "https://semes.com/en/company/corporate-overview",
      publisher: "SEMES Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Coater & Developer Solutions",
      url: "https://www.suss.com/en/products-solutions/coating-solutions/coating-and-developing?languageChanged=en",
      publisher: "SUSS MicroTec SE",
      accessedAt: "2026-07-16",
    },
    {
      title: "Photomask Bake & Developer Systems",
      url: "https://www.suss.com/en/products-solutions/photomask-solutions/bake-and-develop",
      publisher: "SUSS MicroTec SE",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "コータ／デベロッパを調べても、単なるレジスト塗布機に見え、なぜベークや冷却、現像、露光装置との接続まで一台のシステムに集約するのか分かりにくくありませんか。",
    conclusion:
      "塗布現像装置は、ウェーハ表面を整え、レジストを均一に塗り、温度を管理し、露光後に必要な部分を現像するモジュール型の搬送システムです。企業比較では、対象ウェーハ・用途、材料、塗布方式、熱処理、現像・乾燥、膜・欠陥性能、露光装置接続、生産性・環境性能をそろえます。",
    learnings:
      "表面処理、スピン塗布、エッジ処理、ソフトベーク・露光後ベーク・冷却、現像・リンス・乾燥、露光装置とのインライン接続、膜厚・CD・欠陥・温度、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "塗布現像装置は薬液を載せるだけの装置ではありません。数十枚・数百枚のウェーハで、膜厚、温度、待ち時間、搬送順序を再現し、露光装置を止めずにパターン形成へつなぎます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜表面処理から塗布・露光・現像まで",
      description:
        "代表的なポジ型レジスト工程を単純化しています。材料、光源、下層膜、製品、装置構成により順序・モジュール・処理条件は異なります。",
      stages: [
        { label: "01 / PRIME", title: "表面を整える", body: "脱水・密着処理などで水分と表面状態を管理し、レジストが均一に付く準備をする" },
        { label: "02 / COAT", title: "レジストを塗る", body: "ウェーハ中央などへ薬液を供給し、回転・気流・排気を制御して薄膜を広げる" },
        { label: "03 / EDGE", title: "端部を処理する", body: "エッジ・裏面に回り込んだ膜を処理し、搬送汚染や剥離、後工程への持込みを抑える" },
        { label: "04 / BAKE", title: "加熱・冷却する", body: "溶剤を調整し、膜を安定化してから冷却し、一定の温度・時間で露光装置へ渡す" },
        { label: "05 / EXPOSE", title: "露光装置で像を作る", body: "マスク像をレジストへ転写し、必要に応じて露光後ベークで反応を進める" },
        { label: "06 / DEVELOP", title: "現像・乾燥する", body: "現像液で選択的にレジストを除去し、リンス・乾燥して計測・次工程へ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "主要モジュール",
      rightLabel: "主な役割",
      rows: [
        { left: "薬液供給・塗布カップ", right: "レジスト、下層材、現像液などを安定供給し、回転・排気・洗浄でウェーハ面内の処理を作る" },
        { left: "ホットプレート", right: "塗布前後、露光後などの加熱温度・時間・面内均一性を管理し、膜と化学反応を安定させる" },
        { left: "クールプレート", right: "加熱後のウェーハ温度を一定に戻し、次処理までの温度・待ち時間差を抑える" },
        { left: "搬送ロボット・バッファ", right: "多数の処理モジュールと露光装置の間で、ウェーハ順序・待ち時間・向き・清浄度を管理する" },
        { left: "薬液・排気・排液系", right: "材料別の供給、濃度・温度、ノズル、回収、排気、廃液、安全を装置全体で管理する" },
        { left: "計測・監視・制御", right: "膜厚、温度、吐出、ノズル、画像、装置状態、処理履歴を監視し、異常と変動を早く捉える" },
      ],
    },
  ],
  sections: [
    {
      id: "coating",
      heading: "スピン塗布は、遠心力だけで膜厚を決めるわけではない",
      lead: "材料、供給、回転、気流、乾燥、基板状態が一体で膜を作ります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "塗布の要素",
          rightLabel: "膜へ与える主な影響",
          rows: [
            { left: "レジスト粘度・溶剤", right: "広がり方、乾燥速度、目標膜厚、端部形状、材料消費、気泡・析出などへ影響する" },
            { left: "吐出量・位置・ノズル", right: "初期の濡れ、中心・端部の膜、液切れ、液滴、ノズル汚染、材料交換時の再現性へ影響する" },
            { left: "回転速度・加速度", right: "膜の広がりと排出、最終膜厚、面内均一性、飛散、端部形状へ影響する" },
            { left: "カップ内気流・排気", right: "溶剤蒸発、乾燥むら、再付着、気流起因の膜厚差、装置内汚染へ影響する" },
            { left: "ウェーハ温度・表面", right: "濡れ性、密着、乾燥、膜厚、欠陥へ影響するため、脱水・表面処理・冷却時間を管理する" },
            { left: "エッジ・裏面処理", right: "端部の厚膜、裏面付着、チャック・搬送汚染、膜剥離、後工程での異物化を抑える" },
          ],
        },
        {
          type: "note",
          title: "同じ回転数でも同じ膜厚になるとは限らない",
          body: "材料ロット、温度、湿度、ノズル、吐出、排気、表面状態、処理待ち時間が違えば膜厚・欠陥が変わります。回転条件だけでなく装置・材料・環境を一体で管理します。",
        },
      ],
      paragraphs: [
        "一般的なスピン塗布では、回転するウェーハ上へ材料を供給し、余分な液を外へ排出しながら薄膜を作ります。必要に応じて塗布前の溶剤処理や複数材料の積層を組み合わせます。",
        "段差・深い穴・厚膜・高粘度材料では、通常のスピン塗布だけで側壁や凹部へ均一に膜を作るのが難しい場合があります。SCREENはスプレー塗布、SUSSは薄膜から厚膜・多様な基板に対応する装置群を案内しています。",
      ],
    },
    {
      id: "bake-develop",
      heading: "ベーク・冷却・現像は、レジストの反応とCDを安定させる",
      lead: "温度と処理間の時間は、露光量と並ぶ重要な工程条件です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "処理",
          rightLabel: "主な目的と管理項目",
          rows: [
            { left: "塗布前加熱・表面処理", right: "水分を減らし、密着性・濡れ性を整える。温度、時間、雰囲気、処理後待ち時間を見る" },
            { left: "ソフトベーク", right: "塗布膜の溶剤量と膜状態を整える。温度均一性、接触・近接方式、時間、排気を見る" },
            { left: "露光後ベーク｜PEB", right: "化学増幅型レジストなどの反応を進める。露光からの待ち時間、温度、面内差がCDへ影響する" },
            { left: "冷却", right: "次処理前にウェーハ温度を一定へ戻し、処理順・待ち時間による差を抑える" },
            { left: "現像", right: "露光による溶解性の差をパターンへ変える。現像液、供給・保持・回転、時間、温度を見る" },
            { left: "リンス・乾燥", right: "反応と残留液を止め、残渣・ウォーターマーク・パターン倒れ・再付着を抑えて次工程へ渡す" },
          ],
        },
      ],
      paragraphs: [
        "SCREENは塗布現像装置について、感光膜を作るコータと、露光後に不要部分を除くデベロッパの二つの機能を説明しています。実際のトラックには複数の加熱・冷却・搬送モジュールが組み込まれます。",
        "化学増幅型レジストでは露光後ベークによる反応・拡散が像形成へ影響します。温度の平均値だけでなく、面内均一性、ウェーハ間、露光からベークまでの時間を管理します。",
      ],
    },
    {
      id: "inline",
      heading: "露光装置とのインライン接続で、待ち時間と生産性を管理する",
      lead: "トラックとスキャナーは別の役割ですが、一つのリソグラフィセルとして動きます。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜トラックと露光装置のウェーハ受け渡し",
          description:
            "代表的なインライン構成です。スタンドアロン運用、装置台数、バッファ、搬送経路は工場・製品・露光方式で異なります。",
          stages: [
            { label: "01 / IN", title: "ロットを受け入れる", body: "ウェーハ識別、レシピ、材料、露光層、装置状態を確認して処理順を作る" },
            { label: "02 / PRE", title: "露光前処理", body: "表面処理、塗布、エッジ処理、加熱・冷却を行い、一定状態で露光側へ渡す" },
            { label: "03 / HANDOFF", title: "露光装置へ渡す", body: "インターフェース部でウェーハを受け渡し、両装置の処理能力とバッファを同期する" },
            { label: "04 / EXPOSE", title: "位置合わせ・露光", body: "露光装置がマスク像を転写し、ウェーハをトラックへ戻す" },
            { label: "05 / POST", title: "露光後処理", body: "露光後ベーク、冷却、現像、リンス・乾燥を所定時間内に行う" },
            { label: "06 / OUT", title: "計測へ渡す", body: "処理履歴を保存し、膜・CD・重ね合わせ・欠陥の計測と次工程へ送る" },
          ],
        },
        {
          type: "note",
          title: "トラックが止まると、高価な露光装置の生産性にも影響する",
          body: "塗布現像側の搬送、薬液、温調、モジュール保守が滞ると、露光装置へウェーハを供給できません。処理能力だけでなく稼働率、冗長性、保守中の運転、復旧性を見ます。",
        },
      ],
      paragraphs: [
        "東京エレクトロンは、塗布・露光・現像が接続装置でインライン処理され、高い信頼性と精密制御が必要だと説明しています。SCREENのDT-3000は二つの処理ラインを並列・独立運転し、露光装置を待たせない生産性を狙った構成です。",
        "量産ではウェーハ一枚の最短時間だけでなく、露光装置との能力整合、処理間待ち時間、モジュール故障時の迂回、薬液交換、レシピ切替を含むリソグラフィセル全体の出力を見ます。",
      ],
    },
    {
      id: "applications",
      heading: "先端前工程・成熟工程・パワー・先端後工程で装置要求が変わる",
      lead: "同じ塗布現像装置でも、ウェーハと材料の扱い方が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "用途",
          rightLabel: "主な装置要求",
          rows: [
            { left: "先端300mm・EUV／ArF液浸", right: "薄膜・低欠陥、高精度温調、高スループット、露光装置接続、下層材、多重パターニング、データ監視" },
            { left: "成熟300mm・200mm", right: "KrF・i線などへの柔軟性、既存レシピ、装置置換、小フットプリント、部品・長期保守、量産安定性" },
            { left: "パワー・車載デバイス", right: "150〜300mm、薄ウェーハ、反り、厚さ・材質の違い、高信頼性、幅広い薬液、低欠陥・低材料消費" },
            { left: "先端後工程", right: "厚膜・高粘度レジスト、ポリイミドなど、多様な基板、反り・薄ウェーハ、両面・端部保持、長い熱処理" },
            { left: "MEMS・フォトニクス", right: "段差・深い構造へのスプレー塗布、厚膜、特殊基板、小ロット、多品種、研究から量産への条件移行" },
            { left: "研究開発・試作", right: "小片・複数ウェーハサイズ、手動・半自動、材料交換、レシピ自由度、観察・計測、量産装置との条件互換" },
          ],
        },
      ],
      paragraphs: [
        "東京エレクトロンはHigh-NA EUVからDUV、先端後工程・高粘度材料まで複数プラットフォームを案内しています。SCREENは先端300mm、200mm、薄ウェーハ、幅広い材料、スプレー塗布を製品ごとに分けています。",
        "SEMESはフォトトラックとArF液浸対応、SUSSは100〜300mmの自動装置と研究開発用装置、薄膜・厚膜、多様な基板を案内しています。用途の異なる装置仕様を直接比較しません。",
      ],
    },
    {
      id: "quality",
      heading: "膜厚・温度・欠陥・CD・材料消費・稼働率を一体で見る",
      lead: "塗布性能だけでなく、現像後のパターンと量産運用までが装置性能です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FILM", title: "膜厚・均一性", body: "中心から端部、ウェーハ間、ロット間、時間変化で膜厚と下層膜を安定させます。" },
            { label: "THERMAL", title: "温度・待ち時間", body: "加熱・冷却の面内差、ウェーハ間差、露光前後の時間を制御します。" },
            { label: "DEFECT", title: "塗布・現像欠陥", body: "粒子、気泡、液滴、筋、乾燥むら、端部異常、残渣、再付着などを抑えます。" },
            { label: "PATTERN", title: "CD・形状", body: "膜・ベーク・現像条件が、線幅、穴、粗さ、パターン倒れ、工程窓へ与える影響を見ます。" },
            { label: "CHEMICAL", title: "薬液使用・交換", body: "吐出効率、配管残量、材料切替、廃液、排気、洗浄、容器からの供給を管理します。" },
            { label: "OEE", title: "稼働・生産性", body: "処理能力、故障、保守、復旧、モジュール冗長性、露光装置待ち、フットプリントを見ます。" },
          ],
        },
        {
          type: "note",
          title: "メーカー公表の処理枚数だけを横並びにしない",
          body: "ウェーハサイズ、レシピ、モジュール数、インライン・スタンドアロン、ベーク時間、露光装置、稼働条件が違えば比較できません。リソグラフィセル全体の安定出力で評価します。",
        },
      ],
      paragraphs: [
        "材料消費を減らしても、膜厚・欠陥・ノズル安定性が悪化すれば量産メリットは得られません。薬液費、排液・排気、電力、フットプリント、保守を品質と合わせて見ます。",
        "装置データは、吐出・温度・搬送・モジュール状態と、膜厚・CD・欠陥結果を結び付けて使います。異常検知だけでなく、予防保全、レシピ最適化、装置間差の管理へつなげます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体塗布現像装置の代表企業4社",
      lead: "公式情報で確認できる製品領域を、対象工程とウェーハへ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "東京エレクトロン｜日本", right: "CLEAN TRACK LITHIUSシリーズで先端300mm、EUV・High-NA・ArF液浸・DUVに対応。ACTシリーズ、先端後工程・高粘度材料向けも展開" },
            { left: "SCREEN Semiconductor Solutions｜日本", right: "DT-3000など先端300mmの塗布現像トラック、200mm・パワー／車載・薄ウェーハ向けRFシリーズ、MEMS向けスプレー塗布など" },
            { left: "SEMES｜韓国", right: "半導体向けフォトトラックを事業領域とし、OMEGA系やArF液浸対応トラックの開発・量産を公式に案内" },
            { left: "SUSS｜ドイツ", right: "100〜300mmの自動コータ／デベロッパ、研究開発・小量産装置、薄膜・厚膜・多様な基板、先端後工程、フォトマスク用ベーク・現像装置" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、市場順位ではない",
          body: "先端前工程のインライントラックと、成熟工程、先端後工程、MEMS、研究開発用装置では競合範囲が異なります。同じ用途・ウェーハ・材料へそろえて比較します。",
        },
      ],
      paragraphs: [
        "東京エレクトロンとSCREENは幅広い半導体量産用トラック、SEMESは韓国のフォトトラック、SUSSは研究開発から量産・先端後工程・マスク処理までを公式に示しています。",
        "企業研究では『コータ／デベロッパ』を一括りにせず、先端300mm、200mm、パワー・車載、先端後工程、MEMS、研究開発、フォトマスクのどこかへ分けます。",
      ],
    },
    {
      id: "comparison",
      heading: "塗布現像装置メーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、材料・処理・露光連携・量産運用の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象ウェーハ・用途", right: "300mm・200mm、先端・成熟、ロジック・メモリ、パワー、先端後工程、MEMS、研究、マスクなど" },
            { left: "2. 材料・膜", right: "レジスト、下層、厚膜・高粘度、ポリイミドなどの種類、膜厚、溶剤、材料交換、保存・供給" },
            { left: "3. 塗布・端部処理", right: "スピン・スプレー、吐出、回転、排気、エッジ・裏面、段差・反り・薄ウェーハへの対応" },
            { left: "4. 熱処理・現像", right: "表面処理、ソフトベーク、PEB、冷却、現像方式、リンス・乾燥、温度・時間均一性" },
            { left: "5. 膜・パターン品質", right: "膜厚、面内・ウェーハ間均一性、粒子・欠陥、CD、粗さ、残渣、パターン倒れ、工程窓" },
            { left: "6. 露光装置・計測連携", right: "EUV・ArF・KrF・i線、インライン接続、能力整合、バッファ、計測統合、装置間フィードバック" },
            { left: "7. 生産性・環境", right: "処理能力、稼働率、冗長性、保守、フットプリント、薬液・電力・排気・排液、復旧時間" },
            { left: "8. 供給・量産支援", right: "製造・サービス拠点、部品、教育、材料・露光企業との共同評価、レシピ移管、変更管理、長期保守" },
          ],
        },
      ],
      paragraphs: [
        "最初に対象用途を固定してください。High-NA EUV向け300mmトラックと、200mmパワーデバイス、厚膜の先端後工程、研究開発装置では必要な精度・材料・搬送が異なります。",
        "次に露光・計測まで工程を広げます。塗布膜が均一でも、露光装置との待ち時間、PEB、現像、CD・欠陥が安定しなければ量産装置として成立しません。",
      ],
    },
    {
      id: "jobs",
      heading: "塗布現像装置の仕事は、化学・熱・流体・搬送・制御をつなぐ",
      lead: "材料と装置の境界に多くの専門職があります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PROCESS", title: "プロセス開発", body: "塗布、ベーク、冷却、現像、膜・CD・欠陥を材料・露光・後工程と合わせます。" },
            { label: "CHEMICAL", title: "薬液・流体", body: "供給、配管、ポンプ、ノズル、温度、濃度、排液・排気、材料交換を設計します。" },
            { label: "THERMAL", title: "熱設計", body: "ホット・クールプレート、温度均一性、熱変形、雰囲気、電力を設計・評価します。" },
            { label: "MECHANICS", title: "機械・搬送", body: "スピンカップ、チャック、ロボット、バッファ、薄ウェーハ・反り、露光接続を設計します。" },
            { label: "CONTROL", title: "電気・制御", body: "モーター、センサー、温調、吐出、搬送同期、安全、装置シーケンスを作ります。" },
            { label: "SOFTWARE", title: "ソフトウェア・データ", body: "レシピ、GUI、ログ、異常検知、計測連携、MES、装置状態解析を担当します。" },
            { label: "QUALITY", title: "製造・品質", body: "組立、調整、清浄度、出荷試験、部品・供給者、変更、信頼性を管理します。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、露光装置接続、立上げ、保守、故障解析、稼働・欠陥改善を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、先端前工程・成熟工程・先端後工程・研究用途のどこか、プロセスモジュール・搬送・ソフトウェア・顧客支援のどこを担当するかを確認します。",
        "化学、材料、流体、熱、精密機械、ロボット、制御、ソフトウェア、設備、生産技術、品質、フィールドサービスの経験を接続できます。",
      ],
    },
    {
      id: "faq",
      heading: "半導体の塗布現像装置でよくある質問",
      lead: "装置名、工程、塗布・ベーク・現像、露光装置との違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体の塗布現像装置とは何ですか？", answer: "ウェーハ表面処理、フォトレジスト・下層材の塗布、加熱・冷却、露光後ベーク、現像、リンス・乾燥を複数モジュールで連続処理する装置です。" },
            { question: "コータ／デベロッパとトラックは同じですか？", answer: "文脈によりほぼ同じ装置群を指します。コータは塗布、デベロッパは現像の機能名で、トラックは熱処理・搬送を含む連続処理システムとして使われます。" },
            { question: "主な塗布現像装置メーカーは？", answer: "この記事では東京エレクトロン、SCREEN Semiconductor Solutions、SEMES、SUSSを用途別の代表例として紹介しています。網羅的な市場順位ではありません。" },
            { question: "露光装置との違いは？", answer: "塗布現像装置はレジスト膜を作り、露光後にパターンを現します。露光装置はフォトマスクの回路情報をレジストへ光で転写します。量産では接続して使う場合があります。" },
            { question: "なぜウェーハを回転させるのですか？", answer: "供給した材料を面内へ広げ、余分な液を外へ排出して薄膜を作るためです。膜厚は回転だけでなく、材料、吐出、温度、気流、表面状態でも変わります。" },
            { question: "ベークは何のために行いますか？", answer: "塗布膜の溶剤と状態を整える、露光後の化学反応を進めるなどの目的があります。工程ごとに温度・時間・冷却・待ち時間を管理します。" },
            { question: "先端後工程でも同じ装置を使いますか？", answer: "基本機能は共通しますが、厚膜・高粘度材料、反り・薄ウェーハ、多様な基板、長い熱処理などに適した専用構成が使われます。" },
            { question: "装置比較で最も重要な数字は処理枚数ですか？", answer: "処理枚数だけではありません。膜・CD・欠陥、材料・露光適合、稼働率、薬液・電力、保守、フットプリントを同じ条件で評価します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜材料・熱・搬送を制御し、露光像をパターンへ変える",
      lead: "塗布現像装置は、リソグラフィの前後をつなぐ量産システムです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "COAT", title: "均一な膜を作る", body: "表面、材料、吐出、回転、気流、端部を制御する" },
            { label: "THERMAL", title: "温度と時間をそろえる", body: "塗布前後・露光後の加熱、冷却、待ち時間を管理する" },
            { label: "DEVELOP", title: "潜像を形へ変える", body: "現像、リンス、乾燥で次工程に使えるレジストパターンを作る" },
            { label: "CELL", title: "露光装置と同期する", body: "搬送、処理能力、稼働、データをリソグラフィセル全体で最適化する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "塗布・露光・現像でレジストパターンを作る仕組みを見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "トラックと接続してマスク像を転写する装置を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "塗布・現像する感光材料と周辺材料を見る" },
            { label: "高純度薬液メーカー", href: "/guides/semiconductor-high-purity-chemical-manufacturers", description: "現像・洗浄・剥離などで使う液体材料と供給を見る" },
            { label: "検査・計測の仕組み", href: "/guides/semiconductor-inspection-metrology", description: "膜厚、CD、重ね合わせ、欠陥を測って工程へ返す流れを見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "膜・パターン・欠陥を測る装置企業を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "現像後のレジスト像を下地材料へ移す装置を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "リソグラフィと前後工程の全体像を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの用途を選び、対象ウェーハ・用途、材料・膜、塗布・端部処理、熱処理・現像、膜・パターン品質、露光・計測連携、生産性・環境、供給・量産支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "東京エレクトロン・SCREEN・SEMES・SUSSから1社を選び、公式製品を対象用途・材料・塗布・熱処理・露光連携・生産性の6項目で整理する",
  relatedGuideSlugs: [
    "photolithography-process",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-high-purity-chemical-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-cleaning-equipment-manufacturers",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
    "quality-engineer-route",
  ],
  relatedCompanyIds: ["tokyo-electron", "screen"],
};
