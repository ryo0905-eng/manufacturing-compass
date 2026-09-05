import type { Metadata } from "next";
import Link from "next/link";
import { SemiconductorLocationExplorer } from "@/components/SemiconductorLocationExplorer";
import { StructuredData } from "@/components/StructuredData";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "@/components/semiconductor-location-map.module.css";
import { companies } from "@/data/companies";
import { locationSources } from "@/data/company-locations";
import {
  filterCompanyLocations,
  getHiringSignals,
  getPublicCompanyLocations,
  validateCompanyLocationData,
} from "@/lib/company-locations";
import { siteUrl } from "@/lib/format";
import type { JobFamily, LocationType } from "@/types/company-location";

const pageTitle = "日本の半導体企業・工場マップ【2026年版】製造・研究拠点一覧";
const pageDescription = "日本で働ける半導体メーカー、製造装置、材料、設計企業の工場・研究開発・設計拠点を、都道府県、役割、関連職種、公式採用情報とともに整理します。";

const companyById = new Map(companies.map((company) => [company.id, company]));

const allowedLocationTypes = new Set<LocationType>([
  "headquarters", "office", "factory", "research-development", "design-center", "field-service", "logistics",
]);
const allowedJobFamilies = new Set<JobFamily>([
  "process-production", "equipment-facility", "quality-reliability", "equipment-development",
  "circuit-software-design", "field-application-service", "supply-chain-corporate",
]);

type SemiconductorMapSearchParams = {
  [key: string]: string | string[] | undefined;
  prefecture?: string | string[];
  type?: string | string[];
  job?: string | string[];
  view?: string | string[];
};

type SemiconductorMapPageProps = {
  searchParams: Promise<SemiconductorMapSearchParams>;
};

