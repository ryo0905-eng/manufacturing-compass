import type { Source } from "@/types/content";

export type GuideStatus = "draft" | "published";
export type GuideCategory = "experience" | "foundation" | "role" | "technology";

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
      type: "career-bridge";
      title: string;
      currentLabel: string;
      targetLabel: string;
      nextLabel: string;
      rows: Array<{ current: string; target: string; next: string }>;
    }
  | {
      type: "opportunity-ladder";
      title: string;
      description: string;
      items: Array<{ label: string; requirement: string; usage: string; opportunity: string }>;
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
    }
  | {
      type: "process-flow";
      title: string;
      description: string;
      stages: Array<{ label: string; title: string; body: string }>;
      cycle?: {
        title: string;
        items: string[];
        note: string;
      };
    }
  | {
      type: "layer-process";
      title: string;
      description: string;
      stages: Array<{
        label: string;
        title: string;
        body: string;
        signal?: string;
        layers: Array<{
          label: string;
          tone: "mask" | "resist" | "film" | "substrate";
          pattern?: "solid" | "openings" | "latent";
        }>;
      }>;
    }
  | {
      type: "market-cap-ranking";
      scope: "world" | "japan";
    }
  | {
      type: "salary-ranking";
    }
  | {
      type: "faq";
      items: Array<{ question: string; answer: string }>;
    }
  | {
      type: "links";
      items: Array<{ label: string; href: string; description: string }>;
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
  category: GuideCategory;
  featured?: boolean;
  presentation: "legacy" | "structured";
  author: "RYO";
  reviewedBy: "RYO";
  experienceBasis: string[];
  basisLabel?: string;
  basisNote?: string;
  showCareerCtas?: boolean;
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
