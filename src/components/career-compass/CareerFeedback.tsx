"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { trackCareerCompassEvent } from "@/lib/analytics";
import styles from "./CareerFeedback.module.css";

type FeedbackResponse = "found" | "unsure" | "mismatch";
type FeedbackReason = "role" | "preparation" | "company" | "other";

const responses: { label: string; value: FeedbackResponse }[] = [
  { label: "見つかった", value: "found" },
  { label: "まだ迷う", value: "unsure" },
  { label: "内容が合わない", value: "mismatch" },
];

const reasons: { label: string; value: FeedbackReason }[] = [
  { label: "職種候補", value: "role" },
  { label: "準備の進め方", value: "preparation" },
  { label: "企業の探し方", value: "company" },
  { label: "その他", value: "other" },
];

export function CareerFeedback() {
  const [response, setResponse] = useState<FeedbackResponse | null>(null);
  const [reason, setReason] = useState<FeedbackReason | null>(null);
  const responseRef = useRef<FeedbackResponse | null>(null);
  const reasonRef = useRef<FeedbackReason | null>(null);

  function chooseResponse(value: FeedbackResponse) {
    if (responseRef.current) return;
    responseRef.current = value;
    setResponse(value);

    try {
      trackCareerCompassEvent("career_compass_feedback", {
        placement: "today_quest",
        response: value,
        ui_version: "quick-v1",
      });
    } catch {
      // Feedback remains usable when analytics is unavailable.
    }
  }

  function chooseReason(value: FeedbackReason) {
    const selectedResponse = responseRef.current;
    if (!selectedResponse || selectedResponse === "found" || reasonRef.current) return;
    reasonRef.current = value;
    setReason(value);

    try {
      trackCareerCompassEvent("career_compass_feedback_reason", {
        placement: "today_quest",
        reason: value,
        response: selectedResponse,
        ui_version: "quick-v1",
      });
    } catch {
      // The optional follow-up does not depend on analytics.
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="career-feedback-title">
      <div className={styles.intro}>
        <h2 id="career-feedback-title">次にやることは見つかりましたか？</h2>
        {!response ? <p>1回選ぶだけで回答できます。</p> : null}
      </div>

      {!response ? (
        <div className={styles.choices} role="group" aria-label="次にやることについての回答">
          {responses.map(({ label, value }) => (
            <button className={styles.choice} key={value} onClick={() => chooseResponse(value)} type="button">
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.followUp}>
          <p className={styles.thanks} role="status">{reason ? "追加の回答もありがとうございます。" : "回答ありがとうございます。"}</p>
          {response !== "found" && !reason ? (
            <div>
              <p className={styles.optionalQuestion}>よければ、気になった点も教えてください。<span>任意</span></p>
              <div className={styles.choices} role="group" aria-label="気になった点">
                {reasons.map(({ label, value }) => (
                  <button className={styles.choice} key={value} onClick={() => chooseReason(value)} type="button">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {response !== "found" ? (
            <Link className={styles.contact} href="/contact">詳しく伝える場合はお問い合わせへ</Link>
          ) : null}
        </div>
      )}
    </section>
  );
}
