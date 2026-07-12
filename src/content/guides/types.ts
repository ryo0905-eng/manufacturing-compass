import type { Source } from "@/types/content";

export type GuideStatus = "draft" | "published";

export type GuideBlock =
  | {
      type: "timeline";
      items: Array<{ label: string; title: string; body: string }>;
    }
  | {
      type: "cards";
      columns?: 2 | 3 | 4;
      items: Array<{ label: string; title: string; body?: string }>;
    }
  | {
      type: "mapping";
      leftLabel: string;
      rightLabel: string;
      rows: Array<{ left: string; right: string }>;
    }
  | {
      type: "quote";
      quote: string;
      caption?: string;
    }
  | {
      type: "note";
      title: string;
      body: string;
    };

export type GuideSection = {
  id?: string;
  heading: string;
  lead?: string;
  paragraphs: string[];
  points?: string[];
  blocks?: GuideBlock[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  targetQuery: string;
  searchIntent: string;
  status: GuideStatus;
  presentation: "legacy" | "structured";
  author: "RYO";
  reviewedBy: "RYO";
  experienceBasis: string[];
  publishedAt: string;
  updatedAt: string;
  sources: Source[];
  readTime: string;
  intro: {
    problem: string;
    conclusion: string;
    learnings: string;
  };
  overviewBlocks?: GuideBlock[];
  sections: GuideSection[];
  todayQuest: string;
  relatedGuideSlugs: string[];
  relatedCompanyIds: string[];
};
