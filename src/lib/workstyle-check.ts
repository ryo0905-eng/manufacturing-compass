import { workstyleRoles, workstyleConditions, concernLevels, confirmationLabels, workstyleBasis, type WorkstyleRole, type WorkstyleCondition, type ConcernLevel, type Confirmation } from '../data/workstyle-check';

export type WorkstyleNote = {
  roles: WorkstyleRole[];
  conditions: Partial<Record<WorkstyleCondition, ConcernLevel>>;
  excluded: string[];
  confirmations: Record<string, Confirmation>;
};
export const emptyWorkstyleNote: WorkstyleNote = { roles: [], conditions: {}, excluded: [], confirmations: {} };
export function getWorkstyleCards(note: WorkstyleNote) {
  const roles = note.roles.length ? workstyleRoles.filter(role => note.roles.includes(role.id)) : [{ id: 'unknown', label: '職種は未定' } as const];
  return workstyleConditions.filter(condition => note.conditions[condition.id]).sort((a, b) => Number(note.conditions[b.id] === 'avoid') - Number(note.conditions[a.id] === 'avoid')).flatMap(condition => roles.map(role => ({
    id: `${role.id}:${condition.id}`, role: role.label, condition: condition.label,
    level: concernLevels[note.conditions[condition.id]!], posting: condition.posting,
    question: role.id === 'unknown' ? condition.common : condition.questions[role.id],
  })));
}
export function updateWorkstyleSelection(note: WorkstyleNote, roles: WorkstyleRole[], conditions: WorkstyleNote['conditions']): WorkstyleNote {
  const next = { ...note, roles: [...new Set(roles)].slice(0, 2), conditions: Object.fromEntries(Object.entries(conditions).filter(([, value]) => value).slice(0, 3)) };
  const ids = new Set(getWorkstyleCards(next).map(card => card.id));
  return { ...next, excluded: note.excluded.filter(id => ids.has(id)), confirmations: Object.fromEntries(Object.entries(note.confirmations).filter(([id]) => ids.has(id))) };
}
export function buildWorkstyleNote(note: WorkstyleNote) {
  const cards = getWorkstyleCards(note);
  return [
    '半導体の仕事・働き方｜確認メモ',
    '検討する仕事：' + (note.roles.length ? workstyleRoles.filter(role => note.roles.includes(role.id)).map(role => role.label).join('／') : 'まだ分からない'),
    '重視する条件\n' + (workstyleConditions.filter(condition => note.conditions[condition.id]).map(condition => `・${condition.label}：${concernLevels[note.conditions[condition.id]!]}`).join('\n') || 'まだ選んでいません'),
    '求人・現職の条件についての本人の確認状況（サイトが確認した事実ではありません）\n' + cards.map(card => `・${card.role}／${card.condition}：${confirmationLabels[note.confirmations[card.id] ?? 'unknown']}`).join('\n'),
    '持ち帰る質問（編集上の確認提案）\n' + (cards.filter(card => !note.excluded.includes(card.id)).map(card => `【${card.role}／${card.condition}】\n求人票で見る項目：${card.posting}\n${card.question}`).join('\n\n') || '質問は選んでいません。'),
    '不明な条件は、ないとは限りません。企業・部署・拠点・雇用形態ごとに確認してください。確認した求人名・確認日・回答者は、コピー後に手元で追記してください。',
    '次の行動：現職で条件や担当変更を確認する／求人の不明点を確認する／条件に合わなければ応募を保留・見送る。転職するかは今決めなくても大丈夫です。',
    `質問の更新日：${workstyleBasis.updatedAt}\n参考資料（個別求人の条件を保証しません）：${workstyleBasis.source.url}`,
  ].join('\n\n');
}
