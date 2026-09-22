import type { WorkRoleId } from '@/data/semiconductor-work';

/** Decorative teaching sketches. The surrounding captions carry their meaning. */
export function InterconnectWorkGraphic({ role, index }: { role: WorkRoleId; index: number }) {
  if (role === 'equipment' && index < 2) return <>
    <rect x="48" y="18" width="64" height="20" rx="3" fill="#b9c6ce" stroke="#526775" strokeWidth="2"/>
    <path d="M45 41H115" stroke="#b5803a" strokeWidth="5"/>
    <rect x="23" y="45" width="114" height="10" fill="#d9e6ed" stroke="#526775" strokeWidth="2"/>
    <path d="M32 62H124m-7 -5l7 5 -7 5M43 57l-7 5 7 5" fill="none" stroke="#526775" strokeWidth="2"/>
    <path d="M22 20H34V29" fill="none" stroke="#28749c" strokeWidth="3"/>
    <path d="M34 32Q25 44 34 44Q43 44 34 32" fill="#28749c"/>
    {index === 1 && <><rect x="99" y="7" width="40" height="29" fill="white" stroke="#526775"/><path d="M104 14H133M104 21H126M104 28H130" stroke="#526775" strokeWidth="2"/></>}
  </>;
  const blanket = role === 'process' && index === 0;
  return <>
    <rect x="20" y="32" width="120" height="43" fill="#e6edf1" stroke="#667985"/>
    {[29, 93].map(x => <g key={x}>
      <rect x={x} y="64" width="38" height="8" fill="#b5803a" stroke="#704c1f"/>
      <path d={`M${x+5} 32h28v16h-10v16h-8V48h-10Z`} fill="#dbb978" stroke="#704c1f"/>
      <path d={`M${x+8} 40l5 -5m2 10l9 -9`} fill="none" stroke="#704c1f"/>
    </g>)}
    {blanket && <rect x="20" y="24" width="120" height="8" fill="#dbb978" stroke="#704c1f"/>}
    {role === 'process' && index === 1 && <path d="M20 24H140" stroke="#704c1f" strokeDasharray="4 4"/>}
    {role === 'process' && index === 2 && <path d="M48 37V68M112 37V68" fill="none" stroke="#1f4b68" strokeWidth="2" strokeDasharray="3 2"/>}
    {role === 'measurement' && <>
      {[48, 80, 112].map(x => <path key={x} d={`M${x} 10v15m-4 -5l4 5 4 -5`} fill="none" stroke="#28749c" strokeWidth="2"/>)}
      {index > 0 && <path d="M38 6H122" stroke="#28749c" strokeDasharray="3 3"/>}
      {index === 2 && <path d="M65 78H96M65 83H87" stroke="#526775" strokeWidth="2"/>}
    </>}
  </>;
}
