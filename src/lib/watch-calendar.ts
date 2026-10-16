import calendarData from "@/data/watch-calendar.json";
import type { EarningsRelease } from "./earnings";

export type WatchEvent = {
  id: string; companyId: string; kind: "earnings" | "monthly"; period: string;
  date: string | null; timezone: string; sourceUrl: string;
  tentative?: boolean;
  status: "scheduled" | "unpublished" | "unverified"; checkedAt: string | null;
};
export type EarningsCheck = {
  companyId: string; sourceUrl: string; checkedAt: string | null; retrievedAt: string | null;
  latestAnnouncedAt: string | null; latestSourceUrl: string | null; state: "verified" | "pending" | "failed";
  note?: string; notice?: { announcedAt: string; sourceUrl: string; text: string };
};
export type WatchReview = {
  id: string; sourceUrl: string; status: "processed" | "linked" | "skipped" | "recheck";
  checkedAt: string; note: string; href?: string;
};
export type WatchCalendar = { schemaVersion: number; updatedAt: string; companies: EarningsCheck[]; events: WatchEvent[]; reviews: WatchReview[] };
export const watchCalendar = calendarData as WatchCalendar;

export function calendarDay(now: string, timezone = "Asia/Tokyo") {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
}

export function upcomingWatchEvents(events: WatchEvent[], now: string, days = 14) {
  return events.filter(event => {
    if (event.status !== "scheduled" || !event.date) return false;
    const today = calendarDay(now, event.timezone);
    const age = Date.parse(event.date) - Date.parse(today);
    return age >= 0 && age <= days * 86_400_000;
  }).sort((a, b) => a.date!.localeCompare(b.date!) || a.companyId.localeCompare(b.companyId));
}

export function nextCompanyEvent(companyId: string, now: string, kind: WatchEvent["kind"] = "earnings", events = watchCalendar.events) {
  return upcomingWatchEvents(events.filter(event => event.companyId === companyId && event.kind === kind), now, 730)[0];
}

export function watchEventDate(event: WatchEvent) {
  if (!event.date) return event.status === "unpublished" ? "未公表" : "未確認";
  const region = event.timezone === "Asia/Tokyo" ? "日本" : event.timezone === "Asia/Taipei" ? "台湾" : event.timezone === "Asia/Seoul" ? "韓国" : event.timezone.startsWith("America/") ? "米国" : "現地";
  return `${event.date.replaceAll("-", "/")}（${region}日付）${event.tentative ? "・会社の暫定予定" : ""}`;
}

export function earningsFreshness(release: EarningsRelease, now: string, checks = watchCalendar.companies) {
  const check = checks.find(entry => entry.companyId === release.companyId);
  if (!check || !check.checkedAt) return { state: "unverified", text: "最新発表の有無は未確認", check };
  if (check.latestAnnouncedAt && check.latestAnnouncedAt > release.announcedAt) return { state: "pending", text: `${check.latestAnnouncedAt.replaceAll("-", "/")}の新しい決算を確認中`, check };
  if (check.state === "failed") return { state: "failed", text: "直近の取得に失敗・前回確認時の内容", check };
  if (check.state === "pending") return { state: "pending", text: "原資料を再確認中", check };
  const age = Date.parse(now) - Date.parse(check.checkedAt);
  if (age < 0 || age > 2 * 86_400_000) return { state: "stale", text: "最新発表の有無は2日以上未確認", check };
  return { state: "verified", text: "掲載決算・最新発表の有無を確認済み", check };
}
