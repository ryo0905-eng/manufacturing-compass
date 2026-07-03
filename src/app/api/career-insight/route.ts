import { NextResponse } from "next/server";

type InsightRequest = {
  answers?: Record<string, string>;
  buildName?: string;
  score?: number;
  modules?: Array<{ label: string; value: string; score: number }>;
  rewardGap?: { currentLabel: string; gapLabel: string; note: string };
  profile?: {
    shortLabel: string;
    salaryRangeCurrent: string;
    salaryRangePotential: string;
    reachableRoles: string[];
    growthLevers: string[];
    actionsToday: string[];
  };
  reachableCompanies?: string[];
};

function extractOutputText(data: unknown) {
  if (typeof data !== "object" || data === null) return "";
  const maybeText = (data as { output_text?: unknown }).output_text;

  if (typeof maybeText === "string") return maybeText;

  const output = (data as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";

  return output
    .flatMap((item) => {
      if (typeof item !== "object" || item === null) return [];
      const content = (item as { content?: unknown }).content;
      if (!Array.isArray(content)) return [];

      return content.map((contentItem) => {
        if (typeof contentItem !== "object" || contentItem === null) return "";
        const text = (contentItem as { text?: unknown }).text;
        return typeof text === "string" ? text : "";
      });
    })
    .filter(Boolean)
    .join("\n");
}

function parseInsights(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*\d.、\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as InsightRequest;
  const model = process.env.OPENAI_INSIGHT_MODEL ?? "gpt-5.4-mini";
  const prompt = [
    "あなたは半導体業界への転職に詳しいキャリア翻訳者です。",
    "ユーザーの製造業経験を、半導体業界の職種・企業・評価軸に照らして読み替えてください。",
    "煽らず、落ち込ませず、本人が気づいていない観点を3つだけ返してください。",
    "各行は45文字以内。箇条書き。年収は断定せず可能性として表現。",
    "",
    JSON.stringify(body),
  ].join("\n");

  let response: Response;

  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      body: JSON.stringify({
        input: prompt,
        max_output_tokens: 260,
        model,
        store: false,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return NextResponse.json(
      { error: "AI insight generation timed out." },
      { status: 504 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "AI insight generation failed." },
      { status: response.status },
    );
  }

  const data = await response.json();
  const insights = parseInsights(extractOutputText(data));

  return NextResponse.json({ insights });
}
