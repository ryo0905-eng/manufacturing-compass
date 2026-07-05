export type Source = {
  title: string;
  url: string;
  publisher: string;
  accessedAt: string;
};

export type CompanyMetric = {
  revenue: string;
  operatingIncome: string;
  marketCap: string;
  employees: string;
  fiscalYear: string;
  currency: string;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  summary: string;
  headquartersCountry: string;
  websiteUrl: string;
  careerUrl: string;
  industrySegments: string[];
  businessModel: string;
  mainProducts: string[];
  competitors: string[];
  metrics: CompanyMetric;
  japanPresence: string;
  locationsJapan: string[];
  englishRequirement: string;
  jobCategories: string[];
  careerSummary: string;
  affiliateCtaType: "agent-consultation" | "career-research";
  sources: Source[];
  lastUpdated: string;
};

export type IndustrySegment = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  roleInValueChain: string;
  relatedCompanyIds: string[];
  sources: Source[];
  lastUpdated: string;
};

export type CareerInfo = {
  companyId: string;
  sources: Source[];
  lastUpdated: string;
  typicalRoles: string[];
  recommendedExperience: string[];
  usefulSkills: string[];
  englishLevel: string;
  helpfulCertifications: string[];
  typicalCareerPaths: string[];
  suitableBackgrounds: string[];
  stretchBackgrounds: string[];
  preparationActions6Months: string[];
  preparationActions1Year: string[];
  steppingStoneCompanies: string[];
  notes: string;
};
