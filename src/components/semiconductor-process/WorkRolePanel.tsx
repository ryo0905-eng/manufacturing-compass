import Link from 'next/link';
import { type WorkRole, type WorkExperienceId, workLessons } from '@/data/semiconductor-work';
import { InterconnectWorkGraphic } from './InterconnectWorkGraphic';
import { TestingWorkGraphic } from './TestingWorkGraphic';
import { PreparationWorkGraphic } from './PreparationWorkGraphic';
import styles from './process.module.css';

/** Static, independent visual: selecting a role never changes the process simulation. */
export function WorkRolePanel({ role, onRelated, experience = 'thin-film' }: { role: WorkRole; onRelated: () => void; experience?: WorkExperienceId }) {
  const source = workLessons[experience]!.sources.find(item => item.id === role.id)!;
  return <div id={`${experience}-work-panel`} className={styles.workPanel} role="region" aria-label={role.label}>
    <h4>{role.name}</h4>
    <p className={styles.small}>役割を考えるための模式図。実際の測定値や故障を示すものではありません。</p>
    <ol className={styles.workFlow} aria-label="仕事の見方">
      {role.diagram.map((caption, index) => <li key={caption}>
        <svg viewBox="0 0 160 86" aria-hidden="true" focusable="false">
          {experience === 'wafer-test' || experience === 'final-test' ? <TestingWorkGraphic mode={experience} role={role.id} index={index}/> : experience === 'wafer-preparation' ? <PreparationWorkGraphic role={role.id} index={index}/> : experience === 'interconnect' ? <InterconnectWorkGraphic role={role.id} index={index}/> : experience === 'assembly' ? <AssemblyWorkGraphic role={role.id} index={index}/> : role.id === 'process' ? <>
            <path d="M20 65H140" stroke="#667985" strokeWidth="5"/>
            <path d={index === 0 ? 'M25 60V32H58V60H100V32H135V60' : 'M25 60V38H63V60H96V38H135V60'} fill="none" stroke="#28749c" strokeWidth="8"/>
            {index > 0 && <path d="M54 15H106M54 10V20M106 10V20" fill="none" stroke="#815a20" strokeWidth="2"/>}
            {index === 2 && <path d="M30 27H130" stroke="#815a20" strokeWidth="2" strokeDasharray="4 4"/>}
          </> : role.id === 'equipment' ? <>
            <rect x="26" y="13" width="108" height="60" rx="6" fill="#e6edf1" stroke="#526775" strokeWidth="2"/>
            <rect x="38" y="26" width="43" height="32" fill="white" stroke="#526775"/>
            <path d="M44 47H54L61 32L70 52L76 40" fill="none" stroke="#28749c" strokeWidth="2"/>
            <path d={index === 0 ? 'M96 33H119M96 46H119' : 'M94 30H123M94 40H114M94 50H123M94 60H110'} stroke="#815a20" strokeWidth="3"/>
            {index === 2 && <circle cx="115" cy="52" r="16" fill="none" stroke="#28749c" strokeWidth="3"/>}
          </> : <>
            <path d="M20 62H140" stroke="#667985" strokeWidth="6"/>
            <path d="M20 52H140" stroke="#28749c" strokeWidth="8"/>
            {[42, 80, 118].map(x => <path key={x} d={`M${x} 18V43m-5 -6l5 6 5 -6`} stroke="#815a20" strokeWidth="2" fill="none"/>)}
            {index > 0 && <path d="M30 12H130" stroke="#815a20" strokeDasharray="4 4"/>}
            {index === 2 && <path d="M38 72H48M76 72H86M114 72H124" stroke="#28749c" strokeWidth="3"/>}
          </>}
        </svg>
        <span>{index + 1}. {caption}</span>
      </li>)}
    </ol>
    {experience === 'assembly' && <p className={styles.small}>内部の図は透視の模式図です。実際に樹脂が透明なわけではなく、検査画像の再現でもありません。</p>}
    {experience === 'interconnect' && <p className={styles.small}>金属は溝と上下をつなぐ穴に残し、左右の配線は絶縁膜で隔てます。下地などの薄膜や寸法は簡略化しています。測定画像・電流の再現ではありません。</p>}
    {(experience === 'wafer-test' || experience === 'final-test') && <p className={styles.small}>{experience === 'wafer-test' ? 'ウエハ上の電極へプローブで接触します。' : '組立後の製品の端子へソケットを通して接触します。'}図はテストの構成と記録の模式例です。波形・測定結果・合否の再現ではありません。</p>}
    {experience === 'wafer-preparation' && <p className={styles.small}>この板に回路はまだありません。矢印は確認する場所の目安で、特定の測定装置や加工動作を再現していません。</p>}
    <dl className={styles.workFacts}>
      <dt>困りごと</dt><dd>{role.problem}</dd>
      <dt>調べること</dt><dd>{role.investigate}</dd>
      <dt>関わる人</dt><dd>{role.people}</dd>
      <dt>次につなげる</dt><dd>{role.next}</dd>
    </dl>
    <Link className={styles.articleLink} href={role.guide} onClick={onRelated}>{role.guideLabel} →</Link>
    {role.id === 'measurement' && <p className={styles.small}>計測・検査と品質保証は同じ職種とは限りません。関連記事では品質データや不良解析の経験を扱います。</p>}
    <p className={styles.small}>役割の参考：<a href={source.url}>{source.title}</a>。困りごとは教材用に構成した例です。</p>
  </div>;
}


function AssemblyWorkGraphic({ role, index }: { role: WorkRole['id']; index: number }) {
  if (role === 'equipment' && index < 2) return <>
    <rect x="25" y="10" width="110" height="66" rx="5" fill="#e6edf1" stroke="#526775" strokeWidth="2"/>
    <path d="M42 21H105V44M99 43L105 50L111 43" fill="none" stroke="#526775" strokeWidth="4"/>
    <rect x="58" y="58" width="34" height="8" fill="#28749c"/>
    {index === 1 && <><rect x="30" y="20" width="34" height="29" fill="white" stroke="#815a20"/><path d="M35 27H58M35 34H51M35 41H56" stroke="#815a20" strokeWidth="2"/></>}
  </>;
  const outside = (role === 'process' && index === 2) || (role === 'quality' && index === 0);
  const wires = role !== 'process' || index > 0;
  return <>
    <path d="M12 65H39M121 65H148M49 65H111" stroke="#815a20" strokeWidth="5"/>
    {outside ? <rect x="27" y="25" width="106" height="45" rx="5" fill="#526775"/> : <>
      <rect x="55" y="52" width="50" height="11" fill="#28749c" stroke="#21475b"/>
      <path d="M60 51H65M95 51H100" stroke="#815a20" strokeWidth="3"/>
      {wires && <path d="M62 51Q47 16 30 63M98 51Q112 16 131 63" fill="none" stroke="#815a20" strokeWidth="2"/>}
      {role === 'quality' && <rect x="27" y="25" width="106" height="45" rx="5" fill="none" stroke="#526775" strokeWidth="2" strokeDasharray="4 4"/>}
      {role === 'process' && index === 0 && <path d="M52 44V36H108V44" fill="none" stroke="#526775" strokeDasharray="3 3"/>}
      {role === 'quality' && index === 2 && <path d="M15 8H63M15 14H54M15 20H59" stroke="#526775" strokeWidth="2"/>}
    </>}
  </>;
}
