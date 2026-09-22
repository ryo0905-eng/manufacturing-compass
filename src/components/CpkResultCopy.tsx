"use client";

import { cpkText, type CpkLocale } from "@/data/cpk-text";

import { Button, FieldMessage, TextareaField } from "@/components/ui/Controls";
import styles from "./CpkControls.module.css";
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
    <div className={styles.copy}>
      <Button disabled={status === "copying"} onClick={copyResult}>
        {status === "copying" ? t("コピー中…") : t("結果をコピー")}
      </Button>
      <FieldMessage role="status">
        {status === "success" ? t("コピーしました。メモなどに貼り付けられます。") : status === "error" ? t("自動コピーできませんでした。下のテキストを選択して、手動でコピーしてください。") : ""}
      </FieldMessage>
      {status === "error" ? (
        <TextareaField id="cpk-copy-text" label={t("コピー用の計算結果（読取専用）")} readOnly value={text} rows={8} onFocus={(event) => event.currentTarget.select()} />
      ) : null}
    </div>
  );
}
