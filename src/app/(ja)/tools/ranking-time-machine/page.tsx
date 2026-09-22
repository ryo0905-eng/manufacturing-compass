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
      <p className={styles.eyebrow}>ランキング・タイムマシン · 実データ · 登録不要</p>
      <h1>半導体企業の時価総額ランキング推移</h1>
      <p>2015〜2025年の年末時価総額から、主要20社の順位の入れ替わりをたどります。「再生」で年を進め、気になる企業を選んで過去の順位を確かめてください。</p>
      <Notice>選定20社内の比較です。製造装置企業5社を含み、各年の世界全体の上位10社を再現するものではありません。数値は企業全体の時価総額です。</Notice>
    </header>
    <RankingTimeMachine companies={companies} snapshots={rankingTimeMachineSnapshots} />
    <noscript><p>再生・年の移動・企業選択にはJavaScriptが必要です。2015年のランキング表、以下の説明と出典はそのまま読めます。</p></noscript>
    <article className={styles.document}>
      <section aria-labelledby="ranking-reading"><h2 id="ranking-reading">順位が入れ替わると、何が分かる？</h2>
        <p>時価総額は、株価と発行済株式数から見た企業の市場での評価額です。半導体企業のランキング推移を見ると、選定企業間で評価額の大小がどう変化したかを確認できます。</p>
        <p>例えば2015年末にはIntelがNVIDIAを上回っていましたが、2020年末には逆転しています。ただし、年末の2点を比較した結果であり、逆転した日付まではこのチャートでは分かりません。</p>
        <p>時価総額と売上高は異なる指標です。企業全体への期待や事業構成、買収、株式数、為替などの変化も含むため、順位上昇だけから半導体事業の成長や技術力、働きやすさは判断できません。</p>
      </section>
      <section aria-labelledby="ranking-scope"><h2 id="ranking-scope">比較する20社と対象範囲</h2>
        <p>半導体の設計・製造と装置の主要企業から、対象期間の年末履歴を確認できた20社を選定しました。現在のランキング上位20社や、当時の全上場企業を網羅した一覧ではありません。</p>
        <p>Armなど期間中に非上場期間のある企業や、買収により独立した上場会社でなくなった企業は対象外です。そのため、昔の世界順位や業界全体の勢力図を完全に復元したものではありません。</p>
        <details><summary>対象20社と各社のデータ出典</summary><ul>{companies.map(company => <li key={company.id}><a href={company.sourceUrl}>{company.name}</a> · {company.category}</li>)}</ul></details>
        <p>Broadcom系列の2015年はAvago Technologiesとして表示します。2016年の統合前に存在した旧Broadcom Corporationとは別の系列で、両社の過去数値を合算していません。<a href={meta.broadcomSourceUrl}>企業統合の公式資料</a>。</p>
        <p>Samsung ElectronicsやBroadcomなど、半導体以外の事業を持つ企業も含みます。時価総額を半導体部門だけに分割する推計は行っていません。</p>
      </section>
      <section aria-labelledby="ranking-sources"><h2 id="ranking-sources">データソース・集計方法・注意事項</h2>
        <dl className={styles.definition}>
          <dt>指標</dt><dd>各社の時価総額。企業全体の株式市場での評価額。</dd>
          <dt>対象期間</dt><dd>2015〜2025年の各年末。2026年途中の値は含みません。</dd>
          <dt>通貨・単位</dt><dd>十億米ドル（1十億米ドル＝10億米ドル）。名目値で、物価調整はしていません。</dd>
          <dt>データソース</dt><dd><a href={meta.sourceUrl}>CompaniesMarketCap</a>の各社「End of year Market Cap」。各企業へのリンクは上の対象一覧に掲載。</dd>
          <dt>換算方法</dt><dd>出典の米ドル表示を使用。兆ドル表記を十億ドルへ単位変換する以外に、独自の為替換算・補間・再計算は行っていません。</dd>
          <dt>順位</dt><dd>対象20社内で時価総額の降順。同じ丸め値は同順位とし、その次は人数分だけ順位が進みます。表示順のみ企業IDで固定します。</dd>
          <dt>確認日・更新日</dt><dd><time dateTime={meta.checkedAt}>{meta.checkedAt}</time>。市場データの対象年とは異なります。</dd>
        </dl>
        <p>出典に表示された丸め値を掲載しています。取引市場、現地株式・ADR（米国預託証券）、株式数、為替や改訂によって他のサービスと差が出ることがあります。全市場で同一時刻に観測された値とは限らず、出典の細かな換算・調整手順を本ページで独立に再現したものではありません。</p>
        <p>CompaniesMarketCapの年末データをもとに、Manufacturing Compassが比較対象の選定・可視化・解説を作成しました。数値は将来の株価や採用を予測するものではありません。</p>
      </section>
    </article>
  </main>;
}
