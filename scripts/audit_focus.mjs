/** 1,000 deterministic semantic probes; not 1,000 subjective/human reflections. */
import {mkdirSync,writeFileSync} from 'node:fs';
import {f7Initial,f7Observe,f7Play,f7Audit} from '../src/strategy.mjs';
import {focusModel,focusCommand,focusAudit} from '../src/focus_ux.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
let total=0,economic=0,institutional=0,mutations=0,violations=[];
const records=[];
for(const role of roles)for(let seed=0;seed<200;seed++){
 let s=f7Initial({seed,humanRole:role});let reached='INSTITUTIONAL';
 try{
 if(seed%2===1){
  for(let j=0;j<12&&s.core.core.mode==='INSTITUTIONAL';j++){
   const v=f7Observe(s),m=focusModel(v,role,{planId:'PRUDENTE'});const step=f7Play(s,focusCommand(v,role,m.planId));
   if(!step.ok)throw Error('NOT_PLAYABLE:'+step.code);s=step.session;
  }
  if(s.core.core.mode!=='ECONOMIC')throw Error('DID_NOT_REACH_ECONOMIC');
  reached='ECONOMIC';economic++;
 }else institutional++;
 const before=f7Audit(s).digest,view=f7Observe(s);
 let seen=0;
 for(const planId of ['PRUDENTE','COOPERATIVO','INCISIVO']){
  const m=focusModel(view,role,{planId});focusAudit(m);if(!m.canAct)throw Error('NO_PRIMARY_ACTION');
  const command=focusCommand(view,role,planId);
  if(typeof command!=='string'&&(!command||typeof command!=='object'))throw Error('NO_COMMAND');
  seen++;mutations++;
 }
 // No local, private event, forged actor role or unrelated keys in headline/CTA.
 const polluted=structuredClone(view);polluted._secret='SENTINEL-PRIVATE-NEVER-PUBLISH';
 const compact=focusModel(polluted,role);
 if(JSON.stringify(compact).includes('SENTINEL-PRIVATE-NEVER-PUBLISH'))throw Error('SCOPED_DATA_LEAK');
 if(f7Audit(s).digest!==before)throw Error('WORLD_MUTATION');
 records.push({role,seed,phase:reached,actions:seen,digest:before});total++;
 }catch(err){violations.push({role,seed,message:err.message});}
}
const result={schema:'CIE-FOCUS-AUDIT-1',referenceMain:'b5e16f6af67cc3a66f3ccf522b37facb8de7647f',
 semanticReflections:total+violations.length,validated:total,failed:violations.length,
 phaseCount:{institutional,economic},planChecks:mutations,violations,
 proofType:'seeded contract falsification, not lived user cognition',
 predicates:['single CTA','max three optional choices','max two metrics','legal role decision','no observer mutation','no sentinel leakage','institutional and economic phases'],
 humanClaimsNotSupported:['reduced subjective workload','actual enjoyment','accessibility certification','production browser deployment']};
mkdirSync('proofs',{recursive:true});writeFileSync('proofs/Focus-audit.json',JSON.stringify(result,null,2)+'\n');
writeFileSync('proofs/Focus-1000-reflections.jsonl',records.map(r=>JSON.stringify(r)).join('\n')+'\n');
console.log(JSON.stringify(result));if(violations.length||total!==1000||economic!==500||institutional!==500)process.exitCode=1;
