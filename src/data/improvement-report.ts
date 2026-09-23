export const improvementReportMeta = {
  route: "/tools/improvement-report", title: "工程改善レポート｜変更前後の比較を社内報告書に",
  description: "測定データの比較、分布図、変更内容、考察を社内報告書にまとめます。登録不要・端末内処理で、印刷・PDF保存と編集再開に対応。",
  updatedAt: "2026-09-23",
} as const;
export const reportFields = {
  reportTitle: { label: "タイトル", limit: 60 },
  reportDate: { label: "報告日", limit: 10 },
  changeDescription: { label: "変更内容", limit: 120 },
  measurementConditions: { label: "測定条件", limit: 120 },
  interpretation: { label: "考察", limit: 180 },
  uncertainties: { label: "未確認事項", limit: 180 },
  nextAction: { label: "次の行動", limit: 180 },
} as const;
export type ReportNotes = Record<keyof typeof reportFields, string>;
export const emptyReportNotes: ReportNotes = { reportTitle: "", reportDate: "", changeDescription: "", measurementConditions: "", interpretation: "", uncertainties: "", nextAction: "" };
export const sampleReportNotes: ReportNotes = {
  reportTitle: "膜厚条件の変更前後比較（架空例）", reportDate: "2026-09-23",
  changeDescription: "架空工程で設定条件を変更し、変更前後の膜厚を比較した。",
  measurementConditions: "同じ測定項目・単位。変更前8件、変更後6件。規格98〜102 nm。教材用の架空データ。",
  interpretation: "今回のデータでは変更後の標準偏差が小さい。変更効果の確定には追加の確認が必要。",
  uncertainties: "採取時期やロット差の影響、工程の安定性、長期の再現性は未確認。",
  nextAction: "同等の採取条件で追加測定し、時間変化と再現性を確認する。",
};
export function reportNotesErrors(notes: ReportNotes): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(reportFields) as (keyof ReportNotes)[]) {
    if (Array.from(notes[key]).length > reportFields[key].limit) errors.push(`${reportFields[key].label}は${reportFields[key].limit}文字以内にしてください。`);
  }
  if (notes.reportDate && (!/^\d{4}-\d{2}-\d{2}$/.test(notes.reportDate) || !Number.isFinite(Date.parse(notes.reportDate)) || new Date(notes.reportDate).toISOString().slice(0, 10) !== notes.reportDate)) errors.push("報告日は有効な日付にしてください。");
  return errors;
}
