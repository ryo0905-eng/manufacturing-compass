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

type MarketCapRankingTableProps = {
  scope: "world" | "japan";
  sourceSlug?: string;
};

export function MarketCapRankingTable({ scope, sourceSlug }: MarketCapRankingTableProps) {
  const isWorld = scope === "world";
  const companies = isWorld ? worldSemiconductorMarketCapRanking : japanSemiconductorMarketCapRanking;
  const title = isWorld ? "世界TOP30" : "日本企業TOP10";
  const [year, month, day] = semiconductorMarketCapMeta.dataAsOf.split("-");
  const formattedDate = `${year}年${Number(month)}月${Number(day)}日`;
  const reference = sourceSlug === "semiconductor-market-cap-ranking"
    ? getMatchingMarketCapReference(toyotaMarketCapReference, semiconductorMarketCapMeta)
    : undefined;
  const referenceValue = reference ? formatMarketCapUsdB(reference.marketCapUsdB) : undefined;
  const chartTitle = isWorld ? "世界ランキング上位10社" : "日本企業ランキング上位10社";

  return (
    <div className="market-cap-ranking" aria-label={`${title}の時価総額ランキング`}>
      <dl className="market-cap-meta">
        <div><dt>基準日</dt><dd>{formattedDate}</dd></div>
        <div><dt>対象</dt><dd>{semiconductorMarketCapMeta.definition}</dd></div>
        <div><dt>通貨</dt><dd>{semiconductorMarketCapMeta.currency}</dd></div>
        <div><dt>主要出典</dt><dd><a href={semiconductorMarketCapMeta.sourceUrl} rel="noopener noreferrer" target="_blank">{semiconductorMarketCapMeta.sourceName}</a></dd></div>
      </dl>
      <p className="market-cap-caution">時価総額は株価や為替レートによって変動します。本ランキングは上記基準日時点の参考値です。</p>
      <MetricBarChart
        eyebrow="Market cap overview"
        items={companies.slice(0, 10).map((company) => ({
          category: company.category,
          country: isWorld ? company.country : undefined,
          displayValue: company.marketCapDisplay,
          label: company.name,
          logoId: company.companySlug ?? company.id,
          value: company.marketCapUsdB,
        }))}
        note={reference
          ? "棒の長さは0ドルを基準に、参考のトヨタを含むグラフ内の最大値との比率で表示しています。世界と日本のグラフでは尺度が異なります。株価と為替により変動します。"
          : "棒の長さは0ドルを基準に、このグラフ内の最大値との比率で表示しています。株価と為替により変動します。"}
        title={reference ? `${chartTitle}＋参考：${reference.name}` : chartTitle}
        reference={reference ? {
          label: reference.name,
          comparisonLabel: reference.comparisonLabel,
          category: "業界外の比較対象",
          displayValue: formatMarketCapUsdB(reference.marketCapUsdB),
          logoId: reference.id,
          value: reference.marketCapUsdB,
        } : undefined}
        referenceNote={reference ? <>
          日本を代表する自動車メーカー、トヨタ自動車を規模の目安として掲載。比較しているのは企業全体の時価総額で、売上高や従業員数ではありません。
          参考値：{formattedDate}基準・{referenceValue}（米ドル）。確認日：{reference.checkedAt.replaceAll("-", ".")}。
          出典：<a href={reference.sourceUrl} rel="noopener noreferrer" target="_blank">{reference.sourceName}（トヨタ自動車）</a>。
        </> : undefined}
      />
      {!isWorld && reference ? <p className="market-cap-reference-history">
        <TrackedInternalLink
          href="/tools/ranking-time-machine#mode=global&year=2025&company=toyota"
          eventName="article_internal_click"
          eventProperties={{ source_slug: sourceSlug, destination_path: "/tools/ranking-time-machine#mode=global&year=2025&company=toyota" }}
        >トヨタと半導体企業の過去の変化を見る →</TrackedInternalLink>
        <small>移動先は2014〜2025年の年末データです。この記事の基準日とは異なります。</small>
      </p> : null}
      <div className="market-cap-table-wrap">
        <table className="market-cap-table">
          <thead>
            <tr>
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
          <tbody>
            {companies.map((company) => {
              const displayRank = isWorld
                ? company.rank
                : "domesticRank" in company && typeof company.domesticRank === "number"
                  ? company.domesticRank
                  : company.rank;
              return (
                <tr key={`${scope}-${company.rank}-${company.ticker}`}>
                  <td className="market-cap-rank">{displayRank}</td>
                  {!isWorld ? <td>{company.rank}位</td> : null}
                  <th scope="row">
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
                  <td>{company.ticker}</td>
                  <td className="market-cap-value">{company.marketCapDisplay}</td>
                  {isWorld ? <td><CountryRegion country={company.country} /></td> : null}
                  <td><span className="market-cap-category">{company.category}</span></td>
                  <td>{company.mainBusiness}</td>
                  {sourceSlug === "semiconductor-market-cap-ranking" && <td><RankingCompareButton id={company.id} source={scope} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <small>取得日：{semiconductorMarketCapMeta.retrievedAt.replaceAll("-", ".")}。総合企業の時価総額は、半導体部門だけではなく企業全体の数値です。</small>
      {isWorld && <small>国・地域は本社所在地を基準とし、工場や日本法人の所在地を示すものではありません。</small>}
      <CompanyLogoAttribution />
    </div>
  );
}
