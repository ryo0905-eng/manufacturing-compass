import { RankingCompareButton } from "@/components/RankingCompanyCompare";
import type { Route } from "next";
import { Fragment } from "react";
import { MetricBarChart } from "@/components/MetricBarChart";
import { MarketCapRankingChart } from "@/components/MarketCapRankingChart";
import { MarketCapRankingExplore } from "@/components/MarketCapRankingOverview";
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
  const title = isWorld ? "世界TOP30" : `日本${companies.length}社`;
  const [year, month, day] = semiconductorMarketCapMeta.dataAsOf.split("-");
  const formattedDate = `${year}年${Number(month)}月${Number(day)}日`;
  const reference = unified
    ? getMatchingMarketCapReference(toyotaMarketCapReference, semiconductorMarketCapMeta)
    : undefined;
  const referenceValue = reference ? formatMarketCapUsdB(reference.marketCapUsdB) : undefined;
  const chartTitle = isWorld ? "世界ランキング上位10社" : "日本企業ランキング上位10社";
  const firstSmallerCompany = reference ? companies.findIndex((company) => company.marketCapUsdB < reference.marketCapUsdB) : -1;
  const referencePosition = firstSmallerCompany < 0 ? companies.length : firstSmallerCompany;
  const worldIds = new Set(worldSemiconductorMarketCapRanking.map(company => company.id));
  const combined = [...worldSemiconductorMarketCapRanking, ...japanSemiconductorMarketCapRanking.filter(company => !worldIds.has(company.id))]
    .sort((a, b) => b.marketCapUsdB - a.marketCapUsdB || a.rank - b.rank);
  const chartItem = (company: (typeof worldSemiconductorMarketCapRanking)[number], targetScope: "world" | "japan", rank: number) => ({
    category: company.category, displayValue: company.marketCapDisplay, label: company.name,
    logoId: company.companySlug ?? company.id, value: company.marketCapUsdB, rank,
    href: `#${targetScope}-company-${company.id}` as Route,
  });
  const maxValue = Math.max(...companies.map((company) => company.marketCapUsdB), reference?.marketCapUsdB ?? 1);
  const metric = (value: number, display: string, isReference = false) => {
    const ratio = reference ? (value / reference.marketCapUsdB).toFixed(1) : undefined;
    return <>
      <strong>{display}</strong>
      <span className={styles.track} aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(100, value / maxValue * 100))}%` }} /></span>
      {reference ? <small className={styles.ratio}>{isReference ? "比較基準：1.0倍" : `${reference.comparisonLabel}の${ratio === "0.0" ? "0.1倍未満" : `約${ratio}倍`}`}</small> : null}
    </>;
  };
  const referenceRow = reference ? <tr key={`${scope}-reference-${reference.id}`} role="row" className={styles.reference} aria-label={`参考：${reference.name}（順位対象外）`}>
    <td role="cell" className={styles.rank} aria-label={isWorld ? "順位対象外" : "国内順位対象外"} />
    <th role="rowheader" scope="row" className={styles.company}><span className={styles.referenceCompany}>
      <span className={styles.referenceBadge}>参考</span><RankingCompanyName companyId={reference.id} name={reference.name} />
    </span><span className={styles.referenceNote}>業界外の比較対象・自動車／日本</span></th>
    <td role="cell" className={`market-cap-value ${styles.value}`}>{metric(reference.marketCapUsdB, formatMarketCapUsdB(reference.marketCapUsdB), true)}</td>
    <td role="cell" className={styles.compare}><span className={styles.referenceNote}>半導体ランキング対象外</span></td>
  </tr> : null;

  return (
    <div className={`market-cap-ranking${unified ? ` ${styles.unified}` : ""}`} aria-label={`${title}の時価総額ランキング`}>
      <dl className="market-cap-meta">
        <div><dt>基準日</dt><dd>{formattedDate}</dd></div>
        <div><dt>対象</dt><dd>{semiconductorMarketCapMeta.definition}</dd></div>
        <div><dt>通貨</dt><dd>{semiconductorMarketCapMeta.currency}</dd></div>
        <div><dt>主要出典</dt><dd><a href={semiconductorMarketCapMeta.sourceUrl} rel="noopener noreferrer" target="_blank">{semiconductorMarketCapMeta.sourceName}</a></dd></div>
      </dl>
      <p className="market-cap-caution">時価総額は株価や為替レートによって変動します。本ランキングは上記基準日時点の参考値です。</p>
      {unified && isWorld ? <>
        <MarketCapRankingChart sourceSlug={sourceSlug} formattedDate={formattedDate} groups={{
          world: { items: worldSemiconductorMarketCapRanking.map(company => chartItem(company, "world", company.rank)), description: `世界上位${worldSemiconductorMarketCapRanking.length}社。`, scale: "順位は世界順位。" },
          japan: { items: japanSemiconductorMarketCapRanking.map(company => chartItem(company, "japan", company.domesticRank)), description: `日本企業${japanSemiconductorMarketCapRanking.length}社。`, scale: "順位は国内順位。" },
          all: { items: combined.map(company => chartItem(company, worldIds.has(company.id) ? "world" : "japan", company.rank)), description: `世界上位と日本企業の掲載${combined.length}社（重複を除く）。世界全企業の一覧ではありません。`, scale: "順位は世界順位。" },
        }} />
        <MarketCapRankingExplore />
        <p className={styles.compareHint}>気になる企業は「＋ 比較」で2社を選択。事業・規模・日本での仕事を並べて確認できます。</p>
      </> : null}
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
      <div className={`market-cap-table-wrap${unified ? ` ${styles.tableWrap}` : ""}`}>
        <table className="market-cap-table" role={unified ? "table" : undefined} aria-label={`${title}の時価総額ランキング`}>
          <thead role={unified ? "rowgroup" : undefined}>
            <tr role={unified ? "row" : undefined}>
              <th scope="col">{isWorld ? "順位" : "国内"}</th>
              {!unified && !isWorld ? <th scope="col">世界</th> : null}
              <th scope="col">企業名</th>
              {!unified && <th scope="col">ティッカー</th>}
              <th scope="col">時価総額</th>
              {!unified && <>{isWorld ? <th scope="col">国・地域</th> : null}<th scope="col">分類</th><th scope="col">主な事業</th></>}
              {unified && <th scope="col">比較</th>}
            </tr>
          </thead>
          <tbody role={unified ? "rowgroup" : undefined}>
            {companies.map((company, index) => {
              const displayRank = isWorld
                ? company.rank
                : "domesticRank" in company && typeof company.domesticRank === "number"
                  ? company.domesticRank
                  : company.rank;
              const identity = <RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name}>
                {company.companySlug ? <TrackedInternalLink
                  eventName="article_company_click"
                  eventProperties={{ company_id: company.companySlug, source_slug: sourceSlug }}
                  href={`/companies/${company.companySlug}` as Route}
                >{company.name}</TrackedInternalLink> : company.name}
                {company.englishName !== company.name ? <small>{company.englishName}</small> : null}
              </RankingCompanyName>;
              const companyRow = unified ? (
                <tr role="row" id={`${scope}-company-${company.id}`} tabIndex={-1}>
                  <td role="cell" className={`market-cap-rank ${styles.rank}`}>{displayRank}{!isWorld && <small>世界{company.rank}位</small>}</td>
                  <th scope="row" role="rowheader" className={styles.company}>
                    {identity}
                    <dl className={styles.metadata}>
                      <div><dt className={styles.srOnly}>国・地域</dt><dd><CountryRegion country={company.country} /></dd></div>
                      <div><dt className={styles.srOnly}>分類</dt><dd><span aria-hidden="true">·</span>{company.category}</dd></div>
                      <div><dt className={styles.srOnly}>ティッカー</dt><dd><span aria-hidden="true">·</span>{company.ticker}</dd></div>
                    </dl>
                    <div className={styles.business}><span className={styles.srOnly}>主な事業：</span>{company.mainBusiness}</div>
                  </th>
                  <td role="cell" className={`market-cap-value ${styles.value}`}>{metric(company.marketCapUsdB, company.marketCapDisplay)}</td>
                  <td role="cell" className={styles.compare}><RankingCompareButton id={company.id} source={scope} /></td>
                </tr>
              ) : (
                <tr>
                  <td className="market-cap-rank">{displayRank}</td>
                  {!isWorld ? <td>{company.rank}位</td> : null}
                  <th scope="row">
                    {identity}
                  </th>
                  <td>{company.ticker}</td>
                  <td className="market-cap-value">{company.marketCapDisplay}</td>
                  {isWorld ? <td><CountryRegion country={company.country} /></td> : null}
                  <td><span className="market-cap-category">{company.category}</span></td>
                  <td>{company.mainBusiness}</td>
                </tr>
              );
              return <Fragment key={`${scope}-${company.rank}-${company.ticker}`}>
                {index === referencePosition ? referenceRow : null}{companyRow}
              </Fragment>;
            })}
            {referencePosition === companies.length ? referenceRow : null}
          </tbody>
        </table>
      </div>
      <small>取得日：{semiconductorMarketCapMeta.retrievedAt.replaceAll("-", ".")}。総合企業の時価総額は、半導体部門だけではなく企業全体の数値です。</small>
      {isWorld && <small>国・地域は本社所在地を基準とし、工場や日本法人の所在地を示すものではありません。</small>}
      <CompanyLogoAttribution />
    </div>
  );
}
