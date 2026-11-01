import { FeedbackSection } from "./FeedbackSection";
import { feedbackConfigured } from "@/lib/feedback";
import type { SurveyId } from "@/data/feedback";

export function FeedbackPlacement({ survey }: { survey: SurveyId }) {
  if (!feedbackConfigured()) return null;
  return <FeedbackSection survey={survey} siteKey={process.env.FEEDBACK_TURNSTILE_SITE_KEY!} />;
}
