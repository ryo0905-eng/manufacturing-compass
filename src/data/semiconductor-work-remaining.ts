import type { WorkRole } from './semiconductor-work';

export const testingWorkSources = [
  { id: 'test', title: 'Amkor：Test Engineerの職務説明', url: 'https://amkor.com/careers/portugal/' },
  { id: 'equipment', title: 'Amkor：設備保全と電気検査の職務説明', url: 'https://amkor.com/careers/portugal/' },
  { id: 'quality', title: 'Amkor：QA Engineerの職務説明', url: 'https://amkor.com/careers/portugal/' },
] as const;
export const waferTestWorkRoles: readonly WorkRole[] = [
  {
    id: 'test', label: 'ウエハ上のテストを組み立てる', name: 'テストエンジニアなど',
    problem: '切り分ける前のチップで、どんな働きを確かめればよい？',
    investigate: '製品に必要な働きと検査項目を整理し、与える信号・受け取る応答・比較する基準をテストの手順にします。',
    people: '設計や製品の担当と検査したい内容をそろえ、装置担当と測定できる状態かを確認します。',
    next: 'テストの手順と結果を評価し、検査に使う条件を確認する。一項目が期待どおりでも、チップ全体が良いと決まるわけではありません。',
    diagram: ['電極へ接触', '信号と応答を整理', '基準と比較'],
    guide: '/guides/semiconductor-wafer-test', guideLabel: 'ウエハ検査の仕組みを詳しく読む',
  },
  {
    id: 'equipment', label: 'ウエハ検査装置を支える', name: '検査設備・装置エンジニアなど',
    problem: '同じチップを測っても、応答が安定しない。接触の状態は？',
    investigate: 'プローブと電極の接触、位置合わせ、アラームや点検記録を担当者と確認します。チップの違いと検査系の変化を切り分けます。',
    people: '製造担当に発生状況を聞き、テスト担当や装置メーカーと、どこまで確認できたかを共有します。',
    next: '装置の状態を整えた後も測定結果を確認し、点検へつなげる。良い結果が出るまで測り直して採用する仕事ではありません。',
    diagram: ['プローブと電極', '装置の記録', '接触と結果を確認'],
    guide: '/guides/equipment-engineer-route', guideLabel: '関連する設備・装置の仕事を読む',
  },
  {
    id: 'quality', label: 'ウエハ検査の結果を分析する', name: 'テスト・品質・解析のエンジニアなど',
    problem: '結果に違いがある。どの位置や条件で起きている？',
    investigate: 'ウエハ上の位置と結果、検査条件や製造記録を比べ、追加して確かめたい点を整理します。分布の見た目だけで原因を断定しません。',
    people: 'テスト担当と測定の確かさを確認し、工程や品質の担当と原因候補を共有します。',
    next: '結果と確認した範囲を記録し、次の工程や追加解析へ引き継ぐ。切り分け・組立の後にも検査が必要です。',
    diagram: ['位置と結果を対応', '条件の記録と比較', '次へ引き継ぐ'],
    guide: '/guides/quality-engineer-route', guideLabel: '関連する品質・不良解析の仕事を読む',
  },
];
export const finalTestWorkRoles: readonly WorkRole[] = [
  {
    id: 'test', label: '製品のテストを組み立てる', name: 'テストエンジニアなど',
    problem: '組立後の製品で、端子を通じて何を確かめる？',
    investigate: '製品の仕様に沿って信号・応答・基準を整理し、パッケージの端子を通したテストの手順を評価します。',
    people: '設計や製品の担当と確認項目をそろえ、組立や装置の担当と検査できる状態かを確かめます。',
    next: 'テストの条件と結果を確認して検査へつなげる。ウエハ検査の結果だけで、組立後の働きを代わりに確認することはできません。',
    diagram: ['製品の端子へ接触', '信号と応答を整理', '製品の基準と比較'],
    guide: '/guides/semiconductor-final-test', guideLabel: '最終検査の仕組みを詳しく読む',
  },
  {
    id: 'equipment', label: '最終検査装置を支える', name: '検査設備・装置エンジニアなど',
    problem: '製品をセットしたのに、測定が安定しない。装置側に変化は？',
    investigate: '製品を運ぶ装置や、端子と接触するソケット、テスタの状態を記録と照合します。製品と検査系のどちらに変化があるかを切り分けます。',
    people: '製造担当から状況を聞き、テスト担当や装置メーカーと確認を進めます。',
    next: '復旧後も測定結果を確認し、再発防止へつなげる。接触の不安定さを、そのまま製品の不良と決めつけません。',
    diagram: ['製品をソケットへ', '接触部と装置の記録', '測定状態を確認'],
    guide: '/guides/equipment-engineer-route', guideLabel: '関連する設備・装置の仕事を読む',
  },
  {
    id: 'quality', label: '最終検査の結果を分析する', name: 'テスト・品質・解析のエンジニアなど',
    problem: '基準と違う応答が出た。組立前後のどこを調べる？',
    investigate: '製品の検査結果と組立・検査条件の記録を照合し、検査系の確認や追加解析の論点を整理します。比較できる条件かも確かめます。',
    people: 'テスト・組立・品質の担当と現象を共有し、必要に応じて工程や設計の担当とも確認します。',
    next: '確認内容と対応を記録して品質の判断につなげる。一項目の一致だけで、出荷可否や長期の信頼性を自動判定するものではありません。',
    diagram: ['製品の結果を記録', '組立前後の記録を照合', '追加確認を共有'],
    guide: '/guides/quality-engineer-route', guideLabel: '品質・不良解析の仕事を詳しく読む',
  },
];
export const preparationWorkSources = [
  { id: 'process', title: 'SUMCO：生産技術・技術開発の仕事', url: 'https://www.sumcosi.com/recruit/about/job/' },
  { id: 'equipment', title: 'SUMCO：設備技術の仕事', url: 'https://www.sumcosi.com/recruit/about/job/' },
  { id: 'measurement', title: 'SUMCO：評価・分析と品質の仕事', url: 'https://www.sumcosi.com/recruit/about/job/' },
] as const;
export const preparationWorkRoles: readonly WorkRole[] = [
  {
    id: 'process', label: 'ウエハの加工条件を整える', name: 'ウエハ製造の生産技術・プロセスエンジニアなど',
    problem: '結晶から切り出した板を、狙った厚さや表面に整えるには？',
    investigate: '切断・表面加工・研磨などの前後の結果と条件を比べ、狙った状態になるかを確かめる実験を計画します。',
    people: '測定担当と評価項目をそろえ、設備や製造の担当と変化が出た段階を整理します。',
    next: '厚さや表面などを確認し、条件の改善へつなげる。ここで用意するのは加工の土台で、回路はまだありません。',
    diagram: ['結晶から板へ', '表面を整える', '加工の土台を確認'],
    guide: '/guides/production-engineering-to-semiconductor-process-engineer', guideLabel: '関連するプロセス改善の経験を読む',
  },
  {
    id: 'equipment', label: 'ウエハ製造設備を支える', name: 'ウエハ製造の設備エンジニアなど',
    problem: '加工や搬送の設備で、いつもと違う動きがある。',
    investigate: 'アラームや点検・保全の記録と発生状況を照合し、設備の変化を切り分けます。必要に応じてメーカーと調べます。',
    people: '製造担当から状況を聞き、プロセス担当と板の仕上がりへの影響を確認します。',
    next: '設備の状態と加工結果を確認し、点検や再発防止へつなげる。一人が結晶育成から全設備を担当するとは限りません。',
    diagram: ['板を加工・搬送', '設備の記録', '仕上がりも確認'],
    guide: '/guides/equipment-engineer-route', guideLabel: '関連する設備・装置の仕事を読む',
  },
  {
    id: 'measurement', label: 'ウエハの仕上がりを測る', name: 'ウエハの評価・分析・品質のエンジニアなど',
    problem: '鏡のように見える板なら、加工の土台として十分？',
    investigate: '求められる項目に応じて厚さ・平らさ・表面の状態などを評価します。測る場所や方法をそろえ、見た目だけで判断しません。',
    people: '製造・プロセスの担当と結果を共有し、測定の担当と方法やばらつきを確認します。',
    next: '確認項目と結果を整理して、次の加工へつなげる。ウエハ材料の評価と、回路を作った後の電気検査は別です。',
    diagram: ['厚さを確かめる', '表面を確かめる', '項目と結果を記録'],
    guide: '/guides/quality-engineer-route', guideLabel: '関連する品質・不良解析の仕事を読む',
  },
];
