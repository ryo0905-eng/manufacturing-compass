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
  exampleCompanyIds: string[];
  exampleLabel: string;
  id: string;
  label: string;
  labelEn: string;
  description: string;
  processIds: IndustryMapProcessId[];
  segmentId?: string;
  guideHref?: string;
  guideLabel?: string;
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

export type IndustryMapZoneId =
  | "eda-ip"
  | "fabless"
  | "foundry"
  | "idm"
  | "osat"
  | "materials"
  | "equipment"
  | "inspection";

export type IndustryMapZone = {
  id: IndustryMapZoneId;
  label: string;
  labelEn: string;
  description: string;
  companyIds: string[];
  supplementalCompanyIds: string[];
  productTags: string[];
  careerIds: string[];
  guideHref: string;
  guideLabel: string;
};

export type IndustryMapSupplementalCompany = {
  id: string;
  name: string;
  nameJa: string;
  headquartersCountry: string;
  businessModel: string;
  summary: string;
  mainProducts: string[];
  jobCategories: string[];
  websiteUrl: string;
  source: {
    title: string;
    url: string;
    publisher: string;
    accessedAt: string;
  };
};

export type IndustryMapZoneRelation = {
  from: IndustryMapZoneId;
  to: IndustryMapZoneId;
  label: string;
};

export const industryMapMetadata = {
  lastUpdated: "2026-09-12",
  basis: "公開済みの製造工程記事と企業データをもとにした、一般的な役割上の接点",
};

