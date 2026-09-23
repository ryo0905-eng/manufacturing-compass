'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Controls';
import { trackRankingTimeMachineEvent } from '@/lib/analytics';
import { comparisonShareUrl, type RankingMode } from '@/lib/ranking-comparison';
import styles from './ranking-time-machine.module.css';

export function ComparisonShare({ mode, year, selectedId }: { mode: RankingMode; year: number; selectedId: string }) {
  const [result, setResult] = useState<{ url: string; copied: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function share() {
    setBusy(true);
    const url = comparisonShareUrl(window.location.origin, mode, year, selectedId);
    let copied = false;
    try { await navigator.clipboard.writeText(url); copied = true; } catch { /* Offer a selectable URL when clipboard access is unavailable. */ }
    trackRankingTimeMachineEvent('ranking_timemachine_share', { year, company: selectedId || undefined, comparison_mode: mode, result: copied ? 'copied' : 'url_shown' });
    if (mounted.current) { setResult({ url, copied }); setBusy(false); }
  }
  return <div className={styles.share}>
    <Button onClick={share} disabled={busy}>この比較を共有</Button>
    <p className={styles.small} role="status">{result?.copied ? '比較URLをコピーしました。' : result ? '下のURLを選択してコピーしてください。' : '表示年の確定値を共有します。'}</p>
    {result && !result.copied && <label className={styles.small}>共有URL<input type="text" readOnly value={result.url} onFocus={event => event.currentTarget.select()} /></label>}
  </div>;
}
