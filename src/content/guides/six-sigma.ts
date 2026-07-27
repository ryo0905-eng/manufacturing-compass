import type { GuideArticle } from "@/content/guides/types";

export const sixSigmaGuide: GuideArticle = {
  slug: "six-sigma",
  title: "シックスシグマとは？DMAICと品質改善ツールの全体像を図解",
  description:
    "シックスシグマを、6σの意味、DMAICの5段階、各段階で使うGage R&R・Cp/Cpk・管理図・実験計画法まで図解。製造業の改善をどこから始めるか整理します。",
  targetQuery: "シックスシグマ とは",
  searchIntent:
    "シックスシグマとは何か、6σと3.4 DPMOの意味、DMAICの進め方、各段階で使う品質管理・統計手法を初心者向けに理解したい",
  status: "draft",
  category: "technology",
  featured: false,
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "ISO、ASQ、NIST、Minitabの公開情報で定義と計算上の前提を照合しました。特定企業の導入方法や社内判定基準ではなく、製造業で改善手法を選ぶための全体像を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "ISO 13053-1とASQの公開情報をもとに、シックスシグマとDMAICの範囲を整理",
    "NISTの工程能力解説で、規格幅、平均、標準偏差、Cp・Cpkの関係を確認",
    "既存のGage R&R、管理図、Cp・Cpk、DoE学習ツールをDMAICの判断順序へ接続",
  ],
  publishedAt: "2026-07-27",
  updatedAt: "2026-07-27",
  sources: [
    {
      title: "ISO 13053-1:2011 Quantitative methods in process improvement — Six Sigma — Part 1: DMAIC methodology",
      url: "https://www.iso.org/standard/52901.html",
      publisher: "International Organization for Standardization",
      accessedAt: "2026-07-27",
    },
    {
      title: "Six Sigma Definition - What is Lean Six Sigma?",
      url: "https://asq.org/quality-resources/six-sigma",
      publisher: "ASQ",
      accessedAt: "2026-07-27",
    },
    {
      title: "DMAIC Process: Define, Measure, Analyze, Improve, Control",
      url: "https://asq.org/quality-resources/dmaic",
      publisher: "ASQ",
      accessedAt: "2026-07-27",
    },
    {
      title: "Six Sigma Tools & Techniques",
      url: "https://asq.org/quality-resources/sixsigma/tools",
      publisher: "ASQ",
      accessedAt: "2026-07-27",
    },
    {
      title: "What is Process Capability?",
      url: "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm",
      publisher: "NIST/SEMATECH",
      accessedAt: "2026-07-27",
    },
    {
      title: "What do we mean by Normal data?",
      url: "https://www.itl.nist.gov/div898/handbook/pmc/section5/pmc51.htm",
      publisher: "NIST/SEMATECH",
      accessedAt: "2026-07-27",
    },
    {
      title: "Z.bench as an estimate of sigma capability",
      url: "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/supporting-topics/capability-metrics/z-bench-as-an-estimate-of-sigma-capability/",
      publisher: "Minitab",
      accessedAt: "2026-07-27",
    },
    {
      title: "Control Chart - Statistical Process Control Charts",
      url: "https://asq.org/quality-resources/control-chart",
      publisher: "ASQ",
      accessedAt: "2026-07-27",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "シックスシグマを調べても、3.4 ppmという数字、DMAIC、ベルト制度、統計ツールが一度に出てきて、結局どこから始めればよいか分かりにくくありませんか。",
    conclusion:
      "シックスシグマは、顧客にとって重要な問題を定義し、信頼できるデータで原因を確かめ、改善を維持するための体系です。すべての統計手法を使うことではなく、DMAICの問いに合う道具を選ぶことが中心です。",
    learnings:
      "6σの意味と注意点、DMAICの5段階、測定・安定性・工程能力・原因分析・条件最適化の順序、既存ツールの使い分け。",
  },
  overviewBlocks: [
    {
      type: "process-flow",
      title: "シックスシグマは、問題を定義してから改善を維持するまでの道筋",
      description:
        "DMAICは既存プロセスを改善する代表的な進め方です。各段階は独立した作業ではなく、前段階の成果を受け取って次の判断へ進みます。",
      stages: [
        { label: "D / DEFINE", title: "定義する", body: "顧客・後工程の要求と、改善する問題、範囲、目標を決める" },
        { label: "M / MEASURE", title: "測定する", body: "工程と測定系を確認し、信頼できる現状値を作る" },
        { label: "A / ANALYZE", title: "分析する", body: "結果に効く要因を絞り、根本原因の仮説をデータで確かめる" },
        { label: "I / IMPROVE", title: "改善する", body: "対策や条件を比較し、試行と確認実験で効果を確かめる" },
        { label: "C / CONTROL", title: "管理する", body: "管理方法と反応計画を決め、改善後の状態を維持する" },
      ],
      cycle: {
        title: "各段階をつなぐ共通の考え方",
        items: ["顧客要求", "測定の信頼性", "事実と仮説", "確認実験", "反応計画"],
        note: "手法の名前を先に選ばず、その段階で答える問いと必要な成果物から道具を決めます。",
      },
    },
    {
      type: "cards",
      columns: 3,
      items: [
        { label: "CUSTOMER", title: "重要な品質を定義する", body: "社内で測りやすい数字ではなく、顧客や後工程にとって重要な要求を測定可能な特性へ変えます。" },
        { label: "VARIATION", title: "平均だけでなく、ばらつきを見る", body: "平均が目標に合っていても、散らばりや時間変化が大きければ、結果を安定して再現できません。" },
        { label: "SYSTEM", title: "道具を一つの流れで使う", body: "測定系、管理状態、工程能力、原因、改善条件、維持方法を順番につなぎます。" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "シックスシグマとは、ばらつきを減らして顧客要求を安定して満たす改善体系",
      lead:
        "統計計算だけでも、不良を数える活動だけでもありません。改善テーマ、チーム、データ、実験、維持管理を一つのプロジェクトへまとめます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "見方",
          rightLabel: "シックスシグマで意味すること",
          rows: [
            { left: "改善の考え方", right: "経験だけで結論を出さず、顧客要求、工程データ、検証結果から判断する" },
            { left: "プロジェクトの進め方", right: "既存工程の問題をDefine、Measure、Analyze、Improve、Controlの順に進める" },
            { left: "品質水準の表現", right: "規格や欠陥機会に対して、工程がどの程度の余裕と欠陥水準を持つかをσやDPMOなどで表す" },
            { left: "組織の仕組み", right: "テーマを選ぶ責任者、改善を進めるリーダー、工程を知るメンバーが役割を分担する" },
          ],
        },
        {
          type: "note",
          title: "統計手法をたくさん使うほど、シックスシグマらしいわけではない",
          body:
            "簡単な層別と現物確認で原因を確かめられるなら、複雑な解析を追加する必要はありません。反対に、複数因子が絡む工程を一因子ずつ変更するだけでは判断しにくい場合は、実験計画法などを選びます。",
        },
      ],
      paragraphs: [
        "ASQはシックスシグマを、工程・製品・サービスのばらつきから生じる欠陥や誤りを減らし、顧客満足と工程能力を高める体系として説明しています。対象は製造工程に限らず、定義、測定、分析、改善、管理できる業務プロセスにも広がります。",
        "ISO 13053-1は、シックスシグマのプロジェクトをDMAICの5段階で進める方法と、プロジェクト管理、役割、力量を扱っています。この記事では資格制度や導入組織の作り方より先に、製造技術者が改善の全体像を理解することへ焦点を置きます。",
      ],
    },
    {
      id: "variation",
      heading: "品質改善では、平均・ばらつき・中心ずれを分けて見る",
      lead:
        "同じ平均値でも、測定値の散らばり方によって規格外になる可能性は変わります。散らばりが同じでも、中心が規格端へ寄れば余裕は小さくなります。",
      blocks: [
        {
          type: "sigma-distribution-comparison",
          title: "図解｜規格に対する分布を3つの状態で比べる",
          description:
            "曲線は考え方を示す模式図です。実データでは時系列、測定システム、分布の形、サンプリング方法を確認してから工程能力を評価します。",
          scenarios: [
            {
              kind: "wide",
              label: "CASE 01 / VARIATION",
              title: "中心は合うが、ばらつきが大きい",
              body: "平均は目標付近でも分布が広く、規格端へ近い測定値が増えます。",
              insight: "候補: 変動源の層別、設備・材料・方法・環境の確認",
            },
            {
              kind: "shifted",
              label: "CASE 02 / CENTERING",
              title: "ばらつきは小さいが、中心がずれる",
              body: "まとまりはあっても平均が上限側へ寄り、片側の余裕が小さくなります。",
              insight: "候補: 目標値、校正、設定値、時間変化の確認",
            },
            {
              kind: "capable",
              label: "CASE 03 / CAPABILITY",
              title: "ばらつきが小さく、中心も合う",
              body: "分布が規格内へ収まり、両側へ余裕があります。ただし安定性は時系列で別に確認します。",
              insight: "候補: 管理図と管理計画で状態を維持",
            },
          ],
        },
      ],
      paragraphs: [
        "NISTは工程能力を、統計的に安定した工程の自然な変動と規格幅の比較として説明しています。Cpは規格幅と工程の広がりを比べ、Cpkは平均から近い側の規格までの距離を使うため、中心ずれも反映します。",
        "ここで重要なのは、規格限界と管理限界を混同しないことです。規格限界は製品要求から決まり、管理限界は工程の時系列データから求めます。規格内の点が続いても工程が安定しているとは限らず、管理状態でも規格を満たす能力が十分とは限りません。",
      ],
    },
    {
      id: "six-sigma-level",
      heading: "「6σ」と3.4 DPMOは、前提をそろえて読む",
      lead:
        "σは標準偏差を表す記号です。シックスシグマでは、工程の中心から規格限界までの距離や欠陥水準を説明する尺度として使われます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "用語",
          rightLabel: "意味と確認する前提",
          rows: [
            { left: "σ（シグマ）", right: "分布の広がりを表す標準偏差。どの期間・群分け・推定方法の標準偏差かを確認する" },
            { left: "Sigma level", right: "規格限界までの距離を標準偏差単位などで表す性能指標。長期・短期とシフトの扱いで定義が変わる" },
            { left: "DPMO", right: "Defects Per Million Opportunities。100万回の欠陥機会あたりの欠陥数。単位数ではなく機会数の定義が必要" },
            { left: "3.4 DPMO", right: "一般的なシックスシグマ説明で、短期6σから長期に1.5σの中心シフトを仮定した時に用いられる値" },
            { left: "Cp・Cpk", right: "連続量の規格幅、平均、標準偏差から工程能力を見る指標。DPMOやSigma levelと無条件に置き換えない" },
          ],
        },
        {
          type: "note",
          title: "中心が固定された正規分布の±6σと、3.4 DPMOは同じ計算ではない",
          body:
            "3.4 DPMOという代表値には1.5σシフトの慣例が含まれます。実際の規格外率は分布、中心ずれ、長期変動、離散・連続データ、欠陥機会の定義によって変わるため、名称だけで推定しません。",
        },
      ],
      paragraphs: [
        "NISTは正規分布を平均μと標準偏差σで表します。標準偏差が小さくなるほど、同じ中心の周りへ分布が狭くなります。ただし、実工程のデータが正規分布とは限らず、自己相関、混合分布、片側規格、検出限界などがある場合は適切な解析方法を選ぶ必要があります。",
        "MinitabもSigma capabilityには複数の定義があり、長期のZ.Benchへ1.5を加える考え方があると説明しています。したがって、他社・他工程と数字を比較するときは、DPMO、Sigma level、短期・長期標準偏差、シフト仮定をそろえます。",
      ],
    },
    {
      id: "dmaic",
      heading: "DMAICは、既存工程の問題を5段階で解く",
      lead:
        "各段階の終わりに、次へ進めるだけの成果物があるか確認します。分析ツールを使ったことではなく、判断に必要な問いへ答えたことが区切りです。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "段階と成果物",
          rightLabel: "答える問い・代表的な手法",
          rows: [
            { left: "Define｜問題・目標・範囲", right: "誰が何に困り、どの指標をいつまでにどこまで変えるか。VOC、CTQ、SIPOC、プロジェクトチャーター" },
            { left: "Measure｜工程図・測定方法・現状値", right: "データを信頼できるか、現状はどの程度か。操作的定義、データ収集計画、Gage R&R、管理図、工程能力" },
            { left: "Analyze｜原因仮説と検証結果", right: "どの入力Xが結果Yへ効くか。層別、パレート図、特性要因図、散布図、仮説検定、回帰分析" },
            { left: "Improve｜選んだ対策・確認結果", right: "どの対策や条件で結果が改善するか。対策比較、DoE、リスク評価、パイロット、確認実験" },
            { left: "Control｜管理方法・反応計画・引継ぎ", right: "改善状態を誰がどう監視し、異常時に何をするか。管理図、管理計画、標準作業、教育、監査" },
          ],
        },
      ],
      paragraphs: [
        "ASQはDMAICを、期待水準を満たしていない既存プロセスを改善するための構造化された問題解決法と説明しています。新しい製品やプロセスを設計する場合は、Define、Measure、Analyze、Design、VerifyからなるDMADVなど、別の進め方が適することがあります。",
        "実務では段階を一方向に通過するとは限りません。Measureで測定定義の曖昧さが分かればDefineへ戻り、Analyzeで必要なデータが不足すればMeasureへ戻ります。ただし、原因が決まっていないのにImproveの対策から始めると、効果の理由と再現条件が分からなくなります。",
      ],
    },
    {
      id: "tool-selection",
      heading: "ツールは、測定系→安定性→能力→原因→最適化の順で選ぶ",
      lead:
        "一つの数値だけで工程を評価せず、前提となる判断から順番に確認します。Manufacturing Compassの学習ツールもこの流れで使えます。",
      blocks: [
        {
          type: "process-flow",
          title: "図解｜次に確認する技術を選ぶ",
          description:
            "すべてのプロジェクトで全ツールを使う必要はありません。データ種類、リスク、顧客・社内手順に合わせて選びます。",
          stages: [
            { label: "01 / MEASUREMENT", title: "測定値を信頼できるか", body: "部品差と測定誤差を分け、測定者・治具・手順・環境を確認" },
            { label: "02 / STABILITY", title: "工程は安定しているか", body: "時系列の平均、ばらつき、連続点、傾向から特殊原因を確認" },
            { label: "03 / CAPABILITY", title: "規格を満たす余裕があるか", body: "安定性と分布を確認したうえでCp・Cpk、Pp・Ppkを評価" },
            { label: "04 / CAUSE", title: "何が結果へ効くか", body: "層別、現物、工程知識、統計解析で原因仮説を絞って検証" },
            { label: "05 / OPTIMIZE", title: "どの条件がよいか", body: "因子と交互作用を考え、DoEと確認実験で改善条件を確かめる" },
            { label: "06 / SUSTAIN", title: "どう維持するか", body: "管理図、管理項目、頻度、担当、異常時の反応計画を決める" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "Gage R&R 学習ツール", href: "/tools/gage-rr", description: "部品差、繰返し性、再現性、%GRR、ndcを動かして理解する" },
            { label: "管理図 学習ツール", href: "/tools/control-chart", description: "Xbar-R・I-MRと異常ルールで、工程の時間変化を確認する" },
            { label: "Cp・Cpk計算・学習ツール", href: "/tools/cpk", description: "規格幅、平均、標準偏差と工程能力の関係を確認する" },
            { label: "実験計画法（DoE）学習ツール", href: "/tools/doe", description: "主効果、交互作用、ANOVA、残差、確認実験を順番に学ぶ" },
            { label: "品質管理・統計学習ツール一覧", href: "/tools", description: "測定から工程改善までの学習順序を見る" },
          ],
        },
      ],
      paragraphs: [
        "たとえばCpkが低いと分かっても、測定誤差が大きい、工程が時間とともに変化する、異なる製品や設備の分布が混ざる、といった状態では、指数だけを改善目標にできません。測定とデータの作られ方へ戻ります。",
        "逆に、管理図で特殊原因を取り除いた後も工程の自然なばらつきが規格に対して大きい場合は、共通原因へ働きかける工程設計や条件最適化が必要です。このときDoEは複数因子と交互作用を効率よく調べる候補になります。",
      ],
    },
    {
      id: "semiconductor-example",
      heading: "半導体製造の仮想例で、DMAICのつながりを見る",
      lead:
        "ここでは説明用に「ある検査工程の再検査率を下げる」という架空テーマを使います。実在企業、製品、工程条件を表すものではありません。",
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "D", title: "対象と目的を絞る", body: "再検査の定義、対象製品・工程、後工程への影響、期間、目標、除外範囲を決める" },
            { label: "M", title: "測り方と現状を固める", body: "判定基準、測定系、製品・装置・ロット・時間の記録方法をそろえ、基準値を作る" },
            { label: "A", title: "偏りと時間変化を調べる", body: "不良分類、装置、製品、材料、時間帯などで層別し、原因仮説を現物と追加データで確かめる" },
            { label: "I", title: "対策を小さく検証する", body: "安全・品質リスクを確認し、候補対策または工程条件を比較して、確認実験で再現性を見る" },
            { label: "C", title: "監視と反応を決める", body: "監視指標、頻度、管理限界、担当、異常時の確認順序、変更管理、引継ぎを定める" },
          ],
        },
        {
          type: "note",
          title: "時刻が一致しても、原因が証明されたとは限らない",
          body:
            "設備変更と再検査率の上昇が同時に起きれば重要な原因候補ですが、製品構成、材料、測定器、作業方法なども同時に変化している可能性があります。現物確認、再測定、追加データ、再現性で検証します。",
        },
      ],
      paragraphs: [
        "この例では「再検査率を下げる」という対策名から始めず、再検査が顧客・後工程へ与える影響と、何を1件と数えるかを定義します。分母、判定単位、重複検査の扱いが違えば、同じ工程でも基準値が変わります。",
        "また、改善後に平均値だけを比較して終わらせません。対象製品の構成、サンプル数、ばらつき、時間的な安定性を確認し、Controlでは異常時に誰が何を確認するかまで残します。",
      ],
    },
    {
      id: "comparison",
      heading: "PDCA・QCストーリー・リーンとは、目的と使い方を分ける",
      lead:
        "どれか一つだけが正しいわけではありません。組織の標準、問題の複雑さ、必要な検証水準に合わせます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "改善アプローチ",
          rightLabel: "この記事での位置づけ",
          rows: [
            { left: "DMAIC", right: "既存工程の複雑な問題を、定義・測定・原因検証・改善・維持へ分けるデータ重視の進め方" },
            { left: "PDCA・PDSA", right: "計画、実行、確認・学習、次の行動を反復する改善サイクル。日常管理からプロジェクトまで幅広く使う" },
            { left: "QCストーリー", right: "テーマ選定、現状把握、要因解析、対策、効果確認、標準化などを順序立てる問題解決の進め方" },
            { left: "リーン", right: "顧客価値を基準に、待ち、運搬、仕掛かり、手戻りなどのムダと流れを改善する考え方" },
            { left: "リーンシックスシグマ", right: "流れとムダへ注目するリーンと、ばらつき・欠陥・データ検証を重視するシックスシグマを組み合わせる" },
          ],
        },
      ],
      paragraphs: [
        "短い改善をすべて大規模なDMAICプロジェクトにする必要はありません。原因が明確で、リスクが低く、効果をすぐ確認できる課題は日常改善で進められます。一方、部門をまたぐ、原因候補が多い、測定が不確か、失敗コストが高い課題では、DMAICの区切りが役立ちます。",
        "名称より重要なのは、問題と目標を定義し、現状と原因を混同せず、対策を検証し、改善後の維持方法を決めることです。社内・顧客の標準手順がある場合は、その用語と承認プロセスを優先します。",
      ],
    },
    {
      id: "pitfalls",
      heading: "シックスシグマで避けたい5つの進め方",
      lead:
        "統計計算の誤りだけでなく、テーマ設定、測定、原因と対策の混同、維持管理の抜けが成果を不安定にします。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "01 / SCOPE", title: "問題を広くしすぎる", body: "「品質を上げる」では範囲も指標も決まりません。対象、影響、期間、目標、除外範囲を定義します。" },
            { label: "02 / DATA", title: "測定値を無条件に信じる", body: "測定方法、分解能、治具、判定基準、測定者、サンプリングを確認します。" },
            { label: "03 / CAUSE", title: "相関を原因と断定する", body: "時間の一致や相関は仮説です。工程知識、現物、追加データ、実験で確かめます。" },
            { label: "04 / METRIC", title: "Cpkだけを目標にする", body: "管理状態、分布、中心ずれ、測定系、規格の根拠を分けて確認します。" },
            { label: "05 / CONTROL", title: "改善して終了する", body: "監視項目、頻度、担当、異常時の反応、標準、変更管理を工程へ引き継ぎます。" },
            { label: "06 / TOOLS", title: "全ツールを使おうとする", body: "問いに答えない図表や検定を増やさず、判断に必要な最小限の手法を選びます。" },
          ],
        },
      ],
      paragraphs: [
        "シックスシグマは、計算結果が自動的に原因や対策を教える仕組みではありません。工程を知る人、測定を知る人、解析を支援する人、変更を承認する人が、それぞれの知識を持ち寄る必要があります。",
        "また、統計的に差があることと、工程上意味のある改善であることは別です。効果量、品質リスク、コスト、処理能力、安全、保全性、他特性への影響を含めて対策を選びます。",
      ],
    },
    {
      id: "faq",
      heading: "シックスシグマでよくある質問",
      lead:
        "最初に混同しやすい数字、DMAIC、資格、適用範囲を整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            {
              question: "シックスシグマとは簡単にいうと何ですか？",
              answer:
                "顧客にとって重要な問題を定義し、信頼できるデータで原因を確認し、改善後の状態を維持するための体系です。既存工程の改善ではDMAICが代表的な進め方です。",
            },
            {
              question: "6σは必ず3.4 DPMOを意味しますか？",
              answer:
                "必ずではありません。一般的な3.4 DPMOの説明には、短期6σの性能から長期に1.5σの中心シフトを仮定する慣例が含まれます。実際の欠陥水準は分布、中心ずれ、期間、欠陥機会の定義で変わります。",
            },
            {
              question: "DMAICとは何の略ですか？",
              answer:
                "Define（定義）、Measure（測定）、Analyze（分析）、Improve（改善）、Control（管理）の頭文字です。既存プロセスの問題を段階的に改善するために使います。",
            },
            {
              question: "シックスシグマとCp・Cpkは同じですか？",
              answer:
                "同じではありません。Cp・Cpkは規格幅、平均、標準偏差から工程能力を見る指標です。シックスシグマは、問題定義、測定、原因分析、改善、維持を含む広い改善体系です。",
            },
            {
              question: "管理図とCp・Cpkはどちらを先に見ますか？",
              answer:
                "一般には、測定系と工程の時間的な安定性を確認してから工程能力を評価します。工程が不安定な場合、単一のCp・Cpkだけでは将来の状態を説明しにくいためです。",
            },
            {
              question: "シックスシグマには資格が必要ですか？",
              answer:
                "社内改善へ考え方を使うだけなら、必ずしも外部資格が必要とは限りません。組織によってYellow Belt、Green Belt、Black Beltなどの役割・教育制度がありますが、必要条件と名称は制度ごとに確認します。",
            },
            {
              question: "半導体製造以外にも使えますか？",
              answer:
                "はい。定義、測定、分析、改善、管理できる製造・サービス・業務プロセスに適用できます。ただし、品質特性、データ、リスク、承認方法は対象ごとに設計します。",
            },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜DMAICの問いから、必要な技術を一つずつ選ぶ",
      lead:
        "シックスシグマの全体像が分かると、Gage R&R、管理図、Cp・Cpk、DoEが別々の統計手法ではなく、一つの改善判断としてつながります。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "DEFINE", title: "問題と顧客要求を先に決める", body: "測りやすい数字からではなく、誰が何に困っているかを測定可能な目標へ変える。" },
            { label: "VERIFY", title: "測定・原因・対策を検証する", body: "信頼できるデータを作り、事実と仮説を分け、小さく試して再現性を見る。" },
            { label: "SUSTAIN", title: "改善後の反応まで設計する", body: "管理項目と異常時の行動を決め、工程の担当者へ維持方法を引き継ぐ。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "品質管理・統計学習ツール", href: "/tools", description: "測定、工程管理、能力評価、条件最適化を順番に動かして学ぶ" },
            { label: "半導体の検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "欠陥・CD・膜厚・重ね合わせを工程へ戻す流れを見る" },
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "設計から前工程・後工程まで、改善対象となる工程のつながりを見る" },
            { label: "品質エンジニアへのルート", href: "/guides/quality-engineer-route", description: "品質改善・不良解析の経験を半導体の品質職へ接続する視点を整理する" },
          ],
        },
      ],
      paragraphs: [
        "最初の一歩は、自分の課題がDMAICのどこにあるかを決めることです。測定値を信頼できないならGage R&R、時間変化を確認したいなら管理図、規格への余裕を見たいならCp・Cpk、複数因子の条件を調べたいならDoEへ進みます。",
        "個別技術の記事は、この全体図から一つの問いを切り出して追加します。親記事へ戻れば、今学んでいる技術が改善プロジェクトのどこで使われるかを確認できます。",
      ],
    },
  ],
  todayQuest:
    "身近な改善テーマを一つ選び、「誰が困っているか」「現状を何で測るか」「改善後をどう維持するか」を一文ずつ書く",
  relatedGuideSlugs: [
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "quality-engineer-route",
    "production-engineering-to-semiconductor-process-engineer",
  ],
  relatedCompanyIds: [],
};
