import {
  pulseCategories,
  pulseRegions,
  pulseThemeIds,
  type PulseFilters,
} from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

type FilterKey = keyof PulseFilters;

type IndustryFiltersProps = {
  filters: PulseFilters;
  resultCount: number;
  onChange: <Key extends FilterKey>(key: Key, value: PulseFilters[Key]) => void;
  onReset: () => void;
};

const groups = [
  { key: "region" as const, label: "地域", options: ["Global", ...pulseRegions] },
  { key: "category" as const, label: "カテゴリ", options: ["All", ...pulseCategories] },
  { key: "theme" as const, label: "テーマ", options: ["All", ...pulseThemeIds] },
];

const labels: Record<string, string> = {
  Global: "Global",
  All: "すべて",
  Japan: "Japan",
  US: "US",
  Taiwan: "Taiwan",
  Korea: "Korea",
  China: "China",
  Europe: "Europe",
  Fabless: "Fabless",
  Foundry: "Foundry",
  Equipment: "Equipment",
  Memory: "Memory",
  Materials: "Materials",
  IDM: "IDM",
  AI: "AI",
  HBM: "HBM",
  EUV: "EUV",
  "Advanced Packaging": "Advanced Packaging",
  SiC: "SiC",
  Automotive: "Automotive",
};

export function IndustryFilters({ filters, resultCount, onChange, onReset }: IndustryFiltersProps) {
  return (
    <section className={styles.filters} aria-label="ダッシュボード全体の絞り込み">
      <div className={styles.filterHeading}>
        <div>
          <span>EXPLORE</span>
          <strong>業界を横断して絞り込む</strong>
        </div>
        <p aria-live="polite"><strong>{resultCount}</strong>社を表示</p>
        <button type="button" onClick={onReset}>すべて解除</button>
      </div>
      <div className={styles.filterGroups}>
        {groups.map((group) => (
          <fieldset key={group.key}>
            <legend>{group.label}</legend>
            <div>
              {group.options.map((option) => {
                const selected = filters[group.key] === option;
                return (
                  <button
                    aria-pressed={selected}
                    key={option}
                    onClick={() => onChange(group.key, option as never)}
                    type="button"
                  >
                    {labels[option] ?? option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
