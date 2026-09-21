"use client";

import { cpkText, type CpkLocale } from "@/data/cpk-text";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { CapabilityMethod } from "@/lib/process-capability";

export function CpkResultCopy({ text, method, locale = "ja" }: { text: string; method: CapabilityMethod; locale?: CpkLocale }) {
  const t = (text: string) => cpkText(locale, text);
  const [status, setStatus] = useState<"idle" | "copying" | "success" | "error">("idle");
  const copying = useRef(false);

  async function copyResult() {
    if (copying.current) return;
    copying.current = true;
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      copying.current = false;
      setStatus("error");
      return;
    }
    copying.current = false;
    setStatus("success");
    trackEvent("cpk_result_copied", { method, ...(locale === "en" ? { locale } : {}) });
  }

  return (
    <div className="cpk-result-copy">
      <button type="button" disabled={status === "copying"} onClick={copyResult}>
        {status === "copying" ? t("コピー中…") : t("結果をコピー")}
      </button>
      <p role="status">
        {status === "success" ? t("コピーしました。メモなどに貼り付けられます。") : status === "error" ? t("自動コピーできませんでした。下のテキストを選択して、手動でコピーしてください。") : ""}
      </p>
      {status === "error" ? (
        <label>
          {t("コピー用の計算結果（読取専用）")}<textarea readOnly value={text} rows={8} onFocus={(event) => event.currentTarget.select()} />
        </label>
      ) : null}
    </div>
  );
}
