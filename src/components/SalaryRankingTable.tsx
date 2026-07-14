import type { Route } from "next";
import Link from "next/link";
import { semiconductorSalaryMeta, semiconductorSalaryRanking } from "@/data/semiconductor-salary";

export function SalaryRankingTable() {
  return (
    <div className="salary-ranking" aria-label="日本の主要半導体関連企業の平均年収ランキング">
      <dl className="market-cap-meta">
        <div><dt>対象</dt><dd>{semiconductorSalaryMeta.scope}</dd></div>
        <div><dt>定義</dt><dd>{semiconductorSalaryMeta.definition}</dd></div>
        <div><dt>単位</dt><dd>{semiconductorSalaryMeta.unit}</dd></div>
        <div><dt>確認日</dt><dd>{semiconductorSalaryMeta.retrievedAt.replaceAll("-", ".")}</dd></div>
      </dl>
      <p className="market-cap-caution">平均年間給与は提出会社・単体の平均です。職種別・年齢別の給与、グループ全体の平均、求人票の提示レンジではありません。</p>
      <div className="market-cap-table-wrap">
        <table className="market-cap-table salary-ranking-table">
          <thead>
            <tr>
              <th scope="col">順位</th>
              <th scope="col">企業名</th>
              <th scope="col">平均年間給与</th>
              <th scope="col">対象人数</th>
              <th scope="col">平均年齢</th>
              <th scope="col">決算期</th>
              <th scope="col">分類</th>
              <th scope="col">会社形態</th>
              <th scope="col">出典</th>
            </tr>
          </thead>
          <tbody>
            {semiconductorSalaryRanking.map((company) => (
              <tr key={company.ticker}>
                <td className="market-cap-rank">{company.rank}</td>
                <th scope="row">
                  {company.companySlug ? <Link href={`/companies/${company.companySlug}` as Route}>{company.name}</Link> : company.name}
                  <small>証券コード {company.ticker}</small>
                  {company.note ? <small className="salary-ranking-note">{company.note}</small> : null}
                </th>
                <td className="market-cap-value">{company.annualSalaryManYen.toLocaleString("ja-JP")}万円</td>
                <td>{company.employees.toLocaleString("ja-JP")}人</td>
                <td>{company.averageAge.toFixed(1)}歳</td>
                <td>{company.fiscalPeriod}</td>
                <td><span className="market-cap-category">{company.category}</span></td>
                <td>{company.companyType}</td>
                <td><a href={company.sourceUrl} rel="noopener noreferrer" target="_blank">有報・IR</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <small>各社の直近有価証券報告書に記載された平均年間給与を1万円単位の概数で表示。賞与や基準外賃金の扱いは各社注記に従い、決算期は企業により異なります。</small>
    </div>
  );
}
