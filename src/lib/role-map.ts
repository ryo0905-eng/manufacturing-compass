import type { ResponsibilityId, RoleMapMatch, RoleMapSelection, RoleProfile } from '@/types/role-map';

type ScoredProfile = {
  profile: RoleProfile;
  matchedIds: ResponsibilityId[];
  score: number;
};

function uniqueKnown(ids: ResponsibilityId[], knownIds: Set<ResponsibilityId>) {
  return [...new Set(ids)].filter((id) => knownIds.has(id));
}

export function normalizeRoleMapSelection(
  selection: RoleMapSelection,
  knownIds: Set<ResponsibilityId>,
): RoleMapSelection {
  const selectedIds = uniqueKnown(selection.selectedIds, knownIds);
  const selectedSet = new Set(selectedIds);
  const emphasizedIds = uniqueKnown(selection.emphasizedIds, knownIds)
    .filter((id) => selectedSet.has(id))
    .slice(0, 3);

  return { selectedIds, emphasizedIds };
}

export function findRoleMapMatches(
  selection: RoleMapSelection,
  profiles: RoleProfile[],
  knownIds: Set<ResponsibilityId>,
): RoleMapMatch[] {
  const normalized = normalizeRoleMapSelection(selection, knownIds);
  if (normalized.selectedIds.length < 2) return [];

  const emphasized = new Set(normalized.emphasizedIds);
  const denominator = normalized.selectedIds.reduce((sum, id) => sum + (emphasized.has(id) ? 2 : 1), 0);
  const scored: ScoredProfile[] = profiles.flatMap((profile) => {
    const fits = new Map(profile.responsibilities.map((item) => [item.responsibilityId, item.fit]));
    const matchedIds = normalized.selectedIds.filter((id) => fits.has(id));
    const hasCore = matchedIds.some((id) => fits.get(id) === 'core');
    if (matchedIds.length < 2 || !hasCore) return [];

    const numerator = matchedIds.reduce((sum, id) => {
      const inputWeight = emphasized.has(id) ? 2 : 1;
      const fitWeight = fits.get(id) === 'core' ? 1 : 0.5;
      return sum + inputWeight * fitWeight;
    }, 0);

    return [{ profile, matchedIds, score: numerator / denominator }];
  });

  scored.sort((a, b) => b.score - a.score || a.profile.order - b.profile.order);

  return scored.slice(0, 3).map((item, index, list) => ({
    profile: item.profile,
    matchedIds: item.matchedIds,
    tiedWithPrevious: index > 0 && item.score === list[index - 1].score,
  }));
}
