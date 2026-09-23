'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Button } from '@/components/ui/Controls';
import { TrackedInternalLink } from '@/components/TrackedInternalLink';
import type { RankingCompany, RankingSnapshot } from '@/data/ranking-time-machine';
import { trackEvent, trackRankingTimeMachineEvent } from '@/lib/analytics';
import { observeVisibleOnce } from '@/lib/observe-visible';
import { rankingPlaybackInterval } from '@/lib/ranking-time-machine';
import { createComparisonTimelines, initialComparison, rankingModeIds, rankingModes, readComparisonHash, reduceComparison, type RankingMode } from '@/lib/ranking-comparison';
import { RankingRaceChart } from './RankingRaceChart';
import { TimelineControls } from './TimelineControls';
import { RankingTable } from './RankingTable';
import { CompanyDetail } from './CompanyDetail';
import { CompanyTracker } from './CompanyTracker';
import { ComparisonShare } from './ComparisonShare';
import styles from './ranking-time-machine.module.css';

const relatedLinks = [
  { href: '/guides/japan-semiconductor-market-cap-history', label: '日本企業10社の時価総額推移を読む' },
  { href: '/guides/nvidia-intel-market-cap-history', label: 'NVIDIAとIntelの時価総額推移を読む' },
  { href: '/guides/semiconductor-market-cap-ranking', label: '基準日時点の時価総額ランキング' },
  { href: '/guides/semiconductor-equipment-sales-ranking', label: '装置メーカーの売上高ランキング' },
  { href: '/industry-map', label: '半導体業界地図' },
  { href: '/semiconductor-map', label: '日本の半導体工場・拠点マップ' },
  { href: '/compare', label: '企業を比較する' },
] as const;

