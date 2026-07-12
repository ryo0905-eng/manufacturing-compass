"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type TodayQuestProps = {
  action: string;
  reason?: string;
  resultType?: string;
  duration?: string;
};

export function TodayQuest({ action, reason, resultType, duration }: TodayQuestProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function copyAction() {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    trackEvent("today_quest_copy", { result_type: resultType ?? "unknown" });

    try {
      await navigator.clipboard.writeText(action);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    resetTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
  }

  if (!action) return null;

  const shortReason = reason?.match(/[^。！？]+[。！？]?/)?.[0] ?? reason;

  return (
    <section className="today-quest-result" id="today-quest" aria-labelledby="today-quest-title">
      <div className="today-quest-result-head">
        <p className="result-kicker">Today Quest</p>
        <span>15分でできる準備</span>
      </div>
      <div className="today-quest-result-body">
        <div>
          <h2 id="today-quest-title">今日やること</h2>
          <p className="today-quest-action">{action}</p>
        </div>
        <dl>
          {shortReason ? (
            <div>
              <dt>この行動が効く理由</dt>
              <dd>{shortReason}</dd>
            </div>
          ) : null}
          {duration ? (
            <div>
              <dt>想定所要時間</dt>
              <dd>{duration}</dd>
            </div>
          ) : null}
        </dl>
        <div className="today-quest-copy">
          <button className="button quest-copy-button" onClick={copyAction} type="button">
            {copyStatus === "copied" ? "コピーしました" : "行動をコピー"}
          </button>
          <span aria-live="polite">
            {copyStatus === "error" ? "コピーできませんでした。文面を選択してコピーしてください。" : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
