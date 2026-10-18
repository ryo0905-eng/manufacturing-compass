"use client";

import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type PointerEvent } from "react";
import { annualNumber, annualUnit, comparableAnnualPeriods, reportedValue, type AnnualSeries, type AnnualYears } from "@/lib/earnings-history-math";
import { watchExchange, watchFinancialDomain, watchFinancials, watchPercent, watchYenAmount, watchYearMonth } from "@/lib/watch-financials";
import { MediaLink } from "./MediaLinks";
import { WatchFinancialChart, watchPlot } from "./WatchFinancialChart";
import styles from "./WatchExplorer.module.css";

type ChartProps = ComponentProps<typeof WatchFinancialChart>;
type FinancialData = ReturnType<typeof watchFinancials>;
const size = { width: 720, height: 280, inset: 8, maxBarWidth: 40 };

export function WatchFinancialHistory({ history, years, href, ...chartProps }: ChartProps & { history: AnnualSeries; years: AnnualYears; href: string }) {
  const [zoom, setZoom] = useState<{ index: number; opener: HTMLElement } | null>(null);
  return <>
    <WatchFinancialChart {...chartProps} onZoom={(index, opener) => setZoom({ index, opener })} />
    {zoom ? <WatchFinancialDialog history={history} years={years} href={href} initialIndex={zoom.index} opener={zoom.opener} onClose={() => setZoom(null)} /> : null}
  </>;
}

export function WatchFinancialDialog({ history, years, href, initialIndex, opener, onClose }: {
  history: AnnualSeries; years: AnnualYears; href: string; initialIndex: number; opener: HTMLElement; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropDown = useRef(false);
  const revenue = watchFinancials(history, "revenue", years);
  const margin = watchFinancials(history, "operating_margin", years);
  const titleId = `watch-zoom-title-${history.companyId}`;
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; opener.focus({ preventScroll: true }); };
  }, [opener]);

  function outside(event: { clientX: number; clientY: number; currentTarget: HTMLDialogElement }) {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  return <dialog ref={dialog} className={styles.financialDialog} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onPointerDown={event => { backdropDown.current = event.target === event.currentTarget && outside(event); }}
    onClick={event => { if (backdropDown.current && event.target === event.currentTarget && outside(event)) onClose(); backdropDown.current = false; }}>
    <header className={styles.zoomHeader}><div><h2 id={titleId}>{history.name}の業績推移</h2><p>通期・最大{years}年 · {revenue.points.length}期掲載 · 企業ごとの目盛り</p></div>
      <button type="button" autoFocus onClick={onClose} aria-label="業績グラフを閉じる">閉じる <span aria-hidden="true">×</span></button></header>
    <div className={styles.zoomBody}>
      <p className={styles.zoomNote}>この企業の推移を読みやすくするため、縦軸を一覧から変更しています。売上高は左軸、営業利益率は右軸です。棒と線の高さの一致は、同じ数値や相関を意味しません。</p>
      <WatchFinancialComboChart companyId={history.companyId} revenue={revenue} margin={margin}
        revenueDomain={watchFinancialDomain([history], "revenue", years)} marginDomain={watchFinancialDomain([history], "operating_margin", years)} initialIndex={initialIndex} />
      <p className={styles.zoomNote}>{history.coverageNote}<br />数値確認日：{history.checkedAt}。各期の対象範囲・欠測理由は選択した期の数値に表示します。</p>
      <p className={styles.zoomNote}>売上高は為替基準日 {watchExchange.asOf}の同一為替で円換算した規模比較用の概算です。過去当時の円建て実績とは異なります。<MediaLink href={watchExchange.source.url} articleId="watch-exchange" action="source" placement="explore" uiVersion="cards-v2">換算元：FRB H.10 ↗</MediaLink></p>
      <MediaLink href={href} articleId={history.companyId} action="article" destination="earnings" placement="explore" uiVersion="cards-v2" reloadDocument>業績・出典を見る →</MediaLink>
    </div>
  </dialog>;
}

