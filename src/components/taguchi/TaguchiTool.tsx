'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { text, stages, related } from '@/data/taguchi';
import { advance, createSession, type Command } from '@/lib/taguchi/session';
import { conditions, getCondition, levels, VERSION, type Level, type Observation } from '@/lib/taguchi/types';
import { trackEvent } from '@/lib/analytics';
import { EffectChart, TaguchiChart, type Series } from './TaguchiChart';
import styles from './taguchi.module.css';
const fmt = (v: number) => v.toFixed(2);
const label = (id: string) => { const c = getCondition(id); return `${c.temperature}℃・${c.pressure}Pa`; };
export function TaguchiTool() {
  const [session, setSession] = useState(createSession);
  const current = useRef(session);
  const [selected, setSelected] = useState('c1');
  const [noise, setNoise] = useState<Level>(0);
  const [message, setMessage] = useState('');
  const [reviewMode, setReviewMode] = useState<'confirmation' | 'stress'>('confirmation');
  const { stage, observations, baseline, candidate, analysis, result, error } = session;
  const c = getCondition(selected);
  const canSelect = (stage === 'baseline' || stage === 'compare') && !error;
  const comparison = stage === 'compare' || stage === 'review';
  const showConfirmation = stage === 'review' && reviewMode === 'confirmation';
  const rowsFor = (id: string, arm: 'baseline' | 'candidate'): Observation[] => observations.filter(o => o.conditionId === id && (showConfirmation ? o.phase === 'confirmation' && o.arm === arm : o.phase === (stage === 'ready' || stage === 'baseline' ? 'nominal' : 'stress')));
  const series: Series[] = [{ label: `${text.baseline} ${label(baseline ?? selected)}`, observations: rowsFor(baseline ?? selected, 'baseline') }];
  if (comparison) series.push({ label: `${text.candidate} ${label(candidate ?? selected)}`, observations: rowsFor(candidate ?? selected, 'candidate') });
  const baselineResult = analysis?.results.find(r => r.conditionId === baseline);
  const candidateResult = analysis?.results.find(r => r.conditionId === (candidate ?? selected));
  const emit = (event: string, properties: Record<string, string> = {}) => trackEvent(event, { version: VERSION, ...properties });
  function choose(id: string, source = 'manual') {
    if (!canSelect) return;
    getCondition(id); setSelected(id);
    if (stage === 'compare') emit('taguchi_candidate_selected', { source });
  }
  function run() {
    if (current.current !== session || error) return;
    let command: Command;
    if (stage === 'ready') command = { type: 'nominal' };
    else if (stage === 'baseline') command = { type: 'baseline', conditionId: selected };
    else if (stage === 'stress') command = { type: 'remaining' };
    else if (stage === 'compare') command = { type: 'confirm', conditionId: selected };
    else return;
    const next = advance(session, command); current.current = next; setSession(next);
    setMessage(next.error ? text.error : command.type === 'confirm' ? text.completed : `${next.observations.length - observations.length}回の実験が完了。${stages[next.stage].hint}`);
    emit(command.type === 'nominal' ? 'taguchi_started' : command.type === 'confirm' ? 'taguchi_confirmed' : 'taguchi_stress_completed', { stage: next.stage });
  }
  function reset() {
    const next = createSession(session.seed); current.current = next; setSession(next);
    setSelected('c1'); setNoise(0); setReviewMode('confirmation'); setMessage('最初の実験に戻りました。'); emit('taguchi_retried');
  }
  const buttonLabel = stage === 'ready' ? text.start : stage === 'baseline' ? text.lock : stage === 'stress' ? text.remaining : text.confirm;
  return <section className={styles.experience} aria-label="タグチメソッドの実験">
    <header className={styles.stage}><div><small>約5分・静特性のパラメータ設計</small><h2>{stages[stage].title}</h2></div><span>実験 <strong>{observations.length}</strong> / 81回</span></header>
    <p className={styles.hint}>{stages[stage].hint}</p>
    <div className={styles.workspace}>
      <div className={styles.chartPanel}>
        <h3>{text.quality}</h3>
        {stage === 'review' && <div className={styles.switches} role="group" aria-label="比較する実験"><button type="button" aria-pressed={reviewMode === 'confirmation'} onClick={() => setReviewMode('confirmation')}>新しい確認実験</button><button type="button" aria-pressed={reviewMode === 'stress'} onClick={() => setReviewMode('stress')}>探索時の実験</button></div>}
        <TaguchiChart series={error ? [] : series} noise={noise} />
        <div className={styles.noise}><label htmlFor="taguchi-noise">{text.noise}：<strong>{text.noiseLabels[noise + 1]}</strong></label><input id="taguchi-noise" type="range" min="-1" max="1" step="1" value={noise} disabled={stage === 'ready' || stage === 'baseline'} aria-valuetext={text.noiseLabels[noise + 1]} onChange={e => setNoise(Number(e.target.value) as Level)} /><div aria-hidden="true"><span>低い</span><span>基準</span><span>高い</span></div><p>{text.noiseHint}</p><p>{text.sliderHint}</p></div>
        <div className={styles.readouts}>{!error && series.map(s => {
          const rows = s.observations.filter(o => o.noise === noise);
          return <div key={s.label}><span>{s.label}</span><strong>{rows.length ? `${fmt(rows.reduce((sum, o) => sum + o.value, 0) / rows.length)}%` : text.noData}</strong><small>{text.noiseLabels[noise + 1]}での{rows.length > 1 ? `${rows.length}回の平均` : '観測値'}</small></div>;
        })}</div>
      </div>
      <div className={styles.controls}>
        <h3>{stage === 'baseline' ? '比較の基準を選ぶ' : comparison ? '強い条件を選ぶ' : '温度と圧力の9条件'}</h3>
        <fieldset disabled={!canSelect}><legend className={styles.srOnly}>制御因子</legend>
          {(['a', 'b'] as const).map(axis => <div className={styles.factor} key={axis}><span>{axis === 'a' ? '温度' : '圧力'}</span><div role="group" aria-label={axis === 'a' ? '温度の水準' : '圧力の水準'}>{levels.map(level => <button key={level} type="button" aria-pressed={c[axis] === level} onClick={() => choose(conditions.find(p => p[axis] === level && p[axis === 'a' ? 'b' : 'a'] === c[axis === 'a' ? 'b' : 'a'])!.id)}>{axis === 'a' ? `${400 + 40 * level}℃` : `${60 + 20 * level}Pa`}</button>)}</div></div>)}
        </fieldset>
        <p className={styles.small}>行：温度 360／400／440℃　列：圧力 40／60／80Pa</p>
        <div className={styles.grid} role="group" aria-label="9条件の配置">{conditions.map(point => {
          const nominal = observations.find(o => o.phase === 'nominal' && o.conditionId === point.id);
          const sn = analysis?.results.find(r => r.conditionId === point.id)?.sn;
          return <button key={point.id} type="button" disabled={!canSelect} aria-pressed={selected === point.id} aria-label={`${label(point.id)}${nominal ? `、通常環境 ${fmt(nominal.value)}%` : ''}${sn !== undefined ? `、SN比 ${fmt(sn)}dB` : ''}`} onClick={() => choose(point.id)}><span>{point.temperature} / {point.pressure}</span><strong>{sn !== undefined ? `${fmt(sn)} dB` : nominal ? `${fmt(nominal.value)}%` : '—'}</strong>{baseline === point.id && <small>基準</small>}</button>;
        })}</div>
        {analysis && baselineResult && candidateResult && <section className={styles.sn}><p>{text.snHint}</p><dl><div><dt>基準 SN比</dt><dd>{fmt(baselineResult.sn)} dB</dd></div><div><dt>候補 SN比</dt><dd>{fmt(candidateResult.sn)} dB</dd></div></dl>{stage === 'compare' && <button type="button" onClick={() => choose(analysis.best.conditionId, 'sn_max')}>{text.recommend}</button>}<small>探索時の6観測から計算。確認結果とは分けています。</small></section>}
        {baseline && <p className={styles.small}>固定した基準：{label(baseline)}</p>}
        {stage === 'compare' && selected === baseline && <p className={styles.small}>{text.same}</p>}
        {stage !== 'review' && <button className={styles.primary} type="button" disabled={error} onClick={e => { if (e.detail <= 1) run(); }}>{buttonLabel}</button>}
        <p role="status" aria-live="polite" aria-atomic="true" className={styles.message}>{message}</p>
        {error && <p role="alert" className={styles.error}>{text.error}</p>}
        {observations.length > 0 && <button className={styles.reset} type="button" onClick={reset}>{text.retry}</button>}
      </div>
    </div>
    {result && <section className={styles.result} aria-label="確認実験の結果"><h3>{text[result.outcome]}</h3><p>候補 − 基準のSN比：<strong>{result.delta >= 0 ? '+' : ''}{fmt(result.delta)} dB</strong></p><p className={styles.small}>±0.10 dB未満を教材上「差が小さい」と表示します。統計的な有意差・同等性の判定ではありません。</p>
      <div className={styles.scroll}><table><caption>新しい確認実験：各条件9観測</caption><thead><tr><th scope="col">条件</th><th scope="col">SN比 dB</th><th scope="col">平均 %</th><th scope="col">標準偏差 ポイント</th></tr></thead><tbody>{(['baseline', 'candidate'] as const).map(arm => <tr key={arm}><th scope="row">{text[arm]}</th><td>{fmt(result[arm].sn)}</td><td>{fmt(result[arm].mean)}</td><td>{fmt(result[arm].sd)}</td></tr>)}</tbody></table></div>
      <p>{text.sdLimit}</p><p>{text.resultLimit}</p><nav className={styles.related} aria-label="次に学ぶ内容">{related.map(link => <Link href={link.href} key={link.id} onClick={() => emit('taguchi_related_clicked', { destination: link.id })}>{link.title} →</Link>)}</nav>
    </section>}
    {analysis && <details className={styles.details}><summary>{text.mechanism}：{text.effects}</summary><p>各水準を含む3条件のSN比を平均します。個々の測定値を先にまとめたSN比とは異なります。</p><div className={styles.effects}><EffectChart axis="a" values={analysis.effects.a} /><EffectChart axis="b" values={analysis.effects.b} /></div><p>各因子の最高水準を組み合わせれば必ず最良になるとは限りません。確認実験と、条件ごとの実測も見ます。</p></details>}
    <details className={styles.details}><summary>{text.history}（{observations.length}回）</summary>
      {analysis && <div className={styles.scroll}><table><caption>誤差条件の比較：各条件6観測。通常環境9観測は含めません。</caption><thead><tr><th scope="col">条件</th><th scope="col">SN比 dB</th><th scope="col">平均 %</th><th scope="col">標準偏差 ポイント</th></tr></thead><tbody>{analysis.results.map(r => <tr key={r.conditionId}><th scope="row">{label(r.conditionId)}</th><td>{fmt(r.sn)}</td><td>{fmt(r.mean)}</td><td>{fmt(r.sd)}</td></tr>)}</tbody></table></div>}
      <p>{text.sdLimit}</p><div className={styles.scroll}><table><caption>全観測：通常環境9回＋誤差条件54回＋確認18回</caption><thead><tr><th scope="col">順</th><th scope="col">段階</th><th scope="col">条件</th><th scope="col">原料</th><th scope="col">反復</th><th scope="col">測定 %</th></tr></thead><tbody>{observations.map(o => <tr key={o.id}><th scope="row">{o.order}</th><td>{text[o.phase]}{o.arm !== 'design' ? `・${text[o.arm]}` : ''}</td><td>{label(o.conditionId)}</td><td>{text.noiseLabels[o.noise + 1]}</td><td>{o.replicate}</td><td>{o.value.toFixed(3)}</td></tr>)}</tbody></table></div>
    </details>
  </section>;
}
