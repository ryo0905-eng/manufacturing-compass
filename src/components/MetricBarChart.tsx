export type MetricBarChartItem = {
  category: string;
  displayValue: string;
  label: string;
  value: number;
};

type MetricBarChartProps = {
  eyebrow: string;
  items: MetricBarChartItem[];
  note: string;
  title: string;
};

export function MetricBarChart({ eyebrow, items, note, title }: MetricBarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <figure className="salary-bar-chart metric-bar-chart">
      <figcaption>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <small>{note}</small>
      </figcaption>
      <ol>
        {items.map((item, index) => {
          const percentage = Math.max(0, Math.min(100, (item.value / maxValue) * 100));

          return (
            <li key={item.label}>
              <span className="salary-bar-chart__rank">{String(index + 1).padStart(2, "0")}</span>
              <div className="salary-bar-chart__company">
                <strong>{item.label}</strong>
                <small>{item.category}</small>
              </div>
              <div className="salary-bar-chart__track" aria-hidden="true">
                <i style={{ width: `${percentage}%` }} />
              </div>
              <strong className="salary-bar-chart__value">{item.displayValue}</strong>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
