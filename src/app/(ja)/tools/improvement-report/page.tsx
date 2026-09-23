import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { ProcessComparisonTool } from "@/components/ProcessComparisonTool";
import { improvementReportMeta as meta } from "@/data/improvement-report";
import { siteUrl } from "@/lib/format";
export const metadata: Metadata = {
  title: meta.title, description: meta.description, alternates: { canonical: meta.route }, robots: { index: true, follow: true },
  openGraph: { title: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, type: "website", locale: "ja_JP", images: [{ url: "/images/improvement-report-example.png", alt: "架空データによる工程改善レポートの完成見本" }] },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: ["/images/improvement-report-example.png"] },
};
export default function ImprovementReportPage() {
  return <main className="mini-app-page" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, inLanguage: "ja", operatingSystem: "Web", applicationCategory: "BusinessApplication", dateModified: meta.updatedAt, offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "工程改善レポート", item: `${siteUrl}${meta.route}` }] }} />
    <nav aria-label="パンくず"><Link href="/tools">計算・学習ツール</Link> / 工程改善レポート</nav>
    <header className="mini-app-hero"><div><h1>工程改善レポート</h1><p>変更前後の測定値から、数値・分布図・考察を社内報告にまとめます。登録不要、入力は端末内で処理します。</p></div></header>
    <section aria-label="完成レポートの見本"><h2>この1枚を、あなたのデータで</h2><p>以下は教材用の架空例です。自分のデータでも、比較から印刷・PDF保存まで同じ画面で進められます。</p>
      {/* Static, public sample only. User report images never go through image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/improvement-report-example.png" alt="架空の膜厚データで作成した工程改善レポート。変更前後の数値、分布、自動の観察文、本人の記述を分けて表示。" style={{ width: "100%", maxHeight: 460, objectFit: "contain" }} />
    </section>
    <ProcessComparisonTool reportMode />
    <section className="capability-document"><h2>計算方法と利用範囲</h2><p>全データの標本標準偏差（n−1）を使用し、Pp=(USL−LSL)/(6s)、Ppu=(USL−平均)/(3s)、Ppl=(平均−LSL)/(3s)、Ppk=min(Ppu,Ppl)で計算します。観測データ内の規格内率、平均差B−Aを表示します。</p><p>工程の安定性・正規性を判定していません。自動の観察文は記述統計で、改善効果や因果関係を確定するものではありません。社内の検討用であり、顧客向けの正式帳票・品質保証書ではありません。</p><p>印刷・PDFはブラウザの印刷機能を使います。入力ファイルには測定データと本人の記述が含まれます。保存先と共有範囲は利用者が管理してください。ファイルや報告内容をサーバー・アクセス解析へ送信しません。</p><p>出典：<a href="https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm">NIST：工程能力の定義と前提</a> / <a href="https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/all-statistics-and-graphs/overall-capability/">Minitab：全体変動のPp・Ppk・片側指標</a>（確認日：2026-09-23）。</p><p>計算仕様更新日：<time dateTime={meta.updatedAt}>{meta.updatedAt}</time>。<Link href="/tools/cpk">工程能力指数の定義・出典</Link> / <Link href="/tools/process-comparison">工程比較の計算・出典</Link> / <Link href="/privacy">プライバシー</Link></p></section>
  </main>;
}
