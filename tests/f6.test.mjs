import test from 'node:test';
import assert from 'node:assert/strict';
import {f6Initial,f6Play,f6FastForward,f6Save,f6Restore,f6Audit,f6Observe,f6Counterfactual,consolidatedAccounts,V9_COUNT,F6_ACTIONS} from '../src/reticulum.mjs';
import {V9_CASES} from '../src/v9_registry.mjs';
import {f3Digest} from '../src/institutions.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
function enter(seed=41,humanRole='COSTANTINO',caseId='V4/E03'){
 let s=f6Initial({seed,humanRole,caseId}),limit=0;
 while(s.core.mode==='INSTITUTIONAL'){
  assert.ok(limit++<30,'institutional episode should converge');const view=f6Observe(s);
  const action=view.available?.[0]??'WAIT';const r=f6Play(s,action);
  assert.ok(r.ok,'legal turn '+JSON.stringify(r));s=r.session;
 }return s;
}
function finish(seed,role='COSTANTINO',caseId='V4/E03'){
 let s=enter(seed,role,caseId);while(!s.core.economy.ended){const r=f6Play(s,{choice:'DELEGATE',strategy:s.core.economy.quarter%2?'COOPERATE':'INVESTIGATE'});assert.ok(r.ok);s=r.session;}return s;
}
test('imported 1037 unique V9 source records and 37 curated originals',()=>{assert.equal(V9_COUNT,1037);assert.equal(new Set(V9_CASES.map(c=>c.uid)).size,1037);assert.equal(V9_CASES.filter(x=>x.granularity.startsWith('curated')).length,37);});
test('all 1037 V9 records are typeable into five executable domain mechanisms with falsifier',()=>{for(const c of V9_CASES){assert.ok(c.uid&&c.mechanism&&c.falsifier&&c.rights);assert.ok(['energy','procurement','finance','governance','social'].includes(c.domain));}});
test('bridge occurs once; F4 history remains immutable and combined 600 conserved',()=>{
 const s=enter();assert.equal(s.reticulum.filter(x=>x.kind==='OPENING_CROSS_BOOK_BRIDGE').length,1);assert.equal(s.core.economy.bridgeCapital,8);assert.equal(f6Audit(s).total,600);
 assert.equal(consolidatedAccounts(s).accounts.LEGACY_TREASURY,s.core.world.ledger.TESORO-8);
 let next=f6Play(s,{strategy:'COOPERATE',choice:'DELEGATE'}).session;
 assert.deepEqual(next.core.world,s.core.world);assert.equal(consolidatedAccounts(next).total,600);
});
test('observations do not leak public treasury to financier or judge',()=>{const s=enter();for(const role of ['FINANZIATORE','GIUDICE','COSTANTINO']){const v=f6Observe({...s,core:{...s.core,humanRole:role}});assert.equal(Object.hasOwn(v.consolidated,'treasury'),false)};});
test('extra fields and unknown policy denied; governance acceleration blocked',()=>{const s=enter(55,'COSTANTINO',V9_CASES.find(x=>x.domain==='governance').uid);assert.equal(f6Play(s,{choice:'DELEGATE',strategy:'ACCELERATE'}).code,'RIGHTS_OR_PHASE_GATE');assert.equal(f6Play(s,{choice:'DELEGATE',strategy:'HACK'}).ok,false);assert.equal(f6Play(s,{choice:'DELEGATE',strategy:'COOPERATE',extra:1}).code,'MALFORMED_F6_COMMAND');});
test('immutable input and counterfactual sensitivity',()=>{const s=enter();const saved=f3Digest(s);const cf=f6Counterfactual(s,'ACCELERATE','INVESTIGATE');assert.notDeepEqual(Object.values(cf.deltas),[0,0,0,0,0]);assert.equal(f3Digest(s),saved);assert.equal(s.history.length,0);});
test('T0..T5 exactly and bidirectional feedback edges',()=>{const s=finish(41);assert.equal(s.history.length,8);for(const h of s.history){assert.equal(h.stages.map(x=>x.phase).join(','),'T0,T1,T2,T3,T4,T5');assert.ok(h.stages[3].edges.includes('T1'));assert.ok(h.stages[4].edges.includes('T0'));assert.equal(h.assumptionClass,'SYNTHETIC_RULE_NOT_EMPIRICAL');}});
test('same seed replay stable, modified archives rejected',()=>{const s=finish(87,'GIUDICE');const a=f6Save(s),old=f3Digest(s);assert.equal(f3Digest(f6Restore(a)),old);assert.deepEqual(f6Save(f6Restore(a)),a);assert.throws(()=>f6Restore({...a,digest:'00000000'}),/REPLAY_MISMATCH/);assert.throws(()=>f6Restore({...a,commands:[...a.commands,{mode:'ECONOMIC',choice:'HACK',strategy:'COOPERATE'}]}));});
test('distinct policies affect real in-world socioeconomic indicators',()=>{const a=enter();const left=f6Play(a,{choice:'DELEGATE',strategy:'ACCELERATE'}),right=f6Play(a,{choice:'DELEGATE',strategy:'INVESTIGATE'});assert.ok(left.ok&&right.ok);assert.notEqual(left.session.core.economy.production,right.session.core.economy.production);assert.notEqual(left.session.core.economy.volatility,right.session.core.economy.volatility);});
test('delegated fast-forward stops after bounded critical event',()=>{const s=enter();const r=f6FastForward(s,{quarters:4,stopAtCritical:true});assert.ok(r.ok);assert.ok(r.moved>=1&&r.moved<=4);assert.ok(['LIMIT','CRITICAL_EVENT','COMPLETE'].includes(r.stop));assert.equal(f6Audit(r.session).total,600);assert.equal(f6FastForward(s,{quarters:100}).code,'SPEED_LIMIT');});
for(let i=0;i<30;i++)for(const role of roles)test(`F6 scenario role=${role} seed=${i}`,()=>{const s=finish(i,role,V9_CASES[(i*5+roles.indexOf(role))*7%1037].uid);assert.ok(s.core.economy.ended);assert.equal(s.history.length,8);assert.equal(f6Audit(s).total,600);assert.deepEqual(f6Save(f6Restore(f6Save(s))),f6Save(s));});
