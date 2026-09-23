import type { RankingCompany, RankingSnapshot } from './ranking-time-machine';

// CompaniesMarketCap End of year Market Cap, checked 2026-09-23. USD billions.
// Tokyo Electron is reused from ranking-time-machine; no duplicate values.
export const japanCompanies: readonly (RankingCompany & { businessSourceUrl: string })[] = [
  {
    "id": "advantest",
    "logoUrl": "/images/company-logos/advantest.png",
    "logoAspectRatio": 8.258065,
    "name": "アドバンテスト",
    "category": "装置・検査",
    "sourceUrl": "https://companiesmarketcap.com/advantest/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.advantest.com/ja/products/semiconductor-test-system/",
    "companySlug": "advantest"
  },
  {
    "id": "disco",
    "logoUrl": "/images/company-logos/disco.png",
    "logoAspectRatio": 1.0,
    "name": "ディスコ",
    "category": "装置・検査",
    "sourceUrl": "https://companiesmarketcap.com/disco-corp/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://disco.co.jp/jp/introduction/index.html"
  },
  {
    "id": "screen-holdings",
    "logoUrl": "/images/company-logos/screen-holdings.png",
    "logoAspectRatio": 7.757576,
    "name": "SCREENホールディングス",
    "category": "装置・検査",
    "sourceUrl": "https://companiesmarketcap.com/screen-holdings/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.screen.co.jp/products"
  },
  {
    "id": "lasertec",
    "logoUrl": "/images/company-logos/lasertec.png",
    "logoAspectRatio": 4.571429,
    "name": "レーザーテック",
    "category": "装置・検査",
    "sourceUrl": "https://companiesmarketcap.com/lasertec/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.lasertec.co.jp/ir/individuals/semiconductor.html"
  },
  {
    "id": "renesas",
    "logoUrl": "/images/company-logos/renesas.png",
    "logoAspectRatio": 6.243902,
    "name": "ルネサス エレクトロニクス",
    "category": "半導体メーカー",
    "sourceUrl": "https://companiesmarketcap.com/renesas-electronics/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.renesas.com/ja/about",
    "companySlug": "renesas"
  },
  {
    "id": "rohm",
    "logoUrl": "/images/company-logos/rohm.png",
    "logoAspectRatio": 1.299492,
    "name": "ローム",
    "category": "半導体メーカー",
    "sourceUrl": "https://companiesmarketcap.com/rohm/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.rohm.co.jp/company",
    "companySlug": "rohm"
  },
  {
    "id": "shin-etsu-chemical",
    "logoUrl": "/images/company-logos/shin-etsu-chemical.png",
    "logoAspectRatio": 4.491228,
    "name": "信越化学",
    "category": "材料",
    "sourceUrl": "https://companiesmarketcap.com/shin-etsu-chemical/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.shinetsu.co.jp/jp/products/"
  },
  {
    "id": "sumco",
    "logoUrl": "/images/company-logos/sumco.png",
    "logoAspectRatio": 2.694737,
    "name": "SUMCO",
    "category": "材料",
    "sourceUrl": "https://companiesmarketcap.com/sumco-corporation/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.sumcosi.com/products/"
  },
  {
    "id": "tokyo-ohka-kogyo",
    "logoUrl": "/images/company-logos/tokyo-ohka-kogyo.png",
    "logoAspectRatio": 2.694737,
    "name": "東京応化工業",
    "category": "材料",
    "sourceUrl": "https://companiesmarketcap.com/tokyo-ohka-kogyo/marketcap/",
    "checkedAt": "2026-09-23",
    "country": "日本",
    "businessSourceUrl": "https://www.tok.co.jp/products"
  }
];

