export const workstyleRoles = [
  { id: 'process', label: '製造技術・プロセス', description: '工程の改善・開発・量産支援のどこを担当するか確認したい', href: '/guides/production-engineering-to-semiconductor-process-engineer' },
  { id: 'maintenance', label: '工場内の設備保全', description: '工場の装置の点検・復旧・改善の分担を確認したい', href: '/guides/equipment-engineer-route' },
  { id: 'field', label: '装置メーカーのフィールドサービス', description: '顧客先での装置立ち上げ・保守の担当範囲を確認したい', href: '/guides/equipment-engineer-route' },
] as const;
export type WorkstyleRole = typeof workstyleRoles[number]['id'];
export const concernLevels = { avoid: '避けたい', conditional: '条件次第', learn: 'まず知りたい' } as const;
export type ConcernLevel = keyof typeof concernLevels;
export const confirmationLabels = { unknown: '未確認', fits: '条件を満たす', conflicts: '条件に合わない' } as const;
export type Confirmation = keyof typeof confirmationLabels;
export const workstyleConditions = [
  { id: 'night', label: '夜勤', posting: '勤務時間・交替制・担当業務', common: '夜勤や交替勤務の有無と、日勤でも夜間休日の当番があるかを教えてください。', questions: {
    process: '量産対応と工程開発の業務割合、交替勤務の有無、日勤担当の夜間休日当番を教えてください。',
    maintenance: '保全担当の交替勤務の有無と、計画保全・故障復旧それぞれの夜間作業の頻度を教えてください。',
    field: '顧客先での夜間作業・交替勤務の有無と、立ち上げ時と通常保守時の勤務時間の違いを教えてください。',
  } },
  { id: 'call', label: '急な呼び出し', posting: '待機当番・緊急対応・休日対応', common: '勤務時間外の待機や呼び出しの有無、頻度、連絡から対応までの時間を教えてください。', questions: {
    process: '工程異常時に勤務時間外の対応をする担当者と、遠隔対応・出勤の分担を教えてください。',
    maintenance: '故障時の待機当番、呼び出し頻度、到着までに求められる時間と応援体制を教えてください。',
    field: '顧客からの緊急連絡を誰が受けるか、待機当番と訪問対応の範囲を教えてください。',
  } },
  { id: 'relocation', label: '転勤', posting: '初期配属・就業場所の変更範囲・雇用形態', common: '初期配属と将来の転勤対象拠点、勤務地希望を確認できる時期を教えてください。', questions: {
    process: '初期配属と転勤対象の工場・開発拠点、量産移管に伴う異動の可能性を教えてください。',
    maintenance: '採用する法人と配属工場、別工場への異動・応援の範囲、勤務地限定の条件を教えてください。',
    field: '所属拠点と顧客先の常駐場所、担当顧客の変更で転居が必要になる条件を教えてください。',
  } },
  { id: 'travel', label: '出張', posting: '担当エリア・研修・立ち上げ支援', common: '出張の頻度・期間・行き先と、研修期間中の出張条件を教えてください。', questions: {
    process: '技術移管や立ち上げ支援での出張と、通常業務での出張の頻度・期間を教えてください。',
    maintenance: '装置研修や他工場応援の出張について、行き先・期間・事前に分かる時期を教えてください。',
    field: '担当エリア、顧客間の移動、宿泊を伴う出張の頻度・期間と、予定変更の頻度を教えてください。',
  } },
  { id: 'cleanroom', label: 'クリーンルーム勤務', posting: '作業場所・担当工程・作業環境', common: 'クリーンルームに入る業務と時間、服装、休憩や退出の取り方を教えてください。', questions: {
    process: '現場での工程確認とデスクでの分析の割合、クリーンルームへの入室時間を教えてください。',
    maintenance: '点検・復旧を行う場所と作業姿勢、クリーンルームでの連続作業時間と休憩の取り方を教えてください。',
    field: '顧客先のクリーンルームで行う作業と滞在時間、現場ごとの服装・入退室条件を教えてください。',
  } },
] as const;
export type WorkstyleCondition = typeof workstyleConditions[number]['id'];
// Questions are editorial prompts, not claims about a role or an individual vacancy.
export const workstyleBasis = {
  kind: 'editorial-question' as const,
  updatedAt: '2026-09-06',
  nextReviewAt: '2026-12-06',
  source: {
    title: 'SCK 経験者採用 募集要項',
    url: 'https://www.sony-semicon.com/ja/jobs/info/sck/careers.html',
    checkedAt: '2026-09-06',
    scope: '同社の正規社員の経験者採用に関する募集要項。職種による勤務時間の違いと勤務地の変更可能性を確認する例です。他社や個別の配属条件には適用できません。',
  },
};
