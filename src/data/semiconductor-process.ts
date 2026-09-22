export type ExperienceId = 'thin-film' | 'assembly' | 'interconnect';
export const processRoute = '/tools/semiconductor-process';
export const processRelease = { status: 'published', updatedAt: '2026-09-22', sourcesCheckedAt: '2026-09-22' } as const;
export const PROCESS_VERSION = 'semiconductor-process-v3';
export const processCopy = {
  title: '半導体の製造工程を動かして学ぶ｜前工程・後工程の全体像',
  heading: 'この丸い板が、どうやって半導体になるの？',
  description: '薄膜加工、配線づくり＋CMP、切り分け・組み立ての3体験。動く図を止めたり戻したりしながら、ウエハから製品までを各約3〜5分で学べます。',
  limits: 'ポジ型レジストを使う加工の一例です。寸法・厚さ・速度は実物比例ではありません。熱処理、下地との削れやすさの違い（選択比）、保護膜の消耗などを簡略化しています。実設備の操作手順ではありません。',
  privacy: '操作状態はこの画面内だけで扱い、保存しません。利用状況は工程IDなどの固定分類だけを計測します。',
};
export const processSources = [
  { id: 'lam-interconnect', title: 'Lam Research：配線形成', url: 'https://www.lamresearch.com/products/our-solutions/interconnect-solutions/' },
  { id: 'applied-interconnect', title: 'Applied Materials：配線の材料と加工', url: 'https://www.appliedmaterials.com/us/en/semiconductor/markets-and-inflections/advanced-logic/interconnect.html' },
  { id: 'fujimi-cmp', title: 'フジミ：半導体デバイスの研磨', url: 'https://www.fujimiinc.co.jp/service/cmp/index.html' },
  { id: 'disco', title: 'DISCO：ブレードによる切断', url: 'https://www.disco.co.jp/eg/solution/library/dicing/basic.html' },
  { id: 'ti-assembly', title: 'TI：半導体パッケージの組立技術', url: 'https://www.ti.com/lit/pdf/snoa286' },
  { id: 'ti-flow', title: 'TI：組立と検査の流れ', url: 'https://www.ti.com/about-ti/manufacturing/assembly-test.html' },
  { id: 'asml', title: 'ASML：半導体製造の主要工程', url: 'https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps' },
  { id: 'tel', title: '東京エレクトロン：製造工程と装置の役割', url: 'https://www.tel.com/product/' },
  { id: 'optics', title: 'ASML：リソグラフィの原理', url: 'https://www.asml.com/en/technology/lithography-principles' },
] as const;
export const journey = [
  { id: 'design', label: '設計', title: 'まず、どんな働きをさせるか決める', body: '計算や記憶などの機能を回路にし、層ごとに加工する模様を用意します。', guide: '/guides/semiconductor-manufacturing-process' },
  { id: 'wafer', label: 'ウエハを用意', title: '材料の板を用意する', body: 'シリコンの結晶から薄い円板を作り、表面を平らで清浄な状態に整えます。この板をウエハと呼びます。', guide: '/guides/semiconductor-silicon-wafer-manufacturing' },
  { id: 'fabrication', label: '素子・配線を作る', title: '小さな構造を、場所を選んで作る', body: 'ウエハ上にトランジスタなどの素子と、それらをつなぐ配線を作ります。多数のチップの領域に加工を重ねる部分が、一般に前工程と呼ばれます。', guide: '/guides/semiconductor-manufacturing-process' },
  { id: 'wafer-test', label: 'ウエハで検査', title: '切り分ける前に、電気的な働きを確かめる', body: 'ウエハ上の各チップに接触して電気特性を検査します。測定・検査はこの段階だけでなく、加工の途中にもあります。', guide: '/guides/semiconductor-manufacturing-process' },
  { id: 'assembly', label: '切り分け・組み立て', title: '一つずつ分け、外部につなげる', body: 'チップを切り分け、外部と電気的につながるよう接続し、保護する形に組み立てます。代表的な後工程の一部です。', guide: '/guides/semiconductor-packaging-process' },
  { id: 'final-test', label: '最終検査', title: '組み立てた製品の働きを確かめる', body: '組み立て後の機能や性能などを検査します。製品やパッケージによって処理の順序や検査内容は異なります。', guide: '/guides/semiconductor-manufacturing-process' },
] as const;
export const processSteps = [
  { id: 'clean', verb: '表面をきれいにする', term: '洗浄', before: '表面にある不要なものが、次の加工を妨げることがあります。', after: '不要な粒子を取り除き、次の膜を作る準備ができました。', explanation: '薬液やガスなど、材料と汚れに合った方法を選びます。図の粒は汚れの模式表現で、実際の大きさではありません。', sourceIds: ['tel'], guide: '/guides/semiconductor-cleaning-process' },
  { id: 'deposit', verb: '薄い膜をつける', term: '成膜', before: '次に形を作りたい材料を、薄い膜として用意します。', after: 'シリコンの上に、加工対象となる膜ができました。', explanation: '膜には電気を通す・絶縁するなどの役割があります。ここでは加工の仕組みに集中するため、材料と成膜方式を限定しない模式図にしています。', sourceIds: ['asml', 'tel'], guide: '/guides/semiconductor-deposition-process' },
  { id: 'coat', verb: '光に反応する膜を塗る', term: 'レジスト塗布', before: '残す場所と加工する場所を分けるため、一時的な膜を重ねます。', after: '光に反応するレジストが、加工対象の膜を覆いました。', explanation: 'レジストは加工場所を決めるための感光性材料です。塗布後の乾燥・加熱などの細かな処理は省略しています。', sourceIds: ['asml', 'tel'], guide: '/guides/photolithography-process' },
  { id: 'expose', verb: '光で模様を写す', term: '露光', before: 'マスクの模様を、光学系を通してレジストへ写します。', after: '光が当たった部分の性質が変わりました。まだ穴は開いていません。', explanation: 'この例はポジ型レジストです。光が当たった部分が現像で除去されやすくなります。光で直接下の膜を削るのではありません。反応に必要な熱処理などは省略しています。', sourceIds: ['asml', 'optics'], guide: '/guides/photolithography-process' },
  { id: 'develop', verb: '現像して窓を開ける', term: '現像', before: '露光で性質が変わったレジスト部分を、現像液で除きます。', after: 'レジストに窓ができ、加工対象の膜が見えるようになりました。下の膜はまだ残っています。', explanation: '現像で形ができるのはレジストです。続くエッチングで、その開口から加工対象の膜へ形を移します。', sourceIds: ['tel', 'optics'], guide: '/guides/photolithography-process' },
  { id: 'etch', verb: '窓から下の膜を削る', term: 'エッチング', before: 'レジストの窓から、露出している加工対象の膜を取り除きます。', after: '保護された部分の膜が残り、加工対象の膜にも形ができました。', explanation: 'この図は開口の下を主に縦方向へ加工する例です。レーザーで削る図ではありません。下地で止まる様子、保護膜の消耗、加工形状は理想化しています。', sourceIds: ['asml', 'tel'], guide: '/guides/semiconductor-etching-process' },
  { id: 'strip', verb: '役目を終えた保護膜を除く', term: 'レジスト除去', before: '加工を助けたレジストは、役目を終えたので取り除きます。', after: 'レジストがなくなり、形を作った加工対象の膜が残りました。', explanation: '加工した膜まで取り除く工程ではありません。材料や残留物に応じて処理方法を選びます。', sourceIds: ['asml', 'tel'], guide: '/guides/semiconductor-cleaning-process' },
  { id: 'clean-after', verb: '表面を洗って次へ進む', term: '加工後の洗浄', before: '加工の後に残り得る不要物を除き、次の工程に備えます。', after: '作った形を保ちながら、不要物を取り除きました。これはまだ、膜に形を作った一例です。', explanation: '残留物が次の成膜や加工を妨げないようにします。単なる水洗いで何でも除去できるわけではなく、作った構造を傷めない方法を選びます。', sourceIds: ['tel'], guide: '/guides/semiconductor-cleaning-process' },
] as const;
export type ProcessStepId = typeof processSteps[number]['id'];
export const questions = [
  { id: 'protected', title: 'なぜここだけ削れる？', body: 'レジストが覆う場所を保護し、窓から見える加工対象の膜を取り除くためです。現像でレジストに窓を作り、エッチングで下の膜を加工します。この図では下地や保護膜への影響を理想化しています。' },
  { id: 'wash', title: 'なぜまた洗う？', body: '処理の後には粒子や反応の残留物などが残ることがあります。次に膜をつけたり模様を作ったりする前に、それらを材料に合った方法で除きます。洗うことと、狙った形に削ることは別の役割です。' },
] as const;
export const processRelated = [
  { id: 'process_guide', label: '全工程を詳しく読む', href: '/guides/semiconductor-manufacturing-process' },
  { id: 'industry_map', label: 'この工程に関わる企業を業界地図で見る', href: '/industry-map' },
  { id: 'lithography', label: '光で模様を写す仕組みを読む', href: '/guides/photolithography-process' },
] as const;
