export type CompassOption = {
  id: string;
  label: string;
  description: string;
};

export type MarketValueProfile = {
  id: string;
  title: string;
  shortLabel: string;
  summary: string;
  baseScore: number;
  salaryRangeCurrent: string;
  salaryRangePotential: string;
  primarySegmentIds: string[];
  reachableCompanyIds: string[];
  stretchCompanyIds: string[];
  reachableRoles: string[];
  growthLevers: string[];
  actionsToday: string[];
  roadmap30Days: string[];
  agentTalkTrack: string;
  englishTalkTrack: string;
};

export const backgroundOptions: CompassOption[] = [
  { id: "quality", label: "品質保証", description: "不良解析・工程品質" },
  { id: "production", label: "生産技術", description: "工程改善・量産立ち上げ" },
  { id: "equipment", label: "設備保全", description: "装置トラブル・保全改善" },
  { id: "mechanical", label: "設計", description: "機械・電気・制御" },
  { id: "sales-fae", label: "技術営業", description: "FAE・顧客技術対応" },
  { id: "beginner", label: "未経験", description: "製造業から半導体へ" },
];

export const experienceOptions: CompassOption[] = [
  { id: "early", label: "1〜3年", description: "実績を作る段階" },
  { id: "middle", label: "4〜8年", description: "主担当経験あり" },
  { id: "senior", label: "9年以上", description: "改善・育成・横断調整" },
];

export const englishOptions: CompassOption[] = [
  { id: "low", label: "これから", description: "読み書きから" },
  { id: "middle", label: "少し使う", description: "メール・資料" },
  { id: "high", label: "使える", description: "会議・技術説明" },
];

export const goalOptions: CompassOption[] = [
  { id: "entry", label: "半導体へ入る", description: "近い職種から" },
  { id: "global", label: "外資も狙う", description: "英語を活かす" },
  { id: "specialist", label: "専門性を伸ばす", description: "技術軸を作る" },
  { id: "income", label: "年収を上げる", description: "市場価値を上げる" },
];

export const exposureOptions: CompassOption[] = [
  { id: "none", label: "なし", description: "これから" },
  { id: "supplier", label: "周辺", description: "部品・材料・設備" },
  { id: "equipment", label: "装置", description: "装置・保全・立上げ" },
  { id: "fab", label: "工場", description: "量産・品質・工程" },
];

export const achievementOptions: CompassOption[] = [
  { id: "routine", label: "担当", description: "日常業務" },
  { id: "improvement", label: "改善", description: "数字で成果あり" },
  { id: "launch", label: "立上げ", description: "量産・導入経験" },
  { id: "lead", label: "主導", description: "横断・育成あり" },
];

export const analysisOptions: CompassOption[] = [
  { id: "none", label: "少ない", description: "これから" },
  { id: "qc", label: "QC", description: "品質・不良解析" },
  { id: "stats", label: "統計", description: "SPC・DOE" },
  { id: "data", label: "データ", description: "BI・Python等" },
];

