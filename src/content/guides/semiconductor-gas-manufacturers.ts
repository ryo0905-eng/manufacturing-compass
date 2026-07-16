import type { GuideArticle } from "@/content/guides/types";

export const semiconductorGasManufacturersGuide: GuideArticle = {
  slug: "semiconductor-gas-manufacturers",
  title: "半導体ガスメーカーとは？日本酸素（旧・大陽日酸）・Air Liquideなどを初心者向けに図解",
  description:
    "半導体ガスは、成膜・エッチング・洗浄・熱処理などで使う高純度材料です。バルクガスと特殊ガス、工程別用途、供給設備、安全・環境管理、主要メーカーと比較軸を図解します。",
  targetQuery: "半導体 ガス メーカー",
  searchIntent:
    "半導体工場で使うガスの種類と役割、バルクガス・特殊ガス・前駆体の違い、日本酸素・Air Liquide・Linde・岩谷産業など主要企業の事業領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "日本酸素グループ、Air Liquide、Linde、岩谷産業の公式製品・事業情報をもとに、半導体用ガスを工程、純度、供給方式、安全・環境管理へ整理しました。個別ガスの採用条件や市場順位ではなく、材料から供給・排気までを同じ範囲で比較する基礎を説明します。大陽日酸は2026年4月1日に日本酸素へ社名変更したため、現社名を基本に旧社名を併記します。",
  showCareerCtas: false,
  experienceBasis: [
    "成膜・エッチング・洗浄の記事でガスの役割に触れたうえで、ガス材料、供給設備、主要企業を独立して調べる記事が必要だと判断",
    "日本酸素グループの公式情報で、半導体材料ガス、精製、供給設備、配管、監視、排ガス処理までの事業領域を確認",
    "Air Liquide、Linde、岩谷産業の公式情報で、超高純度ガス、特殊材料、オンサイト・バルク供給、関連設備の領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "半導体材料ガス",
      url: "https://jfp.jp.nipponsanso.com/products/semiconductor-material.html",
      publisher: "日本酸素JFP株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "電子機材機器事業部とは",
      url: "https://denzai-eq.jp.nipponsanso.com/electronic-equipment-equipment.html",
      publisher: "日本酸素株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "Company Name to Change to Nippon Sanso Corporation from April 2026",
      url: "https://www.tn-sanso.co.jp/en/news/detail.html?TabModule986=0&dispmid=994&itemid=940",
      publisher: "Nippon Sanso Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductors",
      url: "https://electronics.airliquide.com/who-we-are/our-markets/semiconductors-0",
      publisher: "Air Liquide Electronics",
      accessedAt: "2026-07-16",
    },
    {
      title: "Electronics Specialty Materials",
      url: "https://electronics.airliquide.com/offer-brands/our-offer/electronics-specialty-materials",
      publisher: "Air Liquide Electronics",
      accessedAt: "2026-07-16",
    },
    {
      title: "Linde Starts Up New Plant in China to Supply Shanghai Huali Microelectronics",
      url: "https://www.linde.com/news-and-media/2020/linde-starts-up-new-plant-in-china-to-supply-shanghai-huali-microelectronics",
      publisher: "Linde plc",
      accessedAt: "2026-07-16",
    },
    {
      title: "半導体関連｜取扱産業ガス",
      url: "https://industry.iwatani.co.jp/industrial_gas_category/industrial_gas_category-31/",
      publisher: "岩谷産業株式会社",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "半導体ガスメーカーを調べても、窒素・アルゴンのような大量に使うガスと、成膜・エッチング用の反応性ガスが同じ一覧に並び、何を基準に企業を比べればよいか分かりにくくありませんか。",
    conclusion:
      "半導体ガスは、膜の原料、加工の反応種、熱処理雰囲気、装置のパージなどを担う高純度材料です。企業比較では、対象工程とガス群、純度・分析、容器・供給方式、設備、排気・除害、安全管理、供給拠点と変更認定までをそろえます。",
    learnings:
      "バルクガス・キャリアガス・特殊ガス・前駆体の違い、工程別用途、純度と汚染、容器から装置までの供給フロー、安全・環境管理、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "半導体ガスメーカーを比べるときは、ガス名だけでなく、『どの工程へ、どの純度・流量で、どう安全に途切れず届け、使った後をどう処理するか』まで見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜製造・充填したガスを、品質を変えずに装置へ届ける",
      description:
        "容器供給の概念例です。大量ガスはローリー、貯槽、配管、オンサイト発生設備などを使う場合があり、構成はガス・工場・法規・使用量で異なります。",
      stages: [
        { label: "01 / MAKE", title: "製造・精製", body: "原料からガスを分離・合成し、工程に不要な水分・酸素・粒子・金属などを低減する" },
        { label: "02 / FILL", title: "分析・充填", body: "組成と不純物を確認し、適合する容器や供給形態へ充填してロットを管理する" },
        { label: "03 / DELIVER", title: "輸送・構内保管", body: "温度、圧力、容器、在庫、法規、安全条件を管理して工場へ届ける" },
        { label: "04 / SUPPLY", title: "減圧・精製・分配", body: "キャビネット、バルブ、精製器、配管、監視設備を通して必要な圧力・流量へ整える" },
        { label: "05 / PROCESS", title: "装置で反応・置換", body: "成膜、エッチング、熱処理、洗浄、注入、パージなどの目的に使う" },
        { label: "06 / ABATE", title: "排気・除害", body: "未反応ガスと副生成物を回収・分解・無害化し、状態を監視する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "ガス・材料の区分",
      rightLabel: "主な役割と供給の考え方",
      rows: [
        { left: "バルク・ユーティリティ系", right: "窒素、酸素、アルゴン、水素、ヘリウムなど。使用量に応じて液化ガス、配管、オンサイト発生などで供給する" },
        { left: "キャリア・パージ系", right: "材料を運ぶ、反応雰囲気を作る、配管・装置内を置換する。超高純度と安定流量を重視する" },
        { left: "特殊プロセスガス", right: "成膜、エッチング、チャンバ洗浄、ドーピングなどで化学反応・元素導入を担う" },
        { left: "先端材料・前駆体", right: "CVD・ALDなどでシリコン、金属、絶縁膜の構成元素を表面へ届ける。液体・固体材料を気化する場合もある" },
        { left: "混合・標準ガス", right: "露光光源、装置校正、分析、濃度管理などに使う。混合精度と長期安定性を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "半導体ガスメーカーとは、工程材料と供給システムを一体で支える企業",
      lead: "ガスは目に見えませんが、ウェーハ表面の反応と工場の連続稼働を支える直接材料です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MATERIAL", title: "元素・反応種を届ける", body: "膜の原料、加工する反応種、ドーパント、熱処理雰囲気として使います。" },
            { label: "PURITY", title: "汚染を持ち込まない", body: "微量の水分、酸素、粒子、金属、他成分を分析・低減します。" },
            { label: "DELIVERY", title: "流量を途切れさせない", body: "容器、貯槽、発生設備、精製器、配管、バルブで装置へ供給します。" },
            { label: "SAFETY", title: "供給から排気まで守る", body: "漏えい検知、遮断、換気、遠隔監視、排気・除害を組み合わせます。" },
          ],
        },
        {
          type: "note",
          title: "工業ガスと半導体ガスは、同じ分子でも品質・供給条件が違う",
          body: "同じ窒素や水素でも、許容不純物、分析項目、容器・配管の清浄度、供給安定性、変更管理が用途で変わります。一般工業用の仕様を半導体用途へそのまま当てはめません。",
        },
      ],
      paragraphs: [
        "Air Liquideは半導体向けに、超高純度キャリアガス、特殊・先端材料、供給設備、分析、ガス・薬液管理サービスを示しています。日本酸素も材料ガスだけでなく、精製、供給、配管、監視、排ガス処理まで案内しています。",
        "したがって企業研究では、ボンベ製品の品ぞろえだけでなく、製造拠点、分析、物流、工場内インフラ、緊急対応まで含む事業として捉えます。",
      ],
    },
    {
      id: "process-uses",
      heading: "成膜・エッチング・洗浄・注入・熱処理で、ガスの役割が変わる",
      lead: "同じガスが複数工程で使われることもあり、工程名と目的を先にそろえます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "工程・用途",
          rightLabel: "ガスが担うこと",
          rows: [
            { left: "成膜｜CVD・ALD", right: "シリコン・金属などの前駆体、反応ガス、キャリアガスを表面へ供給し、薄膜を形成する" },
            { left: "ドライエッチング", right: "ハロゲン系などのガスから反応種・イオンを作り、対象膜を揮発性生成物などへ変えて除去する" },
            { left: "チャンバ洗浄", right: "装置内壁に付着した膜を反応で除去し、次ロットへ持ち越す粒子・残膜を抑える" },
            { left: "イオン注入・ドーピング", right: "ホウ素、リン、ヒ素など必要な元素を含む材料を供給し、電気特性を作り込む" },
            { left: "酸化・熱処理", right: "酸化性、還元性、不活性など目的に合う雰囲気を作り、表面反応・活性化・界面状態を制御する" },
            { left: "リソグラフィ", right: "エキシマレーザー用の混合ガス、装置内パージ、温度制御・環境維持などを支える" },
            { left: "搬送・パージ", right: "窒素などで容器、配管、ロードロック、装置内を置換し、水分・酸素・反応性残留物の混入を抑える" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "成膜の仕組み", href: "/guides/semiconductor-deposition-process", description: "ガス・前駆体からCVD・ALD膜ができる原理を見る" },
            { label: "エッチングの仕組み", href: "/guides/semiconductor-etching-process", description: "気体・プラズマで薄膜を加工する原理を見る" },
            { label: "洗浄の仕組み", href: "/guides/semiconductor-cleaning-process", description: "ウェーハ洗浄と装置内洗浄の対象を分ける" },
            { label: "イオン注入の仕組み", href: "/guides/semiconductor-ion-implantation-process", description: "材料からイオンを作り、ウェーハへ導入する流れを見る" },
            { label: "酸化・熱処理", href: "/guides/semiconductor-oxidation-thermal-process", description: "処理雰囲気と熱で表面・結晶を変える仕組みを見る" },
          ],
        },
      ],
      paragraphs: [
        "Air Liquideは公式情報で、成膜、反応、ドーピング、リソグラフィ、エッチング、チャンバ洗浄、アニールへ特殊材料を分類しています。ガス名から工程を推測せず、対象膜・反応・装置まで確認します。",
        "反応ガスは役割を終えると、副生成物や未反応成分とともに排気系へ進みます。投入側の純度・流量と、排出側の腐食・堆積・除害を一続きで設計します。",
      ],
    },
    {
      id: "purity-quality",
      heading: "超高純度とは、純度の桁だけでなく不純物ごとの上限を管理すること",
      lead: "総純度が同じでも、工程へ影響する不純物の種類が違えば同じ品質とは限りません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "品質管理項目",
          rightLabel: "確認すること",
          rows: [
            { left: "組成・濃度", right: "主成分、混合比、反応に必要な成分濃度、充填量・圧力を規格内へそろえる" },
            { left: "水分・酸素", right: "意図しない酸化、反応阻害、膜組成変化、配管・装置への影響を抑える" },
            { left: "粒子・金属", right: "材料製造、容器、バルブ、配管、接続作業から入る汚染を低減・監視する" },
            { left: "炭化水素・他成分", right: "膜中不純物、反応変化、分析干渉につながる微量成分を用途別に管理する" },
            { left: "容器・部材", right: "内面処理、バルブ、シール、残留物、吸着・脱離、腐食、再利用履歴を管理する" },
            { left: "ロット・変更", right: "原料、製造法、設備、分析法、容器、工場の変化を追跡し、顧客認定へつなぐ" },
          ],
        },
        {
          type: "note",
          title: "99.9999%だけでは工程適合を判断できない",
          body: "残りの不純物が何か、検出下限、測定方法、容器から使用点までの汚染増加、工程が許容する上限を確認します。純度表記だけを企業順位へ変換しません。",
        },
      ],
      paragraphs: [
        "ガスは製造時に高純度でも、充填、輸送、容器交換、減圧、配管を通る間に品質が変わり得ます。入口分析だけでなく、使用点に近い場所でのオンライン監視や定期分析も重要です。",
        "異常時は材料ロットだけでなく、容器、接続、供給盤、精製器、配管、装置側流量制御、排気まで履歴をたどります。",
      ],
    },
    {
      id: "supply-systems",
      heading: "ボンベ・バルク・オンサイトは、使用量と安定供給で使い分ける",
      lead: "ガスの危険性、消費量、純度、工場配置、輸送条件に応じて供給方式を設計します。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "CYLINDER", title: "容器供給", body: "少量・多品種の特殊ガスなどを個別容器から供給し、交換と残量を管理します。" },
            { label: "BULK", title: "液化・バルク供給", body: "大量に使うガスをローリーなどで受け入れ、貯槽・気化器・配管から供給します。" },
            { label: "ON-SITE", title: "工場内で発生", body: "窒素などを空気分離・発生設備で製造し、大流量を連続供給します。" },
            { label: "REDUNDANCY", title: "供給を二重化", body: "切替、予備系、在庫、遠隔監視、緊急配送などで供給停止リスクを抑えます。" },
          ],
        },
      ],
      paragraphs: [
        "Lindeは半導体工場向け事例で、窒素・高純度酸素・アルゴン、水素、ヘリウムに加え、オンサイト窒素発生設備とCDAを示しています。岩谷産業も半導体関連として窒素、アルゴン、水素、重水素、高純度ガスなどを案内しています。",
        "供給方式はガス価格だけで決めません。必要流量、ピーク変動、工場増設、物流距離、容器交換回数、停止時の影響、安全設備、保守人員を合わせて評価します。",
      ],
    },
    {
      id: "safety-environment",
      heading: "安全管理は、危険性の分類・検知・遮断・換気・除害を重ねる",
      lead: "半導体で使うガスには、可燃性、支燃性、毒性、腐食性、窒息性、高圧など異なる危険があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "防護の層",
          rightLabel: "代表的な管理",
          rows: [
            { left: "材料を知る", right: "SDS、法規、反応性、混触、分解生成物、許容濃度、適合部材を確認する" },
            { left: "閉じ込める", right: "適合容器、キャビネット、二重配管、継手、バルブ、圧力制御で漏えいを防ぐ" },
            { left: "早く見つける", right: "ガス検知、圧力・流量、排気、火災、設備状態を連続監視し、警報を出す" },
            { left: "止めて隔離する", right: "自動遮断、緊急停止、系統切離し、パージで放出量と影響範囲を抑える" },
            { left: "排気・除害する", right: "ガスと副生成物に適する燃焼、吸着、湿式処理などで排出前に処理する" },
            { left: "運用で守る", right: "教育、資格、手順、容器交換、点検、避難、緊急対応、変更管理を継続する" },
          ],
        },
        {
          type: "note",
          title: "安全設備はガス名だけで共通化しない",
          body: "濃度、圧力、流量、容器、配管長、反応生成物、同時使用材料で危険が変わります。実務では法規、SDS、設備仕様、事業所手順と専門家の判断に従います。",
        },
      ],
      paragraphs: [
        "日本酸素は、シリンダー・キャビネット、精製装置、排ガス処理、監視、配管を供給側から排気側までの事業として示しています。漏えいを防ぐ設備と、異常を前提に検知・遮断・処理する設備を重ねます。",
        "環境面では、排出量だけでなくガス製造・精製、輸送、オンサイト設備の電力、容器回収、未使用量、除害効率も見ます。地球温暖化への影響が大きいガスは、代替材料、使用量削減、回収、除害を工程性能とともに評価します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体ガスの代表企業4社",
      lead: "同じ順位表にせず、公開情報から確認できる材料・供給・設備の範囲を分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "日本酸素（旧・大陽日酸）", right: "日本酸素JFPの半導体材料ガスに加え、精製、供給装置、配管、遠隔監視、排ガス処理などを展開" },
            { left: "Air Liquide", right: "超高純度キャリアガス、特殊・先端材料、供給設備、分析、ガス・薬液管理を半導体向けに展開" },
            { left: "Linde", right: "高純度・特殊ガスをエレクトロニクス向けに供給し、半導体工場でオンサイト発生設備やバルク供給も展開" },
            { left: "岩谷産業", right: "窒素、アルゴン、水素、重水素、標準・高純度ガスなどと、用途に合わせた供給設備・配送を展開" },
          ],
        },
        {
          type: "note",
          title: "日本酸素は2026年4月に社名変更",
          body: "大陽日酸株式会社は2026年4月1日に日本酸素株式会社へ社名変更しました。過去資料・検索語には旧社名が残るため、本記事では現社名を基本に旧社名を併記しています。",
        },
      ],
      paragraphs: [
        "ここでの4社は、半導体関連のガス・材料・供給を理解する代表例です。取り扱い地域、子会社、合弁、製造品目、供給契約は変わるため、網羅的な市場順位や品質順位ではありません。",
        "企業を比べるときは、『特殊ガスがあるか』だけでなく、自社製造・精製の範囲、分析能力、容器・供給設備、オンサイト運転、工場近接拠点、緊急時対応を確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "ガスメーカーは、8つの条件をそろえて比較する",
      lead: "企業名の比較を、工程材料と供給能力の比較へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象工程", right: "成膜、エッチング、洗浄、注入、熱処理、リソグラフィ、パージのどこか" },
            { left: "2. ガス・材料群", right: "バルク、キャリア、特殊ガス、混合ガス、前駆体、液体・固体材料の範囲" },
            { left: "3. 品質・分析", right: "組成、不純物、粒子、検出下限、オンライン分析、ロット追跡、証明書" },
            { left: "4. 容器・供給方式", right: "容器、バルク、オンサイト、精製、流量範囲、切替、予備系、在庫" },
            { left: "5. 工場内設備", right: "キャビネット、配管、バルブ、監視、分析、排気・除害、保守" },
            { left: "6. 安全・環境", right: "SDS、法規、教育、緊急対応、排出削減、回収、除害効率、容器管理" },
            { left: "7. 拠点・安定供給", right: "製造・充填拠点、工場との距離、物流、複数ソース、災害対応、増産余力" },
            { left: "8. 認定・変更管理", right: "サンプル評価、装置試験、顧客認定、原料・設備・工場・分析法の変更通知" },
          ],
        },
      ],
      paragraphs: [
        "最初に一つの工程とガス用途を固定してください。窒素のオンサイト供給企業と、少量の先端前駆体企業を同じ指標で比べても意味がありません。",
        "次に供給停止時の影響を考えます。材料性能が適合しても、必要量、交換頻度、物流、予備系、現場支援が量産計画へ合わなければ採用できません。",
      ],
    },
    {
      id: "jobs",
      heading: "半導体ガスメーカーの仕事は、化学から工場インフラまで広い",
      lead: "製品開発だけでなく、製造・分析・設備・安全・現場運転が連携します。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "R&D", title: "材料・プロセス開発", body: "新規分子、精製、混合、容器、成膜・加工反応、分析方法を開発します。" },
            { label: "PRODUCTION", title: "製造・品質保証", body: "原料、製造、充填、分析、設備、ロット、出荷判定、変更を管理します。" },
            { label: "ENGINEERING", title: "供給設備・保全", body: "発生設備、貯槽、配管、キャビネット、監視、排気・除害を設計・維持します。" },
            { label: "FIELD", title: "現場運転・技術支援", body: "工場内供給、容器交換、在庫、トラブル対応、顧客プロセス評価を支えます。" },
            { label: "ANALYTICS", title: "分析・計測", body: "微量不純物、組成、粒子、容器・配管由来の汚染を測り、原因を追います。" },
            { label: "EHS", title: "安全・環境", body: "法規、SDS、教育、リスク評価、緊急対応、排出・廃棄を管理します。" },
            { label: "SUPPLY", title: "物流・調達", body: "原料、容器、製造拠点、輸送、在庫、需要変動、供給継続を計画します。" },
            { label: "SALES", title: "営業・アプリケーション", body: "顧客工程を理解し、材料、設備、供給方式、評価計画を提案します。" },
          ],
        },
      ],
      paragraphs: [
        "求人を見るときは、『ガス会社』だけで判断せず、材料製造拠点、顧客工場のオンサイト拠点、設備部門、研究所、分析部門のどこで働くかを確認します。勤務形態や必要資格も変わります。",
        "化学・材料、機械、電気、制御、設備保全、品質、物流、安全などの経験を接続できます。実際の職務は求人票と配属拠点の事業内容で確認してください。",
      ],
    },
    {
      id: "faq",
      heading: "半導体ガスメーカーでよくある質問",
      lead: "ガスの分類と企業の役割を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体ガスとは何ですか？", answer: "半導体製造で、膜の原料、加工の反応種、ドーピング材料、熱処理雰囲気、キャリア、パージなどに使う高純度ガス・気化材料です。" },
            { question: "バルクガスと特殊ガスの違いは？", answer: "バルクガスは窒素など大量・連続使用するガスを指すことが多く、特殊ガスは成膜・エッチング・注入など特定反応へ使う高純度・混合ガスを含みます。区分は企業や資料で異なるため用途も確認します。" },
            { question: "主な半導体ガスメーカーは？", answer: "この記事では日本酸素、Air Liquide、Linde、岩谷産業を代表例として紹介しています。地域・製品・供給方式別の例であり、網羅的な市場順位ではありません。" },
            { question: "大陽日酸と日本酸素は別会社ですか？", answer: "大陽日酸株式会社は2026年4月1日に日本酸素株式会社へ社名変更しました。本記事では現社名を使い、検索しやすいよう旧社名を併記しています。" },
            { question: "純度が高い企業ほど優れていますか？", answer: "純度の数字だけでは決まりません。工程が問題にする不純物、分析法、容器・配管、ロット変動、使用点での品質、供給安定性を同じ条件で確認します。" },
            { question: "ガス会社はボンベを販売するだけですか？", answer: "企業によってはガス製造・精製・充填に加え、オンサイト発生、貯槽、供給盤、配管、監視、分析、排気・除害、工場内運転まで提供します。" },
            { question: "半導体ガスを扱う仕事は危険ですか？", answer: "ガスごとに可燃性、毒性、腐食性、窒息性、高圧などの危険があります。そのため閉じ込め、検知、遮断、換気、除害、教育、手順、法規対応を重ねて管理します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜工程・純度・供給・安全をそろえて半導体ガスメーカーを見る",
      lead: "半導体ガスは、化学反応を作る材料であると同時に、工場を止めないインフラです。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "PROCESS", title: "工程と役割を決める", body: "成膜・加工・洗浄・注入・熱処理・パージの目的を確認する" },
            { label: "QUALITY", title: "不純物を分解する", body: "総純度だけでなく水分・酸素・粒子・金属などを用途別に見る" },
            { label: "SUPPLY", title: "装置までの経路を見る", body: "容器・バルク・オンサイト、精製、配管、監視、予備系を確認する" },
            { label: "SAFETY", title: "排気まで含める", body: "検知・遮断・換気・除害・教育・変更管理を一つの系として見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造工程", href: "/guides/semiconductor-manufacturing-process", description: "ガスが使われる前工程の全体像を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "CVD・ALD装置と原料供給のつながりを見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "反応性ガスとプラズマ装置のつながりを見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置・設備企業を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "材料・装置・デバイス企業の位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式情報から一つのガス用途を選び、工程、材料群、品質、供給方式、設備、安全・環境、拠点、認定・変更管理の8項目で整理してください。同じ用途へそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "日本酸素・Air Liquide・Linde・岩谷産業から1社を選び、公式情報を工程・ガス群・純度・供給方式・安全設備・供給拠点の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-deposition-process",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-cleaning-process",
    "semiconductor-ion-implantation-process",
    "semiconductor-oxidation-thermal-process",
    "semiconductor-manufacturing-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-inspection-metrology",
    "production-engineering-to-semiconductor-process-engineer",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
