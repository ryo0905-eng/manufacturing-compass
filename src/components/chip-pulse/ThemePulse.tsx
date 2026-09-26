import type { PulseTheme } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

export function ThemePulse({ themes }: { themes: PulseTheme[] }) {
  const highlightedThemes = [...themes].sort((a, b) => b.signalCount - a.signalCount).slice(0, 4);
  const maxSignals = Math.max(1, ...highlightedThemes.map((theme) => theme.signalCount));
  return (
    <section className={styles.sectionPanel} aria-labelledby="theme-pulse-title">
      <header className={styles.sectionHeading}><div><span>THEME PULSE / VERIFIED</span><h2 id="theme-pulse-title">公式更新が集まる4テーマ</h2></div><p>直近30日 / 発表件数順</p></header>
      {highlightedThemes.length > 0 ? <div className={styles.themeGrid}>
        {highlightedThemes.map((theme) => (
          <article className={styles.direction_up} key={theme.id}>
            <div><span>{theme.id}</span><strong>{theme.label}</strong><p>{theme.note}</p></div>
            <div className={styles.themeMeter} role="img" aria-label={`${theme.label}は公式更新${theme.signalCount}件`}>
              {Array.from({ length: maxSignals }, (_, index) => <i className={index < theme.signalCount ? styles.themeMeterActive : ""} key={index} />)}
            </div>
            <dl><div><dt>Signals</dt><dd>{theme.signalCount}</dd></div><div><dt>Companies</dt><dd>{theme.companyCount}</dd></div><div><dt>Latest</dt><dd>{new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(new Date(theme.latestAt))}</dd></div></dl>
          </article>
        ))}
      </div> : <p className={styles.emptyText}>この条件に関連するテーマはありません。</p>}
    </section>
  );
}
