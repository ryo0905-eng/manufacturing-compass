import { OpticalCompaniesExplorer } from "@/components/OpticalCompaniesExplorer";
import { opticalCategories, opticalCategoryIds, opticalCompanies, opticalMeta } from "@/data/optical-semiconductor";
import styles from "./OpticalCompanies.module.css";

export function OpticalCompanies() {
  return <div className={styles.root}>
    <p>公式製品情報の確認日：{opticalMeta.checkedAt}。掲載6社は比較のための例で、売上・シェアの上位6社ではありません。掲載順も順位を表しません。</p>
    <OpticalCompaniesExplorer />
    <details className={styles.tableSection}>
      <summary>全6社と4分野の対応・公式出典を一覧で見る</summary>
      <p>「製品例あり」から公式情報へ進めます。「未掲載」は本記事で製品例を掲載していないことを表し、その企業が製品を扱っていないという意味ではありません。</p>
      <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="企業と光半導体の対応表。横にスクロールできます">
        <table><caption>光半導体の製品例（{opticalMeta.checkedAt}確認）</caption>
          <thead><tr><th scope="col">企業</th>{opticalCategoryIds.map(id => <th scope="col" key={id}>{opticalCategories[id].label}</th>)}</tr></thead>
          <tbody>{opticalCompanies.map(company => <tr key={company.id}><th scope="row">{company.name}</th>{opticalCategoryIds.map(id => {
            const product = company.products.find(item => item.category === id);
            return <td key={id}>{product ? <a href={product.url} target="_blank" rel="noopener noreferrer" aria-label={`${company.name}の${opticalCategories[id].label}公式製品情報`}>製品例あり</a> : "未掲載"}</td>;
          })}</tr>)}</tbody>
        </table>
      </div>
    </details>
  </div>;
}
