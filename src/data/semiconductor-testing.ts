export type TestingMode = 'wafer-test' | 'final-test';
export const testingCopy = {
  heading: '見た目が同じでも、電気の働きは同じ？',
  limits: '架空の回路が入力0・1を反転して返す、機能試験の一項目だけを示します。値は教材用の固定例です。電源・接地・多数の端子、接触の調整、温度、電圧・電流・速度の測定、他の試験は省略しています。一項目の一致だけで製品全体の合格や出荷を判断しません。寸法・速度は実物比例ではありません。',
};
export const testPattern = [
  { input: 0, expected: 1, response: 1 },
  { input: 1, expected: 0, response: 0 },
  { input: 0, expected: 1, response: 1 },
  { input: 1, expected: 0, response: 0 },
] as const;
export const testingModes = ['wafer-test', 'final-test'] as const;
export const testingLessons = {
  'wafer-test': {
    heading: '切り分ける前に、ウエハの上で確かめる',
    intro: '回路形成を終えたウエハの別の模式例です。★のチップだけに注目します。',
    overview: 3, nextOverview: 4,
    steps: [
      { id: 'wafer-position', verb: '調べるチップの位置を合わせる', term: '位置合わせ', before: 'ウエハを保持し、調べるチップを接触部の下へ合わせます。', after: '★のチップの電極位置が合いました。まだ測っていません。', explanation: 'プローバはウエハの搬送・保持・位置合わせを担います。表面のキズをカメラで探す外観検査とは別の体験です。' },
      { id: 'wafer-contact', verb: '電極に針を接触させる', term: 'プローブ接触', before: 'プローブカードの針と電極を接触させ、電気の通り道を作ります。', after: '接触しました。触れただけでは働きは分かりません。', explanation: '図は相対的な接近を示す模式図です。針で穴を開ける加工ではありません。実際の電極・針の本数や接触調整は省略しています。' },
      { id: 'wafer-measure', verb: '信号を送り、応答を受け取る', term: '電気的な測定', before: 'テスタが入力を与え、返ってくる応答を受け取ります。', after: 'この教材の4つの応答がそろいました。次に期待と比べます。', explanation: 'テスタは電源や信号を与えて応答を測る装置です。この例では入力と反対の0・1が返るかを見るだけで、実製品の測定条件ではありません。' },
      { id: 'wafer-record', verb: '応答を比べ、位置と結果を記録する', term: '比較・ウエハマップ', before: '期待する応答と比べ、チップの座標と結果を対応付けます。', after: '★のチップは、この項目では一致。位置と一緒に記録しました。', explanation: '実際には必要な試験を行い、その結果を組立対象の選別や解析へ渡します。図の他のチップは未確認です。色や見た目で良否を決めていません。' },
    ],
  },
  'final-test': {
    heading: '組み立てた後も、外側の端子から確かめる',
    intro: '組立を終えた別のパッケージの模式例です。前のウエハ検査と同じ製品を追跡するデータではありません。',
    overview: 5, nextOverview: 4,
    steps: [
      { id: 'package-position', verb: '製品を検査する位置へ運ぶ', term: '搬送・位置合わせ', before: '組立済みのパッケージを、テストソケットの位置へ運びます。', after: '外側の端子と検査位置が合いました。まだ測っていません。', explanation: 'ハンドラは製品の搬送などを担います。図では1個のパッケージと代表の端子だけを示します。' },
      { id: 'package-contact', verb: '外側の端子を接触させる', term: 'ソケット接触', before: 'ソケットを介して、外側の端子をテスタにつなぎます。', after: 'パッケージの外側から、電気的につながりました。', explanation: 'ウエハ上の電極へ針で触れる場合と、接触する対象が違います。樹脂を剥がして内部を見る試験ではありません。' },
      { id: 'package-measure', verb: '外側から信号を送り、応答を受け取る', term: '組立後の測定', before: '組立後の状態で、信号に対する応答を測ります。', after: 'この教材の4つの応答がそろいました。次に期待と比べます。', explanation: '組立後の接続を含めた状態で働きを確認します。実際には機能・電気特性・速度など、製品に応じた複数の項目と条件を使います。' },
      { id: 'package-record', verb: '応答を比べ、製品の結果を記録する', term: '比較・結果記録', before: '期待する応答との比較結果を、対象の製品と対応付けます。', after: 'この項目では一致。組立後の確認結果を記録しました。', explanation: 'これは一項目の教材例です。必要な検査全体の結果に基づいて分類や次の処理を決めます。この表示だけで出荷可能とは判断しません。' },
    ],
  },
} as const;
export const testingQuestions = [
  { id: 'contact-only', title: '触れるだけで分かる？', body: '接触は電気の通り道を作る準備です。信号を与え、応答を測り、期待や規格と比べることで働きを確かめます。' },
  { id: 'test-twice', title: 'なぜ組立の前と後で調べる？', body: 'ウエハ上では切り分ける前の回路を調べ、結果を組立対象の選別などへ使います。組立後は外部端子から、組み立てられた状態で働きを確認します。対象と目的が異なり、試験項目も必ず同じではありません。' },
  { id: 'one-item', title: '一致したら、全部大丈夫？', body: 'この例で確かめたのは一つの機能だけです。他の機能、電圧・電流、動作速度などは未確認で、この結果だけでは製品全体の合格や寿命を保証できません。' },
] as const;
export function testingSteps(mode: TestingMode) {
  return testingLessons[mode].steps.map(step => ({ ...step, sourceIds: ['advantest-ate', 'advantest-glossary'], guide: mode === 'wafer-test' ? '/guides/semiconductor-wafer-test' : '/guides/semiconductor-final-test' }));
}
export const testingRelated = [
  { id: 'wafer_test_guide', label: 'ウエハ検査を詳しく読む', href: '/guides/semiconductor-wafer-test' },
  { id: 'final_test_guide', label: '最終検査を詳しく読む', href: '/guides/semiconductor-final-test' },
  { id: 'industry_map', label: '検査に関わる企業を業界地図で見る', href: '/industry-map' },
] as const;
