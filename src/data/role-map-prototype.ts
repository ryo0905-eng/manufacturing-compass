import type { Responsibility, ResponsibilityCategory, RoleProfile } from '@/types/role-map';

export const roleMapCategoryLabels: Record<ResponsibilityCategory, string> = {
  process: '工程・歩留まり',
  productivity: '生産性',
  equipment: '設備・制御',
  quality: '品質・顧客支援・データ',
};

export const roleMapResponsibilities: Responsibility[] = [
  { id: 'R01', category: 'process', label: '新しい工程を開発・量産へ移す', description: '新工程の開発や移管。既存条件の微調整とは分けます。' },
  { id: 'R02', category: 'process', label: '工程条件を評価・最適化する', description: '実験や条件比較によって、工程条件を整えます。' },
  { id: 'R03', category: 'process', label: '工程のばらつきを監視・抑制する', description: '統計的な手法などで工程状態を管理します。' },
  { id: 'R04', category: 'process', label: '歩留まり低下を分析・改善する', description: 'ロットや工程間の傾向から低下要因を調べます。' },
  { id: 'R05', category: 'productivity', label: 'ライン・工程配置を設計して立ち上げる', description: 'ライン全体の配置や工程構成を設計します。' },
  { id: 'R06', category: 'productivity', label: '作業時間・能力・ボトルネックを改善する', description: '生産の流れや処理能力を改善します。' },
  { id: 'R07', category: 'productivity', label: '作業標準を整え教育する', description: '標準作業を整備し、現場で使える形にします。' },
  { id: 'R08', category: 'equipment', label: '設備を選定・導入・受入評価する', description: '製造装置の選定から立上げ、受入までを扱います。' },
  { id: 'R09', category: 'equipment', label: '定期点検・予防保全を行う', description: '計画的な点検や故障予防を行います。' },
  { id: 'R10', category: 'equipment', label: '故障を復旧し再発を防ぐ', description: '設備の故障原因を調べ、復旧と再発防止を行います。' },
  { id: 'R11', category: 'equipment', label: '制御プログラムを設計・変更する', description: 'PLCなどで設備の動作を制御します。' },
  { id: 'R12', category: 'equipment', label: '搬送・検査等を自動化する', description: '生産や検査の手作業を仕組みで置き換えます。' },
  { id: 'R13', category: 'quality', label: '製品不良の原因を解析し是正する', description: '不良現象の原因を調べ、是正につなげます。' },
  { id: 'R14', category: 'quality', label: '検査方法・判定基準を整える', description: '検査の方法や合否判定の基準を設計します。' },
  { id: 'R15', category: 'quality', label: '品質監査・変更管理・品質文書を扱う', description: '工程変更の品質確認や品質システムを扱います。' },
  { id: 'R16', category: 'quality', label: '顧客の品質問題に対応する', description: '顧客と品質問題の解決や調整を進めます。' },
  { id: 'R17', category: 'quality', label: '顧客先で装置を立ち上げ・保守する', description: '顧客の工場で装置の立上げや保守を行います。' },
  { id: 'R18', category: 'quality', label: '製造データの収集・可視化・分析を仕組み化する', description: '継続して使えるデータ収集・分析の仕組みを作ります。' },
];

