"use client";

import { useId, useState } from "react";
import type { Route } from "next";
import { equipmentProcesses, equipmentSalesCompanies, equipmentSalesMeta, type EquipmentProcessSelection } from "@/data/semiconductor-equipment-sales";
import { getEquipmentSalesView } from "@/lib/equipment-sales";
import { trackEvent } from "@/lib/analytics";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "./EquipmentSalesRanking.module.css";

export function EquipmentSalesExplorer({ sourceSlug }: { sourceSlug: string }) {
  const [selection, setSelection] = useState<EquipmentProcessSelection>("all");
  const resultId = useId();
  const view = getEquipmentSalesView(equipmentSalesCompanies, selection);
  const matches = view.filter((row) => row.matches);
  const process = equipmentProcesses.find((item) => item.id === selection);
  function select(next: EquipmentProcessSelection) {
    if (next === selection) return;
    setSelection(next);
    trackEvent("equipment_ranking_process_select", { process_id: next, source_slug: sourceSlug });
  }
  return <div className={styles.explorer}>
    <fieldset className={styles.controls}>
      <legend>気になる工程を選ぶ</legend>
      <div className={styles.buttons}>
        {[{ id: "all" as const, label: "すべて" }, ...equipmentProcesses].map((item) => <button
          type="button" key={item.id} aria-pressed={selection === item.id} aria-controls={resultId}
          onClick={() => select(item.id)}>{item.label}</button>)}
      </div>
    </fieldset>
    <p className={styles.hint}>{process?.description ?? "工程を選ぶと、対応する製品を確認できた企業を強調します。企業の順位と棒の尺度は変わりません。"}</p>
    <p className={styles.caution}>金額は各社の半導体製造装置売上です。選択した工程の売上や市場シェアではありません。工程対応は製品例であり、非該当でもその事業がないとは限りません。</p>
    <figure className={styles.chart}>
      <figcaption>{equipmentSalesMeta.year}年 売上高上位10社 <small>単位：{equipmentSalesMeta.currency}／0を基準に最大値35.96までの共通尺度</small></figcaption>
      <ol className={styles.bars}>
        {view.map(({ company, matches, barPercent }) => <li key={company.id} className={matches && selection !== "all" ? styles.match : undefined}>
          <div className={styles.barHeading}><span>{company.rank}位 <strong>{company.name}</strong></span><b>{company.salesUsdB.toFixed(2)}</b></div>
          <div className={styles.track} aria-hidden="true"><span style={{ width: `${barPercent}%` }} /></div>
          {selection !== "all" && <small>{matches ? "該当" : "掲載した製品例では該当なし"}</small>}
        </li>)}
      </ol>
    </figure>
    <div id={resultId}>
      <p role="status" aria-live="polite" aria-atomic="true">{process ? `${process.label}：${matches.length}社が該当` : `すべて：${matches.length}社を表示`}</p>
      {process && <TrackedInternalLink href={`/guides/${process.guideSlug}` as Route} eventName="article_internal_click" eventProperties={{ source_slug: sourceSlug, destination_path: `/guides/${process.guideSlug}` }}>{process.label}の装置と主要企業を詳しく見る →</TrackedInternalLink>}
      {matches.length === 0 && <p>掲載上位10社では該当企業を確認できていません。</p>}
      <div className={styles.cards}>
        {matches.map(({ company, capabilities }) => <section className={styles.card} key={company.id}>
          <h3><small>売上高 {company.rank}位</small>{company.name}</h3>
          <ul>{capabilities.map((capability) => <li key={capability.process}>
            <strong>{equipmentProcesses.find((item) => item.id === capability.process)?.label}</strong>：{capability.description}{" "}
            <a href={capability.sourceUrl} target="_blank" rel="noopener noreferrer">公式製品情報</a>
          </li>)}</ul>
          {company.companySlug && <TrackedInternalLink href={`/companies/${company.companySlug}` as Route} eventName="article_company_click" eventProperties={{ source_slug: sourceSlug, company_id: company.companySlug }}>{company.name}の企業情報 →</TrackedInternalLink>}
        </section>)}
      </div>
    </div>
    <noscript><p>工程の切り替えにはJavaScriptが必要です。下の一覧表で全社の売上・工程・出典を確認できます。</p></noscript>
  </div>;
}