export const industryMapSupplementalCompanies: IndustryMapSupplementalCompany[] = [
  {
    id: "synopsys",
    name: "Synopsys",
    nameJa: "シノプシス",
    headquartersCountry: "米国",
    businessModel: "EDA・半導体IP",
    summary: "半導体の設計・検証を支援するEDAツールと、設計に組み込む半導体IPを提供します。",
    mainProducts: ["EDA", "設計・検証", "半導体IP"],
    jobCategories: ["回路・製品設計", "ソフトウェア", "技術営業"],
    websiteUrl: "https://www.synopsys.com/",
    source: { title: "EDA Tools, Semiconductor IP & Systems Verification", url: "https://www.synopsys.com/", publisher: "Synopsys", accessedAt: "2026-09-12" },
  },
  {
    id: "cadence",
    name: "Cadence Design Systems",
    nameJa: "ケイデンス・デザイン・システムズ",
    headquartersCountry: "米国",
    businessModel: "EDA・半導体IP",
    summary: "IC設計、検証、パッケージ設計を支援するソフトウェア、ハードウェア、IPを提供します。",
    mainProducts: ["IC設計", "検証", "IP・チップレット"],
    jobCategories: ["回路・製品設計", "ソフトウェア", "技術営業"],
    websiteUrl: "https://www.cadence.com/en_US/home.html",
    source: { title: "Cadence Design Systems, Inc. Factsheet", url: "https://www.cadence.com/en_US/home/resources/factsheets/cadence-design-systems-inc-fs.html", publisher: "Cadence", accessedAt: "2026-09-12" },
  },
  {
    id: "arm",
    name: "Arm",
    nameJa: "Arm",
    headquartersCountry: "英国",
    businessModel: "プロセッサIP",
    summary: "CPUを中心とする設計IPと計算基盤を提供し、半導体企業の製品設計を支えます。",
    mainProducts: ["CPU IP", "Compute Subsystems", "System IP"],
    jobCategories: ["回路・製品設計", "ソフトウェア", "技術営業"],
    websiteUrl: "https://www.arm.com/company",
    source: { title: "About Arm", url: "https://www.arm.com/company", publisher: "Arm", accessedAt: "2026-09-12" },
  },
  {
    id: "ase",
    name: "ASE Technology Holding",
    nameJa: "ASE",
    headquartersCountry: "台湾",
    businessModel: "OSAT",
    summary: "ウェーハ工程後の組立、パッケージング、テストを受託し、製品の完成を支えます。",
    mainProducts: ["半導体組立", "パッケージング", "テスト"],
    jobCategories: ["製品・テスト技術", "プロセスエンジニア", "品質保証"],
    websiteUrl: "https://www.aseglobal.com/",
    source: { title: "Test Service 事業内容", url: "https://www.asejp.aseglobal.com/services/02.html", publisher: "ASE Japan", accessedAt: "2026-09-12" },
  },
  {
    id: "amkor",
    name: "Amkor Technology",
    nameJa: "アムコー・テクノロジー",
    headquartersCountry: "米国",
    businessModel: "OSAT",
    summary: "半導体のパッケージ設計・組立・テストサービスを提供する後工程企業です。",
    mainProducts: ["先端パッケージ", "組立", "テスト"],
    jobCategories: ["製品・テスト技術", "プロセスエンジニア", "品質保証"],
    websiteUrl: "https://amkor.com/",
    source: { title: "Semiconductor Packaging and Test Services", url: "https://amkor.com/", publisher: "Amkor Technology", accessedAt: "2026-09-12" },
  },
  {
    id: "shin-etsu-chemical",
    name: "Shin-Etsu Chemical",
    nameJa: "信越化学工業",
    headquartersCountry: "日本",
    businessModel: "材料・シリコンウェーハ",
    summary: "半導体用シリコンウェーハなど、デバイス製造の基盤となる材料を供給します。",
    mainProducts: ["シリコンウェーハ", "半導体材料"],
    jobCategories: ["材料開発", "生産技術", "品質保証"],
    websiteUrl: "https://www.shinetsu.co.jp/en/products/electronics-materials/silicon-wafers/",
    source: { title: "Silicon Wafers", url: "https://www.shinetsu.co.jp/en/products/electronics-materials/silicon-wafers/", publisher: "Shin-Etsu Chemical", accessedAt: "2026-09-12" },
  },
  {
    id: "tok",
    name: "Tokyo Ohka Kogyo",
    nameJa: "東京応化工業",
    headquartersCountry: "日本",
    businessModel: "半導体材料",
    summary: "フォトレジストや高純度化学薬品など、微細加工に使う材料を提供します。",
    mainProducts: ["フォトレジスト", "高純度化学薬品"],
    jobCategories: ["材料開発", "生産技術", "品質保証"],
    websiteUrl: "https://www.tok.co.jp/eng/",
    source: { title: "What is TOK", url: "https://www.tok.co.jp/eng/who-we-are/glance", publisher: "Tokyo Ohka Kogyo", accessedAt: "2026-09-12" },
  },
];

