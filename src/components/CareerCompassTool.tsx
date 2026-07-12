"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CareerCompassResult } from "@/components/career-compass/CareerCompassResult";
import { trackEvent } from "@/lib/analytics";
import {
  achievementOptions,
  backgroundOptions,
  currentSalaryOptions,
  englishOptions,
  experienceOptions,
  exposureOptions,
  goalOptions,
  impactOptions,
  marketValueProfiles,
  scopeOptions,
  skillOptionsByBackground,
  specialtyOptionsByBackground,
  workStyleOptions,
  type CompassOption,
} from "@/data/career-compass";
import { companies } from "@/data/companies";
import type { AgentFocus } from "@/data/affiliateLinks";

type AnswerKey =
  | "background"
  | "specialty"
  | "exposure"
  | "experience"
  | "achievement"
  | "impact"
  | "scope"
  | "analysis"
  | "english"
  | "goal"
  | "workStyle"
  | "currentSalary";
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

function getQuestionSteps(backgroundId: string | undefined): QuestionStep[] {
  const background = backgroundId ?? "beginner";

  return [
    { key: "background", label: "現在地", question: "現在の仕事で、最も近い領域は？", options: backgroundOptions },
    { key: "specialty", label: "担当業務", question: "実際に担当している仕事は？", options: specialtyOptionsByBackground[background] ?? specialtyOptionsByBackground.beginner },
    { key: "exposure", label: "半導体接点", question: "半導体の製品・工場・装置に、どの深さで関わった？", options: exposureOptions },
    { key: "experience", label: "経験期間", question: "その仕事を主担当として経験した期間は？", options: experienceOptions },
    { key: "achievement", label: "成果", question: "直近で、最も説明しやすい成果は？", options: achievementOptions },
    { key: "impact", label: "証拠", question: "その成果を、どこまで証拠付きで説明できる？", options: impactOptions },
    { key: "scope", label: "役割", question: "その成果で、どの範囲を担当した？", options: scopeOptions },
    { key: "analysis", label: "専門スキル", question: "仕事で使える専門スキルは？", options: skillOptionsByBackground[background] ?? skillOptionsByBackground.beginner },
    { key: "english", label: "英語", question: "英語を仕事でどこまで使える？", options: englishOptions },
    { key: "goal", label: "転職目的", question: "次の転職で、最も優先したいことは？", options: goalOptions },
    { key: "workStyle", label: "働き方", question: "働き方で、最も優先したい条件は？", options: workStyleOptions },
    { key: "currentSalary", label: "現在年収", question: "現在の年収帯は？", options: currentSalaryOptions },
  ];
}

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
  improvement: 7,
  launch: 7,
  lead: 7,
};

const analysisBonus: Record<string, number> = {
  none: -4,
  basic: 5,
  applied: 11,
  advanced: 16,
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
  customer: 5,
};

const englishBonus: Record<string, number> = {
  low: -3,
  middle: 3,
  high: 8,
};

const currentSalaryRanges: Record<string, { high: number | null; low: number | null }> = {
  skip: { high: null, low: null },
  under400: { high: 400, low: null },
  "400-500": { high: 500, low: 400 },
  "500-600": { high: 600, low: 500 },
  "600-700": { high: 700, low: 600 },
  "700-800": { high: 800, low: 700 },
  over800: { high: null, low: 800 },
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
  const salaryId = currentSalaryId ?? "skip";
  const current = currentSalaryRanges[salaryId];
  const currentLabel = optionLabel(currentSalaryOptions, salaryId) || "未入力";

  if (!current || current.low === null || current.high === null) {
    if (salaryId === "under400") {
      return { currentLabel, gapLabel: "上振れ余地あり", note: "現在年収がレンジ形式のため、差額は参考表示です" };
    }
    if (salaryId === "over800") {
      return { currentLabel, gapLabel: "条件により変動", note: "現年収の維持を含め、職種と条件を個別に確認する必要があります" };
    }
    return { currentLabel: "未入力", gapLabel: "表示なし", note: "年収を入れると差分が見えます" };
  }

  const market = parseSalaryRange(marketRange);
  const lowGap = market.low - current.high;
  const highGap = market.high - current.low;

  if (highGap <= 0) {
    return { currentLabel, gapLabel: "現年収水準が上回る", note: "年収維持を優先する場合は、求人条件を個別に確認してください" };
  }

  if (lowGap <= 0) {
    return { currentLabel, gapLabel: `重なる〜最大+${highGap}万円`, note: "現在年収帯と参考レンジには重なりがあります" };
  }

  return { currentLabel, gapLabel: `+${lowGap}〜${highGap}万円`, note: "レンジ同士の比較であり、実際の提示額を保証するものではありません" };
}

