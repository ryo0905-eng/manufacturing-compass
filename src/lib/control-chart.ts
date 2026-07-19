export type ControlChartScenario = "stable" | "shift" | "outlier" | "trend" | "cycle";
export type ControlRuleSet = "basic" | "weco" | "nelson";
export type ControlRule = { id: string; label: string; points: number[] };
export type ChartAnalysis = { center: number; sigma: number; ucl: number; lcl: number; rules: ControlRule[]; flaggedPoints: Set<number> };

const base = [99.4,100.7,99.8,100.4,99.2,100.2,100.8,99.6,100.1,99.5,100.5,99.7,100.3,99.3,100.6,99.9,100.4,99.4,100.2,99.6,100.7,99.8,100.3,99.5];
const subgroupOffsets = [-.72,-.28,.02,.31,.67];

function change(value: number, index: number, scenario: ControlChartScenario) {
  if (scenario === "shift" && index >= 12) return value + 2.4;
  if (scenario === "outlier" && index === 17) return value + 4.8;
  if (scenario === "trend" && index >= 10) return value + (index - 10) * .34;
  if (scenario === "cycle" && index >= 8) return value + Math.sin((index - 8) * Math.PI / 2) * 2;
  return value;
}

export function scenarioValues(scenario: ControlChartScenario) { return base.map((value,index) => change(value,index,scenario)); }
export function scenarioSubgroups(scenario: ControlChartScenario) { return base.slice(0,20).map((value,index) => subgroupOffsets.map((offset,point) => change(value + offset + ((index + point) % 3 - 1) * .08,index,scenario === "outlier" && point !== 4 ? "stable" : scenario))); }

function windows(values: number[], length: number, test: (window: number[]) => boolean) {
  const matches: number[][] = [];
  for (let start=0; start<=values.length-length; start+=1) { const window=values.slice(start,start+length); if (test(window)) matches.push(window.map((_,offset)=>start+offset)); }
  return matches.flat();
}

export function detectControlRules(values: number[], center: number, sigma: number, set: ControlRuleSet, variation = false) {
  const definitions: ControlRule[] = [];
  const add = (id:string,label:string,points:number[]) => { if (points.length) definitions.push({id,label,points:[...new Set(points)]}); };
  add("1","1点が3σ管理限界の外側",values.flatMap((value,index)=>Math.abs(value-center)>3*sigma?[index]:[]));
  if (set === "basic") return definitions;
  const sideLength = set === "weco" ? 8 : 9;
  add("2",`${sideLength}点連続で中心線の同じ側`,windows(values,sideLength,(items)=>items.every((v)=>v>center)||items.every((v)=>v<center)));
  if (set === "nelson") {
    add("3","6点連続で増加または減少",windows(values,6,(items)=>items.slice(1).every((v,i)=>v>items[i])||items.slice(1).every((v,i)=>v<items[i])));
    add("4","14点連続で交互に上下",windows(values,14,(items)=>items.slice(2).every((v,i)=>(v-items[i+1])*(items[i+1]-items[i])<0)));
  }
  if (!variation) {
    add("5","3点中2点が同じ側の2σ外",windows(values,3,(items)=>[1,-1].some((sign)=>items.filter((v)=>(v-center)*sign>2*sigma).length>=2)));
    add("6","5点中4点が同じ側の1σ外",windows(values,5,(items)=>[1,-1].some((sign)=>items.filter((v)=>(v-center)*sign>sigma).length>=4)));
    if (set === "nelson") {
      add("7","15点連続で中心線から1σ以内",windows(values,15,(items)=>items.every((v)=>Math.abs(v-center)<sigma)));
      add("8","8点連続で中心線から1σより外側",windows(values,8,(items)=>items.every((v)=>Math.abs(v-center)>sigma)&&items.some((v)=>v>center)&&items.some((v)=>v<center)));
    }
  }
  return definitions;
}

function withRules(core: Omit<ChartAnalysis,"rules"|"flaggedPoints">, values:number[], set:ControlRuleSet, variation=false): ChartAnalysis { const rules=detectControlRules(values,core.center,core.sigma,set,variation); return {...core,rules,flaggedPoints:new Set(rules.flatMap((rule)=>rule.points))}; }

export function analyzeIndividualsChart(values:number[],set:ControlRuleSet,baselineLength=10) {
  const baseline=values.slice(0,baselineLength); const center=baseline.reduce((s,v)=>s+v,0)/baseline.length; const ranges=baseline.slice(1).map((v,i)=>Math.abs(v-baseline[i])); const mrBar=ranges.reduce((s,v)=>s+v,0)/ranges.length; const sigma=mrBar/1.128;
  const individuals=withRules({center,sigma,ucl:center+3*sigma,lcl:center-3*sigma},values,set);
  const mrValues=values.slice(1).map((v,i)=>Math.abs(v-values[i])); const mrSigma=(3.267*mrBar-mrBar)/3; const movingRange=withRules({center:mrBar,sigma:mrSigma,ucl:3.267*mrBar,lcl:0},mrValues,set,true);
  return {individuals,movingRange,mrValues};
}

export function analyzeXbarR(subgroups:number[][],set:ControlRuleSet,baselineLength=10) {
  const means=subgroups.map((group)=>group.reduce((s,v)=>s+v,0)/group.length); const ranges=subgroups.map((group)=>Math.max(...group)-Math.min(...group)); const meanBase=means.slice(0,baselineLength); const rangeBase=ranges.slice(0,baselineLength); const center=meanBase.reduce((s,v)=>s+v,0)/meanBase.length; const rBar=rangeBase.reduce((s,v)=>s+v,0)/rangeBase.length;
  const meanSigma=.577*rBar/3; const xbar=withRules({center,sigma:meanSigma,ucl:center+.577*rBar,lcl:center-.577*rBar},means,set); const rSigma=(2.114*rBar-rBar)/3; const range=withRules({center:rBar,sigma:rSigma,ucl:2.114*rBar,lcl:0},ranges,set,true);
  return {xbar,range,means,ranges};
}
