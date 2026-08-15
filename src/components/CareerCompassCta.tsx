import { CareerCompassLink } from "@/components/CareerCompassLink";

type CareerCompassCtaProps = {
  body: string;
  ctaLabel?: string;
  ctaLocation: string;
  ctaVariant: string;
  headingLevel?: "h2" | "h3";
  sourcePage?: string;
  title: string;
};

export function CareerCompassCta({
  body,
  ctaLabel = "経験から近い職種を確認する",
  ctaLocation,
  ctaVariant,
  headingLevel = "h2",
  sourcePage,
  title,
}: CareerCompassCtaProps) {
  const Heading = headingLevel;

  return (
    <aside className="career-compass-entry">
      <div>
        <p className="section-label">CAREER COMPASS</p>
        <Heading>{title}</Heading>
        <p>{body}</p>
        <small>12問・約3分・登録不要。氏名や連絡先は入力しません。</small>
      </div>
      <CareerCompassLink
        className="button primary"
        ctaLocation={ctaLocation}
        ctaVariant={ctaVariant}
        sourcePage={sourcePage}
      >
        {ctaLabel}<span aria-hidden="true">→</span>
      </CareerCompassLink>
    </aside>
  );
}
