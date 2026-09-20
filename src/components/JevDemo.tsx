"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { jevCategories, jevRoutes, jevRouteInfo, jevSamples, jevCompletenessLevels, jevInputPricePerMillion, type JevRoute } from "@/data/jev-demo";
import type { JevResult } from "@/lib/jev-demo";
import styles from "@/app/labs/jev/jev.module.css";

const routeKeys = Object.keys(jevRoutes) as JevRoute[];
const pct = (n: number) => `${Math.round(n * 100)}%`;
const resultKey = (sampleId: string, evidenceId: string | null) => `${sampleId}:${evidenceId ?? "initial"}`;
function delta(before: number, after: number) {
  const points = Math.round((after - before) * 100);
  return points === 0 ? "±0pt" : `${points > 0 ? "+" : "−"}${Math.abs(points)}pt`;
}

export function JevDemo({ enabled, initialSampleId }: { enabled: boolean; initialSampleId: string }) {
  const [sampleId, setSampleId] = useState(initialSampleId);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, JevResult>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const sample = jevSamples.find((item) => item.id === sampleId)!;
  const initial = results[resultKey(sample.id, null)];
  const selected = results[resultKey(sample.id, evidenceId)];
  const current = selected ?? initial;
  const comparing = Boolean(evidenceId && selected && initial);
  const before = comparing ? initial : undefined;
  const evidence = sample.evidence.find((item) => item.id === evidenceId);
  const route = current ? jevRouteInfo(current.decisions.route.choice) : null;
  const fetchingSelected = pending === resultKey(sample.id, evidenceId);

  async function run(target: string | null) {
    if (busy.current || (target !== null && !initial)) return;
    const key = resultKey(sample.id, target);
    if (results[key]) return; // The initial measurement and each branch remain stable for comparison.
    busy.current = true;
    setPending(key);
    setError("");
    try {
      const response = await fetch("/api/jev", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId: sample.id, evidenceId: target }),
        signal: AbortSignal.timeout(22000),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(typeof body.error === "string" ? body.error : "判断を取得できませんでした。");
        return;
      }
      if (body.sampleId !== sample.id || body.evidenceId !== target || !body.decisions) throw new Error("Mismatched result");
      setResults((previous) => ({ ...previous, [key]: body as JevResult }));
      if (window.innerWidth <= 850) {
        outputRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
    } catch {
      setError("通信が完了しませんでした。時間をおいて、同じボタンで再試行できます。");
    } finally {
      busy.current = false;
      setPending(null);
    }
  }

  function chooseCase(id: string) {
    setSampleId(id);
    setEvidenceId(null);
    setError("");
  }

  return (
    <section className={styles.demo} aria-labelledby="demo-title">
      <header className={styles.demoHeader}>
        <div><p className={styles.eyebrow}>JEV DECISION LAB</p><h2 id="demo-title">情報が変わる。次の確認先が変わる。</h2></div>
        <span className={styles.statusPill}>{enabled ? "実APIデモ" : "接続準備中"}</span>
      </header>
      <div className={styles.casePicker} aria-label="架空ケース">
        {jevSamples.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={item.id === sampleId} disabled={pending !== null}
            onClick={() => chooseCase(item.id)}>
            <span>0{index + 1}</span>{item.title}
          </button>
        ))}
      </div>
      <div className={styles.workspace}>
        <div className={styles.inputPane}>
          <div className={styles.stepHeading}><span>01</span><h3>まず、初報を読む</h3><small>STATE</small></div>
          <div className={styles.report}><p>{sample.report}</p></div>
          {!initial ? (
            <button className={styles.primaryButton} type="button" disabled={!enabled || pending !== null} onClick={() => run(null)}>
              {pending ? "Jevが判断しています…" : "初報を評価する →"}
            </button>
          ) : (
            <button className={styles.initialButton} type="button" disabled={pending !== null} onClick={() => { setEvidenceId(null); setError(""); }}>
              ✓ 初報の結果を表示{evidenceId === null ? "中" : "する"}
            </button>
          )}
          <p className={styles.sendNote}>操作時に架空報告と質問をGateway経由でTypeSafe AIへ送信。</p>

          <div id="jev-evidence" className={styles.stepHeading}><span>02</span><h3>追加情報を1つ選ぶ</h3></div>
          <p className={styles.hint}>同じ初報から分かれる、別々の状況です。</p>
          <div className={styles.evidenceList}>
            {sample.evidence.map((item, index) => (
              <button type="button" key={item.id} aria-pressed={item.id === evidenceId} disabled={!initial || pending !== null}
                onClick={() => { setEvidenceId(item.id); setError(""); }}>
                <span className={styles.evidenceLetter}>{index === 0 ? "A" : "B"}</span>
                <span><strong>{item.title}</strong>{item.id === evidenceId && <span>{item.report}</span>}</span>
              </button>
            ))}
          </div>
          {evidence && (
            <button className={styles.primaryButton} type="button" disabled={!enabled || pending !== null || Boolean(selected)} onClick={() => run(evidence.id)}>
              {fetchingSelected ? "この情報で再評価中…" : selected ? "この追加情報は評価済み" : "この情報で再評価する →"}
            </button>
          )}
          {!initial && <p className={styles.hint}>初報を評価すると、追加情報を試せます。</p>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <p className={styles.share}><a href={`/labs/jev?case=${sample.id}`}>このケースの共有リンク ↗</a><span>結果は共有されません</span></p>
        </div>

        <div ref={outputRef} className={styles.outputPane} aria-busy={pending !== null}>
          <div className={styles.stepHeading}><span>03</span><h3>判断とルートを見る</h3><small>4 DECISIONS</small></div>
          <p className={styles.resultStatus} role="status" aria-live="polite">
            {pending ? (initial ? "再評価中 · 初報の結果を表示しています" : "4つの質問を同じ報告から評価しています") :
              evidenceId && !selected ? "選択した追加情報は未評価 · 初報の結果を表示中" :
                comparing ? `初報と「${evidence?.title}」を比較中` : initial ? "初報の実測結果 · 追加情報で変化を試せます" : "1回のリクエストで、4つの型付き判断"}
          </p>
          {current && route ? (
            <>
              <div className={styles.routeFlow}>
                <span className={styles.flowNode}>Jev</span>
                <span className={styles.flowLine} aria-hidden="true">→</span>
                <div className={styles.routeCard}>
                  <div className={styles.cardLabel}>次に確認する領域 <span>Choice</span></div>
                  {before && <p className={styles.previousRoute}>初報：{jevRoutes[before.decisions.route.choice].label} →</p>}
                  <h4>{route.label}</h4><p className={styles.routeCode}>{route.code}</p>
                  <p className={styles.confidence}>確信度 {before && <><s>{pct(before.decisions.route.confidence)}</s> → </>}{pct(current.decisions.route.confidence)}</p>
                </div>
              </div>
              {before && (
                <p className={styles.changeSummary}>
                  {before.decisions.route.choice === current.decisions.route.choice ? "確認先は同じ" : "確認先が変化"}
                  <span> · </span>
                  {before.decisions.change.choice === current.decisions.change.choice ? "変更カテゴリは同じ" : "変更カテゴリも変化"}
                </p>
              )}
              {initial && <a className={styles.tryAnother} href="#jev-evidence">追加情報を選び直す ↑</a>}
              <div className={styles.decisionCards}>
                <div>
                  <div className={styles.cardLabel}>記録された変更 <span>Choice</span></div>
                  {before && <small>初報：{jevCategories[before.decisions.change.choice].label}</small>}
                  <strong>{jevCategories[current.decisions.change.choice].label}</strong>
                </div>
                <div>
                  <div className={styles.cardLabel}>比較記録あり <span>Boolean</span></div>
                  {before && <small>初報 {pct(before.decisions.comparison.probability)} →</small>}
                  <strong>{pct(current.decisions.comparison.probability)}</strong><small>該当する確率</small>
                </div>
                <div className={styles.scoreCard}>
                  <div className={styles.cardLabel}>情報の充実度 <span>Score</span></div>
                  <strong>{before && <small>{(before.decisions.completeness.score + 1).toFixed(1)} → </small>}{(current.decisions.completeness.score + 1).toFixed(1)}<small> / 5</small></strong>
                  <div className={styles.scoreScale} aria-hidden="true">
                    {before && <i style={{ left: `${before.decisions.completeness.score / 4 * 100}%` }} />}
                    <b style={{ left: `${current.decisions.completeness.score / 4 * 100}%` }} />
                  </div>
                  <div className={styles.scoreEnds}><span>症状のみ</span><span>再確認あり</span></div>
                </div>
              </div>

              <div className={styles.distribution}>
                <div className={styles.distributionHeading}><h4>確認先の確率</h4><span>{before ? "薄：初報 / 濃：追加後" : "初報"} · 0–100%</span></div>
                {routeKeys.map((key) => {
                  const now = current.decisions.route.probabilities[key];
                  const old = before?.decisions.route.probabilities[key];
                  return <div className={styles.distributionRow} key={key} data-selected={key === current.decisions.route.choice}>
                    <span>{jevRoutes[key].label}</span>
                    <div className={styles.bars} aria-hidden="true">
                      {old !== undefined && <i style={{ width: `${old * 100}%` }} />}
                      <b style={{ width: `${now * 100}%` }} />
                    </div>
                    <span className={styles.values}>{old !== undefined && <><span>{pct(old)}</span> → </>}{pct(now)}</span>
                    {old !== undefined && <span className={styles.delta}>{delta(old, now)}</span>}
                  </div>;
                })}
              </div>
              <div className={styles.nextAction}>
                <p>{route.next}</p>
                {route.href && <Link href={route.href} target="_blank" rel="noopener noreferrer">{route.link} ↗</Link>}
                <small>確認先はJevの判断。説明とリンクはCompassの編集です。</small>
              </div>
              <details className={styles.details}>
                <summary>ほかの確率・判断基準・技術情報</summary>
                <p>各質問は同じ報告を独立に評価しています。confidenceは分布の集中度を表す指標で、正解率ではありません。</p>
                <table><caption>記録された変更の確率</caption><thead><tr><th>分類</th>{before && <th>初報</th>}<th>{before ? "追加後" : "初報"}</th></tr></thead><tbody>
                  {Object.entries(jevCategories).map(([key, item]) => <tr key={key}><th>{item.label}</th>{before && <td>{pct(before.decisions.change.probabilities[key as keyof typeof jevCategories])}</td>}<td>{pct(current.decisions.change.probabilities[key as keyof typeof jevCategories])}</td></tr>)}
                </tbody></table>
                <p>変更分類の確信度：{before && <>{pct(before.decisions.change.confidence)} → </>}{pct(current.decisions.change.confidence)}</p>
                <table><caption>情報充実度の5段階と確率</caption><thead><tr><th>段階</th>{before && <th>初報</th>}<th>{before ? "追加後" : "初報"}</th></tr></thead><tbody>
                  {jevCompletenessLevels.map((level, i) => <tr key={level.label}><th>{i + 1}. {level.label}</th>{before && <td>{pct(before.decisions.completeness.probabilities[String(i)])}</td>}<td>{pct(current.decisions.completeness.probabilities[String(i)])}</td></tr>)}
                </tbody></table>
                <p>Scoreは段階の加重平均です。確信度：{before && <>{pct(before.decisions.completeness.confidence)} → </>}{pct(current.decisions.completeness.confidence)}。比較記録のBooleanはtrueの確率で、confidenceではありません。</p>
                <p>比較記録＝同じ試料の別測定、同じ材料の別装置など、条件を切り分けられる比較結果。提案だけ・変更が同時・未確認の矛盾は含みません。</p>
                <dl><div><dt>API往復時間</dt><dd>{current.elapsedMs.toLocaleString()} ms</dd></div><div><dt>入力</dt><dd>{current.inputTokens.toLocaleString()} tokens</dd></div><div><dt>入力料金概算</dt><dd>${(current.inputTokens / 1_000_000 * jevInputPricePerMillion).toFixed(8)}</dd></div><div><dt>モデル / 質問版</dt><dd>{current.model} / {current.questionVersion}</dd></div><div><dt>計測日時</dt><dd>{current.measuredAt}</dd></div></dl>
                <p>時間はGatewayとの通信を含みます。料金は2026年9月20日確認の入力単価による概算で、税・ホスティング費用を含みません。</p>
              </details>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyFlow}><span>報告</span><span>→</span><strong>Jev</strong><span>→</span><span>確認先</span></div>
              <h4>まずは、初報でどう判断する？</h4>
              <p>追加情報を選ぶと、判断の変化を比べられます。</p>
              <div className={styles.typeBadges}><span>Choice × 2</span><span>Boolean</span><span>Score</span></div>
            </div>
          )}
        </div>
      </div>
      <footer className={styles.demoFooter}>教育用の架空データ · AI出力は参考判断 · 自動操作なし · 確信度は正解率ではありません</footer>
    </section>
  );
}
