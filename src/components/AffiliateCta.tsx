import Link from "next/link";
import { affiliateDisclosureText, getPrimaryAgent } from "@/data/affiliateLinks";

type AffiliateCtaProps = {
  title?: string;
  body?: string;
};

export function AffiliateCta({
  title = "半導体業界に強い転職エージェントに相談する",
  body = "企業研究で方向性が見えてきたら、今狙える会社と半年後・1年後に向けた準備を第三者に相談するのも現実的です。",
}: AffiliateCtaProps) {
  const partner = getPrimaryAgent();

  return (
    <section className="cta-panel" aria-labelledby="career-cta-title">
      <p className="eyebrow">Career next step</p>
      <h2 id="career-cta-title">{title}</h2>
      <p>{body}</p>
      <div className="cta-actions">
        <Link className="button primary" href="/career-agents">
          相談の選択肢を見る
        </Link>
        <Link className="button ghost" href="/companies">
          企業研究を続ける
        </Link>
      </div>
      <p className="disclosure">{partner ? affiliateDisclosureText : "本ページには広告リンクが含まれる場合があります。"}</p>
    </section>
  );
}
