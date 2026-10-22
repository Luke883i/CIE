/** CIE-F6 — V9 traced, bounded, deterministic reticular gameplay.
 * Exogenous V9 claims remain hypotheses. No runtime LLM, clock, network or real-world effect inference.
 * F3 historical ledger and F5 operating ledger are bridged by a real, explicit interbook transfer.
 */
import {f5Initial,f5Play,f5Observe,f5Audit,f5FastForward,economicValidate} from './economy.mjs';
import {f3Digest,f3Audit,f3Word} from './institutions.mjs';
import {f4Audit} from './judicial.mjs';
import {V9_CASES,V9_CASE_MAP} from './v9_registry.mjs';
export const F6_RULESET='CIE-F6-1.0.0';
export const F6_ACTIONS=Object.freeze(['INVESTIGATE','COOPERATE','ACCELERATE']);
export const V9_COUNT=V9_CASES.length;
export const DOMAINS=Object.freeze({
 energy:{production:2,risk:2,distribution:1},
 procurement:{production:1,risk:2,distribution:2},
 finance:{production:1,risk:3,distribution:1},
 governance:{production:0,risk:2,distribution:2},
 social:{production:1,risk:1,distribution:3}
});
const clone=structuredClone;
const isInt=Number.isSafeInteger;
const BRIDGE_AMOUNT=8;
const HIST_KEYS={FINANZIATORE:'LEGACY_FINANCIER',INIZIATIVA:'LEGACY_INITIATIVE',IMPRESA:'LEGACY_COMPANY',TESORO:'LEGACY_TREASURY'};
const ECON_KEYS=['TREASURY','HOUSEHOLDS','FIRMS','FUND','BANK'];
function digest(s){return f3Digest({scenario:F6_RULESET,world:s.core.world,coreEconomy:s.core.economy,mode:s.core.mode,caseId:s.caseId,reticulum:s.reticulum,history:s.history,commands:s.commands});}
function doBridge(s){
 if(s.core.mode!=='ECONOMIC'||s.bridgeDone)return;
 if(s.core.world.ledger.TESORO<BRIDGE_AMOUNT)throw Error('BRIDGE_INSUFFICIENT_HISTORICAL_CASH');
 s.core.economy.bridgeCapital=BRIDGE_AMOUNT;
 s.core.economy.cash.TREASURY+=BRIDGE_AMOUNT;
 s.bridgeDone=true;
 s.reticulum.push({kind:'OPENING_CROSS_BOOK_BRIDGE',from:'LEGACY_TREASURY',to:'TREASURY',amount:BRIDGE_AMOUNT,quarter:0,causalSource:'CIE-F6-RULE'});
 economicValidate(s.core);
}
export function consolidatedAccounts(s){
 const hist=s.core.world.ledger;const econ=s.core.economy.cash;
 const accounts=Object.fromEntries(Object.entries(hist).map(([k,v])=>[HIST_KEYS[k],v-(k==='TESORO'&&s.bridgeDone?BRIDGE_AMOUNT:0)]));
 for(const k of ECON_KEYS)accounts[k]=econ[k];
 const total=Object.values(accounts).reduce((a,b)=>a+b,0);
 return {accounts,total,expected:600,bridge:s.bridgeDone?BRIDGE_AMOUNT:0,bridgeJournal:s.reticulum.filter(x=>x.kind==='OPENING_CROSS_BOOK_BRIDGE')};
}
function takeRegistryCase(caseId){const c=V9_CASE_MAP.get(caseId);if(!c)throw Error('V9_CASE_NOT_FOUND');if(!DOMAINS[c.domain])throw Error('V9_DOMAIN_UNMAPPED');return c;}
export function f6Initial({seed=41,humanRole='COSTANTINO',caseId='V4/E03'}={}){
 const c=takeRegistryCase(caseId);const s={ruleset:F6_RULESET,caseId:c.uid,core:f5Initial({seed,humanRole}),reticulum:[],history:[],commands:[],bridgeDone:false};doBridge(s);f6Audit(s);return s;
}
function permitted(s,action){
 if(s.core.mode!=='ECONOMIC'||s.core.economy.ended)return false;
 const c=takeRegistryCase(s.caseId);
 if(action==='ACCELERATE'&&['governance'].includes(c.domain))return false; // non-compensable procedural gate
 return F6_ACTIONS.includes(action);
}
export function f6Observe(s){const c=takeRegistryCase(s.caseId);const base=f5Observe(s.core);const visible=base.mode==='ECONOMIC';
 return clone({...base,model:F6_RULESET,case:{uid:c.uid,title:c.title,domain:c.domain,granularity:c.granularity,mechanism:c.mechanism,intervention:c.intervention,falsifier:c.falsifier,rights:c.rights,proofStatus:c.proof_status,evidenceLabel:'V9 hypothesis / simulated game mechanics'},actions:visible&&!base.ended?F6_ACTIONS.filter(a=>permitted(s,a)):[],reticularHistory:s.history.slice(-6).map(h=>({quarter:h.quarter,choice:h.choice,stages:h.stages,feedback:h.feedback})),consolidated:visible?{total:consolidatedAccounts(s).total,bridge:consolidatedAccounts(s).bridge,...(['PARLAMENTARE','PRESIDENTE'].includes(s.core.humanRole)?{treasury:consolidatedAccounts(s).accounts.TREASURY}:{})}:null});}
