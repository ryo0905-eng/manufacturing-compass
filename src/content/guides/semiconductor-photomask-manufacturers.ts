import type { GuideArticle } from "@/content/guides/types";

export const semiconductorPhotomaskManufacturersGuide: GuideArticle = {
  slug: "semiconductor-photomask-manufacturers",
  title: "半導体フォトマスクメーカーとは？テクセンド・DNPなどを初心者向けに図解",
  description:
    "半導体フォトマスクは、設計した回路をウェーハへ転写するための原版です。マスクブランクスとの違い、製造工程、バイナリ・位相シフト・EUV、欠陥・寸法・位置精度、主要メーカーを図解します。",
  targetQuery: "半導体 フォトマスク メーカー",
  searchIntent:
    "半導体フォトマスクの役割と製造工程、マスクブランクス・レチクルとの違い、DUV・EUV向けの構造、テクセンドフォトマスク・DNP・Photronicsなど主要企業の領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "テクセンドフォトマスク、DNP、Photronics、HOYAの公式製品・企業情報をもとに、設計データ、マスクブランクス、描画、加工、洗浄、測定・検査、DUV・EUV、供給へ整理しました。個別顧客の設計、製造条件、市場順位ではなく、同じ露光方式と用途へ条件をそろえて企業を見る基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "フォトリソグラフィ、露光装置、フォトレジスト、検査・計測の記事を公開したうえで、回路設計とウェーハ量産をつなぐ原版の企業分類が必要だと判断",
    "テクセンドフォトマスクとDNPの公式情報で、回路データから描画・加工・洗浄・測定・検査を経てフォトマスクを作る流れを確認",
    "Photronicsの公式情報で、バイナリ、OPC、位相シフト、特殊用途などの製品領域を、HOYAの公式情報でDUV・EUV用マスクブランクスの位置付けを確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "製品情報",
      url: "https://www.photomask.com/product/",
      publisher: "テクセンドフォトマスク株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "会社概要",
      url: "https://www.photomask.com/about/overview/",
      publisher: "テクセンドフォトマスク株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "トッパンフォトマスク、「テクセンドフォトマスク株式会社」に社名を変更",
      url: "https://www.photomask.com/news/press/20241001095837.html",
      publisher: "テクセンドフォトマスク株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "半導体製造の裾野を広げ、誰もが快適で便利な社会を支えるDNPの「フォトマスク」",
      url: "https://www.dnp.co.jp/media/detail/20175730_1563.html",
      publisher: "大日本印刷株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "2ナノメートル世代のEUVリソグラフィ向けフォトマスク製造プロセス開発を加速",
      url: "https://www.dnp.co.jp/news/detail/20173719_1587.html",
      publisher: "大日本印刷株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "Our Products",
      url: "https://www.photronics.com/products/",
      publisher: "Photronics, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Leading-Edge Advanced Photomasks",
      url: "https://www.photronics.com/integrated-circuits-ic/leading-edge-advanced-photomasks/",
      publisher: "Photronics, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Information Technology Business",
      url: "https://www.hoya.com/ir/2025/en/review/it.html",
      publisher: "HOYA Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "フォトマスクメーカーを調べても、マスクブランクス、レチクル、バイナリマスク、位相シフトマスク、EUVマスクなどの言葉が並び、どの会社が何を作っているのか分かりにくくありませんか。",
    conclusion:
      "フォトマスクは、半導体の回路設計データをガラス・石英などの基板上の微細パターンへ変え、露光装置でウェーハへ繰り返し転写する原版です。企業比較では、完成マスクとブランクスを分け、露光方式、倍率、マスク構造、CD、位置精度、欠陥、検査・修正、納期、情報管理、供給体制をそろえます。",
    learnings:
      "フォトマスクとレチクル、マスクブランクスの違い、設計データから完成までの工程、バイナリ・位相シフト・EUV、品質管理、ペリクル、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "フォトマスクメーカーを比べるときは、『ガラス板を作る会社』と考えるのではなく、『設計データを、露光装置が量産転写できる精密な原版へ変える会社』として見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜設計データを、検査済みの量産用原版へ変える",
      description:
        "フォトマスク製造を単純化した流れです。実際のデータ処理、材料、加工、検査、修正、保護仕様は露光方式・製品・メーカーで異なります。",
      stages: [
        { label: "01 / DATA", title: "設計データを受け取る", body: "対象層のレイアウト、補正パターン、識別情報などを安全に受領し、描画用データへ準備する" },
        { label: "02 / WRITE", title: "レジストへ描画する", body: "マスクブランクス上の感光膜へ、電子ビームや用途に応じた描画装置でパターンを書く" },
        { label: "03 / PATTERN", title: "現像・加工する", body: "描画したレジスト像を現し、吸収膜などへパターンを移して不要なレジストを除く" },
        { label: "04 / CLEAN", title: "洗浄する", body: "加工残り、粒子、有機物などを除去し、表面を測定・検査できる状態へ整える" },
        { label: "05 / VERIFY", title: "測定・検査する", body: "CD、位置、パターン、透過・反射特性、欠陥を確認し、必要に応じて修正する" },
        { label: "06 / PROTECT", title: "保護して出荷する", body: "仕様に応じてペリクルなどを取り付け、清浄な容器・物流でウェーハ工場へ届ける" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "言葉",
      rightLabel: "役割",
      rows: [
        { left: "回路設計データ", right: "チップの各層に作る図形情報。描画前に補正、分割、形式変換、整合確認などを行う" },
        { left: "マスクブランクス", right: "ガラス・石英基板へ吸収膜や多層膜などを成膜した、パターン形成前の母材" },
        { left: "フォトマスク", right: "ブランクスへ回路パターンを形成し、測定・検査した完成原版の総称" },
        { left: "レチクル", right: "縮小投影露光で使うマスクを指すことが多い。現場・資料によりフォトマスクと近い意味で使われる" },
        { left: "ペリクル", right: "マスク面への異物付着の影響を抑える保護膜・枠。DUV用とEUV用では材料・構造要求が異なる" },
        { left: "露光装置", right: "完成したマスクのパターンを位置・焦点・露光量を制御してウェーハ上のレジストへ転写する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "フォトマスクメーカーとは、設計とウェーハ量産の間に原版を作る企業",
      lead: "マスクは回路を一度だけ描くためではなく、同じパターンを安定して繰り返し転写するために使います。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "DATA", title: "設計を製造データへ変える", body: "設計ルール、補正、描画装置、検査方法に合わせてデータを準備します。" },
            { label: "FABRICATION", title: "微細パターンを作る", body: "描画、現像、加工、洗浄を組み合わせ、吸収・位相・反射構造を形成します。" },
            { label: "QUALITY", title: "原版を保証する", body: "寸法、位置、欠陥、光学特性を測り、転写に使える状態か判定します。" },
            { label: "SUPPLY", title: "設計変更へ追従する", body: "新規層、改版、再製作、修正、保管、物流を短い開発日程へ合わせます。" },
          ],
        },
        {
          type: "note",
          title: "一つのチップにマスクが1枚とは限らない",
          body: "半導体は多数の層を重ねて作るため、基本的には層ごとに異なるパターンが必要です。多重パターニングなどでは一つの層で複数のマスクを使う場合もあります。",
        },
      ],
      paragraphs: [
        "テクセンドフォトマスクは、回路パターンのデータをもとにマスクブランクスへ電子ビームで描画し、加工、レジスト除去、洗浄、測定、検査を経て完成すると説明しています。DNPもフォトマスクを、回路をウェーハへ転写する原版として案内しています。",
        "マスク上の誤りや異物は、多数のウェーハ・チップへ繰り返し転写される可能性があります。そのため完成品の寸法だけでなく、位置、欠陥、修正履歴、清浄度、使用中の変化まで管理します。",
      ],
    },
    {
      id: "blank",
      heading: "マスクブランクスは母材、フォトマスクはパターン形成後の完成原版",
      lead: "企業分類で最も混同しやすいのが、ブランクスメーカーと完成マスクメーカーです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "供給段階",
          rightLabel: "主な設計・製造内容",
          rows: [
            { left: "ガラス・石英基板", right: "平坦度、表面品質、内部欠陥、熱・機械特性などを管理する透明基板" },
            { left: "DUV用ブランクス", right: "基板上へ光を遮る膜や位相・反射を調整する膜を形成し、表面・膜・欠陥を管理する" },
            { left: "EUV用ブランクス", right: "EUVを反射する多層膜と吸収体などの基礎構造を持ち、基板・膜内の微小欠陥を厳しく管理する" },
            { left: "完成フォトマスク", right: "顧客の設計データをブランクスへ描画・加工し、寸法・位置・欠陥・光学特性を保証する" },
            { left: "マスクサービス", right: "データ準備、検査、欠陥修正、洗浄、再認定、保管、廃棄時の情報保護などを支援する" },
          ],
        },
        {
          type: "note",
          title: "HOYAは半導体向けではマスクブランクス側",
          body: "HOYAは公式情報で、半導体フォトマスク製造に使うマスター基板としてDUV用・EUV用マスクブランクスを案内しています。完成フォトマスク企業と同じ役割として並べません。",
        },
      ],
      paragraphs: [
        "マスクブランクスメーカーは、パターンを形成する前の基板・薄膜構造を供給します。完成マスクメーカーは、その母材へ顧客固有の回路データを加工して納品します。",
        "品質問題を考えるときも、基板・多層膜・吸収膜に由来する欠陥か、描画・加工・洗浄・取扱いに由来する欠陥かを分けます。両者は密接に連携しますが、担当工程は異なります。",
      ],
    },
    {
      id: "types",
      heading: "バイナリ・位相シフト・EUVでは、光を制御する仕組みが違う",
      lead: "新しい方式が常にすべての用途で優れるのではなく、露光装置・対象層・コストに合わせて使い分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "マスクの種類",
          rightLabel: "基本的な考え方",
          rows: [
            { left: "バイナリマスク", right: "主に光を通す部分と遮る部分でパターンを作る。成熟工程から先端の補正パターン付きまで用途が広い" },
            { left: "OPC付きマスク", right: "ウェーハ上で狙い形状へ近づくよう、光学・プロセスの影響を見越してマスク図形を補正する" },
            { left: "位相シフトマスク", right: "透過光の強さだけでなく位相差を利用し、像のコントラスト、解像、焦点余裕を改善する" },
            { left: "DUV用透過型マスク", right: "KrF・ArFなどの光を基板側から通し、吸収体・位相構造で投影像を作る" },
            { left: "EUV用反射型マスク", right: "EUVを材料へ透過させにくいため、多層膜で反射させ、吸収体パターンで像を作る" },
            { left: "ナノインプリント用モールド", right: "光学像を投影せず、微細な凹凸を持つ型を樹脂へ接触させて転写する。通常のフォトマスクとは工程原理が違う" },
          ],
        },
      ],
      paragraphs: [
        "Photronicsは成熟用途のバイナリマスク・レチクルから、OPC付きバイナリ、位相シフト、特殊用途までを公式に案内しています。製品名が同じでも、倍率、光源、寸法、欠陥仕様は用途ごとに異なります。",
        "EUVでは反射型構造、斜め入射、極小欠陥、吸収体形状、ペリクルなどDUVとは異なる課題があります。DUVの知識をそのまま置き換えず、露光方式を最初に確認します。",
      ],
    },
    {
      id: "quality",
      heading: "CD・位置精度・欠陥・光学特性が、ウェーハ上の転写を左右する",
      lead: "マスク品質は一つの最小寸法では表せません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "CD", title: "寸法と均一性", body: "線幅・開口寸法と、マスク面内・パターン間のばらつきを管理します。" },
            { label: "REGISTRATION", title: "パターン位置", body: "設計座標に対する配置誤差を抑え、ウェーハ上の重ね合わせを支えます。" },
            { label: "FIDELITY", title: "形状再現", body: "角、曲線、補助図形、密集・孤立パターンを描画データどおりに作ります。" },
            { label: "DEFECT", title: "欠陥と修正", body: "余分なパターン、欠け、粒子、膜・基板欠陥を検出し、影響と修正可否を判断します。" },
            { label: "OPTICAL", title: "透過・位相・反射", body: "DUVの透過率・位相差、EUVの反射特性などを仕様へ合わせます。" },
            { label: "CLEANLINESS", title: "清浄度と耐久", body: "洗浄、ペリクル、容器、保管、露光中の汚染・曇り・劣化を管理します。" },
          ],
        },
        {
          type: "note",
          title: "仕様値は同じ条件で比べる",
          body: "マスク種、光源、倍率、パターン、測定装置、定義が違えば、CD・位置・欠陥値を単純比較できません。メーカー公称値を企業順位へ変換しません。",
        },
      ],
      paragraphs: [
        "マスク上の寸法誤差は、露光光学系やプロセスの影響と重なってウェーハ像へ現れます。微細化では、設計図形と完成マスクの差だけでなく、その差がウェーハへどの程度増幅されるかも重要です。",
        "検査で信号が見つかっても、すべてが転写不良になるとは限りません。欠陥の位置、種類、サイズ、層の重要度、露光条件、ウェーハ像への影響を組み合わせて判定します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体フォトマスクの代表企業と隣接企業",
      lead: "完成マスク3社と、母材であるマスクブランクスの代表例を工程へ置きます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "テクセンドフォトマスク｜日本", right: "半導体用フォトマスク、研究・産業用途のガラスマスク、ナノインプリント用モールドを開発・製造。旧・トッパンフォトマスクで、2024年11月に現社名へ変更" },
            { left: "DNP｜日本", right: "半導体用フォトマスクを開発・製造し、光リソグラフィ向けに加えてEUV向け製造プロセスやナノインプリント用テンプレートを開発" },
            { left: "Photronics｜米国", right: "IC向けのバイナリマスク・レチクル、OPC付きマスク、位相シフト、特殊用途、FPD用大型マスクなどをグローバルに展開" },
            { left: "HOYA｜日本・ブランクス", right: "完成マスクの母材となる半導体用マスクブランクスを展開。公式情報ではDUV用とEUV用を案内" },
          ],
        },
        {
          type: "note",
          title: "代表例であり、市場順位ではない",
          body: "半導体メーカーがマスクを内製する場合もあり、外販企業の対応地域・方式・製品は変わります。ここでは公式情報から役割を理解しやすい企業を例示しています。",
        },
      ],
      paragraphs: [
        "テクセンドフォトマスクはTOPPANグループの事業を母体とする完成マスク企業、DNPは印刷・微細加工技術を発展させた完成マスク企業です。PhotronicsもIC・FPD向けの外販フォトマスクを展開しています。",
        "HOYAは半導体向けではブランクス供給を中心に確認できます。企業研究では『マスク関連』という言葉だけでまとめず、完成マスク、ブランクス、検査装置、描画装置、ペリクルのどこかを確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "フォトマスクメーカーは、8つの条件をそろえて比較する",
      lead: "会社名の比較を、設計データ・原版性能・量産供給の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 用途・露光方式", right: "IC・先端パッケージ・研究開発、1X・縮小投影、i線・KrF・ArF・EUV・ナノインプリントのどこか" },
            { left: "2. マスク構造", right: "バイナリ、OPC、位相シフト、反射型EUV、特殊構造と、対応するブランクス・吸収体・保護仕様" },
            { left: "3. データ処理・描画", right: "受入形式、データ準備、補正、描画方式、データ量、改版、照合、設計情報のアクセス管理" },
            { left: "4. 寸法・位置・形状", right: "CD、均一性、登録・配置、形状再現、倍率、マスク面内の変形と測定定義" },
            { left: "5. 欠陥・光学特性", right: "欠陥感度、転写影響、修正、透過率、位相、反射率、膜・基板欠陥、ペリクル" },
            { left: "6. 納期・サービス", right: "新規製作、改版、再製作、緊急対応、検査・洗浄・修正、設計から出荷までの窓口" },
            { left: "7. 拠点・供給継続", right: "製造・検査拠点、顧客近接性、設備能力、材料調達、複数拠点認定、災害・物流への備え" },
            { left: "8. 品質・情報管理", right: "トレーサビリティ、変更通知、容器・保管、設計IP、データ送受信、廃棄・再利用時の情報保護" },
          ],
        },
      ],
      paragraphs: [
        "最初に対象方式を固定してください。成熟ノードの1Xバイナリマスクと、ArF縮小投影用位相シフトマスク、EUV反射型マスクでは、設備・材料・検査・ペリクルの要求が異なります。",
        "次に納期と情報管理を確認します。フォトマスクは製品立上げや設計変更の日程へ直結し、回路設計という重要情報を扱うため、技術性能と同時に安全なデータ運用・変更管理が必要です。",
      ],
    },
    {
      id: "jobs",
      heading: "フォトマスクメーカーの仕事は、データ・微細加工・検査・供給をつなぐ",
      lead: "半導体設計だけでも、ウェーハプロセスだけでも完結しない仕事です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "DATA", title: "データ準備・IT", body: "顧客データの受領、変換、補正、描画データ生成、照合、計算資源、情報保護を担当します。" },
            { label: "PROCESS", title: "マスクプロセス", body: "レジスト、描画、現像、加工、洗浄、修正の条件と工程窓を開発します。" },
            { label: "EQUIPMENT", title: "設備・生産技術", body: "描画、加工、洗浄、測定、検査、搬送設備の能力・稼働・自動化を改善します。" },
            { label: "METROLOGY", title: "測定・検査", body: "CD、位置、欠陥、光学特性を測り、判定・修正・工程フィードバックへつなげます。" },
            { label: "MATERIAL", title: "材料・表面技術", body: "ブランクス、レジスト、吸収膜、多層膜、洗浄、ペリクルとの相互作用を評価します。" },
            { label: "QUALITY", title: "品質保証", body: "仕様、ロット、設備・材料変更、逸脱、原因解析、再発防止、顧客認定を管理します。" },
            { label: "SUPPLY", title: "生産・供給管理", body: "案件ごとの優先順位、納期、設備負荷、材料、容器、保管、物流を調整します。" },
            { label: "CUSTOMER", title: "営業・技術支援", body: "顧客の設計・露光・ウェーハ結果をマスク課題へ分解し、製作仕様をすり合わせます。" },
          ],
        },
      ],
      paragraphs: [
        "求人では、設計データ処理、描画、ウェット・ドライ加工、洗浄、光学・電子線検査、画像処理、品質、設備保全、顧客支援のどこを担当するかを確認します。",
        "半導体、印刷、精密加工、材料、化学、光学、画像処理、データ基盤、情報セキュリティ、生産管理の経験を接続できます。具体的な担当製品と勤務地は公式求人で確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体フォトマスクメーカーでよくある質問",
      lead: "原版、母材、露光方式、企業の違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体フォトマスクとは何ですか？", answer: "半導体の回路設計データをガラス・石英などの基板上の微細パターンへ変え、露光装置でウェーハ上のレジストへ転写するための原版です。" },
            { question: "主な半導体フォトマスクメーカーは？", answer: "この記事ではテクセンドフォトマスク、DNP、Photronicsを完成マスクの代表例として紹介しています。HOYAは半導体向けマスクブランクスの隣接企業として分けています。" },
            { question: "テクセンドフォトマスクとトッパンフォトマスクは別会社ですか？", answer: "株式会社トッパンフォトマスクは2024年11月1日にテクセンドフォトマスク株式会社へ社名変更しました。企業情報を調べるときは現在の社名と旧社名の両方が検索結果に出る場合があります。" },
            { question: "フォトマスクとマスクブランクスの違いは？", answer: "マスクブランクスはガラス・石英基板へ必要な薄膜を形成したパターン加工前の母材です。そこへ顧客の回路パターンを描画・加工・検査したものが完成フォトマスクです。" },
            { question: "フォトマスクとレチクルの違いは？", answer: "レチクルは縮小投影露光で使うマスクを指すことが多い言葉です。ただし企業・現場・資料によってフォトマスクと近い意味で使われるため、倍率と露光方式を確認します。" },
            { question: "EUVマスクは透明ですか？", answer: "EUVは材料を透過しにくいため、一般的なDUVマスクのような透過型ではなく、多層膜でEUVを反射させる構造を使います。" },
            { question: "露光装置メーカーとフォトマスクメーカーの違いは？", answer: "フォトマスクメーカーは回路情報を持つ原版を作ります。露光装置メーカーは、その原版の像を位置・焦点・露光量を制御してウェーハへ転写する装置を作ります。" },
            { question: "マスクの欠陥はすべてウェーハへ転写されますか？", answer: "欠陥の種類、位置、サイズ、露光方式、焦点、層の重要度などで影響が変わります。マスク検査、転写影響の評価、必要に応じた修正を組み合わせて判断します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜完成マスク・ブランクス・露光方式を分けて企業を見る",
      lead: "フォトマスクは、回路設計をウェーハ量産へ持ち込むための精密な情報媒体です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "ROLE", title: "原版の役割を押さえる", body: "設計データを繰り返し露光できる微細パターンへ変える" },
            { label: "SUPPLY", title: "ブランクスと分ける", body: "パターン前の母材と、顧客データを加工した完成品を区別する" },
            { label: "METHOD", title: "DUV・EUVを分ける", body: "透過型・反射型、バイナリ・位相、倍率、ペリクルを確認する" },
            { label: "QUALITY", title: "量産全体で比べる", body: "CD、位置、欠陥、光学特性、納期、情報管理、供給継続を見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "マスクブランクスメーカー", href: "/guides/semiconductor-mask-blank-manufacturers", description: "回路を描く前の基板・薄膜材料と主要企業を見る" },
            { label: "フォトマスク描画装置メーカー", href: "/guides/semiconductor-photomask-writer-manufacturers", description: "設計データをブランクス上のレジストへ描く装置と方式を見る" },
            { label: "ペリクルメーカー", href: "/guides/semiconductor-pellicle-manufacturers", description: "完成マスクを異物から守る薄膜・フレームと主要企業を見る" },
            { label: "フォトリソグラフィ", href: "/guides/photolithography-process", description: "マスク像をレジストへ転写する工程の仕組みを見る" },
            { label: "露光装置メーカー", href: "/guides/semiconductor-lithography-equipment-manufacturers", description: "EUV・DUV・i線装置と主要企業を見る" },
            { label: "フォトレジストメーカー", href: "/guides/semiconductor-photoresist-manufacturers", description: "露光で反応する感光材料と主要企業を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "マスク・ウェーハの欠陥と寸法を測る企業を見る" },
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "設計・マスク・前工程のつながりを見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "設計・材料・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式情報から一つの用途を選び、露光方式、マスク構造、データ・描画、寸法・位置、欠陥・光学特性、納期・サービス、拠点・供給、品質・情報管理の8項目で整理してください。",
      ],
    },
  ],
  todayQuest: "テクセンドフォトマスク・DNP・Photronicsから1社を選び、公式情報を用途・露光方式・マスク種・製造工程・品質・供給の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-mask-blank-manufacturers",
    "semiconductor-photomask-writer-manufacturers",
    "semiconductor-pellicle-manufacturers",
    "photolithography-process",
    "semiconductor-lithography-equipment-manufacturers",
    "semiconductor-photoresist-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-cleaning-process",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
