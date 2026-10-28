import type { Route } from "next";
import { RankingCompanyName } from "@/components/RankingCompanyName";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { japanSemiconductorMarketCapRanking, semiconductorMarketCapMeta, worldSemiconductorMarketCapRanking } from "@/data/semiconductor-market-cap";
import { isStockMarketAvailable } from "@/lib/stock-market-release";
import styles from "./MarketCapRankingOverview.module.css";

export function MarketCapRankingOverview() {
  const world = [...worldSemiconductorMarketCapRanking].sort((a, b) => b.marketCapUsdB - a.marketCapUsdB)[0];
  const japan = [...japanSemiconductorMarketCapRanking].sort((a, b) => b.marketCapUsdB - a.marketCapUsdB)[0];
  if (!world || !japan) return null;
  const ratio = japan.marketCapUsdB > 0 ? world.marketCapUsdB / japan.marketCapUsdB : null;
  const companyCard = (company: typeof world, scope: "world" | "japan", label: string) => (
    <TrackedInternalLink className={styles.card} href={`#${scope}-company-${company.id}` as Route} eventName="article_internal_click" eventProperties={{ source_slug: "semiconductor-market-cap-ranking", destination_path: `#${scope}-company-${company.id}` }}>
      <span className={styles.label}>{label}</span>
      <RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name} />
      <strong>{company.marketCapDisplay}</strong>
      <small>{company.category}<span aria-hidden="true"> · </span>ランキングへ →</small>
    </TrackedInternalLink>
  );
  return <aside className={styles.overview} aria-label="ランキングの要点">
    <div className={styles.cards}>
      {companyCard(world, "world", "世界1位")}
      {companyCard(japan, "japan", "日本企業1位")}
      <div className={`${styles.card} ${styles.insight}`}>
        <span className={styles.label}>世界1位と日本1位の規模差</span>
        <strong>{ratio === null ? "算出できません" : `約${ratio.toLocaleString("ja-JP", { maximumFractionDigits: 1 })}倍`}</strong>
        <small>{world.name} ÷ {japan.name}<br />企業全体の時価総額を比較</small>
      </div>
    </div>
    <p className={styles.note}><time dateTime={semiconductorMarketCapMeta.dataAsOf}>{semiconductorMarketCapMeta.dataAsOf.replaceAll("-", ".")}</time>基準・米ドル。株価や為替で変動します。<a href="#sources-method">出典・調査方法</a></p>
  </aside>;
}

export function MarketCapRankingExplore() {
  const links = [
    { href: "/industry-map", title: "つくる会社と、装置の会社はどう違う？", label: "業界地図で役割を見る" },
    { href: "/semiconductor-watch/earnings", title: "時価総額が大きい会社は、売上も大きい？", label: "掲載決算で売上・利益を見る" },
    ...(isStockMarketAvailable() ? [{ href: "/semiconductor-watch/stocks", title: "株価は今、どう動いている？", label: "株式市場ウォッチを見る" }] : []),
  ];
  return <nav className={styles.explore} aria-label="ランキングから企業理解を深める">
    {links.map(link => <TrackedInternalLink key={link.href} href={link.href as Route} eventName="article_internal_click" eventProperties={{ source_slug: "semiconductor-market-cap-ranking", destination_path: link.href }}>
      <span>{link.title}</span><strong>{link.label} →</strong>
    </TrackedInternalLink>)}
  </nav>;
}
