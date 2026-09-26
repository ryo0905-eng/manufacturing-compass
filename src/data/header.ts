import type { Route } from "next";

export const headerNavItems = [
  { id: "tools", href: "/tools", label: "技術を学ぶ" },
  { id: "semiconductor_watch", href: "/semiconductor-watch", label: "業界ウォッチ" },
  { id: "industry_map", href: "/industry-map", label: "業界地図" },
  { id: "companies", href: "/companies", label: "企業を探す" },
  { id: "guides", href: "/guides", label: "記事を読む" },
] satisfies Array<{ id: string; href: Route; label: string }>;