export const japanSnapshots: readonly RankingSnapshot[] = [
  {
    "year": 2010,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 3.9
      },
      {
        "companyId": "disco",
        "valueUsdB": 2.03
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 1.68
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.13
      },
      {
        "companyId": "renesas",
        "valueUsdB": 4.16
      },
      {
        "companyId": "rohm",
        "valueUsdB": 7.16
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 22.92
      },
      {
        "companyId": "sumco",
        "valueUsdB": 3.99
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 0.83
      }
    ]
  },
  {
    "year": 2011,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 1.63
      },
      {
        "companyId": "disco",
        "valueUsdB": 1.74
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 2.0
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.15
      },
      {
        "companyId": "renesas",
        "valueUsdB": 2.52
      },
      {
        "companyId": "rohm",
        "valueUsdB": 4.84
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 20.72
      },
      {
        "companyId": "sumco",
        "valueUsdB": 1.9
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 0.89
      }
    ]
  },
  {
    "year": 2012,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 2.72
      },
      {
        "companyId": "disco",
        "valueUsdB": 1.75
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 1.44
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.2
      },
      {
        "companyId": "renesas",
        "valueUsdB": 1.47
      },
      {
        "companyId": "rohm",
        "valueUsdB": 3.49
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 25.83
      },
      {
        "companyId": "sumco",
        "valueUsdB": 1.73
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 0.95
      }
    ]
  },
  {
    "year": 2013,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 2.16
      },
      {
        "companyId": "disco",
        "valueUsdB": 2.24
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 1.34
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.21
      },
      {
        "companyId": "renesas",
        "valueUsdB": 9.85
      },
      {
        "companyId": "rohm",
        "valueUsdB": 5.26
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 24.86
      },
      {
        "companyId": "sumco",
        "valueUsdB": 2.5
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 0.9
      }
    ]
  },
  {
    "year": 2014,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 2.2
      },
      {
        "companyId": "disco",
        "valueUsdB": 2.88
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 1.42
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.25
      },
      {
        "companyId": "renesas",
        "valueUsdB": 11.48
      },
      {
        "companyId": "rohm",
        "valueUsdB": 6.64
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 28.03
      },
      {
        "companyId": "sumco",
        "valueUsdB": 3.28
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.32
      }
    ]
  },
  {
    "year": 2015,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 1.46
      },
      {
        "companyId": "disco",
        "valueUsdB": 3.41
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 1.76
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.25
      },
      {
        "companyId": "renesas",
        "valueUsdB": 10.65
      },
      {
        "companyId": "rohm",
        "valueUsdB": 5.53
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 23.39
      },
      {
        "companyId": "sumco",
        "valueUsdB": 2.98
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.4
      }
    ]
  },
  {
    "year": 2016,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 2.96
      },
      {
        "companyId": "disco",
        "valueUsdB": 4.36
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 2.93
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 0.44
      },
      {
        "companyId": "renesas",
        "valueUsdB": 13.3
      },
      {
        "companyId": "rohm",
        "valueUsdB": 5.99
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 33.21
      },
      {
        "companyId": "sumco",
        "valueUsdB": 3.79
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.45
      }
    ]
  },
  {
    "year": 2017,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 3.27
      },
      {
        "companyId": "disco",
        "valueUsdB": 7.97
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 3.84
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 1.13
      },
      {
        "companyId": "renesas",
        "valueUsdB": 19.39
      },
      {
        "companyId": "rohm",
        "valueUsdB": 11.69
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 43.25
      },
      {
        "companyId": "sumco",
        "valueUsdB": 7.51
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.82
      }
    ]
  },
  {
    "year": 2018,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 3.64
      },
      {
        "companyId": "disco",
        "valueUsdB": 4.18
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 1.94
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 1.14
      },
      {
        "companyId": "renesas",
        "valueUsdB": 7.56
      },
      {
        "companyId": "rohm",
        "valueUsdB": 6.69
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 33.0
      },
      {
        "companyId": "sumco",
        "valueUsdB": 4.24
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.23
      }
    ]
  },
  {
    "year": 2019,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 11.19
      },
      {
        "companyId": "disco",
        "valueUsdB": 8.55
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 3.21
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 4.6
      },
      {
        "companyId": "renesas",
        "valueUsdB": 11.78
      },
      {
        "companyId": "rohm",
        "valueUsdB": 8.27
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 46.05
      },
      {
        "companyId": "sumco",
        "valueUsdB": 4.52
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.55
      }
    ]
  },
  {
    "year": 2020,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 14.7
      },
      {
        "companyId": "disco",
        "valueUsdB": 12.14
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 3.44
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 10.59
      },
      {
        "companyId": "renesas",
        "valueUsdB": 18.12
      },
      {
        "companyId": "rohm",
        "valueUsdB": 8.82
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 72.64
      },
      {
        "companyId": "sumco",
        "valueUsdB": 6.38
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 2.91
      }
    ]
  },
  {
    "year": 2021,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 18.21
      },
      {
        "companyId": "disco",
        "valueUsdB": 11.02
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 5.0
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 27.65
      },
      {
        "companyId": "renesas",
        "valueUsdB": 24.02
      },
      {
        "companyId": "rohm",
        "valueUsdB": 8.92
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 71.9
      },
      {
        "companyId": "sumco",
        "valueUsdB": 7.14
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 2.37
      }
    ]
  },
  {
    "year": 2022,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 11.7
      },
      {
        "companyId": "disco",
        "valueUsdB": 10.18
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 3.01
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 14.66
      },
      {
        "companyId": "renesas",
        "valueUsdB": 15.84
      },
      {
        "companyId": "rohm",
        "valueUsdB": 6.99
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 49.07
      },
      {
        "companyId": "sumco",
        "valueUsdB": 4.7
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 1.83
      }
    ]
  },
  {
    "year": 2023,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 25.06
      },
      {
        "companyId": "disco",
        "valueUsdB": 26.87
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 8.05
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 23.77
      },
      {
        "companyId": "renesas",
        "valueUsdB": 31.9
      },
      {
        "companyId": "rohm",
        "valueUsdB": 7.39
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 83.77
      },
      {
        "companyId": "sumco",
        "valueUsdB": 5.25
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 2.66
      }
    ]
  },
  {
    "year": 2024,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 44.17
      },
      {
        "companyId": "disco",
        "valueUsdB": 30.04
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 5.88
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 8.71
      },
      {
        "companyId": "renesas",
        "valueUsdB": 23.43
      },
      {
        "companyId": "rohm",
        "valueUsdB": 3.64
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 66.83
      },
      {
        "companyId": "sumco",
        "valueUsdB": 2.63
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 2.69
      }
    ]
  },
  {
    "year": 2025,
    "entries": [
      {
        "companyId": "advantest",
        "valueUsdB": 93.92
      },
      {
        "companyId": "disco",
        "valueUsdB": 33.84
      },
      {
        "companyId": "screen-holdings",
        "valueUsdB": 9.11
      },
      {
        "companyId": "lasertec",
        "valueUsdB": 17.26
      },
      {
        "companyId": "renesas",
        "valueUsdB": 24.98
      },
      {
        "companyId": "rohm",
        "valueUsdB": 5.56
      },
      {
        "companyId": "shin-etsu-chemical",
        "valueUsdB": 58.56
      },
      {
        "companyId": "sumco",
        "valueUsdB": 3.2
      },
      {
        "companyId": "tokyo-ohka-kogyo",
        "valueUsdB": 4.44
      }
    ]
  }
];
