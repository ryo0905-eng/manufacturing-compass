'use client';

import { useRef, useState } from 'react';
import { priorityGroups, priorityItems, flexibilityLabels, type PriorityId, type Flexibility, type Intent } from '@/data/career-priorities';
import { buildPriorityNote, emptyPriorityNote, setChoice, type PriorityNote } from '@/lib/career-priorities';
import { trackEvent } from '@/lib/analytics';
import styles from './CareerPrioritiesNote.module.css';

const steps = ['希望', '優先順位', '質問', 'ノート'];
const headings = ['変えたいこと。残したいこと。', '今回、大切にしたいこと', '次の面談で、確かめたいこと', '私の転職の軸'];

export function CareerPrioritiesNote() {
  const [step, setStep] = useState(-1);
  const [note, setNote] = useState<PriorityNote>(emptyPriorityNote);
  const [unknown, setUnknown] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const reached = useRef(new Set<number>());
  const selected = priorityItems.filter(item => note.choices[item.id]);
  const ordered = [...note.priorities, ...selected.map(item => item.id).filter(id => !note.priorities.includes(id))];
  const output = buildPriorityNote(note);

  function start() {
    if (!started.current) {
      started.current = true;
      trackEvent('career_priorities_start');
    }
  }
  function navigate(next: number) {
    setStep(next);
    setCopyStatus('idle');
    if (!reached.current.has(next)) {
      reached.current.add(next);
      trackEvent('career_priorities_step', { step_number: next + 1 });
      if (next === 3) trackEvent('career_priorities_complete');
    }
    requestAnimationFrame(() => heading.current?.focus());
  }
  function choose(id: PriorityId, intent: Intent) {
    start();
    setUnknown(false);
    setNote(current => setChoice(current, id, intent));
  }
  function togglePriority(id: PriorityId) {
    setNote(current => {
      const flexibility = { ...current.flexibility };
      if (current.priorities.includes(id)) {
        delete flexibility[id];
        return { ...current, flexibility, priorities: current.priorities.filter(key => key !== id) };
      }
      if (current.priorities.length >= 3) return current;
      return { ...current, priorities: [...current.priorities, id], flexibility: { ...flexibility, [id]: 'unsure' } };
    });
  }
  function move(id: PriorityId, direction: number) {
    setNote(current => {
      const priorities = [...current.priorities];
      const index = priorities.indexOf(id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= priorities.length) return current;
      [priorities[index], priorities[target]] = [priorities[target], priorities[index]];
      return { ...current, priorities };
    });
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus('success');
      trackEvent('career_priorities_copy');
    } catch {
      setCopyStatus('error');
    }
  }

  return <div className={styles.workspace}>
    {step < 0 ? <section className={styles.welcome}>
      <p className={styles.intro}>次の仕事で、変えたいこと。残したいこと。<br />まだ決まっていなくても大丈夫です。</p>
      <p>希望を選んで、今の仮の優先順位と、求人票・面接で確認したい質問を一枚のノートにまとめます。活動途中の見直しにも使えます。</p>
      <ul className={styles.facts}><li>目安3〜5分</li><li>ログイン不要</li><li>回答の保存なし</li></ul>
      <button className={styles.primary} onClick={() => navigate(0)}>今の気持ちから整理する</button>
    </section> : <>
      <ol className={styles.progress} aria-label="ノート作成の進み具合">{steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
      <h2 ref={heading} tabIndex={-1} className={styles.heading}>{headings[step]}</h2>
      {step === 0 && <>
        <p>気になる分野を開いて選んでください。全部埋める必要はありません。同じボタンを押すと選択を解除できます。</p>
        {priorityGroups.map(group => <details className={styles.group} key={group.id}>
          <summary>{group.label}<small>{group.items.filter(item => note.choices[item.id]).length}件選択</small></summary>
          {group.items.map(item => <fieldset className={styles.choice} key={item.id}>
            <legend>{item.label}</legend>
            <div className={styles.options}>{(['change', 'keep'] as const).map(intent => <button key={intent} aria-pressed={note.choices[item.id] === intent} onClick={() => choose(item.id, intent)}>{intent === 'change' ? '今回変えたい' : '次も残したい'}</button>)}</div>
          </fieldset>)}
        </details>)}
        <button className={styles.unknown} aria-pressed={unknown} onClick={() => { start(); setUnknown(current => !current); setNote(emptyPriorityNote); }}>まだ具体的に分からない</button>
        <aside className={styles.selection} aria-live="polite"><strong>選んだこと · {selected.length}件</strong>{selected.length ? <ul>{selected.map(item => <li key={item.id}>{item.label}<small>{note.choices[item.id] === 'change' ? '変えたい' : '残したい'}</small></li>)}</ul> : <p>{unknown ? '今は探索中。それも大切な出発点です。' : '気になるものから、一つずつ。'}</p>}</aside>
      </>}
      {step === 1 && <>
        <p>特に大切にしたいことを最大3つ選びます。1つでも、まだ選べなくても大丈夫です。</p>
        <div className={styles.picks}>{selected.map(item => <button key={item.id} aria-pressed={note.priorities.includes(item.id)} disabled={note.priorities.length >= 3 && !note.priorities.includes(item.id)} onClick={() => togglePriority(item.id)}>{note.priorities.includes(item.id) ? '✓ ' : '＋ '}{item.label}</button>)}</div>
        {!selected.length && <p className={styles.selection}>今は優先順位を探索中です。次の求人で、魅力と気になる点を一つずつ探してみましょう。</p>}
        <label className={styles.check}><input type="checkbox" checked={note.unordered} onChange={event => setNote(current => ({ ...current, unordered: event.target.checked }))} />順位はまだ決めない</label>
        <p className={styles.hint}>順位と、どこまで譲れるかは別です。「まだ迷う」のまま進めます。</p>
        <ol className={styles.ranking}>{note.priorities.map((id, index) => <li key={id} className={styles.rankCard}>
          <div className={styles.rankTitle}><strong>{note.unordered ? '' : `${index + 1}. `}{priorityItems.find(item => item.id === id)!.label}</strong>
            {!note.unordered && <div className={styles.arrows}><button disabled={index === 0} aria-label={`${priorityItems.find(item => item.id === id)!.label}を上へ`} onClick={() => move(id, -1)}>↑</button><button disabled={index === note.priorities.length - 1} aria-label={`${priorityItems.find(item => item.id === id)!.label}を下へ`} onClick={() => move(id, 1)}>↓</button></div>}
          </div>
          <fieldset className={styles.flexibility}><legend>どこまで譲れる？</legend><div className={styles.options}>{(Object.keys(flexibilityLabels) as Flexibility[]).map(value => <button key={value} aria-pressed={(note.flexibility[id] ?? 'unsure') === value} onClick={() => setNote(current => ({ ...current, flexibility: { ...current.flexibility, [id]: value } }))}>{flexibilityLabels[value]}</button>)}</div></fieldset>
        </li>)}</ol>
      </>}
      {step === 2 && <>
        <p>希望を、確かめるための質問に。メモに残したいものだけ選んでください。</p>
        {ordered.map(id => { const item = priorityItems.find(candidate => candidate.id === id)!; return <section className={styles.question} key={id}><h3>{item.label}</h3><p className={styles.hint}>求人票で分からなければ、面談でこう聞けます。</p><label className={styles.check}><input type="checkbox" checked={note.questions.includes(id)} onChange={() => setNote(current => ({ ...current, questions: current.questions.includes(id) ? current.questions.filter(key => key !== id) : [...current.questions, id] }))} />{item.question}</label></section>; })}
        {!ordered.length && <p className={styles.selection}>質問は後から考えても大丈夫です。今の状態をノートにまとめましょう。</p>}
      </>}
      {step === 3 && <>
        <p>今の仮まとめです。求人紹介や面接で考えが変わったら、また見直せます。</p>
        <div className={styles.paper}>{output.split('\n\n').map((section, index) => <p key={index}>{section}</p>)}</div>
        <button className={styles.primary} onClick={copy}>ノートをコピー</button>
        <p role="status">{copyStatus === 'success' ? 'コピーしました。手元のメモに貼り付けて使えます。' : copyStatus === 'error' ? '自動コピーができませんでした。下の文章を選択してコピーしてください。' : ''}</p>
        {copyStatus === 'error' && <label className={styles.manual}>コピー用テキスト<textarea readOnly value={output} onFocus={event => event.currentTarget.select()} rows={12} /></label>}
        <p className={styles.hint}>選択肢になかった希望は、コピー後に手元で追記できます。</p>
      </>}
      <nav className={styles.navigation} aria-label="画面の移動">
        {step > 0 ? <button onClick={() => navigate(step - 1)}>{step === 3 ? '戻って見直す' : '戻る'}</button> : <span />}
        {step < 3 && <button className={styles.primary} disabled={step === 0 && !selected.length && !unknown} onClick={() => navigate(step + 1)}>{step === 2 ? 'ノートにまとめる' : '次へ'}</button>}
      </nav>
    </>}
    <p className={styles.privacy}>回答とノートは保存・送信されません。再読み込みやページを閉じると消えるため、最後にコピーしてください。改善のため、開始・画面到達・完成・コピーの操作のみ匿名で計測します。</p>
  </div>;
}
