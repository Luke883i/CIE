import {writeFileSync} from 'node:fs';
import {f7Initial,f7Play,f7Observe,f7Audit,f7Save,f7Restore} from '../src/strategy.mjs';
import {V9_CASES} from '../src/v9_registry.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
const seeds=Number(process.env.F7_AUDIT_SEEDS??30);if(!Number.isSafeInteger(seeds)||seeds<1||seeds>500)throw Error('AUDIT_SEEDS_OUT_OF_RANGE');
const outcomes={},decisionOutcomes={},pactOutcomes={},cases=new Set(),byRole={},errors=[];let episodes=0,replays=0,quarters=0,liquidity=0,variant=0,offers=0,offersAccepted=0;
for(const role of roles){byRole[role]={episodes:0,accepted:0,rejected:0,hearings:0};for(let seed=0;seed<seeds;seed++){
 const caseId=V9_CASES[(seed*13+roles.indexOf(role)*31)%V9_CASES.length].uid;cases.add(caseId);
 try{let s=f7Initial({seed,humanRole:role,caseId}),guard=0;
 while(s.core.core.mode==='INSTITUTIONAL'){
  if(guard++>40)throw Error('DEADLOCK_INSTITUTIONAL');const v=f7Observe(s);const r=f7Play(s,v.available[0]??'WAIT');if(!r.ok)throw Error('INSTITUTIONAL:'+r.code);s=r.session;
 }
 while(!s.core.core.economy.ended){if(guard++>55)throw Error('DEADLOCK_ECONOMIC');const o=f7Observe(s),quarter=s.core.core.economy.quarter;
  const legal=o.strategic.moves;
  const move=quarter%4===0?'PUBLIC_HEARING':quarter%3===0&&legal.includes('DEMAND_CONCESSION')?'DEMAND_CONCESSION':legal.includes('PROPOSE_PACT')?'PROPOSE_PACT':'PUBLIC_HEARING';
  const other=o.strategic.counterparties[(seed+quarter)%o.strategic.counterparties.length];
  const strategy=['COOPERATE','INVESTIGATE','ACCELERATE'][quarter%3];
  const actual=o.actions.includes(strategy)?strategy:'INVESTIGATE';
  const econChoices=o.choices;const choice=(seed+quarter)%3===0?econChoices[0]:'DELEGATE';
  const res=f7Play(s,{move,other,choice,strategy:actual});if(!res.ok)throw Error('ECONOMIC:'+res.code);
  s=res.session;quarters++;const key=res.decision.outcome;decisionOutcomes[key]=(decisionOutcomes[key]??0)+1;
  if(move==='PROPOSE_PACT'||move==='DEMAND_CONCESSION'){offers++;if(key==='ACCEPTED'){offersAccepted++;byRole[role].accepted++;}else byRole[role].rejected++;}
  if(move==='PUBLIC_HEARING')byRole[role].hearings++;
 }
 const a=f7Audit(s);if(a.core.total!==600||a.quarters!==8)throw Error('CONSERVATION_OR_QUARTERS');
 const archive=f7Save(s),restored=f7Restore(archive);if(f7Audit(restored).digest!==a.digest)throw Error('NONDETERMINISTIC_REPLAY');
 const ending=s.core.core.economy.progress;outcomes[ending]=(outcomes[ending]??0)+1;
 for(const [k,v] of Object.entries(a.commitments))pactOutcomes[k]=(pactOutcomes[k]??0)+v;
 episodes++;replays++;byRole[role].episodes++;liquidity+=a.core.total;
 const bad={...archive,digest:'a-bad-checksum'};try{f7Restore(bad);throw Error('MUTATION_ACCEPTED');}catch(e){if(e.message==='MUTATION_ACCEPTED')throw e;variant++;}
 }catch(e){errors.push({role,seed,error:String(e.message)});}
}}
const report={schema:'CIE-F7-AUDIT-1',mainBaseline:'fb0ac0d98ea0739c3dd8828bf300574a9141f332',seedsPerRole:seeds,episodes,replays,quarters,casesVisited:cases.size,balancesReconciled:episodes,allCashTotal600:liquidity===episodes*600,invalidReplaysRejected:variant,offers,offersAccepted,offerAcceptRate:offers?Number((offersAccepted/offers).toFixed(4)):0,decisionOutcomes,pactOutcomes,endProgressCounts:outcomes,byRole,anomalies:errors,limits:['No human enjoyment measurement','Deterministic bounded rational agents, not learned human strategies','The legal setting remains fictional','Client-side observation is not network confidentiality','No server autonomous clock','Original V9 causal claims remain hypotheses']};
writeFileSync(new URL('../proofs/F7-audit.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(errors.length||episodes!==seeds*5||replays!==episodes||quarters!==episodes*8||!report.allCashTotal600||offersAccepted===0||offersAccepted===offers||Object.keys(decisionOutcomes).length<3)process.exitCode=1;
