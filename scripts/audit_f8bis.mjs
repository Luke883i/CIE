/* 100,000 complete UI-semantic mutations, NOT 100k empirical human plays or full campaigns.
 Every mutated scenario is a typed observer projection, no fabricated political evidence.
 Every scenario is recorded, deterministic, and includes plan + validation + invariant proof.
 */
import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';
import {decisionModel,validatePlan,assertStrategyPermission,cognitiveContract} from '../src/gameplay_ux.mjs';
import {f7Initial,f7Play,f7Observe,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'proofs');fs.mkdirSync(out,{recursive:true});
const ROLES=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
let checked=0,invalid=0,blocked=0,combined=0,judicial=0,endedCount=0;
const lines=[];const actionSets=[['BUILD_COALITION','MOBILIZE_NETWORK'],['OFFER_CREDIT','KEEP_LIQUIDITY'],['AUTHORIZE_GRANT','EXAMINE_BUDGET'],['HOST_CIVIC_DIALOGUE','REQUEST_PUBLIC_REPORT'],['PUBLISH_REASONS','REVIEW_SAFEGUARDS']];
const allowedMoves=['PROPOSE_PACT','DEMAND_CONCESSION','PUBLIC_HEARING','DECLINE','EXIT_PACT'];
for(let i=0;i<100000;i++){
 const roleIdx=i%5,role=ROLES[roleIdx],seed=(Math.imul(i+1,2654435761)>>>0),ended=i%31===0,cut=i%29===0;
 const mvs=role==='GIUDICE'?['PUBLIC_HEARING','DECLINE']:allowedMoves.filter((_,j)=>!cut||j!==1);
 const peers=ROLES.filter(x=>x!==role),view={worldId:'CIE:'+seed,mode:i%17===0?'INSTITUTIONAL':'ECONOMIC',ended,
 available:i%17===0?['PASS','WAIT']:[],choices:ended?[]:cut?actionSets[roleIdx].slice(0,1):actionSets[roleIdx],
 strategic:{moves:mvs,counterparties:peers},quarter:i%9+1,progress:i%9,support:i%31,legitimacy:i%31,volatility:i%21,
 budget:i%101,caseStatus:i%4,privacy:i%3};
 const before=JSON.stringify(view),model=decisionModel(view,role);assertStrategyPermission(view,role);
 if(model.canAct){if(model.plans.length!==3)throw Error('PLAN_COUNT_'+i);for(const p of model.plans){if(!validatePlan(view,role,p))throw Error('INVALID_PLAN_'+i);if(p.command.kind==='ECONOMIC'&&(!mvs.includes(p.command.move)||!peers.includes(p.command.other)||!view.choices.includes(p.command.choice)))throw Error('NOT_LEGAL_'+i);checked++;}if(role==='GIUDICE')judicial++;}
 else{blocked++;if(model.plans.length)throw Error('TERMINAL_HAS_ACTION_'+i)}
 if(JSON.stringify(view)!==before)throw Error('MUTATED_VIEW_'+i);
 if(ended)endedCount++;
 const fingerprint=JSON.stringify(model);if(decisionModel(view,role).plans.length!==model.plans.length||JSON.stringify(decisionModel(view,role))!==fingerprint)throw Error('NONDETERMINISTIC_'+i);
 if(cut)invalid++;combined++;
 lines.push(JSON.stringify({index:i,seed,role,phase:view.mode,ended,cut,plans:model.plans.map(p=>({id:p.id,command:p.command})),verdict:'PASS'}));
}
// Reachable universe exercise, independent from 100k typed projection scenarios.
let reachable=0,replayed=0,diversity=new Set(),errors=[];
for(let seed=0;seed<40;seed++)for(const role of ROLES){
 let s=f7Initial({seed,humanRole:role,caseId:'V4/E03'});let turns=0;
 while(!s.core.core.economy?.ended && turns<60){const v=f7Observe(s),p=decisionModel(v,role).plans[(seed+turns)%3];if(!p)break;const cmd=p.command;const r=f7Play(s,cmd.kind==='ECONOMIC'?{move:cmd.move,other:cmd.other,choice:cmd.choice,strategy:cmd.strategy}:cmd.choice);
 if(!r.ok){errors.push({seed,role,turns,code:r.code});break;}s=r.session;turns++;
 }
 if(!s.core.core.economy?.ended){errors.push({seed,role,reason:'NOT_TERMINAL'});continue;}
 reachable++;const restored=f7Restore(f7Save(s));if(f7Audit(s).digest===f7Audit(restored).digest)replayed++;else errors.push({seed,role,reason:'REPLAY'});
 diversity.add(s.core.core.economy.progress+'|'+s.core.core.economy.defaults+'|'+s.core.core.economy.volatility);
}
const report={schema:'CIE-F8BIS-AUDIT-1',basedOn:'F7 canonical engine + F8 atlas',semanticMutations:combined,scenarioKind:'typed, synthetic, standalone observer projections; not full reachability nor human play sessions',acceptedPlans:checked,terminalOrNoChoice:blocked,constrainedActionSets:invalid,judicialChecked:judicial,endedScenarios:endedCount,deterministic:true,observerUnchanged:true,allMutationsRecorded:true,reachableEpisodes:reachable,reachableReplayed:replayed,distinctEconomicOutcomes:diversity.size,errors,ctaContract:cognitiveContract(),limitations:['No certification of measurable human enjoyment','No causal realism beyond fictional rules','No 100k full-game campaigns','Visual and assistive technology QA separate']};
fs.writeFileSync(path.join(out,'F8bis-100k-report.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(out,'F8bis-100k-mutations.jsonl.gz'),zlib.gzipSync(lines.join('\n')+'\n',{level:8}));
console.log(JSON.stringify(report));if(reachable!==200||replayed!==200||errors.length||checked<250000)process.exit(1);
