import type { RankingCompany, RankingSnapshot } from './ranking-time-machine';

// CompaniesMarketCap End of year Market Cap, checked 2026-09-23.
// Values in USD billions; one issuer per company, no GOOG/GOOGL summation.
export const referenceCompanies: readonly RankingCompany[] = [
  {
    "id": "apple",
    "name": "Apple",
    "sourceUrl": "https://companiesmarketcap.com/apple/marketcap/",
    "checkedAt": "2026-09-23",
    "logoUrl": "/images/company-logos/apple.png",
    "logoAspectRatio": 1.0,
    "category": "比較対象（他業界）",
    "isReference": true
  },
  {
    "id": "microsoft",
    "name": "Microsoft",
    "sourceUrl": "https://companiesmarketcap.com/microsoft/marketcap/",
    "checkedAt": "2026-09-23",
    "logoUrl": "/images/company-logos/microsoft.png",
    "logoAspectRatio": 4.654545,
    "category": "比較対象（他業界）",
    "isReference": true
  },
  {
    "id": "alphabet",
    "name": "Alphabet（Google）",
    "sourceUrl": "https://companiesmarketcap.com/alphabet-google/marketcap/",
    "checkedAt": "2026-09-23",
    "logoUrl": "/images/company-logos/alphabet.png",
    "logoAspectRatio": 3.047619,
    "category": "比較対象（他業界）",
    "isReference": true
  },
  {
    "id": "amazon",
    "name": "Amazon",
    "sourceUrl": "https://companiesmarketcap.com/amazon/marketcap/",
    "checkedAt": "2026-09-23",
    "logoUrl": "/images/company-logos/amazon.png",
    "logoAspectRatio": 3.324675,
    "category": "比較対象（他業界）",
    "isReference": true
  },
  {
    "id": "meta",
    "name": "Meta（旧Facebook）",
    "sourceUrl": "https://companiesmarketcap.com/meta-platforms/marketcap/",
    "checkedAt": "2026-09-23",
    "logoUrl": "/images/company-logos/meta.png",
    "logoAspectRatio": 4.923077,
    "category": "比較対象（他業界）",
    "isReference": true
  },
  {
    "id": "toyota",
    "name": "トヨタ",
    "sourceUrl": "https://companiesmarketcap.com/toyota/marketcap/",
    "checkedAt": "2026-09-23",
    "logoUrl": "/images/company-logos/toyota.png",
    "logoAspectRatio": 6.095238,
    "category": "比較対象（他業界）",
    "isReference": true
  }
];

export const referenceSnapshots: readonly RankingSnapshot[] = [
  { year: 2014, entries: [
    { companyId: "apple", valueUsdB: 643.12 },
    { companyId: "microsoft", valueUsdB: 381.72 },
    { companyId: "alphabet", valueUsdB: 359.5 },
    { companyId: "amazon", valueUsdB: 144.31 },
    { companyId: "meta", valueUsdB: 216.73 },
    { companyId: "toyota", valueUsdB: 198.99 },
  ] },
  { year: 2015, entries: [
    { companyId: "apple", valueUsdB: 583.61 },
    { companyId: "microsoft", valueUsdB: 439.67 },
    { companyId: "alphabet", valueUsdB: 528.16 },
    { companyId: "amazon", valueUsdB: 318.34 },
    { companyId: "meta", valueUsdB: 296.6 },
    { companyId: "toyota", valueUsdB: 191.06 },
  ] },
  { year: 2016, entries: [
    { companyId: "apple", valueUsdB: 608.96 },
    { companyId: "microsoft", valueUsdB: 483.16 },
    { companyId: "alphabet", valueUsdB: 539.06 },
    { companyId: "amazon", valueUsdB: 356.31 },
    { companyId: "meta", valueUsdB: 331.59 },
    { companyId: "toyota", valueUsdB: 197.39 },
  ] },
  { year: 2017, entries: [
    { companyId: "apple", valueUsdB: 860.88 },
    { companyId: "microsoft", valueUsdB: 659.9 },
    { companyId: "alphabet", valueUsdB: 729.45 },
    { companyId: "amazon", valueUsdB: 563.53 },
    { companyId: "meta", valueUsdB: 512.75 },
    { companyId: "toyota", valueUsdB: 191.03 },
  ] },
  { year: 2018, entries: [
    { companyId: "apple", valueUsdB: 746.07 },
    { companyId: "microsoft", valueUsdB: 780.36 },
    { companyId: "alphabet", valueUsdB: 723.55 },
    { companyId: "amazon", valueUsdB: 737.46 },
    { companyId: "meta", valueUsdB: 374.13 },
    { companyId: "toyota", valueUsdB: 165.27 },
  ] },
  { year: 2019, entries: [
    { companyId: "apple", valueUsdB: 1287 },
    { companyId: "microsoft", valueUsdB: 1200 },
    { companyId: "alphabet", valueUsdB: 921.13 },
    { companyId: "amazon", valueUsdB: 920.22 },
    { companyId: "meta", valueUsdB: 585.37 },
    { companyId: "toyota", valueUsdB: 196.93 },
  ] },
  { year: 2020, entries: [
    { companyId: "apple", valueUsdB: 2255 },
    { companyId: "microsoft", valueUsdB: 1681 },
    { companyId: "alphabet", valueUsdB: 1185 },
    { companyId: "amazon", valueUsdB: 1634 },
    { companyId: "meta", valueUsdB: 778.23 },
    { companyId: "toyota", valueUsdB: 215.71 },
  ] },
  { year: 2021, entries: [
    { companyId: "apple", valueUsdB: 2901 },
    { companyId: "microsoft", valueUsdB: 2522 },
    { companyId: "alphabet", valueUsdB: 1917 },
    { companyId: "amazon", valueUsdB: 1691 },
    { companyId: "meta", valueUsdB: 921.93 },
    { companyId: "toyota", valueUsdB: 252.84 },
  ] },
  { year: 2022, entries: [
    { companyId: "apple", valueUsdB: 2066 },
    { companyId: "microsoft", valueUsdB: 1787 },
    { companyId: "alphabet", valueUsdB: 1145 },
    { companyId: "amazon", valueUsdB: 856.94 },
    { companyId: "meta", valueUsdB: 319.88 },
    { companyId: "toyota", valueUsdB: 186.35 },
  ] },
  { year: 2023, entries: [
    { companyId: "apple", valueUsdB: 2994 },
    { companyId: "microsoft", valueUsdB: 2794 },
    { companyId: "alphabet", valueUsdB: 1756 },
    { companyId: "amazon", valueUsdB: 1570 },
    { companyId: "meta", valueUsdB: 909.62 },
    { companyId: "toyota", valueUsdB: 247.48 },
  ] },
  { year: 2024, entries: [
    { companyId: "apple", valueUsdB: 3766 },
    { companyId: "microsoft", valueUsdB: 3200 },
    { companyId: "alphabet", valueUsdB: 2365 },
    { companyId: "amazon", valueUsdB: 2352 },
    { companyId: "meta", valueUsdB: 1514 },
    { companyId: "toyota", valueUsdB: 264.94 },
  ] },
  { year: 2025, entries: [
    { companyId: "apple", valueUsdB: 3997 },
    { companyId: "microsoft", valueUsdB: 3625 },
    { companyId: "alphabet", valueUsdB: 3802 },
    { companyId: "amazon", valueUsdB: 2485 },
    { companyId: "meta", valueUsdB: 1671 },
    { companyId: "toyota", valueUsdB: 282.32 },
  ] },
];
