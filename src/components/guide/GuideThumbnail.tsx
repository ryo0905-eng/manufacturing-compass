import type { GuideArticle, GuideCategory } from "@/content/guides/types";

type GuideVisualTheme = "experience" | "knowhow" | "data" | "route" | "global";

const categoryLabels: Record<GuideCategory, string> = {
  experience: "RYOの実体験",
  foundation: "転職ノウハウ",
  role: "職種別ルート",
};

const themeLabels: Record<GuideVisualTheme, string> = {
  experience: "REAL CAREER STORY",
  knowhow: "CAREER PLAYBOOK",
  data: "COMPANY & SALARY DATA",
  route: "ROLE ROUTE MAP",
  global: "GLOBAL CAREER",
};

function getTheme(guide: Pick<GuideArticle, "category" | "slug">): GuideVisualTheme {
  if (guide.slug.includes("english")) return "global";
  if (guide.slug.includes("salary") || guide.slug.includes("market-cap")) return "data";
  if (guide.category === "role" || guide.slug.includes("-to-semiconductor-")) return "route";
  if (guide.category === "experience") return "experience";
  return "knowhow";
}

type GuideThumbnailProps = Pick<GuideArticle, "category" | "slug" | "title"> & {
  compact?: boolean;
};

export function GuideThumbnail({ category, compact = false, slug, title }: GuideThumbnailProps) {
  const theme = getTheme({ category, slug });

  return (
    <div className={`guide-thumbnail guide-thumbnail--${theme}${compact ? " guide-thumbnail--compact" : ""}`} aria-hidden="true">
      <div className="guide-thumbnail__topline">
        <span>{categoryLabels[category]}</span>
        <i>MC / GUIDE</i>
      </div>
      <div className="guide-thumbnail__visual">
        <span className="guide-thumbnail__icon"><i /><i /><i /></span>
        <div className="guide-thumbnail__plot"><i /><i /><i /><i /></div>
      </div>
      <div className="guide-thumbnail__copy">
        <small>{themeLabels[theme]}</small>
        <strong>{title}</strong>
      </div>
    </div>
  );
}
