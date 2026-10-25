export type SemiconductorMarketCapChartHistoryEntry = {
  companyId: string;
  ticker: string;
  observedAt: string;
  marketCapUsdB: number;
  sourceUrl: string;
};

export type SemiconductorMarketCapChartHistorySnapshot = {
  periodMonths: number;
  targetDate: string;
  retrievedAt: string;
  currency: string;
  sourceName: string;
  sourceUrl: string;
  entries: SemiconductorMarketCapChartHistoryEntry[];
};

type ChartPoint = Omit<SemiconductorMarketCapChartHistoryEntry, "sourceUrl"> & {
  sourcePath: string;
};

function chartEntries(points: ChartPoint[]): SemiconductorMarketCapChartHistoryEntry[] {
  return points.map(({ sourcePath, ...point }) => ({
    ...point,
    sourceUrl: `https://companiesmarketcap.com${sourcePath}`,
  }));
}

const sourceUrl = "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/";
const retrievedAt = "2026-10-25";
const sourceName = "CompaniesMarketCap";

// Each value is the chart's direct market-cap observation on or before the target date.
// The chart's `m` value was converted to USD billions (m / 10,000); no stock price or share-count calculation is used.
export const semiconductorMarketCapChartHistory: SemiconductorMarketCapChartHistorySnapshot[] = [
  {
    periodMonths: 6,
    targetDate: "2026-04-16",
    retrievedAt,
    currency: "米ドル",
    sourceName,
    sourceUrl,
    entries: chartEntries([
      { companyId: "nvidia", ticker: "NVDA", observedAt: "2026-04-11", marketCapUsdB: 4584.65, sourcePath: "/nvidia/marketcap/" },
      { companyId: "tsmc", ticker: "TSM", observedAt: "2026-04-11", marketCapUsdB: 1922.12, sourcePath: "/tsmc/marketcap/" },
      { companyId: "broadcom", ticker: "AVGO", observedAt: "2026-04-11", marketCapUsdB: 1761.62, sourcePath: "/broadcom/marketcap/" },
      { companyId: "samsung-electronics", ticker: "005930.KS", observedAt: "2026-04-11", marketCapUsdB: 915.76, sourcePath: "/samsung/marketcap/" },
      { companyId: "micron", ticker: "MU", observedAt: "2026-04-11", marketCapUsdB: 474.31, sourcePath: "/micron-technology/marketcap/" },
      { companyId: "amd", ticker: "AMD", observedAt: "2026-04-11", marketCapUsdB: 399.52, sourcePath: "/amd/marketcap/" },
      { companyId: "sk-hynix", ticker: "000660.KS", observedAt: "2026-04-11", marketCapUsdB: 490.08, sourcePath: "/sk-hynix/marketcap/" },
      { companyId: "asml", ticker: "ASML", observedAt: "2026-04-11", marketCapUsdB: 580.46, sourcePath: "/asml/marketcap/" },
      { companyId: "intel", ticker: "INTC", observedAt: "2026-04-11", marketCapUsdB: 313.21, sourcePath: "/intel/marketcap/" },
      { companyId: "applied-materials", ticker: "AMAT", observedAt: "2026-04-11", marketCapUsdB: 317.04, sourcePath: "/applied-materials/marketcap/" },
      { companyId: "lam-research", ticker: "LRCX", observedAt: "2026-04-11", marketCapUsdB: 331.16, sourcePath: "/lam-research/marketcap/" },
      { companyId: "texas-instruments", ticker: "TXN", observedAt: "2026-04-11", marketCapUsdB: 195.5, sourcePath: "/texas-instruments/marketcap/" },
      { companyId: "arm", ticker: "ARM", observedAt: "2026-04-11", marketCapUsdB: 158.16, sourcePath: "/arm-holdings/marketcap/" },
      { companyId: "marvell", ticker: "MRVL", observedAt: "2026-04-11", marketCapUsdB: 112.36, sourcePath: "/marvell/marketcap/" },
      { companyId: "mediatek", ticker: "2454.TW", observedAt: "2026-04-11", marketCapUsdB: 79.2, sourcePath: "/mediatek/marketcap/" },
      { companyId: "kla", ticker: "KLAC", observedAt: "2026-04-11", marketCapUsdB: 228.27, sourcePath: "/kla/marketcap/" },
      { companyId: "analog-devices", ticker: "ADI", observedAt: "2026-04-11", marketCapUsdB: 170.94, sourcePath: "/analog-devices/marketcap/" },
      { companyId: "qualcomm", ticker: "QCOM", observedAt: "2026-04-11", marketCapUsdB: 136.77, sourcePath: "/qualcomm/marketcap/" },
      { companyId: "tokyo-electron", ticker: "8035.T", observedAt: "2026-04-11", marketCapUsdB: 126.28, sourcePath: "/tokyo-electron/marketcap/" },
      { companyId: "advantest", ticker: "6857.T", observedAt: "2026-04-11", marketCapUsdB: 113.88, sourcePath: "/advantest/marketcap/" },
      { companyId: "cambricon", ticker: "688256.SS", observedAt: "2026-04-11", marketCapUsdB: 74.78, sourcePath: "/cambricon-technologies/marketcap/" },
      { companyId: "ase", ticker: "ASX", observedAt: "2026-04-11", marketCapUsdB: 54.41, sourcePath: "/ase-group/marketcap/" },
      { companyId: "synopsys", ticker: "SNPS", observedAt: "2026-04-11", marketCapUsdB: 75.14, sourcePath: "/synopsys/marketcap/" },
      { companyId: "infineon", ticker: "IFX.DE", observedAt: "2026-04-11", marketCapUsdB: 65.38, sourcePath: "/infineon/marketcap/" },
      { companyId: "nxp", ticker: "NXPI", observedAt: "2026-04-11", marketCapUsdB: 51.64, sourcePath: "/nxp-semiconductors/marketcap/" },
      { companyId: "naura", ticker: "002371.SZ", observedAt: "2026-04-11", marketCapUsdB: 50.63, sourcePath: "/naura-technology-group/marketcap/" },
      { companyId: "monolithic-power-systems", ticker: "MPWR", observedAt: "2026-04-11", marketCapUsdB: 66.5, sourcePath: "/monolithic-power-systems/marketcap/" },
      { companyId: "smic", ticker: "0981.HK", observedAt: "2026-04-11", marketCapUsdB: 75.34, sourcePath: "/smic/marketcap/" },
      { companyId: "umc", ticker: "UMC", observedAt: "2026-04-11", marketCapUsdB: 24.72, sourcePath: "/united-microelectronics/marketcap/" },
      { companyId: "disco", ticker: "6146.T", observedAt: "2026-04-11", marketCapUsdB: 45.52, sourcePath: "/disco-corp/marketcap/" },
      { companyId: "renesas", ticker: "6723.T", observedAt: "2026-04-11", marketCapUsdB: 30.24, sourcePath: "/renesas-electronics/marketcap/" },
      { companyId: "lasertec", ticker: "6920.T", observedAt: "2026-04-11", marketCapUsdB: 23.39, sourcePath: "/lasertec/marketcap/" },
      { companyId: "screen", ticker: "7735.T", observedAt: "2026-04-11", marketCapUsdB: 12.75, sourcePath: "/screen-holdings/marketcap/" },
      { companyId: "kokusai-electric", ticker: "6525.T", observedAt: "2026-04-11", marketCapUsdB: 10.05, sourcePath: "/kokusai-electric-corporation/marketcap/" },
      { companyId: "rohm", ticker: "6963.T", observedAt: "2026-04-11", marketCapUsdB: 8.85, sourcePath: "/rohm/marketcap/" },
      { companyId: "sumco", ticker: "3436.T", observedAt: "2026-04-11", marketCapUsdB: 4.46, sourcePath: "/sumco-corporation/marketcap/" },
      { companyId: "rorze", ticker: "6323.T", observedAt: "2026-04-11", marketCapUsdB: 4.32, sourcePath: "/rorze-corporation/marketcap/" },
      { companyId: "maruwa", ticker: "5344.T", observedAt: "2026-04-11", marketCapUsdB: 4.97, sourcePath: "/maruwa/marketcap/" },
      { companyId: "micronics-japan", ticker: "6871.T", observedAt: "2026-03-31", marketCapUsdB: 2.26, sourcePath: "/micronics-japan/marketcap/" },
      { companyId: "tekscend-photomask", ticker: "429A.T", observedAt: "2026-04-11", marketCapUsdB: 2.03, sourcePath: "/tekscend-photomask/marketcap/" },
      { companyId: "socionext", ticker: "6526.T", observedAt: "2026-04-11", marketCapUsdB: 1.98, sourcePath: "/socionext/marketcap/" },
      { companyId: "tomen-devices", ticker: "2737.T", observedAt: "2026-03-31", marketCapUsdB: 0.5, sourcePath: "/tomen-devices-corporation/marketcap/" },
      { companyId: "towa", ticker: "6315.T", observedAt: "2026-04-11", marketCapUsdB: 1.29, sourcePath: "/towa-corporation/marketcap/" },
      { companyId: "rs-technologies", ticker: "3445.T", observedAt: "2026-04-11", marketCapUsdB: 0.72, sourcePath: "/rs-technologies/marketcap/" },
      { companyId: "sanken-electric", ticker: "6707.T", observedAt: "2026-03-31", marketCapUsdB: 0.89, sourcePath: "/sanken-electric/marketcap/" },
    ]),
  },
  {
    periodMonths: 12,
    targetDate: "2025-10-16",
    retrievedAt,
    currency: "米ドル",
    sourceName,
    sourceUrl,
    entries: chartEntries([
      { companyId: "nvidia", ticker: "NVDA", observedAt: "2025-10-13", marketCapUsdB: 4609.86, sourcePath: "/nvidia/marketcap/" },
      { companyId: "tsmc", ticker: "TSM", observedAt: "2025-10-13", marketCapUsdB: 1575.56, sourcePath: "/tsmc/marketcap/" },
      { companyId: "broadcom", ticker: "AVGO", observedAt: "2025-10-13", marketCapUsdB: 1690.01, sourcePath: "/broadcom/marketcap/" },
      { companyId: "samsung-electronics", ticker: "005930.KS", observedAt: "2025-10-13", marketCapUsdB: 425.99, sourcePath: "/samsung/marketcap/" },
      { companyId: "micron", ticker: "MU", observedAt: "2025-10-13", marketCapUsdB: 214.88, sourcePath: "/micron-technology/marketcap/" },
      { companyId: "amd", ticker: "AMD", observedAt: "2025-10-13", marketCapUsdB: 355.43, sourcePath: "/amd/marketcap/" },
      { companyId: "sk-hynix", ticker: "000660.KS", observedAt: "2025-10-13", marketCapUsdB: 200.81, sourcePath: "/sk-hynix/marketcap/" },
      { companyId: "asml", ticker: "ASML", observedAt: "2025-10-13", marketCapUsdB: 402.11, sourcePath: "/asml/marketcap/" },
      { companyId: "intel", ticker: "INTC", observedAt: "2025-10-13", marketCapUsdB: 177.49, sourcePath: "/intel/marketcap/" },
      { companyId: "applied-materials", ticker: "AMAT", observedAt: "2025-10-13", marketCapUsdB: 175.15, sourcePath: "/applied-materials/marketcap/" },
      { companyId: "lam-research", ticker: "LRCX", observedAt: "2025-10-13", marketCapUsdB: 174.08, sourcePath: "/lam-research/marketcap/" },
      { companyId: "texas-instruments", ticker: "TXN", observedAt: "2025-10-13", marketCapUsdB: 159.78, sourcePath: "/texas-instruments/marketcap/" },
      { companyId: "arm", ticker: "ARM", observedAt: "2025-10-13", marketCapUsdB: 180.81, sourcePath: "/arm-holdings/marketcap/" },
      { companyId: "marvell", ticker: "MRVL", observedAt: "2025-10-13", marketCapUsdB: 76.76, sourcePath: "/marvell/marketcap/" },
      { companyId: "mediatek", ticker: "2454.TW", observedAt: "2025-10-13", marketCapUsdB: 68.39, sourcePath: "/mediatek/marketcap/" },
      { companyId: "kla", ticker: "KLAC", observedAt: "2025-10-13", marketCapUsdB: 135.82, sourcePath: "/kla/marketcap/" },
      { companyId: "analog-devices", ticker: "ADI", observedAt: "2025-10-13", marketCapUsdB: 115.55, sourcePath: "/analog-devices/marketcap/" },
      { companyId: "qualcomm", ticker: "QCOM", observedAt: "2025-10-13", marketCapUsdB: 174, sourcePath: "/qualcomm/marketcap/" },
      { companyId: "tokyo-electron", ticker: "8035.T", observedAt: "2025-10-13", marketCapUsdB: 88.13, sourcePath: "/tokyo-electron/marketcap/" },
      { companyId: "advantest", ticker: "6857.T", observedAt: "2025-10-13", marketCapUsdB: 85.76, sourcePath: "/advantest/marketcap/" },
      { companyId: "cambricon", ticker: "688256.SS", observedAt: "2025-10-13", marketCapUsdB: 74.04, sourcePath: "/cambricon-technologies/marketcap/" },
      { companyId: "ase", ticker: "ASX", observedAt: "2025-10-13", marketCapUsdB: 26.87, sourcePath: "/ase-group/marketcap/" },
      { companyId: "synopsys", ticker: "SNPS", observedAt: "2025-10-13", marketCapUsdB: 84.08, sourcePath: "/synopsys/marketcap/" },
      { companyId: "infineon", ticker: "IFX.DE", observedAt: "2025-10-13", marketCapUsdB: 49.01, sourcePath: "/infineon/marketcap/" },
      { companyId: "nxp", ticker: "NXPI", observedAt: "2025-10-13", marketCapUsdB: 54.56, sourcePath: "/nxp-semiconductors/marketcap/" },
      { companyId: "naura", ticker: "002371.SZ", observedAt: "2025-10-13", marketCapUsdB: 44.25, sourcePath: "/naura-technology-group/marketcap/" },
      { companyId: "monolithic-power-systems", ticker: "MPWR", observedAt: "2025-10-13", marketCapUsdB: 47.41, sourcePath: "/monolithic-power-systems/marketcap/" },
      { companyId: "smic", ticker: "0981.HK", observedAt: "2025-10-13", marketCapUsdB: 98.93, sourcePath: "/smic/marketcap/" },
      { companyId: "umc", ticker: "UMC", observedAt: "2025-10-13", marketCapUsdB: 19.82, sourcePath: "/united-microelectronics/marketcap/" },
      { companyId: "disco", ticker: "6146.T", observedAt: "2025-10-13", marketCapUsdB: 38.24, sourcePath: "/disco-corp/marketcap/" },
      { companyId: "renesas", ticker: "6723.T", observedAt: "2025-10-13", marketCapUsdB: 21.36, sourcePath: "/renesas-electronics/marketcap/" },
      { companyId: "lasertec", ticker: "6920.T", observedAt: "2025-10-13", marketCapUsdB: 11.97, sourcePath: "/lasertec/marketcap/" },
      { companyId: "screen", ticker: "7735.T", observedAt: "2025-10-13", marketCapUsdB: 8.58, sourcePath: "/screen-holdings/marketcap/" },
      { companyId: "kokusai-electric", ticker: "6525.T", observedAt: "2025-10-13", marketCapUsdB: 6.82, sourcePath: "/kokusai-electric-corporation/marketcap/" },
      { companyId: "rohm", ticker: "6963.T", observedAt: "2025-10-13", marketCapUsdB: 5.7, sourcePath: "/rohm/marketcap/" },
      { companyId: "sumco", ticker: "3436.T", observedAt: "2025-10-13", marketCapUsdB: 3.81, sourcePath: "/sumco-corporation/marketcap/" },
      { companyId: "rorze", ticker: "6323.T", observedAt: "2025-10-13", marketCapUsdB: 2.74, sourcePath: "/rorze-corporation/marketcap/" },
      { companyId: "maruwa", ticker: "5344.T", observedAt: "2025-10-13", marketCapUsdB: 3.33, sourcePath: "/maruwa/marketcap/" },
      { companyId: "micronics-japan", ticker: "6871.T", observedAt: "2025-09-30", marketCapUsdB: 1.54, sourcePath: "/micronics-japan/marketcap/" },
      { companyId: "socionext", ticker: "6526.T", observedAt: "2025-10-13", marketCapUsdB: 3.31, sourcePath: "/socionext/marketcap/" },
      { companyId: "tomen-devices", ticker: "2737.T", observedAt: "2025-09-30", marketCapUsdB: 0.31, sourcePath: "/tomen-devices-corporation/marketcap/" },
      { companyId: "towa", ticker: "6315.T", observedAt: "2025-10-13", marketCapUsdB: 1.06, sourcePath: "/towa-corporation/marketcap/" },
      { companyId: "rs-technologies", ticker: "3445.T", observedAt: "2025-10-13", marketCapUsdB: 0.63, sourcePath: "/rs-technologies/marketcap/" },
      { companyId: "sanken-electric", ticker: "6707.T", observedAt: "2025-09-30", marketCapUsdB: 0.98, sourcePath: "/sanken-electric/marketcap/" },
    ]),
  },
];
