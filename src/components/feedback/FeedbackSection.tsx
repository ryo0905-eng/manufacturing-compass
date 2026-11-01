"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { feedbackSurveys, features, interests, needs, type SurveyId } from "@/data/feedback";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";
import styles from "./feedback.module.css";

type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

export function FeedbackSection({ survey, siteKey }: { survey: SurveyId; siteKey: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [interest, setInterest] = useState("");
  const wrapper = useRef<HTMLElement>(null);
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const submissionId = useRef<string | null>(null);
  const formId = useId();
  const config = feedbackSurveys[survey];
  const analytics = (name: string, extra: Record<string, string> = {}) => {
    try { trackEvent(name, { survey_id: survey, source_page: config.source, placement: "after_content", ui_version: "feedback-v1", ...extra }); } catch { /* Feedback remains usable without analytics. */ }
  };
  useEffect(() => {
    if (!wrapper.current) return;
    return observeVisibleOnce(wrapper.current, () => analytics("feedback_view"));
    // Each mounted placement records its own first exposure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey]);
  useEffect(() => {
    if (!open || !challenge.current) return;
    let cancelled = false;
    let script = document.getElementById("feedback-turnstile") as HTMLScriptElement | null;
    const render = () => {
      if (!cancelled && challenge.current && window.turnstile && widget.current === null) {
        widget.current = window.turnstile.render(challenge.current, { sitekey: siteKey, action: "feedback", callback: (value: string) => setToken(value), "expired-callback": () => setToken(""), "error-callback": () => { setToken(""); setStatus("認証を読み込めませんでした。時間をおいてお試しください。"); } });
      }
    };
    if (!script) {
      script = document.createElement("script");
      script.id = "feedback-turnstile";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    script.addEventListener("error", onError);
    if (window.turnstile) render();
    function onError() { if (!cancelled) setStatus("認証を読み込めませんでした。時間をおいてお試しください。"); }
    return () => { cancelled = true; script?.removeEventListener("load", render); script?.removeEventListener("error", onError); if (widget.current !== null) { window.turnstile?.remove(widget.current); widget.current = null; } };
  }, [open, siteKey]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !token) { setStatus("認証が完了するまでお待ちください。"); return; }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const consent = form.get("consent") === "on";
    if (Boolean(email) !== consent) { setStatus("連絡を希望する場合はメールアドレスを入力し、同意してください。"); return; }
    const need = String(form.get("need") || "");
    const feature = String(form.get("feature") || "");
    submissionId.current ||= crypto.randomUUID();
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ feedback: { id: submissionId.current, survey, need, feature, interest, detail: String(form.get("detail") || ""), email, consent }, token, honeypot: String(form.get("website") || "") }) });
      if (!response.ok) throw new Error("submit failed");
      analytics("feedback_submit", { need_id: need, feature_id: feature, interest_level: interest });
      setDone(true); setOpen(false); setStatus("ご意見をありがとうございます。");
    } catch { setStatus("送信を確認できませんでした。内容を残していますので、認証後にもう一度お試しください。"); }
    finally { setBusy(false); setToken(""); if (widget.current !== null) window.turnstile?.reset(widget.current); }
  }

  return <section ref={wrapper} className={styles.card} aria-labelledby={`${formId}-heading`}>
    <h2 id={`${formId}-heading`}>ご意見をお聞かせください</h2>
    <p>使っていて困ったことや、欲しい機能があれば教えてください。匿名で回答できます。</p>
    {!open && !done && <button type="button" onClick={() => { setOpen(true); analytics("feedback_open"); }}>意見を送る</button>}
    {open && <form onSubmit={submit} className={styles.form}>
      <p>今後の改善に向けた募集です。候補の開発・提供時期・価格は未定です。</p>
      <label>何に困っていますか？<select name="need" required defaultValue=""><option value="" disabled>選択してください</option>{needs.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      <label>どんな機能が欲しいですか？<select name="feature" required defaultValue="" onChange={event => { if (event.target.value) analytics("feedback_interest_click", { feature_id: event.target.value }); }}><option value="" disabled>選択してください</option>{features[config.context].map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      <label>関心に近いもの<select name="interest" required value={interest} onChange={event => setInterest(event.target.value)}><option value="" disabled>選択してください</option>{interests.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
      <label>もう少し詳しく（任意）<textarea name="detail" maxLength={500} rows={4} aria-describedby={`${formId}-warning`} /></label>
      <p id={`${formId}-warning`}>会社名、顧客名、製品名、測定値、機密情報、連絡先は記入しないでください。</p>
      <label>連絡を希望する場合のメールアドレス（任意）<input type="email" name="email" maxLength={254} autoComplete="email" /></label>
      <label className={styles.check}><input type="checkbox" name="consent" />改善や先行体験に関する連絡を受けることに同意します。</label>
      <p>回答は改善検討に、メールは希望された連絡に使用します。回答原文は180日、メールは90日を目安に削除します。詳細・削除依頼は<Link href="/privacy">プライバシーポリシー</Link>をご覧ください。</p>
      <label className={styles.trap} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div ref={challenge} />
      <button type="submit" disabled={busy || !token}>{busy ? "送信中…" : "送信する"}</button>
    </form>}
    <p role="status" aria-live="polite">{status}</p>
  </section>;
}
