import { referenceCompanies } from '@/data/ranking-reference';
import type { Metadata } from 'next';
import Link from 'next/link';
import { StructuredData } from '@/components/StructuredData';
import { Notice } from '@/components/ui/Controls';
import { RankingTimeMachine } from '@/components/ranking-time-machine/RankingTimeMachine';
import { rankingTimeMachineCompanies, rankingTimeMachineSnapshots, rankingTimeMachineMetadata as meta } from '@/data/ranking-time-machine';
import { getCompanyBySlug } from '@/data/companies';
import { siteUrl } from '@/lib/format';
import styles from '@/components/ranking-time-machine/ranking-time-machine.module.css';

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.route },
  robots: { index: true, follow: true },
  openGraph: { title: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, type: 'website', locale: 'ja_JP' },
  twitter: { card: 'summary', title: meta.title, description: meta.description },
};

export default function RankingTimeMachinePage() {
  const companies = rankingTimeMachineCompanies.map(company => ({
    ...company,
    companySlug: company.companySlug && getCompanyBySlug(company.companySlug) ? company.companySlug : undefined,
  }));
  return <main className={styles.page}>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'ja', dateModified: meta.updatedAt, offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' } }} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: '学習ツール', item: `${siteUrl}/tools` },
      { '@type': 'ListItem', position: 3, name: 'ランキング・タイムマシン', item: `${siteUrl}${meta.route}` },
    ] }} />
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><Link href="/tools">学習ツール</Link><span aria-hidden="true">/</span><span>ランキング・タイムマシン</span></nav>
    <header className={styles.hero}>
      <h1>半導体企業の時価総額ランキング推移</h1>
      <p>半導体20社の推移を再生。GAFAM・トヨタとの比較や、製造装置5社への切り替えもできます。</p>
    </header>
    <RankingTimeMachine companies={companies} snapshots={rankingTimeMachineSnapshots} />
    <noscript><p>再生・年の移動・企業選択にはJavaScriptが必要です。2010年のランキング表、以下の説明と出典はそのまま読めます。</p></noscript>
    <article className={styles.document}>
      <section aria-labelledby="ranking-reading"><h2 id="ranking-reading">順位が入れ替わると、何が分かる？</h2>
        <p>時価総額は、株価と発行済株式数から見た企業の市場での評価額です。半導体企業のランキング推移を見ると、選定企業間で評価額の大小がどう変化したかを確認できます。</p>
        <p>例えば2015年末にはIntelがNVIDIAを上回っていましたが、2020年末には逆転しています。ただし、年末の2点を比較した結果であり、逆転した日付まではこのチャートでは分かりません。</p>
        <p>時価総額と売上高は異なる指標です。企業全体への期待や事業構成、買収、株式数、為替などの変化も含むため、順位上昇だけから半導体事業の成長や技術力、働きやすさは判断できません。</p>
      </section>
      <section aria-labelledby="ranking-scope"><h2 id="ranking-scope">比較モードと対象範囲</h2>
        <Notice>各モードで選定した企業内の比較です。各年の世界全体の上位10社を再現するものではありません。数値は企業全体の時価総額で、半導体事業の売上・生産量・投資収益を示すものではありません。</Notice>
        <ul><li>半導体20社：装置5社を含む20社、2010〜2025年。</li><li>世界の大企業と比較：半導体・装置20社とGAFAM・トヨタの26社、2014〜2025年。</li><li>製造装置5社：ASML、Applied Materials、Lam Research、東京エレクトロン、KLA、2010〜2025年。</li></ul>
        <p>他業界比較は、同じ出典で全26社の履歴が揃う2014年から表示します。比較企業は企業研究の参考対象で、各業界全体を代表する指数ではありません。</p>
        <p>半導体の設計・製造と装置の主要企業から、対象期間の年末履歴を確認できた20社を選定しました。現在のランキング上位20社や、当時の全上場企業を網羅した一覧ではありません。</p>
        <p>Armなど期間中に非上場期間のある企業や、買収により独立した上場会社でなくなった企業は対象外です。そのため、昔の世界順位や業界全体の勢力図を完全に復元したものではありません。</p>
        <details><summary>対象20社と各社のデータ出典</summary><ul>{companies.map(company => <li key={company.id}><a href={company.sourceUrl}>{company.name}</a> · {company.category}</li>)}</ul></details>
        <details><summary>比較対象6社と各社のデータ出典</summary><ul>{referenceCompanies.map(company => <li key={company.id}><a href={company.sourceUrl}>{company.name}</a> · 確認日 {company.checkedAt}</li>)}</ul></details>
        <p>Alphabet（Google）は企業全体の系列を1社として扱い、GOOGとGOOGLの値を足していません。Alphabet（Google）・Meta（旧Facebook）の名称は系列を識別する表記で、当時の社名やロゴの再現ではありません。</p>
        <p>Broadcom系列の2010〜2015年はAvago Technologiesとして表示します。2016年の統合前に存在した旧Broadcom Corporationとは別の系列で、両社の過去数値を合算していません。<a href={meta.broadcomSourceUrl}>企業統合の公式資料</a>。</p>
        <p>Samsung ElectronicsやBroadcomなど、半導体以外の事業を持つ企業も含みます。時価総額を半導体部門だけに分割する推計は行っていません。</p>
      </section>
      <section aria-labelledby="ranking-sources"><h2 id="ranking-sources">データソース・集計方法・注意事項</h2>
        <dl className={styles.definition}>
          <dt>指標</dt><dd>各社の時価総額。企業全体の株式市場での評価額。</dd>
          <dt>対象期間</dt><dd>半導体・装置は2010〜2025年、他業界比較は2014〜2025年の各年末。2026年途中の値は含みません。</dd>
          <dt>通貨・単位</dt><dd>十億米ドル（1十億米ドル＝10億米ドル）。名目値で、物価調整はしていません。</dd>
          <dt>データソース</dt><dd><a href={meta.sourceUrl}>CompaniesMarketCap</a>の各社「End of year Market Cap」。各企業へのリンクは上の対象一覧に掲載。</dd>
          <dt>換算方法</dt><dd>出典の米ドル表示を使用。兆ドル表記を十億ドルへ単位変換する以外に、独自の為替換算・補間・再計算は行っていません。</dd>
          <dt>順位</dt><dd>各モードの対象20社・26社・5社内で時価総額の降順。同じ丸め値は同順位とし、その次は人数分だけ順位が進みます。表示順のみ企業IDで固定します。</dd>
          <dt>確認日・更新日</dt><dd><time dateTime={meta.checkedAt}>{meta.checkedAt}</time>。市場データの対象年とは異なります。</dd>
        </dl>
        <p>出典に表示された丸め値を掲載しています。取引市場、現地株式・ADR（米国預託証券）、株式数、為替や改訂によって他のサービスと差が出ることがあります。全市場で同一時刻に観測された値とは限らず、出典の細かな換算・調整手順を本ページで独立に再現したものではありません。</p>
        <p>CompaniesMarketCapの年末データをもとに、Manufacturing Compassが比較対象の選定・可視化・解説を作成しました。数値は将来の株価や採用を予測するものではありません。</p>
        <p>ロゴは企業識別のための参考表示です。各年当時のロゴを再現したものではありません。画像は各社の出典ページ経由で取得した<a href="https://companieslogo.com/">CompaniesLogo</a>由来のもので、権利は各権利者に帰属します。2010〜2015年のAvagoには現在のBroadcomロゴを表示していません。</p>
      </section>
    </article>
  </main>;
}
