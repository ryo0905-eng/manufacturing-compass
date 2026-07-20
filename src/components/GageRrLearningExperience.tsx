"use client";

import { useState } from "react";
import { GageRrLearningTool } from "@/components/GageRrLearningTool";
import { trackEvent } from "@/lib/analytics";

type LearningStep = "purpose" | "msa" | "plan" | "analysis";
type MsaTopic = "grr" | "bias" | "linearity" | "stability";

const steps:{id:LearningStep;number:string;label:string;note:string}[]=[
  {id:"purpose",number:"01",label:"なぜ測る？",note:"測定値と真の値"},
  {id:"msa",number:"02",label:"MSAを知る",note:"Gage R&Rの位置づけ"},
  {id:"plan",number:"03",label:"調査を組む",note:"部品・測定者・反復"},
  {id:"analysis",number:"04",label:"結果を判断する",note:"%GRR・ndc・改善"},
];

export function GageRrLearningExperience(){
  const [step,setStep]=useState<LearningStep>("purpose");
  function selectStep(next:LearningStep){setStep(next);trackEvent("gage_rr_learning_step_changed",{step:next});}
  return <section className="grr-experience">
    <nav className="grr-learning-tabs" aria-label="Gage R&Rの学習ステップ">{steps.map((item)=><button aria-pressed={step===item.id} key={item.id} onClick={()=>selectStep(item.id)} type="button"><small>{item.number}</small><strong>{item.label}</strong><span>{item.note}</span></button>)}</nav>
    {step==="purpose"?<PurposeLesson onNext={()=>selectStep("msa")}/>:step==="msa"?<MsaOverview onNext={()=>selectStep("plan")}/>:step==="plan"?<StudyPlanLesson onNext={()=>selectStep("analysis")}/>:<GageRrLearningTool/>}
  </section>;
}

function PurposeLesson({onNext}:{onNext:()=>void}){
  const [error,setError]=useState(.15);
  const trueA=99.7;
  const trueB=100.3;
  const measuredA=trueA+error*.72;
  const measuredB=trueB-error*.64;
  const repeat1=100-error*.48;
  const repeat2=100+error*.56;
  const observedGap=Math.abs(measuredB-measuredA);
  const hidden=observedGap<.2||measuredA>measuredB;
  return <section className="grr-foundation grr-purpose">
    <header><div><p className="section-label">STEP 1 / PURPOSE</p><h2>その測定値で、違いを判断してよい？</h2><p>測定器に表示された数値は、部品の値そのものではありません。測定方法による誤差も一緒に含まれます。</p></div><span>測定値 ＝ 部品の値 ＋ 測定誤差</span></header>
    <label className="grr-purpose-slider"><span><b>測定誤差を加える</b><output>{error.toFixed(2)}</output></span><input min="0" max="1" step=".05" type="range" value={error} onChange={(event)=>{setError(Number(event.target.value));trackEvent("gage_rr_purpose_error_changed",{level:Number(event.target.value)});}}/><small>小さい</small><small>大きい</small></label>
    <div className="grr-purpose-cases">
      <article><header><span>CASE A</span><strong>違う2部品を見分ける</strong></header><div><p><small>部品1の真の値</small><b>{trueA.toFixed(2)}</b><em>測定 {measuredA.toFixed(2)}</em></p><i>差を測る</i><p><small>部品2の真の値</small><b>{trueB.toFixed(2)}</b><em>測定 {measuredB.toFixed(2)}</em></p></div><footer data-alert={hidden}><strong>{hidden?"部品の差が測定誤差に隠れました":"2部品の違いが見えています"}</strong><span>測定値で見える差 {observedGap.toFixed(2)}</span></footer></article>
      <article><header><span>CASE B</span><strong>同じ部品を繰り返す</strong></header><div><p><small>同じ部品・1回目</small><b>100.00</b><em>測定 {repeat1.toFixed(2)}</em></p><i>もう一度</i><p><small>同じ部品・2回目</small><b>100.00</b><em>測定 {repeat2.toFixed(2)}</em></p></div><footer data-alert={error>.35}><strong>{error>.35?"同じ部品なのに大きく散っています":"繰返しの差は小さい状態です"}</strong><span>2回の差 {Math.abs(repeat2-repeat1).toFixed(2)}</span></footer></article>
    </div>
    <aside><div><strong>MSAを行う目的</strong><p>製品や工程を評価する前に、測定システムが必要な違いを識別できるか確認することです。</p></div><button onClick={onNext} type="button">MSAの全体像を見る →</button></aside>
  </section>;
}

const msaTopics:{id:MsaTopic;label:string;question:string;description:string;example:string}[]=[
  {id:"grr",label:"Gage R&R",question:"繰り返し・人が変わると散る？",description:"測定システムによるばらつきを、繰返し性と再現性に分けます。",example:"同じ部品を複数人が複数回測る"},
  {id:"bias",label:"偏り Bias",question:"基準値から一定にずれている？",description:"既知の基準値に対して、測定平均がどちらかへずれていないか確認します。",example:"基準100.00をいつも100.12と測る"},
  {id:"linearity",label:"直線性 Linearity",question:"測定範囲でずれ方が変わる？",description:"小さい対象と大きい対象で、測定の偏りが同じか確認します。",example:"低い値では正確、高い値ほど過大表示"},
  {id:"stability",label:"安定性 Stability",question:"時間が経っても同じように測れる？",description:"日、週、月などの時間経過で測定特性が変化していないか確認します。",example:"暖機や摩耗で測定平均が徐々に移動"},
];

