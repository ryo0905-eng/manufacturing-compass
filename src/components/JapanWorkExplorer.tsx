"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { japanWorkCategories } from "@/data/japan-work";
import { trackEvent } from "@/lib/analytics";
import { filterJapanWorkCompanies, isJapanWorkReviewExpired, matchesJapanWork, toggleJapanWorkComparison } from "@/lib/japan-work";
import type { JapanWorkCategory, JapanWorkCompanyView, JapanWorkFilters } from "@/types/japan-work";
import styles from "@/components/japan-work.module.css";

type Props = {
  companies: JapanWorkCompanyView[];
  panels: Record<string, ReactNode>;
  asOf: string;
  children: ReactNode;
};

export function JapanWorkExplorer({ companies, panels, asOf, children }: Props) {
  const [filters, setFilters] = useState<JapanWorkFilters>({});
  const [selection, setSelection] = useState<{ companyId: string; category?: JapanWorkCategory } | null>(null);
  const [comparison, setComparison] = useState<string[]>([]);
  const started = useRef(false);
  const origin = useRef<HTMLButtonElement | null>(null);
  const desktopHeading = useRef<HTMLHeadingElement>(null);
  const mobileHeading = useRef<HTMLHeadingElement>(null);
  const visible = filterJapanWorkCompanies(companies, filters);
  const published = companies.filter((company) => company.status === "published" && company.works.length > 0);
  const prefectures = [...new Set(published.flatMap((company) => company.works.flatMap((work) => work.prefectures)))].sort((a, b) => a.localeCompare(b, "ja"));
  const selected = visible.find((company) => company.companyId === selection?.companyId);
  const compared = comparison.map((id) => published.find((company) => company.companyId === id)).filter((company) => company !== undefined);

  useEffect(() => {
    function openEvidenceHash() {
      const company = companies.find(item => item.status === "published" && item.works.some(work => work.status === "published") && window.location.hash === `#evidence-${item.companyId}`);
      if (!company) return;
      const details = document.getElementById(`evidence-${company.companyId}`);
      if (!(details instanceof HTMLDetailsElement)) return;
      details.open = true;
      details.scrollIntoView({ block: "start", behavior: "instant" });
      details.querySelector("summary")?.focus({ preventScroll: true });
    }
    function reopenEvidence(event: globalThis.MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      // A repeated click on the same fragment does not produce hashchange.
      if (link?.getAttribute("href") === window.location.hash) openEvidenceHash();
    }
    openEvidenceHash();
    window.addEventListener("hashchange", openEvidenceHash);
    document.addEventListener("click", reopenEvidence);
    return () => {
      window.removeEventListener("hashchange", openEvidenceHash);
      document.removeEventListener("click", reopenEvidence);
    };
  }, [companies]);

  useEffect(() => {
    if (selection) {
      (window.matchMedia("(min-width: 1100px)").matches ? desktopHeading : mobileHeading).current?.focus({ preventScroll: true });
    }
  }, [selection]);

  function start() {
    if (!started.current) {
      started.current = true;
      trackEvent("japan_work_start");
    }
  }

  function updateFilters(next: JapanWorkFilters) {
    start();
    setFilters(next);
    setSelection(null);
  }

  function open(companyId: string, trigger: HTMLButtonElement, category?: JapanWorkCategory) {
    start();
    origin.current = trigger;
    setSelection({ companyId, category });
    trackEvent("japan_work_company_open", { company_id: companyId });
  }

  function close() {
    setSelection(null);
    origin.current?.focus({ preventScroll: true });
  }

  function toggleCompare(id: string) {
    start();
    const next = toggleJapanWorkComparison(comparison, id, published.map((company) => company.companyId));
    setComparison(next);
    if (next.length === 2 && !comparison.includes(id)) trackEvent("japan_work_compare", { first_company: next[0], second_company: next[1] });
  }

  function trackLink(event: MouseEvent<HTMLElement>) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-japan-work-link]");
    if (!link) return;
    const kind = link.dataset.japanWorkLink;
    if (kind === "source" || kind === "career" || kind === "related") {
      trackEvent(`japan_work_${kind}_click`, { company_id: link.dataset.company, destination: link.dataset.destination });
    }
  }

  function comparisonButton(company: JapanWorkCompanyView) {
    const active = comparison.includes(company.companyId);
    return <button type="button" className={styles.compareButton} aria-pressed={active} disabled={!active && comparison.length === 2} onClick={() => toggleCompare(company.companyId)} aria-label={`${company.name}を${active ? "比較から外す" : "比較に追加する"}`}>{active ? "✓ 比較中・外す" : "＋ 比較に追加"}</button>;
  }

  function panel(company: JapanWorkCompanyView, mode: "desktop" | "mobile") {
    const category = selection?.category;
    const focusedWorks = company.works.filter((work) => matchesJapanWork(work, { ...filters, category: category ?? filters.category }));
    return <section className={styles.panel} id={`japan-work-${mode}-detail`} aria-label={`${company.name}の日本の仕事`}>
      <div className={styles.panelHeading}><h3 ref={mode === "desktop" ? desktopHeading : mobileHeading} tabIndex={-1}>{company.name}</h3><button type="button" onClick={close} aria-label="企業詳細を閉じる">閉じる</button></div>
      {category || filters.prefecture || filters.category ? <div className={styles.match}>
        <strong>選んだ条件で確認できる仕事</strong>
        {focusedWorks.map((work) => <p key={work.id}>{work.officialTitle}<br /><span>{work.summary}</span></p>)}
        <small>以下には、この企業で確認できた他の仕事も掲載しています。</small>
      </div> : null}
      {panels[company.companyId]}
    </section>;
  }

  const comparisonRows: { label: string; value: (company: JapanWorkCompanyView) => string }[] = [
    { label: "世界では何の会社？", value: (company) => company.summary },
    { label: "日本では何をしている？", value: (company) => company.presence },
    { label: "仕事ごとの確認済み勤務地", value: (company) => company.works.map((work) => `${work.officialTitle}：${work.prefectures.join("・") || "日本（都道府県は未確認）"}`).join("\n") },
    { label: "公式の職種名・業務表記", value: (company) => company.works.map((work) => `${work.officialTitle}${work.titleKind === "activity" ? "（事業機能）" : ""}`).join("\n") },
    { label: "未確認の事項・資料の範囲", value: (company) => company.works.map((work) => work.unknowns).join("\n") },
    { label: "情報の確認日", value: (company) => [...new Set(company.works.map((work) => `${work.checkedAt}${isJapanWorkReviewExpired(work, asOf) ? "（再確認時期を過ぎています）" : ""}`))].join("\n") },
  ];

  return <div className={styles.explorer} onClick={trackLink}>
    <section className={styles.controls} aria-labelledby="japan-work-board-title">
      <p className="section-label">EXPLORE THE CONNECTIONS</p>
      <h2 id="japan-work-board-title">会社と、日本の仕事をつなぐ</h2>
      <p>仕事を選ぶと、接点のある企業が見えてきます。企業名からも詳しく調べられます。</p>
      <div className={styles.categories} role="group" aria-label="日本での仕事内容">
        <button type="button" aria-pressed={!filters.category} onClick={() => updateFilters({ ...filters, category: undefined })}>すべての仕事</button>
        {japanWorkCategories.map((category) => <button type="button" key={category.id} aria-pressed={filters.category === category.id} onClick={() => updateFilters({ ...filters, category: filters.category === category.id ? undefined : category.id })}>{category.label}</button>)}
      </div>
      <p className={styles.categoryHelp}>{filters.category ? japanWorkCategories.find((category) => category.id === filters.category)?.description : "6つの分類は仕事内容を整理するための編集上の区分です。適性や採用可能性を示すものではありません。"}</p>
      <div className={styles.filterRow}>
        <label>確認できた勤務地<select value={filters.prefecture ?? ""} onChange={(event) => updateFilters({ ...filters, prefecture: event.target.value || undefined })}><option value="">全国・地域未確認を含む</option>{prefectures.map((prefecture) => <option key={prefecture}>{prefecture}</option>)}</select></label>
        <button type="button" onClick={() => updateFilters({})}>条件を解除</button>
        <p role="status" aria-live="polite">{published.length}社の掲載情報から <strong>{visible.length}社</strong></p>
      </div>
      <p className={styles.note}>「接点を見る」は国内業務の根拠がある項目です。「未確認」は、その仕事がないという意味ではありません。募集状況は公式採用情報で確認してください。</p>
    </section>

    {visible.length === 0 ? <div className={styles.empty}><h3>確認済みの掲載情報では見つかりません</h3><p>日本勤務まで確認できても、都道府県が分からない仕事は地域の絞り込みに含めていません。</p><button type="button" onClick={() => updateFilters({})}>すべての掲載企業を見る</button></div> : null}

    <div className={styles.desktop}>
      <div className={selected ? styles.boardWithPanel : styles.board}>
        <table className={styles.matrix}>
          <caption>企業と日本の仕事内容の対応表</caption>
          <thead><tr><th scope="col">企業 / 世界での事業</th>{japanWorkCategories.map((category) => <th scope="col" key={category.id} className={filters.category === category.id ? styles.activeColumn : undefined}>{category.label}</th>)}</tr></thead>
          <tbody>{visible.map((company) => <tr key={company.companyId} className={selected?.companyId === company.companyId ? styles.selectedRow : undefined}>
            <th scope="row"><button className={styles.companyName} type="button" aria-expanded={selected?.companyId === company.companyId} aria-controls={selected ? "japan-work-desktop-detail" : undefined} onClick={(event) => open(company.companyId, event.currentTarget)}>{company.name} <span aria-hidden="true">↗</span></button><p>{company.summary}</p>{comparisonButton(company)}</th>
            {japanWorkCategories.map((category) => <td key={category.id} className={filters.category === category.id ? styles.activeColumn : undefined}>{company.works.some((work) => matchesJapanWork(work, { category: category.id, prefecture: filters.prefecture })) ? <button type="button" className={styles.connection} aria-label={`${company.name}の${category.label}を見る`} aria-controls={selected ? "japan-work-desktop-detail" : undefined} onClick={(event) => open(company.companyId, event.currentTarget, category.id)}><span aria-hidden="true">●</span><small>接点を見る</small></button> : <span className={styles.unconfirmed}>{filters.prefecture ? "地域未確認" : "未確認"}</span>}</td>)}
          </tr>)}</tbody>
        </table>
        {selected ? panel(selected, "desktop") : <aside className={styles.boardHint}><strong>会社名を知らなくても、大丈夫。</strong><p>気になる仕事との接点を開くと、日本での仕事内容と公式情報を確認できます。</p></aside>}
      </div>
    </div>

    <div className={styles.mobile}>{visible.map((company) => <article className={styles.card} key={company.companyId}>
      <h3><button className={styles.companyName} type="button" aria-expanded={selected?.companyId === company.companyId} aria-controls={selected?.companyId === company.companyId ? "japan-work-mobile-detail" : undefined} onClick={(event) => open(company.companyId, event.currentTarget)}>{company.name} <span aria-hidden="true">↗</span></button></h3>
      <p>{company.summary}</p>
      <div className={styles.cardJobs}>{japanWorkCategories.filter((category) => company.works.some((work) => matchesJapanWork(work, { category: category.id, prefecture: filters.prefecture }))).map((category) => <button type="button" aria-pressed={selection?.companyId === company.companyId && selection.category === category.id} key={category.id} onClick={(event) => open(company.companyId, event.currentTarget, category.id)}>{category.label}</button>)}</div>
      {comparisonButton(company)}
      {selected?.companyId === company.companyId ? panel(company, "mobile") : null}
    </article>)}</div>

    <section className={styles.comparison} aria-labelledby="japan-work-compare-title">
      <h2 id="japan-work-compare-title">気になる2社を並べる</h2>
      <p role="status" aria-live="polite">{compared.length} / 2社を選択中{compared.length ? `：${compared.map((company) => company.name).join("・")}` : "。企業の「比較に追加」から選べます。"}</p>
      {compared.length === 2 ? <p className={styles.note}>別の会社に入れ替えるときは、選択中の1社を外してください。比較には各社の全掲載情報を表示しています。</p> : null}
      <div className={styles.categories}>{compared.map((company) => <button type="button" key={company.companyId} onClick={() => toggleCompare(company.companyId)}>{company.name}を外す</button>)}</div>
      {compared.length === 2 ? <div className={styles.comparisonRows}>{comparisonRows.map((row) => <section key={row.label}><h3>{row.label}</h3><div>{compared.map((company) => <div key={company.companyId}><strong>{company.name}</strong><p>{row.value(company)}</p></div>)}</div></section>)}
        <section><h3>次に確認する</h3><div>{compared.map((company) => <div key={company.companyId}><strong>{company.name}</strong><p><a href={company.careerUrl} target="_blank" rel="noreferrer" data-japan-work-link="career" data-company={company.companyId}>公式採用情報を見る ↗</a></p><a href={`#evidence-${company.companyId}`}>このページの出典・業務情報へ</a></div>)}</div></section>
      </div> : null}
    </section>

    <section className={styles.directory} aria-labelledby="japan-work-evidence-title"><h2 id="japan-work-evidence-title">企業ごとの仕事内容と根拠</h2><p>確認できた仕事の例です。各社のすべての職種・拠点を網羅するものではありません。</p>
      {published.map((company) => <details id={`evidence-${company.companyId}`} key={company.companyId} onToggle={(event) => { if (event.currentTarget.open) { start(); trackEvent("japan_work_company_open", { company_id: company.companyId }); } }}><summary>{company.name} — 日本の仕事と出典</summary>{panels[company.companyId]}</details>)}
    </section>
    {children}
  </div>;
}
