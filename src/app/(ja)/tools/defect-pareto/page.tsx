import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { DefectPareto } from "@/components/DefectPareto";
import { defectPareto as meta } from "@/data/defect-pareto";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: meta.title, description: meta.description,
  alternates: { canonical: meta.route }, robots: { index: true, follow: true },
  openGraph: { title: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, type: "website", locale: "ja_JP" },
  twitter: { card: "summary", title: meta.title, description: meta.description },
};
export default function DefectParetoPage() {
  return <main className="mini-app-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: meta.updatedAt, offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "計算・学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "不良の優先順位ボード", item: `${siteUrl}${meta.route}` }] }} />
    <nav aria-label="パンくず"><Link href="/tools">計算・学習ツール</Link> / 不良の優先順位ボード</nav>
    <header className="mini-app-hero"><div><h1>不良の優先順位ボード</h1><p>どの不良が多い？ 分類と件数から、パレート図と集計表を作ります。調査対象を整理し、コピーや図の保存で持ち帰れます。</p><p>無料・登録不要。架空例でも試せます。</p></div></header>
    <DefectPareto />
    <section className="capability-document" aria-labelledby="pareto-method"><h2 id="pareto-method">パレート図の読み方と集計方法</h2>
      <p>パレート図は分類ごとの件数を多い順に並べる図です。本ツールでは棒を件数、折れ線を累積比率とし、左軸の合計件数と右軸の100%を同じ高さにそろえます。番号に対応する分類は集計表で確認できます。</p>
      <p>構成比 = 分類の件数 ÷ 全分類の合計、累積比率 = その分類までの件数の合計 ÷ 全分類の合計。同数の場合は最初に入力された順に表示します。小数第1位に丸めるため、表示した構成比の合計が100%にならない場合があります。</p>
      <p>同名の分類は合計と行数を確認してからまとめます。空行は除きますが、不正な行を黙って捨てることはありません。引用符によるCSVのエスケープや複数行セルには対応しません。合計0件の比率は算出不可と表示します。</p>
      <p>この図が示すのは入力した不良の内訳であり、検査数に対する不良率や歩留まりではありません。調査期間、検査機会、分類の重複や重大性も確認して、次に調べる対象を考えてください。</p>
      <p>出典：<a href={meta.source}>ASQ — What is a Pareto Chart?</a>。集計・表示手順の確認日：<time dateTime={meta.updatedAt}>{meta.updatedAt}</time>。</p>
    </section>
  </main>;
}
