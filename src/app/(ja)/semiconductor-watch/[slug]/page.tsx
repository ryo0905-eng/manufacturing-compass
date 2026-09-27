import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { ArticleView, MediaLink } from "@/components/chip-pulse/MediaLinks";
import { media, newsDate, newsFields, backgroundLinks, type NewsField } from "@/lib/chip-pulse-media";
import { pulseProcessLabels } from "@/data/chip-pulse";
import { siteUrl } from "@/lib/format";
import styles from "@/components/chip-pulse/Media.module.css";

export function generateStaticParams() { return media.articles.map(a=>({slug:a.id})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
 const {slug}=await params; const a=media.articles.find(a=>a.id===slug); if(!a)return {};
 return {title:a.title+"｜Chip Pulse",description:a.summary,alternates:{canonical:`/semiconductor-watch/${a.id}`},openGraph:{title:a.title,description:a.summary,type:"article",publishedTime:a.firstPublishedAt,modifiedTime:a.updatedAt}};
}
export default async function NewsDetail({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const a=media.articles.find(a=>a.id===slug); if(!a)notFound();
 return <main className={styles.page}><div className={styles.shell}>
  <header className={styles.masthead}><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse.</Link><Link href="/semiconductor-watch">ニュース一覧へ ←</Link></header>
  <article className={styles.article}>
   <ArticleView id={a.id} />
   <StructuredData data={{"@context":"https://schema.org","@type":"NewsArticle",headline:a.title,description:a.summary,datePublished:a.firstPublishedAt,dateModified:a.updatedAt,mainEntityOfPage:siteUrl+"/semiconductor-watch/"+a.id,author:{"@type":"Organization",name:"Manufacturing Compass",url:siteUrl},publisher:{"@type":"Organization",name:"Manufacturing Compass",url:siteUrl},citation:a.sourceUrl}} />
   <StructuredData data={{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Chip Pulse",item:siteUrl+"/semiconductor-watch"},{"@type":"ListItem",position:2,name:a.title,item:siteUrl+"/semiconductor-watch/"+a.id}]}} />
   <div className={styles.tags}>{a.fields.map(f=><span key={f}>{newsFields[f as NewsField]}</span>)}</div>
   <h1>{a.title}</h1><div className={styles.meta}>出典の公表：{newsDate(a.publishedAt,a.datePrecision==="instant")}{a.datePrecision==="day" ? "（時刻不明）":" JST"}（SEC開示）<br />掲載：{newsDate(a.firstPublishedAt,true)} JST · 内容更新：{newsDate(a.updatedAt,true)} JST</div>
   {a.sourceCheck==="changed" ? <aside className={styles.warning}>出典の変更を検出しました。以下は前回確認時の要約です。最新の内容は原文をご確認ください。</aside> : null}
   <h2>何が発表されたか</h2><p>{a.summary}</p><ul>{a.facts.map((fact,i)=><li key={i}>{fact}</li>)}</ul>
   {a.processes.length ? <><h2>関係する工程</h2><p>{a.processes.map(p=>pulseProcessLabels[p]).join(" / ")}</p></>:null}
   {a.unknowns.length ? <><h2>この発表だけでは分からないこと</h2><ul>{a.unknowns.map((u,i)=><li key={i}>{u}</li>)}</ul></>:null}
   <h2>背景を理解する</h2><p>以下は工程・業界構造の一般的な解説です。今回の発表による効果を断定するものではありません。</p>
   {a.fields.map(f=>backgroundLinks[f as NewsField]).filter(Boolean).map(b=><p key={b.href}><MediaLink href={b.href} articleId={a.id} action="background">{b.title} →</MediaLink></p>)}
   <h2>出典と確認方法</h2><p><MediaLink href={a.sourceUrl} articleId={a.id} action="source">{a.sourceName}の原文を読む ↗</MediaLink></p><p>{a.validation==="editor-verified" ? "原文を編集時に照合した記事です。" : "AIによる事実要約です。数値・根拠箇所・表現を自動照合しています。"} 原文の予測・計画と実績を区別してお読みください。</p>
   {a.evidence.map((e,i)=><div key={i}><span className={styles.meta}>{e.locator}</span><blockquote>{e.quote}</blockquote></div>)}
   {a.relatedIds.length ? <><h2>関連する発表</h2>{a.relatedIds.map(id=>media.articles.find(a=>a.id===id)).filter(a=>!!a).map(r=><p key={r.id}><Link href={`/semiconductor-watch/${r.id}`}>{r.title}</Link></p>)}</>:null}
   {a.history.length ? <details><summary>更新履歴（第{a.version}版）</summary>{a.history.map(h=><p key={h.version}>第{h.version}版 · {newsDate(h.updatedAt,true)}：{h.title}</p>)}</details>:null}
  </article>
 </div></main>;
}
