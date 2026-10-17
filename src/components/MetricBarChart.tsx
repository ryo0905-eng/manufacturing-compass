import type { ReactNode } from "react";
import { RankingCompanyName } from "@/components/RankingCompanyName";
import { CountryRegion } from "@/components/CountryRegion";

export type MetricBarChartItem = {
  category: string;
  displayValue: string;
  label: string;
  logoId?: string;
  country?: string;
  value: number;
};

type MetricBarChartProps = {
  eyebrow: string;
  items: MetricBarChartItem[];
  note: string;
  title: string;
  reference?: MetricBarChartItem & { comparisonLabel: string };
  referenceNote?: ReactNode;
};

export function MetricBarChart({ eyebrow, items, note, title, reference, referenceNote }: MetricBarChartProps) {
  const comparison = reference && Number.isFinite(reference.value) && reference.value > 0 ? reference : undefined;
  const maxValue = Math.max(...items.map((item) => item.value), comparison?.value ?? 1);
  const percentage = (value: number) => Math.max(0, Math.min(100, (value / maxValue) * 100));
  const ratioText = (value: number) => {
    if (!comparison) return undefined;
    const rounded = (value / comparison.value).toFixed(1);
    return `${comparison.comparisonLabel}の${rounded === "0.0" ? "0.1倍未満" : `約${rounded}倍`}`;
  };

  return (
    <figure className="salary-bar-chart metric-bar-chart">
      <figcaption>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <small>{note}</small>
        {comparison && referenceNote ? <small>{referenceNote}</small> : null}
      </figcaption>
      <ol>
        {items.map((item, index) => {
          return (
            <li key={item.label}>
              <span className="salary-bar-chart__rank">{String(index + 1).padStart(2, "0")}</span>
              <div className="salary-bar-chart__company">
                <strong><RankingCompanyName companyId={item.logoId} name={item.label} /></strong>
                <small className={item.country ? "salary-bar-chart__region" : undefined}>{item.country ? <><CountryRegion country={item.country} /> / </> : null}{item.category}</small>
              </div>
              <div className="salary-bar-chart__track" aria-hidden="true">
                <i style={{ width: `${percentage(item.value)}%` }} />
              </div>
              <strong className="salary-bar-chart__value">
                {item.displayValue}
                {comparison ? <small className="metric-bar-chart__ratio">{ratioText(item.value)}</small> : null}
              </strong>
            </li>
          );
        })}
      </ol>
      {comparison ? (
        <div className="metric-bar-chart__reference" role="group" aria-label={`参考：${comparison.label}`}>
          <span className="salary-bar-chart__rank">参考</span>
          <div className="salary-bar-chart__company">
            <strong>参考：<RankingCompanyName companyId={comparison.logoId} name={comparison.label} /></strong>
            <small>{comparison.category}</small>
          </div>
          <div className="salary-bar-chart__track" aria-hidden="true">
            <i style={{ width: `${percentage(comparison.value)}%` }} />
          </div>
          <strong className="salary-bar-chart__value">
            {comparison.displayValue}
            <small className="metric-bar-chart__ratio">比較基準：1.0倍</small>
          </strong>
        </div>
      ) : null}
    </figure>
  );
}
