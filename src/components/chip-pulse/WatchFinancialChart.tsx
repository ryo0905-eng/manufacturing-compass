"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { annualNumber, annualUnit, comparableAnnualPeriods, reportedValue, type AnnualPoint } from "@/lib/earnings-history-math";
import { watchPercent, watchYenAmount, watchYearMonth, type WatchFinancialDomain, type WatchFinancialPoint, type WatchMetric } from "@/lib/watch-financials";
import styles from "./WatchExplorer.module.css";

const width = 240, height = 48, inset = 4;

export function watchPlot(points: WatchFinancialPoint[], domain: WatchFinancialDomain) {
  const start = Date.parse(points[0]?.period.end ?? "2000-01-01");
  const span = Math.max(1, Date.parse(points.at(-1)?.period.end ?? "2000-01-01") - start);
  const gap = Math.min(...points.slice(1).map((point, index) => Date.parse(point.period.end) - Date.parse(points[index].period.end)));
  const barWidth = Math.min(24, (width - inset * 2) / Math.max(1, points.length) * .65, gap / span * (width - inset * 2) * .65);
  const x = (date: string) => points.length === 1 ? width / 2 : inset + barWidth / 2 + (Date.parse(date) - start) / span * (width - inset * 2 - barWidth);
  const y = (value: number) => height - inset - (value - domain.min) / (domain.max - domain.min) * (height - inset * 2);
  const nearest = (position: number) => points.reduce((best, point, index) => Math.abs(x(point.period.end) - position) < Math.abs(x(points[best].period.end) - position) ? index : best, 0);
  return { x, y, barWidth, nearest };
}

