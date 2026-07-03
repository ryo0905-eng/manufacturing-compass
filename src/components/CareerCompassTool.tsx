"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Route } from "next";
import {
  backgroundOptions,
  compassProfiles,
  englishOptions,
  experienceOptions,
  goalOptions,
  type CompassOption,
} from "@/data/career-compass";
import { affiliatePartners, companies, segments } from "@/data/companies";

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
  const [goal, setGoal] = useState("entry");

  const result = useMemo(() => {
    const profile = compassProfiles[background] ?? compassProfiles.beginner;
    const englishAction =
      english === "low"
        ? "英語はまず職務経歴・改善事例を短く説明する練習から始めると、外資系やグローバル職の準備になります。"
        : english === "high"
          ? "英語対応ができるなら、外資系や顧客対応職も早めに候補へ入れられます。"
          : "英語はメール・資料説明レベルを磨くと、応募先の幅が広がります。";
    const experienceAction =
      experience === "early"
        ? "経験年数が浅い場合は、実績を広く見せるより、1つの改善事例を数字で語れる状態を作るのが近道です。"
        : experience === "senior"
          ? "経験が長い場合は、現場改善だけでなく、関係者を動かした経験や再現性を整理すると伝わりやすくなります。"
          : "主担当として進めた改善・立ち上げ・顧客対応を、成果と一緒に整理しましょう。";
    const goalAction =
      goal === "global"
        ? "グローバル志向なら、英語での技術説明と外資系職種の要件確認を優先しましょう。"
        : goal === "income"
          ? "年収アップを狙うなら、半導体内でも市場価値が伝わりやすい実績の言語化が重要です。"
          : goal === "specialist"
            ? "専門性を深めるなら、プロセス・装置・品質のどれを軸にするかを先に決めましょう。"
            : "まず半導体へ入るなら、近い職種から入って半年後・1年後に選択肢を広げるのが現実的です。";

    return {
      profile,
      extraActions: [experienceAction, englishAction, goalAction],
    };
  }, [background, english, experience, goal]);

  const primarySegments = segments.filter((segment) => result.profile.primarySegmentIds.includes(segment.id));
  const reachableCompanies = companies.filter((company) => result.profile.reachableCompanyIds.includes(company.id));
  const stretchCompanies = companies.filter((company) => result.profile.stretchCompanyIds.includes(company.id));
  const partner = affiliatePartners.find((item) => item.isActive);

  return (
    <div className="compass-tool">
      <section className="compass-input-panel">
        <div>
          <p className="eyebrow">Career Compass</p>
          <h1>あなたの経験から、半導体業界への入口を探す。</h1>
          <p>4つ選ぶだけで、今近い領域、将来チャレンジしやすい会社、半年の準備を整理します。</p>
        </div>

        <OptionGroup label="いま一番近い経験" onChange={setBackground} options={backgroundOptions} value={background} />
        <OptionGroup label="経験年数" onChange={setExperience} options={experienceOptions} value={experience} />
        <OptionGroup label="英語の状態" onChange={setEnglish} options={englishOptions} value={english} />
        <OptionGroup label="転職の狙い" onChange={setGoal} options={goalOptions} value={goal} />
      </section>

      <aside className="compass-result-panel">
        <p className="eyebrow">Your route</p>
        <h2>{result.profile.title}</h2>
        <p>{result.profile.summary}</p>

        <div className="result-section">
          <span>近い領域</span>
          <div className="result-tags">
            {primarySegments.map((segment) => (
              <Link href="/industry-map" key={segment.id}>{segment.name}</Link>
            ))}
          </div>
        </div>

        <div className="result-section">
          <span>今狙いやすい会社</span>
          <div className="result-company-list">
            {reachableCompanies.map((company) => (
              <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                <strong>{company.nameJa}</strong>
                <small>{company.businessModel}</small>
              </Link>
            ))}
          </div>
        </div>

        <div className="result-section">
          <span>将来のストレッチ目標</span>
          <div className="result-tags subtle">
            {stretchCompanies.map((company) => (
              <Link href={`/companies/${company.slug}` as Route} key={company.id}>{company.nameJa}</Link>
            ))}
          </div>
        </div>

        <div className="result-section">
          <span>今日からできること</span>
          <ol className="action-list">
            {result.profile.actionsNow.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </div>

        <div className="result-section">
          <span>半年で近づく準備</span>
          <ul className="compact-list">
            {[...result.profile.actionsSixMonths, ...result.extraActions].map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>

        <div className="result-cta">
          <h3>この結果をもとに相談する</h3>
          <p>{result.profile.agentTalkTrack}</p>
          <a className="button primary" href={partner?.url ?? "#"}>相談の選択肢を見る</a>
          <small>{partner?.disclosureText ?? "本ページには広告リンクが含まれる場合があります。"}</small>
        </div>
      </aside>
    </div>
  );
}
