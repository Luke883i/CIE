/** AC-02 shared-turn microkernel.  A NEW isolated prototype, not the canonical CIE engine.
 * Fictional competences. No auth, DB, remote server or real private-data guarantee.
 */
import {ROLES} from './v3_immutable.mjs';
export const RULESET='CIE-AC02-LOCAL-GOLDEN-CRISIS-1';
export const CASE_ID='CASE-ENERGY-01';
export const TARGETS=Object.freeze(['P-ENERGY','P-PORT']);
const C=globalThis.structuredClone;
const fixedOrder=['GIUDICE','PARLAMENTARE','PRESIDENTE','FINANZIATORE','COSTANTINO'];
const permits={
 COSTANTINO:['EXECUTE','HOLD'],FINANZIATORE:['OFFER_CREDIT','HOLD'],
 PARLAMENTARE:['INQUIRE','HOLD'],PRESIDENTE:['CONVENE','HOLD'],GIUDICE:['STAY','REVIEW','HOLD']
};
const fixed=x=>{let h=2166136261;for(const ch of JSON.stringify(x)){h=Math.imul(h^ch.charCodeAt(0),16777619);}return (h>>>0).toString(16).padStart(8,'0');}; // not cryptographic
const total=x=>Object.values(x.balances).reduce((a,b)=>a+b,0);
const allowedTargets={EXECUTE:TARGETS,OFFER_CREDIT:TARGETS,INQUIRE:TARGETS,CONVENE:TARGETS,STAY:['P-ENERGY'],REVIEW:['P-ENERGY'],HOLD:['NONE']};
export function start({seed=41}={}){
 if(!Number.isSafeInteger(seed)||seed<0||seed>1000000)throw Error('BAD_SEED');
 return {ruleset:RULESET,seed,revision:0,quarter:1,phase:'PLANNING',balances:{TREASURY:7,FUND:8,FIRMS:9},loans:[],
  proposals:[{id:'P-ENERGY',domain:'ENERGY',cost:5,authorizingAct:'LAW-01',status:'AUTHORIZED'},
             {id:'P-PORT',domain:'MARITIME',cost:5,authorizingAct:'LAW-02',status:'AUTHORIZED'}],
  case:{id:CASE_ID,target:'P-ENERGY',status:'OPEN',admissible:true,legalBasis:'REVIEW-ENERGY-01'},
  groups:{HOSPITALS:50,PORT_WORKERS:50,HOUSEHOLDS:50},
  privateNotes:{FINANZIATORE:'PRIVATE_FINANCIER_9217_'+seed,GIUDICE:'PRIVATE_DRAFT_JUDGMENT_'+seed},
  pending:{},events:[],committed:null};
}
function commandAllowed(w,role,order){
 if(!ROLES.includes(role)||!order||typeof order!=='object'||Array.isArray(order))return false;
 if(Object.keys(order).sort().join(',')!=='kind,target')return false;
 if(!permits[role].includes(order.kind)||!allowedTargets[order.kind].includes(order.target))return false;
 if(['STAY','REVIEW'].includes(order.kind)&&(!w.case.admissible||w.case.status!=='OPEN'||w.case.target!==order.target))return false;
 return true;
}
export function choices(w,role){
 if(!ROLES.includes(role))throw Error('BAD_ROLE');
 return permits[role].flatMap(kind=>allowedTargets[kind].filter(target=>!(kind==='STAY'||kind==='REVIEW')||(w.case.admissible&&w.case.status==='OPEN')).map(target=>({kind,target})));
}
export function draft(w,{role,order,expectedRevision}={}){
 if(w?.ruleset!==RULESET||w.phase!=='PLANNING')return {ok:false,code:'PHASE_LOCKED'};
 if(!Number.isSafeInteger(expectedRevision)||expectedRevision!==w.revision)return {ok:false,code:'STALE_REVISION'};
 if(!commandAllowed(w,role,order))return {ok:false,code:'NO_COMPETENCE_OR_CASE'};
 if(Object.hasOwn(w.pending,role))return {ok:false,code:'ROLE_ALREADY_SUBMITTED'};
 const next=C(w);next.pending[role]=C(order);return {ok:true,world:next};
}
function event(w,kind,detail,refs,visibility='PUBLIC'){
 const ev={id:`EV-${String(w.events.length+1).padStart(3,'0')}`,quarter:w.quarter,kind,detail,refs:[...refs],visibility};w.events.push(ev);return ev.id;
}
function transfer(w,from,to,amount){
 if(!Number.isSafeInteger(amount)||amount<0||w.balances[from]<amount)return false;
 w.balances[from]-=amount;w.balances[to]+=amount;return true;
}
function canonicalPlan(w){return Object.fromEntries(ROLES.map(r=>[r,w.pending[r]??{kind:'HOLD',target:'NONE'}]));}
function resolveCore(w,plan){
 const before=total(w),r={blocked:[],spent:[],approved:[],loan:0,courtStay:false,worldEffects:[],resolvedRoles:[...fixedOrder]};
 // A judicial stay blocks only the admissible referenced act, NOT all investment.
 const judge=plan.GIUDICE;
 if(judge.kind==='STAY'&&judge.target===w.case.target&&w.case.status==='OPEN'&&w.case.admissible){
   w.case.status='STAYED';w.proposals.find(p=>p.id===judge.target).status='SUSPENDED';r.courtStay=true;
   event(w,'COURT_INTERIM_STAY','P-ENERGY sospeso cautelarmente su fascicolo ammissibile',[w.case.id,judge.target]);
 }else if(judge.kind==='REVIEW')event(w,'JUDICIAL_REVIEW','Fascicolo energetico in esame; nessuna sospensione automatica',[w.case.id]);
 const parl=plan.PARLAMENTARE,pres=plan.PRESIDENTE;
 if(parl.kind==='INQUIRE')event(w,'PARLIAMENTARY_INQUIRY',`Verifica parlamentare su ${parl.target}`,[parl.target]);
 if(pres.kind==='CONVENE')event(w,'PRESIDENTIAL_CONVENING',`Convocazione istituzionale su ${pres.target}`,[pres.target]);
 const financier=plan.FINANZIATORE;
 if(financier.kind==='OFFER_CREDIT'){
   const amt=5;if(transfer(w,'FUND','TREASURY',amt)){w.loans.push({creditor:'FUND',debtor:'TREASURY',principal:amt,ref:financier.target});r.loan=amt;
   event(w,'PUBLIC_CREDIT',`Credito ponte ${amt} con obbligo di rimborso`,[financier.target]);}
   else {r.blocked.push({role:'FINANZIATORE',target:financier.target,code:'FUND_INSUFFICIENT'});event(w,'CREDIT_REFUSED','Fondo insufficiente per erogare credito',[financier.target]);}
 }
 // Two public already-authorized projects compete for the SAME treasury.
 // An NPC maintenance order is deterministic and submitted separately from the human's execution.
 const citizen=plan.COSTANTINO;
 const queue=[];
 if(citizen.kind==='EXECUTE')queue.push({role:'COSTANTINO',target:citizen.target});
 queue.push({role:'NPC_MAINTENANCE',target:citizen.target==='P-PORT'?'P-ENERGY':'P-PORT'});
 // Fixed, disclosed scarcity priority: energy before port, even if submission arrival differs.
 queue.sort((a,b)=>TARGETS.indexOf(a.target)-TARGETS.indexOf(b.target));
 for(const q of queue){const p=w.proposals.find(p=>p.id===q.target);
   if(p.status==='SUSPENDED'){
     r.blocked.push({role:q.role,target:q.target,code:'JUDICIAL_STAY',caseId:w.case.id});
     event(w,'EXECUTION_BLOCKED',`${q.target}: esecuzione vietata dalla sospensione`,[w.case.id,q.target]);continue;
   }
   if(!transfer(w,'TREASURY','FIRMS',p.cost)){
     r.blocked.push({role:q.role,target:q.target,code:'TREASURY_INSUFFICIENT'});
     event(w,'EXECUTION_BLOCKED',`${q.target}: risorsa pubblica insufficiente`,[q.target]);continue;
   }
   p.status='EXECUTED';r.spent.push({role:q.role,target:q.target,amount:p.cost,act:p.authorizingAct});
   const e=event(w,'PROJECT_EXECUTED',`${q.target} eseguito, costo ${p.cost}`,[q.target,p.authorizingAct]);
   if(q.target==='P-ENERGY'){
     w.groups.HOSPITALS+=2;w.groups.HOUSEHOLDS+=1;
     r.worldEffects.push({group:'HOSPITALS',delta:2,source:e},{group:'HOUSEHOLDS',delta:1,source:e});
   }else {w.groups.PORT_WORKERS+=3;r.worldEffects.push({group:'PORT_WORKERS',delta:3,source:e});}
 }
 if(total(w)!==before)throw Error('LEDGER_NOT_CONSERVED');
 return r;
}
function publicReceipt(w,result){
 return {ruleset:RULESET,turn:w.quarter,revision:w.revision,blocked:C(result.blocked),spent:C(result.spent),loan:result.loan,
  courtStay:result.courtStay,worldEffects:C(result.worldEffects),balances:C(w.balances),loans:C(w.loans),
  events:w.events.filter(e=>e.visibility==='PUBLIC').map(e=>C(e)),nextQuarter:w.quarter+1};
}
export function commit(w,{key,expectedRevision}={}){
 if(w?.ruleset!==RULESET)return {ok:false,code:'INVALID_WORLD'};
 if(typeof key!=='string'||!/^[A-Za-z0-9-]{6,64}$/.test(key))return {ok:false,code:'BAD_IDEMPOTENCY_KEY'};
 const plan=canonicalPlan(w),planHash=fixed(plan);
 if(w.phase==='COMMITTED')return w.committed?.key===key&&w.committed?.planHash===planHash?
   {ok:true,duplicate:true,world:C(w),receipt:C(w.committed.receipt)}:{ok:false,code:'ALREADY_COMMITTED'};
 if(expectedRevision!==w.revision)return {ok:false,code:'STALE_REVISION'};
 const next=C(w);next.pending=C(plan);const r=resolveCore(next,plan),receipt=publicReceipt(next,r);
 next.phase='COMMITTED';next.revision++;next.committed={key,planHash,receipt:C(receipt),plan:C(plan),result:C(r),stateDigest:null};
 next.committed.stateDigest=digest(next,{omitSelfDigest:true});
 return {ok:true,duplicate:false,world:next,receipt:C(receipt)};
}
export function digest(w,{omitSelfDigest=false}={}){const v=C(w);if(omitSelfDigest&&v.committed)v.committed.stateDigest=null;return fixed(v);}
export function view(w,role){
 if(!ROLES.includes(role))throw Error('BAD_ROLE');
 const publicEvents=w.events.filter(e=>e.visibility==='PUBLIC').map(({visibility,...rest})=>C(rest));
 // Deliberate explicit allowlist, never spread w or w.committed/plan.
 const v={worldId:`AC02-${w.seed}`,role,quarter:w.quarter,revision:w.revision,phase:w.phase,
  treasury:w.balances.TREASURY,fundAvailable:role==='FINANZIATORE'?w.balances.FUND:null,projects:w.proposals.map(({id,domain,cost,status})=>({id,domain,cost,status})),
  caseStatus:w.case.status,groups:C(w.groups),events:publicEvents,
  available:w.phase==='PLANNING'?choices(w,role):[],selfSubmitted:Object.hasOwn(w.pending,role),
  submittedCount:Object.keys(w.pending).length,privateNote:w.privateNotes[role]??null,
  lastReceipt:w.committed?C(w.committed.receipt):null};
 return v;
}
export function comic(v){
 // Authorized public event is the only source of words (no private notes or NPC motive claims).
 const scenes=v.events.filter(e=>['COURT_INTERIM_STAY','PROJECT_EXECUTED','EXECUTION_BLOCKED','PARLIAMENTARY_INQUIRY','PUBLIC_CREDIT'].includes(e.kind)).slice(-3);
 return scenes.map((e,i)=>({id:`FRAME-${i+1}`,title:({COURT_INTERIM_STAY:'La sospensione',PROJECT_EXECUTED:'Il progetto',EXECUTION_BLOCKED:'Il blocco',PARLIAMENTARY_INQUIRY:'Il controllo',PUBLIC_CREDIT:'Il credito'})[e.kind],
  caption:e.detail,alt:`Scena simbolica: ${e.detail}`,sourceEventIds:[e.id],class:'FICTIONAL_PROJECTION'}));
}
export function verifyReplay(seed,plan,key='REPLAY-KEY-001'){
 let w=start({seed});for(const role of ROLES){const x=draft(w,{role,order:plan[role]??{kind:'HOLD',target:'NONE'},expectedRevision:0});if(!x.ok)throw Error('REPLAY_INVALID_'+x.code);w=x.world;}
 const r=commit(w,{key,expectedRevision:0});if(!r.ok)throw Error('REPLAY_COMMIT_'+r.code);
 return {world:r.world,receipt:r.receipt,digest:digest(r.world)};
}
export function replayFrom(w){if(w?.phase!=='COMMITTED'||!w.committed)throw Error('NOT_COMMITTED');const x=verifyReplay(w.seed,w.committed.plan,w.committed.key);
 if(digest(w)!==x.digest||w.committed.stateDigest!==digest(w,{omitSelfDigest:true}))throw Error('REPLAY_MISMATCH');return x;
}
