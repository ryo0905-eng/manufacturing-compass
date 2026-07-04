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
  resumeSignals: string[];
  actionsToday: string[];
  roadmap30Days: string[];
  roadmap90Days: string;
  roadmap6Months: string;
  agentTalkTrack: string;
  englishTalkTrack: string;
};

export const backgroundOptions: CompassOption[] = [
  { id: "quality", label: "品質保証", description: "不良解析・工程監査" },
  { id: "production", label: "生産技術", description: "立上げ・歩留まり改善" },
  { id: "equipment", label: "設備保全", description: "停止時間・再発防止" },
  { id: "mechanical", label: "設計", description: "装置・電気・制御" },
  { id: "sales-fae", label: "技術営業", description: "顧客課題・技術提案" },
  { id: "beginner", label: "近い経験なし", description: "製造業から探索" },
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
  { id: "none", label: "これから", description: "求人票を読み始める" },
  { id: "supplier", label: "周辺あり", description: "部品・材料・設備" },
  { id: "equipment", label: "装置あり", description: "保全・立上げ・調整" },
  { id: "fab", label: "工場あり", description: "量産・品質・工程" },
];

export const achievementOptions: CompassOption[] = [
  { id: "routine", label: "運用担当", description: "日常業務を安定化" },
  { id: "improvement", label: "改善実績", description: "不良率・時間を改善" },
  { id: "launch", label: "立上げ経験", description: "導入・移管・量産化" },
  { id: "lead", label: "主導経験", description: "横断・育成・標準化" },
];

export const analysisOptions: CompassOption[] = [
  { id: "none", label: "少ない", description: "これから" },
  { id: "qc", label: "QC", description: "品質・不良解析" },
  { id: "stats", label: "統計", description: "SPC・DOE" },
  { id: "data", label: "データ", description: "BI・Python等" },
];

export const impactOptions: CompassOption[] = [
  { id: "none", label: "未整理", description: "まだ曖昧" },
  { id: "story", label: "事例あり", description: "背景から説明できる" },
  { id: "number", label: "数字あり", description: "率・件数・時間あり" },
  { id: "money", label: "効果額あり", description: "原価・損失を改善" },
];

export const scopeOptions: CompassOption[] = [
  { id: "solo", label: "個人", description: "自分の担当" },
  { id: "team", label: "チーム", description: "周囲と改善" },
  { id: "cross", label: "横断", description: "部門をまたぐ" },
  { id: "customer", label: "顧客", description: "社外対応あり" },
];

export const learningOptions: CompassOption[] = [
  { id: "zero", label: "まだ未定", description: "まず方向を決めたい" },
  { id: "one", label: "週1h", description: "求人を読む時間あり" },
  { id: "three", label: "週3h", description: "学習と棚卸し可" },
  { id: "daily", label: "毎日", description: "短期で仕上げたい" },
];

export const currentSalaryOptions: CompassOption[] = [
  { id: "skip", label: "入力しない", description: "あとで見る" },
  { id: "under400", label: "〜400万", description: "現在年収" },
  { id: "400-500", label: "400〜500万", description: "現在年収" },
  { id: "500-600", label: "500〜600万", description: "現在年収" },
  { id: "600-700", label: "600〜700万", description: "現在年収" },
  { id: "700-800", label: "700〜800万", description: "現在年収" },
  { id: "over800", label: "800万〜", description: "現在年収" },
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
    resumeSignals: ["不良モード", "暫定対策", "恒久対策", "再発防止率"],
    actionsToday: ["品質改善の成果を3つ数値で書く", "不良解析の流れを1件整理する", "半導体工程を30分だけ学ぶ"],
    roadmap30Days: ["QC/統計の弱点を補う", "半導体品質職の求人を10件読む", "職務経歴書に改善前後の数字を入れる"],
    roadmap90Days: "SPCと不良解析を職務経歴書の主軸にする",
    roadmap6Months: "品質保証からプロセス・製品技術へ応募軸を広げる",
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
    resumeSignals: ["改善前後", "歩留まり", "タクト", "効果額"],
    actionsToday: ["改善テーマと効果額を1つ書く", "プロセス職の求人を3件読む", "統計・データ解析経験を棚卸しする"],
    roadmap30Days: ["SPC/DOEを学ぶ", "半導体前工程の流れを説明できるようにする", "英語で改善事例を短く説明する"],
    roadmap90Days: "工程改善をプロセスエンジニア向けに言い換える",
    roadmap6Months: "量産改善の実績で工場側と装置側の両方を狙う",
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
    resumeSignals: ["停止時間", "故障頻度", "原因切り分け", "復旧手順"],
    actionsToday: ["担当装置と故障対応を3件書く", "停止時間を短縮した実績を整理する", "装置メーカーの求人を3件読む"],
    roadmap30Days: ["真空・プラズマ・洗浄の基礎を学ぶ", "顧客対応エピソードを整理する", "英語の技術用語を覚える"],
    roadmap90Days: "装置トラブル対応をフィールド職向けに整理する",
    roadmap6Months: "装置メーカーと半導体工場の両ルートを比較する",
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
    resumeSignals: ["設計範囲", "制約条件", "改善理由", "評価結果"],
    actionsToday: ["担当した装置・機構・制御範囲を書く", "設計改善の成果を1つ数値化する", "製造装置の工程別役割を調べる"],
    roadmap30Days: ["装置メーカーの求人要件を比較する", "弱い技術領域を1つ補う", "海外顧客対応の英語表現を準備する"],
    roadmap90Days: "設計経験を半導体製造装置の要求仕様に寄せる",
    roadmap6Months: "装置開発・制御・電気設計の応募軸を絞る",
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
    resumeSignals: ["顧客課題", "技術提案", "採用理由", "売上・導入効果"],
    actionsToday: ["顧客課題と提案結果を3件書く", "扱った製品と半導体の接点を整理する", "英語で製品説明を1分で作る"],
    roadmap30Days: ["RF/アナログの基礎を学ぶ", "外資系FAE求人を10件読む", "英語面接で顧客対応を説明する"],
    roadmap90Days: "顧客技術対応をFAE向けの成功事例に変える",
    roadmap6Months: "英語対応と製品理解で外資系FAEを狙う",
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
    resumeSignals: ["担当工程", "改善経験", "扱った設備", "数字で語れる成果"],
    actionsToday: ["経験を品質・生産技術・設備・設計・技術営業に分類する", "近い職種の求人を5件読む", "半導体用語を10個覚える"],
    roadmap30Days: ["職種を1つに絞る", "職務経歴を半導体向けに翻訳する", "転職エージェントに現在地を相談する"],
    roadmap90Days: "近い職種の応募要件に合わせて実績を作る",
    roadmap6Months: "入口職種から半導体経験を積むルートを作る",
    agentTalkTrack: "半導体未経験から最初に狙う職種と企業の順番を相談する",
    englishTalkTrack: "英語は後回しにしすぎず、まず求人票と技術用語を読める状態を作ると選択肢が広がります。",
  },
};
