import { SelectField } from '@/components/ui/Controls';
import { formatMarketCap, type RankedCompany } from '@/lib/ranking-time-machine';
import styles from './ranking-time-machine.module.css';

export function CompanyTracker({ rows, year, selectedId, onSelect }: {
  rows: readonly RankedCompany[]; year: number; selectedId: string; onSelect: (id: string) => void;
}) {
  const index = rows.findIndex(row => row.id === selectedId);
  const selected = rows[index];
  return <section className={styles.tracker} aria-label="気になる1社を追跡">
    <SelectField id="ranking-company" label={`気になる1社（対象${rows.length}社）`} value={selectedId} onChange={event => onSelect(event.target.value)}>
      <option value="">企業を選ぶ</option>
      {[...rows].sort((a, b) => a.id.localeCompare(b.id)).map(row => <option key={row.id} value={row.id}>{row.displayName}</option>)}
    </SelectField>
    <div aria-live="polite" aria-atomic="true">
      {selected ? <><p><strong>{selected.displayName}</strong></p><p className={styles.small}>{year}年末の確定値 · 対象{rows.length}社内</p>
        <p><strong>{selected.rank}位</strong> · {formatMarketCap(selected.valueUsdB)} 十億米ドル</p>
        <p className={styles.small}>{index >= Math.min(10, rows.length) ? 'トップ10圏外' : 'チャート表示対象'}</p></> : <p className={styles.small}>圏外の企業も、順位と金額を追えます。</p>}
    </div>
    {selected && <a href="#ranking-company-detail">詳細を見る →</a>}
  </section>;
}