function cascade(source,choice){
 const s=clone(source),e=s.core.economy,c=takeRegistryCase(s.caseId),p=DOMAINS[c.domain];
 if(!permitted(s,choice))return {ok:false,code:'RIGHTS_OR_PHASE_GATE'};
 const q=e.quarter,noise=f3Word(e.quarter,s.core.world.seed,'F6',c.uid,'STAKEHOLDER')%3;
 const effect={support:0,legitimacy:0,resilience:0,volatility:0,production:0};
 const stages=[];
 const add=(phase,node,delta,edges)=>stages.push({phase,node,delta,edges});
 add('T0','LEGAL_DECISION',choice,['T1']);
 if(choice==='INVESTIGATE'){effect.resilience+=2;effect.legitimacy+=1;effect.production-=1;add('T1','CONTROL_RESOURCES',{resilience:2,production:-1},['T2']);}
 if(choice==='COOPERATE'){effect.support+=1+p.distribution;effect.production+=p.production;effect.volatility+=noise>1?1:0;add('T1','COALITION_CAPACITY',{support:1+p.distribution,production:p.production},['T2']);}
 if(choice==='ACCELERATE'){effect.production+=2+p.production;effect.support+=1;effect.volatility+=p.risk+noise;effect.legitimacy-=1;add('T1','ACCELERATED_EXECUTION',{production:2+p.production,volatility:p.risk+noise},['T2']);}
 add('T2','SOCIAL_DISTRIBUTION',{distribution:p.distribution,risk:p.risk},['T3']);
 const reaction=choice==='ACCELERATE'?-p.distribution:(choice==='COOPERATE'?Math.max(1,p.distribution-1):0);
 effect.support+=reaction;
 add('T3','STAKEHOLDER_RESPONSE',{support:reaction},['T1','T4']);
 const reviewRisk=choice==='ACCELERATE'&&p.risk>=2;
 if(reviewRisk){effect.legitimacy-=1;effect.resilience-=1;} else if(choice==='INVESTIGATE'){effect.resilience+=1;}
 add('T4','INDEPENDENT_REVIEW',{reviewRisk,proceduralGate:!permitted(s,'ACCELERATE')},['T0','T5']);
 add('T5','MODEL_EVALUATION',{changes:effect},[]);
 for(const [k,v] of Object.entries(effect))e[k]=Math.max(0,Math.min(k==='volatility'?20:30,e[k]+v));
 // Every policy effect is a game-model assumption. No external causal-effect claim.
 const note={id:`V9-${q}`,quarter:q,caseId:c.uid,domain:c.domain,choice,stages,feedback:{T3_T1:reaction,T4_T0:reviewRisk?'INCREASED_SCRUTINY':'NO_ESCALATION'},assumptionClass:'SYNTHETIC_RULE_NOT_EMPIRICAL',sourceProofStatus:c.proof_status};
 s.history.push(note);s.reticulum.push({kind:'V9_ACTION',quarter:q,caseId:c.uid,choice,stages:clone(stages)});
 e.events.push({id:`Q${q}-${String(e.events.length+1).padStart(3,'0')}`,quarter:q,type:'V9_POLICY_CASCADE',data:{caseId:c.uid,choice,feedback:note.feedback},scope:'PUBLIC'});
 return {ok:true,session:s,trace:note};
}
export function f6Play(source,input){
 if(source.core.mode==='INSTITUTIONAL'){
  if(typeof input!=='string')return {ok:false,code:'INSTITUTIONAL_CHOICE_REQUIRED'};
  const coreResult=f5Play(source.core,input);if(!coreResult.ok)return coreResult;
  const s=clone(source);s.core=coreResult.session;s.commands.push({mode:'INSTITUTIONAL',choice:input});doBridge(s);f6Audit(s);return {ok:true,session:s};
 }
 if(!input||typeof input!=='object'||Object.keys(input).sort().join(',')!=='choice,strategy')return {ok:false,code:'MALFORMED_F6_COMMAND'};
 const c=cascade(source,input.strategy);if(!c.ok)return c;
 const result=f5Play(c.session.core,input.choice);if(!result.ok)return result;
 const s=c.session;s.core=result.session;s.commands.push({mode:'ECONOMIC',choice:input.choice,strategy:input.strategy});f6Audit(s);return {ok:true,session:s,trace:c.trace};
}

