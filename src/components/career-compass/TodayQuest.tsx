"use client";

import { useEffect, useRef, useState } from "react";

type TodayQuestProps = {
  action: string;
  reason?: string;
  duration?: string;
};

export function TodayQuest({ action, reason, duration }: TodayQuestProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function copyAction() {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    try {
      await navigator.clipboard.writeText(action);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    resetTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
  }

  if (!action) return null;

  return (
    <section className="today-quest-result" id="today-quest" aria-labelledby="today-quest-title">
      <div className="today-quest-result-head">
        <p className="result-kicker">Today Quest</p>
        <span>今日から、ルートが動き出す</span>
      </div>
      <div className="today-quest-result-body">
        <div>
          <h2 id="today-quest-title">今日のキャリアクエスト</h2>
          <p className="today-quest-action">{action}</p>
        </div>
        <dl>
          {reason ? (
            <div>
              <dt>この行動が効く理由</dt>
              <dd>{reason}</dd>
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
