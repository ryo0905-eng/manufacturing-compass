import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { feedbackConfigured, validateFeedback } from "@/lib/feedback";

export const dynamic = "force-dynamic";
const reply = (error: string, status: number) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!feedbackConfigured()) return reply("受付を準備中です。", 503);
  if (request.headers.get("origin") !== "https://mfg-compass.com" || !request.headers.get("content-type")?.startsWith("application/json")) return reply("送信できませんでした。", 403);
  if (Number(request.headers.get("content-length") || 0) > 8192) return reply("入力が長すぎます。", 413);
  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply("入力を確認してください。", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 8192) { await reader.cancel(); return reply("入力が長すぎます。", 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    raw = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply("入力を確認してください。", 400); }
  const payload = raw as Record<string, unknown> | null;
  const feedback = validateFeedback(payload?.feedback);
  if (!feedback || typeof payload?.token !== "string" || !payload.token || payload.token.length > 2048 || payload.honeypot !== "") return reply("入力を確認してください。", 400);
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (!ip || process.env.VERCEL !== "1") return reply("送信を確認できませんでした。", 503);
  try {
    const redisUrl = new URL(process.env.FEEDBACK_REDIS_URL!);
    const sinkUrl = new URL(process.env.FEEDBACK_SINK_URL!);
    if (redisUrl.protocol !== "https:" || !redisUrl.hostname.endsWith(".upstash.io") || sinkUrl.protocol !== "https:" || sinkUrl.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(sinkUrl.pathname) || process.env.FEEDBACK_SINK_SECRET!.length < 32 || process.env.FEEDBACK_RATE_SECRET!.length < 32) return reply("受付を準備中です。", 503);
    const digest = createHmac("sha256", process.env.FEEDBACK_RATE_SECRET!).update(ip).digest("hex");
    const redis = await fetch(redisUrl, { method: "POST", headers: { Authorization: `Bearer ${process.env.FEEDBACK_REDIS_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],3600) end; return n", "1", `feedback:${digest}`]), signal: AbortSignal.timeout(5000), cache: "no-store" });
    const limit = await redis.json();
    if (!redis.ok || !Number.isInteger(limit.result)) return reply("送信を確認できませんでした。", 503);
    if (limit.result > 10) return reply("時間をおいてからお試しください。", 429);
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: process.env.FEEDBACK_TURNSTILE_SECRET, response: payload.token, remoteip: ip }), signal: AbortSignal.timeout(5000), cache: "no-store" });
    const verdict = await verification.json();
    if (!verification.ok || verdict.success !== true || verdict.hostname !== "mfg-compass.com" || verdict.action !== "feedback") return reply("認証を確認できませんでした。もう一度お試しください。", 400);
    const saved = await fetch(sinkUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: process.env.FEEDBACK_SINK_SECRET, feedback }), signal: AbortSignal.timeout(15000), cache: "no-store" });
    const result = await saved.json();
    if (!saved.ok || result.ok !== true || result.id !== feedback.id) return reply("送信できませんでした。もう一度お試しください。", 503);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return reply("送信できませんでした。もう一度お試しください。", 503); }
}
