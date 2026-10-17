'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { formatMarketCap, type RankedCompany } from '@/lib/ranking-time-machine';
import { useRankingAnimation } from './useRankingAnimation';
import { CompanyLogo } from './CompanyLogo';
import styles from './ranking-time-machine.module.css';

export function RankingRaceChart({ rows, year, selectedId, animate, onSelect, variant = 'tool' }: {
  rows: readonly RankedCompany[]; year: number; selectedId: string; animate: boolean; onSelect?: (id: string) => void;
  variant?: 'tool' | 'article' | 'home';
}) {
  const chart = useRef<HTMLOListElement>(null);
  const frame = useRankingAnimation(rows, year, animate);
  const max = frame.rows[0].valueUsdB;
  const visibleCount = Math.min(variant === 'home' ? 5 : 10, rows.length);
  const hasReferences = rows.some(row => row.isReference);
  const article = variant !== 'tool';
  const titleId = variant === 'home' ? 'ranking-home-race-title' : article ? 'ranking-inline-race-title' : 'race-title';
  const Heading = article ? 'h4' : 'h2';
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

  return <figure className={styles.figure} aria-labelledby={titleId}>
    <figcaption><Heading id={titleId}>{year}年末の上位{visibleCount}社{frame.interpolating ? 'へ' : ''}</Heading><p className={styles.small}>選定{rows.length}社内 · 十億米ドル{!article && ' · 企業を選ぶと詳細を表示'}</p>
      <p className={styles.small}>{frame.interpolating ? `${frame.fromYear}→${year}年末：順位・数値を補間表示中（実測値ではありません）` : `${year}年末の確定値 · 再生時は年末値間を補間します`}</p></figcaption>
    {hasReferences && <p className={styles.legend}><span>半導体・装置</span><span data-reference="true">比較対象（GAFAM・トヨタ）</span></p>}
    <div className={styles.axis} aria-label={`横軸：0〜${formatMarketCap(max)}十億米ドル`}>
      {[0, .5, 1].map(fraction => <span key={fraction}>{formatMarketCap(max * fraction)}</span>)}
    </div>
    <ol ref={chart} className={styles.race} style={{ '--race-count': visibleCount } as CSSProperties} data-animate={animate} aria-label={frame.interpolating ? `${frame.fromYear}年末から${year}年末への補間ランキング` : `${year}年末の対象企業内上位${visibleCount}社`}>
      {frame.rows.map((row, index) => {
        const visible = index < visibleCount;
        const identity = <>
          <span className={styles.rank}>{row.rank}<small>位</small></span>
          <span className={styles.companyIdentity}>
            <CompanyLogo src={row.displayName === row.name ? row.logoUrl : undefined} name={row.displayName} aspectRatio={row.logoAspectRatio} loading={article ? 'lazy' : 'eager'} />
          </span>
          <span className={styles.track} aria-hidden="true"><span className={styles.bar} style={{ width: `${row.valueUsdB / max * 100}%` }} /></span>
          <span className={styles.value}>{formatMarketCap(row.valueUsdB)}</span>
        </>;
        const label = `${row.rank}位 ${row.displayName} ${formatMarketCap(row.valueUsdB)}十億米ドル`;
        return <li key={row.id} className={styles.raceRow} data-visible={visible} data-reference={row.isReference || undefined} aria-hidden={!visible} inert={!visible}
          style={{ '--position': Math.min(index, visibleCount) } as CSSProperties}>
          {article ? <div className={`${styles.raceButton} ${styles.readonlyRow}`} data-highlighted={selectedId === row.id}>
            <span className={styles.srOnly}>{label}</span><span className={styles.rowArtwork} aria-hidden="true">{identity}</span>
          </div> : <button type="button" className={styles.raceButton} onClick={() => onSelect?.(row.id)} aria-pressed={selectedId === row.id} title={row.displayName}
            aria-controls="ranking-company-detail" aria-label={`${label}。詳細を見る`}>{identity}</button>}
        </li>;
      })}
    </ol>
    <p className={styles.small}>横軸も変動します。停止・年選択で表示年の確定値に戻ります。{article ? 'NVIDIAの追跡欄は常に年末の確定値です。' : '表・企業詳細は常に年末の確定値です。'}</p>
  </figure>;
}
