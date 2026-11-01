import { feedbackSurveys, features, interests, needs, type SurveyId } from "@/data/feedback";

export type Feedback = { id: string; survey: SurveyId; need: string; feature: string; interest: string; detail: string; email: string; consent: boolean };
const member = (list: readonly (readonly [string, string])[], value: unknown) => typeof value === "string" && list.some(([id]) => id === value);

export function validateFeedback(value: unknown): Feedback | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v.id)) return null;
  if (typeof v.survey !== "string" || !Object.hasOwn(feedbackSurveys, v.survey)) return null;
  const survey = v.survey as SurveyId;
  if (!member(needs, v.need) || !member(features[feedbackSurveys[survey].context], v.feature) || !member(interests, v.interest)) return null;
  if (typeof v.detail !== "string" || v.detail.length > 500 || typeof v.email !== "string" || v.email.length > 254 || typeof v.consent !== "boolean") return null;
  const email = v.email.trim();
  if ((email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !v.consent)) || (!email && v.consent)) return null;
  return { id: v.id, survey, need: v.need as string, feature: v.feature as string, interest: v.interest as string, detail: v.detail.trim(), email, consent: v.consent };
}

export function feedbackConfigured() {
  return process.env.FEEDBACK_ENABLED === "true" && ["FEEDBACK_TURNSTILE_SITE_KEY", "FEEDBACK_TURNSTILE_SECRET", "FEEDBACK_REDIS_URL", "FEEDBACK_REDIS_TOKEN", "FEEDBACK_RATE_SECRET", "FEEDBACK_SINK_URL", "FEEDBACK_SINK_SECRET"].every(key => Boolean(process.env[key]));
}
