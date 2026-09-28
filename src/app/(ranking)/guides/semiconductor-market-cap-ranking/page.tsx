import GuidePage, { generateMetadata as guideMetadata } from "@/app/(ja)/guides/[slug]/page";

const props = () => ({ params: Promise.resolve({ slug: "semiconductor-market-cap-ranking" }) });

export function generateMetadata() { return guideMetadata(props()); }
export default function RankingPage() { return GuidePage(props()); }
