import type { WorkRoleId } from '@/data/semiconductor-work';

/** Contact geometry differs before/after assembly; no numeric test results are fabricated. */
export function TestingWorkGraphic({ mode, role, index }: { mode: 'wafer-test' | 'final-test'; role: WorkRoleId; index: number }) {
  const wafer = mode === 'wafer-test';
  const contact = role !== 'quality' && index === 0;
  return <>
    {wafer ? <g data-subject="wafer-electrodes">
      <ellipse cx="64" cy="57" rx="43" ry="18" fill="#d9e6ed" stroke="#526775"/>
      {[42, 59, 76].map(x=><rect key={x} x={x} y="49" width="12" height="10" fill="none" stroke="#526775"/>)}
      <path d="M45 49H49M62 49H66M79 49H83" stroke="#815a20" strokeWidth="3"/>
      {contact && <path d="M35 16L47 49M54 16L64 49M75 16L81 49" fill="none" stroke="#815a20" strokeWidth="2"/>}
    </g> : <g data-subject="package-terminals">
      <rect x="23" y="41" width="82" height="32" rx="4" fill="#e6edf1" stroke="#526775"/>
      <rect x="38" y="34" width="50" height="27" rx="3" fill="#526775"/>
      {[44, 57, 70, 83].map(x=><path key={x} d={`M${x} 61v8`} stroke="#815a20" strokeWidth="3"/>)}
      {contact && <path d="M22 25H32V54M105 25H96V54" fill="none" stroke="#28749c" strokeWidth="2"/>}
    </g>}
    {role === 'equipment' && index === 1 ? <g data-view="equipment-record">
      <rect x="101" y="8" width="44" height="52" fill="white" stroke="#526775"/>
      <path d="M107 18H138M107 27H132M107 36H138M107 45H129" stroke="#526775" strokeWidth="2"/>
    </g> : <g data-view={role === 'quality' ? 'result-record' : 'test-plan'}>
      <rect x="108" y="13" width="40" height="43" rx="3" fill="white" stroke="#526775"/>
      <path d="M114 22H141M114 31H134M114 40H141" stroke="#28749c" strokeWidth="2"/>
      <path d="M82 22H103m-5 -4l5 4 -5 4M103 31H82m5 -4l-5 4 5 4" fill="none" stroke="#815a20"/>
    </g>}
    {index === 2 && <path d="M110 67H144m-5 -4l5 4 -5 4" stroke="#526775" fill="none" strokeWidth="2"/>}
  </>;
}
