import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CareerCompassCta } from "@/components/CareerCompassCta";
import { CompanyQuickSummary } from "@/components/CompanyQuickSummary";
import { StructuredData } from "@/components/StructuredData";
import { companies, getCareerInfo, getCompanyBySlug, getSegmentById, isCompanyIndexable } from "@/data/companies";
import { filterCompanyLocations } from "@/lib/company-locations";
import { siteUrl } from "@/lib/format";
import type { LocationType } from "@/types/company-location";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

const locationTypeLabels: Record<LocationType, string> = {
  headquarters: "本社",
  office: "オフィス",
  factory: "工場",
  "research-development": "研究開発",
  "design-center": "設計・開発",
  "field-service": "フィールドサービス",
  logistics: "物流・施設",
};

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    return {};
  }

  return {
    title: `${company.nameJa}の転職・仕事内容・キャリア準備`,
    description: `${company.nameJa}の事業領域、主力製品、日本拠点、英語必要度、転職時に見たいポイントを整理します。`,
    alternates: { canonical: `/companies/${company.slug}` },
    robots: isCompanyIndexable(company) ? undefined : { index: false, follow: true },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const career = getCareerInfo(company.id);
  const confirmedLocations = filterCompanyLocations({ companyId: company.id });
  const confirmedPrefectureNames = [...new Set(confirmedLocations.map((location) => location.prefectureName))];
  const companySegments = company.industrySegments.map((segmentId) => getSegmentById(segmentId)).filter(Boolean);
  const compareTarget = companies.find((item) => item.id !== company.id && item.industrySegments.some((segment) => company.industrySegments.includes(segment)));
  const featuredComparisonTarget = company.id === "asml"
    ? "東京エレクトロン"
    : company.id === "tokyo-electron"
      ? "ASML"
      : null;
  const compareHref = (featuredComparisonTarget
    ? "/compare/asml-vs-tokyo-electron"
    : compareTarget
      ? `/compare/${company.id}-vs-${compareTarget.id}`
      : "/compare") as Route;
  const compareLabel = featuredComparisonTarget
    ? `${featuredComparisonTarget}との違いを見る`
    : "近い会社と比較する";

  return (
    <main className="page company-detail-page">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: company.name,
          alternateName: company.nameJa,
          url: company.websiteUrl,
          sameAs: company.sources.map((source) => source.url),
        }}
      />
      <section className="page-hero">
        <p className="eyebrow">{company.businessModel}</p>
        <h1>{company.nameJa}</h1>
        <p>{company.careerSummary}</p>
        <div className="actions">
          <Link className="button primary" href={compareHref}>
            {compareLabel}
          </Link>
          <Link className="button ghost" href={`/companies/${company.slug}#career-prep` as Route}>
            準備を見る
          </Link>
          <Link className="button ghost" href="/companies">
            企業一覧に戻る
          </Link>
        </div>
      </section>

      <CompanyQuickSummary
        career={career}
        company={company}
        segmentNames={companySegments.flatMap((segment) => segment ? [segment.name] : [])}
      />

      <div className="detail-layout">
        <div className="stack">
          <section className="detail-panel">
            <p className="eyebrow">3分でわかる会社概要</p>
            <h2>業界での立ち位置</h2>
            <p>{company.summary}</p>
            <ul className="tag-list">
              {companySegments.map((segment) => (
                <li key={segment?.id}>{segment?.name}</li>
              ))}
            </ul>
            <p className="company-industry-map-link">
              <Link className="text-link" href="/industry-map">半導体業界地図</Link>で、設計・材料・製造・装置・後工程のどこを担う企業か確認できます。
            </p>
          </section>

          <section className="detail-panel">
            <p className="eyebrow">主な製品</p>
            <h2>主力製品</h2>
            <ul className="tag-list">
              {company.mainProducts.map((product) => (
                <li key={product}>{product}</li>
              ))}
            </ul>
          </section>

          {confirmedLocations.length > 0 ? (
            <section className="detail-panel company-location-panel" id="japan-locations">
              <p className="eyebrow">日本の確認済み拠点</p>
              <h2>{company.nameJa}の国内拠点</h2>
              <p>企業公式情報で、所在地と半導体関連の役割を確認できた拠点です。現在の求人有無とは分けて掲載しています。</p>
              <ul className="company-location-list">
                {confirmedLocations.map((location) => (
                  <li key={location.id}>
                    <div>
                      <strong>{location.name}</strong>
                      <span>{location.prefectureName}{location.municipality}</span>
                      <small>{location.locationTypes.map((type) => locationTypeLabels[type]).join(" / ")}</small>
                    </div>
                    <Link href={`/semiconductor-map?prefecture=${location.prefectureCode}#${location.id}` as Route}>
                      拠点情報を見る <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="text-link company-location-map-link" href="/semiconductor-map">
                全国の半導体企業・工場マップを見る
              </Link>
            </section>
          ) : null}

          <section className="detail-panel" id="career-prep">
            <p className="eyebrow">キャリア準備</p>
            <h2>{company.nameJa}へ近づくためのキャリア準備</h2>
            {career ? (
              <>
                <div className="readiness-grid">
                  <div className="readiness-block">
                    <h3>向いている経験</h3>
                    <ul>
                      {career.suitableBackgrounds.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="readiness-block">
                    <h3>関連する職種</h3>
                    <ul>
                      {career.typicalRoles.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="readiness-block">
                    <h3>伸ばすスキル</h3>
                    <ul>
                      {career.usefulSkills.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="readiness-block">
                    <h3>次に近づく経験</h3>
                    <ul>
                      {career.stretchBackgrounds.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="readiness-block">
                    <h3>半年の準備</h3>
                    <ul>
                      {career.preparationActions6Months.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="readiness-block">
                    <h3>1年の準備</h3>
                    <ul>
                      {career.preparationActions1Year.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <aside className="company-today-action">
                  <span>今日からできること</span>
                  <strong>{career.preparationActions6Months[0]}</strong>
                  <small>{career.notes}</small>
                </aside>
                <CareerCompassCta
                  body={`${company.nameJa}の企業研究と合わせて、現在の仕事内容や実績から接点のある半導体職種と次の準備を整理できます。`}
                  ctaLocation="company_career_prep"
                  ctaVariant="company_prep_to_role"
                  headingLevel="h3"
                  sourcePage={`/companies/${company.slug}`}
                  title="自分の経験がどの半導体職種に近いか整理する"
                />
              </>
            ) : (
              <p>公開情報を確認しながら準備ポイントを整理中です。</p>
            )}
          </section>
        </div>

        <aside className="stack">
          <section className="detail-panel">
            <p className="eyebrow">基本情報</p>
            <h2>基本情報</h2>
            <dl className="mini-facts">
              <div>
                <dt>本社</dt>
                <dd>{company.headquartersCountry}</dd>
              </div>
              <div>
                <dt>日本拠点</dt>
                <dd>{confirmedPrefectureNames.length > 0 ? confirmedPrefectureNames.join(" / ") : company.locationsJapan.join(" / ")}</dd>
              </div>
              <div>
                <dt>職種</dt>
                <dd>{company.jobCategories.join(" / ")}</dd>
              </div>
              <div>
                <dt>英語必要度</dt>
                <dd>{company.englishRequirement}</dd>
              </div>
            </dl>
          </section>
          <section className="detail-panel">
            <p className="eyebrow">出典</p>
            <h2>情報ソース</h2>
            <ul className="source-list">
              {company.sources.map((source) => (
                <li key={source.url}>
                  <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  <br />
                  {source.publisher} / 確認日: {source.accessedAt}
                </li>
              ))}
            </ul>
            <p className="disclosure">最終更新日: {company.lastUpdated}</p>
          </section>
        </aside>
      </div>

      <AffiliateCta title={`${company.nameJa}に近い求人・キャリアを相談する`} />
    </main>
  );
}
