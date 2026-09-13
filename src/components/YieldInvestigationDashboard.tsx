"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  changeHistory,
  confirmationRuns,
  dashboardPeriods,
  defectLabels,
  yieldDashboardLots,
} from "@/data/yield-dashboard";
import {
  averageConditions,
  defectKeys,
  filterDashboardLots,
  groupDefectRate,
  groupLots,
  lotDefective,
  summarizeDefects,
  summarizeLots,
  type DashboardFilters,
  type DashboardLot,
  type DefectKey,
} from "@/lib/yield-dashboard";
import { trackEvent } from "@/lib/analytics";
import styles from "./YieldInvestigationDashboard.module.css";

type Mode = "guided" | "free";
const initialFilters: DashboardFilters = {
  dateStart: dashboardPeriods.all.start,
  dateEnd: dashboardPeriods.all.end,
  product: "",
  equipment: "",
  focusDefect: "",
};
const percent = (value: number | null, digits = 1) => value === null ? "—" : `${(value * 100).toFixed(digits)}%`;
const number = (value: number) => value.toLocaleString("ja-JP");
const defectRate = (lot: DashboardLot, defect: DefectKey) => lot.inspected ? lot.defects[defect] / lot.inspected : 0;

const guideCopy = [
  ["異常期間を見つける", "歩留まり推移で、落ち込みが続く期間を選びます。"],
  ["増えた不良を見つける", "選択期間の不良内訳から、突出した項目を選びます。"],
  ["製品と装置を絞る", "処理数も見ながら、同じ不良が偏る組み合わせを選びます。"],
  ["正常ロットと比較する", "ロット一覧から正常群と異常群を選び、工程条件の差を見ます。"],
  ["変更履歴と照合する", "時刻と対象装置が合う履歴を選び、原因候補として記録します。"],
  ["確認実験で検証する", "通常データとは別の確認実験を開き、条件を戻した結果を比べます。"],
] as const;

