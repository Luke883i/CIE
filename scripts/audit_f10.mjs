/** 100k typed semantic observer mutations + 500 actual reachable turns. Not 100k human sessions. */
import fs from 'node:fs';import crypto from 'node:crypto';import zlib from 'node:zlib';
import {playerExperience,auditExperience,observableResult} from '../src/player_experience.mjs';
import {f7Initial,f7Play,f7Observe,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
import {decisionModel,validatePlan} from '../src/gameplay_ux.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];const buf=[];let mutated=0,validated=0,alerts=0,closed=0,changed=0;
const synthetic={choices:[['BUILD_COALITION','MOBILIZE_NETWORK'],['OFFER_CREDIT','KEEP_LIQUIDITY'],['AUTHORIZE_GRANT','EXAMINE_BUDGET'],['HOST_CIVIC_DIALOGUE','REQUEST_PUBLIC_REPORT'],['PUBLISH_REASONS','REVIEW_SAFEGUARDS']]};
for(let i=0;i<100000;i++){
 const ri=i%5,role=roles[ri],quarter=(Math.floor(i/5)%9)+1, progress=Math.floor(i/45)%9,ended=i%131===0;
 const live=(i%17===0)?'INSTITUTIONAL':'ECONOMIC';const permitted=['PUBLIC_HEARING','DECLINE'];
 const choices=ended?[]:synthetic.choices[ri].slice(0,i%97===0?1:2);
 const v={worldId:'fictional:'+Math.imul(i+1,2654435761),mode:live,quarter,progress,ended,
 support:i%31,legitimacy:(i*3)%31,volatility:(i*7)%21,
 available:ended?[]:['PASS','WAIT'],choices,
 strategic:{moves:role==='GIUDICE'?permitted:['PROPOSE_PACT','DEMAND_CONCESSION','PUBLIC_HEARING','DECLINE'],counterparties:roles.filter(r=>r!==role),publicResults:[]},
 extrasSecret:'THIS_FIELD_MUST_NOT_APPEAR',privateBalances:{bank:999999}};
 const before=JSON.stringify(v),x=playerExperience(v,role);auditExperience(x);
 if(JSON.stringify(v)!==before)throw Error('READ_MUTATION_'+i);
 if(x.metrics.length>4||x.signals.length>2||x.milestones.length!==8)throw Error('OVERLOAD_'+i);
 if(JSON.stringify(x).includes('999999')||JSON.stringify(x).includes('THIS_FIELD_MUST_NOT_APPEAR'))throw Error('LEAK_'+i);
 if(x.canAct!==(!ended&&(live==='ECONOMIC'?choices.length>0:v.available.length>0)))throw Error('CTA_STATE_'+i);
 if(x.plans.length!==(!x.canAct?0:3))throw Error('THREE_PLANS_'+i);
 for(const p of x.plans){if(!validatePlan(v,role,p))throw Error('ACTION_UNAUTHORIZED_'+i);validated++}
 if(x.signals.some(s=>s.kind==='warning'))alerts++;
 if(ended)closed++;if(progress>=1)changed++;
 if(JSON.stringify(playerExperience(v,role))!==JSON.stringify(x))throw Error('NONDETERMINISTIC_'+i);
 if(i%100===0)buf.push(JSON.stringify({i,role,mode:live,quarter,progress,ended,schema:x.schema,stage:x.stage,alert:x.signals[0].kind,actionCount:x.plans.length,proof:'PASS'}));
 mutated++;
}
let episodes=0,replays=0,multiOutcome=new Set(),errors=[];
for(let seed=0;seed<(process.env.CI?20:100);seed++)for(const role of roles){
 let s=f7Initial({seed,humanRole:role});let turns=0;
 while(turns<50){const v=f7Observe(s),x=playerExperience(v,role);if(v.ended)break;const plan=x.plans[(seed+turns)%3];if(!plan){errors.push({seed,role,reason:'MISSING_PLAN'});break}const cmd=plan.command;const r=f7Play(s,cmd.kind==='ECONOMIC'?{choice:cmd.choice,move:cmd.move,other:cmd.other,strategy:cmd.strategy}:cmd.choice);
 if(!r.ok){errors.push({seed,role,turns,code:r.code});break}
 const receipt=observableResult(v,f7Observe(r.session),r.decision);if(receipt.changes.length>3)errors.push({seed,role,reason:'DENSITY'});s=r.session;turns++;
 }
 if(!f7Observe(s).ended){errors.push({seed,role,reason:'NOT_TERMINAL'});continue}episodes++;
 if(f7Audit(s).digest===f7Audit(f7Restore(f7Save(s))).digest)replays++;else errors.push({seed,role,reason:'REPLAY'});
 multiOutcome.add(`${s.core.core.economy.progress}|${s.core.core.economy.defaults}|${s.core.core.economy.volatility}`);
}
const corpus=zlib.gzipSync(buf.join('\n')+'\n');const report={schema:'CIE-F10-AUDIT-1',base:'PR9 merge a4b6915c2a1a7469cfd8ef46c8cc1016dcfe5efa',semanticMutations:mutated,mutationKind:'100k synthetic observer-projection cases, not 100k full campaigns or human players',validatedPresets:validated,warningCases:alerts,terminalCases:closed,nonzeroProgressCases:changed,determinism:true,sourceUnchanged:true,mutationsRepresentedInCompressedSample:buf.length,fullMutationProof:'For every index 0..99999 same deterministic generator and runtime assertions; sample every 100 recorded',reachableCampaigns:episodes,exactReplays:replays,distinctEconomicOutcomes:multiOutcome.size,errors,limitations:['No human fun proven','No individual driver empirical validation','No server persistence','No real regional outcomes','No WCAG certification']};
fs.mkdirSync('proofs',{recursive:true});fs.writeFileSync('proofs/F10-audit.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync('proofs/F10-mutation-sample.jsonl.gz',corpus);report.sampleSHA256=crypto.createHash('sha256').update(corpus).digest('hex');console.log(JSON.stringify(report));if(episodes!==(process.env.CI?100:500)||replays!==episodes||errors.length||mutated!==100000)process.exit(1);
