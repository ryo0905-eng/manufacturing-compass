import type { Metadata } from "next";
import Link from "next/link";
import { GageRrLearningExperience } from "@/components/GageRrLearningExperience";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata:Metadata={title:"Gage R&R 学習ツール｜%GRR・ndcを動かして理解",description:"部品差、繰返し性、再現性、測定者との交互作用を動かし、%GRRとndcの意味を学べる無料の測定システム解析ツールです。",alternates:{canonical:"/tools/gage-rr"}};

export default function GageRrPage(){return <main className="grr-page">
  <StructuredData data={{"@context":"https://schema.org","@type":"WebApplication",name:"Gage R&R 学習ツール",url:`${siteUrl}/tools/gage-rr`,applicationCategory:"EducationalApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"JPY"},inLanguage:"ja"}}/>
  <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>Gage R&amp;R</span></nav>
  <header className="grr-hero"><div><p className="section-label">MEASUREMENT SYSTEM ANALYSIS</p><h1>Gage R&amp;R 学習ツール</h1><p>測定値のばらつきを、部品の差と測定システムの誤差へ分けて考えます。</p></div><p><strong>交差型・ANOVA法</strong><span>10部品 × 3測定者 × 2反復</span></p></header>
  <GageRrLearningExperience/>
  <article className="grr-document"><header><p className="section-label">WHAT THE NUMBERS MEAN</p><h2>数値より先に、何を分けているかを見る</h2><p>Gage R&amp;Rは、測定器だけを採点するものではありません。測定者、治具、保持方法、手順、環境を含む測定システムの変動を、部品間の変動と分けて確認します。</p></header><div><section><h3>Repeatability</h3><p>同じ測定者が同じ部品を繰り返した時の散らばりです。位置決め、測定力、分解能、試料状態なども影響します。</p></section><section><h3>Reproducibility</h3><p>測定者が変わることで生じる差です。このツールでは、測定者の一定差と部品×測定者の交互作用を含めます。</p></section><section><h3>Part-to-Part</h3><p>部品そのものの違いです。調査部品の範囲が狭すぎると、同じ測定誤差でも%GRRが大きく見えます。</p></section></div></article>
  <section className="grr-process"><header><p className="section-label">PRACTICAL PROCESS</p><h2>一般的なGage R&amp;Rの進め方</h2><p>解析から始めず、何を判断するための測定かを決め、実際の測定条件を再現して調査します。</p></header><ol><li><span>01</span><div><strong>目的と要求を決める</strong><p>良否判定、工程管理、改善前後の比較など、測定値を何に使うか明確にします。</p></div></li><li><span>02</span><div><strong>代表部品を選ぶ</strong><p>似た部品だけでなく、実工程で生じる範囲をカバーする部品を選びます。</p></div></li><li><span>03</span><div><strong>普段の条件で測る</strong><p>実際の測定者、測定器、治具、手順、環境を使い、全員が全ての部品を反復測定します。</p></div></li><li><span>04</span><div><strong>順番をランダム化する</strong><p>部品番号や前回値を意識して、測定値を無意識に合わせる影響を減らします。</p></div></li><li><span>05</span><div><strong>グラフと分散成分を見る</strong><p>繰返し、測定者差、交互作用、部品差を確認してから%GRRとndcを読みます。</p></div></li><li><span>06</span><div><strong>改善して再調査する</strong><p>治具や手順を変更したら、改善後の条件で新しい調査を実施します。</p></div></li></ol></section>
  <section className="grr-method"><div><p className="section-label">METHOD &amp; LIMITS</p><h2>6σのStudy Variationで比較する学習モデル</h2><p>%Study Varは各標準偏差を全変動の標準偏差で割った比、%Contributionは各分散成分を全分散で割った比です。ndcは部品間標準偏差とGage標準偏差の比から、識別できるカテゴリ数の目安を示します。</p></div><aside><strong>実務の承認判定には使わないでください</strong><p>偏り、直線性、長期安定性はこの初期版の対象外です。顧客・社内のMSA手順を優先し、代表部品とランダム化した調査で確認してください。</p></aside><footer>計算定義の参考: <a href="https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/how-to/gage-study/crossed-gage-r-r-study/methods-and-formulas/gage-r-r-table/" rel="noreferrer" target="_blank">Minitab Crossed Gage R&amp;R methods</a>・<a href="https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm" rel="noreferrer" target="_blank">NIST Gauge R&amp;R studies</a></footer></section>
  <nav className="tool-related-links" aria-label="関連ツール"><span>次の判断</span><Link href="/tools/control-chart">工程が安定しているか確認 →</Link><Link href="/tools/cpk">工程能力を確認 →</Link></nav>
</main>}
