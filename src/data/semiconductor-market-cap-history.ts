export type SemiconductorMarketCapHistoryEntry = {
  companyId: string;
  ticker: string;
  marketCapUsdB: number;
  sourceRank: number;
  sourceUrl: string;
};

export type SemiconductorMarketCapHistorySnapshot = {
  dataAsOf: string;
  retrievedAt: string;
  currency: string;
  sourceName: string;
  sourceUrl: string;
  entries: SemiconductorMarketCapHistoryEntry[];
};

// Values copied from the previously retained monthly ranking snapshots.
// Missing companies are omitted; no prices, shares, or estimates are used to fill gaps.
export const semiconductorMarketCapHistory: SemiconductorMarketCapHistorySnapshot[] = [
  {
    "dataAsOf": "2026-07-13",
    "retrievedAt": "2026-07-14",
    "currency": "米ドル",
    "sourceName": "CompaniesMarketCap Semiconductors",
    "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
    "entries": [
      {
        "companyId": "nvidia",
        "ticker": "NVDA",
        "marketCapUsdB": 4929,
        "sourceRank": 1,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tsmc",
        "ticker": "TSM",
        "marketCapUsdB": 2186,
        "sourceRank": 2,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "broadcom",
        "ticker": "AVGO",
        "marketCapUsdB": 1827,
        "sourceRank": 3,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "samsung-electronics",
        "ticker": "005930.KS",
        "marketCapUsdB": 1114,
        "sourceRank": 4,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "micron",
        "ticker": "MU",
        "marketCapUsdB": 1058,
        "sourceRank": 5,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "amd",
        "ticker": "AMD",
        "marketCapUsdB": 871.37,
        "sourceRank": 6,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sk-hynix",
        "ticker": "000660.KS",
        "marketCapUsdB": 819.78,
        "sourceRank": 7,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "asml",
        "ticker": "ASML",
        "marketCapUsdB": 665.24,
        "sourceRank": 8,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "intel",
        "ticker": "INTC",
        "marketCapUsdB": 518.28,
        "sourceRank": 9,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lam-research",
        "ticker": "LRCX",
        "marketCapUsdB": 412.58,
        "sourceRank": 11,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "applied-materials",
        "ticker": "AMAT",
        "marketCapUsdB": 456.83,
        "sourceRank": 10,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "texas-instruments",
        "ticker": "TXN",
        "marketCapUsdB": 271.72,
        "sourceRank": 14,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "arm",
        "ticker": "ARM",
        "marketCapUsdB": 319.34,
        "sourceRank": 12,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kla",
        "ticker": "KLAC",
        "marketCapUsdB": 290.31,
        "sourceRank": 13,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "mediatek",
        "ticker": "2454.TW",
        "marketCapUsdB": 177.08,
        "sourceRank": 19,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "marvell",
        "ticker": "MRVL",
        "marketCapUsdB": 195.24,
        "sourceRank": 15,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "analog-devices",
        "ticker": "ADI",
        "marketCapUsdB": 188.02,
        "sourceRank": 18,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "qualcomm",
        "ticker": "QCOM",
        "marketCapUsdB": 193.91,
        "sourceRank": 16,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tokyo-electron",
        "ticker": "8035.T",
        "marketCapUsdB": 193.42,
        "sourceRank": 17,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "advantest",
        "ticker": "6857.T",
        "marketCapUsdB": 128.51,
        "sourceRank": 20,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "synopsys",
        "ticker": "SNPS",
        "marketCapUsdB": 83.06,
        "sourceRank": 24,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "ase",
        "ticker": "ASX",
        "marketCapUsdB": 88.98,
        "sourceRank": 23,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cambricon",
        "ticker": "688256.SS",
        "marketCapUsdB": 122.53,
        "sourceRank": 21,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "infineon",
        "ticker": "IFX.DE",
        "marketCapUsdB": 104.18,
        "sourceRank": 22,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "naura",
        "ticker": "002371.SZ",
        "marketCapUsdB": 79.42,
        "sourceRank": 26,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "monolithic-power-systems",
        "ticker": "MPWR",
        "marketCapUsdB": 63.44,
        "sourceRank": 28,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "nxp",
        "ticker": "NXPI",
        "marketCapUsdB": 70.28,
        "sourceRank": 27,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "smic",
        "ticker": "0981.HK",
        "marketCapUsdB": 80.6,
        "sourceRank": 25,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "disco",
        "ticker": "6146.T",
        "marketCapUsdB": 46.16,
        "sourceRank": 37,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "renesas",
        "ticker": "6723.T",
        "marketCapUsdB": 48.18,
        "sourceRank": 36,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lasertec",
        "ticker": "6920.T",
        "marketCapUsdB": 24.05,
        "sourceRank": 48,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "screen",
        "ticker": "7735.T",
        "marketCapUsdB": 20.66,
        "sourceRank": 55,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kokusai-electric",
        "ticker": "6525.T",
        "marketCapUsdB": 14.11,
        "sourceRank": 67,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "rohm",
        "ticker": "6963.T",
        "marketCapUsdB": 12.13,
        "sourceRank": 70,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sumco",
        "ticker": "3436.T",
        "marketCapUsdB": 11.28,
        "sourceRank": 73,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "rorze",
        "ticker": "6323.T",
        "marketCapUsdB": 4.77,
        "sourceRank": 101,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/?page=2"
      }
    ]
  },
  {
    "dataAsOf": "2026-08-16",
    "retrievedAt": "2026-08-16",
    "currency": "米ドル",
    "sourceName": "CompaniesMarketCap Semiconductors",
    "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
    "entries": [
      {
        "companyId": "nvidia",
        "ticker": "NVDA",
        "marketCapUsdB": 5453,
        "sourceRank": 1,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tsmc",
        "ticker": "TSM",
        "marketCapUsdB": 2211,
        "sourceRank": 2,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "broadcom",
        "ticker": "AVGO",
        "marketCapUsdB": 1869,
        "sourceRank": 3,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "samsung-electronics",
        "ticker": "005930.KS",
        "marketCapUsdB": 1273,
        "sourceRank": 4,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "micron",
        "ticker": "MU",
        "marketCapUsdB": 1097,
        "sourceRank": 5,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "amd",
        "ticker": "AMD",
        "marketCapUsdB": 839.72,
        "sourceRank": 6,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sk-hynix",
        "ticker": "000660.KS",
        "marketCapUsdB": 825.1,
        "sourceRank": 7,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "asml",
        "ticker": "ASML",
        "marketCapUsdB": 708.31,
        "sourceRank": 8,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cxmt",
        "ticker": "688825.SS",
        "marketCapUsdB": 580.59,
        "sourceRank": 9,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "intel",
        "ticker": "INTC",
        "marketCapUsdB": 541.82,
        "sourceRank": 10,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lam-research",
        "ticker": "LRCX",
        "marketCapUsdB": 415.88,
        "sourceRank": 11,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "applied-materials",
        "ticker": "AMAT",
        "marketCapUsdB": 402.68,
        "sourceRank": 12,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "texas-instruments",
        "ticker": "TXN",
        "marketCapUsdB": 255.32,
        "sourceRank": 15,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "arm",
        "ticker": "ARM",
        "marketCapUsdB": 298.44,
        "sourceRank": 13,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kla",
        "ticker": "KLAC",
        "marketCapUsdB": 266.16,
        "sourceRank": 14,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "mediatek",
        "ticker": "2454.TW",
        "marketCapUsdB": 210.03,
        "sourceRank": 16,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "marvell",
        "ticker": "MRVL",
        "marketCapUsdB": 199.27,
        "sourceRank": 17,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "analog-devices",
        "ticker": "ADI",
        "marketCapUsdB": 189.66,
        "sourceRank": 18,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "qualcomm",
        "ticker": "QCOM",
        "marketCapUsdB": 174.07,
        "sourceRank": 19,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tokyo-electron",
        "ticker": "8035.T",
        "marketCapUsdB": 168.7,
        "sourceRank": 20,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "advantest",
        "ticker": "6857.T",
        "marketCapUsdB": 167.53,
        "sourceRank": 21,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "synopsys",
        "ticker": "SNPS",
        "marketCapUsdB": 80.7,
        "sourceRank": 25,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "ase",
        "ticker": "ASX",
        "marketCapUsdB": 102.94,
        "sourceRank": 22,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cambricon",
        "ticker": "688256.SS",
        "marketCapUsdB": 102.03,
        "sourceRank": 23,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "infineon",
        "ticker": "IFX.DE",
        "marketCapUsdB": 92.79,
        "sourceRank": 24,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "naura",
        "ticker": "002371.SZ",
        "marketCapUsdB": 79.64,
        "sourceRank": 26,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "monolithic-power-systems",
        "ticker": "MPWR",
        "marketCapUsdB": 68.89,
        "sourceRank": 28,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "nxp",
        "ticker": "NXPI",
        "marketCapUsdB": 59.18,
        "sourceRank": 30,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "smic",
        "ticker": "0981.HK",
        "marketCapUsdB": 77.23,
        "sourceRank": 27,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "disco",
        "ticker": "6146.T",
        "marketCapUsdB": 44.56,
        "sourceRank": 39,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "renesas",
        "ticker": "6723.T",
        "marketCapUsdB": 42.95,
        "sourceRank": 42,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lasertec",
        "ticker": "6920.T",
        "marketCapUsdB": 21.83,
        "sourceRank": 52,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "screen",
        "ticker": "7735.T",
        "marketCapUsdB": 16.93,
        "sourceRank": 60,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kokusai-electric",
        "ticker": "6525.T",
        "marketCapUsdB": 13.45,
        "sourceRank": 66,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "rohm",
        "ticker": "6963.T",
        "marketCapUsdB": 12.15,
        "sourceRank": 71,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sumco",
        "ticker": "3436.T",
        "marketCapUsdB": 8.6,
        "sourceRank": 84,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "maruwa",
        "ticker": "5344.T",
        "marketCapUsdB": 4.72,
        "sourceRank": 101,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/?page=2"
      }
    ]
  },
  {
    "dataAsOf": "2026-09-06",
    "retrievedAt": "2026-09-06",
    "currency": "米ドル",
    "sourceName": "CompaniesMarketCap Semiconductors",
    "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
    "entries": [
      {
        "companyId": "nvidia",
        "ticker": "NVDA",
        "marketCapUsdB": 5562,
        "sourceRank": 1,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tsmc",
        "ticker": "TSM",
        "marketCapUsdB": 2224,
        "sourceRank": 2,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "broadcom",
        "ticker": "AVGO",
        "marketCapUsdB": 1702,
        "sourceRank": 3,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "samsung-electronics",
        "ticker": "005930.KS",
        "marketCapUsdB": 1246,
        "sourceRank": 4,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "micron",
        "ticker": "MU",
        "marketCapUsdB": 1148,
        "sourceRank": 5,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "amd",
        "ticker": "AMD",
        "marketCapUsdB": 779.62,
        "sourceRank": 7,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sk-hynix",
        "ticker": "000660.KS",
        "marketCapUsdB": 868.51,
        "sourceRank": 6,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "asml",
        "ticker": "ASML",
        "marketCapUsdB": 658.68,
        "sourceRank": 8,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cxmt",
        "ticker": "688825.SS",
        "marketCapUsdB": 579.19,
        "sourceRank": 9,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "intel",
        "ticker": "INTC",
        "marketCapUsdB": 506.4,
        "sourceRank": 10,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lam-research",
        "ticker": "LRCX",
        "marketCapUsdB": 384.96,
        "sourceRank": 11,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "applied-materials",
        "ticker": "AMAT",
        "marketCapUsdB": 360.85,
        "sourceRank": 12,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "texas-instruments",
        "ticker": "TXN",
        "marketCapUsdB": 236.01,
        "sourceRank": 15,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "arm",
        "ticker": "ARM",
        "marketCapUsdB": 269.23,
        "sourceRank": 13,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kla",
        "ticker": "KLAC",
        "marketCapUsdB": 242.49,
        "sourceRank": 14,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "mediatek",
        "ticker": "2454.TW",
        "marketCapUsdB": 223.14,
        "sourceRank": 16,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "marvell",
        "ticker": "MRVL",
        "marketCapUsdB": 200.9,
        "sourceRank": 17,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "analog-devices",
        "ticker": "ADI",
        "marketCapUsdB": 175.53,
        "sourceRank": 19,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "qualcomm",
        "ticker": "QCOM",
        "marketCapUsdB": 180.22,
        "sourceRank": 18,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tokyo-electron",
        "ticker": "8035.T",
        "marketCapUsdB": 155.14,
        "sourceRank": 20,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "advantest",
        "ticker": "6857.T",
        "marketCapUsdB": 153.07,
        "sourceRank": 21,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "synopsys",
        "ticker": "SNPS",
        "marketCapUsdB": 75.47,
        "sourceRank": 25,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "ase",
        "ticker": "ASX",
        "marketCapUsdB": 97.66,
        "sourceRank": 23,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cambricon",
        "ticker": "688256.SS",
        "marketCapUsdB": 100.61,
        "sourceRank": 22,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "infineon",
        "ticker": "IFX.DE",
        "marketCapUsdB": 85.82,
        "sourceRank": 24,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "naura",
        "ticker": "002371.SZ",
        "marketCapUsdB": 69.12,
        "sourceRank": 27,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "monolithic-power-systems",
        "ticker": "MPWR",
        "marketCapUsdB": 60.14,
        "sourceRank": 28,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "nxp",
        "ticker": "NXPI",
        "marketCapUsdB": 57.45,
        "sourceRank": 29,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "smic",
        "ticker": "0981.HK",
        "marketCapUsdB": 73.37,
        "sourceRank": 26,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "disco",
        "ticker": "6146.T",
        "marketCapUsdB": 37.83,
        "sourceRank": 41,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "renesas",
        "ticker": "6723.T",
        "marketCapUsdB": 38.64,
        "sourceRank": 40,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lasertec",
        "ticker": "6920.T",
        "marketCapUsdB": 19.04,
        "sourceRank": 53,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "screen",
        "ticker": "7735.T",
        "marketCapUsdB": 15.78,
        "sourceRank": 61,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kokusai-electric",
        "ticker": "6525.T",
        "marketCapUsdB": 12.39,
        "sourceRank": 66,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "rohm",
        "ticker": "6963.T",
        "marketCapUsdB": 12.02,
        "sourceRank": 67,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sumco",
        "ticker": "3436.T",
        "marketCapUsdB": 7.23,
        "sourceRank": 87,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "maruwa",
        "ticker": "5344.T",
        "marketCapUsdB": 4.22,
        "sourceRank": 102,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/?page=2"
      }
    ]
  },
  {
    "dataAsOf": "2026-10-01",
    "retrievedAt": "2026-10-01",
    "currency": "米ドル",
    "sourceName": "CompaniesMarketCap Semiconductors",
    "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/",
    "entries": [
      {
        "companyId": "nvidia",
        "ticker": "NVDA",
        "marketCapUsdB": 5486,
        "sourceRank": 1,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tsmc",
        "ticker": "TSM",
        "marketCapUsdB": 2369,
        "sourceRank": 2,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "broadcom",
        "ticker": "AVGO",
        "marketCapUsdB": 1695,
        "sourceRank": 3,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "samsung-electronics",
        "ticker": "005930.KS",
        "marketCapUsdB": 1301,
        "sourceRank": 4,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "micron",
        "ticker": "MU",
        "marketCapUsdB": 1202,
        "sourceRank": 5,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "amd",
        "ticker": "AMD",
        "marketCapUsdB": 991.84,
        "sourceRank": 6,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sk-hynix",
        "ticker": "000660.KS",
        "marketCapUsdB": 930.28,
        "sourceRank": 7,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "asml",
        "ticker": "ASML",
        "marketCapUsdB": 704.58,
        "sourceRank": 8,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cxmt",
        "ticker": "688825.SS",
        "marketCapUsdB": 578.87,
        "sourceRank": 10,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "intel",
        "ticker": "INTC",
        "marketCapUsdB": 612.81,
        "sourceRank": 9,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lam-research",
        "ticker": "LRCX",
        "marketCapUsdB": 405.28,
        "sourceRank": 12,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "applied-materials",
        "ticker": "AMAT",
        "marketCapUsdB": 406.32,
        "sourceRank": 11,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "texas-instruments",
        "ticker": "TXN",
        "marketCapUsdB": 257.25,
        "sourceRank": 14,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "arm",
        "ticker": "ARM",
        "marketCapUsdB": 313.63,
        "sourceRank": 13,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kla",
        "ticker": "KLAC",
        "marketCapUsdB": 256.47,
        "sourceRank": 15,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "mediatek",
        "ticker": "2454.TW",
        "marketCapUsdB": 246.71,
        "sourceRank": 16,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "marvell",
        "ticker": "MRVL",
        "marketCapUsdB": 236.6,
        "sourceRank": 17,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "analog-devices",
        "ticker": "ADI",
        "marketCapUsdB": 192.96,
        "sourceRank": 19,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "qualcomm",
        "ticker": "QCOM",
        "marketCapUsdB": 196.62,
        "sourceRank": 18,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "tokyo-electron",
        "ticker": "8035.T",
        "marketCapUsdB": 171.02,
        "sourceRank": 20,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "advantest",
        "ticker": "6857.T",
        "marketCapUsdB": 157.62,
        "sourceRank": 21,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "synopsys",
        "ticker": "SNPS",
        "marketCapUsdB": 79.54,
        "sourceRank": 25,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "ase",
        "ticker": "ASX",
        "marketCapUsdB": 117.97,
        "sourceRank": 22,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "cambricon",
        "ticker": "688256.SS",
        "marketCapUsdB": 94.66,
        "sourceRank": 23,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "infineon",
        "ticker": "IFX.DE",
        "marketCapUsdB": 87.65,
        "sourceRank": 24,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "naura",
        "ticker": "002371.SZ",
        "marketCapUsdB": 66.69,
        "sourceRank": 26,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "monolithic-power-systems",
        "ticker": "MPWR",
        "marketCapUsdB": 66.63,
        "sourceRank": 27,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "smic",
        "ticker": "0981.HK",
        "marketCapUsdB": 66.18,
        "sourceRank": 28,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "umc",
        "ticker": "UMC",
        "marketCapUsdB": 61.99,
        "sourceRank": 30,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "disco",
        "ticker": "6146.T",
        "marketCapUsdB": 39.71,
        "sourceRank": 40,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "renesas",
        "ticker": "6723.T",
        "marketCapUsdB": 40.49,
        "sourceRank": 39,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "lasertec",
        "ticker": "6920.T",
        "marketCapUsdB": 23.51,
        "sourceRank": 51,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "screen",
        "ticker": "7735.T",
        "marketCapUsdB": 17.52,
        "sourceRank": 58,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "kokusai-electric",
        "ticker": "6525.T",
        "marketCapUsdB": 14.24,
        "sourceRank": 64,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "rohm",
        "ticker": "6963.T",
        "marketCapUsdB": 12.15,
        "sourceRank": 71,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "sumco",
        "ticker": "3436.T",
        "marketCapUsdB": 7.39,
        "sourceRank": 87,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/"
      },
      {
        "companyId": "rorze",
        "ticker": "6323.T",
        "marketCapUsdB": 4.41,
        "sourceRank": 103,
        "sourceUrl": "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/?page=2"
      }
    ]
  }
];
