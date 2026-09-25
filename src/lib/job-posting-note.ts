import { jobNoteItems, jobNoteStatuses, jobNoteCaution, type JobNoteAnswers, type JobNoteStatus } from "@/data/job-posting-note";
export function isJobNoteStatus(value: string): value is JobNoteStatus { return jobNoteStatuses.some(status => status.id === value); }
export function createJobNote(answers: JobNoteAnswers) {
  const items = jobNoteItems.map(item => ({ ...item, status: answers[item.id] ?? "unread" }));
  const questions = items.filter(item => item.status === "missing" || item.status === "unclear");
  const written = items.filter(item => item.status === "written");
  const unread = items.filter(item => item.status === "unread");
  const reviewed = items.length - unread.length;
  if (!reviewed) return null;
  const text = [
    "求人票の確認ノート", `読んだ項目：${reviewed}/${items.length}（条件への同意・企業への確認済みを意味しません）`,
    "", "【応募前に確認したい質問】",
    ...(questions.length ? questions.map(item => `・${item.title}（${item.status === "missing" ? "記載が見つからない" : "意味が曖昧"}）\n  ${item.question}`) : ["今回の選択から追加された質問はありません。"]),
    "", "【記載を読み取れた項目】", ...(written.length ? written.map(item => `・${item.title}`) : ["なし"]),
    "", "【まだ読んでいない項目】", ...(unread.length ? unread.map(item => `・${item.title}`) : ["なし"]),
    "", jobNoteCaution,
    "求人票は雇用契約書ではありません。採用時の条件は書面で確認してください。",
  ].join("\n");
  return { questions, written, unread, reviewed, text };
}

export function createJobComparison(answersA: JobNoteAnswers, answersB: JobNoteAnswers) {
  const a = createJobNote(answersA), b = createJobNote(answersB);
  if (!a || !b) return null;
  const rows = jobNoteItems.map(item => ({
    ...item,
    a: answersA[item.id] ?? "unread",
    b: answersB[item.id] ?? "unread",
  }));
  const label = (status: JobNoteStatus) => jobNoteStatuses.find(item => item.id === status)!.label;
  const text = [
    "求人票2件の確認ノート（A・B）",
    "記載状況の比較です。待遇の差や求人の優劣を示すものではありません。",
    "A・Bがどの求人かは、コピー先で自分用に追記してください。",
    "", "【項目別の記載状況】",
    ...rows.map(row => `・${row.title}\n  A：${label(row.a)}\n  B：${label(row.b)}`),
    "", "【求人Aに確認すること】", a.text,
    "", "【求人Bに確認すること】", b.text,
  ].join("\n");
  return { rows, a, b, text };
}
