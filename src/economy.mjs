/** CIE-F5 Economic Pulse. Deterministic fictional accounting/gameplay runtime.
 * No Date/Math.random/fetch/timers in authoritative transition functions.
 * Always-on network simulation is explicitly a future server slice.
 */
import {f4Start,f4Play,f4Observe,f4Save,f4Restore} from './judicial.mjs';
import {f3Word,f3Digest,F3_PEOPLE} from './institutions.mjs';
export const F5_RULESET='CIE-F5-1.0.0';
export const ECON_ROLES=Object.freeze(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']);
export const ECON_CHOICES=Object.freeze({
 COSTANTINO:['BUILD_COALITION','MOBILIZE_NETWORK'],FINANZIATORE:['OFFER_CREDIT','KEEP_LIQUIDITY'],PARLAMENTARE:['AUTHORIZE_GRANT','EXAMINE_BUDGET'],PRESIDENTE:['HOST_CIVIC_DIALOGUE','REQUEST_PUBLIC_REPORT'],GIUDICE:['PUBLISH_REASONS','REVIEW_SAFEGUARDS']
});
const clone=structuredClone;
const START_CASH={TREASURY:120,HOUSEHOLDS:100,FIRMS:70,FUND:90,BANK:60};
const CASH_TOTAL=Object.values(START_CASH).reduce((a,b)=>a+b,0);
const BENEFIT={CONTRACTED:2,UNFUNDED:-1,NOT_AUTHORIZED:-1,PENDING:0};
const int=n=>Number.isSafeInteger(n);
function index(s){return s.economy;}
function event(e,type,data={},scope='PUBLIC'){e.events.push({id:'Q'+e.quarter+'-'+String(e.events.length+1).padStart(3,'0'),quarter:e.quarter,type,data:clone(data),scope});}
function transfer(e,from,to,amount,why){if(!int(amount)||amount<=0||from===to||!Object.hasOwn(e.cash,from)||!Object.hasOwn(e.cash,to)||e.cash[from]<amount) return false;
 e.cash[from]-=amount;e.cash[to]+=amount;e.journal.push({quarter:e.quarter,from,to,amount,why,sequence:e.journal.length+1});return true;}
function bond(e,amount){if(!transfer(e,'FUND','TREASURY',amount,'BOND_ISSUE'))return false;e.debt.treasury+=amount;e.debt.fundAsset+=amount;e.debt.maturities.push({due:e.quarter+2,amount,lender:'FUND'});event(e,'BOND_ISSUED',{amount},['FINANZIATORE','PARLAMENTARE','PRESIDENTE']);return true;}
function loan(e,amount){if(!transfer(e,'BANK','FIRMS',amount,'LOAN_ORIGINATION'))return false;e.debt.firms+=amount;e.debt.bankAsset+=amount;e.debt.maturities.push({due:e.quarter+2,amount,lender:'BANK'});event(e,'CREDIT_EXTENDED',{amount},['FINANZIATORE','PARLAMENTARE']);return true;}
function outcome(e,role,choice){const effect={role,choice};switch(choice){
 case 'BUILD_COALITION':e.support+=2;e.legitimacy+=1;break;
 case 'MOBILIZE_NETWORK':e.support+=4;e.legitimacy-=1;e.volatility+=1;break;
 case 'OFFER_CREDIT':if(!loan(e,8)){effect.blocked='LIQUIDITY';e.volatility+=1;}else e.production+=1;break;
 case 'KEEP_LIQUIDITY':e.resilience+=1;break;
 case 'AUTHORIZE_GRANT':if(!transfer(e,'TREASURY','FIRMS',6,'PUBLIC_GRANT')){effect.blocked='FISCAL_BUFFER';e.legitimacy-=1;}else{e.production+=2;e.support+=1;}break;
 case 'EXAMINE_BUDGET':e.resilience+=2;e.legitimacy+=1;break;
 case 'HOST_CIVIC_DIALOGUE':e.legitimacy+=2;e.support+=1;break;
 case 'REQUEST_PUBLIC_REPORT':e.resilience+=2;e.production=Math.max(0,e.production-1);break;
 case 'PUBLISH_REASONS':e.legitimacy+=2;break;
 case 'REVIEW_SAFEGUARDS':e.resilience+=2;e.support=Math.max(0,e.support-1);break;
 default:throw Error('UNKNOWN_CHOICE');}
 event(e,'ROLE_DECISION',effect,role==='FINANZIATORE'?['FINANZIATORE']: 'PUBLIC');}
function duePayments(e){for(const m of e.debt.maturities.filter(x=>x.due===e.quarter&&!x.done)){
 const who=m.lender==='BANK'?'FIRMS':'TREASURY';const counter=m.lender;const paid=transfer(e,who,counter,m.amount,'PRINCIPAL_REPAID');if(paid){if(m.lender==='BANK'){e.debt.firms-=m.amount;e.debt.bankAsset-=m.amount;}else{e.debt.treasury-=m.amount;e.debt.fundAsset-=m.amount;}}
 else {e.volatility+=2;e.legitimacy-=1;e.defaults++;}
 m.done=true;event(e,paid?'DEBT_REPAID':'DEBT_DEFAULT',{borrower:who,amount:m.amount,lender:counter});}}
function scheduled(e,seed){const weather=f3Word(seed,'F5','SHOCK',e.quarter)%10;
 if(weather===0||weather===1){e.volatility+=2;e.production=Math.max(0,e.production-1);event(e,'SUPPLY_SHOCK',{intensity:1});}
 else if(weather===9){e.production+=2;event(e,'PRODUCTIVITY_GAIN',{intensity:1});}
 const opposition=1+f3Word(seed,'F5','OPPOSITION',e.quarter)%6; e.support=Math.max(0,e.support-opposition);
 if(opposition>=5)event(e,'ORGANIZED_OPPOSITION',{pressure:opposition});
 const wage=Math.min(e.cash.FIRMS,Math.max(1,Math.floor(e.production/2)+2));transfer(e,'FIRMS','HOUSEHOLDS',wage,'WAGES');
 const taxes=Math.min(e.cash.HOUSEHOLDS,Math.max(1,Math.floor(wage/3)));transfer(e,'HOUSEHOLDS','TREASURY',taxes,'TAX');
 if(e.quarter===3&&e.cash.TREASURY<110)bond(e,12);
 duePayments(e);
 const demand=e.support+e.legitimacy-e.volatility;
 const threshold=11+Math.floor(e.quarter/3);const tranche=7+Math.floor(e.quarter/2);
 if(demand>=threshold&&e.cash.TREASURY>=tranche){transfer(e,'TREASURY','FIRMS',tranche,'PROJECT_TRANCHE');e.progress+=1;event(e,'PROJECT_ADVANCED',{progress:e.progress});}
 else event(e,'PROJECT_DELAY',{constraint:demand<threshold?'CONSENT_AND_TRUST':'BUDGET',demand,threshold});
 e.legitimacy=Math.max(0,e.legitimacy-1);
 if(e.cash.TREASURY<25)event(e,'FISCAL_ALERT',{buffer:'LOW'});
 if(e.volatility>=8)event(e,'SYSTEMIC_ALERT',{volatility:e.volatility});
 e.support=Math.max(0,Math.min(30,e.support));e.legitimacy=Math.max(0,Math.min(30,e.legitimacy));e.volatility=Math.max(0,Math.min(20,e.volatility));e.resilience=Math.max(0,Math.min(20,e.resilience));
}
function npc(e,seed,role){const options=ECON_CHOICES[role];const h=f3Word(seed,'F5','NPC',e.quarter,role);const vulnerable=e.cash.TREASURY<70||e.volatility>5;
 if(role==='PARLAMENTARE'&&vulnerable)return 'EXAMINE_BUDGET';if(role==='FINANZIATORE'&&e.cash.BANK<18)return 'KEEP_LIQUIDITY';
 return options[h%2];}
export function economicValidate(w){const e=index(w);if(!e||e.ruleset!==F5_RULESET||!int(e.quarter)||e.quarter<1||e.quarter>9)throw Error('BAD_CLOCK');
 if(Object.values(e.cash).some(x=>!int(x)||x<0)||Object.values(e.cash).reduce((a,b)=>a+b,0)!==CASH_TOTAL)throw Error('CASH_NOT_CONSERVED');
 const shadow=clone(START_CASH);for(const [i,j] of e.journal.entries()){if(j.sequence!==i+1||!int(j.amount)||j.amount<=0||shadow[j.from]<j.amount)throw Error('BAD_JOURNAL');shadow[j.from]-=j.amount;shadow[j.to]+=j.amount;}
 if(JSON.stringify(shadow)!==JSON.stringify(e.cash))throw Error('JOURNAL_NOT_RECONCILED');
 if(e.debt.firms!==e.debt.bankAsset||e.debt.treasury!==e.debt.fundAsset||Object.values(e.debt).some(v=>typeof v==='number'&&v<0))throw Error('CLAIMS_MISMATCH');
 if(e.events.some((ev,i)=>ev.id!==`Q${ev.quarter}-${String(i+1).padStart(3,'0')}`))throw Error('EVENT_SEQUENCE');
 if(e.ended!== (e.quarter===9))throw Error('END_FLAG');return true;}
export function f5Initial({seed=41,humanRole='COSTANTINO'}={}){if(!int(seed)||seed<0||seed>0xffffffff||!ECON_ROLES.includes(humanRole))throw Error('BAD_START');const old=f4Start({seed,humanRole});
 const session={schema:F5_RULESET,world:old.world,previous:old,humanRole,mode:'INSTITUTIONAL',economy:{ruleset:F5_RULESET,quarter:1,ended:false,cash:clone(START_CASH),journal:[],debt:{firms:0,bankAsset:0,treasury:0,fundAsset:0,maturities:[]},events:[],progress:0,production:4,resilience:2,support:4,legitimacy:5,volatility:2,defaults:0,decisions:[],institutionalEffect:null},commands:[]};if(old.world.terminal){session.mode='ECONOMIC';economicStart(session);}return session;}
function economicStart(s){const e=s.economy,wd=s.world.dossiers;const benefit=Object.values(wd).reduce((a,d)=>a+(BENEFIT[d.implementation]??0),0);
 e.support=Math.max(0,e.support+benefit);e.institutionalEffect={dossierA:wd.A.implementation,dossierB:wd.B.implementation,succession:s.world.mandates.find(x=>x.id==='M-P2')?.personId??null,cases:s.world.justice.cases.length};
 event(e,'INSTITUTIONAL_HANDOFF',clone(e.institutionalEffect));}
export function f5Observe(s,role=s.humanRole){if(!ECON_ROLES.includes(role))throw Error('BAD_ROLE');if(s.mode==='INSTITUTIONAL')return {mode:s.mode,role,worldId:s.world.worldId,legal:f4Observe(s.world,F3_PEOPLE[role]),available:s.previous.world.terminal?[]:f4Observe(s.world,F3_PEOPLE[role]).available.map(x=>x.kind),quarter:0};
 const e=s.economy;const publicEvents=e.events.filter(x=>x.scope==='PUBLIC'||(Array.isArray(x.scope)&&x.scope.includes(role))).map(({quarter,type,data},i)=>({id:'K'+String(i+1).padStart(3,'0'),quarter,type,data:clone(data)}));
 const privateBalances=role==='FINANZIATORE'?{fund:e.cash.FUND,bank:e.cash.BANK,fundClaims:e.debt.fundAsset,bankClaims:e.debt.bankAsset}:role==='PARLAMENTARE'||role==='PRESIDENTE'?{treasury:e.cash.TREASURY,treasuryDebt:e.debt.treasury}:{};
 return clone({mode:'ECONOMIC',worldId:s.world.worldId,role,quarter:e.quarter,ended:e.ended,progress:e.progress,production:e.production,support:e.support,legitimacy:e.legitimacy,resilience:e.resilience,volatility:e.volatility,defaults:e.defaults,privateBalances,knownEvents:publicEvents.slice(-14),choices:e.ended?[]:ECON_CHOICES[role],nextMilestones:e.debt.maturities.filter(x=>!x.done).map(x=>({due:x.due})),lastConsequences:publicEvents.slice(-5),outcome:e.ended?finalOutcome(e):null});}
export function finalOutcome(e){return e.progress>=4&&e.defaults===0?'DURABLE_PROGRESS':e.progress>=3?'FRAGILE_PROGRESS':e.defaults>0?'DEBT_CRISIS':'STALLED_REFORM';}
function economicTick(source,choice){const s=clone(source),e=s.economy;if(s.mode!=='ECONOMIC'||e.ended)return {ok:false,code:'NO_ECON_TURN'};if(!ECON_CHOICES[s.humanRole].includes(choice)&&choice!=='DELEGATE')return {ok:false,code:'INVALID_CHOICE'};
 const executed=choice==='DELEGATE'?npc(e,s.world.seed,s.humanRole):choice;
 for(const role of ECON_ROLES){outcome(e,role,role===s.humanRole?executed:npc(e,s.world.seed,role));}
 scheduled(e,s.world.seed);e.decisions.push({quarter:e.quarter,role:s.humanRole,choice,resolved:executed});e.quarter++;e.ended=e.quarter===9;if(e.ended)event(e,'CAMPAIGN_COMPLETED',{outcome:finalOutcome(e)});s.commands.push({type:'ECONOMIC',choice});economicValidate(s);return {ok:true,session:s};}
export function f5Play(s,choice){if(s.mode==='INSTITUTIONAL'){const r=f4Play(s.previous,choice);if(!r.ok)return r;const next=clone(s);next.previous=r.session;next.world=r.session.world;next.commands.push({type:'INSTITUTIONAL',choice});if(next.world.terminal){next.mode='ECONOMIC';economicStart(next);}return {ok:true,session:next};}return economicTick(s,choice);}
export function f5FastForward(source,{periods=1,stopAtCritical=true}={}){if(!int(periods)||periods<1||periods>4)return {ok:false,code:'SPEED_LIMIT'};if(source.mode!=='ECONOMIC'||source.economy.ended)return {ok:false,code:'NO_ECON_TURN'};
 let s=source;let moved=0,stop='LIMIT';for(let i=0;i<periods&&!s.economy.ended;i++){const previous=s.economy.events.length;const r=economicTick(s,'DELEGATE');if(!r.ok)return r;s=r.session;moved++;const fresh=s.economy.events.slice(previous);if(stopAtCritical&&fresh.some(x=>['DEBT_DEFAULT','SYSTEMIC_ALERT','FISCAL_ALERT','SUPPLY_SHOCK'].includes(x.type))){stop='CRITICAL_EVENT';break;}}if(s.economy.ended)stop='COMPLETE';return {ok:true,session:s,moved,stop};}
export function f5Save(s){return {schema:'CIE-F5-REPLAY-1',seed:s.world.seed,humanRole:s.humanRole,commands:clone(s.commands),digest:f3Digest({world:s.world,economy:s.economy,mode:s.mode})};}
export function f5Restore(a){if(!a||a.schema!=='CIE-F5-REPLAY-1'||!int(a.seed)||a.seed<0||a.seed>0xffffffff||!ECON_ROLES.includes(a.humanRole)||!Array.isArray(a.commands)||a.commands.length>70||Object.keys(a).sort().join(',')!=='commands,digest,humanRole,schema,seed')throw Error('INVALID_REPLAY');let s=f5Initial({seed:a.seed,humanRole:a.humanRole});for(const c of a.commands){if(!c||Object.keys(c).sort().join(',')!=='choice,type'||!['INSTITUTIONAL','ECONOMIC'].includes(c.type)||typeof c.choice!=='string')throw Error('BAD_COMMAND');if((s.mode==='INSTITUTIONAL')!==(c.type==='INSTITUTIONAL'))throw Error('BAD_PHASE');const r=f5Play(s,c.choice);if(!r.ok)throw Error('INVALID_ACTION_'+r.code);s=r.session;}if(f3Digest({world:s.world,economy:s.economy,mode:s.mode})!==a.digest)throw Error('REPLAY_MISMATCH');return s;}
export function f5Audit(s){if(s.schema!==F5_RULESET)throw Error('F5_RULESET_MISMATCH');if(s.mode==='ECONOMIC')economicValidate(s);return {mode:s.mode,quarter:s.economy.quarter,ended:s.economy.ended,cashTotal:Object.values(s.economy.cash).reduce((a,b)=>a+b,0),journalEntries:s.economy.journal.length,debtOutstanding:s.economy.debt.firms+s.economy.debt.treasury,claimOutstanding:s.economy.debt.bankAsset+s.economy.debt.fundAsset,worldId:s.world.worldId};}
