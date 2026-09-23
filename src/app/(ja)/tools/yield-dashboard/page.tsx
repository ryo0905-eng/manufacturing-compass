import { StatisticsCourseCta } from "@/components/StatisticsCourseCta";
import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { YieldInvestigationDashboard } from "@/components/YieldInvestigationDashboard";
import styles from "@/components/YieldInvestigationDashboard.module.css";
import { siteUrl } from "@/lib/format";

const title = "製造業ダッシュボードの実例｜歩留まりの原因分析を体験";
const description = "架空の半導体工場で、歩留まり低下を不良項目・製品・装置・ロット・工程条件・変更履歴へ掘り下げ、確認実験まで体験できる学習用ダッシュボードです。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tools/yield-dashboard" },
  openGraph: { title, description, url: `${siteUrl}/tools/yield-dashboard`, type: "website" },
};

const faqs = [
  { question: "このダッシュボードは実データを使っていますか？", answer: "いいえ。再現可能な固定の架空データだけを使う学習用デモです。実在の会社、工場、製品、装置とは関係ありません。" },
  { question: "不良数は重複して数えていますか？", answer: "このデモの4つの不良項目は排他的分類です。各ロットで、良品数と4分類の不良数の合計が総検査数に一致します。" },
  { question: "グラフで偏りを見つければ原因と判断できますか？", answer: "判断できません。時系列・製品・装置・条件変更の一致は原因候補です。このデモでも、通常の観察データと、条件を戻した確認実験を分けて表示しています。" },
  { question: "Power BIやTableauのテンプレートを配布していますか？", answer: "配布していません。このページは、製造業向けBIの画面要件とデータのつなぎ方を具体化するためのブラウザ体験です。" },
  { question: "自社データで歩留まりを計算できますか？", answer: "このページではできません。日別の良品・不良品数を使う既存の歩留まり解析ツールで、ブラウザ内CSV解析を試せます。" },
] as const;

export default function YieldDashboardPage() {
  return <main className="yield-analysis-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `${siteUrl}/tools/yield-dashboard`, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "実務ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "歩留まり原因調査ダッシュボード", item: `${siteUrl}/tools/yield-dashboard` }] }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><Link href="/tools">実務ツール</Link><span aria-hidden="true">/</span><span>歩留まり原因調査</span></nav>
    <header className={styles.pageIntro}>
      <div><p className="section-label">MANUFACTURING BI EXPERIENCE</p><h1>製造業ダッシュボードの実例｜歩留まりの原因分析を体験</h1><p>ある時期から低下した歩留まりを、気になった数字から不良・製品・装置・ロット・工程条件へ掘り下げます。ガイド付き調査は約5分、自由探索は同じデータを好きな順で確認できます。</p></div>
      <aside><strong>架空データによる学習用デモ</strong><span>ログイン不要・入力データなし</span><span>PC推奨 / スマートフォン対応</span></aside>
    </header>

    <YieldInvestigationDashboard />

    <article className={styles.seoContent}>
      <section aria-labelledby="can-do-title"><header><p className="section-label">WHAT THIS DEMO SHOWS</p><h2 id="can-do-title">このダッシュボードでできること</h2><p>KPIを眺めるだけでなく、同じロットデータを起点に「いつ・何が・どこで」を絞り、工程条件と履歴へ接続できます。</p></header><div className={styles.contentGrid}><article><h3>製造現場の要件整理</h3><p>どのグラフをクリックすると、どの表まで連動すべきかを体験できます。BI開発担当者へ伝える画面要件のたたき台になります。</p></article><article><h3>歩留まり分析の学習</h3><p>総検査数を分母にした歩留まり、不良内訳、層別、正常群との条件比較を一つの流れで確認できます。</p></article><article><h3>データ準備の理解</h3><p>検査結果だけでは調査が止まります。ロットIDを介して製品、装置、工程条件、変更履歴を結ぶ必要性が分かります。</p></article></div></section>

      <section aria-labelledby="flow-title"><header><p className="section-label">INVESTIGATION FLOW</p><h2 id="flow-title">原因調査の流れと、各チャートが答える問い</h2></header><ol className={styles.flowList}><li>歩留まり推移で「いつから変わったか」を探す</li><li>不良内訳で「どの不良が増えたか」を見る</li><li>製品・装置比較で「どこに偏るか」を絞る</li><li>ロット一覧で「比較すべき正常群・異常群」を作る</li><li>工程条件と変更履歴で「何が違ったか」を照合する</li><li>別の確認実験で「原因候補を再現・反証できるか」を確かめる</li></ol></section>

      <section id="dashboard-design-guide" aria-labelledby="design-title"><header><p className="section-label">HOW TO BUILD IT</p><h2 id="design-title">このダッシュボードを作るには</h2><p>KPI表示画面は現状把握に向きます。原因調査画面には、同じ対象へ絞り込めるキー、比較群を保持する仕組み、履歴へたどるデータモデルが必要です。</p></header><table className={styles.dataTable}><tbody><tr><th>検査・不良データ</th><td>ロットID、検査日時、総検査数、良品数、不良項目、不良数。分類が排他的か重複可能かも定義します。</td></tr><tr><th>製造実績</th><td>ロットID、製品、工程、装置、処理開始・終了日時。装置別比較では不良数だけでなく処理数を分母として保持します。</td></tr><tr><th>工程条件</th><td>ロットIDまたは処理履歴ID、レシピ版、圧力、電力、温度、流量など。単位と有効期間を揃えます。</td></tr><tr><th>保全・変更履歴</th><td>装置ID、変更日時、変更種別、変更前後、作業記録。処理時刻に対してどの設定が有効だったか判定できる形にします。</td></tr><tr><th>確認実験</th><td>実験ID、仮説、固定条件、変更条件、実施順、結果。量産の観察データと区別するフラグを持たせます。</td></tr></tbody></table><p className={styles.warning}><strong>結合粒度に注意：</strong>1ロットに複数の不良行と複数の工程履歴をそのまま結合すると、行が掛け算で増えて検査数が重複します。先にロット粒度へ集約するか、検査・不良・工程履歴を別のファクトとして扱い、ロットIDや処理履歴IDで関係付けます。更新時刻、欠損、単位、装置名の表記揺れも、BI画面を作る前に管理する必要があります。</p></section>

      <section aria-labelledby="faq-title"><header><p className="section-label">FAQ</p><h2 id="faq-title">歩留まりダッシュボードのFAQ</h2></header><div className={styles.faq}>{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

      <section aria-labelledby="related-title"><header><p className="section-label">NEXT LEARNING</p><h2 id="related-title">関連する品質管理・データ活用</h2><p>今回のデモは画面要件と調査の流れを学ぶものです。手元の集計、工程の安定性、能力、改善実験は専用ツールで確認できます。</p></header><nav className={styles.related} aria-label="関連ページ"><Link href="/tools/defect-pareto">手元の不良分類からパレート図を作る</Link><Link href="/tools/yield-analysis">手元のデータで歩留まりを解析</Link><Link href="/tools/control-chart">管理図で時間変化を学ぶ</Link><Link href="/tools/cpk">Cp・Cpkで工程能力を確認</Link><Link href="/tools/doe">確認実験の設計を学ぶ</Link><Link href="/guides/six-sigma">DMAICで改善の流れを整理</Link></nav></section>
    </article>
  <StatisticsCourseCta sourcePage="/tools/yield-dashboard" />
  </main>;
}
