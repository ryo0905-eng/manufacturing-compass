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
        <h2 id="today-quest-title">今日やること</h2>
        <span>{duration ?? "15分でできる準備"}</span>
      </div>
      <div className="today-quest-result-body">
        <p className="today-quest-action">{action}</p>
        <dl>
          {shortReason ? (
            <div>
              <dt>先にこれをやる理由</dt>
              <dd>{shortReason}</dd>
            </div>
          ) : null}
        </dl>
        <div className="today-quest-copy">
          <button className="button quest-copy-button" onClick={copyAction} type="button">
            {copyStatus === "copied" ? "コピーしました" : "メモにコピー"}
          </button>
          <span aria-live="polite">
            {copyStatus === "error" ? "コピーできませんでした。文面を選択してコピーしてください。" : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
