// 講座名・URL・実体験は2026-09-14の運営者提供情報。
export const statisticsCourse = {
  id: "udemy-statistics-grade-2",
  provider: "udemy",
  name: "統計検定®2級対策講座",
  url: "https://trk.udemy.com/yZvxE3",
  updatedAt: "2026-09-14",
  experience: "私自身Udemyで統計を学び、統計検定2級を取得しました。",
  disclosure: "広告・アフィリエイトリンクです。このリンク経由で購入されると、運営者に報酬が入る場合があります。",
} as const;

// 単なる用語の登場ではなく、統計を学ぶ意図があるページだけに掲載する。
export const statisticsLearningContexts: Readonly<Record<string, string>> = {
  "/tools/cpk": "Cp・Cpkで見た平均・ばらつき・分布を、統計の基礎から学び直したい方へ。",
  "/tools/doe": "DOEで扱う効果と誤差の違いを理解するために、統計の基礎から学び直したい方へ。",
  "/tools/control-chart": "管理図で見たばらつきや偶然の変動を、統計の基礎から整理したい方へ。",
  "/tools/gage-rr": "測定のばらつきや分散の考え方を、統計の基礎から学び直したい方へ。",
  "/tools/yield-analysis": "歩留まりの差や変動を読むために、統計の基礎を学び直したい方へ。",
  "/tools/yield-dashboard": "データから原因候補を考える体験の次に、統計の基礎を学び直したい方へ。",
  "/guides/six-sigma": "DMAICと各手法の役割を整理した次に、土台となる統計を学びたい方へ。",
  "/guides/quality-engineer-route": "品質の仕事に向けた準備として、統計の基礎を学び直したい方へ。",
};
