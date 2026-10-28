"use client";

import { useState } from "react";
import { trackCareerCompassEvent } from "@/lib/analytics";

const url = "https://mfg-compass.com/career-compass";
const encouragement = "これまでの経験から、次の可能性を探そう。";

function createCard(role: string): Blob {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.fillStyle = "#eef5f2";
  context.fillRect(0, 0, 1200, 630);
  context.strokeStyle = "#c8dcd3";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(1010, 130, 190, 0, Math.PI * 2);
  context.arc(1010, 130, 125, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#376a5c";
  context.font = "600 25px sans-serif";
  context.fillText("MANUFACTURING COMPASS / CAREER COMPASS", 80, 100);
  context.fillStyle = "#59756c";
  context.font = "28px sans-serif";
  context.fillText("経験と接点のある仕事", 80, 210);
  context.fillStyle = "#173d34";
  context.font = "bold 56px sans-serif";
  // Break by character so long Japanese role names remain within the card.
  const lines: string[] = [];
  let line = "";
  for (const character of role) {
    if (context.measureText(line + character).width > 990 && line) {
      lines.push(line);
      line = "";
    }
    line += character;
  }
  lines.push(line);
  lines.forEach((part, index) => context.fillText(part, 80, 290 + index * 75));
  context.font = "30px sans-serif";
  context.fillText(encouragement, 80, 480);
  context.fillStyle = "#59756c";
  context.font = "23px sans-serif";
  context.fillText("回答に基づく参考整理です。企業評価や選考結果ではありません。", 80, 555);
  context.fillText("mfg-compass.com/career-compass", 80, 595);
  const data = atob(canvas.toDataURL("image/png").split(",")[1]);
  return new Blob([Uint8Array.from(data, (character) => character.charCodeAt(0))], { type: "image/png" });
}

export function CareerShareCard({ role }: { role: string }) {
  const [status, setStatus] = useState("");
  const [showText, setShowText] = useState(false);
  const text = `私の経験と接点のある仕事は「${role}」。${encouragement}\n${url}`;

  function record(action: "image_save" | "image_share" | "text_copy", result: "success" | "unavailable") {
    try { trackCareerCompassEvent("career_compass_share", { action, result }); } catch { /* Sharing remains available without analytics. */ }
  }

  async function saveImage() {
    try {
      const blob = createCard(role);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "career-compass.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      setStatus("画像を保存しました。共有する前に内容を確認できます。");
      record("image_save", "success");
    } catch {
      setStatus("画像を作成できませんでした。文章をコピーして共有できます。");
      record("image_save", "unavailable");
    }
  }

  async function shareImage() {
    try {
      const blob = createCard(role);
      const file = new File([blob], "career-compass.png", { type: "image/png" });
      if (!navigator.share || !navigator.canShare?.({ files: [file] })) throw new Error("Sharing unavailable");
      await navigator.share({ files: [file], text: `${encouragement}\n${url}`, title: "Career Compass" });
      setStatus("共有画面を開きました。");
      record("image_share", "success");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setStatus("この端末では画像を直接共有できません。画像を保存するか文章をコピーしてください。");
      record("image_share", "unavailable");
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("文章とリンクをコピーしました。");
      record("text_copy", "success");
    } catch {
      setShowText(true);
      setStatus("下の文章を選択してコピーしてください。");
      record("text_copy", "unavailable");
    }
  }

  return (
    <section className="compass-share" aria-labelledby="compass-share-title">
      <div>
        <p className="compass-overline">SHARE YOUR POSSIBILITY</p>
        <h2 id="compass-share-title">見つけた可能性を、誰かと話そう。</h2>
        <p>共有する内容は、下のカードと案内リンクだけ。回答や年収は含まれません。</p>
      </div>
      <div className="compass-share-preview" aria-label="共有カードのプレビュー">
        <span>CAREER COMPASS</span>
        <small>経験と接点のある仕事</small>
        <strong>{role}</strong>
        <p>{encouragement}</p>
        <small>回答に基づく参考整理です。企業評価や選考結果ではありません。</small>
        <small>mfg-compass.com/career-compass</small>
      </div>
      <div className="compass-share-actions">
        <button type="button" className="button primary" onClick={shareImage}>画像を共有</button>
        <button type="button" className="button ghost" onClick={saveImage}>画像を保存</button>
        <button type="button" className="button ghost" onClick={copyText}>文章とリンクをコピー</button>
      </div>
      <p className="compass-share-status" role="status">{status}</p>
      {showText ? <label className="compass-share-fallback">共有する文章<textarea readOnly value={text} onFocus={(event) => event.currentTarget.select()} /></label> : null}
    </section>
  );
}
