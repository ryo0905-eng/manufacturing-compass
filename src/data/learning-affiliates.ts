// 講座名・URL・実体験は2026-09-14の運営者提供情報。
export const statisticsCourse = {
  id: "udemy-statistics-grade-2",
  provider: "udemy",
  name: "統計検定®2級対策講座",
  url: "https://trk.udemy.com/yZvxE3",
  updatedAt: "2026-09-14",
  title: "統計の基礎を、動画で学び直す",
  body: "統計を学ぶ次の一歩として、統計検定2級を目標にするのも一つの方法です。",
  experience: "私自身Udemyで統計を学び、統計検定2級を取得しました。",
  disclosure: "広告・アフィリエイトリンクです。このリンク経由で購入されると、運営者に報酬が入る場合があります。",
} as const;

export const leanSixSigmaCourse = {
  id: "udemy-lean-six-sigma-green-belt",
  provider: "udemy",
  name: "基礎から学ぶリーンシックスシグマ(Lean Six sigma)：グリーンベルト編",
  url: "https://trk.udemy.com/QYXxWY",
  updatedAt: "2026-09-14",
  sourceUrl: "https://www.udemy.com/course/lean-six-sigma-green-belt-jp/",
  title: "改善の進め方を、DMAICに沿って学ぶ",
  body: "DMAICや実験計画法を含む、リーンシックスシグマの考え方を学ぶ講座です。個々の手法を改善活動の流れにつなげたい方の学習候補として紹介します。",
  experience: null,
  disclosure: statisticsCourse.disclosure,
} as const;

export const learningCourses = {
  statistics: statisticsCourse,
  leanSixSigma: leanSixSigmaCourse,
} as const;

export type LearningCourseKey = keyof typeof learningCourses;

// 単なる用語の登場ではなく、統計を学ぶ意図があるページだけに掲載する。
export const statisticsLearningContexts: Readonly<Record<string, string>> = {
  "/tools/cpk": "Cp・Cpkで見た平均・ばらつき・分布を、統計の基礎から学び直したい方へ。",
  "/tools/doe": "DOEで扱う効果と誤差の違いを理解するために、統計の基礎から学び直したい方へ。",
  "/tools/control-chart": "管理図で見たばらつきや偶然の変動を、統計の基礎から整理したい方へ。",
  "/tools/gage-rr": "測定のばらつきや分散の考え方を、統計の基礎から学び直したい方へ。",
  "/tools/yield-analysis": "歩留まりの差や変動を読むために、統計の基礎を学び直したい方へ。",
  "/tools/yield-dashboard": "原因候補の調査から確認実験までを体験した次に、改善活動の全体像を学びたい方へ。",
  "/guides/six-sigma": "記事で整理したDMAICの流れを、動画でさらに学びたい方へ。",
  "/guides/quality-engineer-route": "品質の仕事に向けた準備として、統計の基礎を学び直したい方へ。",
};

// 改善活動の全体像が主題のページでは、専門講座を1件だけ案内する。
export function getLearningCourseKey(sourcePage: string): LearningCourseKey {
  return sourcePage === "/guides/six-sigma" || sourcePage === "/tools/yield-dashboard"
    ? "leanSixSigma"
    : "statistics";
}
