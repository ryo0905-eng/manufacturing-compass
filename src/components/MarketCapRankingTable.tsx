import type { Route } from "next";
import Link from "next/link";
import {
  japanSemiconductorMarketCapRanking,
  semiconductorMarketCapMeta,
  worldSemiconductorMarketCapRanking,
} from "@/data/semiconductor-market-cap";

type MarketCapRankingTableProps = {
  scope: "world" | "japan";
};

export function MarketCapRankingTable({ scope }: MarketCapRankingTableProps) {
  const isWorld = scope === "world";
  const companies = isWorld ? worldSemiconductorMarketCapRanking : japanSemiconductorMarketCapRanking;
  const title = isWorld ? "世界TOP30" : "日本企業TOP10";
  const [year, month, day] = semiconductorMarketCapMeta.dataAsOf.split("-");
  const formattedDate = `${year}年${Number(month)}月${Number(day)}日`;

  return (
    <div className="market-cap-ranking" aria-label={`${title}の時価総額ランキング`}>
      <dl className="market-cap-meta">
        <div><dt>基準日</dt><dd>{formattedDate}</dd></div>
        <div><dt>対象</dt><dd>{semiconductorMarketCapMeta.definition}</dd></div>
        <div><dt>通貨</dt><dd>{semiconductorMarketCapMeta.currency}</dd></div>
        <div><dt>主要出典</dt><dd><a href={semiconductorMarketCapMeta.sourceUrl} rel="noopener noreferrer" target="_blank">{semiconductorMarketCapMeta.sourceName}</a></dd></div>
      </dl>
      <p className="market-cap-caution">時価総額は株価や為替レートによって変動します。本ランキングは上記基準日時点の参考値です。</p>
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
                    {company.companySlug ? (
                      <Link href={`/companies/${company.companySlug}` as Route}>{company.name}</Link>
                    ) : company.name}
                    {company.englishName !== company.name ? <small>{company.englishName}</small> : null}
                  </th>
                  <td>{company.ticker}</td>
                  <td className="market-cap-value">{company.marketCapDisplay}</td>
                  {isWorld ? <td>{company.country}</td> : null}
                  <td><span className="market-cap-category">{company.category}</span></td>
                  <td>{company.mainBusiness}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <small>取得日：{semiconductorMarketCapMeta.retrievedAt.replaceAll("-", ".")}。総合企業の時価総額は、半導体部門だけではなく企業全体の数値です。</small>
    </div>
  );
}
