"use client";

import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RankingCompanyName } from "@/components/RankingCompanyName";
import { semiconductorMarketCapMeta } from "@/data/semiconductor-market-cap";
import { addComparisonCompany, categoryExplanations, comparisonCompanyById, comparisonEventProperties, comparisonJapanWorks, comparisonMapId, domesticRank, rankingComparisonUrl, readRankingComparisonHash, type CompareAction, type CompareDestination, type CompareSource } from "@/lib/ranking-company-compare";
import { japanWorkRoute } from "@/data/japan-work";
import { isJapanWorkReviewExpired } from "@/lib/japan-work";
import { observeVisibleOnce } from "@/lib/observe-visible";
import { trackEvent } from "@/lib/analytics";
import styles from "./RankingCompanyCompare.module.css";

type Context = {
  ids: string[]; source: CompareSource; shown: boolean; notice: string;
  add: (id: string, source: CompareSource) => void; remove: (id: string) => void;
  open: () => void; close: () => void; example: (ids: [string, string]) => void;
  record: (action: CompareAction, destination?: CompareDestination) => void;
};
type Company = NonNullable<ReturnType<typeof comparisonCompanyById.get>>;
const CompareContext = createContext<Context | null>(null);

export function RankingCompanyCompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [source, setSource] = useState<CompareSource>("world");
  const [shown, setShown] = useState(false);
  const [notice, setNotice] = useState("");
  const opener = useRef<HTMLElement | null>(null);
  const seen = useRef(new Set<string>());
  function emit(action: CompareAction, selected: readonly string[], origin: CompareSource, destination?: CompareDestination) {
    const key = action === "entry_view" ? action : `${action}:${origin}:${action === "selection_start" ? "" : selected.join(",")}`;
    if (["entry_view", "selection_start", "result_view"].includes(action)) {
      if (seen.current.has(key)) return;
      seen.current.add(key);
    }
    try { trackEvent("ranking_company_compare", comparisonEventProperties(action, selected, origin, destination)); } catch { /* Browsing must work without analytics. */ }
  }
  useEffect(() => {
    function restore() {
      const state = readRankingComparisonHash(window.location.hash);
      if (state.kind === "anchor") return;
      setNotice("");
      if (state.kind === "invalid") { setIds([]); setShown(false); setNotice("比較リンクを復元できませんでした。掲載中の異なる2社を選んでください。"); return; }
      if (!document.querySelector('[data-ranking-comparison-result]')) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setIds(state.ids); setSource("shared_link"); setShown(true);
    }
    restore(); window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, []);
  function clearSharedHash() {
    if (readRankingComparisonHash(window.location.hash).kind !== "anchor") window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }
  function rememberOpener() { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }
  const value: Context = {
    ids, source, shown, notice,
    add(id, origin) {
      const next = addComparisonCompany(ids, id); setNotice(next.notice);
      if (next.ids.length === ids.length) return;
      clearSharedHash(); setIds(next.ids); setShown(false);
      try { trackEvent("ranking_compare_add", { company_id: id, source: origin }); } catch { /* Selection remains usable without analytics. */ }
      if (!ids.length) { setSource(origin); emit("selection_start", next.ids, origin); }
    },
    remove(id) { clearSharedHash(); setIds(ids.filter(value => value !== id)); setShown(false); setNotice(""); },
    open() { if (ids.length === 2) { rememberOpener(); setShown(true); setNotice(""); try { trackEvent("ranking_compare_execute", { company_a: ids[0], company_b: ids[1], source }); } catch { /* Comparison remains usable without analytics. */ } } },
    close() { setShown(false); },
    example(pair) { rememberOpener(); clearSharedHash(); setIds(pair); setSource("example"); setShown(true); setNotice(""); emit("selection_start", pair, "example"); },
    record(action, destination) { emit(action, ids, source, destination); },
  };
  return <CompareContext.Provider value={value}>
    <div className={ids.length ? styles.reserve : undefined}>{children}</div>
    {(ids.length > 0 || notice) && <aside className={styles.tray} hidden={shown && !notice} aria-label="比較する企業の選択">
      {ids.length > 0 && <Selection context={value} />}
      <p role="status">{notice || (ids.length === 1 ? "あと1社をランキングから選んでください。" : "2社を選択しました。")}</p>
    </aside>}
    {shown && ids.length === 2 && typeof document !== "undefined" && createPortal(
      <ComparisonDialog key={`${source}:${ids.join(",")}`} context={value} opener={opener} />, document.body,
    )}
  </CompareContext.Provider>;
}