export const industryMapZones: IndustryMapZone[] = [
  { id: "eda-ip", label: "EDA・IP", labelEn: "Design foundation", description: "設計ツールと再利用可能な回路・プロセッサIPで、半導体設計の入口を支えます。", companyIds: [], supplementalCompanyIds: ["synopsys", "cadence", "arm"], productTags: ["EDA", "検証", "プロセッサIP"], careerIds: ["circuit-design"], guideHref: "/guides/ic-chip-manufacturing-companies", guideLabel: "設計から製造までの分業を見る" },
  { id: "fabless", label: "ファブレス", labelEn: "Chip design", description: "自社工場を持たず、製品企画と回路設計を中心に担います。", companyIds: ["nvidia", "amd", "qualcomm", "socionext"], supplementalCompanyIds: [], productTags: ["AI・GPU", "CPU", "通信", "SoC"], careerIds: ["circuit-design", "product-test"], guideHref: "/segments/fabless", guideLabel: "ファブレス企業を詳しく見る" },
  { id: "foundry", label: "ファウンドリ", labelEn: "Wafer manufacturing", description: "顧客が設計した半導体のウェーハ製造を受託します。", companyIds: ["tsmc", "globalfoundries"], supplementalCompanyIds: [], productTags: ["受託製造", "先端プロセス"], careerIds: ["process-engineer", "equipment-engineer"], guideHref: "/segments/foundry", guideLabel: "ファウンドリ企業を詳しく見る" },
  { id: "idm", label: "IDM（設計・製造）", labelEn: "Integrated device maker", description: "製品設計から製造まで複数の機能を持ち、製品と量産をつなぎます。", companyIds: ["intel", "samsung-electronics", "micron", "kioxia", "sk-hynix", "renesas", "rohm"], supplementalCompanyIds: [], productTags: ["メモリ", "CPU", "アナログ", "パワー"], careerIds: ["process-engineer", "product-test"], guideHref: "/segments/idm", guideLabel: "IDM企業を詳しく見る" },
  { id: "osat", label: "OSAT・後工程", labelEn: "Assembly & test", description: "前工程後の組立、パッケージング、テストを受託して製品へ仕上げます。", companyIds: [], supplementalCompanyIds: ["ase", "amkor"], productTags: ["パッケージ", "組立", "テスト"], careerIds: ["product-test", "quality-engineer"], guideHref: "/guides/semiconductor-packaging-process", guideLabel: "後工程とOSATの役割を見る" },
  { id: "materials", label: "材料・ウェーハ", labelEn: "Materials", description: "ウェーハ、レジスト、薬液など、各製造工程に必要な材料を供給します。", companyIds: ["sumco"], supplementalCompanyIds: ["shin-etsu-chemical", "tok"], productTags: ["シリコンウェーハ", "レジスト", "薬液"], careerIds: ["process-engineer", "quality-engineer"], guideHref: "/segments/materials", guideLabel: "材料企業を詳しく見る" },
  { id: "equipment", label: "製造装置", labelEn: "Production equipment", description: "露光、成膜、加工、洗浄などの装置で製造工程を横断して支えます。", companyIds: ["asml", "tokyo-electron", "applied-materials", "lam-research", "screen", "disco"], supplementalCompanyIds: [], productTags: ["露光", "成膜", "洗浄", "精密加工"], careerIds: ["equipment-engineer", "field-engineer"], guideHref: "/segments/equipment", guideLabel: "製造装置企業を詳しく見る" },
  { id: "inspection", label: "検査・計測装置", labelEn: "Inspection & test", description: "欠陥・寸法・電気特性を測り、工程改善と出荷判定へ情報を戻します。", companyIds: ["kla", "advantest", "teradyne", "lasertec"], supplementalCompanyIds: [], productTags: ["検査", "計測", "テスト"], careerIds: ["product-test", "field-engineer"], guideHref: "/guides/semiconductor-inspection-metrology", guideLabel: "検査・計測の違いを見る" },
];

