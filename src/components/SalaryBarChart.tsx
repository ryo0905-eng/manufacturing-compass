import { MetricBarChart } from "@/components/MetricBarChart";

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
  return (
    <MetricBarChart
      eyebrow="Salary overview"
      items={items.map((item) => ({
        ...item,
        displayValue: `${item.value.toLocaleString("ja-JP")}${unit}`,
      }))}
      note="棒の長さは0万円を基準に、掲載値の最大値との比率で表示しています。"
      title={title}
    />
  );
}
