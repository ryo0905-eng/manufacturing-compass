// Explicit operator-run comparison. Never part of page rendering or the daily workflow.
const fs=require('node:fs');
const path=require('node:path');
const {loadEnvConfig}=require('@next/env');
const {fetchDocument,edit,ask,save}=require('./chip-pulse-media.cjs');
const {secUserAgent}=require('./chip-pulse-update.cjs');
async function main(){
 const root=path.resolve(__dirname,'..');loadEnvConfig(root,true,{info(){},error(){}});
 if(!process.env.AI_GATEWAY_API_KEY)throw new Error('AI key not configured');
 const now=new Date().toISOString(),month=now.slice(0,7),opsFile=path.join(root,'src/data/chip-pulse-operations.json');
 const ops=JSON.parse(fs.readFileSync(opsFile,'utf8'));
 const batch='model-evaluation-20260927';
 if(ops.reservations[batch])throw new Error('Evaluation already reserved; do not repeat paid samples');
 const models=['google/gemini-2.5-flash-lite','google/gemini-2.5-flash'];
 const pricingResponse=await fetch('https://ai-gateway.vercel.sh/v1/models',{signal:AbortSignal.timeout(12000)});
 const catalog=await pricingResponse.json();
 const pricing=models.map(id=>catalog.data.find(m=>m.id===id)?.pricing);
 if(!pricing[0]||!pricing[1]||Number(pricing[0].input)>1e-7||Number(pricing[0].output)>4e-7||Number(pricing[1].input)>3e-7||Number(pricing[1].output)>2.5e-6)throw new Error('Price exceeds approved ceiling');
 const day=new Date(new Date(now).getTime()+9*3600000).toISOString().slice(0,10);
 if((ops.months[month]||0)+20>1000 || (ops.days[day]||0)+4>10)throw new Error('Monthly/daily cap');
 ops.days[day]=(ops.days[day]||0)+4;
 ops.months[month]=(ops.months[month]||0)+20;ops.reservations[batch]={reservedYen:20,createdAt:now,state:'consumed'};save(opsFile,ops);
 const articles=JSON.parse(fs.readFileSync(path.join(root,'src/data/chip-pulse-media.json'),'utf8')).articles.slice(0,2);
 const results=[];
 for(const article of articles){
  const documents=await fetchDocument(article,secUserAgent(process.env.CHIP_PULSE_SEC_USER_AGENT));
  const full=documents.at(-1);
  const match=article.sourceId==='broadcom'?full.text.toLowerCase().indexOf('net revenue by segment'):-1;
  const start=match>0?Math.max(0,match-200):0;
  const document={url:full.url,text:full.text.slice(start,start+11000)};
  for(const model of models){
   try{const result=await edit({companyName:article.companyNames[0]},document,prompt=>ask(prompt,process.env.AI_GATEWAY_API_KEY,model));results.push({articleId:article.id,model,status:result?'passed':'rejected',result});}
   catch(error){results.push({articleId:article.id,model,status:'failed',reason:['invalid_claims','invalid_stage','invalid_classification','ungrounded_claim','ungrounded_number','company_missing','semantic_verification_failed','input_limit'].includes(error.message)?error.message:'provider_or_format_error'});}
  }
 }
 save(path.join(root,'docs/data/chip-pulse-model-eval.json'),{evaluatedAt:now,reservedYen:20,pricing,results});
 console.log(JSON.stringify(results.map(({articleId,model,status,reason})=>({articleId,model,status,reason}))));
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
