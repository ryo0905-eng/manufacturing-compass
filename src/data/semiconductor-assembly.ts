export const assemblyCopy = {
  heading: '小さなチップを、外とつながる製品にする',
  intro: 'ここからは、素子・配線の形成と検査を終えた別の模式例です。リードフレームとワイヤを使う組立を体験します。',
  limits: 'リードフレームにワイヤで接続する一例です。薄化、切断後の洗浄・乾燥、加熱・硬化、表面処理、刻印などは省略しています。寸法・速度は実物比例ではなく、全製品に共通する製造手順ではありません。',
};
export const assemblySteps = [
  { id: 'mount-tape', verb: 'ウエハを支える', term: 'テープ固定', before: '切断後もチップを保持できるよう、裏側を支えます。', after: '保持テープがウエハを支えています。', explanation: 'テープとリングフレームで保持します。図の格子はチップの境界で、まだ切れていません。', sourceIds: ['ti-assembly'], guide: '/guides/semiconductor-dicing-process' },
  { id: 'dice', verb: 'チップの境目を切る', term: 'ダイシング', before: '回路の間にある切断用の通り道に刃を合わせます。', after: 'チップが分離しました。テープが位置を保ちます。', explanation: 'ブレード切断の一例です。チップ内部を切るのではなく、境界の通り道を加工します。切断後の洗浄・乾燥は省略しています。', sourceIds: ['disco'], guide: '/guides/semiconductor-dicing-process' },
  { id: 'pick', verb: '一つのチップを取り出す', term: 'ピックアップ', before: '検査結果に基づいて選ばれた、印付きのチップを取り出します。', after: '同じ印のチップがテープから離れました。', explanation: '図の印は対象を追うための目印です。見た目で良否を判定しているわけではありません。取出しの補助機構は省略しています。', sourceIds: ['ti-assembly'], guide: '/guides/semiconductor-dicing-process' },
  { id: 'attach', verb: '土台に載せて固定する', term: 'ダイ固定', before: 'チップをリードフレームの搭載部へ運びます。', after: 'チップを固定しました。信号端子はまだつながっていません。', explanation: '搭載部と接合材でチップを支えます。固定と、チップ上の信号電極を外部端子へつなぐことは別の役割です。', sourceIds: ['ti-assembly'], guide: '/guides/semiconductor-packaging-process' },
  { id: 'wire', verb: '細い線でつなぐ', term: 'ワイヤ接続', before: 'チップの電極と外部端子につながる部分を結びます。', after: '細いワイヤで電気的な接続ができました。', explanation: '両端を接合して細い線で結びます。ここでは代表の2本だけを描き、接合方法や工具の細部は省略します。', sourceIds: ['ti-assembly'], guide: '/guides/semiconductor-packaging-process' },
  { id: 'mold', verb: '樹脂で包んで保護する', term: '樹脂封止', before: 'チップとワイヤを外からの影響から保護します。', after: '樹脂の中に、チップと接続したワイヤが残っています。', explanation: '型内で樹脂により覆う工程を簡略化しています。「中を見る」は内部を示す模式表示で、樹脂が透明になる工程ではありません。', sourceIds: ['ti-assembly'], guide: '/guides/semiconductor-packaging-process' },
  { id: 'trim-form', verb: '外側の端子を整える', term: '分離・端子成形', before: '支持部分から分離し、外部へつなぐ端子の形を整えます。', after: '組立完了。次は最終検査です。', explanation: '外側の支持部分を除き、端子を成形する例です。組立が終わっても機能や性能の検査が必要です。', sourceIds: ['ti-assembly'], guide: '/guides/semiconductor-packaging-process' },
] as const;
export type AssemblyStepId = typeof assemblySteps[number]['id'];
export const assemblyQuestions = [
  { id: 'tape-support', title: '切ったらバラバラにならない？', body: '裏側の保持テープが、分離後もチップの位置を保ちます。選んだチップを取り出すまでは、その上で支えます。' },
  { id: 'connection', title: '載せるだけでは使えない？', body: '固定はチップを支えるための工程です。この例では、信号電極と外部端子をワイヤでつなぐ工程が別に必要です。' },
  { id: 'protection', title: '樹脂で隠して大丈夫？', body: '接続を終えてから樹脂で保護します。内部のチップとワイヤは残り、外部端子は接続に使えます。組立後は電気的な働きも検査します。' },
] as const;
export const assemblyRelated = [
  { id: 'dicing_guide', label: '切り分けを詳しく読む', href: '/guides/semiconductor-dicing-process' },
  { id: 'packaging_guide', label: '組み立てを詳しく読む', href: '/guides/semiconductor-packaging-process' },
  { id: 'industry_map', label: '関連企業を業界地図で見る', href: '/industry-map' },
] as const;
