import type { RankingMode } from '@/lib/ranking-comparison';
import type { Route } from 'next';
import { TrackedInternalLink } from '@/components/TrackedInternalLink';
import { formatMarketCap, rankChange, type RankedCompany } from '@/lib/ranking-time-machine';
import styles from './ranking-time-machine.module.css';

export function CompanyDetail({ companyId, timeline, index, mode = 'semiconductor' }: {
  mode?: RankingMode;
  companyId: string; timeline: readonly { year: number; rows: readonly RankedCompany[] }[]; index: number;
}) {
  const row = timeline[index].rows.find(company => company.id === companyId);
  if (!row) return <section className={styles.panel} id="ranking-company-detail" aria-label="企業の詳細"><p>気になる企業をバー・選択欄・表から選ぶと、過去の順位を確認できます。</p></section>;
  const first = timeline[0].rows.find(company => company.id === companyId)!;
  const previous = index > 0 ? timeline[index - 1].rows.find(company => company.id === companyId) : undefined;
  const year = timeline[index].year;
  const properties = { comparison_mode: mode, year, company: companyId, ranking_type: 'market_cap', data_kind: 'real' };
  return <section className={styles.panel} id="ranking-company-detail" tabIndex={-1} aria-labelledby="ranking-company-title">
    <h2 id="ranking-company-title">{row.displayName}</h2>
    <p>{year}年末：<strong>{formatMarketCap(row.valueUsdB)} 十億米ドル</strong></p>
    <dl className={styles.metrics}>
      <div><dt>表示年の順位</dt><dd>{row.rank}位</dd></div>
      <div><dt>前年の順位</dt><dd>{previous ? `${previous.rank}位` : '対象期間外'}</dd></div>
      <div><dt>{timeline[0].year}年の順位</dt><dd>{first.rank}位</dd></div>
      <div><dt>開始年から表示年</dt><dd>{rankChange(first.rank, row.rank)}</dd></div>
    </dl>
    <p className={styles.small}>順位はすべて対象{timeline[index].rows.length}社内。企業価値や就職先としての優劣を判定するものではありません。</p>
    <details><summary>{timeline[0].year}〜{timeline[timeline.length - 1].year}年の順位と数値を見る</summary>
      <table className={styles.table}><caption>{row.name}の年別履歴（十億米ドル）</caption>
        <thead><tr><th scope="col">年末</th><th scope="col">順位</th><th scope="col">時価総額</th></tr></thead>
        <tbody>{timeline.map(snapshot => { const item = snapshot.rows.find(company => company.id === companyId)!; return <tr key={snapshot.year} data-selected={snapshot.year === year}><th scope="row">{snapshot.year}</th><td>{item.rank}</td><td>{formatMarketCap(item.valueUsdB)}</td></tr>; })}</tbody>
      </table>
    </details>
    <div className={styles.links}>
      {row.companySlug && <TrackedInternalLink href={`/companies/${row.companySlug}` as Route} eventName="ranking_timemachine_related_click" eventProperties={{ ...properties, destination: `/companies/${row.companySlug}` }}>事業・仕事内容を調べる →</TrackedInternalLink>}
      <TrackedInternalLink href="/guides/semiconductor-market-cap-ranking" eventName="ranking_timemachine_related_click" eventProperties={{ ...properties, destination: '/guides/semiconductor-market-cap-ranking' }}>基準日時点の時価総額ランキングを読む →</TrackedInternalLink>
      <a href={row.sourceUrl}>この企業の数値の出典</a>
    </div>
  </section>;
}
