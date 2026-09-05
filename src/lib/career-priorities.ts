import { priorityItems, flexibilityLabels, type PriorityId, type Intent, type Flexibility } from '../data/career-priorities';

export type PriorityNote = {
  choices: Partial<Record<PriorityId, Intent>>;
  priorities: PriorityId[];
  flexibility: Partial<Record<PriorityId, Flexibility>>;
  unordered: boolean;
  questions: PriorityId[];
};
export const emptyPriorityNote: PriorityNote = { choices: {}, priorities: [], flexibility: {}, unordered: false, questions: [] };

export function setChoice(note: PriorityNote, id: PriorityId, intent: Intent): PriorityNote {
  const choices = { ...note.choices };
  if (choices[id] !== intent) return { ...note, choices: { ...choices, [id]: intent } };
  delete choices[id];
  const flexibility = { ...note.flexibility };
  delete flexibility[id];
  return { ...note, choices, flexibility, priorities: note.priorities.filter(key => key !== id), questions: note.questions.filter(key => key !== id) };
}

export function buildPriorityNote(note: PriorityNote): string {
  const selected = priorityItems.filter(item => note.choices[item.id]);
  const priorities = note.priorities.filter(id => note.choices[id]);
  const label = (id: PriorityId) => priorityItems.find(item => item.id === id)!.label;
  const lines = (items: string[], fallback: string) => items.length ? items.map(item => `・${item}`).join('\n') : fallback;
  return [
    '私の転職の軸｜今の仮まとめ',
    '今回変えたいこと\n' + lines(selected.filter(item => note.choices[item.id] === 'change').map(item => item.label), 'まだ具体化していません'),
    '次も残したいこと\n' + lines(selected.filter(item => note.choices[item.id] === 'keep').map(item => item.label), 'まだ具体化していません'),
    `${note.unordered ? '大切にしたいこと（順位は未定）' : '今の仮の優先順位'}\n` + lines(priorities.map((id, index) => `${note.unordered ? '' : `${index + 1}. `}${label(id)} — ${flexibilityLabels[note.flexibility[id] ?? 'unsure']}`), '今は優先順位を探索中です'),
    'その他に大切にしたいこと\n' + lines(selected.filter(item => !priorities.includes(item.id)).map(item => item.label), '今のところありません'),
    'まだ迷っていること\n' + lines([
      ...(note.unordered ? ['条件の優先順位'] : []),
      ...priorities.filter(id => !note.flexibility[id] || note.flexibility[id] === 'unsure').map(id => `${label(id)}をどこまで譲れるか`),
    ], selected.length ? '必要になったら、求人や面接を通じて見直します' : '次の求人で、魅力に感じる点と気になる点を一つずつ探してみます'),
    '求人票・面接で確認したい質問\n' + lines([...priorities, ...selected.map(item => item.id).filter(id => !priorities.includes(id))].filter(id => note.questions.includes(id)).map(id => priorityItems.find(item => item.id === id)!.question), '質問はまだ選んでいません'),
    'これは今の仮まとめです。求人紹介や面接を通じて変わっても大丈夫です。',
  ].join('\n\n');
}
