"use client";

import Link from "next/link";
import type { Route } from "next";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  achievementOptions,
  analysisOptions,
  backgroundOptions,
  currentSalaryOptions,
  englishOptions,
  experienceOptions,
  exposureOptions,
  goalOptions,
  impactOptions,
  learningOptions,
  marketValueProfiles,
  scopeOptions,
  type CompassOption,
} from "@/data/career-compass";
import { affiliatePartners, companies } from "@/data/companies";

type AnswerKey =
  | "background"
  | "exposure"
  | "experience"
  | "achievement"
  | "impact"
  | "scope"
  | "analysis"
  | "english"
  | "learning"
  | "currentSalary"
  | "goal";
type Answers = Partial<Record<AnswerKey, string>>;
type InsightState =
  | { status: "idle"; items: string[]; message?: string }
  | { status: "loading"; items: string[]; message?: string }
  | { status: "ready"; items: string[]; message?: string }
  | { status: "error"; items: string[]; message: string };

type QuestionStep = {
  key: AnswerKey;
  label: string;
  question: string;
  options: CompassOption[];
};

const questionSteps: QuestionStep[] = [
  {
    key: "background",
    label: "経験",
    question: "経験は？",
    options: backgroundOptions,
  },
  {
    key: "exposure",
    label: "接点",
    question: "半導体接点は？",
    options: exposureOptions,
  },
  {
    key: "experience",
    label: "年数",
    question: "年数は？",
    options: experienceOptions,
  },
  {
    key: "achievement",
    label: "実績",
    question: "一番強い実績は？",
    options: achievementOptions,
  },
  {
    key: "impact",
    label: "数字",
    question: "成果は数字で語れる？",
    options: impactOptions,
  },
  {
    key: "scope",
    label: "範囲",
    question: "巻き込んだ範囲は？",
    options: scopeOptions,
  },
  {
    key: "analysis",
    label: "武器",
    question: "データ武器は？",
    options: analysisOptions,
  },
  {
    key: "english",
    label: "英語",
    question: "英語は？",
    options: englishOptions,
  },
  {
    key: "learning",
    label: "積上げ",
    question: "週に積める時間は？",
    options: learningOptions,
  },
  {
    key: "currentSalary",
    label: "年収",
    question: "今の年収は？",
    options: currentSalaryOptions,
  },
  {
    key: "goal",
    label: "狙い",
    question: "狙いは？",
    options: goalOptions,
  },
];

const experienceBonus: Record<string, number> = {
  early: -4,
  middle: 4,
  senior: 9,
};

const exposureBonus: Record<string, number> = {
  none: -6,
  supplier: 2,
  equipment: 5,
  fab: 8,
};

const achievementBonus: Record<string, number> = {
  routine: -3,
  improvement: 5,
  launch: 7,
  lead: 8,
};

const analysisBonus: Record<string, number> = {
  none: -4,
  qc: 3,
  stats: 6,
  data: 7,
};

const impactBonus: Record<string, number> = {
  none: -5,
  story: 1,
  number: 6,
  money: 8,
};

const scopeBonus: Record<string, number> = {
  solo: -2,
  team: 2,
  cross: 5,
  customer: 6,
};

const englishBonus: Record<string, number> = {
  low: -3,
  middle: 3,
  high: 8,
};

const goalBonus: Record<string, number> = {
  entry: 0,
  global: 5,
  specialist: 3,
  income: 4,
};

const learningBonus: Record<string, number> = {
  zero: -3,
  one: 1,
  three: 4,
  daily: 7,
};

