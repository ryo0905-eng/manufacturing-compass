"use client";

import { useState } from "react";
import type { PulseFilters } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

type FilterKey = keyof PulseFilters;

type IndustryFiltersProps = {
  filters: PulseFilters;
  resultCount: number;
  onChange: <Key extends FilterKey>(key: Key, value: PulseFilters[Key]) => void;
  onReset: () => void;
};

const quickGroups = [
  { key: "region" as const, label: "地域", options: ["Global", "Japan", "US", "Asia"] },
  { key: "category" as const, label: "セクター", options: ["All", "Equipment", "Foundry", "Memory", "Fabless"] },
  { key: "theme" as const, label: "テーマ", options: ["All", "AI", "HBM", "EUV", "Advanced Packaging"] },
];

const advancedGroups = [
  { key: "region" as const, label: "地域を詳しく", options: ["Taiwan", "Korea", "China", "Europe"] },
  { key: "category" as const, label: "セクターを詳しく", options: ["Materials", "IDM"] },
  { key: "theme" as const, label: "テーマを詳しく", options: ["SiC", "Automotive", "China", "Foundry"] },
];

const labels: Record<string, string> = {
  Global: "Global", All: "すべて", Japan: "Japan", US: "US", Asia: "Asia",
  Taiwan: "Taiwan", Korea: "Korea", China: "China", Europe: "Europe",
  Fabless: "Fabless", Foundry: "Foundry", Equipment: "Equipment", Memory: "Memory",
  Materials: "Materials", IDM: "IDM", AI: "AI", HBM: "HBM", EUV: "EUV",
  "Advanced Packaging": "Packaging", SiC: "SiC", Automotive: "Automotive",
};

type FilterGroup = (typeof quickGroups)[number] | (typeof advancedGroups)[number];

export function IndustryFilters({ filters, resultCount, onChange, onReset }: IndustryFiltersProps) {
  const [showMore, setShowMore] = useState(false);
  const advancedActive = advancedGroups.some((group) => group.options.some((option) => filters[group.key] === option));

  function renderGroup(group: FilterGroup) {
    return (
      <fieldset key={`${group.key}-${group.label}`}>
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
    );
  }

  return (
    <section className={styles.filters} aria-label="ダッシュボード全体の絞り込み">
      <div className={styles.filterHeading}>
        <div><span>EXPLORE</span><strong>全体を絞り込む</strong></div>
        <p aria-live="polite"><strong>{resultCount}</strong>社</p>
        <button type="button" onClick={onReset}>解除</button>
      </div>
      <div className={styles.filterBody}>
        <div className={styles.filterGroups}>{quickGroups.map(renderGroup)}</div>
        <button
          aria-expanded={showMore}
          className={styles.moreFilters}
          onClick={() => setShowMore((current) => !current)}
          type="button"
        >
          {showMore ? "詳細を閉じる" : "More filters"}{advancedActive ? " · 選択中" : ""}
        </button>
        {showMore ? <div className={styles.advancedFilters}>{advancedGroups.map(renderGroup)}</div> : null}
      </div>
    </section>
  );
}
