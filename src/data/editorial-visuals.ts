import type { ResponsibilityCategory } from '@/types/role-map';
import type { IndustryMapZoneId } from '@/data/industry-map';

// Generated concept illustrations; these do not depict actual company facilities.
export const guideThumbnailImages: Partial<Record<string, string>> = {
  'semiconductor-manufacturing-process': '/images/guides/semiconductor-manufacturing-process.png',
  'semiconductor-equipment-manufacturers': '/images/guides/semiconductor-equipment-manufacturers.png',
  'semiconductor-career-start': '/images/guides/semiconductor-career-start.png',
};

export const roleCategoryImages: Record<ResponsibilityCategory, string> = {
  process: '/images/roles/process.png',
  productivity: '/images/roles/productivity.png',
  equipment: '/images/roles/equipment.png',
  quality: '/images/roles/quality.png',
};

export const industryZoneImages: Record<IndustryMapZoneId, string> = {
  'eda-ip': '/images/industry/eda-ip.png',
  fabless: '/images/industry/fabless.png',
  foundry: '/images/home/semiconductor-hero.png',
  idm: '/images/guides/semiconductor-manufacturing-process.png',
  osat: '/images/industry/osat.png',
  materials: '/images/industry/materials.png',
  equipment: '/images/guides/semiconductor-equipment-manufacturers.png',
  inspection: '/images/roles/quality.png',
};

// Memory is a product field; it stays distinct from the IDM business model.
export const companySegmentImages: Partial<Record<string, string>> = {
  fabless: industryZoneImages.fabless,
  foundry: industryZoneImages.foundry,
  memory: '/images/industry/memory.png',
  idm: industryZoneImages.idm,
  equipment: industryZoneImages.equipment,
  materials: industryZoneImages.materials,
};
