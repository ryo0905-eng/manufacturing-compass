'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { allocations, baseRates, datasetLabels, hypotheses, methodLabels, methods, products, reflections, stages, VERSION, SEED, type Method } from '@/data/correlation-causation';
import { type Filter } from '@/lib/correlation-causation/analysis';
import { createSession, transition, type Action } from '@/lib/correlation-causation/session';
import { trackEvent } from '@/lib/analytics';
import { CorrelationChart, SummaryTable } from './CorrelationChart';
import styles from './correlation.module.css';

export function CorrelationTool() {
  const [session, setSession] = useState(createSession);
  const current = useRef(session);
  const [hypothesis, setHypothesis] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [colored, setColored] = useState(false);
  const [method, setMethod] = useState<Method>('conventional');
  const [view, setView] = useState<Method>('conventional');
  const [answer, setAnswer] = useState<number | null>(null);
  const layered = useRef(false);
  const [notice, setNotice] = useState('仮説を一つ選んで体験を始めます。');
  function emit(event: string, properties: Record<string, string> = {}) {
    trackEvent(`correlation_${event}`, { version: VERSION, ...properties });
  }
  function dispatch(action: Action) {
    const previous = current.current;
    const next = transition(previous, action);
    if (next === previous) return;
    current.current = next;
    setSession(next);
    if (next.error) { setNotice(next.error); return; }
    if (action.type === 'start') { emit('started'); setNotice('仮説を保持しました。製品別に分けてみましょう。'); }
    if (action.type === 'navigate') setNotice(`${next.stage + 1} / 5：${stages[next.stage]}`);
    if (action.type === 'experiment') {
      emit('experiment_completed', { method: action.method });
      if (next.stage === 4) emit('comparison_completed');
      setView(action.method);
      setFilter('all'); setColored(true);
      setMethod(action.method === 'conventional' ? 'randomized' : 'conventional');
      setNotice(next.stage === 4 ? '両方の実験が完了しました。二つの結果を比較して振り返りましょう。' : '40ロットの実験が完了しました。もう一方の方法も試しましょう。');
    }
    if (action.type === 'reflect') { emit('reflected'); setNotice('振り返りを表示しました。初回の仮説と比べてみましょう。'); }
  }
  function recordLayer() {
    if (!layered.current) { layered.current = true; emit('stratified'); }
  }
  function reset() {
    const next = createSession(); current.current = next; setSession(next);
    setHypothesis(null); setFilter('all'); setColored(false); setMethod('conventional'); setView('conventional'); setAnswer(null); layered.current = false;
    setNotice('同じ教材データで最初から体験できます。'); emit('retried');
  }
  const observations = session.stage <= 2 ? session.observation : session.experiments[view] ?? session.observation;
  const label = session.stage <= 2 ? datasetLabels.observation : session.experiments[view] ? datasetLabels[view] : datasetLabels.observation;
  const activeFilter = session.stage === 0 ? 'all' : filter;
  const activeColored = session.stage === 0 ? false : colored;
  return <section className={styles.experience} aria-label="相関と因果ラボ">
    <div className={styles.stageHeader}><div><p className={styles.eyebrow}>相関と因果ラボ · 約5分</p><h2>その温度、本当に不良の原因？</h2></div><span>{session.stage + 1} / 5</span></div>
    <nav className={styles.steps} aria-label="体験の段階">{stages.map((stage, index) => <button type="button" key={stage} disabled={index > session.reached || !!session.error} aria-current={session.stage === index ? 'step' : undefined} onClick={() => dispatch({ type: 'navigate', stage: index })}>{index + 1}. {stage}</button>)}</nav>
    <p className={styles.notice} role="status">{notice}</p>
    {session.error ? <p role="alert" className={styles.error}>{session.error}</p> : <>
      <div className={styles.workspace}>
        <div className={styles.chartPanel}>
          <h3>{label}</h3>
          <CorrelationChart rows={observations} filter={activeFilter} colored={activeColored} label={label}/>
          <SummaryTable rows={observations} filter={activeFilter} composition={session.stage > 0} label={label}/>
          {session.stage > 0 && <div className={styles.controls}>
            <label className={styles.check}><input type="checkbox" checked={colored} onChange={event => { setColored(event.target.checked); if (event.target.checked) recordLayer(); }}/>製品別に色分け</label>
            <fieldset><legend>表示する製品</legend><div className={styles.buttons}>{(['all', 'A', 'B'] as const).map(value => <button type="button" aria-pressed={filter === value} key={value} onClick={() => { setFilter(value); if (value !== 'all') { setColored(true); recordLayer(); } }}>{value === 'all' ? '全体' : `製品${value}`}</button>)}</div></fieldset>
          </div>}
          {session.stage === 4 && <fieldset className={styles.controls}><legend>散布図で見る実験</legend><div className={styles.buttons}>{methods.map(value => <button type="button" key={value} aria-pressed={view === value} onClick={() => setView(value)}>{methodLabels[value]}</button>)}</div></fieldset>}
          {session.stage > 0 && <details className={styles.details}><summary>表示中のロットを表で読む</summary><div className={styles.tableScroll} tabIndex={0} role="region" aria-label="ロットデータ表"><table><thead><tr><th scope="col">実施順</th><th scope="col">製品</th><th scope="col">温度</th><th scope="col">不良率</th></tr></thead><tbody>{observations.filter(row => activeFilter === 'all' || row.product === activeFilter).map(row => <tr key={row.id}><td>{row.order}</td><td>{row.product}</td><td>{row.temperature}℃</td><td>{row.rate.toFixed(2)}%</td></tr>)}</tbody></table></div></details>}
        </div>
        <div className={styles.actionPanel}>
          <p className={styles.eyebrow}>STEP {session.stage + 1}</p><h3>{stages[session.stage]}</h3>
          {session.stage === 0 && <>
            <p>高温側で不良率が高く見えます。今の段階では、どう考えますか？ 仮説は採点しません。</p>
            {session.hypothesis === null ? <><fieldset><legend>最初の仮説</legend>{hypotheses.map((text, index) => <label className={styles.option} key={text}><input type="radio" name="correlation-hypothesis" checked={hypothesis === index} onChange={() => setHypothesis(index)}/><span>{text}</span></label>)}</fieldset><button className={styles.primary} type="button" disabled={hypothesis === null} onClick={() => { if (hypothesis !== null) dispatch({ type: 'start', hypothesis }); }}>仮説を持って始める</button></> : <><p>最初の仮説：{hypotheses[session.hypothesis]}</p><button type="button" onClick={() => dispatch({ type: 'navigate', stage: 1 })}>製品別の比較へ戻る</button></>}
          </>}
          {session.stage === 1 && <>
            <p>全体から製品A、製品Bへ表示を切り替えてみましょう。平均の差の符号は同じでしょうか？</p>
            <p>低温にはAが45・Bが5ロット、高温にはAが5・Bが45ロット。温度の違いと製品の違いが混ざっています。</p>
            <p className={styles.callout}>製品別に見ても、それだけでは原因の確定にはなりません。次は、比較するロットの割付を考えます。</p>
            <button className={styles.primary} type="button" onClick={() => dispatch({ type: 'navigate', stage: 2 })}>比較方法を考える</button>
          </>}
          {(session.stage === 2 || session.stage === 3) && <>
            <p>{session.stage === 2 ? '新しい40ロットを、どのように比較しますか？ 実行前に割付を確認してください。' : '結果を確認できました。まだ試していない方法で、新しい40ロットを比較しましょう。'}</p>
            <fieldset><legend>比較方法</legend>{methods.map(value => <label key={value} className={styles.option}><input type="radio" name="correlation-method" checked={method === value} disabled={!!session.experiments[value]} onChange={() => setMethod(value)}/><span>{methodLabels[value]}{session.experiments[value] ? '（実験済み）' : ''}</span></label>)}</fieldset>
            <table><caption>実行前の割付：{methodLabels[method]}</caption><thead><tr><th scope="col">製品</th><th scope="col">380℃</th><th scope="col">420℃</th></tr></thead><tbody>{products.map(product => <tr key={product}><th scope="row">{product}</th><td>{allocations[method][product][0]}ロット</td><td>{allocations[method][product][1]}ロット</td></tr>)}</tbody></table>
            <p className={styles.small}>{method === 'randomized' ? '各製品の20ロットを、低温10・高温10へ無作為に割り付け、実施順もランダム化します。' : '製品構成の偏りを残して比較します。実施順はランダム化しますが、製品ごとの温度の偏りは残ります。'}</p>
            <button type="button" className={styles.primary} disabled={!!session.experiments[method]} onClick={() => dispatch({ type: 'experiment', method })}>この方法で40ロットを実験する</button>
            {methods.every(value => session.experiments[value]) && <button type="button" onClick={() => dispatch({ type: 'navigate', stage: 4 })}>振り返りへ戻る</button>}
          </>}
          {session.stage === 4 && <>
            <p>両方の実験が揃いました。下の集計も比べてから、実工程で次に確かめる方法を選びましょう。</p>
            {session.reflection === null ? <><fieldset><legend>次に確かめるなら？</legend>{reflections.map((text, index) => <label key={text} className={styles.option}><input type="radio" name="correlation-reflection" checked={answer === index} onChange={() => setAnswer(index)}/><span>{text}</span></label>)}</fieldset><button type="button" className={styles.primary} disabled={answer === null} onClick={() => { if (answer !== null) dispatch({ type: 'reflect', answer }); }}>振り返りを見る</button></> : <div className={styles.callout}>
              <p>最初の仮説：<strong>{session.hypothesis === null ? '' : hypotheses[session.hypothesis]}</strong></p><p>今回選んだ確認方法：<strong>{reflections[session.reflection]}</strong></p>
              <p>{session.reflection === 1 ? '製品内で条件を揃え、無作為に割り付けて反復する方針を選びました。' : '全体平均や色分けだけでは、製品以外の違いが残ります。製品内で条件を揃え、無作為に割り付けて反復する比較を考えましょう。'}</p>
              <p>全体平均の逆転には、製品の構成比が関わっていました。仮説をどう見直すか、次にどの条件を揃えるかを言葉にしてみてください。</p>
              <p>この教材だけで実工程の原因は確定できません。装置・材料・時期、測定の信頼性と再現性も確認します。</p>
              <Link href="/tools/doe" onClick={() => emit('related_clicked', { destination: 'doe' })}>DOEで、比較する実験の組み方を学ぶ →</Link>
            </div>}
          </>}
        </div>
      </div>
      {session.stage === 4 && <section className={styles.results} aria-label="二つの比較方法の結果"><h3>比較方法で、全体平均はどう変わった？</h3><p>いずれも新規40ロット。最初の観察100ロットとは別のデータです。平均はロット単位の単純平均です。</p><div className={styles.comparison}>{methods.map(value => { const rows = session.experiments[value]; return rows ? <article key={value}><h4>{methodLabels[value]}</h4><SummaryTable rows={rows} label={methodLabels[value]}/><SummaryTable rows={rows} filter="A" composition={false} label={methodLabels[value]}/><SummaryTable rows={rows} filter="B" composition={false} label={methodLabels[value]}/></article> : null; })}</div><p>製品別ではどちらも高温側の不良率が低くなっています。全体の比較には、製品ごとの不良率と構成比の両方が反映されます。</p></section>}
      {session.reflection !== null && session.stage === 4 && <details className={styles.details}><summary>教材の答えと生成ルールを見る</summary>
        <p>架空ルールの基準不良率は、A：{baseRates.A[380]}% → {baseRates.A[420]}%、B：{baseRates.B[380]}% → {baseRates.B[420]}%（低温 → 高温）。どちらも高温で2パーセントポイント下がります。観測値には±0.8ポイント以内のノイズが加わるため、観測平均差は厳密な−2とは限りません。</p>
        <p>ノイズなしの観察全体平均は低温9.6%、高温20.4%。この逆転は構成比から作った教材です。製品と温度以外の工程要因はモデル化していません。無作為化の効果だけを独立に実測したものではありません。</p>
        <p>版：{VERSION} ／ 固定シード：{SEED}。観察・二つの実験、割付・実施順・応答に別の乱数列を使います。再挑戦は同じ値を再現し、独立した追試にはなりません。</p>
      </details>}
    </>}
    <div className={styles.footer}><p className={styles.small}>回答・データは保存しません。実験済みの方法を再実行して結果を選び直すことはありません。</p><button type="button" onClick={reset}>同じ教材で再挑戦</button></div>
  </section>;
}
