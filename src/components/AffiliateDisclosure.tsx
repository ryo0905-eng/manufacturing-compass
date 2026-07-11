import { affiliateDisclosureText } from "@/data/affiliateLinks";

type AffiliateDisclosureProps = {
  label?: string;
  text?: string;
};

export function AffiliateDisclosure({ label = "広告表記", text = affiliateDisclosureText }: AffiliateDisclosureProps) {
  return (
    <aside className="affiliate-disclosure">
      <span>{label}</span>
      <p>{text}</p>
    </aside>
  );
}
