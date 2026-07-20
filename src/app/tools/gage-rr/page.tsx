import type { Metadata } from "next";
import Link from "next/link";
import { GageRrLearningTool } from "@/components/GageRrLearningTool";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata:Metadata={title:"Gage R&R 学習ツール｜%GRR・ndcを動かして理解",description:"部品差、繰返し性、再現性、測定者との交互作用を動かし、%GRRとndcの意味を学べる無料の測定システム解析ツールです。",alternates:{canonical:"/tools/gage-rr"}};

export default function GageRrPage(){return <main className="grr-page">
  <StructuredData data={{"@context":"https://schema.org","@type":"WebApplication",name:"Gage R&R 学習ツール",url:`${siteUrl}/tools/gage-rr`,applicationCategory:"EducationalApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"JPY"},inLanguage:"ja"}}/>
  <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>Gage R&amp;R</span></nav>
  <header className="grr-hero"><div><p className="section-label">MEASUREMENT SYSTEM ANALYSIS</p><h1>Gage R&amp;R 学習ツール</h1><p>測定値のばらつきを、部品の差と測定システムの誤差へ分けて考えます。</p></div><p><strong>交差型・ANOVA法</strong><span>10部品 × 3測定者 × 2反復</span></p></header>
  <GageRrLearningTool/>
  <article className="grr-document"><header><p className="section-label">WHAT THE NUMBERS MEAN</p><h2>数値より先に、何を分けているかを見る</h2><p>Gage R&amp;Rは、測定器だけを採点するものではありません。測定者、治具、保持方法、手順、環境を含む測定システムの変動を、部品間の変動と分けて確認します。</p></header><div><section><h3>Repeatability</h3><p>同じ測定者が同じ部品を繰り返した時の散らばりです。位置決め、測定力、分解能、試料状態なども影響します。</p></section><section><h3>Reproducibility</h3><p>測定者が変わることで生じる差です。このツールでは、測定者の一定差と部品×測定者の交互作用を含めます。</p></section><section><h3>Part-to-Part</h3><p>部品そのものの違いです。調査部品の範囲が狭すぎると、同じ測定誤差でも%GRRが大きく見えます。</p></section></div></article>
  <section className="grr-method"><div><p className="section-label">METHOD &amp; LIMITS</p><h2>6σのStudy Variationで比較する学習モデル</h2><p>%Study Varは各標準偏差を全変動の標準偏差で割った比、%Contributionは各分散成分を全分散で割った比です。ndcは部品間標準偏差とGage標準偏差の比から、識別できるカテゴリ数の目安を示します。</p></div><aside><strong>実務の承認判定には使わないでください</strong><p>偏り、直線性、長期安定性はこの初期版の対象外です。顧客・社内のMSA手順を優先し、代表部品とランダム化した調査で確認してください。</p></aside><footer>計算定義の参考: <a href="https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/how-to/gage-study/crossed-gage-r-r-study/methods-and-formulas/gage-r-r-table/" rel="noreferrer" target="_blank">Minitab Crossed Gage R&amp;R methods</a>・<a href="https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm" rel="noreferrer" target="_blank">NIST Gauge R&amp;R studies</a></footer></section>
  <nav className="tool-related-links" aria-label="関連ツール"><span>次の判断</span><Link href="/tools/control-chart">工程が安定しているか確認 →</Link><Link href="/tools/cpk">工程能力を確認 →</Link></nav>
</main>}