function Selection({ context }: { context: Context }) {
  return <div className={styles.selection}>
    <div className={styles.slots}>{[0, 1].map(index => {
      const company = comparisonCompanyById.get(context.ids[index]);
      return company ? <div className={styles.slot} key={index}><span className={styles.slotLabel}>{index === 0 ? "A" : "B"}</span><RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name} /><button type="button" className={styles.remove} onClick={() => context.remove(company.id)} aria-label={`${company.name}を比較から外す`}>×</button></div>
        : <div className={`${styles.slot} ${styles.emptySlot}`} key={index}><span className={styles.slotLabel}>B</span><span>あと1社を選択</span></div>;
    })}</div>
    <button type="button" className={styles.primary} disabled={context.ids.length !== 2} onClick={context.open}>2社を比較する<span aria-hidden="true"> →</span></button>
  </div>;
}

export function RankingCompareButton({ id, source }: { id: string; source: "world" | "japan" }) {
  const context = useContext(CompareContext);
  if (!context) return null;
  const selected = context.ids.includes(id);
  return <button type="button" className={styles.button} data-ranking-compare-id={id} aria-pressed={selected} aria-label={`${comparisonCompanyById.get(id)?.name}を${selected ? "比較から外す" : "比較に追加"}`} onClick={() => selected ? context.remove(id) : context.add(id, source)}><span aria-hidden="true">{selected ? "✓" : "＋"}</span> {selected ? "選択中" : "比較"}</button>;
}

export function RankingCompanyComparePanel() {
  const context = useContext(CompareContext);
  const entry = useRef<HTMLHeadingElement>(null);
  useEffect(() => entry.current && context ? observeVisibleOnce(entry.current, () => context.record("entry_view")) : undefined, []); // Entry is once per mount.
  if (!context) return null;
  return <aside className={styles.panel} aria-labelledby="ranking-compare-title">
    <h2 id="ranking-compare-title" ref={entry} tabIndex={-1}>気になる2社の違いを見る</h2>
    <p>ランキングの「＋ 比較」で2社を選ぶと、事業・役割・規模を並べて見られます。</p>
    <div className={styles.actions}><span className={styles.small}>比較例を試す</span><button type="button" className={styles.button} onClick={() => context.example(["nvidia", "tsmc"])}>NVIDIAとTSMC <span aria-hidden="true">↗</span></button><button type="button" className={styles.button} onClick={() => context.example(["tokyo-electron", "advantest"])}>東京エレクトロンとアドバンテスト <span aria-hidden="true">↗</span></button></div>
    {context.ids.length > 0 && <Selection context={context} />}
  </aside>;
}

function ComparisonDialog({ context, opener }: { context: Context; opener: React.RefObject<HTMLElement | null> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const backdropPress = useRef(false);
  // Keep one lifecycle per mounted pair; context updates must not reopen the dialog.
  const initialContext = useRef(context);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    const returnTarget = opener.current;
    document.body.style.overflow = "hidden";
    element.showModal();
    heading.current?.focus({ preventScroll: true });
    const stopObserving = heading.current ? observeVisibleOnce(heading.current, () => initialContext.current.record("result_view")) : undefined;
    return () => {
      stopObserving?.();
      element.close();
      document.body.style.overflow = previousOverflow;
      const target = returnTarget?.isConnected && returnTarget !== document.body && !returnTarget.matches(":disabled") ? returnTarget : document.getElementById("ranking-compare-title");
      target?.focus({ preventScroll: true });
    };
  }, [opener]);
  function outside(event: React.MouseEvent<HTMLDialogElement> | React.PointerEvent<HTMLDialogElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  }
  function keepFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), textarea:not(:disabled), [tabindex="0"]'))
      .filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }
  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="ranking-comparison-title" onKeyDown={keepFocus} onCancel={event => { event.preventDefault(); context.close(); }}
    onPointerDown={event => { backdropPress.current = outside(event); }}
    onClick={event => { if (backdropPress.current && outside(event)) context.close(); backdropPress.current = false; }}>
    <ComparisonResult context={context} heading={heading} />
  </dialog>;
}