function subscribeToHydration() {
  return () => undefined;
}

export function CareerCompassTool() {
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [insightState, setInsightState] = useState<InsightState>({ items: [], status: "idle" });
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedStartRef = useRef(false);
  const questionSteps = useMemo(() => getQuestionSteps(answers.background), [answers.background]);
  const isResult = step >= questionSteps.length;
  const currentStep = questionSteps[Math.min(step, questionSteps.length - 1)];
  const currentValue = answers[currentStep.key];

  const result = useMemo(() => {
    const background = answers.background ?? "beginner";
    const specialtyId = answers.specialty;
    const exposure = answers.exposure ?? "none";
    const experience = answers.experience ?? "middle";
    const english = answers.english ?? "middle";
    const achievement = answers.achievement ?? "routine";
    const impact = answers.impact ?? "none";
    const scope = answers.scope ?? "solo";
    const analysis = answers.analysis ?? "none";
    const goal = answers.goal ?? "entry";
    const workStyle = answers.workStyle ?? "flexible";
    const currentSalary = answers.currentSalary ?? "skip";
    const baseProfile = marketValueProfiles[background] ?? marketValueProfiles.beginner;
    const specialtyOptions = specialtyOptionsByBackground[background] ?? specialtyOptionsByBackground.beginner;
    const specialty = specialtyOptions.find((option) => option.id === specialtyId) ?? specialtyOptions[0];
    const skillOptions = skillOptionsByBackground[background] ?? skillOptionsByBackground.beginner;
    const targetRole = specialty?.targetRole ?? baseProfile.reachableRoles[0];
    const routeScore = clamp(baseProfile.baseScore + (exposureBonus[exposure] ?? 0) + (specialty ? 4 : 0), 35, 96);
    const evidenceScore = clamp(
      50 +
        (experienceBonus[experience] ?? 0) +
        (achievementBonus[achievement] ?? 0) +
        (impactBonus[impact] ?? 0) +
        (scopeBonus[scope] ?? 0),
      35,
      96,
    );
    const skillScore = clamp(52 + (analysisBonus[analysis] ?? 0) + (englishBonus[english] ?? 0), 35, 96);
    const targetScore = clamp(
      goal === "global"
        ? english === "high" ? 82 : english === "middle" ? 66 : 50
        : goal === "specialist"
          ? analysis === "advanced" ? 82 : analysis === "applied" ? 74 : analysis === "basic" ? 64 : 50
          : goal === "income"
            ? impact === "money" ? 82 : impact === "number" ? 76 : impact === "story" ? 62 : 50
            : exposure === "none" ? 58 : 72,
      35,
      96,
    );
    const score = clamp(
      Math.round(routeScore * 0.3 + evidenceScore * 0.35 + skillScore * 0.25 + targetScore * 0.1),
      35,
      92,
    );
    const band = score >= 74 ? "High" : score >= 58 ? "Growth" : "Start";
    const achievementStrength: Record<string, string> = {
      routine: "日常業務を安定して運用する力",
      improvement: "改善を実際の成果へつなげた経験",
      launch: "導入・移管・量産化を前へ進めた経験",
      lead: "周囲を動かし、改善を定着させた経験",
    };
    const impactStrength: Record<string, string> = {
      none: "",
      story: "成果の背景と行動を具体的に説明する力",
      number: "成果を率・件数・時間で示せること",
      money: "成果を原価・損失の改善として示せること",
    };
    const scopeStrength: Record<string, string> = {
      solo: "自分の担当範囲を着実に完遂する力",
      team: "チームで改善を進める力",
      cross: "部門をまたいで関係者を動かす力",
      customer: "顧客や社外関係者と技術課題を解決する力",
    };
    const unique = (items: Array<string | undefined>) => [...new Set(items.filter((item): item is string => Boolean(item)))];
    const strengths = unique([
      specialty?.strength,
      impactStrength[impact],
      scopeStrength[scope],
      achievementStrength[achievement],
      ...baseProfile.strengths,
    ]).slice(0, 3);
    const answerBasedBottlenecks = [
      impact === "none" ? "成果の背景・行動・結果がまだ整理されていない" : undefined,
      impact === "story" ? "成果を改善前後の数字で補強できていない" : undefined,
      exposure === "none" ? "現在の経験と半導体工程・装置との接点がまだ言語化できていない" : undefined,
      analysis === "none" ? "狙う職種で使う専門スキルを1つ選んで補強する必要がある" : undefined,
      goal === "global" && english === "low" ? "外資系を狙うには、英語で実績を説明する準備が必要" : undefined,
      workStyle === "limited-travel" && targetRole === "フィールドエンジニア" ? "フィールド職は出張条件を求人ごとに確認する必要がある" : undefined,
      workStyle === "daytime" && baseProfile.primarySegmentIds.some((segment) => segment === "foundry" || segment === "memory")
        ? "工場系職種は交替勤務の有無を求人ごとに確認する必要がある"
        : undefined,
      workStyle === "location" ? "勤務地を優先する場合、対象企業と職種の選択肢が地域によって変わる" : undefined,
    ];
    const bottlenecks = unique([...answerBasedBottlenecks, ...baseProfile.bottlenecks]).slice(0, 3);
    const todayQuest = impact === "none"
      ? `${specialty?.label ?? "担当業務"}の実績を1つ選び、課題・行動・結果の3行で書く`
      : impact === "story"
        ? `${specialty?.label ?? "担当業務"}の実績に、改善前後の率・件数・時間を1つ加える`
        : exposure === "none"
          ? `${targetRole}の求人を3件読み、今の経験と共通する言葉を3つ書き出す`
          : analysis === "none"
            ? `${targetRole}の求人で頻出する専門スキルを1つ選び、学ぶ順番を決める`
            : goal === "global" && english === "low"
              ? `${specialty?.label ?? "担当業務"}の実績を、英語で3文にする`
              : baseProfile.todayQuest;
    const goalLabel = optionLabel(goalOptions, goal);
    const workStyleLabel = optionLabel(workStyleOptions, workStyle);
    const agentFocus: AgentFocus = goal === "global"
      ? "global"
      : goal === "specialist" || goal === "income"
        ? "specialist"
        : "career-translation";
    const goalRoadmap: Record<string, { sixMonths: string; threeMonths: string }> = {
      entry: { threeMonths: `${targetRole}向けに実績を3件整理する`, sixMonths: `${targetRole}の応募要件に沿った経験を作る` },
      global: { threeMonths: `${targetRole}の実績を英語で説明できる形にする`, sixMonths: "英語を使う求人と国内求人を比較し、応募軸を決める" },
      specialist: { threeMonths: `${optionLabel(skillOptions, analysis)}を実務事例として説明できる形にする`, sixMonths: `${targetRole}で評価される専門テーマを1つ実績化する` },
      income: { threeMonths: "改善実績を数字と効果額で比較できる形にする", sixMonths: "年収条件と仕事内容を両立できる応募軸を作る" },
    };
    const selectedRoadmap = goalRoadmap[goal] ?? goalRoadmap.entry;
    const consultQuestions = unique([
      `${specialty?.label ?? "現在の経験"}を${targetRole}へどう翻訳すると伝わるか`,
      `${goalLabel}ために、今の経験で不足している準備は何か`,
      workStyle !== "flexible" ? `${workStyleLabel}条件で現実的に狙える職種と企業はどこか` : undefined,
      ...baseProfile.consultQuestions,
    ]).slice(0, 3);
    const profile = {
      ...baseProfile,
      title: `${specialty?.label ?? baseProfile.shortLabel}の経験を${targetRole}へ翻訳するタイプ`,
      summary: `${specialty?.label ?? "現在"}の経験は、半導体業界では${targetRole}の文脈で整理できます。`,
      narrative: specialty
        ? `${specialty.strength}は、半導体業界の${targetRole}でも評価される経験です。${baseProfile.narrative}`
        : baseProfile.narrative,
      reachableRoles: unique([targetRole, ...baseProfile.reachableRoles]),
      strengths,
      bottlenecks,
      marketValueReasons: unique([
        specialty ? `${specialty.label}の経験を、${specialty.translation}として説明できます。` : undefined,
        impact === "number" || impact === "money" ? "成果を数字で説明できるため、実績の再現性を伝えやすいです。" : undefined,
        scope === "cross" || scope === "customer" ? "関係者を巻き込んだ経験は、技術だけでなく推進力の証拠になります。" : undefined,
        ...baseProfile.marketValueReasons,
      ]).slice(0, 3),
      hiddenAssets: strengths,
      semiconductorTranslation: unique([
        specialty ? `${specialty.label} → ${specialty.translation}` : undefined,
        ...baseProfile.semiconductorTranslation,
      ]).slice(0, 3),
      immediateRoutes: unique([`${targetRole}への近接ルート`, ...baseProfile.immediateRoutes]),
      actionsToday: unique([todayQuest, ...baseProfile.actionsToday]),
      roadmap30Days: unique([todayQuest, ...baseProfile.roadmap30Days]),
      roadmap90Days: selectedRoadmap.threeMonths,
      roadmap6Months: selectedRoadmap.sixMonths,
      consultQuestions,
      todayQuest,
      agentTalkTrack: `${specialty?.label ?? "現在の経験"}を${targetRole}へつなげ、${goalLabel}ための現実的な順番を相談する`,
    };
    const modules = [
      { label: "Route", value: targetRole, score: routeScore },
      { label: "Proof", value: optionLabel(impactOptions, impact), score: evidenceScore },
      { label: "Skill", value: optionLabel(skillOptions, analysis), score: skillScore },
      { label: "Aim", value: `${goalLabel} / ${workStyleLabel}`, score: targetScore },
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
      { label: "1y", value: `${profile.growthLevers[0]}を実績化し、${goalLabel}ための応募軸を作る` },
    ];
    const rewardGap = formatRewardGap(currentSalary, profile.salaryRangeCurrent);
    const powerQuests = [
      { id: "proof", label: profile.todayQuest },
      { id: "skill", label: analysis === "none" ? `${targetRole}で使う専門用語を10個覚える` : profile.roadmap30Days[1] ?? profile.roadmap30Days[0] },
      { id: "route", label: `${targetRole}の求人を3件だけ読む` },
    ];

    return { agentFocus, band, buildName, modules, powerQuests, profile, resumeSignal, rewardGap, roadmap, score };
  }, [answers]);

  const displayedScore = result.score;
  const reachableCompanies = companies.filter((company) =>
    result.profile.reachableCompanyIds.includes(company.id),
  );
  const stretchCompanies = companies.filter((company) =>
    result.profile.stretchCompanyIds.includes(company.id),
  );
  const companyExamples = [...reachableCompanies, ...stretchCompanies]
    .filter((company, index, candidates) => candidates.findIndex((candidate) => candidate.id === company.id) === index)
    .map((company) => ({
      company,
      matchedRoles: company.jobCategories.filter((role) => result.profile.reachableRoles.includes(role)),
      matchesSegment: company.industrySegments.some((segmentId) => result.profile.primarySegmentIds.includes(segmentId)),
    }))
    .filter((example) => example.matchedRoles.length > 0 || example.matchesSegment)
    .slice(0, 4);

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  function showAnalysisThenResult() {
    setIsAnalyzing(true);
    analysisTimerRef.current = setTimeout(() => {
      trackEvent("diagnosis_complete", {
        agent_focus: result.agentFocus,
        background: answers.background ?? "beginner",
        goal: answers.goal ?? "entry",
        result_type: result.profile.id,
      });
      setIsAnalyzing(false);
      setStep(questionSteps.length);
    }, 1600);
  }

  function chooseAnswer(key: AnswerKey, value: string) {
    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      trackEvent("diagnosis_start", { source_page: "career_compass" });
    }

    setAnswers((current) => key === "background" && current.background !== value
      ? { ...current, analysis: undefined, background: value, specialty: undefined }
      : { ...current, [key]: value });

    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }

    nextTimerRef.current = setTimeout(() => {
      if (step >= questionSteps.length - 1) {
        showAnalysisThenResult();
        return;
      }

      setStep((current) => Math.min(questionSteps.length - 1, current + 1));
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

  async function copyConsultMemo() {
    const memo = [
      "Manufacturing Compass 相談メモ",
      `タイプ: ${result.profile.typeName}`,
      `転職材料の整理度: ${displayedScore}`,
      `関連職種の参考年収レンジ: ${result.profile.salaryRangeCurrent}`,
      `経験を補った場合の参考レンジ: ${result.profile.salaryRangePotential}`,
      `現年収との差分: ${result.rewardGap.gapLabel}`,
      `狙える職種: ${result.profile.reachableRoles.join(" / ")}`,
      `強み: ${result.profile.strengths.join(" / ")}`,
      `半導体向けの翻訳: ${result.profile.semiconductorTranslation.join(" / ")}`,
      `Today Quest: ${result.profile.todayQuest}`,
      `相性のよい相談先: ${result.profile.agentMatch.join(" / ")}`,
      "相談したいこと:",
      ...result.profile.consultQuestions.map((question) => `- ${question}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(memo);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2400);
  }

  function goNext() {
    if (!currentValue) return;
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }

    if (step >= questionSteps.length - 1) {
      showAnalysisThenResult();
      return;
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
    setIsAnalyzing(false);
    setCompletedQuestIds([]);
    setCopyStatus("idle");
    setInsightState({ items: [], status: "idle" });
    hasTrackedStartRef.current = false;
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }
  }

  if (isAnalyzing) {
    const analysisLogs = [
      "経験データを解析中...",
      "半導体業界向けに翻訳中...",
      "関連職種の参考レンジを確認中...",
      "今日の行動を整理中...",
      "キャリアルートを作成しました",
    ];

    return (
      <div className="quiz-shell">
        <section className="analysis-card" aria-live="polite">
          <div className="analysis-screen">
            <span>MC</span>
            <p className="eyebrow">回答から経験を読み替えています</p>
            <h1>診断結果を整理中</h1>
            <div className="analysis-bar" aria-hidden="true">
              <i />
            </div>
            <ul>
              {analysisLogs.map((log) => (
                <li key={log}>{log}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }

  if (isResult) {
    return <CareerCompassResult
      band={result.band}
      agentFocus={result.agentFocus}
      buildName={result.buildName}
      completedQuestIds={completedQuestIds}
      copyStatus={copyStatus}
      currentRole={optionLabel(backgroundOptions, answers.background)}
      displayedScore={displayedScore}
      insightState={insightState}
      modules={result.modules}
      onCopyConsultMemo={copyConsultMemo}
      onAgentCtaClick={() => {
        trackEvent("agent_cta_click", {
          agent_focus: result.agentFocus,
          cta_location: "diagnosis_result",
          source_page: "diagnosis_result",
        });
      }}
      onGenerateInsights={generateInsights}
      onRestart={restart}
      onToggleQuest={toggleQuest}
      powerQuests={result.powerQuests}
      profile={result.profile}
      resumeSignal={result.resumeSignal}
      rewardGap={result.rewardGap}
      roadmap={result.roadmap}
      companyExamples={companyExamples}
      showRewardGap={answers.currentSalary !== undefined && answers.currentSalary !== "skip"}
    />;
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
          <p className="eyebrow">12問のキャリア診断</p>
          <h1>{currentStep.question}</h1>
          <small>迷ったら、最も実態に近いものを1つ。選択すると次へ進みます。</small>
        </div>

        <div className="quiz-options" aria-label={currentStep.label}>
          {currentStep.options.map((option, index) => (
            <button
              className={currentValue === option.id ? "quiz-option active" : "quiz-option"}
              disabled={!isHydrated}
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

    </div>
  );
}
