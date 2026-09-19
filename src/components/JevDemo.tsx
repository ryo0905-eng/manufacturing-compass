"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  jevCategories,
  jevInputPricePerMillion,
  jevSamples,
  type JevVariant,
} from "@/data/jev-demo";
import type { JevResult } from "@/lib/jev-demo";
import styles from "@/app/labs/jev/jev.module.css";

const categoryKeys = Object.keys(jevCategories) as (keyof typeof jevCategories)[];

export function JevDemo({ enabled }: { enabled: boolean }) {
  const [sampleId, setSampleId] = useState(jevSamples[0].id);
  const [variant, setVariant] = useState<JevVariant>("before");
  const [results, setResults] = useState<Record<string, JevResult>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);

  const sample = jevSamples.find((item) => item.id === sampleId)!;
  const result = results[`${sample.id}:${variant}`];
  const beforeResult = results[`${sample.id}:before`];
  const afterResult = results[`${sample.id}:after`];
  const category = result ? jevCategories[result.choice] : null;
  const probabilities = result
    ? categoryKeys
        .map((key) => ({ key, ...jevCategories[key], value: result.probabilities[key] }))
        .sort((a, b) => b.value - a.value)
    : [];

  async function run() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    const resultKey = `${sample.id}:${variant}`;
    setResults((previous) => {
      const next = { ...previous };
      delete next[resultKey];
      return next;
    });

    try {
      const response = await fetch("/api/jev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId: sample.id, variant }),
        signal: AbortSignal.timeout(22000),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(typeof body.error === "string" ? body.error : "実行できませんでした。");
        return;
      }
      setResults((previous) => ({ ...previous, [resultKey]: body as JevResult }));
    } catch {
      setError("通信が完了しませんでした。時間をおいて再度お試しください。");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <section className={styles.demo} aria-labelledby="demo-title">
      <div className={styles.demoHeader}>
        <div>
          <p className={styles.eyebrow}>LIVE DEMO</p>
          <h2 id="demo-title">報告文から「変更の種類」を選ぶ</h2>
        </div>
        <span className={`${styles.statusPill} ${enabled ? styles.online : ""}`}>
          <span aria-hidden="true" />
          {enabled ? "Jev 接続中" : "デモ停止中"}
        </span>
      </div>

      <p className={styles.scopeNote}>
        原因を断定するデモではありません。文章に明記された変更を5種類から1つ選びます。
      </p>

      <div className={styles.workspace}>
        <div className={styles.inputPane}>
          <label className={styles.fieldLabel} htmlFor="jev-sample">架空の報告を選ぶ</label>
          <select
            id="jev-sample"
            value={sampleId}
            disabled={pending}
            onChange={(event) => {
              setSampleId(event.target.value);
              setError("");
            }}
          >
            {jevSamples.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>

          <div className={styles.reportCard}>
            <span>REPORT</span>
            <p>{sample.report}</p>
            {variant === "after" && (
              <div className={styles.addedInfo}>
                <span>追加情報</span>
                <p>{sample.additional}</p>
              </div>
            )}
          </div>

          <div className={styles.segmented} aria-label="報告の情報量">
            <button
              type="button"
              className={variant === "before" ? styles.selected : ""}
              aria-pressed={variant === "before"}
              disabled={pending}
              onClick={() => { setVariant("before"); setError(""); }}
            >
              初報だけ
            </button>
            <button
              type="button"
              className={variant === "after" ? styles.selected : ""}
              aria-pressed={variant === "after"}
              disabled={pending}
              onClick={() => { setVariant("after"); setError(""); }}
            >
              追加情報あり
            </button>
          </div>

          <button className={styles.runButton} type="button" disabled={!enabled || pending} onClick={run}>
            {pending ? "分類しています…" : result ? "もう一度分類する" : "Jevで分類する →"}
          </button>
          <p className={styles.privacyNote}>固定の架空データだけを送信します。</p>
        </div>

        <div className={styles.resultPane} aria-busy={pending} aria-live="polite">
          {pending ? (
            <div className={styles.loadingState}>
              <span aria-hidden="true" />
              <p>Jevが分類しています</p>
            </div>
          ) : result && category ? (
            <div className={styles.result}>
              <p className={styles.eyebrow}>JEV&apos;S DECISION</p>
              <div className={styles.decisionHeading}>
                <h3>{category.label}</h3>
                <span>確信度 {Math.round(result.confidence * 100)}%</span>
              </div>

              <div className={styles.confidenceTrack} aria-label={`確信度 ${Math.round(result.confidence * 100)}%`}>
                <span style={{ width: `${result.confidence * 100}%` }} />
              </div>

              <div className={styles.probabilities}>
                {probabilities.map((item) => (
                  <div className={styles.probability} key={item.key}>
                    <span>{item.label}</span>
                    <div><span style={{ width: `${item.value * 100}%` }} /></div>
                    <strong>{Math.round(item.value * 100)}%</strong>
                  </div>
                ))}
              </div>

              <div className={styles.nextAction}>
                <span>次に確認すること</span>
                <p>{category.next}</p>
                <Link href={category.href}>{category.link} →</Link>
              </div>

              <details className={styles.technical}>
                <summary>技術情報</summary>
                <dl>
                  <div><dt>応答時間</dt><dd>{result.elapsedMs} ms</dd></div>
                  <div><dt>入力トークン</dt><dd>{result.inputTokens.toLocaleString()}</dd></div>
                  <div><dt>入力料金の概算</dt><dd>${(result.inputTokens / 1_000_000 * jevInputPricePerMillion).toFixed(8)}</dd></div>
                  <div><dt>モデル</dt><dd>{result.model}</dd></div>
                </dl>
              </details>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div aria-hidden="true">→</div>
              <h3>ここに分類結果が出ます</h3>
              <p>Jevは文章ではなく、選択肢と確率を返します。</p>
            </div>
          )}
        </div>
      </div>

      {beforeResult && afterResult && (
        <div className={styles.comparison}>
          <span>情報を加えた結果</span>
          <strong>{jevCategories[beforeResult.choice].label}</strong>
          <span aria-hidden="true">→</span>
          <strong>{jevCategories[afterResult.choice].label}</strong>
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
