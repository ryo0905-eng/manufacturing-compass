'use client';

import { useEffect, useMemo, useReducer, useRef } from 'react';
import { rankingTimeMachineCompanies, rankingTimeMachineSnapshots, rankingTimeMachineMetadata as meta } from '@/data/ranking-time-machine';
import { formatMarketCap, initialTimeline, prepareRanking, rankingPlaybackInterval, reduceTimeline } from '@/lib/ranking-time-machine';
import { trackEvent } from '@/lib/analytics';
import { observeVisibleOnce } from '@/lib/observe-visible';
import { TrackedInternalLink } from '@/components/TrackedInternalLink';
import { HomeLink } from '@/components/HomeLink';
import { RankingRaceChart } from './RankingRaceChart';
import { TimelineControls } from './TimelineControls';
import styles from './ranking-time-machine.module.css';

const articleContext = {
  tool_id: 'ranking-time-machine', surface: 'article_inline', ui_version: 'inline-v1',
  source_slug: 'semiconductor-market-cap-ranking', placement: 'world_ranking_after_table',
  comparison_mode: 'semiconductor', company: 'nvidia', ranking_type: 'market_cap', data_kind: 'real',
} as const;

const homeContext = {
  tool_id: 'ranking-time-machine', surface: 'home_preview', ui_version: 'home-v1',
  source_page: '/', placement: 'home_rankings', comparison_mode: 'semiconductor',
  company: 'nvidia', ranking_type: 'market_cap', data_kind: 'real',
} as const;

export function RankingTimeMachinePreview({ variant = 'article' }: { variant?: 'article' | 'home' } = {}) {
  const home = variant === 'home';
  const context = home ? homeContext : articleContext;
  const visibleCount = home ? 5 : 10;
  const timeline = useMemo(() => prepareRanking(rankingTimeMachineCompanies, rankingTimeMachineSnapshots), []);
  const [state, dispatch] = useReducer((current: typeof initialTimeline, action: Parameters<typeof reduceTimeline>[1]) => reduceTimeline(current, action, timeline.length), initialTimeline);
  const { index, playing, animate } = state;
  const { year, rows } = timeline[index];
  const nvidia = rows.find(row => row.id === 'nvidia')!;
  const workspace = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const chart = useRef<HTMLDivElement>(null);
  const inViewport = useRef(true);
  const viewed = useRef(false);
  const firstInteractionIndex = useRef<number | null>(null);
  const resultViewed = useRef(false);

  function begin() {
    if (firstInteractionIndex.current !== null) return;
    firstInteractionIndex.current = index;
    trackEvent('tool_step', { ...context, step: 'start' });
  }

  useEffect(() => {
    if (!controls.current || viewed.current) return;
    return observeVisibleOnce(controls.current, () => {
      viewed.current = true;
      trackEvent('experience_view', context);
    });
  }, [context]);

  useEffect(() => {
    if (firstInteractionIndex.current === null || index === firstInteractionIndex.current || resultViewed.current || !chart.current) return;
    return observeVisibleOnce(chart.current, () => {
      resultViewed.current = true;
      trackEvent('tool_step', { ...context, step: 'result' });
    });
  }, [index, context]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) dispatch({ type: 'pause' }); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === workspace.current);
      if (!entry) return;
      inViewport.current = entry.isIntersecting;
      if (!entry.isIntersecting) dispatch({ type: 'pause' });
    });
    if (workspace.current) observer?.observe(workspace.current);
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: document.hidden || !inViewport.current ? 'pause' : 'tick' });
    }, rankingPlaybackInterval);
    return () => window.clearTimeout(timer);
  }, [playing, index]);

  const href = `/tools/ranking-time-machine#mode=semiconductor&year=${year}&company=nvidia` as const;
  return <div id={home ? 'home-ranking-time-machine' : 'ranking-time-machine-preview'} ref={workspace} className={styles.articlePreview}>
    <h3>{home ? 'NVIDIAの順位はどう変わった？' : 'NVIDIAの順位はどう変わった？ 2010年から動かして見る'}</h3>
    <p>{home ? '年を選ぶか再生して、時価総額の変化を見比べてみましょう。' : '再生すると年ごとの順位が変化します。年を選んで、NVIDIAと他社の時価総額を見比べてみましょう。'}</p>
    <p className={styles.small}>2010〜2025年の各年末 · 装置5社を含む選定20社内の比較。{home ? '現在の世界ランキングとは対象・時点が異なり' : '上の現在の世界TOP30とは対象が異なり'}、各年の世界順位を再現したものではありません。</p>
    <div ref={controls}>
      <TimelineControls years={timeline.map(item => item.year)} index={index} playing={playing}
        idPrefix={home ? 'ranking-home' : 'ranking-inline'} helpText="3秒ごとに1年進みます。年を選ぶか、画面外・背景タブへ移ると停止します。"
        onPlay={() => { begin(); dispatch({ type: 'play' }); }}
        onPause={() => dispatch({ type: 'pause' })}
        onReset={() => { if (index !== 0) begin(); dispatch({ type: 'reset' }); }}
        onYear={next => { if (next !== index) begin(); dispatch({ type: 'year', index: next }); }}
        onYearCommit={() => {}} />
    </div>
    <div className={styles.inlineTracker} aria-label="NVIDIAの年末確定値">
      <strong>{year}年末のNVIDIA</strong>
      <span>選定20社内 {nvidia.rank}位 · {formatMarketCap(nvidia.valueUsdB)}十億米ドル</span>
      {nvidia.rank > visibleCount && <span>この年はチャートの上位{visibleCount}社圏外です。</span>}
    </div>
    <div ref={chart}>
      <RankingRaceChart rows={rows} year={year} selectedId="nvidia" animate={animate} variant={variant} />
    </div>
    <p className={styles.small}>出典：<a href={meta.sourceUrl}>{meta.sourceName}</a>の各社年末時価総額。データ確認日：<time dateTime={meta.checkedAt}>{meta.checkedAt}</time>。<a href="/tools/ranking-time-machine#ranking-scope">対象・集計方法と注意事項</a>。順位上昇だけで技術力や働きやすさは判断できません。</p>
    {home ? <HomeLink href={href} className="button ghost" section="rankings" destination="ranking-time-machine" purpose="industry">
      企業を選んで詳しく比べる →
    </HomeLink> : <TrackedInternalLink href={href} className="button ghost" eventName="ranking_timemachine_entry_click"
      eventProperties={{ ...context, placement: 'inline_open_full', destination: href, year }}>
      企業を選んで詳しく見る →
    </TrackedInternalLink>}
    <noscript><p>再生・年選択にはJavaScriptが必要です。2010年末のチャート・NVIDIAの順位・出典はそのまま読めます。</p></noscript>
  </div>;
}
