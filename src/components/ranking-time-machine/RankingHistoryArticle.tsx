import type { Route } from 'next';
import { TrackedInternalLink } from '@/components/TrackedInternalLink';
import { japanHistory, japanHighlights, nvidiaIntelHistory, nvidiaIntelCrossover } from '@/lib/ranking-history';
import { formatMarketCap as fmt, rankChange } from '@/lib/ranking-time-machine';
import styles from './ranking-time-machine.module.css';

function Entry({ mode, year, company, sourceSlug, placement, children }: {
  mode: 'japan' | 'semiconductor'; year: number; company: string; sourceSlug: string; placement: string; children: React.ReactNode;
}) {
  const href = `/tools/ranking-time-machine#mode=${mode}&year=${year}&company=${company}`;
  return <TrackedInternalLink className="button ghost" href={href as Route} eventName="ranking_timemachine_entry_click" eventProperties={{ source_slug: sourceSlug, comparison_mode: mode, year, company, placement, destination: href, ranking_type: 'market_cap', data_kind: 'real' }}>{children}</TrackedInternalLink>;
}

export function RankingHistoryArticle({ kind, sourceSlug }: { kind: 'japan' | 'nvidia-intel'; sourceSlug: string }) {
  if (kind === 'japan') {
    const first = japanHistory[0];
    const last = japanHistory[japanHistory.length - 1];
    return <div className={styles.historyArticle}>
      <Entry mode="japan" year={2010} company="tokyo-electron" sourceSlug={sourceSlug} placement="start">日本企業10社の推移を2010年から動かす →</Entry>
      <h3>2010年から2025年へ：どの企業の順位が変わった？</h3>
      <p>装置・検査、材料、半導体メーカーを含む選定10社の比較です。単位は十億米ドル。2025年末の順位順に掲載しています。</p>
      <div className={styles.historyTableScroll}><table className={styles.table}><caption>2010年末と2025年末の比較（選定10社内）</caption><thead><tr><th scope="col">企業・分類</th><th scope="col">2010年 順位／時価総額</th><th scope="col">2025年 順位／時価総額</th><th scope="col">順位変化</th></tr></thead><tbody>{last.rows.map(row => {
        const before = first.rows.find(item => item.id === row.id)!;
        return <tr key={row.id}><th scope="row">{row.name}<br /><small>{row.category}</small></th><td>{before.rank}位／{fmt(before.valueUsdB)}</td><td>{row.rank}位／{fmt(row.valueUsdB)}</td><td>{rankChange(before.rank, row.rank)}</td></tr>;
      })}</tbody></table></div>
      <h3>年末値で見つかる3つの変化</h3>
      {japanHighlights.map(({ winner, other, snapshot }) => {
        const a = snapshot.rows.find(row => row.id === winner)!;
        const b = snapshot.rows.find(row => row.id === other)!;
        return <section key={winner}><h4>{snapshot.year}年末：{a.name}と{b.name}</h4><p>対象期間の年末値では、{a.name}（{fmt(a.valueUsdB)}）が{b.name}（{fmt(b.valueUsdB)}）を初めて上回りました。年内に逆転した日や、その後も上回り続けたことを示すものではありません。</p><Entry mode="japan" year={snapshot.year} company={winner} sourceSlug={sourceSlug} placement="highlight">{snapshot.year}年の比較を開く →</Entry></section>;
      })}
      <h3>2010〜2025年の年別ランキング表</h3>
      <p>年を開くと、その年末の確定値を確認できます。アニメーション中の補間値は含みません。</p>
      {japanHistory.map(snapshot => <details key={snapshot.year} open={snapshot.year === 2010}><summary>{snapshot.year}年末の10社</summary><table className={styles.table}><caption>{snapshot.year}年末・選定10社内・十億米ドル</caption><thead><tr><th scope="col">順位</th><th scope="col">企業</th><th scope="col">時価総額</th></tr></thead><tbody>{snapshot.rows.map(row => <tr key={row.id}><td>{row.rank}</td><th scope="row">{row.name}</th><td>{fmt(row.valueUsdB)}</td></tr>)}</tbody></table></details>)}
    </div>;
  }
  const first = nvidiaIntelHistory[0];
  const last = nvidiaIntelHistory[nvidiaIntelHistory.length - 1];
  const max = Math.ceil(Math.max(...nvidiaIntelHistory.flatMap(row => [row.nvidia, row.intel])) / 1000) * 1000;
  const x = (index: number) => 70 + index * 660 / (nvidiaIntelHistory.length - 1);
  const y = (value: number) => 270 - value / max * 220;
  return <div className={styles.historyArticle}>
    <p>{first.year}年末はIntelが{fmt(first.intel - first.nvidia)}十億米ドル上回り、{last.year}年末はNVIDIAが{fmt(last.nvidia - last.intel)}十億米ドル上回っています。年末値で初めて大小関係が逆転したのは{nvidiaIntelCrossover.year}年です。</p>
    <figure><svg viewBox="0 0 800 330" role="img" aria-labelledby="nvidia-intel-chart-title nvidia-intel-chart-desc" style={{ width: '100%', height: 'auto' }}>
      <title id="nvidia-intel-chart-title">NVIDIAとIntelの年末時価総額推移</title><desc id="nvidia-intel-chart-desc">2010〜2025年。縦軸は0から{max}十億米ドルの線形軸。実線がNVIDIA、破線がIntel。各年の値は下の表に掲載。</desc>
      {[0, max / 2, max].map(value => <g key={value}><line x1="70" x2="730" y1={y(value)} y2={y(value)} stroke="currentColor" opacity="0.2" /><text x="60" y={y(value) + 5} textAnchor="end" fontSize="14" fill="currentColor">{value.toLocaleString('ja-JP')}</text></g>)}
      <text x="70" y="24" fontSize="14" fill="currentColor">時価総額（十億米ドル）</text>
      {(['nvidia', 'intel'] as const).map((id, series) => <g key={id}><polyline fill="none" stroke={series ? 'var(--mc-warning)' : 'var(--mc-chart-blue, #4f73ad)'} strokeWidth="3" strokeDasharray={series ? '8 5' : undefined} points={nvidiaIntelHistory.map((row, i) => `${x(i)},${y(row[id])}`).join(' ')} /><text x="630" y={series ? 320 : 300} fontSize="14" fill="currentColor">{series ? '– – Intel' : '━━ NVIDIA'}</text></g>)}
      {[0, 5, 10, 15].map(i => <text key={i} x={x(i)} y="290" textAnchor="middle" fontSize="14" fill="currentColor">{nvidiaIntelHistory[i].year}</text>)}
    </svg><figcaption>年末の観測点を線で結んでいます。年内の値や逆転日を復元したグラフではありません。出典：CompaniesMarketCap。</figcaption></figure>
    <div className="actions"><Entry mode="semiconductor" year={nvidiaIntelCrossover.year} company="nvidia" sourceSlug={sourceSlug} placement="crossover">{nvidiaIntelCrossover.year}年のNVIDIAを追跡 →</Entry><Entry mode="semiconductor" year={2010} company="intel" sourceSlug={sourceSlug} placement="start">2010年からIntelを追跡 →</Entry></div>
    <table className={styles.table}><caption>年末時価総額の比較（十億米ドル）</caption><thead><tr><th scope="col">年末</th><th scope="col">NVIDIA</th><th scope="col">Intel</th><th scope="col">NVIDIA − Intel</th></tr></thead><tbody>{nvidiaIntelHistory.map(row => <tr key={row.year}><th scope="row">{row.year}</th><td>{fmt(row.nvidia)}</td><td>{fmt(row.intel)}</td><td>{fmt(row.nvidia - row.intel)}</td></tr>)}</tbody></table>
  </div>;
}
