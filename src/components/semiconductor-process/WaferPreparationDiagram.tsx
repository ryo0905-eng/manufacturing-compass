import { useId } from 'react';
import { waferPreparationSteps, type WaferPreparationStepId } from '@/data/semiconductor-wafer-preparation';
import { waferPreparationFrame } from '@/lib/semiconductor-process/wafer-preparation';
import styles from './process.module.css';
export function WaferPreparationDiagram({ step, progress }: { step: WaferPreparationStepId; progress: number }) {
  const uid = useId().replace(/:/g, '');
  const f = waferPreparationFrame(step, progress);
  const index = waferPreparationSteps.findIndex(item => item.id === step);
  const copy = waferPreparationSteps[index];
  const crystalTop = 251 - f.growth * 137;
  const plane = [90,170,250,330,410,490].map((x,i) => ({ x, top: 276 - f.thickness/2 + (i%2 ? -1 : 1)*f.unevenness, bottom: 276 + f.thickness/2 + (i%2 ? 1 : -1)*f.unevenness }));
  const profile = [...plane.map(p=>`${p.x},${p.top}`), ...[...plane].reverse().map(p=>`${p.x},${p.bottom}`)].join(' ');
  const cutProgress = Math.min(1,f.cut*1.5), separation = Math.max(0,(f.cut-2/3)*3)*64;
  return <figure className={styles.crossSection}>
    <svg viewBox="0 0 580 374" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{`${copy.term}：${Math.round(progress*100)}%`}</title>
      <desc id={`${uid}-desc`}>{`${progress===1?copy.after:copy.before} ${index<2?'容器の中の原料と、種から育つ単結晶の模式図。':index<4?'育てた結晶を冷やして取り出し、横から見る別視点の図。':'円板の全体図と、凹凸・傷を誇張した断面模式図。'}回路はまだありません。寸法・色・速度は実物比例ではありません。`}</desc>
      <defs>
        <pattern id={`${uid}-crystal`} width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#88aabd"/><path d="M0 6H12M6 0V12" stroke="#4b768e" strokeWidth="1"/></pattern>
        <pattern id={`${uid}-damage`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#c4b3c6"/><path d="M0 0L8 8M0 8L8 0" stroke="#8a658e"/></pattern>
        <linearGradient id={`${uid}-surface`}><stop offset="0" stopColor="#577b94"/><stop offset=".45" stopColor="#d0e1eb"/><stop offset="1" stopColor="#6c91a8"/></linearGradient>
      </defs>
      <text x="290" y="28" textAnchor="middle" className={styles.assemblyText}>{index<2?'高純度シリコンから単結晶へ':index<4?'冷却・取出し後の結晶を、横から見る':'一枚の板へ拡大 · まだ回路はありません'}</text>
      {index<2 ? <>
        <path d="M130 227V299Q290 348 450 299V227" fill="#e3e7ea" stroke="#8a99a4" strokeWidth="4"/>
        <ellipse cx="290" cy="245" rx="157" ry="44" fill="#b4c3cc"/>
        <ellipse cx="290" cy="245" rx="151" ry="40" fill="#d6a970" opacity={f.melt}/>
        {[0,1,2,3,4].map(i=><path key={i} d={`M${168+i*48} ${224+i%2*17}l22 -8 19 17 -12 16 -28 -8Z`} fill="#6c8594" stroke="#3f5969" opacity={1-f.melt}/>)}
        {index===1&&<>
          <rect x="258" y={crystalTop} width="64" height={f.growth*137} fill={`url(#${uid}-crystal)`}/>
          <ellipse cx="290" cy={crystalTop} rx="32" ry="10" fill="#aec8d8" stroke="#5f869d"/>
          <path d={`M290 ${crystalTop-56}V${crystalTop-10}`} stroke="#7b8b96" strokeWidth="9"/>
          <text x="344" y={crystalTop-20} className={styles.testLabel}>↑ 引き上げる</text>
          <text x="198" y="94" className={styles.testLabel}>種結晶</text><path d={`M243 92L285 ${crystalTop-20}`} stroke="#7b8b96"/>
          <text x="365" y="187" className={styles.testLabel}>↻ 回転</text>
        </>}
        <text x="290" y="319" textAnchor="middle" className={styles.testLabel}>{index===0?'原料の精製は、この体験より前に完了':'液体から固体が成長 · 格子は結晶の向きの記号'}</text>
      </> : index<4 ? <>
        <path d={`M103 ${133+12*f.shaped}Q180 ${118+27*f.shaped} 270 145H370V255H270Q180 ${282-27*f.shaped} 103 ${267-12*f.shaped}Z`} fill={`url(#${uid}-crystal)`} stroke="#55778c"/>
        <ellipse cx="103" cy="200" rx="28" ry={67-12*f.shaped} fill="#789cb2" stroke="#55778c"/>
        <ellipse cx="370" cy="200" rx="28" ry="55" fill="#adc7d6" stroke="#55778c"/>
        {index===2&&<path d="M88 120H390M88 280H390" fill="none" stroke="#9d859f" strokeWidth="9" opacity={1-f.shaped}/>}
        {index===3&&<>
          <path d={`M342 ${126+148*cutProgress}H398`} stroke="#445767" strokeWidth="3"/>
          <circle cx="342" cy={126+148*cutProgress} r="6" fill="#7b8c97"/><circle cx="398" cy={126+148*cutProgress} r="6" fill="#7b8c97"/>
          <text x="420" y="110" className={styles.testLabel}>切断ワイヤ</text>
          <path d="M420 115L396 125" fill="none" stroke="#7b8c97"/>
          <g transform={`translate(${separation} 0)`} opacity={cutProgress===1?1:0}>
            <path d="M374 145H381V255H374Z" fill="#66869b"/>
            <ellipse cx="381" cy="200" rx="28" ry="55" fill={`url(#${uid}-surface)`} stroke="#52778d"/>
          </g>
        </>}
        <text x="290" y="309" textAnchor="middle" className={styles.assemblyText}>{index===2?'棒の外周を整える':'棒から円板へ。チップへの切断とは別です'}</text>
      </> : <>
        <ellipse cx="290" cy="152" rx="138" ry="58" fill="#557b94"/>
        <ellipse cx="290" cy="145" rx="138" ry="58" fill={`url(#${uid}-surface)`}/>
        {[0,1,2].map(i=><path key={i} d={`M${204+i*43} 121l33 31 -12 18`} fill="none" stroke="#8797a1" strokeWidth="2" opacity={1-f.polished}/>)}
        {[0,1,2,3].map(i=><circle key={i} cx={216+i*45} cy={149+i%2*15} r="3" fill="#746759" opacity={f.residue}/>)}
        <text x="290" y="225" textAnchor="middle" className={styles.testLabel}>↓ 一部分の断面を拡大（凹凸・傷は誇張）</text>
        <polygon points={profile} fill={`url(#${uid}-crystal)`} stroke="#567c92"/>
        {f.damage>0&&<>
          <polygon points={[...plane.map(p=>`${p.x},${p.top}`), ...[...plane].reverse().map(p=>`${p.x},${p.top+f.damage}`)].join(' ')} fill={`url(#${uid}-damage)`}/>
          <polygon points={[...plane.map(p=>`${p.x},${p.bottom-f.damage}`), ...[...plane].reverse().map(p=>`${p.x},${p.bottom}`)].join(' ')} fill={`url(#${uid}-damage)`}/>
        </>}
        {index===4&&<><rect x="85" y={218+20*f.lapped} width="410" height="9" fill="#9eaeb9"/><rect x="85" y={325-12*f.lapped} width="410" height="9" fill="#9eaeb9"/><text x="510" y="277" className={styles.testLabel}>↔</text></>}
        {index===5&&<text x="290" y="337" textAnchor="middle" className={styles.testLabel}>表面の材料を除去：汚れを洗うこととは別</text>}
        {index===6&&<><text x="290" y="74" textAnchor="middle" className={styles.testLabel}>研磨液 ＋ パッドの働きで仕上げる</text><path d={`M${200+60*progress} 104H${320+60*progress}`} stroke="#91b5a8" strokeWidth="8"/></>}
        {index===7&&<text x="290" y="337" textAnchor="middle" className={styles.testLabel}>{f.checked?'確認項目の例：粒子・表面状態・平坦度':'残留物を除き、材料の板としての状態を確認する'}</text>}
      </>}
      <text x="290" y="362" textAnchor="middle" className={styles.testLabel}>{f.checked?'検査項目の紹介です。実際の合格判定ではありません':'色・寸法・厚さ・速度は実物比例ではありません'}</text>
    </svg>
    <figcaption className={styles.legend}><span>格子：結晶の向きの記号</span>{index>=4&&<><span>交差線：加工で傷んだ層</span><span>粒：残留物</span></>}<span>回路のないシリコンの板を用意する例</span></figcaption>
  </figure>;
}
