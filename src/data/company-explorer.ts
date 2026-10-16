import type { IndustryMapZoneId } from "@/data/industry-map";

// Primary roles for directory companies outside the representative industry map.
// These presentation groups do not replace the existing multi-segment taxonomy.
export const directoryCompanyZones: Record<string, IndustryMapZoneId> = {
  skyworks: "fabless",
  broadcom: "fabless",
  marvell: "fabless",
  qorvo: "fabless",
  infineon: "idm",
  stmicroelectronics: "idm",
  nxp: "idm",
  onsemi: "idm",
  "analog-devices": "idm",
  "texas-instruments": "idm",
  "hitachi-hightech": "inspection",
  nikon: "equipment",
  canon: "equipment",
};
