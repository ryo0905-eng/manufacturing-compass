"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { measurementPlanner } from "@/data/measurement-planner";
import { finderDataOptions, finderGoals, finderModes, finderSource, finderUpdatedAt, type FinderAnswers } from "@/data/tool-finder";
import { findTool, needsFinderData, selectFinderGoal, selectFinderMode } from "@/lib/tool-finder";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";
import styles from "./ToolFinder.module.css";

function track(step: string, toolId?: string) {
  try { trackEvent("tool_finder", { step, tool_id: toolId, ui_version: "finder-v1" }); } catch { /* The guide remains usable when analytics is unavailable. */ }
}

export function ToolFinder() {
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const entryRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const seen = useRef(new Set<string>());
  const result = findTool(answers);
  const resultId = result ? `${result.tool.id}:${result.status}` : null;
  const resultTool = result?.tool.id;
  useEffect(() => {
    if (!entryRef.current || seen.current.has("view")) return;
    return observeVisibleOnce(entryRef.current, () => { seen.current.add("view"); track("view"); });
  }, []);
  useEffect(() => {
    if (!resultId || !resultRef.current || seen.current.has("result")) return;
    return observeVisibleOnce(resultRef.current, () => { seen.current.add("result"); track("result", resultTool); });
  }, [resultId, resultTool]);
  function update(next: FinderAnswers) {
    if (!seen.current.has("start")) { seen.current.add("start"); track("start"); }
    setAnswers(next);
  }
  const dataOptions = needsFinderData(answers) ? finderDataOptions[answers.goal] : null;
  return <section className={styles.finder} id="tool-finder" aria-labelledby="tool-finder-title">
    <header><p className="section-label">TOOL FINDER</p><h2 id="tool-finder-title" ref={entryRef}>困りごとから、使うツールを探す</h2>
      <p>最大3問で、最初に使うツールと準備するものを整理します。回答は保存しません。</p>
      <a href="#learning-roadmap">一覧から直接選ぶ ↓</a></header>
    <fieldset><legend>1. 何を確認したいですか？</legend><div className={styles.options}>
      {finderGoals.map(option => <label key={option.id}><input type="radio" name="finder-goal" value={option.id} checked={answers.goal === option.id} onChange={() => update(selectFinderGoal(option.id))} />{option.label}</label>)}
    </div></fieldset>
    {answers.goal && <fieldset><legend>2. どのように使いたいですか？</legend><div className={styles.options}>
      {finderModes.map(option => <label key={option.id}><input type="radio" name="finder-mode" value={option.id} checked={answers.mode === option.id} onChange={() => update(selectFinderMode(answers, option.id))} />{option.label}</label>)}
    </div></fieldset>}
    {dataOptions && <fieldset><legend>3. 手元にあるものを教えてください</legend><div className={styles.options}>
      {dataOptions.map(option => <label key={option.id}><input type="radio" name="finder-data" value={option.id} checked={answers.data === option.id} onChange={() => update({ ...answers, data: option.id })} />{option.label}</label>)}
    </div></fieldset>}
    <p role="status" className={styles.status}>{result ? `案内ができました：${result.heading}。${result.tool.title}` : answers.goal ? answers.mode ? "手元のデータを選ぶと、この下に案内を表示します。" : "使い方を選ぶと、次の案内に進みます。" : "目的を選んでください。"}</p>
    {result && <div className={styles.result}>
      <h3 ref={resultRef}>{result.heading}</h3><p>{result.reason}</p>
      <h4>{result.tool.title}</h4><p className={styles.input}>移動先の入力・データ：{result.tool.input}</p>
      <dl><dt>準備するもの・最初の操作</dt><dd>{answers.mode === "learn" ? "自分のデータは不要です。移動先の教材・架空例から始められます。" : result.preparation}</dd>
        <dt>確認できる範囲</dt><dd>{result.limit}</dd></dl>
      <Link className={styles.primary} href={result.tool.href} onClick={() => track("open", result.tool.id)}>{result.action} →</Link>
      {result.secondary && <p>あわせて使う：<Link href={result.secondary.href} onClick={() => track("related", result.secondary!.id)}>{result.secondary.title}{result.secondary.id === "control-chart" ? "（教材）" : ""}</Link></p>}
    </div>}
    {answers.goal && <button type="button" className={styles.reset} onClick={() => { setAnswers({}); track("reset"); }}>選択をやり直す</button>}
    <details className={styles.notes}><summary>案内の考え方・出典</summary><p>案内は公開中のツールの入力方式に基づきます。統計手法の適用可否を判定するものではありません。工程能力の評価では工程の安定性や分布の前提も確認します。</p><a href={finderSource.url} target="_blank" rel="noopener noreferrer">{finderSource.title}</a><br /><a href={measurementPlanner.source} target="_blank" rel="noopener noreferrer">NIST：平均の推定幅と測定数</a><p>最終確認：{finderUpdatedAt}。各ツールにも適用範囲と出典を記載しています。</p></details>
  </section>;
}
