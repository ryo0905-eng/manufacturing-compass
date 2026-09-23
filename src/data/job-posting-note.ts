import { priorityItems, type PriorityId } from "@/data/career-priorities";

function question(id: PriorityId) {
  const item = priorityItems.find(value => value.id === id);
  if (!item) throw new Error(`Unknown priority question: ${id}`);
  return item.question;
}
export const jobNoteMeta = {
  href: "/career-consultation#job-posting-note",
  updatedAt: "2026-09-23",
  source: "https://www.hellowork.mhlw.go.jp/member/job_offer_search06.html",
} as const;
export const jobNoteItems = [
  { id: "duties", title: "仕事内容・担当範囲", help: "入社後の業務、担当工程、他部門との分担。", question: question("scope") },
  { id: "requirements", title: "必須要件・歓迎要件", help: "必要な経験・資格と、あると役立つ経験の区別。", question: "応募時に必須となる経験・資格と、入社後に身につけられることを教えてください。" },
  { id: "location", title: "初期配属・勤務地", help: "入社直後の就業場所と、将来の転勤範囲。", question: question("stay") },
  { id: "contract", title: "雇用形態・契約・試用期間", help: "契約期間、更新がある場合の条件、試用期間中の条件。", question: "雇用形態と契約期間、更新がある場合の条件、試用期間中に異なる条件を教えてください。" },
  { id: "hours", title: "勤務時間・休日", help: "通常期と繁忙期の勤務時間、休日対応。", question: question("hours") },
  { id: "travel", title: "出張・交替勤務", help: "有無だけでなく頻度や期間、勤務の組み方。", question: question("travel") },
  { id: "pay", title: "給与・待遇の内訳", help: "基本給、固定手当、変動報酬などの区別。金額入力は不要です。", question: question("fixed") },
  { id: "selection", title: "選考前に準備するもの", help: "提出書類、選考の流れ、事前に確認できること。", question: "応募に必要な書類、選考の流れ、応募前に確認できる窓口を教えてください。" },
] as const;
export type JobNoteId = typeof jobNoteItems[number]["id"];
export const jobNoteStatuses = [
  { id: "unread", label: "まだ読んでいない" },
  { id: "written", label: "記載あり・内容を読み取れた" },
  { id: "missing", label: "記載が見つからない" },
  { id: "unclear", label: "記載はあるが意味が曖昧" },
] as const;
export type JobNoteStatus = typeof jobNoteStatuses[number]["id"];
export type JobNoteAnswers = Partial<Record<JobNoteId, JobNoteStatus>>;
export const jobNoteCaution = "記載が見つからないことだけで、条件の良し悪しや応募可否は判断しません。「記載あり」も、企業への確認や採用後の条件の確定を意味しません。";
