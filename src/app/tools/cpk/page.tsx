import type { Metadata } from "next";
import Link from "next/link";
import { CpkToolExperience } from "@/components/CpkToolExperience";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Cp・Cpk計算ツール｜Pp・Ppk、ヒストグラム対応",
  description: "測定データからPp・Ppkとヒストグラムを計算・表示。短期標準偏差を入力したCp・Cpk計算にも対応。登録不要、データ保存なし。",
  alternates: { canonical: "/tools/cpk" },
  openGraph: {
    title: "Cp・Cpk計算ツール｜Manufacturing Compass",
    description: "Excelの測定データを貼り付けて、工程能力と分布をブラウザ内で確認できます。",
    url: `${siteUrl}/tools/cpk`,
  },
};

const faq = [
  { question: "生データの結果がPp・Ppkになるのはなぜですか？", answer: "入力した全データの標本標準偏差は、長期的な変動を含む全体標準偏差です。そのため、このツールでは生データの結果をPp・Ppkとして表示します。" },
  { question: "片側規格でも計算できますか？", answer: "はい。USLのみの場合はPpuまたはCpu、LSLのみの場合はPplまたはCplを表示します。両側規格が必要なPpまたはCpは表示しません。" },
  { question: "Cpkが1.33以上なら工程に問題はありませんか？", answer: "1.33は一般的な目安の一つであり、品質を保証する境界ではありません。顧客要求や社内基準を優先し、管理図、測定システム、分布、サンプリング方法も確認してください。" },
] as const;

export default function CpkToolPage() {
  return (
    <main className="cpk-page cpk-page--analysis">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Cp・Cpk計算ツール", url: `${siteUrl}/tools/cpk`, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>Cp・Cpk計算</span></nav>
      <header className="cpk-compact-hero">
        <div><h1>Cp・Cpk計算ツール</h1><p>測定データと規格値から工程能力と分布を確認できます。</p></div>
        <p className="privacy-note"><strong>登録不要・ブラウザ内で計算</strong><span>入力データはサーバー、Analytics、外部APIへ送信しません。</span></p>
      </header>

      <CpkToolExperience />

      <nav className="tool-related-links" aria-label="関連する実務学習ツール"><span>関連ツール</span><Link href="/tools/doe">実験計画法の主効果と交互作用を動かして学ぶ <span aria-hidden="true">→</span></Link></nav>

      <article className="capability-document">
        <header><h2>指標の見方</h2><p>工程能力指数は、使う標準偏差と規格の種類を確認して読みます。</p></header>
        <section><h3>Cp・CpkとPp・Ppkの違い</h3><p>Cp・Cpkは、合理的なサブグループ内の変動などから求めた短期標準偏差を使用します。Pp・Ppkは、入力した全データの標本標準偏差を使用します。このツールの生データ入力は時系列やサブグループを仮定できないため、Pp・Ppkとして表示します。</p><p>平均・短期標準偏差入力では、利用者が工程に適した方法で求めた短期標準偏差を入力する前提で、Cp・Cpkを表示します。</p></section>
        <section><h3>1.33という目安の意味</h3><p>1.33は工程能力を確認するときに一般的に使われる目安の一つですが、合否や品質保証を意味しません。製品、工程、管理段階によって必要な水準は異なるため、顧客要求や社内基準を優先してください。</p></section>
        <section><h3>片側規格の場合</h3><p>上限規格だけがある場合はPpuまたはCpu、下限規格だけがある場合はPplまたはCplを確認します。規格幅の両端を必要とするPpまたはCpは定義できないため、ツールでは「—」と表示します。</p></section>
        <section><h3>工程能力と管理状態は別に確認する</h3><p>CpkやPpkだけでは、工程が統計的管理状態にあるか判断できません。時間順の変化を管理図で確認し、特殊原因、測定システム、分布の形、材料ロット、サンプリング方法も併せて評価してください。正規性を確認せず、指数から実際の規格外率を断定することも避ける必要があります。</p></section>
        <section><h3>Excelで計算する場合との違い</h3><p>Excelでも同じ式で計算できます。このツールは、列データを貼り付けるだけで入力件数、分布、規格中心からのずれ、確認候補を一度に整理するためのものです。元データは保存せず、入力内容も自動で整形しません。</p></section>
        <section className="capability-faq"><h3>よくある質問</h3>{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
      </article>
    </main>
  );
}
