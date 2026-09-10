import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { CareerCompassCta } from "@/components/CareerCompassCta";
import { IndustryMapExplorer } from "@/components/IndustryMapExplorer";
import { StructuredData } from "@/components/StructuredData";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { companies, getCareerInfo, segments } from "@/data/companies";
import { industryMapFields } from "@/data/industry-map";
import { getPublicCompanyLocations } from "@/lib/company-locations";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "半導体業界地図・業界マップ【2026年版】サプライチェーンを図解",
  description: "半導体の設計、材料、前工程、製造装置、後工程、検査、最終製品の関係を業界地図で図解。日本・海外の代表企業と職種を、操作できるマップとテキスト一覧で整理します。",
  alternates: { canonical: "/industry-map" },
  openGraph: {
    title: "半導体業界地図・業界マップ【2026年版】",
    description: "設計から最終製品まで、半導体サプライチェーンと代表企業の関係を図解します。",
    type: "website",
    url: "/industry-map",
  },
};

export default function IndustryMapPage() {
  const companiesWithPublicLocations = new Set(getPublicCompanyLocations().map((location) => location.companyId));
  const companySummaries = companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    nameJa: company.nameJa,
    summary: company.summary,
    businessModel: company.businessModel,
    mainProducts: company.mainProducts,
    jobCategories: company.jobCategories,
    hasPublicLocations: companiesWithPublicLocations.has(company.id),
    hasCareerPreparation: Boolean(getCareerInfo(company.id)),
  }));

  return (
    <main className="page industry-map-page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "半導体業界地図", item: `${siteUrl}/industry-map` },
        ],
      }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><span>半導体業界地図・業界マップ</span>
      </nav>
      <header className="industry-map-hero">
        <div>
          <p className="section-label">SEMICONDUCTOR ECOSYSTEM</p>
          <h1>半導体業界地図・業界マップ</h1>
          <p>設計、材料、前工程、製造装置、後工程、検査、最終製品まで。工程をたどりながら、日本・海外企業と職種のつながりを探索します。</p>
        </div>
        <p><strong>6工程 × 3つの視点</strong><span>ドラッグ・ズーム・クリックで確認</span></p>
      </header>

      <IndustryMapExplorer companies={companySummaries} totalCompanyCount={companies.length} />

      <section className="section industry-supply-chain" aria-labelledby="industry-supply-chain-title">
        <div className="industry-map-directory-heading">
          <p className="section-label">Supply chain fields</p>
          <h2 id="industry-supply-chain-title">半導体サプライチェーンを7つの領域から理解する</h2>
          <p>地図の工程に関わる企業と、その役割を領域ごとに整理しています。材料・装置は複数工程を支え、検査・計測も工程の途中で行われます。以下は作業順ではなく、気になる領域から読むための一覧です。</p>
        </div>
        <ul>
          {industryMapFields.map((stage) => {
            const stageCompanies = stage.companyIds
              .map((id) => companies.find((company) => company.id === id))
              .filter((company) => company !== undefined);

            return (
              <li id={`supply-chain-${stage.id}`} key={stage.id}>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  <p className="industry-supply-chain__company-label">{stage.companyLabel}</p>
                  <ul aria-label={stage.companyLabel}>
                    {stageCompanies.map((company) => (
                      <li key={company.id}>
                        <TrackedInternalLink
                          eventName="industry_map_category_click"
                          eventProperties={{ category: stage.id, destination: "company" }}
                          href={`/companies/${company.slug}` as Route}
                        >
                          {company.nameJa}<small>{company.headquartersCountry === "日本" ? "日本" : "海外"}</small>
                        </TrackedInternalLink>
                      </li>
                    ))}
                  </ul>
                  <TrackedInternalLink
                    className="text-link"
                    eventName="industry_map_category_click"
                    eventProperties={{ category: stage.id, destination: "guide" }}
                    href={stage.guideHref}
                  >
                    {stage.guideLabel} <span aria-hidden="true">→</span>
                  </TrackedInternalLink>
                </div>
              </li>
            );
          })}
        </ul>
        <aside>
          <strong>企業名や職種から探す場合</strong>
          <p>このページは業界構造と関係を理解するための地図です。会社単位なら<Link href="/companies">半導体メーカー・企業一覧</Link>、勤務地単位なら<Link href="/semiconductor-map">日本の半導体企業・工場マップ</Link>を使ってください。</p>
        </aside>
      </section>

      <nav className="companies-next-links" aria-label="半導体業界の主要な企業研究ページ">
        <Link href="/semiconductor-map"><strong>日本の半導体企業・工場マップ</strong><span>都道府県と職種から国内拠点を探す</span></Link>
        <Link href="/segments/fabless"><strong>ファブレス企業一覧</strong><span>日本・海外の設計企業と主力分野を見る</span></Link>
        <Link href="/guides/semiconductor-foundry"><strong>ファウンドリとは</strong><span>ファブレス・IDM・OSATとの違いを見る</span></Link>
        <Link href="/companies"><strong>半導体メーカー・企業一覧</strong><span>分野、地域、職種から企業を探す</span></Link>
        <Link href="/guides/semiconductor-market-cap-ranking"><strong>2026年の世界・日本ランキング</strong><span>時価総額と売上高の違いを踏まえて比較する</span></Link>
        <Link href="/guides/semiconductor-manufacturing-process"><strong>半導体製造工程</strong><span>設計から前工程・後工程・最終検査までをたどる</span></Link>
      </nav>

      <CareerCompassCta
        body="工程改善、設備、品質、生産技術などの経験を12問で整理し、接点のある半導体工程・職種と次の準備を確認できます。"
        ctaLocation="industry_map_after_supply_chain"
        ctaVariant="process_to_role"
        sourcePage="/industry-map"
        title="業界の流れが分かったら、自分の経験がつながる場所を確認する"
      />

      <section className="section">
        <div className="industry-map-directory-heading">
          <p className="section-label">Explore by role and product</p>
          <h2>事業の役割・製品分野から企業を探す</h2>
          <p>ファブレス・ファウンドリ・IDMは、設計や製造をどう担うかという事業モデルです。メモリ・アナログ・パワーは製品分野です。一社が複数の役割や製品分野を持つことがあります。</p>
        </div>
        <div className="segment-map">
          {segments.map((segment) => {
            const relatedCompanies = companies.filter((company) => segment.relatedCompanyIds.includes(company.id));

            const displayName = segment.id === "idm" ? "IDM（設計・製造）" : segment.name;

            return (
              <article className="segment-card" key={segment.id}>
                <p className="section-label">{segment.shortName}</p>
                <h2>{displayName}</h2>
                <p>{segment.description}{segment.id === "idm" ? " ここでは主にアナログ・パワー分野の企業を掲載しています。" : ""}</p>
                <Link className="text-link" href={`/segments/${segment.slug}` as Route}>
                  {displayName}を詳しく見る
                </Link>
                <strong>代表企業</strong>
                <ul className="tag-list">
                  {relatedCompanies.map((company) => (
                    <li key={company.id}>
                      <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
