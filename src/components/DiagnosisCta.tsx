import Link from "next/link";

type DiagnosisCtaProps = {
  title?: string;
  body?: string;
};

export function DiagnosisCta({
  title = "働きながら積んだ経験を、別の求人と比べてみる",
  body = "12問に答えると、経験に近い半導体職種と、今日15分でできる準備が分かります。",
}: DiagnosisCtaProps) {
  return (
    <aside className="diagnosis-cta">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
        <small>約3分・登録不要。氏名や連絡先は入力しません。</small>
      </div>
      <Link className="button primary" href="/career-compass">12問の診断を始める</Link>
    </aside>
  );
}
