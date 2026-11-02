/** Existing company/location/role IDs remain authoritative; no second company DB. */
export type EntityKind = "company" | "equipment" | "technology" | "material" | "process" | "location" | "role";
export type EntityRef = { kind: EntityKind; id: string };
export type Evidence = { sourceId: string; quote: string; locator: string };
export type Fact =
  | { status: "verified"; value: string; evidence: Evidence; condition: string }
  | { status: "unconfirmed" | "not-public" | "not-applicable"; reason: string };
export type DatabaseSource = { id: string; url: string; publisher: string; title: string; checkedAt: string };
export type DatabaseRecord = {
  id: string;
  kind: EntityKind;
  name: string;
  aliases: string[];
  englishName: string;
  category: string;
  summary: string;
  relations: { target: EntityRef; type: "manufacturer" | "process-use" | "technical-context" | "documented-transaction"; evidence?: Evidence }[];
  facts: Record<string, Fact>;
  sources: DatabaseSource[];
  lastChecked: string;
  updateStatus: "current" | "stale" | "changed";
  verification: { status: "verified" | "unconfirmed"; method: string };
  publication: { status: "published" | "draft" | "suspended"; index: boolean };
};
export type EquipmentRecord = DatabaseRecord & { kind: "equipment"; manufacturerId: string; processIds: string[] };
export type EquipmentCatalog = { version: 1; records: EquipmentRecord[] };
export type EquipmentProcess = { id: string; name: string; guide: string; lab: string; description: string };
