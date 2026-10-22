/** CIE F7: bounded-rational, non-generative, repeated-game stakeholder layer.
 * One canonical F6 world, no external data, system time, network, or hidden NPC reads.
 * NPC private preference = seeded disposition, not a read of another actor's secrets.
 */
import {f6Initial,f6Play,f6Observe,f6Audit,f6Save,F6_ACTIONS} from './reticulum.mjs';
import {f3Digest,f3Word} from './institutions.mjs';
import {ECON_CHOICES,ECON_ROLES,economicValidate} from './economy.mjs';
export const F7_RULESET='CIE-F7-1.0.0';
export const F7_MOVES=Object.freeze(['PROPOSE_PACT','DEMAND_CONCESSION','PUBLIC_HEARING','DECLINE','EXIT_PACT']);
const ALL_ROLES=ECON_ROLES;
const deep=structuredClone;
const cap=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const legalKeys=(obj,keys)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).sort().join(',')===keys.slice().sort().join(',');
const pactKey=(a,b)=>[a,b].sort().join('::');
function hash(x){return f3Digest(x);}
const clampStats=e=>{for(const k of ['support','legitimacy','production'])e[k]=cap(e[k],0,30);for(const k of ['resilience','volatility'])e[k]=cap(e[k],0,20);};
function ensureState(s){
 if(!s||s.ruleset!==F7_RULESET||!Array.isArray(s.history)||!Array.isArray(s.pacts)||!s.relations)throw Error('F7_SCHEMA');
 f6Audit(s.core);
 if(s.history.length!==s.commands.filter(c=>c.kind==='ECONOMIC').length)throw Error('F7_LOG_MISMATCH');
 const seen=new Set();for(const p of s.pacts){if(!Number.isSafeInteger(p.id)||seen.has(p.id)||!ALL_ROLES.includes(p.a)||!ALL_ROLES.includes(p.b)||p.a===p.b||!['ACTIVE','FULFILLED','BROKEN','EXITED'].includes(p.status))throw Error('F7_PACT_INVALID');seen.add(p.id);}
 for(const [k,v] of Object.entries(s.relations))if(!/^\w+::\w+$/.test(k)||!Number.isSafeInteger(v)||v<0||v>10)throw Error('F7_TRUST_INVALID');
 return true;
}
export function f7Initial({seed=41,humanRole='COSTANTINO',caseId='V4/E03'}={}){
 const core=f6Initial({seed,humanRole,caseId});const relations={};
 for(let i=0;i<ALL_ROLES.length;i++)for(let j=i+1;j<ALL_ROLES.length;j++)relations[pactKey(ALL_ROLES[i],ALL_ROLES[j])]=3+f3Word(seed,'F7',ALL_ROLES[i],ALL_ROLES[j])%4;
 const s={ruleset:F7_RULESET,core,relations,pacts:[],history:[],commands:[],calendar:[],publicEvents:[]};ensureState(s);return s;
}
function peers(s){return ALL_ROLES.filter(x=>x!==s.core.core.humanRole);}
function availableMoves(s){if(s.core.core.mode!=='ECONOMIC'||s.core.core.economy.ended)return [];
 const role=s.core.core.humanRole;const canExit=s.pacts.some(p=>p.status==='ACTIVE'&&(p.a===role||p.b===role));
 return F7_MOVES.filter(m=>(role!=='GIUDICE'||!['DEMAND_CONCESSION','PROPOSE_PACT'].includes(m))&&(m!=='EXIT_PACT'||canExit));
}
/** Information-scoped, detached view. No bank balance, sealed NPC preference, private votes, or engine refs. */
export function f7Observe(s){ensureState(s);const v=f6Observe(s.core),role=s.core.core.humanRole;
 return deep({...v,strategyRuleset:F7_RULESET,strategic:{moves:availableMoves(s),counterparties:peers(s),relations:Object.fromEntries(peers(s).map(peer=>[peer,s.relations[pactKey(role,peer)]])),activePacts:s.pacts.filter(p=>p.status==='ACTIVE'&&(p.a===role||p.b===role)).map(p=>({id:p.id,other:p.a===role?p.b:p.a,kind:p.kind,due:p.due,terms:p.terms})),publicResults:s.history.slice(-5).map(h=>({quarter:h.quarter,move:h.move,other:h.other,outcome:h.outcome,reason:h.reason,trustDelta:h.trustDelta,due:h.due})),futureCommitments:s.pacts.filter(p=>p.status==='ACTIVE'&&(p.a===role||p.b===role)).map(p=>({id:p.id,due:p.due,terms:p.terms}))}});
}
/** A counterparty's decision uses PUBLIC indicators plus their own seeded disposition and relationship. */
export function npcResponse({seed,quarter,actor,counterparty,move,trust,publicIndicators}){
 if(!ALL_ROLES.includes(actor)||!ALL_ROLES.includes(counterparty)||actor===counterparty||!['PROPOSE_PACT','DEMAND_CONCESSION'].includes(move))throw Error('F7_NPC_BAD_INPUT');
 if(!Number.isSafeInteger(seed)||!Number.isSafeInteger(quarter)||!Number.isSafeInteger(trust)||trust<0||trust>10||!legalKeys(publicIndicators,['support','legitimacy','volatility','progress']))throw Error('F7_NPC_BAD_VIEW');
 const disposition=f3Word(seed,'F7-NPC',counterparty,quarter)%7-3;
 const score=2*trust+disposition+Math.floor(publicIndicators.legitimacy/5)-Math.floor(publicIndicators.volatility/3)+(move==='DEMAND_CONCESSION'?-5:0);
 const threshold=9+(counterparty==='FINANZIATORE'?2:0)+(counterparty==='GIUDICE'?99:0);
 return {accepted:score>=threshold,score,threshold,reason:score>=threshold?'MUTUAL_BENEFIT':'RESERVATION_NOT_MET'};
}
function auditPublic(s,quarter,type,data){s.publicEvents.push({id:`S-${String(s.publicEvents.length+1).padStart(3,'0')}`,quarter,type,data:deep(data)});}
function effect(e,changes){for(const [k,v] of Object.entries(changes))e[k]+=v;clampStats(e);}
function adjustTrust(s,a,b,delta){const k=pactKey(a,b);const old=s.relations[k];s.relations[k]=cap(old+delta,0,10);return s.relations[k]-old;}
function retirePacts(s,quarter){const e=s.core.core.economy,results=[];
 for(const p of s.pacts){if(p.status!=='ACTIVE'||p.due>quarter)continue;
 const met=(e.progress>p.startProgress && e.defaults<=p.startDefaults)||(p.kind==='TRANSPARENCY'&&e.resilience>=p.startResilience);
 p.status=met?'FULFILLED':'BROKEN';p.resolved=quarter;const td=adjustTrust(s,p.a,p.b,met?2:-3);
 effect(e,met?{legitimacy:1,resilience:1}:{legitimacy:-1,volatility:1});
 const out={pactId:p.id,status:p.status,due:quarter,trustDelta:td};results.push(out);auditPublic(s,quarter,'PACT_SETTLED',out);
 }
 return results;
}
function negotiate(s,{move,other},quarter){const actor=s.core.core.humanRole,e=s.core.core.economy;
 const before=s.relations[pactKey(actor,other)];let outcome='DECLINED',reason='NO_AGREEMENT',trustDelta=0,pact=null;
 if(move==='EXIT_PACT'){
   const active=s.pacts.find(p=>p.status==='ACTIVE'&&((p.a===actor&&p.b===other)||(p.b===actor&&p.a===other)));
   if(!active)return {ok:false,code:'NO_PACT_WITH_COUNTERPARTY'};
   active.status='EXITED';active.resolved=quarter;trustDelta=adjustTrust(s,actor,other,-2);
   effect(e,{support:-1,legitimacy:-1});outcome='EXITED';reason='COSTLY_WITHDRAWAL';
 }else if(move==='PUBLIC_HEARING'){
   effect(e,{resilience:2,legitimacy:1,production:-1});trustDelta=adjustTrust(s,actor,other,1);
   outcome='HEARING_HELD';reason='PUBLIC_PROCEDURAL_SCRUTINY';
 }else if(move==='DECLINE'){
   effect(e,{resilience:1});outcome='DECLINED';reason='AUTONOMY_PRESERVED';
 }else{
   const obs={support:e.support,legitimacy:e.legitimacy,volatility:e.volatility,progress:e.progress};
   const response=npcResponse({seed:s.core.core.world.seed,quarter,actor,counterparty:other,move,trust:before,publicIndicators:obs});
   if(!response.accepted){
     trustDelta=adjustTrust(s,actor,other,move==='DEMAND_CONCESSION'?-2:-1);
     effect(e,move==='DEMAND_CONCESSION'?{volatility:2,support:-1}:{volatility:1});
     outcome='REJECTED';reason=response.reason;
   }else{
     const kind=other==='GIUDICE'||actor==='GIUDICE'?'TRANSPARENCY':'COALITION';
     // No promise of judicial judgment, no vote sale, and no free cash.
     const nextId=s.pacts.length+1;
     pact={id:nextId,a:actor,b:other,kind,due:quarter+2,startProgress:e.progress,startDefaults:e.defaults,startResilience:e.resilience,status:'ACTIVE',terms:kind==='COALITION'?'Progress-or-default milestone':'Procedural transparency milestone'};
     s.pacts.push(pact);
     trustDelta=adjustTrust(s,actor,other,move==='DEMAND_CONCESSION'?0:1);
     effect(e,move==='DEMAND_CONCESSION'?{support:3,volatility:1}:{support:2,legitimacy:1});
     outcome='ACCEPTED';reason='CONDITIONAL_NONBINDING_COMMITMENT';
   }
 }
 auditPublic(s,quarter,'STRATEGIC_DECISION',{actor,other,move,outcome,reason,pactId:pact?.id??null});
 return {ok:true,outcome,reason,trustDelta,pactId:pact?.id??null,quarter,other,move,due:pact?.due??null};
}
export function f7Play(source,input){
 if(source.core.core.mode==='INSTITUTIONAL'){
  if(typeof input!=='string')return {ok:false,code:'INSTITUTIONAL_INPUT_REQUIRED'};
  const r=f6Play(source.core,input);if(!r.ok)return r;const s=deep(source);s.core=r.session;s.commands.push({kind:'INSTITUTIONAL',choice:input});ensureState(s);return {ok:true,session:s};
 }
 if(!legalKeys(input,['move','other','choice','strategy']))return {ok:false,code:'F7_COMMAND_SHAPE'};
 if(!availableMoves(source).includes(input.move))return {ok:false,code:'F7_UNAUTHORIZED_MOVE'};
 if(!peers(source).includes(input.other))return {ok:false,code:'F7_INVALID_COUNTERPARTY'};
 if(!F6_ACTIONS.includes(input.strategy))return {ok:false,code:'F7_UNKNOWN_V9_STRATEGY'};
 if(!ECON_CHOICES[source.core.core.humanRole].includes(input.choice)&&input.choice!=='DELEGATE')return {ok:false,code:'F7_UNKNOWN_ECON_CHOICE'};
 const s=deep(source),q=s.core.core.economy.quarter;
 const response=negotiate(s,input,q);if(!response.ok)return response;
 const applied=f6Play(s.core,{choice:input.choice,strategy:input.strategy});if(!applied.ok)return applied;
 s.core=applied.session;
 const resolved=retirePacts(s,q);
 s.history.push({...response,quarter:q,settled:resolved});s.commands.push({kind:'ECONOMIC',move:input.move,other:input.other,choice:input.choice,strategy:input.strategy});
 ensureState(s);return {ok:true,session:s,decision:response,settled:resolved};
}
export function f7FastForward(source,{quarters=1,stopAtCritical=true}={}){
 if(!Number.isSafeInteger(quarters)||quarters<1||quarters>4)return {ok:false,code:'F7_SPEED_LIMIT'};
 if(source.core.core.mode!=='ECONOMIC'||source.core.core.economy.ended)return {ok:false,code:'F7_NO_ECON_TURN'};
 let s=source,moved=0,stop='LIMIT';for(let i=0;i<quarters;i++){
 if(s.core.core.economy.ended){stop='COMPLETE';break;}
 const v=f7Observe(s),other=v.strategic.counterparties.find(p=>p!=='GIUDICE')??v.strategic.counterparties[0];
 const move=v.strategic.moves.includes('PROPOSE_PACT')?'PROPOSE_PACT':'PUBLIC_HEARING';
 const r=f7Play(s,{move,other,strategy:'COOPERATE',choice:'DELEGATE'});if(!r.ok)return r;
 s=r.session;moved++;
 if(stopAtCritical&&(r.decision.outcome==='REJECTED'||r.settled.some(x=>x.status==='BROKEN')||s.core.core.economy.events.slice(-7).some(e=>['DEBT_DEFAULT','SYSTEMIC_ALERT','SUPPLY_SHOCK','FISCAL_ALERT'].includes(e.type)))){stop='STRATEGIC_OR_SYSTEMIC_EVENT';break;}
 }
 if(s.core.core.economy.ended)stop='COMPLETE';return {ok:true,session:s,moved,stop};
}
export function f7Audit(s){ensureState(s);const commitments={ACTIVE:0,FULFILLED:0,BROKEN:0,EXITED:0};for(const p of s.pacts)commitments[p.status]++;
 return {ok:true,digest:hash({ruleset:F7_RULESET,world:s.core,relations:s.relations,pacts:s.pacts,history:s.history,commands:s.commands,publicEvents:s.publicEvents}),quarters:s.history.length,commitments,core:f6Audit(s.core)};
}
export function f7Save(s){return deep({schema:'CIE-F7-REPLAY-1',seed:s.core.core.world.seed,humanRole:s.core.core.humanRole,caseId:s.core.caseId,commands:s.commands,digest:f7Audit(s).digest});}
export function f7Restore(archive){
 if(!legalKeys(archive,['schema','seed','humanRole','caseId','commands','digest'])||archive.schema!=='CIE-F7-REPLAY-1'||!Array.isArray(archive.commands)||archive.commands.length>80||typeof archive.digest!=='string')throw Error('F7_REPLAY_FORMAT');
 let s=f7Initial({seed:archive.seed,humanRole:archive.humanRole,caseId:archive.caseId});
 for(const c of archive.commands){if(!c||!['INSTITUTIONAL','ECONOMIC'].includes(c.kind))throw Error('F7_BAD_REPLAY_COMMAND');const r=c.kind==='INSTITUTIONAL'&&legalKeys(c,['kind','choice'])?f7Play(s,c.choice):c.kind==='ECONOMIC'&&legalKeys(c,['kind','move','other','choice','strategy'])?f7Play(s,{move:c.move,other:c.other,choice:c.choice,strategy:c.strategy}):{ok:false,code:'REPLAY_BAD_FIELDS'};
 if(!r.ok)throw Error('F7_REPLAY_ACTION_'+r.code);s=r.session;}
 if(f7Audit(s).digest!==archive.digest)throw Error('F7_REPLAY_MISMATCH');return s;
}
export function f7Counterfactual(s,choice,other){
 if(s.core.core.mode!=='ECONOMIC')throw Error('F7_NOT_IN_BARGAINING');
 const left=f7Play(s,{move:'PROPOSE_PACT',other,choice,strategy:'COOPERATE'}),right=f7Play(s,{move:'DECLINE',other,choice,strategy:'COOPERATE'});
 if(!left.ok||!right.ok)throw Error('F7_COUNTERFACTUAL_INVALID');
 const fields=['support','legitimacy','volatility','progress'];const e1=left.session.core.core.economy,e2=right.session.core.core.economy;
 return {assumptions:'Synthetic within-model contrast, not empirical effect identification',changes:Object.fromEntries(fields.map(k=>[k,e1[k]-e2[k]])),agreement:left.decision.outcome,worldUnchanged:f7Audit(s).digest===f7Audit(deep(s)).digest};
}
