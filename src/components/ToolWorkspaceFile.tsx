"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { parseWorkspace, serializeWorkspace, workspaceFilename, workspaceMaxBytes, WorkspaceError, type WorkspaceInputs, type WorkspaceTool } from "@/lib/tool-workspace";
import styles from "./ToolWorkspaceFile.module.css";

export function ToolWorkspaceFile<T extends WorkspaceTool>({ tool, locale, input, onRestore, disabled = false }: {
  tool: T; locale: "ja" | "en"; input: WorkspaceInputs[T]; onRestore: (input: WorkspaceInputs[T]) => void; disabled?: boolean;
}) {
  const en = locale === "en";
  const [pending, setPending] = useState<WorkspaceInputs[T] | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const reading = useRef(false);
  const mounted = useRef(true);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  function record(action: "save" | "load", outcome: "download_started" | "restored" | "error") {
    try { trackEvent("tool_workspace_file", { tool_id: tool, locale, action, outcome }); } catch { /* Local work must remain available. */ }
  }
  function fail(cause: unknown, action: "save" | "load") {
    const messages = {
      size: en ? "Files must be 2 MiB or smaller." : "ファイルは2 MiB以内にしてください。",
      json: en ? "This file is not valid JSON." : "JSON形式を読み取れません。保存ファイルを確認してください。",
      format: en ? "This is not a Manufacturing Compass workspace file." : "Manufacturing Compassの保存ファイルではありません。",
      version: en ? "This file version is not supported." : "このバージョンの保存ファイルには対応していません。",
      tool: en ? "Open this file in the tool that saved it." : "別のツールの保存ファイルです。保存元のツールで開いてください。",
      input: en ? "Required input fields are missing or have invalid types." : "必要な入力項目が不足しているか、形式が正しくありません。",
    };
    setError(true);
    setStatus(cause instanceof WorkspaceError ? messages[cause.code] : en ? "The file operation failed. Please try again." : "ファイル操作に失敗しました。もう一度お試しください。");
    record(action, "error");
  }
  function save() {
    if (disabled || reading.current || pending) return;
    setError(false); setStatus("");
    try {
      const text = serializeWorkspace(tool, input);
      const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
      const link = document.createElement("a");
      try {
        link.href = url; link.download = workspaceFilename(tool);
        document.body.appendChild(link); link.click();
      } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
      setStatus(en ? "Download started. Keep the file to resume later." : "ダウンロードを開始しました。次回の再開用に保管してください。");
      record("save", "download_started");
    } catch (cause) { fail(cause, "save"); }
  }
  async function read(file: File) {
    if (disabled || reading.current) return;
    reading.current = true; setBusy(true); setPending(null); setStatus(""); setError(false);
    try {
      if (file.size > workspaceMaxBytes) throw new WorkspaceError("size");
      const text = await file.text();
      if (!mounted.current) return;
      setPending(parseWorkspace(text, tool));
    } catch (cause) { if (mounted.current) fail(cause, "load"); }
    finally { reading.current = false; if (mounted.current) setBusy(false); }
  }
  return <section className={styles.workspace} aria-label={en ? "Save and resume inputs" : "入力の保存と再開"}>
    <div className={styles.actions}>
      <button type="button" disabled={disabled || busy || !!pending} onClick={save}>{en ? "Save inputs" : "入力を保存"}</button>
      <button type="button" disabled={disabled || busy || !!pending} onClick={() => picker.current?.click()}>{en ? "Load saved file" : "保存ファイルを読み込む"}</button>
      <input ref={picker} hidden type="file" accept=".json,application/json" onChange={event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file) void read(file); }} />
    </div>
    <p>{en ? "The file contains your input data. It is not sent to a server. Results are not saved. Maximum file size: 2 MiB." : "このファイルには入力データが含まれます。サーバーには送信しません。計算結果は保存しません。上限2 MiB。"}</p>
    {busy && <p role="status">{en ? "Reading file…" : "ファイルを読み込んでいます…"}</p>}
    {pending && <div className={styles.confirmation} role="group" aria-label={en ? "Confirm replacement" : "入力の置き換え確認"}>
      {tool === "improvement-report" && <p>報告欄も置き換えます。工程比較の保存ファイルでは報告欄は空になります。</p>}
      <p role="status">{en ? "Replace the current inputs? The current result will be cleared." : "現在の入力を置き換えますか？ 表示中の結果は消去されます。"}</p>
      <div className={styles.actions}>
        <button type="button" disabled={disabled} onClick={() => {
          if (disabled) return;
          onRestore(pending); setPending(null); setError(false);
          setStatus(en ? "Inputs restored. Calculate again to see the result." : "入力を復元しました。再計算してください。");
          record("load", "restored");
        }}>{en ? "Replace current inputs" : "現在の入力を置き換える"}</button>
        <button type="button" onClick={() => { setPending(null); setError(false); setStatus(en ? "Cancelled. Current inputs are unchanged." : "キャンセルしました。現在の入力は変更していません。"); }}>{en ? "Cancel" : "キャンセル"}</button>
      </div>
    </div>}
    <p role={error ? "alert" : "status"}>{status}</p>
  </section>;
}