export const industryMapZoneRelations: IndustryMapZoneRelation[] = [
  { from: "eda-ip", to: "fabless", label: "設計環境・IP" },
  { from: "fabless", to: "foundry", label: "製造委託の一般的な流れ" },
  { from: "foundry", to: "osat", label: "組立・テストへ" },
  { from: "materials", to: "foundry", label: "材料を供給" },
  { from: "equipment", to: "foundry", label: "製造を支える" },
  { from: "inspection", to: "foundry", label: "検査・計測で支える" },
];

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
    exampleCompanyIds: ["nvidia", "socionext"],
    exampleLabel: "企業例",
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
    exampleCompanyIds: ["sumco"],
    exampleLabel: "企業例",
    label: "ウェーハ・材料",
    labelEn: "Materials",
    description: "シリコンウェーハ、薬液、ガス、レジストなど、製造の土台となる材料を供給します。",
    processIds: ["wafer", "fabrication", "assembly"],
    segmentId: "materials",
    x: 340,
    y: 145,
  },
  {
    id: "foundry",
    exampleCompanyIds: ["tsmc"],
    exampleLabel: "企業例",
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
    exampleCompanyIds: ["intel", "kioxia"],
    exampleLabel: "企業例",
    label: "IDM（設計・製造）",
    labelEn: "Integrated maker",
    description: "設計から製造まで複数の役割を持ち、製品開発と量産をつなぐ企業群です。",
    processIds: ["design", "fabrication", "wafer-test", "final-test"],
    segmentId: "idm",
    x: 790,
    y: 155,
  },
  {
    id: "equipment",
    exampleCompanyIds: ["asml", "tokyo-electron"],
    exampleLabel: "企業例",
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
    exampleCompanyIds: ["disco", "advantest"],
    exampleLabel: "装置の企業例",
    label: "組立・テスト",
    labelEn: "Assembly & test",
    description: "ダイシング、パッケージング、電気検査など、後工程を専門的に支える領域です。",
    processIds: ["wafer-test", "assembly", "final-test"],
    guideHref: "/guides/semiconductor-packaging-process",
    guideLabel: "後工程とOSATの役割を見る",
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

export const industryMapFields = [
  {
    id: "design",
    companyLabel: "製品設計の企業例",
    title: "設計・EDA・IP",
    description: "製品仕様を回路へ落とし込み、設計ソフトやIPを使って製造へ渡すデータを作ります。",
    companyIds: ["nvidia", "amd", "socionext"],
    guideHref: "/guides/ic-chip-manufacturing-companies",
    guideLabel: "設計企業と製造企業の分業を見る",
  },
  {
    id: "materials",
    companyLabel: "材料を供給する企業例",
    title: "材料・ウェーハ",
    description: "シリコンウェーハ、フォトレジスト、ガス、薬液など、回路形成に必要な基板と材料を供給します。",
    companyIds: ["sumco"],
    guideHref: "/guides/semiconductor-silicon-wafer-manufacturers",
    guideLabel: "シリコンウェーハメーカーを見る",
  },
  {
    id: "front-end",
    companyLabel: "前工程を担う企業例",
    title: "前工程・ウェーハ加工",
    description: "成膜、露光、エッチング、注入、CMPなどを繰り返し、ウェーハ上へ素子と配線を形成します。",
    companyIds: ["tsmc", "samsung-electronics", "intel", "micron", "kioxia"],
    guideHref: "/guides/semiconductor-manufacturing-process",
    guideLabel: "前工程・後工程を図解で見る",
  },
  {
    id: "equipment",
    companyLabel: "装置を供給する企業例",
    title: "製造装置・搬送",
    description: "露光、成膜、加工、洗浄、搬送などの装置で前工程・後工程を横断して支えます。",
    companyIds: ["asml", "tokyo-electron", "applied-materials", "screen"],
    guideHref: "/guides/semiconductor-equipment-manufacturers",
    guideLabel: "工程別の製造装置メーカーを見る",
  },
  {
    id: "back-end",
    companyLabel: "後工程を支える装置の企業例",
    title: "後工程・パッケージ",
    description: "ウェーハテスト後のダイを切り分け、接続・封止・放熱構造を加えて製品形態へ仕上げます。",
    companyIds: ["disco"],
    guideHref: "/guides/semiconductor-packaging-process",
    guideLabel: "パッケージングとOSATの役割を見る",
  },
  {
    id: "inspection",
    companyLabel: "検査・計測・テスト装置の企業例",
    title: "検査・計測・テスト",
    description: "欠陥、寸法、膜厚、電気特性を確認し、工程改善と出荷判定へ情報を戻します。",
    companyIds: ["kla", "lasertec", "advantest", "teradyne"],
    guideHref: "/guides/semiconductor-inspection-metrology",
    guideLabel: "検査・計測の違いを見る",
  },
  {
    id: "applications",
    companyLabel: "用途に関連する半導体企業の例",
    title: "最終製品・用途",
    description: "完成した半導体は、AIサーバー、自動車、産業機器、通信機器、スマートフォンなどの機能を支えます。",
    companyIds: ["nvidia", "qualcomm", "renesas", "infineon"],
    guideHref: "/guides/analog-semiconductor-companies",
    guideLabel: "用途から半導体企業を見る",
  },
] as const;
