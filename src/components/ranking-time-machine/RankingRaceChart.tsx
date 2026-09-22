'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { formatMarketCap, type RankedCompany } from '@/lib/ranking-time-machine';
import { useRankingAnimation } from './useRankingAnimation';
import styles from './ranking-time-machine.module.css';

export function RankingRaceChart({ rows, year, selectedId, animate, onSelect }: {
  rows: readonly RankedCompany[]; year: number; selectedId: string; animate: boolean; onSelect: (id: string) => void;
}) {
  const chart = useRef<HTMLOListElement>(null);
  const frame = useRankingAnimation(rows, year, animate);
  const max = frame.rows[0].valueUsdB;
  useLayoutEffect(() => {
    const element = chart.current;
    if (!element) return;
    // Measure every label, including companies currently outside the top ten.
    // A shared row height keeps transitions aligned without clipping wrapped names.
    const measure = () => {
      const height = Math.ceil(Math.max(...Array.from(element.children, row => row.getBoundingClientRect().height))) + 2;
      element.style.setProperty('--race-row-height', `${height}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    Array.from(element.children).forEach(row => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return <figure className={styles.figure} aria-labelledby="race-title">
    <figcaption><h2 id="race-title">{year}年末の上位10社{frame.interpolating ? 'へ' : ''}</h2><p className={styles.small}>選定20社内 · 十億米ドル · 企業を選ぶと詳細を表示</p>
      <p className={styles.small}>{frame.interpolating ? `${frame.fromYear}→${year}年末：順位・数値を補間表示中（実測値ではありません）` : `${year}年末の確定値 · 再生時は年末値間を補間します`}</p></figcaption>
    <div className={styles.axis} aria-label={`横軸：0〜${formatMarketCap(max)}十億米ドル`}>
      {[0, .5, 1].map(fraction => <span key={fraction}>{formatMarketCap(max * fraction)}</span>)}
    </div>
    <ol ref={chart} className={styles.race} data-animate={animate} aria-label={frame.interpolating ? `${frame.fromYear}年末から${year}年末への補間ランキング` : `${year}年末の対象企業内上位10社`}>
      {frame.rows.map((row, index) => {
        const visible = index < 10;
        return <li key={row.id} className={styles.raceRow} data-visible={visible} aria-hidden={!visible} inert={!visible}
          style={{ '--position': Math.min(index, 10) } as CSSProperties}>
          <button type="button" className={styles.raceButton} onClick={() => onSelect(row.id)} aria-pressed={selectedId === row.id}
            aria-controls="ranking-company-detail" aria-label={`${row.rank}位 ${row.displayName} ${formatMarketCap(row.valueUsdB)}十億米ドル。詳細を見る`}>
            <span className={styles.rank}>{row.rank}<small>位</small></span>
            <span className={styles.companyName}>{row.displayName}</span>
            <span className={styles.track} aria-hidden="true"><span className={styles.bar} style={{ width: `${row.valueUsdB / max * 100}%` }} /></span>
            <span className={styles.value}>{formatMarketCap(row.valueUsdB)}</span>
          </button>
        </li>;
      })}
    </ol>
    <p className={styles.small}>横軸も変動します。停止・年選択で表示年の確定値に戻ります。表・企業詳細は常に年末の確定値です。</p>
  </figure>;
}
