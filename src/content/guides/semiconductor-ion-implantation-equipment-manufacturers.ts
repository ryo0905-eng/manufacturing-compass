import type { GuideArticle } from "@/content/guides/types";

export const semiconductorIonImplantationEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-ion-implantation-equipment-manufacturers",
  title: "半導体のイオン注入装置メーカーとは？Applied Materials・Axcelisと国内企業を初心者向けに図解",
  description:
    "半導体のイオン注入装置メーカーは、目的のイオンを選別・加速し、ウェーハへ決めた量・深さ・角度で導入する量産装置を開発します。装置構成、高電流・中電流・高エネルギー、主要企業、比較方法、仕事内容を図解します。",
  targetQuery: "半導体 イオン注入装置 メーカー",
  searchIntent:
    "イオン注入装置の構成、高電流・中電流・高エネルギー装置の違い、Applied Materials・Axcelis・住友重機械・日新イオン機器など主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Applied Materials、Axcelis Technologies、住友重機械工業・住友重機械マテリアルソリューションズ、日新イオン機器の公式製品・技術情報をもとに、装置構成、電流・エネルギー区分、対象用途を整理しました。市場シェアや企業の優劣ではなく、注入目的をそろえてメーカーを比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のイオン注入技術記事でドーピング、注入量・エネルギー・角度、活性化の原理を整理したうえで、量産装置と企業ポートフォリオを独立して調べる記事が必要だと判断",
    "Applied MaterialsとAxcelisの公式情報で、高電流・中電流・高エネルギー、ビーム純度・角度・線量制御、SiC向け高温注入などを確認",
    "住友重機械工業と日新イオン機器の公式情報で、国内企業の高電流・中電流・高エネルギー、パワーデバイス・水素注入などの製品領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "VIISta Trident",
      url: "https://www.appliedmaterials.com/us/en/product-library/viista-trident.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "VIISta 900 3D",
      url: "https://www.appliedmaterials.com/jp/ja/product-library/viista-900-3d.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Purion M Series Medium Current Ion Implanters",
      url: "https://www.axcelis.com/products/purion-m-mid-current-ion-implantation/",
      publisher: "Axcelis Technologies, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Purion XE Series High Energy Ion Implanters",
      url: "https://www.axcelis.com/products/purion-xe-series-high-energy-ion-implantation/",
      publisher: "Axcelis Technologies, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Purion Power Series+ Ion Implant Platform",
      url: "https://investor.axcelis.com/news-releases/news-release-details/axcelis-announces-launch-companys-new-purion-power-series-ion",
      publisher: "Axcelis Technologies, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ion Implanters",
      url: "https://www.shi.co.jp/english/products/machinery/ion/index.html",
      publisher: "Sumitomo Heavy Industries, Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ion Implanter for Semiconductor Manufacturing",
      url: "https://www.nissin-ion.co.jp/en/prd/ion-implanter/io/",
      publisher: "Nissin Ion Equipment Co., Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "Ion Implantation Services",
      url: "https://www.nissin-ion.co.jp/en/prd/ios/",
      publisher: "Nissin Ion Equipment Co., Ltd.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "Applied Materials、Axcelis、住友重機械、日新イオン機器はいずれもイオン注入装置を扱いますが、高電流・中電流・高エネルギー、SiC高温注入、水素注入など、どの製品を同じ条件で比べればよいか分かりにくくありませんか。",
    conclusion:
      "イオン注入装置は、イオン源、質量分析、加速・減速、ビーム輸送・純化、線量・角度計測、ウェーハ搬送・温度制御、真空・安全を統合します。企業比較では、注入種、線量・電流、エネルギー、角度、基板・温度、生産性をそろえます。",
    learnings:
      "イオン注入装置の役割と構成、高電流・中電流・高エネルギー、ビーム方式、SiC・水素注入、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "イオン注入装置メーカーを比べるときは、『どれだけ強いビームか』ではなく、『何のイオンを、どの量・深さ・角度・温度で、どの基板へ入れる装置か』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜イオンを作り、選び、加速し、ウェーハへ均一に注入する",
      description:
        "代表的なビームライン式イオン注入装置を単純化しています。各要素の順序と構成は装置方式・エネルギー領域で異なります。",
      stages: [
        { label: "01 / SOURCE", title: "イオンを作る", body: "原料ガス・固体原料などから、目的元素を含む荷電粒子を生成する" },
        { label: "02 / SELECT", title: "目的種を選ぶ", body: "質量分析磁石などで質量電荷比の違いを使い、不要なイオンを分離する" },
        { label: "03 / ACCEL", title: "加速・減速する", body: "電位差や線形加速器で、必要な深さへ届くエネルギーに調整する" },
        { label: "04 / CONTROL", title: "ビームを整える", body: "電流、形状、角度、エネルギー純度、金属・粒子汚染を測定・制御する" },
        { label: "05 / IMPLANT", title: "ウェーハへ注入", body: "ビームまたはウェーハを走査し、線量・角度・温度をそろえて全面処理する" },
        { label: "06 / RECORD", title: "記録して搬出", body: "注入量、ビーム、ウェーハ温度、装置状態を記録し、アニール工程へ渡す" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "イオン源", right: "原料をイオン化し、必要な注入種とビーム電流を安定して作る" },
        { left: "引き出し・質量分析", right: "イオンを取り出し、磁界などで目的の質量電荷比を選別する" },
        { left: "加速・減速系", right: "目的の深さ分布に対応する運動エネルギーへ調整する" },
        { left: "ビーム輸送・純化", right: "集束、走査、角度、不要なエネルギー成分、金属・粒子を制御する" },
        { left: "線量・角度計測", right: "ビーム電流を積算し、ウェーハへ入る線量、角度、面内分布を管理する" },
        { left: "エンドステーション", right: "ウェーハを搬送・保持・走査し、傾き、回転、温度、帯電を制御する" },
        { left: "真空・排気・安全", right: "ビーム経路の真空、高電圧、原料、放射線、インターロックを管理する" },
        { left: "制御・データ", right: "レシピ、ビーム調整、ウェーハ追跡、装置状態、消耗部品、保守履歴を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "イオン注入装置メーカーとは、ドーピングを量産設備へする企業",
      lead: "元素を入れるだけでなく、濃度・深さ・位置をウェーハ全面で再現します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SPECIES", title: "目的種を選ぶ", body: "複数のイオンや分子片から、必要な元素・電荷状態を選別します。" },
            { label: "PROFILE", title: "量と深さを作る", body: "線量、エネルギー、角度を制御し、狙った濃度分布へ近づけます。" },
            { label: "PRODUCTION", title: "量産で繰り返す", body: "面内・ウェーハ間・装置間の均一性、汚染、粒子、生産性を管理します。" },
          ],
        },
        {
          type: "note",
          title: "イオン注入装置とアニール装置は役割が違う",
          body: "イオン注入装置はドーパントなどを基板へ導入します。注入後のアニール装置は結晶ダメージを回復し、ドーパントを電気的に働きやすくします。工程は連続して考えますが、装置カテゴリーは分けます。",
        },
      ],
      paragraphs: [
        "イオン注入では、設定した線量とエネルギーをウェーハへ与えるだけでなく、不要なイオン・エネルギー成分・金属・粒子を抑え、角度と温度を管理する必要があります。",
        "装置メーカーはプラズマ、高電圧、電磁気、真空、精密搬送、熱、計測、制御、安全を統合し、デバイス電気特性へつながるビームプロセスを量産設備として提供します。",
      ],
    },
    {
      id: "current-energy",
      heading: "高電流・中電流・高エネルギーは、異なる装置分類の軸",
      lead: "電流は主にイオン数と処理速度、エネルギーは主に到達深さへ関わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置カテゴリー",
          rightLabel: "主な特徴と用途の見方",
          rows: [
            { left: "高電流", right: "大きなビーム電流で高い線量を効率よく入れる。浅い高濃度領域や材料改質などで使われる" },
            { left: "中電流", right: "広い線量・エネルギー範囲と、角度・純度・柔軟性を重視する。ウェル、チャネル、センサー、各種デバイスに対応" },
            { left: "高エネルギー", right: "加速器などで高いエネルギーを与え、深い領域を形成する。深いウェル、メモリ、イメージセンサー、パワーなどに使われる" },
            { left: "中エネルギー高電流", right: "高い線量と、従来より深い注入を一つの装置領域で両立する。パワー・アナログなどの用途がある" },
            { left: "高温・低温注入", right: "ウェーハ温度を制御して結晶ダメージ、活性化、材料改質へ影響を与える。電流・エネルギー区分とは別の軸" },
          ],
        },
        {
          type: "note",
          title: "高電流は高エネルギーという意味ではない",
          body: "ビーム電流は単位時間あたりに運ぶ電荷量、エネルギーは一つのイオンが持つ運動エネルギーです。高い線量を速く入れる要求と、深い位置へ入れる要求を分けて考えます。",
        },
      ],
      paragraphs: [
        "AxcelisはPurionシリーズを高電流、中エネルギー、中電流、高エネルギーへ分け、用途に合わせた共通プラットフォームとして案内しています。Applied MaterialsもVIISta製品群で高電流・中電流などの装置を公開しています。",
        "住友重機械工業は高電流・中電流・高エネルギーと、それらをまたぐオールインワン装置を示しています。分類の境界はメーカー製品ごとに異なるため、名称ではなく電流・エネルギー範囲と用途を確認します。",
      ],
    },
    {
      id: "ion-source",
      heading: "イオン源と質量分析が、注入種・純度・保守性を決める",
      lead: "安定したイオンを長時間作り、目的外の成分をウェーハへ到達させないことが重要です。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "FEED", title: "原料を供給", body: "ガス、蒸気、固体原料などを、イオン源が扱える形で安定供給します。" },
            { label: "PLASMA", title: "イオン化", body: "電子衝突などで原料をイオン化し、目的種を含むプラズマを作ります。" },
            { label: "EXTRACT", title: "ビームを引き出す", body: "電界でイオンを引き出し、ビーム電流と形状を整えます。" },
            { label: "ANALYZE", title: "質量を選ぶ", body: "磁界で軌道を曲げ、質量電荷比の異なるイオンを分離します。" },
            { label: "FILTER", title: "不要成分を除く", body: "エネルギー成分、異種、金属、粒子を追加の磁石・フィルターなどで抑えます。" },
            { label: "MAINTAIN", title: "源寿命を管理", body: "付着物、電極・フィラメントの消耗、源交換、原料切替後の立ち上げを管理します。" },
          ],
        },
      ],
      paragraphs: [
        "Applied MaterialsのVIISta 900 3Dは複数の磁石を使うビームラインで不要な注入種、金属、粒子などを抑える構成を説明しています。Axcelisも磁気・静電フィルターやRF線形加速器を製品領域に応じて使っています。",
        "イオン源は装置稼働率へ直結する消耗領域です。目的種を切り替えた後の残留、源寿命、交換・清掃時間、ビーム立ち上げ、原料供給、安全まで比較します。",
      ],
    },
    {
      id: "beam-endstation",
      heading: "ビーム輸送とエンドステーションが、角度・線量・温度をそろえる",
      lead: "良いイオン源だけでは、ウェーハ全面へ同じ注入を行えません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "制御機能",
          rightLabel: "量産上の役割",
          rows: [
            { left: "ビーム集束・走査", right: "ビーム形状と軌道を整え、ウェーハ全面へ均一に分配する" },
            { left: "リボン・スポットビーム", right: "幅広いビームと細いビームで走査方法が異なる。装置方式に合う均一性制御を行う" },
            { left: "線量計測", right: "ビーム電流を積算し、単位面積あたりの注入量と面内分布を管理する" },
            { left: "角度・回転", right: "傾きと回転角を測定・補正し、チャネリングと立体構造の影を制御する" },
            { left: "ウェーハ温度", right: "ビーム加熱、冷却、高温・低温注入に合わせ、保持と温度均一性を管理する" },
            { left: "帯電中和", right: "絶縁膜・レジスト上の帯電を抑え、デバイス損傷とビーム偏向を防ぐ" },
            { left: "搬送・保持", right: "ウェーハ径、反り、薄さ、材質に合わせ、粒子・傷・破損を抑えて処理する" },
          ],
        },
      ],
      paragraphs: [
        "Axcelisはビーム角を面内で測定・補正する制御と、一定焦点距離の走査を案内しています。Applied Materialsはビーム形状、線量、角度、面内均一性を統合して制御する製品機能を示しています。",
        "住友重機械工業と日新イオン機器も、線量、エネルギー、注入角度、平行ビーム、ウェーハ搬送などを製品特長として公開しています。装置比較ではビームラインとエンドステーションを一つの系として見ます。",
      ],
    },
    {
      id: "applications",
      heading: "ロジック・メモリ・イメージセンサー・パワーで注入要求が変わる",
      lead: "同じ元素でも、必要な線量・深さ・温度・角度はデバイス構造で異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "製品・用途",
          rightLabel: "主な装置要求",
          rows: [
            { left: "先端ロジック", right: "浅い接合、立体構造への角度制御、低い汚染、線量均一性、低温・高温などの材料改質" },
            { left: "DRAM・NAND", right: "高い生産性、深い領域を含むエネルギー範囲、繰り返し精度、装置間整合" },
            { left: "CMOSイメージセンサー", right: "深さ方向プロファイル、低い金属・粒子汚染、角度・線量精度" },
            { left: "シリコンパワー・アナログ", right: "高線量、中エネルギー、深いウェル、高電圧構造、幅広いウェーハ径への対応" },
            { left: "SiC・GaNパワー", right: "高温注入、アルミニウムなどの注入種、硬い結晶のダメージ、反り・基板搬送" },
            { left: "水素・ヘリウム注入", right: "層転写、接合、レーザーデバイスなどで、高い線量・エネルギーと対象基板に合う処理を行う" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "イオン注入・拡散の仕組み", href: "/guides/semiconductor-ion-implantation-process", description: "注入量・深さ・角度・活性化の原理を見る" },
            { label: "酸化・熱処理", href: "/guides/semiconductor-oxidation-thermal-process", description: "注入後の結晶回復・活性化アニールを見る" },
          ],
        },
      ],
      paragraphs: [
        "Applied MaterialsはVIISta 900 3Dを中電流のロジック・3Dメモリ・イメージセンサー・SiCなどへ、VIISta Tridentを高電流の先端用途へ展開しています。AxcelisはPurionをロジック、メモリ、イメージセンサー、成熟工程、パワーデバイスへ展開しています。",
        "日新イオン機器は中電流のEXCEED、高温注入のIMPHEAT、水素注入などを公開しています。住友重機械工業は高電流・中電流・高エネルギーと、パワーデバイス向けを含む装置群を示しています。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体イオン注入装置の代表企業4社",
      lead: "市場順位ではなく、公式ラインアップから確認できる主な装置領域を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主なイオン注入装置・技術領域",
          rows: [
            { left: "Applied Materials｜米国", right: "VIIStaシリーズの高電流・中電流など。先端ロジック、メモリ、イメージセンサー、SiC高温注入、材料改質" },
            { left: "Axcelis Technologies｜米国", right: "Purionシリーズの高電流、中エネルギー、中電流、高エネルギー。ロジック、メモリ、パワー、センサー、成熟工程" },
            { left: "住友重機械マテリアルソリューションズ｜日本", right: "SAion、MC3、UHEなど、高電流・中電流・高エネルギー、パワーデバイス向けとレーザーアニールの関連領域" },
            { left: "日新イオン機器｜日本", right: "EXCEED、IMPHEAT、EXCEED400HYなど、中電流、高温・パワーデバイス、水素注入、FPD・材料改質、注入サービス" },
          ],
        },
        {
          type: "note",
          title: "代表企業は網羅的な順位表ではない",
          body: "研究開発、小口径基板、特殊イオン、FPD、材料改質、受託注入などにも専門企業・サービスがあります。掲載企業は量産用イオン注入装置の違いを説明する代表例で、市場順位を示しません。",
        },
      ],
      paragraphs: [
        "同じ企業でも高電流・中電流・高エネルギー、シリコン・SiC、室温・高温、量産・開発で製品が異なります。会社全体を一つの『注入性能』として比較しません。",
        "製品ラインアップと会社組織は更新されます。特定装置や求人を調べる場合は、メーカーの最新製品ページ、会社情報、採用情報を確認してください。",
      ],
    },
    {
      id: "comparison",
      heading: "イオン注入装置メーカーは、7つの条件をそろえて比較する",
      lead: "装置名称を、実際に必要なドーピング条件へ分解します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較条件",
          rightLabel: "確認すること",
          rows: [
            { left: "1. 注入種・原料", right: "ホウ素、リン、ヒ素、アルミニウム、水素など、必要な元素・電荷状態と原料供給" },
            { left: "2. 線量・ビーム電流", right: "必要線量、線量範囲、ビーム電流、線量率、面内・ウェーハ間均一性" },
            { left: "3. エネルギー", right: "浅い・中間・深い分布、加速・減速、不要なエネルギー成分の抑制" },
            { left: "4. 角度・ビーム品質", right: "傾き・回転、平行度、ビーム形状、金属・粒子・異種汚染、帯電" },
            { left: "5. 基板・温度", right: "ウェーハ径、シリコン・SiCなどの材料、反り・薄さ、室温・高温・低温注入" },
            { left: "6. 量産性能", right: "スループット、稼働率、レシピ切替、装置間整合、設置面積、電力、源寿命、保守時間" },
            { left: "7. サービス・データ", right: "立ち上げ、アプリケーション支援、部品、改造、遠隔監視、注入・保守履歴、受託サービス" },
          ],
        },
      ],
      paragraphs: [
        "最大エネルギーや最大処理能力は、注入種、電荷状態、線量、ビーム電流、ウェーハ径、温度、測定条件で変わります。異なる条件のカタログ数値をそのまま横並びにしません。",
        "量産価値はビームを出せることだけで決まりません。イオン源寿命、レシピ切替後の安定化、ビーム調整時間、金属・粒子、ウェーハ搬送、保守後復帰、アニール後の電気特性まで確認します。",
      ],
    },
    {
      id: "production",
      heading: "真空・高電圧・原料・部品管理が装置稼働を支える",
      lead: "ビームラインは多数の電極・磁石・真空部品で構成され、付着と消耗が性能へ影響します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "VACUUM", title: "真空系", body: "分子との衝突を抑える圧力を維持し、原料・レジスト由来ガスを排気します。" },
            { label: "HV", title: "高電圧・絶縁", body: "安定した加速電位を作り、放電、漏れ、インターロックを管理します。" },
            { label: "MAGNET", title: "磁石・電源", body: "質量分析、集束、走査に使う磁界と電源を校正・安定化します。" },
            { label: "SOURCE PARTS", title: "イオン源部品", body: "電極、フィラメントなどの消耗・付着・交換周期と源寿命を管理します。" },
            { label: "CONTAMINATION", title: "汚染・粒子", body: "ビーム衝突による付着物・金属・粒子を監視し、清掃・部品交換を行います。" },
            { label: "SAFETY", title: "原料・放射線安全", body: "原料ガス、高電圧、X線などのリスクを排気・除害・遮へい・インターロックで管理します。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "粒子・欠陥・膜・寸法を測る装置企業を見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "注入前後の汚染・残留物を除去する装置を見る" },
          ],
        },
      ],
      paragraphs: [
        "イオン源やビームラインへ付着した材料は、ビーム安定性、汚染、粒子、絶縁へ影響します。予防保全、部品交換、真空回復、ビーム立ち上げ、モニター処理までを装置稼働時間として考えます。",
        "注入装置は高電圧・原料・放射線を扱うため、安全設計と法令・工場ルールが重要です。保守担当者はエネルギー遮断、残留物、真空、高温部を確認し、手順とインターロックを守ります。",
      ],
    },
    {
      id: "jobs",
      heading: "イオン注入装置メーカーの主な職種",
      lead: "プラズマ・電磁気・真空・高電圧・材料・ソフトウェアを横断します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種",
          rightLabel: "主な仕事",
          rows: [
            { left: "プロセス・アプリケーション", right: "注入種、線量、エネルギー、角度、温度を設計し、分布・電気特性へつなぐ" },
            { left: "イオン源・ビーム開発", right: "プラズマ生成、引き出し、質量分析、加速、集束、走査、純化を設計・評価する" },
            { left: "機械・真空・搬送", right: "ビームライン、真空容器、ウェーハ搬送・保持、冷却・加熱、構造を設計する" },
            { left: "電気・電源・制御", right: "高電圧、磁石電源、高周波、モーション、安全、ビーム・線量計測を制御する" },
            { left: "ソフトウェア・データ", right: "装置シーケンス、レシピ、ビーム調整、UI、工場接続、状態監視、解析を開発する" },
            { left: "フィールドサービス", right: "据付、立ち上げ、源・部品交換、真空・ビーム復旧、故障解析、稼働率改善を支える" },
            { left: "生産・品質・安全", right: "精密部品・装置の組立、検査、変更管理、清浄度、供給、高電圧・原料安全を管理する" },
          ],
        },
      ],
      paragraphs: [
        "真空装置、プラズマ、高電圧、加速器、磁石、精密搬送、電源、制御、材料分析、装置保全、品質、顧客対応の経験は接点を整理しやすい領域です。求人では担当装置、ビームラインか搬送か、開発か量産支援かを確認します。",
        "経験を説明するときは、ビーム安定性、均一性、汚染・粒子、稼働率、源寿命、復旧時間、安全、電力・部品使用のどこへ貢献したかを担当範囲と一緒に言語化します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体イオン注入装置メーカーでよくある質問",
      lead: "装置カテゴリーと企業の関係を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体イオン注入装置とは何ですか？", answer: "目的元素をイオン化・選別・加速し、ウェーハへ決めた線量・エネルギー・角度で導入する量産装置です。p型・n型領域や材料特性を作ります。" },
            { question: "主なイオン注入装置メーカーは？", answer: "この記事ではApplied Materials、Axcelis Technologies、住友重機械マテリアルソリューションズ、日新イオン機器を代表例として紹介しています。網羅的な順位表ではありません。" },
            { question: "高電流と高エネルギーの違いは？", answer: "高電流は単位時間あたりに運ぶイオン数を増やし、高い線量を効率よく入れる方向です。高エネルギーは一つのイオンを強く加速し、より深い領域へ入れる方向です。" },
            { question: "中電流装置は何に使いますか？", answer: "幅広い線量・エネルギーと高い角度・純度制御が必要なウェル、チャネル、イメージセンサー、メモリ、各種成熟工程、パワーデバイスなどに使われます。" },
            { question: "SiCではなぜ高温注入を使いますか？", answer: "SiCは結晶構造が強固で、注入ダメージと活性化が課題になります。ウェーハを加熱しながら注入し、結晶ダメージを抑える方向の装置・プロセスが使われます。" },
            { question: "注入装置とアニール装置の違いは？", answer: "注入装置はイオンを基板へ導入します。アニール装置は注入後の結晶ダメージを回復し、ドーパントを活性化します。最終分布・電気特性は両工程で作ります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜注入種・電流・エネルギー・角度・温度をそろえてメーカーを見る",
      lead: "イオン注入装置は、目的のイオンを精密な濃度分布へ変えるビームシステムです。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "BEAM", title: "イオンを作って純化する", body: "イオン源、質量分析、加速、フィルターで目的のビームを作る" },
            { label: "PROFILE", title: "分布を制御する", body: "線量、エネルギー、角度、温度、走査で量・深さ・面内分布をそろえる" },
            { label: "PRODUCTION", title: "量産全体で比較する", body: "汚染、粒子、源寿命、搬送、生産性、保守、安全、アニール後結果を見る" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "イオン注入・拡散の仕組み", href: "/guides/semiconductor-ion-implantation-process", description: "ドーピング、濃度分布、活性化の原理を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置企業を一つの地図で見る" },
            { label: "酸化・熱処理", href: "/guides/semiconductor-oxidation-thermal-process", description: "注入後アニールの役割を見る" },
            { label: "熱処理装置メーカー", href: "/guides/semiconductor-thermal-processing-equipment-manufacturers", description: "活性化アニールを担うRTP・炉・短時間加熱装置を見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "注入前後の表面を整える装置を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "装置・材料・半導体メーカーの位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの装置を選び、高電流・中電流・高エネルギーの分類、注入種、エネルギー、ウェーハ径、温度、対象デバイスを確認してください。同じ用途へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "Applied Materials・Axcelis・住友重機械・日新イオン機器から1社を選び、公式製品を高電流・中電流・高エネルギーのどこへ置けるか確認する",
  relatedGuideSlugs: [
    "semiconductor-ion-implantation-process",
    "semiconductor-equipment-manufacturers",
    "semiconductor-oxidation-thermal-process",
    "semiconductor-thermal-processing-equipment-manufacturers",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "photolithography-process",
    "semiconductor-etching-process",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: ["applied-materials", "screen", "tokyo-electron"],
};
