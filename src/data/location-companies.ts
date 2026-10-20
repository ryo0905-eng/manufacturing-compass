import { companies } from "@/data/companies";
import type { LocationCompany } from "@/types/company-location";

// Physical locations do not require a separate company-detail page.
export const locationCompanies: LocationCompany[] = [
  ...companies.map(({ id, name, nameJa, slug, websiteUrl }) => ({ id, name, nameJa, slug, websiteUrl })),
  { id: "rapidus", name: "Rapidus", nameJa: "Rapidus", websiteUrl: "https://www.rapidus.inc/" },
];
