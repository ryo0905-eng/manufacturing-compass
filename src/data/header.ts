import { headerDirectLinkIds, siteLinks, siteNavigationGroups } from "@/data/site-navigation";

// Flat projection for existing link audits; definitions live in site-navigation.
export const headerNavItems = [
  ...siteNavigationGroups.flatMap((group) => group.linkIds.map((id) => ({ id, ...siteLinks[id] }))),
  ...headerDirectLinkIds.map((id) => ({ id, ...siteLinks[id] })),
];
