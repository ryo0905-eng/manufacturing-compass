import Link from "next/link";
import type { Route } from "next";
import type { MarketValueProfile } from "@/data/career-compass";
import { affiliateDisclosureText } from "@/data/affiliateLinks";
import type { Company } from "@/types/content";
import { TodayQuest } from "@/components/career-compass/TodayQuest";

type ScoreModule = { label: string; value: string; score: number };
type PowerQuest = { id: string; label: string; xp: number };
type RoadmapItem = { label: string; value: string };
type RouteStep = { companies: Company[]; label: string; note: string; title: string };
type RewardGap = { currentLabel: string; gapLabel: string; note: string };
type InsightState =
  | { status: "idle"; items: string[]; message?: string }
  | { status: "loading"; items: string[]; message?: string }
  | { status: "ready"; items: string[]; message?: string }
  | { status: "error"; items: string[]; message: string };

type CareerCompassResultProps = {
  band: string;
  buildName: string;
  completedQuestIds: string[];
  copyStatus: "idle" | "copied" | "error";
  currentRole: string;
  displayedScore: number;
  insightState: InsightState;
  modules: ScoreModule[];
  onCopyConsultMemo: () => void;
  onGenerateInsights: () => void;
  onRestart: () => void;
  onToggleQuest: (id: string) => void;
  powerQuests: PowerQuest[];
  profile: MarketValueProfile;
  resumeSignal: string;
  rewardGap: RewardGap;
  roadmap: RoadmapItem[];
  routeLadder: RouteStep[];
  showRewardGap: boolean;
};

function MarketValueSummary({ profile, rewardGap, showRewardGap }: Pick<CareerCompassResultProps, "profile" | "rewardGap" | "showRewardGap">) {
  const metrics = [
    profile.salaryRangeCurrent ? { label: "現在の推定市場価値", value: profile.salaryRangeCurrent } : null,
    profile.salaryRangePotential ? { label: "次に狙える年収ゾーン", value: profile.salaryRangePotential } : null,
    showRewardGap && rewardGap.gapLabel ? { label: "年収上昇余地", value: rewardGap.gapLabel } : null,
  ].filter((metric): metric is { label: string; value: string } => Boolean(metric));

  if (metrics.length === 0) return null;

  return (
    <div className="market-value-summary" aria-label="市場価値サマリー">
      <div className="market-value-metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
      <small>年収は経験、英語力、勤務地、勤務形態、企業の採用条件などによって変動します。</small>
    </div>
  );
}

function ResultHero({ currentRole, profile, rewardGap, showRewardGap }: Pick<CareerCompassResultProps, "currentRole" | "profile" | "rewardGap" | "showRewardGap">) {
  const targetRole = profile.reachableRoles[0];

  return (
    <header className="result-story-hero">
      <div className="result-story-copy">
        <p className="result-kicker">半導体キャリア診断結果</p>
        <p className="result-type-label">{profile.typeName}</p>
        <h1>{profile.title}</h1>
        {currentRole && targetRole ? (
          <div className="result-route-line" aria-label="現在地から目標職種へのルート">
            <span>{currentRole}</span>
            <i aria-hidden="true">→</i>
            <strong>{targetRole}</strong>
          </div>
        ) : null}
        {profile.summary ? <p className="result-lead">{profile.summary}</p> : null}
        <div className="result-hero-actions">
          <a className="button primary" href="#today-quest">今日の一手を見る</a>
          <Link className="result-inline-link" href="/career-agents">相談先を先に見る</Link>
        </div>
      </div>
      <MarketValueSummary profile={profile} rewardGap={rewardGap} showRewardGap={showRewardGap} />
    </header>
  );
}

