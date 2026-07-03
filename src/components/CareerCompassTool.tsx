"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import {
  backgroundOptions,
  englishOptions,
  experienceOptions,
  goalOptions,
  marketValueProfiles,
  type CompassOption,
} from "@/data/career-compass";
import { affiliatePartners, companies } from "@/data/companies";

type AnswerKey = "background" | "experience" | "english" | "goal";
type Answers = Partial<Record<AnswerKey, string>>;

type QuestionStep = {
  key: AnswerKey;
  label: string;
  question: string;
  helper: string;
  options: CompassOption[];
};

const questionSteps: QuestionStep[] = [
  {
    key: "background",
    label: "経験",
    question: "いちばん近い経験は？",
    helper: "迷ったら、いま一番話しやすい仕事を選んでください。",
    options: backgroundOptions,
  },
  {
    key: "experience",
    label: "年数",
    question: "経験年数はどれくらい？",
    helper: "半導体以外の製造業経験も含めてOKです。",
    options: experienceOptions,
  },
  {
    key: "english",
    label: "英語",
    question: "英語はどの状態に近い？",
    helper: "完璧さより、仕事で使える場面を見ます。",
    options: englishOptions,
  },
  {
    key: "goal",
    label: "狙い",
    question: "次にいちばん欲しいものは？",
    helper: "いまの本音に近いものを選んでください。",
    options: goalOptions,
  },
];

const experienceBonus: Record<string, number> = {
  early: -4,
  middle: 4,
  senior: 9,
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

export function CareerCompassTool() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const isResult = step >= questionSteps.length;
  const currentStep = questionSteps[Math.min(step, questionSteps.length - 1)];
  const currentValue = answers[currentStep.key];
  const partner = affiliatePartners.find((item) => item.isActive);

  const result = useMemo(() => {
    const background = answers.background ?? "beginner";
    const experience = answers.experience ?? "middle";
    const english = answers.english ?? "middle";
    const goal = answers.goal ?? "entry";
    const profile = marketValueProfiles[background] ?? marketValueProfiles.beginner;
    const score = clamp(
      profile.baseScore +
        (experienceBonus[experience] ?? 0) +
        (englishBonus[english] ?? 0) +
        (goalBonus[goal] ?? 0),
      35,
      92,
    );
    const band = score >= 80 ? "High" : score >= 65 ? "Growth" : "Start";
    const focus =
      goal === "global"
        ? profile.englishTalkTrack
        : goal === "income"
          ? "年収を上げるなら、成果を数字で語れる経験に変えるのが近道です。"
          : goal === "specialist"
            ? "専門軸を1つ決めると、応募先と学ぶ順番が絞れます。"
            : "まず近い職種から入り、半年後の選択肢を広げる作戦が現実的です。";

    return { band, focus, profile, score };
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
            <h1>{result.profile.title}</h1>
            <p>{result.profile.summary}</p>
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
              {result.profile.growthLevers.slice(0, 2).map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
            <div>
              <span>Today Quest</span>
              <b>{result.profile.actionsToday[0]}</b>
            </div>
          </div>

          <div className="quiz-next-card">
            <span>Next Mission</span>
            <strong>{result.profile.roadmap30Days[0]}</strong>
            <p>{result.focus}</p>
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
        <p>{currentStep.helper}</p>

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
            {step === questionSteps.length - 1 ? "ステータスを見る" : "次のStageへ"}
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
