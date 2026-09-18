"use client";

import { useId, useState } from "react";
import type { Route } from "next";
import { opticalCategories, opticalCategoryIds, opticalMeta, selectOpticalCompanies, type OpticalSelection } from "@/data/optical-semiconductor";
import { trackEvent } from "@/lib/analytics";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "./OpticalCompanies.module.css";

export function OpticalCompaniesExplorer() {
  const [selected, setSelected] = useState<OpticalSelection>("all");
  const panelId = useId();
  const companies = selectOpticalCompanies(selected);
  const categories = selected === "all" ? opticalCategoryIds : [selected];
  const label = selected === "all" ? "すべて" : opticalCategories[selected].label;
  function select(next: OpticalSelection) {
    if (next === selected) return;
    setSelected(next);
    trackEvent("optical_company_category_select", { category: next, source_slug: opticalMeta.sourceSlug });
  }
  return <div>
    <fieldset className={styles.controls}>
      <legend>調べたい用途を選ぶ</legend>
      <div className={styles.buttons}>
        <button type="button" aria-pressed={selected === "all"} aria-controls={panelId} onClick={() => select("all")}>すべて</button>
        {opticalCategoryIds.map(id => <button key={id} type="button" aria-pressed={selected === id} aria-controls={panelId} onClick={() => select(id)}>{opticalCategories[id].label}</button>)}
      </div>
    </fieldset>
    <p role="status" aria-live="polite" aria-atomic="true">選択中：{label} ／ 掲載例 {companies.length}社</p>
    <div id={panelId}>
      <div className={styles.diagrams}>
        {categories.map(id => { const category = opticalCategories[id]; return <figure key={id} className={styles.diagram}>
          <figcaption><strong>{category.purpose}</strong><span>{category.label}</span></figcaption>
          <div className={styles.flow}><span>{category.input}</span><span aria-label="から">→</span><strong>{category.output}</strong></div>
          <p>{category.description}</p>
        </figure>; })}
      </div>
      <div className={styles.cards}>
        {companies.map(company => <section key={company.id} data-company={company.id} className={styles.card}>
          <h3>{company.name}</h3>
          {company.products.filter(product => selected === "all" || product.category === selected).map(product => <div key={product.category} className={styles.product}>
            <span className={styles.tag}>{opticalCategories[product.category].label}</span>
            <h4>{product.name}</h4><p>{product.role}</p>
            <a href={product.url} target="_blank" rel="noopener noreferrer">公式製品情報（{product.name}） ↗</a>
          </div>)}
          {company.companySlug && <TrackedInternalLink href={`/companies/${company.companySlug}` as Route} eventName="article_company_click" eventProperties={{ source_slug: opticalMeta.sourceSlug, company_id: company.companySlug }}>{company.name}の企業情報 →</TrackedInternalLink>}
        </section>)}
      </div>
      {companies.length === 0 && <p>掲載企業では該当する製品例を確認できていません。上の用途説明を参考にしてください。</p>}
    </div>
    <noscript><p>用途の切り替えにはJavaScriptが必要です。全社の説明と、下の出典付き一覧表はそのまま読めます。</p></noscript>
  </div>;
}
