import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { WatchNavigation } from "@/components/chip-pulse/WatchNavigation";
import { StockExplorer } from "@/components/stocks/StockExplorer";
import { MiniChart } from "@/components/stocks/StockWidgets";
import { companies } from "@/data/companies";
import { stockIndices, stockMarketMeta } from "@/data/stock-market";
import { earningsReleases } from "@/lib/earnings";
import { siteUrl } from "@/lib/format";
import { buildStockProfiles, stockHref } from "@/lib/stock-market";
import { isStockMarketAvailable, isStockMarketIndexable } from "@/lib/stock-market-release";
import { buildWatchNews } from "@/lib/watch";
import styles from "@/components/stocks/Stocks.module.css";

const title = "半導体株式市場ウォッチ｜株価・期間別比較と企業研究";
const description = "NVIDIA・AMD・TSMCなど半導体関連企業の株価と期間別パフォーマンスから、掲載決算・企業情報・関連記事へ。主要指数の見方や日本株の外部確認先も整理します。";
export const metadata: Metadata = {
  title, description, alternates: { canonical: stockMarketMeta.route },
  robots: isStockMarketIndexable() ? undefined : { index: false, follow: true },
  openGraph: { title, description, url: stockMarketMeta.route, type: "website" },
};
export const revalidate = 3600;

export default function StockMarketPage() {
  if (!isStockMarketAvailable()) notFound();
  const profiles = buildStockProfiles(companies, earningsReleases, buildWatchNews(), new Date().toISOString());
  return <main className={styles.page}><div className={styles.shell}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: `${siteUrl}${stockMarketMeta.route}`, dateModified: stockMarketMeta.updatedAt }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "業界ウォッチ", item: `${siteUrl}/semiconductor-watch` },
      { "@type": "ListItem", position: 2, name: "株式市場", item: `${siteUrl}${stockMarketMeta.route}` },
    ] }} />
    <WatchNavigation current="stocks" />
    {!isStockMarketIndexable() ? <p className={styles.preview}>確認用プレビューです。無料埋め込みの利用条件と個別銘柄の実表示を確認するまで、本番公開・検索登録は無効です。</p> : null}
    <header className={styles.hero}><p className={styles.eyebrow}>SEMICONDUCTOR / STOCK MARKET</p><h1>半導体株式市場ウォッチ</h1><p>市場の動きを見渡し、気になる企業の決算・事業・ニュースを読み直す。</p><p className={styles.fine}>株価はTradingView提供の外部表示です。遅延・休場・提供範囲によって表示できない場合があります。株価の動きだけで採用状況や企業の将来性は判断できません。</p><p className={styles.fine}>説明・掲載対象の更新 {stockMarketMeta.updatedAt.replaceAll("-", "/")} · 価格時点は各ウィジェットで確認</p></header>
    <section aria-labelledby="stock-indices-title"><div className={styles.sectionHead}><h2 id="stock-indices-title">主要指数で市場の広がりを見る</h2></div>
      <div className={styles.indices}>{stockIndices.map(index => <article className={styles.index} key={index.id}><h3>{index.name}</h3><p>{index.description}</p>
        {index.embedding === "verified" ? <MiniChart symbol={index.symbol} /> : <p className={styles.externalIndex}>指数の現在値・推移は外部で確認できます。</p>}
        <a href={index.sourceUrl} target="_blank" rel="noopener noreferrer">{index.name}を確認 ↗</a>
      </article>)}</div>
      <p className={styles.fine}>指数そのものの埋め込み可否を確認できたものだけチャートを表示します。ETF・先物・CFDへの置き換えはしていません。</p>
    </section>
    <StockExplorer profiles={profiles} />
    <section className={styles.section} aria-labelledby="stock-directory-title"><h2 id="stock-directory-title">掲載企業と上場市場</h2><p className={styles.fine}>比較表は米国上場分です。東京エレクトロンとAdvantestの日本株は外部リンクから確認できます。</p>
      <ul className={styles.directory}>{profiles.map(profile => <li key={profile.companyId}><Link href={stockHref(profile.companyId)}>{profile.name}の株価・関連情報 →</Link><span>{profile.exchange} · {profile.ticker} · {profile.currency} · {profile.listing}</span><Link href={profile.companyHref}>企業情報</Link>{" / "}<a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">外部チャート ↗</a></li>)}</ul>
    </section>
    <section className={styles.sources} aria-labelledby="stock-sources-title"><h2 id="stock-sources-title">表示の見方と出典</h2><ul>
      <li>株価は市場による評価の一面です。企業の業績、事業範囲、採用情報は別に確認してください。売買の推奨を目的とした情報ではありません。</li>
      <li>異なる取引所の価格や変化率は、同時刻・同一条件の比較ではありません。ADRや米国上場株と、本国の上場株も区別しています。</li>
      <li>価格は外部ウィジェット内だけに表示し、当サイトでは収集・保存・再配信・独自集計していません。</li>
      <li><a href={stockMarketMeta.sources.data} target="_blank" rel="noopener noreferrer">TradingViewのデータ提供範囲・遅延について ↗</a></li>
      <li><a href={stockMarketMeta.sources.performance} target="_blank" rel="noopener noreferrer">期間別パフォーマンスの公式機能説明 ↗</a></li>
    </ul><p className={styles.fine}><Link href="/semiconductor-watch/earnings">主要企業の決算を読む →</Link>{" · "}<Link href="/industry-map">業界地図で役割を見る →</Link></p></section>
  </div></main>;
}
