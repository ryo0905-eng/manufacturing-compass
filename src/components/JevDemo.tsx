"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { jevCategories, jevInputPricePerMillion, jevSamples, type JevVariant } from "@/data/jev-demo";
import type { JevResult } from "@/lib/jev-demo";
import styles from "@/app/labs/jev/jev.module.css";

export function JevDemo({ enabled }: { enabled: boolean }) {
  const [sampleId, setSampleId] = useState(jevSamples[0].id);
  const [results, setResults] = useState<Record<string, JevResult>>({});
  const [pending, setPending] = useState<JevVariant | null>(null);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const sample = jevSamples.find((item) => item.id === sampleId)!;
  const measured = Object.values(results);
  const matched = measured.filter((result) => jevSamples.find((item) => item.id === result.sampleId)?.expected[result.variant] === result.choice).length;

  async function run(variant: JevVariant) {
    if (busy.current) return;
    busy.current = true;
    setPending(variant);
    setError("");
    const resultKey = `${sample.id}:${variant}`;
    // A failed re-run must not leave an old measurement looking like the new one.
    setResults((previous) => { const next = { ...previous }; delete next[resultKey]; return next; });
    try {
      const response = await fetch("/api/jev", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId: sample.id, variant }), signal: AbortSignal.timeout(22000),
      });
      const body = await response.json();
      if (!response.ok) { setError(typeof body.error === "string" ? body.error : "実行できませんでした。"); return; }
      setResults((previous) => ({ ...previous, [resultKey]: body as JevResult }));
    } catch { setError("通信が完了しませんでした。時間をおいて再度お試しください。"); }
    finally { busy.current = false; setPending(null); }
  }
  function download() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), description: "架空サンプルの実測。編集上の期待分類はレビュー前であり正解率を示さない。各条件の最新成功結果のみ。", results: measured.map((result) => ({ ...result, expected: jevSamples.find((item) => item.id === result.sampleId)!.expected[result.variant] })) }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "jev-demo-results.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className={styles.demo} aria-labelledby="demo-title">
    <h2 id="demo-title">報告に情報を加えて、分類を比べる</h2>
    <label className={styles.selectLabel} htmlFor="jev-sample">1. 架空の報告を選ぶ</label>
    <select id="jev-sample" value={sampleId} disabled={pending !== null} onChange={(event) => { setSampleId(event.target.value); setError(""); }}>
      {jevSamples.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title}</option>)}
    </select>
    <p className={styles.notice}>{enabled ? "実行すると、この架空報告と固定の分類質問をVercel AI Gateway経由でTypeSafe AIに送信します。自由入力・実データ送信はありません。" : "接続準備中：APIは未接続です。サンプルの切り替えと編集上の確認ポイントを閲覧できます。実測値はまだありません。"}</p>
    <div className={styles.columns}>
      {(["before", "after"] as const).map((variant) => {
        const result = results[`${sample.id}:${variant}`];
        const category = result ? jevCategories[result.choice] : null;
        return <article className={styles.panel} key={`${sample.id}:${variant}`} aria-busy={pending === variant}>
          <h3>{variant === "before" ? "2. 初報だけで試す" : "3. 追加情報も含めて試す"}</h3>
          <p>{sample.report}</p>
          {variant === "after" && <p className={styles.additional}><strong>追加情報</strong><br />{sample.additional}</p>}
          <button type="button" disabled={!enabled || pending !== null} onClick={() => run(variant)}>{pending === variant ? "Jevに問い合わせ中…" : result ? "もう一度Jevで分類する" : "Jevに送信して分類する"}</button>
          {result && category ? <div className={styles.result}>
            <p className={styles.label}>Jevの実測結果</p><h4>{category.label}</h4>
            <p>確信度：{result.confidence.toFixed(3)} <span className={styles.muted}>（0〜1）</span></p>
            <p className={styles.muted}>確信度は分類候補の確率分布から計算される指標で、正解率ではありません。</p>
            <ul className={styles.distribution}>{Object.entries(jevCategories).map(([id, item]) => <li key={id}><span>{item.label}</span><meter min={0} max={1} value={result.probabilities[id as keyof typeof jevCategories]} aria-label={item.label} /><span>{(result.probabilities[id as keyof typeof jevCategories] * 100).toFixed(1)}%</span></li>)}</ul>
            <h4>次の確認項目（Compass編集）</h4><p>{category.next}</p><Link href={category.href}>{category.link} →</Link>
            <dl className={styles.metrics}><div><dt>API往復時間</dt><dd>{result.elapsedMs} ms</dd></div><div><dt>入力トークン</dt><dd>{result.inputTokens.toLocaleString()}</dd></div><div><dt>入力料金の概算</dt><dd>${(result.inputTokens / 1000000 * jevInputPricePerMillion).toFixed(8)}</dd></div></dl>
            <p className={styles.muted}>サーバーからGateway経由でJevを呼び出す通信・応答読取を含む時間です。料金は2026年9月20日確認の単価から算出し、税・ホスティング費用を含みません。</p>
            <p className={styles.muted}>GatewayモデルID：{result.model}<br />質問版：{result.questionVersion}<br />測定日時：{result.measuredAt}</p>
          </div> : <p className={styles.muted}>この条件の実測結果はまだありません。</p>}
          <details className={styles.expectation}><summary>編集上の期待分類・確認ポイント（レビュー前）</summary><p>{jevCategories[sample.expected[variant]].label}</p><p>{sample.note}</p><p>{jevCategories[sample.expected[variant]].next}</p><p>期待分類は報告の記載内容に対する仮の比較基準です。原因の正解や専門家による検証済みラベルではありません。</p></details>
        </article>;
      })}
    </div>
    <p role="status" aria-live="polite">{pending ? "分類結果を取得しています。" : error || (measured.length ? "取得済みの結果を表示しています。" : "サンプルを選んで、情報の違いを確認できます。")}</p>
    <section className={styles.summary} aria-labelledby="evaluation-title"><h3 id="evaluation-title">この画面での検証記録</h3><p>実測済み条件：{measured.length} / {jevSamples.length * 2} · 編集上の期待分類との一致：{matched} / {measured.length}</p><p>同じ条件は最新の成功結果を記録します。少数の架空例での一致数であり、日本語全体や実業務での精度を表しません。再読み込みで結果は消えます。</p><button type="button" onClick={download} disabled={measured.length === 0 || pending !== null}>実測結果をJSONで保存</button></section>
  </section>;
}
