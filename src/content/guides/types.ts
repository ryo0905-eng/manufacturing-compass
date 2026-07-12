import type { Source } from "@/types/content";

export type GuideStatus = "draft" | "published";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  targetQuery: string;
  searchIntent: string;
  status: GuideStatus;
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
  sections: GuideSection[];
  todayQuest: string;
  relatedGuideSlugs: string[];
  relatedCompanyIds: string[];
};
