import type { CapabilityResult } from "@/lib/process-capability";

type HistogramBin = { start: number; end: number; count: number };

function createBins(values: number[], domainMin: number, domainMax: number): HistogramBin[] {
  const count = Math.max(6, Math.min(12, Math.ceil(Math.sqrt(values.length))));
  const width = (domainMax - domainMin) / count;
  const bins = Array.from({ length: count }, (_, index) => ({
    start: domainMin + index * width,
    end: domainMin + (index + 1) * width,
    count: 0,
  }));
  for (const value of values) {
    const index = Math.min(count - 1, Math.max(0, Math.floor((value - domainMin) / width)));
    bins[index].count += 1;
  }
  return bins;
}

function number(value: number) {
  return Number(value.toFixed(4)).toString();
}

export function CapabilityHistogram({ result, values }: { result: CapabilityResult; values: number[] }) {
  if (values.length < 2 || result.standardDeviation <= 0) {
    return <p className="capability-chart-empty">分布を描画するには、異なる測定値が2件以上必要です。</p>;
  }

  const candidates = [
    ...values,
    result.lowerSpecificationLimit,
    result.upperSpecificationLimit,
    result.mean - result.standardDeviation * 3.5,
    result.mean + result.standardDeviation * 3.5,
  ].filter((value): value is number => value !== undefined && Number.isFinite(value));
  const rawMin = Math.min(...candidates);
  const rawMax = Math.max(...candidates);
  const padding = Math.max((rawMax - rawMin) * 0.07, Math.abs(rawMax || 1) * 0.002);
  const domainMin = rawMin - padding;
  const domainMax = rawMax + padding;
  const bins = createBins(values, domainMin, domainMax);
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1);
  const plot = { x: 44, y: 26, width: 632, height: 220 };
  const gridTicks = [0, 0.25, 0.5, 0.75, 1];
  const x = (value: number) => plot.x + ((value - domainMin) / (domainMax - domainMin)) * plot.width;
  const center = result.specificationCenter;
  const lines = [
    result.lowerSpecificationLimit === undefined ? undefined : { label: "LSL", value: result.lowerSpecificationLimit, className: "spec" },
    result.upperSpecificationLimit === undefined ? undefined : { label: "USL", value: result.upperSpecificationLimit, className: "spec" },
    { label: "平均", value: result.mean, className: "mean" },
    center === undefined ? undefined : { label: "規格中心", value: center, className: "center" },
  ].filter((line): line is { label: string; value: number; className: string } => line !== undefined);

  return (
    <figure className="capability-chart">
      <svg viewBox="0 0 720 290" role="img" aria-labelledby="capability-chart-title capability-chart-desc">
        <title id="capability-chart-title">測定値のヒストグラム</title>
        <desc id="capability-chart-desc">{values.length}件の測定値の分布。平均は{number(result.mean)}、標準偏差は{number(result.standardDeviation)}です。</desc>
        <rect className="chart-plot-background" x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx="5" />
        {gridTicks.map((tick) => {
          const y = plot.y + plot.height - tick * plot.height;
          return <g className="chart-grid" key={tick}><line x1={plot.x} x2={plot.x + plot.width} y1={y} y2={y} /><text x={plot.x - 10} y={y + 3} textAnchor="end">{Math.round(maxCount * tick)}</text></g>;
        })}
        <line className="axis" x1={plot.x} x2={plot.x + plot.width} y1={plot.y + plot.height} y2={plot.y + plot.height} />
        {bins.map((bin, index) => {
          const barWidth = plot.width / bins.length - 3;
          const height = (bin.count / maxCount) * (plot.height - 22);
          return (
            <g className="histogram-bar" key={bin.start} tabIndex={0} role="img" aria-label={`${number(bin.start)}以上${number(bin.end)}未満、${bin.count}件`}>
              <title>{number(bin.start)}〜{number(bin.end)}：{bin.count}件</title>
              <rect x={plot.x + index * (plot.width / bins.length) + 1.5} y={plot.y + plot.height - height} width={barWidth} height={height} rx="2" />
            </g>
          );
        })}
        {lines.map((line) => (
          <g className={`chart-reference chart-reference--${line.className}`} key={line.label} tabIndex={0} role="img" aria-label={`${line.label} ${number(line.value)}`}>
            <title>{line.label}：{number(line.value)}</title>
            <line x1={x(line.value)} x2={x(line.value)} y1={plot.y - 2} y2={plot.y + plot.height} />
            <text x={x(line.value)} y={line.label === "規格中心" ? 22 : 12} textAnchor="middle">{line.label}</text>
          </g>
        ))}
        <text className="axis-label" x={plot.x} y="275">{number(domainMin)}</text>
        <text className="axis-label" x={plot.x + plot.width} y="275" textAnchor="end">{number(domainMax)}</text>
      </svg>
      <div className="capability-chart-legend" aria-label="グラフの凡例">
        <span className="capability-chart-legend__bar">測定値</span>
        <span className="capability-chart-legend__spec">規格限界</span>
        <span className="capability-chart-legend__mean">平均</span>
        {center === undefined ? null : <span className="capability-chart-legend__center">規格中心</span>}
      </div>
      <figcaption>棒を選択すると区間と件数を確認できます。実線は規格限界、破線は平均、点線は規格中心です。</figcaption>
    </figure>
  );
}
