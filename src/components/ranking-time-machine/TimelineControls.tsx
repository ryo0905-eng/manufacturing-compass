'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/Controls';
import styles from './ranking-time-machine.module.css';

export function TimelineControls({ years, index, playing, onPlay, onPause, onReset, onYear, onYearCommit }: {
  years: readonly number[]; index: number; playing: boolean;
  onPlay: () => void; onPause: () => void; onReset: () => void;
  onYear: (index: number) => void; onYearCommit: (index: number) => void;
}) {
  const pending = useRef<number | null>(null);
  function commit() {
    if (pending.current === null) return;
    onYearCommit(pending.current);
    pending.current = null;
  }
  return <section className={styles.controls} aria-label="時間の操作">
    <div className={styles.controlHeading}>
      <p className={styles.year} aria-live="polite" aria-atomic="true"><strong>{years[index]}</strong><span>年末</span></p>
      <div className={styles.actions}>
        <Button variant="primary" onClick={playing ? onPause : onPlay}>{playing ? 'Ⅱ 一時停止' : index === years.length - 1 ? '▶ 最初から再生' : '▶ 再生'}</Button>
        <Button onClick={onReset}>最初に戻る</Button>
      </div>
    </div>
    <label htmlFor="ranking-year">年を選ぶ</label>
    <input id="ranking-year" type="range" min={0} max={years.length - 1} step={1} value={index}
      aria-valuetext={`${years[index]}年末`} aria-describedby="ranking-playback-help"
      onChange={event => { const next = Number(event.target.value); pending.current = next; onYear(next); }}
      onPointerUp={commit} onPointerCancel={commit} onKeyUp={commit} onBlur={commit} />
    <div className={styles.rangeEnds}><span>{years[0]}年</span><span>{years[years.length - 1]}年</span></div>
    <p id="ranking-playback-help" className={styles.small}>3秒ごとに1年進みます。年や企業を選ぶと停止します。</p>
  </section>;
}
