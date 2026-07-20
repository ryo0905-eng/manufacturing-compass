"use client";

import { useMemo, useState } from "react";
import { analyzeGageRr, generateGageMeasurements } from "@/lib/gage-rr/analyze";
import { gagePresets } from "@/lib/gage-rr/presets";
import type { GageScenarioId, GageSettings } from "@/lib/gage-rr/types";
import { trackEvent } from "@/lib/analytics";

type Metric = "study" | "contribution";
type Improvement = "fixture" | "procedure" | "parts";
const operatorNames=["A","B","C"];

export function GageRrLearningTool(){
  const [scenario,setScenario]=useState<GageScenarioId|null>("capable");
  const [settings,setSettings]=useState<GageSettings>(gagePresets[0].settings);
  const [metric,setMetric]=useState<Metric>("study");
  const [selectedPart,setSelectedPart]=useState(5);
  const rows=useMemo(()=>generateGageMeasurements(settings),[settings]);
  const analysis=useMemo(()=>analyzeGageRr(rows),[rows]);
  const gage=analysis.components.find((item)=>item.id==="gage")!;
  const repeatability=analysis.components.find((item)=>item.id==="repeatability")!;
  const reproducibility=analysis.components.find((item)=>item.id==="reproducibility")!;
  const part=analysis.components.find((item)=>item.id==="part")!;
  const selectedRows=rows.filter((row)=>row.part===selectedPart);
  const judgement=analysis.gagePercent<10?"部品差を識別しやすい状態":analysis.gagePercent<30?"用途とリスクを踏まえて判断":"測定誤差が部品差を隠しています";

  function applyPreset(id:GageScenarioId){const preset=gagePresets.find((item)=>item.id===id)!;setScenario(id);setSettings({...preset.settings});trackEvent("gage_rr_scenario_selected",{scenario:id});}
  function update(key:keyof GageSettings,value:number){setScenario(null);setSettings((current)=>({...current,[key]:value}));trackEvent("gage_rr_factor_changed",{factor:key});}
  function improve(id:Improvement){
    setScenario(null);
    setSettings((current)=>id==="fixture"?{...current,repeatability:Math.max(.1,current.repeatability*.45),interaction:Math.max(.04,current.interaction*.7)}:id==="procedure"?{...current,operatorBias:Math.max(.05,current.operatorBias*.35),interaction:Math.max(.04,current.interaction*.55)}:{...current,partSpread:Math.max(2.4,current.partSpread*2.2)});
    trackEvent("gage_rr_improvement_selected",{improvement:id});
  }

  return <section className="grr-tool" aria-label="Gage R&R学習ツール">
    <nav className="grr-presets" aria-label="学習シナリオ">{gagePresets.map((preset)=><button aria-pressed={scenario===preset.id} key={preset.id} onClick={()=>applyPreset(preset.id)} type="button"><strong>{preset.label}</strong><span>{preset.note}</span></button>)}</nav>
    <div className="grr-workspace">
      <section className="grr-controls">
        <header><div><p className="section-label">CHANGE THE VARIATION</p><h2>ばらつきの正体を動かす</h2></div><span>10部品 × 3人 × 2回</span></header>
        <GageSlider label="部品そのものの差" note="Part-to-Part" min={.5} max={3.5} step={.1} value={settings.partSpread} onChange={(value)=>update("partSpread",value)}/>
        <GageSlider label="同じ人でも散る" note="Repeatability" min={.05} max={1.5} step={.05} value={settings.repeatability} onChange={(value)=>update("repeatability",value)}/>
        <GageSlider label="人ごとの一定のずれ" note="Operator" min={0} max={1.5} step={.05} value={settings.operatorBias} onChange={(value)=>update("operatorBias",value)}/>
        <GageSlider label="部品によって人の差が変わる" note="Part × Operator" min={0} max={1.2} step={.05} value={settings.interaction} onChange={(value)=>update("interaction",value)}/>
        <p className="grr-control-hint">まず「同じ人でも散る」を動かし、同じ部品の2回の測定がどう変わるか見てください。</p>
      </section>
      <section className="grr-summary" aria-live="polite">
        <header><div><p className="section-label">LIVE RESULT</p><h2>{judgement}</h2></div><dl><div><dt>%GRR</dt><dd>{analysis.gagePercent.toFixed(1)}<small>%</small></dd></div><div><dt>ndc</dt><dd>{analysis.ndc}</dd></div></dl></header>
        <div className="grr-summary-message"><strong>{analysis.dominantError==="repeatability"?"繰返し性の影響が大きい":"再現性の影響が大きい"}</strong><p>{analysis.dominantError==="repeatability"?"測定器だけでなく、位置決め、保持、測定力、分解能を確認します。":"測定者を評価する前に、ゼロ点、治具、手順、読み取り方法を確認します。"}</p></div>
        <VariationBars metric={metric} onMetricChange={(next)=>{setMetric(next);trackEvent("gage_rr_metric_changed",{metric:next});}} values={[gage,repeatability,reproducibility,part]}/>
        <p className="grr-threshold"><span>0</span><i><b style={{left:`${Math.min(100,analysis.gagePercent)}%`}}/></i><span>10%</span><span>30%</span><span>100%</span></p>
        <aside><strong>10%・30%は参考帯です</strong><p>自動的な合否ではありません。測定用途、製品リスク、顧客・社内基準と合わせて判断します。</p></aside>
      </section>
    </div>
    <section className="grr-repeat-lesson"><header><div><p className="section-label">STEP 1 / REPEATABILITY</p><h2>同じ部品を、同じ人が2回測る</h2></div><label>確認する部品<select value={selectedPart} onChange={(event)=>setSelectedPart(Number(event.target.value))}>{Array.from({length:10},(_,index)=><option key={index+1} value={index+1}>部品 {index+1}</option>)}</select></label></header><div>{operatorNames.map((name,index)=>{const values=selectedRows.filter((row)=>row.operator===index+1).sort((a,b)=>a.replicate-b.replicate);const difference=Math.abs(values[1].value-values[0].value);return <article key={name}><span>測定者 {name}</span><div>{values.map((row)=><p key={row.replicate}><small>{row.replicate}回目</small><strong>{row.value.toFixed(2)}</strong></p>)}</div><footer>差 {difference.toFixed(2)}</footer></article>})}</div><p>この2回の差は、部品間の差ではありません。同じ条件で繰り返した時の散らばりがRepeatabilityです。</p></section>
    <div className="grr-plots"><InteractionPlot cellMeans={analysis.cellMeans}/><ComponentsPlot values={[repeatability,reproducibility,part]}/></div>
    <section className="grr-data"><header><div><p className="section-label">MEASUREMENT ORDER</p><h2>測定順を隠して、記憶の影響を減らす</h2><p>同じ部品を続けて測らず、ランダム化した一行一測定のデータです。</p></div><strong>60 measurements</strong></header><div><table><thead><tr><th>実施順</th><th>部品</th><th>測定者</th><th>反復</th><th>測定値</th></tr></thead><tbody>{rows.map((row)=><tr key={row.runOrder}><td>{row.runOrder}</td><td>部品 {row.part}</td><td>{operatorNames[row.operator-1]}</td><td>{row.replicate}</td><td>{row.value.toFixed(2)}</td></tr>)}</tbody></table></div></section>
    <section className="grr-improvement"><header><div><p className="section-label">FROM RESULT TO ACTION</p><h2>どこを直すと、識別できるようになる？</h2></div><p>対策を選ぶと疑似データへ反映されます。</p></header><div><button onClick={()=>improve("fixture")} type="button"><strong>治具・位置決めを改善</strong><span>繰返し誤差を小さくする</span></button><button onClick={()=>improve("procedure")} type="button"><strong>手順とゼロ点を統一</strong><span>測定者差・交互作用を小さくする</span></button><button onClick={()=>improve("parts")} type="button"><strong>代表部品を選び直す</strong><span>工程の範囲をカバーする</span></button></div><footer>数値が改善しても、実務では新しい調査を実施して再現性を確認します。</footer></section>
    <details className="grr-anova"><summary>ANOVA表と計算の内訳を見る</summary><div><table><thead><tr><th>変動要因</th><th>平方和 SS</th><th>自由度 df</th><th>平均平方 MS</th></tr></thead><tbody>{analysis.anova.map((row)=><tr key={row.id}><th>{row.label}</th><td>{row.ss.toFixed(3)}</td><td>{row.df}</td><td>{row.ms.toFixed(3)}</td></tr>)}</tbody></table><aside><strong>分散成分を足して考えます</strong><p>RepeatabilityとReproducibilityを合わせたものがTotal Gage R&amp;Rです。初期版は部品×測定者の交互作用をモデルに残し、負に推定された分散成分は0として扱います。</p></aside></div></details>
  </section>;
}

