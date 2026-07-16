import type { GuideArticle } from "@/content/guides/types";

export const semiconductorChillerTemperatureControlManufacturersGuide: GuideArticle = {
  slug: "semiconductor-chiller-temperature-control-manufacturers",
  title: "半導体用チラー・温度調節装置メーカーとは？伸和コントロールズ・SMC・ATS・オリオン機械を図解",
  description:
    "半導体製造装置のチラーについて、冷媒回路、熱交換器、循環ポンプ、温度制御、流体・結露・水質、主要メーカー、選び方を初心者向けに図解します。",
  targetQuery: "半導体 チラー メーカー",
  searchIntent:
    "エッチング・成膜・露光・検査などの半導体製造装置で使うチラーの役割、冷却・加熱の仕組み、循環流体、代表メーカー、比較条件、保守と関連職種を知りたい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "伸和コントロールズ、SMC、Advanced Thermal Sciences、オリオン機械の公式製品・技術情報をもとに、被温調部、循環流体、ポンプ、熱交換器、冷凍・加熱部、制御、工場ユーティリティの熱移動へ整理しました。最低温度や冷却能力を単純比較せず、熱負荷、設定温度、流体、流量・圧力、安定性、結露、水質、冷却方式、設備条件、保守・環境規制をそろえて比較します。",
  showCareerCtas: false,
  experienceBasis: [
    "装置コンポーネント記事を、RF・圧力・ガスに続いて温度と熱輸送を担うチラーへ拡張",
    "チラーを冷水を作る箱としてではなく、チャック・チャンバー・光源・ポンプなどから熱を回収し工場側へ捨てる循環系として整理",
    "運営者固有の温度条件、冷媒・流体、配管、異常履歴は扱わず、公式公開情報で確認できる一般原理と比較観点に限定",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Chillers",
      url: "https://www.shinwa-cont.com/en/product/chiller/index.html",
      publisher: "Shinwa Controls Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Applications",
      url: "https://www.shinwa-cont.com/english/field/semiconductor.html",
      publisher: "Shinwa Controls Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Thermo-Chiller Product Features",
      url: "https://www.smcworld.com/products/pickup/en-hk/temperature_controller/chiller.html",
      publisher: "SMC Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Thermo-Chillers for the Semiconductor Industry",
      url: "https://www.smcworld.com/webcatalog/en-jp/temperature-control-equipment/thermo-chillers-high-performance-type-high-performance-inverter-type/INR-495-E",
      publisher: "SMC Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Temperature Control Systems",
      url: "https://atschiller.com/product/",
      publisher: "Advanced Thermal Sciences Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "ESH/NX Series Heat Exchanger",
      url: "https://atschiller.com/products/esh-sx-nx-series/",
      publisher: "Advanced Thermal Sciences Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Chiller / Unit Cooler",
      url: "https://www.orionkikai.co.jp/english/product/chiller/",
      publisher: "ORION Machinery Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "What is a Chiller?",
      url: "https://www.orionkikai.co.jp/english/technology/chiller/knowledge/",
      publisher: "ORION Machinery Co., Ltd.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "チラーは装置を冷やす補機と思われがちですが、半導体装置では低温・高温、複数チャンネル、精密安定、結露防止、純水・不凍液・特殊流体など条件が大きく異なります。冷却能力と設定温度だけを見ればよいのか迷いませんか。",
    conclusion:
      "チラーは循環流体で装置から熱を受け取り、冷媒回路・工場冷却水・ペルチェなどを通じて別の場所へ熱を運び、必要に応じて加熱も行います。選定では定格能力より、実際の温度での熱負荷、流量・圧力、温度安定性、流体適合、配管、結露・水質、設備消費、保守を一つの熱回路として確認します。",
    learnings:
      "チラーの熱移動、冷凍式・水冷熱交換式・ペルチェ式、空冷・水冷、循環流体、温度安定と冷却能力の違い、主要メーカー4社、比較軸、異常切分け、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私はチラーを、冷たい液を作る装置ではなく、プロセス部品で発生・流入した熱を循環流体に乗せ、制御しながら工場側へ運ぶ熱輸送システムとして見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜装置から熱を回収し、設定温度へ戻すまで",
      description:
        "冷凍式チラーを中心に単純化した流れです。水冷熱交換式やペルチェ式では構成が異なります。",
      stages: [
        { label: "01 / LOAD", title: "装置で熱が発生する", body: "電極、チャック、チャンバー、RF、光源、ポンプ、モータなどへ熱が入る" },
        { label: "02 / ABSORB", title: "循環流体が熱を受ける", body: "流路・熱交換面を通り、被温調部から流体へ熱が移動する" },
        { label: "03 / RETURN", title: "温まった流体が戻る", body: "配管、センサ、バルブを通りチラーの熱交換器へ戻る" },
        { label: "04 / EXCHANGE", title: "熱交換器で熱を抜く", body: "冷媒、工場冷却水、ペルチェ素子などへ熱を移す" },
        { label: "05 / CONTROL", title: "冷却・加熱量を調整する", body: "温度センサと制御器が圧縮機、弁、ヒーター、ポンプなどを動かす" },
        { label: "06 / SUPPLY", title: "設定温度で再供給する", body: "必要な流量・圧力で装置へ戻し、熱負荷変動へ追従する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "チラーの構成要素",
      rightLabel: "主な役割",
      rows: [
        { left: "循環ポンプ", right: "流体を必要な流量・圧力で装置とチラーの間へ送る" },
        { left: "タンク・気液分離", right: "流体を保持し、補給、膨張、気泡除去、液面監視を行う" },
        { left: "熱交換器", right: "循環流体と冷媒・工場冷却水の間で熱を移す" },
        { left: "冷凍回路", right: "圧縮・凝縮・膨張・蒸発を使い、低い温度側から高い温度側へ熱を運ぶ" },
        { left: "ヒーター・ホットガス", right: "低負荷時や高温設定で加熱し、温度を両方向から調整する" },
        { left: "センサ・制御", right: "供給・戻り温度、流量、圧力、液面、導電率、漏れ、異常を監視・制御する" },
        { left: "空冷・工場冷却水", right: "チラーが集めた熱を最終的に周囲空気または施設水へ放出する" },
      ],
    },
  ],
  sections: [
    {
      id: "methods",
      heading: "温調方式は、冷凍式・水冷熱交換式・ペルチェ式を分ける",
      lead: "温度域、熱負荷、設備条件、応答に応じて選びます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "方式",
          rightLabel: "仕組みと確認点",
          rows: [
            { left: "蒸気圧縮冷凍式", right: "圧縮機と冷媒回路で低温を作る。温度域、負荷変動、冷媒、凝縮方式、圧縮機制御を見る" },
            { left: "工場冷却水との熱交換式", right: "施設水へ直接熱を渡す。設定温度が施設水より十分高い用途で省電力化しやすい" },
            { left: "ペルチェ式", right: "電流方向で加熱・冷却する。小型・精密・高速応答用途と放熱側条件を見る" },
            { left: "空冷凝縮", right: "周囲空気へ熱を放出する。室温、排熱、騒音、設置間隔、フィルタ清掃を見る" },
            { left: "水冷凝縮", right: "工場冷却水へ熱を放出する。供給温度・流量・水質・圧力・設備消費を見る" },
            { left: "複数チャンネル", right: "一台で異なる温度・流量系を制御する。熱干渉、独立性、故障影響、配管を確認する" },
          ],
        },
      ],
      paragraphs: [
        "SMCは冷凍式、水冷熱交換式、ペルチェ式などの温度調節機器を公式に整理しています。オリオン機械もタンク内蔵・非内蔵、空冷・水冷、精密温調などの構成を示しています。",
        "半導体向け低温チラーでは、設定温度で使える冷却能力、戻り温度、流体粘度、ポンプ特性、霜・結露、冷媒規制を同時に確認します。",
      ],
    },
    {
      id: "temperature-loop",
      heading: "温度安定性は、チラー単体ではなく熱負荷・流量・配管で決まる",
      lead: "表示温度とウェーハ・電極・チャンバー表面温度は同じとは限りません。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜熱負荷変動へ追従する制御",
          description:
            "測定位置と制御構成は装置により異なります。",
          stages: [
            { label: "01", title: "レシピが変化する", body: "RF電力、ヒーター、ガス、圧力、処理時間が変わる" },
            { label: "02", title: "熱負荷が変わる", body: "被温調部から循環流体へ移る熱量が増減する" },
            { label: "03", title: "戻り温度が変わる", body: "流量、熱容量、配管遅れを伴ってチラー入口へ変化が届く" },
            { label: "04", title: "センサが検出する", body: "供給・戻り温度や装置側温度を読み、設定値との差を求める" },
            { label: "05", title: "能力を調整する", body: "圧縮機、膨張弁、バイパス弁、ヒーター、ポンプを制御する" },
            { label: "06", title: "温度を収束させる", body: "遅れとオーバーシュートを抑えながら次の負荷変動へ備える" },
          ],
        },
        {
          type: "note",
          title: "冷却能力と温度安定性は別の指標",
          body: "大きな熱を除去できても細かな温度変動を抑えられるとは限らず、逆も同様です。対象温度、流量、周囲・施設水、負荷波形をそろえて評価します。",
        },
      ],
      paragraphs: [
        "配管が長い、流量が少ない、流体の比熱・粘度が変わる、熱交換面が汚れると、温度応答と必要ポンプ圧力が変わります。",
        "複数ゾーンのチャックやチャンバー壁では、チラー側の供給温度だけでなく、流路分配、接触熱抵抗、センサ位置、制御ゾーン間干渉を確認します。",
      ],
    },
    {
      id: "fluid",
      heading: "循環流体は、温度域・材料・電気・安全条件に合わせる",
      lead: "水だけでなく、不凍液や特殊熱媒体が使われます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "WATER", title: "水・純水", body: "熱を運びやすい一方、腐食、水質、微生物、導電率、凍結を管理する。" },
            { label: "GLYCOL", title: "グリコール水溶液", body: "低温での凍結を抑える。濃度で粘度・熱性能・ポンプ負荷が変わる。" },
            { label: "SPECIAL", title: "特殊熱媒体", body: "低温・高温・絶縁・材料適合へ使う。環境性、価格、漏れ、回収を確認する。" },
            { label: "FLOW", title: "流量・圧力", body: "流路抵抗、ポンプ曲線、バイパス、フィルタ、閉塞、キャビテーションを見る。" },
            { label: "QUALITY", title: "水質・清浄度", body: "導電率、粒子、腐食生成物、イオン、気泡、補給水、交換周期を管理する。" },
            { label: "CONDENSE", title: "結露・断熱", body: "露点より低い配管・部品で水滴が生じないよう、断熱、乾燥空気、周囲条件を管理する。" },
          ],
        },
      ],
      paragraphs: [
        "流体を変更すると、冷却能力だけでなく、ポンプ流量、シール・ホース適合、センサ校正、漏れ検知、廃液処理が変わります。",
        "装置メーカー指定外の流体や添加剤へ変更せず、チラーと被温調装置の双方の仕様・保守手順を確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体用チラー・温度調節装置の代表メーカー",
      lead: "公式情報で確認できる製品領域を整理します。市場順位ではありません。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "SHINWA", title: "伸和コントロールズ", body: "半導体製造向け精密チラー、超低温・複数チャンネル製品、温湿度・プロセス環境制御を展開。カスタム・OEMとグローバルサービスも示しています。" },
            { label: "SMC", title: "SMC", body: "冷凍式、水冷式、ペルチェ式など幅広いサーモチラーを展開し、半導体産業向け温調ライン、流体・導電率・通信オプションを扱います。" },
            { label: "ATS", title: "Advanced Thermal Sciences", body: "半導体・マイクロエレクトロニクス向け温度制御システムを展開。低温、単一・複数チャンネル、熱交換式、標準・カスタム製品を扱います。" },
            { label: "ORION", title: "オリオン機械", body: "タンク内蔵・非内蔵、空冷・水冷、精密・一般産業用チラーを展開。半導体製造装置を含む幅広い温調用途を公式に示しています。" },
          ],
        },
      ],
      paragraphs: [
        "半導体装置専用設計を中心とする企業と、標準産業用チラーを広く展開する企業では、カスタム範囲、温度域、通信、保守体制が異なります。",
        "企業研究では、冷凍回路、熱交換、ポンプ・流体、制御、筐体、環境対応、現地サービスのどこを自社で設計・製造しているかを確認します。",
      ],
    },
    {
      id: "comparison",
      heading: "メーカー・製品を比較する8つの軸",
      lead: "最低温度や定格能力だけで比較しません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "確認する内容",
          rows: [
            { left: "1. 被温調部・工程", right: "チャック、電極、チャンバー壁、RF、ポンプ、光源、薬液、露光・検査、装置周囲" },
            { left: "2. 温度域・熱負荷", right: "設定温度、供給・戻り、定常・ピーク負荷、立上げ、レシピ波形、加熱能力" },
            { left: "3. 流体・流路", right: "水、純水、グリコール、特殊媒体、流量、圧力、粘度、接液材料、配管抵抗" },
            { left: "4. 安定性・応答", right: "測定位置、安定性、整定、オーバーシュート、複数ゾーン、センサ・制御周期" },
            { left: "5. 冷却・放熱方式", right: "冷凍、水冷熱交換、ペルチェ、空冷・水冷凝縮、施設水・周囲温度条件" },
            { left: "6. 装置統合", right: "寸法、チャンネル、通信、アラーム、流量・圧力、導電率、遠隔監視、インターロック" },
            { left: "7. 環境・設備", right: "消費電力、施設水、排熱、騒音、冷媒GWP、漏えい管理、結露、設置場所" },
            { left: "8. 保守・供給", right: "フィルタ、流体交換、ポンプ・圧縮機、熱交換器洗浄、予備品、修理、地域サービス" },
          ],
        },
      ],
      paragraphs: [
        "冷却能力は温度条件で変わります。定格一点ではなく、実際の設定温度、戻り温度、周囲・施設水、流体、周波数、負荷率をそろえます。",
        "装置の停止影響を見るときは、チラー単体の冗長性だけでなく、複数チャンネル共用、バイパス、予備機接続、流体漏れ、復旧・再安定化時間を確認します。",
      ],
    },
    {
      id: "troubleshooting",
      heading: "温度異常は、冷凍回路だけでなく熱負荷・流量・水質から切り分ける",
      lead: "温度アラームは熱回路のどこかが変化した結果です。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "状態",
          rightLabel: "確認する範囲",
          rows: [
            { left: "設定温度へ下がらない", right: "熱負荷、冷却能力条件、周囲・施設水、冷媒、熱交換器、流量、配管断熱" },
            { left: "温度が周期的に揺れる", right: "制御設定、圧縮機・弁の最小能力、ヒーター、流量、センサ位置、負荷周期" },
            { left: "流量・圧力が低い", right: "液量、気泡、フィルタ、配管閉塞、バルブ、粘度、ポンプ、漏れ、バイパス" },
            { left: "結露・霜が発生する", right: "露点、断熱、乾燥空気、配管接続、扉開放、周囲温湿度、設定温度" },
            { left: "流体が変色・導電率異常", right: "腐食、材料適合、補給水、微生物、粒子、イオン交換、交換周期、混入" },
            { left: "装置間で温度差がある", right: "配管長、流量分配、センサ校正、接触熱抵抗、流路、熱負荷、制御設定" },
          ],
        },
      ],
      paragraphs: [
        "供給・戻り温度、流量、圧力、負荷信号、周囲・施設水、圧縮機・弁・ヒーター出力を同じ時刻で記録すると切り分けやすくなります。",
        "冷媒回路、加圧流体、電気を扱う作業は、メーカーと事業所の安全手順、冷媒・廃液規則に従います。",
      ],
    },
    {
      id: "jobs",
      heading: "チラー・温度調節装置メーカーの仕事",
      lead: "熱、冷凍、流体、制御、装置サービスが交わる領域です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "THERMAL", title: "熱・冷凍設計", body: "熱負荷、冷媒回路、圧縮機、熱交換器、ヒーター、断熱を設計します。" },
            { label: "FLUID", title: "流体・配管設計", body: "ポンプ、タンク、配管、バルブ、フィルタ、シール、流体適合を設計します。" },
            { label: "CONTROL", title: "電装・制御", body: "温度、流量、圧力、インバータ、PID、通信、診断、安全制御を実装します。" },
            { label: "CUSTOM", title: "装置適用設計", body: "熱負荷・温度・流体・寸法・設備条件を装置メーカーと合わせます。" },
            { label: "PRODUCTION", title: "生産・品質", body: "冷媒封入、ろう付け、リーク、清浄度、性能試験、法規、変更管理を担います。" },
            { label: "SERVICE", title: "フィールドサービス", body: "据付、流体充填、点検、冷媒・ポンプ修理、ログ解析、予防保全を行います。" },
          ],
        },
      ],
      paragraphs: [
        "冷凍空調、熱設計、機械、配管、ポンプ、電気制御、設備保全、フィールドサービスの経験を生かしやすい分野です。",
        "求人では、標準品か半導体向けカスタムか、低温・多チャンネル・施設水・冷媒のどこを担当し、顧客現場へどの程度入るかを確認します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体用チラーでよくある質問",
      lead: "基本用語を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "チラーは冷却だけをしますか？", answer: "冷却に加えて、ヒーターや冷凍回路の排熱を使って加熱し、設定温度を維持する製品もあります。" },
            { question: "空冷式と水冷式の違いは？", answer: "空冷式は周囲空気へ、水冷式は工場冷却水へ熱を捨てます。設置、排熱、騒音、施設水、効率、保守条件が異なります。" },
            { question: "温度安定性が高ければ冷却能力も大きいですか？", answer: "別の性能です。熱を除去できる量と、設定温度の変動を細かく抑える能力を分けて確認します。" },
            { question: "なぜ結露対策が必要ですか？", answer: "配管や装置表面が周囲空気の露点より低くなると水滴が生じ、電装・腐食・汚染へ影響するためです。" },
            { question: "主なメーカーは？", answer: "この記事では伸和コントロールズ、SMC、Advanced Thermal Sciences、オリオン機械を代表例として紹介しています。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜チラーを、装置と工場をつなぐ熱回路として見る",
      lead: "熱負荷、循環流体、温調、放熱、保守をつなげて選びます。",
      blocks: [
        {
          type: "links",
          items: [
            { label: "半導体製造装置の部品・サブファブ", href: "/guides/semiconductor-equipment-components-subfab", description: "温調を電力・ガス・真空と同じ装置断面へ置く" },
            { label: "静電チャック・セラミックヒーターメーカー", href: "/guides/semiconductor-electrostatic-chuck-ceramic-heater-manufacturers", description: "チラーが温調するウェーハ保持部品を見る" },
            { label: "RF電源・マッチングユニットメーカー", href: "/guides/semiconductor-rf-power-matching-manufacturers", description: "電極・チャンバーへ入るRF電力と発熱を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "チャンバー・ヒーター・温調の統合を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "電極・チャック・チャンバー冷却を見る" },
            { label: "設備エンジニアへのルート", href: "/guides/equipment-engineer-route", description: "熱源・冷却水・保全経験と半導体職種の接続を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、被温調部、温度域・熱負荷、流体・流路、安定性・応答、冷却方式、装置統合、環境・設備、保守支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "伸和コントロールズ、SMC、ATS、オリオン機械から1社を選び、公式製品を温度域・熱負荷・流体・流量圧力・冷却方式・保守の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-equipment-components-subfab",
    "semiconductor-electrostatic-chuck-ceramic-heater-manufacturers",
    "semiconductor-rf-power-matching-manufacturers",
    "semiconductor-vacuum-gauge-pressure-control-valve-manufacturers",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-thermal-processing-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