export function f6FastForward(source,{quarters=1,stopAtCritical=true}={}){
 if(!isInt(quarters)||quarters<1||quarters>4)return {ok:false,code:'SPEED_LIMIT'};
 if(source.core.mode!=='ECONOMIC'||source.core.economy.ended)return {ok:false,code:'NO_ECON_TURN'};
 let s=source,moved=0,stop='LIMIT';for(let i=0;i<quarters&&!s.core.economy.ended;i++){
 const previous=s.core.economy.events.length;
 const strategy=permitted(s,'COOPERATE')?'COOPERATE':'INVESTIGATE';
 const r=f6Play(s,{strategy,choice:'DELEGATE'});if(!r.ok)return r;
 s=r.session;moved++;
 const latest=s.core.economy.events.slice(previous);
 if(stopAtCritical&&latest.some(x=>['DEBT_DEFAULT','SYSTEMIC_ALERT','SUPPLY_SHOCK','FISCAL_ALERT'].includes(x.type))){stop='CRITICAL_EVENT';break;}
 }if(s.core.economy.ended)stop='COMPLETE';return {ok:true,session:s,moved,stop};
}
export function f6Audit(s){if(s.ruleset!==F6_RULESET||!V9_CASE_MAP.has(s.caseId))throw Error('F6_SCHEMA');
 if(s.core.mode==='ECONOMIC')economicValidate(s.core);
 f4Audit(s.core.world);
 const a=consolidatedAccounts(s);
 if(a.total!==600||a.bridgeJournal.length!==(s.bridgeDone?1:0)||a.bridgeJournal.some(x=>x.amount!==BRIDGE_AMOUNT))throw Error('CROSS_BOOK_RECONCILIATION');
 if(s.history.length!==s.commands.filter(x=>x.mode==='ECONOMIC').length)throw Error('TRACE_COMMAND_MISMATCH');
 if(s.history.some((h,i)=>h.stages.map(x=>x.phase).join(',')!=='T0,T1,T2,T3,T4,T5'||h.quarter!==i+1||h.caseId!==s.caseId))throw Error('V9_CHAIN_INCOMPLETE');
 if(s.core.mode==='ECONOMIC'&&!s.bridgeDone)throw Error('MISSING_BRIDGE');
 return {ok:true,total:a.total,bridge:a.bridge,chains:s.history.length,consolidated:a.accounts,caseId:s.caseId,digest:digest(s)};
}
export function f6Save(s){return {schema:'CIE-F6-REPLAY-1',seed:s.core.world.seed,humanRole:s.core.humanRole,caseId:s.caseId,commands:clone(s.commands),digest:digest(s)};}
export function f6Restore(a){if(!a||Object.keys(a).sort().join(',')!=='caseId,commands,digest,humanRole,schema,seed'||a.schema!=='CIE-F6-REPLAY-1'||!Array.isArray(a.commands)||a.commands.length>70||typeof a.digest!=='string')throw Error('INVALID_F6_ARCHIVE');
 let s=f6Initial({seed:a.seed,humanRole:a.humanRole,caseId:a.caseId});
 for(const c of a.commands){let r;if(c?.mode==='INSTITUTIONAL'&&Object.keys(c).sort().join(',')==='choice,mode')r=f6Play(s,c.choice);else if(c?.mode==='ECONOMIC'&&Object.keys(c).sort().join(',')==='choice,mode,strategy')r=f6Play(s,{choice:c.choice,strategy:c.strategy});else throw Error('BAD_REPLAY_COMMAND');
 if(!r.ok)throw Error('REPLAY_REJECTED_'+r.code);s=r.session;}
 if(digest(s)!==a.digest)throw Error('REPLAY_MISMATCH');return s;
}
export function f6Counterfactual(s,strategyA='COOPERATE',strategyB='INVESTIGATE'){
 if(s.core.mode!=='ECONOMIC'||s.core.economy.ended)throw Error('COUNTERFACTUAL_OUTSIDE_QUARTER');
 const a=cascade(s,strategyA),b=cascade(s,strategyB);if(!a.ok||!b.ok)throw Error('COUNTERFACTUAL_GATE');
 const fields=['support','legitimacy','resilience','volatility','production'];
 return {caseId:s.caseId,quarter:s.core.economy.quarter,assumptions:'synthetic one-step contrast, not a causal identification on real data',strategies:[strategyA,strategyB],deltas:Object.fromEntries(fields.map(k=>[k,a.session.core.economy[k]-b.session.core.economy[k]])),stateUnchanged:digest(s)===digest(clone(s))};
}
