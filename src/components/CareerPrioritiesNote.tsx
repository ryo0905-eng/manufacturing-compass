'use client';

import { useEffect, useRef, useState } from 'react';
import { TrackedInternalLink } from '@/components/TrackedInternalLink';
import { priorityGroups, priorityItems, flexibilityLabels, type PriorityId, type Flexibility, type Intent } from '@/data/career-priorities';
import { buildPriorityNote, emptyPriorityNote, getPriorityNextStep, setChoice, type PriorityNote } from '@/lib/career-priorities';
import { trackEvent } from '@/lib/analytics';
import styles from './CareerPrioritiesNote.module.css';

type GroupId = typeof priorityGroups[number]['id'];
const uiVersion = 'conversation-v2';
const stepLabels = ['気になる分野', '具体的な希望', '大切なこと', '次の一歩'];

export function CareerPrioritiesNote({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  const [groups, setGroups] = useState<GroupId[]>([]);
  const [note, setNote] = useState<PriorityNote>(emptyPriorityNote);
  const [unknown, setUnknown] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const reached = useRef(new Set<number>());
  const revision = useRef(0);
  const selected = priorityItems.filter(item => note.choices[item.id]);
  const primary = note.priorities.find(id => note.choices[id]);
  const nextStep = getPriorityNextStep(note);
  const output = buildPriorityNote(note);

  useEffect(() => {
    if (active && !reached.current.has(0)) {
      reached.current.add(0);
      trackEvent('career_priorities_step', { step_number: 1, ui_version: uiVersion });
    }
  }, [active]);

  function start() {
    if (started.current) return;
    started.current = true;
    trackEvent('career_priorities_start', { ui_version: uiVersion });
  }

  function changeNote(next: PriorityNote) {
    revision.current += 1;
    setNote(next);
    setCopyStatus('idle');
  }

  function navigate(next: number) {
    setStep(next);
    if (!reached.current.has(next)) {
      reached.current.add(next);
      trackEvent('career_priorities_step', { step_number: next + 1, ui_version: uiVersion });
      if (next === 3) trackEvent('career_priorities_complete', { ui_version: uiVersion });
    }
    requestAnimationFrame(() => heading.current?.focus());
  }

  function toggleGroup(id: GroupId) {
    start();
    setUnknown(false);
    if (groups.includes(id)) {
      const group = priorityGroups.find(candidate => candidate.id === id);
      let next = note;
      for (const item of group?.items ?? []) {
        const intent = next.choices[item.id];
        if (intent) next = setChoice(next, item.id, intent);
      }
      changeNote(next);
      setGroups(current => current.filter(value => value !== id));
    } else if (groups.length < 2) {
      setGroups(current => [...current, id]);
    }
  }

  function toggleItem(id: PriorityId) {
    start();
    const intent = note.choices[id];
    if (!intent && selected.length >= 3) return;
    const next = setChoice(note, id, intent ?? 'change');
    changeNote({ ...next, questions: next.choices[id] ? [...next.questions, id] : next.questions });
  }

  function chooseIntent(id: PriorityId, intent: Intent) {
    if (note.choices[id] === intent) return;
    changeNote(setChoice(note, id, intent));
  }

  function choosePrimary(id: PriorityId) {
    changeNote({ ...note, priorities: [id], flexibility: { [id]: note.flexibility[id] ?? 'unsure' }, unordered: false });
  }

  function chooseUnknown() {
    start();
    setUnknown(true);
    setGroups([]);
    changeNote(emptyPriorityNote);
    navigate(3);
  }

  async function copy() {
    const currentRevision = revision.current;
    try {
      await navigator.clipboard.writeText(output);
      if (revision.current === currentRevision) {
        setCopyStatus('success');
        trackEvent('career_priorities_copy', { ui_version: uiVersion });
      }
    } catch {
      if (revision.current === currentRevision) setCopyStatus('error');
    }
  }

  const reply = step === 0
    ? groups.length ? 'まずは「' + groups.map(id => priorityGroups.find(group => group.id === id)?.label).join('」と「') + '」から考えてみましょう。' : '選ぶのは最大2分野。まだ決まっていなくても進めます。'
    : step === 1
      ? selected.length ? '気になる希望を' + selected.length + '件選びました。あとから変えられます。' : '今の気持ちに近いものを、最大3つ選んでください。'
      : step === 2
        ? primary ? '「' + priorityItems.find(item => item.id === primary)?.label + '」を最初に確かめる軸にします。' : 'いちばん先に確かめたいことを一つ選びましょう。'
        : '答えは仮の整理です。求人を見ながら変えて大丈夫です。';

  return <div className={styles.workspace}>
    <div className={styles.progressLine} aria-label={'進み具合 ' + (step + 1) + '/4'}>
      <span>転職全体の軸</span><span>{step + 1} / 4</span>
      <div className={styles.progressTrack}><span style={{ width: ((step + 1) * 25) + '%' }} /></div>
    </div>
    {step > 0 && <nav className={styles.history} aria-label="前の回答を編集">
      {stepLabels.slice(0, unknown && step === 3 ? 1 : step).map((label, index) => <button key={label} onClick={() => navigate(index)}><span>{label}</span><strong>{index === 0 ? groups.length ? groups.map(id => priorityGroups.find(group => group.id === id)?.label).join('・') : '未定' : index === 1 ? selected.length ? selected.length + '件の希望' : '未定' : primary ? priorityItems.find(item => item.id === primary)?.label : '未定'}</strong><small>編集</small></button>)}
    </nav>}
    <section className={styles.conversation} aria-labelledby="priority-question">
      <div className={styles.guideMark} aria-hidden="true">MC</div>
      <div className={styles.guideBody}>
        <p className={styles.guideName}>Manufacturing Compass ガイド</p>
        <h2 id="priority-question" ref={heading} tabIndex={-1}>{step === 0 ? '次の仕事で、何が気になる？' : step === 1 ? '具体的には、どんな希望？' : step === 2 ? 'まず何を確かめたい？' : '次の一歩が見えてきました'}</h2>
        <p className={styles.guideReply} aria-live="polite">{reply}</p>
      </div>
    </section>

    {step === 0 && <>
      <div className={styles.choiceGrid}>
        {priorityGroups.map(group => <button key={group.id} aria-pressed={groups.includes(group.id)} disabled={groups.length >= 2 && !groups.includes(group.id)} onClick={() => toggleGroup(group.id)}><span>{group.label}</span><small>{group.items.length}つの視点</small></button>)}
      </div>
      <button className={styles.quietButton} onClick={chooseUnknown}>まだ具体的には分からない →</button>
    </>}

    {step === 1 && <>
      <p className={styles.fieldHint}>選んだ分野から、今の気持ちに近いものを最大3つ。</p>
      <div className={styles.itemGroups}>{priorityGroups.filter(group => groups.includes(group.id)).map(group => <fieldset key={group.id}><legend>{group.label}</legend><div className={styles.choiceGrid}>{group.items.map(item => <button key={item.id} aria-pressed={!!note.choices[item.id]} disabled={selected.length >= 3 && !note.choices[item.id]} onClick={() => toggleItem(item.id)}>{item.label}</button>)}</div></fieldset>)}</div>
      <button className={styles.quietButton} onClick={chooseUnknown}>まだ決められない →</button>
    </>}

    {step === 2 && <>
      <p className={styles.fieldHint}>それぞれ「変えたい」「残したい」を選び、最初に確かめたいものを一つ決めます。</p>
      <div className={styles.intentList}>{selected.map(item => <div className={styles.intentCard} key={item.id}>
        <strong>{item.label}</strong>
        <div className={styles.segmented} role="group" aria-label={item.label + 'について'}>
          <button aria-pressed={note.choices[item.id] === 'change'} onClick={() => chooseIntent(item.id, 'change')}>変えたい</button>
          <button aria-pressed={note.choices[item.id] === 'keep'} onClick={() => chooseIntent(item.id, 'keep')}>残したい</button>
        </div>
        <button className={styles.pickPrimary} aria-pressed={primary === item.id} onClick={() => choosePrimary(item.id)}>{primary === item.id ? '✓ 最初に確かめる' : '最初に確かめる'}</button>
      </div>)}</div>
      {primary && <fieldset className={styles.flexQuestion}><legend>「{priorityItems.find(item => item.id === primary)?.label}」は、どこまで譲れる？</legend><div className={styles.segmented}>{(Object.keys(flexibilityLabels) as Flexibility[]).map(value => <button key={value} aria-pressed={(note.flexibility[primary] ?? 'unsure') === value} onClick={() => changeNote({ ...note, flexibility: { ...note.flexibility, [primary]: value } })}>{flexibilityLabels[value]}</button>)}</div></fieldset>}
    </>}

    {step === 3 && <div className={styles.resultStack}>
      <section className={styles.nextCard} aria-labelledby="priority-next-title">
        <p className={styles.cardKicker}>NEXT STEP · 次に確かめること</p>
        <h3 id="priority-next-title">{nextStep.question}</h3>
        <p>{nextStep.action}</p>
      </section>
      <section className={styles.summaryCard} aria-label="今の整理">
        <p className={styles.cardKicker}>YOUR NOTE · 今の仮まとめ</p>
        <h3>{unknown ? '軸は、これから見つければ大丈夫' : nextStep.label}</h3>
        <div className={styles.chips}>{selected.map(item => <span key={item.id}>{item.label} · {note.choices[item.id] === 'change' ? '変えたい' : '残したい'}</span>)}{!selected.length && <span>まだ決まっていない</span>}</div>
      </section>
      <button className={styles.primary} onClick={copy}>相談メモをコピー</button>
      <p className={styles.copyStatus} role="status">{copyStatus === 'success' ? 'コピーしました。手元のメモに貼り付けて使えます。' : copyStatus === 'error' ? 'コピーできませんでした。下の詳細から文章を選択してください。' : ''}</p>
      <details className={styles.details}><summary>すべての質問と相談メモを見る</summary>
        <div className={styles.detailsBody}>
          {selected.map(item => <p key={item.id}><strong>{item.label}</strong><br />{item.question}</p>)}
          <label>コピー用テキスト<textarea readOnly value={output} rows={12} onFocus={event => event.currentTarget.select()} /></label>
        </div>
      </details>
      <div className={styles.nextLinks}><p>確認先を探す</p>
        <TrackedInternalLink href="/compare" eventName="career_priorities_next_click" eventProperties={{ destination_type: 'compare', ui_version: uiVersion }}>企業比較を見る ↗</TrackedInternalLink>
        <TrackedInternalLink href="/career-agents" eventName="career_priorities_next_click" eventProperties={{ destination_type: 'career_agents', ui_version: uiVersion }}>相談先を探す ↗</TrackedInternalLink>
      </div>
    </div>}

    <nav className={styles.navigation} aria-label="会話を進める">
      {step > 0 && <button onClick={() => navigate(step === 3 && unknown ? 0 : step - 1)}>戻って直す</button>}
      {step === 0 && <button className={styles.primary} disabled={!groups.length} onClick={() => navigate(1)}>次へ</button>}
      {step === 1 && <button className={styles.primary} disabled={!selected.length} onClick={() => navigate(2)}>次へ</button>}
      {step === 2 && <button className={styles.primary} disabled={!primary} onClick={() => navigate(3)}>次の一歩を見る</button>}
    </nav>
    <p className={styles.privacy}>回答は保存・送信されず、再読み込みで消えます。操作のみ匿名で計測します。</p>
  </div>;
}
