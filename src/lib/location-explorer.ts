import type { FactoryProject } from "@/data/factory-projects";
import type { CompanyLocation, JobFamily, LocationCompany, LocationType, OperationalStatus } from "@/types/company-location";

export const locationTypeOptions: { value: LocationType; label: string }[] = [
  { value: "factory", label: "工場" }, { value: "research-development", label: "研究開発" },
  { value: "design-center", label: "設計・開発" }, { value: "headquarters", label: "本社" },
  { value: "office", label: "オフィス" }, { value: "field-service", label: "フィールドサービス" },
  { value: "logistics", label: "物流・施設" },
];
export const statusOptions: { value: OperationalStatus; label: string }[] = [
  { value: "operating", label: "稼働中" }, { value: "pilot", label: "試作ライン稼働" },
  { value: "under-construction", label: "建設中" }, { value: "planned", label: "計画中" },
  { value: "status-unconfirmed", label: "状態確認中" },
];
export const jobFamilyOptions: { value: JobFamily; label: string }[] = [
  { value: "process-production", label: "生産・プロセス" }, { value: "equipment-facility", label: "設備・施設" },
  { value: "quality-reliability", label: "品質・信頼性" }, { value: "equipment-development", label: "装置開発" },
  { value: "circuit-software-design", label: "設計・ソフトウェア" },
  { value: "field-application-service", label: "FAE・フィールドサービス" },
  { value: "supply-chain-corporate", label: "サプライチェーン・管理" },
];
export const locationRegions = [
  { id: "hokkaido", label: "北海道", codes: ["01"] },
  { id: "tohoku", label: "東北", codes: ["02", "03", "04", "05", "06", "07"] },
  { id: "kanto", label: "関東", codes: ["08", "09", "10", "11", "12", "13", "14"] },
  { id: "chubu", label: "中部", codes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
  { id: "kinki", label: "近畿", codes: ["24", "25", "26", "27", "28", "29", "30"] },
  { id: "chugoku", label: "中国", codes: ["31", "32", "33", "34", "35"] },
  { id: "shikoku", label: "四国", codes: ["36", "37", "38", "39"] },
  { id: "kyushu", label: "九州・沖縄", codes: ["40", "41", "42", "43", "44", "45", "46", "47"] },
];

export type LocationExplorerState = {
  companyIds: string[]; prefectureCodes: string[]; types: LocationType[]; statuses: OperationalStatus[];
  job?: JobFamily; mode: "locations" | "projects"; view: "map" | "list"; format: "cards" | "table";
  locationId?: string; projectId?: string;
};
export type LocationExplorerData = { locations: CompanyLocation[]; companies: LocationCompany[]; projects: FactoryProject[] };
export type LocationExplorerRow = { id: string; location: CompanyLocation; project?: FactoryProject };

export function defaultExplorerState(): LocationExplorerState {
  return { companyIds: [], prefectureCodes: [], types: [], statuses: [], mode: "locations", view: "map", format: "cards" };
}

export function readExplorerState(params: URLSearchParams, data: LocationExplorerData): LocationExplorerState {
  const values = <T extends string>(key: string, allowed: T[]) =>
    [...new Set(params.getAll(key))].filter((value): value is T => allowed.includes(value as T));
  const job = values("job", jobFamilyOptions.map(option => option.value))[0];
  const project = data.projects.find(item => item.id === params.get("project"));
  const locationId = project?.locationId ?? data.locations.find(item => item.id === params.get("location"))?.id;
  return {
    companyIds: values("company", data.companies.map(item => item.id)),
    prefectureCodes: values("prefecture", data.locations.map(item => item.prefectureCode)),
    types: values("type", locationTypeOptions.map(item => item.value)),
    statuses: values("status", statusOptions.map(item => item.value)), job,
    mode: project || params.get("mode") === "projects" ? "projects" : "locations",
    view: params.get("view") === "list" ? "list" : "map",
    format: params.get("format") === "table" ? "table" : "cards",
    locationId, projectId: project?.id,
  };
}

export function explorerSearchParams(state: LocationExplorerState): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, values] of [["company", state.companyIds], ["prefecture", state.prefectureCodes],
    ["type", state.types], ["status", state.statuses]] as const) {
    [...values].sort().forEach(value => params.append(key, value));
  }
  if (state.job) params.set("job", state.job);
  if (state.mode === "projects") params.set("mode", "projects");
  if (state.view === "list") params.set("view", "list");
  if (state.format === "table") params.set("format", "table");
  if (state.locationId) params.set("location", state.locationId);
  if (state.projectId) params.set("project", state.projectId);
  return params;
}

