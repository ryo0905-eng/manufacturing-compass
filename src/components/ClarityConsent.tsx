"use client";

import { useEffect, useState } from "react";
import { isClarityPage, loadClarity, readClarityChoice, revokeClarity, saveClarityChoice, CLARITY_CONSENT_KEY, type ClarityChoice } from "@/lib/clarity";
import styles from "./ClarityConsent.module.css";

export function ClarityConsent({ projectId }: { projectId: string }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<ClarityChoice | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isClarityPage(window.location)) return;
    let saved: ClarityChoice | null = null;
    try { saved = readClarityChoice(window.localStorage); } catch { /* No consent if storage is blocked. */ }
    setChoice(saved);
    setExpanded(saved === null);
    setReady(true);
    if (saved === "granted") loadClarity(projectId, window, document);

    function checkConsent() {
      let current: ClarityChoice | null = null;
      try { current = readClarityChoice(window.localStorage); } catch { /* Treat inaccessible storage as withdrawal. */ }
      if (document.getElementById("mfg-clarity") && current !== "granted") revokeClarity(window, document);
    }
    function onStorage(event: StorageEvent) {
      if (event.key === CLARITY_CONSENT_KEY || event.key === null) checkConsent();
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", checkConsent);
    const expiryCheck = window.setInterval(checkConsent, 60_000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", checkConsent);
      window.clearInterval(expiryCheck);
    };
  }, [projectId]);

  function choose(next: ClarityChoice) {
    try {
      saveClarityChoice(window.localStorage, next);
    } catch {
      if (next === "denied") { revokeClarity(window, document); return; }
      setError("設定を保存できないため、操作記録は開始していません。記録せずに記事をご利用いただけます。");
      return;
    }
    setChoice(next);
    setExpanded(false);
    setError("");
    if (next === "granted") loadClarity(projectId, window, document);
    else if (document.getElementById("mfg-clarity")) revokeClarity(window, document);
  }

  if (!ready) return null;
  return (
    <aside className={styles.consent} aria-label="操作記録の設定" data-clarity-mask="true">
      {expanded ? <>
        <strong>この記事の使いやすさの改善にご協力いただけますか？</strong>
        <p>同意すると、Microsoft ClarityがCookieを使い、この記事のクリック・スクロールなどの操作を記録し、Microsoftへ送信します。同意しなくても記事を読めます。</p>
        <p><a href="/privacy#clarity">記録する情報と設定について</a></p>
        <div className={styles.actions}>
          <button type="button" onClick={() => choose("denied")}>同意しない</button>
          <button type="button" onClick={() => choose("granted")}>同意する</button>
          {choice !== null && <button type="button" onClick={() => setExpanded(false)}>閉じる</button>}
        </div>
        {error && <p role="status">{error}</p>}
      </> : <button type="button" onClick={() => setExpanded(true)}>操作記録の設定を変更</button>}
    </aside>
  );
}
