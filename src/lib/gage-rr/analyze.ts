import type { GageAnalysis, GageMeasurement, GageSettings, GageVarianceComponent, GageVarianceSource } from "./types";

const partPattern = [-1.5, -.95, -.65, -.3, -.08, .18, .42, .7, 1.02, 1.42];
const repeatPattern = [-.82, .82, .54, -.54, -.65, .65, .91, -.91, -.43, .43, .72, -.72];
const labels: Record<GageVarianceSource,string> = { repeatability:"繰返し性", operator:"測定者", interaction:"部品×測定者", reproducibility:"再現性", gage:"Total Gage R&R", part:"Part-to-Part", total:"全変動" };

export function generateGageMeasurements(settings:GageSettings):GageMeasurement[]{
  const rows:GageMeasurement[]=[];
  for(let part=0;part<10;part+=1){
    for(let operator=0;operator<3;operator+=1){
      for(let replicate=0;replicate<2;replicate+=1){
        const operatorDirection=operator-1;
        const interactionShape=partPattern[part]*operatorDirection*.42;
        const repeatIndex=(part*3+operator+replicate*5)%repeatPattern.length;
        const value=100+partPattern[part]*settings.partSpread+operatorDirection*settings.operatorBias+interactionShape*settings.interaction+repeatPattern[repeatIndex]*settings.repeatability;
        rows.push({runOrder:0,part:part+1,operator:operator+1,replicate:replicate+1,value});
      }
    }
  }
  return rows.sort((a,b)=>((a.part*17+a.operator*11+a.replicate*7)%61)-((b.part*17+b.operator*11+b.replicate*7)%61)).map((row,index)=>({...row,runOrder:index+1}));
}

function mean(values:number[]){return values.reduce((sum,value)=>sum+value,0)/values.length;}

export function analyzeGageRr(rows:GageMeasurement[]):GageAnalysis{
  const parts=[...new Set(rows.map((row)=>row.part))];
  const operators=[...new Set(rows.map((row)=>row.operator))];
  const replicates=Math.max(...parts.flatMap((part)=>operators.map((operator)=>rows.filter((row)=>row.part===part&&row.operator===operator).length)));
  const grand=mean(rows.map((row)=>row.value));
  const partMeans=parts.map((part)=>mean(rows.filter((row)=>row.part===part).map((row)=>row.value)));
  const operatorMeans=operators.map((operator)=>mean(rows.filter((row)=>row.operator===operator).map((row)=>row.value)));
  const cellMeans=parts.map((part)=>operators.map((operator)=>mean(rows.filter((row)=>row.part===part&&row.operator===operator).map((row)=>row.value))));
  const ssPart=operators.length*replicates*partMeans.reduce((sum,value)=>sum+(value-grand)**2,0);
  const ssOperator=parts.length*replicates*operatorMeans.reduce((sum,value)=>sum+(value-grand)**2,0);
  const ssInteraction=replicates*cellMeans.reduce((sum,cells,partIndex)=>sum+cells.reduce((inner,value,operatorIndex)=>inner+(value-partMeans[partIndex]-operatorMeans[operatorIndex]+grand)**2,0),0);
  const ssRepeatability=rows.reduce((sum,row)=>sum+(row.value-cellMeans[row.part-1][row.operator-1])**2,0);
  const dfPart=parts.length-1;
  const dfOperator=operators.length-1;
  const dfInteraction=dfPart*dfOperator;
  const dfRepeatability=parts.length*operators.length*(replicates-1);
  const msPart=ssPart/dfPart;
  const msOperator=ssOperator/dfOperator;
  const msInteraction=ssInteraction/dfInteraction;
  const msRepeatability=ssRepeatability/dfRepeatability;
  const varianceRepeatability=msRepeatability;
  const varianceInteraction=Math.max(0,(msInteraction-msRepeatability)/replicates);
  const varianceOperator=Math.max(0,(msOperator-msInteraction)/(parts.length*replicates));
  const variancePart=Math.max(0,(msPart-msInteraction)/(operators.length*replicates));
  const varianceReproducibility=varianceOperator+varianceInteraction;
  const varianceGage=varianceRepeatability+varianceReproducibility;
  const varianceTotal=varianceGage+variancePart;
  const variances:Record<GageVarianceSource,number>={repeatability:varianceRepeatability,operator:varianceOperator,interaction:varianceInteraction,reproducibility:varianceReproducibility,gage:varianceGage,part:variancePart,total:varianceTotal};
  const components=(Object.keys(variances) as GageVarianceSource[]).map((id):GageVarianceComponent=>{const variance=variances[id];const sd=Math.sqrt(variance);return {id,label:labels[id],variance,standardDeviation:sd,studyVariation:6*sd,contributionPercent:varianceTotal?variance/varianceTotal*100:0,studyPercent:varianceTotal?sd/Math.sqrt(varianceTotal)*100:0};});
  const gageSd=Math.sqrt(varianceGage);
  const partSd=Math.sqrt(variancePart);
  const ndc=gageSd===0?99:Math.max(1,Math.floor(1.41*partSd/gageSd));
  return {components,anova:[{id:"part",label:"部品",ss:ssPart,df:dfPart,ms:msPart},{id:"operator",label:"測定者",ss:ssOperator,df:dfOperator,ms:msOperator},{id:"interaction",label:"部品×測定者",ss:ssInteraction,df:dfInteraction,ms:msInteraction},{id:"repeatability",label:"繰返し誤差",ss:ssRepeatability,df:dfRepeatability,ms:msRepeatability}],ndc,gagePercent:varianceTotal?gageSd/Math.sqrt(varianceTotal)*100:0,dominantError:varianceRepeatability>=varianceReproducibility?"repeatability":"reproducibility",partMeans,operatorMeans,cellMeans};
}
