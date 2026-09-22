import { useId } from 'react';
import { interconnectSteps, type InterconnectStepId } from '@/data/semiconductor-interconnect';
import { interconnectFrame, wiringGeometry as g } from '@/lib/semiconductor-process/interconnect';
import styles from './process.module.css';
export function InterconnectDiagram({ step, progress, connected = false }: { step: InterconnectStepId; progress: number; connected?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const f = interconnectFrame(step, progress);
  const copy = interconnectSteps.find(s => s.id === step)!;
  const cavity = (c: typeof g.channels[number]) => `M${c.x} ${g.top}V${g.top+f.trenchDepth}H${c.viaX}V${g.trenchBottom+f.viaDepth}H${c.viaX+c.viaWidth}V${g.top+f.trenchDepth}H${c.x+c.width}V${g.top}Z`;
  // Before via etching starts, the outline must not open a cavity below the trench.
  const outline = (c: typeof g.channels[number]) => f.viaDepth > 0 ? cavity(c) : `M${c.x} ${g.top}V${g.top+f.trenchDepth}H${c.x+c.width}V${g.top}Z`;
  const showConnection = connected && f.surfaceLiner === 0 && f.overburden === 0 && f.fillTop === g.top;
  return <figure className={styles.crossSection}>
    <svg viewBox="0 0 580 374" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{`${copy.term}：${Math.round(progress*100)}%`}</title>
      <desc id={`${uid}-desc`}>{`${progress===1?copy.after:copy.before} 左右に独立した下層配線と、その上につながる溝・穴を示す断面模式図です。${showConnection?'左側の上下につながる部分を強調。電流や動作のシミュレーションではありません。':''}`}</desc>
      <defs>
        <pattern id={`${uid}-dielectric`} width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#e7eef2"/><circle cx="3" cy="3" r="1" fill="#9cb0bc"/></pattern>
        <pattern id={`${uid}-metal`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d5a16f"/><path d="M0 8L8 0" stroke="#ad7542"/></pattern>
        <pattern id={`${uid}-cap`} width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="6" fill="#a2c9bf"/><path d="M0 3H8" stroke="#567e73"/></pattern>
        {g.channels.map((c,i)=><clipPath id={`${uid}-cavity-${i}`} key={i}><path d={outline(c)}/></clipPath>)}
      </defs>
      {step==='cmp' ? <g aria-label="CMP装置の概念図">
        <rect x="390" y="34" width="142" height="14" rx="4" fill="#a1b6c1"/>
        <rect x="405" y="48" width="112" height="9" fill="#d5a16f"/>
        <rect x="375" y="65" width="170" height="12" fill="#94b9aa"/>
        {[0,1,2].map(i=><circle key={i} cx={399+i*53} cy="61" r="3" fill="#3d91ad"/>)}
        <text x="460" y="27" textAnchor="middle" className={styles.diagramSubtext}>ウエハ（加工面は下向き）</text>
        <text x="365" y="63" textAnchor="end" className={styles.diagramSubtext}>研磨液 →</text>
        <text x="460" y="95" textAnchor="middle" className={styles.diagramSubtext}>↔ パッド・相対運動 ↔</text>
        <text x="40" y="30" className={styles.assemblyText}>化学的な働き ＋ 機械的な働き</text>
        <text x="40" y="112" className={styles.diagramSubtext}>下の図は表面を上向きにした断面模式図</text>
      </g> : <><text x="290" y="30" textAnchor="middle" className={styles.assemblyText}>溝に横の配線、穴に上下の接続を作る</text><text x="290" y="55" textAnchor="middle" className={styles.diagramSubtext}>下層配線ができている別の模式例です</text></>}
      <rect x={g.left} y={g.lowerTop} width={g.width} height={g.bottom-g.lowerTop} fill={`url(#${uid}-dielectric)`} stroke="#91a4b0"/>
      {g.channels.map((c,i)=><rect key={i} x={c.viaX-15} y={g.lowerTop} width={c.viaWidth+30} height="32" fill={`url(#${uid}-metal)`} stroke="#986431"/>)}
      <rect x={g.left} y={g.lowerTop-f.dielectricHeight} width={g.width} height={f.dielectricHeight} fill={`url(#${uid}-dielectric)`}/>
      {g.channels.map((c,i)=><g key={i}>
        {f.trenchDepth>0&&<path d={outline(c)} fill="#fafbfc"/>}
        <g clipPath={`url(#${uid}-cavity-${i})`}>
          <rect x={c.x} y={f.fillTop} width={c.width} height={g.lowerTop-f.fillTop} fill={`url(#${uid}-metal)`}/>
          {/* Open-top liner follows the sidewalls and via bottom; no bridge across a via. */}
          <path d={`M${c.x} 160V205H${c.viaX}V280H${c.viaX+c.viaWidth}V205H${c.x+c.width}V160`} stroke="#596a83" strokeWidth="6" opacity={f.liner} fill="none"/>
        </g>
        <rect x={c.x} y={g.top-f.mouthMetal} width={c.width} height={f.mouthMetal} fill={`url(#${uid}-metal)`}/>
      </g>)}
      {/* Only the field portions carry surface liner; cavity sidewalls remain after CMP. */}
      {[[40,80],[230,120],[460,80]].map(([x,width])=><rect key={x} x={x} y={g.top-f.surfaceLiner} width={width} height={f.surfaceLiner} fill="#596a83"/>)}
      <rect x={g.left} y={g.top-f.surfaceLiner-f.overburden} width={g.width} height={f.overburden} fill={`url(#${uid}-metal)`}/>
      {[85,270,320,492].map((x,i)=><circle key={x} cx={x} cy={156-i%2*4} r="3" fill="#776256" opacity={f.residue}/>)}
      <rect x={g.left} y={g.top-f.capHeight} width={g.width} height={f.capHeight} fill={`url(#${uid}-cap)`}/>
      {f.trenchDepth>0 && step!=='cmp' && <g className={styles.diagramSubtext}><text x="122" y="105">溝：横方向</text><path d="M170 109V152" stroke="#637781"/><text x="287" y="245">上下をつなぐ穴（ビア）</text><path d="M284 248H194" stroke="#637781"/></g>}
      <text x="290" y="351" textAnchor="middle" className={styles.diagramSubtext}>下層配線は保持 · 色と模様は材料の役割を表します</text>
      {showConnection&&<><path d="M135 179H215M170 179V300" fill="none" stroke="#1769aa" strokeWidth="5" strokeDasharray="7 4"/><text x="290" y="80" textAnchor="middle" className={styles.assemblyText}>左側の上下がつながる（経路の模式表示）</text></>}
    </svg>
    <figcaption className={styles.legend}><span>斜線：金属</span><span>点：絶縁膜</span><span>内壁の縁：導電性下地</span><span>横線：保護膜</span><span>粒：残留物</span>{step==='cmp'&&<span>小図：研磨液とパッドで磨く</span>}{showConnection&&<span>青い破線：接続経路。電流の再現ではありません</span>}</figcaption>
  </figure>;
}
