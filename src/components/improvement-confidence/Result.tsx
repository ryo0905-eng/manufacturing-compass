import { useId } from 'react';
import type { Analysis } from '@/lib/improvement-confidence/statistics';
import { describe } from '@/lib/improvement-confidence/statistics';
import type { Observations } from '@/lib/improvement-confidence/model';
import styles from './improvement.module.css';
export const format = (value: number) => (Math.abs(value) < .005 ? 0 : value).toFixed(2);
export function Result({ result, threshold, observations }: { result: Analysis; threshold: number; observations: Observations }) {
  const titleId = useId();
  const min = Math.min(-12, Math.floor((result.lower - 1) / 4) * 4);
  const max = Math.max(12, Math.ceil((result.upper + 1) / 4) * 4);
  const x = (value: number) => 44 + (value - min) / (max - min) * 472;
  return <section className={styles.result} aria-label="平均差と推定の幅">
    <h3>平均差 {format(result.difference)} nm</h3>
    <p>変更前 − 変更後。正の値は膜厚の減少を表します。</p>
    <svg viewBox="0 0 560 170" role="img" aria-labelledby={titleId} className={styles.chart}>
      <title id={titleId}>{`平均差${format(result.difference)}nm、推定の幅${format(result.lower)}から${format(result.upper)}nm。差ゼロとほしい改善幅${threshold}nmとの比較。`}</title>
      <line x1="44" x2="516" y1="110" y2="110" stroke="#c9cdd2" />
      <line x1={x(0)} x2={x(0)} y1="45" y2="118" stroke="#60666d" strokeDasharray="4 4" />
      <line x1={x(threshold)} x2={x(threshold)} y1="45" y2="118" stroke="#1769aa" strokeDasharray="2 3" />
      <text x={x(0)} y="28" textAnchor="middle">差ゼロ</text>
      <text x={x(threshold)} y="145" textAnchor="middle">ほしい幅 {threshold}nm</text>
      <line x1={x(result.lower)} x2={x(result.upper)} y1="75" y2="75" stroke="#1d1d1f" strokeWidth="3" />
      {[result.lower, result.upper].map((v, i) => <line key={i} x1={x(v)} x2={x(v)} y1="66" y2="84" stroke="#1d1d1f" strokeWidth="2" />)}
      <circle cx={x(result.difference)} cy="75" r="6" fill="#1769aa" />
      <text x="44" y="166" textAnchor="start">{format(min)}nm</text><text x="516" y="166" textAnchor="end">{format(max)}nm</text>
    </svg>
    <p className={styles.small}>横軸は原則−12〜12nm。区間が収まらない場合だけ拡張します。線の長さと数値を合わせて見比べてください。</p>
    <p className={styles.reading}>{describe(result, threshold)}</p>
    <table className={styles.table}><caption>測定結果と推定の幅（nm）</caption><thead><tr><th scope="col">項目</th><th scope="col">値</th></tr></thead><tbody>
      <tr><th scope="row">変更前：個数／平均</th><td>{result.before.n}個 ／ {format(result.before.mean)}</td></tr>
      <tr><th scope="row">変更後：個数／平均</th><td>{result.after.n}個 ／ {format(result.after.mean)}</td></tr>
      <tr><th scope="row">平均差</th><td>{format(result.difference)}</td></tr>
      <tr><th scope="row">推定の幅（95%信頼区間）</th><td>{format(result.lower)} ～ {format(result.upper)}</td></tr>
      <tr><th scope="row">ほしい改善幅</th><td>{threshold}</td></tr>
    </tbody></table>
    <details><summary>個々の測定値を見る</summary><div className={styles.values} tabIndex={0} role="region" aria-label="測定値のスクロール表"><table className={styles.table}><caption>独立した2群の測定値。行番号は対応のあるペアを表しません。</caption><thead><tr><th scope="col">番号</th><th scope="col">変更前（nm）</th><th scope="col">変更後（nm）</th></tr></thead><tbody>{observations.before.map((v, i) => <tr key={i}><th scope="row">{i + 1}</th><td>{format(v)}</td><td>{format(observations.after[i])}</td></tr>)}</tbody></table></div></details>
  </section>;
}
