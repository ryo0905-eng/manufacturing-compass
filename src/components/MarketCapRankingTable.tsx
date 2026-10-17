import { RankingCompareButton } from "@/components/RankingCompanyCompare";
import type { Route } from "next";
import { MetricBarChart } from "@/components/MetricBarChart";
import { RankingCompanyName } from "@/components/RankingCompanyName";
import { CompanyLogoAttribution } from "@/components/CompanyLogoAttribution";
import { CountryRegion } from "@/components/CountryRegion";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { toyotaMarketCapReference } from "@/data/semiconductor-market-cap-reference";
import { formatMarketCapUsdB, getMatchingMarketCapReference } from "@/lib/market-cap-reference";
import {
  japanSemiconductorMarketCapRanking,
  semiconductorMarketCapMeta,
  worldSemiconductorMarketCapRanking,
} from "@/data/semiconductor-market-cap";
import styles from "./MarketCapRankingTable.module.css";

type MarketCapRankingTableProps = {
  scope: "world" | "japan";
  sourceSlug?: string;
};

export function MarketCapRankingTable({ scope, sourceSlug }: MarketCapRankingTableProps) {
  const unified = sourceSlug === "semiconductor-market-cap-ranking";
  const isWorld = scope === "world";
  const companies = isWorld ? worldSemiconductorMarketCapRanking : japanSemiconductorMarketCapRanking;
  const title = isWorld ? "世界TOP30" : "日本企業TOP10";
  const [year, month, day] = semiconductorMarketCapMeta.dataAsOf.split("-");
  const formattedDate = `${year}年${Number(month)}月${Number(day)}日`;
  const reference = unified
    ? getMatchingMarketCapReference(toyotaMarketCapReference, semiconductorMarketCapMeta)
    : undefined;
  const referenceValue = reference ? formatMarketCapUsdB(reference.marketCapUsdB) : undefined;
  const chartTitle = isWorld ? "世界ランキング上位10社" : "日本企業ランキング上位10社";
  const maxValue = Math.max(...companies.map((company) => company.marketCapUsdB), reference?.marketCapUsdB ?? 1);
  const mobileLabel = (text: string) => unified ? <span className={styles.label} aria-hidden="true">{text}</span> : null;
  const metric = (value: number, display: string, isReference = false) => {
    const ratio = reference ? (value / reference.marketCapUsdB).toFixed(1) : undefined;
    return <>
      <strong>{display}</strong>
      <span className={styles.track} aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(100, value / maxValue * 100))}%` }} /></span>
      {reference ? <small className={styles.ratio}>{isReference ? "比較基準：1.0倍" : `${reference.comparisonLabel}の${ratio === "0.0" ? "0.1倍未満" : `約${ratio}倍`}`}</small> : null}
    </>;
  };

  return (
    <div className={`market-cap-ranking${unified ? ` ${styles.unified}` : ""}`} aria-label={`${title}の時価総額ランキング`}>
      <dl className="market-cap-meta">
        <div><dt>基準日</dt><dd>{formattedDate}</dd></div>
        <div><dt>対象</dt><dd>{semiconductorMarketCapMeta.definition}</dd></div>
        <div><dt>通貨</dt><dd>{semiconductorMarketCapMeta.currency}</dd></div>
        <div><dt>主要出典</dt><dd><a href={semiconductorMarketCapMeta.sourceUrl} rel="noopener noreferrer" target="_blank">{semiconductorMarketCapMeta.sourceName}</a></dd></div>
      </dl>
      <p className="market-cap-caution">時価総額は株価や為替レートによって変動します。本ランキングは上記基準日時点の参考値です。</p>
      {unified ? <>
        <p className={styles.note}>棒の長さは0ドルを基準に、{reference ? "参考のトヨタを含む" : ""}各一覧内の最大値との比率で表示しています。世界と日本の一覧では尺度が異なります。</p>
        {reference ? <p className={styles.note}>
          日本を代表する自動車メーカー、トヨタ自動車を規模の目安として掲載。比較しているのは企業全体の時価総額で、売上高や従業員数ではありません。
          参考値：{formattedDate}基準・{referenceValue}（米ドル）。確認日：{reference.checkedAt.replaceAll("-", ".")}。
          出典：<a href={reference.sourceUrl} rel="noopener noreferrer" target="_blank">{reference.sourceName}（トヨタ自動車）</a>。
        </p> : null}
      </> : <MetricBarChart
        eyebrow="Market cap overview"
        items={companies.slice(0, 10).map((company) => ({
          category: company.category,
          country: isWorld ? company.country : undefined,
          displayValue: company.marketCapDisplay,
          label: company.name,
          logoId: company.companySlug ?? company.id,
          value: company.marketCapUsdB,
        }))}
        note="棒の長さは0ドルを基準に、このグラフ内の最大値との比率で表示しています。株価と為替により変動します。"
        title={chartTitle}
      />}
      {!isWorld && reference ? <p className="market-cap-reference-history">
        <TrackedInternalLink
          href="/tools/ranking-time-machine#mode=global&year=2025&company=toyota"
          eventName="article_internal_click"
          eventProperties={{ source_slug: sourceSlug, destination_path: "/tools/ranking-time-machine#mode=global&year=2025&company=toyota" }}
        >トヨタと半導体企業の過去の変化を見る →</TrackedInternalLink>
        <small>移動先は2014〜2025年の年末データです。この記事の基準日とは異なります。</small>
      </p> : null}
      <div className="market-cap-table-wrap">
        <table className="market-cap-table" role={unified ? "table" : undefined} aria-label={`${title}の時価総額ランキング`}>
          <thead role={unified ? "rowgroup" : undefined}>
            <tr role={unified ? "row" : undefined}>
              <th scope="col">{isWorld ? "順位" : "国内"}</th>
              {!isWorld ? <th scope="col">世界</th> : null}
              <th scope="col">企業名</th>
              <th scope="col">ティッカー</th>
              <th scope="col">時価総額</th>
              {isWorld ? <th scope="col">国・地域</th> : null}
              <th scope="col">分類</th>
              <th scope="col">主な事業</th>
              {sourceSlug === "semiconductor-market-cap-ranking" && <th scope="col">2社を比較</th>}
            </tr>
          </thead>
          <tbody role={unified ? "rowgroup" : undefined}>
            {companies.map((company) => {
              const displayRank = isWorld
                ? company.rank
                : "domesticRank" in company && typeof company.domesticRank === "number"
                  ? company.domesticRank
                  : company.rank;
              return (
                <tr key={`${scope}-${company.rank}-${company.ticker}`} role={unified ? "row" : undefined}>
                  <td role={unified ? "cell" : undefined} className={`market-cap-rank${unified ? ` ${styles.rank}` : ""}`}>{displayRank}</td>
                  {!isWorld ? <td role={unified ? "cell" : undefined}>{mobileLabel("世界順位")}{company.rank}位</td> : null}
                  <th scope="row" role={unified ? "rowheader" : undefined} className={unified ? styles.company : undefined}>
                    <RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name}>
                      {company.companySlug ? (
                        <TrackedInternalLink
                          eventName="article_company_click"
                          eventProperties={{ company_id: company.companySlug, source_slug: sourceSlug }}
                          href={`/companies/${company.companySlug}` as Route}
                        >
                          {company.name}
                        </TrackedInternalLink>
                      ) : company.name}
                      {company.englishName !== company.name ? <small>{company.englishName}</small> : null}
                    </RankingCompanyName>
                  </th>
                  <td role={unified ? "cell" : undefined}>{mobileLabel("ティッカー")}{company.ticker}</td>
                  <td role={unified ? "cell" : undefined} className={`market-cap-value${unified ? ` ${styles.value}` : ""}`}>{mobileLabel("時価総額")}{unified ? metric(company.marketCapUsdB, company.marketCapDisplay) : company.marketCapDisplay}</td>
                  {isWorld ? <td role={unified ? "cell" : undefined}>{mobileLabel("国・地域")}<CountryRegion country={company.country} /></td> : null}
                  <td role={unified ? "cell" : undefined}>{mobileLabel("分類")}<span className="market-cap-category">{company.category}</span></td>
                  <td role={unified ? "cell" : undefined}>{mobileLabel("主な事業")}{company.mainBusiness}</td>
                  {unified && <td role="cell"><RankingCompareButton id={company.id} source={scope} /></td>}
                </tr>
              );
            })}
          </tbody>
          {reference ? <tfoot role="rowgroup"><tr role="row" className={styles.reference}>
            <td role="cell" className={styles.rank}>参考</td>
            {!isWorld ? <td role="cell">{mobileLabel("世界順位")}対象外</td> : null}
            <th role="rowheader" scope="row" className={styles.company}><RankingCompanyName companyId={reference.id} name={reference.name} /></th>
            <td role="cell">{mobileLabel("ティッカー")}—</td>
            <td role="cell" className={`market-cap-value ${styles.value}`}>{mobileLabel("時価総額")}{metric(reference.marketCapUsdB, formatMarketCapUsdB(reference.marketCapUsdB), true)}</td>
            {isWorld ? <td role="cell">{mobileLabel("国・地域")}<CountryRegion country="日本" /></td> : null}
            <td role="cell">{mobileLabel("分類")}業界外の比較対象</td>
            <td role="cell">{mobileLabel("主な事業")}自動車</td>
            <td role="cell">半導体ランキング対象外</td>
          </tr></tfoot> : null}
        </table>
      </div>
      <small>取得日：{semiconductorMarketCapMeta.retrievedAt.replaceAll("-", ".")}。総合企業の時価総額は、半導体部門だけではなく企業全体の数値です。</small>
      {isWorld && <small>国・地域は本社所在地を基準とし、工場や日本法人の所在地を示すものではありません。</small>}
      <CompanyLogoAttribution />
    </div>
  );
}
