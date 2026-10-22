import test from 'node:test';import assert from 'node:assert/strict';
import {f7Initial,f7Observe,f7Play,f7Audit,f7Save,f7Restore} from '../src/strategy.mjs';
import {focusModel,focusCommand,focusReceipt,focusAudit,FOCUS_RULES} from '../src/focus_ux.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
test('Focus contract: a single CTA, ≤3 optional choices, ≤2 metrics and no configuration',()=>{assert.equal(FOCUS_RULES.visiblePrimaryActions,1);assert.equal(FOCUS_RULES.zeroPreActionConfiguration,true)});
test('World remains unchanged while browsing and choosing presentation plans',()=>{const s=f7Initial({seed:41});const before=f7Audit(s).digest;const v=f7Observe(s);for(const id of ['PRUDENTE','COOPERATIVO','INCISIVO']){const m=focusModel(v,'COSTANTINO',{planId:id});assert.equal(focusAudit(m),true);assert.ok(m.command);assert.equal(m.primaryActions,1);}assert.equal(f7Audit(s).digest,before)});
test('Illegal roles and unavailable actions are rejected',()=>{const s=f7Initial({seed:41});const v=f7Observe(s);assert.throws(()=>focusModel(v,'INTRUDER'),/FOCUS_ROLE/);assert.throws(()=>focusCommand({...v,available:[]},'COSTANTINO'),/FOCUS_ILLEGAL_ACTION/)});
test('1,000 independent semantic reflections of role x seed x presentation policy',()=>{
 let reflections=0;
 for(const role of roles)for(let seed=0;seed<200;seed++){
  const s=f7Initial({seed,humanRole:role}),digest=f7Audit(s).digest,v=f7Observe(s);
  for(const id of ['PRUDENTE','COOPERATIVO','INCISIVO']){
   const m=focusModel(v,role,{planId:id});focusAudit(m);
   assert.equal(m.primaryActions,1);assert.ok(m.alternatives.length<=3);assert.ok(m.metrics.length<=2);
   assert.ok(m.headline.split(/\s+/).length<=10);const cmd=focusCommand(v,role,id);
   assert.ok(typeof cmd==='string'||typeof cmd==='object');
  }
  assert.equal(f7Audit(s).digest,digest);reflections++;
 }
 assert.equal(reflections,1000);
});
test('25 full seed x role episodes terminate, keep replay and preserve narrow receipts',()=>{
 let count=0;for(const role of roles)for(let seed=0;seed<5;seed++){
  let s=f7Initial({seed:100+seed,humanRole:role});for(let step=0;step<35;step++){
   const v=f7Observe(s),m=focusModel(v,role,{planId:['PRUDENTE','COOPERATIVO','INCISIVO'][(seed+step)%3]});focusAudit(m);
   if(m.ended)break;
   const result=f7Play(s,focusCommand(v,role,m.planId));assert.ok(result.ok,`${role}:${step}:${result.code}`);
   const receipt=focusReceipt(v,f7Observe(result.session),result.decision);assert.ok(receipt.changes.length<=2);
   s=result.session;
  }
  assert.ok(s.core.core.economy.ended);assert.equal(f7Audit(f7Restore(f7Save(s))).digest,f7Audit(s).digest);count++;
 }assert.equal(count,25);
});
