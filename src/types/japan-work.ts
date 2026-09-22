import type { Source } from "@/types/content";

export type JapanWorkCategory = "design" | "process" | "quality" | "equipment" | "application" | "business";

export type JapanWorkEvidence = {
  id: string;
  companyId: string;
  categories: JapanWorkCategory[];
  officialTitle: string;
  titleKind: "role" | "activity";
  summary: string;
  /** Only locations explicitly tied to this work; never inferred from company addresses. */
  prefectures: string[];
  locationIds: string[];
  workplace: string;
  unknowns: string;
  classificationReason: string;
  sourceIds: string[];
  checkedAt: string;
  nextReviewAt: string;
  status: "published" | "draft" | "withdrawn";
};

export type JapanWorkSource = Source & { id: string };
export type JapanWorkCompany = {
  companyId: string;
  summary: string;
  presence: string;
  presenceSourceIds: string[];
  careerUrl: string;
  status: "published" | "pending";
  pendingReason?: string;
};
export type JapanWorkFilters = { category?: JapanWorkCategory; prefecture?: string };
export type JapanWorkCompanyView = JapanWorkCompany & {
  name: string;
  slug: string;
  works: JapanWorkEvidence[];
};
