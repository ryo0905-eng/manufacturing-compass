export type GuideCollectionEntry = {
  slug: string;
  shortTitle: string;
};

export type IndustryGuideCollection = {
  id: string;
  label: string;
  description: string;
  guides: GuideCollectionEntry[];
};

export const industryGuideCollections: IndustryGuideCollection[] = [
  {
    id: "industry-overview",
    label: "業界の全体像・ランキング",
    description: "半導体企業の役割、事業構造、企業規模や年収の見方から調べます。",
    guides: [
      { slug: "ic-chip-manufacturing-companies", shortTitle: "ICチップ製造会社の種類" },
      { slug: "analog-semiconductor-companies", shortTitle: "アナログ半導体と主要企業" },
      { slug: "semiconductor-foundry", shortTitle: "ファウンドリ・IDM・OSATの違い" },
      { slug: "semiconductor-equipment-manufacturers", shortTitle: "半導体製造装置メーカーの全体像" },
      { slug: "applied-materials-semiconductor-equipment", shortTitle: "Applied Materialsの装置と担当工程" },
      { slug: "semiconductor-market-cap-ranking", shortTitle: "半導体メーカー時価総額ランキング" },
      { slug: "semiconductor-salary-ranking", shortTitle: "半導体企業の平均年収ランキング" },
    ],
  },
  {
    id: "wafer-lithography-materials",
    label: "ウェーハ・露光材料",
    description: "回路を作る土台と、パターン形成に使う材料のメーカーを調べます。",
    guides: [
      { slug: "semiconductor-silicon-wafer-manufacturers", shortTitle: "シリコンウェーハメーカー" },
      { slug: "semiconductor-photomask-manufacturers", shortTitle: "フォトマスクメーカー" },
      { slug: "semiconductor-mask-blank-manufacturers", shortTitle: "マスクブランクスメーカー" },
      { slug: "semiconductor-pellicle-manufacturers", shortTitle: "ペリクルメーカー" },
      { slug: "semiconductor-photoresist-manufacturers", shortTitle: "フォトレジストメーカー" },
    ],
  },
  {
    id: "front-end-equipment",
    label: "前工程の製造装置",
    description: "露光、成膜、加工、洗浄など、ウェーハへ回路を作る装置から調べます。",
    guides: [
      { slug: "semiconductor-lithography-equipment-manufacturers", shortTitle: "露光装置メーカー" },
      { slug: "semiconductor-coater-developer-manufacturers", shortTitle: "塗布現像装置メーカー" },
      { slug: "semiconductor-photomask-writer-manufacturers", shortTitle: "フォトマスク描画装置メーカー" },
      { slug: "semiconductor-deposition-equipment-manufacturers", shortTitle: "成膜装置メーカー" },
      { slug: "semiconductor-etching-equipment-manufacturers", shortTitle: "エッチング装置メーカー" },
      { slug: "semiconductor-cleaning-equipment-manufacturers", shortTitle: "洗浄装置メーカー" },
      { slug: "semiconductor-ion-implantation-equipment-manufacturers", shortTitle: "イオン注入装置メーカー" },
      { slug: "semiconductor-thermal-processing-equipment-manufacturers", shortTitle: "熱処理装置メーカー" },
      { slug: "semiconductor-cmp-equipment-manufacturers", shortTitle: "CMP装置メーカー" },
      { slug: "semiconductor-cmp-slurry-manufacturers", shortTitle: "CMPスラリーメーカー" },
    ],
  },
  {
    id: "inspection-metrology",
    label: "検査・計測装置",
    description: "欠陥、寸法、膜厚、重ね合わせなど、工程を測って管理する装置から調べます。",
    guides: [
      { slug: "semiconductor-inspection-equipment-manufacturers", shortTitle: "検査・計測装置メーカーの全体像" },
      { slug: "semiconductor-cd-sem-manufacturers", shortTitle: "CD-SEM・電子線計測装置メーカー" },
      { slug: "semiconductor-defect-review-sem-manufacturers", shortTitle: "欠陥レビューSEMメーカー" },
      { slug: "semiconductor-thin-film-optical-metrology-manufacturers", shortTitle: "膜厚・光学計測装置メーカー" },
      { slug: "semiconductor-overlay-metrology-manufacturers", shortTitle: "重ね合わせ計測装置メーカー" },
      { slug: "semiconductor-wafer-geometry-metrology-manufacturers", shortTitle: "ウェーハ形状・平坦度測定装置メーカー" },
      { slug: "semiconductor-wafer-defect-inspection-manufacturers", shortTitle: "ウェーハ欠陥検査装置メーカー" },
      { slug: "semiconductor-photomask-inspection-equipment-manufacturers", shortTitle: "フォトマスク検査装置メーカー" },
    ],
  },
  {
    id: "components-subfab",
    label: "部品・材料・サブファブ",
    description: "ガス、真空、温調、搬送など、製造装置を周辺から支える企業を調べます。",
    guides: [
      { slug: "semiconductor-equipment-components-subfab", shortTitle: "装置部品・サブファブの全体像" },
      { slug: "semiconductor-gas-manufacturers", shortTitle: "半導体ガスメーカー" },
      { slug: "semiconductor-high-purity-chemical-manufacturers", shortTitle: "高純度薬液メーカー" },
      { slug: "semiconductor-mass-flow-controller-manufacturers", shortTitle: "マスフローコントローラーメーカー" },
      { slug: "semiconductor-high-purity-valve-gas-supply-manufacturers", shortTitle: "高純度バルブ・ガス供給機器メーカー" },
      { slug: "semiconductor-vacuum-pump-manufacturers", shortTitle: "真空ポンプメーカー" },
      { slug: "semiconductor-vacuum-gauge-pressure-control-valve-manufacturers", shortTitle: "真空計・圧力制御バルブメーカー" },
      { slug: "semiconductor-exhaust-gas-abatement-manufacturers", shortTitle: "排ガス除害装置メーカー" },
      { slug: "semiconductor-rf-power-matching-manufacturers", shortTitle: "RF電源・マッチングユニットメーカー" },
      { slug: "semiconductor-chiller-temperature-control-manufacturers", shortTitle: "チラー・温度調節装置メーカー" },
      { slug: "semiconductor-electrostatic-chuck-ceramic-heater-manufacturers", shortTitle: "静電チャック・セラミックヒーターメーカー" },
      { slug: "semiconductor-wafer-handling-efem-manufacturers", shortTitle: "EFEM・ウェーハ搬送メーカー" },
    ],
  },
  {
    id: "test-assembly",
    label: "テスト・後工程",
    description: "良品判定、個片化、組立に使う装置や接触部品のメーカーを調べます。",
    guides: [
      { slug: "semiconductor-tester-ate", shortTitle: "半導体テスタ・ATE" },
      { slug: "semiconductor-wafer-prober-manufacturers", shortTitle: "ウェーハプローバメーカー" },
      { slug: "semiconductor-probe-card-manufacturers", shortTitle: "プローブカードメーカー" },
      { slug: "semiconductor-test-handler-manufacturers", shortTitle: "テストハンドラメーカー" },
      { slug: "semiconductor-test-socket-manufacturers", shortTitle: "テストソケットメーカー" },
      { slug: "semiconductor-dicing-equipment-manufacturers", shortTitle: "ダイシング装置メーカー" },
      { slug: "semiconductor-packaging-equipment-manufacturers", shortTitle: "パッケージング装置メーカー" },
    ],
  },
];

export const industryGuideSlugs = industryGuideCollections.flatMap((collection) =>
  collection.guides.map((guide) => guide.slug),
);

export const industryGuideCount = industryGuideSlugs.length;
