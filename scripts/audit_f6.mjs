import {writeFileSync} from 'node:fs';
import {f6Initial,f6Play,f6Save,f6Restore,f6Audit,V9_COUNT,f6Observe,f6Counterfactual} from '../src/reticulum.mjs';
import {V9_CASES} from '../src/v9_registry.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
const loops=Number(process.env.F6_AUDIT_SEEDS||60);
const outcomes={};let total=0,replays=0,chains=0,bridges=0,mutated=0;const sampledCases=new Set();const fail=[];
for(let seed=0;seed<loops;seed++)for(let ri=0;ri<roles.length;ri++){
 const role=roles[ri],caseId=V9_CASES[(seed*roles.length+ri)%V9_CASES.length].uid;
 let s=f6Initial({seed,humanRole:role,caseId}),steps=0; sampledCases.add(caseId);
 try{
 while(s.core.mode==='INSTITUTIONAL'){
  if(steps++>40)throw Error('INSTITUTIONAL_DEADLOCK');const v=f6Observe(s);
  const r=f6Play(s,v.available?.[0]||'WAIT');if(!r.ok)throw Error('INSTITUTIONAL_'+r.code);s=r.session;
 }
 bridges+=s.reticulum.filter(x=>x.kind==='OPENING_CROSS_BOOK_BRIDGE').length;
 if(s.core.economy.ended)throw Error('PREMATURE_END');
 f6Counterfactual(s);
 while(!s.core.economy.ended){
  if(steps++>60)throw Error('ECONOMIC_DEADLOCK');const strategy=['COOPERATE','INVESTIGATE'][s.core.economy.quarter%2];
  const r=f6Play(s,{strategy,choice:'DELEGATE'});if(!r.ok)throw Error(r.code);s=r.session;
 }
 const a=f6Audit(s);if(a.total!==600||a.chains!==8)throw Error('CONSERVATION_OR_TRACES');
 const snapshot=f6Save(s);const clone=f6Restore(snapshot);if(JSON.stringify(f6Save(clone))!==JSON.stringify(snapshot))throw Error('REPLAY_NONIDENTITY');
 total++;replays++;chains+=a.chains;outcomes[s.core.economy.ended?s.core.economy.progress:'nonterminal']=(outcomes[s.core.economy.progress]||0)+1;
 if(total%2===0){const malformed={...snapshot,digest:'bad'};try{f6Restore(malformed);throw Error('TAMPER_ACCEPTED');}catch(e){if(e.message==='TAMPER_ACCEPTED')throw e;mutated++;}}
 }catch(e){fail.push({seed,role,caseId,error:e.message});}
}
const results={schema:'CIE-F6-AUDIT-1',ruleset:'CIE-F6-1.0.0',baseExpected:'F5 merged',sourceRegistryCount:V9_COUNT,seedCountPerRole:loops,episodes:total,replays,chains,bridges,rejectedTampered:mutated,sampledCases:sampledCases.size,progressDistribution:outcomes,anomalies:fail,claims:{supported:['five-domain synthetic V9 T0–T5 cascade','original 1037-case source registry','one real 8-unit interbook transfer and 600-unit reconciled portfolio','deterministic bounded quarterly gameplay'],'notSupported':['1037 independent causal effects','empirical European policy causal validation','full stock-flow-consistent macroeconomy','human entertainment validation','persistent server authority','shipping readiness']}};
writeFileSync('proofs/F6-audit.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results));if(fail.length)process.exit(1);
