import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyComparisonSummary } from "@/components/CompanyComparisonSummary";
import { getCompanyComparisonProfile } from "@/data/company-comparisons";
import { companies, getCareerInfo } from "@/data/companies";
import { comparePairs } from "@/data/editorial";
import { companyCompareSlug, getCompaniesFromCompareSlug } from "@/lib/format";

type CompareDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparePairs.map((pair) => ({ slug: companyCompareSlug(pair) }));
}

export async function generateMetadata({ params }: CompareDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparedCompanies = getCompaniesFromCompareSlug(slug);
  const comparisonProfile = getCompanyComparisonProfile(slug);

  if (comparedCompanies.length < 2) {
    return {};
  }

  if (comparisonProfile) {
    return {
      title: comparisonProfile.title,
      description: comparisonProfile.description,
      alternates: {
        canonical: `/compare/${slug}`,
      },
      openGraph: {
        title: comparisonProfile.title,
        description: comparisonProfile.description,
        type: "article",
        url: `/compare/${slug}`,
      },
    };
  }

  return {
    title: `${comparedCompanies.map((company) => company.nameJa).join(" vs ")} 比較`,
    description: `${comparedCompanies.map((company) => company.nameJa).join(" と ")}を、事業領域、職種、英語必要度、キャリア準備ポイントで比較します。`,
  };
}

export default async function CompareDetailPage({ params }: CompareDetailPageProps) {
  const { slug } = await params;
  const comparedCompanies = getCompaniesFromCompareSlug(slug);
  const comparisonProfile = getCompanyComparisonProfile(slug);

  if (comparedCompanies.length < 2) {
    notFound();
  }

  const comparisonEntries = comparedCompanies.map((company) => ({ company, career: getCareerInfo(company.id) }));

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">企業比較</p>
        <h1>{comparisonProfile?.heading ?? `${comparedCompanies.map((company) => company.nameJa).join(" と ")} の比較`}</h1>
        <p>{comparisonProfile?.lead ?? "勝ち負けではなく、事業領域、向いている経験、準備ポイントの違いを整理します。"}</p>
        <div className="actions">
          <Link className="button ghost" href="/compare">
            比較を選び直す
          </Link>
        </div>
      </section>

      {comparisonProfile ? (
        <section className="section" aria-labelledby="featured-comparison-title">
          <div className="section-header">
            <div>
              <p className="section-label">最初に結論</p>
              <h2 id="featured-comparison-title">{comparisonProfile.summaryHeading}</h2>
            </div>
          </div>
          <p>{comparisonProfile.summary}</p>
          <div className="grid-3">
            {comparisonProfile.highlights.map((highlight) => (
              <article className="info-card" key={highlight.label}>
                <p className="section-label">{highlight.label}</p>
                <h3>{highlight.title}</h3>
                <p>{highlight.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <CompanyComparisonSummary entries={comparisonEntries} />

      <section className="comparison-table-wrap" aria-label="企業比較表">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>比較軸</th>
              {comparedCompanies.map((company) => (
                <th key={company.id}>{company.nameJa}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>事業領域</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.businessModel}</td>
              ))}
            </tr>
            <tr>
              <th>主力製品</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.mainProducts.join(" / ")}</td>
              ))}
            </tr>
            <tr>
              <th>日本拠点</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.locationsJapan.join(" / ")}</td>
              ))}
            </tr>
            <tr>
              <th>募集職種の例</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.jobCategories.join(" / ")}</td>
              ))}
            </tr>
            <tr>
              <th>英語必要度</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.englishRequirement}</td>
              ))}
            </tr>
            <tr>
              <th>今狙いやすい背景</th>
              {comparedCompanies.map((company) => {
                const career = getCareerInfo(company.id);
                return <td key={company.id}>{career?.suitableBackgrounds.join(" / ") ?? "掲載データなし（推測で補完していません）"}</td>;
              })}
            </tr>
            <tr>
              <th>半年後の準備</th>
              {comparedCompanies.map((company) => {
                const career = getCareerInfo(company.id);
                return <td key={company.id}>{career?.preparationActions6Months.join(" / ") ?? "掲載データなし（推測で補完していません）"}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <div className="company-grid">
          {comparedCompanies.map((company) => (
            <article className="company-card" key={company.id}>
              <p className="eyebrow">{company.businessModel}</p>
              <h2>{company.nameJa}</h2>
              <p>{company.careerSummary}</p>
              <Link className="text-link" href={`/companies/${company.slug}` as Route}>
                詳細を見る
              </Link>
            </article>
          ))}
        </div>
      </section>

      {comparisonProfile ? (
        <section className="section" aria-labelledby="comparison-sources-title">
          <div className="section-header">
            <div>
              <p className="section-label">公式情報</p>
              <h2 id="comparison-sources-title">比較に使った情報ソース</h2>
            </div>
          </div>
          <div className="company-grid">
            {comparedCompanies.map((company) => (
              <article className="company-card" key={company.id}>
                <h3>{company.nameJa}</h3>
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
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <AffiliateCta title="比較した企業に近いキャリアを相談する" />
    </main>
  );
}
