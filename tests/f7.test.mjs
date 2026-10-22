import test from 'node:test';import assert from 'node:assert/strict';
import {f7Initial,f7Play,f7Observe,f7FastForward,f7Audit,f7Save,f7Restore,npcResponse,f7Counterfactual,F7_MOVES} from '../src/strategy.mjs';
import {f6Observe} from '../src/reticulum.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
function prepare(seed=41,humanRole='COSTANTINO'){
 let s=f7Initial({seed,humanRole});let steps=0;
 while(s.core.core.mode==='INSTITUTIONAL'&&steps++<40){const v=f7Observe(s);const legal=v.available;if(!legal?.length)throw Error('NO_INSTITUTIONAL_ACTION');const r=f7Play(s,legal[0]);assert.equal(r.ok,true,JSON.stringify(r));s=r.session;}
 assert.equal(s.core.core.mode,'ECONOMIC');return s;
}
function run(seed,role,policy='PREFERENCE'){
 let s=prepare(seed,role);let hops=0;
 while(!s.core.core.economy.ended&&hops++<12){const o=f7Observe(s);const moves=o.strategic.moves;
 const move=policy==='DECLINE'?'DECLINE':policy==='HEARING'?'PUBLIC_HEARING': moves.includes('PROPOSE_PACT')?'PROPOSE_PACT':'PUBLIC_HEARING';
 const other=o.strategic.counterparties.find(x=>x!=='GIUDICE')??o.strategic.counterparties[0];
 const r=f7Play(s,{move,other,choice:'DELEGATE',strategy:'COOPERATE'});assert.equal(r.ok,true,JSON.stringify(r));s=r.session;
 }
 assert.ok(s.core.core.economy.ended);assert.equal(hops,8);return s;
}
test('role-specific authority, no judicial bargain over verdict',()=>{
 let s=prepare(11,'GIUDICE'),o=f7Observe(s);assert.ok(!o.strategic.moves.includes('DEMAND_CONCESSION'));assert.ok(!o.strategic.moves.includes('PROPOSE_PACT'));let r=f7Play(s,{move:'DEMAND_CONCESSION',other:'COSTANTINO',choice:'DELEGATE',strategy:'COOPERATE'});assert.equal(r.ok,false);assert.equal(r.code,'F7_UNAUTHORIZED_MOVE');
});
test('NPC agent accepts or rejects from own public observation, not private finance',()=>{
 const info={support:10,legitimacy:10,volatility:2,progress:1};const x=npcResponse({seed:15,quarter:2,actor:'COSTANTINO',counterparty:'PARLAMENTARE',move:'PROPOSE_PACT',trust:7,publicIndicators:info});assert.equal(typeof x.accepted,'boolean');
 assert.throws(()=>npcResponse({seed:15,quarter:2,actor:'COSTANTINO',counterparty:'PARLAMENTARE',move:'PROPOSE_PACT',trust:7,publicIndicators:{...info,secretBankBalance:900}}),/F7_NPC_BAD_VIEW/);
});
test('anti-ghost action: invalid counterpart, unknown field and stale move leave state intact',()=>{
 const s=prepare(8);const before=f7Audit(s).digest;
 for(const input of [{move:'PROPOSE_PACT',other:'COSTANTINO',choice:'DELEGATE',strategy:'COOPERATE'},{move:'PROPOSE_PACT',other:'PRESIDENTE',choice:'DELEGATE',strategy:'COOPERATE',insider:true},{move:'WRONG',other:'PRESIDENTE',choice:'DELEGATE',strategy:'COOPERATE'}])assert.equal(f7Play(s,input).ok,false);
 assert.equal(f7Audit(s).digest,before);
});
test('negotiation, concession, hearing and refusal have distinct effects',()=>{
 const s=prepare(25);const actor='PRESIDENTE';const m=['PROPOSE_PACT','DEMAND_CONCESSION','PUBLIC_HEARING','DECLINE'];
 const outputs=m.map(move=>f7Play(s,{move,other:actor,choice:'DELEGATE',strategy:'COOPERATE'}));
 assert.ok(outputs.every(r=>r.ok));assert.equal(new Set(outputs.map(r=>r.decision.outcome)).size>=2,true);
 assert.equal(new Set(outputs.map(r=>f7Audit(r.session).digest)).size,4);
 assert.equal(f7Counterfactual(s,'DELEGATE',actor).worldUnchanged,true);
});
test('withdrawal removes future contract and charges reputation',()=>{
 let chosen=null;
 for(let seed=0;seed<100&&!chosen;seed++){
 const s=prepare(seed);const role='COSTANTINO';for(const other of roles.filter(x=>x!==role&&x!=='GIUDICE')){
 const r=f7Play(s,{move:'PROPOSE_PACT',other,choice:'DELEGATE',strategy:'COOPERATE'});if(r.ok&&r.decision.outcome==='ACCEPTED'&&!r.session.core.core.economy.ended){chosen={s:r.session,other};break;}
 }}
 assert.ok(chosen,'A valid seeded NPC pact must be attainable');
 const before=f7Observe(chosen.s).strategic.relations[chosen.other];
 const r=f7Play(chosen.s,{move:'EXIT_PACT',other:chosen.other,choice:'DELEGATE',strategy:'COOPERATE'});
 assert.ok(r.ok);assert.equal(r.decision.outcome,'EXITED');assert.ok(f7Observe(r.session).strategic.relations[chosen.other]<before);
});
test('fast-forward stops at strategic rejection or systemic critical and replay retains it',()=>{
 let s=prepare(80,'FINANZIATORE');const r=f7FastForward(s,{quarters:4});assert.ok(r.ok);assert.ok(r.moved>=1&&r.moved<=4);const replay=f7Restore(f7Save(r.session));assert.equal(f7Audit(replay).digest,f7Audit(r.session).digest);
});
test('roles inherit identical identity of world and observation is detached',()=>{
 const seed=27;const arr=roles.map(role=>prepare(seed,role).core.core.world.worldId);assert.equal(new Set(arr).size,1);
 const s=prepare(seed);const view=f7Observe(s),d=f7Audit(s).digest;view.strategic.relations.PRESIDENTE=999;view.strategic.counterparties.push('GHOST');assert.equal(f7Audit(s).digest,d);
});
test('replay rejects tampering and retains historical legal files',()=>{
 const s=run(16,'GIUDICE','HEARING');const archive=f7Save(s),r=f7Restore(archive);
 assert.equal(f7Audit(s).digest,f7Audit(r).digest);assert.equal(r.core.core.world.justice.cases.length,s.core.core.world.justice.cases.length);
 archive.commands[archive.commands.length-1].other='GHOST';assert.throws(()=>f7Restore(archive),/REPLAY/);
});
for(const role of roles)for(let seed=0;seed<30;seed++)test('solo '+role+' seed '+seed,()=>{
 const x=run(seed,role);const restored=f7Restore(f7Save(x));assert.equal(f7Audit(restored).digest,f7Audit(x).digest);
 assert.equal(x.core.core.economy.ended,true);assert.equal(x.history.length,8);
 const oldSum=Object.values(x.core.core.world.ledger).reduce((a,b)=>a+b,0);assert.equal(oldSum,160);assert.equal(f7Audit(x).core.total,600);
});
