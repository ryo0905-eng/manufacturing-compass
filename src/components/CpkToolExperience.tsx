"use client";

import { useState } from "react";
import { CpkCalculator } from "@/components/CpkCalculator";
import { CpkLearningSimulator } from "@/components/CpkLearningSimulator";
import { trackEvent } from "@/lib/analytics";

type ToolView = "calculate" | "learn";

export function CpkToolExperience() {
  const [view, setView] = useState<ToolView>("calculate");

  function selectView(nextView: ToolView) {
    setView(nextView);
    trackEvent("cpk_tool_view_changed", { view: nextView });
  }

  return (
    <section className="cpk-tool-experience" aria-label="Cp・Cpkツール">
      <nav className="cpk-experience-tabs" aria-label="ツールのモード">
        <button aria-pressed={view === "calculate"} onClick={() => selectView("calculate")} type="button">
          <strong>データを計算</strong><span>手元の測定値を確認</span>
        </button>
        <button aria-pressed={view === "learn"} onClick={() => selectView("learn")} type="button">
          <strong>動かして理解</strong><span>平均とばらつきを学ぶ</span>
        </button>
      </nav>
      {view === "calculate" ? <CpkCalculator /> : <CpkLearningSimulator />}
    </section>
  );
}
