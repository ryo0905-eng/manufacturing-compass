export type CompassOption = {
  id: string;
  label: string;
  description: string;
};

export type CompassProfile = {
  id: string;
  title: string;
  summary: string;
  primarySegmentIds: string[];
  reachableCompanyIds: string[];
  stretchCompanyIds: string[];
  strengths: string[];
  preparationPoints: string[];
  actionsNow: string[];
  actionsSixMonths: string[];
  agentTalkTrack: string;
};

export const backgroundOptions: CompassOption[] = [
  { id: "quality", label: "品質保証", description: "不良解析、監査、顧客品質、工程品質" },
  { id: "production", label: "生産技術", description: "工程改善、量産立ち上げ、歩留まり改善" },
  { id: "equipment", label: "設備保全", description: "装置トラブル、保全、改善、立ち上げ" },
  { id: "mechanical", label: "機械・電気設計", description: "装置、制御、回路、産業機械" },
  { id: "sales-fae", label: "技術営業・FAE", description: "顧客対応、製品説明、評価、提案" },
  { id: "beginner", label: "半導体未経験", description: "製造業経験はあるが、半導体はこれから" },
];

export const experienceOptions: CompassOption[] = [
  { id: "early", label: "1〜3年", description: "基礎経験を積み始めた段階" },
  { id: "middle", label: "4〜8年", description: "実務の主担当経験がある段階" },
  { id: "senior", label: "9年以上", description: "改善、育成、横断調整の経験がある段階" },
];

export const englishOptions: CompassOption[] = [
  { id: "low", label: "これから", description: "読み書きから準備したい" },
  { id: "middle", label: "業務で少し", description: "メール、資料、短い会話は対応できる" },
  { id: "high", label: "グローバル対応可", description: "会議、技術説明、交渉に使える" },
];

export const goalOptions: CompassOption[] = [
  { id: "entry", label: "まず半導体へ入る", description: "近い職種から現実的に移りたい" },
  { id: "global", label: "外資・グローバル", description: "英語を使う環境へ広げたい" },
  { id: "specialist", label: "技術専門性", description: "プロセス、装置、品質を深めたい" },
  { id: "income", label: "年収アップ", description: "市場価値の高い領域へ寄せたい" },
];

