"use client";
import Link from 'next/link';
import { useRef, useState } from 'react';
import { actions, cases, changes, copy, deviations, related, sampleSizes, thresholds, VERSION, type Settings } from '@/data/improvement-confidence';
import { analyze } from '@/lib/improvement-confidence/statistics';
import { initialSession, transition, type Action } from '@/lib/improvement-confidence/session';
import { trackEvent } from '@/lib/analytics';
import { Result, format } from './Result';
import styles from './improvement.module.css';
export function ImprovementTool() {
  const [state, setState] = useState(initialSession);
  const current = useRef(state);
  const focusRef = useRef<HTMLDivElement>(null);
  function send(action: Action, focus = false) {
    // Reject stale handlers (including rapid double clicks) before mutating state or emitting events.
    if (current.current.revision !== state.revision) return;
    const outcome = transition(current.current, action);
    current.current = outcome.state;
    setState(outcome.state);
    for (const event of outcome.events) trackEvent(event.name, { version: VERSION, mode: event.mode, ...(event.case_id ? { case_id: event.case_id } : {}) });
    if (focus) focusRef.current?.focus();
  }
  const lesson = state.lessons[state.caseIndex];
  const n = lesson ? sampleSizes[lesson.sizeIndex] : 5;
  const observations = lesson ? { before: lesson.observations.before.slice(0, n), after: lesson.observations.after.slice(0, n) } : undefined;
  const result = observations && !state.error ? analyze(observations.before, observations.after) : undefined;
  const latest = state.runs[state.runs.length - 1];
  const allComplete = state.lessons.length === 3 && state.lessons.every(l => l.complete);
  function selectSetting(key: keyof Settings, value: string) {
    send({ type: 'setting', settings: { ...state.settings, [key]: Number(value) } });
  }
  return <div className={styles.tool}>
    {state.started && <nav className={styles.tabs} aria-label="学習の進み方">{cases.map((c, i) => <button key={c.id} type="button" disabled={i > 0 && !state.lessons[i - 1]?.complete} aria-current={state.mode === 'guided' && state.caseIndex === i ? 'step' : undefined} onClick={() => send({ type: 'case', index: i }, true)}>ケース{i + 1}{state.lessons[i]?.complete ? ' ✓' : ''}</button>)}<button type="button" disabled={!allComplete} aria-current={state.mode === 'free' ? 'step' : undefined} onClick={() => send({ type: 'free' }, true)}>自由実験</button></nav>}
    <div ref={focusRef} tabIndex={-1} className={styles.workspace}>
      {state.error ? <div role="alert"><h2>計算を停止しました</h2><p>{state.error}</p><p>直前までの履歴は保持しています。ページを再読み込みすると最初からやり直せます。</p></div> : !state.started ? <section><h2>まずは各条件5個から</h2><p>3ケースで測定を増やし、推定の幅を比べます。真の平均は振り返りで確認できます。</p><button className={styles.primary} type="button" onClick={() => send({ type: 'start' }, true)}>3ケースを体験する</button></section> : state.mode === 'guided' && lesson && result && observations ? <>
        <h2>ケース{state.caseIndex + 1}：各条件{n}個の測定</h2>
        <p>変更前と変更後を比べ、平均を目標100nmへ近づけたい工程です。実務上ほしい平均差は2nmとします。</p>
        <div className={styles.controls} aria-label="測定数">{sampleSizes.map((size, i) => <button type="button" key={size} disabled={i > lesson.maxSizeIndex + 1} aria-pressed={lesson.sizeIndex === i} onClick={() => send({ type: 'size', index: i })}>{i > lesson.maxSizeIndex ? `${size}個まで増やす` : `${size}個を見る`}</button>)}</div>
        <Result result={result} observations={observations} threshold={2} />
        {lesson.sizeIndex === 2 && !lesson.complete && <fieldset className={styles.choices}><legend>次に何を確認しますか？</legend>{actions.map(a => <label key={a.id}><input type="radio" name="improvement-action" checked={lesson.choice === a.id} onChange={() => send({ type: 'choose', choice: a.id })}/>{a.label}</label>)}<button className={styles.primary} type="button" disabled={!lesson.choice} onClick={() => send({ type: 'reflect' }, true)}>振り返る</button></fieldset>}
        {lesson.complete && <section className={styles.reflection}><h3>{cases[state.caseIndex].title}</h3><p>教材の真の平均：変更前108nm → 変更後{108 - cases[state.caseIndex].change}nm</p><p>{cases[state.caseIndex].lesson}</p><h4>選んだ行動の確認ポイント</h4><p>{actions.find(a => a.id === lesson.choice)?.feedback}</p>{state.caseIndex < 2 ? <button className={styles.primary} type="button" onClick={() => send({ type: 'case', index: state.caseIndex + 1 }, true)}>次のケースへ</button> : <><p>測定数を増やしても真の平均差は変わりません。一方、サンプルから求める平均差は揺れ、区間の幅も毎回必ず狭くなるわけではありません。</p><button className={styles.primary} type="button" onClick={() => send({ type: 'free' }, true)}>自由実験へ</button></>}</section>}
      </> : state.mode === 'free' ? <>
        <h2>自由実験：設定を決めて測る</h2><p>各実験は新しい独立サンプルです。設定を変えるだけでは、表示中の結果は変わりません。</p>
        <div className={styles.settings}>
          <label>真の変化量<select value={state.settings.change} onChange={e => selectSetting('change', e.target.value)}>{changes.map(v => <option key={v} value={v}>{v}nm</option>)}</select></label>
          <label>標準偏差（両条件）<select value={state.settings.sd} onChange={e => selectSetting('sd', e.target.value)}>{deviations.map(v => <option key={v} value={v}>{v}nm</option>)}</select></label>
          <label>各条件の測定数<select value={state.settings.n} onChange={e => selectSetting('n', e.target.value)}>{sampleSizes.map(v => <option key={v} value={v}>{v}個</option>)}</select></label>
          <label>ほしい改善幅<select value={state.settings.threshold} onChange={e => selectSetting('threshold', e.target.value)}>{thresholds.map(v => <option key={v} value={v}>{v}nm</option>)}</select></label>
        </div>
        <button className={styles.primary} type="button" disabled={state.runs.length >= 20} onClick={() => send({ type: 'run' })}>実験する</button>
        <p role="status">履歴 {state.runs.length} / 20回{latest ? `・表示中は実験${latest.number}` : '・まだ実験していません'}</p>
        {latest && <><p className={styles.snapshot}>実験{latest.number}の設定：真の変化量{latest.settings.change}nm ／ 標準偏差{latest.settings.sd}nm ／ 各{latest.settings.n}個 ／ ほしい幅{latest.settings.threshold}nm</p><Result result={latest.result} observations={latest.observations} threshold={latest.settings.threshold}/></>}
      </> : null}
    </div>
    {state.runs.length > 0 && <section><h3>すべての自由実験の履歴</h3><p>良い結果だけを残さず、測った結果をすべて見比べます。</p><ol className={styles.history} tabIndex={0} aria-label="自由実験の全履歴">{state.runs.map(run => <li key={run.number}><strong>実験{run.number}：平均差 {format(run.result.difference)}nm</strong><span>推定の幅 {format(run.result.lower)} ～ {format(run.result.upper)}nm</span><small>真の変化量{run.settings.change}nm ／ 標準偏差{run.settings.sd}nm ／ 各{run.settings.n}個 ／ ほしい幅{run.settings.threshold}nm</small></li>)}</ol>{state.runs.length === 20 && state.mode === 'free' && !state.error && <button type="button" onClick={() => send({ type: 'reset' }, true)}>全20回の履歴を消して再開する</button>}</section>}
    <p className={styles.note}>{copy.repeated}</p>
    {allComplete && <nav className={styles.related} aria-label="次に学ぶ">{related.map(item => <Link key={item.id} href={item.href} onClick={() => trackEvent('improvement_related_clicked', { version: VERSION, mode: state.mode, destination: item.id })}>{item.label} →</Link>)}</nav>}
  </div>;
}
