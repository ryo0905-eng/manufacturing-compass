import type { Metadata, Route } from "next";
import Link from "next/link";
import { JapanWorkExplorer } from "@/components/JapanWorkExplorer";
import { StructuredData } from "@/components/StructuredData";
import styles from "@/components/japan-work.module.css";
import { companies } from "@/data/companies";
import { companyLocations } from "@/data/company-locations";
import { japanWorkCategories, japanWorkCompanies, japanWorkEvidence, japanWorkRoute, japanWorkSources, japanWorkUpdatedAt } from "@/data/japan-work";
import { isJapanWorkReviewExpired, validateJapanWorkEvidence } from "@/lib/japan-work";
import { siteUrl } from "@/lib/format";
import type { JapanWorkCompanyView } from "@/types/japan-work";

export const revalidate = 86400;
const title = "外資系半導体企業の日本の仕事を探す";
const description = "外資系半導体企業の日本拠点・仕事内容を探索。KLA、ラムリサーチ、インフィニオンなどの国内業務を、6つの仕事と勤務地から調べ、2社を比較できます。公式出典と確認日付き。";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: japanWorkRoute },
  robots: { index: true, follow: true },
  openGraph: { title, description, url: japanWorkRoute, type: "website" },
};

function sourceLinks(ids: string[], companyId: string) {
  return <ul>{[...new Set(ids)].map((id) => {
    const source = japanWorkSources.find((item) => item.id === id)!;
    return <li key={id}><a href={source.url} target="_blank" rel="noreferrer" data-japan-work-link="source" data-company={companyId}>{source.title} ↗</a><small className={styles.meta}> — {source.publisher} / 確認 {source.accessedAt}</small></li>;
  })}</ul>;
}

function CompanyWorkDetails({ company, asOf }: { company: JapanWorkCompanyView; asOf: string }) {
  const locations = companyLocations.filter((location) => location.companyId === company.companyId && location.contentStatus === "complete");
  return <div className={styles.details}>
    <h4>世界では何をしている会社？</h4><p>{company.summary}</p>
    <h4>日本で確認できたこと</h4><p>{company.presence}</p>{sourceLinks(company.presenceSourceIds, company.companyId)}
    <h4>日本での仕事内容</h4>
    {company.works.map((work) => <section className={styles.work} key={work.id}>
      <p className={styles.meta}>{work.titleKind === "role" ? "公式の職種名" : "公式の業務表記（職種名・募集情報ではありません）"}</p>
      <h5>{work.officialTitle}</h5>
      <div className={styles.tags}>{work.categories.map((id) => <span key={id}>{japanWorkCategories.find((category) => category.id === id)?.label}</span>)}</div>
      <p>{work.summary}</p>
      <p><strong>勤務地・働く場所</strong><br />{work.workplace}</p>
      <p><strong>まだ確認が必要なこと</strong><br />{work.unknowns}</p>
      {sourceLinks(work.sourceIds, company.companyId)}
      <p className={styles.meta}>確認日：{work.checkedAt} / 次回確認目安：{work.nextReviewAt}</p>
      {isJapanWorkReviewExpired(work, asOf) ? <p className={styles.expired}>再確認時期を過ぎています。前回確認時の情報として掲載しています。</p> : null}
    </section>)}
    {locations.length ? <><h4>所在地を確認できた国内拠点</h4><p className={styles.meta}>拠点の所在地と、上記の職種の配属先は同一とは限りません。</p><ul>{locations.map((location) => <li key={location.id}><Link href={`/semiconductor-map?prefecture=${location.prefectureCode}#${location.id}` as Route} data-japan-work-link="related" data-company={company.companyId} data-destination="location_map">{location.name}（{location.prefectureName}）</Link></li>)}</ul></> : null}
    <p className={styles.note}>このページは確認できた業務の紹介です。現在募集中かどうか、応募条件、勤務形態は公式採用情報で確認してください。</p>
    <div className={styles.links}><a href={company.careerUrl} target="_blank" rel="noreferrer" data-japan-work-link="career" data-company={company.companyId}>公式採用情報を見る ↗</a><Link href={`/companies/${company.slug}` as Route} data-japan-work-link="related" data-company={company.companyId} data-destination="company">企業詳細を見る</Link></div>
  </div>;
}