function ResearchLinks({ company, context }: { company: Company; context: Context }) {
  return <div className={styles.research}>
    {company.companySlug && <a href={`/companies/${company.companySlug}`} onClick={() => context.record("related_click", "company")}>事業・仕事内容を見る →</a>}
    {comparisonMapId(company) && <a href={`/industry-map#company=${comparisonMapId(company)}`} onClick={() => context.record("related_click", "industry_map")}>この会社を業界地図で見る →</a>}
    {!company.companySlug && !comparisonMapId(company) && <p className={styles.small}>企業詳細・企業指定の地図は未収録です。</p>}
  </div>;
}

function JapanWorks({ company, context, asOf }: { company: Company; context: Context; asOf: string }) {
  const works = comparisonJapanWorks(company.id);
  return <div className={styles.cell}>
    <h3>{company.name}</h3>
    {!works.length ? <p>日本での仕事内容は、この比較では未掲載です。</p> : <>
      {works.slice(0, 2).map(work => <div key={work.id} className={styles.work}>
        <p className={styles.small}>{work.titleKind === "activity" ? "事業機能の紹介（職種名ではありません）" : "公式の職種名"}</p>
        <p><strong>{work.officialTitle}</strong></p>
        <p>勤務地・働く場所：{work.workplace}</p>
        <p className={styles.small}>{work.unknowns}</p>
        <p className={styles.small}>確認日：<time dateTime={work.checkedAt}>{work.checkedAt}</time></p>
        {isJapanWorkReviewExpired(work, asOf) && <p className={styles.small}>再確認時期を過ぎています。前回確認時の情報です。</p>}
      </div>)}
      <p className={styles.small}>確認できた仕事の例です。現在の募集状況を示すものではありません。</p>
      {works.length > 2 && <p className={styles.small}>ほか{works.length - 2}件の業務情報があります。</p>}
      <a href={`${japanWorkRoute}#evidence-${company.id}`} onClick={() => context.record("related_click", "japan_work")}>仕事内容と根拠を見る →</a>
    </>}
    <ResearchLinks company={company} context={context} />
  </div>;
}

