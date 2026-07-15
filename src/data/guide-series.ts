export const semiconductorProcessSeriesHubSlug = "semiconductor-manufacturing-process";

export const semiconductorProcessSeriesPhases = [
  {
    number: "01",
    label: "材料・基板",
    title: "回路を作る土台を知る",
    description: "高純度原料から単結晶を育て、平らなシリコンウェーハへ仕上げます。",
    slugs: ["semiconductor-silicon-wafer-manufacturing"],
  },
  {
    number: "02",
    label: "前工程・素子形成",
    title: "薄膜と微細な形を作る",
    description: "洗浄、膜形成、パターン転写、加工、ドーピングを繰り返します。",
    slugs: [
      "semiconductor-cleaning-process",
      "semiconductor-oxidation-thermal-process",
      "semiconductor-deposition-process",
      "photolithography-process",
      "semiconductor-etching-process",
      "semiconductor-ion-implantation-process",
    ],
  },
  {
    number: "03",
    label: "前工程・配線と管理",
    title: "平らにして、つなぎ、測る",
    description: "表面を平坦に整え、多層配線を形成し、寸法や欠陥を工程へ戻します。",
    slugs: [
      "semiconductor-cmp-process",
      "semiconductor-interconnect-process",
      "semiconductor-inspection-metrology",
    ],
  },
  {
    number: "04",
    label: "テスト・組立",
    title: "選び、分け、製品にする",
    description: "良品ダイを選別・個片化し、接続・封止して完成品を試験します。",
    slugs: [
      "semiconductor-wafer-test",
      "semiconductor-dicing-process",
      "semiconductor-packaging-process",
      "semiconductor-final-test",
    ],
  },
] as const;

export const semiconductorProcessSeriesDetailSlugs = semiconductorProcessSeriesPhases.flatMap(
  (phase) => [...phase.slugs],
);

export const semiconductorProcessSeriesSlugs = [
  semiconductorProcessSeriesHubSlug,
  ...semiconductorProcessSeriesDetailSlugs,
];