export const roleMapProfiles: RoleProfile[] = [
  {
    id: 'process-improvement', order: 1, roleGroup: '工程改善',
    title: '工程条件・量産プロセス改善',
    context: '国内ファウンドリの量産工程条件・工程管理をもとにした試用モデル',
    titles: ['Process Engineer', 'プロセスエンジニア'],
    responsibilities: [
      { responsibilityId: 'R02', fit: 'core' },
      { responsibilityId: 'R03', fit: 'core' },
      { responsibilityId: 'R08', fit: 'variable' },
    ],
    searchPhrases: ['半導体 プロセスエンジニア 工程改善', 'semiconductor process engineer process control Japan'],
    checks: ['既存工程の維持と新工程開発のどちらを担当するか', '装置導入・適格化まで担当するか'],
    distinction: '設備技術と導入業務が重なる場合があります。工程条件と装置のどちらを主に扱うか確認します。',
    evidence: [
      { label: 'JASM Fab23 Process Engineer', url: 'https://ro.careers.tsmc.com/job/Kumamoto-JASM-Fab23-Process-Engineer-%284147%29-43/932913110/' },
      { label: 'USJC プロセスエンジニア', url: 'https://recruit.usjpc.com/job_list/process/' },
    ],
  },
  {
    id: 'productivity-improvement', order: 2, roleGroup: '生産性改善',
    title: '生産システム・生産性改善',
    context: '国内工場の生産能力・生産システムをもとにした試用モデル',
    titles: ['Intelligent Manufacturing Engineer', '量産技術'],
    responsibilities: [
      { responsibilityId: 'R06', fit: 'core' },
      { responsibilityId: 'R18', fit: 'core' },
    ],
    searchPhrases: ['半導体 生産技術 生産システム', 'intelligent manufacturing engineer Japan'],
    checks: ['能力計画・スケジューリング、情報システム、装置開発のどこを担当するか'],
    distinction: '「生産技術」は広い名称です。データ基盤とライン自動化のどちらを担当するか確認します。',
    evidence: [
      { label: 'JASM Intelligent Manufacturing Engineer', url: 'https://ro.careers.tsmc.com/job/Kumamoto-JASM-MFG-Intelligent-manufacturing-engineer-%283783%29-43/780587910/' },
      { label: 'キオクシア 職種概要', url: 'https://graduates-jp.kioxia.com/job/' },
    ],
  },
  {
    id: 'equipment-engineering', order: 3, roleGroup: '設備技術',
    title: '工場内の設備技術・保全',
    context: '国内工場の製造装置導入・保全をもとにした試用モデル',
    titles: ['設備技術', 'Equipment Engineer', '設備機器エンジニア', '設備エンジニア'],
    responsibilities: [
      { responsibilityId: 'R08', fit: 'core' },
      { responsibilityId: 'R10', fit: 'core' },
      { responsibilityId: 'R09', fit: 'variable' },
      { responsibilityId: 'R06', fit: 'variable' },
    ],
    searchPhrases: ['半導体 設備技術 保全', 'semiconductor equipment engineer Japan'],
    checks: ['計画保全・故障対応・新規導入の分担', '自社工場か顧客先か', '製造装置か工場インフラか'],
    distinction: '顧客先のフィールドサービスとは勤務対象が異なります。',
    evidence: [
      { label: 'JASM 設備機器エンジニア', url: 'https://ro.careers.tsmc.com/job/kumamoto-jasm-fab23-%E8%A8%AD%E5%82%99%E6%A9%9F%E5%99%A8%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2-%284146%29-43/936410810/' },
      { label: 'USJC 設備エンジニア', url: 'https://recruit.usjpc.com/job_list/equipment/' },
    ],
  },
  {
    id: 'quality-improvement', order: 4, roleGroup: '品質改善',
    title: '工程品質の改善・管理',
    context: '国内工場の製造品質・変更影響確認をもとにした試用モデル',
    titles: ['Manufacturing Quality and Reliability Engineer'],
    responsibilities: [
      { responsibilityId: 'R13', fit: 'core' },
      { responsibilityId: 'R15', fit: 'core' },
    ],
    searchPhrases: ['半導体 品質 改善 変更管理', 'semiconductor quality engineer manufacturing Japan'],
    checks: ['不良解析・是正、技術変更の確認、信頼性評価の担当分担'],
    distinction: '品質保証、製品評価、信頼性技術との重なりは会社ごとに確認します。',
    evidence: [
      { label: 'JASM Manufacturing Quality and Reliability Engineer', url: 'https://ro.careers.tsmc.com/job/Kumamoto-JASM-Quality-%26-Reliability-Manufacturing-Quality-and-Reliability-Engineer-%285702%29-43/1052918866/' },
      { label: 'USJC 品質保証エンジニア', url: 'https://recruit.usjpc.com/career/mie-qa_engineer/' },
    ],
  },
];
