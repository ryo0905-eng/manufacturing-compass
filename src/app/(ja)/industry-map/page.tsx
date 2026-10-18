import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { CareerCompassCta } from "@/components/CareerCompassCta";
import { IndustryAtlas } from "@/components/IndustryAtlas";
import { ResearchNavigation, ResearchNavigationLink } from "@/components/ResearchNavigation";
import { EarningsInternalLink } from "@/components/earnings/EarningsLinks";
import { StructuredData } from "@/components/StructuredData";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { companies, segments } from "@/data/companies";
import { industryMapFields } from "@/data/industry-map";
import { researchPages } from "@/data/research-navigation";
import { buildAtlasCompanies, buildDirectoryCompanies } from "@/lib/company-explorer";
import { siteUrl } from "@/lib/format";

const japaneseCompanyCount = companies.filter((company) => company.headquartersCountry === "日本").length;
const japaneseCompaniesBySegment = segments
  .map((segment) => ({
    segment,
    companies: companies.filter((company) =>
      company.headquartersCountry === "日本" && company.industrySegments.includes(segment.id),
    ),
  }))
  .filter(({ companies: groupedCompanies }) => groupedCompanies.length > 0);

const atlasCompanies = buildAtlasCompanies(buildDirectoryCompanies(companies, [], []));
const pageTitle = "半導体業界地図・日本と世界のメーカー一覧【2026年版】";
const pageDescription = `半導体業界の8領域と日本・海外の全${atlasCompanies.length}社を図解。企業詳細${companies.length}社と簡易紹介7社を、製品・職種・本社地域・国内拠点情報から探せます。日本のメーカー一覧と企業比較への導線も掲載。`;

const baseMetadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/industry-map" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    url: "/industry-map",
  },
};

type IndustryMapPageProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: IndustryMapPageProps): Promise<Metadata> {
  const params = await searchParams;
  return { ...baseMetadata, robots: params.query !== undefined ? { index: false, follow: true } : undefined };
}

