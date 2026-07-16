import type { GuideArticle } from "@/content/guides/types";

export const semiconductorMassFlowControllerManufacturersGuide: GuideArticle = {
  slug: "semiconductor-mass-flow-controller-manufacturers",
  title: "半導体用マスフローコントローラーメーカーとは？HORIBA STEC・フジキン・Brooks・MKSを図解",
  description:
    "半導体用MFCのセンサ・バイパス・制御弁・フィードバック、熱式と圧力式、応答・精度・実ガス・高純度流路、HORIBA STEC・フジキン・Brooks・MKSの製品領域と比較軸を図解します。",
  targetQuery: "半導体 マスフローコントローラー メーカー",
  searchIntent:
    "半導体製造用マスフローコントローラーの仕組み、熱式・圧力式の違い、精度・応答・実ガス・高純度・通信の見方、主要メーカーと比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "HORIBA STEC、フジキン、Brooks Instrument、MKSの公式製品・技術情報をもとに、設定値を受け取る、流量を測る、制御弁を動かす、誤差を閉ループで補正する、診断・装置通信へ返す流れへ整理しました。熱式と圧力式を一律に優劣付けせず、ガス、流量範囲、供給・下流圧力、温度、応答波形、純度、校正条件をそろえます。",
  showCareerCtas: false,
  experienceBasis: [
    "半導体ガス、成膜、エッチングの記事を公開したうえで、ガス供給系の中心部品であるMFCを独立記事にする必要があると判断",
    "HORIBA STECでセンサ・バイパス・制御弁・閉ループ制御の基本原理と半導体向け製品群を確認",
    "フジキンで圧力制御式流量コントローラ、Brooksで熱式・圧力式と診断、MKSで半導体を含むMFC製品群を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Mass Flow Controller & Module - Semiconductor Products",
      url: "https://www.horiba.com/fra/semiconductor/products/mass-flow-controller-and-module/",
      publisher: "HORIBA, Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Multi Range/Gas Digital Mass Flow Controller SEC-Z500X",
      url: "https://www.horiba.com/usa/semiconductor/products/detail/action/show/Product/sec-z500x-series-729/",
      publisher: "HORIBA, Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ultra-High Purity Integrated Gas System and FCS",
      url: "https://www.fujikin.co.jp/ja/support/mono-japan/igs.html",
      publisher: "Fujikin Incorporated",
      accessedAt: "2026-07-16",
    },
    {
      title: "Precision Flow Control Solutions for Semiconductor Manufacturing",
      url: "https://www.brooksinstrument.com/markets-semiconductor-manufacturing",
      publisher: "Brooks Instrument",
      accessedAt: "2026-07-16",
    },
    {
      title: "High & Ultra-High Purity Gas Mass Flow Controllers & Meters",
      url: "https://experience.brooksinstrument.com/en/products/semiconductor-products/high-purity-gas-mfc",
      publisher: "Brooks Instrument",
      accessedAt: "2026-07-16",
    },
    {
      title: "MKS Mass Flow Controllers",
      url: "https://www.mks.com/universities/c/mass-flow-controllers",
      publisher: "MKS Inc.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "MFCを調べると、質量流量、標準状態、フルスケール、セットポイント、熱式、圧力式、マルチガス、実ガス校正などが並び、精度の数字だけで選べるように見えませんか。",
    conclusion:
      "MFCは、装置から受けた設定値に合わせてガスの質量流量を測り、制御弁を自動調整する閉ループ部品です。半導体用途では精度だけでなく、低流量から大流量までの応答、供給・下流圧力変動、腐食性ガス、高純度流路、ゼロ・ドリフト、実ガス、診断、通信、装置間整合を見ます。",
    learnings:
      "MFCの構造、質量流量と体積流量、熱式・圧力式、応答波形、校正・実ガス、高純度・腐食対策、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私はMFCを、『流量を表示する計器』ではなく、レシピの設定値と実際のガス流量の差を自動で埋め続ける小さな制御システムとして見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜設定値からガス流量を閉ループ制御する",
      description: "代表的なMFC制御を単純化しています。センサ・演算・弁の構成は方式と製品で異なります。",
      stages: [
        { label: "01 / SETPOINT", title: "設定値を受け取る", body: "装置レシピから目標流量、ガス、レンジ、開閉タイミングを受け取る" },
        { label: "02 / SENSE", title: "流量に関係する量を測る", body: "熱移動、圧力、差圧、温度などから流量を推定・算出する" },
        { label: "03 / COMPARE", title: "設定値と比較する", body: "測定流量と目標流量の差を演算し、過不足と変化方向を判断する" },
        { label: "04 / VALVE", title: "制御弁を動かす", body: "ピエゾ・ソレノイドなどの弁開度を調整し、流路抵抗を変える" },
        { label: "05 / SETTLE", title: "目標へ収束させる", body: "オーバーシュート・アンダーシュートを抑え、所定時間で安定させる" },
        { label: "06 / DIAGNOSE", title: "状態を装置へ返す", body: "実流量、弁開度、圧力、ゼロ、警報、診断情報を制御系へ送る" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "構成要素",
      rightLabel: "主な役割",
      rows: [
        { left: "流量センサ", right: "熱移動や圧力情報などから、流れるガス量に対応する信号を作る" },
        { left: "バイパス・流路", right: "センサ側と主流路側へ決めた比率でガスを分け、圧力損失と応答を整える" },
        { left: "制御弁", right: "演算結果に応じて開度を変え、実際に流れるガス量を調整する" },
        { left: "制御回路・ソフト", right: "設定値との誤差、温度・圧力補正、ガス特性、応答、診断を処理する" },
        { left: "高純度接ガス部", right: "金属シール、表面処理、デッドボリューム低減などで粒子・水分・汚染を抑える" },
        { left: "通信・診断", right: "流量、弁、圧力、異常、校正情報を装置制御・保全へ接続する" },
      ],
    },
  ],
  sections: [
    {
      id: "role",
      heading: "MFCは、ガス供給設備とプロセスチャンバーの間で流量を決める",
      lead: "圧力を作る機器、流量を制御する機器、遮断する機器を分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "機器",
          rightLabel: "主な役割",
          rows: [
            { left: "圧力調整器", right: "ガス源の高い圧力を下げ、下流へ安定した供給圧力を作る" },
            { left: "遮断・切替弁", right: "ガスラインを安全に開閉し、パージ・プロセス・排気経路を切り替える" },
            { left: "MFC・流量コントローラ", right: "設定値に合わせて流量を測定し、内蔵弁で自動制御する" },
            { left: "圧力コントローラ", right: "チャンバーやラインの圧力を測り、スロットル弁などを動かして制御する" },
            { left: "気化・液体供給", right: "液体原料の流量を測り、加熱・気化して凝縮させずにチャンバーへ送る" },
          ],
        },
      ],
      paragraphs: [
        "HORIBAはMFCを、電気信号で受けた設定流量に合わせ、センサ・バイパス・制御弁・回路で自動制御する機器として説明しています。",
        "MFCが正しくても、上流圧力、バルブ切替、配管容積、下流圧力が変わればチャンバーへ届く過渡波形は変わります。ガスボックス全体で評価します。",
      ],
    },
    {
      id: "methods",
      heading: "熱式と圧力式では、流量を知るために測る量が異なる",
      lead: "方式名だけでなく、成立条件と補正方法を確認します。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "THERMAL", title: "熱式MFC", body: "センサ管などへ熱を与え、上流・下流の温度差や熱移動から質量流量を推定します。ガスの熱物性と校正・補正が関係します。" },
            { label: "PRESSURE", title: "圧力式流量制御", body: "圧力センサ、流路抵抗、温度、臨界流条件などを使って流量を算出・制御します。上流・下流圧力の成立条件を確認します。" },
            { label: "DIFFERENTIAL", title: "差圧式", body: "既知の流路要素の前後差圧から流量を求めます。圧力・温度・ガス特性と流れの領域をモデルへ反映します。" },
            { label: "LIQUID/VAPOR", title: "液体・気化システム", body: "液体流量を測定・制御し、気化器で蒸気へ変えます。気化能力、温度、圧力、凝縮防止までを一体で見ます。" },
          ],
        },
        {
          type: "note",
          title: "質量流量の表示単位は、標準状態の定義を確認する",
          body: "sccm・slmは標準状態へ換算した体積で質量流量を表します。標準温度・圧力の定義が異なると同じ表示値でも換算が変わるため、装置・校正・仕様でそろえます。",
        },
      ],
      paragraphs: [
        "フジキンは圧力制御式FCSの原理を公開し、従来型MFCとの制御方法の違い、供給圧力変動への対応、自己診断などを説明しています。",
        "Brooksは半導体向けに熱式と圧力式の製品を展開し、HORIBAも圧力変動の影響を抑える製品群を示しています。用途と成立条件で選びます。",
      ],
    },
    {
      id: "performance",
      heading: "精度だけでなく、流量を切り替えた瞬間の波形を見る",
      lead: "半導体レシピでは短いステップを繰り返す工程があります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "性能項目",
          rightLabel: "主な意味と注意点",
          rows: [
            { left: "Accuracy", right: "指示値に対して実流量がどれだけ近いか。%SPと%FS、校正範囲、ガス、圧力、温度を確認する" },
            { left: "Repeatability", right: "同じ設定・条件を繰り返したとき、流量がどれだけ同じ結果へ戻るか" },
            { left: "Zero stability", right: "流量ゼロ時のセンサ出力が時間・温度・設置でどれだけ変化するか" },
            { left: "Response・settling", right: "設定変更から許容帯へ入る時間。遅れ、立上り、オーバーシュート、アンダーシュートを見る" },
            { left: "Rangeability", right: "一台で制御できる最小から最大までの有効範囲。低流量側の精度・応答も確認する" },
            { left: "Pressure sensitivity", right: "上流・下流の圧力変化が流量・過渡波形へ与える影響" },
            { left: "Gas accuracy", right: "代替ガス換算ではなく実ガスでどこまで確認・補正しているか" },
            { left: "Tool matching", right: "複数MFC・複数装置で同じ設定が同じ流量・波形になるか" },
          ],
        },
      ],
      paragraphs: [
        "フジキンは流量レンジ切替時のオーバーシュート・アンダーシュートがプラズマ安定性と品質ばらつきに関わると説明しています。",
        "静的な一点精度が同じでも、バルブ切替、圧力変動、短いガスパルス、低設定値では差が出ます。実レシピ波形で評価します。",
      ],
    },
    {
      id: "quality",
      heading: "高純度・腐食性ガスでは、接ガス部と診断が重要になる",
      lead: "流量性能と、汚染・安全・保守を同時に管理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "設計・運用項目",
          rightLabel: "主な確認事項",
          rows: [
            { left: "接ガス材料", right: "ガスとの反応、腐食、吸着、透過、触媒作用を考慮し、金属・表面処理・シールを選ぶ" },
            { left: "デッドボリューム", right: "置換しにくい滞留部を減らし、パージ時間、残留ガス、交差汚染を抑える" },
            { left: "粒子・水分・リーク", right: "組立・洗浄・溶接・シール・ヘリウムリークなどの品質保証方法を確認する" },
            { left: "弁リーク・固着", right: "ゼロ流量、遮断、弁開度、圧力応答から内部リーク・異物・腐食の兆候を見る" },
            { left: "自己診断", right: "センサ、ゼロ、弁、圧力、応答、校正状態を装置上で確認できる範囲を整理する" },
            { left: "変更・校正管理", right: "ガス・レンジ変更、部品交換、ソフト更新、再校正後の装置間整合を確認する" },
          ],
        },
      ],
      paragraphs: [
        "Brooksは半導体向け製品で全金属流路、耐腐食センサ、診断、複数ガス・レンジ対応を公式に示しています。",
        "診断値は故障を自動確定するものではありません。供給圧力、温度、配管、バルブ、プロセス変化と組み合わせて原因を切り分けます。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体用MFC・流量制御の代表企業4社",
      lead: "センサ方式、ガス供給モジュール、診断・通信まで見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "HORIBA STEC｜日本", right: "半導体向けMFC、圧力非依存型モジュール、高温MFC、圧力制御、液体気化などを展開し、MFCの構造・原理も公開" },
            { left: "フジキン｜日本", right: "超高純度ガス供給システム、バルブ・継手と、圧力制御式FCSを展開。流量レンジ、圧力変動、診断、集積化を扱う" },
            { left: "Brooks Instrument｜米国", right: "半導体向け熱式・圧力式MFC、高純度・腐食性ガス、実ガス・マルチガス、診断、EtherCATなどを展開" },
            { left: "MKS｜米国", right: "MFC・流量計、圧力・真空計測、バルブ、ガス・蒸気供給、分析、RFなど半導体装置周辺の広い製品群を展開" },
          ],
        },
      ],
      paragraphs: [
        "MFC単品を供給する企業と、バルブ・圧力・ガスパネル・気化・真空まで統合する企業では提案範囲が異なります。",
        "市場順位や一律の精度順位は扱いません。ガス、流量レンジ、圧力、温度、応答、接ガス部、通信条件をそろえます。",
      ],
    },
    {
      id: "comparison",
      heading: "MFCメーカーは、8つの条件をそろえて比較する",
      lead: "実ガス・実レシピ・実配管で同じ流れを作れるかを見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. ガス・用途", right: "成膜・エッチング・注入・洗浄、腐食性・反応性・高温原料、混合・代替ガス" },
            { left: "2. 流量範囲", right: "最小・最大、レンジアビリティ、低流量側、ガス変更、将来レシピ" },
            { left: "3. 測定・制御方式", right: "熱式・圧力式・差圧式、成立条件、センサ、バイパス、弁、補正モデル" },
            { left: "4. 静特性", right: "精度、再現性、直線性、ゼロ、ドリフト、実ガス、校正トレーサビリティ" },
            { left: "5. 動特性", right: "遅れ、立上り、整定、オーバーシュート、圧力変動、短パルス、バルブ切替" },
            { left: "6. 純度・耐久", right: "接ガス材料、シール、表面、粒子、水分、リーク、腐食、温度、弁寿命" },
            { left: "7. 通信・診断", right: "アナログ、DeviceNet、EtherCATなど、データ項目、自己診断、時刻同期、ログ" },
            { left: "8. 量産支援", right: "装置間整合、ガスパネル統合、校正・交換、拠点、部品、長期供給、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "仕様比較では%FSと%SPを混ぜず、対象レンジ全体で誤差を換算します。標準状態と校正ガスの定義もそろえます。",
        "採用評価ではMFC単体ベンチに加え、実際の圧力調整器、バルブ、配管、チャンバー、排気系でレシピ波形を確認します。",
      ],
    },
    {
      id: "jobs",
      heading: "MFCメーカーの仕事は、センサ・制御・高純度流体をつなぐ",
      lead: "小さな部品の中に複数の専門領域があります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "SENSOR", title: "センサ設計", body: "熱、圧力、温度、流路、信号処理、ドリフト補正を設計します。" },
            { label: "VALVE", title: "バルブ・機械", body: "弁、アクチュエータ、シール、流路、圧力損失、耐久性を設計します。" },
            { label: "CONTROL", title: "制御・組込み", body: "閉ループ、応答、補正、診断、通信、ファームウェアを実装します。" },
            { label: "MATERIAL", title: "材料・高純度", body: "腐食、吸着、表面、洗浄、溶接、粒子、水分、リークを評価します。" },
            { label: "CALIBRATION", title: "校正・品質", body: "標準、実ガス、GR&R、装置間整合、変更管理、出荷検査を担当します。" },
            { label: "APPLICATION", title: "アプリ・顧客支援", body: "ガス、レシピ、配管、圧力に合う製品選定と波形改善を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "計測、制御、流体、バルブ、材料、組込み、品質、生産技術、半導体プロセスの経験を接続できます。",
        "求人では、MFC単体、ガス供給モジュール、校正、アプリケーション、フィールド支援のどこを担当するか確認します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体用MFCでよくある質問",
      lead: "用語と比較の基本を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "MFCとは何ですか？", answer: "Mass Flow Controllerの略で、ガスの質量流量を測定し、設定値に合うよう内蔵制御弁を自動調整する機器です。" },
            { question: "MFMとの違いは？", answer: "Mass Flow Meterは流量の測定が中心です。MFCは測定に加えて制御弁を持ち、設定値へ流量を合わせます。" },
            { question: "熱式と圧力式はどちらが優れますか？", answer: "一律には決められません。ガス、流量、供給・下流圧力、応答、校正、装置構成により適した方式が異なります。" },
            { question: "主なメーカーは？", answer: "この記事ではHORIBA STEC、フジキン、Brooks Instrument、MKSを代表例として紹介しています。" },
            { question: "精度が高ければ同じプロセスになりますか？", answer: "静的精度だけでは決まりません。応答波形、圧力変動、バルブ・配管、実ガス、装置間整合も工程再現性へ影響します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜MFCは、流量計・弁・制御器を一体化した部品",
      lead: "設定値へ正確に、素早く、清浄に収束させることが役割です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "LOOP", title: "閉ループで見る", body: "測る、比較する、弁を動かす、収束する流れを理解する" },
            { label: "WAVEFORM", title: "波形で見る", body: "精度に加え、遅れ、整定、行き過ぎ、圧力影響を見る" },
            { label: "PURITY", title: "接ガス部を見る", body: "材料、表面、粒子、水分、リーク、腐食を確認する" },
            { label: "SYSTEM", title: "ガス箱で見る", body: "圧力、弁、配管、気化、通信、診断と接続する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "MFCが制御するプロセスガスと供給企業を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "ALD・CVD・PVDでの流量制御の位置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "プラズマ工程でのガス切替と圧力制御を見る" },
            { label: "真空ポンプメーカー", href: "/guides/semiconductor-vacuum-pump-manufacturers", description: "チャンバー下流の排気・圧力系を見る" },
            { label: "排ガス除害装置メーカー", href: "/guides/semiconductor-exhaust-gas-abatement-manufacturers", description: "使用後のプロセスガスを処理する装置を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "MFCが組み込まれる工程装置の全体地図を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、ガス・用途、流量範囲、方式、静特性、動特性、純度・耐久、通信・診断、量産支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "HORIBA STEC・フジキン・Brooks・MKSから1社を選び、公式製品をセンサ方式・流量範囲・制御弁・応答・接ガス部・診断通信の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-gas-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-exhaust-gas-abatement-manufacturers",
    "semiconductor-ion-implantation-equipment-manufacturers",
    "semiconductor-thermal-processing-equipment-manufacturers",
    "semiconductor-equipment-manufacturers",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
