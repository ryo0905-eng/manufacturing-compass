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
export type WorkRoleId = typeof workRoles[number]['id'];
export type WorkRole = typeof workRoles[number];
export const workNote = '架空の困りごとで仕事の役割を紹介しています。職種名・担当範囲は会社や部門によって異なり、一人で完結せず連携して進めます。実設備の操作手順や適職の判定ではありません。';
