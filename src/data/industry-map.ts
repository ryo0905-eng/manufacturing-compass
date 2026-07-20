export type IndustryMapProcessId =
  | "design"
  | "wafer"
  | "fabrication"
  | "wafer-test"
  | "assembly"
  | "final-test";

export type IndustryMapProcess = {
  id: IndustryMapProcessId;
  label: string;
  labelEn: string;
  description: string;
  guideHref: string;
  x: number;
  y: number;
};

export type IndustryMapGroup = {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  processIds: IndustryMapProcessId[];
  segmentId?: string;
  x: number;
  y: number;
};

export type IndustryMapCompany = {
  companyId: string;
  processIds: IndustryMapProcessId[];
  x: number;
  y: number;
};

export type IndustryMapCareer = {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  processIds: IndustryMapProcessId[];
  query: string;
  x: number;
  y: number;
};

export const industryMapMetadata = {
  lastUpdated: "2026-07-21",
  basis: "公開済みの製造工程記事と企業データをもとにした、一般的な役割上の接点",
};

export const industryMapProcesses: IndustryMapProcess[] = [
  {
    id: "design",
    label: "回路設計・マスク",
    labelEn: "Design",
    description: "製品に必要な機能を回路へ落とし込み、製造に使う層ごとのパターンを準備します。",
    guideHref: "/guides/ic-chip-manufacturing-companies",
    x: 105,
    y: 342,
  },
  {
    id: "wafer",
    label: "ウェーハ製造",
    labelEn: "Wafer",
    description: "単結晶を育成し、薄く切り、研磨・洗浄・検査を経て回路を作る基板へ仕上げます。",
    guideHref: "/guides/semiconductor-silicon-wafer-manufacturing",
    x: 318,
    y: 342,
  },
  {
    id: "fabrication",
    label: "ウェーハ加工",
    labelEn: "Wafer fab",
    description: "成膜、露光、エッチング、イオン注入、CMPなどを繰り返し、素子と配線を形成します。",
    guideHref: "/guides/semiconductor-manufacturing-process",
    x: 531,
    y: 342,
  },
  {
    id: "wafer-test",
    label: "ウェーハテスト",
    labelEn: "Wafer test",
    description: "切り分ける前の各チップへ電気的に接触し、機能や特性を確認します。",
    guideHref: "/guides/semiconductor-wafer-test",
    x: 744,
    y: 342,
  },
  {
    id: "assembly",
    label: "切断・組立",
    labelEn: "Assembly",
    description: "ウェーハをダイへ分割し、接続・封止・放熱構造を加えて扱える製品形態にします。",
    guideHref: "/guides/semiconductor-packaging-process",
    x: 957,
    y: 342,
  },
  {
    id: "final-test",
    label: "最終検査・出荷",
    labelEn: "Final test",
    description: "組立後の機能、性能、信頼性を確認し、出荷できる状態へ仕上げます。",
    guideHref: "/guides/semiconductor-final-test",
    x: 1170,
    y: 342,
  },
];

export const industryMapGroups: IndustryMapGroup[] = [
  {
    id: "fabless",
    label: "ファブレス",
    labelEn: "Design company",
    description: "自社工場を持たず、製品企画と半導体設計を中心に担う企業群です。",
    processIds: ["design"],
    segmentId: "fabless",
    x: 105,
    y: 105,
  },
  {
    id: "wafer-materials",
    label: "ウェーハ・材料",
    labelEn: "Materials",
    description: "シリコンウェーハ、薬液、ガス、レジストなど、製造の土台となる材料を供給します。",
    processIds: ["wafer", "fabrication", "assembly"],
    x: 340,
    y: 145,
  },
  {
    id: "foundry",
    label: "ファウンドリ",
    labelEn: "Manufacturing service",
    description: "顧客が設計した半導体のウェーハ製造を受託する企業群です。",
    processIds: ["fabrication", "wafer-test"],
    segmentId: "foundry",
    x: 565,
    y: 92,
  },
  {
    id: "idm-memory",
    label: "IDM・メモリ",
    labelEn: "Integrated maker",
    description: "設計から製造まで複数の役割を持ち、製品開発と量産をつなぐ企業群です。",
    processIds: ["design", "fabrication", "wafer-test", "final-test"],
    segmentId: "idm",
    x: 790,
    y: 155,
  },
  {
    id: "equipment",
    label: "製造装置・計測",
    labelEn: "Equipment",
    description: "加工、搬送、検査、計測、テストなどの装置で複数工程を横断して支えます。",
    processIds: ["wafer", "fabrication", "wafer-test", "assembly", "final-test"],
    segmentId: "equipment",
    x: 995,
    y: 92,
  },
  {
    id: "assembly-test-service",
    label: "組立・テスト",
    labelEn: "Assembly & test",
    description: "ダイシング、パッケージング、電気検査など、後工程を専門的に支える領域です。",
    processIds: ["wafer-test", "assembly", "final-test"],
    x: 1170,
    y: 175,
  },
];

