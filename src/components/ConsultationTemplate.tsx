"use client";

import { useRef, useState } from "react";
import { consultationTemplate } from "@/data/career-consultation";
import { trackEvent } from "@/lib/analytics";
import styles from "./ConsultationTemplate.module.css";

export function ConsultationTemplate() {
  const [status, setStatus] = useState<"idle" | "copying" | "success" | "error">("idle");
  const copying = useRef(false);

  async function copyTemplate() {
    if (copying.current) return;
    copying.current = true;
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(consultationTemplate);
    } catch {
      setStatus("error");
      copying.current = false;
      return;
    }
    setStatus("success");
    copying.current = false;
    trackEvent("consultation_template_copy");
  }

  return (
    <div className={styles.template}>
      <p id="consultation-template-help">空欄があっても大丈夫です。ひな形をコピーし、手元のメモに記入してください。会社の機密や公開できない数字は書かず、相談で伝えられる範囲に整理します。</p>
      <label htmlFor="consultation-template">相談メモのひな形（読取専用）</label>
      <textarea
        id="consultation-template"
        aria-describedby="consultation-template-help"
        readOnly
        value={consultationTemplate}
        rows={20}
        onFocus={(event) => event.currentTarget.select()}
      />
      <button className="button primary" type="button" disabled={status === "copying"} onClick={copyTemplate}>
        {status === "copying" ? "コピー中…" : "相談メモのひな形をコピー"}
      </button>
      <p className={styles.status} role="status">
        {status === "success" ? "コピーしました。手元のメモに貼り付けて記入できます。" : status === "error" ? "自動コピーできませんでした。上のひな形を選択して、手動でコピーしてください。" : "ひな形を選択して、手動でもコピーできます。"}
      </p>
    </div>
  );
}