function GageSlider({label,note,min,max,step,value,onChange}:{label:string;note:string;min:number;max:number;step:number;value:number;onChange:(value:number)=>void}){return <label className="grr-slider"><span><b>{label}<small>{note}</small></b><output>{value.toFixed(2)}</output></span><input min={min} max={max} step={step} type="range" value={value} onChange={(event)=>onChange(Number(event.target.value))}/></label>}

function VariationBars({metric,onMetricChange,values}:{metric:Metric;onMetricChange:(metric:Metric)=>void;values:{id:string;label:string;studyPercent:number;contributionPercent:number}[]}){return <section className="grr-variation"><header><strong>変動の内訳</strong><div><button aria-pressed={metric==="study"} onClick={()=>onMetricChange("study")} type="button">%Study Var</button><button aria-pressed={metric==="contribution"} onClick={()=>onMetricChange("contribution")} type="button">%Contribution</button></div></header><div>{values.map((item)=>{const value=metric==="study"?item.studyPercent:item.contributionPercent;return <p key={item.id}><span>{item.label}</span><i><b style={{width:`${Math.min(100,value)}%`}}/></i><strong>{value.toFixed(1)}%</strong></p>})}</div><footer>{metric==="study"?"標準偏差の比。各行を足して100%にはなりません。":"分散の比。内訳を足すと100%になります。"}</footer></section>}

