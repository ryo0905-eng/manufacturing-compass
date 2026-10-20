import type { Metadata } from "next";
import Link from "next/link";
import { SemiconductorLocationApp } from "@/components/SemiconductorLocationApp";
import { ResearchNavigation, ResearchNavigationLink } from "@/components/ResearchNavigation";
import { StructuredData } from "@/components/StructuredData";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "@/components/semiconductor-location-map.module.css";
import appStyles from "@/components/SemiconductorLocationExplorer.module.css";
import { locationCompanies } from "@/data/location-companies";
import { locationSources } from "@/data/company-locations";
import { factoryProjects, factoryProjectSources } from "@/data/factory-projects";
import { researchPages } from "@/data/research-navigation";
import { getHiringSignals, getPublicCompanyLocations, validateCompanyLocationData } from "@/lib/company-locations";
import { filterExplorerRows, readExplorerState, validateExplorerData } from "@/lib/location-explorer";
import { siteUrl } from "@/lib/format";

const pageTitle = "日本の半導体企業・工場マップ【2026年版】製造・研究拠点一覧";
const pageDescription = "日本で働ける半導体メーカー、製造装置、材料、設計企業の工場・研究開発・設計拠点を、都道府県、役割、関連職種、公式採用情報とともに整理します。";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  return { title: pageTitle, description: pageDescription, alternates: { canonical: "/semiconductor-map" },
    robots: { index: !Object.values(params).some(value => value !== undefined), follow: true },
    openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/semiconductor-map" } };
}

export default async function SemiconductorMapPage({ searchParams }: Props) {
  const errors = validateCompanyLocationData();
  if (errors.length) throw new Error(`半導体拠点データの整合性エラー: ${errors.join(" / ")}`);
  const locations = [...getPublicCompanyLocations()].sort((a, b) => a.prefectureCode.localeCompare(b.prefectureCode) || a.name.localeCompare(b.name, "ja"));
  const companies = locationCompanies.filter(company => locations.some(location => location.companyId === company.id));
  const companyById = new Map(companies.map(company => [company.id, company]));
  const explorerErrors = validateExplorerData({ locations, companies, projects: factoryProjects }, locationSources, factoryProjectSources);
  if (explorerErrors.length) throw new Error(explorerErrors.join(" / "));
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, item);
  }
  const initialState = readExplorerState(params, { locations, companies, projects: factoryProjects });
  const initialRows = filterExplorerRows({ locations, companies, projects: factoryProjects }, initialState);
  const dates = [...new Set(locations.map(location => location.lastVerifiedAt))].sort();
  return <main className={`page ${styles.page} ${appStyles.explorerPage}`}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "日本の半導体企業・工場マップ", item: `${siteUrl}/semiconductor-map` },
    ] }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "ItemList", name: "日本の半導体企業・工場マップ・研究拠点一覧",
      numberOfItems: initialRows.length, itemListElement: initialRows.map((row, index) => ({ "@type": "ListItem", position: index + 1,
        name: `${companyById.get(row.location.companyId)?.nameJa ?? ""} ${row.project?.name ?? row.location.name}`,
        url: `${siteUrl}/semiconductor-map#${row.id}` })) }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>日本の半導体企業・工場マップ</span></nav>
    <header className={appStyles.pageHeading}><h1>日本の半導体企業・工場・研究拠点マップ</h1>
      <p>日本地図で所在地と仕事の接点を探し、新設・増設の節目を確認できます。</p>
      <p>拠点情報の確認日：{dates[0]}〜{dates.at(-1)}。案件・座標の確認日は各詳細に表示しています。</p></header>
    <SemiconductorLocationApp companies={companies} locations={locations} projects={factoryProjects} sources={locationSources}
      projectSources={factoryProjectSources} hiringSignals={getHiringSignals()} initialState={initialState} />
    <ResearchNavigation page="semiconductor_map" />
    <section className={styles.methodology} aria-labelledby="location-methodology-title"><div>
      <p className="section-label">掲載基準</p><h2 id="location-methodology-title">公式情報で確認できた内容だけを掲載</h2></div>
      <ul><li>正式な拠点名、所在地、運営法人、半導体との関係を確認できる国内拠点を掲載しています。</li>
        <li>同じ敷地は1拠点として扱い、既存工場と新棟の状態を分けます。試作ラインの稼働は量産開始とは異なります。</li>
        <li>掲載数は当サイトの確認範囲であり、全国の工場数や求人件数を表しません。</li>
        <li>職種は拠点との根拠がある場合だけ表示します。所在地と現在の採用状況は別に確認しています。</li>
        <li>座標を照合できた拠点だけピンを表示し、施設の正門や建屋入口の位置は保証しません。</li>
        <li>公式ページの地図案内をエージェントが照合した座標は、人による確認と区別して記録しています。</li>
        <li>採用情報の確認期限を過ぎた場合は「再確認中」と表示します。</li></ul></section>
    <nav className={styles.nextLinks} aria-label="次に確認するページ">
      <ResearchNavigationLink source="semiconductor_map" destination="factory_projects" action="related_link" href={researchPages.factory_projects.href}><strong>{researchPages.factory_projects.label}</strong><span>主要5案件の場所と稼働時期を比較する</span></ResearchNavigationLink>
      <ResearchNavigationLink source="semiconductor_map" destination="industry_map" action="related_link" href={researchPages.industry_map.href}><strong>{researchPages.industry_map.label}</strong><span>工程と企業の役割、会社単位の事業と職種を調べる</span></ResearchNavigationLink>
      <TrackedInternalLink href="/career-compass" eventName="location_map_career_compass_click" eventProperties={{ source_page: "semiconductor_map", cta_location: "related_links" }}><strong>Career Compass</strong><span>経験と半導体職種の接点を整理する</span></TrackedInternalLink>
    </nav>
  </main>;
}