type ComparisonTab = "overview" | "work";
function ComparisonResult({ context, heading }: { context: Context; heading: React.RefObject<HTMLHeadingElement | null> }) {
  const [asOf] = useState(() => new Date().toISOString().slice(0, 10));
  const [tab, setTab] = useState<ComparisonTab>("overview");
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState("");
  const [copying, setCopying] = useState(false);
  const active = useRef(true), busy = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const pair = context.ids.map(id => comparisonCompanyById.get(id)!);
  const maxValue = Math.max(...pair.map(company => company.marketCapUsdB));
  async function copy() {
    if (busy.current) return;
    busy.current = true; setCopying(true); setStatus(""); setManual("");
    const url = rankingComparisonUrl(window.location.origin, context.ids);
    try { await navigator.clipboard.writeText(url); if (active.current) { setStatus("比較リンクをコピーしました。"); context.record("copy_success"); } }
    catch { if (active.current) { setManual(url); setStatus("自動コピーできませんでした。下のリンクを選択してコピーしてください。"); } }
    finally { busy.current = false; if (active.current) setCopying(false); }
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const next = event.key === "Home" ? "overview" : event.key === "End" ? "work" : ["ArrowLeft", "ArrowRight"].includes(event.key) ? (tab === "overview" ? "work" : "overview") : undefined;
    if (!next) return;
    event.preventDefault(); setTab(next);
    document.getElementById(`ranking-comparison-tab-${next}`)?.focus();
  }
  const rows: { title: string; render: (company: Company) => ReactNode }[] = [
    { title: "業界での役割", render: company => <><strong>{company.category}</strong>{categoryExplanations(company).map(zone => <p key={zone.label}>{zone.label}：{zone.description}</p>)}</> },
    { title: "主な事業", render: company => <p>{company.mainBusiness}</p> },
    { title: "時価総額・順位", render: company => <>
      <strong className={styles.amount}>{company.marketCapDisplay}</strong>
      <span className={styles.track} aria-hidden="true"><span style={{ width: `${company.marketCapUsdB / maxValue * 100}%` }} /></span>
      <p>世界{company.rank}位{domesticRank(company.id) ? ` / 日本${domesticRank(company.id)}位` : ""}</p>
      <a href={company.sourceUrl} rel="noopener noreferrer" target="_blank">数値の出典 ↗</a>
    </> },
    { title: "さらに調べる", render: company => <ResearchLinks company={company} context={context} /> },
  ];
  return <div className={styles.result} data-ranking-comparison-result>
    <header className={styles.dialogHeader}>
      <div className={styles.titleRow}><h2 id="ranking-comparison-title" ref={heading} tabIndex={-1}>2社の違い</h2><button type="button" className={styles.button} onClick={context.close}>閉じる <span aria-hidden="true">×</span></button></div>
      <div className={styles.pair}>{pair.map((company, index) => <div className={styles.identity} key={company.id}>
        <span className={styles.slotLabel}>{index === 0 ? "A" : "B"}</span>
        <RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name} />
        <span className={styles.small}>{company.country} · {company.category}</span>
      </div>)}</div>
      <div className={styles.tabs} role="tablist" aria-label="比較項目">
        {(["overview", "work"] as const).map(value => <button key={value} type="button" id={`ranking-comparison-tab-${value}`} role="tab" aria-selected={tab === value} aria-controls={`ranking-comparison-panel-${value}`} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)} onKeyDown={tabKey}>{value === "overview" ? "違いの概要" : "日本の仕事"}</button>)}
      </div>
    </header>
    <div className={styles.dialogBody}>
      <div id="ranking-comparison-panel-overview" role="tabpanel" aria-labelledby="ranking-comparison-tab-overview" hidden={tab !== "overview"} tabIndex={0}>
        <p className={styles.small}>基準日：<time dateTime={semiconductorMarketCapMeta.dataAsOf}>{semiconductorMarketCapMeta.dataAsOf}</time> ／ 米ドル。順位は企業の優劣や就職先としての評価ではありません。</p>
        {rows.map(row => <section key={row.title} className={styles.row}><h3>{row.title}</h3><div className={styles.pair}>{pair.map(company => <div role="group" aria-label={company.name} className={styles.cell} key={company.id}>{row.render(company)}</div>)}</div></section>)}
        <p className={styles.small}>棒は0ドルを起点に2社共通の尺度で表示。総合企業の値は企業全体の時価総額です。役割の説明は分類の一般的な説明で、取引関係・競合関係を示すものではありません。</p>
      </div>
      <div id="ranking-comparison-panel-work" className={styles.workPanel} role="tabpanel" aria-labelledby="ranking-comparison-tab-work" hidden={tab !== "work"} tabIndex={0}>
        <div className={styles.workPair}>{pair.map(company => <JapanWorks company={company} context={context} asOf={asOf} key={company.id} />)}</div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.actions}><button type="button" className={styles.button} disabled={copying} onClick={copy}>この比較のリンクをコピー</button><button type="button" className={styles.button} onClick={context.close}>ランキングで選び直す</button></div>
        <p className={styles.small}>共有リンクは閲覧時点の掲載データを表示します。過去の数値を固定保存するリンクではありません。</p>
        <p role="status">{status}</p>{manual && <label>手動コピー用リンク<textarea className={styles.manual} readOnly rows={3} value={manual} onFocus={event => event.currentTarget.select()} /></label>}
      </footer>
    </div>
  </div>;
}
