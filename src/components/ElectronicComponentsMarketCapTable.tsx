import Link from "next/link";
import type { Route } from "next";
import { electronicComponentsMarketCapMeta, japanElectronicComponentsMarketCapRanking, worldElectronicComponentsMarketCapRanking } from "@/data/electronic-components-market-cap";

export function ElectronicComponentsMarketCapTable({ scope }: { scope: "world" | "japan" }) {
  const rows = scope === "world" ? worldElectronicComponentsMarketCapRanking : japanElectronicComponentsMarketCapRanking;
  return <div className="guide-comparison-table" role="region" aria-label={`${scope === "world" ? "世界" : "日本"}時価総額ランキング`} tabIndex={0}>
    <p>基準日：{electronicComponentsMarketCapMeta.dataAsOf}／通貨：米ドル。{electronicComponentsMarketCapMeta.definition}</p>
    <p>株価や為替で変動する企業全体の参考値です。各市場の取引日や更新時刻には差があります。</p>
    <table><caption>{scope === "world" ? `世界${rows.length}社` : `日本${rows.length}社`}の時価総額</caption>
      <thead><tr><th scope="col">順位</th><th scope="col">企業</th><th scope="col">国・地域</th><th scope="col">時価総額</th><th scope="col">主な事業</th></tr></thead>
      <tbody>{rows.map((company, index) => <tr key={company.id} id={`${scope}-company-${company.id}`}>
        <th scope="row">{index + 1}</th><td>{company.companySlug ? <Link href={`/companies/${company.companySlug}` as Route}>{company.name}</Link> : company.name}<br /><small>{company.ticker}</small></td>
        <td>{company.country}</td><td>{company.marketCapDisplay}</td><td>{company.category}：{company.mainBusiness} <a href={company.sourceUrl} target="_blank" rel="noopener noreferrer">出典</a></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
