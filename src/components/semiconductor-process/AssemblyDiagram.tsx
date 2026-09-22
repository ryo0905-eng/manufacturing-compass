import { useId } from 'react';
import { assemblySteps, type AssemblyStepId } from '@/data/semiconductor-assembly';
import { assemblyConnections, assemblyFrame, assemblyResin } from '@/lib/semiconductor-process/assembly';
import styles from './process.module.css';
export function AssemblyDiagram({ step, progress, inside = false, highlight }: { step: AssemblyStepId; progress: number; inside?: boolean; highlight?: string }) {
  const uid = useId().replace(/:/g, '');
  const f = assemblyFrame(step, progress);
  const index = assemblySteps.findIndex(s => s.id === step);
  const waferScene = index < 3;
  const selectedX = 258, selectedY = 174 - f.pickup * 100;
  return <figure className={styles.crossSection}>
    <svg viewBox="0 0 580 374" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{`${assemblySteps[index].term}：${Math.round(progress * 100)}%`}</title>
      <desc id={`${uid}-desc`}>{progress === 1 ? assemblySteps[index].after : assemblySteps[index].before} {waferScene ? '星印のチップを追います。切断後もテープ上で保持します。' : '搭載部・信号電極・ワイヤ・外部端子は別の役割です。'}{inside ? '内部を見る模式図。実際の樹脂は透明ではありません。' : ''}</desc>
      <defs><clipPath id={`${uid}-wafer`}><ellipse cx="290" cy="209" rx="205" ry="90"/></clipPath><pattern id={`${uid}-metal`} width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#b9c8d2"/><path d="M0 7L7 0" stroke="#899dab"/></pattern><pattern id={`${uid}-chip`} width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#376681"/><path d="M0 5H10M5 0V10" stroke="#6d91a6" strokeWidth=".6"/></pattern></defs>
      {waferScene ? <>
        <text x="290" y="32" textAnchor="middle" className={styles.assemblyText}>検査を終えたウエハ · ★のチップを追う</text>
        <g opacity={f.tape}><ellipse cx="290" cy="238" rx="238" ry="98" fill="#e9edf1" stroke="#8596a2" strokeWidth="8"/><ellipse cx="290" cy="238" rx="220" ry="84" fill="#c6e7e8" stroke={highlight === 'tape-support' ? '#1769aa' : '#81afb5'} strokeWidth="3"/><text x="290" y="323" textAnchor="middle" className={styles.diagramSubtext}>保持テープとリングフレーム</text></g>
        <ellipse cx="290" cy="217" rx="205" ry="90" fill="#3d5769"/><ellipse cx="290" cy="209" rx="205" ry="90" fill="#9ab4c4"/>
        {[0,1,2].flatMap(row => [0,1,2,3,4].map(col => {
          const selected = row === 1 && col === 2;
          const x = 114 + col * 72, y = 132 + row * 42;
          return <g key={`${row}-${col}`} clipPath={`url(#${uid}-wafer)`} opacity={selected ? 0 : 1}><rect x={x} y={y} width="64" height="34" rx="2" fill={`url(#${uid}-chip)`} stroke="#d4e1e9"/></g>;
        }))}
        {/* The saw follows streets between dies, never the selected die's interior. */}
        {[0,1,2,3,4,5].map(line => {
          const t = Math.max(0, Math.min(1, f.cut * 6 - line));
          const vertical = line < 4;
          const x = 182 + line * 72, y = line === 4 ? 170 : 212;
          return <g key={line}><path d={vertical ? `M${x} 128V256` : `M110 ${y}H474`} stroke="#172f3b" strokeWidth="4" pathLength="1" strokeDasharray={`${t} 1`} fill="none"/>{index === 1 && t > 0 && t < 1 && <g><circle cx={vertical ? x : 110 + 364*t} cy={vertical ? 128 + 128*t - 18 : y - 18} r="20" fill="#c0c8cd" stroke="#607580" strokeWidth="3"/><text x="290" y="72" textAnchor="middle" className={styles.diagramSubtext}>ブレードが境界の通り道を切断</text></g>}</g>;
        })}
        <rect x="258" y="174" width="64" height="34" fill="#c6e7e8" opacity={f.pickup}/>
        <g transform={`translate(${selectedX} ${selectedY})`}><rect width="64" height="34" rx="2" fill={`url(#${uid}-chip)`} stroke="#edba59" strokeWidth="3"/><text x="32" y="24" textAnchor="middle" fill="#fff" fontSize="23">★</text></g>
        {index === 2 && f.pickup > 0 && <path d={`M290 ${selectedY - 38}V${selectedY - 3}`} stroke="#738998" strokeWidth="10"/>}
      </> : <>
        <text x="290" y="30" textAnchor="middle" className={styles.assemblyText}>同じ★のチップを拡大 · ワイヤ接続の一例</text>
        <g opacity={1 - f.formed}><path d="M78 210V300H502V210" fill="none" stroke="#aebdc7" strokeWidth="8"/><text x="290" y="320" textAnchor="middle" className={styles.diagramSubtext}>外側の支持部分（最後に分離）</text></g>
        <path d="M226 242H354V254H226Z" fill={`url(#${uid}-metal)`} stroke="#667d8c"/>
        <rect x="230" y="235" width="120" height="7" fill="#c0a37c" opacity={f.attach}/>
        <path d={`M160 228H112L${112-8*f.formed} ${228+46*f.formed}H78M420 228H468L${468+8*f.formed} ${228+46*f.formed}H502`} stroke="#8196a4" strokeWidth="12" fill="none"/>
        <g transform={`translate(0 ${-78*(1-f.attach)})`}><rect x="230" y="198" width="120" height="36" fill={`url(#${uid}-chip)`} stroke="#edba59" strokeWidth="2"/><text x="290" y="224" textAnchor="middle" fill="white" fontSize="23">★</text>{assemblyConnections.map(c=><rect key={c.padX} x={c.padX-5} y="198" width="10" height="6" fill="#f0ca72"/>)}</g>
        {assemblyConnections.map((c,i)=><path key={c.padX} d={c.path} pathLength="1" strokeDasharray={`${Math.max(0,Math.min(1,f.wire*2-i))} 1`} fill="none" stroke={highlight==='connection'?'#c46a19':'#b8862b'} strokeWidth="4"/>)}
        <rect {...assemblyResin} rx="12" fill="#34434f" opacity={f.resin * (inside ? .14 : 1)}/>
        {f.resin > 0 && <rect {...assemblyResin} rx="12" fill="none" stroke="#34434f" strokeWidth="2"/>}
        {f.resin > 0 && !inside ? <text x="290" y="209" textAnchor="middle" fill="white" fontSize="18">樹脂で保護</text> : <><text x="290" y="110" textAnchor="middle" className={styles.diagramSubtext}>★ チップ / 小さな四角：信号電極</text><text x="290" y="285" textAnchor="middle" className={styles.diagramSubtext}>中央：搭載部　左右：外部につながる端子</text></>}
      </>}
      <text x="290" y="355" textAnchor="middle" className={styles.diagramSubtext}>{inside && !waferScene ? '内部を見る模式図 · 樹脂が透明になる工程ではありません' : '寸法・速度は実物比例ではありません'}</text>
    </svg>
    <figcaption className={styles.legend}><span>★ 追っているチップ</span>{waferScene ? <><span>格子：チップの領域</span><span>淡い青：保持テープ</span></> : <><span>斜線：金属の搭載部</span><span>小さな四角：電極</span><span>曲線：ワイヤ</span><span>外側：端子</span><span>濃い外枠：樹脂</span></>}</figcaption>
  </figure>;
}
