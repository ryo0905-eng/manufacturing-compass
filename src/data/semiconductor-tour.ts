import type { ExperienceId } from './semiconductor-process';

export const tourStops: readonly { id: ExperienceId; label: string; purpose: string }[] = [
  { id: 'wafer-preparation', label: 'ウエハを用意する', purpose: '結晶から、加工の土台になる丸い板へ。' },
  { id: 'thin-film', label: '膜に形を作る', purpose: '光で模様を写し、残す場所と取り除く場所を分けます。' },
  { id: 'interconnect', label: '配線をつくる', purpose: '必要な場所をつなぎ、隣り合う配線は隔てます。' },
  { id: 'wafer-test', label: 'ウエハで検査する', purpose: '切り分ける前に、チップの働きを確かめます。' },
  { id: 'assembly', label: '切り分け・組み立て', purpose: '一つのチップを取り出し、固定・接続・保護します。' },
  { id: 'final-test', label: '最後に検査する', purpose: '組み立てた後も、製品の働きを確かめます。' },
];
export const tourRecap = [
  { title: '板を作る', body: '結晶からウエハを用意する。まだ回路はありません。' },
  { title: '回路を作る', body: '場所・材料・目的を変えて、多様な加工を重ねます。膜に形を作る体験は、その一例です。' },
  { title: 'つなぐ・守る', body: '配線で必要な場所をつなぎ、組立ではチップを外部端子につないで保護します。固定と接続は別の役割です。' },
  { title: '確かめる', body: 'ウエハ上でも、組み立てた後でも検査します。検査は最後だけではありません。' },
] as const;