export function WatchFinancialComboChart({ companyId, revenue, margin, revenueDomain, marginDomain, initialIndex }: {
  companyId: string; revenue: FinancialData; margin: FinancialData;
  revenueDomain: ChartProps["domain"]; marginDomain: ChartProps["domain"]; initialIndex: number;
}) {
  const points = revenue.points;
  const [active, setActive] = useState(() => Math.max(0, Math.min(initialIndex, points.length - 1)));
  const plot = watchPlot(points, revenueDomain, size);
  const marginPlot = watchPlot(margin.points, marginDomain, size);
  const point = points[active];
  const marginPoint = margin.points[active];
  const unit = revenueDomain.max >= 1e12 ? "兆円" : "億円";
  const divisor = unit === "兆円" ? 1e12 : 1e8;
  const revenueTicks = [revenueDomain.max, revenueDomain.max / 2, 0];
  const marginTicks = [...new Set([0, marginDomain.max, marginDomain.min])].filter((value, index, all) => !all.slice(0, index).some(other => Math.abs(marginPlot.y(value) - marginPlot.y(other)) < 16));
  const dateIndices = points.length ? [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])] : [];
  const helpId = `watch-zoom-help-${companyId}`;
  const valueText = point ? `${watchYearMonth(point.period.end)}期、売上高 ${watchYenAmount(point.value)}、営業利益率 ${watchPercent(marginPoint?.value ?? null)}` : "年次履歴未取得";

  function choose(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (points.length && rect.width > 0) setActive(plot.nearest((event.clientX - rect.left) / rect.width * size.width));
  }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = event.key === "ArrowLeft" ? Math.max(0, active - 1) : event.key === "ArrowRight" ? Math.min(points.length - 1, active + 1)
      : event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : undefined;
    if (next !== undefined && points.length) { event.preventDefault(); setActive(next); }
    // Escape is handled by the native dialog, including when the plot has focus.
  }

  return <figure className={styles.comboFigure}>
    <figcaption className={styles.comboLegend}><span><i className={styles.revenueSwatch} />売上高（左軸・{unit}）</span><span><i className={styles.marginSwatch} />営業利益率（右軸・%）</span></figcaption>
    <div className={styles.comboAxisNames} aria-hidden="true"><span>売上高（{unit}）</span><span>営業利益率（%）</span></div>
    <div className={styles.comboRow}>
      <div className={styles.comboAxis} aria-hidden="true">{revenueTicks.map(value => <span key={value} style={{ top: `${plot.y(value) / size.height * 100}%` }}>{annualNumber(value / divisor)}</span>)}</div>
      <div className={styles.comboControl} role={points.length ? "slider" : "img"} tabIndex={points.length ? 0 : undefined}
        aria-label="売上高と営業利益率・確認する期" aria-orientation={points.length ? "horizontal" : undefined}
        aria-valuemin={points.length ? 0 : undefined} aria-valuemax={points.length ? points.length - 1 : undefined}
        aria-valuenow={points.length ? active : undefined} aria-valuetext={valueText} aria-describedby={helpId}
        onPointerMove={event => { if (event.pointerType !== "touch") choose(event); }}
        onPointerDown={event => { event.currentTarget.focus({ preventScroll: true }); choose(event); }} onKeyDown={keyDown}>
        <svg viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" aria-hidden="true">
          <title>売上高は左軸の棒グラフ、営業利益率は右軸の折れ線グラフ。企業ごとの目盛り。</title>
          {revenueTicks.map(value => <line key={value} x1={size.inset} x2={size.width - size.inset} y1={plot.y(value)} y2={plot.y(value)} stroke="#e5e7eb" />)}
          {points.map((item, index) => item.value === null ? null : <rect key={item.period.end} x={plot.x(item.period.end) - plot.barWidth / 2}
            y={plot.y(item.value)} width={plot.barWidth} height={Math.max(item.value === 0 ? 1 : 0, plot.y(0) - plot.y(item.value))} fill={index === active ? "#3976bd" : "#9bbce0"} />)}
          <line x1={size.inset} x2={size.width - size.inset} y1={marginPlot.y(0)} y2={marginPlot.y(0)} stroke="#a95a17" strokeDasharray="4 4" />
          {margin.segments.map((segment, index) => <g key={index}>
            <polyline points={segment.map(item => `${plot.x(item.period.end)},${marginPlot.y(item.value!)}`).join(" ")} fill="none" stroke="#b95d12" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {segment.map(item => <circle key={item.period.end} cx={plot.x(item.period.end)} cy={marginPlot.y(item.value!)} r="3" fill="#b95d12" />)}
          </g>)}
          {points.filter(item => item.previousPeriod && !comparableAnnualPeriods(item.previousPeriod, item.period)).map(item => <line key={item.period.end}
            x1={plot.x(item.period.end) - plot.barWidth / 2} x2={plot.x(item.period.end) - plot.barWidth / 2} y1={size.inset} y2={size.height - size.inset} stroke="#9b752f" strokeDasharray="2 2" />)}
          {point ? <line x1={plot.x(point.period.end)} x2={plot.x(point.period.end)} y1={size.inset} y2={size.height - size.inset} stroke="#1d1d1f" /> : null}
        </svg>
        <div className={styles.comboDates} aria-hidden="true">{dateIndices.map(index => <span key={index} style={{ left: `${plot.x(points[index].period.end) / size.width * 100}%`, transform: index === 0 ? "none" : index === points.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}>{watchYearMonth(points[index].period.end)}</span>)}</div>
      </div>
      <div className={`${styles.comboAxis} ${styles.comboRightAxis}`} aria-hidden="true">{marginTicks.map(value => <span key={value} style={{ top: `${marginPlot.y(value) / size.height * 100}%` }}>{annualNumber(value)}</span>)}</div>
    </div>
    <p id={helpId} className={styles.zoomNote}>ホバー・タップ・左右キーで期を選択。Homeで最初、Endで最後、Escapeで拡大表示を閉じます。オレンジの破線は営業利益率0%、縦の茶色の点線は比較の区切りです。</p>
    <div className={styles.comboValues} aria-live="polite" aria-atomic="true">
      {point ? <><strong>{watchYearMonth(point.period.end)}期 · 通期</strong><dl>
        <div><dt>売上高（円換算・概算）</dt><dd>{watchYenAmount(point.value)}</dd></div>
        <div><dt>営業利益率</dt><dd>{watchPercent(marginPoint?.value ?? null)}</dd></div>
      </dl><p>売上高（原通貨）：{reportedValue(point.period.revenue) === null ? "未公表・未取得" : `${annualNumber(reportedValue(point.period.revenue))}${annualUnit(point.period)}`} · 前年比 {watchPercent(point.revenueYoY, true)}</p>
        <p>{point.period.financialScope} · {point.period.accountingStandard}</p>
        {point.period.operatingIncome.status === "reported" && point.period.operatingIncome.calculation ? <p>営業利益は算出値：{point.period.operatingIncome.calculation}</p> : null}
        {[...new Set([point.missingReason, marginPoint?.missingReason, point.growthMissingReason, point.period.breakBefore])].filter(Boolean).map(reason => <p key={reason}>{reason}</p>)}
      </> : <p>年次履歴未取得</p>}
    </div>
  </figure>;
}
