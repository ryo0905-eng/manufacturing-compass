"use client";

import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import { factoryProjects, factoryProjectSources, factoryProjectMeta } from "@/data/factory-projects";
import { getFactoryProjectPair, factoryProjectComparisonText } from "@/lib/factory-project-comparison";
import { trackEvent } from "@/lib/analytics";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "./FactoryProjectComparison.module.css";

function track(action: "start" | "compare" | "copy_success" | "copy_fallback") {
  try { trackEvent("factory_project_compare", { action, source_slug: factoryProjectMeta.sourceSlug, ui_version: "compare-v1" }); } catch { /* Keep comparison usable. */ }
}

export function FactoryProjectComparison() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [pair, setPair] = useState<ReturnType<typeof getFactoryProjectPair>>(null);
  const [notice, setNotice] = useState("");
  const [copying, setCopying] = useState(false);
  const revision = useRef(0), busy = useRef(false), started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (pair) {
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    }
  }, [pair]);
  function change(side: "a" | "b", id: string) {
    if (id && !factoryProjects.some(project => project.id === id)) return;
    if (!started.current && id) { started.current = true; track("start"); }
    revision.current++; (side === "a" ? setA : setB)(id); setPair(null); setNotice("");
  }
  async function copy() {
    if (!pair || busy.current) return;
    busy.current = true; setCopying(true); setNotice("");
    const version = revision.current;
    try {
      await navigator.clipboard.writeText(factoryProjectComparisonText(pair));
      if (revision.current === version) setNotice("コピーしました。");
      track("copy_success");
    } catch {
      if (revision.current === version) setNotice("自動コピーできませんでした。下の比較メモを選択してコピーしてください。");
      track("copy_fallback");
    } finally { busy.current = false; setCopying(false); }
  }
  return <section className={styles.root} aria-labelledby="factory-comparison-title">
    <h3 id="factory-comparison-title">気になる2案件を比べる</h3>
    <p>同じ企業でも工場ごとに段階が違います。2案件を選び、確認できた節目と今後の予定を並べて確認できます。</p>
    <p className={styles.note}>対象は上の主要5案件。資料確認日：{factoryProjectMeta.snapshotDate}。建設・試作・量産を進捗率や優劣に換算しません。</p>
    <form onSubmit={event => {
      event.preventDefault();
      const next = getFactoryProjectPair(a, b);
      if (!next) return;
      revision.current++; setNotice(""); setPair(next); track("compare");
    }}>
      <div className={styles.pair}>{(["a", "b"] as const).map(side => <label key={side}>案件{side === "a" ? "A" : "B"}
        <select value={side === "a" ? a : b} onChange={event => change(side, event.target.value)}>
          <option value="">案件を選んでください</option>
          {factoryProjects.map(project => <option key={project.id} value={project.id} disabled={project.id === (side === "a" ? b : a)}>{project.name}</option>)}
        </select>
      </label>)}</div>
      <button type="submit" disabled={!getFactoryProjectPair(a, b)}>2案件を比較する</button>
    </form>
    <noscript><p>2件比較にはJavaScriptを使用します。上の一覧からも全5案件を確認できます。</p></noscript>
    {pair && <div>
      <h4 ref={heading} tabIndex={-1} className={styles.heading}>比較結果：{pair[0].name}／{pair[1].name}</h4>
      {([
        ["所在地", "location"], ["確認時点の段階", "stage"], ["確認できた節目", "actual"],
        ["今後の予定・未確認事項", "planned"], ["読み違えないための補足", "note"], ["資料の確認日", "checkedAt"],
      ] as const).map(([label, key]) => <section className={styles.row} key={key}>
        <h5>{label}</h5><div className={styles.pair}>{pair.map((project, index) => <div key={project.id}><strong>{index === 0 ? "A" : "B"}：{project.name}</strong><p>{project[key]}</p></div>)}</div>
      </section>)}
      <section className={styles.row}><h5>出典と企業情報</h5><div className={styles.pair}>{pair.map((project, index) => <div key={project.id}>
        <strong>{index === 0 ? "A" : "B"}：{project.name}</strong>
        <ul>{project.sourceNumbers.map(number => <li key={number}><a href={factoryProjectSources[number - 1].url} target="_blank" rel="noopener noreferrer">{factoryProjectSources[number - 1].title}</a></li>)}</ul>
        {project.companySlug && <TrackedInternalLink href={`/companies/${project.companySlug}` as Route} eventName="article_company_click" eventProperties={{ source_slug: factoryProjectMeta.sourceSlug, company_id: project.companySlug }}>関連企業の情報を見る →</TrackedInternalLink>}
      </div>)}</div></section>
      <p>工場の計画は、現在の求人や配属先を示すものではありません。</p>
      <TrackedInternalLink href="/semiconductor-map" eventName="article_internal_click" eventProperties={{ source_slug: factoryProjectMeta.sourceSlug, destination_path: "/semiconductor-map" }}>掲載されている周辺拠点を地図で調べる →</TrackedInternalLink>
      <p className={styles.note}>比較対象の工場すべてが地図に登録されているわけではありません。</p>
      <button type="button" onClick={copy} disabled={copying}>{copying ? "コピー中…" : "出典付きの比較メモをコピー"}</button>
      <p role="status">{notice}</p>
      <label>比較メモ（手動でもコピーできます）<textarea readOnly rows={10} value={factoryProjectComparisonText(pair)} onFocus={event => event.currentTarget.select()} /></label>
    </div>}
  </section>;
}
