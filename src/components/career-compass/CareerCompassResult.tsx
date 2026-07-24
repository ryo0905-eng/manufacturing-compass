import Link from "next/link";
import type { Route } from "next";
import type { MarketValueProfile } from "@/data/career-compass";
import { officialLinkDisclosureText, type AgentFocus } from "@/data/affiliateLinks";
import { salaryMethodology } from "@/data/salary-methodology";
import type { Company } from "@/types/content";
import { ResultCareerRoute, type ResultCareerRouteStage } from "@/components/career-compass/ResultCareerRoute";
import { TodayQuest } from "@/components/career-compass/TodayQuest";
import { trackEvent } from "@/lib/analytics";

type ScoreModule = { label: string; value: string; score: number };
type PowerQuest = { id: string; label: string };
type RoadmapItem = { label: string; value: string };
type CompanyExample = { company: Company; matchedRoles: string[]; matchesSegment: boolean };
type RewardGap = { currentLabel: string; gapLabel: string; note: string };

type CareerCompassResultProps = {
  agentFocus: AgentFocus;
  band: string;
  buildName: string;
  completedQuestIds: string[];
  copyStatus: "idle" | "copied" | "error";
  currentRole: string;
  displayedScore: number;
  modules: ScoreModule[];
  onCopyConsultMemo: () => void;
  onAgentCtaClick: () => void;
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
    <section className="market-value-summary" aria-labelledby="market-value-summary-title">
      <div className="result-reference-heading">
        <h3 id="market-value-summary-title">職種別の参考年収</h3>
        <p>応募先を考えるときの参考情報です。今回の整理結果や提示年収ではありません。</p>
      </div>
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
    </section>
  );
}

function ResultHero({ currentRole, profile }: Pick<CareerCompassResultProps, "currentRole" | "profile">) {
  const targetRole = profile.reachableRoles[0];
  const resultHeading = currentRole && targetRole
    ? currentRole === targetRole
      ? `これまでの${currentRole}の経験は、半導体企業の${targetRole}でも整理しやすそうです。`
      : `${currentRole}の経験は、${targetRole}の仕事と比べやすそうです。`
    : "今の経験と、半導体の仕事との接点を整理しました。";

  return (
    <header className="result-story-hero">
      <div className="result-story-copy">
        <p className="result-kicker">今回の整理結果</p>
        <h1>{resultHeading}</h1>
        {profile.summary ? <p className="result-lead">{profile.summary}</p> : null}
        {currentRole && targetRole ? (
          <div className="result-at-a-glance">
            <div>
              <span>今の経験</span>
              <strong>{currentRole}</strong>
            </div>
            <i aria-hidden="true">→</i>
            <div>
              <span>近い仕事</span>
              <strong>{targetRole}</strong>
            </div>
            <div>
              <span>次に補うなら</span>
              <strong>{profile.growthLevers[0] ?? profile.bottlenecks[0]}</strong>
            </div>
          </div>
        ) : null}
        <div className="result-hero-actions">
          <a className="button primary" href="#today-quest">今日やることを見る</a>
          <a className="result-inline-link" href="#result-reasoning">そう整理した理由を見る</a>
        </div>
        <small className="result-rule-note">
          回答と静的ルールによる参考整理です。企業評価や選考結果を示すものではありません。
        </small>
      </div>
    </header>
  );
}

function ResultInformationGuide() {
  return (
    <aside className="result-information-guide" aria-labelledby="result-information-title">
      <div className="result-information-heading">
        <h3 id="result-information-title">この結果の見方</h3>
      </div>
      <div className="result-information-grid">
        <section>
          <span>回答からの参考整理</span>
          <p>職種、転職材料の整理度、準備案は、回答と静的ルールから整理した目安です。</p>
        </section>
        <section>
          <span>企業・業界の公開情報</span>
          <p>企業名や事業内容は公開情報と出典を確認しています。最新の求人条件は各社の公式採用ページをご確認ください。</p>
        </section>
      </div>
    </aside>
  );
}