export default async function IndustryMapPage({ searchParams }: IndustryMapPageProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : params.query?.[0] ?? "";
  return (
    <main className="page industry-map-page industry-map-page--overview">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "業界地図・企業一覧", item: `${siteUrl}/industry-map` },
        ],
      }} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "半導体業界地図・企業一覧",
        numberOfItems: atlasCompanies.length,
        itemListElement: atlasCompanies.map((company, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: company.nameJa,
          url: company.slug ? `${siteUrl}/companies/${company.slug}` : company.websiteUrl,
        })),
      }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><span>業界地図・企業一覧</span>
      </nav>
      <header className="industry-map-hero">
        <div>
          <h1>半導体業界地図・企業一覧</h1>
          <p>{researchPages.industry_map.lead}</p>
        </div>
        <p><strong>8領域 × {atlasCompanies.length}社</strong><span>企業詳細{companies.length}社・簡易紹介7社</span></p>
      </header>
      <ResearchNavigation page="industry_map" />
      <IndustryAtlas companies={companies} initialQuery={query} segments={segments} />

      <section className="companies-japan" id="japanese-companies" aria-labelledby="companies-japan-title">
        <header>
          <p className="section-label">日本に本社がある掲載企業</p>
          <h2 id="companies-japan-title">日本の半導体メーカー・関連企業一覧</h2>
          <p>企業詳細を掲載する日本企業{japaneseCompanyCount}社を分野別にまとめました。複数の分野を担う企業は、それぞれの分野に掲載しています。</p>
        </header>
        <div className="companies-japan__grid">
          {japaneseCompaniesBySegment.map(({ segment, companies: groupedCompanies }) => (
            <section key={segment.id} aria-labelledby={`japanese-${segment.id}`}>
              <h3 id={`japanese-${segment.id}`}>{segment.name}<span>{groupedCompanies.length}社</span></h3>
              <ul>
                {groupedCompanies.map((company) => (
                  <li key={company.id}>
                    <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link>
                    <span className="companies-japan__products">{company.mainProducts.slice(0, 2).join(" / ")}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <p className="tool-related-links"><Link href="/companies/global-japan">外資系企業は日本で何をしている？ 仕事内容から探す →</Link></p>
      <p className="tool-related-links"><EarningsInternalLink href="/semiconductor-watch/earnings" destination="earnings_hub">装置メーカー5社の決算から、事業の変化を読む →</EarningsInternalLink></p>

      <p className="tool-related-links"><Link href="/tools/semiconductor-process">半導体ができるまでを、動く断面図で確かめる →</Link></p>

      <section className="section industry-supply-chain" aria-labelledby="industry-supply-chain-title">
        <div className="industry-map-directory-heading">
          <p className="section-label">Supply chain fields</p>
          <h2 id="industry-supply-chain-title">半導体サプライチェーンを7つの領域から理解する</h2>
          <p>地図の工程に関わる企業と、その役割を領域ごとに整理しています。材料・装置は複数工程を支え、検査・計測も工程の途中で行われます。以下は作業順ではなく、気になる領域から読むための一覧です。</p>
        </div>
        <ul>
          {industryMapFields.map((stage) => (
            <li id={`supply-chain-${stage.id}`} key={stage.id}>
              <div>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <TrackedInternalLink className="text-link" eventName="industry_map_category_click" eventProperties={{ category: stage.id, destination: "guide", source_page: "/industry-map", ui_version: "overview-atlas-v3" }} href={stage.guideHref}>
                  {stage.guideLabel} <span aria-hidden="true">→</span>
                </TrackedInternalLink>
              </div>
            </li>
          ))}
        </ul>
        <aside>
          <strong>気になる領域が見つかったら</strong>
          <p><Link href="#company-search">地図の検索</Link>で製品・職種から絞り込めます。勤務地から調べる場合は<Link href="/semiconductor-map">日本の半導体企業・工場マップ</Link>も使えます。</p>
        </aside>
      </section>

      <nav className="companies-next-links" aria-label="半導体業界の主要な企業研究ページ">
        <ResearchNavigationLink source="industry_map" destination="semiconductor_map" action="related_link" href={researchPages.semiconductor_map.href}><strong>{researchPages.semiconductor_map.label}</strong><span>都道府県と職種から国内拠点を探す</span></ResearchNavigationLink>
        <ResearchNavigationLink source="industry_map" destination="factory_projects" action="related_link" href={researchPages.factory_projects.href}><strong>{researchPages.factory_projects.label}</strong><span>主要5案件の場所、稼働状況、今後の予定を確認する</span></ResearchNavigationLink>
        <Link href="/segments/fabless"><strong>ファブレス企業一覧</strong><span>日本・海外の設計企業と主力分野を見る</span></Link>
        <Link href="/guides/semiconductor-foundry"><strong>ファウンドリとは</strong><span>ファブレス・IDM・OSATとの違いを見る</span></Link>
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
          <span id="companies-role-title" className="company-explorer-legacy-anchor" aria-hidden="true" />
          <span id="companies-adjacent-title" className="company-explorer-legacy-anchor" aria-hidden="true" />
          <h2 id="companies-taxonomy-title">事業の役割・製品分野から企業を探す</h2>
          <p>ファブレス・ファウンドリ・IDMは、設計や製造をどう担うかという事業モデルです。メモリ・アナログ・パワーは製品分野です。一社が複数の役割や製品分野を持つことがあります。</p>
        </div>
        <div className="segment-map">
          {segments.map((segment) => {
            const displayName = segment.id === "idm" ? "IDM（設計・製造）" : segment.name;

            return (
              <article className="segment-card" key={segment.id}>
                <p className="section-label">{segment.shortName}</p>
                <h3>{displayName}</h3>
                <p>{segment.description}{segment.id === "idm" ? " ここでは主にアナログ・パワー分野の企業を掲載しています。" : ""}</p>
                <Link className="text-link" href={`/segments/${segment.slug}` as Route}>
                  {displayName}を詳しく見る
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
