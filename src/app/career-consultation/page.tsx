import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "半導体転職の相談準備",
  description: "半導体業界への転職相談前に、職務経歴書で強調する実績、狙う職種、年収レンジ、次の準備論点を整理します。",
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
    body: "現年収と市場レンジの差分をどう埋めるか。",
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
        <p className="eyebrow">Career next step</p>
        <h1>相談する前に、論点を4つだけ揃える。</h1>
        <p>
          診断結果をそのまま持ち込むより、職種、実績、年収、準備期間に分けると話が早くなります。
        </p>
        <div className="actions">
          <Link className="button primary" href="/career-compass">
            診断から始める
          </Link>
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

      <section className="consultation-note">
        <span>相談メモ</span>
        <b>「半導体で今狙える職種」と「半年後に広げる職種」を分けて相談する。</b>
        <p>本ページには今後、提携サービスへの広告リンクが入る場合があります。</p>
      </section>
    </main>
  );
}