export function YieldInvestigationDashboard() {
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("guided");
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [guideStep, setGuideStep] = useState(0);
  const [normalIds, setNormalIds] = useState<string[]>([]);
  const [abnormalIds, setAbnormalIds] = useState<string[]>([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const [showExperiment, setShowExperiment] = useState(false);
  const started = useRef(false);
  const reached = useRef(new Set<number>());
  const completed = useRef(false);
  const explanationViewed = useRef(false);

  const filteredLots = useMemo(() => filterDashboardLots(yieldDashboardLots, filters), [filters]);
  const summary = useMemo(() => summarizeLots(filteredLots), [filteredLots]);
  const dateScope = useMemo(() => yieldDashboardLots.filter((lot) =>
    (!filters.product || lot.product === filters.product)
    && (!filters.equipment || lot.equipment === filters.equipment)), [filters.product, filters.equipment]);
  const daily = useMemo(() => groupLots(dateScope, "date"), [dateScope]);
  const defects = useMemo(() => summarizeDefects(filteredLots), [filteredLots]);
  const productScope = useMemo(() => yieldDashboardLots.filter((lot) => lot.date >= filters.dateStart && lot.date <= filters.dateEnd && (!filters.equipment || lot.equipment === filters.equipment)), [filters.dateStart, filters.dateEnd, filters.equipment]);
  const equipmentScope = useMemo(() => yieldDashboardLots.filter((lot) => lot.date >= filters.dateStart && lot.date <= filters.dateEnd && (!filters.product || lot.product === filters.product)), [filters.dateStart, filters.dateEnd, filters.product]);
  const products = useMemo(() => filters.focusDefect ? groupDefectRate(productScope, "product", filters.focusDefect) : groupLots(productScope, "product"), [productScope, filters.focusDefect]);
  const equipment = useMemo(() => filters.focusDefect ? groupDefectRate(equipmentScope, "equipment", filters.focusDefect) : groupLots(equipmentScope, "equipment"), [equipmentScope, filters.focusDefect]);
  const sortedLots = useMemo(() => [...filteredLots].sort((left, right) => {
    if (filters.focusDefect) return defectRate(right, filters.focusDefect) - defectRate(left, filters.focusDefect);
    return (right.good / right.inspected) - (left.good / left.inspected);
  }), [filteredLots, filters.focusDefect]);
  const normalLots = useMemo(() => yieldDashboardLots.filter((lot) => normalIds.includes(lot.id)), [normalIds]);
  const abnormalLots = useMemo(() => yieldDashboardLots.filter((lot) => abnormalIds.includes(lot.id)), [abnormalIds]);
  const normalConditions = useMemo(() => averageConditions(normalLots), [normalLots]);
  const abnormalConditions = useMemo(() => averageConditions(abnormalLots), [abnormalLots]);
  const suggestedNormal = yieldDashboardLots.find((lot) => lot.date === "2026-08-10" && lot.product === "AX-7" && lot.equipment === "CVD-02")!;
  const suggestedAbnormal = yieldDashboardLots.find((lot) => lot.date === "2026-08-11" && lot.product === "AX-7" && lot.equipment === "CVD-02")!;

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const target = document.getElementById("dashboard-design-guide");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || explanationViewed.current) return;
      explanationViewed.current = true;
      trackEvent("yield_dashboard_design_view", { ui_version: "guided-v1" });
      observer.disconnect();
    }, { threshold: .2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function begin(action: string, activeMode: Mode = mode) {
    if (started.current) return;
    started.current = true;
    trackEvent("yield_dashboard_start", { mode: activeMode, action, ui_version: "guided-v1" });
  }

  function reach(step: number) {
    setGuideStep((current) => Math.max(current, step));
    if (!reached.current.has(step)) {
      reached.current.add(step);
      trackEvent("yield_dashboard_guide_step", { step, mode, ui_version: "guided-v1" });
    }
  }

  function selectPeriod(key: keyof typeof dashboardPeriods) {
    begin("period");
    const period = dashboardPeriods[key];
    setFilters((current) => ({ ...current, dateStart: period.start, dateEnd: period.end }));
    if (key === "anomaly") reach(1);
  }

  function selectDefect(key: DefectKey) {
    begin("defect");
    setFilters((current) => ({ ...current, focusDefect: current.focusDefect === key ? "" : key }));
    if (key === "thickness") reach(2);
  }

  function selectDimension(dimension: "product" | "equipment", value: string) {
    begin(dimension);
    setFilters((current) => ({ ...current, [dimension]: current[dimension] === value ? "" : value }));
    const nextProduct = dimension === "product" ? value : filters.product;
    const nextEquipment = dimension === "equipment" ? value : filters.equipment;
    if (nextProduct === "AX-7" && nextEquipment === "CVD-02") reach(3);
  }

  function addComparison(lot: DashboardLot, group: "normal" | "abnormal") {
    begin("lot_compare");
    if (group === "normal") {
      setAbnormalIds((current) => current.filter((id) => id !== lot.id));
      setNormalIds((current) => current.includes(lot.id) ? current.filter((id) => id !== lot.id) : [...current.slice(-2), lot.id]);
    } else {
      setNormalIds((current) => current.filter((id) => id !== lot.id));
      setAbnormalIds((current) => current.includes(lot.id) ? current.filter((id) => id !== lot.id) : [...current.slice(-2), lot.id]);
    }
  }

  useEffect(() => {
    if (normalIds.length && abnormalIds.length) reach(4);
  }, [normalIds, abnormalIds]);

  function chooseHistory(id: string) {
    begin("history");
    setSelectedHistory(id);
    if (id === "history-recipe") reach(5);
  }

  function inspectExperiment() {
    begin("experiment");
    setShowExperiment(true);
    reach(6);
    if (!completed.current) {
      completed.current = true;
      trackEvent("yield_dashboard_complete", { mode, hypothesis: "pressure_change", ui_version: "guided-v1" });
    }
  }

  function reset() {
    setFilters(initialFilters);
    setGuideStep(0);
    setNormalIds([]);
    setAbnormalIds([]);
    setSelectedHistory("");
    setShowExperiment(false);
    trackEvent("yield_dashboard_reset", { mode, ui_version: "guided-v1" });
  }

  function changeMode(next: Mode) {
    begin("mode", next);
    setMode(next);
    if (next === "free") trackEvent("yield_dashboard_free_explore", { ui_version: "guided-v1" });
  }

  const hasFilters = filters.dateStart !== initialFilters.dateStart || filters.dateEnd !== initialFilters.dateEnd || filters.product || filters.equipment || filters.focusDefect;
  const maxDefects = Math.max(1, ...defects.map((item) => item.count));
  const maxDailyYield = Math.max(...daily.map((item) => item.yieldRate ?? 0));
  const minDailyYield = Math.min(...daily.map((item) => item.yieldRate ?? 1));
  const chartSpan = Math.max(.02, maxDailyYield - minDailyYield);

  return <section className={styles.dashboard} aria-label="架空の半導体工場の歩留まり原因調査" data-ready={hydrated}>
    <header className={styles.toolbar}>
      <div className={styles.mode} aria-label="体験モード">
        <button aria-pressed={mode === "guided"} onClick={() => changeMode("guided")} type="button">ガイド付き調査</button>
        <button aria-pressed={mode === "free"} onClick={() => changeMode("free")} type="button">自由探索</button>
      </div>
      <div className={styles.demoNote}><strong>架空データによる学習用デモ</strong><span>実在の会社・工場・装置とは関係ありません</span></div>
      <button className={styles.reset} onClick={reset} type="button">全条件をリセット</button>
    </header>

    {mode === "guided" && <section className={styles.guide} aria-live="polite">
      <div><span>STEP {Math.min(guideStep + 1, 6)} / 6</span><strong>{guideStep >= 6 ? "調査完了" : guideCopy[guideStep][0]}</strong><p>{guideStep >= 6 ? "観察で見つけた原因候補を、別の確認実験で検証できました。" : guideCopy[guideStep][1]}</p></div>
      <ol aria-label="調査の進捗">{guideCopy.map(([title], index) => <li data-current={guideStep === index} data-done={guideStep > index} key={title}><span>{index + 1}</span><small>{title}</small></li>)}</ol>
    </section>}

    <section className={styles.filterBar} aria-label="現在の絞り込み条件">
      <div><span>現在の条件</span>
        <button onClick={() => selectPeriod("all")} type="button">期間: {filters.dateStart.slice(5).replace("-", "/")}〜{filters.dateEnd.slice(5).replace("-", "/")} {filters.dateStart !== initialFilters.dateStart || filters.dateEnd !== initialFilters.dateEnd ? "×" : ""}</button>
        {filters.focusDefect && <button onClick={() => setFilters((current) => ({ ...current, focusDefect: "" }))} type="button">注目不良: {defectLabels[filters.focusDefect]} ×</button>}
        {filters.product && <button onClick={() => setFilters((current) => ({ ...current, product: "" }))} type="button">製品: {filters.product} ×</button>}
        {filters.equipment && <button onClick={() => setFilters((current) => ({ ...current, equipment: "" }))} type="button">装置: {filters.equipment} ×</button>}
        {!hasFilters && <em>全製品・全装置</em>}
      </div>
      <strong>{summary.lotCount}ロット / {number(summary.inspected)}個</strong>
    </section>

    <section className={styles.kpis} aria-label="選択条件のKPI">
      <Kpi label="総検査数" value={number(summary.inspected)} note={`${summary.lotCount}ロット`} />
      <Kpi label="良品数" value={number(summary.good)} note="検査数 − 排他的な不良数" />
      <Kpi label="歩留まり" value={percent(summary.yieldRate, 2)} note="良品数 ÷ 総検査数" alert={summary.yieldRate !== null && summary.yieldRate < .96} />
      <Kpi label="不良数" value={number(summary.defective)} note="4分類の合計" alert={summary.yieldRate !== null && summary.yieldRate < .96} />
    </section>

    <div className={styles.overviewGrid}>
      <section className={styles.panel} aria-labelledby="trend-title">
        <header><div><small>01 / WHEN</small><h2 id="trend-title">歩留まり推移</h2></div><p>期間を選ぶと全パネルが更新</p></header>
        <div className={styles.periods}>{Object.entries(dashboardPeriods).map(([key, period]) => <button aria-pressed={filters.dateStart === period.start && filters.dateEnd === period.end} key={key} onClick={() => selectPeriod(key as keyof typeof dashboardPeriods)} type="button">{period.label}</button>)}</div>
        <div className={styles.trend} role="img" aria-label={`日別歩留まり。最低${percent(minDailyYield)}、最高${percent(maxDailyYield)}`}>
          {daily.map((item) => {
            const selected = item.key >= filters.dateStart && item.key <= filters.dateEnd;
            const height = 30 + (((item.yieldRate ?? minDailyYield) - minDailyYield) / chartSpan) * 65;
            return <button aria-label={`${item.key}、歩留まり${percent(item.yieldRate, 2)}、${item.inspected}個`} aria-pressed={selected} className={(item.yieldRate ?? 1) < .96 ? styles.alertPoint : ""} key={item.key} onClick={() => { begin("date"); setFilters((current) => ({ ...current, dateStart: item.key, dateEnd: item.key })); if (item.key >= dashboardPeriods.anomaly.start) reach(1); }} style={{ "--point-height": `${height}%` } as CSSProperties} type="button"><i /><span>{item.key.slice(8)}</span></button>;
          })}
        </div>
        <footer><span><i className={styles.legendNormal} />通常域</span><span><i className={styles.legendAlert} />95%未満</span><b>日付は8月</b></footer>
      </section>

      <section className={styles.panel} aria-labelledby="defect-title">
        <header><div><small>02 / WHAT</small><h2 id="defect-title">不良項目の内訳</h2></div><p>不良分類は排他的</p></header>
        <div className={styles.bars}>{defects.map((item) => <button aria-pressed={filters.focusDefect === item.key} key={item.key} onClick={() => selectDefect(item.key)} type="button"><span><b>{defectLabels[item.key]}</b><em>{number(item.count)}件</em></span><i><u style={{ width: `${item.count / maxDefects * 100}%` }} /></i></button>)}</div>
        <p className={styles.caption}>同じ検査品を複数の不良へ重複計上していません。不良を選ぶと、比較グラフとロット一覧がその項目に切り替わります。</p>
      </section>
    </div>

    <section className={styles.panel} aria-labelledby="compare-title">
      <header><div><small>03 / WHERE</small><h2 id="compare-title">製品別・装置別の比較</h2></div><p>{filters.focusDefect ? `${defectLabels[filters.focusDefect]}の発生率` : "全不良を含む歩留まり"} / 処理数を併記</p></header>
      <div className={styles.compareGrid}>
        <Breakdown title="製品別" rows={products} selected={filters.product} onSelect={(value) => selectDimension("product", value)} inverted={Boolean(filters.focusDefect)} />
        <Breakdown title="装置別" rows={equipment} selected={filters.equipment} onSelect={(value) => selectDimension("equipment", value)} inverted={Boolean(filters.focusDefect)} />
      </div>
    </section>

    <section className={styles.panel} aria-labelledby="lots-title">
      <header><div><small>04 / LOTS</small><h2 id="lots-title">対象ロットを絞り、比較群を作る</h2></div><p>表示中 {summary.lotCount}ロット / 上位12件</p></header>
      {sortedLots.length ? <div className={styles.tableWrap}><table><thead><tr><th>ロットID</th><th>日付</th><th>製品 / 装置</th><th>検査数</th><th>歩留まり</th><th>{filters.focusDefect ? defectLabels[filters.focusDefect] : "不良数"}</th><th>比較へ追加</th></tr></thead><tbody>{sortedLots.slice(0, 12).map((lot) => <tr data-alert={lot.good / lot.inspected < .96} key={lot.id}><th scope="row">{lot.id}</th><td>{lot.date.slice(5).replace("-", "/")}</td><td>{lot.product}<small>{lot.equipment}</small></td><td>{number(lot.inspected)}</td><td>{percent(lot.good / lot.inspected, 2)}</td><td>{filters.focusDefect ? `${lot.defects[filters.focusDefect]} (${percent(defectRate(lot, filters.focusDefect), 1)})` : lotDefective(lot)}</td><td><button aria-pressed={normalIds.includes(lot.id)} onClick={() => addComparison(lot, "normal")} type="button">正常群</button><button aria-pressed={abnormalIds.includes(lot.id)} onClick={() => addComparison(lot, "abnormal")} type="button">異常群</button></td></tr>)}</tbody></table></div> : <div className={styles.empty} role="status"><strong>条件に合うロットがありません</strong><p>条件を1つ解除するか、全条件をリセットしてください。</p><button onClick={reset} type="button">全条件をリセット</button></div>}
    </section>

    <section className={styles.panel} aria-labelledby="condition-title">
      <header><div><small>05 / CONDITIONS</small><h2 id="condition-title">正常群と異常群の工程条件</h2></div><p>比較群はフィルター変更後も保持</p></header>
      {normalConditions && abnormalConditions ? <div className={styles.conditionCompare}>
        <ConditionColumn title="正常群" count={normalLots.length} conditions={normalConditions} summary={summarizeLots(normalLots)} />
        <div className={styles.delta} aria-label="条件差"><span>差分</span><b data-large={Math.abs(abnormalConditions.pressurePa - normalConditions.pressurePa) > 20}>圧力 {signed(abnormalConditions.pressurePa - normalConditions.pressurePa)} Pa</b><small>RF {signed(abnormalConditions.rfPowerW - normalConditions.rfPowerW)} W</small><small>温度 {signed(abnormalConditions.temperatureC - normalConditions.temperatureC)} ℃</small><small>ガス {signed(abnormalConditions.gasFlowSccm - normalConditions.gasFlowSccm)} sccm</small></div>
        <ConditionColumn title="異常群" count={abnormalLots.length} conditions={abnormalConditions} summary={summarizeLots(abnormalLots)} />
      </div> : <div className={styles.comparisonEmpty}><strong>比較するロットを選んでください</strong><p>ロット一覧で選ぶか、現在の調査条件に対応する候補を追加してください。追加後の実ロットと集計値が比較に使われ、フィルター変更でも消えません。</p><div><button aria-pressed={normalIds.includes(suggestedNormal.id)} onClick={() => addComparison(suggestedNormal, "normal")} type="button">変更前 {suggestedNormal.id}を正常群へ</button><button aria-pressed={abnormalIds.includes(suggestedAbnormal.id)} onClick={() => addComparison(suggestedAbnormal, "abnormal")} type="button">低下後 {suggestedAbnormal.id}を異常群へ</button></div></div>}
    </section>

    <section className={styles.panel} aria-labelledby="history-title">
      <header><div><small>06 / HISTORY</small><h2 id="history-title">保全・条件変更履歴との照合</h2></div><p>一致は証明ではなく、原因候補</p></header>
      <div className={styles.history}>{changeHistory.filter((item) => !filters.equipment || item.equipment === filters.equipment).map((item) => <button aria-pressed={selectedHistory === item.id} key={item.id} onClick={() => chooseHistory(item.id)} type="button"><time>{item.at}</time><span>{item.type}</span><strong>{item.equipment}</strong><p>{item.detail}</p></button>)}</div>
      {selectedHistory && <div className={styles.hypothesis} data-candidate={selectedHistory === "history-recipe"}><span>{selectedHistory === "history-recipe" ? "原因候補" : "照合メモ"}</span><p>{selectedHistory === "history-recipe" ? "CVD-02の圧力設定変更が、AX-7の膜厚外れ増加に関係した可能性があります。時刻・装置・条件差は一致しますが、観察データだけでは原因と断定できません。" : "時系列上の記録として確認しました。対象装置・時刻・条件差が不良の偏りと一致するか、ほかの履歴と並べて判断します。"}</p></div>}
    </section>

    <section className={`${styles.panel} ${styles.experiment}`} aria-labelledby="experiment-title">
      <header><div><small>07 / CONFIRMATION</small><h2 id="experiment-title">別データの確認実験で検証</h2></div><button onClick={inspectExperiment} type="button">確認実験の結果を見る</button></header>
      {!showExperiment ? <div className={styles.locked}><strong>通常の観察データとは分けてあります</strong><p>原因候補を立ててから開き、予想と結果を比べてください。</p></div> : <><div className={styles.experimentGrid}>{confirmationRuns.map((run) => {
        const defective = Object.values(run.defects).reduce((sum, value) => sum + value, 0);
        return <article key={run.id}><span>確認実験</span><h3>{run.label}</h3><strong>{percent((run.inspected - defective) / run.inspected, 1)}</strong><p>膜厚外れ {run.defects.thickness}件 / {run.inspected}個</p><small>圧力 {run.condition.pressurePa} Pa</small></article>;
      })}</div><div className={styles.conclusion}><strong>検証結果</strong><p>455 Paでは膜厚外れが多く、410 Paへ戻した2回の確認で改善しました。この固定デモでは「圧力設定の変更が原因だった」という仮説を支持します。実務では、再現性、交絡条件、測定の信頼性、変更リスクも確認してから標準条件を決めます。</p></div></>}
    </section>
  </section>;
}

function Kpi({ label, value, note, alert = false }: { label: string; value: string; note: string; alert?: boolean }) {
  return <article data-alert={alert}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function Breakdown({ title, rows, selected, onSelect, inverted }: { title: string; rows: ReturnType<typeof groupLots>; selected: string; onSelect: (value: string) => void; inverted: boolean }) {
  return <section className={styles.breakdown}><h3>{title}</h3>{rows.map((row) => <button aria-pressed={selected === row.key} key={row.key} onClick={() => onSelect(row.key)} type="button"><span><b>{row.key}</b><small>{number(row.inspected)}個 / {row.lotCount}ロット</small></span><strong>{inverted ? `${percent(row.inspected ? row.defective / row.inspected : null, 2)} 不良` : `${percent(row.yieldRate, 2)} 歩留まり`}</strong><i><u style={{ width: `${inverted ? Math.max(3, (row.inspected ? row.defective / row.inspected : 0) * 900) : Math.max(3, (row.yieldRate ?? 0) * 100)}%` }} /></i></button>)}</section>;
}

function ConditionColumn({ title, count, conditions, summary }: { title: string; count: number; conditions: NonNullable<ReturnType<typeof averageConditions>>; summary: ReturnType<typeof summarizeLots> }) {
  return <article><header><span>{title}</span><strong>{count}ロット</strong></header><dl><div><dt>歩留まり</dt><dd>{percent(summary.yieldRate, 2)}</dd></div><div><dt>圧力</dt><dd>{conditions.pressurePa.toFixed(0)} Pa</dd></div><div><dt>RF電力</dt><dd>{conditions.rfPowerW.toFixed(1)} W</dd></div><div><dt>基板温度</dt><dd>{conditions.temperatureC.toFixed(1)} ℃</dd></div><div><dt>ガス流量</dt><dd>{conditions.gasFlowSccm.toFixed(1)} sccm</dd></div></dl></article>;
}

function signed(value: number) {
  if (Math.abs(value) < .05) return "±0";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}
