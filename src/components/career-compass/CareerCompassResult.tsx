import Link from "next/link";
import type { Route } from "next";
import type { MarketValueProfile } from "@/data/career-compass";
import { officialLinkDisclosureText, type AgentFocus } from "@/data/affiliateLinks";
import { salaryMethodology } from "@/data/salary-methodology";
import type { Company } from "@/types/content";
import { CareerResultSnapshot } from "@/components/career-compass/CareerResultSnapshot";
import { TodayQuest } from "@/components/career-compass/TodayQuest";
import { trackEvent } from "@/lib/analytics";

type ScoreModule = { label: string; value: string; score: number };
type PowerQuest = { id: string; label: string };
type RoadmapItem = { label: string; value: string };
type CompanyExample = { company: Company; matchedRoles: string[]; matchesSegment: boolean };
type RewardGap = { currentLabel: string; gapLabel: string; note: string };
type InsightState =
  | { status: "idle"; items: string[]; message?: string }
  | { status: "loading"; items: string[]; message?: string }
  | { status: "ready"; items: string[]; message?: string }
  | { status: "error"; items: string[]; message: string };

type CareerCompassResultProps = {
  agentFocus: AgentFocus;
  band: string;
  buildName: string;
  completedQuestIds: string[];
  copyStatus: "idle" | "copied" | "error";
  currentRole: string;
  displayedScore: number;
  insightState: InsightState;
  modules: ScoreModule[];
  onCopyConsultMemo: () => void;
  onAgentCtaClick: () => void;
  onGenerateInsights: () => void;
  onRestart: () => void;
  onToggleQuest: (id: string) => void;
  powerQuests: PowerQuest[];
  profile: MarketValueProfile;
  resumeSignal: string;
  rewardGap: RewardGap;
  roadmap: RoadmapItem[];
  companyExamples: CompanyExample[];
  showRewardGap: boolean;
};

function MarketValueSummary({ profile, rewardGap, showRewardGap }: Pick<CareerCompassResultProps, "profile" | "rewardGap" | "showRewardGap">) {
  const metrics = [
    profile.salaryRangeCurrent ? { label: "関連職種の参考年収レンジ", value: profile.salaryRangeCurrent } : null,
    profile.salaryRangePotential ? { label: "経験を補った場合の参考レンジ", value: profile.salaryRangePotential } : null,
    showRewardGap && rewardGap.gapLabel ? { label: "現年収との参考差分", value: rewardGap.gapLabel } : null,
  ].filter((metric): metric is { label: string; value: string } => Boolean(metric));

  if (metrics.length === 0) return null;

  return (
    <div className="market-value-summary" aria-label="参考年収サマリー">
      <div className="market-value-metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
      <small>職種別の参考値です。実際の年収は経験、英語力、勤務地、勤務形態、企業の採用条件などによって変動します。</small>
      <details className="salary-methodology">
        <summary>年収レンジの算出方法・情報源</summary>
        <div>
          <ol>
            {salaryMethodology.calculationSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p>{salaryMethodology.compensationNote}</p>
          <strong>情報源</strong>
          <ul>
            {salaryMethodology.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a>
                <span>{source.publisher}</span>
              </li>
            ))}
          </ul>
          <small>最終更新日: {salaryMethodology.updatedAt.replaceAll("-", ".")}</small>
        </div>
      </details>
    </div>
  );
}

function ResultHero({ agentFocus, currentRole, onAgentCtaClick, profile, rewardGap, showRewardGap }: Pick<CareerCompassResultProps, "agentFocus" | "currentRole" | "onAgentCtaClick" | "profile" | "rewardGap" | "showRewardGap">) {
  const targetRole = profile.reachableRoles[0];

  return (
    <header className="result-story-hero">
      <div className="result-story-copy">
        <p className="result-kicker">ルールベースの参考結果</p>
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
          <Link className="result-inline-link" href={`/career-agents?focus=${agentFocus}`} onClick={onAgentCtaClick}>相談先を先に見る</Link>
        </div>
      </div>
      <MarketValueSummary profile={profile} rewardGap={rewardGap} showRewardGap={showRewardGap} />
    </header>
  );
}

