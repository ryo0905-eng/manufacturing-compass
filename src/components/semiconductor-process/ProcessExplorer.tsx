"use client";
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { journey, PROCESS_VERSION } from '@/data/semiconductor-process';
import { initialState, transition, type ProcessAction } from '@/lib/semiconductor-process/model';
import { trackEvent } from '@/lib/analytics';
import { CompletedStructure, JourneyDiagram, ProcessDiagram, Wafer } from './ProcessDiagram';
import { assemblyCopy, assemblySteps } from '@/data/semiconductor-assembly';
import { AssemblyDiagram } from './AssemblyDiagram';
import { experiences } from '@/data/semiconductor-experiences';
import { interconnectSteps } from '@/data/semiconductor-interconnect';
import { InterconnectDiagram } from './InterconnectDiagram';
import { TestingDiagram, TestingReadout } from './TestingDiagram';
import { waferPreparationSteps } from '@/data/semiconductor-wafer-preparation';
import { WaferPreparationDiagram } from './WaferPreparationDiagram';
import { tourStops, tourRecap } from '@/data/semiconductor-tour';
import { WorkRolePanel } from './WorkRolePanel';
import { workLessons, workNote, type WorkRoleId } from '@/data/semiconductor-work';
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
      trackEvent(event.name, { version: PROCESS_VERSION, experience_id: event.experience_id, ...(event.step_id ? { step_id: event.step_id } : {}), ...(event.question_id ? { question_id: event.question_id } : {}) });
    }
  }, []);
  function navigate(action: ProcessAction) {
    setQuestion(undefined);
    setWorkRole(undefined);
    setInside(false);
    setConnected(false);
    send(action);
    work.current?.focus({ preventScroll: true });
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
    if (work.current) observer?.observe(work.current);
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
  useEffect(() => {
    // Align once on view changes; playback and step changes must not move the page.
    if (state.view !== 'overview') work.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [state.view, state.experience]);
  const [inside, setInside] = useState(false);
  const [connected, setConnected] = useState(false);
  const [workRole, setWorkRole] = useState<WorkRoleId | undefined>();
  const viewedWork = useRef(new Set<string>());
  const workLesson = workLessons[state.experience];
  function selectWork(id: WorkRoleId) {
    if (!workLesson?.roles.some(role => role.id === id)) return;
    setWorkRole(id);
    const key = `${workLesson.experience}:${id}`;
    if (viewedWork.current.has(key)) return;
    viewedWork.current.add(key);
    trackEvent('semiconductor_process_work_opened', { version: workLesson.version, experience_id: workLesson.experience, role_id: id });
  }
  const selectedWork = workLesson?.roles.find(role => role.id === workRole);
  const waferPreparation = state.experience==='wafer-preparation';
  const testing = state.experience==='wafer-test'||state.experience==='final-test' ? state.experience : undefined;
  const assembly = state.experience === 'assembly';
  const interconnect = state.experience === 'interconnect';
  const experience = experiences[state.experience];
  const { steps: processSteps, questions } = experience;
  const step = processSteps[state.step], overview = journey[state.overview];
  const linkClick = (destination: string) => trackEvent('semiconductor_process_related_clicked', { version: PROCESS_VERSION, experience_id: state.experience, destination });
  const tourIndex = tourStops.findIndex(item => item.id === state.experience);
  const confirmed = tourStops.filter(item => state.history[item.id].completed.length === experiences[item.id].steps.length).length;
  return <div ref={root} className={styles.explorer}>
    {!state.tour && state.view === 'overview' && <section className={styles.tourEntry} aria-label="見方を選ぶ"><p className={styles.eyebrow}>おすすめ見学コース</p><h2>丸い板から、一つの製品になるまで。</h2><p>6つの体験を順番に巡ります。各約3〜5分。途中で好きな体験に移ることもできます。</p><div className={styles.transport}><button type="button" className={styles.primary} onClick={()=>navigate({type:'tour-start'})}>順番に見る →</button><button type="button" onClick={()=>{navigate({type:'free'});work.current?.scrollIntoView({block:'start',behavior:'instant'});}}>気になる工程を選ぶ</button></div><p className={styles.small}>各体験は別の模式例です。確認状況はこのページを開いている間だけ保持します。</p></section>}
    {!state.tour && state.view !== 'process' && <nav className={styles.journey} aria-label="完成までの6地点">{journey.map((item, i) => <button type="button" key={item.id} aria-current={state.view === 'overview' && state.overview === i ? 'step' : undefined} onClick={() => navigate({ type: 'overview', index: i })}><span>{String(i+1).padStart(2,'0')}</span>{item.label}{(i>=1)&&<small>体験する</small>}</button>)}</nav>}
    <div className={styles.work} ref={work} tabIndex={-1}>
      {(state.view==='tour-map'||state.view==='tour-summary') && <section aria-label="見学コース" className={styles.tourEntry}><p className={styles.eyebrow}>おすすめ見学コース · 確認済み {confirmed} / 6体験</p><h2>{state.view==='tour-summary'?'ウエハから製品まで、振り返ってみよう':'見学コースの全体図'}</h2><p>設計をもとに製造する流れを、6つの体験で見ていきます。各体験は別の簡略化した模式例です。同じウエハを完成まで加工する再現ではありません。</p>
        <ol className={styles.tourStops}>{tourStops.map((item,i)=>{const count=state.history[item.id].completed.length,total=experiences[item.id].steps.length;return <li key={item.id}><button type="button" aria-current={state.experience===item.id?'step':undefined} onClick={()=>navigate({type:'enter',experience:item.id})}><span>{i+1}. {item.label}</span><small>{state.experience===item.id?'現在地 · ':''}{count===total?'✓ 確認済み':count>0?`${count} / ${total}工程を確認`:state.history[item.id].started?'体験中':'未開始'}</small></button><p>{item.purpose}</p></li>;})}</ol>
        {state.view==='tour-summary'&&<><h3>{confirmed===6?'6体験の全工程を確認しました':'未確認の工程は、上の体験から見直せます'}</h3><div className={styles.tourRecap}>{tourRecap.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><p>「固定・接続・保護は何が違う？」「なぜ組立の前後で検査する？」自分の言葉で説明してみましょう。</p><nav className={styles.related} aria-label="見学の次へ"><Link href="/industry-map" onClick={()=>linkClick('industry-map')}>業界地図で企業の役割を見る →</Link><Link href={journey[2].guide} onClick={()=>linkClick('fabrication')}>製造工程を記事で読む →</Link></nav></>}
        <div className={styles.transport}><button type="button" onClick={()=>navigate({type:'enter',experience:state.experience})}>現在の体験を開く</button><button type="button" onClick={()=>navigate({type:'free'})}>自由に工程を選ぶ</button></div>
      </section>}
      {state.view==='overview' && <section className={styles.overview} aria-labelledby="process-overview-title">
        <JourneyDiagram index={state.overview}/><div><p className={styles.eyebrow}>全体像 / {state.overview+1} OF 6</p><h2 id="process-overview-title">{overview.title}</h2><p>{overview.body}</p>
        {state.overview===1 ? <button type="button" className={styles.primary} onClick={()=>navigate({type:'enter',experience:'wafer-preparation'})}>ウエハの準備を体験する</button> : (state.overview===3||state.overview===5) ? <button type="button" className={styles.primary} onClick={()=>navigate({type:'enter',experience:state.overview===3?'wafer-test':'final-test'})}>{state.overview===3?'ウエハ検査を体験する':'最終検査を体験する'}</button> : state.overview===4 ? <><h3>{assemblyCopy.heading}</h3><p>{assemblyCopy.intro}</p><button type="button" className={styles.primary} onClick={() => navigate({type:'enter',experience:'assembly'})}>組み立てを体験する</button></> : state.overview===2 ? <div className={styles.transport}><button type="button" className={styles.primary} onClick={() => navigate({type:'enter'})}>膜に形を作る</button><button type="button" onClick={() => navigate({type:'enter',experience:'interconnect'})}>配線をつくる</button></div> : <button type="button" onClick={() => navigate({type:'overview',index:state.overview===5?2:state.overview+1})}>{state.overview===5?'ウエハ上の加工に戻る':'次の地点を見る →'}</button>}
        <Link className={styles.articleLink} href={overview.guide} onClick={() => linkClick(overview.id)}>この地点を記事で詳しく読む →</Link></div>
      </section>}
      {state.view==='process' && <>
        <section className={styles.workspace} aria-label="加工体験">
        <div className={styles.processHeader}><div><p className={styles.eyebrow}>{state.tour?`見学 ${tourIndex+1}/6 · `:''}{experience.label} / {state.step+1} OF {processSteps.length}</p><h2>{step.verb}</h2><p>{step.term} <span>· {state.progress===1?step.after:step.before}</span></p></div><button type="button" onClick={() => navigate(state.tour?{type:'tour-map'}:{type:'overview',index:experience.overview})}>{state.tour?'コースの全体図':'全体像に戻る'}</button></div>
        <div className={styles.lab}>
          <aside className={styles.locator}><Wafer marked/><p>{experience.locator}</p><nav className={styles.steps} aria-label={`${testing?'検査':'加工'}の${processSteps.length}工程`}>{processSteps.map((s,i)=><button type="button" key={s.id} aria-current={state.step===i?'step':undefined} onClick={()=>navigate({type:'step',index:i})}><span>{i+1}</span>{s.term}{state.completed.includes(s.id)&&<small aria-label="確認済み">✓</small>}</button>)}</nav></aside>
          <div className={styles.stage}>
            {waferPreparation ? <WaferPreparationDiagram step={waferPreparationSteps[state.step].id} progress={state.progress}/> : testing ? <TestingDiagram mode={testing} step={state.step} progress={state.progress}/> : interconnect ? <InterconnectDiagram step={interconnectSteps[state.step].id} progress={state.progress} connected={connected}/> : assembly ? <AssemblyDiagram step={assemblySteps[state.step].id} progress={state.progress} inside={inside} highlight={question}/> : <ProcessDiagram step={state.step} progress={state.progress} highlight={question}/>}
            <div className={styles.transport}>
              <button type="button" className={styles.primary} onClick={()=>send({type:state.playing?'pause':'play'})}>{state.playing?'一時停止':state.progress>0&&state.progress<1?'再開':step.verb}</button>
              <button type="button" disabled={state.playing} onClick={()=>send({type:'replay'})}>{testing?'この検査をもう一度':'この加工をもう一度'}</button>
              {assembly && state.step>=5 && <><button type="button" aria-pressed={!inside} onClick={()=>setInside(false)}>外観</button><button type="button" aria-pressed={inside} onClick={()=>setInside(true)}>中を見る</button></>}
              {interconnect && state.step===6 && state.progress===1 && <button type="button" aria-pressed={connected} onClick={()=>setConnected(value=>!value)}>つながる部分を見る</button>}
            </div>
            <label className={styles.scrubber}>途中を確かめる <span>{Math.round(state.progress*100)}%</span><input type="range" min="0" max="100" step="1" value={Math.round(state.progress*100)} aria-valuetext={`教材の進行度 ${Math.round(state.progress*100)}パーセント`} onChange={e=>send({type:'scrub',progress:Number(e.target.value)/100})}/></label>
            <p className={styles.small}>教材アニメーションの進行度です。処理時間や加工量ではありません。{state.reduced?'動きを減らす設定のため、再生ボタンで加工後の静止図を表示します。':''}</p>
            <div className={styles.previousNext}><button type="button" disabled={state.step===0} onClick={()=>navigate({type:'step',index:state.step-1})}>← 前の工程</button>{state.step<processSteps.length-1?<button type="button" onClick={()=>navigate({type:'step',index:state.step+1,autoplay:true})}>次の工程 →</button>:<button type="button" className={styles.primary} disabled={!state.completed.includes(processSteps[processSteps.length-1].id)} onClick={()=>navigate({type:'summary'})}>{experience.summary.button}</button>}</div>
          </div>
        </div>
        </section>
        {testing&&<TestingReadout mode={testing} step={state.step} progress={state.progress}/>}
        <div className={styles.questions}>{questions.map(q=><div key={q.id}><button type="button" aria-expanded={question===q.id} aria-controls={`process-question-${q.id}`} onClick={()=>{const opening=question!==q.id;setQuestion(opening?q.id:undefined);if(opening)send({type:'question',id:q.id});}}>{q.title}<span aria-hidden="true">{question===q.id?'−':'＋'}</span></button>{question===q.id&&<p id={`process-question-${q.id}`}>{q.body}{q.id==='protected'&&state.step<4?'現像・エッチングの工程を開くと、窓と保護された場所を見比べられます。':''}</p>}</div>)}</div>
        <details className={styles.detail}><summary>この工程の補足と詳しい記事</summary><p>{step.explanation}</p><Link href={step.guide} onClick={()=>linkClick(step.id)}>{step.term}を記事で詳しく読む →</Link></details>
      </>}
      {state.view==='summary'&&<section className={styles.summary}>
        <p className={styles.eyebrow}>{experience.summary.eyebrow}</p><h2>{experience.summary.title}</h2>
        {waferPreparation ? <WaferPreparationDiagram step="wafer-clean-check" progress={1}/> : testing ? <><TestingDiagram mode={testing} step={3} progress={1}/><TestingReadout mode={testing} step={3} progress={1}/></> : interconnect ? <><InterconnectDiagram step="cap" progress={1} connected={connected}/><button type="button" aria-pressed={connected} onClick={()=>setConnected(value=>!value)}>つながる部分を見る</button></> : assembly ? <AssemblyDiagram step="trim-form" progress={1} inside/> : <CompletedStructure/>}
        {experience.summary.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
        {workLesson && <section className={styles.workRoles} aria-labelledby={`${workLesson.experience}-work-heading`}>
          <p className={styles.eyebrow}>ここで働く人</p><h3 id={`${workLesson.experience}-work-heading`}>この工程を支える仕事</h3>
          <p>{workLesson.intro}</p>
          <div className={styles.workChoices} role="group" aria-label="仕事の役割を選ぶ">{workLesson.roles.map(role => <button type="button" key={role.id} aria-pressed={workRole === role.id} aria-controls={selectedWork ? `${workLesson.experience}-work-panel` : undefined} onClick={()=>selectWork(role.id)}>{role.label}</button>)}</div>
          {selectedWork && <WorkRolePanel experience={workLesson.experience} role={selectedWork} onRelated={()=>trackEvent('semiconductor_process_work_related_clicked', { version: workLesson.version, experience_id: workLesson.experience, role_id: selectedWork.id, destination: selectedWork.id })}/>}
          <p className={styles.small}>{workNote}</p>
        </section>}
        {state.tour ? <div className={styles.tourEntry}><p>{tourIndex<5?`次は「${tourStops[tourIndex+1].label}」。${tourStops[tourIndex+1].purpose}`:'6つの体験を、ひとつの流れとして振り返ります。'}</p><p className={styles.small}>この体験の確認済み：{state.completed.length} / {processSteps.length}工程。未確認の工程は後から見直せます。</p><button type="button" className={styles.primary} onClick={()=>navigate({type:'tour-next',from:state.experience})}>{tourIndex<5?'次の体験へ →':'見学コースを振り返る →'}</button><button type="button" onClick={()=>navigate({type:'tour-map'})}>コースの全体図</button></div> : <>
        {waferPreparation&&<button type="button" className={styles.primary} onClick={()=>navigate({type:'enter',experience:'thin-film'})}>続けて膜に形を作る →</button>}
        {state.experience==='thin-film'&&<button type="button" className={styles.primary} onClick={()=>navigate({type:'enter',experience:'interconnect'})}>続けて配線をつくる →</button>}
        {(state.experience==='assembly'||state.experience==='interconnect')&&<button type="button" className={styles.primary} onClick={()=>navigate({type:'enter',experience:assembly?'final-test':'wafer-test'})}>{assembly?'続けて最終検査を体験する →':'続けてウエハ検査を体験する →'}</button>}
        {testing&&<button type="button" className={styles.primary} onClick={()=>navigate({type:'enter',experience:testing==='wafer-test'?'final-test':'wafer-test'})}>{testing==='wafer-test'?'組立後の検査も見てみる →':'ウエハ上の検査も見てみる →'}</button>}
        <button type="button" onClick={()=>navigate({type:'overview',index:experience.nextOverview})}>{experience.summary.nextLabel}</button>
        </>}
        <button type="button" onClick={()=>navigate({type:'enter',experience:state.experience})}>{experience.summary.restart}</button>
        <nav className={styles.related} aria-label="理解を深める">{experience.related.map(item=><Link href={item.href} key={item.id} onClick={()=>linkClick(item.id)}>{item.label} →</Link>)}</nav>
      </section>}
    </div>
    <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{state.announcement}</p>
    <p className={styles.footnote}>配線形成もウエハ上の加工に含まれます。前工程・後工程の区分や検査の位置は、製品・パッケージによって異なります。</p>
    <details className={styles.detail}><summary>この図で省略・簡略化していること</summary><p>{experience.limits}</p></details>
  </div>;
}
