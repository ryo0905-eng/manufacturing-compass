export const waferPreparationCopy = {
  heading: 'この丸い板は、結晶を育てるところから始まる。',
  intro: '精製済みの高純度シリコンから、回路を作る前の板を用意する体験です。CZ法による単結晶と、鏡面仕上げの一例を示します。',
  limits: '原料の精製は完了している設定です。CZ法の代表例を簡略化し、FZ法や特殊なウエハは扱いません。微量元素による電気特性の調整、温度・回転・引上げ条件、結晶の首部・肩部・尾部、冷却、面取り・方位目印、加工中の保持や洗浄の詳細を省略しています。図の寸法・凹凸・傷・色・速度は実物比例ではありません。検査項目の紹介であり、実際の測定や合格判定は行いません。',
};
const waferGuide = '/guides/semiconductor-silicon-wafer-manufacturing';
export const waferPreparationSteps = [
  { id: 'melt-silicon', verb: '高純度のシリコンを溶かす', term: '融解', before: '精製を終えた高純度のシリコンを、容器の中で溶かします。', after: '結晶を育てるための液体になりました。', explanation: '砂をそのまま溶かす工程ではありません。半導体用に精製した材料から始め、容器や加熱装置の詳細は省略しています。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'grow-crystal', verb: '種から結晶を育てる', term: '単結晶育成', before: '種結晶を液面につけ、回転させながら引き上げます。', after: '原子の並びの向きがそろった結晶の棒を育てました。', explanation: 'CZ法の模式例です。種結晶に続いて固体が成長します。液体を糸のように引き伸ばすのではありません。図の格子は原子配列の向きを示す記号です。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'shape-ingot', verb: '結晶の棒の形を整える', term: '外周加工', before: '冷やして取り出した棒を、直径がそろうように整えます。', after: '薄い円板へ切り出すための棒が整いました。', explanation: '育成後の結晶を横から見た別視点へ切り替えています。端部の切除、結晶方位の確認や方位目印などを省略した例です。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'slice-wafer', verb: '薄い円板に切り分ける', term: 'スライス', before: '結晶の棒を薄く切り、円板を取り出します。', after: '一枚のウエハを切り出しました。表面を整える加工はこれからです。', explanation: 'ワイヤによる切断の概念図です。実際の複数枚の同時切断や切断幅は省略し、一枚を取り出す様子を示します。チップに切り分ける後工程のダイシングとは対象が違います。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'lap-wafer', verb: '厚さと面の平行を整える', term: 'ラッピング', before: '切り出した板の両面を加工し、厚さや平行度を整えます。', after: '板の厚さと平行度を整えました。傷んだ表面層はまだ残っています。', explanation: '形を整える粗い研磨の役割を示します。小図は表面の凹凸や厚さの差を大きく描いた断面で、実物を切断する操作ではありません。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'remove-damage', verb: '加工で傷んだ表面層を除く', term: 'ダメージ層除去', before: '切断や機械加工で傷んだ表面付近の層を除きます。', after: '傷んだ層を取り除きました。さらに鏡面へ仕上げます。', explanation: '化学的なエッチングで表面の材料を除く工程です。汚れを洗うこととは区別します。材料を除去するため、板の厚さも少し減る描写にしています。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'polish-wafer', verb: '表面をなめらかに磨く', term: '鏡面研磨', before: '次の加工の土台になるよう、表面を細かく整えます。', after: '回路形成の土台となる、平らでなめらかな表面へ近づけました。', explanation: '化学的・機械的な働きを組み合わせた研磨を簡略化しています。配線づくりのCMPとは目的と対象が異なり、ここでは回路のないシリコンの表面を整えます。', sourceIds: ['sumco-wafer'], guide: waferGuide },
  { id: 'wafer-clean-check', verb: '洗って、表面を確かめる', term: '洗浄・検査', before: '残留物を除き、材料の板として必要な状態を確かめます。', after: '洗浄と確認項目を見ました。まだ回路のない、加工の土台です。', explanation: '粒子や表面状態、平坦度などを確認します。これは検査項目の紹介で、図がきれいになっただけで合格とは判断しません。回路の電気的な働きを試すウエハ検査とは別です。', sourceIds: ['sumco-wafer'], guide: waferGuide },
] as const;
export type WaferPreparationStepId = typeof waferPreparationSteps[number]['id'];
export const waferPreparationQuestions = [
  { id: 'seed-crystal', title: 'なぜ種から育てる？', body: '種結晶の原子配列に続くように固体を成長させ、結晶の向きをそろえるためです。図の格子はその概念を示すもので、原子を実寸で描いたものではありません。' },
  { id: 'slice-not-dice', title: 'チップに切る工程とは違う？', body: 'ここでは棒状の結晶から、回路を作る前の板を切り出します。後工程のダイシングは、回路を作り終えたウエハを一つずつのチップへ分けます。' },
  { id: 'polish-more', title: '切っただけでは使えない？', body: '厚さや平行度、加工によるダメージ、細かな凹凸や汚れを整える必要があります。形を整える、傷んだ層を除く、鏡面に磨く、洗うという役割を分けて考えます。' },
] as const;
export const waferPreparationRelated = [
  { id: 'wafer_preparation_guide', label: 'ウエハ製造を詳しく読む', href: waferGuide },
  { id: 'process_guide', label: '製造の全体像を読む', href: '/guides/semiconductor-manufacturing-process' },
  { id: 'industry_map', label: '材料に関わる企業を業界地図で見る', href: '/industry-map' },
] as const;
