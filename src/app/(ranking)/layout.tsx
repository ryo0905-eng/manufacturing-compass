import JapaneseLayout from "@/app/(ja)/layout";
import { ClarityConsent } from "@/components/ClarityConsent";

export { metadata } from "@/app/(ja)/layout";

/** Separate root: leaving this group destroys the document and the Clarity runtime. */
export default function RankingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const projectId = process.env.VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    : undefined;
  return <JapaneseLayout>
    {projectId && /^[a-z0-9]+$/.test(projectId) ? <ClarityConsent projectId={projectId} /> : null}
    <div data-clarity-mask="true">{children}</div>
  </JapaneseLayout>;
}
