// Server-only projection: unapproved records and local source snapshots never reach clients.
import { createHash } from "node:crypto";
import rawCatalog from "@/data/database/equipment.json";
import release from "@/data/database/release.json";
import suspensions from "@/data/database/suspensions.json";
import type { EquipmentCatalog } from "@/types/semiconductor-database";

export function getReleasedEquipment() {
  // Records have category-specific fact keys; the database checker validates the JSON.
  const catalog = rawCatalog as unknown as EquipmentCatalog;
  return catalog.records.filter(record => {
    const digest = createHash("sha256").update(JSON.stringify(record)).digest("hex");
    return record.publication.status === "published" && record.verification.status === "verified"
      && record.updateStatus === "current"
      && release.records.some(item => item.id === record.id && item.fingerprint === digest)
      && !(suspensions.recordIds as string[]).includes(record.id)
      && !(suspensions.manufacturerIds as string[]).includes(record.manufacturerId)
      && !record.processIds.some(id => (suspensions.processIds as string[]).includes(id))
      && !record.sources.some(source => (suspensions.sourceIds as string[]).includes(source.id));
  });
}
