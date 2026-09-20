"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { jevCategories, jevRoutes, jevRouteInfo, jevSamples, jevCompletenessLevels, jevInputPricePerMillion, type JevRoute } from "@/data/jev-demo";
import type { JevResult } from "@/lib/jev-demo";
import { trackEvent } from "@/lib/analytics";
import { JevFactoryExperience } from "./JevFactoryExperience";
import { jevVisualVersion, visualCases, formatProbability, formatProbabilityDelta } from "@/data/jev-visual";
import styles from "@/app/labs/jev/jev.module.css";

const routeKeys = Object.keys(jevRoutes) as JevRoute[];
const pct = formatProbability;
const resultKey = (sampleId: string, evidenceId: string | null) => `${sampleId}:${evidenceId ?? "initial"}`;
const delta = formatProbabilityDelta;

export function JevDemo({ enabled, initialSampleId, helpContent }: { enabled: boolean; initialSampleId: string; helpContent?: ReactNode }) {
  const [sampleId, setSampleId] = useState(initialSampleId);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, JevResult>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const [started, setStarted] = useState(false);
  const failures = useRef<Record<string, string>>({});
  const shellRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const sample = jevSamples.find((item) => item.id === sampleId)!;
  const initial = results[resultKey(sample.id, null)];
  const selected = results[resultKey(sample.id, evidenceId)];
  const current = selected ?? initial;
  const comparing = Boolean(evidenceId && selected && initial);
  const before = comparing ? initial : undefined;
  const evidence = sample.evidence.find((item) => item.id === evidenceId);
  const route = current ? jevRouteInfo(current.decisions.route.choice) : null;


  useEffect(() => {
    trackEvent("jev_lab_view", { initial_case: initialSampleId, ui_version: jevVisualVersion });
  }, [initialSampleId]);

  async function run(target: string | null, caseId = sampleId, retry = false) {
    if (!enabled || busy.current || (target !== null && !results[resultKey(caseId, null)])) return;
    const key = resultKey(caseId, target);
    if (results[key]) return;
    if (failures.current[key] && !retry) {
      setError(failures.current[key]);
      return; // Failed inputs require an explicit retry, even after switching away and back.
    }
    busy.current = true;
    setPending(key);
    setError("");
    const event = { case_id: caseId, stage: target === null ? "initial" : "evidence", ui_version: jevVisualVersion };
    const fail = (message: string, status: number) => {
      failures.current[key] = message;
      setError(message);
      trackEvent("jev_evaluation_failed", { ...event, http_status: status });
    };
    trackEvent("jev_evaluation_start", event);
    try {
      const response = await fetch("/api/jev", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId: caseId, evidenceId: target }),
        signal: AbortSignal.timeout(22000),
      });
      const body = await response.json();
      if (!response.ok) {
        fail(typeof body.error === "string" ? body.error : "判断を取得できませんでした。", response.status);
        return;
      }
      if (body.sampleId !== caseId || body.evidenceId !== target || !body.decisions) throw new Error("Mismatched result");
      delete failures.current[key];
      setResults(previous => ({ ...previous, [key]: body as JevResult }));
      trackEvent("jev_evaluation_complete", { ...event, route: body.decisions.route.choice });
    } catch {
      fail("通信が完了しませんでした。時間をおいて再試行してください。", 0);
    } finally {
      busy.current = false;
      setPending(null);
    }
  }

  function start() {
    if (!enabled || busy.current) return;
    setStarted(true);
    void run(null);
  }

  function chooseCase(id: string) {
    if (busy.current) return;
    setSampleId(id);
    setEvidenceId(null);
    setError(failures.current[resultKey(id, null)] ?? "");
    trackEvent("jev_case_selected", { case_id: id, ui_version: jevVisualVersion });
    if (started) void run(null, id);
  }

  function chooseEvidence(id: string | null) {
    if (busy.current || (id !== null && !initial)) return;
    setEvidenceId(id);
    setError(failures.current[resultKey(sampleId, id)] ?? "");
    trackEvent("jev_evidence_selected", { case_id: sampleId, evidence_id: id ?? "initial", ui_version: jevVisualVersion });
    if (started) void run(id);
  }


  useEffect(() => {
    const resize = () => {
      const shell = shellRef.current;
      if (!shell) return;
      const top = shell.getBoundingClientRect().top + window.scrollY;
      const height = window.visualViewport?.height ?? window.innerHeight;
      shell.style.setProperty("--jev-height", Math.max(416, height - top - 12) + "px");
    };
    resize();
    const observer = new ResizeObserver(resize);
    const header = document.querySelector(".site-header");
    if (header) observer.observe(header);
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    return () => { observer.disconnect(); window.removeEventListener("resize", resize); window.visualViewport?.removeEventListener("resize", resize); };
  }, []);
  useEffect(() => {
    if (infoOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [infoOpen]);

  return <section ref={shellRef} className={styles.demo} aria-label="Jev 工場チュートリアル">
    <header className={styles.demoHeader}><h1>情報を変える。確率が動く。</h1><button type="button" aria-label="説明・確率・学習リンクを開く" onClick={() => setInfoOpen(true)}>?</button></header>
    <div className={styles.casePicker} aria-label="ケース切替">
      {jevSamples.map(item => <button key={item.id} type="button" aria-pressed={item.id === sampleId} disabled={pending !== null} onClick={() => chooseCase(item.id)}>{visualCases[item.id].label}</button>)}
    </div>
    <JevFactoryExperience sampleId={sample.id} enabled={enabled} evidenceId={evidenceId} initial={initial} selected={selected}
      pending={pending !== null} error={error} started={started} start={start}
      retry={() => void run(evidenceId, sampleId, true)} chooseEvidence={chooseEvidence} />
    <dialog ref={dialogRef} className={styles.infoDialog} onCancel={event => { event.preventDefault(); setInfoOpen(false); }} aria-labelledby="jev-info-title">
      <header><h2 id="jev-info-title">説明と判断の詳細</h2><button type="button" onClick={() => setInfoOpen(false)}>閉じる</button></header>
      <p>情報を切り替え、次の確認先の選択確率がどう変わるかを見る教材です。開始後は未評価の情報を選ぶと自動送信します。図は固定の架空例で、Jevは図ではなく報告文を読みます。↑は増加・上昇、→は従来並、?は未確認。個数や不良率ではありません。</p>
      <p>A/Bは別の状況です。初報と各分岐の結果を保持し、評価済みの情報に戻っても再送しません。</p>
      <h3>表示中の報告</h3><p>{sample.report}</p>{evidence && <p>追加情報：{evidence.report}</p>}
      {evidence && !selected && <p>追加情報は未評価です。以下は初報の結果です。</p>}
      {current && route && <>
        <h3>次の確認先：{route.label}</h3><p>{route.next}</p>
        {route.href && <Link href={route.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("jev_tool_route_click", { route: current.decisions.route.choice, destination: route.href })}>{route.link} ↗</Link>}
        <p>確認先はJevの提案。説明・図・リンクはCompassの編集です。確率や確信度は原因の確定度・正解率ではありません。</p>
        <div className={styles.tableWrap}><table><caption>確認先の選択確率（同一尺度）</caption><thead><tr><th>確認先</th>{before && <th>初報</th>}<th>{before ? "追加後" : "初報"}</th>{before && <th>差</th>}</tr></thead><tbody>
          {routeKeys.map(id => <tr key={id}><th>{jevRoutes[id].label}</th>{before && <td>{pct(before.decisions.route.probabilities[id])}</td>}<td>{pct(current.decisions.route.probabilities[id])}</td>{before && <td>{delta(before.decisions.route.probabilities[id], current.decisions.route.probabilities[id])}</td>}</tr>)}
        </tbody></table></div>
        <p>確認先の確信度：{before && <>{pct(before.decisions.route.confidence)} → </>}{pct(current.decisions.route.confidence)}</p>
        <p>変更分類：{before && <>{jevCategories[before.decisions.change.choice].label} → </>}{jevCategories[current.decisions.change.choice].label}</p>
        <p>比較記録あり（Boolean）：{before && <>{pct(before.decisions.comparison.probability)} → </>}{pct(current.decisions.comparison.probability)}</p>
        <p>情報充実度（Score）：{before && <>{(before.decisions.completeness.score + 1).toFixed(1)} → </>}{(current.decisions.completeness.score + 1).toFixed(1)} / 5</p>
        <details><summary>その他の確率・技術情報</summary>
          <div className={styles.tableWrap}><table><caption>変更分類の確率</caption><thead><tr><th>分類</th>{before && <th>初報</th>}<th>表示中</th></tr></thead><tbody>
            {Object.entries(jevCategories).map(([id, item]) => <tr key={id}><th>{item.label}</th>{before && <td>{pct(before.decisions.change.probabilities[id as keyof typeof jevCategories])}</td>}<td>{pct(current.decisions.change.probabilities[id as keyof typeof jevCategories])}</td></tr>)}
          </tbody></table></div>
          <div className={styles.tableWrap}><table><caption>情報充実度の確率</caption><thead><tr><th>段階</th>{before && <th>初報</th>}<th>表示中</th></tr></thead><tbody>
            {jevCompletenessLevels.map((level, i) => <tr key={level.label}><th>{level.label}</th>{before && <td>{pct(before.decisions.completeness.probabilities[String(i)])}</td>}<td>{pct(current.decisions.completeness.probabilities[String(i)])}</td></tr>)}
          </tbody></table></div>
          <p>変更分類の確信度：{pct(current.decisions.change.confidence)} / Scoreの確信度：{pct(current.decisions.completeness.confidence)}。各問いは独立評価。Scoreは段階の加重平均、Booleanは該当確率です。</p>
          <p>{current.model} / {current.questionVersion}<br />API往復 {current.elapsedMs.toLocaleString()}ms / 入力 {current.inputTokens.toLocaleString()} tokens<br />入力料金概算：$ {(current.inputTokens / 1_000_000 * jevInputPricePerMillion).toFixed(8)}（2026年9月20日確認の単価、税・ホスティング除外）<br />計測日時：{current.measuredAt}</p>
        </details>
      </>}
      <p><a href={`/labs/jev?case=${sample.id}`} onClick={() => trackEvent("jev_case_share_click", { case_id: sample.id })}>このケースの共有リンク ↗</a>（結果は共有されません）</p>
      {helpContent}
    </dialog>
  </section>;
}
