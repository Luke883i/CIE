import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newEpisode,episodeView,submitChoice,replayEpisode,episodeResult,PLAYER_ROLES} from '../episode.mjs';
import {choiceMeaning,CHOICE_RULESET} from '../choice_contract.mjs';
import {digest} from '../../convergence/ac03/src/golden_crisis.mjs';
const HOLD={kind:'HOLD',target:'NONE'};
const PRIVATE=/PRIVATE_FINANCIER|PRIVATE_DRAFT_JUDGMENT|privateNotes|pending|BANK_ACCOUNT_SECRET/;

test('EX02 visible legal choices have one scoped, explicit, non-predictive explanation',()=>{
 let e=newEpisode(41),count=0;
 for(const role of PLAYER_ROLES){
  const v=episodeView(e);assert.equal(v.role,role);
  const before=digest(e.world);
  for(const option of v.choices){
   const m=choiceMeaning(v,option.code);count++;
   assert.equal(m.schema,CHOICE_RULESET);assert.equal(m.role,role);assert.ok(m.scope&&m.cost&&m.uncertainty&&m.epistemic);
   assert.match(m.epistemic,/non è una previsione/i);
   assert.doesNotMatch(JSON.stringify(m),PRIVATE);
   assert.ok(Object.isFrozen(m));
  }
  assert.equal(digest(e.world),before,'previews are read-only');
  const next=submitChoice(e,HOLD);assert.equal(next.ok,true);e=next.episode;
 }
 assert.ok(count>=13);assert.equal(replayEpisode(e).ok,true);
});
test('EX02 rejects invalid/fabricated orders and never previews an ended game',()=>{
 const e=newEpisode(41),v=episodeView(e),original=digest(e.world);
 assert.throws(()=>choiceMeaning(v,'STAY|P-ENERGY'),/UNAUTHORIZED/);
 assert.throws(()=>choiceMeaning(v,'DEMAND_CONCESSION|P-ENERGY'),/UNAUTHORIZED/);
 assert.throws(()=>choiceMeaning({...v,role:'IMPERSONATOR'},v.choices[0].code),/SCOPE/);
 assert.throws(()=>choiceMeaning({...v,phase:'RESULT'},v.choices[0].code),/SCOPE/);
 assert.equal(digest(e.world),original);
 let full=e;for(const _ of PLAYER_ROLES){const r=submitChoice(full,HOLD);assert.equal(r.ok,true);full=r.episode;}
 assert.throws(()=>choiceMeaning(episodeView(full),'HOLD|NONE'),/SCOPE/);
});
test('EX02 financing and judicial consequences have legally scoped disclaimers',()=>{
 let e=newEpisode(41),finance,judge;
 for(const role of PLAYER_ROLES){const v=episodeView(e);
  if(role==='FINANZIATORE')finance=choiceMeaning(v,'OFFER_CREDIT|P-ENERGY');
  if(role==='GIUDICE')judge=choiceMeaning(v,'STAY|P-ENERGY');
  const r=submitChoice(e,HOLD);assert.equal(r.ok,true);e=r.episode;
 }
 assert.match(finance.cost,/debito/i);assert.match(finance.uncertainty,/non annulla/i);
 assert.match(judge.scope,/solo la rete/i);assert.match(judge.uncertainty,/non blocca automaticamente il porto/i);
});
test('EX02 preview is truthful about possible divergent outcomes, without forecasting',()=>{
 const plans=[
  {COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}},
  {COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:HOLD,GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}},
  {COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},GIUDICE:{kind:'STAY',target:'P-ENERGY'}}
 ];
 for(let seed=1;seed<=100;seed++)for(const plan of plans){
  let e=newEpisode(seed);
  for(const role of PLAYER_ROLES){const v=episodeView(e);const before=digest(e.world);
   for(const c of v.choices)choiceMeaning(v,c.code);
   assert.equal(digest(e.world),before);
   const r=submitChoice(e,plan[role]??HOLD);assert.equal(r.ok,true);e=r.episode;
  }
  assert.equal(replayEpisode(e).ok,true);
  const result=episodeResult(e);assert.equal(Object.values(result.balances).reduce((a,b)=>a+b,0),24);
  assert.equal(result.comics.every(c=>c.sourceEventIds.every(id=>result.events.some(z=>z.id===id))),true);
 }
});
