export type Goal = "yield" | "pipeline" | "cpk";
export type Stage = "collect" | "etl" | "platform" | "analysis" | "visual" | "app";
export type Feature = "capability" | "visualization" | "transform";
export type Environment = "any" | "local" | "cloud";
export type Skill = "any" | "nocode" | "code";
export type Volume = "any" | "files" | "large";
export type Evidence = "yes" | "unknown";
export type Product = {
  id: string; name: string; summary: string; goals: Goal[]; stages: Stage[];
  features: Record<Feature, Evidence>; environments: Environment[]; skills: Skill[]; volumes: Volume[];
  work: string; skill: string; pricing: string; deployment: string; integration: string; strength: string; limitation: string;
  source: string; sourceLabel: string; verified: string;
};
export const goals: { id: Goal; label: string; short: string; stages: Stage[]; tool: string; toolLabel: string }[] = [
  { id: "yield", label: "歩留まりを分析したい", short: "歩留まり分析", stages: ["analysis", "visual"], tool: "/tools/yield-analysis", toolLabel: "無料の歩留まり解析を試す" },
  { id: "pipeline", label: "装置ログを収集・統合して可視化したい", short: "データ基盤構築", stages: ["collect", "etl", "platform", "visual"], tool: "/tools/yield-dashboard", toolLabel: "架空データで調査を体験する" },
  { id: "cpk", label: "Cpkを計算したい", short: "工程能力評価", stages: ["analysis"], tool: "/tools/cpk", toolLabel: "無料のCp・Cpkツールを試す" },
];
export const stages: { id: Stage; label: string; description: string }[] = [
  { id: "collect", label: "データ収集", description: "装置やファイルから取り込む" }, { id: "etl", label: "ETL", description: "データを整え、統合する" },
  { id: "platform", label: "データ基盤", description: "データを蓄積・管理する" }, { id: "analysis", label: "統計解析", description: "ばらつきや要因を調べる" },
  { id: "visual", label: "可視化", description: "グラフやレポートで共有する" }, { id: "app", label: "業務アプリ化", description: "入力や業務フローにつなぐ" },
];
export const features: { id: Feature; label: string }[] = [{ id: "capability", label: "工程能力分析" }, { id: "visualization", label: "可視化" }, { id: "transform", label: "データ変換" }];
const unknown = "詳細は公式情報・提供元に確認";
export const products: Product[] = [
  { id: "jmp", name: "JMP", summary: "分布や工程能力を対話的に調べる統計ソフト。", goals: ["yield", "cpk"], stages: ["analysis", "visual"], features: { capability: "yes", visualization: "yes", transform: "unknown" }, environments: ["local"], skills: ["nocode"], volumes: ["files"], work: "工程能力・分布・統計解析", skill: "画面操作と統計の理解", pricing: "有料サブスクリプション。見積・地域条件を確認", deployment: "デスクトップ", integration: unknown, strength: "分布と工程能力を関連づけて調査", limitation: "工場全体の収集基盤を別途検討", source: "https://www.jmp.com/en/learning-library/topics/quality-and-process/process-capability-analysis", sourceLabel: "JMP 工程能力分析", verified: "2026-10-29" },
  { id: "minitab", name: "Minitab Statistical Software", summary: "工程能力や管理図など品質改善に使う統計ソフト。", goals: ["yield", "cpk"], stages: ["analysis"], features: { capability: "yes", visualization: "unknown", transform: "unknown" }, environments: [], skills: ["nocode"], volumes: [], work: "工程能力・品質改善の統計解析", skill: "画面操作と統計の理解", pricing: "ライセンス条件は提供元に確認", deployment: "利用形態は提供元に確認", integration: unknown, strength: "正規・非正規・計数データの能力分析", limitation: "分布や工程の安定性を確認して手法を選ぶ", source: "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/supporting-topics/basics/capability-analyses-in-minitab/", sourceLabel: "Minitab 工程能力分析", verified: "2026-10-29" },
  { id: "knime", name: "KNIME Analytics Platform", summary: "データの読み込みから変換・分析までをワークフローで組み立てる。", goals: ["yield", "pipeline"], stages: ["collect", "etl", "analysis", "visual"], features: { capability: "unknown", visualization: "yes", transform: "yes" }, environments: ["local"], skills: ["nocode"], volumes: [], work: "データ変換・分析・可視化", skill: "ワークフロー設計。必要に応じてコード", pricing: "Analytics Platformはオープンソース。周辺製品は条件確認", deployment: "デスクトップ", integration: "ファイル・データベース。接続先ごとに確認", strength: "処理手順を可視化して組み立てる", limitation: "装置固有の接続方法と運用基盤は要確認", source: "https://docs.knime.com/ap/latest/", sourceLabel: "KNIME 公式ドキュメント", verified: "2026-10-29" },
  { id: "python", name: "Python", summary: "CSVなどの処理をコードで組み立てる汎用プログラミング言語。", goals: ["yield", "pipeline"], stages: ["collect", "etl", "analysis"], features: { capability: "unknown", visualization: "unknown", transform: "yes" }, environments: ["local", "cloud"], skills: ["code"], volumes: [], work: "データ処理・自動化。分析は構成次第", skill: "Pythonのプログラミング", pricing: "Python本体はオープンソース。運用費は別途", deployment: "ローカル・クラウドなど構成次第", integration: "標準ライブラリでCSV入出力。接続先は構成次第", strength: "処理をコードで柔軟に構成", limitation: "分析ライブラリの選定・保守が必要", source: "https://docs.python.org/3/library/csv.html", sourceLabel: "Python CSV公式ドキュメント", verified: "2026-10-29" },
  { id: "powerbi", name: "Power BI", summary: "複数のデータソースからレポートと可視化を作る。", goals: ["yield", "pipeline"], stages: ["etl", "visual"], features: { capability: "unknown", visualization: "yes", transform: "yes" }, environments: ["local", "cloud"], skills: ["nocode"], volumes: [], work: "データ変換・可視化・レポート", skill: "画面操作。高度なモデルには学習が必要", pricing: "Desktop・共有のライセンス条件は要確認", deployment: "Desktop・クラウドサービス", integration: "ファイル・データベース等。コネクタごとに確認", strength: "複数ソースをレポートへまとめる", limitation: "工程能力の専用解析は別途確認", source: "https://learn.microsoft.com/power-bi/connect-data/desktop-data-sources", sourceLabel: "Microsoft データ接続", verified: "2026-10-29" },
  { id: "databricks", name: "Databricks", summary: "データの取り込み・変換とレイクハウス基盤を構築する。", goals: ["pipeline"], stages: ["collect", "etl", "platform", "analysis"], features: { capability: "unknown", visualization: "unknown", transform: "yes" }, environments: ["cloud"], skills: ["code"], volumes: ["large"], work: "データ収集・変換・蓄積・分析", skill: "SQLやパイプライン設計など構成に応じた知識", pricing: "利用量・契約条件を確認", deployment: "クラウド", integration: "コネクタ・SQL・Spark API。装置接続は要確認", strength: "収集から基盤まで複数の役割を担う", limitation: "権限・ネットワーク・運用設計が必要", source: "https://docs.databricks.com/aws/en/ingestion/", sourceLabel: "Databricks データ取り込み", verified: "2026-10-29" },
  { id: "powerapps", name: "Power Apps", summary: "データソースにつながる業務アプリを作る。", goals: ["pipeline"], stages: ["app"], features: { capability: "unknown", visualization: "unknown", transform: "unknown" }, environments: ["cloud"], skills: ["nocode"], volumes: [], work: "入力・業務アプリ作成", skill: "画面設計とデータ接続の理解", pricing: "ライセンス・コネクタ条件を確認", deployment: "クラウド", integration: "Dataverse・SharePoint等。コネクタ条件を確認", strength: "データにつながる入力画面を作る", limitation: "装置ログの収集や統計分析は別途検討", source: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/add-data-connection", sourceLabel: "Microsoft データ接続", verified: "2026-10-29" },
];
// Supplemental primary sources support the deployment, license and integration notes.
export const productSources: Record<string, { label: string; url: string }[]> = {
  jmp: [{ label: "JMP データの取り込み", url: "https://www.jmp.com/support/help/en/19.2/jmp/import-data.shtml" }, { label: "JMP 購入・ライセンス", url: "https://www.jmp.com/en/software/buy-jmp" }],
  minitab: [{ label: "Minitab ライセンス・利用形態", url: "https://www.minitab.com/en-us/try-buy/" }, { label: "Minitab 画面操作", url: "https://info.minitab.com/spreadsheet-alternatives" }],
  knime: [{ label: "KNIME 利用形態", url: "https://www.knime.com/knime-hub-pricing" }],
  python: [{ label: "Python ライセンスと用途", url: "https://www.python.org/about/" }],
  powerbi: [{ label: "Power BI 可視化", url: "https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview" }, { label: "Power BI ライセンス", url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/service-features-license-type" }],
  databricks: [{ label: "Databricks レイクハウス", url: "https://docs.databricks.com/aws/en/lakehouse/" }],
  powerapps: [{ label: "Power Apps キャンバスアプリ", url: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/getting-started" }],
};
export const comparisonFields = [
  ["work", "対応業務"], ["skill", "必要スキル"], ["pricing", "価格体系"], ["deployment", "導入形態"], ["integration", "データ連携"], ["strength", "強み"], ["limitation", "制約・確認事項"],
] as const;
export type ComparisonField = typeof comparisonFields[number][0];