export function WatchFinancialChart({ companyId, name, points, segments, metric, domain }: {
  companyId: string; name: string; points: WatchFinancialPoint[]; segments: AnnualPoint[][]; metric: WatchMetric; domain: WatchFinancialDomain;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const plot = watchPlot(points, domain);
  const point = active === null ? null : points[active];
  const label = metric === "revenue" ? "売上高" : "営業利益率";
  const unit = metric === "revenue" ? domain.max >= 1e12 ? "兆円" : "億円" : "%";
  const divisor = metric === "revenue" ? unit === "兆円" ? 1e12 : 1e8 : 1;
  const ticks = metric === "revenue" ? [domain.max, domain.max / 2, 0]
    : [...new Set([0, domain.max, domain.min])].filter((value, index, all) => !all.slice(0, index).some(other => Math.abs(plot.y(value) - plot.y(other)) < 12));
  const format = (value: number | null) => metric === "revenue" ? watchYenAmount(value) : watchPercent(value);
  const tooltipId = `watch-point-${companyId}`;
  const helpId = `watch-help-${companyId}`;
  const selected = point ?? points.at(-1);
  const valueText = selected ? `${watchYearMonth(selected.period.end)}期、${label} ${format(selected.value)}${selected.missingReason ? `。${selected.missingReason}` : ""}` : "年次履歴未取得";

  function choose(event: PointerEvent<HTMLDivElement>) {
    if (!points.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width > 0) setActive(plot.nearest((event.clientX - rect.left) / rect.width * width));
  }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!points.length) return;
    const current = active ?? points.length - 1;
    const next = event.key === "ArrowLeft" ? Math.max(0, current - 1) : event.key === "ArrowRight" ? Math.min(points.length - 1, current + 1)
      : event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : event.key === "Escape" ? null : undefined;
    if (next !== undefined) { event.preventDefault(); setActive(next); }
  }

  return <figure className={styles.chartFigure} onPointerLeave={event => { if (event.pointerType !== "touch" && !focused) setActive(null); }}>
    <figcaption className={styles.srOnly}>{name}の年次{label}。全12社で共通の縦軸。</figcaption>
    <span className={styles.chartUnit} aria-hidden="true">{unit}</span>
    <div className={styles.chartRow}>
      <div className={styles.chartAxis} aria-hidden="true">{ticks.map(value => <span key={value} style={{ top: `${plot.y(value) / height * 100}%` }}>{annualNumber(value / divisor)}</span>)}</div>
      <div className={styles.chartControl} role={points.length ? "slider" : "img"} tabIndex={points.length ? 0 : undefined}
        aria-label={`${name}の${label}・確認する期`} aria-orientation={points.length ? "horizontal" : undefined}
        aria-valuemin={points.length ? 0 : undefined} aria-valuemax={points.length ? points.length - 1 : undefined}
        aria-valuenow={points.length ? active ?? points.length - 1 : undefined} aria-valuetext={points.length ? valueText : undefined}
        aria-describedby={`${helpId}${point ? ` ${tooltipId}` : ""}`}
        onPointerMove={choose} onPointerDown={event => { event.currentTarget.focus({ preventScroll: true }); choose(event); }}
        onPointerCancel={() => setActive(null)} onFocus={() => { setFocused(true); setActive(active ?? points.length - 1); }}
        onBlur={() => { setFocused(false); setActive(null); }} onKeyDown={keyDown}>
        <svg className={styles.sparkline} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
          <title>{`${name}の年次${label}。${metric === "revenue" ? "同一為替で円換算した規模比較用の概算。" : ""}全12社で共通の縦軸。`}</title>
          {ticks.map(value => <line key={value} x1={inset} x2={width - inset} y1={plot.y(value)} y2={plot.y(value)} stroke="#e5e7eb" />)}
          <line x1={inset} x2={width - inset} y1={plot.y(0)} y2={plot.y(0)} stroke="#a5afbb" strokeDasharray="3 3" />
          {metric === "revenue" ? points.map((item, index) => item.value === null ? null : <rect key={item.period.end}
            x={plot.x(item.period.end) - plot.barWidth / 2} y={plot.y(item.value)} width={plot.barWidth} height={Math.max(item.value === 0 ? 1 : 0, plot.y(0) - plot.y(item.value))}
            fill={index === points.length - 1 ? "#3976bd" : "#9bbce0"}>
            <title>{`${item.period.label}：${watchYenAmount(item.value)}`}</title>
          </rect>) : segments.map((segment, index) => <g key={index}>
            <polyline points={segment.map(item => `${plot.x(item.period.end)},${plot.y(item.value!)}`).join(" ")} fill="none" stroke="#3976bd" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            {segment.map(item => <circle key={item.period.end} cx={plot.x(item.period.end)} cy={plot.y(item.value!)} r="1.7" fill="#3976bd" />)}
          </g>)}
          {points.filter(item => item.previousPeriod && !comparableAnnualPeriods(item.previousPeriod, item.period)).map(item => <line key={item.period.end}
            x1={plot.x(item.period.end) - plot.barWidth / 2} x2={plot.x(item.period.end) - plot.barWidth / 2} y1={inset} y2={height - inset} stroke="#9b752f" strokeDasharray="2 2" />)}
          {point ? <g><line x1={plot.x(point.period.end)} x2={plot.x(point.period.end)} y1={inset} y2={height - inset} stroke="#1d1d1f" />
            {point.value !== null ? <circle cx={plot.x(point.period.end)} cy={plot.y(point.value)} r="2.5" fill="#1d1d1f" /> : null}</g> : null}
        </svg>
      </div>
    </div>
    <span id={helpId} className={styles.srOnly}>ホバー・タップ、または左右キーで各期の値を確認。Homeで最初、Endで最後、Escapeで閉じます。</span>
    {point ? <div id={tooltipId} role="tooltip" className={styles.chartTooltip}>
      <strong>{watchYearMonth(point.period.end)}期 · {label} {format(point.value)}</strong>
      {metric === "revenue" ? <span>原通貨：{reportedValue(point.period.revenue) === null ? "未公表・未取得" : `${annualNumber(reportedValue(point.period.revenue))}${annualUnit(point.period)}`}</span> : null}
      <span>{point.period.financialScope}</span>
      {point.missingReason ? <span>{point.missingReason}</span> : null}
      {metric === "revenue" ? <span>前年比 {watchPercent(point.revenueYoY, true)}{point.growthMissingReason ? `：${point.growthMissingReason}` : ""}</span> : null}
      {point.period.breakBefore ? <span>比較の区切り：{point.period.breakBefore}</span> : null}
    </div> : null}
  </figure>;
}
