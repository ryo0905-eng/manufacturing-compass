'use client';

import { useRef, useState } from 'react';
import type { Route } from 'next';
import { TrackedInternalLink } from './TrackedInternalLink';
import { workstyleRoles, workstyleConditions, concernLevels, confirmationLabels, workstyleBasis, type WorkstyleRole, type WorkstyleCondition, type ConcernLevel } from '@/data/workstyle-check';
import { buildWorkstyleNote, emptyWorkstyleNote, getWorkstyleCards, getWorkstyleNextStep, updateWorkstyleSelection, type WorkstyleNote } from '@/lib/workstyle-check';
import { trackEvent } from '@/lib/analytics';
import styles from './CareerPrioritiesNote.module.css';

const uiVersion = 'conversation-v2';
const stepLabels = ['気になる仕事', '勤務条件', '最初の確認', '次の一歩'];

export function WorkstyleCheck() {
  const [step, setStep] = useState(0);
  const [note, setNote] = useState<WorkstyleNote>(emptyWorkstyleNote);
  const [primary, setPrimary] = useState<WorkstyleCondition | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const started = useRef(false);
  const completed = useRef(false);
  const reached = useRef(new Set<number>());
  const revision = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const cards = getWorkstyleCards(note);
  const nextStep = getWorkstyleNextStep(note, primary);
  const output = buildWorkstyleNote(note, primary);
  const selectedConditions = workstyleConditions.filter(condition => note.conditions[condition.id]);

  function start() {
    if (started.current) return;
    started.current = true;
    trackEvent('workstyle_check_start', { ui_version: uiVersion });
  }

  function edit(next: WorkstyleNote) {
    revision.current += 1;
    setNote(next);
    setCopyStatus('idle');
  }

  function navigate(next: number) {
    setStep(next);
    if (!reached.current.has(next)) {
      reached.current.add(next);
      if (next === 3 && !completed.current) {
        completed.current = true;
        trackEvent('workstyle_check_complete', { ui_version: uiVersion });
      }
    }
    requestAnimationFrame(() => heading.current?.focus());
  }

  function selectRoles(roles: WorkstyleRole[]) {
    start();
    edit(updateWorkstyleSelection(note, roles, note.conditions));
    if (completed.current) trackEvent('workstyle_check_compare', { changed: 'role', ui_version: uiVersion });
  }

  function toggleCondition(id: WorkstyleCondition) {
    start();
    const conditions = { ...note.conditions };
    if (conditions[id]) delete conditions[id];
    else if (Object.keys(conditions).length < 3) conditions[id] = 'learn';
    const next = updateWorkstyleSelection(note, note.roles, conditions);
    edit(next);
    if (!next.conditions[primary ?? id]) setPrimary(workstyleConditions.find(condition => next.conditions[condition.id])?.id ?? null);
    else if (!primary) setPrimary(id);
    if (completed.current) trackEvent('workstyle_check_compare', { changed: 'condition', ui_version: uiVersion });
  }

  function setConcern(level: ConcernLevel) {
    const id = nextStep.id;
    if (!id) return;
    edit(updateWorkstyleSelection(note, note.roles, { ...note.conditions, [id]: level }));
    if (completed.current) trackEvent('workstyle_check_compare', { changed: 'condition', ui_version: uiVersion });
  }

  async function copy() {
    const currentRevision = revision.current;
    try {
      await navigator.clipboard.writeText(output);
      if (revision.current === currentRevision) {
        setCopyStatus('success');
        trackEvent('workstyle_check_copy', { ui_version: uiVersion });
      }
    } catch {
      if (revision.current === currentRevision) setCopyStatus('error');
    }
  }

  const reply = step === 0
    ? note.roles.length ? '選んだ仕事について、気になる条件を一緒に整理します。' : '職種が未定でも、共通の確認質問から始められます。'
    : step === 1
      ? selectedConditions.length ? '気になる条件を' + selectedConditions.length + '件選びました。実際の条件は求人ごとに確かめましょう。' : '夜勤や出張など、まず知りたいことを選んでください。'
      : step === 2
        ? '「' + nextStep.label + '」を最初の確認テーマにします。' : '職種名だけで勤務条件は決まりません。求人ごとに確かめましょう。';

  return <div className={styles.workspace}>
    <div className={styles.progressLine} aria-label={'進み具合 ' + (step + 1) + '/4'}>
      <span>半導体の仕事・働き方</span><span>{step + 1} / 4</span>
      <div className={styles.progressTrack}><span style={{ width: ((step + 1) * 25) + '%' }} /></div>
    </div>
    {step > 0 && <nav className={styles.history} aria-label="前の回答を編集">
      {stepLabels.slice(0, step).map((label, index) => <button key={label} onClick={() => navigate(index)}><span>{label}</span><strong>{index === 0 ? note.roles.length ? note.roles.map(id => workstyleRoles.find(role => role.id === id)?.label).join('・') : '職種は未定' : index === 1 ? selectedConditions.length + '件の条件' : nextStep.label}</strong><small>編集</small></button>)}
    </nav>}
    <section className={styles.conversation} aria-labelledby="workstyle-question">
      <div className={styles.guideMark} aria-hidden="true">MC</div>
      <div className={styles.guideBody}>
        <p className={styles.guideName}>Manufacturing Compass ガイド</p>
        <h2 id="workstyle-question" ref={heading} tabIndex={-1}>{step === 0 ? 'どんな仕事が気になる？' : step === 1 ? '働き方で気になることは？' : step === 2 ? '何から確かめたい？' : '次の一歩が見えてきました'}</h2>
        <p className={styles.guideReply} aria-live="polite">{reply}</p>
      </div>
    </section>

    {step === 0 && <>
      <div className={styles.roleGrid}>{workstyleRoles.map(role => <button key={role.id} aria-pressed={note.roles.includes(role.id)} disabled={note.roles.length >= 2 && !note.roles.includes(role.id)} onClick={() => selectRoles(note.roles.includes(role.id) ? note.roles.filter(id => id !== role.id) : [...note.roles, role.id])}><strong>{role.label}</strong><small>{role.description}</small></button>)}</div>
      <button className={styles.quietButton} onClick={() => { start(); selectRoles([]); navigate(1); }}>まだ分からない →</button>
    </>}

    {step === 1 && <>
      <p className={styles.fieldHint}>最大3つ。職種を選ばなくても進めます。</p>
      <div className={styles.choiceGrid}>{workstyleConditions.map(condition => <button key={condition.id} aria-pressed={!!note.conditions[condition.id]} disabled={selectedConditions.length >= 3 && !note.conditions[condition.id]} onClick={() => toggleCondition(condition.id)}>{condition.label}</button>)}</div>
    </>}

    {step === 2 && <>
      <p className={styles.fieldHint}>最初に求人票で確かめたいものを一つ選んでください。</p>
      <div className={styles.choiceGrid}>{selectedConditions.map(condition => <button key={condition.id} aria-pressed={nextStep.id === condition.id} onClick={() => { revision.current += 1; setCopyStatus('idle'); setPrimary(condition.id); }}>{condition.label}</button>)}</div>
      <fieldset className={styles.flexQuestion}><legend>「{nextStep.label}」について、今の気持ちは？</legend><div className={styles.segmented}>{(Object.keys(concernLevels) as ConcernLevel[]).map(level => <button key={level} aria-pressed={nextStep.id ? note.conditions[nextStep.id] === level : false} onClick={() => setConcern(level)}>{concernLevels[level]}</button>)}</div></fieldset>
    </>}

    {step === 3 && <div className={styles.resultStack}>
      <section className={styles.nextCard} aria-labelledby="workstyle-next-title">
        <p className={styles.cardKicker}>NEXT STEP · 次に確かめること</p>
        <h3 id="workstyle-next-title">{nextStep.label}を、求人票と面談で確認する</h3>
        <p className={styles.checkTarget}>求人票で見る項目：{nextStep.posting}</p>
        <div className={styles.mainQuestions}>{nextStep.questions.map(card => <p key={card.id}><strong>{card.role}</strong>{card.question}</p>)}</div>
      </section>
      <section className={styles.summaryCard} aria-label="今の整理">
        <p className={styles.cardKicker}>YOUR NOTE · 気になる条件</p>
        <div className={styles.chips}>{selectedConditions.map(condition => <span key={condition.id}>{condition.label} · {concernLevels[note.conditions[condition.id]!]}</span>)}</div>
        <p>この質問は確認の提案です。実際の勤務条件や適性の判定ではありません。</p>
      </section>
      <button className={styles.primary} onClick={copy}>確認メモをコピー</button>
      <p className={styles.copyStatus} role="status">{copyStatus === 'success' ? 'コピーしました。求人名・確認日などは手元で追記してください。' : copyStatus === 'error' ? 'コピーできませんでした。下の詳細から文章を選択してください。' : ''}</p>
      <details className={styles.details}><summary>すべての質問と確認状況を見る</summary>
        <div className={styles.detailsBody}>
          <button className={styles.quietButton} onClick={() => edit({ ...note, confirmations: {} })}>確認状況を未確認に戻す</button>
          {cards.map(card => <div className={styles.detailQuestion} key={card.id}>
            <strong>{card.role} · {card.condition}</strong>
            <p>{card.question}</p>
            <label className={styles.inlineCheck}><input type="checkbox" checked={!note.excluded.includes(card.id)} onChange={() => edit({ ...note, excluded: note.excluded.includes(card.id) ? note.excluded.filter(id => id !== card.id) : [...note.excluded, card.id] })} />メモに含める</label>
            <div className={styles.segmented} role="group" aria-label={card.role + '・' + card.condition + 'の本人の確認状況'}>{(Object.keys(confirmationLabels) as Array<keyof typeof confirmationLabels>).map(status => <button key={status} aria-pressed={(note.confirmations[card.id] ?? 'unknown') === status} onClick={() => edit({ ...note, confirmations: { ...note.confirmations, [card.id]: status } })}>{confirmationLabels[status]}</button>)}</div>
          </div>)}
          <label>コピー用テキスト<textarea readOnly value={output} rows={12} onFocus={event => event.currentTarget.select()} /></label>
        </div>
      </details>
      <div className={styles.nextLinks}><p>仕事内容から調べる</p>
        {workstyleRoles.filter(role => note.roles.includes(role.id)).filter((role, index, all) => all.findIndex(other => other.href === role.href) === index).map(role => <TrackedInternalLink key={role.id} href={role.href as Route} eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'article', ui_version: uiVersion }}>{role.label}の記事 ↗</TrackedInternalLink>)}
        {!note.roles.length && <TrackedInternalLink href="/industry-map" eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'industry_map', ui_version: uiVersion }}>業界地図を見る ↗</TrackedInternalLink>}
        <TrackedInternalLink href="/career-consultation" eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'consultation', ui_version: uiVersion }}>質問を相談用に整理する ↗</TrackedInternalLink>
      </div>
    </div>}

    <nav className={styles.navigation} aria-label="会話を進める">
      {step > 0 && <button onClick={() => navigate(step - 1)}>戻って直す</button>}
      {step === 0 && <button className={styles.primary} onClick={() => navigate(1)}>次へ</button>}
      {step === 1 && <button className={styles.primary} disabled={!selectedConditions.length} onClick={() => navigate(2)}>次へ</button>}
      {step === 2 && <button className={styles.primary} onClick={() => navigate(3)}>次の一歩を見る</button>}
    </nav>
    <details className={styles.sourceDetails}><summary>質問の根拠と限界</summary>
      <p>質問は編集上の提案です。職種だけで夜勤・出張などの有無や頻度は分かりません。</p>
      <p>参考例：<a href={workstyleBasis.source.url} target="_blank" rel="noopener noreferrer">{workstyleBasis.source.title}</a>（確認日：{workstyleBasis.source.checkedAt}）。{workstyleBasis.source.scope}</p>
      <p>質問の更新日：{workstyleBasis.updatedAt}／次回確認予定：{workstyleBasis.nextReviewAt}</p>
    </details>
    <p className={styles.privacy}>回答は保存・送信されず、再読み込みで消えます。操作のみ匿名で計測します。</p>
  </div>;
}
