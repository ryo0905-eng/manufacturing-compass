'use client';

import { useMemo, useRef, useState } from 'react';
import { roleMapCategoryLabels, roleMapProfiles, roleMapResponsibilities } from '@/data/role-map-prototype';
import { findRoleMapMatches } from '@/lib/role-map';
import type { ResponsibilityCategory, ResponsibilityId, RoleMapMatch } from '@/types/role-map';
import styles from './RoleMapPrototype.module.css';

const categories = Object.keys(roleMapCategoryLabels) as ResponsibilityCategory[];
const knownIds = new Set(roleMapResponsibilities.map((item) => item.id));
const responsibilityById = new Map(roleMapResponsibilities.map((item) => [item.id, item]));

export function RoleMapPrototype() {
  const [selectedIds, setSelectedIds] = useState<ResponsibilityId[]>([]);
  const [emphasizedIds, setEmphasizedIds] = useState<ResponsibilityId[]>([]);
  const [matches, setMatches] = useState<RoleMapMatch[] | null>(null);
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);
  const [copyFailedPhrase, setCopyFailedPhrase] = useState<string | null>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const emphasizedSet = useMemo(() => new Set(emphasizedIds), [emphasizedIds]);

  function invalidateResults() {
    setMatches(null);
    setCopiedPhrase(null);
    setCopyFailedPhrase(null);
  }

  function toggleSelected(id: ResponsibilityId) {
    setSelectedIds((current) => {
      const isSelected = current.includes(id);
      const next = isSelected ? current.filter((item) => item !== id) : [...current, id];
      if (isSelected) setEmphasizedIds((items) => items.filter((item) => item !== id));
      return next;
    });
    invalidateResults();
  }

  function toggleEmphasized(id: ResponsibilityId) {
    if (!selectedSet.has(id)) return;
    setEmphasizedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
    invalidateResults();
  }

  function showMatches() {
    setMatches(findRoleMapMatches({ selectedIds, emphasizedIds }, roleMapProfiles, knownIds));
    setCopiedPhrase(null);
    setCopyFailedPhrase(null);
    requestAnimationFrame(() => resultsHeadingRef.current?.focus());
  }

  async function copyPhrase(phrase: string) {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedPhrase(phrase);
      setCopyFailedPhrase(null);
    } catch {
      setCopiedPhrase(null);
      setCopyFailedPhrase(phrase);
    }
  }

  return (
    <div className={styles.prototype}>
      <section className={styles.intro} aria-labelledby="prototype-title">
        <p className={styles.eyebrow}>LOCAL PROTOTYPE · 4 ROLE GROUPS</p>
        <h1 id="prototype-title">仕事内容から探す 半導体職種マップ</h1>
        <p>実際に担当した仕事を選ぶと、接点のある職種名と求人検索語を理由付きで表示します。適職・能力・採用可能性を判定するものではありません。</p>
        <div className={styles.notice}>
          <strong>検証中の試作品です</strong>
          <span>対応する職務は4群だけです。該当しない結果は、あなたの経験不足を意味しません。回答は保存・送信されず、再読み込みで消えます。</span>
        </div>
      </section>

      <section className={styles.selector} aria-labelledby="work-heading">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.step}>1</p>
            <h2 id="work-heading">やってきた仕事を選ぶ</h2>
          </div>
          <p><strong>{selectedIds.length}</strong> 件選択中</p>
        </div>
        <p className={styles.help}>職種名や年数は不要です。経験したことがある仕事を複数選んでください。</p>

        <div className={styles.categoryList}>
          {categories.map((category) => (
            <fieldset key={category} className={styles.category}>
              <legend>{roleMapCategoryLabels[category]}</legend>
              <div className={styles.optionList}>
                {roleMapResponsibilities.filter((item) => item.category === category).map((item) => (
                  <label key={item.id} className={selectedSet.has(item.id) ? styles.optionSelected : styles.option}>
                    <input type="checkbox" checked={selectedSet.has(item.id)} onChange={() => toggleSelected(item.id)} />
                    <span><strong>{item.label}</strong><small>{item.description}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {selectedIds.length > 0 ? (
          <fieldset className={styles.emphasis}>
            <legend>特によく担当した仕事（任意・最大3件）</legend>
            <p>候補を並べる時に少し強く反映します。経験年数や習熟度の評価ではありません。</p>
            <div className={styles.emphasisList}>
              {selectedIds.map((id) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={emphasizedSet.has(id)}
                    disabled={!emphasizedSet.has(id) && emphasizedIds.length >= 3}
                    onChange={() => toggleEmphasized(id)}
                  />
                  <span>{responsibilityById.get(id)?.label}</span>
                </label>
              ))}
            </div>
            <small>{emphasizedIds.length} / 3件</small>
          </fieldset>
        ) : null}

        <div className={styles.actions}>
          <button type="button" onClick={showMatches} disabled={selectedIds.length === 0}>候補を見る</button>
          {selectedIds.length === 1 ? <p>もう1件以上選ぶと、通常の候補を表示できます。</p> : null}
        </div>
      </section>

      {matches !== null ? (
        <section className={styles.results} aria-labelledby="result-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.step}>2</p>
              <h2 id="result-heading" ref={resultsHeadingRef} tabIndex={-1}>接点のある職種と検索語</h2>
            </div>
          </div>
          {matches.length === 0 ? (
            <div className={styles.empty}>
              <h3>この4職務群では、まだ候補を絞れませんでした</h3>
              <p>2件以上の共通業務がある場合だけ候補を表示しています。選択を増やすか、今回の試作品では未対応の職務として記録してください。</p>
            </div>
          ) : (
            <div className={styles.resultList}>
              {matches.map((match, index) => (
                <article key={match.profile.id} className={styles.resultCard}>
                  <header>
                    <p>候補 {index + 1}{match.tiedWithPrevious ? ' · 前の候補と同程度' : ''}</p>
                    <h3>{match.profile.title}</h3>
                    <span>{match.profile.context}</span>
                  </header>
                  <div className={styles.resultBody}>
                    <section>
                      <h4>共通する業務</h4>
                      <ul>{match.matchedIds.map((id) => <li key={id}>{responsibilityById.get(id)?.label}</li>)}</ul>
                    </section>
                    <section>
                      <h4>名称の例</h4>
                      <p>{match.profile.titles.join(' ／ ')}</p>
                    </section>
                    <section>
                      <h4>求人検索語</h4>
                      <div className={styles.phraseList}>
                        {match.profile.searchPhrases.map((phrase) => (
                          <div key={phrase}>
                            <code>{phrase}</code>
                            <button type="button" onClick={() => copyPhrase(phrase)}>{copiedPhrase === phrase ? 'コピーしました' : 'コピー'}</button>
                            {copyFailedPhrase === phrase ? <p role="status">コピーできませんでした。検索語を選択してコピーしてください。</p> : null}
                          </div>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4>求人票で確かめること</h4>
                      <ul>{match.profile.checks.map((item) => <li key={item}>{item}</li>)}</ul>
                    </section>
                    <section>
                      <h4>混同しやすい仕事との違い</h4>
                      <p>{match.profile.distinction}</p>
                    </section>
                    <details>
                      <summary>根拠にした企業公式情報</summary>
                      <ul>{match.profile.evidence.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.label}</a></li>)}</ul>
                      <p>確認日: 2026-09-16。求人の継続募集を示すものではありません。</p>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
