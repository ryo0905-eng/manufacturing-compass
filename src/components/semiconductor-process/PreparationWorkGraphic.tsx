import type { WorkRoleId } from '@/data/semiconductor-work';

/** Bare silicon throughout: no chip grid or circuit is present at this stage. */
export function PreparationWorkGraphic({ role, index }: { role: WorkRoleId; index: number }) {
  if (role === 'process' && index === 0) return <g data-subject="crystal-to-wafer">
    <path d="M24 23V60C24 73 63 73 63 60V23" fill="#b9c6ce" stroke="#526775"/>
    <ellipse cx="43.5" cy="23" rx="19.5" ry="8" fill="#e6edf1" stroke="#526775"/>
    <path d="M73 44H92m-5 -4l5 4 -5 4" fill="none" stroke="#526775" strokeWidth="2"/>
    <ellipse cx="121" cy="47" rx="24" ry="12" fill="#d9e6ed" stroke="#526775"/>
  </g>;
  return <g data-subject="bare-wafer">
    <ellipse cx="69" cy="56" rx="45" ry="15" fill="#b9c6ce" stroke="#526775"/>
    <ellipse cx="69" cy="52" rx="45" ry="15" fill="#e6edf1" stroke="#526775"/>
    {role === 'equipment' ? <>
      <path d="M17 13H105V30M23 17V66H15" fill="none" stroke="#526775" strokeWidth="4"/>
      {index === 1 && <><rect x="112" y="9" width="34" height="45" fill="white" stroke="#526775"/><path d="M117 18H140M117 27H133M117 36H140" stroke="#28749c" strokeWidth="2"/></>}
    </> : role === 'measurement' && index === 0 ? <path d="M120 37H131V70H120M126 43V63m-4 -4l4 4 4 -4" fill="none" stroke="#815a20" strokeWidth="2"/> : <>
      {[45, 69, 93].map(x=><path key={x} d={`M${x} 18v22m-4 -4l4 4 4 -4`} fill="none" stroke="#28749c" strokeWidth="2"/>)}
    </>}
    {index === 2 && <><rect x="114" y="8" width="32" height="27" fill="white" stroke="#526775"/><path d="M119 16H141M119 24H134" stroke="#526775" strokeWidth="2"/></>}
  </g>;
}
