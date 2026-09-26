import type { PulseTheme } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

function sparklinePoints(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  return values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${30 - ((value - min) / range) * 26}`).join(" ");
}

export function ThemePulse({ themes }: { themes: PulseTheme[] }) {
  const highlightedThemes = [...themes].sort((a, b) => b.score - a.score).slice(0, 4);
  return (
    <section className={styles.sectionPanel} aria-labelledby="theme-pulse-title">
      <header className={styles.sectionHeading}><div><span>THEME PULSE / DEMO</span><h2 id="theme-pulse-title">いま動く4テーマ</h2></div><p>Pulse上位 / 7観測点</p></header>
      {highlightedThemes.length > 0 ? <div className={styles.themeGrid}>
        {highlightedThemes.map((theme) => (
          <article className={styles[`direction_${theme.direction}`]} key={theme.id}>
            <div><span>{theme.id}</span><strong>{theme.label}</strong><p>{theme.note}</p></div>
            <svg viewBox="0 0 100 34" role="img" aria-label={`${theme.label}の7観測点の推移`}><polyline points={sparklinePoints(theme.series)} /></svg>
            <dl><div><dt>Pulse</dt><dd>{theme.score}</dd></div><div><dt>Change</dt><dd>{theme.change > 0 ? "+" : ""}{theme.change}</dd></div></dl>
          </article>
        ))}
      </div> : <p className={styles.emptyText}>この条件に関連するテーマはありません。</p>}
    </section>
  );
}
