"use client";
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { journey, processSteps, questions, processRelated, processCopy, PROCESS_VERSION } from '@/data/semiconductor-process';
import { initialState, transition, type ProcessAction } from '@/lib/semiconductor-process/model';
import { trackEvent } from '@/lib/analytics';
import { CompletedStructure, JourneyDiagram, ProcessDiagram, Wafer } from './ProcessDiagram';
import styles from './process.module.css';
export function ProcessExplorer() {
  const [state, setState] = useState(initialState);
  const latest = useRef(state);
  const root = useRef<HTMLDivElement>(null);
  const work = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState<string | undefined>();
  const send = useCallback((action: ProcessAction) => {
    const result = transition(latest.current, action);
    latest.current = result.state;
    setState(result.state);
    for (const event of result.events) {
      trackEvent(event.name, { version: PROCESS_VERSION, ...(event.step_id ? { step_id: event.step_id } : {}), ...(event.question_id ? { question_id: event.question_id } : {}) });
    }
  }, []);
  function navigate(action: ProcessAction) {
    setQuestion(undefined);
    send(action);
    work.current?.focus();
  }
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => send({ type: 'motion', reduced: media.matches });
    const pause = () => send({ type: 'pause' });
    const visibility = () => { if (document.hidden) pause(); };
    motion();
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', pause);
    const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(entries => {
      if (entries.some(entry => !entry.isIntersecting)) pause();
    });
    if (root.current) observer?.observe(root.current);
    return () => { media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', pause); observer?.disconnect(); };
  }, [send]);
  useEffect(() => {
    if (!state.playing) return;
    const token = state.token, startProgress = latest.current.progress;
    let handle = 0, startTime: number | undefined, cancelled = false;
    function tick(time: number) {
      if (cancelled || latest.current.token !== token || !latest.current.playing) return;
      if (startTime === undefined) startTime = time;
      send({ type: 'tick', token, progress: Math.min(1, startProgress + (time - startTime) / 2000) });
      if (latest.current.playing && latest.current.token === token) handle = requestAnimationFrame(tick);
    }
    handle = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(handle); };
  }, [state.playing, state.token, send]);
  const step = processSteps[state.step], overview = journey[state.overview];
  const linkClick = (destination: string) => trackEvent('semiconductor_process_related_clicked', { version: PROCESS_VERSION, destination });
  return <div ref={root} className={styles.explorer}>
    <nav className={styles.journey} aria-label="完成までの6地点">{journey.map((item, i) => <button type="button" key={item.id} aria-current={state.view === 'overview' && state.overview === i ? 'step' : undefined} onClick={() => navigate({ type: 'overview', index: i })}><span>{String(i+1).padStart(2,'0')}</span>{item.label}</button>)}</nav>
    <div className={styles.work} ref={work} tabIndex={-1}>
      {state.view==='overview' && <section className={styles.overview} aria-labelledby="process-overview-title">
        <JourneyDiagram index={state.overview}/><div><p className={styles.eyebrow}>全体像 / {state.overview+1} OF 6</p><h2 id="process-overview-title">{overview.title}</h2><p>{overview.body}</p>
        {state.overview===2 ? <button type="button" className={styles.primary} onClick={() => navigate({type:'enter'})}>一つの加工を拡大してみる <span aria-hidden="true">↗</span></button> : <button type="button" onClick={() => navigate({type:'overview',index:state.overview===5?2:state.overview+1})}>{state.overview===5?'ウエハ上の加工に戻る':'次の地点を見る →'}</button>}
        <Link className={styles.articleLink} href={overview.guide} onClick={() => linkClick(overview.id)}>この地点を記事で詳しく読む →</Link></div>
      </section>}
      {state.view==='process' && <>
        <div className={styles.processHeader}><div><p className={styles.eyebrow}>前工程の一例 / {state.step+1} OF 8</p><h2>{step.verb}</h2><p>{step.term} <span>· {state.progress===1?step.after:step.before}</span></p></div><button type="button" onClick={() => navigate({type:'overview',index:2})}>全体像に戻る</button></div>
        <div className={styles.lab}>
          <aside className={styles.locator}><Wafer marked/><p>ウエハの一部分の断面を見ています。実物を切断する操作ではありません。</p><nav className={styles.steps} aria-label="加工の8工程">{processSteps.map((s,i)=><button type="button" key={s.id} aria-current={state.step===i?'step':undefined} onClick={()=>navigate({type:'step',index:i})}><span>{i+1}</span>{s.term}{state.completed.includes(s.id)&&<small aria-label="確認済み">✓</small>}</button>)}</nav></aside>
          <div className={styles.stage}>
            <ProcessDiagram step={state.step} progress={state.progress} highlight={question}/>
            <div className={styles.transport}>
              <button type="button" className={styles.primary} onClick={()=>send({type:state.playing?'pause':'play'})}>{state.playing?'一時停止':state.progress>0&&state.progress<1?'再開':step.verb}</button>
              <button type="button" disabled={state.playing} onClick={()=>send({type:'replay'})}>この加工をもう一度</button>
            </div>
            <label className={styles.scrubber}>途中を確かめる <span>{Math.round(state.progress*100)}%</span><input type="range" min="0" max="100" step="1" value={Math.round(state.progress*100)} aria-valuetext={`教材の進行度 ${Math.round(state.progress*100)}パーセント`} onChange={e=>send({type:'scrub',progress:Number(e.target.value)/100})}/></label>
            <p className={styles.small}>教材アニメーションの進行度です。処理時間や加工量ではありません。{state.reduced?'動きを減らす設定のため、再生ボタンで加工後の静止図を表示します。':''}</p>
            <div className={styles.previousNext}><button type="button" disabled={state.step===0} onClick={()=>navigate({type:'step',index:state.step-1})}>← 前の工程</button>{state.step<7?<button type="button" onClick={()=>navigate({type:'step',index:state.step+1})}>次の工程 →</button>:<button type="button" className={styles.primary} disabled={!state.completed.includes('clean-after')} onClick={()=>navigate({type:'summary'})}>繰り返す意味と、その先へ →</button>}</div>
          </div>
        </div>
        <div className={styles.questions}>{questions.map(q=><div key={q.id}><button type="button" aria-expanded={question===q.id} aria-controls={`process-question-${q.id}`} onClick={()=>{const opening=question!==q.id;setQuestion(opening?q.id:undefined);if(opening)send({type:'question',id:q.id});}}>{q.title}<span aria-hidden="true">{question===q.id?'−':'＋'}</span></button>{question===q.id&&<p id={`process-question-${q.id}`}>{q.body}{q.id==='protected'&&state.step<4?'現像・エッチングの工程を開くと、窓と保護された場所を見比べられます。':''}</p>}</div>)}</div>
        <details className={styles.detail}><summary>この工程の補足と詳しい記事</summary><p>{step.explanation}</p><Link href={step.guide} onClick={()=>linkClick(step.id)}>{step.term}を記事で詳しく読む →</Link></details>
      </>}
      {state.view==='summary'&&<section className={styles.summary}><p className={styles.eyebrow}>この加工の先にあるもの</p><h2>同じことの繰り返しに見えても、作る場所と役割が違う。</h2><p>今見たのは「膜に形を作る一例」です。まだ電気的に動作するチップではありません。</p><CompletedStructure/><p className={styles.small}>別の完成構造の概念図です。直前の加工例がこの構造へ直接変わる様子ではありません。</p><p>実際には、場所・材料・目的を変え、熱処理なども含む多様な加工を重ねて素子と配線を作ります。この8工程だけを繰り返せば完成する、という意味ではありません。</p><h3>ウエハの加工が終わっても、まだ続く。</h3><p>電気的な検査、切り分け、外部との接続・保護、最終検査を経て製品になります。</p><button type="button" className={styles.primary} onClick={()=>navigate({type:'overview',index:3})}>全体図で、その先を見る →</button><button type="button" onClick={()=>navigate({type:'step',index:0})}>加工を最初から見直す</button><nav className={styles.related} aria-label="理解を深める">{processRelated.map(item=><Link href={item.href} key={item.id} onClick={()=>linkClick(item.id)}>{item.label} →</Link>)}</nav></section>}
    </div>
    <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{state.announcement}</p>
    <p className={styles.footnote}>配線形成もウエハ上の加工に含まれます。前工程・後工程の区分や検査の位置は、製品・パッケージによって異なります。</p>
    <details className={styles.detail}><summary>この図で省略・簡略化していること</summary><p>{processCopy.limits}</p></details>
  </div>;
}