function CareerStory({ profile }: { profile: MarketValueProfile }) {
  const sentences = profile.narrative.match(/[^。！？]+[。！？]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  const turnIndex = sentences.findIndex((sentence) => /一方で|ただし/.test(sentence));
  const canSplit = sentences.length >= 3;
  const firstCut = turnIndex >= 2 ? 1 : Math.ceil(sentences.length / 3);
  const secondCut = turnIndex >= 2 ? turnIndex : Math.ceil((sentences.length * 2) / 3);
  const sections = canSplit
    ? [
        { title: "あなたが評価される理由", text: sentences.slice(0, firstCut).join("") },
        { title: "半導体業界で価値になる経験", text: sentences.slice(firstCut, secondCut).join("") },
        { title: "今のままでは伝わりにくい点", text: sentences.slice(secondCut).join("") },
      ].filter((section) => section.text)
    : [];

  if (!profile.narrative) return null;

  return (
    <section className="result-section career-story" aria-labelledby="career-story-title">
      <div className="result-section-heading">
        <p className="result-kicker">Your Career Story</p>
        <h2 id="career-story-title">あなたの経験には、すでに次の業界へつながる物語があります</h2>
      </div>
      {sections.length > 0 ? (
        <div className="career-story-sections">
          {sections.map((section, index) => (
            <article key={section.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="career-story-fallback">{profile.narrative}</p>
      )}
    </section>
  );
}

function ExperienceTranslation({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="result-section experience-translation" aria-labelledby="translation-title">
      <div className="result-section-heading">
        <p className="result-kicker">Experience Translation</p>
        <h2 id="translation-title">今の経験を、半導体業界の言葉へ</h2>
        <p>仕事内容を変えるのではなく、採用側に伝わる見せ方へ翻訳します。</p>
      </div>
      <div className="translation-list">
        {items.map((item) => {
          const [before, ...afterParts] = item.split("→").map((part) => part.trim());
          const after = afterParts.join(" → ");

          return (
            <div key={item}>
              <span>{before}</span>
              {after ? <i aria-hidden="true">→</i> : null}
              {after ? <strong>{after}</strong> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StrengthsSection({ profile }: { profile: MarketValueProfile }) {
  if (profile.strengths.length === 0 && profile.bottlenecks.length === 0) return null;

  return (
    <section className="result-section strengths-watchouts" aria-labelledby="strengths-title">
      <div className="result-section-heading">
        <p className="result-kicker">Strengths &amp; Watchouts</p>
        <h2 id="strengths-title">武器にすること、先に整えること</h2>
      </div>
      <div className="strengths-watchouts-grid">
        {profile.strengths.length > 0 ? (
          <div className="strengths-column">
            <h3>あなたの強み</h3>
            <ul>{profile.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        ) : null}
        {profile.bottlenecks.length > 0 ? (
          <div className="watchouts-column">
            <h3>転職時に注意するポイント</h3>
            <ul>{profile.bottlenecks.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CareerRoadmap({ profile, roadmap }: Pick<CareerCompassResultProps, "profile" | "roadmap">) {
  const steps = [
    {
      label: "今から",
      role: profile.reachableRoles[0],
      experience: profile.immediateRoutes[0],
      action: profile.roadmap30Days[0],
    },
    {
      label: "半年後",
      role: profile.stretchRoutes[0],
      experience: profile.roadmap6Months,
      action: profile.roadmap90Days,
    },
    {
      label: "1年後",
      role: profile.stretchRoutes[1] ?? profile.stretchRoutes[0],
      experience: profile.growthLevers[0],
      action: roadmap.find((item) => item.label === "1y")?.value,
    },
  ].filter((step) => step.role || step.experience || step.action);

  if (steps.length === 0) return null;

  return (
    <section className="result-section career-roadmap-result" aria-labelledby="roadmap-title">
      <div className="result-section-heading">
        <p className="result-kicker">Career Roadmap</p>
        <h2 id="roadmap-title">今の経験から、1年後の選択肢へ</h2>
      </div>
      <ol className="roadmap-timeline">
        {steps.map((step, index) => (
          <li key={step.label}>
            <span className="roadmap-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.label}</h3>
            <dl>
              {step.role ? <div><dt>目標職種</dt><dd>{step.role}</dd></div> : null}
              {step.experience ? <div><dt>身につける経験</dt><dd>{step.experience}</dd></div> : null}
              {step.action ? <div><dt>具体的な行動</dt><dd>{step.action}</dd></div> : null}
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ConsultationCTA({ copyStatus, onCopyConsultMemo, onRestart, profile }: Pick<CareerCompassResultProps, "copyStatus" | "onCopyConsultMemo" | "onRestart" | "profile">) {
  return (
    <section className="consultation-cta-result" aria-labelledby="consultation-title">
      <div>
        <p className="result-kicker">Your Next Conversation</p>
        <h2 id="consultation-title">経験の見せ方を相談すると、選択肢がもっと具体的になります</h2>
        {profile.agentTalkTrack ? <p>{profile.agentTalkTrack}</p> : null}
      </div>
      <div className="consultation-cta-actions">
        <Link className="button primary" href="/career-agents">この経歴に合うエージェントを見る</Link>
        <button className="button ghost" onClick={onRestart} type="button">もう一度診断する</button>
        <button className="consult-memo-button" onClick={onCopyConsultMemo} type="button">
          {copyStatus === "copied" ? "コピーしました" : "相談メモをコピー"}
        </button>
      </div>
      {copyStatus === "error" ? <small>コピーできませんでした。詳細レポートの相談テーマをご利用ください。</small> : null}
      <small className="result-disclosure">{affiliateDisclosureText}</small>
    </section>
  );
}

function DetailedReportAccordion(props: CareerCompassResultProps) {
  const {
    buildName,
    completedQuestIds,
    displayedScore,
    insightState,
    modules,
    onGenerateInsights,
    onToggleQuest,
    powerQuests,
    profile,
    resumeSignal,
    rewardGap,
    roadmap,
    routeLadder,
  } = props;

  return (
    <details className="detailed-report-accordion">
      <summary>
        <span>Detailed Report</span>
        <strong>診断スコアと詳しい準備プランを見る</strong>
      </summary>
      <div className="detailed-report-body">
        <section className="detail-score-overview">
          <div><span>診断スコア</span><strong>{displayedScore}</strong><small>{props.band}</small></div>
          <div><span>Build</span><strong>{buildName}</strong><small>{rewardGap.note}</small></div>
        </section>

        <section className="detail-block">
          <h3>Route / Proof / Skill / Aim</h3>
          <div className="detail-module-grid">
            {modules.map((module) => (
              <div key={module.label}>
                <span>{module.label}</span><b>{module.value}</b>
                <i aria-hidden="true"><em style={{ width: `${module.score}%` }} /></i>
              </div>
            ))}
          </div>
          {resumeSignal ? <p className="detail-proof"><span>Proof</span>{resumeSignal}</p> : null}
        </section>

        {routeLadder.length > 0 ? (
          <section className="detail-block">
            <h3>Target Route</h3>
            <div className="detail-route-grid">
              {routeLadder.map((route) => (
                <div key={route.label}>
                  <span>{route.label}</span><b>{route.title}</b>
                  {route.companies.map((company) => <Link href={`/companies/${company.slug}` as Route} key={company.id}>{company.nameJa}</Link>)}
                  <small>{route.note}</small>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {roadmap.length > 0 ? (
          <section className="detail-block">
            <h3>Build Plan</h3>
            <div className="detail-build-plan">
              {roadmap.map((item) => <div key={item.label}><span>{item.label}</span><b>{item.value}</b></div>)}
            </div>
          </section>
        ) : null}

        {powerQuests.length > 0 ? (
          <section className="detail-block">
            <h3>Power Up</h3>
            <div className="detail-power-quests">
              {powerQuests.map((quest) => {
                const isDone = completedQuestIds.includes(quest.id);
                return (
                  <button className={isDone ? "detail-power-quest done" : "detail-power-quest"} key={quest.id} onClick={() => onToggleQuest(quest.id)} type="button">
                    <b>{quest.label}</b><small>{isDone ? "DONE" : `+${quest.xp}`}</small>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="detail-block detail-ai-insight">
          <div><h3>AI Insight</h3><p>半導体向けに、経験の見え方を読み替えます。</p></div>
          <button className="button ghost" disabled={insightState.status === "loading"} onClick={onGenerateInsights} type="button">
            {insightState.status === "loading" ? "生成中" : "AIで深掘り"}
          </button>
          {insightState.message ? <small>{insightState.message}</small> : null}
          {insightState.items.length > 0 ? <ul>{insightState.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
        </section>

        {profile.consultQuestions.length > 0 ? (
          <section className="detail-block detail-consult-brief">
            <h3>Consult Brief</h3>
            <ul>
              {profile.consultQuestions.map((question) => <li key={question}>{question}</li>)}
              <li>今日のキャリアクエスト: {profile.todayQuest}</li>
            </ul>
          </section>
        ) : null}
      </div>
    </details>
  );
}

export function CareerCompassResult(props: CareerCompassResultProps) {
  return (
    <div className="quiz-result-shell">
      <article className="career-result-experience">
        <ResultHero {...props} />
        <CareerStory profile={props.profile} />
        <ExperienceTranslation items={props.profile.semiconductorTranslation} />
        <StrengthsSection profile={props.profile} />
        <CareerRoadmap profile={props.profile} roadmap={props.roadmap} />
        <TodayQuest action={props.profile.todayQuest} reason={props.profile.bottlenecks[0]} />
        <DetailedReportAccordion {...props} />
        <ConsultationCTA {...props} />
      </article>
    </div>
  );
}
