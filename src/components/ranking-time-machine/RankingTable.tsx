import { formatMarketCap, type RankedCompany } from '@/lib/ranking-time-machine';
import styles from './ranking-time-machine.module.css';

export function RankingTable({ rows, year, selectedId, onSelect }: {
  rows: readonly RankedCompany[]; year: number; selectedId: string; onSelect: (id: string) => void;
}) {
  return <section className={styles.panel} aria-labelledby="ranking-table-title">
    <h2 id="ranking-table-title">数値を一覧で確認する</h2>
    <table className={styles.table}>
      <caption>{year}年末 · 対象{rows.length}社内の順位 · 時価総額（十億米ドル）</caption>
      <thead><tr><th scope="col">順位</th><th scope="col">企業</th><th scope="col">時価総額</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.id} data-selected={selectedId === row.id}>
        <td>{row.rank}</td><th scope="row"><button type="button" onClick={() => onSelect(row.id)} aria-pressed={selectedId === row.id} aria-controls="ranking-company-detail">{row.displayName}</button>{rows.some(company => company.isReference) && <span className={styles.small}>{row.isReference ? '比較対象（他業界）' : '半導体・装置'}</span>}</th>
        <td>{formatMarketCap(row.valueUsdB)}</td>
      </tr>)}</tbody>
    </table>
  </section>;
}
