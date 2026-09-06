'use client';

import { useRef, useState } from 'react';
import type { Route } from 'next';
import { TrackedInternalLink } from './TrackedInternalLink';
import { workstyleRoles, workstyleConditions, concernLevels, confirmationLabels, workstyleBasis, type WorkstyleRole, type WorkstyleCondition, type ConcernLevel } from '@/data/workstyle-check';
import { buildWorkstyleNote, emptyWorkstyleNote, getWorkstyleCards, updateWorkstyleSelection, type WorkstyleNote } from '@/lib/workstyle-check';
import { trackEvent } from '@/lib/analytics';
import styles from './CareerPrioritiesNote.module.css';

export function WorkstyleCheck() {
  const [note, setNote] = useState<WorkstyleNote>(emptyWorkstyleNote);
  const [result, setResult] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const started = useRef(false);
  const completed = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const revision = useRef(0);
  const cards = getWorkstyleCards(note);
  const output = buildWorkstyleNote(note);
  function edit(next: WorkstyleNote) {
    revision.current += 1;
    setNote(next);
    setCopyStatus('');
    if (!started.current) { started.current = true; trackEvent('workstyle_check_start'); }
  }
  function select(roles: WorkstyleRole[], conditions: WorkstyleNote['conditions'], changed: 'role' | 'condition') {
    edit(updateWorkstyleSelection(note, roles, conditions));
    if (result) trackEvent('workstyle_check_compare', { changed });
  }
  function toggleCondition(id: WorkstyleCondition) {
    const conditions = { ...note.conditions };
    if (conditions[id]) delete conditions[id]; else conditions[id] = 'learn';
    select(note.roles, conditions, 'condition');
  }
  async function copy() {
    const currentRevision = revision.current;
    try {
      await navigator.clipboard.writeText(output);
      if (revision.current === currentRevision) setCopyStatus('success');
      trackEvent('workstyle_check_copy');
    } catch { if (revision.current === currentRevision) setCopyStatus('error'); }
  }
  return <div className={styles.workspace}>
    <p>生産技術・設備保全などの経験があり、半導体の仕事を調べ始めた方へ。気になる条件から、求人票・面接で確かめたい質問を作ります。</p>
    <p className={styles.hint}>職種名だけで働き方は決まりません。会社・部署・拠点・雇用形態によって違います。記載がない条件も「なし」とは判断しません。</p>
    <fieldset className={styles.choice}><legend><strong>1. 気になる仕事（最大2つ）</strong></legend>
      <div className={styles.picks}>{workstyleRoles.map(role => <button key={role.id} aria-pressed={note.roles.includes(role.id)} disabled={note.roles.length >= 2 && !note.roles.includes(role.id)} onClick={() => select(note.roles.includes(role.id) ? note.roles.filter(id => id !== role.id) : [...note.roles, role.id], note.conditions, 'role')}>{role.label}<small className={styles.roleDescription}>{role.description}</small></button>)}</div>
      <button aria-pressed={!note.roles.length} onClick={() => select([], note.conditions, 'role')}>まだ分からない・上記以外（共通質問へ）</button>
    </fieldset>
    <fieldset className={styles.choice}><legend><strong>2. 気になる条件（最大3つ）</strong></legend>
      <div className={styles.picks}>{workstyleConditions.map(condition => <button key={condition.id} aria-pressed={!!note.conditions[condition.id]} disabled={Object.keys(note.conditions).length >= 3 && !note.conditions[condition.id]} onClick={() => toggleCondition(condition.id)}>{condition.label}</button>)}</div>
      {workstyleConditions.filter(condition => note.conditions[condition.id]).map(condition => <fieldset className={styles.flexibility} key={condition.id}><legend>{condition.label}</legend><div className={styles.options}>{(Object.keys(concernLevels) as ConcernLevel[]).map(level => <button key={level} aria-pressed={note.conditions[condition.id] === level} onClick={() => select(note.roles, { ...note.conditions, [condition.id]: level }, 'condition')}>{concernLevels[level]}</button>)}</div></fieldset>)}
      <p className={styles.hint}>迷う項目は「まず知りたい」で進めます。住所・年収・勤務先の入力は不要です。</p>
    </fieldset>
    {!result && <button className={styles.primary} disabled={!cards.length} onClick={() => {
      setResult(true);
      if (!completed.current) { completed.current = true; trackEvent('workstyle_check_complete'); }
      requestAnimationFrame(() => resultHeading.current?.focus());
    }}>確認事項を比較する</button>}
    {result && <section aria-labelledby="workstyle-result-title">
      <h3 id="workstyle-result-title" ref={resultHeading} tabIndex={-1} className={styles.heading}>3. 聞くことの違いを比べる</h3>
      <p>上の仕事・条件を変えると質問も変わります。すべて編集上の確認提案です。実際の勤務条件や適性を判定したものではありません。</p>
      <p className={styles.hint} role="status">{cards.length ? `${cards.length}件の確認事項。各職種で検討中の求人を一つずつ想定してください。別の求人を調べるときは確認状況を未確認に戻してください。` : '気になる条件を一つ選ぶと、確認事項が表示されます。'}</p>
      {!!cards.length && <button onClick={() => edit({ ...note, confirmations: {} })}>確認状況をすべて未確認に戻す</button>}
      {workstyleConditions.filter(condition => cards.some(card => card.id.endsWith(`:${condition.id}`))).sort((a, b) => Number(note.conditions[b.id] === 'avoid') - Number(note.conditions[a.id] === 'avoid')).map(condition => <section className={styles.question} key={condition.id}>
        <h4>{condition.label} · {concernLevels[note.conditions[condition.id]!]}</h4>
        <p className={styles.hint}>求人票で見る項目：{condition.posting}</p>
        <div className={styles.workstyleComparison}>{cards.filter(card => card.id.endsWith(`:${condition.id}`)).map(card => <div className={styles.rankCard} key={card.id}>
          <strong>{card.role}</strong>
          <label className={styles.check}><input type="checkbox" checked={!note.excluded.includes(card.id)} onChange={() => edit({ ...note, excluded: note.excluded.includes(card.id) ? note.excluded.filter(id => id !== card.id) : [...note.excluded, card.id] })} /><span>{card.question}<small className={styles.roleDescription}>チェックした質問をメモに含めます</small></span></label>
          <fieldset className={styles.flexibility}><legend>本人の確認状況（サイトによる確認ではありません）</legend><div className={styles.options}>{(Object.keys(confirmationLabels) as Array<keyof typeof confirmationLabels>).map(status => <button key={status} aria-pressed={(note.confirmations[card.id] ?? 'unknown') === status} onClick={() => edit({ ...note, confirmations: { ...note.confirmations, [card.id]: status } })}>{confirmationLabels[status]}</button>)}</div></fieldset>
        </div>)}</div>
      </section>)}
      {!!cards.length && <>
        <h3>確認メモを持ち帰る</h3>
        <p>確認した求人名・確認日・回答者は、コピー後に手元で追記してください。現職の担当や勤務条件を確認する、応募を保留・見送るためにも使えます。</p>
        <button className={styles.primary} onClick={copy}>確認メモをコピー</button>
        <p role="status">{copyStatus === 'success' ? 'コピーしました。手元のメモに貼り付けて使えます。' : copyStatus === 'error' ? '自動コピーできませんでした。下の文章を選択してコピーしてください。' : ''}</p>
        <label className={styles.manual}>コピー用テキスト<textarea readOnly value={output} rows={12} onFocus={event => event.currentTarget.select()} /></label>
        <section className={styles.question}><h3>必要なことを、もう少し確認する</h3>
          <p className={styles.hint}>移動前にメモをコピーしてください。回答は移動先に引き継がれません。</p>
          <ul>
            {workstyleRoles.filter(role => note.roles.includes(role.id)).filter((role, index, all) => all.findIndex(other => other.href === role.href) === index).map(role => <li key={role.id}><TrackedInternalLink href={role.href as Route} eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'article' }}>仕事内容と経験の接点を調べる：{role.label}</TrackedInternalLink></li>)}
            {!note.roles.length && <li><TrackedInternalLink href="/industry-map" eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'industry_map' }}>業界地図で仕事のつながりを調べる</TrackedInternalLink></li>}
            <li><TrackedInternalLink href="/semiconductor-map" eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'location_map' }}>国内拠点と公式採用情報を調べる（希望勤務地への配属保証ではありません）</TrackedInternalLink></li>
            <li><TrackedInternalLink href="/compare" eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'compare' }}>企業の事業・仕事内容を比較する</TrackedInternalLink></li>
            <li><TrackedInternalLink href="/career-consultation" eventName="workstyle_check_related_click" eventProperties={{ destination_type: 'consultation' }}>公開情報で分からなかった質問を相談用に整理する</TrackedInternalLink></li>
          </ul>
          <p className={styles.hint}>相談サービスを使う場合も、希望職種・地域が支援対象かを先に確認してください。現職に残るか、応募するかは今決める必要はありません。</p>
        </section>
      </>}
    </section>}
    <details className={styles.group}><summary>質問の根拠と、分からないこと</summary>
      <p>質問は編集上の提案です。一般的な発生頻度や運営者の体験を示すものではなく、各質問にある業務・当番の存在を保証しません。</p>
      <p>参考例として、SCKの募集要項は職種による交替勤務と勤務地の変更可能性を明示しています。これだけでは、あなたが検討している求人や配属先の条件は分かりません。</p>
      <p><a href={workstyleBasis.source.url} target="_blank" rel="noopener noreferrer">{workstyleBasis.source.title}</a>（確認日：{workstyleBasis.source.checkedAt}）</p>
      <p className={styles.hint}>{workstyleBasis.source.scope} 出張・呼び出し・クリーンルームの質問を裏付ける資料ではありません。根拠がない勤務条件は断定せず、確認質問だけを表示します。</p>
      <p className={styles.hint}>質問の更新日：{workstyleBasis.updatedAt}／次回確認予定：{workstyleBasis.nextReviewAt}</p>
    </details>
    <p className={styles.privacy}>回答と確認メモは、このページを開いている間だけ保持し、保存・送信しません。再読み込みで消えます。開始・結果到達・比較操作・コピー・関連ページへの移動のみ匿名で計測し、選んだ条件や確認状況は送りません。</p>
  </div>;
}