function InteractionPlot({cellMeans}:{cellMeans:number[][]}){const flat=cellMeans.flat();const min=Math.min(...flat)-.5;const max=Math.max(...flat)+.5;const x=(index:number)=>48+index/9*380;const y=(value:number)=>180-(value-min)/(max-min)*140;return <figure className="grr-plot"><strong>部品 × 測定者</strong><svg viewBox="0 0 470 220" role="img" aria-label="部品と測定者の交互作用プロット"><rect x="38" y="25" width="400" height="170" rx="5"/>{operatorNames.map((name,operator)=><g className={`grr-series grr-series--${operator+1}`} key={name}><path d={cellMeans.map((cells,index)=>`${index?"L":"M"}${x(index)},${y(cells[operator])}`).join(" ")}/>{cellMeans.map((cells,index)=><circle cx={x(index)} cy={y(cells[operator])} key={index} r="3.5"/>)}<text x={x(9)+5} y={y(cellMeans[9][operator])}>{name}</text></g>)}<text x="42" y="212">部品1</text><text x="438" y="212" textAnchor="end">部品10</text></svg><figcaption>線が平行なら測定者差はおおむね一定。交差すると、部品によって測り方の影響が変わっています。</figcaption></figure>}

function ComponentsPlot({values}:{values:{id:string;label:string;studyPercent:number}[]}){return <figure className="grr-plot grr-components"><strong>何が観測変動を作っている？</strong><div>{values.map((item)=><p key={item.id}><span>{item.label}</span><i><b style={{height:`${Math.max(3,item.studyPercent)}%`}}/></i><strong>{item.studyPercent.toFixed(1)}%</strong></p>)}</div><figcaption>Part-to-Partが測定誤差より十分大きいと、部品の違いを識別しやすくなります。</figcaption></figure>}