export default function GlobalJapanCompaniesPage() {
  const errors = validateJapanWorkEvidence(japanWorkEvidence, companies.map((company) => company.id), japanWorkSources.map((source) => source.id), companyLocations, japanWorkCategories.map((category) => category.id));
  if (errors.length) throw new Error(errors.join("\n"));
  const views: JapanWorkCompanyView[] = japanWorkCompanies.map((profile) => {
    const company = companies.find((item) => item.id === profile.companyId);
    if (!company) throw new Error(`Unknown Japan work company: ${profile.companyId}`);
    return { ...profile, name: company.nameJa, slug: company.slug, works: japanWorkEvidence.filter((work) => work.companyId === company.id && work.status === "published") };
  });
  const published = views.filter((company) => company.status === "published" && company.works.length);
  const pending = views.filter((company) => company.status === "pending");
  const asOf = new Date().toISOString().slice(0, 10);
  const panels = Object.fromEntries(published.map((company) => [company.companyId, <CompanyWorkDetails key={company.companyId} company={company} asOf={asOf} />]));

  return <main className={`page ${styles.page}`}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${siteUrl}${japanWorkRoute}`, dateModified: japanWorkUpdatedAt, inLanguage: "ja" }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "企業一覧", item: `${siteUrl}/companies` },
      { "@type": "ListItem", position: 3, name: title, item: `${siteUrl}${japanWorkRoute}` },
    ] }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "ItemList", name: title, numberOfItems: published.length, itemListElement: published.map((company, index) => ({ "@type": "ListItem", position: index + 1, name: company.name, url: `${siteUrl}${japanWorkRoute}#evidence-${company.companyId}` })) }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/companies">企業一覧</Link><span>/</span><span>外資系企業の日本の仕事</span></nav>
    <header className={styles.hero}>
      <p className="section-label">GLOBAL COMPANIES, WORK IN JAPAN</p>
      <h1>{title}</h1>
      <p className={styles.lead}>知っている会社の、その先へ。<br />日本での仕事内容から半導体企業を見つける。</p>
      <p>海外の会社でも、日本で担う仕事はさまざまです。装置を支える、製品を開発する、顧客の設計を助ける。公式情報で確認できた接点を、会社と仕事の両方からたどれます。</p>
      <p>{published.length}社・{published.reduce((count, company) => count + company.works.length, 0)}件の業務情報 / 更新 {japanWorkUpdatedAt}</p>
    </header>
    <noscript><p>下の「企業ごとの仕事内容と根拠」から全社の情報を読めます。絞り込みと比較にはJavaScriptが必要です。</p></noscript>
    <JapanWorkExplorer companies={views} panels={panels} asOf={asOf}>
      {pending.length ? <section className={styles.pending}><h2>調査対象・掲載準備中</h2>{pending.map((company) => <div key={company.companyId}><h3>{company.name}</h3><p>{company.pendingReason}</p><Link href={`/companies/${company.slug}` as Route} data-japan-work-link="related" data-company={company.companyId} data-destination="company">企業概要を見る</Link></div>)}</section> : null}
      <section className={styles.next}><h2>見つけた仕事と、自分の経験をつなぐ</h2><p>企業の役割が見えてきたら、担当してきた仕事を整理してみましょう。個人情報の入力・保存は不要です。</p><div className={styles.links}>
        <Link href="/roles" data-japan-work-link="related" data-destination="roles">仕事内容から半導体職種を探す →</Link>
        <Link href="/career-compass" data-japan-work-link="related" data-destination="career_compass">Career Compassで次の準備を整理する →</Link>
        <Link href="/industry-map" data-japan-work-link="related" data-destination="industry_map">業界全体のつながりを見る →</Link>
      </div></section>
    </JapanWorkExplorer>
  </main>;
}
