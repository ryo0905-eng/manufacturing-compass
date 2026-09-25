"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
  open: () => void; example: (ids: [string,string]) => void;
  record: (action: CompareAction, destination?: CompareDestination) => void;
  heading: React.RefObject<HTMLHeadingElement | null>;
};
const CompareContext = createContext<Context | null>(null);
export function RankingCompanyCompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [source, setSource] = useState<CompareSource>("world");
  const [shown, setShown] = useState(false);
  const [notice, setNotice] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
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
      setIds(state.ids); setSource("shared_link"); setShown(true); setFocusRequest(value => value + 1);
    }
    restore(); window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, []);
  useEffect(() => {
    if (shown && focusRequest) { heading.current?.scrollIntoView({ block: "start", behavior: "instant" }); heading.current?.focus({ preventScroll: true }); }
  }, [shown, focusRequest]);
  function clearSharedHash() {
    if (readRankingComparisonHash(window.location.hash).kind !== "anchor") window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }
  const value: Context = {
    ids, source, shown, notice, heading,
    add(id, origin) {
      const next = addComparisonCompany(ids, id); setNotice(next.notice);
      if (next.ids.length === ids.length) return;
      clearSharedHash(); setIds(next.ids); setShown(false);
      if (!ids.length) { setSource(origin); emit("selection_start", next.ids, origin); }
    },
    remove(id) { clearSharedHash(); setIds(ids.filter(value => value !== id)); setShown(false); setNotice(""); },
    open() { if (ids.length === 2) { setShown(true); setFocusRequest(value => value + 1); setNotice(""); } },
    example(pair) { clearSharedHash(); setIds(pair); setSource("example"); setShown(true); setNotice(""); setFocusRequest(value => value + 1); emit("selection_start", pair, "example"); },
    record(action, destination) { emit(action, ids, source, destination); },
  };
  return <CompareContext.Provider value={value}><div className={ids.length ? styles.reserve : undefined}>{children}</div>{ids.length > 0 && (!shown || notice) && <aside className={styles.tray} aria-label="比較する企業の選択"><Selection context={value} /><p role="status">{notice || (ids.length === 1 ? "あと1社をランキングから選んでください。" : "2社を選択しました。")}</p></aside>}</CompareContext.Provider>;
}
function Selection({ context }: { context: Context }) {
  return <div className={styles.selection}>{context.ids.map(id => <button className={styles.button} type="button" key={id} onClick={() => context.remove(id)} aria-label={`${comparisonCompanyById.get(id)!.name}を比較から外す`}>{comparisonCompanyById.get(id)!.name} ×</button>)}{context.ids.length === 2 && <button className={styles.button} type="button" onClick={context.open}>違いを見る</button>}</div>;
}
export function RankingCompareButton({ id, source }: { id: string; source: "world" | "japan" }) {
  const context = useContext(CompareContext);
  if (!context) return null;
  const selected = context.ids.includes(id);
  return <button type="button" className={styles.button} aria-pressed={selected} aria-label={`${comparisonCompanyById.get(id)?.name}を${selected ? "比較から外す" : "比較に追加"}`} onClick={() => selected ? context.remove(id) : context.add(id, source)}>{selected ? "選択中・外す" : "比較に追加"}</button>;
}
export function RankingCompanyComparePanel() {
  const context = useContext(CompareContext);
  const entry = useRef<HTMLHeadingElement>(null);
  useEffect(() => entry.current && context ? observeVisibleOnce(entry.current, () => context.record("entry_view")) : undefined, []); // Entry is once per mount.
  if (!context) return null;
  return <aside className={styles.panel} aria-labelledby="ranking-compare-title">
    <h2 id="ranking-compare-title" ref={entry}>気になる2社の違いを見る</h2>
    <p>ランキングから2社を選んで、事業と業界での役割を比べられます。</p>
    <div className={styles.actions}><button type="button" onClick={() => context.example(["nvidia", "tsmc"])}>NVIDIAとTSMC</button><button type="button" onClick={() => context.example(["tokyo-electron", "advantest"])}>東京エレクトロンとアドバンテスト</button></div>
    {!context.ids.length && <p>まだ選択していません。上の例を試すか、ランキングの「比較に追加」を押してください。</p>}
    {context.ids.length > 0 && <Selection context={context} />}
    <p role="status">{context.notice}</p>
    {context.shown && context.ids.length === 2 && <ComparisonResult key={`${context.source}:${context.ids.join(",")}`} context={context} />}
  </aside>;
}
function ComparisonResult({ context }: { context: Context }) {
  const [asOf] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState("");
  const [copying, setCopying] = useState(false);
  const active = useRef(true), busy = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => context.heading.current ? observeVisibleOnce(context.heading.current, () => context.record("result_view")) : undefined, []);
  const pair = context.ids.map(id => comparisonCompanyById.get(id)!);
  async function copy() {
    if (busy.current) return;
    busy.current = true; setCopying(true); setStatus(""); setManual("");
    const url = rankingComparisonUrl(window.location.origin, context.ids);
    try { await navigator.clipboard.writeText(url); if (active.current) { setStatus("比較リンクをコピーしました。"); context.record("copy_success"); } }
    catch { if (active.current) { setManual(url); setStatus("自動コピーできませんでした。下のリンクを選択してコピーしてください。"); } }
    finally { busy.current = false; if (active.current) setCopying(false); }
  }
  const rows: { title: string; render: (company: typeof pair[number]) => ReactNode }[] = [
    { title: "企業・国／地域", render: company => <p>{company.name} / {company.country}</p> },
    { title: "業界での役割", render: company => <><strong>{company.category}</strong>{categoryExplanations(company).map(zone => <p key={zone.label}>{zone.label}：{zone.description}</p>)}<small className={styles.small}>分類の一般的な説明です。各社の事業範囲は下欄も確認してください。</small></> },
    { title: "主な事業", render: company => <p>{company.mainBusiness}</p> },
    { title: "日本で確認できた仕事", render: company => {
      const works = comparisonJapanWorks(company.id);
      if (!works.length) return <p>日本での仕事内容は、この比較では未掲載です。</p>;
      return <>
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
      </>;
    } },
    { title: "時価総額・順位", render: company => <><p><strong>{company.marketCapDisplay}</strong> / 世界{company.rank}位{domesticRank(company.id) ? ` / 日本${domesticRank(company.id)}位` : ""}</p><p className={styles.small}>基準日：{company.dataAsOf} / 米ドル</p><a href={company.sourceUrl}>数値の出典</a></> },
    { title: "さらに調べる", render: company => <>{company.companySlug && <a href={`/companies/${company.companySlug}`} onClick={() => context.record("related_click", "company")}>事業・仕事内容を見る →</a>}{comparisonMapId(company) && <a href={`/industry-map#company=${comparisonMapId(company)}`} onClick={() => context.record("related_click", "industry_map")}>この会社を業界地図で見る →</a>}{!company.companySlug && !comparisonMapId(company) && <p className={styles.small}>企業詳細・企業指定の地図は未収録です。</p>}</> },
  ];
  return <div data-ranking-comparison-result>
    <h3 ref={context.heading} tabIndex={-1}>2社の違い：{pair[0].name} / {pair[1].name}</h3>
    <p>基準日：{semiconductorMarketCapMeta.dataAsOf}。順位は掲載元の対象企業内での位置です。企業の優劣や就職先としての評価ではありません。</p>
    <p className={styles.small}>総合企業の時価総額は半導体部門だけの値ではありません。分類だけから取引関係・競合関係を判断しないでください。</p>
    {rows.map(row => <section key={row.title} className={styles.row}><h4>{row.title}</h4><div className={styles.pair}>{pair.map((company,index) => <div className={styles.cell} key={company.id}><strong>{index === 0 ? "A" : "B"}：{company.name}</strong>{row.render(company)}</div>)}</div></section>)}
    <button type="button" disabled={copying} onClick={copy}>この比較のリンクをコピー</button>
    <p className={styles.small}>共有リンクは閲覧時点の掲載データを表示します。過去の数値を固定保存するリンクではありません。</p>
    <p role="status">{status}</p>{manual && <label>手動コピー用リンク<textarea className={styles.manual} readOnly rows={3} value={manual} onFocus={event => event.currentTarget.select()} /></label>}
  </div>;
}