export const industryMapCompanies: IndustryMapCompany[] = [
  { companyId: "nvidia", processIds: ["design"], x: 72, y: 92 },
  { companyId: "amd", processIds: ["design"], x: 220, y: 92 },
  { companyId: "qualcomm", processIds: ["design"], x: 368, y: 92 },
  { companyId: "socionext", processIds: ["design"], x: 148, y: 178 },
  { companyId: "tsmc", processIds: ["fabrication", "wafer-test"], x: 488, y: 92 },
  { companyId: "samsung-electronics", processIds: ["design", "fabrication", "wafer-test", "final-test"], x: 636, y: 92 },
  { companyId: "intel", processIds: ["design", "fabrication", "wafer-test", "final-test"], x: 784, y: 92 },
  { companyId: "globalfoundries", processIds: ["fabrication", "wafer-test"], x: 562, y: 178 },
  { companyId: "micron", processIds: ["design", "fabrication", "wafer-test", "final-test"], x: 710, y: 178 },
  { companyId: "kioxia", processIds: ["design", "fabrication", "wafer-test", "final-test"], x: 858, y: 178 },
  { companyId: "sk-hynix", processIds: ["design", "fabrication", "wafer-test", "final-test"], x: 1006, y: 178 },
  { companyId: "asml", processIds: ["fabrication"], x: 390, y: 588 },
  { companyId: "tokyo-electron", processIds: ["fabrication"], x: 538, y: 588 },
  { companyId: "applied-materials", processIds: ["fabrication"], x: 686, y: 588 },
  { companyId: "screen", processIds: ["fabrication"], x: 538, y: 668 },
  { companyId: "kla", processIds: ["fabrication", "wafer-test"], x: 834, y: 588 },
  { companyId: "advantest", processIds: ["wafer-test", "final-test"], x: 982, y: 588 },
  { companyId: "teradyne", processIds: ["wafer-test", "final-test"], x: 1130, y: 588 },
  { companyId: "disco", processIds: ["assembly"], x: 982, y: 668 },
];

export const industryMapCareers: IndustryMapCareer[] = [
  {
    id: "circuit-design",
    label: "回路・製品設計",
    labelEn: "Design engineering",
    description: "回路、デバイス、製品仕様を設計し、製造条件や評価へつなぎます。",
    processIds: ["design"],
    query: "設計",
    x: 105,
    y: 125,
  },
  {
    id: "process-engineer",
    label: "プロセスエンジニア",
    labelEn: "Process engineering",
    description: "加工条件、歩留まり、品質、量産安定性を工程データから改善します。",
    processIds: ["wafer", "fabrication", "assembly"],
    query: "プロセスエンジニア",
    x: 475,
    y: 105,
  },
  {
    id: "product-test",
    label: "製品・テスト技術",
    labelEn: "Product & test",
    description: "電気特性の評価、テスト条件、解析、製品品質を量産へつなぎます。",
    processIds: ["wafer-test", "final-test"],
    query: "製品技術",
    x: 825,
    y: 125,
  },
  {
    id: "equipment-engineer",
    label: "設備・装置技術",
    labelEn: "Equipment engineering",
    description: "装置の導入、保全、改善、稼働安定化を通じて製造工程を支えます。",
    processIds: ["wafer", "fabrication", "wafer-test", "assembly", "final-test"],
    query: "設備エンジニア",
    x: 430,
    y: 615,
  },
  {
    id: "field-engineer",
    label: "フィールドエンジニア",
    labelEn: "Field service",
    description: "顧客工場で装置の立ち上げ、保守、トラブル対応、改善提案を担います。",
    processIds: ["fabrication", "wafer-test", "assembly", "final-test"],
    query: "フィールドエンジニア",
    x: 720,
    y: 650,
  },
  {
    id: "quality-engineer",
    label: "品質保証・品質管理",
    labelEn: "Quality engineering",
    description: "工程、製品、顧客の間をつなぎ、不具合解析と再発防止を進めます。",
    processIds: ["fabrication", "wafer-test", "assembly", "final-test"],
    query: "品質保証",
    x: 1010,
    y: 615,
  },
];
