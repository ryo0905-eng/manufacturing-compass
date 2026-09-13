"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { yieldCsvTemplateRows, yieldScenarios, type YieldScenarioId } from "@/data/yield-analysis-samples";
import { analyzePChart, calculateMixComparison, compareByDimension, filterYieldRows, parseYieldCsv, summarizeYield, yieldRowsToCsv, type DateRange, type PChartResult, type YieldRow } from "@/lib/yield-analysis";
import { trackEvent } from "@/lib/analytics";

type Source = YieldScenarioId | "csv";
type Dimension = "product" | "equipment";

const percent = (value: number | null, digits = 2) => value === null ? "—" : `${(value * 100).toFixed(digits)}%`;
const points = (value: number | null) => value === null ? "比較不可" : `${value >= 0 ? "+" : ""}${value.toFixed(2)} pt`;
const count = (value: number) => value.toLocaleString("ja-JP");

function defaultCsvRanges(rows: YieldRow[]) {
  const dates = [...new Set(rows.map((row) => row.date))].sort();
  const split = Math.max(0, Math.min(dates.length - 1, Math.ceil(dates.length * 2 / 3) - 1));
  return {
    baseline: { start: dates[0], end: dates[split] },
    comparison: { start: dates[Math.min(split + 1, dates.length - 1)], end: dates[dates.length - 1] },
  };
}