export async function generateMetadata({ searchParams }: SemiconductorMapPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasParameters = Object.values(params).some((value) => value !== undefined);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: "/semiconductor-map" },
    robots: { index: !hasParameters, follow: true },
    openGraph: {
      title: pageTitle,
      description: "日本国内の半導体関連拠点を、勤務地と仕事の接点から探すための全国マップ・一覧です。",
      type: "website",
      url: "/semiconductor-map",
    },
  };
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SemiconductorMapPage({ searchParams }: SemiconductorMapPageProps) {
  const validationErrors = validateCompanyLocationData();
  if (validationErrors.length > 0) {
    throw new Error(`半導体拠点データの整合性エラー: ${validationErrors.join(" / ")}`);
  }

  const locations = [...getPublicCompanyLocations()].sort((a, b) =>
    a.prefectureCode.localeCompare(b.prefectureCode, "ja") || a.name.localeCompare(b.name, "ja"),
  );
  const companyCount = new Set(locations.map((location) => location.companyId)).size;
  const prefectureCount = new Set(locations.map((location) => location.prefectureCode)).size;
  const factoryCount = locations.filter((location) => location.locationTypes.includes("factory")).length;
  const researchCount = locations.filter((location) =>
    location.locationTypes.some((type) => type === "research-development" || type === "design-center"),
  ).length;
  const params = await searchParams;
  const prefectureParam = firstValue(params.prefecture);
  const locationTypeParam = firstValue(params.type) as LocationType | undefined;
  const jobFamilyParam = firstValue(params.job) as JobFamily | undefined;
  const initialView = firstValue(params.view) === "regions" ? "regions" as const : "list" as const;
  const validPrefectureCodes = new Set(locations.map((location) => location.prefectureCode));
  const initialFilters = {
    prefectureCode: prefectureParam && validPrefectureCodes.has(prefectureParam) ? prefectureParam : undefined,
    locationType: locationTypeParam && allowedLocationTypes.has(locationTypeParam) ? locationTypeParam : undefined,
    jobFamily: jobFamilyParam && allowedJobFamilies.has(jobFamilyParam) ? jobFamilyParam : undefined,
  };
  const initiallyVisibleLocations = filterCompanyLocations(initialFilters);
  const locationCompanies = companies
    .filter((company) => locations.some((location) => location.companyId === company.id))
    .map(({ id, name, nameJa, slug }) => ({ id, name, nameJa, slug }));

  return (
    <main className={`page ${styles.page}`}>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "日本の半導体企業・工場マップ", item: `${siteUrl}/semiconductor-map` },
        ],
      }} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "日本の半導体企業・工場マップ・研究拠点一覧",
        numberOfItems: initiallyVisibleLocations.length,
        itemListElement: initiallyVisibleLocations.map((location, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${companyById.get(location.companyId)?.nameJa ?? location.companyId} ${location.name}`,
          url: `${siteUrl}/semiconductor-map#${location.id}`,
        })),
      }} />

      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><span>日本の半導体企業・工場マップ</span>
      </nav>

      <header className={styles.hero}>
        <div>
          <p className="section-label">SEMICONDUCTOR LOCATIONS IN JAPAN</p>
          <h1>日本の半導体企業・工場・研究拠点マップ</h1>
          <p className={styles.lead}>
            日本のどこに、どのような半導体関連の仕事につながる拠点があるか。
            企業公式情報をもとに、工場、研究開発、設計、本社・事業所を勤務地単位で整理しています。
          </p>
        </div>
        <dl className={styles.summary} aria-label="掲載範囲">
          <div><dt>掲載企業</dt><dd>{companyCount}社</dd></div>
          <div><dt>国内拠点</dt><dd>{locations.length}拠点</dd></div>
          <div><dt>都道府県</dt><dd>{prefectureCount}</dd></div>
          <div><dt>最終確認</dt><dd>2026.09.03</dd></div>
        </dl>
      </header>

      <section className={styles.scope} aria-labelledby="location-map-scope-title">
        <div>
          <p className="section-label">このページで分かること</p>
          <h2 id="location-map-scope-title">会社名ではなく、働く場所から企業を探す</h2>
          <p>
            同じ企業でも、工場、研究所、設計拠点、本社では役割や職種が異なります。
            拠点固有の内容を公式情報で確認できない場合は、会社全体の職種を推測で割り当てていません。
          </p>
        </div>
        <ul>
          <li><strong>{factoryCount}</strong><span>工場を含む拠点</span></li>
          <li><strong>{researchCount}</strong><span>研究・設計を含む拠点</span></li>
        </ul>
      </section>

      <aside className={styles.notice}>
        <strong>掲載情報の読み方</strong>
        <p>
          これは求人サイトではありません。拠点の存在・役割と、現在の採用状況は別に確認しています。
          採用表示には確認日があり、期限を過ぎた情報は「再確認中」になります。正確な施設ピンはまだ表示していません。
        </p>
      </aside>

      <SemiconductorLocationExplorer
        companies={locationCompanies}
        hiringSignals={getHiringSignals()}
        initialFilters={initialFilters}
        initialView={initialView}
        locations={locations}
        sources={locationSources}
      />

      <section className={styles.methodology} aria-labelledby="location-methodology-title">
        <div>
          <p className="section-label">掲載基準</p>
          <h2 id="location-methodology-title">公式情報で確認できた内容だけを掲載</h2>
        </div>
        <ul>
          <li>正式な拠点名、所在地、運営法人を確認できる</li>
          <li>半導体との関係と拠点種別を確認できる</li>
          <li>稼働中、建設中、計画中を区別する</li>
          <li>職種は拠点との根拠がある場合だけ表示する</li>
          <li>出典URL、確認日、次回確認日をデータとして保持する</li>
        </ul>
      </section>

      <nav className={styles.nextLinks} aria-label="次に確認するページ">
        <Link href="/industry-map"><strong>半導体業界地図</strong><span>工程と企業の役割を理解する</span></Link>
        <Link href="/companies"><strong>半導体企業一覧</strong><span>会社単位で事業と職種を比較する</span></Link>
        <TrackedInternalLink
          eventName="location_map_career_compass_click"
          eventProperties={{ source_page: "semiconductor_map", cta_location: "related_links" }}
          href="/career-compass"
        ><strong>Career Compass</strong><span>経験と半導体職種の接点を整理する</span></TrackedInternalLink>
      </nav>
    </main>
  );
}
