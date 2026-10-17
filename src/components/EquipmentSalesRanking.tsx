import { EquipmentSalesExplorer } from "@/components/EquipmentSalesExplorer";
import { RankingCompanyName } from "@/components/RankingCompanyName";
import { CompanyLogoAttribution } from "@/components/CompanyLogoAttribution";
import { CountryRegion } from "@/components/CountryRegion";
import { companyHeadquarters, headquartersCheckedAt } from "@/data/company-regions";
import { equipmentProcesses, equipmentSalesCompanies, equipmentSalesMeta as meta } from "@/data/semiconductor-equipment-sales";
import styles from "./EquipmentSalesRanking.module.css";

export function EquipmentSalesRanking({ sourceSlug = "semiconductor-equipment-sales-ranking" }: { sourceSlug?: string }) {
  return <div className={styles.root}>
    <p>{meta.scope}。単位：{meta.currency}（1十億米ドル＝10億米ドル）。確認日：{meta.checkedAt}。</p>
    <p>売上出典：<a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer">{meta.sourceTitle}</a>（原出典：{meta.originalSource}）。工程・製品情報の確認日：{meta.checkedAt}。</p>
    <p className={styles.regionNote}>国・地域は本社所在地（グループは親会社）が基準です。工場所在地ではありません。表の国・地域名に公式出典を付けています。本社情報の確認日：{headquartersCheckedAt}。</p>
    <EquipmentSalesExplorer sourceSlug={sourceSlug} />
    <details className={styles.details}>
      <summary>全10社の売上・工程・出典を一覧表で確認する</summary>
      <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="売上高と工程の一覧表。横にスクロールできます">
        <table>
          <caption>{meta.year}年 半導体製造装置売上高（{meta.currency}）。全行の売上出典は上記IR資料。</caption>
          <thead><tr><th scope="col">順位</th><th scope="col">企業</th><th scope="col">国・地域</th><th scope="col">売上高</th><th scope="col">確認した工程・製品例と公式出典</th></tr></thead>
          <tbody>{equipmentSalesCompanies.map((company) => <tr key={company.id}>
            <td>{company.rank}</td><th scope="row"><RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name} /></th>
            <td><a href={companyHeadquarters[company.id]?.sourceUrl} target="_blank" rel="noopener noreferrer"><CountryRegion country={companyHeadquarters[company.id]?.country ?? "未確認"} /></a></td>
            <td>{company.salesUsdB.toFixed(2)}</td>
            <td><ul>{company.capabilities.map((item) => <li key={item.process}><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{equipmentProcesses.find((process) => process.id === item.process)?.label}</a>：{item.description}</li>)}</ul></td>
          </tr>)}</tbody>
        </table>
      </div>
    </details>
    <CompanyLogoAttribution />
  </div>;
}
