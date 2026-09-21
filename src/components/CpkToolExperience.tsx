"use client";

import { cpkText, type CpkLocale } from "@/data/cpk-text";

import { useEffect, useRef, useState } from "react";
import { CpkCalculator } from "@/components/CpkCalculator";
import { CpkLearningSimulator } from "@/components/CpkLearningSimulator";
import { trackEvent } from "@/lib/analytics";

type ToolView = "calculate" | "learn";

export function CpkToolExperience({ locale = "ja" }: { locale?: CpkLocale } = {}) {
  const t = (text: string) => cpkText(locale, text);
  const [view, setView] = useState<ToolView>("calculate");
  const hasTrackedView = useRef(false);

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
      <nav className="cpk-experience-tabs" aria-label={t("ツールのモード")}>
        <button aria-pressed={view === "calculate"} onClick={() => selectView("calculate")} type="button">
          <strong>{t("データを計算")}</strong><span>{t("手元の測定値を確認")}</span>
        </button>
        <button aria-pressed={view === "learn"} onClick={() => selectView("learn")} type="button">
          <strong>{t("動かして理解")}</strong><span>{t("平均とばらつきを学ぶ")}</span>
        </button>
      </nav>
      <div hidden={view !== "calculate"} inert={view !== "calculate"}><CpkCalculator locale={locale} /></div>
      <div hidden={view !== "learn"} inert={view !== "learn"}><CpkLearningSimulator locale={locale} /></div>
    </section>
  );
}
