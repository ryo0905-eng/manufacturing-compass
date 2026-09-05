import type { Metadata } from "next";
import Link from "next/link";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { CareerPrioritiesLink } from "@/components/CareerPrioritiesLink";
import { CareerAgentsLink } from "@/components/CareerAgentsLink";
import { ConsultationTemplate } from "@/components/ConsultationTemplate";
import { agentFocusOptions } from "@/data/affiliateLinks";

export const metadata: Metadata = {
  title: "半導体転職の相談準備",
  description: "半導体業界への転職相談前に、職務経歴書で強調する実績、狙う職種、年収レンジ、次の準備論点を整理します。",
  alternates: { canonical: "/career-consultation" },
};

const consultationTopics = [
  {
    label: "Route",
    title: "今狙う職種",
    body: "品質、プロセス、設備、装置、FAEのどこに寄せるか。",
  },
  {
    label: "Proof",
    title: "職務経歴書の見せ方",
    body: "改善前後、効果額、停止時間、再発防止をどう書くか。",
  },
  {
    label: "Reward",
    title: "年収レンジ",
    body: "求人票の給与内訳と、希望条件をどう確認するか。",
  },
  {
    label: "Next",
    title: "30日で積む経験",
    body: "応募前に増やす実績、学習、英語準備を決める。",
  },
];

export default function CareerConsultationPage() {
  return (
    <main className="page">
      <section className="consultation-hero">
        <p className="eyebrow">転職を考える前の次の一歩</p>
        <h1>相談する前に、論点を4つだけ揃える。</h1>
        <p>
          職種、実績、希望条件、準備期間を箇条書きにすると、相談したいことを伝えやすくなります。
        </p>
        <div className="actions">
          <CareerCompassLink className="button primary" ctaLocation="career_consultation_hero" ctaVariant="consultation_prep" sourcePage="/career-consultation">
            経験と近い職種を整理する
          </CareerCompassLink>
          <Link className="button ghost" href="/companies">
            企業を見直す
          </Link>
        </div>
      </section>

      <section className="consultation-grid" aria-label="相談前に整理する論点">
        {consultationTopics.map((topic) => (
          <div className="consultation-card" key={topic.label}>
            <span>{topic.label}</span>
            <h2>{topic.title}</h2>
            <p>{topic.body}</p>
          </div>
        ))}
      </section>

      <section className="section" aria-labelledby="consultation-template-title">
        <h2 id="consultation-template-title">相談に持っていくメモを作る</h2>
        <ConsultationTemplate />
      </section>

      <section className="section" aria-labelledby="consultation-agents-title">
        <h2 id="consultation-agents-title">メモができたら、相談したい内容で相手を探す</h2>
        <p>経験の伝え方、英語を使う仕事、専門性や待遇。確認したい論点に合わせて、相談先の特徴と利用経験を比較できます。</p>
        <CareerAgentsLink className="button secondary" ctaLocation="consultation_after_template">相談先を比較する</CareerAgentsLink>
        <ul className="source-list">
          {agentFocusOptions.map((option) => (
            <li key={option.id}>
              <CareerAgentsLink className="text-link" focus={option.id} ctaLocation="consultation_theme">{option.label}</CareerAgentsLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="cta-panel" aria-labelledby="career-priorities-title">
        <p className="section-label">希望条件も、相談前に整理する</p>
        <h2 id="career-priorities-title">勤務地・仕事内容・待遇。今回、大切にしたいことは？</h2>
        <p>転職の軸ノートで、変えたいこと・残したいことから仮の優先順位を整理し、求人票や面接で確認したい質問をメモにできます。「まだ迷う」のままでも大丈夫です。</p>
        <div className="cta-actions">
          <CareerPrioritiesLink
            className="button primary"
            ctaLocation="consultation_after_topics"
          >
            転職の軸ノートで整理する
          </CareerPrioritiesLink>
        </div>
        <p className="disclosure">目安3〜5分・ログイン不要。回答は保存されません。完成したノートをコピーして、相談に使えます。</p>
      </section>
    </main>
  );
}
