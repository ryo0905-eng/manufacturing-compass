import type { GuideArticle } from "@/content/guides/types";

export const sixSigmaGuide: GuideArticle = {
  slug: "six-sigma",
  title: "シックスシグマとは？DMAICと品質改善ツールの全体像を図解",
  description:
    "シックスシグマとは何かを、DMAICの流れと6σの意味から図解します。Gage R&R、管理図、Cp・Cpk、実験計画法をいつ使うかも整理します。",
  targetQuery: "シックスシグマ とは",
  searchIntent:
    "シックスシグマとは何か、6σと3.4 DPMOの意味、DMAICの進め方、各段階で使う品質管理手法を初心者向けに理解したい",
  status: "published",
  category: "technology",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "ISO、ASQ、NIST、Minitabの公開情報で定義と計算上の前提を照合しました。特定企業の制度や社内判定基準ではなく、製造現場で改善手法を選ぶための全体像を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "ISO 13053-1とASQの公開情報から、シックスシグマとDMAICの範囲を整理",
    "NISTとMinitabの解説から、標準偏差、工程能力、3.4 DPMOの前提を確認",
    "Gage R&R、管理図、Cp・Cpk、DoEの学習ツールを、改善で使う順番へ接続",
  ],
  publishedAt: "2026-07-28",
  updatedAt: "2026-07-28",
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
      title: "Z.bench as an estimate of sigma capability",
      url: "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/supporting-topics/capability-metrics/z-bench-as-an-estimate-of-sigma-capability/",
      publisher: "Minitab",
      accessedAt: "2026-07-27",
    },
  ],
  readTime: "約9分",
  intro: {
    problem:
      "シックスシグマを調べると、3.4 DPMO、DMAIC、ベルト制度、統計手法が一度に出てきます。言葉を追うほど、全体像が見えにくくなりがちです。",
    conclusion:
      "シックスシグマは、一つの統計手法ではありません。改善する問題を決め、データで原因を確かめ、効果を維持するまでの進め方です。",
    learnings:
      "シックスシグマの意味、DMAICの5段階、6σと3.4 DPMOの注意点、Gage R&R・管理図・Cp/Cpk・DoEを使う順番。",
  },
  overviewBlocks: [
    {
      type: "process-flow",
      title: "まずはDMAICの5段階だけ押さえる",
      description:
        "既存工程を改善するときの基本的な流れです。手法の名前より、各段階で何を決めるかを見ると理解しやすくなります。",
      stages: [
        { label: "D / DEFINE", title: "何を改善するか決める", body: "困っていること、対象範囲、指標、目標をそろえる" },
        { label: "M / MEASURE", title: "今の状態を測る", body: "測り方を確認し、比較に使える現状データを集める" },
        { label: "A / ANALYZE", title: "原因を絞る", body: "結果に効きそうな要因を分け、データと現物で確かめる" },
        { label: "I / IMPROVE", title: "対策を試す", body: "候補を比較し、小さく試して効果と副作用を見る" },
        { label: "C / CONTROL", title: "元に戻らないようにする", body: "監視方法と、異常が出たときの動きを決める" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "シックスシグマは、難しい統計手法の名前ではない",
      lead:
        "最初に押さえたいのは、シックスシグマが一つの計算方法ではない、ということです。",
      paragraphs: [
        "シックスシグマは、工程や仕事のばらつきを減らし、狙った結果を安定して出すための改善体系です。顧客や後工程が困っていることを決め、現状を測り、原因を確かめ、対策後も状態が続くように管理します。",
        "その中心にあるのがDMAICです。Define、Measure、Analyze、Improve、Controlの頭文字で、既存工程の問題を順番に解いていきます。ISO 13053-1でも、この5段階がシックスシグマの代表的な方法として整理されています。",
        "Gage R&R、管理図、Cp・Cpk、実験計画法などは、DMAICの中で使う道具です。全部使う必要はありません。今どの段階で、何を確かめたいのかによって選びます。",
      ],
    },
    {
      id: "dmaic",
      heading: "DMAICでは、いきなり対策から始めない",
      lead:
        "現場では原因の見当がついていることもあります。それでも、問題と現状を確認せずに条件を変えると、効いた理由が分からなくなります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "段階",
          rightLabel: "ここで決めること",
          rows: [
            { left: "Define｜定義", right: "誰が何に困っているか。どの工程・製品・期間を対象にし、何を目標にするか" },
            { left: "Measure｜測定", right: "測定値を信頼できるか。何を1件と数え、現在どの程度起きているか" },
            { left: "Analyze｜分析", right: "製品、設備、材料、方法、時間など、どの違いが結果と結び付いているか" },
            { left: "Improve｜改善", right: "どの対策が効くか。他の品質や安全、処理能力へ悪影響がないか" },
            { left: "Control｜管理", right: "誰が何を監視し、異常が出たらどこまで戻って確認するか" },
          ],
        },
      ],
      paragraphs: [
        "たとえば不良率が上がったとき、すぐに装置条件を変えるのがImproveです。その前に、不良の定義がそろっているか、測定方法が変わっていないか、特定の製品や時間帯へ偏っていないかを確認します。",
        "Analyzeまで進んでも原因が見えなければ、Measureへ戻ってデータを取り直します。DMAICは一方通行ではありません。ただし、原因を確かめないまま対策だけを繰り返す状態は避けます。",
      ],
    },
    {
      id: "six-sigma-level",
      heading: "6σは、規格までの余裕を標準偏差で見る考え方",
      lead:
        "σ（シグマ）は標準偏差を表します。測定値が平均の周りにどの程度散らばっているかを見る数字です。",
      blocks: [
        {
          type: "sigma-distribution-comparison",
          title: "規格に対する分布を3つの状態で比べる",
          description:
            "曲線は考え方を示す模式図です。実際の工程能力は、時系列、測定方法、分布の形を確認してから評価します。",
          scenarios: [
            {
              kind: "wide",
              label: "ばらつき",
              title: "中心は合うが、散らばりが大きい",
              body: "平均は目標付近でも、規格端へ近い測定値が増えています。",
              insight: "ばらつきを生む条件を分けて見る",
            },
            {
              kind: "shifted",
              label: "中心ずれ",
              title: "まとまっているが、中心がずれる",
              body: "散らばりは小さくても、上限側の余裕が少なくなっています。",
              insight: "設定値や時間変化を確認する",
            },
            {
              kind: "capable",
              label: "工程能力",
              title: "散らばりが小さく、中心も合う",
              body: "両側の規格まで余裕があります。安定性は時系列で別に見ます。",
              insight: "管理図で状態を維持する",
            },
          ],
        },
        {
          type: "note",
          title: "6σ＝必ず3.4 DPMO、ではない",
          body:
            "よく示される3.4 DPMOは、短期的に6σの余裕がある工程について、長期では平均が1.5σ動くと仮定した値です。実際の欠陥率は、分布、中心ずれ、期間、欠陥機会の数え方で変わります。",
        },
      ],
      paragraphs: [
        "Cpは、工程の広がりに対して規格幅がどれくらいあるかを見ます。Cpkは、そこへ中心ずれも加えた指標です。平均が規格の中央から外れると、Cpが高くてもCpkは低くなります。",
        "ただし、Cpkだけを見ても工程が安定しているかは分かりません。規格限界は製品の要求、管理限界は工程の時系列データから決まります。この二つは別のものです。",
      ],
    },
    {
      id: "tool-selection",
      heading: "何を調べたいかで、使うツールは変わる",
      lead:
        "品質データが手元にあっても、最初からCpkを計算すればよいとは限りません。",
      blocks: [
        {
          type: "process-flow",
          title: "測定から条件改善までの順番",
          description:
            "前の確認が十分なら、必要なところから始めて構いません。迷ったときの基本順序として使ってください。",
          stages: [
            { label: "01", title: "測定値を信頼できるか", body: "Gage R&Rで部品差と測定誤差を分ける" },
            { label: "02", title: "工程は安定しているか", body: "管理図で時間変化と特殊原因を見る" },
            { label: "03", title: "規格まで余裕があるか", body: "Cp・Cpk、Pp・Ppkで工程能力を見る" },
            { label: "04", title: "どの条件が効くか", body: "層別やDoEで原因と改善条件を確かめる" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "Gage R&R 学習ツール", href: "/tools/gage-rr", description: "同じものを測っても値が散る理由を確認する" },
            { label: "管理図 学習ツール", href: "/tools/control-chart", description: "工程の平均シフト、外れ、傾向を時系列で見る" },
            { label: "Cp・Cpk計算・学習ツール", href: "/tools/cpk", description: "平均、ばらつき、規格幅の関係を確認する" },
            { label: "実験計画法（DoE）学習ツール", href: "/tools/doe", description: "複数因子と交互作用を動かして学ぶ" },
          ],
        },
      ],
      paragraphs: [
        "測定誤差が大きければ、工程の差に見えていたものが測り方の差かもしれません。工程が時間とともに動いていれば、一つのCpkで将来の状態を説明するのも難しくなります。",
        "測定系と安定性を確認して、それでも規格に対するばらつきが大きいなら、工程そのものへ手を入れます。因子が多く、一つずつ条件を変えても関係が見えにくいときは、DoEが候補になります。",
      ],
    },
    {
      id: "semiconductor-example",
      heading: "半導体の検査工程なら、どう進めるか",
      lead:
        "説明用に、ある検査工程で再検査が増えた場面を考えます。実在の製品や工程条件を示すものではありません。",
      paragraphs: [
        "最初に決めるのは対策ではなく、再検査を何と数えるかです。同じ対象を二度測ったら1件なのか、判定をやり直した回数なのか。対象製品と期間もそろえます。ここがDefineです。",
        "次に、判定方法や測定装置が途中で変わっていないかを確認します。製品、装置、材料、時間帯などで分けてみると、全体では見えなかった偏りが出ることがあります。時刻が一致しただけでは原因と決めず、現物や追加データで確かめます。",
        "対策後は、平均の再検査率が下がったかだけで終わりません。製品構成が変わっていないか、効果が続いているかを見ます。最後に監視する数字、確認頻度、異常時の動きを決めて、ようやくControlまでつながります。",
      ],
    },
    {
      id: "comparison",
      heading: "PDCAやリーンと、きれいに分ける必要はない",
      lead:
        "改善手法は競わせるものではなく、課題に合わせて使い分けます。",
      paragraphs: [
        "PDCAは、計画して試し、結果を確認して次へつなぐ広い改善サイクルです。DMAICはその中でも、問題の定義、測定の信頼性、原因の検証を細かく区切っています。原因候補が多い課題や、失敗したときの影響が大きい課題で使いやすい進め方です。",
        "リーンは、待ち、運搬、仕掛かり、手戻りなどのムダと流れに注目します。シックスシグマは、ばらつきや欠陥をデータで追います。両方を組み合わせたものがリーンシックスシグマです。",
        "小さな不具合まで、すべて大規模なDMAICプロジェクトにする必要はありません。原因が明らかで安全に戻せる改善なら、短く試して確認する方が現実的です。",
      ],
    },
    {
      id: "pitfalls",
      heading: "数字が出ても、原因が分かったとは限らない",
      lead:
        "シックスシグマで読み違えやすい点を、最後にまとめます。",
      paragraphs: [
        "相関があること、発生時刻が近いこと、統計的な差が出たことは、原因を考える材料になります。ただし、それだけで原因が証明されたわけではありません。工程の仕組み、現物、再現性を一緒に見ます。",
        "また、統計的には差があっても、工程上ほとんど意味のない差かもしれません。品質への影響だけでなく、安全、コスト、処理能力、保全性、他の特性への影響まで見て対策を選びます。",
      ],
      points: [
        "問題を「品質を上げる」のような広い言葉で始めない",
        "測定方法とサンプリングを確認せず、数字だけを比べない",
        "Cpkだけを改善目標にしない",
        "対策後の監視方法と異常時の動きを残す",
      ],
    },
    {
      id: "faq",
      heading: "シックスシグマでよくある質問",
      paragraphs: [],
      blocks: [
        {
          type: "faq",
          items: [
            {
              question: "シックスシグマとは簡単にいうと何ですか？",
              answer:
                "改善する問題を決め、信頼できるデータで原因を確かめ、対策後の状態を維持するための進め方です。既存工程の改善ではDMAICがよく使われます。",
            },
            {
              question: "6σは必ず3.4 DPMOを意味しますか？",
              answer:
                "必ずではありません。3.4 DPMOという値には、長期に平均が1.5σ動くという仮定が含まれます。実際の欠陥率は分布や中心ずれ、欠陥機会の定義で変わります。",
            },
            {
              question: "シックスシグマとCp・Cpkは同じですか？",
              answer:
                "同じではありません。Cp・Cpkは規格に対する工程能力を見る指標です。シックスシグマは、問題の定義から原因分析、改善、維持までを含みます。",
            },
            {
              question: "管理図とCp・Cpkはどちらを先に見ますか？",
              answer:
                "一般には、測定系と工程の時間的な安定性を確認してから工程能力を見ます。工程が不安定なときは、一つのCp・Cpkだけで将来の状態を判断しにくいためです。",
            },
            {
              question: "シックスシグマには資格が必要ですか？",
              answer:
                "考え方やDMAICを使うだけなら、必ずしも外部資格は必要ありません。Yellow Belt、Green Belt、Black Beltなどの役割や要件は、組織・認定制度ごとに異なります。",
            },
          ],
        },
      ],
    },
    {
      id: "summary",
      heading: "まず、自分がDMAICのどこで止まっているかを見る",
      lead:
        "手法を一つずつ覚えるより、今の課題で何が分かっていないかを考える方が、次に学ぶ内容を選びやすくなります。",
      blocks: [
        {
          type: "links",
          items: [
            { label: "品質管理・統計学習ツール", href: "/tools", description: "測定、安定性、工程能力、条件改善を順番に学ぶ" },
            { label: "半導体の検査・計測", href: "/guides/semiconductor-inspection-metrology", description: "測定結果を工程へ戻す流れを見る" },
            { label: "半導体製造工程の全体像", href: "/guides/semiconductor-manufacturing-process", description: "改善対象となる工程の前後関係を見る" },
          ],
        },
      ],
      paragraphs: [
        "測定値を信頼できないならGage R&R、時間変化を見たいなら管理図、規格への余裕を見たいならCp・Cpk、複数の条件を比べたいならDoEへ進みます。シックスシグマは、その順番をつなぐ地図として考えると分かりやすくなります。",
      ],
    },
  ],
  todayQuest:
    "身近な改善テーマを一つ選び、「何が困るのか」「今は何で測っているか」「改善後を何で確認するか」を一文ずつ書く",
  relatedGuideSlugs: [
    "semiconductor-inspection-metrology",
    "semiconductor-manufacturing-process",
    "quality-engineer-route",
  ],
  relatedCompanyIds: [],
};
