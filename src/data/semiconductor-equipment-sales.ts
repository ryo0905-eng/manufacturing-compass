export const equipmentSalesMeta = {
  year: 2025,
  currency: "十億米ドル",
  checkedAt: "2026-09-17",
  sourcePublishedAt: "2026-09-15",
  sourceTitle: "東京エレクトロン Investors’ Guide（2026年9月15日版）p.10",
  sourceUrl: "https://www.tel.com/ir/library/investors-guide/hq95qj0000000734-att/InvestorsGuide_E20260915_rev00.pdf#page=10",
  originalSource: "TechInsights Inc., May 2026",
  scope: "CY2025 SPE Makers Top 15の上位10社。2025暦年の半導体製造装置売上高",
} as const;

export const equipmentProcesses = [
  {
    "id": "deposition",
    "label": "成膜",
    "guideSlug": "semiconductor-deposition-equipment-manufacturers",
    "description": "材料の薄い膜をつくる"
  },
  {
    "id": "lithography",
    "label": "露光",
    "guideSlug": "semiconductor-lithography-equipment-manufacturers",
    "description": "光でパターンを転写・描画する。塗布・現像だけの装置は含めない"
  },
  {
    "id": "etch",
    "label": "エッチング",
    "guideSlug": "semiconductor-etching-equipment-manufacturers",
    "description": "不要な材料を取り除いて形をつくる"
  },
  {
    "id": "cleaning",
    "label": "洗浄",
    "guideSlug": "semiconductor-cleaning-equipment-manufacturers",
    "description": "表面の汚れや残留物を取り除く"
  },
  {
    "id": "inspection",
    "label": "検査・計測",
    "guideSlug": "semiconductor-inspection-equipment-manufacturers",
    "description": "欠陥や寸法、膜の状態を確かめる"
  },
  {
    "id": "test",
    "label": "テスト",
    "guideSlug": "semiconductor-tester-ate",
    "description": "電気特性・動作を試験する。プローバなどの周辺装置も含む"
  },
  {
    "id": "assembly",
    "label": "組立・実装",
    "guideSlug": "semiconductor-packaging-equipment-manufacturers",
    "description": "接合などでチップやウェーハをつなぐ。パッケージ向けの成膜・露光・検査だけでは該当扱いにしない"
  }
] as const;

export type EquipmentProcessId = (typeof equipmentProcesses)[number]["id"];
export type EquipmentProcessSelection = "all" | EquipmentProcessId;
export type EquipmentSalesCompany = {
  id: string;
  name: string;
  rank: number;
  salesUsdB: number;
  companySlug?: string;
  capabilities: Array<{ process: EquipmentProcessId; description: string; sourceUrl: string }>;
};

