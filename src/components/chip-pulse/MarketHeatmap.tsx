import type { KeyboardEvent } from "react";
import type { PulseCompany, PulseSignal } from "@/data/chip-pulse";
import { getPulseCompanyActivity, layoutPulseTreemap } from "@/lib/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

type MarketHeatmapProps = {
  companies: PulseCompany[];
  signals: PulseSignal[];
  selectedCompanyId: string | null;
  onSelect: (companyId: string, source: "treemap" | "list") => void;
};

function movementClass(activity: { count: number; score: number }) {
  if (activity.count === 0) return styles.neutral;
  if (activity.score >= 2) return styles.positiveStrong;
  if (activity.score > 0) return styles.positive;
  if (activity.score <= -2) return styles.negativeStrong;
  if (activity.score < 0) return styles.negative;
  return styles.neutral;
}

function activityLabel(activity: { count: number; score: number }) {
  if (activity.count === 0) return "更新なし";
  if (activity.score > 0) return `${activity.count}件・前向き`;
  if (activity.score < 0) return `${activity.count}件・注意`;
  return `${activity.count}件・中立`;
}

export function MarketHeatmap({ companies, signals, selectedCompanyId, onSelect }: MarketHeatmapProps) {
  const { groups, rects } = layoutPulseTreemap(companies);
  const total = companies.reduce((sum, company) => sum + company.marketCapUsdB, 0);
  const sortedCompanies = [...companies].sort((a, b) => b.marketCapUsdB - a.marketCapUsdB);

  function handleKeyDown(event: KeyboardEvent<SVGGElement>, companyId: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect(companyId, "treemap");
  }

  return (
    <section className={styles.heatmapPanel} aria-labelledby="pulse-heatmap-title">
      <header className={styles.panelHeading}>
        <div><span>COMPANY SIGNAL MAP</span><h2 id="pulse-heatmap-title">企業規模と公式シグナルを一枚で見る</h2></div>
        <p>面積：時価総額 / 色：直近30日の発表トーン</p>
      </header>
      <div className={styles.heatmapDesktop}>
        <svg viewBox="0 0 1000 520" role="img" aria-label={`${companies.length}社の時価総額と直近30日の公式シグナルを示すヒートマップ`}>
          {rects.map((rect) => {
            const activity = getPulseCompanyActivity(rect.company.id, signals);
            const showName = rect.width > 60 && rect.height > 36;
            const showChange = rect.width > 74 && rect.height > 58;
            const isSelected = selectedCompanyId === rect.company.id;
            const isDimmed = Boolean(selectedCompanyId && !isSelected);
            return (
              <g
                aria-label={`${rect.company.name}、公式シグナル${activityLabel(activity)}、${rect.company.category}`}
                className={`${styles.heatmapCell} ${movementClass(activity)} ${isSelected ? styles.selectedCell : ""} ${isDimmed ? styles.dimmedCell : ""}`}
                key={rect.id}
                onClick={() => onSelect(rect.company.id, "treemap")}
                onKeyDown={(event) => handleKeyDown(event, rect.company.id)}
                role="button"
                tabIndex={0}
              >
                <title>{`${rect.company.name} / ${rect.company.category} / ${activityLabel(activity)}`}</title>
                <rect x={rect.x + 1} y={rect.y + 1} width={Math.max(0, rect.width - 2)} height={Math.max(0, rect.height - 2)} rx="3" />
                {showName ? <text x={rect.x + 9} y={rect.y + 22}>{rect.company.shortName}</text> : null}
                {showChange ? <text className={styles.cellChange} x={rect.x + 9} y={rect.y + 43}>{activityLabel(activity)}</text> : null}
              </g>
            );
          })}
          {groups.map((group) => (
            <g className={styles.groupOutline} key={group.id} aria-hidden="true">
              <rect x={group.x + 0.5} y={group.y + 0.5} width={Math.max(0, group.width - 1)} height={Math.max(0, group.height - 1)} />
              {group.width > 105 && group.height > 30 ? <text x={group.x + group.width - 7} y={group.y + group.height - 8}>{group.id}</text> : null}
            </g>
          ))}
        </svg>
      </div>
      <details className={styles.companyDirectory}>
        <summary>小さい企業も一覧から選ぶ <span>{companies.length}社</span></summary>
        <div className={styles.companyList} aria-label="ヒートマップ掲載企業一覧">
          {sortedCompanies.map((company) => {
            const activity = getPulseCompanyActivity(company.id, signals);
            return <button aria-pressed={selectedCompanyId === company.id} className={movementClass(activity)} key={company.id} onClick={() => onSelect(company.id, "list")} type="button">
              <span><strong>{company.shortName}</strong><small>{company.category} · {company.region}</small></span><b>{activityLabel(activity)}</b>
            </button>;
          })}
        </div>
      </details>
      <div className={`${styles.companyList} ${styles.mobileCompanyList}`} aria-label="ヒートマップ掲載企業一覧">
        {sortedCompanies.map((company) => {
          const activity = getPulseCompanyActivity(company.id, signals);
          return <button aria-pressed={selectedCompanyId === company.id} className={movementClass(activity)} key={company.id} onClick={() => onSelect(company.id, "list")} type="button">
            <span><strong>{company.shortName}</strong><small>{company.category} · {company.region}</small></span><b>{activityLabel(activity)}</b>
          </button>;
        })}
      </div>
      <footer className={styles.heatmapLegend}>
        <div><span><i className={styles.legendUp} />前向き</span><span><i className={styles.legendFlat} />更新なし・中立</span><span><i className={styles.legendDown} />注意</span></div>
        <div className={styles.sectorLegend}>{groups.map((group) => <span key={group.id}>{group.id}</span>)}</div>
        <small>表示対象の合計時価総額：{total.toLocaleString("ja-JP", { maximumFractionDigits: 0 })} 十億米ドル（{companies.length}社）</small>
      </footer>
    </section>
  );
}