function MsaOverview({onNext}:{onNext:()=>void}){
  const [topic,setTopic]=useState<MsaTopic>("grr");
  const selected=msaTopics.find((item)=>item.id===topic)!;
  return <section className="grr-foundation grr-msa">
    <header><div><p className="section-label">STEP 2 / MSA MAP</p><h2>Gage R&amp;Rは、MSAの一部分</h2><p>MSA（Measurement System Analysis）は、測定システムを複数の角度から確認する考え方です。</p></div><span>このツールの中心はGage R&amp;R</span></header>
    <div className="grr-msa-map"><nav aria-label="MSAで確認する特性">{msaTopics.map((item)=><button aria-pressed={topic===item.id} key={item.id} onClick={()=>{setTopic(item.id);trackEvent("gage_rr_msa_topic_selected",{topic:item.id});}} type="button"><strong>{item.label}</strong><span>{item.question}</span></button>)}</nav><article aria-live="polite"><span>{selected.label}</span><h3>{selected.question}</h3><p>{selected.description}</p><dl><dt>例えば</dt><dd>{selected.example}</dd></dl>{topic==="grr"?<strong>今回、操作して学ぶ範囲です</strong>:<strong>Gage R&amp;Rが良好でも、別途確認が必要です</strong>}</article></div>
    <aside><div><strong>測定器だけの評価ではありません</strong><p>測定者、治具、保持、測定位置、手順、環境を含めた「測定システム」を確認します。</p></div><button onClick={onNext} type="button">調査の組み方を見る →</button></aside>
  </section>;
}

function StudyPlanLesson({onNext}:{onNext:()=>void}){
  const [parts,setParts]=useState(10);
  const [operators,setOperators]=useState(3);
  const [replicates,setReplicates]=useState(2);
  const [randomized,setRandomized]=useState(true);
  const measurements=parts*operators*replicates;
  const preview=Array.from({length:Math.min(measurements,12)},(_,index)=>{const order=randomized?(index*7+3)%Math.min(measurements,12):index;return {part:order%parts+1,operator:order%operators+1,replicate:Math.floor(order/(parts*operators))%replicates+1};});
  return <section className="grr-foundation grr-plan">
    <header><div><p className="section-label">STEP 3 / STUDY PLAN</p><h2>誰が、何を、何回測るかを決める</h2><p>交差型では、全ての測定者が全ての部品を複数回測ります。</p></div><strong>{parts}部品 × {operators}人 × {replicates}回 ＝ {measurements}測定</strong></header>
    <div className="grr-plan-layout"><section><PlanSlider label="工程を代表する部品" value={parts} min={5} max={15} suffix="部品" onChange={setParts}/><PlanSlider label="実際に測定する人" value={operators} min={2} max={4} suffix="人" onChange={setOperators}/><PlanSlider label="同じ組み合わせの反復" value={replicates} min={2} max={3} suffix="回" onChange={setReplicates}/><p><strong>{measurements}測定</strong><span>回数を増やすだけでなく、代表性と実施可能性を考えます。</span></p></section><section className="grr-order-preview"><header><div><strong>測定順</strong><span>測定者に前の結果を意識させない</span></div><button aria-pressed={randomized} onClick={()=>{setRandomized((value)=>!value);trackEvent("gage_rr_order_changed",{randomized:!randomized});}} type="button">{randomized?"ランダム化中":"標準順"}</button></header><ol>{preview.map((item,index)=><li key={index}><span>{index+1}</span><b>部品 {item.part}</b><em>測定者 {String.fromCharCode(64+item.operator)}</em><small>{item.replicate}回目</small></li>)}</ol></section></div>
    <div className="grr-plan-principles"><article><span>01</span><strong>代表部品を選ぶ</strong><p>似た部品だけでなく、実工程の範囲をカバーします。</p></article><article><span>02</span><strong>普段の測定者で行う</strong><p>実際の設備、治具、手順、環境を再現します。</p></article><article><span>03</span><strong>結果を隠して反復する</strong><p>前の測定値へ無意識に合わせる影響を減らします。</p></article></div>
    <aside><div><strong>この学習ツールでは10部品 × 3人 × 2回</strong><p>合計60測定の固定設計を使い、測定誤差の種類と結果の読み方に集中します。</p></div><button onClick={onNext} type="button">60測定を解析する →</button></aside>
  </section>;
}

function PlanSlider({label,value,min,max,suffix,onChange}:{label:string;value:number;min:number;max:number;suffix:string;onChange:(value:number)=>void}){return <label className="grr-plan-slider"><span><b>{label}</b><output>{value}{suffix}</output></span><input min={min} max={max} step="1" type="range" value={value} onChange={(event)=>onChange(Number(event.target.value))}/></label>}
