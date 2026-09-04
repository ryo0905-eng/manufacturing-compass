import type { Source } from "@/types/content";

export type LocationType =
  | "headquarters"
  | "office"
  | "factory"
  | "research-development"
  | "design-center"
  | "field-service"
  | "logistics";

export type LocationIndustryCategory =
  | "foundry"
  | "memory"
  | "idm"
  | "equipment"
  | "materials"
  | "fabless";

export type JobFamily =
  | "process-production"
  | "equipment-facility"
  | "quality-reliability"
  | "equipment-development"
  | "circuit-software-design"
  | "field-application-service"
  | "supply-chain-corporate";

export type OperationalStatus =
  | "operating"
  | "under-construction"
  | "planned"
  | "status-unconfirmed";

export type LocationSource = Source & {
  id: string;
  supports: Array<
    | "identity"
    | "address"
    | "location-type"
    | "products"
    | "roles"
    | "operational-status"
    | "status-event"
    | "hiring"
  >;
};

export type LocationEntity = {
  legalEntityName: string;
  relationship: "operator" | "co-located" | "facility-management" | "field-service";
  sourceIds: string[];
};

export type LocationStatusEvent = {
  type: "opening" | "expansion" | "production-end" | "closure" | "relocation";
  announcedAt: string;
  effectiveAt?: string;
  expectedTimingText?: string;
  note: string;
  sourceId: string;
};

export type LocationFacility = {
  id: string;
  name: string;
  locationTypes: LocationType[];
  mainProducts: string[];
  jobFamilies: JobFamily[];
  operationalStatus: OperationalStatus;
  statusEvents?: LocationStatusEvent[];
  sourceIds: string[];
};

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
  precision: "facility" | "parcel" | "residential-detail" | "machiaza" | "municipality" | "prefecture";
  method: "official-map" | "address-geocode" | "named-facility";
  sourceId: string;
  verifiedAt: string;
  reviewStatus: "automated-check" | "human-reviewed";
};

export type CompanyLocation = {
  id: string;
  companyId: string;
  legalEntities: LocationEntity[];
  slug: string;
  name: string;
  campusId?: string;
  prefectureCode: string;
  prefectureSlug: string;
  prefectureName: string;
  municipality: string;
  address?: string;
  coordinates?: LocationCoordinates;
  locationTypes: LocationType[];
  industryCategories: LocationIndustryCategory[];
  processIds: string[];
  mainProducts: string[];
  jobFamilies: JobFamily[];
  facilities?: LocationFacility[];
  statusEvents?: LocationStatusEvent[];
  sourceIds: string[];
  lastVerifiedAt: string;
  nextReviewAt: string;
  operationalStatus: OperationalStatus;
  contentStatus: "complete" | "draft";
};

export type HiringSignalStatus =
  | "official-opening-confirmed"
  | "career-page-available"
  | "no-current-opening-confirmed"
  | "review-expired";

export type HiringSignal = {
  id: string;
  companyId: string;
  locationId?: string;
  locationFacilityId?: string;
  status: Exclude<HiringSignalStatus, "review-expired">;
  careerUrl: string;
  roleLabels: string[];
  sourceId: string;
  checkedAt: string;
  expiresAt: string;
};

export type EffectiveHiringSignal = Omit<HiringSignal, "status"> & {
  status: HiringSignalStatus;
};

export type CompanyLocationFilters = {
  query?: string;
  companyId?: string;
  prefectureCode?: string;
  locationType?: LocationType;
  industryCategory?: LocationIndustryCategory;
  jobFamily?: JobFamily;
  operationalStatus?: OperationalStatus;
  hiringStatus?: HiringSignalStatus;
};