export const compassProfiles: Record<string, CompassProfile> = {
  quality: {
    id: "quality",
    title: "品質保証から半導体品質・プロセスへ近づくルート",
    summary: "不良解析や工程品質の経験は、メモリ、ファウンドリ、製造装置の品質職と相性があります。",
    primarySegmentIds: ["memory", "foundry", "equipment"],
    reachableCompanyIds: ["micron", "tokyo-electron"],
    stretchCompanyIds: ["tsmc", "skyworks"],
    strengths: ["不具合を切り分ける力", "顧客・製造・設計の間をつなぐ経験", "改善を定量で語れる可能性"],
    preparationPoints: ["半導体の主要工程", "SPC・歩留まりの基礎", "英語での品質説明"],
    actionsNow: ["品質改善の成果を数値で3つ書き出す", "不良解析の流れを職務経歴書用に整理する", "半導体工程の全体像を1枚で説明できるようにする"],
    actionsSixMonths: ["QC/統計の弱点を補う", "半導体品質・プロセス職の求人票を10件読む", "英語で不具合報告を説明する練習をする"],
    agentTalkTrack: "品質保証経験を半導体品質職・プロセス職へどう接続できるか相談する",
  },
  production: {
    id: "production",
    title: "生産技術からプロセスエンジニアへ近づくルート",
    summary: "工程改善、量産立ち上げ、歩留まり改善の経験は、半導体量産現場で評価されやすい土台です。",
    primarySegmentIds: ["foundry", "memory", "equipment"],
    reachableCompanyIds: ["tsmc", "micron", "tokyo-electron"],
    stretchCompanyIds: ["skyworks"],
    strengths: ["工程を数字で改善する力", "現場を巻き込む調整力", "量産の制約を理解していること"],
    preparationPoints: ["半導体前工程の基礎", "歩留まり・ばらつき改善", "設備・材料との関係理解"],
    actionsNow: ["改善テーマ、改善前後、効果額を整理する", "プロセスエンジニア求人の必須要件を抽出する", "統計・データ解析の棚卸しをする"],
    actionsSixMonths: ["SPCやDOEを学ぶ", "半導体製造装置の基本を理解する", "英語で工程改善を説明できるようにする"],
    agentTalkTrack: "生産技術経験で狙えるプロセス職と、半年後に広がる選択肢を相談する",
  },
  equipment: {
    id: "equipment",
    title: "設備保全から装置・フィールドエンジニアへ近づくルート",
    summary: "装置トラブル対応や保全経験は、半導体製造装置メーカーや工場側の設備職に接続しやすい経験です。",
    primarySegmentIds: ["equipment", "foundry"],
    reachableCompanyIds: ["tokyo-electron", "tsmc"],
    stretchCompanyIds: ["micron"],
    strengths: ["装置の異常を現場で切り分ける力", "稼働率や停止時間への意識", "現場対応の粘り強さ"],
    preparationPoints: ["真空・プラズマ・洗浄など装置基礎", "顧客対応エピソード", "英語マニュアルへの慣れ"],
    actionsNow: ["対応した装置、故障内容、改善結果を整理する", "半導体製造装置メーカーの職種を確認する", "電気・機械・制御の強みを分ける"],
    actionsSixMonths: ["装置工程の基礎を学ぶ", "顧客先対応の説明を準備する", "英語の技術用語を覚える"],
    agentTalkTrack: "設備保全経験を装置メーカー・半導体工場のどちらへ寄せるべきか相談する",
  },
  mechanical: {
    id: "mechanical",
    title: "設計経験から半導体製造装置へ近づくルート",
    summary: "機械、電気、制御設計の経験は、製造装置メーカーで活かしやすい入口です。",
    primarySegmentIds: ["equipment"],
    reachableCompanyIds: ["tokyo-electron"],
    stretchCompanyIds: ["tsmc", "micron"],
    strengths: ["装置構造や制御を理解する力", "図面・仕様を扱う経験", "設計変更や品質対応の経験"],
    preparationPoints: ["半導体製造工程", "真空・熱・薬液・搬送の基礎", "顧客要求と量産制約の理解"],
    actionsNow: ["担当装置・機構・制御範囲を整理する", "半導体製造装置の工程別役割を学ぶ", "設計改善の成果を定量化する"],
    actionsSixMonths: ["装置メーカーの求人要件を比較する", "弱い技術領域を1つ補強する", "海外顧客対応を想定した英語表現を準備する"],
    agentTalkTrack: "設計経験を半導体製造装置メーカーでどう評価される形にするか相談する",
  },
  "sales-fae": {
    id: "sales-fae",
    title: "技術営業・FAEから外資系半導体へ近づくルート",
    summary: "顧客課題を技術で翻訳する経験は、ファブレス、アナログ、RF、半導体商社と相性があります。",
    primarySegmentIds: ["fabless"],
    reachableCompanyIds: ["skyworks"],
    stretchCompanyIds: ["micron", "tsmc"],
    strengths: ["顧客課題を聞き出す力", "技術とビジネスの橋渡し", "製品説明や評価サポートの経験"],
    preparationPoints: ["RF・アナログ・半導体基礎", "英語での技術説明", "顧客導入事例の整理"],
    actionsNow: ["顧客課題、提案、結果を3件整理する", "扱った製品と半導体領域の接点を洗い出す", "英語で製品説明を練習する"],
    actionsSixMonths: ["RFやアナログ回路の基礎を学ぶ", "外資系FAE求人の要件を確認する", "英語面接で顧客対応を説明できるようにする"],
    agentTalkTrack: "技術営業・FAE経験で外資系半導体を狙う現実的な順番を相談する",
  },
  beginner: {
    id: "beginner",
    title: "半導体未経験から近い入口を探すルート",
    summary: "いきなり目標企業だけを見るより、経験と近い職種・企業から半導体に入る方が現実的です。",
    primarySegmentIds: ["equipment", "foundry"],
    reachableCompanyIds: ["tokyo-electron"],
    stretchCompanyIds: ["tsmc", "micron", "skyworks"],
    strengths: ["製造業で培った改善経験", "現場理解", "品質・設備・設計など既存スキルの転用可能性"],
    preparationPoints: ["半導体業界地図", "近い職種の求人要件", "職務経歴の翻訳"],
    actionsNow: ["自分の経験を品質・生産技術・設備・設計・技術営業に分類する", "近い職種の求人を10件読む", "半導体用語を20個覚える"],
    actionsSixMonths: ["職種を1つに絞って実績を作る", "半導体企業の比較軸を理解する", "転職エージェントに現在地を相談する"],
    agentTalkTrack: "半導体未経験から最初に狙う職種と企業の順番を相談する",
  },
};
