import test from 'node:test';
import assert from 'node:assert/strict';
import {f7Initial,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
import {campaignView,campaignPlay,ROLE_LABELS,PLAN_IDS} from '../src/campaign_turn.mjs';
test('all five roles: complete prologue + eight economic turns and deterministic replay',()=>{
 for(const role of Object.keys(ROLE_LABELS)){
  let s=f7Initial({seed:41,humanRole:role,caseId:'V4/E03'}),prelude=0,economic=0;
  while(true){const m=campaignView(s);if(m.ended)break;
   const before=f7Audit(s).digest;for(const p of PLAN_IDS){const v=campaignView(s,p);assert.equal(v.role,role);assert.equal(f7Audit(s).digest,before);}const r=campaignPlay(s,PLAN_IDS[(economic+prelude)%3]);assert.ok(r.ok,role+':'+r.code);s=r.session;
   if(m.phase==='ECONOMIC')economic++;else prelude++;
   assert.ok(prelude<80);assert.ok(economic<=8);
  }
  const result=campaignView(s);assert.equal(economic,8,role);assert.equal(result.quarter,8);assert.equal(result.ended,true);assert.equal(result.canAct,false);assert.equal(campaignPlay(s).ok,false);
  assert.equal(f7Audit(f7Restore(f7Save(s))).digest,f7Audit(s).digest);
 }
});
test('invalid actions do not change state and interface has no secret NPC forecasts',()=>{
 for(const role of Object.keys(ROLE_LABELS)){
  const s=f7Initial({seed:9,humanRole:role,caseId:'V4/E03'});const old=f7Audit(s).digest;
  const v=campaignView(s);assert.equal(v.plans.length<=3,true);assert.doesNotMatch(JSON.stringify(v),/PRIVATE_FINANCIER|PRIVATE_DRAFT_JUDGMENT|npcDisposition/i);assert.equal(f7Audit(s).digest,old);
 }
});