function ResultReasoning({ profile }: { profile: MarketValueProfile }) {
  const sections = [
    { title: "そう整理した理由", items: profile.marketValueReasons.slice(0, 3) },
    { title: "応募前に補足したいこと", items: profile.bottlenecks.slice(0, 3) },
  ].filter((section) => section.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <section className="result-section result-reasoning" id="result-reasoning" aria-labelledby="result-reasoning-title">
      <div className="result-section-heading">
        <h2 id="result-reasoning-title">先に伝えたい経験と、補足したいこと。</h2>
      </div>
      <div className="result-reasoning-grid">
        {sections.map((section) => (
          <article key={section.title}>
            <h3>{section.title}</h3>
            <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
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
        <h2 id="translation-title">半導体求人での言い換え例。</h2>
        <p>仕事内容を変えるのではなく、求人票と比べやすい言葉に置き換えます。</p>
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

function CareerRoadmap({ currentRole, profile, roadmap }: Pick<CareerCompassResultProps, "currentRole" | "profile" | "roadmap">) {
  const steps: ResultCareerRouteStage[] = [
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

  return <ResultCareerRoute currentRole={currentRole} stages={steps} />;
}

function ConsultationCTA({ agentFocus, onAgentCtaClick, onRestart, profile }: Pick<CareerCompassResultProps, "agentFocus" | "onAgentCtaClick" | "onRestart" | "profile">) {
  return (
    <section className="consultation-cta-result" aria-labelledby="consultation-title">
      <div>
        <h2 id="consultation-title">相談する前に、確認したいことを整理する。</h2>
        {profile.agentTalkTrack ? <p>{profile.agentTalkTrack}</p> : null}
      </div>
      <div className="consultation-cta-actions">
        <Link className="button primary" href={`/career-agents?focus=${agentFocus}`} onClick={onAgentCtaClick}>相談先の特徴を見る</Link>
        <button className="button ghost" onClick={onRestart} type="button">回答をやり直す</button>
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
    modules,
    onCopyConsultMemo,
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
        <strong>詳しい根拠と準備計画を見る</strong>
      </summary>
      <div className="detailed-report-body">
        <div className="detailed-report-intro">
          <p>回答と静的ルールによる参考整理です。合否や企業評価を判定するものではありません。</p>
          <strong>今ある転職材料と、次に整理すると選択肢が広がるポイントを確認できます。</strong>
        </div>

        <section className="detail-report-chapter detail-reference-information">
          <MarketValueSummary profile={profile} rewardGap={rewardGap} showRewardGap={props.showRewardGap} />
          <ResultInformationGuide />
        </section>

        <section className="detail-report-chapter">
          <header className="detail-chapter-heading">
            <span>01</span>
            <div>
              <p>整理の根拠</p>
              <h3>回答のどこを見て整理したか</h3>
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
              <p>応募前の準備</p>
              <h3>応募に向けて、何を準備するか</h3>
            </div>
          </header>

          {companyExamples.length > 0 ? (
            <div className="detail-subsection">
              <h4>経験と接点のある企業例</h4>
              <p>公開情報にある職種・事業領域と、今回の整理結果との接点をルールベースで確認しています。優劣や難易度の順ではありません。</p>
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
              <p>相談前のメモ</p>
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

      </div>
    </details>
  );
}

export function CareerCompassResult(props: CareerCompassResultProps) {
  return (
    <div className="quiz-result-shell">
      <article className="career-result-experience">
        <ResultHero currentRole={props.currentRole} profile={props.profile} />
        <TodayQuest action={props.profile.todayQuest} reason={props.profile.bottlenecks[0]} resultType={props.profile.id} />
        <ResultReasoning profile={props.profile} />
        <ExperienceTranslation items={props.profile.semiconductorTranslation} />
        <CareerRoadmap currentRole={props.currentRole} profile={props.profile} roadmap={props.roadmap} />
        <DetailedReportAccordion {...props} />
        <ConsultationCTA {...props} />
      </article>
    </div>
  );
}