const currentSalaryMidpoint: Record<string, number | null> = {
  skip: null,
  under400: 350,
  "400-500": 450,
  "500-600": 550,
  "600-700": 650,
  "700-800": 750,
  over800: 850,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function optionLabel(options: CompassOption[], id: string | undefined) {
  return options.find((option) => option.id === id)?.label ?? "";
}

function parseSalaryRange(range: string) {
  const [low = 0, high = 0] = [...range.matchAll(/\d+/g)].map((match) => Number(match[0]));

  return { high, low };
}

function formatRewardGap(currentSalaryId: string | undefined, marketRange: string) {
  const current = currentSalaryMidpoint[currentSalaryId ?? "skip"];

  if (!current) {
    return { currentLabel: "未入力", gapLabel: "表示なし", note: "年収を入れると差分が見えます" };
  }

  const market = parseSalaryRange(marketRange);
  const lowGap = market.low - current;
  const highGap = market.high - current;
  const currentLabel = `${current}万円`;

  if (highGap <= 0) {
    return { currentLabel, gapLabel: "現年収も強い", note: "専門性や外資ルートで上振れを狙えます" };
  }

  if (lowGap <= 0) {
    return { currentLabel, gapLabel: `〜+${highGap}万円`, note: "半導体向けに実績を翻訳すると上振れ余地があります" };
  }

  return { currentLabel, gapLabel: `+${lowGap}〜${highGap}万円`, note: "経験の見せ方で評価レンジが変わる可能性があります" };
}

export function CareerCompassTool() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "saved">("idle");
  const [insightState, setInsightState] = useState<InsightState>({ items: [], status: "idle" });
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResult = step >= questionSteps.length;
  const currentStep = questionSteps[Math.min(step, questionSteps.length - 1)];
  const currentValue = answers[currentStep.key];
  const partner = affiliatePartners.find((item) => item.isActive);

  const result = useMemo(() => {
    const background = answers.background ?? "beginner";
    const exposure = answers.exposure ?? "none";
    const experience = answers.experience ?? "middle";
    const english = answers.english ?? "middle";
    const achievement = answers.achievement ?? "routine";
    const impact = answers.impact ?? "none";
    const scope = answers.scope ?? "solo";
    const analysis = answers.analysis ?? "none";
    const learning = answers.learning ?? "zero";
    const goal = answers.goal ?? "entry";
    const currentSalary = answers.currentSalary ?? "skip";
    const profile = marketValueProfiles[background] ?? marketValueProfiles.beginner;
    const routeScore = clamp(profile.baseScore + (exposureBonus[exposure] ?? 0), 35, 96);
    const evidenceScore = clamp(
      50 +
        (experienceBonus[experience] ?? 0) +
        (achievementBonus[achievement] ?? 0) +
        (impactBonus[impact] ?? 0) +
        (scopeBonus[scope] ?? 0),
      35,
      96,
    );
    const skillScore = clamp(
      48 + (analysisBonus[analysis] ?? 0) + (englishBonus[english] ?? 0) + (learningBonus[learning] ?? 0),
      35,
      96,
    );
    const targetScore = clamp(54 + (goalBonus[goal] ?? 0) + (exposureBonus[exposure] ?? 0) + (learningBonus[learning] ?? 0), 35, 96);
    const score = clamp(
      Math.round(routeScore * 0.36 + evidenceScore * 0.28 + skillScore * 0.22 + targetScore * 0.14),
      35,
      92,
    );
    const band = score >= 80 ? "High" : score >= 65 ? "Growth" : "Start";
    const modules = [
      { label: "Route", value: profile.reachableRoles[0], score: routeScore },
      { label: "Proof", value: optionLabel(impactOptions, impact), score: evidenceScore },
      { label: "Skill", value: optionLabel(analysisOptions, analysis), score: skillScore },
      { label: "Aim", value: optionLabel(goalOptions, goal), score: targetScore },
    ];
    const buildName = `${profile.shortLabel} / ${optionLabel(achievementOptions, achievement) || "探索"}ビルド`;
    const resumeSignal =
      impact === "none"
        ? "まず改善前後の数字を1つ作る"
        : `${optionLabel(impactOptions, impact)}: ${profile.resumeSignals.slice(0, 3).join("・")}`;
    const roadmap = [
      { label: "30d", value: profile.roadmap30Days[0] },
      { label: "90d", value: profile.roadmap90Days },
      { label: "180d", value: profile.roadmap6Months },
      { label: "1y", value: `${profile.growthLevers[0]}を実績化し、ストレッチ企業の応募軸を作る` },
    ];
    const rewardGap = formatRewardGap(currentSalary, profile.salaryRangeCurrent);
    const powerQuests = [
      { id: "proof", label: impact === "none" ? "成果を1つ数字にする" : profile.actionsToday[0], xp: 2 },
      { id: "skill", label: analysis === "none" ? "半導体用語を10個覚える" : profile.roadmap30Days[0], xp: 2 },
      { id: "route", label: "求人を3件だけ読む", xp: 1 },
    ];

    return { band, buildName, modules, powerQuests, profile, resumeSignal, rewardGap, roadmap, score };
  }, [answers]);

  const questBoost = result.powerQuests
    .filter((quest) => completedQuestIds.includes(quest.id))
    .reduce((sum, quest) => sum + quest.xp, 0);
  const displayedScore = clamp(result.score + questBoost, 35, 99);
  const reachableCompanies = companies.filter((company) =>
    result.profile.reachableCompanyIds.includes(company.id),
  );
  const stretchCompanies = companies.filter((company) =>
    result.profile.stretchCompanyIds.includes(company.id),
  );
  const routeLadder = [
    {
      companies: reachableCompanies.slice(0, 2),
      label: "Now",
      note: result.profile.reachableRoles[0],
      title: "今狙う",
    },
    {
      companies: stretchCompanies.slice(0, 2),
      label: "6M",
      note: result.profile.roadmap6Months,
      title: "半年後",
    },
    {
      companies: stretchCompanies.slice(1, 3).length > 0 ? stretchCompanies.slice(1, 3) : stretchCompanies.slice(0, 2),
      label: "1Y",
      note: `${result.profile.growthLevers[0]}を武器にする`,
      title: "1年後",
    },
  ];

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  function chooseAnswer(key: AnswerKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));

    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }

    nextTimerRef.current = setTimeout(() => {
      setStep((current) => Math.min(questionSteps.length, current + 1));
    }, 180);
  }

  async function generateInsights() {
    setInsightState({ items: [], status: "loading" });

    try {
      const response = await fetch("/api/career-insight", {
        body: JSON.stringify({
          answers,
          buildName: result.buildName,
          modules: result.modules,
          profile: {
            actionsToday: result.profile.actionsToday,
            growthLevers: result.profile.growthLevers,
            resumeSignals: result.profile.resumeSignals,
            reachableRoles: result.profile.reachableRoles,
            roadmap90Days: result.profile.roadmap90Days,
            roadmap6Months: result.profile.roadmap6Months,
            salaryRangeCurrent: result.profile.salaryRangeCurrent,
            salaryRangePotential: result.profile.salaryRangePotential,
            shortLabel: result.profile.shortLabel,
          },
          reachableCompanies: reachableCompanies.slice(0, 3).map((company) => company.nameJa),
          rewardGap: result.rewardGap,
          score: displayedScore,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        setInsightState({
          items: [],
          message: response.status === 503 ? "OPENAI_API_KEY を設定すると使えます。" : "AI Insight の生成に失敗しました。",
          status: "error",
        });
        return;
      }

      const data = (await response.json()) as { insights?: string[] };
      const insights = data.insights?.filter(Boolean) ?? [];

      setInsightState({
        items: insights.length > 0 ? insights : ["半導体向けに実績を翻訳すると、見え方が変わります。"],
        status: "ready",
      });
    } catch {
      setInsightState({
        items: [],
        message: "AI Insight に接続できませんでした。",
        status: "error",
      });
    }
  }

  function toggleQuest(id: string) {
    setCompletedQuestIds((current) =>
      current.includes(id) ? current.filter((questId) => questId !== id) : [...current, id],
    );
  }

  function submitEmailCapture(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setEmailStatus("saved");
  }

  function goNext() {
    if (!currentValue) return;
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }

    setStep((current) => current + 1);
  }

  function goBack() {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }

    setStep((current) => Math.max(0, current - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setCompletedQuestIds([]);
    setInsightState({ items: [], status: "idle" });
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }
  }

  if (isResult) {
    return (
      <div className="quiz-result-shell">
        <section className="quiz-result-card">
          <div className="quiz-result-score">
            <span>Career Power</span>
            <strong>{displayedScore}</strong>
            <small>{questBoost > 0 ? `+${questBoost} today` : result.band}</small>
          </div>

          <div className="quiz-result-main">
            <p className="eyebrow">Status unlocked</p>
            <h1>{result.buildName}</h1>
          </div>

          <div className="score-modules">
            {result.modules.map((module) => (
              <div key={module.label}>
                <span>{module.label}</span>
                <b>{module.value}</b>
                <i aria-hidden="true">
                  <em style={{ width: `${module.score}%` }} />
                </i>
              </div>
            ))}
          </div>

          <div className="quiz-result-grid">
            <div>
              <span>Current Reward</span>
              <strong>{result.rewardGap.currentLabel}</strong>
            </div>
            <div>
              <span>Market Reward</span>
              <strong>{result.profile.salaryRangeCurrent}</strong>
            </div>
            <div>
              <span>Reward Gap</span>
              <strong>{result.rewardGap.gapLabel}</strong>
            </div>
            <div>
              <span>Next Reward</span>
              <strong>{result.profile.salaryRangePotential}</strong>
            </div>
          </div>

          <div className="reward-gap-note">
            <span>Unlock Potential</span>
            <b>{result.rewardGap.note}</b>
          </div>

          <div className="resume-signal-card">
            <span>Resume Signal</span>
            <b>{result.resumeSignal}</b>
          </div>

          <div className="ai-insight-card">
            <div>
              <span>AI Insight</span>
              <b>半導体向けに、経験の見え方を読み替える</b>
            </div>
            <button
              className="button ghost"
              disabled={insightState.status === "loading"}
              onClick={generateInsights}
              type="button"
            >
              {insightState.status === "loading" ? "生成中" : "AIで深掘り"}
            </button>
            {insightState.message ? <small>{insightState.message}</small> : null}
            {insightState.items.length > 0 ? (
              <ul>
                {insightState.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="quiz-result-list">
            <div>
              <span>Available Routes</span>
              {reachableCompanies.slice(0, 2).map((company) => (
                <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                  {company.nameJa}
                </Link>
              ))}
            </div>
            <div>
              <span>Skill Tree</span>
              {result.profile.growthLevers.slice(0, 3).map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
            <div>
              <span>Today Quest</span>
              <b>{result.profile.actionsToday[0]}</b>
            </div>
          </div>

          <div className="company-route-ladder">
            <span>Target Route</span>
            {routeLadder.map((route) => (
              <div key={route.label}>
                <small>{route.label}</small>
                <b>{route.title}</b>
                {route.companies.map((company) => (
                  <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                    {company.nameJa}
                  </Link>
                ))}
                <em>{route.note}</em>
              </div>
            ))}
          </div>

          <div className="quest-roadmap">
            <span>Build Plan</span>
            {result.roadmap.map((item) => (
              <b key={item.label}>
                <small>{item.label}</small>
                {item.value}
              </b>
            ))}
          </div>

          <div className="power-up-quests">
            <span>Power Up</span>
            {result.powerQuests.map((quest) => {
              const isDone = completedQuestIds.includes(quest.id);

              return (
                <button
                  className={isDone ? "power-quest done" : "power-quest"}
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id)}
                  type="button"
                >
                  <b>{quest.label}</b>
                  <small>{isDone ? "DONE" : `+${quest.xp}`}</small>
                </button>
              );
            })}
          </div>

          <form className="result-capture-card" onSubmit={submitEmailCapture}>
            <div>
              <span>Save Route</span>
              <b>診断結果とToday Questを受け取る</b>
              <small>保存・完了履歴機能の先行案内です。現時点では外部送信は行いません。</small>
            </div>
            <label>
              <span>メール</span>
              <input
                inputMode="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailStatus("idle");
                }}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </label>
            <button className="button primary" type="submit">
              {emailStatus === "saved" ? "登録候補に追加" : "先行案内を受け取る"}
            </button>
            {emailStatus === "saved" ? <small>次は、相談メモを見ながら応募軸を整理できます。</small> : null}
          </form>

          <div className="conversion-brief-card">
            <span>Consult Brief</span>
            <b>相談で話すこと</b>
            <ul>
              <li>{result.profile.agentTalkTrack}</li>
              <li>現年収と市場レンジの差分: {result.rewardGap.gapLabel}</li>
              <li>今日のQuest: {result.profile.actionsToday[0]}</li>
            </ul>
          </div>

          <div className="quiz-result-actions">
            <a className="button primary" href={partner?.url ?? "#"}>
              相談ルートを見る
            </a>
            <button className="button ghost" onClick={restart} type="button">
              もう一度探索
            </button>
            <small>{partner?.disclosureText ?? "本ページには広告リンクが含まれる場合があります。"}</small>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="quiz-shell">
      <section className="quiz-card">
        <div className="quiz-progress">
          <span>
            Q {String(step + 1).padStart(2, "0")} / {questionSteps.length}
          </span>
          <b>{currentStep.label}</b>
          <div aria-hidden="true">
            <i style={{ width: `${((step + 1) / questionSteps.length) * 100}%` }} />
          </div>
        </div>

        <div className="quiz-question-head">
          <p className="eyebrow">Career Quest</p>
          <h1>{currentStep.question}</h1>
          <small>直感で選ぶだけ。自動で次へ進みます。</small>
        </div>

        <div className="quiz-options" aria-label={currentStep.label}>
          {currentStep.options.map((option, index) => (
            <button
              className={currentValue === option.id ? "quiz-option active" : "quiz-option"}
              key={option.id}
              onClick={() => chooseAnswer(currentStep.key, option.id)}
              type="button"
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            className="button ghost"
            disabled={step === 0}
            onClick={goBack}
            type="button"
          >
            戻る
          </button>
          <button className="button primary compact-next" disabled={!currentValue} onClick={goNext} type="button">
            {step === questionSteps.length - 1 ? "結果" : "次へ"}
          </button>
        </div>
      </section>

      <aside className="quiz-side" aria-hidden="true">
        <div className="quest-map">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span>MC</span>
        <strong>Career Quest</strong>
        <small>Semiconductor route finder</small>
      </aside>
    </div>
  );
}
