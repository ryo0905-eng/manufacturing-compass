import type { ExperienceId } from './semiconductor-process';
// Fictional situations illustrate roles; they are not incident reports or operating procedures.
export const workRelease = { updatedAt: '2026-09-22', version: 'thin-film-work-v1' } as const;
export const workSources = [
  { id: 'process', title: '東京エレクトロン：Process Engineerの職務説明', url: 'https://www.tel.com/careers/nkdco10000002rdz-att/JD_ProcessEngineer.pdf' },
  { id: 'equipment', title: '東京エレクトロン：フィールドエンジニアの仕事', url: 'https://www.tel.co.jp/blog/all/20260324_001.html' },
  { id: 'measurement', title: 'Micron：Metrology Applications Engineerの職務説明', url: 'https://micron.wd1.myworkdayjobs.com/en-US/External/job/Metrology-Applications-Engineer_JR89915' },
] as const;
export const workRoles = [
  {
    id: 'process', label: '加工条件を整える', name: 'プロセスエンジニアなど',
    problem: '加工した膜の形が、狙った形と違って見える。',
    investigate: '加工前後の測定結果と条件の記録を比べ、どの条件が形に影響したかを確かめる実験を計画します。',
    people: '測定担当と形の違いを共有し、装置担当と装置の状態を確認します。',
    next: '結果を比較して、次に試す条件と確認項目を整理する。条件を変えたら必ず良くなる、とは限りません。',
    diagram: ['狙った形', '加工した形を測る', '記録と比べる'],
    guide: '/guides/production-engineering-to-semiconductor-process-engineer', guideLabel: 'プロセスエンジニアにつながる経験を読む',
  },
  {
    id: 'equipment', label: '装置の調子を保つ', name: '設備・装置エンジニア、フィールドエンジニアなど',
    problem: '同じ条件で加工しているのに、装置の様子がいつもと違う。',
    investigate: 'アラームや点検・保全の記録をたどり、変化した箇所を絞ります。必要に応じて装置メーカーと調べます。',
    people: '製造担当から異常が起きた状況を聞き、プロセス担当と加工への影響を確認します。',
    next: '状態を整えた後も、加工結果を確認し、再発を防ぐ点検につなげる。工場内の設備担当とメーカーの支援担当では役割が異なります。',
    diagram: ['加工する装置', '状態の記録を見る', '担当者と切り分ける'],
    guide: '/guides/equipment-engineer-route', guideLabel: '設備・装置の仕事につながる経験を読む',
  },
  {
    id: 'measurement', label: '測定・検査で確かめる', name: '計測・検査のエンジニアなど',
    problem: '膜の形の違いは、本当の変化？ 測り方の違い？',
    investigate: 'どこを、どう測るかをそろえ、繰り返し測った結果も見ます。測定方法が比較の目的に合うかを確かめます。',
    people: 'プロセス担当と知りたい差を整理し、装置担当と測定装置の状態を確認します。',
    next: '測定の結果と注意点を共有して、追加測定や加工条件の確認へつなげる。測定だけで原因や製品全体の合否が決まるわけではありません。',
    diagram: ['同じ場所を決める', '測り方をそろえる', '結果の違いを比べる'],
    guide: '/guides/quality-engineer-route', guideLabel: '関連する品質・不良解析の仕事も読む',
  },
] as const;
export type WorkRoleId = WorkRole['id'];
export type WorkRole = {
  id: 'process' | 'equipment' | 'measurement' | 'quality'; label: string; name: string;
  problem: string; investigate: string; people: string; next: string;
  diagram: readonly string[]; guide: string; guideLabel: string;
};
export const workNote = '架空の困りごとで仕事の役割を紹介しています。職種名・担当範囲は会社や部門によって異なり、一人で完結せず連携して進めます。実設備の操作手順や適職の判定ではありません。';

export const assemblyWorkSources = [
  { id: 'process', title: 'Amkor：Assembly Process Engineerの職務説明', url: 'https://amkor.com/careers/vietnam/' },
  { id: 'equipment', title: 'Amkor：Wire Bond Equipment Engineerの職務説明', url: 'https://amkor.com/careers/malaysia/' },
  { id: 'quality', title: 'Amkor：Customer Quality Engineerの職務説明', url: 'https://amkor.com/careers/vietnam/' },
] as const;
export const assemblyWorkRoles: readonly WorkRole[] = [
  {
    id: 'process', label: '組立条件を整える', name: '組立プロセスエンジニアなど',
    problem: 'チップを固定する位置が、狙った位置からずれて見える。',
    investigate: '組立前後の結果と材料・条件の記録を比べ、どの段階で違いが出たかを整理します。条件を確かめる実験と評価項目を計画します。',
    people: '装置担当と位置決めの状態を確認し、品質担当と製品に必要な確認項目をそろえます。',
    next: '固定・接続・保護をそれぞれ確認し、変更した条件の効果を評価する。固定できただけでは電気的な接続は完成しません。',
    diagram: ['固定する位置', 'ワイヤで接続', '樹脂で保護'],
    guide: '/guides/production-engineering-to-semiconductor-process-engineer', guideLabel: '関連するプロセス改善の経験を読む',
  },
  {
    id: 'equipment', label: '組立装置の調子を保つ', name: '組立設備・装置エンジニアなど',
    problem: 'ワイヤをつなぐ装置で、いつもと違う停止が起きる。',
    investigate: '停止時の状況、アラーム、点検・保全の記録をたどり、装置の変化を切り分けます。必要に応じてメーカーと調べます。',
    people: '製造担当に発生状況を聞き、プロセス担当と装置の状態が接続に与える影響を確認します。',
    next: '復旧後の接続結果も確認し、点検や再発防止へつなげる。装置が動くことと、狙った接続ができることは別の確認です。',
    diagram: ['接続する装置', '状態の記録', '接続結果を確認'],
    guide: '/guides/equipment-engineer-route', guideLabel: '設備・装置の仕事につながる経験を読む',
  },
  {
    id: 'quality', label: '組立後の品質を確かめる', name: '品質・不良解析のエンジニアなど',
    problem: '樹脂で覆った後、内部の接続も保たれているか知りたい。',
    investigate: '確かめたい項目に応じて検査や解析の担当と確認方法を整理し、組立条件や材料の記録と結果を照合します。外観だけで内部の状態を決めつけません。',
    people: 'プロセス担当・検査や解析の担当と、現象と原因候補を共有します。必要に応じて装置や材料の担当とも調べます。',
    next: '追加確認や対策後の評価、再発防止へつなげる。組立の確認後も最終検査が必要で、一つの検査だけで製品全体の品質を保証するわけではありません。',
    diagram: ['外観を見る', '内部も調べる（模式図）', '記録と照合'],
    guide: '/guides/quality-engineer-route', guideLabel: '品質・不良解析の仕事につながる経験を読む',
  },
];
export type WorkExperienceId = 'thin-film' | 'assembly';
type WorkLesson = {
  experience: WorkExperienceId; version: string; intro: string;
  roles: readonly WorkRole[];
  sources: readonly { id: string; title: string; url: string }[];
};
export const workLessons: Partial<Record<ExperienceId, WorkLesson>> = {
  'thin-film': { experience: 'thin-film', version: workRelease.version, intro: '狙った形を作り続けるために、どんな仕事があるのでしょう。気になる役割を選んでみてください。', roles: workRoles, sources: workSources },
  assembly: { experience: 'assembly', version: 'assembly-work-v1', intro: '固定する・電気的につなぐ・保護する。それぞれを安定して行うために、どんな人が関わるのでしょう。', roles: assemblyWorkRoles, sources: assemblyWorkSources },
};
