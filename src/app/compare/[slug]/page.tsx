import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { companies, getCareerInfo } from "@/data/companies";
import { companyCompareSlug, getCompaniesFromCompareSlug } from "@/lib/format";

type CompareDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const pairs = [
    ["tsmc", "micron"],
    ["tsmc", "tokyo-electron"],
    ["tokyo-electron", "skyworks"],
  ];

  return pairs.map((pair) => ({ slug: companyCompareSlug(pair) }));
}

export async function generateMetadata({ params }: CompareDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparedCompanies = getCompaniesFromCompareSlug(slug);

  if (comparedCompanies.length < 2) {
    return {};
  }

  return {
    title: `${comparedCompanies.map((company) => company.nameJa).join(" vs ")} 比較`,
    description: `${comparedCompanies.map((company) => company.nameJa).join(" と ")}を、事業領域、職種、英語必要度、キャリア準備ポイントで比較します。`,
  };
}

export default async function CompareDetailPage({ params }: CompareDetailPageProps) {
  const { slug } = await params;
  const comparedCompanies = getCompaniesFromCompareSlug(slug);

  if (comparedCompanies.length < 2) {
    notFound();
  }

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Compare</p>
        <h1>{comparedCompanies.map((company) => company.nameJa).join(" と ")} の比較</h1>
        <p>勝ち負けではなく、事業領域、向いている経験、準備ポイントの違いを整理します。</p>
        <div className="actions">
          <Link className="button ghost" href="/compare">
            比較を選び直す
          </Link>
        </div>
      </section>

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
                return <td key={company.id}>{career?.suitableBackgrounds.join(" / ") ?? "公開情報を確認中"}</td>;
              })}
            </tr>
            <tr>
              <th>半年後の準備</th>
              {comparedCompanies.map((company) => {
                const career = getCareerInfo(company.id);
                return <td key={company.id}>{career?.preparationActions6Months.join(" / ") ?? "公開情報を確認中"}</td>;
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

      <AffiliateCta title="比較した企業に近いキャリアを相談する" />
    </main>
  );
}
