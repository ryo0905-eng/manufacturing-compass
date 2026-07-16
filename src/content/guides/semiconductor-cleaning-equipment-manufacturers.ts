import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCleaningEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-cleaning-equipment-manufacturers",
  title: "半導体の洗浄装置メーカーとは？SCREEN・東京エレクトロン・Lam Researchを初心者向けに図解",
  description:
    "半導体の洗浄装置メーカーは、ウェーハ上の粒子・残留物・汚染を除去し、次工程に適した表面を作る量産装置を開発します。枚葉式・バッチ式・スクラバー、装置構成、主要企業、比較方法、仕事内容を図解します。",
  targetQuery: "半導体 洗浄装置 メーカー",
  searchIntent:
    "半導体洗浄装置の構成と方式、枚葉式・バッチ式・スクラバーの違い、SCREEN・東京エレクトロン・Lam Researchなど主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "SCREENセミコンダクターソリューションズ、東京エレクトロン、Lam Research、芝浦メカトロニクスの公式製品・技術情報をもとに、装置構成、処理方式、対象工程を整理しました。市場シェアや企業の優劣ではなく、用途をそろえて洗浄装置メーカーを比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存の洗浄技術記事で汚染除去、リンス、乾燥の原理を整理したうえで、量産装置と企業ポートフォリオを独立して調べる記事が必要だと判断",
    "SCREEN、東京エレクトロン、Lam Researchの公式情報で、枚葉式、バッチ式、スクラバー、ウェット洗浄、裏面・外周処理などの領域を確認",
    "芝浦メカトロニクスの公式製品情報で、研磨後・最終洗浄、フォトマスク、搬送容器まで対象物が広がることを確認し、比較軸へ反映",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Products | Wafer Cleaning System",
      url: "https://www.screen.co.jp/spe/en/products",
      publisher: "SCREEN Semiconductor Solutions Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Single Wafer Cleaner SU-3400",
      url: "https://www.screen.co.jp/spe/en/products/su-3400",
      publisher: "SCREEN Semiconductor Solutions Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Cleaning CELLESTA Series",
      url: "https://www.tel.com/product/cellesta.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-16",
    },
    {
      title: "Cleaning EXPEDIUS Series",
      url: "https://www.tel.com/product/expedius.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-16",
    },
    {
      title: "Cleaning NS Series",
      url: "https://www.tel.com/product/ns.html",
      publisher: "Tokyo Electron Limited",
      accessedAt: "2026-07-16",
    },
    {
      title: "Strip & clean | Our Processes",
      url: "https://www.lamresearch.com/products/our-processes/",
      publisher: "Lam Research Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "EOS Product Family",
      url: "https://www.lamresearch.com/product/eos/",
      publisher: "Lam Research Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "DV-Prime & Da Vinci Product Families",
      url: "https://www.lamresearch.com/product/dv-prime-da-vinci/",
      publisher: "Lam Research Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "半導体製造装置",
      url: "https://www.shibaura.co.jp/products/semicon/",
      publisher: "芝浦メカトロニクス株式会社",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "SCREEN、東京エレクトロン、Lam Researchはいずれも洗浄装置を扱いますが、枚葉式とバッチ式の違い、スクラバー、研磨後洗浄、裏面・外周洗浄など、どの装置を比べればよいか分かりにくくありませんか。",
    conclusion:
      "洗浄装置は、搬送、薬液供給、処理槽・チャンバー、物理洗浄、純水リンス、乾燥、排気・排液、制御を統合します。企業比較では、除去対象、前後工程、処理方式、材料保護、乾燥、生産性を同じ条件にそろえます。",
    learnings:
      "洗浄装置の役割と構成、枚葉式・バッチ式・スクラバー、ウェット・ドライ系、対象工程、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "洗浄装置メーカーを比べるときは、『どれだけ強く洗えるか』ではなく、『何を除去し、何を残し、どの表面状態で次工程へ渡す装置か』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜搬入から洗浄・リンス・乾燥・記録まで",
      description:
        "代表的なウェット洗浄装置を単純化した流れです。実際の順序と処理モジュールは対象工程・装置方式で異なります。",
      stages: [
        { label: "01 / LOAD", title: "ウェーハを搬入", body: "FOUPやカセットからウェーハを取り出し、処理槽・チャンバーへ運ぶ" },
        { label: "02 / REMOVE", title: "汚染を離す", body: "薬液反応、スプレー、ブラシ、液流などで粒子・残留物を除去する" },
        { label: "03 / RINSE", title: "薬液と除去物を流す", body: "高純度の水で薬液と離れた汚染を置換し、装置外へ排出する" },
        { label: "04 / DRY", title: "跡を残さず乾燥", body: "再付着、乾燥跡、微細構造の変形を抑えて水分を除く" },
        { label: "05 / CONTROL", title: "状態を記録して搬出", body: "処理履歴、薬液、温度、アラームなどを記録し、次工程へ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "ロードポート・搬送", right: "ウェーハを識別し、表面へ触れずに槽・チャンバー間を移動する" },
        { left: "槽・枚葉チャンバー", right: "複数枚を浸漬するか、一枚ずつ回転・保持して処理空間を作る" },
        { left: "薬液・純水供給", right: "薬液濃度、温度、流量、ろ過、循環、純水品質を安定させる" },
        { left: "物理洗浄", right: "スプレー、ブラシなどで粒子へ力を与え、表面から離す" },
        { left: "リンス・乾燥", right: "薬液と除去物を持ち去り、乾燥跡やパターン変形を抑える" },
        { left: "排気・排液・安全", right: "蒸気、ミスト、薬液、排水を分離・管理し、漏えいと混触を防ぐ" },
        { left: "制御・センサー", right: "レシピ、搬送、温度、薬液状態、装置状態、保守履歴を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "洗浄装置メーカーとは、表面準備を量産設備へする企業",
      lead: "汚染除去だけでなく、必要材料を守り、次工程に適した表面を繰り返し作ります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "REMOVE", title: "不要物を除去", body: "粒子、有機物、金属、工程残留物、不要な表面膜などを目的別に取り除きます。" },
            { label: "PROTECT", title: "材料と構造を保護", body: "必要膜の減少、腐食、表面粗れ、傷、微細構造の変形を抑えます。" },
            { label: "REPEAT", title: "量産で再現", body: "面内・ウェーハ間・装置間の清浄度と表面状態を安定させます。" },
          ],
        },
        {
          type: "note",
          title: "洗浄装置とウェットエッチング装置は重なる場合がある",
          body: "薬液で不要物を除去する点は共通し、同じ装置プラットフォームが洗浄、レジスト除去、表面膜の選択除去などへ使われる場合があります。目的が汚染除去か、膜厚・形状を作る材料加工かを確認します。",
        },
      ],
      paragraphs: [
        "洗浄は製造の最初に一度だけ行う工程ではありません。成膜前、リソグラフィ前、エッチング後、レジスト除去後、CMP後、接合前など、目的を変えながら何度も挿入されます。",
        "装置メーカーは表面化学、流体、精密搬送、熱、機械、計測、安全、環境、ソフトウェアを組み合わせ、工場で連続運転できる設備へ仕上げます。",
      ],
    },
    {
      id: "methods",
      heading: "枚葉式・バッチ式・スクラバーは、処理単位と除去方法が違う",
      lead: "一つの方式がすべての工程で優れるのではなく、対象表面と量産条件で選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置方式",
          rightLabel: "特徴と主な確認点",
          rows: [
            { left: "枚葉式洗浄装置", right: "一枚ずつ回転・保持し、薬液、スプレー、リンス、乾燥を個別制御する。多チャンバー化で生産性を高める" },
            { left: "バッチ式ウェットステーション", right: "複数枚を槽へまとめて浸漬し、薬液処理・リンス・乾燥を行う。槽構成と液管理が重要" },
            { left: "スピンスクラバー", right: "ウェーハを回転させ、純水、スプレー、ブラシなどで表面・裏面・外周の粒子を除去する" },
            { left: "ドライ・気相系", right: "蒸気、ガス、プラズマ、オゾンなどの反応を使う。液体プロセスと対象材料・残留物を分けて選ぶ" },
            { left: "専用洗浄装置", right: "CMP後、ウェーハ裏面・外周、フォトマスク、FOUP・FOSBなど、対象物と工程へ機能を最適化する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "汚染、薬液処理、リンス、乾燥の原理を見る" },
            { label: "CMP・平坦化", href: "/guides/semiconductor-cmp-process", description: "研磨後洗浄の前工程と除去対象を見る" },
          ],
        },
      ],
      paragraphs: [
        "SCREENはウェットステーション、枚葉式洗浄装置、スピンスクラバーを製品分類として公開しています。東京エレクトロンもCELLESTAの枚葉式、EXPEDIUSのバッチ式、NSシリーズのスクラバーなどを案内しています。",
        "Lam Researchは枚葉スピン技術を使うウェット洗浄製品を、先端デバイスからパワー・センサー、先端パッケージまで用途別に示しています。装置名だけでなく、対象工程と基板を確認します。",
      ],
    },
    {
      id: "single-wafer",
      heading: "枚葉式は、ウェーハごとに薬液・物理力・乾燥を制御する",
      lead: "複数チャンバーを並列に使い、個別制御と量産性を両立します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SPIN", title: "回転・保持", body: "ウェーハをチャックで保持し、回転で液膜、排出、乾燥を制御します。" },
            { label: "DISPENSE", title: "薬液を個別供給", body: "ノズルから薬液・純水を供給し、表面・裏面・外周を目的別に処理します。" },
            { label: "MULTI-CHAMBER", title: "並列処理", body: "複数チャンバーと搬送を一つの装置へ統合し、処理能力を高めます。" },
            { label: "PHYSICAL", title: "物理洗浄", body: "スプレーやブラシなどの力を加え、粒子除去を補助します。" },
            { label: "DRY", title: "乾燥制御", body: "液の置換、雰囲気、回転などを制御し、乾燥跡と構造変形を抑えます。" },
            { label: "RECIPE", title: "工程別レシピ", body: "薬液、温度、時間、順序を対象材料と除去物に合わせて切り替えます。" },
          ],
        },
      ],
      paragraphs: [
        "SCREENのSUシリーズ、東京エレクトロンのCELLESTAシリーズ、Lam ResearchのEOS、DV-Prime、Da Vinciなどは、各社が公開する枚葉ウェット洗浄の代表的な製品群です。搭載チャンバー数や用途は製品ごとに異なります。",
        "枚葉式でも薬液洗浄、物理洗浄、裏面・外周処理、乾燥方式は同じではありません。比較では一つのカタログ数値より、必要な工程を装置構成として実現できるかを見ます。",
      ],
    },
    {
      id: "batch",
      heading: "バッチ式は、複数枚と複数槽をまとめて管理する",
      lead: "まとまった処理能力に加え、薬液寿命、持ち込み、槽間搬送を設計します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "管理項目",
          rightLabel: "装置で確認すること",
          rows: [
            { left: "バッチ構成", right: "一度に処理する枚数、ウェーハ間隔、カセット・治具、搬送方式" },
            { left: "槽構成", right: "薬液槽、純水リンス槽、乾燥モジュールの数、順序、共用・専用" },
            { left: "薬液管理", right: "濃度、温度、循環、ろ過、交換、補給、汚染持ち込みの監視" },
            { left: "ウェーハ間均一性", right: "バッチ内の位置による除去量、粒子、表面状態、乾燥の差" },
            { left: "生産運用", right: "バッチ待ち、処理時間、槽切替、製品混在、保守時の影響" },
          ],
        },
        {
          type: "note",
          title: "枚葉式とバッチ式を単純な新旧で分けない",
          body: "両方式は現在の製品ラインアップに存在し、工程要求、生産量、材料、薬液、ウェーハサイズ、工場運用で使い分けられます。方式名だけで性能や採用工程を決めつけません。",
        },
      ],
      paragraphs: [
        "SCREENはFC・WS・CWなどのウェットステーションを、東京エレクトロンはEXPEDIUSシリーズを公式製品として案内しています。製品群の対象ウェーハ、槽数、処理用途は最新仕様で確認します。",
        "バッチ式ではウェーハをまとめて処理するため、薬液状態とバッチ内均一性に加え、前の製品からの持ち込み、槽・治具の清浄度、乾燥までを一つの装置系として管理します。",
      ],
    },
    {
      id: "process-positions",
      heading: "前後工程によって、洗浄装置が解く課題は変わる",
      lead: "同じウェット洗浄でも、除去物と守る材料が違います。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・対象",
          rightLabel: "主な装置課題",
          rows: [
            { left: "成膜・熱処理前", right: "粒子、有機物、金属、不要な表面膜を除去し、界面反応が始まる表面をそろえる" },
            { left: "リソグラフィ前後", right: "粒子、裏面・外周汚染、レジスト由来物を管理し、塗布・焦点・転写へ影響を残さない" },
            { left: "エッチング・レジスト除去後", right: "反応残留物やポリマーなどを除去し、必要膜と微細構造へのダメージを抑える" },
            { left: "CMP後", right: "研磨粒子、スラリー成分、金属・残留物を除去し、平坦な表面を保つ" },
            { left: "裏面・外周・ベベル", right: "膜、粒子、残留物を除き、チャック・搬送・次工程への再付着を抑える" },
            { left: "先端パッケージ", right: "薄いウェーハ、バンプ・パッド、深い構造、接合前表面などを損傷させず処理する" },
          ],
        },
      ],
      paragraphs: [
        "Lam Researchはウェット洗浄の用途として粒子・ポリマー・残留物除去、裏面・外周処理、レジスト除去などを示しています。芝浦メカトロニクスは研磨後洗浄、最終洗浄、フォトマスク、搬送容器などの装置を公開しています。",
        "装置カテゴリーが同じでも、露出材料、構造、許容膜減り、必要清浄度は工程ごとに変わります。企業比較は製品名ではなく、入力表面と出力表面をそろえて行います。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体洗浄装置の代表企業4社",
      lead: "網羅的な順位表ではなく、公式情報から確認できる主な製品領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主な洗浄装置・対象領域",
          rows: [
            { left: "SCREEN｜日本", right: "SUシリーズの枚葉式、FC・WS・CWのウェットステーション、SSのスピンスクラバー、裏面洗浄など" },
            { left: "東京エレクトロン｜日本", right: "CELLESTAの枚葉式、EXPEDIUSのバッチ式、NSのスクラバー、表面・裏面・外周、物理洗浄・乾燥など" },
            { left: "Lam Research｜米国", right: "EOS、DV-Prime、Da Vinciなどの枚葉ウェット洗浄、裏面・外周、レジスト・残留物除去、先端パッケージ向けなど" },
            { left: "芝浦メカトロニクス｜日本", right: "研磨後・最終ウェーハ洗浄、フォトマスク洗浄、FOUP・FOSB洗浄、ウェット処理など" },
          ],
        },
        {
          type: "note",
          title: "企業発表のシェア表現は、比較順位に使わない",
          body: "企業が自社調査や特定カテゴリーでシェアを公表する場合がありますが、対象製品、地域、期間、調査方法で数値は変わります。この記事では市場順位を固定せず、公開製品の役割を整理します。",
        },
      ],
      paragraphs: [
        "同じ企業でも、先端前工程、成熟工程、パワー、センサー、先端パッケージ、フォトマスクなどで製品構成が異なります。会社全体を一つの洗浄方式として比較しません。",
        "製品の追加・統合・名称変更があるため、特定装置を調べる場合は、各社の最新製品ページで対応ウェーハ、処理、用途、提供状況を確認してください。",
      ],
    },
    {
      id: "comparison",
      heading: "洗浄装置メーカーは、6つの条件をそろえて比較する",
      lead: "除去性能だけでなく、材料保護、乾燥、工場運用まで含めます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較条件",
          rightLabel: "確認すること",
          rows: [
            { left: "1. 除去対象・工程位置", right: "粒子、金属、有機物、残留物、表面膜の何を、どの工程の前後で除去するか" },
            { left: "2. 対象物・材料", right: "ウェーハ径、表面・裏面・外周、フォトマスク、搬送容器、露出材料、微細構造" },
            { left: "3. 処理方式", right: "枚葉、バッチ、スクラバー、ウェット、気相・ドライ系、薬液・物理力の組み合わせ" },
            { left: "4. プロセス性能", right: "粒子除去、残留物、膜減り、選択性、表面粗さ、傷、再付着、乾燥跡、構造変形" },
            { left: "5. 量産性能", right: "スループット、装置面積、稼働率、装置間差、製品切替、保守時間、部品寿命" },
            { left: "6. 安全・環境・コスト", right: "薬液・純水・電力・ガス使用量、再利用、排液、排気、漏えい対策、運用コスト" },
          ],
        },
      ],
      paragraphs: [
        "カタログの処理能力は、レシピ、ウェーハ径、チャンバー構成、処理時間などの条件で変わります。異なる条件の公称値を、そのまま企業の優劣へ置き換えません。",
        "量産では洗浄後の欠陥が少ないだけでなく、必要膜を残すこと、後工程の結果が安定すること、薬液・純水を安全に管理できること、保守後に短時間で復帰できることも評価します。",
      ],
    },
    {
      id: "production",
      heading: "薬液・純水・乾燥・保守が量産性能を決める",
      lead: "処理チャンバー以外の設備と運用も、清浄度へ直接影響します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CHEMICAL", title: "薬液供給・回収", body: "濃度、温度、ろ過、循環、再利用、交換を管理し、変動と使用量を抑えます。" },
            { label: "UPW", title: "純水品質", body: "粒子、イオン、有機物などを管理した水で、薬液と除去物を持ち去ります。" },
            { label: "DRY", title: "乾燥", body: "再付着、乾燥跡、微細構造の変形を抑え、次工程へ渡します。" },
            { label: "EXHAUST", title: "排気・排液", body: "ミスト、蒸気、異なる薬液・排水を安全に分離し、設備へ接続します。" },
            { label: "PART", title: "部品・清浄度", body: "ノズル、ブラシ、配管、槽、チャンバー、搬送部が汚染源にならないよう管理します。" },
            { label: "DATA", title: "装置データ", body: "レシピ、センサー、アラーム、処理・保守履歴を欠陥・計測結果と結び付けます。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "洗浄前後の粒子・欠陥・表面を評価する装置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "ウェット処理とドライ加工の役割を分ける" },
          ],
        },
      ],
      paragraphs: [
        "薬液と純水は工場設備から供給されますが、装置内でも分配、温調、ろ過、循環、回収、監視を行います。装置性能を処理室だけでなく、供給から排出までの流路として捉えます。",
        "保守時に部品や配管へ触れると、清浄度と薬液状態が変わる可能性があります。予防保全、部品交換、洗い込み、モニター処理、復帰判定までが安定稼働の仕事です。",
      ],
    },
    {
      id: "jobs",
      heading: "洗浄装置メーカーの主な職種",
      lead: "化学・流体・機械・制御・安全を横断して量産装置を支えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種",
          rightLabel: "主な仕事",
          rows: [
            { left: "プロセス・アプリケーション", right: "汚染と材料に合わせて薬液、物理力、リンス、乾燥を設計し、顧客工程へ適用する" },
            { left: "機械・流体設計", right: "槽、チャンバー、ノズル、配管、回転、搬送、温調、排気・排液を設計する" },
            { left: "電気・制御・ソフトウェア", right: "装置シーケンス、モーション、安全インターロック、UI、データ連携を開発する" },
            { left: "フィールドサービス", right: "据付、立ち上げ、保守、故障解析、薬液・搬送・処理状態の復旧を顧客工場で行う" },
            { left: "生産・品質", right: "部品・装置の組立、検査、清浄度、変更管理、供給、出荷品質を支える" },
            { left: "設備・安全・環境", right: "薬液、純水、排気、排液、漏えい、保護、資源使用を工場条件と整合させる" },
          ],
        },
      ],
      paragraphs: [
        "装置保全、薬液設備、水処理、流体、機械設計、制御、品質、生産技術、安全、分析、顧客対応の経験は接点を整理しやすい領域です。求人では対象装置、開発か量産支援か、顧客先作業、薬液取扱い、海外連携を確認します。",
        "経験を説明するときは、清浄度、再現性、稼働率、復旧時間、薬液・純水使用量、安全、欠陥低減のどこへ貢献したかを、担当範囲と一緒に言語化します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体洗浄装置メーカーでよくある質問",
      lead: "装置方式と工程の範囲を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体洗浄装置とは何ですか？", answer: "ウェーハなどの表面から粒子、金属、有機物、工程残留物などを除去し、純水リンスと乾燥を経て次工程に適した表面を作る量産装置です。" },
            { question: "主な半導体洗浄装置メーカーは？", answer: "この記事ではSCREEN、東京エレクトロン、Lam Research、芝浦メカトロニクスを代表例として紹介しています。このほかにも用途別の専門企業があり、網羅的な順位表ではありません。" },
            { question: "枚葉式とバッチ式の違いは？", answer: "枚葉式は一枚ずつ回転・保持して薬液、リンス、乾燥を制御します。バッチ式は複数枚を槽へまとめて処理します。対象工程、生産量、材料、薬液、工場運用で使い分けます。" },
            { question: "洗浄装置とウェットエッチング装置の違いは？", answer: "洗浄は主に汚染・残留物を除き、次工程の表面を準備します。ウェットエッチングは薬液反応で対象膜を必要量だけ除去し、膜厚や形状を作ります。同じ装置が複数用途へ対応する場合もあります。" },
            { question: "洗浄後に乾燥が必要なのはなぜですか？", answer: "水分や溶解成分が残ると乾燥跡や再付着につながる可能性があります。微細構造では液面の力でパターンが変形する場合もあるため、乾燥も装置性能として管理します。" },
            { question: "洗浄装置は前工程だけで使いますか？", answer: "前工程で繰り返し使うほか、CMP後、ウェーハ裏面・外周、先端パッケージ、フォトマスク、搬送容器などにも洗浄装置があります。対象物と工程を確認します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜除去対象・処理方式・乾燥をそろえてメーカーを見る",
      lead: "洗浄装置は、次工程に必要な表面を量産で再現する設備です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "TARGET", title: "何を除去するか", body: "粒子、残留物、金属、表面膜と、守る材料・構造を確認する" },
            { label: "METHOD", title: "どう処理するか", body: "枚葉、バッチ、スクラバー、薬液、物理力、気相・ドライ系を分ける" },
            { label: "PRODUCTION", title: "量産でどう使うか", body: "乾燥、生産性、薬液・純水、安全、環境、保守まで比較する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "汚染除去、リンス、乾燥の原理を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置企業を一つの地図で見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "材料を除去して形を作る装置を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "洗浄結果を欠陥・表面から評価する装置を見る" },
            { label: "ウェーハ欠陥検査装置メーカー", href: "/guides/semiconductor-wafer-defect-inspection-manufacturers", description: "洗浄前後の粒子・傷・表面異常を探す装置と検査原理を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "装置・材料・半導体メーカーの位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの装置を選び、枚葉・バッチなどの方式、洗浄する対象物、前後工程、除去物、乾燥方法を確認してください。同じ用途の装置へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "SCREEN・東京エレクトロン・Lam Researchから1社を選び、公式製品を枚葉式・バッチ式・スクラバーのどこへ置けるか確認する",
  relatedGuideSlugs: [
    "semiconductor-cleaning-process",
    "semiconductor-cmp-equipment-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-wafer-defect-inspection-manufacturers",
    "semiconductor-cmp-process",
    "semiconductor-deposition-process",
    "photolithography-process",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["screen", "tokyo-electron", "lam-research"],
};
