import { createGateway, experimental_evaluate as evaluate } from "ai";
import { buildJevRequest, parseJevRequest, parseJevResponse, jevFailureStatus } from "@/lib/jev-demo";

export const runtime = "nodejs";
export const maxDuration = 30;
function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return reply({ error: "このページから実行してください。" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "JSON形式で指定してください。" }, 415);
  // Stream cap also covers chunked requests and forged Content-Length headers.
  let parsed: ReturnType<typeof parseJevRequest>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "サンプルを選択してください。" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 256) { await reader.cancel(); return reply({ error: "入力が大きすぎます。" }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    parsed = parseJevRequest(JSON.parse(new TextDecoder().decode(bytes)));
  } catch { return reply({ error: "サンプルの指定を確認してください。" }, 400); }
  if (!parsed) return reply({ error: "用意されたサンプルだけを実行できます。" }, 400);
  const key = process.env.AI_GATEWAY_API_KEY;
  if (process.env.JEV_DEMO_ENABLED !== "true" || !key) return reply({ error: "現在は接続準備中です。架空サンプルと確認項目をご覧いただけます。" }, 503);
  try {
    const started = performance.now();
    const input = buildJevRequest(parsed.sample.id, parsed.evidence?.id ?? null);
    const gateway = createGateway({ apiKey: key });
    const upstream = await evaluate({
      model: gateway.evaluationModel(input.model),
      state: input.state,
      questions: input.questions,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(12000),
      providerOptions: { gateway: { zeroDataRetention: true } },
    });
    const result = parseJevResponse(upstream);
    return reply({ ...result, sampleId: parsed.sample.id, evidenceId: parsed.evidence?.id ?? null, elapsedMs: Math.round(performance.now() - started), measuredAt: new Date().toISOString() });
  } catch (error) {
    const status = jevFailureStatus(error);
    if (status === 402) return reply({ error: "デモの予算または利用枠の上限に達したため、実行を停止しています。運営者による確認をお待ちください。" }, 402);
    if (status === 429) return reply({ error: "現在リクエストが集中しています。時間をおいてお試しください。" }, 429);
    return reply({ error: "Jevの応答を確認できませんでした。時間切れ、または接続・応答形式の問題の可能性があります。" }, 502);
  }
}
