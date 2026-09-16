export type ResponsibilityId = `R${string}`;

export type ResponsibilityCategory = 'process' | 'productivity' | 'equipment' | 'quality';

export type Responsibility = {
  id: ResponsibilityId;
  category: ResponsibilityCategory;
  label: string;
  description: string;
};

export type ResponsibilityFit = 'core' | 'variable';

export type ProfileResponsibility = {
  responsibilityId: ResponsibilityId;
  fit: ResponsibilityFit;
};

export type RoleProfile = {
  id: string;
  order: number;
  roleGroup: string;
  title: string;
  context: string;
  titles: string[];
  responsibilities: ProfileResponsibility[];
  searchPhrases: string[];
  checks: string[];
  distinction: string;
  evidence: { label: string; url: string }[];
};

export type RoleMapSelection = {
  selectedIds: ResponsibilityId[];
  emphasizedIds: ResponsibilityId[];
};

export type RoleMapMatch = {
  profile: RoleProfile;
  matchedIds: ResponsibilityId[];
  tiedWithPrevious: boolean;
};