export function RankingTimeMachine({ companies, snapshots }: { companies: readonly RankingCompany[]; snapshots: readonly RankingSnapshot[] }) {
  const comparisons = useMemo(() => createComparisonTimelines(companies, snapshots), [companies, snapshots]);
  const [state, dispatch] = useReducer(reduceComparison, initialComparison);
  const { mode, index, playing, selectedId, animate, notice } = state;
  const { timeline } = comparisons[mode];
  const config = rankingModes[mode];
  const { year, rows } = timeline[index];
  const controls = useRef<HTMLDivElement>(null);
  const chart = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  const started = useRef(false);
  const resultViewed = useRef(false);
  const [initialInteraction, setInitialInteraction] = useState<string | null>(null);
  const snapshot = `${mode}:${index}:${selectedId}`;

  function begin() {
    if (started.current) return;
    started.current = true;
    setInitialInteraction(snapshot);
    trackEvent('tool_step', { tool_id: 'ranking-time-machine', step: 'start', ui_version: 'mobile-v2', comparison_mode: mode });
  }

  useEffect(() => {
    if (!controls.current || viewed.current) return;
    return observeVisibleOnce(controls.current, () => {
      viewed.current = true;
      trackEvent('experience_view', { tool_id: 'ranking-time-machine', surface: 'tool', ui_version: 'mobile-v2' });
    });
  }, []);

  useEffect(() => {
    // A restored URL or an unchanged initial chart is not an operated result.
    if (initialInteraction === null || snapshot === initialInteraction || resultViewed.current || !chart.current) return;
    return observeVisibleOnce(chart.current, () => {
      resultViewed.current = true;
      trackEvent('tool_step', { tool_id: 'ranking-time-machine', step: 'result', ui_version: 'mobile-v2', comparison_mode: mode });
    });
  }, [initialInteraction, snapshot, mode]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: document.hidden ? 'pause' : 'tick' });
    }, rankingPlaybackInterval);
    return () => window.clearTimeout(timer);
  }, [playing, index, mode]);

  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) dispatch({ type: 'pause' }); };
    document.addEventListener('visibilitychange', stopWhenHidden);
    return () => document.removeEventListener('visibilitychange', stopWhenHidden);
  }, []);

  useEffect(() => {
    const restore = () => { const action = readComparisonHash(window.location.hash); if (action) dispatch(action); };
    restore();
    window.addEventListener('hashchange', restore);
    return () => window.removeEventListener('hashchange', restore);
  }, []);

  function selectCompany(id: string) {
    if (id && id !== selectedId) begin();
    dispatch({ type: 'company', id });
    if (id) trackRankingTimeMachineEvent('ranking_timemachine_company_click', { year, company: id, comparison_mode: mode });
  }
  function changeMode(nextMode: RankingMode) {
    if (nextMode === mode) return;
    begin();
    const next = reduceComparison(state, { type: 'mode', mode: nextMode });
    dispatch({ type: 'mode', mode: nextMode });
    trackRankingTimeMachineEvent('ranking_timemachine_mode_change', { previous_mode: mode, comparison_mode: nextMode, year: rankingModes[nextMode].firstYear + next.index });
  }

  return <div className={styles.workspace}>
    <div className={styles.modeChoices} role="group" aria-label="比較対象を切り替える">
      {rankingModeIds.map(item => <Button key={item} aria-pressed={mode === item} onClick={() => changeMode(item)}>{rankingModes[item].label}</Button>)}
    </div>
    <p className={styles.small}>{config.firstYear}〜{config.lastYear}年 · {config.scope} · 企業全体の時価総額<br />世界全体の上位企業を網羅したランキングではありません。<a href="#ranking-scope">対象・注意事項</a> / <a href="#ranking-sources">出典</a></p>
    {notice && <p className={styles.small} role="status">{notice}</p>}
    <div className={styles.stage}>
      <div ref={controls} className={styles.controlsContainer}>
      <TimelineControls key={mode} years={timeline.map(item => item.year)} index={index} playing={playing}
        onPlay={() => {
          begin();
          dispatch({ type: 'play' });
          trackRankingTimeMachineEvent('ranking_timemachine_play', { year: index === timeline.length - 1 ? timeline[0].year : year, comparison_mode: mode });
        }}
        onPause={() => { dispatch({ type: 'pause' }); trackRankingTimeMachineEvent('ranking_timemachine_pause', { year, comparison_mode: mode }); }}
        onReset={() => {
          if (index !== 0) begin();
          dispatch({ type: 'reset' });
          if (index !== 0) trackRankingTimeMachineEvent('ranking_timemachine_year_change', { year: timeline[0].year, interaction: 'reset', comparison_mode: mode });
        }}
        onYear={next => { if (next !== index) begin(); dispatch({ type: 'year', index: next }); }}
        onYearCommit={next => trackRankingTimeMachineEvent('ranking_timemachine_year_change', { year: timeline[next].year, interaction: 'slider', comparison_mode: mode })} />
      </div>
      <div ref={chart} className={styles.chartContainer}>
      <RankingRaceChart key={mode} rows={rows} year={year} selectedId={selectedId} animate={animate} onSelect={selectCompany} />
      </div>
      <div className={styles.exploration}>
        <CompanyTracker rows={rows} year={year} selectedId={selectedId} onSelect={selectCompany} />
        <ComparisonShare key={`${mode}:${year}:${selectedId}`} mode={mode} year={year} selectedId={selectedId} />
      </div>
    </div>
    <CompanyDetail companyId={selectedId} timeline={timeline} index={index} mode={mode} />
    <RankingTable rows={rows} year={year} selectedId={selectedId} onSelect={selectCompany} />
    <nav className={styles.panel} aria-label="関連する企業研究ページ"><h2>企業の規模から、事業と仕事へ</h2>
      <p>順位が気になったら、その企業が何を作り、業界でどんな役割を持つか調べてみましょう。</p>
      <div className={styles.links}>{relatedLinks.map(link => <TrackedInternalLink key={link.href} href={link.href} eventName="ranking_timemachine_related_click" eventProperties={{ year, comparison_mode: mode, ranking_type: 'market_cap', data_kind: 'real', destination: link.href }}>{link.label} →</TrackedInternalLink>)}</div>
    </nav>
  </div>;
}
