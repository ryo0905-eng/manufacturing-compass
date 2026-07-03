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

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: CompassOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="compass-fieldset">
      <legend>{label}</legend>
      <div className="choice-grid">
        {options.map((option) => (
          <button
            className={value === option.id ? "choice-card active" : "choice-card"}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function CareerCompassTool() {
  const [background, setBackground] = useState("production");
  const [experience, setExperience] = useState("middle");
  const [english, setEnglish] = useState("middle");
  const [goal, setGoal] = useState("income");

  const result = useMemo(() => {
    const profile = marketValueProfiles[background] ?? marketValueProfiles.beginner;
    const score = clamp(
      profile.baseScore +
        (experienceBonus[experience] ?? 0) +
        (englishBonus[english] ?? 0) +
        (goalBonus[goal] ?? 0),
      35,
      92,
    );
    const band = score >= 80 ? "High potential" : score >= 65 ? "Growth" : "Entry";
    const focus =
      goal === "global"
        ? profile.englishTalkTrack
        : goal === "income"
          ? "年収を上げるなら、成果を数字で語れる経験に変えるのが近道です。"
          : goal === "specialist"
            ? "専門軸を1つ決めると、応募先と学ぶ順番が絞れます。"
            : "まず近い職種から入り、半年後の選択肢を広げる作戦が現実的です。";

    return { band, focus, profile, score };
  }, [background, english, experience, goal]);

  const reachableCompanies = companies.filter((company) =>
    result.profile.reachableCompanyIds.includes(company.id),
  );
  const stretchCompanies = companies.filter((company) =>
    result.profile.stretchCompanyIds.includes(company.id),
  );
  const partner = affiliatePartners.find((item) => item.isActive);

  return (
    <div className="value-check">
      <section className="value-input-panel">
        <div>
          <p className="eyebrow">Market value check</p>
          <h1>半導体キャリア市場価値診断</h1>
          <p>4つ選ぶだけ。想定年収、伸ばすこと、今日の一手を返します。</p>
        </div>

        <OptionGroup label="経験" onChange={setBackground} options={backgroundOptions} value={background} />
        <OptionGroup label="年数" onChange={setExperience} options={experienceOptions} value={experience} />
        <OptionGroup label="英語" onChange={setEnglish} options={englishOptions} value={english} />
        <OptionGroup label="狙い" onChange={setGoal} options={goalOptions} value={goal} />
      </section>

      <aside className="value-result-panel" aria-live="polite">
        <div className="score-hero">
          <div>
            <span>市場価値スコア</span>
            <strong>{result.score}</strong>
          </div>
          <small>{result.band}</small>
          <div className="score-bar" aria-hidden="true">
            <span style={{ width: `${result.score}%` }} />
          </div>
        </div>

        <div className="salary-grid">
          <div className="salary-card">
            <span>現在の目安</span>
            <strong>{result.profile.salaryRangeCurrent}</strong>
          </div>
          <div className="salary-card accent">
            <span>伸ばした後</span>
            <strong>{result.profile.salaryRangePotential}</strong>
          </div>
        </div>

        <section className="result-compact">
          <p className="eyebrow">{result.profile.shortLabel}</p>
          <h2>{result.profile.title}</h2>
          <p>{result.profile.summary}</p>
        </section>

        <div className="result-mini-grid">
          <div className="result-mini-card">
            <span>今狙える</span>
            {reachableCompanies.slice(0, 3).map((company) => (
              <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                {company.nameJa}
              </Link>
            ))}
          </div>
          <div className="result-mini-card">
            <span>伸ばす</span>
            {result.profile.growthLevers.slice(0, 3).map((item) => (
              <b key={item}>{item}</b>
            ))}
          </div>
          <div className="result-mini-card">
            <span>今日やる</span>
            {result.profile.actionsToday.slice(0, 2).map((item) => (
              <b key={item}>{item}</b>
            ))}
          </div>
        </div>

        <div className="next-panel">
          <span>次の30日</span>
          <strong>{result.profile.roadmap30Days[0]}</strong>
          <p>{result.focus}</p>
        </div>

        <div className="stretch-row">
          <span>ストレッチ目標</span>
          <div>
            {stretchCompanies.slice(0, 3).map((company) => (
              <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                {company.nameJa}
              </Link>
            ))}
          </div>
        </div>

        <div className="value-cta">
          <div>
            <span>相談メモ</span>
            <p>{result.profile.agentTalkTrack}</p>
          </div>
          <a className="button primary" href={partner?.url ?? "#"}>
            転職相談を見る
          </a>
          <small>{partner?.disclosureText ?? "本ページには広告リンクが含まれる場合があります。"}</small>
        </div>
      </aside>
    </div>
  );
}
