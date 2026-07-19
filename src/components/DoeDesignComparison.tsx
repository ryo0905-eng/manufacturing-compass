"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Objective = "screening" | "interaction";

export function DoeDesignComparison() {
  const [factorCount, setFactorCount] = useState(5);
  const [objective, setObjective] = useState<Objective>("screening");
  const fullRuns = 2 ** factorCount;
  const array = factorCount <= 3 ? "L4" : "L8";
  const arrayRuns = factorCount <= 3 ? 4 : 8;
  const savedRuns = fullRuns - arrayRuns;
  const interactionCount = factorCount * (factorCount - 1) / 2;
  const recommendArray = objective === "screening" && factorCount >= 3;

  function changeFactors(value: number) { setFactorCount(value); trackEvent("doe_design_factor_count_changed", { factors: value }); }
  function changeObjective(value: Objective) { setObjective(value); trackEvent("doe_design_objective_changed", { objective: value }); }

  return <section className="doe-design-comparison" aria-label="完全実施要因計画と直交表の比較"><header><div><p className="section-label">FULL FACTORIAL VS ORTHOGONAL ARRAY</p><h3>実験回数を減らすと、何を失う？</h3><p>主効果を絞り込みたいのか、交互作用まで調べたいのか。目的によって選ぶ設計は変わります。</p></div><fieldset><legend>実験の目的</legend><div><button aria-pressed={objective === "screening"} onClick={() => changeObjective("screening")} type="button">重要因子を絞る</button><button aria-pressed={objective === "interaction"} onClick={() => changeObjective("interaction")} type="button">交互作用も見る</button></div></fieldset></header><label className="doe-factor-count"><span><b>2水準因子の数</b><output>{factorCount}因子</output></span><input min="2" max="7" step="1" type="range" value={factorCount} onChange={(event) => changeFactors(Number(event.target.value))} /><span className="doe-factor-scale"><i>2因子</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7因子</i></span></label><div className="doe-design-options"><article data-recommended={!recommendArray}><header><span>完全実施要因計画</span>{!recommendArray && <em>目的に合う</em>}</header><strong>{fullRuns}<small> 条件</small></strong><div className="doe-run-volume"><i style={{ width: "100%" }} /></div><ul><li data-available="true">すべての条件組み合わせ</li><li data-available="true">主効果を推定</li><li data-available="true">2因子交互作用 {interactionCount}個を分離</li></ul></article><span className="doe-design-versus">VS</span><article data-recommended={recommendArray}><header><span>{array}直交表</span>{recommendArray && <em>目的に合う</em>}</header><strong>{arrayRuns}<small> 条件</small></strong><div className="doe-run-volume"><i style={{ width: `${(arrayRuns / fullRuns) * 100}%` }} /></div><ul><li data-available="true">主効果の絞り込み</li><li data-available={factorCount < (array === "L4" ? 3 : 7)}>空き列を交互作用・誤差へ割付可能</li><li data-available="false">すべての交互作用は分離できない</li></ul></article></div><div className="doe-design-conclusion" data-array={recommendArray}><div><span>{recommendArray ? `${savedRuns}条件を削減` : "情報を残す設計"}</span><strong>{recommendArray ? `${array}は候補因子の絞り込みに向いています` : "完全実施で交互作用を分けて調べます"}</strong></div><p>{recommendArray ? `実験回数は${fullRuns}条件から${arrayRuns}条件へ減ります。ただし、列の割り付けによって主効果と交互作用が重なるため、重要な交互作用を先に決める必要があります。` : objective === "interaction" ? `調べたい2因子交互作用は${interactionCount}個あります。直交表で回数だけを減らすと、どの効果による差か区別できない可能性があります。` : "2因子では完全実施でも4条件です。回数を減らす利点がないため、4つの組み合わせを確認します。"}</p></div></section>;
}
