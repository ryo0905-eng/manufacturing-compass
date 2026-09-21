import { levels, type Level, type Observation } from '@/lib/taguchi/types';
import { text } from '@/data/taguchi';
import styles from './taguchi.module.css';
export type Series = { label: string; observations: readonly Observation[] };
export function TaguchiChart({ series, noise }: { series: readonly Series[]; noise: Level }) {
  const max = Math.max(5, ...series.flatMap(s => s.observations.map(o => o.value)));
  const x = (z: number) => 80 + (z + 1) * 185;
  const y = (v: number) => 240 - v / max * 200;
  return <figure className={styles.figure}>
    <svg viewBox="0 0 540 315" role="img" aria-label="原料特性3水準と膜厚むらの比較。実線と丸が基準、破線と四角が候補。数値は選択状態の表示と全観測表で確認できます。">
      <rect x={x(noise) - 24} y="35" width="48" height="210" fill="#eef3fa" />
      {[0, 1, 2, 3, 4, 5].map(i => <g key={i}><path d={`M55 ${y(max * i / 5)}H485`} stroke="#e5e7eb" /><text x="44" y={y(max * i / 5) + 4} textAnchor="end" fontSize="12" fill="#60666d">{(max * i / 5).toFixed(1)}</text></g>)}
      <text x="16" y="20" fontSize="12" fill="#60666d">膜厚むら %</text>
      {series.map((s, index) => {
        const points = levels.flatMap(z => { const rows = s.observations.filter(o => o.noise === z); return rows.length ? [{ z, mean: rows.reduce((sum, o) => sum + o.value, 0) / rows.length }] : []; });
        const color = index === 0 ? '#1d1d1f' : '#1769aa';
        return <g key={`${s.label}:${s.observations.length}:${s.observations[0]?.phase}`} className={styles.series}>
          {points.length > 1 && <polyline points={points.map(p => `${x(p.z)},${y(p.mean)}`).join(' ')} fill="none" stroke={color} strokeWidth="2" strokeDasharray={index ? '7 5' : undefined} />}
          {s.observations.map((o, i) => <circle key={o.id} cx={x(o.noise) + ((i % 3) - 1) * 8} cy={y(o.value)} r="2.5" fill={color}><title>{`${s.label}・${text.noiseLabels[o.noise + 1]}：${o.value.toFixed(3)}%`}</title></circle>)}
          {points.map(p => index === 0 ? <circle key={p.z} cx={x(p.z)} cy={y(p.mean)} r="6" fill="white" stroke={color} strokeWidth="2" /> : <rect key={p.z} x={x(p.z) - 5} y={y(p.mean) - 5} width="10" height="10" fill="white" stroke={color} strokeWidth="2" />)}
          <text x="58" y={294 + index * 17} fontSize="12" fill={color}>{`${index ? '□ ┄' : '○ ━'} ${s.label}`}</text>
        </g>;
      })}
      {levels.map(z => <text key={z} x={x(z)} y="268" textAnchor="middle" fontSize="13" fill="#1d1d1f">{text.noiseLabels[z + 1]}</text>)}
      {series.every(s => s.observations.length === 0) && <text x="270" y="140" textAnchor="middle" fontSize="15" fill="#60666d">実験すると、測定点が現れます</text>}
    </svg><figcaption>{text.graphHint}</figcaption>
  </figure>;
}
export function EffectChart({ values, axis }: { values: readonly { level: Level; sn: number }[]; axis: 'a' | 'b' }) {
  const low = Math.min(...values.map(v => v.sn)) - .2, high = Math.max(...values.map(v => v.sn)) + .2;
  const y = (v: number) => 120 - (v - low) / (high - low) * 85;
  return <figure className={styles.effect}><svg viewBox="0 0 290 155" role="img" aria-label={`${axis === 'a' ? '温度' : '圧力'}水準別の平均SN比。数値を各点に表示。`}>
    <path d={values.map((v, i) => `${i ? 'L' : 'M'}${45 + i * 100} ${y(v.sn)}`).join(' ')} fill="none" stroke="#1769aa" strokeWidth="2" />
    {values.map((v, i) => <g key={v.level}><circle cx={45 + i * 100} cy={y(v.sn)} r="4" fill="#1769aa" /><text x={45 + i * 100} y={y(v.sn) - 10} textAnchor="middle" fontSize="12">{v.sn.toFixed(2)}</text><text x={45 + i * 100} y="145" textAnchor="middle" fontSize="12">{axis === 'a' ? `${400 + v.level * 40}℃` : `${60 + v.level * 20}Pa`}</text></g>)}
  </svg><figcaption>{axis === 'a' ? '温度' : '圧力'}：平均SN比（dB）</figcaption></figure>;
}