export function getLocationStatuses(location: CompanyLocation, projects: FactoryProject[]): OperationalStatus[] {
  return [...new Set([location.operationalStatus, ...(location.facilities ?? []).map(item => item.operationalStatus),
    ...projects.filter(item => item.locationId === location.id).map(item => item.operationalStatus)])];
}

export function filterExplorerRows(data: LocationExplorerData, state: LocationExplorerState, query = ""): LocationExplorerRow[] {
  const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ja-JP").trim();
  const needle = normalize(query);
  const companyById = new Map(data.companies.map(item => [item.id, item]));
  const locations = new Map(data.locations.map(item => [item.id, item]));
  const rows: LocationExplorerRow[] = state.mode === "projects"
    ? data.projects.flatMap(project => { const location = locations.get(project.locationId); return location ? [{ id: project.id, location, project }] : []; })
    : data.locations.map(location => ({ id: location.id, location }));
  return rows.filter(({ location, project }) => {
    const company = companyById.get(location.companyId);
    const facility = location.facilities?.find(item => item.id === project?.facilityId);
    const types = facility?.locationTypes ?? location.locationTypes;
    const jobs = facility?.jobFamilies ?? location.jobFamilies;
    const statuses = project ? [project.operationalStatus] : getLocationStatuses(location, data.projects);
    return (!state.companyIds.length || state.companyIds.includes(location.companyId))
      && (!state.prefectureCodes.length || state.prefectureCodes.includes(location.prefectureCode))
      && (!state.types.length || state.types.some(type => types.includes(type)))
      && (!state.statuses.length || state.statuses.some(status => statuses.includes(status)))
      && (!state.job || jobs.includes(state.job))
      && (!needle || normalize([company?.name, company?.nameJa, location.name, location.address,
        location.prefectureName, location.municipality, ...location.mainProducts, project?.name,
        ...jobs.map(job => jobFamilyOptions.find(item => item.value === job)?.label)].filter(Boolean).join(" ")).includes(needle));
  }).sort((a, b) => a.location.prefectureCode.localeCompare(b.location.prefectureCode)
    || a.location.name.localeCompare(b.location.name, "ja") || a.id.localeCompare(b.id));
}

export function canMapLocation(location: CompanyLocation): boolean {
  const point = location.coordinates;
  return Boolean(point && ["agent-verified", "human-reviewed"].includes(point.reviewStatus)
    && ["facility", "parcel", "residential-detail"].includes(point.precision)
    && point.sourceId && point.verifiedAt && point.verificationNote
    && Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
    && point.latitude >= 20 && point.latitude <= 46 && point.longitude >= 122 && point.longitude <= 154);
}

export function mappableLocations(rows: LocationExplorerRow[]): CompanyLocation[] {
  return [...new Map(rows.map(row => [row.location.id, row.location])).values()].filter(canMapLocation);
}

export function regionCounts(rows: LocationExplorerRow[]) {
  return locationRegions.map(region => ({ ...region, count: rows.filter(row => region.codes.includes(row.location.prefectureCode)).length }));
}

export function factoryProjectMapHref(project: Pick<FactoryProject, "id" | "locationId">): string {
  return `/semiconductor-map?mode=projects&location=${encodeURIComponent(project.locationId)}&project=${encodeURIComponent(project.id)}`;
}

export function validateExplorerData(data: LocationExplorerData, sources: { id: string; url: string }[], projectSources: { url: string }[]): string[] {
  const errors: string[] = [];
  const locationById = new Map(data.locations.map(location => [location.id, location]));
  const sourceIds = new Set(sources.map(source => source.id));
  if (new Set(data.projects.map(project => project.id)).size !== data.projects.length) errors.push("案件IDが重複しています。");
  for (const location of data.locations) {
    const point = location.coordinates;
    if (point && ["agent-verified", "human-reviewed"].includes(point.reviewStatus)
      && (!sourceIds.has(point.sourceId) || !canMapLocation(location))) errors.push(`${location.id}: 座標の公開条件または出典を確認してください。`);
  }
  for (const project of data.projects) {
    const location = locationById.get(project.locationId);
    if (!location) errors.push(`${project.id}: 対応する公開拠点がありません。`);
    if (project.facilityId && !location?.facilities?.some(facility => facility.id === project.facilityId)) errors.push(`${project.id}: 施設の対応が不正です。`);
    if (!project.milestones.length) errors.push(`${project.id}: 節目がありません。`);
    for (const item of [project, ...project.milestones]) {
      if (!item.sourceNumbers.length || item.sourceNumbers.some(number => !Number.isInteger(number) || number < 1 || !projectSources[number - 1]?.url.startsWith("https://"))) errors.push(`${project.id}: 案件の出典が不正です。`);
    }
  }
  return errors;
}