function ResultInformationGuide() {
  return (
    <aside className="result-information-guide" aria-labelledby="result-information-title">
      <div className="result-information-heading">
        <p className="result-kicker">情報の見方</p>
        <h2 id="result-information-title">参考結果と公開情報を分けて掲載しています</h2>
      </div>
      <div className="result-information-grid">
        <section>
          <span>診断による参考整理</span>
          <p>タイプ、スコア、年収レンジ、強み、ロードマップ、企業との接点は、回答と静的ルールから整理した目安です。企業による評価や選考結果を示すものではありません。</p>
        </section>
        <section>
          <span>公開情報</span>
          <p>企業名や事業内容の確認には、各企業ページに記載した公開情報と出典を使っています。事業領域・職種カテゴリは公開情報をもとにした編集上の整理で、最新の募集職種や採用条件は各社の公式採用ページでご確認ください。</p>
        </section>
      </div>
    </aside>
  );
}

function CareerStory({ profile }: { profile: MarketValueProfile }) {
  const sections = [
    { title: "強みとして整理した理由", items: profile.marketValueReasons.slice(0, 2) },
    { title: "半導体でも使いやすい経験", items: profile.semiconductorTranslation.slice(0, 2) },
    { title: "そのままでは伝わりにくい部分", items: profile.bottlenecks.slice(0, 2) },
  ].filter((section) => section.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <section className="result-section career-story" aria-labelledby="career-story-title">
      <div className="result-section-heading">
        <p className="result-kicker">経験の読み解き</p>
        <h2 id="career-story-title">強みとして整理できる経験と、先に整えること</h2>
      </div>
      <div className="career-story-sections">
        {sections.map((section, index) => (
          <article key={section.title}>
            <span>0{index + 1}</span>
            <div>
              <h3>{section.title}</h3>
              <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceTranslation({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="result-section experience-translation" aria-labelledby="translation-title">
      <div className="result-section-heading">
        <p className="result-kicker">半導体職種への置き換え</p>
        <h2 id="translation-title">今の経験を、半導体業界の言葉へ</h2>
        <p>仕事内容を変えるのではなく、採用側に伝わる見せ方へ翻訳します。</p>
      </div>
      <div className="translation-list">
        {items.slice(0, 5).map((item) => {
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
        <p className="result-kicker">強みと準備ポイント</p>
        <h2 id="strengths-title">武器にすること、先に整えること</h2>
      </div>
      <div className="strengths-watchouts-grid">
        {profile.strengths.length > 0 ? (
          <div className="strengths-column">
            <h3>強みとして整理できる経験</h3>
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
      actions: profile.roadmap30Days.slice(0, 2),
      label: "今から",
      role: profile.reachableRoles[0],
      outcome: profile.immediateRoutes[0],
    },
    {
      actions: [profile.roadmap90Days, profile.roadmap6Months].filter(Boolean),
      label: "半年後",
      role: profile.stretchRoutes[0],
      outcome: profile.stretchRoutes[0],
    },
    {
      actions: [roadmap.find((item) => item.label === "1y")?.value].filter((item): item is string => Boolean(item)),
      label: "1年後",
      role: profile.stretchRoutes[1] ?? profile.stretchRoutes[0],
      outcome: profile.growthLevers[0],
    },
  ].filter((step) => step.role || step.outcome || step.actions.length > 0);

  if (steps.length === 0) return null;

  return (
    <section className="result-section career-roadmap-result" aria-labelledby="roadmap-title">
      <div className="result-section-heading">
        <p className="result-kicker">これからの準備</p>
        <h2 id="roadmap-title">今の経験から、1年後の選択肢へ</h2>
      </div>
      <ol className="roadmap-timeline">
        {steps.map((step, index) => (
          <li key={step.label}>
            <span className="roadmap-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.label}</h3>
            {step.role ? <p className="roadmap-role">{step.role}</p> : null}
            {step.actions.length > 0 ? <ul>{step.actions.map((action) => <li key={action}>{action}</li>)}</ul> : null}
            {step.outcome ? <p className="roadmap-outcome"><span>到達イメージ</span>{step.outcome}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ConsultationCTA({ agentFocus, onAgentCtaClick, onRestart, profile }: Pick<CareerCompassResultProps, "agentFocus" | "onAgentCtaClick" | "onRestart" | "profile">) {
  return (
    <section className="consultation-cta-result" aria-labelledby="consultation-title">
      <div>
        <p className="result-kicker">相談前のメモ</p>
        <h2 id="consultation-title">経験の見せ方を相談すると、選択肢がもっと具体的になります</h2>
        {profile.agentTalkTrack ? <p>{profile.agentTalkTrack}</p> : null}
      </div>
      <div className="consultation-cta-actions">
        <Link className="button primary" href={`/career-agents?focus=${agentFocus}`} onClick={onAgentCtaClick}>この経歴に合うエージェントを見る</Link>
        <button className="button ghost" onClick={onRestart} type="button">もう一度診断する</button>
      </div>
      <small className="result-disclosure">{officialLinkDisclosureText}</small>
    </section>
  );
}

function DetailedReportAccordion(props: CareerCompassResultProps) {
  const {
    buildName,
    companyExamples,
    completedQuestIds,
    copyStatus,
    displayedScore,
    insightState,
    modules,
    onCopyConsultMemo,
    onGenerateInsights,
    onToggleQuest,
    powerQuests,
    profile,
    resumeSignal,
    rewardGap,
    roadmap,
  } = props;
  const moduleGuide: Record<string, { description: string; title: string }> = {
    Route: { title: "経験の接続", description: "今の経験が、狙う職種へどれだけつながるか" },
    Proof: { title: "実績の証拠", description: "成果を数字や具体例で伝えられる状態か" },
    Skill: { title: "活かせるスキル", description: "半導体業界で評価される武器が整理できているか" },
    Aim: { title: "目標との距離", description: "希望を支える英語・専門性・実績が準備できているか" },
  };
  const buildPlanLabels: Record<string, string> = {
    "30d": "30日",
    "90d": "3か月",
    "180d": "半年",
    "1y": "1年",
  };
  const scoreStatus = props.band === "High"
    ? "応募準備がかなり整っています"
    : props.band === "Growth"
      ? "経験の見せ方で伸びる段階です"
      : props.band === "Start"
        ? "転職材料を整理し始める段階です"
        : props.band.replace("today", "今日の行動");
  const additionalQuests = powerQuests.filter((quest) => quest.label !== profile.todayQuest);

  return (
    <details
      className="detailed-report-accordion"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          trackEvent("result_detail_open", { result_type: profile.id });
        }
      }}
    >
      <summary>
        <span>Diagnosis Evidence &amp; Consultation Prep</span>
        <strong>診断の根拠と相談準備を見る</strong>
      </summary>
      <div className="detailed-report-body">
        <div className="detailed-report-intro">
          <p>このレポートは回答と静的ルールによる参考整理であり、合否や企業評価を判定するものではありません。</p>
          <strong>今ある転職材料と、次に整理すると選択肢が広がるポイントを確認できます。</strong>
        </div>

        <section className="detail-report-chapter">
          <header className="detail-chapter-heading">
            <span>01</span>
            <div>
              <p>Diagnosis Evidence</p>
              <h3>なぜ、この診断結果になったのか</h3>
            </div>
          </header>

          <div className="detail-score-context">
            <div className="detail-score-number">
              <span>転職材料の整理度</span>
              <strong>{displayedScore}<small>/ 100</small></strong>
              <p>経験・実績・スキル・目標の4要素を、応募準備の目安として整理した数値です。</p>
            </div>
            <div className="detail-build-context">
              <span>現在のキャリア設計</span>
              <strong>{buildName}</strong>
              <p>{rewardGap.note}</p>
              <small>{scoreStatus}</small>
            </div>
          </div>

          <div className="detail-module-grid">
            {modules.map((module) => {
              const guide = moduleGuide[module.label];

              return (
                <article key={module.label}>
                  <div>
                    <span>{guide?.title ?? module.label}</span>
                    <small>{module.score} / 100</small>
                  </div>
                  <strong>{module.value}</strong>
                  {guide ? <p>{guide.description}</p> : null}
                  <i aria-hidden="true"><em style={{ width: `${module.score}%` }} /></i>
                </article>
              );
            })}
          </div>

          {resumeSignal ? (
            <div className="detail-proof">
              <span>職務経歴書で先に整えること</span>
              <strong>{resumeSignal}</strong>
            </div>
          ) : null}
        </section>

        <section className="detail-report-chapter">
          <header className="detail-chapter-heading">
            <span>02</span>
            <div>
              <p>Application Preparation</p>
              <h3>応募に向けて、何を準備するか</h3>
            </div>
          </header>

          {companyExamples.length > 0 ? (
            <div className="detail-subsection">
              <h4>経験と接点のある企業例</h4>
              <p>公開情報にある職種・事業領域と、診断結果との接点をルールベースで整理しています。優劣や難易度の順ではありません。</p>
              <div className="detail-company-grid">
                {companyExamples.map(({ company, matchedRoles }) => (
                  <article key={company.id}>
                    <span>{company.businessModel}</span>
                    <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link>
                    {matchedRoles.length > 0 ? (
                      <p><b>接点のある職種</b>{matchedRoles.join("・")}</p>
                    ) : (
                      <p>{company.careerSummary}</p>
                    )}
                  </article>
                ))}
              </div>
              <small className="detail-company-note">企業例は現在の募集状況や選考通過の可能性を保証するものではありません。応募時は各社の最新求人をご確認ください。</small>
            </div>
          ) : null}

          {roadmap.length > 0 ? (
            <div className="detail-subsection">
              <h4>準備の進め方</h4>
            <div className="detail-build-plan">
                {roadmap.map((item) => <div key={item.label}><span>{buildPlanLabels[item.label] ?? item.label}</span><b>{item.value}</b></div>)}
            </div>
            </div>
          ) : null}

          {additionalQuests.length > 0 ? (
            <div className="detail-subsection">
              <h4>今日のクエストの次に進めること</h4>
            <div className="detail-power-quests">
                {additionalQuests.map((quest) => {
                const isDone = completedQuestIds.includes(quest.id);
                return (
                  <button className={isDone ? "detail-power-quest done" : "detail-power-quest"} key={quest.id} onClick={() => onToggleQuest(quest.id)} type="button">
                      <i aria-hidden="true">{isDone ? "✓" : ""}</i>
                      <b>{quest.label}</b>
                      <small>{isDone ? "完了" : "未完了"}</small>
                  </button>
                );
              })}
            </div>
            </div>
          ) : null}
        </section>

        <section className="detail-report-chapter detail-consult-brief">
          <header className="detail-chapter-heading">
            <span>03</span>
            <div>
              <p>Consultation Brief</p>
              <h3>エージェントへ相談すること</h3>
            </div>
          </header>

          {profile.agentTalkTrack ? <p className="detail-consult-lead">{profile.agentTalkTrack}</p> : null}
          {profile.consultQuestions.length > 0 ? (
            <ol>
              {profile.consultQuestions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          ) : null}
          <dl className="detail-consult-facts">
            {props.showRewardGap ? <div><dt>現年収との参考差分</dt><dd>{rewardGap.gapLabel}</dd></div> : null}
            {profile.todayQuest ? <div><dt>今日整理する実績</dt><dd>{profile.todayQuest}</dd></div> : null}
          </dl>
          <div className="detail-consult-copy">
            <button className="button primary" onClick={onCopyConsultMemo} type="button">
              {copyStatus === "copied" ? "コピーしました" : "この内容を相談メモとしてコピー"}
            </button>
            {copyStatus === "error" ? <small>コピーできませんでした。上の相談テーマをメモしてください。</small> : null}
          </div>
        </section>

        <aside className="detail-ai-insight">
          <div>
            <span>Optional Insight</span>
            <strong>経験の見え方を、さらに深掘りする</strong>
            <p>必要な場合だけ、AIによる参考分析を確認できます。事実確認済みの企業情報ではありません。</p>
          </div>
          <button className="button ghost" disabled={insightState.status === "loading"} onClick={onGenerateInsights} type="button">
            {insightState.status === "loading" ? "生成中" : "補足分析を見る"}
          </button>
          {insightState.message ? <small>{insightState.message}</small> : null}
          {insightState.items.length > 0 ? <ul>{insightState.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
        </aside>
      </div>
    </details>
  );
}

export function CareerCompassResult(props: CareerCompassResultProps) {
  return (
    <div className="quiz-result-shell">
      <article className="career-result-experience">
        <div className="result-overview">
          <ResultHero {...props} />
          <CareerResultSnapshot
            currentRole={props.currentRole}
            recommendedSkill={props.profile.growthLevers[0] ?? props.profile.bottlenecks[0]}
            score={props.displayedScore}
            targetRole={props.profile.reachableRoles[0]}
            todayQuest={props.profile.todayQuest}
          />
          <ResultInformationGuide />
        </div>
        <CareerStory profile={props.profile} />
        <ExperienceTranslation items={props.profile.semiconductorTranslation} />
        <StrengthsSection profile={props.profile} />
        <CareerRoadmap profile={props.profile} roadmap={props.roadmap} />
        <TodayQuest action={props.profile.todayQuest} reason={props.profile.bottlenecks[0]} resultType={props.profile.id} />
        <DetailedReportAccordion {...props} />
        <ConsultationCTA {...props} />
      </article>
    </div>
  );
}
