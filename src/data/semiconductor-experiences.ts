import { processSteps, questions, processRelated, processCopy, type ExperienceId } from './semiconductor-process';
import { assemblySteps, assemblyQuestions, assemblyRelated, assemblyCopy } from './semiconductor-assembly';
import { interconnectSteps, interconnectQuestions, interconnectRelated, interconnectCopy } from './semiconductor-interconnect';
export type ExperienceDefinition = {
  steps: readonly { id: string; verb: string; term: string; before: string; after: string; explanation: string; sourceIds: readonly string[]; guide: string }[];
  questions: readonly { id: string; title: string; body: string }[];
  related: readonly { id: string; label: string; href: string }[];
  limits: string; label: string; locator: string; overview: number; nextOverview: number;
  summary: { eyebrow: string; title: string; paragraphs: readonly string[]; button: string; nextLabel: string; restart: string };
};
export const experiences: Record<ExperienceId, ExperienceDefinition> = {
  'thin-film': {
    steps: processSteps, questions, related: processRelated, limits: processCopy.limits, label: '前工程の一例', overview: 2, nextOverview: 3,
    locator: 'ウエハの一部分の断面を見ています。実物を切断する操作ではありません。',
    summary: { eyebrow: 'この加工の先にあるもの', title: '同じことの繰り返しに見えても、作る場所と役割が違う。', paragraphs: ['今見たのは「膜に形を作る一例」です。まだ電気的に動作するチップではありません。', '完成構造の図は別の概念図です。実際には場所・材料・目的を変え、熱処理なども含む多様な加工を重ねて素子と配線を作ります。この8工程だけを繰り返せば完成する、という意味ではありません。', 'ウエハの加工後も、電気的な検査、切り分け、外部との接続・保護、最終検査が続きます。'], button: '繰り返す意味と、その先へ →', nextLabel: '全体図で、その先を見る →', restart: '加工を最初から見直す' },
  },
  assembly: {
    steps: assemblySteps, questions: assemblyQuestions, related: assemblyRelated, limits: assemblyCopy.limits, label: '後工程の一例', overview: 4, nextOverview: 5,
    locator: '★のチップを追います。素子・配線の形成と検査を終えた別の模式例です。',
    summary: { eyebrow: '切り分け・組み立てのまとめ', title: '組立完了。次は最終検査', paragraphs: ['チップを固定する。電極を外へつなぐ。樹脂で保護する。それぞれ違う役割があります。', 'これはリードフレームとワイヤを使う一例です。組立を終えても、機能や性能を確かめる検査が必要です。'], button: '組立のまとめへ →', nextLabel: '全体図で最終検査を見る →', restart: '組み立てを最初から見直す' },
  },
  interconnect: {
    steps: interconnectSteps, questions: interconnectQuestions, related: interconnectRelated, limits: interconnectCopy.limits, label: '配線づくりの一例', overview: 2, nextOverview: 3,
    locator: interconnectCopy.intro,
    summary: { eyebrow: '配線づくりとCMPのまとめ', title: '場所や材料を変えて、さらに層を重ねる', paragraphs: ['穴で上下の配線をつなぎ、絶縁膜で左右を隔てます。CMPで除いたのは表面の余分な金属と導電性下地で、溝・穴の中の必要な材料は残っています。', '次の層も、つなぐ場所・材料・目的を変えて作ります。同じ形を重ねるだけで完成するわけではありません。この先もウエハ検査や組立が続きます。'], button: '配線のまとめへ →', nextLabel: '全体図でウエハ検査を見る →', restart: '配線づくりを最初から見直す' },
  },
};