export function YieldAnalysisApp() {
  const initial = yieldScenarios.equipment;
  const [source, setSource] = useState<Source>("equipment");
  const [rows, setRows] = useState<YieldRow[]>(initial.rows);
  const [baseline, setBaseline] = useState<DateRange>(initial.baseline);
  const [comparison, setComparison] = useState<DateRange>(initial.comparison);
  const [product, setProduct] = useState("");
  const [equipment, setEquipment] = useState("");
  const [dimension, setDimension] = useState<Dimension>("equipment");
  const [csvMessages, setCsvMessages] = useState<{ errors: string[]; warnings: string[]; name?: string }>({ errors: [], warnings: [] });
  const [showMix, setShowMix] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const firstInteractionSent = useRef(false);

  useEffect(() => setHydrated(true), []);

  const products = useMemo(() => [...new Set(rows.map((row) => row.product))].sort((a, b) => a.localeCompare(b, "ja")), [rows]);
  const equipmentOptions = useMemo(() => [...new Set(rows.filter((row) => !product || row.product === product).map((row) => row.equipment))].sort((a, b) => a.localeCompare(b, "ja")), [rows, product]);
  const periodInvalid = baseline.start > baseline.end || comparison.start > comparison.end || baseline.end >= comparison.start;
  const chart = useMemo(() => analyzePChart(rows, baseline, comparison, product || undefined, equipment || undefined), [rows, baseline, comparison, product, equipment]);
  const tableRows = useMemo(() => compareByDimension(rows, baseline, comparison, dimension, dimension === "equipment" && product ? product : undefined), [rows, baseline, comparison, dimension, product]);
  const mix = useMemo(() => calculateMixComparison(rows, baseline, comparison), [rows, baseline, comparison]);
  const baselineSummary = useMemo(() => summarizeYield(filterYieldRows(rows, baseline, product || undefined, equipment || undefined)), [rows, baseline, product, equipment]);
  const comparisonSummary = useMemo(() => summarizeYield(filterYieldRows(rows, comparison, product || undefined, equipment || undefined)), [rows, comparison, product, equipment]);
  const totalChange = baselineSummary.yieldRate === null || comparisonSummary.yieldRate === null ? null : (comparisonSummary.yieldRate - baselineSummary.yieldRate) * 100;
  const largestDecline = tableRows.filter((row) => row.comparable && !row.smallSample).sort((left, right) => left.yieldChangePoints! - right.yieldChangePoints!)[0];
  const templateHref = `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(yieldRowsToCsv(yieldCsvTemplateRows))}`;

  function firstInteraction(action: string) {
    if (firstInteractionSent.current) return;
    firstInteractionSent.current = true;
    trackEvent("yield_analysis_first_interaction", { action });
  }

  function applyScenario(id: YieldScenarioId, track = true) {
    const scenario = yieldScenarios[id];
    firstInteraction("scenario_change");
    setSource(id); setRows(scenario.rows); setBaseline(scenario.baseline); setComparison(scenario.comparison);
    setProduct(""); setEquipment(""); setDimension("equipment"); setShowMix(false); setCsvMessages({ errors: [], warnings: [] });
    if (track) trackEvent("yield_analysis_scenario_changed", { scenario: id });
  }

  function updateProduct(next: string) {
    firstInteraction("filter");
    setProduct(next); setEquipment("");
    trackEvent("yield_analysis_filter_changed", { filter_type: "product", selection: next ? "selected" : "all" });
  }

  function updateEquipment(next: string) {
    firstInteraction("filter"); setEquipment(next);
    trackEvent("yield_analysis_filter_changed", { filter_type: "equipment", selection: next ? "selected" : "all" });
  }

  async function loadCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    firstInteraction("csv");
    const result = parseYieldCsv(await file.text());
    if (result.errors.length) { setCsvMessages({ errors: result.errors, warnings: result.warnings, name: file.name }); return; }
    const ranges = defaultCsvRanges(result.rows);
    setSource("csv"); setRows(result.rows); setBaseline(ranges.baseline); setComparison(ranges.comparison);
    setProduct(""); setEquipment(""); setDimension("equipment"); setShowMix(false);
    setCsvMessages({ errors: [], warnings: result.warnings, name: file.name });
    trackEvent("yield_analysis_csv_loaded", { status: "success", duplicate_rows: result.duplicateCount > 0 ? "present" : "none" });
  }

  function useMixComparison() {
    firstInteraction("mix_comparison");
    setShowMix((current) => !current);
    if (!showMix) trackEvent("yield_analysis_mix_comparison_used", { status: mix.available ? "available" : "unavailable" });
  }

  return <section className="yield-app" aria-label="歩留まり低下の検知・要因探索" data-hydrated={hydrated}>
    <header className="yield-app__toolbar">
      <div>
        <p className="section-label">DATA SOURCE / LOCAL ONLY</p>
        <h2>架空データですぐ試す</h2>
        <p>CSVを読み込んでも、解析はブラウザ内で完結し、データを外部送信しません。</p>
      </div>
      <div className="yield-app__source-actions">
        <div className="yield-segmented" aria-label="サンプルシナリオ">
          {(["equipment", "mix"] as const).map((id) => <button aria-pressed={source === id} key={id} onClick={() => applyScenario(id)} type="button">{yieldScenarios[id].shortTitle}</button>)}
        </div>
        <label className="yield-upload"><span>CSVを読み込む</span><input accept=".csv,text/csv" onChange={loadCsv} type="file" /></label>
        <a className="yield-template-link" download="yield-analysis-template.csv" href={templateHref}>テンプレートCSV</a>
      </div>
    </header>

    <div className="yield-source-note" data-source={source === "csv" ? "csv" : "sample"}>
      <strong>{source === "csv" ? `CSV｜${csvMessages.name ?? "読込データ"}` : yieldScenarios[source].title}</strong>
      <span>{source === "csv" ? `${rows.length}件の集計行。初期期間は日付の前半約2/3と後半に分けています。` : yieldScenarios[source].description} {source !== "csv" && "表示データはすべて架空です。"}</span>
      {source === "csv" && <button onClick={() => applyScenario("equipment", false)} type="button">サンプルに戻す</button>}
    </div>

    {csvMessages.errors.length > 0 && <div className="yield-csv-message yield-csv-message--error" role="alert"><strong>CSVを読み込めませんでした。元のデータは維持しています。</strong><ul>{csvMessages.errors.slice(0, 20).map((error) => <li key={error}>{error}</li>)}</ul>{csvMessages.errors.length > 20 && <p>ほか{csvMessages.errors.length - 20}件のエラーがあります。</p>}</div>}
    {csvMessages.warnings.length > 0 && <div className="yield-csv-message" role="status"><strong>読込時の処理</strong><ul>{csvMessages.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}

    <div className="yield-workspace-controls">
      <fieldset><legend>基準期間</legend><label>開始<input aria-label="基準期間の開始日" max={baseline.end} onChange={(event) => { firstInteraction("period"); setBaseline({ ...baseline, start: event.target.value }); }} type="date" value={baseline.start} /></label><label>終了<input aria-label="基準期間の終了日" min={baseline.start} onChange={(event) => { firstInteraction("period"); setBaseline({ ...baseline, end: event.target.value }); }} type="date" value={baseline.end} /></label></fieldset>
      <fieldset><legend>比較期間</legend><label>開始<input aria-label="比較期間の開始日" max={comparison.end} onChange={(event) => { firstInteraction("period"); setComparison({ ...comparison, start: event.target.value }); }} type="date" value={comparison.start} /></label><label>終了<input aria-label="比較期間の終了日" min={comparison.start} onChange={(event) => { firstInteraction("period"); setComparison({ ...comparison, end: event.target.value }); }} type="date" value={comparison.end} /></label></fieldset>
      <label className="yield-filter">製品<select aria-label="表示する製品" onChange={(event) => updateProduct(event.target.value)} value={product}><option value="">すべて（参考表示）</option>{products.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="yield-filter">装置<select aria-label="表示する装置" onChange={(event) => updateEquipment(event.target.value)} value={equipment}><option value="">すべて</option>{equipmentOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    {periodInvalid && <p className="yield-period-error" role="alert">基準期間は比較期間より前に、重ならないよう指定してください。</p>}
    <div className="yield-current-state" aria-live="polite"><span>現在の表示</span><strong>{product || "全製品（参考）"}</strong><i>×</i><strong>{equipment || "全装置"}</strong><small>基準 {baseline.start}〜{baseline.end} ／ 比較 {comparison.start}〜{comparison.end}</small></div>

    <section className="yield-step" aria-labelledby="yield-step-one">
      <header><div><span>01</span><div><p className="section-label">WHEN DID IT DROP?</p><h2 id="yield-step-one">いつから下がった？</h2></div></div><p>日別の歩留まりを、固定した基準期間のp管理図と比較します。</p></header>
      <div className="yield-summary-strip">
        <dl><div><dt>基準期間の歩留まり</dt><dd>{percent(baselineSummary.yieldRate)}</dd><small>{count(baselineSummary.inspectedCount)}個中 {count(baselineSummary.defectiveCount)}個不良</small></div><div><dt>比較期間の歩留まり</dt><dd>{percent(comparisonSummary.yieldRate)}</dd><small>{count(comparisonSummary.inspectedCount)}個中 {count(comparisonSummary.defectiveCount)}個不良</small></div><div data-decline={totalChange !== null && totalChange < 0}><dt>数値の変化</dt><dd>{points(totalChange)}</dd><small>統計シグナルとは別に表示</small></div><div data-signal={chart.signalDates.length > 0}><dt>p管理図の悪化シグナル</dt><dd>{chart.available ? `${chart.signalDates.length}日` : "判定保留"}</dd><small>{chart.available ? "比較期間でUCL超過" : "適用条件を確認"}</small></div></dl>
      </div>
      <YieldChart chart={chart} />
      <div className="yield-signal-note" data-available={chart.available}>
        <strong>{chart.available ? chart.signalDates.length ? `統計的シグナルあり｜${chart.signalDates[0]}から確認` : "統計的シグナルなし" : "正式なシグナル判定は保留"}</strong>
        <p>{chart.available ? chart.signalDates.length ? "比較期間の日別不良率が、基準期間から求めた上側管理限界を超えています。設備故障や製品の合否を断定するものではありません。" : "歩留まりの数値は比較できますが、選択条件では3σ管理限界を超える悪化はありません。" : chart.reason}</p>
        {chart.warning && <small>{chart.warning}</small>}
      </div>
    </section>

    <section className="yield-step" aria-labelledby="yield-step-two">
      <header><div><span>02</span><div><p className="section-label">WHERE DID IT DROP?</p><h2 id="yield-step-two">どこで下がった？</h2></div></div><p>各率は行の単純平均ではなく、検査数・不良品数の合計から計算します。</p></header>
      <div className="yield-comparison-controls"><div className="yield-segmented" aria-label="比較軸"><button aria-pressed={dimension === "product"} onClick={() => { firstInteraction("dimension"); setDimension("product"); }} type="button">製品別</button><button aria-pressed={dimension === "equipment"} onClick={() => { firstInteraction("dimension"); setDimension("equipment"); }} type="button">装置別</button></div>{dimension === "equipment" && <p>{product ? <><strong>{product}</strong>に揃えて装置を比較中です。</> : <>製品構成が装置ごとに異なる可能性があります。製品を選んで条件を揃えてください。</>}</p>}</div>
      <ComparisonTable dimension={dimension} rows={tableRows} selected={dimension === "product" ? product : equipment} onSelect={(key) => dimension === "product" ? updateProduct(product === key ? "" : key) : updateEquipment(equipment === key ? "" : key)} />
      <section className="yield-mix-panel">
        <div><p className="section-label">PRODUCT MIX CHECK</p><h3>製品構成の影響を分けて見る</h3><p>共通製品の基準歩留まりを、比較期間の検査数構成比で加重平均します。</p></div><button aria-expanded={showMix} onClick={useMixComparison} type="button">{showMix ? "構成比較を閉じる" : "構成比だけ変えた場合を確認"}</button>
        {showMix && <div className="yield-mix-result" aria-live="polite">{mix.available ? <><dl><div><dt>基準期間の実績</dt><dd>{percent(mix.baselineYield)}</dd></div><div><dt>構成比だけ変えた想定</dt><dd>{percent(mix.mixAdjustedYield)}</dd></div><div><dt>比較期間の実績</dt><dd>{percent(mix.comparisonYield)}</dd></div></dl><p>想定値は記述的な比較で、構成変更の因果効果を示すものではありません。実績との差には、各製品内の変化や丸めも含まれます。</p></> : <p role="status">{mix.reason}</p>}</div>}
      </section>
    </section>

    <section className="yield-step yield-next" aria-labelledby="yield-step-three">
      <header><div><span>03</span><div><p className="section-label">WHAT TO CHECK NEXT?</p><h2 id="yield-step-three">次に何を確認する？</h2></div></div><p>データで確認できた事実と、現場記録で確かめる仮説を分けます。</p></header>
      <div className="yield-next-grid"><section><h3>このデータから確認できる事実</h3><ul><li>選択条件の歩留まりは、基準{percent(baselineSummary.yieldRate)}から比較{percent(comparisonSummary.yieldRate)}へ{points(totalChange)}変化しています。</li><li>{chart.available ? chart.signalDates.length ? `p管理図の悪化シグナルは比較期間に${chart.signalDates.length}日あります。` : "p管理図の3σ基準を超える悪化シグナルはありません。" : chart.reason}</li>{largestDecline && <li>{dimension === "product" ? "製品" : "装置"}別では、十分な検査数がある中で「{largestDecline.key}」の変化が{points(largestDecline.yieldChangePoints)}です。</li>}</ul></section><section><h3>追加確認が必要な仮説</h3><ol><li><strong>保全・停止履歴</strong><span>最初のシグナル日前後に、部品交換、調整、アラーム、復旧作業がないか。</span></li><li><strong>材料・ロット</strong><span>材料ロットや供給元の切替が、悪化した製品・装置・時刻と重なるか。</span></li><li><strong>条件・判定変更</strong><span>レシピ、治工具、作業方法、検査条件、不良品の数え方が変わっていないか。</span></li></ol><p>時刻や対象の一致は原因の証明ではありません。現物、再測定、条件復元後の再現性で確かめます。</p></section></div>
    </section>

    <details className="yield-method"><summary>計算方法と適用条件</summary><div><section><h3>p管理図</h3><p>基準不良率 p̄＝基準期間の不良品数合計÷検査数合計。日ごとの検査数nに対し、UCL＝min(1, p̄＋3√(p̄(1−p̄)/n))、LCL＝max(0, p̄−3√(p̄(1−p̄)/n))です。歩留まり表示では、不良率UCLを歩留まり下限1−UCLへ変換します。比較期間はp̄を更新しません。</p></section><section><h3>使う前提</h3><p>同じ製品・工程条件で、基準期間が安定し、各個体の合否が概ね独立することを前提とします。低不良率、少数データ、過分散、連続するデータの依存には初版の正規近似が適さない場合があります。目標値と管理限界は別物です。</p></section><section><h3>初版の範囲</h3><p>歩留まりは検査対象中の良品率です。不良品数は、1個に複数あり得る欠陥件数ではありません。材料重量、再加工込みの複雑な歩留まり、過分散対応、高度な変化点検知は扱いません。</p></section></div></details>
  </section>;
}

function YieldChart({ chart }: { chart: PChartResult }) {
  const drawable = chart.points.filter((point) => point.yieldRate !== null);
  if (!drawable.length) return <div className="yield-chart-empty">選択期間にグラフ表示できる検査データがありません。</div>;
  const values = drawable.flatMap((point) => [point.yieldRate!, point.lowerYieldLimit ?? point.yieldRate!, point.upperYieldLimit ?? point.yieldRate!]);
  const min = Math.max(0, Math.min(...values) - 0.015);
  const max = Math.min(1, Math.max(...values) + 0.008);
  const width = 960; const height = 300; const left = 58; const right = 22; const top = 34; const bottom = 48;
  const x = (index: number) => left + index / Math.max(1, drawable.length - 1) * (width - left - right);
  const y = (value: number) => top + (max - value) / Math.max(0.0001, max - min) * (height - top - bottom);
  const pathFor = (read: (point: typeof drawable[number]) => number | null) => drawable.map((point, index) => { const value = read(point); return value === null ? "" : `${index ? "L" : "M"}${x(index)},${y(value)}`; }).join(" ");
  const comparisonIndex = drawable.findIndex((point) => point.period === "comparison");
  return <figure className="yield-chart"><div><strong>日別歩留まり</strong><span><i className="yield-legend-data" />実績</span><span><i className="yield-legend-limit" />管理限界</span><span><i className="yield-legend-signal" />悪化シグナル</span></div><div className="yield-chart__scroll"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="基準期間と比較期間の日別歩留まりp管理図"><rect x={left} y={top} width={width - left - right} height={height - top - bottom} rx="4" />{[0, .25, .5, .75, 1].map((ratio) => { const value = min + (max - min) * ratio; return <g key={ratio}><line className="yield-grid-line" x1={left} x2={width - right} y1={y(value)} y2={y(value)} /><text x={left - 9} y={y(value) + 4} textAnchor="end">{(value * 100).toFixed(1)}%</text></g>; })}{comparisonIndex > 0 && <><line className="yield-period-divider" x1={x(comparisonIndex) - 8} x2={x(comparisonIndex) - 8} y1={top} y2={height - bottom} /><text className="yield-period-text" x={x(comparisonIndex) - 14} y={top - 12} textAnchor="end">基準期間</text><text className="yield-period-text" x={x(comparisonIndex) + 2} y={top - 12}>比較期間</text></>}{chart.available && <><path className="yield-limit-line" d={pathFor((point) => point.lowerYieldLimit)} /><path className="yield-upper-line" d={pathFor((point) => point.upperYieldLimit)} />{chart.centerYield !== null && <line className="yield-center-line" x1={left} x2={width - right} y1={y(chart.centerYield)} y2={y(chart.centerYield)} />}</>}<path className="yield-data-line" d={pathFor((point) => point.yieldRate)} />{drawable.map((point, index) => <g key={point.date}><circle className={point.signal ? "is-signal" : ""} cx={x(index)} cy={y(point.yieldRate!)} r={point.signal ? 6 : 3.8}><title>{`${point.date}: 歩留まり${percent(point.yieldRate)}、検査${count(point.inspectedCount)}個${point.signal ? "、悪化シグナル" : ""}`}</title></circle>{point.signal && <text className="yield-signal-label" x={x(index)} y={y(point.yieldRate!) + 18} textAnchor="middle">異常</text>}</g>)}</svg></div><figcaption>各点の管理限界は検査数nに応じて変わります。点にカーソルを合わせると日付・検査数を確認できます。</figcaption></figure>;
}

function ComparisonTable({ dimension, rows, selected, onSelect }: { dimension: Dimension; rows: ReturnType<typeof compareByDimension>; selected: string; onSelect: (key: string) => void }) {
  return <div className="yield-table-wrap"><table className="yield-comparison-table"><thead><tr><th rowSpan={2}>{dimension === "product" ? "製品" : "装置"}</th><th colSpan={4}>基準期間</th><th colSpan={4}>比較期間</th><th rowSpan={2}>歩留まり変化</th></tr><tr><th>検査数</th><th>不良品</th><th>歩留まり</th><th>構成比</th><th>検査数</th><th>不良品</th><th>歩留まり</th><th>構成比</th></tr></thead><tbody>{rows.map((row) => <tr data-selected={selected === row.key} key={row.key}><th><button aria-pressed={selected === row.key} onClick={() => onSelect(row.key)} type="button"><span>{row.key}</span><small>{selected === row.key ? "選択中・クリックで解除" : "推移へ反映"}</small></button></th><td>{count(row.baseline.inspectedCount)}</td><td>{count(row.baseline.defectiveCount)}</td><td>{percent(row.baseline.yieldRate)}</td><td>{percent(row.baselineShare, 1)}</td><td>{count(row.comparison.inspectedCount)}</td><td>{count(row.comparison.defectiveCount)}</td><td>{percent(row.comparison.yieldRate)}</td><td>{percent(row.comparisonShare, 1)}</td><td><strong>{points(row.yieldChangePoints)}</strong>{row.smallSample && <small>少数データ</small>}</td></tr>)}</tbody></table><p>比較期間の検査数が多い順です。どちらかの期間に検査数がない組み合わせは「比較不可」と表示します。少数データは極端な率だけで上位表示しません。</p></div>;
}
