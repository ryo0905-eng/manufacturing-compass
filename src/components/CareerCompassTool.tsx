"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import {
  achievementOptions,
  analysisOptions,
  backgroundOptions,
  englishOptions,
  experienceOptions,
  exposureOptions,
  goalOptions,
  marketValueProfiles,
  type CompassOption,
} from "@/data/career-compass";
import { affiliatePartners, companies } from "@/data/companies";

type AnswerKey = "background" | "exposure" | "experience" | "achievement" | "analysis" | "english" | "goal";
type Answers = Partial<Record<AnswerKey, string>>;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function optionLabel(options: CompassOption[], id: string | undefined) {
  return options.find((option) => option.id === id)?.label ?? "";
}

export function CareerCompassTool() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
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
    const analysis = answers.analysis ?? "none";
    const goal = answers.goal ?? "entry";
    const profile = marketValueProfiles[background] ?? marketValueProfiles.beginner;
    const routeScore = clamp(profile.baseScore + (exposureBonus[exposure] ?? 0), 35, 96);
    const evidenceScore = clamp(54 + (experienceBonus[experience] ?? 0) + (achievementBonus[achievement] ?? 0), 35, 96);
    const skillScore = clamp(50 + (analysisBonus[analysis] ?? 0) + (englishBonus[english] ?? 0), 35, 96);
    const targetScore = clamp(56 + (goalBonus[goal] ?? 0) + (exposureBonus[exposure] ?? 0), 35, 96);
    const score = clamp(
      Math.round(routeScore * 0.36 + evidenceScore * 0.28 + skillScore * 0.22 + targetScore * 0.14),
      35,
      92,
    );
    const band = score >= 80 ? "High" : score >= 65 ? "Growth" : "Start";
    const modules = [
      { label: "Route", value: profile.reachableRoles[0], score: routeScore },
      { label: "Proof", value: optionLabel(achievementOptions, achievement), score: evidenceScore },
      { label: "Skill", value: optionLabel(analysisOptions, analysis), score: skillScore },
      { label: "Aim", value: optionLabel(goalOptions, goal), score: targetScore },
    ];
    const buildName = `${profile.shortLabel} / ${optionLabel(achievementOptions, achievement) || "探索"}ビルド`;

    return { band, buildName, modules, profile, score };
  }, [answers]);

  const reachableCompanies = companies.filter((company) =>
    result.profile.reachableCompanyIds.includes(company.id),
  );

  function chooseAnswer(key: AnswerKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function goNext() {
    if (!currentValue) return;
    setStep((current) => current + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (isResult) {
    return (
      <div className="quiz-result-shell">
        <section className="quiz-result-card">
          <div className="quiz-result-score">
            <span>Career Power</span>
            <strong>{result.score}</strong>
            <small>{result.band}</small>
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
              <span>Reward Range</span>
              <strong>{result.profile.salaryRangeCurrent}</strong>
            </div>
            <div>
              <span>Next Reward</span>
              <strong>{result.profile.salaryRangePotential}</strong>
            </div>
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

          <div className="quest-roadmap">
            <span>7 days</span>
            {result.profile.roadmap30Days.map((item) => (
              <b key={item}>{item}</b>
            ))}
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
            Stage {step + 1} / {questionSteps.length}
          </span>
          <div aria-hidden="true">
            <i style={{ width: `${((step + 1) / questionSteps.length) * 100}%` }} />
          </div>
        </div>

        <p className="eyebrow">Career Quest</p>
        <h1>{currentStep.question}</h1>

        <div className="quiz-options" aria-label={currentStep.label}>
          {currentStep.options.map((option) => (
            <button
              className={currentValue === option.id ? "quiz-option active" : "quiz-option"}
              key={option.id}
              onClick={() => chooseAnswer(currentStep.key, option.id)}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            className="button ghost"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            type="button"
          >
            戻る
          </button>
          <button className="button primary" disabled={!currentValue} onClick={goNext} type="button">
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