export const marketValueProfiles: Record<string, MarketValueProfile> = {
  quality: {
    id: "quality",
    title: "品質保証を半導体品質・プロセスへ翻訳するタイプ",
    shortLabel: "品質改善型",
    summary: "不良解析や工程品質の経験は、半導体の品質職・プロセス職に接続しやすい土台です。",
    baseScore: 68,
    salaryRangeCurrent: "500〜700万円",
    salaryRangePotential: "650〜900万円",
    primarySegmentIds: ["memory", "foundry", "equipment"],
    reachableCompanyIds: ["micron", "tokyo-electron"],
    stretchCompanyIds: ["tsmc", "skyworks"],
    reachableRoles: ["品質保証", "プロセスエンジニア", "製品技術"],
    growthLevers: ["SPC・統計", "歩留まり改善", "英語での不具合説明"],
    actionsToday: ["品質改善の成果を3つ数値で書く", "不良解析の流れを1件整理する", "半導体工程を30分だけ学ぶ"],
    roadmap30Days: ["QC/統計の弱点を補う", "半導体品質職の求人を10件読む", "職務経歴書に改善前後の数字を入れる"],
    agentTalkTrack: "品質保証経験を半導体品質職・プロセス職へどう接続できるか相談する",
    englishTalkTrack: "外資系や顧客品質を狙うなら、英語で不具合報告を説明する練習が効きます。",
  },
  production: {
    id: "production",
    title: "生産技術をプロセスエンジニアへ伸ばすタイプ",
    shortLabel: "量産改善型",
    summary: "工程改善、量産立ち上げ、歩留まり改善は、半導体量産現場で評価されやすい経験です。",
    baseScore: 74,
    salaryRangeCurrent: "550〜750万円",
    salaryRangePotential: "700〜950万円",
    primarySegmentIds: ["foundry", "memory", "equipment"],
    reachableCompanyIds: ["tsmc", "micron", "tokyo-electron"],
    stretchCompanyIds: ["skyworks"],
    reachableRoles: ["プロセスエンジニア", "生産技術", "設備技術"],
    growthLevers: ["歩留まり改善", "DOE・SPC", "半導体前工程の理解"],
    actionsToday: ["改善テーマと効果額を1つ書く", "プロセス職の求人を3件読む", "統計・データ解析経験を棚卸しする"],
    roadmap30Days: ["SPC/DOEを学ぶ", "半導体前工程の流れを説明できるようにする", "英語で改善事例を短く説明する"],
    agentTalkTrack: "生産技術経験で狙えるプロセス職と、半年後に広がる選択肢を相談する",
    englishTalkTrack: "外資系やグローバル工場を狙うなら、工程改善を英語で説明できることが年収レンジに効きます。",
  },
  equipment: {
    id: "equipment",
    title: "設備保全を装置・フィールド職へ伸ばすタイプ",
    shortLabel: "装置対応型",
    summary: "装置トラブル対応や保全改善は、半導体製造装置メーカーや工場側の設備職と相性があります。",
    baseScore: 70,
    salaryRangeCurrent: "500〜720万円",
    salaryRangePotential: "650〜900万円",
    primarySegmentIds: ["equipment", "foundry"],
    reachableCompanyIds: ["tokyo-electron", "tsmc"],
    stretchCompanyIds: ["micron"],
    reachableRoles: ["フィールドエンジニア", "設備エンジニア", "装置立ち上げ"],
    growthLevers: ["装置トラブルの再現性", "顧客対応", "英語マニュアル読解"],
    actionsToday: ["担当装置と故障対応を3件書く", "停止時間を短縮した実績を整理する", "装置メーカーの求人を3件読む"],
    roadmap30Days: ["真空・プラズマ・洗浄の基礎を学ぶ", "顧客対応エピソードを整理する", "英語の技術用語を覚える"],
    agentTalkTrack: "設備保全経験を装置メーカー・半導体工場のどちらへ寄せるべきか相談する",
    englishTalkTrack: "海外顧客や外資装置メーカーを狙うなら、英語マニュアルと技術説明に慣れるのが近道です。",
  },
  mechanical: {
    id: "mechanical",
    title: "設計経験を半導体製造装置へ接続するタイプ",
    shortLabel: "装置設計型",
    summary: "機械・電気・制御の設計経験は、製造装置メーカーで市場価値に変換しやすい経験です。",
    baseScore: 66,
    salaryRangeCurrent: "500〜700万円",
    salaryRangePotential: "650〜850万円",
    primarySegmentIds: ["equipment"],
    reachableCompanyIds: ["tokyo-electron"],
    stretchCompanyIds: ["tsmc", "micron"],
    reachableRoles: ["装置開発", "電気設計", "制御設計"],
    growthLevers: ["半導体工程理解", "真空・熱・薬液の基礎", "設計改善の定量化"],
    actionsToday: ["担当した装置・機構・制御範囲を書く", "設計改善の成果を1つ数値化する", "製造装置の工程別役割を調べる"],
    roadmap30Days: ["装置メーカーの求人要件を比較する", "弱い技術領域を1つ補う", "海外顧客対応の英語表現を準備する"],
    agentTalkTrack: "設計経験を半導体製造装置メーカーでどう評価される形にするか相談する",
    englishTalkTrack: "海外顧客向け装置や外資系を狙うなら、設計意図を英語で説明する準備が効きます。",
  },
  "sales-fae": {
    id: "sales-fae",
    title: "技術営業・FAEを外資系半導体へ伸ばすタイプ",
    shortLabel: "顧客技術型",
    summary: "顧客課題を技術で翻訳する経験は、ファブレス、アナログ、RF、半導体商社と相性があります。",
    baseScore: 72,
    salaryRangeCurrent: "550〜800万円",
    salaryRangePotential: "750〜1100万円",
    primarySegmentIds: ["fabless"],
    reachableCompanyIds: ["skyworks"],
    stretchCompanyIds: ["micron", "tsmc"],
    reachableRoles: ["FAE", "アプリケーションエンジニア", "営業技術"],
    growthLevers: ["英語での顧客対応", "RF・アナログ基礎", "導入事例の言語化"],
    actionsToday: ["顧客課題と提案結果を3件書く", "扱った製品と半導体の接点を整理する", "英語で製品説明を1分で作る"],
    roadmap30Days: ["RF/アナログの基礎を学ぶ", "外資系FAE求人を10件読む", "英語面接で顧客対応を説明する"],
    agentTalkTrack: "技術営業・FAE経験で外資系半導体を狙う現実的な順番を相談する",
    englishTalkTrack: "このタイプは英語が市場価値に直結しやすいです。技術説明と顧客対応の練習から始めましょう。",
  },
  beginner: {
    id: "beginner",
    title: "半導体未経験から入口を作るタイプ",
    shortLabel: "入口探索型",
    summary: "いきなり目標企業だけを見るより、経験に近い職種から半導体に入る方が現実的です。",
    baseScore: 52,
    salaryRangeCurrent: "400〜600万円",
    salaryRangePotential: "550〜750万円",
    primarySegmentIds: ["equipment", "foundry"],
    reachableCompanyIds: ["tokyo-electron"],
    stretchCompanyIds: ["tsmc", "micron", "skyworks"],
    reachableRoles: ["品質保証", "設備エンジニア", "フィールドエンジニア"],
    growthLevers: ["職種の絞り込み", "半導体基礎", "実績の翻訳"],
    actionsToday: ["経験を品質・生産技術・設備・設計・技術営業に分類する", "近い職種の求人を5件読む", "半導体用語を10個覚える"],
    roadmap30Days: ["職種を1つに絞る", "職務経歴を半導体向けに翻訳する", "転職エージェントに現在地を相談する"],
    agentTalkTrack: "半導体未経験から最初に狙う職種と企業の順番を相談する",
    englishTalkTrack: "英語は後回しにしすぎず、まず求人票と技術用語を読める状態を作ると選択肢が広がります。",
  },
};
