import { summarize, type Filter } from '@/lib/correlation-causation/analysis';
import type { Observation } from '@/lib/correlation-causation/model';
import styles from './correlation.module.css';
export function CorrelationChart({ rows, filter, colored, label }: { rows: readonly Observation[]; filter: Filter; colored: boolean; label: string }) {
  const selected = rows.filter(row => filter === 'all' || row.product === filter);
  const summary = summarize(rows, filter);
  const y = (rate: number) => 252 - rate * 7;
  return <figure className={styles.figure}>
    <svg viewBox="0 0 520 308" role="img" aria-label={`${label}。${filter === 'all' ? '全体' : `製品${filter}`}の温度とロット不良率。集計値は直後の表にあります。`}>
      <text x="22" y="20" fontSize="14">ロット不良率（%）</text>
      {[0, 10, 20, 30].map(tick => <g key={tick}><path d={`M55 ${y(tick)}H480`} stroke="#e0e5ea"/><text x="43" y={y(tick) + 5} textAnchor="end" fontSize="14" fill="#52616d">{tick}</text></g>)}
      {selected.map(row => {
        // Deterministic horizontal jitter only separates overlapping dots; temperature is discrete.
        const x = (row.temperature === 380 ? 160 : 385) + ((row.order * 17) % 61) - 30;
        const fill = !colored ? '#657585' : row.product === 'A' ? '#176b91' : '#a15335';
        return colored && row.product === 'B'
          ? <rect key={row.id} x={x - 3} y={y(row.rate) - 3} width="6" height="6" fill={fill} opacity="0.8"/>
          : <circle key={row.id} cx={x} cy={y(row.rate)} r="3.2" fill={fill} opacity="0.8"/>;
      })}
      {summary.groups.map(group => <g key={group.temperature}><path d={`M${group.temperature === 380 ? 120 : 345} ${y(group.mean)}h80`} stroke="#172c3a" strokeWidth="3"/><text x={group.temperature === 380 ? 160 : 385} y="279" textAnchor="middle" fontSize="16">{group.temperature}℃</text></g>)}
      <text x="270" y="303" textAnchor="middle" fontSize="13">加工温度（低温／高温の2条件）</text>
    </svg>
    <figcaption>{colored ? '● 青：製品A ／ ■ 茶：製品B。' : '点は1ロット。'} 太い横線は表示中の群平均。点の横ずれは重なりを避ける表示で、温度差ではありません。</figcaption>
  </figure>;
}
export function SummaryTable({ rows, filter = 'all', composition = true, label }: { rows: readonly Observation[]; filter?: Filter; composition?: boolean; label: string }) {
  const result = summarize(rows, filter);
  return <div className={styles.summary}>
    <table><caption>{label}・{filter === 'all' ? '全体' : `製品${filter}`}の集計</caption><thead><tr><th scope="col">温度</th><th scope="col">ロット数</th><th scope="col">平均不良率</th></tr></thead><tbody>{result.groups.map(group => <tr key={group.temperature}><th scope="row">{group.temperature}℃</th><td>{group.count}</td><td>{group.mean.toFixed(2)}%</td></tr>)}</tbody></table>
    <p className={styles.difference}>高温 − 低温：<strong>{result.difference > 0 ? '+' : ''}{result.difference.toFixed(2)}</strong> ポイント</p>
    {composition && <ul className={styles.composition}>{result.groups.map(group => <li key={group.temperature}>{group.temperature}℃：A {group.a}ロット（{(group.a / group.count * 100).toFixed(0)}%）／ B {group.b}ロット（{(group.b / group.count * 100).toFixed(0)}%）</li>)}</ul>}
  </div>;
}
