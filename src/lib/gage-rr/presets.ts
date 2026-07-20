import type { GageScenarioId, GageSettings } from "./types";

export const gagePresets: { id: GageScenarioId; label: string; note: string; settings: GageSettings }[] = [
  { id: "capable", label: "識別できる", note: "部品差が見える", settings: { partSpread: 2.4, repeatability: .22, operatorBias: .12, interaction: .08 } },
  { id: "repeatability", label: "繰返し誤差", note: "同じ測定でも散る", settings: { partSpread: 2.4, repeatability: .9, operatorBias: .12, interaction: .08 } },
  { id: "operator", label: "測定者差", note: "人ごとにずれる", settings: { partSpread: 2.4, repeatability: .25, operatorBias: .85, interaction: .08 } },
  { id: "interaction", label: "部品×測定者", note: "苦手な部品が違う", settings: { partSpread: 2.4, repeatability: .25, operatorBias: .15, interaction: .85 } },
  { id: "narrow-parts", label: "部品幅が狭い", note: "似た部品だけ", settings: { partSpread: .75, repeatability: .25, operatorBias: .15, interaction: .08 } },
];
