import {test} from 'node:test';import assert from 'node:assert/strict';
import {newEpisode,episodeView,submitChoice,runEpisode,episodeResult,replayEpisode,PLAYER_ROLES} from '../episode.mjs';
import {digest} from '../../convergence/ac03/src/golden_crisis.mjs';
const HOLD={kind:'HOLD',target:'NONE'};
const winning={COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},PARLAMENTARE:HOLD,PRESIDENTE:HOLD,GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}};
const stayed={...winning,GIUDICE:{kind:'STAY',target:'P-ENERGY'}};
test('EX01 beginning, role turn-taking, legal scoped available action and bounded ending',()=>{
 let ep=newEpisode(41);assert.equal(episodeView(ep).choices.every(c=>c.kind==='EXECUTE'||c.kind==='HOLD'),true);
 for(const [i,role] of PLAYER_ROLES.entries()){const v=episodeView(ep);assert.equal(v.role,role);assert.equal(v.completed,i);const o=winning[role];assert.ok(v.choices.some(c=>c.kind===o.kind&&c.target===o.target));const old=digest(ep.world);const after=submitChoice(ep,o);assert.ok(after.ok);assert.equal(digest(ep.world),old);ep=after.episode;}
 assert.equal(episodeView(ep).phase,'RESULT');assert.equal(episodeResult(ep).complete,true);assert.equal(replayEpisode(ep).ok,true);
});
test('three causal outcomes: credit scarcity, court stay, and full joint execution',()=>{
 const full=episodeResult(runEpisode(41,winning));const veto=episodeResult(runEpisode(41,stayed));const scarce=episodeResult(runEpisode(41,{...winning,FINANZIATORE:HOLD}));
 assert.equal(full.complete,true);assert.equal(veto.complete,false);assert.equal(veto.courtStay,true);assert.equal(veto.statuses['P-ENERGY'],'SUSPENDED');assert.equal(scarce.complete,false);assert.ok(scarce.blocked.some(x=>x.code==='TREASURY_INSUFFICIENT'));
 for(const result of [full,veto,scarce]){assert.equal(Object.values(result.balances).reduce((a,b)=>a+b,0),24);assert.ok(result.events.length);assert.ok(result.comics.every(c=>c.sourceEventIds.every(id=>result.events.some(e=>e.id===id))));}
});
test('an illegal role power cannot alter the world',()=>{const e=newEpisode(41),before=digest(e.world);const z=submitChoice(e,{kind:'STAY',target:'P-ENERGY'});assert.equal(z.ok,false);assert.equal(digest(e.world),before);});
test('episode result contains no private secrets and no unknown event citations',()=>{
 for(const role of PLAYER_ROLES){const e=runEpisode(24,{...winning});const result=JSON.stringify(episodeResult(e));assert.doesNotMatch(result,/PRIVATE_FINANCIER|PRIVATE_DRAFT_JUDGMENT|privateNotes|\"pending\"/);assert.equal(replayEpisode(e).ok,true);}
});
test('320 seeds x 3 divergent plans, conservation, replay and event-backed graphics',()=>{
 for(let seed=1;seed<=320;seed++)for(const plan of [winning,stayed,{...winning,FINANZIATORE:HOLD}]){
  const e=runEpisode(seed,plan),r=episodeResult(e);assert.equal(replayEpisode(e).ok,true);
  assert.equal(Object.values(r.balances).reduce((a,b)=>a+b,0),24);
  assert.ok(r.effects.every(x=>r.events.some(ev=>ev.id===x.source)));
  assert.ok(r.comics.every(x=>x.sourceEventIds.every(id=>r.events.some(ev=>ev.id===id))));
 }
});
