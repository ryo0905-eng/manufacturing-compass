import { useId } from 'react';
import { journey, processSteps } from '@/data/semiconductor-process';
import { frame, OPENINGS } from '@/lib/semiconductor-process/model';
import styles from './process.module.css';
export function Wafer({ marked = false, patterned = false }: { marked?: boolean; patterned?: boolean }) {
  const id = useId();
  return <svg viewBox="0 0 360 240" role="img" aria-labelledby={`${id}-title`} className={styles.wafer}>
    <title id={`${id}-title`}>{marked ? 'ウエハの一部分を拡大して、加工の断面を見ています。切断する操作ではありません。' : patterned ? '多数のチップの領域が並ぶウエハの模式図' : '材料となる円板、シリコンウエハの模式図'}</title>
    <defs><linearGradient id={`${id}-surface`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dce8ef"/><stop offset=".5" stopColor="#a5bdce"/><stop offset="1" stopColor="#5d7c93"/></linearGradient><clipPath id={`${id}-clip`}><ellipse cx="175" cy="108" rx="146" ry="79"/></clipPath><pattern id={`${id}-grid`} width="30" height="26" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="25" height="21" rx="1" fill="none" stroke="#e4eef4" strokeWidth="1"/></pattern></defs>
    <ellipse cx="175" cy="123" rx="146" ry="79" fill="#536d7f"/><path d="M29 108v15M321 108v15" stroke="#536d7f" strokeWidth="2"/>
    <ellipse cx="175" cy="108" rx="146" ry="79" fill={`url(#${id}-surface)`} stroke="#5d7c93"/>
    {patterned && <rect x="20" y="25" width="310" height="165" clipPath={`url(#${id}-clip)`} fill={`url(#${id}-grid)`}/>}
    <path d="M164 187l11 -7 11 7" fill="#fff"/>
    {marked && <><rect x="170" y="91" width="34" height="24" fill="#fff" fillOpacity=".35" stroke="#1769aa" strokeWidth="3"/><path d="M206 105H310V183" fill="none" stroke="#1769aa" strokeWidth="2"/><text x="240" y="208" textAnchor="middle">ここを拡大</text></>}
  </svg>;
}
export function JourneyDiagram({ index }: { index: number }) {
  const id = useId();
  if (index === 1 || index === 2 || index === 3) return <div className={styles.journeyPicture}><Wafer patterned={index !== 1}/>{index === 3 && <p className={styles.pictureCaption}>各チップへ接触して電気特性を検査</p>}</div>;
  return <svg viewBox="0 0 360 240" role="img" aria-labelledby={`${id}-title`} className={styles.wafer}>
    <title id={`${id}-title`}>{journey[index].title}</title>
    {index === 0 ? <><rect x="63" y="25" width="230" height="184" rx="8" fill="#f7f7f8" stroke="#c9cdd2"/>{[0,1,2].map(i=><g key={i}><rect x={88+i*62} y="68" width="34" height="40" fill="#eef3fa" stroke="#1769aa"/><path d={`M${105+i*62} 108v45h${i===2?-80:35}`} fill="none" stroke="#1769aa" strokeWidth="3"/></g>)}<text x="178" y="187" textAnchor="middle">働きと、つなぎ方を決める</text></> : <>
      {index===4 && <><rect x="32" y="67" width="74" height="70" fill="#a5bdce" stroke="#536d7f"/><path d="M56 67v70M81 67v70M32 91h74M32 115h74" stroke="#fff" strokeWidth="3"/><path d="M122 104h33m-8 -6 8 6-8 6" stroke="#60666d" fill="none"/></>}
      <path d="M176 109l72 -33 78 43-70 39z" fill="#45675e"/><path d="M176 109v16l80 46 70-38v-14l-70 39z" fill="#334e47"/>
      <path d="M210 102l36-17 43 24-34 17z" fill="#9db7c7" stroke="#536d7f"/>
      {[0,1,2,3].map(i=><path key={i} d={`M${207+i*12} ${115+i*6}l-10 10M${282+i*9} ${125-i*4}l13 5`} stroke="#b58a3d" strokeWidth="2"/>)}
      {index===5 && <><rect x="49" y="40" width="94" height="55" rx="4" fill="#eef3fa" stroke="#1769aa"/><path d="M143 67h38v30" fill="none" stroke="#1769aa"/><path d="M67 68h10l7-13 10 27 9-14h24" stroke="#1769aa" fill="none"/><text x="180" y="207" textAnchor="middle">組み立て後の働きも確認</text></>}
      {index===4 && <text x="180" y="207" textAnchor="middle">切り分け → 接続・保護</text>}
    </>}
  </svg>;
}
export function ProcessDiagram({ step, progress, highlight }: { step: number; progress: number; highlight?: string }) {
  const id = useId(), f = frame(step, progress);
  const short = processSteps[step];
  return <figure className={styles.crossSection}>
    <svg viewBox="0 0 580 374" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{`${short.term}：${progress===0?'加工前':progress===1?'加工後':'途中の模式図'}`}</title>
      <desc id={`${id}-desc`}>{progress===1?short.after:short.before} 内部を見る断面図です。実物を切断する操作ではありません。</desc>
      <defs>
        <pattern id={`${id}-silicon`} width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#d8dfe4"/><path d="M0 12L12 0" stroke="#bbc7d0"/></pattern>
        <pattern id={`${id}-film`} width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#81b8cf"/><circle cx="3" cy="3" r="1" fill="#426e83"/></pattern>
        <pattern id={`${id}-resist`} width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#e8c878"/><path d="M0 5H10" stroke="#bc943b"/></pattern>
      </defs>
      {f.exposureActive && <g>
        <text x="40" y="16" className={styles.diagramText}>マスク（ウエハから離れた位置）</text>
        {f.regions.filter(r=>!r.opening).map(r=><rect key={r.x} x={r.x} y="24" width={r.width} height="12" fill="#344651"/>)}
        {OPENINGS.map(o=><path key={o.x} d={`M${o.x} 36H${o.x+o.width}L${o.x+o.width} 170H${o.x}Z`} fill="#f3d65d" opacity={.12+.42*progress}/>)}
        <ellipse cx="290" cy="93" rx="252" ry="13" fill="#e8f3f8" fillOpacity=".8" stroke="#1769aa"/>
        <text x="290" y="132" textAnchor="middle" className={styles.opticsLabel}>光学系を介して模様を投影（概念図）</text>
      </g>}
      {!f.exposureActive && <><text x="40" y="45" className={styles.diagramText}>{short.verb}</text><text x="40" y="72" className={styles.diagramSubtext}>{step===5?'開口から材料を取り除く。光で削る図ではありません。':'位置・厚さ・時間は実物比例ではありません。'}</text></>}
      <rect {...f.substrate} fill={`url(#${id}-silicon)`} stroke="#71838f"/>
      {f.regions.map(r=><g key={r.x}>
        {r.filmHeight>0 && <rect x={r.x} y={256-r.filmHeight} width={r.width} height={r.filmHeight} fill={`url(#${id}-film)`}/>}
        {r.resistHeight>0 && <rect x={r.x} y={204-r.resistHeight} width={r.width} height={r.resistHeight} fill={`url(#${id}-resist)`}/>}
        {r.opening && r.resistHeight>0 && f.exposed>0 && <rect x={r.x} y={204-r.resistHeight} width={r.width} height={r.resistHeight} fill="#db9953" opacity={f.exposed*.85}/>}
        {highlight==='protected' && !r.opening && r.resistHeight>0 && <rect x={r.x+2} y={204-r.resistHeight-4} width={r.width-4} height={r.resistHeight+8} fill="none" stroke="#1769aa" strokeWidth="3"/>}
        {highlight==='protected' && r.opening && step>=4 && step<=5 && <path d={`M${r.x+r.width/2} 148v16m-5-5 5 5 5-5`} stroke="#1769aa" fill="none" strokeWidth="2"/>}
      </g>)}
      {step===5 && progress>0 && progress<1 && OPENINGS.map(o=><g key={o.x} fill="#71838f">{[0,1,2].map(i=><circle key={i} cx={o.x+16+i*18} cy={148+((progress*62+i*12)%45)} r="2"/>)}</g>)}
      {[90,265,475].map((x,i)=><circle key={x} cx={x} cy={251-i%2*3} r="4" fill="#7e5747" opacity={f.dirt}/>)}
      {[118,302,465].map(x=><circle key={x} cx={x} cy={201} r="3" fill="#7e5747" opacity={f.residue}/>)}
      {highlight==='wash' && (step===0 || step>=5) && (step===0?[90,265,475]:[118,302,465]).map(x=><circle key={x} cx={x} cy={step===0?250:201} r="10" fill="none" stroke="#1769aa" strokeDasharray="3 3"/>)}
      <text x="290" y="301" textAnchor="middle" className={styles.diagramText}>シリコン：下地の板</text>
      <text x="290" y="354" textAnchor="middle" className={styles.diagramSubtext}>↑ 表面側　／　内部を見る模式図</text>
    </svg>
    <figcaption className={styles.legend}><span><i className={styles.siliconKey}/>シリコン（斜線）</span><span><i className={styles.filmKey}/>加工対象の膜（点）</span><span><i className={styles.resistKey}/>レジスト（横線）</span><span><i className={styles.exposedKey}/>光で反応した部分</span><span><i className={styles.dirtKey}/>不要な粒子・残留物</span></figcaption>
  </figure>;
}
export function CompletedStructure() {
  const id=useId();
  return <svg viewBox="0 0 580 260" role="img" aria-labelledby={`${id}-title`} className={styles.structure}>
    <title id={`${id}-title`}>別の完成構造の概念図。下に素子、その上に接続された複数層の配線。直前の加工例から直接できる構造ではありません。</title>
    <rect x="40" y="194" width="500" height="42" fill="#d8dfe4"/><rect x="40" y="40" width="500" height="154" fill="#eaf2f5"/>
    {[100,240,410].map(x=><g key={x}><rect x={x} y="180" width="54" height="14" fill="#526b7a"/><path d={`M${x+27} 180v-34`} stroke="#b58a3d" strokeWidth="10"/></g>)}
    <path d="M85 146h360M150 146V95h270M370 95V55H120" stroke="#b58a3d" strokeWidth="12" fill="none"/>
    <text x="495" y="180" textAnchor="end">素子</text><text x="510" y="85" textAnchor="end">配線</text><text x="290" y="224" textAnchor="middle">シリコン</text>
  </svg>;
}
