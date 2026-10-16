import type { ResponsibilityCategory } from '@/types/role-map';

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
