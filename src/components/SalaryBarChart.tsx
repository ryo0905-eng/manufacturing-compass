type SalaryBarChartItem = {
  category: string;
  label: string;
  value: number;
};

type SalaryBarChartProps = {
  items: SalaryBarChartItem[];
  title: string;
  unit: string;
};

export function SalaryBarChart({ items, title, unit }: SalaryBarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <figure className="salary-bar-chart">
      <figcaption>
        <span>Salary overview</span>
        <strong>{title}</strong>
        <small>棒の長さは0万円を基準に、掲載値の最大値との比率で表示しています。</small>
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
              <strong className="salary-bar-chart__value">{item.value.toLocaleString("ja-JP")}<small>{unit}</small></strong>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
