import Link from 'next/link';
import { type WorkRole, workSources } from '@/data/semiconductor-work';
import styles from './process.module.css';

/** Static, independent visual: selecting a role never changes the process simulation. */
export function WorkRolePanel({ role, onRelated }: { role: WorkRole; onRelated: () => void }) {
  const source = workSources.find(item => item.id === role.id)!;
  return <div id="thin-film-work-panel" className={styles.workPanel} role="region" aria-label={role.label}>
    <h4>{role.name}</h4>
    <p className={styles.small}>役割を考えるための模式図。実際の測定値や故障を示すものではありません。</p>
    <ol className={styles.workFlow} aria-label="仕事の見方">
      {role.diagram.map((caption, index) => <li key={caption}>
        <svg viewBox="0 0 160 86" aria-hidden="true" focusable="false">
          {role.id === 'process' ? <>
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
