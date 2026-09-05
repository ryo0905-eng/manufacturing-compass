export const priorityGroups = [
  { id: 'location', label: '勤務地', items: [
    { id: 'stay', label: '引っ越さずに働く', question: '初期配属先と、将来の転勤範囲を教えてください。' },
    { id: 'region', label: '希望する地域で働く', question: '希望地域での配属は、どの段階で確認できますか？' },
    { id: 'overseas', label: '海外で働く', question: '海外で働く機会と、赴任の条件・期間を教えてください。' },
  ] },
  { id: 'work', label: '仕事内容', items: [
    { id: 'experience', label: '今の経験を生かす', question: 'これまでの経験を、どの担当業務で生かせますか？' },
    { id: 'challenge', label: '新しい領域に挑戦する', question: '入社後に担当する業務と、その割合を教えてください。' },
    { id: 'scope', label: '担当業務を明確にする', question: '担当業務の範囲と、他部門との分担を教えてください。' },
  ] },
  { id: 'reward', label: '給与・待遇', items: [
    { id: 'fixed', label: '固定給を重視する', question: '提示年収のうち、基本給・固定手当・変動報酬の内訳を確認できますか？' },
    { id: 'living', label: '手当・住居費を含めた生活条件を重視する', question: '手当・住居補助の適用条件と、自己負担になる費用を教えてください。' },
    { id: 'stable', label: '報酬の安定性を重視する', question: '賞与などの変動部分は、どのような条件で決まりますか？' },
  ] },
  { id: 'style', label: '働き方', items: [
    { id: 'hours', label: '労働時間を重視する', question: '通常期と繁忙期の労働時間、休日対応の頻度を教えてください。' },
    { id: 'travel', label: '出張・交替勤務の条件を重視する', question: '出張の頻度・期間と、交替勤務の有無を教えてください。' },
    { id: 'flexible', label: '柔軟な勤務制度を重視する', question: 'この職種で実際に利用できる柔軟な勤務制度と、利用条件を教えてください。' },
  ] },
  { id: 'culture', label: '職場文化', items: [
    { id: 'decisions', label: '意思決定の手順が明確', question: '改善提案から実行まで、通常どのように意思決定しますか？' },
    { id: 'meetings', label: '会議の目的が明確', question: 'この職種の定例会議は、どの程度あり、何を決めていますか？' },
    { id: 'ownership', label: '役割・裁量が明確', question: '入社後半年で期待される成果と、自分で判断できる範囲を教えてください。' },
  ] },
] as const;
export const priorityItems = priorityGroups.flatMap(group => [...group.items]);
export type PriorityId = typeof priorityGroups[number]['items'][number]['id'];
export type Intent = 'change' | 'keep';
export type Flexibility = 'required' | 'flexible' | 'unsure';
export const flexibilityLabels: Record<Flexibility, string> = { required: '必須', flexible: '条件次第', unsure: 'まだ迷う' };
