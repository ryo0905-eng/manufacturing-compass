import { affiliateDisclosureText } from "@/data/affiliateLinks";

type AffiliateDisclosureProps = {
  text?: string;
};

export function AffiliateDisclosure({ text = affiliateDisclosureText }: AffiliateDisclosureProps) {
  return (
    <aside className="affiliate-disclosure">
      <span>広告表記</span>
      <p>{text}</p>
    </aside>
  );
}
