export const interconnectCopy = {
  heading: '金属を埋めて、余分な部分を磨く。これが配線になる。',
  intro: '下層配線ができている別の模式例です。薄膜加工の完成図が、そのままこの構造になるわけではありません。',
  limits: '銅系の埋め込み配線の一例です。溝・穴の形成は複数の露光・現像・加工をまとめ、下地は拡散防止・形成を助ける複数の薄膜をまとめています。CMPも表面の金属と導電性下地を除く複数の処理を簡略化しています。停止膜、熱処理、材料ごとの除去速度、実際の寸法・凹凸・加工条件は再現していません。',
};
export const interconnectSteps = [
  { id: 'dielectric', verb: '絶縁する膜を重ねる', term: '絶縁膜形成', before: '下層配線の上に、電気を隔てる材料を重ねます。', after: '配線同士を隔てる絶縁膜ができました。', explanation: '下層の配線はすでにできている設定です。絶縁膜は、必要な場所以外で配線がつながらないようにします。', sourceIds: ['lam-interconnect'], guide: '/guides/semiconductor-interconnect-process' },
  { id: 'trench-via', verb: '配線の溝と接続する穴を作る', term: '溝・ビア形成', before: '横方向の溝と、下の配線へ届く接続穴を用意します。', after: '溝と上下をつなぐ穴（ビア）ができました。', explanation: '複数の露光・現像・加工を一つの動きにまとめています。実際の形成順は方式により異なります。穴は下層配線の位置に合わせます。', sourceIds: ['applied-interconnect', 'lam-interconnect'], guide: '/guides/semiconductor-interconnect-process' },
  { id: 'liner', verb: '内側に薄い下地を作る', term: '下地形成', before: '金属を埋める前に、内壁と表面に薄膜を作ります。', after: '拡散を抑え、後の金属形成を助ける下地ができました。', explanation: '役割の異なる複数の薄膜を一つの模様で示します。この例の下地は導電性を持ち、表面に残したままでは隣り合う配線を分離できません。', sourceIds: ['applied-interconnect'], guide: '/guides/semiconductor-interconnect-process' },
  { id: 'fill-metal', verb: '金属で埋める', term: '金属充填', before: '溝と穴の中を金属で満たします。', after: '内部は埋まりましたが、表面にも余分な金属が残っています。', explanation: '銅系の埋め込みを理想化しています。気泡や空隙なく埋まる正常例で、表面の金属は左右に連続した状態です。', sourceIds: ['lam-interconnect', 'applied-interconnect'], guide: '/guides/semiconductor-interconnect-process' },
  { id: 'cmp', verb: '表面の余分な部分を磨く', term: 'CMP', before: '表面の余分な金属と導電性下地を取り除きます。', after: '上下の接続を保ちながら、左右の配線を隔てました。', explanation: '研磨液の化学的な働きとパッドによる機械的な働きを組み合わせます。複数の除去処理をまとめ、溝と穴の中に必要な材料を残して平坦にする様子を示します。', sourceIds: ['fujimi-cmp', 'applied-interconnect'], guide: '/guides/semiconductor-cmp-process' },
  { id: 'post-cmp-clean', verb: '加工後の表面をきれいにする', term: 'CMP後洗浄', before: '研磨の後に残り得る不要物を除きます。', after: '配線の形を保ったまま、表面の残留物を除きました。', explanation: '洗浄は配線を削って作る工程ではありません。材料や残留物に合った方法を選びます。', sourceIds: ['lam-interconnect'], guide: '/guides/semiconductor-cmp-process' },
  { id: 'cap', verb: '上面を保護する', term: '保護膜形成', before: '配線の上面を保護し、次の層へ進む準備をします。', after: '場所や材料を変えて、さらに層を重ねる準備ができました。', explanation: 'この例では電気を隔てる保護膜を示します。配線上面の保護や次の加工との境界を担い、同じ形をそのまま重ねるだけで完成するわけではありません。', sourceIds: ['applied-interconnect'], guide: '/guides/semiconductor-interconnect-process' },
] as const;
export type InterconnectStepId = typeof interconnectSteps[number]['id'];
export const interconnectQuestions = [
  { id: 'insulation', title: 'なぜ絶縁膜が必要？', body: '金属同士が意図しない場所でつながらないよう、間を隔てます。必要な場所だけに溝と穴を作り、そこを金属でつなぎます。' },
  { id: 'remove-metal', title: 'なぜ埋めた金属を取り除く？', body: '溝・穴の中の金属は残します。表面に広がった金属と導電性下地を除くことで、左右を隔て、次の加工へ進める平面を作ります。' },
  { id: 'cmp-wash', title: 'なぜまた洗う？', body: '研磨後には粒子や薬液由来の残留物が残ることがあります。作った配線を保ちながら、次の膜を作る妨げになるものを除きます。' },
] as const;
export const interconnectRelated = [
  { id: 'interconnect_guide', label: '配線形成を詳しく読む', href: '/guides/semiconductor-interconnect-process' },
  { id: 'cmp_guide', label: 'CMPを詳しく読む', href: '/guides/semiconductor-cmp-process' },
  { id: 'industry_map', label: '関連企業を業界地図で見る', href: '/industry-map' },
] as const;
