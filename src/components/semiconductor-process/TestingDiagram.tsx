import { useId } from 'react';
import { testingLessons, testPattern, type TestingMode } from '@/data/semiconductor-testing';
import { testingFrame } from '@/lib/semiconductor-process/testing';
import styles from './process.module.css';
export function TestingDiagram({ mode, step, progress }: { mode: TestingMode; step: number; progress: number }) {
  const uid = useId().replace(/:/g, '');
  const f = testingFrame(mode, step, progress);
  const wafer = mode === 'wafer-test';
  const copy = testingLessons[mode].steps[step];
  const contactLift = 60 * (1 - f.contact);
  return <figure className={styles.crossSection}>
    <svg viewBox="0 0 580 374" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{`${copy.term}：${Math.round(progress*100)}%`}</title>
      <desc id={`${uid}-desc`}>{`${progress===1?copy.after:copy.before} ${wafer?'プローバで位置を合わせ、プローブカードの針で電極に接触します。':'ハンドラで位置を合わせ、パッケージ外側の端子をソケットへ接触させます。'}テスタが信号を送り、応答を受け取ります。${f.compared?'教材の一項目は一致。製品全体の合格判定ではありません。':'比較結果はまだありません。'}`}</desc>
      <defs><clipPath id={`${uid}-wafer`}><ellipse cx="209" cy="231" rx="147" ry="60"/></clipPath></defs>
      <text x="290" y="27" textAnchor="middle" className={styles.assemblyText}>{wafer?'切り分ける前：ウエハ上の電極へ':'組立後：パッケージの外側の端子へ'}</text>
      <rect x="375" y="64" width="170" height="155" rx="9" fill="#edf3f8" stroke="#8ca3b5"/>
      <text x="460" y="88" textAnchor="middle" className={styles.assemblyText}>テスタ：信号と応答</text>
      <text x="390" y="116" className={styles.testLabel}>入力　期待　応答</text>
      {testPattern.map((row,i)=><text key={i} x="405" y={138+i*21} className={styles.testLabel}>{`${row.input}　　 ${row.expected}　　 ${i<f.observedCount?row.response:'—'}`}</text>)}
      <path d={wafer?`M375 107H336V70H235V${121-contactLift}`:"M375 107H340V278H326"} fill="none" stroke="#688699" strokeWidth="3"/>
      <path d={wafer?`M375 195H350V84H251V${121-contactLift}`:"M375 195H350V289H326"} fill="none" stroke="#a0845e" strokeWidth="3"/>
      <text x="295" y="60" textAnchor="middle" className={styles.testLabel}>← 入力</text>
      <text x="290" y="106" textAnchor="middle" className={styles.testLabel}>応答 →</text>
      {wafer&&step===2&&progress>0&&progress<1&&<><circle cx={350-100*((progress*4)%1)} cy="70" r="5" fill="#1769aa"/><circle cx={250+100*((progress*4)%1)} cy="84" r="5" fill="#a46d31"/></>}
      {!wafer&&step===2&&progress>0&&progress<1&&<path d="M375 107H340V278H326" fill="none" stroke="#1769aa" strokeWidth="5" pathLength="1" strokeDasharray=".08 .92" strokeDashoffset={-progress}/> }
      {wafer ? <>
        <rect x="56" y="291" width="280" height="22" rx="6" fill="#8ca0af"/>
        <text x="195" y="334" textAnchor="middle" className={styles.testLabel}>プローバ：保持・位置合わせ</text>
        <g transform={`translate(${-64*(1-f.placement)} 0)`}>
          <ellipse cx="209" cy="239" rx="147" ry="60" fill="#4d697b"/>
          <ellipse cx="209" cy="231" rx="147" ry="60" fill="#b3cad8"/>
          {[0,1,2].flatMap(r=>[0,1,2].map(c=><rect key={`${r}-${c}`} clipPath={`url(#${uid}-wafer)`} x={100+c*76} y={178+r*32} width="68" height="26" rx="2" fill={r===1&&c===1?'#426f8b':'#789bae'} stroke={r===1&&c===1?'#c58a2f':'#d8e6ed'} strokeWidth="2"/>))}
          <text x="210" y="229" textAnchor="middle" fill="white" fontSize="18">★</text>
          <rect x="190" y="208" width="8" height="5" fill="#edc56e"/><rect x="220" y="208" width="8" height="5" fill="#edc56e"/>
        </g>
        <g transform={`translate(0 ${-contactLift})`}>
          <rect x="145" y="121" width="126" height="14" fill="#6e9789" stroke="#42675a"/>
          <path d="M178 135L194 208M240 135L224 208" stroke="#6c7c87" strokeWidth="3" fill="none"/>
        </g>
        <text x="125" y="150" textAnchor="end" className={styles.testLabel}>接触針</text>
        <text x="195" y="51" textAnchor="middle" className={styles.testLabel}>プローブカード</text>
      </> : <>
        <rect x="80" y="258" width="246" height="38" rx="8" fill="#aec3ce" stroke="#69808f"/>
        <path d="M116 258V239H159M290 258V239H251" stroke="#8b7857" strokeWidth="5" fill="none"/>
        <g transform={`translate(${-64*(1-f.placement)} ${-contactLift})`}>
          <rect x="155" y="170" width="100" height="69" rx="7" fill="#374856"/>
          <path d="M155 224H126V239H116M255 224H280V239H290" fill="none" stroke="#9eacb5" strokeWidth="6"/>
          <text x="205" y="210" textAnchor="middle" fill="white" fontSize="24">★</text>
        </g>
        <text x="205" y="318" textAnchor="middle" className={styles.testLabel}>ソケット：外部端子と接触</text>
        <text x="205" y="341" textAnchor="middle" className={styles.testLabel}>ハンドラ：搬送・位置合わせ</text>
      </>}
      <rect x="375" y="235" width="170" height="104" rx="6" fill="#fff" stroke="#aab6bf"/>
      <text x="460" y="254" textAnchor="middle" className={styles.testLabel}>{wafer?'位置と結果のマップ':'製品と結果の記録'}</text>
      {wafer ? [0,1,2].flatMap(r=>[0,1,2].map(c=><g key={`${r}-${c}`}><rect x={414+c*30} y={264+r*21} width="25" height="18" fill={r===1&&c===1&&f.recorded?'#e1eee8':'#f1f3f5'} stroke="#9babb5"/><text x={426+c*30} y={278+r*21} textAnchor="middle" fontSize="13" fill="#344651">{r===1&&c===1&&f.recorded?'○':'?'}</text></g>)) : <><text x="460" y="283" textAnchor="middle" className={styles.testLabel}>対象：★のパッケージ</text><text x="460" y="308" textAnchor="middle" className={styles.testLabel}>{f.recorded?'○ この項目は一致':'記録待ち'}</text></>}
      <text x="460" y="362" textAnchor="middle" className={styles.testLabel}>{f.compared?'比較：この項目は一致':'比較：未確認'}</text>
    </svg>
    <figcaption className={styles.legend}><span>★ 調べる対象</span><span>○ この項目は一致</span><span>? 未確認</span><span>0・1は架空の機能試験例。全項目の合格ではありません</span></figcaption>
  </figure>;
}
export function TestingReadout({ mode, step, progress }: { mode: TestingMode; step: number; progress: number }) {
  const f = testingFrame(mode, step, progress);
  return <details className={styles.detail}><summary>入力・期待・受け取った応答を表で見る</summary><p>入力と反対の0・1を返す架空回路の例です。測定前・未取得の応答は「未取得」と表示します。</p><table className={styles.testTable}><caption>教材の一項目の応答</caption><thead><tr><th scope="col">順番</th><th scope="col">入力</th><th scope="col">期待</th><th scope="col">応答</th></tr></thead><tbody>{testPattern.map((row,i)=><tr key={i}><th scope="row">{i+1}</th><td>{row.input}</td><td>{row.expected}</td><td>{i<f.observedCount?row.response:'未取得'}</td></tr>)}</tbody></table><p>{f.compared?'この項目は一致しています。他の項目は未確認で、製品全体の合格とは判断しません。':'比較結果はまだありません。'}</p><p>{f.recorded?'★の対象について、この項目の結果を記録しました。':'結果の記録はまだ完了していません。'}</p></details>;
}
