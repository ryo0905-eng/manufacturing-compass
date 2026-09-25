"use client";

import { cpkText, type CpkLocale } from "@/data/cpk-text";

import { SelectionButton } from "@/components/ui/Controls";
import styles from "./CpkControls.module.css";
import { useEffect, useRef, useState } from "react";
import { CpkCalculator } from "@/components/CpkCalculator";
import { CpkLearningSimulator } from "@/components/CpkLearningSimulator";
import { trackEvent } from "@/lib/analytics";

type ToolView = "calculate" | "learn";

export function CpkToolExperience({ locale = "ja" }: { locale?: CpkLocale } = {}) {
  const t = (text: string) => cpkText(locale, text);
  const [view, setView] = useState<ToolView>("calculate");
  const hasTrackedView = useRef(false);
  const learningPanel = useRef<HTMLDivElement>(null);
  const focusLearning = useRef(false);

  useEffect(() => {
    if (view === "learn" && focusLearning.current) {
      focusLearning.current = false;
      learningPanel.current?.scrollIntoView({ block: "start", behavior: "instant" });
      learningPanel.current?.focus({ preventScroll: true });
    }
  }, [view]);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackEvent("cpk_tool_viewed", { default_view: "calculate", ...(locale === "en" ? { locale } : {}) });
  }, [locale]);

  function selectView(nextView: ToolView) {
    if (nextView === view) return;
    setView(nextView);
    trackEvent("cpk_tool_view_changed", { view: nextView, ...(locale === "en" ? { locale } : {}) });
  }

  return (
    <section className="cpk-tool-experience" aria-label={t("Cp・Cpkツール")}>
      <nav className={`${styles.selectionGroup} ${styles.modes}`} aria-label={t("ツールのモード")}>
        <SelectionButton selected={view === "calculate"} onClick={() => selectView("calculate")}>
          <span className={styles.modeLabel}><strong>{t("データを計算")}</strong><span>{t("手元の測定値を確認")}</span></span>
        </SelectionButton>
        <SelectionButton selected={view === "learn"} onClick={() => selectView("learn")}>
          <span className={styles.modeLabel}><strong>{t("動かして理解")}</strong><span>{t("平均とばらつきを学ぶ")}</span></span>
        </SelectionButton>
      </nav>
      <div hidden={view !== "calculate"} inert={view !== "calculate"}><CpkCalculator locale={locale} onLearn={() => {
        focusLearning.current = true;
        trackEvent("cpk_related_content_click", { destination: "learning_simulator", placement: "result" });
        selectView("learn");
      }} /></div>
      <div ref={learningPanel} tabIndex={-1} aria-label={t("平均とばらつきを学ぶ")} style={{ scrollMarginTop: 100 }} hidden={view !== "learn"} inert={view !== "learn"}><CpkLearningSimulator locale={locale} /></div>
    </section>
  );
}
