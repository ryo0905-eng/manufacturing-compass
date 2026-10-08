import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { ArticleView, MediaLink } from "@/components/chip-pulse/MediaLinks";
import { WatchVisual } from "@/components/chip-pulse/WatchCard";
import { media, newsDate, backgroundLinks, type NewsField } from "@/lib/chip-pulse-media";
import { articleProcessVisual, articleWatchItem, getArticleEditorial, getArticleCompanies, isWatchMapTarget, watchEditorial } from "@/lib/watch";
import { watchTopics, type WatchLink } from "@/lib/watch-types";
import { siteUrl } from "@/lib/format";
import styles from "@/components/chip-pulse/Media.module.css";

export function generateStaticParams() { return media.articles.map(a => ({ slug: a.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const a = media.articles.find(a => a.id === slug); if (!a) return {};
  const modified = articleWatchItem(a).updatedAt;
  return { title: a.title + "｜Chip Pulse", description: a.summary, alternates: { canonical: `/semiconductor-watch/${a.id}` }, openGraph: { title: a.title, description: a.summary, type: "article", publishedTime: a.firstPublishedAt, modifiedTime: modified } };
}
export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const a = media.articles.find(a => a.id === slug); if (!a) notFound();
  const entry = getArticleEditorial(a), item = articleWatchItem(a);
  const relatedCompanies = getArticleCompanies(a);
  const terms = (entry?.termIds ?? []).flatMap(id => watchEditorial.terms[id] ? [{ id, ...watchEditorial.terms[id] }] : []);
  const fallback: WatchLink[] = a.fields.flatMap(f => backgroundLinks[f as NewsField] ? [{ href: backgroundLinks[f as NewsField].href, label: backgroundLinks[f as NewsField].title, destination: "guide" as const }] : []);
  const links = (entry?.links ?? fallback).filter(link => isWatchMapTarget(link.href)).slice(0,3);
  const staleEditorial = Boolean(watchEditorial.articles[a.id] && !entry);
  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.masthead}><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse<span> / 業界ウォッチ</span></Link><Link href="/semiconductor-watch">一覧へ戻る ←</Link></header>
    <article className={styles.article}>
      <ArticleView id={a.id} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "NewsArticle", headline: a.title, description: a.summary, datePublished: a.firstPublishedAt, dateModified: item.updatedAt, mainEntityOfPage: `${siteUrl}/semiconductor-watch/${a.id}`, author: { "@type": "Organization", name: "Manufacturing Compass", url: siteUrl }, publisher: { "@type": "Organization", name: "Manufacturing Compass", url: siteUrl }, citation: a.sourceUrl }} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "業界ウォッチ", item: `${siteUrl}/semiconductor-watch` }, { "@type": "ListItem", position: 2, name: a.title, item: `${siteUrl}/semiconductor-watch/${a.id}` }] }} />
      <header className={styles.articleHeader}><div className={styles.tags}>{item.topics.map(id => <Link href={`/semiconductor-watch#theme=${id}`} key={id}>{watchTopics.find(t => t.id === id)?.label}</Link>)}</div><h1>{a.title}</h1><p className={styles.standfirst}>{a.summary}</p><span className={styles.status}>{item.status}</span><p className={styles.meta}>{a.sourceName.includes("SEC") ? "SEC上の公表" : "出典の公表"}：{newsDate(a.publishedAt, a.datePrecision === "instant")}{a.datePrecision === "day" ? "（時刻不明）" : " JST"}<br />掲載：{newsDate(a.firstPublishedAt, true)} JST · 記事更新：{newsDate(a.updatedAt, true)} JST{entry ? <><br />背景・関連先の確認：{newsDate(entry.checkedAt,true)} JST</> : null}</p></header>
      {a.sourceCheck === "changed" ? <aside className={styles.warning}>出典の変更を検出しました。以下は前回確認時の要約です。最新の内容は原文をご確認ください。</aside> : null}
      <div className={styles.articleGrid}>
        <section className={styles.facts} aria-labelledby="facts-title"><h2 id="facts-title">何が起きたか</h2><ul>{[...new Set(a.facts.filter(fact => fact.trim() !== a.summary.trim()))].slice(0,2).map((fact,i) => <li key={i}>{fact}</li>)}</ul>{a.facts.length > 2 ? <details className={styles.disclosure}><summary>追加の事実・数値を見る</summary><ul>{a.facts.slice(2).map((fact,i) => <li key={i}>{fact}</li>)}</ul></details> : null}</section>
        <aside className={styles.companyAside}><h2>関係する企業</h2>{relatedCompanies.map(c => <div key={c.id}><MediaLink href={`/companies/${c.slug}`} articleId={a.id} action="background" destination="company">{c.nameJa} →</MediaLink><p>{c.businessModel}</p></div>)}{a.companyNames.filter(() => !relatedCompanies.length).map(name => <p key={name}>{name}</p>)}<small>企業の一般的な役割と、今回の発表の影響は区別します。</small></aside>
        <section className={styles.context} aria-labelledby="context-title"><h2 id="context-title">なぜ注目するか</h2>{entry ? <><span className={styles.editorLabel}>背景・編集上の見方</span><p>{entry.reason}</p></> : <p>{staleEditorial ? "出典・記事の変更に合わせて背景を再確認しています。" : "工程や業界の背景は、下の関連解説から確認できます。"}</p>}{entry?.readingPoints ? <><h3>この発表を比較・時系列から読む（編集上の提案）</h3>{entry.readingPoints.map(point => <div key={point.label}><h4>{point.label}</h4><p>{point.body}</p></div>)}<p className={styles.fine}>読み方の編集更新：{entry.readingUpdatedAt}。既存の確認済み要約に基づく整理です。原文をこの日に再確認したという意味ではありません。</p></> : null}<h2>業界のどこに関係するか</h2>{a.visual && a.sourceCheck !== "changed" ? <WatchVisual visual={a.visual} /> : null}<WatchVisual visual={articleProcessVisual(a)} /></section>
        {terms.length ? <aside className={styles.termsAside}><h2>気になる言葉</h2>{terms.map(term => <details key={term.id} className={styles.term}><summary>{term.label}</summary><p>{term.text}</p>{term.href !== `/semiconductor-watch/${a.id}` ? <MediaLink href={term.href} articleId={a.id} action="background" destination={term.href.startsWith("/semiconductor-watch/earnings") ? "earnings" : term.href.startsWith("/segments/") ? "industry_map" : "guide"}>背景を読む →</MediaLink> : null}</details>)}</aside> : null}
        <section className={styles.nextCheck}><h2>次に確認したいこと</h2><p className={styles.fine}>以下は、この発表だけでは確認できない点です。今後の成果を予測するものではありません。</p><ul>{a.unknowns.map((text,i) => <li key={i}>{text}</li>)}</ul></section>
        <section className={styles.nextLinks}><h2>ここから、理解をつなげる</h2>{links.map(link => <MediaLink key={link.href} href={link.href} articleId={a.id} action="background" destination={link.destination}>{link.label} <span aria-hidden="true">→</span></MediaLink>)}</section>
        <section className={styles.sources}><h2>出典と確認方法</h2><p><MediaLink href={a.sourceUrl} articleId={a.id} action="source">{entry?.sourceTitle ?? a.sourceName}の原文を読む ↗</MediaLink></p><p>{a.validation === "editor-verified" ? `編集時の確認記録では原文と数値・期間・計画／実績を照合しています（要約更新：${newsDate(a.updatedAt, true)} JST）。${a.sourceCheck === "changed" ? "出典変更後の再照合は未完了です。" : ""}` : "AIによる事実要約です。数値・根拠箇所・表現を自動照合しています。"}</p><details className={styles.disclosure}><summary>根拠箇所と短い原文抜粋</summary>{a.evidence.map((e,i) => <div key={i}><p className={styles.fine}>{e.locator}</p><blockquote>{e.quote}</blockquote></div>)}</details>
          {a.relatedIds.length ? <><h3>関連する発表</h3>{a.relatedIds.flatMap(id => media.articles.find(article => article.id === id) ?? []).map(r => <p key={r.id}><MediaLink href={`/semiconductor-watch/${r.id}`} articleId={a.id} action="article">{r.title} →</MediaLink></p>)}</> : null}
          {a.history.length ? <details className={styles.disclosure}><summary>更新履歴（第{a.version}版）</summary>{a.history.map(h => <p key={h.version}>第{h.version}版 · {newsDate(h.updatedAt,true)}：{h.title}</p>)}</details> : null}
        </section>
      </div>
    </article>
  </div></main>;
}
