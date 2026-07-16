import type { GuideArticle } from "@/content/guides/types";

export const semiconductorWaferHandlingEfemManufacturersGuide: GuideArticle = {
  slug: "semiconductor-wafer-handling-efem-manufacturers",
  title: "半導体ウェーハ搬送ロボット・EFEMメーカーとは？ローツェ・平田機工・Brooks・川崎重工を図解",
  description:
    "EFEM、FOUP、ロードポート、大気・真空ウェーハ搬送ロボット、アライナの役割と搬送フロー、清浄度・位置精度・スループット・規格、主要メーカーと比較軸を初心者向けに図解します。",
  targetQuery: "半導体 ウェーハ 搬送ロボット EFEM メーカー",
  searchIntent:
    "EFEMとは何か、FOUP・ロードポート・大気ロボット・アライナ・真空ロボットの役割、ウェーハ搬送フロー、清浄度・位置精度・スループット・規格、主要メーカーと比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "ローツェ、平田機工、Brooks Automation、川崎重工の公式製品・企業情報をもとに、FOUPを受け取る、ドアを開く、ウェーハを取り出す、位置・IDを確認する、プロセス装置へ渡す、処理後にFOUPへ戻す流れへ整理しました。ロボット単体の最高速度だけで順位付けせず、ハンド、ウェーハ状態、ポート数、移動経路、アライナ、ロードロック、清浄度、振動、制御・規格、保守を一つの搬送系として扱います。",
  showCareerCtas: false,
  experienceBasis: [
    "各工程装置メーカーの記事を公開したうえで、ほぼすべての枚葉式装置の前面・内部を支えるウェーハ搬送を独立記事にする必要があると判断",
    "ローツェと平田機工でEFEM、ロードポート、大気・真空ロボット、アライナの製品構成とFOUPから装置への搬送を確認",
    "Brooksで大気・真空環境をまたぐ自動化プラットフォーム、川崎重工でEFEM向けウェーハ搬送ロボットとSEMI規格対応の領域を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Wafer Handling System",
      url: "https://www.rorze.com/en/products_category/wafer-transfer-system/",
      publisher: "RORZE Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "ACE EFEM",
      url: "https://www.rorze.com/en/products/ace-efem/",
      publisher: "RORZE Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Semiconductor Related Equipment",
      url: "https://www.hirata.co.jp/en/products/semiconductor",
      publisher: "Hirata Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Vacuum Automation",
      url: "https://www.brooks.com/solutions/vacuum-automation/",
      publisher: "Brooks Automation",
      accessedAt: "2026-07-16",
    },
    {
      title: "Wafer Transfer Robots",
      url: "https://kawasakirobotics.com/jp/robots-category/wafer/",
      publisher: "Kawasaki Heavy Industries, Ltd.",
      accessedAt: "2026-07-16",
    },
    {
      title: "RORZE Integrated Report 2025",
      url: "https://www.rorze.com/en/wp-content/uploads/sites/2/2025/11/IntegratedReport_RORZE_en_2025.pdf",
      publisher: "RORZE Corporation",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約16分",
  intro: {
    problem:
      "EFEMを調べると、ウェーハ搬送ロボット、ロードポート、FOUP、アライナ、ソーター、ロードロック、真空ロボットが並び、どこまでがEFEMなのか分かりにくくありませんか。",
    conclusion:
      "EFEMは、プロセス装置の前面でFOUPと装置内部をつなぐ清浄な大気搬送モジュールです。ロードポート、大気ロボット、アライナ、FFU、センサ・制御などを統合し、必要に応じてロードロックと真空搬送系へウェーハを渡します。比較では、対象基板、構成、ハンドリング、清浄度・振動、位置精度、スループット、安全・規格、制御・保守をそろえます。",
    learnings:
      "EFEMの範囲、FOUP・ロードポート・アライナ、大気・真空ロボット、搬送フロー、保持方式、清浄度・位置精度、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私はEFEMを、『装置前のロボット箱』ではなく、工場搬送のFOUPとプロセス装置の清浄な受け渡し境界として見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜FOUPから一枚ずつ取り出し、装置へ渡して戻す",
      description: "代表的な300mm枚葉装置の搬送を単純化しています。実際の構成・順序は装置で異なります。",
      stages: [
        { label: "01 / DOCK", title: "FOUPを受け取る", body: "OHT・AGV・作業者がFOUPをロードポートへ置き、ID・着座・クランプを確認する" },
        { label: "02 / OPEN", title: "FOUPドアを開く", body: "ロードポートが密閉境界を保ちながらドアを開閉し、ウェーハ位置をマッピングする" },
        { label: "03 / PICK", title: "大気ロボットが取り出す", body: "指定スロットへハンドを入れ、接触・振動・粒子を抑えて一枚を保持する" },
        { label: "04 / ALIGN", title: "向きと中心を合わせる", body: "アライナでノッチ・中心を測り、必要に応じてIDを読み、装置座標へ合わせる" },
        { label: "05 / HANDOFF", title: "装置内部へ渡す", body: "大気処理部またはロードロックへ置き、真空ロボット・プロセスモジュールへ引き渡す" },
        { label: "06 / RETURN", title: "処理後に戻す", body: "逆順で元のFOUPまたは指定先へ戻し、スロット・処理履歴・異常を記録する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "構成要素",
      rightLabel: "主な役割",
      rows: [
        { left: "FOUP", right: "複数枚の300mmウェーハを密閉状態で工程間搬送・保管する容器" },
        { left: "ロードポート", right: "FOUPを受け、クランプ、ID確認、ドア開閉、ウェーハマッピングを行う装置前面の入口" },
        { left: "大気搬送ロボット", right: "FOUP、アライナ、ロードロック、装置モジュール間でウェーハを搬送する" },
        { left: "アライナ", right: "ウェーハの中心とノッチ・オリエンテーションを測り、次の受け渡し姿勢へ合わせる" },
        { left: "EFEM筐体・FFU", right: "清浄空気流、圧力、フィルタ、扉、照明、センサを統合し搬送空間を保つ" },
        { left: "ロードロック・真空ロボット", right: "大気と真空を切り替え、真空中で複数のプロセスモジュールへ搬送する。通常はEFEM後段" },
      ],
    },
  ],
  sections: [
    {
      id: "boundary",
      heading: "EFEMは大気側、真空搬送モジュールはプロセス側を担当する",
      lead: "装置の境界を分けると、各部品の役割が見えます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "領域",
          rightLabel: "主な設備と環境",
          rows: [
            { left: "工場内搬送", right: "OHT・AGV・ストッカがFOUP単位で装置間を運ぶ" },
            { left: "EFEM", right: "ロードポート、大気ロボット、アライナ、FFU、制御がFOUPと装置入口をつなぐ" },
            { left: "ロードロック", right: "ウェーハを収容して大気・真空を切り替え、両環境の間を分離する" },
            { left: "真空搬送モジュール", right: "真空ロボットがロードロックと複数のプロセス室間でウェーハを運ぶ" },
            { left: "プロセスモジュール", right: "成膜、エッチング、洗浄、熱処理、計測など実際の処理を行う" },
            { left: "ソーター", right: "FOUP・カセット間の移載、並べ替え、反転、ID・検査などを主目的にする" },
          ],
        },
      ],
      paragraphs: [
        "平田機工はEFEMを、ロードポートとウェーハ搬送ロボットを統合し、容器とプロセス装置の間でクリーンに受け渡す装置として説明しています。",
        "Brooksは大気・真空環境をまたぐ搬送システムとして、EFEM、ロードポート、真空ロボット、プロセスモジュールの統合を示しています。",
      ],
    },
    {
      id: "handling",
      heading: "薄い円板を、汚さず・傷付けず・落とさず・ずらさず運ぶ",
      lead: "速度を上げるほど、振動・滑り・粒子・整定との両立が難しくなります。",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            { label: "VACUUM", title: "裏面吸着", body: "ハンドの吸着孔でウェーハ裏面を保持します。安定して運びやすい一方、接触面・粒子・吸着痕・薄化ウェーハへの影響を確認します。" },
            { label: "EDGE", title: "エッジグリップ", body: "ウェーハ外周を保持し、裏面接触を減らします。エッジ状態、ノッチ、把持力、たわみ、落下検知を管理します。" },
            { label: "BERNOULLI", title: "非接触・低接触保持", body: "気流などを使い接触を減らす方式があります。供給ガス、浮上安定性、発塵、位置精度、対象ウェーハを確認します。" },
            { label: "SPECIAL", title: "特殊基板・キャリア", body: "薄化、反り、透明、SiC、ガラス、リングフレーム、パネルなどではハンド・センサ・経路を専用化します。" },
          ],
        },
        {
          type: "note",
          title: "ウェーハ有無だけでなく、二枚取り・突き出し・割れを検知する",
          body: "スロットマッピング、ハンド上センサ、厚さ・距離、真空圧、トルク、画像などを組み合わせ、搬送前後の異常を安全に止めます。",
        },
      ],
      paragraphs: [
        "ローツェはEFEM・ソーターで真空吸着とエッジクランプ、アライナ、ID読取、N2・清浄乾燥空気パージなどの選択肢を示しています。",
        "対象が変わると最適ハンドも変わります。裸ウェーハ、パターン付き、薄化・接合、反った基板、リングフレームを同じ搬送条件で比較しません。",
      ],
    },
    {
      id: "performance",
      heading: "スループットは、ロボット速度ではなく搬送シーケンス全体で決まる",
      lead: "最短動作と安定した量産動作は同じではありません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "性能・品質項目",
          rightLabel: "主な確認事項",
          rows: [
            { left: "搬送時間", right: "FOUP開閉、マッピング、取出し、アライメント、受渡し、整定、戻しを含む周期時間" },
            { left: "ポート・アーム構成", right: "2・3・4ポート、単腕・双腕、走行軸、アライナ数、バッファで並列化できる範囲" },
            { left: "位置精度・再現性", right: "中心、角度、高さ、受渡し位置、熱・経時変化、装置間差を含む" },
            { left: "清浄度・発塵", right: "ロボット駆動、ケーブル、ベルト、ハンド、FOUPドア、気流からウェーハへ移る粒子を管理する" },
            { left: "振動・整定", right: "高速動作後にウェーハと機構の振動が収まり、安全に受け渡せるまでの時間" },
            { left: "搬送成功率", right: "取り損ね、落下、二枚取り、突き出し、マッピング異常、衝突を含む停止・復旧の頻度" },
            { left: "稼働率・保守", right: "消耗部、校正、清掃、教示、交換、予防保全、故障復旧、冗長性" },
          ],
        },
      ],
      paragraphs: [
        "平田機工とローツェは、複数ポート・アライナ・双腕・走行軸などで高スループットを実現する構成を公式に示しています。",
        "カタログ速度は対象ウェーハ、移動距離、経路、ハンド、加速度、整定条件で変わります。実際の装置シーケンスで比較します。",
      ],
    },
    {
      id: "standards",
      heading: "機械寸法だけでなく、装置間通信と安全規格で接続する",
      lead: "300mm工場では搬送・装置・ホストが連動します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "接続・規格領域",
          rightLabel: "主な確認事項",
          rows: [
            { left: "FOUP・ロードポート", right: "容器寸法、ドア、着座、クランプ、スロット位置、マッピング、N2パージなどの機械・機能適合" },
            { left: "OHTハンドオフ", right: "自動搬送との受渡し信号、到着・着座・クランプ・安全状態を連携する" },
            { left: "SECS/GEM・GEM300", right: "装置状態、キャリア・ウェーハ追跡、レシピ、アラーム、ホスト制御を接続する" },
            { left: "安全", right: "挟まれ、衝突、落下、ドア、非常停止、停電・瞬低、復旧、保守アクセスを設計する" },
            { left: "トレーサビリティ", right: "FOUP ID、ウェーハID、スロット、処理順、搬送先、異常・再処理を履歴へ残す" },
          ],
        },
      ],
      paragraphs: [
        "川崎重工はウェーハ搬送ロボットでSEMI-F47とSEMI-S2への適合を公式に示しています。ローツェは300mm工場向けSECS/GEM・GEM300対応ソフトを展開しています。",
        "規格対応はチェック欄だけでなく、採用装置・工場ホスト・OHT・安全回路とのインターフェース試験で確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "ウェーハ搬送ロボット・EFEMの代表企業4社",
      lead: "部品単体、統合EFEM、真空プラットフォームで提供範囲が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "ローツェ｜日本", right: "大気・真空ウェーハロボット、アライナ、ロードポート、真空プラットフォーム、EFEM・ソーター、装置通信ソフトを展開" },
            { left: "平田機工｜日本", right: "ロードポート、大気・真空ロボット、アライナ、EFEM・ソーターを展開し、300mmやパネル搬送にも対応" },
            { left: "Brooks Automation｜米国", right: "大気・真空自動化、真空ロボット、EFEM、ロードポート、真空プラットフォーム、診断・サービスを展開" },
            { left: "川崎重工｜日本", right: "EFEM向け大気ウェーハ搬送ロボットと真空ロボットを展開し、複数FOUPアクセス、精密・滑らかな搬送、安全規格対応を示す" },
          ],
        },
      ],
      paragraphs: [
        "ロボット・部品を装置メーカーへ供給する企業と、EFEM・真空搬送を統合して供給する企業では責任範囲が異なります。",
        "市場シェアや一律の速度順位は扱いません。対象基板、ハンド、経路、ポート、アライナ、清浄度、規格、保守をそろえます。",
      ],
    },
    {
      id: "comparison",
      heading: "EFEM・搬送ロボットメーカーは、8つの条件をそろえて比較する",
      lead: "ウェーハ一枚の安全な受渡しを、装置一周期とライフサイクルで見ます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象基板", right: "径、厚さ、質量、反り、透明・不透明、材質、リングフレーム、パネル、キャリア付き" },
            { left: "2. システム構成", right: "ポート数、単腕・双腕、走行軸、アライナ、バッファ、ソーター、ロードロック、真空搬送" },
            { left: "3. ハンドリング", right: "裏面吸着、エッジ保持、低接触、落下・二枚取り・突き出し検知、反転・ID読取" },
            { left: "4. 清浄度・振動", right: "発塵源、気流、N2パージ、裏面汚染、振動、整定、ウェーハダメージ" },
            { left: "5. 精度・能力", right: "位置・角度・高さ、再現性、搬送時間、処理能力、複数ポート並列、エラー復旧" },
            { left: "6. 安全・規格", right: "FOUP・ロードポート、OHT受渡し、SEMI-S2・F47、非常停止、停電・復旧、保守安全" },
            { left: "7. 制御・データ", right: "ロボット制御、教示、SECS/GEM・GEM300、ウェーハ追跡、ログ、診断、上位装置接続" },
            { left: "8. 量産支援", right: "カスタム設計、装置統合、現地立上げ、予防保全、部品、拠点、長期供給、変更管理" },
          ],
        },
      ],
      paragraphs: [
        "ロボット単体評価では届く範囲と繰返し精度を確認し、EFEM評価ではFOUP開閉から装置受渡しまでの成功率・周期・粒子を確認します。",
        "薄化・反りウェーハでは標準試料だけでなく、想定最大反り、表面状態、エッジ状態、搬送履歴を持つ実試料で評価します。",
      ],
    },
    {
      id: "jobs",
      heading: "搬送ロボット・EFEMメーカーの仕事は、メカトロ・清浄化・装置統合をつなぐ",
      lead: "ロボット本体から工場自動化まで職種が広がります。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "MECHANICS", title: "機構設計", body: "アーム、減速・直動、ハンド、ロードポート、アライナ、筐体を設計します。" },
            { label: "MOTION", title: "モーション制御", body: "軌跡、加減速、振動抑制、整定、衝突回避、同期制御を実装します。" },
            { label: "CLEAN", title: "清浄・流体", body: "発塵、気流、FFU、N2パージ、吸着、裏面汚染、材料を評価します。" },
            { label: "SENSOR", title: "センサ・画像", body: "マッピング、ウェーハ有無、二枚取り、中心・ノッチ、ID、異常検知を設計します。" },
            { label: "SOFTWARE", title: "装置・通信ソフト", body: "シーケンス、状態管理、SECS/GEM、GEM300、追跡、ログ、復旧を実装します。" },
            { label: "INTEGRATION", title: "装置統合・サービス", body: "プロセス装置、OHT、FOUP、ロードロックとの接続、教示、立上げ、保守を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "機械、ロボット、制御、組込み、画像、クリーン技術、生産設備、自動化、フィールドサービスの経験を接続できます。",
        "求人では、ロボット単体、ロードポート、EFEM統合、真空搬送、ソフト、現地立上げのどこを担当するか確認します。",
      ],
    },
    {
      id: "faq",
      heading: "ウェーハ搬送ロボット・EFEMでよくある質問",
      lead: "装置の境界と用語を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "EFEMとは何ですか？", answer: "Equipment Front End Moduleの略で、プロセス装置の前面に置かれ、ロードポート、大気搬送ロボット、アライナ、清浄化・制御機能などでFOUPと装置内部をつなぐモジュールです。" },
            { question: "FOUPとは何ですか？", answer: "Front Opening Unified Podの略で、主に300mmウェーハを複数枚収納し、前面ドアから装置へ受け渡す密閉容器です。" },
            { question: "大気ロボットと真空ロボットの違いは？", answer: "大気ロボットはEFEMなど大気・清浄環境で搬送します。真空ロボットはロードロック後の低圧環境でプロセス室間を搬送します。" },
            { question: "主なメーカーは？", answer: "この記事ではローツェ、平田機工、Brooks Automation、川崎重工を代表例として紹介しています。" },
            { question: "速いロボットほどスループットが高いですか？", answer: "単純には決まりません。FOUP開閉、マッピング、アライメント、移動距離、整定、装置待ち、エラー復旧を含むシーケンス全体で決まります。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜EFEMは、FOUPとプロセス装置の受け渡し境界",
      lead: "清浄・精密・高速・安全な搬送を一つのモジュールへ統合します。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "BOUNDARY", title: "境界を分ける", body: "工場搬送、EFEM、ロードロック、真空搬送、処理室を整理する" },
            { label: "WAFER", title: "対象を決める", body: "径、厚さ、反り、材質、表裏面、キャリア状態を固定する" },
            { label: "SEQUENCE", title: "周期で見る", body: "開閉、取出し、位置合わせ、受渡し、戻し、復旧を測る" },
            { label: "INTEGRATE", title: "接続で見る", body: "FOUP、OHT、装置、安全、通信、追跡、保守をつなぐ" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "EFEMが前面に付く工程装置の全体地図を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "ロードロック・真空搬送を持つクラスタ装置を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "複数プロセス室へ搬送する真空装置を見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "大気搬送を使う枚葉洗浄装置を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "ウェーハを自動搬送して検査する装置を見る" },
            { label: "真空ポンプメーカー", href: "/guides/semiconductor-vacuum-pump-manufacturers", description: "ロードロック・真空搬送を支える排気系を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象基板、システム構成、ハンドリング、清浄度・振動、精度・能力、安全・規格、制御・データ、量産支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "ローツェ・平田機工・Brooks・川崎重工から1社を選び、公式製品をロードポート・ロボット・ハンド・アライナ・清浄化・装置通信の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-equipment-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-thermal-processing-equipment-manufacturers",
    "semiconductor-cmp-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-wafer-prober-manufacturers",
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
