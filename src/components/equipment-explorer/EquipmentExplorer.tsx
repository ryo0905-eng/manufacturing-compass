"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, InputField, SelectField, SelectionButton } from "@/components/ui/Controls";
import { trackEquipmentEvent } from "@/lib/analytics";
import { emptyEquipmentFilters, equipmentQuery, factText, filterEquipment, parseEquipmentFilters, toggleEquipmentComparison, type EquipmentFilters } from "@/lib/equipment-explorer";
import type { EquipmentProcess, EquipmentRecord, Fact } from "@/types/semiconductor-database";
import styles from "./equipment.module.css";

type Manufacturer = { id: string; name: string; href: string };
type Props = { records: EquipmentRecord[]; processes: EquipmentProcess[]; manufacturers: Manufacturer[]; initial: EquipmentFilters };

function FactValue({ fact }: { fact?: Fact }) {
  return <><strong>{factText(fact)}</strong><small>{fact?.status === "verified" ? fact.condition : fact?.reason}</small></>;
}

const etchFacts = [["wafer", "対応ウェーハ径"], ["chambers", "装置構成"], ["application", "対象アプリケーション・膜種"], ["plasma", "プラズマ方式"], ["substrate", "対応基板"]];

export function EquipmentExplorer({ records, processes, manufacturers, initial }: Props) {
  const [filters, setFilters] = useState(initial);
  const [shareUrl, setShareUrl] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const names = Object.fromEntries(manufacturers.map(m => [m.id, m.name]));
  const results = filterEquipment(records, filters, names);
  const selected = filters.compare.flatMap(id => records.find(r => r.id === id) ?? []);
  const process = processes.find(p => p.id === filters.process);
  useEffect(() => {
    const restore = () => { setFilters(parseEquipmentFilters(new URLSearchParams(window.location.search), records)); setShareUrl(""); };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [records]);
  function change(next: EquipmentFilters, action: "process" | "manufacturer" | "category" | "clear") {
    setFilters(next); setShareUrl(""); setShareMessage("");
    trackEquipmentEvent("equipment_filter", { action, result_count: filterEquipment(records, next, names).length });
  }
  async function share() {
    const query = equipmentQuery(filters);
    const url = `${window.location.origin}/equipment${query ? `?${query}` : ""}`;
    setShareUrl(url);
    try { await navigator.clipboard.writeText(url); setShareMessage("共有URLをコピーしました。"); }
    catch { setShareMessage("下のURLを選択してコピーしてください。"); }
    trackEquipmentEvent("equipment_share", { action: "url", result_count: results.length, selected_count: selected.length });
  }
  function toggle(id: string) {
    const compare = toggleEquipmentComparison(filters.compare, id);
    setFilters({ ...filters, compare }); setShareUrl(""); setShareMessage("");
    trackEquipmentEvent("equipment_compare", { action: filters.compare.includes(id) ? "remove" : "add", selected_count: compare.length });
  }
  return <div className={styles.workspace}>
    <section className={styles.processPanel} aria-labelledby="equipment-process-title">
      <h2 id="equipment-process-title">工程から装置へ</h2>
      <p>工程を選ぶと、関連する機種とメーカーが絞り込まれます。以下は探索用の分類で、工程の実行順や取引関係を示すものではありません。</p>
      <div className={styles.processes}>
        <SelectionButton selected={filters.process === "all"} onClick={() => change({ ...filters, process: "all" }, "process")}>全工程</SelectionButton>
        {processes.map(p => <SelectionButton key={p.id} selected={filters.process === p.id} onClick={() => change({ ...filters, process: p.id }, "process")}><span>{p.name}<small>{p.description}</small></span></SelectionButton>)}
      </div>
      {process && <div className={styles.context}><strong>{process.name} → 装置 {results.length}機種 → メーカー {new Set(results.map(r => r.manufacturerId)).size}社</strong><span><Link href={process.guide}>工程の解説</Link><Link href={process.lab} onClick={() => trackEquipmentEvent("equipment_related", { action: "lab", process_id: process.id })}>原理を操作して学ぶ →</Link></span></div>}
    </section>
    <section className={styles.searchPanel} aria-label="装置の検索と絞り込み">
      <form onSubmit={event => { event.preventDefault(); trackEquipmentEvent("equipment_search", { action: "submit", result_count: results.length }); }}>
        <InputField id="equipment-query" label="機種・メーカー・技術を検索" placeholder="例：EUV、CELLESTA、CMP" maxLength={120} value={filters.query} onChange={event => { setFilters({ ...filters, query: event.target.value }); setShareUrl(""); setShareMessage(""); }}/>
        <SelectField id="equipment-manufacturer" label="メーカー" value={filters.manufacturer} onChange={event => change({ ...filters, manufacturer: event.target.value }, "manufacturer")}><option value="all">すべてのメーカー</option>{manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</SelectField>
        <SelectField id="equipment-category" label="分類" value={filters.category} onChange={event => change({ ...filters, category: event.target.value }, "category")}><option value="all">すべての分類</option>{[...new Set(records.map(r => r.category))].map(category => <option key={category}>{category}</option>)}</SelectField>
        <Button type="submit">検索</Button>
      </form>
      <div className={styles.toolbar}><p role="status">{results.length} / {records.length}機種 · 比較 {selected.length} / 3件</p><Button onClick={() => change({ ...emptyEquipmentFilters, compare: [] }, "clear")}>条件と比較をクリア</Button><Button onClick={share}>条件・比較を共有</Button></div>
      <p className={styles.note}>共有操作をすると、検索語と選択した条件を含むURLを作成します。社内情報や個人情報を検索語に含めないでください。</p>
      <p role="status">{shareMessage}</p>{shareUrl && <InputField id="equipment-share" label="共有URL" readOnly value={shareUrl} onFocus={event => event.target.select()}/>}
    </section>
    <section aria-labelledby="equipment-results-title">
      <h2 id="equipment-results-title">装置・公開仕様</h2>
      <p>公式に確認できた範囲を掲載しています。数値仕様は条件とセットで読み、大小だけで優劣を決めないでください。発売時の発表資料は、現在の販売状況を保証しません。</p>
      {!results.length && <p className={styles.empty}>該当する装置がありません。条件を減らすか、別の表記で探してください。</p>}
      <div className={styles.records}>{results.map(record => {
        const maker = manufacturers.find(m => m.id === record.manufacturerId)!;
        return <article className={styles.record} key={record.id}>
          <div className={styles.recordHeading}><div><small>{record.category} · {maker.name}</small><h3>{record.name}</h3></div><SelectionButton selected={filters.compare.includes(record.id)} disabled={!filters.compare.includes(record.id) && selected.length === 3} onClick={() => toggle(record.id)}>{filters.compare.includes(record.id) ? "比較から外す" : "比較に追加"}<span className={styles.srOnly}>：{record.name}</span></SelectionButton></div>
          <p>{record.summary}</p>
          <details onToggle={event => { if (event.currentTarget.open) trackEquipmentEvent("equipment_detail", { action: "open", equipment_id: record.id }); }}><summary>公開仕様・根拠・関連情報を開く</summary>
            <dl className={styles.facts}>{(record.processIds.includes("etch") ? [...etchFacts, ["throughput", "処理能力"]] : [["feature", "技術上の特徴"], ["specification", "確認した数値仕様"], ["throughput", "処理能力"]]).map(([key, label]) => <div key={key}><dt>{label}</dt><dd><FactValue fact={record.facts[key]}/></dd></div>)}</dl>
            <nav className={styles.related} aria-label={`${record.name}の関連情報`}><Link href={maker.href} onClick={() => trackEquipmentEvent("equipment_related", { action: "company", equipment_id: record.id })}>{maker.name}の企業情報 →</Link>{record.processIds.map(id => {
              const p = processes.find(item => item.id === id)!;
              return <Link href={p.lab} key={id} onClick={() => trackEquipmentEvent("equipment_related", { action: "lab", equipment_id: record.id, process_id: id })}>{p.name}の原理を体験 →</Link>;
            })}</nav>
            <h4>公式出典と根拠箇所</h4><ul>{record.sources.map(source => <li key={source.id}><a href={source.url}>{source.publisher}：{source.title}</a> · 確認日 <time dateTime={source.checkedAt}>{source.checkedAt}</time></li>)}</ul>
            {Object.entries(record.facts).map(([key, fact]) => fact.status === "verified" && <p className={styles.note} key={key}>{fact.evidence.locator}：<q>{fact.evidence.quote}</q></p>)}
          </details>
          <small>最終確認：{record.lastChecked}</small>
        </article>;
      })}</div>
    </section>
    <section className={styles.comparison} aria-labelledby="equipment-compare-title">
      <h2 id="equipment-compare-title">機種を同じ項目で比べる</h2>
      <p>2〜3機種を選択してください。仕様の確認条件が異なるため、順位や勝者は表示しません。選択済みの機種は検索条件を変えても残ります。</p>
      {selected.length < 2 ? <p>比較中：{selected.map(r => r.name).join("、") || "未選択"}（あと{2 - selected.length}件選ぶと比較できます）</p> : <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="装置比較表。狭い画面では横にスクロールできます"><table><caption>公開情報による機種比較 · 狭い画面では横にスクロール</caption><thead><tr><th scope="col">項目</th>{selected.map(r => <th scope="col" key={r.id}>{r.name}<Button onClick={() => toggle(r.id)} aria-label={`${r.name}を比較から外す`}>外す</Button></th>)}</tr></thead><tbody>
        <tr><th scope="row">メーカー</th>{selected.map(r => <td key={r.id}>{names[r.manufacturerId]}</td>)}</tr>
        <tr><th scope="row">対応工程・製品分類</th>{selected.map(r => <td key={r.id}>{r.processIds.map(id => processes.find(p => p.id === id)?.name).join("・")}<small>{r.category}</small></td>)}</tr>
        <tr><th scope="row">主要用途</th>{selected.map(r => <td key={r.id}>{r.summary}</td>)}</tr>
        {[...(selected.some(r => !r.processIds.includes("etch")) ? [["feature", "技術上の特徴"], ["specification", "公開仕様と条件"]] : []), ["throughput", "処理能力"], ...(selected.some(r => r.processIds.includes("etch")) ? etchFacts : [])].map(([key, label]) => <tr key={key}><th scope="row">{label}</th>{selected.map(r => <td key={r.id}><FactValue fact={r.facts[key]}/></td>)}</tr>)}
        <tr><th scope="row">出典・確認日</th>{selected.map(r => <td key={r.id}>{r.sources.map(s => <p key={s.id}><a href={s.url}>{s.publisher}公式</a><small>{s.checkedAt}</small></p>)}</td>)}</tr>
      </tbody></table></div>}
    </section>
  </div>;
}