// 工程対応は確認できた製品例。非該当は、その事業が存在しないことを意味しない。
export const equipmentSalesCompanies: EquipmentSalesCompany[] = [
  {
    "id": "asml",
    "name": "ASML",
    "rank": 1,
    "salesUsdB": 35.96,
    "capabilities": [
      {
        "process": "lithography",
        "description": "EUV・DUV露光装置。光で回路パターンを転写する。",
        "sourceUrl": "https://www.asml.com/en/products"
      },
      {
        "process": "inspection",
        "description": "光学計測・電子線検査。パターンの位置や欠陥を確認する。",
        "sourceUrl": "https://www.asml.com/en/products"
      }
    ],
    "companySlug": "asml"
  },
  {
    "id": "applied-materials",
    "name": "Applied Materials",
    "rank": 2,
    "salesUsdB": 26.93,
    "capabilities": [
      {
        "process": "deposition",
        "description": "CVD・PVDなどで材料の薄膜を形成する。",
        "sourceUrl": "https://www.appliedmaterials.com/us/en/semiconductor/products.html"
      },
      {
        "process": "etch",
        "description": "不要な材料を取り除き、微細な構造を加工する。",
        "sourceUrl": "https://www.appliedmaterials.com/us/en/semiconductor/products.html"
      },
      {
        "process": "inspection",
        "description": "材料や微細構造を検査・計測する。",
        "sourceUrl": "https://www.appliedmaterials.com/us/en/semiconductor/products.html"
      },
      {
        "process": "assembly",
        "description": "Kinexのハイブリッド接合でチップ同士を接続する。",
        "sourceUrl": "https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-introduces-new-systems-accelerate-dram-and"
      }
    ],
    "companySlug": "applied-materials"
  },
  {
    "id": "lam-research",
    "name": "Lam Research",
    "rank": 3,
    "salesUsdB": 20.56,
    "capabilities": [
      {
        "process": "deposition",
        "description": "薄膜を形成し、微細構造の材料を積み重ねる。",
        "sourceUrl": "https://www.lamresearch.com/products/our-processes/"
      },
      {
        "process": "etch",
        "description": "プラズマなどで材料を選択的に除去する。",
        "sourceUrl": "https://www.lamresearch.com/products/our-processes/"
      },
      {
        "process": "cleaning",
        "description": "Strip & Clean装置で残留物を除去する。",
        "sourceUrl": "https://www.lamresearch.com/products/our-processes/"
      },
      {
        "process": "inspection",
        "description": "質量計測で加工前後の微小な変化を捉える。",
        "sourceUrl": "https://www.lamresearch.com/products/our-processes/"
      }
    ],
    "companySlug": "lam-research"
  },
  {
    "id": "tokyo-electron",
    "name": "東京エレクトロン",
    "rank": 4,
    "salesUsdB": 15.74,
    "capabilities": [
      {
        "process": "deposition",
        "description": "CVD・ALDなどの装置で薄膜を形成する。",
        "sourceUrl": "https://www.tel.com/product/all/"
      },
      {
        "process": "etch",
        "description": "プラズマエッチングで回路構造を加工する。",
        "sourceUrl": "https://www.tel.com/product/all/"
      },
      {
        "process": "cleaning",
        "description": "枚葉・バッチ洗浄でウェーハ表面を整える。",
        "sourceUrl": "https://www.tel.com/product/all/"
      },
      {
        "process": "test",
        "description": "ウェーハプローバで電気試験の位置合わせ・接触を支える。テスタ本体とは役割が異なる。",
        "sourceUrl": "https://www.tel.com/product/all/"
      },
      {
        "process": "assembly",
        "description": "ウェーハ接合・剥離装置で3次元集積を支える。",
        "sourceUrl": "https://www.tel.com/product/all/"
      }
    ],
    "companySlug": "tokyo-electron"
  },
  {
    "id": "kla",
    "name": "KLA",
    "rank": 5,
    "salesUsdB": 12.61,
    "capabilities": [
      {
        "process": "inspection",
        "description": "欠陥検査・寸法や膜厚の計測で製造状態を把握する。",
        "sourceUrl": "https://www.kla.com/products"
      },
      {
        "process": "deposition",
        "description": "グループの成膜装置で薄膜を形成する。",
        "sourceUrl": "https://www.kla.com/products"
      },
      {
        "process": "etch",
        "description": "グループのエッチング装置で材料を加工する。",
        "sourceUrl": "https://www.kla.com/products"
      }
    ],
    "companySlug": "kla"
  },
  {
    "id": "advantest",
    "name": "アドバンテスト",
    "rank": 6,
    "salesUsdB": 6.17,
    "capabilities": [
      {
        "process": "test",
        "description": "SoC・メモリ用テストシステムで半導体の電気特性と動作を確認する。",
        "sourceUrl": "https://www.advantest.com/en/products/"
      }
    ],
    "companySlug": "advantest"
  },
  {
    "id": "naura",
    "name": "NAURA",
    "rank": 7,
    "salesUsdB": 4.09,
    "capabilities": [
      {
        "process": "deposition",
        "description": "PVD・CVDなどの装置で薄膜を形成する。",
        "sourceUrl": "https://www.naura.com/product/"
      },
      {
        "process": "etch",
        "description": "エッチング装置で材料を選択的に取り除く。",
        "sourceUrl": "https://www.naura.com/product/"
      },
      {
        "process": "cleaning",
        "description": "湿式装置で微粒子や残留物を除去する。",
        "sourceUrl": "https://www.naura.com/product/details_82_1583.html"
      }
    ]
  },
  {
    "id": "asm-international",
    "name": "ASM International",
    "rank": 8,
    "salesUsdB": 3.57,
    "capabilities": [
      {
        "process": "deposition",
        "description": "ALD・エピタキシャル成長・CVDを中心に薄膜を形成する。",
        "sourceUrl": "https://www.asm.com/our-company"
      }
    ]
  },
  {
    "id": "screen",
    "name": "SCREEN",
    "rank": 9,
    "salesUsdB": 3.16,
    "capabilities": [
      {
        "process": "cleaning",
        "description": "洗浄装置でウェーハ表面の汚染や残留物を取り除く。",
        "sourceUrl": "https://www.screen.co.jp/en/products"
      },
      {
        "process": "inspection",
        "description": "検査・計測装置でパターンや膜の状態を確認する。",
        "sourceUrl": "https://www.screen.co.jp/en/products"
      },
      {
        "process": "lithography",
        "description": "DW-3100で先端パッケージ向けに直接描画露光を行う。前工程のEUV露光とは用途が異なる。",
        "sourceUrl": "https://www.screen.co.jp/spe/products/dw-3100"
      }
    ],
    "companySlug": "screen"
  },
  {
    "id": "teradyne",
    "name": "Teradyne",
    "rank": 10,
    "salesUsdB": 2.37,
    "capabilities": [
      {
        "process": "test",
        "description": "SoC・メモリなどの自動試験装置で半導体の電気特性と動作を確認する。",
        "sourceUrl": "https://www.teradyne.com/semiconductor-testing/"
      }
    ],
    "companySlug": "teradyne"
  }
];
